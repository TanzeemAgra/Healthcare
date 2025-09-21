import React from 'react';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/**
 * Reusable Access Denied component for unauthorized module access
 */
const AccessDenied = ({ 
  title = "Access Denied", 
  message = "You don't have permission to access this module.",
  moduleName = "",
  icon = "ri-error-warning-line",
  redirectPath = "/",
  redirectText = "Go to Dashboard"
}) => {
  return (
    <Container fluid className="py-4">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Alert variant="danger" className="text-center shadow-sm">
            <div className="mb-3">
              <i className={`${icon} display-4 text-danger`}></i>
            </div>
            <h4 className="alert-heading">{title}</h4>
            <p className="mb-3">
              {message}
              {moduleName && (
                <span className="d-block mt-2">
                  <strong>Module:</strong> {moduleName}
                </span>
              )}
            </p>
            <hr />
            <div className="mb-0">
              <Button 
                variant="outline-primary" 
                as={Link} 
                to={redirectPath}
                className="me-2"
              >
                <i className="ri-home-line me-1"></i>
                {redirectText}
              </Button>
              <Button 
                variant="outline-secondary" 
                onClick={() => window.history.back()}
              >
                <i className="ri-arrow-left-line me-1"></i>
                Go Back
              </Button>
            </div>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default AccessDenied;
