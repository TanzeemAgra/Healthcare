import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Tab, Button, Table, Form, Modal, Alert, Spinner, Badge, ProgressBar } from 'react-bootstrap';
import { homeopathyS3Config } from '../config/homeopathyS3Config';

const HomeopathyS3DataManager = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [institutions, setInstitutions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [cases, setCases] = useState([]);
  const [files, setFiles] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});

  // Base API URL
  const baseUrl = homeopathyS3Config.baseUrl;

  // Fetch data function
  const fetchData = async (endpoint, setData) => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}${endpoint}`);
      if (response.ok) {
        const data = await response.json();
        setData(data.results || data);
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchAnalytics();
    } else if (activeTab === 'institutions') {
      fetchData(homeopathyS3Config.endpoints.institutions, setInstitutions);
    } else if (activeTab === 'patients') {
      fetchData(homeopathyS3Config.endpoints.patients, setPatients);
    } else if (activeTab === 'cases') {
      fetchData(homeopathyS3Config.endpoints.cases, setCases);
    } else if (activeTab === 'files') {
      fetchData(homeopathyS3Config.endpoints.files, setFiles);
    } else if (activeTab === 'analyses') {
      fetchData(homeopathyS3Config.endpoints.analyses, setAnalyses);
    }
  }, [activeTab]);

  // Fetch analytics
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}${homeopathyS3Config.endpoints.analytics}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (err) {
      setError('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let endpoint = '';
      let method = 'POST';

      if (modalType === 'addInstitution') {
        endpoint = homeopathyS3Config.endpoints.institutions;
      } else if (modalType === 'addPatient') {
        endpoint = homeopathyS3Config.endpoints.patients;
      } else if (modalType === 'addCase') {
        endpoint = homeopathyS3Config.endpoints.cases;
      }

      if (selectedItem) {
        method = 'PUT';
        endpoint = `${endpoint}/${selectedItem.id}`;
      }

      const response = await fetch(`${baseUrl}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(selectedItem ? 'Updated successfully' : 'Created successfully');
        setShowModal(false);
        setFormData({});
        setSelectedItem(null);
        // Refresh data
        if (modalType.includes('Institution')) {
          fetchData(homeopathyS3Config.endpoints.institutions, setInstitutions);
        } else if (modalType.includes('Patient')) {
          fetchData(homeopathyS3Config.endpoints.patients, setPatients);
        } else if (modalType.includes('Case')) {
          fetchData(homeopathyS3Config.endpoints.cases, setCases);
        }
      } else {
        throw new Error('Operation failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('file_type', 'case_taking');

      const response = await fetch(`${baseUrl}${homeopathyS3Config.endpoints.files}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSuccess('File uploaded successfully');
        fetchData(homeopathyS3Config.endpoints.files, setFiles);
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Render dashboard
  const renderDashboard = () => (
    <Row>
      <Col lg={12}>
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">
              <span className="me-2">🏥</span>
              Homeopathy Practice Dashboard
            </h5>
          </Card.Header>
          <Card.Body>
            <Row>
              {homeopathyS3Config.analyticsConfig.metrics.map((metric) => (
                <Col lg={2} md={4} sm={6} key={metric.key} className="mb-3">
                  <Card className="h-100 border-0 shadow-sm">
                    <Card.Body className="text-center">
                      <div className="display-6 mb-2">{metric.icon}</div>
                      <h3 className="text-primary mb-1">
                        {analytics[metric.key] || 0}
                      </h3>
                      <small className="text-muted">{metric.label}</small>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      </Col>

      <Col lg={6}>
        <Card className="mb-4">
          <Card.Header>
            <h6 className="mb-0">📊 Constitutional Types Distribution</h6>
          </Card.Header>
          <Card.Body>
            <div className="text-center py-4">
              <div className="mb-3">🧬</div>
              <p>Constitutional analysis visualization will be displayed here</p>
              <small className="text-muted">
                Calcarea Carbonica: 25% | Phosphorus: 20% | Sulphur: 18%
              </small>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col lg={6}>
        <Card className="mb-4">
          <Card.Header>
            <h6 className="mb-0">💊 Popular Remedies</h6>
          </Card.Header>
          <Card.Body>
            <div className="text-center py-4">
              <div className="mb-3">📈</div>
              <p>Most prescribed remedies chart will be displayed here</p>
              <small className="text-muted">
                Arsenicum: 15% | Pulsatilla: 12% | Lycopodium: 10%
              </small>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col lg={12}>
        <Card>
          <Card.Header>
            <h6 className="mb-0">🔍 Recent Activities</h6>
          </Card.Header>
          <Card.Body>
            <div className="text-center py-4 text-muted">
              <div className="mb-3">📋</div>
              <p>Recent case taking, prescriptions, and follow-ups will be shown here</p>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  // Render institutions tab
  const renderInstitutions = () => (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">🏥 Homeopathy Institutions</h5>
        <Button
          variant="primary"
          onClick={() => {
            setModalType('addInstitution');
            setSelectedItem(null);
            setFormData({});
            setShowModal(true);
          }}
        >
          Add Institution
        </Button>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" />
          </div>
        ) : (
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>Institution Name</th>
                <th>Type</th>
                <th>Chief Homeopath</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {institutions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    No institutions found. Click "Add Institution" to get started.
                  </td>
                </tr>
              ) : (
                institutions.map((institution) => (
                  <tr key={institution.id}>
                    <td>
                      <strong>{institution.name}</strong>
                      <br />
                      <small className="text-muted">{institution.license_number}</small>
                    </td>
                    <td>
                      <Badge bg="info">
                        {homeopathyS3Config.institutionTypes.find(t => t.value === institution.institution_type)?.label}
                      </Badge>
                    </td>
                    <td>{institution.chief_homeopath}</td>
                    <td>
                      {institution.city}, {institution.state}
                    </td>
                    <td>
                      <Badge bg={institution.is_active ? 'success' : 'secondary'}>
                        {institution.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td>
                      <Button size="sm" variant="outline-primary" className="me-2">
                        View
                      </Button>
                      <Button size="sm" variant="outline-secondary">
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );

  // Render patients tab
  const renderPatients = () => (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">👥 Homeopathy Patients</h5>
        <Button
          variant="primary"
          onClick={() => {
            setModalType('addPatient');
            setSelectedItem(null);
            setFormData({});
            setShowModal(true);
          }}
        >
          Add Patient
        </Button>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" />
          </div>
        ) : (
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Patient ID</th>
                <th>Constitutional Type</th>
                <th>Miasmatic Background</th>
                <th>Age</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No patients found. Click "Add Patient" to get started.
                  </td>
                </tr>
              ) : (
                patients.map((patient) => (
                  <tr key={patient.id}>
                    <td>
                      <strong>{patient.full_name}</strong>
                      <br />
                      <small className="text-muted">{patient.email}</small>
                    </td>
                    <td>{patient.patient_id}</td>
                    <td>
                      {patient.constitution_type && (
                        <Badge bg="secondary">{patient.constitution_type}</Badge>
                      )}
                    </td>
                    <td>
                      {patient.miasmatic_background && (
                        <Badge bg="warning" text="dark">{patient.miasmatic_background}</Badge>
                      )}
                    </td>
                    <td>{patient.age || 'N/A'}</td>
                    <td>
                      <Badge bg={patient.is_active ? 'success' : 'secondary'}>
                        {patient.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td>
                      <Button size="sm" variant="outline-primary" className="me-2">
                        View
                      </Button>
                      <Button size="sm" variant="outline-secondary">
                        Cases
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );

  // Render files tab
  const renderFiles = () => (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">📁 File Management</h5>
        <div>
          <input
            type="file"
            id="fileUpload"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
            accept={homeopathyS3Config.uploadConfig.allowedFormats.map(f => `.${f}`).join(',')}
          />
          <Button
            variant="primary"
            onClick={() => document.getElementById('fileUpload').click()}
          >
            Upload File
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <Row className="mb-3">
          {homeopathyS3Config.fileCategories.map((category) => (
            <Col lg={3} md={4} sm={6} key={category.value} className="mb-3">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center">
                  <div className="display-6 mb-2">{category.icon}</div>
                  <h6 className="mb-1">{category.label}</h6>
                  <small className="text-muted">{category.description}</small>
                  <div className="mt-2">
                    <Badge bg="light" text="dark">
                      {files.filter(f => f.file_type === category.value).length} files
                    </Badge>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" />
          </div>
        ) : (
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>File Name</th>
                <th>Category</th>
                <th>Size</th>
                <th>Upload Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    No files uploaded yet. Use the "Upload File" button to get started.
                  </td>
                </tr>
              ) : (
                files.map((file) => (
                  <tr key={file.id}>
                    <td>
                      <strong>{file.name}</strong>
                    </td>
                    <td>
                      <Badge bg="info">
                        {homeopathyS3Config.fileCategories.find(c => c.value === file.file_type)?.label}
                      </Badge>
                    </td>
                    <td>{(file.size / 1024 / 1024).toFixed(2)} MB</td>
                    <td>{new Date(file.created_at).toLocaleDateString()}</td>
                    <td>
                      <Button size="sm" variant="outline-primary" className="me-2">
                        Download
                      </Button>
                      <Button size="sm" variant="outline-success" className="me-2">
                        Analyze
                      </Button>
                      <Button size="sm" variant="outline-danger">
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );

  // Render AI analysis tab
  const renderAIAnalysis = () => (
    <Card>
      <Card.Header>
        <h5 className="mb-0">🤖 AI Analysis Tools</h5>
      </Card.Header>
      <Card.Body>
        <Row>
          {homeopathyS3Config.aiAnalysisFeatures.map((feature) => (
            <Col lg={4} md={6} key={feature.id} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <h6 className="mb-2">{feature.name}</h6>
                  <p className="text-muted small mb-3">{feature.description}</p>
                  <div className="mb-3">
                    <small className="text-muted">Input Types:</small>
                    <div>
                      {feature.inputTypes.map((type) => (
                        <Badge key={type} bg="light" text="dark" className="me-1">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline-primary" size="sm" className="w-100">
                    Start Analysis
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );

  // Render analytics tab
  const renderAnalytics = () => (
    <Row>
      <Col lg={12}>
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">📈 Homeopathy Practice Analytics</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col lg={3} md={6} className="mb-3">
                <Card className="border-0 bg-primary text-white">
                  <Card.Body className="text-center">
                    <h3>{analytics.total_institutions || 0}</h3>
                    <p className="mb-0">Total Institutions</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={3} md={6} className="mb-3">
                <Card className="border-0 bg-success text-white">
                  <Card.Body className="text-center">
                    <h3>{analytics.total_patients || 0}</h3>
                    <p className="mb-0">Total Patients</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={3} md={6} className="mb-3">
                <Card className="border-0 bg-info text-white">
                  <Card.Body className="text-center">
                    <h3>{analytics.total_cases || 0}</h3>
                    <p className="mb-0">Total Cases</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={3} md={6} className="mb-3">
                <Card className="border-0 bg-warning text-white">
                  <Card.Body className="text-center">
                    <h3>{analytics.total_files || 0}</h3>
                    <p className="mb-0">Total Files</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>

      {homeopathyS3Config.analyticsConfig.charts.map((chart) => (
        <Col lg={6} key={chart.id} className="mb-4">
          <Card>
            <Card.Header>
              <h6 className="mb-0">{chart.title}</h6>
            </Card.Header>
            <Card.Body>
              <div className="text-center py-5 text-muted">
                <div className="mb-3">📊</div>
                <p>Chart visualization will be displayed here</p>
                <small>Data source: {chart.dataKey}</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );

  // Render form modal
  const renderFormModal = () => {
    let fields = [];
    let title = '';

    if (modalType === 'addInstitution') {
      fields = homeopathyS3Config.institutionFields;
      title = selectedItem ? 'Edit Institution' : 'Add New Institution';
    } else if (modalType === 'addPatient') {
      fields = homeopathyS3Config.patientFields;
      title = selectedItem ? 'Edit Patient' : 'Add New Patient';
    }

    return (
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              {fields.map((field) => (
                <Col md={field.type === 'textarea' ? 12 : 6} key={field.name} className="mb-3">
                  <Form.Group>
                    <Form.Label>{field.label} {field.required && <span className="text-danger">*</span>}</Form.Label>
                    {field.type === 'select' ? (
                      <Form.Select
                        value={formData[field.name] || ''}
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        required={field.required}
                      >
                        <option value="">Select {field.label}</option>
                        {(typeof field.options === 'string' 
                          ? homeopathyS3Config[field.options] 
                          : field.options
                        )?.map((option) => (
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
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        placeholder={field.placeholder}
                        required={field.required}
                      />
                    ) : (
                      <Form.Control
                        type={field.type}
                        value={formData[field.name] || ''}
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
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
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : (selectedItem ? 'Update' : 'Save')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  };

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h2 className="mb-0">
            <span className="me-3">🌿</span>
            {homeopathyS3Config.moduleInfo.name}
          </h2>
          <p className="text-muted mb-0">{homeopathyS3Config.moduleInfo.description}</p>
        </Col>
      </Row>

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
      <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
        <Row>
          <Col lg={2}>
            <Nav variant="pills" className="flex-column">
              {homeopathyS3Config.navigationItems.map((item) => (
                <Nav.Item key={item.id}>
                  <Nav.Link eventKey={item.id}>
                    <span className="me-2">{item.icon}</span>
                    {item.label}
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          </Col>
          <Col lg={10}>
            <Tab.Content>
              <Tab.Pane eventKey="dashboard">
                {renderDashboard()}
              </Tab.Pane>
              <Tab.Pane eventKey="institutions">
                {renderInstitutions()}
              </Tab.Pane>
              <Tab.Pane eventKey="patients">
                {renderPatients()}
              </Tab.Pane>
              <Tab.Pane eventKey="files">
                {renderFiles()}
              </Tab.Pane>
              <Tab.Pane eventKey="ai_analysis">
                {renderAIAnalysis()}
              </Tab.Pane>
              <Tab.Pane eventKey="analytics">
                {renderAnalytics()}
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>

      {/* Form Modal */}
      {renderFormModal()}
    </Container>
  );
};

export default HomeopathyS3DataManager;
