import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Badge, Alert, Modal, Tabs, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ProtectedRoute from '../common/ProtectedRoute';

const HomeopathyDashboard = () => {
  const navigate = useNavigate();
  const [showNewConsultationModal, setShowNewConsultationModal] = useState(false);
  const [consultationForm, setConsultationForm] = useState({
    patientName: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    chiefComplaint: '',
    presentIllness: '',
    medicalHistory: '',
    symptoms: '',
    mentalEmotional: '',
    physicalGeneral: '',
    appetite: '',
    sleep: '',
    thermals: ''
  });

  const [stats, setStats] = useState({
    totalPatients: 127,
    activeRemedies: 45,
    successRate: 89,
    avgHealingTime: 21,
    todayConsultations: 8,
    pendingFollowups: 12
  });

  const [recentCases, setRecentCases] = useState([
    {
      id: 1,
      patientName: "Sarah Johnson",
      chiefComplaint: "Chronic Migraine",
      suggestedRemedy: "Belladonna 30C",
      confidence: 92,
      status: "Under Treatment",
      lastVisit: "2025-07-28"
    },
    {
      id: 2,
      patientName: "Michael Chen",
      chiefComplaint: "Anxiety & Insomnia",
      suggestedRemedy: "Arsenicum Album 200C",
      confidence: 87,
      status: "Improving",
      lastVisit: "2025-07-27"
    },
    {
      id: 3,
      patientName: "Emma Davis",
      chiefComplaint: "Digestive Issues",
      suggestedRemedy: "Nux Vomica 6C",
      confidence: 94,
      status: "Follow-up Due",
      lastVisit: "2025-07-25"
    }
  ]);

  const [aiInsights, setAiInsights] = useState([
    {
      type: "success",
      message: "AI detected 95% accuracy in your recent remedy selections for respiratory cases"
    },
    {
      type: "info", 
      message: "Pattern analysis suggests increasing Sulphur prescriptions for skin conditions this season"
    },
    {
      type: "warning",
      message: "3 patients showing slower than expected response - consider potency adjustment"
    }
  ]);

  return (
    <div className="homeopathy-dashboard">
      <Container fluid>
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="mb-1">Homeopathy Practice Dashboard</h2>
                <p className="text-muted mb-0">AI-Powered Homeopathic Medicine Management</p>
              </div>
              <div className="d-flex gap-2">
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => setShowNewConsultationModal(true)}
                >
                  <i className="ri-add-line me-1"></i>New Consultation
                </Button>
                <Button variant="outline-primary" size="sm">
                  <i className="ri-brain-line me-1"></i>AI Analysis
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Stats Cards */}
        <Row className="mb-4">
          <Col md={2}>
            <Card className="stat-card border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="stat-icon bg-primary bg-opacity-10 rounded-circle mx-auto mb-2">
                  <i className="ri-user-heart-line text-primary fs-4"></i>
                </div>
                <h4 className="mb-1">{stats.totalPatients}</h4>
                <p className="text-muted mb-0 small">Total Patients</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="stat-card border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="stat-icon bg-success bg-opacity-10 rounded-circle mx-auto mb-2">
                  <i className="ri-medicine-bottle-line text-success fs-4"></i>
                </div>
                <h4 className="mb-1">{stats.activeRemedies}</h4>
                <p className="text-muted mb-0 small">Active Remedies</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="stat-card border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="stat-icon bg-info bg-opacity-10 rounded-circle mx-auto mb-2">
                  <i className="ri-heart-pulse-line text-info fs-4"></i>
                </div>
                <h4 className="mb-1">{stats.successRate}%</h4>
                <p className="text-muted mb-0 small">Success Rate</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="stat-card border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="stat-icon bg-warning bg-opacity-10 rounded-circle mx-auto mb-2">
                  <i className="ri-time-line text-warning fs-4"></i>
                </div>
                <h4 className="mb-1">{stats.avgHealingTime}</h4>
                <p className="text-muted mb-0 small">Avg Healing (days)</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="stat-card border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="stat-icon bg-secondary bg-opacity-10 rounded-circle mx-auto mb-2">
                  <i className="ri-calendar-check-line text-secondary fs-4"></i>
                </div>
                <h4 className="mb-1">{stats.todayConsultations}</h4>
                <p className="text-muted mb-0 small">Today's Cases</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="stat-card border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="stat-icon bg-danger bg-opacity-10 rounded-circle mx-auto mb-2">
                  <i className="ri-notification-2-line text-danger fs-4"></i>
                </div>
                <h4 className="mb-1">{stats.pendingFollowups}</h4>
                <p className="text-muted mb-0 small">Pending Follow-ups</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* AI Insights */}
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-transparent border-0 pb-0">
                <h5 className="mb-0">
                  <i className="ri-brain-line text-primary me-2"></i>
                  AI Insights & Recommendations
                </h5>
              </Card.Header>
              <Card.Body>
                {aiInsights.map((insight, index) => (
                  <Alert key={index} variant={insight.type} className="mb-2 py-2">
                    <small>{insight.message}</small>
                  </Alert>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* AI-Powered Homeopathic Intelligence Section */}
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-lg bg-gradient-primary text-white">
              <Card.Header className="bg-transparent border-0">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h4 className="mb-1 text-white">
                      <i className="ri-brain-2-fill me-2"></i>
                      AI-Powered Homeopathic Intelligence
                    </h4>
                    <p className="mb-0 opacity-75">Advanced Generative AI for Holistic Healing Solutions</p>
                  </div>
                  <div className="d-flex gap-2">
                    <Button variant="light" size="sm">
                      <i className="ri-play-circle-fill me-1"></i>
                      Start AI Analysis
                    </Button>
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col lg={3} md={6} className="mb-3">
                    <Card className="h-100 border-0 shadow-sm bg-white text-dark">
                      <Card.Body className="text-center p-3">
                        <div className="mb-3">
                          <i className="ri-medicine-bottle-2-fill text-primary" style={{ fontSize: '2.5rem' }}></i>
                        </div>
                        <h6 className="mb-2">AI Remedy Selector</h6>
                        <p className="small text-muted mb-3">
                          Deep learning analysis of 3000+ remedies with constitutional typing
                        </p>
                        <Button variant="outline-primary" size="sm" className="w-100">
                          <i className="ri-search-2-line me-1"></i>
                          Find Remedy
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col lg={3} md={6} className="mb-3">
                    <Card className="h-100 border-0 shadow-sm bg-white text-dark">
                      <Card.Body className="text-center p-3">
                        <div className="mb-3">
                          <i className="ri-brain-line text-success" style={{ fontSize: '2.5rem' }}></i>
                        </div>
                        <h6 className="mb-2">AI-Powered Diagnosis</h6>
                        <p className="small text-muted mb-3">
                          Advanced symptom analysis with constitutional typing and remedy selection
                        </p>
                        <Button 
                          variant="outline-success" 
                          size="sm" 
                          className="w-100"
                          onClick={() => navigate('/homeopathy/diagnosis')}
                        >
                          <i className="ri-stethoscope-line me-1"></i>
                          Start Diagnosis
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col lg={3} md={6} className="mb-3">
                    <Card className="h-100 border-0 shadow-sm bg-white text-dark">
                      <Card.Body className="text-center p-3">
                        <div className="mb-3">
                          <i className="ri-user-heart-fill text-info" style={{ fontSize: '2.5rem' }}></i>
                        </div>
                        <h6 className="mb-2">Constitutional AI</h6>
                        <p className="small text-muted mb-3">
                          Advanced constitutional analysis with mental-emotional profiling
                        </p>
                        <Button variant="outline-info" size="sm" className="w-100">
                          <i className="ri-user-search-line me-1"></i>
                          Profile Patient
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col lg={3} md={6} className="mb-3">
                    <Card className="h-100 border-0 shadow-sm bg-white text-dark">
                      <Card.Body className="text-center p-3">
                        <div className="mb-3">
                          <i className="ri-pulse-fill text-warning" style={{ fontSize: '2.5rem' }}></i>
                        </div>
                        <h6 className="mb-2">Healing Predictor</h6>
                        <p className="small text-muted mb-3">
                          ML-based prognosis with treatment timeline predictions
                        </p>
                        <Button variant="outline-warning" size="sm" className="w-100">
                          <i className="ri-time-line me-1"></i>
                          Predict Outcome
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Advanced AI Features Row */}
        <Row className="mb-4">
          <Col lg={6} className="mb-3">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Header className="bg-transparent border-0">
                <h6 className="mb-0">
                  <i className="ri-flask-fill text-primary me-2"></i>
                  Miasmatic AI Analysis
                </h6>
              </Card.Header>
              <Card.Body>
                <div className="row g-2">
                  <div className="col-4">
                    <div className="bg-light rounded p-2 text-center">
                      <i className="ri-virus-fill text-danger d-block mb-1"></i>
                      <small className="fw-bold">Psoric</small>
                      <div className="small text-muted">67%</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="bg-light rounded p-2 text-center">
                      <i className="ri-dna-fill text-warning d-block mb-1"></i>
                      <small className="fw-bold">Sycotic</small>
                      <div className="small text-muted">23%</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="bg-light rounded p-2 text-center">
                      <i className="ri-skull-2-fill text-info d-block mb-1"></i>
                      <small className="fw-bold">Syphilitic</small>
                      <div className="small text-muted">10%</div>
                    </div>
                  </div>
                </div>
                <Button variant="outline-primary" size="sm" className="w-100 mt-3">
                  <i className="ri-analyse-fill me-1"></i>
                  Deep Miasmatic Analysis
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6} className="mb-3">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Header className="bg-transparent border-0">
                <h6 className="mb-0">
                  <i className="ri-emotion-fill text-success me-2"></i>
                  Mental-Emotional AI Assessment
                </h6>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <small>Anxiety Patterns</small>
                    <small>High</small>
                  </div>
                  <div className="progress" style={{height: '6px'}}>
                    <div className="progress-bar bg-danger" style={{width: '78%'}}></div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <small>Emotional Sensitivity</small>
                    <small>Moderate</small>
                  </div>
                  <div className="progress" style={{height: '6px'}}>
                    <div className="progress-bar bg-warning" style={{width: '65%'}}></div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <small>Mental Clarity</small>
                    <small>Good</small>
                  </div>
                  <div className="progress" style={{height: '6px'}}>
                    <div className="progress-bar bg-success" style={{width: '82%'}}></div>
                  </div>
                </div>
                <Button variant="outline-success" size="sm" className="w-100">
                  <i className="ri-psychology-fill me-1"></i>
                  Full Psychological Profile
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          {/* Recent Cases */}
          <Col lg={8}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-transparent border-0 pb-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Recent Cases & AI Suggestions</h5>
                  <Button variant="outline-primary" size="sm">
                    <i className="ri-eye-line me-1"></i>View All
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                <Table responsive className="table-borderless">
                  <thead>
                    <tr className="text-muted">
                      <th>Patient</th>
                      <th>Chief Complaint</th>
                      <th>AI Suggested Remedy</th>
                      <th>Confidence</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentCases.map((case_) => (
                      <tr key={case_.id}>
                        <td>
                          <div>
                            <strong>{case_.patientName}</strong>
                            <br />
                            <small className="text-muted">{case_.lastVisit}</small>
                          </div>
                        </td>
                        <td>{case_.chiefComplaint}</td>
                        <td>
                          <Badge bg="primary" className="px-2 py-1">
                            {case_.suggestedRemedy}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="progress me-2" style={{width: '60px', height: '6px'}}>
                              <div 
                                className="progress-bar bg-success" 
                                style={{width: `${case_.confidence}%`}}
                              ></div>
                            </div>
                            <small>{case_.confidence}%</small>
                          </div>
                        </td>
                        <td>
                          <Badge 
                            bg={case_.status === 'Improving' ? 'success' : 
                                case_.status === 'Under Treatment' ? 'info' : 'warning'}
                          >
                            {case_.status}
                          </Badge>
                        </td>
                        <td>
                          <Button variant="outline-primary" size="sm">
                            <i className="ri-eye-line"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          {/* Quick Actions */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-transparent border-0 pb-0">
                <h5 className="mb-0">Quick Actions</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-grid gap-2">
                  <Button variant="primary" className="text-start">
                    <i className="ri-user-add-line me-2"></i>
                    New Patient Case Taking
                  </Button>
                  <Button variant="outline-primary" className="text-start">
                    <i className="ri-search-line me-2"></i>
                    AI Repertorization
                  </Button>
                  <Button variant="outline-primary" className="text-start">
                    <i className="ri-medicine-bottle-line me-2"></i>
                    Remedy Database
                  </Button>
                  <Button variant="outline-primary" className="text-start">
                    <i className="ri-file-text-line me-2"></i>
                    Case Analysis
                  </Button>
                  <Button variant="outline-primary" className="text-start">
                    <i className="ri-calendar-line me-2"></i>
                    Follow-up Scheduler
                  </Button>
                  <Button variant="outline-primary" className="text-start">
                    <i className="ri-bar-chart-line me-2"></i>
                    Treatment Analytics
                  </Button>
                </div>
              </Card.Body>
            </Card>

            {/* Today's Schedule */}
            <Card className="border-0 shadow-sm mt-3">
              <Card.Header className="bg-transparent border-0 pb-0">
                <h5 className="mb-0">Today's Schedule</h5>
              </Card.Header>
              <Card.Body>
                <div className="timeline">
                  <div className="timeline-item">
                    <div className="timeline-time">09:00 AM</div>
                    <div className="timeline-content">
                      <strong>Maria Rodriguez</strong>
                      <br />
                      <small className="text-muted">Follow-up - Arthritis</small>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-time">10:30 AM</div>
                    <div className="timeline-content">
                      <strong>John Smith</strong>
                      <br />
                      <small className="text-muted">New Case - Allergies</small>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-time">02:00 PM</div>
                    <div className="timeline-content">
                      <strong>AI Case Review</strong>
                      <br />
                      <small className="text-muted">Weekly Analysis</small>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* New Consultation Modal */}
      <Modal 
        show={showNewConsultationModal} 
        onHide={() => setShowNewConsultationModal(false)}
        size="lg"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-user-add-line me-2"></i>
            New Homeopathic Consultation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Tabs defaultActiveKey="patient-info" className="mb-3">
              <Tab eventKey="patient-info" title="Patient Information">
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Patient Name *</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter patient name"
                        value={consultationForm.patientName}
                        onChange={(e) => setConsultationForm({...consultationForm, patientName: e.target.value})}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Age *</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Age"
                        value={consultationForm.age}
                        onChange={(e) => setConsultationForm({...consultationForm, age: e.target.value})}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Gender *</Form.Label>
                      <Form.Select
                        value={consultationForm.gender}
                        onChange={(e) => setConsultationForm({...consultationForm, gender: e.target.value})}
                        required
                      >
                        <option value="">Select...</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        placeholder="Enter phone number"
                        value={consultationForm.phone}
                        onChange={(e) => setConsultationForm({...consultationForm, phone: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter email address"
                        value={consultationForm.email}
                        onChange={(e) => setConsultationForm({...consultationForm, email: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Tab>
              
              <Tab eventKey="chief-complaint" title="Chief Complaint">
                <Form.Group className="mb-3">
                  <Form.Label>Chief Complaint *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Primary concern or reason for consultation"
                    value={consultationForm.chiefComplaint}
                    onChange={(e) => setConsultationForm({...consultationForm, chiefComplaint: e.target.value})}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>History of Present Illness</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="When did it start? How did it develop? What makes it better/worse?"
                    value={consultationForm.presentIllness}
                    onChange={(e) => setConsultationForm({...consultationForm, presentIllness: e.target.value})}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Past Medical History</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Previous illnesses, surgeries, medications"
                    value={consultationForm.medicalHistory}
                    onChange={(e) => setConsultationForm({...consultationForm, medicalHistory: e.target.value})}
                  />
                </Form.Group>
              </Tab>

              <Tab eventKey="symptoms" title="Symptoms & Modalities">
                <Form.Group className="mb-3">
                  <Form.Label>Physical Symptoms</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Describe all physical symptoms in detail"
                    value={consultationForm.symptoms}
                    onChange={(e) => setConsultationForm({...consultationForm, symptoms: e.target.value})}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Mental & Emotional State</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Mood, fears, anxieties, mental clarity, etc."
                    value={consultationForm.mentalEmotional}
                    onChange={(e) => setConsultationForm({...consultationForm, mentalEmotional: e.target.value})}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Physical Generals</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Energy levels, constitution, weather preferences"
                    value={consultationForm.physicalGeneral}
                    onChange={(e) => setConsultationForm({...consultationForm, physicalGeneral: e.target.value})}
                  />
                </Form.Group>
              </Tab>

              <Tab eventKey="lifestyle" title="Lifestyle">
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Appetite & Food Preferences</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Appetite, cravings, aversions"
                        value={consultationForm.appetite}
                        onChange={(e) => setConsultationForm({...consultationForm, appetite: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Sleep Pattern</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Sleep quality, dreams, position"
                        value={consultationForm.sleep}
                        onChange={(e) => setConsultationForm({...consultationForm, sleep: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Thermal Reactions</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Hot/cold tendencies, weather preferences"
                    value={consultationForm.thermals}
                    onChange={(e) => setConsultationForm({...consultationForm, thermals: e.target.value})}
                  />
                </Form.Group>
              </Tab>
            </Tabs>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowNewConsultationModal(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="outline-primary"
            onClick={() => {
              // TODO: Save as draft functionality
              console.log('Save as draft:', consultationForm);
            }}
          >
            <i className="ri-draft-line me-1"></i>
            Save as Draft
          </Button>
          <Button 
            variant="primary"
            onClick={() => {
              // TODO: Process consultation and AI analysis
              console.log('Process consultation:', consultationForm);
              setShowNewConsultationModal(false);
              // Reset form
              setConsultationForm({
                patientName: '',
                age: '',
                gender: '',
                phone: '',
                email: '',
                chiefComplaint: '',
                presentIllness: '',
                medicalHistory: '',
                symptoms: '',
                mentalEmotional: '',
                physicalGeneral: '',
                appetite: '',
                sleep: '',
                thermals: ''
              });
            }}
          >
            <i className="ri-robot-line me-1"></i>
            Process with AI Analysis
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .stat-card {
          transition: transform 0.2s;
        }
        .stat-card:hover {
          transform: translateY(-2px);
        }
        .stat-icon {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .timeline {
          position: relative;
          padding-left: 20px;
        }
        .timeline::before {
          content: '';
          position: absolute;
          left: 8px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #e9ecef;
        }
        .timeline-item {
          position: relative;
          margin-bottom: 20px;
        }
        .timeline-item::before {
          content: '';
          position: absolute;
          left: -16px;
          top: 5px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #007bff;
        }
        .timeline-time {
          font-size: 12px;
          color: #6c757d;
          margin-bottom: 4px;
        }
      `}</style>
    </div>
  );
};

// Wrap the component with protection
const ProtectedHomeopathyDashboard = () => {
  return (
    <ProtectedRoute 
      permission="canAccessHomeopathyModule" 
      moduleName="Homeopathy Module"
    >
      <HomeopathyDashboard />
    </ProtectedRoute>
  );
};

export default ProtectedHomeopathyDashboard;
