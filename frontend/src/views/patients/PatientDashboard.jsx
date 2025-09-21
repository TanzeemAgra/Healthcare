import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table, 
  Badge, 
  Spinner,
  Alert,
  Button
} from 'react-bootstrap';
import { 
  FaUsers, 
  FaCalendarAlt, 
  FaHeartbeat, 
  FaFileAlt,
  FaUserMd,
  FaClipboardList,
  FaChartLine,
  FaExclamationTriangle
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import patientService from '../../services/patientService';
import './PatientDashboard.css';

const PatientDashboard = () => {
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, activityData, appointmentsData] = await Promise.all([
        patientService.getDashboardStats(),
        patientService.getRecentActivity(),
        patientService.getUpcomingAppointments()
      ]);
      
      setStats(statsData);
      setRecentActivity(activityData.results || activityData);
      setUpcomingAppointments(appointmentsData.results || appointmentsData);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'scheduled': 'primary',
      'confirmed': 'info',
      'in_progress': 'warning',
      'completed': 'success',
      'cancelled': 'danger',
      'no_show': 'secondary'
    };
    return <Badge bg={statusColors[status] || 'secondary'}>{status.replace('_', ' ')}</Badge>;
  };

  const getActivityIcon = (activityType) => {
    const icons = {
      'patient_created': <FaUsers className="text-success" />,
      'appointment_scheduled': <FaCalendarAlt className="text-primary" />,
      'vital_signs_recorded': <FaHeartbeat className="text-danger" />,
      'lab_result_added': <FaFileAlt className="text-info" />,
      'appointment_completed': <FaCalendarAlt className="text-success" />,
      'appointment_cancelled': <FaCalendarAlt className="text-warning" />
    };
    return icons[activityType] || <FaClipboardList className="text-secondary" />;
  };

  if (loading) {
    return (
      <Container fluid className="patient-dashboard">
        <div className="text-center py-5">
          <Spinner animation="border" />
          <p className="mt-2">Loading dashboard...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="patient-dashboard">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0">
              <FaChartLine className="me-2" />
              Patient Management
            </h2>
            <Link to="/patients/manage">
              <Button variant="primary">
                <FaUsers className="me-1" />
                Manage Patients
              </Button>
            </Link>
          </div>
        </Col>
      </Row>

      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Total Patients</h6>
                  <h3 className="mb-0">{stats.total_patients || 0}</h3>
                </div>
                <div className="stat-icon bg-primary">
                  <FaUsers />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Today's Appointments</h6>
                  <h3 className="mb-0">{stats.todays_appointments || 0}</h3>
                </div>
                <div className="stat-icon bg-info">
                  <FaCalendarAlt />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Active Patients</h6>
                  <h3 className="mb-0">{stats.active_patients || 0}</h3>
                </div>
                <div className="stat-icon bg-success">
                  <FaUserMd />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Pending Results</h6>
                  <h3 className="mb-0">{stats.pending_lab_results || 0}</h3>
                </div>
                <div className="stat-icon bg-warning">
                  <FaFileAlt />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Upcoming Appointments */}
        <Col md={8}>
          <Card className="h-100">
            <Card.Header>
              <h6 className="mb-0">
                <FaCalendarAlt className="me-2" />
                Upcoming Appointments
              </h6>
            </Card.Header>
            <Card.Body>
              {upcomingAppointments.length > 0 ? (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Doctor</th>
                      <th>Type</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingAppointments.slice(0, 10).map((appointment) => (
                      <tr key={appointment.id}>
                        <td>
                          <strong>{appointment.patient_name}</strong>
                        </td>
                        <td>{formatDate(appointment.appointment_date)}</td>
                        <td>{formatTime(appointment.appointment_time)}</td>
                        <td>{appointment.doctor_name || 'Not assigned'}</td>
                        <td className="text-capitalize">{appointment.appointment_type}</td>
                        <td>{getStatusBadge(appointment.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4">
                  <FaCalendarAlt className="text-muted mb-2" size={48} />
                  <p className="text-muted">No upcoming appointments</p>
                </div>
              )}
              {upcomingAppointments.length > 10 && (
                <div className="text-center">
                  <Link to="/appointments">
                    <Button variant="outline-primary" size="sm">
                      View All Appointments
                    </Button>
                  </Link>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Activity */}
        <Col md={4}>
          <Card className="h-100">
            <Card.Header>
              <h6 className="mb-0">
                <FaClipboardList className="me-2" />
                Recent Activity
              </h6>
            </Card.Header>
            <Card.Body>
              {recentActivity.length > 0 ? (
                <div className="activity-timeline">
                  {recentActivity.slice(0, 8).map((activity, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-icon">
                        {getActivityIcon(activity.activity_type)}
                      </div>
                      <div className="activity-content">
                        <p className="mb-1">
                          <strong>{activity.description}</strong>
                        </p>
                        <small className="text-muted">
                          {new Date(activity.timestamp).toLocaleString()}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <FaClipboardList className="text-muted mb-2" size={48} />
                  <p className="text-muted">No recent activity</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header>
              <h6 className="mb-0">Quick Actions</h6>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <Link to="/patients/new" className="text-decoration-none">
                    <div className="quick-action-card text-center p-3">
                      <FaUsers size={32} className="text-primary mb-2" />
                      <h6>Add New Patient</h6>
                      <p className="text-muted small">Register a new patient</p>
                    </div>
                  </Link>
                </Col>
                <Col md={3}>
                  <Link to="/appointments/new" className="text-decoration-none">
                    <div className="quick-action-card text-center p-3">
                      <FaCalendarAlt size={32} className="text-info mb-2" />
                      <h6>Schedule Appointment</h6>
                      <p className="text-muted small">Book new appointment</p>
                    </div>
                  </Link>
                </Col>
                <Col md={3}>
                  <Link to="/vital-signs/new" className="text-decoration-none">
                    <div className="quick-action-card text-center p-3">
                      <FaHeartbeat size={32} className="text-danger mb-2" />
                      <h6>Record Vital Signs</h6>
                      <p className="text-muted small">Add vital signs data</p>
                    </div>
                  </Link>
                </Col>
                <Col md={3}>
                  <Link to="/lab-results/new" className="text-decoration-none">
                    <div className="quick-action-card text-center p-3">
                      <FaFileAlt size={32} className="text-success mb-2" />
                      <h6>Add Lab Result</h6>
                      <p className="text-muted small">Enter lab test results</p>
                    </div>
                  </Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PatientDashboard;
