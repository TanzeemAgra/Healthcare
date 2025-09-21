/**
 * API Endpoints Configuration
 * Centralized API endpoint constants for soft coding approach
 */

// Base Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3
};

// Authentication Endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/api/auth/login/',
  LOGOUT: '/api/auth/logout/',
  REGISTER: '/api/hospital/register/',
  COMPREHENSIVE_REGISTER: '/api/hospital/comprehensive-register/',
  PROFILE: '/api/auth/profile/',
  CSRF_TOKEN: '/api/auth/csrf-token/',
  TOKEN_REFRESH: '/api/auth/token/refresh/',
  PASSWORD_RESET: '/api/auth/password-reset/',
  PASSWORD_CONFIRM: '/api/auth/password-reset-confirm/',
  // First Login and Password Management
  CHECK_FIRST_LOGIN: '/api/hospital/auth/check-first-login/',
  COMPLETE_FIRST_LOGIN: '/api/hospital/auth/complete-first-login/',
  CHANGE_PASSWORD: '/api/hospital/auth/change-password/',
  VALIDATE_PASSWORD: '/api/hospital/auth/validate-password/'
};

// User Management Endpoints
export const USER_MANAGEMENT_ENDPOINTS = {
  LIST_USERS: '/api/hospital/management/users/',
  CREATE_USER: '/api/hospital/management/users/create/',
  CREATE_ADMIN: '/api/hospital/management/users/create-admin/',
  UPDATE_USER: (userId) => `/api/hospital/management/users/${userId}/update/`,
  DELETE_USER: (userId) => `/api/hospital/management/users/${userId}/delete/`,
  USER_DETAILS: (userId) => `/api/hospital/management/users/${userId}/`,
  USER_PERMISSIONS: (userId) => `/api/hospital/management/users/${userId}/permissions/`,
  BULK_ACTIONS: '/api/hospital/management/users/bulk-actions/',
  STATISTICS: '/api/hospital/management/users/statistics/',
  EXPORT: '/api/hospital/management/users/export/',
  ADMIN_USERS: '/api/hospital/management/admin-users/'
};

// Module Endpoints
export const MODULE_ENDPOINTS = {
  SUBSCRIPTIONS: '/api/subscriptions/',
  HOSPITAL: '/api/hospital/',
  RADIOLOGY: '/api/radiology/',
  PATHOLOGY: '/api/pathology/',
  MEDICINE: '/api/medicine/',
  DENTISTRY: '/api/dentistry/',
  DERMATOLOGY: '/api/dermatology/',
  COSMETOLOGY: '/api/cosmetology/',
  PATIENTS: '/api/patients/',
  NETFLIX: '/api/netflix/',
  HOMEOPATHY: '/api/homeopathy/',
  SECURENEAT: '/api/secureneat/'
};

// Dermatology Specific Endpoints
export const DERMATOLOGY_ENDPOINTS = {
  BASE: '/api/dermatology/',
  DASHBOARD: {
    STATISTICS: '/api/dermatology/dashboard/statistics/',
    RECENT_ACTIVITY: '/api/dermatology/dashboard/recent_activity/',
    ALERTS: '/api/dermatology/dashboard/alerts/'
  },
  PATIENTS: {
    LIST: '/api/dermatology/patients/',
    CREATE: '/api/dermatology/patients/',
    UPDATE: '/api/dermatology/patients/:id/',
    DELETE: '/api/dermatology/patients/:id/',
    DETAIL: '/api/dermatology/patients/:id/',
    BULK_DELETE: '/api/dermatology/patients/bulk-delete/',
    DELETE_ALL: '/api/dermatology/delete-all-patients/'
  },
  CONSULTATIONS: {
    LIST: '/api/dermatology/consultations/',
    CREATE: '/api/dermatology/consultations/',
    UPDATE: '/api/dermatology/consultations/:id/',
    DELETE: '/api/dermatology/consultations/:id/',
    DETAIL: '/api/dermatology/consultations/:id/'
  },
  DEPARTMENTS: '/api/dermatology/departments/',
  SKIN_CONDITIONS: '/api/dermatology/skin-conditions/',
  SKIN_PHOTOS: '/api/dermatology/skin-photos/',
  AI_ANALYSES: '/api/dermatology/ai-analyses/',
  TREATMENT_PLANS: '/api/dermatology/treatment-plans/',
  TREATMENT_OUTCOMES: '/api/dermatology/treatment-outcomes/',
  CONSULTATION_ACTIONS: {
    START: (consultationId) => `/api/dermatology/consultations/${consultationId}/start_consultation/`,
    COMPLETE: (consultationId) => `/api/dermatology/consultations/${consultationId}/complete_consultation/`
  },
  TREATMENT_ACTIONS: {
    ACTIVATE: (planId) => `/api/dermatology/treatment-plans/${planId}/activate/`,
    COMPLETE: (planId) => `/api/dermatology/treatment-plans/${planId}/complete/`
  },
  AI_ACTIONS: {
    REQUEST_ANALYSIS: (photoId) => `/api/dermatology/skin-photos/${photoId}/request_ai_analysis/`,
    VALIDATE_ANALYSIS: (analysisId) => `/api/dermatology/ai-analyses/${analysisId}/validate_analysis/`
  }
};

