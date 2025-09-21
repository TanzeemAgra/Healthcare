import React from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';

const PathologyReports = () => {
  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="mb-0">📄 Pathology Reports</h2>
          <p className="text-muted">Generate and manage pathology reports</p>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Alert variant="success" className="text-center">
                <i className="ri-file-text-fill me-2" style={{ fontSize: '2rem' }}></i>
                <h4>Digital Pathology Reports</h4>
                <p>This module will include report generation, digital signatures, template management, and automated report delivery.</p>
                <small className="text-muted">Coming soon in the next iteration...</small>
              </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PathologyReports;
