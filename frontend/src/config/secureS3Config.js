/**
 * Secure S3 Data Manager Configuration
 * HIPAA-compliant, role-based healthcare data management system
 */

export const SECURE_S3_DATA_MANAGER_CONFIG = {
  // Service Information
  service: {
    name: 'Secure S3 Data Manager',
    description: 'HIPAA-compliant data management system for healthcare applications',
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'development'
  },

  // Security Configuration
  security: {
    encryption: {
      enabled: true,
      algorithm: 'Fernet',
      key_rotation: true
    },
    access_control: {
      role_based: true,
      multi_factor: true,
      audit_logging: true
    },
    compliance: {
      hipaa: true,
      gdpr: true,
      sox: true
    }
  },

  // UI Configuration
  ui: {
    theme: {
      primary: 'primary',
      secondary: 'outline-secondary',
      success: 'success',
      warning: 'warning',
      danger: 'danger',
      info: 'info'
    },
    icons: {
      folder: 'ri-folder-3-line',
      file: 'ri-file-line',
      upload: 'ri-upload-cloud-line',
      download: 'ri-download-cloud-line',
      user: 'ri-user-line',
      shield: 'ri-shield-check-line',
      lock: 'ri-lock-line',
      key: 'ri-key-line',
      audit: 'ri-file-list-3-line',
      settings: 'ri-settings-line',
      refresh: 'ri-refresh-line',
      search: 'ri-search-line',
      filter: 'ri-filter-line',
      sort: 'ri-sort-asc',
      expand: 'ri-expand-up-down-line',
      collapse: 'ri-collapse-up-down-line'
    },
    layout: {
      sidebar_enabled: true,
      breadcrumbs: true,
      search_enabled: true,
      filters_enabled: true,
      pagination: true
    }
  },

  // Module Configurations
  modules: {
    radiology: {
      name: 'Radiology Data Manager',
      description: 'DICOM and medical imaging data management',
      folder_structure: {
        base: 'healthcare/radiology',
        subfolders: ['dicom_images', 'reports', 'ai_analysis', 'studies', 'archived']
      },
      file_types: [
        'dicom', 'medical_image', 'radiological_report', 'ai_analysis', 'study_protocol'
      ],
      max_file_size: '50MB',
      allowed_extensions: ['.dcm', '.pdf', '.jpg', '.png', '.tiff'],
      retention_policy: '7_years'
    },

    medicine: {
      name: 'General Medicine Data Manager',
      description: 'Electronic health records and medical documentation',
      folder_structure: {
        base: 'healthcare/medicine',
        subfolders: ['medical_records', 'lab_results', 'prescriptions', 'treatment_plans', 'progress_notes']
      },
      file_types: [
        'medical_record', 'lab_result', 'prescription', 'treatment_plan', 'progress_note', 'discharge_summary'
      ],
      max_file_size: '25MB',
      allowed_extensions: ['.pdf', '.doc', '.docx', '.jpg', '.png'],
      retention_policy: '10_years'
    },

    dentistry: {
      name: 'Dental Data Manager',
      description: 'Dental records and imaging management',
      folder_structure: {
        base: 'healthcare/dentistry',
        subfolders: ['dental_records', 'xrays', 'treatment_plans', 'orthodontics', 'prosthetics']
      },
      file_types: [
        'dental_record', 'dental_xray', 'treatment_plan', 'orthodontic_plan', 'prosthetic_design'
      ],
      max_file_size: '30MB',
      allowed_extensions: ['.dcm', '.pdf', '.jpg', '.png', '.stl'],
      retention_policy: '7_years'
    },

    dermatology: {
      name: 'Dermatology Data Manager',
      description: 'Skin condition imaging and treatment records',
      folder_structure: {
        base: 'healthcare/dermatology',
        subfolders: ['skin_photos', 'dermoscopy', 'treatment_records', 'biopsy_results', 'follow_ups']
      },
      file_types: [
        'skin_photo', 'dermoscopy_image', 'biopsy_result', 'treatment_record', 'follow_up_note'
      ],
      max_file_size: '20MB',
      allowed_extensions: ['.jpg', '.png', '.tiff', '.pdf', '.doc'],
      retention_policy: '10_years'
    },

    pathology: {
      name: 'Pathology Data Manager',
      description: 'Laboratory results and pathological analyses',
      folder_structure: {
        base: 'healthcare/pathology',
        subfolders: ['lab_reports', 'microscopy', 'molecular_tests', 'cytology', 'histology']
      },
      file_types: [
        'lab_report', 'microscopy_image', 'molecular_test', 'cytology_report', 'histology_slide'
      ],
      max_file_size: '100MB',
      allowed_extensions: ['.pdf', '.jpg', '.png', '.tiff', '.svs'],
      retention_policy: '15_years'
    },

    homeopathy: {
      name: 'Homeopathy Data Manager',
      description: 'Homeopathic treatment records and case studies',
      folder_structure: {
        base: 'healthcare/homeopathy',
        subfolders: ['case_studies', 'prescriptions', 'repertorizations', 'follow_ups', 'materia_medica']
      },
      file_types: [
        'case_study', 'homeopathic_prescription', 'repertorization', 'follow_up', 'remedy_study'
      ],
      max_file_size: '15MB',
      allowed_extensions: ['.pdf', '.doc', '.docx', '.txt'],
      retention_policy: '7_years'
    },

    allopathy: {
      name: 'Allopathy Data Manager',
      description: 'Modern medicine practice and pharmaceutical records',
      folder_structure: {
        base: 'healthcare/allopathy',
        subfolders: ['clinical_records', 'drug_interactions', 'research_data', 'protocols', 'outcomes']
      },
      file_types: [
        'clinical_record', 'drug_interaction', 'research_data', 'clinical_protocol', 'treatment_outcome'
      ],
      max_file_size: '25MB',
      allowed_extensions: ['.pdf', '.doc', '.docx', '.csv', '.xlsx'],
      retention_policy: '10_years'
    },

    cosmetology: {
      name: 'Cosmetology Data Manager',
      description: 'Cosmetic procedure documentation and imaging',
      folder_structure: {
        base: 'healthcare/cosmetology',
        subfolders: ['before_after', 'procedures', 'consultations', 'treatments', 'follow_ups']
      },
      file_types: [
        'before_after_photo', 'procedure_record', 'consultation_note', 'treatment_plan', 'follow_up'
      ],
      max_file_size: '20MB',
      allowed_extensions: ['.jpg', '.png', '.pdf', '.doc'],
      retention_policy: '5_years'
    },

    dna_sequencing: {
      name: 'DNA Sequencing Data Manager',
      description: 'Genomic data and analysis results',
      folder_structure: {
        base: 'research/dna-sequencing',
        subfolders: ['raw_data', 'processed_data', 'analysis_results', 'reports', 'models']
      },
      file_types: [
        'raw_sequence', 'processed_data', 'analysis_result', 'genomic_report', 'ai_model'
      ],
      max_file_size: '500MB',
      allowed_extensions: ['.fastq', '.fasta', '.vcf', '.bam', '.sam', '.pdf'],
      retention_policy: '15_years'
    },

    secureneat: {
      name: 'SecureNeat Educational Manager',
      description: 'Educational content and learning materials',
      folder_structure: {
        base: 'education/secureneat',
        subfolders: ['books', 'courses', 'assessments', 'user_data', 'analytics']
      },
      file_types: [
        'educational_book', 'course_material', 'assessment', 'user_progress', 'analytics_data'
      ],
      max_file_size: '100MB',
      allowed_extensions: ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.mp4'],
      retention_policy: '5_years'
    }
  },

  // Role-based permissions
  permissions: {
    super_admin: {
      modules: '*',
      actions: ['create', 'read', 'write', 'delete', 'admin', 'audit'],
      restrictions: []
    },
    admin: {
      modules: [], // Set dynamically based on admin's assigned modules
      actions: ['create', 'read', 'write', 'delete', 'audit'],
      restrictions: ['no_cross_module_access']
    },
    doctor: {
      modules: [], // Set based on doctor's specialization
      actions: ['create', 'read', 'write'],
      restrictions: ['own_patients_only', 'module_specific']
    },
    nurse: {
      modules: [], // Set based on assigned departments
      actions: ['read', 'write'],
      restrictions: ['assigned_patients_only', 'limited_delete']
    },
    patient: {
      modules: [],
      actions: ['read'],
      restrictions: ['own_data_only', 'no_admin_functions']
    }
  },

  // Audit and monitoring
  audit: {
    enabled: true,
    log_level: 'detailed',
    retention_days: 2555, // 7 years
    real_time_monitoring: true,
    alert_thresholds: {
      failed_access_attempts: 5,
      bulk_download_threshold: 10,
      unusual_activity_score: 85
    }
  },

  // File upload constraints
  upload: {
    max_file_size: '50MB',
    allowed_types: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/tiff',
      'application/dicom',
      'text/plain',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ],
    virus_scanning: true,
    content_validation: true,
    metadata_extraction: true
  },

  // Integration endpoints
  api: {
    base_url: '/api/secure-s3',
    endpoints: {
      workspaces: '/workspaces/',
      patient_folders: '/patient-folders/',
      file_upload: '/file/upload/',
      file_download: '/file/download/{patient_id}/{file_id}/',
      file_list: '/files/{patient_id}/',
      audit_logs: '/audit-logs/',
      permissions: '/permissions/',
      workspace_create: '/workspace/create/',
      patient_folder_create: '/patient-folder/create/'
    },
    timeout: 30000, // 30 seconds
    retry_attempts: 3
  },

  // Backup and disaster recovery
  backup: {
    enabled: true,
    frequency: 'daily',
    retention_policy: '90_days',
    cross_region_replication: true,
    encryption_at_rest: true
  }
};

// Export legacy config for backward compatibility
export const S3_DATA_MANAGER_CONFIG = SECURE_S3_DATA_MANAGER_CONFIG;

// Default export for the new component structure
export default SECURE_S3_DATA_MANAGER_CONFIG;
