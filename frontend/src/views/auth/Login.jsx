import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge, InputGroup } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../../contexts/PermissionContext';
import { HEALTHCARE_MODULES } from '../../utils/modulePermissions'; // Import dynamic modules
import FirstLoginSetup from '../../components/FirstLoginSetup';
import apiClient from '../../services/api';
import { AUTH_ENDPOINTS, buildApiUrl } from '../../services/apiConstants';
import { 
  RiLoginBoxLine,
  RiEyeLine,
  RiEyeOffLine,
  RiMailLine,
  RiLockLine,
  RiShieldCheckLine,
  RiCheckboxCircleLine
} from '@remixicon/react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user } = useAuth();
  const { refreshPermissions } = usePermissions();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [redirecting, setRedirecting] = useState(false);
  const [adminSequence, setAdminSequence] = useState(''); // For admin access
  const [showFirstLoginSetup, setShowFirstLoginSetup] = useState(false);
  const [firstLoginEmail, setFirstLoginEmail] = useState('');
  const hasRedirected = useRef(false);

  // Role-based dashboard mapping
  const getRoleBaseDashboard = useCallback((role) => {
    switch (role) {
      case 'super_admin':
        return '/admin/dashboard';
      case 'admin':
        return '/admin/dashboard';
      case 'doctor':
        return '/SecureNeat/dashboard';
      case 'nurse':
        return '/dashboard-pages/patient-dashboard';
      case 'patient':
        return '/dashboard-pages/patient-dashboard';
      case 'pharmacist':
        return '/dashboard';
      default:
        return '/dashboard';
    }
  }, []);

  // Handle redirects in useEffect to avoid rendering issues
  useEffect(() => {
    if (isAuthenticated && user && !hasRedirected.current) {
      console.log('User authenticated, initiating redirect...', user.role);
      hasRedirected.current = true;
      setRedirecting(true);
      
      // Check if user came from payment flow
      const selectedPlan = location.state?.selectedPlan || JSON.parse(localStorage.getItem('selectedPlan') || 'null');
      const returnToPayment = location.state?.returnToPayment;

      setTimeout(() => {
        if (returnToPayment && selectedPlan) {
          // Redirect back to payment
          navigate('/subscription/payment', {
            state: { selectedPlan },
            replace: true
          });
        } else {
          // Redirect to role-based dashboard
          const redirectTo = location.state?.from?.pathname || getRoleBaseDashboard(user.role);
          console.log('Redirecting to:', redirectTo);
          
          // Force redirect using window.location to ensure it works
          window.location.href = redirectTo;
        }
      }, 100);
    }
  }, [isAuthenticated, user, location.state, navigate, getRoleBaseDashboard]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    console.log('=== LOGIN FORM SUBMIT ===');
    console.log('Email:', formData.email);
    console.log('Password length:', formData.password.length);

    try {
      // First check if this user needs first login setup
      console.log('=== CHECKING FIRST LOGIN STATUS ===');
      try {
        const firstLoginResponse = await apiClient.post(buildApiUrl(AUTH_ENDPOINTS.CHECK_FIRST_LOGIN), {
          email: formData.email
        });

        if (firstLoginResponse.data.success && firstLoginResponse.data.needs_first_login_setup) {
          console.log('User needs first login setup');
          
          // Verify current password before showing setup
          const tempAuthResult = await login(formData.email, formData.password);
          if (tempAuthResult.success) {
            // Password is correct, show first login setup
            setFirstLoginEmail(formData.email);
            setShowFirstLoginSetup(true);
            setLoading(false);
            return;
          } else {
            setError(tempAuthResult.error || 'Invalid credentials');
            setLoading(false);
            return;
          }
        }
      } catch (firstLoginError) {
        console.log('First login check failed, proceeding with normal login:', firstLoginError.response?.data?.error);
        // If first login check fails, continue with normal login
        // This handles cases where user doesn't exist or API is unavailable
      }

      // Normal login flow
      const result = await login(formData.email, formData.password);
      
      console.log('=== LOGIN RESULT ===');
      console.log('Success:', result.success);
      console.log('User:', result.user);
      
      if (result.success) {
        console.log('Login successful for user:', result.user.role);
        setSuccess('Login successful! Redirecting...');
        hasRedirected.current = true; // Mark that we're handling redirect
        setRedirecting(true); // Set redirecting flag
        
        // 🔥 CRITICAL FIX: Refresh permissions after login
        console.log('=== REFRESHING PERMISSIONS AFTER LOGIN ===');
        try {
          await refreshPermissions();
          console.log('✅ Permissions refreshed successfully');
        } catch (permError) {
          console.error('⚠️ Permission refresh failed:', permError);
          // Continue with login even if permissions fail - they can be refreshed later
        }
        
        console.log('=== REDIRECT LOGIC ===');
        
        // Check if user came from payment flow
        const selectedPlan = location.state?.selectedPlan || JSON.parse(localStorage.getItem('selectedPlan') || 'null');
        const returnToPayment = location.state?.returnToPayment;

        console.log('Selected plan:', selectedPlan);
        console.log('Return to payment:', returnToPayment);

        if (returnToPayment && selectedPlan) {
          // Redirect back to payment
          console.log('Redirecting to payment...');
          navigate('/subscription/payment', {
            state: { selectedPlan },
            replace: true
          });
        } else {
          // Redirect based on user role and location state
          const redirectTo = location.state?.from?.pathname || getRoleBaseDashboard(result.user.role);
          console.log('Final redirect destination:', redirectTo);
          
          // Add a small delay to ensure state is updated and user sees success message
          setTimeout(() => {
            console.log('Executing navigation to:', redirectTo);
            // Force redirect using window.location to ensure it works
            window.location.href = redirectTo;
          }, 800);
        }
      } else {
        console.log('Login failed:', result.error);
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle first login setup success
  const handleFirstLoginSuccess = async (result) => {
    setSuccess(result.message);
    setShowFirstLoginSetup(false);
    setFirstLoginEmail('');
    
    // After successful first login setup, proceed with normal login flow
    setTimeout(async () => {
      try {
        const loginResult = await login(formData.email, formData.password);
        if (loginResult.success) {
          // Refresh permissions
          try {
            await refreshPermissions();
          } catch (permError) {
            console.error('Permission refresh failed:', permError);
          }
          
          // Redirect to appropriate dashboard
          const redirectTo = location.state?.from?.pathname || getRoleBaseDashboard(loginResult.user.role);
          window.location.href = redirectTo;
        }
      } catch (error) {
        console.error('Post-setup login error:', error);
        setError('Setup completed but login failed. Please try logging in again.');
      }
    }, 1500);
  };

  // Handle first login setup cancellation
  const handleFirstLoginCancel = () => {
    setShowFirstLoginSetup(false);
    setFirstLoginEmail('');
    setFormData({ email: '', password: '' });
    setError('');
    setSuccess('');
  };

  // Super admin credentials (hidden from UI but still functional)
  const SUPER_ADMIN_EMAIL = 'mastermind@xerxez.com';
  const SUPER_ADMIN_PASSWORD = 'Tanzilla@tanzeem786';

  // Handle special admin access sequence (Alt + Shift + A)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.shiftKey && e.key === 'A') {
        setFormData({
          email: SUPER_ADMIN_EMAIL,
          password: SUPER_ADMIN_PASSWORD
        });
        setSuccess('🔑 Super Admin credentials loaded');
        setTimeout(() => setSuccess(''), 3000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // If first login setup is needed, show the setup component
  if (showFirstLoginSetup) {
    return (
      <FirstLoginSetup
        email={firstLoginEmail}
        onSuccess={handleFirstLoginSuccess}
        onCancel={handleFirstLoginCancel}
      />
    );
  }

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative'
    }}>
      {/* Background Pattern */}
      <div 
        className="position-absolute w-100 h-100" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}
      />
      
      <Container className="position-relative">
        <Row className="justify-content-center">
          <Col lg={5} md={7}>
            <Card className="shadow-lg border-0" style={{ backdropFilter: 'blur(10px)', background: 'rgba(255, 255, 255, 0.95)' }}>
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div className="d-flex justify-content-center mb-3">
                    <div className="bg-primary bg-gradient rounded-circle p-3">
                      <RiLoginBoxLine size={32} className="text-white" />
                    </div>
                  </div>
                  <h2 className="fw-bold text-primary mb-2">Healthcare Portal</h2>
                  <p className="text-muted">Sign in to access your healthcare modules</p>
                </div>

                {error && (
                  <Alert variant="danger" className="mb-4">
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert variant="success" className="mb-4">
                    <RiCheckboxCircleLine size={16} className="me-2" />
                    {success}
                  </Alert>
                )}

                {/* Professional Healthcare Platform Notice */}
                <Alert variant="light" className="mb-4 border-0 bg-gradient" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
                  <div className="text-center">
                    <RiShieldCheckLine size={20} className="text-primary mb-2" />
                    <div className="fw-bold text-primary">Healthcare Management Platform</div>
                    <small className="text-muted">Secure access to your healthcare modules</small>
                  </div>
                </Alert>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Email Address</Form.Label>
                    <div className="position-relative">
                      <RiMailLine size={16} className="position-absolute top-50 translate-middle-y ms-3 text-muted" style={{ zIndex: 1 }} />
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData?.email || ''}
                        onChange={handleChange}
                        placeholder="Enter your registered email"
                        style={{ paddingLeft: '40px' }}
                        className="py-3 border-2"
                        required
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Password</Form.Label>
                    <div className="position-relative">
                      <RiLockLine size={16} className="position-absolute top-50 translate-middle-y ms-3 text-muted" style={{ zIndex: 1 }} />
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData?.password || ''}
                        onChange={handleChange}
                        placeholder="Enter your secure password"
                        style={{ paddingLeft: '40px', paddingRight: '40px' }}
                        className="py-3 border-2"
                        required
                      />
                      <Button
                        variant="link"
                        className="position-absolute top-50 translate-middle-y end-0 me-2 p-0 border-0 text-muted"
                        style={{ zIndex: 1 }}
                        onClick={() => setShowPassword(!showPassword)}
                        type="button"
                      >
                        {showPassword ? <RiEyeOffLine size={16} /> : <RiEyeLine size={16} />}
                      </Button>
                    </div>
                  </Form.Group>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check
                      type="checkbox"
                      id="remember-me"
                      label="Keep me signed in"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="fw-semibold"
                    />
                    <Link to="/auth/recover-password" className="text-decoration-none fw-semibold text-primary">
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-100 py-3 fw-bold"
                    style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)' }}
                    disabled={loading || redirecting}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Authenticating...
                      </>
                    ) : redirecting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Redirecting...
                      </>
                    ) : (
                      <>
                        <RiLoginBoxLine size={16} className="me-2" />
                        Sign In Securely
                      </>
                    )}
                  </Button>
                </Form>

                <div className="text-center mt-4 pt-3 border-top">
                  <span className="text-muted">Need help accessing your account? </span>
                  <Link to="/contact" className="text-decoration-none fw-bold">
                    Contact Support
                  </Link>
                </div>

                {/* Healthcare Modules Info */}
                <div className="mt-4 p-3 rounded" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
                  <div className="text-center">
                    <h6 className="fw-bold text-primary mb-2">
                      Available Healthcare Modules
                    </h6>
                    <div className="row g-2 text-center">
                      {Object.entries(HEALTHCARE_MODULES).map(([key, module], index) => (
                        <div key={key} className="col-4">
                          <Badge 
                            bg="light" 
                            text="dark" 
                            className="w-100 py-2" 
                            style={{ fontSize: '0.7rem' }}
                          >
                            {module.name}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <small className="text-muted d-block mt-2">
                      Access modules based on your subscription plan
                    </small>
                  </div>
                </div>

                {/* Subtle admin hint */}
                <div className="text-center mt-3">
                  <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                    System administrators: Use keyboard shortcuts for quick access
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
