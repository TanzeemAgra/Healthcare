import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Alert,
  Form,
  ListGroup,
  Table,
  Spinner
} from 'react-bootstrap';
import {
  RiShieldUserLine,
  RiCheckLine,
  RiCloseLine,
  RiRefreshLine,
  RiUserLine,
  RiShieldCheckLine,
  RiErrorWarningLine,
  RiTestTubeLine
} from '@remixicon/react';
import { usePermissions } from '../../contexts/PermissionContext';
import { useAuth } from '../../contexts/AuthContext';

// Feature flags for soft coding
const ACCESS_TEST_FEATURES = {
  PERMISSION_TESTING: true,
  ROLE_VALIDATION: true,
  API_ENDPOINT_TESTING: true,
  SECURITY_AUDIT: true
};

const AccessTest = () => {
  const { user } = useAuth();
  const { 
    permissions, 
    dashboardFeatures, 
    isSuperAdmin, 
    canAccessUserManagement,
    canAccessHospitalManagement,
    canAccessClinicManagement 
  } = usePermissions();
  
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastTestTime, setLastTestTime] = useState(null);

  // Check permissions for access test feature
  if (!canAccessUserManagement && !isSuperAdmin) {
    return (
      <Container fluid className="p-4">
        <Alert variant="danger">
          <Alert.Heading>Access Denied</Alert.Heading>
          <p>You don't have permission to access the Access Test feature. Contact your administrator for access.</p>
        </Alert>
      </Container>
    );
  }

  const runAccessTests = async () => {
    setLoading(true);
    const results = [];

    // Test 1: User Authentication Status
    if (ACCESS_TEST_FEATURES.PERMISSION_TESTING) {
      results.push({
        id: 'auth_status',
        name: 'User Authentication',
        status: user ? 'pass' : 'fail',
        description: user ? `Authenticated as ${user.full_name || user.username}` : 'Not authenticated',
        category: 'Authentication'
      });
    }

    // Test 2: Super Admin Status
    if (ACCESS_TEST_FEATURES.ROLE_VALIDATION) {
      results.push({
        id: 'super_admin',
        name: 'Super Admin Status',
        status: isSuperAdmin ? 'pass' : 'info',
        description: isSuperAdmin ? 'User has super admin privileges' : 'Regular admin user',
        category: 'Role Validation'
      });
    }

    // Test 3: User Management Access
    if (ACCESS_TEST_FEATURES.PERMISSION_TESTING) {
      results.push({
        id: 'user_management',
        name: 'User Management Access',
        status: canAccessUserManagement ? 'pass' : 'fail',
        description: canAccessUserManagement ? 'Can access user management' : 'Cannot access user management',
        category: 'Permissions'
      });
    }

    // Test 4: Hospital Management Access
    if (ACCESS_TEST_FEATURES.PERMISSION_TESTING) {
      results.push({
        id: 'hospital_management',
        name: 'Hospital Management Access',
        status: canAccessHospitalManagement ? 'pass' : 'info',
        description: canAccessHospitalManagement ? 'Can access hospital management' : 'Cannot access hospital management',
        category: 'Permissions'
      });
    }

    // Test 5: Clinic Management Access
    if (ACCESS_TEST_FEATURES.PERMISSION_TESTING) {
      results.push({
        id: 'clinic_management',
        name: 'Clinic Management Access',
        status: canAccessClinicManagement ? 'pass' : 'info',
        description: canAccessClinicManagement ? 'Can access clinic management' : 'Cannot access clinic management',
        category: 'Permissions'
      });
    }

    // Test 6: Dashboard Features Check
    if (ACCESS_TEST_FEATURES.SECURITY_AUDIT) {
      const enabledFeatures = Object.keys(dashboardFeatures || {}).filter(
        key => dashboardFeatures[key] === true
      );
      
      results.push({
        id: 'dashboard_features',
        name: 'Dashboard Features',
        status: enabledFeatures.length > 0 ? 'pass' : 'warning',
        description: `${enabledFeatures.length} features enabled: ${enabledFeatures.join(', ') || 'None'}`,
        category: 'Features'
      });
    }

    // Test 7: API Endpoint Accessibility
    if (ACCESS_TEST_FEATURES.API_ENDPOINT_TESTING) {
      try {
        const response = await fetch('/api/hospital/management/me/permissions/', {
          credentials: 'include'
        });
        
        results.push({
          id: 'api_access',
          name: 'API Endpoint Access',
          status: response.ok ? 'pass' : 'fail',
          description: response.ok ? `API accessible (${response.status})` : `API error (${response.status})`,
          category: 'API Testing'
        });
      } catch (error) {
        results.push({
          id: 'api_access',
          name: 'API Endpoint Access',
          status: 'fail',
          description: `API connection failed: ${error.message}`,
          category: 'API Testing'
        });
      }
    }

    // Simulate test execution time
    await new Promise(resolve => setTimeout(resolve, 1500));

    setTestResults(results);
    setLastTestTime(new Date());
    setLoading(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pass':
        return <RiCheckLine className="text-success" />;
      case 'fail':
        return <RiCloseLine className="text-danger" />;
      case 'warning':
        return <RiErrorWarningLine className="text-warning" />;
      default:
        return <RiUserLine className="text-info" />;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pass: 'success',
      fail: 'danger',
      warning: 'warning',
      info: 'info'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status.toUpperCase()}</Badge>;
  };

  const getTestSummary = () => {
    const passed = testResults.filter(t => t.status === 'pass').length;
    const failed = testResults.filter(t => t.status === 'fail').length;
    const warnings = testResults.filter(t => t.status === 'warning').length;
    const info = testResults.filter(t => t.status === 'info').length;

    return { passed, failed, warnings, info, total: testResults.length };
  };

  useEffect(() => {
    // Run initial tests on component mount
    runAccessTests();
  }, []);

  const summary = getTestSummary();

  return (
    <Container fluid className="p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            <RiShieldUserLine className="me-2" />
            Access Test
          </h2>
          <p className="text-muted mb-0">Test user permissions and system access</p>
        </div>
        <div className="d-flex gap-2">
          <Button 
            variant="primary" 
            size="sm" 
            onClick={runAccessTests}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size="sm" className="me-1" />
                Testing...
              </>
            ) : (
              <>
                <RiRefreshLine size={16} className="me-1" />
                Run Tests
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Test Summary */}
      {testResults.length > 0 && (
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center border-success">
              <Card.Body>
                <h4 className="text-success">{summary.passed}</h4>
                <small className="text-muted">Passed</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-danger">
              <Card.Body>
                <h4 className="text-danger">{summary.failed}</h4>
                <small className="text-muted">Failed</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-warning">
              <Card.Body>
                <h4 className="text-warning">{summary.warnings}</h4>
                <small className="text-muted">Warnings</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-info">
              <Card.Body>
                <h4 className="text-info">{summary.info}</h4>
                <small className="text-muted">Info</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* User Information */}
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <RiUserLine className="me-2" />
                Current User Information
              </h5>
            </Card.Header>
            <Card.Body>
              <Table borderless className="mb-0">
                <tbody>
                  <tr>
                    <td><strong>Username:</strong></td>
                    <td>{user?.username || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td><strong>Full Name:</strong></td>
                    <td>{user?.full_name || user?.fullName || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td><strong>Email:</strong></td>
                    <td>{user?.email || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td><strong>Role:</strong></td>
                    <td>
                      {isSuperAdmin ? (
                        <Badge bg="danger">Super Admin</Badge>
                      ) : (
                        <Badge bg="primary">Admin</Badge>
                      )}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <RiTestTubeLine className="me-2" />
                Test Configuration
              </h5>
            </Card.Header>
            <Card.Body>
              <Table borderless className="mb-0">
                <tbody>
                  <tr>
                    <td><strong>Permission Testing:</strong></td>
                    <td>
                      <Badge bg={ACCESS_TEST_FEATURES.PERMISSION_TESTING ? 'success' : 'secondary'}>
                        {ACCESS_TEST_FEATURES.PERMISSION_TESTING ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Role Validation:</strong></td>
                    <td>
                      <Badge bg={ACCESS_TEST_FEATURES.ROLE_VALIDATION ? 'success' : 'secondary'}>
                        {ACCESS_TEST_FEATURES.ROLE_VALIDATION ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>API Testing:</strong></td>
                    <td>
                      <Badge bg={ACCESS_TEST_FEATURES.API_ENDPOINT_TESTING ? 'success' : 'secondary'}>
                        {ACCESS_TEST_FEATURES.API_ENDPOINT_TESTING ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Last Test:</strong></td>
                    <td>{lastTestTime ? lastTestTime.toLocaleString() : 'Never'}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Test Results */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">
            <RiShieldCheckLine className="me-2" />
            Access Test Results
          </h5>
        </Card.Header>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center p-4">
              <Spinner animation="border" className="mb-3" />
              <p>Running access tests...</p>
            </div>
          ) : testResults.length > 0 ? (
            <Table responsive hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Test Name</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {testResults.map((test) => (
                  <tr key={test.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        {getStatusIcon(test.status)}
                        <span className="ms-2">{test.name}</span>
                      </div>
                    </td>
                    <td>
                      <Badge bg="outline-secondary" pill>
                        {test.category}
                      </Badge>
                    </td>
                    <td>{getStatusBadge(test.status)}</td>
                    <td className="text-muted">{test.description}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center p-4">
              <RiTestTubeLine size={48} className="text-muted mb-3" />
              <p className="text-muted">No test results available. Click "Run Tests" to start.</p>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AccessTest;