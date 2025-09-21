import React, { useState, useEffect, useMemo } from 'react';
import { Card, Row, Col, Button, Modal, Form, Alert, Badge, Table, Dropdown, ProgressBar, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';

const SecureS3DataManager = ({ 
  moduleType, 
  moduleName, 
  moduleConfig, 
  moduleIcon = 'folder', 
  moduleColor = 'primary',
  // Legacy props for backward compatibility
  config, 
  module = 'radiology' 
}) => {
  // Use new props if available, fallback to legacy props
  const currentModule = moduleType || module;
  const currentConfig = moduleConfig || config;
  const displayName = moduleName || (currentConfig?.name) || currentModule;
  // State management
  const [workspaces, setWorkspaces] = useState([]);
  const [patientFolders, setPatientFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const [showCreatePatient, setShowCreatePatient] = useState(false);
  const [showUploadFile, setShowUploadFile] = useState(false);
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  
  // Form states
  const [workspaceForm, setWorkspaceForm] = useState({ module: currentModule, storage_quota_gb: 10 });
  const [patientForm, setPatientForm] = useState({
    patient_id: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    medical_record_number: '',
    contact_info: {}
  });
  const [uploadForm, setUploadForm] = useState({
    file: null,
    file_type: 'medical_record',
    description: '',
    confidentiality_level: 'high'
  });
  
  // Current user context (would come from authentication)
  const [currentUser] = useState({
    id: '1',
    role: 'doctor', // doctor, admin, super_admin
    name: 'Dr. John Smith',
    email: 'john.smith@hospital.com'
  });

  // Safe configuration with fallbacks
  const safeConfig = useMemo(() => {
    try {
      return {
        service: currentConfig?.service || { name: 'Secure S3 Data Manager', version: '1.0.0' },
        ui: config?.ui || {
          theme: { primary: 'primary', secondary: 'secondary' },
          icons: { 
            folder: 'ri-folder-3-line',
            file: 'ri-file-line',
            upload: 'ri-upload-line',
            download: 'ri-download-line',
            user: 'ri-user-line',
            shield: 'ri-shield-check-line'
          }
        },
        security: config?.security || {
          encryption: { enabled: true },
          access_control: { role_based: true }
        }
      };
    } catch (error) {
      console.error('Configuration error:', error);
      return {
        service: { name: 'Secure S3 Data Manager', version: '1.0.0' },
        ui: {
          theme: { primary: 'primary', secondary: 'secondary' },
          icons: { 
            folder: 'ri-folder-3-line',
            file: 'ri-file-line',
            upload: 'ri-upload-line',
            download: 'ri-download-line',
            user: 'ri-user-line',
            shield: 'ri-shield-check-line'
          }
        },
        security: {
          encryption: { enabled: true },
          access_control: { role_based: true }
        }
      };
    }
  }, [config]);

  // API functions
  const api = {
    async createWorkspace(data) {
      try {
        const response = await fetch('/api/secure-s3/workspace/create/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCsrfToken()
          },
          body: JSON.stringify(data)
        });
        return await response.json();
      } catch (error) {
        console.error('Create workspace error:', error);
        return { success: false, error: error.message };
      }
    },

    async listWorkspaces() {
      try {
        const response = await fetch('/api/secure-s3/workspaces/', {
          headers: { 'X-CSRFToken': getCsrfToken() }
        });
        return await response.json();
      } catch (error) {
        console.error('List workspaces error:', error);
        return { success: false, error: error.message };
      }
    },

    async createPatientFolder(data) {
      try {
        const response = await fetch('/api/secure-s3/patient-folder/create/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCsrfToken()
          },
          body: JSON.stringify(data)
        });
        return await response.json();
      } catch (error) {
        console.error('Create patient folder error:', error);
        return { success: false, error: error.message };
      }
    },

    async listPatientFolders(module) {
      try {
        const response = await fetch(`/api/secure-s3/patient-folders/?module=${module}`, {
          headers: { 'X-CSRFToken': getCsrfToken() }
        });
        return await response.json();
      } catch (error) {
        console.error('List patient folders error:', error);
        return { success: false, error: error.message };
      }
    },

    async uploadFile(formData) {
      try {
        const response = await fetch('/api/secure-s3/file/upload/', {
          method: 'POST',
          headers: { 'X-CSRFToken': getCsrfToken() },
          body: formData
        });
        return await response.json();
      } catch (error) {
        console.error('Upload file error:', error);
        return { success: false, error: error.message };
      }
    },

    async listFiles(patientId, module) {
      try {
        const response = await fetch(`/api/secure-s3/files/${patientId}/?module=${module}`, {
          headers: { 'X-CSRFToken': getCsrfToken() }
        });
        return await response.json();
      } catch (error) {
        console.error('List files error:', error);
        return { success: false, error: error.message };
      }
    },

    async downloadFile(patientId, fileId, module) {
      try {
        const response = await fetch(`/api/secure-s3/file/download/${patientId}/${fileId}/?module=${module}`, {
          headers: { 'X-CSRFToken': getCsrfToken() }
        });
        
        if (response.ok) {
          const blob = await response.blob();
          const filename = response.headers.get('Content-Disposition')?.split('filename="')[1]?.slice(0, -1) || 'download';
          
          // Create download link
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          
          return { success: true };
        } else {
          const error = await response.json();
          return { success: false, error: error.error };
        }
      } catch (error) {
        console.error('Download file error:', error);
        return { success: false, error: error.message };
      }
    }
  };

  // Helper function to get CSRF token
  const getCsrfToken = () => {
    return document.querySelector('[name=csrfmiddlewaretoken]')?.value || '';
  };

  // Load initial data
  useEffect(() => {
    loadData();
  }, [currentModule]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load workspaces
      const workspacesResult = await api.listWorkspaces();
      if (workspacesResult.success) {
        setWorkspaces(workspacesResult.workspaces);
      }

      // Load patient folders for current module
      const foldersResult = await api.listPatientFolders(currentModule);
      if (foldersResult.success) {
        setPatientFolders(foldersResult.patient_folders);
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  // Event handlers
  const handleCreateWorkspace = async () => {
    try {
      const result = await api.createWorkspace(workspaceForm);
      if (result.success) {
        toast.success('Workspace created successfully!');
        setShowCreateWorkspace(false);
        loadData();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to create workspace');
    }
  };

  const handleCreatePatientFolder = async () => {
    try {
      const result = await api.createPatientFolder({
        module,
        patient_data: patientForm
      });
      
      if (result.success) {
        toast.success('Patient folder created successfully!');
        setShowCreatePatient(false);
        setPatientForm({
          patient_id: '',
          first_name: '',
          last_name: '',
          date_of_birth: '',
          medical_record_number: '',
          contact_info: {}
        });
        loadData();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to create patient folder');
    }
  };

  const handleFileUpload = async () => {
    if (!uploadForm.file || !selectedFolder) {
      toast.error('Please select a file and patient folder');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', uploadForm.file);
      formData.append('patient_id', selectedFolder.patient_id);
      formData.append('module', module);
      formData.append('file_type', uploadForm.file_type);
      formData.append('metadata', JSON.stringify({
        description: uploadForm.description,
        confidentiality_level: uploadForm.confidentiality_level,
        uploaded_by: currentUser.name
      }));

      const result = await api.uploadFile(formData);
      
      if (result.success) {
        toast.success('File uploaded successfully!');
        setShowUploadFile(false);
        setUploadForm({
          file: null,
          file_type: 'medical_record',
          description: '',
          confidentiality_level: 'high'
        });
        loadPatientFiles(selectedFolder.patient_id);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to upload file');
    }
  };

  const loadPatientFiles = async (patientId) => {
    try {
      const result = await api.listFiles(patientId, module);
      if (result.success) {
        setFiles(result.files);
      }
    } catch (error) {
      console.error('Failed to load patient files:', error);
    }
  };

  const handleDownloadFile = async (patientId, fileId) => {
    try {
      const result = await api.downloadFile(patientId, fileId, module);
      if (result.success) {
        toast.success('File downloaded successfully!');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to download file');
    }
  };

  // Render workspace overview
  const renderWorkspaceOverview = () => {
    const currentWorkspace = workspaces.find(w => w.module === module);
    
    if (!currentWorkspace) {
      return (
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body className="text-center py-4">
            <i className={`${safeConfig.ui.icons.folder} fs-1 text-muted mb-3`}></i>
            <h5>No Workspace Found</h5>
            <p className="text-muted">Create a workspace to start managing patient data securely.</p>
            <Button 
              variant={safeConfig.ui.theme.primary}
              onClick={() => setShowCreateWorkspace(true)}
            >
              <i className={`${safeConfig.ui.icons.folder} me-2`}></i>
              Create Workspace
            </Button>
          </Card.Body>
        </Card>
      );
    }

    return (
      <Card className="border-0 shadow-sm mb-4">
        <Card.Header className="bg-transparent border-0">
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0">
              <i className={`${safeConfig.ui.icons.folder} me-2`}></i>
              {module.charAt(0).toUpperCase() + module.slice(1)} Workspace
            </h6>
            <Badge bg="success">
              <i className={`${safeConfig.ui.icons.shield} me-1`}></i>
              HIPAA Compliant
            </Badge>
          </div>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={3}>
              <div className="text-center">
                <h4 className="text-primary">{currentWorkspace.patient_folders_count}</h4>
                <small className="text-muted">Patient Folders</small>
              </div>
            </Col>
            <Col md={3}>
              <div className="text-center">
                <h4 className="text-success">{currentWorkspace.total_files}</h4>
                <small className="text-muted">Total Files</small>
              </div>
            </Col>
            <Col md={3}>
              <div className="text-center">
                <h4 className="text-info">{currentWorkspace.storage_quota_gb} GB</h4>
                <small className="text-muted">Storage Quota</small>
              </div>
            </Col>
            <Col md={3}>
              <div className="text-center">
                <h4 className="text-warning">{currentWorkspace.usage_percentage.toFixed(1)}%</h4>
                <small className="text-muted">Usage</small>
              </div>
            </Col>
          </Row>
          <div className="mt-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small">Storage Usage</span>
              <span className="small">{currentWorkspace.remaining_space_gb.toFixed(2)} GB remaining</span>
            </div>
            <ProgressBar 
              now={currentWorkspace.usage_percentage} 
              variant={currentWorkspace.usage_percentage > 80 ? 'danger' : 'primary'}
            />
          </div>
        </Card.Body>
      </Card>
    );
  };

  // Render patient folders
  const renderPatientFolders = () => (
    <Card className="border-0 shadow-sm mb-4">
      <Card.Header className="bg-transparent border-0">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0">
            <i className={`${safeConfig.ui.icons.user} me-2`}></i>
            Patient Folders ({patientFolders.length})
          </h6>
          {currentUser.role !== 'patient' && (
            <Button 
              variant={safeConfig.ui.theme.primary}
              size="sm"
              onClick={() => setShowCreatePatient(true)}
            >
              <i className="ri-add-line me-1"></i>
              Add Patient
            </Button>
          )}
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        {patientFolders.length === 0 ? (
          <div className="text-center py-4">
            <i className="ri-folder-open-line fs-1 text-muted mb-3"></i>
            <p className="text-muted">No patient folders found</p>
          </div>
        ) : (
          <Table responsive hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th>Patient ID</th>
                <th>Doctor</th>
                <th>Files</th>
                <th>Size</th>
                <th>Last Access</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patientFolders.map(folder => (
                <tr key={folder.id} style={{ cursor: 'pointer' }}>
                  <td>
                    <strong>{folder.patient_id}</strong>
                    <br />
                    <Badge bg="outline-secondary" className="small">{folder.status}</Badge>
                  </td>
                  <td>
                    {folder.assigned_doctor ? (
                      <>
                        {folder.assigned_doctor.name}
                        <br />
                        <small className="text-muted">{folder.assigned_doctor.email}</small>
                      </>
                    ) : (
                      <span className="text-muted">No assigned doctor</span>
                    )}
                  </td>
                  <td>
                    <Badge bg="info">{folder.total_files}</Badge>
                  </td>
                  <td>{folder.total_size_mb} MB</td>
                  <td>
                    <small>{new Date(folder.last_accessed).toLocaleDateString()}</small>
                  </td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-secondary" size="sm">
                        Actions
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item 
                          onClick={() => {
                            setSelectedFolder(folder);
                            loadPatientFiles(folder.patient_id);
                          }}
                        >
                          <i className="ri-eye-line me-2"></i>View Files
                        </Dropdown.Item>
                        <Dropdown.Item 
                          onClick={() => {
                            setSelectedFolder(folder);
                            setShowUploadFile(true);
                          }}
                        >
                          <i className={`${safeConfig.ui.icons.upload} me-2`}></i>Upload File
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );

  // Render file list
  const renderFileList = () => {
    if (!selectedFolder) return null;

    return (
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-transparent border-0">
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0">
              <i className={`${safeConfig.ui.icons.file} me-2`}></i>
              Files for Patient {selectedFolder.patient_id}
            </h6>
            <Button 
              variant={safeConfig.ui.theme.secondary}
              size="sm"
              onClick={() => setSelectedFolder(null)}
            >
              <i className="ri-close-line me-1"></i>Close
            </Button>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {files.length === 0 ? (
            <div className="text-center py-4">
              <i className="ri-file-line fs-1 text-muted mb-3"></i>
              <p className="text-muted">No files found for this patient</p>
            </div>
          ) : (
            <Table responsive hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Filename</th>
                  <th>Type</th>
                  <th>Size</th>
                  <th>Uploaded</th>
                  <th>Uploaded By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {files.map(file => (
                  <tr key={file.file_id}>
                    <td>
                      <i className={`${safeConfig.ui.icons.file} me-2`}></i>
                      {file.original_filename}
                    </td>
                    <td>
                      <Badge bg="primary">{file.file_type}</Badge>
                    </td>
                    <td>{(file.size / 1024 / 1024).toFixed(2)} MB</td>
                    <td>
                      <small>{new Date(file.upload_time).toLocaleDateString()}</small>
                    </td>
                    <td>
                      <small>{file.uploaded_by || 'Unknown'}</small>
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleDownloadFile(selectedFolder.patient_id, file.file_id)}
                      >
                        <i className={`${safeConfig.ui.icons.download} me-1`}></i>
                        Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading secure data management system...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error Loading Data Manager</Alert.Heading>
        <p>{error}</p>
        <Button variant="outline-danger" onClick={() => window.location.reload()}>
          Reload Page
        </Button>
      </Alert>
    );
  }

  return (
    <div className="secure-s3-data-manager">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-0">
                <i className={`${safeConfig.ui.icons.shield} me-2 text-success`}></i>
                {safeConfig.service.name}
              </h4>
              <p className="text-muted mb-0">
                HIPAA-Compliant Data Management for {module.charAt(0).toUpperCase() + module.slice(1)}
              </p>
            </div>
            <Badge bg="success" className="fs-6">
              <i className="ri-lock-line me-1"></i>
              Encrypted
            </Badge>
          </div>
        </Col>
      </Row>

      {/* Workspace Overview */}
      {renderWorkspaceOverview()}

      {/* Patient Folders */}
      {renderPatientFolders()}

      {/* File List */}
      {renderFileList()}

      {/* Create Workspace Modal */}
      <Modal show={showCreateWorkspace} onHide={() => setShowCreateWorkspace(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Workspace</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Module</Form.Label>
              <Form.Select
                value={workspaceForm.module}
                onChange={(e) => setWorkspaceForm({...workspaceForm, module: e.target.value})}
              >
                <option value="radiology">Radiology</option>
                <option value="medicine">Medicine</option>
                <option value="dentistry">Dentistry</option>
                <option value="dermatology">Dermatology</option>
                <option value="pathology">Pathology</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Storage Quota (GB)</Form.Label>
              <Form.Control
                type="number"
                value={workspaceForm.storage_quota_gb}
                onChange={(e) => setWorkspaceForm({...workspaceForm, storage_quota_gb: parseInt(e.target.value)})}
                min="1"
                max="100"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateWorkspace(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateWorkspace}>
            Create Workspace
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Create Patient Folder Modal */}
      <Modal show={showCreatePatient} onHide={() => setShowCreatePatient(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Patient Folder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Patient ID</Form.Label>
              <Form.Control
                type="text"
                value={patientForm.patient_id}
                onChange={(e) => setPatientForm({...patientForm, patient_id: e.target.value})}
                placeholder="Enter unique patient ID"
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={patientForm.first_name}
                    onChange={(e) => setPatientForm({...patientForm, first_name: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={patientForm.last_name}
                    onChange={(e) => setPatientForm({...patientForm, last_name: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                value={patientForm.date_of_birth}
                onChange={(e) => setPatientForm({...patientForm, date_of_birth: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Medical Record Number</Form.Label>
              <Form.Control
                type="text"
                value={patientForm.medical_record_number}
                onChange={(e) => setPatientForm({...patientForm, medical_record_number: e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreatePatient(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreatePatientFolder}>
            Create Patient Folder
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Upload File Modal */}
      <Modal show={showUploadFile} onHide={() => setShowUploadFile(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Patient File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFolder && (
            <Alert variant="info">
              <strong>Uploading to:</strong> Patient {selectedFolder.patient_id}
            </Alert>
          )}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>File</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setUploadForm({...uploadForm, file: e.target.files[0]})}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.dcm"
              />
              <Form.Text className="text-muted">
                Supported formats: PDF, DOC, DOCX, JPG, PNG, DICOM. Max size: 10MB
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>File Type</Form.Label>
              <Form.Select
                value={uploadForm.file_type}
                onChange={(e) => setUploadForm({...uploadForm, file_type: e.target.value})}
              >
                <option value="medical_record">Medical Record</option>
                <option value="lab_result">Lab Result</option>
                <option value="imaging">Medical Imaging</option>
                <option value="prescription">Prescription</option>
                <option value="treatment_plan">Treatment Plan</option>
                <option value="progress_note">Progress Note</option>
                <option value="discharge_summary">Discharge Summary</option>
                <option value="consent_form">Consent Form</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={uploadForm.description}
                onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                placeholder="Optional description of the file"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confidentiality Level</Form.Label>
              <Form.Select
                value={uploadForm.confidentiality_level}
                onChange={(e) => setUploadForm({...uploadForm, confidentiality_level: e.target.value})}
              >
                <option value="high">High (HIPAA Protected)</option>
                <option value="medium">Medium (Restricted)</option>
                <option value="low">Low (Internal Use)</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUploadFile(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleFileUpload}>
            <i className={`${safeConfig.ui.icons.upload} me-1`}></i>
            Upload File
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SecureS3DataManager;
