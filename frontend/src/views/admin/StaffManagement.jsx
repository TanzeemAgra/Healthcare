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
  RiSortDesc,
  RiAdminLine,
  RiLockLine,
  RiEyeOffLine,
  RiMore2Line,
  RiSettings4Line,
  RiCheckboxBlankLine,
  RiCheckboxLine,
  RiCheckboxIndeterminateLine,
  RiDeleteBin2Line,
  RiShieldCheckLine,
  RiInformationLine
} from '@remixicon/react';
import apiClient from '../../services/api';
import { USER_MANAGEMENT_ENDPOINTS } from '../../services/apiConstants';

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

  // Admin accounts data
  const [adminAccounts, setAdminAccounts] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [selectedAdmins, setSelectedAdmins] = useState([]);
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  const [adminFilter, setAdminFilter] = useState('all'); // all, active, inactive, hidden
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bulkAction, setBulkAction] = useState('');
  const [adminSearchTerm, setAdminSearchTerm] = useState('');
  const [hiddenAdmins, setHiddenAdmins] = useState(new Set());
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminModalType, setAdminModalType] = useState('view'); // 'view', 'edit'
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [editAdminForm, setEditAdminForm] = useState({});
  const [activeEditTab, setActiveEditTab] = useState('basic');

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

  // Staff list - Initially empty, populated from backend or demo data
  const [staffList, setStaffList] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  // Calculate staff statistics
  // Calculate staff statistics when staffList changes
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
        adminsCount: staffList.filter(staff => staff.role === 'admin').length + adminAccounts.length,
        recentJoins,
        onLeave: staffList.filter(staff => staff.status === 'on-leave').length,
        departments,
        avgExperience: staffList.length > 0 ? staffList.reduce((sum, staff) => sum + (staff.experience || 0), 0) / staffList.length : 0,
        turnoverRate: 0 // Will be calculated from real data
      });
    };

    calculateStats();
  }, [staffList, adminAccounts]);

  // Initial data fetching on component mount
  useEffect(() => {
    fetchAdminAccounts(); // Fetch real admin accounts on component mount
    fetchStaffMembers(); // Fetch real staff data on component mount
  }, []); // Empty dependency array to run only once on mount

  // Fetch staff members from backend
  const fetchStaffMembers = async () => {
    setLoadingStaff(true);
    try {
      // Fetch all users and filter on frontend since backend doesn't support multiple roles
      const response = await apiClient.get(USER_MANAGEMENT_ENDPOINTS.LIST_USERS, {
        params: {
          limit: 100, // Get more records
        }
      });
      
      if (response.data.success) {
        // Transform and filter the user data to match our staff list format
        const transformedStaff = (response.data.users || [])
          .filter(user => ['doctor', 'nurse', 'pharmacist', 'staff'].includes(user.role))
          .map(user => ({
            id: user.id,
            name: user.full_name || (user.first_name && user.last_name ? 
              `${user.first_name} ${user.last_name}` : 
              user.username),
            email: user.email,
            role: user.role || 'staff',
            department: user.profile?.department || 'General',
            phone: user.phone_number || 'N/A',
            joinDate: user.date_joined ? new Date(user.date_joined).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            status: user.is_active ? 'active' : 'inactive',
            licenseNumber: user.license_number || 'N/A',
            specialization: user.specialization || 'General',
            experience: user.profile?.experience || 0,
            education: user.certification || 'N/A',
            address: user.profile?.address || 'N/A',
            emergencyContact: user.profile?.emergency_contact || 'N/A',
            shift: user.profile?.shift || 'day',
            salary: user.profile?.salary || 0,
            lastLogin: user.last_login,
            performanceRating: user.profile?.performance_rating || 4.0,
            certifications: user.certification ? [user.certification] : [],
            availability: user.profile?.availability || 'full-time',
            notes: user.profile?.notes || ''
          }));
        
        setStaffList(transformedStaff);
        setDemoMode(false);
      }
    } catch (error) {
      console.error('Error fetching staff members:', error);
      
      // Check if it's an authentication error and switch to demo mode
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log('Authentication required, switching to demo mode');
        setDemoMode(true);
        loadDemoData();
        showAlertMessage('Demo Mode: Authentication required for live data. Showing sample interface.', 'info');
      } else if (error.response?.status === 404) {
        setDemoMode(true);
        loadDemoData();
        showAlertMessage('Demo Mode: API endpoints not available. Showing sample interface.', 'info');
      } else {
        setDemoMode(true);
        loadDemoData();
        showAlertMessage('Demo Mode: Unable to connect to backend. Showing sample interface.', 'warning');
      }
    } finally {
      setLoadingStaff(false);
    }
  };

  // Load demo data for testing interface
  const loadDemoData = () => {
    const demoStaff = [
      {
        id: 1,
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@hospital.com',
        role: 'doctor',
        department: 'Cardiology',
        phone: '+1 (555) 123-4567',
        joinDate: '2023-01-15',
        status: 'active',
        licenseNumber: 'MD123456',
        specialization: 'Interventional Cardiology',
        experience: 8,
        education: 'MD - Medical College',
        address: 'Professional Address',
        emergencyContact: 'Emergency Contact',
        shift: 'morning',
        salary: 180000,
        lastLogin: '2025-01-27',
        performanceRating: 4.8,
        certifications: ['ACLS', 'BLS', 'Board Certified'],
        availability: 'full-time',
        notes: 'Demo staff member - not real data'
      },
      {
        id: 2,
        name: 'Nurse Emily Davis',
        email: 'emily.davis@hospital.com',
        role: 'nurse',
        department: 'Emergency',
        phone: '+1 (555) 234-5678',
        joinDate: '2023-03-20',
        status: 'active',
        licenseNumber: 'RN789012',
        specialization: 'Emergency Care',
        experience: 5,
        education: 'BSN - Nursing School',
        address: 'Professional Address',
        emergencyContact: 'Emergency Contact',
        shift: 'night',
        salary: 75000,
        lastLogin: '2025-01-27',
        performanceRating: 4.6,
        certifications: ['RN', 'BLS', 'ACLS'],
        availability: 'full-time',
        notes: 'Demo staff member - not real data'
      },
      {
        id: 3,
        name: 'Alex Rodriguez',
        email: 'alex.rodriguez@hospital.com',
        role: 'pharmacist',
        department: 'Pharmacy',
        phone: '+1 (555) 345-6789',
        joinDate: '2023-05-01',
        status: 'active',
        licenseNumber: 'PharmD345678',
        specialization: 'Clinical Pharmacy',
        experience: 6,
        education: 'PharmD - Pharmacy School',
        address: 'Professional Address',
        emergencyContact: 'Emergency Contact',
        shift: 'afternoon',
        salary: 110000,
        lastLogin: '2025-01-27',
        performanceRating: 4.7,
        certifications: ['Licensed Pharmacist'],
        availability: 'full-time',
        notes: 'Demo staff member - not real data'
      }
    ];
    setStaffList(demoStaff);
  };

  // Fetch admin accounts from backend
  const fetchAdminAccounts = async () => {
    setLoadingAdmins(true);
    try {
      const response = await apiClient.get(USER_MANAGEMENT_ENDPOINTS.ADMIN_USERS);
      if (response.data.success) {
        setAdminAccounts(response.data.users || []);
      }
    } catch (error) {
      console.error('Error fetching admin accounts:', error);
      
      // In demo mode, just set empty admin accounts
      if (demoMode) {
        setAdminAccounts([]);
      } else {
        // Check if it's an authentication error
        if (error.response?.status === 401 || error.response?.status === 403) {
          showAlertMessage('Authentication required for admin accounts access.', 'warning');
        } else if (error.response?.status === 404) {
          showAlertMessage('Admin accounts API endpoint not found.', 'danger');
        } else {
          showAlertMessage('Failed to fetch admin accounts', 'warning');
        }
      }
    } finally {
      setLoadingAdmins(false);
    }
  };

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

  const handleDeleteStaff = async (staffId) => {
    if (demoMode) {
      showAlertMessage('Demo mode active - staff data cannot be deleted', 'warning');
      return;
    }

    const staff = staffList.find(s => s.id === staffId);
    const staffName = staff ? staff.name : 'this staff member';
    
    if (window.confirm(`Are you sure you want to delete ${staffName}? This action cannot be undone.`)) {
      try {
        const response = await apiClient.delete(USER_MANAGEMENT_ENDPOINTS.DELETE_USER(staffId));
        
        if (response.data.success) {
          showAlertMessage('Staff member deleted successfully!', 'success');
          fetchStaffMembers(); // Refresh the staff list
        } else {
          showAlertMessage(response.data.message || 'Failed to delete staff member', 'danger');
        }
      } catch (error) {
        console.error('Error deleting staff member:', error);
        showAlertMessage('Failed to delete staff member. Please try again.', 'danger');
      }
    }
  };

  const handleSaveStaff = async (formData) => {
    if (demoMode) {
      showAlertMessage('Demo mode active - staff data cannot be modified', 'warning');
      return;
    }

    try {
      if (modalType === 'add') {
        // Create new staff member via API
        const response = await apiClient.post(USER_MANAGEMENT_ENDPOINTS.CREATE_USER, {
          full_name: formData.name || '',
          email: formData.email,
          username: formData.email, // Use email as username
          password: `TempPass${Date.now()}!`, // Temporary password - user must change on first login
          role: formData.role || 'staff',
          phone_number: formData.phone || '',
          license_number: formData.licenseNumber || '',
          certification: formData.education || '',
          specialization: formData.specialization || '',
          // Profile data will be handled in the backend based on role
        });

        if (response.data.success) {
          showAlertMessage('New staff member added successfully!', 'success');
          fetchStaffMembers(); // Refresh the staff list
        } else {
          showAlertMessage(response.data.message || 'Failed to add staff member', 'danger');
        }
      } else {
        // Update existing staff member via API
        const response = await apiClient.put(USER_MANAGEMENT_ENDPOINTS.UPDATE_USER(selectedStaff.id), {
          full_name: formData.name || '',
          email: formData.email,
          role: formData.role || 'staff',
          phone_number: formData.phone || '',
          license_number: formData.licenseNumber || '',
          certification: formData.education || '',
          specialization: formData.specialization || '',
        });

        if (response.data.success) {
          showAlertMessage('Staff member updated successfully!', 'success');
          fetchStaffMembers(); // Refresh the staff list
        } else {
          showAlertMessage(response.data.message || 'Failed to update staff member', 'danger');
        }
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error saving staff member:', error);
      showAlertMessage(`Failed to ${modalType === 'add' ? 'add' : 'update'} staff member. Please try again.`, 'danger');
    }
  };

  const showAlertMessage = (message, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  // Admin management handlers
  const handleViewAdmin = (admin) => {
    setSelectedAdmin(admin);
    setAdminModalType('view');
    setShowAdminModal(true);
  };

  const handleEditAdmin = (admin) => {
    setSelectedAdmin(admin);
    setAdminModalType('edit');
    setEditAdminForm({
      first_name: admin.first_name || '',
      last_name: admin.last_name || '',
      email: admin.email || '',
      username: admin.username || '',
      is_active: admin.is_active,
      is_staff: admin.is_staff,
      is_superuser: admin.is_superuser,
      // Advanced options
      phone: admin.phone || '',
      department: admin.department || '',
      position: admin.position || '',
      hire_date: admin.hire_date || '',
      salary: admin.salary || '',
      emergency_contact: admin.emergency_contact || '',
      address: admin.address || '',
      notes: admin.notes || '',
      // Security settings
      force_password_change: false,
      send_welcome_email: false,
      account_locked: false,
      session_timeout: admin.session_timeout || 30,
      // Permissions
      can_create_users: admin.can_create_users || false,
      can_modify_permissions: admin.can_modify_permissions || false,
      can_view_reports: admin.can_view_reports || false,
      can_backup_system: admin.can_backup_system || false,
      can_manage_settings: admin.can_manage_settings || false
    });
    setShowAdminModal(true);
  };

  const handleSaveAdminChanges = async () => {
    try {
      // Make API call to update admin
      const response = await apiClient.put(USER_MANAGEMENT_ENDPOINTS.UPDATE_USER(selectedAdmin.id), {
        first_name: editAdminForm.first_name,
        last_name: editAdminForm.last_name,
        email: editAdminForm.email,
        username: editAdminForm.username,
        is_active: editAdminForm.is_active,
        is_staff: editAdminForm.is_staff,
        is_superuser: editAdminForm.is_superuser,
        phone_number: editAdminForm.phone,
        department: editAdminForm.department,
        position: editAdminForm.position,
        hire_date: editAdminForm.hire_date,
        salary: editAdminForm.salary,
        emergency_contact: editAdminForm.emergency_contact,
        address: editAdminForm.address,
        notes: editAdminForm.notes
      });
      
      if (response.data.success) {
        // Update local state after successful API call
        setAdminAccounts(prev => prev.map(admin => 
          admin.id === selectedAdmin.id 
            ? { ...admin, ...editAdminForm }
            : admin
        ));
        
        setShowAdminModal(false);
        showAlertMessage('Admin account updated successfully!', 'success');
      } else {
        showAlertMessage(response.data.message || 'Failed to update admin account', 'danger');
      }
    } catch (error) {
      console.error('Error updating admin:', error);
      showAlertMessage('Failed to update admin account. Please try again.', 'danger');
    }
  };

  const handleToggleAdminStatus = async (admin) => {
    try {
      const newStatus = !admin.is_active;
      const action = newStatus ? 'activate' : 'deactivate';
      
      if (window.confirm(`Are you sure you want to ${action} this admin account?`)) {
        // Make API call to update admin status
        const response = await apiClient.put(USER_MANAGEMENT_ENDPOINTS.UPDATE_USER(admin.id), {
          is_active: newStatus
        });
        
        if (response.data.success) {
          // Update local state after successful API call
          setAdminAccounts(prev => prev.map(a => 
            a.id === admin.id ? { ...a, is_active: newStatus } : a
          ));
          
          showAlertMessage(`Admin account ${action}d successfully!`, 'success');
        } else {
          showAlertMessage(response.data.message || `Failed to ${action} admin account`, 'danger');
        }
      }
    } catch (error) {
      console.error('Error toggling admin status:', error);
      showAlertMessage('Failed to update admin status. Please try again.', 'danger');
    }
  };

  // Advanced admin control functions
  const handleHideAdmin = (adminId) => {
    setHiddenAdmins(prev => new Set([...prev, adminId]));
    showAlertMessage('Admin account hidden from view', 'info');
  };

  const handleShowAdmin = (adminId) => {
    setHiddenAdmins(prev => {
      const newSet = new Set(prev);
      newSet.delete(adminId);
      return newSet;
    });
    showAlertMessage('Admin account restored to view', 'success');
  };

  const handleDeleteAdmin = async (adminId) => {
    try {
      const admin = adminAccounts.find(a => a.id === adminId);
      const adminName = admin?.first_name || admin?.last_name ? 
        `${admin.first_name || ''} ${admin.last_name || ''}`.trim() : 
        admin?.username || 'this admin';
        
      if (window.confirm(`Are you sure you want to permanently delete ${adminName}? This action cannot be undone.`)) {
        // Make API call to delete admin from backend
        const response = await apiClient.delete(USER_MANAGEMENT_ENDPOINTS.DELETE_USER(adminId));
        
        if (response.data.success) {
          // Update local state after successful deletion
          setAdminAccounts(prev => prev.filter(a => a.id !== adminId));
          
          // Also remove from selected admins if it was selected
          setSelectedAdmins(prev => prev.filter(id => id !== adminId));
          
          // Remove from hidden admins if it was hidden
          setHiddenAdmins(prev => {
            const newSet = new Set(prev);
            newSet.delete(adminId);
            return newSet;
          });
          
          showAlertMessage('Admin account deleted successfully!', 'success');
        } else {
          showAlertMessage(response.data.message || 'Failed to delete admin account', 'danger');
        }
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
      showAlertMessage('Failed to delete admin account. Please try again.', 'danger');
    }
  };

  const handleSelectAdmin = (adminId) => {
    setSelectedAdmins(prev => 
      prev.includes(adminId) 
        ? prev.filter(id => id !== adminId)
        : [...prev, adminId]
    );
  };

  const handleSelectAllAdmins = () => {
    const visibleAdmins = getFilteredAdmins();
    if (selectedAdmins.length === visibleAdmins.length) {
      setSelectedAdmins([]);
    } else {
      setSelectedAdmins(visibleAdmins.map(admin => admin.id));
    }
  };

  const handleBulkAction = (action) => {
    setBulkAction(action);
    setShowConfirmModal(true);
  };

  const executeBulkAction = async () => {
    try {
      const selectedCount = selectedAdmins.length;
      
      switch (bulkAction) {
        case 'activate':
          try {
            const updatePromises = selectedAdmins.map(adminId => 
              apiClient.put(USER_MANAGEMENT_ENDPOINTS.UPDATE_USER(adminId), { is_active: true })
            );
            
            const results = await Promise.allSettled(updatePromises);
            const successfulUpdates = results.filter(result => 
              result.status === 'fulfilled' && result.value.data.success
            );
            
            if (successfulUpdates.length > 0) {
              const successfulIds = results
                .map((result, index) => 
                  result.status === 'fulfilled' && result.value.data.success ? selectedAdmins[index] : null
                )
                .filter(id => id !== null);
                
              setAdminAccounts(prev => prev.map(admin => 
                successfulIds.includes(admin.id) ? { ...admin, is_active: true } : admin
              ));
              
              if (successfulUpdates.length === selectedAdmins.length) {
                showAlertMessage(`${successfulUpdates.length} admin accounts activated`, 'success');
              } else {
                showAlertMessage(`${successfulUpdates.length} of ${selectedAdmins.length} admin accounts activated. Some updates failed.`, 'warning');
              }
            } else {
              showAlertMessage('Failed to activate admin accounts. Please try again.', 'danger');
            }
          } catch (error) {
            console.error('Error activating admins:', error);
            showAlertMessage('Failed to activate admin accounts. Please try again.', 'danger');
          }
          break;
          
        case 'deactivate':
          try {
            const updatePromises = selectedAdmins.map(adminId => 
              apiClient.put(USER_MANAGEMENT_ENDPOINTS.UPDATE_USER(adminId), { is_active: false })
            );
            
            const results = await Promise.allSettled(updatePromises);
            const successfulUpdates = results.filter(result => 
              result.status === 'fulfilled' && result.value.data.success
            );
            
            if (successfulUpdates.length > 0) {
              const successfulIds = results
                .map((result, index) => 
                  result.status === 'fulfilled' && result.value.data.success ? selectedAdmins[index] : null
                )
                .filter(id => id !== null);
                
              setAdminAccounts(prev => prev.map(admin => 
                successfulIds.includes(admin.id) ? { ...admin, is_active: false } : admin
              ));
              
              if (successfulUpdates.length === selectedAdmins.length) {
                showAlertMessage(`${successfulUpdates.length} admin accounts deactivated`, 'success');
              } else {
                showAlertMessage(`${successfulUpdates.length} of ${selectedAdmins.length} admin accounts deactivated. Some updates failed.`, 'warning');
              }
            } else {
              showAlertMessage('Failed to deactivate admin accounts. Please try again.', 'danger');
            }
          } catch (error) {
            console.error('Error deactivating admins:', error);
            showAlertMessage('Failed to deactivate admin accounts. Please try again.', 'danger');
          }
          break;
          
        case 'hide':
          setHiddenAdmins(prev => new Set([...prev, ...selectedAdmins]));
          showAlertMessage(`${selectedCount} admin accounts hidden`, 'info');
          break;
          
        case 'show':
          setHiddenAdmins(prev => {
            const newSet = new Set(prev);
            selectedAdmins.forEach(id => newSet.delete(id));
            return newSet;
          });
          showAlertMessage(`${selectedCount} admin accounts restored`, 'success');
          break;
          
        case 'delete':
          // Make API calls to delete multiple admins from backend
          try {
            const deletePromises = selectedAdmins.map(adminId => 
              apiClient.delete(USER_MANAGEMENT_ENDPOINTS.DELETE_USER(adminId))
            );
            
            const results = await Promise.allSettled(deletePromises);
            const successfulDeletes = results.filter(result => 
              result.status === 'fulfilled' && result.value.data.success
            );
            
            if (successfulDeletes.length > 0) {
              // Update local state only for successfully deleted admins
              const successfulIds = results
                .map((result, index) => 
                  result.status === 'fulfilled' && result.value.data.success ? selectedAdmins[index] : null
                )
                .filter(id => id !== null);
                
              setAdminAccounts(prev => prev.filter(admin => !successfulIds.includes(admin.id)));
              setHiddenAdmins(prev => {
                const newSet = new Set(prev);
                successfulIds.forEach(id => newSet.delete(id));
                return newSet;
              });
              
              if (successfulDeletes.length === selectedAdmins.length) {
                showAlertMessage(`${successfulDeletes.length} admin accounts deleted permanently`, 'success');
              } else {
                showAlertMessage(`${successfulDeletes.length} of ${selectedAdmins.length} admin accounts deleted. Some deletions failed.`, 'warning');
              }
            } else {
              showAlertMessage('Failed to delete admin accounts. Please try again.', 'danger');
            }
          } catch (error) {
            console.error('Error deleting admins:', error);
            showAlertMessage('Failed to delete admin accounts. Please try again.', 'danger');
          }
          break;
      }
      
      setSelectedAdmins([]);
      setShowConfirmModal(false);
      setBulkAction('');
    } catch (error) {
      console.error('Error executing bulk action:', error);
      showAlertMessage('Failed to execute bulk action', 'danger');
    }
  };

  const getFilteredAdmins = () => {
    let filtered = adminAccounts;

    // Apply search filter
    if (adminSearchTerm) {
      filtered = filtered.filter(admin => 
        admin.username?.toLowerCase().includes(adminSearchTerm.toLowerCase()) ||
        admin.email?.toLowerCase().includes(adminSearchTerm.toLowerCase()) ||
        admin.first_name?.toLowerCase().includes(adminSearchTerm.toLowerCase()) ||
        admin.last_name?.toLowerCase().includes(adminSearchTerm.toLowerCase())
      );
    }

    // Apply status filter
    switch (adminFilter) {
      case 'active':
        filtered = filtered.filter(admin => admin.is_active && !hiddenAdmins.has(admin.id));
        break;
      case 'inactive':
        filtered = filtered.filter(admin => !admin.is_active && !hiddenAdmins.has(admin.id));
        break;
      case 'hidden':
        filtered = filtered.filter(admin => hiddenAdmins.has(admin.id));
        break;
      case 'all':
      default:
        filtered = filtered.filter(admin => !hiddenAdmins.has(admin.id));
        break;
    }

    return filtered;
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
            {loadingStaff ? (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  <div className="d-flex justify-content-center align-items-center">
                    <div className="spinner-border text-primary me-3" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <span className="text-muted">Loading staff members...</span>
                  </div>
                </td>
              </tr>
            ) : filteredAndSortedStaff.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-5">
                  <div className="text-muted">
                    <RiTeamLine size={48} className="mb-3 opacity-50" />
                    <h6>No Staff Members Found</h6>
                    <p className="mb-0">
                      {staffList.length === 0 
                        ? 'No staff members have been added to the system yet.'
                        : 'Try adjusting your search or filter criteria.'
                      }
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredAndSortedStaff.map(staff => (
              <tr key={staff.id}>
                <td>
                  <div className="d-flex align-items-center">
                    {getRoleIcon(staff.role)}
                    <div className="ms-2">
                      <div className="fw-bold">{staff.name}</div>
                      <small className="text-muted">{staff.email}</small>
                      {demoMode && (
                        <Badge bg="secondary" size="sm" className="ms-2">
                          Demo Data
                        </Badge>
                      )}
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
                    <Dropdown.Toggle 
                      variant="outline-secondary" 
                      size="sm"
                      disabled={demoMode}
                      title={demoMode ? "Demo mode - actions disabled" : "Available actions"}
                    >
                      Actions
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleViewStaff(staff)}>
                        <RiEyeLine size={14} className="me-2" />
                        View Details
                      </Dropdown.Item>
                      <Dropdown.Item 
                        onClick={() => handleEditStaff(staff)}
                        disabled={demoMode}
                      >
                        <RiEditLine size={14} className="me-2" />
                        Edit
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item 
                        onClick={() => handleDeleteStaff(staff.id)}
                        className="text-danger"
                        disabled={demoMode}
                      >
                        <RiDeleteBinLine size={14} className="me-2" />
                        Delete
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </tr>
              ))
            )}
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
                Staff Management System
                {demoMode && (
                  <Badge bg="warning" className="ms-3">Demo Mode</Badge>
                )}
              </h2>
              <p className="text-muted mb-0">
                {demoMode ? 
                  'Demo interface - sample data shown for testing purposes' :
                  'Production-ready staff management with real-time data integration'
                }
                {staffList.length === 0 && !loadingStaff && !demoMode && (
                  <span className="ms-2">
                    <Badge bg="info" className="ms-2">Ready for Production</Badge>
                  </span>
                )}
              </p>
              {!loadingStaff && staffList.length === 0 && !demoMode && (
                <div className="mt-2">
                  <small className="text-info">
                    <RiInformationLine size={14} className="me-1" />
                    Super admin authentication required to view and manage staff data.
                  </small>
                </div>
              )}
            </div>
            <div className="d-flex gap-2">
              <Button variant="outline-primary" onClick={() => window.location.reload()}>
                <RiRefreshLine size={16} className="me-1" />
                Refresh
              </Button>
              <Button 
                variant="primary" 
                onClick={handleAddStaff}
                disabled={demoMode}
                title={demoMode ? "Demo mode - adding staff disabled" : "Add new staff member"}
              >
                <RiAddLine size={16} className="me-1" />
                Add Staff Member
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Demo Mode Alert */}
      {demoMode && (
        <Alert variant="warning" className="mb-4 d-flex align-items-center">
          <RiInformationLine size={20} className="me-2" />
          <div>
            <strong>Demo Mode Active:</strong> This interface is displaying sample data for demonstration purposes. 
            To access real staff management features, super admin authentication is required.
          </div>
        </Alert>
      )}

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
                {staffStats.departments.length === 0 ? (
                  <Col xs={12}>
                    <div className="text-center py-5">
                      <RiGroupLine size={48} className="text-muted mb-3" />
                      <h6 className="text-muted">No Departments Available</h6>
                      <p className="text-muted mb-0">
                        Departments will appear here when staff members are added to the system.
                      </p>
                    </div>
                  </Col>
                ) : (
                  staffStats.departments.map(dept => {
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
                  })
                )}
              </Row>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="admins" title={
          <span className="d-flex align-items-center gap-2">
            <RiAdminLine size={16} />
            Admin Accounts
          </span>
        }>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-0">Admin Accounts Management</h5>
                  <small className="text-muted">Advanced controls for administrator accounts</small>
                </div>
                <div className="d-flex gap-2 align-items-center">
                  <Badge bg="info">{getFilteredAdmins().length} / {adminAccounts.length} Total</Badge>
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    onClick={() => setShowAdvancedControls(!showAdvancedControls)}
                  >
                    <RiSettings4Line size={16} className="me-1" />
                    {showAdvancedControls ? 'Hide' : 'Show'} Advanced Controls
                  </Button>
                </div>
              </div>
            </Card.Header>

            {/* Advanced Controls Panel */}
            {showAdvancedControls && (
              <Card.Header className="bg-light border-top">
                <Row className="g-3 align-items-end">
                  <Col md={3}>
                    <Form.Label className="small fw-semibold">Search Admins</Form.Label>
                    <InputGroup size="sm">
                      <Form.Control
                        type="text"
                        placeholder="Search by name, email..."
                        value={adminSearchTerm}
                        onChange={(e) => setAdminSearchTerm(e.target.value)}
                      />
                      <Button variant="outline-secondary">
                        <RiSearchLine size={14} />
                      </Button>
                    </InputGroup>
                  </Col>
                  
                  <Col md={2}>
                    <Form.Label className="small fw-semibold">Filter Status</Form.Label>
                    <Form.Select 
                      size="sm" 
                      value={adminFilter} 
                      onChange={(e) => setAdminFilter(e.target.value)}
                    >
                      <option value="all">All Visible</option>
                      <option value="active">Active Only</option>
                      <option value="inactive">Inactive Only</option>
                      <option value="hidden">Hidden Only</option>
                    </Form.Select>
                  </Col>

                  {selectedAdmins.length > 0 && (
                    <>
                      <Col md={4}>
                        <Form.Label className="small fw-semibold">Bulk Actions</Form.Label>
                        <div className="d-flex gap-1">
                          <Button 
                            variant="success" 
                            size="sm"
                            onClick={() => handleBulkAction('activate')}
                          >
                            <RiCheckLine size={14} className="me-1" />
                            Activate ({selectedAdmins.length})
                          </Button>
                          <Button 
                            variant="warning" 
                            size="sm"
                            onClick={() => handleBulkAction('deactivate')}
                          >
                            <RiLockLine size={14} className="me-1" />
                            Deactivate
                          </Button>
                        </div>
                      </Col>
                      
                      <Col md={3}>
                        <div className="d-flex gap-1">
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={() => handleBulkAction('hide')}
                          >
                            <RiEyeOffLine size={14} className="me-1" />
                            Hide
                          </Button>
                          {adminFilter === 'hidden' && (
                            <Button 
                              variant="info" 
                              size="sm"
                              onClick={() => handleBulkAction('show')}
                            >
                              <RiEyeLine size={14} className="me-1" />
                              Show
                            </Button>
                          )}
                          <Button 
                            variant="danger" 
                            size="sm"
                            onClick={() => handleBulkAction('delete')}
                            className="ms-1"
                          >
                            <RiDeleteBin2Line size={14} className="me-1" />
                            Delete
                          </Button>
                        </div>
                      </Col>
                    </>
                  )}

                  <Col md={2}>
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      onClick={() => {
                        setSelectedAdmins([]);
                        setAdminSearchTerm('');
                        setAdminFilter('all');
                      }}
                    >
                      <RiDeleteBin2Line size={14} className="me-1" />
                      Clear All
                    </Button>
                  </Col>
                </Row>
              </Card.Header>
            )}

            <Card.Body>
              {loadingAdmins ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading admin accounts...</span>
                  </div>
                  <p className="mt-2 text-muted">Loading admin accounts...</p>
                </div>
              ) : getFilteredAdmins().length === 0 ? (
                <div className="text-center py-4">
                  <RiAdminLine size={48} className="text-muted mb-3" />
                  <h6 className="text-muted">
                    {adminAccounts.length === 0 
                      ? 'No admin accounts found' 
                      : `No admins match current filter (${adminFilter})`
                    }
                  </h6>
                  <p className="text-muted mb-0">
                    {adminAccounts.length === 0 
                      ? 'System is ready for production. Admin accounts will appear here when created.'
                      : 'Try adjusting your search or filter criteria'
                    }
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover>
                    <thead className="table-light">
                      <tr>
                        <th width="40">
                          <Form.Check
                            type="checkbox"
                            checked={selectedAdmins.length === getFilteredAdmins().length && getFilteredAdmins().length > 0}
                            ref={(el) => {
                              if (el) el.indeterminate = selectedAdmins.length > 0 && selectedAdmins.length < getFilteredAdmins().length;
                            }}
                            onChange={handleSelectAllAdmins}
                          />
                        </th>
                        <th>Admin Details</th>
                        <th>Role & Permissions</th>
                        <th>Dashboard Features</th>
                        <th>Created Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredAdmins().map(admin => {
                        const isHidden = hiddenAdmins.has(admin.id);
                        const isSelected = selectedAdmins.includes(admin.id);
                        
                        return (
                          <tr key={admin.id} className={`${isHidden ? 'table-secondary' : ''} ${isSelected ? 'table-primary' : ''}`}>
                            <td>
                              <Form.Check
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleSelectAdmin(admin.id)}
                              />
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" 
                                     style={{ width: '40px', height: '40px' }}>
                                  {admin.first_name?.charAt(0) || admin.username?.charAt(0) || 'A'}
                                </div>
                                <div>
                                  <div className="fw-semibold">
                                    {admin.first_name || admin.last_name ? 
                                      `${admin.first_name || ''} ${admin.last_name || ''}`.trim() : 
                                      admin.username
                                    }
                                    {isHidden && <Badge bg="secondary" className="ms-2">Hidden</Badge>}
                                  </div>
                                  <small className="text-muted">{admin.email}</small>
                                  <br />
                                  <small className="text-muted">ID: {admin.id}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="mb-2">
                                <Badge bg={admin.is_superuser ? 'danger' : admin.is_staff ? 'warning' : 'secondary'}>
                                  {admin.is_superuser ? 'Super Admin' : admin.is_staff ? 'Staff Admin' : 'User'}
                                </Badge>
                              </div>
                              {admin.admin_permissions && Array.isArray(admin.admin_permissions) && admin.admin_permissions.length > 0 && (
                                <div>
                                  <small className="text-muted d-block">Permissions:</small>
                                  {admin.admin_permissions.slice(0, 3).map(perm => (
                                    <Badge key={perm.id} bg="light" text="dark" className="me-1 mb-1">
                                      {perm.permission_name}
                                    </Badge>
                                  ))}
                                  {admin.admin_permissions.length > 3 && (
                                    <Badge bg="light" text="dark">+{admin.admin_permissions.length - 3} more</Badge>
                                  )}
                                </div>
                              )}
                            </td>
                            <td>
                              {admin.dashboard_features && Array.isArray(admin.dashboard_features) && admin.dashboard_features.length > 0 ? (
                                <div>
                                  {admin.dashboard_features.slice(0, 2).map(feature => (
                                    <Badge key={feature.id} bg="info" className="me-1 mb-1">
                                      {feature.feature_name}
                                    </Badge>
                                  ))}
                                  {admin.dashboard_features.length > 2 && (
                                    <Badge bg="info">+{admin.dashboard_features.length - 2} more</Badge>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted">No features assigned</span>
                              )}
                            </td>
                            <td>
                              <div>{new Date(admin.date_joined).toLocaleDateString()}</div>
                              <small className="text-muted">
                                {new Date(admin.date_joined).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </small>
                              <br />
                              <small className="text-muted">
                                Created by: Super Admin
                              </small>
                            </td>
                            <td>
                              <Badge bg={admin.is_active ? 'success' : 'secondary'}>
                                {admin.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                              {admin.last_login && (
                                <div>
                                  <small className="text-muted">
                                    Last login: {new Date(admin.last_login).toLocaleDateString()}
                                  </small>
                                </div>
                              )}
                            </td>
                            <td>
                              <Dropdown>
                                <Dropdown.Toggle variant="outline-secondary" size="sm">
                                  <RiMore2Line size={14} />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <Dropdown.Item onClick={() => handleViewAdmin(admin)}>
                                    <RiEyeLine size={14} className="me-2" />
                                    View Details
                                  </Dropdown.Item>
                                  <Dropdown.Item onClick={() => handleEditAdmin(admin)}>
                                    <RiEditLine size={14} className="me-2" />
                                    Edit Admin
                                  </Dropdown.Item>
                                  <Dropdown.Divider />
                                  <Dropdown.Item 
                                    onClick={() => handleToggleAdminStatus(admin)}
                                    className={admin.is_active ? 'text-warning' : 'text-success'}
                                  >
                                    {admin.is_active ? (
                                      <>
                                        <RiLockLine size={14} className="me-2" />
                                        Deactivate
                                      </>
                                    ) : (
                                      <>
                                        <RiCheckLine size={14} className="me-2" />
                                        Activate
                                      </>
                                    )}
                                  </Dropdown.Item>
                                  <Dropdown.Divider />
                                  {isHidden ? (
                                    <Dropdown.Item 
                                      onClick={() => handleShowAdmin(admin.id)}
                                      className="text-info"
                                    >
                                      <RiEyeLine size={14} className="me-2" />
                                      Show Admin
                                    </Dropdown.Item>
                                  ) : (
                                    <Dropdown.Item 
                                      onClick={() => handleHideAdmin(admin.id)}
                                      className="text-secondary"
                                    >
                                      <RiEyeOffLine size={14} className="me-2" />
                                      Hide Admin
                                    </Dropdown.Item>
                                  )}
                                  <Dropdown.Divider />
                                  <Dropdown.Item 
                                    onClick={() => handleDeleteAdmin(admin.id)}
                                    className="text-danger"
                                  >
                                    <RiDeleteBin2Line size={14} className="me-2" />
                                    Delete Admin
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              )}
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

      {/* Admin Details/Edit Modal */}
      <Modal show={showAdminModal} onHide={() => setShowAdminModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <RiAdminLine size={24} className="me-2" />
            {adminModalType === 'view' ? 'Admin Account Details' : 'Edit Admin Account'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAdmin && (
            <Row>
              <Col md={4}>
                <div className="text-center mb-4">
                  <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3" 
                       style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                    {selectedAdmin.first_name?.charAt(0) || selectedAdmin.username?.charAt(0) || 'A'}
                  </div>
                  <h5 className="mb-1">
                    {selectedAdmin.first_name || selectedAdmin.last_name ? 
                      `${selectedAdmin.first_name || ''} ${selectedAdmin.last_name || ''}`.trim() : 
                      selectedAdmin.username
                    }
                  </h5>
                  <Badge bg={selectedAdmin.is_superuser ? 'danger' : selectedAdmin.is_staff ? 'warning' : 'secondary'} className="mb-2">
                    {selectedAdmin.is_superuser ? 'Super Admin' : selectedAdmin.is_staff ? 'Staff Admin' : 'User'}
                  </Badge>
                  <div>
                    <Badge bg={selectedAdmin.is_active ? 'success' : 'secondary'}>
                      {selectedAdmin.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </Col>
              
              <Col md={8}>
                {adminModalType === 'view' ? (
                  <div>
                    <h6 className="text-primary mb-3">
                      <RiUserLine size={16} className="me-2" />
                      Personal Information
                    </h6>
                    <Row className="mb-3">
                      <Col sm={4}><strong>Username:</strong></Col>
                      <Col sm={8}>{selectedAdmin.username}</Col>
                    </Row>
                    <Row className="mb-3">
                      <Col sm={4}><strong>Email:</strong></Col>
                      <Col sm={8}>{selectedAdmin.email}</Col>
                    </Row>
                    <Row className="mb-3">
                      <Col sm={4}><strong>First Name:</strong></Col>
                      <Col sm={8}>{selectedAdmin.first_name || 'Not provided'}</Col>
                    </Row>
                    <Row className="mb-3">
                      <Col sm={4}><strong>Last Name:</strong></Col>
                      <Col sm={8}>{selectedAdmin.last_name || 'Not provided'}</Col>
                    </Row>
                    <Row className="mb-3">
                      <Col sm={4}><strong>User ID:</strong></Col>
                      <Col sm={8}>{selectedAdmin.id}</Col>
                    </Row>
                    
                    <h6 className="text-primary mb-3 mt-4">
                      <RiCalendarLine size={16} className="me-2" />
                      Account Information
                    </h6>
                    <Row className="mb-3">
                      <Col sm={4}><strong>Date Joined:</strong></Col>
                      <Col sm={8}>{new Date(selectedAdmin.date_joined).toLocaleDateString()} at {new Date(selectedAdmin.date_joined).toLocaleTimeString()}</Col>
                    </Row>
                    <Row className="mb-3">
                      <Col sm={4}><strong>Last Login:</strong></Col>
                      <Col sm={8}>
                        {selectedAdmin.last_login 
                          ? `${new Date(selectedAdmin.last_login).toLocaleDateString()} at ${new Date(selectedAdmin.last_login).toLocaleTimeString()}`
                          : 'Never logged in'
                        }
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col sm={4}><strong>Created By:</strong></Col>
                      <Col sm={8}>Super Admin</Col>
                    </Row>
                    
                    {selectedAdmin.admin_permissions && selectedAdmin.admin_permissions.length > 0 && (
                      <>
                        <h6 className="text-primary mb-3 mt-4">
                          <RiShieldCheckLine size={16} className="me-2" />
                          Admin Permissions
                        </h6>
                        <div className="mb-3">
                          {selectedAdmin.admin_permissions.map(perm => (
                            <Badge key={perm.id} bg="light" text="dark" className="me-2 mb-2">
                              {perm.permission_name}
                            </Badge>
                          ))}
                        </div>
                      </>
                    )}
                    
                    {selectedAdmin.dashboard_features && selectedAdmin.dashboard_features.length > 0 && (
                      <>
                        <h6 className="text-primary mb-3 mt-4">
                          <RiBarChartLine size={16} className="me-2" />
                          Dashboard Features
                        </h6>
                        <div className="mb-3">
                          {selectedAdmin.dashboard_features.map(feature => (
                            <Badge key={feature.id} bg="info" className="me-2 mb-2">
                              {feature.feature_name}
                            </Badge>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div>
                    <h6 className="text-primary mb-3">
                      <RiEditLine size={16} className="me-2" />
                      Edit Admin Account - Advanced Options
                    </h6>
                    
                    {/* Edit Tabs */}
                    <Tabs activeKey={activeEditTab} onSelect={setActiveEditTab} className="mb-4">
                      <Tab eventKey="basic" title={
                        <span className="d-flex align-items-center gap-2">
                          <RiUserLine size={14} />
                          Basic Info
                        </span>
                      }>
                        <Form>
                          <Row className="mb-3">
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={editAdminForm.first_name}
                                  onChange={(e) => setEditAdminForm(prev => ({...prev, first_name: e.target.value}))}
                                  placeholder="Enter first name"
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={editAdminForm.last_name}
                                  onChange={(e) => setEditAdminForm(prev => ({...prev, last_name: e.target.value}))}
                                  placeholder="Enter last name"
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          
                          <Row className="mb-3">
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={editAdminForm.username}
                                  onChange={(e) => setEditAdminForm(prev => ({...prev, username: e.target.value}))}
                                  placeholder="Enter username"
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                  type="email"
                                  value={editAdminForm.email}
                                  onChange={(e) => setEditAdminForm(prev => ({...prev, email: e.target.value}))}
                                  placeholder="Enter email address"
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          
                          <Row className="mb-3">
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label>Phone</Form.Label>
                                <Form.Control
                                  type="tel"
                                  value={editAdminForm.phone}
                                  onChange={(e) => setEditAdminForm(prev => ({...prev, phone: e.target.value}))}
                                  placeholder="Enter phone number"
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label>Department</Form.Label>
                                <Form.Select
                                  value={editAdminForm.department}
                                  onChange={(e) => setEditAdminForm(prev => ({...prev, department: e.target.value}))}
                                >
                                  <option value="">Select Department</option>
                                  <option value="Administration">Administration</option>
                                  <option value="IT">IT Department</option>
                                  <option value="Human Resources">Human Resources</option>
                                  <option value="Finance">Finance</option>
                                  <option value="Operations">Operations</option>
                                  <option value="Security">Security</option>
                                </Form.Select>
                              </Form.Group>
                            </Col>
                          </Row>
                          
                          <Row className="mb-3">
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label>Position/Title</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={editAdminForm.position}
                                  onChange={(e) => setEditAdminForm(prev => ({...prev, position: e.target.value}))}
                                  placeholder="Enter job position"
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label>Hire Date</Form.Label>
                                <Form.Control
                                  type="date"
                                  value={editAdminForm.hire_date}
                                  onChange={(e) => setEditAdminForm(prev => ({...prev, hire_date: e.target.value}))}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          
                          <Form.Group className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={2}
                              value={editAdminForm.address}
                              onChange={(e) => setEditAdminForm(prev => ({...prev, address: e.target.value}))}
                              placeholder="Enter full address"
                            />
                          </Form.Group>
                          
                          <Form.Group className="mb-3">
                            <Form.Label>Emergency Contact</Form.Label>
                            <Form.Control
                              type="text"
                              value={editAdminForm.emergency_contact}
                              onChange={(e) => setEditAdminForm(prev => ({...prev, emergency_contact: e.target.value}))}
                              placeholder="Emergency contact name and phone"
                            />
                          </Form.Group>
                        </Form>
                      </Tab>
                      
                      <Tab eventKey="permissions" title={
                        <span className="d-flex align-items-center gap-2">
                          <RiShieldCheckLine size={14} />
                          Permissions
                        </span>
                      }>
                        <Form>
                          <h6 className="text-primary mb-3">Account Status</h6>
                          <Row className="mb-4">
                            <Col md={4}>
                              <Form.Check
                                type="checkbox"
                                label="Active Account"
                                checked={editAdminForm.is_active}
                                onChange={(e) => setEditAdminForm(prev => ({...prev, is_active: e.target.checked}))}
                              />
                            </Col>
                            <Col md={4}>
                              <Form.Check
                                type="checkbox"
                                label="Staff Access"
                                checked={editAdminForm.is_staff}
                                onChange={(e) => setEditAdminForm(prev => ({...prev, is_staff: e.target.checked}))}
                              />
                            </Col>
                            <Col md={4}>
                              <Form.Check
                                type="checkbox"
                                label="Super Admin"
                                checked={editAdminForm.is_superuser}
                                onChange={(e) => setEditAdminForm(prev => ({...prev, is_superuser: e.target.checked}))}
                              />
                            </Col>
                          </Row>
                          
                          <h6 className="text-primary mb-3">System Permissions</h6>
                          <Row className="mb-3">
                            <Col md={6}>
                              <Form.Check
                                type="checkbox"
                                label="Can Create Users"
                                checked={editAdminForm.can_create_users}
                                onChange={(e) => setEditAdminForm(prev => ({...prev, can_create_users: e.target.checked}))}
                              />
                            </Col>
                            <Col md={6}>
                              <Form.Check
                                type="checkbox"
                                label="Can Modify Permissions"
                                checked={editAdminForm.can_modify_permissions}
                                onChange={(e) => setEditAdminForm(prev => ({...prev, can_modify_permissions: e.target.checked}))}
                              />
                            </Col>
                          </Row>
                          
                          <Row className="mb-3">
                            <Col md={6}>
                              <Form.Check
                                type="checkbox"
                                label="Can View Reports"
                                checked={editAdminForm.can_view_reports}
                                onChange={(e) => setEditAdminForm(prev => ({...prev, can_view_reports: e.target.checked}))}
                              />
                            </Col>
                            <Col md={6}>
                              <Form.Check
                                type="checkbox"
                                label="Can Backup System"
                                checked={editAdminForm.can_backup_system}
                                onChange={(e) => setEditAdminForm(prev => ({...prev, can_backup_system: e.target.checked}))}
                              />
                            </Col>
                          </Row>
                          
                          <Row className="mb-3">
                            <Col md={6}>
                              <Form.Check
                                type="checkbox"
                                label="Can Manage Settings"
                                checked={editAdminForm.can_manage_settings}
                                onChange={(e) => setEditAdminForm(prev => ({...prev, can_manage_settings: e.target.checked}))}
                              />
                            </Col>
                          </Row>
                          
                          <div className="alert alert-warning">
                            <RiShieldCheckLine size={16} className="me-2" />
                            <strong>Warning:</strong> Changing admin permissions may affect system access and security.
                          </div>
                        </Form>
                      </Tab>
                      
                      <Tab eventKey="security" title={
                        <span className="d-flex align-items-center gap-2">
                          <RiLockLine size={14} />
                          Security
                        </span>
                      }>
                        <Form>
                          <h6 className="text-primary mb-3">Security Settings</h6>
                          
                          <Row className="mb-3">
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label>Session Timeout (minutes)</Form.Label>
                                <Form.Select
                                  value={editAdminForm.session_timeout}
                                  onChange={(e) => setEditAdminForm(prev => ({...prev, session_timeout: e.target.value}))}
                                >
                                  <option value="15">15 minutes</option>
                                  <option value="30">30 minutes</option>
                                  <option value="60">1 hour</option>
                                  <option value="120">2 hours</option>
                                  <option value="240">4 hours</option>
                                  <option value="480">8 hours</option>
                                </Form.Select>
                              </Form.Group>
                            </Col>
                          </Row>
                          
                          <h6 className="text-primary mb-3">Account Actions</h6>
                          <Row className="mb-3">
                            <Col md={6}>
                              <Form.Check
                                type="checkbox"
                                label="Force Password Change on Next Login"
                                checked={editAdminForm.force_password_change}
                                onChange={(e) => setEditAdminForm(prev => ({...prev, force_password_change: e.target.checked}))}
                              />
                            </Col>
                            <Col md={6}>
                              <Form.Check
                                type="checkbox"
                                label="Send Welcome Email"
                                checked={editAdminForm.send_welcome_email}
                                onChange={(e) => setEditAdminForm(prev => ({...prev, send_welcome_email: e.target.checked}))}
                              />
                            </Col>
                          </Row>
                          
                          <Row className="mb-3">
                            <Col md={6}>
                              <Form.Check
                                type="checkbox"
                                label="Account Locked"
                                checked={editAdminForm.account_locked}
                                onChange={(e) => setEditAdminForm(prev => ({...prev, account_locked: e.target.checked}))}
                              />
                            </Col>
                          </Row>
                          
                          <div className="alert alert-info">
                            <RiSettings4Line size={16} className="me-2" />
                            <strong>Security Note:</strong> These settings control admin access and security policies.
                          </div>
                        </Form>
                      </Tab>
                      
                      <Tab eventKey="additional" title={
                        <span className="d-flex align-items-center gap-2">
                          <RiSettings3Line size={14} />
                          Additional
                        </span>
                      }>
                        <Form>
                          <Row className="mb-3">
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label>Salary/Compensation</Form.Label>
                                <InputGroup>
                                  <InputGroup.Text>$</InputGroup.Text>
                                  <Form.Control
                                    type="number"
                                    value={editAdminForm.salary}
                                    onChange={(e) => setEditAdminForm(prev => ({...prev, salary: e.target.value}))}
                                    placeholder="Enter salary amount"
                                  />
                                </InputGroup>
                              </Form.Group>
                            </Col>
                          </Row>
                          
                          <Form.Group className="mb-3">
                            <Form.Label>Notes & Comments</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={4}
                              value={editAdminForm.notes}
                              onChange={(e) => setEditAdminForm(prev => ({...prev, notes: e.target.value}))}
                              placeholder="Add any additional notes or comments about this admin account"
                            />
                          </Form.Group>
                          
                          <div className="alert alert-secondary">
                            <RiBookLine size={16} className="me-2" />
                            <strong>Additional Information:</strong> Use this section for any extra details or special instructions.
                          </div>
                        </Form>
                      </Tab>
                    </Tabs>
                  </div>
                )}
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          {adminModalType === 'view' ? (
            <>
              <Button variant="secondary" onClick={() => setShowAdminModal(false)}>
                <RiCloseLine size={16} className="me-1" />
                Close
              </Button>
              <Button variant="primary" onClick={() => {
                setAdminModalType('edit');
                setActiveEditTab('basic');
                setEditAdminForm({
                  first_name: selectedAdmin.first_name || '',
                  last_name: selectedAdmin.last_name || '',
                  email: selectedAdmin.email || '',
                  username: selectedAdmin.username || '',
                  is_active: selectedAdmin.is_active,
                  is_staff: selectedAdmin.is_staff,
                  is_superuser: selectedAdmin.is_superuser,
                  // Advanced options
                  phone: selectedAdmin.phone || '',
                  department: selectedAdmin.department || '',
                  position: selectedAdmin.position || '',
                  hire_date: selectedAdmin.hire_date || '',
                  salary: selectedAdmin.salary || '',
                  emergency_contact: selectedAdmin.emergency_contact || '',
                  address: selectedAdmin.address || '',
                  notes: selectedAdmin.notes || '',
                  // Security settings
                  force_password_change: false,
                  send_welcome_email: false,
                  account_locked: false,
                  session_timeout: selectedAdmin.session_timeout || 30,
                  // Permissions
                  can_create_users: selectedAdmin.can_create_users || false,
                  can_modify_permissions: selectedAdmin.can_modify_permissions || false,
                  can_view_reports: selectedAdmin.can_view_reports || false,
                  can_backup_system: selectedAdmin.can_backup_system || false,
                  can_manage_settings: selectedAdmin.can_manage_settings || false
                });
              }}>
                <RiEditLine size={16} className="me-1" />
                Edit Admin
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setShowAdminModal(false)}>
                <RiCloseLine size={16} className="me-1" />
                Cancel
              </Button>
              <Button variant="outline-info" onClick={() => setAdminModalType('view')}>
                <RiEyeLine size={16} className="me-1" />
                View Only
              </Button>
              <Button variant="primary" onClick={handleSaveAdminChanges}>
                <RiCheckLine size={16} className="me-1" />
                Save Changes
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      {/* Bulk Action Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <RiShieldCheckLine size={24} className="me-2 text-warning" />
            Confirm Bulk Action
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <div className="mb-3">
              <Badge bg="primary" className="px-3 py-2 fs-6">
                {selectedAdmins.length} admin account{selectedAdmins.length !== 1 ? 's' : ''} selected
              </Badge>
            </div>
            <p className="fs-5 mb-3">
              Are you sure you want to <strong className="text-primary">{bulkAction}</strong> the selected admin accounts?
            </p>
            <div className="alert alert-warning">
              <RiShieldCheckLine size={16} className="me-2" />
              This action will affect {selectedAdmins.length} admin account{selectedAdmins.length !== 1 ? 's' : ''} and cannot be easily undone.
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            <RiCloseLine size={16} className="me-1" />
            Cancel
          </Button>
          <Button 
            variant={bulkAction === 'deactivate' ? 'warning' : 'primary'} 
            onClick={executeBulkAction}
          >
            <RiCheckLine size={16} className="me-1" />
            Confirm {bulkAction}
          </Button>
        </Modal.Footer>
      </Modal>

      <StaffModal />
    </Container>
  );
};

export default StaffManagement;
