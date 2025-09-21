import apiClient from './api';

class SubscriptionService {
  constructor() {
    // Simple cache with 30-second TTL to prevent redundant API calls
    this.cache = new Map();
    this.cacheTimeout = 30000; // 30 seconds
  }

  // Cache helper methods
  _getCacheKey(url) {
    return url;
  }

  _isExpired(timestamp) {
    return Date.now() - timestamp > this.cacheTimeout;
  }

  _setCache(key, data) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  _getCache(key) {
    const cached = this.cache.get(key);
    if (cached && !this._isExpired(cached.timestamp)) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  // Clear cache - useful after subscription changes
  clearCache() {
    this.cache.clear();
  }

  // Get user's current subscription details
  async getCurrentSubscription() {
    const cacheKey = this._getCacheKey('/subscriptions/my-subscription/');
    const cached = this._getCache(cacheKey);
    
    if (cached) {
      return cached.data;
    }

    try {
      const response = await apiClient.get('/subscriptions/my-subscription/');
      this._setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // No subscription found - return null instead of throwing error
        return null;
      } else if (error.response && error.response.status === 401 || error.isSubscriptionError) {
        // Authentication issue or custom subscription error - return demo subscription data
        console.log('SubscriptionService - Authentication error, using demo mode');
        const demoSubscription = {
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
        };
        this._setCache(cacheKey, demoSubscription);
        return demoSubscription;
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        // Server offline - return demo subscription data
        console.log('SubscriptionService - Server offline, using demo mode');
        const demoSubscription = {
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
        };
        this._setCache(cacheKey, demoSubscription);
        return demoSubscription;
      }
      // Don't log subscription errors to reduce console noise
      if (!error.isSubscriptionError) {
        console.error('Error fetching current subscription:', error);
      }
      throw error;
    }
  }

  // Get available subscription plans
  async getSubscriptionPlans() {
    try {
      const response = await apiClient.get('/subscriptions/plans/');
      return { data: response.data, error: null };
    } catch (error) {
      // Handle subscription errors and provide demo data
      if (error.isSubscriptionError || (error.response && error.response.status === 401)) {
        console.log('SubscriptionService - Subscription plans using demo mode');
        const demoPlans = [
          {
            id: 'demo-basic',
            name: 'Basic Plan (Demo)',
            price: 0,
            features: ['AI Analysis', 'Basic Reports', '10 Patients'],
            is_trial: true
          },
          {
            id: 'demo-premium',
            name: 'Premium Plan (Demo)',
            price: 0,
            features: ['AI Analysis', 'Advanced Reports', 'Unlimited Patients'],
            is_trial: true
          }
        ];
        return { data: demoPlans, error: null };
      }
      console.error('Error fetching plans:', error);
      return { data: null, error: error.response?.data?.detail || error.message };
    }
  }

