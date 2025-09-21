import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../../contexts/PermissionContext';

const AdminAuthStatus = () => {
  const { user, isAuthenticated } = useAuth();
  const { isSuperAdmin, permissions, loading } = usePermissions();
  
  if (loading) {
    return (
      <div className="alert alert-info">
        <i className="fas fa-spinner fa-spin me-2"></i>
        Loading authentication status...
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <div className="alert alert-danger">
        <div className="d-flex align-items-center">
          <i className="fas fa-exclamation-triangle me-3"></i>
          <div>
            <strong>Authentication Required</strong>
            <p className="mb-0">You must be logged in to access the admin dashboard.</p>
          </div>
          <a href="/login" className="btn btn-danger btn-sm ms-auto">
            <i className="fas fa-sign-in-alt me-2"></i>Login
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`alert alert-${isSuperAdmin ? 'success' : 'warning'}`}>
      <div className="d-flex align-items-center">
        <i className={`fas fa-${isSuperAdmin ? 'shield-check' : 'shield-alt'} me-3`}></i>
        <div className="flex-grow-1">
          <strong>Admin Dashboard Access</strong>
          <div className="mt-1">
            <small>
              User: <span className="badge bg-primary">{user?.email || 'Unknown'}</span>
              <span className="ms-2">
                Role: <span className={`badge bg-${isSuperAdmin ? 'success' : 'warning'}`}>
                  {user?.role || 'Unknown'}
                </span>
              </span>
              {isSuperAdmin && (
                <span className="ms-2">
                  <span className="badge bg-danger">Super Admin</span>
                </span>
              )}
            </small>
          </div>
        </div>
        <i className={`fas fa-check-circle text-${isSuperAdmin ? 'success' : 'warning'}`}></i>
      </div>
    </div>
  );
};

export default AdminAuthStatus;
