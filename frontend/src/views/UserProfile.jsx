import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  RiUserLine, 
  RiShieldCheckLine, 
  RiStethoscopeLine,
  RiNurseLine,
  RiUserHeartLine,
  RiCapsuleLine,
  RiArrowRightLine
} from '@remixicon/react';

const UserProfile = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <Container className="py-5">
        <Card>
          <Card.Body className="text-center">
            <RiUserLine size={48} className="text-muted mb-3" />
            <h5>Please log in to view your profile</h5>
            <Button as={Link} to="/login" variant="primary">
              Go to Login
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'super_admin':
      case 'admin':
        return <RiShieldCheckLine size={24} className="text-primary" />;
      case 'doctor':
        return <RiStethoscopeLine size={24} className="text-success" />;
      case 'nurse':
        return <RiNurseLine size={24} className="text-info" />;
      case 'patient':
        return <RiUserHeartLine size={24} className="text-warning" />;
      case 'pharmacist':
        return <RiCapsuleLine size={24} className="text-purple" />;
      default:
        return <RiUserLine size={24} className="text-secondary" />;
    }
  };

  const getProfileLink = (role) => {
    switch (role) {
      case 'doctor':
        return '/doctor/doctor-profile';
      case 'super_admin':
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/SecureNeat/profile';
    }
  };

  const getProfileLinkText = (role) => {
    switch (role) {
      case 'doctor':
        return 'View Doctor Profile';
      case 'super_admin':
      case 'admin':
        return 'Go to Admin Dashboard';
      default:
        return 'View Full Profile';
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <div className="d-flex align-items-center">
                {getRoleIcon(user.role)}
                <div className="ms-3">
                  <h5 className="mb-0">Profile Overview</h5>
                  <small>Welcome back, {user.full_name}</small>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h6 className="text-muted">Personal Information</h6>
                  <div className="mb-3">
                    <strong>Full Name:</strong> {user.full_name}
                  </div>
                  <div className="mb-3">
                    <strong>Email:</strong> {user.email}
                  </div>
                  <div className="mb-3">
                    <strong>Username:</strong> {user.username}
                  </div>
                  <div className="mb-3">
                    <strong>Role:</strong> 
                    <span className={`badge ms-2 ${
                      user.role === 'super_admin' ? 'bg-danger' :
                      user.role === 'admin' ? 'bg-primary' :
                      user.role === 'doctor' ? 'bg-success' :
                      user.role === 'nurse' ? 'bg-info' :
                      user.role === 'patient' ? 'bg-warning' :
                      user.role === 'pharmacist' ? 'bg-purple' : 'bg-secondary'
                    }`}>
                      {user.role.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </Col>
                <Col md={6}>
                  <h6 className="text-muted">Account Status</h6>
                  <div className="mb-3">
                    <strong>Account Status:</strong> 
                    <span className={`badge ms-2 ${user.is_active ? 'bg-success' : 'bg-danger'}`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="mb-3">
                    <strong>Email Verified:</strong>
                    <span className={`badge ms-2 ${user.is_verified ? 'bg-success' : 'bg-warning'}`}>
                      {user.is_verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  {user.is_superuser && (
                    <div className="mb-3">
                      <strong>Super User:</strong>
                      <span className="badge bg-danger ms-2">Yes</span>
                    </div>
                  )}
                  {user.subscription_bypass && (
                    <div className="mb-3">
                      <strong>Subscription:</strong>
                      <span className="badge bg-success ms-2">Unlimited Access</span>
                    </div>
                  )}
                </Col>
              </Row>

              <hr />

              <div className="text-center">
                <Button 
                  as={Link} 
                  to={getProfileLink(user.role)}
                  variant="primary"
                  size="lg"
                  className="me-3"
                >
                  {getProfileLinkText(user.role)}
                  <RiArrowRightLine size={16} className="ms-2" />
                </Button>
                
                {user.role === 'doctor' && (
                  <Button 
                    as={Link} 
                    to="/SecureNeat/profile"
                    variant="outline-primary"
                    size="lg"
                  >
                    SecureNeat Profile
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;
