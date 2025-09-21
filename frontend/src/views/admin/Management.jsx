import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
  Form,
  Modal,
  Tabs,
  Tab,
  Alert,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import {
  RiGroupLine,
  RiShieldUserLine,
  RiHospitalLine,
  RiBarChartLine,
  RiSettings3Line,
  RiHistoryLine,
  RiDatabase2Line,
  RiUserAddLine,
  RiEditLine,
  RiDeleteBinLine,
  RiSearchLine,
  RiDownloadLine,
  RiUploadLine,
  RiRefreshLine
} from '@remixicon/react';

const Management = () => {
  // States for different sections
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [alertInfo, setAlertInfo] = useState({ show: false, variant: '', message: '' });

  // Mock data - Replace with actual API calls
  useEffect(() => {
    setUsers([
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', department: 'IT', status: 'Active' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Doctor', department: 'Cardiology', status: 'Active' },
    ]);
    setRoles([
      { id: 1, name: 'Super Admin', permissions: ['all'] },
      { id: 2, name: 'Doctor', permissions: ['view_patients', 'edit_records'] },
      { id: 3, name: 'Nurse', permissions: ['view_patients'] },
    ]);
    setDepartments([
      { id: 1, name: 'Cardiology', head: 'Dr. Smith', staff: 15 },
      { id: 2, name: 'Neurology', head: 'Dr. Johnson', staff: 12 },
      { id: 3, name: 'Pediatrics', head: 'Dr. Williams', staff: 18 },
    ]);
  }, []);

  // Handle modal actions
  const handleModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setShowModal(true);
  };

  // Handle form submissions
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setShowModal(false);
      setAlertInfo({
        show: true,
        variant: 'success',
        message: 'Operation completed successfully!'
      });
      setTimeout(() => setAlertInfo({ show: false, variant: '', message: '' }), 3000);
    }, 1000);
  };

  // Render user management section
  const UserManagement = () => (
    <>
      <div className="d-flex justify-content-between mb-3">
        <Form.Group className="d-flex gap-2" style={{ width: '300px' }}>
          <Form.Control
            type="search"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" onClick={() => handleModal('add_user')}>
          <FaUserPlus className="me-2" /> Add User
        </Button>
      </div>
      <Table responsive striped hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Department</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.department}</td>
              <td><Badge bg={user.status === 'Active' ? 'success' : 'danger'}>{user.status}</Badge></td>
              <td>
                <div className="d-flex gap-2">
                  <Button size="sm" variant="outline-primary" onClick={() => handleModal('edit_user', user)}>
                    <FaEdit />
                  </Button>
                  <Button size="sm" variant="outline-danger" onClick={() => handleModal('delete_user', user)}>
                    <FaTrash />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );

  // Render roles and permissions section
  const RolesPermissions = () => (
    <>
      <div className="d-flex justify-content-between mb-3">
        <h5>Roles & Permissions</h5>
        <Button variant="primary" onClick={() => handleModal('add_role')}>
          Add Role
        </Button>
      </div>
      <Table responsive striped hover>
        <thead>
          <tr>
            <th>Role</th>
            <th>Permissions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map(role => (
            <tr key={role.id}>
              <td>{role.name}</td>
              <td>
                {role.permissions.map(permission => (
                  <Badge key={permission} bg="info" className="me-1">
                    {permission}
                  </Badge>
                ))}
              </td>
              <td>
                <div className="d-flex gap-2">
                  <Button size="sm" variant="outline-primary" onClick={() => handleModal('edit_role', role)}>
                    <FaEdit />
                  </Button>
                  <Button size="sm" variant="outline-danger" onClick={() => handleModal('delete_role', role)}>
                    <FaTrash />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );

  // Render departments section
  const DepartmentManagement = () => (
    <>
      <div className="d-flex justify-content-between mb-3">
        <h5>Department Management</h5>
        <Button variant="primary" onClick={() => handleModal('add_department')}>
          Add Department
        </Button>
      </div>
      <Table responsive striped hover>
        <thead>
          <tr>
            <th>Department</th>
            <th>Head</th>
            <th>Staff Count</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map(dept => (
            <tr key={dept.id}>
              <td>{dept.name}</td>
              <td>{dept.head}</td>
              <td>{dept.staff}</td>
              <td>
                <div className="d-flex gap-2">
                  <Button size="sm" variant="outline-primary" onClick={() => handleModal('edit_department', dept)}>
                    <FaEdit />
                  </Button>
                  <Button size="sm" variant="outline-danger" onClick={() => handleModal('delete_department', dept)}>
                    <FaTrash />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );

  // Analytics Dashboard component
  const AnalyticsDashboard = () => (
    <Row>
      <Col md={3}>
        <Card className="mb-3">
          <Card.Body>
            <h6>Total Users</h6>
            <h3>256</h3>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="mb-3">
          <Card.Body>
            <h6>Active Sessions</h6>
            <h3>42</h3>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="mb-3">
          <Card.Body>
            <h6>Departments</h6>
            <h3>12</h3>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="mb-3">
          <Card.Body>
            <h6>Total Roles</h6>
            <h3>8</h3>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  // System Settings component
  const SystemSettings = () => (
    <Form>
      <Row>
        <Col md={6}>
          <Card className="mb-3">
            <Card.Body>
              <h5 className="mb-3">General Settings</h5>
              <Form.Group className="mb-3">
                <Form.Label>Hospital Name</Form.Label>
                <Form.Control type="text" placeholder="Enter hospital name" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Contact Email</Form.Label>
                <Form.Control type="email" placeholder="Enter contact email" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Time Zone</Form.Label>
                <Form.Select>
                  <option>UTC</option>
                  <option>GMT</option>
                  <option>EST</option>
                </Form.Select>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-3">
            <Card.Body>
              <h5 className="mb-3">Security Settings</h5>
              <Form.Group className="mb-3">
                <Form.Label>Password Policy</Form.Label>
                <Form.Select>
                  <option>Strong</option>
                  <option>Medium</option>
                  <option>Basic</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Check
                  type="switch"
                  id="2fa-switch"
                  label="Enable Two-Factor Authentication"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Check
                  type="switch"
                  id="session-switch"
                  label="Enable Session Timeout"
                />
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Form>
  );

  // Audit Logs component
  const AuditLogs = () => (
    <>
      <div className="d-flex justify-content-between mb-3">
        <Form.Group className="d-flex gap-2" style={{ width: '300px' }}>
          <Form.Control type="search" placeholder="Search logs..." />
        </Form.Group>
        <Button variant="outline-secondary">
          <FaDownload className="me-2" /> Export Logs
        </Button>
      </div>
      <Table responsive striped hover>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>User</th>
            <th>Action</th>
            <th>Details</th>
            <th>IP Address</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2025-07-29 10:15:23</td>
            <td>John Doe</td>
            <td>User Creation</td>
            <td>Created new user account</td>
            <td>192.168.1.1</td>
          </tr>
          <tr>
            <td>2025-07-29 10:10:05</td>
            <td>Jane Smith</td>
            <td>Role Update</td>
            <td>Modified permissions for Doctor role</td>
            <td>192.168.1.2</td>
          </tr>
        </tbody>
      </Table>
    </>
  );

  // Backup & Restore component
  const BackupRestore = () => (
    <Row>
      <Col md={6}>
        <Card className="mb-3">
          <Card.Body>
            <h5 className="mb-3">Backup</h5>
            <div className="d-flex gap-2 mb-3">
              <Button variant="primary">
                <FaDownload className="me-2" /> Create Backup
              </Button>
              <Button variant="outline-primary">
                <FaSync className="me-2" /> Schedule Backup
              </Button>
            </div>
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>Backup Date</th>
                  <th>Size</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2025-07-29 00:00:00</td>
                  <td>2.5 GB</td>
                  <td>
                    <Button size="sm" variant="outline-primary">Download</Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>
      <Col md={6}>
        <Card className="mb-3">
          <Card.Body>
            <h5 className="mb-3">Restore</h5>
            <Form.Group className="mb-3">
              <Form.Label>Upload Backup File</Form.Label>
              <Form.Control type="file" />
            </Form.Group>
            <Button variant="warning">
              <FaUpload className="me-2" /> Restore System
            </Button>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">Admin Management</h2>
      {alertInfo.show && (
        <Alert variant={alertInfo.variant} onClose={() => setAlertInfo({ show: false })} dismissible>
          {alertInfo.message}
        </Alert>
      )}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="users" title={<><FaUsers className="me-2" />Users</>}>
          <UserManagement />
        </Tab>
        <Tab eventKey="roles" title={<><FaUserShield className="me-2" />Roles & Permissions</>}>
          <RolesPermissions />
        </Tab>
        <Tab eventKey="departments" title={<><FaHospital className="me-2" />Departments</>}>
          <DepartmentManagement />
        </Tab>
        <Tab eventKey="analytics" title={<><FaChartBar className="me-2" />Analytics</>}>
          <AnalyticsDashboard />
        </Tab>
        <Tab eventKey="settings" title={<><FaCog className="me-2" />Settings</>}>
          <SystemSettings />
        </Tab>
        <Tab eventKey="audit" title={<><FaHistory className="me-2" />Audit Logs</>}>
          <AuditLogs />
        </Tab>
        <Tab eventKey="backup" title={<><FaDatabase className="me-2" />Backup & Restore</>}>
          <BackupRestore />
        </Tab>
      </Tabs>

      {/* Generic Modal for all operations */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType.includes('add') ? 'Add' : modalType.includes('edit') ? 'Edit' : 'Delete'}{' '}
            {modalType.includes('user') ? 'User' : modalType.includes('role') ? 'Role' : 'Department'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType.includes('delete') ? (
            <p>Are you sure you want to delete this item?</p>
          ) : (
            <Form>
              {/* Render form fields based on modalType */}
              {modalType.includes('user') && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter name" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                  </Form.Group>
                </>
              )}
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant={modalType.includes('delete') ? 'danger' : 'primary'}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Processing...' : modalType.includes('delete') ? 'Delete' : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Management;
