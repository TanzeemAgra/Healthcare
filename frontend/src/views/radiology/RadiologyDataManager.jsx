import React, { useState, useEffect } from 'react';
import { 
    Container, Row, Col, Card, Button, Tab, Tabs, 
    Form, Table, Alert, Badge, Modal, Spinner,
    Accordion, ProgressBar, Breadcrumb
} from 'react-bootstrap';
import { 
    FaHospital, FaUser, FaFileImage, FaFileAlt, FaBrain,
    FaFolder, FaUpload, FaSearch, FaFilter, FaDownload,
    FaEye, FaEdit, FaTrash, FaPlus, FaChartBar,
    FaShieldAlt, FaClock, FaDatabase, FaCloud
} from 'react-icons/fa';

const RadiologyDataManager = () => {
    // State management
    const [activeTab, setActiveTab] = useState('institutions');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    
    // Data states
    const [institutions, setInstitutions] = useState([]);
    const [patients, setPatients] = useState([]);
    const [studies, setStudies] = useState([]);
    const [reports, setReports] = useState([]);
    const [selectedInstitution, setSelectedInstitution] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedStudy, setSelectedStudy] = useState(null);
    
    // Modal states
    const [showInstitutionModal, setShowInstitutionModal] = useState(false);
    const [showPatientModal, setShowPatientModal] = useState(false);
    const [showStudyModal, setShowStudyModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    
    // Search and filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCriteria, setFilterCriteria] = useState({});
    
    // API Base URL
    const API_BASE = '/api/radiology/api';

    // Custom styles
    const customStyles = `
        .data-manager-container {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
            padding: 20px 0;
        }
        
        .hierarchy-card {
            border-radius: 15px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            border: none;
        }
        
        .hierarchy-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 35px rgba(0,0,0,0.15);
        }
        
        .s3-badge {
            background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
            border: none;
            color: white;
            font-weight: 600;
        }
        
        .secure-badge {
            background: linear-gradient(45deg, #667eea, #764ba2);
            border: none;
            color: white;
        }
        
        .hierarchy-level {
            border-left: 4px solid #4ECDC4;
            padding-left: 15px;
            margin: 10px 0;
        }
        
        .data-stats {
            background: white;
            border-radius: 10px;
            padding: 15px;
            margin: 10px 0;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        .upload-zone {
            border: 3px dashed #4ECDC4;
            border-radius: 10px;
            padding: 40px;
            text-align: center;
            background: rgba(78, 205, 196, 0.05);
            transition: all 0.3s ease;
        }
        
        .upload-zone:hover {
            background: rgba(78, 205, 196, 0.1);
            border-color: #45b7aa;
        }
    `;

    // Load data on component mount
    useEffect(() => {
        loadInstitutions();
    }, []);

    // API Functions
    const loadInstitutions = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/institutions/`);
            if (response.ok) {
                const data = await response.json();
                setInstitutions(data.results || data);
            }
        } catch (error) {
            setError('Failed to load institutions');
        } finally {
            setLoading(false);
        }
    };

    const loadPatients = async (institutionId) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/patients/?institution=${institutionId}`);
            if (response.ok) {
                const data = await response.json();
                setPatients(data.results || data);
            }
        } catch (error) {
            setError('Failed to load patients');
        } finally {
            setLoading(false);
        }
    };

    const loadStudies = async (patientId) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/patient/${patientId}/studies/`);
            if (response.ok) {
                const data = await response.json();
                setStudies(data.results || data);
            }
        } catch (error) {
            setError('Failed to load studies');
        } finally {
            setLoading(false);
        }
    };

    const createInstitution = async (institutionData) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/institutions/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(institutionData)
            });
            if (response.ok) {
                setSuccess('Institution created successfully');
                loadInstitutions();
                setShowInstitutionModal(false);
            }
        } catch (error) {
            setError('Failed to create institution');
        } finally {
            setLoading(false);
        }
    };

    const createPatient = async (patientData) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/create-patient/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...patientData,
                    institution_id: selectedInstitution.id
                })
            });
            if (response.ok) {
                setSuccess('Patient created successfully with S3 storage');
                loadPatients(selectedInstitution.id);
                setShowPatientModal(false);
            }
        } catch (error) {
            setError('Failed to create patient');
        } finally {
            setLoading(false);
        }
    };

    const createStudy = async (studyData) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/create-study/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...studyData,
                    patient_id: selectedPatient.id
                })
            });
            if (response.ok) {
                setSuccess('Study created successfully with S3 structure');
                loadStudies(selectedPatient.id);
                setShowStudyModal(false);
            }
        } catch (error) {
            setError('Failed to create study');
        } finally {
            setLoading(false);
        }
    };

    // Render Functions
    const renderHierarchyBreadcrumb = () => (
        <Breadcrumb className="mb-4">
            <Breadcrumb.Item 
                active={!selectedInstitution}
                onClick={() => {
                    setSelectedInstitution(null);
                    setSelectedPatient(null);
                    setSelectedStudy(null);
                }}
            >
                <FaDatabase className="me-2" />
                Institutions
            </Breadcrumb.Item>
            {selectedInstitution && (
                <Breadcrumb.Item 
                    active={!selectedPatient}
                    onClick={() => {
                        setSelectedPatient(null);
                        setSelectedStudy(null);
                    }}
                >
                    <FaHospital className="me-2" />
                    {selectedInstitution.name}
                </Breadcrumb.Item>
            )}
            {selectedPatient && (
                <Breadcrumb.Item 
                    active={!selectedStudy}
                    onClick={() => setSelectedStudy(null)}
                >
                    <FaUser className="me-2" />
                    {selectedPatient.first_name} {selectedPatient.last_name}
                </Breadcrumb.Item>
            )}
            {selectedStudy && (
                <Breadcrumb.Item active>
                    <FaFileImage className="me-2" />
                    {selectedStudy.accession_number}
                </Breadcrumb.Item>
            )}
        </Breadcrumb>
    );

    const renderInstitutionsTab = () => (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4><FaHospital className="me-2" />Medical Institutions</h4>
                <Button 
                    variant="primary" 
                    onClick={() => setShowInstitutionModal(true)}
                >
                    <FaPlus className="me-2" />Add Institution
                </Button>
            </div>

            {renderHierarchyBreadcrumb()}

            {!selectedInstitution ? (
                <Row>
                    {institutions.map(institution => (
                        <Col md={6} lg={4} key={institution.id} className="mb-3">
                            <Card className="hierarchy-card h-100">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <h5 className="mb-0">{institution.name}</h5>
                                        <Badge className="s3-badge">
                                            <FaCloud className="me-1" />S3
                                        </Badge>
                                    </div>
                                    
                                    <p className="text-muted mb-2">
                                        <strong>Code:</strong> {institution.code}
                                    </p>
                                    <p className="text-muted mb-3">
                                        {institution.email}
                                    </p>

                                    <div className="data-stats">
                                        <Row className="text-center">
                                            <Col>
                                                <div className="fw-bold text-primary">
                                                    {institution.total_patients || 0}
                                                </div>
                                                <small className="text-muted">Patients</small>
                                            </Col>
                                            <Col>
                                                <div className="fw-bold text-success">
                                                    {institution.total_studies || 0}
                                                </div>
                                                <small className="text-muted">Studies</small>
                                            </Col>
                                            <Col>
                                                <div className="fw-bold text-info">
                                                    {institution.storage_used_gb || 0} GB
                                                </div>
                                                <small className="text-muted">Used</small>
                                            </Col>
                                        </Row>
                                    </div>

                                    <div className="mt-3">
                                        <ProgressBar 
                                            now={(institution.storage_used_gb / institution.storage_quota_gb) * 100} 
                                            label={`${institution.storage_used_gb}GB / ${institution.storage_quota_gb}GB`}
                                            className="mb-2"
                                        />
                                        <small className="text-muted">Storage Usage</small>
                                    </div>

                                    <div className="d-flex justify-content-between mt-3">
                                        <Button 
                                            variant="outline-primary" 
                                            size="sm"
                                            onClick={() => {
                                                setSelectedInstitution(institution);
                                                loadPatients(institution.id);
                                            }}
                                        >
                                            <FaEye className="me-1" />View
                                        </Button>
                                        <Badge className="secure-badge">
                                            <FaShieldAlt className="me-1" />Encrypted
                                        </Badge>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                renderPatientsView()
            )}
        </div>
    );

    const renderPatientsView = () => (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4><FaUser className="me-2" />Patients - {selectedInstitution.name}</h4>
                <Button 
                    variant="success" 
                    onClick={() => setShowPatientModal(true)}
                >
                    <FaPlus className="me-2" />Add Patient
                </Button>
            </div>

            {!selectedPatient ? (
                <Row>
                    {patients.map(patient => (
                        <Col md={6} lg={4} key={patient.id} className="mb-3">
                            <Card className="hierarchy-card h-100">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <h5 className="mb-0">
                                            {patient.first_name} {patient.last_name}
                                        </h5>
                                        <Badge bg="info">
                                            {patient.patient_code}
                                        </Badge>
                                    </div>

                                    <div className="hierarchy-level">
                                        <p className="text-muted mb-1">
                                            <FaCloud className="me-2" />
                                            S3 Path: {patient.s3_patient_prefix}
                                        </p>
                                        <p className="text-muted mb-1">
                                            <FaClock className="me-2" />
                                            Created: {new Date(patient.created_at).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className="data-stats">
                                        <Row className="text-center">
                                            <Col>
                                                <div className="fw-bold text-primary">
                                                    {patient.total_studies || 0}
                                                </div>
                                                <small className="text-muted">Studies</small>
                                            </Col>
                                            <Col>
                                                <div className="fw-bold text-success">
                                                    {patient.last_study_date ? 
                                                        new Date(patient.last_study_date).toLocaleDateString() : 
                                                        'N/A'
                                                    }
                                                </div>
                                                <small className="text-muted">Last Study</small>
                                            </Col>
                                        </Row>
                                    </div>

                                    <Button 
                                        variant="outline-primary" 
                                        size="sm"
                                        className="w-100 mt-3"
                                        onClick={() => {
                                            setSelectedPatient(patient);
                                            loadStudies(patient.id);
                                        }}
                                    >
                                        <FaFileImage className="me-1" />View Studies
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                renderStudiesView()
            )}
        </div>
    );

    const renderStudiesView = () => (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>
                    <FaFileImage className="me-2" />
                    Studies - {selectedPatient.first_name} {selectedPatient.last_name}
                </h4>
                <div>
                    <Button 
                        variant="info" 
                        className="me-2"
                        onClick={() => setShowUploadModal(true)}
                    >
                        <FaUpload className="me-2" />Upload DICOM
                    </Button>
                    <Button 
                        variant="success" 
                        onClick={() => setShowStudyModal(true)}
                    >
                        <FaPlus className="me-2" />New Study
                    </Button>
                </div>
            </div>

            <Row>
                {studies.map(study => (
                    <Col md={12} key={study.id} className="mb-3">
                        <Card className="hierarchy-card">
                            <Card.Body>
                                <Row>
                                    <Col md={8}>
                                        <h5 className="mb-2">
                                            {study.study_description}
                                            <Badge bg="secondary" className="ms-2">
                                                {study.modality}
                                            </Badge>
                                        </h5>
                                        
                                        <div className="hierarchy-level">
                                            <p className="mb-1">
                                                <strong>Accession:</strong> {study.accession_number}
                                            </p>
                                            <p className="mb-1">
                                                <strong>Body Part:</strong> {study.body_part}
                                            </p>
                                            <p className="mb-1">
                                                <FaCloud className="me-2" />
                                                <strong>S3 Path:</strong> {study.s3_study_prefix}
                                            </p>
                                            <p className="mb-1">
                                                <strong>Clinical Indication:</strong> {study.clinical_indication}
                                            </p>
                                        </div>
                                    </Col>
                                    
                                    <Col md={4}>
                                        <div className="data-stats">
                                            <Row className="text-center">
                                                <Col>
                                                    <div className="fw-bold text-primary">
                                                        {study.dicom_file_count || 0}
                                                    </div>
                                                    <small className="text-muted">DICOM Files</small>
                                                </Col>
                                                <Col>
                                                    <div className="fw-bold text-info">
                                                        {study.total_file_size_mb || 0} MB
                                                    </div>
                                                    <small className="text-muted">Size</small>
                                                </Col>
                                            </Row>
                                            
                                            <div className="mt-2">
                                                {study.has_report && (
                                                    <Badge bg="success" className="me-2">
                                                        <FaFileAlt className="me-1" />Report
                                                    </Badge>
                                                )}
                                                {study.has_ai_analysis && (
                                                    <Badge bg="warning">
                                                        <FaBrain className="me-1" />AI Analysis
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );

    return (
        <div className="data-manager-container">
            <style>{customStyles}</style>
            <Container fluid>
                <Row>
                    <Col>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h2 className="mb-1">
                                    <FaDatabase className="me-3" />
                                    Radiology Data Management System
                                </h2>
                                <p className="text-muted mb-0">
                                    Hierarchical S3 Storage for Medical Imaging & DICOM Data
                                </p>
                            </div>
                            <div className="d-flex align-items-center">
                                <Badge className="s3-badge me-3">
                                    <FaCloud className="me-2" />AWS S3 Storage
                                </Badge>
                                <Badge className="secure-badge">
                                    <FaShieldAlt className="me-2" />HIPAA Compliant
                                </Badge>
                            </div>
                        </div>

                        {error && (
                            <Alert variant="danger" dismissible onClose={() => setError(null)}>
                                {error}
                            </Alert>
                        )}

                        {success && (
                            <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
                                {success}
                            </Alert>
                        )}

                        <Tabs
                            activeKey={activeTab}
                            onSelect={(k) => setActiveTab(k)}
                            className="mb-4"
                        >
                            <Tab eventKey="institutions" title={
                                <span><FaHospital className="me-2" />Institutions</span>
                            }>
                                {renderInstitutionsTab()}
                            </Tab>
                            
                            <Tab eventKey="search" title={
                                <span><FaSearch className="me-2" />Search</span>
                            }>
                                <div className="text-center py-5">
                                    <FaSearch size={64} className="text-muted mb-3" />
                                    <h4>Advanced Search</h4>
                                    <p className="text-muted">Search across all institutions, patients, and studies</p>
                                </div>
                            </Tab>
                            
                            <Tab eventKey="analytics" title={
                                <span><FaChartBar className="me-2" />Analytics</span>
                            }>
                                <div className="text-center py-5">
                                    <FaChartBar size={64} className="text-muted mb-3" />
                                    <h4>Storage Analytics</h4>
                                    <p className="text-muted">View storage usage and performance metrics</p>
                                </div>
                            </Tab>
                        </Tabs>

                        {loading && (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-3 text-muted">Loading data...</p>
                            </div>
                        )}
                    </Col>
                </Row>

                {/* Institution Modal */}
                <Modal show={showInstitutionModal} onHide={() => setShowInstitutionModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <FaHospital className="me-2" />Add New Institution
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            createInstitution({
                                name: formData.get('name'),
                                code: formData.get('code'),
                                address: formData.get('address'),
                                phone: formData.get('phone'),
                                email: formData.get('email'),
                                storage_quota_gb: parseInt(formData.get('storage_quota_gb'))
                            });
                        }}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Institution Name</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="name" 
                                            required 
                                            placeholder="Enter institution name"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Institution Code</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="code" 
                                            required 
                                            placeholder="Enter unique code"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            
                            <Form.Group className="mb-3">
                                <Form.Label>Address</Form.Label>
                                <Form.Control 
                                    as="textarea" 
                                    name="address" 
                                    rows={2}
                                    placeholder="Enter full address"
                                />
                            </Form.Group>
                            
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Phone</Form.Label>
                                        <Form.Control 
                                            type="tel" 
                                            name="phone" 
                                            placeholder="Enter phone number"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control 
                                            type="email" 
                                            name="email" 
                                            required
                                            placeholder="Enter email address"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            
                            <Form.Group className="mb-3">
                                <Form.Label>Storage Quota (GB)</Form.Label>
                                <Form.Control 
                                    type="number" 
                                    name="storage_quota_gb" 
                                    required
                                    min="1"
                                    placeholder="Enter storage quota in GB"
                                />
                            </Form.Group>
                            
                            <div className="d-flex justify-content-end">
                                <Button 
                                    variant="secondary" 
                                    className="me-2"
                                    onClick={() => setShowInstitutionModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button variant="primary" type="submit">
                                    <FaPlus className="me-2" />Create Institution
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>

                {/* Patient Modal */}
                <Modal show={showPatientModal} onHide={() => setShowPatientModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <FaUser className="me-2" />Add New Patient
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Alert variant="info">
                            <FaCloud className="me-2" />
                            Patient data will be stored securely in AWS S3 with encryption
                        </Alert>
                        
                        <Form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            createPatient({
                                first_name: formData.get('first_name'),
                                last_name: formData.get('last_name'),
                                patient_code: formData.get('patient_code')
                            });
                        }}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="first_name" 
                                            required 
                                            placeholder="Enter first name"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="last_name" 
                                            required 
                                            placeholder="Enter last name"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            
                            <Form.Group className="mb-3">
                                <Form.Label>Patient Code</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="patient_code" 
                                    required 
                                    placeholder="Enter unique patient identifier"
                                />
                            </Form.Group>
                            
                            <div className="d-flex justify-content-end">
                                <Button 
                                    variant="secondary" 
                                    className="me-2"
                                    onClick={() => setShowPatientModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button variant="success" type="submit">
                                    <FaPlus className="me-2" />Create Patient
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>

                {/* Study Modal */}
                <Modal show={showStudyModal} onHide={() => setShowStudyModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <FaFileImage className="me-2" />Create New Study
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Alert variant="info">
                            <FaFolder className="me-2" />
                            Study will create a dedicated S3 folder structure for DICOM files and reports
                        </Alert>
                        
                        <Form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            createStudy({
                                accession_number: formData.get('accession_number'),
                                study_instance_uid: formData.get('study_instance_uid'),
                                modality: formData.get('modality'),
                                body_part: formData.get('body_part'),
                                study_description: formData.get('study_description'),
                                clinical_indication: formData.get('clinical_indication'),
                                study_date: formData.get('study_date'),
                                priority: formData.get('priority')
                            });
                        }}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Accession Number</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="accession_number" 
                                            required 
                                            placeholder="Enter accession number"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Study Instance UID</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="study_instance_uid" 
                                            required 
                                            placeholder="Enter DICOM Study UID"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Modality</Form.Label>
                                        <Form.Select name="modality" required>
                                            <option value="">Select modality</option>
                                            <option value="CT">CT - Computed Tomography</option>
                                            <option value="MRI">MRI - Magnetic Resonance Imaging</option>
                                            <option value="XR">XR - X-Ray</option>
                                            <option value="US">US - Ultrasound</option>
                                            <option value="MG">MG - Mammography</option>
                                            <option value="NM">NM - Nuclear Medicine</option>
                                            <option value="PT">PT - Positron Emission Tomography</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Body Part</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="body_part" 
                                            required 
                                            placeholder="e.g., Chest, Abdomen, Head"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            
                            <Form.Group className="mb-3">
                                <Form.Label>Study Description</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="study_description" 
                                    required 
                                    placeholder="Brief description of the study"
                                />
                            </Form.Group>
                            
                            <Form.Group className="mb-3">
                                <Form.Label>Clinical Indication</Form.Label>
                                <Form.Control 
                                    as="textarea" 
                                    name="clinical_indication" 
                                    rows={2}
                                    placeholder="Clinical reason for the study"
                                />
                            </Form.Group>
                            
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Study Date</Form.Label>
                                        <Form.Control 
                                            type="date" 
                                            name="study_date" 
                                            required 
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Priority</Form.Label>
                                        <Form.Select name="priority" required>
                                            <option value="routine">Routine</option>
                                            <option value="urgent">Urgent</option>
                                            <option value="stat">STAT</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            
                            <div className="d-flex justify-content-end">
                                <Button 
                                    variant="secondary" 
                                    className="me-2"
                                    onClick={() => setShowStudyModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button variant="success" type="submit">
                                    <FaPlus className="me-2" />Create Study
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>

                {/* DICOM Upload Modal */}
                <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <FaUpload className="me-2" />Upload DICOM Files
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="upload-zone">
                            <FaUpload size={48} className="text-muted mb-3" />
                            <h4>Drag & Drop DICOM Files</h4>
                            <p className="text-muted">Or click to browse files</p>
                            <Button variant="outline-primary">
                                <FaFolder className="me-2" />Browse Files
                            </Button>
                        </div>
                        
                        <Alert variant="warning" className="mt-3">
                            <FaShieldAlt className="me-2" />
                            All uploaded files will be encrypted and stored securely in AWS S3
                        </Alert>
                    </Modal.Body>
                </Modal>
            </Container>
        </div>
    );
};

export default RadiologyDataManager;
