/**
 * Permission-Based Dashboard Component
 * Demonstrates role-based access control
 */
import React from 'react';
import { usePermissions } from '../../contexts/PermissionContext';

const PermissionDashboard = () => {
    const { 
        user, 
        permissions, 
        dashboardFeatures, 
        loading,
        isSuperAdmin,
        canCreateAdmins,
        hasPermission,
        hasDashboardFeature 
    } = usePermissions();

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading permissions...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="alert alert-warning">
                <h5>Please login to view your permissions</h5>
            </div>
        );
    }

    const enabledPermissions = Object.entries(permissions || {})
        .filter(([key, value]) => value)
        .map(([key, value]) => key);

    const enabledFeatures = Object.entries(dashboardFeatures || {})
        .filter(([key, value]) => value)
        .map(([key, value]) => key);

    return (
        <div className="container-fluid py-4">
            <div className="row">
                {/* User Info Card */}
                <div className="col-12 mb-4">
                    <div className="card shadow-sm border-0">
                        <div className={`card-header py-3 ${isSuperAdmin() ? 'bg-primary text-white' : 'bg-secondary text-white'}`}>
                            <div className="d-flex align-items-center">
                                <i className={`fas ${isSuperAdmin() ? 'fa-crown' : 'fa-user-shield'} me-3 fs-4`}></i>
                                <div>
                                    <h4 className="card-title mb-1">{user.full_name}</h4>
                                    <small className="opacity-75">{user.email} • {user.role.replace('_', ' ').toUpperCase()}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Permissions Card */}
                <div className="col-lg-6 mb-4">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-header bg-light py-3">
                            <h5 className="card-title mb-0">
                                <i className="fas fa-key me-2 text-primary"></i>
                                System Permissions
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <span className="badge bg-info">
                                    {enabledPermissions.length} of 9 permissions enabled
                                </span>
                            </div>
                            
                            <div className="row g-2">
                                {[
                                    { key: 'can_manage_users', label: 'Manage Users', icon: 'fa-users' },
                                    { key: 'can_view_reports', label: 'View Reports', icon: 'fa-chart-bar' },
                                    { key: 'can_manage_departments', label: 'Manage Departments', icon: 'fa-building' },
                                    { key: 'can_access_billing', label: 'Access Billing', icon: 'fa-dollar-sign' },
                                    { key: 'can_manage_inventory', label: 'Manage Inventory', icon: 'fa-boxes' },
                                    { key: 'can_access_emergency', label: 'Emergency Access', icon: 'fa-ambulance' },
                                    { key: 'can_create_admins', label: 'Create Admins', icon: 'fa-user-plus' },
                                    { key: 'can_manage_system_settings', label: 'System Settings', icon: 'fa-cog' },
                                    { key: 'can_access_all_features', label: 'All Features', icon: 'fa-star' }
                                ].map(perm => (
                                    <div key={perm.key} className="col-12">
                                        <div className={`d-flex align-items-center p-2 rounded ${hasPermission(perm.key) ? 'bg-success bg-opacity-10 text-success' : 'bg-light text-muted'}`}>
                                            <i className={`fas ${perm.icon} me-2`}></i>
                                            <span className="small">{perm.label}</span>
                                            <span className="ms-auto">
                                                {hasPermission(perm.key) ? (
                                                    <i className="fas fa-check-circle text-success"></i>
                                                ) : (
                                                    <i className="fas fa-times-circle text-muted"></i>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Features Card */}
                <div className="col-lg-6 mb-4">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-header bg-light py-3">
                            <h5 className="card-title mb-0">
                                <i className="fas fa-tachometer-alt me-2 text-success"></i>
                                Dashboard Features
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <span className="badge bg-success">
                                    {enabledFeatures.length} of 25 features enabled
                                </span>
                            </div>
                            
                            <div className="row g-2">
                                {[
                                    { key: 'user_management', label: 'User Management', category: 'Management' },
                                    { key: 'patient_management', label: 'Patient Management', category: 'Management' },
                                    { key: 'doctor_management', label: 'Doctor Management', category: 'Management' },
                                    { key: 'medicine_module', label: 'Medicine Module', category: 'Medical' },
                                    { key: 'dentistry_module', label: 'Dentistry Module', category: 'Medical' },
                                    { key: 'dermatology_module', label: 'Dermatology Module', category: 'Medical' },
                                    { key: 'billing_reports', label: 'Billing Reports', category: 'Reports' },
                                    { key: 'financial_dashboard', label: 'Financial Dashboard', category: 'Reports' },
                                    { key: 'system_settings', label: 'System Settings', category: 'Admin' },
                                    { key: 'audit_logs', label: 'Audit Logs', category: 'Admin' }
                                ].map(feature => (
                                    <div key={feature.key} className="col-12">
                                        <div className={`d-flex align-items-center p-2 rounded ${hasDashboardFeature(feature.key) ? 'bg-success bg-opacity-10 text-success' : 'bg-light text-muted'}`}>
                                            <span className="small">{feature.label}</span>
                                            <span className="badge bg-secondary ms-2 small">{feature.category}</span>
                                            <span className="ms-auto">
                                                {hasDashboardFeature(feature.key) ? (
                                                    <i className="fas fa-check-circle text-success"></i>
                                                ) : (
                                                    <i className="fas fa-times-circle text-muted"></i>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {enabledFeatures.length > 10 && (
                                <div className="mt-3 text-center">
                                    <small className="text-muted">
                                        And {enabledFeatures.length - 10} more features...
                                    </small>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="col-12">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-light py-3">
                            <h5 className="card-title mb-0">
                                <i className="fas fa-bolt me-2 text-warning"></i>
                                Available Actions
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                {canCreateAdmins() && (
                                    <div className="col-md-4">
                                        <div className="p-3 border rounded bg-primary bg-opacity-10">
                                            <i className="fas fa-user-plus text-primary fs-3 mb-2"></i>
                                            <h6 className="text-primary">Create Admin Users</h6>
                                            <small className="text-muted">Add new administrator accounts</small>
                                        </div>
                                    </div>
                                )}
                                
                                {hasPermission('can_manage_users') && (
                                    <div className="col-md-4">
                                        <div className="p-3 border rounded bg-success bg-opacity-10">
                                            <i className="fas fa-users text-success fs-3 mb-2"></i>
                                            <h6 className="text-success">Manage Users</h6>
                                            <small className="text-muted">Edit user accounts and roles</small>
                                        </div>
                                    </div>
                                )}
                                
                                {hasPermission('can_view_reports') && (
                                    <div className="col-md-4">
                                        <div className="p-3 border rounded bg-info bg-opacity-10">
                                            <i className="fas fa-chart-line text-info fs-3 mb-2"></i>
                                            <h6 className="text-info">View Reports</h6>
                                            <small className="text-muted">Access system reports and analytics</small>
                                        </div>
                                    </div>
                                )}
                                
                                {hasPermission('can_access_billing') && (
                                    <div className="col-md-4">
                                        <div className="p-3 border rounded bg-warning bg-opacity-10">
                                            <i className="fas fa-dollar-sign text-warning fs-3 mb-2"></i>
                                            <h6 className="text-warning">Billing System</h6>
                                            <small className="text-muted">Manage billing and payments</small>
                                        </div>
                                    </div>
                                )}
                                
                                {!hasPermission('can_access_billing') && !hasPermission('can_manage_inventory') && (
                                    <div className="col-12">
                                        <div className="alert alert-info">
                                            <i className="fas fa-info-circle me-2"></i>
                                            <strong>Limited Access:</strong> Some features are restricted based on your role. 
                                            Contact a Super Administrator if you need additional permissions.
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PermissionDashboard;
