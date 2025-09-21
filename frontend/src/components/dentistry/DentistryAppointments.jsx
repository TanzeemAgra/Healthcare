import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Spinner,
  Badge,
  Table,
  Modal
} from 'react-bootstrap';
import apiClient from '../../services/api';
import { DENTISTRY_ENDPOINTS } from '../../services/apiConstants';

const DentistryAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingAppointment, setAddingAppointment] = useState(false);

  // Form state for new appointment
  const [appointmentForm, setAppointmentForm] = useState({
    patient_id: '',
    dentist_id: '',
    appointment_date: '',
    appointment_time: '',
    appointment_type: '',
    duration: 30,
    chief_complaint: '',
    notes: '',
    cost: ''
  });

  const [formErrors, setFormErrors] = useState({});

  // Appointment types
  const appointmentTypes = [
    { value: 'consultation', label: 'Consultation' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'filling', label: 'Filling' },
    { value: 'extraction', label: 'Extraction' },
    { value: 'root_canal', label: 'Root Canal' },
    { value: 'crown', label: 'Crown' },
    { value: 'bridge', label: 'Bridge' },
    { value: 'implant', label: 'Implant' },
    { value: 'orthodontic', label: 'Orthodontic' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'follow_up', label: 'Follow-up' }
  ];

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDentists();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('access_token') || localStorage.getItem('token');
      console.log('DentistryAppointments - Token check:', token ? 'Token exists' : 'No token found');
      
      const response = await apiClient.get(DENTISTRY_ENDPOINTS.APPOINTMENTS.LIST);
      setAppointments(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
        // Show demo data for testing when not authenticated
        setAppointments([
          {
            id: 1,
            patient_name: 'Demo Patient 1',
            dentist_name: 'Dr. Demo Dentist',
            appointment_date: '2025-09-01',
            appointment_time: '10:00',
            appointment_type: 'consultation',
            status: 'scheduled',
            chief_complaint: 'Regular checkup'
          },
          {
            id: 2,
            patient_name: 'Demo Patient 2', 
            dentist_name: 'Dr. Demo Dentist',
            appointment_date: '2025-09-01',
            appointment_time: '14:00',
            appointment_type: 'cleaning',
            status: 'scheduled',
            chief_complaint: 'Dental cleaning'
          }
        ]);
      } else if (error.response?.status === 403) {
        setError('Access denied. You do not have permission to view appointments.');
      } else {
        setError('Failed to fetch appointments. Using demo data for testing.');
        // Show demo data for testing when API is not available
        setAppointments([
          {
            id: 1,
            patient_name: 'Demo Patient 1',
            dentist_name: 'Dr. Demo Dentist',
            appointment_date: '2025-09-01',
            appointment_time: '10:00',
            appointment_type: 'consultation',
            status: 'scheduled',
            chief_complaint: 'Regular checkup'
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await apiClient.get(DENTISTRY_ENDPOINTS.PATIENTS.LIST);
      setPatients(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
      // Provide demo data for testing
      setPatients([
        { id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com', phone: '123-456-7890' },
        { id: 2, first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@example.com', phone: '098-765-4321' },
        { id: 3, first_name: 'Bob', last_name: 'Johnson', email: 'bob.johnson@example.com', phone: '555-123-4567' }
      ]);
    }
  };

  const fetchDentists = async () => {
    try {
      const response = await apiClient.get(DENTISTRY_ENDPOINTS.DENTISTS.LIST);
      setDentists(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching dentists:', error);
      // Provide demo data for testing
      setDentists([
        { id: 1, first_name: 'Dr. Sarah', last_name: 'Wilson', specialization: 'General Dentistry', email: 'dr.wilson@clinic.com' },
        { id: 2, first_name: 'Dr. Michael', last_name: 'Brown', specialization: 'Orthodontics', email: 'dr.brown@clinic.com' },
        { id: 3, first_name: 'Dr. Emily', last_name: 'Davis', specialization: 'Oral Surgery', email: 'dr.davis@clinic.com' }
      ]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppointmentForm(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Required fields validation
    if (!appointmentForm.patient_id) errors.patient_id = 'Patient is required';
    if (!appointmentForm.dentist_id) errors.dentist_id = 'Dentist is required';
    if (!appointmentForm.appointment_date) errors.appointment_date = 'Date is required';
    if (!appointmentForm.appointment_time) errors.appointment_time = 'Time is required';
    if (!appointmentForm.appointment_type) errors.appointment_type = 'Appointment type is required';
    if (!appointmentForm.chief_complaint.trim()) errors.chief_complaint = 'Chief complaint is required';
    
    // Duration validation
    if (appointmentForm.duration < 15 || appointmentForm.duration > 240) {
      errors.duration = 'Duration must be between 15 and 240 minutes';
    }
    
    // Cost validation
    if (appointmentForm.cost && (isNaN(appointmentForm.cost) || appointmentForm.cost < 0)) {
      errors.cost = 'Cost must be a valid positive number';
    }

    // Date validation (can't be in the past)
    const selectedDateTime = new Date(`${appointmentForm.appointment_date}T${appointmentForm.appointment_time}`);
    const now = new Date();
    if (selectedDateTime < now) {
      errors.appointment_date = 'Appointment cannot be scheduled in the past';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    
    // Validate form first
    if (!validateForm()) {
      setError('Please correct the errors in the form');
      return;
    }
    
    setAddingAppointment(true);
    setError(null);
    
    try {
      // Combine date and time into datetime
      const appointmentDateTime = `${appointmentForm.appointment_date}T${appointmentForm.appointment_time}:00`;
      
      const appointmentData = {
        patient_id: parseInt(appointmentForm.patient_id),
        dentist_id: parseInt(appointmentForm.dentist_id),
        appointment_date: appointmentDateTime,
        appointment_type: appointmentForm.appointment_type,
        duration: parseInt(appointmentForm.duration),
        chief_complaint: appointmentForm.chief_complaint,
        notes: appointmentForm.notes,
        cost: appointmentForm.cost ? parseFloat(appointmentForm.cost) : 0.00
      };

      await apiClient.post(DENTISTRY_ENDPOINTS.APPOINTMENTS.CREATE, appointmentData);
      
      setSuccess('Appointment scheduled successfully!');
      setShowAddModal(false);
      setAppointmentForm({
        patient_id: '',
        dentist_id: '',
        appointment_date: '',
        appointment_time: '',
        appointment_type: '',
        duration: 30,
        chief_complaint: '',
        notes: '',
        cost: ''
      });
      setFormErrors({});
      fetchAppointments(); // Refresh the appointments list
    } catch (error) {
      console.error('Error adding appointment:', error);
      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else if (error.response?.data?.non_field_errors) {
        setError(error.response.data.non_field_errors[0]);
      } else if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else {
        setError('Failed to schedule appointment. Please try again.');
      }
    } finally {
      setAddingAppointment(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'scheduled': 'primary',
      'confirmed': 'success',
      'in_progress': 'warning',
      'completed': 'success',
      'cancelled': 'danger',
      'no_show': 'secondary',
      'rescheduled': 'info'
    };
    return <Badge bg={statusColors[status] || 'secondary'}>{status.replace('_', ' ').toUpperCase()}</Badge>;
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Container fluid className="mt-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>
                <i className="ri-calendar-line me-2 text-primary"></i>
                Dental Appointments
              </h2>
              <p className="text-muted">Manage dental appointments and scheduling</p>
            </div>
            <Button 
              variant="primary" 
              onClick={() => setShowAddModal(true)}
            >
              <i className="ri-add-line me-2"></i>
              New Appointment
            </Button>
          </div>
        </Col>
      </Row>

      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              <Alert.Heading>Error</Alert.Heading>
              <p>{error}</p>
              {error.includes('log in') && (
                <Button variant="primary" onClick={() => navigate('/auth/sign-in')}>
                  Go to Login
                </Button>
              )}
            </Alert>
          </Col>
        </Row>
      )}

      {success && (
        <Row className="mb-3">
          <Col>
            <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
              <Alert.Heading>Success</Alert.Heading>
              <p>{success}</p>
            </Alert>
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Appointments List</h5>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Loading appointments...</p>
                </div>
              ) : appointments.length > 0 ? (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Appointment ID</th>
                      <th>Patient</th>
                      <th>Dentist</th>
                      <th>Date & Time</th>
                      <th>Type</th>
                      <th>Duration</th>
                      <th>Status</th>
                      <th>Chief Complaint</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>
                          <Badge bg="primary">{appointment.appointment_id?.slice(0, 8)}</Badge>
                        </td>
                        <td>
                          {appointment.patient?.user?.first_name} {appointment.patient?.user?.last_name}
                          <br />
                          <small className="text-muted">{appointment.patient?.patient_id}</small>
                        </td>
                        <td>
                          {appointment.dentist?.user?.first_name} {appointment.dentist?.user?.last_name}
                          <br />
                          <small className="text-muted">{appointment.dentist?.specialization}</small>
                        </td>
                        <td>{formatDateTime(appointment.appointment_date)}</td>
                        <td>
                          <Badge bg="info">{appointment.appointment_type?.replace('_', ' ')}</Badge>
                        </td>
                        <td>{appointment.duration} min</td>
                        <td>{getStatusBadge(appointment.status)}</td>
                        <td>{appointment.chief_complaint}</td>
                        <td>
                          <Button 
                            size="sm" 
                            variant="outline-primary" 
                            className="me-2"
                            onClick={() => navigate(`/dentistry/appointments/${appointment.id}`)}
                          >
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline-secondary"
                            onClick={() => navigate(`/dentistry/appointments/${appointment.id}/edit`)}
                          >
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4">
                  <i className="ri-calendar-line text-muted" style={{ fontSize: '3rem' }}></i>
                  <h5 className="text-muted mt-3">No Appointments Found</h5>
                  <p className="text-muted">
                    Click "New Appointment" to schedule your first appointment.
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add Appointment Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-calendar-add-line me-2"></i>
            Schedule New Appointment
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddAppointment}>
          <Modal.Body>
            {/* Display global error message if form has errors */}
            {Object.keys(formErrors).length > 0 && (
              <Alert variant="danger" className="mb-4">
                <i className="ri-error-warning-line me-2"></i>
                Please correct the following errors before submitting:
                <ul className="mb-0 mt-2">
                  {Object.entries(formErrors).map(([field, error]) => (
                    <li key={field}>{error}</li>
                  ))}
                </ul>
              </Alert>
            )}

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Patient *</Form.Label>
                  <Form.Select
                    name="patient_id"
                    value={appointmentForm.patient_id}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.patient_id}
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.user?.first_name} {patient.user?.last_name} - {patient.patient_id}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formErrors.patient_id}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Dentist *</Form.Label>
                  <Form.Select
                    name="dentist_id"
                    value={appointmentForm.dentist_id}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.dentist_id}
                    required
                  >
                    <option value="">Select Dentist</option>
                    {dentists.map((dentist) => (
                      <option key={dentist.id} value={dentist.id}>
                        Dr. {dentist.user?.first_name} {dentist.user?.last_name} - {dentist.specialization}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formErrors.dentist_id}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Date *</Form.Label>
                  <Form.Control
                    type="date"
                    name="appointment_date"
                    value={appointmentForm.appointment_date}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.appointment_date}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.appointment_date}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Time *</Form.Label>
                  <Form.Control
                    type="time"
                    name="appointment_time"
                    value={appointmentForm.appointment_time}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.appointment_time}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.appointment_time}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration (minutes) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="duration"
                    value={appointmentForm.duration}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.duration}
                    min="15"
                    max="240"
                    step="15"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.duration}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Appointment Type *</Form.Label>
                  <Form.Select
                    name="appointment_type"
                    value={appointmentForm.appointment_type}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.appointment_type}
                    required
                  >
                    <option value="">Select Appointment Type</option>
                    {appointmentTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formErrors.appointment_type}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Cost ($)</Form.Label>
                  <Form.Control
                    type="number"
                    name="cost"
                    value={appointmentForm.cost}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.cost}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.cost}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Chief Complaint *</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="chief_complaint"
                value={appointmentForm.chief_complaint}
                onChange={handleInputChange}
                isInvalid={!!formErrors.chief_complaint}
                placeholder="Describe the patient's main concern or reason for the appointment..."
                required
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.chief_complaint}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Additional Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="notes"
                value={appointmentForm.notes}
                onChange={handleInputChange}
                placeholder="Any additional notes or special instructions..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <div className="w-100 d-flex justify-content-between align-items-center">
              <small className="text-muted">
                <i className="ri-information-line me-1"></i>
                Fields marked with * are required
              </small>
              <div>
                <Button 
                  variant="secondary" 
                  onClick={() => setShowAddModal(false)}
                  disabled={addingAppointment}
                  className="me-2"
                >
                  <i className="ri-close-line me-1"></i>
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={addingAppointment}
                >
                  {addingAppointment ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Scheduling...
                    </>
                  ) : (
                    <>
                      <i className="ri-calendar-add-line me-1"></i>
                      Schedule Appointment
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default DentistryAppointments;

