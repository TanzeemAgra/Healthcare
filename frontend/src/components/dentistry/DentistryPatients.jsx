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
import { DENTISTRY_ENDPOINTS, AUTH_ENDPOINTS } from '../../services/apiConstants';

const DentistryPatients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingPatient, setAddingPatient] = useState(false);
  
  // Form state for new patient
  const [patientForm, setPatientForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    emergency_contact: '',
    emergency_phone: '',
    emergency_relationship: '',
    medical_history: '',
    allergies: '',
    medications: '',
    insurance_provider: '',
    insurance_number: '',
    dental_concerns: '',
    previous_dentist: '',
    last_dental_visit: '',
    consent_forms: false,
    privacy_policy: false
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching dentistry patients...');
      
      const token = localStorage.getItem('access_token') || localStorage.getItem('token');
      console.log('DentistryPatients - Token check:', token ? 'Token exists' : 'No token found');
      
      // Try to fetch patients regardless of token (apiClient handles authentication)
      const response = await apiClient.get(DENTISTRY_ENDPOINTS.PATIENTS.LIST);
      console.log('Patients response:', response.data);
      
      // Ensure we always set an array
      const patientsData = response.data?.results || response.data || [];
      setPatients(Array.isArray(patientsData) ? patientsData : []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else if (error.response?.status === 403) {
        setError('Access denied. You do not have permission to view patient records.');
      } else if (error.response?.status === 404) {
        setError('Patient records endpoint not found. Please contact support.');
        // Set mock data for 404 errors to show the interface
        setPatients([
          {
            id: 1,
            patient_id: 'P001',
            user: { first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com' },
            phone: '+1234567890',
            date_of_birth: '1985-05-15',
            emergency_contact: 'Jane Doe (+1234567891)'
          },
          {
            id: 2,
            patient_id: 'P002',
            user: { first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@example.com' },
            phone: '+1234567892',
            date_of_birth: '1990-08-20',
            emergency_contact: 'John Smith (+1234567893)'
          }
        ]);
      } else {
        setError(`Failed to fetch patients: ${error.response?.data?.detail || error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPatientForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field when user starts typing
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
    if (!patientForm.first_name.trim()) errors.first_name = 'First name is required';
    if (!patientForm.last_name.trim()) errors.last_name = 'Last name is required';
    if (!patientForm.email.trim()) errors.email = 'Email is required';
    if (!patientForm.phone.trim()) errors.phone = 'Phone number is required';
    if (!patientForm.date_of_birth) errors.date_of_birth = 'Date of birth is required';
    if (!patientForm.gender) errors.gender = 'Gender is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (patientForm.email && !emailRegex.test(patientForm.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Phone validation (basic)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (patientForm.phone && !phoneRegex.test(patientForm.phone.replace(/\D/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    // Age validation
    if (patientForm.date_of_birth) {
      const birthDate = new Date(patientForm.date_of_birth);
      const today = new Date();
      const age = Math.floor((today - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
      if (age < 0 || age > 120) {
        errors.date_of_birth = 'Please enter a valid birth date';
      }
    }
    
    // Consent validation
    if (!patientForm.consent_forms) {
      errors.consent_forms = 'Please acknowledge consent forms';
    }
    if (!patientForm.privacy_policy) {
      errors.privacy_policy = 'Please accept privacy policy';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    
    // Validate form first
    if (!validateForm()) {
      setError('Please correct the errors in the form');
      return;
    }
    
    setAddingPatient(true);
    setError(null);
    
    try {
      // First create the user account
      const userData = {
        email: patientForm.email,
        password: 'DefaultPassword123!', // You might want to generate this or ask user to set it
        full_name: `${patientForm.first_name} ${patientForm.last_name}`,
        role: 'patient',
        phone_number: patientForm.phone
      };

      const userResponse = await apiClient.post(AUTH_ENDPOINTS.REGISTER, userData);
      
      if (userResponse.data.success) {
        // Then create the dental patient profile
        const patientData = {
          user_id: userResponse.data.user.id,
          patient_id: `DENT${Date.now()}`, // Generate unique patient ID
          date_of_birth: patientForm.date_of_birth,
          phone: patientForm.phone,
          emergency_contact: patientForm.emergency_contact,
          emergency_phone: patientForm.emergency_phone,
          medical_history: patientForm.medical_history,
          allergies: patientForm.allergies,
          medications: patientForm.medications,
          insurance_provider: patientForm.insurance_provider,
          insurance_number: patientForm.insurance_number
        };

        await apiClient.post(DENTISTRY_ENDPOINTS.PATIENTS.CREATE, patientData);
        
        setSuccess('Patient added successfully!');
        setShowAddModal(false);
        setPatientForm({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          date_of_birth: '',
          gender: '',
          address: '',
          city: '',
          state: '',
          zip_code: '',
          emergency_contact: '',
          emergency_phone: '',
          emergency_relationship: '',
          medical_history: '',
          allergies: '',
          medications: '',
          insurance_provider: '',
          insurance_number: '',
          dental_concerns: '',
          previous_dentist: '',
          last_dental_visit: '',
          consent_forms: false,
          privacy_policy: false
        });
        setFormErrors({});
        fetchPatients(); // Refresh the patient list
      } else {
        setError(userResponse.data.error || 'Failed to create user account');
      }
    } catch (error) {
      console.error('Error adding patient:', error);
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.response?.data?.email) {
        setError('Email already exists. Please use a different email.');
      } else if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else {
        setError('Failed to add patient. Please try again.');
      }
    } finally {
      setAddingPatient(false);
    }
  };

  return (
    <Container fluid className="mt-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>
                <i className="ri-group-line me-2 text-primary"></i>
                Dental Patients
              </h2>
              <p className="text-muted">Manage dental patient records and information</p>
            </div>
            <Button 
              variant="primary" 
              onClick={() => setShowAddModal(true)}
            >
              <i className="ri-add-line me-2"></i>
              Add Patient
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
              <h5 className="mb-0">Patient List</h5>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Loading patients...</p>
                </div>
              ) : patients.length > 0 ? (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Patient ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Date of Birth</th>
                      <th>Emergency Contact</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(patients) && patients.length > 0 ? (
                      patients.map((patient) => (
                        <tr key={patient.id}>
                          <td>
                            <Badge bg="primary">{patient.patient_id}</Badge>
                          </td>
                          <td>{patient.user?.first_name} {patient.user?.last_name}</td>
                          <td>{patient.user?.email}</td>
                          <td>{patient.phone}</td>
                          <td>{patient.date_of_birth}</td>
                        <td>{patient.emergency_contact}</td>
                        <td>
                          <Button 
                            size="sm" 
                            variant="outline-primary" 
                            className="me-2"
                            onClick={() => navigate(`/dentistry/patients/${patient.id}`)}
                          >
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline-secondary"
                            onClick={() => navigate(`/dentistry/patients/${patient.id}/edit`)}
                          >
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center text-muted py-4">
                          {loading ? 'Loading patients...' : 'No patients found'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4">
                  <i className="ri-user-3-line text-muted" style={{ fontSize: '3rem' }}></i>
                  <h5 className="text-muted mt-3">No Patients Found</h5>
                  <p className="text-muted">
                    Click "Add Patient" to register your first dental patient.
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add Patient Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-user-add-line me-2"></i>
            Add New Dental Patient
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddPatient}>
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

            {/* Personal Information Section */}
            <div className="border rounded p-3 mb-4">
              <h6 className="text-primary mb-3">
                <i className="ri-user-line me-2"></i>
                Personal Information
              </h6>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>First Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="first_name"
                      value={patientForm.first_name}
                      onChange={handleInputChange}
                      isInvalid={!!formErrors.first_name}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.first_name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Last Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="last_name"
                      value={patientForm.last_name}
                      onChange={handleInputChange}
                      isInvalid={!!formErrors.last_name}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.last_name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Gender *</Form.Label>
                    <Form.Select
                      name="gender"
                      value={patientForm.gender}
                      onChange={handleInputChange}
                      isInvalid={!!formErrors.gender}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {formErrors.gender}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email *</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={patientForm.email}
                      onChange={handleInputChange}
                      isInvalid={!!formErrors.email}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone *</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={patientForm.phone}
                      onChange={handleInputChange}
                      isInvalid={!!formErrors.phone}
                      placeholder="(555) 123-4567"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.phone}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date of Birth *</Form.Label>
                    <Form.Control
                      type="date"
                      name="date_of_birth"
                      value={patientForm.date_of_birth}
                      onChange={handleInputChange}
                      isInvalid={!!formErrors.date_of_birth}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.date_of_birth}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* Address Information Section */}
            <div className="border rounded p-3 mb-4">
              <h6 className="text-primary mb-3">
                <i className="ri-map-pin-line me-2"></i>
                Address Information
              </h6>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Street Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={patientForm.address}
                      onChange={handleInputChange}
                      placeholder="123 Main Street"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      value={patientForm.city}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>State</Form.Label>
                    <Form.Control
                      type="text"
                      name="state"
                      value={patientForm.state}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>ZIP Code</Form.Label>
                    <Form.Control
                      type="text"
                      name="zip_code"
                      value={patientForm.zip_code}
                      onChange={handleInputChange}
                      placeholder="12345"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* Emergency Contact Section */}
            <div className="border rounded p-3 mb-4">
              <h6 className="text-primary mb-3">
                <i className="ri-phone-line me-2"></i>
                Emergency Contact
              </h6>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Emergency Contact Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="emergency_contact"
                      value={patientForm.emergency_contact}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Emergency Phone</Form.Label>
                    <Form.Control
                      type="tel"
                      name="emergency_phone"
                      value={patientForm.emergency_phone}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Relationship</Form.Label>
                    <Form.Select
                      name="emergency_relationship"
                      value={patientForm.emergency_relationship}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Relationship</option>
                      <option value="spouse">Spouse</option>
                      <option value="parent">Parent</option>
                      <option value="child">Child</option>
                      <option value="sibling">Sibling</option>
                      <option value="friend">Friend</option>
                      <option value="other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* Insurance Information Section */}
            <div className="border rounded p-3 mb-4">
              <h6 className="text-primary mb-3">
                <i className="ri-shield-line me-2"></i>
                Insurance Information
              </h6>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Insurance Provider</Form.Label>
                    <Form.Control
                      type="text"
                      name="insurance_provider"
                      value={patientForm.insurance_provider}
                      onChange={handleInputChange}
                      placeholder="Blue Cross Blue Shield"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Insurance Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="insurance_number"
                      value={patientForm.insurance_number}
                      onChange={handleInputChange}
                      placeholder="INS123456789"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* Medical and Dental History Section */}
            <div className="border rounded p-3 mb-4">
              <h6 className="text-primary mb-3">
                <i className="ri-stethoscope-line me-2"></i>
                Medical & Dental History
              </h6>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Previous Dentist</Form.Label>
                    <Form.Control
                      type="text"
                      name="previous_dentist"
                      value={patientForm.previous_dentist}
                      onChange={handleInputChange}
                      placeholder="Dr. Smith's Dental Office"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Last Dental Visit</Form.Label>
                    <Form.Control
                      type="date"
                      name="last_dental_visit"
                      value={patientForm.last_dental_visit}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Current Dental Concerns</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="dental_concerns"
                  value={patientForm.dental_concerns}
                  onChange={handleInputChange}
                  placeholder="Describe any current dental pain, concerns, or issues..."
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Medical History</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="medical_history"
                  value={patientForm.medical_history}
                  onChange={handleInputChange}
                  placeholder="List any relevant medical conditions, surgeries, or health issues..."
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Allergies</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="allergies"
                      value={patientForm.allergies}
                      onChange={handleInputChange}
                      placeholder="List any known allergies (medications, foods, materials)..."
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Current Medications</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="medications"
                      value={patientForm.medications}
                      onChange={handleInputChange}
                      placeholder="List all current medications and dosages..."
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* Consent and Privacy Section */}
            <div className="border rounded p-3 mb-4">
              <h6 className="text-primary mb-3">
                <i className="ri-file-text-line me-2"></i>
                Consent and Privacy
              </h6>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  name="consent_forms"
                  checked={patientForm.consent_forms}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.consent_forms}
                  label="I acknowledge that I have read and understood the dental treatment consent forms"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.consent_forms}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  name="privacy_policy"
                  checked={patientForm.privacy_policy}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.privacy_policy}
                  label="I agree to the practice's privacy policy and HIPAA regulations"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.privacy_policy}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
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
                  disabled={addingPatient}
                  className="me-2"
                >
                  <i className="ri-close-line me-1"></i>
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={addingPatient}
                >
                  {addingPatient ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Adding Patient...
                    </>
                  ) : (
                    <>
                      <i className="ri-user-add-line me-1"></i>
                      Add Patient
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

export default DentistryPatients;

