import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card, InputGroup } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { loginUser } from '../../store/auth/authSlice';
import subscriptionService from '../../services/subscriptionService';
import '../../styles/ModernSignIn.css';

const generatePath = (path) => {
  const publicUrl = import.meta.env.VITE_PUBLIC_URL || '';
  return `${publicUrl}${path}`;
};

// Inner form component that uses the reCAPTCHA hook
const ModernSignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isLoading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  // Role-based dashboard mapping
  const getRoleBaseDashboard = (role) => {
    switch (role) {
      case 'doctor':
        return '/SecureNeat/dashboard';
      case 'nurse':
        return '/dashboard-pages/patient-dashboard';
      case 'patient':
        return '/dashboard-pages/patient-dashboard';
      case 'pharmacist':
        return '/dashboard';
      case 'admin':
        return '/dashboard';
      default:
        return '/dashboard';
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      const selectedPlan =
        location.state?.selectedPlan || JSON.parse(localStorage.getItem('selectedPlan') || 'null');
      const selectedPlanId = location.state?.planId || localStorage.getItem('selectedPlanId');
      const returnToPayment = location.state?.returnToPayment;

      if (returnToPayment && selectedPlan && selectedPlanId) {
        navigate('/checkout', {
          state: {
            selectedPlan,
            planId: selectedPlanId,
            fromLogin: true
          }
        });
      } else {
        const userRole = user.role;
        const dashboard = getRoleBaseDashboard(userRole);
        navigate(dashboard);
      }
    }
  }, [isAuthenticated, user, navigate, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let recaptchaToken = null;
    // Only try to use reCAPTCHA if it's properly configured
    if (executeRecaptcha) {
      try {
        recaptchaToken = await executeRecaptcha('login');
        if (!recaptchaToken) {
          console.warn('reCAPTCHA verification failed, but continuing with login...');
        }
      } catch (error) {
        console.warn('reCAPTCHA error, but continuing with login:', error);
        // Don't block login for reCAPTCHA errors in development
      }
    } else {
      console.log('reCAPTCHA not configured, proceeding without it');
    }

    const loginData = { email, password };
    if (recaptchaToken) {
      loginData.recaptcha_token = recaptchaToken;
    }

    console.log('Attempting login with:', { email, hasPassword: !!password, hasRecaptcha: !!recaptchaToken });
    
    dispatch(loginUser(loginData))
      .unwrap()
      .then((response) => {
        console.log('Login success response:', response);
        const userRole = response.user?.role;
        const dashboard = getRoleBaseDashboard(userRole);
        console.log('Redirecting to:', dashboard);
        navigate(dashboard);
      })
      .catch((err) => {
        console.error('Login failed - detailed error:', JSON.stringify(err));
      });
  };

  return (
    <div 
      className="min-vh-100 d-flex align-items-center justify-content-center gradient-background"
      style={{ padding: '20px' }}
    >
      <Container className="modern-signin-container">
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <Card 
              className="shadow-lg border-0 modern-card"
              style={{ 
                borderRadius: '20px',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)'
              }}
            >
              {/* Header Section */}
              <div 
                className="text-center p-4"
                style={{
                  background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                  color: 'white'
                }}
              >
                <div className="mb-3">
                  <div 
                    className="rounded-circle mx-auto d-flex align-items-center justify-content-center"
                    style={{
                      width: '80px',
                      height: '80px',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <i className="ri-hospital-line" style={{ fontSize: '2.5rem' }}></i>
                  </div>
                </div>
                <h2 className="fw-bold mb-2">Welcome Back</h2>
                <p className="mb-0 opacity-90">Sign in to your SecureNeat account</p>
              </div>

              <Card.Body className="p-5">
                {/* Error Alert */}
                {error && (
                  <Alert 
                    variant="danger" 
                    className="mb-4"
                    style={{ borderRadius: '12px', border: 'none' }}
                  >
                    <i className="ri-error-warning-line me-2"></i>
                    {typeof error === 'string'
                      ? error
                      : error.detail || 'Login failed. Please check your credentials.'}
                  </Alert>
                )}

                {/* Social Login Buttons */}
                <div className="mb-4">
                  <div className="row g-2">
                    <div className="col-6">
                      <Button 
                        variant="outline-primary" 
                        className="w-100 d-flex align-items-center justify-content-center py-2 social-button"
                        style={{ borderRadius: '12px' }}
                      >
                        <i className="ri-google-fill me-2" style={{ color: '#4285F4' }}></i>
                        Google
                      </Button>
                    </div>
                    <div className="col-6">
                      <Button 
                        variant="outline-dark" 
                        className="w-100 d-flex align-items-center justify-content-center py-2 social-button"
                        style={{ borderRadius: '12px' }}
                      >
                        <i className="ri-microsoft-fill me-2" style={{ color: '#00A4EF' }}></i>
                        Microsoft
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-center my-3">
                    <span className="text-muted">or continue with email</span>
                  </div>
                </div>

                {/* Login Form */}
                <Form onSubmit={handleSubmit}>
                  {/* Email Field */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Email Address</Form.Label>
                    <InputGroup>
                      <InputGroup.Text 
                        style={{ 
                          borderRadius: '12px 0 0 12px',
                          backgroundColor: '#f8f9fa',
                          border: '1px solid #dee2e6'
                        }}
                      >
                        <i className="ri-mail-line text-muted"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="modern-input"
                        style={{ 
                          borderRadius: '0 12px 12px 0',
                          border: '1px solid #dee2e6',
                          padding: '12px 16px'
                        }}
                      />
                    </InputGroup>
                  </Form.Group>

                  {/* Password Field */}
                  <Form.Group className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <Form.Label className="fw-semibold mb-0">Password</Form.Label>
                      <Link 
                        to="/auth/recover-password" 
                        className="text-decoration-none small"
                        style={{ color: '#007bff' }}
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <InputGroup>
                      <InputGroup.Text 
                        style={{ 
                          borderRadius: '12px 0 0 12px',
                          backgroundColor: '#f8f9fa',
                          border: '1px solid #dee2e6'
                        }}
                      >
                        <i className="ri-lock-line text-muted"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="modern-input"
                        style={{ 
                          border: '1px solid #dee2e6',
                          padding: '12px 16px'
                        }}
                      />
                      <InputGroup.Text 
                        style={{ 
                          borderRadius: '0 12px 12px 0',
                          backgroundColor: '#f8f9fa',
                          border: '1px solid #dee2e6',
                          cursor: 'pointer'
                        }}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} style={{ color: '#6c757d' }}></i>
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>

                  {/* Remember Me */}
                  <Form.Group className="mb-4">
                    <Form.Check
                      type="checkbox"
                      id="rememberMe"
                      label="Remember me for 30 days"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="user-select-none"
                    />
                  </Form.Group>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-100 mb-3 modern-button"
                    size="lg"
                    disabled={isLoading}
                    style={{
                      background: 'linear-gradient(135deg, #007bff, #0056b3)',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '12px',
                      fontWeight: '600',
                      boxShadow: '0 4px 15px rgba(0, 123, 255, 0.3)'
                    }}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Signing In...
                      </>
                    ) : (
                      <>
                        <i className="ri-login-circle-line me-2"></i>
                        Sign In
                      </>
                    )}
                  </Button>

                  {/* Sign Up Link */}
                  <div className="text-center">
                    <p className="mb-0 text-muted">
                      Don't have an account?{' '}
                      <Link 
                        to="/modern-signup" 
                        className="text-decoration-none fw-semibold"
                        style={{ color: '#007bff' }}
                      >
                        Create Account
                      </Link>
                    </p>
                  </div>
                </Form>
              </Card.Body>

              {/* Footer */}
              <div 
                className="text-center p-3"
                style={{ backgroundColor: '#f8f9fa', borderTop: '1px solid #e9ecef' }}
              >
                <small className="text-muted">
                  Protected by SecureNeat Security • <Link to="/extra-pages/privacy-policy" className="text-decoration-none">Privacy Policy</Link>
                </small>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Additional Features */}
        <Row className="justify-content-center mt-4">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <div className="text-center">
              <div className="row g-3">
                <div className="col-4">
                  <div 
                    className="p-3 rounded-3 text-white feature-card"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}
                  >
                    <i className="ri-shield-check-line mb-2" style={{ fontSize: '1.5rem' }}></i>
                    <small className="d-block">Secure Login</small>
                  </div>
                </div>
                <div className="col-4">
                  <div 
                    className="p-3 rounded-3 text-white feature-card"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}
                  >
                    <i className="ri-time-line mb-2" style={{ fontSize: '1.5rem' }}></i>
                    <small className="d-block">24/7 Access</small>
                  </div>
                </div>
                <div className="col-4">
                  <div 
                    className="p-3 rounded-3 text-white feature-card"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}
                  >
                    <i className="ri-global-line mb-2" style={{ fontSize: '1.5rem' }}></i>
                    <small className="d-block">Global Access</small>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Background Animation */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          opacity: 0.1
        }}
      >
        <div 
          className="position-absolute floating-element"
          style={{
            top: '10%',
            left: '10%',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)'
          }}
        ></div>
        <div 
          className="position-absolute floating-element"
          style={{
            top: '60%',
            right: '15%',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)'
          }}
        ></div>
        <div 
          className="position-absolute floating-element"
          style={{
            bottom: '20%',
            left: '20%',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)'
          }}
        ></div>
      </div>
    </div>
  );
};

// Wrapper component with reCAPTCHA provider
const ModernSignIn = () => {
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  // If no reCAPTCHA site key is configured, render without reCAPTCHA
  if (!siteKey || siteKey === 'your_recaptcha_site_key_here' || siteKey === 'undefined') {
    console.log('reCAPTCHA not configured, running without reCAPTCHA protection');
    return <ModernSignInForm />;
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={siteKey}>
      <ModernSignInForm />
    </GoogleReCaptchaProvider>
  );
};

export default ModernSignIn;
