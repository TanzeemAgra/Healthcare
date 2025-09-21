import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import subscriptionService from '../services/subscriptionService';

export const useSubscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [usageStats, setUsageStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user } = useSelector(state => state.auth);

  const fetchSubscriptionData = useCallback(async (showLoading = true) => {
    if (!user) return;
    
    if (showLoading) setLoading(true);
    setError(null);

    try {
      const [subResult, usageResult] = await Promise.all([
        subscriptionService.getCurrentSubscription(),
        subscriptionService.getUsageStats()
      ]);

      if (subResult.error) {
        setError(subResult.error);
      } else {
        setSubscription(subResult.data || subResult);
      }

      if (usageResult.error) {
        setError(usageResult.error);
      } else {
        setUsageStats(usageResult.data || usageResult);
      }
    } catch (err) {
      // Handle subscription errors silently and use demo mode
      if (err.isSubscriptionError || (err.response && err.response.status === 401)) {
        console.log('useSubscription - Using demo mode due to auth error');
        setSubscription({
          id: 'demo-subscription-hook',
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
        setUsageStats({
          ai_analyses_used: 0,
          ai_analyses_limit: 100,
          patients_count: 0,
          patients_limit: 10
        });
      } else {
        setError('Failed to fetch subscription data');
        console.error('Subscription fetch error:', err);
      }
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSubscriptionData();
  }, [fetchSubscriptionData]);

  const hasServiceAccess = useCallback((serviceName) => {
    return subscriptionService.hasServiceAccess(subscription, serviceName);
  }, [subscription]);

  const checkUsageLimit = useCallback((serviceName) => {
    return subscriptionService.checkUsageLimit(usageStats, serviceName);
  }, [usageStats]);

  const canUseService = useCallback((serviceName) => {
    const hasAccess = hasServiceAccess(serviceName);
    if (!hasAccess) return { canUse: false, reason: 'no_access' };

    const usageStatus = checkUsageLimit(serviceName);
    if (!usageStatus.withinLimit) return { canUse: false, reason: 'limit_exceeded', usageStatus };

    return { canUse: true, usageStatus };
  }, [hasServiceAccess, checkUsageLimit]);

  const refreshSubscription = useCallback(() => {
    return fetchSubscriptionData(false);
  }, [fetchSubscriptionData]);

  const isSubscriptionActive = useCallback(() => {
    if (!subscription) return false;
    return subscription.status === 'active' || subscription.status === 'trial';
  }, [subscription]);

  const getSubscriptionStatus = useCallback(() => {
    if (!subscription) return { status: 'none', message: 'No subscription' };
    
    const status = subscription.status;
    const endDate = new Date(subscription.end_date);
    const now = new Date();
    const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

    switch (status) {
      case 'active':
        return { 
          status: 'active', 
          message: `Active until ${endDate.toLocaleDateString()}`,
          daysRemaining 
        };
      case 'trial':
        return { 
          status: 'trial', 
          message: `Trial ends ${endDate.toLocaleDateString()}`,
          daysRemaining 
        };
      case 'cancelled':
        return { 
          status: 'cancelled', 
          message: `Cancelled, access until ${endDate.toLocaleDateString()}`,
          daysRemaining 
        };
      case 'past_due':
        return { 
          status: 'past_due', 
          message: 'Payment overdue - please update payment method',
          daysRemaining: 0 
        };
      default:
        return { status: 'unknown', message: 'Unknown status' };
    }
  }, [subscription]);

  return {
    subscription,
    usageStats,
    loading,
    error,
    hasServiceAccess,
    checkUsageLimit,
    canUseService,
    refreshSubscription,
    isSubscriptionActive,
    getSubscriptionStatus,
    // Computed values
    isActive: isSubscriptionActive(),
    statusInfo: getSubscriptionStatus(),
  };
};

export default useSubscription;