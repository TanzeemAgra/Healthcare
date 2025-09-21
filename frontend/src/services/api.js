import axios from 'axios';
import { setTokens, logout } from '../store/auth/authSlice';
import { API_CONFIG, AUTH_ENDPOINTS, buildApiUrl } from './apiConstants';


const API_BASE_URL = API_CONFIG.BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies for session-based auth
});

export const setupInterceptors = (storeInstance) => {
  apiClient.interceptors.request.use(
    async (config) => {
      // For session-based auth, add CSRF token if available
      let csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
      
      // If no CSRF token in cookies, try to fetch it from the API
      if (!csrfToken && !config.url.includes('csrf-token')) {
        try {
          const csrfResponse = await axios.get(buildApiUrl(AUTH_ENDPOINTS.CSRF_TOKEN), {
            withCredentials: true
          });
          if (csrfResponse.data.success) {
            csrfToken = csrfResponse.data.csrf_token;
          }
        } catch (error) {
          console.warn('Failed to fetch CSRF token:', error);
        }
      }
      
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
      }
      
      // Also support JWT tokens if available (for backward compatibility)
  // Prefer Redux token; fall back to localStorage for early app load cases
  const token = storeInstance.getState().auth.accessToken ||
        localStorage.getItem('access_token') ||
        localStorage.getItem('token');
      // Only attach Authorization header for real JWTs
      if (token && token !== 'session-based-auth' && !token.startsWith('demo-')) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  apiClient.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      
      // Demo mode endpoints for missing APIs
      const DEMO_ENDPOINTS = {
        '/hospital/management/users/statistics/': {
          success: true,
          statistics: {
            total_users: 42,
            active_users: 38,
            verified_users: 35,
            staff_users: 8,
            inactive_users: 4,
            unverified_users: 7,
            role_distribution: {
              admin: { name: 'Administrator', count: 3 },
              super_admin: { name: 'Super Administrator', count: 1 },
              doctor: { name: 'Doctor', count: 12 },
              nurse: { name: 'Nurse', count: 8 },
              patient: { name: 'Patient', count: 15 },
              pharmacist: { name: 'Pharmacist', count: 3 }
            },
            recent_registrations: 8,
            recent_logins: 24,
            activity_rate: 57.14
          }
        },
        '/hospital/management/users/': {
          success: true,
          users: [
            {
              id: 1,
              email: 'admin@demo.com',
              full_name: 'Demo Administrator',
              role: 'admin',
              is_active: true,
              is_verified: true,
              date_joined: new Date().toISOString(),
              last_login: new Date().toISOString()
            },
            {
              id: 2,
              email: 'doctor@demo.com',
              full_name: 'Dr. Demo Physician',
              role: 'doctor',
              is_active: true,
              is_verified: true,
              date_joined: new Date().toISOString(),
              last_login: new Date().toISOString()
            }
          ],
          pagination: {
            current_page: 1,
            total_pages: 1,
            total_count: 2,
            per_page: 10
          }
        }
      };

      // Handle demo mode for missing endpoints (404/401 errors)
      if (error.response && 
          (error.response.status === 404 || error.response.status === 401) && 
          originalRequest.url) {
        
        // Check if this is a demo-able endpoint
        const urlPath = originalRequest.url.replace(API_BASE_URL, '');
        const demoData = DEMO_ENDPOINTS[urlPath];
        
        if (demoData) {
          console.log(`API - Using demo mode for: ${urlPath}`);
          return Promise.resolve({
            data: demoData,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: originalRequest
          });
        }

        // Handle subscription-related 401 errors silently (except public endpoints)
        if ((originalRequest.url.includes('/subscriptions/') || 
             originalRequest.url.includes('subscription')) &&
            !originalRequest.url.includes('/subscriptions/plans/')) {
          console.log('API - Subscription 401 error handled silently (demo mode)');
          const customError = new Error('Subscription API unavailable - using demo mode');
          customError.response = error.response;
          customError.isSubscriptionError = true;
          return Promise.reject(customError);
        }
      }
      
      // Check if it's a 401 error and not a retry request
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Mark as retried to prevent infinite loops

        const refreshToken = storeInstance.getState().auth.refreshToken;
        
        // If we have a refresh token, try JWT token refresh
        if (refreshToken && refreshToken !== 'session-based-auth') {
          try {
            // Use a new, clean Axios instance for the refresh token request
            // to avoid the interceptor loop if the refresh itself fails with 401
            const refreshAxiosInstance = axios.create({ baseURL: API_BASE_URL });
            const response = await refreshAxiosInstance.post('/hospital/token/refresh/', {
              refresh: refreshToken,
            });
            const { access, refresh: newRefreshToken } = response.data;
            
            // Dispatch action to update tokens in Redux store and localStorage
            storeInstance.dispatch(setTokens({ access, refresh: newRefreshToken || refreshToken }));

            // Update the authorization header for the original request
            originalRequest.headers['Authorization'] = `Bearer ${access}`;
            
            // Retry the original request with the new token using the main apiClient
            return apiClient(originalRequest);
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            
            // SUPER ADMIN PROTECTION: Don't logout if super admin is accessing SecureNeat
            const protectedRouteFlag = localStorage.getItem('superAdminDetected');
            const currentPath = window.location.pathname;
            
            if (protectedRouteFlag === 'true' && currentPath.includes('/SecureNeat')) {
              console.log('Preserving super admin session for SecureNeat access');
              // Return a rejection but don't clear tokens
              return Promise.reject(refreshError);
            }
            
            console.log('Clearing invalid tokens - user needs to login again');
            storeInstance.dispatch(logout()); // Dispatch logout action
            
            // Clear any invalid tokens from localStorage
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            localStorage.removeItem('token'); // Legacy token
            
            return Promise.reject(refreshError);
          }
        } else {
          // For session-based auth, just log the user out
          console.log('Session authentication failed - clearing auth state');
          storeInstance.dispatch(logout());
          
          // Clear session-related storage
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
      return Promise.reject(error);
    }
  );
};

