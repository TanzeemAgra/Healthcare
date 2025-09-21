import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
  Alert,
  Spinner,
  Modal,
  Form,
  Tabs,
  Tab,
  InputGroup,
  Dropdown,
  OverlayTrigger,
  Tooltip,
  ProgressBar,
  ButtonGroup,
  ListGroup
} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  RiVipCrownLine,
  RiCoinLine,
  RiCalendarLine,
  RiArrowUpLine,
  RiUserLine,
  RiSearchLine,
  RiFilterLine,
  RiDownloadLine,
  RiRefreshLine,
  RiEyeLine,
  RiEditLine,
  RiDeleteBinLine,
  RiSettings3Line,
  RiMoneyDollarCircleLine,
  RiShieldCheckLine,
  RiLogoutBoxLine,
  RiTimeLine,
  RiBarChartBoxLine,
  RiPieChartLine,
  RiFileList3Line,
  RiNotificationLine,
  RiMailSendLine,
  RiBankCardLine,
  RiRefundLine,
  RiCheckLine,
  RiCloseLine,
  RiAlertLine,
  RiStarLine,
  RiGiftLine
} from '@remixicon/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import apiClient, { adminAPI } from '../../services/api';
import { performLogout } from '../../utils/logout';

// Custom styles for enhanced UI
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
  .table-hover tbody tr:hover {
    background-color: rgba(13, 110, 253, 0.05);
    transform: translateY(-1px);
    transition: all 0.2s ease;
  }
  .card {
    transition: all 0.3s ease;
  }
  .card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.1) !important;
  }
  .plan-card {
    border: 2px solid transparent;
    transition: all 0.3s ease;
  }
  .plan-card:hover {
    border-color: #0d6efd;
    transform: translateY(-5px);
  }
  .revenue-metric {
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1;
  }
  .metric-change {
    font-size: 0.9rem;
    font-weight: 600;
  }
  .subscription-timeline {
    border-left: 3px solid #e9ecef;
    padding-left: 1rem;
  }
  .timeline-item {
    position: relative;
    margin-bottom: 1rem;
  }
  .timeline-item::before {
    content: '';
    position: absolute;
    left: -1.625rem;
    top: 0.5rem;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #0d6efd;
  }
