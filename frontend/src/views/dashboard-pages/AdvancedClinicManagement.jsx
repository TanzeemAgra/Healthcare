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
  Form,
  Modal,
  Tab,
  Nav,
  InputGroup,
  ListGroup,
  Accordion,
  Toast,
  ToastContainer,
  Offcanvas
} from 'react-bootstrap';
import { 
  RiDashboardFill, 
  RiUserFill, 
  RiHeartPulseFill, 
  RiCalendarFill, 
  RiArrowUpCircleFill,
  RiArrowDownCircleFill,
  RiRefreshLine,
  RiSettings3Fill,
  RiFilterFill,
  RiEyeFill,
  RiBarChartBoxFill,
  RiLineChartFill,
  RiPieChartFill,
  RiRobotFill,
  RiBrainFill,
  RiMicFill,
  RiCameraFill,
  RiStethoscopeFill,
  RiMedicineBottleFill,
  RiHospitalFill,
  RiUserHeartFill,
  RiTestTubeFill,
  RiScanLine,
  RiAlarmWarningFill,
  RiLightbulbFill,
  RiTimeFill,
  RiMoneyDollarCircleFill,
  RiFileTextFill,
  RiNotificationFill,
  RiGroupFill,
  RiMapPinFill,
  RiPhoneFill,
  RiMailFill,
  RiSearchLine,
  RiAddCircleFill,
  RiEditFill,
  RiDeleteBinFill,
  RiPrinterFill,
  RiDownloadFill,
  RiShareFill,
  RiStarFill,
  RiAwardFill,
  RiShieldCheckFill,
  RiThermometerFill,
  RiFirstAidKitFill,
  RiPulseLine,
  RiMicroscopeLine,
  RiFlaskFill,
  RiCapsuleFill,
  RiSyringeFill,
  RiHeartLine,
  RiToothFill,
  RiBodyScanFill,
  RiTruckFill,
  RiWifiLine,
  RiDatabase2Fill,
  RiCloudFill,
  RiLockFill,
  RiUserStarFill,
  RiTeamFill,
  RiBookOpenFill,
  RiGraduationCapFill,
  RiCustomerServiceFill,
  RiQrCodeFill,
  RiFeedbackFill,
  RiSurveyFill,
  RiCheckboxCircleFill,
  RiCloseCircleFill,
  RiErrorWarningFill,
  RiInformationFill,
  RiCarFill,
  RiShoppingCartFill,
  RiFileListFill,
  RiWalletFill,
  RiSecurePaymentLine,
  RiServiceFill,
  RiGlobalFill,
  RiRadioFill,
  RiSignalTowerFill,
  RiHeartFill,
  RiShieldFill,
  RiDropLine,
  RiAddLine,
  RiEditLine,
  RiDeleteBinLine,
  RiCheckLine
} from '@remixicon/react';
import Chart from 'react-apexcharts';
import CountUp from 'react-countup';
import { useAuth } from "../../contexts/AuthContext";
import { useSelector } from 'react-redux';

