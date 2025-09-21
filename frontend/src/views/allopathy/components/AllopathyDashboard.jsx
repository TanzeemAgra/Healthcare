import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Alert, Spinner, Badge, ProgressBar } from 'react-bootstrap';
import { 
  FaHospital, 
  FaUserInjured, 
  FaFileAlt, 
  FaChartLine, 
  FaNotes, 
  FaCalendarAlt,
  FaExclamationTriangle,
  FaClock,
  FaCheckCircle
} from 'react-icons/fa';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { allopathyS3Config } from '../../../../utils/allopathyS3Config';
import axios from 'axios';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AllopathyDashboard = ({ stats, onRefresh, onNotification }) => {
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState({
    recentActivity: [],
    criticalAlerts: [],
    storageUsage: {},
    analysisResults: {},
    patientFlow: {}
  });
  const [chartData, setChartData] = useState({
    patientAdmissions: { labels: [], datasets: [] },
    fileUploads: { labels: [], datasets: [] },
    analysisTypes: { labels: [], datasets: [] }
  });

  useEffect(() => {
    fetchDashboardData();
  }, [stats]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const baseURL = allopathyS3Config.api.baseURL;

      // Fetch analytics data
      const [storageRes, analysisRes] = await Promise.all([
        axios.get(`${baseURL}/allopathy/files/storage-analytics/`),
        axios.get(`${baseURL}/allopathy/analyses/?status=completed&limit=100`)
      ]);

      // Process analytics data
      const storageData = storageRes.data;
      const analysisData = analysisRes.data;

      setAnalytics({
        storageUsage: storageData,
        analysisResults: processAnalysisData(analysisData.results || analysisData),
        criticalAlerts: generateCriticalAlerts(),
        recentActivity: generateRecentActivity()
      });

      // Generate chart data
      generateChartData();

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      onNotification('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const processAnalysisData = (analyses) => {
    const typeCount = {};
    const confidenceStats = { high: 0, medium: 0, low: 0 };
    
    analyses.forEach(analysis => {
      // Count by type
      typeCount[analysis.analysis_type] = (typeCount[analysis.analysis_type] || 0) + 1;
      
      // Count by confidence
      const confidence = analysis.confidence_score;
      if (confidence >= allopathyS3Config.analysis.confidenceThresholds.high) {
        confidenceStats.high++;
      } else if (confidence >= allopathyS3Config.analysis.confidenceThresholds.medium) {
        confidenceStats.medium++;
      } else {
        confidenceStats.low++;
      }
    });

    return { typeCount, confidenceStats };
  };

  const generateCriticalAlerts = () => {
    return [
      {
        id: 1,
        message: 'High storage usage detected',
        type: 'warning',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 2,
        message: '5 analyses require review',
        type: 'info',
        timestamp: new Date(Date.now() - 30 * 60 * 1000)
      }
    ];
  };

  const generateRecentActivity = () => {
    return [
      {
        id: 1,
        action: 'Patient admitted',
        details: 'John Doe - Emergency',
        timestamp: new Date(Date.now() - 15 * 60 * 1000)
      },
      {
        id: 2,
        action: 'Lab results uploaded',
        details: 'CBC Report - Patient #12345',
        timestamp: new Date(Date.now() - 45 * 60 * 1000)
      },
      {
        id: 3,
        action: 'Analysis completed',
        details: 'Radiology analysis with 95% confidence',
        timestamp: new Date(Date.now() - 90 * 60 * 1000)
      }
    ];
  };

  const generateChartData = () => {
    const colors = allopathyS3Config.charts.colors;
    
    // Patient admissions over time (mock data)
    const patientAdmissions = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Patient Admissions',
        data: [45, 52, 48, 61, 55, 67],
        borderColor: colors.primary,
        backgroundColor: colors.primary + '20',
        tension: 0.4
      }]
    };

    // File uploads by category
    const fileUploads = {
      labels: ['Lab Results', 'Radiology', 'Pathology', 'Prescriptions', 'Other'],
      datasets: [{
        label: 'File Uploads',
        data: [120, 89, 67, 156, 78],
        backgroundColor: [
          colors.primary,
          colors.success,
          colors.warning,
          colors.info,
          colors.secondary
        ]
      }]
    };

    // Analysis types distribution
    const analysisTypes = {
      labels: ['Lab Analysis', 'Radiology', 'Drug Interaction', 'Risk Assessment', 'Other'],
      datasets: [{
        data: [35, 28, 15, 12, 10],
        backgroundColor: [
          colors.primary,
          colors.success,
          colors.warning,
          colors.danger,
          colors.secondary
        ]
      }]
    };

    setChartData({
      patientAdmissions,
      fileUploads,
      analysisTypes
    });
  };

  const getStatCard = (title, value, icon, color, change = null) => (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <p className="text-muted mb-1 small">{title}</p>
            <h3 className="mb-0">{value.toLocaleString()}</h3>
            {change && (
              <small className={`text-${change >= 0 ? 'success' : 'danger'}`}>
                {change >= 0 ? '+' : ''}{change}% from last month
              </small>
            )}
          </div>
          <div className={`text-${color} fs-1 opacity-75`}>
            {icon}
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - timestamp) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="allopathy-dashboard">
      {/* Statistics Cards */}
      <Row className="g-4 mb-4">
        <Col lg={2} md={4} sm={6}>
          {getStatCard('Hospitals', stats.hospitals, <FaHospital />, 'primary', 5)}
        </Col>
        <Col lg={2} md={4} sm={6}>
          {getStatCard('Patients', stats.patients, <FaUserInjured />, 'success', 12)}
        </Col>
        <Col lg={2} md={4} sm={6}>
          {getStatCard('Files', stats.files, <FaFileAlt />, 'info', 8)}
        </Col>
        <Col lg={2} md={4} sm={6}>
          {getStatCard('Analyses', stats.analyses, <FaChartLine />, 'warning', 15)}
        </Col>
        <Col lg={2} md={4} sm={6}>
          {getStatCard('Records', stats.medicalRecords, <FaNotes />, 'secondary', 3)}
        </Col>
        <Col lg={2} md={4} sm={6}>
          {getStatCard('Plans', stats.treatmentPlans, <FaCalendarAlt />, 'danger', 7)}
        </Col>
      </Row>

      {/* Main Dashboard Content */}
      <Row className="g-4">
        {/* Patient Admissions Chart */}
        <Col lg={8}>
          <Card className="h-100">
            <Card.Header>
              <Card.Title className="h6 mb-0">Patient Admissions Trend</Card.Title>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px' }}>
                <Line data={chartData.patientAdmissions} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Analysis Types */}
        <Col lg={4}>
          <Card className="h-100">
            <Card.Header>
              <Card.Title className="h6 mb-0">Analysis Types</Card.Title>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px' }}>
                <Doughnut data={chartData.analysisTypes} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* File Categories */}
        <Col lg={6}>
          <Card className="h-100">
            <Card.Header>
              <Card.Title className="h6 mb-0">File Categories</Card.Title>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '250px' }}>
                <Bar data={chartData.fileUploads} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Storage Usage */}
        <Col lg={6}>
          <Card className="h-100">
            <Card.Header>
              <Card.Title className="h6 mb-0">Storage Usage</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between small text-muted mb-1">
                  <span>Used Storage</span>
                  <span>{analytics.storageUsage.total_size_gb || 0} GB</span>
                </div>
                <ProgressBar now={65} variant="primary" />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between small text-muted mb-1">
                  <span>Files Processed</span>
                  <span>89%</span>
                </div>
                <ProgressBar now={89} variant="success" />
              </div>
              <div className="small text-muted">
                <div>Total Files: {analytics.storageUsage.total_files || 0}</div>
                <div>Average File Size: 2.3 MB</div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Critical Alerts */}
        <Col lg={6}>
          <Card className="h-100">
            <Card.Header>
              <Card.Title className="h6 mb-0">
                <FaExclamationTriangle className="me-2 text-warning" />
                Critical Alerts
              </Card.Title>
            </Card.Header>
            <Card.Body>
              {analytics.criticalAlerts.length > 0 ? (
                analytics.criticalAlerts.map(alert => (
                  <Alert key={alert.id} variant={alert.type} className="py-2 small">
                    <div className="d-flex justify-content-between">
                      <span>{alert.message}</span>
                      <small className="text-muted">
                        {formatTimeAgo(alert.timestamp)}
                      </small>
                    </div>
                  </Alert>
                ))
              ) : (
                <div className="text-center text-muted py-4">
                  <FaCheckCircle className="mb-2 fs-1 text-success" />
                  <div>No critical alerts</div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Activity */}
        <Col lg={6}>
          <Card className="h-100">
            <Card.Header>
              <Card.Title className="h6 mb-0">
                <FaClock className="me-2 text-info" />
                Recent Activity
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="activity-feed">
                {analytics.recentActivity.map(activity => (
                  <div key={activity.id} className="d-flex mb-3">
                    <div className="flex-shrink-0">
                      <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" 
                           style={{ width: '8px', height: '8px' }}></div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <div className="small font-weight-bold">{activity.action}</div>
                      <div className="small text-muted">{activity.details}</div>
                      <div className="small text-muted">{formatTimeAgo(activity.timestamp)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* System Health Indicators */}
      <Row className="g-4 mt-2">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title className="h6">System Health</Card.Title>
              <Row>
                <Col md={3}>
                  <div className="text-center">
                    <div className="text-success fs-4">
                      <FaCheckCircle />
                    </div>
                    <div className="small">API Status</div>
                    <div className="small text-success">Online</div>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <div className="text-success fs-4">
                      <FaCheckCircle />
                    </div>
                    <div className="small">Database</div>
                    <div className="small text-success">Connected</div>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <div className="text-success fs-4">
                      <FaCheckCircle />
                    </div>
                    <div className="small">S3 Storage</div>
                    <div className="small text-success">Available</div>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <div className="text-warning fs-4">
                      <FaExclamationTriangle />
                    </div>
                    <div className="small">AI Analysis</div>
                    <div className="small text-warning">Queue: 3</div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AllopathyDashboard;
