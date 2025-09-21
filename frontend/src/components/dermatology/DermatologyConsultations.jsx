import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Tab
} from 'react-bootstrap';
import apiClient from '../../services/api';
import { DERMATOLOGY_ENDPOINTS } from '../../services/apiConstants';

const DermatologyConsultations = () => {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingConsultation, setEditingConsultation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [backendOnline, setBackendOnline] = useState(true);

  const [formData, setFormData] = useState({
    patient_id: '',
    dermatologist_id: '',
    department_id: '',
    consultation_type: 'initial',
    scheduled_date: '',
    priority: 'normal',
    chief_complaint: '',
    history_of_present_illness: '',
    review_of_systems: '',
    physical_examination: '',
    assessment: '',
    plan: '',
    follow_up_instructions: '',
    next_appointment_recommended: '',
    consultation_notes: ''
  });

  const consultationTypes = [
    { value: 'initial', label: 'Initial Consultation' },
    { value: 'follow_up', label: 'Follow-up' },
    { value: 'screening', label: 'Skin Cancer Screening' },
    { value: 'cosmetic', label: 'Cosmetic Consultation' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'second_opinion', label: 'Second Opinion' }
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low', color: 'secondary' },
    { value: 'normal', label: 'Normal', color: 'primary' },
    { value: 'high', label: 'High', color: 'warning' },
    { value: 'urgent', label: 'Urgent', color: 'danger' },
    { value: 'emergent', label: 'Emergent', color: 'danger' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load data with error handling for each API call
      const loadPromises = [
        loadConsultations(),
        loadDepartments(),
        loadPatients(),
        loadDoctors()
      ];

      // Wait for all promises and handle individual failures gracefully
      await Promise.allSettled(loadPromises);

    } catch (err) {
      console.error('Unexpected error loading data:', err);
      setError('Failed to load dermatology data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadConsultations = async () => {
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    
    console.log('Loading consultations... Token present:', !!token);

    try {
      const response = await apiClient.get(DERMATOLOGY_ENDPOINTS.CONSULTATIONS);

      console.log('Consultations API response status:', response.status);

      if (response.status === 401) {
        // Handle 401 gracefully - fall back to demo mode
        console.log('Consultations API not available, using demo data');
        setBackendOnline(false);
        setConsultations(getDemoConsultations());
        return;
      }

      if (response.status === 500) {
        // Server error - might be due to missing data or database issues
        console.warn('Server error loading consultations, using demo data');
        setBackendOnline(false);
        setConsultations(getDemoConsultations());
        return;
      }

      if (!(response.status >= 200 && response.status < 300)) {
        const errorData = response.data || '';
        console.log('Error response data:', errorData);
        // Check if response is HTML (404 page) instead of JSON
        if (typeof errorData === 'string' && (errorData.includes('<!doctype') || errorData.includes('<html'))) {
          console.log('API endpoint not found, using demo data');
          setBackendOnline(false);
          setConsultations(getDemoConsultations());
          return;
        }
        console.log('Failed to load consultations, using demo data');
        setBackendOnline(false);
        setConsultations(getDemoConsultations());
        return;
      }

      const data = response.data;
      console.log('Consultations data loaded:', data);
      setConsultations(data.results || data || []);
      setBackendOnline(true);
    } catch (fetchError) {
      console.log('Error in loadConsultations, using demo data:', fetchError);
      setBackendOnline(false);
      setConsultations(getDemoConsultations());
    }
  };

  const loadDepartments = async () => {
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');

    try {
  const response = await apiClient.get(DERMATOLOGY_ENDPOINTS.DEPARTMENTS);

      if (response.status === 401) {
        console.log('Departments API not available, using demo data');
        setDepartments(getDemoDepartments());
        return;
      }

      if (response.status === 500) {
        console.warn('Server error loading departments, using demo data');
        setDepartments(getDemoDepartments());
        return;
      }

      if (!(response.status >= 200 && response.status < 300)) {
        const errorData = response.data || '';
        if (typeof errorData === 'string' && (errorData.includes('<!doctype') || errorData.includes('<html'))) {
          console.log('Departments API endpoint not found, using demo data');
          setDepartments(getDemoDepartments());
          return;
        }
        console.log('Failed to load departments, using demo data');
        setDepartments(getDemoDepartments());
        return;
      }

      const data = response.data;
      setDepartments(data.results || data || []);
    } catch (fetchError) {
      console.log('Error loading departments, using demo data:', fetchError);
      setDepartments(getDemoDepartments());
    }
  };

  const loadPatients = async () => {
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');

    try {
  const response = await apiClient.get(DERMATOLOGY_ENDPOINTS.PATIENTS);

      if (response.status === 401) {
        console.log('Patients API not available, using demo data');
        setPatients(getDemoPatients());
        return;
      }

      if (response.status === 500) {
        console.warn('Server error loading patients, using demo data');
        setPatients(getDemoPatients());
        return;
      }

      if (!(response.status >= 200 && response.status < 300)) {
        const errorData = response.data || '';
        if (typeof errorData === 'string' && (errorData.includes('<!doctype') || errorData.includes('<html'))) {
          console.log('Patients API endpoint not found, using demo data');
          setPatients(getDemoPatients());
          return;
        }
        console.warn('Failed to load patients, using demo data');
        setPatients(getDemoPatients());
        return;
      }

      const data = response.data;
      setPatients(data.results || data || []);
    } catch (fetchError) {
      console.log('Error loading patients, using demo data:', fetchError);
      setPatients(getDemoPatients());
    }
  };

  const loadDoctors = async () => {
    // In a real application, you would have an endpoint for doctors
    // For now, we'll use a mock implementation
    try {
      setDoctors([
        { id: '1', first_name: 'Dr. Sarah', last_name: 'Johnson', full_name: 'Dr. Sarah Johnson' },
        { id: '2', first_name: 'Dr. Michael', last_name: 'Brown', full_name: 'Dr. Michael Brown' },
        { id: '3', first_name: 'Dr. Emily', last_name: 'Davis', full_name: 'Dr. Emily Davis' },
        { id: '4', first_name: 'Dr. James', last_name: 'Wilson', full_name: 'Dr. James Wilson' }
      ]);
    } catch (error) {
      console.warn('Error loading doctors:', error);
      setDoctors([]);
    }
  };

  // Demo data functions for offline mode
  const getDemoConsultations = () => {
    return [
      {
        id: 1,
        patient: {
          id: 1,
          user: { first_name: 'John', last_name: 'Doe' },
          age: 45,
          gender: 'Male'
        },
        dermatologist: {
          id: 1,
          user: { first_name: 'Dr. Sarah', last_name: 'Johnson' }
        },
        department: {
          id: 1,
          name: 'General Dermatology'
        },
        consultation_type: 'initial',
        scheduled_date: new Date().toISOString().split('T')[0],
        priority: 'normal',
        status: 'scheduled',
        chief_complaint: 'Skin rash on arms',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        patient: {
          id: 2,
          user: { first_name: 'Jane', last_name: 'Smith' },
          age: 32,
          gender: 'Female'
        },
        dermatologist: {
          id: 2,
          user: { first_name: 'Dr. Michael', last_name: 'Brown' }
        },
        department: {
          id: 2,
          name: 'Cosmetic Dermatology'
        },
        consultation_type: 'cosmetic',
        scheduled_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: 'low',
        status: 'scheduled',
        chief_complaint: 'Cosmetic consultation for acne scars',
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        patient: {
          id: 3,
          user: { first_name: 'Bob', last_name: 'Johnson' },
          age: 58,
          gender: 'Male'
        },
        dermatologist: {
          id: 3,
          user: { first_name: 'Dr. Emily', last_name: 'Davis' }
        },
        department: {
          id: 3,
          name: 'Dermatopathology'
        },
        consultation_type: 'screening',
        scheduled_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: 'high',
        status: 'completed',
        chief_complaint: 'Suspicious mole examination',
        created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
      }
    ];
  };

  const getDemoDepartments = () => {
    return [
      { id: 1, name: 'General Dermatology', code: 'GEN_DERM' },
      { id: 2, name: 'Cosmetic Dermatology', code: 'COS_DERM' },
      { id: 3, name: 'Dermatopathology', code: 'DERM_PATH' },
      { id: 4, name: 'Pediatric Dermatology', code: 'PED_DERM' },
      { id: 5, name: 'Dermatologic Surgery', code: 'DERM_SURG' }
    ];
  };

  const getDemoPatients = () => {
    return [
      {
        id: 1,
        user: { 
          first_name: 'John', 
          last_name: 'Doe',
          email: 'john.doe@demo.com'
        },
        age: 45,
        gender: 'Male',
        phone: '+1-555-0101'
      },
      {
        id: 2,
        user: { 
          first_name: 'Jane', 
          last_name: 'Smith',
          email: 'jane.smith@demo.com'
        },
        age: 32,
        gender: 'Female',
        phone: '+1-555-0102'
      },
      {
        id: 3,
        user: { 
          first_name: 'Bob', 
          last_name: 'Johnson',
          email: 'bob.johnson@demo.com'
        },
        age: 58,
        gender: 'Male',
        phone: '+1-555-0103'
      },
      {
        id: 4,
        user: { 
          first_name: 'Alice', 
          last_name: 'Brown',
          email: 'alice.brown@demo.com'
        },
        age: 28,
        gender: 'Female',
        phone: '+1-555-0104'
      }
    ];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingConsultation 
        ? `${DERMATOLOGY_ENDPOINTS.CONSULTATIONS}${editingConsultation.id}/`
        : DERMATOLOGY_ENDPOINTS.CONSULTATIONS;
      
      const submitData = {
        ...formData,
        created_by_id: localStorage.getItem('userId') // Assume we store user ID
      };

      if (editingConsultation) {
        await apiClient.put(url, submitData);
      } else {
        await apiClient.post(url, submitData);
      }

      await loadConsultations();
      handleCloseModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (consultation) => {
    setEditingConsultation(consultation);
    setFormData({
      patient_id: consultation.patient?.id || '',
      dermatologist_id: consultation.dermatologist?.id || '',
      department_id: consultation.department?.id || '',
      consultation_type: consultation.consultation_type || 'initial',
      scheduled_date: consultation.scheduled_date ? 
        new Date(consultation.scheduled_date).toISOString().slice(0, 16) : '',
      priority: consultation.priority || 'normal',
      chief_complaint: consultation.chief_complaint || '',
      history_of_present_illness: consultation.history_of_present_illness || '',
      review_of_systems: consultation.review_of_systems || '',
      physical_examination: consultation.physical_examination || '',
      assessment: consultation.assessment || '',
      plan: consultation.plan || '',
      follow_up_instructions: consultation.follow_up_instructions || '',
      next_appointment_recommended: consultation.next_appointment_recommended ?
        new Date(consultation.next_appointment_recommended).toISOString().slice(0, 16) : '',
      consultation_notes: consultation.consultation_notes || ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingConsultation(null);
    setFormData({
      patient_id: '',
      dermatologist_id: '',
      department_id: '',
      consultation_type: 'initial',
      scheduled_date: '',
      priority: 'normal',
      chief_complaint: '',
      history_of_present_illness: '',
      review_of_systems: '',
      physical_examination: '',
      assessment: '',
      plan: '',
      follow_up_instructions: '',
      next_appointment_recommended: '',
      consultation_notes: ''
    });
  };

  const handleStartConsultation = async (consultationId) => {
    try {
  await apiClient.post(DERMATOLOGY_ENDPOINTS.CONSULTATION_ACTIONS.START(consultationId));

      await loadConsultations();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCompleteConsultation = async (consultationId) => {
    try {
  await apiClient.post(DERMATOLOGY_ENDPOINTS.CONSULTATION_ACTIONS.COMPLETE(consultationId));

      await loadConsultations();
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'scheduled': { bg: 'primary', text: 'Scheduled' },
      'in_progress': { bg: 'warning', text: 'In Progress' },
      'completed': { bg: 'success', text: 'Completed' },
      'cancelled': { bg: 'danger', text: 'Cancelled' },
      'no_show': { bg: 'secondary', text: 'No Show' },
      'rescheduled': { bg: 'info', text: 'Rescheduled' }
    };

    const config = statusConfig[status] || { bg: 'secondary', text: status };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = priorityLevels.find(p => p.value === priority) || 
      { color: 'secondary', label: priority };
    return <Badge bg={priorityConfig.color}>{priorityConfig.label}</Badge>;
  };

  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = !searchTerm || 
      consultation.consultation_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.patient?.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.patient?.user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.chief_complaint?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filterStatus || consultation.status === filterStatus;
    
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'today' && new Date(consultation.scheduled_date).toDateString() === new Date().toDateString()) ||
      (activeTab === 'upcoming' && new Date(consultation.scheduled_date) > new Date() && consultation.status === 'scheduled') ||
      (activeTab === 'completed' && consultation.status === 'completed');

    return matchesSearch && matchesStatus && matchesTab;
  });

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading consultations...</p>
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
                <i className="ri-stethoscope-fill me-2 text-primary"></i>
                Dermatology Consultations
              </h2>
              <p className="text-muted mb-0">
                Manage patient consultations and appointments
              </p>
            </div>
            <Button 
              variant="primary" 
              onClick={() => setShowModal(true)}
            >
              <i className="ri-add-line me-2"></i>
              New Consultation
            </Button>
          </div>
        </Col>
      </Row>

      {/* Demo Mode Alert */}
      {!backendOnline && (
        <Row className="mb-4">
          <Col>
            <Alert variant="warning">
              <div className="d-flex align-items-center">
                <i className="ri-wifi-off-line me-2"></i>
                <div>
                  <strong>Demo Mode Active</strong> - Backend server is not running. 
                  Using demonstration data for dermatology consultations.
                </div>
              </div>
            </Alert>
          </Col>
        </Row>
      )}

      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="warning" dismissible onClose={() => setError(null)}>
              <Alert.Heading>
                <i className="ri-error-warning-line me-2"></i>
                Authentication Required
              </Alert.Heading>
              <p>{error}</p>
              <hr />
              <div className="d-flex justify-content-center gap-3">
                <Button variant="primary" href="/auth/sign-in">
                  <i className="ri-login-box-line me-2"></i>
                  Go to Login
                </Button>
                <Button variant="outline-secondary" onClick={() => window.location.reload()}>
                  <i className="ri-refresh-line me-2"></i>
                  Try Again
                </Button>
              </div>
              <hr />
              <small className="text-muted text-center d-block">
                <strong>Default Login Credentials:</strong><br />
                📧 Email: <code>info@xerxez.in</code><br />
                🔑 Password: <code>admin123</code>
              </small>
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
              placeholder="Search consultations..."
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
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No Show</option>
            <option value="rescheduled">Rescheduled</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Button 
            variant="outline-secondary" 
            onClick={loadData}
            disabled={loading}
          >
            <i className="ri-refresh-line me-2"></i>
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
        <Tab eventKey="all" title="All Consultations" />
        <Tab eventKey="today" title="Today" />
        <Tab eventKey="upcoming" title="Upcoming" />
        <Tab eventKey="completed" title="Completed" />
      </Tabs>

      {/* Consultations Table */}
      <Row>
        <Col>
          <Card>
            <Card.Body>
              {filteredConsultations.length > 0 ? (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Consultation #</th>
                      <th>Patient</th>
                      <th>Dermatologist</th>
                      <th>Department</th>
                      <th>Type</th>
                      <th>Scheduled Date</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Chief Complaint</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredConsultations.map((consultation) => (
                      <tr key={consultation.id}>
                        <td>
                          <code>{consultation.consultation_number}</code>
                        </td>
                        <td>
                          <div>
                            <strong>{consultation.patient?.user?.first_name} {consultation.patient?.user?.last_name}</strong>
                            <br />
                            <small className="text-muted">
                              MRN: {consultation.patient?.medical_record_number}
                            </small>
                          </div>
                        </td>
                        <td>
                          <i className="ri-user-heart-line me-1"></i>
                          {consultation.dermatologist?.first_name} {consultation.dermatologist?.last_name}
                        </td>
                        <td>{consultation.department?.name}</td>
                        <td>
                          <Badge bg="info">
                            {consultationTypes.find(t => t.value === consultation.consultation_type)?.label}
                          </Badge>
                        </td>
                        <td>
                          <div>
                            <i className="ri-calendar-line me-1"></i>
                            {new Date(consultation.scheduled_date).toLocaleDateString()}
                            <br />
                            <small className="text-muted">
                              <i className="ri-time-line me-1"></i>
                              {new Date(consultation.scheduled_date).toLocaleTimeString()}
                            </small>
                          </div>
                        </td>
                        <td>{getStatusBadge(consultation.status)}</td>
                        <td>{getPriorityBadge(consultation.priority)}</td>
                        <td>
                          <div style={{ maxWidth: '200px' }}>
                            {consultation.chief_complaint?.length > 50 
                              ? `${consultation.chief_complaint.substring(0, 50)}...`
                              : consultation.chief_complaint}
                          </div>
                        </td>
                        <td>
                          <Dropdown>
                            <Dropdown.Toggle variant="outline-secondary" size="sm">
                              Actions
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => handleEdit(consultation)}>
                                <i className="ri-edit-line me-2"></i>
                                Edit
                              </Dropdown.Item>
                              {consultation.status === 'scheduled' && (
                                <Dropdown.Item 
                                  onClick={() => handleStartConsultation(consultation.id)}
                                >
                                  <i className="ri-play-line me-2"></i>
                                  Start Consultation
                                </Dropdown.Item>
                              )}
                              {consultation.status === 'in_progress' && (
                                <Dropdown.Item 
                                  onClick={() => handleCompleteConsultation(consultation.id)}
                                >
                                  <i className="ri-stop-line me-2"></i>
                                  Complete Consultation
                                </Dropdown.Item>
                              )}
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
                  <i className="ri-stethoscope-fill me-2"></i>
                  No consultations found matching your criteria.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Create/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingConsultation ? 'Edit Consultation' : 'New Consultation'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Patient *</Form.Label>
                  <Form.Select
                    value={formData.patient_id}
                    onChange={(e) => setFormData({...formData, patient_id: e.target.value})}
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.user?.first_name} {patient.user?.last_name} - {patient.medical_record_number}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Dermatologist *</Form.Label>
                  <Form.Select
                    value={formData.dermatologist_id}
                    onChange={(e) => setFormData({...formData, dermatologist_id: e.target.value})}
                    required
                  >
                    <option value="">Select Dermatologist</option>
                    {doctors.map(doctor => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.full_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Department *</Form.Label>
                  <Form.Select
                    value={formData.department_id}
                    onChange={(e) => setFormData({...formData, department_id: e.target.value})}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Consultation Type *</Form.Label>
                  <Form.Select
                    value={formData.consultation_type}
                    onChange={(e) => setFormData({...formData, consultation_type: e.target.value})}
                    required
                  >
                    {consultationTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Scheduled Date & Time *</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={formData.scheduled_date}
                    onChange={(e) => setFormData({...formData, scheduled_date: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  >
                    {priorityLevels.map(priority => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Chief Complaint *</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.chief_complaint}
                onChange={(e) => setFormData({...formData, chief_complaint: e.target.value})}
                placeholder="Patient's main concern or reason for visit"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>History of Present Illness</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.history_of_present_illness}
                onChange={(e) => setFormData({...formData, history_of_present_illness: e.target.value})}
                placeholder="Detailed history of current condition"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Review of Systems</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.review_of_systems}
                onChange={(e) => setFormData({...formData, review_of_systems: e.target.value})}
                placeholder="Systematic review of body systems"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Physical Examination</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.physical_examination}
                onChange={(e) => setFormData({...formData, physical_examination: e.target.value})}
                placeholder="Physical examination findings"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Assessment</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.assessment}
                onChange={(e) => setFormData({...formData, assessment: e.target.value})}
                placeholder="Clinical assessment and diagnosis"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Plan</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.plan}
                onChange={(e) => setFormData({...formData, plan: e.target.value})}
                placeholder="Treatment plan and recommendations"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Follow-up Instructions</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={formData.follow_up_instructions}
                    onChange={(e) => setFormData({...formData, follow_up_instructions: e.target.value})}
                    placeholder="Patient instructions for follow-up"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Next Appointment Recommended</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={formData.next_appointment_recommended}
                    onChange={(e) => setFormData({...formData, next_appointment_recommended: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Consultation Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.consultation_notes}
                onChange={(e) => setFormData({...formData, consultation_notes: e.target.value})}
                placeholder="Additional notes and observations"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingConsultation ? 'Update Consultation' : 'Create Consultation'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default DermatologyConsultations;

