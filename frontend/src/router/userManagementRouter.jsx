/**
 * User Management Router - Soft Coding Implementation
 * Centralized routing and configuration for user management system
 * Provides robust error handling and fallback mechanisms
 */

import { lazy, Suspense } from 'react';
import { USER_MANAGEMENT_ENDPOINTS } from '../services/apiConstants';

// Loading fallback component
const LoadingFallback = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading User Management...</span>
    </div>
  </div>
);

// Error fallback component for user management
const UserManagementErrorFallback = ({ componentName, error }) => (
  <div className="container mt-4">
    <div className="alert alert-warning">
      <h5>⚠️ User Management System Error</h5>
      <p>Failed to load {componentName}: {error?.message || 'Unknown error'}</p>
      <hr />
      <small className="text-muted">
        This may be due to:
        <ul className="mb-0 mt-2">
          <li>Network connectivity issues</li>
          <li>Backend server not running</li>
          <li>Authentication problems</li>
          <li>Missing permissions</li>
        </ul>
        Please check your connection and try refreshing the page.
      </small>
    </div>
  </div>
);

// Dynamic component loader with comprehensive error handling
const createUserManagementComponent = (componentPath, componentName) => {
  return lazy(async () => {
    try {
      const module = await import(componentPath);
      if (module.default) {
        return { default: module.default };
      } else {
        console.error(`User Management Component ${componentName} does not have a default export`);
        return { 
          default: () => <UserManagementErrorFallback 
            componentName={componentName} 
            error={new Error('No default export found')} 
          />
        };
      }
    } catch (error) {
      console.error(`Failed to load user management component ${componentName}:`, error);
      return { 
        default: () => <UserManagementErrorFallback 
          componentName={componentName} 
          error={error} 
        />
      };
    }
  });
};

// User Management Components - Soft Coded
export const UserManagementComponents = {
  SimpleAdminCreation: createUserManagementComponent('../views/user-management/SimpleAdminCreation', 'SimpleAdminCreation'),
  EnhancedUserManagement: createUserManagementComponent('../views/user-management/EnhancedUserManagement', 'EnhancedUserManagement'),
  UserManagementSimple: createUserManagementComponent('../views/user-management/UserManagementSimple', 'UserManagementSimple'),
  UserManagementRoutes: createUserManagementComponent('../views/user-management/UserManagementRoutes', 'UserManagementRoutes'),
  UserManagement: createUserManagementComponent('../views/user-management/UserManagement', 'UserManagement')
};

// Safe component wrapper
export const SafeUserManagementComponent = ({ component: Component, fallbackName, ...props }) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component {...props} />
  </Suspense>
);

// Route configuration using API constants
export const USER_MANAGEMENT_ROUTES = {
  BASE: '/admin',
  USER_MANAGEMENT: '/admin/user-management',
  USER_MANAGEMENT_FULL: '/admin/user-management-full',
  USERS_LEGACY: '/admin/users',
  USER_MANAGEMENT_WILDCARD: '/user-management/*',
  STAFF_MANAGEMENT: '/admin/staff-management',
  ANALYTICS: '/admin/analytics'
};

// User management configuration
export const USER_MANAGEMENT_CONFIG = {
  API_BASE: USER_MANAGEMENT_ENDPOINTS.LIST_USERS.split('/users/')[0],
  ENDPOINTS: USER_MANAGEMENT_ENDPOINTS,
  FEATURES: {
    CREATE_USER: true,
    CREATE_ADMIN: true,
    BULK_ACTIONS: true,
    EXPORT_USERS: true,
    USER_ANALYTICS: true,
    PERMISSION_MANAGEMENT: true
  },
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100
  },
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 8,
    REQUIRED_FIELDS: ['username', 'email', 'first_name', 'last_name'],
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
};

// API endpoint validation
export const validateUserManagementEndpoints = () => {
  const requiredEndpoints = ['LIST_USERS', 'CREATE_USER', 'CREATE_ADMIN', 'USER_DETAILS'];
  const missingEndpoints = requiredEndpoints.filter(endpoint => !USER_MANAGEMENT_ENDPOINTS[endpoint]);
  
  if (missingEndpoints.length > 0) {
    console.warn('Missing user management endpoints:', missingEndpoints);
    return false;
  }
  
  return true;
};

// Permission checking helper
export const checkUserManagementPermissions = (userPermissions) => {
  const requiredPermissions = ['create_user', 'manage_users', 'admin_access'];
  const hasPermissions = requiredPermissions.some(perm => 
    userPermissions?.includes(perm) || userPermissions?.admin_features?.includes(perm)
  );
  
  if (!hasPermissions) {
    console.warn('User lacks required permissions for user management');
  }
  
  return hasPermissions;
};

// Initialize user management module
export const initializeUserManagementModule = (userPermissions = null) => {
  const endpointsValid = validateUserManagementEndpoints();
  const permissionsValid = userPermissions ? checkUserManagementPermissions(userPermissions) : true;
  
  if (endpointsValid && permissionsValid) {
    console.log('User Management module initialized successfully');
    return { success: true, message: 'Module ready' };
  } else {
    const errors = [];
    if (!endpointsValid) errors.push('Invalid API endpoints');
    if (!permissionsValid) errors.push('Insufficient permissions');
    
    console.error('User Management module initialization failed:', errors);
    return { success: false, errors };
  }
};

// Error recovery utilities
export const UserManagementErrorRecovery = {
  retryApiCall: async (apiCall, maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await apiCall();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
      }
    }
  },
  
  handleAuthError: (error) => {
    if (error.response?.status === 401) {
      console.warn('Authentication error in user management, redirecting to login');
      window.location.href = '/login';
      return true;
    }
    return false;
  },
  
  getErrorMessage: (error) => {
    if (error.response?.data?.message) return error.response.data.message;
    if (error.response?.data?.error) return error.response.data.error;
    if (error.message) return error.message;
    return 'An unexpected error occurred';
  }
};

export default {
  UserManagementComponents,
  SafeUserManagementComponent,
  USER_MANAGEMENT_ROUTES,
  USER_MANAGEMENT_CONFIG,
  validateUserManagementEndpoints,
  checkUserManagementPermissions,
  initializeUserManagementModule,
  UserManagementErrorRecovery
};
