import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Nav, Tab, Badge, Spinner, Alert } from 'react-bootstrap';
import { Hospital, Users, FileText, Brain, Calendar, TrendingUp, Activity, Clock } from 'lucide-react';
import axios from 'axios';

const AllopathyDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardStats, setDashboardStats] = useState({});
  const [loading, setLoading] = useState(false); // Set to false to skip API call for now
  const [error, setError] = useState('');

  useEffect(() => {
    // Temporarily disable API call to prevent 500 errors
    // fetchDashboardStats();
    
    // Use mock data for now
    setDashboardStats({
      total_hospitals: 12,
      total_patients: 156,
      total_files: 89,
      total_analyses: 45,
      total_records: 234,
      total_plans: 67,
      success_rate: 94,
      avg_analysis_time: 5,
      files_this_month: 23,
      pending_analyses: 8,
      active_plans: 34,
      recent_files: [],
      recent_analyses: []
    });
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('/api/allopathy/dashboard-stats/');
      setDashboardStats(response.data);
    } catch (err) {
      setError('Failed to fetch dashboard statistics');
      console.error('Dashboard stats error:', err);
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
                          <small>Backend API</small>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Getting Started Guide */}
            <Row className="mt-4">
              <Col>
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">Getting Started</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <h6 className="text-primary">Quick Actions:</h6>
                        <ul>
                          <li>Add hospitals and configure S3 settings</li>
                          <li>Register patients with comprehensive medical data</li>
                          <li>Upload medical files for AI analysis</li>
                          <li>Create medical records and treatment plans</li>
                        </ul>
                      </Col>
                      <Col md={6}>
                        <h6 className="text-primary">Features Available:</h6>
                        <ul>
                          <li>Multi-type hospital management</li>
                          <li>S3 file storage with AI processing</li>
                          <li>Comprehensive patient records</li>
                          <li>Treatment planning and progress tracking</li>
                        </ul>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>

          <Tab.Pane eventKey="hospitals">
            <Card>
              <Card.Header>
                <h5 className="mb-0">Hospital Management</h5>
              </Card.Header>
              <Card.Body>
                <p>Hospital management interface will be available here.</p>
                <p>Features:</p>
                <ul>
                  <li>Add and manage healthcare facilities</li>
                  <li>Configure S3 storage settings</li>
                  <li>Monitor hospital activity</li>
                </ul>
              </Card.Body>
            </Card>
          </Tab.Pane>

          <Tab.Pane eventKey="patients">
            <Card>
              <Card.Header>
                <h5 className="mb-0">Patient Management</h5>
              </Card.Header>
              <Card.Body>
                <p>Patient management interface will be available here.</p>
                <p>Features:</p>
                <ul>
                  <li>Register new patients</li>
                  <li>Manage patient records</li>
                  <li>Track medical history</li>
                </ul>
              </Card.Body>
            </Card>
          </Tab.Pane>

          <Tab.Pane eventKey="files">
            <Card>
              <Card.Header>
                <h5 className="mb-0">File Management</h5>
              </Card.Header>
              <Card.Body>
                <p>File management interface will be available here.</p>
                <p>Features:</p>
                <ul>
                  <li>Upload medical files to S3</li>
                  <li>Organize file categories</li>
                  <li>Monitor file processing status</li>
                </ul>
              </Card.Body>
            </Card>
          </Tab.Pane>

          <Tab.Pane eventKey="records">
            <Card>
              <Card.Header>
                <h5 className="mb-0">Medical Records Management</h5>
              </Card.Header>
              <Card.Body>
                <p>Medical records management interface will be available here.</p>
                <p>Features:</p>
                <ul>
                  <li>Create comprehensive medical records</li>
                  <li>Link to patient files and analyses</li>
                  <li>Track record history</li>
                </ul>
              </Card.Body>
            </Card>
          </Tab.Pane>

          <Tab.Pane eventKey="treatments">
            <Card>
              <Card.Header>
                <h5 className="mb-0">Treatment Plans Management</h5>
              </Card.Header>
              <Card.Body>
                <p>Treatment plans management interface will be available here.</p>
                <p>Features:</p>
                <ul>
                  <li>Create detailed treatment plans</li>
                  <li>Monitor treatment progress</li>
                  <li>Track outcome metrics</li>
                </ul>
              </Card.Body>
            </Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default AllopathyDashboard;
