import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert, Spinner, Card, Badge, ProgressBar } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { doctorAPI } from '../../services/api';

const AddDoctorForm = ({ onSuccess, onCancel }) => {
  const { accessToken } = useSelector(state => state.auth);
  const [formData, setFormData] = useState({
    // User fields
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password: '',
    
    // Doctor fields
    license_number: '',
    specialization: '',
    qualification: '',
    years_experience: '',
    phone_number: '',
    education: '',
    certifications: '',
    hospital_affiliation: '',
    consultation_fee: '',
    bio: '',
    is_available_emergency: false
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [formProgress, setFormProgress] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [dbConnected, setDbConnected] = useState(null);
  const [existingData, setExistingData] = useState({ emails: [], usernames: [], licenses: [] });

  // Check database connectivity on component mount
  useEffect(() => {
    checkDatabaseConnectivity();
    fetchExistingData();
  }, []);

  // Calculate form completion progress
  useEffect(() => {
    const requiredFields = ['first_name', 'last_name', 'email', 'username', 'password', 'license_number', 'specialization'];
    const completedFields = requiredFields.filter(field => formData[field].trim() !== '');
    const progress = (completedFields.length / requiredFields.length) * 100;
    setFormProgress(progress);
  }, [formData]);

  const checkDatabaseConnectivity = async () => {
    try {
      await doctorAPI.getDoctors({ limit: 1 });
      setDbConnected(true);
    } catch (err) {
      setDbConnected(false);
      console.warn('Database connectivity check failed:', err);
    }
  };

  const fetchExistingData = async () => {
    try {
      const response = await doctorAPI.getDoctors();
      const doctors = response.data.results || response.data || [];
      setExistingData({
        emails: doctors.map(d => d.user?.email).filter(Boolean),
        usernames: doctors.map(d => d.user?.username).filter(Boolean),
        licenses: doctors.map(d => d.license_number).filter(Boolean)
      });
    } catch (err) {
      console.warn('Failed to fetch existing data for validation:', err);
    }
  };

  const validateField = (name, value) => {
    const errors = { ...validationErrors };
    
    switch (name) {
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Please enter a valid email address';
        } else if (existingData.emails.includes(value)) {
          errors.email = 'This email is already registered';
        } else {
          delete errors.email;
        }
        break;
      
      case 'username':
        if (value && value.length < 3) {
          errors.username = 'Username must be at least 3 characters';
        } else if (existingData.usernames.includes(value)) {
          errors.username = 'This username is already taken';
        } else {
          delete errors.username;
        }
        break;
      
      case 'password':
        if (value && value.length < 8) {
          errors.password = 'Password must be at least 8 characters';
        } else if (value && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          errors.password = 'Password must contain uppercase, lowercase, and number';
        } else {
          delete errors.password;
        }
        break;
      
      case 'license_number':
        if (value && existingData.licenses.includes(value)) {
          errors.license_number = 'This license number is already registered';
        } else {
          delete errors.license_number;
        }
        break;
      
      case 'phone_number':
        if (value && !/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[-\s\(\)]/g, ''))) {
          errors.phone_number = 'Please enter a valid phone number';
        } else {
          delete errors.phone_number;
        }
        break;
      
      case 'consultation_fee':
        if (value && (isNaN(value) || value < 0)) {
          errors.consultation_fee = 'Consultation fee must be a positive number';
        } else {
          delete errors.consultation_fee;
        }
        break;
      
      case 'years_experience':
        if (value && (isNaN(value) || value < 0 || value > 50)) {
          errors.years_experience = 'Experience must be between 0 and 50 years';
        } else {
          delete errors.years_experience;
        }
        break;
    }
    
    setValidationErrors(errors);
  };
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Real-time validation
    if (value !== '') {
      validateField(name, newValue);
    } else {
      // Clear validation error when field is empty
      const errors = { ...validationErrors };
      delete errors[name];
      setValidationErrors(errors);
    }
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = {
      first_name: 'First name is required',
      last_name: 'Last name is required', 
      email: 'Email is required',
      username: 'Username is required',
      password: 'Password is required',
      license_number: 'License number is required',
      specialization: 'Specialization is required'
    };

    Object.keys(requiredFields).forEach(field => {
      if (!formData[field] || formData[field].trim() === '') {
        errors[field] = requiredFields[field];
      }
    });

    // Re-validate all fields
    Object.keys(formData).forEach(field => {
      if (formData[field]) {
        validateField(field, formData[field]);
      }
    });

    return Object.keys(errors).length === 0 && Object.keys(validationErrors).length === 0;
  };

  const verifyDatabaseStorage = async (doctorId) => {
    try {
      setIsValidating(true);
      // Wait a moment for database to process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await doctorAPI.getDoctor(doctorId);
      if (response.data) {
        setSuccess('✅ Doctor profile created and verified in database!');
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Database verification failed:', err);
      return false;
    } finally {
      setIsValidating(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please fix the validation errors before submitting');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // First, create the doctor
      const response = await doctorAPI.createDoctor(formData);
      const createdDoctor = response.data;
      
      // Verify the data was stored in database
      const isStoredInDb = await verifyDatabaseStorage(createdDoctor.id);
      
      if (isStoredInDb) {
        // Refresh existing data for future validations
        await fetchExistingData();
        
        setTimeout(() => {
          onSuccess(createdDoctor);
        }, 1500); // Show success message briefly
      } else {
        setError('⚠️ Doctor created but database verification failed. Please check manually.');
      }
    } catch (err) {
      if (err.response?.status === 400) {
        // Handle specific validation errors from backend
        const backendErrors = err.response.data;
        if (typeof backendErrors === 'object') {
          setValidationErrors(prev => ({ ...prev, ...backendErrors }));
          setError('Please fix the validation errors highlighted below');
        } else {
          setError(`Validation error: ${backendErrors.message || 'Invalid data provided'}`);
        }
      } else if (err.response?.status === 409) {
        setError('⚠️ Conflict: Doctor with this email or license number already exists');
      } else if (err.response?.status >= 500) {
        setError('🔧 Server error: Please try again later or contact support');
      } else {
        setError(`❌ Failed to create doctor: ${err.response?.data?.message || err.message}`);
      }
      console.error('Error creating doctor:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
      {/* Database Connectivity Status */}
      <Alert variant={dbConnected === true ? 'success' : dbConnected === false ? 'danger' : 'info'} className="mb-3">
        <div className="d-flex align-items-center">
          {dbConnected === true && (
            <>
              <i className="ri-database-2-line me-2 text-success"></i>
              <strong>Database Connected</strong> - Form data will be saved securely
            </>
          )}
          {dbConnected === false && (
            <>
              <i className="ri-database-2-line me-2 text-danger"></i>
              <strong>Database Connection Failed</strong> - Please check your connection
            </>
          )}
          {dbConnected === null && (
            <>
              <Spinner size="sm" className="me-2" />
              <strong>Checking Database Connection...</strong>
            </>
          )}
        </div>
      </Alert>

      {/* Form Progress */}
      <Card className="mb-3 border-0 shadow-sm">
        <Card.Body className="p-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="fw-semibold">Form Completion</span>
            <span className="text-muted">{Math.round(formProgress)}%</span>
          </div>
          <ProgressBar 
            now={formProgress} 
            variant={formProgress < 50 ? 'danger' : formProgress < 80 ? 'warning' : 'success'}
            animated
          />
          <small className="text-muted mt-1 d-block">
            Complete all required fields to enable submission
          </small>
        </Card.Body>
      </Card>

      {error && (
        <Alert variant="danger" className="mb-3">
          <i className="ri-error-warning-line me-2"></i>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" className="mb-3">
          <i className="ri-check-double-line me-2"></i>
          {success}
        </Alert>
      )}

      {isValidating && (
        <Alert variant="info" className="mb-3">
          <div className="d-flex align-items-center">
            <Spinner size="sm" className="me-2" />
            <strong>Verifying data storage in database...</strong>
          </div>
        </Alert>
      )}
      
      <Form onSubmit={handleSubmit}>
        {/* Personal Information Section */}
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Header className="bg-primary text-white py-2">
            <h6 className="mb-0">
              <i className="ri-user-line me-2"></i>
              Personal Information
            </h6>
          </Card.Header>
          <Card.Body className="p-3">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    <i className="ri-user-line me-1 text-muted"></i>
                    First Name *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    placeholder="Enter first name"
                    className={`form-control-lg ${validationErrors.first_name ? 'is-invalid' : formData.first_name ? 'is-valid' : ''}`}
                    required
                  />
                  {validationErrors.first_name && (
                    <div className="invalid-feedback">
                      <i className="ri-error-warning-line me-1"></i>
                      {validationErrors.first_name}
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    <i className="ri-user-line me-1 text-muted"></i>
                    Last Name *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    placeholder="Enter last name"
                    className={`form-control-lg ${validationErrors.last_name ? 'is-invalid' : formData.last_name ? 'is-valid' : ''}`}
                    required
                  />
                  {validationErrors.last_name && (
                    <div className="invalid-feedback">
                      <i className="ri-error-warning-line me-1"></i>
                      {validationErrors.last_name}
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    <i className="ri-mail-line me-1 text-muted"></i>
                    Email Address *
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="doctor@hospital.com"
                    className={`form-control-lg ${validationErrors.email ? 'is-invalid' : formData.email && !validationErrors.email ? 'is-valid' : ''}`}
                    required
                  />
                  {validationErrors.email && (
                    <div className="invalid-feedback">
                      <i className="ri-error-warning-line me-1"></i>
                      {validationErrors.email}
                    </div>
                  )}
                  {formData.email && !validationErrors.email && (
                    <div className="valid-feedback">
                      <i className="ri-check-line me-1"></i>
                      Email format is valid
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    <i className="ri-phone-line me-1 text-muted"></i>
                    Phone Number
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    className={`form-control-lg ${validationErrors.phone_number ? 'is-invalid' : formData.phone_number && !validationErrors.phone_number ? 'is-valid' : ''}`}
                  />
                  {validationErrors.phone_number && (
                    <div className="invalid-feedback">
                      <i className="ri-error-warning-line me-1"></i>
                      {validationErrors.phone_number}
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Account Information Section */}
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Header className="bg-info text-white py-2">
            <h6 className="mb-0">
              <i className="ri-shield-user-line me-2"></i>
              Account Information
            </h6>
          </Card.Header>
          <Card.Body className="p-3">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    <i className="ri-at-line me-1 text-muted"></i>
                    Username *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter username"
                    className={`form-control-lg ${validationErrors.username ? 'is-invalid' : formData.username && !validationErrors.username ? 'is-valid' : ''}`}
                    required
                  />
                  {validationErrors.username && (
                    <div className="invalid-feedback">
                      <i className="ri-error-warning-line me-1"></i>
                      {validationErrors.username}
                    </div>
                  )}
                  {formData.username && !validationErrors.username && formData.username.length >= 3 && (
                    <div className="valid-feedback">
                      <i className="ri-check-line me-1"></i>
                      Username is available
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    <i className="ri-lock-line me-1 text-muted"></i>
                    Password *
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create secure password"
                    className={`form-control-lg ${validationErrors.password ? 'is-invalid' : formData.password && !validationErrors.password ? 'is-valid' : ''}`}
                    required
                  />
                  {validationErrors.password && (
                    <div className="invalid-feedback">
                      <i className="ri-error-warning-line me-1"></i>
                      {validationErrors.password}
                    </div>
                  )}
                  {formData.password && !validationErrors.password && (
                    <div className="valid-feedback">
                      <i className="ri-shield-check-line me-1"></i>
                      Strong password
                    </div>
                  )}
                  <small className="text-muted">
                    Must be 8+ characters with uppercase, lowercase, and number
                  </small>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Professional Information Section */}
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Header className="bg-success text-white py-2">
            <h6 className="mb-0">
              <i className="ri-hospital-line me-2"></i>
              Professional Information
            </h6>
          </Card.Header>
          <Card.Body className="p-3">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    <i className="ri-file-text-line me-1 text-muted"></i>
                    Medical License Number *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="license_number"
                    value={formData.license_number}
                    onChange={handleInputChange}
                    placeholder="Enter license number"
                    className={`form-control-lg ${validationErrors.license_number ? 'is-invalid' : formData.license_number && !validationErrors.license_number ? 'is-valid' : ''}`}
                    required
                  />
                  {validationErrors.license_number && (
                    <div className="invalid-feedback">
                      <i className="ri-error-warning-line me-1"></i>
                      {validationErrors.license_number}
                    </div>
                  )}
                  {formData.license_number && !validationErrors.license_number && (
                    <div className="valid-feedback">
                      <i className="ri-check-line me-1"></i>
                      License number is unique
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    <i className="ri-heart-pulse-line me-1 text-muted"></i>
                    Medical Specialization *
                  </Form.Label>
                  <Form.Select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    className={`form-control-lg ${validationErrors.specialization ? 'is-invalid' : formData.specialization ? 'is-valid' : ''}`}
                    required
                  >
                    <option value="">Select Specialization</option>
                    <option value="cardiology">🫀 Cardiology</option>
                    <option value="neurology">🧠 Neurology</option>
                    <option value="oncology">🎗️ Oncology</option>
                    <option value="pediatrics">👶 Pediatrics</option>
                    <option value="surgery">⚕️ Surgery</option>
                    <option value="dermatology">🧴 Dermatology</option>
                    <option value="psychiatry">🧘 Psychiatry</option>
                    <option value="radiology">📡 Radiology</option>
                    <option value="anesthesiology">💉 Anesthesiology</option>
                    <option value="emergency_medicine">🚨 Emergency Medicine</option>
                    <option value="internal_medicine">🔬 Internal Medicine</option>
                    <option value="family_medicine">👨‍👩‍👧‍👦 Family Medicine</option>
                    <option value="orthopedics">🦴 Orthopedics</option>
                    <option value="gynecology">👩‍⚕️ Gynecology</option>
                    <option value="urology">🫘 Urology</option>
                  </Form.Select>
                  {validationErrors.specialization && (
                    <div className="invalid-feedback">
                      <i className="ri-error-warning-line me-1"></i>
                      {validationErrors.specialization}
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    <i className="ri-time-line me-1 text-muted"></i>
                    Years of Experience
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="years_experience"
                    value={formData.years_experience}
                    onChange={handleInputChange}
                    min="0"
                    max="50"
                    placeholder="0"
                    className={`form-control-lg ${validationErrors.years_experience ? 'is-invalid' : ''}`}
                  />
                  {validationErrors.years_experience && (
                    <div className="invalid-feedback">
                      <i className="ri-error-warning-line me-1"></i>
                      {validationErrors.years_experience}
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    <i className="ri-money-dollar-circle-line me-1 text-muted"></i>
                    Consultation Fee ($)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="consultation_fee"
                    value={formData.consultation_fee}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className={`form-control-lg ${validationErrors.consultation_fee ? 'is-invalid' : ''}`}
                  />
                  {validationErrors.consultation_fee && (
                    <div className="invalid-feedback">
                      <i className="ri-error-warning-line me-1"></i>
                      {validationErrors.consultation_fee}
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                <i className="ri-graduation-cap-line me-1 text-muted"></i>
                Medical Qualification
              </Form.Label>
              <Form.Control
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleInputChange}
                placeholder="e.g., MBBS, MD, MS, Fellowship details"
                className="form-control-lg"
              />
            </Form.Group>
          </Card.Body>
        </Card>

        {/* Additional Information Section */}
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Header className="bg-warning text-dark py-2">
            <h6 className="mb-0">
              <i className="ri-information-line me-2"></i>
              Additional Information
            </h6>
          </Card.Header>
          <Card.Body className="p-3">
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                <i className="ri-school-line me-1 text-muted"></i>
                Educational Background
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                placeholder="Medical school, residency, fellowship programs and institutions"
                className="form-control-lg"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                <i className="ri-award-line me-1 text-muted"></i>
                Professional Certifications
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="certifications"
                value={formData.certifications}
                onChange={handleInputChange}
                placeholder="Board certifications, professional licenses, and specialized training"
                className="form-control-lg"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                <i className="ri-building-line me-1 text-muted"></i>
                Hospital/Clinic Affiliation
              </Form.Label>
              <Form.Control
                type="text"
                name="hospital_affiliation"
                value={formData.hospital_affiliation}
                onChange={handleInputChange}
                placeholder="Primary hospital, clinic, or healthcare institution"
                className="form-control-lg"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                <i className="ri-user-heart-line me-1 text-muted"></i>
                Professional Biography
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Brief professional biography, areas of expertise, and notable achievements"
                className="form-control-lg"
              />
            </Form.Group>
            
            <div className="bg-light p-3 rounded">
              <Form.Group className="mb-0">
                <Form.Check
                  type="checkbox"
                  name="is_available_emergency"
                  checked={formData.is_available_emergency}
                  onChange={handleInputChange}
                  label={
                    <span className="fw-semibold">
                      <i className="ri-first-aid-kit-line me-2 text-danger"></i>
                      Available for Emergency Calls
                      <small className="d-block text-muted mt-1">
                        Check this if the doctor is available for emergency consultations outside regular hours
                      </small>
                    </span>
                  }
                  className="user-select-none"
                />
              </Form.Group>
            </div>
          </Card.Body>
        </Card>
        
        {/* Action Buttons */}
        <div className="d-flex justify-content-between align-items-center pt-3 border-top">
          <div className="text-muted small">
            {Object.keys(validationErrors).length > 0 && (
              <Badge variant="danger" className="me-2">
                <i className="ri-error-warning-line me-1"></i>
                {Object.keys(validationErrors).length} validation error(s)
              </Badge>
            )}
            {formProgress === 100 && Object.keys(validationErrors).length === 0 && (
              <Badge variant="success">
                <i className="ri-check-double-line me-1"></i>
                Form ready for submission
              </Badge>
            )}
          </div>
          
          <div className="d-flex gap-2">
            <Button 
              variant="outline-secondary" 
              onClick={onCancel} 
              disabled={loading || isValidating}
              className="px-4 py-2"
            >
              <i className="ri-close-line me-1"></i>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={loading || isValidating || formProgress < 100 || Object.keys(validationErrors).length > 0 || !dbConnected}
              className="px-4 py-2"
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Creating Doctor...
                </>
              ) : isValidating ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Verifying...
                </>
              ) : (
                <>
                  <i className="ri-user-add-line me-1"></i>
                  Create & Verify in Database
                </>
              )}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default AddDoctorForm;
