import React from 'react';
import { Container, Alert } from 'react-bootstrap';

const SimpleAIDashboard = () => {
  return (
    <Container className="py-4">
      <Alert variant="info">
        <Alert.Heading>AI Hospital Dashboard - Simple Version</Alert.Heading>
        <p>
          This is a simplified version of the AI Hospital Dashboard to test if the component loads.
        </p>
        <hr />
        <p className="mb-0">
          If you can see this page, the route and component are working correctly.
        </p>
      </Alert>
    </Container>
  );
};

export default SimpleAIDashboard;