// Medicine Specific Endpoints
export const MEDICINE_ENDPOINTS = {
  BASE: '/api/medicine/',
  DASHBOARD: {
    STATISTICS: '/api/medicine/dashboard/statistics/',
    STATS: '/api/medicine/dashboard/stats/',
    GENERAL_MEDICINE_STATS: '/api/medicine/dashboard/general_medicine_stats/',
    EMERGENCY_MEDICINE_STATS: '/api/medicine/dashboard/emergency_medicine_stats/',
    RECENT_ACTIVITY: '/api/medicine/dashboard/recent_activity/',
    ALERTS: '/api/medicine/dashboard/alerts/'
  },
  PATIENTS: '/api/medicine/patients/',
  PRESCRIPTIONS: '/api/medicine/prescriptions/',
  MEDICATIONS: '/api/medicine/medications/',
  DIAGNOSES: '/api/medicine/diagnoses/',
  SYMPTOMS: '/api/medicine/symptoms/',
  VITAL_SIGNS: '/api/medicine/vital-signs/',
  CONSULTATIONS: '/api/medicine/consultations/',
  MEDICAL_RECORDS: '/api/medicine/medical-records/',
  DIABETES: {
    DASHBOARD_STATS: '/api/medicine/diabetes-dashboard/stats/',
    PATIENTS: '/api/medicine/diabetes-patients/',
    GLUCOSE_READINGS: '/api/medicine/glucose-readings/',
    HBA1C_RECORDS: '/api/medicine/hba1c-records/',
    MEDICATIONS: '/api/medicine/diabetes-medications/',
    SCREENINGS: '/api/medicine/diabetes-screenings/',
    GOALS: '/api/medicine/diabetes-goals/',
    MANAGEMENT: '/api/medicine/diabetes-management/',
    AI_INSIGHTS: '/api/medicine/diabetes-patients/ai_insights/',
    RISK_PREDICTIONS: '/api/medicine/diabetes-patients/risk_predictions/',
    AI_ANALYSIS: (patientId) => `/api/medicine/diabetes-patients/${patientId}/ai_analysis/`
  },
  APPOINTMENTS: '/api/medicine/appointments/',
  LAB_TESTS: '/api/medicine/lab-tests/',
  TREATMENT_PLANS: '/api/medicine/treatment-plans/',
  EMERGENCY: {
    CASES: '/api/medicine/emergency-cases/',
    TRIAGE_BOARD: '/api/medicine/emergency-cases/triage_board/',
    ACTIVE_CASES: '/api/medicine/emergency-cases/active_cases/'
  },
  RETINOPATHY: {
    SCREENINGS: '/api/medicine/retinopathy-screenings/',
    AI_ANALYSIS: '/api/medicine/retinopathy-ai-analysis/',
    FUNDUS_IMAGES: '/api/medicine/fundus-images/',
    ANALYZE: '/api/medicine/analyze-retinopathy/',
    GENERATE_REPORT: (imageId) => `/api/medicine/generate-retinopathy-report/${imageId}/`
  },
  ACTIONS: {
    PRESCRIBE: (patientId) => `/api/medicine/patients/${patientId}/prescribe/`,
    DIAGNOSE: (patientId) => `/api/medicine/patients/${patientId}/diagnose/`,
    UPDATE_VITALS: (patientId) => `/api/medicine/patients/${patientId}/vitals/`
  }
};

