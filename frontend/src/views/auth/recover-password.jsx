import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert, Card, ProgressBar, Badge } from 'react-bootstrap';
import ReCAPTCHA from 'react-google-recaptcha';

const PasswordRecovery = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const recaptchaRef = useRef(null);
  
  // Parse token from URL if present
  const urlParams = new URLSearchParams(location.search);
  const resetToken = urlParams.get('token');

  // Multi-step state management
  const [currentStep, setCurrentStep] = useState(resetToken ? 'validate_token' : 'request_reset');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({
    email: '',
    new_password: '',
    confirm_password: '',
    recaptcha_token: ''
  });
  
  // Token validation state
  const [tokenStatus, setTokenStatus] = useState({
    valid: false,
    remaining_time: 0,
    attempts_left: 0,
    user_email: ''
  });
  
  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: [],
    color: 'danger'
  });
  
  // Timer for token expiry
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Validate token on component mount if token exists
  useEffect(() => {
    if (resetToken && currentStep === 'validate_token') {
      validateToken();
    }
  }, [resetToken]);

  // Timer countdown effect
  useEffect(() => {
    let interval;
    if (timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setError('Reset token has expired. Please request a new password reset.');
            setCurrentStep('request_reset');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timeRemaining]);

  // Password strength checker
  const checkPasswordStrength = (password) => {
    const checks = [
      { test: /.{8,}/, message: 'At least 8 characters' },
      { test: /[A-Z]/, message: 'One uppercase letter' },
      { test: /[a-z]/, message: 'One lowercase letter' },
      { test: /\d/, message: 'One number' },
      { test: /[!@#$%^&*(),.?":{}|<>]/, message: 'One special character' }
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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'new_password') {
      checkPasswordStrength(value);
    }
    
    // Clear errors when user starts typing
    if (error) setError('');
  };

  // Handle reCAPTCHA
  const handleRecaptcha = (token) => {
    setFormData(prev => ({
      ...prev,
      recaptcha_token: token
    }));
  };

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Step 1: Request password reset
  const handleRequestReset = async (e) => {
    e.preventDefault();
    
    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }
    
    if (!formData.recaptcha_token) {
      setError('Please complete the reCAPTCHA verification');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      console.log('🚀 Sending password reset request:', {
        email: formData.email,
        recaptcha_token: formData.recaptcha_token ? 'Present' : 'Missing'
      });
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/auth/password-reset/initiate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          recaptcha_token: formData.recaptcha_token
        })
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));
      
      let data;
      try {
        data = await response.json();
        console.log('📝 Response data:', data);
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        const responseText = await response.text();
        console.log('📝 Raw response:', responseText);
        setError(`Server error (${response.status}): Unable to parse response`);
        return;
      }
      
      if (response.ok && data.success) {
        setSuccess(data.message);
        setCurrentStep('email_sent');
        setTimeRemaining(data.expires_in || 900);
      } else {
        console.error('❌ Request failed:', {
          status: response.status,
          data: data
        });
        setError(data.error || `Server error (${response.status}): Failed to send reset email`);
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
    }
  };

  // Step 2: Validate reset token
  const validateToken = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/auth/password-reset/status/?token=${resetToken}`);
      const data = await response.json();
      
      if (data.success && data.status === 'valid') {
        setTokenStatus(data);
        setTimeRemaining(data.remaining_time);
        setFormData(prev => ({ ...prev, email: data.user_email }));
        setCurrentStep('enter_password');
      } else {
        setError(data.error || 'Invalid or expired reset token');
        setCurrentStep('request_reset');
      }
    } catch (error) {
      setError('Failed to validate reset token');
      setCurrentStep('request_reset');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Complete password reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (!formData.new_password || !formData.confirm_password) {
      setError('Please fill in all password fields');
      return;
    }
    
    if (formData.new_password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }
    
    if (passwordStrength.score < 60) {
      setError('Password does not meet security requirements');
      return;
    }
    
    if (!formData.recaptcha_token) {
      setError('Please complete the reCAPTCHA verification');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/auth/password-reset/complete/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: resetToken,
          new_password: formData.new_password,
          confirm_password: formData.confirm_password,
          recaptcha_token: formData.recaptcha_token
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(data.message);
        setCurrentStep('completed');
        setTimeout(() => {
          navigate('/auth/login');
        }, 3000);
      } else {
        setError(data.error || 'Failed to reset password');
        if (data.password_errors) {
          setError(data.password_errors.join('. '));
        }
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
    }
  };

  // Render password strength indicator
  const renderPasswordStrength = () => {
    if (!formData.new_password) return null;
    
    const strengthText = passwordStrength.score >= 80 ? 'Strong' : 
                       passwordStrength.score >= 60 ? 'Good' : 
                       passwordStrength.score >= 40 ? 'Fair' : 'Weak';
    
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

  // Render different steps
  const renderStep = () => {
    switch (currentStep) {
      case 'request_reset':
        return (
          <div>
            <div className="text-center mb-4">
              <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" 
                   style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #007bff, #6f42c1)' }}>
                <i className="ri-lock-line text-white" style={{ fontSize: '2rem' }}></i>
              </div>
              <h2 className="fw-bold mb-2">Forgot Password?</h2>
              <p className="text-muted">No worries! Enter your email and we'll send you a secure reset link.</p>
            </div>

            <Form onSubmit={handleRequestReset}>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  size="lg"
                  required
                />
              </Form.Group>

              <div className="d-flex justify-content-center mb-3">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                  onChange={handleRecaptcha}
                />
              </div>

              {error && (
                <Alert variant="danger" className="d-flex align-items-center">
                  <i className="ri-error-warning-line me-2"></i>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-100 mb-3"
                disabled={isLoading}
                style={{ background: 'linear-gradient(135deg, #007bff, #6f42c1)', border: 'none' }}
              >
                {isLoading ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    Sending Reset Link...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </Form>
          </div>
        );

      case 'email_sent':
        return (
          <div className="text-center">
            <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" 
                 style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #28a745, #007bff)' }}>
              <i className="ri-mail-line text-white" style={{ fontSize: '2rem' }}></i>
            </div>
            
            <h2 className="fw-bold mb-2">Check Your Email</h2>
            <p className="text-muted mb-4">{success}</p>
            
            {timeRemaining > 0 && (
              <Alert variant="info" className="d-flex align-items-center justify-content-center">
                <i className="ri-time-line me-2"></i>
                Link expires in: <strong className="ms-1">{formatTime(timeRemaining)}</strong>
              </Alert>
            )}
            
            <div className="mt-4">
              <p className="text-muted small">
                Didn't receive the email? Check your spam folder or{' '}
                <Button
                  variant="link"
                  className="p-0"
                  onClick={() => setCurrentStep('request_reset')}
                >
                  try again
                </Button>
              </p>
            </div>
          </div>
        );

      case 'enter_password':
        return (
          <div>
            <div className="text-center mb-4">
              <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" 
                   style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #6f42c1, #e83e8c)' }}>
                <i className="ri-key-line text-white" style={{ fontSize: '2rem' }}></i>
              </div>
              <h2 className="fw-bold mb-2">Create New Password</h2>
              <p className="text-muted">Almost done! Enter your new secure password below.</p>
              
              {timeRemaining > 0 && (
                <Alert variant="warning" className="d-flex align-items-center justify-content-center">
                  <i className="ri-time-line me-2"></i>
                  Time remaining: <strong className="ms-1">{formatTime(timeRemaining)}</strong>
                </Alert>
              )}
            </div>

            <Form onSubmit={handlePasswordReset}>
              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  name="new_password"
                  value={formData.new_password}
                  onChange={handleInputChange}
                  placeholder="Enter your new password"
                  size="lg"
                  required
                />
                {renderPasswordStrength()}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleInputChange}
                  placeholder="Confirm your new password"
                  size="lg"
                  required
                />
                {formData.confirm_password && formData.new_password !== formData.confirm_password && (
                  <div className="d-flex align-items-center mt-2">
                    <i className="ri-close-line text-danger me-2"></i>
                    <small className="text-danger">Passwords do not match</small>
                  </div>
                )}
              </Form.Group>

              <div className="d-flex justify-content-center mb-3">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                  onChange={handleRecaptcha}
                />
              </div>

              {error && (
                <Alert variant="danger" className="d-flex align-items-center">
                  <i className="ri-error-warning-line me-2"></i>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-100 mb-3"
                disabled={isLoading || passwordStrength.score < 60}
                style={{ background: 'linear-gradient(135deg, #6f42c1, #e83e8c)', border: 'none' }}
              >
                {isLoading ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    Updating Password...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </Form>
          </div>
        );

      case 'completed':
        return (
          <div className="text-center">
            <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" 
                 style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #28a745, #20c997)' }}>
              <i className="ri-check-line text-white" style={{ fontSize: '2rem' }}></i>
            </div>
            
            <h2 className="fw-bold mb-2">Password Updated!</h2>
            <p className="text-muted mb-4">{success}</p>
            
            <Alert variant="success" className="d-flex align-items-center justify-content-center">
              <i className="ri-check-line me-2"></i>
              Redirecting to login page...
            </Alert>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <style jsx>{`
        .pulse {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        .service-card {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .service-card:hover {
          transform: translateY(-5px);
          background: rgba(255,255,255,0.25) !important;
        }
        
        .testimonial-slide {
          animation: slideIn 0.5s ease-in;
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .health-tip {
          animation: fadeIn 1s ease-in;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .floating-icon {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
      <Container fluid>
        <Row className="min-vh-100">
          {/* Left side - Healthcare Promotion Hub */}
          <Col lg={6} className="d-none d-lg-flex align-items-stretch position-relative">
            <div className="w-100 d-flex flex-column text-white p-4">
              {/* Header Section */}
              <div className="text-center mb-4">
                <div className="mb-3 p-3 rounded-circle d-inline-flex align-items-center justify-content-center floating-icon"
                     style={{ background: 'rgba(255,255,255,0.2)', width: '80px', height: '80px' }}>
                  <i className="ri-hospital-line" style={{ fontSize: '2rem' }}></i>
                </div>
                <h2 className="fw-bold mb-2">Healthcare Excellence</h2>
                <p className="mb-0 opacity-75">Trusted by 50,000+ patients worldwide</p>
              </div>

              {/* Services Showcase */}
              <div className="flex-grow-1 d-flex flex-column justify-content-between">
                {/* Featured Services */}
                <div className="mb-4">
                  <h5 className="fw-bold mb-3 d-flex align-items-center">
                    <i className="ri-star-line me-2"></i>
                    Featured Services
                  </h5>
                  <div className="row g-3">
                    <div className="col-6">
                      <div className="p-3 rounded service-card" style={{ background: 'rgba(255,255,255,0.15)' }}>
                        <i className="ri-heart-pulse-line d-block mb-2" style={{ fontSize: '1.5rem' }}></i>
                        <small className="fw-semibold">Cardiology</small>
                        <br />
                        <small className="opacity-75">Expert heart care</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-3 rounded service-card" style={{ background: 'rgba(255,255,255,0.15)' }}>
                        <i className="ri-brain-line d-block mb-2" style={{ fontSize: '1.5rem' }}></i>
                        <small className="fw-semibold">Neurology</small>
                        <br />
                        <small className="opacity-75">Brain specialists</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-3 rounded service-card" style={{ background: 'rgba(255,255,255,0.15)' }}>
                        <i className="ri-microscope-line d-block mb-2" style={{ fontSize: '1.5rem' }}></i>
                        <small className="fw-semibold">Pathology</small>
                        <br />
                        <small className="opacity-75">Advanced testing</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-3 rounded service-card" style={{ background: 'rgba(255,255,255,0.15)' }}>
                        <i className="ri-scan-line d-block mb-2" style={{ fontSize: '1.5rem' }}></i>
                        <small className="fw-semibold">Radiology</small>
                        <br />
                        <small className="opacity-75">Digital imaging</small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Patient Testimonial */}
                <div className="mb-4 p-3 rounded testimonial-slide" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div className="d-flex align-items-center mb-2">
                    <div className="me-3">
                      <div className="rounded-circle d-flex align-items-center justify-content-center"
                           style={{ background: 'rgba(255,255,255,0.2)', width: '40px', height: '40px' }}>
                        <i className="ri-user-heart-line"></i>
                      </div>
                    </div>
                    <div>
                      <div className="fw-semibold">Sarah Johnson</div>
                      <small className="opacity-75">Verified Patient</small>
                    </div>
                  </div>
                  <p className="mb-2 small">
                    "Exceptional care and cutting-edge technology. The staff made my treatment journey comfortable and reassuring."
                  </p>
                  <div className="d-flex align-items-center">
                    <div className="me-2">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="ri-star-fill" style={{ color: '#ffd700', fontSize: '12px' }}></i>
                      ))}
                    </div>
                    <small className="opacity-75">5.0 rating</small>
                  </div>
                </div>

                {/* Health Tip */}
                <div className="mb-4 p-3 rounded health-tip" style={{ background: 'rgba(40, 167, 69, 0.2)' }}>
                  <h6 className="fw-bold mb-2 d-flex align-items-center">
                    <i className="ri-lightbulb-line me-2"></i>
                    Daily Health Tip
                  </h6>
                  <p className="mb-0 small">
                    💧 Drink 8 glasses of water daily to maintain optimal hydration and support kidney function.
                  </p>
                </div>

                {/* Emergency Contact */}
                <div className="mb-4 p-3 rounded" style={{ background: 'rgba(220, 53, 69, 0.2)' }}>
                  <h6 className="fw-bold mb-2 d-flex align-items-center">
                    <i className="ri-phone-line me-2"></i>
                    24/7 Emergency
                  </h6>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-semibold">+1 (555) 911-HELP</div>
                      <small className="opacity-75">Always available</small>
                    </div>
                    <Button variant="light" size="sm" className="text-dark">
                      <i className="ri-phone-fill me-1"></i>
                      Call Now
                    </Button>
                  </div>
                </div>

                {/* Special Offer */}
                <div className="p-3 rounded position-relative" style={{ background: 'linear-gradient(135deg, #ffc107, #fd7e14)' }}>
                  <div className="position-absolute top-0 end-0 p-2">
                    <Badge bg="danger" className="pulse">NEW</Badge>
                  </div>
                  <h6 className="fw-bold mb-2 text-dark d-flex align-items-center">
                    <i className="ri-gift-line me-2"></i>
                    Special Package
                  </h6>
                  <p className="mb-2 small text-dark">
                    <strong>Complete Health Checkup</strong><br />
                    Save 30% on comprehensive medical screening
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="text-dark">
                      <span className="text-decoration-line-through opacity-75">$299</span>
                      <span className="fw-bold ms-2">$199</span>
                    </div>
                    <Button variant="dark" size="sm">
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>

              {/* Security Badge - Compact */}
              <div className="mt-4 text-center">
                <div className="d-flex justify-content-center gap-2">
                  <Badge bg="light" text="dark" className="px-2 py-1 small">🔐 Encrypted</Badge>
                  <Badge bg="light" text="dark" className="px-2 py-1 small">🛡️ HIPAA Compliant</Badge>
                </div>
              </div>
            </div>
          </Col>

          {/* Right side - Recovery Form */}
          <Col lg={6} className="d-flex align-items-center justify-content-center py-5">
            <div className="w-100" style={{ maxWidth: '500px' }}>
              <Card className="shadow-lg border-0" style={{ borderRadius: '20px' }}>
                <Card.Body className="p-5">
                  {renderStep()}
                  
                  <div className="text-center mt-4">
                    <Link 
                      to="/auth/login" 
                      className="text-decoration-none d-flex align-items-center justify-content-center"
                    >
                      <i className="ri-arrow-left-line me-2"></i>
                      Back to Login
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PasswordRecovery;
