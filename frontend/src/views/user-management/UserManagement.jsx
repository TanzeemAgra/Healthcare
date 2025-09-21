import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
  Alert,
  Spinner,
  Modal,
  Form,
  Tabs,
  Tab,
  InputGroup,
  Dropdown,
  OverlayTrigger,
  Tooltip,
  ProgressBar,
  ButtonGroup
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { 
  RiUserLine,
  RiUserAddLine,
  RiEditLine,
  RiDeleteBinLine,
  RiSearchLine,
  RiFilterLine,
  RiDownloadLine,
  RiUploadLine,
  RiRefreshLine,
  RiEyeLine,
  RiSettingsLine,
  RiTeamLine,
  RiShieldCheckLine,
  RiMailLine,
  RiPhoneLine,
  RiCalendarLine,
  RiLockLine,
  RiKeyLine,
  RiCloseLine,
  RiAppsLine,
  RiCheckboxLine,
  RiCheckboxBlankLine,
  RiCheckFill,
  RiCloseFill,
  RiArrowUpLine,
  RiArrowDownLine,
  RiMoreLine,
  RiFileTextLine,
  RiImageLine,
  RiMapPinLine,
  RiContactsLine,
  RiGraduationCapLine,
  RiHospitalLine,
  RiGlobalLine,
  RiShieldLine,
  RiBriefcaseLine,
  RiIdCardLine,
  RiGroupLine,
  RiAwardLine,
  RiHeartLine,
  RiDatabaseLine,
  RiStarLine
} from '@remixicon/react';
import apiClient from '../../services/api';

// Custom styles for enhanced UI
const customStyles = `
  .bg-gradient-primary {
    background: linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%);
  }
  .bg-gradient-light {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  }
  .table-hover tbody tr:hover {
    background-color: rgba(13, 110, 253, 0.05);
    transform: translateY(-1px);
    transition: all 0.2s ease;
  }
  .card {
    transition: all 0.3s ease;
  }
  .card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.1) !important;
  }
  .user-avatar {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 18px;
  }
  .role-badge {
    font-size: 0.75rem;
    padding: 0.375rem 0.75rem;
    border-radius: 20px;
  }
  .modern-modal .modal-dialog {
    transition: transform 0.4s ease-out;
  }
  .modern-modal .modal-content {
    border: none;
    border-radius: 1rem;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  }
  .modern-modal .modal-header {
    border-radius: 1rem 1rem 0 0;
    padding: 1.5rem 2rem;
  }
  .modern-modal .modal-body {
    padding: 2rem;
    max-height: 70vh;
    overflow-y: auto;
  }
  .modern-modal .modal-footer {
    border-radius: 0 0 1rem 1rem;
    padding: 1.5rem 2rem;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  }
  .form-control:focus {
    box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
    border-color: rgba(13, 110, 253, 0.5);
  }
  .form-select:focus {
    box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
    border-color: rgba(13, 110, 253, 0.5);
  }
  .border-start.border-4 {
    padding-left: 1.5rem !important;
    margin-left: 0.5rem;
  }
  .section-header {
    background: linear-gradient(135deg, rgba(13, 110, 253, 0.05) 0%, rgba(13, 110, 253, 0.1) 100%);
    border-radius: 0.75rem;
    padding: 1rem;
    margin-bottom: 1rem;
  }
  .action-buttons .btn,
  .gap-1 .btn {
    border: 1.5px solid currentColor !important;
    border-radius: 0.375rem;
    margin: 0 2px;
    transition: all 0.2s ease-in-out;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 34px;
    min-height: 34px;
  }
  .action-buttons .btn:hover,
  .gap-1 .btn:hover {
    transform: scale(1.05);
    box-shadow: 0 3px 12px rgba(0,0,0,0.2);
  }
  .action-buttons .btn:focus,
  .gap-1 .btn:focus {
    box-shadow: none !important;
  }
  .action-buttons .btn-outline-info:hover,
  .gap-1 .btn-outline-info:hover {
    background-color: #0dcaf0 !important;
    border-color: #0dcaf0 !important;
    color: white !important;
  }
  .action-buttons .btn-outline-primary:hover,
  .gap-1 .btn-outline-primary:hover {
    background-color: #0d6efd !important;
    border-color: #0d6efd !important;
    color: white !important;
  }
  .action-buttons .btn-outline-warning:hover,
  .gap-1 .btn-outline-warning:hover {
    background-color: #ffc107 !important;
    border-color: #ffc107 !important;
    color: #000 !important;
  }
  .action-buttons .btn-outline-success:hover,
  .gap-1 .btn-outline-success:hover {
    background-color: #198754 !important;
    border-color: #198754 !important;
    color: white !important;
  }
  .action-buttons .btn-outline-danger:hover,
  .gap-1 .btn-outline-danger:hover {
    background-color: #dc3545 !important;
    border-color: #dc3545 !important;
    color: white !important;
  }
`;

