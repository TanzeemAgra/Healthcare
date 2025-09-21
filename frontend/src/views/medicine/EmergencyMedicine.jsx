import React, { useState, useEffect } from "react";
import apiClient from "../../services/api";
import { MEDICINE_ENDPOINTS } from "../../services/apiConstants";
import { Col, Row, Container, Card, Button, Modal, Form, Badge, Nav, Tab, Table, Alert, ProgressBar } from "react-bootstrap";

const EmergencyMedicine = () => {
  const [emergencyCases, setEmergencyCases] = useState([]);
  const [triageBoard, setTriageBoard] = useState({});
  const [activeCases, setActiveCases] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchEmergencyCases();
    fetchTriageBoard();
    fetchActiveCases();
  }, []);

  const fetchEmergencyCases = async () => {
    try {
      const response = await apiClient.get(MEDICINE_ENDPOINTS.EMERGENCY.CASES);
      if (response.status >= 200 && response.status < 300) {
        const data = response.data;
        setEmergencyCases(Array.isArray(data.results) ? data.results : Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch emergency cases:', response.status);
        setEmergencyCases([]);
      }
    } catch (error) {
      console.error('Error fetching emergency cases:', error);
      setEmergencyCases([]);
    }
  };

  const fetchTriageBoard = async () => {
    try {
      const response = await apiClient.get(MEDICINE_ENDPOINTS.EMERGENCY.TRIAGE_BOARD);
      if (response.status >= 200 && response.status < 300) {
        const data = response.data;
        setTriageBoard(data || {});
      } else {
        console.error('Failed to fetch triage board:', response.status);
        setTriageBoard({});
      }
    } catch (error) {
      console.error('Error fetching triage board:', error);
      setTriageBoard({});
    }
  };

  const fetchActiveCases = async () => {
    try {
      const response = await apiClient.get(MEDICINE_ENDPOINTS.EMERGENCY.ACTIVE_CASES);
      if (response.status >= 200 && response.status < 300) {
        const data = response.data;
        setActiveCases(Array.isArray(data.results) ? data.results : Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch active cases:', response.status);
        setActiveCases([]);
      }
    } catch (error) {
      console.error('Error fetching active cases:', error);
      setActiveCases([]);
    }
  };

  const handleModalOpen = (type, caseData = null) => {
    setModalType(type);
    setSelectedCase(caseData);
    setFormData({});
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setModalType('');
    setSelectedCase(null);
    setFormData({});
  };

  const getTriageLevelColor = (level) => {
    switch (level) {
      case '1':
        return 'danger';
      case '2':
        return 'warning';
      case '3':
        return 'info';
      case '4':
        return 'success';
      case '5':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getTriageLevelIcon = (level) => {
    switch (level) {
      case '1':
        return 'ri-alarm-warning-line';
      case '2':
        return 'ri-error-warning-line';
      case '3':
        return 'ri-information-line';
      case '4':
        return 'ri-checkbox-circle-line';
      case '5':
        return 'ri-time-line';
      default:
        return 'ri-question-line';
    }
  };

  const getDispositionColor = (disposition) => {
    switch (disposition) {
      case 'admitted':
        return 'primary';
      case 'discharged':
        return 'success';
      case 'transferred':
        return 'info';
      case 'observation':
        return 'warning';
      case 'ama':
        return 'danger';
      case 'deceased':
        return 'dark';
      default:
        return 'secondary';
    }
  };

  const calculateWaitTime = (arrivalTime) => {
    const now = new Date();
    const arrival = new Date(arrivalTime);
    const diffInMinutes = Math.floor((now - arrival) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;
      return `${hours}h ${minutes}m`;
    }
  };

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col lg={12}>
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="h3 mb-0">
              <i className="ri-emergency-fill me-2 text-danger"></i>
              Emergency Medicine
            </h1>
            <div>
              <Button 
                variant="outline-danger" 
                className="me-2"
                onClick={() => handleModalOpen('emergency-case')}
              >
                <i className="ri-add-line me-2"></i>
                New Emergency Case
              </Button>
              <Button 
                variant="danger"
                onClick={() => window.location.href = '/medicine/dashboard'}
              >
                <i className="ri-dashboard-line me-2"></i>
                Dashboard
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Triage Board */}
      <Row className="mb-4">
        <Col lg={12}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-danger text-white">
              <h5 className="mb-0">
                <i className="ri-alarm-warning-line me-2"></i>
                Emergency Department Triage Board
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col lg={2} md={4} className="mb-3">
                  <Card className="border-danger text-center">
                    <Card.Body>
                      <i className="ri-alarm-warning-line fs-1 text-danger"></i>
                      <h3 className="text-danger">{triageBoard.level_1 || 0}</h3>
                      <small className="text-muted">Level 1 - Critical</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={2} md={4} className="mb-3">
                  <Card className="border-warning text-center">
                    <Card.Body>
                      <i className="ri-error-warning-line fs-1 text-warning"></i>
                      <h3 className="text-warning">{triageBoard.level_2 || 0}</h3>
                      <small className="text-muted">Level 2 - Emergent</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={2} md={4} className="mb-3">
                  <Card className="border-info text-center">
                    <Card.Body>
                      <i className="ri-information-line fs-1 text-info"></i>
                      <h3 className="text-info">{triageBoard.level_3 || 0}</h3>
                      <small className="text-muted">Level 3 - Urgent</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={2} md={4} className="mb-3">
                  <Card className="border-success text-center">
                    <Card.Body>
                      <i className="ri-checkbox-circle-line fs-1 text-success"></i>
                      <h3 className="text-success">{triageBoard.level_4 || 0}</h3>
                      <small className="text-muted">Level 4 - Less Urgent</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={2} md={4} className="mb-3">
                  <Card className="border-secondary text-center">
                    <Card.Body>
                      <i className="ri-time-line fs-1 text-secondary"></i>
                      <h3 className="text-secondary">{triageBoard.level_5 || 0}</h3>
                      <small className="text-muted">Level 5 - Non-urgent</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={2} md={4} className="mb-3">
                  <Card className="border-primary text-center">
                    <Card.Body>
                      <i className="ri-hospital-line fs-1 text-primary"></i>
                      <h3 className="text-primary">{triageBoard.total || 0}</h3>
                      <small className="text-muted">Total Cases Today</small>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Content Tabs */}
      <Row>
        <Col lg={12}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <Tab.Container defaultActiveKey="active-cases">
                <Nav variant="pills" className="mb-4">
                  <Nav.Item>
                    <Nav.Link eventKey="active-cases">
                      <i className="ri-pulse-line me-2"></i>
                      Active Cases ({activeCases.length})
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="all-cases">
                      <i className="ri-file-list-3-line me-2"></i>
                      All Cases ({emergencyCases.length})
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="trauma-center">
                      <i className="ri-shield-cross-line me-2"></i>
                      Trauma Center
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="protocols">
                      <i className="ri-file-shield-2-line me-2"></i>
                      Emergency Protocols
                    </Nav.Link>
                  </Nav.Item>
                </Nav>

                <Tab.Content>
                  {/* Active Cases Tab */}
                  <Tab.Pane eventKey="active-cases">
                    <div className="mb-3">
                      <h5>Active Emergency Cases</h5>
                      <p className="text-muted">Patients currently being treated in the emergency department.</p>
                    </div>
                    
                    <div className="table-responsive">
                      <Table striped hover>
                        <thead>
                          <tr>
                            <th>Case ID</th>
                            <th>Patient</th>
                            <th>Triage Level</th>
                            <th>Chief Complaint</th>
                            <th>Arrival Time</th>
                            <th>Wait Time</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(Array.isArray(activeCases) ? activeCases : []).map((emergencyCase) => (
                            <tr key={emergencyCase.id}>
                              <td><code>{emergencyCase.case_id}</code></td>
                              <td>
                                <strong>{emergencyCase.patient?.user?.first_name} {emergencyCase.patient?.user?.last_name}</strong>
                                <br />
                                <small className="text-muted">
                                  {emergencyCase.patient?.age}y, {emergencyCase.patient?.gender}
                                </small>
                              </td>
                              <td>
                                <Badge bg={getTriageLevelColor(emergencyCase.triage_level)} className="d-flex align-items-center">
                                  <i className={`${getTriageLevelIcon(emergencyCase.triage_level)} me-1`}></i>
                                  Level {emergencyCase.triage_level}
                                </Badge>
                              </td>
                              <td>{emergencyCase.chief_complaint}</td>
                              <td>
                                <small>{new Date(emergencyCase.arrival_datetime).toLocaleString()}</small>
                              </td>
                              <td>
                                <Badge bg="info">{calculateWaitTime(emergencyCase.arrival_datetime)}</Badge>
                              </td>
                              <td>
                                <Badge bg={getDispositionColor(emergencyCase.disposition)}>
                                  {emergencyCase.disposition_display}
                                </Badge>
                                {emergencyCase.is_trauma && (
                                  <Badge bg="warning" className="ms-1">Trauma</Badge>
                                )}
                                {emergencyCase.is_critical && (
                                  <Badge bg="danger" className="ms-1">Critical</Badge>
                                )}
                              </td>
                              <td>
                                <Button size="sm" variant="outline-primary" className="me-1">
                                  <i className="ri-eye-line"></i>
                                </Button>
                                <Button size="sm" variant="outline-success" className="me-1">
                                  <i className="ri-edit-line"></i>
                                </Button>
                                <Button size="sm" variant="outline-danger">
                                  <i className="ri-hospital-line"></i>
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Tab.Pane>

                  {/* All Cases Tab */}
                  <Tab.Pane eventKey="all-cases">
                    <div className="mb-3 d-flex justify-content-between align-items-center">
                      <div>
                        <h5>All Emergency Cases</h5>
                        <p className="text-muted">Complete history of emergency department cases.</p>
                      </div>
                      <Button variant="danger" onClick={() => handleModalOpen('emergency-case')}>
                        <i className="ri-add-line me-2"></i>
                        New Case
                      </Button>
                    </div>
                    
                    <div className="table-responsive">
                      <Table striped hover>
                        <thead>
                          <tr>
                            <th>Case ID</th>
                            <th>Patient</th>
                            <th>Triage</th>
                            <th>Arrival Mode</th>
                            <th>Chief Complaint</th>
                            <th>Primary Diagnosis</th>
                            <th>Disposition</th>
                            <th>Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(Array.isArray(emergencyCases) ? emergencyCases : []).map((emergencyCase) => (
                            <tr key={emergencyCase.id}>
                              <td><code>{emergencyCase.case_id}</code></td>
                              <td>
                                <strong>{emergencyCase.patient?.user?.first_name} {emergencyCase.patient?.user?.last_name}</strong>
                                <br />
                                <small className="text-muted">{emergencyCase.patient?.patient_id}</small>
                              </td>
                              <td>
                                <Badge bg={getTriageLevelColor(emergencyCase.triage_level)}>
                                  L{emergencyCase.triage_level}
                                </Badge>
                              </td>
                              <td>
                                <Badge bg="info">{emergencyCase.arrival_mode_display}</Badge>
                              </td>
                              <td>{emergencyCase.chief_complaint.substring(0, 50)}...</td>
                              <td>{emergencyCase.primary_diagnosis.substring(0, 40)}...</td>
                              <td>
                                <Badge bg={getDispositionColor(emergencyCase.disposition)}>
                                  {emergencyCase.disposition_display}
                                </Badge>
                              </td>
                              <td>
                                <small>{new Date(emergencyCase.arrival_datetime).toLocaleDateString()}</small>
                              </td>
                              <td>
                                <Button size="sm" variant="outline-success" className="me-1">
                                  <i className="ri-eye-line"></i>
                                </Button>
                                <Button size="sm" variant="outline-info">
                                  <i className="ri-file-text-line"></i>
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Tab.Pane>

                  {/* Trauma Center Tab */}
                  <Tab.Pane eventKey="trauma-center">
                    <div className="mb-4">
                      <h5>Trauma Center Management</h5>
                      <p className="text-muted">Specialized trauma care protocols and patient management.</p>
                    </div>

                    <Row>
                      <Col lg={4} className="mb-4">
                        <Card className="border-danger">
                          <Card.Header className="bg-danger text-white">
                            <h6 className="mb-0">
                              <i className="ri-shield-cross-line me-2"></i>
                              Trauma Activation
                            </h6>
                          </Card.Header>
                          <Card.Body>
                            <div className="mb-3">
                              <h6>Level 1 Trauma Criteria:</h6>
                              <ul className="small">
                                <li>Penetrating trauma to head, neck, torso</li>
                                <li>Gunshot wounds to head, neck, torso</li>
                                <li>Falls &gt;20 feet</li>
                                <li>High-speed MVC &gt;40 mph</li>
                                <li>Motorcycle crash &gt;20 mph</li>
                              </ul>
                            </div>
                            <Button variant="danger" size="sm" className="w-100">
                              <i className="ri-alarm-warning-line me-2"></i>
                              Activate Level 1 Trauma
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                      
                      <Col lg={4} className="mb-4">
                        <Card className="border-warning">
                          <Card.Header className="bg-warning text-dark">
                            <h6 className="mb-0">
                              <i className="ri-error-warning-line me-2"></i>
                              Trauma Team
                            </h6>
                          </Card.Header>
                          <Card.Body>
                            <div className="mb-3">
                              <h6>Team Members:</h6>
                              <ul className="small">
                                <li>Trauma Surgeon</li>
                                <li>Emergency Physician</li>
                                <li>Anesthesiologist</li>
                                <li>Trauma Nurse</li>
                                <li>Respiratory Therapist</li>
                                <li>Radiology Tech</li>
                              </ul>
                            </div>
                            <Button variant="warning" size="sm" className="w-100">
                              <i className="ri-team-line me-2"></i>
                              Assemble Trauma Team
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                      
                      <Col lg={4} className="mb-4">
                        <Card className="border-info">
                          <Card.Header className="bg-info text-white">
                            <h6 className="mb-0">
                              <i className="ri-time-line me-2"></i>
                              Response Times
                            </h6>
                          </Card.Header>
                          <Card.Body>
                            <div className="mb-2">
                              <small className="text-muted">Level 1 Response:</small>
                              <ProgressBar variant="success" now={85} label="<5 min" />
                            </div>
                            <div className="mb-2">
                              <small className="text-muted">Level 2 Response:</small>
                              <ProgressBar variant="warning" now={70} label="<15 min" />
                            </div>
                            <div className="mb-3">
                              <small className="text-muted">OR Availability:</small>
                              <ProgressBar variant="info" now={60} label="<30 min" />
                            </div>
                            <Button variant="info" size="sm" className="w-100">
                              <i className="ri-refresh-line me-2"></i>
                              Check OR Status
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>

                    <Card className="border-0 shadow-sm">
                      <Card.Header>
                        <h6 className="mb-0">Active Trauma Cases</h6>
                      </Card.Header>
                      <Card.Body>
                        <div className="table-responsive">
                          <Table striped hover size="sm">
                            <thead>
                              <tr>
                                <th>Case ID</th>
                                <th>Patient</th>
                                <th>Mechanism of Injury</th>
                                <th>Level</th>
                                <th>Team Status</th>
                                <th>Time Since Activation</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(Array.isArray(emergencyCases) ? emergencyCases : []).filter(c => c.is_trauma).map((traumaCase) => (
                                <tr key={traumaCase.id}>
                                  <td><code>{traumaCase.case_id}</code></td>
                                  <td>
                                    <strong>{traumaCase.patient?.user?.first_name} {traumaCase.patient?.user?.last_name}</strong>
                                  </td>
                                  <td>{traumaCase.chief_complaint}</td>
                                  <td>
                                    <Badge bg={getTriageLevelColor(traumaCase.triage_level)}>
                                      L{traumaCase.triage_level}
                                    </Badge>
                                  </td>
                                  <td>
                                    <Badge bg="success">Team Assembled</Badge>
                                  </td>
                                  <td>
                                    <Badge bg="info">{calculateWaitTime(traumaCase.arrival_datetime)}</Badge>
                                  </td>
                                  <td>
                                    <Button size="sm" variant="outline-primary">
                                      <i className="ri-eye-line"></i>
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      </Card.Body>
                    </Card>
                  </Tab.Pane>

                  {/* Emergency Protocols Tab */}
                  <Tab.Pane eventKey="protocols">
                    <div className="mb-4">
                      <h5>Emergency Medicine Protocols</h5>
                      <p className="text-muted">Standardized protocols for emergency care and procedures.</p>
                    </div>

                    <Row>
                      <Col lg={6} className="mb-4">
                        <Card className="border-0 shadow-sm">
                          <Card.Header className="bg-primary text-white">
                            <h6 className="mb-0">
                              <i className="ri-heart-pulse-line me-2"></i>
                              Cardiac Protocols
                            </h6>
                          </Card.Header>
                          <Card.Body>
                            <div className="list-group list-group-flush">
                              <div className="list-group-item border-0 px-0">
                                <strong>STEMI Protocol</strong>
                                <p className="small text-muted mb-1">Door-to-balloon time &lt;90 minutes</p>
                                <Badge bg="danger">Critical</Badge>
                              </div>
                              <div className="list-group-item border-0 px-0">
                                <strong>Cardiac Arrest (ACLS)</strong>
                                <p className="small text-muted mb-1">CPR, defibrillation, medications</p>
                                <Badge bg="danger">Critical</Badge>
                              </div>
                              <div className="list-group-item border-0 px-0">
                                <strong>Acute Heart Failure</strong>
                                <p className="small text-muted mb-1">NIPPV, diuretics, afterload reduction</p>
                                <Badge bg="warning">Urgent</Badge>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                      
                      <Col lg={6} className="mb-4">
                        <Card className="border-0 shadow-sm">
                          <Card.Header className="bg-success text-white">
                            <h6 className="mb-0">
                              <i className="ri-lungs-line me-2"></i>
                              Respiratory Protocols
                            </h6>
                          </Card.Header>
                          <Card.Body>
                            <div className="list-group list-group-flush">
                              <div className="list-group-item border-0 px-0">
                                <strong>Severe Asthma</strong>
                                <p className="small text-muted mb-1">Nebulizers, steroids, magnesium</p>
                                <Badge bg="warning">Urgent</Badge>
                              </div>
                              <div className="list-group-item border-0 px-0">
                                <strong>Pneumothorax</strong>
                                <p className="small text-muted mb-1">Chest tube insertion</p>
                                <Badge bg="danger">Critical</Badge>
                              </div>
                              <div className="list-group-item border-0 px-0">
                                <strong>Pulmonary Embolism</strong>
                                <p className="small text-muted mb-1">Anticoagulation, thrombolysis</p>
                                <Badge bg="warning">Urgent</Badge>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                      
                      <Col lg={6} className="mb-4">
                        <Card className="border-0 shadow-sm">
                          <Card.Header className="bg-warning text-dark">
                            <h6 className="mb-0">
                              <i className="ri-brain-line me-2"></i>
                              Neurological Protocols
                            </h6>
                          </Card.Header>
                          <Card.Body>
                            <div className="list-group list-group-flush">
                              <div className="list-group-item border-0 px-0">
                                <strong>Acute Stroke</strong>
                                <p className="small text-muted mb-1">tPA within 4.5 hours</p>
                                <Badge bg="danger">Critical</Badge>
                              </div>
                              <div className="list-group-item border-0 px-0">
                                <strong>Status Epilepticus</strong>
                                <p className="small text-muted mb-1">Benzodiazepines, antiepileptics</p>
                                <Badge bg="danger">Critical</Badge>
                              </div>
                              <div className="list-group-item border-0 px-0">
                                <strong>Severe Head Injury</strong>
                                <p className="small text-muted mb-1">ICP monitoring, neurosurgery</p>
                                <Badge bg="danger">Critical</Badge>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                      
                      <Col lg={6} className="mb-4">
                        <Card className="border-0 shadow-sm">
                          <Card.Header className="bg-danger text-white">
                            <h6 className="mb-0">
                              <i className="ri-drop-line me-2"></i>
                              Toxicology Protocols
                            </h6>
                          </Card.Header>
                          <Card.Body>
                            <div className="list-group list-group-flush">
                              <div className="list-group-item border-0 px-0">
                                <strong>Overdose Management</strong>
                                <p className="small text-muted mb-1">Antidotes, supportive care</p>
                                <Badge bg="danger">Critical</Badge>
                              </div>
                              <div className="list-group-item border-0 px-0">
                                <strong>Alcohol Withdrawal</strong>
                                <p className="small text-muted mb-1">CIWA protocol, benzodiazepines</p>
                                <Badge bg="warning">Urgent</Badge>
                              </div>
                              <div className="list-group-item border-0 px-0">
                                <strong>Carbon Monoxide</strong>
                                <p className="small text-muted mb-1">100% oxygen, hyperbaric</p>
                                <Badge bg="danger">Critical</Badge>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal for New Emergency Case */}
      <Modal show={showModal} onHide={handleModalClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-first-aid-kit-line me-2"></i>
            New Emergency Case
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="info">
            <i className="ri-information-line me-2"></i>
            This is a demo interface. In a real implementation, this form would be fully functional with validation and API integration.
          </Alert>
          
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Patient</Form.Label>
                  <Form.Select required>
                    <option value="">Select Patient</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Triage Level</Form.Label>
                  <Form.Select required>
                    <option value="">Select Triage Level</option>
                    <option value="1">Level 1 - Critical (Life-threatening)</option>
                    <option value="2">Level 2 - Emergent (High risk)</option>
                    <option value="3">Level 3 - Urgent (Moderate risk)</option>
                    <option value="4">Level 4 - Less Urgent (Low risk)</option>
                    <option value="5">Level 5 - Non-urgent (No risk)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Arrival Mode</Form.Label>
                  <Form.Select required>
                    <option value="">Select Arrival Mode</option>
                    <option value="ambulance">Ambulance</option>
                    <option value="walk_in">Walk-in</option>
                    <option value="private_vehicle">Private Vehicle</option>
                    <option value="helicopter">Helicopter</option>
                    <option value="police">Police Transport</option>
                    <option value="transfer">Hospital Transfer</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <div className="row">
                  <div className="col-6">
                    <Form.Group className="mb-3">
                      <Form.Check 
                        type="checkbox"
                        label="Trauma Case"
                        id="is_trauma"
                      />
                    </Form.Group>
                  </div>
                  <div className="col-6">
                    <Form.Group className="mb-3">
                      <Form.Check 
                        type="checkbox"
                        label="Critical Case"
                        id="is_critical"
                      />
                    </Form.Group>
                  </div>
                </div>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Chief Complaint</Form.Label>
              <Form.Control as="textarea" rows={3} required />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>History of Present Illness</Form.Label>
              <Form.Control as="textarea" rows={4} required />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Pain Scale (0-10)</Form.Label>
                  <Form.Control type="number" min="0" max="10" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Attending Physician</Form.Label>
                  <Form.Select required>
                    <option value="">Select Attending Physician</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button variant="danger">
            <i className="ri-save-line me-2"></i>
            Create Emergency Case
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default EmergencyMedicine;