  // Get usage statistics
  async getUsageStats() {
    const cacheKey = this._getCacheKey('/subscriptions/usage-stats/');
    const cached = this._getCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response = await apiClient.get('/subscriptions/usage-stats/');
      const result = { data: response.data, error: null };
      this._setCache(cacheKey, result);
      return result;
    } catch (error) {
      // Handle subscription errors and provide demo data
      if (error.isSubscriptionError || (error.response && error.response.status === 401)) {
        console.log('SubscriptionService - Usage stats using demo mode');
        const demoUsageStats = {
          ai_analyses_used: 0,
          ai_analyses_limit: 100,
          patients_count: 0,
          patients_limit: 10,
          storage_used: 0,
          storage_limit: 1024
        };
        const result = { data: demoUsageStats, error: null };
        this._setCache(cacheKey, result);
        return result;
      }
      console.error('Error fetching usage stats:', error);
      return { data: null, error: error.response?.data?.detail || error.message };
    }
  }

  // Create Razorpay payment link
  async createPaymentLink(planId) {
    try {
      const response = await apiClient.post('/subscriptions/razorpay/create-payment-link/', {
        plan_id: planId
      });
      return { data: response.data, error: null };
    } catch (error) {
      console.error('Error creating payment link:', error);
      return { data: null, error: error.response?.data?.error || error.message };
    }
  }

  // Handle payment success
  async handlePaymentSuccess(paymentLinkId, paymentId) {
    try {
      const response = await apiClient.post('/subscriptions/razorpay/payment-success/', {
        payment_link_id: paymentLinkId,
        payment_id: paymentId
      });
      return { data: response.data, error: null };
    } catch (error) {
      console.error('Error handling payment success:', error);
      return { data: null, error: error.response?.data?.error || error.message };
    }
  }

  // Check if user has access to a specific service
  hasServiceAccess(subscription, serviceName, user = null) {
    if (!subscription || !subscription.plan) {
      return false;
    }

    // Check if user is super user or admin - they get unlimited access
    if (user) {
      if (user.is_superuser || user.role === 'admin') {
        return true;
      }
    }

    // If subscription plan includes "Super Admin Access" or "Full Admin Access", grant access
    const planName = subscription.plan.name;
    if (planName && (planName.includes('Super Admin') || planName.includes('Admin Access'))) {
      return true;
    }

    // Define service access based on plan
    const serviceAccess = {
      'Dr. Max AI Chatbot': ['SecureNeat Basic', 'SecureNeat Pro', 'SecureNeat', 'Full Admin Access', 'Super Admin Access'],
      'Intelligent MCQ Generator': ['SecureNeat Basic', 'SecureNeat Pro', 'SecureNeat', 'Full Admin Access', 'Super Admin Access'],
      'OSCE Practice Tool': ['SecureNeat Basic', 'SecureNeat Pro', 'SecureNeat', 'Full Admin Access', 'Super Admin Access'],
      'Radiology Report Analysis': ['Radiology Suite Standard', 'Radiology', 'Full Admin Access', 'Super Admin Access'],
      'Data Anonymization Tool': ['Radiology Suite Standard', 'Radiology', 'Full Admin Access', 'Super Admin Access']
    };

    const requiredPlans = serviceAccess[serviceName];
    return requiredPlans ? requiredPlans.includes(planName) : false;
  }

  // Check usage limits
  checkUsageLimit(usageStats, serviceName) {
    if (!usageStats) {
      return { withinLimit: false, message: 'Usage data not available' };
    }

    const serviceMapping = {
      'Dr. Max AI Chatbot': {
        current: usageStats.chatbot_messages_current_period,
        limit: usageStats.limit_chatbot_messages
      },
      'Intelligent MCQ Generator': {
        current: usageStats.mcqs_generated_current_period,
        limit: usageStats.limit_mcq_generations
      },
      'Radiology Report Analysis': {
        current: usageStats.reports_analyzed_current_period,
        limit: usageStats.limit_report_analyses
      },
      'Data Anonymization Tool': {
        current: usageStats.documents_anonymized_current_period,
        limit: usageStats.limit_document_anonymizations
      }
    };

    const service = serviceMapping[serviceName];
    if (!service) {
      return { withinLimit: true, message: 'No usage limits for this service' };
    }

    if (service.limit === null || service.limit === undefined) {
      return { withinLimit: true, message: 'Unlimited usage' };
    }

    const withinLimit = service.current < service.limit;
    const remaining = Math.max(0, service.limit - service.current);

    return {
      withinLimit,
      current: service.current,
      limit: service.limit,
      remaining,
      message: withinLimit
        ? `${remaining} uses remaining this period`
        : 'Usage limit exceeded for this period'
    };
  }

  // Get billing history
  async getBillingHistory() {
    try {
      const response = await apiClient.get('/subscriptions/billing-history/');
      return { data: response.data, error: null };
    } catch (error) {
      console.error('Error fetching billing history:', error);
      return { data: null, error: error.response?.data?.detail || error.message };
    }
  }

  // Cancel subscription
  async cancelSubscription() {
    try {
      const response = await apiClient.post('/subscriptions/cancel-subscription/');
      return { data: response.data, error: null };
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      return { data: null, error: error.response?.data?.error || error.message };
    }
  }

  // Create subscription with Razorpay integration
  async createSubscription(subscriptionData) {
    try {
      console.log('Creating subscription with data:', subscriptionData);
      
      // For healthcare subscription, we'll create a Razorpay order
      const orderResult = await this.createRazorpayOrder(
        subscriptionData.plan_id, 
        subscriptionData.customer_email || ''
      );
      
      if (orderResult.error) {
        throw new Error(orderResult.error);
      }
      
      return orderResult.data;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw new Error(error.message || 'Failed to create subscription');
    }
  }

  // Create Razorpay order for custom checkout
  async createRazorpayOrder(planId, email = '') {
    try {
      const response = await apiClient.post('/subscriptions/razorpay/create-order/', {
        plan_id: planId,
        email: email
      });
      return { data: response.data, error: null };
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      return { data: null, error: error.response?.data?.error || error.message };
    }
  }

  // Verify payment after successful transaction
  async verifyPayment(paymentData) {
    try {
      const response = await apiClient.post('/subscriptions/razorpay/verify-payment/', paymentData);
      return { data: response.data, error: null };
    } catch (error) {
      console.error('Error verifying payment:', error);
      return { data: null, error: error.response?.data?.error || error.message };
    }
  }

  // Auto-create user account from payment (CRITICAL FIX)
  async createUserFromPayment(paymentData, customerInfo) {
    try {
      console.log('=== subscriptionService.createUserFromPayment ===');
      console.log('Sending to API:', {
        payment_data: paymentData,
        customer_info: customerInfo
      });

      const response = await apiClient.post('/subscriptions/create-user-from-payment/', {
        payment_data: paymentData,
        customer_info: customerInfo
      });

      console.log('API Response:', response.data);
      return { data: response.data, error: null };
    } catch (error) {
      console.error('=== API Error in createUserFromPayment ===');
      console.error('Full error:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      console.error('Response headers:', error.response?.headers);
      
      let errorMessage = 'Unknown error occurred';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error - please try again later';
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || 'Invalid request data';
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Network error - check your connection';
      } else {
        errorMessage = error.message;
      }
      
      return { data: null, error: errorMessage };
    }
  }

  // Get usage statistics for current subscription
  async getUsageStats() {
    const cacheKey = this._getCacheKey('/subscriptions/usage-stats/');
    const cached = this._getCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response = await apiClient.get('/subscriptions/usage-stats/');
      this._setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching usage stats:', error);
      return null;
    }
  }

  // Get billing history
  async getBillingHistory() {
    const cacheKey = this._getCacheKey('/subscriptions/billing-history/');
    const cached = this._getCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response = await apiClient.get('/subscriptions/billing-history/');
      this._setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching billing history:', error);
      return [];
    }
  }

  // Get available subscription plans
  async getSubscriptionPlans() {
    const cacheKey = this._getCacheKey('/subscriptions/plans/');
    const cached = this._getCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response = await apiClient.get('/subscriptions/plans/');
      this._setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      return [];
    }
  }

  // Create checkout session for subscription
  async createCheckoutSession(planId, isAnnual = false) {
    try {
      const response = await apiClient.post('/subscriptions/create-checkout-session/', {
        plan_id: planId,
        billing_cycle: isAnnual ? 'annual' : 'monthly'
      });
      return response.data.checkout_url || response.data.payment_link;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }
}

export default new SubscriptionService();