const UserManagement = () => {
  const { user: currentUser, accessToken } = useSelector(state => state.auth);

  // Inject custom styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = customStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // State management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [alert, setAlert] = useState({ show: false, variant: '', message: '' });
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [activeTab, setActiveTab] = useState('users');

  // Form state
  const [formData, setFormData] = useState({
    // Basic Information
    email: '',
    full_name: '',
    role: '',
    phone_number: '',
    
    // Personal Information
    date_of_birth: '',
    gender: '',
    address_street: '',
    address_city: '',
    address_state: '',
    address_zip: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    profile_picture: null,
    
    // Professional Details
    license_number: '',
    certification: '',
    specialization: '',
    department: '',
    position: '',
    years_experience: '',
    employment_start_date: '',
    employee_id: '',
    work_schedule: '',
    supervisor: '',
    
    // Medical/Healthcare Specific
    medical_degree: '',
    institution: '',
    board_certifications: '',
    languages_spoken: '',
    insurance_provider: '',
    npi_number: '',
    
    // Account Settings
    is_active: true,
    password_expires: false,
    password_expiry_date: '',
    two_factor_enabled: false,
    account_expiry_date: '',
    login_restrictions: '',
    
    // System Permissions
    access_level: 'basic',
    allowed_modules: [],
    data_access_restrictions: '',
    approval_workflow: false,
    
    // Security
    password: '',
    confirm_password: '',
    selected_features: []
  });

  // Feature management state
  const [availableFeatures, setAvailableFeatures] = useState([]);
  const [loadingFeatures, setLoadingFeatures] = useState(false);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    roles: {},
    recentRegistrations: 0
  });

  // Load data on component mount
  useEffect(() => {
    loadUsers();
    loadFeatures();
  }, []);

  // Calculate statistics when users change
  useEffect(() => {
    calculateStats();
  }, [users]);

  // Calculate statistics
  const calculateStats = () => {
    const total = users.length;
    const active = users.filter(u => u.is_active).length;
    const inactive = total - active;
    const roles = {};
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentRegistrations = users.filter(u => 
      new Date(u.date_joined) > thirtyDaysAgo
    ).length;

    users.forEach(user => {
      const role = user.role || 'unassigned';
      roles[role] = (roles[role] || 0) + 1;
    });

    setStats({
      total,
      active,
      inactive,
      roles,
      recentRegistrations
    });
  };

  // Load users from API
  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/hospital/management/users/');
      const usersData = response.data.results || response.data;
      setUsers(usersData);
      setAlert({ show: false });
    } catch (err) {
      console.error('Error loading users:', err);
      // Fallback to mock data
      setUsers(mockUsers);
      setAlert({ 
        show: true, 
        variant: 'warning', 
        message: 'Using demo data - API connection failed. Please check your authentication.' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Load available features from API
  const loadFeatures = async () => {
    setLoadingFeatures(true);
    try {
      const response = await apiClient.get('/hospital/management/features/');
      setAvailableFeatures(response.data.features || []);
    } catch (err) {
      console.error('Error loading features:', err);
      // Fallback to default features
      setAvailableFeatures([
        { code: 'medicine', name: 'General Medicine', description: 'General medicine, prescriptions, and patient care' },
        { code: 'dentistry', name: 'Dentistry', description: 'Dental care, treatments, and oral health management' },
        { code: 'dermatology', name: 'Dermatology', description: 'Skin conditions, treatments, and dermatological care' },
        { code: 'pathology', name: 'Pathology', description: 'Laboratory tests, diagnostics, and pathological analysis' },
        { code: 'radiology', name: 'Radiology', description: 'Medical imaging, X-rays, and radiological services' },
        { code: 'patients', name: 'Patient Management', description: 'Patient registration, records, and management' },
        { code: 'appointments', name: 'Appointment Scheduling', description: 'Appointment scheduling and management' },
        { code: 'billing', name: 'Billing & Payments', description: 'Billing, payments, and financial management' },
        { code: 'reports', name: 'Reports & Analytics', description: 'Analytics, reports, and data insights' },
        { code: 'pharmacy', name: 'Pharmacy Management', description: 'Pharmacy management and medication tracking' },
      ]);
    } finally {
      setLoadingFeatures(false);
    }
  };

  // Load user's features for editing
  const loadUserFeatures = async (userId) => {
    try {
  const response = await apiClient.get(`/hospital/management/users/${userId}/features/`);
      const userFeatures = response.data.user_features || [];
      setFormData(prev => ({ ...prev, selected_features: userFeatures }));
    } catch (err) {
      console.error('Error loading user features:', err);
    }
  };

  // Mock data for testing
  const mockUsers = [
    {
      id: 1,
      email: 'john.doctor@hospital.com',
      full_name: 'Dr. John Smith',
      role: 'doctor',
      phone_number: '+1-555-0101',
      license_number: 'MD-12345',
      specialization: 'Cardiology',
      is_active: true,
      date_joined: '2024-01-15T10:30:00Z',
      last_login: '2024-08-08T09:15:00Z'
    },
    {
      id: 2,
      email: 'jane.nurse@hospital.com',
      full_name: 'Jane Johnson',
      role: 'nurse',
      phone_number: '+1-555-0102',
      certification: 'RN-98765',
      is_active: true,
      date_joined: '2024-02-20T14:45:00Z',
      last_login: '2024-08-07T16:30:00Z'
    },
    {
      id: 3,
      email: 'patient.demo@email.com',
      full_name: 'Alice Williams',
      role: 'patient',
      phone_number: '+1-555-0103',
      is_active: true,
      date_joined: '2024-07-15T11:20:00Z',
      last_login: '2024-08-08T08:45:00Z'
    },
    {
      id: 4,
      email: 'admin@hospital.com',
      full_name: 'Sarah Administrator',
      role: 'admin',
      phone_number: '+1-555-0104',
      is_active: true,
      date_joined: '2023-12-01T09:00:00Z',
      last_login: '2024-08-08T10:00:00Z'
    }
  ];

  // Enhanced filtering function
  const filteredUsers = users.filter(user => {
    const searchMatch = !searchTerm || 
      (user.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.license_number || '').toLowerCase().includes(searchTerm.toLowerCase());

    const roleMatch = !selectedRole || user.role === selectedRole;
    const statusMatch = !selectedStatus || 
      (selectedStatus === 'active' && user.is_active) ||
      (selectedStatus === 'inactive' && !user.is_active);

    return searchMatch && roleMatch && statusMatch;
  }).sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'full_name':
        aValue = (a.full_name || '').toLowerCase();
        bValue = (b.full_name || '').toLowerCase();
        break;
      case 'email':
        aValue = (a.email || '').toLowerCase();
        bValue = (b.email || '').toLowerCase();
        break;
      case 'role':
        aValue = (a.role || '').toLowerCase();
        bValue = (b.role || '').toLowerCase();
        break;
      case 'date_joined':
        aValue = new Date(a.date_joined || 0);
        bValue = new Date(b.date_joined || 0);
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Get unique roles for filter dropdown
  const uniqueRoles = [...new Set(users.map(u => u.role).filter(Boolean))];

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (modalType === 'add' || modalType === 'admin') {
        if (formData.password !== formData.confirm_password) {
          setAlert({ show: true, variant: 'danger', message: 'Passwords do not match!' });
          setLoading(false);
          return;
        }
        
        // Use different endpoint for admin creation
        const endpoint = modalType === 'admin' 
          ? '/hospital/management/users/create-admin/' 
          : '/hospital/management/users/create/';
        
        const response = await apiClient.post(endpoint, {
          email: formData.email,
          full_name: formData.full_name,
          role: formData.role,
          phone_number: formData.phone_number,
          license_number: formData.license_number,
          certification: formData.certification,
          specialization: formData.specialization,
          department: formData.department,
          position: formData.position,
          password: formData.password,
          selected_features: formData.selected_features
        });
        
        const userType = modalType === 'admin' ? 'Admin' : 'User';
        setAlert({ show: true, variant: 'success', message: `${userType} created successfully!` });
        loadUsers();
      } else if (modalType === 'edit') {
  const response = await apiClient.patch(`/hospital/management/users/${selectedUser.id}/update/`, {
          full_name: formData.full_name,
          role: formData.role,
          phone_number: formData.phone_number,
          license_number: formData.license_number,
          certification: formData.certification,
          specialization: formData.specialization,
          is_active: formData.is_active
        });
        
        setAlert({ show: true, variant: 'success', message: 'User updated successfully!' });
        loadUsers();
      }
      
      closeModal();
    } catch (err) {
      setAlert({ 
        show: true, 
        variant: 'danger', 
        message: `Failed to ${modalType} user: ${err.response?.data?.message || err.message}` 
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedUser) return;
    
    setLoading(true);
    try {
  await apiClient.delete(`/hospital/management/users/${selectedUser.id}/delete/`);
      setAlert({ show: true, variant: 'success', message: 'User deleted successfully!' });
      loadUsers();
      closeModal();
    } catch (err) {
      setAlert({ 
        show: true, 
        variant: 'danger', 
        message: 'Failed to delete user' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (userId, currentStatus) => {
    try {
  await apiClient.patch(`/hospital/management/users/${userId}/update/`, { is_active: !currentStatus });
      setAlert({ 
        show: true, 
        variant: 'success', 
        message: `User ${!currentStatus ? 'activated' : 'deactivated'} successfully!` 
      });
      loadUsers();
    } catch (err) {
      setAlert({ 
        show: true, 
        variant: 'danger', 
        message: 'Failed to update user status' 
      });
    }
  };

  // Open modal
  const openModal = (type, user = null) => {
    setModalType(type);
    setSelectedUser(user);
    
    if (user && type === 'edit') {
      setFormData({
        email: user.email || '',
        full_name: user.full_name || '',
        role: user.role || '',
        phone_number: user.phone_number || '',
        license_number: user.license_number || '',
        certification: user.certification || '',
        specialization: user.specialization || '',
        is_active: user.is_active || false,
        password: '',
        confirm_password: '',
        selected_features: user.selected_features || []
      });
      
      // Load user's features for editing
      if (user.id) {
        loadUserFeatures(user.id);
      }
    } else if (type === 'admin') {
      // Pre-fill admin form with admin defaults
      setFormData({
        email: '',
        full_name: '',
        role: 'admin',
        phone_number: '',
        license_number: '',
        certification: '',
        specialization: '',
        department: 'Administration',
        position: 'Administrator',
        is_active: true,
        password: '',
        confirm_password: '',
        selected_features: []
      });
    } else {
      setFormData({
        email: '',
        full_name: '',
        role: '',
        phone_number: '',
        license_number: '',
        certification: '',
        specialization: '',
        is_active: true,
        password: '',
        confirm_password: '',
        selected_features: []
      });
    }
    
    setShowModal(true);
  };

  // Handle export users
  const handleExportUsers = () => {
    try {
      const csvContent = "data:text/csv;charset=utf-8,";
      const headers = ["Full Name", "Email", "Role", "Phone", "Status", "Date Joined"];
      const csvData = [
        headers.join(","),
        ...filteredUsers.map(user => [
          `"${user.full_name || 'N/A'}"`,
          `"${user.email}"`,
          `"${user.role || 'unassigned'}"`,
          `"${user.phone_number || 'N/A'}"`,
          `"${user.is_active ? 'Active' : 'Inactive'}"`,
          `"${new Date(user.date_joined).toLocaleDateString()}"`
        ].join(","))
      ].join("\n");
      
      const encodedUri = encodeURI(csvContent + csvData);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `users_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setAlert({ 
        show: true, 
        variant: 'success', 
        message: `Successfully exported ${filteredUsers.length} users to CSV` 
      });
    } catch (err) {
      setAlert({ 
        show: true, 
        variant: 'danger', 
        message: 'Failed to export users' 
      });
    }
  };

  // Handle bulk import
  const handleBulkImport = () => {
    setAlert({ 
      show: true, 
      variant: 'info', 
      message: 'Bulk import functionality coming soon! Please contact system administrator.' 
    });
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedUser(null);
  };

  // Get role icon
  const getRoleIcon = (role) => {
    switch (role) {
      case 'doctor': return <RiStethoscopeLine size={16} />;
      case 'nurse': return <RiUserHeartLine size={16} />;
      case 'patient': return <RiUserHeartLine size={16} />;
      case 'admin': return <RiShieldUserLine size={16} />;
      case 'pharmacist': return <RiUserStarLine size={16} />;
      default: return <RiUserLine size={16} />;
    }
  };

  // Get role color
  const getRoleColor = (role) => {
    switch (role) {
      case 'doctor': return 'primary';
      case 'nurse': return 'success';
      case 'patient': return 'info';
      case 'admin': return 'danger';
      case 'pharmacist': return 'warning';
      default: return 'secondary';
    }
  };

  // Get user avatar
  const getUserAvatar = (user) => {
    const initials = user.full_name 
      ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
      : 'U';
    const color = getRoleColor(user.role);
    
    return (
      <div className={`user-avatar bg-${color} bg-opacity-10 text-${color}`}>
        {initials}
      </div>
    );
  };

  return (
    <>
      {/* Alert */}
      {alert.show && (
        <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible className="shadow-sm">
          <div className="d-flex align-items-center">
            {alert.variant === 'warning' ? <RiAlertLine className="me-2" /> : 
             alert.variant === 'success' ? <RiCheckLine className="me-2" /> : 
             <RiCloseLine className="me-2" />}
            {alert.message}
          </div>
        </Alert>
      )}

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col xl={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-3">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                    <RiTeamLine size={24} className="text-primary" />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h3 className="mb-0 fw-bold text-primary">{stats.total}</h3>
                  <p className="text-muted mb-0 small">Total Users</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-3">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                    <RiShieldCheckLine size={24} className="text-success" />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h3 className="mb-0 fw-bold text-success">{stats.active}</h3>
                  <p className="text-muted mb-0 small">Active Users</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-3">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-warning bg-opacity-10 p-3 rounded-circle">
                    <RiUserAddLine size={24} className="text-warning" />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h3 className="mb-0 fw-bold text-warning">{stats.recentRegistrations}</h3>
                  <p className="text-muted mb-0 small">New This Month</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-3">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-info bg-opacity-10 p-3 rounded-circle">
                    <RiUserStarLine size={24} className="text-info" />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h3 className="mb-0 fw-bold text-info">{Object.keys(stats.roles).length}</h3>
                  <p className="text-muted mb-0 small">User Roles</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-gradient-primary text-white border-0">
              <div className="d-flex justify-content-between align-items-center">
                <Card.Header.Title>
                  <h4 className="card-title d-flex align-items-center mb-0">
                    <RiTeamLine size={28} className="me-3" />
                    <div>
                      <div>User Management System</div>
                      <small className="opacity-75 fw-normal">Manage all platform users and their access</small>
                    </div>
                  </h4>
                </Card.Header.Title>
                <div className="d-flex gap-2">
                  <Dropdown>
                    <Dropdown.Toggle variant="outline-light" size="sm" className="border-white">
                      <RiSettingsLine size={16} className="me-1" />
                      Actions
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={handleExportUsers}>
                        <RiDownloadLine size={16} className="me-2" />
                        Export Users
                      </Dropdown.Item>
                      <Dropdown.Item onClick={handleBulkImport}>
                        <RiUploadLine size={16} className="me-2" />
                        Bulk Import
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <Button variant="outline-light" size="sm" onClick={loadUsers} disabled={loading} className="border-white">
                    <RiRefreshLine size={16} className="me-1" />
                    {loading ? 'Loading...' : 'Refresh'}
                  </Button>
                  {/* Create Admin User Button - Only for Super Admins */}
                  {currentUser?.role === 'super_admin' && (
                    <Button 
                      variant="danger" 
                      size="sm" 
                      onClick={() => openModal('admin')} 
                      className="fw-semibold me-2"
                      style={{
                        background: 'linear-gradient(45deg, #dc3545, #c82333)',
                        border: 'none',
                        boxShadow: '0 2px 8px rgba(220, 53, 69, 0.3)'
                      }}
                    >
                      <RiShieldCheckLine size={16} className="me-1" />
                      Create Admin User
                    </Button>
                  )}
                  <Button variant="light" size="sm" onClick={() => openModal('add')} className="fw-semibold">
                    <RiUserAddLine size={16} className="me-1" />
                    Add User
                  </Button>
                </div>
              </div>
            </Card.Header>
            
            <Card.Body className="p-4">
              {/* Advanced Search and Filter Controls */}
              <div className="bg-light rounded-3 p-3 mb-4">
                <Row className="g-3">
                  <Col lg={4}>
                    <Form.Label className="fw-semibold text-dark small mb-2">
                      <RiSearchLine size={16} className="me-1" />
                      Search Users
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-white border-end-0">
                        <RiSearchLine size={16} className="text-muted" />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Search by name, email, phone, license..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border-start-0 ps-0"
                      />
                    </InputGroup>
                  </Col>
                  <Col lg={3}>
                    <Form.Label className="fw-semibold text-dark small mb-2">
                      <RiUserLine size={16} className="me-1" />
                      Role
                    </Form.Label>
                    <Form.Select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                    >
                      <option value="">All Roles</option>
                      {uniqueRoles.map(role => (
                        <option key={role} value={role}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col lg={2}>
                    <Form.Label className="fw-semibold text-dark small mb-2">
                      <RiShieldCheckLine size={16} className="me-1" />
                      Status
                    </Form.Label>
                    <Form.Select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </Form.Select>
                  </Col>
                  <Col lg={3}>
                    <Form.Label className="fw-semibold text-dark small mb-2">
                      <RiFilterLine size={16} className="me-1" />
                      Sort By
                    </Form.Label>
                    <div className="d-flex gap-2">
                      <Form.Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="flex-grow-1"
                      >
                        <option value="full_name">Name</option>
                        <option value="email">Email</option>
                        <option value="role">Role</option>
                        <option value="date_joined">Date Joined</option>
                      </Form.Select>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="px-3"
                      >
                        {sortOrder === 'asc' ? <RiArrowUpLine /> : <RiArrowDownLine />}
                      </Button>
                    </div>
                  </Col>
                </Row>
                
                {/* Filter Summary */}
                <div className="mt-3 d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <span className="text-muted small">
                      Showing <strong>{filteredUsers.length}</strong> of <strong>{users.length}</strong> users
                    </span>
                    {(searchTerm || selectedRole || selectedStatus) && (
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedRole('');
                          setSelectedStatus('');
                        }}
                      >
                        <RiCloseLine className="me-1" />
                        Clear Filters
                      </Button>
                    )}
                  </div>
                  {filteredUsers.length > 0 && (
                    <ProgressBar 
                      now={(stats.active / stats.total) * 100} 
                      variant="success" 
                      style={{ width: '120px', height: '8px' }}
                      className="rounded-pill"
                    />
                  )}
                </div>
              </div>

              {/* Enhanced Users Table */}
              {loading ? (
                <div className="text-center py-5">
                  <div className="mb-3">
                    <Spinner animation="border" role="status" variant="primary" style={{ width: '3rem', height: '3rem' }}>
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                  <h5 className="text-muted">Loading users...</h5>
                  <p className="text-muted small">Please wait while we fetch the latest data</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-5">
                  <div className="mb-3">
                    <RiUserSearchLine size={64} className="text-muted" />
                  </div>
                  <h5 className="text-muted">No users found</h5>
                  <p className="text-muted mb-3">
                    {users.length === 0 
                      ? "No users have been registered yet." 
                      : "No users match your search criteria."}
                  </p>
                  {users.length === 0 && (
                    <Button variant="primary" onClick={() => openModal('add')}>
                      <RiUserAddLine size={16} className="me-1" />
                      Add First User
                    </Button>
                  )}
                </div>
              ) : (
                <div className="table-responsive">
                  <Table className="table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th className="border-0 fw-semibold text-dark">User Information</th>
                        <th className="border-0 fw-semibold text-dark">Role & Credentials</th>
                        <th className="border-0 fw-semibold text-dark">Contact</th>
                        <th className="border-0 fw-semibold text-dark">Status</th>
                        <th className="border-0 fw-semibold text-dark">Last Activity</th>
                        <th className="border-0 fw-semibold text-dark text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-bottom">
                          <td className="py-3">
                            <div className="d-flex align-items-center">
                              <div className="flex-shrink-0 me-3">
                                {getUserAvatar(user)}
                              </div>
                              <div className="flex-grow-1">
                                <div className="fw-bold text-dark">
                                  {user.full_name || 'No Name'}
                                </div>
                                <div className="small text-muted">
                                  <RiMailLine size={12} className="me-1" />
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="mb-2">
                              <Badge 
                                bg={getRoleColor(user.role)} 
                                className="role-badge d-flex align-items-center gap-1"
                              >
                                {getRoleIcon(user.role)}
                                {(user.role || 'unassigned').charAt(0).toUpperCase() + (user.role || 'unassigned').slice(1)}
                              </Badge>
                            </div>
                            <div className="small text-muted">
                              {user.license_number && (
                                <div>License: {user.license_number}</div>
                              )}
                              {user.certification && (
                                <div>Cert: {user.certification}</div>
                              )}
                              {user.specialization && (
                                <div>Spec: {user.specialization}</div>
                              )}
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="small">
                              {user.phone_number && (
                                <div className="mb-1">
                                  <RiPhoneLine size={14} className="me-2 text-success" />
                                  <span className="text-dark">{user.phone_number}</span>
                                </div>
                              )}
                              <div>
                                <RiCalendarLine size={14} className="me-2 text-info" />
                                <span className="text-dark">
                                  Joined {new Date(user.date_joined).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3">
                            <Badge 
                              bg={user.is_active ? "success" : "secondary"}
                              className="px-2 py-1 rounded-pill small d-flex align-items-center gap-1"
                              style={{ width: 'fit-content' }}
                            >
                              {user.is_active ? 
                                <RiShieldCheckLine size={12} /> : 
                                <RiCloseLine size={12} />
                              }
                              {user.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="py-3">
                            <div className="small text-muted">
                              {user.last_login ? (
                                <>
                                  {new Date(user.last_login).toLocaleDateString()}
                                  <br />
                                  <span className="text-xs">
                                    {new Date(user.last_login).toLocaleTimeString()}
                                  </span>
                                </>
                              ) : (
                                'Never'
                              )}
                            </div>
                          </td>
                          <td className="py-3 text-center">
                            <div className="d-flex justify-content-center gap-1">
                              <OverlayTrigger placement="top" overlay={<Tooltip>View Details</Tooltip>}>
                                <Button
                                  variant="outline-info"
                                  size="sm"
                                  onClick={() => openModal('view', user)}
                                  className="px-2 py-1 d-flex align-items-center justify-content-center"
                                  style={{ minWidth: '34px', minHeight: '34px' }}
                                >
                                  <RiEyeLine size={16} />
                                </Button>
                              </OverlayTrigger>
                              <OverlayTrigger placement="top" overlay={<Tooltip>Edit User</Tooltip>}>
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => openModal('edit', user)}
                                  className="px-2 py-1 d-flex align-items-center justify-content-center"
                                  style={{ minWidth: '34px', minHeight: '34px' }}
                                >
                                  <RiEditLine size={16} />
                                </Button>
                              </OverlayTrigger>
                              <OverlayTrigger 
                                placement="top" 
                                overlay={<Tooltip>{user.is_active ? 'Deactivate' : 'Activate'} User</Tooltip>}
                              >
                                <Button
                                  variant={user.is_active ? "outline-warning" : "outline-success"}
                                  size="sm"
                                  onClick={() => handleStatusToggle(user.id, user.is_active)}
                                  className="px-2 py-1 d-flex align-items-center justify-content-center"
                                  style={{ minWidth: '34px', minHeight: '34px' }}
                                >
                                  {user.is_active ? <RiLockLine size={16} /> : <RiKeyLine size={16} />}
                                </Button>
                              </OverlayTrigger>
                              <OverlayTrigger placement="top" overlay={<Tooltip>Delete User</Tooltip>}>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => openModal('delete', user)}
                                  className="px-2 py-1 d-flex align-items-center justify-content-center"
                                  style={{ minWidth: '34px', minHeight: '34px' }}
                                >
                                  <RiDeleteBinLine size={16} />
                                </Button>
                              </OverlayTrigger>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Enhanced Professional Modal */}
      <Modal show={showModal} onHide={closeModal} size="xl" centered className="modern-modal">
        <Modal.Header closeButton className="bg-gradient-light border-0 py-4">
          <Modal.Title className="d-flex align-items-center w-100">
            {modalType === 'add' && (
              <>
                <div className="bg-primary bg-opacity-15 p-3 rounded-circle me-3">
                  <RiUserAddLine size={24} className="text-primary" />
                </div>
                <div>
                  <div className="fw-bold text-dark mb-1" style={{ fontSize: '1.4rem' }}>Create New User</div>
                  <small className="text-muted fw-normal">Add a new user to the healthcare management system</small>
                </div>
              </>
            )}
            {modalType === 'admin' && (
              <>
                <div className="bg-danger bg-opacity-15 p-3 rounded-circle me-3">
                  <RiShieldCheckLine size={24} className="text-danger" />
                </div>
                <div>
                  <div className="fw-bold text-dark mb-1" style={{ fontSize: '1.4rem' }}>Create Admin User</div>
                  <small className="text-muted fw-normal">Add a new administrator with elevated permissions</small>
                </div>
              </>
            )}
            {modalType === 'edit' && (
              <>
                <div className="bg-success bg-opacity-10 p-2 rounded-circle me-3">
                  <RiEditLine size={20} className="text-success" />
                </div>
                <div>
                  <div className="fw-bold">Edit User</div>
                  <small className="text-muted fw-normal">Update user information and permissions</small>
                </div>
              </>
            )}
            {modalType === 'delete' && (
              <>
                <div className="bg-danger bg-opacity-10 p-2 rounded-circle me-3">
                  <RiDeleteBinLine size={20} className="text-danger" />
                </div>
                <div>
                  <div className="fw-bold">Delete User</div>
                  <small className="text-muted fw-normal">Permanently remove user account</small>
                </div>
              </>
            )}
            {modalType === 'view' && (
              <>
                <div className="bg-info bg-opacity-10 p-2 rounded-circle me-3">
                  <RiEyeLine size={20} className="text-info" />
                </div>
                <div>
                  <div className="fw-bold">User Details</div>
                  <small className="text-muted fw-normal">Complete user profile information</small>
                </div>
              </>
            )}
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="p-4">
          {modalType === 'view' && selectedUser && (
            <div>
              <Row>
                <Col md={4} className="text-center mb-4">
                  <div className="mb-3">
                    {getUserAvatar(selectedUser)}
                  </div>
                  <h4 className="fw-bold text-dark">{selectedUser.full_name}</h4>
                  <Badge 
                    bg={getRoleColor(selectedUser.role)} 
                    className="role-badge d-flex align-items-center gap-1 justify-content-center mb-2"
                  >
                    {getRoleIcon(selectedUser.role)}
                    {(selectedUser.role || 'unassigned').charAt(0).toUpperCase() + (selectedUser.role || 'unassigned').slice(1)}
                  </Badge>
                  <div className="text-muted">
                    <div><strong>Member since:</strong> {new Date(selectedUser.date_joined).toLocaleDateString()}</div>
                  </div>
                </Col>
                <Col md={8}>
                  <Row>
                    <Col sm={6} className="mb-3">
                      <Card className="border-0 bg-light h-100">
                        <Card.Body className="p-3">
                          <div className="d-flex align-items-center mb-2">
                            <RiMailLine size={18} className="text-primary me-2" />
                            <h6 className="mb-0 fw-semibold">Email</h6>
                          </div>
                          <p className="mb-0 text-dark">{selectedUser.email}</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col sm={6} className="mb-3">
                      <Card className="border-0 bg-light h-100">
                        <Card.Body className="p-3">
                          <div className="d-flex align-items-center mb-2">
                            <RiPhoneLine size={18} className="text-success me-2" />
                            <h6 className="mb-0 fw-semibold">Phone</h6>
                          </div>
                          <p className="mb-0 text-dark">{selectedUser.phone_number || 'N/A'}</p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                  
                  {/* Additional Information */}
                  <Card className="border-0 bg-light">
                    <Card.Body className="p-3">
                      <Row>
                        <Col sm={6}>
                          {selectedUser.license_number && (
                            <div className="mb-2">
                              <strong className="text-dark">License Number:</strong>
                              <span className="ms-2 text-muted">{selectedUser.license_number}</span>
                            </div>
                          )}
                          {selectedUser.certification && (
                            <div className="mb-2">
                              <strong className="text-dark">Certification:</strong>
                              <span className="ms-2 text-muted">{selectedUser.certification}</span>
                            </div>
                          )}
                        </Col>
                        <Col sm={6}>
                          {selectedUser.specialization && (
                            <div className="mb-2">
                              <strong className="text-dark">Specialization:</strong>
                              <span className="ms-2 text-muted">{selectedUser.specialization}</span>
                            </div>
                          )}
                          <div className="mb-2">
                            <strong className="text-dark">Status:</strong>
                            <Badge 
                              bg={selectedUser.is_active ? "success" : "secondary"}
                              className="ms-2"
                            >
                              {selectedUser.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </Col>
                      </Row>
                      
                      <div className="mt-3">
                        <div className="mb-2">
                          <strong className="text-dark">Last Login:</strong>
                          <span className="ms-2 text-muted">
                            {selectedUser.last_login 
                              ? new Date(selectedUser.last_login).toLocaleString()
                              : 'Never'
                            }
                          </span>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          )}
          
          {(modalType === 'add' || modalType === 'edit' || modalType === 'admin') && (
            <Form onSubmit={handleSubmit}>
              {/* Admin Privilege Notice */}
              {modalType === 'admin' && (
                <Alert variant="danger" className="border-0 bg-danger bg-opacity-10 mb-4">
                  <div className="d-flex align-items-center">
                    <RiShieldCheckLine size={20} className="text-danger me-2" />
                    <div>
                      <strong>Super Admin Privileges:</strong> You are creating an administrator account with elevated permissions and system management access.
                    </div>
                  </div>
                </Alert>
              )}
              
              {/* Basic Information Section */}
              <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3">
                    <RiUserLine size={18} className="text-primary" />
                  </div>
                  <h6 className="mb-0 fw-semibold text-dark">Basic Information</h6>
                </div>
                <div className="border-start border-primary border-4 ps-4">
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold text-dark">
                          <RiUserLine size={16} className="me-2 text-primary" />
                          Full Name *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.full_name}
                          onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                          required
                          placeholder="Enter full name"
                          className="border-2 border-light rounded-3 py-2"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold text-dark">
                          <RiMailLine size={16} className="me-2 text-primary" />
                          Email Address *
                        </Form.Label>
                        <Form.Control
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                          disabled={modalType === 'edit'}
                          placeholder="user@example.com"
                          className="border-2 border-light rounded-3 py-2"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold text-dark">
                          <RiShieldLine size={16} className="me-2 text-primary" />
                          User Role *
                        </Form.Label>
                        <Form.Select
                          value={formData.role}
                          onChange={(e) => setFormData({...formData, role: e.target.value})}
                          required
                          disabled={modalType === 'admin'} // Disable for admin creation
                          className="border-2 border-light rounded-3 py-2"
                        >
                          <option value="">Select User Role</option>
                          {modalType === 'admin' ? (
                            <option value="admin">🔧 Admin</option>
                          ) : (
                            <>
                              <option value="doctor">👨‍⚕️ Doctor</option>
                              <option value="nurse">👩‍⚕️ Nurse</option>
                              <option value="patient">🧑‍🦽 Patient</option>
                              <option value="pharmacist">💊 Pharmacist</option>
                              <option value="admin">🔧 Admin</option>
                              {currentUser?.role === 'super_admin' && (
                                <option value="super_admin">⚡ Super Admin</option>
                              )}
                            </>
                          )}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold text-dark">
                          <RiPhoneLine size={16} className="me-2 text-primary" />
                          Phone Number
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          value={formData.phone_number}
                          onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                          placeholder="+1 (555) 123-4567"
                          className="border-2 border-light rounded-3 py-2"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              </div>

              {/* Personal Information Section */}
              <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-info bg-opacity-10 p-2 rounded-circle me-3">
                    <RiContactsLine size={18} className="text-info" />
                  </div>
                  <h6 className="mb-0 fw-semibold text-dark">Personal Information</h6>
                </div>
                <div className="border-start border-info border-4 ps-4">
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold text-dark">
                          <RiCalendarLine size={16} className="me-2 text-info" />
                          Date of Birth
                        </Form.Label>
                        <Form.Control
                          type="date"
                          value={formData.date_of_birth}
                          onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                          className="border-2 border-light rounded-3 py-2"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold text-dark">
                          <RiUserLine size={16} className="me-2 text-info" />
                          Gender
                        </Form.Label>
                        <Form.Select
                          value={formData.gender}
                          onChange={(e) => setFormData({...formData, gender: e.target.value})}
                          className="border-2 border-light rounded-3 py-2"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">👨 Male</option>
                          <option value="female">👩 Female</option>
                          <option value="other">🧑 Other</option>
                          <option value="prefer_not_to_say">🤐 Prefer not to say</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold text-dark">
                          <RiImageLine size={16} className="me-2 text-info" />
                          Profile Picture
                        </Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={(e) => setFormData({...formData, profile_picture: e.target.files[0]})}
                          className="border-2 border-light rounded-3 py-2"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold text-dark">
                          <RiMapPinLine size={16} className="me-2 text-info" />
                          Street Address
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.address_street}
                          onChange={(e) => setFormData({...formData, address_street: e.target.value})}
                          placeholder="123 Main Street, Apt 4B"
                          className="border-2 border-light rounded-3 py-2"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold text-dark">
                          <RiBuilding2Line size={16} className="me-2 text-info" />
                          City
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.address_city}
                          onChange={(e) => setFormData({...formData, address_city: e.target.value})}
                          placeholder="New York"
                          className="border-2 border-light rounded-3 py-2"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold text-dark">
                          <RiMapPinLine size={16} className="me-2 text-info" />
                          State/Province
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.address_state}
                          onChange={(e) => setFormData({...formData, address_state: e.target.value})}
                          placeholder="NY"
                          className="border-2 border-light rounded-3 py-2"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold text-dark">
                          <RiFileTextLine size={16} className="me-2 text-info" />
                          ZIP/Postal Code
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.address_zip}
                          onChange={(e) => setFormData({...formData, address_zip: e.target.value})}
                          placeholder="10001"
                          className="border-2 border-light rounded-3 py-2"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold text-dark">
                          <RiContactsLine size={16} className="me-2 text-info" />
                          Emergency Contact Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.emergency_contact_name}
                          onChange={(e) => setFormData({...formData, emergency_contact_name: e.target.value})}
                          placeholder="John Doe"
                          className="border-2 border-light rounded-3 py-2"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold text-dark">
                          <RiPhoneLine size={16} className="me-2 text-info" />
                          Emergency Contact Phone
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          value={formData.emergency_contact_phone}
                          onChange={(e) => setFormData({...formData, emergency_contact_phone: e.target.value})}
                          placeholder="+1 (555) 987-6543"
                          className="border-2 border-light rounded-3 py-2"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              </div>

              {/* Professional Information Section */}
              {(formData.role === 'doctor' || formData.role === 'nurse' || formData.role === 'pharmacist' || formData.role === 'admin' || formData.role === 'super_admin') && (
                <div className="mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-success bg-opacity-10 p-2 rounded-circle me-3">
                      <RiBriefcaseLine size={18} className="text-success" />
                    </div>
                    <h6 className="mb-0 fw-semibold text-dark">Professional Details</h6>
                  </div>
                  <div className="border-start border-success border-4 ps-4">
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold text-dark">
                            <RiHospitalLine size={16} className="me-2 text-success" />
                            Department/Ward
                          </Form.Label>
                          <Form.Select
                            value={formData.department}
                            onChange={(e) => setFormData({...formData, department: e.target.value})}
                            className="border-2 border-light rounded-3 py-2"
                          >
                            <option value="">Select Department</option>
                            <option value="emergency">🚨 Emergency</option>
                            <option value="cardiology">❤️ Cardiology</option>
                            <option value="neurology">🧠 Neurology</option>
                            <option value="pediatrics">👶 Pediatrics</option>
                            <option value="surgery">🔪 Surgery</option>
                            <option value="oncology">🎗️ Oncology</option>
                            <option value="radiology">📡 Radiology</option>
                            <option value="pharmacy">💊 Pharmacy</option>
                            <option value="administration">🏢 Administration</option>
                            <option value="icu">🏥 ICU</option>
                            <option value="maternity">🤱 Maternity</option>
                            <option value="orthopedics">🦴 Orthopedics</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold text-dark">
                            <RiIdCardLine size={16} className="me-2 text-success" />
                            Employee ID
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={formData.employee_id}
                            onChange={(e) => setFormData({...formData, employee_id: e.target.value})}
                            placeholder="EMP-2024-001"
                            className="border-2 border-light rounded-3 py-2"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold text-dark">
                            <RiTimeLine size={16} className="me-2 text-success" />
                            Years of Experience
                          </Form.Label>
                          <Form.Control
                            type="number"
                            min="0"
                            max="50"
                            value={formData.years_experience}
                            onChange={(e) => setFormData({...formData, years_experience: e.target.value})}
                            placeholder="5"
                            className="border-2 border-light rounded-3 py-2"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold text-dark">
                            <RiCalendarLine size={16} className="me-2 text-success" />
                            Employment Start Date
                          </Form.Label>
                          <Form.Control
                            type="date"
                            value={formData.employment_start_date}
                            onChange={(e) => setFormData({...formData, employment_start_date: e.target.value})}
                            className="border-2 border-light rounded-3 py-2"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold text-dark">
                            <RiTimeLine size={16} className="me-2 text-success" />
                            Work Schedule
                          </Form.Label>
                          <Form.Select
                            value={formData.work_schedule}
                            onChange={(e) => setFormData({...formData, work_schedule: e.target.value})}
                            className="border-2 border-light rounded-3 py-2"
                          >
                            <option value="">Select Schedule</option>
                            <option value="day">🌅 Day Shift (7AM-7PM)</option>
                            <option value="night">🌙 Night Shift (7PM-7AM)</option>
                            <option value="rotating">🔄 Rotating Shifts</option>
                            <option value="on_call">📞 On Call</option>
                            <option value="flexible">⏰ Flexible Hours</option>
                            <option value="part_time">⏳ Part Time</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* License and Certification for Medical Staff */}
                    {(formData.role === 'doctor' || formData.role === 'nurse' || formData.role === 'pharmacist') && (
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold text-dark">
                              <RiKeyLine size={16} className="me-2 text-success" />
                              {formData.role === 'doctor' ? 'Medical License Number' : 
                               formData.role === 'pharmacist' ? 'Pharmacy License Number' : 'Professional Certification'}
                            </Form.Label>
                            <Form.Control
                              type="text"
                              value={formData.role === 'doctor' ? formData.license_number : formData.certification}
                              onChange={(e) => setFormData({
                                ...formData, 
                                [formData.role === 'doctor' ? 'license_number' : 'certification']: e.target.value
                              })}
                              placeholder={formData.role === 'doctor' ? 'MD123456789' : 
                                         formData.role === 'pharmacist' ? 'PharmD-123456' : 'RN-Certified'}
                              className="border-2 border-light rounded-3 py-2"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold text-dark">
                              <RiUserHeartLine size={16} className="me-2 text-success" />
                              Specialization
                            </Form.Label>
                            <Form.Control
                              type="text"
                              value={formData.specialization}
                              onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                              placeholder={formData.role === 'doctor' ? 'e.g., Cardiology, Pediatrics' : 
                                         formData.role === 'pharmacist' ? 'e.g., Clinical Pharmacy' : 'e.g., ICU, Pediatric Nursing'}
                              className="border-2 border-light rounded-3 py-2"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    )}

                    <Row>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold text-dark">
                            <RiGroupLine size={16} className="me-2 text-success" />
                            Supervisor/Manager
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={formData.supervisor}
                            onChange={(e) => setFormData({...formData, supervisor: e.target.value})}
                            placeholder="Dr. Sarah Johnson"
                            className="border-2 border-light rounded-3 py-2"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                </div>
              )}

              {/* Medical/Healthcare Specific Information */}
              {(formData.role === 'doctor' || formData.role === 'nurse' || formData.role === 'pharmacist') && (
                <div className="mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-danger bg-opacity-10 p-2 rounded-circle me-3">
                      <RiHeartLine size={18} className="text-danger" />
                    </div>
                    <h6 className="mb-0 fw-semibold text-dark">Medical & Healthcare Details</h6>
                  </div>
                  <div className="border-start border-danger border-4 ps-4">
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold text-dark">
                            <RiGraduationCapLine size={16} className="me-2 text-danger" />
                            Medical Degree
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={formData.medical_degree}
                            onChange={(e) => setFormData({...formData, medical_degree: e.target.value})}
                            placeholder="MD, PharmD, BSN, RN"
                            className="border-2 border-light rounded-3 py-2"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold text-dark">
                            <RiBuilding2Line size={16} className="me-2 text-danger" />
                            Institution
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={formData.institution}
                            onChange={(e) => setFormData({...formData, institution: e.target.value})}
                            placeholder="Harvard Medical School"
                            className="border-2 border-light rounded-3 py-2"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold text-dark">
                            <RiAwardLine size={16} className="me-2 text-danger" />
                            Board Certifications
                          </Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            value={formData.board_certifications}
                            onChange={(e) => setFormData({...formData, board_certifications: e.target.value})}
                            placeholder="American Board of Internal Medicine, etc."
                            className="border-2 border-light rounded-3 py-2"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold text-dark">
                            <RiTranslate2Line size={16} className="me-2 text-danger" />
                            Languages Spoken
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={formData.languages_spoken}
                            onChange={(e) => setFormData({...formData, languages_spoken: e.target.value})}
                            placeholder="English, Spanish, French"
                            className="border-2 border-light rounded-3 py-2"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold text-dark">
                            <RiShieldCheckLine size={16} className="me-2 text-danger" />
                            Insurance Provider
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={formData.insurance_provider}
                            onChange={(e) => setFormData({...formData, insurance_provider: e.target.value})}
                            placeholder="Blue Cross Blue Shield"
                            className="border-2 border-light rounded-3 py-2"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold text-dark">
                            <RiIdCardLine size={16} className="me-2 text-danger" />
                            NPI Number (US Healthcare)
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={formData.npi_number}
                            onChange={(e) => setFormData({...formData, npi_number: e.target.value})}
                            placeholder="1234567890"
                            className="border-2 border-light rounded-3 py-2"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                </div>
              )}

              {/* Account Settings Section */}
              <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-secondary bg-opacity-10 p-2 rounded-circle me-3">
                    <RiUserSettingsLine size={18} className="text-secondary" />
                  </div>
                  <h6 className="mb-0 fw-semibold text-dark">Account Settings</h6>
                </div>
                <div className="border-start border-secondary border-4 ps-4">
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <div className="d-flex align-items-center">
                          <Form.Check
                            type="checkbox"
                            id="password-expires"
                            checked={formData.password_expires}
                            onChange={(e) => setFormData({...formData, password_expires: e.target.checked})}
                            className="me-2"
                          />
                          <Form.Label htmlFor="password-expires" className="fw-semibold text-dark mb-0">
                            <RiTimeLine size={16} className="me-2 text-secondary" />
                            Password Expires
                          </Form.Label>
                        </div>
                        <small className="text-muted">Enable password expiration policy</small>
                      </Form.Group>
                      {formData.password_expires && (
                        <Form.Group className="mb-3 ms-4">
                          <Form.Label className="fw-semibold text-dark">
                            Password Expiry Date
                          </Form.Label>
                          <Form.Control
                            type="date"
                            value={formData.password_expiry_date}
                            onChange={(e) => setFormData({...formData, password_expiry_date: e.target.value})}
                            className="border-2 border-light rounded-3 py-2"
                          />
                        </Form.Group>
                      )}
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <div className="d-flex align-items-center">
                          <Form.Check
                            type="checkbox"
                            id="two-factor"
                            checked={formData.two_factor_enabled}
                            onChange={(e) => setFormData({...formData, two_factor_enabled: e.target.checked})}
                            className="me-2"
                          />
                          <Form.Label htmlFor="two-factor" className="fw-semibold text-dark mb-0">
                            <RiKeyLine size={16} className="me-2 text-secondary" />
                            Two-Factor Authentication
                          </Form.Label>
                        </div>
                        <small className="text-muted">Require 2FA for enhanced security</small>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold text-dark">
                          <RiCalendarLine size={16} className="me-2 text-secondary" />
                          Account Expiry Date
                        </Form.Label>
                        <Form.Control
                          type="date"
                          value={formData.account_expiry_date}
                          onChange={(e) => setFormData({...formData, account_expiry_date: e.target.value})}
                          className="border-2 border-light rounded-3 py-2"
                        />
                        <small className="text-muted">Leave empty for permanent account</small>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold text-dark">
                          <RiShieldLine size={16} className="me-2 text-secondary" />
                          Login Restrictions
                        </Form.Label>
                        <Form.Select
                          value={formData.login_restrictions}
                          onChange={(e) => setFormData({...formData, login_restrictions: e.target.value})}
                          className="border-2 border-light rounded-3 py-2"
                        >
                          <option value="">No Restrictions</option>
                          <option value="ip_whitelist">🌐 IP Address Whitelist</option>
                          <option value="time_based">⏰ Time-based Access</option>
                          <option value="device_based">📱 Device-based Access</option>
                          <option value="location_based">📍 Location-based Access</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              </div>

              {/* System Permissions Section */}
              <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3">
                    <RiStarLine size={18} className="text-primary" />
                  </div>
                  <h6 className="mb-0 fw-semibold text-dark">System Permissions</h6>
                </div>
                <div className="border-start border-primary border-4 ps-4">
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold text-dark">
                          <RiShieldLine size={16} className="me-2 text-primary" />
                          Access Level
                        </Form.Label>
                        <Form.Select
                          value={formData.access_level}
                          onChange={(e) => setFormData({...formData, access_level: e.target.value})}
                          className="border-2 border-light rounded-3 py-2"
                        >
                          <option value="basic">🔵 Basic Access</option>
                          <option value="advanced">🟡 Advanced Access</option>
                          <option value="full">🟢 Full Access</option>
                          <option value="restricted">🔴 Restricted Access</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold text-dark">
                          <RiAppsLine size={16} className="me-2 text-primary" />
                          Allowed Modules
                        </Form.Label>
                        <div className="border border-light rounded-3 p-2" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                          {['Patient Management', 'Medical Records', 'Billing', 'Pharmacy', 'Laboratory', 'Radiology', 'Appointments', 'Reports', 'User Management', 'System Settings'].map((module) => (
                            <Form.Check
                              key={module}
                              type="checkbox"
                              id={`module-${module.replace(/\s+/g, '-').toLowerCase()}`}
                              label={module}
                              checked={formData.allowed_modules.includes(module)}
                              onChange={(e) => {
                                const modules = e.target.checked 
                                  ? [...formData.allowed_modules, module]
                                  : formData.allowed_modules.filter(m => m !== module);
                                setFormData({...formData, allowed_modules: modules});
                              }}
                              className="mb-1"
                            />
                          ))}
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold text-dark">
                          <RiDatabaseLine size={16} className="me-2 text-primary" />
                          Data Access Restrictions
                        </Form.Label>
                        <Form.Select
                          value={formData.data_access_restrictions}
                          onChange={(e) => setFormData({...formData, data_access_restrictions: e.target.value})}
                          className="border-2 border-light rounded-3 py-2"
                        >
                          <option value="">No Restrictions</option>
                          <option value="department_only">🏢 Department Data Only</option>
                          <option value="assigned_patients">👥 Assigned Patients Only</option>
                          <option value="read_only">👁️ Read-Only Access</option>
                          <option value="limited_history">📅 Limited History Access</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <div className="d-flex align-items-center">
                          <Form.Check
                            type="checkbox"
                            id="approval-workflow"
                            checked={formData.approval_workflow}
                            onChange={(e) => setFormData({...formData, approval_workflow: e.target.checked})}
                            className="me-2"
                          />
                          <Form.Label htmlFor="approval-workflow" className="fw-semibold text-dark mb-0">
                            <RiCheckboxLine size={16} className="me-2 text-primary" />
                            Approval Workflow Required
                          </Form.Label>
                        </div>
                        <small className="text-muted">Require approval for critical actions</small>
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              </div>

              {/* Security Section */}
              {modalType === 'add' && (
                <div className="mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-warning bg-opacity-10 p-2 rounded-circle me-3">
                      <RiLockLine size={18} className="text-warning" />
                    </div>
                    <h6 className="mb-0 fw-semibold text-dark">Security Settings</h6>
                  </div>
                  <div className="border-start border-warning border-4 ps-4">
                    <Alert variant="info" className="border-0 bg-info bg-opacity-10 mb-3">
                      <div className="d-flex align-items-start">
                        <RiLockLine size={18} className="text-info me-2 mt-1 flex-shrink-0" />
                        <div>
                          <h6 className="fw-semibold text-info mb-1">Password Requirements</h6>
                          <ul className="mb-0 small text-info">
                            <li>Minimum 8 characters length</li>
                            <li>Include uppercase and lowercase letters</li>
                            <li>At least one number and special character</li>
                          </ul>
                        </div>
                      </div>
                    </Alert>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold text-dark">
                            <RiLockLine size={16} className="me-2 text-warning" />
                            Password *
                          </Form.Label>
                          <Form.Control
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required
                            placeholder="Enter secure password"
                            className="border-2 border-light rounded-3 py-2"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold text-dark">
                            <RiKeyLine size={16} className="me-2 text-warning" />
                            Confirm Password *
                          </Form.Label>
                          <Form.Control
                            type="password"
                            value={formData.confirm_password}
                            onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
                            required
                            placeholder="Confirm password"
                            className="border-2 border-light rounded-3 py-2"
                          />
                          {formData.password && formData.confirm_password && formData.password !== formData.confirm_password && (
                            <div className="text-danger small mt-1">
                              <RiCloseFill className="me-1" />
                              Passwords do not match
                            </div>
                          )}
                          {formData.password && formData.confirm_password && formData.password === formData.confirm_password && (
                            <div className="text-success small mt-1">
                              <RiCheckFill className="me-1" />
                              Passwords match
                            </div>
                          )}
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                </div>
              )}
              
              {/* Feature Access Selection */}
              <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-purple bg-opacity-10 p-2 rounded-circle me-3" style={{ backgroundColor: 'rgba(108, 117, 125, 0.1)' }}>
                    <RiAppsLine size={18} className="text-secondary" />
                  </div>
                  <h6 className="mb-0 fw-semibold text-dark">Feature Access</h6>
                </div>
                <div className="border-start border-secondary border-4 ps-4">
                  <Alert variant="secondary" className="border-0 bg-secondary bg-opacity-10 mb-3">
                    <div className="d-flex align-items-start">
                      <RiAppsLine size={18} className="text-secondary me-2 mt-1 flex-shrink-0" />
                      <div>
                        <h6 className="fw-semibold text-secondary mb-1">Select Platform Features</h6>
                        <p className="mb-0 small text-secondary">
                          Choose which features this user can access. Admin users will have access to all features by default.
                        </p>
                      </div>
                    </div>
                  </Alert>
                  
                  {loadingFeatures ? (
                    <div className="text-center py-3">
                      <Spinner animation="border" size="sm" className="me-2" />
                      Loading features...
                    </div>
                  ) : (
                    <Row>
                      {availableFeatures.map((feature) => (
                        <Col md={6} lg={4} key={feature.code} className="mb-3">
                          <Card className="h-100 border-light">
                            <Card.Body className="p-3">
                              <div className="d-flex align-items-start">
                                <Form.Check
                                  type="checkbox"
                                  id={`feature-${feature.code}`}
                                  checked={formData.selected_features.includes(feature.code)}
                                  onChange={(e) => {
                                    const selected = [...formData.selected_features];
                                    if (e.target.checked) {
                                      selected.push(feature.code);
                                    } else {
                                      const index = selected.indexOf(feature.code);
                                      if (index > -1) selected.splice(index, 1);
                                    }
                                    setFormData({...formData, selected_features: selected});
                                  }}
                                  className="me-3 mt-1"
                                />
                                <div className="flex-grow-1">
                                  <h6 className="mb-1 fw-semibold text-dark">{feature.name}</h6>
                                  <p className="mb-0 small text-muted">{feature.description}</p>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  )}
                  
                  <div className="mt-3">
                    <small className="text-muted">
                      <strong>Selected:</strong> {formData.selected_features.length} feature(s)
                    </small>
                  </div>
                </div>
              </div>
              
              {/* Account Status Section */}
              {modalType === 'edit' && (
                <div className="mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-info bg-opacity-10 p-2 rounded-circle me-3">
                      <RiSettings3Line size={18} className="text-info" />
                    </div>
                    <h6 className="mb-0 fw-semibold text-dark">Account Settings</h6>
                  </div>
                  <div className="border-start border-info border-4 ps-4">
                    <Form.Group className="mb-3">
                      <div className="d-flex align-items-center">
                        <Form.Check
                          type="switch"
                          id="is_active"
                          label=""
                          checked={formData.is_active}
                          onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                          className="me-3"
                        />
                        <div>
                          <h6 className="mb-1 fw-semibold text-dark">
                            {formData.is_active ? 'Active User Account' : 'Inactive User Account'}
                          </h6>
                          <small className="text-muted">
                            {formData.is_active 
                              ? 'User can access the system and perform actions' 
                              : 'User account is disabled and cannot access the system'
                            }
                          </small>
                        </div>
                      </div>
                    </Form.Group>
                  </div>
                </div>
              )}
            </Form>
          )}
          
          {modalType === 'delete' && (
            <div className="text-center">
              <div className="mb-4">
                <div className="bg-danger bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                  <RiDeleteBinLine size={32} className="text-danger" />
                </div>
                <h4 className="fw-bold text-dark mb-2">Confirm User Deletion</h4>
                <p className="text-muted mb-4">
                  Are you sure you want to permanently delete <strong className="text-danger">
                    {selectedUser?.full_name}
                  </strong> from the system?
                </p>
              </div>
              
              <Alert variant="danger" className="text-start border-0 bg-danger bg-opacity-10">
                <div className="d-flex align-items-start">
                  <RiDeleteBinLine size={20} className="text-danger me-3 mt-1 flex-shrink-0" />
                  <div>
                    <h6 className="fw-bold text-danger mb-2">This action cannot be undone!</h6>
                    <p className="mb-2 small text-dark">Deleting this user will permanently remove:</p>
                    <ul className="small text-dark mb-0 ps-3">
                      <li>Complete user profile and credentials</li>
                      <li>All associated appointments and records</li>
                      <li>Access permissions and role assignments</li>
                      <li>Activity history and logs</li>
                    </ul>
                  </div>
                </div>
              </Alert>
            </div>
          )}
        </Modal.Body>
        
        <Modal.Footer className="bg-gradient-light border-0 p-4">
          <div className="d-flex gap-3 w-100 justify-content-end">
            <Button 
              variant="outline-secondary" 
              onClick={closeModal}
              className="px-5 py-2 fw-semibold"
              disabled={loading}
              style={{ minWidth: '120px' }}
            >
              <RiDeleteBinLine size={16} className="me-2" />
              Cancel
            </Button>
            
            {(modalType === 'add' || modalType === 'edit' || modalType === 'admin') && (
              <Button 
                type="submit"
                variant={modalType === 'admin' ? 'danger' : 'primary'} 
                onClick={handleSubmit}
                disabled={loading}
                className="px-5 py-2 fw-semibold shadow-sm"
                style={{ minWidth: '150px' }}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    {modalType === 'admin' ? 'Creating Admin...' : modalType === 'add' ? 'Creating User...' : 'Updating User...'}
                  </>
                ) : (
                  <>
                    {modalType === 'admin' ? <RiShieldCheckLine size={16} className="me-2" /> : 
                     modalType === 'add' ? <RiUserAddLine size={16} className="me-2" /> : <RiEditLine size={16} className="me-2" />}
                    {modalType === 'admin' ? 'Create Admin User' : modalType === 'add' ? 'Create User' : 'Update User'}
                  </>
                )}
              </Button>
            )}
            
            {modalType === 'delete' && (
              <Button 
                variant="danger" 
                onClick={handleDelete} 
                disabled={loading}
                className="px-4 flex-fill fw-semibold"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <RiDeleteBinLine size={16} className="me-1" />
                    Delete User
                  </>
                )}
              </Button>
            )}
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserManagement;
