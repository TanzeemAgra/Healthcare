// Advanced Medicine Features Configuration
// This file contains all feature configurations using soft coding techniques

// Feature flags for enabling/disabling functionality
export const ADVANCED_MEDICINE_FEATURES = {
  // Core features that are implemented
  DASHBOARD: true,
  PATIENT_REPORTS: true,
  SOAP_NOTES: true,
  
  // Advanced features to implement
  PROTOCOL_SUMMARIZER: true,
  CONTRACT_REDLINING: true,
  PHYSICIAN_ASSISTANT: true,
  AI_BOOKING_ASSISTANT: true,
  INSURANCE_COPILOT: true,
  CSR_ASSISTANT: true,
  RESEARCH_REVIEW: true,
  BACK_OFFICE_AUTOMATION: true,
  CLINICAL_SEARCH: true,
  
  // Feature-specific toggles
  REAL_TIME_UPDATES: true,
  AUTO_SAVE: true,
  NOTIFICATIONS: true,
  ANALYTICS: true,
  EXPORT_FUNCTIONALITY: true,
  BULK_OPERATIONS: true,
};

// Section configurations with detailed settings
export const MEDICINE_SECTIONS = {
  dashboard: {
    key: 'dashboard',
    label: 'Dashboard',
    icon: 'ri-dashboard-line',
    enabled: ADVANCED_MEDICINE_FEATURES.DASHBOARD,
    description: 'Overview of all advanced medicine features',
    permissions: ['read'],
    color: 'primary'
  },
  'patient-reports': {
    key: 'patient-reports',
    label: 'Patient Reports',
    icon: 'ri-file-text-line',
    enabled: ADVANCED_MEDICINE_FEATURES.PATIENT_REPORTS,
    description: 'Comprehensive patient report management',
    permissions: ['read', 'write', 'delete'],
    color: 'success'
  },
  'soap-notes': {
    key: 'soap-notes',
    label: 'SOAP Notes',
    icon: 'ri-file-list-3-line',
    enabled: ADVANCED_MEDICINE_FEATURES.SOAP_NOTES,
    description: 'Subjective, Objective, Assessment, Plan notes',
    permissions: ['read', 'write', 'delete'],
    color: 'info'
  },
  protocols: {
    key: 'protocols',
    label: 'Protocol Summarizer',
    icon: 'ri-file-copy-line',
    enabled: ADVANCED_MEDICINE_FEATURES.PROTOCOL_SUMMARIZER,
    description: 'AI-powered medical protocol summarization',
    permissions: ['read', 'write'],
    color: 'warning'
  },
  contracts: {
    key: 'contracts',
    label: 'Contract Redlining',
    icon: 'ri-contract-line',
    enabled: ADVANCED_MEDICINE_FEATURES.CONTRACT_REDLINING,
    description: 'Automated contract review and redlining',
    permissions: ['read', 'write'],
    color: 'danger'
  },
  'physician-assistant': {
    key: 'physician-assistant',
    label: 'Physician Assistant',
    icon: 'ri-user-heart-line',
    enabled: ADVANCED_MEDICINE_FEATURES.PHYSICIAN_ASSISTANT,
    description: 'AI-powered physician assistance tools',
    permissions: ['read', 'write'],
    color: 'primary'
  },
  'booking-assistant': {
    key: 'booking-assistant',
    label: 'AI Booking Assistant',
    icon: 'ri-calendar-check-line',
    enabled: ADVANCED_MEDICINE_FEATURES.AI_BOOKING_ASSISTANT,
    description: 'Intelligent appointment booking system',
    permissions: ['read', 'write', 'delete'],
    color: 'success'
  },
  insurance: {
    key: 'insurance',
    label: 'Insurance Copilot',
    icon: 'ri-shield-check-line',
    enabled: ADVANCED_MEDICINE_FEATURES.INSURANCE_COPILOT,
    description: 'Insurance policy management and claims',
    permissions: ['read', 'write'],
    color: 'info'
  },
  'csr-assistant': {
    key: 'csr-assistant',
    label: 'CSR Assistant',
    icon: 'ri-customer-service-line',
    enabled: ADVANCED_MEDICINE_FEATURES.CSR_ASSISTANT,
    description: 'Customer service representative tools',
    permissions: ['read', 'write'],
    color: 'warning'
  },
  'research-review': {
    key: 'research-review',
    label: 'Research Review',
    icon: 'ri-microscope-line',
    enabled: ADVANCED_MEDICINE_FEATURES.RESEARCH_REVIEW,
    description: 'Medical research review and analysis',
    permissions: ['read', 'write'],
    color: 'danger'
  },
  automation: {
    key: 'automation',
    label: 'Back Office Automation',
    icon: 'ri-settings-line',
    enabled: ADVANCED_MEDICINE_FEATURES.BACK_OFFICE_AUTOMATION,
    description: 'Automated back office processes',
    permissions: ['read', 'write', 'admin'],
    color: 'primary'
  },
  'clinical-search': {
    key: 'clinical-search',
    label: 'Clinical Search',
    icon: 'ri-search-line',
    enabled: ADVANCED_MEDICINE_FEATURES.CLINICAL_SEARCH,
    description: 'Advanced clinical history search',
    permissions: ['read'],
    color: 'success'
  }
};

