import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Spinner,
  Badge,
  Table,
  Modal,
  Accordion,
  ProgressBar,
  ListGroup
} from 'react-bootstrap';
import apiClient from '../../services/api';
import { isDemoMode, resetAuthenticationState } from '../../utils/authReset';

const DentistryTreatments = () => {
  const navigate = useNavigate();
  const [treatments, setTreatments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [dentists, setDentists] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [addingTreatment, setAddingTreatment] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState(null);

  // Form state for new treatment
  const [treatmentForm, setTreatmentForm] = useState({
    patient_id: '',
    dentist_id: '',
    appointment_id: '',
    treatment_name: '',
    treatment_code: '',
    tooth_number: '',
    surface: '',
    diagnosis: '',
    treatment_plan: '',
    start_date: '',
    cost: '',
    insurance_coverage: '',
    patient_payment: '',
    post_treatment_instructions: '',
    follow_up_required: false
  });

  // AI recommendation form
  const [aiForm, setAiForm] = useState({
    patient_id: '',
    symptoms: '',
    diagnosis: '',
    medical_history: ''
  });

  const [formErrors, setFormErrors] = useState({});

  // Treatment status colors
  const statusColors = {
    'planned': 'primary',
    'in_progress': 'warning',
    'completed': 'success',
    'cancelled': 'danger',
    'on_hold': 'secondary'
  };

  useEffect(() => {
    // Check if we're in demo mode and need to reset authentication
    if (isDemoMode()) {
      console.log('🔍 Demo mode detected in DentistryTreatments - resetting auth');
      setError('Authentication expired. Please log in again.');
      setTimeout(() => {
        resetAuthenticationState();
      }, 2000);
      return;
    }
    
    fetchTreatments();
    fetchPatients();
    fetchDentists();
    fetchAppointments();
  }, []);

  const fetchTreatments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/dentistry/treatments/');
      setTreatments(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching treatments:', error);
      if (error.response?.status === 401) {
        if (isDemoMode()) {
          setError('Demo authentication detected. Redirecting to proper login...');
          setTimeout(() => resetAuthenticationState(), 1500);
        } else {
          setError('Authentication failed. Please log in again.');
        }
      } else if (error.response?.status === 403) {
        setError('Access denied. You do not have permission to view treatments.');
      } else {
        setError('Failed to fetch treatments. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await apiClient.get('/dentistry/patients/');
      setPatients(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
      if (error.response?.status === 401 && isDemoMode()) {
        setError('Demo authentication detected. Redirecting to proper login...');
        setTimeout(() => resetAuthenticationState(), 1500);
      }
    }
  };

  const fetchDentists = async () => {
    try {
      const response = await apiClient.get('/dentistry/dentists/');
      setDentists(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching dentists:', error);
      if (error.response?.status === 401 && isDemoMode()) {
        setError('Demo authentication detected. Redirecting to proper login...');
        setTimeout(() => resetAuthenticationState(), 1500);
      }
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await apiClient.get('/dentistry/appointments/');
      setAppointments(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      if (error.response?.status === 401 && isDemoMode()) {
        setError('Demo authentication detected. Redirecting to proper login...');
        setTimeout(() => resetAuthenticationState(), 1500);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTreatmentForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAIInputChange = (e) => {
    const { name, value } = e.target;
    setAiForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    // Required fields validation
    if (!treatmentForm.patient_id) errors.patient_id = 'Patient is required';
    if (!treatmentForm.dentist_id) errors.dentist_id = 'Dentist is required';
    if (!treatmentForm.treatment_name.trim()) errors.treatment_name = 'Treatment name is required';
    if (!treatmentForm.diagnosis.trim()) errors.diagnosis = 'Diagnosis is required';
    if (!treatmentForm.treatment_plan.trim()) errors.treatment_plan = 'Treatment plan is required';
    if (!treatmentForm.start_date) errors.start_date = 'Start date is required';
    if (!treatmentForm.cost) errors.cost = 'Cost is required';
    
    // Numeric validations
    if (treatmentForm.cost && (isNaN(treatmentForm.cost) || treatmentForm.cost <= 0)) {
      errors.cost = 'Cost must be a valid positive number';
    }
    
    if (treatmentForm.insurance_coverage && (isNaN(treatmentForm.insurance_coverage) || treatmentForm.insurance_coverage < 0)) {
      errors.insurance_coverage = 'Insurance coverage must be a valid positive number';
    }
    
    if (treatmentForm.patient_payment && (isNaN(treatmentForm.patient_payment) || treatmentForm.patient_payment < 0)) {
      errors.patient_payment = 'Patient payment must be a valid positive number';
    }

    // Date validation
    const startDate = new Date(treatmentForm.start_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (startDate < today) {
      errors.start_date = 'Start date cannot be in the past';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generateAIRecommendations = async () => {
    if (!aiForm.patient_id || !aiForm.symptoms || !aiForm.diagnosis) {
      setError('Please fill in patient, symptoms, and diagnosis for AI recommendations');
      return;
    }

    setGeneratingAI(true);
    setError(null);

    try {
      const response = await apiClient.post('/dentistry/treatments/ai_recommendation/', aiForm);
      setAiRecommendations(response.data);
      setSuccess('AI recommendations generated successfully!');
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
      setError('Failed to generate AI recommendations. Please try again.');
    } finally {
      setGeneratingAI(false);
    }
  };

  const applyAIRecommendation = (recommendation) => {
    setTreatmentForm(prev => ({
      ...prev,
      patient_id: aiForm.patient_id,
      treatment_name: recommendation.treatment_name,
      treatment_code: recommendation.treatment_code,
      diagnosis: aiForm.diagnosis,
      treatment_plan: recommendation.description,
      cost: recommendation.estimated_cost.toString()
    }));
    setShowAIModal(false);
    setShowAddModal(true);
  };

  const handleAddTreatment = async (e) => {
    e.preventDefault();
    
    // Validate form first
    if (!validateForm()) {
      setError('Please correct the errors in the form');
      return;
    }
    
    setAddingTreatment(true);
    setError(null);
    
    try {
      const treatmentData = {
        ...treatmentForm,
        patient_id: parseInt(treatmentForm.patient_id),
        dentist_id: parseInt(treatmentForm.dentist_id),
        appointment_id: treatmentForm.appointment_id ? parseInt(treatmentForm.appointment_id) : null,
        cost: parseFloat(treatmentForm.cost),
        insurance_coverage: treatmentForm.insurance_coverage ? parseFloat(treatmentForm.insurance_coverage) : 0,
        patient_payment: treatmentForm.patient_payment ? parseFloat(treatmentForm.patient_payment) : 0
      };

      await apiClient.post('/dentistry/treatments/', treatmentData);
      
      setSuccess('Treatment plan created successfully!');
      setShowAddModal(false);
      resetForm();
      fetchTreatments(); // Refresh the treatments list
    } catch (error) {
      console.error('Error adding treatment:', error);
      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else {
        setError('Failed to create treatment plan. Please try again.');
      }
    } finally {
      setAddingTreatment(false);
    }
  };

  const resetForm = () => {
    setTreatmentForm({
      patient_id: '',
      dentist_id: '',
      appointment_id: '',
      treatment_name: '',
      treatment_code: '',
      tooth_number: '',
      surface: '',
      diagnosis: '',
      treatment_plan: '',
      start_date: '',
      cost: '',
      insurance_coverage: '',
      patient_payment: '',
      post_treatment_instructions: '',
      follow_up_required: false
    });
    setFormErrors({});
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    return <Badge bg={statusColors[status] || 'secondary'}>{status.replace('_', ' ').toUpperCase()}</Badge>;
  };

  return (
    <Container fluid className="mt-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>
                <i className="ri-medicine-bottle-line me-2 text-primary"></i>
                Dental Treatments
              </h2>
              <p className="text-muted">Manage dental treatment plans and procedures with AI assistance</p>
            </div>
            <div>
              <Button 
                variant="info" 
                className="me-2"
                onClick={() => setShowAIModal(true)}
              >
                <i className="ri-brain-line me-2"></i>
                AI Recommendations
              </Button>
              <Button 
                variant="primary"
                onClick={() => setShowAddModal(true)}
              >
                <i className="ri-add-line me-2"></i>
                New Treatment
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              <Alert.Heading>Error</Alert.Heading>
              <p>{error}</p>
              {error.includes('log in') && (
                <Button variant="primary" onClick={() => navigate('/auth/sign-in')}>
                  Go to Login
                </Button>
              )}
            </Alert>
          </Col>
        </Row>
      )}

      {success && (
        <Row className="mb-3">
          <Col>
            <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
              <Alert.Heading>Success</Alert.Heading>
              <p>{success}</p>
            </Alert>
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Treatment Plans</h5>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Loading treatments...</p>
                </div>
              ) : treatments.length > 0 ? (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Treatment ID</th>
                      <th>Patient</th>
                      <th>Treatment</th>
                      <th>Diagnosis</th>
                      <th>Dentist</th>
                      <th>Start Date</th>
                      <th>Status</th>
                      <th>Cost</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {treatments.map((treatment) => (
                      <tr key={treatment.id}>
                        <td>
                          <Badge bg="primary">{treatment.treatment_id?.slice(0, 8)}</Badge>
                        </td>
                        <td>
                          {treatment.patient?.user?.first_name} {treatment.patient?.user?.last_name}
                          <br />
                          <small className="text-muted">{treatment.patient?.patient_id}</small>
                        </td>
                        <td>
                          <strong>{treatment.treatment_name}</strong>
                          {treatment.treatment_code && (
                            <>
                              <br />
                              <small className="text-muted">Code: {treatment.treatment_code}</small>
                            </>
                          )}
                        </td>
                        <td>{treatment.diagnosis}</td>
                        <td>
                          Dr. {treatment.dentist?.user?.first_name} {treatment.dentist?.user?.last_name}
                        </td>
                        <td>{new Date(treatment.start_date).toLocaleDateString()}</td>
                        <td>{getStatusBadge(treatment.status)}</td>
                        <td>{formatCurrency(treatment.cost)}</td>
                        <td>
                          <Button 
                            size="sm" 
                            variant="outline-primary" 
                            className="me-2"
                            onClick={() => navigate(`/dentistry/treatments/${treatment.id}`)}
                          >
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline-secondary"
                            onClick={() => navigate(`/dentistry/treatments/${treatment.id}/edit`)}
                          >
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4">
                  <i className="ri-medicine-bottle-line text-muted" style={{ fontSize: '3rem' }}></i>
                  <h5 className="text-muted mt-3">No Treatment Plans Found</h5>
                  <p className="text-muted">
                    Click "AI Recommendations" to get AI-powered treatment suggestions or "New Treatment" to create a treatment plan manually.
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* AI Recommendations Modal */}
      <Modal show={showAIModal} onHide={() => setShowAIModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-brain-line me-2"></i>
            AI Treatment Recommendations
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Card>
                <Card.Header>
                  <h6>Patient Information & Symptoms</h6>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Patient *</Form.Label>
                    <Form.Select
                      name="patient_id"
                      value={aiForm.patient_id}
                      onChange={handleAIInputChange}
                      required
                    >
                      <option value="">Select Patient</option>
                      {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.user?.first_name} {patient.user?.last_name} - {patient.patient_id}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Symptoms *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="symptoms"
                      value={aiForm.symptoms}
                      onChange={handleAIInputChange}
                      placeholder="Describe patient's symptoms (e.g., tooth pain, sensitivity, swelling, etc.)"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Diagnosis *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="diagnosis"
                      value={aiForm.diagnosis}
                      onChange={handleAIInputChange}
                      placeholder="Initial diagnosis or suspected condition"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Medical History</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="medical_history"
                      value={aiForm.medical_history}
                      onChange={handleAIInputChange}
                      placeholder="Relevant medical history, allergies, medications"
                    />
                  </Form.Group>

                  <Button 
                    variant="primary" 
                    onClick={generateAIRecommendations}
                    disabled={generatingAI || !aiForm.patient_id || !aiForm.symptoms || !aiForm.diagnosis}
                  >
                    {generatingAI ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Generating AI Recommendations...
                      </>
                    ) : (
                      <>
                        <i className="ri-magic-line me-2"></i>
                        Generate AI Recommendations
                      </>
                    )}
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              {aiRecommendations ? (
                <Card>
                  <Card.Header>
                    <h6>
                      <i className="ri-lightbulb-line me-2"></i>
                      AI Treatment Recommendations
                    </h6>
                    <small className="text-muted">
                      Confidence: {Math.round(aiRecommendations.ai_confidence * 100)}% | 
                      Processing Time: {aiRecommendations.processing_time}s
                    </small>
                  </Card.Header>
                  <Card.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    {/* Risk Assessment */}
                    <Alert variant={aiRecommendations.risk_assessment.overall_risk === 'high' ? 'danger' : 
                                   aiRecommendations.risk_assessment.overall_risk === 'moderate' ? 'warning' : 'info'}>
                      <strong>Risk Assessment: {aiRecommendations.risk_assessment.overall_risk.toUpperCase()}</strong>
                      <br />
                      Success Probability: {Math.round(aiRecommendations.risk_assessment.success_probability)}%
                      {aiRecommendations.risk_assessment.risk_factors.length > 0 && (
                        <ul className="mt-2 mb-0">
                          {aiRecommendations.risk_assessment.risk_factors.map((factor, index) => (
                            <li key={index}>{factor}</li>
                          ))}
                        </ul>
                      )}
                    </Alert>

                    {/* Recommended Treatments */}
                    <h6>Recommended Treatments:</h6>
                    {aiRecommendations.recommended_treatments.map((treatment, index) => (
                      <Card key={index} className="mb-3">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="mb-1">{treatment.treatment_name}</h6>
                              <Badge bg={treatment.priority === 'urgent' ? 'danger' : 
                                        treatment.priority === 'high' ? 'warning' : 'primary'}>
                                {treatment.priority.toUpperCase()}
                              </Badge>
                              <p className="mt-2 mb-1">{treatment.description}</p>
                              <small className="text-muted">
                                Code: {treatment.treatment_code} | Duration: {treatment.duration}
                              </small>
                            </div>
                            <div className="text-end">
                              <div><strong>{formatCurrency(treatment.estimated_cost)}</strong></div>
                              <div><small>Success: {Math.round(treatment.success_rate)}%</small></div>
                              <Button 
                                size="sm" 
                                variant="outline-success" 
                                className="mt-2"
                                onClick={() => applyAIRecommendation(treatment)}
                              >
                                Use This
                              </Button>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    ))}

                    {/* Alternative Options */}
                    {aiRecommendations.alternative_options.length > 0 && (
                      <>
                        <h6>Alternative Options:</h6>
                        <ListGroup className="mb-3">
                          {aiRecommendations.alternative_options.map((option, index) => (
                            <ListGroup.Item key={index}>{option}</ListGroup.Item>
                          ))}
                        </ListGroup>
                      </>
                    )}

                    {/* Additional Recommendations */}
                    <div className="row">
                      <div className="col-6">
                        <strong>Urgency Level:</strong>
                        <Badge bg={aiRecommendations.urgency_level === 'urgent' ? 'danger' : 
                                  aiRecommendations.urgency_level === 'priority' ? 'warning' : 'success'}>
                          {aiRecommendations.urgency_level.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="col-6">
                        <strong>Follow-up Required:</strong> {aiRecommendations.follow_up_required ? 'Yes' : 'No'}
                      </div>
                    </div>
                    {aiRecommendations.specialist_referral && (
                      <Alert variant="info" className="mt-3">
                        <i className="ri-user-star-line me-2"></i>
                        Specialist referral recommended for this case.
                      </Alert>
                    )}
                  </Card.Body>
                </Card>
              ) : (
                <Card>
                  <Card.Body className="text-center py-5">
                    <i className="ri-brain-line text-muted" style={{ fontSize: '3rem' }}></i>
                    <h5 className="text-muted mt-3">AI Ready</h5>
                    <p className="text-muted">
                      Fill in the patient information and click "Generate AI Recommendations" to get intelligent treatment suggestions.
                    </p>
                  </Card.Body>
                </Card>
              )}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAIModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Treatment Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-medicine-bottle-line me-2"></i>
            Create New Treatment Plan
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddTreatment}>
          <Modal.Body>
            {/* Display global error message if form has errors */}
            {Object.keys(formErrors).length > 0 && (
              <Alert variant="danger" className="mb-4">
                <i className="ri-error-warning-line me-2"></i>
                Please correct the following errors before submitting:
                <ul className="mb-0 mt-2">
                  {Object.entries(formErrors).map(([field, error]) => (
                    <li key={field}>{error}</li>
                  ))}
                </ul>
              </Alert>
            )}

            {/* Basic Information */}
            <div className="border rounded p-3 mb-4">
              <h6 className="text-primary mb-3">
                <i className="ri-user-line me-2"></i>
                Basic Information
              </h6>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Patient *</Form.Label>
                    <Form.Select
                      name="patient_id"
                      value={treatmentForm.patient_id}
                      onChange={handleInputChange}
                      isInvalid={!!formErrors.patient_id}
                      required
                    >
                      <option value="">Select Patient</option>
                      {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.user?.first_name} {patient.user?.last_name} - {patient.patient_id}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {formErrors.patient_id}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Dentist *</Form.Label>
                    <Form.Select
                      name="dentist_id"
                      value={treatmentForm.dentist_id}
                      onChange={handleInputChange}
                      isInvalid={!!formErrors.dentist_id}
                      required
                    >
                      <option value="">Select Dentist</option>
                      {dentists.map((dentist) => (
                        <option key={dentist.id} value={dentist.id}>
                          Dr. {dentist.user?.first_name} {dentist.user?.last_name} - {dentist.specialization}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {formErrors.dentist_id}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Related Appointment</Form.Label>
                    <Form.Select
                      name="appointment_id"
                      value={treatmentForm.appointment_id}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Appointment (Optional)</option>
                      {appointments.filter(apt => apt.patient?.id.toString() === treatmentForm.patient_id).map((appointment) => (
                        <option key={appointment.id} value={appointment.id}>
                          {new Date(appointment.appointment_date).toLocaleDateString()} - {appointment.appointment_type}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* Treatment Details */}
            <div className="border rounded p-3 mb-4">
              <h6 className="text-primary mb-3">
                <i className="ri-medicine-bottle-line me-2"></i>
                Treatment Details
              </h6>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Treatment Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="treatment_name"
                      value={treatmentForm.treatment_name}
                      onChange={handleInputChange}
                      isInvalid={!!formErrors.treatment_name}
                      placeholder="e.g., Composite Filling"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.treatment_name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Treatment Code</Form.Label>
                    <Form.Control
                      type="text"
                      name="treatment_code"
                      value={treatmentForm.treatment_code}
                      onChange={handleInputChange}
                      placeholder="e.g., D2391"
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Start Date *</Form.Label>
                    <Form.Control
                      type="date"
                      name="start_date"
                      value={treatmentForm.start_date}
                      onChange={handleInputChange}
                      isInvalid={!!formErrors.start_date}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.start_date}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tooth Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="tooth_number"
                      value={treatmentForm.tooth_number}
                      onChange={handleInputChange}
                      placeholder="e.g., #14, #3, etc."
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Surface</Form.Label>
                    <Form.Control
                      type="text"
                      name="surface"
                      value={treatmentForm.surface}
                      onChange={handleInputChange}
                      placeholder="e.g., MOD, MODBL"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Diagnosis *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="diagnosis"
                  value={treatmentForm.diagnosis}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.diagnosis}
                  placeholder="Clinical diagnosis and findings"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.diagnosis}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Treatment Plan *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="treatment_plan"
                  value={treatmentForm.treatment_plan}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.treatment_plan}
                  placeholder="Detailed treatment plan and procedures"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.treatment_plan}
                </Form.Control.Feedback>
              </Form.Group>
            </div>

            {/* Financial Information */}
            <div className="border rounded p-3 mb-4">
              <h6 className="text-primary mb-3">
                <i className="ri-money-dollar-circle-line me-2"></i>
                Financial Information
              </h6>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Total Cost *</Form.Label>
                    <Form.Control
                      type="number"
                      name="cost"
                      value={treatmentForm.cost}
                      onChange={handleInputChange}
                      isInvalid={!!formErrors.cost}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.cost}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Insurance Coverage</Form.Label>
                    <Form.Control
                      type="number"
                      name="insurance_coverage"
                      value={treatmentForm.insurance_coverage}
                      onChange={handleInputChange}
                      isInvalid={!!formErrors.insurance_coverage}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.insurance_coverage}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Patient Payment</Form.Label>
                    <Form.Control
                      type="number"
                      name="patient_payment"
                      value={treatmentForm.patient_payment}
                      onChange={handleInputChange}
                      isInvalid={!!formErrors.patient_payment}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.patient_payment}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* Additional Information */}
            <div className="border rounded p-3 mb-4">
              <h6 className="text-primary mb-3">
                <i className="ri-information-line me-2"></i>
                Additional Information
              </h6>
              <Form.Group className="mb-3">
                <Form.Label>Post-Treatment Instructions</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="post_treatment_instructions"
                  value={treatmentForm.post_treatment_instructions}
                  onChange={handleInputChange}
                  placeholder="Instructions for patient after treatment"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  name="follow_up_required"
                  checked={treatmentForm.follow_up_required}
                  onChange={handleInputChange}
                  label="Follow-up appointment required"
                />
              </Form.Group>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="w-100 d-flex justify-content-between align-items-center">
              <small className="text-muted">
                <i className="ri-information-line me-1"></i>
                Fields marked with * are required
              </small>
              <div>
                <Button 
                  variant="secondary" 
                  onClick={() => setShowAddModal(false)}
                  disabled={addingTreatment}
                  className="me-2"
                >
                  <i className="ri-close-line me-1"></i>
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={addingTreatment}
                >
                  {addingTreatment ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Creating Treatment Plan...
                    </>
                  ) : (
                    <>
                      <i className="ri-medicine-bottle-line me-1"></i>
                      Create Treatment Plan
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default DentistryTreatments;
