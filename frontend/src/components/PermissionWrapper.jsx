import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermissions } from '../contexts/PermissionContext';
import { Alert, Container } from 'react-bootstrap';

const PermissionWrapper = ({ 
  children, 
  requiredPermission, 
  fallbackRoute = '/dashboard',
  showError = true 
}) => {
  const { 
    canAccessPatientManagement,
    canAccessClinicManagement,
    canAccessHospitalManagement,
    canAccessUserManagement,
    isSuperAdmin,
    loading 
  } = usePermissions();

  // Show loading while permissions are being fetched
  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Checking permissions...</p>
        </div>
      </Container>
    );
  }

  // Check permissions based on the required permission
  const hasPermission = () => {
    // Super admin has access to everything
    if (isSuperAdmin()) {
      return true;
    }

    switch (requiredPermission) {
      case 'patient_management':
        return canAccessPatientManagement();
      case 'clinic_management':
        return canAccessClinicManagement();
      case 'hospital_management':
        return canAccessHospitalManagement();
      case 'user_management':
        return canAccessUserManagement();
      default:
        return false;
    }
  };

  // If user doesn't have permission
  if (!hasPermission()) {
    if (showError) {
      return (
        <Container className="py-4">
          <Alert variant="danger">
            <Alert.Heading>Access Denied</Alert.Heading>
            <p>
              You don't have permission to access this feature. Please contact your administrator 
              if you believe this is an error.
            </p>
            <hr />
            <div className="d-flex justify-content-end">
              <a href={fallbackRoute} className="btn btn-outline-danger">
                Return to Dashboard
              </a>
            </div>
          </Alert>
        </Container>
      );
    } else {
      // Silent redirect
      return <Navigate to={fallbackRoute} replace />;
    }
  }

  // User has permission, render the component
  return children;
};

export default PermissionWrapper;
