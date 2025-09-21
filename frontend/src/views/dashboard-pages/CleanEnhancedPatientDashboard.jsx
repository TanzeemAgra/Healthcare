import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Dropdown,
  Table,
  Alert,
  Spinner,
  Form,
  InputGroup,
  Modal,
  Tabs,
  Tab
} from 'react-bootstrap';
import { 
  RiDashboardFill, 
  RiUserFill, 
  RiBrainFill,
  RiRefreshLine,
  RiSearchLine,
  RiFilterLine,
  RiDownloadFill,
  RiEyeFill,
  RiNotificationFill
} from '@remixicon/react';
import centralizedPatientService from '../../services/centralizedPatientService';
import NotificationCenter, { useNotifications } from '../../components/common/NotificationCenter';
import DASHBOARD_CONFIG, { getDepartmentConfig, getMessage } from '../../config/dashboardConfig';
import './EnhancedPatientDashboard.css';

const CleanEnhancedPatientDashboard = () => {
  // Configuration from soft coding
  const config = DASHBOARD_CONFIG;
  
  // Core State
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(config.tabs.dashboard.active);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(config.filters.department.default);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    critical: 0,
    today: 0,
    departments: {}
  });

  // Notification system
  const { addNotification } = useNotifications();

  // Load patients data
  const loadPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await centralizedPatientService.getAllPatients();
      const patientsData = response.patients || response.data || [];
      
      setPatients(patientsData);
      updateStatistics(patientsData);
      
      addNotification({
        type: config.notifications.types.success,
        title: getMessage('data', 'loaded_title'),
        message: getMessage('data', 'loaded_message'),
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Error loading patients:', error);
      setError(getMessage('data', 'error_message'));
      
      addNotification({
        type: config.notifications.types.error,
        title: getMessage('data', 'error_title'),
        message: getMessage('data', 'error_message'),
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  // Update statistics
  const updateStatistics = useCallback((patientsData) => {
    const today = new Date().toDateString();
    const newStats = {
      total: patientsData.length,
      critical: patientsData.filter(p => p.status === 'Critical').length,
      today: patientsData.filter(p => new Date(p.created_at || p.dateAdded).toDateString() === today).length,
      departments: {}
    };

    // Department distribution
    patientsData.forEach(patient => {
      const dept = patient.department || 'General';
      newStats.departments[dept] = (newStats.departments[dept] || 0) + 1;
    });

    setStats(newStats);
  }, []);

  // Filter patients
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

  // Render patient card
  const renderPatientCard = (patient, index) => {
    const deptConfig = getDepartmentConfig(patient.department);
    
    return (
      <Card key={patient.id || index} className="mb-3 patient-card">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h6 className="mb-1">{patient.name || `Patient ${index + 1}`}</h6>
              <Badge 
                bg={deptConfig?.color || 'secondary'} 
                className="mb-2"
              >
                {deptConfig?.icon} {patient.department || 'General'}
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
      <NotificationCenter />
      
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2><RiDashboardFill className="me-2" />Enhanced Patient Dashboard</h2>
              <p className="text-muted">AI-Powered Patient Management System</p>
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
          <Card className="stat-card">
            <Card.Body className="text-center">
              <RiUserFill size={30} className="text-primary mb-2" />
              <h3>{stats.total}</h3>
              <p className="mb-0">Total Patients</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body className="text-center">
              <RiNotificationFill size={30} className="text-danger mb-2" />
              <h3>{stats.critical}</h3>
              <p className="mb-0">Critical Cases</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body className="text-center">
              <RiDownloadFill size={30} className="text-success mb-2" />
              <h3>{stats.today}</h3>
              <p className="mb-0">Today's Registrations</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body className="text-center">
              <RiBrainFill size={30} className="text-info mb-2" />
              <h3>{Object.keys(stats.departments).length}</h3>
              <p className="mb-0">Active Departments</p>
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
              placeholder="Search patients..."
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
            <option value="all">All Departments</option>
            {Object.entries(config.departments).map(([key, dept]) => (
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
          <h6>Error</h6>
          {error}
        </Alert>
      )}

      {/* Patients Grid */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5>
                <RiFilterLine className="me-2" />
                Patients ({filteredPatients.length})
              </h5>
            </Card.Header>
            <Card.Body>
              {filteredPatients.length === 0 ? (
                <Alert variant="info">
                  No patients found matching your criteria.
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
        <Modal.Header closeButton>
          <Modal.Title>Patient Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPatient && (
            <div>
              <h5>{selectedPatient.name}</h5>
              <Table striped bordered>
                <tbody>
                  <tr>
                    <td><strong>Department</strong></td>
                    <td>{selectedPatient.department || 'General'}</td>
                  </tr>
                  <tr>
                    <td><strong>Status</strong></td>
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
                    <td><strong>Email</strong></td>
                    <td>{selectedPatient.email || 'Not provided'}</td>
                  </tr>
                  <tr>
                    <td><strong>Phone</strong></td>
                    <td>{selectedPatient.phone || 'Not provided'}</td>
                  </tr>
                  <tr>
                    <td><strong>Age</strong></td>
                    <td>{selectedPatient.age || 'Not provided'}</td>
                  </tr>
                  <tr>
                    <td><strong>Gender</strong></td>
                    <td>{selectedPatient.gender || 'Not provided'}</td>
                  </tr>
                  <tr>
                    <td><strong>Created</strong></td>
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

export default CleanEnhancedPatientDashboard;
