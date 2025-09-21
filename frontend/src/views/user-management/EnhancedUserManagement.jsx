/**
 * Enhanced User Management System
 * Super Admin interface for managing admin users and comprehensive user management
 * Features: Dynamic Module Permissions, Advanced User Management, Permission Testing
 */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import apiClient from '../../services/api';
import { USER_MANAGEMENT_ENDPOINTS, AUTH_ENDPOINTS } from '../../services/apiConstants';
import { HEALTHCARE_MODULES, ADMIN_FEATURES, getAllModules } from '../../utils/modulePermissions';
import { usePermissions } from '../../contexts/PermissionContext';

const EnhancedUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [statistics, setStatistics] = useState({});
    
    // Modal and form states
    const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
    const [showCreateUserModal, setShowCreateUserModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    
    // Pagination and filtering
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortBy, setSortBy] = useState('-date_joined');
    
    // Form data
    const [adminFormData, setAdminFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        phone_number: '',
        license_number: '',
        certification: '',
        specialization: '',
        department: 'Administration',
        position: 'Administrator'
    });
    
    const [userFormData, setUserFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        role: 'patient',
        phone_number: '',
        license_number: '',
        certification: '',
        specialization: '',
        department: '',
        position: '',
        is_active: true,
        is_verified: true
    });

    // Module Permission Management State
    const [selectedUserPermissions, setSelectedUserPermissions] = useState([]);
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [permissionTestResults, setPermissionTestResults] = useState(null);
    const [availableModules] = useState(getAllModules());
    
    // Get permissions context
    const { 
        canCreateAdmins, 
        isSuperAdmin, 
        canAccessUserManagement,
        permissions: currentUserPermissions 
    } = usePermissions();

    useEffect(() => {
        fetchCurrentUser();
        fetchUsers();
        fetchStatistics();
    }, [currentPage, searchTerm, roleFilter, statusFilter, sortBy]);

    const fetchCurrentUser = async () => {
        try {
            const response = await apiClient.get(AUTH_ENDPOINTS.PROFILE, {
                withCredentials: true
            });
            setCurrentUser(response.data.user);
        } catch (error) {
            console.error('Failed to fetch current user:', error);
            setError('Authentication required. Please log in to access user management.');
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage,
                limit: 10,
                search: searchTerm,
                role: roleFilter,
                status: statusFilter,
                sort_by: sortBy
            });

            const response = await apiClient.get(`${USER_MANAGEMENT_ENDPOINTS.LIST_USERS}?${params}`, {
                withCredentials: true
            });

            if (response.data.success) {
                setUsers(response.data.users);
                setTotalPages(response.data.pagination.total_pages);
            } else {
                setError(response.data.error || 'Failed to fetch users');
            }
        } catch (error) {
            setError('Failed to fetch users: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    const fetchStatistics = async () => {
        try {
            const response = await apiClient.get(USER_MANAGEMENT_ENDPOINTS.STATISTICS, {
                withCredentials: true
            });

            if (response.data.success) {
                setStatistics(response.data.statistics);
            }
        } catch (error) {
            console.error('Failed to fetch statistics:', error);
        }
    };

    const createAdminUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await apiClient.post(USER_MANAGEMENT_ENDPOINTS.CREATE_ADMIN, adminFormData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                setSuccess('Admin user created successfully!');
                setAdminFormData({
                    email: '',
                    password: '',
                    full_name: '',
                    phone_number: '',
                    license_number: '',
                    certification: '',
                    specialization: '',
                    department: 'Administration',
                    position: 'Administrator'
                });
                setShowCreateAdminModal(false);
                fetchUsers();
                fetchStatistics();
            } else {
                setError(response.data.error || 'Failed to create admin user');
            }
        } catch (error) {
            setError('Failed to create admin user: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    const createUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await apiClient.post(USER_MANAGEMENT_ENDPOINTS.CREATE_USER, userFormData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                setSuccess(`${userFormData.role.charAt(0).toUpperCase() + userFormData.role.slice(1)} user created successfully!`);
                setUserFormData({
                    email: '',
                    password: '',
                    full_name: '',
                    role: 'patient',
                    phone_number: '',
                    license_number: '',
                    certification: '',
                    specialization: '',
                    department: '',
                    position: '',
                    is_active: true,
                    is_verified: true
                });
                setShowCreateUserModal(false);
                fetchUsers();
                fetchStatistics();
            } else {
                setError(response.data.error || 'Failed to create user');
            }
        } catch (error) {
            setError('Failed to create user: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (userId, updateData) => {
        setLoading(true);
        try {
            const response = await apiClient.put(`/hospital/management/users/${userId}/update/`, updateData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                setSuccess('User updated successfully!');
                fetchUsers();
                setShowEditModal(false);
            } else {
                setError(response.data.error || 'Failed to update user');
            }
        } catch (error) {
            setError('Failed to update user: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (userId, userEmail) => {
        if (!confirm(`Are you sure you want to delete user "${userEmail}"? This action cannot be undone.`)) {
            return;
        }

        setLoading(true);
        try {
            const response = await apiClient.delete(`/hospital/management/users/${userId}/delete/`, {
                withCredentials: true
            });

            if (response.data.success) {
                setSuccess('User deleted successfully!');
                fetchUsers();
                fetchStatistics();
            } else {
                setError(response.data.error || 'Failed to delete user');
            }
        } catch (error) {
            setError('Failed to delete user: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    const viewUserDetails = async (userId) => {
        try {
            const response = await apiClient.get(`/hospital/management/users/${userId}/`, {
                withCredentials: true
            });

            if (response.data.success) {
                setSelectedUser(response.data.user);
                setShowDetailsModal(true);
            } else {
                setError(response.data.error || 'Failed to fetch user details');
            }
        } catch (error) {
            setError('Failed to fetch user details: ' + (error.response?.data?.error || error.message));
        }
    };

    // Module Permission Management Functions
    const manageUserPermissions = async (userId) => {
        try {
            const response = await apiClient.get(`/hospital/management/users/${userId}/permissions/`, {
                withCredentials: true
            });

            if (response.data.success) {
                setSelectedUserPermissions(response.data.permissions || []);
                setSelectedUser(users.find(u => u.id === userId));
                setShowPermissionModal(true);
            } else {
                setError('Failed to load user permissions');
            }
        } catch (error) {
            setError('Failed to load permissions: ' + (error.response?.data?.error || error.message));
        }
    };

    const updateUserPermissions = async (userId, permissions) => {
        setLoading(true);
        try {
            const response = await apiClient.post(`/hospital/management/users/${userId}/permissions/`, {
                permissions: permissions
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                setSuccess('User permissions updated successfully!');
                setShowPermissionModal(false);
                fetchUsers();
            } else {
                setError(response.data.error || 'Failed to update permissions');
            }
        } catch (error) {
            setError('Failed to update permissions: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    const testUserPermissions = async (userId) => {
        try {
            const response = await apiClient.get(`/hospital/management/users/${userId}/permission-test/`, {
                withCredentials: true
            });

            if (response.data.success) {
                setPermissionTestResults(response.data.results);
                setSelectedUser(users.find(u => u.id === userId));
            } else {
                setError('Failed to test user permissions');
            }
        } catch (error) {
            setError('Failed to test permissions: ' + (error.response?.data?.error || error.message));
        }
    };

    const generatePermissionReport = async () => {
        try {
            const response = await apiClient.get('/hospital/management/permissions/report/', {
                withCredentials: true
            });

            if (response.data.success) {
                // Create and download the report
                const blob = new Blob([JSON.stringify(response.data.report, null, 2)], {
                    type: 'application/json'
                });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `permission-report-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                setSuccess('Permission report generated successfully!');
            }
        } catch (error) {
            setError('Failed to generate permission report: ' + (error.response?.data?.error || error.message));
        }
    };

    const bulkUpdatePermissions = async (userIds, permissions) => {
        setLoading(true);
        try {
            const response = await apiClient.post('/hospital/management/users/bulk-permissions/', {
                user_ids: userIds,
                permissions: permissions
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                setSuccess(`Permissions updated for ${userIds.length} users successfully!`);
                fetchUsers();
            } else {
                setError(response.data.error || 'Failed to update bulk permissions');
            }
        } catch (error) {
            setError('Failed to update bulk permissions: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    const getRoleColor = (role) => {
        const colors = {
            super_admin: 'danger',
            admin: 'warning',
            doctor: 'success',
            nurse: 'info',
            patient: 'secondary',
            pharmacist: 'primary'
        };
        return colors[role] || 'secondary';
    };

    const getStatusColor = (isActive, isVerified) => {
        if (isActive && isVerified) return 'success';
        if (isActive && !isVerified) return 'warning';
        return 'danger';
    };

    const getStatusText = (isActive, isVerified) => {
        if (isActive && isVerified) return 'Active & Verified';
        if (isActive && !isVerified) return 'Active (Unverified)';
        return 'Inactive';
    };

    // Authentication and authorization check
    if (!currentUser) {
        return (
            <div className="container-fluid py-4">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card shadow">
                            <div className="card-header bg-warning text-dark">
                                <h5 className="mb-0">
                                    <i className="fas fa-lock me-2"></i>
                                    Authentication Required
                                </h5>
                            </div>
                            <div className="card-body text-center">
                                <i className="fas fa-user-shield fa-3x text-muted mb-3"></i>
                                <h6>Access Restricted</h6>
                                <p className="text-muted">
                                    You must be logged in as an administrator to access the user management system.
                                </p>
                                <a href="/login" className="btn btn-primary">
                                    <i className="fas fa-sign-in-alt me-2"></i>
                                    Go to Login
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Role-based access control
    if (!['admin', 'super_admin'].includes(currentUser.role)) {
        return (
            <div className="container-fluid py-4">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card shadow">
                            <div className="card-header bg-danger text-white">
                                <h5 className="mb-0">
                                    <i className="fas fa-ban me-2"></i>
                                    Access Denied
                                </h5>
                            </div>
                            <div className="card-body text-center">
                                <i className="fas fa-user-times fa-3x text-muted mb-3"></i>
                                <h6>Insufficient Privileges</h6>
                                <p className="text-muted">
                                    Only administrators can access the user management system.
                                    <br />
                                    Your current role: <span className="badge bg-secondary">{currentUser.role}</span>
                                </p>
                                <a href="/dashboard" className="btn btn-primary">
                                    <i className="fas fa-arrow-left me-2"></i>
                                    Back to Dashboard
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">
                                    <i className="fas fa-users-cog me-2"></i>
                                    User Management System
                                </h5>
                                <span className="badge bg-light text-dark">
                                    Role: {currentUser?.role?.replace('_', ' ').toUpperCase()}
                                </span>
                            </div>
                        </div>

                        {/* Statistics Cards */}
                        <div className="card-body">
                            <div className="row mb-4">
                                <div className="col-md-3">
                                    <div className="card bg-primary text-white">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between">
                                                <div>
                                                    <h5>{statistics.total_users || 0}</h5>
                                                    <small>Total Users</small>
                                                </div>
                                                <i className="fas fa-users fa-2x opacity-75"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="card bg-success text-white">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between">
                                                <div>
                                                    <h5>{statistics.active_users || 0}</h5>
                                                    <small>Active Users</small>
                                                </div>
                                                <i className="fas fa-user-check fa-2x opacity-75"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="card bg-warning text-white">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between">
                                                <div>
                                                    <h5>{statistics.staff_users || 0}</h5>
                                                    <small>Staff Users</small>
                                                </div>
                                                <i className="fas fa-user-tie fa-2x opacity-75"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="card bg-info text-white">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between">
                                                <div>
                                                    <h5>{statistics.activity_rate || 0}%</h5>
                                                    <small>Activity Rate</small>
                                                </div>
                                                <i className="fas fa-chart-line fa-2x opacity-75"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Alert Messages */}
                            {error && (
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    <i className="fas fa-exclamation-triangle me-2"></i>
                                    {error}
                                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                                </div>
                            )}

                            {success && (
                                <div className="alert alert-success alert-dismissible fade show" role="alert">
                                    <i className="fas fa-check-circle me-2"></i>
                                    {success}
                                    <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
                                </div>
                            )}

                            {/* Advanced Permission Management Features */}
                            <div className="row mb-4">
                                <div className="col-md-12">
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-header bg-gradient bg-primary text-white">
                                            <h5 className="mb-0">
                                                <i className="fas fa-shield-alt me-2"></i>
                                                Advanced Permission Management System
                                            </h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <h6 className="text-primary">
                                                        <i className="fas fa-hospital me-2"></i>
                                                        Healthcare Modules Available
                                                    </h6>
                                                    <div className="d-flex flex-wrap gap-2 mb-3">
                                                        {Object.keys(HEALTHCARE_MODULES).map(module => (
                                                            <span key={module} className="badge bg-info">
                                                                {HEALTHCARE_MODULES[module].name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <h6 className="text-success">
                                                        <i className="fas fa-cogs me-2"></i>
                                                        Admin Features Available
                                                    </h6>
                                                    <div className="d-flex flex-wrap gap-2 mb-3">
                                                        {Object.keys(ADMIN_FEATURES).map(feature => (
                                                            <span key={feature} className="badge bg-warning">
                                                                {ADMIN_FEATURES[feature].name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <h6 className="text-danger">
                                                        <i className="fas fa-tools me-2"></i>
                                                        Permission Management Actions
                                                    </h6>
                                                    <div className="d-flex gap-2 flex-wrap">
                                                        <button
                                                            className="btn btn-outline-primary btn-sm"
                                                            onClick={generatePermissionReport}
                                                            disabled={loading}
                                                        >
                                                            <i className="fas fa-download me-1"></i>
                                                            Generate Report
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-success btn-sm"
                                                            onClick={() => {
                                                                const testUsers = users.slice(0, 3);
                                                                if (testUsers.length > 0) {
                                                                    testUserPermissions(testUsers[0].id);
                                                                }
                                                            }}
                                                            disabled={loading || users.length === 0}
                                                        >
                                                            <i className="fas fa-vial me-1"></i>
                                                            Test Permissions
                                                        </button>
                                                        <span className="badge bg-light text-dark align-self-center">
                                                            Dynamic permission system with {Object.keys(HEALTHCARE_MODULES).length + Object.keys(ADMIN_FEATURES).length} modules
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="row mb-4">
                                <div className="col-md-12">
                                    {currentUser?.role === 'super_admin' && (
                                        <div className="alert alert-info mb-3">
                                            <div className="d-flex align-items-center">
                                                <i className="fas fa-info-circle me-2"></i>
                                                <strong>Super Admin Privileges:</strong> You can create admin users with elevated permissions and manage all system users.
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="d-flex gap-2 flex-wrap">
                                        {currentUser?.role === 'super_admin' && (
                                            <button
                                                className="btn btn-danger btn-lg"
                                                onClick={() => setShowCreateAdminModal(true)}
                                                style={{
                                                    background: 'linear-gradient(45deg, #dc3545, #c82333)',
                                                    border: 'none',
                                                    boxShadow: '0 4px 15px rgba(220, 53, 69, 0.3)'
                                                }}
                                            >
                                                <i className="fas fa-user-shield me-2"></i>
                                                Create Admin User
                                            </button>
                                        )}
                                        
                                        {(currentUser?.role === 'super_admin' || currentUser?.role === 'admin') && (
                                            <button
                                                className="btn btn-primary btn-lg"
                                                onClick={() => setShowCreateUserModal(true)}
                                                style={{
                                                    background: 'linear-gradient(45deg, #007bff, #0056b3)',
                                                    border: 'none',
                                                    boxShadow: '0 4px 15px rgba(0, 123, 255, 0.3)'
                                                }}
                                            >
                                                <i className="fas fa-user-plus me-2"></i>
                                                Create User
                                            </button>
                                        )}
                                        
                                        <button
                                            className="btn btn-outline-primary"
                                            onClick={fetchUsers}
                                            disabled={loading}
                                        >
                                            <i className="fas fa-sync-alt me-2"></i>
                                            Refresh
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Filters and Search */}
                            <div className="row mb-4">
                                <div className="col-md-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search users..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-2">
                                    <select
                                        className="form-select"
                                        value={roleFilter}
                                        onChange={(e) => setRoleFilter(e.target.value)}
                                    >
                                        <option value="">All Roles</option>
                                        <option value="super_admin">Super Admin</option>
                                        <option value="admin">Admin</option>
                                        <option value="doctor">Doctor</option>
                                        <option value="nurse">Nurse</option>
                                        <option value="patient">Patient</option>
                                        <option value="pharmacist">Pharmacist</option>
                                    </select>
                                </div>
                                <div className="col-md-2">
                                    <select
                                        className="form-select"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                    >
                                        <option value="">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="verified">Verified</option>
                                        <option value="unverified">Unverified</option>
                                    </select>
                                </div>
                                <div className="col-md-2">
                                    <select
                                        className="form-select"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option value="-date_joined">Newest First</option>
                                        <option value="date_joined">Oldest First</option>
                                        <option value="full_name">Name A-Z</option>
                                        <option value="-full_name">Name Z-A</option>
                                        <option value="role">Role</option>
                                    </select>
                                </div>
                            </div>

                            {/* Users Table */}
                            <div className="table-responsive">
                                <table className="table table-striped table-hover">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>User Info</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th>Contact</th>
                                            <th>Joined</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="6" className="text-center py-4">
                                                    <div className="spinner-border text-primary" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : users.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="text-center py-4 text-muted">
                                                    No users found
                                                </td>
                                            </tr>
                                        ) : (
                                            users.map(user => (
                                                <tr key={user.id}>
                                                    <td>
                                                        <div>
                                                            <strong>{user.full_name}</strong>
                                                            <br />
                                                            <small className="text-muted">{user.email}</small>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className={`badge bg-${getRoleColor(user.role)}`}>
                                                            {user.role ? user.role.replace('_', ' ').toUpperCase() : 'UNKNOWN'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`badge bg-${getStatusColor(user.is_active, user.is_verified)}`}>
                                                            {getStatusText(user.is_active, user.is_verified)}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <small>{user.phone_number || 'N/A'}</small>
                                                    </td>
                                                    <td>
                                                        <small>{new Date(user.date_joined).toLocaleDateString()}</small>
                                                    </td>
                                                    <td>
                                                        <div className="btn-group btn-group-sm">
                                                            <button
                                                                className="btn btn-outline-info"
                                                                onClick={() => viewUserDetails(user.id)}
                                                                title="View Details"
                                                            >
                                                                <i className="fas fa-eye"></i>
                                                            </button>
                                                            
                                                            {/* Permission Management Buttons */}
                                                            <button
                                                                className="btn btn-outline-primary"
                                                                onClick={() => manageUserPermissions(user.id)}
                                                                title="Manage Permissions"
                                                            >
                                                                <i className="fas fa-shield-alt"></i>
                                                            </button>
                                                            
                                                            <button
                                                                className="btn btn-outline-success"
                                                                onClick={() => testUserPermissions(user.id)}
                                                                title="Test Permissions"
                                                            >
                                                                <i className="fas fa-vial"></i>
                                                            </button>
                                                            
                                                            {(currentUser?.role === 'super_admin' || 
                                                             (currentUser?.role === 'admin' && !['admin', 'super_admin'].includes(user.role))) && (
                                                                <>
                                                                    <button
                                                                        className="btn btn-outline-warning"
                                                                        onClick={() => {
                                                                            setSelectedUser(user);
                                                                            setShowEditModal(true);
                                                                        }}
                                                                        title="Edit User"
                                                                    >
                                                                        <i className="fas fa-edit"></i>
                                                                    </button>
                                                                    
                                                                    {currentUser?.role === 'super_admin' && user.id !== currentUser.id && (
                                                                        <button
                                                                            className="btn btn-outline-danger"
                                                                            onClick={() => deleteUser(user.id, user.email)}
                                                                            title="Delete User"
                                                                        >
                                                                            <i className="fas fa-trash"></i>
                                                                        </button>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <nav>
                                    <ul className="pagination justify-content-center">
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => setCurrentPage(currentPage - 1)}
                                                disabled={currentPage === 1}
                                            >
                                                Previous
                                            </button>
                                        </li>
                                        
                                        {[...Array(totalPages)].map((_, index) => (
                                            <li
                                                key={index + 1}
                                                className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                                            >
                                                <button
                                                    className="page-link"
                                                    onClick={() => setCurrentPage(index + 1)}
                                                >
                                                    {index + 1}
                                                </button>
                                            </li>
                                        ))}
                                        
                                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => setCurrentPage(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                            >
                                                Next
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Admin User Modal */}
            {showCreateAdminModal && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-danger text-white">
                                <h5 className="modal-title">
                                    <i className="fas fa-user-shield me-2"></i>
                                    Create Admin User
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowCreateAdminModal(false)}
                                ></button>
                            </div>
                            <form onSubmit={createAdminUser}>
                                <div className="modal-body">
                                    <div className="alert alert-warning">
                                        <i className="fas fa-exclamation-triangle me-2"></i>
                                        <strong>Creating Admin User:</strong> This user will have administrative privileges to manage other users (except super admins).
                                    </div>
                                    
                                    <div className="alert alert-info">
                                        <strong>Admin Permissions Include:</strong>
                                        <ul className="mb-0 mt-2">
                                            <li>Create and manage doctors, nurses, patients, and pharmacists</li>
                                            <li>View and edit user profiles and permissions</li>
                                            <li>Access administrative dashboards and reports</li>
                                            <li>Manage hospital departments and staff</li>
                                        </ul>
                                    </div>
                                    
                                    <h6 className="border-bottom pb-2 mb-3">
                                        <i className="fas fa-user-info me-2"></i>Basic Information
                                    </h6>
                                    
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    <i className="fas fa-envelope me-1"></i>Email Address *
                                                </label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    value={adminFormData.email}
                                                    onChange={(e) => setAdminFormData({...adminFormData, email: e.target.value})}
                                                    required
                                                    placeholder="admin@hospital.com"
                                                />
                                                <small className="text-muted">This will be used for login</small>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    <i className="fas fa-user me-1"></i>Full Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={adminFormData.full_name}
                                                    onChange={(e) => setAdminFormData({...adminFormData, full_name: e.target.value})}
                                                    required
                                                    placeholder="John Smith"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    <i className="fas fa-lock me-1"></i>Password *
                                                </label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    value={adminFormData.password}
                                                    onChange={(e) => setAdminFormData({...adminFormData, password: e.target.value})}
                                                    required
                                                    minLength="8"
                                                    placeholder="Minimum 8 characters"
                                                />
                                                <small className="text-muted">Must be at least 8 characters long</small>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    <i className="fas fa-phone me-1"></i>Phone Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    className="form-control"
                                                    value={adminFormData.phone_number}
                                                    onChange={(e) => setAdminFormData({...adminFormData, phone_number: e.target.value})}
                                                    placeholder="+1 (555) 123-4567"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <h6 className="border-bottom pb-2 mb-3 mt-4">
                                        <i className="fas fa-building me-2"></i>Administrative Details
                                    </h6>
                                    
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    <i className="fas fa-department me-1"></i>Department
                                                </label>
                                                <select
                                                    className="form-select"
                                                    value={adminFormData.department}
                                                    onChange={(e) => setAdminFormData({...adminFormData, department: e.target.value})}
                                                >
                                                    <option value="Administration">Administration</option>
                                                    <option value="IT Management">IT Management</option>
                                                    <option value="Human Resources">Human Resources</option>
                                                    <option value="Finance">Finance</option>
                                                    <option value="Operations">Operations</option>
                                                    <option value="Quality Assurance">Quality Assurance</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    <i className="fas fa-user-tie me-1"></i>Position/Title
                                                </label>
                                                <select
                                                    className="form-select"
                                                    value={adminFormData.position}
                                                    onChange={(e) => setAdminFormData({...adminFormData, position: e.target.value})}
                                                >
                                                    <option value="Administrator">Administrator</option>
                                                    <option value="System Administrator">System Administrator</option>
                                                    <option value="Department Head">Department Head</option>
                                                    <option value="Operations Manager">Operations Manager</option>
                                                    <option value="Assistant Administrator">Assistant Administrator</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    <i className="fas fa-id-card me-1"></i>License Number (Optional)
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={adminFormData.license_number}
                                                    onChange={(e) => setAdminFormData({...adminFormData, license_number: e.target.value})}
                                                    placeholder="ADM-123456"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    <i className="fas fa-certificate me-1"></i>Certification (Optional)
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={adminFormData.certification}
                                                    onChange={(e) => setAdminFormData({...adminFormData, certification: e.target.value})}
                                                    placeholder="Healthcare Administration"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowCreateAdminModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-danger"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-user-shield me-2"></i>
                                                Create Admin User
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Create User Modal */}
            {showCreateUserModal && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">
                                    <i className="fas fa-user-plus me-2"></i>
                                    Create New User
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowCreateUserModal(false)}
                                ></button>
                            </div>
                            <form onSubmit={createUser}>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Email Address *</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    value={userFormData.email}
                                                    onChange={(e) => setUserFormData({...userFormData, email: e.target.value})}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Full Name *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={userFormData.full_name}
                                                    onChange={(e) => setUserFormData({...userFormData, full_name: e.target.value})}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Password *</label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    value={userFormData.password}
                                                    onChange={(e) => setUserFormData({...userFormData, password: e.target.value})}
                                                    required
                                                    minLength="8"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Role *</label>
                                                <select
                                                    className="form-select"
                                                    value={userFormData.role}
                                                    onChange={(e) => setUserFormData({...userFormData, role: e.target.value})}
                                                    required
                                                >
                                                    <option value="patient">Patient</option>
                                                    <option value="doctor">Doctor</option>
                                                    <option value="nurse">Nurse</option>
                                                    <option value="pharmacist">Pharmacist</option>
                                                    {currentUser?.role === 'super_admin' && (
                                                        <option value="admin">Admin</option>
                                                    )}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    className="form-control"
                                                    value={userFormData.phone_number}
                                                    onChange={(e) => setUserFormData({...userFormData, phone_number: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">License Number</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={userFormData.license_number}
                                                    onChange={(e) => setUserFormData({...userFormData, license_number: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {userFormData.role !== 'patient' && (
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className="form-label">Department</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={userFormData.department}
                                                        onChange={(e) => setUserFormData({...userFormData, department: e.target.value})}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className="form-label">Position</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={userFormData.position}
                                                        onChange={(e) => setUserFormData({...userFormData, position: e.target.value})}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={userFormData.is_active}
                                                    onChange={(e) => setUserFormData({...userFormData, is_active: e.target.checked})}
                                                />
                                                <label className="form-check-label">
                                                    Active User
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={userFormData.is_verified}
                                                    onChange={(e) => setUserFormData({...userFormData, is_verified: e.target.checked})}
                                                />
                                                <label className="form-check-label">
                                                    Verified User
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowCreateUserModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-user-plus me-2"></i>
                                                Create User
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* User Details Modal */}
            {showDetailsModal && selectedUser && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-info text-white">
                                <h5 className="modal-title">
                                    <i className="fas fa-user me-2"></i>
                                    User Details: {selectedUser.full_name}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowDetailsModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h6>Basic Information</h6>
                                        <table className="table table-sm">
                                            <tr>
                                                <td><strong>Email:</strong></td>
                                                <td>{selectedUser.email}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Full Name:</strong></td>
                                                <td>{selectedUser.full_name}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Role:</strong></td>
                                                <td>
                                                    <span className={`badge bg-${getRoleColor(selectedUser.role)}`}>
                                                        {selectedUser.role.replace('_', ' ').toUpperCase()}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><strong>Phone:</strong></td>
                                                <td>{selectedUser.phone_number || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>License:</strong></td>
                                                <td>{selectedUser.license_number || 'N/A'}</td>
                                            </tr>
                                        </table>
                                    </div>
                                    <div className="col-md-6">
                                        <h6>Account Status</h6>
                                        <table className="table table-sm">
                                            <tr>
                                                <td><strong>Status:</strong></td>
                                                <td>
                                                    <span className={`badge bg-${getStatusColor(selectedUser.is_active, selectedUser.is_verified)}`}>
                                                        {getStatusText(selectedUser.is_active, selectedUser.is_verified)}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><strong>Joined:</strong></td>
                                                <td>{new Date(selectedUser.date_joined).toLocaleDateString()}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Last Login:</strong></td>
                                                <td>
                                                    {selectedUser.last_login 
                                                        ? new Date(selectedUser.last_login).toLocaleDateString()
                                                        : 'Never'
                                                    }
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><strong>Staff:</strong></td>
                                                <td>{selectedUser.is_staff ? 'Yes' : 'No'}</td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                                
                                {selectedUser.profile && selectedUser.profile.type && (
                                    <div className="mt-3">
                                        <h6>Profile Information</h6>
                                        <div className="row">
                                            <div className="col-12">
                                                <table className="table table-sm">
                                                    {selectedUser.profile.type === 'staff' && (
                                                        <>
                                                            <tr>
                                                                <td><strong>Department:</strong></td>
                                                                <td>{selectedUser.profile.department || 'N/A'}</td>
                                                            </tr>
                                                            <tr>
                                                                <td><strong>Position:</strong></td>
                                                                <td>{selectedUser.profile.position || 'N/A'}</td>
                                                            </tr>
                                                            <tr>
                                                                <td><strong>Join Date:</strong></td>
                                                                <td>
                                                                    {selectedUser.profile.join_date 
                                                                        ? new Date(selectedUser.profile.join_date).toLocaleDateString()
                                                                        : 'N/A'
                                                                    }
                                                                </td>
                                                            </tr>
                                                        </>
                                                    )}
                                                    
                                                    {selectedUser.profile.type === 'patient' && (
                                                        <>
                                                            <tr>
                                                                <td><strong>Date of Birth:</strong></td>
                                                                <td>
                                                                    {selectedUser.profile.date_of_birth 
                                                                        ? new Date(selectedUser.profile.date_of_birth).toLocaleDateString()
                                                                        : 'N/A'
                                                                    }
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td><strong>Gender:</strong></td>
                                                                <td>{selectedUser.profile.gender || 'N/A'}</td>
                                                            </tr>
                                                            <tr>
                                                                <td><strong>Emergency Contact:</strong></td>
                                                                <td>{selectedUser.profile.emergency_contact || 'N/A'}</td>
                                                            </tr>
                                                        </>
                                                    )}
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {selectedUser.groups && selectedUser.groups.length > 0 && (
                                    <div className="mt-3">
                                        <h6>Groups</h6>
                                        <div>
                                            {selectedUser.groups.map(group => (
                                                <span key={group} className="badge bg-secondary me-2">
                                                    {group}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowDetailsModal(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Permission Management Modal */}
            {showPermissionModal && selectedUser && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">
                                    <i className="fas fa-shield-alt me-2"></i>
                                    Manage Permissions - {selectedUser.full_name}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowPermissionModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h6 className="text-primary">
                                            <i className="fas fa-hospital me-2"></i>
                                            Healthcare Module Permissions
                                        </h6>
                                        <div className="card">
                                            <div className="card-body">
                                                {Object.entries(HEALTHCARE_MODULES).map(([key, module]) => (
                                                    <div key={key} className="form-check mb-2">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id={`healthcare_${key}`}
                                                            checked={selectedUserPermissions.includes(`can_access_${key}`)}
                                                            onChange={(e) => {
                                                                const permission = `can_access_${key}`;
                                                                if (e.target.checked) {
                                                                    setSelectedUserPermissions([...selectedUserPermissions, permission]);
                                                                } else {
                                                                    setSelectedUserPermissions(selectedUserPermissions.filter(p => p !== permission));
                                                                }
                                                            }}
                                                        />
                                                        <label className="form-check-label" htmlFor={`healthcare_${key}`}>
                                                            <strong>{module.name}</strong>
                                                            <br />
                                                            <small className="text-muted">{module.description}</small>
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <h6 className="text-success">
                                            <i className="fas fa-cogs me-2"></i>
                                            Administrative Feature Permissions
                                        </h6>
                                        <div className="card">
                                            <div className="card-body">
                                                {Object.entries(ADMIN_FEATURES).map(([key, feature]) => (
                                                    <div key={key} className="form-check mb-2">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id={`admin_${key}`}
                                                            checked={selectedUserPermissions.includes(`can_access_${key}`)}
                                                            onChange={(e) => {
                                                                const permission = `can_access_${key}`;
                                                                if (e.target.checked) {
                                                                    setSelectedUserPermissions([...selectedUserPermissions, permission]);
                                                                } else {
                                                                    setSelectedUserPermissions(selectedUserPermissions.filter(p => p !== permission));
                                                                }
                                                            }}
                                                        />
                                                        <label className="form-check-label" htmlFor={`admin_${key}`}>
                                                            <strong>{feature.name}</strong>
                                                            <br />
                                                            <small className="text-muted">{feature.description}</small>
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-md-12">
                                        <div className="alert alert-info">
                                            <i className="fas fa-info-circle me-2"></i>
                                            <strong>Permission Summary:</strong> {selectedUserPermissions.length} permissions selected
                                            <div className="mt-2">
                                                {selectedUserPermissions.map(permission => (
                                                    <span key={permission} className="badge bg-primary me-1 mb-1">
                                                        {permission.replace('can_access_', '').replace('_', ' ').toUpperCase()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowPermissionModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => updateUserPermissions(selectedUser.id, selectedUserPermissions)}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-save me-2"></i>
                                            Update Permissions
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Permission Test Results */}
            {permissionTestResults && selectedUser && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-success text-white">
                                <h5 className="modal-title">
                                    <i className="fas fa-vial me-2"></i>
                                    Permission Test Results - {selectedUser.full_name}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setPermissionTestResults(null)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-12">
                                        <h6>Module Access Test Results:</h6>
                                        <div className="table-responsive">
                                            <table className="table table-sm">
                                                <thead>
                                                    <tr>
                                                        <th>Module</th>
                                                        <th>Access Status</th>
                                                        <th>Permission</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Object.entries(HEALTHCARE_MODULES).map(([key, module]) => {
                                                        const hasAccess = permissionTestResults[`can_access_${key}`] || false;
                                                        return (
                                                            <tr key={key}>
                                                                <td>{module.name}</td>
                                                                <td>
                                                                    <span className={`badge bg-${hasAccess ? 'success' : 'danger'}`}>
                                                                        {hasAccess ? 'Granted' : 'Denied'}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <code>can_access_{key}</code>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                    {Object.entries(ADMIN_FEATURES).map(([key, feature]) => {
                                                        const hasAccess = permissionTestResults[`can_access_${key}`] || false;
                                                        return (
                                                            <tr key={key}>
                                                                <td>{feature.name}</td>
                                                                <td>
                                                                    <span className={`badge bg-${hasAccess ? 'success' : 'danger'}`}>
                                                                        {hasAccess ? 'Granted' : 'Denied'}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <code>can_access_{key}</code>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setPermissionTestResults(null)}
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => {
                                        setPermissionTestResults(null);
                                        manageUserPermissions(selectedUser.id);
                                    }}
                                >
                                    <i className="fas fa-edit me-2"></i>
                                    Edit Permissions
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnhancedUserManagement;
