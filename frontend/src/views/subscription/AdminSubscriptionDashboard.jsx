import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  ProgressBar,
  Dropdown,
  InputGroup,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
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
  Legend
} from 'recharts';
import apiClient, { adminAPI } from '../../services/api';

const AdminSubscriptionDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // State for different data sets
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    churnRate: 0,
    revenueGrowth: 0
  });
  
  const [subscriptions, setSubscriptions] = useState([]);
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [billingHistory, setBillingHistory] = useState([]);
  const [usageStats, setUsageStats] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  
  // Modal states
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  // Filter states
  const [dateFilter, setDateFilter] = useState('30');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');

  useEffect(() => {
    loadDashboardData();
  }, [dateFilter, statusFilter, planFilter]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadOverviewData(),
        loadSubscriptions(),
        loadUsers(),
        loadPlans(),
        loadBillingHistory(),
        loadUsageStats(),
        loadRevenueData()
      ]);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadOverviewData = async () => {
    try {
      const response = await adminAPI.getOverview({
        days: dateFilter
      });
      setDashboardData(response.data);
    } catch (err) {
      // Mock data for development
      setDashboardData({
        totalUsers: 1247,
        activeSubscriptions: 892,
        totalRevenue: 145680,
        churnRate: 3.2,
        revenueGrowth: 12.8,
        newSubscriptions: 45,
        cancelledSubscriptions: 12,
        conversionRate: 23.4
      });
    }
  };

  const loadSubscriptions = async () => {
    try {
      const response = await adminAPI.getSubscriptions({ 
        status: statusFilter !== 'all' ? statusFilter : undefined,
        plan: planFilter !== 'all' ? planFilter : undefined,
        days: dateFilter
      });
      setSubscriptions(response.data.results || response.data);
    } catch (err) {
      // Mock data
      setSubscriptions([
        {
          id: 1,
          user: { email: 'john.doe@example.com', first_name: 'John', last_name: 'Doe' },
          plan: { name: 'Professional', price_monthly: 149 },
          status: 'active',
          start_date: '2024-01-15',
          end_date: '2024-12-15',
          auto_renew: true,
          payment_gateway_subscription_id: 'sub_1234567890'
        },
        {
          id: 2,
          user: { email: 'jane.smith@example.com', first_name: 'Jane', last_name: 'Smith' },
          plan: { name: 'Enterprise', price_monthly: 299 },
          status: 'active',
          start_date: '2024-02-01',
          end_date: '2024-12-01',
          auto_renew: true,
          payment_gateway_subscription_id: 'sub_0987654321'
        }
      ]);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await adminAPI.getUsers();
      setUsers(response.data.results || response.data);
    } catch (err) {
      // Mock data
      setUsers([
        {
          id: 1,
          email: 'john.doe@example.com',
          first_name: 'John',
          last_name: 'Doe',
          date_joined: '2024-01-15',
          last_login: '2024-08-07',
          is_active: true,
          subscription_status: 'active'
        }
      ]);
    }
  };

  const loadPlans = async () => {
    try {
      console.log('🔄 Loading subscription plans from API...');
      const response = await adminAPI.getPlans();
      console.log('✅ Plans loaded successfully:', response.data);
      setPlans(response.data);
    } catch (err) {
      console.error('❌ Error loading plans from API:', err);
      console.log('📊 Using real database plans as fallback...');
      
      // Try to get plans from public endpoint instead
      try {
        const { data: publicPlans } = await apiClient.get('/subscriptions/plans/');
        console.log('✅ Loaded plans from public endpoint:', publicPlans);
        
        // Transform public plan data to match admin format
        const transformedPlans = publicPlans.map(plan => ({
          id: plan.id,
          name: plan.name,
          price_monthly: parseFloat(plan.price_monthly),
          currency: plan.currency,
          is_active: plan.is_active,
          subscriber_count: 0, // Public endpoint doesn't have this
          services: plan.services?.map(s => s.name) || [],
          description: plan.description
        }));
        
        setPlans(transformedPlans);
      } catch (fallbackErr) {
        console.error('❌ Fallback also failed:', fallbackErr);
        setError('Unable to load subscription plans. Please check your connection.');
        setPlans([]);
      }
    }
  };

  const loadBillingHistory = async () => {
    try {
      const response = await adminAPI.getBillingHistory({
        days: dateFilter
      });
      setBillingHistory(response.data.results || response.data);
    } catch (err) {
      // Mock data
      setBillingHistory([
        {
          id: 1,
          user: { email: 'john.doe@example.com' },
          amount_due: 149,
          amount_paid: 149,
          currency: 'USD',
          status: 'succeeded',
          date_created: '2024-08-01',
          date_paid: '2024-08-01',
          plan_name_snapshot: 'Professional'
        }
      ]);
    }
  };

  const loadUsageStats = async () => {
    try {
      const response = await adminAPI.getUsageStats({
        days: dateFilter
      });
      setUsageStats(response.data);
    } catch (err) {
      // Mock data
      setUsageStats([
        { service: 'Dr. Max AI Chatbot', total_usage: 15623, limit_breaches: 12 },
        { service: 'MCQ Generator', total_usage: 3401, limit_breaches: 3 },
        { service: 'Radiology Analysis', total_usage: 892, limit_breaches: 1 }
      ]);
    }
  };

  const loadRevenueData = async () => {
    try {
      const response = await adminAPI.getRevenueData({
        days: dateFilter
      });
      setRevenueData(response.data);
    } catch (err) {
      // Mock data
      setRevenueData([
        { month: 'Jan', revenue: 12500, subscriptions: 89 },
        { month: 'Feb', revenue: 15600, subscriptions: 112 },
        { month: 'Mar', revenue: 18900, subscriptions: 134 },
        { month: 'Apr', revenue: 22100, subscriptions: 156 },
        { month: 'May', revenue: 25800, subscriptions: 178 },
        { month: 'Jun', revenue: 28900, subscriptions: 201 },
        { month: 'Jul', revenue: 32400, subscriptions: 224 },
        { month: 'Aug', revenue: 35600, subscriptions: 247 }
      ]);
    }
  };

  const handleUpdateSubscription = async (subscriptionId, updates) => {
    try {
      await adminAPI.subscriptionAction({
        subscription_id: subscriptionId,
        action: 'update',
        ...updates
      });
      setSuccess('Subscription updated successfully');
      loadSubscriptions();
    } catch (err) {
      setError('Failed to update subscription');
    }
  };

  const handleCancelSubscription = async (subscriptionId) => {
    if (!window.confirm('Are you sure you want to cancel this subscription?')) return;
    
    try {
      await adminAPI.subscriptionAction({
        subscription_id: subscriptionId,
        action: 'cancel'
      });
      setSuccess('Subscription cancelled successfully');
      loadSubscriptions();
    } catch (err) {
      setError('Failed to cancel subscription');
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: 'success',
      trial: 'info',
      pending_payment: 'warning',
      past_due: 'danger',
      cancelled: 'secondary',
      expired: 'dark'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status.replace('_', ' ')}</Badge>;
  };

  const handleUpdatePlan = async (planData) => {
    try {
      setLoading(true);
      await adminAPI.subscriptionAction({
        action: 'update_plan',
        plan_id: selectedPlan.id,
        ...planData
      });
      setSuccess(`Plan updated successfully! Changes are now live on the signup page.`);
      loadPlans();
      setSelectedPlan(null);
    } catch (err) {
      setError('Failed to update plan');
      console.error('Plan update error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async () => {
    if (!window.confirm(`Are you sure you want to delete the "${selectedPlan?.name}" plan? This action cannot be undone and will remove it from the signup page.`)) {
      return;
    }
    
    try {
      setLoading(true);
      await adminAPI.subscriptionAction({
        action: 'delete_plan',
        plan_id: selectedPlan.id
      });
      setSuccess(`Plan deleted successfully! It has been removed from the signup page.`);
      loadPlans();
      setSelectedPlan(null);
    } catch (err) {
      setError('Failed to delete plan. Make sure no active subscriptions use this plan.');
      console.error('Plan delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlanChanges = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const planData = {
      name: formData.get('name'),
      price_monthly: parseFloat(formData.get('price_monthly')),
      currency: formData.get('currency'),
      is_active: formData.get('status') === 'active',
      description: formData.get('description')
    };
    handleUpdatePlan(planData);
  };

  const handleCreatePlan = async (planData) => {
    try {
      setLoading(true);
      await adminAPI.createPlan(planData);
      setSuccess(`Plan created successfully! It's now available on the signup page.`);
      loadPlans();
      setShowCreatePlanModal(false);
    } catch (err) {
      setError('Failed to create plan');
      console.error('Plan creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlanSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Get services array from the form
    const services = [];
    const serviceInputs = e.target.querySelectorAll('input[name="service"]');
    serviceInputs.forEach(input => {
      if (input.value.trim()) {
        services.push(input.value.trim());
      }
    });

    const planData = {
      name: formData.get('name'),
      price_monthly: parseFloat(formData.get('price_monthly')),
      currency: formData.get('currency'),
      is_active: formData.get('status') === 'active',
      description: formData.get('description'),
      services: services
    };
    handleCreatePlan(planData);
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <Container fluid className="p-4">
        <div className="text-center">
          <Spinner animation="border" size="lg" />
          <p className="mt-3">Loading admin dashboard...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="p-4">
      <Row className="mb-4">
        <Col>
          <h1 className="h3 mb-0">
            <i className="ri-admin-fill me-2"></i>
            Mastermind Subscription Administration
          </h1>
          <p className="text-muted">Comprehensive subscription management and analytics</p>
        </Col>
        <Col xs="auto">
          <Button variant="outline-primary" onClick={loadDashboardData}>
            <i className="ri-refresh-line me-1"></i>
            Refresh Data
          </Button>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Overview Cards */}
      <Row className="mb-4">
        <Col lg={3} md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                    <i className="ri-user-line text-primary fs-4"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="mb-0">Total Users</h6>
                  <h4 className="mb-0">{dashboardData.totalUsers?.toLocaleString()}</h4>
                  <small className="text-muted">Registered users</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                    <i className="ri-vip-crown-line text-success fs-4"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="mb-0">Active Subscriptions</h6>
                  <h4 className="mb-0">{dashboardData.activeSubscriptions?.toLocaleString()}</h4>
                  <small className="text-success">
                    <i className="ri-arrow-up-line"></i> {dashboardData.newSubscriptions} new
                  </small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-warning bg-opacity-10 p-3 rounded-circle">
                    <i className="ri-money-dollar-circle-line text-warning fs-4"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="mb-0">Total Revenue</h6>
                  <h4 className="mb-0">{formatCurrency(dashboardData.totalRevenue)}</h4>
                  <small className="text-success">
                    <i className="ri-arrow-up-line"></i> {dashboardData.revenueGrowth}% growth
                  </small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-info bg-opacity-10 p-3 rounded-circle">
                    <i className="ri-line-chart-line text-info fs-4"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="mb-0">Conversion Rate</h6>
                  <h4 className="mb-0">{dashboardData.conversionRate}%</h4>
                  <small className="text-muted">Trial to paid</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Content Tabs */}
      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
        <Tab eventKey="overview" title={<><i className="ri-dashboard-line me-2"></i>Overview</>}>
          <Row>
            <Col lg={8}>
              <Card className="border-0 shadow-sm">
                <Card.Header>
                  <h5 className="mb-0">Revenue & Subscription Growth</h5>
                </Card.Header>
                <Card.Body>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Line 
                        yAxisId="left" 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        name="Revenue ($)"
                      />
                      <Line 
                        yAxisId="right" 
                        type="monotone" 
                        dataKey="subscriptions" 
                        stroke="#82ca9d" 
                        strokeWidth={2}
                        name="Subscriptions"
                      />
                      <Legend />
                    </LineChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              <Card className="border-0 shadow-sm">
                <Card.Header>
                  <h5 className="mb-0">Plan Distribution</h5>
                </Card.Header>
                <Card.Body>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={plans}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="subscriber_count"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {plans.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col>
              <Card className="border-0 shadow-sm">
                <Card.Header>
                  <h5 className="mb-0">Service Usage Overview</h5>
                </Card.Header>
                <Card.Body>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={usageStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="service" />
                      <YAxis />
                      <Bar dataKey="total_usage" fill="#8884d8" name="Total Usage" />
                      <Bar dataKey="limit_breaches" fill="#ff6b6b" name="Limit Breaches" />
                      <Legend />
                    </BarChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="subscriptions" title={<><i className="ri-vip-crown-line me-2"></i>Subscriptions</>}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Active Subscriptions</h5>
              <div className="d-flex gap-2">
                <Form.Select 
                  size="sm" 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="trial">Trial</option>
                  <option value="pending_payment">Pending Payment</option>
                  <option value="cancelled">Cancelled</option>
                </Form.Select>
                
                <Form.Select 
                  size="sm" 
                  value={planFilter} 
                  onChange={(e) => setPlanFilter(e.target.value)}
                >
                  <option value="all">All Plans</option>
                  {plans.map(plan => (
                    <option key={plan.id} value={plan.id}>{plan.name}</option>
                  ))}
                </Form.Select>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive striped hover className="mb-0">
                <thead>
                  <tr>
                    <th>User</th>
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
                  {subscriptions.map(subscription => (
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
                      <td>{formatCurrency(subscription.plan.price_monthly)}</td>
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
                            <Dropdown.Item onClick={() => setSelectedUser(subscription.user)}>
                              View User
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item 
                              className="text-danger"
                              onClick={() => handleCancelSubscription(subscription.id)}
                            >
                              Cancel Subscription
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="plans" title={<><i className="ri-price-tag-3-line me-2"></i>Plans</>}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="mb-0">Subscription Plans</h4>
              <small className="text-muted">
                Manage plans that appear on the 
                <Link to="/modern-signup" className="text-primary ms-1" target="_blank">
                  signup page <i className="ri-external-link-line"></i>
                </Link>
              </small>
            </div>
            <Button 
              variant="primary" 
              onClick={() => setShowCreatePlanModal(true)}
            >
              <i className="ri-add-line me-2"></i>
              Create New Plan
            </Button>
          </div>
          
          <Row>
            {plans.length === 0 ? (
              <Col>
                <Card className="border-0 shadow-sm text-center p-5">
                  <Card.Body>
                    <i className="ri-price-tag-3-line display-4 text-muted mb-3"></i>
                    <h5 className="text-muted">No subscription plans available</h5>
                    <p className="text-muted">Create your first subscription plan to get started with monetizing your healthcare application.</p>
                    <Button 
                      variant="primary" 
                      onClick={() => setShowCreatePlanModal(true)}
                      className="mt-2"
                    >
                      <i className="ri-add-line me-2"></i>
                      Create Your First Plan
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ) : (
              plans.map(plan => (
                <Col lg={4} md={6} key={plan.id} className="mb-4">
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">{plan.name}</h5>
                      <Badge bg={plan.is_active ? 'success' : 'secondary'}>
                        {plan.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </Card.Header>
                    <Card.Body>
                      <div className="text-center mb-3">
                        <h2 className="mb-0">{formatCurrency(plan.price_monthly)}</h2>
                        <small className="text-muted">per month</small>
                      </div>
                      
                      <div className="mb-3">
                        <strong>Subscribers: {plan.subscriber_count}</strong>
                        <ProgressBar 
                          now={(plan.subscriber_count / 500) * 100} 
                          className="mt-1"
                          style={{ height: '6px' }}
                        />
                      </div>

                      <div className="mb-3">
                        <strong>Services:</strong>
                        <ul className="list-unstyled mt-2">
                          {plan.services?.map((service, index) => (
                            <li key={index} className="small">
                              <i className="ri-check-line text-success me-1"></i>
                              {service}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Card.Body>
                    <Card.Footer>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="w-100"
                        onClick={() => setSelectedPlan(plan)}
                      >
                        Manage Plan
                      </Button>
                    </Card.Footer>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </Tab>

        <Tab eventKey="billing" title={<><i className="ri-bill-line me-2"></i>Billing</>}>
          <Card className="border-0 shadow-sm">
            <Card.Header>
              <h5 className="mb-0">Recent Billing History</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive striped hover className="mb-0">
                <thead>
                  <tr>
                    <th>Invoice ID</th>
                    <th>User</th>
                    <th>Plan</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date Created</th>
                    <th>Date Paid</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {billingHistory.map(billing => (
                    <tr key={billing.id}>
                      <td>
                        <code>#{billing.id}</code>
                      </td>
                      <td>{billing.user.email}</td>
                      <td>{billing.plan_name_snapshot}</td>
                      <td>{formatCurrency(billing.amount_due, billing.currency)}</td>
                      <td>{getStatusBadge(billing.status)}</td>
                      <td>{formatDate(billing.date_created)}</td>
                      <td>{billing.date_paid ? formatDate(billing.date_paid) : '-'}</td>
                      <td>
                        <Button variant="outline-primary" size="sm">
                          <i className="ri-download-line me-1"></i>
                          Download
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="analytics" title={<><i className="ri-bar-chart-box-line me-2"></i>Analytics</>}>
          <Row>
            <Col lg={6} className="mb-4">
              <Card className="border-0 shadow-sm">
                <Card.Header>
                  <h5 className="mb-0">Subscription Status Distribution</h5>
                </Card.Header>
                <Card.Body>
                  <div className="row text-center">
                    <div className="col-4">
                      <h4 className="text-success">{dashboardData.activeSubscriptions}</h4>
                      <small>Active</small>
                    </div>
                    <div className="col-4">
                      <h4 className="text-warning">{dashboardData.newSubscriptions}</h4>
                      <small>Trial</small>
                    </div>
                    <div className="col-4">
                      <h4 className="text-danger">{dashboardData.cancelledSubscriptions}</h4>
                      <small>Cancelled</small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={6} className="mb-4">
              <Card className="border-0 shadow-sm">
                <Card.Header>
                  <h5 className="mb-0">Key Metrics</h5>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Churn Rate</span>
                      <span className="text-danger">{dashboardData.churnRate}%</span>
                    </div>
                    <ProgressBar variant="danger" now={dashboardData.churnRate} className="mt-1" style={{ height: '6px' }} />
                  </div>
                  
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Conversion Rate</span>
                      <span className="text-success">{dashboardData.conversionRate}%</span>
                    </div>
                    <ProgressBar variant="success" now={dashboardData.conversionRate} className="mt-1" style={{ height: '6px' }} />
                  </div>
                  
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Revenue Growth</span>
                      <span className="text-info">{dashboardData.revenueGrowth}%</span>
                    </div>
                    <ProgressBar variant="info" now={dashboardData.revenueGrowth} className="mt-1" style={{ height: '6px' }} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
      </Tabs>

      {/* Plan Management Modal */}
      <Modal show={selectedPlan !== null} onHide={() => setSelectedPlan(null)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Manage Plan: {selectedPlan?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPlan && (
            <Form id="plan-form" onSubmit={handleSavePlanChanges}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Plan Name</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="name"
                      defaultValue={selectedPlan.name}
                      placeholder="Plan name"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Monthly Price</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>$</InputGroup.Text>
                      <Form.Control 
                        type="number" 
                        name="price_monthly"
                        step="0.01"
                        defaultValue={selectedPlan.price_monthly}
                        placeholder="0.00"
                        required
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Currency</Form.Label>
                    <Form.Select name="currency" defaultValue={selectedPlan.currency || 'USD'}>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="INR">INR</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select name="status" defaultValue={selectedPlan.is_active ? 'active' : 'inactive'}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control 
                  as="textarea" 
                  name="description"
                  rows={3}
                  defaultValue={selectedPlan.description || ''}
                  placeholder="Plan description..."
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Features/Services</Form.Label>
                <div className="border p-3 rounded bg-light">
                  {selectedPlan.services?.map((service, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center mb-2 p-2 bg-white rounded border">
                      <span className="text-primary">
                        <i className="ri-check-line me-2 text-success"></i>
                        {service}
                      </span>
                      <Button variant="outline-danger" size="sm">
                        <i className="ri-delete-bin-line"></i>
                      </Button>
                    </div>
                  )) || (
                    <div className="text-muted text-center py-3">
                      <i className="ri-information-line me-2"></i>
                      No services defined for this plan
                    </div>
                  )}
                  <Form.Control 
                    type="text" 
                    placeholder="Add new service/feature and press Enter..."
                    className="mt-2"
                  />
                </div>
              </Form.Group>

              <Row>
                <Col md={4}>
                  <Card className="border-0 bg-light">
                    <Card.Body className="text-center">
                      <h3 className="text-primary">{selectedPlan.subscriber_count || 0}</h3>
                      <small className="text-muted">Active Subscribers</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="border-0 bg-light">
                    <Card.Body className="text-center">
                      <h3 className="text-success">
                        ${(selectedPlan.price_monthly * (selectedPlan.subscriber_count || 0)).toLocaleString()}
                      </h3>
                      <small className="text-muted">Monthly Revenue</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="border-0 bg-light">
                    <Card.Body className="text-center">
                      <h3 className="text-info">
                        ${((selectedPlan.price_monthly * (selectedPlan.subscriber_count || 0)) * 12).toLocaleString()}
                      </h3>
                      <small className="text-muted">Annual Revenue</small>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedPlan(null)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            className="me-2"
            onClick={handleDeletePlan}
            disabled={loading}
          >
            <i className="ri-delete-bin-line me-2"></i>
            Delete Plan
          </Button>
          <Button 
            variant="primary"
            type="submit"
            form="plan-form"
            disabled={loading}
          >
            {loading ? (
              <Spinner size="sm" className="me-2" />
            ) : (
              <i className="ri-save-line me-2"></i>
            )}
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Create New Plan Modal */}
      <Modal show={showCreatePlanModal} onHide={() => setShowCreatePlanModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-add-line me-2"></i>
            Create New Subscription Plan
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="create-plan-form" onSubmit={handleCreatePlanSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Plan Name *</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="name"
                    placeholder="e.g., Premium Plan"
                    required
                  />
                  <Form.Text className="text-muted">
                    Choose a descriptive name for your plan
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Monthly Price *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>$</InputGroup.Text>
                    <Form.Control 
                      type="number" 
                      name="price_monthly"
                      step="0.01"
                      min="0"
                      placeholder="29.99"
                      required
                    />
                  </InputGroup>
                  <Form.Text className="text-muted">
                    Price in USD per month
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Currency</Form.Label>
                  <Form.Select name="currency" defaultValue="USD">
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="INR">INR - Indian Rupee</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Initial Status</Form.Label>
                  <Form.Select name="status" defaultValue="active">
                    <option value="active">Active - Available for subscription</option>
                    <option value="inactive">Inactive - Hidden from users</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Plan Description</Form.Label>
              <Form.Control 
                as="textarea" 
                name="description"
                rows={3}
                placeholder="Describe what this plan offers, its target audience, and key benefits..."
              />
              <Form.Text className="text-muted">
                This description will be shown to potential subscribers
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Plan Features & Services</Form.Label>
              <div className="border p-3 rounded bg-light">
                <div id="services-container">
                  <div className="d-flex mb-2">
                    <Form.Control 
                      type="text" 
                      name="service"
                      placeholder="Enter a feature or service (e.g., Dr. Max AI Chatbot)"
                      className="me-2"
                    />
                    <Button 
                      type="button" 
                      variant="outline-success" 
                      onClick={(e) => {
                        const container = document.getElementById('services-container');
                        const newServiceDiv = document.createElement('div');
                        newServiceDiv.className = 'd-flex mb-2';
                        newServiceDiv.innerHTML = `
                          <input type="text" name="service" placeholder="Enter another feature or service..." class="form-control me-2" />
                          <button type="button" class="btn btn-outline-danger" onclick="this.parentElement.remove()">
                            <i class="ri-delete-bin-line"></i>
                          </button>
                        `;
                        container.appendChild(newServiceDiv);
                      }}
                    >
                      <i className="ri-add-line"></i>
                    </Button>
                  </div>
                </div>
                <Form.Text className="text-muted">
                  Add features and services that are included in this plan. Click + to add more.
                </Form.Text>
              </div>
            </Form.Group>

            <Alert variant="info">
              <i className="ri-information-line me-2"></i>
              <strong>Note:</strong> Once created, you can further customize this plan, manage its services, 
              and monitor its performance from the Plans management section.
            </Alert>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreatePlanModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary"
            type="submit"
            form="create-plan-form"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Creating Plan...
              </>
            ) : (
              <>
                <i className="ri-add-line me-2"></i>
                Create Plan
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminSubscriptionDashboard;
