import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Modal, Badge, InputGroup, ProgressBar, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// Import API for subscription plans
import { subscriptionAPI } from '../../services/api';

// Import country data
import { countries } from './countries';

// Simple mock API for testing (without external dependencies)
const mockAuthAPI = {
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  users: [],
  otpCodes: new Map(),

  async checkEmailAvailability(email) {
    await this.delay(500);
    const exists = this.users.find(user => user.email === email);
    return { available: !exists, message: exists ? 'Email already registered' : 'Email available' };
  },

  async sendOTP(email, type = 'email') {
    await this.delay(1000);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otpCodes.set(email, { code: otp, expires: Date.now() + 300000 });
    console.log(`OTP sent to ${email} via ${type}: ${otp}`);
    return { success: true, message: `OTP sent to your ${type}` };
  },

  async verifyOTP(email, code) {
    await this.delay(500);
    const storedOTP = this.otpCodes.get(email);
    if (!storedOTP) return { success: false, message: 'No OTP found' };
    if (storedOTP.expires < Date.now()) return { success: false, message: 'OTP expired' };
    if (storedOTP.code !== code) return { success: false, message: 'Invalid OTP' };
    this.otpCodes.delete(email);
    return { success: true, message: 'OTP verified successfully' };
  },

  async signup(userData) {
    await this.delay(1000);
    this.users.push({ ...userData, id: Date.now() });
    return { success: true, message: 'Account created successfully!' };
  }
};

const WorkingModernSignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    country: '',
    role: '',
    subscriptionPlan: '',
    profilePicture: null,
    termsAccepted: false,
    marketingEmails: false
  });

  // UI State
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  // Subscription plans state
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);
  
  // Email validation state
  const [emailStatus, setEmailStatus] = useState({ checking: false, available: null, message: '' });
  
  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] });
  
  // OTP Modal state
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpType, setOtpType] = useState('email');
  
  // Terms modal state
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Profile picture preview
  const [profilePreview, setProfilePreview] = useState(null);

  // Handle profile picture change
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    console.log('📷 Profile picture selected:', file?.name, file?.size);
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        console.log('❌ File too large');
        alert('Profile picture must be less than 5MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        console.log('❌ Invalid file type');
        alert('Please select a valid image file');
        return;
      }
      
      console.log('✅ Profile picture accepted');
      setFormData(prev => ({ ...prev, profilePicture: file }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => setProfilePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Email availability check with debouncing
  useEffect(() => {
    const checkEmail = async () => {
      if (formData.email && formData.email.includes('@')) {
        setEmailStatus({ checking: true, available: null, message: '' });
        
        try {
          const result = await mockAuthAPI.checkEmailAvailability(formData.email);
          setEmailStatus({
            checking: false,
            available: result.available,
            message: result.message
          });
        } catch (error) {
          setEmailStatus({
            checking: false,
            available: null,
            message: 'Error checking email availability'
          });
        }
      }
    };

    const debounceTimer = setTimeout(checkEmail, 500);
    return () => clearTimeout(debounceTimer);
  }, [formData.email]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    console.log(`📝 Input changed: ${field} = ${value}`);
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Update password strength
    if (field === 'password') {
      updatePasswordStrength(value);
    }
  };

  // Update password strength
  const updatePasswordStrength = (password) => {
    let score = 0;
    const feedback = [];

    if (password.length >= 8) {
      score += 1;
      feedback.push('✓ At least 8 characters');
    } else {
      feedback.push('✗ At least 8 characters required');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
      feedback.push('✓ Contains uppercase letter');
    } else {
      feedback.push('✗ Add uppercase letter');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
      feedback.push('✓ Contains lowercase letter');
    } else {
      feedback.push('✗ Add lowercase letter');
    }

    if (/\d/.test(password)) {
      score += 1;
      feedback.push('✓ Contains number');
    } else {
      feedback.push('✗ Add number');
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
      feedback.push('✓ Contains special character');
    } else {
      feedback.push('✗ Add special character');
    }

    setPasswordStrength({ score, feedback });
  };

  // Validate current step
  const validateStep = (step) => {
    const errors = {};

    if (step === 1) {
      if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
      if (!formData.email.trim()) errors.email = 'Email is required';
      if (!formData.phoneNumber.trim()) errors.phoneNumber = 'Phone number is required';
      if (!formData.password) errors.password = 'Password is required';
      if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
      if (passwordStrength.score < 3) errors.password = 'Password is too weak';
      if (!emailStatus.available) errors.email = 'Please use an available email address';
    }

    if (step === 2) {
      if (!formData.country) errors.country = 'Please select your country';
      if (!formData.role) errors.role = 'Please select your role';
      if (!formData.subscriptionPlan) errors.subscriptionPlan = 'Please select a subscription plan';
      if (!formData.termsAccepted) errors.termsAccepted = 'You must accept the terms and conditions';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle next step
  const handleNextStep = () => {
    console.log(`🚀 Moving to next step from step ${currentStep}`);
    if (validateStep(currentStep)) {
      console.log(`✅ Step ${currentStep} validation passed`);
      setCurrentStep(prev => prev + 1);
    } else {
      console.log(`❌ Step ${currentStep} validation failed`);
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Send OTP
  const sendOTP = async (type = 'email') => {
    try {
      setIsSubmitting(true);
      const result = await mockAuthAPI.sendOTP(formData.email, type);
      if (result.success) {
        setOtpType(type);
        setShowOTPModal(true);
        alert(result.message);
      }
    } catch (error) {
      alert('Failed to send OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Verify OTP
  const verifyOTP = async () => {
    try {
      setIsSubmitting(true);
      const result = await mockAuthAPI.verifyOTP(formData.email, otpCode);
      if (result.success) {
        setShowOTPModal(false);
        alert('OTP verified! Proceeding with account creation...');
        await handleFinalSubmit();
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('OTP verification failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle final form submission
  const handleFinalSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      const signupData = {
        ...formData,
        profilePicture: formData.profilePicture ? formData.profilePicture.name : null
      };
      
      await mockAuthAPI.signup(signupData);
      alert('Account created successfully! 🎉');
      navigate('/mastermind-subscription', { 
        state: { 
          signupData: signupData,
          message: 'Account created successfully! Please select your subscription plan.' 
        }
      });
    } catch (error) {
      alert('Account creation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (currentStep === 3) {
      if (validateStep(currentStep)) {
        await sendOTP('email');
      }
    } else {
      handleNextStep();
    }
  };

  // Load subscription plans on component mount
  useEffect(() => {
    loadSubscriptionPlans();
  }, []);

  const loadSubscriptionPlans = async () => {
    setPlansLoading(true);
    try {
      console.log('🔄 Loading subscription plans from API...');
      const response = await subscriptionAPI.getPublicPlans();
      console.log('✅ Plans loaded successfully:', response.data);
      const plans = response.data;
      
      // Transform plans to the format expected by the component
      const transformedPlans = plans
        .filter(plan => plan.is_active) // Only show active plans
        .map(plan => ({
          id: plan.id,
          name: plan.name,
          price: `$${plan.price_monthly}`,
          currency: plan.currency || 'USD',
          description: plan.description || '',
          features: plan.services || []
        }));
      
      console.log('🔄 Transformed plans:', transformedPlans);
      setSubscriptionPlans(transformedPlans);
    } catch (error) {
      console.error('❌ Failed to load subscription plans:', error);
      // Fallback to default plans if API fails
      console.log('🔄 Using fallback plans...');
      setSubscriptionPlans([
        { 
          id: 'basic', 
          name: 'Basic', 
          price: '$29', 
          currency: 'USD',
          description: 'Perfect for individuals getting started',
          features: ['Basic Features', 'Email Support'] 
        },
        { 
          id: 'pro', 
          name: 'Professional', 
          price: '$79', 
          currency: 'USD',
          description: 'Ideal for growing practices',
          features: ['All Basic Features', 'Priority Support', 'Advanced Analytics'] 
        },
        { 
          id: 'enterprise', 
          name: 'Enterprise', 
          price: '$199', 
          currency: 'USD',
          description: 'Complete solution for large organizations',
          features: ['All Pro Features', 'Custom Integration', '24/7 Support'] 
        }
      ]);
    } finally {
      setPlansLoading(false);
    }
  };

  // Role options
  const roleOptions = [
    { value: 'patient', label: 'Patient', description: 'Looking for healthcare services' },
    { value: 'doctor', label: 'Healthcare Provider', description: 'Medical professional' },
    { value: 'admin', label: 'Administrator', description: 'Healthcare facility admin' }
  ];

  return (
    <Container fluid className="d-flex align-items-center justify-content-center min-vh-100" 
      style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px'
      }}>
      
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          
          {/* Progress Indicator */}
          <div className="mb-4">
            <ProgressBar 
              now={(currentStep / 3) * 100} 
              style={{ height: '8px', borderRadius: '10px' }}
              variant="success"
            />
            <div className="d-flex justify-content-between mt-2">
              <small className={currentStep >= 1 ? 'text-white fw-bold' : 'text-white-50'}>Personal Info</small>
              <small className={currentStep >= 2 ? 'text-white fw-bold' : 'text-white-50'}>Preferences</small>
              <small className={currentStep >= 3 ? 'text-white fw-bold' : 'text-white-50'}>Verification</small>
            </div>
          </div>

          <Card className="shadow-lg border-0" style={{ borderRadius: '20px' }}>
            <Card.Body className="p-5">
              
              {/* Header */}
              <div className="text-center mb-4">
                <h2 className="fw-bold text-primary mb-2">Create Your Account</h2>
                <p className="text-muted">Step {currentStep} of 3 - {
                  currentStep === 1 ? 'Personal Information' :
                  currentStep === 2 ? 'Role & Preferences' :
                  'Verification'
                }</p>
                <p className="small mb-0">
                  <span className="text-muted">Already have an account? </span>
                  <Link to="/login" className="text-decoration-none">Sign In</Link>
                  <span className="text-muted"> | </span>
                  <Link to="/mastermind-subscription" className="text-decoration-none text-primary">
                    Just browse plans →
                  </Link>
                </p>
              </div>

              <Form onSubmit={handleSubmit}>
                
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <>
                    {/* Profile Picture Upload */}
                    <div className="text-center mb-4">
                      <div className="position-relative d-inline-block">
                        <div 
                          className="rounded-circle bg-light border d-flex align-items-center justify-content-center"
                          style={{ width: '100px', height: '100px', cursor: 'pointer' }}
                          onClick={() => document.getElementById('profilePictureInput').click()}
                        >
                          {profilePreview ? (
                            <img 
                              src={profilePreview} 
                              alt="Profile" 
                              className="rounded-circle"
                              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                            />
                          ) : (
                            <i className="ri-camera-fill text-muted" style={{ fontSize: '2rem' }}></i>
                          )}
                        </div>
                        <input
                          type="file"
                          id="profilePictureInput"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleProfilePictureChange}
                        />
                      </div>
                      <p className="small text-muted mt-2">Click to upload profile picture</p>
                    </div>

                    {/* Social Media Sign Up */}
                    <div className="mb-4">
                      <div className="row g-2">
                        <div className="col-6">
                          <Button 
                            variant="outline-primary" 
                            className="w-100 d-flex align-items-center justify-content-center py-2"
                            style={{ borderRadius: '12px' }}
                            onClick={() => {
                              console.log('🔗 Google sign-up clicked');
                              alert('Google sign-up would be integrated here');
                            }}
                          >
                            <i className="ri-google-fill me-2" style={{ color: '#4285F4' }}></i>
                            Google
                          </Button>
                        </div>
                        <div className="col-6">
                          <Button 
                            variant="outline-dark" 
                            className="w-100 d-flex align-items-center justify-content-center py-2"
                            style={{ borderRadius: '12px' }}
                            onClick={() => {
                              console.log('🔗 Microsoft sign-up clicked');
                              alert('Microsoft sign-up would be integrated here');
                            }}
                          >
                            <i className="ri-microsoft-fill me-2" style={{ color: '#00A4EF' }}></i>
                            Microsoft
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-center my-3">
                        <span className="text-muted">or sign up with email</span>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        isInvalid={!!formErrors.fullName}
                        style={{ borderRadius: '12px' }}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.fullName}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          isInvalid={!!formErrors.email}
                          style={{ borderRadius: '12px 0 0 12px' }}
                        />
                        <InputGroup.Text style={{ borderRadius: '0 12px 12px 0' }}>
                          {emailStatus.checking ? (
                            <Spinner size="sm" animation="border" />
                          ) : emailStatus.available === true ? (
                            <i className="ri-check-line text-success"></i>
                          ) : emailStatus.available === false ? (
                            <i className="ri-close-line text-danger"></i>
                          ) : null}
                        </InputGroup.Text>
                      </InputGroup>
                      <Form.Control.Feedback type="invalid">
                        {formErrors.email}
                      </Form.Control.Feedback>
                      {emailStatus.message && (
                        <small className={emailStatus.available ? 'text-success' : 'text-danger'}>
                          {emailStatus.message}
                        </small>
                      )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        isInvalid={!!formErrors.phoneNumber}
                        style={{ borderRadius: '12px' }}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.phoneNumber}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        isInvalid={!!formErrors.password}
                        style={{ borderRadius: '12px' }}
                      />
                      
                      {/* Password Strength Indicator */}
                      {formData.password && (
                        <div className="mt-2">
                          <ProgressBar 
                            now={(passwordStrength.score / 5) * 100}
                            variant={
                              passwordStrength.score < 2 ? 'danger' :
                              passwordStrength.score < 4 ? 'warning' : 'success'
                            }
                            style={{ height: '6px' }}
                          />
                          <div className="mt-1">
                            {passwordStrength.feedback.map((item, index) => (
                              <small key={index} className={item.startsWith('✓') ? 'text-success d-block' : 'text-muted d-block'}>
                                {item}
                              </small>
                            ))}
                          </div>
                        </div>
                      )}
                      <Form.Control.Feedback type="invalid">
                        {formErrors.password}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        isInvalid={!!formErrors.confirmPassword}
                        style={{ borderRadius: '12px' }}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.confirmPassword}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Button 
                      type="submit" 
                      className="w-100 mb-3"
                      size="lg"
                      disabled={isSubmitting}
                      style={{ 
                        background: 'linear-gradient(135deg, #007bff, #0056b3)',
                        border: 'none',
                        borderRadius: '12px'
                      }}
                      onClick={handleNextStep}
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Processing...
                        </>
                      ) : 'Next Step'}
                    </Button>
                  </>
                )}

                {/* Step 2: Role & Preferences */}
                {currentStep === 2 && (
                  <>
                    {/* Country Selection */}
                    <Form.Group className="mb-4">
                      <Form.Label>Country</Form.Label>
                      <Form.Select
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        isInvalid={!!formErrors.country}
                        style={{ borderRadius: '12px' }}
                      >
                        <option value="">Select your country</option>
                        {countries.map(country => (
                          <option key={country.code} value={country.code}>
                            {country.flag} {country.name}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {formErrors.country}
                      </Form.Control.Feedback>
                    </Form.Group>

                    {/* Role Selection */}
                    <Form.Group className="mb-4">
                      <Form.Label>I am a...</Form.Label>
                      <div className="row g-3">
                        {roleOptions.map(role => (
                          <div key={role.value} className="col-12">
                            <Card 
                              className={`h-100 border-2 ${formData.role === role.value ? 'border-primary bg-primary bg-opacity-10' : 'border-light'}`}
                              style={{ cursor: 'pointer', borderRadius: '12px' }}
                              onClick={() => handleInputChange('role', role.value)}
                            >
                              <Card.Body className="p-3">
                                <div className="d-flex align-items-center">
                                  <Form.Check
                                    type="radio"
                                    name="role"
                                    value={role.value}
                                    checked={formData.role === role.value}
                                    onChange={() => handleInputChange('role', role.value)}
                                    className="me-3"
                                  />
                                  <div>
                                    <h6 className="mb-1">{role.label}</h6>
                                    <small className="text-muted">{role.description}</small>
                                  </div>
                                </div>
                              </Card.Body>
                            </Card>
                          </div>
                        ))}
                      </div>
                      {formErrors.role && (
                        <div className="text-danger small mt-2">{formErrors.role}</div>
                      )}
                    </Form.Group>

                    {/* Subscription Plans */}
                    <Form.Group className="mb-4">
                      <Form.Label>Choose Your Plan</Form.Label>
                      {plansLoading ? (
                        <div className="text-center p-4">
                          <Spinner animation="border" size="sm" className="me-2" />
                          Loading subscription plans...
                        </div>
                      ) : (
                        <div className="row g-3">
                          {subscriptionPlans.map(plan => (
                            <div key={plan.id} className="col-md-4">
                              <Card 
                                className={`h-100 border-2 ${formData.subscriptionPlan === plan.id ? 'border-primary bg-primary bg-opacity-10' : 'border-light'}`}
                                style={{ cursor: 'pointer', borderRadius: '12px' }}
                                onClick={() => handleInputChange('subscriptionPlan', plan.id)}
                              >
                                <Card.Body className="text-center p-3">
                                  <h6 className="fw-bold">{plan.name}</h6>
                                  <h4 className="text-primary">
                                    {plan.price}
                                    <small className="text-muted d-block" style={{ fontSize: '0.75em' }}>
                                      {plan.currency}/month
                                    </small>
                                  </h4>
                                  {plan.description && (
                                    <p className="small text-muted mb-2">{plan.description}</p>
                                  )}
                                  <ul className="list-unstyled small">
                                    {plan.features.map((feature, index) => (
                                      <li key={index} className="mb-1">
                                        <i className="ri-check-line text-success me-1"></i>
                                        {feature}
                                      </li>
                                    ))}
                                  </ul>
                                  <Form.Check
                                    type="radio"
                                    name="subscriptionPlan"
                                    value={plan.id}
                                    checked={formData.subscriptionPlan === plan.id}
                                    onChange={() => handleInputChange('subscriptionPlan', plan.id)}
                                    className="mt-2"
                                  />
                                </Card.Body>
                              </Card>
                            </div>
                          ))}
                        </div>
                      )}
                      {formErrors.subscriptionPlan && (
                        <div className="text-danger small mt-2">{formErrors.subscriptionPlan}</div>
                      )}
                      
                      {/* Admin Link */}
                      <div className="text-center mt-3">
                        <small className="text-muted">
                          Plan prices updated in real-time. 
                          <Link to="/mastermind-subscription" className="text-primary ms-1">
                            Admin Dashboard →
                          </Link>
                        </small>
                      </div>
                    </Form.Group>

                    {/* Terms and Conditions */}
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        label={
                          <span>
                            I agree to the{' '}
                            <Button 
                              variant="link" 
                              className="p-0 text-decoration-underline"
                              onClick={() => setShowTermsModal(true)}
                            >
                              Terms of Service
                            </Button>
                            {' '}and{' '}
                            <Button 
                              variant="link" 
                              className="p-0 text-decoration-underline"
                              onClick={() => setShowTermsModal(true)}
                            >
                              Privacy Policy
                            </Button>
                          </span>
                        }
                        checked={formData.termsAccepted}
                        onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                        isInvalid={!!formErrors.termsAccepted}
                      />
                      {formErrors.termsAccepted && (
                        <div className="text-danger small mt-1">{formErrors.termsAccepted}</div>
                      )}
                    </Form.Group>

                    {/* Marketing Emails */}
                    <Form.Group className="mb-4">
                      <Form.Check
                        type="checkbox"
                        label="I would like to receive marketing emails and updates"
                        checked={formData.marketingEmails}
                        onChange={(e) => handleInputChange('marketingEmails', e.target.checked)}
                      />
                    </Form.Group>

                    {/* Navigation Buttons */}
                    <div className="d-flex gap-2">
                      <Button 
                        variant="outline-secondary" 
                        onClick={handlePrevStep}
                        className="flex-fill"
                        style={{ borderRadius: '12px' }}
                      >
                        Previous
                      </Button>
                      <Button 
                        type="submit" 
                        className="flex-fill"
                        disabled={isSubmitting}
                        style={{ 
                          background: 'linear-gradient(135deg, #007bff, #0056b3)',
                          border: 'none',
                          borderRadius: '12px'
                        }}
                      >
                        {isSubmitting ? (
                          <>
                            <Spinner size="sm" className="me-2" />
                            Processing...
                          </>
                        ) : 'Complete Registration'}
                      </Button>
                    </div>
                  </>
                )}

                {/* Already have account link */}
                <div className="text-center mt-3">
                  <p className="mb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="text-decoration-none">
                      Sign In
                    </Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* OTP Verification Modal */}
      <Modal show={showOTPModal} onHide={() => setShowOTPModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Verify Your {otpType === 'email' ? 'Email' : 'Phone'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>We've sent a verification code to your {otpType}. Please enter it below:</p>
          <Form.Control
            type="text"
            placeholder="Enter 6-digit code"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            maxLength={6}
            className="text-center fs-4"
            style={{ letterSpacing: '0.5em' }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowOTPModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={verifyOTP} disabled={isSubmitting || otpCode.length !== 6}>
            {isSubmitting ? <Spinner size="sm" className="me-2" /> : null}
            Verify
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Terms of Service Modal */}
      <Modal show={showTermsModal} onHide={() => setShowTermsModal(false)} size="lg" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>Terms of Service & Privacy Policy</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6>Terms of Service</h6>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...</p>
          
          <h6 className="mt-4">Privacy Policy</h6>
          <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat...</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTermsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default WorkingModernSignUp;
