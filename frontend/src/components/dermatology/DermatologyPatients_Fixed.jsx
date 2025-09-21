import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Form, InputGroup, Dropdown, Modal, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import apiClient from '../../services/api';
import { DERMATOLOGY_ENDPOINTS } from '../../services/apiConstants';

const DermatologyPatients = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCondition, setFilterCondition] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Form data for new patient
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    address: '',
    emergency_contact: '',
    emergency_phone: '',
    medical_history: '',
    allergies: '',
    current_medications: '',
    skin_type: '',
    primary_concern: '',
    condition: '',
    severity: '',
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

  // Load patients from API
  const loadPatients = async () => {
    try {
      setIsLoading(true);
      console.log('Loading patients from:', DERMATOLOGY_ENDPOINTS.PATIENTS);
      const response = await apiClient.get(DERMATOLOGY_ENDPOINTS.PATIENTS);
      console.log('API Response:', response);
      console.log('Patients data:', response.data);
      setPatients(response.data || []);
      setFilteredPatients(response.data || []);
    } catch (error) {
      console.error('Failed to load patients:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      toast.error('Failed to load patients');
      // Set empty array to clear any existing data
      setPatients([]);
      setFilteredPatients([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  // Filter patients based on search and filter criteria
  useEffect(() => {
    let filtered = patients;

    if (searchTerm) {
      filtered = filtered.filter(patient => {
        const patientName = patient.user?.first_name && patient.user?.last_name 
          ? `${patient.user.first_name} ${patient.user.last_name}`
          : patient.name || '';
        return patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               (patient.user?.phone_number || patient.phone || '').includes(searchTerm) ||
               (patient.condition || patient.primary_concern || '').toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    if (filterCondition) {
      filtered = filtered.filter(patient => 
        (patient.condition || patient.primary_concern || '').toLowerCase().includes(filterCondition.toLowerCase())
      );
    }

    if (filterSeverity) {
      filtered = filtered.filter(patient => 
        (patient.severity || 'Mild') === filterSeverity
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(patient => 
        (patient.status || 'Active') === filterStatus
      );
    }

    setFilteredPatients(filtered);
  }, [patients, searchTerm, filterCondition, filterSeverity, filterStatus]);

  const getSeverityBadge = (severity) => {
    const variants = {
      'Mild': 'success',
      'Moderate': 'warning',
      'Severe': 'danger'
    };
    return variants[severity] || 'secondary';
  };

  const getStatusBadge = (status) => {
    const variants = {
      'Active': 'primary',
      'Under Treatment': 'warning',
      'Stable': 'success',
      'Follow-up': 'info'
    };
    return variants[status] || 'secondary';
  };

  // Form handling functions
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.skin_type) newErrors.skin_type = 'Skin type is required';
    if (!formData.primary_concern.trim()) newErrors.primary_concern = 'Primary concern is required';
    if (!formData.consent_treatment) newErrors.consent_treatment = 'Treatment consent is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      date_of_birth: '',
      gender: '',
      address: '',
      emergency_contact: '',
      emergency_phone: '',
      medical_history: '',
      allergies: '',
      current_medications: '',
      skin_type: '',
      primary_concern: '',
      condition: '',
      severity: '',
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
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Submitting patient data:', formData);
      const response = await apiClient.post(DERMATOLOGY_ENDPOINTS.PATIENTS, formData);
      console.log('Patient created successfully:', response.data);
      
      toast.success('Patient added successfully!');
      setShowAddModal(false);
      resetForm();
      loadPatients(); // Reload the patients list
    } catch (error) {
      console.error('Failed to add patient:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      
      if (error.response?.data?.detail) {
        toast.error(`Failed to add patient: ${error.response.data.detail}`);
      } else if (error.response?.data) {
        // Handle validation errors
        const backendErrors = error.response.data;
        if (typeof backendErrors === 'object') {
          setErrors(backendErrors);
          toast.error('Please check the form for errors');
        } else {
          toast.error('Failed to add patient. Please try again.');
        }
      } else {
        toast.error('Failed to add patient. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    setShowModal(true);
  };

  const handleDeleteAllPatients = async () => {
    if (!window.confirm('Are you sure you want to delete ALL dermatology patients? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    try {
      console.log('Deleting all patients from:', DERMATOLOGY_ENDPOINTS.DELETE_ALL);
      const response = await apiClient.delete(DERMATOLOGY_ENDPOINTS.DELETE_ALL);
      console.log('Delete response:', response);
      
      toast.success('All patients deleted successfully!');
      setPatients([]);
      setFilteredPatients([]);
    } catch (error) {
      console.error('Failed to delete patients:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      toast.error('Failed to delete patients. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPatientRow = (patient) => {
    // Handle different data structures from API
    const patientName = patient.user?.first_name && patient.user?.last_name 
      ? `${patient.user.first_name} ${patient.user.last_name}`
      : patient.name || 'Unknown Patient';
    const patientAge = patient.user?.age || patient.age || 'N/A';
    const patientGender = patient.user?.gender || patient.gender || 'N/A';
    const patientPhone = patient.user?.phone_number || patient.phone || 'N/A';
    const patientCondition = patient.condition || patient.primary_concern || 'General Consultation';
    const patientSeverity = patient.severity || 'Mild';
    const patientStatus = patient.status || 'Active';
    const lastVisit = patient.lastVisit || patient.created_at?.split('T')[0] || 'N/A';
    const nextAppointment = patient.nextAppointment || 'Not scheduled';
    
    return (
      <tr key={patient.id}>
        <td>
          <div className="d-flex align-items-center">
            <div className="avatar-circle bg-primary text-white me-3 d-flex align-items-center justify-content-center"
                 style={{width: '40px', height: '40px', borderRadius: '50%', fontSize: '14px', fontWeight: 'bold'}}>
              {patientName.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="fw-medium">{patientName}</div>
              <small className="text-muted">{patientAge} yrs, {patientGender}</small>
            </div>
          </div>
        </td>
        <td>
          <div>
            <span className="fw-medium">{patientCondition}</span>
            <br />
            <small className="text-muted">{patientPhone}</small>
          </div>
        </td>
        <td>
          <Badge bg={getSeverityBadge(patientSeverity)}>
            {patientSeverity}
          </Badge>
        </td>
        <td>
          <Badge bg={getStatusBadge(patientStatus)}>
            {patientStatus}
          </Badge>
        </td>
        <td>
          <span className="text-dark">{lastVisit}</span>
        </td>
        <td>
          <span className="text-primary fw-medium">{nextAppointment}</span>
        </td>
        <td>
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" size="sm" className="border-0">
              <i className="ri-more-line"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleViewDetails(patient)}>
                <i className="ri-eye-line me-2"></i>
                View Details
              </Dropdown.Item>
              <Dropdown.Item>
                <i className="ri-edit-line me-2"></i>
                Edit Patient
              </Dropdown.Item>
              <Dropdown.Item>
                <i className="ri-calendar-line me-2"></i>
                Schedule Appointment
              </Dropdown.Item>
              <Dropdown.Item>
                <i className="ri-file-text-line me-2"></i>
                Medical Records
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item className="text-danger">
                <i className="ri-delete-bin-line me-2"></i>
                Archive Patient
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    );
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3 mb-0">Dermatology Patients</h1>
            <div className="d-flex gap-2">
              <Button variant="primary" onClick={() => setShowAddModal(true)}>
                <i className="ri-add-line me-2"></i>
                Add New Patient
              </Button>
              <Button variant="outline-secondary" onClick={loadPatients} disabled={isLoading}>
                <i className="ri-refresh-line me-2"></i>
                Refresh
              </Button>
              <Button variant="outline-danger" onClick={handleDeleteAllPatients} disabled={isLoading}>
                <i className="ri-delete-bin-line me-2"></i>
                Delete All
              </Button>
              <Button variant="outline-primary">
                <i className="ri-download-line me-2"></i>
                Export
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>
              <i className="ri-search-line"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={2}>
          <Form.Select
            value={filterCondition}
            onChange={(e) => setFilterCondition(e.target.value)}
          >
            <option value="">All Conditions</option>
            <option value="Acne">Acne</option>
            <option value="Eczema">Eczema</option>
            <option value="Psoriasis">Psoriasis</option>
            <option value="Rosacea">Rosacea</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
          >
            <option value="">All Severities</option>
            <option value="Mild">Mild</option>
            <option value="Moderate">Moderate</option>
            <option value="Severe">Severe</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Under Treatment">Under Treatment</option>
            <option value="Stable">Stable</option>
            <option value="Follow-up">Follow-up</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <div className="text-muted small">
            {filteredPatients.length} of {patients.length} patients
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <div className="table-responsive">
                <Table striped hover>
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Condition & Phone</th>
                      <th>Severity</th>
                      <th>Status</th>
                      <th>Last Visit</th>
                      <th>Next Appointment</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          <Spinner animation="border" size="sm" className="me-2" />
                          Loading patients...
                        </td>
                      </tr>
                    ) : filteredPatients.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-4 text-muted">
                          <i className="ri-user-line fs-2 d-block mb-2"></i>
                          No patients found
                        </td>
                      </tr>
                    ) : (
                      filteredPatients.map(patient => renderPatientRow(patient))
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Patient Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Patient Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPatient && (
            <div>
              <h5>{selectedPatient.name}</h5>
              <p>Details about the selected patient will be shown here.</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add New Patient Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-user-add-line me-2"></i>
            Add New Dermatology Patient
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              {/* Basic Information */}
              <Col md={12}>
                <h5 className="text-primary mb-3">
                  <i className="ri-user-line me-2"></i>
                  Basic Information
                </h5>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    isInvalid={!!errors.first_name}
                    placeholder="Enter first name"
                  />
                  <Form.Control.Feedback type="invalid">{errors.first_name}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    isInvalid={!!errors.last_name}
                    placeholder="Enter last name"
                  />
                  <Form.Control.Feedback type="invalid">{errors.last_name}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    isInvalid={!!errors.email}
                    placeholder="Enter email address"
                  />
                  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    isInvalid={!!errors.phone}
                    placeholder="Enter phone number"
                  />
                  <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Date of Birth <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    isInvalid={!!errors.date_of_birth}
                  />
                  <Form.Control.Feedback type="invalid">{errors.date_of_birth}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Gender <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    isInvalid={!!errors.gender}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.gender}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Primary Skin Concern <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="primary_concern"
                    value={formData.primary_concern}
                    onChange={handleInputChange}
                    isInvalid={!!errors.primary_concern}
                    placeholder="Describe the main skin concern or reason for visit"
                  />
                  <Form.Control.Feedback type="invalid">{errors.primary_concern}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={12}>
                <div className="border rounded p-3 bg-light">
                  <Form.Check
                    type="checkbox"
                    name="consent_treatment"
                    checked={formData.consent_treatment}
                    onChange={handleInputChange}
                    isInvalid={!!errors.consent_treatment}
                    label="I consent to dermatological examination and treatment as recommended by the healthcare provider."
                  />
                  <Form.Control.Feedback type="invalid">{errors.consent_treatment}</Form.Control.Feedback>
                </div>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="outline-secondary" 
              onClick={() => {
                setShowAddModal(false);
                resetForm();
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Adding Patient...
                </>
              ) : (
                <>
                  <i className="ri-save-line me-2"></i>
                  Add Patient
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default DermatologyPatients;
