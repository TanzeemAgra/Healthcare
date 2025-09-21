// S3 Data Manager Configuration - Soft Coding Approach
export const S3_DATA_MANAGER_CONFIG = {
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
    versionControl: true
  },

  // Bucket List for UI
  buckets: [
    { 
      id: 'genomics-data', 
      name: 'Genomics Data', 
      description: 'Raw sequencing data and input files',
      icon: 'ri-dna-line',
      color: 'primary' 
    },
    { 
      id: 'genomics-results', 
      name: 'Analysis Results', 
      description: 'AI analysis outputs and reports',
      icon: 'ri-file-chart-line',
      color: 'success' 
    },
    { 
      id: 'genomics-models', 
      name: 'AI Models', 
      description: 'Trained models and configurations',
      icon: 'ri-brain-line',
      color: 'info' 
    },
    { 
      id: 'genomics-backup', 
      name: 'Backup Storage', 
      description: 'Backup and archived data',
      icon: 'ri-archive-line',
      color: 'warning' 
    }
  ],

  // S3 Configuration
  s3Config: {
    region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
    buckets: {
      genomics: {
        name: process.env.REACT_APP_S3_GENOMICS_BUCKET || 'xerxez-genomics-data',
        displayName: 'Genomics Data',
        icon: 'ri-dna-line',
        color: 'primary',
        maxFileSize: '10GB',
        allowedTypes: ['.fastq', '.fq', '.bam', '.sam', '.vcf', '.bed', '.gff3', '.gtf'],
        description: 'Raw sequencing data and analysis results'
      },
      results: {
        name: process.env.REACT_APP_S3_RESULTS_BUCKET || 'xerxez-analysis-results',
        displayName: 'Analysis Results',
        icon: 'ri-file-chart-line',
        color: 'success',
        maxFileSize: '5GB',
        allowedTypes: ['.json', '.csv', '.xlsx', '.pdf', '.html'],
        description: 'Analysis outputs and reports'
      },
      models: {
        name: process.env.REACT_APP_S3_MODELS_BUCKET || 'xerxez-ai-models',
        displayName: 'AI Models',
        icon: 'ri-brain-line',
        color: 'info',
        maxFileSize: '50GB',
        allowedTypes: ['.pkl', '.h5', '.pt', '.onnx', '.pb'],
        description: 'Trained AI models and configurations'
      },
      backup: {
        name: process.env.REACT_APP_S3_BACKUP_BUCKET || 'xerxez-genomics-backup',
        displayName: 'Backup Storage',
        icon: 'ri-archive-line',
        color: 'warning',
        maxFileSize: '100GB',
        allowedTypes: ['*'],
        description: 'Backup and archive storage'
      }
    }
  },

  // File Operations Configuration
  operations: {
    upload: {
      enabled: true,
      multipart: true,
      multipartThreshold: '100MB',
      maxConcurrentUploads: 3,
      retryCount: 3,
      chunkSize: '10MB',
      progressTracking: true
    },
    download: {
      enabled: true,
      resumable: true,
      streaming: true,
      compressionEnabled: true,
      maxConcurrentDownloads: 5
    },
    delete: {
      enabled: true,
      softDelete: true,
      retentionDays: 30,
      requireConfirmation: true,
      bulkDeleteLimit: 100
    },
    sync: {
      enabled: true,
      autoSync: false,
      syncInterval: 300, // seconds
      conflictResolution: 'manual' // auto, manual, timestamp
    }
  },

  // UI Configuration
  ui: {
    layout: {
      defaultView: 'grid', // grid, list, tree
      itemsPerPage: 25,
      showPreview: true,
      showMetadata: true,
      enableSearch: true,
      enableFilters: true
    },
    themes: {
      genomics: {
        primary: '#007bff',
        secondary: '#6c757d',
        success: '#28a745',
        info: '#17a2b8',
        warning: '#ffc107',
        danger: '#dc3545'
      }
    },
    animations: {
      enabled: true,
      uploadProgress: true,
      transitionEffects: true
    }
  },

  // Security Configuration
  security: {
    encryption: {
      enabled: true,
      algorithm: 'AES-256',
      keyRotation: true
    },
    access: {
      publicReadEnabled: false,
      temporaryUrls: true,
      urlExpirationTime: 3600, // seconds
      ipWhitelist: [],
      requiredPermissions: ['s3_access', 'genomics_data_access']
    },
    audit: {
      enabled: true,
      logOperations: ['upload', 'download', 'delete', 'share'],
      retentionDays: 90
    }
  },

  // Integration Configuration
  integration: {
    aiModels: {
      enabled: true,
      autoModelRegistration: true,
      modelMetadata: true,
      versionTracking: true
    },
    analysis: {
      directProcessing: true,
      outputRedirection: true,
      inputValidation: true
    },
    backup: {
      enabled: true,
      automaticBackup: true,
      backupSchedule: 'daily',
      retentionPolicy: '365d'
    }
  },

  // Notifications Configuration
  notifications: {
    uploadComplete: {
      enabled: true,
      showProgress: true,
      autoHide: false
    },
    downloadComplete: {
      enabled: true,
      showProgress: true,
      autoHide: true,
      autoHideDelay: 5000
    },
    errors: {
      enabled: true,
      retryPrompt: true,
      detailedErrors: true
    },
    quotaWarning: {
      enabled: true,
      warningThreshold: 0.8, // 80%
      criticalThreshold: 0.95 // 95%
    }
  },

  // Performance Configuration
  performance: {
    caching: {
      enabled: true,
      metadataCacheTime: 300, // seconds
      previewCacheTime: 600,
      maxCacheSize: '500MB'
    },
    optimization: {
      lazyLoading: true,
      virtualScrolling: true,
      imageOptimization: true,
      compressionLevel: 6
    }
  }
};

