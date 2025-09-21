import React, { useState, useEffect, useCallback } from 'react';
import { Alert, Badge, Button, Card, Col, Form, Modal, Nav, Navbar, ProgressBar, Row, Spinner, Tab, Table, Tabs } from 'react-bootstrap';
import cosmetologyS3Config from '../../config/cosmetologyS3Config';

const CosmetologyS3DataManager = () => {
  // State Management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Data States
  const [institutions, setInstitutions] = useState([]);
  const [clients, setClients] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [files, setFiles] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [analytics, setAnalytics] = useState({});
  
  // Modal States
  const [showInstitutionModal, setShowInstitutionModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  
  // Form States
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({});

  // API Helper Functions
  const apiCall = async (endpoint, options = {}) => {
    const url = `${cosmetologyS3Config.s3ApiUrl}${endpoint}`;
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, defaultOptions);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };

  // Data Fetching Functions
  const fetchInstitutions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiCall(cosmetologyS3Config.endpoints.institutions);
      setInstitutions(data);
    } catch (error) {
      setError('Failed to fetch institutions');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiCall(cosmetologyS3Config.endpoints.clients);
      setClients(data);
    } catch (error) {
      setError('Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTreatments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiCall(cosmetologyS3Config.endpoints.treatments);
      setTreatments(data);
    } catch (error) {
      setError('Failed to fetch treatments');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiCall(cosmetologyS3Config.endpoints.files);
      setFiles(data);
    } catch (error) {
      setError('Failed to fetch files');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiCall(cosmetologyS3Config.endpoints.analytics);
      setAnalytics(data);
    } catch (error) {
      setError('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial Data Loading
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        fetchInstitutions(),
        fetchClients(),
        fetchTreatments(),
        fetchFiles(),
        fetchAnalytics()
      ]);
    };
    loadInitialData();
  }, [fetchInstitutions, fetchClients, fetchTreatments, fetchFiles, fetchAnalytics]);

  // Form Handlers
  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInstitutionSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const endpoint = selectedInstitution
        ? cosmetologyS3Config.endpoints.institutionDetail(selectedInstitution.id)
        : cosmetologyS3Config.endpoints.institutions;
      
      const method = selectedInstitution ? 'PUT' : 'POST';
      await apiCall(endpoint, {
        method,
        body: JSON.stringify(formData)
      });

      setSuccess('Institution saved successfully');
      setShowInstitutionModal(false);
      setFormData({});
      setSelectedInstitution(null);
      await fetchInstitutions();
    } catch (error) {
      setError('Failed to save institution');
    } finally {
      setLoading(false);
    }
  };

  const handleClientSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const endpoint = selectedClient
        ? cosmetologyS3Config.endpoints.clientDetail(selectedClient.id)
        : cosmetologyS3Config.endpoints.clients;
      
      const method = selectedClient ? 'PUT' : 'POST';
      await apiCall(endpoint, {
        method,
        body: JSON.stringify(formData)
      });

      setSuccess('Client saved successfully');
      setShowClientModal(false);
      setFormData({});
      setSelectedClient(null);
      await fetchClients();
    } catch (error) {
      setError('Failed to save client');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file, category) => {
    try {
      setLoading(true);
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('category', category);
      uploadData.append('institution_id', selectedInstitution?.id);
      uploadData.append('client_id', selectedClient?.id);

      const response = await fetch(`${cosmetologyS3Config.s3ApiUrl}${cosmetologyS3Config.endpoints.files}`, {
        method: 'POST',
        body: uploadData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      setSuccess('File uploaded successfully');
      setShowFileModal(false);
      await fetchFiles();
    } catch (error) {
      setError('Failed to upload file');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleFileDelete = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;

    try {
      setLoading(true);
      await apiCall(cosmetologyS3Config.endpoints.fileDetail(fileId), {
        method: 'DELETE'
      });
      setSuccess('File deleted successfully');
      await fetchFiles();
    } catch (error) {
      setError('Failed to delete file');
    } finally {
      setLoading(false);
    }
  };

  const handleFileAnalysis = async (fileId) => {
    try {
      setLoading(true);
      const analysis = await apiCall(cosmetologyS3Config.endpoints.fileAnalyze(fileId), {
        method: 'POST'
      });
      setSuccess('Analysis completed successfully');
      await fetchFiles();
    } catch (error) {
      setError('Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  // Utility Functions
  const getStatusBadge = (status) => {
    const statusConfig = cosmetologyS3Config.statusOptions.find(s => s.value === status);
    return (
      <Badge bg={statusConfig?.color || 'secondary'}>
        {statusConfig?.label || status}
      </Badge>
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Component Renderers
  const renderDashboard = () => (
    <div className="dashboard-content">
      <Row className="mb-4">
        <Col>
          <h3>🏥 Cosmetology Dashboard</h3>
          <p className="text-muted">Beauty and aesthetic practice management overview</p>
        </Col>
      </Row>

      {/* Key Metrics */}
      <Row className="mb-4">
        {cosmetologyS3Config.analyticsConfig.metrics.map(metric => (
          <Col md={4} lg={2} key={metric.key} className="mb-3">
            <Card className="h-100 text-center">
              <Card.Body>
                <div className="fs-2 mb-2">{metric.icon}</div>
                <h4 className="mb-1">{analytics[metric.key] || 0}</h4>
                <small className="text-muted">{metric.label}</small>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Recent Activity */}
      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">💼 Recent Institutions</h5>
            </Card.Header>
            <Card.Body>
              {institutions.slice(0, 5).map(institution => (
                <div key={institution.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                  <div>
                    <strong>{institution.name}</strong>
                    <br />
                    <small className="text-muted">{institution.institution_type}</small>
                  </div>
                  {getStatusBadge(institution.status)}
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">👥 Recent Clients</h5>
            </Card.Header>
            <Card.Body>
              {clients.slice(0, 5).map(client => (
                <div key={client.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                  <div>
                    <strong>{client.first_name} {client.last_name}</strong>
                    <br />
                    <small className="text-muted">{client.skin_type}</small>
                  </div>
                  {getStatusBadge(client.status)}
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderInstitutions = () => (
    <div className="institutions-content">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h3>🏢 Institutions Management</h3>
            <Button 
              variant="primary" 
              onClick={() => {
                setSelectedInstitution(null);
                setFormData({});
                setShowInstitutionModal(true);
              }}
            >
              Add Institution
            </Button>
          </div>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Head Aesthetician</th>
                <th>Phone</th>
                <th>City</th>
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
                    <small className="text-muted">{institution.license_number}</small>
                  </td>
                  <td>
                    {cosmetologyS3Config.institutionTypes.find(t => t.value === institution.institution_type)?.icon} {' '}
                    {cosmetologyS3Config.institutionTypes.find(t => t.value === institution.institution_type)?.label}
                  </td>
                  <td>{institution.head_aesthetician}</td>
                  <td>{institution.phone}</td>
                  <td>{institution.city}</td>
                  <td>{getStatusBadge(institution.status)}</td>
                  <td>
                    <Button 
                      size="sm" 
                      variant="outline-primary" 
                      className="me-2"
                      onClick={() => {
                        setSelectedInstitution(institution);
                        setFormData(institution);
                        setShowInstitutionModal(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline-danger"
                      onClick={() => handleFileDelete(institution.id)}
                    >
                      Delete
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

  const renderClients = () => (
    <div className="clients-content">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h3>👥 Clients Management</h3>
            <Button 
              variant="primary" 
              onClick={() => {
                setSelectedClient(null);
                setFormData({});
                setShowClientModal(true);
              }}
            >
              Add Client
            </Button>
          </div>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>Client ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Skin Type</th>
                <th>Phone</th>
                <th>Last Visit</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client.id}>
                  <td><strong>{client.client_id}</strong></td>
                  <td>{client.first_name} {client.last_name}</td>
                  <td>{client.age || 'N/A'}</td>
                  <td>
                    <Badge bg="info">{client.skin_type}</Badge>
                  </td>
                  <td>{client.phone}</td>
                  <td>{client.last_visit || 'N/A'}</td>
                  <td>{getStatusBadge(client.status)}</td>
                  <td>
                    <Button 
                      size="sm" 
                      variant="outline-primary" 
                      className="me-2"
                      onClick={() => {
                        setSelectedClient(client);
                        setFormData(client);
                        setShowClientModal(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline-success" 
                      className="me-2"
                      onClick={() => {
                        setSelectedClient(client);
                        setActiveTab('files');
                      }}
                    >
                      Files
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

  const renderFiles = () => (
    <div className="files-content">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h3>📁 File Management</h3>
            <Button 
              variant="primary" 
              onClick={() => setShowFileModal(true)}
            >
              Upload File
            </Button>
          </div>
        </Col>
      </Row>

      {/* File Categories */}
      <Row className="mb-4">
        {cosmetologyS3Config.fileCategories.map(category => (
          <Col md={4} lg={3} key={category.value} className="mb-3">
            <Card className="h-100">
              <Card.Body className="text-center">
                <div className="fs-1 mb-2">{category.icon}</div>
                <h6>{category.label}</h6>
                <small className="text-muted">{category.description}</small>
                <div className="mt-2">
                  <Badge bg="secondary">
                    {files.filter(f => f.category === category.value).length} files
                  </Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Files Table */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">All Files</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>File Name</th>
                <th>Category</th>
                <th>Size</th>
                <th>Client</th>
                <th>Upload Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map(file => (
                <tr key={file.id}>
                  <td>
                    <strong>{file.filename}</strong>
                    <br />
                    <small className="text-muted">{file.original_name}</small>
                  </td>
                  <td>
                    <Badge bg="info">
                      {cosmetologyS3Config.fileCategories.find(c => c.value === file.category)?.label}
                    </Badge>
                  </td>
                  <td>{formatFileSize(file.file_size)}</td>
                  <td>{file.client_name || 'N/A'}</td>
                  <td>{new Date(file.created_at).toLocaleDateString()}</td>
                  <td>{getStatusBadge(file.status)}</td>
                  <td>
                    <Button 
                      size="sm" 
                      variant="outline-primary" 
                      className="me-2"
                      onClick={() => window.open(file.download_url, '_blank')}
                    >
                      Download
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline-success" 
                      className="me-2"
                      onClick={() => handleFileAnalysis(file.id)}
                    >
                      Analyze
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline-danger"
                      onClick={() => handleFileDelete(file.id)}
                    >
                      Delete
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

  const renderAIAnalysis = () => (
    <div className="ai-analysis-content">
      <Row className="mb-4">
        <Col>
          <h3>🤖 AI Analysis</h3>
          <p className="text-muted">Advanced beauty and skin analysis powered by artificial intelligence</p>
        </Col>
      </Row>

      {/* AI Features */}
      <Row className="mb-4">
        {cosmetologyS3Config.aiAnalysisFeatures.map(feature => (
          <Col md={6} lg={4} key={feature.id} className="mb-3">
            <Card className="h-100">
              <Card.Body>
                <h5>{feature.name}</h5>
                <p className="text-muted">{feature.description}</p>
                <div className="mb-2">
                  <small><strong>Input:</strong> {feature.inputTypes.join(', ')}</small>
                </div>
                <div className="mb-3">
                  <small><strong>Output:</strong> {feature.outputFormat}</small>
                </div>
                <Button variant="outline-primary" size="sm">
                  Start Analysis
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Recent Analyses */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">Recent Analyses</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>Analysis Type</th>
                <th>Client</th>
                <th>File</th>
                <th>Date</th>
                <th>Status</th>
                <th>Confidence</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {analyses.map(analysis => (
                <tr key={analysis.id}>
                  <td>{analysis.analysis_type}</td>
                  <td>{analysis.client_name}</td>
                  <td>{analysis.file_name}</td>
                  <td>{new Date(analysis.created_at).toLocaleDateString()}</td>
                  <td>{getStatusBadge(analysis.status)}</td>
                  <td>
                    <ProgressBar 
                      now={analysis.confidence_score * 100} 
                      label={`${Math.round(analysis.confidence_score * 100)}%`}
                      variant={analysis.confidence_score > 0.8 ? 'success' : analysis.confidence_score > 0.6 ? 'warning' : 'danger'}
                    />
                  </td>
                  <td>
                    <Button size="sm" variant="outline-primary">
                      View Results
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

  // Modal Components
  const InstitutionModal = () => (
    <Modal show={showInstitutionModal} onHide={() => setShowInstitutionModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedInstitution ? 'Edit Institution' : 'Add New Institution'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleInstitutionSubmit}>
        <Modal.Body>
          <Row>
            {cosmetologyS3Config.institutionFields.map(field => (
              <Col md={field.type === 'textarea' ? 12 : 6} key={field.name} className="mb-3">
                <Form.Group>
                  <Form.Label>{field.label} {field.required && '*'}</Form.Label>
                  {field.type === 'select' ? (
                    <Form.Select
                      value={formData[field.name] || ''}
                      onChange={(e) => handleFormChange(field.name, e.target.value)}
                      required={field.required}
                    >
                      <option value="">Select {field.label}</option>
                      {(field.options === 'institutionTypes' 
                        ? cosmetologyS3Config.institutionTypes 
                        : field.options
                      ).map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                  ) : field.type === 'textarea' ? (
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleFormChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  ) : (
                    <Form.Control
                      type={field.type}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleFormChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  )}
                </Form.Group>
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInstitutionModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Save Institution'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );

  const ClientModal = () => (
    <Modal show={showClientModal} onHide={() => setShowClientModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedClient ? 'Edit Client' : 'Add New Client'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleClientSubmit}>
        <Modal.Body>
          <Row>
            {cosmetologyS3Config.clientFields.map(field => (
              <Col md={field.type === 'textarea' ? 12 : 6} key={field.name} className="mb-3">
                <Form.Group>
                  <Form.Label>{field.label} {field.required && '*'}</Form.Label>
                  {field.type === 'select' ? (
                    <Form.Select
                      value={formData[field.name] || ''}
                      onChange={(e) => handleFormChange(field.name, e.target.value)}
                      required={field.required}
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                  ) : field.type === 'textarea' ? (
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleFormChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  ) : (
                    <Form.Control
                      type={field.type}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleFormChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  )}
                </Form.Group>
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowClientModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Save Client'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );

  const FileUploadModal = () => (
    <Modal show={showFileModal} onHide={() => setShowFileModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Upload File</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>File Category</Form.Label>
            <Form.Select onChange={(e) => handleFormChange('category', e.target.value)}>
              <option value="">Select Category</option>
              {cosmetologyS3Config.fileCategories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.icon} {category.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Select Institution</Form.Label>
            <Form.Select onChange={(e) => setSelectedInstitution(institutions.find(i => i.id == e.target.value))}>
              <option value="">Select Institution</option>
              {institutions.map(institution => (
                <option key={institution.id} value={institution.id}>
                  {institution.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Select Client (Optional)</Form.Label>
            <Form.Select onChange={(e) => setSelectedClient(clients.find(c => c.id == e.target.value))}>
              <option value="">Select Client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.first_name} {client.last_name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Choose File</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => handleFormChange('file', e.target.files[0])}
              accept={cosmetologyS3Config.uploadConfig.allowedFormats.map(f => `.${f}`).join(',')}
            />
            <Form.Text className="text-muted">
              Supported formats: {cosmetologyS3Config.uploadConfig.allowedFormats.join(', ')}
            </Form.Text>
          </Form.Group>

          {uploadProgress > 0 && (
            <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} className="mb-3" />
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowFileModal(false)}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={() => handleFileUpload(formData.file, formData.category)}
          disabled={!formData.file || !formData.category || loading}
        >
          {loading ? <Spinner animation="border" size="sm" /> : 'Upload'}
        </Button>
      </Modal.Footer>
    </Modal>
  );

  // Main Render
  return (
    <div className="cosmetology-s3-manager">
      {/* Header */}
      <Navbar bg="light" expand="lg" className="mb-4">
        <Navbar.Brand>
          <strong>💄 {cosmetologyS3Config.moduleInfo.name}</strong>
        </Navbar.Brand>
        <Navbar.Text className="ms-auto">
          {cosmetologyS3Config.moduleInfo.description}
        </Navbar.Text>
      </Navbar>

      {/* Alerts */}
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

      {/* Navigation Tabs */}
      <Tabs
        activeKey={activeTab}
        onSelect={(tab) => setActiveTab(tab)}
        className="mb-4"
      >
        {cosmetologyS3Config.navigationItems.map(item => (
          <Tab
            key={item.id}
            eventKey={item.id}
            title={
              <span>
                {item.icon} {item.label}
              </span>
            }
          >
            {loading && (
              <div className="text-center py-4">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            )}
            
            {!loading && (
              <>
                {activeTab === 'dashboard' && renderDashboard()}
                {activeTab === 'institutions' && renderInstitutions()}
                {activeTab === 'clients' && renderClients()}
                {activeTab === 'files' && renderFiles()}
                {activeTab === 'ai_analysis' && renderAIAnalysis()}
              </>
            )}
          </Tab>
        ))}
      </Tabs>

      {/* Modals */}
      <InstitutionModal />
      <ClientModal />
      <FileUploadModal />
    </div>
  );
};

export default CosmetologyS3DataManager;
