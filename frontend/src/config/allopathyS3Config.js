// Allopathy S3 Data Manager Configuration - Medical Data Focus
export const ALLOPATHY_S3_CONFIG = {
  // Feature Configuration
  features: {
    enabled: true,
    uploadEnabled: true,
    downloadEnabled: true,
    deleteEnabled: true,
    previewEnabled: true,
    bulkOperations: true,
    folderManagement: true,
    metadataEditing: true,
    shareLinks: true,
    versionControl: true,
    patientPrivacy: true,
    hipaaCompliance: true
  },

  // Bucket List for Medical Data
  buckets: [
    { 
      id: 'medical-records', 
      name: 'Medical Records', 
      description: 'Patient medical records and clinical documents',
      icon: 'ri-file-medical-line',
      color: 'primary',
      encrypted: true,
      hipaaCompliant: true
    },
    { 
      id: 'diagnostic-images', 
      name: 'Diagnostic Images', 
      description: 'X-rays, MRI, CT scans and medical imaging',
      icon: 'ri-scan-line',
      color: 'success',
      encrypted: true,
      hipaaCompliant: true
    },
    { 
      id: 'lab-results', 
      name: 'Lab Results', 
      description: 'Laboratory test results and reports',
      icon: 'ri-test-tube-line',
      color: 'info',
      encrypted: true,
      hipaaCompliant: true
    },
    { 
      id: 'drug-database', 
      name: 'Drug Database', 
      description: 'Pharmaceutical data and drug information',
      icon: 'ri-medicine-bottle-line',
      color: 'warning',
      encrypted: false,
      hipaaCompliant: false
    },
    { 
      id: 'ai-models', 
      name: 'AI Models', 
      description: 'Medical AI models and diagnostic algorithms',
      icon: 'ri-brain-line',
      color: 'purple',
      encrypted: false,
      hipaaCompliant: false
    },
    { 
      id: 'research-data', 
      name: 'Research Data', 
      description: 'Clinical research and anonymized datasets',
      icon: 'ri-microscope-line',
      color: 'secondary',
      encrypted: true,
      hipaaCompliant: true
    }
  ],

  // Medical S3 Configuration
  s3Config: {
    region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
    encryptionEnabled: true,
    auditLogging: true,
    accessLogging: true,
    versioning: true,
    buckets: {
      'medical-records': {
        name: process.env.REACT_APP_S3_MEDICAL_RECORDS_BUCKET || 'xerxez-medical-records',
        displayName: 'Medical Records',
        icon: 'ri-file-medical-line',
        color: 'primary',
        maxFileSize: '100MB',
        allowedTypes: ['.pdf', '.doc', '.docx', '.txt', '.rtf'],
        description: 'HIPAA-compliant storage for patient medical records',
        encrypted: true,
        retentionYears: 7
      },
      'diagnostic-images': {
        name: process.env.REACT_APP_S3_DIAGNOSTIC_IMAGES_BUCKET || 'xerxez-diagnostic-images',
        displayName: 'Diagnostic Images',
        icon: 'ri-scan-line',
        color: 'success',
        maxFileSize: '500MB',
        allowedTypes: ['.dcm', '.jpg', '.png', '.tiff', '.nii'],
        description: 'Medical imaging files with DICOM support',
        encrypted: true,
        retentionYears: 10
      },
      'lab-results': {
        name: process.env.REACT_APP_S3_LAB_RESULTS_BUCKET || 'xerxez-lab-results',
        displayName: 'Lab Results',
        icon: 'ri-test-tube-line',
        color: 'info',
        maxFileSize: '50MB',
        allowedTypes: ['.pdf', '.hl7', '.csv', '.xml', '.json'],
        description: 'Laboratory test results and clinical data',
        encrypted: true,
        retentionYears: 5
      },
      'drug-database': {
        name: process.env.REACT_APP_S3_DRUG_DATABASE_BUCKET || 'xerxez-drug-database',
        displayName: 'Drug Database',
        icon: 'ri-medicine-bottle-line',
        color: 'warning',
        maxFileSize: '10MB',
        allowedTypes: ['.json', '.xml', '.csv', '.pdf'],
        description: 'Pharmaceutical reference data and drug information',
        encrypted: false,
        retentionYears: -1 // Permanent
      },
      'ai-models': {
        name: process.env.REACT_APP_S3_MEDICAL_AI_MODELS_BUCKET || 'xerxez-medical-ai-models',
        displayName: 'AI Models',
        icon: 'ri-brain-line',
        color: 'purple',
        maxFileSize: '10GB',
        allowedTypes: ['.pkl', '.h5', '.pt', '.onnx', '.pb'],
        description: 'Medical AI models and diagnostic algorithms',
        encrypted: false,
        retentionYears: -1 // Permanent
      },
      'research-data': {
        name: process.env.REACT_APP_S3_RESEARCH_DATA_BUCKET || 'xerxez-research-data',
        displayName: 'Research Data',
        icon: 'ri-microscope-line',
        color: 'secondary',
        maxFileSize: '1GB',
        allowedTypes: ['.csv', '.json', '.xlsx', '.pdf', '.zip'],
        description: 'Anonymized clinical research datasets',
        encrypted: true,
        retentionYears: 15
      }
    }
  },

  // Medical File Operations Configuration
  operations: {
    upload: {
      enabled: true,
      multipart: true,
      multipartThreshold: '50MB',
      maxConcurrentUploads: 2,
      retryCount: 5,
      chunkSize: '5MB',
      progressTracking: true,
      virusScan: true,
      patientIdValidation: true
    },
    download: {
      enabled: true,
      resumable: true,
      streaming: false, // Disabled for security
      compressionEnabled: false, // Disabled for medical data integrity
      maxConcurrentDownloads: 3,
      auditTrail: true,
      accessLogging: true
    },
    delete: {
      enabled: true,
      softDelete: true,
      retentionDays: 90,
      requireConfirmation: true,
      bulkDeleteLimit: 50,
      approvalRequired: true,
      auditTrail: true
    },
    sync: {
      enabled: false, // Disabled for security
      autoSync: false,
      syncInterval: -1,
      conflictResolution: 'manual'
    }
  },

  // Medical UI Configuration
  ui: {
    layout: {
      defaultView: 'list', // List view for better medical data visibility
      itemsPerPage: 20,
      showPreview: true,
      showMetadata: true,
      enableSearch: true,
      enableFilters: true,
      showPatientInfo: true,
      showEncryptionStatus: true,
      showHIPAAStatus: true
    },
    security: {
      showWarnings: true,
      encryptionRequired: true,
      accessAudit: true,
      sessionTimeout: 1800, // 30 minutes
      maxIdleTime: 900 // 15 minutes
    }
  },

  // Medical Data Types and File Support
  fileTypes: {
    'medical-records': {
      documents: {
        extensions: ['.pdf', '.doc', '.docx', '.txt', '.rtf'],
        icon: 'ri-file-medical-line',
        color: 'primary',
        previewable: true,
        maxSize: '100MB'
      },
      forms: {
        extensions: ['.pdf', '.xml', '.json'],
        icon: 'ri-file-list-line',
        color: 'info',
        previewable: true,
        maxSize: '50MB'
      }
    },
    'diagnostic-images': {
      dicom: {
        extensions: ['.dcm', '.ima'],
        icon: 'ri-scan-line',
        color: 'success',
        previewable: false,
        maxSize: '500MB'
      },
      images: {
        extensions: ['.jpg', '.png', '.tiff', '.bmp'],
        icon: 'ri-image-line',
        color: 'warning',
        previewable: true,
        maxSize: '100MB'
      },
      neuroimaging: {
        extensions: ['.nii', '.nii.gz', '.mgz'],
        icon: 'ri-brain-line',
        color: 'purple',
        previewable: false,
        maxSize: '1GB'
      }
    },
    'lab-results': {
      reports: {
        extensions: ['.pdf', '.html', '.xml'],
        icon: 'ri-file-chart-line',
        color: 'info',
        previewable: true,
        maxSize: '50MB'
      },
      data: {
        extensions: ['.hl7', '.csv', '.json', '.xml'],
        icon: 'ri-file-excel-line',
        color: 'success',
        previewable: true,
        maxSize: '25MB'
      }
    },
    'drug-database': {
      references: {
        extensions: ['.json', '.xml', '.csv'],
        icon: 'ri-medicine-bottle-line',
        color: 'warning',
        previewable: true,
        maxSize: '10MB'
      },
      monographs: {
        extensions: ['.pdf', '.html'],
        icon: 'ri-file-text-line',
        color: 'primary',
        previewable: true,
        maxSize: '5MB'
      }
    },
    'ai-models': {
      tensorflow: {
        extensions: ['.h5', '.pb', '.tflite'],
        icon: 'ri-brain-line',
        color: 'info',
        previewable: false,
        maxSize: '5GB'
      },
      pytorch: {
        extensions: ['.pt', '.pth'],
        icon: 'ri-cpu-line',
        color: 'primary',
        previewable: false,
        maxSize: '5GB'
      },
      sklearn: {
        extensions: ['.pkl', '.joblib'],
        icon: 'ri-database-line',
        color: 'success',
        previewable: false,
        maxSize: '1GB'
      }
    },
    'research-data': {
      datasets: {
        extensions: ['.csv', '.xlsx', '.json'],
        icon: 'ri-file-excel-line',
        color: 'secondary',
        previewable: true,
        maxSize: '500MB'
      },
      publications: {
        extensions: ['.pdf', '.docx'],
        icon: 'ri-article-line',
        color: 'primary',
        previewable: true,
        maxSize: '50MB'
      },
      archives: {
        extensions: ['.zip', '.tar.gz', '.7z'],
        icon: 'ri-archive-line',
        color: 'warning',
        previewable: false,
        maxSize: '1GB'
      }
    }
  },

  // Security and Compliance Configuration
  security: {
    encryption: {
      enabled: true,
      algorithm: 'AES-256',
      keyRotation: 90 // days
    },
    compliance: {
      hipaa: true,
      gdpr: true,
      auditRetention: 2555, // days (7 years)
      dataRetention: {
        'medical-records': 2555, // 7 years
        'diagnostic-images': 3650, // 10 years
        'lab-results': 1825, // 5 years
        'drug-database': -1, // Permanent
        'ai-models': -1, // Permanent
        'research-data': 5475 // 15 years
      }
    },
    access: {
      requireMFA: true,
      sessionTimeout: 1800,
      maxConcurrentSessions: 3,
      ipWhitelisting: true,
      geofencing: true
    }
  },

  // Integration Settings
  integration: {
    ehr: {
      enabled: true,
      systems: ['epic', 'cerner', 'allscripts'],
      autoSync: false
    },
    pacs: {
      enabled: true,
      dicomSupport: true,
      autoImport: false
    },
    lis: {
      enabled: true,
      hl7Support: true,
      autoImport: false
    }
  }
};

export default ALLOPATHY_S3_CONFIG;
