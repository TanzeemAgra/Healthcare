import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Alert
} from 'react-bootstrap';

const MinimalAIDashboard = () => {
  const [loading] = useState(false);

  if (loading) {
    return (
      <Container className="py-4">
        <Alert variant="info">Loading...</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h3>AI Hospital Dashboard - Minimal Version</h3>
            </Card.Header>
            <Card.Body>
              <p>This is a minimal version of the AI Hospital Dashboard.</p>
              <p>If this loads, we can gradually add features to identify the issue.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MinimalAIDashboard;
