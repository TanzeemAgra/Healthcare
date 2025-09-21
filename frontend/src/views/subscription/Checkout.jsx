import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
  InputGroup,
} from 'react-bootstrap';
import { Shield, CreditCard, Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import subscriptionService from '../../services/subscriptionService';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { plan, planId } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
  });

  // Redirect back if no plan data
  useEffect(() => {
    if (!plan || !planId) {
      navigate('/');
    }
  }, [plan, planId, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const { email, name, phone } = formData;

    if (!email || !name || !phone) {
      setError('Please fill in all required fields');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Basic phone validation (10+ digits)
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(phone)) {
      setError('Please enter a valid phone number');
      return false;
    }

    return true;
  };

  const createOrder = async () => {
    try {
      setLoading(true);
      setError('');

      if (!validateForm()) {
        setLoading(false);
        return;
      }

      // Call backend to create Razorpay order
      const { data, error } = await subscriptionService.createRazorpayOrder(planId, formData.email);

      if (error) {
        throw new Error(error);
      }

      setOrderData(data);

      // Initialize Razorpay checkout
      initializeRazorpayCheckout(data);
    } catch (err) {
      console.error('Error creating order:', err);
      setError(err.message || 'Failed to create payment order');
    } finally {
      setLoading(false);
    }
  };

  const initializeRazorpayCheckout = (orderData) => {
    const options = {
      key: orderData.key,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Xerxez Healthcare Solutions',
      description: `${orderData.plan_name} Subscription`,
      image: '/assets/images/brand-logos/favicon.ico', // Add your logo here
      order_id: orderData.order_id,
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      notes: {
        plan_id: orderData.plan_id,
        plan_name: orderData.plan_name,
      },
      theme: {
        color: '#2563eb', // Your brand color
      },
      handler: async function (response) {
        await handlePaymentSuccess(response, orderData);
      },
      modal: {
        ondismiss: function () {
          setError('Payment was cancelled. Please try again.');
          setLoading(false);
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handlePaymentSuccess = async (paymentResponse, orderData) => {
    try {
      setLoading(true);
      setError('');

      // Verify payment with backend
      const { data: verifyData, error: verifyError } = await subscriptionService.verifyPayment({
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        email: formData.email,
        plan_id: orderData.plan_id,
      });

      if (verifyError) {
        throw new Error(verifyError);
      }

      // Store payment data in localStorage for account creation
      localStorage.setItem('paymentVerification', JSON.stringify(verifyData));
      localStorage.setItem('customerInfo', JSON.stringify(formData));

      setSuccess('Payment successful! Redirecting to account creation...');

      // Redirect to success page or account creation
      setTimeout(() => {
        navigate('/subscription/payment-success', {
          state: {
            paymentData: verifyData,
            customerInfo: formData,
          },
        });
      }, 2000);
    } catch (err) {
      console.error('Error verifying payment:', err);
      setError(err.message || 'Payment verification failed');
      setLoading(false);
    }
  };

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!plan) {
    return null;
  }

  return (
    <div className="page-wrapper">
      <Container fluid className="py-5" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        <Container>
          <Row className="justify-content-center">
            <Col lg={10} xl={8}>
              {/* Header */}
              <div className="text-center mb-5">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => navigate('/')}
                  className="mb-3"
                >
                  <ArrowLeft size={16} className="me-1" />
                  Back to Plans
                </Button>
                <h2 className="fw-bold text-dark mb-2">Complete Your Purchase</h2>
                <p className="text-muted">Secure checkout powered by Razorpay</p>
              </div>

              <Row>
                {/* Order Summary */}
                <Col lg={5} className="mb-4">
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body className="p-4">
                      <h5 className="fw-bold text-dark mb-4">Order Summary</h5>

                      <div
                        className="border rounded-3 p-3 mb-4"
                        style={{ backgroundColor: '#f1f5f9' }}
                      >
                        <div className="d-flex align-items-center mb-2">
                          <div className="bg-primary rounded-circle p-2 me-3">
                            <Shield size={20} className="text-white" />
                          </div>
                          <div>
                            <h6 className="fw-bold mb-0 text-dark">{plan.name}</h6>
                            <small className="text-muted">Healthcare Platform Access</small>
                          </div>
                        </div>
                        <p className="text-muted small mb-0">{plan.description}</p>
                      </div>

                      {/* Plan Features */}
                      <div className="mb-4">
                        <h6 className="fw-semibold text-dark mb-3">What's Included:</h6>
                        <ul className="list-unstyled">
                          {plan.name === 'SecureNeat' && (
                            <>
                              <li className="d-flex align-items-center mb-2">
                                <CheckCircle size={16} className="text-success me-2" />
                                <small>Dr. Max AI Chatbot</small>
                              </li>
                              <li className="d-flex align-items-center mb-2">
                                <CheckCircle size={16} className="text-success me-2" />
                                <small>Intelligent MCQ Generator</small>
                              </li>
                              <li className="d-flex align-items-center mb-2">
                                <CheckCircle size={16} className="text-success me-2" />
                                <small>OSCE Practice Tool</small>
                              </li>
                            </>
                          )}
                          {plan.name === 'Radiology' && (
                            <>
                              <li className="d-flex align-items-center mb-2">
                                <CheckCircle size={16} className="text-success me-2" />
                                <small>Radiology Report Analysis</small>
                              </li>
                              <li className="d-flex align-items-center mb-2">
                                <CheckCircle size={16} className="text-success me-2" />
                                <small>Data Anonymization Tool</small>
                              </li>
                            </>
                          )}
                          {plan.name === 'Full Admin Access' && (
                            <>
                              <li className="d-flex align-items-center mb-2">
                                <CheckCircle size={16} className="text-success me-2" />
                                <small>All SecureNeat Features</small>
                              </li>
                              <li className="d-flex align-items-center mb-2">
                                <CheckCircle size={16} className="text-success me-2" />
                                <small>All Radiology Features</small>
                              </li>
                              <li className="d-flex align-items-center mb-2">
                                <CheckCircle size={16} className="text-success me-2" />
                                <small>Admin Dashboard</small>
                              </li>
                              <li className="d-flex align-items-center mb-2">
                                <CheckCircle size={16} className="text-success me-2" />
                                <small>Priority Support</small>
                              </li>
                            </>
                          )}
                        </ul>
                      </div>

                      {/* Pricing */}
                      <div className="border-top pt-3">
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted">Subscription (Monthly)</span>
                          <span className="fw-semibold">
                            {plan.currency}
                            {plan.price}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span className="fw-bold text-dark">Total</span>
                          <span className="fw-bold text-dark h5">
                            {plan.currency}
                            {plan.price}
                          </span>
                        </div>
                      </div>

                      {/* Security Badge */}
                      <div className="mt-4 p-3 rounded-3" style={{ backgroundColor: '#ecfdf5' }}>
                        <div className="d-flex align-items-center">
                          <Lock size={16} className="text-success me-2" />
                          <small className="text-success fw-semibold">
                            Secured by 256-bit SSL encryption
                          </small>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Checkout Form */}
                <Col lg={7}>
                  <Card className="border-0 shadow-sm">
                    <Card.Body className="p-4">
                      <h5 className="fw-bold text-dark mb-4">
                        <CreditCard size={20} className="me-2" />
                        Payment Information
                      </h5>

                      {error && (
                        <Alert variant="danger" className="mb-4">
                          {error}
                        </Alert>
                      )}

                      {success && (
                        <Alert variant="success" className="mb-4">
                          {success}
                        </Alert>
                      )}

                      <Form>
                        <Row>
                          <Col md={12} className="mb-3">
                            <Form.Label className="fw-semibold text-dark">
                              Full Name <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="Enter your full name"
                              className="py-2"
                              disabled={loading}
                            />
                          </Col>

                          <Col md={12} className="mb-3">
                            <Form.Label className="fw-semibold text-dark">
                              Email Address <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="Enter your email address"
                              className="py-2"
                              disabled={loading}
                            />
                            <Form.Text className="text-muted">
                              We'll send your receipt and account details to this email
                            </Form.Text>
                          </Col>

                          <Col md={12} className="mb-4">
                            <Form.Label className="fw-semibold text-dark">
                              Phone Number <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="Enter your phone number"
                              className="py-2"
                              disabled={loading}
                            />
                          </Col>
                        </Row>

                        <Button
                          variant="primary"
                          size="lg"
                          className="w-100 py-3 fw-semibold"
                          onClick={createOrder}
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <Spinner animation="border" size="sm" className="me-2" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Lock size={18} className="me-2" />
                              Secure Payment - {plan.currency}
                              {plan.price}
                            </>
                          )}
                        </Button>

                        <div className="text-center mt-3">
                          <small className="text-muted">
                            By completing this purchase, you agree to our Terms of Service and
                            Privacy Policy.
                          </small>
                        </div>
                      </Form>

                      {/* Payment Methods */}
                      <div className="mt-4 pt-4 border-top">
                        <p className="text-muted small mb-2">We accept:</p>
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                          <img
                            src="/assets/images/20da3c05-4bde-4daf-87a0-346b73fad720 - Copy.png"
                            alt="Visa"
                            height="24"
                            style={{ opacity: 0.8 }}
                          />
                          <img
                            src="/assets/images/20da3c05-4bde-4daf-87a0-346b73fad720 - Copy (2).png"
                            alt="Mastercard"
                            height="24"
                            style={{ opacity: 0.8 }}
                          />
                          <img
                            src="/assets/images/20da3c05-4bde-4daf-87a0-346b73fad720 - Copy (3).png"
                            alt="RuPay"
                            height="24"
                            style={{ opacity: 0.8 }}
                          />
                          <img
                            src="/assets/images/20da3c05-4bde-4daf-87a0-346b73fad720 - Copy (4).png"
                            alt="UPI"
                            height="24"
                            style={{ opacity: 0.8 }}
                          />
                          <span className="text-muted small">+ more</span>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </Container>
    </div>
  );
};

export default Checkout;
