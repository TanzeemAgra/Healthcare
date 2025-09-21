// Radiology Report Correction Configuration
// This file enables soft coding for easy customization without code changes

export const REPORT_CORRECTION_CONFIG = {
  // Feature flags and toggles
  features: {
    enableAdvancedCorrection: true,
    enableRAGIntegration: true,
    enableConfidenceScoring: true,
    enableRealTimePreview: true,
    enableMultiModalSupport: true,
    enableBatchProcessing: true,
    enableAuditTrail: true,
    enableCustomTemplates: true,
    enableQualityMetrics: true,
    enableExportOptions: true
  },

  // AI Model Configuration
  aiModels: {
    primary: {
      name: "GPT-4-Medical",
      provider: "OpenAI",
      version: "gpt-4-turbo",
      maxTokens: 4000,
      temperature: 0.1,
      enabled: true
    },
    fallback: {
      name: "Claude-3-Medical",
      provider: "Anthropic", 
      version: "claude-3-opus",
      maxTokens: 3000,
      temperature: 0.1,
      enabled: true
    },
    local: {
      name: "Llama-Medical",
      provider: "Local",
      version: "llama-2-7b-medical",
      maxTokens: 2000,
      temperature: 0.1,
      enabled: false
    }
  },

  // RAG Configuration
  rag: {
    enabled: true,
    vectorDatabase: "pinecone",
    embeddingModel: "text-embedding-ada-002",
    topK: 5,
    confidenceThreshold: 0.7,
    knowledgeSources: [
      {
        id: "acr_guidelines",
        name: "ACR Practice Guidelines",
        weight: 1.0,
        enabled: true,
        lastUpdated: "2024-08-01"
      },
      {
        id: "fleischner_society",
        name: "Fleischner Society Guidelines",
        weight: 0.9,
        enabled: true,
        lastUpdated: "2024-07-15"
      },
      {
        id: "rsna_standards",
        name: "RSNA Reporting Standards",
        weight: 0.8,
        enabled: true,
        lastUpdated: "2024-06-20"
      },
      {
        id: "internal_database",
        name: "Internal Case Database",
        weight: 0.7,
        enabled: true,
        lastUpdated: "2024-08-20"
      },
      {
        id: "medical_literature",
        name: "PubMed Literature",
        weight: 0.6,
        enabled: true,
        lastUpdated: "2024-08-15"
      }
    ]
  },

  // Correction Types and Categories
  correctionTypes: {
    terminology: {
      name: "Medical Terminology",
      description: "Standardize medical terms and abbreviations",
      enabled: true,
      priority: 1,
      icon: "ri-text",
      color: "primary"
    },
    structure: {
      name: "Report Structure",
      description: "Improve report organization and formatting",
      enabled: true,
      priority: 2,
      icon: "ri-layout-grid",
      color: "success"
    },
    completeness: {
      name: "Clinical Completeness",
      description: "Ensure all required elements are present",
      enabled: true,
      priority: 3,
      icon: "ri-checkbox-multiple",
      color: "warning"
    },
    accuracy: {
      name: "Medical Accuracy",
      description: "Verify clinical accuracy and consistency",
      enabled: true,
      priority: 4,
      icon: "ri-check-double",
      color: "info"
    },
    guidelines: {
      name: "Guideline Compliance",
      description: "Apply latest clinical guidelines",
      enabled: true,
      priority: 5,
      icon: "ri-book-open",
      color: "danger"
    },
    clarity: {
      name: "Clarity Enhancement",
      description: "Improve readability and clarity",
      enabled: true,
      priority: 6,
      icon: "ri-eye",
      color: "secondary"
    }
  },

  // Quality Metrics Configuration
  qualityMetrics: {
    confidence: {
      name: "AI Confidence Score",
      enabled: true,
      thresholds: {
        excellent: 0.9,
        good: 0.75,
        acceptable: 0.6,
        poor: 0.4
      },
      colors: {
        excellent: "success",
        good: "info", 
        acceptable: "warning",
        poor: "danger"
      }
    },
    completeness: {
      name: "Report Completeness",
      enabled: true,
      requiredSections: [
        "Clinical History",
        "Technique",
        "Findings", 
        "Impression",
        "Recommendations"
      ]
    },
    readability: {
      name: "Readability Score",
      enabled: true,
      algorithm: "flesch-kincaid",
      targetGrade: 12
    }
  },

  // Export and Integration Options
  exportOptions: {
    formats: [
      {
        id: "pdf",
        name: "PDF Report",
        enabled: true,
        icon: "ri-file-pdf",
        color: "danger"
      },
      {
        id: "docx", 
        name: "Word Document",
        enabled: true,
        icon: "ri-file-word",
        color: "primary"
      },
      {
        id: "hl7",
        name: "HL7 FHIR",
        enabled: true,
        icon: "ri-code",
        color: "success"
      },
      {
        id: "dicom",
        name: "DICOM SR",
        enabled: false,
        icon: "ri-image",
        color: "info"
      }
    ],
    destinations: [
      {
        id: "local",
        name: "Download",
        enabled: true,
        icon: "ri-download"
      },
      {
        id: "pacs",
        name: "Send to PACS",
        enabled: false,
        icon: "ri-send-plane"
      },
      {
        id: "ehr",
        name: "Export to EHR",
        enabled: false,
        icon: "ri-hospital"
      }
    ]
  },

  // UI Configuration
  ui: {
    theme: {
      primaryColor: "#007bff",
      successColor: "#28a745", 
      warningColor: "#ffc107",
      dangerColor: "#dc3545",
      infoColor: "#17a2b8"
    },
    layout: {
      showSidebar: true,
      showMetrics: true,
      showPreview: true,
      defaultView: "split", // split, tabbed, stacked
      animationsEnabled: true
    },
    notifications: {
      enabled: true,
      position: "top-right",
      autoClose: 5000,
      showProgress: true
    }
  },

  // Processing Configuration
  processing: {
    maxFileSize: "10MB",
    supportedFormats: ["txt", "pdf", "docx", "rtf"],
    timeoutSeconds: 300,
    retryAttempts: 3,
    batchSize: 5,
    concurrentRequests: 2
  },

  // Security and Compliance
  security: {
    hipaaCompliant: true,
    auditLogging: true,
    dataRetention: "90days",
    encryptionRequired: true,
    accessControl: {
      requireAuth: true,
      roleBasedAccess: true,
      sessionTimeout: 3600
    }
  },

  // Sample Data for Testing
  sampleReports: [
    {
      id: "chest_ct_1",
      title: "Chest CT - Pulmonary Nodules",
      category: "Chest Imaging",
      difficulty: "intermediate",
      content: `CT CHEST WITHOUT CONTRAST

CLINICAL INDICATION: Shortness of breath, cough

TECHNIQUE: CT of the chest was performed without contrast.

There is a lung nodule in the right upper lobe. Ground glass opacities are seen in both lungs. Heart size is normal. No pleural effusion. No pneumothorax.

IMPRESSION:
1. Lung nodule
2. Ground glass opacities likely representing infection`
    },
    {
      id: "brain_mri_1", 
      title: "Brain MRI - Enhancement Pattern",
      category: "Neuroimaging",
      difficulty: "advanced",
      content: `MRI BRAIN WITHOUT AND WITH CONTRAST

CLINICAL HISTORY: Headaches, visual changes

TECHNIQUE: MRI of the brain was performed with and without contrast.

There is a approximately 2.5 cm extra-axial mass in the right frontal region with surrounding edema. It demonstrates homogeneous enhancement. Mild mass effect on the adjacent brain parenchyma. Ventricles are normal. No midline shift.`
    },
    {
      id: "abdominal_ct_1",
      title: "Abdominal CT - Basic Findings", 
      category: "Abdominal Imaging",
      difficulty: "beginner",
      content: `CT ABDOMEN AND PELVIS WITH CONTRAST

INDICATION: Abdominal pain

TECHNIQUE: CT of the abdomen and pelvis with IV contrast.

The liver, spleen, pancreas, and kidneys appear normal. No free fluid. Bowel appears normal.`
    }
  ]
};

// Helper functions for configuration access
export const getFeatureConfig = (featureName) => {
  return REPORT_CORRECTION_CONFIG.features[featureName] || false;
};

export const getAIModelConfig = (modelType = 'primary') => {
  return REPORT_CORRECTION_CONFIG.aiModels[modelType];
};

export const getCorrectionTypes = () => {
  return Object.entries(REPORT_CORRECTION_CONFIG.correctionTypes)
    .filter(([_, config]) => config.enabled)
    .sort((a, b) => a[1].priority - b[1].priority);
};

export const getQualityThresholds = (metric) => {
  return REPORT_CORRECTION_CONFIG.qualityMetrics[metric]?.thresholds;
};

export const getEnabledExportFormats = () => {
  return REPORT_CORRECTION_CONFIG.exportOptions.formats.filter(format => format.enabled);
};

export const getSampleReports = (category = null, difficulty = null) => {
  let reports = REPORT_CORRECTION_CONFIG.sampleReports;
  
  if (category) {
    reports = reports.filter(report => report.category === category);
  }
  
  if (difficulty) {
    reports = reports.filter(report => report.difficulty === difficulty);
  }
  
  return reports;
};
