import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Modal, Badge, InputGroup, ProgressBar, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import country data
import { countries } from './countries';

// Simple mock API for testing
const mockAuthAPI = {
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  users: [],
  otpCodes: new Map(),

  async sendOTP({ email, phone, type }) {
    await this.delay(1000);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otpCodes.set(email, { code: otp, timestamp: Date.now() });
    console.log(`Mock OTP for ${email}: ${otp}`);
    return { success: true, message: `OTP sent to ${type === 'email' ? email : phone}` };
  },

  async verifyOTP({ email, otp }) {
    await this.delay(800);
    const storedOTP = this.otpCodes.get(email);
    if (!storedOTP) throw new Error('No OTP found for this email');
    if (Date.now() - storedOTP.timestamp > 5 * 60 * 1000) {
      this.otpCodes.delete(email);
      throw new Error('OTP has expired');
    }
    if (storedOTP.code !== otp) throw new Error('Invalid OTP');
    this.otpCodes.delete(email);
    return { success: true, message: 'OTP verified successfully' };
  },

  async signup(userData) {
    await this.delay(1500);
    if (this.users.find(user => user.email === userData.email)) {
      throw new Error('Email already registered');
    }
    const newUser = { id: Date.now(), ...userData, createdAt: new Date().toISOString(), status: 'active' };
    this.users.push(newUser);
    console.log('Mock user created:', newUser);
    return { success: true, message: 'Account created successfully', user: { id: newUser.id, fullName: newUser.fullName, email: newUser.email, role: newUser.role } };
  },

  async checkEmailAvailability(email) {
    await this.delay(500);
    const exists = this.users.find(user => user.email === email);
    return { available: !exists, message: exists ? 'Email already registered' : 'Email available' };
  }
};

