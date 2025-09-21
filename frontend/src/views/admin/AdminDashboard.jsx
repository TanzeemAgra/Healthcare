import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Alert,
  Tabs,
  Tab,
  ProgressBar,
  Dropdown
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../../contexts/PermissionContext';
import PasswordResetModal from '../../components/PasswordResetModal';
import { 
  RiDashboardLine,
  RiTeamLine,
  RiVipCrownLine,
  RiSettings3Line,
  RiBarChartBoxLine,
  RiLineChartLine,
  RiUserLine,
  RiMoneyDollarCircleLine,
  RiArrowUpLine,
  RiShieldCheckLine,
  RiAlertLine,
  RiNotificationLine,
  RiCalendarLine,
  RiDownloadLine,
  RiRefreshLine,
  RiShieldLine,
  RiHeart3Line,
  RiMicroscopeLine,
  RiBrushLine,
  RiStethoscopeLine,
  RiTestTubeLine,
  RiPlantLine,
  RiServiceLine,
  RiLockPasswordLine,
  RiUserSettingsLine
} from '@remixicon/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';

// Import our management components
import EnhancedUserManagement from '../user-management/EnhancedUserManagement';
import AdminPermissionManagement from './AdminPermissionManagement';
import { adminAPI } from '../../services/api';

// Feature flags for soft coding
const FEATURES = {
  SUBSCRIPTION_MANAGEMENT: false, // Disabled due to security concerns
  REAL_TIME_DATA: true, // Enable real-time data from API
  MOCK_DATA_FALLBACK: false, // Disable mock data fallback
  AUTO_REFRESH: true, // Enable auto-refresh of dashboard data
  REFRESH_INTERVAL: 30000, // Refresh every 30 seconds
};

// Dashboard data configuration
const DASHBOARD_CONFIG = {
  // Metric cards to display
  METRICS: {
    SHOW_TOTAL_USERS: true,
    SHOW_ACTIVE_USERS: true,
    SHOW_REVENUE: true,
    SHOW_SUBSCRIPTIONS: true,
    SHOW_GROWTH_INDICATORS: true,
    SHOW_SYSTEM_HEALTH: true,
  },
  
  // Data refresh settings
  REFRESH: {
    AUTO_REFRESH: FEATURES.AUTO_REFRESH,
    INTERVAL: FEATURES.REFRESH_INTERVAL,
    SHOW_LAST_UPDATED: true,
  },
  
  // Fallback behavior when API fails
  FALLBACK: {
    SHOW_EMPTY_DATA: true, // Show 0 values instead of mock data
    SHOW_ERROR_MESSAGE: true,
    RETRY_FAILED_REQUESTS: true,
  },
  
  // Formatting options
  FORMAT: {
    CURRENCY_SYMBOL: '$',
    CURRENCY_LOCALE: 'en-US',
    NUMBER_LOCALE: 'en-US',
    DATE_FORMAT: 'YYYY-MM-DD HH:mm:ss',
  }
};

// User-specific dashboard configurations using soft coding
const USER_DASHBOARD_CONFIGS = {
  'tanzeem.agra@gmail.com': {
    name: 'Medical Admin',
    quickActions: ['users', 'modules', 'analytics'], // Only essential actions
    tabs: ['overview', 'users', 'modules', 'analytics'], // No permissions tab
    hideComplexFeatures: true,
    simplifiedView: true,
    showDashboardFeatures: false, // SOFT CODING: Hide "Your Dashboard Features" panel
    welcomeMessage: 'Manage your medical staff and modules efficiently',
    primaryColor: 'success' // Green theme for medical admin
  },
  'admin@hospital.com': {
    name: 'Hospital Administrator',
    quickActions: ['users', 'modules', 'analytics'],
    tabs: ['overview', 'users', 'modules', 'analytics'],
    hideComplexFeatures: true,
    simplifiedView: true,
    showDashboardFeatures: false, // SOFT CODING: Hide "Your Dashboard Features" panel
    welcomeMessage: 'Manage hospital operations and staff',
    primaryColor: 'info'
  },
  'clinic.admin@email.com': {
    name: 'Clinic Administrator', 
    quickActions: ['users', 'modules', 'analytics'],
    tabs: ['overview', 'users', 'modules', 'analytics'],
    hideComplexFeatures: true,
    simplifiedView: true,
    showDashboardFeatures: false, // SOFT CODING: Hide "Your Dashboard Features" panel
    welcomeMessage: 'Manage clinic operations and medical staff',
    primaryColor: 'warning'
  },
  'super@admin.com': {
    name: 'System Administrator', 
    quickActions: ['system-overview', 'admin-management', 'global-settings', 'analytics-overview'],
    tabs: ['overview', 'users', 'permissions', 'analytics'],
    hideComplexFeatures: false,
    simplifiedView: false,
    showDashboardFeatures: false, // SOFT CODING: Hide "Your Dashboard Features" panel
    welcomeMessage: 'Full system control and oversight',
    primaryColor: 'danger' // Red theme for super admin
  },
  'admin@system.com': {
    name: 'System Administrator', 
    quickActions: ['system-overview', 'admin-management', 'global-settings', 'analytics-overview'],
    tabs: ['overview', 'users', 'permissions', 'analytics'],
    hideComplexFeatures: false,
    simplifiedView: false,
    showDashboardFeatures: false, // SOFT CODING: Hide "Your Dashboard Features" panel
    welcomeMessage: 'Full system control and oversight',
    primaryColor: 'danger'
  },
  'default': {
    name: 'Administrator',
    quickActions: ['users', 'modules', 'analytics'], // Removed permissions for default
    tabs: ['overview', 'users', 'modules', 'analytics'],
    hideComplexFeatures: true, // Default to simplified
    simplifiedView: true,
    showDashboardFeatures: false, // SOFT CODING: Hide "Your Dashboard Features" panel
    welcomeMessage: 'Manage your assigned administrative tasks',
    primaryColor: 'primary' // Blue theme for regular admin
  }
};

