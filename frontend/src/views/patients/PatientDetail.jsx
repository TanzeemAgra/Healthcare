import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Row, 
  Col, 
  Card, 
  Badge, 
  Button, 
  Tab, 
  Tabs, 
  Table,
  Alert,
  Spinner
} from 'react-bootstrap';
import { 
  FaUser, 
  FaHeartbeat, 
  FaFileAlt, 
  FaCalendarAlt, 
  FaEdit,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUserFriends,
  FaShieldAlt
} from 'react-icons/fa';
import patientService from '../../services/patientService';

const PatientDetail = ({ show, onHide, patient }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [vitalSigns, setVitalSigns] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [labResults, setLabResults] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (patient && show) {
      fetchPatientData();
    }
  }, [patient, show]);

  const fetchPatientData = async () => {
    if (!patient?.id) return;
    
    setLoading(true);
    try {
      const [vitalSignsData, appointmentsData, labResultsData, medicalHistoryData] = await Promise.all([
        patientService.getVitalSigns(patient.id),
        patientService.getAppointments({ patient: patient.id }),
        patientService.getLabResults(patient.id),
        patientService.getMedicalHistory(patient.id)
      ]);
      
      setVitalSigns(vitalSignsData.results || vitalSignsData);
      setAppointments(appointmentsData.results || appointmentsData);
      setLabResults(labResultsData.results || labResultsData);
      setMedicalHistory(medicalHistoryData.results || medicalHistoryData);
      setError(null);
    } catch (err) {
      setError('Failed to load patient data');
      console.error('Error fetching patient data:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.year - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString();
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'scheduled': 'primary',
      'confirmed': 'info',
      'in_progress': 'warning',
      'completed': 'success',
      'cancelled': 'danger',
      'no_show': 'secondary'
    };
    return <Badge bg={statusColors[status] || 'secondary'}>{status.replace('_', ' ')}</Badge>;
  };

  if (!patient) return null;

  return (
    <Modal show={show} onHide={onHide} size="xl" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          <FaUser className="me-2" />
          {patient.first_name} {patient.last_name}
          <Badge bg={patient.is_active ? 'success' : 'secondary'} className="ms-2">
            {patient.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-3">
          <Tab eventKey="overview" title="Overview">
            <Row>
              {/* Basic Information */}
              <Col md={6}>
                <Card className="mb-3">
                  <Card.Header>
                    <h6 className="mb-0">
                      <FaUser className="me-2" />
                      Personal Information
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <Row className="mb-2">
                      <Col sm={4}><strong>Patient ID:</strong></Col>
                      <Col sm={8}>{patient.patient_id}</Col>
                    </Row>
                    <Row className="mb-2">
                      <Col sm={4}><strong>Full Name:</strong></Col>
                      <Col sm={8}>
                        {patient.first_name} {patient.middle_name} {patient.last_name}
                      </Col>
                    </Row>
                    <Row className="mb-2">
                      <Col sm={4}><strong>Date of Birth:</strong></Col>
                      <Col sm={8}>{formatDate(patient.date_of_birth)}</Col>
                    </Row>
                    <Row className="mb-2">
                      <Col sm={4}><strong>Age:</strong></Col>
                      <Col sm={8}>{calculateAge(patient.date_of_birth)} years</Col>
                    </Row>
                    <Row className="mb-2">
                      <Col sm={4}><strong>Gender:</strong></Col>
                      <Col sm={8} className="text-capitalize">{patient.gender}</Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>

              {/* Contact Information */}
              <Col md={6}>
                <Card className="mb-3">
                  <Card.Header>
                    <h6 className="mb-0">
                      <FaPhone className="me-2" />
                      Contact Information
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <Row className="mb-2">
                      <Col sm={4}><strong>Phone:</strong></Col>
                      <Col sm={8}>
                        <FaPhone className="me-1" />
                        {patient.phone}
                      </Col>
                    </Row>
                    <Row className="mb-2">
                      <Col sm={4}><strong>Email:</strong></Col>
                      <Col sm={8}>
                        <FaEnvelope className="me-1" />
                        {patient.email}
                      </Col>
                    </Row>
                    <Row className="mb-2">
                      <Col sm={4}><strong>Address:</strong></Col>
                      <Col sm={8}>
                        <FaMapMarkerAlt className="me-1" />
                        {patient.address && (
                          <div>
                            {patient.address}<br />
                            {patient.city}, {patient.state} {patient.zip_code}<br />
                            {patient.country}
                          </div>
                        )}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row>
              {/* Emergency Contact */}
              <Col md={6}>
                <Card className="mb-3">
                  <Card.Header>
                    <h6 className="mb-0">
                      <FaUserFriends className="me-2" />
                      Emergency Contact
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    {patient.emergency_contact_name ? (
                      <>
                        <Row className="mb-2">
                          <Col sm={4}><strong>Name:</strong></Col>
                          <Col sm={8}>{patient.emergency_contact_name}</Col>
                        </Row>
                        <Row className="mb-2">
                          <Col sm={4}><strong>Relationship:</strong></Col>
                          <Col sm={8}>{patient.emergency_contact_relationship}</Col>
                        </Row>
                        <Row className="mb-2">
                          <Col sm={4}><strong>Phone:</strong></Col>
                          <Col sm={8}>{patient.emergency_contact_phone}</Col>
                        </Row>
                      </>
                    ) : (
                      <p className="text-muted">No emergency contact information available</p>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              {/* Insurance Information */}
              <Col md={6}>
                <Card className="mb-3">
                  <Card.Header>
                    <h6 className="mb-0">
                      <FaShieldAlt className="me-2" />
                      Insurance Information
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    {patient.insurance_provider ? (
                      <>
                        <Row className="mb-2">
                          <Col sm={4}><strong>Provider:</strong></Col>
                          <Col sm={8}>{patient.insurance_provider}</Col>
                        </Row>
                        <Row className="mb-2">
                          <Col sm={4}><strong>Policy Number:</strong></Col>
                          <Col sm={8}>{patient.insurance_policy_number}</Col>
                        </Row>
                      </>
                    ) : (
                      <p className="text-muted">No insurance information available</p>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Medical Information */}
            <Row>
              <Col md={12}>
                <Card>
                  <Card.Header>
                    <h6 className="mb-0">
                      <FaFileAlt className="me-2" />
                      Medical Information
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={4}>
                        <h6>Allergies</h6>
                        <p className="text-muted">
                          {patient.allergies || 'No known allergies'}
                        </p>
                      </Col>
                      <Col md={4}>
                        <h6>Current Medications</h6>
                        <p className="text-muted">
                          {patient.current_medications || 'No current medications'}
                        </p>
                      </Col>
                      <Col md={4}>
                        <h6>Medical Conditions</h6>
                        <p className="text-muted">
                          {patient.medical_conditions || 'No known conditions'}
                        </p>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="appointments" title="Appointments">
            <Card>
              <Card.Header>
                <h6 className="mb-0">
                  <FaCalendarAlt className="me-2" />
                  Appointment History
                </h6>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <div className="text-center py-3">
                    <Spinner animation="border" size="sm" />
                    <span className="ms-2">Loading appointments...</span>
                  </div>
                ) : appointments.length > 0 ? (
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Doctor</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appointment) => (
                        <tr key={appointment.id}>
                          <td>{formatDate(appointment.appointment_date)}</td>
                          <td>{appointment.appointment_time}</td>
                          <td>{appointment.doctor_name || 'Not assigned'}</td>
                          <td className="text-capitalize">{appointment.appointment_type}</td>
                          <td>{getStatusBadge(appointment.status)}</td>
                          <td>{appointment.notes || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p className="text-muted">No appointments found</p>
                )}
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="vitals" title="Vital Signs">
            <Card>
              <Card.Header>
                <h6 className="mb-0">
                  <FaHeartbeat className="me-2" />
                  Vital Signs History
                </h6>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <div className="text-center py-3">
                    <Spinner animation="border" size="sm" />
                    <span className="ms-2">Loading vital signs...</span>
                  </div>
                ) : vitalSigns.length > 0 ? (
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Temperature</th>
                        <th>Blood Pressure</th>
                        <th>Heart Rate</th>
                        <th>Weight</th>
                        <th>Height</th>
                        <th>BMI</th>
                        <th>Measured By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vitalSigns.map((vital) => (
                        <tr key={vital.id}>
                          <td>{formatDateTime(vital.measured_at)}</td>
                          <td>{vital.temperature ? `${vital.temperature}°C` : '-'}</td>
                          <td>
                            {vital.blood_pressure_systolic && vital.blood_pressure_diastolic
                              ? `${vital.blood_pressure_systolic}/${vital.blood_pressure_diastolic}`
                              : '-'
                            }
                          </td>
                          <td>{vital.heart_rate ? `${vital.heart_rate} bpm` : '-'}</td>
                          <td>{vital.weight ? `${vital.weight} kg` : '-'}</td>
                          <td>{vital.height ? `${vital.height} cm` : '-'}</td>
                          <td>{vital.bmi ? vital.bmi.toFixed(1) : '-'}</td>
                          <td>{vital.measured_by_name || 'Unknown'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p className="text-muted">No vital signs recorded</p>
                )}
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="lab-results" title="Lab Results">
            <Card>
              <Card.Header>
                <h6 className="mb-0">
                  <FaFileAlt className="me-2" />
                  Laboratory Results
                </h6>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <div className="text-center py-3">
                    <Spinner animation="border" size="sm" />
                    <span className="ms-2">Loading lab results...</span>
                  </div>
                ) : labResults.length > 0 ? (
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Date Ordered</th>
                        <th>Test Name</th>
                        <th>Result</th>
                        <th>Reference Range</th>
                        <th>Unit</th>
                        <th>Status</th>
                        <th>Ordered By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {labResults.map((result) => (
                        <tr key={result.id}>
                          <td>{formatDate(result.date_ordered)}</td>
                          <td>{result.test_name}</td>
                          <td>{result.result_value}</td>
                          <td>{result.reference_range || '-'}</td>
                          <td>{result.unit || '-'}</td>
                          <td>
                            <Badge bg={
                              result.status === 'normal' ? 'success' :
                              result.status === 'abnormal' ? 'warning' :
                              result.status === 'critical' ? 'danger' : 'secondary'
                            }>
                              {result.status}
                            </Badge>
                          </td>
                          <td>{result.ordered_by_name || 'Unknown'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p className="text-muted">No lab results available</p>
                )}
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="medical-history" title="Medical History">
            <Card>
              <Card.Header>
                <h6 className="mb-0">
                  <FaFileAlt className="me-2" />
                  Medical History
                </h6>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <div className="text-center py-3">
                    <Spinner animation="border" size="sm" />
                    <span className="ms-2">Loading medical history...</span>
                  </div>
                ) : medicalHistory.length > 0 ? (
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Condition</th>
                        <th>Diagnosis</th>
                        <th>Severity</th>
                        <th>Status</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {medicalHistory.map((history) => (
                        <tr key={history.id}>
                          <td>{formatDate(history.diagnosis_date)}</td>
                          <td>{history.condition_name}</td>
                          <td>{history.diagnosis}</td>
                          <td>
                            <Badge bg={
                              history.severity === 'mild' ? 'info' :
                              history.severity === 'moderate' ? 'warning' :
                              history.severity === 'severe' ? 'danger' : 'secondary'
                            }>
                              {history.severity}
                            </Badge>
                          </td>
                          <td className="text-capitalize">{history.status}</td>
                          <td>{history.notes || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p className="text-muted">No medical history available</p>
                )}
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PatientDetail;
