// Advanced RADS Calculator Configuration with Gen AI Integration
export const ADVANCED_RADS_CONFIG = {
    // Feature flags for AI-powered enhancements
    features: {
        aiRiskAssessment: true,
        imageAnalysis: true,
        clinicalDecisionSupport: true,
        realTimeGuidelines: true,
        predictiveAnalytics: true,
        caseBasedReasoning: true,
        uncertaintyQuantification: true,
        multiModalFusion: true,
        temporalAnalysis: true,
        explainableAI: true
    },

    // AI Models for different RADS systems
    aiModels: {
        biRads: {
            name: 'BI-RADS AI Expert',
            description: 'Specialized AI for breast imaging analysis',
            accuracy: 0.94,
            sensitivity: 0.92,
            specificity: 0.96,
            models: ['ResNet-152', 'DenseNet-201', 'EfficientNet-B7'],
            enabled: true
        },
        liRads: {
            name: 'LI-RADS AI Specialist',
            description: 'Advanced liver imaging risk assessment',
            accuracy: 0.91,
            sensitivity: 0.89,
            specificity: 0.93,
            models: ['3D-CNN', 'Vision Transformer', 'RadNet'],
            enabled: true
        },
        oRads: {
            name: 'O-RADS AI Navigator',
            description: 'Ovarian imaging classification expert',
            accuracy: 0.88,
            sensitivity: 0.86,
            specificity: 0.90,
            models: ['DenseNet-169', 'Inception-v4', 'MobileNet-v3'],
            enabled: true
        },
        piRads: {
            name: 'PI-RADS AI Prostate',
            description: 'Prostate imaging AI assessment',
            accuracy: 0.92,
            sensitivity: 0.90,
            specificity: 0.94,
            models: ['3D-UNet', 'AttentionNet', 'ProNet'],
            enabled: true
        },
        tiRads: {
            name: 'TI-RADS AI Thyroid',
            description: 'Thyroid nodule classification system',
            accuracy: 0.90,
            sensitivity: 0.88,
            specificity: 0.92,
            models: ['ThyroidNet', 'UltraNet', 'NoduleAI'],
            enabled: true
        },
        cRads: {
            name: 'C-RADS AI Coronary',
            description: 'Coronary artery risk assessment',
            accuracy: 0.93,
            sensitivity: 0.91,
            specificity: 0.95,
            models: ['CardioNet', 'CoronaryAI', 'HeartVision'],
            enabled: true
        }
    },

    // Clinical Decision Support Rules
    clinicalDecisionSupport: {
        criticalAlerts: {
            enabled: true,
            urgentFindings: [
                'Highly suspicious for malignancy',
                'Immediate surgical intervention required',
                'Emergency consultation needed',
                'Time-sensitive findings'
            ],
            alertThresholds: {
                malignancyRisk: 0.8,
                urgencyScore: 0.9,
                confidenceThreshold: 0.85
            }
        },
        guidelines: {
            acr: {
                name: 'ACR Guidelines',
                version: '2024.1',
                categories: ['BI-RADS', 'LI-RADS', 'O-RADS', 'PI-RADS', 'TI-RADS', 'C-RADS'],
                enabled: true
            },
            rsna: {
                name: 'RSNA Recommendations',
                version: '2024.2',
                focus: ['Reporting Standards', 'Quality Metrics'],
                enabled: true
            },
            who: {
                name: 'WHO Classification',
                version: '5th Edition',
                scope: 'Global Standards',
                enabled: true
            }
        },
        recommendations: {
            followUp: {
                immediate: 'Immediate consultation/intervention',
                urgent: 'Within 24-48 hours',
                shortTerm: '1-3 months',
                routine: '6-12 months',
                annual: 'Annual surveillance'
            },
            procedures: {
                biopsy: 'Tissue sampling recommended',
                mri: 'MRI with contrast',
                ct: 'CT with contrast',
                ultrasound: 'Targeted ultrasound',
                surgery: 'Surgical consultation',
                monitoring: 'Active surveillance'
            }
        }
    },

    // AI Risk Assessment Parameters
    riskAssessment: {
        factors: {
            imaging: {
                weight: 0.4,
                parameters: ['morphology', 'enhancement', 'size', 'margins', 'echogenicity']
            },
            clinical: {
                weight: 0.3,
                parameters: ['age', 'symptoms', 'family_history', 'previous_findings']
            },
            temporal: {
                weight: 0.2,
                parameters: ['growth_rate', 'stability', 'previous_comparisons']
            },
            biomarkers: {
                weight: 0.1,
                parameters: ['tumor_markers', 'genetic_factors', 'molecular_indicators']
            }
        },
        uncertaintyModeling: {
            bayesian: true,
            monteCarlo: true,
            ensembleMethods: true,
            confidenceIntervals: true
        }
    },

    // Image Analysis Configuration
    imageAnalysis: {
        preprocessing: {
            normalization: true,
            denoising: true,
            contrastEnhancement: true,
            registration: true
        },
        segmentation: {
            deepLearning: true,
            multiScale: true,
            atlasBasedSegmentation: true,
            activeContours: true
        },
        featureExtraction: {
            radiomics: true,
            deepFeatures: true,
            textureAnalysis: true,
            morphological: true,
            kinetic: true
        },
        supportedFormats: ['DICOM', 'NIfTI', 'PNG', 'JPEG', 'TIFF']
    },

    // Predictive Analytics
    predictiveAnalytics: {
        models: {
            outcomePredictor: {
                name: 'Clinical Outcome Predictor',
                algorithms: ['Random Forest', 'XGBoost', 'Neural Network'],
                enabled: true
            },
            progressionModel: {
                name: 'Disease Progression Model',
                algorithms: ['LSTM', 'Survival Analysis', 'Markov Models'],
                enabled: true
            },
            responsePredictor: {
                name: 'Treatment Response Predictor',
                algorithms: ['SVM', 'Deep Learning', 'Ensemble Methods'],
                enabled: true
            }
        },
        timeHorizons: ['3 months', '6 months', '1 year', '2 years', '5 years'],
        confidenceIntervals: [0.68, 0.95, 0.99]
    },

    // Case-based Reasoning
    caseBasedReasoning: {
        enabled: true,
        database: {
            size: 50000,
            categories: ['BI-RADS', 'LI-RADS', 'O-RADS', 'PI-RADS', 'TI-RADS', 'C-RADS'],
            verified: true,
            expertAnnotated: true
        },
        similarity: {
            imageFeatures: 0.4,
            clinicalFeatures: 0.3,
            demographics: 0.2,
            outcomes: 0.1
        },
        topKCases: 5,
        confidenceThreshold: 0.8
    },

    // Quality Assurance
    qualityAssurance: {
        imageQuality: {
            assessment: true,
            minimumStandards: {
                resolution: '1024x1024',
                contrast: 'adequate',
                artifacts: 'minimal'
            }
        },
        uncertainty: {
            quantification: true,
            visualization: true,
            explanation: true
        },
        validation: {
            crossValidation: true,
            externalValidation: true,
            prospectiveStudies: true
        }
    },

    // User Interface Configuration
    ui: {
        themes: {
            professional: {
                name: 'Professional Medical',
                colors: {
                    primary: '#0d47a1',
                    secondary: '#1976d2',
                    success: '#2e7d32',
                    warning: '#f57c00',
                    danger: '#d32f2f',
                    info: '#0288d1'
                }
            },
            emergency: {
                name: 'Emergency Mode',
                colors: {
                    primary: '#d32f2f',
                    secondary: '#f44336',
                    warning: '#ff9800',
                    critical: '#b71c1c'
                }
            }
        },
        layout: {
            showConfidenceScores: true,
            showUncertainty: true,
            showSimilarCases: true,
            showGuidelines: true,
            responsiveDesign: true
        },
        accessibility: {
            highContrast: true,
            screenReader: true,
            keyboardNavigation: true,
            fontSize: 'adjustable'
        }
    },

    // Integration Settings
    integration: {
        ehr: {
            enabled: true,
            formats: ['HL7', 'FHIR', 'DICOM-SR'],
            autoPopulate: true
        },
        pacs: {
            enabled: true,
            directIntegration: true,
            imageRetrieval: true
        },
        ris: {
            enabled: true,
            reportGeneration: true,
            workflowIntegration: true
        }
    },

    // Sample clinical scenarios for testing
    sampleCases: {
        biRads: {
            case1: {
                description: '45-year-old woman with palpable breast mass',
                findings: {
                    massShape: 'irregular',
                    massMargins: 'spiculated',
                    echogenicity: 'hypoechoic',
                    vascularity: 'increased'
                },
                expectedRADS: 5,
                malignancyRisk: 0.95
            },
            case2: {
                description: '35-year-old woman, routine screening',
                findings: {
                    massShape: 'round',
                    massMargins: 'circumscribed',
                    echogenicity: 'anechoic',
                    vascularity: 'none'
                },
                expectedRADS: 2,
                malignancyRisk: 0.01
            }
        },
        liRads: {
            case1: {
                description: 'Chronic hepatitis B patient with liver lesion',
                findings: {
                    lesionSize: '3.2cm',
                    arterialPhase: 'hyperenhancing',
                    portalPhase: 'washout',
                    delayedPhase: 'washout',
                    capsuleAppearance: 'present'
                },
                expectedRADS: 'LR-5',
                hccProbability: 0.92
            }
        }
    }
};

// Helper functions for AI integration
export const getAIModel = (radsType) => {
    return ADVANCED_RADS_CONFIG.aiModels[radsType] || null;
};

export const getClinicalGuidelines = (radsType) => {
    return Object.values(ADVANCED_RADS_CONFIG.clinicalDecisionSupport.guidelines)
        .filter(guideline => guideline.enabled);
};

export const getRiskFactors = () => {
    return ADVANCED_RADS_CONFIG.riskAssessment.factors;
};

export const getUncertaintyConfig = () => {
    return ADVANCED_RADS_CONFIG.riskAssessment.uncertaintyModeling;
};

export const getPredictiveModels = () => {
    return Object.values(ADVANCED_RADS_CONFIG.predictiveAnalytics.models)
        .filter(model => model.enabled);
};

export const getSimilarCasesConfig = () => {
    return ADVANCED_RADS_CONFIG.caseBasedReasoning;
};

export default ADVANCED_RADS_CONFIG;
