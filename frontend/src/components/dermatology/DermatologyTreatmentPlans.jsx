import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
  Modal,
  Form,
  Alert,
  Spinner,
  InputGroup,
  Dropdown,
  Tabs,
  Tab,
  ProgressBar
} from 'react-bootstrap';
import apiClient from '../../services/api';
import { DERMATOLOGY_ENDPOINTS } from '../../services/apiConstants';

const DermatologyTreatmentPlans = () => {
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [skinConditions, setSkinConditions] = useState([]);
  const [treatmentOutcomes, setTreatmentOutcomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showOutcomeModal, setShowOutcomeModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const [formData, setFormData] = useState({
    consultation_id: '',
    diagnosed_condition_id: '',
    treatment_category: 'topical',
    treatment_name: '',
    treatment_description: '',
    medication_name: '',
    dosage: '',
    frequency: '',
    duration: '',
    application_instructions: '',
    precautions: '',
    expected_outcomes: '',
    potential_side_effects: '',
    start_date: '',
    expected_end_date: '',
    status: 'planned'
  });

  const [outcomeData, setOutcomeData] = useState({
    assessment_date: '',
    outcome_status: 'good',
    improvement_percentage: '',
    symptom_severity_score: '',
    patient_satisfaction: '',
    side_effects_reported: '',
    quality_of_life_impact: '',
    clinical_notes: '',
    next_assessment_date: '',
    treatment_modifications: ''
  });

  const treatmentCategories = [
    { value: 'topical', label: 'Topical Therapy' },
    { value: 'systemic', label: 'Systemic Therapy' },
    { value: 'surgical', label: 'Surgical Intervention' },
    { value: 'laser', label: 'Laser Therapy' },
    { value: 'phototherapy', label: 'Phototherapy' },
    { value: 'cryotherapy', label: 'Cryotherapy' },
    { value: 'immunotherapy', label: 'Immunotherapy' },
    { value: 'lifestyle', label: 'Lifestyle Modifications' },
    { value: 'follow_up', label: 'Follow-up Care' },
    { value: 'preventive', label: 'Preventive Measures' }
  ];

  const statusOptions = [
    { value: 'planned', label: 'Planned', color: 'secondary' },
    { value: 'active', label: 'Active', color: 'primary' },
    { value: 'on_hold', label: 'On Hold', color: 'warning' },
    { value: 'completed', label: 'Completed', color: 'success' },
    { value: 'discontinued', label: 'Discontinued', color: 'danger' },
    { value: 'modified', label: 'Modified', color: 'info' }
  ];

  const outcomeStatuses = [
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' },
    { value: 'no_response', label: 'No Response' },
    { value: 'adverse_reaction', label: 'Adverse Reaction' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadTreatmentPlans(),
        loadConsultations(),
        loadSkinConditions(),
        loadTreatmentOutcomes()
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadTreatmentPlans = async () => {
  const { data } = await apiClient.get(DERMATOLOGY_ENDPOINTS.TREATMENT_PLANS);
  setTreatmentPlans(data);
  };

  const loadConsultations = async () => {
  const { data } = await apiClient.get(DERMATOLOGY_ENDPOINTS.CONSULTATIONS);
  setConsultations(data);
  };

  const loadSkinConditions = async () => {
  const { data } = await apiClient.get(DERMATOLOGY_ENDPOINTS.SKIN_CONDITIONS);
  setSkinConditions(data);
  };

  const loadTreatmentOutcomes = async () => {
  const { data } = await apiClient.get(DERMATOLOGY_ENDPOINTS.TREATMENT_OUTCOMES);
  setTreatmentOutcomes(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingPlan 
        ? `${DERMATOLOGY_ENDPOINTS.TREATMENT_PLANS}${editingPlan.id}/`
        : DERMATOLOGY_ENDPOINTS.TREATMENT_PLANS;
      
      const submitData = {
        ...formData,
        prescribed_by_id: localStorage.getItem('userId')
      };

      if (editingPlan) {
        await apiClient.put(url, submitData);
      } else {
        await apiClient.post(url, submitData);
      }

      await loadTreatmentPlans();
      handleCloseModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmitOutcome = async (e) => {
    e.preventDefault();
    
    try {
  const submitData = {
        ...outcomeData,
        treatment_plan_id: selectedPlan.id,
        assessed_by_id: localStorage.getItem('userId')
      };

  await apiClient.post(DERMATOLOGY_ENDPOINTS.TREATMENT_OUTCOMES, submitData);

      await Promise.all([loadTreatmentPlans(), loadTreatmentOutcomes()]);
      handleCloseOutcomeModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleActivatePlan = async (planId) => {
    try {
  await apiClient.post(DERMATOLOGY_ENDPOINTS.TREATMENT_ACTIONS.ACTIVATE(planId));

      await loadTreatmentPlans();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCompletePlan = async (planId) => {
    try {
  await apiClient.post(DERMATOLOGY_ENDPOINTS.TREATMENT_ACTIONS.COMPLETE(planId));

      await loadTreatmentPlans();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      consultation_id: plan.consultation?.id || '',
      diagnosed_condition_id: plan.diagnosed_condition?.id || '',
      treatment_category: plan.treatment_category || 'topical',
      treatment_name: plan.treatment_name || '',
      treatment_description: plan.treatment_description || '',
      medication_name: plan.medication_name || '',
      dosage: plan.dosage || '',
      frequency: plan.frequency || '',
      duration: plan.duration || '',
      application_instructions: plan.application_instructions || '',
      precautions: plan.precautions || '',
      expected_outcomes: plan.expected_outcomes || '',
      potential_side_effects: plan.potential_side_effects || '',
      start_date: plan.start_date || '',
      expected_end_date: plan.expected_end_date || '',
      status: plan.status || 'planned'
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPlan(null);
    setFormData({
      consultation_id: '',
      diagnosed_condition_id: '',
      treatment_category: 'topical',
      treatment_name: '',
      treatment_description: '',
      medication_name: '',
      dosage: '',
      frequency: '',
      duration: '',
      application_instructions: '',
      precautions: '',
      expected_outcomes: '',
      potential_side_effects: '',
      start_date: '',
      expected_end_date: '',
      status: 'planned'
    });
  };

  const handleCloseOutcomeModal = () => {
    setShowOutcomeModal(false);
    setSelectedPlan(null);
    setOutcomeData({
      assessment_date: '',
      outcome_status: 'good',
      improvement_percentage: '',
      symptom_severity_score: '',
      patient_satisfaction: '',
      side_effects_reported: '',
      quality_of_life_impact: '',
      clinical_notes: '',
      next_assessment_date: '',
      treatment_modifications: ''
    });
  };

  const handleRecordOutcome = (plan) => {
    setSelectedPlan(plan);
    setOutcomeData({
      ...outcomeData,
      assessment_date: new Date().toISOString().split('T')[0]
    });
    setShowOutcomeModal(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = statusOptions.find(s => s.value === status) || 
      { color: 'secondary', label: status };
    return <Badge bg={statusConfig.color}>{statusConfig.label}</Badge>;
  };

  const getEffectivenessProgress = (rating) => {
    if (!rating) return null;
    
    const percentage = (rating / 10) * 100;
    let variant = 'danger';
    if (percentage >= 70) variant = 'success';
    else if (percentage >= 40) variant = 'warning';
    
    return (
      <div>
        <ProgressBar variant={variant} now={percentage} />
        <small className="text-muted">{rating}/10</small>
      </div>
    );
  };

  const filteredPlans = treatmentPlans.filter(plan => {
    const matchesSearch = !searchTerm || 
      plan.treatment_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.medication_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.diagnosed_condition?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filterStatus || plan.status === filterStatus;
    
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'active' && plan.status === 'active') ||
      (activeTab === 'completed' && plan.status === 'completed') ||
      (activeTab === 'pending' && ['planned', 'on_hold'].includes(plan.status));

    return matchesSearch && matchesStatus && matchesTab;
  });

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading treatment plans...</p>
        </div>
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
              <h2>
                <i className="ri-capsule-line me-2 text-primary"></i>
                Dermatology Treatment Plans
              </h2>
              <p className="text-muted mb-0">
                Manage patient treatment plans and track outcomes
              </p>
            </div>
            <Button 
              variant="primary" 
              onClick={() => setShowModal(true)}
            >
              <i className="ri-add-line me-2"></i>
              New Treatment Plan
            </Button>
          </div>
        </Col>
      </Row>

      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      {/* Filters */}
      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <i className="ri-search-line"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search treatment plans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            {statusOptions.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Button 
            variant="outline-secondary" 
            onClick={loadData}
            disabled={loading}
          >
            <i className="ri-filter-line me-2"></i>
            Refresh
          </Button>
        </Col>
      </Row>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3"
      >
        <Tab eventKey="all" title="All Plans" />
        <Tab eventKey="active" title="Active" />
        <Tab eventKey="completed" title="Completed" />
        <Tab eventKey="pending" title="Pending" />
      </Tabs>

      {/* Treatment Plans Table */}
      <Row>
        <Col>
          <Card>
            <Card.Body>
              {filteredPlans.length > 0 ? (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Condition</th>
                      <th>Treatment</th>
                      <th>Category</th>
                      <th>Medication</th>
                      <th>Duration</th>
                      <th>Status</th>
                      <th>Effectiveness</th>
                      <th>Outcomes</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlans.map((plan) => (
                      <tr key={plan.id}>
                        <td>
                          <div>
                            <strong>
                              {plan.consultation?.patient?.user?.first_name}{' '}
                              {plan.consultation?.patient?.user?.last_name}
                            </strong>
                            <br />
                            <small className="text-muted">
                              MRN: {plan.consultation?.patient?.medical_record_number}
                            </small>
                          </div>
                        </td>
                        <td>
                          <div>
                            <strong>{plan.diagnosed_condition?.name}</strong>
                            <br />
                            <Badge bg="info" className="me-1">
                              {plan.diagnosed_condition?.category}
                            </Badge>
                            <Badge bg="secondary">
                              {plan.diagnosed_condition?.severity_level}
                            </Badge>
                          </div>
                        </td>
                        <td>
                          <div style={{ maxWidth: '200px' }}>
                            <strong>{plan.treatment_name}</strong>
                            {plan.treatment_description && (
                              <div>
                                <small className="text-muted">
                                  {plan.treatment_description.length > 50 
                                    ? `${plan.treatment_description.substring(0, 50)}...`
                                    : plan.treatment_description}
                                </small>
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <Badge bg="primary">
                            {treatmentCategories.find(c => c.value === plan.treatment_category)?.label}
                          </Badge>
                        </td>
                        <td>
                          {plan.medication_name && (
                            <div>
                              <strong>{plan.medication_name}</strong>
                              {plan.dosage && (
                                <div>
                                  <small className="text-muted">
                                    {plan.dosage}
                                    {plan.frequency && ` - ${plan.frequency}`}
                                  </small>
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                        <td>
                          <div>
                            <i className="ri-calendar-line me-1"></i>
                            {new Date(plan.start_date).toLocaleDateString()}
                            {plan.expected_end_date && (
                              <div>
                                <small className="text-muted">
                                  to {new Date(plan.expected_end_date).toLocaleDateString()}
                                </small>
                              </div>
                            )}
                            {plan.duration && (
                              <div>
                                <small className="text-info">{plan.duration}</small>
                              </div>
                            )}
                          </div>
                        </td>
                        <td>{getStatusBadge(plan.status)}</td>
                        <td>
                          {getEffectivenessProgress(plan.effectiveness_rating)}
                        </td>
                        <td>
                          <div className="text-center">
                            <Badge bg="info">
                              {plan.outcomes_count || 0}
                            </Badge>
                            {plan.latest_outcome && (
                              <div>
                                <small className="text-muted">
                                  Latest: {plan.latest_outcome.outcome_status}
                                </small>
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <Dropdown>
                            <Dropdown.Toggle variant="outline-secondary" size="sm">
                              Actions
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => handleEdit(plan)}>
                                <i className="ri-edit-line me-2"></i>
                                Edit Plan
                              </Dropdown.Item>
                              {plan.status === 'planned' && (
                                <Dropdown.Item 
                                  onClick={() => handleActivatePlan(plan.id)}
                                >
                                  <i className="ri-play-line me-2"></i>
                                  Activate Plan
                                </Dropdown.Item>
                              )}
                              {plan.status === 'active' && (
                                <Dropdown.Item 
                                  onClick={() => handleCompletePlan(plan.id)}
                                >
                                  <i className="ri-check-line me-2"></i>
                                  Complete Plan
                                </Dropdown.Item>
                              )}
                              <Dropdown.Item 
                                onClick={() => handleRecordOutcome(plan)}
                              >
                                <i className="ri-line-chart-line me-2"></i>
                                Record Outcome
                              </Dropdown.Item>
                              <Dropdown.Item>
                                <i className="ri-eye-line me-2"></i>
                                View Details
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info" className="text-center">
                  <i className="ri-capsule-line me-2"></i>
                  No treatment plans found matching your criteria.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Create/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingPlan ? 'Edit Treatment Plan' : 'New Treatment Plan'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Consultation *</Form.Label>
                  <Form.Select
                    value={formData.consultation_id}
                    onChange={(e) => setFormData({...formData, consultation_id: e.target.value})}
                    required
                  >
                    <option value="">Select Consultation</option>
                    {consultations.map(consultation => (
                      <option key={consultation.id} value={consultation.id}>
                        {consultation.consultation_number} - {consultation.patient?.user?.first_name} {consultation.patient?.user?.last_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Diagnosed Condition *</Form.Label>
                  <Form.Select
                    value={formData.diagnosed_condition_id}
                    onChange={(e) => setFormData({...formData, diagnosed_condition_id: e.target.value})}
                    required
                  >
                    <option value="">Select Condition</option>
                    {skinConditions.map(condition => (
                      <option key={condition.id} value={condition.id}>
                        {condition.name} ({condition.category})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Treatment Category *</Form.Label>
                  <Form.Select
                    value={formData.treatment_category}
                    onChange={(e) => setFormData({...formData, treatment_category: e.target.value})}
                    required
                  >
                    {treatmentCategories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Treatment Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.treatment_name}
                    onChange={(e) => setFormData({...formData, treatment_name: e.target.value})}
                    placeholder="e.g., Topical Retinoid Therapy"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Treatment Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.treatment_description}
                onChange={(e) => setFormData({...formData, treatment_description: e.target.value})}
                placeholder="Detailed description of the treatment approach"
                required
              />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Medication Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.medication_name}
                    onChange={(e) => setFormData({...formData, medication_name: e.target.value})}
                    placeholder="e.g., Tretinoin 0.025%"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Dosage</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.dosage}
                    onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                    placeholder="e.g., 0.025%, 5mg"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Frequency</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.frequency}
                    onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                    placeholder="e.g., Once daily, BID"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    placeholder="e.g., 6 weeks, 3 months"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date *</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Expected End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.expected_end_date}
                    onChange={(e) => setFormData({...formData, expected_end_date: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Application Instructions</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.application_instructions}
                onChange={(e) => setFormData({...formData, application_instructions: e.target.value})}
                placeholder="Detailed instructions for medication application"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Precautions</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.precautions}
                onChange={(e) => setFormData({...formData, precautions: e.target.value})}
                placeholder="Important precautions and warnings"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Expected Outcomes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={formData.expected_outcomes}
                    onChange={(e) => setFormData({...formData, expected_outcomes: e.target.value})}
                    placeholder="Expected treatment outcomes and timeline"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Potential Side Effects</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={formData.potential_side_effects}
                    onChange={(e) => setFormData({...formData, potential_side_effects: e.target.value})}
                    placeholder="Possible side effects and adverse reactions"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingPlan ? 'Update Plan' : 'Create Plan'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Outcome Recording Modal */}
      <Modal show={showOutcomeModal} onHide={handleCloseOutcomeModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Record Treatment Outcome</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitOutcome}>
          <Modal.Body>
            {selectedPlan && (
              <Alert variant="info">
                <strong>Treatment:</strong> {selectedPlan.treatment_name}<br />
                <strong>Patient:</strong> {selectedPlan.consultation?.patient?.user?.first_name} {selectedPlan.consultation?.patient?.user?.last_name}
              </Alert>
            )}

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Assessment Date *</Form.Label>
                  <Form.Control
                    type="date"
                    value={outcomeData.assessment_date}
                    onChange={(e) => setOutcomeData({...outcomeData, assessment_date: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Outcome Status *</Form.Label>
                  <Form.Select
                    value={outcomeData.outcome_status}
                    onChange={(e) => setOutcomeData({...outcomeData, outcome_status: e.target.value})}
                    required
                  >
                    {outcomeStatuses.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Improvement Percentage (0-100) *</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={outcomeData.improvement_percentage}
                    onChange={(e) => setOutcomeData({...outcomeData, improvement_percentage: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Symptom Severity Score (0-10) *</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    max="10"
                    value={outcomeData.symptom_severity_score}
                    onChange={(e) => setOutcomeData({...outcomeData, symptom_severity_score: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Patient Satisfaction (1-10)</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    max="10"
                    value={outcomeData.patient_satisfaction}
                    onChange={(e) => setOutcomeData({...outcomeData, patient_satisfaction: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Side Effects Reported</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={outcomeData.side_effects_reported}
                    onChange={(e) => setOutcomeData({...outcomeData, side_effects_reported: e.target.value})}
                    placeholder="Any side effects or adverse reactions"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Quality of Life Impact</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={outcomeData.quality_of_life_impact}
                    onChange={(e) => setOutcomeData({...outcomeData, quality_of_life_impact: e.target.value})}
                    placeholder="Impact on patient's quality of life"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Clinical Notes *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={outcomeData.clinical_notes}
                onChange={(e) => setOutcomeData({...outcomeData, clinical_notes: e.target.value})}
                placeholder="Detailed clinical assessment and observations"
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Next Assessment Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={outcomeData.next_assessment_date}
                    onChange={(e) => setOutcomeData({...outcomeData, next_assessment_date: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Treatment Modifications</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={outcomeData.treatment_modifications}
                    onChange={(e) => setOutcomeData({...outcomeData, treatment_modifications: e.target.value})}
                    placeholder="Any modifications to the treatment plan"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseOutcomeModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Record Outcome
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default DermatologyTreatmentPlans;

