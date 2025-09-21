import { useState, useEffect } from 'react';
import { Carousel, Container, Row, Col, Form, FormControl, Alert } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/auth/authSlice';
import subscriptionService from '../../services/subscriptionService';

const generatePath = (path) => {
  // Ensure PUBLIC_URL is considered if your app is not at the root in production
  const publicUrl = import.meta.env.VITE_PUBLIC_URL || '';
  return `${publicUrl}${path}`;
};

// Main sign-in component
const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // No reCAPTCHA for now
  const executeRecaptcha = null;

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
    // Add a small delay to ensure component is fully mounted
    const timer = setTimeout(() => {
      if (isAuthenticated && user) {
        // Check if user came from payment flow
        const selectedPlan =
          location.state?.selectedPlan || JSON.parse(localStorage.getItem('selectedPlan') || 'null');
        const selectedPlanId = location.state?.planId || localStorage.getItem('selectedPlanId');
        const returnToPayment = location.state?.returnToPayment;

        if (selectedPlan && returnToPayment) {
          // Clear stored plan data
          localStorage.removeItem('selectedPlan');
          localStorage.removeItem('selectedPlanId');

          // Proceed directly to payment
          const createPayment = async () => {
            try {
              const { data, error } = await subscriptionService.createPaymentLink(
                parseInt(selectedPlanId)
              );
              if (data && data.payment_link) {
                window.location.href = data.payment_link;
              } else {
                console.error('Payment creation failed:', error);
                navigate('/subscription', {
                  state: { selectedPlan, error: 'Failed to create payment' },
                });
              }
            } catch (err) {
              console.error('Payment error:', err);
              navigate('/subscription', { state: { selectedPlan, error: 'Payment system error' } });
            }
          };

          createPayment();
        } else {
          // Normal role-based redirect
          const dashboard = getRoleBaseDashboard(user.role);
          navigate(dashboard);
        }
      }
    }, 100); // 100ms delay
    
    return () => clearTimeout(timer);
  }, [isAuthenticated, user, navigate, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Execute reCAPTCHA v3
    const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
    let recaptchaToken = '';

    if (
      recaptchaSiteKey &&
      recaptchaSiteKey !== 'your_recaptcha_site_key_here' &&
      executeRecaptcha
    ) {
      try {
        recaptchaToken = await executeRecaptcha('signin');
        if (!recaptchaToken) {
          alert('reCAPTCHA verification failed. Please try again.');
          return;
        }
      } catch (error) {
        console.error('reCAPTCHA error:', error);
        alert('reCAPTCHA verification failed. Please try again.');
        return;
      }
    }

    // Include recaptcha token only if configured
    const loginData = { email, password };
    if (recaptchaToken) {
      loginData.recaptcha_token = recaptchaToken;
    }

    console.log('Attempting login with:', { email, hasPassword: !!password, hasRecaptcha: !!recaptchaToken });
    
    console.log('Login data being sent:', loginData);
    dispatch(loginUser(loginData))
      .unwrap()
      .then((response) => {
        console.log('Login success response:', response);
        // Redirect to role-specific dashboard
        const userRole = response.user?.role;
        const dashboard = getRoleBaseDashboard(userRole);
        console.log('Redirecting to:', dashboard);
        navigate(dashboard);
      })
      .catch((err) => {
        // Error is already handled by the slice and stored in `error`
        console.error('Login failed - detailed error:', JSON.stringify(err));
      });
  };

  return (
    <>
      <section className="sign-in-page d-md-flex align-items-center custom-auth-height">
        <Container className="sign-in-page-bg mt-5 mb-md-5 mb-0 p-0">
          <Row>
            <Col md={6} className="text-center z-2">
              <div className="sign-in-detail text-white">
                <Link to="/" className="sign-in-logo mb-2">
                  <img
                    src={generatePath('/assets/images/logo-white.png')}
                    className="img-fluid"
                    alt="Logo"
                  />
                </Link>
                <Carousel id="carouselExampleCaptions" interval={4000} controls={false}>
                  <Carousel.Item>
                    <img
                      src={generatePath('/assets/images/Screenshot_2.png')}
                      className="d-block w-100"
                      alt="Healthcare Dashboard"
                      style={{ objectFit: 'cover', height: '400px' }}
                    />
                    <div className="carousel-caption-container">
                      <h4 className="mb-1 mt-3 text-white">Complete Healthcare Solution</h4>
                      <p className="pb-5">
                        Manage patient data, track treatments, and monitor health outcomes with our
                        comprehensive AI-powered platform.
                      </p>
                    </div>
                  </Carousel.Item>
                  <Carousel.Item>
                    <img
                      src={generatePath('/assets/images/Screenshot_2.png')}
                      className="d-block w-100"
                      alt="SecureNeat AI Tools"
                      style={{ objectFit: 'cover', height: '400px' }}
                    />
                    <div className="carousel-caption-container">
                      <h4 className="mb-1 mt-3 text-white">AI-Powered Medical Tools</h4>
                      <p className="pb-5">
                        Access Dr. Max AI chatbot, intelligent MCQ generators, and advanced medical
                        analytics for enhanced patient care.
                      </p>
                    </div>
                  </Carousel.Item>
                  <Carousel.Item>
                    <img
                      src={generatePath('/assets/images/Screenshot_2.png')}
                      className="d-block w-100"
                      alt="Radiology Suite"
                      style={{ objectFit: 'cover', height: '400px' }}
                    />
                    <div className="carousel-caption-container">
                      <h4 className="mb-1 mt-3 text-white">Advanced Radiology Analysis</h4>
                      <p className="pb-5">
                        Leverage AI-powered radiology report analysis and secure document management
                        for improved diagnostic accuracy.
                      </p>
                    </div>
                  </Carousel.Item>
                </Carousel>
              </div>
            </Col>

            <Col md={6} className="position-relative z-2">
              <div className="sign-in-from d-flex flex-column justify-content-center">
                <h1 className="mb-0">Sign In</h1>
                <Form className="mt-4" onSubmit={handleSubmit}>
                  <p>Enter your email address and password to access admin panel.</p>
                  {error && (
                    <Alert variant="danger">
                      {typeof error === 'string'
                        ? error
                        : error.detail || 'Login failed. Please check your credentials.'}
                    </Alert>
                  )}
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Email Address</label>
                    <FormControl
                      type="email"
                      className="form-control"
                      id="exampleInputEmail1"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="d-flex justify-content-between form-group mb-0">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <Link to="/auth/recover-password" className="float-end">
                      Forgot Password?
                    </Link>
                  </div>
                  <Form.Control
                    type="password"
                    id="exampleInputPassword1"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  {/* reCAPTCHA v3 runs invisibly in the background */}

                  <div className="d-flex w-100 justify-content-between align-items-center mt-3">
                    <label className="d-inline-block form-group mb-0 d-flex">
                      <input
                        type="checkbox"
                        id="customCheck1"
                        className="custom-control-input me-1"
                        onChange={(e) => {/* handle checkbox change */}}
                      />
                      <label className="custom-control-label" htmlFor="customCheck1">
                        Remember Me
                      </label>
                    </label>
                    <button
                      type="submit"
                      className="btn btn-primary-subtle float-end"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                  </div>

                  <div className="sign-info d-flex justify-content-between flex-column flex-lg-row align-items-center">
                    <span className="dark-color d-inline-block line-height-2">
                      Don&apos;t have an account? <Link to="/auth/sign-up">Sign Up</Link>
                    </span>
                    <ul className="auth-social-media">
                      <li>
                        <a href="#">
                          <i className="ri-facebook-box-line"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="ri-twitter-line"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="ri-instagram-line"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default SignIn;
