import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Nav, Tab, Badge, Spinner, Alert } from 'react-bootstrap';
import { Hospital, Users, FileText, Brain, Calendar, TrendingUp, Activity, Clock } from 'lucide-react';
import axios from 'axios';

// Import all allopathy components
import AllopathyHospitalManager from './AllopathyHospitalManager';
import AllopathyPatientManager from './AllopathyPatientManager';
import AllopathyFileManager from './AllopathyFileManager';
import AllopathyAnalysisManager from './AllopathyAnalysisManager';
import AllopathyMedicalRecordsManager from './AllopathyMedicalRecordsManager';
import AllopathyTreatmentPlansManager from './AllopathyTreatmentPlansManager';

const AllopathyDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardStats, setDashboardStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('/api/allopathy/dashboard-stats/');
      setDashboardStats(response.data);
    } catch (err) {
      setError('Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, variant = 'primary', badge = null }) => (
    <Card className="border-0 shadow-sm h-100">
      <Card.Body>
        <div className="d-flex align-items-center">
          <div className={`bg-${variant} bg-opacity-10 p-3 rounded`}>
            <Icon className={`text-${variant}`} size={24} />
          </div>
          <div className="ms-3 flex-grow-1">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h3 className="mb-0">{value || 0}</h3>
                <small className="text-muted">{title}</small>
                {subtitle && <div className="small text-muted">{subtitle}</div>}
              </div>
              {badge && <Badge bg={badge.variant}>{badge.text}</Badge>}
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  if (loading) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading Allopathy Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <h1 className="mb-0">Allopathy S3 Data Management System</h1>
        <p className="text-muted">Comprehensive medical data management with AI-powered analytics</p>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

      <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
        <Nav variant="pills" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey="overview">
              <Activity size={20} className="me-2" />
              Overview
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="hospitals">
              <Hospital size={20} className="me-2" />
              Hospitals
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="patients">
              <Users size={20} className="me-2" />
              Patients
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="files">
              <FileText size={20} className="me-2" />
              File Manager
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="analysis">
              <Brain size={20} className="me-2" />
              AI Analysis
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="records">
              <FileText size={20} className="me-2" />
              Medical Records
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="treatments">
              <Calendar size={20} className="me-2" />
              Treatment Plans
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="overview">
            <Row className="mb-4">
              <Col md={3}>
                <StatCard
                  icon={Hospital}
                  title="Active Hospitals"
                  value={dashboardStats.total_hospitals}
                  subtitle="Registered facilities"
                  variant="primary"
                />
              </Col>
              <Col md={3}>
                <StatCard
                  icon={Users}
                  title="Total Patients"
                  value={dashboardStats.total_patients}
                  subtitle="All patient records"
                  variant="success"
                />
              </Col>
              <Col md={3}>
                <StatCard
                  icon={FileText}
                  title="Medical Files"
                  value={dashboardStats.total_files}
                  subtitle={`${dashboardStats.files_this_month || 0} this month`}
                  variant="info"
                />
              </Col>
              <Col md={3}>
                <StatCard
                  icon={Brain}
                  title="AI Analyses"
                  value={dashboardStats.total_analyses}
                  subtitle={`${dashboardStats.pending_analyses || 0} pending`}
                  variant="warning"
                />
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={3}>
                <StatCard
                  icon={FileText}
                  title="Medical Records"
                  value={dashboardStats.total_records}
                  subtitle="Active records"
                  variant="secondary"
                />
              </Col>
              <Col md={3}>
                <StatCard
                  icon={Calendar}
                  title="Treatment Plans"
                  value={dashboardStats.total_plans}
                  subtitle={`${dashboardStats.active_plans || 0} active`}
                  variant="primary"
                />
              </Col>
              <Col md={3}>
                <StatCard
                  icon={TrendingUp}
                  title="Success Rate"
                  value={`${dashboardStats.success_rate || 0}%`}
                  subtitle="Treatment success"
                  variant="success"
                />
              </Col>
              <Col md={3}>
                <StatCard
                  icon={Clock}
                  title="Avg Analysis Time"
                  value={`${dashboardStats.avg_analysis_time || 0}m`}
                  subtitle="Processing time"
                  variant="info"
                />
              </Col>
            </Row>

            {/* Recent Activity */}
            <Row>
              <Col md={6}>
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">Recent Files</h5>
                  </Card.Header>
                  <Card.Body>
                    {dashboardStats.recent_files?.length > 0 ? (
                      <div className="list-group list-group-flush">
                        {dashboardStats.recent_files.map((file, index) => (
                          <div key={index} className="list-group-item d-flex justify-content-between align-items-center px-0">
                            <div>
                              <div className="fw-bold">{file.filename}</div>
                              <small className="text-muted">{file.hospital_name}</small>
                            </div>
                            <Badge bg="outline-primary">{file.file_type}</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted">No recent files</p>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">Recent Analyses</h5>
                  </Card.Header>
                  <Card.Body>
                    {dashboardStats.recent_analyses?.length > 0 ? (
                      <div className="list-group list-group-flush">
                        {dashboardStats.recent_analyses.map((analysis, index) => (
                          <div key={index} className="list-group-item d-flex justify-content-between align-items-center px-0">
                            <div>
                              <div className="fw-bold">{analysis.analysis_type}</div>
                              <small className="text-muted">
                                {analysis.confidence_score ? 
                                  `${(analysis.confidence_score * 100).toFixed(1)}% confidence` : 
                                  'Processing'
                                }
                              </small>
                            </div>
                            <Badge bg={
                              analysis.status === 'completed' ? 'success' :
                              analysis.status === 'processing' ? 'info' :
                              analysis.status === 'failed' ? 'danger' : 'warning'
                            }>
                              {analysis.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted">No recent analyses</p>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* System Status */}
            <Row className="mt-4">
              <Col>
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">System Status</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={3}>
                        <div className="text-center">
                          <div className="h4 mb-0 text-success">●</div>
                          <small>S3 Storage</small>
                        </div>
                      </Col>
                      <Col md={3}>
                        <div className="text-center">
                          <div className="h4 mb-0 text-success">●</div>
                          <small>AI Processing</small>
                        </div>
                      </Col>
                      <Col md={3}>
                        <div className="text-center">
                          <div className="h4 mb-0 text-success">●</div>
                          <small>Database</small>
                        </div>
                      </Col>
                      <Col md={3}>
                        <div className="text-center">
                          <div className="h4 mb-0 text-warning">●</div>
                          <small>Backup</small>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>

          <Tab.Pane eventKey="hospitals">
            <AllopathyHospitalManager />
          </Tab.Pane>

          <Tab.Pane eventKey="patients">
            <AllopathyPatientManager />
          </Tab.Pane>

          <Tab.Pane eventKey="files">
            <AllopathyFileManager />
          </Tab.Pane>

          <Tab.Pane eventKey="analysis">
            <AllopathyAnalysisManager />
          </Tab.Pane>

          <Tab.Pane eventKey="records">
            <AllopathyMedicalRecordsManager />
          </Tab.Pane>

          <Tab.Pane eventKey="treatments">
            <AllopathyTreatmentPlansManager />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default AllopathyDashboard;