`;

const SubscriptionManagement = () => {
  const { accessToken, user } = useSelector(state => state.auth);
  const { logout: authLogout } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Inject custom styles
  useEffect(() => {
    console.log('🔍 SubscriptionManagement component mounted');
    console.log('User:', user);
    console.log('AccessToken:', accessToken ? '✅ Present' : '❌ Missing');
    
    // Debug localStorage contents
    console.log('📦 Current localStorage contents:');
    Object.keys(localStorage).forEach(key => {
      if (key.includes('token') || key.includes('user') || key.includes('auth')) {
        console.log(`  - ${key}: ${localStorage.getItem(key) ? '✅ exists' : '❌ empty'}`);
      }
    });
    
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [alert, setAlert] = useState({ show: false, variant: '', message: '' });

  // Data states
  const [overview, setOverview] = useState({
    totalRevenue: 0,
    monthlyRecurringRevenue: 0,
    activeSubscriptions: 0,
    totalCustomers: 0,
    churnRate: 0,
    averageRevenuePerUser: 0,
    conversionRate: 0,
    retentionRate: 0
  });

  const [subscriptions, setSubscriptions] = useState([]);
  const [plans, setPlans] = useState([]);
  const [billingHistory, setBillingHistory] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [planDistribution, setPlanDistribution] = useState([]);
  const [churnAnalysis, setChurnAnalysis] = useState([]);

  // Form state for plan management
  const [planFormData, setPlanFormData] = useState({
    name: '',
    description: '',
    price_monthly: '',
    currency: 'USD',
    is_active: true,
    limit_chatbot_messages: '',
    limit_mcq_generations: '',
    limit_report_analyses: '',
    limit_document_anonymizations: ''
  });

  // Load overview data
  const loadOverviewData = async () => {
    if (!accessToken) {
      console.warn('No access token available for overview data');
      setOverview({
        totalSubscriptions: 1247,
        activeSubscriptions: 1156,
        totalRevenue: 145680,
        monthlyRecurringRevenue: 98420,
        churnRate: 3.2,
        averageRevenuePerUser: 125.50
      });
      return;
    }

    try {
      const response = await adminAPI.getOverview();
      setOverview(response.data);
    } catch (err) {
      console.warn('Subscription API unavailable - using demo mode:', err.message);
      // Fallback to demo data when API fails
      setOverview({
        totalSubscriptions: 1247,
        activeSubscriptions: 1156,
        totalRevenue: 145680,
        monthlyRecurringRevenue: 98420,
        churnRate: 3.2,
        averageRevenuePerUser: 125.50
      });
    }
  };

    // Handle logout with confirmation
  const handleLogout = async () => {
    try {
      console.log('🔄 Starting logout process...');
      
      // Confirm logout
      if (window.confirm('Are you sure you want to logout?')) {
        console.log('✅ User confirmed logout');
        await performLogout(dispatch, navigate, authLogout);
      } else {
        console.log('❌ User cancelled logout');
      }
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Force logout anyway
      localStorage.clear();
      sessionStorage.clear();
      dispatch({ type: 'auth/logout' });
      if (authLogout) authLogout();
      window.location.href = '/login';
    }
  };

  // Check if user has admin permissions
  const hasAdminAccess = () => {
    if (!user || !accessToken) return false;
    return user.is_staff || user.is_superuser || user.role === 'admin';
  };

  // Display unauthorized access message if user lacks permissions
  if (!hasAdminAccess()) {
    return (
      <div className="subscription-management-container">
        <h2>Access Denied</h2>
        <p>You don't have permission to access subscription management.</p>
        <p>Please contact an administrator for access.</p>
      </div>
    );
  }

  // Load subscription plans
  const loadSubscriptions = async () => {
    try {
      const response = await adminAPI.getSubscriptions();
      setSubscriptions(response.data.results || response.data);
    } catch (err) {
      console.error('Error loading subscriptions:', err);
      // Fallback to demo data when API fails
      setSubscriptions([
        {
          id: 1,
          user: { email: 'john.doe@company.com', first_name: 'John', last_name: 'Doe' },
          plan: { name: 'Professional Care', price_monthly: 220 },
          status: 'active',
          start_date: '2024-01-15',
          end_date: '2025-01-15',
          auto_renew: true,
          payment_gateway_subscription_id: 'sub_1234567890'
        },
        {
          id: 2,
          user: { email: 'jane.smith@hospital.com', first_name: 'Jane', last_name: 'Smith' },
          plan: { name: 'Enterprise Care', price_monthly: 330 },
          status: 'active',
          start_date: '2024-02-01',
          end_date: '2025-02-01',
          auto_renew: true,
          payment_gateway_subscription_id: 'sub_0987654321'
        }
      ]);
    }
  };

  // Load plans
  const loadPlans = async () => {
    try {
      const response = await adminAPI.getPlans();
      setPlans(response.data.results || response.data);
    } catch (err) {
      console.error('Error loading plans:', err);
      // Fallback to demo data when API fails
      setPlans([
        {
          id: 1,
          name: 'Basic Care',
          description: 'Essential healthcare management features',
          price_monthly: 120,
          currency: 'USD',
          is_active: true,
          limit_chatbot_messages: 50,
          limit_mcq_generations: 20,
          limit_report_analyses: 10,
          limit_document_anonymizations: 5
        },
        {
          id: 2,
          name: 'Professional Care',
          description: 'Advanced features for healthcare professionals',
          price_monthly: 220,
          currency: 'USD',
          is_active: true,
          limit_chatbot_messages: 200,
          limit_mcq_generations: 100,
          limit_report_analyses: 50,
          limit_document_anonymizations: 25
        }
      ]);
    }
  };

  // Load billing history
  const loadBillingHistory = async () => {
    try {
      const response = await adminAPI.getBillingHistory();
      setBillingHistory(response.data.results || response.data);
    } catch (err) {
      console.error('Error loading billing history:', err);
      // Fallback to demo data when API fails
      setBillingHistory([
        {
          id: 1,
          user: { email: 'john.doe@company.com' },
          amount_paid: 220,
          currency: 'USD',
          status: 'succeeded',
          date_paid: '2024-08-01T10:00:00Z',
          plan_name_snapshot: 'Professional Care'
        },
        {
          id: 2,
          user: { email: 'jane.smith@hospital.com' },
          amount_paid: 330,
          currency: 'USD',
          status: 'succeeded',
          date_paid: '2024-07-15T14:30:00Z',
          plan_name_snapshot: 'Enterprise Care'
        }
      ]);
    }
  };

  // Load revenue data for charts
  const loadRevenueData = async () => {
    try {
      // Mock data for revenue chart
      const mockRevenueData = [
        { month: 'Jan', revenue: 12500, subscriptions: 45 },
        { month: 'Feb', revenue: 15200, subscriptions: 52 },
        { month: 'Mar', revenue: 18800, subscriptions: 63 },
        { month: 'Apr', revenue: 22100, subscriptions: 71 },
        { month: 'May', revenue: 25600, subscriptions: 84 },
        { month: 'Jun', revenue: 28300, subscriptions: 92 },
        { month: 'Jul', revenue: 31200, subscriptions: 98 },
        { month: 'Aug', revenue: 35400, subscriptions: 106 }
      ];
      setRevenueData(mockRevenueData);

      // Mock plan distribution data
      const mockPlanDistribution = [
        { name: 'Basic Care', value: 45, color: '#0d6efd' },
        { name: 'Professional Care', value: 35, color: '#198754' },
        { name: 'Enterprise Care', value: 20, color: '#ffc107' }
      ];
      setPlanDistribution(mockPlanDistribution);

      // Mock churn analysis
      const mockChurnAnalysis = [
        { month: 'Jan', churn: 3.2, retention: 96.8 },
        { month: 'Feb', churn: 2.8, retention: 97.2 },
        { month: 'Mar', churn: 4.1, retention: 95.9 },
        { month: 'Apr', churn: 3.5, retention: 96.5 },
        { month: 'May', churn: 2.9, retention: 97.1 },
        { month: 'Jun', churn: 3.8, retention: 96.2 }
      ];
      setChurnAnalysis(mockChurnAnalysis);
    } catch (err) {
      console.error('Error loading revenue data:', err);
    }
  };

  // Load mock data
  const loadMockData = () => {
    setOverview({
      totalRevenue: 245600,
      monthlyRecurringRevenue: 35400,
      activeSubscriptions: 106,
      totalCustomers: 128,
      churnRate: 3.2,
      averageRevenuePerUser: 334,
      conversionRate: 8.5,
      retentionRate: 96.8
    });

    setSubscriptions([
      {
        id: 1,
        user: { email: 'john.doe@company.com', first_name: 'John', last_name: 'Doe' },
        plan: { name: 'Professional Care', price_monthly: 220 },
        status: 'active',
        start_date: '2024-01-15',
        end_date: '2025-01-15',
        auto_renew: true,
        payment_gateway_subscription_id: 'sub_1234567890'
      },
      {
        id: 2,
        user: { email: 'jane.smith@hospital.com', first_name: 'Jane', last_name: 'Smith' },
        plan: { name: 'Enterprise Care', price_monthly: 330 },
        status: 'active',
        start_date: '2024-02-01',
        end_date: '2025-02-01',
        auto_renew: true,
        payment_gateway_subscription_id: 'sub_0987654321'
      }
    ]);

    setPlans([
      {
        id: 1,
        name: 'Basic Care',
        description: 'Essential healthcare management features',
        price_monthly: 120,
        currency: 'USD',
        is_active: true,
        limit_chatbot_messages: 50,
        limit_mcq_generations: 20,
        limit_report_analyses: 10,
        limit_document_anonymizations: 5
      },
      {
        id: 2,
        name: 'Professional Care',
        description: 'Advanced features for healthcare professionals',
        price_monthly: 220,
        currency: 'USD',
        is_active: true,
        limit_chatbot_messages: 200,
        limit_mcq_generations: 100,
        limit_report_analyses: 50,
        limit_document_anonymizations: 25
      }
    ]);

    setBillingHistory([
      {
        id: 1,
        user: { email: 'john.doe@company.com' },
        amount_paid: 220,
        currency: 'USD',
        status: 'succeeded',
        date_paid: '2024-08-01T10:00:00Z',
        plan_name_snapshot: 'Professional Care'
      }
    ]);
  };

  // Load all dashboard data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadOverviewData(),
        loadSubscriptions(),
        loadPlans(),
        loadBillingHistory(),
        loadRevenueData()
      ]);
    } catch (err) {
      console.warn('Error loading dashboard data, using demo mode:', err.message);
      loadMockData();
      setAlert({ 
        show: true, 
        variant: 'warning', 
        message: 'Using demo data - API connection failed.' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter subscriptions
  const filteredSubscriptions = subscriptions.filter(subscription => {
    const searchMatch = !searchTerm || 
      subscription.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${subscription.user.first_name} ${subscription.user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const planMatch = !selectedPlan || subscription.plan.name === selectedPlan;
    const statusMatch = !selectedStatus || subscription.status === selectedStatus;
    
    return searchMatch && planMatch && statusMatch;
  });

  // Handle plan creation/update
  const handlePlanSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (modalType === 'create-plan') {
        await adminAPI.createPlan(planFormData);
        setAlert({ show: true, variant: 'success', message: 'Plan created successfully!' });
      } else if (modalType === 'edit-plan') {
        await adminAPI.updatePlan(selectedSubscription.id, planFormData);
        setAlert({ show: true, variant: 'success', message: 'Plan updated successfully!' });
      }
      
      loadPlans();
      closeModal();
    } catch (err) {
      setAlert({ 
        show: true, 
        variant: 'danger', 
        message: 'Failed to save plan' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle subscription actions
  const handleSubscriptionAction = async (action, subscriptionId) => {
    try {
      await adminAPI.subscriptionAction({
        action,
        subscription_id: subscriptionId
      });
      
      setAlert({ 
        show: true, 
        variant: 'success', 
        message: `Subscription ${action}ed successfully!` 
      });
      
      loadSubscriptions();
    } catch (err) {
      setAlert({ 
        show: true, 
        variant: 'danger', 
        message: `Failed to ${action} subscription` 
      });
    }
  };

  // Open modal
  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedSubscription(item);
    
    if (type === 'edit-plan' && item) {
      setPlanFormData({
        name: item.name || '',
        description: item.description || '',
        price_monthly: item.price_monthly || '',
        currency: item.currency || 'USD',
        is_active: item.is_active || true,
        limit_chatbot_messages: item.limit_chatbot_messages || '',
        limit_mcq_generations: item.limit_mcq_generations || '',
        limit_report_analyses: item.limit_report_analyses || '',
        limit_document_anonymizations: item.limit_document_anonymizations || ''
      });
    } else {
      setPlanFormData({
        name: '',
        description: '',
        price_monthly: '',
        currency: 'USD',
        is_active: true,
        limit_chatbot_messages: '',
        limit_mcq_generations: '',
        limit_report_analyses: '',
        limit_document_anonymizations: ''
      });
    }
    
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedSubscription(null);
  };

  // Format currency
  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const variants = {
      active: 'success',
      trial: 'info',
      cancelled: 'danger',
      expired: 'secondary',
      pending_payment: 'warning'
    };
    
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  return (
    <div className="subscription-management-container">
      {/* Header with Logout */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Subscription Management</h2>
          <p className="text-muted mb-0">Manage subscription plans, billing, and user subscriptions</p>
        </div>
        <Button 
          variant="outline-danger" 
          onClick={handleLogout}
          className="d-flex align-items-center gap-2"
        >
          <RiLogoutBoxLine size={16} />
          Logout
        </Button>
      </div>

      {/* Alert */}
      {alert.show && (
        <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible>
          {alert.message}
        </Alert>
      )}

      {/* Tab Navigation */}
      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
        <Tab eventKey="overview" title={
          <span className="d-flex align-items-center gap-2">
            <RiBarChartBoxLine size={16} />
            Overview
          </span>
        }>
          {/* Overview Dashboard */}
          <Row className="mb-4">
            <Col xl={3} md={6} className="mb-3">
              <Card className="border-0 shadow-sm h-100 bg-gradient-primary text-white">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <div className="revenue-metric">{formatCurrency(overview.totalRevenue)}</div>
                      <div className="mt-2">Total Revenue</div>
                    </div>
                    <RiMoneyDollarCircleLine size={40} className="opacity-75" />
                  </div>
                  <div className="mt-3">
                    <div className="metric-change text-success">
                      <RiArrowUpLine size={16} className="me-1" />
                      +12.5% vs last month
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col xl={3} md={6} className="mb-3">
              <Card className="border-0 shadow-sm h-100 bg-gradient-success text-white">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <div className="revenue-metric">{formatCurrency(overview.monthlyRecurringRevenue)}</div>
                      <div className="mt-2">Monthly Recurring Revenue</div>
                    </div>
                    <RiCoinLine size={40} className="opacity-75" />
                  </div>
                  <div className="mt-3">
                    <div className="metric-change text-success">
                      <RiArrowUpLine size={16} className="me-1" />
                      +8.2% vs last month
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col xl={3} md={6} className="mb-3">
              <Card className="border-0 shadow-sm h-100 bg-gradient-info text-white">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <div className="revenue-metric">{overview.activeSubscriptions}</div>
                      <div className="mt-2">Active Subscriptions</div>
                    </div>
                    <RiVipCrownLine size={40} className="opacity-75" />
                  </div>
                  <div className="mt-3">
                    <div className="metric-change text-success">
                      <RiArrowUpLine size={16} className="me-1" />
                      +15 new this month
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col xl={3} md={6} className="mb-3">
              <Card className="border-0 shadow-sm h-100 bg-gradient-warning text-white">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <div className="revenue-metric">{overview.churnRate}%</div>
                      <div className="mt-2">Churn Rate</div>
                    </div>
                    <RiAlertLine size={40} className="opacity-75" />
                  </div>
                  <div className="mt-3">
                    <div className="metric-change text-success">
                      <RiArrowUpLine size={16} className="me-1" />
                      -0.5% improvement
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Charts Section */}
          <Row className="mb-4">
            <Col lg={8}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Header className="bg-white border-0 py-3">
                  <h5 className="mb-0">Revenue Growth</h5>
                </Card.Header>
                <Card.Body>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stackId="1"
                        stroke="#0d6efd" 
                        fill="#0d6efd"
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={4}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Header className="bg-white border-0 py-3">
                  <h5 className="mb-0">Plan Distribution</h5>
                </Card.Header>
                <Card.Body>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={planDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {planDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Key Metrics */}
          <Row>
            <Col lg={3} md={6} className="mb-3">
              <Card className="border-0 shadow-sm text-center">
                <Card.Body className="py-4">
                  <div className="mb-3">
                    <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                      <RiUserLine size={24} className="text-primary" />
                    </div>
                  </div>
                  <h3 className="mb-1">{formatCurrency(overview.averageRevenuePerUser)}</h3>
                  <p className="text-muted mb-0">Average Revenue Per User</p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={3} md={6} className="mb-3">
              <Card className="border-0 shadow-sm text-center">
                <Card.Body className="py-4">
                  <div className="mb-3">
                    <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                      <RiArrowUpLine size={24} className="text-success" />
                    </div>
                  </div>
                  <h3 className="mb-1">{overview.conversionRate}%</h3>
                  <p className="text-muted mb-0">Conversion Rate</p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={3} md={6} className="mb-3">
              <Card className="border-0 shadow-sm text-center">
                <Card.Body className="py-4">
                  <div className="mb-3">
                    <div className="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                      <RiShieldCheckLine size={24} className="text-info" />
                    </div>
                  </div>
                  <h3 className="mb-1">{overview.retentionRate}%</h3>
                  <p className="text-muted mb-0">Customer Retention</p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={3} md={6} className="mb-3">
              <Card className="border-0 shadow-sm text-center">
                <Card.Body className="py-4">
                  <div className="mb-3">
                    <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                      <RiTimeLine size={24} className="text-warning" />
                    </div>
                  </div>
                  <h3 className="mb-1">{overview.totalCustomers}</h3>
                  <p className="text-muted mb-0">Total Customers</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="subscriptions" title={
          <span className="d-flex align-items-center gap-2">
            <RiVipCrownLine size={16} />
            Subscriptions
          </span>
        }>
          {/* Subscriptions Management */}
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-gradient-primary text-white border-0">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Subscription Management</h4>
                <Button variant="light" size="sm" onClick={loadSubscriptions}>
                  <RiRefreshLine size={16} className="me-1" />
                  Refresh
                </Button>
              </div>
            </Card.Header>
            
            <Card.Body className="p-4">
              {/* Search and Filters */}
              <Row className="mb-4">
                <Col lg={4}>
                  <InputGroup>
                    <InputGroup.Text>
                      <RiSearchLine size={16} />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search subscriptions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col lg={3}>
                  <Form.Select
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                  >
                    <option value="">All Plans</option>
                    {plans.map(plan => (
                      <option key={plan.id} value={plan.name}>{plan.name}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col lg={3}>
                  <Form.Select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="trial">Trial</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="expired">Expired</option>
                  </Form.Select>
                </Col>
                <Col lg={2}>
                  <Button variant="outline-primary" className="w-100">
                    <RiDownloadLine size={16} className="me-1" />
                    Export
                  </Button>
                </Col>
              </Row>

              {/* Subscriptions Table */}
              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Customer</th>
                      <th>Plan</th>
                      <th>Status</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Revenue</th>
                      <th>Auto Renew</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscriptions.map(subscription => (
                      <tr key={subscription.id}>
                        <td>
                          <div>
                            <strong>{subscription.user.first_name} {subscription.user.last_name}</strong>
                            <br />
                            <small className="text-muted">{subscription.user.email}</small>
                          </div>
                        </td>
                        <td>
                          <Badge bg="info">{subscription.plan.name}</Badge>
                          <br />
                          <small>{formatCurrency(subscription.plan.price_monthly)}/month</small>
                        </td>
                        <td>{getStatusBadge(subscription.status)}</td>
                        <td>{formatDate(subscription.start_date)}</td>
                        <td>{formatDate(subscription.end_date)}</td>
                        <td className="fw-bold">{formatCurrency(subscription.plan.price_monthly)}</td>
                        <td>
                          <Badge bg={subscription.auto_renew ? 'success' : 'warning'}>
                            {subscription.auto_renew ? 'Yes' : 'No'}
                          </Badge>
                        </td>
                        <td>
                          <Dropdown>
                            <Dropdown.Toggle variant="outline-secondary" size="sm">
                              Actions
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => openModal('view-subscription', subscription)}>
                                <RiEyeLine size={16} className="me-2" />
                                View Details
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item 
                                onClick={() => handleSubscriptionAction('cancel', subscription.id)}
                                className="text-danger"
                              >
                                <RiCloseLine size={16} className="me-2" />
                                Cancel Subscription
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="plans" title={
          <span className="d-flex align-items-center gap-2">
            <RiStarLine size={16} />
            Plans
          </span>
        }>
          {/* Plans Management */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0">Subscription Plans</h4>
            <Button variant="primary" onClick={() => openModal('create-plan')}>
              <RiGiftLine size={16} className="me-1" />
              Create New Plan
            </Button>
          </div>

          <Row>
            {plans.map(plan => (
              <Col lg={4} md={6} key={plan.id} className="mb-4">
                <Card className="plan-card border-0 shadow-sm h-100">
                  <Card.Header className="bg-white border-0 text-center py-4">
                    <h5 className="fw-bold">{plan.name}</h5>
                    <div className="display-4 fw-bold text-primary">
                      {formatCurrency(plan.price_monthly)}
                      <small className="fs-6 text-muted">/month</small>
                    </div>
                  </Card.Header>
                  <Card.Body className="flex-grow-1">
                    <p className="text-muted">{plan.description}</p>
                    
                    <ListGroup variant="flush">
                      <ListGroup.Item className="px-0 border-0">
                        <RiCheckLine size={16} className="text-success me-2" />
                        {plan.limit_chatbot_messages || 'Unlimited'} Chatbot Messages
                      </ListGroup.Item>
                      <ListGroup.Item className="px-0 border-0">
                        <RiCheckLine size={16} className="text-success me-2" />
                        {plan.limit_mcq_generations || 'Unlimited'} MCQ Generations
                      </ListGroup.Item>
                      <ListGroup.Item className="px-0 border-0">
                        <RiCheckLine size={16} className="text-success me-2" />
                        {plan.limit_report_analyses || 'Unlimited'} Report Analyses
                      </ListGroup.Item>
                      <ListGroup.Item className="px-0 border-0">
                        <RiCheckLine size={16} className="text-success me-2" />
                        {plan.limit_document_anonymizations || 'Unlimited'} Document Anonymizations
                      </ListGroup.Item>
                    </ListGroup>
                    
                    <div className="mt-4">
                      <Badge bg={plan.is_active ? 'success' : 'secondary'} className="mb-3">
                        {plan.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </Card.Body>
                  <Card.Footer className="bg-white border-0">
                    <div className="d-grid gap-2">
                      <Button 
                        variant="outline-primary" 
                        onClick={() => openModal('edit-plan', plan)}
                      >
                        <RiEditLine size={16} className="me-1" />
                        Edit Plan
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </Tab>

        <Tab eventKey="billing" title={
          <span className="d-flex align-items-center gap-2">
            <RiFileList3Line size={16} />
            Billing
          </span>
        }>
          {/* Billing History */}
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-gradient-primary text-white border-0">
              <h4 className="mb-0">Billing History</h4>
            </Card.Header>
            <Card.Body className="p-4">
              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Customer</th>
                      <th>Plan</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billingHistory.map(billing => (
                      <tr key={billing.id}>
                        <td>{billing.user.email}</td>
                        <td>{billing.plan_name_snapshot}</td>
                        <td className="fw-bold">{formatCurrency(billing.amount_paid, billing.currency)}</td>
                        <td>
                          <Badge bg={billing.status === 'succeeded' ? 'success' : 'danger'}>
                            {billing.status}
                          </Badge>
                        </td>
                        <td>{formatDate(billing.date_paid)}</td>
                        <td>
                          <Button variant="outline-primary" size="sm">
                            <RiDownloadLine size={14} className="me-1" />
                            Invoice
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Modals */}
      <Modal show={showModal} onHide={closeModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === 'create-plan' && 'Create New Plan'}
            {modalType === 'edit-plan' && 'Edit Plan'}
            {modalType === 'view-subscription' && 'Subscription Details'}
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          {(modalType === 'create-plan' || modalType === 'edit-plan') && (
            <Form onSubmit={handlePlanSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Plan Name *</Form.Label>
                    <Form.Control
                      type="text"
                      value={planFormData.name}
                      onChange={(e) => setPlanFormData({...planFormData, name: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Monthly Price *</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>$</InputGroup.Text>
                      <Form.Control
                        type="number"
                        step="0.01"
                        value={planFormData.price_monthly}
                        onChange={(e) => setPlanFormData({...planFormData, price_monthly: e.target.value})}
                        required
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={planFormData.description}
                  onChange={(e) => setPlanFormData({...planFormData, description: e.target.value})}
                />
              </Form.Group>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Chatbot Messages Limit</Form.Label>
                    <Form.Control
                      type="number"
                      value={planFormData.limit_chatbot_messages}
                      onChange={(e) => setPlanFormData({...planFormData, limit_chatbot_messages: e.target.value})}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>MCQ Generations Limit</Form.Label>
                    <Form.Control
                      type="number"
                      value={planFormData.limit_mcq_generations}
                      onChange={(e) => setPlanFormData({...planFormData, limit_mcq_generations: e.target.value})}
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Report Analyses Limit</Form.Label>
                    <Form.Control
                      type="number"
                      value={planFormData.limit_report_analyses}
                      onChange={(e) => setPlanFormData({...planFormData, limit_report_analyses: e.target.value})}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Document Anonymizations Limit</Form.Label>
                    <Form.Control
                      type="number"
                      value={planFormData.limit_document_anonymizations}
                      onChange={(e) => setPlanFormData({...planFormData, limit_document_anonymizations: e.target.value})}
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  id="is_active"
                  label="Active Plan"
                  checked={planFormData.is_active}
                  onChange={(e) => setPlanFormData({...planFormData, is_active: e.target.checked})}
                />
              </Form.Group>
            </Form>
          )}
          
          {modalType === 'view-subscription' && selectedSubscription && (
            <div>
              <Row>
                <Col md={6}>
                  <Card className="border-0 bg-light">
                    <Card.Body>
                      <h6>Customer Information</h6>
                      <p className="mb-1"><strong>Name:</strong> {selectedSubscription.user.first_name} {selectedSubscription.user.last_name}</p>
                      <p className="mb-1"><strong>Email:</strong> {selectedSubscription.user.email}</p>
                      <p className="mb-0"><strong>Status:</strong> {getStatusBadge(selectedSubscription.status)}</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border-0 bg-light">
                    <Card.Body>
                      <h6>Subscription Details</h6>
                      <p className="mb-1"><strong>Plan:</strong> {selectedSubscription.plan.name}</p>
                      <p className="mb-1"><strong>Price:</strong> {formatCurrency(selectedSubscription.plan.price_monthly)}/month</p>
                      <p className="mb-1"><strong>Start Date:</strong> {formatDate(selectedSubscription.start_date)}</p>
                      <p className="mb-0"><strong>End Date:</strong> {formatDate(selectedSubscription.end_date)}</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              
              <div className="subscription-timeline mt-4">
                <h6>Subscription Timeline</h6>
                <div className="timeline-item">
                  <strong>Subscription Started</strong>
                  <div className="text-muted small">{formatDate(selectedSubscription.start_date)}</div>
                </div>
                <div className="timeline-item">
                  <strong>Next Billing Date</strong>
                  <div className="text-muted small">{formatDate(selectedSubscription.end_date)}</div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          {(modalType === 'create-plan' || modalType === 'edit-plan') && (
            <Button variant="primary" onClick={handlePlanSubmit} disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                modalType === 'create-plan' ? 'Create Plan' : 'Update Plan'
              )}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SubscriptionManagement;
