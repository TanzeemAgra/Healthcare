import React, { useState, useEffect } from 'react';
import { Modal, Form, Row, Col, Button, Alert } from 'react-bootstrap';
import { FaSave, FaTimes } from 'react-icons/fa';

const PatientForm = ({ show, onHide, patient, isEditing, onSubmit }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'United States',
    emergency_contact_name: '',
    emergency_contact_relationship: '',
    emergency_contact_phone: '',
    insurance_provider: '',
    insurance_policy_number: '',
    allergies: '',
    current_medications: '',
    medical_conditions: '',
    is_active: true
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (patient && isEditing) {
      setFormData({
        first_name: patient.first_name || '',
        middle_name: patient.middle_name || '',
        last_name: patient.last_name || '',
        date_of_birth: patient.date_of_birth || '',
        gender: patient.gender || '',
        phone: patient.phone || '',
        email: patient.email || '',
        address: patient.address || '',
        city: patient.city || '',
        state: patient.state || '',
        zip_code: patient.zip_code || '',
        country: patient.country || 'United States',
        emergency_contact_name: patient.emergency_contact_name || '',
        emergency_contact_relationship: patient.emergency_contact_relationship || '',
        emergency_contact_phone: patient.emergency_contact_phone || '',
        insurance_provider: patient.insurance_provider || '',
        insurance_policy_number: patient.insurance_policy_number || '',
        allergies: patient.allergies || '',
        current_medications: patient.current_medications || '',
        medical_conditions: patient.medical_conditions || '',
        is_active: patient.is_active !== undefined ? patient.is_active : true
      });
    } else {
      // Reset form for new patient
      setFormData({
        first_name: '',
        middle_name: '',
        last_name: '',
        date_of_birth: '',
        gender: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        country: 'United States',
        emergency_contact_name: '',
        emergency_contact_relationship: '',
        emergency_contact_phone: '',
        insurance_provider: '',
        insurance_policy_number: '',
        allergies: '',
        current_medications: '',
        medical_conditions: '',
        is_active: true
      });
    }
    setErrors({});
  }, [patient, isEditing, show]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Phone validation (basic)
    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }

    // Emergency contact phone validation
    if (formData.emergency_contact_phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.emergency_contact_phone)) {
      newErrors.emergency_contact_phone = 'Invalid emergency contact phone format';
    }

    // Date validation (not in future)
    if (formData.date_of_birth && new Date(formData.date_of_birth) > new Date()) {
      newErrors.date_of_birth = 'Date of birth cannot be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onHide();
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle server-side validation errors
      if (error.response?.data) {
        setErrors(error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditing ? 'Edit Patient' : 'Add New Patient'}
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {Object.keys(errors).length > 0 && (
            <Alert variant="danger">
              Please correct the errors below.
            </Alert>
          )}

          {/* Personal Information */}
          <h6 className="mb-3 text-primary">Personal Information</h6>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>First Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  isInvalid={!!errors.first_name}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.first_name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Middle Name</Form.Label>
                <Form.Control
                  type="text"
                  name="middle_name"
                  value={formData.middle_name}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Last Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  isInvalid={!!errors.last_name}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.last_name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Date of Birth *</Form.Label>
                <Form.Control
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                  isInvalid={!!errors.date_of_birth}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.date_of_birth}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Gender *</Form.Label>
                <Form.Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  isInvalid={!!errors.gender}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.gender}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Phone Number *</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  isInvalid={!!errors.phone}
                  placeholder="(123) 456-7890"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phone}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email Address *</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  isInvalid={!!errors.email}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>State</Form.Label>
                <Form.Control
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>ZIP Code</Form.Label>
                <Form.Control
                  type="text"
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Emergency Contact */}
          <h6 className="mb-3 text-primary">Emergency Contact</h6>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Contact Name</Form.Label>
                <Form.Control
                  type="text"
                  name="emergency_contact_name"
                  value={formData.emergency_contact_name}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Relationship</Form.Label>
                <Form.Control
                  type="text"
                  name="emergency_contact_relationship"
                  value={formData.emergency_contact_relationship}
                  onChange={handleInputChange}
                  placeholder="e.g., Spouse, Parent, Sibling"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Contact Phone</Form.Label>
                <Form.Control
                  type="tel"
                  name="emergency_contact_phone"
                  value={formData.emergency_contact_phone}
                  onChange={handleInputChange}
                  isInvalid={!!errors.emergency_contact_phone}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.emergency_contact_phone}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {/* Insurance Information */}
          <h6 className="mb-3 text-primary">Insurance Information</h6>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Insurance Provider</Form.Label>
                <Form.Control
                  type="text"
                  name="insurance_provider"
                  value={formData.insurance_provider}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Policy Number</Form.Label>
                <Form.Control
                  type="text"
                  name="insurance_policy_number"
                  value={formData.insurance_policy_number}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Medical Information */}
          <h6 className="mb-3 text-primary">Medical Information</h6>
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Known Allergies</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  placeholder="List any known allergies..."
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Current Medications</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="current_medications"
                  value={formData.current_medications}
                  onChange={handleInputChange}
                  placeholder="List current medications and dosages..."
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Medical Conditions</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="medical_conditions"
                  value={formData.medical_conditions}
                  onChange={handleInputChange}
                  placeholder="List any chronic conditions or medical history..."
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Status */}
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Check
                  type="checkbox"
                  name="is_active"
                  label="Active Patient"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            <FaTimes className="me-1" />
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            <FaSave className="me-1" />
            {loading ? 'Saving...' : (isEditing ? 'Update Patient' : 'Add Patient')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default PatientForm;
