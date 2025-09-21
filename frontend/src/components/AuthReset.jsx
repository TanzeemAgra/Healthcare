import React from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { resetAuthenticationState } from '../utils/authReset';

const AuthReset = () => {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card>
            <Card.Body className="text-center">
              <Alert variant="warning">
                <Alert.Heading>🔄 Authentication Reset</Alert.Heading>
                <p>
                  If you're experiencing authentication issues or seeing demo data while the backend server is running,
                  click the button below to reset your authentication state and log in properly.
                </p>
              </Alert>
              
              <div className="d-grid gap-2">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={resetAuthenticationState}
                >
                  🔓 Reset Authentication & Login
                </Button>
                
                <Button 
                  variant="outline-secondary"
                  onClick={() => window.location.href = '/'}
                >
                  🏠 Go to Home
                </Button>
              </div>
              
              <hr />
              
              <small className="text-muted">
                This will clear all stored authentication tokens and redirect you to the login page.
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthReset;
