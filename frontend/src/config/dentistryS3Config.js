// Dentistry S3 Data Management Configuration
// Soft Coding Configuration for Dentistry Module

export const dentistryS3Config = {
  // Module Information
  module: {
    name: 'Dentistry',
    title: 'Dentistry S3 Data Management System',
    description: 'Comprehensive dental data management with cloud storage integration',
    version: '1.0.0',
    icon: 'ri-tooth-fill',
    color: '#4A90E2'
  },

  // API Endpoints Configuration
  api: {
    baseUrl: `${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}/api/dentistry`,
    endpoints: {
      // Institution Management
      institutions: '/institutions/',
      institutionDetail: '/institutions/{id}/',
      institutionFiles: '/institutions/{id}/files/',
      
      // Patient Management
      patients: '/patients/',
      patientDetail: '/patients/{id}/',
      patientFiles: '/patients/{id}/files/',
      patientHistory: '/patients/{id}/history/',
      
      // File Management
      fileUpload: '/files/upload/',
      fileDownload: '/files/{id}/download/',
      fileDelete: '/files/{id}/',
      bulkUpload: '/files/bulk-upload/',
      
      // Analysis & AI
      aiAnalysis: '/ai/analyze/',
      diagnosticAnalysis: '/ai/diagnosis/',
      treatmentSuggestions: '/ai/treatment-suggestions/',
      
      // Reports
      reports: '/reports/',
      analytics: '/analytics/',
      
      // S3 Management
      s3Status: '/s3/status/',
      s3Sync: '/s3/sync/',
      s3Cleanup: '/s3/cleanup/'
    }
  },

  // Institution Configuration
  institutions: {
    fields: [
      {
        name: 'name',
        label: 'Institution Name',
        type: 'text',
        required: true,
        placeholder: 'Enter dental clinic/hospital name'
      },
      {
        name: 'type',
        label: 'Institution Type',
        type: 'select',
        required: true,
        options: [
          { value: 'dental_clinic', label: 'Dental Clinic' },
          { value: 'orthodontic_clinic', label: 'Orthodontic Clinic' },
          { value: 'oral_surgery_center', label: 'Oral Surgery Center' },
          { value: 'dental_hospital', label: 'Dental Hospital' },
          { value: 'pediatric_dental_clinic', label: 'Pediatric Dental Clinic' },
          { value: 'cosmetic_dental_center', label: 'Cosmetic Dental Center' }
        ]
      },
      {
        name: 'address',
        label: 'Address',
        type: 'textarea',
        required: true,
        placeholder: 'Full address of the institution'
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
        placeholder: 'contact@dentalclinic.com'
      },
      {
        name: 'license_number',
        label: 'License Number',
        type: 'text',
        required: true,
        placeholder: 'Dental practice license number'
      },
      {
        name: 'specializations',
        label: 'Specializations',
        type: 'multiselect',
        options: [
          'General Dentistry',
          'Orthodontics',
          'Oral Surgery',
          'Periodontics',
          'Endodontics',
          'Prosthodontics',
          'Pediatric Dentistry',
          'Cosmetic Dentistry',
          'Oral Pathology',
          'Dental Implants'
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
        placeholder: 'Dental insurance provider'
      },
      {
        name: 'insurance_number',
        label: 'Insurance Number',
        type: 'text',
        placeholder: 'Insurance policy number'
      },
      {
        name: 'emergency_contact_name',
        label: 'Emergency Contact Name',
        type: 'text',
        placeholder: 'Emergency contact person'
      },
      {
        name: 'emergency_contact_phone',
        label: 'Emergency Contact Phone',
        type: 'tel',
        placeholder: 'Emergency contact number'
      },
      {
        name: 'medical_history',
        label: 'Medical History',
        type: 'textarea',
        placeholder: 'Relevant medical history and allergies'
      },
      {
        name: 'dental_history',
        label: 'Dental History',
        type: 'textarea',
        placeholder: 'Previous dental treatments and conditions'
      },
      {
        name: 'chief_complaint',
        label: 'Chief Complaint',
        type: 'textarea',
        placeholder: 'Current dental concerns or symptoms'
      }
    ],
    validation: {
      first_name: { min: 1, max: 50 },
      last_name: { min: 1, max: 50 },
      phone: { pattern: /^[\+]?[1-9][\d]{0,15}$/ },
      email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
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
      
      // Medical Documents
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      
      // Dental Imaging
      'application/dicom',
      'image/x-portable-pixmap',
      
      // Data files
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ],
    maxFileSize: 50 * 1024 * 1024, // 50MB
    categories: [
      {
        id: 'xrays',
        name: 'X-Rays',
        description: 'Dental X-ray images',
        icon: 'ri-scan-fill',
        allowedTypes: ['image/jpeg', 'image/png', 'application/dicom']
      },
      {
        id: 'photos',
        name: 'Clinical Photos',
        description: 'Intraoral and extraoral photographs',
        icon: 'ri-camera-fill',
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif']
      },
      {
        id: 'impressions',
        name: 'Digital Impressions',
        description: 'Digital dental impressions and scans',
        icon: 'ri-3d-view-fill',
        allowedTypes: ['application/dicom', 'image/x-portable-pixmap']
      },
      {
        id: 'treatment_plans',
        name: 'Treatment Plans',
        description: 'Treatment planning documents',
        icon: 'ri-file-text-fill',
        allowedTypes: ['application/pdf', 'application/msword']
      },
      {
        id: 'reports',
        name: 'Reports',
        description: 'Diagnostic and progress reports',
        icon: 'ri-file-chart-fill',
        allowedTypes: ['application/pdf', 'text/csv']
      },
      {
        id: 'consent_forms',
        name: 'Consent Forms',
        description: 'Patient consent and agreement forms',
        icon: 'ri-file-user-fill',
        allowedTypes: ['application/pdf', 'image/jpeg', 'image/png']
      }
    ]
  },

  // AI Analysis Configuration
  aiAnalysis: {
    features: [
      {
        id: 'caries_detection',
        name: 'Caries Detection',
        description: 'AI-powered detection of dental caries',
        icon: 'ri-search-eye-fill',
        supportedFileTypes: ['image/jpeg', 'image/png', 'application/dicom']
      },
      {
        id: 'orthodontic_analysis',
        name: 'Orthodontic Analysis',
        description: 'Automated orthodontic assessment',
        icon: 'ri-ruler-fill',
        supportedFileTypes: ['image/jpeg', 'image/png', 'application/dicom']
      },
      {
        id: 'periodontal_assessment',
        name: 'Periodontal Assessment',
        description: 'Gum disease and periodontal condition analysis',
        icon: 'ri-heart-pulse-fill',
        supportedFileTypes: ['image/jpeg', 'image/png', 'application/dicom']
      },
      {
        id: 'oral_pathology',
        name: 'Oral Pathology Detection',
        description: 'Detection of oral lesions and pathologies',
        icon: 'ri-microscope-fill',
        supportedFileTypes: ['image/jpeg', 'image/png']
      },
      {
        id: 'bite_analysis',
        name: 'Bite Analysis',
        description: 'Occlusal analysis and bite assessment',
        icon: 'ri-scissors-2-fill',
        supportedFileTypes: ['application/dicom', 'image/x-portable-pixmap']
      }
    ],
    confidenceThreshold: 0.7,
    processingTimeout: 30000 // 30 seconds
  },

  // Dashboard Configuration
  dashboard: {
    widgets: [
      {
        id: 'total_institutions',
        title: 'Total Institutions',
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
        id: 'files_uploaded_today',
        title: 'Files Uploaded Today',
        type: 'counter',
        icon: 'ri-upload-fill',
        color: 'info'
      },
      {
        id: 'ai_analyses_performed',
        title: 'AI Analyses Performed',
        type: 'counter',
        icon: 'ri-brain-fill',
        color: 'warning'
      },
      {
        id: 'storage_usage',
        title: 'Storage Usage',
        type: 'progress',
        icon: 'ri-database-fill',
        color: 'secondary'
      },
      {
        id: 'recent_activities',
        title: 'Recent Activities',
        type: 'list',
        icon: 'ri-time-fill',
        color: 'dark'
      }
    ],
    refreshInterval: 30000 // 30 seconds
  },

  // UI Configuration
  ui: {
    theme: {
      primaryColor: '#4A90E2',
      secondaryColor: '#F39C12',
      successColor: '#27AE60',
      errorColor: '#E74C3C',
      warningColor: '#F1C40F',
      infoColor: '#3498DB'
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
        id: 'dentist',
        name: 'Dentist',
        permissions: [
          'view_patients',
          'add_patients',
          'edit_patients',
          'upload_files',
          'view_files',
          'ai_analysis'
        ]
      },
      {
        id: 'dental_hygienist',
        name: 'Dental Hygienist',
        permissions: [
          'view_patients',
          'add_patients',
          'upload_files',
          'view_files'
        ]
      },
      {
        id: 'receptionist',
        name: 'Receptionist',
        permissions: [
          'view_patients',
          'add_patients',
          'edit_patients'
        ]
      }
    ]
  },

  // Error Messages
  errorMessages: {
    fileUpload: {
      invalidType: 'Invalid file type. Please upload a supported dental file format.',
      fileTooLarge: 'File size exceeds the maximum limit of 50MB.',
      uploadFailed: 'File upload failed. Please try again.',
      networkError: 'Network error occurred during upload.'
    },
    validation: {
      required: 'This field is required.',
      invalidEmail: 'Please enter a valid email address.',
      invalidPhone: 'Please enter a valid phone number.',
      invalidDate: 'Please enter a valid date.'
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
    institutionCreated: 'Dental institution created successfully!',
    patientCreated: 'Patient record created successfully!',
    fileUploaded: 'File uploaded successfully!',
    aiAnalysisCompleted: 'AI analysis completed successfully!',
    dataExported: 'Data exported successfully!',
    settingsSaved: 'Settings saved successfully!'
  }
};

export default dentistryS3Config;