const ModernSignUp = () => {
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
    termsAccepted: false,
    marketingEmails: false,
    profilePicture: null
  });

  // UI state
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);

  // Role options
  const roleOptions = [
    { value: 'patient', label: 'Patient', description: 'Individual seeking healthcare services' },
    { value: 'doctor', label: 'Doctor', description: 'Medical practitioner' },
    { value: 'nurse', label: 'Nurse', description: 'Nursing professional' },
    { value: 'admin', label: 'Administrator', description: 'Hospital/clinic administrator' },
    { value: 'lab_tech', label: 'Lab Technician', description: 'Laboratory professional' },
    { value: 'pharmacist', label: 'Pharmacist', description: 'Pharmacy professional' },
    { value: 'vendor', label: 'Vendor', description: 'Medical equipment/supply vendor' },
    { value: 'researcher', label: 'Researcher', description: 'Medical researcher' }
  ];

  // Subscription plans
  const subscriptionPlans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 29,
      currency: 'USD',
      period: 'month',
      features: [
        'Basic patient management',
        'Standard reporting',
        'Email support',
        '5GB storage'
      ],
      color: '#6c757d',
      popular: false
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 79,
      currency: 'USD',
      period: 'month',
      features: [
        'Advanced patient management',
        'AI-powered insights',
        'Priority support',
        '50GB storage',
        'Advanced analytics',
        'Multi-user access'
      ],
      color: '#007bff',
      popular: true
    },
    {
      id: 'premium',
      name: 'Enterprise',
      price: 199,
      currency: 'USD',
      period: 'month',
      features: [
        'Complete healthcare suite',
        'AI-powered diagnosis support',
        '24/7 phone support',
        'Unlimited storage',
        'Custom integrations',
        'White-label options',
        'Dedicated account manager'
      ],
      color: '#28a745',
      popular: false
    }
  ];

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // OTP timer
  useEffect(() => {
    let timer;
    if (otpTimer > 0) {
      timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpTimer]);

  // Validate email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate phone number
  const validatePhone = (phone) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  };

  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[\d]/.test(password)) strength += 12.5;
    if (/[^a-zA-Z\d]/.test(password)) strength += 12.5;
    return Math.min(strength, 100);
  };

  // Check email availability with debounce
  const checkEmailAvailability = async (email) => {
    if (!email || !email.includes('@')) return;
    
    setEmailChecking(true);
    setEmailAvailable(null);
    
    try {
      const result = await mockAuthAPI.checkEmailAvailability(email);
      setEmailAvailable(result.available);
    } catch (error) {
      console.error('Error checking email:', error);
    } finally {
      setEmailChecking(false);
    }
  };

  // Handle profile picture upload
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    console.log('📷 Profile picture selected:', file?.name, file?.size);
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        console.log('❌ File too large');
        toast.error('Profile picture must be less than 5MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        console.log('❌ Invalid file type');
        toast.error('Please select a valid image file');
        return;
      }
      
      console.log('✅ Profile picture accepted');
      setFormData(prev => ({ ...prev, profilePicture: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setProfilePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Enhanced password requirements check
  const getPasswordRequirements = (password) => {
    return {
      length: { met: password.length >= 8, text: 'At least 8 characters' },
      uppercase: { met: /[A-Z]/.test(password), text: 'One uppercase letter' },
      lowercase: { met: /[a-z]/.test(password), text: 'One lowercase letter' },
      number: { met: /\d/.test(password), text: 'One number' },
      special: { met: /[!@#$%^&*(),.?":{}|<>]/.test(password), text: 'One special character' }
    };
  };

  // Debounced email check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.email && formData.email.includes('@')) {
        checkEmailAvailability(formData.email);
      }
    }, 500);
    
    return () => clearTimeout(timer);
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
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  // Validate form step
  const validateStep = (step) => {
    const errors = {};

    if (step === 1) {
      if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
      if (!formData.email.trim()) {
        errors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
      if (!formData.phoneNumber.trim()) {
        errors.phoneNumber = 'Phone number is required';
      } else if (!validatePhone(formData.phoneNumber)) {
        errors.phoneNumber = 'Please enter a valid phone number';
      }
    }

    if (step === 2) {
      if (!formData.password) {
        errors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters long';
      }
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
      if (!formData.country) errors.country = 'Please select your country';
    }

    if (step === 3) {
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
      
      // Use mock API for testing
      const response = await mockAuthAPI.sendOTP({
        email: formData.email,
        phone: formData.phoneNumber,
        type
      });

      setShowOTPModal(true);
      setOtpTimer(300); // 5 minutes
      toast.success(`OTP sent to your ${type}`, {
        icon: '📧'
      });
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.', {
        icon: '❌'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Verify OTP
  const verifyOTP = async () => {
    try {
      setIsSubmitting(true);
      
      await mockAuthAPI.verifyOTP({
        email: formData.email,
        otp: otpCode
      });

      setEmailVerified(true);
      setPhoneVerified(true);
      setShowOTPModal(false);
      setOtpCode('');
      toast.success('Verification successful!', {
        icon: '✅'
      });
    } catch (error) {
      toast.error(error.message || 'Invalid OTP. Please try again.', {
        icon: '❌'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    try {
      setIsSubmitting(true);
      
      const signupData = {
        ...formData,
        emailVerified,
        phoneVerified
      };

      await mockAuthAPI.signup(signupData);

      toast.success('🎉 Account created successfully!', {
        autoClose: 3000
      });
      
      // Redirect to Netflix-style subscription flow
      setTimeout(() => {
        navigate('/mastermind-subscription', { 
          state: { 
            signupData: signupData,
            message: 'Account created successfully! Please select your subscription plan.' 
          }
        });
      }, 2000);
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.', {
        icon: '❌'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Password strength indicator
  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return 'danger';
    if (passwordStrength < 50) return 'warning';
    if (passwordStrength < 75) return 'info';
    return 'success';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Weak';
    if (passwordStrength < 50) return 'Fair';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  // Render step indicator
  const renderStepIndicator = () => (
    <div className="d-flex justify-content-center mb-4">
      {[1, 2, 3].map(step => (
        <div key={step} className="d-flex align-items-center">
          <div 
            className={`rounded-circle d-flex align-items-center justify-content-center ${
              step <= currentStep ? 'bg-primary text-white' : 'bg-light text-muted'
            }`}
            style={{ width: '40px', height: '40px', fontSize: '14px', fontWeight: 'bold' }}
          >
            {step < currentStep ? <i className="ri-check-line"></i> : step}
          </div>
          {step < 3 && (
            <div 
              className={`mx-3 ${step < currentStep ? 'bg-primary' : 'bg-light'}`}
              style={{ height: '2px', width: '60px' }}
            />
          )}
        </div>
      ))}
    </div>
  );

  // Render step 1: Basic Information
  const renderStep1 = () => (
    <>
      <h4 className="text-center mb-4">Basic Information</h4>
      
      {/* Social Sign-Up Options */}
      <div className="mb-4">
        <div className="row g-2">
          <div className="col-6">
            <Button 
              variant="outline-primary" 
              className="w-100 d-flex align-items-center justify-content-center py-2"
              style={{ borderRadius: '12px' }}
              onClick={() => {
                console.log('🔗 Google sign-up clicked');
                toast.info('Google sign-up would be integrated here');
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
                toast.info('Microsoft sign-up would be integrated here');
              }}
            >
              <i className="ri-microsoft-fill me-2" style={{ color: '#00A4EF' }}></i>
              Microsoft
            </Button>
          </div>
        </div>
        
        <div className="text-center my-3">
          <span className="text-muted small">OR</span>
          <hr className="mt-2" />
        </div>
      </div>

      {/* Profile Picture Upload */}
      <div className="text-center mb-4">
        <div className="position-relative d-inline-block">
          <div 
            className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2"
            style={{
              width: '100px',
              height: '100px',
              background: profilePreview ? `url(${profilePreview})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              color: 'white',
              fontSize: '2rem',
              cursor: 'pointer',
              border: '4px solid #f8f9fa'
            }}
            onClick={() => document.getElementById('profilePictureInput').click()}
          >
            {!profilePreview && <i className="ri-camera-line"></i>}
          </div>
          <Button
            variant="outline-primary"
            size="sm"
            className="position-absolute bottom-0 end-0 rounded-circle p-1"
            style={{ width: '30px', height: '30px' }}
            onClick={() => document.getElementById('profilePictureInput').click()}
          >
            <i className="ri-edit-line small"></i>
          </Button>
          <input
            id="profilePictureInput"
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            style={{ display: 'none' }}
          />
        </div>
        <small className="text-muted">Click to add profile picture (optional)</small>
      </div>
      
      <Form.Group className="mb-3">
        <Form.Label>Full Name *</Form.Label>
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
        <Form.Label>Email Address *</Form.Label>
        <InputGroup>
          <Form.Control
            type="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            isInvalid={!!formErrors.email}
            style={{ borderRadius: '12px 0 0 12px' }}
          />
          <InputGroup.Text style={{ 
            borderRadius: '0 12px 12px 0',
            background: 'transparent',
            border: '1px solid #ced4da'
          }}>
            {emailChecking ? (
              <Spinner size="sm" />
            ) : emailAvailable === true ? (
              <i className="ri-check-line text-success"></i>
            ) : emailAvailable === false ? (
              <i className="ri-close-line text-danger"></i>
            ) : (
              <i className="ri-mail-line text-muted"></i>
            )}
          </InputGroup.Text>
          {emailVerified && (
            <InputGroup.Text className="bg-success text-white">
              <i className="ri-check-line"></i>
            </InputGroup.Text>
          )}
          <Form.Control.Feedback type="invalid">
            {formErrors.email}
          </Form.Control.Feedback>
        </InputGroup>
        {formData.email && !emailVerified && (
          <Button 
            variant="outline-primary" 
            size="sm" 
            className="mt-2"
            onClick={() => sendOTP('email')}
            disabled={isSubmitting}
          >
            Verify Email
          </Button>
        )}
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Phone Number *</Form.Label>
        <InputGroup>
          <Form.Control
            type="tel"
            placeholder="+919164315460"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            isInvalid={!!formErrors.phoneNumber}
          />
          {phoneVerified && (
            <InputGroup.Text className="bg-success text-white">
              <i className="ri-check-line"></i>
            </InputGroup.Text>
          )}
          <Form.Control.Feedback type="invalid">
            {formErrors.phoneNumber}
          </Form.Control.Feedback>
        </InputGroup>
        {formData.phoneNumber && !phoneVerified && (
          <Button 
            variant="outline-primary" 
            size="sm" 
            className="mt-2"
            onClick={() => sendOTP('phone')}
            disabled={isSubmitting}
          >
            Verify Phone
          </Button>
        )}
      </Form.Group>

      <Button 
        variant="primary" 
        size="lg" 
        className="w-100"
        onClick={handleNextStep}
      >
        Next Step
        <i className="ri-arrow-right-line ms-2"></i>
      </Button>
    </>
  );

  // Render step 2: Security & Location
  const renderStep2 = () => (
    <>
      <h4 className="text-center mb-4">Security & Location</h4>
      
      <Form.Group className="mb-3">
        <Form.Label>Password *</Form.Label>
        <InputGroup>
          <Form.Control
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            isInvalid={!!formErrors.password}
            style={{ borderRadius: '12px 0 0 12px' }}
          />
          <Button 
            variant="outline-secondary"
            onClick={() => setShowPassword(!showPassword)}
            style={{ borderRadius: '0 12px 12px 0' }}
          >
            <i className={`ri-${showPassword ? 'eye-off' : 'eye'}-line`}></i>
          </Button>
          <Form.Control.Feedback type="invalid">
            {formErrors.password}
          </Form.Control.Feedback>
        </InputGroup>
        
        {formData.password && (
          <div className="mt-3 p-3 bg-light rounded" style={{ borderRadius: '12px' }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <small className="fw-semibold text-muted">Password Strength</small>
              <small className={`fw-semibold text-${getPasswordStrengthColor()}`}>
                {getPasswordStrengthText()}
              </small>
            </div>
            <ProgressBar 
              now={passwordStrength} 
              variant={getPasswordStrengthColor()}
              style={{ height: '6px', borderRadius: '3px' }}
              className="mb-3"
            />
            
            <div className="row g-2">
              {Object.entries(getPasswordRequirements(formData.password)).map(([key, req]) => (
                <div key={key} className="col-6">
                  <div className="d-flex align-items-center">
                    <i className={`ri-${req.met ? 'check' : 'close'}-line me-2 ${req.met ? 'text-success' : 'text-muted'}`}></i>
                    <small className={req.met ? 'text-success' : 'text-muted'}>
                      {req.text}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Confirm Password *</Form.Label>
        <InputGroup>
          <Form.Control
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            isInvalid={!!formErrors.confirmPassword}
          />
          <Button 
            variant="outline-secondary"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <i className={`ri-${showConfirmPassword ? 'eye-off' : 'eye'}-line`}></i>
          </Button>
          <Form.Control.Feedback type="invalid">
            {formErrors.confirmPassword}
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Country / Region *</Form.Label>
        <Form.Select
          value={formData.country}
          onChange={(e) => handleInputChange('country', e.target.value)}
          isInvalid={!!formErrors.country}
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

      <div className="d-flex gap-2">
        <Button 
          variant="outline-secondary" 
          size="lg" 
          className="flex-fill"
          onClick={handlePrevStep}
        >
          <i className="ri-arrow-left-line me-2"></i>
          Previous
        </Button>
        <Button 
          variant="primary" 
          size="lg" 
          className="flex-fill"
          onClick={handleNextStep}
        >
          Next Step
          <i className="ri-arrow-right-line ms-2"></i>
        </Button>
      </div>
    </>
  );

  // Render step 3: Role & Subscription
  const renderStep3 = () => (
    <>
      <h4 className="text-center mb-4">Role & Subscription</h4>
      
      <Form.Group className="mb-4">
        <Form.Label>Your Role *</Form.Label>
        <Row>
          {roleOptions.map(role => (
            <Col md={6} key={role.value} className="mb-3">
              <Card 
                className={`h-100 cursor-pointer ${formData.role === role.value ? 'border-primary bg-light' : ''}`}
                onClick={() => handleInputChange('role', role.value)}
                style={{ cursor: 'pointer' }}
              >
                <Card.Body className="p-3">
                  <div className="d-flex align-items-center">
                    <Form.Check
                      type="radio"
                      checked={formData.role === role.value}
                      onChange={() => handleInputChange('role', role.value)}
                      className="me-2"
                    />
                    <div>
                      <h6 className="mb-1">{role.label}</h6>
                      <small className="text-muted">{role.description}</small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        {formErrors.role && (
          <div className="text-danger small mt-1">{formErrors.role}</div>
        )}
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Subscription Plan *</Form.Label>
        <Row>
          {subscriptionPlans.map(plan => (
            <Col md={4} key={plan.id} className="mb-3">
              <Card 
                className={`h-100 cursor-pointer position-relative ${formData.subscriptionPlan === plan.id ? 'border-primary' : ''}`}
                onClick={() => handleInputChange('subscriptionPlan', plan.id)}
                style={{ cursor: 'pointer' }}
              >
                {plan.popular && (
                  <Badge 
                    bg="primary" 
                    className="position-absolute top-0 start-50 translate-middle"
                  >
                    Most Popular
                  </Badge>
                )}
                <Card.Header className="text-center" style={{ backgroundColor: plan.color, color: 'white' }}>
                  <h5 className="mb-0">{plan.name}</h5>
                  <div className="mt-2">
                    <span className="h3">${plan.price}</span>
                    <span>/{plan.period}</span>
                  </div>
                </Card.Header>
                <Card.Body className="p-3">
                  <Form.Check
                    type="radio"
                    checked={formData.subscriptionPlan === plan.id}
                    onChange={() => handleInputChange('subscriptionPlan', plan.id)}
                    className="mb-3"
                  />
                  <ul className="list-unstyled">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="mb-2">
                        <i className="ri-check-line text-success me-2"></i>
                        <small>{feature}</small>
                      </li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        {formErrors.subscriptionPlan && (
          <div className="text-danger small mt-1">{formErrors.subscriptionPlan}</div>
        )}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Check
          type="checkbox"
          checked={formData.termsAccepted}
          onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
          isInvalid={!!formErrors.termsAccepted}
          label={
            <span>
              I accept the{' '}
              <Button
                variant="link"
                className="p-0 text-decoration-underline"
                style={{ color: '#667eea', fontSize: 'inherit' }}
                onClick={() => setShowTermsModal(true)}
              >
                Terms of Service and Privacy Policy
              </Button>
            </span>
          }
        />
        <Form.Control.Feedback type="invalid">
          {formErrors.termsAccepted}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Check
          type="checkbox"
          label="I want to receive marketing emails and updates"
          checked={formData.marketingEmails}
          onChange={(e) => handleInputChange('marketingEmails', e.target.checked)}
        />
      </Form.Group>

      <div className="d-flex gap-2">
        <Button 
          variant="outline-secondary" 
          size="lg" 
          className="flex-fill"
          onClick={handlePrevStep}
        >
          <i className="ri-arrow-left-line me-2"></i>
          Previous
        </Button>
        <Button 
          variant="success" 
          size="lg" 
          className="flex-fill"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Creating Account...
            </>
          ) : (
            <>
              Create Account
              <i className="ri-check-line ms-2"></i>
            </>
          )}
        </Button>
      </div>
    </>
  );

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center position-relative" style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      overflow: 'hidden'
    }}>
      {/* Background decorative elements */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: 0 }}>
        <div 
          className="position-absolute rounded-circle opacity-25"
          style={{
            width: '300px',
            height: '300px',
            background: 'rgba(255,255,255,0.1)',
            top: '-150px',
            right: '-150px',
            animation: 'float 6s ease-in-out infinite'
          }}
        />
        <div 
          className="position-absolute rounded-circle opacity-25"
          style={{
            width: '200px',
            height: '200px',
            background: 'rgba(255,255,255,0.1)',
            bottom: '-100px',
            left: '-100px',
            animation: 'float 8s ease-in-out infinite reverse'
          }}
        />
      </div>

      <Row className="w-100 justify-content-center position-relative" style={{ zIndex: 1 }}>
        <Col xl={5} lg={6} md={8} sm={10}>
          <Card className="shadow-lg border-0" style={{ 
            backdropFilter: 'blur(10px)',
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '20px',
            animation: 'slideUp 0.6s ease-out'
          }}>
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <div className="mb-3">
                  <div 
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{
                      width: '80px',
                      height: '80px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      fontSize: '2rem'
                    }}
                  >
                    <i className="ri-user-add-line"></i>
                  </div>
                </div>
                <h2 className="fw-bold" style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Create Your Account
                </h2>
                <p className="text-muted mb-2">Join thousands of healthcare professionals</p>
                <p className="small">
                  <span className="text-muted">Already have an account? </span>
                  <a href="/auth/signin" className="text-decoration-none">Sign In</a>
                  <span className="text-muted"> | </span>
                  <a href="/mastermind-subscription" className="text-decoration-none text-primary">
                    Just browse plans →
                  </a>
                </p>
              </div>

              {renderStepIndicator()}

              <div style={{ minHeight: '400px' }}>
                <div 
                  className="transition-all"
                  style={{
                    transform: currentStep === 1 ? 'translateX(0)' : currentStep === 2 ? 'translateX(-100%)' : 'translateX(-200%)',
                    transition: 'transform 0.3s ease-in-out'
                  }}
                >
                  {currentStep === 1 && (
                    <div style={{ animation: 'fadeInSlide 0.4s ease-out' }}>
                      {renderStep1()}
                    </div>
                  )}
                  {currentStep === 2 && (
                    <div style={{ animation: 'fadeInSlide 0.4s ease-out' }}>
                      {renderStep2()}
                    </div>
                  )}
                  {currentStep === 3 && (
                    <div style={{ animation: 'fadeInSlide 0.4s ease-out' }}>
                      {renderStep3()}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-center mt-4">
                <p className="text-muted">
                  Already have an account? 
                  <Link 
                    to="/auth/signin" 
                    className="text-decoration-none ms-1 fw-semibold"
                    style={{ color: '#667eea' }}
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* OTP Verification Modal */}
      <Modal 
        show={showOTPModal} 
        onHide={() => setShowOTPModal(false)} 
        centered
        backdrop="static"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="w-100 text-center">
            <div className="mb-3">
              <div 
                className="d-inline-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontSize: '1.5rem'
                }}
              >
                <i className="ri-shield-check-line"></i>
              </div>
            </div>
            <h5 className="mb-0">Verify Your Account</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center pt-0">
          <p className="text-muted mb-4">
            We've sent a verification code to your email and phone. 
            Please enter the code below:
          </p>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Enter 6-digit code"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              className="text-center fs-4 py-3"
              style={{ letterSpacing: '0.5rem', borderRadius: '15px' }}
            />
          </Form.Group>
          {otpTimer > 0 && (
            <div className="mb-3">
              <small className="text-muted">
                <i className="ri-time-line me-1"></i>
                Code expires in {Math.floor(otpTimer / 60)}:
                {(otpTimer % 60).toString().padStart(2, '0')}
              </small>
            </div>
          )}
          {otpTimer === 0 && (
            <Button 
              variant="link" 
              onClick={() => sendOTP('email')} 
              className="p-0 text-decoration-none"
              style={{ color: '#667eea' }}
            >
              <i className="ri-refresh-line me-1"></i>
              Resend Code
            </Button>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowOTPModal(false)}
            className="px-4"
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={verifyOTP}
            disabled={isSubmitting || otpCode.length !== 6}
            className="px-4"
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none'
            }}
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" className="me-2" />
                Verifying...
              </>
            ) : (
              <>
                <i className="ri-check-line me-1"></i>
                Verify
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Terms of Service Modal */}
      <Modal 
        show={showTermsModal} 
        onHide={() => setShowTermsModal(false)} 
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-file-text-line me-2"></i>
            Terms of Service & Privacy Policy
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <div className="mb-4">
            <h5 className="text-primary">Terms of Service</h5>
            <p>By creating an account with Xerxez Healthcare, you agree to the following terms:</p>
            <ul className="list-unstyled">
              <li className="mb-2">
                <i className="ri-check-line text-success me-2"></i>
                You will provide accurate and truthful information
              </li>
              <li className="mb-2">
                <i className="ri-check-line text-success me-2"></i>
                You are responsible for maintaining account security
              </li>
              <li className="mb-2">
                <i className="ri-check-line text-success me-2"></i>
                You will comply with all applicable healthcare regulations
              </li>
              <li className="mb-2">
                <i className="ri-check-line text-success me-2"></i>
                Patient data will be handled according to HIPAA guidelines
              </li>
            </ul>
          </div>
          
          <div className="mb-4">
            <h5 className="text-primary">Privacy Policy</h5>
            <p>Your privacy is important to us. We commit to:</p>
            <ul className="list-unstyled">
              <li className="mb-2">
                <i className="ri-shield-check-line text-success me-2"></i>
                Protecting your personal and medical information
              </li>
              <li className="mb-2">
                <i className="ri-shield-check-line text-success me-2"></i>
                Using data only for legitimate healthcare purposes
              </li>
              <li className="mb-2">
                <i className="ri-shield-check-line text-success me-2"></i>
                Never selling your information to third parties
              </li>
              <li className="mb-2">
                <i className="ri-shield-check-line text-success me-2"></i>
                Providing you control over your data
              </li>
            </ul>
          </div>

          <Alert variant="info" className="mb-0">
            <Alert.Heading className="h6">
              <i className="ri-information-line me-2"></i>
              Important Notice
            </Alert.Heading>
            This is a demo application. In a production environment, complete terms and privacy policies would be provided with legal review and compliance certification.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTermsModal(false)}>
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              setFormData(prev => ({ ...prev, termsAccepted: true }));
              setShowTermsModal(false);
              toast.success('Terms accepted successfully!');
            }}
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none'
            }}
          >
            <i className="ri-check-line me-1"></i>
            Accept Terms
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      />

      {/* Add CSS animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInSlide {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .cursor-pointer {
          cursor: pointer;
        }
        
        .transition-all {
          transition: all 0.3s ease;
        }
        
        .form-control:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
      `}</style>
    </Container>
  );
};

export default ModernSignUp;
