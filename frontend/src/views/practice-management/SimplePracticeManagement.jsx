import React from 'react';
import { Container, Row, Col, Card, Alert, Button } from 'react-bootstrap';
import { Crown, Users, Calendar, BarChart3 } from 'lucide-react';

const SimplePracticeManagement = () => {
  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <div className="d-flex align-items-center mb-4">
            <Crown size={32} className="text-warning me-3" />
            <div>
              <h2 className="mb-0">Practice Management System</h2>
              <p className="text-muted mb-0">Professional healthcare practice management</p>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Alert variant="info" className="mb-4">
            <Crown size={20} className="me-2" />
            <strong>Premium Feature:</strong> This is a subscription-based practice management system designed for healthcare professionals.
          </Alert>
        </Col>
      </Row>

      <Row>
        <Col md={6} lg={3}>
          <Card className="h-100 border-primary">
            <Card.Body className="text-center">
              <Users size={48} className="text-primary mb-3" />
              <h5>Doctor Management</h5>
              <p className="text-muted small">Manage your medical staff, specializations, and schedules</p>
              <Button variant="primary" size="sm" disabled>
                Coming Soon
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3}>
          <Card className="h-100 border-success">
            <Card.Body className="text-center">
              <Users size={48} className="text-success mb-3" />
              <h5>Patient Management</h5>
              <p className="text-muted small">Comprehensive patient records and medical history</p>
              <Button variant="success" size="sm" disabled>
                Coming Soon
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3}>
          <Card className="h-100 border-info">
            <Card.Body className="text-center">
              <Calendar size={48} className="text-info mb-3" />
              <h5>Appointment System</h5>
              <p className="text-muted small">Advanced scheduling with automated reminders</p>
              <Button variant="info" size="sm" disabled>
                Coming Soon
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3}>
          <Card className="h-100 border-warning">
            <Card.Body className="text-center">
              <BarChart3 size={48} className="text-warning mb-3" />
              <h5>Analytics & Reports</h5>
              <p className="text-muted small">Detailed insights and performance metrics</p>
              <Button variant="warning" size="sm" disabled>
                Coming Soon
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card className="bg-light">
            <Card.Body>
              <h5>🚀 Development Status</h5>
              <p className="mb-2">
                The Practice Management System is currently under development. This premium feature will include:
              </p>
              <ul className="mb-3">
                <li>Complete doctor and staff management</li>
                <li>Comprehensive patient record system</li>
                <li>Advanced appointment scheduling</li>
                <li>Revenue tracking and analytics</li>
                <li>HIPAA-compliant data handling</li>
              </ul>
              <Alert variant="primary" className="mb-0">
                <strong>Note:</strong> The full system is available but temporarily disabled to ensure main application stability. 
                Contact your administrator to enable advanced features.
              </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SimplePracticeManagement;
