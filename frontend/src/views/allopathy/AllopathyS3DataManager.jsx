import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Nav, Tab, Alert, Spinner, Badge } from 'react-bootstrap';
import { FaHospital, FaUserInjured, FaFileAlt, FaChartLine, FaNotes, FaCalendarAlt } from 'react-icons/fa';
import AllopathyHospitalManager from './components/AllopathyHospitalManager';
import AllopathyPatientManager from './components/AllopathyPatientManager';
import AllopathyFileManager from './components/AllopathyFileManager';
import AllopathyAnalysisManager from './components/AllopathyAnalysisManager';
import AllopathyMedicalRecordManager from './components/AllopathyMedicalRecordManager';
import AllopathyTreatmentPlanManager from './components/AllopathyTreatmentPlanManager';
import AllopathyDashboard from './components/AllopathyDashboard';
import { allopathyS3Config } from '../../../utils/allopathyS3Config';
import axios from 'axios';

const AllopathyS3DataManager = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    hospitals: 0,
    patients: 0,
    files: 0,
    analyses: 0,
    medicalRecords: 0,
    treatmentPlans: 0
  });
  const [notifications, setNotifications] = useState([]);

  // Initialize component and fetch statistics
  useEffect(() => {
    initializeData();
    const interval = setInterval(fetchStats, allopathyS3Config.ui.refreshInterval);
    return () => clearInterval(interval);
  }, []);

  const initializeData = async () => {
    try {
      setLoading(true);
      setError(null);
      await fetchStats();
    } catch (err) {
      setError('Failed to initialize Allopathy S3 Data Manager');
      console.error('Initialization error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = useCallback(async () => {
    try {
      const baseURL = allopathyS3Config.api.baseURL;
      const endpoints = allopathyS3Config.api.endpoints;

      const [
        hospitalsRes,
        patientsRes,
        filesRes,
        analysesRes,
        medicalRecordsRes,
        treatmentPlansRes
      ] = await Promise.all([
        axios.get(`${baseURL}${endpoints.hospitals}`),
        axios.get(`${baseURL}${endpoints.patients}`),
        axios.get(`${baseURL}${endpoints.files}`),
        axios.get(`${baseURL}${endpoints.analyses}`),
        axios.get(`${baseURL}${endpoints.medicalRecords}`),
        axios.get(`${baseURL}${endpoints.treatmentPlans}`)
      ]);

      setStats({
        hospitals: hospitalsRes.data.count || hospitalsRes.data.length || 0,
        patients: patientsRes.data.count || patientsRes.data.length || 0,
        files: filesRes.data.count || filesRes.data.length || 0,
        analyses: analysesRes.data.count || analysesRes.data.length || 0,
        medicalRecords: medicalRecordsRes.data.count || medicalRecordsRes.data.length || 0,
        treatmentPlans: treatmentPlansRes.data.count || treatmentPlansRes.data.length || 0
      });
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
      addNotification('Failed to refresh statistics', 'error');
    }
  }, []);

  const addNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };
    setNotifications(prev => [notification, ...prev.slice(0, 9)]);
    
    // Auto-remove notification
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, allopathyS3Config.ui.notifications.autoClose);
  };

  const refreshData = () => {
    fetchStats();
    addNotification('Data refreshed successfully', 'success');
  };

  const getTabIcon = (tabKey) => {
    const icons = {
      dashboard: <FaChartLine className="me-2" />,
      hospitals: <FaHospital className="me-2" />,
      patients: <FaUserInjured className="me-2" />,
      files: <FaFileAlt className="me-2" />,
      analyses: <FaChartLine className="me-2" />,
      'medical-records': <FaNotes className="me-2" />,
      'treatment-plans': <FaCalendarAlt className="me-2" />
    };
    return icons[tabKey] || null;
  };

  const getStatsBadge = (tabKey) => {
    const statMapping = {
      hospitals: stats.hospitals,
      patients: stats.patients,
      files: stats.files,
      analyses: stats.analyses,
      'medical-records': stats.medicalRecords,
      'treatment-plans': stats.treatmentPlans
    };
    
    const count = statMapping[tabKey];
    if (count > 0) {
      return <Badge bg="primary" className="ms-2">{count}</Badge>;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading Allopathy S3 Data Manager...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="allopathy-s3-data-manager">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            <FaHospital className="me-3 text-primary" />
            Allopathy S3 Data Management System
          </h2>
          <p className="text-muted mb-0">
            Comprehensive medical data management with S3 integration and AI analysis
          </p>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-primary"
            onClick={refreshData}
            title="Refresh Data"
          >
            <i className="fas fa-sync-alt"></i>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          <Alert.Heading>Error</Alert.Heading>
          {error}
        </Alert>
      )}

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="position-fixed" style={{ top: '20px', right: '20px', zIndex: 1050 }}>
          {notifications.slice(0, 3).map(notification => (
            <Alert 
              key={notification.id}
              variant={notification.type}
              dismissible
              onClose={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
              className="mb-2"
            >
              {notification.message}
            </Alert>
          ))}
        </div>
      )}

      {/* Main Content */}
      <Card>
        <Card.Header className="bg-light">
          <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
            <Nav variant="tabs" className="border-bottom-0">
              <Nav.Item>
                <Nav.Link eventKey="dashboard">
                  {getTabIcon('dashboard')}
                  Dashboard
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="hospitals">
                  {getTabIcon('hospitals')}
                  Hospitals
                  {getStatsBadge('hospitals')}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="patients">
                  {getTabIcon('patients')}
                  Patients
                  {getStatsBadge('patients')}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="files">
                  {getTabIcon('files')}
                  Files
                  {getStatsBadge('files')}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="analyses">
                  {getTabIcon('analyses')}
                  Analyses
                  {getStatsBadge('analyses')}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="medical-records">
                  {getTabIcon('medical-records')}
                  Medical Records
                  {getStatsBadge('medical-records')}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="treatment-plans">
                  {getTabIcon('treatment-plans')}
                  Treatment Plans
                  {getStatsBadge('treatment-plans')}
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Tab.Container>
        </Card.Header>

        <Card.Body className="p-0">
          <Tab.Container activeKey={activeTab}>
            <Tab.Content>
              <Tab.Pane eventKey="dashboard">
                <div className="p-4">
                  <AllopathyDashboard 
                    stats={stats}
                    onRefresh={refreshData}
                    onNotification={addNotification}
                  />
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="hospitals">
                <div className="p-4">
                  <AllopathyHospitalManager 
                    onDataChange={refreshData}
                    onNotification={addNotification}
                  />
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="patients">
                <div className="p-4">
                  <AllopathyPatientManager 
                    onDataChange={refreshData}
                    onNotification={addNotification}
                  />
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="files">
                <div className="p-4">
                  <AllopathyFileManager 
                    onDataChange={refreshData}
                    onNotification={addNotification}
                  />
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="analyses">
                <div className="p-4">
                  <AllopathyAnalysisManager 
                    onDataChange={refreshData}
                    onNotification={addNotification}
                  />
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="medical-records">
                <div className="p-4">
                  <AllopathyMedicalRecordManager 
                    onDataChange={refreshData}
                    onNotification={addNotification}
                  />
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="treatment-plans">
                <div className="p-4">
                  <AllopathyTreatmentPlanManager 
                    onDataChange={refreshData}
                    onNotification={addNotification}
                  />
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Card.Body>
      </Card>

      {/* Footer Information */}
      <div className="mt-4">
        <Row>
          <Col md={6}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title className="h6">System Information</Card.Title>
                <div className="small text-muted">
                  <div>Version: 1.0.0</div>
                  <div>Last Updated: {new Date().toLocaleDateString()}</div>
                  <div>Environment: {allopathyS3Config.development.debug ? 'Development' : 'Production'}</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title className="h6">Quick Stats</Card.Title>
                <div className="small">
                  <div>Total Records: {Object.values(stats).reduce((a, b) => a + b, 0)}</div>
                  <div>Active Sessions: 1</div>
                  <div>Data Refresh: Every {allopathyS3Config.ui.refreshInterval / 1000}s</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AllopathyS3DataManager;
