// Advanced Analysis Configuration with Soft Coding
export const ADVANCED_ANALYSIS_CONFIG = {
    // Feature flags for enabling/disabling functionality
    features: {
        aiModelSelection: true,
        deepLearningAnalysis: true,
        imageSegmentation: true,
        recommendationSystem: true,
        realTimeAnalysis: true,
        multiModalProcessing: true,
        qualityMetrics: true,
        exportOptions: true,
        auditTrail: true,
        comparativeAnalysis: true
    },

    // AI Models configuration
    aiModels: {
        gpt4: {
            name: 'GPT-4 Turbo',
            description: 'Most advanced language model for complex medical analysis',
            capabilities: ['text_analysis', 'recommendations', 'structured_reporting'],
            accuracy: 0.95,
            speed: 'medium',
            enabled: true,
            icon: '🧠',
            color: 'primary'
        },
        claude3: {
            name: 'Claude-3 Opus',
            description: 'Excellent for nuanced medical reasoning and detailed analysis',
            capabilities: ['text_analysis', 'clinical_reasoning', 'risk_assessment'],
            accuracy: 0.93,
            speed: 'medium',
            enabled: true,
            icon: '🔍',
            color: 'info'
        },
        medLLM: {
            name: 'Medical-LLM Specialist',
            description: 'Specialized model trained on medical literature and reports',
            capabilities: ['medical_terminology', 'diagnosis_support', 'protocol_adherence'],
            accuracy: 0.91,
            speed: 'fast',
            enabled: true,
            icon: '⚕️',
            color: 'success'
        },
        deepRadiology: {
            name: 'DeepRadiology AI',
            description: 'Deep learning model specialized for radiology image analysis',
            capabilities: ['image_analysis', 'anomaly_detection', 'segmentation'],
            accuracy: 0.94,
            speed: 'slow',
            enabled: true,
            icon: '🔬',
            color: 'warning'
        },
        ensemble: {
            name: 'Ensemble Model',
            description: 'Combines multiple AI models for maximum accuracy',
            capabilities: ['multi_modal', 'cross_validation', 'confidence_scoring'],
            accuracy: 0.97,
            speed: 'slow',
            enabled: true,
            icon: '🎯',
            color: 'danger'
        }
    },

    // Deep Learning Analysis Types
    deepLearningAnalysis: {
        anomalyDetection: {
            name: 'Anomaly Detection',
            description: 'Identify unusual patterns or abnormalities',
            algorithms: ['cnn', 'autoencoder', 'isolation_forest'],
            enabled: true,
            priority: 1
        },
        patternRecognition: {
            name: 'Pattern Recognition',
            description: 'Recognize common radiological patterns',
            algorithms: ['resnet', 'densenet', 'efficientnet'],
            enabled: true,
            priority: 2
        },
        riskAssessment: {
            name: 'Risk Assessment',
            description: 'Evaluate potential risks and complications',
            algorithms: ['gradient_boosting', 'random_forest', 'neural_network'],
            enabled: true,
            priority: 3
        },
        progressionAnalysis: {
            name: 'Progression Analysis',
            description: 'Analyze disease progression over time',
            algorithms: ['lstm', 'transformer', 'time_series'],
            enabled: true,
            priority: 4
        }
    },

    // Image Segmentation Options
    segmentation: {
        semantic: {
            name: 'Semantic Segmentation',
            description: 'Pixel-level classification of anatomical structures',
            models: ['U-Net', 'DeepLab', 'Mask R-CNN'],
            enabled: true,
            accuracy: 0.92
        },
        instance: {
            name: 'Instance Segmentation',
            description: 'Individual object detection and segmentation',
            models: ['Mask R-CNN', 'YOLACT', 'SOLOv2'],
            enabled: true,
            accuracy: 0.89
        },
        panoptic: {
            name: 'Panoptic Segmentation',
            description: 'Combined semantic and instance segmentation',
            models: ['Panoptic FPN', 'UPSNet', 'Axial-DeepLab'],
            enabled: true,
            accuracy: 0.91
        },
        organSpecific: {
            name: 'Organ-Specific Segmentation',
            description: 'Specialized segmentation for specific organs',
            models: ['Lung-Net', 'Heart-Seg', 'Brain-Atlas'],
            enabled: true,
            accuracy: 0.95
        }
    },

    // Recommendation System Configuration
    recommendations: {
        clinical: {
            name: 'Clinical Recommendations',
            description: 'Evidence-based clinical recommendations',
            sources: ['guidelines', 'literature', 'protocols'],
            enabled: true,
            priority: 1
        },
        followUp: {
            name: 'Follow-up Recommendations',
            description: 'Suggested follow-up actions and timelines',
            types: ['imaging', 'consultation', 'monitoring'],
            enabled: true,
            priority: 2
        },
        treatment: {
            name: 'Treatment Suggestions',
            description: 'Potential treatment options and pathways',
            categories: ['conservative', 'medical', 'surgical'],
            enabled: true,
            priority: 3
        },
        prevention: {
            name: 'Prevention Strategies',
            description: 'Preventive measures and risk reduction',
            areas: ['lifestyle', 'screening', 'monitoring'],
            enabled: true,
            priority: 4
        }
    },

    // Quality Metrics
    qualityMetrics: {
        confidence: {
            name: 'Confidence Score',
            description: 'AI model confidence in analysis',
            threshold: 0.8,
            enabled: true
        },
        accuracy: {
            name: 'Accuracy Rating',
            description: 'Expected accuracy of the analysis',
            threshold: 0.85,
            enabled: true
        },
        completeness: {
            name: 'Report Completeness',
            description: 'Completeness of the analysis',
            threshold: 0.9,
            enabled: true
        },
        consistency: {
            name: 'Consistency Check',
            description: 'Internal consistency of findings',
            threshold: 0.88,
            enabled: true
        }
    },

    // Processing Options
    processing: {
        realTime: {
            enabled: true,
            debounceMs: 2000,
            minTextLength: 100
        },
        batch: {
            enabled: true,
            maxFiles: 10,
            supportedFormats: ['.txt', '.pdf', '.docx', '.png', '.jpg', '.jpeg', '.dicom']
        },
        parallel: {
            enabled: true,
            maxConcurrent: 3
        }
    },

    // Export Options
    export: {
        formats: {
            pdf: { enabled: true, name: 'PDF Report', icon: '📄' },
            docx: { enabled: true, name: 'Word Document', icon: '📝' },
            json: { enabled: true, name: 'JSON Data', icon: '🔗' },
            html: { enabled: true, name: 'HTML Report', icon: '🌐' },
            dicom: { enabled: true, name: 'DICOM with Annotations', icon: '🏥' }
        },
        templates: {
            standard: { name: 'Standard Report', description: 'Basic analysis report' },
            detailed: { name: 'Detailed Analysis', description: 'Comprehensive analysis with all metrics' },
            clinical: { name: 'Clinical Summary', description: 'Clinical-focused summary' },
            research: { name: 'Research Format', description: 'Research-oriented detailed report' }
        }
    },

    // UI Configuration
    ui: {
        theme: {
            primaryColor: '#0d6efd',
            gradients: {
                ai: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                deepLearning: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                segmentation: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                recommendations: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
            }
        },
        animations: {
            enablePulse: true,
            enableGlow: true,
            duration: 300
        },
        layout: {
            showPreview: true,
            showMetrics: true,
            showProgress: true,
            columnsCount: 2
        }
    },

    // Sample data for testing
    sampleData: {
        reportText: `CHEST X-RAY REPORT
CLINICAL HISTORY: 45-year-old patient with persistent cough and shortness of breath.

FINDINGS:
The lungs show bilateral lower lobe opacities consistent with pneumonia. No pleural effusion is identified. The heart size is within normal limits. No pneumothorax is evident.

IMPRESSION:
Bilateral lower lobe pneumonia. Clinical correlation recommended.`,
        
        expectedFindings: [
            'Bilateral lower lobe opacities',
            'Pneumonia pattern',
            'Normal heart size',
            'No pleural effusion',
            'No pneumothorax'
        ]
    }
};

