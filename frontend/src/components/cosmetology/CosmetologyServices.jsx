import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Button, Form, Table, Badge, 
  Alert, Modal, Tabs, Tab, InputGroup, Pagination, Spinner,
  ListGroup, ProgressBar 
} from 'react-bootstrap';
import { 
  FaSpa, FaPlus, FaEdit, FaEye, FaSearch, FaFilter, 
  FaBrain, FaClock, FaDollarSign, FaStethoscope, FaExclamationTriangle
} from 'react-icons/fa';
import ProtectedRoute from '../common/ProtectedRoute';
import apiClient from '../../services/api';
import { 
  COSMETOLOGY_ENDPOINTS, 
  SERVICE_CATEGORIES, 
  VALIDATION_RULES,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  AI_ANALYSIS_TYPES 
} from '../../constants/cosmetologyConstants';

const CosmetologyServices = () => {
  // State Management
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create'); // create, edit, view
  const [selectedService, setSelectedService] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  // Form State
  const [serviceForm, setServiceForm] = useState({
    name: '',
    category: '',
    description: '',
    duration: '',
    price: '',
    requirements: [],
    contraindications: [],
    aftercare_instructions: '',
    requires_consultation: false,
    session_gap_days: 0,
    is_active: true
  });

  // Load services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  // Fetch services from API
  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(COSMETOLOGY_ENDPOINTS.SERVICES);
      setServices(response.data.results || response.data);
    } catch (error) {
      showAlert(ERROR_MESSAGES.NETWORK_ERROR, 'danger');
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show alert helper
  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setServiceForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle array field changes (requirements, contraindications)
  const handleArrayFieldChange = (field, value) => {
    setServiceForm(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim()).filter(item => item)
    }));
  };

  // Validate form
  const validateForm = () => {
    if (!serviceForm.name || serviceForm.name.length < 3) {
      showAlert('Service name is required and must be at least 3 characters', 'danger');
      return false;
    }
    
    if (!serviceForm.category) {
      showAlert('Please select a service category', 'danger');
      return false;
    }
    
    if (!serviceForm.duration || serviceForm.duration < 15) {
      showAlert('Duration must be at least 15 minutes', 'danger');
      return false;
    }
    
    if (!serviceForm.price || serviceForm.price <= 0) {
      showAlert('Please enter a valid price', 'danger');
      return false;
    }
    
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const payload = {
        ...serviceForm,
        requirements: JSON.stringify(serviceForm.requirements),
        contraindications: JSON.stringify(serviceForm.contraindications)
      };

      if (modalType === 'create') {
        await apiClient.post(COSMETOLOGY_ENDPOINTS.SERVICES, payload);
        showAlert('Service created successfully!');
      } else if (modalType === 'edit') {
        await apiClient.put(`${COSMETOLOGY_ENDPOINTS.SERVICES}/${selectedService.id}/`, payload);
        showAlert('Service updated successfully!');
      }
      
      fetchServices();
      closeModal();
    } catch (error) {
      showAlert(ERROR_MESSAGES.SERVER_ERROR, 'danger');
      console.error('Error saving service:', error);
    }
  };

  // Open modal
  const openModal = (type, service = null) => {
    setModalType(type);
    setSelectedService(service);
    
    if (type === 'create') {
      setServiceForm({
        name: '',
        category: '',
        description: '',
        duration: '',
        price: '',
        requirements: [],
        contraindications: [],
        aftercare_instructions: '',
        requires_consultation: false,
        session_gap_days: 0,
        is_active: true
      });
    } else if (type === 'edit' && service) {
      setServiceForm({
        ...service,
        requirements: Array.isArray(service.requirements) ? service.requirements : 
                     typeof service.requirements === 'string' ? JSON.parse(service.requirements || '[]') : [],
        contraindications: Array.isArray(service.contraindications) ? service.contraindications : 
                          typeof service.contraindications === 'string' ? JSON.parse(service.contraindications || '[]') : []
      });
    }
    
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedService(null);
    setModalType('create');
  };

  // Toggle service active status
  const toggleServiceStatus = async (serviceId, currentStatus) => {
    try {
      await apiClient.patch(`${COSMETOLOGY_ENDPOINTS.SERVICES}/${serviceId}/`, {
        is_active: !currentStatus
      });
      showAlert('Service status updated successfully!');
      fetchServices();
    } catch (error) {
      showAlert(ERROR_MESSAGES.SERVER_ERROR, 'danger');
      console.error('Error updating service status:', error);
    }
  };

  // Filter services based on search and category
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || service.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedServices = filteredServices.slice(startIndex, startIndex + itemsPerPage);

  // Get category details
  const getCategoryDetails = (categoryValue) => {
    return Object.values(SERVICE_CATEGORIES).find(cat => cat.value === categoryValue) || 
           { label: categoryValue, color: 'secondary', icon: 'fas fa-tag' };
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
                  <FaSpa className="me-2" />
                  Cosmetology Services
                </h2>
                <p className="text-muted mb-0">Manage beauty services with AI-powered treatment protocols</p>
              </div>
              <Button 
                variant="primary" 
                onClick={() => openModal('create')}
                className="d-flex align-items-center"
              >
                <FaPlus className="me-2" />
                Add New Service
              </Button>
            </div>
          </Col>
        </Row>

        {/* Search and Filter Bar */}
        <Row className="mb-4">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search services by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={4}>
            <Form.Select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {Object.values(SERVICE_CATEGORIES).map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={2}>
            <div className="text-muted">
              {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} found
            </div>
          </Col>
        </Row>

        {/* Services Grid */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : paginatedServices.length === 0 ? (
          <Card>
            <Card.Body className="text-center py-5">
              <FaSpa size={48} className="text-muted mb-3" />
              <h5>No services found</h5>
              <p className="text-muted">No services match your current search criteria.</p>
              <Button variant="primary" onClick={() => openModal('create')}>
                Add Your First Service
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <Row>
            {paginatedServices.map(service => {
              const categoryDetails = getCategoryDetails(service.category);
              return (
                <Col lg={4} md={6} key={service.id} className="mb-4">
                  <Card className={`h-100 ${!service.is_active ? 'opacity-75' : ''}`}>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <Badge bg={categoryDetails.color} className="d-flex align-items-center">
                        <i className={`${categoryDetails.icon} me-1`}></i>
                        {categoryDetails.label}
                      </Badge>
                      <div className="d-flex gap-1">
                        {service.requires_consultation && (
                          <Badge bg="warning" title="Requires Consultation">
                            <FaStethoscope />
                          </Badge>
                        )}
                        <Badge bg={service.is_active ? 'success' : 'secondary'}>
                          {service.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </Card.Header>
                    
                    <Card.Body>
                      <Card.Title className="h5">{service.name}</Card.Title>
                      <Card.Text className="text-muted small">
                        {service.description.length > 100 
                          ? `${service.description.substring(0, 100)}...` 
                          : service.description}
                      </Card.Text>
                      
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center text-muted">
                          <FaClock className="me-1" />
                          <small>{service.duration} min</small>
                        </div>
                        <div className="d-flex align-items-center text-success">
                          <FaDollarSign className="me-1" />
                          <strong>${service.price}</strong>
                        </div>
                      </div>
                      
                      {/* AI Features for this category */}
                      {categoryDetails.aiFeatures && (
                        <div className="mb-2">
                          <small className="text-muted d-flex align-items-center mb-1">
                            <FaBrain className="me-1" />
                            AI Features:
                          </small>
                          <div className="d-flex flex-wrap gap-1">
                            {categoryDetails.aiFeatures.slice(0, 2).map((feature, index) => (
                              <Badge key={index} bg="info" className="small">
                                {feature}
                              </Badge>
                            ))}
                            {categoryDetails.aiFeatures.length > 2 && (
                              <Badge bg="light" text="dark" className="small">
                                +{categoryDetails.aiFeatures.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Contraindications warning */}
                      {service.contraindications && (
                        Array.isArray(service.contraindications) ? service.contraindications.length > 0 :
                        JSON.parse(service.contraindications || '[]').length > 0
                      ) && (
                        <div className="mb-2">
                          <small className="text-warning d-flex align-items-center">
                            <FaExclamationTriangle className="me-1" />
                            Has contraindications
                          </small>
                        </div>
                      )}
                    </Card.Body>
                    
                    <Card.Footer className="d-flex justify-content-between">
                      <div className="d-flex gap-1">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => openModal('view', service)}
                          title="View Details"
                        >
                          <FaEye />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-warning"
                          onClick={() => openModal('edit', service)}
                          title="Edit Service"
                        >
                          <FaEdit />
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant={service.is_active ? "outline-danger" : "outline-success"}
                        onClick={() => toggleServiceStatus(service.id, service.is_active)}
                        title={service.is_active ? "Deactivate" : "Activate"}
                      >
                        {service.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                    </Card.Footer>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Row className="mt-4">
            <Col>
              <div className="d-flex justify-content-between align-items-center">
                <div className="text-muted">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredServices.length)} of {filteredServices.length} entries
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
            </Col>
          </Row>
        )}

        {/* Service Modal */}
        <Modal show={showModal} onHide={closeModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {modalType === 'create' && 'Add New Service'}
              {modalType === 'edit' && 'Edit Service'}
              {modalType === 'view' && 'Service Details'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalType === 'view' && selectedService ? (
              // View Mode
              <Tabs defaultActiveKey="details" id="service-details-tabs">
                <Tab eventKey="details" title="Service Details">
                  <div className="mt-3">
                    <Row>
                      <Col md={8}>
                        <h5>{selectedService.name}</h5>
                        <Badge bg={getCategoryDetails(selectedService.category).color} className="mb-3">
                          {getCategoryDetails(selectedService.category).label}
                        </Badge>
                        <p>{selectedService.description}</p>
                      </Col>
                      <Col md={4}>
                        <Card className="bg-light">
                          <Card.Body>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Duration:</span>
                              <strong>{selectedService.duration} minutes</strong>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Price:</span>
                              <strong className="text-success">${selectedService.price}</strong>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Consultation:</span>
                              <Badge bg={selectedService.requires_consultation ? 'warning' : 'success'}>
                                {selectedService.requires_consultation ? 'Required' : 'Optional'}
                              </Badge>
                            </div>
                            {selectedService.session_gap_days > 0 && (
                              <div className="d-flex justify-content-between mb-2">
                                <span>Gap between sessions:</span>
                                <strong>{selectedService.session_gap_days} days</strong>
                              </div>
                            )}
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                </Tab>
                
                <Tab eventKey="requirements" title="Requirements & Safety">
                  <div className="mt-3">
                    {(Array.isArray(selectedService.requirements) ? selectedService.requirements : JSON.parse(selectedService.requirements || '[]')).length > 0 && (
                      <>
                        <h6 className="text-success">Pre-Service Requirements</h6>
                        <ListGroup className="mb-4">
                          {(Array.isArray(selectedService.requirements) ? selectedService.requirements : JSON.parse(selectedService.requirements || '[]')).map((req, index) => (
                            <ListGroup.Item key={index} className="d-flex align-items-center">
                              <i className="fas fa-check-circle text-success me-2"></i>
                              {req}
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </>
                    )}
                    
                    {(Array.isArray(selectedService.contraindications) ? selectedService.contraindications : JSON.parse(selectedService.contraindications || '[]')).length > 0 && (
                      <>
                        <h6 className="text-danger">Contraindications</h6>
                        <ListGroup className="mb-4">
                          {(Array.isArray(selectedService.contraindications) ? selectedService.contraindications : JSON.parse(selectedService.contraindications || '[]')).map((contra, index) => (
                            <ListGroup.Item key={index} variant="warning" className="d-flex align-items-center">
                              <FaExclamationTriangle className="text-warning me-2" />
                              {contra}
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </>
                    )}
                  </div>
                </Tab>
                
                <Tab eventKey="aftercare" title="Aftercare">
                  <div className="mt-3">
                    {selectedService.aftercare_instructions ? (
                      <div>
                        <h6>Post-Treatment Instructions</h6>
                        <Card className="bg-light">
                          <Card.Body>
                            <p className="mb-0">{selectedService.aftercare_instructions}</p>
                          </Card.Body>
                        </Card>
                      </div>
                    ) : (
                      <p className="text-muted">No specific aftercare instructions provided.</p>
                    )}
                  </div>
                </Tab>
                
                <Tab eventKey="ai" title="AI Features">
                  <div className="mt-3">
                    <h6 className="d-flex align-items-center mb-3">
                      <FaBrain className="me-2 text-primary" />
                      AI-Enhanced Features
                    </h6>
                    {getCategoryDetails(selectedService.category).aiFeatures && (
                      <Row>
                        {getCategoryDetails(selectedService.category).aiFeatures.map((feature, index) => (
                          <Col md={6} key={index} className="mb-3">
                            <Card className="border-primary">
                              <Card.Body>
                                <h6 className="text-primary">{feature}</h6>
                                <p className="small text-muted mb-0">
                                  {getCategoryDetails(selectedService.category).description}
                                </p>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    )}
                    
                    <div className="mt-4">
                      <h6>Available AI Analysis Types</h6>
                      <Row>
                        {Object.values(AI_ANALYSIS_TYPES).slice(0, 3).map((analysis, index) => (
                          <Col md={4} key={index} className="mb-2">
                            <Card className="border-info">
                              <Card.Body className="p-2">
                                <small className="d-block text-info font-weight-bold">{analysis.label}</small>
                                <small className="text-muted">{analysis.accuracy} accuracy</small>
                                <ProgressBar 
                                  variant="info" 
                                  now={parseInt(analysis.accuracy)} 
                                  className="mt-1"
                                  style={{ height: '4px' }}
                                />
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  </div>
                </Tab>
              </Tabs>
            ) : (
              // Create/Edit Form
              <Form onSubmit={handleSubmit}>
                <Tabs defaultActiveKey="basic" id="service-form-tabs">
                  <Tab eventKey="basic" title="Basic Information">
                    <div className="mt-3">
                      <Form.Group className="mb-3">
                        <Form.Label>Service Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={serviceForm.name}
                          onChange={handleInputChange}
                          placeholder="e.g., Hydrating Facial Treatment"
                          required
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Category *</Form.Label>
                        <Form.Select
                          name="category"
                          value={serviceForm.category}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select category...</option>
                          {Object.values(SERVICE_CATEGORIES).map(category => (
                            <option key={category.value} value={category.value}>
                              {category.label}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Description *</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          name="description"
                          value={serviceForm.description}
                          onChange={handleInputChange}
                          placeholder="Detailed description of the service, benefits, and what clients can expect..."
                          required
                        />
                      </Form.Group>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Duration (minutes) *</Form.Label>
                            <Form.Control
                              type="number"
                              name="duration"
                              value={serviceForm.duration}
                              onChange={handleInputChange}
                              min="15"
                              max="480"
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Price ($) *</Form.Label>
                            <Form.Control
                              type="number"
                              step="0.01"
                              name="price"
                              value={serviceForm.price}
                              onChange={handleInputChange}
                              min="0"
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Check
                              type="checkbox"
                              name="requires_consultation"
                              checked={serviceForm.requires_consultation}
                              onChange={handleInputChange}
                              label="Requires consultation before booking"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Minimum days between sessions</Form.Label>
                            <Form.Control
                              type="number"
                              name="session_gap_days"
                              value={serviceForm.session_gap_days}
                              onChange={handleInputChange}
                              min="0"
                              max="365"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="checkbox"
                          name="is_active"
                          checked={serviceForm.is_active}
                          onChange={handleInputChange}
                          label="Service is active and available for booking"
                        />
                      </Form.Group>
                    </div>
                  </Tab>
                  
                  <Tab eventKey="safety" title="Requirements & Safety">
                    <div className="mt-3">
                      <Form.Group className="mb-3">
                        <Form.Label>Pre-Service Requirements</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="e.g., Remove makeup, Avoid sun exposure 24hrs prior, Shave area (comma-separated)"
                          value={serviceForm.requirements.join(', ')}
                          onChange={(e) => handleArrayFieldChange('requirements', e.target.value)}
                        />
                        <Form.Text className="text-muted">
                          List any preparations clients need to do before the service (separate with commas)
                        </Form.Text>
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Contraindications</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="e.g., Pregnancy, Active acne, Recent chemical peels (comma-separated)"
                          value={serviceForm.contraindications.join(', ')}
                          onChange={(e) => handleArrayFieldChange('contraindications', e.target.value)}
                        />
                        <Form.Text className="text-muted">
                          List conditions or situations where this service should not be performed (separate with commas)
                        </Form.Text>
                      </Form.Group>
                    </div>
                  </Tab>
                  
                  <Tab eventKey="aftercare" title="Aftercare">
                    <div className="mt-3">
                      <Form.Group className="mb-3">
                        <Form.Label>Post-Treatment Instructions</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={5}
                          name="aftercare_instructions"
                          value={serviceForm.aftercare_instructions}
                          onChange={handleInputChange}
                          placeholder="Detailed instructions for clients to follow after the treatment to ensure best results and avoid complications..."
                        />
                        <Form.Text className="text-muted">
                          Provide detailed aftercare instructions to help clients maintain results and avoid complications
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
                {modalType === 'create' ? 'Create Service' : 'Update Service'}
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </Container>
    </ProtectedRoute>
  );
};

export default CosmetologyServices;
