import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import apiClient from '../services/api';
import { generateModulePermissions } from '../utils/modulePermissions';

const PermissionContext = createContext();

export const usePermissions = () => {
    const context = useContext(PermissionContext);
    if (!context) {
        // Return a default context instead of throwing an error
        console.warn('usePermissions called outside of PermissionProvider, returning default values');
        return {
            permissions: null,
            dashboardFeatures: null,
            quota: null,
            loading: false,
            user: null,
            refreshPermissions: async () => {},
            hasPermission: () => false,
            canAccess: () => false,
            getQuotaUsage: () => ({ used: 0, limit: 0 }),
            isQuotaExceeded: () => false
        };
    }
    return context;
};

export const PermissionProvider = ({ children }) => {
    const [permissions, setPermissions] = useState(null);
    const [dashboardFeatures, setDashboardFeatures] = useState(null);
    const [quota, setQuota] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const fetchUserPermissions = async () => {
        try {
            setLoading(true);
            
            // Check if user is already available from localStorage
            const storedUser = localStorage.getItem('user');
            const superAdminDetected = localStorage.getItem('superAdminDetected');
            
            if (storedUser) {
                try {
                    const userData = JSON.parse(storedUser);
                    console.log('Stored user data found:', userData);
                    
                    // Set user data immediately
                    setUser({
                        ...userData,
                        is_super_admin: userData.role === 'super_admin' || userData.is_super_admin === true,
                        full_name: userData.fullName || userData.full_name
                    });
                    
                    // If it's a super admin or superAdminDetected flag is set, set default permissions immediately
                    if (userData.role === 'super_admin' || userData.is_super_admin === true) {
                        console.log('Super admin detected, setting full permissions');
                        
                        setPermissions({
                            can_manage_users: true,
                            can_view_reports: true,
                            can_manage_departments: true,
                            can_access_billing: true,
                            can_manage_inventory: true,
                            can_access_emergency: true,
                            can_create_admins: true,
                            can_manage_system_settings: true,
                            can_access_all_features: true
                        });
                        
                        setDashboardFeatures({
                            user_management: true,
                            patient_management: true,
                            doctor_management: true,
                            nurse_management: true,
                            pharmacist_management: true,
                            medicine_module: true,
                            dentistry_module: true,
                            dermatology_module: true,
                            pathology_module: true,
                            radiology_module: true,
                            homeopathy_module: true,
                            allopathy_module: true,
                            dna_sequencing_module: true,
                            secureneat_module: true,
                            subscription_management: true,
                            billing_reports: true,
                            financial_dashboard: true,
                            system_settings: true,
                            audit_logs: true
                        });
                        
                        setLoading(false);
                        console.log('Super admin permissions set successfully');
                        return; // Skip API call for super admin
                    } else if (userData.role === 'admin') {
                        console.log('Regular admin detected, fetching actual permissions from API...');
                        // For regular admins, we MUST fetch actual permissions from API
                        // Don't set hardcoded permissions - let the API call handle it
                    }
                } catch (e) {
                    console.error('Error parsing stored user:', e);
                }
            }
            
            // Fallback to API fetch
            await fetchFromAPI();
            
        } catch (error) {
            console.error('Failed to fetch user permissions:', error);
            setDefaultPermissions();
        }
    };
    
    const fetchFromAPI = async () => {
        try {
            // Get token from localStorage if not in Redux store
            const token = localStorage.getItem('access_token') || 
                         localStorage.getItem('token') || 
                         localStorage.getItem('authToken');
            
            // Create headers with token if available
            const headers = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            const response = await apiClient.get('/api/hospital/management/me/permissions/', {
                headers
            });
            
            if (response.data.success) {
                const userData = response.data.user;
                console.log('API Response - User Data:', userData);
                
                // Ensure super admin flag is properly set
                if (userData.role === 'super_admin') {
                    userData.is_super_admin = true;
                }
                setUser(userData);
                
                // If user is super admin, ensure they have all permissions regardless of API response
                if (userData.role === 'super_admin' || userData.is_super_admin) {
                    console.log('Setting SUPER ADMIN permissions');
                    setPermissions({
                        can_manage_users: true,
                        can_view_reports: true,
                        can_manage_departments: true,
                        can_access_billing: true,
                        can_manage_inventory: true,
                        can_access_emergency: true,
                        can_create_admins: true,
                        can_manage_system_settings: true,
                        can_access_all_features: true,
                        ...userData.permissions // Include any additional permissions from API
                    });
                    
                    setDashboardFeatures({
                        user_management: true,
                        patient_management: true,
                        doctor_management: true,
                        nurse_management: true,
                        pharmacist_management: true,
                        medicine_module: true,
                        dentistry_module: true,
                        dermatology_module: true,
                        pathology_module: true,
                        radiology_module: true,
                        homeopathy_module: true,
                        allopathy_module: true,
                        dna_sequencing_module: true,
                        secureneat_module: true,
                        subscription_management: true,
                        billing_reports: true,
                        financial_dashboard: true,
                        system_settings: true,
                        audit_logs: true,
                        user_analytics: true,
                        medical_reports: true,
                        revenue_reports: true,
                        appointment_analytics: true,
                        inventory_reports: true,
                        create_user: true,
                        schedule_appointment: true,
                        generate_report: true,
                        backup_system: true,
                        send_notifications: true,
                        ...userData.dashboard_features // Include any additional features from API
                    });
                } else {
                    console.log('Setting REGULAR ADMIN permissions:', {
                        user: userData,
                        permissions: userData.permissions,
                        dashboardFeatures: userData.dashboard_features
                    });
                    setPermissions(userData.permissions);
                    setDashboardFeatures(userData.dashboard_features);
                }
                
                setQuota(userData.quota);
                console.log('Permissions fetched from API successfully');
            }
        } catch (error) {
            console.error('API permissions fetch failed:', error);
            // Don't override if we already have super admin permissions set
            if (!permissions) {
                setDefaultPermissions();
            }
        } finally {
            setLoading(false);
        }
    };
    
    const setDefaultPermissions = () => {
        // Set default minimal permissions on error
        setPermissions({
            can_manage_users: false,
            can_view_reports: false,
            can_manage_departments: false,
            can_access_billing: false,
            can_manage_inventory: false,
            can_access_emergency: false,
            can_create_admins: false,
            can_manage_system_settings: false,
            can_access_all_features: false
        });
        setDashboardFeatures({});
        setQuota(null);
        setLoading(false);
    };

    useEffect(() => {
        // Check for authentication tokens in various storage formats
        const accessToken = localStorage.getItem('access_token') || 
                           localStorage.getItem('token') || 
                           localStorage.getItem('authToken');
        
        const superAdminDetected = localStorage.getItem('superAdminDetected');
        const storedUser = localStorage.getItem('user');
        
        // Validate superAdminDetected flag - only allow for actual super admin users
        if (superAdminDetected === 'true' && storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                // Only allow superAdminDetected flag for mastermind@xerxez.in or users with super_admin role
                if (userData.email !== 'mastermind@xerxez.in' && userData.role !== 'super_admin') {
                    console.log('Removing invalid superAdminDetected flag for user:', userData.email);
                    localStorage.removeItem('superAdminDetected');
                }
            } catch (e) {
                console.error('Error validating superAdminDetected flag:', e);
                localStorage.removeItem('superAdminDetected');
            }
        }
        
        if (accessToken) {
            console.log('Token found, fetching permissions...');
            fetchUserPermissions();
        } else {
            console.log('No authentication token found');
            setLoading(false);
        }
    }, []);

    // Memoized permission check functions to prevent unnecessary recalculations
    const hasPermission = useMemo(() => {
        return (permission) => {
            if (!permissions) return false;
            return permissions[permission] === true;
        };
    }, [permissions]);

    const hasDashboardFeature = useMemo(() => {
        return (feature) => {
            if (!dashboardFeatures) {
                return false;
            }
            return dashboardFeatures[feature] === true;
        };
    }, [dashboardFeatures]);

    const isSuperAdmin = useMemo(() => {
        return () => {
            // Check both is_super_admin flag and role field for super admin detection
            return user?.is_super_admin === true || user?.role === 'super_admin';
        };
    }, [user?.is_super_admin, user?.role]);

    const isAdmin = useMemo(() => {
        return () => {
            return user?.role === 'admin' || isSuperAdmin();
        };
    }, [user?.role, isSuperAdmin]);

    // Specific permission checks
    const canManageUsers = () => isSuperAdmin() || hasPermission('can_manage_users');
    const canCreateAdmins = () => {
        const result = isSuperAdmin();
        return result;
    }; // Only super admin can create other admins
    const canViewReports = () => isSuperAdmin() || hasPermission('can_view_reports');
    const canAccessBilling = () => isSuperAdmin() || hasPermission('can_access_billing');
    const canManageInventory = () => isSuperAdmin() || hasPermission('can_manage_inventory');
    const canAccessEmergency = () => isSuperAdmin() || hasPermission('can_access_emergency');
    const canManageSystemSettings = () => isSuperAdmin();

    // Dynamic Module Access System - Automatically handles ALL modules
    const dynamicPermissions = useMemo(() => {
        return generateModulePermissions(isSuperAdmin, hasDashboardFeature);
    }, [permissions, dashboardFeatures, user, isSuperAdmin]);
    
    // Extract individual permission functions for backward compatibility
    const canAccessMedicineModule = dynamicPermissions.canAccessMedicineModule;
    const canAccessDentistryModule = dynamicPermissions.canAccessDentistryModule;
    const canAccessDermatologyModule = dynamicPermissions.canAccessDermatologyModule;
    const canAccessPathologyModule = dynamicPermissions.canAccessPathologyModule;
    const canAccessRadiologyModule = dynamicPermissions.canAccessRadiologyModule;
    const canAccessHomeopathyModule = dynamicPermissions.canAccessHomeopathyModule;
    const canAccessAllopathyModule = dynamicPermissions.canAccessAllopathyModule;
    const canAccessCosmetologyModule = dynamicPermissions.canAccessCosmetologyModule;
    const canAccessDnaSequencingModule = dynamicPermissions.canAccessDnaSequencingModule;
    const canAccessSecureneatModule = dynamicPermissions.canAccessSecureneatModule;
    
    // Administrative Functions - Also generated dynamically
    const canAccessUserManagement = dynamicPermissions.canAccessUserManagement;
    const canAccessPatientManagement = dynamicPermissions.canAccessPatientManagement;
    const canAccessDoctorManagement = dynamicPermissions.canAccessDoctorManagement;
    const canAccessHospitalManagement = () => isSuperAdmin() || hasDashboardFeature('hospital_management');
    const canAccessClinicManagement = () => isSuperAdmin() || hasDashboardFeature('clinic_management');
    
    // Subscription Management - DISABLED due to security concerns
    const canAccessSubscriptionManagement = () => false; // Always return false to disable feature
    const canAccessBillingReports = () => isSuperAdmin() || hasDashboardFeature('billing_reports');
    const canAccessFinancialDashboard = () => isSuperAdmin() || hasDashboardFeature('financial_dashboard');
    const canAccessSystemSettings = () => isSuperAdmin() || hasDashboardFeature('system_settings');
    const canAccessAuditLogs = () => isSuperAdmin() || hasDashboardFeature('audit_logs');

    const value = {
        permissions,
        dashboardFeatures,
        quota,
        user,
        loading,
        
        // Refresh permissions
        refreshPermissions: fetchUserPermissions,
        
        // Debug function to force super admin permissions (ONLY for mastermind@xerxez.in)
        debugSetSuperAdmin: () => {
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            if (currentUser.email !== 'mastermind@xerxez.in') {
                console.error('DEBUG: Super admin permissions can only be set for mastermind@xerxez.in');
                return false;
            }
            
            console.log('DEBUG: Setting super admin permissions for authorized user');
            const superAdminUser = {
                id: 1,
                email: 'mastermind@xerxez.in',
                username: 'mastermind@xerxez.in',
                full_name: 'Super Administrator',
                role: 'super_admin',
                is_super_admin: true,
                is_superuser: true,
                is_staff: true
            };
            
            setUser(superAdminUser);
            localStorage.setItem('user', JSON.stringify(superAdminUser));
            localStorage.setItem('superAdminDetected', 'true');
            
            setPermissions({
                can_manage_users: true,
                can_view_reports: true,
                can_manage_departments: true,
                can_access_billing: true,
                can_manage_inventory: true,
                can_access_emergency: true,
                can_create_admins: true,
                can_manage_system_settings: true,
                can_access_all_features: true
            });
            
            setDashboardFeatures({
                user_management: true,
                patient_management: true,
                doctor_management: true,
                nurse_management: true,
                pharmacist_management: true,
                medicine_module: true,
                dentistry_module: true,
                dermatology_module: true,
                pathology_module: true,
                radiology_module: true,
                homeopathy_module: true,
                allopathy_module: true,
                dna_sequencing_module: true,
                secureneat_module: true,
                subscription_management: true,
                billing_reports: true,
                financial_dashboard: true,
                system_settings: true,
                audit_logs: true
            });
            
            setLoading(false);
            return true;
        },
        
        // General checks
        hasPermission,
        hasDashboardFeature,
        isSuperAdmin,
        isAdmin,
        
        // Specific permission checks
        canManageUsers,
        canCreateAdmins,
        canViewReports,
        canAccessBilling,
        canManageInventory,
        canAccessEmergency,
        canManageSystemSettings,
        
        // Dashboard feature checks
        canAccessUserManagement,
        canAccessPatientManagement,
        canAccessHospitalManagement,
        canAccessClinicManagement,
        canAccessMedicineModule,
        canAccessDentistryModule,
        canAccessDermatologyModule,
        canAccessPathologyModule,
        canAccessRadiologyModule,
        canAccessDoctorManagement,
        canAccessHomeopathyModule,
        canAccessAllopathyModule,
        canAccessDnaSequencingModule,
        canAccessSecureneatModule,
        canAccessCosmetologyModule,
        canAccessSubscriptionManagement,
        canAccessBillingReports,
        canAccessFinancialDashboard,
        canAccessSystemSettings,
        canAccessAuditLogs
    };

    return (
        <PermissionContext.Provider value={value}>
            {children}
        </PermissionContext.Provider>
    );
};

export default PermissionContext;
