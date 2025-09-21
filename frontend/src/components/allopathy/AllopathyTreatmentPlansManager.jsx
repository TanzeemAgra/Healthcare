import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Modal, Badge, Alert, Spinner, InputGroup, Row, Col, ProgressBar, Nav, Tab } from 'react-bootstrap';
import { Calendar, User, Clock, Target, Plus, Edit, Eye, Trash2, Search, Filter, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const AllopathyTreatmentPlansManager = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPatient, setFilterPatient] = useState('');
  const [formData, setFormData] = useState({
    patient: '',
    hospital: '',
    medical_record: '',
    title: '',
    diagnosis: '',
    goals: '',
    procedures: '',
    medications: '',
    lifestyle_recommendations: '',
    follow_up_schedule: '',
    expected_duration: '',
    expected_end_date: '',
    actual_end_date: '',
    progress_notes: '',
    status: 'active',
    priority: 'medium'
  });

  const statusVariants = {
    'active': 'primary',
    'completed': 'success',
    'on_hold': 'warning',
    'cancelled': 'danger',
    'under_review': 'info'
  };

  const priorityVariants = {
    'low': 'secondary',
    'medium': 'warning',
    'high': 'danger',
    'urgent': 'dark'
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get('/api/allopathy/treatment-plans/');
      setPlans(response.data.results || response.data);
    } catch (err) {
      setError('Failed to fetch treatment plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedPlan) {
        await axios.put(`/api/allopathy/treatment-plans/${selectedPlan.id}/`, formData);
        setSuccess('Treatment plan updated successfully');
        setShowEditModal(false);
      } else {
        await axios.post('/api/allopathy/treatment-plans/', formData);
        setSuccess('Treatment plan created successfully');
        setShowCreateModal(false);
      }
      
      resetForm();
      fetchPlans();
    } catch (err) {
      setError('Failed to save treatment plan');
    }
  };

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setFormData({
      patient: plan.patient,
      hospital: plan.hospital,
      medical_record: plan.medical_record,
      title: plan.title,
      diagnosis: plan.diagnosis,
      goals: plan.goals,
      procedures: plan.procedures,
      medications: plan.medications,
      lifestyle_recommendations: plan.lifestyle_recommendations,
      follow_up_schedule: plan.follow_up_schedule,
      expected_duration: plan.expected_duration,
      expected_end_date: plan.expected_end_date || '',
      actual_end_date: plan.actual_end_date || '',
      progress_notes: plan.progress_notes,
      status: plan.status,
      priority: plan.priority
    });
    setShowEditModal(true);
  };

  const handleView = (plan) => {
    setSelectedPlan(plan);
    setShowViewModal(true);
  };

  const handleDelete = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this treatment plan?')) return;

    try {
      await axios.delete(`/api/allopathy/treatment-plans/${planId}/`);
      setSuccess('Treatment plan deleted successfully');
      fetchPlans();
    } catch (err) {
      setError('Failed to delete treatment plan');
    }
  };

  const markCompleted = async (planId) => {
    try {
      await axios.patch(`/api/allopathy/treatment-plans/${planId}/`, {
        status: 'completed',
        actual_end_date: new Date().toISOString().split('T')[0]
      });
      setSuccess('Treatment plan marked as completed');
      fetchPlans();
    } catch (err) {
      setError('Failed to update treatment plan status');
    }
  };

  const resetForm = () => {
    setFormData({
      patient: '',
      hospital: '',
      medical_record: '',
      title: '',
      diagnosis: '',
      goals: '',
      procedures: '',
      medications: '',
      lifestyle_recommendations: '',
      follow_up_schedule: '',
      expected_duration: '',
      expected_end_date: '',
      actual_end_date: '',
      progress_notes: '',
      status: 'active',
      priority: 'medium'
    });
    setSelectedPlan(null);
  };

  const calculateProgress = (plan) => {
    if (plan.status === 'completed') return 100;
    if (plan.status === 'cancelled') return 0;
    
    const startDate = new Date(plan.created_at);
    const expectedEndDate = new Date(plan.expected_end_date);
    const currentDate = new Date();
    
    if (currentDate >= expectedEndDate) return 100;
    
    const totalDuration = expectedEndDate - startDate;
    const elapsed = currentDate - startDate;
    
    return Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
  };

  const getDaysRemaining = (plan) => {
    if (plan.status === 'completed' || plan.status === 'cancelled') return null;
    
    const expectedEndDate = new Date(plan.expected_end_date);
    const currentDate = new Date();
    const diffTime = expectedEndDate - currentDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.goals.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || plan.status === filterStatus;
    const matchesPatient = !filterPatient || plan.patient_name?.toLowerCase().includes(filterPatient.toLowerCase());
    return matchesSearch && matchesStatus && matchesPatient;
  });

  if (loading) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading treatment plans...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <Row className="mb-4">
        <Col>
          <h2 className="mb-0">Treatment Plans Manager</h2>
          <p className="text-muted">Comprehensive treatment planning and progress tracking</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            <Plus size={20} className="me-2" />
            New Treatment Plan
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
                  placeholder="Search treatment plans..."
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
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
                <option value="cancelled">Cancelled</option>
                <option value="under_review">Under Review</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <div className="text-muted">
                {filteredPlans.length} plans
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Treatment Plans Table */}
      <Card>
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>Plan</th>
                <th>Patient</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Timeline</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlans.map(plan => {
                const progress = calculateProgress(plan);
                const daysRemaining = getDaysRemaining(plan);
                
                return (
                  <tr key={plan.id}>
                    <td>
                      <div>
                        <div className="fw-bold">{plan.title}</div>
                        <small className="text-muted">{plan.diagnosis}</small>
                      </div>
                    </td>
                    <td>{plan.patient_name || plan.patient}</td>
                    <td>
                      <Badge bg={priorityVariants[plan.priority]}>
                        {plan.priority.toUpperCase()}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={statusVariants[plan.status]}>
                        {plan.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </td>
                    <td>
                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <small>{progress.toFixed(0)}%</small>
                        </div>
                        <ProgressBar 
                          now={progress} 
                          variant={
                            plan.status === 'completed' ? 'success' :
                            plan.status === 'cancelled' ? 'danger' :
                            progress > 80 ? 'warning' : 'primary'
                          }
                          style={{ height: '6px' }}
                        />
                      </div>
                    </td>
                    <td>
                      <div>
                        <small className="text-muted">
                          Expected: {plan.expected_end_date ? 
                            new Date(plan.expected_end_date).toLocaleDateString() : 
                            'Not set'
                          }
                        </small>
                        {daysRemaining !== null && (
                          <div>
                            <small className={`${daysRemaining < 0 ? 'text-danger' : daysRemaining < 7 ? 'text-warning' : 'text-muted'}`}>
                              {daysRemaining < 0 ? 
                                `${Math.abs(daysRemaining)} days overdue` : 
                                `${daysRemaining} days remaining`
                              }
                            </small>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleView(plan)}
                          title="View Plan"
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          variant="outline-warning"
                          size="sm"
                          onClick={() => handleEdit(plan)}
                          title="Edit Plan"
                        >
                          <Edit size={16} />
                        </Button>
                        {plan.status === 'active' && (
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => markCompleted(plan.id)}
                            title="Mark Completed"
                          >
                            <CheckCircle size={16} />
                          </Button>
                        )}
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(plan.id)}
                          title="Delete Plan"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredPlans.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    <div className="text-muted">
                      {searchTerm || filterStatus || filterPatient ? 
                        'No treatment plans match your criteria' : 
                        'No treatment plans found'
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
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedPlan ? 'Edit Treatment Plan' : 'Create New Treatment Plan'}
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
                  <Nav.Link eventKey="treatment">Treatment Details</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="schedule">Schedule & Progress</Nav.Link>
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

                  <Row>
                    <Col md={8}>
                      <Form.Group className="mb-3">
                        <Form.Label>Treatment Plan Title *</Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          required
                          placeholder="Brief title for the treatment plan"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Medical Record</Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.medical_record}
                          onChange={(e) => setFormData({...formData, medical_record: e.target.value})}
                          placeholder="Associated record ID"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Primary Diagnosis *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={formData.diagnosis}
                      onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                      required
                      placeholder="Primary diagnosis and related conditions"
                    />
                  </Form.Group>

                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Priority</Form.Label>
                        <Form.Select
                          value={formData.priority}
                          onChange={(e) => setFormData({...formData, priority: e.target.value})}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value})}
                        >
                          <option value="active">Active</option>
                          <option value="completed">Completed</option>
                          <option value="on_hold">On Hold</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="under_review">Under Review</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Expected Duration</Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.expected_duration}
                          onChange={(e) => setFormData({...formData, expected_duration: e.target.value})}
                          placeholder="e.g., 4 weeks, 6 months"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Tab.Pane>

                <Tab.Pane eventKey="treatment">
                  <Form.Group className="mb-3">
                    <Form.Label>Treatment Goals</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={formData.goals}
                      onChange={(e) => setFormData({...formData, goals: e.target.value})}
                      placeholder="Primary goals and expected outcomes"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Procedures & Interventions</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={formData.procedures}
                      onChange={(e) => setFormData({...formData, procedures: e.target.value})}
                      placeholder="Planned procedures, therapies, and interventions"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Medications</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={formData.medications}
                      onChange={(e) => setFormData({...formData, medications: e.target.value})}
                      placeholder="Prescribed medications, dosages, and schedules"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Lifestyle Recommendations</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={formData.lifestyle_recommendations}
                      onChange={(e) => setFormData({...formData, lifestyle_recommendations: e.target.value})}
                      placeholder="Diet, exercise, activity restrictions, etc."
                    />
                  </Form.Group>
                </Tab.Pane>

                <Tab.Pane eventKey="schedule">
                  <Form.Group className="mb-3">
                    <Form.Label>Follow-up Schedule</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={formData.follow_up_schedule}
                      onChange={(e) => setFormData({...formData, follow_up_schedule: e.target.value})}
                      placeholder="Scheduled appointments, check-ups, and reviews"
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Expected End Date</Form.Label>
                        <Form.Control
                          type="date"
                          value={formData.expected_end_date}
                          onChange={(e) => setFormData({...formData, expected_end_date: e.target.value})}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Actual End Date</Form.Label>
                        <Form.Control
                          type="date"
                          value={formData.actual_end_date}
                          onChange={(e) => setFormData({...formData, actual_end_date: e.target.value})}
                        />
                        <Form.Text className="text-muted">
                          Leave empty if treatment is ongoing
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Progress Notes</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={formData.progress_notes}
                      onChange={(e) => setFormData({...formData, progress_notes: e.target.value})}
                      placeholder="Treatment progress, patient response, adjustments made"
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
              {selectedPlan ? 'Update Plan' : 'Create Plan'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* View Treatment Plan Modal */}
      <Modal 
        show={showViewModal} 
        onHide={() => setShowViewModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Treatment Plan Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPlan && (
            <div>
              <Row className="mb-4">
                <Col md={8}>
                  <h5>{selectedPlan.title}</h5>
                  <p className="text-muted">{selectedPlan.diagnosis}</p>
                </Col>
                <Col md={4} className="text-end">
                  <Badge bg={statusVariants[selectedPlan.status]} className="me-2">
                    {selectedPlan.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <Badge bg={priorityVariants[selectedPlan.priority]}>
                    {selectedPlan.priority.toUpperCase()}
                  </Badge>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col md={6}>
                  <p><strong>Patient:</strong> {selectedPlan.patient_name || selectedPlan.patient}</p>
                  <p><strong>Hospital:</strong> {selectedPlan.hospital_name || selectedPlan.hospital}</p>
                  <p><strong>Expected Duration:</strong> {selectedPlan.expected_duration || 'Not specified'}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Created:</strong> {new Date(selectedPlan.created_at).toLocaleDateString()}</p>
                  <p><strong>Expected End:</strong> {selectedPlan.expected_end_date ? 
                    new Date(selectedPlan.expected_end_date).toLocaleDateString() : 'Not set'}</p>
                  {selectedPlan.actual_end_date && (
                    <p><strong>Actual End:</strong> {new Date(selectedPlan.actual_end_date).toLocaleDateString()}</p>
                  )}
                </Col>
              </Row>

              <Tab.Container defaultActiveKey="goals">
                <Nav variant="pills" className="mb-3">
                  <Nav.Item>
                    <Nav.Link eventKey="goals">Goals & Treatment</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="schedule">Schedule & Progress</Nav.Link>
                  </Nav.Item>
                </Nav>

                <Tab.Content>
                  <Tab.Pane eventKey="goals">
                    <h6>Treatment Goals</h6>
                    <p>{selectedPlan.goals || 'No goals specified'}</p>

                    <h6>Procedures & Interventions</h6>
                    <p>{selectedPlan.procedures || 'No procedures specified'}</p>

                    <h6>Medications</h6>
                    <p>{selectedPlan.medications || 'No medications specified'}</p>

                    <h6>Lifestyle Recommendations</h6>
                    <p>{selectedPlan.lifestyle_recommendations || 'No recommendations specified'}</p>
                  </Tab.Pane>

                  <Tab.Pane eventKey="schedule">
                    <h6>Follow-up Schedule</h6>
                    <p>{selectedPlan.follow_up_schedule || 'No schedule specified'}</p>

                    <h6>Progress Notes</h6>
                    <div className="bg-light p-3 rounded">
                      <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
                        {selectedPlan.progress_notes || 'No progress notes available'}
                      </pre>
                    </div>

                    <div className="mt-3">
                      <h6>Treatment Progress</h6>
                      <ProgressBar 
                        now={calculateProgress(selectedPlan)} 
                        label={`${calculateProgress(selectedPlan).toFixed(0)}%`}
                        variant={
                          selectedPlan.status === 'completed' ? 'success' :
                          selectedPlan.status === 'cancelled' ? 'danger' :
                          calculateProgress(selectedPlan) > 80 ? 'warning' : 'primary'
                        }
                      />
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
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
              handleEdit(selectedPlan);
            }}
          >
            <Edit size={16} className="me-2" />
            Edit Plan
          </Button>
          {selectedPlan?.status === 'active' && (
            <Button 
              variant="success" 
              onClick={() => {
                setShowViewModal(false);
                markCompleted(selectedPlan.id);
              }}
            >
              <CheckCircle size={16} className="me-2" />
              Mark Completed
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AllopathyTreatmentPlansManager;
