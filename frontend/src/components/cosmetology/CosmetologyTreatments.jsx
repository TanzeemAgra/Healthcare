import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Button, Form, Table, Badge, 
  Alert, Modal, Tabs, Tab, InputGroup, Pagination, Spinner,
  ProgressBar, ListGroup 
} from 'react-bootstrap';
import { 
  FaClipboardList, FaPlus, FaEdit, FaEye, FaSearch, FaFilter, 
  FaBrain, FaCalendarAlt, FaCheckCircle, FaStar, FaChartLine
} from 'react-icons/fa';
import ProtectedRoute from '../common/ProtectedRoute';
import apiClient from '../../services/api';
import { 
  COSMETOLOGY_ENDPOINTS, 
  TREATMENT_PLAN_TYPES, 
  VALIDATION_RULES,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES 
} from '../../constants/cosmetologyConstants';

const CosmetologyTreatments = () => {
  // State Management
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create'); // create, edit, view
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  // Form State
  const [planForm, setPlanForm] = useState({
    name: '',
    client: '',
    cosmetologist: '',
    description: '',
    beauty_goals: '',
    target_concerns: '',
    duration_weeks: '',
    start_date: '',
    end_date: '',
    estimated_cost: '',
    progress_notes: '',
    is_active: true,
    selected_services: [],
    selected_products: []
  });

  // Load data on component mount
  useEffect(() => {
    fetchTreatmentPlans();
    fetchClients();
    fetchServices();
    fetchProducts();
  }, []);

  // Fetch treatment plans from API
  const fetchTreatmentPlans = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(COSMETOLOGY_ENDPOINTS.TREATMENT_PLANS);
      setTreatmentPlans(response.data.results || response.data);
    } catch (error) {
      showAlert(ERROR_MESSAGES.NETWORK_ERROR, 'danger');
      console.error('Error fetching treatment plans:', error);
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

  // Fetch services for selection
  const fetchServices = async () => {
    try {
      const response = await apiClient.get(COSMETOLOGY_ENDPOINTS.SERVICES);
      setServices((response.data.results || response.data).filter(service => service.is_active));
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  // Fetch products for selection
  const fetchProducts = async () => {
    try {
      const response = await apiClient.get(COSMETOLOGY_ENDPOINTS.PRODUCTS);
      setProducts((response.data.results || response.data).filter(product => product.is_active));
    } catch (error) {
      console.error('Error fetching products:', error);
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
    setPlanForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle service selection
  const handleServiceSelection = (serviceId, isSelected) => {
    setPlanForm(prev => ({
      ...prev,
      selected_services: isSelected 
        ? [...prev.selected_services, serviceId]
        : prev.selected_services.filter(id => id !== serviceId)
    }));
  };

  // Handle product selection
  const handleProductSelection = (productId, isSelected) => {
    setPlanForm(prev => ({
      ...prev,
      selected_products: isSelected 
        ? [...prev.selected_products, productId]
        : prev.selected_products.filter(id => id !== productId)
    }));
  };

  // Calculate estimated cost based on selected services and products
  const calculateEstimatedCost = () => {
    const servicesCost = planForm.selected_services.reduce((total, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      return total + (service ? parseFloat(service.price) : 0);
    }, 0);

    const productsCost = planForm.selected_products.reduce((total, productId) => {
      const product = products.find(p => p.id === productId);
      return total + (product ? parseFloat(product.price) : 0);
    }, 0);

    return servicesCost + productsCost;
  };

  // Auto-calculate end date based on start date and duration
  useEffect(() => {
    if (planForm.start_date && planForm.duration_weeks) {
      const startDate = new Date(planForm.start_date);
      const endDate = new Date(startDate.getTime() + (planForm.duration_weeks * 7 * 24 * 60 * 60 * 1000));
      setPlanForm(prev => ({
        ...prev,
        end_date: endDate.toISOString().split('T')[0],
        estimated_cost: calculateEstimatedCost().toFixed(2)
      }));
    }
  }, [planForm.start_date, planForm.duration_weeks, planForm.selected_services, planForm.selected_products]);

  // Validate form
  const validateForm = () => {
    const rules = VALIDATION_RULES.TREATMENT_PLAN;
    
    if (!planForm.name || planForm.name.length < rules.name.minLength) {
      showAlert('Plan name is required and must be at least 5 characters', 'danger');
      return false;
    }
    
    if (!planForm.client) {
      showAlert('Please select a client', 'danger');
      return false;
    }
    
    if (!planForm.duration_weeks || planForm.duration_weeks < rules.duration_weeks.min) {
      showAlert('Duration must be at least 1 week', 'danger');
      return false;
    }
    
    if (!planForm.beauty_goals || planForm.beauty_goals.length < rules.goals.minLength) {
      showAlert('Beauty goals are required and must be at least 10 characters', 'danger');
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
        ...planForm,
        duration_weeks: parseInt(planForm.duration_weeks),
        estimated_cost: parseFloat(planForm.estimated_cost) || calculateEstimatedCost(),
        cosmetologist: 1 // Default cosmetologist, should be from auth context
      };

      if (modalType === 'create') {
        await apiClient.post(COSMETOLOGY_ENDPOINTS.TREATMENT_PLANS, payload);
        showAlert('Treatment plan created successfully!');
      } else if (modalType === 'edit') {
        await apiClient.put(`${COSMETOLOGY_ENDPOINTS.TREATMENT_PLANS}/${selectedPlan.id}/`, payload);
        showAlert('Treatment plan updated successfully!');
      }
      
      fetchTreatmentPlans();
      closeModal();
    } catch (error) {
      showAlert(ERROR_MESSAGES.SERVER_ERROR, 'danger');
      console.error('Error saving treatment plan:', error);
    }
  };

  // Open modal
  const openModal = (type, plan = null) => {
    setModalType(type);
    setSelectedPlan(plan);
    
    if (type === 'create') {
      setPlanForm({
        name: '',
        client: '',
        cosmetologist: '',
        description: '',
        beauty_goals: '',
        target_concerns: '',
        duration_weeks: '',
        start_date: '',
        end_date: '',
        estimated_cost: '',
        progress_notes: '',
        is_active: true,
        selected_services: [],
        selected_products: []
      });
    } else if (type === 'edit' && plan) {
      setPlanForm({
        ...plan,
        start_date: plan.start_date ? new Date(plan.start_date).toISOString().split('T')[0] : '',
        end_date: plan.end_date ? new Date(plan.end_date).toISOString().split('T')[0] : '',
        selected_services: plan.services || [],
        selected_products: plan.products || []
      });
    }
    
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedPlan(null);
    setModalType('create');
  };

  // Toggle plan active status
  const togglePlanStatus = async (planId, currentStatus) => {
    try {
      await apiClient.patch(`${COSMETOLOGY_ENDPOINTS.TREATMENT_PLANS}/${planId}/`, {
        is_active: !currentStatus
      });
      showAlert('Treatment plan status updated successfully!');
      fetchTreatmentPlans();
    } catch (error) {
      showAlert(ERROR_MESSAGES.SERVER_ERROR, 'danger');
      console.error('Error updating plan status:', error);
    }
  };

  // Filter treatment plans
  const filteredPlans = treatmentPlans.filter(plan => {
    const matchesSearch = 
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && plan.is_active) ||
      (filterStatus === 'inactive' && !plan.is_active) ||
      (filterStatus === 'completed' && plan.end_date && new Date(plan.end_date) < new Date()) ||
      (filterStatus === 'ongoing' && plan.start_date && new Date(plan.start_date) <= new Date() && 
       (!plan.end_date || new Date(plan.end_date) >= new Date()));
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPlans = filteredPlans.slice(startIndex, startIndex + itemsPerPage);

  // Calculate progress percentage
  const calculateProgress = (plan) => {
    if (!plan.start_date || !plan.end_date) return 0;
    
    const startDate = new Date(plan.start_date);
    const endDate = new Date(plan.end_date);
    const currentDate = new Date();
    
    if (currentDate < startDate) return 0;
    if (currentDate > endDate) return 100;
    
    const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
    const completedDays = (currentDate - startDate) / (1000 * 60 * 60 * 24);
    
    return Math.round((completedDays / totalDays) * 100);
  };

  // Get plan type details
  const getPlanTypeDetails = (weeks) => {
    if (weeks <= 6) return TREATMENT_PLAN_TYPES.BASIC;
    if (weeks <= 12) return TREATMENT_PLAN_TYPES.ADVANCED;
    if (weeks <= 24) return TREATMENT_PLAN_TYPES.PREMIUM;
    return TREATMENT_PLAN_TYPES.MAINTENANCE;
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
                  <FaClipboardList className="me-2" />
                  Treatment Plans
                </h2>
                <p className="text-muted mb-0">AI-powered personalized beauty treatment planning</p>
              </div>
              <Button 
                variant="primary" 
                onClick={() => openModal('create')}
                className="d-flex align-items-center"
              >
                <FaPlus className="me-2" />
                Create Treatment Plan
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
                placeholder="Search by plan name, client, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={4}>
            <Form.Select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Plans</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <div className="text-muted">
              {filteredPlans.length} plan{filteredPlans.length !== 1 ? 's' : ''} found
            </div>
          </Col>
        </Row>

        {/* Treatment Plans Grid */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : paginatedPlans.length === 0 ? (
          <Card>
            <Card.Body className="text-center py-5">
              <FaClipboardList size={48} className="text-muted mb-3" />
              <h5>No treatment plans found</h5>
              <p className="text-muted">No treatment plans match your current search criteria.</p>
              <Button variant="primary" onClick={() => openModal('create')}>
                Create Your First Treatment Plan
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <Row>
            {paginatedPlans.map(plan => {
              const progress = calculateProgress(plan);
              const planType = getPlanTypeDetails(plan.duration_weeks);
              
              return (
                <Col lg={6} key={plan.id} className="mb-4">
                  <Card className={`h-100 ${!plan.is_active ? 'opacity-75' : ''}`}>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <Badge bg="primary" className="d-flex align-items-center">
                        <FaClipboardList className="me-1" />
                        {planType.label}
                      </Badge>
                      <div className="d-flex gap-1">
                        <Badge bg={plan.is_active ? 'success' : 'secondary'}>
                          {plan.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        {progress === 100 && (
                          <Badge bg="warning">
                            <FaCheckCircle className="me-1" />
                            Completed
                          </Badge>
                        )}
                      </div>
                    </Card.Header>
                    
                    <Card.Body>
                      <Card.Title className="h5">{plan.name}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        Client: {plan.client_name}
                      </Card.Subtitle>
                      
                      <Card.Text className="text-muted small">
                        {plan.description.length > 100 
                          ? `${plan.description.substring(0, 100)}...` 
                          : plan.description}
                      </Card.Text>
                      
                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <small className="text-muted">Progress</small>
                          <small className="text-muted">{progress}%</small>
                        </div>
                        <ProgressBar 
                          now={progress} 
                          variant={progress === 100 ? 'success' : progress > 50 ? 'info' : 'warning'}
                          style={{ height: '6px' }}
                        />
                      </div>
                      
                      {/* Plan Details */}
                      <Row className="text-center">
                        <Col>
                          <div className="d-flex flex-column align-items-center">
                            <FaCalendarAlt className="text-muted mb-1" />
                            <small className="text-muted">Duration</small>
                            <strong>{plan.duration_weeks} weeks</strong>
                          </div>
                        </Col>
                        <Col>
                          <div className="d-flex flex-column align-items-center">
                            <FaChartLine className="text-muted mb-1" />
                            <small className="text-muted">Estimated Cost</small>
                            <strong className="text-success">${plan.estimated_cost}</strong>
                          </div>
                        </Col>
                      </Row>
                      
                      {/* AI Features */}
                      <div className="mt-3">
                        <small className="text-muted d-flex align-items-center mb-2">
                          <FaBrain className="me-1" />
                          AI Features:
                        </small>
                        <div className="d-flex flex-wrap gap-1">
                          {planType.aiFeatures.slice(0, 2).map((feature, index) => (
                            <Badge key={index} bg="info" className="small">
                              {feature}
                            </Badge>
                          ))}
                          {planType.aiFeatures.length > 2 && (
                            <Badge bg="light" text="dark" className="small">
                              +{planType.aiFeatures.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Card.Body>
                    
                    <Card.Footer className="d-flex justify-content-between">
                      <div className="d-flex gap-1">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => openModal('view', plan)}
                          title="View Details"
                        >
                          <FaEye />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-warning"
                          onClick={() => openModal('edit', plan)}
                          title="Edit Plan"
                        >
                          <FaEdit />
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant={plan.is_active ? "outline-danger" : "outline-success"}
                        onClick={() => togglePlanStatus(plan.id, plan.is_active)}
                        title={plan.is_active ? "Deactivate" : "Activate"}
                      >
                        {plan.is_active ? 'Deactivate' : 'Activate'}
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
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredPlans.length)} of {filteredPlans.length} entries
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

        {/* Treatment Plan Modal */}
        <Modal show={showModal} onHide={closeModal} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>
              {modalType === 'create' && 'Create Treatment Plan'}
              {modalType === 'edit' && 'Edit Treatment Plan'}
              {modalType === 'view' && 'Treatment Plan Details'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalType === 'view' && selectedPlan ? (
              // View Mode
              <Tabs defaultActiveKey="overview" id="plan-details-tabs">
                <Tab eventKey="overview" title="Overview">
                  <div className="mt-3">
                    <Row>
                      <Col md={8}>
                        <h5>{selectedPlan.name}</h5>
                        <p><strong>Client:</strong> {selectedPlan.client_name}</p>
                        <p><strong>Description:</strong> {selectedPlan.description}</p>
                        <p><strong>Beauty Goals:</strong> {selectedPlan.beauty_goals}</p>
                        {selectedPlan.target_concerns && (
                          <p><strong>Target Concerns:</strong> {selectedPlan.target_concerns}</p>
                        )}
                      </Col>
                      <Col md={4}>
                        <Card className="bg-light">
                          <Card.Body>
                            <h6>Plan Summary</h6>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Duration:</span>
                              <strong>{selectedPlan.duration_weeks} weeks</strong>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Start Date:</span>
                              <strong>{selectedPlan.start_date ? new Date(selectedPlan.start_date).toLocaleDateString() : 'Not set'}</strong>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>End Date:</span>
                              <strong>{selectedPlan.end_date ? new Date(selectedPlan.end_date).toLocaleDateString() : 'Not set'}</strong>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Estimated Cost:</span>
                              <strong className="text-success">${selectedPlan.estimated_cost}</strong>
                            </div>
                            <div className="d-flex justify-content-between">
                              <span>Progress:</span>
                              <strong>{calculateProgress(selectedPlan)}%</strong>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                </Tab>
                <Tab eventKey="services" title="Services & Products">
                  <div className="mt-3">
                    <h6>Included Services</h6>
                    {selectedPlan.services && selectedPlan.services.length > 0 ? (
                      <ListGroup className="mb-4">
                        {selectedPlan.services.map((service, index) => (
                          <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                            <span>{service.name}</span>
                            <Badge bg="primary">${service.price}</Badge>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    ) : (
                      <p className="text-muted">No services selected</p>
                    )}
                    
                    <h6>Recommended Products</h6>
                    {selectedPlan.products && selectedPlan.products.length > 0 ? (
                      <ListGroup>
                        {selectedPlan.products.map((product, index) => (
                          <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                            <div>
                              <div>{product.name}</div>
                              <small className="text-muted">{product.brand}</small>
                            </div>
                            <Badge bg="success">${product.price}</Badge>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    ) : (
                      <p className="text-muted">No products selected</p>
                    )}
                  </div>
                </Tab>
                <Tab eventKey="progress" title="Progress Notes">
                  <div className="mt-3">
                    {selectedPlan.progress_notes ? (
                      <div>
                        <h6>Progress Notes</h6>
                        <Card className="bg-light">
                          <Card.Body>
                            <p className="mb-0">{selectedPlan.progress_notes}</p>
                          </Card.Body>
                        </Card>
                      </div>
                    ) : (
                      <p className="text-muted">No progress notes recorded yet.</p>
                    )}
                  </div>
                </Tab>
              </Tabs>
            ) : (
              // Create/Edit Form
              <Form onSubmit={handleSubmit}>
                <Tabs defaultActiveKey="basic" id="plan-form-tabs">
                  <Tab eventKey="basic" title="Basic Information">
                    <div className="mt-3">
                      <Form.Group className="mb-3">
                        <Form.Label>Plan Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={planForm.name}
                          onChange={handleInputChange}
                          placeholder="e.g., Complete Facial Rejuvenation Plan"
                          required
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Client *</Form.Label>
                        <Form.Select
                          name="client"
                          value={planForm.client}
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
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="description"
                          value={planForm.description}
                          onChange={handleInputChange}
                          placeholder="Brief overview of the treatment plan..."
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Beauty Goals *</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="beauty_goals"
                          value={planForm.beauty_goals}
                          onChange={handleInputChange}
                          placeholder="What are the client's beauty goals and desired outcomes?"
                          required
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Target Concerns</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          name="target_concerns"
                          value={planForm.target_concerns}
                          onChange={handleInputChange}
                          placeholder="Specific concerns to address (acne, aging, dryness, etc.)"
                        />
                      </Form.Group>
                      
                      <Row>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Duration (weeks) *</Form.Label>
                            <Form.Control
                              type="number"
                              name="duration_weeks"
                              value={planForm.duration_weeks}
                              onChange={handleInputChange}
                              min="1"
                              max="52"
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                              type="date"
                              name="start_date"
                              value={planForm.start_date}
                              onChange={handleInputChange}
                              min={new Date().toISOString().split('T')[0]}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>End Date</Form.Label>
                            <Form.Control
                              type="date"
                              name="end_date"
                              value={planForm.end_date}
                              onChange={handleInputChange}
                              readOnly
                            />
                            <Form.Text className="text-muted">
                              Auto-calculated based on start date and duration
                            </Form.Text>
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="checkbox"
                          name="is_active"
                          checked={planForm.is_active}
                          onChange={handleInputChange}
                          label="Plan is active"
                        />
                      </Form.Group>
                    </div>
                  </Tab>
                  
                  <Tab eventKey="services" title="Services & Products">
                    <div className="mt-3">
                      <h6>Select Services</h6>
                      <Row>
                        {services.map(service => (
                          <Col md={6} key={service.id} className="mb-2">
                            <Form.Check
                              type="checkbox"
                              id={`service-${service.id}`}
                              checked={planForm.selected_services.includes(service.id)}
                              onChange={(e) => handleServiceSelection(service.id, e.target.checked)}
                              label={
                                <div>
                                  <div>{service.name}</div>
                                  <small className="text-muted">${service.price} - {service.duration}min</small>
                                </div>
                              }
                            />
                          </Col>
                        ))}
                      </Row>
                      
                      <h6 className="mt-4">Select Products</h6>
                      <Row>
                        {products.map(product => (
                          <Col md={6} key={product.id} className="mb-2">
                            <Form.Check
                              type="checkbox"
                              id={`product-${product.id}`}
                              checked={planForm.selected_products.includes(product.id)}
                              onChange={(e) => handleProductSelection(product.id, e.target.checked)}
                              label={
                                <div>
                                  <div>{product.name}</div>
                                  <small className="text-muted">{product.brand} - ${product.price}</small>
                                </div>
                              }
                            />
                          </Col>
                        ))}
                      </Row>
                      
                      <div className="mt-4 p-3 bg-light rounded">
                        <strong>Estimated Total Cost: ${calculateEstimatedCost().toFixed(2)}</strong>
                      </div>
                    </div>
                  </Tab>
                  
                  <Tab eventKey="notes" title="Progress Notes">
                    <div className="mt-3">
                      <Form.Group className="mb-3">
                        <Form.Label>Progress Notes</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={5}
                          name="progress_notes"
                          value={planForm.progress_notes}
                          onChange={handleInputChange}
                          placeholder="Track progress, observations, adjustments, and client feedback..."
                        />
                        <Form.Text className="text-muted">
                          Document progress, results, and any modifications to the treatment plan
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
                {modalType === 'create' ? 'Create Plan' : 'Update Plan'}
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </Container>
    </ProtectedRoute>
  );
};

export default CosmetologyTreatments;