const AdvancedClinicManagement = () => {
  const { currentUser } = useAuth();
  const authUser = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

  // Lab Test Management State (Soft Coding)
  const [labTests, setLabTests] = useState([]);
  const [labCategories, setLabCategories] = useState([]);
  const [showLabTestModal, setShowLabTestModal] = useState(false);
  const [selectedLabTest, setSelectedLabTest] = useState(null);
  const [labTestForm, setLabTestForm] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    normalRange: '',
    sampleType: '',
    turnaroundTime: '',
    isActive: true
  });

  // Clinic KPIs and Metrics
  const clinicKPIs = useMemo(() => [
    { 
      name: 'Daily Patients', 
      value: '148', 
      change: '+12%', 
      trend: 'up',
      icon: <RiUserFill className="text-primary" size={24} />,
      color: 'primary'
    },
    { 
      name: 'Appointments Today', 
      value: '89', 
      change: '+8%', 
      trend: 'up',
      icon: <RiCalendarFill className="text-success" size={24} />,
      color: 'success'
    },
    { 
      name: 'Revenue Today', 
      value: '$12,450', 
      change: '+15%', 
      trend: 'up',
      icon: <RiMoneyDollarCircleFill className="text-info" size={24} />,
      color: 'info'
    },
    { 
      name: 'Patient Satisfaction', 
      value: '4.8/5', 
      change: '+0.2', 
      trend: 'up',
      icon: <RiStarFill className="text-warning" size={24} />,
      color: 'warning'
    },
    { 
      name: 'Doctor Utilization', 
      value: '92%', 
      change: '+5%', 
      trend: 'up',
      icon: <RiUserHeartFill className="text-danger" size={24} />,
      color: 'danger'
    },
    { 
      name: 'Equipment Uptime', 
      value: '98.5%', 
      change: '+1%', 
      trend: 'up',
      icon: <RiStethoscopeFill className="text-secondary" size={24} />,
      color: 'secondary'
    }
  ], []);

  // Clinic Departments
  const clinicDepartments = useMemo(() => [
    { 
      name: 'General Medicine', 
      patients: 45, 
      doctors: 8, 
      revenue: '$5,200',
      utilization: 89,
      icon: <RiStethoscopeFill className="text-primary" size={20} />
    },
    { 
      name: 'Pediatrics', 
      patients: 32, 
      doctors: 5, 
      revenue: '$3,400',
      utilization: 76,
      icon: <RiHeartLine className="text-success" size={20} />
    },
    { 
      name: 'Dermatology', 
      patients: 28, 
      doctors: 4, 
      revenue: '$4,100',
      utilization: 82,
      icon: <RiBodyScanFill className="text-info" size={20} />
    },
    { 
      name: 'Cardiology', 
      patients: 21, 
      doctors: 3, 
      revenue: '$6,800',
      utilization: 94,
      icon: <RiHeartPulseFill className="text-danger" size={20} />
    },
    { 
      name: 'Ophthalmology', 
      patients: 19, 
      doctors: 3, 
      revenue: '$2,900',
      utilization: 71,
      icon: <RiEyeFill className="text-warning" size={20} />
    },
    { 
      name: 'Dental Care', 
      patients: 25, 
      doctors: 4, 
      revenue: '$3,700',
      utilization: 85,
      icon: <RiToothFill className="text-secondary" size={20} />
    }
  ], []);

  // Appointment Management
  const todaysAppointments = useMemo(() => [
    {
      time: '09:00 AM',
      patient: 'John Smith',
      doctor: 'Dr. Sarah Wilson',
      department: 'General Medicine',
      status: 'completed',
      type: 'consultation'
    },
    {
      time: '09:30 AM',
      patient: 'Maria Garcia',
      doctor: 'Dr. Michael Chen',
      department: 'Pediatrics',
      status: 'in-progress',
      type: 'follow-up'
    },
    {
      time: '10:00 AM',
      patient: 'Robert Johnson',
      doctor: 'Dr. Emily Davis',
      department: 'Cardiology',
      status: 'scheduled',
      type: 'check-up'
    },
    {
      time: '10:30 AM',
      patient: 'Lisa Anderson',
      doctor: 'Dr. James Brown',
      department: 'Dermatology',
      status: 'scheduled',
      type: 'consultation'
    },
    {
      time: '11:00 AM',
      patient: 'David Wilson',
      doctor: 'Dr. Anna Lee',
      department: 'Ophthalmology',
      status: 'scheduled',
      type: 'examination'
    }
  ], []);

  // Financial Analytics
  const revenueData = {
    series: [{
      name: 'Daily Revenue',
      data: [8500, 9200, 10100, 9800, 11200, 12450, 10900]
    }],
    options: {
      chart: { type: 'area', height: 300, toolbar: { show: false } },
      colors: ['#0d6efd'],
      fill: { type: 'gradient', gradient: { opacityFrom: 0.4, opacityTo: 0.1 } },
      xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
      yaxis: { title: { text: 'Revenue ($)' } },
      title: { text: 'Weekly Revenue Trend', align: 'left' }
    }
  };

  const patientFlowData = {
    series: [45, 32, 28, 21, 19, 25],
    options: {
      chart: { type: 'donut', height: 300 },
      labels: ['General Medicine', 'Pediatrics', 'Dermatology', 'Cardiology', 'Ophthalmology', 'Dental Care'],
      colors: ['#0d6efd', '#198754', '#17a2b8', '#dc3545', '#ffc107', '#6c757d'],
      legend: { position: 'bottom' },
      title: { text: 'Patient Distribution by Department', align: 'left' }
    }
  };

  // Staff Management
  const staffMembers = useMemo(() => [
    {
      name: 'Dr. Sarah Wilson',
      role: 'General Physician',
      department: 'General Medicine',
      status: 'available',
      patients: 12,
      rating: 4.9,
      experience: '8 years'
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Pediatrician',
      department: 'Pediatrics',
      status: 'busy',
      patients: 9,
      rating: 4.8,
      experience: '6 years'
    },
    {
      name: 'Dr. Emily Davis',
      role: 'Cardiologist',
      department: 'Cardiology',
      status: 'available',
      patients: 7,
      rating: 4.9,
      experience: '12 years'
    },
    {
      name: 'Dr. James Brown',
      role: 'Dermatologist',
      department: 'Dermatology',
      status: 'on-break',
      patients: 8,
      rating: 4.7,
      experience: '5 years'
    },
    {
      name: 'Nurse Lisa Miller',
      role: 'Head Nurse',
      department: 'General',
      status: 'available',
      patients: 25,
      rating: 4.8,
      experience: '10 years'
    }
  ], []);

  // Equipment and Resources
  const equipmentStatus = useMemo(() => [
    {
      name: 'X-Ray Machine',
      status: 'operational',
      utilization: 78,
      nextMaintenance: '2025-08-20',
      location: 'Radiology'
    },
    {
      name: 'ECG Machine',
      status: 'operational',
      utilization: 85,
      nextMaintenance: '2025-08-25',
      location: 'Cardiology'
    },
    {
      name: 'Ultrasound',
      status: 'maintenance',
      utilization: 0,
      nextMaintenance: '2025-08-15',
      location: 'General'
    },
    {
      name: 'Blood Analyzer',
      status: 'operational',
      utilization: 92,
      nextMaintenance: '2025-08-18',
      location: 'Laboratory'
    },
    {
      name: 'Ventilator',
      status: 'operational',
      utilization: 45,
      nextMaintenance: '2025-08-22',
      location: 'Emergency'
    }
  ], []);

  // Patient Management
  const patientQueue = useMemo(() => [
    {
      position: 1,
      name: 'Alice Cooper',
      department: 'General Medicine',
      priority: 'normal',
      waitTime: '15 min',
      appointmentType: 'walk-in'
    },
    {
      position: 2,
      name: 'Bob Taylor',
      department: 'Cardiology',
      priority: 'urgent',
      waitTime: '25 min',
      appointmentType: 'scheduled'
    },
    {
      position: 3,
      name: 'Carol White',
      department: 'Pediatrics',
      priority: 'normal',
      waitTime: '30 min',
      appointmentType: 'scheduled'
    },
    {
      position: 4,
      name: 'Daniel Green',
      department: 'Dermatology',
      priority: 'low',
      waitTime: '40 min',
      appointmentType: 'walk-in'
    }
  ], []);

  // SOFT CODING: Lab Test Categories Configuration
  const LAB_TEST_CATEGORIES = useMemo(() => [
    {
      id: 'hematology',
      name: 'Hematology',
      description: 'Blood-related tests',
      icon: 'RiTestTubeFill',
      color: 'danger'
    },
    {
      id: 'biochemistry',
      name: 'Biochemistry',
      description: 'Chemical analysis tests',
      icon: 'RiScanLine',
      color: 'primary'
    },
    {
      id: 'microbiology',
      name: 'Microbiology',
      description: 'Infectious disease tests',
      icon: 'RiMicroscopeLine',
      color: 'success'
    },
    {
      id: 'immunology',
      name: 'Immunology',
      description: 'Immune system tests',
      icon: 'RiShieldFill',
      color: 'info'
    },
    {
      id: 'endocrinology',
      name: 'Endocrinology',
      description: 'Hormone tests',
      icon: 'RiHeartFill',
      color: 'warning'
    },
    {
      id: 'urine_analysis',
      name: 'Urine Analysis',
      description: 'Urine examination tests',
      icon: 'RiDropLine',
      color: 'secondary'
    }
  ], []);

  // SOFT CODING: Sample Lab Tests Configuration
  const INITIAL_LAB_TESTS = useMemo(() => [
    {
      id: 1,
      name: 'Complete Blood Count (CBC)',
      category: 'hematology',
      description: 'Complete analysis of blood cells',
      price: 45.00,
      normalRange: 'WBC: 4-11 K/μL, RBC: 4.2-5.4 M/μL',
      sampleType: 'Blood',
      turnaroundTime: '2-4 hours',
      isActive: true,
      testsPerformed: 1247,
      popularity: 95
    },
    {
      id: 2,
      name: 'Comprehensive Metabolic Panel',
      category: 'biochemistry',
      description: 'Blood chemistry analysis',
      price: 65.00,
      normalRange: 'Glucose: 70-100 mg/dL, Creatinine: 0.7-1.3 mg/dL',
      sampleType: 'Blood',
      turnaroundTime: '4-6 hours',
      isActive: true,
      testsPerformed: 892,
      popularity: 88
    },
    {
      id: 3,
      name: 'Thyroid Function Panel',
      category: 'endocrinology',
      description: 'TSH, T3, T4 hormone levels',
      price: 85.00,
      normalRange: 'TSH: 0.4-4.0 mIU/L, T4: 4.5-11.2 μg/dL',
      sampleType: 'Blood',
      turnaroundTime: '6-8 hours',
      isActive: true,
      testsPerformed: 654,
      popularity: 76
    },
    {
      id: 4,
      name: 'Urine Analysis (Complete)',
      category: 'urine_analysis',
      description: 'Complete urine examination',
      price: 25.00,
      normalRange: 'Specific Gravity: 1.005-1.030, pH: 4.6-8.0',
      sampleType: 'Urine',
      turnaroundTime: '1-2 hours',
      isActive: true,
      testsPerformed: 1156,
      popularity: 92
    },
    {
      id: 5,
      name: 'Hepatitis B Surface Antigen',
      category: 'immunology',
      description: 'Hepatitis B infection test',
      price: 35.00,
      normalRange: 'Non-reactive',
      sampleType: 'Blood',
      turnaroundTime: '4-6 hours',
      isActive: true,
      testsPerformed: 423,
      popularity: 65
    },
    {
      id: 6,
      name: 'Blood Culture',
      category: 'microbiology',
      description: 'Bacterial infection detection',
      price: 95.00,
      normalRange: 'No growth',
      sampleType: 'Blood',
      turnaroundTime: '24-48 hours',
      isActive: true,
      testsPerformed: 287,
      popularity: 58
    }
  ], []);

  // Lab Test Management Functions (Soft Coding)
  const handleAddLabTest = useCallback(() => {
    setSelectedLabTest(null);
    setLabTestForm({
      name: '',
      category: '',
      description: '',
      price: '',
      normalRange: '',
      sampleType: '',
      turnaroundTime: '',
      isActive: true
    });
    setShowLabTestModal(true);
  }, []);

  const handleEditLabTest = useCallback((test) => {
    setSelectedLabTest(test);
    setLabTestForm({
      name: test.name,
      category: test.category,
      description: test.description,
      price: test.price,
      normalRange: test.normalRange,
      sampleType: test.sampleType,
      turnaroundTime: test.turnaroundTime,
      isActive: test.isActive
    });
    setShowLabTestModal(true);
  }, []);

  const handleSaveLabTest = useCallback(() => {
    if (selectedLabTest) {
      // Edit existing test
      setLabTests(prev => prev.map(test => 
        test.id === selectedLabTest.id ? {
          ...test,
          ...labTestForm,
          price: parseFloat(labTestForm.price)
        } : test
      ));
    } else {
      // Add new test
      const newTest = {
        id: Date.now(),
        ...labTestForm,
        price: parseFloat(labTestForm.price),
        testsPerformed: 0,
        popularity: 0
      };
      setLabTests(prev => [...prev, newTest]);
    }
    setShowLabTestModal(false);
  }, [selectedLabTest, labTestForm]);

  const handleDeleteLabTest = useCallback((testId) => {
    if (window.confirm('Are you sure you want to delete this lab test?')) {
      setLabTests(prev => prev.filter(test => test.id !== testId));
    }
  }, []);

  // Initialize lab tests data
  useEffect(() => {
    setLabCategories(LAB_TEST_CATEGORIES);
    setLabTests(INITIAL_LAB_TESTS);
  }, [LAB_TEST_CATEGORIES, INITIAL_LAB_TESTS]);

  // Helper function to render icons
  const renderIcon = (iconName, className = "", size = 20) => {
    const iconProps = { className, size };
    switch (iconName) {
      case 'RiTestTubeFill': return <RiTestTubeFill {...iconProps} />;
      case 'RiScanLine': return <RiScanLine {...iconProps} />;
      case 'RiMicroscopeLine': return <RiMicroscopeLine {...iconProps} />;
      case 'RiShieldFill': return <RiShieldFill {...iconProps} />;
      case 'RiHeartFill': return <RiHeartFill {...iconProps} />;
      case 'RiDropLine': return <RiDropLine {...iconProps} />;
      default: return <RiTestTubeFill {...iconProps} />;
    }
  };

  // Refresh function
  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setLastUpdated(new Date().toLocaleTimeString());
      setIsLoading(false);
    }, 1000);
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date().toLocaleTimeString());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Container fluid className="p-4">
      {/* Header Section */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h2 mb-0 text-primary">
                <RiHospitalFill className="me-2" />
                Advanced Clinic Management
              </h1>
              <p className="text-muted mb-0">
                Comprehensive clinic operations and patient care management
              </p>
            </div>
            <div className="d-flex gap-2">
              <Button 
                variant="outline-primary" 
                onClick={handleRefresh}
                disabled={isLoading}
              >
                {isLoading ? <Spinner size="sm" /> : <RiRefreshLine />}
                {isLoading ? ' Updating...' : ' Refresh'}
              </Button>
              <Badge variant="light" className="p-2">
                Last updated: {lastUpdated}
              </Badge>
            </div>
          </div>
        </Col>
      </Row>

      {/* KPI Cards */}
      <Row className="mb-4">
        {clinicKPIs.map((kpi, index) => (
          <Col lg={2} md={4} sm={6} key={index} className="mb-3">
            <Card className="h-100 border-0 shadow-sm hover-shadow">
              <Card.Body className="p-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="text-muted small mb-1">{kpi.name}</div>
                    <div className="h4 mb-1 fw-bold">
                      <CountUp end={parseInt(kpi.value.replace(/\D/g, '') || 0)} duration={2} />
                      {kpi.value.includes('$') && '$'}
                      {kpi.value.includes('%') && '%'}
                      {kpi.value.includes('/') && kpi.value.substring(kpi.value.indexOf('/'))}
                    </div>
                    <div className={`small text-${kpi.trend === 'up' ? 'success' : 'danger'}`}>
                      {kpi.trend === 'up' ? <RiArrowUpCircleFill /> : <RiArrowDownCircleFill />}
                      {kpi.change}
                    </div>
                  </div>
                  <div className={`p-2 rounded bg-${kpi.color}-subtle`}>
                    {kpi.icon}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Navigation Tabs */}
      <Row className="mb-4">
        <Col>
          <Nav variant="pills" activeKey={activeTab} onSelect={setActiveTab}>
            <Nav.Item>
              <Nav.Link eventKey="overview">
                <RiDashboardFill className="me-1" />
                Overview
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="appointments">
                <RiCalendarFill className="me-1" />
                Appointments
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="patients">
                <RiUserFill className="me-1" />
                Patient Management
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="staff">
                <RiTeamFill className="me-1" />
                Staff Management
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="departments">
                <RiHospitalFill className="me-1" />
                Departments
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="analytics">
                <RiBarChartBoxFill className="me-1" />
                Analytics
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="equipment">
                <RiStethoscopeFill className="me-1" />
                Equipment
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="lab-tests">
                <RiTestTubeFill className="me-1" />
                Lab Tests
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="billing">
                <RiMoneyDollarCircleFill className="me-1" />
                Billing
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>

      {/* Tab Content */}
      <Tab.Content>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <Row>
            <Col lg={8} className="mb-4">
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-transparent border-0 pt-3">
                  <h5 className="mb-0">
                    <RiLineChartFill className="me-2 text-primary" />
                    Revenue Analytics
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Chart
                    options={revenueData.options}
                    series={revenueData.series}
                    type="area"
                    height={300}
                  />
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} className="mb-4">
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-transparent border-0 pt-3">
                  <h5 className="mb-0">
                    <RiPieChartFill className="me-2 text-info" />
                    Patient Distribution
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Chart
                    options={patientFlowData.options}
                    series={patientFlowData.series}
                    type="donut"
                    height={300}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <Row>
            <Col lg={8} className="mb-4">
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-transparent border-0 pt-3 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <RiCalendarFill className="me-2 text-primary" />
                    Today's Appointments
                  </h5>
                  <Button variant="primary" size="sm">
                    <RiAddCircleFill className="me-1" />
                    New Appointment
                  </Button>
                </Card.Header>
                <Card.Body className="p-0">
                  <Table responsive striped hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Time</th>
                        <th>Patient</th>
                        <th>Doctor</th>
                        <th>Department</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {todaysAppointments.map((appointment, index) => (
                        <tr key={index}>
                          <td className="fw-bold">{appointment.time}</td>
                          <td>{appointment.patient}</td>
                          <td>{appointment.doctor}</td>
                          <td>{appointment.department}</td>
                          <td>
                            <Badge variant="light">
                              {appointment.type}
                            </Badge>
                          </td>
                          <td>
                            <Badge 
                              bg={
                                appointment.status === 'completed' ? 'success' :
                                appointment.status === 'in-progress' ? 'warning' : 'secondary'
                              }
                            >
                              {appointment.status}
                            </Badge>
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button variant="outline-primary" size="sm">
                                <RiEyeFill />
                              </Button>
                              <Button variant="outline-warning" size="sm">
                                <RiEditFill />
                              </Button>
                              <Button variant="outline-danger" size="sm">
                                <RiDeleteBinFill />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} className="mb-4">
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-transparent border-0 pt-3">
                  <h5 className="mb-0">
                    <RiTimeFill className="me-2 text-warning" />
                    Patient Queue
                  </h5>
                </Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    {patientQueue.map((patient, index) => (
                      <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center px-0">
                        <div>
                          <div className="fw-bold">{patient.position}. {patient.name}</div>
                          <div className="text-muted small">{patient.department}</div>
                          <div className="text-muted small">
                            {patient.appointmentType} • Wait: {patient.waitTime}
                          </div>
                        </div>
                        <Badge 
                          bg={
                            patient.priority === 'urgent' ? 'danger' :
                            patient.priority === 'normal' ? 'primary' : 'secondary'
                          }
                        >
                          {patient.priority}
                        </Badge>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Patients Tab */}
        {activeTab === 'patients' && (
          <Row>
            <Col className="mb-4">
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-transparent border-0 pt-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <RiUserFill className="me-2 text-primary" />
                      Patient Management
                    </h5>
                    <div className="d-flex gap-2">
                      <InputGroup style={{ width: '300px' }}>
                        <InputGroup.Text>
                          <RiSearchLine />
                        </InputGroup.Text>
                        <Form.Control placeholder="Search patients..." />
                      </InputGroup>
                      <Button variant="primary">
                        <RiAddCircleFill className="me-1" />
                        Add Patient
                      </Button>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col lg={3} className="mb-3">
                      <Card className="border-primary">
                        <Card.Body className="text-center">
                          <RiUserFill size={40} className="text-primary mb-2" />
                          <h3 className="text-primary mb-1">
                            <CountUp end={1248} duration={2} />
                          </h3>
                          <p className="text-muted mb-0">Total Patients</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col lg={3} className="mb-3">
                      <Card className="border-success">
                        <Card.Body className="text-center">
                          <RiAddCircleFill size={40} className="text-success mb-2" />
                          <h3 className="text-success mb-1">
                            <CountUp end={23} duration={2} />
                          </h3>
                          <p className="text-muted mb-0">New Today</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col lg={3} className="mb-3">
                      <Card className="border-warning">
                        <Card.Body className="text-center">
                          <RiTimeFill size={40} className="text-warning mb-2" />
                          <h3 className="text-warning mb-1">
                            <CountUp end={45} duration={2} />
                          </h3>
                          <p className="text-muted mb-0">In Queue</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col lg={3} className="mb-3">
                      <Card className="border-info">
                        <Card.Body className="text-center">
                          <RiCheckboxCircleFill size={40} className="text-info mb-2" />
                          <h3 className="text-info mb-1">
                            <CountUp end={89} duration={2} />
                          </h3>
                          <p className="text-muted mb-0">Checked In</p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Staff Tab */}
        {activeTab === 'staff' && (
          <Row>
            <Col className="mb-4">
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-transparent border-0 pt-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <RiTeamFill className="me-2 text-primary" />
                      Staff Management
                    </h5>
                    <Button variant="primary">
                      <RiAddCircleFill className="me-1" />
                      Add Staff
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body className="p-0">
                  <Table responsive striped hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Department</th>
                        <th>Status</th>
                        <th>Patients Today</th>
                        <th>Rating</th>
                        <th>Experience</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staffMembers.map((staff, index) => (
                        <tr key={index}>
                          <td className="fw-bold">{staff.name}</td>
                          <td>{staff.role}</td>
                          <td>{staff.department}</td>
                          <td>
                            <Badge 
                              bg={
                                staff.status === 'available' ? 'success' :
                                staff.status === 'busy' ? 'warning' : 'secondary'
                              }
                            >
                              {staff.status}
                            </Badge>
                          </td>
                          <td className="text-center">{staff.patients}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <RiStarFill className="text-warning me-1" />
                              {staff.rating}
                            </div>
                          </td>
                          <td>{staff.experience}</td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button variant="outline-primary" size="sm">
                                <RiEyeFill />
                              </Button>
                              <Button variant="outline-warning" size="sm">
                                <RiEditFill />
                              </Button>
                              <Button variant="outline-info" size="sm">
                                <RiCalendarFill />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Departments Tab */}
        {activeTab === 'departments' && (
          <Row>
            {clinicDepartments.map((dept, index) => (
              <Col lg={4} md={6} key={index} className="mb-4">
                <Card className="border-0 shadow-sm h-100 hover-shadow">
                  <Card.Header className="bg-transparent border-0 pt-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        {dept.icon}
                        <h6 className="mb-0 ms-2">{dept.name}</h6>
                      </div>
                      <Badge variant="light">
                        {dept.utilization}%
                      </Badge>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <Row className="text-center">
                      <Col>
                        <div className="text-muted small">Patients</div>
                        <div className="h5 mb-0 fw-bold text-primary">{dept.patients}</div>
                      </Col>
                      <Col>
                        <div className="text-muted small">Doctors</div>
                        <div className="h5 mb-0 fw-bold text-success">{dept.doctors}</div>
                      </Col>
                      <Col>
                        <div className="text-muted small">Revenue</div>
                        <div className="h5 mb-0 fw-bold text-info">{dept.revenue}</div>
                      </Col>
                    </Row>
                    <div className="mt-3">
                      <div className="d-flex justify-content-between small text-muted mb-1">
                        <span>Utilization</span>
                        <span>{dept.utilization}%</span>
                      </div>
                      <ProgressBar 
                        now={dept.utilization} 
                        variant={
                          dept.utilization >= 90 ? 'success' :
                          dept.utilization >= 70 ? 'warning' : 'danger'
                        }
                        style={{ height: '6px' }}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <Row>
            <Col lg={6} className="mb-4">
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-transparent border-0 pt-3">
                  <h5 className="mb-0">
                    <RiLineChartFill className="me-2 text-primary" />
                    Daily Revenue Trend
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Chart
                    options={revenueData.options}
                    series={revenueData.series}
                    type="area"
                    height={300}
                  />
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6} className="mb-4">
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-transparent border-0 pt-3">
                  <h5 className="mb-0">
                    <RiPieChartFill className="me-2 text-info" />
                    Department Performance
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Chart
                    options={patientFlowData.options}
                    series={patientFlowData.series}
                    type="donut"
                    height={300}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Equipment Tab */}
        {activeTab === 'equipment' && (
          <Row>
            <Col className="mb-4">
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-transparent border-0 pt-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <RiStethoscopeFill className="me-2 text-primary" />
                      Equipment Management
                    </h5>
                    <Button variant="primary">
                      <RiAddCircleFill className="me-1" />
                      Add Equipment
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body className="p-0">
                  <Table responsive striped hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Equipment Name</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Utilization</th>
                        <th>Next Maintenance</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {equipmentStatus.map((equipment, index) => (
                        <tr key={index}>
                          <td className="fw-bold">{equipment.name}</td>
                          <td>{equipment.location}</td>
                          <td>
                            <Badge 
                              bg={
                                equipment.status === 'operational' ? 'success' :
                                equipment.status === 'maintenance' ? 'warning' : 'danger'
                              }
                            >
                              {equipment.status}
                            </Badge>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div style={{ width: '100px', marginRight: '10px' }}>
                                <ProgressBar 
                                  now={equipment.utilization} 
                                  variant={
                                    equipment.utilization >= 80 ? 'success' :
                                    equipment.utilization >= 50 ? 'warning' : 'danger'
                                  }
                                  style={{ height: '6px' }}
                                />
                              </div>
                              <span className="small">{equipment.utilization}%</span>
                            </div>
                          </td>
                          <td>{equipment.nextMaintenance}</td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button variant="outline-primary" size="sm">
                                <RiEyeFill />
                              </Button>
                              <Button variant="outline-warning" size="sm">
                                <RiEditFill />
                              </Button>
                              <Button variant="outline-info" size="sm">
                                <RiSettings3Fill />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Billing Tab */}
        {activeTab === 'billing' && (
          <Row>
            <Col lg={8} className="mb-4">
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-transparent border-0 pt-3">
                  <h5 className="mb-0">
                    <RiMoneyDollarCircleFill className="me-2 text-primary" />
                    Billing & Financial Overview
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row className="mb-4">
                    <Col lg={3} md={6} className="mb-3">
                      <Card className="border-success bg-success-subtle">
                        <Card.Body className="text-center">
                          <RiMoneyDollarCircleFill size={32} className="text-success mb-2" />
                          <h4 className="text-success mb-1">$12,450</h4>
                          <p className="text-muted mb-0 small">Today's Revenue</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col lg={3} md={6} className="mb-3">
                      <Card className="border-info bg-info-subtle">
                        <Card.Body className="text-center">
                          <RiSecurePaymentLine size={32} className="text-info mb-2" />
                          <h4 className="text-info mb-1">$145,200</h4>
                          <p className="text-muted mb-0 small">Monthly Revenue</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col lg={3} md={6} className="mb-3">
                      <Card className="border-warning bg-warning-subtle">
                        <Card.Body className="text-center">
                          <RiTimeFill size={32} className="text-warning mb-2" />
                          <h4 className="text-warning mb-1">$8,900</h4>
                          <p className="text-muted mb-0 small">Pending Bills</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col lg={3} md={6} className="mb-3">
                      <Card className="border-danger bg-danger-subtle">
                        <Card.Body className="text-center">
                          <RiErrorWarningFill size={32} className="text-danger mb-2" />
                          <h4 className="text-danger mb-1">$2,300</h4>
                          <p className="text-muted mb-0 small">Overdue Bills</p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                  
                  <div className="mt-4">
                    <h6 className="mb-3">Payment Methods Distribution</h6>
                    <Row>
                      <Col md={6}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span>Cash</span>
                          <span className="fw-bold">35%</span>
                        </div>
                        <ProgressBar now={35} variant="success" className="mb-3" style={{ height: '8px' }} />
                        
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span>Credit Card</span>
                          <span className="fw-bold">45%</span>
                        </div>
                        <ProgressBar now={45} variant="primary" className="mb-3" style={{ height: '8px' }} />
                        
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span>Insurance</span>
                          <span className="fw-bold">20%</span>
                        </div>
                        <ProgressBar now={20} variant="info" className="mb-3" style={{ height: '8px' }} />
                      </Col>
                    </Row>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} className="mb-4">
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-transparent border-0 pt-3">
                  <h5 className="mb-0">
                    <RiNotificationFill className="me-2 text-warning" />
                    Recent Transactions
                  </h5>
                </Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                      <div>
                        <div className="fw-bold">John Smith</div>
                        <div className="text-muted small">General Consultation</div>
                      </div>
                      <Badge variant="success">$120</Badge>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                      <div>
                        <div className="fw-bold">Maria Garcia</div>
                        <div className="text-muted small">Pediatric Check-up</div>
                      </div>
                      <Badge variant="success">$85</Badge>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                      <div>
                        <div className="fw-bold">Robert Johnson</div>
                        <div className="text-muted small">Cardiology Exam</div>
                      </div>
                      <Badge variant="warning">Pending</Badge>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                      <div>
                        <div className="fw-bold">Lisa Anderson</div>
                        <div className="text-muted small">Dermatology Treatment</div>
                      </div>
                      <Badge variant="success">$200</Badge>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Lab Tests Tab */}
        {activeTab === 'lab-tests' && (
          <div>
            {/* Lab Tests Header */}
            <Row className="mb-4">
              <Col>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-primary text-white">
                    <Row className="align-items-center">
                      <Col>
                        <h5 className="mb-0">
                          <RiTestTubeFill className="me-2" />
                          Laboratory Test Management
                        </h5>
                      </Col>
                      <Col xs="auto">
                        <Button 
                          variant="light" 
                          size="sm"
                          onClick={handleAddLabTest}
                        >
                          <RiAddLine className="me-1" />
                          Add New Test
                        </Button>
                      </Col>
                    </Row>
                  </Card.Header>
                </Card>
              </Col>
            </Row>

            {/* Lab Test Categories Overview */}
            <Row className="mb-4">
              {labCategories.map((category) => {
                const categoryTests = labTests.filter(test => test.category === category.id);
                const totalRevenue = categoryTests.reduce((sum, test) => sum + (test.price * test.testsPerformed), 0);
                
                return (
                  <Col lg={4} md={6} className="mb-3" key={category.id}>
                    <Card className={`border-${category.color} bg-${category.color}-subtle h-100`}>
                      <Card.Body>
                        <div className="d-flex align-items-center mb-3">
                          {renderIcon(category.icon, `text-${category.color}`, 20)}
                          <div className="ms-2">
                            <h6 className="mb-0">{category.name}</h6>
                            <small className="text-muted">{category.description}</small>
                          </div>
                        </div>
                        <Row className="text-center">
                          <Col>
                            <h4 className={`text-${category.color} mb-0`}>{categoryTests.length}</h4>
                            <small className="text-muted">Tests</small>
                          </Col>
                          <Col>
                            <h4 className={`text-${category.color} mb-0`}>
                              {categoryTests.reduce((sum, test) => sum + test.testsPerformed, 0)}
                            </h4>
                            <small className="text-muted">Performed</small>
                          </Col>
                          <Col>
                            <h4 className={`text-${category.color} mb-0`}>${totalRevenue.toLocaleString()}</h4>
                            <small className="text-muted">Revenue</small>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>

            {/* Lab Tests Table */}
            <Row>
              <Col>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-light">
                    <Row className="align-items-center">
                      <Col>
                        <h6 className="mb-0">All Laboratory Tests</h6>
                      </Col>
                      <Col xs="auto">
                        <Form.Select size="sm" style={{ width: '200px' }}>
                          <option value="">All Categories</option>
                          {labCategories.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Col>
                    </Row>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <Table responsive hover className="mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Test Name</th>
                          <th>Category</th>
                          <th>Price</th>
                          <th>Sample Type</th>
                          <th>Turnaround Time</th>
                          <th>Tests Performed</th>
                          <th>Popularity</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {labTests.map((test) => {
                          const category = labCategories.find(c => c.id === test.category);
                          return (
                            <tr key={test.id}>
                              <td>
                                <div>
                                  <strong>{test.name}</strong>
                                  <br />
                                  <small className="text-muted">{test.description}</small>
                                </div>
                              </td>
                              <td>
                                <Badge variant={(category && category.color) || 'secondary'}>
                                  {(category && category.name) || 'Unknown'}
                                </Badge>
                              </td>
                              <td>
                                <strong>${test.price.toFixed(2)}</strong>
                              </td>
                              <td>{test.sampleType}</td>
                              <td>{test.turnaroundTime}</td>
                              <td>
                                <strong>{test.testsPerformed.toLocaleString()}</strong>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <ProgressBar 
                                    variant={test.popularity >= 80 ? 'success' : test.popularity >= 60 ? 'warning' : 'danger'}
                                    now={test.popularity} 
                                    style={{ width: '60px', height: '8px' }}
                                  />
                                  <span className="ms-2 small">{test.popularity}%</span>
                                </div>
                              </td>
                              <td>
                                <Badge variant={test.isActive ? 'success' : 'danger'}>
                                  {test.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                              </td>
                              <td>
                                <div className="d-flex gap-1">
                                  <Button 
                                    variant="outline-primary" 
                                    size="sm"
                                    onClick={() => handleEditLabTest(test)}
                                  >
                                    <RiEditLine size={14} />
                                  </Button>
                                  <Button 
                                    variant="outline-danger" 
                                    size="sm"
                                    onClick={() => handleDeleteLabTest(test.id)}
                                  >
                                    <RiDeleteBinLine size={14} />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Tab.Content>

      {/* Quick Actions Floating Panel */}
      <div className="position-fixed bottom-0 end-0 m-4" style={{ zIndex: 1000 }}>
        <Card className="border-0 shadow-lg" style={{ width: '250px' }}>
          <Card.Header className="bg-primary text-white py-2">
            <small className="fw-bold">Quick Actions</small>
          </Card.Header>
          <Card.Body className="p-2">
            <div className="d-grid gap-1">
              <Button variant="outline-primary" size="sm">
                <RiAddCircleFill className="me-1" />
                New Patient
              </Button>
              <Button variant="outline-success" size="sm">
                <RiCalendarFill className="me-1" />
                Book Appointment
              </Button>
              <Button variant="outline-warning" size="sm">
                <RiNotificationFill className="me-1" />
                Emergency Alert
              </Button>
              <Button variant="outline-info" size="sm">
                <RiFileTextFill className="me-1" />
                Generate Report
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Lab Test Add/Edit Modal */}
      <Modal show={showLabTestModal} onHide={() => setShowLabTestModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <RiTestTubeFill className="me-2" />
            {selectedLabTest ? 'Edit Lab Test' : 'Add New Lab Test'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Test Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={labTestForm.name}
                    onChange={(e) => setLabTestForm({...labTestForm, name: e.target.value})}
                    placeholder="Enter test name"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Select
                    value={labTestForm.category}
                    onChange={(e) => setLabTestForm({...labTestForm, category: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    {labCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price ($) *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={labTestForm.price}
                    onChange={(e) => setLabTestForm({...labTestForm, price: e.target.value})}
                    placeholder="0.00"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Sample Type *</Form.Label>
                  <Form.Select
                    value={labTestForm.sampleType}
                    onChange={(e) => setLabTestForm({...labTestForm, sampleType: e.target.value})}
                  >
                    <option value="">Select Sample Type</option>
                    <option value="Blood">Blood</option>
                    <option value="Urine">Urine</option>
                    <option value="Stool">Stool</option>
                    <option value="Saliva">Saliva</option>
                    <option value="Tissue">Tissue</option>
                    <option value="Swab">Swab</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Turnaround Time *</Form.Label>
                  <Form.Control
                    type="text"
                    value={labTestForm.turnaroundTime}
                    onChange={(e) => setLabTestForm({...labTestForm, turnaroundTime: e.target.value})}
                    placeholder="e.g., 2-4 hours, 24-48 hours"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Check
                    type="switch"
                    id="lab-test-active"
                    label="Active"
                    checked={labTestForm.isActive}
                    onChange={(e) => setLabTestForm({...labTestForm, isActive: e.target.checked})}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={labTestForm.description}
                onChange={(e) => setLabTestForm({...labTestForm, description: e.target.value})}
                placeholder="Enter test description"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Normal Range</Form.Label>
              <Form.Control
                type="text"
                value={labTestForm.normalRange}
                onChange={(e) => setLabTestForm({...labTestForm, normalRange: e.target.value})}
                placeholder="e.g., WBC: 4-11 K/μL, RBC: 4.2-5.4 M/μL"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLabTestModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSaveLabTest}
            disabled={!labTestForm.name || !labTestForm.category || !labTestForm.price || !labTestForm.sampleType}
          >
            <RiCheckLine className="me-1" />
            {selectedLabTest ? 'Update Test' : 'Add Test'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdvancedClinicManagement;



