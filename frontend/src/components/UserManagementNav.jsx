/**
 * User Management Navigation Component
 * Quick access navigation for user management features
 */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/api';

const UserManagementNav = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userStats, setUserStats] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchCurrentUser();
        fetchUserStats();
    }, []);

    const fetchCurrentUser = async () => {
        try {
            const response = await apiClient.get('/auth/profile/');
            setCurrentUser(response.data.user);
        } catch (error) {
            console.error('Failed to fetch current user:', error);
        }
    };

    const fetchUserStats = async () => {
        try {
            const response = await apiClient.get('/hospital/management/users/stats/');
            if (response.data.success) {
                setUserStats(response.data.statistics);
            }
        } catch (error) {
            console.error('Failed to fetch user stats:', error);
        }
    };

    // Only show for admin or super admin users
    if (!currentUser || !['admin', 'super_admin'].includes(currentUser.role)) {
        return null;
    }

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header bg-gradient-primary text-white">
                <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">
                        <i className="fas fa-users-cog me-2"></i>
                        User Management
                    </h6>
                    <span className="badge bg-light text-dark">
                        {currentUser.role.replace('_', ' ').toUpperCase()}
                    </span>
                </div>
            </div>
            
            <div className="card-body">
                {/* Quick Stats */}
                <div className="row mb-3">
                    <div className="col-md-3">
                        <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                                <i className="fas fa-users text-white"></i>
                            </div>
                            <div>
                                <h6 className="mb-0">{userStats.total_users || 0}</h6>
                                <small className="text-muted">Total Users</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-success d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                                <i className="fas fa-user-check text-white"></i>
                            </div>
                            <div>
                                <h6 className="mb-0">{userStats.active_users || 0}</h6>
                                <small className="text-muted">Active</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-warning d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                                <i className="fas fa-user-tie text-white"></i>
                            </div>
                            <div>
                                <h6 className="mb-0">{userStats.staff_users || 0}</h6>
                                <small className="text-muted">Staff</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-info d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                                <i className="fas fa-chart-line text-white"></i>
                            </div>
                            <div>
                                <h6 className="mb-0">{userStats.activity_rate || 0}%</h6>
                                <small className="text-muted">Activity</small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="d-flex flex-wrap gap-2">
                    <Link
                        to="/user-management"
                        className="btn btn-primary btn-sm"
                    >
                        <i className="fas fa-users me-2"></i>
                        Manage Users
                    </Link>
                    
                    {currentUser.role === 'super_admin' && (
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={() => navigate('/user-management?action=create-admin')}
                        >
                            <i className="fas fa-user-shield me-2"></i>
                            Create Admin
                        </button>
                    )}
                    
                    <button
                        className="btn btn-success btn-sm"
                        onClick={() => navigate('/user-management?action=create-user')}
                    >
                        <i className="fas fa-user-plus me-2"></i>
                        Add User
                    </button>
                    
                    <Link
                        to="/user-management?view=statistics"
                        className="btn btn-outline-info btn-sm"
                    >
                        <i className="fas fa-chart-bar me-2"></i>
                        Statistics
                    </Link>
                </div>

                {/* Role Distribution */}
                {userStats.role_distribution && (
                    <div className="mt-3">
                        <small className="text-muted">Role Distribution:</small>
                        <div className="d-flex flex-wrap gap-1 mt-1">
                            {Object.entries(userStats.role_distribution).map(([roleCode, roleData]) => (
                                <span key={roleCode} className="badge bg-secondary">
                                    {roleData.name}: {roleData.count}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagementNav;
