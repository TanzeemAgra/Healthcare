/**
 * Dentistry Module Router - Soft Coding Implementation
 * Centralized routing configuration for dentistry module
 * Uses dynamic imports and fallback mechanisms for robust component loading
 */

import { lazy, Suspense } from 'react';
import { DENTISTRY_ENDPOINTS } from '../services/apiConstants';

// Loading fallback component
const LoadingFallback = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

// Error fallback component
const ErrorFallback = ({ componentName, error }) => (
  <div className="alert alert-warning m-3">
    <h5>Component Loading Error</h5>
    <p>Failed to load {componentName}: {error?.message || 'Unknown error'}</p>
    <small className="text-muted">Please refresh the page or contact support if this persists.</small>
  </div>
);

// Dynamic component loader with error handling
const createDentistryComponent = (componentPath, componentName) => {
  return lazy(async () => {
    try {
      const module = await import(componentPath);
      if (module.default) {
        return { default: module.default };
      } else {
        console.error(`Component ${componentName} does not have a default export`);
        return { 
          default: () => <ErrorFallback componentName={componentName} error={new Error('No default export found')} />
        };
      }
    } catch (error) {
      console.error(`Failed to load dentistry component ${componentName}:`, error);
      return { 
        default: () => <ErrorFallback componentName={componentName} error={error} />
      };
    }
  });
};

// Dentistry Components - Soft Coded
export const DentistryComponents = {
  Dashboard: createDentistryComponent('../components/dentistry/DentistryDashboard', 'DentistryDashboard'),
  Patients: createDentistryComponent('../components/dentistry/DentistryPatients', 'DentistryPatients'),
  Appointments: createDentistryComponent('../components/dentistry/DentistryAppointments', 'DentistryAppointments'),
  Treatments: createDentistryComponent('../components/dentistry/DentistryTreatments', 'DentistryTreatments'),
  AIAnalysis: createDentistryComponent('../components/dentistry/DentistryAIAnalysis', 'DentistryAIAnalysis'),
  Emergencies: createDentistryComponent('../components/dentistry/DentistryEmergencies', 'DentistryEmergencies'),
  Conditions: createDentistryComponent('../components/dentistry/DentistryConditions', 'DentistryConditions'),
  S3DataManager: createDentistryComponent('../views/dentistry/DentistryS3DataManager', 'DentistryS3DataManager'),
  CancerReportTest: createDentistryComponent('../components/dentistry/CancerReportTestPage', 'CancerReportTestPage'),
  DetailedCancerAnalysis: createDentistryComponent('../components/dentistry/DetailedCancerAnalysis', 'DetailedCancerAnalysis'),
  CancerDetectionReportGenerator: createDentistryComponent('../components/dentistry/CancerDetectionReportGenerator', 'CancerDetectionReportGenerator'),
  CancerDetectionNotificationSystem: createDentistryComponent('../components/dentistry/CancerDetectionNotificationSystem', 'CancerDetectionNotificationSystem'),
  CancerDetectionNotification: createDentistryComponent('../components/dentistry/CancerDetectionNotification', 'CancerDetectionNotification')
};

// Safe component wrapper
export const SafeDentistryComponent = ({ component: Component, fallbackName, ...props }) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component {...props} />
  </Suspense>
);

// Route configuration using API constants
export const DENTISTRY_ROUTES = {
  BASE: '/dentistry',
  DASHBOARD: '/dentistry/dashboard',
  PATIENTS: '/dentistry/patients',
  APPOINTMENTS: '/dentistry/appointments',
  TREATMENTS: '/dentistry/treatments',
  AI_ANALYSIS: '/dentistry/ai-analysis',
  EMERGENCIES: '/dentistry/emergencies',
  CONDITIONS: '/dentistry/conditions',
  S3_DATA_MANAGER: '/dentistry/s3-data-manager',
  CANCER_REPORT_TEST: '/dentistry/cancer-report-test',
  DETAILED_CANCER_ANALYSIS: '/dentistry/detailed-cancer-analysis',
  CANCER_DETECTION_REPORT_GENERATOR: '/dentistry/cancer-detection-report-generator',
  CANCER_DETECTION_NOTIFICATION_SYSTEM: '/dentistry/cancer-detection-notification-system',
  CANCER_DETECTION_NOTIFICATION: '/dentistry/cancer-detection-notification'
};

// API endpoint configuration validation
export const validateDentistryEndpoints = () => {
  const requiredEndpoints = ['BASE', 'APPOINTMENTS', 'PATIENTS', 'TREATMENTS'];
  const missingEndpoints = requiredEndpoints.filter(endpoint => !DENTISTRY_ENDPOINTS[endpoint]);
  
  if (missingEndpoints.length > 0) {
    console.warn('Missing dentistry endpoints:', missingEndpoints);
    return false;
  }
  
  return true;
};

// Initialize dentistry module
export const initializeDentistryModule = () => {
  const isValid = validateDentistryEndpoints();
  if (isValid) {
    console.log('Dentistry module initialized successfully');
  } else {
    console.error('Dentistry module initialization failed - missing API endpoints');
  }
  return isValid;
};

export default {
  DentistryComponents,
  SafeDentistryComponent,
  DENTISTRY_ROUTES,
  validateDentistryEndpoints,
  initializeDentistryModule
};
