import { useState, useEffect, createContext, useContext } from 'react';
import apiClient from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for existing auth token or session
    const token = localStorage.getItem('authToken');
    if (token) {
      // Validate token and set user info
      setIsAuthenticated(true);
      // Check if user is admin
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        setIsAdmin(u?.role === 'admin' || u?.role === 'super_admin');
        setUser(u);
      }
    }
  }, []);

  const login = async (credentials) => {
    try {
      // Make API call to login
  const { data } = await apiClient.post('/auth/login/', credentials);
  const access = data?.access || data?.token || 'session-based-auth';
  localStorage.setItem('authToken', access);
  localStorage.setItem('user', JSON.stringify(data?.user || null));
      setIsAuthenticated(true);
  setUser(data.user);
  setIsAdmin(data.user?.role === 'admin' || data.user?.role === 'super_admin');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    isAdmin,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
