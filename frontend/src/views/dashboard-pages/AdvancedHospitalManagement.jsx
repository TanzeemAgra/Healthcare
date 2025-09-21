/**
 * Advanced Hospital Management System Dashboard
 * 
 * Comprehensive hospital operations management with enterprise-level features:
 * - Real-time operational monitoring
 * - Advanced patient flow management
 * - Staff scheduling and resource optimization
 * - Financial analytics and revenue tracking
 * - Quality metrics and compliance monitoring
 * - Emergency response coordination
 * - Predictive analytics and AI insights
 * - Multi-department integration
 * - Advanced reporting and analytics
 * - Inventory and supply chain management
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
  ToastContainer,
  OverlayTrigger,
  Tooltip,
  ButtonGroup
} from 'react-bootstrap';
import { 
  RiHospitalFill,
  RiUserHeartFill,
  RiStethoscopeFill,
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
  RiLightbulbFill,
  RiMedicineBottleFill,
  RiTestTubeFill,
  RiScanLine,
  RiMicroscopeLine,
  RiCarFill,
  RiShieldFill,
  RiThermometerFill,
  RiHeartLine,
  RiUserStarFill,
  RiShoppingCartFill,
  RiFileListFill,
  RiDashboardFill,
  RiWifiLine,
  RiDatabase2Fill,
  RiServerFill,
  RiCloudFill,
  RiLockFill,
  RiErrorWarningFill,
  RiCheckboxCircleFill,
  RiAddCircleFill,
  RiEditFill,
  RiDeleteBinFill,
  RiZoomInFill,
  RiPrinterFill,
  RiShareFill,
  RiMailFill,
  RiPhoneFill,
  RiMapPin2Fill,
  RiGlobalFill,
  RiArrowUpLine,
  RiArrowDownLine
} from '@remixicon/react';
import Chart from 'react-apexcharts';
import CountUp from 'react-countup';
import { useAuth } from "../../contexts/AuthContext";
import { useSelector } from 'react-redux';

// Advanced Hospital Management Configuration
const HOSPITAL_CONFIG = {
  name: 'Alfiya Medical Center',
  type: 'Multi-Specialty Hospital',
  capacity: 500,
  departments: 12,
  refreshInterval: 5000,
  features: {
    realTimeMonitoring: true,
    aiPredictiveAnalytics: true,
    emergencyAlerts: true,
    inventoryManagement: true,
    staffScheduling: true,
    qualityMetrics: true,
    financialTracking: true,
    patientPortal: true,
    telemedicine: true,
    iotIntegration: true
  }
};

const AdvancedHospitalManagement = () => {
  const { user: authUser, isAuthenticated } = useAuth();
  const reduxUser = useSelector((state) => state.auth.user);

  // State Management
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showModal, setShowModal] = useState({ type: null, show: false, data: null });
  const [notifications, setNotifications] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [dateRange, setDateRange] = useState('today');

  // Comprehensive Hospital Data
  const [hospitalData, setHospitalData] = useState({
    overview: {
      totalPatients: 2847,
      inpatients: 456,
      outpatients: 234,
      emergencyPatients: 67,
      dischargedToday: 89,
      admittedToday: 112,
      totalStaff: 1248,
      doctors: 234,
      nurses: 567,
      support: 447,
      bedOccupancy: 87.5,
      availableBeds: 63,
      totalBeds: 500,
      averageStay: 4.2,
      patientSatisfaction: 94.7,
      mortalityRate: 1.2,
      readmissionRate: 8.4,
      revenue: 2456780,
      expenses: 1876543,
      profit: 580237
    },
    departments: [
      { 
        id: 'emergency', 
        name: 'Emergency Medicine', 
        patients: 67, 
        capacity: 80, 
        utilization: 83.75, 
        staff: 24, 
        status: 'high',
        avgWaitTime: 15,
        criticalCases: 8,
        revenue: 145000
      },
      { 
        id: 'icu', 
        name: 'Intensive Care Unit', 
        patients: 45, 
        capacity: 50, 
        utilization: 90, 
        staff: 35, 
        status: 'critical',
        avgStay: 7.5,
        mortality: 12.5,
        revenue: 234000
      },
      { 
        id: 'cardiology', 
        name: 'Cardiology', 
        patients: 89, 
        capacity: 100, 
        utilization: 89, 
        staff: 28, 
        status: 'high',
        procedures: 23,
        success: 96.8,
        revenue: 456000
      },
      { 
        id: 'surgery', 
        name: 'Surgery', 
        patients: 156, 
        capacity: 180, 
        utilization: 86.67, 
        staff: 45, 
        status: 'normal',
        operations: 34,
        success: 98.2,
        revenue: 678000
      },
      { 
        id: 'pediatrics', 
        name: 'Pediatrics', 
        patients: 123, 
        capacity: 150, 
        utilization: 82, 
        staff: 32, 
        status: 'normal',
        vaccination: 45,
        satisfaction: 97.2,
        revenue: 234000
      },
      { 
        id: 'maternity', 
        name: 'Maternity Ward', 
        patients: 78, 
        capacity: 90, 
        utilization: 86.67, 
        staff: 28, 
        status: 'normal',
        deliveries: 12,
        complications: 2.1,
        revenue: 345000
      },
      { 
        id: 'oncology', 
        name: 'Oncology', 
        patients: 67, 
        capacity: 75, 
        utilization: 89.33, 
        staff: 22, 
        status: 'high',
        treatments: 89,
        survival: 87.5,
        revenue: 567000
      },
      { 
        id: 'orthopedics', 
        name: 'Orthopedics', 
        patients: 94, 
        capacity: 110, 
        utilization: 85.45, 
        staff: 18, 
        status: 'normal',
        surgeries: 23,
        recovery: 94.3,
        revenue: 345000
      }
    ],
    financials: {
      monthlyRevenue: [2100000, 2350000, 2180000, 2420000, 2560000, 2380000, 2650000, 2720000, 2480000, 2590000, 2670000, 2456780],
      monthlyExpenses: [1680000, 1750000, 1620000, 1800000, 1900000, 1680000, 1950000, 2000000, 1850000, 1920000, 1980000, 1876543],
      departmentRevenue: {
        surgery: 678000,
        oncology: 567000,
        cardiology: 456000,
        maternity: 345000,
        orthopedics: 345000,
        pediatrics: 234000,
        icu: 234000,
        emergency: 145000
      }
    },
    quality: {
      patientSafety: 96.8,
      infectionControl: 98.2,
      medicationSafety: 97.5,
      fallPrevention: 94.3,
      handHygiene: 98.7,
      timelyTreatment: 89.4,
      communicationScore: 92.1,
      overallQuality: 95.3
    },
    inventory: {
      medications: { total: 2456, lowStock: 23, expired: 8, value: 234567 },
      equipment: { total: 1234, maintenance: 45, operational: 1189, value: 5678901 },
      supplies: { total: 5678, lowStock: 156, ordered: 234, value: 123456 }
    },
    staffing: {
      totalStaff: 1248,
      onDuty: 867,
      onLeave: 123,
      overtime: 89,
      satisfaction: 87.3,
      turnover: 12.4,
      vacancies: 45
    }
  });

  // Real-time alerts and notifications
  const [liveAlerts, setLiveAlerts] = useState([
    {
      id: 1,
      type: 'critical',
      title: 'ICU Capacity Alert',
      message: 'ICU at 90% capacity - Consider additional beds',
      department: 'ICU',
      timestamp: new Date(),
      action: 'Review bed allocation'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Medication Low Stock',
      message: '23 medications below minimum stock level',
      department: 'Pharmacy',
      timestamp: new Date(),
      action: 'Reorder inventory'
    },
    {
      id: 3,
      type: 'info',
      title: 'Staff Schedule Update',
      message: 'Emergency department shift change in 30 minutes',
      department: 'Emergency',
      timestamp: new Date(),
      action: 'Confirm handover'
    }
  ]);

  // Chart configurations for advanced analytics
  const chartConfigs = useMemo(() => ({
    patientFlow: {
      series: [{
        name: 'Admissions',
        data: [45, 52, 59, 42, 36, 81, 92, 76, 61, 49, 34, 67]
      }, {
        name: 'Discharges',
        data: [35, 41, 36, 26, 45, 48, 52, 53, 41, 43, 47, 56]
      }, {
        name: 'Transfers',
        data: [12, 15, 18, 14, 22, 19, 25, 21, 17, 16, 14, 23]
      }],
      chart: {
        type: 'area',
        height: 350,
        toolbar: { show: true },
        zoom: { enabled: true }
      },
      colors: ['#28a745', '#dc3545', '#ffc107'],
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3
        }
      }
    },
    departmentUtilization: {
      series: hospitalData.departments.map(dept => dept.utilization),
      chart: {
        type: 'donut',
        height: 380
      },
      labels: hospitalData.departments.map(dept => dept.name),
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#A8E6CF'],
      legend: {
        position: 'bottom'
      }
    },
    financialTrends: {
      series: [{
        name: 'Revenue',
        data: hospitalData.financials.monthlyRevenue
      }, {
        name: 'Expenses',
        data: hospitalData.financials.monthlyExpenses
      }, {
        name: 'Profit',
        data: hospitalData.financials.monthlyRevenue.map((rev, idx) => rev - hospitalData.financials.monthlyExpenses[idx])
      }],
      chart: {
        type: 'line',
        height: 350,
        toolbar: { show: true }
      },
      colors: ['#28a745', '#dc3545', '#007bff'],
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      }
    },
    qualityMetrics: {
      series: [{
        name: 'Quality Score',
        data: [96.8, 98.2, 97.5, 94.3, 98.7, 89.4, 92.1, 95.3]
      }],
      chart: {
        type: 'radar',
        height: 350
      },
      xaxis: {
        categories: ['Patient Safety', 'Infection Control', 'Medication Safety', 'Fall Prevention', 'Hand Hygiene', 'Timely Treatment', 'Communication', 'Overall Quality']
      },
      colors: ['#007bff']
    }
  }), [hospitalData]);

  // Fetch hospital data
  const fetchHospitalData = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate real-time data updates
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update timestamp
      setLastUpdated(new Date());
      
      // In production, fetch from multiple endpoints:
      // - Real-time patient data
      // - Staff schedules
      // - Financial metrics
      // - Quality indicators
      // - Inventory levels
      
    } catch (error) {
      console.error('Error fetching hospital data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-refresh effect
  useEffect(() => {
    fetchHospitalData();
    
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchHospitalData();
      }, HOSPITAL_CONFIG.refreshInterval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, fetchHospitalData]);

  // Emergency KPI Cards
  const renderKPICards = () => (
    <Row className="mb-4">
      <Col md={6} lg={3}>
        <Card className="bg-primary text-white h-100 hover-card">
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-white-50 mb-0">Total Patients</h6>
                <h3 className="mb-0">
                  <CountUp start={0} end={hospitalData.overview.totalPatients} duration={2} separator="," />
                </h3>
                <small>↑ 12% from last month</small>
              </div>
              <div className="rounded-circle bg-white bg-opacity-25 p-3">
                <RiUserHeartFill size={28} />
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col md={6} lg={3}>
        <Card className="bg-success text-white h-100 hover-card">
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-white-50 mb-0">Bed Occupancy</h6>
                <h3 className="mb-0">{hospitalData.overview.bedOccupancy}%</h3>
                <small>{hospitalData.overview.availableBeds} beds available</small>
              </div>
              <div className="rounded-circle bg-white bg-opacity-25 p-3">
                <RiHospitalFill size={28} />
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col md={6} lg={3}>
        <Card className="bg-warning text-white h-100 hover-card">
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-white-50 mb-0">Patient Satisfaction</h6>
                <h3 className="mb-0">{hospitalData.overview.patientSatisfaction}%</h3>
                <small>↑ 2.3% improvement</small>
              </div>
              <div className="rounded-circle bg-white bg-opacity-25 p-3">
                <RiStarFill size={28} />
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col md={6} lg={3}>
        <Card className="bg-info text-white h-100 hover-card">
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-white-50 mb-0">Monthly Revenue</h6>
                <h3 className="mb-0">
                  $<CountUp start={0} end={hospitalData.overview.revenue} duration={2} separator="," />
                </h3>
                <small>Profit: ${hospitalData.overview.profit.toLocaleString()}</small>
              </div>
              <div className="rounded-circle bg-white bg-opacity-25 p-3">
                <RiMoneyDollarCircleFill size={28} />
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  // Real-time alerts panel
  const renderAlertsPanel = () => (
    <Card className="mb-4">
      <Card.Header className="bg-danger text-white">
        <div className="d-flex align-items-center justify-content-between">
          <h5 className="mb-0">
            <RiAlertFill className="me-2" />
            Real-time Alerts & Notifications
          </h5>
          <Badge bg="light" text="dark">{liveAlerts.length} Active</Badge>
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        <ListGroup variant="flush">
          {liveAlerts.map((alert) => (
            <ListGroup.Item key={alert.id} className={`border-start border-4 border-${alert.type === 'critical' ? 'danger' : alert.type === 'warning' ? 'warning' : 'info'}`}>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="d-flex align-items-center mb-1">
                    <Badge bg={alert.type === 'critical' ? 'danger' : alert.type === 'warning' ? 'warning' : 'info'} className="me-2">
                      {alert.type.toUpperCase()}
                    </Badge>
                    <strong>{alert.title}</strong>
                  </div>
                  <p className="mb-1">{alert.message}</p>
                  <small className="text-muted">
                    {alert.department} • {alert.timestamp.toLocaleTimeString()} • Action: {alert.action}
                  </small>
                </div>
                <Button variant="outline-primary" size="sm">
                  <RiEyeFill size={16} />
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );

  // Department overview cards
  const renderDepartmentCards = () => (
    <Row className="mb-4">
      {hospitalData.departments.map((dept) => (
        <Col md={6} lg={4} xl={3} key={dept.id} className="mb-3">
          <Card className={`h-100 border-0 shadow-sm hover-card border-start border-4 border-${
            dept.status === 'critical' ? 'danger' : 
            dept.status === 'high' ? 'warning' : 'success'
          }`}>
            <Card.Body className="p-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h6 className="mb-0">{dept.name}</h6>
                <Badge bg={dept.status === 'critical' ? 'danger' : dept.status === 'high' ? 'warning' : 'success'}>
                  {dept.status}
                </Badge>
              </div>
              
              <div className="mb-2">
                <div className="d-flex justify-content-between mb-1">
                  <small>Utilization</small>
                  <small>{dept.utilization.toFixed(1)}%</small>
                </div>
                <ProgressBar 
                  variant={dept.status === 'critical' ? 'danger' : dept.status === 'high' ? 'warning' : 'success'} 
                  now={dept.utilization} 
                  size="sm"
                />
              </div>

              <Row className="text-center">
                <Col>
                  <div className="border-end">
                    <h6 className="mb-0">{dept.patients}</h6>
                    <small className="text-muted">Patients</small>
                  </div>
                </Col>
                <Col>
                  <div className="border-end">
                    <h6 className="mb-0">{dept.staff}</h6>
                    <small className="text-muted">Staff</small>
                  </div>
                </Col>
                <Col>
                  <h6 className="mb-0 text-success">${(dept.revenue / 1000).toFixed(0)}K</h6>
                  <small className="text-muted">Revenue</small>
                </Col>
              </Row>

              <div className="mt-2 d-grid">
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => setShowModal({ type: 'department', show: true, data: dept })}
                >
                  <RiEyeFill size={14} className="me-1" />
                  View Details
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );

  // Advanced analytics dashboard
  const renderAnalytics = () => (
    <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
      <Nav variant="pills" className="mb-4">
        <Nav.Item>
          <Nav.Link eventKey="overview">Overview</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="departments">Departments</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="financial">Financial</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="quality">Quality</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="staff">Staffing</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="inventory">Inventory</Nav.Link>
        </Nav.Item>
      </Nav>

      <Tab.Content>
        <Tab.Pane eventKey="overview">
          <Row>
            <Col lg={8}>
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Patient Flow Analytics</h5>
                </Card.Header>
                <Card.Body>
                  <Chart 
                    options={chartConfigs.patientFlow} 
                    series={chartConfigs.patientFlow.series} 
                    type="area" 
                    height={350} 
                  />
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4}>
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Key Metrics</h5>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Average Length of Stay</span>
                      <strong>{hospitalData.overview.averageStay} days</strong>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Readmission Rate</span>
                      <strong>{hospitalData.overview.readmissionRate}%</strong>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Mortality Rate</span>
                      <strong>{hospitalData.overview.mortalityRate}%</strong>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Staff Satisfaction</span>
                      <strong>{hospitalData.staffing.satisfaction}%</strong>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab.Pane>

        <Tab.Pane eventKey="departments">
          {renderDepartmentCards()}
          <Card>
            <Card.Header>
              <h5 className="mb-0">Department Utilization Overview</h5>
            </Card.Header>
            <Card.Body>
              <Chart 
                options={chartConfigs.departmentUtilization} 
                series={chartConfigs.departmentUtilization.series} 
                type="donut" 
                height={380} 
              />
            </Card.Body>
          </Card>
        </Tab.Pane>

        <Tab.Pane eventKey="financial">
          <Row>
            <Col lg={8}>
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Financial Trends Analysis</h5>
                </Card.Header>
                <Card.Body>
                  <Chart 
                    options={chartConfigs.financialTrends} 
                    series={chartConfigs.financialTrends.series} 
                    type="line" 
                    height={350} 
                  />
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4}>
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Revenue by Department</h5>
                </Card.Header>
                <Card.Body>
                  {Object.entries(hospitalData.financials.departmentRevenue)
                    .sort(([,a], [,b]) => b - a)
                    .map(([dept, revenue]) => (
                      <div key={dept} className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-capitalize">{dept}</span>
                        <strong>${(revenue / 1000).toFixed(0)}K</strong>
                      </div>
                    ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab.Pane>

        <Tab.Pane eventKey="quality">
          <Row>
            <Col lg={6}>
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Quality Metrics Radar</h5>
                </Card.Header>
                <Card.Body>
                  <Chart 
                    options={chartConfigs.qualityMetrics} 
                    series={chartConfigs.qualityMetrics.series} 
                    type="radar" 
                    height={350} 
                  />
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6}>
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Quality Indicators</h5>
                </Card.Header>
                <Card.Body>
                  {Object.entries(hospitalData.quality).map(([metric, score]) => (
                    <div key={metric} className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="text-capitalize">{metric.replace(/([A-Z])/g, ' $1')}</span>
                        <span>{score}%</span>
                      </div>
                      <ProgressBar 
                        variant={score >= 95 ? 'success' : score >= 90 ? 'warning' : 'danger'} 
                        now={score} 
                      />
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab.Pane>

        <Tab.Pane eventKey="staff">
          <Row>
            <Col lg={6}>
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Staff Overview</h5>
                </Card.Header>
                <Card.Body>
                  <Row className="text-center">
                    <Col md={4}>
                      <div className="border rounded p-3 mb-3">
                        <RiGroupFill size={32} className="text-primary mb-2" />
                        <h4>{hospitalData.staffing.totalStaff}</h4>
                        <small className="text-muted">Total Staff</small>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="border rounded p-3 mb-3">
                        <RiUserStarFill size={32} className="text-success mb-2" />
                        <h4>{hospitalData.staffing.onDuty}</h4>
                        <small className="text-muted">On Duty</small>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="border rounded p-3 mb-3">
                        <RiTimeFill size={32} className="text-warning mb-2" />
                        <h4>{hospitalData.staffing.overtime}</h4>
                        <small className="text-muted">Overtime</small>
                      </div>
                    </Col>
                  </Row>
                  
                  <div className="mt-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Staff Satisfaction</span>
                      <span>{hospitalData.staffing.satisfaction}%</span>
                    </div>
                    <ProgressBar variant="info" now={hospitalData.staffing.satisfaction} />
                  </div>
                  
                  <div className="mt-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Turnover Rate</span>
                      <span>{hospitalData.staffing.turnover}%</span>
                    </div>
                    <ProgressBar variant="warning" now={hospitalData.staffing.turnover} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6}>
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Staff Distribution</h5>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Doctors</span>
                      <Badge bg="primary">{hospitalData.overview.doctors}</Badge>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Nurses</span>
                      <Badge bg="success">{hospitalData.overview.nurses}</Badge>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Support Staff</span>
                      <Badge bg="info">{hospitalData.overview.support}</Badge>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>On Leave</span>
                      <Badge bg="warning">{hospitalData.staffing.onLeave}</Badge>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Vacancies</span>
                      <Badge bg="danger">{hospitalData.staffing.vacancies}</Badge>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab.Pane>

        <Tab.Pane eventKey="inventory">
          <Row>
            <Col lg={4}>
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">
                    <RiMedicineBottleFill className="me-2" />
                    Medications
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div className="text-center mb-3">
                    <h3 className="text-primary">{hospitalData.inventory.medications.total}</h3>
                    <small className="text-muted">Total Items</small>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Low Stock</span>
                    <Badge bg="warning">{hospitalData.inventory.medications.lowStock}</Badge>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Expired</span>
                    <Badge bg="danger">{hospitalData.inventory.medications.expired}</Badge>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Total Value</span>
                    <strong>${hospitalData.inventory.medications.value.toLocaleString()}</strong>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={4}>
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">
                    <RiHeartPulseFill className="me-2" />
                    Equipment
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div className="text-center mb-3">
                    <h3 className="text-success">{hospitalData.inventory.equipment.total}</h3>
                    <small className="text-muted">Total Equipment</small>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Operational</span>
                    <Badge bg="success">{hospitalData.inventory.equipment.operational}</Badge>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Under Maintenance</span>
                    <Badge bg="warning">{hospitalData.inventory.equipment.maintenance}</Badge>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Total Value</span>
                    <strong>${hospitalData.inventory.equipment.value.toLocaleString()}</strong>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={4}>
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">
                    <RiShoppingCartFill className="me-2" />
                    Supplies
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div className="text-center mb-3">
                    <h3 className="text-info">{hospitalData.inventory.supplies.total}</h3>
                    <small className="text-muted">Total Supplies</small>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Low Stock</span>
                    <Badge bg="warning">{hospitalData.inventory.supplies.lowStock}</Badge>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>On Order</span>
                    <Badge bg="info">{hospitalData.inventory.supplies.ordered}</Badge>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Total Value</span>
                    <strong>${hospitalData.inventory.supplies.value.toLocaleString()}</strong>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab.Pane>
      </Tab.Content>
    </Tab.Container>
  );

  // Loading state
  if (loading && lastUpdated.getTime() === new Date().setHours(0, 0, 0, 0)) {
    return (
      <Container fluid className="py-4">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <h5 className="mt-3">Loading Advanced Hospital Management System...</h5>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Header Section */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h1 className="h3 mb-1">
                <RiHospitalFill className="me-2 text-primary" />
                Advanced Hospital Management System
              </h1>
              <p className="text-muted mb-0">
                {HOSPITAL_CONFIG.name} - {HOSPITAL_CONFIG.type} | 
                Capacity: {HOSPITAL_CONFIG.capacity} beds | 
                Departments: {HOSPITAL_CONFIG.departments}
              </p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <Badge bg="success" className="px-3 py-2">
                <RiShieldCheckFill className="me-1" />
                System Operational
              </Badge>
              <Button variant="outline-primary" size="sm" onClick={() => setShowModal({ type: 'settings', show: true })}>
                <RiSettings3Fill className="me-1" />
                Settings
              </Button>
              <Button variant="outline-secondary" size="sm" onClick={fetchHospitalData}>
                <RiRefreshLine className="me-1" />
                Refresh
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* KPI Cards */}
      {renderKPICards()}

      {/* Real-time Alerts */}
      {renderAlertsPanel()}

      {/* Advanced Analytics Dashboard */}
      {renderAnalytics()}

      {/* Footer Info */}
      <Row className="mt-4">
        <Col>
          <Card className="bg-light border-0">
            <Card.Body className="text-center py-2">
              <small className="text-muted">
                Last updated: {lastUpdated.toLocaleString()} | 
                Auto-refresh: {autoRefresh ? 'Enabled' : 'Disabled'} | 
                System uptime: 99.97% | 
                Active users: 1,248
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdvancedHospitalManagement;
