/**
 * Cosmetology S3 Data Management Configuration
 * Comprehensive configuration for beauty and aesthetic practice management with cloud storage
 * Includes treatment protocols, client management, aesthetic procedures, and beauty enhancement tracking
 */

export const cosmetologyS3Config = {
  // API Base URLs
  baseUrl: `${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}/cosmetology`,
  s3ApiUrl: `${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}/cosmetology`,
  
  // Module Information
  moduleInfo: {
    name: 'Cosmetology S3 Data Manager',
    description: 'Comprehensive beauty and aesthetic practice management with treatment tracking and client portfolio',
    version: '1.0.0',
    specialty: 'cosmetology',
    features: [
      'Client Portfolio Management',
      'Treatment Protocols',
      'Before/After Documentation',
      'Product Inventory',
      'Aesthetic Procedures',
      'Beauty Enhancement Tracking'
    ]
  },

  // Beauty Institution Types
  institutionTypes: [
    { value: 'beauty_salon', label: 'Beauty Salon', icon: '💄' },
    { value: 'spa', label: 'Medical Spa', icon: '🧖‍♀️' },
    { value: 'clinic', label: 'Aesthetic Clinic', icon: '🏥' },
    { value: 'dermatology_center', label: 'Dermatology Center', icon: '🔬' },
    { value: 'wellness_center', label: 'Wellness Center', icon: '🌿' },
    { value: 'cosmetic_surgery', label: 'Cosmetic Surgery Center', icon: '✨' },
    { value: 'training_academy', label: 'Beauty Training Academy', icon: '🎓' },
    { value: 'product_lab', label: 'Product Development Lab', icon: '🧪' }
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
      placeholder: 'Beauty/aesthetic practice license'
    },
    {
      name: 'accreditation_body',
      label: 'Accreditation Body',
      type: 'text',
      placeholder: 'CIDESCO, NCEA, etc.'
    },
    {
      name: 'head_aesthetician',
      label: 'Head Aesthetician',
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
      placeholder: 'salon@example.com'
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
      placeholder: 'Mon-Sat 9AM-7PM'
    },
    {
      name: 'emergency_contact',
      label: 'Emergency Contact',
      type: 'text',
      placeholder: 'After hours contact information'
    }
  ],

  // Client Information Fields
  clientFields: [
    {
      name: 'client_id',
      label: 'Client ID',
      type: 'text',
      required: true,
      placeholder: 'Unique client identifier'
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
        { value: 'female', label: 'Female' },
        { value: 'male', label: 'Male' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      name: 'skin_type',
      label: 'Skin Type',
      type: 'select',
      options: [
        { value: 'normal', label: 'Normal' },
        { value: 'dry', label: 'Dry' },
        { value: 'oily', label: 'Oily' },
        { value: 'combination', label: 'Combination' },
        { value: 'sensitive', label: 'Sensitive' },
        { value: 'mature', label: 'Mature' }
      ]
    },
    {
      name: 'fitzpatrick_scale',
      label: 'Fitzpatrick Skin Type',
      type: 'select',
      options: [
        { value: 'type_1', label: 'Type I - Very Fair' },
        { value: 'type_2', label: 'Type II - Fair' },
        { value: 'type_3', label: 'Type III - Medium' },
        { value: 'type_4', label: 'Type IV - Olive' },
        { value: 'type_5', label: 'Type V - Brown' },
        { value: 'type_6', label: 'Type VI - Dark Brown' }
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
      placeholder: 'client@example.com'
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
      name: 'referring_source',
      label: 'Referring Source',
      type: 'text',
      placeholder: 'How did they find us?'
    }
  ],

  // Beauty & Aesthetic File Categories
  fileCategories: [
    {
      value: 'before_after_photos',
      label: 'Before/After Photos',
      description: 'Treatment documentation and progress photos',
      icon: '📸',
      allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'bmp']
    },
    {
      value: 'treatment_plans',
      label: 'Treatment Plans',
      description: 'Customized beauty and aesthetic treatment protocols',
      icon: '📋',
      allowedFormats: ['pdf', 'doc', 'docx', 'txt']
    },
    {
      value: 'skin_analysis',
      label: 'Skin Analysis Reports',
      description: 'Detailed skin condition analysis and assessments',
      icon: '🔍',
      allowedFormats: ['pdf', 'doc', 'docx', 'jpg', 'png']
    },
    {
      value: 'client_consultations',
      label: 'Client Consultations',
      description: 'Initial consultations and beauty assessments',
      icon: '💬',
      allowedFormats: ['pdf', 'doc', 'docx', 'txt', 'mp3', 'wav']
    },
    {
      value: 'procedure_documentation',
      label: 'Procedure Documentation',
      description: 'Aesthetic procedures and treatment records',
      icon: '🩺',
      allowedFormats: ['pdf', 'doc', 'docx', 'jpg', 'png', 'mp4']
    },
    {
      value: 'product_formulations',
      label: 'Product Formulations',
      description: 'Custom beauty product formulations and recipes',
      icon: '🧴',
      allowedFormats: ['pdf', 'doc', 'docx', 'xls', 'xlsx']
    },
    {
      value: 'allergy_patch_tests',
      label: 'Allergy & Patch Tests',
      description: 'Sensitivity testing and allergy documentation',
      icon: '🧪',
      allowedFormats: ['pdf', 'jpg', 'png', 'doc', 'docx']
    },
    {
      value: 'progress_tracking',
      label: 'Progress Tracking',
      description: 'Treatment progress and outcome monitoring',
      icon: '📈',
      allowedFormats: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'png']
    },
    {
      value: 'product_recommendations',
      label: 'Product Recommendations',
      description: 'Personalized beauty product recommendations',
      icon: '💄',
      allowedFormats: ['pdf', 'doc', 'docx', 'txt']
    },
    {
      value: 'training_materials',
      label: 'Training Materials',
      description: 'Educational content and training documentation',
      icon: '📚',
      allowedFormats: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'mp4', 'mp3']
    }
  ],

  // AI Analysis Features
  aiAnalysisFeatures: [
    {
      id: 'skin_condition_analysis',
      name: 'Skin Condition Analysis',
      description: 'AI-powered skin condition assessment and treatment recommendations',
      inputTypes: ['image', 'photo'],
      outputFormat: 'analysis_report'
    },
    {
      id: 'aging_assessment',
      name: 'Aging Assessment',
      description: 'Facial aging analysis and anti-aging treatment suggestions',
      inputTypes: ['image', 'facial_photo'],
      outputFormat: 'aging_report'
    },
    {
      id: 'color_matching',
      name: 'Color Matching',
      description: 'Perfect makeup and hair color matching based on skin tone',
      inputTypes: ['image', 'color_data'],
      outputFormat: 'color_palette'
    },
    {
      id: 'treatment_effectiveness',
      name: 'Treatment Effectiveness',
      description: 'Progress tracking and treatment outcome prediction',
      inputTypes: ['before_after_images', 'treatment_data'],
      outputFormat: 'effectiveness_report'
    },
    {
      id: 'product_recommendation',
      name: 'Product Recommendation',
      description: 'Personalized beauty product suggestions based on skin analysis',
      inputTypes: ['skin_data', 'client_profile'],
      outputFormat: 'product_list'
    },
    {
      id: 'facial_symmetry',
      name: 'Facial Symmetry Analysis',
      description: 'Facial structure analysis for aesthetic enhancement planning',
      inputTypes: ['facial_photo', 'measurement_data'],
      outputFormat: 'symmetry_report'
    }
  ],

  // Dashboard Analytics
  analyticsConfig: {
    charts: [
      {
        id: 'skin_type_distribution',
        title: 'Client Skin Types Distribution',
        type: 'pie',
        dataKey: 'skin_types'
      },
      {
        id: 'popular_treatments',
        title: 'Most Popular Treatments',
        type: 'bar',
        dataKey: 'treatment_frequency'
      },
      {
        id: 'age_demographics',
        title: 'Client Age Demographics',
        type: 'histogram',
        dataKey: 'age_distribution'
      },
      {
        id: 'treatment_outcomes',
        title: 'Treatment Success Rates',
        type: 'line',
        dataKey: 'success_trends'
      },
      {
        id: 'product_sales',
        title: 'Product Sales Performance',
        type: 'bar',
        dataKey: 'product_performance'
      },
      {
        id: 'client_satisfaction',
        title: 'Client Satisfaction Ratings',
        type: 'gauge',
        dataKey: 'satisfaction_scores'
      }
    ],
    metrics: [
      { key: 'total_clients', label: 'Total Clients', icon: '👥' },
      { key: 'active_treatments', label: 'Active Treatments', icon: '💆‍♀️' },
      { key: 'completed_procedures', label: 'Completed Procedures', icon: '✅' },
      { key: 'product_formulations', label: 'Product Formulations', icon: '🧴' },
      { key: 'client_satisfaction', label: 'Satisfaction Rate', icon: '⭐' },
      { key: 'revenue_this_month', label: 'Monthly Revenue', icon: '💰' }
    ]
  },

  // Beauty Specializations
  specializations: [
    'Facial Treatments',
    'Anti-Aging Procedures',
    'Acne Treatment',
    'Chemical Peels',
    'Microdermabrasion',
    'Laser Treatments',
    'Botox & Fillers',
    'Skin Rejuvenation',
    'Hair Removal',
    'Body Contouring',
    'Makeup Artistry',
    'Bridal Beauty',
    'Product Development',
    'Color Analysis'
  ],

  // Common Beauty Equipment/Tools
  equipmentList: [
    'Facial Steamer',
    'Microdermabrasion Machine',
    'LED Light Therapy Device',
    'High Frequency Machine',
    'Ultrasonic Skin Scrubber',
    'Galvanic Current Machine',
    'Chemical Peel Equipment',
    'Laser Treatment Device',
    'Cryotherapy Machine',
    'Radio Frequency Device',
    'Professional Makeup Kit',
    'Airbrush System',
    'Skin Analysis Camera',
    'Digital Color Matching Tool'
  ],

  // File Upload Configuration
  uploadConfig: {
    maxFileSize: 100 * 1024 * 1024, // 100MB (larger for high-res photos)
    allowedFormats: [
      'pdf', 'doc', 'docx', 'txt', 'rtf',
      'jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff',
      'xls', 'xlsx', 'csv',
      'mp3', 'wav', 'mp4', 'avi', 'mov',
      'ppt', 'pptx'
    ],
    organization: {
      byInstitution: true,
      byClient: true,
      byTreatment: true,
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
      icon: '🏢',
      path: '/institutions'
    },
    {
      id: 'clients',
      label: 'Clients',
      icon: '👥',
      path: '/clients'
    },
    {
      id: 'treatments',
      label: 'Treatments',
      icon: '💆‍♀️',
      path: '/treatments'
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
    
    // Client Management  
    clients: '/s3-clients',
    clientDetail: (id) => `/s3-clients/${id}`,
    clientFiles: (id) => `/s3-clients/${id}/files`,
    clientTreatments: (id) => `/s3-clients/${id}/treatments`,
    
    // Treatment Management
    treatments: '/s3-treatments',
    treatmentDetail: (id) => `/s3-treatments/${id}`,
    treatmentFiles: (id) => `/s3-treatments/${id}/files`,
    
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
    reportGenerated: 'Report generated successfully',
    treatmentUpdated: 'Treatment updated successfully',
    clientCreated: 'Client profile created successfully'
  }
};

export default cosmetologyS3Config;