// Radiology Specific Endpoints
export const RADIOLOGY_ENDPOINTS = {
  BASE: '/api/radiology/',
  DASHBOARD: {
    STATISTICS: '/api/radiology/dashboard/statistics/',
    RECENT_ACTIVITY: '/api/radiology/dashboard/recent_activity/',
    ALERTS: '/api/radiology/dashboard/alerts/'
  },
  SCANS: '/api/radiology/scans/',
  REPORTS: '/api/radiology/reports/',
  IMAGING_STUDIES: '/api/radiology/imaging-studies/',
  EQUIPMENT: '/api/radiology/equipment/',
  APPOINTMENTS: '/api/radiology/appointments/',
  TECHNICIANS: '/api/radiology/technicians/',
  ACTIONS: {
    SCHEDULE_SCAN: '/api/radiology/appointments/schedule/',
    UPLOAD_IMAGE: '/api/radiology/scans/upload/',
    GENERATE_REPORT: (scanId) => `/api/radiology/scans/${scanId}/generate-report/`,
    APPROVE_REPORT: (reportId) => `/api/radiology/reports/${reportId}/approve/`,
    ANALYZE_REPORT: '/api/radiology/analyze-report/',
    ADVANCED_ANALYZE_REPORT: '/api/radiology/advanced-analyze-report/'
  }
};

// Pathology Specific Endpoints
export const PATHOLOGY_ENDPOINTS = {
  BASE: '/api/pathology/',
  DASHBOARD: {
    STATISTICS: '/api/pathology/dashboard/statistics/',
    RECENT_ACTIVITY: '/api/pathology/dashboard/recent_activity/',
    ALERTS: '/api/pathology/dashboard/alerts/'
  },
  TESTS: '/api/pathology/tests/',
  RESULTS: '/api/pathology/results/',
  SPECIMENS: '/api/pathology/specimens/',
  LAB_ORDERS: '/api/pathology/lab-orders/',
  REPORTS: '/api/pathology/reports/',
  EQUIPMENT: '/api/pathology/equipment/',
  ACTIONS: {
    PROCESS_SPECIMEN: (specimenId) => `/api/pathology/specimens/${specimenId}/process/`,
    APPROVE_RESULT: (resultId) => `/api/pathology/results/${resultId}/approve/`,
    GENERATE_REPORT: (testId) => `/api/pathology/tests/${testId}/generate-report/`
  }
};

// Dentistry Specific Endpoints
export const DENTISTRY_ENDPOINTS = {
  BASE: '/api/dentistry/',
  DASHBOARD: {
    STATISTICS: '/api/dentistry/dashboard/statistics/',
    RECENT_ACTIVITY: '/api/dentistry/dashboard/recent_activity/',
    ALERTS: '/api/dentistry/dashboard/alerts/'
  },
  PATIENTS: {
    LIST: '/api/dentistry/patients/',
    CREATE: '/api/dentistry/patients/create/',
    DETAIL: (patientId) => `/api/dentistry/patients/${patientId}/`,
    UPDATE: (patientId) => `/api/dentistry/patients/${patientId}/update/`,
    DELETE: (patientId) => `/api/dentistry/patients/${patientId}/delete/`
  },
  APPOINTMENTS: {
    LIST: '/api/dentistry/appointments/',
    CREATE: '/api/dentistry/appointments/create/',
    DETAIL: (appointmentId) => `/api/dentistry/appointments/${appointmentId}/`,
    UPDATE: (appointmentId) => `/api/dentistry/appointments/${appointmentId}/update/`,
    DELETE: (appointmentId) => `/api/dentistry/appointments/${appointmentId}/delete/`
  },
  TREATMENTS: {
    LIST: '/api/dentistry/treatments/',
    CREATE: '/api/dentistry/treatments/create/',
    DETAIL: (treatmentId) => `/api/dentistry/treatments/${treatmentId}/`,
    UPDATE: (treatmentId) => `/api/dentistry/treatments/${treatmentId}/update/`,
    DELETE: (treatmentId) => `/api/dentistry/treatments/${treatmentId}/delete/`
  },
  DENTISTS: {
    LIST: '/api/dentistry/dentists/',
    CREATE: '/api/dentistry/dentists/create/',
    DETAIL: (dentistId) => `/api/dentistry/dentists/${dentistId}/`,
    UPDATE: (dentistId) => `/api/dentistry/dentists/${dentistId}/update/`,
    DELETE: (dentistId) => `/api/dentistry/dentists/${dentistId}/delete/`
  },
  PROCEDURES: '/api/dentistry/procedures/',
  DENTAL_RECORDS: '/api/dentistry/dental-records/',
  XRAYS: '/api/dentistry/xrays/',
  ACTIONS: {
    SCHEDULE_APPOINTMENT: '/api/dentistry/appointments/schedule/',
    COMPLETE_TREATMENT: (treatmentId) => `/api/dentistry/treatments/${treatmentId}/complete/`,
    UPDATE_RECORD: (patientId) => `/api/dentistry/patients/${patientId}/records/update/`,
    CANCEL_APPOINTMENT: (appointmentId) => `/api/dentistry/appointments/${appointmentId}/cancel/`,
    RESCHEDULE_APPOINTMENT: (appointmentId) => `/api/dentistry/appointments/${appointmentId}/reschedule/`
  }
};

