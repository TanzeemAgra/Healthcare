/**
 * Homeopathy S3 Data Management Configuration
 * Comprehensive configuration for homeopathy practice management with cloud storage
 * Includes constitutional analysis, remedy selection, case taking, and holistic treatment protocols
 */

export const homeopathyS3Config = {
  // API Base URLs
  baseUrl: `${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}/homeopathy`,
  s3ApiUrl: `${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}/homeopathy`,
  
  // Module Information
  moduleInfo: {
    name: 'Homeopathy S3 Data Manager',
    description: 'Comprehensive homeopathy practice management with constitutional analysis and remedy database',
    version: '1.0.0',
    specialty: 'homeopathy',
    features: [
      'Constitutional Analysis',
      'Remedy Selection',
      'Case Taking',
      'Miasmatic Analysis',
      'Potency Management',
      'Follow-up Tracking'
    ]
  },

  // Homeopathy Institution Types
  institutionTypes: [
    { value: 'clinic', label: 'Homeopathy Clinic', icon: '🏥' },
    { value: 'hospital', label: 'Homeopathy Hospital', icon: '🏥' },
    { value: 'college', label: 'Homeopathy College', icon: '🎓' },
    { value: 'research_center', label: 'Research Center', icon: '🔬' },
    { value: 'pharmacy', label: 'Homeopathy Pharmacy', icon: '💊' },
    { value: 'manufacturing', label: 'Remedy Manufacturing', icon: '🏭' },
    { value: 'dispensary', label: 'Dispensary', icon: '🏪' },
    { value: 'wellness_center', label: 'Wellness Center', icon: '🌿' }
  ],

  // Institution Configuration Fields
  institutionFields: [
    {
      name: 'institution_type',
      label: 'Institution Type',
      type: 'select',
      required: true,
      options: 'institutionTypes'
    },
    {
      name: 'name',
      label: 'Institution Name',
      type: 'text',
      required: true,
      placeholder: 'Enter institution name'
    },
    {
      name: 'license_number',
      label: 'License Number',
      type: 'text',
      required: true,
      placeholder: 'Homeopathy practice license'
    },
    {
      name: 'accreditation_body',
      label: 'Accreditation Body',
      type: 'text',
      placeholder: 'CCH, ACHENA, etc.'
    },
    {
      name: 'chief_homeopath',
      label: 'Chief Homeopath',
      type: 'text',
      required: true,
      placeholder: 'Lead practitioner name'
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
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'clinic@example.com'
    },
    {
      name: 'address',
      label: 'Address',
      type: 'textarea',
      required: true,
      placeholder: 'Complete address'
    },
    {
      name: 'city',
      label: 'City',
      type: 'text',
      required: true
    },
    {
      name: 'state',
      label: 'State/Province',
      type: 'text',
      required: true
    },
    {
      name: 'zip_code',
      label: 'ZIP/Postal Code',
      type: 'text',
      required: true
    },
    {
      name: 'website',
      label: 'Website',
      type: 'url',
      placeholder: 'https://www.example.com'
    },
    {
      name: 'operating_hours',
      label: 'Operating Hours',
      type: 'text',
      placeholder: 'Mon-Fri 9AM-6PM'
    },
    {
      name: 'emergency_contact',
      label: 'Emergency Contact',
      type: 'text',
      placeholder: 'After hours contact information'
    }
  ],

  // Patient Information Fields
  patientFields: [
    {
      name: 'patient_id',
      label: 'Patient ID',
      type: 'text',
      required: true,
      placeholder: 'Unique patient identifier'
    },
    {
      name: 'first_name',
      label: 'First Name',
      type: 'text',
      required: true
    },
    {
      name: 'last_name',
      label: 'Last Name',
      type: 'text',
      required: true
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
        { value: 'other', label: 'Other' }
      ]
    },
    {
      name: 'constitution_type',
      label: 'Constitutional Type',
      type: 'select',
      options: [
        { value: 'carbonica', label: 'Calcarea Carbonica' },
        { value: 'phosphorus', label: 'Phosphorus' },
        { value: 'sulphur', label: 'Sulphur' },
        { value: 'lycopodium', label: 'Lycopodium' },
        { value: 'natrum_mur', label: 'Natrum Muriaticum' },
        { value: 'sepia', label: 'Sepia' },
        { value: 'pulsatilla', label: 'Pulsatilla' },
        { value: 'arsenicum', label: 'Arsenicum Album' }
      ]
    },
    {
      name: 'miasmatic_background',
      label: 'Miasmatic Background',
      type: 'select',
      options: [
        { value: 'psoric', label: 'Psoric' },
        { value: 'sycotic', label: 'Sycotic' },
        { value: 'syphilitic', label: 'Syphilitic' },
        { value: 'tubercular', label: 'Tubercular' },
        { value: 'cancerous', label: 'Cancerous' },
        { value: 'mixed', label: 'Mixed Miasma' }
      ]
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'tel',
      placeholder: '+1 (555) 123-4567'
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'patient@example.com'
    },
    {
      name: 'address',
      label: 'Address',
      type: 'textarea',
      placeholder: 'Complete address'
    },
    {
      name: 'emergency_contact_name',
      label: 'Emergency Contact Name',
      type: 'text'
    },
    {
      name: 'emergency_contact_phone',
      label: 'Emergency Contact Phone',
      type: 'tel'
    },
    {
      name: 'referring_practitioner',
      label: 'Referring Practitioner',
      type: 'text',
      placeholder: 'Name of referring doctor/practitioner'
    }
  ],

  // Homeopathy File Categories
  fileCategories: [
    {
      value: 'case_taking',
      label: 'Case Taking Records',
      description: 'Initial case histories and constitutional analysis',
      icon: '📋',
      allowedFormats: ['pdf', 'doc', 'docx', 'txt']
    },
    {
      value: 'constitutional_analysis',
      label: 'Constitutional Analysis',
      description: 'Constitutional type analysis and assessment',
      icon: '🧬',
      allowedFormats: ['pdf', 'doc', 'docx', 'jpg', 'png']
    },
    {
      value: 'remedy_prescriptions',
      label: 'Remedy Prescriptions',
      description: 'Prescribed remedies and dosage records',
      icon: '💊',
      allowedFormats: ['pdf', 'doc', 'docx', 'txt']
    },
    {
      value: 'follow_up_notes',
      label: 'Follow-up Notes',
      description: 'Progress monitoring and follow-up assessments',
      icon: '📝',
      allowedFormats: ['pdf', 'doc', 'docx', 'txt']
    },
    {
      value: 'miasmatic_analysis',
      label: 'Miasmatic Analysis',
      description: 'Miasmatic background and hereditary patterns',
      icon: '🔍',
      allowedFormats: ['pdf', 'doc', 'docx', 'jpg', 'png']
    },
    {
      value: 'repertorization',
      label: 'Repertorization Charts',
      description: 'Symptom repertorization and remedy selection',
      icon: '📊',
      allowedFormats: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'png']
    },
    {
      value: 'materia_medica',
      label: 'Materia Medica References',
      description: 'Remedy study and materia medica documentation',
      icon: '📚',
      allowedFormats: ['pdf', 'doc', 'docx', 'txt']
    },
    {
      value: 'provings',
      label: 'Proving Documentation',
      description: 'Drug proving records and symptom documentation',
      icon: '🧪',
      allowedFormats: ['pdf', 'doc', 'docx', 'txt']
    },
    {
      value: 'lab_reports',
      label: 'Laboratory Reports',
      description: 'Supporting laboratory and diagnostic reports',
      icon: '🔬',
      allowedFormats: ['pdf', 'jpg', 'png', 'doc', 'docx']
    },
    {
      value: 'lifestyle_assessment',
      label: 'Lifestyle Assessment',
      description: 'Diet, exercise, and lifestyle evaluation',
      icon: '🏃‍♀️',
      allowedFormats: ['pdf', 'doc', 'docx', 'txt']
    }
  ],

  // AI Analysis Features
  aiAnalysisFeatures: [
    {
      id: 'constitutional_matching',
      name: 'Constitutional Type Matching',
      description: 'AI-powered constitutional type identification based on symptoms and characteristics',
      inputTypes: ['text', 'form_data'],
      outputFormat: 'analysis_report'
    },
    {
      id: 'remedy_selection',
      name: 'Remedy Selection Assistant',
      description: 'Intelligent remedy selection based on symptom totality and constitutional type',
      inputTypes: ['text', 'symptom_data'],
      outputFormat: 'remedy_recommendation'
    },
    {
      id: 'symptom_analysis',
      name: 'Symptom Pattern Analysis',
      description: 'Pattern recognition in symptom presentation and modalities',
      inputTypes: ['text', 'symptom_list'],
      outputFormat: 'pattern_analysis'
    },
    {
      id: 'miasmatic_assessment',
      name: 'Miasmatic Background Assessment',
      description: 'Analysis of miasmatic influences and hereditary patterns',
      inputTypes: ['text', 'family_history'],
      outputFormat: 'miasmatic_report'
    },
    {
      id: 'potency_suggestion',
      name: 'Potency Selection Guide',
      description: 'Appropriate potency selection based on case sensitivity and constitution',
      inputTypes: ['case_data', 'patient_profile'],
      outputFormat: 'potency_recommendation'
    },
    {
      id: 'repertorization_aid',
      name: 'Digital Repertorization',
      description: 'Automated repertorization and symptom hierarchy analysis',
      inputTypes: ['symptom_list', 'modalities'],
      outputFormat: 'repertory_chart'
    }
  ],

  // Dashboard Analytics
  analyticsConfig: {
    charts: [
      {
        id: 'constitution_distribution',
        title: 'Constitutional Types Distribution',
        type: 'pie',
        dataKey: 'constitution_types'
      },
      {
        id: 'remedy_usage',
        title: 'Most Prescribed Remedies',
        type: 'bar',
        dataKey: 'remedy_frequency'
      },
      {
        id: 'miasmatic_patterns',
        title: 'Miasmatic Background Patterns',
        type: 'doughnut',
        dataKey: 'miasmatic_distribution'
      },
      {
        id: 'case_outcomes',
        title: 'Treatment Outcomes',
        type: 'line',
        dataKey: 'outcome_trends'
      },
      {
        id: 'potency_usage',
        title: 'Potency Selection Patterns',
        type: 'bar',
        dataKey: 'potency_distribution'
      },
      {
        id: 'follow_up_compliance',
        title: 'Follow-up Compliance Rates',
        type: 'line',
        dataKey: 'followup_rates'
      }
    ],
    metrics: [
      { key: 'total_patients', label: 'Total Patients', icon: '👥' },
      { key: 'active_cases', label: 'Active Cases', icon: '📋' },
      { key: 'remedies_prescribed', label: 'Remedies Prescribed', icon: '💊' },
      { key: 'constitutional_assessments', label: 'Constitutional Assessments', icon: '🧬' },
      { key: 'follow_up_due', label: 'Follow-ups Due', icon: '⏰' },
      { key: 'miasmatic_analyses', label: 'Miasmatic Analyses', icon: '🔍' }
    ]
  },

  // Homeopathy Specializations
  specializations: [
    'Classical Homeopathy',
    'Constitutional Homeopathy',
    'Acute Prescribing',
    'Pediatric Homeopathy',
    'Women\'s Health',
    'Mental & Emotional Health',
    'Chronic Disease Management',
    'Miasmatic Treatment',
    'Organon Studies',
    'Materia Medica',
    'Repertory Work',
    'Proving Methodology'
  ],

  // Common Homeopathy Equipment/Tools
  equipmentList: [
    'Remedy Kits (30C, 200C, 1M)',
    'Digital Repertory Software',
    'Materia Medica Library',
    'Case Taking Forms',
    'Constitutional Assessment Tools',
    'Proving Documentation',
    'Potentizer',
    'Remedy Storage Cabinet',
    'Reference Books Collection',
    'Consultation Room Setup',
    'Patient Education Materials',
    'Follow-up Tracking System'
  ],

  // File Upload Configuration
  uploadConfig: {
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedFormats: [
      'pdf', 'doc', 'docx', 'txt', 'rtf',
      'jpg', 'jpeg', 'png', 'gif', 'bmp',
      'xls', 'xlsx', 'csv',
      'mp3', 'wav', 'mp4', 'avi'
    ],
    organization: {
      byInstitution: true,
      byPatient: true,
      byCategory: true,
      byDate: true
    }
  },

  // Navigation Menu Items
  navigationItems: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      path: '/dashboard'
    },
    {
      id: 'institutions',
      label: 'Institutions',
      icon: '🏥',
      path: '/institutions'
    },
    {
      id: 'patients',
      label: 'Patients',
      icon: '👥',
      path: '/patients'
    },
    {
      id: 'files',
      label: 'File Management',
      icon: '📁',
      path: '/files'
    },
    {
      id: 'ai_analysis',
      label: 'AI Analysis',
      icon: '🤖',
      path: '/ai-analysis'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: '📈',
      path: '/analytics'
    }
  ],

  // Status Options
  statusOptions: [
    { value: 'active', label: 'Active', color: 'success' },
    { value: 'inactive', label: 'Inactive', color: 'secondary' },
    { value: 'suspended', label: 'Suspended', color: 'warning' },
    { value: 'archived', label: 'Archived', color: 'info' }
  ],

  // API Endpoints
  endpoints: {
    // Institution Management
    institutions: '/s3-institutions',
    institutionDetail: (id) => `/s3-institutions/${id}`,
    institutionAnalytics: (id) => `/s3-institutions/${id}/analytics`,
    
    // Patient Management  
    patients: '/s3-patients',
    patientDetail: (id) => `/s3-patients/${id}`,
    patientFiles: (id) => `/s3-patients/${id}/files`,
    patientCases: (id) => `/s3-patients/${id}/cases`,
    
    // Case Management
    cases: '/s3-cases',
    caseDetail: (id) => `/s3-cases/${id}`,
    caseFiles: (id) => `/s3-cases/${id}/files`,
    
    // File Management
    files: '/s3-files',
    fileDetail: (id) => `/s3-files/${id}`,
    fileDownload: (id) => `/s3-files/${id}/download_url`,
    fileAnalyze: (id) => `/s3-files/${id}/analyze`,
    
    // Analysis Management
    analyses: '/s3-analyses',
    analysisDetail: (id) => `/s3-analyses/${id}`,
    analysisValidate: (id) => `/s3-analyses/${id}/validate`,
    
    // Analytics & Reports
    analytics: '/s3-analytics',
    sync: '/s3-sync',
    cleanup: '/cleanup-files',
    generateReport: '/generate-report'
  },

  // Form Validation Rules
  validationRules: {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    phone: 'Please enter a valid phone number',
    url: 'Please enter a valid URL',
    minLength: (min) => `Minimum ${min} characters required`,
    maxLength: (max) => `Maximum ${max} characters allowed`,
    pattern: (pattern) => `Please match the required pattern: ${pattern}`
  },

  // Error Messages
  errorMessages: {
    uploadFailed: 'File upload failed. Please try again.',
    deleteFailed: 'Failed to delete file. Please try again.',
    analysisFailed: 'Analysis failed. Please try again.',
    networkError: 'Network error. Please check your connection.',
    unauthorizedAccess: 'You do not have permission to access this resource.',
    serverError: 'Server error. Please try again later.'
  },

  // Success Messages
  successMessages: {
    uploadSuccess: 'File uploaded successfully',
    deleteSuccess: 'File deleted successfully',
    analysisComplete: 'Analysis completed successfully',
    dataSync: 'Data synchronized successfully',
    reportGenerated: 'Report generated successfully'
  }
};

export default homeopathyS3Config;
