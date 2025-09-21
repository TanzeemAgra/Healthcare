import React from 'react';
import { usePermissions } from '../../contexts/PermissionContext';
import { Card, Container, Row, Col, Badge, Table } from 'react-bootstrap';

const PermissionDebugger = () => {
  const permissions = usePermissions();
  
  const getCurrentUser = () => {
    const userFromStorage = localStorage.getItem('user');
    const authFromStorage = localStorage.getItem('auth');
    
    try {
      return {
        fromUser: userFromStorage ? JSON.parse(userFromStorage) : null,
        fromAuth: authFromStorage ? JSON.parse(authFromStorage) : null
      };
    } catch (e) {
      return { error: 'Failed to parse user data' };
    }
  };
  
  const userInfo = getCurrentUser();
  
  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5>🔍 Permission Debugger</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h6>User Information</h6>
                  <Table size="sm" striped>
                    <tbody>
                      <tr>
                        <td><strong>Permission Loading:</strong></td>
                        <td>
                          <Badge bg={permissions.loading ? 'warning' : 'success'}>
                            {permissions.loading ? 'Loading' : 'Loaded'}
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>User Role:</strong></td>
                        <td>{userInfo.fromUser?.role || 'Unknown'}</td>
                      </tr>
                      <tr>
                        <td><strong>Is Super Admin:</strong></td>
                        <td>
                          <Badge bg={permissions.isSuperAdmin?.() ? 'success' : 'danger'}>
                            {permissions.isSuperAdmin?.() ? 'Yes' : 'No'}
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Auth Email:</strong></td>
                        <td>{userInfo.fromAuth?.user?.email || 'N/A'}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
                
                <Col md={6}>
                  <h6>DNA Sequencing Permissions</h6>
                  <Table size="sm" striped>
                    <tbody>
                      <tr>
                        <td><strong>canAccessDnaSequencingModule:</strong></td>
                        <td>
                          <Badge bg={permissions.canAccessDnaSequencingModule?.() ? 'success' : 'danger'}>
                            {permissions.canAccessDnaSequencingModule?.() ? 'Allowed' : 'Denied'}
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>DNA Sequencing Feature:</strong></td>
                        <td>
                          <Badge bg={permissions.hasDashboardFeature?.('dna_sequencing_module') ? 'success' : 'danger'}>
                            {permissions.hasDashboardFeature?.('dna_sequencing_module') ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Function Available:</strong></td>
                        <td>
                          <Badge bg={typeof permissions.canAccessDnaSequencingModule === 'function' ? 'success' : 'danger'}>
                            {typeof permissions.canAccessDnaSequencingModule === 'function' ? 'Yes' : 'No'}
                          </Badge>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
              
              <Row className="mt-3">
                <Col>
                  <h6>All Available Permissions</h6>
                  <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                    <Table size="sm">
                      <thead>
                        <tr>
                          <th>Permission</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(permissions).map(([key, value]) => {
                          if (typeof value === 'function') {
                            try {
                              const result = value();
                              return (
                                <tr key={key}>
                                  <td><small>{key}</small></td>
                                  <td>
                                    <Badge bg={result ? 'success' : 'secondary'} size="sm">
                                      {result ? 'Allow' : 'Deny'}
                                    </Badge>
                                  </td>
                                </tr>
                              );
                            } catch (e) {
                              return (
                                <tr key={key}>
                                  <td><small>{key}</small></td>
                                  <td>
                                    <Badge bg="danger" size="sm">Error</Badge>
                                  </td>
                                </tr>
                              );
                            }
                          }
                          return null;
                        }).filter(Boolean)}
                      </tbody>
                    </Table>
                  </div>
                </Col>
              </Row>
              
              <Row className="mt-3">
                <Col>
                  <h6>Dashboard Features</h6>
                  <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                    <Table size="sm">
                      <thead>
                        <tr>
                          <th>Feature</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(permissions.dashboardFeatures || {}).map(([key, value]) => (
                          <tr key={key}>
                            <td><small>{key}</small></td>
                            <td>
                              <Badge bg={value ? 'success' : 'secondary'} size="sm">
                                {value ? 'Enabled' : 'Disabled'}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PermissionDebugger;
