import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Nav, Badge, Alert } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import DoctorManagement from './DoctorManagement';
import PatientManagement from './PatientManagement';

const PracticeManagementDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalDoctors: 0,
    activeDoctors: 0,
    totalPatients: 0,
    activePatients: 0,
    todayAppointments: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
    criticalPatients: 0
  });

  // Sample data - replace with actual API calls
  useEffect(() => {
    setStats({
      totalDoctors: 25,
      activeDoctors: 23,
      totalPatients: 1540,
      activePatients: 1425,
      todayAppointments: 87,
      totalRevenue: 125000,
      pendingApprovals: 5,
      criticalPatients: 3
    });
  }, []);

  const menuItems = [
    {
      key: 'overview',
      title: 'Overview',
      icon: 'ri-dashboard-line',
      description: 'Practice overview and key metrics'
    },
    {
      key: 'doctors',
      title: 'Doctor Management',
      icon: 'ri-user-star-line',
      description: 'Manage medical staff and practitioners'
    },
    {
      key: 'patients',
      title: 'Patient Management',
      icon: 'ri-user-heart-line',
      description: 'Manage patient records and medical history'
    }
  ];

  const quickActions = [
    {
      title: 'Add New Doctor',
      icon: 'ri-user-add-line',
      color: 'primary',
      action: () => setActiveTab('doctors')
    },
    {
      title: 'Register Patient',
      icon: 'ri-user-heart-line',
      color: 'success',
      action: () => setActiveTab('patients')
    },
    {
      title: 'View Reports',
      icon: 'ri-file-chart-line',
      color: 'info',
      action: () => console.log('Reports')
    },
    {
      title: 'Settings',
      icon: 'ri-settings-line',
      color: 'warning',
      action: () => console.log('Settings')
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'doctor_added',
      message: 'Dr. Sarah Johnson added to Cardiology department',
      time: '2 hours ago',
      icon: 'ri-user-add-line',
      color: 'success'
    },
    {
      id: 2,
      type: 'patient_registered',
      message: 'New patient Michael Brown registered',
      time: '4 hours ago',
      icon: 'ri-user-heart-line',
      color: 'info'
    },
    {
      id: 3,
      type: 'appointment_scheduled',
      message: '15 appointments scheduled for tomorrow',
      time: '6 hours ago',
      icon: 'ri-calendar-check-line',
      color: 'primary'
    },
    {
      id: 4,
      type: 'critical_alert',
      message: 'Patient Emma Wilson requires immediate attention',
      time: '8 hours ago',
      icon: 'ri-alert-line',
      color: 'danger'
    }
  ];

  const renderOverview = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Welcome Header */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm bg-gradient" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}>
            <Card.Body className="text-white">
              <Row className="align-items-center">
                <Col md={8}>
                  <h2 className="mb-2 text-white">
                    <i className="ri-hospital-line me-2"></i>
                    Practice Management System
                  </h2>
                  <p className="mb-0 opacity-75">
                    Comprehensive management solution for healthcare professionals
                  </p>
                  <div className="mt-3">
                    <Badge bg="light" text="dark" className="me-2">
                      <i className="ri-star-line me-1"></i>
                      Premium Feature
                    </Badge>
                    <Badge bg="success" className="me-2">
                      <i className="ri-shield-check-line me-1"></i>
                      HIPAA Compliant
                    </Badge>
                  </div>
                </Col>
                <Col md={4} className="text-end">
                  <div className="display-1 opacity-50">
                    <i className="ri-stethoscope-line"></i>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Key Metrics */}
      <Row className="mb-4">
        <Col md={3}>
          <motion.div whileHover={{ y: -5 }}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="d-flex align-items-center justify-content-center mb-3">
                  <div className="rounded-circle bg-primary-subtle p-3">
                    <i className="ri-user-star-line fs-2 text-primary"></i>
                  </div>
                </div>
                <h3 className="mb-1">{stats.totalDoctors}</h3>
                <p className="text-muted mb-1">Total Doctors</p>
                <small className="text-success">
                  <i className="ri-arrow-up-line"></i>
                  {stats.activeDoctors} Active
                </small>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
        <Col md={3}>
          <motion.div whileHover={{ y: -5 }}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="d-flex align-items-center justify-content-center mb-3">
                  <div className="rounded-circle bg-success-subtle p-3">
                    <i className="ri-user-heart-line fs-2 text-success"></i>
                  </div>
                </div>
                <h3 className="mb-1">{stats.totalPatients.toLocaleString()}</h3>
                <p className="text-muted mb-1">Total Patients</p>
                <small className="text-success">
                  <i className="ri-arrow-up-line"></i>
                  {stats.activePatients.toLocaleString()} Active
                </small>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
        <Col md={3}>
          <motion.div whileHover={{ y: -5 }}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="d-flex align-items-center justify-content-center mb-3">
                  <div className="rounded-circle bg-info-subtle p-3">
                    <i className="ri-calendar-check-line fs-2 text-info"></i>
                  </div>
                </div>
                <h3 className="mb-1">{stats.todayAppointments}</h3>
                <p className="text-muted mb-1">Today's Appointments</p>
                <small className="text-info">
                  <i className="ri-time-line"></i>
                  Next: 2:30 PM
                </small>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
        <Col md={3}>
          <motion.div whileHover={{ y: -5 }}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="d-flex align-items-center justify-content-center mb-3">
                  <div className="rounded-circle bg-warning-subtle p-3">
                    <i className="ri-money-dollar-circle-line fs-2 text-warning"></i>
                  </div>
                </div>
                <h3 className="mb-1">${stats.totalRevenue.toLocaleString()}</h3>
                <p className="text-muted mb-1">Monthly Revenue</p>
                <small className="text-success">
                  <i className="ri-arrow-up-line"></i>
                  +12% from last month
                </small>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 pb-0">
              <h5 className="mb-0">
                <i className="ri-flash-line me-2"></i>
                Quick Actions
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                {quickActions.map((action, index) => (
                  <Col md={3} key={index}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className={`border-0 bg-${action.color}-subtle text-center cursor-pointer mb-3`}
                        onClick={action.action}
                        style={{ cursor: 'pointer' }}
                      >
                        <Card.Body className="py-4">
                          <div className={`text-${action.color} mb-2`}>
                            <i className={`${action.icon} fs-1`}></i>
                          </div>
                          <h6 className={`text-${action.color} mb-0`}>{action.title}</h6>
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activities & Alerts */}
      <Row>
        <Col md={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 pb-0">
              <h5 className="mb-0">
                <i className="ri-history-line me-2"></i>
                Recent Activities
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="timeline">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="d-flex align-items-center mb-3"
                  >
                    <div className={`rounded-circle bg-${activity.color}-subtle p-2 me-3`}>
                      <i className={`${activity.icon} text-${activity.color}`}></i>
                    </div>
                    <div className="flex-grow-1">
                      <p className="mb-1">{activity.message}</p>
                      <small className="text-muted">{activity.time}</small>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm mb-3">
            <Card.Header className="bg-white border-0 pb-0">
              <h5 className="mb-0">
                <i className="ri-alert-line me-2"></i>
                Alerts
              </h5>
            </Card.Header>
            <Card.Body>
              {stats.criticalPatients > 0 && (
                <Alert variant="danger" className="border-0">
                  <div className="d-flex align-items-center">
                    <i className="ri-error-warning-line me-2"></i>
                    <div>
                      <strong>{stats.criticalPatients} Critical Patients</strong>
                      <br />
                      <small>Require immediate attention</small>
                    </div>
                  </div>
                </Alert>
              )}
              
              {stats.pendingApprovals > 0 && (
                <Alert variant="warning" className="border-0">
                  <div className="d-flex align-items-center">
                    <i className="ri-time-line me-2"></i>
                    <div>
                      <strong>{stats.pendingApprovals} Pending Approvals</strong>
                      <br />
                      <small>Doctor registrations awaiting approval</small>
                    </div>
                  </div>
                </Alert>
              )}

              <Alert variant="info" className="border-0">
                <div className="d-flex align-items-center">
                  <i className="ri-calendar-line me-2"></i>
                  <div>
                    <strong>System Backup</strong>
                    <br />
                    <small>Scheduled for tonight at 2:00 AM</small>
                  </div>
                </div>
              </Alert>
            </Card.Body>
          </Card>

          {/* System Status */}
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 pb-0">
              <h5 className="mb-0">
                <i className="ri-shield-check-line me-2"></i>
                System Status
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Server Status</span>
                <Badge bg="success">Online</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Database</span>
                <Badge bg="success">Connected</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Backup System</span>
                <Badge bg="success">Active</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Security</span>
                <Badge bg="success">Secure</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span>Last Update</span>
                <small className="text-muted">2 hours ago</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </motion.div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'doctors':
        return <DoctorManagement />;
      case 'patients':
        return <PatientManagement />;
      default:
        return renderOverview();
    }
  };

  return (
    <Container fluid className="py-4">
      {/* Navigation Tabs */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-0">
              <Nav variant="tabs" className="border-0">
                {menuItems.map((item) => (
                  <Nav.Item key={item.key}>
                    <Nav.Link
                      className={`px-4 py-3 border-0 ${activeTab === item.key ? 'active bg-primary text-white' : 'text-dark'}`}
                      onClick={() => setActiveTab(item.key)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="d-flex align-items-center">
                        <i className={`${item.icon} me-2`}></i>
                        <div>
                          <div className="fw-bold">{item.title}</div>
                          <small className={activeTab === item.key ? 'text-white-50' : 'text-muted'}>
                            {item.description}
                          </small>
                        </div>
                      </div>
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      {/* Subscription Upgrade Notice */}
      <Row className="mt-5">
        <Col>
          <Alert variant="info" className="border-0 shadow-sm">
            <Row className="align-items-center">
              <Col md={8}>
                <div className="d-flex align-items-center">
                  <i className="ri-vip-crown-line fs-2 me-3"></i>
                  <div>
                    <h6 className="mb-1">Practice Management Premium</h6>
                    <p className="mb-0">
                      You're using our premium Practice Management system. 
                      Enjoy advanced features including detailed analytics, custom reports, 
                      and priority support.
                    </p>
                  </div>
                </div>
              </Col>
              <Col md={4} className="text-end">
                <Button variant="primary" size="sm">
                  <i className="ri-settings-line me-2"></i>
                  Manage Subscription
                </Button>
              </Col>
            </Row>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default PracticeManagementDashboard;
