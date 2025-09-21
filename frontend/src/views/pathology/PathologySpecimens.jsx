import React from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';

const PathologySpecimens = () => {
  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="mb-0">🧪 Specimen Management</h2>
          <p className="text-muted">Track and manage laboratory specimens</p>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Alert variant="info" className="text-center">
                <i className="ri-test-tube-fill me-2" style={{ fontSize: '2rem' }}></i>
                <h4>Specimen Management System</h4>
                <p>This module will include specimen tracking, collection status, storage management, and quality control features.</p>
                <small className="text-muted">Coming soon in the next iteration...</small>
              </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PathologySpecimens;
