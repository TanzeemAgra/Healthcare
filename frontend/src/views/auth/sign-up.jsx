import { useState, useEffect } from 'react';
import { Carousel, Form, Container, Row, Col, Alert, Card, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../store/auth/authSlice';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const generatePath = (path) => {
  const publicUrl = import.meta.env.VITE_PUBLIC_URL || '';
  return `${publicUrl}${path}`;
};

// Inner form component that uses the reCAPTCHA hook
const SignUpForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isLoading, isAuthenticated } = useSelector((state) => state.auth);
  const { executeRecaptcha } = useGoogleReCaptcha();

  // Check for payment verification data
  const paymentData = location.state?.paymentData;
  const customerInfo = location.state?.customerInfo;
  const hasPaymentVerification = paymentData && paymentData.payment_verified;

  // Get pre-selected role from navigation state
  const preSelectedRole = location.state?.selectedRole || '';

  const [formData, setFormData] = useState({
    full_name: customerInfo?.name || customerInfo?.full_name || '',
    username: '',
    email: customerInfo?.email || paymentData?.user_email || '',
    password: '',
    confirmPassword: '',
    role: preSelectedRole,
    licenseNumber: '',
    certification: '',
    specialization: '',
    phoneNumber: customerInfo?.phone || '',
    recaptchaToken: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [showRoleSpecificFields, setShowRoleSpecificFields] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
      return;
    }

    // Redirect to payment if no payment verification
    if (!hasPaymentVerification && !preSelectedRole) {
      // Only allow registration with payment verification or admin creation
      console.log('Redirecting to payment - no verification found');
      navigate('/', { 
        replace: true,
        state: { 
          message: 'Please select and pay for a subscription plan to create your account.' 
        }
      });
      return;
    }
  }, [isAuthenticated, navigate, hasPaymentVerification, preSelectedRole]);

  useEffect(() => {
    // Show role-specific fields if role is pre-selected
    if (preSelectedRole === 'doctor' || preSelectedRole === 'nurse') {
      setShowRoleSpecificFields(true);
    }
  }, [preSelectedRole]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Show role-specific fields when role is selected
    if (name === 'role') {
      setShowRoleSpecificFields(value === 'doctor' || value === 'nurse');
    }

    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    // Client-side validation
    const errors = {};

    if (!formData.full_name.trim()) errors.full_name = ['Full name is required'];
    if (!formData.email.trim()) errors.email = ['Email is required'];
    if (!formData.password) errors.password = ['Password is required'];
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = ['Passwords do not match'];
    }
    if (!formData.role) errors.role = ['Please select a role'];

    // reCAPTCHA v3 validation will be done during submission

    // Role-specific validation
    if (formData.role === 'doctor' && !formData.licenseNumber.trim()) {
      errors.licenseNumber = ['Medical license number is required for doctors'];
    }
    if (formData.role === 'nurse' && !formData.certification.trim()) {
      errors.certification = ['Certification is required for nurses'];
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Execute reCAPTCHA v3
    const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
    let recaptchaToken = '';

    if (
      recaptchaSiteKey &&
      recaptchaSiteKey !== 'your_recaptcha_site_key_here' &&
      executeRecaptcha
    ) {
      try {
        recaptchaToken = await executeRecaptcha('signup');
        if (!recaptchaToken) {
          setFormErrors({ recaptchaToken: ['reCAPTCHA verification failed. Please try again.'] });
          return;
        }
      } catch (error) {
        console.error('reCAPTCHA error:', error);
        setFormErrors({ recaptchaToken: ['reCAPTCHA verification failed. Please try again.'] });
        return;
      }
    }

    // Prepare registration data with reCAPTCHA token
    const registrationData = {
      ...formData,
      recaptchaToken: recaptchaToken,
    };

    dispatch(registerUser(registrationData))
      .unwrap()
      .then(() => {
        alert('User registered successfully! Please check your email for verification.');
        navigate('/login');
      })
      .catch((err) => {
        if (typeof err === 'object' && err !== null) {
          setFormErrors(err);
        } else {
          setFormErrors({ general: [err || 'Registration failed. Please try again.'] });
        }
        console.error('Registration failed:', err);
      });
  };

  return (
    <section className="sign-in-page d-md-flex align-items-center custom-auth-height">
      <Container className="sign-in-page-bg mt-5 mb-md-5 mb-0 p-0">
        <Row className="h-100">
          <Col md={6} className="text-center z-2">
            <div className="sign-in-detail text-white">
              <Link to="/" className="sign-in-logo mb-2">
                <img
                  src={generatePath('/assets/images/logo-white.png')}
                  className="img-fluid"
                  alt="Logo"
                />
              </Link>
              <Carousel interval={2000} controls={false}>
                <Carousel.Item>
                  <img
                    src={generatePath('/assets/images/login/1.png')}
                    className="d-block w-100"
                    alt="Slide 1"
                  />
                  <div className="carousel-caption-container">
                    <h4 className="text-white">Manage your orders</h4>
                    <p className="pb-5">Content distraction is real.</p>
                  </div>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    src={generatePath('/assets/images/login/2.png')}
                    className="d-block w-100"
                    alt="Slide 2"
                  />
                  <div className="carousel-caption-container">
                    <h4 className="mb-1 mt-3 text-white">Manage your orders</h4>
                    <p className="pb-5">
                      It is a long established fact that reader will be distracted by the readable
                      content.
                    </p>
                  </div>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    src={generatePath('/assets/images/login/3.png')}
                    className="d-block w-100"
                    alt="Slide 3"
                  />
                  <div className="carousel-caption-container">
                    <h4 className="text-white">Join Our Community</h4>
                    <p className="pb-5">Connect with healthcare professionals worldwide.</p>
                  </div>
                </Carousel.Item>
              </Carousel>
            </div>
          </Col>
          <Col md={6} className="position-relative d-flex align-items-center">
            <div className="sign-in-from d-flex flex-column justify-content-start py-3">
              <h1 className="mb-2" style={{ fontSize: '1.75rem' }}>
                Sign Up
              </h1>
              <Form className="mt-2" onSubmit={handleSubmit}>
                {hasPaymentVerification && (
                  <Alert variant="success" className="mb-3">
                    <Alert.Heading>🎉 Payment Verified!</Alert.Heading>
                    <p className="mb-0">
                      Your payment for <strong>{paymentData.plan_name}</strong> has been confirmed. 
                      Complete your account setup below to get started.
                    </p>
                  </Alert>
                )}

                {formErrors.general && (
                  <Alert variant="danger">
                    {Array.isArray(formErrors.general)
                      ? formErrors.general.join(', ')
                      : formErrors.general}
                  </Alert>
                )}

                <Form.Group className="form-group">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    isInvalid={!!formErrors.full_name}
                    className="mb-0"
                    placeholder="Enter your full name"
                  />
                  {formErrors.full_name && (
                    <div className="text-danger mt-1 small">{formErrors.full_name.join(', ')}</div>
                  )}
                </Form.Group>

                <Form.Group className="form-group">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!formErrors.email}
                    className="mb-0"
                    placeholder="Enter your email"
                  />
                  {formErrors.email && (
                    <div className="text-danger mt-1 small">{formErrors.email.join(', ')}</div>
                  )}
                </Form.Group>

                <Form.Group className="form-group">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    isInvalid={!!formErrors.password}
                    className="mb-0"
                    placeholder="Enter your password"
                  />
                  {formErrors.password && (
                    <div className="text-danger mt-1 small">{formErrors.password.join(', ')}</div>
                  )}
                </Form.Group>

                <Form.Group className="form-group">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    isInvalid={!!formErrors.confirmPassword}
                    className="mb-0"
                    placeholder="Confirm your password"
                  />
                  {formErrors.confirmPassword && (
                    <div className="text-danger mt-1 small">
                      {formErrors.confirmPassword.join(', ')}
                    </div>
                  )}
                </Form.Group>

                <Form.Group className="form-group">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    isInvalid={!!formErrors.role}
                    className="mb-0"
                  >
                    <option value="">Select your role</option>
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="nurse">Nurse</option>
                  </Form.Select>
                  {formErrors.role && (
                    <div className="text-danger mt-1 small">{formErrors.role.join(', ')}</div>
                  )}
                </Form.Group>

                {/* Role-specific fields */}
                {showRoleSpecificFields && formData.role === 'doctor' && (
                  <Form.Group className="form-group">
                    <Form.Label>Medical License Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      isInvalid={!!formErrors.licenseNumber}
                      className="mb-0"
                      placeholder="Enter your medical license number"
                    />
                    {formErrors.licenseNumber && (
                      <div className="text-danger mt-1 small">
                        {formErrors.licenseNumber.join(', ')}
                      </div>
                    )}
                  </Form.Group>
                )}

                {showRoleSpecificFields && formData.role === 'nurse' && (
                  <Form.Group className="form-group">
                    <Form.Label>Nursing Certification</Form.Label>
                    <Form.Control
                      type="text"
                      name="certification"
                      value={formData.certification}
                      onChange={handleChange}
                      isInvalid={!!formErrors.certification}
                      className="mb-0"
                      placeholder="Enter your nursing certification"
                    />
                    {formErrors.certification && (
                      <div className="text-danger mt-1 small">
                        {formErrors.certification.join(', ')}
                      </div>
                    )}
                  </Form.Group>
                )}

                {showRoleSpecificFields && (
                  <Form.Group className="form-group">
                    <Form.Label>Specialization</Form.Label>
                    <Form.Control
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      className="mb-0"
                      placeholder="Enter your specialization (optional)"
                    />
                  </Form.Group>
                )}

                <Form.Group className="form-group">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="mb-0"
                    placeholder="Enter your phone number"
                  />
                </Form.Group>

                {/* reCAPTCHA v3 runs invisibly in the background */}
                {formErrors.recaptchaToken && (
                  <div className="text-danger mt-2 small text-center">
                    {formErrors.recaptchaToken.join(', ')}
                  </div>
                )}

                <div className="d-flex justify-content-between w-100 align-items-center mt-2">
                  <label className="d-inline-block form-group mb-0 d-flex">
                    <input type="checkbox" className="custom-control-input" required />{' '}
                    <label className="custom-control-label ms-1">
                      {' '}
                      I accept
                      <Link className="ms-1" to="/terms">
                        Terms & Conditions
                      </Link>
                    </label>
                  </label>
                </div>

                <div className="mt-2">
                  <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Sign Up'}
                  </button>
                </div>

                <div className="full-width d-flex justify-content-center align-items-center mt-3">
                  <span>Already have an account?</span>
                  <Link to="/login" className="text-primary ms-2">
                    Sign In
                  </Link>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

// Wrapper component with reCAPTCHA provider
const SignUp = () => {
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  if (!siteKey || siteKey === 'your_recaptcha_site_key_here') {
    // If no reCAPTCHA key, render form without provider
    return <SignUpForm />;
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={siteKey}>
      <SignUpForm />
    </GoogleReCaptchaProvider>
  );
};

export default SignUp;
