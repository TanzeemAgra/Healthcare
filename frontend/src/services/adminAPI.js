// Import the base API client
import { apiClient } from './api';

// User Management API functions
export const userAPI = {
  // Get all users with optional filters
  getUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/users/${queryString ? `?${queryString}` : ''}`);
  },

  // Get user by ID
  getUser: async (userId) => {
    return apiClient.get(`/users/${userId}/`);
  },

  // Create new user
  createUser: async (userData) => {
    return apiClient.post('/hospital/register/', userData);
  },

  // Update user
  updateUser: async (userId, userData) => {
    return apiClient.patch(`/users/${userId}/`, userData);
  },

  // Delete user
  deleteUser: async (userId) => {
    return apiClient.delete(`/users/${userId}/`);
  },

  // Toggle user status (activate/deactivate)
  toggleUserStatus: async (userId, isActive) => {
    return apiClient.patch(`/users/${userId}/`, { is_active: isActive });
  },

  // Get user statistics
  getUserStats: async () => {
    return apiClient.get('/users/stats/');
  },

  // Bulk operations
  bulkUpdateUsers: async (userIds, updateData) => {
    return apiClient.post('/users/bulk-update/', {
      user_ids: userIds,
      update_data: updateData
    });
  },

  // Export users
  exportUsers: async (format = 'csv', filters = {}) => {
    const params = { format, ...filters };
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/users/export/?${queryString}`, {
      responseType: 'blob'
    });
  }
};

// Subscription Management API functions
export const subscriptionAPI = {
  // Get subscription overview/stats
  getOverview: async (params = {}) => {
    return apiClient.get('/subscriptions/admin/overview/', { params });
  },

  // Get all subscriptions
  getSubscriptions: async (params = {}) => {
    return apiClient.get('/subscriptions/admin/subscriptions/', { params });
  },

  // Get subscription by ID
  getSubscription: async (subscriptionId) => {
    return apiClient.get(`/subscriptions/admin/subscriptions/${subscriptionId}/`);
  },

  // Get all plans
  getPlans: async () => {
    return apiClient.get('/subscriptions/admin/plans/');
  },

  // Create new plan
  createPlan: async (planData) => {
    return apiClient.post('/subscriptions/admin/plans/', planData);
  },

  // Update plan
  updatePlan: async (planId, planData) => {
    return apiClient.patch(`/subscriptions/admin/plans/${planId}/`, planData);
  },

  // Delete plan
  deletePlan: async (planId) => {
    return apiClient.delete(`/subscriptions/admin/plans/${planId}/`);
  },

  // Subscription actions (cancel, reactivate, etc.)
  subscriptionAction: async (actionData) => {
    return apiClient.post('/subscriptions/admin/subscription-action/', actionData);
  },

  // Get billing history
  getBillingHistory: async (params = {}) => {
    return apiClient.get('/subscriptions/admin/billing/', { params });
  },

  // Get usage statistics
  getUsageStats: async (params = {}) => {
    return apiClient.get('/subscriptions/admin/usage-stats/', { params });
  },

  // Revenue analytics
  getRevenueData: async (period = '30d') => {
    return apiClient.get(`/subscriptions/admin/revenue-analytics/?period=${period}`);
  },

  // Churn analysis
  getChurnAnalysis: async (period = '6m') => {
    return apiClient.get(`/subscriptions/admin/churn-analysis/?period=${period}`);
  },

  // Plan analytics
  getPlanAnalytics: async () => {
    return apiClient.get('/subscriptions/admin/plan-analytics/');
  }
};

