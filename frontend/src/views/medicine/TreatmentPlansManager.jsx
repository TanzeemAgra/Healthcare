import React, { useState, useEffect } from 'react';
import {
  Card, Table, Button, Modal, Form, Badge, Alert, Row, Col,
  Spinner, ProgressBar, InputGroup, Tabs, Tab
} from 'react-bootstrap';
import {
  FaClipboardList, FaPlus, FaEdit, FaEye, FaCalendarAlt,
  FaCheckCircle, FaClock, FaExclamationTriangle, FaFlag,
  FaSearch, FaFilter, FaTasks, FaPills, FaStethoscope
} from 'react-icons/fa';

const TreatmentPlansManager = ({ 
  selectedPatient, 
  treatmentPlans, 
  consultations,
  fetchPatientData, 
  showAlert 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  
  const [treatmentForm, setTreatmentForm] = useState({
    consultation_id: '',
    title: '',
    diagnosis: '',
    treatment_goals: '',
    start_date: new Date().toISOString().slice(0, 10),
    expected_end_date: '',
    priority: 'medium',
    medications: [],
    procedures: [],
    follow_up_schedule: [],
    dietary_recommendations: '',
    lifestyle_modifications: '',
    expected_duration: '',
    progress_indicators: [],
    emergency_protocols: ''
  });

  const API_BASE = '/api/medicine/s3-api';

  const resetForm = () => {
    setTreatmentForm({
      consultation_id: '',
      title: '',
      diagnosis: '',
      treatment_goals: '',
      start_date: new Date().toISOString().slice(0, 10),
      expected_end_date: '',
      priority: 'medium',
      medications: [],
      procedures: [],
      follow_up_schedule: [],
      dietary_recommendations: '',
      lifestyle_modifications: '',
      expected_duration: '',
      progress_indicators: [],
      emergency_protocols: ''
    });
  };

  const createTreatmentPlan = async () => {
    if (!selectedPatient) return;
    
    try {
      setLoading(true);
      const formData = { 
        ...treatmentForm, 
        patient_id: selectedPatient.id,
        medications: treatmentForm.medications.filter(med => med.trim()),
        procedures: treatmentForm.procedures.filter(proc => proc.trim()),
        follow_up_schedule: treatmentForm.follow_up_schedule.filter(sched => sched.trim()),
        progress_indicators: treatmentForm.progress_indicators.filter(ind => ind.trim())
      };
      
      const response = await fetch(`${API_BASE}/create-treatment-plan/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create treatment plan');
      }
      
      const data = await response.json();
      showAlert('Treatment plan created successfully with S3 storage!');
      setShowModal(false);
      resetForm();
      fetchPatientData(selectedPatient.id);
    } catch (err) {
      showAlert(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const openViewModal = (plan) => {
    setSelectedPlan(plan);
    setTreatmentForm({
      consultation_id: plan.consultation?.id || '',
      title: plan.title,
      diagnosis: plan.diagnosis,
      treatment_goals: plan.treatment_goals,
      start_date: plan.start_date,
      expected_end_date: plan.expected_end_date || '',
      priority: plan.priority,
      medications: [],
      procedures: [],
      follow_up_schedule: [],
      dietary_recommendations: '',
      lifestyle_modifications: '',
      expected_duration: '',
      progress_indicators: [],
      emergency_protocols: ''
    });
    setShowModal(true);
  };

  const addArrayItem = (arrayName, item) => {
    if (item.trim()) {
      setTreatmentForm(prev => ({
        ...prev,
        [arrayName]: [...prev[arrayName], item]
      }));
    }
  };

  const removeArrayItem = (arrayName, index) => {
    setTreatmentForm(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }));
  };

  const filteredPlans = treatmentPlans.filter(plan => {
    const matchesSearch = plan.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || plan.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    const variants = {
      'active': 'success',
      'completed': 'primary',
      'paused': 'warning',
      'cancelled': 'danger',
      'draft': 'secondary'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      'high': 'danger',
      'medium': 'warning',
      'low': 'info'
    };
    return <Badge bg={variants[priority] || 'secondary'}>{priority}</Badge>;
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 50) return 'info';
    if (percentage >= 25) return 'warning';
    return 'danger';
  };

  if (!selectedPatient) {
    return (
      <Card>
        <Card.Header>
          <h5><FaClipboardList className="me-2" />Treatment Plans</h5>
        </Card.Header>
        <Card.Body>
          <Alert variant="info">
            Please select a patient first to view and manage treatment plans.
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
            <FaClipboardList className="me-2" />Treatment Plans
            <span className="text-muted ms-2">- {selectedPatient.full_name}</span>
          </h5>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <FaPlus className="me-1" />New Treatment Plan
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
                  placeholder="Search treatment plans..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text><FaFilter /></InputGroup.Text>
                <Form.Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="paused">Paused</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="draft">Draft</option>
                </Form.Select>
              </InputGroup>
            </Col>
          </Row>

          {filteredPlans.length > 0 ? (
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Diagnosis</th>
                  <th>Priority</th>
                  <th>Duration</th>
                  <th>Progress</th>
                  <th>Status</th>
                  <th>S3 Plan</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlans.map(plan => (
                  <tr key={plan.id}>
                    <td>
                      <div>
                        <strong>{plan.title}</strong>
                        {plan.consultation && (
                          <div>
                            <small className="text-muted">
                              <FaStethoscope className="me-1" />
                              Consultation: {plan.consultation.consultation_date}
                            </small>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div>{plan.diagnosis}</div>
                      {plan.treatment_goals && (
                        <small className="text-muted">Goals: {plan.treatment_goals.substring(0, 50)}...</small>
                      )}
                    </td>
                    <td>{getPriorityBadge(plan.priority)}</td>
                    <td>
                      <div>
                        <FaCalendarAlt className="me-1" />
                        {plan.start_date}
                      </div>
                      {plan.expected_end_date && (
                        <small className="text-muted">
                          To: {plan.expected_end_date}
                        </small>
                      )}
                      {plan.duration_days && (
                        <div>
                          <small className="text-muted">
                            {plan.duration_days} days
                          </small>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <ProgressBar 
                          now={plan.progress_percentage || 0} 
                          variant={getProgressColor(plan.progress_percentage || 0)}
                          style={{ width: '60px', height: '8px' }}
                          className="me-2"
                        />
                        <small>{plan.progress_percentage || 0}%</small>
                      </div>
                      {plan.days_remaining !== null && (
                        <small className="text-muted">
                          {plan.days_remaining > 0 ? 
                            `${plan.days_remaining} days left` : 
                            plan.is_overdue ? 'Overdue' : 'Completed'
                          }
                        </small>
                      )}
                    </td>
                    <td>{getStatusBadge(plan.status)}</td>
                    <td>
                      {plan.has_s3_plan ? (
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
                        onClick={() => openViewModal(plan)}
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
              <FaClipboardList size={48} className="text-muted mb-3" />
              <p>No treatment plans found for this patient.</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Treatment Plan Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaClipboardList className="me-2" />
            {selectedPlan ? 'View Treatment Plan' : 'New Treatment Plan'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-3">
            <Tab eventKey="overview" title="Overview">
              <Form>
                <Row>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>Treatment Plan Title *</Form.Label>
                      <Form.Control
                        type="text"
                        value={treatmentForm.title}
                        onChange={(e) => setTreatmentForm({...treatmentForm, title: e.target.value})}
                        placeholder="Enter treatment plan title"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Priority</Form.Label>
                      <Form.Select
                        value={treatmentForm.priority}
                        onChange={(e) => setTreatmentForm({...treatmentForm, priority: e.target.value})}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Related Consultation</Form.Label>
                  <Form.Select
                    value={treatmentForm.consultation_id}
                    onChange={(e) => setTreatmentForm({...treatmentForm, consultation_id: e.target.value})}
                  >
                    <option value="">Select consultation (optional)</option>
                    {consultations.map(consultation => (
                      <option key={consultation.id} value={consultation.id}>
                        {consultation.consultation_date_formatted} - {consultation.chief_complaint}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Primary Diagnosis *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={treatmentForm.diagnosis}
                    onChange={(e) => setTreatmentForm({...treatmentForm, diagnosis: e.target.value})}
                    placeholder="Enter primary diagnosis"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Treatment Goals</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={treatmentForm.treatment_goals}
                    onChange={(e) => setTreatmentForm({...treatmentForm, treatment_goals: e.target.value})}
                    placeholder="Describe treatment objectives and goals"
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Start Date *</Form.Label>
                      <Form.Control
                        type="date"
                        value={treatmentForm.start_date}
                        onChange={(e) => setTreatmentForm({...treatmentForm, start_date: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Expected End Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={treatmentForm.expected_end_date}
                        onChange={(e) => setTreatmentForm({...treatmentForm, expected_end_date: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Expected Duration</Form.Label>
                  <Form.Control
                    type="text"
                    value={treatmentForm.expected_duration}
                    onChange={(e) => setTreatmentForm({...treatmentForm, expected_duration: e.target.value})}
                    placeholder="e.g., 3 weeks, 6 months"
                  />
                </Form.Group>
              </Form>
            </Tab>

            <Tab eventKey="details" title="Treatment Details">
              <Form>
                {/* Medications */}
                <Card className="mb-3">
                  <Card.Header>
                    <h6><FaPills className="me-2" />Medications</h6>
                  </Card.Header>
                  <Card.Body>
                    <InputGroup className="mb-2">
                      <Form.Control
                        type="text"
                        placeholder="Add medication..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addArrayItem('medications', e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                      <Button 
                        variant="outline-primary"
                        onClick={(e) => {
                          const input = e.target.parentElement.querySelector('input');
                          addArrayItem('medications', input.value);
                          input.value = '';
                        }}
                      >
                        <FaPlus />
                      </Button>
                    </InputGroup>
                    {treatmentForm.medications.map((med, index) => (
                      <Badge key={index} bg="info" className="me-2 mb-2">
                        {med}
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="text-white ms-1 p-0"
                          onClick={() => removeArrayItem('medications', index)}
                        >
                          ×
                        </Button>
                      </Badge>
                    ))}
                  </Card.Body>
                </Card>

                {/* Procedures */}
                <Card className="mb-3">
                  <Card.Header>
                    <h6><FaTasks className="me-2" />Procedures</h6>
                  </Card.Header>
                  <Card.Body>
                    <InputGroup className="mb-2">
                      <Form.Control
                        type="text"
                        placeholder="Add procedure..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addArrayItem('procedures', e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                      <Button 
                        variant="outline-primary"
                        onClick={(e) => {
                          const input = e.target.parentElement.querySelector('input');
                          addArrayItem('procedures', input.value);
                          input.value = '';
                        }}
                      >
                        <FaPlus />
                      </Button>
                    </InputGroup>
                    {treatmentForm.procedures.map((proc, index) => (
                      <Badge key={index} bg="success" className="me-2 mb-2">
                        {proc}
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="text-white ms-1 p-0"
                          onClick={() => removeArrayItem('procedures', index)}
                        >
                          ×
                        </Button>
                      </Badge>
                    ))}
                  </Card.Body>
                </Card>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Dietary Recommendations</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={treatmentForm.dietary_recommendations}
                        onChange={(e) => setTreatmentForm({...treatmentForm, dietary_recommendations: e.target.value})}
                        placeholder="Dietary guidelines and recommendations"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Lifestyle Modifications</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={treatmentForm.lifestyle_modifications}
                        onChange={(e) => setTreatmentForm({...treatmentForm, lifestyle_modifications: e.target.value})}
                        placeholder="Lifestyle changes and recommendations"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Emergency Protocols</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={treatmentForm.emergency_protocols}
                    onChange={(e) => setTreatmentForm({...treatmentForm, emergency_protocols: e.target.value})}
                    placeholder="Emergency procedures and contact information"
                  />
                </Form.Group>
              </Form>
            </Tab>

            <Tab eventKey="followup" title="Follow-up & Monitoring">
              <Form>
                {/* Follow-up Schedule */}
                <Card className="mb-3">
                  <Card.Header>
                    <h6><FaCalendarAlt className="me-2" />Follow-up Schedule</h6>
                  </Card.Header>
                  <Card.Body>
                    <InputGroup className="mb-2">
                      <Form.Control
                        type="text"
                        placeholder="Add follow-up item..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addArrayItem('follow_up_schedule', e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                      <Button 
                        variant="outline-primary"
                        onClick={(e) => {
                          const input = e.target.parentElement.querySelector('input');
                          addArrayItem('follow_up_schedule', input.value);
                          input.value = '';
                        }}
                      >
                        <FaPlus />
                      </Button>
                    </InputGroup>
                    {treatmentForm.follow_up_schedule.map((item, index) => (
                      <Badge key={index} bg="warning" className="me-2 mb-2">
                        {item}
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="text-dark ms-1 p-0"
                          onClick={() => removeArrayItem('follow_up_schedule', index)}
                        >
                          ×
                        </Button>
                      </Badge>
                    ))}
                  </Card.Body>
                </Card>

                {/* Progress Indicators */}
                <Card className="mb-3">
                  <Card.Header>
                    <h6><FaCheckCircle className="me-2" />Progress Indicators</h6>
                  </Card.Header>
                  <Card.Body>
                    <InputGroup className="mb-2">
                      <Form.Control
                        type="text"
                        placeholder="Add progress indicator..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addArrayItem('progress_indicators', e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                      <Button 
                        variant="outline-primary"
                        onClick={(e) => {
                          const input = e.target.parentElement.querySelector('input');
                          addArrayItem('progress_indicators', input.value);
                          input.value = '';
                        }}
                      >
                        <FaPlus />
                      </Button>
                    </InputGroup>
                    {treatmentForm.progress_indicators.map((indicator, index) => (
                      <Badge key={index} bg="primary" className="me-2 mb-2">
                        {indicator}
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="text-white ms-1 p-0"
                          onClick={() => removeArrayItem('progress_indicators', index)}
                        >
                          ×
                        </Button>
                      </Badge>
                    ))}
                  </Card.Body>
                </Card>
              </Form>
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          {!selectedPlan && (
            <Button variant="primary" onClick={createTreatmentPlan} disabled={loading}>
              {loading ? <Spinner size="sm" className="me-2" /> : <FaPlus className="me-2" />}
              Create Treatment Plan
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TreatmentPlansManager;
