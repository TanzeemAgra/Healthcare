import React from 'react';
import { usePermissions } from '../../contexts/PermissionContext';
import AccessDenied from './AccessDenied';

/**
 * Higher-Order Component for protecting routes based on permissions
 * Usage: <ProtectedRoute permission="canAccessDoctorManagement" moduleName="Doctor Management">
 *          <YourComponent />
 *        </ProtectedRoute>
 */
const ProtectedRoute = ({ 
  children, 
  permission, 
  moduleName = "this module",
  fallbackComponent = null 
}) => {
  const permissions = usePermissions();
  
  // Handle loading state
  if (permissions.loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Checking permissions...</p>
        </div>
      </div>
    );
  }
  
  // Check if user has the required permission
  const hasPermission = typeof permission === 'string' 
    ? permissions[permission]?.() 
    : permission();
  
  if (!hasPermission) {
    return fallbackComponent || (
      <AccessDenied 
        message={`You don't have permission to access ${moduleName}.`}
        moduleName={moduleName}
      />
    );
  }
  
  return children;
};

/**
 * Hook for checking permissions within components
 */
export const usePermissionCheck = (permission) => {
  const permissions = usePermissions();
  
  const hasPermission = typeof permission === 'string' 
    ? permissions[permission]?.() 
    : permission();
    
  return {
    hasPermission,
    loading: permissions.loading,
    permissions
  };
};

export default ProtectedRoute;
