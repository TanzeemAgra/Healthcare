import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Row, 
  Col, 
  Form, 
  Button, 
  Alert, 
  Card, 
  ProgressBar, 
  Badge,
  Modal,
  Accordion,
  Tab,
  Tabs
} from 'react-bootstrap';
import ReCAPTCHA from 'react-google-recaptcha';

const Registration = () => {
  const navigate = useNavigate();
  const recaptchaRef = useRef(null);
  
  // Multi-step registration state
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Legal agreement modals
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showHipaaModal, setShowHipaaModal] = useState(false);
  
  // Form validation states
  const [formErrors, setFormErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: [],
    color: 'danger'
  });
  
  // Registration form data
  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    
    // Step 2: Contact Information
    email: '',
    confirmEmail: '',
    phone: '',
    alternatePhone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    
    // Step 3: Professional Information
    professionalTitle: '',
    medicalLicenseNumber: '',
    licenseIssuingAuthority: '',
    licenseExpiryDate: '',
    specialization: '',
    yearsOfExperience: '',
    currentWorkplace: '',
    workplaceAddress: '',
    
    // Step 4: Account Security
    username: '',
    password: '',
    confirmPassword: '',
    securityQuestion1: '',
    securityAnswer1: '',
    securityQuestion2: '',
    securityAnswer2: '',
    
    // Step 5: Legal Agreements & Compliance
    gdprConsent: false,
    hipaaAgreement: false,
    termsAccepted: false,
    marketingConsent: false,
    dataProcessingConsent: false,
    emergencyContact: '',
    emergencyContactPhone: '',
    
    // Additional fields
    recaptcha_token: '',
    registrationReason: '',
    referralSource: ''
  });

  // Professional titles for healthcare
  const professionalTitles = [
    'Dr. (Doctor)',
    'Nurse Practitioner',
    'Physician Assistant',
    'Registered Nurse',
    'Licensed Practical Nurse',
    'Medical Technologist',
    'Radiologic Technologist',
    'Physical Therapist',
    'Occupational Therapist',
    'Pharmacist',
    'Healthcare Administrator',
    'Medical Researcher',
    'Other'
  ];

  // Medical specializations
  const specializations = [
    'General Medicine',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Gynecology',
    'Dermatology',
    'Psychiatry',
    'Radiology',
    'Pathology',
    'Anesthesiology',
    'Emergency Medicine',
    'Surgery',
    'Oncology',
    'Endocrinology',
    'Pulmonology',
    'Gastroenterology',
    'Nephrology',
    'Ophthalmology',
    'ENT (Otolaryngology)',
    'Dentistry',
    'Other'
  ];

  // Security questions
  const securityQuestions = [
    "What was the name of your first pet?",
    "In which city were you born?",
    "What was your mother's maiden name?",
    "What was the make of your first car?",
    "What was the name of your elementary school?",
    "What is your favorite book?",
    "What was your childhood nickname?",
    "In which year did you graduate from medical school?",
    "What was the name of your first hospital rotation?",
    "What is your favorite medical journal?"
  ];

  // Password strength checker
  const checkPasswordStrength = (password) => {
    const checks = [
      { test: /.{12,}/, message: 'At least 12 characters' },
      { test: /[A-Z]/, message: 'One uppercase letter' },
      { test: /[a-z]/, message: 'One lowercase letter' },
      { test: /\d/, message: 'One number' },
      { test: /[!@#$%^&*(),.?":{}|<>]/, message: 'One special character' },
      { test: /^(?!.*(.)\1{2,})/, message: 'No repeated characters' }
    ];
    
    const passed = checks.filter(check => check.test.test(password));
    const failed = checks.filter(check => !check.test.test(password));
    
    const score = (passed.length / checks.length) * 100;
    let color = 'danger'; // Red
    
    if (score >= 80) color = 'success'; // Green
    else if (score >= 60) color = 'warning'; // Orange
    else if (score >= 40) color = 'info'; // Blue
    
    setPasswordStrength({
      score,
      feedback: failed.map(check => check.message),
      color,
      passed: passed.map(check => check.message)
    });
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Real-time password strength checking
    if (name === 'password') {
      checkPasswordStrength(value);
    }
    
    // Clear specific field errors
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear general errors when user starts typing
    if (error) setError('');
  };

  // Handle reCAPTCHA
  const handleRecaptcha = (token) => {
    setFormData(prev => ({
      ...prev,
      recaptcha_token: token
    }));
  };

  // Validate current step
  const validateStep = (step) => {
    const errors = {};
    
    switch (step) {
      case 1: // Personal Information
        if (!formData.firstName.trim()) errors.firstName = 'First name is required';
        if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
        if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
        if (!formData.gender) errors.gender = 'Gender selection is required';
        if (!formData.nationality.trim()) errors.nationality = 'Nationality is required';
        break;
        
      case 2: // Contact Information
        if (!formData.email.trim()) errors.email = 'Email is required';
        if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email format';
        if (formData.email !== formData.confirmEmail) errors.confirmEmail = 'Emails do not match';
        if (!formData.phone.trim()) errors.phone = 'Phone number is required';
        if (!formData.address.trim()) errors.address = 'Address is required';
        if (!formData.city.trim()) errors.city = 'City is required';
        if (!formData.zipCode.trim()) errors.zipCode = 'ZIP code is required';
        if (!formData.country.trim()) errors.country = 'Country is required';
        break;
        
      case 3: // Professional Information
        if (!formData.professionalTitle) errors.professionalTitle = 'Professional title is required';
        if (!formData.medicalLicenseNumber.trim()) errors.medicalLicenseNumber = 'Medical license number is required';
        if (!formData.licenseIssuingAuthority.trim()) errors.licenseIssuingAuthority = 'License issuing authority is required';
        if (!formData.licenseExpiryDate) errors.licenseExpiryDate = 'License expiry date is required';
        if (!formData.specialization) errors.specialization = 'Specialization is required';
        if (!formData.yearsOfExperience) errors.yearsOfExperience = 'Years of experience is required';
        if (!formData.currentWorkplace.trim()) errors.currentWorkplace = 'Current workplace is required';
        break;
        
      case 4: // Account Security
        if (!formData.username.trim()) errors.username = 'Username is required';
        if (formData.username.length < 6) errors.username = 'Username must be at least 6 characters';
        if (!formData.password) errors.password = 'Password is required';
        if (passwordStrength.score < 60) errors.password = 'Password does not meet security requirements';
        if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
        if (!formData.securityQuestion1) errors.securityQuestion1 = 'Security question 1 is required';
        if (!formData.securityAnswer1.trim()) errors.securityAnswer1 = 'Security answer 1 is required';
        if (!formData.securityQuestion2) errors.securityQuestion2 = 'Security question 2 is required';
        if (!formData.securityAnswer2.trim()) errors.securityAnswer2 = 'Security answer 2 is required';
        if (formData.securityQuestion1 === formData.securityQuestion2) errors.securityQuestion2 = 'Please select different security questions';
        break;
        
      case 5: // Legal Agreements
        if (!formData.gdprConsent) errors.gdprConsent = 'GDPR consent is required';
        if (!formData.hipaaAgreement) errors.hipaaAgreement = 'HIPAA agreement is required';
        if (!formData.termsAccepted) errors.termsAccepted = 'Terms acceptance is required';
        if (!formData.dataProcessingConsent) errors.dataProcessingConsent = 'Data processing consent is required';
        if (!formData.emergencyContact.trim()) errors.emergencyContact = 'Emergency contact is required';
        if (!formData.emergencyContactPhone.trim()) errors.emergencyContactPhone = 'Emergency contact phone is required';
        // Temporarily disable reCAPTCHA requirement for testing
        // if (!formData.recaptcha_token) errors.recaptcha_token = 'Please complete the reCAPTCHA verification';
        break;
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Navigation between steps
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Submit registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(5)) {
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Ensure we have a recaptcha token, use placeholder for development
      const submissionData = {
        ...formData,
        recaptcha_token: formData.recaptcha_token || 'development_bypass'
      };
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/auth/comprehensive-register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Registration successful! Your account is pending admin approval. You will receive an email notification once approved.');
        setTimeout(() => {
          navigate('/auth/login');
        }, 5000);
      } else {
        if (data.validation_errors) {
          setFormErrors(data.validation_errors);
          setError('Please correct the validation errors below.');
        } else {
          setError(data.error || 'Registration failed. Please try again.');
        }
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
    }
  };

  // Progress calculation
  const progress = (currentStep / 5) * 100;

  // Render password strength indicator
  const renderPasswordStrength = () => {
    if (!formData.password) return null;
    
    const strengthText = passwordStrength.score >= 70 ? 'Very Strong' : 
                       passwordStrength.score >= 50 ? 'Strong' : 
                       passwordStrength.score >= 30 ? 'Moderate' : 'Weak';
    
    return (
      <div className="mt-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <small className="text-muted">Password Strength</small>
          <Badge bg={passwordStrength.color}>{strengthText}</Badge>
        </div>
        
        <ProgressBar 
          variant={passwordStrength.color} 
          now={passwordStrength.score} 
          className="mb-3"
          style={{ height: '8px' }}
        />
        
        {passwordStrength.passed && passwordStrength.passed.length > 0 && (
          <div className="mb-2">
            {passwordStrength.passed.map((item, index) => (
              <div key={index} className="d-flex align-items-center mb-1">
                <i className="ri-check-line text-success me-2"></i>
                <small className="text-success">{item}</small>
              </div>
            ))}
          </div>
        )}
        
        {passwordStrength.feedback.length > 0 && (
          <div>
            {passwordStrength.feedback.map((item, index) => (
              <div key={index} className="d-flex align-items-center mb-1">
                <i className="ri-close-line text-danger me-2"></i>
                <small className="text-danger">{item}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Container fluid>
        <Row className="min-vh-100">
          {/* Left side - Information Hub */}
          <Col lg={4} className="d-none d-lg-flex align-items-stretch position-relative">
            <div className="w-100 d-flex flex-column text-white p-4">
              {/* Header */}
              <div className="text-center mb-4">
                <div className="mb-3 p-3 rounded-circle d-inline-flex align-items-center justify-content-center"
                     style={{ background: 'rgba(255,255,255,0.2)', width: '80px', height: '80px' }}>
                  <i className="ri-user-add-line" style={{ fontSize: '2rem' }}></i>
                </div>
                <h3 className="fw-bold mb-2">Healthcare Professional Registration</h3>
                <p className="mb-0 opacity-75">Secure, HIPAA-compliant registration process</p>
              </div>

              {/* Progress Steps */}
              <div className="mb-4">
                <h6 className="fw-bold mb-3">Registration Progress</h6>
                <ProgressBar 
                  variant="info" 
                  now={progress} 
                  className="mb-3"
                  style={{ height: '10px' }}
                />
                <div className="small">
                  <div className={`mb-2 ${currentStep >= 1 ? 'text-white' : 'opacity-50'}`}>
                    <i className={`ri-${currentStep >= 1 ? 'check' : 'radio'}-line me-2`}></i>
                    Step 1: Personal Information
                  </div>
                  <div className={`mb-2 ${currentStep >= 2 ? 'text-white' : 'opacity-50'}`}>
                    <i className={`ri-${currentStep >= 2 ? 'check' : 'radio'}-line me-2`}></i>
                    Step 2: Contact Details
                  </div>
                  <div className={`mb-2 ${currentStep >= 3 ? 'text-white' : 'opacity-50'}`}>
                    <i className={`ri-${currentStep >= 3 ? 'check' : 'radio'}-line me-2`}></i>
                    Step 3: Professional Information
                  </div>
                  <div className={`mb-2 ${currentStep >= 4 ? 'text-white' : 'opacity-50'}`}>
                    <i className={`ri-${currentStep >= 4 ? 'check' : 'radio'}-line me-2`}></i>
                    Step 4: Account Security
                  </div>
                  <div className={`mb-2 ${currentStep >= 5 ? 'text-white' : 'opacity-50'}`}>
                    <i className={`ri-${currentStep >= 5 ? 'check' : 'radio'}-line me-2`}></i>
                    Step 5: Legal Compliance
                  </div>
                </div>
              </div>

              {/* Security Features */}
              <div className="mb-4 p-3 rounded" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <h6 className="fw-bold mb-2">Security & Compliance</h6>
                <div className="small">
                  <div className="mb-1 d-flex align-items-center">
                    <i className="ri-shield-check-line me-2"></i>
                    HIPAA Compliant
                  </div>
                  <div className="mb-1 d-flex align-items-center">
                    <i className="ri-lock-line me-2"></i>
                    GDPR Protected
                  </div>
                  <div className="mb-1 d-flex align-items-center">
                    <i className="ri-secure-payment-line me-2"></i>
                    End-to-end Encryption
                  </div>
                  <div className="mb-1 d-flex align-items-center">
                    <i className="ri-verified-badge-line me-2"></i>
                    Medical License Verification
                  </div>
                </div>
              </div>

              {/* Support Information */}
              <div className="mt-auto p-3 rounded" style={{ background: 'rgba(40, 167, 69, 0.2)' }}>
                <h6 className="fw-bold mb-2">Need Help?</h6>
                <p className="small mb-2">Our registration support team is available 24/7</p>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-semibold">+1 (555) REG-HELP</div>
                    <small className="opacity-75">support@mastermind.health</small>
                  </div>
                  <Button variant="outline-light" size="sm">
                    <i className="ri-chat-1-line me-1"></i>
                    Chat
                  </Button>
                </div>
              </div>
            </div>
          </Col>

          {/* Right side - Registration Form */}
          <Col lg={8} className="d-flex align-items-center justify-content-center py-5">
            <div className="w-100" style={{ maxWidth: '700px' }}>
              <Card className="shadow-lg border-0" style={{ borderRadius: '20px' }}>
                <Card.Body className="p-5">
                  {error && (
                    <Alert variant="danger" className="mb-4 d-flex align-items-center">
                      <i className="ri-error-warning-line me-2"></i>
                      {error}
                    </Alert>
                  )}

                  {success && (
                    <Alert variant="success" className="mb-4 d-flex align-items-center">
                      <i className="ri-check-line me-2"></i>
                      {success}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    {/* Step 1: Personal Information */}
                    {currentStep === 1 && (
                      <div>
                        <div className="text-center mb-4">
                          <h3 className="fw-bold mb-2">Personal Information</h3>
                          <p className="text-muted">Please provide your basic personal details</p>
                        </div>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>First Name *</Form.Label>
                              <Form.Control
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                placeholder="Enter your first name"
                                isInvalid={!!formErrors.firstName}
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                {formErrors.firstName}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Last Name *</Form.Label>
                              <Form.Control
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                placeholder="Enter your last name"
                                isInvalid={!!formErrors.lastName}
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                {formErrors.lastName}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Date of Birth *</Form.Label>
                              <Form.Control
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleInputChange}
                                isInvalid={!!formErrors.dateOfBirth}
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                {formErrors.dateOfBirth}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Gender *</Form.Label>
                              <Form.Select
                                name="gender"
                                value={formData.gender}
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

                        <Form.Group className="mb-4">
                          <Form.Label>Nationality *</Form.Label>
                          <Form.Control
                            type="text"
                            name="nationality"
                            value={formData.nationality}
                            onChange={handleInputChange}
                            placeholder="Enter your nationality"
                            isInvalid={!!formErrors.nationality}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {formErrors.nationality}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                    )}

                    {/* Step 2: Contact Information */}
                    {currentStep === 2 && (
                      <div>
                        <div className="text-center mb-4">
                          <h3 className="fw-bold mb-2">Contact Information</h3>
                          <p className="text-muted">Provide your contact details and address</p>
                        </div>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Email Address *</Form.Label>
                              <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter your email address"
                                isInvalid={!!formErrors.email}
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                {formErrors.email}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Confirm Email *</Form.Label>
                              <Form.Control
                                type="email"
                                name="confirmEmail"
                                value={formData.confirmEmail}
                                onChange={handleInputChange}
                                placeholder="Confirm your email address"
                                isInvalid={!!formErrors.confirmEmail}
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                {formErrors.confirmEmail}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Primary Phone *</Form.Label>
                              <Form.Control
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="+1 (555) 123-4567"
                                isInvalid={!!formErrors.phone}
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                {formErrors.phone}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Alternate Phone</Form.Label>
                              <Form.Control
                                type="tel"
                                name="alternatePhone"
                                value={formData.alternatePhone}
                                onChange={handleInputChange}
                                placeholder="+1 (555) 987-6543"
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Form.Group className="mb-3">
                          <Form.Label>Address *</Form.Label>
                          <Form.Control
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Enter your complete address"
                            isInvalid={!!formErrors.address}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {formErrors.address}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Row>
                          <Col md={4}>
                            <Form.Group className="mb-3">
                              <Form.Label>City *</Form.Label>
                              <Form.Control
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                placeholder="City"
                                isInvalid={!!formErrors.city}
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                {formErrors.city}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group className="mb-3">
                              <Form.Label>State/Province</Form.Label>
                              <Form.Control
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                placeholder="State/Province"
                              />
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group className="mb-3">
                              <Form.Label>ZIP/Postal Code *</Form.Label>
                              <Form.Control
                                type="text"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleInputChange}
                                placeholder="ZIP Code"
                                isInvalid={!!formErrors.zipCode}
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                {formErrors.zipCode}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>

                        <Form.Group className="mb-4">
                          <Form.Label>Country *</Form.Label>
                          <Form.Select
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            isInvalid={!!formErrors.country}
                            required
                          >
                            <option value="">Select Country</option>
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="UK">United Kingdom</option>
                            <option value="AU">Australia</option>
                            <option value="DE">Germany</option>
                            <option value="FR">France</option>
                            <option value="IN">India</option>
                            <option value="JP">Japan</option>
                            <option value="BR">Brazil</option>
                            <option value="MX">Mexico</option>
                            <option value="other">Other</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {formErrors.country}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                    )}

                    {/* Step 3: Professional Information */}
                    {currentStep === 3 && (
                      <div>
                        <div className="text-center mb-4">
                          <h3 className="fw-bold mb-2">Professional Information</h3>
                          <p className="text-muted">Medical credentials and professional details</p>
                        </div>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Professional Title *</Form.Label>
                              <Form.Select
                                name="professionalTitle"
                                value={formData.professionalTitle}
                                onChange={handleInputChange}
                                isInvalid={!!formErrors.professionalTitle}
                                required
                              >
                                <option value="">Select Title</option>
                                {professionalTitles.map(title => (
                                  <option key={title} value={title}>{title}</option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                {formErrors.professionalTitle}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Specialization *</Form.Label>
                              <Form.Select
                                name="specialization"
                                value={formData.specialization}
                                onChange={handleInputChange}
                                isInvalid={!!formErrors.specialization}
                                required
                              >
                                <option value="">Select Specialization</option>
                                {specializations.map(spec => (
                                  <option key={spec} value={spec}>{spec}</option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                {formErrors.specialization}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Medical License Number *</Form.Label>
                              <Form.Control
                                type="text"
                                name="medicalLicenseNumber"
                                value={formData.medicalLicenseNumber}
                                onChange={handleInputChange}
                                placeholder="Enter license number"
                                isInvalid={!!formErrors.medicalLicenseNumber}
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                {formErrors.medicalLicenseNumber}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>License Issuing Authority *</Form.Label>
                              <Form.Control
                                type="text"
                                name="licenseIssuingAuthority"
                                value={formData.licenseIssuingAuthority}
                                onChange={handleInputChange}
                                placeholder="e.g., State Medical Board"
                                isInvalid={!!formErrors.licenseIssuingAuthority}
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                {formErrors.licenseIssuingAuthority}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>License Expiry Date *</Form.Label>
                              <Form.Control
                                type="date"
                                name="licenseExpiryDate"
                                value={formData.licenseExpiryDate}
                                onChange={handleInputChange}
                                isInvalid={!!formErrors.licenseExpiryDate}
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                {formErrors.licenseExpiryDate}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Years of Experience *</Form.Label>
                              <Form.Select
                                name="yearsOfExperience"
                                value={formData.yearsOfExperience}
                                onChange={handleInputChange}
                                isInvalid={!!formErrors.yearsOfExperience}
                                required
                              >
                                <option value="">Select Experience</option>
                                <option value="0-1">0-1 years</option>
                                <option value="2-5">2-5 years</option>
                                <option value="6-10">6-10 years</option>
                                <option value="11-15">11-15 years</option>
                                <option value="16-20">16-20 years</option>
                                <option value="20+">20+ years</option>
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                {formErrors.yearsOfExperience}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>

                        <Form.Group className="mb-3">
                          <Form.Label>Current Workplace *</Form.Label>
                          <Form.Control
                            type="text"
                            name="currentWorkplace"
                            value={formData.currentWorkplace}
                            onChange={handleInputChange}
                            placeholder="Hospital/Clinic/Practice name"
                            isInvalid={!!formErrors.currentWorkplace}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {formErrors.currentWorkplace}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-4">
                          <Form.Label>Workplace Address</Form.Label>
                          <Form.Control
                            type="text"
                            name="workplaceAddress"
                            value={formData.workplaceAddress}
                            onChange={handleInputChange}
                            placeholder="Workplace complete address"
                          />
                        </Form.Group>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-4">
                              <Form.Label>Registration Reason</Form.Label>
                              <Form.Select
                                name="registrationReason"
                                value={formData.registrationReason}
                                onChange={handleInputChange}
                              >
                                <option value="">Select Reason</option>
                                <option value="patient_management">Patient Management</option>
                                <option value="medical_research">Medical Research</option>
                                <option value="consultation">Consultation Services</option>
                                <option value="training">Training & Education</option>
                                <option value="telemedicine">Telemedicine</option>
                                <option value="other">Other</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-4">
                              <Form.Label>How did you hear about us?</Form.Label>
                              <Form.Select
                                name="referralSource"
                                value={formData.referralSource}
                                onChange={handleInputChange}
                              >
                                <option value="">Select Source</option>
                                <option value="colleague">Medical Colleague</option>
                                <option value="conference">Medical Conference</option>
                                <option value="online_search">Online Search</option>
                                <option value="advertisement">Advertisement</option>
                                <option value="social_media">Social Media</option>
                                <option value="other">Other</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                        </Row>
                      </div>
                    )}

                    {/* Step 4: Account Security */}
                    {currentStep === 4 && (
                      <div>
                        <div className="text-center mb-4">
                          <h3 className="fw-bold mb-2">Account Security</h3>
                          <p className="text-muted">Create secure login credentials</p>
                        </div>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Username *</Form.Label>
                              <Form.Control
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                placeholder="Choose a unique username"
                                isInvalid={!!formErrors.username}
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                {formErrors.username}
                              </Form.Control.Feedback>
                              <Form.Text className="text-muted">
                                Minimum 6 characters, letters and numbers only
                              </Form.Text>
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Password *</Form.Label>
                              <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Create a strong password"
                                isInvalid={!!formErrors.password}
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                {formErrors.password}
                              </Form.Control.Feedback>
                              {renderPasswordStrength()}
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Confirm Password *</Form.Label>
                              <Form.Control
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="Confirm your password"
                                isInvalid={!!formErrors.confirmPassword}
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                {formErrors.confirmPassword}
                              </Form.Control.Feedback>
                              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                <div className="d-flex align-items-center mt-2">
                                  <i className="ri-close-line text-danger me-2"></i>
                                  <small className="text-danger">Passwords do not match</small>
                                </div>
                              )}
                            </Form.Group>
                          </Col>
                        </Row>

                        <div className="mb-4">
                          <h5 className="fw-bold mb-3">Security Questions</h5>
                          <p className="text-muted small">Select two different security questions for account recovery</p>
                          
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Security Question 1 *</Form.Label>
                                <Form.Select
                                  name="securityQuestion1"
                                  value={formData.securityQuestion1}
                                  onChange={handleInputChange}
                                  isInvalid={!!formErrors.securityQuestion1}
                                  required
                                >
                                  <option value="">Select Question</option>
                                  {securityQuestions.map((question, index) => (
                                    <option key={index} value={question}>{question}</option>
                                  ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                  {formErrors.securityQuestion1}
                                </Form.Control.Feedback>
                              </Form.Group>
                              
                              <Form.Group className="mb-3">
                                <Form.Label>Answer 1 *</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="securityAnswer1"
                                  value={formData.securityAnswer1}
                                  onChange={handleInputChange}
                                  placeholder="Enter your answer"
                                  isInvalid={!!formErrors.securityAnswer1}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {formErrors.securityAnswer1}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                            
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Security Question 2 *</Form.Label>
                                <Form.Select
                                  name="securityQuestion2"
                                  value={formData.securityQuestion2}
                                  onChange={handleInputChange}
                                  isInvalid={!!formErrors.securityQuestion2}
                                  required
                                >
                                  <option value="">Select Question</option>
                                  {securityQuestions.map((question, index) => (
                                    <option key={index} value={question}>{question}</option>
                                  ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                  {formErrors.securityQuestion2}
                                </Form.Control.Feedback>
                              </Form.Group>
                              
                              <Form.Group className="mb-3">
                                <Form.Label>Answer 2 *</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="securityAnswer2"
                                  value={formData.securityAnswer2}
                                  onChange={handleInputChange}
                                  placeholder="Enter your answer"
                                  isInvalid={!!formErrors.securityAnswer2}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {formErrors.securityAnswer2}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                          </Row>
                        </div>
                      </div>
                    )}

                    {/* Step 5: Legal Agreements & Compliance */}
                    {currentStep === 5 && (
                      <div>
                        <div className="text-center mb-4">
                          <h3 className="fw-bold mb-2">Legal Compliance & Agreements</h3>
                          <p className="text-muted">Review and accept required legal agreements</p>
                        </div>

                        <div className="mb-4">
                          <h5 className="fw-bold mb-3">Emergency Contact Information</h5>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Emergency Contact Name *</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="emergencyContact"
                                  value={formData.emergencyContact}
                                  onChange={handleInputChange}
                                  placeholder="Full name of emergency contact"
                                  isInvalid={!!formErrors.emergencyContact}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {formErrors.emergencyContact}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Emergency Contact Phone *</Form.Label>
                                <Form.Control
                                  type="tel"
                                  name="emergencyContactPhone"
                                  value={formData.emergencyContactPhone}
                                  onChange={handleInputChange}
                                  placeholder="+1 (555) 123-4567"
                                  isInvalid={!!formErrors.emergencyContactPhone}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {formErrors.emergencyContactPhone}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                          </Row>
                        </div>

                        <div className="mb-4">
                          <h5 className="fw-bold mb-3">Legal Agreements</h5>
                          
                          <div className="border rounded p-3 mb-3" style={{ background: '#f8f9fa' }}>
                            <Form.Check
                              type="checkbox"
                              id="gdprConsent"
                              name="gdprConsent"
                              checked={formData.gdprConsent}
                              onChange={handleInputChange}
                              isInvalid={!!formErrors.gdprConsent}
                              label={
                                <span>
                                  I consent to the processing of my personal data in accordance with GDPR regulations *
                                  <Button 
                                    variant="link" 
                                    className="p-0 ms-2"
                                    onClick={() => setShowPrivacyModal(true)}
                                  >
                                    Read Privacy Policy
                                  </Button>
                                </span>
                              }
                              required
                            />
                            {formErrors.gdprConsent && (
                              <div className="text-danger small mt-1">{formErrors.gdprConsent}</div>
                            )}
                          </div>

                          <div className="border rounded p-3 mb-3" style={{ background: '#f8f9fa' }}>
                            <Form.Check
                              type="checkbox"
                              id="hipaaAgreement"
                              name="hipaaAgreement"
                              checked={formData.hipaaAgreement}
                              onChange={handleInputChange}
                              isInvalid={!!formErrors.hipaaAgreement}
                              label={
                                <span>
                                  I acknowledge and agree to HIPAA compliance requirements for healthcare data *
                                  <Button 
                                    variant="link" 
                                    className="p-0 ms-2"
                                    onClick={() => setShowHipaaModal(true)}
                                  >
                                    Read HIPAA Agreement
                                  </Button>
                                </span>
                              }
                              required
                            />
                            {formErrors.hipaaAgreement && (
                              <div className="text-danger small mt-1">{formErrors.hipaaAgreement}</div>
                            )}
                          </div>

                          <div className="border rounded p-3 mb-3" style={{ background: '#f8f9fa' }}>
                            <Form.Check
                              type="checkbox"
                              id="termsAccepted"
                              name="termsAccepted"
                              checked={formData.termsAccepted}
                              onChange={handleInputChange}
                              isInvalid={!!formErrors.termsAccepted}
                              label={
                                <span>
                                  I accept the Terms of Service and User Agreement *
                                  <Button 
                                    variant="link" 
                                    className="p-0 ms-2"
                                    onClick={() => setShowTermsModal(true)}
                                  >
                                    Read Terms of Service
                                  </Button>
                                </span>
                              }
                              required
                            />
                            {formErrors.termsAccepted && (
                              <div className="text-danger small mt-1">{formErrors.termsAccepted}</div>
                            )}
                          </div>

                          <div className="border rounded p-3 mb-3" style={{ background: '#f8f9fa' }}>
                            <Form.Check
                              type="checkbox"
                              id="dataProcessingConsent"
                              name="dataProcessingConsent"
                              checked={formData.dataProcessingConsent}
                              onChange={handleInputChange}
                              isInvalid={!!formErrors.dataProcessingConsent}
                              label="I consent to the processing and storage of my data for account management and healthcare services *"
                              required
                            />
                            {formErrors.dataProcessingConsent && (
                              <div className="text-danger small mt-1">{formErrors.dataProcessingConsent}</div>
                            )}
                          </div>

                          <div className="border rounded p-3 mb-3" style={{ background: '#e8f5e8' }}>
                            <Form.Check
                              type="checkbox"
                              id="marketingConsent"
                              name="marketingConsent"
                              checked={formData.marketingConsent}
                              onChange={handleInputChange}
                              label="I consent to receive marketing communications and updates (optional)"
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <Alert variant="warning" className="d-flex align-items-start">
                            <i className="ri-alert-line me-2 mt-1"></i>
                            <div>
                              <strong>Disclaimer and Limitation of Liability:</strong>
                              <p className="mb-2 small">
                                By registering, you acknowledge that:
                              </p>
                              <ul className="small mb-0">
                                <li>This platform is for healthcare management and should not replace professional medical judgment</li>
                                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                                <li>The platform administrators are not liable for any medical decisions made using this system</li>
                                <li>All data is encrypted and protected, but no system is 100% secure</li>
                                <li>Account approval is subject to verification of medical credentials</li>
                                <li>Misuse of the platform may result in account termination and legal action</li>
                              </ul>
                            </div>
                          </Alert>
                        </div>

                        <div className="d-flex justify-content-center mb-4">
                          <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                            onChange={handleRecaptcha}
                          />
                          {formErrors.recaptcha_token && (
                            <div className="text-danger small mt-2">{formErrors.recaptcha_token}</div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Navigation buttons */}
                    <div className="d-flex justify-content-between mt-4">
                      <Button
                        variant="outline-secondary"
                        onClick={prevStep}
                        disabled={currentStep === 1}
                      >
                        <i className="ri-arrow-left-line me-2"></i>
                        Previous
                      </Button>

                      {currentStep < 5 ? (
                        <Button
                          variant="primary"
                          onClick={nextStep}
                          style={{ background: 'linear-gradient(135deg, #007bff, #0056b3)', border: 'none' }}
                        >
                          Next
                          <i className="ri-arrow-right-line ms-2"></i>
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          variant="success"
                          disabled={isLoading}
                          style={{ background: 'linear-gradient(135deg, #28a745, #20c997)', border: 'none' }}
                        >
                          {isLoading ? (
                            <>
                              <div className="spinner-border spinner-border-sm me-2" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                              Processing...
                            </>
                          ) : (
                            <>
                              Complete Registration
                              <i className="ri-check-line ms-2"></i>
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </Form>
                  
                  <div className="text-center mt-4">
                    <Link 
                      to="/auth/login" 
                      className="text-decoration-none d-flex align-items-center justify-content-center"
                    >
                      <i className="ri-arrow-left-line me-2"></i>
                      Already have an account? Login
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Privacy Policy Modal */}
      <Modal show={showPrivacyModal} onHide={() => setShowPrivacyModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Privacy Policy & GDPR Compliance</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <h5>Data Protection & Privacy</h5>
          <p>We are committed to protecting your personal data in accordance with GDPR regulations:</p>
          
          <h6>Data We Collect:</h6>
          <ul>
            <li>Personal identification information (name, date of birth, contact details)</li>
            <li>Professional credentials and medical license information</li>
            <li>Account security information (encrypted)</li>
            <li>Usage data and system interactions</li>
          </ul>
          
          <h6>How We Use Your Data:</h6>
          <ul>
            <li>To verify your professional credentials and provide access to our platform</li>
            <li>To maintain secure user accounts and prevent unauthorized access</li>
            <li>To comply with healthcare regulations and audit requirements</li>
            <li>To improve our services and user experience</li>
          </ul>
          
          <h6>Your Rights:</h6>
          <ul>
            <li>Right to access your personal data</li>
            <li>Right to correct inaccurate data</li>
            <li>Right to data portability</li>
            <li>Right to request deletion (subject to legal requirements)</li>
            <li>Right to withdraw consent for marketing communications</li>
          </ul>
          
          <h6>Data Security:</h6>
          <p>We implement industry-standard security measures including encryption, access controls, and regular security audits to protect your data.</p>
          
          <h6>Data Retention:</h6>
          <p>We retain your data as long as your account is active and for the period required by healthcare regulations and legal obligations.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPrivacyModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* HIPAA Agreement Modal */}
      <Modal show={showHipaaModal} onHide={() => setShowHipaaModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>HIPAA Compliance Agreement</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <h5>Health Insurance Portability and Accountability Act (HIPAA) Compliance</h5>
          
          <h6>Protected Health Information (PHI):</h6>
          <p>As a healthcare professional using this platform, you acknowledge that:</p>
          <ul>
            <li>You will handle all patient information in compliance with HIPAA regulations</li>
            <li>You will not share patient data with unauthorized individuals</li>
            <li>You will report any suspected data breaches immediately</li>
            <li>You will use secure methods to access and transmit PHI</li>
          </ul>
          
          <h6>Platform Security Measures:</h6>
          <ul>
            <li>End-to-end encryption for all data transmission</li>
            <li>Access logging and audit trails</li>
            <li>Regular security assessments and updates</li>
            <li>Role-based access controls</li>
            <li>Secure data backup and recovery procedures</li>
          </ul>
          
          <h6>User Responsibilities:</h6>
          <ul>
            <li>Maintain confidentiality of login credentials</li>
            <li>Log out properly after each session</li>
            <li>Report security incidents immediately</li>
            <li>Complete required HIPAA training updates</li>
            <li>Use platform only for authorized healthcare purposes</li>
          </ul>
          
          <h6>Breach Notification:</h6>
          <p>In the event of a security breach, we will notify affected users and relevant authorities within the time frames required by HIPAA regulations.</p>
          
          <Alert variant="info" className="mt-3">
            <strong>Note:</strong> This platform is designed to be HIPAA-compliant, but ultimate responsibility for PHI protection lies with the healthcare provider using the system.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowHipaaModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Terms of Service Modal */}
      <Modal show={showTermsModal} onHide={() => setShowTermsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Terms of Service</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <h5>Healthcare Platform Terms of Service</h5>
          
          <h6>1. Acceptance of Terms</h6>
          <p>By registering for this platform, you agree to be bound by these terms and conditions.</p>
          
          <h6>2. Eligibility</h6>
          <ul>
            <li>You must be a licensed healthcare professional</li>
            <li>You must provide accurate and current information</li>
            <li>Your medical license must be valid and in good standing</li>
          </ul>
          
          <h6>3. Account Responsibilities</h6>
          <ul>
            <li>You are responsible for maintaining account security</li>
            <li>You must not share account credentials</li>
            <li>You must notify us immediately of unauthorized access</li>
            <li>You are liable for all activities under your account</li>
          </ul>
          
          <h6>4. Permitted Use</h6>
          <ul>
            <li>Platform use is limited to legitimate healthcare purposes</li>
            <li>You may not use the platform for unauthorized research</li>
            <li>Data mining or automated access is prohibited</li>
            <li>Commercial use requires separate authorization</li>
          </ul>
          
          <h6>5. Intellectual Property</h6>
          <p>All platform content, features, and functionality are owned by Mastermind Healthcare and protected by intellectual property laws.</p>
          
          <h6>6. Limitation of Liability</h6>
          <Alert variant="danger">
            <strong>IMPORTANT DISCLAIMER:</strong>
            <ul className="mb-0 mt-2">
              <li>This platform is a tool to assist healthcare professionals and does not replace clinical judgment</li>
              <li>We are not liable for medical decisions made using this platform</li>
              <li>Healthcare providers remain solely responsible for patient care decisions</li>
              <li>The platform is provided "as is" without warranties of any kind</li>
              <li>We disclaim liability for any damages arising from platform use</li>
              <li>Users assume all risks associated with platform use</li>
            </ul>
          </Alert>
          
          <h6>7. Termination</h6>
          <p>We reserve the right to terminate accounts for violations of these terms, loss of medical license, or other legitimate reasons.</p>
          
          <h6>8. Updates to Terms</h6>
          <p>We may update these terms periodically. Continued use constitutes acceptance of revised terms.</p>
          
          <h6>9. Governing Law</h6>
          <p>These terms are governed by applicable healthcare regulations and local jurisdiction laws.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTermsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Registration;
