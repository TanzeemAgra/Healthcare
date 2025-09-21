/**
 * Admin Permission Management Component
 * Super Admin interface for managing individual admin permissions
 */
import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Badge,
  Spinner,
  Tabs,
  Tab,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import {
  RiShieldLine,
  RiUserSettingsLine,
  RiLockLine,
  RiEditLine,
  RiSaveLine,
  RiCloseLine,
  RiCheckLine,
  RiErrorWarningLine,
  RiEyeLine,
  RiUserLine,
  RiTeamLine,
  RiSettingsLine,
  RiBarChartLine,
  RiRefreshLine
} from '@remixicon/react';

const AdminPermissionManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [dashboardFeatures, setDashboardFeatures] = useState({});
  const [saving, setSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // use shared apiClient configured via env/proxy

  useEffect(() => {
    fetchCurrentUser();
    fetchAdminUsers();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await apiClient.get('/auth/profile/');
      setCurrentUser(response.data.user);
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      setError('Authentication required. Please log in as super admin.');
    }
  };

  const fetchAdminUsers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/hospital/management/admin-users/');

      if (response.data.success) {
        setAdmins(response.data.users || []);
      } else {
        setError('Failed to fetch admin users');
      }
    } catch (error) {
      setError('Failed to fetch admin users: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminPermissions = async (adminId) => {
    try {
      const response = await apiClient.get(`/hospital/management/users/${adminId}/permissions/`);
      if (response.data.success) {
        setPermissions(response.data.permissions || {});
        setDashboardFeatures(response.data.dashboard_features || {});
      }
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
      setError('Failed to fetch admin permissions');
    }
  };

  const updateAdminPermissions = async () => {
    if (!selectedAdmin) return;

    setSaving(true);
    try {
      const response = await apiClient.put(`/hospital/management/users/${selectedAdmin.id}/permissions/`, {
        permissions: permissions,
        dashboard_features: dashboardFeatures
      });

      if (response.data.success) {
        setSuccess('Admin permissions updated successfully!');
        setShowModal(false);
        fetchAdminUsers(); // Refresh the list
      } else {
        setError(response.data.error || 'Failed to update permissions');
      }
    } catch (error) {
      setError('Failed to update permissions: ' + (error.response?.data?.error || error.message));
    } finally {
      setSaving(false);
    }
  };

  const openPermissionModal = async (admin) => {
    setSelectedAdmin(admin);
    setShowModal(true);
    await fetchAdminPermissions(admin.id);
  };

  const handlePermissionChange = (key, value) => {
    setPermissions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleFeatureChange = (key, value) => {
    setDashboardFeatures(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getPermissionStatus = (admin) => {
    if (!admin.admin_permissions && !admin.dashboard_features) {
      return { status: 'default', text: 'Default Access', color: 'primary' };
    }
    
    const restrictedCount = Object.values(admin.admin_permissions || {}).filter(val => val === false).length;
    if (restrictedCount === 0) {
      return { status: 'full', text: 'Full Access', color: 'success' };
    } else if (restrictedCount > 5) {
      return { status: 'restricted', text: 'Restricted', color: 'danger' };
    } else {
      return { status: 'limited', text: 'Limited Access', color: 'warning' };
    }
  };

  // Permission categories for better organization
  const permissionCategories = {
    user_management: {
      title: 'User Management',
      icon: RiUserLine,
      permissions: [
        { key: 'can_manage_users', label: 'Manage Users', description: 'Create, edit, and delete user accounts' },
        { key: 'can_view_reports', label: 'View Reports', description: 'Access user reports and analytics' },
        { key: 'can_manage_departments', label: 'Manage Departments', description: 'Create and manage departments' }
      ]
    },
    financial: {
      title: 'Financial & Billing',
      icon: RiBarChartLine,
      permissions: [
        { key: 'can_access_billing', label: 'Access Billing', description: 'View and manage billing information' },
        { key: 'can_manage_inventory', label: 'Manage Inventory', description: 'Inventory management access' }
      ]
    },
    emergency: {
      title: 'Emergency Access',
      icon: RiErrorWarningLine,
      permissions: [
        { key: 'can_access_emergency', label: 'Emergency Access', description: 'Access emergency systems and protocols' }
      ]
    }
  };

  const featureCategories = {
    user_features: {
      title: 'User Management Features',
      icon: RiTeamLine,
      features: [
        { key: 'user_management', label: 'User Management', description: 'Basic user management interface' },
        { key: 'patient_management', label: 'Patient Management', description: 'Patient registration and records' },
        { key: 'doctor_management', label: 'Doctor Management', description: 'Doctor profiles and scheduling' },
        { key: 'nurse_management', label: 'Nurse Management', description: 'Nurse assignments and schedules' },
        { key: 'pharmacist_management', label: 'Pharmacist Management', description: 'Pharmacy staff management' }
      ]
    },
    medical_modules: {
      title: 'Medical Modules',
      icon: RiSettingsLine,
      features: [
        { key: 'medicine_module', label: 'Medicine Module', description: 'General medicine features' },
        { key: 'dentistry_module', label: 'Dentistry Module', description: 'Dental care management' },
        { key: 'dermatology_module', label: 'Dermatology Module', description: 'Skin care management' },
        { key: 'pathology_module', label: 'Pathology Module', description: 'Lab tests and pathology' },
        { key: 'radiology_module', label: 'Radiology Module', description: 'Imaging and radiology' }
      ]
    },
    admin_features: {
      title: 'Administrative Features',
      icon: RiShieldLine,
      features: [
        { key: 'subscription_management', label: 'Subscription Management (Disabled)', description: 'Disabled due to security review', disabled: true },
        { key: 'billing_reports', label: 'Billing Reports', description: 'Financial reporting access' },
        { key: 'financial_dashboard', label: 'Financial Dashboard', description: 'Financial analytics dashboard' },
        { key: 'system_settings', label: 'System Settings', description: 'System configuration access' },
        { key: 'audit_logs', label: 'Audit Logs', description: 'System audit and logging' }
      ]
    },
    analytics: {
      title: 'Analytics & Reports',
      icon: RiBarChartLine,
      features: [
        { key: 'user_analytics', label: 'User Analytics', description: 'User behavior analytics' },
        { key: 'medical_reports', label: 'Medical Reports', description: 'Medical data reporting' },
        { key: 'revenue_reports', label: 'Revenue Reports', description: 'Financial performance reports' },
        { key: 'appointment_analytics', label: 'Appointment Analytics', description: 'Appointment system analytics' },
        { key: 'inventory_reports', label: 'Inventory Reports', description: 'Inventory tracking reports' }
      ]
    },
    actions: {
      title: 'Action Permissions',
      icon: RiCheckLine,
      features: [
        { key: 'create_user', label: 'Create Users', description: 'Permission to create new users' },
        { key: 'schedule_appointment', label: 'Schedule Appointments', description: 'Appointment scheduling access' },
        { key: 'generate_report', label: 'Generate Reports', description: 'Report generation capabilities' },
        { key: 'backup_system', label: 'Backup System', description: 'System backup and restore' },
        { key: 'send_notifications', label: 'Send Notifications', description: 'System notification management' }
      ]
    }
  };

  if (currentUser?.role !== 'super_admin') {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <RiErrorWarningLine className="me-2" />
          <strong>Access Denied:</strong> Only Super Administrators can manage admin permissions.
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-0">
                <RiShieldLine className="me-3 text-primary" />
                Admin Permission Management
              </h2>
              <p className="text-muted mb-0">Control individual admin access and permissions</p>
            </div>
            <Button variant="outline-primary" onClick={fetchAdminUsers} disabled={loading}>
              <RiRefreshLine className="me-1" />
              Refresh
            </Button>
          </div>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4" dismissible onClose={() => setError('')}>
          <RiErrorWarningLine className="me-2" />
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" className="mb-4" dismissible onClose={() => setSuccess('')}>
          <RiCheckLine className="me-2" />
          {success}
        </Alert>
      )}

      <Card>
        <Card.Header>
          <h5 className="mb-0">
            <RiUserSettingsLine className="me-2" />
            Administrator Accounts ({admins.length})
          </h5>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
              <p className="mt-2">Loading admin users...</p>
            </div>
          ) : admins.length === 0 ? (
            <div className="text-center py-4">
              <RiUserLine className="text-muted mb-3" />
              <h5 className="text-muted">No Admin Users Found</h5>
              <p className="text-muted">No administrator accounts are currently configured.</p>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Administrator</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Permission Level</th>
                  <th>Last Modified</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => {
                  const permissionStatus = getPermissionStatus(admin);
                  return (
                    <tr key={admin.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                            <RiUserLine className="text-primary" />
                          </div>
                          <div>
                            <h6 className="mb-0">{admin.full_name}</h6>
                            <small className="text-muted">{admin.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          {admin.phone_number && (
                            <div className="small">{admin.phone_number}</div>
                          )}
                          <div className="small text-muted">
                            Joined: {new Date(admin.date_joined).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge bg={admin.is_active ? 'success' : 'danger'}>
                          {admin.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={permissionStatus.color}>
                          {permissionStatus.text}
                        </Badge>
                      </td>
                      <td>
                        <small className="text-muted">
                          {admin.admin_permissions?.updated_at 
                            ? new Date(admin.admin_permissions.updated_at).toLocaleDateString()
                            : 'Never modified'
                          }
                        </small>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>View/Edit Permissions</Tooltip>}
                          >
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => openPermissionModal(admin)}
                            >
                              <RiEditLine />
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>View Details</Tooltip>}
                          >
                            <Button
                              variant="outline-info"
                              size="sm"
                              onClick={() => {/* Add view details logic */}}
                            >
                              <RiEyeLine />
                            </Button>
                          </OverlayTrigger>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Permission Management Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <RiShieldLine className="me-2" />
            Manage Permissions: {selectedAdmin?.full_name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="info" className="mb-4">
            <RiUserSettingsLine className="me-2" />
            Configure specific permissions and dashboard features for this administrator.
            Unchecked items will be restricted for this admin.
          </Alert>

          <Tabs defaultActiveKey="permissions" className="mb-4">
            <Tab eventKey="permissions" title={
              <span>
                <RiLockLine className="me-2" />
                Core Permissions
              </span>
            }>
              <Row>
                {Object.entries(permissionCategories).map(([categoryKey, category]) => (
                  <Col md={6} lg={4} key={categoryKey} className="mb-4">
                    <Card className="h-100">
                      <Card.Header className="bg-light">
                        <h6 className="mb-0">
                          <category.icon className="me-2" />
                          {category.title}
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        {category.permissions.map((permission) => (
                          <div key={permission.key} className="mb-3">
                            <Form.Check
                              type="switch"
                              id={`permission-${permission.key}`}
                              label={permission.label}
                              checked={permissions[permission.key] !== false}
                              onChange={(e) => handlePermissionChange(permission.key, e.target.checked)}
                            />
                            <small className="text-muted d-block mt-1">
                              {permission.description}
                            </small>
                          </div>
                        ))}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Tab>

            <Tab eventKey="features" title={
              <span>
                <RiSettingsLine className="me-2" />
                Dashboard Features
              </span>
            }>
              <Row>
                {Object.entries(featureCategories).map(([categoryKey, category]) => (
                  <Col md={6} lg={4} key={categoryKey} className="mb-4">
                    <Card className="h-100">
                      <Card.Header className="bg-light">
                        <h6 className="mb-0">
                          <category.icon className="me-2" />
                          {category.title}
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        {category.features.map((feature) => (
                          <div key={feature.key} className="mb-3">
                            <Form.Check
                              type="switch"
                              id={`feature-${feature.key}`}
                              label={feature.label}
                              checked={feature.disabled ? false : (dashboardFeatures[feature.key] !== false)}
                              disabled={feature.disabled}
                              onChange={(e) => handleFeatureChange(feature.key, e.target.checked)}
                            />
                            <small className={`text-muted d-block mt-1 ${feature.disabled ? 'text-danger' : ''}`}>
                              {feature.description}
                            </small>
                          </div>
                        ))}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            <RiCloseLine className="me-1" />
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={updateAdminPermissions}
            disabled={saving}
          >
            {saving ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />
                Saving...
              </>
            ) : (
              <>
                <RiSaveLine className="me-1" />
                Save Permissions
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminPermissionManagement;
