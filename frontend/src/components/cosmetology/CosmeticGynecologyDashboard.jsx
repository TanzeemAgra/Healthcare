import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Badge, Alert, Modal, Tabs, Tab, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ProtectedRoute from '../common/ProtectedRoute';

const CosmeticGynecologyDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  // AI-powered statistics
  const [stats, setStats] = useState({
    totalClients: 42,
    activeConsultations: 8,
    treatmentPlans: 15,
    monthlyRevenue: 78500,
    aiAnalysisCompleted: 35,
    averageRiskScore: 2.8,
    successRate: 94.2,
    aiOptimizations: 12
  });

  // Recent AI-analyzed consultations
  const [recentConsultations, setRecentConsultations] = useState([
    {
      id: 1,
      clientName: "Sarah Johnson",
      type: "Initial Consultation",
      date: "2024-12-19",
      aiRiskScore: 2.5,
      riskLevel: "LOW",
      recommendedTreatment: "Vaginal Rejuvenation Laser",
      status: "AI Analysis Complete"
    },
    {
      id: 2,
      clientName: "Maria Rodriguez",
      type: "Pre-Surgical",
      date: "2024-12-18",
      aiRiskScore: 3.2,
      riskLevel: "MEDIUM",
      recommendedTreatment: "Cosmetic Labiaplasty",
      status: "Specialist Review"
    },
    {
      id: 3,
      clientName: "Jennifer Chen",
      type: "Follow-up",
      date: "2024-12-17",
      aiRiskScore: 1.8,
      riskLevel: "LOW",
      recommendedTreatment: "MonaLisa Touch Series",
      status: "Treatment Active"
    }
  ]);

  // AI-powered treatment plans
  const [treatmentPlans, setTreatmentPlans] = useState([
    {
      id: 1,
      clientName: "Sarah Johnson",
      planName: "Vaginal Rejuvenation Comprehensive",
      status: "In Progress",
      aiSuccessProbability: 85,
      sessionsCompleted: 1,
      totalSessions: 3,
      nextSession: "2024-12-26",
      aiOptimization: "Optimal parameters"
    },
    {
      id: 2,
      clientName: "Maria Rodriguez",
      planName: "Labiaplasty Surgical Plan",
      status: "Approved",
      aiSuccessProbability: 90,
      sessionsCompleted: 0,
      totalSessions: 1,
      nextSession: "2025-01-02",
      aiOptimization: "Enhanced recovery protocol"
    },
    {
      id: 3,
      clientName: "Jennifer Chen",
      planName: "MonaLisa Touch Series",
      status: "In Progress",
      aiSuccessProbability: 80,
      sessionsCompleted: 2,
      totalSessions: 3,
      nextSession: "2025-01-05",
      aiOptimization: "Frequency optimized"
    }
  ]);

  // Available treatments
  const [treatments, setTreatments] = useState([
    {
      id: 1,
      name: "Vaginal Rejuvenation Laser Therapy",
      category: "Non-Invasive",
      technology: "CO2 Laser",
      duration: 45,
      successRate: 87.5,
      pricePerSession: 2500
    },
    {
      id: 2,
      name: "MonaLisa Touch Treatment",
      category: "Minimally Invasive",
      technology: "CO2 Laser",
      duration: 30,
      successRate: 92.3,
      pricePerSession: 1800
    },
    {
      id: 3,
      name: "Cosmetic Labiaplasty",
      category: "Surgical",
      technology: "Surgical Procedure",
      duration: 90,
      successRate: 94.2,
      pricePerSession: 5500
    },
    {
      id: 4,
      name: "O-Shot (Orgasm Shot)",
      category: "Minimally Invasive",
      technology: "PRP Therapy",
      duration: 75,
      successRate: 83.7,
      pricePerSession: 3200
    }
  ]);

  const getRiskBadgeVariant = (level) => {
    switch (level) {
      case 'LOW': return 'success';
      case 'MEDIUM': return 'warning';
      case 'HIGH': return 'danger';
      default: return 'secondary';
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'In Progress': return 'primary';
      case 'Approved': return 'success';
      case 'Completed': return 'info';
      case 'Cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const handleNewConsultation = (client) => {
    setSelectedClient(client);
    setShowConsultationModal(true);
  };

  return (
    <div className="cosmetic-gynecology-dashboard">
      <Container fluid>
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="mb-1">
                  <i className="ri-user-heart-fill me-2 text-primary"></i>
                  Cosmetic Gynecology
                  <Badge bg="success" className="ms-2 fs-6">AI-Powered</Badge>
                </h2>
                <p className="text-muted mb-0">Advanced Aesthetic & Functional Enhancement</p>
              </div>
              <div className="d-flex gap-2">
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => setShowNewClientModal(true)}
                >
                  <i className="ri-add-line me-1"></i>New Client
                </Button>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => setShowConsultationModal(true)}
                >
                  <i className="ri-brain-line me-1"></i>AI Consultation
                </Button>
                <Button variant="outline-secondary" size="sm">
                  <i className="ri-calendar-check-line me-1"></i>Schedule
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* AI-Powered Stats Cards */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="stat-card border-0 shadow-sm h-100">
              <Card.Body className="text-center">
                <div className="stat-icon bg-primary bg-opacity-10 rounded-circle mx-auto mb-2">
                  <i className="ri-user-heart-line text-primary fs-4"></i>
                </div>
                <h4 className="mb-1">{stats.totalClients}</h4>
                <small className="text-muted">Total Clients</small>
                <div className="mt-2">
                  <Badge bg="success" className="fs-7">+12% this month</Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stat-card border-0 shadow-sm h-100">
              <Card.Body className="text-center">
                <div className="stat-icon bg-info bg-opacity-10 rounded-circle mx-auto mb-2">
                  <i className="ri-brain-line text-info fs-4"></i>
                </div>
                <h4 className="mb-1">{stats.aiAnalysisCompleted}</h4>
                <small className="text-muted">AI Analysis Completed</small>
                <div className="mt-2">
                  <Badge bg="info" className="fs-7">Real-time</Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stat-card border-0 shadow-sm h-100">
              <Card.Body className="text-center">
                <div className="stat-icon bg-success bg-opacity-10 rounded-circle mx-auto mb-2">
                  <i className="ri-checkbox-circle-line text-success fs-4"></i>
                </div>
                <h4 className="mb-1">{stats.successRate}%</h4>
                <small className="text-muted">Success Rate</small>
                <div className="mt-2">
                  <Badge bg="success" className="fs-7">AI Optimized</Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stat-card border-0 shadow-sm h-100">
              <Card.Body className="text-center">
                <div className="stat-icon bg-warning bg-opacity-10 rounded-circle mx-auto mb-2">
                  <i className="ri-funds-line text-warning fs-4"></i>
                </div>
                <h4 className="mb-1">${stats.monthlyRevenue.toLocaleString()}</h4>
                <small className="text-muted">Monthly Revenue</small>
                <div className="mt-2">
                  <Badge bg="warning" className="fs-7">+18% growth</Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Main Content Tabs */}
        <Row>
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-bottom-0">
                <Tabs
                  activeKey={activeTab}
                  onSelect={(k) => setActiveTab(k)}
                  className="border-0"
                >
                  <Tab 
                    eventKey="overview" 
                    title={
                      <span>
                        <i className="ri-dashboard-line me-1"></i>Overview
                      </span>
                    }
                  />
                  <Tab 
                    eventKey="consultations" 
                    title={
                      <span>
                        <i className="ri-brain-line me-1"></i>AI Consultations
                      </span>
                    }
                  />
                  <Tab 
                    eventKey="treatments" 
                    title={
                      <span>
                        <i className="ri-file-list-3-line me-1"></i>Treatment Plans
                      </span>
                    }
                  />
                  <Tab 
                    eventKey="progress" 
                    title={
                      <span>
                        <i className="ri-line-chart-line me-1"></i>Progress Tracking
                      </span>
                    }
                  />
                </Tabs>
              </Card.Header>
              <Card.Body>
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <Row>
                    <Col lg={8}>
                      <Card className="border-0 bg-light">
                        <Card.Header className="bg-transparent">
                          <h6 className="mb-0">
                            <i className="ri-stethoscope-line me-2"></i>
                            Recent AI-Analyzed Consultations
                          </h6>
                        </Card.Header>
                        <Card.Body>
                          <Table responsive hover className="mb-0">
                            <thead>
                              <tr>
                                <th>Client</th>
                                <th>Type</th>
                                <th>AI Risk Score</th>
                                <th>Recommended Treatment</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {recentConsultations.map(consultation => (
                                <tr key={consultation.id}>
                                  <td>
                                    <div>
                                      <strong>{consultation.clientName}</strong>
                                      <br />
                                      <small className="text-muted">{consultation.date}</small>
                                    </div>
                                  </td>
                                  <td>{consultation.type}</td>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <span className="me-2">{consultation.aiRiskScore}</span>
                                      <Badge bg={getRiskBadgeVariant(consultation.riskLevel)} className="fs-7">
                                        {consultation.riskLevel}
                                      </Badge>
                                    </div>
                                  </td>
                                  <td>
                                    <small>{consultation.recommendedTreatment}</small>
                                  </td>
                                  <td>
                                    <Badge bg="info" className="fs-7">
                                      {consultation.status}
                                    </Badge>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col lg={4}>
                      <Card className="border-0 bg-light">
                        <Card.Header className="bg-transparent">
                          <h6 className="mb-0">
                            <i className="ri-scissors-2-line me-2"></i>
                            Available Treatments
                          </h6>
                        </Card.Header>
                        <Card.Body>
                          {treatments.map(treatment => (
                            <div key={treatment.id} className="mb-3 p-3 bg-white rounded">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <h6 className="mb-1">{treatment.name}</h6>
                                <Badge bg="outline-primary" className="fs-7">
                                  {treatment.category}
                                </Badge>
                              </div>
                              <div className="row g-2 mb-2">
                                <div className="col-6">
                                  <small className="text-muted">Success Rate</small>
                                  <div className="fw-bold text-success">{treatment.successRate}%</div>
                                </div>
                                <div className="col-6">
                                  <small className="text-muted">Duration</small>
                                  <div className="fw-bold">{treatment.duration} min</div>
                                </div>
                              </div>
                              <div className="d-flex justify-content-between align-items-center">
                                <span className="text-primary fw-bold">
                                  ${treatment.pricePerSession.toLocaleString()}
                                </span>
                                <Button size="sm" variant="outline-primary">
                                  <i className="ri-add-line"></i>
                                </Button>
                              </div>
                            </div>
                          ))}
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                )}

                {/* AI Consultations Tab */}
                {activeTab === 'consultations' && (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="mb-0">
                        <i className="ri-brain-line me-2 text-primary"></i>
                        AI-Powered Consultations
                      </h5>
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => setShowConsultationModal(true)}
                      >
                        <i className="ri-add-line me-1"></i>New AI Consultation
                      </Button>
                    </div>
                    
                    <Table responsive hover>
                      <thead>
                        <tr>
                          <th>Client</th>
                          <th>Consultation Type</th>
                          <th>Date</th>
                          <th>AI Risk Assessment</th>
                          <th>Recommended Treatments</th>
                          <th>Psychological Readiness</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentConsultations.map(consultation => (
                          <tr key={consultation.id}>
                            <td>
                              <div>
                                <strong>{consultation.clientName}</strong>
                                <br />
                                <small className="text-muted">ID: {consultation.id}</small>
                              </div>
                            </td>
                            <td>{consultation.type}</td>
                            <td>{consultation.date}</td>
                            <td>
                              <div>
                                <div className="d-flex align-items-center mb-1">
                                  <span className="me-2">Score: {consultation.aiRiskScore}</span>
                                  <Badge bg={getRiskBadgeVariant(consultation.riskLevel)} className="fs-7">
                                    {consultation.riskLevel}
                                  </Badge>
                                </div>
                                <ProgressBar 
                                  now={consultation.aiRiskScore * 10} 
                                  variant={consultation.riskLevel === 'LOW' ? 'success' : consultation.riskLevel === 'MEDIUM' ? 'warning' : 'danger'}
                                  size="sm"
                                />
                              </div>
                            </td>
                            <td>
                              <small>{consultation.recommendedTreatment}</small>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <i className="ri-emotion-line me-1 text-success"></i>
                                <span>High</span>
                              </div>
                            </td>
                            <td>
                              <Badge bg="info" className="fs-7">
                                {consultation.status}
                              </Badge>
                            </td>
                            <td>
                              <div className="d-flex gap-1">
                                <Button size="sm" variant="outline-primary">
                                  <i className="ri-eye-line"></i>
                                </Button>
                                <Button size="sm" variant="outline-success">
                                  <i className="ri-brain-line"></i>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}

                {/* Treatment Plans Tab */}
                {activeTab === 'treatments' && (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="mb-0">
                        <i className="ri-file-list-3-line me-2 text-primary"></i>
                        AI-Optimized Treatment Plans
                      </h5>
                      <Button variant="primary" size="sm">
                        <i className="ri-add-line me-1"></i>Create Plan
                      </Button>
                    </div>
                    
                    <Row>
                      {treatmentPlans.map(plan => (
                        <Col md={6} lg={4} key={plan.id} className="mb-4">
                          <Card className="border-0 shadow-sm h-100">
                            <Card.Header className="bg-light border-0">
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <h6 className="mb-1">{plan.planName}</h6>
                                  <small className="text-muted">{plan.clientName}</small>
                                </div>
                                <Badge bg={getStatusBadgeVariant(plan.status)} className="fs-7">
                                  {plan.status}
                                </Badge>
                              </div>
                            </Card.Header>
                            <Card.Body>
                              <div className="mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                  <small className="text-muted">AI Success Probability</small>
                                  <strong className="text-success">{plan.aiSuccessProbability}%</strong>
                                </div>
                                <ProgressBar 
                                  now={plan.aiSuccessProbability} 
                                  variant="success" 
                                  size="sm"
                                />
                              </div>
                              
                              <div className="mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                  <small className="text-muted">Progress</small>
                                  <small>{plan.sessionsCompleted}/{plan.totalSessions} sessions</small>
                                </div>
                                <ProgressBar 
                                  now={(plan.sessionsCompleted / plan.totalSessions) * 100} 
                                  variant="primary" 
                                  size="sm"
                                />
                              </div>
                              
                              <div className="row g-2 mb-3">
                                <div className="col-12">
                                  <small className="text-muted">Next Session</small>
                                  <div className="fw-bold">{plan.nextSession}</div>
                                </div>
                                <div className="col-12">
                                  <small className="text-muted">AI Optimization</small>
                                  <div className="fw-bold text-info">{plan.aiOptimization}</div>
                                </div>
                              </div>
                              
                              <div className="d-flex gap-2">
                                <Button size="sm" variant="outline-primary" className="flex-fill">
                                  <i className="ri-eye-line me-1"></i>View
                                </Button>
                                <Button size="sm" variant="outline-success">
                                  <i className="ri-brain-line"></i>
                                </Button>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}

                {/* Progress Tracking Tab */}
                {activeTab === 'progress' && (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="mb-0">
                        <i className="ri-line-chart-line me-2 text-primary"></i>
                        AI Progress Tracking & Analytics
                      </h5>
                      <Button variant="primary" size="sm">
                        <i className="ri-download-line me-1"></i>Export Report
                      </Button>
                    </div>
                    
                    <Row>
                      <Col lg={8}>
                        <Card className="border-0 bg-light">
                          <Card.Header className="bg-transparent">
                            <h6 className="mb-0">Treatment Progress Analytics</h6>
                          </Card.Header>
                          <Card.Body>
                            <Alert variant="info" className="border-0">
                              <i className="ri-information-line me-2"></i>
                              AI-powered progress tracking provides real-time insights into treatment effectiveness and patient satisfaction.
                            </Alert>
                            <div className="text-center py-5">
                              <i className="ri-bar-chart-line display-4 text-muted"></i>
                              <p className="text-muted mt-3">Progress analytics visualization will be displayed here</p>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col lg={4}>
                        <Card className="border-0 bg-light">
                          <Card.Header className="bg-transparent">
                            <h6 className="mb-0">AI Insights</h6>
                          </Card.Header>
                          <Card.Body>
                            <div className="mb-4">
                              <div className="d-flex align-items-center mb-2">
                                <i className="ri-trophy-line text-warning me-2"></i>
                                <strong>Top Performing Treatment</strong>
                              </div>
                              <p className="mb-1">MonaLisa Touch Treatment</p>
                              <small className="text-muted">94.2% success rate with AI optimization</small>
                            </div>
                            
                            <div className="mb-4">
                              <div className="d-flex align-items-center mb-2">
                                <i className="ri-user-smile-line text-success me-2"></i>
                                <strong>Patient Satisfaction</strong>
                              </div>
                              <p className="mb-1">4.9/5.0 Average Rating</p>
                              <small className="text-muted">AI analysis shows high satisfaction correlation</small>
                            </div>
                            
                            <div className="mb-4">
                              <div className="d-flex align-items-center mb-2">
                                <i className="ri-brain-line text-info me-2"></i>
                                <strong>AI Recommendations</strong>
                              </div>
                              <p className="mb-1">12 Active Optimizations</p>
                              <small className="text-muted">Treatment parameters continuously optimized</small>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* New Client Modal */}
        <Modal show={showNewClientModal} onHide={() => setShowNewClientModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="ri-user-add-line me-2"></i>
              New Cosmetic Gynecology Client
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert variant="info" className="border-0">
              <i className="ri-brain-line me-2"></i>
              AI analysis will be automatically performed upon client registration for risk assessment and treatment recommendations.
            </Alert>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter client name" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Age</Form.Label>
                    <Form.Control type="number" placeholder="Enter age" />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control type="tel" placeholder="Enter phone number" />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Primary Concerns</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Describe primary aesthetic or functional concerns" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Medical History</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Relevant medical and surgical history" />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowNewClientModal(false)}>
              Cancel
            </Button>
            <Button variant="primary">
              <i className="ri-brain-line me-1"></i>
              Create & Run AI Analysis
            </Button>
          </Modal.Footer>
        </Modal>

        {/* AI Consultation Modal */}
        <Modal show={showConsultationModal} onHide={() => setShowConsultationModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="ri-brain-line me-2"></i>
              AI-Powered Consultation
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert variant="success" className="border-0">
              <i className="ri-magic-line me-2"></i>
              AI consultation provides comprehensive risk assessment, treatment recommendations, and optimization suggestions.
            </Alert>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Select Client</Form.Label>
                <Form.Select>
                  <option>Choose a client...</option>
                  <option>Sarah Johnson</option>
                  <option>Maria Rodriguez</option>
                  <option>Jennifer Chen</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Chief Complaints</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Patient's main concerns and symptoms" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Physical Examination Findings</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Clinical examination results" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Client Expectations</Form.Label>
                <Form.Control as="textarea" rows={2} placeholder="Patient's goals and expectations" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Psychological Readiness (1-10)</Form.Label>
                <Form.Range min={1} max={10} defaultValue={7} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowConsultationModal(false)}>
              Cancel
            </Button>
            <Button variant="primary">
              <i className="ri-brain-line me-1"></i>
              Run AI Analysis
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>

      <style jsx>{`
        .stat-card {
          transition: transform 0.2s ease-in-out;
        }
        
        .stat-card:hover {
          transform: translateY(-2px);
        }
        
        .stat-icon {
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .cosmetic-gynecology-dashboard .table th {
          border-top: none;
          font-weight: 600;
          color: #495057;
          font-size: 0.875rem;
        }
        
        .cosmetic-gynecology-dashboard .nav-tabs .nav-link {
          border: none;
          color: #6c757d;
          font-weight: 500;
        }
        
        .cosmetic-gynecology-dashboard .nav-tabs .nav-link.active {
          background-color: transparent;
          border-bottom: 2px solid #0d6efd;
          color: #0d6efd;
        }
      `}</style>
    </div>
  );
};

export default CosmeticGynecologyDashboard;
