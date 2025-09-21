// Pathology S3 Data Management Configuration
// Soft Coding Configuration for Pathology Module

export const pathologyS3Config = {
  // Module Information
  module: {
    name: 'Pathology',
    title: 'Pathology S3 Data Management System',
    description: 'Comprehensive pathology laboratory data management with cloud storage integration',
    version: '1.0.0',
    icon: 'ri-microscope-fill',
    color: '#8B4513'
  },

  // API Endpoints Configuration
  api: {
    baseUrl: `${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}/api/pathology`,
    endpoints: {
      // Laboratory Management
      laboratories: '/laboratories/',
      laboratoryDetail: '/laboratories/{id}/',
      laboratoryFiles: '/laboratories/{id}/files/',
      
      // Patient Management
      patients: '/patients/',
      patientDetail: '/patients/{id}/',
      patientFiles: '/patients/{id}/files/',
      patientHistory: '/patients/{id}/history/',
      
      // Specimen Management
      specimens: '/specimens/',
      specimenDetail: '/specimens/{id}/',
      specimenFiles: '/specimens/{id}/files/',
      
      // Test Management
      tests: '/tests/',
      testResults: '/tests/{id}/results/',
      
      // File Management
      fileUpload: '/files/upload/',
      fileDownload: '/files/{id}/download/',
      fileDelete: '/files/{id}/',
      bulkUpload: '/files/bulk-upload/',
      
      // Analysis & AI
      aiAnalysis: '/ai/analyze/',
      diagnosticAnalysis: '/ai/diagnosis/',
      abnormalityDetection: '/ai/abnormality-detection/',
      
      // Reports
      reports: '/reports/',
      analytics: '/analytics/',
      
      // S3 Management
      s3Status: '/s3/status/',
      s3Sync: '/s3/sync/',
      s3Cleanup: '/s3/cleanup/'
    }
  },

  // Laboratory Configuration
  laboratories: {
    fields: [
      {
        name: 'name',
        label: 'Laboratory Name',
        type: 'text',
        required: true,
        placeholder: 'Enter pathology laboratory name'
      },
      {
        name: 'type',
        label: 'Laboratory Type',
        type: 'select',
        required: true,
        options: [
          { value: 'clinical_pathology', label: 'Clinical Pathology Lab' },
          { value: 'anatomical_pathology', label: 'Anatomical Pathology Lab' },
          { value: 'molecular_pathology', label: 'Molecular Pathology Lab' },
          { value: 'cytopathology', label: 'Cytopathology Lab' },
          { value: 'histopathology', label: 'Histopathology Lab' },
          { value: 'microbiology', label: 'Microbiology Lab' },
          { value: 'hematology', label: 'Hematology Lab' },
          { value: 'immunology', label: 'Immunology Lab' },
          { value: 'toxicology', label: 'Toxicology Lab' }
        ]
      },
      {
        name: 'address',
        label: 'Address',
        type: 'textarea',
        required: true,
        placeholder: 'Full address of the laboratory'
      },
      {
        name: 'phone',
        label: 'Phone Number',
        type: 'tel',
        required: true,
        placeholder: '+1 (555) 123-4567'
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        placeholder: 'contact@pathologylab.com'
      },
      {
        name: 'license_number',
        label: 'License Number',
        type: 'text',
        required: true,
        placeholder: 'Laboratory license number'
      },
      {
        name: 'accreditation',
        label: 'Accreditation',
        type: 'text',
        placeholder: 'CAP, CLIA, ISO certification'
      },
      {
        name: 'specializations',
        label: 'Specializations',
        type: 'multiselect',
        options: [
          'Clinical Chemistry',
          'Hematology',
          'Microbiology',
          'Immunology',
          'Molecular Diagnostics',
          'Cytopathology',
          'Histopathology',
          'Forensic Pathology',
          'Pediatric Pathology',
          'Dermatopathology'
        ]
      }
    ],
    validation: {
      name: { min: 2, max: 100 },
      phone: { pattern: /^[\+]?[1-9][\d]{0,15}$/ },
      email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      license_number: { min: 5, max: 50 }
    }
  },

  // Patient Configuration
  patients: {
    fields: [
      {
        name: 'first_name',
        label: 'First Name',
        type: 'text',
        required: true,
        placeholder: 'Patient first name'
      },
      {
        name: 'last_name',
        label: 'Last Name',
        type: 'text',
        required: true,
        placeholder: 'Patient last name'
      },
      {
        name: 'date_of_birth',
        label: 'Date of Birth',
        type: 'date',
        required: true
      },
      {
        name: 'gender',
        label: 'Gender',
        type: 'select',
        required: true,
        options: [
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
          { value: 'other', label: 'Other' },
          { value: 'prefer_not_to_say', label: 'Prefer not to say' }
        ]
      },
      {
        name: 'patient_id',
        label: 'Patient ID',
        type: 'text',
        required: true,
        placeholder: 'Unique patient identifier'
      },
      {
        name: 'phone',
        label: 'Phone Number',
        type: 'tel',
        required: true,
        placeholder: '+1 (555) 123-4567'
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'patient@email.com'
      },
      {
        name: 'insurance_provider',
        label: 'Insurance Provider',
        type: 'text',
        placeholder: 'Health insurance provider'
      },
      {
        name: 'insurance_number',
        label: 'Insurance Number',
        type: 'text',
        placeholder: 'Insurance policy number'
      },
      {
        name: 'referring_physician',
        label: 'Referring Physician',
        type: 'text',
        placeholder: 'Name of referring doctor'
      },
      {
        name: 'medical_history',
        label: 'Medical History',
        type: 'textarea',
        placeholder: 'Relevant medical history and current medications'
      },
      {
        name: 'clinical_notes',
        label: 'Clinical Notes',
        type: 'textarea',
        placeholder: 'Clinical observations and notes'
      }
    ],
    validation: {
      first_name: { min: 1, max: 50 },
      last_name: { min: 1, max: 50 },
      patient_id: { min: 3, max: 20 },
      phone: { pattern: /^[\+]?[1-9][\d]{0,15}$/ },
      email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
    }
  },

  // Specimen Configuration
  specimens: {
    fields: [
      {
        name: 'specimen_id',
        label: 'Specimen ID',
        type: 'text',
        required: true,
        placeholder: 'Unique specimen identifier'
      },
      {
        name: 'type',
        label: 'Specimen Type',
        type: 'select',
        required: true,
        options: [
          { value: 'blood', label: 'Blood' },
          { value: 'urine', label: 'Urine' },
          { value: 'tissue', label: 'Tissue' },
          { value: 'cytology', label: 'Cytology' },
          { value: 'biopsy', label: 'Biopsy' },
          { value: 'culture', label: 'Culture' },
          { value: 'fluid', label: 'Body Fluid' },
          { value: 'swab', label: 'Swab' },
          { value: 'stool', label: 'Stool' },
          { value: 'sputum', label: 'Sputum' }
        ]
      },
      {
        name: 'collection_date',
        label: 'Collection Date',
        type: 'datetime-local',
        required: true
      },
      {
        name: 'collection_site',
        label: 'Collection Site',
        type: 'text',
        placeholder: 'Anatomical site of collection'
      },
      {
        name: 'collection_method',
        label: 'Collection Method',
        type: 'text',
        placeholder: 'Method used for specimen collection'
      },
      {
        name: 'volume_amount',
        label: 'Volume/Amount',
        type: 'text',
        placeholder: 'Volume or amount of specimen'
      },
      {
        name: 'preservation_method',
        label: 'Preservation Method',
        type: 'select',
        options: [
          { value: 'fresh', label: 'Fresh' },
          { value: 'frozen', label: 'Frozen' },
          { value: 'formalin', label: 'Formalin Fixed' },
          { value: 'alcohol', label: 'Alcohol Fixed' },
          { value: 'edta', label: 'EDTA' },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        name: 'clinical_information',
        label: 'Clinical Information',
        type: 'textarea',
        placeholder: 'Relevant clinical information and history'
      }
    ],
    validation: {
      specimen_id: { min: 3, max: 20 },
      volume_amount: { min: 1, max: 50 }
    }
  },

  // File Upload Configuration
  fileUpload: {
    allowedTypes: [
      // Images
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp',
      'image/tiff',
      
      // Medical Documents
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      
      // Microscopy Images
      'image/x-portable-pixmap',
      'image/x-portable-graymap',
      
      // Data files
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      
      // Laboratory Data
      'application/json',
      'text/plain'
    ],
    maxFileSize: 100 * 1024 * 1024, // 100MB
    categories: [
      {
        id: 'microscopy',
        name: 'Microscopy Images',
        description: 'Histological and cytological microscopy images',
        icon: 'ri-microscope-fill',
        allowedTypes: ['image/jpeg', 'image/png', 'image/tiff']
      },
      {
        id: 'lab_reports',
        name: 'Laboratory Reports',
        description: 'Test results and analytical reports',
        icon: 'ri-file-chart-fill',
        allowedTypes: ['application/pdf', 'text/csv', 'application/vnd.ms-excel']
      },
      {
        id: 'specimen_images',
        name: 'Specimen Images',
        description: 'Gross and macroscopic specimen photographs',
        icon: 'ri-camera-fill',
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif']
      },
      {
        id: 'test_data',
        name: 'Test Data',
        description: 'Raw test data and instrument outputs',
        icon: 'ri-database-fill',
        allowedTypes: ['text/csv', 'application/json', 'text/plain']
      },
      {
        id: 'protocols',
        name: 'Protocols',
        description: 'Laboratory protocols and procedures',
        icon: 'ri-file-text-fill',
        allowedTypes: ['application/pdf', 'application/msword']
      },
      {
        id: 'quality_control',
        name: 'Quality Control',
        description: 'QC documents and validation reports',
        icon: 'ri-shield-check-fill',
        allowedTypes: ['application/pdf', 'text/csv']
      }
    ]
  },

  // AI Analysis Configuration
  aiAnalysis: {
    features: [
      {
        id: 'cell_morphology',
        name: 'Cell Morphology Analysis',
        description: 'AI-powered analysis of cellular structures',
        icon: 'ri-cell-line',
        supportedFileTypes: ['image/jpeg', 'image/png', 'image/tiff']
      },
      {
        id: 'cancer_detection',
        name: 'Cancer Cell Detection',
        description: 'Automated detection of malignant cells',
        icon: 'ri-bug-fill',
        supportedFileTypes: ['image/jpeg', 'image/png', 'image/tiff']
      },
      {
        id: 'tissue_classification',
        name: 'Tissue Classification',
        description: 'Automated tissue type identification',
        icon: 'ri-grid-fill',
        supportedFileTypes: ['image/jpeg', 'image/png', 'image/tiff']
      },
      {
        id: 'abnormality_detection',
        name: 'Abnormality Detection',
        description: 'Detection of pathological abnormalities',
        icon: 'ri-search-eye-fill',
        supportedFileTypes: ['image/jpeg', 'image/png', 'image/tiff']
      },
      {
        id: 'quantitative_analysis',
        name: 'Quantitative Analysis',
        description: 'Automated measurement and counting',
        icon: 'ri-calculator-fill',
        supportedFileTypes: ['image/jpeg', 'image/png', 'image/tiff']
      },
      {
        id: 'immunohistochemistry',
        name: 'IHC Analysis',
        description: 'Immunohistochemistry staining analysis',
        icon: 'ri-palette-fill',
        supportedFileTypes: ['image/jpeg', 'image/png', 'image/tiff']
      }
    ],
    confidenceThreshold: 0.75,
    processingTimeout: 45000 // 45 seconds
  },

  // Dashboard Configuration
  dashboard: {
    widgets: [
      {
        id: 'total_laboratories',
        title: 'Total Laboratories',
        type: 'counter',
        icon: 'ri-building-fill',
        color: 'primary'
      },
      {
        id: 'total_patients',
        title: 'Total Patients',
        type: 'counter',
        icon: 'ri-user-3-fill',
        color: 'success'
      },
      {
        id: 'total_specimens',
        title: 'Total Specimens',
        type: 'counter',
        icon: 'ri-test-tube-fill',
        color: 'info'
      },
      {
        id: 'files_uploaded_today',
        title: 'Files Uploaded Today',
        type: 'counter',
        icon: 'ri-upload-fill',
        color: 'warning'
      },
      {
        id: 'ai_analyses_performed',
        title: 'AI Analyses Performed',
        type: 'counter',
        icon: 'ri-brain-fill',
        color: 'danger'
      },
      {
        id: 'storage_usage',
        title: 'Storage Usage',
        type: 'progress',
        icon: 'ri-database-fill',
        color: 'secondary'
      },
      {
        id: 'pending_tests',
        title: 'Pending Tests',
        type: 'counter',
        icon: 'ri-time-fill',
        color: 'dark'
      },
      {
        id: 'recent_activities',
        title: 'Recent Activities',
        type: 'list',
        icon: 'ri-history-fill',
        color: 'info'
      }
    ],
    refreshInterval: 30000 // 30 seconds
  },

  // UI Configuration
  ui: {
    theme: {
      primaryColor: '#8B4513',
      secondaryColor: '#D2691E',
      successColor: '#228B22',
      errorColor: '#DC143C',
      warningColor: '#FF8C00',
      infoColor: '#4682B4'
    },
    layout: {
      sidebarWidth: '280px',
      headerHeight: '70px',
      footerHeight: '50px'
    },
    animations: {
      duration: 300,
      easing: 'ease-in-out'
    },
    notifications: {
      position: 'top-right',
      duration: 5000,
      showProgress: true
    }
  },

  // Permissions Configuration
  permissions: {
    roles: [
      {
        id: 'admin',
        name: 'Administrator',
        permissions: ['all']
      },
      {
        id: 'pathologist',
        name: 'Pathologist',
        permissions: [
          'view_patients',
          'add_patients',
          'edit_patients',
          'view_specimens',
          'add_specimens',
          'edit_specimens',
          'upload_files',
          'view_files',
          'ai_analysis',
          'generate_reports'
        ]
      },
      {
        id: 'lab_technician',
        name: 'Lab Technician',
        permissions: [
          'view_patients',
          'view_specimens',
          'add_specimens',
          'upload_files',
          'view_files'
        ]
      },
      {
        id: 'lab_manager',
        name: 'Lab Manager',
        permissions: [
          'view_patients',
          'add_patients',
          'edit_patients',
          'view_specimens',
          'add_specimens',
          'edit_specimens',
          'upload_files',
          'view_files',
          'manage_laboratory'
        ]
      }
    ]
  },

  // Error Messages
  errorMessages: {
    fileUpload: {
      invalidType: 'Invalid file type. Please upload a supported pathology file format.',
      fileTooLarge: 'File size exceeds the maximum limit of 100MB.',
      uploadFailed: 'File upload failed. Please try again.',
      networkError: 'Network error occurred during upload.'
    },
    validation: {
      required: 'This field is required.',
      invalidEmail: 'Please enter a valid email address.',
      invalidPhone: 'Please enter a valid phone number.',
      invalidDate: 'Please enter a valid date.',
      invalidSpecimenId: 'Specimen ID must be unique and between 3-20 characters.'
    },
    api: {
      connectionError: 'Unable to connect to the server.',
      serverError: 'Internal server error occurred.',
      unauthorized: 'You are not authorized to perform this action.',
      notFound: 'Requested resource not found.'
    }
  },

  // Success Messages
  successMessages: {
    laboratoryCreated: 'Pathology laboratory created successfully!',
    patientCreated: 'Patient record created successfully!',
    specimenCreated: 'Specimen record created successfully!',
    fileUploaded: 'File uploaded successfully!',
    aiAnalysisCompleted: 'AI analysis completed successfully!',
    dataExported: 'Data exported successfully!',
    settingsSaved: 'Settings saved successfully!'
  }
};

export default pathologyS3Config;