export default apiClient;
export { apiClient };

// Public subscription plans API (no authentication required)
export const subscriptionAPI = {
  // Get public subscription plans for signup page
  getPublicPlans: () => {
    // Create a temporary axios instance without authentication for public endpoints
    const publicClient = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return publicClient.get('/subscriptions/plans/');
  },
};

// Admin Subscription API functions
export const adminAPI = {
  // Get admin overview statistics
  getOverview: () => apiClient.get('/subscriptions/admin/overview/'),
  
  // Get comprehensive dashboard statistics with real-time data
  getDashboardStats: () => apiClient.get('/subscriptions/admin/dashboard-stats/'),
  
  // Get all subscriptions with pagination and filtering
  getSubscriptions: (params = {}) => apiClient.get('/subscriptions/admin/subscriptions/', { params }),
  
  // Get all users with pagination and filtering
  getUsers: (params = {}) => apiClient.get('/subscriptions/admin/users/', { params }),
  
  // Get all subscription plans
  getPlans: () => apiClient.get('/subscriptions/admin/plans/'),
  
  // Get billing history with pagination
  getBillingHistory: (params = {}) => apiClient.get('/subscriptions/admin/billing/', { params }),
  
  // Get usage statistics
  getUsageStats: (params = {}) => apiClient.get('/subscriptions/admin/usage-stats/', { params }),
  
  // Get revenue data for charts
  getRevenueData: (params = {}) => apiClient.get('/subscriptions/admin/revenue/', { params }),
  
  // Perform subscription actions (activate, deactivate, change plan, etc.)
  subscriptionAction: (data) => apiClient.post('/subscriptions/admin/subscription-action/', data),
  
  // Create new subscription plan
  createPlan: (planData) => apiClient.post('/subscriptions/admin/subscription-action/', {
    action: 'create_plan',
    ...planData
  }),
};

// Doctor Management API functions
export const doctorAPI = {
  // Get all doctors
  getDoctors: (params = {}) => apiClient.get('/medicine/doctors/', { params }),
  
  // Get doctor by ID
  getDoctor: (id) => apiClient.get(`/medicine/doctors/${id}/`),
  
  // Create new doctor
  createDoctor: (doctorData) => apiClient.post('/medicine/doctors/', doctorData),
  
  // Update doctor
  updateDoctor: (id, doctorData) => apiClient.patch(`/medicine/doctors/${id}/`, doctorData),
  
  // Delete doctor
  deleteDoctor: (id) => apiClient.delete(`/medicine/doctors/${id}/`),
  
  // Get doctor statistics
  getDoctorStats: (id) => apiClient.get(`/medicine/doctors/${id}/statistics/`),
  
  // Get doctor appointments
  getDoctorAppointments: (id, params = {}) => apiClient.get(`/medicine/doctors/${id}/appointments/`, { params }),
  
  // Get doctor schedule
  getDoctorSchedule: (id, params = {}) => apiClient.get(`/medicine/doctors/${id}/schedule/`, { params }),
  
  // Logout function
  logout: () => apiClient.post('/auth/logout/'),
};

// Contact Form API
export const contactAPI = {
  // Submit contact form
  submitContactForm: (formData) => {
    // Handle both FormData and regular objects
    const config = {
      headers: {
        'Content-Type': formData instanceof FormData ? 'multipart/form-data' : 'application/json'
      }
    };
    
    return apiClient.post('/api/hospital/contact/submit/', formData, config);
  }
};