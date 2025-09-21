import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Modal, Form, Alert, Dropdown, Tabs, Tab, InputGroup, Spinner } from 'react-bootstrap';
import { 
  RiTeamLine,
  RiAddLine,
  RiEditLine,
  RiDeleteBinLine,
  RiEyeLine,
  RiUserLine,
  RiStethoscopeLine,
  RiNurseLine,
  RiCapsuleLine,
  RiShieldUserLine,
  RiSearchLine,
  RiFilterLine,
  RiDownloadLine,
  RiUploadLine,
  RiFileExcelLine,
  RiCalendarLine,
  RiBarChartLine,
  RiSettings3Line,
  RiUserHeartLine,
  RiRefreshLine,
  RiGroupLine,
  RiMailLine,
  RiPhoneLine,
  RiMapPinLine,
  RiCheckLine,
  RiCloseLine,
  RiTimeLine,
  RiAwardLine,
  RiBookLine,
  RiSortAsc,
  RiSortDesc
} from '@remixicon/react';
import apiClient from '../../services/api';

const StaffManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add', 'edit', 'view'
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedStaffIds, setSelectedStaffIds] = useState([]);

  // Enhanced staff statistics
  const [staffStats, setStaffStats] = useState({
    totalStaff: 0,
    activeStaff: 0,
    doctorsCount: 0,
    nursesCount: 0,
    pharmacistsCount: 0,
    adminsCount: 0,
    recentJoins: 0,
    onLeave: 0,
    departments: [],
    avgExperience: 0,
    turnoverRate: 0
  });

  // Enhanced mock staff data with more comprehensive fields
  const [staffList, setStaffList] = useState([
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@xerxez.com',
      role: 'doctor',
      department: 'Cardiology',
      phone: '+1 (555) 123-4567',
      joinDate: '2023-01-15',
      status: 'active',
      licenseNumber: 'MD123456',
      specialization: 'Interventional Cardiology',
      experience: 8,
      education: 'MD - Harvard Medical School',
      address: '123 Medical Ave, City, State 12345',
      emergencyContact: 'John Johnson - +1 (555) 111-2222',
      shift: 'morning',
      salary: 180000,
      lastLogin: '2025-01-27',
      performanceRating: 4.8,
      certifications: ['ACLS', 'BLS', 'Board Certified Cardiologist'],
      availability: 'full-time',
      notes: 'Excellent track record in interventional procedures'
    },
    {
      id: 2,
      name: 'Nurse Emily Davis',
      email: 'emily.davis@xerxez.com',
      role: 'nurse',
      department: 'Emergency',
      phone: '+1 (555) 234-5678',
      joinDate: '2023-03-20',
      status: 'active',
      certification: 'RN, BLS, ACLS',
      experience: 5,
      education: 'BSN - University of Nursing',
      address: '456 Care Street, City, State 12345',
      emergencyContact: 'Mike Davis - +1 (555) 222-3333',
      shift: 'night',
      salary: 75000,
      lastLogin: '2025-01-27',
      performanceRating: 4.6,
      certifications: ['RN', 'BLS', 'ACLS', 'PALS'],
      availability: 'full-time',
      notes: 'Highly skilled in emergency care procedures'
    },
    {
      id: 3,
      name: 'Dr. Michael Chen',
      email: 'michael.chen@xerxez.com',
      role: 'doctor',
      department: 'Neurology',
      phone: '+1 (555) 345-6789',
      joinDate: '2022-11-10',
      status: 'active',
      licenseNumber: 'MD789012',
      specialization: 'Neurological Surgery',
      experience: 12,
      education: 'MD - Johns Hopkins University',
      address: '789 Brain Ave, City, State 12345',
      emergencyContact: 'Lisa Chen - +1 (555) 333-4444',
      shift: 'morning',
      salary: 220000,
      lastLogin: '2025-01-26',
      performanceRating: 4.9,
      certifications: ['Board Certified Neurosurgeon', 'ACLS', 'BLS'],
      availability: 'full-time',
      notes: 'Leading neurosurgeon with excellent patient outcomes'
    },
    {
      id: 4,
      name: 'Alex Rodriguez',
      email: 'alex.rodriguez@xerxez.com',
      role: 'pharmacist',
      department: 'Pharmacy',
      phone: '+1 (555) 456-7890',
      joinDate: '2023-05-01',
      status: 'active',
      licenseNumber: 'PharmD345678',
      experience: 6,
      education: 'PharmD - School of Pharmacy',
      address: '321 Pill Street, City, State 12345',
      emergencyContact: 'Maria Rodriguez - +1 (555) 444-5555',
      shift: 'afternoon',
      salary: 110000,
      lastLogin: '2025-01-27',
      performanceRating: 4.7,
      certifications: ['Licensed Pharmacist', 'Immunization Certified'],
      availability: 'full-time',
      notes: 'Expert in clinical pharmacy and drug interactions'
    },
    {
      id: 5,
      name: 'Admin John Smith',
      email: 'john.smith@xerxez.com',
      role: 'admin',
      department: 'Administration',
      phone: '+1 (555) 567-8901',
      joinDate: '2022-08-15',
      status: 'active',
      experience: 10,
      education: 'MBA - Business Administration',
      address: '654 Admin Blvd, City, State 12345',
      emergencyContact: 'Jane Smith - +1 (555) 555-6666',
      shift: 'morning',
      salary: 95000,
      lastLogin: '2025-01-27',
      performanceRating: 4.5,
      certifications: ['PMP', 'Six Sigma Black Belt'],
      availability: 'full-time',
      notes: 'Excellent organizational and leadership skills'
    },
    {
      id: 6,
      name: 'Dr. Priya Patel',
      email: 'priya.patel@xerxez.com',
      role: 'doctor',
      department: 'Pediatrics',
      phone: '+1 (555) 678-9012',
      joinDate: '2023-07-01',
      status: 'active',
      licenseNumber: 'MD456789',
      specialization: 'Pediatric Cardiology',
      experience: 7,
      education: 'MD - Children\'s Medical College',
      address: '987 Kids Ave, City, State 12345',
      emergencyContact: 'Raj Patel - +1 (555) 666-7777',
      shift: 'afternoon',
      salary: 165000,
      lastLogin: '2025-01-26',
      performanceRating: 4.8,
      certifications: ['Board Certified Pediatrician', 'PALS', 'NRP'],
      availability: 'full-time',
      notes: 'Specialized in congenital heart defects'
    },
    {
      id: 7,
      name: 'Nurse Robert Wilson',
      email: 'robert.wilson@xerxez.com',
      role: 'nurse',
      department: 'ICU',
      phone: '+1 (555) 789-0123',
      joinDate: '2022-12-01',
      status: 'on-leave',
      certification: 'RN, CCRN, BLS',
      experience: 9,
      education: 'BSN - Critical Care University',
      address: '147 ICU Lane, City, State 12345',
      emergencyContact: 'Sarah Wilson - +1 (555) 777-8888',
      shift: 'night',
      salary: 82000,
      lastLogin: '2025-01-20',
      performanceRating: 4.7,
      certifications: ['RN', 'CCRN', 'BLS', 'ACLS'],
      availability: 'full-time',
      notes: 'Currently on medical leave, expected return in 2 weeks'
    }
  ]);

  // Calculate staff statistics
  useEffect(() => {
    const calculateStats = () => {
      const activeStaff = staffList.filter(staff => staff.status === 'active');
      const departments = [...new Set(staffList.map(staff => staff.department))];
      const recentJoins = staffList.filter(staff => {
        const joinDate = new Date(staff.joinDate);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return joinDate >= thirtyDaysAgo;
      }).length;

      setStaffStats({
        totalStaff: staffList.length,
        activeStaff: activeStaff.length,
        doctorsCount: staffList.filter(staff => staff.role === 'doctor').length,
        nursesCount: staffList.filter(staff => staff.role === 'nurse').length,
        pharmacistsCount: staffList.filter(staff => staff.role === 'pharmacist').length,
        adminsCount: staffList.filter(staff => staff.role === 'admin').length,
        recentJoins,
        onLeave: staffList.filter(staff => staff.status === 'on-leave').length,
        departments,
        avgExperience: staffList.reduce((sum, staff) => sum + (staff.experience || 0), 0) / staffList.length,
        turnoverRate: 2.3 // Mock data
      });
    };

    calculateStats();
  }, [staffList]);

  const getRoleIcon = (role) => {
    switch (role) {
      case 'doctor': return <RiStethoscopeLine size={16} className="text-primary" />;
      case 'nurse': return <RiUserHeartLine size={16} className="text-success" />;
      case 'pharmacist': return <RiCapsuleLine size={16} className="text-warning" />;
      case 'admin': return <RiShieldUserLine size={16} className="text-danger" />;
      default: return <RiUserLine size={16} className="text-secondary" />;
    }
  };

  const getRoleBadge = (role) => {
    const variants = {
      doctor: 'primary',
      nurse: 'success',
      pharmacist: 'warning',
      admin: 'danger'
    };
    return <Badge bg={variants[role] || 'secondary'}>{role.charAt(0).toUpperCase() + role.slice(1)}</Badge>;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'success', icon: <RiCheckLine size={14} className="me-1" />, text: 'Active' },
      inactive: { bg: 'danger', icon: <RiCloseLine size={14} className="me-1" />, text: 'Inactive' },
      'on-leave': { bg: 'warning', icon: <RiTimeLine size={14} className="me-1" />, text: 'On Leave' },
      suspended: { bg: 'secondary', icon: <RiCloseLine size={14} className="me-1" />, text: 'Suspended' }
    };
    
    const config = statusConfig[status] || statusConfig.inactive;
    return (
      <Badge bg={config.bg}>
        {config.icon}
        {config.text}
      </Badge>
    );
  };

  // Enhanced filtering and sorting
  const filteredAndSortedStaff = staffList
    .filter(staff => {
      const matchesSearch = 
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (staff.specialization && staff.specialization.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesRole = filterRole === 'all' || staff.role === filterRole;
      const matchesDepartment = filterDepartment === 'all' || staff.department === filterDepartment;
      const matchesStatus = filterStatus === 'all' || staff.status === filterStatus;
      
      return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'joinDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleAddStaff = () => {
    setModalType('add');
    setSelectedStaff(null);
    setShowModal(true);
  };

  const handleEditStaff = (staff) => {
    setModalType('edit');
    setSelectedStaff(staff);
    setShowModal(true);
  };

  const handleViewStaff = (staff) => {
    setModalType('view');
    setSelectedStaff(staff);
    setShowModal(true);
  };

  const handleDeleteStaff = (staffId) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      setStaffList(prev => prev.filter(staff => staff.id !== staffId));
      showAlertMessage('Staff member deleted successfully!', 'success');
    }
  };

  const handleSaveStaff = (formData) => {
    if (modalType === 'add') {
      const newStaff = {
        ...formData,
        id: Math.max(...staffList.map(s => s.id)) + 1,
        joinDate: new Date().toISOString().split('T')[0],
        status: 'active',
        lastLogin: new Date().toISOString().split('T')[0],
        performanceRating: 4.0
      };
      setStaffList(prev => [...prev, newStaff]);
      showAlertMessage('New staff member added successfully!', 'success');
    } else {
      setStaffList(prev => prev.map(staff => 
        staff.id === selectedStaff.id ? { ...staff, ...formData } : staff
      ));
      showAlertMessage('Staff member updated successfully!', 'success');
    }
    setShowModal(false);
  };

  const showAlertMessage = (message, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const SortHeader = ({ field, children }) => (
    <th 
      onClick={() => handleSort(field)} 
      style={{ cursor: 'pointer', userSelect: 'none' }}
      className="align-middle"
    >
      <div className="d-flex align-items-center justify-content-between">
        {children}
        {sortBy === field && (
          sortOrder === 'asc' ? <RiSortAsc size={14} /> : <RiSortDesc size={14} />
        )}
      </div>
    </th>
  );

  // Statistics Cards Component
  const StatisticsCards = () => (
    <Row className="mb-4">
      <Col md={3}>
        <Card className="border-0 shadow-sm h-100">
          <Card.Body className="text-center">
            <div className="mb-3">
              <RiTeamLine size={32} className="text-primary" />
            </div>
            <h3 className="mb-1">{staffStats.totalStaff}</h3>
            <p className="text-muted mb-0">Total Staff</p>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="border-0 shadow-sm h-100">
          <Card.Body className="text-center">
            <div className="mb-3">
              <RiCheckLine size={32} className="text-success" />
            </div>
            <h3 className="mb-1">{staffStats.activeStaff}</h3>
            <p className="text-muted mb-0">Active Staff</p>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="border-0 shadow-sm h-100">
          <Card.Body className="text-center">
            <div className="mb-3">
              <RiStethoscopeLine size={32} className="text-primary" />
            </div>
            <h3 className="mb-1">{staffStats.doctorsCount}</h3>
            <p className="text-muted mb-0">Doctors</p>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="border-0 shadow-sm h-100">
          <Card.Body className="text-center">
            <div className="mb-3">
              <RiUserHeartLine size={32} className="text-success" />
            </div>
            <h3 className="mb-1">{staffStats.nursesCount}</h3>
            <p className="text-muted mb-0">Nurses</p>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  // Advanced Filters Component
  const AdvancedFilters = () => (
    <Card className="mb-4">
      <Card.Body>
        <Row className="align-items-end">
          <Col md={3}>
            <Form.Group>
              <Form.Label>Search Staff</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <RiSearchLine size={16} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by name, email, department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label>Filter by Role</Form.Label>
              <Form.Select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                <option value="all">All Roles</option>
                <option value="doctor">Doctors</option>
                <option value="nurse">Nurses</option>
                <option value="pharmacist">Pharmacists</option>
                <option value="admin">Administrators</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label>Department</Form.Label>
              <Form.Select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
                <option value="all">All Departments</option>
                {staffStats.departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="on-leave">On Leave</option>
                <option value="inactive">Inactive</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <div className="d-flex gap-2">
              <Button variant="outline-primary" className="flex-fill">
                <RiDownloadLine size={16} className="me-1" />
                Export
              </Button>
              <Button variant="outline-success" className="flex-fill">
                <RiUploadLine size={16} className="me-1" />
                Import
              </Button>
            </div>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col className="text-end">
            <small className="text-muted">
              Showing {filteredAndSortedStaff.length} of {staffList.length} staff members
            </small>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  // Staff Table Component
  const StaffTable = () => (
    <Card>
      <Card.Body className="p-0">
        <Table responsive striped className="mb-0">
          <thead className="bg-light">
            <tr>
              <SortHeader field="name">Staff Member</SortHeader>
              <SortHeader field="role">Role</SortHeader>
              <SortHeader field="department">Department</SortHeader>
              <th>Contact</th>
              <SortHeader field="joinDate">Join Date</SortHeader>
              <SortHeader field="status">Status</SortHeader>
              <SortHeader field="performanceRating">Performance</SortHeader>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedStaff.map(staff => (
              <tr key={staff.id}>
                <td>
                  <div className="d-flex align-items-center">
                    {getRoleIcon(staff.role)}
                    <div className="ms-2">
                      <div className="fw-bold">{staff.name}</div>
                      <small className="text-muted">{staff.email}</small>
                      {staff.specialization && (
                        <div>
                          <small className="text-primary">{staff.specialization}</small>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td>{getRoleBadge(staff.role)}</td>
                <td>
                  <div>{staff.department}</div>
                  {staff.shift && (
                    <small className="text-muted">{staff.shift} shift</small>
                  )}
                </td>
                <td>
                  <div>
                    <RiPhoneLine size={14} className="me-1 text-muted" />
                    {staff.phone}
                  </div>
                  <div>
                    <RiMailLine size={14} className="me-1 text-muted" />
                    <small className="text-muted">{staff.email}</small>
                  </div>
                </td>
                <td>
                  <div>{new Date(staff.joinDate).toLocaleDateString()}</div>
                  {staff.experience && (
                    <small className="text-muted">{staff.experience} years exp.</small>
                  )}
                </td>
                <td>{getStatusBadge(staff.status)}</td>
                <td>
                  {staff.performanceRating && (
                    <div className="d-flex align-items-center">
                      <RiAwardLine size={14} className="me-1 text-warning" />
                      <span className="fw-bold">{staff.performanceRating}</span>
                      <small className="text-muted">/5.0</small>
                    </div>
                  )}
                </td>
                <td className="text-center">
                  <Dropdown>
                    <Dropdown.Toggle variant="outline-secondary" size="sm">
                      Actions
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleViewStaff(staff)}>
                        <RiEyeLine size={14} className="me-2" />
                        View Details
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleEditStaff(staff)}>
                        <RiEditLine size={14} className="me-2" />
                        Edit
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item 
                        onClick={() => handleDeleteStaff(staff.id)}
                        className="text-danger"
                      >
                        <RiDeleteBinLine size={14} className="me-2" />
                        Delete
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );

  // Enhanced Modal Component
  const StaffModal = () => {
    const [formData, setFormData] = useState(
      selectedStaff || {
        name: '',
        email: '',
        role: 'doctor',
        department: '',
        phone: '',
        licenseNumber: '',
        certification: '',
        specialization: '',
        experience: 0,
        education: '',
        address: '',
        emergencyContact: '',
        shift: 'morning',
        salary: 0,
        certifications: [],
        availability: 'full-time',
        notes: ''
      }
    );

    const handleSubmit = (e) => {
      e.preventDefault();
      handleSaveStaff(formData);
    };

    const updateFormData = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === 'add' && (
              <>
                <RiAddLine size={20} className="me-2" />
                Add New Staff Member
              </>
            )}
            {modalType === 'edit' && (
              <>
                <RiEditLine size={20} className="me-2" />
                Edit Staff Member
              </>
            )}
            {modalType === 'view' && (
              <>
                <RiEyeLine size={20} className="me-2" />
                Staff Member Details
              </>
            )}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {modalType === 'view' ? (
              // View Mode - Display only
              <Tabs defaultActiveKey="personal" className="mb-3">
                <Tab eventKey="personal" title="Personal Info">
                  <Row>
                    <Col md={6}>
                      <h6 className="text-primary mb-3">Basic Information</h6>
                      <div className="mb-3">
                        <strong>Name:</strong> {formData.name}
                      </div>
                      <div className="mb-3">
                        <strong>Email:</strong> {formData.email}
                      </div>
                      <div className="mb-3">
                        <strong>Role:</strong> {getRoleBadge(formData.role)}
                      </div>
                      <div className="mb-3">
                        <strong>Department:</strong> {formData.department}
                      </div>
                      <div className="mb-3">
                        <strong>Phone:</strong> {formData.phone}
                      </div>
                      <div className="mb-3">
                        <strong>Status:</strong> {getStatusBadge(formData.status)}
                      </div>
                    </Col>
                    <Col md={6}>
                      <h6 className="text-primary mb-3">Professional Details</h6>
                      {formData.licenseNumber && (
                        <div className="mb-3">
                          <strong>License Number:</strong> {formData.licenseNumber}
                        </div>
                      )}
                      {formData.specialization && (
                        <div className="mb-3">
                          <strong>Specialization:</strong> {formData.specialization}
                        </div>
                      )}
                      <div className="mb-3">
                        <strong>Experience:</strong> {formData.experience} years
                      </div>
                      <div className="mb-3">
                        <strong>Education:</strong> {formData.education}
                      </div>
                      <div className="mb-3">
                        <strong>Join Date:</strong> {new Date(formData.joinDate).toLocaleDateString()}
                      </div>
                      {formData.performanceRating && (
                        <div className="mb-3">
                          <strong>Performance Rating:</strong> {formData.performanceRating}/5.0
                        </div>
                      )}
                    </Col>
                  </Row>
                </Tab>
                <Tab eventKey="contact" title="Contact & Emergency">
                  <Row>
                    <Col md={6}>
                      <h6 className="text-primary mb-3">Contact Information</h6>
                      <div className="mb-3">
                        <strong>Address:</strong> {formData.address || 'N/A'}
                      </div>
                      <div className="mb-3">
                        <strong>Emergency Contact:</strong> {formData.emergencyContact || 'N/A'}
                      </div>
                    </Col>
                    <Col md={6}>
                      <h6 className="text-primary mb-3">Work Details</h6>
                      <div className="mb-3">
                        <strong>Shift:</strong> {formData.shift}
                      </div>
                      <div className="mb-3">
                        <strong>Availability:</strong> {formData.availability}
                      </div>
                      {formData.salary && (
                        <div className="mb-3">
                          <strong>Salary:</strong> ${formData.salary.toLocaleString()}
                        </div>
                      )}
                    </Col>
                  </Row>
                </Tab>
                <Tab eventKey="certifications" title="Certifications">
                  <h6 className="text-primary mb-3">Professional Certifications</h6>
                  {formData.certifications && formData.certifications.length > 0 ? (
                    <div className="d-flex flex-wrap gap-2">
                      {formData.certifications.map((cert, index) => (
                        <Badge key={index} bg="info" className="p-2">
                          <RiAwardLine size={14} className="me-1" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted">No certifications listed</p>
                  )}
                  
                  {formData.notes && (
                    <div className="mt-4">
                      <h6 className="text-primary mb-3">Additional Notes</h6>
                      <p className="text-muted">{formData.notes}</p>
                    </div>
                  )}
                </Tab>
              </Tabs>
            ) : (
              // Edit/Add Mode - Form inputs
              <Tabs defaultActiveKey="basic" className="mb-3">
                <Tab eventKey="basic" title="Basic Information">
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.name}
                          onChange={(e) => updateFormData('name', e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateFormData('email', e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Role</Form.Label>
                        <Form.Select
                          value={formData.role}
                          onChange={(e) => updateFormData('role', e.target.value)}
                          required
                        >
                          <option value="doctor">Doctor</option>
                          <option value="nurse">Nurse</option>
                          <option value="pharmacist">Pharmacist</option>
                          <option value="admin">Administrator</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Department</Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.department}
                          onChange={(e) => updateFormData('department', e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => updateFormData('phone', e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      {(formData.role === 'doctor' || formData.role === 'pharmacist') && (
                        <Form.Group className="mb-3">
                          <Form.Label>License Number</Form.Label>
                          <Form.Control
                            type="text"
                            value={formData.licenseNumber}
                            onChange={(e) => updateFormData('licenseNumber', e.target.value)}
                          />
                        </Form.Group>
                      )}
                      {formData.role === 'nurse' && (
                        <Form.Group className="mb-3">
                          <Form.Label>Certification</Form.Label>
                          <Form.Control
                            type="text"
                            value={formData.certification}
                            onChange={(e) => updateFormData('certification', e.target.value)}
                          />
                        </Form.Group>
                      )}
                    </Col>
                  </Row>
                </Tab>
                <Tab eventKey="professional" title="Professional Details">
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Years of Experience</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          value={formData.experience}
                          onChange={(e) => updateFormData('experience', parseInt(e.target.value) || 0)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Education</Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.education}
                          onChange={(e) => updateFormData('education', e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  {formData.role === 'doctor' && (
                    <Form.Group className="mb-3">
                      <Form.Label>Specialization</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.specialization}
                        onChange={(e) => updateFormData('specialization', e.target.value)}
                      />
                    </Form.Group>
                  )}
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Shift</Form.Label>
                        <Form.Select
                          value={formData.shift}
                          onChange={(e) => updateFormData('shift', e.target.value)}
                        >
                          <option value="morning">Morning</option>
                          <option value="afternoon">Afternoon</option>
                          <option value="night">Night</option>
                          <option value="rotating">Rotating</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Availability</Form.Label>
                        <Form.Select
                          value={formData.availability}
                          onChange={(e) => updateFormData('availability', e.target.value)}
                        >
                          <option value="full-time">Full-time</option>
                          <option value="part-time">Part-time</option>
                          <option value="contract">Contract</option>
                          <option value="on-call">On-call</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </Tab>
                <Tab eventKey="contact" title="Contact & Other">
                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={formData.address}
                      onChange={(e) => updateFormData('address', e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Emergency Contact</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.emergencyContact}
                      onChange={(e) => updateFormData('emergencyContact', e.target.value)}
                      placeholder="Name - Phone Number"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Additional Notes</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => updateFormData('notes', e.target.value)}
                    />
                  </Form.Group>
                </Tab>
              </Tabs>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              {modalType === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {modalType !== 'view' && (
              <Button variant="primary" type="submit">
                {modalType === 'add' ? 'Add Staff Member' : 'Update Staff Member'}
              </Button>
            )}
          </Modal.Footer>
        </Form>
      </Modal>
    );
  };

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-0">
                <RiTeamLine size={32} className="me-2" />
                Comprehensive Staff Management
              </h2>
              <p className="text-muted mb-0">Organize and manage all healthcare staff and users</p>
            </div>
            <div className="d-flex gap-2">
              <Button variant="outline-primary" onClick={() => window.location.reload()}>
                <RiRefreshLine size={16} className="me-1" />
                Refresh
              </Button>
              <Button variant="primary" onClick={handleAddStaff}>
                <RiAddLine size={16} className="me-1" />
                Add Staff Member
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Alert */}
      {showAlert && (
        <Alert variant={alertType} className="mb-4" dismissible onClose={() => setShowAlert(false)}>
          {alertMessage}
        </Alert>
      )}

      {/* Navigation Tabs */}
      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
        <Tab eventKey="overview" title={
          <span className="d-flex align-items-center gap-2">
            <RiBarChartLine size={16} />
            Overview
          </span>
        }>
          <StatisticsCards />
          <AdvancedFilters />
          <StaffTable />
        </Tab>
        
        <Tab eventKey="departments" title={
          <span className="d-flex align-items-center gap-2">
            <RiGroupLine size={16} />
            Departments
          </span>
        }>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Department Overview</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                {staffStats.departments.map(dept => {
                  const deptStaff = staffList.filter(staff => staff.department === dept);
                  return (
                    <Col md={4} key={dept} className="mb-3">
                      <Card className="border">
                        <Card.Body>
                          <h6 className="text-primary">{dept}</h6>
                          <div className="d-flex justify-content-between">
                            <span>Total Staff:</span>
                            <Badge bg="primary">{deptStaff.length}</Badge>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>Active:</span>
                            <Badge bg="success">
                              {deptStaff.filter(s => s.status === 'active').length}
                            </Badge>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="analytics" title={
          <span className="d-flex align-items-center gap-2">
            <RiBarChartLine size={16} />
            Analytics
          </span>
        }>
          <Row>
            <Col md={6}>
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Staff Distribution by Role</h5>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Doctors</span>
                      <Badge bg="primary">{staffStats.doctorsCount}</Badge>
                    </div>
                    <div className="progress mb-3">
                      <div 
                        className="progress-bar bg-primary" 
                        style={{width: `${(staffStats.doctorsCount / staffStats.totalStaff) * 100}%`}}
                      ></div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Nurses</span>
                      <Badge bg="success">{staffStats.nursesCount}</Badge>
                    </div>
                    <div className="progress mb-3">
                      <div 
                        className="progress-bar bg-success" 
                        style={{width: `${(staffStats.nursesCount / staffStats.totalStaff) * 100}%`}}
                      ></div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Pharmacists</span>
                      <Badge bg="warning">{staffStats.pharmacistsCount}</Badge>
                    </div>
                    <div className="progress mb-3">
                      <div 
                        className="progress-bar bg-warning" 
                        style={{width: `${(staffStats.pharmacistsCount / staffStats.totalStaff) * 100}%`}}
                      ></div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Performance Metrics</h5>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Average Experience</span>
                      <Badge bg="info">{staffStats.avgExperience.toFixed(1)} years</Badge>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Staff on Leave</span>
                      <Badge bg="warning">{staffStats.onLeave}</Badge>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Recent Joins (30 days)</span>
                      <Badge bg="success">{staffStats.recentJoins}</Badge>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Turnover Rate</span>
                      <Badge bg="secondary">{staffStats.turnoverRate}%</Badge>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
      </Tabs>

      <StaffModal />
    </Container>
  );
};

export default StaffManagement;
