import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePermissions } from '../contexts/PermissionContext';

// Direct imports to avoid lazy loading issues
import AdminDashboard from '../views/admin/AdminDashboard';
import SimpleAdminCreation from '../views/user-management/SimpleAdminCreation';
import PermissionDashboard from '../views/permissions/PermissionDashboard';
import SystemSettings from '../views/admin/SystemSettings';

// SOFT CODING: Centralized route configuration
const ADMIN_ROUTES = {
  DASHBOARD: {
    path: '/admin/dashboard',
    title: 'Admin Dashboard',
    component: AdminDashboard,
    requiresAuth: true,
    requiredRole: ['super_admin', 'admin'],
    fallbackRoute: '/login'
  },
  USER_MANAGEMENT: {
    path: '/admin/user-management',
    title: 'User Management',
    component: SimpleAdminCreation,
    requiresAuth: true,
    requiredRole: ['super_admin'],
    fallbackRoute: '/admin/dashboard'
  },
  PERMISSIONS: {
    path: '/admin/permissions',
    title: 'Permission Management',
    component: PermissionDashboard,
    requiresAuth: true,
    requiredRole: ['super_admin'],
    fallbackRoute: '/admin/dashboard'
  },
  SETTINGS: {
    path: '/admin/settings',
    title: 'System Settings',
    component: SystemSettings,
    requiresAuth: true,
    requiredRole: ['super_admin'],
    fallbackRoute: '/admin/dashboard'
  }
};

// Authentication guard component with soft coding
const AuthGuard = ({ children, route }) => {
  const { user, isAuthenticated } = useAuth();
  const { isSuperAdmin } = usePermissions();
  
  // Authentication check
  if (!isAuthenticated) {
    console.log(`🔒 Authentication required for ${route.title}`);
    return <Navigate to={route.fallbackRoute} replace />;
  }
  
  // Role-based access control using soft coding
  const hasRequiredRole = () => {
    const userRole = user?.role;
    if (!route.requiredRole || route.requiredRole.length === 0) return true;
    
    // Check if user has any of the required roles
    return route.requiredRole.some(role => {
      if (role === 'super_admin') return isSuperAdmin || userRole === 'super_admin';
      if (role === 'admin') return userRole === 'admin' || userRole === 'super_admin';
      return userRole === role;
    });
  };
  
  if (!hasRequiredRole()) {
    console.log(`🚫 Insufficient permissions for ${route.title}. Required: ${route.requiredRole}, User: ${user?.role}`);
    
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-warning">
          <div className="d-flex align-items-center">
            <i className="fas fa-shield-alt me-3 fs-4"></i>
            <div>
              <h5 className="alert-heading mb-2">Access Restricted</h5>
              <p className="mb-2">
                You don't have permission to access <strong>{route.title}</strong>.
              </p>
              <p className="mb-3">
                <small>
                  Required role: <span className="badge bg-primary">{route.requiredRole.join(' or ')}</span><br/>
                  Your role: <span className="badge bg-secondary">{user?.role || 'unknown'}</span>
                </small>
              </p>
              <a href={route.fallbackRoute} className="btn btn-primary btn-sm">
                <i className="fas fa-arrow-left me-2"></i>Go Back
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return children;
};

// Enhanced route component
const ProtectedRoute = ({ route }) => {
  const Component = route.component;
  
  return (
    <AuthGuard route={route}>
      <Component />
    </AuthGuard>
  );
};

// Main Admin Router Component
const AdminDashboardRouter = () => {
  console.log('🚀 Admin Dashboard Router initialized');
  console.log('📊 Available routes:', Object.keys(ADMIN_ROUTES));
  
  return (
    <Routes>
      {/* Admin Dashboard Route */}
      <Route
        path="/dashboard"
        element={<ProtectedRoute route={ADMIN_ROUTES.DASHBOARD} />}
      />
      
      {/* User Management Route */}
      <Route
        path="/user-management"
        element={<ProtectedRoute route={ADMIN_ROUTES.USER_MANAGEMENT} />}
      />
      
      {/* Permission Management Route */}
      <Route
        path="/permissions"
        element={<ProtectedRoute route={ADMIN_ROUTES.PERMISSIONS} />}
      />
      
      {/* System Settings Route */}
      <Route
        path="/settings"
        element={<ProtectedRoute route={ADMIN_ROUTES.SETTINGS} />}
      />
      
      {/* Default redirect to dashboard */}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default AdminDashboardRouter;
