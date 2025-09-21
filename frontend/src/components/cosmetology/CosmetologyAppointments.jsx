import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Button, Form, Table, Badge, 
  Alert, Modal, Tabs, Tab, InputGroup, Pagination, Spinner,
  OverlayTrigger, Tooltip 
} from 'react-bootstrap';
import { 
  FaCalendarAlt, FaPlus, FaEdit, FaEye, FaSearch, FaFilter, 
  FaClock, FaUser, FaSpa, FaCheckCircle, FaTimesCircle,
  FaBrain, FaCalendarCheck, FaExclamationTriangle
} from 'react-icons/fa';
import ProtectedRoute from '../common/ProtectedRoute';
import apiClient from '../../services/api';
import { 
  COSMETOLOGY_ENDPOINTS, 
  APPOINTMENT_STATUS, 
  VALIDATION_RULES,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES 
} from '../../constants/cosmetologyConstants';

const CosmetologyAppointments = () => {
  // State Management
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [cosmetologists, setCosmetologists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create'); // create, edit, view
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [viewMode, setViewMode] = useState('list'); // list, calendar

  // Form State
  const [appointmentForm, setAppointmentForm] = useState({
    client: '',
    service: '',
    cosmetologist: '',
    appointment_date: '',
    appointment_time: '',
    duration: '',
    status: 'scheduled',
    consultation_notes: '',
    service_notes: '',
    service_price: '',
    additional_charges: 0,
    discount: 0
  });

  // Load data on component mount
  useEffect(() => {
    fetchAppointments();
    fetchClients();
    fetchServices();
    fetchCosmetologists();
  }, []);

  // Fetch appointments from API
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(COSMETOLOGY_ENDPOINTS.APPOINTMENTS);
      setAppointments(response.data.results || response.data);
    } catch (error) {
      showAlert(ERROR_MESSAGES.NETWORK_ERROR, 'danger');
      console.error('Error fetching appointments:', error);
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

  // Fetch services for dropdown
  const fetchServices = async () => {
    try {
      const response = await apiClient.get(COSMETOLOGY_ENDPOINTS.SERVICES);
      setServices((response.data.results || response.data).filter(service => service.is_active));
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  // Fetch cosmetologists (users with cosmetologist role)
  const fetchCosmetologists = async () => {
    try {
      // This would typically fetch users with cosmetologist role
      // For now, we'll use a mock response
      setCosmetologists([
        { id: 1, username: 'sarah_martinez', first_name: 'Sarah', last_name: 'Martinez' },
        { id: 2, username: 'maria_garcia', first_name: 'Maria', last_name: 'Garcia' },
        { id: 3, username: 'jenny_smith', first_name: 'Jenny', last_name: 'Smith' }
      ]);
    } catch (error) {
      console.error('Error fetching cosmetologists:', error);
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
    setAppointmentForm(prev => {
      const updated = {
        ...prev,
        [name]: value
      };

      // Auto-fill service price when service is selected
      if (name === 'service' && value) {
        const selectedService = services.find(s => s.id === parseInt(value));
        if (selectedService) {
          updated.service_price = selectedService.price;
          updated.duration = selectedService.duration;
        }
      }

      return updated;
    });
  };

  // Validate form
  const validateForm = () => {
    if (!appointmentForm.client) {
      showAlert('Please select a client', 'danger');
      return false;
    }
    
    if (!appointmentForm.service) {
      showAlert('Please select a service', 'danger');
      return false;
    }
    
    if (!appointmentForm.cosmetologist) {
      showAlert('Please select a cosmetologist', 'danger');
      return false;
    }
    
    if (!appointmentForm.appointment_date || !appointmentForm.appointment_time) {
      showAlert('Please select date and time', 'danger');
      return false;
    }
    
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const appointmentDateTime = `${appointmentForm.appointment_date}T${appointmentForm.appointment_time}:00`;
      
      const payload = {
        ...appointmentForm,
        appointment_date: appointmentDateTime,
        service_price: parseFloat(appointmentForm.service_price),
        additional_charges: parseFloat(appointmentForm.additional_charges) || 0,
        discount: parseFloat(appointmentForm.discount) || 0
      };

      delete payload.appointment_time; // Remove separate time field

      if (modalType === 'create') {
        await apiClient.post(COSMETOLOGY_ENDPOINTS.APPOINTMENTS, payload);
        showAlert(SUCCESS_MESSAGES.APPOINTMENT_SCHEDULED);
      } else if (modalType === 'edit') {
        await apiClient.put(`${COSMETOLOGY_ENDPOINTS.APPOINTMENTS}/${selectedAppointment.id}/`, payload);
        showAlert('Appointment updated successfully!');
      }
      
      fetchAppointments();
      closeModal();
    } catch (error) {
      showAlert(ERROR_MESSAGES.SERVER_ERROR, 'danger');
      console.error('Error saving appointment:', error);
    }
  };

  // Open modal
  const openModal = (type, appointment = null) => {
    setModalType(type);
    setSelectedAppointment(appointment);
    
    if (type === 'create') {
      setAppointmentForm({
        client: '',
        service: '',
        cosmetologist: '',
        appointment_date: '',
        appointment_time: '',
        duration: '',
        status: 'scheduled',
        consultation_notes: '',
        service_notes: '',
        service_price: '',
        additional_charges: 0,
        discount: 0
      });
    } else if (type === 'edit' && appointment) {
      const appointmentDate = new Date(appointment.appointment_date);
      setAppointmentForm({
        ...appointment,
        appointment_date: appointmentDate.toISOString().split('T')[0],
        appointment_time: appointmentDate.toTimeString().split(' ')[0].substring(0, 5)
      });
    }
    
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
    setModalType('create');
  };

  // Update appointment status
  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      await apiClient.patch(`${COSMETOLOGY_ENDPOINTS.APPOINTMENTS}/${appointmentId}/`, {
        status: newStatus
      });
      showAlert('Appointment status updated successfully!');
      fetchAppointments();
    } catch (error) {
      showAlert(ERROR_MESSAGES.SERVER_ERROR, 'danger');
      console.error('Error updating appointment status:', error);
    }
  };

  // Filter appointments
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.service_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.cosmetologist_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
    
    const matchesDate = !filterDate || 
      new Date(appointment.appointment_date).toISOString().split('T')[0] === filterDate;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Sort appointments by date
  const sortedAppointments = filteredAppointments.sort((a, b) => 
    new Date(a.appointment_date) - new Date(b.appointment_date)
  );

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAppointments = sortedAppointments.slice(startIndex, startIndex + itemsPerPage);

  // Get appointment status details
  const getStatusDetails = (status) => {
    return APPOINTMENT_STATUS[status.toUpperCase()] || 
           { label: status, color: 'secondary', icon: 'fas fa-question' };
  };

  // Format date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
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
                  <FaCalendarAlt className="me-2" />
                  Appointment Management
                </h2>
                <p className="text-muted mb-0">Schedule and manage beauty appointments with AI optimization</p>
              </div>
              <div className="d-flex gap-2">
                <Button 
                  variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
                  onClick={() => setViewMode('list')}
                >
                  List View
                </Button>
                <Button 
                  variant={viewMode === 'calendar' ? 'primary' : 'outline-primary'}
                  onClick={() => setViewMode('calendar')}
                >
                  Calendar View
                </Button>
                <Button 
                  variant="success" 
                  onClick={() => openModal('create')}
                  className="d-flex align-items-center"
                >
                  <FaPlus className="me-2" />
                  New Appointment
                </Button>
              </div>
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
                placeholder="Search by client, service, or cosmetologist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={3}>
            <Form.Select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              {Object.values(APPOINTMENT_STATUS).map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
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
              {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''} found
            </div>
          </Col>
        </Row>

        {/* Appointments Table */}
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Appointments Schedule</h5>
            <Badge bg="info" className="d-flex align-items-center">
              <FaBrain className="me-1" />
              AI-Optimized Scheduling
            </Badge>
          </Card.Header>
          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : paginatedAppointments.length === 0 ? (
              <div className="text-center py-5">
                <FaCalendarAlt size={48} className="text-muted mb-3" />
                <h5>No appointments found</h5>
                <p className="text-muted">No appointments match your current search criteria.</p>
                <Button variant="primary" onClick={() => openModal('create')}>
                  Schedule First Appointment
                </Button>
              </div>
            ) : (
              <Table responsive striped hover className="mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Date & Time</th>
                    <th>Client</th>
                    <th>Service</th>
                    <th>Cosmetologist</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAppointments.map(appointment => {
                    const dateTime = formatDateTime(appointment.appointment_date);
                    const statusDetails = getStatusDetails(appointment.status);
                    
                    return (
                      <tr key={appointment.id}>
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
                            <span>{appointment.client_name}</span>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <FaSpa className="me-2 text-muted" />
                            <span>{appointment.service_name}</span>
                          </div>
                        </td>
                        <td>{appointment.cosmetologist_name}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <FaClock className="me-1 text-muted" />
                            <span>{appointment.duration} min</span>
                          </div>
                        </td>
                        <td>
                          <Badge bg={statusDetails.color} className="d-flex align-items-center">
                            <i className={`${statusDetails.icon} me-1`}></i>
                            {statusDetails.label}
                          </Badge>
                        </td>
                        <td>
                          <strong className="text-success">${appointment.total_amount}</strong>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => openModal('view', appointment)}
                              title="View Details"
                            >
                              <FaEye />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-warning"
                              onClick={() => openModal('edit', appointment)}
                              title="Edit Appointment"
                            >
                              <FaEdit />
                            </Button>
                            {appointment.status === 'scheduled' && (
                              <Button
                                size="sm"
                                variant="outline-success"
                                onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                                title="Confirm"
                              >
                                <FaCheckCircle />
                              </Button>
                            )}
                            {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                                title="Cancel"
                              >
                                <FaTimesCircle />
                              </Button>
                            )}
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
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAppointments.length)} of {filteredAppointments.length} entries
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

        {/* Appointment Modal */}
        <Modal show={showModal} onHide={closeModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {modalType === 'create' && 'Schedule New Appointment'}
              {modalType === 'edit' && 'Edit Appointment'}
              {modalType === 'view' && 'Appointment Details'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalType === 'view' && selectedAppointment ? (
              // View Mode
              <Tabs defaultActiveKey="details" id="appointment-details-tabs">
                <Tab eventKey="details" title="Appointment Details">
                  <div className="mt-3">
                    <Row>
                      <Col md={6}>
                        <h6>Client Information</h6>
                        <p><strong>Name:</strong> {selectedAppointment.client_name}</p>
                        <p><strong>Service:</strong> {selectedAppointment.service_name}</p>
                        <p><strong>Cosmetologist:</strong> {selectedAppointment.cosmetologist_name}</p>
                      </Col>
                      <Col md={6}>
                        <h6>Schedule & Pricing</h6>
                        <p><strong>Date:</strong> {formatDateTime(selectedAppointment.appointment_date).date}</p>
                        <p><strong>Time:</strong> {formatDateTime(selectedAppointment.appointment_date).time}</p>
                        <p><strong>Duration:</strong> {selectedAppointment.duration} minutes</p>
                        <p><strong>Total Amount:</strong> <span className="text-success">${selectedAppointment.total_amount}</span></p>
                      </Col>
                    </Row>
                  </div>
                </Tab>
                <Tab eventKey="notes" title="Notes">
                  <div className="mt-3">
                    {selectedAppointment.consultation_notes && (
                      <>
                        <h6>Consultation Notes</h6>
                        <p>{selectedAppointment.consultation_notes}</p>
                      </>
                    )}
                    
                    {selectedAppointment.service_notes && (
                      <>
                        <h6>Service Notes</h6>
                        <p>{selectedAppointment.service_notes}</p>
                      </>
                    )}
                    
                    {!selectedAppointment.consultation_notes && !selectedAppointment.service_notes && (
                      <p className="text-muted">No notes available for this appointment.</p>
                    )}
                  </div>
                </Tab>
              </Tabs>
            ) : (
              // Create/Edit Form
              <Form onSubmit={handleSubmit}>
                <Tabs defaultActiveKey="basic" id="appointment-form-tabs">
                  <Tab eventKey="basic" title="Basic Information">
                    <div className="mt-3">
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Client *</Form.Label>
                            <Form.Select
                              name="client"
                              value={appointmentForm.client}
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
                            <Form.Label>Service *</Form.Label>
                            <Form.Select
                              name="service"
                              value={appointmentForm.service}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="">Select service...</option>
                              {services.map(service => (
                                <option key={service.id} value={service.id}>
                                  {service.name} - ${service.price} ({service.duration}min)
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Cosmetologist *</Form.Label>
                        <Form.Select
                          name="cosmetologist"
                          value={appointmentForm.cosmetologist}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select cosmetologist...</option>
                          {cosmetologists.map(cosmetologist => (
                            <option key={cosmetologist.id} value={cosmetologist.id}>
                              {cosmetologist.first_name} {cosmetologist.last_name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Date *</Form.Label>
                            <Form.Control
                              type="date"
                              name="appointment_date"
                              value={appointmentForm.appointment_date}
                              onChange={handleInputChange}
                              min={new Date().toISOString().split('T')[0]}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Time *</Form.Label>
                            <Form.Control
                              type="time"
                              name="appointment_time"
                              value={appointmentForm.appointment_time}
                              onChange={handleInputChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Duration (minutes)</Form.Label>
                            <Form.Control
                              type="number"
                              name="duration"
                              value={appointmentForm.duration}
                              onChange={handleInputChange}
                              min="15"
                              max="480"
                              readOnly={appointmentForm.service}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                              name="status"
                              value={appointmentForm.status}
                              onChange={handleInputChange}
                            >
                              {Object.values(APPOINTMENT_STATUS).map(status => (
                                <option key={status.value} value={status.value}>
                                  {status.label}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  </Tab>
                  
                  <Tab eventKey="pricing" title="Pricing">
                    <div className="mt-3">
                      <Row>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Service Price ($)</Form.Label>
                            <Form.Control
                              type="number"
                              step="0.01"
                              name="service_price"
                              value={appointmentForm.service_price}
                              onChange={handleInputChange}
                              min="0"
                              readOnly={appointmentForm.service}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Additional Charges ($)</Form.Label>
                            <Form.Control
                              type="number"
                              step="0.01"
                              name="additional_charges"
                              value={appointmentForm.additional_charges}
                              onChange={handleInputChange}
                              min="0"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Discount ($)</Form.Label>
                            <Form.Control
                              type="number"
                              step="0.01"
                              name="discount"
                              value={appointmentForm.discount}
                              onChange={handleInputChange}
                              min="0"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <div className="alert alert-info">
                        <strong>Total Amount: $
                          {(
                            parseFloat(appointmentForm.service_price || 0) + 
                            parseFloat(appointmentForm.additional_charges || 0) - 
                            parseFloat(appointmentForm.discount || 0)
                          ).toFixed(2)}
                        </strong>
                      </div>
                    </div>
                  </Tab>
                  
                  <Tab eventKey="notes" title="Notes">
                    <div className="mt-3">
                      <Form.Group className="mb-3">
                        <Form.Label>Consultation Notes</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="consultation_notes"
                          value={appointmentForm.consultation_notes}
                          onChange={handleInputChange}
                          placeholder="Pre-service consultation notes, client concerns, expectations..."
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Service Notes</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="service_notes"
                          value={appointmentForm.service_notes}
                          onChange={handleInputChange}
                          placeholder="Notes during or after service, observations, recommendations..."
                        />
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
                {modalType === 'create' ? 'Schedule Appointment' : 'Update Appointment'}
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </Container>
    </ProtectedRoute>
  );
};

export default CosmetologyAppointments;
