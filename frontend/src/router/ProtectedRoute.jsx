import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Alert, Container, Spinner } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../services/api';

const ProtectedRoute = () => {
  // Use AuthContext instead of Redux for consistency
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  // Keep Redux as fallback
  const reduxAuth = useSelector((state) => state.auth);
  const location = useLocation();
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [subscriptionError, setSubscriptionError] = useState(null);

  // Use AuthContext state, fallback to Redux if needed
  const finalIsAuthenticated = isAuthenticated || reduxAuth.isAuthenticated;
  const finalUser = user || reduxAuth.user;
  const finalLoading = authLoading || reduxAuth.isLoading;

  // Get user role and current path
  const userRole = finalUser?.user_role || finalUser?.role;
  const currentPath = location.pathname;

  // Debug logging for super admin access
  console.log('ProtectedRoute - Path:', currentPath);
  console.log('ProtectedRoute - Final User:', finalUser);
  console.log('ProtectedRoute - Is Authenticated:', finalIsAuthenticated);

  // Fetch subscription data for authenticated users
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      if (finalIsAuthenticated) {
        // Skip subscription check for super admin - they have bypass permissions
        if (finalUser?.role === 'super_admin' || finalUser?.is_superuser) {
          console.log('ProtectedRoute - Super admin detected, bypassing subscription check');
          setSubscriptionData({
            id: 'super-admin-bypass',
            plan_name: 'Super Admin Access',
            status: 'active',
            is_trial: false,
            features: {
              ai_analysis: true,
              reports: true,
              patient_management: true,
              admin_access: true,
              unlimited_access: true
            }
          });
          setSubscriptionLoading(false);
          return;
        }

        try {
          setSubscriptionLoading(true);
          const response = await apiClient.get('/api/subscriptions/my-subscription/');
          setSubscriptionData(response.data);
        } catch (error) {
          // Don't log subscription errors to reduce console noise
          if (!error.isSubscriptionError) {
            console.log('ProtectedRoute - Subscription API error (non-blocking):', error.response?.status);
          }
          
          if (error.response?.status === 404) {
            // User has no subscription - this is ok for some routes
            setSubscriptionData(null);
          } else if (error.response?.status === 401 || error.isSubscriptionError) {
            // Authentication issue or custom subscription error - use demo subscription data
            console.log('ProtectedRoute - Using demo subscription mode');
            setSubscriptionData({
              id: 'demo-subscription',
              plan_name: 'Demo Plan',
              status: 'active',
              is_trial: true,
              trial_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              features: {
                ai_analysis: true,
                reports: true,
                patient_management: true,
                max_patients: 10
              }
            });
          } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
            // Server offline - use demo subscription data
            console.log('ProtectedRoute - Server offline, using demo subscription');
            setSubscriptionData({
              id: 'demo-subscription-offline',
              plan_name: 'Demo Plan (Offline)',
              status: 'active',
              is_trial: true,
              trial_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              features: {
                ai_analysis: true,
                reports: true,
                patient_management: true,
                max_patients: 10
              }
            });
          } else {
            // Other errors - also non-blocking
            console.log('ProtectedRoute - API error, continuing without subscription data');
            setSubscriptionData(null);
            setSubscriptionError('Failed to load subscription data');
          }
        } finally {
          setSubscriptionLoading(false);
        }
      }
    };

    fetchSubscriptionData();
  }, [finalIsAuthenticated]);

  // Role-based dashboard mapping
  const getRoleBaseDashboard = (role) => {
    switch(role) {
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

  // Protected features that require subscription
  const getRequiredSubscriptionForPath = (path) => {
    if (path.startsWith('/SecureNeat/')) {
      return ['SecureNeat Basic', 'SecureNeat Pro', 'SecureNeat', 'Full Admin Access', 'Super Admin Access'];
    }
    if (path.startsWith('/radiology/')) {
      return ['Radiology Suite Standard', 'Radiology', 'Full Admin Access', 'Super Admin Access'];
    }
    return null; // No subscription required
  };

  // Check if user has required subscription for current path
  const hasRequiredSubscription = (path, subscriptionData) => {
    // Check if user is super admin or admin - they get unlimited access
    if (finalUser?.is_superuser || 
        finalUser?.role === 'super_admin' || 
        finalUser?.role === 'admin' ||
        user?.is_superuser || 
        user?.role === 'super_admin' || 
        user?.role === 'admin') {
      console.log('ProtectedRoute - Super admin detected, granting full access to:', path);
      // Set flag for SubscriptionGate to use
      localStorage.setItem('superAdminDetected', 'true');
      return true;
    }
    
    const requiredPlans = getRequiredSubscriptionForPath(path);
    if (!requiredPlans) return true; // No subscription required
    
    if (!subscriptionData || !subscriptionData.is_currently_active) {
      return false;
    }

    // Check if plan name includes admin access
    const planName = subscriptionData.plan?.name || subscriptionData.plan_name;
    if (planName && (planName.includes('Super Admin') || planName.includes('Admin Access'))) {
      return true;
    }

    return requiredPlans.includes(planName);
  };

  if (finalLoading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading...</p>
      </Container>
    );
  }

  // Development mode bypass - allow access for pathology routes in development
  const isDevelopment = import.meta.env.DEV || process.env.NODE_ENV === 'development';
  const isPathologyRoute = currentPath.startsWith('/pathology/');
  
  if (isDevelopment && isPathologyRoute && !finalIsAuthenticated) {
    console.log('ProtectedRoute - Development mode: allowing pathology access without authentication');
    // Set demo user for development
    const demoUser = {
      username: 'demo-user',
      role: 'super_admin',
      is_superuser: true,
      user_role: 'super_admin'
    };
    
    // Set demo subscription data
    setSubscriptionData({
      id: 'dev-demo-subscription',
      plan_name: 'Development Demo Plan',
      status: 'active',
      is_trial: false,
      features: {
        ai_analysis: true,
        reports: true,
        patient_management: true,
        admin_access: true,
        unlimited_access: true
      }
    });
    setSubscriptionLoading(false);
    
    // Continue with demo user context
    return <Outlet context={{ subscriptionData: {
      id: 'dev-demo-subscription',
      plan_name: 'Development Demo Plan',
      status: 'active',
      features: {
        ai_analysis: true,
        reports: true,
        patient_management: true,
        admin_access: true,
        unlimited_access: true
      }
    }, userRole: 'super_admin' }} />;
  }

  if (!finalIsAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If subscriptions are still loading, show loading state
  if (subscriptionLoading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading user data...</p>
      </Container>
    );
  }

  // Handle subscription errors
  if (subscriptionError) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <Alert.Heading>Subscription Service Unavailable</Alert.Heading>
          <p>{subscriptionError}</p>
          <p>Some features may not be available. Please try refreshing the page.</p>
        </Alert>
      </Container>
    );
  }

  // Redirect to role-specific dashboard if user is on root dashboard
  if (currentPath === '/dashboard' && userRole) {
    const roleDashboard = getRoleBaseDashboard(userRole);
    if (roleDashboard !== '/dashboard') {
      return <Navigate to={roleDashboard} replace />;
    }
  }

  // SUPER ADMIN UNIVERSAL BYPASS - Always allow super admin access to any route
  const isSuperAdminBypass = finalUser?.role === 'super_admin' || 
                             finalUser?.user_role === 'super_admin' ||
                             finalUser?.is_superuser === true ||
                             (finalUser?.role === 'admin' && finalUser?.is_staff === true);
  
  if (isSuperAdminBypass) {
    console.log('ProtectedRoute - SUPER ADMIN UNIVERSAL BYPASS activated for:', finalUser?.username || finalUser?.email);
    console.log('ProtectedRoute - Bypassing all subscription checks for path:', currentPath);
    return <Outlet context={{ subscriptionData: {
      id: 'super-admin-universal-bypass',
      plan_name: 'Super Admin Universal Access',
      status: 'active',
      is_currently_active: true,
      features: {
        ai_analysis: true,
        reports: true,
        patient_management: true,
        admin_access: true,
        unlimited_access: true,
        radiology_access: true,
        secureneat_access: true
      }
    }, userRole }} />;
  }

  // Check subscription requirements for protected routes
  if (!hasRequiredSubscription(currentPath, subscriptionData)) {
    const requiredPlans = getRequiredSubscriptionForPath(currentPath);
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <Alert.Heading>Subscription Required</Alert.Heading>
          <p>
            This feature requires an active subscription to one of the following plans:
          </p>
          <ul>
            {requiredPlans.map(plan => (
              <li key={plan}>{plan}</li>
            ))}
          </ul>
          <p>
            <Alert.Link href="/subscription">
              Click here to view subscription options
            </Alert.Link>
          </p>
        </Alert>
      </Container>
    );
  }

  // Pass subscription data to child components via context or props
  return <Outlet context={{ subscriptionData, userRole }} />;
};

export default ProtectedRoute;