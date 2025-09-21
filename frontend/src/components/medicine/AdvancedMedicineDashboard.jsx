import React, { useState, useEffect } from 'react';
import { MEDICINE_SECTIONS, getEnabledSections } from '../../config/advancedMedicineConfig';

const AdvancedMedicineDashboard = () => {
  const [featureStats, setFeatureStats] = useState({});
  const [systemMetrics, setSystemMetrics] = useState({});

  useEffect(() => {
    // Mock data for demonstration - in real implementation, this would come from API
    setFeatureStats({
      protocols: { total: 15, active: 12, draft: 3, high_priority: 5 },
      contracts: { total: 8, under_review: 3, pending_signature: 2, approved: 3, high_risk: 1 },
      physician_assistant: { total: 23, pending_review: 6, in_progress: 4, high_confidence: 18 },
      booking_assistant: { total: 45, confirmed: 32, pending: 8, urgent: 3, today_appointments: 12 },
      insurance: { total: 67, active_policies: 58, pending_verification: 6, claims_pending: 8 },
      csr_assistant: { total: 34, open_tickets: 12, resolved: 20, high_priority: 5 },
      research_review: { total: 12, approved: 8, under_review: 3, high_relevance: 9 },
      automation: { total: 18, active: 16, paused: 1, error: 1, success_rate: 96.5 },
      clinical_search: { total: 156, completed: 142, high_confidence: 134, avg_response_time: 1.2 }
    });

    setSystemMetrics({
      total_users: 45,
      active_features: 9,
      avg_performance: 97.2,
      uptime: 99.8,
      data_processed_today: 1247,
      alerts_active: 2
    });
  }, []);

  const enabledSections = getEnabledSections().filter(section => section.key !== 'dashboard');

  const getFeatureCard = (sectionKey, stats) => {
    const section = MEDICINE_SECTIONS[sectionKey];
    if (!section || !stats) return null;

    let primaryMetric = '';
    let secondaryMetric = '';
    let statusColor = 'success';

    switch (sectionKey) {
      case 'protocols':
        primaryMetric = `${stats.active} Active`;
        secondaryMetric = `${stats.high_priority} High Priority`;
        statusColor = stats.draft > 5 ? 'warning' : 'success';
        break;
      case 'contracts':
        primaryMetric = `${stats.under_review} Under Review`;
        secondaryMetric = `${stats.high_risk} High Risk`;
        statusColor = stats.high_risk > 0 ? 'warning' : 'success';
        break;
      case 'physician-assistant':
        primaryMetric = `${stats.pending_review} Pending`;
        secondaryMetric = `${Math.round((stats.high_confidence / stats.total) * 100)}% Confidence`;
        statusColor = stats.pending_review > 10 ? 'warning' : 'success';
        break;
      case 'booking-assistant':
        primaryMetric = `${stats.today_appointments} Today`;
        secondaryMetric = `${stats.urgent} Urgent`;
        statusColor = stats.urgent > 5 ? 'danger' : 'success';
        break;
      case 'insurance':
        primaryMetric = `${stats.active_policies} Active`;
        secondaryMetric = `${stats.claims_pending} Claims Pending`;
        statusColor = stats.claims_pending > 10 ? 'warning' : 'success';
        break;
      case 'csr-assistant':
        primaryMetric = `${stats.open_tickets} Open`;
        secondaryMetric = `${stats.high_priority} High Priority`;
        statusColor = stats.open_tickets > 15 ? 'warning' : 'success';
        break;
      case 'research-review':
        primaryMetric = `${stats.approved} Approved`;
        secondaryMetric = `${Math.round((stats.high_relevance / stats.total) * 100)}% Relevant`;
        statusColor = stats.under_review > 5 ? 'info' : 'success';
        break;
      case 'automation':
        primaryMetric = `${stats.active} Active`;
        secondaryMetric = `${stats.success_rate}% Success`;
        statusColor = stats.error > 0 ? 'warning' : 'success';
        break;
      case 'clinical-search':
        primaryMetric = `${stats.completed} Completed`;
        secondaryMetric = `${stats.avg_response_time}s Avg Time`;
        statusColor = stats.avg_response_time > 2 ? 'warning' : 'success';
        break;
      default:
        primaryMetric = stats.total || '0';
        secondaryMetric = 'Total Records';
    }

    return (
      <div key={sectionKey} className="col-lg-4 col-md-6 mb-4">
        <div className={`card border-start border-${section.color} border-4 h-100`}>
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="flex-grow-1">
                <h6 className="text-muted text-uppercase mb-1">{section.label}</h6>
                <h4 className="mb-1">{primaryMetric}</h4>
                <p className="text-muted small mb-0">{secondaryMetric}</p>
              </div>
              <div className={`text-${section.color}`}>
                <i className={`${section.icon}`} style={{ fontSize: '2.5rem' }}></i>
              </div>
            </div>
            <div className="mt-3">
              <span className={`badge bg-${statusColor} me-2`}>
                {stats.total} Total
              </span>
              <small className="text-muted">{section.description}</small>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getSystemHealthCard = () => (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">
          <i className="ri-dashboard-3-line me-2"></i>
          System Health & Performance
        </h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-3 mb-3">
            <div className="text-center">
              <h3 className="text-primary">{systemMetrics.active_features}</h3>
              <p className="text-muted mb-0">Active Features</p>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="text-center">
              <h3 className="text-success">{systemMetrics.avg_performance}%</h3>
              <p className="text-muted mb-0">Avg Performance</p>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="text-center">
              <h3 className="text-info">{systemMetrics.uptime}%</h3>
              <p className="text-muted mb-0">System Uptime</p>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="text-center">
              <h3 className="text-warning">{systemMetrics.alerts_active}</h3>
              <p className="text-muted mb-0">Active Alerts</p>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-12">
            <h6>Feature Performance Overview</h6>
            <div className="progress-stacked" style={{ height: '20px' }}>
              <div className="progress" style={{ width: '30%' }}>
                <div className="progress-bar bg-success" style={{ width: '100%' }}>Operational</div>
              </div>
              <div className="progress" style={{ width: '60%' }}>
                <div className="progress-bar bg-info" style={{ width: '100%' }}>Active</div>
              </div>
              <div className="progress" style={{ width: '8%' }}>
                <div className="progress-bar bg-warning" style={{ width: '100%' }}>Monitoring</div>
              </div>
              <div className="progress" style={{ width: '2%' }}>
                <div className="progress-bar bg-danger" style={{ width: '100%' }}>Issues</div>
              </div>
            </div>
            <div className="d-flex justify-content-between mt-2 small text-muted">
              <span>Operational (30%)</span>
              <span>Active (60%)</span>
              <span>Monitoring (8%)</span>
              <span>Issues (2%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const getQuickActionsCard = () => (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">
          <i className="ri-flashlight-line me-2"></i>
          Quick Actions
        </h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-4 mb-2">
            <button className="btn btn-outline-primary w-100">
              <i className="ri-add-line me-1"></i>
              New Protocol
            </button>
          </div>
          <div className="col-md-4 mb-2">
            <button className="btn btn-outline-success w-100">
              <i className="ri-calendar-check-line me-1"></i>
              Schedule Appointment
            </button>
          </div>
          <div className="col-md-4 mb-2">
            <button className="btn btn-outline-info w-100">
              <i className="ri-search-line me-1"></i>
              Clinical Search
            </button>
          </div>
          <div className="col-md-4 mb-2">
            <button className="btn btn-outline-warning w-100">
              <i className="ri-contract-line me-1"></i>
              Review Contract
            </button>
          </div>
          <div className="col-md-4 mb-2">
            <button className="btn btn-outline-secondary w-100">
              <i className="ri-customer-service-line me-1"></i>
              Create Ticket
            </button>
          </div>
          <div className="col-md-4 mb-2">
            <button className="btn btn-outline-dark w-100">
              <i className="ri-settings-line me-1"></i>
              System Config
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="advanced-medicine-dashboard">
      {/* Welcome Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="alert alert-primary border-0">
            <div className="d-flex align-items-center">
              <div className="flex-grow-1">
                <h4 className="alert-heading mb-1">
                  <i className="ri-hospital-line me-2"></i>
                  Advanced Medicine Management Center
                </h4>
                <p className="mb-0">
                  Comprehensive healthcare management system with AI-powered tools and automated workflows. 
                  Monitor, manage, and optimize all advanced medicine features from this central dashboard.
                </p>
              </div>
              <div className="text-primary">
                <i className="ri-medicine-bottle-line" style={{ fontSize: '3rem' }}></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="row mb-4">
        <div className="col-12">
          {getSystemHealthCard()}
        </div>
      </div>

      {/* Feature Statistics */}
      <div className="row mb-4">
        <div className="col-12">
          <h5 className="mb-3">
            <i className="ri-bar-chart-line me-2"></i>
            Feature Statistics
          </h5>
        </div>
        {enabledSections.map(section => 
          getFeatureCard(section.key, featureStats[section.key.replace('-', '_')])
        )}
      </div>

      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col-lg-8">
          {getQuickActionsCard()}
        </div>
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="ri-notification-line me-2"></i>
                System Notifications
              </h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item d-flex align-items-start">
                  <div className="badge bg-success rounded-pill me-3 mt-1">✓</div>
                  <div className="flex-grow-1">
                    <h6 className="mb-1">Automation Running Smoothly</h6>
                    <p className="mb-1 small text-muted">All automated processes are functioning optimally</p>
                    <small className="text-muted">2 minutes ago</small>
                  </div>
                </div>
                <div className="list-group-item d-flex align-items-start">
                  <div className="badge bg-warning rounded-pill me-3 mt-1">!</div>
                  <div className="flex-grow-1">
                    <h6 className="mb-1">High Priority CSR Tickets</h6>
                    <p className="mb-1 small text-muted">5 tickets require immediate attention</p>
                    <small className="text-muted">15 minutes ago</small>
                  </div>
                </div>
                <div className="list-group-item d-flex align-items-start">
                  <div className="badge bg-info rounded-pill me-3 mt-1">i</div>
                  <div className="flex-grow-1">
                    <h6 className="mb-1">New Research Available</h6>
                    <p className="mb-1 small text-muted">3 new studies pending review</p>
                    <small className="text-muted">1 hour ago</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="ri-time-line me-2"></i>
                Recent Activity Summary
              </h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Feature</th>
                      <th>Action</th>
                      <th>User</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>10:30 AM</td>
                      <td><span className="badge bg-primary">Protocols</span></td>
                      <td>New cardiac protocol created</td>
                      <td>Dr. Williams</td>
                      <td><span className="badge bg-success">Completed</span></td>
                    </tr>
                    <tr>
                      <td>10:15 AM</td>
                      <td><span className="badge bg-info">Booking</span></td>
                      <td>Emergency appointment scheduled</td>
                      <td>AI Assistant</td>
                      <td><span className="badge bg-success">Completed</span></td>
                    </tr>
                    <tr>
                      <td>09:45 AM</td>
                      <td><span className="badge bg-warning">Contracts</span></td>
                      <td>Equipment lease contract reviewed</td>
                      <td>Legal Team</td>
                      <td><span className="badge bg-info">In Progress</span></td>
                    </tr>
                    <tr>
                      <td>09:30 AM</td>
                      <td><span className="badge bg-success">Insurance</span></td>
                      <td>Policy verification completed</td>
                      <td>System</td>
                      <td><span className="badge bg-success">Completed</span></td>
                    </tr>
                    <tr>
                      <td>09:15 AM</td>
                      <td><span className="badge bg-secondary">Research</span></td>
                      <td>New diabetes study reviewed</td>
                      <td>Dr. Johnson</td>
                      <td><span className="badge bg-success">Approved</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedMedicineDashboard;
