import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert, Modal, Badge, InputGroup, Tabs, Tab } from 'react-bootstrap';
import { soapNotesAPI } from '../../services/medicineAdvancedAPI';

const SOAPNotesCRUD = () => {
  const [notes, setNotes] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('notes');

  const [formData, setFormData] = useState({
    patient: '',
    doctor: '',
    visit_date: '',
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
    ai_suggestions: '',
    status: 'draft',
    template_used: ''
  });

  const statusOptions = [
    { value: 'draft', label: 'Draft', variant: 'secondary' },
    { value: 'review', label: 'Under Review', variant: 'warning' },
    { value: 'approved', label: 'Approved', variant: 'success' },
    { value: 'archived', label: 'Archived', variant: 'dark' }
  ];

  useEffect(() => {
    if (activeTab === 'notes') {
      fetchNotes();
    } else if (activeTab === 'templates') {
      fetchTemplates();
    }
  }, [activeTab, searchQuery]);

  const fetchNotes = async () => {
    setLoading(true);
    setError('');
    try {
      const params = searchQuery ? { search: searchQuery } : {};
      const data = await soapNotesAPI.getAll(params);
      setNotes(data.results || data);
    } catch (err) {
      setError('Failed to fetch SOAP notes: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await soapNotesAPI.getTemplates();
      setTemplates(data.results || data);
    } catch (err) {
      setError('Failed to fetch templates: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (modalMode === 'create') {
        await soapNotesAPI.create(formData);
        setSuccess('SOAP note created successfully!');
      } else if (modalMode === 'edit') {
        await soapNotesAPI.update(selectedNote.id, formData);
        setSuccess('SOAP note updated successfully!');
      }
      
      setShowModal(false);
      resetForm();
      await fetchNotes();
    } catch (err) {
      setError('Failed to save SOAP note: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this SOAP note?')) return;
    
    setLoading(true);
    setError('');
    
    try {
      await soapNotesAPI.delete(id);
      setSuccess('SOAP note deleted successfully!');
      await fetchNotes();
    } catch (err) {
      setError('Failed to delete SOAP note: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAI = async (id) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await soapNotesAPI.generateAISuggestions(id, {
        focus_areas: ['differential_diagnosis', 'treatment_plan', 'follow_up']
      });
      setSuccess('AI suggestions generated successfully!');
      await fetchNotes();
    } catch (err) {
      setError('Failed to generate AI suggestions: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async () => {
    const templateData = {
      name: `Template - ${formData.assessment || 'Custom'}`,
      subjective_template: formData.subjective,
      objective_template: formData.objective,
      assessment_template: formData.assessment,
      plan_template: formData.plan,
      specialty: 'general',
      is_active: true
    };

    try {
      await soapNotesAPI.createTemplate(templateData);
      setSuccess('Template created successfully!');
      await fetchTemplates();
    } catch (err) {
      setError('Failed to create template: ' + err.message);
    }
  };

  const openModal = (mode, note = null) => {
    setModalMode(mode);
    setSelectedNote(note);
    if (note && (mode === 'edit' || mode === 'view')) {
      setFormData({
        patient: note.patient || '',
        doctor: note.doctor || '',
        visit_date: note.visit_date || '',
        subjective: note.subjective || '',
        objective: note.objective || '',
        assessment: note.assessment || '',
        plan: note.plan || '',
        ai_suggestions: note.ai_suggestions || '',
        status: note.status || 'draft',
        template_used: note.template_used || ''
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      patient: '',
      doctor: '',
      visit_date: '',
      subjective: '',
      objective: '',
      assessment: '',
      plan: '',
      ai_suggestions: '',
      status: 'draft',
      template_used: ''
    });
  };

  const applyTemplate = (template) => {
    setFormData(prev => ({
      ...prev,
      subjective: template.subjective_template || '',
      objective: template.objective_template || '',
      assessment: template.assessment_template || '',
      plan: template.plan_template || '',
      template_used: template.id
    }));
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                <i className="ri-file-text-line me-2"></i>
                SOAP Notes Management
              </h4>
              <Button 
                variant="primary" 
                onClick={() => openModal('create')}
                disabled={loading}
              >
                <i className="ri-add-line me-1"></i>
                Create SOAP Note
              </Button>
            </Card.Header>

            <Card.Body>
              {/* Alerts */}
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert variant="success" dismissible onClose={() => setSuccess('')}>
                  {success}
                </Alert>
              )}

              {/* Tabs */}
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-3"
              >
                <Tab eventKey="notes" title="SOAP Notes">
                  {/* Search */}
                  <Row className="mb-3">
                    <Col md={6}>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          placeholder="Search SOAP notes..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button variant="outline-secondary">
                          <i className="ri-search-line"></i>
                        </Button>
                      </InputGroup>
                    </Col>
                  </Row>

                  {/* Notes Table */}
                  <div className="table-responsive">
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Patient</th>
                          <th>Doctor</th>
                          <th>Visit Date</th>
                          <th>Status</th>
                          <th>AI Suggestions</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="7" className="text-center">
                              <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                            </td>
                          </tr>
                        ) : notes.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="text-center text-muted">
                              No SOAP notes found
                            </td>
                          </tr>
                        ) : (
                          notes.map((note) => {
                            const statusConfig = statusOptions.find(s => s.value === note.status) || statusOptions[0];
                            return (
                              <tr key={note.id}>
                                <td>{note.id}</td>
                                <td>{note.patient_name || note.patient || 'N/A'}</td>
                                <td>{note.doctor_name || note.doctor || 'N/A'}</td>
                                <td>{note.visit_date ? new Date(note.visit_date).toLocaleDateString() : 'N/A'}</td>
                                <td>
                                  <Badge bg={statusConfig.variant}>
                                    {statusConfig.label}
                                  </Badge>
                                </td>
                                <td>
                                  {note.ai_suggestions ? (
                                    <i className="ri-check-line text-success"></i>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="outline-primary"
                                      onClick={() => handleGenerateAI(note.id)}
                                      disabled={loading}
                                    >
                                      Generate
                                    </Button>
                                  )}
                                </td>
                                <td>
                                  <div className="d-flex gap-1">
                                    <Button
                                      size="sm"
                                      variant="info"
                                      onClick={() => openModal('view', note)}
                                      title="View"
                                    >
                                      <i className="ri-eye-line"></i>
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="warning"
                                      onClick={() => openModal('edit', note)}
                                      title="Edit"
                                    >
                                      <i className="ri-edit-line"></i>
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="danger"
                                      onClick={() => handleDelete(note.id)}
                                      disabled={loading}
                                      title="Delete"
                                    >
                                      <i className="ri-delete-bin-line"></i>
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Tab>

                <Tab eventKey="templates" title="Templates">
                  <div className="table-responsive">
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Specialty</th>
                          <th>Created</th>
                          <th>Active</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {templates.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="text-center text-muted">
                              No templates found
                            </td>
                          </tr>
                        ) : (
                          templates.map((template) => (
                            <tr key={template.id}>
                              <td>{template.name}</td>
                              <td>{template.specialty}</td>
                              <td>{template.created_at ? new Date(template.created_at).toLocaleDateString() : 'N/A'}</td>
                              <td>
                                <Badge bg={template.is_active ? 'success' : 'secondary'}>
                                  {template.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                              </td>
                              <td>
                                <Button
                                  size="sm"
                                  variant="primary"
                                  onClick={() => applyTemplate(template)}
                                  title="Use Template"
                                >
                                  <i className="ri-file-copy-line"></i>
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal for Create/Edit/View */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === 'create' && 'Create SOAP Note'}
            {modalMode === 'edit' && 'Edit SOAP Note'}
            {modalMode === 'view' && 'View SOAP Note'}
          </Modal.Title>
        </Modal.Header>
        
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Patient ID/Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.patient}
                    onChange={(e) => setFormData({...formData, patient: e.target.value})}
                    required
                    disabled={modalMode === 'view'}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Doctor ID/Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.doctor}
                    onChange={(e) => setFormData({...formData, doctor: e.target.value})}
                    required
                    disabled={modalMode === 'view'}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Visit Date</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={formData.visit_date}
                    onChange={(e) => setFormData({...formData, visit_date: e.target.value})}
                    required
                    disabled={modalMode === 'view'}
                  />
                </Form.Group>
              </Col>
            </Row>

            {modalMode === 'create' && templates.length > 0 && (
              <Row className="mb-3">
                <Col>
                  <Form.Label>Use Template (Optional)</Form.Label>
                  <div className="d-flex gap-2 flex-wrap">
                    {templates.slice(0, 5).map(template => (
                      <Button
                        key={template.id}
                        size="sm"
                        variant="outline-secondary"
                        onClick={() => applyTemplate(template)}
                      >
                        {template.name}
                      </Button>
                    ))}
                  </div>
                </Col>
              </Row>
            )}

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Subjective (S)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={formData.subjective}
                    onChange={(e) => setFormData({...formData, subjective: e.target.value})}
                    placeholder="Patient's reported symptoms, history, concerns..."
                    disabled={modalMode === 'view'}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Objective (O)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={formData.objective}
                    onChange={(e) => setFormData({...formData, objective: e.target.value})}
                    placeholder="Vital signs, physical exam findings, lab results..."
                    disabled={modalMode === 'view'}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Assessment (A)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={formData.assessment}
                    onChange={(e) => setFormData({...formData, assessment: e.target.value})}
                    placeholder="Diagnosis, clinical impression, differential diagnosis..."
                    disabled={modalMode === 'view'}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Plan (P)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={formData.plan}
                    onChange={(e) => setFormData({...formData, plan: e.target.value})}
                    placeholder="Treatment plan, medications, follow-up, patient education..."
                    disabled={modalMode === 'view'}
                  />
                </Form.Group>
              </Col>
            </Row>

            {formData.ai_suggestions && (
              <Form.Group className="mb-3">
                <Form.Label>AI Suggestions</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.ai_suggestions}
                  readOnly
                  className="bg-light"
                />
              </Form.Group>
            )}

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    disabled={modalMode === 'view'}
                  >
                    {statusOptions.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6} className="d-flex align-items-end">
                {modalMode !== 'view' && (
                  <Button 
                    variant="outline-info" 
                    onClick={handleCreateTemplate}
                    className="mb-3"
                  >
                    <i className="ri-save-line me-1"></i>
                    Save as Template
                  </Button>
                )}
              </Col>
            </Row>
          </Modal.Body>
          
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              {modalMode === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {modalMode !== 'view' && (
              <Button 
                type="submit" 
                variant="primary" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Saving...
                  </>
                ) : (
                  modalMode === 'create' ? 'Create SOAP Note' : 'Update SOAP Note'
                )}
              </Button>
            )}
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default SOAPNotesCRUD;
