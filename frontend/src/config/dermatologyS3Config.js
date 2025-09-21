// ================================
// Dermatology S3 Data Manager Configuration
// Soft Coding Implementation
// ================================

export const DERMATOLOGY_S3_CONFIG = {
  // API Configuration
  api: {
    baseUrl: '/api/dermatology/s3-api',
    endpoints: {
      institutions: '/s3-institutions/',
      patients: '/s3-patients/',
      medicalRecords: '/s3-medical-records/',
      consultations: '/s3-consultations/',
      treatmentPlans: '/s3-treatment-plans/',
      labResults: '/s3-lab-results/',
      skinPhotos: '/s3-skin-photos/',
      pathologyReports: '/s3-pathology-reports/',
      analytics: '/analytics/',
      upload: '/upload/',
      download: '/download/'
    },
    timeout: 30000,
    retryAttempts: 3
  },

  // Component Configuration
  component: {
    itemsPerPage: 10,
    searchDelay: 300,
    toastDuration: 3000,
    modalAnimation: 150,
    uploadMaxSize: 50 * 1024 * 1024, // 50MB
    allowedFileTypes: ['.jpg', '.jpeg', '.png', '.pdf', '.dcm', '.tiff'],
    autoSaveDelay: 2000
  },

  // Dermatology-specific Configuration
  dermatology: {
    skinTypes: [
      { value: 'type_1', label: 'Type I - Always burns, never tans' },
      { value: 'type_2', label: 'Type II - Usually burns, tans minimally' },
      { value: 'type_3', label: 'Type III - Sometimes burns, tans gradually' },
      { value: 'type_4', label: 'Type IV - Burns minimally, always tans' },
      { value: 'type_5', label: 'Type V - Very rarely burns, tans profusely' },
      { value: 'type_6', label: 'Type VI - Never burns, deeply pigmented' }
    ],
    
    conditions: [
      'Acne', 'Atopic Dermatitis', 'Psoriasis', 'Eczema', 'Rosacea',
      'Melanoma', 'Basal Cell Carcinoma', 'Squamous Cell Carcinoma',
      'Seborrheic Dermatitis', 'Contact Dermatitis', 'Vitiligo',
      'Alopecia', 'Urticaria', 'Lupus', 'Scleroderma', 'Pemphigus',
      'Hidradenitis Suppurativa', 'Keratosis Pilaris', 'Tinea',
      'Molluscum Contagiosum', 'Warts', 'Herpes Simplex', 'Shingles'
    ],
    
    severityLevels: [
      { value: 'mild', label: 'Mild', color: 'success' },
      { value: 'moderate', label: 'Moderate', color: 'warning' },
      { value: 'severe', label: 'Severe', color: 'danger' },
      { value: 'critical', label: 'Critical', color: 'dark' }
    ],
    
    bodyAreas: [
      'Face', 'Scalp', 'Neck', 'Chest', 'Back', 'Arms', 'Hands',
      'Abdomen', 'Legs', 'Feet', 'Genitals', 'Nails', 'Mucous Membranes'
    ],
    
    treatmentTypes: [
      'Topical Medication', 'Oral Medication', 'Injectable',
      'Phototherapy', 'Laser Therapy', 'Cryotherapy',
      'Chemical Peel', 'Dermabrasion', 'Surgery', 'Immunotherapy'
    ],
    
    consultationTypes: [
      'Initial Consultation', 'Follow-up', 'Urgent Care',
      'Cosmetic Consultation', 'Surgical Consultation',
      'Teledermatology', 'Second Opinion', 'Screening'
    ]
  },

  // Form Validation Rules
  validation: {
    patient: {
      required: ['first_name', 'last_name', 'date_of_birth', 'gender', 'skin_type'],
      patterns: {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^[\+]?[1-9][\d]{0,15}$/,
        patient_code: /^[A-Z]{2,3}\d{4,6}$/
      },
      lengths: {
        first_name: { min: 2, max: 50 },
        last_name: { min: 2, max: 50 },
        phone: { min: 10, max: 15 }
      }
    },
    
    consultation: {
      required: ['patient_id', 'consultation_date', 'consultation_type', 'chief_complaint'],
      lengths: {
        chief_complaint: { min: 10, max: 500 },
        assessment: { min: 10, max: 1000 },
        plan: { min: 10, max: 1000 }
      }
    },
    
    treatmentPlan: {
      required: ['patient_id', 'condition', 'treatment_type', 'start_date'],
      lengths: {
        description: { min: 20, max: 2000 },
        instructions: { min: 10, max: 1000 }
      }
    }
  },

  // Status Options
  statusOptions: {
    patient: [
      { value: 'active', label: 'Active', color: 'success' },
      { value: 'inactive', label: 'Inactive', color: 'secondary' },
      { value: 'pending', label: 'Pending', color: 'warning' },
      { value: 'discharged', label: 'Discharged', color: 'info' }
    ],
    
    consultation: [
      { value: 'scheduled', label: 'Scheduled', color: 'primary' },
      { value: 'in_progress', label: 'In Progress', color: 'warning' },
      { value: 'completed', label: 'Completed', color: 'success' },
      { value: 'cancelled', label: 'Cancelled', color: 'danger' }
    ],
    
    treatment: [
      { value: 'active', label: 'Active', color: 'success' },
      { value: 'paused', label: 'Paused', color: 'warning' },
      { value: 'completed', label: 'Completed', color: 'info' },
      { value: 'discontinued', label: 'Discontinued', color: 'danger' }
    ]
  },

  // AI Analysis Configuration
  aiAnalysis: {
    enabled: true,
    models: [
      {
        name: 'DermNet AI',
        description: 'Comprehensive skin condition classification',
        accuracy: 0.94,
        conditions: ['melanoma', 'psoriasis', 'eczema', 'acne']
      },
      {
        name: 'SkinVision Pro',
        description: 'Advanced mole and lesion analysis',
        accuracy: 0.92,
        conditions: ['melanoma', 'basal_cell', 'squamous_cell']
      },
      {
        name: 'DermaScope AI',
        description: 'General dermatology assistant',
        accuracy: 0.89,
        conditions: ['all']
      }
    ],
    
    confidenceThresholds: {
      high: 0.85,
      medium: 0.70,
      low: 0.50
    },
    
    features: [
      'Lesion Detection',
      'Color Analysis',
      'Texture Analysis',
      'Pattern Recognition',
      'Risk Assessment',
      'Treatment Recommendations'
    ]
  },

  // Data Export Configuration
  export: {
    formats: ['pdf', 'csv', 'excel', 'json'],
    templates: {
      patient_summary: 'Comprehensive patient report',
      consultation_notes: 'Consultation documentation',
      treatment_plan: 'Treatment plan document',
      progress_report: 'Patient progress summary'
    }
  },

  // Security Configuration
  security: {
    encryption: {
      enabled: true,
      algorithm: 'AES-256-GCM'
    },
    
    access_levels: [
      { level: 'read', label: 'Read Only' },
      { level: 'write', label: 'Read/Write' },
      { level: 'admin', label: 'Full Access' }
    ],
    
    audit: {
      enabled: true,
      events: ['create', 'read', 'update', 'delete', 'export', 'share']
    }
  },

  // UI Configuration
  ui: {
    theme: {
      primary: '#6f42c1',
      secondary: '#e83e8c',
      success: '#20c997',
      warning: '#fd7e14',
      danger: '#e74c3c',
      info: '#17a2b8'
    },
    
    icons: {
      patient: 'ri-user-line',
      consultation: 'ri-stethoscope-line',
      treatment: 'ri-medicine-bottle-line',
      photo: 'ri-camera-line',
      report: 'ri-file-text-line',
      ai: 'ri-brain-line',
      analytics: 'ri-bar-chart-line'
    },
    
    tables: {
      striped: true,
      hover: true,
      responsive: true,
      size: 'sm'
    }
  },

  // Analytics Configuration
  analytics: {
    metrics: [
      'total_patients',
      'new_patients_monthly',
      'consultations_completed',
      'active_treatments',
      'skin_photos_analyzed',
      'ai_analyses_performed'
    ],
    
    charts: {
      condition_distribution: {
        type: 'pie',
        title: 'Condition Distribution'
      },
      
      monthly_consultations: {
        type: 'line',
        title: 'Monthly Consultations'
      },
      
      treatment_outcomes: {
        type: 'bar',
        title: 'Treatment Outcomes'
      }
    }
  },

  // Integration Configuration
  integrations: {
    pacs: {
      enabled: true,
      formats: ['DICOM', 'JPEG', 'TIFF']
    },
    
    ehr: {
      enabled: true,
      standards: ['HL7', 'FHIR']
    },
    
    lab: {
      enabled: true,
      systems: ['PathNet', 'Cerner', 'Epic']
    }
  },

  // Sample Data Templates
  sampleData: {
    patient: {
      first_name: 'John',
      last_name: 'Smith',
      date_of_birth: '1990-01-15',
      gender: 'M',
      skin_type: 'type_3',
      primary_concern: 'Acne breakouts',
      phone: '+1234567890',
      email: 'john.smith@email.com'
    },
    
    consultation: {
      consultation_type: 'initial',
      chief_complaint: 'Persistent acne on face and back',
      duration_minutes: 30,
      assessment: 'Moderate inflammatory acne',
      plan: 'Topical retinoid and oral antibiotic therapy'
    }
  }
};

// Export utility functions
export const getDermatologyConfig = (section) => {
  return DERMATOLOGY_S3_CONFIG[section] || {};
};

export const getValidationRules = (entityType) => {
  return DERMATOLOGY_S3_CONFIG.validation[entityType] || {};
};

export const getStatusOptions = (type) => {
  return DERMATOLOGY_S3_CONFIG.statusOptions[type] || [];
};

export const getSkinTypes = () => {
  return DERMATOLOGY_S3_CONFIG.dermatology.skinTypes;
};

export const getConditions = () => {
  return DERMATOLOGY_S3_CONFIG.dermatology.conditions;
};

export const getSeverityLevels = () => {
  return DERMATOLOGY_S3_CONFIG.dermatology.severityLevels;
};

export default DERMATOLOGY_S3_CONFIG;
