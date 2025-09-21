import React, { useState, useEffect } from 'react';
import {
  Card, Table, Button, Modal, Form, Badge, Alert, Row, Col,
  Spinner, ProgressBar, InputGroup
} from 'react-bootstrap';
import {
  FaStethoscope, FaPlus, FaEdit, FaEye, FaCalendarAlt,
  FaClock, FaUserMd, FaHeartbeat, FaThermometerHalf,
  FaLungs, FaTint, FaSearch, FaFilter
} from 'react-icons/fa';

const ConsultationsManager = ({ 
  selectedPatient, 
  consultations, 
  fetchPatientData, 
  showAlert 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  const [consultationForm, setConsultationForm] = useState({
    consultation_type: 'routine',
    consultation_date: new Date().toISOString().slice(0, 16),
    duration_minutes: 30,
    chief_complaint: '',
    history_present_illness: '',
    examination_findings: '',
    assessment: '',
    plan: '',
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    heart_rate: '',
    temperature: '',
    respiratory_rate: '',
    oxygen_saturation: ''
  });

  const API_BASE = '/api/medicine/s3-api';

  const resetForm = () => {
    setConsultationForm({
      consultation_type: 'routine',
      consultation_date: new Date().toISOString().slice(0, 16),
      duration_minutes: 30,
      chief_complaint: '',
      history_present_illness: '',
      examination_findings: '',
      assessment: '',
      plan: '',
      blood_pressure_systolic: '',
      blood_pressure_diastolic: '',
      heart_rate: '',
      temperature: '',
      respiratory_rate: '',
      oxygen_saturation: ''
    });
  };

  const createConsultation = async () => {
    if (!selectedPatient) return;
    
    try {
      setLoading(true);
      const formData = { ...consultationForm, patient_id: selectedPatient.id };
      
      const response = await fetch(`${API_BASE}/create-consultation/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create consultation');
      }
      
      const data = await response.json();
      showAlert('Consultation created successfully with S3 notes!');
      setShowModal(false);
      resetForm();
      fetchPatientData(selectedPatient.id);
    } catch (err) {
      showAlert(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (consultation) => {
    setSelectedConsultation(consultation);
    setConsultationForm({
      consultation_type: consultation.consultation_type,
      consultation_date: consultation.consultation_date,
      duration_minutes: consultation.duration_minutes,
      chief_complaint: consultation.chief_complaint,
      history_present_illness: consultation.history_present_illness,
      examination_findings: consultation.examination_findings,
      assessment: consultation.assessment,
      plan: consultation.plan,
      blood_pressure_systolic: consultation.blood_pressure_systolic || '',
      blood_pressure_diastolic: consultation.blood_pressure_diastolic || '',
      heart_rate: consultation.heart_rate || '',
      temperature: consultation.temperature || '',
      respiratory_rate: consultation.respiratory_rate || '',
      oxygen_saturation: consultation.oxygen_saturation || ''
    });
    setShowModal(true);
  };

  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = consultation.chief_complaint?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.assessment?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || consultation.consultation_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    const variants = {
      'completed': 'success',
      'scheduled': 'primary',
      'in_progress': 'warning',
      'cancelled': 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status.replace('_', ' ')}</Badge>;
  };

  const getVitalSignsColor = (type, value) => {
    // Basic vital signs assessment
    switch (type) {
      case 'blood_pressure':
        const systolic = parseInt(value?.split('/')[0]);
        if (systolic > 140 || systolic < 90) return 'text-danger';
        return 'text-success';
      case 'heart_rate':
        if (value > 100 || value < 60) return 'text-warning';
        return 'text-success';
      case 'temperature':
        if (value > 37.5 || value < 36) return 'text-warning';
        return 'text-success';
      case 'oxygen_saturation':
        if (value < 95) return 'text-danger';
        return 'text-success';
      default:
        return 'text-muted';
    }
  };

  if (!selectedPatient) {
    return (
      <Card>
        <Card.Header>
          <h5><FaStethoscope className="me-2" />Consultations</h5>
        </Card.Header>
        <Card.Body>
          <Alert variant="info">
            Please select a patient first to view and manage consultations.
          </Alert>
        </Card.Body>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5>
            <FaStethoscope className="me-2" />Consultations
            <span className="text-muted ms-2">- {selectedPatient.full_name}</span>
          </h5>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <FaPlus className="me-1" />New Consultation
          </Button>
        </Card.Header>
        <Card.Body>
          {/* Search and Filter */}
          <Row className="mb-3">
            <Col md={8}>
              <InputGroup>
                <InputGroup.Text><FaSearch /></InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search consultations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text><FaFilter /></InputGroup.Text>
                <Form.Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="routine">Routine</option>
                  <option value="follow_up">Follow Up</option>
                  <option value="emergency">Emergency</option>
                  <option value="specialty">Specialty</option>
                </Form.Select>
              </InputGroup>
            </Col>
          </Row>

          {filteredConsultations.length > 0 ? (
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Type</th>
                  <th>Chief Complaint</th>
                  <th>Vital Signs</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>S3 Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredConsultations.map(consultation => (
                  <tr key={consultation.id}>
                    <td>
                      <div>
                        <FaCalendarAlt className="me-1" />
                        {consultation.consultation_date_formatted}
                      </div>
                      <small className="text-muted">
                        <FaClock className="me-1" />
                        Dr. {consultation.doctor?.first_name} {consultation.doctor?.last_name}
                      </small>
                    </td>
                    <td>
                      <Badge bg="info">{consultation.consultation_type.replace('_', ' ')}</Badge>
                    </td>
                    <td>
                      <div>{consultation.chief_complaint}</div>
                      {consultation.assessment && (
                        <small className="text-muted">Assessment: {consultation.assessment.substring(0, 50)}...</small>
                      )}
                    </td>
                    <td>
                      <div className="small">
                        {consultation.vital_signs.blood_pressure && (
                          <div className={getVitalSignsColor('blood_pressure', consultation.vital_signs.blood_pressure)}>
                            <FaHeartbeat className="me-1" />
                            BP: {consultation.vital_signs.blood_pressure}
                          </div>
                        )}
                        {consultation.vital_signs.heart_rate && (
                          <div className={getVitalSignsColor('heart_rate', consultation.vital_signs.heart_rate)}>
                            <FaHeartbeat className="me-1" />
                            HR: {consultation.vital_signs.heart_rate} bpm
                          </div>
                        )}
                        {consultation.vital_signs.temperature && (
                          <div className={getVitalSignsColor('temperature', consultation.vital_signs.temperature)}>
                            <FaThermometerHalf className="me-1" />
                            Temp: {consultation.vital_signs.temperature}°C
                          </div>
                        )}
                        {consultation.vital_signs.oxygen_saturation && (
                          <div className={getVitalSignsColor('oxygen_saturation', consultation.vital_signs.oxygen_saturation)}>
                            <FaLungs className="me-1" />
                            SpO2: {consultation.vital_signs.oxygen_saturation}%
                          </div>
                        )}
                      </div>
                    </td>
                    <td>{consultation.duration_formatted}</td>
                    <td>{getStatusBadge(consultation.status)}</td>
                    <td>
                      {consultation.has_s3_notes ? (
                        <Badge bg="success">Stored</Badge>
                      ) : (
                        <Badge bg="secondary">None</Badge>
                      )}
                    </td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-1"
                        onClick={() => openEditModal(consultation)}
                      >
                        <FaEye />
                      </Button>
                      <Button variant="outline-secondary" size="sm">
                        <FaEdit />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center py-4">
              <FaStethoscope size={48} className="text-muted mb-3" />
              <p>No consultations found for this patient.</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Consultation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaStethoscope className="me-2" />
            {selectedConsultation ? 'View Consultation' : 'New Consultation'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Consultation Type *</Form.Label>
                  <Form.Select
                    value={consultationForm.consultation_type}
                    onChange={(e) => setConsultationForm({...consultationForm, consultation_type: e.target.value})}
                  >
                    <option value="routine">Routine</option>
                    <option value="follow_up">Follow Up</option>
                    <option value="emergency">Emergency</option>
                    <option value="specialty">Specialty</option>
                    <option value="telemedicine">Telemedicine</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Date & Time *</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={consultationForm.consultation_date}
                    onChange={(e) => setConsultationForm({...consultationForm, consultation_date: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration (minutes)</Form.Label>
                  <Form.Control
                    type="number"
                    value={consultationForm.duration_minutes}
                    onChange={(e) => setConsultationForm({...consultationForm, duration_minutes: parseInt(e.target.value)})}
                    min="5"
                    max="300"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Chief Complaint *</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={consultationForm.chief_complaint}
                onChange={(e) => setConsultationForm({...consultationForm, chief_complaint: e.target.value})}
                placeholder="Patient's main complaint or reason for visit"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>History of Present Illness</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={consultationForm.history_present_illness}
                onChange={(e) => setConsultationForm({...consultationForm, history_present_illness: e.target.value})}
                placeholder="Detailed history of the current illness"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Examination Findings</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={consultationForm.examination_findings}
                onChange={(e) => setConsultationForm({...consultationForm, examination_findings: e.target.value})}
                placeholder="Physical examination findings"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Assessment</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={consultationForm.assessment}
                    onChange={(e) => setConsultationForm({...consultationForm, assessment: e.target.value})}
                    placeholder="Clinical assessment and diagnosis"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Treatment Plan</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={consultationForm.plan}
                    onChange={(e) => setConsultationForm({...consultationForm, plan: e.target.value})}
                    placeholder="Treatment plan and recommendations"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Vital Signs Section */}
            <Card className="mb-3">
              <Card.Header>
                <h6><FaHeartbeat className="me-2" />Vital Signs</h6>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Systolic BP</Form.Label>
                      <Form.Control
                        type="number"
                        value={consultationForm.blood_pressure_systolic}
                        onChange={(e) => setConsultationForm({...consultationForm, blood_pressure_systolic: e.target.value})}
                        placeholder="120"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Diastolic BP</Form.Label>
                      <Form.Control
                        type="number"
                        value={consultationForm.blood_pressure_diastolic}
                        onChange={(e) => setConsultationForm({...consultationForm, blood_pressure_diastolic: e.target.value})}
                        placeholder="80"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Heart Rate (bpm)</Form.Label>
                      <Form.Control
                        type="number"
                        value={consultationForm.heart_rate}
                        onChange={(e) => setConsultationForm({...consultationForm, heart_rate: e.target.value})}
                        placeholder="72"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Temperature (°C)</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.1"
                        value={consultationForm.temperature}
                        onChange={(e) => setConsultationForm({...consultationForm, temperature: e.target.value})}
                        placeholder="36.5"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Respiratory Rate</Form.Label>
                      <Form.Control
                        type="number"
                        value={consultationForm.respiratory_rate}
                        onChange={(e) => setConsultationForm({...consultationForm, respiratory_rate: e.target.value})}
                        placeholder="16"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Oxygen Saturation (%)</Form.Label>
                      <Form.Control
                        type="number"
                        value={consultationForm.oxygen_saturation}
                        onChange={(e) => setConsultationForm({...consultationForm, oxygen_saturation: e.target.value})}
                        placeholder="98"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          {!selectedConsultation && (
            <Button variant="primary" onClick={createConsultation} disabled={loading}>
              {loading ? <Spinner size="sm" className="me-2" /> : <FaPlus className="me-2" />}
              Create Consultation
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ConsultationsManager;
