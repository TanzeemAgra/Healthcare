import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Button, Alert, Spinner } from 'react-bootstrap';
import { advancedFeaturesStatsAPI } from '../../services/medicineAdvancedAPI';
import PatientReportsCRUD from './PatientReportsCRUD';
import SOAPNotesCRUD from './SOAPNotesCRUD';
import ProtocolSummarizer from '../../components/medicine/ProtocolSummarizer';
import ContractRedlining from '../../components/medicine/ContractRedlining';
import PhysicianAssistant from '../../components/medicine/PhysicianAssistant';
import BookingAssistant from '../../components/medicine/BookingAssistant';
import InsuranceCopilot from '../../components/medicine/InsuranceCopilot';
import CSRAssistant from '../../components/medicine/CSRAssistant';
import ResearchReview from '../../components/medicine/ResearchReview';
import BackOfficeAutomation from '../../components/medicine/BackOfficeAutomation';
import ClinicalSearch from '../../components/medicine/ClinicalSearch';
import SimpleAdvancedMedicineDashboard from '../../components/medicine/SimpleAdvancedMedicineDashboard';
import { MEDICINE_SECTIONS, getEnabledSections } from '../../config/advancedMedicineConfig';

const MedicineAdvancedManagement = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get sections from configuration (soft coding approach)
  const sections = getEnabledSections();

  useEffect(() => {
    if (activeSection === 'dashboard') {
      fetchStats();
      fetchSystemHealth();
    }
  }, [activeSection]);

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await advancedFeaturesStatsAPI.getStats();
      setStats(data);
    } catch (err) {
      setError('Failed to fetch statistics: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemHealth = async () => {
    try {
      const data = await advancedFeaturesStatsAPI.getSystemHealth();
      setSystemHealth(data);
    } catch (err) {
      console.error('Failed to fetch system health:', err);
    }
  };

  const renderDashboard = () => (
    <div>
      {/* System Health Status */}
      {systemHealth && (
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">
              <i className="ri-pulse-line me-2"></i>
              System Health
            </h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={3}>
                <div className="text-center">
                  <div className={`h2 mb-0 ${systemHealth.overall_status === 'healthy' ? 'text-success' : 'text-warning'}`}>
                    <i className={`ri-${systemHealth.overall_status === 'healthy' ? 'checkbox-circle' : 'error-warning'}-line`}></i>
                  </div>
                  <small className="text-muted">Overall Status</small>
                  <div className="fw-bold">{systemHealth.overall_status.toUpperCase()}</div>
                </div>
              </Col>
              <Col md={3}>
                <div className="text-center">
                  <div className="h2 mb-0 text-info">{systemHealth.active_sessions}</div>
                  <small className="text-muted">Active Sessions</small>
                </div>
              </Col>
              <Col md={3}>
                <div className="text-center">
                  <div className="h2 mb-0 text-primary">{systemHealth.total_requests}</div>
                  <small className="text-muted">Total Requests</small>
                </div>
              </Col>
              <Col md={3}>
                <div className="text-center">
                  <div className="h2 mb-0 text-success">{systemHealth.avg_response_time}ms</div>
                  <small className="text-muted">Avg Response Time</small>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Statistics Cards */}
      {stats && (
        <Row>
          <Col lg={3} md={6} className="mb-4">
            <Card className="border-start border-primary border-4">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <h6 className="text-muted text-uppercase mb-1">Patient Reports</h6>
                    <h4 className="mb-0">{stats.patient_reports}</h4>
                  </div>
                  <div className="text-primary">
                    <i className="ri-file-text-line" style={{ fontSize: '2rem' }}></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6} className="mb-4">
            <Card className="border-start border-success border-4">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <h6 className="text-muted text-uppercase mb-1">SOAP Notes</h6>
                    <h4 className="mb-0">{stats.soap_notes}</h4>
                  </div>
                  <div className="text-success">
                    <i className="ri-file-list-3-line" style={{ fontSize: '2rem' }}></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6} className="mb-4">
            <Card className="border-start border-info border-4">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <h6 className="text-muted text-uppercase mb-1">Protocols</h6>
                    <h4 className="mb-0">{stats.protocols}</h4>
                  </div>
                  <div className="text-info">
                    <i className="ri-file-copy-line" style={{ fontSize: '2rem' }}></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6} className="mb-4">
            <Card className="border-start border-warning border-4">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <h6 className="text-muted text-uppercase mb-1">Contracts</h6>
                    <h4 className="mb-0">{stats.contracts}</h4>
                  </div>
                  <div className="text-warning">
                    <i className="ri-contract-line" style={{ fontSize: '2rem' }}></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6} className="mb-4">
            <Card className="border-start border-danger border-4">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <h6 className="text-muted text-uppercase mb-1">AI Sessions</h6>
                    <h4 className="mb-0">{stats.physician_assistant}</h4>
                  </div>
                  <div className="text-danger">
                    <i className="ri-user-heart-line" style={{ fontSize: '2rem' }}></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6} className="mb-4">
            <Card className="border-start border-secondary border-4">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <h6 className="text-muted text-uppercase mb-1">Bookings</h6>
                    <h4 className="mb-0">{stats.ai_booking}</h4>
                  </div>
                  <div className="text-secondary">
                    <i className="ri-calendar-check-line" style={{ fontSize: '2rem' }}></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6} className="mb-4">
            <Card className="border-start border-dark border-4">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <h6 className="text-muted text-uppercase mb-1">Insurance Policies</h6>
                    <h4 className="mb-0">{stats.insurance}</h4>
                  </div>
                  <div className="text-dark">
                    <i className="ri-shield-check-line" style={{ fontSize: '2rem' }}></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6} className="mb-4">
            <Card className="border-start border-primary border-4">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <h6 className="text-muted text-uppercase mb-1">CSR Tickets</h6>
                    <h4 className="mb-0">{stats.csr_assistant}</h4>
                  </div>
                  <div className="text-primary">
                    <i className="ri-customer-service-line" style={{ fontSize: '2rem' }}></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Recent Activity */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">
            <i className="ri-time-line me-2"></i>
            Recent Activity
          </h5>
        </Card.Header>
        <Card.Body>
          {stats?.recent_activity && stats.recent_activity.length > 0 ? (
            <div className="timeline">
              {stats.recent_activity.map((activity, index) => (
                <div key={index} className="d-flex mb-3">
                  <div className="flex-shrink-0">
                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                      <i className="ri-activity-line text-white"></i>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <div className="fw-bold">{activity.action}</div>
                    <div className="text-muted small">{activity.feature}</div>
                    <div className="text-muted small">{activity.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted py-4">
              <i className="ri-information-line me-2"></i>
              No recent activity found
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );

  const renderPlaceholder = (title) => (
    <Card>
      <Card.Header>
        <h4 className="mb-0">{title}</h4>
      </Card.Header>
      <Card.Body>
        <div className="text-center py-5">
          <i className="ri-tools-line display-4 text-muted mb-3"></i>
          <h5 className="text-muted">CRUD Interface Coming Soon</h5>
          <p className="text-muted">
            This section will contain comprehensive Create, Read, Update, Delete operations 
            for {title.toLowerCase()}.
          </p>
          <Button variant="outline-primary" disabled>
            <i className="ri-hammer-line me-2"></i>
            Under Development
          </Button>
        </div>
      </Card.Body>
    </Card>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <SimpleAdvancedMedicineDashboard />;
      case 'patient-reports':
        return <PatientReportsCRUD />;
      case 'soap-notes':
        return <SOAPNotesCRUD />;
      case 'protocols':
        return <ProtocolSummarizer />;
      case 'contracts':
        return <ContractRedlining />;
      case 'physician-assistant':
        return <PhysicianAssistant />;
      case 'booking-assistant':
        return <BookingAssistant />;
      case 'insurance':
        return <InsuranceCopilot />;
      case 'csr-assistant':
        return <CSRAssistant />;
      case 'research-review':
        return <ResearchReview />;
      case 'automation':
        return <BackOfficeAutomation />;
      case 'clinical-search':
        return <ClinicalSearch />;
      default:
        return <SimpleAdvancedMedicineDashboard />;
    }
  };

  return (
    <Container fluid>
      <Row>
        {/* Sidebar Navigation */}
        <Col lg={2} md={3} className="bg-light border-end" style={{ minHeight: '100vh' }}>
          <div className="py-3">
            <h6 className="text-muted text-uppercase px-3 mb-3">Advanced Medicine</h6>
            <Nav className="flex-column">
              {sections.map((section) => (
                <Nav.Link
                  key={section.key}
                  className={`px-3 py-2 ${activeSection === section.key ? 'bg-primary text-white' : 'text-dark'}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setActiveSection(section.key)}
                >
                  <i className={`${section.icon} me-2`}></i>
                  {section.label}
                </Nav.Link>
              ))}
            </Nav>
          </div>
        </Col>

        {/* Main Content */}
        <Col lg={10} md={9}>
          <div className="p-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="mb-1">
                  {sections.find(s => s.key === activeSection)?.label || 'Dashboard'}
                </h2>
                <p className="text-muted mb-0">
                  Comprehensive CRUD management for advanced medicine features
                </p>
              </div>
              <div>
                <Button 
                  variant="outline-secondary" 
                  onClick={() => window.location.reload()}
                  className="me-2"
                >
                  <i className="ri-refresh-line me-1"></i>
                  Refresh
                </Button>
                {activeSection === 'dashboard' && (
                  <Button 
                    variant="primary" 
                    onClick={fetchStats}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-1" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <i className="ri-refresh-line me-1"></i>
                        Refresh Stats
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Alerts */}
            {error && (
              <Alert variant="danger" dismissible onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            {/* Content */}
            {renderContent()}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default MedicineAdvancedManagement;
