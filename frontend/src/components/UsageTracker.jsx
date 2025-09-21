/**
 * UsageTracker.jsx
 * 
 * Advanced usage tracking component for monitoring user activity
 * and displaying real-time usage analytics in the dashboard.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Badge, Alert, Spinner, Button, Modal, Table, Tab, Nav } from 'react-bootstrap';
import { 
  FaChartLine, 
  FaUsers, 
  FaRobot, 
  FaFileAlt, 
  FaExclamationTriangle, 
  FaXRay, 
  FaFlask, 
  FaVideo, 
  FaFileMedical,
  FaClock
} from 'react-icons/fa';
import axios from 'axios';
import TimeTracker from './TimeTracker';

const UsageTracker = ({ userId }) => {
  const [usageData, setUsageData] = useState({
    monthly_usage: 0,
    monthly_billing: 0,
    weekly_usage: 0,
    weekly_billing: 0,
    usage_trend: 0,
    billing_trend: 0,
    alerts_count: 0,
    top_categories: [],
    daily_trends: []
  });
  
  const [currentMonthData, setCurrentMonthData] = useState({
    total_usage: 0,
    total_billing: 0,
    month_name: '',
    categories: {},
    alerts_count: 0
  });
  
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeTrackingTab, setActiveTrackingTab] = useState('usage');

  // Get authentication token
  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  // Fetch dashboard usage data
  const fetchUsageData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard widget data
      const dashboardResponse = await axios.get(
        '/api/usage/dashboard/',
        getAuthHeaders()
      );
      
      // Fetch current month counters
      const countersResponse = await axios.get(
        '/api/usage/counters/',
        getAuthHeaders()
      );
      
      // Fetch alerts
      const alertsResponse = await axios.get(
        '/api/usage/alerts/',
        getAuthHeaders()
      );
      
      setUsageData(dashboardResponse.data);
      setCurrentMonthData(countersResponse.data);
      setAlerts(alertsResponse.data);
      
    } catch (error) {
      console.error('Error fetching usage data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Track usage event
  const trackUsage = async (metricCode, categoryCode = null, metadata = {}) => {
    try {
      await axios.post(
        '/api/usage/track/',
        {
          metric_code: metricCode,
          category_code: categoryCode,
          event_type: 'action',
          metadata: metadata
        },
        getAuthHeaders()
      );
      
      // Refresh data after tracking
      setTimeout(fetchUsageData, 1000);
      
    } catch (error) {
      console.error('Error tracking usage:', error);
    }
  };

  // Dismiss alert
  const dismissAlert = async (alertId) => {
    try {
      await axios.post(
        `/api/usage/alerts/${alertId}/dismiss/`,
        {},
        getAuthHeaders()
      );
      
      setAlerts(alerts.filter(alert => alert.id !== alertId));
      
    } catch (error) {
      console.error('Error dismissing alert:', error);
    }
  };

  useEffect(() => {
    fetchUsageData();
    
    // Set up periodic refresh
    const interval = setInterval(fetchUsageData, 60000); // Refresh every minute
    
    return () => clearInterval(interval);
  }, [fetchUsageData]);

  // Expose tracking function globally for easy use
  useEffect(() => {
    window.trackUsage = trackUsage;
    return () => {
      delete window.trackUsage;
    };
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return { icon: '↗️', color: 'success' };
    if (trend < 0) return { icon: '↘️', color: 'danger' };
    return { icon: '➡️', color: 'secondary' };
  };

  const getCategoryIcon = (categoryCode) => {
    const icons = {
      'patient_management': <FaUsers className="text-primary" />,
      'ai_diagnostics': <FaRobot className="text-success" />,
      'radiology': <FaXRay className="text-info" />,
      'laboratory': <FaFlask className="text-warning" />,
      'telemedicine': <FaVideo className="text-secondary" />,
      'reports': <FaFileAlt className="text-dark" />
    };
    return icons[categoryCode] || <FaChartLine />;
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading usage analytics...</p>
      </div>
    );
  }

  return (
    <div className="usage-tracker">
      {/* Tab Navigation for Usage Types */}
      <Tab.Container activeKey={activeTrackingTab} onSelect={setActiveTrackingTab}>
        <Nav variant="pills" className="mb-4 justify-content-center">
          <Nav.Item>
            <Nav.Link eventKey="usage">
              <FaChartLine className="me-2" />
              Feature Usage
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="time">
              <FaClock className="me-2" />
              Time Tracking
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          {/* Feature Usage Tab */}
          <Tab.Pane eventKey="usage">
            {/* Usage Summary Cards */}
            <Row className="mb-4">
              <Col md={3}>
                <Card className="h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-muted mb-1">Monthly Usage</h6>
                        <h4 className="mb-0">{usageData.monthly_usage}</h4>
                        <small className="text-muted">
                          {getTrendIcon(usageData.usage_trend).icon} {Math.abs(usageData.usage_trend).toFixed(1)}%
                        </small>
                      </div>
                <FaChartLine className="text-primary fs-3" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Monthly Billing</h6>
                  <h4 className="mb-0">{formatCurrency(usageData.monthly_billing)}</h4>
                  <small className="text-muted">
                    {getTrendIcon(usageData.billing_trend).icon} {Math.abs(usageData.billing_trend).toFixed(1)}%
                  </small>
                </div>
                <FaFileAlt className="text-success fs-3" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Weekly Activity</h6>
                  <h4 className="mb-0">{usageData.weekly_usage}</h4>
                  <small className="text-success">
                    {formatCurrency(usageData.weekly_billing)}
                  </small>
                </div>
                <FaChartLine className="text-info fs-3" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Active Alerts</h6>
                  <h4 className="mb-0">{usageData.alerts_count}</h4>
                  <small className="text-muted">Requires attention</small>
                </div>
                <FaExclamationTriangle className={`fs-3 ${usageData.alerts_count > 0 ? 'text-warning' : 'text-muted'}`} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <Row className="mb-4">
          <Col>
            <Card>
              <Card.Header>
                <h6 className="mb-0">
                  <FaExclamationTriangle className="me-2" />
                  Usage Alerts
                </h6>
              </Card.Header>
              <Card.Body>
                {alerts.slice(0, 3).map(alert => (
                  <Alert 
                    key={alert.id}
                    variant={alert.level === 'error' ? 'danger' : 'warning'}
                    dismissible
                    onClose={() => dismissAlert(alert.id)}
                  >
                    <strong>{alert.title}</strong>
                    <p className="mb-0 mt-1">{alert.message}</p>
                    {alert.current_value && alert.threshold_value && (
                      <small className="text-muted">
                        Current: {alert.current_value} / Limit: {alert.threshold_value}
                      </small>
                    )}
                  </Alert>
                ))}
                
                {alerts.length > 3 && (
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    onClick={() => setShowDetails(true)}
                  >
                    View All {alerts.length} Alerts
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Category Breakdown */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Usage by Category - {currentMonthData.month_name}</h6>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => setShowDetails(true)}
              >
                View Details
              </Button>
            </Card.Header>
            <Card.Body>
              <Row>
                {Object.entries(currentMonthData.categories).map(([categoryCode, data]) => (
                  <Col md={4} key={categoryCode} className="mb-3">
                    <div className="border rounded p-3">
                      <div className="d-flex align-items-center mb-2">
                        {getCategoryIcon(categoryCode)}
                        <span className="ms-2 fw-bold text-capitalize">
                          {categoryCode.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-center">
                        <h5 className="mb-1">{data.usage_count}</h5>
                        <small className="text-success">
                          {formatCurrency(data.billing_amount)}
                        </small>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
              
              {Object.keys(currentMonthData.categories).length === 0 && (
                <div className="text-center text-muted py-4">
                  <p>No usage data available for this month.</p>
                  <Button 
                    variant="primary"
                    onClick={() => trackUsage('patient_created', 'patient_management')}
                  >
                    Start Tracking Usage
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Usage Details Modal */}
      <Modal 
        show={showDetails} 
        onHide={() => setShowDetails(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Detailed Usage Analytics</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* All Alerts */}
          {alerts.length > 0 && (
            <div className="mb-4">
              <h6>Active Alerts</h6>
              {alerts.map(alert => (
                <Alert 
                  key={alert.id}
                  variant={alert.level === 'error' ? 'danger' : 'warning'}
                  className="mb-2"
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <strong>{alert.title}</strong>
                      <p className="mb-1">{alert.message}</p>
                      <small className="text-muted">
                        {new Date(alert.created_at).toLocaleString()}
                      </small>
                    </div>
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => dismissAlert(alert.id)}
                    >
                      Dismiss
                    </Button>
                  </div>
                </Alert>
              ))}
            </div>
          )}
          
          {/* Category Details */}
          <div>
            <h6>Category Breakdown</h6>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Usage Count</th>
                  <th>Billing Amount</th>
                  <th>Metrics</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(currentMonthData.categories).map(([categoryCode, data]) => (
                  <tr key={categoryCode}>
                    <td>
                      <div className="d-flex align-items-center">
                        {getCategoryIcon(categoryCode)}
                        <span className="ms-2 text-capitalize">
                          {categoryCode.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td>{data.usage_count}</td>
                    <td>{formatCurrency(data.billing_amount)}</td>
                    <td>
                      {Object.keys(data.metrics).length} metrics
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetails(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Quick Action Buttons for Testing */}
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header>
              <h6 className="mb-0">Quick Actions (for testing)</h6>
            </Card.Header>
            <Card.Body>
              <div className="d-flex flex-wrap gap-2">
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => trackUsage('patient_created', 'patient_management')}
                >
                  Create Patient
                </Button>
                <Button 
                  variant="outline-success" 
                  size="sm"
                  onClick={() => trackUsage('ai_diagnosis', 'ai_diagnostics')}
                >
                  AI Diagnosis
                </Button>
                <Button 
                  variant="outline-info" 
                  size="sm"
                  onClick={() => trackUsage('scan_analyzed', 'radiology')}
                >
                  Analyze Scan
                </Button>
                <Button 
                  variant="outline-warning" 
                  size="sm"
                  onClick={() => trackUsage('lab_test', 'laboratory')}
                >
                  Lab Test
                </Button>
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  onClick={() => trackUsage('video_consultation', 'telemedicine')}
                >
                  Video Call
                </Button>
                <Button 
                  variant="outline-dark" 
                  size="sm"
                  onClick={() => trackUsage('report_generated', 'reports')}
                >
                  Generate Report
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
          </Tab.Pane>

          {/* Time Tracking Tab */}
          <Tab.Pane eventKey="time">
            <TimeTracker userId={userId} />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default UsageTracker;
