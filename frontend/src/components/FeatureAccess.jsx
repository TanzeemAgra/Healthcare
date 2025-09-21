import React from 'react';
import { useSelector } from 'react-redux';
import { hasFeatureAccess } from '../utils/featureAccess';
import { Alert, Container, Button } from 'react-bootstrap';
import { RiLockLine, RiHomeLine } from '@remixicon/react';

/**
 * Higher-Order Component for protecting components based on feature access
 * @param {React.Component} WrappedComponent - Component to protect
 * @param {string} requiredFeature - Feature code required to access the component
 * @param {Object} options - Additional options
 * @returns {React.Component} - Protected component
 */
export const withFeatureAccess = (WrappedComponent, requiredFeature, options = {}) => {
  const ProtectedComponent = (props) => {
    const user = useSelector(state => state.auth?.user);
    
    // Check if user has access to the required feature
    const hasAccess = hasFeatureAccess(user, requiredFeature);
    
    if (!hasAccess) {
      return (
        <Container className="py-5">
          <div className="text-center">
            <div className="mb-4">
              <div 
                className="bg-danger bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: '80px', height: '80px' }}
              >
                <RiLockLine size={32} className="text-danger" />
              </div>
              <h3 className="fw-bold text-dark mb-2">Access Restricted</h3>
              <p className="text-muted mb-4">
                You don't have permission to access the <strong>{requiredFeature}</strong> feature.
                <br />
                Please contact your administrator to request access.
              </p>
            </div>
            
            <Alert variant="warning" className="text-start">
              <div className="d-flex align-items-start">
                <RiLockLine size={18} className="text-warning me-2 mt-1 flex-shrink-0" />
                <div>
                  <h6 className="fw-semibold text-warning mb-1">Feature Access Required</h6>
                  <p className="mb-2 small">
                    This section requires access to the <strong>{requiredFeature}</strong> feature. 
                    Your current role (<strong>{user?.role}</strong>) doesn't include this feature.
                  </p>
                  <p className="mb-0 small">
                    <strong>Your accessible features:</strong>
                    <br />
                    {user?.enabled_features && Array.isArray(user.enabled_features) && user.enabled_features.length > 0 
                      ? user.enabled_features.join(', ')
                      : 'No features assigned'
                    }
                  </p>
                </div>
              </div>
            </Alert>
            
            <Button 
              variant="primary" 
              onClick={() => window.history.back()}
              className="me-2"
            >
              <RiHomeLine size={16} className="me-1" />
              Go Back
            </Button>
            
            {options.showContactAdmin && (
              <Button 
                variant="outline-secondary"
                onClick={() => window.location.href = '/contact-admin'}
              >
                Contact Administrator
              </Button>
            )}
          </div>
        </Container>
      );
    }
    
    return <WrappedComponent {...props} />;
  };
  
  ProtectedComponent.displayName = `withFeatureAccess(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return ProtectedComponent;
};

/**
 * Hook for checking feature access in functional components
 * @param {string} featureCode - Feature code to check
 * @returns {boolean} - Whether user has access
 */
export const useFeatureAccess = (featureCode) => {
  const user = useSelector(state => state.auth?.user);
  return hasFeatureAccess(user, featureCode);
};

/**
 * Component for conditionally rendering content based on feature access
 * @param {Object} props - Component props
 * @param {string} props.feature - Required feature
 * @param {React.ReactNode} props.children - Content to render if access granted
 * @param {React.ReactNode} props.fallback - Content to render if access denied
 * @returns {React.Component}
 */
export const FeatureGuard = ({ feature, children, fallback = null }) => {
  const hasAccess = useFeatureAccess(feature);
  
  return hasAccess ? children : fallback;
};

/**
 * Component for rendering feature access warnings
 * @param {Object} props - Component props
 * @param {string} props.feature - Feature that requires access
 * @param {string} props.message - Custom message
 * @returns {React.Component}
 */
export const FeatureAccessWarning = ({ feature, message }) => {
  const user = useSelector(state => state.auth?.user);
  
  return (
    <Alert variant="warning" className="border-0">
      <div className="d-flex align-items-start">
        <RiLockLine size={18} className="text-warning me-2 mt-1 flex-shrink-0" />
        <div>
          <h6 className="fw-semibold text-warning mb-1">Feature Access Required</h6>
          <p className="mb-0 small">
            {message || `This feature requires access to ${feature}. Your current role (${user?.role}) doesn't include this feature.`}
          </p>
        </div>
      </div>
    </Alert>
  );
};

export default {
  withFeatureAccess,
  useFeatureAccess,
  FeatureGuard,
  FeatureAccessWarning
};
