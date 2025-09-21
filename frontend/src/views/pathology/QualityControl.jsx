import React from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';

const QualityControl = () => {
  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="mb-0">🛡️ Quality Control</h2>
          <p className="text-muted">Laboratory quality assurance and control</p>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Alert variant="warning" className="text-center">
                <i className="ri-shield-check-fill me-2" style={{ fontSize: '2rem' }}></i>
                <h4>Quality Control Management</h4>
                <p>This module will include QC protocols, proficiency testing, equipment maintenance tracking, and compliance reporting.</p>
                <small className="text-muted">Coming soon in the next iteration...</small>
              </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default QualityControl;
