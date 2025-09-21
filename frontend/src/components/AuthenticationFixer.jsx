import React, { useEffect } from 'react';
import { Container, Alert, Button, Spinner } from 'react-bootstrap';
import { resetAuthenticationState, isDemoMode } from '../utils/authReset';

const AuthenticationFixer = () => {
  useEffect(() => {
    const checkAndFixAuth = async () => {
      // Check if we're in demo mode with backend running
      if (isDemoMode()) {
        console.log('🔍 Demo mode detected with backend running - need to reset auth');
        
        // Show a brief message then reset
        setTimeout(() => {
          resetAuthenticationState();
        }, 2000);
      }
    };
    
    checkAndFixAuth();
  }, []);

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="text-center">
        <Spinner animation="border" role="status" className="mb-3">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <Alert variant="info">
          <Alert.Heading>🔄 Updating Authentication</Alert.Heading>
          <p>
            Detected demo mode while backend server is running. 
            Switching to proper authentication...
          </p>
          <hr />
          <Button 
            variant="primary" 
            onClick={resetAuthenticationState}
          >
            Continue to Login
          </Button>
        </Alert>
      </div>
    </Container>
  );
};

export default AuthenticationFixer;
