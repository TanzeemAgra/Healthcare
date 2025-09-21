// NeatSecure S3 Configuration - Enhanced Soft Coding
// Educational and Exam Management Data Storage

export const NEAT_SECURE_S3_CONFIG = {
  // Service Metadata
  service: {
    name: 'NeatSecure S3 Data Manager',
    description: 'Secure educational content and exam data management system',
    version: '2.0.0',
    environment: process.env.REACT_APP_ENVIRONMENT || 'development'
  },

  // AWS Configuration
  aws: {
    region: process.env.REACT_APP_NEAT_S3_REGION || 'us-east-1',
    accessKeyId: process.env.REACT_APP_NEAT_S3_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_NEAT_S3_SECRET_KEY,
    endpoint: process.env.REACT_APP_NEAT_S3_ENDPOINT
  },

  // UI Configuration
  ui: {
    theme: {
      primaryColor: '#0d6efd',
      successColor: '#198754',
      warningColor: '#fd7e14',
      dangerColor: '#dc3545',
      infoColor: '#0dcaf0'
    },
    layout: {
      containerFluid: true,
      showHeader: true,
      showStats: true,
      showGuidelines: true,
      enableRefresh: true
    },
    icons: {
      service: 'ri-database-2-fill',
      refresh: 'ri-refresh-line',
      shield: 'ri-shield-check-line',
      folder: 'ri-folder-3-fill',
      info: 'ri-information-fill'
    }
  },

  // Feature Flags
  features: {
    enableEncryption: true,
    enableVersioning: true,
    enableBackup: true,
    enableAnalytics: true,
    enableMultiLanguage: true,
    enableAI: true,
    enableCompliance: true,
    enableAuditLog: true
  },

  // Educational Specific Settings
  education: {
    examTypes: ['MCQ', 'OSCE', 'NEET-PG', 'USMLE', 'PLAB'],
    subjects: ['Medicine', 'Surgery', 'Pediatrics', 'Gynecology', 'Psychiatry'],
    languages: ['English', 'Spanish', 'French', 'German', 'Hindi'],
    difficultyLevels: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    contentTypes: ['text', 'video', 'audio', 'interactive', 'simulation']
  },

  // S3 Buckets Configuration
  buckets: [
    {
      id: 'exam-content',
      name: 'exam-content',
      displayName: 'Exam Content',
      description: 'MCQ questions, OSCE scenarios, and exam materials',
      icon: 'ri-file-text-fill',
      color: '#e74c3c',
      category: 'content',
      priority: 1,
      features: ['versioning', 'encryption', 'backup'],
      permissions: {
        read: ['student', 'teacher', 'admin'],
        write: ['teacher', 'admin'],
        delete: ['admin']
      },
      security: {
        encryption: 'AES-256',
        accessControl: 'role-based',
        auditLogging: true,
        dataClassification: 'confidential'
      },
      retentionPolicy: {
        period: 'permanent',
        description: 'Educational content retained permanently for continuous learning',
        backupFrequency: 'daily'
      },
      metadata: {
        maxFileSize: '100MB',
        allowedFormats: ['json', 'xml', 'pdf', 'docx'],
        indexing: true
      }
    },
    {
      id: 'student-data',
      name: 'student-data',
      displayName: 'Student Data',
      description: 'Student progress, scores, and performance analytics',
      icon: 'ri-user-2-fill',
      color: '#3498db',
      category: 'analytics',
      priority: 2,
      features: ['encryption', 'privacy-compliant', 'analytics'],
      permissions: {
        read: ['student', 'teacher', 'admin'],
        write: ['system', 'admin'],
        delete: ['admin']
      },
      security: {
        encryption: 'AES-256',
        accessControl: 'student-level',
        auditLogging: true,
        gdprCompliant: true,
        dataClassification: 'personal'
      },
      retentionPolicy: {
        period: '7 years',
        description: 'Student data retained per educational regulations',
        backupFrequency: 'hourly'
      },
      metadata: {
        maxFileSize: '50MB',
        allowedFormats: ['csv', 'json', 'xlsx'],
        anonymization: true
      }
    },
    {
      id: 'ai-models',
      name: 'ai-models',
      displayName: 'AI Models',
      description: 'Dr Max Bot models and educational AI algorithms',
      icon: 'ri-robot-2-fill',
      color: '#9b59b6',
      category: 'ai',
      priority: 3,
      features: ['versioning', 'model-registry', 'performance-tracking'],
      permissions: {
        read: ['developer', 'admin'],
        write: ['developer', 'admin'],
        delete: ['admin']
      },
      security: {
        encryption: 'AES-256',
        accessControl: 'admin-only',
        auditLogging: true,
        dataClassification: 'proprietary'
      },
      retentionPolicy: {
        period: 'permanent',
        description: 'AI models retained permanently for continuous improvement',
        backupFrequency: 'weekly'
      },
      metadata: {
        maxFileSize: '5GB',
        allowedFormats: ['h5', 'pkl', 'pt', 'onnx'],
        versionControl: true
      }
    },
    {
      id: 'multimedia-content',
      name: 'multimedia-content',
      displayName: 'Multimedia Content',
      description: 'Educational videos, images, and interactive content',
      icon: 'ri-video-fill',
      color: '#f39c12',
      category: 'media',
      priority: 4,
      features: ['cdn', 'streaming', 'compression'],
      permissions: {
        read: ['student', 'teacher', 'admin'],
        write: ['teacher', 'admin'],
        delete: ['admin']
      },
      security: {
        encryption: 'AES-256',
        accessControl: 'role-based',
        auditLogging: true,
        dataClassification: 'public'
      },
      retentionPolicy: {
        period: 'permanent',
        description: 'Educational multimedia content retained permanently',
        backupFrequency: 'weekly'
      },
      metadata: {
        maxFileSize: '2GB',
        allowedFormats: ['mp4', 'webm', 'jpg', 'png', 'svg'],
        streaming: true
      }
    },
    {
      id: 'assessment-data',
      name: 'assessment-data',
      displayName: 'Assessment Data',
      description: 'Exam results, feedback, and performance reports',
      icon: 'ri-bar-chart-box-fill',
      color: '#27ae60',
      category: 'analytics',
      priority: 5,
      features: ['analytics', 'reporting', 'export'],
      permissions: {
        read: ['teacher', 'admin'],
        write: ['system', 'admin'],
        delete: ['admin']
      },
      security: {
        encryption: 'AES-256',
        accessControl: 'role-based',
        auditLogging: true,
        dataClassification: 'confidential'
      },
      retentionPolicy: {
        period: '10 years',
        description: 'Assessment data retained for educational continuity',
        backupFrequency: 'daily'
      },
      metadata: {
        maxFileSize: '200MB',
        allowedFormats: ['json', 'csv', 'pdf', 'xlsx'],
        reporting: true
      }
    },
    {
      id: 'system-backups',
      name: 'system-backups',
      displayName: 'System Backups',
      description: 'Educational platform backups and disaster recovery',
      icon: 'ri-save-fill',
      color: '#34495e',
      category: 'system',
      priority: 6,
      features: ['automated-backup', 'disaster-recovery', 'versioning'],
      permissions: {
        read: ['admin'],
        write: ['system', 'admin'],
        delete: ['admin']
      },
      security: {
        encryption: 'AES-256',
        accessControl: 'admin-only',
        auditLogging: true,
        dataClassification: 'system'
      },
      retentionPolicy: {
        period: '5 years',
        description: 'System backups retained for disaster recovery',
        backupFrequency: 'continuous'
      },
      metadata: {
        maxFileSize: '10GB',
        allowedFormats: ['tar', 'gz', 'sql', 'dump'],
        compression: true
      }
    }
  ],

  // Compliance Configuration
  compliance: {
    educational: {
      enabled: true,
      standards: ['FERPA', 'COPPA', 'GDPR', 'PIPEDA'],
      auditFrequency: 'quarterly',
      certifications: ['SOC2', 'ISO27001'],
      reporting: true
    },
    dataPrivacy: {
      anonymization: true,
      rightToErasure: true,
      dataPortability: true,
      consentManagement: true,
      dataMinimization: true
    },
    security: {
      encryptionAtRest: true,
      encryptionInTransit: true,
      accessLogging: true,
      vulnerabilityScanning: true,
      penetrationTesting: 'quarterly'
    }
  },

  // Monitoring and Alerting
  monitoring: {
    enabled: true,
    metrics: [
      'storage-usage',
      'access-patterns',
      'performance',
      'security-events',
      'compliance-status'
    ],
    alerts: [
      'high-usage',
      'security-breach',
      'performance-degradation',
      'compliance-violation',
      'backup-failure'
    ],
    dashboards: {
      realTime: true,
      historical: true,
      predictive: true
    },
    notifications: {
      email: true,
      sms: false,
      slack: true,
      webhook: true
    }
  },

  // Performance Configuration
  performance: {
    caching: {
      enabled: true,
      ttl: 3600,
      strategy: 'LRU'
    },
    compression: {
      enabled: true,
      algorithm: 'gzip',
      level: 6
    },
    cdn: {
      enabled: true,
      provider: 'cloudfront',
      regions: ['us-east-1', 'eu-west-1', 'ap-south-1']
    }
  },

  // Integration Settings
  integrations: {
    lms: {
      enabled: true,
      providers: ['moodle', 'canvas', 'blackboard'],
      apiVersion: 'v2'
    },
    examPlatforms: {
      enabled: true,
      providers: ['proctorio', 'honorlock', 'respondus'],
      apiVersion: 'v1'
    },
    analyticsTools: {
      enabled: true,
      providers: ['google-analytics', 'mixpanel', 'amplitude'],
      apiVersion: 'v3'
    },
    aiServices: {
      enabled: true,
      providers: ['openai', 'anthropic', 'google-ai'],
      apiVersion: 'v1'
    },
    paymentGateways: {
      enabled: true,
      providers: ['stripe', 'paypal', 'razorpay'],
      apiVersion: 'v2'
    }
  },

  // Demo Data Configuration
  demoData: {
    enabled: process.env.REACT_APP_ENVIRONMENT !== 'production',
    generateOnLoad: true,
    fileCount: {
      min: 20,
      max: 200
    },
    sizeRange: {
      min: '1KB',
      max: '2GB'
    },
    updateFrequency: 'daily'
  },

  // Localization
  localization: {
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'es', 'fr', 'de', 'hi'],
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h',
    currency: 'USD'
  }
};
