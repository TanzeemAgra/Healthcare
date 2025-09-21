/**
 * Dynamic Module Permission System
 * Automatically detects and manages permissions for new healthcare modules
 */

// Define all available healthcare modules - automatically sync with backend
export const HEALTHCARE_MODULES = {
  // Core Medical Modules
  medicine: {
    name: 'Medicine',
    description: 'General medicine and primary care'
  },
  dentistry: {
    name: 'Dentistry', 
    description: 'Dental care and oral health'
  },
  dermatology: {
    name: 'Dermatology',
    description: 'Skin care and dermatological treatments'
  },
  pathology: {
    name: 'Pathology',
    description: 'Laboratory testing and diagnostics'
  },
  radiology: {
    name: 'Radiology',
    description: 'Medical imaging and radiology'
  },
  homeopathy: {
    name: 'Homeopathy',
    description: 'Homeopathic medicine and treatments'
  },
  allopathy: {
    name: 'Allopathy',
    description: 'Modern allopathic medicine'
  },
  cosmetology: {
    name: 'Cosmetology',
    description: 'Cosmetic treatments and procedures'
  },
  dna_sequencing: {
    name: 'DNA Sequencing',
    description: 'Genetic analysis and DNA testing'
  },
  secureneat: {
    name: 'SecureNeat',
    description: 'Security and authentication systems'
  }
  
  // Future modules will be automatically added here
  // cardiology: { name: 'Cardiology', description: 'Heart and cardiovascular care' },
  // neurology: { name: 'Neurology', description: 'Neurological disorders and treatment' },
  // psychiatry: { name: 'Psychiatry', description: 'Mental health and psychiatric care' },
  // oncology: { name: 'Oncology', description: 'Cancer treatment and care' },
  // gynecology: { name: 'Gynecology', description: 'Women\'s health and reproductive care' },
  // pediatrics: { name: 'Pediatrics', description: 'Children\'s health and medical care' },
  // orthopedics: { name: 'Orthopedics', description: 'Bone and joint treatments' }
};

// Administrative features  
export const ADMIN_FEATURES = {
  user_management: {
    name: 'User Management',
    description: 'Create and manage system users'
  },
  patient_management: {
    name: 'Patient Management', 
    description: 'Manage patient records and information'
  },
  doctor_management: {
    name: 'Doctor Management',
    description: 'Manage doctor profiles and schedules'
  },
  nurse_management: {
    name: 'Nurse Management',
    description: 'Manage nursing staff and assignments'
  },
  pharmacist_management: {
    name: 'Pharmacist Management',
    description: 'Manage pharmacy staff and operations'
  },
  // Healthcare Management Features
  hospital_management: {
    name: 'Hospital Management',
    description: 'Manage hospital operations and administration'
  },
  clinic_management: {
    name: 'Clinic Management',
    description: 'Manage clinic operations and patient flow'
  },
  all_doctors: {
    name: 'All Doctors',
    description: 'View and manage all doctors in the system'
  },
  add_doctors: {
    name: 'Add Doctors',
    description: 'Add new doctors to the system'
  },
  doctor_profile: {
    name: 'Doctor Profile',
    description: 'Manage doctor profiles and credentials'
  },
  // System Administration Features
  subscription_management: {
    name: 'Subscription Management',
    description: 'Manage subscription plans and billing'
  },
  billing_reports: {
    name: 'Billing Reports',
    description: 'Generate and view billing reports'
  },
  financial_dashboard: {
    name: 'Financial Dashboard',
    description: 'View financial analytics and metrics'
  },
  system_settings: {
    name: 'System Settings',
    description: 'Configure system settings and preferences'
  },
  audit_logs: {
    name: 'Audit Logs',
    description: 'View system audit logs and activity'
  }
};

/**
 * Creates a permission checker function for any module
 * @param {string} moduleName - The module name (e.g., 'medicine', 'dentistry')
 * @param {function} isSuperAdmin - Function to check if user is super admin
 * @param {function} hasDashboardFeature - Function to check dashboard feature access
 * @returns {function} Permission checker function
 */
