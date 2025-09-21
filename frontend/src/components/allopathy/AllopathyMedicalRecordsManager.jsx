import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Modal, Badge, Alert, Spinner, InputGroup, Row, Col, Nav, Tab, Accordion } from 'react-bootstrap';
import { FileText, User, Hospital, Calendar, Plus, Edit, Eye, Trash2, Search, Filter, Download, Clock } from 'lucide-react';
import axios from 'axios';

const AllopathyMedicalRecordsManager = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPatient, setFilterPatient] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [activeTab, setActiveTab] = useState('records');
  const [formData, setFormData] = useState({
    patient: '',
    hospital: '',
    title: '',
    description: '',
    diagnosis: '',
    treatment: '',
    medications: '',
    allergies: '',
    vital_signs: {},
    lab_results: {},
    notes: '',
    status: 'active'
  });

  const statusVariants = {
    'active': 'success',
    'archived': 'secondary',
    'under_review': 'warning',
    'completed': 'primary'
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await axios.get('/api/allopathy/medical-records/');
      setRecords(response.data.results || response.data);
    } catch (err) {
      setError('Failed to fetch medical records');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedRecord) {
        await axios.put(`/api/allopathy/medical-records/${selectedRecord.id}/`, formData);
        setSuccess('Medical record updated successfully');
        setShowEditModal(false);
      } else {
        await axios.post('/api/allopathy/medical-records/', formData);
        setSuccess('Medical record created successfully');
        setShowCreateModal(false);
      }
      
      resetForm();
      fetchRecords();
    } catch (err) {
      setError('Failed to save medical record');
    }
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setFormData({
      patient: record.patient,
      hospital: record.hospital,
      title: record.title,
      description: record.description,
      diagnosis: record.diagnosis,
      treatment: record.treatment,
      medications: record.medications,
      allergies: record.allergies,
      vital_signs: record.vital_signs || {},
      lab_results: record.lab_results || {},
      notes: record.notes,
      status: record.status
    });
    setShowEditModal(true);
  };

  const handleView = (record) => {
    setSelectedRecord(record);
    setShowViewModal(true);
  };

  const handleDelete = async (recordId) => {
    if (!window.confirm('Are you sure you want to delete this medical record?')) return;

    try {
      await axios.delete(`/api/allopathy/medical-records/${recordId}/`);
      setSuccess('Medical record deleted successfully');
      fetchRecords();
    } catch (err) {
      setError('Failed to delete medical record');
    }
  };

  const resetForm = () => {
    setFormData({
      patient: '',
      hospital: '',
      title: '',
      description: '',
      diagnosis: '',
      treatment: '',
      medications: '',
      allergies: '',
      vital_signs: {},
      lab_results: {},
      notes: '',
      status: 'active'
    });
    setSelectedRecord(null);
  };

  const exportRecord = async (recordId) => {
    try {
      const response = await axios.get(`/api/allopathy/medical-records/${recordId}/export/`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `medical_record_${recordId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to export medical record');
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPatient = !filterPatient || record.patient_name?.toLowerCase().includes(filterPatient.toLowerCase());
    const matchesStatus = !filterStatus || record.status === filterStatus;
    return matchesSearch && matchesPatient && matchesStatus;
  });

  if (loading) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading medical records...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <Row className="mb-4">
        <Col>
          <h2 className="mb-0">Medical Records Manager</h2>
          <p className="text-muted">Comprehensive medical record management and tracking</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            <Plus size={20} className="me-2" />
            New Record
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Search and Filter Controls */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text><Search size={20} /></InputGroup.Text>
                <Form.Control
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <InputGroup>
                <InputGroup.Text><User size={20} /></InputGroup.Text>
                <Form.Control
                  placeholder="Filter by patient..."
                  value={filterPatient}
                  onChange={(e) => setFilterPatient(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
                <option value="under_review">Under Review</option>
                <option value="completed">Completed</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <div className="text-muted">
                {filteredRecords.length} records
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Records Table */}
      <Card>
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>Title</th>
                <th>Patient</th>
                <th>Hospital</th>
                <th>Diagnosis</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map(record => (
                <tr key={record.id}>
                  <td>
                    <div>
                      <div className="fw-bold">{record.title}</div>
                      <small className="text-muted">{record.description}</small>
                    </div>
                  </td>
                  <td>{record.patient_name || record.patient}</td>
                  <td>{record.hospital_name || record.hospital}</td>
                  <td>
                    <div className="text-truncate" style={{ maxWidth: '200px' }}>
                      {record.diagnosis}
                    </div>
                  </td>
                  <td>
                    <Badge bg={statusVariants[record.status]}>
                      {record.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </td>
                  <td>
                    <small className="text-muted">
                      {new Date(record.created_at).toLocaleDateString()}
                    </small>
                  </td>
                  <td>
                    <div className="btn-group" role="group">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleView(record)}
                        title="View Record"
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => handleEdit(record)}
                        title="Edit Record"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => exportRecord(record.id)}
                        title="Export PDF"
                      >
                        <Download size={16} />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(record.id)}
                        title="Delete Record"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    <div className="text-muted">
                      {searchTerm || filterPatient || filterStatus ? 
                        'No records match your criteria' : 
                        'No medical records found'
                      }
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Create/Edit Modal */}
      <Modal 
        show={showCreateModal || showEditModal} 
        onHide={() => {
          setShowCreateModal(false);
          setShowEditModal(false);
          resetForm();
        }}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedRecord ? 'Edit Medical Record' : 'Create New Medical Record'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Tab.Container defaultActiveKey="basic">
              <Nav variant="tabs" className="mb-3">
                <Nav.Item>
                  <Nav.Link eventKey="basic">Basic Information</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="clinical">Clinical Details</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="vitals">Vital Signs & Labs</Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content>
                <Tab.Pane eventKey="basic">
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Patient *</Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.patient}
                          onChange={(e) => setFormData({...formData, patient: e.target.value})}
                          required
                          placeholder="Patient name or ID"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Hospital *</Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.hospital}
                          onChange={(e) => setFormData({...formData, hospital: e.target.value})}
                          required
                          placeholder="Hospital name or ID"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Title *</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                      placeholder="Record title or summary"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Brief description of the medical record"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                      <option value="under_review">Under Review</option>
                      <option value="completed">Completed</option>
                    </Form.Select>
                  </Form.Group>
                </Tab.Pane>

                <Tab.Pane eventKey="clinical">
                  <Form.Group className="mb-3">
                    <Form.Label>Diagnosis</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={formData.diagnosis}
                      onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                      placeholder="Primary and secondary diagnoses"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Treatment</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={formData.treatment}
                      onChange={(e) => setFormData({...formData, treatment: e.target.value})}
                      placeholder="Treatment plan and procedures"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Medications</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={formData.medications}
                      onChange={(e) => setFormData({...formData, medications: e.target.value})}
                      placeholder="Current medications and dosages"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Allergies</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={formData.allergies}
                      onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                      placeholder="Known allergies and reactions"
                    />
                  </Form.Group>
                </Tab.Pane>

                <Tab.Pane eventKey="vitals">
                  <h6>Vital Signs</h6>
                  <Row className="mb-3">
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Blood Pressure</Form.Label>
                        <Form.Control
                          placeholder="120/80"
                          value={formData.vital_signs.blood_pressure || ''}
                          onChange={(e) => setFormData({
                            ...formData, 
                            vital_signs: {...formData.vital_signs, blood_pressure: e.target.value}
                          })}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Heart Rate</Form.Label>
                        <Form.Control
                          placeholder="72 bpm"
                          value={formData.vital_signs.heart_rate || ''}
                          onChange={(e) => setFormData({
                            ...formData, 
                            vital_signs: {...formData.vital_signs, heart_rate: e.target.value}
                          })}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Temperature</Form.Label>
                        <Form.Control
                          placeholder="98.6°F"
                          value={formData.vital_signs.temperature || ''}
                          onChange={(e) => setFormData({
                            ...formData, 
                            vital_signs: {...formData.vital_signs, temperature: e.target.value}
                          })}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Oxygen Saturation</Form.Label>
                        <Form.Control
                          placeholder="98%"
                          value={formData.vital_signs.oxygen_saturation || ''}
                          onChange={(e) => setFormData({
                            ...formData, 
                            vital_signs: {...formData.vital_signs, oxygen_saturation: e.target.value}
                          })}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <h6>Lab Results</h6>
                  <Form.Group className="mb-3">
                    <Form.Label>Lab Results (JSON format)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={JSON.stringify(formData.lab_results, null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          setFormData({...formData, lab_results: parsed});
                        } catch (err) {
                          // Invalid JSON, keep typing
                        }
                      }}
                      placeholder='{"glucose": "90 mg/dL", "hemoglobin": "14.2 g/dL"}'
                    />
                    <Form.Text className="text-muted">
                      Enter lab results in JSON format or leave empty
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Additional Notes</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="Additional clinical notes and observations"
                    />
                  </Form.Group>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {selectedRecord ? 'Update Record' : 'Create Record'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* View Record Modal */}
      <Modal 
        show={showViewModal} 
        onHide={() => setShowViewModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Medical Record Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRecord && (
            <div>
              <Row className="mb-4">
                <Col md={6}>
                  <h6>Basic Information</h6>
                  <p><strong>Title:</strong> {selectedRecord.title}</p>
                  <p><strong>Patient:</strong> {selectedRecord.patient_name || selectedRecord.patient}</p>
                  <p><strong>Hospital:</strong> {selectedRecord.hospital_name || selectedRecord.hospital}</p>
                  <p><strong>Status:</strong> 
                    <Badge bg={statusVariants[selectedRecord.status]} className="ms-2">
                      {selectedRecord.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </p>
                </Col>
                <Col md={6}>
                  <h6>Timeline</h6>
                  <p><strong>Created:</strong> {new Date(selectedRecord.created_at).toLocaleString()}</p>
                  <p><strong>Updated:</strong> {new Date(selectedRecord.updated_at).toLocaleString()}</p>
                </Col>
              </Row>

              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Description & Diagnosis</Accordion.Header>
                  <Accordion.Body>
                    <p><strong>Description:</strong></p>
                    <p>{selectedRecord.description || 'No description provided'}</p>
                    <p><strong>Diagnosis:</strong></p>
                    <p>{selectedRecord.diagnosis || 'No diagnosis recorded'}</p>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                  <Accordion.Header>Treatment & Medications</Accordion.Header>
                  <Accordion.Body>
                    <p><strong>Treatment:</strong></p>
                    <p>{selectedRecord.treatment || 'No treatment plan recorded'}</p>
                    <p><strong>Medications:</strong></p>
                    <p>{selectedRecord.medications || 'No medications recorded'}</p>
                    <p><strong>Allergies:</strong></p>
                    <p>{selectedRecord.allergies || 'No known allergies'}</p>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
                  <Accordion.Header>Vital Signs & Lab Results</Accordion.Header>
                  <Accordion.Body>
                    <p><strong>Vital Signs:</strong></p>
                    <pre className="bg-light p-2 rounded">
                      {JSON.stringify(selectedRecord.vital_signs || {}, null, 2)}
                    </pre>
                    <p><strong>Lab Results:</strong></p>
                    <pre className="bg-light p-2 rounded">
                      {JSON.stringify(selectedRecord.lab_results || {}, null, 2)}
                    </pre>
                  </Accordion.Body>
                </Accordion.Item>

                {selectedRecord.notes && (
                  <Accordion.Item eventKey="3">
                    <Accordion.Header>Additional Notes</Accordion.Header>
                    <Accordion.Body>
                      {selectedRecord.notes}
                    </Accordion.Body>
                  </Accordion.Item>
                )}
              </Accordion>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
          <Button 
            variant="outline-warning" 
            onClick={() => {
              setShowViewModal(false);
              handleEdit(selectedRecord);
            }}
          >
            <Edit size={16} className="me-2" />
            Edit Record
          </Button>
          <Button 
            variant="primary" 
            onClick={() => exportRecord(selectedRecord.id)}
          >
            <Download size={16} className="me-2" />
            Export PDF
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AllopathyMedicalRecordsManager;
