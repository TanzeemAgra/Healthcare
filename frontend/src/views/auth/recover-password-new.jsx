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
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(data.message);
        setCurrentStep('email_sent');
        setTimeRemaining(data.expires_in || 900);
      } else {
        setError(data.error || 'Failed to send reset email');
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
                  sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
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
                  sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
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
      <Container fluid>
        <Row className="min-vh-100">
          {/* Left side - Animated Background */}
          <Col lg={6} className="d-none d-lg-flex align-items-center justify-content-center position-relative">
            <div className="text-center text-white">
              <div className="mb-4 p-4 rounded-circle d-inline-flex align-items-center justify-content-center"
                   style={{ background: 'rgba(255,255,255,0.2)', width: '120px', height: '120px' }}>
                <i className="ri-shield-check-line" style={{ fontSize: '3rem' }}></i>
              </div>
              <h1 className="display-4 fw-bold mb-3">Advanced Security</h1>
              <p className="lead mb-4">Multi-layered protection with intelligent threat detection</p>
              <div className="d-flex justify-content-center gap-3">
                <Badge bg="light" text="dark" className="p-2">🔐 Encrypted</Badge>
                <Badge bg="light" text="dark" className="p-2">⚡ Instant</Badge>
                <Badge bg="light" text="dark" className="p-2">🛡️ Secure</Badge>
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
