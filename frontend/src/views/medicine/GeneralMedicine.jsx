import React, { useState, useEffect } from "react";
import apiClient from "../../services/api";
import { MEDICINE_ENDPOINTS } from "../../services/apiConstants";
import { Col, Row, Container, Card, Button, Modal, Form, Badge, Nav, Tab, Table, Alert } from "react-bootstrap";

const GeneralMedicine = () => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchPatients();
    fetchAppointments();
    fetchPrescriptions();
    fetchLabTests();
    fetchTreatmentPlans();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await apiClient.get(MEDICINE_ENDPOINTS.PATIENTS);
      if (response.status >= 200 && response.status < 300) {
        const data = response.data;
        setPatients(Array.isArray(data.results) ? data.results : Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch patients:', response.status);
        setPatients([]);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatients([]);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await apiClient.get(MEDICINE_ENDPOINTS.APPOINTMENTS);
      if (response.status >= 200 && response.status < 300) {
        const data = response.data;
        setAppointments(Array.isArray(data.results) ? data.results : Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch appointments:', response.status);
        setAppointments([]);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointments([]);
    }
  };

  const fetchPrescriptions = async () => {
    try {
      const response = await apiClient.get(MEDICINE_ENDPOINTS.PRESCRIPTIONS);
      if (response.status >= 200 && response.status < 300) {
        const data = response.data;
        setPrescriptions(Array.isArray(data.results) ? data.results : Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch prescriptions:', response.status);
        setPrescriptions([]);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      setPrescriptions([]);
    }
  };

  const fetchLabTests = async () => {
    try {
      const response = await apiClient.get(MEDICINE_ENDPOINTS.LAB_TESTS);
      if (response.status >= 200 && response.status < 300) {
        const data = response.data;
        setLabTests(Array.isArray(data.results) ? data.results : Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch lab tests:', response.status);
        setLabTests([]);
      }
    } catch (error) {
      console.error('Error fetching lab tests:', error);
      setLabTests([]);
    }
  };

  const fetchTreatmentPlans = async () => {
    try {
      const response = await apiClient.get(MEDICINE_ENDPOINTS.TREATMENT_PLANS);
      if (response.status >= 200 && response.status < 300) {
        const data = response.data;
        setTreatmentPlans(Array.isArray(data.results) ? data.results : Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch treatment plans:', response.status);
        setTreatmentPlans([]);
      }
    } catch (error) {
      console.error('Error fetching treatment plans:', error);
      setTreatmentPlans([]);
    }
  };

  const handleModalOpen = (type, patient = null) => {
    setModalType(type);
    setSelectedPatient(patient);
    setFormData({});
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setModalType('');
    setSelectedPatient(null);
    setFormData({});
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
  let endpoint = '';
    let method = 'POST';
    
    switch (modalType) {
      case 'appointment':
        endpoint = '/medicine/appointments/';
        break;
      case 'prescription':
        endpoint = '/medicine/prescriptions/';
        break;
      case 'lab-test':
        endpoint = '/medicine/lab-tests/';
        break;
      case 'treatment-plan':
        endpoint = '/medicine/treatment-plans/';
        break;
      default:
        return;
    }

    try {
      const response = await apiClient({ url: endpoint, method, data: formData });

      if (response.status >= 200 && response.status < 300) {
        handleModalClose();
        // Refresh the relevant data
        switch (modalType) {
          case 'appointment':
            fetchAppointments();
            break;
          case 'prescription':
            fetchPrescriptions();
            break;
          case 'lab-test':
            fetchLabTests();
            break;
          case 'treatment-plan':
            fetchTreatmentPlans();
            break;
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'scheduled':
      case 'ordered':
      case 'active':
        return 'primary';
      case 'confirmed':
      case 'completed':
        return 'success';
      case 'cancelled':
      case 'discontinued':
        return 'danger';
      case 'in_progress':
      case 'processing':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const getPriorityBadgeVariant = (priority) => {
    switch (priority) {
      case 'emergency':
        return 'danger';
      case 'urgent':
        return 'warning';
      case 'high':
        return 'info';
      case 'normal':
        return 'success';
      case 'low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col lg={12}>
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="h3 mb-0">
              <i className="ri-heart-pulse-line me-2 text-primary"></i>
              General Medicine
            </h1>
            <div>
              <Button 
                variant="outline-primary" 
                className="me-2"
                onClick={() => handleModalOpen('appointment')}
              >
                <i className="ri-calendar-check-line me-2"></i>
                New Appointment
              </Button>
              <Button 
                variant="primary"
                onClick={() => window.location.href = '/medicine/dashboard'}
              >
                <i className="ri-dashboard-line me-2"></i>
                Dashboard
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Main Content Tabs */}
      <Row>
        <Col lg={12}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <Tab.Container defaultActiveKey="patients">
                <Nav variant="pills" className="mb-4">
                  <Nav.Item>
                    <Nav.Link eventKey="patients">
                      <i className="ri-user-heart-line me-2"></i>
                      Patients ({patients.length})
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="appointments">
                      <i className="ri-calendar-check-line me-2"></i>
                      Appointments ({appointments.length})
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="prescriptions">
                      <i className="ri-medicine-bottle-line me-2"></i>
                      Prescriptions ({prescriptions.length})
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="lab-tests">
                      <i className="ri-test-tube-line me-2"></i>
                      Lab Tests ({labTests.length})
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="treatment-plans">
                      <i className="ri-file-list-3-line me-2"></i>
                      Treatment Plans ({treatmentPlans.length})
                    </Nav.Link>
                  </Nav.Item>
                </Nav>

                <Tab.Content>
                  {/* Patients Tab */}
                  <Tab.Pane eventKey="patients">
                    <div className="mb-3">
                      <h5>Patient Management</h5>
                      <p className="text-muted">Comprehensive patient care and medical history management.</p>
                    </div>
                    
                    <div className="table-responsive">
                      <Table striped hover>
                        <thead>
                          <tr>
                            <th>Patient ID</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Gender</th>
                            <th>Blood Type</th>
                            <th>Phone</th>
                            <th>Last Visit</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(Array.isArray(patients) ? patients : []).map((patient) => (
                            <tr key={patient.id}>
                              <td><code>{patient.patient_id}</code></td>
                              <td>
                                <strong>{patient.user?.first_name} {patient.user?.last_name}</strong>
                                <br />
                                <small className="text-muted">{patient.user?.email}</small>
                              </td>
                              <td>{patient.age}</td>
                              <td>
                                <Badge bg="light" text="dark">{patient.gender}</Badge>
                              </td>
                              <td>
                                <Badge bg="danger">{patient.blood_type || 'N/A'}</Badge>
                              </td>
                              <td>{patient.phone}</td>
                              <td>
                                <small className="text-muted">
                                  {patient.last_visit_date ? new Date(patient.last_visit_date).toLocaleDateString() : 'No visits'}
                                </small>
                              </td>
                              <td>
                                <Button 
                                  size="sm" 
                                  variant="outline-primary"
                                  onClick={() => handleModalOpen('appointment', patient)}
                                  className="me-1"
                                >
                                  <i className="ri-calendar-check-line"></i>
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline-success"
                                  onClick={() => handleModalOpen('prescription', patient)}
                                  className="me-1"
                                >
                                  <i className="ri-medicine-bottle-line"></i>
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline-info"
                                  onClick={() => handleModalOpen('lab-test', patient)}
                                >
                                  <i className="ri-test-tube-line"></i>
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Tab.Pane>

                  {/* Appointments Tab */}
                  <Tab.Pane eventKey="appointments">
                    <div className="mb-3 d-flex justify-content-between align-items-center">
                      <div>
                        <h5>Appointment Management</h5>
                        <p className="text-muted">Schedule and manage patient consultations.</p>
                      </div>
                      <Button variant="primary" onClick={() => handleModalOpen('appointment')}>
                        <i className="ri-add-line me-2"></i>
                        New Appointment
                      </Button>
                    </div>
                    
                    <div className="table-responsive">
                      <Table striped hover>
                        <thead>
                          <tr>
                            <th>Appointment ID</th>
                            <th>Patient</th>
                            <th>Doctor</th>
                            <th>Date & Time</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(Array.isArray(appointments) ? appointments : []).map((appointment) => (
                            <tr key={appointment.id}>
                              <td><code>{appointment.appointment_id}</code></td>
                              <td>
                                <strong>{appointment.patient?.user?.first_name} {appointment.patient?.user?.last_name}</strong>
                                <br />
                                <small className="text-muted">{appointment.patient?.patient_id}</small>
                              </td>
                              <td>
                                Dr. {appointment.doctor?.user?.first_name} {appointment.doctor?.user?.last_name}
                                <br />
                                <small className="text-muted">{appointment.doctor?.specialization_display}</small>
                              </td>
                              <td>
                                <strong>{new Date(appointment.scheduled_datetime).toLocaleDateString()}</strong>
                                <br />
                                <small className="text-muted">{new Date(appointment.scheduled_datetime).toLocaleTimeString()}</small>
                              </td>
                              <td>
                                <Badge bg="info">{appointment.appointment_type_display}</Badge>
                              </td>
                              <td>
                                <Badge bg={getStatusBadgeVariant(appointment.status)}>
                                  {appointment.status_display}
                                </Badge>
                              </td>
                              <td>
                                <Badge bg={getPriorityBadgeVariant(appointment.priority)}>
                                  {appointment.priority_display}
                                </Badge>
                              </td>
                              <td>
                                <Button size="sm" variant="outline-success" className="me-1">
                                  <i className="ri-eye-line"></i>
                                </Button>
                                <Button size="sm" variant="outline-warning">
                                  <i className="ri-edit-line"></i>
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Tab.Pane>

                  {/* Prescriptions Tab */}
                  <Tab.Pane eventKey="prescriptions">
                    <div className="mb-3 d-flex justify-content-between align-items-center">
                      <div>
                        <h5>Prescription Management</h5>
                        <p className="text-muted">Manage patient medications and prescriptions.</p>
                      </div>
                      <Button variant="primary" onClick={() => handleModalOpen('prescription')}>
                        <i className="ri-add-line me-2"></i>
                        New Prescription
                      </Button>
                    </div>
                    
                    <div className="table-responsive">
                      <Table striped hover>
                        <thead>
                          <tr>
                            <th>Prescription ID</th>
                            <th>Patient</th>
                            <th>Medication</th>
                            <th>Dosage</th>
                            <th>Frequency</th>
                            <th>Duration</th>
                            <th>Dispensed</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(Array.isArray(prescriptions) ? prescriptions : []).map((prescription) => (
                            <tr key={prescription.id}>
                              <td><code>{prescription.prescription_id}</code></td>
                              <td>
                                <strong>{prescription.patient?.user?.first_name} {prescription.patient?.user?.last_name}</strong>
                                <br />
                                <small className="text-muted">{prescription.patient?.patient_id}</small>
                              </td>
                              <td>
                                <strong>{prescription.medication_name}</strong>
                                <br />
                                <small className="text-muted">{prescription.medication_type_display}</small>
                              </td>
                              <td>{prescription.dosage}</td>
                              <td>
                                <Badge bg="primary">{prescription.frequency_display}</Badge>
                              </td>
                              <td>{prescription.duration_days} days</td>
                              <td>
                                <Badge bg={prescription.dispensed ? 'success' : 'warning'}>
                                  {prescription.dispensed ? 'Dispensed' : 'Pending'}
                                </Badge>
                              </td>
                              <td>
                                <Button size="sm" variant="outline-success" className="me-1">
                                  <i className="ri-eye-line"></i>
                                </Button>
                                {!prescription.dispensed && (
                                  <Button size="sm" variant="outline-primary">
                                    <i className="ri-medicine-bottle-line"></i>
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Tab.Pane>

                  {/* Lab Tests Tab */}
                  <Tab.Pane eventKey="lab-tests">
                    <div className="mb-3 d-flex justify-content-between align-items-center">
                      <div>
                        <h5>Laboratory Test Management</h5>
                        <p className="text-muted">Order and track diagnostic tests and results.</p>
                      </div>
                      <Button variant="primary" onClick={() => handleModalOpen('lab-test')}>
                        <i className="ri-add-line me-2"></i>
                        Order Lab Test
                      </Button>
                    </div>
                    
                    <div className="table-responsive">
                      <Table striped hover>
                        <thead>
                          <tr>
                            <th>Test ID</th>
                            <th>Patient</th>
                            <th>Test Name</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Ordered Date</th>
                            <th>Results</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(Array.isArray(labTests) ? labTests : []).map((test) => (
                            <tr key={test.id}>
                              <td><code>{test.test_id}</code></td>
                              <td>
                                <strong>{test.patient?.user?.first_name} {test.patient?.user?.last_name}</strong>
                                <br />
                                <small className="text-muted">{test.patient?.patient_id}</small>
                              </td>
                              <td>{test.test_name}</td>
                              <td>
                                <Badge bg="info">{test.test_category_display}</Badge>
                              </td>
                              <td>
                                <Badge bg={getStatusBadgeVariant(test.status)}>
                                  {test.status_display}
                                </Badge>
                              </td>
                              <td>
                                {new Date(test.ordered_date).toLocaleDateString()}
                              </td>
                              <td>
                                {test.is_abnormal && (
                                  <Badge bg="warning" className="me-1">Abnormal</Badge>
                                )}
                                {test.is_critical && (
                                  <Badge bg="danger">Critical</Badge>
                                )}
                                {!test.is_abnormal && !test.is_critical && test.status === 'completed' && (
                                  <Badge bg="success">Normal</Badge>
                                )}
                              </td>
                              <td>
                                <Button size="sm" variant="outline-success" className="me-1">
                                  <i className="ri-eye-line"></i>
                                </Button>
                                {test.status === 'completed' && (
                                  <Button size="sm" variant="outline-info">
                                    <i className="ri-download-line"></i>
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Tab.Pane>

                  {/* Treatment Plans Tab */}
                  <Tab.Pane eventKey="treatment-plans">
                    <div className="mb-3 d-flex justify-content-between align-items-center">
                      <div>
                        <h5>Treatment Plan Management</h5>
                        <p className="text-muted">Create and monitor comprehensive treatment plans.</p>
                      </div>
                      <Button variant="primary" onClick={() => handleModalOpen('treatment-plan')}>
                        <i className="ri-add-line me-2"></i>
                        New Treatment Plan
                      </Button>
                    </div>
                    
                    <div className="table-responsive">
                      <Table striped hover>
                        <thead>
                          <tr>
                            <th>Plan ID</th>
                            <th>Patient</th>
                            <th>Type</th>
                            <th>Primary Diagnosis</th>
                            <th>Status</th>
                            <th>Start Date</th>
                            <th>Review Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(Array.isArray(treatmentPlans) ? treatmentPlans : []).map((plan) => (
                            <tr key={plan.id}>
                              <td><code>{plan.plan_id}</code></td>
                              <td>
                                <strong>{plan.patient?.user?.first_name} {plan.patient?.user?.last_name}</strong>
                                <br />
                                <small className="text-muted">{plan.patient?.patient_id}</small>
                              </td>
                              <td>
                                <Badge bg="primary">{plan.plan_type_display}</Badge>
                              </td>
                              <td>{plan.primary_diagnosis}</td>
                              <td>
                                <Badge bg={getStatusBadgeVariant(plan.status)}>
                                  {plan.status_display}
                                </Badge>
                              </td>
                              <td>
                                {new Date(plan.start_date).toLocaleDateString()}
                              </td>
                              <td>
                                {plan.review_date ? new Date(plan.review_date).toLocaleDateString() : 'Not set'}
                              </td>
                              <td>
                                <Button size="sm" variant="outline-success" className="me-1">
                                  <i className="ri-eye-line"></i>
                                </Button>
                                <Button size="sm" variant="outline-warning">
                                  <i className="ri-edit-line"></i>
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal for Forms */}
      <Modal show={showModal} onHide={handleModalClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === 'appointment' && <><i className="ri-calendar-check-line me-2"></i>New Appointment</>}
            {modalType === 'prescription' && <><i className="ri-medicine-bottle-line me-2"></i>New Prescription</>}
            {modalType === 'lab-test' && <><i className="ri-test-tube-line me-2"></i>Order Lab Test</>}
            {modalType === 'treatment-plan' && <><i className="ri-file-list-3-line me-2"></i>New Treatment Plan</>}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="info">
            <i className="ri-information-line me-2"></i>
            This is a demo interface. In a real implementation, these forms would be fully functional with validation and API integration.
          </Alert>
          
          <Form onSubmit={handleFormSubmit}>
            {modalType === 'appointment' && (
              <>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Patient</Form.Label>
                      <Form.Select required>
                        <option value="">Select Patient</option>
                        {(Array.isArray(patients) ? patients : []).map(patient => (
                          <option key={patient.id} value={patient.id}>
                            {patient.user?.first_name} {patient.user?.last_name} ({patient.patient_id})
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Appointment Type</Form.Label>
                      <Form.Select required>
                        <option value="">Select Type</option>
                        <option value="consultation">General Consultation</option>
                        <option value="follow_up">Follow-up</option>
                        <option value="routine_checkup">Routine Checkup</option>
                        <option value="preventive_care">Preventive Care</option>
                        <option value="chronic_care">Chronic Care Management</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Date</Form.Label>
                      <Form.Control type="date" required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Time</Form.Label>
                      <Form.Control type="time" required />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Chief Complaint</Form.Label>
                  <Form.Control as="textarea" rows={3} required />
                </Form.Group>
              </>
            )}

            {modalType === 'prescription' && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Patient</Form.Label>
                  <Form.Select required>
                    <option value="">Select Patient</option>
                    {(Array.isArray(patients) ? patients : []).map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.user?.first_name} {patient.user?.last_name} ({patient.patient_id})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Medication Name</Form.Label>
                      <Form.Control type="text" required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Dosage</Form.Label>
                      <Form.Control type="text" required />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Frequency</Form.Label>
                      <Form.Select required>
                        <option value="">Select Frequency</option>
                        <option value="once_daily">Once Daily</option>
                        <option value="twice_daily">Twice Daily</option>
                        <option value="three_times">Three Times Daily</option>
                        <option value="as_needed">As Needed</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Duration (days)</Form.Label>
                      <Form.Control type="number" required />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Instructions</Form.Label>
                  <Form.Control as="textarea" rows={3} required />
                </Form.Group>
              </>
            )}

            {modalType === 'lab-test' && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Patient</Form.Label>
                  <Form.Select required>
                    <option value="">Select Patient</option>
                    {(Array.isArray(patients) ? patients : []).map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.user?.first_name} {patient.user?.last_name} ({patient.patient_id})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Test Name</Form.Label>
                      <Form.Control type="text" required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Select required>
                        <option value="">Select Category</option>
                        <option value="blood">Blood Test</option>
                        <option value="urine">Urine Test</option>
                        <option value="biochemistry">Biochemistry</option>
                        <option value="hematology">Hematology</option>
                        <option value="immunology">Immunology</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Instructions</Form.Label>
                  <Form.Control as="textarea" rows={3} />
                </Form.Group>
              </>
            )}

            {modalType === 'treatment-plan' && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Patient</Form.Label>
                  <Form.Select required>
                    <option value="">Select Patient</option>
                    {(Array.isArray(patients) ? patients : []).map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.user?.first_name} {patient.user?.last_name} ({patient.patient_id})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Plan Type</Form.Label>
                      <Form.Select required>
                        <option value="">Select Type</option>
                        <option value="acute">Acute Care</option>
                        <option value="chronic">Chronic Care Management</option>
                        <option value="preventive">Preventive Care</option>
                        <option value="rehabilitation">Rehabilitation</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Start Date</Form.Label>
                      <Form.Control type="date" required />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Primary Diagnosis</Form.Label>
                  <Form.Control type="text" required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Treatment Goals</Form.Label>
                  <Form.Control as="textarea" rows={3} required />
                </Form.Group>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleFormSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GeneralMedicine;
