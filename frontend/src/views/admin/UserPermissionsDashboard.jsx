import React from 'react';
import { usePermissions } from '../../contexts/PermissionContext';

const UserPermissionsDashboard = () => {
    const { 
        user, 
        permissions, 
        dashboardFeatures, 
        quota, 
        loading,
        isSuperAdmin,
        isAdmin 
    } = usePermissions();

    if (loading) {
        return (
            <div className="card">
                <div className="card-body text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading user permissions...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="card">
                <div className="card-body text-center">
                    <i className="fas fa-exclamation-triangle text-warning fs-1"></i>
                    <h5 className="mt-3">No Permission Data</h5>
                    <p className="text-muted">Unable to load user permissions.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="card shadow-lg border-0">
                        <div className="card-header bg-gradient-primary text-white py-3">
                            <div className="d-flex align-items-center">
                                <i className="fas fa-user-shield me-3 fs-4"></i>
                                <div>
                                    <h4 className="card-title mb-1">User Permissions & Access Control</h4>
                                    <small className="opacity-75">Your current access level and available features</small>
                                </div>
                            </div>
                        </div>
                        
                        <div className="card-body p-4">
                            {/* User Info */}
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="avatar avatar-lg bg-primary rounded-circle me-3">
                                            <i className="fas fa-user text-white"></i>
                                        </div>
                                        <div>
                                            <h5 className="mb-1">{user.full_name}</h5>
                                            <p className="text-muted mb-0">{user.email}</p>
                                            <span className={`badge ${isSuperAdmin() ? 'bg-danger' : 'bg-primary'}`}>
                                                {isSuperAdmin() ? 'Super Administrator' : 'Administrator'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="text-md-end">
                                        <div className="d-inline-block">
                                            <span className="text-muted small">User ID:</span>
                                            <span className="fw-bold ms-1">#{user.id}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Access Level Summary */}
                            <div className="row mb-4">
                                <div className="col-12">
                                    <div className={`alert ${isSuperAdmin() ? 'alert-danger' : 'alert-primary'}`}>
                                        <div className="d-flex align-items-center">
                                            <i className={`fas ${isSuperAdmin() ? 'fa-crown' : 'fa-user-cog'} me-3 fs-4`}></i>
                                            <div>
                                                <h6 className="mb-1">
                                                    {isSuperAdmin() ? '🌟 Super Administrator Access' : '🔧 Limited Administrator Access'}
                                                </h6>
                                                <small>
                                                    {isSuperAdmin() 
                                                        ? 'You have full system access and can manage all features and users.'
                                                        : 'You have restricted access based on your assigned permissions and features.'
                                                    }
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Permissions */}
                            <div className="row mb-4">
                                <div className="col-12">
                                    <h5 className="border-bottom pb-2 mb-3">
                                        <i className="fas fa-key me-2"></i>
                                        Administrative Permissions
                                    </h5>
                                    <div className="row">
                                        {Object.entries(permissions || {}).map(([permission, allowed]) => (
                                            <div key={permission} className="col-md-6 col-lg-4 mb-3">
                                                <div className={`p-3 rounded border ${allowed ? 'bg-success bg-opacity-10 border-success' : 'bg-light border-secondary'}`}>
                                                    <div className="d-flex align-items-center">
                                                        <i className={`fas ${allowed ? 'fa-check-circle text-success' : 'fa-times-circle text-muted'} me-2`}></i>
                                                        <div>
                                                            <small className="fw-bold">
                                                                {permission.replace('can_', '').replace(/_/g, ' ').toUpperCase()}
                                                            </small>
                                                            <div className={`badge ${allowed ? 'bg-success' : 'bg-secondary'} ms-2`}>
                                                                {allowed ? 'ALLOWED' : 'DENIED'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Dashboard Features */}
                            <div className="row mb-4">
                                <div className="col-12">
                                    <h5 className="border-bottom pb-2 mb-3">
                                        <i className="fas fa-tachometer-alt me-2"></i>
                                        Dashboard Features Access
                                    </h5>
                                    <div className="row">
                                        {Object.entries(dashboardFeatures || {}).map(([feature, enabled]) => (
                                            <div key={feature} className="col-md-6 col-lg-4 mb-3">
                                                <div className={`p-3 rounded border ${enabled ? 'bg-primary bg-opacity-10 border-primary' : 'bg-light border-secondary'}`}>
                                                    <div className="d-flex align-items-center">
                                                        <i className={`fas ${enabled ? 'fa-toggle-on text-primary' : 'fa-toggle-off text-muted'} me-2`}></i>
                                                        <div>
                                                            <small className="fw-bold">
                                                                {feature.replace(/_/g, ' ').toUpperCase()}
                                                            </small>
                                                            <div className={`badge ${enabled ? 'bg-primary' : 'bg-secondary'} ms-2`}>
                                                                {enabled ? 'ENABLED' : 'DISABLED'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* User Creation Quota */}
                            {quota && (
                                <div className="row">
                                    <div className="col-12">
                                        <h5 className="border-bottom pb-2 mb-3">
                                            <i className="fas fa-users me-2"></i>
                                            User Creation Quota
                                        </h5>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="card bg-info bg-opacity-10 border-info">
                                                    <div className="card-body">
                                                        <h6 className="card-title">
                                                            <i className="fas fa-chart-pie me-2"></i>
                                                            Quota Status
                                                        </h6>
                                                        <p className="mb-2">
                                                            <strong>Status:</strong> 
                                                            <span className={`badge ${quota.enabled ? 'bg-success' : 'bg-warning'} ms-2`}>
                                                                {quota.enabled ? 'ENABLED' : 'DISABLED'}
                                                            </span>
                                                        </p>
                                                        <p className="mb-2">
                                                            <strong>Reset Period:</strong> {quota.quota_reset_period}
                                                        </p>
                                                        <p className="mb-0">
                                                            <strong>Total Users Limit:</strong> {quota.max_total_users}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="card bg-light">
                                                    <div className="card-body">
                                                        <h6 className="card-title">
                                                            <i className="fas fa-users-cog me-2"></i>
                                                            Role Limits
                                                        </h6>
                                                        <p className="mb-1"><strong>Doctors:</strong> {quota.max_doctors}</p>
                                                        <p className="mb-1"><strong>Nurses:</strong> {quota.max_nurses}</p>
                                                        <p className="mb-1"><strong>Patients:</strong> {quota.max_patients}</p>
                                                        <p className="mb-0"><strong>Pharmacists:</strong> {quota.max_pharmacists}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserPermissionsDashboard;
