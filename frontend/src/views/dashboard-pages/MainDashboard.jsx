/**
 * Main Dashboard - Consolidated Healthcare Management System
 * 
 * Executive Overview Dashboard providing real-time insights across all healthcare modules
 * including Hospital Management, Clinical Operations, Patient Care, and Advanced Analytics.
 * 
 * Features:
 * - Real-time system-wide statistics
 * - Department performance metrics
 * - Patient flow analytics
 * - AI-powered insights and alerts
 * - Quick access to all modules
 * - Interactive charts and visualizations
 * - Executive summary reports
 * - System health monitoring
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Dropdown,
  ProgressBar,
  Table,
  Alert,
  Spinner,
  Nav,
  Tab,
  Modal,
  Form,
  InputGroup,
  ListGroup,
  Accordion,
  Toast,
  ToastContainer
} from 'react-bootstrap';
import { 
  RiDashboardFill,
  RiHospitalFill,
  RiUserHeartFill,
  RiMedicineBottleFill,
  RiStethoscopeFill,
  RiTestTubeFill,
  RiScanLine,
  RiMicroscopeLine,
  RiToothFill,
  RiBrushFill,
  RiBrainFill,
  RiPulseLine,
  RiCalendarFill,
  RiArrowUpCircleFill,
  RiArrowDownCircleFill,
  RiRefreshLine,
  RiSettings3Fill,
  RiNotificationFill,
  RiAlertFill,
  RiShieldCheckFill,
  RiTimeFill,
  RiLineChartFill,
  RiBarChartBoxFill,
  RiPieChartFill,
  RiEyeFill,
  RiDownloadFill,
  RiFilterFill,
  RiSearchLine,
  RiRobotFill,
  RiStarFill,
  RiHeartPulseFill,
  RiUserFill,
  RiGroupFill,
  RiMapPinFill,
  RiMoneyDollarCircleFill,
  RiAwardFill,
  RiLightbulbFill
} from '@remixicon/react';
import Chart from 'react-apexcharts';
import CountUp from 'react-countup';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";
import { useSelector } from 'react-redux';
import UsageTracker from '../../components/UsageTracker';
import ClockCounter from '../../components/ClockCounter';

// Main Dashboard Configuration
const MAIN_DASHBOARD_CONFIG = {
  title: 'Healthcare Management System',
  subtitle: 'Comprehensive Medical Center Operations Dashboard',
  refreshInterval: 10000,
  features: {
    realTimeUpdates: true,
    aiInsights: true,
    exportReports: true,
    alerts: true,
    analytics: true,
    voiceCommands: false,
    darkMode: true
  }
};

// Department Configuration
const DEPARTMENTS = [
  {
    id: 'hospital-management',
    name: 'Hospital Management',
    icon: RiHospitalFill,
    route: '/dashboard-pages/dashboard-1',
    color: 'primary',
    description: 'Overall hospital operations and administration'
  },
  {
    id: 'clinic-management', 
    name: 'Clinic Management',
    icon: RiStethoscopeFill,
    route: '/dashboard-pages/dashboard-2',
    color: 'success',
    description: 'Outpatient clinic operations with AI features'
  },
  {
    id: 'patient-management',
    name: 'Patient Management',
    icon: RiUserHeartFill,
    route: '/dashboard-pages/patient-dashboard',
    color: 'info',
    description: 'Patient records and care coordination'
  },
  {
    id: 'medicine',
    name: 'Medicine Department',
    icon: RiMedicineBottleFill,
    route: '/medicine/dashboard',
    color: 'danger',
    description: 'General medicine, emergency care, and diabetes management'
  },
  {
    id: 'dermatology',
    name: 'Dermatology',
    icon: RiHeartPulseFill,
    route: '/dermatology/dashboard',
    color: 'warning',
    description: 'Skin condition analysis with AI diagnosis'
  },
  {
    id: 'cosmetology',
    name: 'Cosmetology',
    icon: RiBrushFill,
    route: '/cosmetology/dashboard',
    color: 'success',
    description: 'Beauty salon and cosmetic treatment management',
    isNew: true
  },
  {
    id: 'radiology',
    name: 'Radiology',
    icon: RiScanLine,
    route: '/radiology/dashboard',
    color: 'dark',
    description: 'Medical imaging and diagnostic radiology'
  },
  {
    id: 'pathology',
    name: 'Pathology',
    icon: RiMicroscopeLine,
    route: '/pathology/dashboard',
    color: 'secondary',
    description: 'Laboratory testing and pathological analysis'
  },
  {
    id: 'dentistry',
    name: 'Dentistry',
    icon: RiToothFill,
    route: '/dentistry/dashboard',
    color: 'light',
    description: 'Dental care and oral health management'
  },
  {
    id: 'dna-sequencing',
    name: 'DNA Sequencing',
    icon: RiTestTubeFill,
    route: '/dna-sequencing/dashboard',
    color: 'primary',
    description: 'Genomic analysis and DNA sequencing laboratory'
  }
];

const MainDashboard = () => {
  const { user: authUser, isAuthenticated } = useAuth();
  const reduxUser = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  // State management
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showSettings, setShowSettings] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Dashboard data state
  const [dashboardData, setDashboardData] = useState({
    overview: {
      totalPatients: 15847,
      totalDoctors: 342,
      totalNurses: 1248,
      totalStaff: 2156,
      todayAppointments: 458,
      todayAdmissions: 127,
      todayDischarges: 89,
      activeBeds: 1456,
      availableBeds: 234,
      occupancyRate: 86.2,
      emergencyCases: 23,
      surgeries: 45,
      revenue: 2456780,
      expenses: 1876543
    },
    departments: [
      { name: 'Emergency', patients: 156, utilization: 89, status: 'high' },
      { name: 'ICU', patients: 45, utilization: 95, status: 'critical' },
      { name: 'General Medicine', patients: 234, utilization: 78, status: 'normal' },
      { name: 'Surgery', patients: 67, utilization: 82, status: 'normal' },
      { name: 'Pediatrics', patients: 123, utilization: 65, status: 'low' },
      { name: 'Maternity', patients: 89, utilization: 71, status: 'normal' },
      { name: 'Cardiology', patients: 98, utilization: 88, status: 'high' },
      { name: 'Neurology', patients: 56, utilization: 74, status: 'normal' }
    ],
    aiInsights: [
      {
        type: 'alert',
        priority: 'high',
        title: 'ICU Capacity Warning',
        message: 'ICU utilization at 95% - Consider additional capacity',
        department: 'ICU',
        timestamp: new Date()
      },
      {
        type: 'recommendation',
        priority: 'medium',
        title: 'Staff Optimization',
        message: 'Recommend reallocating 3 nurses from Pediatrics to Emergency',
        department: 'Emergency',
        timestamp: new Date()
      },
      {
        type: 'insight',
        priority: 'low',
        title: 'Patient Flow Prediction',
        message: 'Expected 15% increase in appointments next week',
        department: 'General',
        timestamp: new Date()
      }
    ],
    recentActivities: [
      { time: '2 min ago', activity: 'New patient admitted to ICU', department: 'ICU', type: 'admission' },
      { time: '5 min ago', activity: 'Emergency surgery completed successfully', department: 'Surgery', type: 'surgery' },
      { time: '8 min ago', activity: 'Lab results ready for patient #12457', department: 'Pathology', type: 'lab' },
      { time: '12 min ago', activity: 'MRI scan scheduled for tomorrow', department: 'Radiology', type: 'appointment' },
      { time: '15 min ago', activity: 'Discharge processed for patient #11892', department: 'General Medicine', type: 'discharge' }
    ]
  });

  // Charts configuration
  const chartOptions = useMemo(() => ({
    patientFlow: {
      series: [{
        name: 'Admissions',
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 67, 65, 68]
      }, {
        name: 'Discharges', 
        data: [35, 41, 36, 26, 45, 48, 52, 53, 41, 43, 47, 45]
      }],
      chart: {
        type: 'area',
        height: 350,
        toolbar: { show: true }
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 90, 100]
        }
      }
    },
    departmentUtilization: {
      series: [89, 95, 78, 82, 65, 71, 88, 74],
      chart: {
        type: 'donut',
        height: 350
      },
      labels: ['Emergency', 'ICU', 'General Med', 'Surgery', 'Pediatrics', 'Maternity', 'Cardiology', 'Neurology'],
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#A8E6CF']
    },
    revenueAnalytics: {
      series: [{
        name: 'Revenue',
        data: [1200000, 1350000, 1180000, 1420000, 1560000, 1380000, 1650000, 1720000, 1480000, 1590000, 1670000, 1850000]
      }, {
        name: 'Expenses',
        data: [980000, 1050000, 920000, 1100000, 1200000, 1080000, 1250000, 1300000, 1150000, 1220000, 1280000, 1400000]
      }],
      chart: {
        type: 'bar',
        height: 350,
        toolbar: { show: true }
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      }
    }
  }), []);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API calls for real-time data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update timestamp
      setLastUpdated(new Date());
      
      // In real implementation, fetch from multiple APIs:
      // - Hospital statistics
      // - Department utilization
      // - Patient flow data
      // - Financial metrics
      // - AI insights
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-refresh effect
  useEffect(() => {
    fetchDashboardData();
    
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchDashboardData();
      }, MAIN_DASHBOARD_CONFIG.refreshInterval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, fetchDashboardData]);

  // Quick stats cards
  const renderQuickStats = () => (
    <Row className="mb-4">
      <Col md={6} lg={3}>
        <Card className="bg-primary text-white h-100">
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-white-50 mb-0">Total Patients</h6>
                <h3 className="mb-0">
                  <CountUp start={0} end={dashboardData.overview.totalPatients} duration={2} separator="," />
                </h3>
              </div>
              <div className="rounded-circle bg-white bg-opacity-25 p-3">
                <RiUserFill size={24} />
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col md={6} lg={3}>
        <Card className="bg-success text-white h-100">
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-white-50 mb-0">Medical Staff</h6>
                <h3 className="mb-0">
                  <CountUp start={0} end={dashboardData.overview.totalDoctors + dashboardData.overview.totalNurses} duration={2} separator="," />
                </h3>
              </div>
              <div className="rounded-circle bg-white bg-opacity-25 p-3">
                <RiGroupFill size={24} />
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col md={6} lg={3}>
        <Card className="bg-info text-white h-100">
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-white-50 mb-0">Bed Occupancy</h6>
                <h3 className="mb-0">{dashboardData.overview.occupancyRate}%</h3>
              </div>
              <div className="rounded-circle bg-white bg-opacity-25 p-3">
                <RiHospitalFill size={24} />
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col md={6} lg={3}>
        <Card className="bg-warning text-white h-100">
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-white-50 mb-0">Today's Revenue</h6>
                <h3 className="mb-0">
                  $<CountUp start={0} end={dashboardData.overview.revenue} duration={2} separator="," />
                </h3>
              </div>
              <div className="rounded-circle bg-white bg-opacity-25 p-3">
                <RiMoneyDollarCircleFill size={24} />
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  // Department cards
  const renderDepartmentCards = () => (
    <Row className="mb-4">
      {DEPARTMENTS.map((dept) => (
        <Col md={6} lg={4} xl={3} key={dept.id} className="mb-3">
          <Card className="h-100 border-0 shadow-sm hover-card">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-3">
                <div className={`rounded-circle bg-${dept.color} bg-opacity-10 p-3 me-3`}>
                  <dept.icon size={24} className={`text-${dept.color}`} />
                </div>
                <div>
                  <h6 className="mb-1">{dept.name}</h6>
                  <small className="text-muted">{dept.description}</small>
                </div>
              </div>
              <div className="d-grid">
                <Button 
                  variant={`outline-${dept.color}`} 
                  size="sm"
                  as={Link}
                  to={dept.route}
                >
                  <RiEyeFill size={16} className="me-1" />
                  View Dashboard
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );

  // AI Insights panel
  const renderAIInsights = () => (
    <Card className="mb-4">
      <Card.Header className="bg-primary text-white">
        <div className="d-flex align-items-center justify-content-between">
          <h5 className="mb-0">
            <RiBrainFill className="me-2" />
            AI-Powered Insights
          </h5>
          <Badge bg="light" text="dark">Live</Badge>
        </div>
      </Card.Header>
      <Card.Body>
        {dashboardData.aiInsights.map((insight, index) => (
          <Alert 
            key={index}
            variant={insight.priority === 'high' ? 'danger' : insight.priority === 'medium' ? 'warning' : 'info'}
            className="d-flex align-items-center justify-content-between"
          >
            <div>
              <strong>{insight.title}</strong>
              <p className="mb-0 mt-1">{insight.message}</p>
              <small className="text-muted">{insight.department} • {insight.timestamp.toLocaleTimeString()}</small>
            </div>
            <div>
              <Badge bg={insight.priority === 'high' ? 'danger' : insight.priority === 'medium' ? 'warning' : 'info'}>
                {insight.type}
              </Badge>
            </div>
          </Alert>
        ))}
      </Card.Body>
    </Card>
  );

  // Recent activities
  const renderRecentActivities = () => (
    <Card className="mb-4">
      <Card.Header>
        <h5 className="mb-0">
          <RiTimeFill className="me-2" />
          Recent Activities
        </h5>
      </Card.Header>
      <Card.Body>
        <ListGroup variant="flush">
          {dashboardData.recentActivities.map((activity, index) => (
            <ListGroup.Item key={index} className="d-flex align-items-center justify-content-between px-0">
              <div>
                <div className="fw-medium">{activity.activity}</div>
                <small className="text-muted">{activity.department} • {activity.time}</small>
              </div>
              <Badge bg="light" text="dark">{activity.type}</Badge>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );

  // Loading state
  if (loading && lastUpdated.getTime() === new Date().setHours(0, 0, 0, 0)) {
    return (
      <Container fluid className="py-4">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <h5 className="mt-3">Loading Healthcare Management Dashboard...</h5>
        </div>
      </Container>
    );
  }

  return (
    <>
    <Container fluid className="py-4">
      {/* Header Section */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h1 className="h3 mb-1">
                <RiDashboardFill className="me-2 text-primary" />
                {MAIN_DASHBOARD_CONFIG.title}
              </h1>
              <p className="text-muted mb-0">{MAIN_DASHBOARD_CONFIG.subtitle}</p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <Badge bg="success" className="px-3 py-2">
                <RiShieldCheckFill className="me-1" />
                System Online
              </Badge>
              <Button variant="outline-primary" size="sm" onClick={() => setShowSettings(true)}>
                <RiSettings3Fill className="me-1" />
                Settings
              </Button>
              <Button variant="outline-secondary" size="sm" onClick={fetchDashboardData}>
                <RiRefreshLine className="me-1" />
                Refresh
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Quick Statistics */}
      {renderQuickStats()}

      {/* Tab Navigation */}
      <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey="overview">Overview</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="departments">Departments</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="analytics">Analytics</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="usage-tracking">Usage Tracking</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="ai-insights">AI Insights</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          {/* Overview Tab */}
          <Tab.Pane eventKey="overview">
            <Row>
              <Col lg={8}>
                <Card className="mb-4">
                  <Card.Header>
                    <h5 className="mb-0">Patient Flow Analytics</h5>
                  </Card.Header>
                  <Card.Body>
                    <Chart 
                      options={chartOptions.patientFlow} 
                      series={chartOptions.patientFlow.series} 
                      type="area" 
                      height={350} 
                    />
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={4}>
                {renderRecentActivities()}
              </Col>
            </Row>
          </Tab.Pane>

          {/* Departments Tab */}
          <Tab.Pane eventKey="departments">
            {renderDepartmentCards()}
            
            <Card>
              <Card.Header>
                <h5 className="mb-0">Department Utilization</h5>
              </Card.Header>
              <Card.Body>
                <Chart 
                  options={chartOptions.departmentUtilization} 
                  series={chartOptions.departmentUtilization.series} 
                  type="donut" 
                  height={350} 
                />
              </Card.Body>
            </Card>
          </Tab.Pane>

          {/* Analytics Tab */}
          <Tab.Pane eventKey="analytics">
            <Row>
              <Col lg={6}>
                <Card className="mb-4">
                  <Card.Header>
                    <h5 className="mb-0">Revenue vs Expenses</h5>
                  </Card.Header>
                  <Card.Body>
                    <Chart 
                      options={chartOptions.revenueAnalytics} 
                      series={chartOptions.revenueAnalytics.series} 
                      type="bar" 
                      height={350} 
                    />
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={6}>
                <Card className="mb-4">
                  <Card.Header>
                    <h5 className="mb-0">Key Performance Indicators</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>Patient Satisfaction</span>
                        <span>94%</span>
                      </div>
                      <ProgressBar variant="success" now={94} />
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>Staff Efficiency</span>
                        <span>87%</span>
                      </div>
                      <ProgressBar variant="info" now={87} />
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>Resource Utilization</span>
                        <span>82%</span>
                      </div>
                      <ProgressBar variant="warning" now={82} />
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>Quality Score</span>
                        <span>96%</span>
                      </div>
                      <ProgressBar variant="primary" now={96} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>

          {/* Usage Tracking Tab */}
          <Tab.Pane eventKey="usage-tracking">
            <UsageTracker userId={authUser?.id || reduxUser?.id} />
          </Tab.Pane>

          {/* AI Insights Tab */}
          <Tab.Pane eventKey="ai-insights">
            {renderAIInsights()}
            
            <Row>
              <Col lg={6}>
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">
                      <RiRobotFill className="me-2" />
                      AI Recommendations
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <ListGroup variant="flush">
                      <ListGroup.Item className="d-flex align-items-center">
                        <RiLightbulbFill className="text-warning me-3" />
                        <div>
                          <strong>Optimize Surgery Schedule</strong>
                          <p className="mb-0 text-muted">AI suggests rescheduling 3 non-urgent surgeries to balance OR utilization</p>
                        </div>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex align-items-center">
                        <RiLightbulbFill className="text-info me-3" />
                        <div>
                          <strong>Inventory Management</strong>
                          <p className="mb-0 text-muted">Predicted shortage of surgical masks in 5 days based on usage patterns</p>
                        </div>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex align-items-center">
                        <RiLightbulbFill className="text-success me-3" />
                        <div>
                          <strong>Patient Discharge Planning</strong>
                          <p className="mb-0 text-muted">12 patients ready for discharge based on recovery indicators</p>
                        </div>
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={6}>
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">
                      <RiStarFill className="me-2" />
                      System Health
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>Database Performance</span>
                        <Badge bg="success">Excellent</Badge>
                      </div>
                      <ProgressBar variant="success" now={95} />
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>API Response Time</span>
                        <Badge bg="success">Good</Badge>
                      </div>
                      <ProgressBar variant="success" now={88} />
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>System Load</span>
                        <Badge bg="warning">Moderate</Badge>
                      </div>
                      <ProgressBar variant="warning" now={72} />
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>Security Status</span>
                        <Badge bg="success">Secure</Badge>
                      </div>
                      <ProgressBar variant="success" now={100} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      {/* Footer Info */}
      <Row className="mt-4">
        <Col>
          <Card className="bg-light border-0">
            <Card.Body className="text-center py-2">
              <small className="text-muted">
                Last updated: {lastUpdated.toLocaleString()} | 
                Auto-refresh: {autoRefresh ? 'Enabled' : 'Disabled'} | 
                Data sources: 9 healthcare modules
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    
    {/* Floating Clock Counter */}
    <ClockCounter 
      position="fixed"
      top="80px"
      right="20px"
      showMonthly={true}
      compact={false}
    />
    </>
  );
};

export default MainDashboard;
