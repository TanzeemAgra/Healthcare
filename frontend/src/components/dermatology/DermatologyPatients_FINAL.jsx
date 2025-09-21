import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Form, InputGroup, Modal, Spinner, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import apiClient from '../../services/api';
import { DERMATOLOGY_ENDPOINTS } from '../../services/apiConstants';

// Soft coding: Configuration constants
const COMPONENT_CONFIG = {
  ITEMS_PER_PAGE: 10,
  SEARCH_DELAY: 300,
  TOAST_DURATION: 3000,
  MODAL_ANIMATION: 150
};

const STATUS_OPTIONS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  ALL: 'all'
};

const SEVERITY_LEVELS = {
  MILD: 'mild',
  MODERATE: 'moderate',
  SEVERE: 'severe',
  CRITICAL: 'critical'
};

const FORM_VALIDATION = {
  REQUIRED_FIELDS: ['first_name', 'last_name', 'email', 'phone', 'condition'],
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_PATTERN: /^[\+]?[1-9][\d]{0,15}$/
};

const DermatologyPatients = () => {
  // State management using soft coding
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCondition, setFilterCondition] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('');
  const [filterStatus, setFilterStatus] = useState(STATUS_OPTIONS.ALL);
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Form data with soft coding
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    address: '',
    medical_history: '',
    allergies: '',
    current_medications: '',
    skin_type: '',
    primary_concern: '',
    condition: '',
    severity: SEVERITY_LEVELS.MILD,
    affected_areas: '',
    symptoms_duration: '',
    previous_treatments: '',
    family_history_skin: '',
    occupation: '',
    lifestyle_factors: '',
    sun_exposure: '',
    skincare_routine: '',
    insurance_provider: '',
    insurance_policy: '',
    preferred_communication: '',
    consent_treatment: false,
    consent_photos: false,
    consent_marketing: false
  });

  // Load patients using soft coding endpoint
  const loadPatients = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(DERMATOLOGY_ENDPOINTS.PATIENTS.LIST);
      
      if (response.data && Array.isArray(response.data)) {
        setPatients(response.data);
        setFilteredPatients(response.data);
      } else {
        console.warn('Unexpected response format:', response.data);
        setPatients([]);
        setFilteredPatients([]);
      }
    } catch (error) {
      console.error('Error loading patients:', error);
      toast.error('Failed to load patients', { autoClose: COMPONENT_CONFIG.TOAST_DURATION });
      setPatients([]);
      setFilteredPatients([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter patients using soft coding
  const filterPatients = () => {
    let filtered = patients;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(patient =>
        patient.first_name?.toLowerCase().includes(term) ||
        patient.last_name?.toLowerCase().includes(term) ||
        patient.email?.toLowerCase().includes(term) ||
        patient.condition?.toLowerCase().includes(term)
      );
    }

    if (filterCondition) {
      filtered = filtered.filter(patient =>
        patient.condition?.toLowerCase().includes(filterCondition.toLowerCase())
      );
    }

    if (filterSeverity) {
      filtered = filtered.filter(patient =>
        patient.severity === filterSeverity
      );
    }

    if (filterStatus !== STATUS_OPTIONS.ALL) {
      filtered = filtered.filter(patient =>
        patient.status === filterStatus
      );
    }

    setFilteredPatients(filtered);
  };

  // Form validation using soft coding
  const validateForm = () => {
    const newErrors = {};

    FORM_VALIDATION.REQUIRED_FIELDS.forEach(field => {
      if (!formData[field]?.trim()) {
        newErrors[field] = `${field.replace('_', ' ')} is required`;
      }
    });

    if (formData.email && !FORM_VALIDATION.EMAIL_PATTERN.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !FORM_VALIDATION.PHONE_PATTERN.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission using soft coding
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please correct the errors in the form', { autoClose: COMPONENT_CONFIG.TOAST_DURATION });
      return;
    }

    try {
      setIsSubmitting(true);
      
      if (selectedPatient) {
        const endpoint = DERMATOLOGY_ENDPOINTS.PATIENTS.UPDATE.replace(':id', selectedPatient.id);
        await apiClient.put(endpoint, formData);
        toast.success('Patient updated successfully', { autoClose: COMPONENT_CONFIG.TOAST_DURATION });
      } else {
        await apiClient.post(DERMATOLOGY_ENDPOINTS.PATIENTS.CREATE, formData);
        toast.success('Patient added successfully', { autoClose: COMPONENT_CONFIG.TOAST_DURATION });
      }

      handleCloseModal();
      loadPatients();
    } catch (error) {
      console.error('Error saving patient:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to save patient';
      toast.error(errorMessage, { autoClose: COMPONENT_CONFIG.TOAST_DURATION });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle patient deletion using soft coding
  const handleDelete = async (patientId) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) {
      return;
    }

    try {
      const endpoint = DERMATOLOGY_ENDPOINTS.PATIENTS.DELETE.replace(':id', patientId);
      await apiClient.delete(endpoint);
      toast.success('Patient deleted successfully', { autoClose: COMPONENT_CONFIG.TOAST_DURATION });
      loadPatients();
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast.error('Failed to delete patient', { autoClose: COMPONENT_CONFIG.TOAST_DURATION });
    }
  };

  // Modal handlers using soft coding
  const handleShowModal = (patient = null) => {
    setSelectedPatient(patient);
    if (patient) {
      setFormData({ ...formData, ...patient });
    } else {
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        gender: '',
        address: '',
        medical_history: '',
        allergies: '',
        current_medications: '',
        skin_type: '',
        primary_concern: '',
        condition: '',
        severity: SEVERITY_LEVELS.MILD,
        affected_areas: '',
        symptoms_duration: '',
        previous_treatments: '',
        family_history_skin: '',
        occupation: '',
        lifestyle_factors: '',
        sun_exposure: '',
        skincare_routine: '',
        insurance_provider: '',
        insurance_policy: '',
        preferred_communication: '',
        consent_treatment: false,
        consent_photos: false,
        consent_marketing: false
      });
    }
    setErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPatient(null);
    setErrors({});
  };

  // Handle input changes using soft coding
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Get severity badge variant using soft coding
  const getSeverityBadge = (severity) => {
    const variants = {
      [SEVERITY_LEVELS.MILD]: 'success',
      [SEVERITY_LEVELS.MODERATE]: 'warning',
      [SEVERITY_LEVELS.SEVERE]: 'danger',
      [SEVERITY_LEVELS.CRITICAL]: 'dark'
    };
    return variants[severity] || 'secondary';
  };

  // Get status badge variant using soft coding
  const getStatusBadge = (status) => {
    const variants = {
      [STATUS_OPTIONS.ACTIVE]: 'success',
      [STATUS_OPTIONS.INACTIVE]: 'secondary',
      [STATUS_OPTIONS.PENDING]: 'warning'
    };
    return variants[status] || 'secondary';
  };

  // Effects using soft coding
  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      filterPatients();
    }, COMPONENT_CONFIG.SEARCH_DELAY);

    return () => clearTimeout(timer);
  }, [searchTerm, filterCondition, filterSeverity, filterStatus, patients]);

  // Render patient row using soft coding
  const renderPatientRow = (patient, index) => (
    <tr key={patient.id || index}>
      <td>{patient.first_name} {patient.last_name}</td>
      <td>{patient.email}</td>
      <td>{patient.phone}</td>
      <td>{patient.condition}</td>
      <td>
        <Badge bg={getSeverityBadge(patient.severity)}>
          {patient.severity}
        </Badge>
      </td>
      <td>
        <Badge bg={getStatusBadge(patient.status)}>
          {patient.status || 'active'}
        </Badge>
      </td>
      <td>
        <Button
          variant="outline-primary"
          size="sm"
          className="me-2"
          onClick={() => handleShowModal(patient)}
        >
          Edit
        </Button>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => handleDelete(patient.id)}
        >
          Delete
        </Button>
      </td>
    </tr>
  );

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4>Dermatology Patients</h4>
              <Button variant="primary" onClick={() => handleShowModal()}>
                Add New Patient
              </Button>
            </Card.Header>
            <Card.Body>
              {/* Search and Filter Controls */}
              <Row className="mb-3">
                <Col md={3}>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Search patients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={filterCondition}
                    onChange={(e) => setFilterCondition(e.target.value)}
                  >
                    <option value="">All Conditions</option>
                    <option value="acne">Acne</option>
                    <option value="eczema">Eczema</option>
                    <option value="psoriasis">Psoriasis</option>
                    <option value="dermatitis">Dermatitis</option>
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={filterSeverity}
                    onChange={(e) => setFilterSeverity(e.target.value)}
                  >
                    <option value="">All Severities</option>
                    <option value={SEVERITY_LEVELS.MILD}>Mild</option>
                    <option value={SEVERITY_LEVELS.MODERATE}>Moderate</option>
                    <option value={SEVERITY_LEVELS.SEVERE}>Severe</option>
                    <option value={SEVERITY_LEVELS.CRITICAL}>Critical</option>
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value={STATUS_OPTIONS.ALL}>All Status</option>
                    <option value={STATUS_OPTIONS.ACTIVE}>Active</option>
                    <option value={STATUS_OPTIONS.INACTIVE}>Inactive</option>
                    <option value={STATUS_OPTIONS.PENDING}>Pending</option>
                  </Form.Select>
                </Col>
              </Row>

              {/* Patients Table */}
              {isLoading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : filteredPatients.length === 0 ? (
                <Alert variant="info" className="text-center">
                  No patients found. {patients.length === 0 ? 'Add your first patient!' : 'Try adjusting your filters.'}
                </Alert>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Condition</th>
                      <th>Severity</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map(renderPatientRow)}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Patient Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedPatient ? 'Edit Patient' : 'Add New Patient'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    isInvalid={!!errors.first_name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.first_name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    isInvalid={!!errors.last_name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.last_name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone *</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    isInvalid={!!errors.phone}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Condition *</Form.Label>
                  <Form.Select
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    isInvalid={!!errors.condition}
                  >
                    <option value="">Select Condition</option>
                    <option value="acne">Acne</option>
                    <option value="eczema">Eczema</option>
                    <option value="psoriasis">Psoriasis</option>
                    <option value="dermatitis">Dermatitis</option>
                    <option value="rosacea">Rosacea</option>
                    <option value="other">Other</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.condition}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Severity</Form.Label>
                  <Form.Select
                    name="severity"
                    value={formData.severity}
                    onChange={handleInputChange}
                  >
                    <option value={SEVERITY_LEVELS.MILD}>Mild</option>
                    <option value={SEVERITY_LEVELS.MODERATE}>Moderate</option>
                    <option value={SEVERITY_LEVELS.SEVERE}>Severe</option>
                    <option value={SEVERITY_LEVELS.CRITICAL}>Critical</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Medical History</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="medical_history"
                value={formData.medical_history}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  {selectedPatient ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                selectedPatient ? 'Update Patient' : 'Add Patient'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default DermatologyPatients;
