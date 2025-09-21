import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Table
} from 'react-bootstrap';

const AdvancedClinicManagementTest = () => {
  const [labTests, setLabTests] = useState([]);
  const [labCategories, setLabCategories] = useState([]);

  // Simple test data
  const LAB_TEST_CATEGORIES = useMemo(() => [
    {
      id: 'hematology',
      name: 'Hematology',
      color: 'danger'
    }
  ], []);

  const INITIAL_LAB_TESTS = useMemo(() => [
    {
      id: 'test-1',
      name: 'Complete Blood Count',
      category: 'hematology',
      price: 25.00,
      sampleType: 'Blood',
      turnaroundTime: '2-4 hours',
      testsPerformed: 1250,
      popularity: 85,
      isActive: true
    }
  ], []);

  useEffect(() => {
    setLabCategories(LAB_TEST_CATEGORIES);
    setLabTests(INITIAL_LAB_TESTS);
  }, [LAB_TEST_CATEGORIES, INITIAL_LAB_TESTS]);

  return (
    <Container fluid>
      <Card>
        <Card.Header>
          <h5>Lab Test Management Test</h5>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Test Name</th>
                <th>Category</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {labTests.map((test) => {
                const category = labCategories.find(c => c.id === test.category);
                return (
                  <tr key={test.id}>
                    <td>{test.name}</td>
                    <td>
                      <Badge variant={(category && category.color) || 'secondary'}>
                        {(category && category.name) || 'Unknown'}
                      </Badge>
                    </td>
                    <td>${test.price.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdvancedClinicManagementTest;
