import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import ProtectedRoute from '../common/ProtectedRoute';
import apiClient from '../../services/api';
import { 
  COSMETOLOGY_ENDPOINTS, 
  SKIN_TYPES, 
  HAIR_TYPES, 
  VALIDATION_RULES,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES 
} from '../../constants/cosmetologyConstants';

const CosmetologyClientsSimple = () => {
  const [testData, setTestData] = useState('Loading...');

  useEffect(() => {
    const testApiCall = async () => {
      try {
        // Try a simple API call
        const response = await apiClient.get(COSMETOLOGY_ENDPOINTS.CLIENTS);
        setTestData(`API working! Found ${response.data?.length || 0} clients`);
      } catch (error) {
        setTestData(`API Error: ${error.message}`);
      }
    };
    testApiCall();
  }, []);
  return (
    <ProtectedRoute>
      <Container fluid>
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h4>Cosmetology Clients - Simple Version</h4>
              </Card.Header>
              <Card.Body>
                <p>This is a simplified version to test what works.</p>
                <p>API Test: {testData}</p>
                <p>Skin Types Available: {SKIN_TYPES?.length || 0}</p>
                <p>Hair Types Available: {HAIR_TYPES?.length || 0}</p>
                <Button variant="primary">Test Button</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </ProtectedRoute>
  );
};

export default CosmetologyClientsSimple;