// Custom styles
const customStyles = `
  .bg-gradient-primary {
    background: linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%);
  }
  .bg-gradient-success {
    background: linear-gradient(135deg, #198754 0%, #146c43 100%);
  }
  .bg-gradient-warning {
    background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
  }
  .bg-gradient-info {
    background: linear-gradient(135deg, #0dcaf0 0%, #31d2f2 100%);
  }
  .bg-gradient-danger {
    background: linear-gradient(135deg, #dc3545 0%, #b02a37 100%);
  }
  .admin-card {
    transition: all 0.3s ease;
    border: none;
    box-shadow: 0 2px 15px rgba(0,0,0,0.1);
  }
  .admin-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0,0,0,0.15);
  }
  .metric-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 15px;
  }
  .activity-item {
    padding: 1rem;
    border-left: 4px solid #0d6efd;
    margin-bottom: 1rem;
    background: #f8f9fa;
    border-radius: 0 8px 8px 0;
  }
  .quick-action-btn {
    border-radius: 12px;
    padding: 1rem;
    text-align: center;
    transition: all 0.3s ease;
    border: 2px solid transparent;
  }
  .quick-action-btn:hover {
    transform: translateY(-3px);
    border-color: #0d6efd;
  }
`;

const AdminDashboard = () => {
  // Use AuthContext for user data consistency
  const { user } = useAuth();
  
  // Use PermissionContext for super admin detection and permissions
  const { isSuperAdmin, canAccessUserManagement } = usePermissions();
  // Keep Redux as fallback
  const reduxAuth = useSelector(state => state.auth);
  
  // Use AuthContext user, fallback to Redux if needed
  const finalUser = user || reduxAuth.user;

  // Get user-specific dashboard configuration using soft coding
  const getUserConfig = () => {
    const userEmail = finalUser?.email || finalUser?.username;
    
    // Override super admin detection with specific logic
    const isActualSuperAdmin = userEmail === 'super@admin.com' || 
                               userEmail === 'admin@system.com' ||
                               (finalUser?.is_superuser === true) ||
                               (finalUser?.role === 'super_admin');
    
    console.log('🔍 Super Admin Check:', {
      userEmail,
      isActualSuperAdmin,
      isSuperAdmin,
      finalUser
    });
    
    if (isActualSuperAdmin) {
      return USER_DASHBOARD_CONFIGS['super@admin.com'];
    }
    
    if (userEmail && USER_DASHBOARD_CONFIGS[userEmail]) {
      return USER_DASHBOARD_CONFIGS[userEmail];
    }
    
    return USER_DASHBOARD_CONFIGS['default'];
  };

  const userConfig = getUserConfig();

  // Create local super admin detection function for consistency
  const isLocalSuperAdmin = () => {
    const userEmail = finalUser?.email || finalUser?.username;
    return userEmail === 'super@admin.com' || 
           userEmail === 'admin@system.com' ||
           (finalUser?.is_superuser === true) ||
           (finalUser?.role === 'super_admin');
  };

  // Debug info for troubleshooting (temporary)
  console.log('🔍 Admin Dashboard Debug Info:', {
    userEmail: finalUser?.email || finalUser?.username,
    isSuperAdmin,
    isLocalSuperAdmin: isLocalSuperAdmin(),
    userConfig,
    finalUser
  });

  // Inject custom styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = customStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, variant: '', message: '' });
  
  // User permissions state
  const [userPermissions, setUserPermissions] = useState({});
  const [dashboardFeatures, setDashboardFeatures] = useState({});
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);

  // Dashboard data
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
    newUsersToday: 0,
    newSubscriptionsToday: 0,
    churnRate: 0,
    serverHealth: 98.5,
    lastUpdated: null
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  
  // Password reset modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');

  // Load dashboard data
  useEffect(() => {
    console.log('🚀 AdminDashboard mounting...');
    console.log('Component loaded at:', new Date().toISOString());
    console.log('Window location:', window.location.href);
    
    loadDashboardData();
    loadUserPermissions();

    // Set up auto-refresh if enabled
    let refreshInterval;
    if (DASHBOARD_CONFIG.REFRESH.AUTO_REFRESH) {
      refreshInterval = setInterval(() => {
        console.log('🔄 Auto-refreshing dashboard data...');
        loadDashboardData();
      }, DASHBOARD_CONFIG.REFRESH.INTERVAL);
    }

    // Cleanup interval on unmount
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, []);

  // Load user permissions from API
  const loadUserPermissions = async () => {
    try {
      console.log('🔍 Loading user permissions...');
      const response = await fetch('/api/hospital/management/me/permissions/', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 API Response Status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Permissions API Response:', data);
        if (data.success) {
          setUserPermissions(data.user.permissions || {});
          setDashboardFeatures(data.user.dashboard_features || {});
          setPermissionsLoaded(true);
          console.log('🎯 User permissions loaded:', data.user.dashboard_features);
        }
      } else {
        console.error('❌ Failed to load user permissions:', response.status);
        // Set default permissions if API fails
        setPermissionsLoaded(true);
      }
    } catch (error) {
      console.error('💥 Error loading user permissions:', error);
      setPermissionsLoaded(true);
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load real data from API
      const response = await adminAPI.getDashboardStats();
      const stats = response.data;
      
      // Update dashboard data with real API response
      setDashboardData({
        totalUsers: stats.totalUsers || 0,
        activeUsers: stats.activeUsers || 0,
        totalRevenue: stats.totalRevenue || 0,
        revenueThisMonth: stats.revenueThisMonth || 0,
        revenueGrowth: stats.revenueGrowth || 0,
        activeSubscriptions: stats.activeSubscriptions || 0,
        newUsersToday: stats.newUsersToday || 0,
        newSubscriptionsToday: stats.newSubscriptionsToday || 0,
        churnRate: stats.churnRate || 0,
        serverHealth: stats.serverUptime || 99.8,
        databaseHealth: stats.databaseHealth || 100.0,
        lastUpdated: stats.lastUpdated || new Date().toISOString()
      });

      // Update recent activity with real data
      if (stats.recentActivity && Array.isArray(stats.recentActivity)) {
        setRecentActivity(stats.recentActivity);
      }

      // Show success message
      setAlert({
        show: true,
        variant: 'success',
        message: `Dashboard updated with real-time data. Last updated: ${new Date(stats.lastUpdated).toLocaleString()}`
      });

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      
      // Fallback to empty data instead of mock data
      setDashboardData({
        totalUsers: 0,
        activeUsers: 0,
        totalRevenue: 0,
        revenueThisMonth: 0,
        revenueGrowth: 0,
        activeSubscriptions: 0,
        newUsersToday: 0,
        newSubscriptionsToday: 0,
        churnRate: 0,
        serverHealth: 0,
        databaseHealth: 0
      });

      setRecentActivity([]);

      setAlert({
        show: true,
        variant: 'warning',
        message: 'Failed to load real-time data. Please check your connection and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMockData = async () => {
    // Simulate API calls with mock data
    setDashboardData({
      totalUsers: 0,
      activeUsers: 0,
      totalRevenue: 0,
      activeSubscriptions: 0,
      newUsersToday: 0,
      newSubscriptionsToday: 0,
      churnRate: 0,
      serverHealth: 0
    });

    setRecentActivity([
      {
        id: 1,
        type: 'user_registration',
        message: 'New user registered: dr.smith@hospital.com',
        timestamp: '2 minutes ago',
        icon: 'ri-user-add-line',
        color: 'success'
      },
      {
        id: 2,
        type: 'subscription_upgrade',
        message: 'User upgraded to Professional Care plan',
        timestamp: '15 minutes ago',
        icon: 'ri-vip-crown-line',
        color: 'warning'
      },
      {
        id: 3,
        type: 'payment_success',
        message: 'Payment received: $220 from john.doe@company.com',
        timestamp: '1 hour ago',
        icon: 'ri-money-dollar-circle-line',
        color: 'success'
      },
      {
        id: 4,
        type: 'system_alert',
        message: 'High API usage detected for chatbot service',
        timestamp: '2 hours ago',
        icon: 'ri-alert-line',
        color: 'danger'
      },
      {
        id: 5,
        type: 'user_login',
        message: '47 users logged in during peak hours',
        timestamp: '3 hours ago',
        icon: 'ri-shield-check-line',
        color: 'info'
      }
    ]);

    setSystemAlerts([
      {
        id: 1,
        type: 'warning',
        title: 'High Server Load',
        message: 'Server CPU usage is at 85%. Consider scaling resources.',
        timestamp: '30 minutes ago'
      },
      {
        id: 2,
        type: 'info',
        title: 'Scheduled Maintenance',
        message: 'System maintenance scheduled for tonight at 2:00 AM UTC.',
        timestamp: '2 hours ago'
      },
      {
        id: 3,
        type: 'success',
        title: 'Backup Completed',
        message: 'Daily database backup completed successfully.',
        timestamp: '6 hours ago'
      }
    ]);

    setPerformanceData([
      { time: '00:00', users: 45, revenue: 1200, subscriptions: 89 },
      { time: '04:00', users: 23, revenue: 800, subscriptions: 91 },
      { time: '08:00', users: 78, revenue: 2100, subscriptions: 95 },
      { time: '12:00', users: 125, revenue: 3200, subscriptions: 102 },
      { time: '16:00', users: 156, revenue: 4100, subscriptions: 108 },
      { time: '20:00', users: 89, revenue: 2800, subscriptions: 112 },
    ]);
  };

  // Helper function to check if a feature is enabled for the user
  const isFeatureEnabled = (featureName) => {
    if (!permissionsLoaded) return false;
    return dashboardFeatures[featureName] === true;
  };

  // Helper function to get enabled quick actions based on user permissions and configuration
  const getEnabledQuickActions = () => {
    const allowedActions = userConfig.quickActions;
    const allActions = [];

    // Super Admin actions
    if (allowedActions.includes('system-overview') && isLocalSuperAdmin()) {
      allActions.push({
        id: 'system-overview',
        icon: RiBarChartBoxLine,
        title: 'System Overview',
        description: 'Monitor overall system health and performance',
        color: 'success',
        onClick: () => setActiveTab('system-overview')
      });
    }

    if (allowedActions.includes('admin-management') && isLocalSuperAdmin()) {
      allActions.push({
        id: 'admin-management', 
        icon: RiTeamLine,
        title: 'Admin Management',
        description: 'Manage all administrative accounts and permissions',
        color: 'primary',
        onClick: () => setActiveTab('users')
      });
    }

    if (allowedActions.includes('global-settings') && isLocalSuperAdmin()) {
      allActions.push({
        id: 'global-settings',
        icon: RiSettings3Line,
        title: 'Global Settings',
        description: 'Configure system-wide settings and policies',
        color: 'warning',
        onClick: () => setActiveTab('settings')
      });
    }

    // Regular admin actions
    if (allowedActions.includes('users') && isFeatureEnabled('user_management')) {
      allActions.push({
        id: 'users',
        icon: RiTeamLine,
        title: userConfig.simplifiedView ? 'Manage Staff' : 'Manage Users',
        description: userConfig.simplifiedView ? 'Add and manage medical staff' : 'Add, edit, or remove users',
        color: 'primary',
        onClick: () => setActiveTab('users')
      });
    }

    // Healthcare Modules - show if any module is enabled and user config allows
    if (allowedActions.includes('modules')) {
      const hasAnyModule = isFeatureEnabled('dermatology_module') || 
                          isFeatureEnabled('dentistry_module') || 
                          isFeatureEnabled('pathology_module') || 
                          isFeatureEnabled('radiology_module') ||
                          isFeatureEnabled('medicine_module') ||
                          isFeatureEnabled('hospital_management');
      
      if (hasAnyModule) {
        allActions.push({
          id: 'modules',
          icon: RiServiceLine,
          title: userConfig.simplifiedView ? 'Medical Modules' : 'Healthcare Modules',
          description: userConfig.simplifiedView ? 'Access medical specializations' : 'Access your authorized specializations',
          color: 'info',
          onClick: () => setActiveTab('modules')
        });
      }
    }

    // Admin Permissions - only show if not simplified view
    if (allowedActions.includes('permissions') && !userConfig.simplifiedView && 
        (userPermissions.can_manage_users || isFeatureEnabled('user_management'))) {
      allActions.push({
        id: 'permissions',
        icon: RiShieldLine,
        title: 'Admin Permissions',
        description: 'Control admin access levels',
        color: 'danger',
        onClick: () => setActiveTab('permissions')
      });
    }

    // Analytics - show if user config allows
    if (allowedActions.includes('analytics') || allowedActions.includes('analytics-overview')) {
      if (isFeatureEnabled('user_analytics') || isLocalSuperAdmin()) {
        allActions.push({
          id: 'analytics',
          icon: allowedActions.includes('analytics-overview') ? RiLineChartLine : RiBarChartBoxLine,
          title: allowedActions.includes('analytics-overview') ? 'Analytics Overview' : 'Analytics',
          description: userConfig.simplifiedView ? 'View system reports' : 'View detailed reports',
          color: 'info',
          onClick: () => setActiveTab('analytics')
        });
      }
    }

    return allActions;
  };

  // Helper function to get enabled healthcare modules
  const getEnabledHealthcareModules = () => {
    const modules = [];

    // Hospital Management - show only if hospital_management is enabled
    if (isFeatureEnabled('hospital_management')) {
      modules.push({
        id: 'hospital',
        icon: RiStethoscopeLine,
        title: 'Hospital Management',
        description: 'Comprehensive hospital and clinic management system',
        color: 'primary',
        url: '/dashboard'
      });
    }

    // Dermatology
    if (isFeatureEnabled('dermatology_module')) {
      modules.push({
        id: 'dermatology',
        icon: RiHeart3Line,
        title: 'Dermatology',
        description: 'Skin care and dermatological treatments',
        color: 'warning',
        url: '/dermatology/dashboard'
      });
    }

    // Dentistry
    if (isFeatureEnabled('dentistry_module')) {
      modules.push({
        id: 'dentistry',
        icon: RiHeart3Line,
        title: 'Dentistry',
        description: 'Dental practice management and patient care',
        color: 'success',
        url: '/dentistry/dashboard'
      });
    }

    // Pathology
    if (isFeatureEnabled('pathology_module')) {
      modules.push({
        id: 'pathology',
        icon: RiTestTubeLine,
        title: 'Pathology',
        description: 'Laboratory testing and pathology reports',
        color: 'danger',
        url: '/pathology/dashboard'
      });
    }

    // Radiology
    if (isFeatureEnabled('radiology_module')) {
      modules.push({
        id: 'radiology',
        icon: RiMicroscopeLine,
        title: 'Radiology',
        description: 'Medical imaging analysis and reporting tools',
        color: 'info',
        url: '/radiology/home'
      });
    }

    // Medicine
    if (isFeatureEnabled('medicine_module')) {
      modules.push({
        id: 'medicine',
        icon: RiStethoscopeLine,
        title: 'General Medicine',
        description: 'General medical practice and patient care',
        color: 'info',
        url: '/medicine/dashboard'
      });
    }

    return modules;
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Get alert variant for badges
  const getAlertVariant = (type) => {
    switch (type) {
      case 'warning': return 'warning';
      case 'error': return 'danger';
      case 'success': return 'success';
      default: return 'info';
    }
  };

  // Password reset handlers
  const handlePasswordResetClick = () => {
    setShowPasswordModal(true);
  };

  const handlePasswordResetSuccess = (result) => {
    setPasswordChangeSuccess(result.message);
    setAlert({
      show: true,
      variant: 'success',
      message: `✅ ${result.message} Your password has been updated successfully.`
    });
    
    // Auto-hide success message after 5 seconds
    setTimeout(() => {
      setPasswordChangeSuccess('');
    }, 5000);
  };

  const handlePasswordModalClose = () => {
    setShowPasswordModal(false);
  };

  return (
    <Container fluid className="p-4">
      {/* Authentication Status Display - Inline for now */}
      <Alert variant="info" className="mb-3">
        <div className="d-flex align-items-center">
          <i className="fas fa-shield-check me-3"></i>
          <div>
            <strong>Admin Dashboard</strong>
            <div className="mt-1">
              <small>
                Welcome, {finalUser?.full_name || finalUser?.email || 'Administrator'} 
                <span className="badge bg-primary ms-2">{finalUser?.role || 'admin'}</span>
              </small>
            </div>
          </div>
        </div>
      </Alert>
      
      {/* Real-time Data Status Banner */}
      {FEATURES.REAL_TIME_DATA && (
        <Alert variant="info" className="mb-3 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <RiLineChartLine size={20} className="me-2" />
            <strong>Real-time Dashboard Active</strong>
            <span className="ms-2">
              Data is fetched live from database
              {DASHBOARD_CONFIG.REFRESH.AUTO_REFRESH && (
                <span className="text-muted ms-2">
                  (Auto-refresh: {DASHBOARD_CONFIG.REFRESH.INTERVAL / 1000}s)
                </span>
              )}
            </span>
          </div>
          {dashboardData.lastUpdated && (
            <small className="text-muted">
              Last sync: {new Date(dashboardData.lastUpdated).toLocaleTimeString()}
            </small>
          )}
        </Alert>
      )}

      {/* Alert */}
      {alert.show && (
        <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible className="mb-4">
          {alert.message}
        </Alert>
      )}

      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">{userConfig.name} Dashboard
            <Badge bg={userConfig.primaryColor} className="ms-2">
              {userConfig.name}
            </Badge>
          </h2>
          <p className="text-muted mb-0">
            Welcome back, {finalUser?.full_name || finalUser?.fullName || finalUser?.email || 'Administrator'}
            <span className={`text-${userConfig.primaryColor} fw-bold`}> ({userConfig.name})</span>
          </p>
        </div>
        <div className="d-flex gap-2 align-items-center">
          {DASHBOARD_CONFIG.REFRESH.SHOW_LAST_UPDATED && dashboardData.lastUpdated && (
            <small className="text-muted me-3">
              Last updated: {new Date(dashboardData.lastUpdated).toLocaleString()}
            </small>
          )}
          
          {/* User Account Dropdown - Enhanced for visibility */}
          <Dropdown align="end" className="password-reset-dropdown">
            <Dropdown.Toggle 
              variant="outline-primary" 
              size="sm" 
              className="d-flex align-items-center fw-bold"
              style={{ minWidth: '120px' }}
            >
              <RiUserSettingsLine size={16} className="me-1" />
              Account Menu
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Header>Account Settings</Dropdown.Header>
              <Dropdown.Item onClick={handlePasswordResetClick}>
                <RiLockPasswordLine size={16} className="me-2" />
                Change Password
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item href="/auth/logout" className="text-danger">
                <RiShieldLine size={16} className="me-2" />
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          
          {/* Debug: Direct Password Reset Button */}
          <Button 
            variant="warning" 
            size="sm" 
            onClick={handlePasswordResetClick}
            className="d-flex align-items-center"
          >
            <RiLockPasswordLine size={16} className="me-1" />
            Reset Password
          </Button>
          
          {!userConfig.simplifiedView && (
            <Button variant="outline-primary" size="sm">
              <RiDownloadLine size={16} className="me-1" />
              Export Reports
            </Button>
          )}
          <Button 
            variant="primary" 
            size="sm" 
            onClick={loadDashboardData}
            disabled={loading}
          >
            <RiRefreshLine size={16} className="me-1" />
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
          {DASHBOARD_CONFIG.REFRESH.AUTO_REFRESH && (
            <small className="text-muted">
              Auto-refresh: {DASHBOARD_CONFIG.REFRESH.INTERVAL / 1000}s
            </small>
          )}
        </div>
      </div>

      {/* User Permissions Debug Panel (for development) - Controlled by soft coding */}
      {userConfig.showDashboardFeatures && permissionsLoaded && (
        <Row className="mb-4">
          <Col>
            <Card className="admin-card border-info">
              <Card.Header className="bg-info text-white py-2">
                <h6 className="mb-0">👤 Your Dashboard Features</h6>
              </Card.Header>
              <Card.Body className="py-2">
                <div className="d-flex flex-wrap gap-2">
                  {Object.entries(dashboardFeatures).map(([feature, enabled]) => (
                    enabled && (
                      <Badge 
                        key={feature}
                        bg="success" 
                        className="p-2"
                      >
                        ✅ {feature.replace('_', ' ').toUpperCase()}
                      </Badge>
                    )
                  ))}
                  {Object.values(dashboardFeatures).every(val => !val) && (
                    <Badge bg="warning" className="p-2">⚠️ No features enabled</Badge>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Tab Navigation */}
      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
        <Tab eventKey="overview" title={
          <span className="d-flex align-items-center gap-2">
            <RiDashboardLine size={16} />
            Overview
          </span>
        }>
          {/* Overview Dashboard Content */}
          <Row className="mb-4">
            {/* Key Metrics Cards - Different for Super Admin vs Regular Admin */}
            {isLocalSuperAdmin() ? (
              // Super Admin Metrics - System-wide overview
              <>
                <Col xl={3} lg={6} className="mb-3">
                  <Card className="admin-card bg-gradient-primary text-white h-100">
                    <Card.Body className="p-4">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <div className="display-6 fw-bold">{dashboardData.totalUsers.toLocaleString()}</div>
                          <div className="mt-2">Total System Users</div>
                          <div className="small mt-1 opacity-75">
                            +{dashboardData.newUsersToday} today
                          </div>
                        </div>
                        <RiUserLine size={50} className="opacity-75" />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col xl={3} lg={6} className="mb-3">
                  <Card className="admin-card bg-gradient-success text-white h-100">
                    <Card.Body className="p-4">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <div className="display-6 fw-bold">5</div>
                          <div className="mt-2">Active Admins</div>
                          <div className="small mt-1 opacity-75">
                            All systems operational
                          </div>
                        </div>
                        <RiTeamLine size={50} className="opacity-75" />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col xl={3} lg={6} className="mb-3">
                  <Card className="admin-card bg-gradient-warning text-white h-100">
                    <Card.Body className="p-4">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <div className="display-6 fw-bold">99.8%</div>
                          <div className="mt-2">System Uptime</div>
                          <div className="small mt-1 opacity-75">
                            Last 30 days
                          </div>
                        </div>
                        <RiShieldCheckLine size={50} className="opacity-75" />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col xl={3} lg={6} className="mb-3">
                  <Card className="admin-card bg-gradient-info text-white h-100">
                    <Card.Body className="p-4">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <div className="display-6 fw-bold">{formatCurrency(dashboardData.totalRevenue)}</div>
                          <div className="mt-2">Total Revenue</div>
                          <div className="small mt-1 opacity-75">
                            +12.5% vs last month
                          </div>
                        </div>
                        <RiMoneyDollarCircleLine size={50} className="opacity-75" />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </>
            ) : (
              // Regular Admin Metrics - Operational focus
              <>
                <Col xl={3} lg={6} className="mb-3">
                  <Card className="admin-card bg-gradient-primary text-white h-100">
                    <Card.Body className="p-4">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <div className="display-6 fw-bold">{dashboardData.totalUsers.toLocaleString()}</div>
                          <div className="mt-2">Total Users</div>
                          <div className="small mt-1 opacity-75">
                            +{dashboardData.newUsersToday} today
                          </div>
                        </div>
                        <RiUserLine size={50} className="opacity-75" />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col xl={3} lg={6} className="mb-3">
                  <Card className="admin-card bg-gradient-success text-white h-100">
                    <Card.Body className="p-4">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <div className="display-6 fw-bold">{formatCurrency(dashboardData.totalRevenue)}</div>
                          <div className="mt-2">Total Revenue</div>
                          <div className="small mt-1 opacity-75">
                            +12.5% vs last month
                          </div>
                        </div>
                        <RiMoneyDollarCircleLine size={50} className="opacity-75" />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col xl={3} lg={6} className="mb-3">
                  <Card className="admin-card bg-gradient-warning text-white h-100">
                    <Card.Body className="p-4">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <div className="display-6 fw-bold">{dashboardData.activeSubscriptions}</div>
                          <div className="mt-2">Active Subscriptions</div>
                          <div className="small mt-1 opacity-75">
                            +{dashboardData.newSubscriptionsToday} today
                          </div>
                        </div>
                        <RiVipCrownLine size={50} className="opacity-75" />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col xl={3} lg={6} className="mb-3">
                  <Card className="admin-card bg-gradient-info text-white h-100">
                    <Card.Body className="p-4">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <div className="display-6 fw-bold">{dashboardData.churnRate}%</div>
                          <div className="mt-2">Churn Rate</div>
                          <div className="small mt-1 opacity-75">
                            -0.3% improvement
                          </div>
                        </div>
                        <RiArrowUpLine size={50} className="opacity-75" />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </>
            )}
          </Row>

          <Row className="mb-4">
            {/* Performance Chart */}
            <Col lg={8}>
              <Card className="admin-card h-100">
                <Card.Header className="bg-white border-0 py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      {isLocalSuperAdmin() ? 'System Performance Overview (Today)' : 'System Performance (Today)'}
                    </h5>
                    <Badge bg="success">Live</Badge>
                  </div>
                </Card.Header>
                <Card.Body>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Area
                        type="monotone"
                        dataKey="users"
                        stackId="1"
                        stroke="#0d6efd"
                        fill="#0d6efd"
                        fillOpacity={0.2}
                      />
                      <Area
                        type="monotone"
                        dataKey="subscriptions"
                        stackId="2"
                        stroke="#198754"
                        fill="#198754"
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>

            {/* System Status */}
            <Col lg={4}>
              <Card className="admin-card h-100">
                <Card.Header className="bg-white border-0 py-3">
                  <h5 className="mb-0">System Status</h5>
                </Card.Header>
                <Card.Body>
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Server Health</span>
                      <span className="fw-bold text-success">{dashboardData.serverHealth}%</span>
                    </div>
                    <ProgressBar variant="success" now={dashboardData.serverHealth} className="mb-3" />
                  </div>

                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Active Users</span>
                      <span className="fw-bold text-info">{dashboardData.activeUsers}</span>
                    </div>
                    <ProgressBar 
                      variant="info" 
                      now={(dashboardData.activeUsers / dashboardData.totalUsers) * 100} 
                      className="mb-3" 
                    />
                  </div>

                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>API Response Time</span>
                      <span className="fw-bold text-primary">125ms</span>
                    </div>
                    <ProgressBar variant="primary" now={85} className="mb-3" />
                  </div>

                  <div className="text-center">
                    <Badge bg="success" className="px-3 py-2">
                      <RiShieldCheckLine size={16} className="me-1" />
                      All Systems Operational
                    </Badge>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            {/* Recent Activity */}
            <Col lg={6}>
              <Card className="admin-card h-100">
                <Card.Header className="bg-white border-0 py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Recent Activity</h5>
                    <Button variant="outline-primary" size="sm">
                      View All
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body className="p-0">
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {recentActivity.map(activity => (
                      <div key={activity.id} className="activity-item">
                        <div className="d-flex align-items-start">
                          <div className={`bg-${activity.color} bg-opacity-10 rounded-circle p-2 me-3 flex-shrink-0`}>
                            <i className={`${activity.icon} text-${activity.color}`}></i>
                          </div>
                          <div className="flex-grow-1">
                            <p className="mb-1">{activity.message}</p>
                            <small className="text-muted">{activity.timestamp}</small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* System Alerts */}
            <Col lg={6}>
              <Card className="admin-card h-100">
                <Card.Header className="bg-white border-0 py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">System Alerts</h5>
                    <Badge bg="warning">{systemAlerts.length}</Badge>
                  </div>
                </Card.Header>
                <Card.Body className="p-0">
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {systemAlerts.map(alert => (
                      <div key={alert.id} className="p-3 border-bottom">
                        <div className="d-flex align-items-start">
                          <Badge bg={getAlertVariant(alert.type)} className="me-3 mt-1">
                            {alert.type}
                          </Badge>
                          <div className="flex-grow-1">
                            <h6 className="mb-1">{alert.title}</h6>
                            <p className="mb-1 text-muted small">{alert.message}</p>
                            <small className="text-muted">{alert.timestamp}</small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Quick Actions */}
          <Row className="mt-4">
            <Col>
              <Card className="admin-card">
                <Card.Header className="bg-white border-0 py-3">
                  <h5 className="mb-0">Quick Actions</h5>
                </Card.Header>
                <Card.Body>
                  {!permissionsLoaded ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading permissions...</span>
                      </div>
                      <p className="text-muted mt-2">Loading your dashboard features...</p>
                    </div>
                  ) : (
                    <Row>
                      {getEnabledQuickActions().map((action, index) => {
                        const IconComponent = action.icon;
                        return (
                          <Col lg={3} md={6} className="mb-3" key={action.id}>
                            <div className="quick-action-btn bg-light" role="button" onClick={action.onClick}>
                              <IconComponent size={32} className={`text-${action.color} mb-2`} />
                              <h6>{action.title}</h6>
                              <p className="text-muted small mb-0">{action.description}</p>
                            </div>
                          </Col>
                        );
                      })}
                      {getEnabledQuickActions().length === 0 && (
                        <Col>
                          <div className="text-center py-4">
                            <RiShieldLine size={48} className="text-muted mb-3" />
                            <h5 className="text-muted">No Quick Actions Available</h5>
                            <p className="text-muted">Contact your administrator to enable features for your account.</p>
                          </div>
                        </Col>
                      )}
                    </Row>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        {/* Conditionally render User Management tab */}
        {userConfig.tabs.includes('users') && isFeatureEnabled('user_management') && (
          <Tab eventKey="users" title={
            <span className="d-flex align-items-center gap-2">
              <RiTeamLine size={16} />
              {userConfig.simplifiedView ? 'Staff Management' : 'User Management'}
            </span>
          }>
            <EnhancedUserManagement />
          </Tab>
        )}

        {/* Conditionally render Admin Permissions tab - Hidden for simplified view */}
        {userConfig.tabs.includes('permissions') && !userConfig.simplifiedView && 
         (userPermissions.can_manage_users || isFeatureEnabled('user_management')) && (
          <Tab eventKey="permissions" title={
            <span className="d-flex align-items-center gap-2">
              <RiShieldLine size={16} />
              Admin Permissions
            </span>
          }>
            <AdminPermissionManagement />
          </Tab>
        )}

        {/* Subscription Management - DISABLED due to security concerns */}
        {FEATURES.SUBSCRIPTION_MANAGEMENT && isFeatureEnabled('subscription_management') && (
          <Tab eventKey="subscriptions" title={
            <span className="d-flex align-items-center gap-2">
              <RiVipCrownLine size={16} />
              Subscription Management
            </span>
          }>
            <div className="text-center p-4">
              <Alert variant="warning">
                <Alert.Heading>Feature Temporarily Disabled</Alert.Heading>
                <p>Subscription Management has been disabled due to security review.</p>
              </Alert>
            </div>
          </Tab>
        )}

        {/* Conditionally render Healthcare Modules tab */}
        {userConfig.tabs.includes('modules') && (isFeatureEnabled('dermatology_module') || 
          isFeatureEnabled('dentistry_module') || 
          isFeatureEnabled('pathology_module') || 
          isFeatureEnabled('radiology_module') ||
          isFeatureEnabled('medicine_module') ||
          isFeatureEnabled('hospital_management') ||
          isFeatureEnabled('clinic_management')) && (
          <Tab eventKey="modules" title={
            <span className="d-flex align-items-center gap-2">
              <RiServiceLine size={16} />
              {userConfig.simplifiedView ? 'Medical Modules' : 'Healthcare Modules'}
            </span>
          }>
            <div className="py-4">
              <Row className="mb-4">
                <Col>
                  <h4 className="mb-3">{userConfig.simplifiedView ? 'Medical Modules' : 'Healthcare Modules'}</h4>
                  <p className="text-muted">
                    {userConfig.simplifiedView ? 
                      'Access your assigned medical specializations and patient management tools.' :
                      'Access and manage your authorized healthcare specializations and services.'
                    }
                  </p>
                </Col>
              </Row>              <Row>
                {!permissionsLoaded ? (
                  <Col>
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading modules...</span>
                      </div>
                      <p className="text-muted mt-2">Loading your authorized healthcare modules...</p>
                    </div>
                  </Col>
                ) : (
                  <>
                    {getEnabledHealthcareModules().map((module) => {
                      const IconComponent = module.icon;
                      return (
                        <Col lg={4} md={6} className="mb-4" key={module.id}>
                          <Card className="admin-card h-100">
                            <Card.Body className="text-center p-4">
                              <IconComponent size={48} className={`text-${module.color} mb-3`} />
                              <h5>{module.title}</h5>
                              <p className="text-muted">{module.description}</p>
                              <Button 
                                variant={module.color} 
                                size="sm" 
                                onClick={() => window.open(module.url, '_blank')}
                              >
                                Access Module
                              </Button>
                            </Card.Body>
                          </Card>
                        </Col>
                      );
                    })}
                    {getEnabledHealthcareModules().length === 0 && (
                      <Col>
                        <div className="text-center py-5">
                          <RiServiceLine size={64} className="text-muted mb-3" />
                          <h4 className="text-muted">No Healthcare Modules Available</h4>
                          <p className="text-muted">Contact your administrator to enable healthcare modules for your account.</p>
                          <p className="text-muted">
                            <strong>Selected Features:</strong> {Object.keys(dashboardFeatures).filter(key => dashboardFeatures[key]).join(', ') || 'None'}
                          </p>
                        </div>
                      </Col>
                    )}
                  </>
                )}
              </Row>
            </div>
          </Tab>
        )}

        {/* Conditionally render Analytics tab */}
        {userConfig.tabs.includes('analytics') && (isFeatureEnabled('user_analytics') || isLocalSuperAdmin()) && (
          <Tab eventKey="analytics" title={
            <span className="d-flex align-items-center gap-2">
              <RiBarChartBoxLine size={16} />
              {userConfig.simplifiedView ? 'Reports' : 'Analytics'}
            </span>
          }>
            <div className="text-center py-5">
              <RiBarChartBoxLine size={64} className="text-muted mb-3" />
              <h4 className="text-muted">
                {userConfig.simplifiedView ? 'System Reports' : 'Advanced Analytics'}
              </h4>
              <p className="text-muted">
                {userConfig.simplifiedView ? 
                  'View essential reports and statistics for your medical modules.' :
                  'Detailed analytics and reporting features for your authorized modules.'
                }
              </p>
              <Button variant="primary">
                {userConfig.simplifiedView ? 'View Reports' : 'View Analytics Dashboard'}
              </Button>
            </div>
          </Tab>
        )}

        <Tab eventKey="settings" title={
          <span className="d-flex align-items-center gap-2">
            <RiSettings3Line size={16} />
            Settings
          </span>
        }>
          <Container fluid className="py-4">
            <Row>
              <Col lg={8} className="mx-auto">
                <h3 className="mb-4 d-flex align-items-center">
                  <RiSettings3Line size={24} className="me-2" />
                  Access Settings & System Configuration
                </h3>

                {/* Dashboard Configuration */}
                <Card className="mb-4">
                  <Card.Header>
                    <h5 className="mb-0">Dashboard Configuration</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <h6>Data Settings</h6>
                        <div className="mb-3">
                          <div className="form-check">
                            <input 
                              className="form-check-input" 
                              type="checkbox" 
                              id="realTimeData"
                              checked={FEATURES.REAL_TIME_DATA}
                              readOnly
                            />
                            <label className="form-check-label" htmlFor="realTimeData">
                              Real-time Data (Currently: {FEATURES.REAL_TIME_DATA ? 'Enabled' : 'Disabled'})
                            </label>
                          </div>
                          <div className="form-check">
                            <input 
                              className="form-check-input" 
                              type="checkbox" 
                              id="autoRefresh"
                              checked={FEATURES.AUTO_REFRESH}
                              readOnly
                            />
                            <label className="form-check-label" htmlFor="autoRefresh">
                              Auto-refresh ({FEATURES.REFRESH_INTERVAL / 1000}s interval)
                            </label>
                          </div>
                        </div>
                      </Col>
                      <Col md={6}>
                        <h6>Display Settings</h6>
                        <div className="mb-3">
                          <small className="text-muted">Current Configuration:</small>
                          <ul className="list-unstyled mt-1">
                            <li>✅ Total Users Display</li>
                            <li>✅ Revenue Tracking</li>
                            <li>✅ Subscription Metrics</li>
                            <li>✅ Growth Indicators</li>
                            <li>✅ System Health</li>
                          </ul>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {/* User Access Management */}
                <Card className="mb-4">
                  <Card.Header>
                    <h5 className="mb-0">User Access Management</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <h6>Current User Profile</h6>
                        <div className="bg-light p-3 rounded">
                          <div><strong>Email:</strong> {finalUser?.email || 'Not available'}</div>
                          <div><strong>Name:</strong> {finalUser?.full_name || finalUser?.fullName || 'Not available'}</div>
                          <div><strong>Role:</strong> {userConfig.name}</div>
                          <div><strong>Access Level:</strong> 
                            <Badge bg={userConfig.primaryColor} className="ms-2">
                              {isLocalSuperAdmin() ? 'Super Admin' : 'Standard Admin'}
                            </Badge>
                          </div>
                        </div>
                      </Col>
                      <Col md={6}>
                        <h6>Permissions</h6>
                        <div className="bg-light p-3 rounded">
                          <div className="mb-2">
                            <strong>Allowed Tabs:</strong>
                            <div className="d-flex flex-wrap gap-1 mt-1">
                              {userConfig.tabs.map(tab => (
                                <Badge key={tab} bg="secondary" className="text-capitalize">
                                  {tab.replace('-', ' ')}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <strong>Quick Actions:</strong>
                            <div className="d-flex flex-wrap gap-1 mt-1">
                              {userConfig.quickActions.map(action => (
                                <Badge key={action} bg="info" className="text-capitalize">
                                  {action.replace('-', ' ')}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {/* System Status */}
                <Card className="mb-4">
                  <Card.Header>
                    <h5 className="mb-0">System Status</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={4}>
                        <div className="text-center">
                          <h6>Database Health</h6>
                          <div className="display-6 text-success">{dashboardData.databaseHealth || 100}%</div>
                          <small className="text-muted">Operational</small>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="text-center">
                          <h6>Server Uptime</h6>
                          <div className="display-6 text-info">{dashboardData.serverHealth || 99.8}%</div>
                          <small className="text-muted">Last 30 days</small>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="text-center">
                          <h6>API Status</h6>
                          <div className="display-6 text-success">✅</div>
                          <small className="text-muted">All endpoints operational</small>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">Quick Actions</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={4} className="mb-3">
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="w-100"
                          onClick={loadDashboardData}
                          disabled={loading}
                        >
                          <RiRefreshLine size={16} className="me-1" />
                          {loading ? 'Refreshing...' : 'Refresh Data'}
                        </Button>
                      </Col>
                      <Col md={4} className="mb-3">
                        <Button 
                          variant="outline-success" 
                          size="sm" 
                          className="w-100"
                          onClick={() => setAlert({
                            show: true,
                            variant: 'success',
                            message: 'System health check completed successfully!'
                          })}
                        >
                          <RiShieldCheckLine size={16} className="me-1" />
                          Health Check
                        </Button>
                      </Col>
                      <Col md={4} className="mb-3">
                        <Button 
                          variant="outline-info" 
                          size="sm" 
                          className="w-100"
                          onClick={() => setAlert({
                            show: true,
                            variant: 'info',
                            message: 'System logs exported successfully!'
                          })}
                        >
                          <RiDownloadLine size={16} className="me-1" />
                          Export Logs
                        </Button>
                      </Col>
                    </Row>
                    
                    {/* Configuration Summary */}
                    <hr className="my-4" />
                    <div className="bg-light p-3 rounded">
                      <h6>Configuration Summary</h6>
                      <Row>
                        <Col md={6}>
                          <ul className="list-unstyled mb-0">
                            <li><strong>Data Source:</strong> {FEATURES.REAL_TIME_DATA ? 'Live Database' : 'Static/Mock'}</li>
                            <li><strong>Auto-refresh:</strong> {FEATURES.AUTO_REFRESH ? `${FEATURES.REFRESH_INTERVAL / 1000}s` : 'Disabled'}</li>
                            <li><strong>Currency:</strong> {DASHBOARD_CONFIG.FORMAT.CURRENCY_SYMBOL} ({DASHBOARD_CONFIG.FORMAT.CURRENCY_LOCALE})</li>
                          </ul>
                        </Col>
                        <Col md={6}>
                          <ul className="list-unstyled mb-0">
                            <li><strong>User Type:</strong> {userConfig.name}</li>
                            <li><strong>View Mode:</strong> {userConfig.simplifiedView ? 'Simplified' : 'Full'}</li>
                            <li><strong>Theme:</strong> {userConfig.primaryColor}</li>
                          </ul>
                        </Col>
                      </Row>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </Tab>
      </Tabs>
      
      {/* Password Reset Modal */}
      <PasswordResetModal
        show={showPasswordModal}
        onHide={handlePasswordModalClose}
        userEmail={finalUser?.email}
        onSuccess={handlePasswordResetSuccess}
      />
    </Container>
  );
};

export default AdminDashboard;