// S3 Operations Configuration
export const S3_OPERATIONS = {
  // File Management Operations
  fileOps: {
    upload: {
      endpoint: '/api/s3/upload/',
      method: 'POST',
      multipart: true,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    },
    download: {
      endpoint: '/api/s3/download/',
      method: 'GET',
      streaming: true
    },
    delete: {
      endpoint: '/api/s3/delete/',
      method: 'DELETE',
      confirmation: true
    },
    list: {
      endpoint: '/api/s3/list/',
      method: 'GET',
      pagination: true
    },
    metadata: {
      endpoint: '/api/s3/metadata/',
      method: 'GET',
      detailed: true
    }
  },

  // Folder Operations
  folderOps: {
    create: {
      endpoint: '/api/s3/folder/create/',
      method: 'POST'
    },
    list: {
      endpoint: '/api/s3/folder/list/',
      method: 'GET'
    },
    delete: {
      endpoint: '/api/s3/folder/delete/',
      method: 'DELETE',
      recursive: true
    }
  },

  // Bulk Operations
  bulkOps: {
    upload: {
      endpoint: '/api/s3/bulk/upload/',
      method: 'POST',
      maxFiles: 100
    },
    download: {
      endpoint: '/api/s3/bulk/download/',
      method: 'POST',
      zipCompression: true
    },
    delete: {
      endpoint: '/api/s3/bulk/delete/',
      method: 'POST',
      confirmation: true
    }
  }
};

// S3 File Types Configuration
export const S3_FILE_TYPES = {
  genomics: {
    fastq: {
      extensions: ['.fastq', '.fq', '.fastq.gz', '.fq.gz'],
      icon: 'ri-file-text-line',
      color: 'primary',
      previewable: false,
      maxSize: '50GB'
    },
    bam: {
      extensions: ['.bam', '.sam'],
      icon: 'ri-file-3-line',
      color: 'success',
      previewable: false,
      maxSize: '100GB'
    },
    vcf: {
      extensions: ['.vcf', '.vcf.gz'],
      icon: 'ri-git-branch-line',
      color: 'info',
      previewable: true,
      maxSize: '10GB'
    },
    bed: {
      extensions: ['.bed', '.bedgraph'],
      icon: 'ri-map-pin-line',
      color: 'warning',
      previewable: true,
      maxSize: '5GB'
    }
  },
  results: {
    reports: {
      extensions: ['.pdf', '.html', '.docx'],
      icon: 'ri-file-chart-line',
      color: 'danger',
      previewable: true,
      maxSize: '100MB'
    },
    data: {
      extensions: ['.csv', '.xlsx', '.json'],
      icon: 'ri-file-excel-line',
      color: 'success',
      previewable: true,
      maxSize: '500MB'
    }
  },
  models: {
    tensorflow: {
      extensions: ['.h5', '.pb', '.tflite'],
      icon: 'ri-brain-line',
      color: 'info',
      previewable: false,
      maxSize: '10GB'
    },
    pytorch: {
      extensions: ['.pt', '.pth'],
      icon: 'ri-cpu-line',
      color: 'primary',
      previewable: false,
      maxSize: '10GB'
    }
  }
};

export default S3_DATA_MANAGER_CONFIG;