// Admin Dashboard API functions
export const adminAPI = {
  // Dashboard overview data
  getDashboardOverview: async () => {
    return apiClient.get('/admin/dashboard/overview/');
  },

  // System health and performance
  getSystemHealth: async () => {
    return apiClient.get('/admin/system/health/');
  },

  // Recent activity feed
  getRecentActivity: async (limit = 10) => {
    return apiClient.get(`/admin/activity/?limit=${limit}`);
  },

  // System alerts
  getSystemAlerts: async () => {
    return apiClient.get('/admin/alerts/');
  },

  // Performance metrics
  getPerformanceMetrics: async (period = '24h') => {
    return apiClient.get(`/admin/performance/?period=${period}`);
  },

  // Export various reports
  exportReport: async (reportType, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/admin/reports/${reportType}/?${queryString}`, {
      responseType: 'blob'
    });
  },

  // System settings
  getSystemSettings: async () => {
    return apiClient.get('/admin/settings/');
  },

  updateSystemSettings: async (settings) => {
    return apiClient.patch('/admin/settings/', settings);
  },

  // Notification management
  sendNotification: async (notificationData) => {
    return apiClient.post('/admin/notifications/', notificationData);
  },

  getNotifications: async (params = {}) => {
    return apiClient.get('/admin/notifications/', { params });
  },

  markNotificationRead: async (notificationId) => {
    return apiClient.patch(`/admin/notifications/${notificationId}/`, { read: true });
  }
};

// Analytics API functions
export const analyticsAPI = {
  // User analytics
  getUserAnalytics: async (period = '30d') => {
    return apiClient.get(`/analytics/users/?period=${period}`);
  },

  // Revenue analytics
  getRevenueAnalytics: async (period = '30d') => {
    return apiClient.get(`/analytics/revenue/?period=${period}`);
  },

  // Feature usage analytics
  getFeatureUsage: async (period = '30d') => {
    return apiClient.get(`/analytics/features/?period=${period}`);
  },

  // Geographic analytics
  getGeographicData: async () => {
    return apiClient.get('/analytics/geographic/');
  },

  // Cohort analysis
  getCohortAnalysis: async (period = '6m') => {
    return apiClient.get(`/analytics/cohort/?period=${period}`);
  },

  // Funnel analysis
  getFunnelAnalysis: async (funnelType) => {
    return apiClient.get(`/analytics/funnel/${funnelType}/`);
  },

  // Custom analytics query
  customQuery: async (queryData) => {
    return apiClient.post('/analytics/custom/', queryData);
  }
};

// Utility functions for API responses
export const apiUtils = {
  // Handle API errors consistently
  handleError: (error) => {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data.message || 'An error occurred',
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      // Network error
      return {
        message: 'Network error. Please check your connection.',
        status: 0,
        data: null
      };
    } else {
      // Other error
      return {
        message: error.message || 'An unexpected error occurred',
        status: 0,
        data: null
      };
    }
  },

  // Format API response for consistent handling
  formatResponse: (response) => {
    return {
      data: response.data,
      status: response.status,
      headers: response.headers
    };
  },

  // Build query string from parameters
  buildQueryString: (params) => {
    const filtered = Object.entries(params)
      .filter(([key, value]) => value !== null && value !== undefined && value !== '')
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
    
    return new URLSearchParams(filtered).toString();
  },

  // Parse error messages for user display
  parseErrorMessage: (error) => {
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    if (error.detail) return error.detail;
    if (error.non_field_errors) return error.non_field_errors.join(', ');
    
    // Handle field-specific errors
    const fieldErrors = Object.entries(error)
      .filter(([key, value]) => Array.isArray(value))
      .map(([key, value]) => `${key}: ${value.join(', ')}`)
      .join('; ');
    
    return fieldErrors || 'An error occurred';
  }
};

// Real-time features (WebSocket connections)
export const realtimeAPI = {
  // WebSocket connection for real-time updates
  connect: (onMessage, onError = null, onClose = null) => {
    const wsUrl = `${process.env.REACT_APP_WS_URL || 'ws://localhost:8000'}/ws/admin/`;
    const socket = new WebSocket(wsUrl);
    
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (onError) onError(error);
    };
    
    socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
      if (onClose) onClose(event);
    };
    
    return socket;
  },

  // Send message through WebSocket
  send: (socket, message) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not open');
    }
  }
};

// Cache management for API responses
export const cacheAPI = {
  // Simple in-memory cache
  cache: new Map(),
  
  // Get from cache
  get: (key) => {
    const item = cacheAPI.cache.get(key);
    if (item && Date.now() < item.expiry) {
      return item.data;
    }
    cacheAPI.cache.delete(key);
    return null;
  },
  
  // Set cache with TTL (time to live in milliseconds)
  set: (key, data, ttl = 300000) => { // Default 5 minutes
    cacheAPI.cache.set(key, {
      data,
      expiry: Date.now() + ttl
    });
  },
  
  // Clear cache
  clear: (key = null) => {
    if (key) {
      cacheAPI.cache.delete(key);
    } else {
      cacheAPI.cache.clear();
    }
  },
  
  // Cached API call wrapper
  cachedCall: async (key, apiCall, ttl = 300000) => {
    const cached = cacheAPI.get(key);
    if (cached) return cached;
    
    try {
      const result = await apiCall();
      cacheAPI.set(key, result, ttl);
      return result;
    } catch (error) {
      throw error;
    }
  }
};
