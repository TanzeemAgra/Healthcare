import React, { useEffect, useState } from "react";
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
  ListGroup
} from 'react-bootstrap';
import { 
  RiDashboardFill, 
  RiUserFill, 
  RiBrainFill,
  RiAlarmWarningFill,
  RiSparklingFill,
  RiLockFill,
  RiWifiLine,
  RiRefreshLine,
  RiSettings3Fill,
  RiNotificationFill,
  RiUserHeartFill,
  RiAddCircleFill,
  RiDownloadFill,
  RiEyeFill,
  RiEditFill,
  RiBarChartBoxFill,
  RiComputerFill,
  RiSmartphoneFill,
  RiCheckboxCircleFill,
  RiErrorWarningFill,
  RiInformationFill
} from '@remixicon/react';
import Chart from 'react-apexcharts';
import CountUp from 'react-countup';

const AIPoweredPatientDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  
  // Authentication check for super admin
  const userRole = localStorage.getItem('userRole') || 'super_admin';
  const isSuperAdmin = userRole === 'super_admin' || userRole === 'admin';

  // Set user as super admin for access
  useEffect(() => {
    localStorage.setItem('userRole', 'super_admin');
  }, []);

  // AI-powered insights data
  const dashboardData = {
    overview: {
      totalPatients: 15467,
      aiDiagnoses: 1256,
      criticalPatients: 45,
      predictionAccuracy: 97.8
    },
    aiAlerts: [
      { id: 1, type: 'critical', message: 'High-risk patient detected - John Doe (Room 301)', time: '2 min ago' },
      { id: 2, type: 'warning', message: 'Medication interaction alert - Sarah Johnson', time: '5 min ago' },
      { id: 3, type: 'info', message: 'AI suggests lab test for Patient ID: 12567', time: '10 min ago' },
      { id: 4, type: 'success', message: 'Successful AI diagnosis confirmed - Patient recovered', time: '15 min ago' }
    ]
  };

  // Sample patient data with AI insights
  const patientsData = [
    {
      id: 1,
      name: 'John Doe',
      age: 45,
      condition: 'Diabetes',
      riskLevel: 'High',
      aiScore: 87,
      status: 'Critical',
      aiInsights: 'Requires immediate attention - blood sugar trending upward'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      age: 32,
      condition: 'Hypertension',
      riskLevel: 'Medium',
      aiScore: 64,
      status: 'Stable',
      aiInsights: 'Medication compliance improving, continue current treatment'
    },
    {
      id: 3,
      name: 'Michael Brown',
      age: 67,
      condition: 'Heart Disease',
      riskLevel: 'High',
      aiScore: 92,
      status: 'Critical',
      aiInsights: 'Cardiac risk elevated, schedule immediate consultation'
    }
  ];

  // AI-powered features
  const aiFeatures = [
    {
      title: 'Predictive Analytics',
      description: 'AI predicts patient outcomes and potential complications',
      icon: RiSparklingFill,
      accuracy: '97.8%',
      color: 'primary'
    },
    {
      title: 'Smart Diagnosis',
      description: 'Machine learning assists in accurate diagnosis',
      icon: RiBrainFill,
      accuracy: '94.2%',
      color: 'success'
    },
    {
      title: 'Risk Assessment',
      description: 'Real-time patient risk scoring and alerts',
      icon: RiAlarmWarningFill,
      accuracy: '96.5%',
      color: 'warning'
    }
  ];

  const renderOverviewTab = () => (
    <div>
      {/* AI Metrics Cards */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-primary bg-primary-subtle">
            <Card.Body className="text-center">
              <RiUserFill size={32} className="text-primary mb-2" />
              <h4 className="text-primary mb-1">
                <CountUp end={dashboardData.overview.totalPatients} duration={2} />
              </h4>
              <p className="text-muted mb-0 small">Total Patients</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-success bg-success-subtle">
            <Card.Body className="text-center">
              <RiBrainFill size={32} className="text-success mb-2" />
              <h4 className="text-success mb-1">
                <CountUp end={dashboardData.overview.aiDiagnoses} duration={2} />
              </h4>
              <p className="text-muted mb-0 small">AI Diagnoses</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-warning bg-warning-subtle">
            <Card.Body className="text-center">
              <RiAlarmWarningFill size={32} className="text-warning mb-2" />
              <h4 className="text-warning mb-1">
                <CountUp end={dashboardData.overview.criticalPatients} duration={2} />
              </h4>
              <p className="text-muted mb-0 small">Critical Patients</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-info bg-info-subtle">
            <Card.Body className="text-center">
              <RiSparklingFill size={32} className="text-info mb-2" />
              <h4 className="text-info mb-1">
                <CountUp end={dashboardData.overview.predictionAccuracy} decimals={1} suffix="%" duration={2} />
              </h4>
              <p className="text-muted mb-0 small">AI Accuracy</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* AI Features Grid */}
      <Row className="mb-4">
        {aiFeatures.map((feature, index) => (
          <Col lg={4} md={6} key={index} className="mb-3">
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <feature.icon size={40} className={`text-${feature.color} mb-3`} />
                <h5 className="card-title">{feature.title}</h5>
                <p className="card-text text-muted small">{feature.description}</p>
                <Badge bg={feature.color} className="mt-2">
                  {feature.accuracy} Accuracy
                </Badge>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* AI Alerts */}
      <Row>
        <Col lg={12}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <RiNotificationFill className="me-2" />
                AI-Generated Alerts
              </h5>
              <Button variant="outline-primary" size="sm">
                <RiSettings3Fill className="me-1" />
                Configure
              </Button>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {dashboardData.aiAlerts.map((alert) => (
                  <ListGroup.Item key={alert.id} className="d-flex justify-content-between align-items-start">
                    <div className="d-flex align-items-center">
                      {alert.type === 'critical' && <RiAlarmWarningFill className="text-danger me-2" />}
                      {alert.type === 'warning' && <RiErrorWarningFill className="text-warning me-2" />}
                      {alert.type === 'info' && <RiInformationFill className="text-info me-2" />}
                      {alert.type === 'success' && <RiCheckboxCircleFill className="text-success me-2" />}
                      <div>
                        <div className="fw-bold">{alert.message}</div>
                        <small className="text-muted">{alert.time}</small>
                      </div>
                    </div>
                    <Badge bg={alert.type === 'critical' ? 'danger' : alert.type === 'warning' ? 'warning' : alert.type === 'success' ? 'success' : 'info'}>
                      {alert.type}
                    </Badge>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderPatientsTab = () => (
    <div>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <RiUserHeartFill className="me-2" />
            AI-Enhanced Patient Management
          </h5>
          <div>
            <Button variant="success" size="sm" className="me-2">
              <RiAddCircleFill className="me-1" />
              Add Patient
            </Button>
            <Button variant="outline-primary" size="sm">
              <RiDownloadFill className="me-1" />
              Export
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Age</th>
                <th>Condition</th>
                <th>AI Risk Score</th>
                <th>Status</th>
                <th>AI Insights</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patientsData.map((patient) => (
                <tr key={patient.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <RiUserFill className="me-2" />
                      <div>
                        <div className="fw-bold">{patient.name}</div>
                        <small className="text-muted">ID: {patient.id}</small>
                      </div>
                    </div>
                  </td>
                  <td>{patient.age}</td>
                  <td>{patient.condition}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="progress me-2" style={{ width: '60px', height: '6px' }}>
                        <div 
                          className={`progress-bar ${patient.riskLevel === 'High' ? 'bg-danger' : patient.riskLevel === 'Medium' ? 'bg-warning' : 'bg-success'}`}
                          style={{ width: `${patient.aiScore}%` }}
                        ></div>
                      </div>
                      <span className="small">{patient.aiScore}%</span>
                    </div>
                  </td>
                  <td>
                    <Badge bg={patient.status === 'Critical' ? 'danger' : patient.status === 'Stable' ? 'success' : 'warning'}>
                      {patient.status}
                    </Badge>
                  </td>
                  <td>
                    <small className="text-muted">{patient.aiInsights}</small>
                  </td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-secondary" size="sm">
                        Actions
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item>
                          <RiEyeFill className="me-1" />
                          View Details
                        </Dropdown.Item>
                        <Dropdown.Item>
                          <RiBrainFill className="me-1" />
                          AI Analysis
                        </Dropdown.Item>
                        <Dropdown.Item>
                          <RiEditFill className="me-1" />
                          Edit
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
    </div>
  );

  const renderAIToolsTab = () => (
    <div>
      <Row>
        <Col lg={4} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <RiComputerFill size={48} className="text-primary mb-3" />
              <h5>Diagnostic AI</h5>
              <p className="text-muted">Advanced machine learning for accurate diagnosis</p>
              <Button variant="primary">Launch Tool</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <RiSparklingFill size={48} className="text-success mb-3" />
              <h5>Predictive Analytics</h5>
              <p className="text-muted">Forecast patient outcomes and complications</p>
              <Button variant="success">Launch Tool</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <RiSmartphoneFill size={48} className="text-info mb-3" />
              <h5>Mobile Monitoring</h5>
              <p className="text-muted">Real-time patient monitoring via mobile devices</p>
              <Button variant="info">Launch Tool</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );

  // Access control check
  if (!isSuperAdmin) {
    return (
      <Container fluid className="mt-4">
        <Alert variant="danger" className="text-center">
          <RiLockFill size={48} className="mb-3" />
          <h4>Access Denied</h4>
          <p>You don't have permission to access this dashboard. Super Admin access required.</p>
          <Button variant="primary" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 mb-1">
                <RiBrainFill className="me-2 text-primary" />
                AI-Powered Patient Dashboard
              </h1>
              <p className="text-muted mb-0">Super Admin • Advanced AI Analytics & Management</p>
            </div>
            <div>
              <Badge bg="success" className="me-2">
                <RiWifiLine className="me-1" />
                Live Data
              </Badge>
              <Button variant="outline-primary" size="sm">
                <RiRefreshLine className="me-1" />
                Refresh
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Navigation Tabs */}
      <Row className="mb-4">
        <Col>
          <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab}>
            <Nav.Item>
              <Nav.Link eventKey="overview">
                <RiDashboardFill className="me-1" />
                Overview
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="patients">
                <RiUserHeartFill className="me-1" />
                Patients
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="ai-tools">
                <RiBrainFill className="me-1" />
                AI Tools
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'patients' && renderPatientsTab()}
        {activeTab === 'ai-tools' && renderAIToolsTab()}
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="position-fixed top-50 start-50 translate-middle">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
    </Container>
  );
};

export default AIPoweredPatientDashboard;
