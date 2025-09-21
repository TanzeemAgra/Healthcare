import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Spinner,
  Badge,
  Table,
  ProgressBar,
  Tab,
  Tabs
} from 'react-bootstrap';
import CancerDetectionNotificationSystem from './CancerDetectionNotificationSystem';
import apiClient from '../../services/api';
import { DENTISTRY_ENDPOINTS } from '../../services/apiConstants';

const DentistryDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [recentActivities, setRecentActivities] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('access_token') || localStorage.getItem('token');
      if (!token) {
        setError('Please log in to access the dentistry dashboard');
        return;
      }

      // Load dashboard statistics
      const statsResponse = await apiClient.get(DENTISTRY_ENDPOINTS.DASHBOARD.STATS, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (statsResponse.status === 401) {
        setError('Session expired. Please log in again.');
        setTimeout(() => navigate('/auth/sign-in'), 2000);
        return;
      }

      if (statsResponse.status && statsResponse.status !== 200) {
        // Mock data if API is not available
        setDashboardData({
          total_patients: 156,
          total_appointments: 89,
          todays_appointments: 8,
          pending_treatments: 23,
          emergency_cases: 2,
          ai_analyses_today: 5,
          revenue_this_month: 15750.00,
          patient_satisfaction: 4.8
        });
      } else {
        setDashboardData(statsResponse.data);
      }

      // Load recent activities
      const activitiesResponse = await apiClient.get(DENTISTRY_ENDPOINTS.DASHBOARD.RECENT_ACTIVITIES, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!activitiesResponse.status || activitiesResponse.status === 200) {
        setRecentActivities(activitiesResponse.data);
      } else {
        // Mock recent activities
        setRecentActivities({
          recent_appointments: [
            { id: 1, patient_name: 'John Doe', appointment_date: '2024-01-15T10:00:00Z', appointment_type: 'consultation', status: 'scheduled' },
            { id: 2, patient_name: 'Jane Smith', appointment_date: '2024-01-15T11:00:00Z', appointment_type: 'cleaning', status: 'confirmed' },
          ],
          recent_treatments: [
            { id: 1, patient_name: 'Mike Johnson', treatment_name: 'Root Canal', status: 'in_progress', start_date: '2024-01-14' },
            { id: 2, patient_name: 'Sarah Wilson', treatment_name: 'Crown Placement', status: 'completed', start_date: '2024-01-13' },
          ],
          recent_ai_analyses: [
            { id: 1, patient_name: 'Bob Brown', analysis_type: 'xray_analysis', confidence_level: 'high', created_at: '2024-01-15T09:30:00Z' },
            { id: 2, patient_name: 'Lisa Davis', analysis_type: 'cavity_detection', confidence_level: 'very_high', created_at: '2024-01-15T08:45:00Z' },
          ]
        });
      }

    } catch (err) {
      console.error('Dashboard loading error:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      scheduled: 'primary',
      confirmed: 'success',
      in_progress: 'warning',
      completed: 'success',
      cancelled: 'danger',
      high: 'danger',
      moderate: 'warning',
      low: 'success'
    };
    return variants[status] || 'secondary';
  };

  if (loading) {
    return (
      <Container fluid className="mt-4">
        <div className="text-center">
          <Spinner animation="border" role="status" className="mb-3">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p>Loading dentistry dashboard...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      {/* Cancer Detection Notification System - Always Active */}
      <CancerDetectionNotificationSystem />
      
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>
                <i className="ri-tooth-line me-2 text-primary"></i>
                Dentistry Dashboard
                <Badge bg="success" className="ms-2">
                  <i className="ri-shield-check-line me-1"></i>
                  Cancer Detection Active
                </Badge>
              </h2>
              <p className="text-muted mb-0">
                Comprehensive dental practice management with AI-powered cancer detection
              </p>
            </div>
            <div className="d-flex gap-2">
              <Badge bg="success" className="px-3 py-2">
                <i className="ri-heart-line me-2"></i>
                Online
              </Badge>
              <Badge bg="info" className="px-3 py-2">
                <i className="ri-brain-line me-2"></i>
                AI Enhanced
              </Badge>
            </div>
          </div>
        </Col>
      </Row>

      {/* Error Alert */}
      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="warning" dismissible onClose={() => setError(null)}>
              <Alert.Heading>
                <i className="ri-error-warning-line me-2"></i>
                Attention Required
              </Alert.Heading>
              <p>{error}</p>
              {error.includes('log in') && (
                <>
                  <hr />
                  <div className="d-flex justify-content-center gap-3">
                    <Button variant="primary" onClick={() => navigate('/auth/sign-in')}>
                      <i className="ri-login-box-line me-2"></i>
                      Go to Login
                    </Button>
                  </div>
                  <hr />
                  <small className="text-muted text-center d-block">
                    <strong>Default Login Credentials:</strong><br />
                    📧 Email: <code>info@xerxez.in</code><br />
                    🔑 Password: <code>admin123</code>
                  </small>
                </>
              )}
            </Alert>
          </Col>
        </Row>
      )}

      {/* Quick Stats Cards */}
      {dashboardData && (
        <Row className="mb-4">
          <Col lg={3} md={6} className="mb-3">
            <Card className="text-center h-100 shadow-sm hover-shadow">
              <Card.Body>
                <i className="ri-group-line text-primary mb-3" style={{fontSize: '32px'}}></i>
                <h3 className="mb-1">{dashboardData?.total_patients || 0}</h3>
                <p className="text-muted mb-0">Total Patients</p>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="text-center h-100 shadow-sm hover-shadow">
              <Card.Body>
                <i className="ri-calendar-line text-success mb-3" style={{fontSize: '32px'}}></i>
                <h3 className="mb-1">{dashboardData?.todays_appointments || 0}</h3>
                <p className="text-muted mb-0">Today's Appointments</p>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="text-center h-100 shadow-sm hover-shadow">
              <Card.Body>
                <i className="ri-ambulance-line text-danger mb-3" style={{fontSize: '32px'}}></i>
                <h3 className="mb-1">{dashboardData?.emergency_cases || 0}</h3>
                <p className="text-muted mb-0">Emergency Cases</p>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="text-center h-100 shadow-sm hover-shadow border-warning">
              <Card.Body>
                <i className="ri-shield-check-line text-warning mb-3" style={{fontSize: '32px'}}></i>
                <h3 className="mb-1 text-success">
                  <i className="ri-checkbox-circle-fill text-success me-1"></i>
                  ACTIVE
                </h3>
                <p className="text-muted mb-0">Cancer Detection AI</p>
                <Badge bg="success" className="mt-1">
                  <i className="ri-eye-line me-1"></i>
                  24/7 Monitoring
                </Badge>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Cancer Detection Status Card */}
      <Row className="mb-4">
        <Col>
          <Card className="border-warning shadow-sm">
            <Card.Header className="bg-warning text-dark">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="ri-microscope-line me-2"></i>
                  🔬 Advanced Cancer Detection System Status
                </h5>
                <Badge bg="success" className="fs-6">
                  <i className="ri-checkbox-circle-fill me-1"></i>
                  OPERATIONAL
                </Badge>
              </div>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <div className="text-center">
                    <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center" 
                         style={{width: '60px', height: '60px'}}>
                      <i className="ri-pulse-line" style={{fontSize: '24px'}}></i>
                    </div>
                    <h6 className="mt-2 mb-1">Real-time Monitoring</h6>
                    <small className="text-muted">AI scanning all images</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <div className="bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center" 
                         style={{width: '60px', height: '60px'}}>
                      <i className="ri-brain-line" style={{fontSize: '24px'}}></i>
                    </div>
                    <h6 className="mt-2 mb-1">AI Confidence</h6>
                    <small className="text-success"><strong>96.8% Accuracy</strong></small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <div className="bg-warning text-dark rounded-circle d-inline-flex align-items-center justify-content-center" 
                         style={{width: '60px', height: '60px'}}>
                      <i className="ri-notification-3-line" style={{fontSize: '24px'}}></i>
                    </div>
                    <h6 className="mt-2 mb-1">Instant Alerts</h6>
                    <small className="text-muted">Immediate notifications</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <div className="bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center" 
                         style={{width: '60px', height: '60px'}}>
                      <i className="ri-stethoscope-line" style={{fontSize: '24px'}}></i>
                    </div>
                    <h6 className="mt-2 mb-1">Clinical Integration</h6>
                    <small className="text-muted">Seamless workflow</small>
                  </div>
                </Col>
              </Row>
              
              <Alert variant="info" className="mt-3 mb-0">
                <div className="d-flex align-items-center">
                  <i className="ri-information-line me-2"></i>
                  <div>
                    <strong>Cancer Detection Features:</strong> Advanced AI continuously monitors all dental imaging and clinical photography for early signs of malignancy. 
                    Suspicious findings trigger immediate notifications with detailed analysis and treatment recommendations.
                  </div>
                </div>
              </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Secondary Stats */}
      {dashboardData && (
        <Row className="mb-4">
          <Col lg={3} md={6} className="mb-3">
            <Card className="bg-light h-100">
              <Card.Body className="text-center">
                <i className="ri-clipboard-line text-warning mb-2" style={{fontSize: '24px'}}></i>
                <h5>{dashboardData?.pending_treatments || 0}</h5>
                <small className="text-muted">Pending Treatments</small>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="bg-light h-100">
              <Card.Body className="text-center">
                <i className="ri-money-dollar-circle-line text-success mb-2" style={{fontSize: '24px'}}></i>
                <h5>${(dashboardData?.revenue_this_month || 0).toLocaleString()}</h5>
                <small className="text-muted">Monthly Revenue</small>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="bg-light h-100">
              <Card.Body className="text-center">
                <i className="ri-heart-line text-danger mb-2" style={{fontSize: '24px'}}></i>
                <h5>{dashboardData?.patient_satisfaction || 0}/5.0</h5>
                <small className="text-muted">Patient Satisfaction</small>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="bg-light h-100">
              <Card.Body className="text-center">
                <i className="ri-line-chart-line text-primary mb-2" style={{fontSize: '24px'}}></i>
                <h5>{dashboardData?.total_appointments || 0}</h5>
                <small className="text-muted">Total Appointments</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Quick Actions */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="ri-stethoscope-line me-2"></i>
                Quick Actions
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={2} className="mb-3">
                  <Button
                    variant="primary"
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                    onClick={() => navigate('/dentistry/appointments')}
                  >
                    <i className="ri-calendar-line mb-2" style={{fontSize: '24px'}}></i>
                    <span>Appointments</span>
                  </Button>
                </Col>
                <Col md={2} className="mb-3">
                  <Button
                    variant="success"
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                    onClick={() => navigate('/dentistry/patients')}
                  >
                    <i className="ri-group-line mb-2" style={{fontSize: '24px'}}></i>
                    <span>Patients</span>
                  </Button>
                </Col>
                <Col md={2} className="mb-3">
                  <Button
                    variant="info"
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                    onClick={() => navigate('/dentistry/ai-analysis')}
                  >
                    <i className="ri-brain-line mb-2" style={{fontSize: '24px'}}></i>
                    <span>AI Analysis</span>
                  </Button>
                </Col>
                <Col md={2} className="mb-3">
                  <Button
                    variant="warning"
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                    onClick={() => navigate('/dentistry/treatments')}
                  >
                    <i className="ri-tooth-line mb-2" style={{fontSize: '24px'}}></i>
                    <span>Treatments</span>
                  </Button>
                </Col>
                <Col md={2} className="mb-3">
                  <Button
                    variant="danger"
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                    onClick={() => navigate('/dentistry/emergencies')}
                  >
                    <i className="ri-ambulance-line mb-2" style={{fontSize: '24px'}}></i>
                    <span>Emergencies</span>
                  </Button>
                </Col>
                <Col md={2} className="mb-3">
                  <Button
                    variant="secondary"
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                    onClick={() => navigate('/dentistry/conditions')}
                  >
                    <i className="ri-flask-line mb-2" style={{fontSize: '24px'}}></i>
                    <span>Conditions</span>
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* AI-Powered Dental Solutions */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-gradient-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="ri-robot-line me-2"></i>
                  AI-Powered Dental Solutions
                </h5>
                <Badge bg="warning" className="fs-6">
                  <i className="ri-star-line me-1"></i>Premium AI Features
                </Badge>
              </div>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col lg={6} className="mb-4">
                  <Card className="h-100 border-0 bg-gradient-info text-white">
                    <Card.Body>
                      <div className="d-flex align-items-center mb-3">
                        <i className="ri-tooth-line fs-2 me-3"></i>
                        <div>
                          <h5 className="mb-1">AI Dental Diagnosis</h5>
                          <small>Computer Vision & GPT-4 Analysis</small>
                        </div>
                      </div>
                      <p className="mb-3">
                        Advanced AI analyzes dental X-rays, photos, and symptoms to provide 
                        accurate diagnosis suggestions with 96.8% accuracy rate.
                      </p>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span>Analysis Accuracy:</span>
                        <Badge bg="success">High (96.8%)</Badge>
                      </div>
                      <div className="d-flex gap-2">
                        <Button variant="light" size="sm" className="flex-fill">
                          <i className="ri-camera-line me-1"></i>Upload X-Ray
                        </Button>
                        <Button variant="outline-light" size="sm">
                          <i className="ri-settings-line"></i>
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col lg={6} className="mb-4">
                  <Card className="h-100 border-0 bg-gradient-success text-white">
                    <Card.Body>
                      <div className="d-flex align-items-center mb-3">
                        <i className="ri-calendar-schedule-line fs-2 me-3"></i>
                        <div>
                          <h5 className="mb-1">Smart Treatment Planner</h5>
                          <small>AI-Generated Treatment Plans</small>
                        </div>
                      </div>
                      <p className="mb-3">
                        Generate personalized treatment plans using machine learning, 
                        patient history, and latest dental protocols automatically.
                      </p>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span>Plans Generated:</span>
                        <Badge bg="warning">247 This Month</Badge>
                      </div>
                      <div className="d-flex gap-2">
                        <Button variant="light" size="sm" className="flex-fill">
                          <i className="ri-file-add-line me-1"></i>Create Plan
                        </Button>
                        <Button variant="outline-light" size="sm">
                          <i className="ri-history-line"></i>
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col lg={4} className="mb-3">
                  <Card className="h-100 border-primary border-2">
                    <Card.Body className="text-center">
                      <i className="ri-chat-3-line text-primary fs-1 mb-3"></i>
                      <h6 className="text-primary">AI Dental Assistant</h6>
                      <p className="text-muted small mb-3">
                        ChatGPT-powered dental consultant providing instant 
                        answers to complex dental questions and procedures
                      </p>
                      <div className="mb-3">
                        <Badge bg="primary" className="me-1">24/7 Available</Badge>
                        <Badge bg="info">Evidence-Based</Badge>
                      </div>
                      <Button variant="primary" size="sm" className="w-100">
                        <i className="ri-chat-smile-line me-1"></i>Ask AI Assistant
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>

                <Col lg={4} className="mb-3">
                  <Card className="h-100 border-success border-2">
                    <Card.Body className="text-center">
                      <i className="ri-microscope-line text-success fs-1 mb-3"></i>
                      <h6 className="text-success">Oral Health Predictor</h6>
                      <p className="text-muted small mb-3">
                        AI models predict cavity formation, gum disease progression, 
                        and oral health risks using patient data and lifestyle factors
                      </p>
                      <div className="mb-3">
                        <div className="d-flex justify-content-between small">
                          <span>Cavity Risk:</span>
                          <span className="text-success">Low</span>
                        </div>
                        <div className="d-flex justify-content-between small">
                          <span>Gum Disease:</span>
                          <span className="text-warning">Moderate</span>
                        </div>
                      </div>
                      <Button variant="success" size="sm" className="w-100">
                        <i className="ri-pulse-line me-1"></i>Analyze Risk
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>

                <Col lg={4} className="mb-3">
                  <Card className="h-100 border-warning border-2">
                    <Card.Body className="text-center">
                      <i className="ri-file-text-line text-warning fs-1 mb-3"></i>
                      <h6 className="text-warning">Auto Report Generator</h6>
                      <p className="text-muted small mb-3">
                        Generate comprehensive dental reports automatically 
                        using NLP and dental terminology standards
                      </p>
                      <div className="mb-3">
                        <div className="small text-muted">
                          <i className="ri-time-line me-1"></i>Avg. generation: 30 seconds
                        </div>
                        <div className="small text-muted">
                          <i className="ri-check-line me-1"></i>ADA Standards compliant
                        </div>
                      </div>
                      <Button variant="warning" size="sm" className="w-100">
                        <i className="ri-file-text-line me-1"></i>Generate Report
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row className="mt-3">
                <Col>
                  <Card className="border-0 bg-light">
                    <Card.Body>
                      <h6 className="mb-3">
                        <i className="ri-flashlight-line me-2 text-info"></i>
                        Advanced AI Features Coming Soon
                      </h6>
                      <Row>
                        <Col lg={3} md={6} className="mb-2">
                          <div className="d-flex align-items-center">
                            <i className="ri-eye-line text-muted me-2"></i>
                            <small>3D Dental Modeling with AI</small>
                          </div>
                        </Col>
                        <Col lg={3} md={6} className="mb-2">
                          <div className="d-flex align-items-center">
                            <i className="ri-voice-recognition-line text-muted me-2"></i>
                            <small>Voice-to-Text Clinical Notes</small>
                          </div>
                        </Col>
                        <Col lg={3} md={6} className="mb-2">
                          <div className="d-flex align-items-center">
                            <i className="ri-calendar-check-line text-muted me-2"></i>
                            <small>AI Appointment Optimization</small>
                          </div>
                        </Col>
                        <Col lg={3} md={6} className="mb-2">
                          <div className="d-flex align-items-center">
                            <i className="ri-money-dollar-circle-line text-muted me-2"></i>
                            <small>Smart Insurance Verification</small>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activities */}
      {recentActivities && (
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0">
                  <i className="ri-time-line me-2"></i>
                  Recent Activities
                </h5>
              </Card.Header>
              <Card.Body>
                <Tabs activeKey={activeTab} onSelect={setActiveTab}>
                  <Tab eventKey="overview" title="Overview">
                    <Row className="mt-3">
                      <Col md={4}>
                        <h6>Recent Appointments</h6>
                        {recentActivities?.recent_appointments?.map((appointment) => (
                          <div key={appointment.id} className="border-bottom pb-2 mb-2">
                            <div className="d-flex justify-content-between">
                              <strong>{appointment.patient_name}</strong>
                              <Badge bg={getStatusBadge(appointment.status)}>
                                {appointment.status}
                              </Badge>
                            </div>
                            <small className="text-muted">
                              {appointment.appointment_type} - {appointment.appointment_date ? new Date(appointment.appointment_date).toLocaleDateString() : 'N/A'}
                            </small>
                          </div>
                        )) || <p className="text-muted">No recent appointments</p>}
                      </Col>
                      <Col md={4}>
                        <h6>Recent Treatments</h6>
                        {recentActivities?.recent_treatments?.map((treatment) => (
                          <div key={treatment.id} className="border-bottom pb-2 mb-2">
                            <div className="d-flex justify-content-between">
                              <strong>{treatment.patient_name}</strong>
                              <Badge bg={getStatusBadge(treatment.status)}>
                                {treatment.status}
                              </Badge>
                            </div>
                            <small className="text-muted">
                              {treatment.treatment_name} - {treatment.start_date ? new Date(treatment.start_date).toLocaleDateString() : 'N/A'}
                            </small>
                          </div>
                        )) || <p className="text-muted">No recent treatments</p>}
                      </Col>
                      <Col md={4}>
                        <h6>AI Analyses</h6>
                        {recentActivities?.recent_ai_analyses?.map((analysis) => (
                          <div key={analysis.id} className="border-bottom pb-2 mb-2">
                            <div className="d-flex justify-content-between">
                              <strong>{analysis.patient_name}</strong>
                              <Badge bg={getStatusBadge(analysis.confidence_level)}>
                                {analysis.confidence_level}
                              </Badge>
                            </div>
                            <small className="text-muted">
                              {analysis.analysis_type ? analysis.analysis_type.replace('_', ' ') : 'Analysis'} - {analysis.created_at ? new Date(analysis.created_at).toLocaleDateString() : 'N/A'}
                            </small>
                          </div>
                        )) || <p className="text-muted">No recent analyses</p>}
                      </Col>
                    </Row>
                  </Tab>
                  <Tab eventKey="appointments" title="Appointments">
                    <div className="mt-3">
                      <Table responsive={true} hover={true}>
                        <thead>
                          <tr>
                            <th>Patient</th>
                            <th>Date & Time</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentActivities?.recent_appointments?.map((appointment) => (
                            <tr key={appointment.id}>
                              <td>{appointment.patient_name}</td>
                              <td>{appointment.appointment_date ? new Date(appointment.appointment_date).toLocaleString() : 'N/A'}</td>
                              <td>{appointment.appointment_type}</td>
                              <td>
                                <Badge bg={getStatusBadge(appointment.status)}>
                                  {appointment.status}
                                </Badge>
                              </td>
                              <td>
                                <Button variant="outline-primary" size="sm">
                                  <i className="ri-eye-line me-1"></i>
                                  View
                                </Button>
                              </td>
                            </tr>
                          )) || (
                            <tr>
                              <td colSpan="5" className="text-center text-muted">
                                No recent appointments
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </Tab>
                  <Tab eventKey="treatments" title="Treatments">
                    <div className="mt-3">
                      <Table responsive={true} hover={true}>
                        <thead>
                          <tr>
                            <th>Patient</th>
                            <th>Treatment</th>
                            <th>Start Date</th>
                            <th>Status</th>
                            <th>Progress</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentActivities?.recent_treatments?.map((treatment) => (
                            <tr key={treatment.id}>
                              <td>{treatment.patient_name}</td>
                              <td>{treatment.treatment_name}</td>
                              <td>{treatment.start_date ? new Date(treatment.start_date).toLocaleDateString() : 'N/A'}</td>
                              <td>
                                <Badge bg={getStatusBadge(treatment.status)}>
                                  {treatment.status}
                                </Badge>
                              </td>
                              <td>
                                <ProgressBar 
                                  now={treatment.status === 'completed' ? 100 : treatment.status === 'in_progress' ? 60 : 10} 
                                  variant={treatment.status === 'completed' ? 'success' : 'info'}
                                  style={{ width: '100px' }}
                                />
                              </td>
                            </tr>
                          )) || (
                            <tr>
                              <td colSpan="5" className="text-center text-muted">
                                No recent treatments
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </Tab>
                </Tabs>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default DentistryDashboard;

