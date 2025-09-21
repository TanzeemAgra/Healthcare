import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Button, Table, Modal, Form,
  Badge, Spinner, Alert, Nav, Tab, ProgressBar, Dropdown,
  InputGroup, Accordion, ListGroup
} from 'react-bootstrap';
import {
  FaUser, FaFileAlt, FaStethoscope, FaClipboardList,
  FaFlask, FaChartLine, FaUpload, FaDownload, FaEye, FaEdit,
  FaTrash, FaPlus, FaSearch, FaFilter, FaSync, FaExclamationTriangle,
  FaClock, FaCalendarAlt, FaUserMd, FaShieldAlt, FaDatabase,
  FaCamera, FaBrain, FaHeart, FaSun, FaMicroscope
} from 'react-icons/fa';

import { 
  DERMATOLOGY_S3_CONFIG, 
  getDermatologyConfig, 
  getValidationRules,
  getStatusOptions,
  getSkinTypes,
  getConditions,
  getSeverityLevels
} from '../../config/dermatologyS3Config';

const DermatologyS3DataManager = () => {
  // Configuration-driven state management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Data states using soft coding
  const [institutions, setInstitutions] = useState([]);
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [skinPhotos, setSkinPhotos] = useState([]);
  const [pathologyReports, setPathologyReports] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  
  // Modal states driven by configuration
  const [modals, setModals] = useState({
    institution: false,
    patient: false,
    consultation: false,
    treatment: false,
    skinPhoto: false,
    pathology: false,
    aiAnalysis: false
  });
  
  // Form states using configuration templates
  const [institutionForm, setInstitutionForm] = useState({
    name: '', code: '', address: '', phone: '', email: '', website: '',
    license_number: '', accreditation: '', storage_quota_gb: 1000, 
    specialties: ['dermatology'], department_count: 1
  });
  
  const [patientForm, setPatientForm] = useState(() => ({
    ...DERMATOLOGY_S3_CONFIG.sampleData.patient,
    institution_id: '', patient_code: '', address: '',
    emergency_contact_name: '', emergency_contact_phone: '',
    allergies: '', chronic_conditions: '', current_medications: '',
    insurance_provider: '', insurance_number: '', height_cm: '', weight_kg: '',
    condition: '', severity: '', affected_areas: '', symptoms_duration: '',
    previous_treatments: '', family_history_skin: '', occupation: '',
    lifestyle_factors: '', sun_exposure: '', skincare_routine: ''
  }));
  
  const [consultationForm, setConsultationForm] = useState(() => ({
    ...DERMATOLOGY_S3_CONFIG.sampleData.consultation,
    patient_id: '', history_present_illness: '', examination_findings: '',
    dermatological_examination: '', differential_diagnosis: '',
    recommended_tests: '', follow_up_plan: '', skin_photos_taken: false,
    biopsy_performed: false, allergy_testing: false
  }));
  
  const [treatmentForm, setTreatmentForm] = useState({
    patient_id: '', condition: '', treatment_type: '', start_date: '',
    end_date: '', description: '', instructions: '', medications: '',
    follow_up_frequency: '', expected_outcome: '', side_effects: '',
    contraindications: '', cost_estimate: '', insurance_coverage: ''
  });

  const [skinPhotoForm, setSkinPhotoForm] = useState({
    patient_id: '', photo_date: '', body_area: '', condition: '',
    severity: '', photo_type: 'clinical', description: '', 
    photographer: '', camera_settings: '', lighting_conditions: '',
    consent_obtained: false, ai_analysis_requested: false
  });

  const [aiAnalysisForm, setAiAnalysisForm] = useState({
    photo_id: '', model_selected: '', analysis_type: '',
    confidence_threshold: 0.7, include_recommendations: true,
    compare_previous: false, generate_report: true
  });

  // Filter and search states
  const [filters, setFilters] = useState({
    searchTerm: '',
    condition: '',
    severity: '',
    status: '',
    dateRange: { start: '', end: '' },
    skinType: '',
    ageRange: { min: '', max: '' }
  });

  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Configuration-driven API base URL
  const API_BASE = DERMATOLOGY_S3_CONFIG.api.baseUrl;

  // Utility functions with soft coding
  const showAlert = (message, type = 'success') => {
    const duration = DERMATOLOGY_S3_CONFIG.component.toastDuration;
    if (type === 'success') {
      setSuccess(message);
      setError(null);
    } else {
      setError(message);
      setSuccess(null);
    }
    setTimeout(() => {
      setSuccess(null);
      setError(null);
    }, duration);
  };

  const toggleModal = (modalName, show = null) => {
    setModals(prev => ({
      ...prev,
      [modalName]: show !== null ? show : !prev[modalName]
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatFileSize = (sizeInMB) => {
    if (sizeInMB < 1) return `${(sizeInMB * 1024).toFixed(1)} KB`;
    if (sizeInMB < 1024) return `${sizeInMB.toFixed(1)} MB`;
    return `${(sizeInMB / 1024).toFixed(1)} GB`;
  };

  const getStatusBadgeVariant = (status, type = 'patient') => {
    const statusConfig = getStatusOptions(type);
    const statusObj = statusConfig.find(s => s.value === status);
    return statusObj ? statusObj.color : 'secondary';
  };

  const getSeverityBadgeVariant = (severity) => {
    const severityConfig = getSeverityLevels();
    const severityObj = severityConfig.find(s => s.value === severity);
    return severityObj ? severityObj.color : 'secondary';
  };

  // Validation function using configuration
  const validateForm = (formData, entityType) => {
    const rules = getValidationRules(entityType);
    const errors = {};

    // Check required fields
    if (rules.required) {
      rules.required.forEach(field => {
        if (!formData[field] || formData[field].toString().trim() === '') {
          errors[field] = `${field.replace('_', ' ')} is required`;
        }
      });
    }

    // Check patterns
    if (rules.patterns) {
      Object.entries(rules.patterns).forEach(([field, pattern]) => {
        if (formData[field] && !pattern.test(formData[field])) {
          errors[field] = `Invalid ${field.replace('_', ' ')} format`;
        }
      });
    }

    // Check lengths
    if (rules.lengths) {
      Object.entries(rules.lengths).forEach(([field, { min, max }]) => {
        if (formData[field]) {
          const length = formData[field].toString().length;
          if (length < min) {
            errors[field] = `${field.replace('_', ' ')} must be at least ${min} characters`;
          }
          if (length > max) {
            errors[field] = `${field.replace('_', ' ')} must be less than ${max} characters`;
          }
        }
      });
    }

    return errors;
  };

  // API functions using configuration
  const apiCall = async (endpoint, options = {}) => {
    const { method = 'GET', data = null, params = {} } = options;
    const config = DERMATOLOGY_S3_CONFIG.api;
    
    try {
      setLoading(true);
      const url = new URL(`${API_BASE}${endpoint}`, window.location.origin);
      
      // Add query parameters
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });

      const fetchOptions = {
        method,
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers as needed
        },
        ...(data && { body: JSON.stringify(data) })
      };

      const response = await fetch(url, fetchOptions);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (err) {
      showAlert(err.message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchInstitutions = () => 
    apiCall(DERMATOLOGY_S3_CONFIG.api.endpoints.institutions);

  const fetchPatients = (institutionId, filters = {}) => 
    apiCall(DERMATOLOGY_S3_CONFIG.api.endpoints.patients, { 
      params: { institution: institutionId, ...filters } 
    });

  const fetchPatientData = async (patientId) => {
    const endpoints = DERMATOLOGY_S3_CONFIG.api.endpoints;
    
    try {
      const [
        recordsData, consultationsData, treatmentData, 
        photosData, pathologyData
      ] = await Promise.all([
        apiCall(endpoints.medicalRecords, { params: { patient: patientId } }),
        apiCall(endpoints.consultations, { params: { patient: patientId } }),
        apiCall(endpoints.treatmentPlans, { params: { patient: patientId } }),
        apiCall(endpoints.skinPhotos, { params: { patient: patientId } }),
        apiCall(endpoints.pathologyReports, { params: { patient: patientId } })
      ]);

      setMedicalRecords(recordsData.results || recordsData);
      setConsultations(consultationsData.results || consultationsData);
      setTreatmentPlans(treatmentData.results || treatmentData);
      setSkinPhotos(photosData.results || photosData);
      setPathologyReports(pathologyData.results || pathologyData);
    } catch (err) {
      showAlert('Failed to fetch patient data', 'error');
    }
  };

  const fetchAnalytics = () =>
    apiCall(DERMATOLOGY_S3_CONFIG.api.endpoints.analytics);

  // CRUD operations using soft coding
  const createEntity = async (entityType, formData) => {
    const endpoints = DERMATOLOGY_S3_CONFIG.api.endpoints;
    const endpointMap = {
      institution: endpoints.institutions,
      patient: endpoints.patients,
      consultation: endpoints.consultations,
      treatment: endpoints.treatmentPlans,
      skinPhoto: endpoints.skinPhotos,
      pathology: endpoints.pathologyReports
    };

    try {
      const errors = validateForm(formData, entityType);
      if (Object.keys(errors).length > 0) {
        showAlert('Please fix validation errors', 'error');
        return { success: false, errors };
      }

      const result = await apiCall(endpointMap[entityType], {
        method: 'POST',
        data: formData
      });

      showAlert(`${entityType} created successfully`);
      toggleModal(entityType, false);
      
      // Refresh data based on entity type
      if (entityType === 'institution') {
        await fetchInstitutions();
      } else if (entityType === 'patient') {
        await fetchPatients(selectedInstitution?.id);
      } else if (selectedPatient) {
        await fetchPatientData(selectedPatient.id);
      }

      return { success: true, data: result };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateEntity = async (entityType, id, formData) => {
    const endpoints = DERMATOLOGY_S3_CONFIG.api.endpoints;
    const endpointMap = {
      institution: endpoints.institutions,
      patient: endpoints.patients,
      consultation: endpoints.consultations,
      treatment: endpoints.treatmentPlans,
      skinPhoto: endpoints.skinPhotos,
      pathology: endpoints.pathologyReports
    };

    try {
      const errors = validateForm(formData, entityType);
      if (Object.keys(errors).length > 0) {
        showAlert('Please fix validation errors', 'error');
        return { success: false, errors };
      }

      const result = await apiCall(`${endpointMap[entityType]}${id}/`, {
        method: 'PUT',
        data: formData
      });

      showAlert(`${entityType} updated successfully`);
      toggleModal(entityType, false);
      
      // Refresh data
      if (entityType === 'institution') {
        await fetchInstitutions();
      } else if (entityType === 'patient') {
        await fetchPatients(selectedInstitution?.id);
      } else if (selectedPatient) {
        await fetchPatientData(selectedPatient.id);
      }

      return { success: true, data: result };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteEntity = async (entityType, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    const endpoints = DERMATOLOGY_S3_CONFIG.api.endpoints;
    const endpointMap = {
      institution: endpoints.institutions,
      patient: endpoints.patients,
      consultation: endpoints.consultations,
      treatment: endpoints.treatmentPlans,
      skinPhoto: endpoints.skinPhotos,
      pathology: endpoints.pathologyReports
    };

    try {
      await apiCall(`${endpointMap[entityType]}${id}/`, { method: 'DELETE' });
      showAlert(`${entityType} deleted successfully`);
      
      // Refresh data
      if (entityType === 'institution') {
        await fetchInstitutions();
      } else if (entityType === 'patient') {
        await fetchPatients(selectedInstitution?.id);
      } else if (selectedPatient) {
        await fetchPatientData(selectedPatient.id);
      }
    } catch (err) {
      showAlert(`Failed to delete ${entityType}`, 'error');
    }
  };

  // File upload with progress tracking
  const handleFileUpload = async (file, entityType, entityId) => {
    const config = DERMATOLOGY_S3_CONFIG.component;
    
    if (file.size > config.uploadMaxSize) {
      showAlert(`File size exceeds ${formatFileSize(config.uploadMaxSize / (1024 * 1024))} limit`, 'error');
      return;
    }

    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!config.allowedFileTypes.includes(fileExtension)) {
      showAlert(`File type ${fileExtension} not allowed`, 'error');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('entity_type', entityType);
      formData.append('entity_id', entityId);

      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setUploadProgress(percentComplete);
        }
      });

      xhr.onload = () => {
        if (xhr.status === 200) {
          showAlert('File uploaded successfully');
          setUploadProgress(0);
          if (selectedPatient) {
            fetchPatientData(selectedPatient.id);
          }
        } else {
          showAlert('Upload failed', 'error');
        }
      };

      xhr.open('POST', `${API_BASE}${DERMATOLOGY_S3_CONFIG.api.endpoints.upload}`);
      xhr.send(formData);
    } catch (err) {
      showAlert('Upload failed', 'error');
      setUploadProgress(0);
    }
  };

  // AI Analysis function
  const performAIAnalysis = async (photoId, analysisConfig) => {
    try {
      const result = await apiCall('/ai-analysis/', {
        method: 'POST',
        data: {
          photo_id: photoId,
          ...analysisConfig
        }
      });

      showAlert('AI analysis completed successfully');
      return result;
    } catch (err) {
      showAlert('AI analysis failed', 'error');
      return null;
    }
  };

  // Component lifecycle
  useEffect(() => {
    fetchInstitutions().then(data => {
      setInstitutions(data.results || data);
    }).catch(() => {
      // Fallback to demo data
      setInstitutions([
        {
          id: 1,
          name: 'City Dermatology Center',
          code: 'CDC001',
          address: '123 Medical Plaza',
          phone: '+1-555-0123',
          email: 'info@citydermatology.com',
          storage_used_gb: 45.2,
          storage_quota_gb: 1000,
          patient_count: 2156
        }
      ]);
    });

    fetchAnalytics().then(data => {
      setAnalytics(data);
    }).catch(() => {
      // Fallback to demo analytics
      setAnalytics({
        total_patients: 2156,
        active_treatments: 456,
        consultations_this_month: 234,
        skin_photos_analyzed: 1834,
        ai_analyses_performed: 892,
        top_conditions: [
          { condition: 'Acne', count: 456 },
          { condition: 'Eczema', count: 234 },
          { condition: 'Psoriasis', count: 123 }
        ]
      });
    });
  }, []);

  // Render dashboard with analytics
  const renderDashboard = () => {
    const config = DERMATOLOGY_S3_CONFIG;
    
    return (
      <div>
        <Row className="mb-4">
          <Col lg={3} md={6} className="mb-3">
            <Card className="border-start border-primary border-4">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <h6 className="text-muted text-uppercase mb-1">Total Patients</h6>
                    <h4 className="mb-0">{analytics?.total_patients || 0}</h4>
                  </div>
                  <div className="text-primary">
                    <FaUser size={32} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={3} md={6} className="mb-3">
            <Card className="border-start border-success border-4">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <h6 className="text-muted text-uppercase mb-1">Active Treatments</h6>
                    <h4 className="mb-0">{analytics?.active_treatments || 0}</h4>
                  </div>
                  <div className="text-success">
                    <FaStethoscope size={32} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={3} md={6} className="mb-3">
            <Card className="border-start border-warning border-4">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <h6 className="text-muted text-uppercase mb-1">Consultations</h6>
                    <h4 className="mb-0">{analytics?.consultations_this_month || 0}</h4>
                  </div>
                  <div className="text-warning">
                    <FaCalendarAlt size={32} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={3} md={6} className="mb-3">
            <Card className="border-start border-info border-4">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <h6 className="text-muted text-uppercase mb-1">AI Analyses</h6>
                    <h4 className="mb-0">{analytics?.ai_analyses_performed || 0}</h4>
                  </div>
                  <div className="text-info">
                    <FaBrain size={32} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col lg={8}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">
                  <FaChartLine className="me-2" />
                  Top Dermatological Conditions
                </h5>
              </Card.Header>
              <Card.Body>
                {analytics?.top_conditions?.map((item, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                    <span>{item.condition}</span>
                    <div className="d-flex align-items-center">
                      <ProgressBar 
                        variant="primary" 
                        now={(item.count / analytics.total_patients) * 100} 
                        style={{ width: '100px', marginRight: '10px' }}
                      />
                      <Badge bg="primary">{item.count}</Badge>
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">
                  <FaShieldAlt className="me-2" />
                  System Status
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <small className="text-muted">Storage Usage</small>
                  <ProgressBar 
                    variant="success" 
                    now={75} 
                    label="75%" 
                    className="mb-2"
                  />
                </div>
                <div className="mb-3">
                  <small className="text-muted">AI Model Accuracy</small>
                  <ProgressBar 
                    variant="info" 
                    now={94} 
                    label="94%" 
                    className="mb-2"
                  />
                </div>
                <div className="mb-3">
                  <small className="text-muted">System Uptime</small>
                  <ProgressBar 
                    variant="success" 
                    now={99.9} 
                    label="99.9%" 
                    className="mb-2"
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  // Render institutions list
  const renderInstitutions = () => (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5>
          <FaDatabase className="me-2" />
          Medical Institutions
        </h5>
        <Button 
          variant="primary" 
          onClick={() => toggleModal('institution', true)}
        >
          <FaPlus className="me-2" />
          Add Institution
        </Button>
      </div>

      <Card>
        <Card.Body className="p-0">
          <Table striped hover responsive>
            <thead className="table-dark">
              <tr>
                <th>Institution</th>
                <th>Code</th>
                <th>Contact</th>
                <th>Patients</th>
                <th>Storage Usage</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {institutions.map((institution) => (
                <tr key={institution.id}>
                  <td>
                    <strong>{institution.name}</strong>
                    <br />
                    <small className="text-muted">{institution.address}</small>
                  </td>
                  <td>
                    <Badge bg="secondary">{institution.code}</Badge>
                  </td>
                  <td>
                    <div>
                      <small>📞 {institution.phone}</small>
                      <br />
                      <small>✉️ {institution.email}</small>
                    </div>
                  </td>
                  <td>
                    <Badge bg="primary">{institution.patient_count || 0}</Badge>
                  </td>
                  <td>
                    <div style={{ width: '120px' }}>
                      <ProgressBar 
                        variant="info" 
                        now={(institution.storage_used_gb / institution.storage_quota_gb) * 100}
                        className="mb-1"
                      />
                      <small className="text-muted">
                        {formatFileSize(institution.storage_used_gb)} / {formatFileSize(institution.storage_quota_gb)}
                      </small>
                    </div>
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-success"
                      className="me-1"
                      onClick={() => {
                        setSelectedInstitution(institution);
                        fetchPatients(institution.id).then(data => {
                          setPatients(data.results || data);
                          setActiveTab('patients');
                        });
                      }}
                    >
                      <FaEye />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      className="me-1"
                      onClick={() => {
                        setInstitutionForm(institution);
                        toggleModal('institution', true);
                      }}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => deleteEntity('institution', institution.id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );

  // Render patients list with advanced filtering
  const renderPatients = () => (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5>
          <FaUser className="me-2" />
          Dermatology Patients
          {selectedInstitution && (
            <Badge bg="secondary" className="ms-2">
              {selectedInstitution.name}
            </Badge>
          )}
        </h5>
        <div>
          <Button 
            variant="outline-secondary" 
            className="me-2"
            onClick={() => setActiveTab('institutions')}
          >
            <FaDatabase className="me-1" />
            Change Institution
          </Button>
          <Button 
            variant="primary"
            onClick={() => toggleModal('patient', true)}
            disabled={!selectedInstitution}
          >
            <FaPlus className="me-2" />
            Add Patient
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      <Card className="mb-4">
        <Card.Header>
          <h6 className="mb-0">
            <FaFilter className="me-2" />
            Advanced Filters
          </h6>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Search</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search patients..."
                    value={filters.searchTerm}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Condition</Form.Label>
                <Form.Select
                  value={filters.condition}
                  onChange={(e) => setFilters(prev => ({ ...prev, condition: e.target.value }))}
                >
                  <option value="">All Conditions</option>
                  {getConditions().map(condition => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Severity</Form.Label>
                <Form.Select
                  value={filters.severity}
                  onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
                >
                  <option value="">All Severities</option>
                  {getSeverityLevels().map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Skin Type</Form.Label>
                <Form.Select
                  value={filters.skinType}
                  onChange={(e) => setFilters(prev => ({ ...prev, skinType: e.target.value }))}
                >
                  <option value="">All Skin Types</option>
                  {getSkinTypes().map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body className="p-0">
          <Table striped hover responsive>
            <thead className="table-dark">
              <tr>
                <th>Patient</th>
                <th>Condition</th>
                <th>Severity</th>
                <th>Skin Type</th>
                <th>Last Visit</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td>
                    <div>
                      <strong>{patient.first_name} {patient.last_name}</strong>
                      <br />
                      <small className="text-muted">
                        {patient.patient_code} • Age: {patient.age || 'N/A'}
                      </small>
                    </div>
                  </td>
                  <td>
                    <Badge bg="info">{patient.condition || 'Not specified'}</Badge>
                  </td>
                  <td>
                    <Badge bg={getSeverityBadgeVariant(patient.severity)}>
                      {patient.severity || 'N/A'}
                    </Badge>
                  </td>
                  <td>
                    <small>{getSkinTypes().find(t => t.value === patient.skin_type)?.label || 'N/A'}</small>
                  </td>
                  <td>
                    <small>
                      {patient.last_visit_date ? formatDate(patient.last_visit_date) : 'No visits'}
                    </small>
                  </td>
                  <td>
                    <Badge bg={getStatusBadgeVariant(patient.status, 'patient')}>
                      {patient.status || 'active'}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-success"
                      className="me-1"
                      onClick={() => {
                        setSelectedPatient(patient);
                        fetchPatientData(patient.id);
                        setActiveTab('medical-records');
                      }}
                    >
                      <FaEye />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      className="me-1"
                      onClick={() => {
                        setPatientForm(patient);
                        toggleModal('patient', true);
                      }}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => deleteEntity('patient', patient.id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );

  // Continue with other render functions...
  const renderMedicalRecords = () => (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5>
          <FaFileAlt className="me-2" />
          Medical Records
          {selectedPatient && (
            <Badge bg="secondary" className="ms-2">
              {selectedPatient.first_name} {selectedPatient.last_name}
            </Badge>
          )}
        </h5>
        <div>
          <Button 
            variant="outline-secondary" 
            className="me-2"
            onClick={() => setActiveTab('patients')}
          >
            <FaUser className="me-1" />
            Back to Patients
          </Button>
          <Dropdown>
            <Dropdown.Toggle variant="primary">
              <FaPlus className="me-1" />
              Add Record
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => toggleModal('consultation', true)}>
                <FaStethoscope className="me-2" />
                New Consultation
              </Dropdown.Item>
              <Dropdown.Item onClick={() => toggleModal('treatment', true)}>
                <FaClipboardList className="me-2" />
                Treatment Plan
              </Dropdown.Item>
              <Dropdown.Item onClick={() => toggleModal('skinPhoto', true)}>
                <FaCamera className="me-2" />
                Skin Photo
              </Dropdown.Item>
              <Dropdown.Item onClick={() => toggleModal('pathology', true)}>
                <FaMicroscope className="me-2" />
                Pathology Report
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {selectedPatient && (
        <>
          {/* Patient Summary Card */}
          <Card className="mb-4">
            <Card.Header>
              <h6 className="mb-0">Patient Summary</h6>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <strong>Name:</strong> {selectedPatient.first_name} {selectedPatient.last_name}
                </Col>
                <Col md={3}>
                  <strong>DOB:</strong> {formatDate(selectedPatient.date_of_birth)}
                </Col>
                <Col md={3}>
                  <strong>Skin Type:</strong> {getSkinTypes().find(t => t.value === selectedPatient.skin_type)?.label}
                </Col>
                <Col md={3}>
                  <strong>Primary Condition:</strong> {selectedPatient.condition}
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Tabbed Records View */}
          <Tab.Container defaultActiveKey="consultations">
            <Nav variant="pills" className="mb-4">
              <Nav.Item>
                <Nav.Link eventKey="consultations">
                  <FaStethoscope className="me-2" />
                  Consultations ({consultations.length})
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="treatments">
                  <FaClipboardList className="me-2" />
                  Treatments ({treatmentPlans.length})
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="photos">
                  <FaCamera className="me-2" />
                  Skin Photos ({skinPhotos.length})
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="pathology">
                  <FaMicroscope className="me-2" />
                  Pathology ({pathologyReports.length})
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="consultations">
                <Card>
                  <Card.Body className="p-0">
                    <Table striped hover responsive>
                      <thead className="table-dark">
                        <tr>
                          <th>Date</th>
                          <th>Type</th>
                          <th>Chief Complaint</th>
                          <th>Duration</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {consultations.map((consultation) => (
                          <tr key={consultation.id}>
                            <td>{formatDate(consultation.consultation_date)}</td>
                            <td>
                              <Badge bg="primary">{consultation.consultation_type}</Badge>
                            </td>
                            <td>{consultation.chief_complaint}</td>
                            <td>{consultation.duration_minutes} min</td>
                            <td>
                              <Badge bg={getStatusBadgeVariant(consultation.status, 'consultation')}>
                                {consultation.status}
                              </Badge>
                            </td>
                            <td>
                              <Button size="sm" variant="outline-success" className="me-1">
                                <FaEye />
                              </Button>
                              <Button size="sm" variant="outline-primary" className="me-1">
                                <FaEdit />
                              </Button>
                              <Button size="sm" variant="outline-danger">
                                <FaTrash />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Tab.Pane>

              <Tab.Pane eventKey="treatments">
                <Card>
                  <Card.Body className="p-0">
                    <Table striped hover responsive>
                      <thead className="table-dark">
                        <tr>
                          <th>Condition</th>
                          <th>Treatment Type</th>
                          <th>Start Date</th>
                          <th>Duration</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {treatmentPlans.map((treatment) => (
                          <tr key={treatment.id}>
                            <td>{treatment.condition}</td>
                            <td>
                              <Badge bg="info">{treatment.treatment_type}</Badge>
                            </td>
                            <td>{formatDate(treatment.start_date)}</td>
                            <td>
                              {treatment.end_date ? 
                                `${Math.ceil((new Date(treatment.end_date) - new Date(treatment.start_date)) / (1000 * 60 * 60 * 24))} days` : 
                                'Ongoing'
                              }
                            </td>
                            <td>
                              <Badge bg={getStatusBadgeVariant(treatment.status, 'treatment')}>
                                {treatment.status}
                              </Badge>
                            </td>
                            <td>
                              <Button size="sm" variant="outline-success" className="me-1">
                                <FaEye />
                              </Button>
                              <Button size="sm" variant="outline-primary" className="me-1">
                                <FaEdit />
                              </Button>
                              <Button size="sm" variant="outline-danger">
                                <FaTrash />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Tab.Pane>

              <Tab.Pane eventKey="photos">
                <Row>
                  {skinPhotos.map((photo) => (
                    <Col md={4} key={photo.id} className="mb-4">
                      <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center">
                          <small>{formatDate(photo.photo_date)}</small>
                          <Badge bg={getSeverityBadgeVariant(photo.severity)}>
                            {photo.severity}
                          </Badge>
                        </Card.Header>
                        <Card.Body>
                          <div className="text-center mb-3">
                            <FaCamera size={64} className="text-muted" />
                          </div>
                          <p><strong>Area:</strong> {photo.body_area}</p>
                          <p><strong>Condition:</strong> {photo.condition}</p>
                          <p><small>{photo.description}</small></p>
                          <div className="d-flex justify-content-between">
                            <Button size="sm" variant="outline-primary">
                              <FaEye className="me-1" />
                              View
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline-success"
                              onClick={() => {
                                setAiAnalysisForm(prev => ({ ...prev, photo_id: photo.id }));
                                toggleModal('aiAnalysis', true);
                              }}
                            >
                              <FaBrain className="me-1" />
                              AI Analysis
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                  
                  {/* Upload New Photo Card */}
                  <Col md={4} className="mb-4">
                    <Card className="h-100 d-flex align-items-center justify-content-center" style={{ minHeight: '300px', border: '2px dashed #dee2e6' }}>
                      <Card.Body className="text-center">
                        <FaUpload size={48} className="text-muted mb-3" />
                        <h6>Upload New Photo</h6>
                        <Button 
                          variant="outline-primary"
                          onClick={() => toggleModal('skinPhoto', true)}
                        >
                          <FaPlus className="me-1" />
                          Add Photo
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab.Pane>

              <Tab.Pane eventKey="pathology">
                <Card>
                  <Card.Body className="p-0">
                    <Table striped hover responsive>
                      <thead className="table-dark">
                        <tr>
                          <th>Report Date</th>
                          <th>Test Type</th>
                          <th>Specimen</th>
                          <th>Diagnosis</th>
                          <th>Pathologist</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pathologyReports.map((report) => (
                          <tr key={report.id}>
                            <td>{formatDate(report.report_date)}</td>
                            <td>
                              <Badge bg="secondary">{report.test_type}</Badge>
                            </td>
                            <td>{report.specimen_type}</td>
                            <td>{report.diagnosis}</td>
                            <td>{report.pathologist}</td>
                            <td>
                              <Button size="sm" variant="outline-success" className="me-1">
                                <FaEye />
                              </Button>
                              <Button size="sm" variant="outline-primary" className="me-1">
                                <FaDownload />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </>
      )}
    </div>
  );

  // Main render function
  return (
    <Container fluid>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            <FaUser className="me-3" style={{ color: DERMATOLOGY_S3_CONFIG.ui.theme.primary }} />
            Dermatology S3 Data Manager
          </h2>
          <p className="text-muted mb-0">
            Comprehensive dermatology data management with S3 integration and AI analysis
          </p>
        </div>
        <div>
          <Button variant="outline-secondary" className="me-2" onClick={() => window.location.reload()}>
            <FaSync className="me-1" />
            Refresh
          </Button>
          <Badge bg="success" className="me-2">
            {DERMATOLOGY_S3_CONFIG.aiAnalysis.enabled ? 'AI Enabled' : 'AI Disabled'}
          </Badge>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          <FaExclamationTriangle className="me-2" />
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
          ✅ {success}
        </Alert>
      )}

      {/* Navigation Tabs */}
      <Nav variant="pills" className="mb-4">
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')}
          >
            <FaChartLine className="me-2" />
            Dashboard
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'institutions'} 
            onClick={() => setActiveTab('institutions')}
          >
            <FaDatabase className="me-2" />
            Institutions
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'patients'} 
            onClick={() => setActiveTab('patients')}
            disabled={!selectedInstitution}
          >
            <FaUser className="me-2" />
            Patients
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'medical-records'} 
            onClick={() => setActiveTab('medical-records')}
            disabled={!selectedPatient}
          >
            <FaFileAlt className="me-2" />
            Medical Records
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Loading Spinner */}
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading...</p>
        </div>
      )}

      {/* Content */}
      {!loading && (
        <>
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'institutions' && renderInstitutions()}
          {activeTab === 'patients' && renderPatients()}
          {activeTab === 'medical-records' && renderMedicalRecords()}
        </>
      )}

      {/* Upload Progress */}
      {uploadProgress > 0 && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1050 }}>
          <Card style={{ width: '300px' }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Uploading...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <ProgressBar now={uploadProgress} variant="success" />
            </Card.Body>
          </Card>
        </div>
      )}

      {/* Modals will be added here - truncated for length */}
      {/* Institution Modal, Patient Modal, Consultation Modal, etc. */}

      {/* Institution Modal */}
      <Modal show={modals.institution} onHide={() => toggleModal('institution', false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaDatabase className="me-2" />
            {institutionForm.id ? 'Edit Institution' : 'Add New Institution'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Institution Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={institutionForm.name}
                    onChange={(e) => setInstitutionForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter institution name"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Institution Code *</Form.Label>
                  <Form.Control
                    type="text"
                    value={institutionForm.code}
                    onChange={(e) => setInstitutionForm(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="Enter institution code"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    value={institutionForm.address}
                    onChange={(e) => setInstitutionForm(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter full address"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    value={institutionForm.phone}
                    onChange={(e) => setInstitutionForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter phone number"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={institutionForm.email}
                    onChange={(e) => setInstitutionForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Storage Quota (GB)</Form.Label>
                  <Form.Control
                    type="number"
                    value={institutionForm.storage_quota_gb}
                    onChange={(e) => setInstitutionForm(prev => ({ ...prev, storage_quota_gb: parseInt(e.target.value) }))}
                    min="100"
                    max="10000"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Website</Form.Label>
                  <Form.Control
                    type="url"
                    value={institutionForm.website}
                    onChange={(e) => setInstitutionForm(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://example.com"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => toggleModal('institution', false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => createEntity('institution', institutionForm)}>
            {loading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
            {institutionForm.id ? 'Update' : 'Create'} Institution
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Patient Modal */}
      <Modal show={modals.patient} onHide={() => toggleModal('patient', false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaUser className="me-2" />
            {patientForm.id ? 'Edit Patient' : 'Add New Patient'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Basic Information</Accordion.Header>
                <Accordion.Body>
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>First Name *</Form.Label>
                        <Form.Control
                          type="text"
                          value={patientForm.first_name}
                          onChange={(e) => setPatientForm(prev => ({ ...prev, first_name: e.target.value }))}
                          placeholder="Enter first name"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Last Name *</Form.Label>
                        <Form.Control
                          type="text"
                          value={patientForm.last_name}
                          onChange={(e) => setPatientForm(prev => ({ ...prev, last_name: e.target.value }))}
                          placeholder="Enter last name"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Date of Birth *</Form.Label>
                        <Form.Control
                          type="date"
                          value={patientForm.date_of_birth}
                          onChange={(e) => setPatientForm(prev => ({ ...prev, date_of_birth: e.target.value }))}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email *</Form.Label>
                        <Form.Control
                          type="email"
                          value={patientForm.email}
                          onChange={(e) => setPatientForm(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Enter email address"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="tel"
                          value={patientForm.phone}
                          onChange={(e) => setPatientForm(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="Enter phone number"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="1">
                <Accordion.Header>Dermatological Profile</Accordion.Header>
                <Accordion.Body>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Skin Type</Form.Label>
                        <Form.Select
                          value={patientForm.skin_type}
                          onChange={(e) => setPatientForm(prev => ({ ...prev, skin_type: e.target.value }))}
                        >
                          <option value="">Select Skin Type</option>
                          {getSkinTypes().map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Primary Condition</Form.Label>
                        <Form.Select
                          value={patientForm.condition}
                          onChange={(e) => setPatientForm(prev => ({ ...prev, condition: e.target.value }))}
                        >
                          <option value="">Select Condition</option>
                          {getConditions().map(condition => (
                            <option key={condition} value={condition}>
                              {condition}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Known Allergies</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={patientForm.allergies}
                          onChange={(e) => setPatientForm(prev => ({ ...prev, allergies: e.target.value }))}
                          placeholder="List any known allergies..."
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Current Medications</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={patientForm.current_medications}
                          onChange={(e) => setPatientForm(prev => ({ ...prev, current_medications: e.target.value }))}
                          placeholder="List current medications..."
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="2">
                <Accordion.Header>Medical History</Accordion.Header>
                <Accordion.Body>
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Family History (Skin Conditions)</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={patientForm.family_history_skin}
                          onChange={(e) => setPatientForm(prev => ({ ...prev, family_history_skin: e.target.value }))}
                          placeholder="Describe family history of skin conditions..."
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Sun Exposure History</Form.Label>
                        <Form.Select
                          value={patientForm.sun_exposure}
                          onChange={(e) => setPatientForm(prev => ({ ...prev, sun_exposure: e.target.value }))}
                        >
                          <option value="">Select Sun Exposure Level</option>
                          <option value="minimal">Minimal (Indoor lifestyle)</option>
                          <option value="moderate">Moderate (Occasional outdoor)</option>
                          <option value="high">High (Frequent outdoor activities)</option>
                          <option value="extreme">Extreme (Outdoor occupation)</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Occupation</Form.Label>
                        <Form.Control
                          type="text"
                          value={patientForm.occupation}
                          onChange={(e) => setPatientForm(prev => ({ ...prev, occupation: e.target.value }))}
                          placeholder="Enter occupation"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => toggleModal('patient', false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => createEntity('patient', patientForm)}>
            {loading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
            {patientForm.id ? 'Update' : 'Create'} Patient
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Skin Photo Upload Modal */}
      <Modal show={modals.skinPhoto} onHide={() => toggleModal('skinPhoto', false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaCamera className="me-2" />
            Upload Skin Photo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Body Area *</Form.Label>
                  <Form.Select
                    value={skinPhotoForm.body_area}
                    onChange={(e) => setSkinPhotoForm(prev => ({ ...prev, body_area: e.target.value }))}
                  >
                    <option value="">Select Body Area</option>
                    <option value="face">Face</option>
                    <option value="neck">Neck</option>
                    <option value="chest">Chest</option>
                    <option value="back">Back</option>
                    <option value="arms">Arms</option>
                    <option value="legs">Legs</option>
                    <option value="hands">Hands</option>
                    <option value="feet">Feet</option>
                    <option value="scalp">Scalp</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Photo Type</Form.Label>
                  <Form.Select
                    value={skinPhotoForm.photo_type}
                    onChange={(e) => setSkinPhotoForm(prev => ({ ...prev, photo_type: e.target.value }))}
                  >
                    <option value="clinical">Clinical</option>
                    <option value="dermoscopy">Dermoscopy</option>
                    <option value="before_treatment">Before Treatment</option>
                    <option value="after_treatment">After Treatment</option>
                    <option value="follow_up">Follow Up</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Photo File *</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFiles(e.target.files)}
                    multiple={false}
                  />
                  <Form.Text className="text-muted">
                    Supported formats: JPG, PNG, TIFF. Max size: 50MB
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={skinPhotoForm.description}
                    onChange={(e) => setSkinPhotoForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the clinical findings, lesion characteristics, etc."
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Check
                  type="checkbox"
                  label="Patient consent obtained"
                  checked={skinPhotoForm.consent_obtained}
                  onChange={(e) => setSkinPhotoForm(prev => ({ ...prev, consent_obtained: e.target.checked }))}
                />
              </Col>
              <Col md={6}>
                <Form.Check
                  type="checkbox"
                  label="Request AI analysis"
                  checked={skinPhotoForm.ai_analysis_requested}
                  onChange={(e) => setSkinPhotoForm(prev => ({ ...prev, ai_analysis_requested: e.target.checked }))}
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => toggleModal('skinPhoto', false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              if (selectedFiles.length > 0 && selectedPatient) {
                handleFileUpload(selectedFiles[0], 'skin_photo', selectedPatient.id);
                toggleModal('skinPhoto', false);
              }
            }}
            disabled={!selectedFiles.length || !skinPhotoForm.consent_obtained}
          >
            {loading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
            Upload Photo
          </Button>
        </Modal.Footer>
      </Modal>

      {/* AI Analysis Modal */}
      <Modal show={modals.aiAnalysis} onHide={() => toggleModal('aiAnalysis', false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaBrain className="me-2" />
            AI Skin Analysis
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Analysis Type *</Form.Label>
                  <Form.Select
                    value={aiAnalysisForm.analysis_type}
                    onChange={(e) => setAiAnalysisForm(prev => ({ ...prev, analysis_type: e.target.value }))}
                  >
                    <option value="">Select Analysis Type</option>
                    <option value="lesion_detection">Lesion Detection</option>
                    <option value="cancer_screening">Cancer Screening</option>
                    <option value="acne_assessment">Acne Assessment</option>
                    <option value="pigmentation_analysis">Pigmentation Analysis</option>
                    <option value="texture_analysis">Texture Analysis</option>
                    <option value="comparative_analysis">Comparative Analysis</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>AI Model</Form.Label>
                  <Form.Select
                    value={aiAnalysisForm.model_selected}
                    onChange={(e) => setAiAnalysisForm(prev => ({ ...prev, model_selected: e.target.value }))}
                  >
                    <option value="dermatology_v2">Dermatology AI v2.1</option>
                    <option value="skin_cancer_detector">Skin Cancer Detector</option>
                    <option value="acne_analyzer">Acne Analyzer</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Confidence Threshold</Form.Label>
                  <Form.Range
                    min="0.1"
                    max="1.0"
                    step="0.1"
                    value={aiAnalysisForm.confidence_threshold}
                    onChange={(e) => setAiAnalysisForm(prev => ({ ...prev, confidence_threshold: parseFloat(e.target.value) }))}
                  />
                  <Form.Text className="text-muted">
                    Current: {(aiAnalysisForm.confidence_threshold * 100).toFixed(0)}%
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <div className="mt-3">
                  <Form.Check
                    type="checkbox"
                    label="Include treatment recommendations"
                    checked={aiAnalysisForm.include_recommendations}
                    onChange={(e) => setAiAnalysisForm(prev => ({ ...prev, include_recommendations: e.target.checked }))}
                    className="mb-2"
                  />
                  <Form.Check
                    type="checkbox"
                    label="Compare with previous photos"
                    checked={aiAnalysisForm.compare_previous}
                    onChange={(e) => setAiAnalysisForm(prev => ({ ...prev, compare_previous: e.target.checked }))}
                    className="mb-2"
                  />
                  <Form.Check
                    type="checkbox"
                    label="Generate detailed report"
                    checked={aiAnalysisForm.generate_report}
                    onChange={(e) => setAiAnalysisForm(prev => ({ ...prev, generate_report: e.target.checked }))}
                  />
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => toggleModal('aiAnalysis', false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              if (aiAnalysisForm.photo_id) {
                performAIAnalysis(aiAnalysisForm.photo_id, aiAnalysisForm);
                toggleModal('aiAnalysis', false);
              }
            }}
            disabled={!aiAnalysisForm.analysis_type}
          >
            {loading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
            Start Analysis
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DermatologyS3DataManager;
