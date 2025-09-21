import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setTokens } from '../store/auth/authSlice';
import apiClient from '../services/api';
import { AUTH_ENDPOINTS } from '../services/apiConstants';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Return a default context instead of throwing an error
    console.warn('useAuth called outside of AuthProvider, returning default values');
    return {
      isAuthenticated: false,
      user: null,
      loading: false,
      login: async () => ({ success: false, error: 'Auth not available' }),
      logout: () => {},
      register: async () => ({ success: false, error: 'Auth not available' }),
      isSuperAdmin: () => false,
      isAdmin: () => false,
      isDoctor: () => false,
      isNurse: () => false,
      isPatient: () => false,
      isPharmacist: () => false,
      hasSubscriptionBypass: () => false,
      canAccessAdmin: () => false,
      canManageUsers: () => false,
      canManageSubscriptions: () => false,
      canAccessSystemSettings: () => false,
    };
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // Initialize auth state from localStorage
  useEffect(() => {
    // Check if user is already logged in from localStorage
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('access_token') || localStorage.getItem('token');
        
        if (storedUser && storedToken) {
          console.log('🔍 Found existing auth data, restoring session...');
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
          console.log('✅ Auth state restored from localStorage');
        } else {
          console.log('❌ No existing auth data found');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Helper functions to check user roles
  const isSuperAdmin = () => {
    return user?.role === 'super_admin' || 
           user?.user_role === 'super_admin' || 
           user?.is_superuser === true;
  };

  const isAdmin = () => {
    return user?.role === 'admin' || 
           user?.role === 'super_admin' || 
           user?.user_role === 'admin' ||
           user?.user_role === 'super_admin' ||
           user?.is_staff === true;
  };

  const isDoctor = () => {
    return user?.role === 'doctor';
  };

  const isNurse = () => {
    return user?.role === 'nurse';
  };

  const isPatient = () => {
    return user?.role === 'patient';
  };

  const isPharmacist = () => {
    return user?.role === 'pharmacist';
  };

  // Check if user has subscription bypass (super admin always bypasses)
  const hasSubscriptionBypass = () => {
    return isSuperAdmin() || user?.subscription_bypass;
  };

  // Check if user can access admin features
  const canAccessAdmin = () => {
    return isAdmin() || isSuperAdmin();
  };

  // Check if user can manage other users
  const canManageUsers = () => {
    return isSuperAdmin(); // Only super admin can manage users
  };

  // Check if user can manage subscriptions
  const canManageSubscriptions = () => {
    return isSuperAdmin(); // Only super admin can manage subscriptions
  };

  // Check if user can access system settings
  const canAccessSystemSettings = () => {
    return isSuperAdmin(); // Only super admin can access system settings
  };

  // Login function
  const login = async (email, password) => {
    try {
      // Try actual API first
      try {
        const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN, { email, password });

        if (response && (response.status >= 200 && response.status < 300)) {
          const data = response.data || {};
          
          // Store token in the format expected by Redux/API interceptor
          const accessToken = data.token || data.access_token || data.access || 'session-based-auth';
          const refreshToken = data.refresh_token || data.refresh || null;
          
          localStorage.setItem('token', accessToken);
          localStorage.setItem('access_token', accessToken);
          if (refreshToken) {
            localStorage.setItem('refresh_token', refreshToken);
          }
          localStorage.setItem('user', JSON.stringify(data.user));
          
          // Update Redux store (authSlice expects keys: access, refresh)
          dispatch(setTokens({
            access: accessToken,
            refresh: refreshToken,
          }));
          // Persist user in Redux as well
          dispatch({ type: 'auth/setUser', payload: data.user });
          
          setUser(data.user);
          setIsAuthenticated(true);
          
          // For session-based auth, also store a flag to indicate successful login
          if (accessToken === 'session-based-auth') {
            localStorage.setItem('sessionAuthenticated', 'true');
            console.log('✅ Session-based authentication successful');
          }
          
          return { success: true, user: data.user };
        } else {
          return { success: false, error: 'Login failed' };
        }
      } catch (apiError) {
        console.warn('API not available, falling back to demo mode:', apiError);
        
        // Fallback to demo mode for super admin
        if ((email === 'mastermind@xerxez.in' || email === 'mastermind@xerxez.com') && password === 'Tanzilla@tanzeem786') {
          const superAdminUser = {
            id: 1,
            email: email, // Use the email that was entered
            username: 'mastermind',
            full_name: 'Super Administrator',
            role: 'super_admin',
            is_super_admin: true,
            is_superuser: true,
            is_staff: true,
            is_active: true,
            is_verified: true,
            subscription_bypass: true
          };

          const token = 'demo-super-admin-token';
          
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(superAdminUser));
          
          setUser(superAdminUser);
          setIsAuthenticated(true);
          
          return { success: true, user: superAdminUser };
        } else {
          return { success: false, error: 'Invalid credentials' };
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  // Logout function
  const logout = () => {
    // Clear all authentication-related localStorage items
    localStorage.removeItem('token');        // Legacy token
    localStorage.removeItem('accessToken'); // JWT access token
    localStorage.removeItem('refreshToken'); // JWT refresh token
    localStorage.removeItem('access_token'); // Alternative key format
    localStorage.removeItem('refresh_token'); // Alternative key format
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');    // Alternative token key
    localStorage.removeItem('selectedPlan'); // Clear any plan selection
    localStorage.removeItem('selectedPlanId'); // Clear plan ID
    localStorage.removeItem('paymentVerification'); // Clear payment data
    localStorage.removeItem('customerInfo'); // Clear customer data
    localStorage.removeItem('userRole'); // Clear any stored role
    
    setUser(null);
    setIsAuthenticated(false);
    
    // Also dispatch Redux logout to clear store
    dispatch({ type: 'auth/logout' });
  };

  // Register function
  const register = async (userData) => {
    try {
      // TODO: Replace with actual API call
      const response = await apiClient.post('/auth/register/', userData);
      if (response.status >= 200 && response.status < 300) {
        return { success: true, message: 'Registration successful' };
      }
      return { success: false, error: response.data?.error || 'Registration failed' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const value = {
    // Auth state
    isAuthenticated,
    user,
    loading,
    
    // Auth actions
    login,
    logout,
    register,
    
    // Role checks
    isSuperAdmin,
    isAdmin,
    isDoctor,
    isNurse,
    isPatient,
    isPharmacist,
    
    // Permission checks
    hasSubscriptionBypass,
    canAccessAdmin,
    canManageUsers,
    canManageSubscriptions,
    canAccessSystemSettings,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
