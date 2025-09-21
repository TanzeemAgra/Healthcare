import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Form, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import apiClient from '../../services/api';
import { DERMATOLOGY_ENDPOINTS } from '../../services/apiConstants';

const DermatologyPatients = () => {
  const [patients, setPatients] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Simple form data for testing
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    skin_type: '',
    primary_concern: '',
    consent_treatment: false
  });

  // Sample patient data
  useEffect(() => {
    const samplePatients = [
      {
        id: 1,
        name: "Sarah Johnson",
        age: 28,
        gender: "Female",
        phone: "(555) 123-4567",
        condition: "Acne Vulgaris",
        severity: "Moderate",
        status: "Active"
      },
      {
        id: 2,
        name: "Michael Chen",
        age: 45,
        gender: "Male",
        phone: "(555) 234-5678",
        condition: "Psoriasis",
        severity: "Severe",
        status: "Under Treatment"
      }
    ];
    setPatients(samplePatients);
  }, []);

  // Form handling functions
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.skin_type) newErrors.skin_type = 'Skin type is required';
    if (!formData.primary_concern.trim()) newErrors.primary_concern = 'Primary concern is required';
    if (!formData.consent_treatment) newErrors.consent_treatment = 'Treatment consent is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      date_of_birth: '',
      gender: '',
      skin_type: '',
      primary_concern: '',
      consent_treatment: false
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await apiClient.post(DERMATOLOGY_ENDPOINTS.PATIENTS, formData);
      
      if (response.data) {
        // Add new patient to the list
        const newPatient = {
          id: response.data.id,
          name: `${formData.first_name} ${formData.last_name}`,
          age: calculateAge(formData.date_of_birth),
          gender: formData.gender,
          phone: formData.phone,
          condition: formData.primary_concern,
          severity: 'Mild',
          status: 'Active'
        };
        
        setPatients(prev => [...prev, newPatient]);
        resetForm();
        setShowAddModal(false);
        toast.success('Patient added successfully!');
      }
    } catch (error) {
      console.error('Error adding patient:', error);
      toast.error('Failed to add patient. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3 mb-0">Dermatology Patients</h1>
            <Button variant="primary" onClick={() => setShowAddModal(true)}>
              <i className="ri-add-line me-2"></i>
              Add New Patient
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <div className="table-responsive">
                <Table striped hover>
                  <thead>
                    <tr>
                      <th>Patient Name</th>
                      <th>Age</th>
                      <th>Gender</th>
                      <th>Phone</th>
                      <th>Condition</th>
                      <th>Severity</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((patient) => (
                      <tr key={patient.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-circle bg-primary text-white me-3 d-flex align-items-center justify-content-center"
                                 style={{width: '40px', height: '40px', borderRadius: '50%', fontSize: '14px', fontWeight: 'bold'}}>
                              {patient.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="fw-semibold">{patient.name}</div>
                            </div>
                          </div>
                        </td>
                        <td>{patient.age}</td>
                        <td>{patient.gender}</td>
                        <td>{patient.phone}</td>
                        <td>{patient.condition}</td>
                        <td>
                          <Badge bg={patient.severity === 'Severe' ? 'danger' : patient.severity === 'Moderate' ? 'warning' : 'success'}>
                            {patient.severity}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={patient.status === 'Active' ? 'primary' : 'warning'}>
                            {patient.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add New Patient Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-user-add-line me-2"></i>
            Add New Dermatology Patient
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    isInvalid={!!errors.first_name}
                    placeholder="Enter first name"
                  />
                  <Form.Control.Feedback type="invalid">{errors.first_name}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    isInvalid={!!errors.last_name}
                    placeholder="Enter last name"
                  />
                  <Form.Control.Feedback type="invalid">{errors.last_name}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    isInvalid={!!errors.email}
                    placeholder="Enter email address"
                  />
                  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    isInvalid={!!errors.phone}
                    placeholder="Enter phone number"
                  />
                  <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Date of Birth <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    isInvalid={!!errors.date_of_birth}
                  />
                  <Form.Control.Feedback type="invalid">{errors.date_of_birth}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Gender <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    isInvalid={!!errors.gender}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.gender}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Skin Type <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="skin_type"
                    value={formData.skin_type}
                    onChange={handleInputChange}
                    isInvalid={!!errors.skin_type}
                  >
                    <option value="">Select skin type</option>
                    <option value="Type I">Type I - Very Fair</option>
                    <option value="Type II">Type II - Fair</option>
                    <option value="Type III">Type III - Medium</option>
                    <option value="Type IV">Type IV - Olive</option>
                    <option value="Type V">Type V - Brown</option>
                    <option value="Type VI">Type VI - Black</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.skin_type}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Primary Skin Concern <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="primary_concern"
                    value={formData.primary_concern}
                    onChange={handleInputChange}
                    isInvalid={!!errors.primary_concern}
                    placeholder="Describe the main skin concern or reason for visit"
                  />
                  <Form.Control.Feedback type="invalid">{errors.primary_concern}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={12}>
                <div className="border rounded p-3 bg-light">
                  <Form.Check
                    type="checkbox"
                    name="consent_treatment"
                    checked={formData.consent_treatment}
                    onChange={handleInputChange}
                    isInvalid={!!errors.consent_treatment}
                    label="I consent to dermatological examination and treatment as recommended by the healthcare provider."
                  />
                  <Form.Control.Feedback type="invalid">{errors.consent_treatment}</Form.Control.Feedback>
                </div>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="outline-secondary" 
              onClick={() => {
                setShowAddModal(false);
                resetForm();
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Adding Patient...
                </>
              ) : (
                <>
                  <i className="ri-save-line me-2"></i>
                  Add Patient
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default DermatologyPatients;
