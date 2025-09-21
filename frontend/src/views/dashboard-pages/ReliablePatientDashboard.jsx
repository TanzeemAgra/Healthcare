import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Form,
  InputGroup,
  Modal,
  Alert,
  Spinner,
  Table
} from 'react-bootstrap';
import { 
  RiDashboardFill, 
  RiUserFill, 
  RiBrainFill,
  RiRefreshLine,
  RiSearchLine,
  RiDownloadFill,
  RiEyeFill,
  RiNotificationFill
} from '@remixicon/react';
import centralizedPatientService from '../../services/centralizedPatientService';
import DASHBOARD_CONFIG from '../../config/dashboardConfig';
import './EnhancedPatientDashboard.css';

const ReliablePatientDashboard = () => {
  // Configuration from soft coding
  const config = DASHBOARD_CONFIG;
  
  // Core State
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [notification, setNotification] = useState(null);
  
  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    critical: 0,
    today: 0,
    departments: {}
  });

  // Show notification function
  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  // Load patients data with soft coding
  const loadPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await centralizedPatientService.getAllPatients();
      const patientsData = response.patients || response.data || [];
      
      setPatients(patientsData);
      updateStatistics(patientsData);
      
      showNotification('Patient data loaded successfully', 'success');
      
    } catch (error) {
      console.error('Error loading patients:', error);
      setError('Failed to load patient data. Please try again.');
      showNotification('Failed to load patient data', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  // Update statistics with soft coding
  const updateStatistics = useCallback((patientsData) => {
    const today = new Date().toDateString();
    const newStats = {
      total: patientsData.length,
      critical: patientsData.filter(p => p.status === 'Critical').length,
      today: patientsData.filter(p => new Date(p.created_at || p.dateAdded).toDateString() === today).length,
      departments: {}
    };

    // Department distribution using soft coding
    patientsData.forEach(patient => {
      const dept = patient.department || 'General';
      newStats.departments[dept] = (newStats.departments[dept] || 0) + 1;
    });

    setStats(newStats);
  }, []);

  // Filter patients with soft coding
  const filterPatients = useCallback(() => {
    let filtered = patients;

    if (searchTerm) {
      filtered = filtered.filter(patient =>
        (patient.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (patient.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (patient.phone || '').includes(searchTerm)
      );
    }

    if (selectedDepartment && selectedDepartment !== 'all') {
      filtered = filtered.filter(patient => patient.department === selectedDepartment);
    }

    setFilteredPatients(filtered);
  }, [patients, searchTerm, selectedDepartment]);

  // Effects
  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  useEffect(() => {
    filterPatients();
  }, [filterPatients]);

  // Get department configuration with soft coding
  const getDepartmentConfig = (deptKey) => {
    return config.DEPARTMENTS?.[deptKey] || { name: deptKey, color: '#6c757d', icon: '🏥' };
  };

  // Render patient card with soft coding
  const renderPatientCard = (patient, index) => {
    const deptConfig = getDepartmentConfig(patient.department);
    
    return (
      <Card key={patient.id || index} className="mb-3 patient-card shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h6 className="mb-1">{patient.name || `Patient ${index + 1}`}</h6>
              <Badge 
                style={{ backgroundColor: deptConfig.color }}
                className="mb-2"
              >
                🏥 {deptConfig.name}
              </Badge>
              <p className="mb-1 text-muted small">
                📧 {patient.email || 'Not provided'}<br/>
                📱 {patient.phone || 'Not provided'}
              </p>
            </div>
            <div className="text-end">
              <Badge 
                bg={patient.status === 'Critical' ? 'danger' : 
                    patient.status === 'Under Treatment' ? 'warning' : 'success'}
                className="mb-2"
              >
                {patient.status || 'Active'}
              </Badge>
              <br/>
              <Button 
                size="sm" 
                variant="outline-primary"
                onClick={() => {
                  setSelectedPatient(patient);
                  setShowModal(true);
                }}
              >
                <RiEyeFill size={14} /> View
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading patient data...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="enhanced-patient-dashboard">
      
      {/* Notification */}
      {notification && (
        <Alert 
          variant={notification.type} 
          dismissible 
          onClose={() => setNotification(null)}
          className="position-fixed"
          style={{ top: '20px', right: '20px', zIndex: 9999, maxWidth: '300px' }}
        >
          {notification.message}
        </Alert>
      )}
      
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2><RiDashboardFill className="me-2" />Enhanced Patient Dashboard</h2>
              <p className="text-muted">AI-Powered Patient Management System (Soft Coded)</p>
            </div>
            <div>
              <Button variant="primary" onClick={loadPatients} disabled={loading}>
                <RiRefreshLine className="me-1" />
                {loading ? 'Loading...' : 'Refresh'}
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <RiUserFill size={40} className="text-primary mb-2" />
              <h3 className="fw-bold">{stats.total}</h3>
              <p className="mb-0 text-muted">Total Patients</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <RiNotificationFill size={40} className="text-danger mb-2" />
              <h3 className="fw-bold text-danger">{stats.critical}</h3>
              <p className="mb-0 text-muted">Critical Cases</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <RiDownloadFill size={40} className="text-success mb-2" />
              <h3 className="fw-bold text-success">{stats.today}</h3>
              <p className="mb-0 text-muted">Today's Registrations</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <RiBrainFill size={40} className="text-info mb-2" />
              <h3 className="fw-bold text-info">{Object.keys(stats.departments).length}</h3>
              <p className="mb-0 text-muted">Active Departments</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text><RiSearchLine /></InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search patients by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={6}>
          <Form.Select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="all">🏥 All Departments</option>
            {Object.entries(config.DEPARTMENTS || {}).map(([key, dept]) => (
              <option key={key} value={key}>
                {dept.name}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          <h6>❌ Error</h6>
          {error}
        </Alert>
      )}

      {/* Patients Grid */}
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                👥 Patients ({filteredPatients.length})
              </h5>
            </Card.Header>
            <Card.Body>
              {filteredPatients.length === 0 ? (
                <Alert variant="info">
                  ℹ️ No patients found matching your criteria.
                </Alert>
              ) : (
                <Row>
                  {filteredPatients.map((patient, index) => (
                    <Col key={patient.id || index} md={6} lg={4}>
                      {renderPatientCard(patient, index)}
                    </Col>
                  ))}
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Patient Detail Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>👤 Patient Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPatient && (
            <div>
              <h5 className="mb-3">{selectedPatient.name}</h5>
              <Table striped bordered hover>
                <tbody>
                  <tr>
                    <td><strong>🏥 Department</strong></td>
                    <td>{getDepartmentConfig(selectedPatient.department).name}</td>
                  </tr>
                  <tr>
                    <td><strong>📊 Status</strong></td>
                    <td>
                      <Badge 
                        bg={selectedPatient.status === 'Critical' ? 'danger' : 
                            selectedPatient.status === 'Under Treatment' ? 'warning' : 'success'}
                      >
                        {selectedPatient.status || 'Active'}
                      </Badge>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>📧 Email</strong></td>
                    <td>{selectedPatient.email || 'Not provided'}</td>
                  </tr>
                  <tr>
                    <td><strong>📱 Phone</strong></td>
                    <td>{selectedPatient.phone || 'Not provided'}</td>
                  </tr>
                  <tr>
                    <td><strong>🎂 Age</strong></td>
                    <td>{selectedPatient.age || 'Not provided'}</td>
                  </tr>
                  <tr>
                    <td><strong>👤 Gender</strong></td>
                    <td>{selectedPatient.gender || 'Not provided'}</td>
                  </tr>
                  <tr>
                    <td><strong>📅 Created</strong></td>
                    <td>{selectedPatient.created_at || selectedPatient.dateAdded || 'Unknown'}</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ReliablePatientDashboard;
