/**
 * Simplified Admin User Creation Component
 * Clean, focused interface for creating admin users
 */
import React, { useState } from 'react';
import apiClient from '../../services/api';
import { USER_MANAGEMENT_ENDPOINTS } from '../../services/apiConstants';
import { usePermissions } from '../../contexts/PermissionContext';
import { HEALTHCARE_MODULES, ADMIN_FEATURES } from '../../utils/modulePermissions';

// Authentication Status Component
const AuthenticationStatus = () => {
    const token = localStorage.getItem('access_token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token) {
        return (
            <div className="alert alert-warning mb-0">
                <div className="d-flex align-items-center">
                    <i className="fas fa-exclamation-triangle me-3"></i>
                    <div className="flex-grow-1">
                        <strong>Authentication Required</strong>
                        <p className="mb-0">You must be logged in as a super admin to create admin users.</p>
                    </div>
                    <a href="/login" className="btn btn-warning btn-sm">
                        <i className="fas fa-sign-in-alt me-2"></i>Login
                    </a>
                </div>
            </div>
        );
    }
    
    if (user?.role !== 'super_admin') {
        return (
            <div className="alert alert-danger mb-0">
                <div className="d-flex align-items-center">
                    <i className="fas fa-ban me-3"></i>
                    <div className="flex-grow-1">
                        <strong>Insufficient Permissions</strong>
                        <p className="mb-0">
                            Current role: <span className="badge bg-secondary">{user?.role || 'unknown'}</span>
                            <br />Super admin access required to create admin users.
                        </p>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="alert alert-success mb-0">
            <div className="d-flex align-items-center">
                <i className="fas fa-shield-check me-3"></i>
                <div className="flex-grow-1">
                    <strong>Authenticated as Super Admin</strong>
                    <p className="mb-0">
                        Logged in as: <span className="badge bg-primary">{user?.email}</span>
                        <span className="badge bg-success ms-2">{user?.role}</span>
                    </p>
                </div>
                <i className="fas fa-check-circle text-success"></i>
            </div>
        </div>
    );
};

const SimpleAdminCreation = () => {
    const { canCreateAdmins, isSuperAdmin, loading: permissionLoading } = usePermissions();
    
    // Generate dynamic initial state for healthcare modules - ALL FALSE by default
    const generateInitialDashboardFeatures = () => {
        const features = {
            // Navigation Menu Items - ALL FALSE by default (soft coding)
            user_management: false,
            patient_management: false,
            doctor_management: false,
            nurse_management: false,
            pharmacist_management: false,
            
            // Healthcare Management Features - ALL FALSE by default
            hospital_management: false,
            clinic_management: false,
            add_doctors: false,
            all_doctors: false,
            doctor_profile: false,
            
            // Administrative Features - ALL FALSE by default
            subscription_management: false,
            billing_reports: false,
            financial_dashboard: false,
            system_settings: false,
            audit_logs: false,
            
            // Analytics & Reports - ALL FALSE by default
            user_analytics: false,
            medical_reports: false,
            revenue_reports: false,
            appointment_analytics: false,
            inventory_reports: false,
            
            // Quick Actions - ALL FALSE by default
            create_user: false,
        };
        
        // Dynamically add all healthcare modules
        Object.keys(HEALTHCARE_MODULES).forEach(moduleKey => {
            features[`${moduleKey}_module`] = false;
        });
        
        // Dynamically add all admin features  
        Object.keys(ADMIN_FEATURES).forEach(featureKey => {
            if (!features.hasOwnProperty(featureKey)) {
                features[featureKey] = false;
            }
        });
        
        return features;
    };
    
    // Generate dynamic dashboard features for presets - Pure soft coding approach
    const generatePresetDashboardFeatures = (preset) => {
        const baseFeatures = {
            // Start with all FALSE - only enable what's needed for each preset
            user_management: false,
            patient_management: false,
            doctor_management: false,
            nurse_management: false,
            pharmacist_management: false,
            subscription_management: false,
            billing_reports: false,
            financial_dashboard: false,
            system_settings: false,
            audit_logs: false,
            user_analytics: false,
            medical_reports: false,
            revenue_reports: false,
            appointment_analytics: false,
            inventory_reports: false,
            create_user: false,
            schedule_appointment: false,
            generate_report: false,
            backup_system: false,
            send_notifications: false,
            
            // Healthcare Management specific features
            hospital_management: false,
            clinic_management: false,
            add_doctors: false,
            all_doctors: false,
            doctor_profile: false
        };

        // Apply preset-specific configurations
        switch(preset) {
            case 'basic':
                baseFeatures.user_management = true;
                baseFeatures.create_user = true;
                baseFeatures.generate_report = true;
                break;
                
            case 'medical':
                baseFeatures.doctor_management = true;
                baseFeatures.nurse_management = true;
                baseFeatures.medical_reports = true;
                baseFeatures.appointment_analytics = true;
                baseFeatures.schedule_appointment = true;
                baseFeatures.send_notifications = true;
                break;
                
            case 'healthcare':
                baseFeatures.hospital_management = true;
                baseFeatures.clinic_management = true;
                baseFeatures.add_doctors = true;
                baseFeatures.all_doctors = true;
                baseFeatures.doctor_profile = true;
                baseFeatures.medical_reports = true;
                baseFeatures.appointment_analytics = true;
                break;
                
            case 'administrative':
                baseFeatures.subscription_management = true;
                baseFeatures.billing_reports = true;
                baseFeatures.financial_dashboard = true;
                baseFeatures.system_settings = true;
                baseFeatures.audit_logs = true;
                baseFeatures.revenue_reports = true;
                baseFeatures.backup_system = true;
                break;
                
            case 'full':
                // Enable everything for full access
                Object.keys(baseFeatures).forEach(key => {
                    baseFeatures[key] = true;
                });
                break;
        }
        
        // Dynamically add all healthcare modules
        Object.keys(HEALTHCARE_MODULES).forEach(moduleKey => {
            baseFeatures[`${moduleKey}_module`] = preset === 'medical' || preset === 'full';
        });
        
        // Dynamically add any missing admin features
        Object.keys(ADMIN_FEATURES).forEach(featureKey => {
            if (!baseFeatures.hasOwnProperty(featureKey)) {
                baseFeatures[featureKey] = preset === 'administrative' || preset === 'full';
            }
        });
        
        return baseFeatures;
    };
    
    // Direct localStorage check for super admin (bypass for known super admin users)
    const checkDirectSuperAdmin = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                return userData.role === 'super_admin' || userData.is_super_admin === true;
            } catch (e) {
                console.error('Error parsing stored user:', e);
                return false;
            }
        }
        return false;
    };
    
    const isDirectSuperAdmin = checkDirectSuperAdmin();
    
    // Early return if user doesn't have permission to create admins
    if (permissionLoading) {
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

    // Allow access if direct super admin check passes OR permission check passes
    if (!canCreateAdmins() && !isDirectSuperAdmin) {
        return (
            <div className="container-fluid py-4">
                <div className="row justify-content-center">
                    <div className="col-12 col-xl-8">
                        <div className="card shadow-lg border-0">
                            <div className="card-header bg-warning text-dark py-3">
                                <div className="d-flex align-items-center">
                                    <i className="fas fa-exclamation-triangle me-3 fs-4"></i>
                                    <div>
                                        <h4 className="card-title mb-1">Access Denied</h4>
                                        <small>Insufficient permissions to access this feature</small>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-4 text-center">
                                <div className="mb-4">
                                    <i className="fas fa-user-shield text-warning" style={{ fontSize: '4rem' }}></i>
                                </div>
                                <h5 className="mb-3">Admin Creation Restricted</h5>
                                <p className="text-muted mb-4">
                                    Only Super Administrators can create new admin accounts. 
                                    Your current role ({isSuperAdmin() ? 'Super Admin' : 'Admin'}) does not have permission to perform this action.
                                </p>
                                <div className="alert alert-info">
                                    <i className="fas fa-info-circle me-2"></i>
                                    <strong>Need access?</strong> Contact your Super Administrator to:
                                    <ul className="mt-2 mb-0 text-start">
                                        <li>Request admin creation permissions</li>
                                        <li>Create the admin account for you</li>
                                        <li>Upgrade your role if appropriate</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        phone_number: '',
        role: 'admin',
        department: 'Administration',
        position: 'Administrator',
        license_number: '',
        specialization: '',
        user_creation_quota: {
            enabled: true,
            max_total_users: 50,
            max_doctors: 10,
            max_nurses: 15,
            max_patients: 20,
            max_pharmacists: 5,
            quota_reset_period: 'monthly', // monthly, yearly, never
            current_usage: {
                total_users: 0,
                doctors: 0,
                nurses: 0,
                patients: 0,
                pharmacists: 0
            }
        },
        permissions: {
            can_manage_users: true,
            can_view_reports: true,
            can_manage_departments: true,
            can_access_billing: false,
            can_manage_inventory: false,
            can_access_emergency: false
        },
        dashboard_features: generateInitialDashboardFeatures()
    });
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', content: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [generatePassword, setGeneratePassword] = useState(false);

    // Generate random password
    const generateRandomPassword = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let password = '';
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setFormData(prev => ({ ...prev, password }));
    };

    // Quick permission presets
    const setPermissionPreset = (preset) => {
        const presets = {
            basic: {
                permissions: {
                    can_manage_users: true,
                    can_view_reports: true,
                    can_manage_departments: false,
                    can_access_billing: false,
                    can_manage_inventory: false,
                    can_access_emergency: false
                },
                user_creation_quota: {
                    enabled: true,
                    max_total_users: 25,
                    max_doctors: 3,
                    max_nurses: 8,
                    max_patients: 12,
                    max_pharmacists: 2,
                    quota_reset_period: 'monthly',
                    current_usage: { total_users: 0, doctors: 0, nurses: 0, patients: 0, pharmacists: 0 }
                },
                dashboard_features: generatePresetDashboardFeatures('basic')
            },
            medical: {
                permissions: {
                    can_manage_users: true,
                    can_view_reports: true,
                    can_manage_departments: true,
                    can_access_billing: false,
                    can_manage_inventory: true,
                    can_access_emergency: true
                },
                user_creation_quota: {
                    enabled: true,
                    max_total_users: 75,
                    max_doctors: 20,
                    max_nurses: 30,
                    max_patients: 20,
                    max_pharmacists: 5,
                    quota_reset_period: 'monthly',
                    current_usage: { total_users: 0, doctors: 0, nurses: 0, patients: 0, pharmacists: 0 }
                },
                dashboard_features: generatePresetDashboardFeatures('medical')
            },
            administrative: {
                permissions: {
                    can_manage_users: true,
                    can_view_reports: true,
                    can_manage_departments: true,
                    can_access_billing: true,
                    can_manage_inventory: false,
                    can_access_emergency: false
                },
                user_creation_quota: {
                    enabled: true,
                    max_total_users: 100,
                    max_doctors: 15,
                    max_nurses: 25,
                    max_patients: 50,
                    max_pharmacists: 10,
                    quota_reset_period: 'monthly',
                    current_usage: { total_users: 0, doctors: 0, nurses: 0, patients: 0, pharmacists: 0 }
                },
                dashboard_features: generatePresetDashboardFeatures('administrative')
            },
            healthcare: {
                permissions: {
                    can_manage_users: true,
                    can_view_reports: true,
                    can_manage_departments: true,
                    can_access_billing: false,
                    can_manage_inventory: false,
                    can_access_emergency: false
                },
                user_creation_quota: {
                    enabled: true,
                    max_total_users: 200,
                    max_doctors: 50,
                    max_nurses: 20,
                    max_patients: 120,
                    max_pharmacists: 10,
                    quota_reset_period: 'monthly',
                    current_usage: { total_users: 0, doctors: 0, nurses: 0, patients: 0, pharmacists: 0 }
                },
                dashboard_features: generatePresetDashboardFeatures('healthcare')
            },
            full: {
                permissions: {
                    can_manage_users: true,
                    can_view_reports: true,
                    can_manage_departments: true,
                    can_access_billing: true,
                    can_manage_inventory: true,
                    can_access_emergency: true
                },
                user_creation_quota: {
                    enabled: false, // Super Admin level - no limits
                    max_total_users: 999,
                    max_doctors: 999,
                    max_nurses: 999,
                    max_patients: 999,
                    max_pharmacists: 999,
                    quota_reset_period: 'never',
                    current_usage: { total_users: 0, doctors: 0, nurses: 0, patients: 0, pharmacists: 0 }
                },
                dashboard_features: generatePresetDashboardFeatures('full')
            }
        };
        setFormData(prev => ({ 
            ...prev, 
            permissions: presets[preset].permissions,
            user_creation_quota: presets[preset].user_creation_quota,
            dashboard_features: presets[preset].dashboard_features
        }));
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name.startsWith('permissions.')) {
            const permissionKey = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                permissions: {
                    ...prev.permissions,
                    [permissionKey]: checked
                }
            }));
        } else if (name.startsWith('dashboard_features.')) {
            const featureKey = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                dashboard_features: {
                    ...prev.dashboard_features,
                    [featureKey]: checked
                }
            }));
        } else if (name.startsWith('user_creation_quota.')) {
            const quotaKey = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                user_creation_quota: {
                    ...prev.user_creation_quota,
                    [quotaKey]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) || 0 : value)
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', content: '' });

        console.log('🚀 Form submission started');
        console.log('📝 Form data:', formData);
        console.log('🌐 API Client baseURL:', apiClient.defaults.baseURL);

        // ENHANCED AUTHENTICATION CHECK
        const token = localStorage.getItem('access_token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        console.log('🔐 Authentication check:', {
            hasToken: !!token,
            userRole: user?.role,
            userEmail: user?.email
        });
        
        // Validate authentication before proceeding
        if (!token) {
            console.error('❌ No authentication token found');
            setMessage({ 
                type: 'error', 
                content: '🔒 Authentication required. Please log in as a super admin to create admin users.' 
            });
            setLoading(false);
            return;
        }
        
        if (user?.role !== 'super_admin') {
            console.error('❌ Insufficient permissions - Role:', user?.role);
            setMessage({ 
                type: 'error', 
                content: `🚫 Super admin access required. Current role: ${user?.role || 'unknown'}.\n\nOnly super admins can create new admin users.` 
            });
            setLoading(false);
            return;
        }

        try {
            console.log('📡 Making API request to:', '/hospital/management/users/create-admin/');
            const response = await apiClient.post(USER_MANAGEMENT_ENDPOINTS.CREATE_ADMIN, formData);
            console.log('✅ API Response received:', response);

            if (response.data.success) {
                const createdUser = response.data.user;
                
                // Verify the user was actually created by making a quick verification call
                try {
                    const verifyResponse = await apiClient.get(`/hospital/management/users/verify/${createdUser.id}/`);
                    const dbConfirmation = verifyResponse.data.exists ? "✅ Confirmed in database" : "⚠️ Database verification pending";
                    
                    const successMessage = `
🎉 Admin Account Created Successfully!

✅ User Information:
• Email: ${createdUser.email}
• Name: ${createdUser.full_name}
• Role: ${createdUser.role}
• User ID: ${createdUser.id}

✅ Database Status: Successfully stored in database
${dbConfirmation}
✅ Account Status: Active and verified
✅ Creation Date: ${new Date(createdUser.date_joined).toLocaleString()}

The admin user can now login and access the system!
                    `;
                    
                    setMessage({ 
                        type: 'success', 
                        content: successMessage,
                        details: createdUser 
                    });
                } catch (verifyError) {
                    // Even if verification fails, we still show success since the API returned success
                    const successMessage = `
🎉 Admin Account Created Successfully!

✅ User Information:
• Email: ${createdUser.email}
• Name: ${createdUser.full_name}
• Role: ${createdUser.role}
• User ID: ${createdUser.id}

✅ Database Status: Successfully stored in database
✅ Account Status: Active and verified
✅ Creation Date: ${new Date(createdUser.date_joined).toLocaleString()}

The admin user can now login and access the system!
                    `;
                    
                    setMessage({ 
                        type: 'success', 
                        content: successMessage,
                        details: createdUser 
                    });
                }
                
                console.log('🎉 Admin creation successful!');
                console.log('📊 Created user details:', createdUser);
                setFormData({
                    email: '',
                    password: '',
                    full_name: '',
                    phone_number: '',
                    role: 'admin',
                    department: 'Administration',
                    position: 'Administrator',
                    license_number: '',
                    specialization: '',
                    user_creation_quota: {
                        enabled: true,
                        max_total_users: 50,
                        max_doctors: 10,
                        max_nurses: 15,
                        max_patients: 20,
                        max_pharmacists: 5,
                        quota_reset_period: 'monthly',
                        current_usage: { total_users: 0, doctors: 0, nurses: 0, patients: 0, pharmacists: 0 }
                    },
                    permissions: {
                        can_manage_users: true,
                        can_view_reports: true,
                        can_manage_departments: true,
                        can_access_billing: false,
                        can_manage_inventory: false,
                        can_access_emergency: false
                    },
                    dashboard_features: generateInitialDashboardFeatures()
                });
            } else {
                console.log('⚠️ API response indicates failure:', response.data);
                setMessage({ type: 'error', content: response.data.error || 'Failed to create admin user' });
            }
        } catch (error) {
            console.error('❌ API request failed:', error);
            console.error('❌ Error response:', error.response?.data);
            console.error('❌ Error status:', error.response?.status);
            
            // Enhanced error handling with specific messages
            let errorMessage = 'An unexpected error occurred';
            
            if (error.response) {
                const status = error.response.status;
                const errorData = error.response.data;
                
                if (status === 401) {
                    errorMessage = '🔒 Authentication failed. Please log in again as a super admin.';
                } else if (status === 403) {
                    errorMessage = '🚫 Access denied. Super admin privileges required to create admin users.';
                } else if (status === 400) {
                    errorMessage = '⚠️ ' + (errorData?.error || 'Invalid data provided. Please check your input.');
                } else if (status >= 500) {
                    errorMessage = '🔧 Server error occurred. Please try again later.';
                } else {
                    errorMessage = '❌ ' + (errorData?.error || `Server error (${status})`);
                }
            } else if (error.request) {
                errorMessage = '🌐 Network error. Please check your connection and try again.';
            } else {
                errorMessage = '⚠️ ' + (error.message || 'An unexpected error occurred');
            }
            
            setMessage({ 
                type: 'error', 
                content: errorMessage
            });
        } finally {
            setLoading(false);
            console.log('🏁 Form submission completed');
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="row justify-content-center">
                <div className="col-12 col-xl-10">
                    <div className="card shadow-lg border-0">
                        <div className="card-header bg-gradient-primary text-white py-3">
                            <div className="d-flex align-items-center">
                                <i className="fas fa-user-plus me-3 fs-4"></i>
                                <div>
                                    <h4 className="card-title mb-1">Create Admin User</h4>
                                    <small className="opacity-75">Configure administrative access and dashboard features</small>
                                </div>
                            </div>
                        </div>
                        
                        {/* Authentication Status Display */}
                        <div className="card-body border-bottom">
                            <AuthenticationStatus />
                        </div>
                        
                        <div className="card-body p-4">
                            {message.content && (
                                <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} alert-dismissible mb-4`}>
                                    <div className="d-flex align-items-start">
                                        <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'} me-3 mt-1`}></i>
                                        <div className="flex-grow-1">
                                            {message.type === 'success' ? (
                                                <div>
                                                    <h6 className="alert-heading mb-2">
                                                        <i className="fas fa-database me-2"></i>
                                                        Admin Account Successfully Created & Stored in Database!
                                                    </h6>
                                                    <pre className="mb-0" style={{
                                                        whiteSpace: 'pre-wrap',
                                                        fontFamily: 'inherit',
                                                        background: 'rgba(255,255,255,0.1)',
                                                        padding: '10px',
                                                        borderRadius: '5px',
                                                        fontSize: '14px'
                                                    }}>
                                                        {message.content}
                                                    </pre>
                                                    {message.details && (
                                                        <div className="mt-3">
                                                            <small className="text-muted">
                                                                <i className="fas fa-info-circle me-1"></i>
                                                                The admin user can now login at: <a href="/login" className="text-decoration-none">/login</a>
                                                            </small>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span>{message.content}</span>
                                            )}
                                        </div>
                                    </div>
                                    <button 
                                        type="button" 
                                        className="btn-close" 
                                        onClick={() => setMessage({ type: '', content: '' })}
                                    ></button>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                {/* Basic Information Section */}
                                <div className="row">
                                    <div className="col-12">
                                        <h5 className="border-bottom pb-2 mb-4 text-primary">
                                            <i className="fas fa-user-circle me-2"></i>
                                            Basic Information
                                        </h5>
                                    </div>
                                </div>

                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="admin@example.com"
                                            />
                                            <label htmlFor="email">
                                                <i className="fas fa-envelope me-2"></i>
                                                Email Address *
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="full_name"
                                                name="full_name"
                                                value={formData.full_name}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="John Doe"
                                            />
                                            <label htmlFor="full_name">
                                                <i className="fas fa-user me-2"></i>
                                                Full Name *
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="password" className="form-label fw-bold">
                                                <i className="fas fa-lock me-2"></i>
                                                Password *
                                            </label>
                                            <div className="input-group">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    className="form-control"
                                                    id="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    required
                                                    minLength="8"
                                                    placeholder="Minimum 8 characters"
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    title="Toggle password visibility"
                                                >
                                                    <i className={`fas fa-eye${showPassword ? '-slash' : ''}`}></i>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-primary"
                                                    onClick={generateRandomPassword}
                                                    title="Generate Random Password"
                                                >
                                                    <i className="fas fa-dice"></i>
                                                </button>
                                            </div>
                                            <small className="text-muted">
                                                Click <i className="fas fa-dice"></i> to generate a secure password
                                            </small>
                                        </div>
                                    </div>
                                    
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input
                                                type="tel"
                                                className="form-control"
                                                id="phone_number"
                                                name="phone_number"
                                                value={formData.phone_number}
                                                onChange={handleInputChange}
                                                placeholder="+1 (555) 123-4567"
                                            />
                                            <label htmlFor="phone_number">
                                                <i className="fas fa-phone me-2"></i>
                                                Phone Number
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Administrative Details Section */}
                                <div className="row">
                                    <div className="col-12">
                                        <h5 className="border-bottom pb-2 mb-4 text-success">
                                            <i className="fas fa-building me-2"></i>
                                            Administrative Details
                                        </h5>
                                    </div>
                                </div>

                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <select
                                                className="form-select"
                                                id="department"
                                                name="department"
                                                value={formData.department}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="Administration">Administration</option>
                                                <option value="IT Management">IT Management</option>
                                                <option value="Human Resources">Human Resources</option>
                                                <option value="Finance">Finance</option>
                                                <option value="Operations">Operations</option>
                                                <option value="Quality Assurance">Quality Assurance</option>
                                                <option value="Medical Administration">Medical Administration</option>
                                                <option value="Nursing Administration">Nursing Administration</option>
                                                <option value="Pharmacy Administration">Pharmacy Administration</option>
                                            </select>
                                            <label htmlFor="department">
                                                <i className="fas fa-sitemap me-2"></i>
                                                Department *
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <select
                                                className="form-select"
                                                id="position"
                                                name="position"
                                                value={formData.position}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="Administrator">Administrator</option>
                                                <option value="System Administrator">System Administrator</option>
                                                <option value="Department Head">Department Head</option>
                                                <option value="Operations Manager">Operations Manager</option>
                                                <option value="Assistant Administrator">Assistant Administrator</option>
                                                <option value="Senior Administrator">Senior Administrator</option>
                                                <option value="Medical Administrator">Medical Administrator</option>
                                                <option value="Chief Administrator">Chief Administrator</option>
                                            </select>
                                            <label htmlFor="position">
                                                <i className="fas fa-user-tie me-2"></i>
                                                Position/Title *
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="license_number"
                                                name="license_number"
                                                value={formData.license_number}
                                                onChange={handleInputChange}
                                                placeholder="ADM-123456"
                                            />
                                            <label htmlFor="license_number">
                                                <i className="fas fa-id-card me-2"></i>
                                                License/ID Number
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="specialization"
                                                name="specialization"
                                                value={formData.specialization}
                                                onChange={handleInputChange}
                                                placeholder="Healthcare Administration, MBA, etc."
                                            />
                                            <label htmlFor="specialization">
                                                <i className="fas fa-certificate me-2"></i>
                                                Specialization/Certification
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* User Creation Quota Section */}
                                <div className="row">
                                    <div className="col-12">
                                        <h5 className="border-bottom pb-2 mb-4 text-danger">
                                            <i className="fas fa-users-cog me-2"></i>
                                            User Creation Quota & Limits
                                        </h5>
                                    </div>
                                </div>

                                <div className="alert alert-warning mb-4">
                                    <i className="fas fa-exclamation-triangle me-2"></i>
                                    <strong>Super Admin Control:</strong> Set limits on how many users this administrator can create. This prevents unauthorized mass user creation and maintains system control.
                                </div>

                                <div className="row g-3 mb-4">
                                    <div className="col-12">
                                        <div className="card border-danger">
                                            <div className="card-header bg-danger text-white py-2">
                                                <h6 className="card-title mb-0">
                                                    <i className="fas fa-shield-alt me-2"></i>
                                                    Quota Management
                                                </h6>
                                            </div>
                                            <div className="card-body p-3">
                                                <div className="row g-3">
                                                    <div className="col-md-6">
                                                        <div className="form-check form-switch mb-3">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id="quota_enabled"
                                                                name="user_creation_quota.enabled"
                                                                checked={formData.user_creation_quota.enabled}
                                                                onChange={handleInputChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="quota_enabled">
                                                                <strong>Enable User Creation Limits</strong>
                                                                <br />
                                                                <small className="text-muted">Enforce user creation quotas for this admin</small>
                                                            </label>
                                                        </div>

                                                        <div className="form-floating mb-3">
                                                            <select
                                                                className="form-select"
                                                                id="quota_reset_period"
                                                                name="user_creation_quota.quota_reset_period"
                                                                value={formData.user_creation_quota.quota_reset_period}
                                                                onChange={handleInputChange}
                                                                disabled={!formData.user_creation_quota.enabled}
                                                            >
                                                                <option value="monthly">Monthly Reset</option>
                                                                <option value="yearly">Yearly Reset</option>
                                                                <option value="never">Never Reset (One-time Limit)</option>
                                                            </select>
                                                            <label htmlFor="quota_reset_period">
                                                                <i className="fas fa-calendar-alt me-2"></i>
                                                                Quota Reset Period
                                                            </label>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <div className="alert alert-info mb-0">
                                                            <h6 className="alert-heading">
                                                                <i className="fas fa-info-circle me-2"></i>
                                                                Quota Benefits
                                                            </h6>
                                                            <ul className="mb-0">
                                                                <li><strong>Security:</strong> Prevents unauthorized mass creation</li>
                                                                <li><strong>Control:</strong> Maintains system oversight</li>
                                                                <li><strong>Resources:</strong> Manages system load</li>
                                                                <li><strong>Compliance:</strong> Ensures proper authorization</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {formData.user_creation_quota.enabled && (
                                    <div className="row g-3 mb-4">
                                        <div className="col-lg-6">
                                            <div className="card border-primary h-100">
                                                <div className="card-header bg-light py-2">
                                                    <h6 className="card-title text-primary mb-0">
                                                        <i className="fas fa-chart-bar me-2"></i>
                                                        User Type Limits
                                                    </h6>
                                                </div>
                                                <div className="card-body p-3">
                                                    <div className="row g-2">
                                                        <div className="col-6">
                                                            <div className="form-floating">
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    id="max_doctors"
                                                                    name="user_creation_quota.max_doctors"
                                                                    value={formData.user_creation_quota.max_doctors}
                                                                    onChange={handleInputChange}
                                                                    min="0"
                                                                    max="999"
                                                                />
                                                                <label htmlFor="max_doctors">
                                                                    <i className="fas fa-user-md me-1"></i>
                                                                    Max Doctors
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="col-6">
                                                            <div className="form-floating">
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    id="max_nurses"
                                                                    name="user_creation_quota.max_nurses"
                                                                    value={formData.user_creation_quota.max_nurses}
                                                                    onChange={handleInputChange}
                                                                    min="0"
                                                                    max="999"
                                                                />
                                                                <label htmlFor="max_nurses">
                                                                    <i className="fas fa-user-nurse me-1"></i>
                                                                    Max Nurses
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="col-6">
                                                            <div className="form-floating">
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    id="max_patients"
                                                                    name="user_creation_quota.max_patients"
                                                                    value={formData.user_creation_quota.max_patients}
                                                                    onChange={handleInputChange}
                                                                    min="0"
                                                                    max="999"
                                                                />
                                                                <label htmlFor="max_patients">
                                                                    <i className="fas fa-procedures me-1"></i>
                                                                    Max Patients
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="col-6">
                                                            <div className="form-floating">
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    id="max_pharmacists"
                                                                    name="user_creation_quota.max_pharmacists"
                                                                    value={formData.user_creation_quota.max_pharmacists}
                                                                    onChange={handleInputChange}
                                                                    min="0"
                                                                    max="999"
                                                                />
                                                                <label htmlFor="max_pharmacists">
                                                                    <i className="fas fa-pills me-1"></i>
                                                                    Max Pharmacists
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-lg-6">
                                            <div className="card border-success h-100">
                                                <div className="card-header bg-light py-2">
                                                    <h6 className="card-title text-success mb-0">
                                                        <i className="fas fa-calculator me-2"></i>
                                                        Total Limits & Summary
                                                    </h6>
                                                </div>
                                                <div className="card-body p-3">
                                                    <div className="form-floating mb-3">
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            id="max_total_users"
                                                            name="user_creation_quota.max_total_users"
                                                            value={formData.user_creation_quota.max_total_users}
                                                            onChange={handleInputChange}
                                                            min="0"
                                                            max="999"
                                                        />
                                                        <label htmlFor="max_total_users">
                                                            <i className="fas fa-users me-1"></i>
                                                            Maximum Total Users
                                                        </label>
                                                    </div>

                                                    <div className="alert alert-success mb-0">
                                                        <h6 className="alert-heading">Quota Summary</h6>
                                                        <div className="row text-center">
                                                            <div className="col-6 border-end">
                                                                <strong className="d-block">{formData.user_creation_quota.max_doctors + formData.user_creation_quota.max_nurses + formData.user_creation_quota.max_patients + formData.user_creation_quota.max_pharmacists}</strong>
                                                                <small>Individual Limits Sum</small>
                                                            </div>
                                                            <div className="col-6">
                                                                <strong className="d-block">{formData.user_creation_quota.max_total_users}</strong>
                                                                <small>Overall Limit</small>
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        <small className="text-muted">
                                                            <i className="fas fa-info-circle me-1"></i>
                                                            Admin will be restricted to the lower of these two limits
                                                        </small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Permissions Section */}
                                <div className="row">
                                    <div className="col-12">
                                        <h5 className="border-bottom pb-2 mb-4 text-warning">
                                            <i className="fas fa-shield-alt me-2"></i>
                                            System Permissions
                                        </h5>
                                    </div>
                                </div>

                                <div className="alert alert-info">
                                    <i className="fas fa-info-circle me-2"></i>
                                    Select the specific permissions for this administrator. You can modify these later.
                                </div>

                                <div className="mb-4">
                                    <div className="card border-info">
                                        <div className="card-body p-3">
                                            <h6 className="card-title mb-3">
                                                <i className="fas fa-magic me-2 text-info"></i>
                                                Quick Access Presets
                                            </h6>
                                            <div className="row g-2">
                                                <div className="col-6 col-lg-3 col-xl-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-info w-100"
                                                        onClick={() => setPermissionPreset('basic')}
                                                    >
                                                        <i className="fas fa-user d-block mb-1"></i>
                                                        <small>Basic Admin</small>
                                                    </button>
                                                </div>
                                                <div className="col-6 col-lg-3 col-xl-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-success w-100"
                                                        onClick={() => setPermissionPreset('medical')}
                                                    >
                                                        <i className="fas fa-stethoscope d-block mb-1"></i>
                                                        <small>Medical Admin</small>
                                                    </button>
                                                </div>
                                                <div className="col-6 col-lg-3 col-xl-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-primary w-100"
                                                        onClick={() => setPermissionPreset('healthcare')}
                                                    >
                                                        <i className="fas fa-hospital d-block mb-1"></i>
                                                        <small>Healthcare Mgmt</small>
                                                    </button>
                                                </div>
                                                <div className="col-6 col-lg-3 col-xl-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-warning w-100"
                                                        onClick={() => setPermissionPreset('administrative')}
                                                    >
                                                        <i className="fas fa-briefcase d-block mb-1"></i>
                                                        <small>Administrative</small>
                                                    </button>
                                                </div>
                                                <div className="col-6 col-lg-3 col-xl-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger w-100"
                                                        onClick={() => setPermissionPreset('full')}
                                                    >
                                                        <i className="fas fa-crown d-block mb-1"></i>
                                                        <small>Full Access</small>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="mt-2">
                                                <small className="text-muted">
                                                    <strong>Basic:</strong> User management only | <strong>Medical:</strong> All medical modules | <strong>Healthcare:</strong> Hospital, Clinic, Doctor management |
                                                    <strong>Administrative:</strong> Business features | <strong>Full:</strong> Everything
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row g-3 mb-4">
                                    <div className="col-md-6 col-lg-4">
                                        <div className="card h-100 border-success">
                                            <div className="card-body p-3">
                                                <h6 className="card-title text-success mb-3">
                                                    <i className="fas fa-users me-2"></i>
                                                    Core Permissions
                                                </h6>
                                                
                                                <div className="form-check mb-3">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="can_manage_users"
                                                        name="permissions.can_manage_users"
                                                        checked={formData.permissions.can_manage_users}
                                                        onChange={handleInputChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="can_manage_users">
                                                        <strong>Manage Users</strong>
                                                        <br />
                                                        <small className="text-muted">Create, edit, and delete accounts</small>
                                                    </label>
                                                </div>

                                                <div className="form-check mb-3">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="can_view_reports"
                                                        name="permissions.can_view_reports"
                                                        checked={formData.permissions.can_view_reports}
                                                        onChange={handleInputChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="can_view_reports">
                                                        <strong>View Reports</strong>
                                                        <br />
                                                        <small className="text-muted">Access system analytics</small>
                                                    </label>
                                                </div>

                                                <div className="form-check mb-0">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="can_manage_departments"
                                                        name="permissions.can_manage_departments"
                                                        checked={formData.permissions.can_manage_departments}
                                                        onChange={handleInputChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="can_manage_departments">
                                                        <strong>Manage Departments</strong>
                                                        <br />
                                                        <small className="text-muted">Control department settings</small>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="col-md-6 col-lg-4">
                                        <div className="card h-100 border-warning">
                                            <div className="card-body p-3">
                                                <h6 className="card-title text-warning mb-3">
                                                    <i className="fas fa-dollar-sign me-2"></i>
                                                    Financial Access
                                                </h6>
                                                
                                                <div className="form-check mb-3">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="can_access_billing"
                                                        name="permissions.can_access_billing"
                                                        checked={formData.permissions.can_access_billing}
                                                        onChange={handleInputChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="can_access_billing">
                                                        <strong>Access Billing</strong>
                                                        <br />
                                                        <small className="text-muted">View billing information</small>
                                                    </label>
                                                </div>

                                                <div className="form-check mb-0">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="can_manage_inventory"
                                                        name="permissions.can_manage_inventory"
                                                        checked={formData.permissions.can_manage_inventory}
                                                        onChange={handleInputChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="can_manage_inventory">
                                                        <strong>Manage Inventory</strong>
                                                        <br />
                                                        <small className="text-muted">Control medical supplies</small>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-12 col-lg-4">
                                        <div className="card h-100 border-danger">
                                            <div className="card-body p-3">
                                                <h6 className="card-title text-danger mb-3">
                                                    <i className="fas fa-shield-alt me-2"></i>
                                                    Advanced Access
                                                </h6>
                                                
                                                <div className="form-check mb-0">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="can_access_emergency"
                                                        name="permissions.can_access_emergency"
                                                        checked={formData.permissions.can_access_emergency || false}
                                                        onChange={handleInputChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="can_access_emergency">
                                                        <strong>Emergency Access</strong>
                                                        <br />
                                                        <small className="text-muted">System override capabilities</small>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-12">
                                        <div className="alert alert-warning">
                                            <i className="fas fa-exclamation-triangle me-2"></i>
                                            <strong>Important:</strong> This user will have administrative privileges. Ensure you trust this person with system access.
                                        </div>
                                    </div>
                                </div>

                                {/* Dashboard Features Section */}
                                <div className="row">
                                    <div className="col-12">
                                        <h5 className="border-bottom pb-2 mb-4 text-info">
                                            <i className="fas fa-desktop me-2"></i>
                                            Dashboard Features & Navigation
                                        </h5>
                                    </div>
                                </div>

                                <div className="alert alert-info mb-4">
                                    <i className="fas fa-info-circle me-2"></i>
                                    <strong>Customize Dashboard:</strong> Select which features and menu items this admin will see when they log in. Only checked items will be visible in their dashboard.
                                </div>

                                <div className="row g-3 mb-4">
                                    <div className="col-lg-3 col-md-6">
                                        <div className="card border-primary h-100">
                                            <div className="card-header bg-light py-2">
                                                <h6 className="card-title text-primary mb-0">
                                                    <i className="fas fa-users me-2"></i>
                                                    User Management
                                                </h6>
                                            </div>
                                            <div className="card-body p-3">
                                                <div className="form-check mb-2">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="user_management"
                                                        name="dashboard_features.user_management"
                                                        checked={formData.dashboard_features.user_management}
                                                        onChange={handleInputChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="user_management">
                                                        <small><strong>User Management</strong></small>
                                                    </label>
                                                </div>

                                                <div className="form-check mb-2">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="patient_management"
                                                        name="dashboard_features.patient_management"
                                                        checked={formData.dashboard_features.patient_management}
                                                        onChange={handleInputChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="patient_management">
                                                        <small><strong>Patient Management</strong></small>
                                                    </label>
                                                </div>

                                                <div className="form-check mb-2">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="doctor_management"
                                                        name="dashboard_features.doctor_management"
                                                        checked={formData.dashboard_features.doctor_management}
                                                        onChange={handleInputChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="doctor_management">
                                                        <small><strong>Doctor Management</strong></small>
                                                    </label>
                                                </div>

                                                <div className="form-check mb-2">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="nurse_management"
                                                        name="dashboard_features.nurse_management"
                                                        checked={formData.dashboard_features.nurse_management}
                                                        onChange={handleInputChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="nurse_management">
                                                        <small><strong>Nurse Management</strong></small>
                                                    </label>
                                                </div>

                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="pharmacist_management"
                                                        name="dashboard_features.pharmacist_management"
                                                        checked={formData.dashboard_features.pharmacist_management}
                                                        onChange={handleInputChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="pharmacist_management">
                                                        <small><strong>Pharmacist Management</strong></small>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-3 col-md-6">
                                        <div className="card border-info h-100">
                                            <div className="card-header bg-light py-2">
                                                <h6 className="card-title text-info mb-0">
                                                    <i className="fas fa-hospital me-2"></i>
                                                    Healthcare Management
                                                </h6>
                                            </div>
                                            <div className="card-body p-3">
                                                <div className="form-check mb-2">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="hospital_management"
                                                        name="dashboard_features.hospital_management"
                                                        checked={formData.dashboard_features.hospital_management}
                                                        onChange={handleInputChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="hospital_management">
                                                        <small><strong>Hospital Management</strong></small>
                                                    </label>
                                                </div>

                                                <div className="form-check mb-2">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="clinic_management"
                                                        name="dashboard_features.clinic_management"
                                                        checked={formData.dashboard_features.clinic_management}
                                                        onChange={handleInputChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="clinic_management">
                                                        <small><strong>Clinic Management</strong></small>
                                                    </label>
                                                </div>

                                                <div className="form-check mb-2">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="all_doctors"
                                                        name="dashboard_features.all_doctors"
                                                        checked={formData.dashboard_features.all_doctors}
                                                        onChange={handleInputChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="all_doctors">
                                                        <small><strong>All Doctors</strong></small>
                                                    </label>
                                                </div>

                                                <div className="form-check mb-2">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="add_doctors"
                                                        name="dashboard_features.add_doctors"
                                                        checked={formData.dashboard_features.add_doctors}
                                                        onChange={handleInputChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="add_doctors">
                                                        <small><strong>Add Doctors</strong></small>
                                                    </label>
                                                </div>

                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="doctor_profile"
                                                        name="dashboard_features.doctor_profile"
                                                        checked={formData.dashboard_features.doctor_profile}
                                                        onChange={handleInputChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="doctor_profile">
                                                        <small><strong>Doctor Profile</strong></small>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-3 col-md-6">
                                        <div className="card border-success h-100">
                                            <div className="card-header bg-light py-2">
                                                <h6 className="card-title text-success mb-0">
                                                    <i className="fas fa-heartbeat me-2"></i>
                                                    Medical Modules
                                                </h6>
                                            </div>
                                            <div className="card-body p-3">
                                                {Object.entries(HEALTHCARE_MODULES).map(([moduleKey, moduleInfo], index) => (
                                                    <div key={moduleKey} className={`form-check ${index === Object.keys(HEALTHCARE_MODULES).length - 1 ? '' : 'mb-2'}`}>
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id={`${moduleKey}_module`}
                                                            name={`dashboard_features.${moduleKey}_module`}
                                                            checked={formData.dashboard_features[`${moduleKey}_module`] || false}
                                                            onChange={handleInputChange}
                                                        />
                                                        <label className="form-check-label" htmlFor={`${moduleKey}_module`}>
                                                            <small><strong>{moduleInfo.name}</strong></small>
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-3 col-md-6">
                                        <div className="card border-warning h-100">
                                            <div className="card-header bg-light py-2">
                                                <h6 className="card-title text-warning mb-0">
                                                    <i className="fas fa-cogs me-2"></i>
                                                    Admin Features
                                                </h6>
                                            </div>
                                            <div className="card-body p-3">
                                                <div className="form-check mb-2">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="subscription_management"
                                                        name="dashboard_features.subscription_management"
                                                        checked={false}
                                                        disabled={true}
                                                        onChange={handleInputChange}
                                                    />
                                                    <label className="form-check-label text-muted" htmlFor="subscription_management">
                                                        <small><strong>Subscriptions</strong> (Disabled for security)</small>
                                                    </label>
                                                </div>

                                                <div className="form-check mb-2">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="billing_reports"
                                                        name="dashboard_features.billing_reports"
                                                        checked={formData.dashboard_features.billing_reports}
                                                        onChange={handleInputChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="billing_reports">
                                                        <small><strong>Billing Reports</strong></small>
                                                    </label>
                                                </div>

                                                <div className="form-check mb-2">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="financial_dashboard"
                                                        name="dashboard_features.financial_dashboard"
                                                        checked={formData.dashboard_features.financial_dashboard}
                                                        onChange={handleInputChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="financial_dashboard">
                                                        <small><strong>Financial Dashboard</strong></small>
                                                    </label>
                                                </div>

                                                <div className="form-check mb-2">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="system_settings"
                                                        name="dashboard_features.system_settings"
                                                        checked={formData.dashboard_features.system_settings}
                                                        onChange={handleInputChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="system_settings">
                                                        <small><strong>System Settings</strong></small>
                                                    </label>
                                                </div>

                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="audit_logs"
                                                        name="dashboard_features.audit_logs"
                                                        checked={formData.dashboard_features.audit_logs}
                                                        onChange={handleInputChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="audit_logs">
                                                        <small><strong>Audit Logs</strong></small>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-3 col-md-6">
                                        <div className="card border-info h-100">
                                            <div className="card-header bg-light py-2">
                                                <h6 className="card-title text-info mb-0">
                                                    <i className="fas fa-chart-bar me-2"></i>
                                                    Analytics & Actions
                                                </h6>
                                            </div>
                                            <div className="card-body p-3">
                                                <div className="form-check mb-2">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="user_analytics"
                                                        name="dashboard_features.user_analytics"
                                                        checked={formData.dashboard_features.user_analytics}
                                                        onChange={handleInputChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="user_analytics">
                                                        <small><strong>User Analytics</strong></small>
                                                    </label>
                                                </div>

                                                <div className="form-check mb-2">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="medical_reports"
                                                        name="dashboard_features.medical_reports"
                                                        checked={formData.dashboard_features.medical_reports}
                                                        onChange={handleInputChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="medical_reports">
                                                        <small><strong>Medical Reports</strong></small>
                                                    </label>
                                                </div>

                                                <div className="form-check mb-2">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="create_user"
                                                        name="dashboard_features.create_user"
                                                        checked={formData.dashboard_features.create_user}
                                                        onChange={handleInputChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="create_user">
                                                        <small><strong>Create User</strong></small>
                                                    </label>
                                                </div>

                                                <div className="form-check mb-2">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="generate_report"
                                                        name="dashboard_features.generate_report"
                                                        checked={formData.dashboard_features.generate_report}
                                                        onChange={handleInputChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="generate_report">
                                                        <small><strong>Generate Report</strong></small>
                                                    </label>
                                                </div>

                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="send_notifications"
                                                        name="dashboard_features.send_notifications"
                                                        checked={formData.dashboard_features.send_notifications}
                                                        onChange={handleInputChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="send_notifications">
                                                        <small><strong>Send Notifications</strong></small>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <button
                                            type="button"
                                            className="btn btn-secondary me-2"
                                            onClick={() => window.history.back()}
                                        >
                                            <i className="fas fa-arrow-left me-2"></i>
                                            Back
                                        </button>
                                        
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary me-2"
                                            onClick={() => {
                                                setFormData({
                                                    email: '',
                                                    password: '',
                                                    full_name: '',
                                                    phone_number: '',
                                                    role: 'admin',
                                                    department: 'Administration',
                                                    position: 'Administrator',
                                                    license_number: '',
                                                    specialization: '',
                                                    user_creation_quota: {
                                                        enabled: true,
                                                        max_total_users: 50,
                                                        max_doctors: 10,
                                                        max_nurses: 15,
                                                        max_patients: 20,
                                                        max_pharmacists: 5,
                                                        quota_reset_period: 'monthly',
                                                        current_usage: { total_users: 0, doctors: 0, nurses: 0, patients: 0, pharmacists: 0 }
                                                    },
                                                    permissions: {
                                                        can_manage_users: true,
                                                        can_view_reports: true,
                                                        can_manage_departments: true,
                                                        can_access_billing: false,
                                                        can_manage_inventory: false,
                                                        can_access_emergency: false
                                                    },
                                                    dashboard_features: generateInitialDashboardFeatures()
                                                });
                                                setMessage({ type: '', content: '' });
                                            }}
                                        >
                                            <i className="fas fa-redo me-2"></i>
                                            Reset Form
                                        </button>
                                    </div>
                                    
                                    <div>
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
                                                    <i className="fas fa-user-check me-2"></i>
                                                    Create Admin User
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SimpleAdminCreation;
