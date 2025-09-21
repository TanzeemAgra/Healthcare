// Allopathy S3 Configuration for comprehensive medical data management
export const allopathyS3Config = {
  // AWS S3 Configuration
  aws: {
    region: 'us-east-1',
    bucketName: 'allopathy-medical-data',
    endpoint: process.env.VITE_AWS_S3_ENDPOINT || 'https://s3.amazonaws.com',
    accessKeyId: process.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.VITE_AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.VITE_AWS_SESSION_TOKEN,
  },

  // API Configuration
  api: {
    baseURL: process.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
    endpoints: {
      hospitals: '/allopathy/hospitals/',
      patients: '/allopathy/patients/',
      files: '/allopathy/files/',
      analyses: '/allopathy/analyses/',
      medicalRecords: '/allopathy/medical-records/',
      treatmentPlans: '/allopathy/treatment-plans/',
      uploadFile: '/allopathy/files/',
      generateDownloadUrl: '/allopathy/files/{id}/generate-download-url/',
      storageAnalytics: '/allopathy/files/storage-analytics/',
      patientSummary: '/allopathy/patients/{id}/medical-summary/',
      batchProcess: '/allopathy/analyses/batch-process/',
    }
  },

  // File Upload Configuration
  upload: {
    maxFileSize: 100 * 1024 * 1024, // 100MB
    allowedFileTypes: [
      // Medical Images
      'image/jpeg', 'image/png', 'image/tiff', 'image/bmp',
      // Medical Documents
      'application/pdf', 'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      // Medical Data Formats
      'application/dicom', 'text/hl7', 'application/fhir+json',
      // Lab Results
      'text/csv', 'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      // General
      'text/plain', 'application/json', 'application/xml'
    ],
    categories: [
      { value: 'lab_results', label: 'Laboratory Results', icon: 'flask' },
      { value: 'radiology', label: 'Radiology Reports', icon: 'x-ray' },
      { value: 'pathology', label: 'Pathology Reports', icon: 'microscope' },
      { value: 'prescriptions', label: 'Prescriptions', icon: 'prescription' },
      { value: 'discharge_summary', label: 'Discharge Summary', icon: 'file-medical' },
      { value: 'operation_notes', label: 'Operation Notes', icon: 'surgical' },
      { value: 'consultation_notes', label: 'Consultation Notes', icon: 'notes-medical' },
      { value: 'medical_images', label: 'Medical Images', icon: 'images' },
      { value: 'insurance_documents', label: 'Insurance Documents', icon: 'insurance' },
      { value: 'consent_forms', label: 'Consent Forms', icon: 'signature' },
      { value: 'referral_letters', label: 'Referral Letters', icon: 'envelope' },
      { value: 'progress_notes', label: 'Progress Notes', icon: 'chart-line' }
    ]
  },

  // Analysis Configuration
  analysis: {
    types: [
      { value: 'lab_analysis', label: 'Laboratory Analysis', automated: true },
      { value: 'radiology_analysis', label: 'Radiology Analysis', automated: true },
      { value: 'symptom_analysis', label: 'Symptom Analysis', automated: false },
      { value: 'drug_interaction', label: 'Drug Interaction Check', automated: true },
      { value: 'diagnosis_suggestion', label: 'Diagnosis Suggestion', automated: false },
      { value: 'treatment_recommendation', label: 'Treatment Recommendation', automated: false },
      { value: 'prognosis_prediction', label: 'Prognosis Prediction', automated: false },
      { value: 'risk_assessment', label: 'Risk Assessment', automated: true },
      { value: 'vitals_analysis', label: 'Vital Signs Analysis', automated: true },
      { value: 'ecg_analysis', label: 'ECG Analysis', automated: true },
      { value: 'pathology_detection', label: 'Pathology Detection', automated: true },
      { value: 'clinical_decision_support', label: 'Clinical Decision Support', automated: false }
    ],
    confidenceThresholds: {
      low: 0.6,
      medium: 0.8,
      high: 0.95
    },
    autoProcessCategories: ['lab_results', 'radiology', 'pathology']
  },

  // Hospital Management
  hospitals: {
    types: [
      { value: 'general', label: 'General Hospital' },
      { value: 'specialty', label: 'Specialty Hospital' },
      { value: 'teaching', label: 'Teaching Hospital' },
      { value: 'research', label: 'Research Hospital' },
      { value: 'rehabilitation', label: 'Rehabilitation Center' },
      { value: 'psychiatric', label: 'Psychiatric Hospital' },
      { value: 'cardiac', label: 'Cardiac Center' },
      { value: 'cancer', label: 'Cancer Center' },
      { value: 'trauma', label: 'Trauma Center' },
      { value: 'pediatric', label: 'Pediatric Hospital' }
    ],
    statusOptions: [
      { value: 'active', label: 'Active', color: 'success' },
      { value: 'inactive', label: 'Inactive', color: 'secondary' },
      { value: 'suspended', label: 'Suspended', color: 'warning' },
      { value: 'maintenance', label: 'Under Maintenance', color: 'info' }
    ]
  },

  // Patient Management
  patients: {
    genderOptions: [
      { value: 'M', label: 'Male' },
      { value: 'F', label: 'Female' },
      { value: 'O', label: 'Other' },
      { value: 'N', label: 'Prefer not to say' }
    ],
    bloodGroups: [
      'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'
    ],
    admissionTypes: [
      { value: 'outpatient', label: 'Outpatient', color: 'primary' },
      { value: 'inpatient', label: 'Inpatient', color: 'info' },
      { value: 'emergency', label: 'Emergency', color: 'danger' },
      { value: 'surgery', label: 'Surgery', color: 'warning' },
      { value: 'consultation', label: 'Consultation', color: 'secondary' },
      { value: 'follow_up', label: 'Follow-up', color: 'success' },
      { value: 'routine_checkup', label: 'Routine Checkup', color: 'light' }
    ],
    statusOptions: [
      { value: 'active', label: 'Active', color: 'success' },
      { value: 'discharged', label: 'Discharged', color: 'secondary' },
      { value: 'admitted', label: 'Admitted', color: 'primary' },
      { value: 'critical', label: 'Critical', color: 'danger' },
      { value: 'stable', label: 'Stable', color: 'info' },
      { value: 'deceased', label: 'Deceased', color: 'dark' },
      { value: 'transferred', label: 'Transferred', color: 'warning' }
    ]
  },

  // Treatment Plans
  treatmentPlans: {
    statusOptions: [
      { value: 'active', label: 'Active', color: 'success' },
      { value: 'completed', label: 'Completed', color: 'primary' },
      { value: 'discontinued', label: 'Discontinued', color: 'danger' },
      { value: 'modified', label: 'Modified', color: 'warning' },
      { value: 'on_hold', label: 'On Hold', color: 'secondary' }
    ],
    priorityOptions: [
      { value: 'low', label: 'Low', color: 'secondary' },
      { value: 'medium', label: 'Medium', color: 'primary' },
      { value: 'high', label: 'High', color: 'warning' },
      { value: 'urgent', label: 'Urgent', color: 'danger' }
    ]
  },

  // Data Visualization
  charts: {
    colors: {
      primary: '#0d6efd',
      secondary: '#6c757d',
      success: '#198754',
      danger: '#dc3545',
      warning: '#ffc107',
      info: '#0dcaf0',
      light: '#f8f9fa',
      dark: '#212529'
    },
    defaultHeight: 400,
    animations: true,
    responsive: true
  },

  // Security and Privacy
  security: {
    encryptionRequired: true,
    accessLevels: [
      { value: 'public', label: 'Public' },
      { value: 'internal', label: 'Internal' },
      { value: 'restricted', label: 'Restricted' },
      { value: 'confidential', label: 'Confidential' },
      { value: 'top_secret', label: 'Top Secret' }
    ],
    auditLog: true,
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
  },

  // UI Configuration
  ui: {
    pageSize: 20,
    maxItemsPerPage: 100,
    refreshInterval: 30000, // 30 seconds
    notifications: {
      position: 'top-right',
      autoClose: 5000,
      showProgress: true
    },
    themes: {
      default: 'light',
      available: ['light', 'dark', 'auto']
    }
  },

  // Integration Settings
  integrations: {
    hl7: {
      enabled: true,
      version: 'v2.5'
    },
    fhir: {
      enabled: true,
      version: 'R4'
    },
    dicom: {
      enabled: true,
      viewer: 'cornerstone'
    }
  },

  // Performance Configuration
  performance: {
    caching: {
      enabled: true,
      duration: 5 * 60 * 1000, // 5 minutes
      strategies: ['memory', 'localStorage']
    },
    lazyLoading: true,
    pagination: true,
    compression: true
  },

  // Development Settings
  development: {
    debug: process.env.NODE_ENV === 'development',
    mockData: process.env.VITE_USE_MOCK_DATA === 'true',
    apiTimeout: 30000, // 30 seconds
    retryAttempts: 3
  }
};

export default allopathyS3Config;
