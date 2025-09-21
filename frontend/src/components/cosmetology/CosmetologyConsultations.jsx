import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Button, Form, Table, Badge, 
  Alert, Modal, Tabs, Tab, InputGroup, Pagination, Spinner,
  ProgressBar, ListGroup 
} from 'react-bootstrap';
import { 
  FaStethoscope, FaPlus, FaEdit, FaEye, FaSearch, FaFilter, 
  FaBrain, FaCalendarAlt, FaUser, FaFileAlt, FaImage,
  FaCheckCircle, FaExclamationTriangle, FaStar, FaClock
} from 'react-icons/fa';
import ProtectedRoute from '../common/ProtectedRoute';
import apiClient from '../../services/api';
import { 
  COSMETOLOGY_ENDPOINTS, 
  CONSULTATION_TYPES, 
  AI_ANALYSIS_TYPES,
  VALIDATION_RULES,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES 
} from '../../constants/cosmetologyConstants';

const CosmetologyConsultations = () => {
  // State Management
  const [consultations, setConsultations] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create'); // create, edit, view
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [aiAnalysisRunning, setAiAnalysisRunning] = useState(false);

  // Form State
  const [consultationForm, setConsultationForm] = useState({
    client: '',
    consultation_type: 'initial',
    consultation_date: '',
    consultation_time: '',
    consultation_fee: '',
    primary_concerns: '',
    beauty_goals: '',
    lifestyle_factors: '',
    skin_analysis: '',
    hair_analysis: '',
    scalp_condition: '',
    immediate_recommendations: '',
    long_term_plan: '',
    product_recommendations: '',
    next_consultation_date: '',
    skin_photos: []
  });

  // Load data on component mount
  useEffect(() => {
    fetchConsultations();
    fetchClients();
  }, []);

  // Fetch consultations from API
  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(COSMETOLOGY_ENDPOINTS.CONSULTATIONS);
      setConsultations(response.data.results || response.data);
    } catch (error) {
      showAlert(ERROR_MESSAGES.NETWORK_ERROR, 'danger');
      console.error('Error fetching consultations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch clients for dropdown
  const fetchClients = async () => {
    try {
      const response = await apiClient.get(COSMETOLOGY_ENDPOINTS.CLIENTS);
      setClients(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  // Show alert helper
  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConsultationForm(prev => {
      const updated = {
        ...prev,
        [name]: value
      };

      // Auto-fill consultation fee when type is selected
      if (name === 'consultation_type' && value) {
        const consultationType = CONSULTATION_TYPES[value.toUpperCase()];
        if (consultationType) {
          updated.consultation_fee = consultationType.price;
        }
      }

      return updated;
    });
  };

  // Validate form
  const validateForm = () => {
    if (!consultationForm.client) {
      showAlert('Please select a client', 'danger');
      return false;
    }
    
    if (!consultationForm.consultation_date || !consultationForm.consultation_time) {
      showAlert('Please select date and time', 'danger');
      return false;
    }
    
    if (!consultationForm.primary_concerns || consultationForm.primary_concerns.length < 10) {
      showAlert('Primary concerns must be at least 10 characters', 'danger');
      return false;
    }
    
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const consultationDateTime = `${consultationForm.consultation_date}T${consultationForm.consultation_time}:00`;
      
      const payload = {
        ...consultationForm,
        consultation_date: consultationDateTime,
        consultation_fee: parseFloat(consultationForm.consultation_fee) || 0,
        cosmetologist: 1 // Default cosmetologist, should be from auth context
      };

      delete payload.consultation_time; // Remove separate time field

      if (modalType === 'create') {
        await apiClient.post(COSMETOLOGY_ENDPOINTS.CONSULTATIONS, payload);
        showAlert('Consultation scheduled successfully!');
      } else if (modalType === 'edit') {
        await apiClient.put(`${COSMETOLOGY_ENDPOINTS.CONSULTATIONS}/${selectedConsultation.id}/`, payload);
        showAlert('Consultation updated successfully!');
      }
      
      fetchConsultations();
      closeModal();
    } catch (error) {
      showAlert(ERROR_MESSAGES.SERVER_ERROR, 'danger');
      console.error('Error saving consultation:', error);
    }
  };

  // Open modal
  const openModal = (type, consultation = null) => {
    setModalType(type);
    setSelectedConsultation(consultation);
    
    if (type === 'create') {
      setConsultationForm({
        client: '',
        consultation_type: 'initial',
        consultation_date: '',
        consultation_time: '',
        consultation_fee: CONSULTATION_TYPES.INITIAL.price,
        primary_concerns: '',
        beauty_goals: '',
        lifestyle_factors: '',
        skin_analysis: '',
        hair_analysis: '',
        scalp_condition: '',
        immediate_recommendations: '',
        long_term_plan: '',
        product_recommendations: '',
        next_consultation_date: '',
        skin_photos: []
      });
    } else if (type === 'edit' && consultation) {
      const consultationDate = new Date(consultation.consultation_date);
      setConsultationForm({
        ...consultation,
        consultation_date: consultationDate.toISOString().split('T')[0],
        consultation_time: consultationDate.toTimeString().split(' ')[0].substring(0, 5),
        next_consultation_date: consultation.next_consultation_date ? 
          new Date(consultation.next_consultation_date).toISOString().split('T')[0] : ''
      });
    }
    
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedConsultation(null);
    setModalType('create');
  };

  // Run AI Analysis
  const runAIAnalysis = async (consultationId, analysisType) => {
    try {
      setAiAnalysisRunning(true);
      
      // Simulate AI analysis API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      showAlert(`AI ${analysisType} completed successfully!`, 'success');
      // In a real implementation, this would update the consultation with AI results
      
    } catch (error) {
      showAlert(ERROR_MESSAGES.AI_PROCESSING_ERROR, 'danger');
      console.error('Error running AI analysis:', error);
    } finally {
      setAiAnalysisRunning(false);
    }
  };

  // Filter consultations
  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = 
      consultation.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.primary_concerns?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.cosmetologist_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || consultation.consultation_type === filterType;
    
    const matchesDate = !filterDate || 
      new Date(consultation.consultation_date).toISOString().split('T')[0] === filterDate;
    
    return matchesSearch && matchesType && matchesDate;
  });

  // Sort consultations by date (most recent first)
  const sortedConsultations = filteredConsultations.sort((a, b) => 
    new Date(b.consultation_date) - new Date(a.consultation_date)
  );

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedConsultations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedConsultations = sortedConsultations.slice(startIndex, startIndex + itemsPerPage);

  // Get consultation type details
  const getConsultationTypeDetails = (type) => {
    return CONSULTATION_TYPES[type?.toUpperCase()] || 
           { label: type, duration: 30, price: 50, aiFeatures: [] };
  };

  // Format date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  // Calculate consultation status based on date
  const getConsultationStatus = (consultation) => {
    const consultationDate = new Date(consultation.consultation_date);
    const now = new Date();
    const diffMinutes = (consultationDate - now) / (1000 * 60);
    
    if (diffMinutes > 60) {
      return { label: 'Scheduled', variant: 'primary', icon: 'fa-calendar-check' };
    } else if (diffMinutes > 0) {
      return { label: 'Soon', variant: 'warning', icon: 'fa-clock' };
    } else if (diffMinutes > -120) {
      return { label: 'In Progress', variant: 'info', icon: 'fa-play-circle' };
    } else {
      return { label: 'Completed', variant: 'success', icon: 'fa-check-circle' };
    }
  };

  return (
    <ProtectedRoute>
      <Container fluid className="py-4">
        {/* Alert */}
        {alert.show && (
          <Alert variant={alert.type} dismissible onClose={() => setAlert({ show: false })}>
            {alert.message}
          </Alert>
        )}

        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="mb-0">
                  <FaStethoscope className="me-2" />
                  Beauty Consultations
                </h2>
                <p className="text-muted mb-0">AI-powered beauty analysis and consultation management</p>
              </div>
              <Button 
                variant="primary" 
                onClick={() => openModal('create')}
                className="d-flex align-items-center"
              >
                <FaPlus className="me-2" />
                Schedule Consultation
              </Button>
            </div>
          </Col>
        </Row>

        {/* Search and Filter Bar */}
        <Row className="mb-4">
          <Col md={4}>
            <InputGroup>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search by client, concerns, or cosmetologist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={3}>
            <Form.Select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              {Object.values(CONSULTATION_TYPES).map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Control
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </Col>
          <Col md={2}>
            <div className="text-muted">
              {filteredConsultations.length} consultation{filteredConsultations.length !== 1 ? 's' : ''} found
            </div>
          </Col>
        </Row>

        {/* Consultations Table */}
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Consultation Schedule</h5>
            <Badge bg="info" className="d-flex align-items-center">
              <FaBrain className="me-1" />
              AI-Enhanced Analysis
            </Badge>
          </Card.Header>
          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : paginatedConsultations.length === 0 ? (
              <div className="text-center py-5">
                <FaStethoscope size={48} className="text-muted mb-3" />
                <h5>No consultations found</h5>
                <p className="text-muted">No consultations match your current search criteria.</p>
                <Button variant="primary" onClick={() => openModal('create')}>
                  Schedule First Consultation
                </Button>
              </div>
            ) : (
              <Table responsive striped hover className="mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Date & Time</th>
                    <th>Client</th>
                    <th>Type</th>
                    <th>Primary Concerns</th>
                    <th>Status</th>
                    <th>Fee</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedConsultations.map(consultation => {
                    const dateTime = formatDateTime(consultation.consultation_date);
                    const typeDetails = getConsultationTypeDetails(consultation.consultation_type);
                    const status = getConsultationStatus(consultation);
                    
                    return (
                      <tr key={consultation.id}>
                        <td>
                          <div>
                            <strong>{dateTime.date}</strong>
                            <br />
                            <small className="text-muted">{dateTime.time}</small>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <FaUser className="me-2 text-muted" />
                            <span>{consultation.client_name}</span>
                          </div>
                        </td>
                        <td>
                          <Badge bg="primary" className="d-flex align-items-center w-100">
                            <FaClock className="me-1" />
                            {typeDetails.label}
                          </Badge>
                          <small className="text-muted">{typeDetails.duration}min</small>
                        </td>
                        <td>
                          <div className="text-truncate" style={{ maxWidth: '200px' }}>
                            {consultation.primary_concerns}
                          </div>
                        </td>
                        <td>
                          <Badge bg={status.variant} className="d-flex align-items-center">
                            <i className={`fas ${status.icon} me-1`}></i>
                            {status.label}
                          </Badge>
                        </td>
                        <td>
                          <strong className="text-success">${consultation.consultation_fee}</strong>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => openModal('view', consultation)}
                              title="View Details"
                            >
                              <FaEye />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-warning"
                              onClick={() => openModal('edit', consultation)}
                              title="Edit Consultation"
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-info"
                              onClick={() => runAIAnalysis(consultation.id, 'Skin Analysis')}
                              title="Run AI Analysis"
                              disabled={aiAnalysisRunning}
                            >
                              <FaBrain />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
          </Card.Body>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Card.Footer>
              <div className="d-flex justify-content-between align-items-center">
                <div className="text-muted">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredConsultations.length)} of {filteredConsultations.length} entries
                </div>
                <Pagination className="mb-0">
                  <Pagination.Prev 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  />
                  {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                      key={index + 1}
                      active={index + 1 === currentPage}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  />
                </Pagination>
              </div>
            </Card.Footer>
          )}
        </Card>

        {/* Consultation Modal */}
        <Modal show={showModal} onHide={closeModal} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>
              {modalType === 'create' && 'Schedule New Consultation'}
              {modalType === 'edit' && 'Edit Consultation'}
              {modalType === 'view' && 'Consultation Details'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalType === 'view' && selectedConsultation ? (
              // View Mode
              <Tabs defaultActiveKey="details" id="consultation-details-tabs">
                <Tab eventKey="details" title="Consultation Details">
                  <div className="mt-3">
                    <Row>
                      <Col md={8}>
                        <h5>Consultation Summary</h5>
                        <div className="mb-3">
                          <strong>Client:</strong> {selectedConsultation.client_name}<br />
                          <strong>Date:</strong> {formatDateTime(selectedConsultation.consultation_date).date}<br />
                          <strong>Time:</strong> {formatDateTime(selectedConsultation.consultation_date).time}<br />
                          <strong>Type:</strong> {getConsultationTypeDetails(selectedConsultation.consultation_type).label}<br />
                          <strong>Fee:</strong> ${selectedConsultation.consultation_fee}
                        </div>
                        
                        <h6>Primary Concerns</h6>
                        <p>{selectedConsultation.primary_concerns}</p>
                        
                        {selectedConsultation.beauty_goals && (
                          <>
                            <h6>Beauty Goals</h6>
                            <p>{selectedConsultation.beauty_goals}</p>
                          </>
                        )}
                        
                        {selectedConsultation.lifestyle_factors && (
                          <>
                            <h6>Lifestyle Factors</h6>
                            <p>{selectedConsultation.lifestyle_factors}</p>
                          </>
                        )}
                      </Col>
                      <Col md={4}>
                        <Card className="bg-light">
                          <Card.Body>
                            <h6>Quick Actions</h6>
                            <div className="d-grid gap-2">
                              <Button 
                                variant="outline-info" 
                                size="sm"
                                onClick={() => runAIAnalysis(selectedConsultation.id, 'Skin Analysis')}
                                disabled={aiAnalysisRunning}
                              >
                                <FaBrain className="me-2" />
                                {aiAnalysisRunning ? 'Running...' : 'AI Skin Analysis'}
                              </Button>
                              <Button variant="outline-success" size="sm">
                                <FaCalendarAlt className="me-2" />
                                Schedule Follow-up
                              </Button>
                              <Button variant="outline-primary" size="sm">
                                <FaFileAlt className="me-2" />
                                Generate Report
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                </Tab>
                
                <Tab eventKey="analysis" title="Analysis Results">
                  <div className="mt-3">
                    <Row>
                      <Col md={6}>
                        <h6>Skin Analysis</h6>
                        {selectedConsultation.skin_analysis ? (
                          <Card className="bg-light">
                            <Card.Body>
                              <p>{selectedConsultation.skin_analysis}</p>
                            </Card.Body>
                          </Card>
                        ) : (
                          <p className="text-muted">No skin analysis recorded yet.</p>
                        )}
                      </Col>
                      <Col md={6}>
                        <h6>Hair Analysis</h6>
                        {selectedConsultation.hair_analysis ? (
                          <Card className="bg-light">
                            <Card.Body>
                              <p>{selectedConsultation.hair_analysis}</p>
                            </Card.Body>
                          </Card>
                        ) : (
                          <p className="text-muted">No hair analysis recorded yet.</p>
                        )}
                      </Col>
                    </Row>
                    
                    {selectedConsultation.scalp_condition && (
                      <div className="mt-3">
                        <h6>Scalp Condition</h6>
                        <Card className="bg-light">
                          <Card.Body>
                            <p>{selectedConsultation.scalp_condition}</p>
                          </Card.Body>
                        </Card>
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <h6>AI Analysis Types Available</h6>
                      <Row>
                        {Object.values(AI_ANALYSIS_TYPES).slice(0, 4).map((analysis, index) => (
                          <Col md={6} key={index} className="mb-3">
                            <Card className="border-info">
                              <Card.Body className="p-3">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                  <h6 className="text-info mb-0">{analysis.label}</h6>
                                  <Badge bg="info">{analysis.accuracy}</Badge>
                                </div>
                                <p className="small text-muted mb-2">{analysis.description}</p>
                                <div className="d-flex justify-content-between align-items-center">
                                  <small className="text-muted">{analysis.processing_time}</small>
                                  <Button 
                                    size="sm" 
                                    variant="outline-info"
                                    onClick={() => runAIAnalysis(selectedConsultation.id, analysis.label)}
                                    disabled={aiAnalysisRunning}
                                  >
                                    {aiAnalysisRunning ? 'Running...' : 'Run'}
                                  </Button>
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  </div>
                </Tab>
                
                <Tab eventKey="recommendations" title="Recommendations">
                  <div className="mt-3">
                    <h6>Immediate Recommendations</h6>
                    {selectedConsultation.immediate_recommendations ? (
                      <Card className="bg-light mb-3">
                        <Card.Body>
                          <p>{selectedConsultation.immediate_recommendations}</p>
                        </Card.Body>
                      </Card>
                    ) : (
                      <p className="text-muted">No immediate recommendations recorded yet.</p>
                    )}
                    
                    <h6>Long-term Treatment Plan</h6>
                    {selectedConsultation.long_term_plan ? (
                      <Card className="bg-light mb-3">
                        <Card.Body>
                          <p>{selectedConsultation.long_term_plan}</p>
                        </Card.Body>
                      </Card>
                    ) : (
                      <p className="text-muted">No long-term plan recorded yet.</p>
                    )}
                    
                    <h6>Product Recommendations</h6>
                    {selectedConsultation.product_recommendations ? (
                      <Card className="bg-light">
                        <Card.Body>
                          <p>{selectedConsultation.product_recommendations}</p>
                        </Card.Body>
                      </Card>
                    ) : (
                      <p className="text-muted">No product recommendations recorded yet.</p>
                    )}
                  </div>
                </Tab>
                
                <Tab eventKey="photos" title="Photos & Documentation">
                  <div className="mt-3">
                    <h6>Consultation Photos</h6>
                    {selectedConsultation.skin_photos && selectedConsultation.skin_photos.length > 0 ? (
                      <Row>
                        {selectedConsultation.skin_photos.map((photo, index) => (
                          <Col md={4} key={index} className="mb-3">
                            <Card>
                              <Card.Img variant="top" src={photo.url} alt={`Photo ${index + 1}`} />
                              <Card.Body className="p-2">
                                <small className="text-muted">{photo.description || `Photo ${index + 1}`}</small>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    ) : (
                      <div className="text-center py-4">
                        <FaImage size={48} className="text-muted mb-3" />
                        <p className="text-muted">No photos uploaded for this consultation.</p>
                        <Button variant="outline-primary">
                          <FaImage className="me-2" />
                          Upload Photos
                        </Button>
                      </div>
                    )}
                  </div>
                </Tab>
              </Tabs>
            ) : (
              // Create/Edit Form
              <Form onSubmit={handleSubmit}>
                <Tabs defaultActiveKey="basic" id="consultation-form-tabs">
                  <Tab eventKey="basic" title="Basic Information">
                    <div className="mt-3">
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Client *</Form.Label>
                            <Form.Select
                              name="client"
                              value={consultationForm.client}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="">Select client...</option>
                              {clients.map(client => (
                                <option key={client.id} value={client.id}>
                                  {client.name} - {client.phone}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Consultation Type *</Form.Label>
                            <Form.Select
                              name="consultation_type"
                              value={consultationForm.consultation_type}
                              onChange={handleInputChange}
                              required
                            >
                              {Object.values(CONSULTATION_TYPES).map(type => (
                                <option key={type.value} value={type.value}>
                                  {type.label} - ${type.price} ({type.duration}min)
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Date *</Form.Label>
                            <Form.Control
                              type="date"
                              name="consultation_date"
                              value={consultationForm.consultation_date}
                              onChange={handleInputChange}
                              min={new Date().toISOString().split('T')[0]}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Time *</Form.Label>
                            <Form.Control
                              type="time"
                              name="consultation_time"
                              value={consultationForm.consultation_time}
                              onChange={handleInputChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Fee ($)</Form.Label>
                            <Form.Control
                              type="number"
                              step="0.01"
                              name="consultation_fee"
                              value={consultationForm.consultation_fee}
                              onChange={handleInputChange}
                              min="0"
                              readOnly={consultationForm.consultation_type}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Primary Concerns *</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="primary_concerns"
                          value={consultationForm.primary_concerns}
                          onChange={handleInputChange}
                          placeholder="What are the client's main beauty concerns or issues they want to address?"
                          required
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Beauty Goals</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="beauty_goals"
                          value={consultationForm.beauty_goals}
                          onChange={handleInputChange}
                          placeholder="What are the client's beauty goals and desired outcomes?"
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Lifestyle Factors</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          name="lifestyle_factors"
                          value={consultationForm.lifestyle_factors}
                          onChange={handleInputChange}
                          placeholder="Relevant lifestyle factors (work schedule, exercise, diet, stress levels, etc.)"
                        />
                      </Form.Group>
                    </div>
                  </Tab>
                  
                  <Tab eventKey="analysis" title="Analysis & Assessment">
                    <div className="mt-3">
                      <Form.Group className="mb-3">
                        <Form.Label>Skin Analysis</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          name="skin_analysis"
                          value={consultationForm.skin_analysis}
                          onChange={handleInputChange}
                          placeholder="Detailed skin analysis including type, condition, concerns, and observations..."
                        />
                      </Form.Group>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Hair Analysis</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              name="hair_analysis"
                              value={consultationForm.hair_analysis}
                              onChange={handleInputChange}
                              placeholder="Hair type, condition, damage assessment..."
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Scalp Condition</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              name="scalp_condition"
                              value={consultationForm.scalp_condition}
                              onChange={handleInputChange}
                              placeholder="Scalp health, dryness, oiliness, irritation..."
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <div className="alert alert-info">
                        <FaBrain className="me-2" />
                        <strong>AI Analysis Available:</strong> After saving this consultation, you can run AI-powered analysis for more detailed insights.
                      </div>
                    </div>
                  </Tab>
                  
                  <Tab eventKey="recommendations" title="Recommendations">
                    <div className="mt-3">
                      <Form.Group className="mb-3">
                        <Form.Label>Immediate Recommendations</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          name="immediate_recommendations"
                          value={consultationForm.immediate_recommendations}
                          onChange={handleInputChange}
                          placeholder="Immediate steps, treatments, or changes the client should make..."
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Long-term Treatment Plan</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          name="long_term_plan"
                          value={consultationForm.long_term_plan}
                          onChange={handleInputChange}
                          placeholder="Comprehensive long-term treatment strategy and goals..."
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Product Recommendations</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="product_recommendations"
                          value={consultationForm.product_recommendations}
                          onChange={handleInputChange}
                          placeholder="Specific products, brands, or ingredients to use or avoid..."
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Next Consultation Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="next_consultation_date"
                          value={consultationForm.next_consultation_date}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                        />
                        <Form.Text className="text-muted">
                          Recommended date for follow-up consultation
                        </Form.Text>
                      </Form.Group>
                    </div>
                  </Tab>
                </Tabs>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              {modalType === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {modalType !== 'view' && (
              <Button variant="primary" onClick={handleSubmit}>
                {modalType === 'create' ? 'Schedule Consultation' : 'Update Consultation'}
              </Button>
            )}
          </Modal.Footer>
        </Modal>

        {/* AI Analysis Progress Modal */}
        <Modal show={aiAnalysisRunning} centered>
          <Modal.Body className="text-center py-4">
            <Spinner animation="border" variant="primary" className="mb-3" />
            <h5>AI Analysis in Progress</h5>
            <p className="text-muted">Processing skin analysis using advanced AI algorithms...</p>
            <ProgressBar animated now={100} variant="info" />
          </Modal.Body>
        </Modal>
      </Container>
    </ProtectedRoute>
  );
};

export default CosmetologyConsultations;
