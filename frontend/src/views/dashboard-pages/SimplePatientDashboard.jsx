import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import centralizedPatientService from '../../services/centralizedPatientService';
import DASHBOARD_CONFIG from '../../config/dashboardConfig';

const SimplePatientDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPatients = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await centralizedPatientService.getAllPatients();
      setPatients(response.patients || []);
    } catch (error) {
      console.error('Error loading patients:', error);
      setError('Failed to load patient data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>Loading patient data...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <h5>Error</h5>
          {error}
          <Button variant="outline-danger" onClick={loadPatients} className="ms-2">
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h4>Patient Dashboard (Simple)</h4>
              <Button variant="primary" onClick={loadPatients}>
                Refresh
              </Button>
            </Card.Header>
            <Card.Body>
              <p>Total Patients: {patients.length}</p>
              
              {patients.length === 0 ? (
                <Alert variant="info">No patients found</Alert>
              ) : (
                <div className="row">
                  {patients.slice(0, 6).map((patient, index) => (
                    <div key={index} className="col-md-4 mb-3">
                      <Card>
                        <Card.Body>
                          <h6>{patient.name || `Patient ${index + 1}`}</h6>
                          <p>
                            <small>
                              Dept: {patient.department || 'General'}<br/>
                              Status: {patient.status || 'Active'}
                            </small>
                          </p>
                        </Card.Body>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SimplePatientDashboard;
