import React, { useState, useEffect } from 'react';
import { Card, Button, Spinner, Alert, Table, Badge } from 'react-bootstrap';
import { doctorAPI } from '../../services/api';

const DatabaseVerification = () => {
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState(null);
  const [doctorCount, setDoctorCount] = useState(0);
  const [recentDoctors, setRecentDoctors] = useState([]);
  const [lastCheck, setLastCheck] = useState(null);

  const checkDatabase = async () => {
    setLoading(true);
    try {
      // Test database connectivity and fetch data
      const response = await doctorAPI.getDoctors({ limit: 5, ordering: '-id' });
      const doctors = response.data.results || response.data || [];
      
      setDbStatus('connected');
      setDoctorCount(response.data.count || doctors.length);
      setRecentDoctors(doctors);
      setLastCheck(new Date());
    } catch (error) {
      setDbStatus('error');
      console.error('Database check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkDatabase();
  }, []);

  const getStatusBadge = () => {
    switch (dbStatus) {
      case 'connected':
        return <Badge bg="success">✅ Connected</Badge>;
      case 'error':
        return <Badge bg="danger">❌ Connection Failed</Badge>;
      default:
        return <Badge bg="secondary">⏳ Checking...</Badge>;
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-info text-white d-flex justify-content-between align-items-center">
        <h6 className="mb-0">
          <i className="ri-database-2-line me-2"></i>
          Database Verification
        </h6>
        <Button 
          variant="light" 
          size="sm" 
          onClick={checkDatabase}
          disabled={loading}
        >
          {loading ? (
            <Spinner size="sm" />
          ) : (
            <>
              <i className="ri-refresh-line me-1"></i>
              Refresh
            </>
          )}
        </Button>
      </Card.Header>
      
      <Card.Body>
        <div className="row mb-3">
          <div className="col-md-6">
            <div className="d-flex justify-content-between">
              <span>Connection Status:</span>
              {getStatusBadge()}
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-flex justify-content-between">
              <span>Total Doctors:</span>
              <Badge bg="primary">{doctorCount}</Badge>
            </div>
          </div>
        </div>

        {lastCheck && (
          <div className="text-muted small mb-3">
            Last checked: {lastCheck.toLocaleString()}
          </div>
        )}

        {dbStatus === 'connected' && recentDoctors.length > 0 && (
          <>
            <h6 className="mb-3">Recent Doctor Records</h6>
            <Table size="sm" striped>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Specialization</th>
                  <th>License</th>
                </tr>
              </thead>
              <tbody>
                {recentDoctors.map(doctor => (
                  <tr key={doctor.id}>
                    <td>{doctor.id}</td>
                    <td>
                      {doctor.user?.first_name} {doctor.user?.last_name}
                    </td>
                    <td className="small">{doctor.user?.email}</td>
                    <td>
                      <Badge variant="outline-primary" size="sm">
                        {doctor.specialization || 'N/A'}
                      </Badge>
                    </td>
                    <td className="small">{doctor.license_number || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}

        {dbStatus === 'error' && (
          <Alert variant="danger">
            <i className="ri-error-warning-line me-2"></i>
            <strong>Database Connection Failed</strong>
            <br />
            Unable to connect to the database. Please check:
            <ul className="mt-2 mb-0">
              <li>Backend server is running</li>
              <li>Database connection is configured</li>
              <li>Network connectivity</li>
            </ul>
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default DatabaseVerification;
