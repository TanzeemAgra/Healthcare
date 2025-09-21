/**
 * User Management Dashboard Widget
 * Quick access widget for admin dashboard
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/api';

const UserManagementWidget = () => {
    const [stats, setStats] = useState({});
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            // Get current user
            const userResponse = await apiClient.get('/auth/profile/');
            setCurrentUser(userResponse.data.user);

            // Get stats if user is admin
            if (['admin', 'super_admin'].includes(userResponse.data.user?.role)) {
                const statsResponse = await apiClient.get('/hospital/management/users/stats/');
                if (statsResponse.data.success) {
                    setStats(statsResponse.data.statistics);
                }
            }
        } catch (error) {
            console.error('Failed to fetch user data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Only show for admin users
    if (!currentUser || !['admin', 'super_admin'].includes(currentUser.role)) {
        return null;
    }

    return (
        <div className="col-lg-6 col-md-12">
            <div className="card shadow-sm h-100">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">
                        <i className="fas fa-users-cog me-2"></i>
                        User Management
                    </h6>
                    <span className="badge bg-light text-primary">
                        {currentUser.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                    </span>
                </div>
                
                <div className="card-body">
                    {loading ? (
                        <div className="text-center py-3">
                            <div className="spinner-border spinner-border-sm text-primary"></div>
                        </div>
                    ) : (
                        <>
                            {/* Quick Stats */}
                            <div className="row mb-3">
                                <div className="col-6">
                                    <div className="text-center">
                                        <h4 className="text-primary mb-0">{stats.total_users || 0}</h4>
                                        <small className="text-muted">Total Users</small>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="text-center">
                                        <h4 className="text-success mb-0">{stats.active_users || 0}</h4>
                                        <small className="text-muted">Active Users</small>
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-6">
                                    <div className="text-center">
                                        <h4 className="text-warning mb-0">{stats.staff_users || 0}</h4>
                                        <small className="text-muted">Staff Members</small>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="text-center">
                                        <h4 className="text-info mb-0">{stats.recent_registrations || 0}</h4>
                                        <small className="text-muted">New (30 days)</small>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="d-grid gap-2">
                                <Link to="/admin/user-management" className="btn btn-primary btn-sm">
                                    <i className="fas fa-users me-2"></i>
                                    Manage All Users
                                </Link>
                                
                                <div className="row">
                                    <div className="col-6">
                                        {currentUser.role === 'super_admin' && (
                                            <Link 
                                                to="/admin/user-management?action=create-admin" 
                                                className="btn btn-danger btn-sm w-100"
                                            >
                                                <i className="fas fa-user-shield me-1"></i>
                                                Add Admin
                                            </Link>
                                        )}
                                    </div>
                                    <div className="col-6">
                                        <Link 
                                            to="/admin/user-management?action=create-user" 
                                            className="btn btn-success btn-sm w-100"
                                        >
                                            <i className="fas fa-user-plus me-1"></i>
                                            Add User
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Role Distribution */}
                            {stats.role_distribution && (
                                <div className="mt-3">
                                    <small className="text-muted mb-2 d-block">User Roles:</small>
                                    <div className="d-flex flex-wrap gap-1">
                                        {Object.entries(stats.role_distribution)
                                            .filter(([, roleData]) => roleData.count > 0)
                                            .map(([roleCode, roleData]) => (
                                                <span 
                                                    key={roleCode} 
                                                    className={`badge ${getRoleBadgeColor(roleCode)}`}
                                                    style={{ fontSize: '0.7rem' }}
                                                >
                                                    {roleCode === 'super_admin' ? 'S.Admin' : 
                                                     roleCode.charAt(0).toUpperCase() + roleCode.slice(1)}: {roleData.count}
                                                </span>
                                            ))
                                        }
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// Helper function for role badge colors
const getRoleBadgeColor = (role) => {
    const colors = {
        super_admin: 'bg-danger',
        admin: 'bg-warning',
        doctor: 'bg-success',
        nurse: 'bg-info',
        patient: 'bg-secondary',
        pharmacist: 'bg-primary'
    };
    return colors[role] || 'bg-secondary';
};

export default UserManagementWidget;
