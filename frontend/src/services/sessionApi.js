import axios from 'axios';

// Use correct port and configure for session-based authentication
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Create axios instance configured for session-based auth
const sessionApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This ensures cookies are sent with requests
});

// Add CSRF token handling for session-based authentication
sessionApiClient.interceptors.request.use(
  (config) => {
    // Get CSRF token from cookie if available
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
    
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses for session-based auth
sessionApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Session expired or user not authenticated
      console.log('Session authentication failed - redirecting to login');
      // Clear any stored authentication data
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      // Optionally redirect to login
      // window.location.href = '/auth/sign-in';
    }
    return Promise.reject(error);
  }
);

export default sessionApiClient;