// Hospital Management Specific Endpoints
export const HOSPITAL_ENDPOINTS = {
  BASE: '/api/hospital/',
  DASHBOARD: {
    STATISTICS: '/api/hospital/dashboard/statistics/',
    RECENT_ACTIVITY: '/api/hospital/dashboard/recent_activity/',
    ALERTS: '/api/hospital/dashboard/alerts/'
  },
  DEPARTMENTS: '/api/hospital/departments/',
  STAFF: '/api/hospital/staff/',
  BEDS: '/api/hospital/beds/',
  ADMISSIONS: '/api/hospital/admissions/',
  DISCHARGES: '/api/hospital/discharges/',
  INVENTORY: '/api/hospital/inventory/',
  BILLING: '/api/hospital/billing/',
  EMERGENCY: '/api/hospital/emergency/',
  MANAGEMENT: {
    USERS: '/api/hospital/management/users/',
    ADMIN_USERS: '/api/hospital/management/admin-users/',
    CREATE_USER: '/api/hospital/management/users/create/',
    CREATE_ADMIN: '/api/hospital/management/users/create-admin/',
    UPDATE_USER: (userId) => `/api/hospital/management/users/${userId}/update/`,
    DELETE_USER: (userId) => `/api/hospital/management/users/${userId}/delete/`,
    USER_PERMISSIONS: (userId) => `/api/hospital/management/users/${userId}/permissions/`,
    BULK_ACTIONS: '/api/hospital/management/users/bulk-actions/',
    STATISTICS: '/api/hospital/management/users/statistics/',
    EXPORT: '/api/hospital/management/users/export/'
  }
};

// Notification Endpoints
export const NOTIFICATION_ENDPOINTS = {
  SEND_TEST: '/api/hospital/notifications/test/',
  SEND_ADMIN: '/api/hospital/notifications/admin/',
  LOGS: '/api/hospital/notifications/logs/',
  PREFERENCES: '/api/hospital/notifications/preferences/',
  SCHEDULE: '/api/hospital/notifications/schedule/',
  STATUS: '/api/hospital/notifications/status/'
};

// Health Check Endpoints
export const HEALTH_ENDPOINTS = {
  ROOT: '/',
  API_HEALTH: '/api/health/',
  DATABASE: '/api/health/database/',
  REDIS: '/api/health/redis/',
  SERVICES: '/api/health/services/'
};

// File Upload Endpoints
export const UPLOAD_ENDPOINTS = {
  PROFILE_IMAGE: '/api/hospital/management/upload/profile-image/',
  DOCUMENTS: '/api/hospital/management/upload/documents/',
  MEDICAL_IMAGES: '/api/hospital/management/upload/medical-images/'
};

// External URLs (for redirects)
export const EXTERNAL_URLS = {
  CONTACT: 'https://www.xerxez.com/contact',
  SUPPORT: 'https://www.xerxez.com/support',
  DOCS: 'https://docs.xerxez.com',
  MAIN_SITE: 'https://www.xerxez.com'
};

// Local Development URLs
export const LOCAL_URLS = {
  FRONTEND_DEV: 'http://localhost:5173',
  BACKEND_DEV: 'http://localhost:8000',
  ADMIN_PANEL: 'http://localhost:8000/admin'
};

/**
 * Helper function to build full API URL
 * @param {string} endpoint - The endpoint path
 * @returns {string} - Complete URL
 */
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

/**
 * Helper function to build pagination URL
 * @param {string} baseEndpoint - Base endpoint
 * @param {object} params - Query parameters
 * @returns {string} - URL with query parameters
 */
export const buildPaginationUrl = (baseEndpoint, params = {}) => {
  const url = new URL(`${API_CONFIG.BASE_URL}${baseEndpoint}`);
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined) {
      url.searchParams.append(key, params[key]);
    }
  });
  return url.toString();
};

export default {
  API_CONFIG,
  AUTH_ENDPOINTS,
  USER_MANAGEMENT_ENDPOINTS,
  MODULE_ENDPOINTS,
  DERMATOLOGY_ENDPOINTS,
  MEDICINE_ENDPOINTS,
  RADIOLOGY_ENDPOINTS,
  PATHOLOGY_ENDPOINTS,
  DENTISTRY_ENDPOINTS,
  HOSPITAL_ENDPOINTS,
  NOTIFICATION_ENDPOINTS,
  HEALTH_ENDPOINTS,
  UPLOAD_ENDPOINTS,
  EXTERNAL_URLS,
  LOCAL_URLS,
  buildApiUrl,
  buildPaginationUrl
};
