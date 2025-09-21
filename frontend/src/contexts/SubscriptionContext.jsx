import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the Subscription Context
const SubscriptionContext = createContext();

// Custom hook to use the subscription context
export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

// Subscription Provider Component
export const SubscriptionProvider = ({ children }) => {
  const [userSubscription, setUserSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock subscription data - replace with actual API call
  const mockSubscriptions = {
    'user1': {
      id: 1,
      user_id: 'user1',
      plan_name: 'Basic Plan',
      status: 'active',
      start_date: '2024-01-15',
      end_date: '2024-12-15',
      features: ['basic_dashboard', 'email_support'],
      billing_cycle: 'monthly',
      amount: 29.99
    },
    'user2': {
      id: 2,
      user_id: 'user2',
      plan_name: 'Practice Management Pro',
      status: 'active',
      start_date: '2024-01-10',
      end_date: '2024-12-10',
      features: [
        'practice_management',
        'doctor_management',
        'patient_management',
        'appointment_scheduling',
        'basic_analytics',
        'email_support'
      ],
      billing_cycle: 'monthly',
      amount: 149.99
    },
    'user3': {
      id: 3,
      user_id: 'user3',
      plan_name: 'Healthcare Complete Enterprise',
      status: 'active',
      start_date: '2024-01-01',
      end_date: '2024-12-31',
      features: [
        'practice_management',
        'doctor_management',
        'patient_management',
        'appointment_scheduling',
        'advanced_analytics',
        'api_access',
        'multi_location',
        'priority_support',
        'custom_reports'
      ],
      billing_cycle: 'annual',
      amount: 2999.99
    }
  };

  // Simulate fetching user subscription data
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setLoading(true);
        
        // Get current user ID (in real app, this would come from auth context)
        const userId = localStorage.getItem('currentUserId') || 'user1';
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get subscription for current user
        const subscription = mockSubscriptions[userId];
        
        if (subscription) {
          setUserSubscription(subscription);
        } else {
          setUserSubscription(null);
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to fetch subscription data');
        setUserSubscription(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  // Check if user has access to a specific feature
  const hasFeature = (featureName) => {
    if (!userSubscription || !userSubscription.features) {
      return false;
    }
    return userSubscription.features.includes(featureName);
  };

  // Check if user has practice management access
  const hasPracticeManagement = () => {
    return hasFeature('practice_management');
  };

  // Check if subscription is active
  const isSubscriptionActive = () => {
    if (!userSubscription) return false;
    
    const currentDate = new Date();
    const endDate = new Date(userSubscription.end_date);
    
    return userSubscription.status === 'active' && currentDate <= endDate;
  };

  // Get days remaining in subscription
  const getDaysRemaining = () => {
    if (!userSubscription) return 0;
    
    const currentDate = new Date();
    const endDate = new Date(userSubscription.end_date);
    const timeDiff = endDate.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return Math.max(0, daysDiff);
  };

  // Upgrade subscription (mock function)
  const upgradeSubscription = async (newPlan) => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update subscription
      const updatedSubscription = {
        ...userSubscription,
        plan_name: newPlan.name,
        features: newPlan.features,
        amount: newPlan.price
      };
      
      setUserSubscription(updatedSubscription);
      return { success: true, subscription: updatedSubscription };
    } catch (err) {
      setError('Failed to upgrade subscription');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Cancel subscription (mock function)
  const cancelSubscription = async () => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update subscription status
      const updatedSubscription = {
        ...userSubscription,
        status: 'cancelled'
      };
      
      setUserSubscription(updatedSubscription);
      return { success: true };
    } catch (err) {
      setError('Failed to cancel subscription');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const contextValue = {
    userSubscription,
    loading,
    error,
    hasFeature,
    hasPracticeManagement,
    isSubscriptionActive,
    getDaysRemaining,
    upgradeSubscription,
    cancelSubscription,
    refreshSubscription: () => {
      // Trigger a refresh of subscription data
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <SubscriptionContext.Provider value={contextValue}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionContext;