// Helper functions
export const getAvailableAIModels = () => {
    return Object.entries(ADVANCED_ANALYSIS_CONFIG.aiModels)
        .filter(([key, model]) => model.enabled)
        .map(([key, model]) => ({ key, ...model }));
};

export const getEnabledFeatures = () => {
    return Object.entries(ADVANCED_ANALYSIS_CONFIG.features)
        .filter(([key, enabled]) => enabled)
        .map(([key]) => key);
};

export const getAnalysisTypes = () => {
    return Object.entries(ADVANCED_ANALYSIS_CONFIG.deepLearningAnalysis)
        .filter(([key, analysis]) => analysis.enabled)
        .sort((a, b) => a[1].priority - b[1].priority)
        .map(([key, analysis]) => ({ key, ...analysis }));
};

export const getSegmentationMethods = () => {
    return Object.entries(ADVANCED_ANALYSIS_CONFIG.segmentation)
        .filter(([key, method]) => method.enabled)
        .map(([key, method]) => ({ key, ...method }));
};

export const getRecommendationTypes = () => {
    return Object.entries(ADVANCED_ANALYSIS_CONFIG.recommendations)
        .filter(([key, rec]) => rec.enabled)
        .sort((a, b) => a[1].priority - b[1].priority)
        .map(([key, rec]) => ({ key, ...rec }));
};

export default ADVANCED_ANALYSIS_CONFIG;
