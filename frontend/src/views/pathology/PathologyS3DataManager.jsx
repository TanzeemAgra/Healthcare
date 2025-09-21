import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Modal, Alert, Badge, Spinner, ProgressBar, Tab, Tabs } from 'react-bootstrap';
import { toast } from 'react-toastify';
import pathologyS3Config from '../../config/pathologyS3Config';

const PathologyS3DataManager = () => {
  // State Management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [laboratories, setLaboratories] = useState([]);
  const [patients, setPatients] = useState([]);
  const [specimens, setSpecimens] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});
  
  // Modal States
  const [showLaboratoryModal, setShowLaboratoryModal] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showSpecimenModal, setShowSpecimenModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  
  // Form States
  const [laboratoryForm, setLaboratoryForm] = useState({});
  const [patientForm, setPatientForm] = useState({});
  const [specimenForm, setSpecimenForm] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState(null);

  // Configuration
  const config = pathologyS3Config;

  useEffect(() => {
    loadDashboardData();
  }, []);

  // API Functions
  const apiCall = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${config.api.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      toast.error(config.errorMessages.api.connectionError);
      throw error;
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [laboratoriesData, patientsData, specimensData, analyticsData] = await Promise.all([
        apiCall('/laboratories/').catch(() => []),
        apiCall('/patients/').catch(() => []),
        apiCall('/specimens/').catch(() => []),
        apiCall('/analytics/').catch(() => ({}))
      ]);
      
      setLaboratories(laboratoriesData);
      setPatients(patientsData);
      setSpecimens(specimensData);
      setDashboardStats(analyticsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Laboratory Management
  const handleCreateLaboratory = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const newLaboratory = await apiCall('/laboratories/', {
        method: 'POST',
        body: JSON.stringify(laboratoryForm)
      });
      
      setLaboratories([...laboratories, newLaboratory]);
      setShowLaboratoryModal(false);
      setLaboratoryForm({});
      toast.success(config.successMessages.laboratoryCreated);
    } catch (error) {
      toast.error('Failed to create laboratory');
    } finally {
      setLoading(false);
    }
  };

  // Patient Management
  const handleCreatePatient = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const newPatient = await apiCall('/patients/', {
        method: 'POST',
        body: JSON.stringify(patientForm)
      });
      
      setPatients([...patients, newPatient]);
      setShowPatientModal(false);
      setPatientForm({});
      toast.success(config.successMessages.patientCreated);
    } catch (error) {
      toast.error('Failed to create patient record');
    } finally {
      setLoading(false);
    }
  };

  // Specimen Management
  const handleCreateSpecimen = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const newSpecimen = await apiCall('/specimens/', {
        method: 'POST',
        body: JSON.stringify(specimenForm)
      });
      
      setSpecimens([...specimens, newSpecimen]);
      setShowSpecimenModal(false);
      setSpecimenForm({});
      toast.success(config.successMessages.specimenCreated);
    } catch (error) {
      toast.error('Failed to create specimen record');
    } finally {
      setLoading(false);
    }
  };

  // File Upload
  const handleFileUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    setLoading(true);
    const formData = new FormData();
    
    selectedFiles.forEach((file, index) => {
      formData.append(`file_${index}`, file);
    });
    
    try {
      const response = await fetch(`${config.api.baseUrl}/files/upload/`, {
        method: 'POST',
        body: formData,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setUploadedFiles([...uploadedFiles, ...result.files]);
        setShowUploadModal(false);
        setSelectedFiles([]);
        setUploadProgress(0);
        toast.success(config.successMessages.fileUploaded);
      }
    } catch (error) {
      toast.error(config.errorMessages.fileUpload.uploadFailed);
    } finally {
      setLoading(false);
    }
  };

  // AI Analysis
  const performAIAnalysis = async (fileId, analysisType) => {
    setLoading(true);
    
    try {
      const result = await apiCall('/ai/analyze/', {
        method: 'POST',
        body: JSON.stringify({
          file_id: fileId,
          analysis_type: analysisType
        })
      });
      
      setAnalysisResults(result);
      setShowAnalysisModal(true);
      toast.success(config.successMessages.aiAnalysisCompleted);
    } catch (error) {
      toast.error('AI analysis failed');
    } finally {
      setLoading(false);
    }
  };

  // Dashboard Component
  const DashboardView = () => (
    <Row>
      {config.dashboard.widgets.map((widget) => (
        <Col lg={3} md={6} key={widget.id} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className={`icon-box bg-${widget.color} text-white me-3`}>
                  <i className={widget.icon}></i>
                </div>
                <div>
                  <h6 className="mb-1">{widget.title}</h6>
                  {widget.type === 'counter' && (
                    <h4 className="mb-0">
                      {dashboardStats[widget.id] || 0}
                    </h4>
                  )}
                  {widget.type === 'progress' && (
                    <ProgressBar 
                      now={dashboardStats[widget.id] || 0} 
                      label={`${dashboardStats[widget.id] || 0}%`}
                    />
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
      
      <Col lg={12} className="mb-4">
        <Card>
          <Card.Header>
            <h5 className="mb-0">Quick Actions</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={3} className="mb-2">
                <Button 
                  variant="primary" 
                  className="w-100"
                  onClick={() => setShowLaboratoryModal(true)}
                >
                  <i className="ri-building-fill me-2"></i>
                  Add Laboratory
                </Button>
              </Col>
              <Col md={3} className="mb-2">
                <Button 
                  variant="success" 
                  className="w-100"
                  onClick={() => setShowPatientModal(true)}
                >
                  <i className="ri-user-add-fill me-2"></i>
                  Add Patient
                </Button>
              </Col>
              <Col md={3} className="mb-2">
                <Button 
                  variant="info" 
                  className="w-100"
                  onClick={() => setShowSpecimenModal(true)}
                >
                  <i className="ri-test-tube-fill me-2"></i>
                  Add Specimen
                </Button>
              </Col>
              <Col md={3} className="mb-2">
                <Button 
                  variant="warning" 
                  className="w-100"
                  onClick={() => setShowUploadModal(true)}
                >
                  <i className="ri-upload-cloud-fill me-2"></i>
                  Upload Files
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  // Laboratory Management View
  const LaboratoryView = () => (
    <Row>
      <Col lg={12} className="mb-4">
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Pathology Laboratories</h5>
            <Button 
              variant="primary"
              onClick={() => setShowLaboratoryModal(true)}
            >
              <i className="ri-add-fill me-2"></i>
              Add Laboratory
            </Button>
          </Card.Header>
          <Card.Body>
            {laboratories.length === 0 ? (
              <Alert variant="info">
                <i className="ri-information-fill me-2"></i>
                No laboratories found. Create your first pathology laboratory to get started.
              </Alert>
            ) : (
              <Row>
                {laboratories.map((laboratory) => (
                  <Col lg={6} key={laboratory.id} className="mb-3">
                    <Card className="h-100">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="mb-0">{laboratory.name}</h6>
                          <Badge bg="primary">{laboratory.type}</Badge>
                        </div>
                        <p className="text-muted small mb-2">{laboratory.address}</p>
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            <i className="ri-phone-fill me-1"></i>
                            {laboratory.phone}
                          </small>
                          <Button variant="outline-primary" size="sm">
                            <i className="ri-eye-fill me-1"></i>
                            View Details
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  // Patient Management View
  const PatientView = () => (
    <Row>
      <Col lg={12} className="mb-4">
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Pathology Patients</h5>
            <Button 
              variant="success"
              onClick={() => setShowPatientModal(true)}
            >
              <i className="ri-user-add-fill me-2"></i>
              Add Patient
            </Button>
          </Card.Header>
          <Card.Body>
            {patients.length === 0 ? (
              <Alert variant="info">
                <i className="ri-information-fill me-2"></i>
                No patients found. Add your first patient to start managing pathology records.
              </Alert>
            ) : (
              <Row>
                {patients.map((patient) => (
                  <Col lg={4} key={patient.id} className="mb-3">
                    <Card className="h-100">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="mb-0">
                            {patient.first_name} {patient.last_name}
                          </h6>
                          <Badge bg="success">{patient.gender}</Badge>
                        </div>
                        <p className="text-muted small mb-2">
                          <i className="ri-fingerprint-fill me-1"></i>
                          ID: {patient.patient_id}
                        </p>
                        <p className="text-muted small mb-2">
                          <i className="ri-calendar-fill me-1"></i>
                          DOB: {patient.date_of_birth}
                        </p>
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            Specimens: {patient.specimens_count || 0}
                          </small>
                          <Button variant="outline-success" size="sm">
                            <i className="ri-file-text-fill me-1"></i>
                            View Record
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  // Specimen Management View
  const SpecimenView = () => (
    <Row>
      <Col lg={12} className="mb-4">
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Specimen Management</h5>
            <Button 
              variant="info"
              onClick={() => setShowSpecimenModal(true)}
            >
              <i className="ri-test-tube-fill me-2"></i>
              Add Specimen
            </Button>
          </Card.Header>
          <Card.Body>
            {specimens.length === 0 ? (
              <Alert variant="info">
                <i className="ri-information-fill me-2"></i>
                No specimens found. Add your first specimen to start pathology testing.
              </Alert>
            ) : (
              <Row>
                {specimens.map((specimen) => (
                  <Col lg={4} key={specimen.id} className="mb-3">
                    <Card className="h-100">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="mb-0">{specimen.specimen_id}</h6>
                          <Badge bg="info">{specimen.type}</Badge>
                        </div>
                        <p className="text-muted small mb-2">
                          <i className="ri-user-fill me-1"></i>
                          Patient: {specimen.patient_name}
                        </p>
                        <p className="text-muted small mb-2">
                          <i className="ri-calendar-fill me-1"></i>
                          Collected: {specimen.collection_date}
                        </p>
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            Site: {specimen.collection_site}
                          </small>
                          <Button variant="outline-info" size="sm">
                            <i className="ri-eye-fill me-1"></i>
                            View Details
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  // File Management View
  const FileManagementView = () => (
    <Row>
      <Col lg={12} className="mb-4">
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">File Management</h5>
            <Button 
              variant="warning"
              onClick={() => setShowUploadModal(true)}
            >
              <i className="ri-upload-cloud-fill me-2"></i>
              Upload Files
            </Button>
          </Card.Header>
          <Card.Body>
            <Row className="mb-4">
              {config.fileUpload.categories.map((category) => (
                <Col lg={4} md={6} key={category.id} className="mb-3">
                  <Card className="text-center h-100">
                    <Card.Body>
                      <div className="mb-3">
                        <i className={`${category.icon} display-4 text-primary`}></i>
                      </div>
                      <h6>{category.name}</h6>
                      <p className="text-muted small">{category.description}</p>
                      <Button variant="outline-primary" size="sm">
                        View Files
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  // AI Analysis View
  const AIAnalysisView = () => (
    <Row>
      <Col lg={12} className="mb-4">
        <Card>
          <Card.Header>
            <h5 className="mb-0">AI-Powered Pathology Analysis</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              {config.aiAnalysis.features.map((feature) => (
                <Col lg={6} key={feature.id} className="mb-3">
                  <Card className="h-100">
                    <Card.Body>
                      <div className="d-flex align-items-center mb-3">
                        <div className="icon-box bg-danger text-white me-3">
                          <i className={feature.icon}></i>
                        </div>
                        <div>
                          <h6 className="mb-1">{feature.name}</h6>
                          <p className="text-muted small mb-0">{feature.description}</p>
                        </div>
                      </div>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => performAIAnalysis(null, feature.id)}
                        disabled={loading}
                      >
                        {loading ? <Spinner size="sm" /> : <i className="ri-brain-fill me-1"></i>}
                        Start Analysis
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  return (
    <div className="pathology-s3-data-manager">
      {/* Header */}
      <Row className="mb-4">
        <Col lg={12}>
          <Card className="bg-dark text-white">
            <Card.Body>
              <Row className="align-items-center">
                <Col>
                  <h4 className="mb-1">
                    <i className={`${config.module.icon} me-2`}></i>
                    {config.module.title}
                  </h4>
                  <p className="mb-0">{config.module.description}</p>
                </Col>
                <Col xs="auto">
                  <Badge bg="light" text="dark">
                    v{config.module.version}
                  </Badge>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Navigation Tabs */}
      <Row className="mb-4">
        <Col lg={12}>
          <Card>
            <Card.Body className="p-0">
              <Tabs
                id="pathology-tabs"
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="nav-fill"
              >
                <Tab eventKey="dashboard" title={
                  <span><i className="ri-dashboard-fill me-2"></i>Dashboard</span>
                }>
                  <div className="p-4">
                    <DashboardView />
                  </div>
                </Tab>
                
                <Tab eventKey="laboratories" title={
                  <span><i className="ri-building-fill me-2"></i>Laboratories</span>
                }>
                  <div className="p-4">
                    <LaboratoryView />
                  </div>
                </Tab>
                
                <Tab eventKey="patients" title={
                  <span><i className="ri-user-3-fill me-2"></i>Patients</span>
                }>
                  <div className="p-4">
                    <PatientView />
                  </div>
                </Tab>
                
                <Tab eventKey="specimens" title={
                  <span><i className="ri-test-tube-fill me-2"></i>Specimens</span>
                }>
                  <div className="p-4">
                    <SpecimenView />
                  </div>
                </Tab>
                
                <Tab eventKey="files" title={
                  <span><i className="ri-folder-fill me-2"></i>File Management</span>
                }>
                  <div className="p-4">
                    <FileManagementView />
                  </div>
                </Tab>
                
                <Tab eventKey="ai" title={
                  <span><i className="ri-brain-fill me-2"></i>AI Analysis</span>
                }>
                  <div className="p-4">
                    <AIAnalysisView />
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Laboratory Modal */}
      <Modal 
        show={showLaboratoryModal} 
        onHide={() => setShowLaboratoryModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Pathology Laboratory</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateLaboratory}>
          <Modal.Body>
            <Row>
              {config.laboratories.fields.map((field) => (
                <Col md={field.type === 'textarea' ? 12 : 6} key={field.name} className="mb-3">
                  <Form.Group>
                    <Form.Label>{field.label}</Form.Label>
                    {field.type === 'select' ? (
                      <Form.Select
                        required={field.required}
                        value={laboratoryForm[field.name] || ''}
                        onChange={(e) => setLaboratoryForm({
                          ...laboratoryForm,
                          [field.name]: e.target.value
                        })}
                      >
                        <option value="">Select {field.label}</option>
                        {field.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Form.Select>
                    ) : field.type === 'textarea' ? (
                      <Form.Control
                        as="textarea"
                        rows={3}
                        required={field.required}
                        placeholder={field.placeholder}
                        value={laboratoryForm[field.name] || ''}
                        onChange={(e) => setLaboratoryForm({
                          ...laboratoryForm,
                          [field.name]: e.target.value
                        })}
                      />
                    ) : (
                      <Form.Control
                        type={field.type}
                        required={field.required}
                        placeholder={field.placeholder}
                        value={laboratoryForm[field.name] || ''}
                        onChange={(e) => setLaboratoryForm({
                          ...laboratoryForm,
                          [field.name]: e.target.value
                        })}
                      />
                    )}
                  </Form.Group>
                </Col>
              ))}
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowLaboratoryModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Create Laboratory'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Patient Modal */}
      <Modal 
        show={showPatientModal} 
        onHide={() => setShowPatientModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Patient</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreatePatient}>
          <Modal.Body>
            <Row>
              {config.patients.fields.map((field) => (
                <Col md={field.type === 'textarea' ? 12 : 6} key={field.name} className="mb-3">
                  <Form.Group>
                    <Form.Label>{field.label}</Form.Label>
                    {field.type === 'select' ? (
                      <Form.Select
                        required={field.required}
                        value={patientForm[field.name] || ''}
                        onChange={(e) => setPatientForm({
                          ...patientForm,
                          [field.name]: e.target.value
                        })}
                      >
                        <option value="">Select {field.label}</option>
                        {field.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Form.Select>
                    ) : field.type === 'textarea' ? (
                      <Form.Control
                        as="textarea"
                        rows={3}
                        required={field.required}
                        placeholder={field.placeholder}
                        value={patientForm[field.name] || ''}
                        onChange={(e) => setPatientForm({
                          ...patientForm,
                          [field.name]: e.target.value
                        })}
                      />
                    ) : (
                      <Form.Control
                        type={field.type}
                        required={field.required}
                        placeholder={field.placeholder}
                        value={patientForm[field.name] || ''}
                        onChange={(e) => setPatientForm({
                          ...patientForm,
                          [field.name]: e.target.value
                        })}
                      />
                    )}
                  </Form.Group>
                </Col>
              ))}
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowPatientModal(false)}>
              Cancel
            </Button>
            <Button variant="success" type="submit" disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Create Patient'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Specimen Modal */}
      <Modal 
        show={showSpecimenModal} 
        onHide={() => setShowSpecimenModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Specimen</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateSpecimen}>
          <Modal.Body>
            <Row>
              {config.specimens.fields.map((field) => (
                <Col md={field.type === 'textarea' ? 12 : 6} key={field.name} className="mb-3">
                  <Form.Group>
                    <Form.Label>{field.label}</Form.Label>
                    {field.type === 'select' ? (
                      <Form.Select
                        required={field.required}
                        value={specimenForm[field.name] || ''}
                        onChange={(e) => setSpecimenForm({
                          ...specimenForm,
                          [field.name]: e.target.value
                        })}
                      >
                        <option value="">Select {field.label}</option>
                        {field.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Form.Select>
                    ) : field.type === 'textarea' ? (
                      <Form.Control
                        as="textarea"
                        rows={3}
                        required={field.required}
                        placeholder={field.placeholder}
                        value={specimenForm[field.name] || ''}
                        onChange={(e) => setSpecimenForm({
                          ...specimenForm,
                          [field.name]: e.target.value
                        })}
                      />
                    ) : (
                      <Form.Control
                        type={field.type}
                        required={field.required}
                        placeholder={field.placeholder}
                        value={specimenForm[field.name] || ''}
                        onChange={(e) => setSpecimenForm({
                          ...specimenForm,
                          [field.name]: e.target.value
                        })}
                      />
                    )}
                  </Form.Group>
                </Col>
              ))}
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowSpecimenModal(false)}>
              Cancel
            </Button>
            <Button variant="info" type="submit" disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Create Specimen'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* File Upload Modal */}
      <Modal 
        show={showUploadModal} 
        onHide={() => setShowUploadModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Upload Pathology Files</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Select Files</Form.Label>
            <Form.Control
              type="file"
              multiple
              accept={config.fileUpload.allowedTypes.join(',')}
              onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
            />
            <Form.Text className="text-muted">
              Supported formats: JPEG, PNG, PDF, TIFF, CSV. Max size: 100MB per file.
            </Form.Text>
          </Form.Group>
          
          {selectedFiles.length > 0 && (
            <Alert variant="info">
              <h6>Selected Files:</h6>
              <ul className="mb-0">
                {selectedFiles.map((file, index) => (
                  <li key={index}>
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </li>
                ))}
              </ul>
            </Alert>
          )}
          
          {uploadProgress > 0 && (
            <ProgressBar 
              now={uploadProgress} 
              label={`${uploadProgress}%`}
              className="mb-3"
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="warning" 
            onClick={handleFileUpload}
            disabled={selectedFiles.length === 0 || loading}
          >
            {loading ? <Spinner size="sm" /> : 'Upload Files'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* AI Analysis Results Modal */}
      <Modal 
        show={showAnalysisModal} 
        onHide={() => setShowAnalysisModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>AI Analysis Results</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {analysisResults && (
            <div>
              <Alert variant="success">
                <h6>Analysis Completed Successfully</h6>
                <p>Confidence Score: {(analysisResults.confidence * 100).toFixed(1)}%</p>
              </Alert>
              
              <Card>
                <Card.Header>
                  <h6>Findings</h6>
                </Card.Header>
                <Card.Body>
                  <pre>{JSON.stringify(analysisResults, null, 2)}</pre>
                </Card.Body>
              </Card>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAnalysisModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PathologyS3DataManager;
