import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { CheckCircle, XCircle, ArrowLeft, UserPlus } from 'lucide-react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import subscriptionService from '../../services/subscriptionService';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('');
  const [subscription, setSubscription] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [customerInfo, setCustomerInfo] = useState(null);

  const handleAutoCreateAccount = async (paymentInfo, customerData) => {
    try {
      setStatus('processing');
      setMessage('Creating your account automatically...');

      console.log('=== DEBUG: Auto Account Creation ===');
      console.log('Payment Info:', paymentInfo);
      console.log('Customer Data:', customerData);

      // Retry logic for more robust account creation
      let attempts = 0;
      const maxAttempts = 3;
      let lastError = null;

      while (attempts < maxAttempts) {
        try {
          attempts++;
          console.log(`Account creation attempt ${attempts}/${maxAttempts}`);

          const { data, error } = await subscriptionService.createUserFromPayment(
            paymentInfo,
            customerData
          );

          console.log('API Response - Data:', data);
          console.log('API Response - Error:', error);

          if (error) {
            lastError = new Error(error);
            if (attempts === maxAttempts) {
              throw lastError;
            }
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, 2000));
            continue;
          }

          if (!data) {
            lastError = new Error('No data received from server');
            if (attempts === maxAttempts) {
              throw lastError;
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
            continue;
          }

          // Success - account created
          setStatus('success');
          setMessage(`🎉 Account created successfully! You've been automatically logged in.`);

          // Store tokens for automatic login with Redux update
          localStorage.setItem('access_token', data.tokens.access);
          localStorage.setItem('refresh_token', data.tokens.refresh);
          localStorage.setItem('user', JSON.stringify(data.user));

          // Clear subscription service cache to ensure fresh data
          subscriptionService.clearCache();

          console.log('Account created successfully, redirecting to dashboard...');

          // Show success message longer then redirect
          setTimeout(() => {
            window.location.href = '/dashboard'; // Force reload to update auth state
          }, 4000);
          
          return; // Exit retry loop
        } catch (attemptError) {
          lastError = attemptError;
          console.error(`Attempt ${attempts} failed:`, attemptError);
          
          if (attempts < maxAttempts) {
            setMessage(`Account creation attempt ${attempts} failed, retrying...`);
            await new Promise(resolve => setTimeout(resolve, 3000));
          }
        }
      }

      // All attempts failed
      throw lastError;

    } catch (err) {
      console.error('=== Auto account creation failed after all attempts ===');
      console.error('Error object:', err);
      console.error('Error message:', err.message);
      
      setStatus('error');
      setMessage(`Payment successful, but account creation failed: ${err.message}. Don't worry - your payment is secure. Please try creating your account manually or contact support.`);
    }
  };

  useEffect(() => {
    const handlePaymentCallback = async () => {
      // Check if we have payment data from custom checkout flow
      const stateData = location.state;
      const storedPaymentData = localStorage.getItem('paymentVerification');
      const storedCustomerInfo = localStorage.getItem('customerInfo');

      if (stateData?.paymentData || storedPaymentData) {
        // Custom checkout flow - auto-create account
        const paymentInfo = stateData?.paymentData || JSON.parse(storedPaymentData);
        const customerData =
          stateData?.customerInfo || (storedCustomerInfo ? JSON.parse(storedCustomerInfo) : null);

        setPaymentData(paymentInfo);
        setCustomerInfo(customerData);

        // Automatically create user account from payment
        if (paymentInfo && customerData) {
          handleAutoCreateAccount(paymentInfo, customerData);
        } else {
          setStatus('success');
          setMessage('Payment successful! You can now create your account to access the platform.');
        }

        // Clear stored data
        localStorage.removeItem('paymentVerification');
        localStorage.removeItem('customerInfo');
        return;
      }

      // Legacy payment link flow
      const paymentLinkId = searchParams.get('razorpay_payment_link_id');
      const paymentId = searchParams.get('razorpay_payment_id');

      // If it's a successful payment callback
      if (paymentLinkId && paymentId) {
        try {
          const result = await subscriptionService.handlePaymentSuccess(paymentLinkId, paymentId);

          if (result.data) {
            setStatus('success');
            setMessage('Payment successful! Your subscription has been activated.');
            setSubscription(result.data.subscription);
          } else {
            setStatus('error');
            setMessage(result.error || 'Failed to process payment');
          }
        } catch (error) {
          console.error('Payment processing error:', error);
          setStatus('error');
          setMessage('An error occurred while processing your payment');
        }
      } else {
        // Check for payment cancellation or failure
        const paymentStatus = searchParams.get('status');
        if (paymentStatus === 'cancelled') {
          setStatus('error');
          setMessage('Payment was cancelled. Please try again.');
        } else {
          setStatus('error');
          setMessage('Invalid payment callback received');
        }
      }
    };

    handlePaymentCallback();
  }, [searchParams, location]);

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleTryAgain = () => {
    navigate('/subscription');
  };

  if (status === 'processing') {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '50vh' }}
      >
        <Card className="text-center shadow-sm" style={{ maxWidth: '500px', width: '100%' }}>
          <Card.Body className="p-5">
            <Spinner animation="border" variant="primary" size="lg" className="mb-3" />
            <h4>Processing Payment...</h4>
            <p className="text-muted">Please wait while we verify your payment</p>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="text-center shadow-sm">
            <Card.Body className="p-5">
              <div className="mb-4">
                {status === 'success' ? (
                  <CheckCircle size={64} className="text-success" />
                ) : (
                  <XCircle size={64} className="text-danger" />
                )}
              </div>

              <h2 className={`mb-3 ${status === 'success' ? 'text-success' : 'text-danger'}`}>
                {status === 'success' ? 'Payment Successful!' : 'Payment Failed'}
              </h2>

              <p className="lead text-muted mb-4">{message}</p>

              {subscription && status === 'success' && (
                <Alert variant="success" className="text-start mb-4">
                  <h6>Subscription Details:</h6>
                  <div>
                    <strong>Plan:</strong> {subscription.plan?.name}
                  </div>
                  <div>
                    <strong>Status:</strong> {subscription.status}
                  </div>
                  <div>
                    <strong>Valid Until:</strong>{' '}
                    {new Date(subscription.end_date).toLocaleDateString()}
                  </div>
                </Alert>
              )}

              {paymentData && status === 'success' && (
                <Alert variant="success" className="text-start mb-4">
                  <h6>Payment Details:</h6>
                  <div>
                    <strong>Plan:</strong> {paymentData.plan_name}
                  </div>
                  <div>
                    <strong>Amount Paid:</strong> ${paymentData.amount_paid} {paymentData.currency}
                  </div>
                  <div>
                    <strong>Payment ID:</strong> {paymentData.payment_id}
                  </div>
                  {customerInfo && (
                    <div>
                      <strong>Email:</strong> {customerInfo.email}
                    </div>
                  )}
                </Alert>
              )}

              <div className="d-flex gap-3 justify-content-center">
                {status === 'success' ? (
                  <>
                    {paymentData ? (
                      <>
                        <Button
                          variant="primary"
                          onClick={() =>
                            navigate('/auth/sign-up', {
                              state: {
                                paymentData: paymentData,
                                customerInfo: customerInfo,
                              },
                            })
                          }
                        >
                          <UserPlus size={16} className="me-1" />
                          Create Account
                        </Button>
                        <Button variant="outline-primary" onClick={() => navigate('/login')}>
                          Already have account? Sign In
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="primary" onClick={handleGoToDashboard}>
                          Go to Dashboard
                        </Button>
                        <Button variant="outline-primary" onClick={() => navigate('/subscription')}>
                          View Subscription
                        </Button>
                      </>
                    )}
                  </>
                ) : status === 'error' ? (
                  <>
                    {paymentData ? (
                      <>
                        <Button
                          variant="primary"
                          onClick={() =>
                            navigate('/auth/sign-up', {
                              state: {
                                paymentData: paymentData,
                                customerInfo: customerInfo,
                              },
                            })
                          }
                        >
                          <UserPlus size={16} className="me-1" />
                          Create Account Manually
                        </Button>
                        <Button variant="outline-primary" onClick={() => navigate('/login')}>
                          Already have account? Sign In
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="primary" onClick={handleTryAgain}>
                          Try Again
                        </Button>
                        <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                          <ArrowLeft size={16} className="me-1" />
                          Go Back
                        </Button>
                      </>
                    )}
                  </>
                ) : null}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentSuccess;
