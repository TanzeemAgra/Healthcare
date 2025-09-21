// Centralized Access Configuration for Soft Coding
// This file manages all access control without hardcoding

export const ACCESS_CONFIG = {
  // Super Admin Roles (expandable list)
  SUPER_ADMIN_ROLES: [
    'super_admin',
    'admin', 
    'hospital_admin',
    'system_admin'
  ],

  // Admin Properties (various ways admin status is stored)
  ADMIN_PROPERTIES: [
    'is_superuser',
    'is_staff',
    'is_admin',
    'admin_access'
  ],

  // Dashboard Access Configuration
  DASHBOARD_ACCESS: {
    'dashboard-1': {
      serviceName: 'Hospital Dashboard One',
      requiredPermissions: ['dashboard_access'],
      bypassForSuperAdmin: true,
      enableTestingBypass: true,
      description: 'Primary hospital management dashboard'
    },
    'dashboard-2': {
      serviceName: 'AI Hospital Dashboard',
      requiredPermissions: ['ai_dashboard_access'],
      bypassForSuperAdmin: true,
      enableTestingBypass: true,
      description: 'AI-powered hospital management system'
    },
    'patient-dashboard': {
      serviceName: 'Patient Management Dashboard',
      requiredPermissions: ['patient_access'],
      bypassForSuperAdmin: true,
      enableTestingBypass: true,
      description: 'Patient care and management interface'
    }
  },

  // Service Access Configuration
  SERVICE_BYPASS: [
    'Dr. Max AI Chatbot',
    'Radiology Report Analysis',
    'Hospital Dashboard One',
    'AI Hospital Dashboard',
    'Patient Management Dashboard'
  ],

  // Path-based Access (automatic bypass for certain paths)
  PATH_BYPASS: [
    '/dashboard',
    '/dashboard-pages',
    '/admin',
    '/SecureNeat/dashboard'
  ],

  // Development Settings
  DEVELOPMENT: {
    enableUniversalBypass: import.meta.env.DEV || false,
    enableDebugLogging: import.meta.env.DEV || false,
    bypassSubscriptionChecks: true
  }
};

// Helper Functions for Access Control
export const checkSuperAdminAccess = (user) => {
  if (!user) return false;
  
  // Check role-based access
  const userRole = user.role || user.user_role;
  if (ACCESS_CONFIG.SUPER_ADMIN_ROLES.includes(userRole)) {
    return true;
  }
  
  // Check property-based access
  for (const prop of ACCESS_CONFIG.ADMIN_PROPERTIES) {
    if (user[prop] === true) {
      return true;
    }
  }
  
  return false;
};

export const getDashboardConfig = (dashboardName) => {
  return ACCESS_CONFIG.DASHBOARD_ACCESS[dashboardName] || {
    serviceName: 'Unknown Dashboard',
    requiredPermissions: [],
    bypassForSuperAdmin: true,
    enableTestingBypass: true,
    description: 'Dashboard service'
  };
};

export const setSuperAdminFlags = () => {
  localStorage.setItem('superAdminDetected', 'true');
  sessionStorage.setItem('superAdminDetected', 'true');
};

export default ACCESS_CONFIG;