export const createModulePermissionChecker = (moduleName, isSuperAdmin, hasDashboardFeature) => {
  return () => {
    const featureName = `${moduleName}_module`;
    const result = isSuperAdmin() || hasDashboardFeature(featureName);
    return result;
  };
};

/**
 * Automatically generates permission functions for all modules
 * @param {function} isSuperAdmin - Super admin checker function
 * @param {function} hasDashboardFeature - Dashboard feature checker function
 * @returns {object} Object containing all permission checker functions
 */
export const generateModulePermissions = (isSuperAdmin, hasDashboardFeature) => {
  const permissions = {};
  
  // Generate permission functions for all healthcare modules
  Object.entries(HEALTHCARE_MODULES).forEach(([moduleKey, moduleInfo]) => {
    const functionName = `canAccess${moduleKey.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join('')}Module`;
    
    permissions[functionName] = createModulePermissionChecker(moduleKey, isSuperAdmin, hasDashboardFeature);
  });
  
  // Generate permission functions for admin features
  Object.entries(ADMIN_FEATURES).forEach(([featureKey, featureInfo]) => {
    const functionName = `canAccess${featureKey.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join('')}`;
    
    permissions[functionName] = () => isSuperAdmin() || hasDashboardFeature(featureKey);
  });
  
  // Development logging (removed to reduce console noise)
  // console.log('Generated Module Permissions:', Object.keys(permissions));
  return permissions;
};

/**
 * Validates if a module exists in the system
 * @param {string} moduleName - Module name to validate
 * @returns {boolean} True if module exists
 */
export const isValidModule = (moduleName) => {
  return Object.keys(HEALTHCARE_MODULES).includes(moduleName);
};

/**
 * Gets all available modules for UI generation
 * @returns {array} Array of module objects with display information
 */
export const getAllModules = () => {
  return Object.entries(HEALTHCARE_MODULES).map(([key, moduleInfo]) => ({
    key,
    value: key,
    displayName: moduleInfo.name,
    description: moduleInfo.description,
    permissionKey: `${key}_module`
  }));
};

/**
 * Module metadata for UI rendering
 */
export const MODULE_METADATA = {
  medicine: {
    icon: 'ri-stethoscope-fill',
    color: 'primary',
    category: 'Clinical',
    description: 'General Medicine & Patient Care'
  },
  dentistry: {
    icon: 'ri-tooth-fill',
    color: 'info', 
    category: 'Specialty',
    description: 'Dental Care & Oral Health'
  },
  dermatology: {
    icon: 'ri-user-heart-fill',
    color: 'warning',
    category: 'Specialty',
    description: 'Skin Care & Dermatological Treatments'
  },
  pathology: {
    icon: 'ri-microscope-fill',
    color: 'danger',
    category: 'Diagnostic',
    description: 'Laboratory Tests & Pathological Analysis'
  },
  radiology: {
    icon: 'ri-scan-fill',
    color: 'success',
    category: 'Diagnostic', 
    description: 'Medical Imaging & Radiology'
  },
  cosmetology: {
    icon: 'ri-brush-fill',
    color: 'pink',
    category: 'Aesthetic',
    description: 'Beauty Treatments & Cosmetic Procedures',
    badge: 'New'
  },
  dna_sequencing: {
    icon: 'ri-dna-line',
    color: 'purple',
    category: 'Research',
    description: 'Genetic Analysis & DNA Sequencing',
    badge: 'AI'
  },
  secureneat: {
    icon: 'ri-shield-check-fill',
    color: 'dark',
    category: 'Education',
    description: 'Medical Education & Exam Preparation',
    badge: 'Pro'
  }
};

export default {
  HEALTHCARE_MODULES,
  ADMIN_FEATURES,
  createModulePermissionChecker,
  generateModulePermissions,
  isValidModule,
  getAllModules,
  MODULE_METADATA
};
