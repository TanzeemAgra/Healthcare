/**
 * Dashboard Configuration - Soft Coding Approach
 * All configurable parameters for the Patient Dashboard
 */

export const DASHBOARD_CONFIG = {
  // API Configuration
  API: {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
    ENDPOINTS: {
      PATIENTS: '/centralized-patients/all/',
      UPDATES: '/centralized-patients/updates/',
      SEARCH: '/centralized-patients/search/',
      STATISTICS: '/centralized-patients/statistics/',
      AI_RISK: '/ai/risk-assessment/',
      AI_PREDICTIONS: '/ai/predictions/',
      AI_ANOMALIES: '/ai/anomaly-detection/',
      AI_INSIGHTS: '/ai/intelligent-insights/',
      AI_CHAT: '/ai/healthcare-chat/'
    }
  },

  // UI Configuration
  UI: {
    REFRESH_INTERVAL: 30000, // 30 seconds
    AI_ANALYSIS_INTERVAL: 30000,
    ALERT_CHECK_INTERVAL: 60000,
    AUTO_HIDE_NOTIFICATIONS: true,
    NOTIFICATION_DELAY: 5000,
    ITEMS_PER_PAGE: 10,
    MAX_NOTIFICATIONS: 5
  },

  // Notifications Configuration
  notifications: {
    maxVisible: 5,
    autoHide: true,
    autoHideDelay: 5000,
    types: {
      success: 'success',
      error: 'error',
      warning: 'warning',
      info: 'info'
    }
  },

  // Department Configuration
  DEPARTMENTS: {
    MEDICINE: { name: 'Medicine', icon: 'RiMedicineBottleLine', color: '#007bff' },
    RADIOLOGY: { name: 'Radiology', icon: 'RiScanLine', color: '#28a745' },
    PATHOLOGY: { name: 'Pathology', icon: 'RiTestTubeLine', color: '#dc3545' },
    DENTISTRY: { name: 'Dentistry', icon: 'RiTeethLine', color: '#ffc107' },
    DERMATOLOGY: { name: 'Dermatology', icon: 'RiSkinLine', color: '#fd7e14' },
    COSMETOLOGY: { name: 'Cosmetology', icon: 'RiScissorsFill', color: '#e83e8c' },
    HOMEOPATHY: { name: 'Homeopathy', icon: 'RiLeafLine', color: '#20c997' },
    HOSPITAL: { name: 'Hospital', icon: 'RiHospitalLine', color: '#6f42c1' },
    NETFLIX: { name: 'Netflix Services', icon: 'RiSmartphoneFill', color: '#dc3545' },
    SUBSCRIPTIONS: { name: 'Subscriptions', icon: 'RiCapsuleLine', color: '#6c757d' },
    ORTHOPEDICS: { name: 'Orthopedics', icon: 'RiPulseLine', color: '#fd7e14' },
    CARDIOLOGY: { name: 'Cardiology', icon: 'RiHeartPulseLine', color: '#dc3545' },
    NEUROLOGY: { name: 'Neurology', icon: 'RiBrainLine', color: '#6f42c1' },
    ALLOPATHY: { name: 'Allopathy', icon: 'RiBugLine', color: '#17a2b8' },
    'DNA SEQUENCING': { name: 'DNA Sequencing', icon: 'RiDnaLine', color: '#28a745' },
    'SECURENEAT FEATURES': { name: 'SecureNeat Features', icon: 'RiShieldCheckLine', color: '#007bff' }
  },

  // Status Configuration
  STATUS: {
    CRITICAL: { name: 'Critical', color: '#dc3545', priority: 5 },
    'UNDER TREATMENT': { name: 'Under Treatment', color: '#ffc107', priority: 4 },
    ACTIVE: { name: 'Active', color: '#28a745', priority: 3 },
    STABLE: { name: 'Stable', color: '#17a2b8', priority: 2 },
    DISCHARGED: { name: 'Discharged', color: '#6c757d', priority: 1 }
  },

  // AI Configuration
  AI: {
    FEATURES: {
      RISK_ASSESSMENT: { enabled: true, name: 'Risk Assessment' },
      PREDICTIVE_MODE: { enabled: true, name: 'Predictive Analytics' },
      REAL_TIME_ANALYSIS: { enabled: true, name: 'Real-time Analysis' },
      SMART_ALERTS: { enabled: true, name: 'Intelligent Alerts' },
      VOICE_COMMANDS: { enabled: true, name: 'Voice Commands' },
      AI_CHAT: { enabled: true, name: 'AI Assistant' },
      AUTO_TRANSLATE: { enabled: false, name: 'Auto Translation' },
      ADAPTIVE_LAYOUT: { enabled: true, name: 'Adaptive UI' }
    },
    MODELS: {
      RISK_ASSESSMENT: 'HealthcareAI-v2.1',
      PREDICTIONS: 'DeepHealthcare-v3.2',
      NLP: 'MedicalNLP-v1.8'
    },
    THRESHOLDS: {
      HIGH_RISK: 70,
      MEDIUM_RISK: 40,
      CRITICAL_PATIENTS: 5,
      DEPARTMENT_OVERLOAD: 10
    }
  },

  // Languages
  LANGUAGES: {
    EN: { code: 'en', name: 'English' },
    ES: { code: 'es', name: 'Spanish' },
    FR: { code: 'fr', name: 'French' },
    DE: { code: 'de', name: 'German' },
    ZH: { code: 'zh', name: 'Chinese' }
  },

  // Theme Configuration
  THEMES: {
    LIGHT: {
      name: 'Light',
      primary: '#007bff',
      secondary: '#6c757d',
      success: '#28a745',
      danger: '#dc3545',
      warning: '#ffc107',
      info: '#17a2b8'
    },
    DARK: {
      name: 'Dark',
      primary: '#0d6efd',
      secondary: '#6c757d',
      success: '#198754',
      danger: '#dc3545',
      warning: '#ffc107',
      info: '#0dcaf0'
    }
  },

  // Performance Configuration
  PERFORMANCE: {
    LAZY_LOADING: true,
    VIRTUAL_SCROLLING: false,
    CACHING_ENABLED: true,
    CACHE_DURATION: 300000, // 5 minutes
    DEBOUNCE_DELAY: 300,
    THROTTLE_DELAY: 100
  },

  // Security Configuration
  SECURITY: {
    REQUIRED_ROLES: ['super_admin', 'admin', 'doctor'],
    SESSION_TIMEOUT: 3600000, // 1 hour
    AUTO_LOGOUT_WARNING: 300000, // 5 minutes before logout
    ENCRYPTION_ENABLED: true
  },

  // Error Messages
  MESSAGES: {
    ERRORS: {
      NETWORK: 'Network connection error. Please check your internet connection.',
      UNAUTHORIZED: 'You are not authorized to access this resource.',
      SERVER: 'Server error occurred. Please try again later.',
      VALIDATION: 'Please check your input and try again.',
      NOT_FOUND: 'Requested resource not found.'
    },
    SUCCESS: {
      SAVE: 'Data saved successfully.',
      UPDATE: 'Data updated successfully.',
      DELETE: 'Data deleted successfully.',
      SYNC: 'Data synchronized successfully.'
    },
    INFO: {
      LOADING: 'Loading data...',
      PROCESSING: 'Processing request...',
      ANALYZING: 'AI analysis in progress...',
      SYNCING: 'Synchronizing data...'
    }
  }
};

// Utility functions for configuration
export const getDepartmentConfig = (department) => {
  return DASHBOARD_CONFIG.DEPARTMENTS[department?.toUpperCase()] || {
    name: department,
    icon: 'RiHospitalLine',
    color: '#6c757d'
  };
};

export const getStatusConfig = (status) => {
  return DASHBOARD_CONFIG.STATUS[status?.toUpperCase()] || {
    name: status,
    color: '#6c757d',
    priority: 1
  };
};

export const isFeatureEnabled = (feature) => {
  return DASHBOARD_CONFIG.AI.FEATURES[feature]?.enabled || false;
};

export const getApiUrl = (endpoint) => {
  return DASHBOARD_CONFIG.API.BASE_URL + DASHBOARD_CONFIG.API.ENDPOINTS[endpoint];
};

export const getMessage = (type, key) => {
  return DASHBOARD_CONFIG.MESSAGES[type.toUpperCase()]?.[key.toUpperCase()] || 'Unknown message';
};

export default DASHBOARD_CONFIG;
