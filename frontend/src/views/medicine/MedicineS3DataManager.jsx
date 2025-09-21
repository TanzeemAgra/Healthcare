import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Button, Table, Modal, Form,
  Badge, Spinner, Alert, Nav, Tab, ProgressBar, Dropdown
} from 'react-bootstrap';
import {
  FaHospital, FaUser, FaFileAlt, FaStethoscope, FaClipboardList,
  FaFlask, FaChartLine, FaUpload, FaDownload, FaEye, FaEdit,
  FaTrash, FaPlus, FaSearch, FaFilter, FaSync, FaExclamationTriangle,
  FaClock, FaCalendarAlt, FaUserMd, FaShieldAlt, FaDatabase
} from 'react-icons/fa';

import ConsultationsManager from './ConsultationsManager';
import TreatmentPlansManager from './TreatmentPlansManager';
import LabResultsManager from './LabResultsManager';

const MedicineDataManager = () => {
  // State management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Data states
  const [institutions, setInstitutions] = useState([]);
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [labResults, setLabResults] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  
  // Modal states
  const [showInstitutionModal, setShowInstitutionModal] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [showTreatmentModal, setShowTreatmentModal] = useState(false);
  const [showLabModal, setShowLabModal] = useState(false);
  
  // Form data states
  const [institutionForm, setInstitutionForm] = useState({
    name: '', code: '', address: '', phone: '', email: '', website: '',
    license_number: '', accreditation: '', storage_quota_gb: 1000
  });
  
  const [patientForm, setPatientForm] = useState({
    institution_id: '', patient_code: '', first_name: '', last_name: '',
    date_of_birth: '', gender: 'M', blood_type: '', phone: '', email: '',
    address: '', emergency_contact_name: '', emergency_contact_phone: '',
    allergies: '', chronic_conditions: '', current_medications: '',
    insurance_provider: '', insurance_number: '', height_cm: '', weight_kg: ''
  });
  
  const [consultationForm, setConsultationForm] = useState({
    patient_id: '', consultation_type: 'routine', consultation_date: '',
    duration_minutes: 30, chief_complaint: '', history_present_illness: '',
    examination_findings: '', assessment: '', plan: '',
    blood_pressure_systolic: '', blood_pressure_diastolic: '',
    heart_rate: '', temperature: '', respiratory_rate: '', oxygen_saturation: ''
  });
  
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // API base URL
  const API_BASE = '/api/medicine/s3-api';

  // Utility functions
  const showAlert = (message, type = 'success') => {
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
    }, 5000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatFileSize = (sizeInMB) => {
    if (sizeInMB < 1) return `${(sizeInMB * 1024).toFixed(1)} KB`;
    if (sizeInMB < 1024) return `${sizeInMB.toFixed(1)} MB`;
    return `${(sizeInMB / 1024).toFixed(1)} GB`;
  };

  // API functions
  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/medicine/s3-institutions/');
      if (!response.ok) throw new Error('Failed to fetch institutions');
      const data = await response.json();
      setInstitutions(data.results || data);
    } catch (err) {
      showAlert(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async (institutionId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/medicine/s3-patients/?institution=${institutionId}`);
      if (!response.ok) throw new Error('Failed to fetch patients');
      const data = await response.json();
      setPatients(data.results || data);
    } catch (err) {
      showAlert(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientData = async (patientId) => {
    try {
      setLoading(true);
      // Fetch medical records
      const recordsResponse = await fetch(`/api/medicine/s3-medical-records/?patient=${patientId}`);
      const recordsData = await recordsResponse.json();
      setMedicalRecords(recordsData.results || recordsData);

      // Fetch consultations
      const consultationsResponse = await fetch(`/api/medicine/s3-consultations/?patient=${patientId}`);
      const consultationsData = await consultationsResponse.json();
      setConsultations(consultationsData.results || consultationsData);

      // Fetch treatment plans
      const treatmentResponse = await fetch(`/api/medicine/s3-treatment-plans/?patient=${patientId}`);
      const treatmentData = await treatmentResponse.json();
      setTreatmentPlans(treatmentData.results || treatmentData);

      // Fetch lab results
      const labResponse = await fetch(`/api/medicine/s3-lab-results/?patient=${patientId}`);
      const labData = await labResponse.json();
      setLabResults(labData.results || labData);
    } catch (err) {
      showAlert(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async (institutionId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/analytics/${institutionId}/`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      const data = await response.json();
      setAnalytics(data.analytics);
    } catch (err) {
      showAlert(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // CRUD operations
  const createInstitution = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/create-institution/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(institutionForm)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create institution');
      }
      
      const data = await response.json();
      showAlert('Institution created successfully with S3 structure!');
      setShowInstitutionModal(false);
      setInstitutionForm({
        name: '', code: '', address: '', phone: '', email: '', website: '',
        license_number: '', accreditation: '', storage_quota_gb: 1000
      });
      fetchInstitutions();
    } catch (err) {
      showAlert(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const createPatient = async () => {
    try {
      setLoading(true);
      const formData = { ...patientForm, institution_id: selectedInstitution.id };
      
      const response = await fetch(`${API_BASE}/create-patient/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create patient');
      }
      
      const data = await response.json();
      showAlert('Patient created successfully with S3 directory structure!');
      setShowPatientModal(false);
      setPatientForm({
        institution_id: '', patient_code: '', first_name: '', last_name: '',
        date_of_birth: '', gender: 'M', blood_type: '', phone: '', email: '',
        address: '', emergency_contact_name: '', emergency_contact_phone: '',
        allergies: '', chronic_conditions: '', current_medications: '',
        insurance_provider: '', insurance_number: '', height_cm: '', weight_kg: ''
      });
      fetchPatients(selectedInstitution.id);
    } catch (err) {
      showAlert(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const uploadMedicalRecord = async () => {
    if (!uploadFile || !selectedPatient) return;
    
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('patient_id', selectedPatient.id);
      formData.append('record_type', document.getElementById('recordType').value);
      formData.append('title', document.getElementById('recordTitle').value);
      formData.append('description', document.getElementById('recordDescription').value);
      
      const response = await fetch(`${API_BASE}/upload-medical-record/`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload medical record');
      }
      
      const data = await response.json();
      showAlert('Medical record uploaded successfully to S3!');
      setShowRecordModal(false);
      setUploadFile(null);
      fetchPatientData(selectedPatient.id);
    } catch (err) {
      showAlert(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const createConsultation = async () => {
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
      setShowConsultationModal(false);
      fetchPatientData(selectedPatient.id);
    } catch (err) {
      showAlert(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Effect hooks
  useEffect(() => {
    fetchInstitutions();
  }, []);

  useEffect(() => {
    if (selectedInstitution) {
      fetchPatients(selectedInstitution.id);
      fetchAnalytics(selectedInstitution.id);
    }
  }, [selectedInstitution]);

  useEffect(() => {
    if (selectedPatient) {
      fetchPatientData(selectedPatient.id);
    }
  }, [selectedPatient]);

  // Dashboard component
  const Dashboard = () => (
    <Row>
      <Col md={12}>
        <Card className="mb-4">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5><FaChartLine className="me-2" />Medicine Department Analytics</h5>
            {selectedInstitution && (
              <Button variant="outline-primary" size="sm" onClick={() => fetchAnalytics(selectedInstitution.id)}>
                <FaSync className="me-1" />Refresh
              </Button>
            )}
          </Card.Header>
          <Card.Body>
            {analytics ? (
              <Row>
                <Col md={3}>
                  <Card className="text-center bg-primary text-white mb-3">
                    <Card.Body>
                      <h3>{analytics.database_analytics?.total_patients || 0}</h3>
                      <p>Total Patients</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center bg-success text-white mb-3">
                    <Card.Body>
                      <h3>{analytics.database_analytics?.total_consultations || 0}</h3>
                      <p>Total Consultations</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center bg-info text-white mb-3">
                    <Card.Body>
                      <h3>{analytics.database_analytics?.active_treatment_plans || 0}</h3>
                      <p>Active Treatment Plans</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center bg-warning text-white mb-3">
                    <Card.Body>
                      <h3>{analytics.s3_analytics?.total_files || 0}</h3>
                      <p>Medical Files (S3)</p>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col md={6}>
                  <Card className="mb-3">
                    <Card.Header>Storage Usage</Card.Header>
                    <Card.Body>
                      {selectedInstitution && (
                        <>
                          <div className="d-flex justify-content-between mb-2">
                            <span>Used: {selectedInstitution.storage_used_gb || 0} GB</span>
                            <span>Quota: {selectedInstitution.storage_quota_gb} GB</span>
                          </div>
                          <ProgressBar 
                            now={selectedInstitution.storage_usage_percentage || 0} 
                            label={`${selectedInstitution.storage_usage_percentage || 0}%`}
                            variant={
                              selectedInstitution.storage_usage_percentage > 90 ? 'danger' :
                              selectedInstitution.storage_usage_percentage > 70 ? 'warning' : 'success'
                            }
                          />
                        </>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col md={6}>
                  <Card className="mb-3">
                    <Card.Header>Recent Activity</Card.Header>
                    <Card.Body>
                      {analytics.database_analytics?.recent_activity?.slice(0, 5).map((activity, index) => (
                        <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                          <span className="small">{activity.action?.replace('_', ' ')}</span>
                          <Badge variant="secondary">{activity.resource_type}</Badge>
                        </div>
                      ))}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            ) : (
              <div className="text-center">
                <p>Select an institution to view analytics</p>
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  // Institutions component
  const Institutions = () => (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5><FaHospital className="me-2" />Medical Institutions</h5>
        <Button variant="primary" onClick={() => setShowInstitutionModal(true)}>
          <FaPlus className="me-1" />Add Institution
        </Button>
      </Card.Header>
      <Card.Body>
        {institutions.length > 0 ? (
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>License</th>
                <th>Patients</th>
                <th>Storage Used</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {institutions.map(institution => (
                <tr key={institution.id}>
                  <td>
                    <strong>{institution.name}</strong>
                    <br />
                    <small className="text-muted">{institution.email}</small>
                  </td>
                  <td><Badge variant="secondary">{institution.code}</Badge></td>
                  <td>{institution.license_number}</td>
                  <td>{institution.total_patients || 0}</td>
                  <td>
                    {institution.storage_used_gb || 0} GB / {institution.storage_quota_gb} GB
                    <br />
                    <ProgressBar 
                      now={institution.storage_usage_percentage || 0} 
                      size="sm"
                      variant={
                        institution.storage_usage_percentage > 90 ? 'danger' :
                        institution.storage_usage_percentage > 70 ? 'warning' : 'success'
                      }
                    />
                  </td>
                  <td>
                    <Badge variant={institution.is_active ? 'success' : 'danger'}>
                      {institution.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="me-1"
                      onClick={() => setSelectedInstitution(institution)}
                    >
                      <FaEye className="me-1" />Select
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div className="text-center py-4">
            <FaHospital size={48} className="text-muted mb-3" />
            <p>No institutions found. Add your first institution to get started.</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );

  // Patients component
  const Patients = () => (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5>
          <FaUser className="me-2" />Patients 
          {selectedInstitution && (
            <span className="text-muted ms-2">- {selectedInstitution.name}</span>
          )}
        </h5>
        {selectedInstitution && (
          <Button variant="primary" onClick={() => setShowPatientModal(true)}>
            <FaPlus className="me-1" />Add Patient
          </Button>
        )}
      </Card.Header>
      <Card.Body>
        {!selectedInstitution ? (
          <Alert variant="info">
            <FaExclamationTriangle className="me-2" />
            Please select an institution first to view and manage patients.
          </Alert>
        ) : patients.length > 0 ? (
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>Patient Code</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Blood Type</th>
                <th>Consultations</th>
                <th>Records</th>
                <th>Last Visit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(patient => (
                <tr key={patient.id}>
                  <td><Badge variant="primary">{patient.patient_code}</Badge></td>
                  <td>
                    <strong>{patient.full_name}</strong>
                    <br />
                    <small className="text-muted">{patient.phone}</small>
                  </td>
                  <td>{patient.age}</td>
                  <td>{patient.gender === 'M' ? 'Male' : 'Female'}</td>
                  <td>{patient.blood_type || 'N/A'}</td>
                  <td>{patient.total_consultations || 0}</td>
                  <td>{patient.total_medical_records || 0}</td>
                  <td>{patient.last_consultation_date || 'Never'}</td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <FaEye className="me-1" />View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div className="text-center py-4">
            <FaUser size={48} className="text-muted mb-3" />
            <p>No patients found for this institution. Add your first patient to get started.</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );

  // Medical Records component
  const MedicalRecords = () => (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5>
          <FaFileAlt className="me-2" />Medical Records
          {selectedPatient && (
            <span className="text-muted ms-2">- {selectedPatient.full_name}</span>
          )}
        </h5>
        {selectedPatient && (
          <Button variant="primary" onClick={() => setShowRecordModal(true)}>
            <FaUpload className="me-1" />Upload Record
          </Button>
        )}
      </Card.Header>
      <Card.Body>
        {!selectedPatient ? (
          <Alert variant="info">
            <FaExclamationTriangle className="me-2" />
            Please select a patient first to view and manage medical records.
          </Alert>
        ) : medicalRecords.length > 0 ? (
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>File Size</th>
                <th>Encrypted</th>
                <th>Created By</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {medicalRecords.map(record => (
                <tr key={record.id}>
                  <td>
                    <strong>{record.title}</strong>
                    {record.description && (
                      <>
                        <br />
                        <small className="text-muted">{record.description}</small>
                      </>
                    )}
                  </td>
                  <td><Badge variant="info">{record.record_type}</Badge></td>
                  <td>{record.file_size_formatted}</td>
                  <td>
                    {record.is_encrypted ? (
                      <Badge variant="success"><FaShieldAlt className="me-1" />Encrypted</Badge>
                    ) : (
                      <Badge variant="warning">Not Encrypted</Badge>
                    )}
                  </td>
                  <td>{record.created_by?.username || 'Unknown'}</td>
                  <td>{record.created_at_formatted}</td>
                  <td>
                    <Button variant="outline-success" size="sm">
                      <FaDownload className="me-1" />Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div className="text-center py-4">
            <FaFileAlt size={48} className="text-muted mb-3" />
            <p>No medical records found for this patient.</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );

  return (
    <Container fluid className="mt-4">
      {/* Alert Messages */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          <FaExclamationTriangle className="me-2" />{error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2><FaDatabase className="me-2" />Medicine Data Management</h2>
              <p className="text-muted">S3-Integrated Medical Data Storage & Management System</p>
            </div>
            {loading && <Spinner animation="border" variant="primary" />}
          </div>
        </Col>
      </Row>

      {/* Navigation Tabs */}
      <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey="dashboard">
              <FaChartLine className="me-2" />Dashboard
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="institutions">
              <FaHospital className="me-2" />Institutions
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="patients">
              <FaUser className="me-2" />Patients
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="records">
              <FaFileAlt className="me-2" />Medical Records
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="consultations">
              <FaStethoscope className="me-2" />Consultations
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="treatments">
              <FaClipboardList className="me-2" />Treatment Plans
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="labs">
              <FaFlask className="me-2" />Lab Results
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="dashboard">
            <Dashboard />
          </Tab.Pane>
          <Tab.Pane eventKey="institutions">
            <Institutions />
          </Tab.Pane>
          <Tab.Pane eventKey="patients">
            <Patients />
          </Tab.Pane>
          <Tab.Pane eventKey="records">
            <MedicalRecords />
          </Tab.Pane>
          <Tab.Pane eventKey="consultations">
            <ConsultationsManager
              selectedPatient={selectedPatient}
              consultations={consultations}
              fetchPatientData={fetchPatientData}
              showAlert={showAlert}
            />
          </Tab.Pane>
          <Tab.Pane eventKey="treatments">
            <TreatmentPlansManager
              selectedPatient={selectedPatient}
              treatmentPlans={treatmentPlans}
              consultations={consultations}
              fetchPatientData={fetchPatientData}
              showAlert={showAlert}
            />
          </Tab.Pane>
          <Tab.Pane eventKey="labs">
            <LabResultsManager
              selectedPatient={selectedPatient}
              labResults={labResults}
              consultations={consultations}
              fetchPatientData={fetchPatientData}
              showAlert={showAlert}
            />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      {/* Institution Modal */}
      <Modal show={showInstitutionModal} onHide={() => setShowInstitutionModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title><FaHospital className="me-2" />Add New Institution</Modal.Title>
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
                    onChange={(e) => setInstitutionForm({...institutionForm, name: e.target.value})}
                    placeholder="Hospital Name"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Institution Code *</Form.Label>
                  <Form.Control
                    type="text"
                    value={institutionForm.code}
                    onChange={(e) => setInstitutionForm({...institutionForm, code: e.target.value})}
                    placeholder="HOSP001"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Address *</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={institutionForm.address}
                onChange={(e) => setInstitutionForm({...institutionForm, address: e.target.value})}
                placeholder="Full institutional address"
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone *</Form.Label>
                  <Form.Control
                    type="tel"
                    value={institutionForm.phone}
                    onChange={(e) => setInstitutionForm({...institutionForm, phone: e.target.value})}
                    placeholder="+1234567890"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    value={institutionForm.email}
                    onChange={(e) => setInstitutionForm({...institutionForm, email: e.target.value})}
                    placeholder="contact@hospital.com"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>License Number *</Form.Label>
                  <Form.Control
                    type="text"
                    value={institutionForm.license_number}
                    onChange={(e) => setInstitutionForm({...institutionForm, license_number: e.target.value})}
                    placeholder="Medical license number"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Storage Quota (GB)</Form.Label>
                  <Form.Control
                    type="number"
                    value={institutionForm.storage_quota_gb}
                    onChange={(e) => setInstitutionForm({...institutionForm, storage_quota_gb: parseFloat(e.target.value)})}
                    placeholder="1000"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Website</Form.Label>
              <Form.Control
                type="url"
                value={institutionForm.website}
                onChange={(e) => setInstitutionForm({...institutionForm, website: e.target.value})}
                placeholder="https://hospital.com"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInstitutionModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={createInstitution} disabled={loading}>
            {loading ? <Spinner size="sm" className="me-2" /> : <FaPlus className="me-2" />}
            Create Institution
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Patient Modal */}
      <Modal show={showPatientModal} onHide={() => setShowPatientModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title><FaUser className="me-2" />Add New Patient</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Patient Code *</Form.Label>
                  <Form.Control
                    type="text"
                    value={patientForm.patient_code}
                    onChange={(e) => setPatientForm({...patientForm, patient_code: e.target.value})}
                    placeholder="PAT001"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={patientForm.first_name}
                    onChange={(e) => setPatientForm({...patientForm, first_name: e.target.value})}
                    placeholder="John"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={patientForm.last_name}
                    onChange={(e) => setPatientForm({...patientForm, last_name: e.target.value})}
                    placeholder="Doe"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Date of Birth *</Form.Label>
                  <Form.Control
                    type="date"
                    value={patientForm.date_of_birth}
                    onChange={(e) => setPatientForm({...patientForm, date_of_birth: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Gender *</Form.Label>
                  <Form.Select
                    value={patientForm.gender}
                    onChange={(e) => setPatientForm({...patientForm, gender: e.target.value})}
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Blood Type</Form.Label>
                  <Form.Select
                    value={patientForm.blood_type}
                    onChange={(e) => setPatientForm({...patientForm, blood_type: e.target.value})}
                  >
                    <option value="">Select...</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    value={patientForm.phone}
                    onChange={(e) => setPatientForm({...patientForm, phone: e.target.value})}
                    placeholder="+1234567890"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={patientForm.email}
                    onChange={(e) => setPatientForm({...patientForm, email: e.target.value})}
                    placeholder="patient@email.com"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={patientForm.address}
                onChange={(e) => setPatientForm({...patientForm, address: e.target.value})}
                placeholder="Patient address"
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Emergency Contact Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={patientForm.emergency_contact_name}
                    onChange={(e) => setPatientForm({...patientForm, emergency_contact_name: e.target.value})}
                    placeholder="Emergency contact"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Emergency Contact Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    value={patientForm.emergency_contact_phone}
                    onChange={(e) => setPatientForm({...patientForm, emergency_contact_phone: e.target.value})}
                    placeholder="+1234567890"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPatientModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={createPatient} disabled={loading}>
            {loading ? <Spinner size="sm" className="me-2" /> : <FaPlus className="me-2" />}
            Create Patient
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Medical Record Upload Modal */}
      <Modal show={showRecordModal} onHide={() => setShowRecordModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title><FaUpload className="me-2" />Upload Medical Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Record Title *</Form.Label>
              <Form.Control
                type="text"
                id="recordTitle"
                placeholder="Enter record title"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Record Type *</Form.Label>
              <Form.Select id="recordType">
                <option value="">Select type...</option>
                <option value="lab_report">Lab Report</option>
                <option value="prescription">Prescription</option>
                <option value="consultation_note">Consultation Note</option>
                <option value="imaging">Medical Imaging</option>
                <option value="discharge_summary">Discharge Summary</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                id="recordDescription"
                placeholder="Record description (optional)"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>File *</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setUploadFile(e.target.files[0])}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <Form.Text className="text-muted">
                Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 50MB)
              </Form.Text>
            </Form.Group>
            {uploadProgress > 0 && (
              <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} className="mb-3" />
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRecordModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={uploadMedicalRecord} 
            disabled={loading || !uploadFile}
          >
            {loading ? <Spinner size="sm" className="me-2" /> : <FaUpload className="me-2" />}
            Upload to S3
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MedicineDataManager;