// Data management configurations
export const DATA_CONFIG = {
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100],
    SHOW_SIZE_SELECTOR: true
  },
  SORTING: {
    DEFAULT_SORT: 'created_at',
    DEFAULT_ORDER: 'desc',
    SORTABLE_FIELDS: ['name', 'date', 'status', 'priority']
  },
  FILTERING: {
    ENABLED: true,
    QUICK_FILTERS: true,
    ADVANCED_FILTERS: true,
    SAVED_FILTERS: true
  },
  SEARCH: {
    ENABLED: true,
    REAL_TIME: true,
    MIN_CHARACTERS: 2,
    SEARCH_FIELDS: ['name', 'description', 'content']
  }
};

// UI/UX configurations
export const UI_CONFIG = {
  THEME: {
    PRIMARY_COLOR: 'blue',
    SUCCESS_COLOR: 'green',
    WARNING_COLOR: 'orange',
    DANGER_COLOR: 'red',
    INFO_COLOR: 'cyan'
  },
  LAYOUT: {
    SIDEBAR_WIDTH: '250px',
    CARD_SPACING: '1rem',
    BORDER_RADIUS: '0.375rem'
  },
  NOTIFICATIONS: {
    ENABLED: ADVANCED_MEDICINE_FEATURES.NOTIFICATIONS,
    POSITION: 'top-right',
    AUTO_DISMISS: true,
    DISMISS_TIME: 5000
  },
  ANIMATIONS: {
    ENABLED: true,
    DURATION: 300,
    EASING: 'ease-in-out'
  }
};

// API endpoints configuration
export const API_ENDPOINTS = {
  BASE_URL: '/api/medicine/advanced',
  ENDPOINTS: {
    PROTOCOLS: '/protocols',
    CONTRACTS: '/contracts',
    PHYSICIAN_ASSISTANT: '/physician-assistant',
    BOOKING_ASSISTANT: '/booking-assistant',
    INSURANCE: '/insurance',
    CSR_ASSISTANT: '/csr-assistant',
    RESEARCH_REVIEW: '/research-review',
    AUTOMATION: '/automation',
    CLINICAL_SEARCH: '/clinical-search'
  }
};

// Mock data templates for development
export const MOCK_DATA_TEMPLATES = {
  PROTOCOL: {
    id: '',
    title: '',
    category: '',
    content: '',
    status: 'draft',
    created_at: '',
    updated_at: '',
    created_by: ''
  },
  CONTRACT: {
    id: '',
    name: '',
    type: '',
    status: 'pending',
    parties: [],
    key_terms: [],
    redlines: [],
    created_at: '',
    updated_at: ''
  },
  BOOKING: {
    id: '',
    patient_name: '',
    appointment_type: '',
    date: '',
    time: '',
    physician: '',
    status: 'scheduled',
    notes: ''
  }
};

// Permission levels for different user roles
export const USER_PERMISSIONS = {
  ADMIN: ['read', 'write', 'delete', 'admin'],
  DOCTOR: ['read', 'write'],
  NURSE: ['read', 'write'],
  STAFF: ['read'],
  VIEWER: ['read']
};

// Export utility functions
export const getEnabledSections = () => {
  return Object.values(MEDICINE_SECTIONS).filter(section => section.enabled);
};

export const getSectionByKey = (key) => {
  return MEDICINE_SECTIONS[key] || null;
};

export const hasPermission = (userRole, requiredPermission, sectionKey) => {
  const userPermissions = USER_PERMISSIONS[userRole.toUpperCase()] || [];
  const section = getSectionByKey(sectionKey);
  
  if (!section) return false;
  
  return userPermissions.includes(requiredPermission) && 
         section.permissions.includes(requiredPermission);
};

export const isFeatureEnabled = (featureName) => {
  return ADVANCED_MEDICINE_FEATURES[featureName] === true;
};
