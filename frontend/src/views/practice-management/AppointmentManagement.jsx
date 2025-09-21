import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Table, Badge, Alert, InputGroup, Calendar } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDoctor, setFilterDoctor] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const [formData, setFormData] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    doctorName: '',
    appointmentDate: '',
    appointmentTime: '',
    duration: '30',
    type: 'consultation',
    status: 'scheduled',
    notes: '',
    symptoms: '',
    urgency: 'normal'
  });

  const appointmentTypes = [
    'consultation', 'follow_up', 'emergency', 'surgery', 
    'therapy', 'vaccination', 'check_up', 'lab_test'
  ];

  const appointmentStatuses = [
    'scheduled', 'confirmed', 'in_progress', 'completed', 
    'cancelled', 'no_show', 'rescheduled'
  ];

  const urgencyLevels = ['low', 'normal', 'high', 'critical'];

  // Sample data
  useEffect(() => {
    setAppointments([
      {
        id: 1,
        patientName: 'Emma Wilson',
        patientEmail: 'emma.wilson@email.com',
        patientPhone: '+1-555-0201',
        doctorName: 'Dr. John Smith',
        appointmentDate: '2024-01-25',
        appointmentTime: '10:00',
        duration: 30,
        type: 'consultation',
        status: 'scheduled',
        notes: 'Regular check-up',
        symptoms: 'Mild headache, fatigue',
        urgency: 'normal',
        createdAt: '2024-01-20'
      },
      {
        id: 2,
        patientName: 'Michael Brown',
        patientEmail: 'michael.brown@email.com',
        patientPhone: '+1-555-0203',
        doctorName: 'Dr. Sarah Johnson',
        appointmentDate: '2024-01-25',
        appointmentTime: '14:30',
        duration: 45,
        type: 'follow_up',
        status: 'confirmed',
        notes: 'Diabetes follow-up',
        symptoms: 'Blood sugar monitoring',
        urgency: 'high',
        createdAt: '2024-01-22'
      }
    ]);
  }, []);

  const handleAddAppointment = (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      const newAppointment = {
        id: appointments.length + 1,
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setAppointments([...appointments, newAppointment]);
      setShowAddModal(false);
      resetForm();
      setLoading(false);
    }, 1000);
  };

  const handleEditAppointment = (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setAppointments(appointments.map(apt => 
        apt.id === selectedAppointment.id ? { ...selectedAppointment, ...formData } : apt
      ));
      setShowEditModal(false);
      resetForm();
      setLoading(false);
    }, 1000);
  };

  const handleDeleteAppointment = (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      setAppointments(appointments.filter(apt => apt.id !== appointmentId));
    }
  };

  const handleStatusChange = (appointmentId, newStatus) => {
    setAppointments(appointments.map(apt =>
      apt.id === appointmentId ? { ...apt, status: newStatus } : apt
    ));
  };

  const resetForm = () => {
    setFormData({
      patientName: '',
      patientEmail: '',
      patientPhone: '',
      doctorName: '',
      appointmentDate: '',
      appointmentTime: '',
      duration: '30',
      type: 'consultation',
      status: 'scheduled',
      notes: '',
      symptoms: '',
      urgency: 'normal'
    });
  };

  const openEditModal = (appointment) => {
    setSelectedAppointment(appointment);
    setFormData(appointment);
    setShowEditModal(true);
  };

  const openViewModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowViewModal(true);
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.patientEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === '' || appointment.status === filterStatus;
    const matchesDoctor = filterDoctor === '' || appointment.doctorName === filterDoctor;
    
    return matchesSearch && matchesStatus && matchesDoctor;
  });

  const getStatusBadge = (status) => {
    const variants = {
      scheduled: 'primary',
      confirmed: 'info',
      in_progress: 'warning',
      completed: 'success',
      cancelled: 'danger',
      no_show: 'secondary',
      rescheduled: 'dark'
    };
    return <Badge bg={variants[status]}>{status.replace('_', ' ').toUpperCase()}</Badge>;
  };

  const getUrgencyBadge = (urgency) => {
    const variants = {
      low: 'secondary',
      normal: 'primary',
      high: 'warning',
      critical: 'danger'
    };
    return <Badge bg={variants[urgency]}>{urgency.toUpperCase()}</Badge>;
  };

  const getTypeBadge = (type) => {
    const variants = {
      consultation: 'info',
      follow_up: 'primary',
      emergency: 'danger',
      surgery: 'warning',
      therapy: 'success',
      vaccination: 'secondary',
      check_up: 'info',
      lab_test: 'dark'
    };
    return <Badge bg={variants[type]} className="me-1">{type.replace('_', ' ').toUpperCase()}</Badge>;
  };

  const todayAppointments = appointments.filter(apt => 
    apt.appointmentDate === new Date().toISOString().split('T')[0]
  );

  const upcomingAppointments = appointments.filter(apt => 
    new Date(apt.appointmentDate) > new Date() && apt.status !== 'cancelled'
  );

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">
                <i className="ri-calendar-check-line me-2"></i>
                Appointment Management
              </h2>
              <p className="text-muted mb-0">Schedule and manage patient appointments</p>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowAddModal(true)}
              className="d-flex align-items-center"
            >
              <i className="ri-add-line me-2"></i>
              Schedule Appointment
            </Button>
          </div>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <motion.div whileHover={{ y: -5 }}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <div className="rounded-circle bg-primary-subtle p-3">
                    <i className="ri-calendar-line fs-3 text-primary"></i>
                  </div>
                </div>
                <h3 className="mb-1">{todayAppointments.length}</h3>
                <p className="text-muted mb-0">Today's Appointments</p>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
        <Col md={3}>
          <motion.div whileHover={{ y: -5 }}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <div className="rounded-circle bg-success-subtle p-3">
                    <i className="ri-calendar-check-line fs-3 text-success"></i>
                  </div>
                </div>
                <h3 className="mb-1">{upcomingAppointments.length}</h3>
                <p className="text-muted mb-0">Upcoming Appointments</p>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
        <Col md={3}>
          <motion.div whileHover={{ y: -5 }}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <div className="rounded-circle bg-warning-subtle p-3">
                    <i className="ri-time-line fs-3 text-warning"></i>
                  </div>
                </div>
                <h3 className="mb-1">
                  {appointments.filter(apt => apt.status === 'scheduled').length}
                </h3>
                <p className="text-muted mb-0">Pending Confirmation</p>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
        <Col md={3}>
          <motion.div whileHover={{ y: -5 }}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <div className="rounded-circle bg-danger-subtle p-3">
                    <i className="ri-alert-line fs-3 text-danger"></i>
                  </div>
                </div>
                <h3 className="mb-1">
                  {appointments.filter(apt => apt.urgency === 'critical').length}
                </h3>
                <p className="text-muted mb-0">Critical Appointments</p>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Quick Status Updates for Today */}
      {todayAppointments.length > 0 && (
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0">
                <h5 className="mb-0">
                  <i className="ri-today-line me-2"></i>
                  Today's Schedule
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  {todayAppointments.slice(0, 4).map(appointment => (
                    <Col md={6} lg={3} key={appointment.id}>
                      <Card className="border border-primary mb-3">
                        <Card.Body className="p-3">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <strong>{appointment.appointmentTime}</strong>
                            {getStatusBadge(appointment.status)}
                          </div>
                          <h6 className="mb-1">{appointment.patientName}</h6>
                          <p className="text-muted mb-1 small">{appointment.doctorName}</p>
                          <div className="d-flex justify-content-between align-items-center">
                            {getTypeBadge(appointment.type)}
                            <div className="btn-group btn-group-sm">
                              <Button
                                variant="outline-success"
                                size="sm"
                                onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                                disabled={appointment.status === 'completed'}
                              >
                                <i className="ri-check-line"></i>
                              </Button>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => openViewModal(appointment)}
                              >
                                <i className="ri-eye-line"></i>
                              </Button>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Filters and Search */}
      <Row className="mb-4">
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>
              <i className="ri-search-line"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search appointments..."
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
            <option value="">All Statuses</option>
            {appointmentStatuses.map(status => (
              <option key={status} value={status}>
                {status.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select
            value={filterDoctor}
            onChange={(e) => setFilterDoctor(e.target.value)}
          >
            <option value="">All Doctors</option>
            <option value="Dr. John Smith">Dr. John Smith</option>
            <option value="Dr. Sarah Johnson">Dr. Sarah Johnson</option>
            <option value="Dr. Michael Davis">Dr. Michael Davis</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Button
            variant="outline-secondary"
            className="w-100"
            onClick={() => {
              setSearchTerm('');
              setFilterStatus('');
              setFilterDoctor('');
            }}
          >
            Clear Filters
          </Button>
        </Col>
      </Row>

      {/* Appointments Table */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date & Time</th>
                  <th>Type</th>
                  <th>Urgency</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredAppointments.map((appointment, index) => (
                    <motion.tr
                      key={appointment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="rounded-circle bg-primary-subtle p-2 me-3">
                            <i className="ri-user-line text-primary"></i>
                          </div>
                          <div>
                            <h6 className="mb-0">{appointment.patientName}</h6>
                            <small className="text-muted">{appointment.patientEmail}</small>
                          </div>
                        </div>
                      </td>
                      <td>{appointment.doctorName}</td>
                      <td>
                        <div>
                          <strong>{appointment.appointmentDate}</strong>
                          <br />
                          <small className="text-muted">
                            {appointment.appointmentTime} ({appointment.duration} min)
                          </small>
                        </div>
                      </td>
                      <td>{getTypeBadge(appointment.type)}</td>
                      <td>{getUrgencyBadge(appointment.urgency)}</td>
                      <td>{getStatusBadge(appointment.status)}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => openViewModal(appointment)}
                            title="View Details"
                          >
                            <i className="ri-eye-line"></i>
                          </Button>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => openEditModal(appointment)}
                            title="Edit Appointment"
                          >
                            <i className="ri-edit-line"></i>
                          </Button>
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                            title="Confirm Appointment"
                            disabled={appointment.status === 'completed' || appointment.status === 'confirmed'}
                          >
                            <i className="ri-check-line"></i>
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteAppointment(appointment.id)}
                            title="Cancel Appointment"
                          >
                            <i className="ri-close-line"></i>
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Add Appointment Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-calendar-event-line me-2"></i>
            Schedule New Appointment
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddAppointment}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Patient Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.patientName}
                    onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Patient Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.patientEmail}
                    onChange={(e) => setFormData({...formData, patientEmail: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Patient Phone *</Form.Label>
                  <Form.Control
                    type="tel"
                    value={formData.patientPhone}
                    onChange={(e) => setFormData({...formData, patientPhone: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Doctor *</Form.Label>
                  <Form.Select
                    value={formData.doctorName}
                    onChange={(e) => setFormData({...formData, doctorName: e.target.value})}
                    required
                  >
                    <option value="">Select Doctor</option>
                    <option value="Dr. John Smith">Dr. John Smith</option>
                    <option value="Dr. Sarah Johnson">Dr. Sarah Johnson</option>
                    <option value="Dr. Michael Davis">Dr. Michael Davis</option>
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
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Time *</Form.Label>
                  <Form.Control
                    type="time"
                    value={formData.appointmentTime}
                    onChange={(e) => setFormData({...formData, appointmentTime: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration (minutes)</Form.Label>
                  <Form.Select
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Type *</Form.Label>
                  <Form.Select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    required
                  >
                    {appointmentTypes.map(type => (
                      <option key={type} value={type}>
                        {type.replace('_', ' ').toUpperCase()}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Urgency</Form.Label>
                  <Form.Select
                    value={formData.urgency}
                    onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                  >
                    {urgencyLevels.map(level => (
                      <option key={level} value={level}>
                        {level.toUpperCase()}
                      </option>
                    ))}
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
                    {appointmentStatuses.map(status => (
                      <option key={status} value={status}>
                        {status.replace('_', ' ').toUpperCase()}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Symptoms/Reason for Visit</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.symptoms}
                onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                placeholder="Describe symptoms or reason for appointment"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Additional Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Any additional notes or instructions"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Scheduling...
                </>
              ) : (
                <>
                  <i className="ri-save-line me-2"></i>
                  Schedule Appointment
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* View Appointment Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-calendar-event-line me-2"></i>
            Appointment Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <Row>
              <Col md={6}>
                <h6>Patient Information</h6>
                <Table size="sm" className="mb-4">
                  <tbody>
                    <tr>
                      <td><strong>Name:</strong></td>
                      <td>{selectedAppointment.patientName}</td>
                    </tr>
                    <tr>
                      <td><strong>Email:</strong></td>
                      <td>{selectedAppointment.patientEmail}</td>
                    </tr>
                    <tr>
                      <td><strong>Phone:</strong></td>
                      <td>{selectedAppointment.patientPhone}</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
              <Col md={6}>
                <h6>Appointment Information</h6>
                <Table size="sm" className="mb-4">
                  <tbody>
                    <tr>
                      <td><strong>Doctor:</strong></td>
                      <td>{selectedAppointment.doctorName}</td>
                    </tr>
                    <tr>
                      <td><strong>Date:</strong></td>
                      <td>{selectedAppointment.appointmentDate}</td>
                    </tr>
                    <tr>
                      <td><strong>Time:</strong></td>
                      <td>{selectedAppointment.appointmentTime}</td>
                    </tr>
                    <tr>
                      <td><strong>Duration:</strong></td>
                      <td>{selectedAppointment.duration} minutes</td>
                    </tr>
                    <tr>
                      <td><strong>Type:</strong></td>
                      <td>{getTypeBadge(selectedAppointment.type)}</td>
                    </tr>
                    <tr>
                      <td><strong>Status:</strong></td>
                      <td>{getStatusBadge(selectedAppointment.status)}</td>
                    </tr>
                    <tr>
                      <td><strong>Urgency:</strong></td>
                      <td>{getUrgencyBadge(selectedAppointment.urgency)}</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
              <Col md={12}>
                <h6>Symptoms/Reason</h6>
                <p>{selectedAppointment.symptoms || 'No symptoms recorded'}</p>
                
                <h6>Notes</h6>
                <p>{selectedAppointment.notes || 'No additional notes'}</p>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              setShowViewModal(false);
              openEditModal(selectedAppointment);
            }}
          >
            <i className="ri-edit-line me-2"></i>
            Edit Appointment
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AppointmentManagement;
