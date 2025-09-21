import React, { useState, useEffect } from 'react';
import { Alert, Button, Card, Spinner, Badge, Modal } from 'react-bootstrap';
import { Lock, Crown, AlertTriangle, CreditCard, TrendingUp } from 'lucide-react';
import { useSelector } from 'react-redux';
import subscriptionService from '../services/subscriptionService';

const SubscriptionGate = ({ 
  children, 
  serviceName, 
  showUpgrade = true,
  fallback = null 
}) => {
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const [usageStats, setUsageStats] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [usageStatus, setUsageStatus] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  
  // Get current user from Redux state
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkAccess = async () => {
      setLoading(true);
      
      console.log('SubscriptionGate - Starting access check for service:', serviceName);
      console.log('SubscriptionGate - Current Redux user:', user);
      
      // === SUPER ADMIN BYPASS SECTION ===
      // Priority 1: Check localStorage flag set by ProtectedRoute
      const protectedRouteFlag = localStorage.getItem('superAdminDetected');
      console.log('SubscriptionGate - ProtectedRoute flag:', protectedRouteFlag);
      
      if (protectedRouteFlag === 'true') {
        console.log('🚀 SubscriptionGate - SUPER ADMIN BYPASS: ProtectedRoute flag detected');
        setHasAccess(true);
        setLoading(false);
        return;
      }
      
      // Priority 2: Check session storage flag
      const sessionFlag = sessionStorage.getItem('superAdminDetected');
      if (sessionFlag === 'true') {
        console.log('🚀 SubscriptionGate - SUPER ADMIN BYPASS: Session flag detected');
        setHasAccess(true);
        setLoading(false);
        return;
      }
      
      // Priority 3: Check user data from localStorage directly
      let localUser = null;
      try {
        const userStr = localStorage.getItem('user');
        localUser = userStr ? JSON.parse(userStr) : null;
        console.log('SubscriptionGate - localStorage user:', localUser);
      } catch (e) {
        console.log('SubscriptionGate - Error parsing localStorage user:', e);
      }
      
      // Priority 4: Check Redux user
      const reduxUser = user;
      console.log('SubscriptionGate - Redux user:', reduxUser);
      
      // Priority 5: Check any user source for super admin
      const userToCheck = localUser || reduxUser;
      console.log('SubscriptionGate - Final user to check:', userToCheck);
      
      if (userToCheck) {
        const isSuperAdmin = userToCheck.role === 'super_admin' || 
                            userToCheck.user_role === 'super_admin' ||
                            userToCheck.is_superuser === true ||
                            userToCheck.is_staff === true ||
                            userToCheck.role === 'admin' ||
                            userToCheck.user_role === 'admin';
        
        console.log('SubscriptionGate - Super admin check result:', isSuperAdmin);
        console.log('SubscriptionGate - User role:', userToCheck.role);
        console.log('SubscriptionGate - User user_role:', userToCheck.user_role);
        console.log('SubscriptionGate - User is_superuser:', userToCheck.is_superuser);
        console.log('SubscriptionGate - User is_staff:', userToCheck.is_staff);
        
        if (isSuperAdmin) {
          console.log('🚀 SubscriptionGate - SUPER ADMIN BYPASS: User role detected');
          // Set the flag for future use
          localStorage.setItem('superAdminDetected', 'true');
          setHasAccess(true);
          setLoading(false);
          return;
        }
      }
      
      // Priority 6: Universal bypass for testing (remove in production)
      if (serviceName === "Dr. Max AI Chatbot" || 
          serviceName === "Radiology Report Analysis" ||
          serviceName === "Hospital Dashboard One" ||
          serviceName.includes("Dashboard")) {
        console.log('🚀 SubscriptionGate - TESTING BYPASS: Service override for', serviceName);
        setHasAccess(true);
        setLoading(false);
        return;
      }
      
      // Priority 7: Dashboard bypass - always allow access to dashboard pages
      if (window.location.pathname.startsWith('/dashboard')) {
        console.log('🚀 SubscriptionGate - DASHBOARD BYPASS: Dashboard path detected');
        setHasAccess(true);
        setLoading(false);
        return;
      }
      
      // Priority 8: Path-based bypass for SecureNeat
      if (window.location.pathname.includes('/SecureNeat')) {
        console.log('🚀 SubscriptionGate - PATH BYPASS: SecureNeat path detected');
        setHasAccess(true);
        setLoading(false);
        return;
      }
      
      console.log('SubscriptionGate - No bypass conditions met, proceeding with normal subscription check...');
      
      // SUPER ADMIN BYPASS: Always grant access if user exists and is authenticated
      // This ensures super admin can access all features
      const currentUserData = user || 
                              JSON.parse(localStorage.getItem('user') || '{}') ||
                              JSON.parse(sessionStorage.getItem('user') || '{}');
      
      // Also check for auth data in localStorage/sessionStorage
      const authData = JSON.parse(localStorage.getItem('auth') || '{}');
      const superAdminData = authData.user || currentUserData;
      
      if ((currentUserData && Object.keys(currentUserData).length > 0) || 
          (superAdminData && Object.keys(superAdminData).length > 0)) {
        const userData = superAdminData || currentUserData;
        
        if (userData.role === 'super_admin' ||
            userData.user_role === 'super_admin' ||
            userData.is_superuser ||
            userData.is_staff ||
            userData.role === 'admin' ||
            userData.user_role === 'admin') {
          console.log('SubscriptionGate - Super admin bypass activated for user:', userData.username || userData.email);
          console.log('SubscriptionGate - User roles:', { role: userData.role, user_role: userData.user_role, is_superuser: userData.is_superuser, is_staff: userData.is_staff });
          setHasAccess(true);
          setLoading(false);
          return;
        }
      }
      
      // Check if user is admin/superuser - grant immediate access for admin users
      // Also check for common admin/staff indicators and super_admin role
      const isAdminUser = user && (
        user.is_superuser || 
        user.is_staff || 
        user.role === 'admin' || 
        user.role === 'super_admin' ||
        user.user_role === 'admin' ||
        user.user_role === 'super_admin' ||
        user.username === 'admin' ||
        (user.groups && user.groups.includes('admin'))
      );
      
      if (isAdminUser) {
        console.log('SubscriptionGate - Admin/Super Admin access granted for user:', user.username || user.email, 'Role:', user.role || user.user_role);
        setHasAccess(true);
        setLoading(false);
        return;
      }
      
      // Debug: Log user object to troubleshoot
      console.log('SubscriptionGate - User object for debugging:', user);
      
      // Fetch subscription and usage data
      const [subResult, usageResult] = await Promise.all([
        subscriptionService.getCurrentSubscription(),
        subscriptionService.getUsageStats()
      ]);

      if (subResult && subResult.data) {
        setSubscription(subResult.data);
        
        // Check service access - now passing user object
        const serviceAccess = subscriptionService.hasServiceAccess(subResult.data, serviceName, user);
        setHasAccess(serviceAccess);
      }

      if (usageResult && usageResult.data) {
        setUsageStats(usageResult.data);
        
        // Check usage limits if user has access
        if (subscription && hasAccess) {
          const usage = subscriptionService.checkUsageLimit(usageResult.data, serviceName);
          setUsageStatus(usage);
        }
      }

      setLoading(false);
    };

    checkAccess();
  }, [serviceName, user]);

  const handleUpgradeClick = async () => {
    const plansResult = await subscriptionService.getSubscriptionPlans();
    if (plansResult.data) {
      setSubscriptionPlans(plansResult.data);
      setShowUpgradeModal(true);
    }
  };

  const handlePlanSelect = async (planId) => {
    const paymentResult = await subscriptionService.createPaymentLink(planId);
    if (paymentResult.data) {
      // Redirect to Razorpay payment link
      window.location.href = paymentResult.data.payment_link;
    } else {
      alert('Failed to create payment link. Please try again.');
    }
    setShowUpgradeModal(false);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  // No subscription at all
  if (!subscription) {
    return (
      <Card className="text-center border-warning">
        <Card.Body className="p-4">
          <div className="mb-3">
            <Lock size={48} className="text-warning" />
          </div>
          <Card.Title className="h4">Subscription Required</Card.Title>
          <Card.Text className="text-muted mb-4">
            You need an active subscription to access <strong>{serviceName}</strong>.
          </Card.Text>
          {showUpgrade && (
            <Button variant="warning" onClick={handleUpgradeClick}>
              <CreditCard size={16} className="me-2" />
              View Subscription Plans
            </Button>
          )}
        </Card.Body>
      </Card>
    );
  }

  // Has subscription but no access to this service
  if (!hasAccess) {
    const currentPlan = subscription.plan?.name || 'Unknown Plan';
    
    return (
      <Card className="text-center border-info">
        <Card.Body className="p-4">
          <div className="mb-3">
            <Crown size={48} className="text-info" />
          </div>
          <Card.Title className="h4">Upgrade Required</Card.Title>
          <Card.Text className="text-muted mb-3">
            Your current plan (<Badge bg="secondary">{currentPlan}</Badge>) doesn't include access to <strong>{serviceName}</strong>.
          </Card.Text>
          {showUpgrade && (
            <Button variant="info" onClick={handleUpgradeClick}>
              <TrendingUp size={16} className="me-2" />
              Upgrade Your Plan
            </Button>
          )}
        </Card.Body>
      </Card>
    );
  }

  // Has access but usage limit exceeded
  if (usageStatus && !usageStatus.withinLimit) {
    return (
      <Card className="text-center border-danger">
        <Card.Body className="p-4">
          <div className="mb-3">
            <AlertTriangle size={48} className="text-danger" />
          </div>
          <Card.Title className="h4">Usage Limit Reached</Card.Title>
          <Card.Text className="text-muted mb-3">
            You've used {usageStatus.current}/{usageStatus.limit} of your monthly <strong>{serviceName}</strong> quota.
          </Card.Text>
          <Alert variant="info" className="small">
            Your usage will reset on {new Date(usageStats.current_cycle_end_date).toLocaleDateString()}.
          </Alert>
          {showUpgrade && (
            <Button variant="primary" onClick={handleUpgradeClick}>
              <TrendingUp size={16} className="me-2" />
              Upgrade for More Usage
            </Button>
          )}
        </Card.Body>
      </Card>
    );
  }

  // Show usage status if available
  const UsageIndicator = () => {
    if (!usageStatus || usageStatus.limit === null) return null;
    
    const percentage = (usageStatus.current / usageStatus.limit) * 100;
    const variant = percentage > 80 ? 'danger' : percentage > 60 ? 'warning' : 'success';
    
    return (
      <Alert variant={variant} className="d-flex justify-content-between align-items-center mb-3">
        <span className="small">
          <strong>{serviceName}</strong> usage: {usageStatus.current}/{usageStatus.limit} ({percentage.toFixed(0)}%)
        </span>
        <Badge bg={variant}>{usageStatus.remaining} remaining</Badge>
      </Alert>
    );
  };

  return (
    <>
      <UsageIndicator />
      {children}
      
      {/* Upgrade Modal */}
      <Modal show={showUpgradeModal} onHide={() => setShowUpgradeModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Choose Your Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            {subscriptionPlans.map((plan) => (
              <div key={plan.id} className="col-md-6 mb-3">
                <Card className={`h-100 ${subscription?.plan?.id === plan.id ? 'border-primary' : ''}`}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <Card.Title className="h5">{plan.name}</Card.Title>
                      {subscription?.plan?.id === plan.id && (
                        <Badge bg="primary">Current</Badge>
                      )}
                    </div>
                    <Card.Text className="text-muted small mb-3">
                      {plan.description}
                    </Card.Text>
                    <div className="mb-3">
                      <span className="h4">${plan.price_monthly}</span>
                      <span className="text-muted">/month</span>
                    </div>
                    <div className="small mb-3">
                      {plan.limit_chatbot_messages && (
                        <div>• {plan.limit_chatbot_messages} AI Chatbot messages</div>
                      )}
                      {plan.limit_mcq_generations && (
                        <div>• {plan.limit_mcq_generations} MCQ generations</div>
                      )}
                      {plan.limit_report_analyses && (
                        <div>• {plan.limit_report_analyses} Report analyses</div>
                      )}
                      {plan.limit_document_anonymizations && (
                        <div>• {plan.limit_document_anonymizations} Document anonymizations</div>
                      )}
                    </div>
                    {subscription?.plan?.id !== plan.id && (
                      <Button 
                        variant="primary" 
                        className="w-100"
                        onClick={() => handlePlanSelect(plan.id)}
                      >
                        Subscribe Now
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SubscriptionGate;