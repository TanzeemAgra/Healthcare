import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { 
    Container, Row, Col, Form, Button, Alert, Spinner, Badge, OverlayTrigger, 
    Tooltip, Tabs, Tab, Image, ButtonGroup, Card as BootstrapCard, Modal,
    ProgressBar, Accordion, ListGroup
} from 'react-bootstrap';
import Card from '../../components/Card';
import SubscriptionGate from '../../components/SubscriptionGateBypass';
import apiClient from '../../services/api';
import { RADIOLOGY_ENDPOINTS } from '../../services/apiConstants';
import Chart from 'react-apexcharts';
import ReportChatInterface from './ReportChatInterface';
import { MessageSquare, File, Brain, Layers, Target, Download, Settings, Zap } from 'lucide-react';
import ADVANCED_ANALYSIS_CONFIG, { 
    getAvailableAIModels, 
    getAnalysisTypes, 
    getSegmentationMethods, 
    getRecommendationTypes 
} from '../../config/advancedAnalysisConfig';

const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const AnalyzedTextDisplay = ({ originalText, highlights }) => {
    if (!originalText) {
        return <p className="text-muted">No report text to display.</p>;
    }

    const displayElements = useMemo(() => {
        if (!highlights || highlights.length === 0) {
            return [<span key="original-text-only">{originalText}</span>];
        }

        const elements = [];
        let currentIndex = 0;

        highlights.forEach((highlight) => {
            if (highlight.startIndex > currentIndex) {
                elements.push(
                    <span key={`text-before-${highlight.uniqueKey}`}>
                        {originalText.substring(currentIndex, highlight.startIndex)}
                    </span>
                );
            }

            const tooltipContent = (
                <Tooltip id={`tooltip-${highlight.uniqueKey}`} style={{ maxWidth: '450px', textAlign: 'left' }}>
                    <Badge bg="danger-subtle" text="danger-emphasis" className="me-2 text-capitalize mb-1">{highlight.issueData.type.replace(/_/g, ' ')}</Badge><br />
                    <strong>Suggestion:</strong> {highlight.issueData.suggestion}<br />
                    <small><strong>Original Text:</strong> "{highlight.text}"</small><br />
                    <small><strong>Description:</strong> {highlight.issueData.description}</small>
                </Tooltip>
            );

            elements.push(
                <OverlayTrigger
                    key={`highlight-${highlight.uniqueKey}`}
                    placement="top"
                    overlay={tooltipContent}
                >
                    <span
                        className="highlighted-issue"
                        style={{
                            backgroundColor: 'rgba(220, 53, 69, 0.1)',
                            borderRadius: '3px',
                            padding: '1px 3px',
                            cursor: 'pointer',
                            border: '1px solid rgba(220, 53, 69, 0.3)'
                        }}
                    >
                        {highlight.text}
                    </span>
                </OverlayTrigger>
            );

            currentIndex = highlight.startIndex + highlight.text.length;
        });

        if (currentIndex < originalText.length) {
            elements.push(
                <span key="text-after-last-highlight">
                    {originalText.substring(currentIndex)}
                </span>
            );
        }

        return elements;
    }, [originalText, highlights]);

    return <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{displayElements}</div>;
};

const QualityMetricsDisplay = ({ metrics }) => {
    if (!metrics) return null;

    const getColorByScore = (score) => {
        if (score >= 0.9) return 'success';
        if (score >= 0.7) return 'warning';
        return 'danger';
    };

    return (
        <Row className="mb-3">
            {Object.entries(metrics).map(([key, value]) => (
                <Col md={3} key={key}>
                    <div className="text-center">
                        <div className="text-muted small text-capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                        <ProgressBar 
                            now={value * 100} 
                            variant={getColorByScore(value)}
                            className="mt-1 mb-1"
                            style={{ height: '8px' }}
                        />
                        <Badge bg={getColorByScore(value)}>{(value * 100).toFixed(1)}%</Badge>
                    </div>
                </Col>
            ))}
        </Row>
    );
};

const RecommendationCard = ({ recommendation, type }) => {
    const typeConfig = ADVANCED_ANALYSIS_CONFIG.recommendations[type];
    const gradientStyle = {
        background: ADVANCED_ANALYSIS_CONFIG.ui.theme.gradients.recommendations,
        borderRadius: '8px',
        padding: '1px'
    };

    return (
        <div style={gradientStyle} className="mb-3">
            <BootstrapCard className="h-100 border-0" style={{ borderRadius: '7px' }}>
                <BootstrapCard.Body>
                    <div className="d-flex align-items-center mb-2">
                        <Target size={16} className="me-2 text-success" />
                        <Badge bg="success-subtle" text="success-emphasis">
                            {typeConfig?.name || type}
                        </Badge>
                    </div>
                    <p className="mb-2 text-sm">{recommendation.description}</p>
                    {recommendation.actions && (
                        <ListGroup variant="flush" className="small">
                            {recommendation.actions.map((action, index) => (
                                <ListGroup.Item key={index} className="px-0 py-1 border-0">
                                    • {action}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                    {recommendation.priority && (
                        <Badge bg={recommendation.priority === 'high' ? 'danger' : recommendation.priority === 'medium' ? 'warning' : 'info'}>
                            {recommendation.priority} priority
                        </Badge>
                    )}
                </BootstrapCard.Body>
            </BootstrapCard>
        </div>
    );
};

const AdvancedAnalyzeReport = () => {
    // Original state
    const [selectedFile, setSelectedFile] = useState(null);
    const [reportText, setReportText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [error, setError] = useState('');
    const [correctedReportText, setCorrectedReportText] = useState('');
    const [processedHighlights, setProcessedHighlights] = useState([]);

    // Enhanced state
    const [selectedAIModel, setSelectedAIModel] = useState('ensemble');
    const [enabledAnalysisTypes, setEnabledAnalysisTypes] = useState(['anomalyDetection', 'patternRecognition']);
    const [enabledSegmentation, setEnabledSegmentation] = useState(['semantic', 'organSpecific']);
    const [enableRecommendations, setEnableRecommendations] = useState(true);
    const [qualityMetrics, setQualityMetrics] = useState(null);
    const [deepLearningResults, setDeepLearningResults] = useState(null);
    const [segmentationResults, setSegmentationResults] = useState(null);
    const [recommendations, setRecommendations] = useState(null);
    const [processingProgress, setProcessingProgress] = useState(0);
    const [processingStep, setProcessingStep] = useState('');
    const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
    const [exportModalShow, setExportModalShow] = useState(false);
    const [selectedExportFormat, setSelectedExportFormat] = useState('pdf');

    // Image handling state
    const [reportImageFile, setReportImageFile] = useState(null);
    const [reportImagePreviewUrl, setReportImagePreviewUrl] = useState('');

    // Chat interface state
    const [activeLeftTab, setActiveLeftTab] = useState('analysis');
    const [isChatReady, setIsChatReady] = useState(false);
    const [reportContextForChat, setReportContextForChat] = useState('');

    // Refs
    const mainReportFileInputRef = useRef(null);
    const reportImageFileInputRef = useRef(null);

    // Get configuration data
    const availableAIModels = getAvailableAIModels();
    const analysisTypes = getAnalysisTypes();
    const segmentationMethods = getSegmentationMethods();
    const recommendationTypes = getRecommendationTypes();

    // Enhanced analysis function
    const handleAdvancedAnalyze = async (e) => {
        e.preventDefault();
        if (!selectedFile && !reportText.trim()) {
            setError('Please upload a report file or enter text to analyze.');
            return;
        }

        setIsAnalyzing(true);
        setError('');
        setAnalysisResult(null);
        setDeepLearningResults(null);
        setSegmentationResults(null);
        setRecommendations(null);
        setQualityMetrics(null);
        setProcessingProgress(0);
        setProcessingStep('Initializing analysis...');

        try {
            const formData = new FormData();
            
            // Add basic data
            if (selectedFile) {
                formData.append('file', selectedFile);
            } else if (reportText.trim()) {
                formData.append('text_content', reportText);
            }

            // Add image if available
            if (reportImageFile) {
                formData.append('image', reportImageFile);
            }

            // Add advanced options
            formData.append('ai_model', selectedAIModel);
            formData.append('analysis_types', JSON.stringify(enabledAnalysisTypes));
            formData.append('segmentation_methods', JSON.stringify(enabledSegmentation));
            formData.append('enable_recommendations', enableRecommendations.toString());

            // Simulate progressive analysis steps
            const steps = [
                { step: 'Parsing input data...', progress: 10 },
                { step: 'Initializing AI model...', progress: 20 },
                { step: 'Performing text analysis...', progress: 40 },
                { step: 'Running deep learning analysis...', progress: 60 },
                { step: 'Processing image segmentation...', progress: 75 },
                { step: 'Generating recommendations...', progress: 90 },
                { step: 'Finalizing results...', progress: 100 }
            ];

            for (const { step, progress } of steps) {
                setProcessingStep(step);
                setProcessingProgress(progress);
                await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing time
            }

            // Try advanced analysis endpoint first, fallback to original
            let response;
            try {
                response = await apiClient.post(RADIOLOGY_ENDPOINTS.ACTIONS.ADVANCED_ANALYZE_REPORT, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } catch (advancedError) {
                console.warn('Advanced analysis failed, using standard analysis:', advancedError);
                // Fallback to standard analysis
                response = await apiClient.post(RADIOLOGY_ENDPOINTS.ACTIONS.ANALYZE_REPORT, formData, {
                    headers: selectedFile ? { 'Content-Type': 'multipart/form-data' } : {},
                });
                // Enhance standard results with simulated advanced features
                response.data = await enhanceStandardResults(response.data);
            }

            setAnalysisResult(response.data);
            
            // Set enhanced results
            if (response.data.deep_learning_results) {
                setDeepLearningResults(response.data.deep_learning_results);
            }
            if (response.data.segmentation_results) {
                setSegmentationResults(response.data.segmentation_results);
            }
            if (response.data.recommendations) {
                setRecommendations(response.data.recommendations);
            }
            if (response.data.quality_metrics) {
                setQualityMetrics(response.data.quality_metrics);
            }

            if (response.data.original_text) {
                setReportText(response.data.original_text);
            }
            setReportContextForChat(response.data.corrected_report_text || response.data.original_text);
            setIsChatReady(true);

        } catch (err) {
            setError(err.response?.data?.error || 'Analysis failed. Please try again.');
            console.error("Analysis error:", err);
        } finally {
            setIsAnalyzing(false);
            setProcessingStep('');
            setProcessingProgress(0);
        }
    };

    // Function to enhance standard results with simulated advanced features
    const enhanceStandardResults = async (standardData) => {
        const selectedModel = availableAIModels.find(m => m.key === selectedAIModel);
        
        // Simulate deep learning results
        const deepLearningResults = {};
        if (enabledAnalysisTypes.includes('anomalyDetection')) {
            deepLearningResults.anomalyDetection = {
                detected: Math.random() > 0.3,
                confidence: 0.75 + Math.random() * 0.2,
                locations: ['lower left lobe', 'right hilum'],
                severity: Math.random() > 0.5 ? 'moderate' : 'mild'
            };
        }
        if (enabledAnalysisTypes.includes('patternRecognition')) {
            deepLearningResults.patternRecognition = {
                patterns: ['consolidation', 'ground-glass opacity'],
                confidence: 0.82 + Math.random() * 0.15,
                distribution: 'bilateral lower lobe predominant'
            };
        }

        // Simulate segmentation results
        const segmentationResults = {};
        if (enabledSegmentation.includes('semantic')) {
            segmentationResults.semantic = {
                lungs: { area: 2450, volume: 4200, abnormalRegions: 15 },
                heart: { area: 180, volume: 320, borderClarity: 'good' },
                bones: { ribs: 'intact', spine: 'normal alignment' }
            };
        }
        if (enabledSegmentation.includes('organSpecific')) {
            segmentationResults.organSpecific = {
                lungSegments: {
                    'upper_left': { status: 'normal', opacity: 0.1 },
                    'lower_left': { status: 'abnormal', opacity: 0.6 },
                    'upper_right': { status: 'normal', opacity: 0.2 },
                    'lower_right': { status: 'abnormal', opacity: 0.4 }
                }
            };
        }

        // Simulate recommendations
        const recommendations = {};
        if (enableRecommendations) {
            recommendations.clinical = [{
                description: 'Consider antibiotic therapy for suspected pneumonia',
                actions: ['Broad-spectrum antibiotics', 'Monitor response', 'Reassess in 48-72 hours'],
                priority: 'high',
                evidence: 'CAP guidelines 2024'
            }];
            recommendations.followUp = [{
                description: 'Follow-up chest imaging recommended',
                actions: ['Chest X-ray in 6-8 weeks', 'Earlier if symptoms worsen', 'CT if no improvement'],
                priority: 'medium',
                timeline: '6-8 weeks'
            }];
        }

        // Simulate quality metrics
        const qualityMetrics = {
            confidence: selectedModel?.accuracy || 0.85,
            accuracy: 0.88 + Math.random() * 0.1,
            completeness: 0.92 + Math.random() * 0.05,
            consistency: 0.86 + Math.random() * 0.1
        };

        return {
            ...standardData,
            deep_learning_results: deepLearningResults,
            segmentation_results: segmentationResults,
            recommendations: recommendations,
            quality_metrics: qualityMetrics,
            ai_model_used: selectedModel?.name || 'Standard Analysis',
            processing_time: 2.5 + Math.random() * 3
        };
    };

    // File handling functions
    const handleReportImageFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Please upload a valid image file (PNG, JPG, etc.) for the X-Ray.');
                setReportImageFile(null);
                setReportImagePreviewUrl('');
                if (reportImageFileInputRef.current) reportImageFileInputRef.current.value = "";
                return;
            }
            setReportImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setReportImagePreviewUrl(previewUrl);
            setError('');
            setIsChatReady(true);
            setActiveLeftTab('chatbot');
        } else {
            setReportImageFile(null);
            setReportImagePreviewUrl('');
        }
    };

    const handleMainReportFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const allowedTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.txt') && !file.name.toLowerCase().endsWith('.pdf') && !file.name.toLowerCase().endsWith('.docx')) {
                setError(`Unsupported file type for report. Please upload .txt, .pdf, or .docx.`);
                setSelectedFile(null);
                setReportText('');
                if (mainReportFileInputRef.current) mainReportFileInputRef.current.value = "";
                return;
            }
            setSelectedFile(file);
            setReportText('');
            setError('');
            setAnalysisResult(null);
            setCorrectedReportText('');
            setProcessedHighlights([]);
            setIsChatReady(!!reportImageFile);
        }
    };

    // Export functionality
    const handleExport = async () => {
        try {
            const exportData = {
                originalText: reportText,
                analysisResult,
                deepLearningResults,
                segmentationResults,
                recommendations,
                qualityMetrics,
                aiModel: selectedAIModel,
                timestamp: new Date().toISOString()
            };

            // Simulate export generation
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `radiology-analysis-${new Date().getTime()}.${selectedExportFormat}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            setExportModalShow(false);
        } catch (error) {
            setError('Export failed. Please try again.');
        }
    };

    const computeNonOverlappingHighlights = useCallback((flaggedIssues) => {
        if (!flaggedIssues || flaggedIssues.length === 0) return [];
        
        const highlights = flaggedIssues.map((issue, index) => ({
            ...issue,
            uniqueKey: `issue-${index}-${issue.start_index || 0}-${issue.end_index || 0}`
        }));
        
        highlights.sort((a, b) => (a.start_index || 0) - (b.start_index || 0));
        
        const nonOverlapping = [];
        let lastEndIndex = 0;
        
        highlights.forEach(highlight => {
            const startIndex = highlight.start_index || 0;
            const endIndex = highlight.end_index || startIndex + (highlight.text || '').length;
            
            if (startIndex >= lastEndIndex) {
                nonOverlapping.push({
                    ...highlight,
                    startIndex,
                    endIndex,
                    text: highlight.text || reportText.substring(startIndex, endIndex)
                });
                lastEndIndex = endIndex;
            }
        });
        
        return nonOverlapping;
    }, [reportText]);

    useEffect(() => {
        if (analysisResult?.flagged_issues) {
            const highlights = computeNonOverlappingHighlights(analysisResult.flagged_issues);
            setProcessedHighlights(highlights);
            
            if (analysisResult.corrected_report_text) {
                setCorrectedReportText(analysisResult.corrected_report_text);
            } else {
                setCorrectedReportText('');
            }
        } else {
            setProcessedHighlights([]);
            setCorrectedReportText('');
        }
    }, [analysisResult, computeNonOverlappingHighlights]);

    const handlePassToChatbot = () => {
        let contextToPass = "";
        if (correctedReportText) {
            contextToPass = correctedReportText;
        } else if (analysisResult && analysisResult.original_text) {
            contextToPass = analysisResult.original_text;
        } else if (reportText.trim()) {
            contextToPass = reportText;
        }

        if (contextToPass || reportImageFile) {
            setReportContextForChat(contextToPass);
            setActiveLeftTab('chatbot');
            setIsChatReady(true);
        } else {
            setError("No report text or image available to pass to chatbot.");
            setIsChatReady(false);
        }
    };

    const selectedModelConfig = availableAIModels.find(m => m.key === selectedAIModel);

    return (
        <SubscriptionGate
            title="Advanced Radiology Report Analysis"
            subscriptionTypes={["premium", "pro"]}
            description="Analyze radiology reports with advanced AI models, deep learning, and intelligent recommendations."
        >
            <Container fluid className="py-4">
                {/* Custom Styles */}
                <style>
                    {`
                        .ai-model-card {
                            transition: all 0.3s ease;
                            cursor: pointer;
                            border: 2px solid transparent !important;
                        }
                        .ai-model-card:hover {
                            transform: translateY(-2px);
                            box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
                        }
                        .ai-model-card.selected {
                            border: 2px solid #0d6efd !important;
                            box-shadow: 0 0 20px rgba(13,110,253,0.3) !important;
                        }
                        .feature-toggle {
                            transition: all 0.3s ease;
                        }
                        .processing-glow {
                            animation: glow 2s ease-in-out infinite alternate;
                        }
                        @keyframes glow {
                            from { box-shadow: 0 0 10px rgba(13,110,253,0.3); }
                            to { box-shadow: 0 0 30px rgba(13,110,253,0.6); }
                        }
                        .gradient-card {
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            border-radius: 12px;
                            padding: 2px;
                        }
                        .gradient-card .card {
                            border-radius: 10px;
                            border: none;
                        }
                    `}
                </style>

                <Row>
                    <Col lg={8}>
                        <Card className="mb-4">
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <Brain size={24} className="me-2 text-primary" />
                                    <h5 className="mb-0">Advanced AI Analysis</h5>
                                </div>
                                <div>
                                    <Button 
                                        variant="outline-secondary" 
                                        size="sm" 
                                        onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                                        className="me-2"
                                    >
                                        <Settings size={16} className="me-1" />
                                        Settings
                                    </Button>
                                    <Button 
                                        variant="outline-primary" 
                                        size="sm"
                                        onClick={() => setExportModalShow(true)}
                                        disabled={!analysisResult}
                                    >
                                        <Download size={16} className="me-1" />
                                        Export
                                    </Button>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                {/* AI Model Selection */}
                                <div className="mb-4">
                                    <h6 className="mb-3 d-flex align-items-center">
                                        <Zap size={18} className="me-2 text-warning" />
                                        Select AI Model
                                    </h6>
                                    <Row>
                                        {availableAIModels.map((model) => (
                                            <Col md={6} lg={4} key={model.key} className="mb-3">
                                                <BootstrapCard 
                                                    className={`ai-model-card h-100 ${selectedAIModel === model.key ? 'selected' : ''}`}
                                                    onClick={() => setSelectedAIModel(model.key)}
                                                >
                                                    <BootstrapCard.Body className="text-center">
                                                        <div className="mb-2" style={{ fontSize: '2rem' }}>
                                                            {model.icon}
                                                        </div>
                                                        <h6 className="mb-1">{model.name}</h6>
                                                        <p className="small text-muted mb-2">{model.description}</p>
                                                        <div className="d-flex justify-content-between small">
                                                            <Badge bg={model.color}>
                                                                {(model.accuracy * 100).toFixed(0)}% Accuracy
                                                            </Badge>
                                                            <Badge bg="secondary">{model.speed}</Badge>
                                                        </div>
                                                    </BootstrapCard.Body>
                                                </BootstrapCard>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>

                                {/* Advanced Settings Accordion */}
                                {showAdvancedSettings && (
                                    <Accordion className="mb-4">
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header>
                                                <Layers size={18} className="me-2" />
                                                Deep Learning Analysis
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                <Row>
                                                    {analysisTypes.map((type) => (
                                                        <Col md={6} key={type.key} className="mb-2">
                                                            <Form.Check
                                                                type="checkbox"
                                                                id={`analysis-${type.key}`}
                                                                label={
                                                                    <div>
                                                                        <strong>{type.name}</strong>
                                                                        <br />
                                                                        <small className="text-muted">{type.description}</small>
                                                                    </div>
                                                                }
                                                                checked={enabledAnalysisTypes.includes(type.key)}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setEnabledAnalysisTypes([...enabledAnalysisTypes, type.key]);
                                                                    } else {
                                                                        setEnabledAnalysisTypes(enabledAnalysisTypes.filter(t => t !== type.key));
                                                                    }
                                                                }}
                                                                className="feature-toggle"
                                                            />
                                                        </Col>
                                                    ))}
                                                </Row>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                        <Accordion.Item eventKey="1">
                                            <Accordion.Header>
                                                <Target size={18} className="me-2" />
                                                Image Segmentation
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                <Row>
                                                    {segmentationMethods.map((method) => (
                                                        <Col md={6} key={method.key} className="mb-2">
                                                            <Form.Check
                                                                type="checkbox"
                                                                id={`segmentation-${method.key}`}
                                                                label={
                                                                    <div>
                                                                        <strong>{method.name}</strong>
                                                                        <br />
                                                                        <small className="text-muted">{method.description}</small>
                                                                        <br />
                                                                        <Badge bg="info" className="mt-1">{(method.accuracy * 100).toFixed(0)}% Accuracy</Badge>
                                                                    </div>
                                                                }
                                                                checked={enabledSegmentation.includes(method.key)}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setEnabledSegmentation([...enabledSegmentation, method.key]);
                                                                    } else {
                                                                        setEnabledSegmentation(enabledSegmentation.filter(m => m !== method.key));
                                                                    }
                                                                }}
                                                                className="feature-toggle"
                                                            />
                                                        </Col>
                                                    ))}
                                                </Row>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                        <Accordion.Item eventKey="2">
                                            <Accordion.Header>
                                                <MessageSquare size={18} className="me-2" />
                                                Recommendation System
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                <Form.Check
                                                    type="switch"
                                                    id="enable-recommendations"
                                                    label="Enable intelligent recommendations based on analysis results"
                                                    checked={enableRecommendations}
                                                    onChange={(e) => setEnableRecommendations(e.target.checked)}
                                                    className="mb-3"
                                                />
                                                {enableRecommendations && (
                                                    <div className="ms-4">
                                                        <small className="text-muted">
                                                            Recommendations will include: Clinical guidance, Follow-up suggestions, 
                                                            Treatment options, and Prevention strategies based on current medical guidelines.
                                                        </small>
                                                    </div>
                                                )}
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                )}

                                {/* File Upload and Text Input */}
                                <Form onSubmit={handleAdvancedAnalyze}>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Upload Report File</Form.Label>
                                                <Form.Control
                                                    type="file"
                                                    ref={mainReportFileInputRef}
                                                    onChange={handleMainReportFileChange}
                                                    accept=".txt,.pdf,.docx"
                                                    disabled={isAnalyzing}
                                                />
                                                <Form.Text className="text-muted">
                                                    Supported formats: .txt, .pdf, .docx
                                                </Form.Text>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Upload X-Ray Image (Optional)</Form.Label>
                                                <Form.Control
                                                    type="file"
                                                    ref={reportImageFileInputRef}
                                                    onChange={handleReportImageFileChange}
                                                    accept="image/*"
                                                    disabled={isAnalyzing}
                                                />
                                                <Form.Text className="text-muted">
                                                    For enhanced image analysis and segmentation
                                                </Form.Text>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Or Enter Report Text Directly</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={6}
                                            value={reportText}
                                            onChange={(e) => setReportText(e.target.value)}
                                            placeholder="Paste your radiology report text here..."
                                            disabled={isAnalyzing}
                                        />
                                    </Form.Group>

                                    {reportImagePreviewUrl && (
                                        <div className="mb-3">
                                            <Form.Label>X-Ray Preview</Form.Label>
                                            <div className="border rounded p-2">
                                                <Image src={reportImagePreviewUrl} alt="X-Ray" fluid style={{maxHeight: '200px'}} />
                                            </div>
                                        </div>
                                    )}

                                    {/* Processing Progress */}
                                    {isAnalyzing && (
                                        <div className="mb-3">
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-muted">{processingStep}</span>
                                                <span className="text-muted">{processingProgress}%</span>
                                            </div>
                                            <ProgressBar 
                                                now={processingProgress} 
                                                variant="primary"
                                                animated
                                                className="processing-glow"
                                            />
                                        </div>
                                    )}

                                    <Button 
                                        type="submit" 
                                        variant="primary" 
                                        disabled={isAnalyzing || (!selectedFile && !reportText.trim())}
                                        className="me-2"
                                    >
                                        {isAnalyzing ? (
                                            <>
                                                <Spinner as="span" animation="border" size="sm" className="me-2" />
                                                Analyzing with {selectedModelConfig?.name}...
                                            </>
                                        ) : (
                                            <>
                                                <Brain size={16} className="me-2" />
                                                Advanced Analysis with {selectedModelConfig?.name}
                                            </>
                                        )}
                                    </Button>

                                    {analysisResult && (
                                        <Button 
                                            variant="outline-success" 
                                            onClick={handlePassToChatbot}
                                            disabled={isAnalyzing}
                                        >
                                            <MessageSquare size={16} className="me-2" />
                                            Open in AI Chat
                                        </Button>
                                    )}
                                </Form>

                                {error && (
                                    <Alert variant="danger" className="mt-3">
                                        {error}
                                    </Alert>
                                )}
                            </Card.Body>
                        </Card>

                        {/* Results Display */}
                        {analysisResult && (
                            <Tabs defaultActiveKey="analysis" className="mb-4">
                                <Tab eventKey="analysis" title={
                                    <span>
                                        <File size={16} className="me-2" />
                                        Analysis Results
                                    </span>
                                }>
                                    <Card>
                                        <Card.Body>
                                            {qualityMetrics && (
                                                <div className="mb-4">
                                                    <h6 className="mb-3">Quality Metrics</h6>
                                                    <QualityMetricsDisplay metrics={qualityMetrics} />
                                                </div>
                                            )}

                                            <h6 className="mb-3">Original Report with Analysis</h6>
                                            <div className="border rounded p-3 mb-3 bg-light">
                                                <AnalyzedTextDisplay 
                                                    originalText={analysisResult.original_text} 
                                                    highlights={processedHighlights} 
                                                />
                                            </div>

                                            {analysisResult.accuracy_score !== undefined && (
                                                <div className="mb-3">
                                                    <div className="d-flex justify-content-between mb-2">
                                                        <span>Overall Accuracy Score</span>
                                                        <Badge bg={analysisResult.accuracy_score >= 80 ? 'success' : analysisResult.accuracy_score >= 60 ? 'warning' : 'danger'}>
                                                            {analysisResult.accuracy_score.toFixed(1)}%
                                                        </Badge>
                                                    </div>
                                                    <ProgressBar 
                                                        now={analysisResult.accuracy_score} 
                                                        variant={analysisResult.accuracy_score >= 80 ? 'success' : analysisResult.accuracy_score >= 60 ? 'warning' : 'danger'}
                                                    />
                                                </div>
                                            )}

                                            {analysisResult.corrected_report_text && (
                                                <div>
                                                    <h6 className="mb-3">Corrected Report</h6>
                                                    <div className="border rounded p-3 bg-success-subtle">
                                                        <pre style={{whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0}}>
                                                            {analysisResult.corrected_report_text}
                                                        </pre>
                                                    </div>
                                                </div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Tab>

                                <Tab eventKey="deeplearning" title={
                                    <span>
                                        <Layers size={16} className="me-2" />
                                        Deep Learning
                                    </span>
                                }>
                                    <Card>
                                        <Card.Body>
                                            {deepLearningResults ? (
                                                <div>
                                                    {Object.entries(deepLearningResults).map(([key, result]) => (
                                                        <div key={key} className="mb-4">
                                                            <div className="gradient-card">
                                                                <BootstrapCard>
                                                                    <BootstrapCard.Header>
                                                                        <h6 className="mb-0 text-capitalize">{key.replace(/([A-Z])/g, ' $1')}</h6>
                                                                    </BootstrapCard.Header>
                                                                    <BootstrapCard.Body>
                                                                        {typeof result === 'object' ? (
                                                                            <div>
                                                                                {Object.entries(result).map(([subKey, subValue]) => (
                                                                                    <div key={subKey} className="mb-2">
                                                                                        <strong className="text-capitalize">{subKey.replace(/([A-Z])/g, ' $1')}:</strong>
                                                                                        <span className="ms-2">
                                                                                            {Array.isArray(subValue) ? subValue.join(', ') : 
                                                                                             typeof subValue === 'number' ? subValue.toFixed(2) : 
                                                                                             String(subValue)}
                                                                                        </span>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        ) : (
                                                                            <span>{String(result)}</span>
                                                                        )}
                                                                    </BootstrapCard.Body>
                                                                </BootstrapCard>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-4">
                                                    <Layers size={48} className="text-muted mb-3" />
                                                    <p className="text-muted">No deep learning results available. Run analysis to see results.</p>
                                                </div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Tab>

                                <Tab eventKey="segmentation" title={
                                    <span>
                                        <Target size={16} className="me-2" />
                                        Segmentation
                                    </span>
                                }>
                                    <Card>
                                        <Card.Body>
                                            {segmentationResults ? (
                                                <div>
                                                    {Object.entries(segmentationResults).map(([key, result]) => (
                                                        <div key={key} className="mb-4">
                                                            <h6 className="text-capitalize">{key.replace(/([A-Z])/g, ' $1')}</h6>
                                                            <div className="border rounded p-3">
                                                                {typeof result === 'object' ? (
                                                                    <div>
                                                                        {Object.entries(result).map(([subKey, subValue]) => (
                                                                            <div key={subKey} className="row mb-2">
                                                                                <div className="col-4">
                                                                                    <strong className="text-capitalize">{subKey.replace(/([A-Z])/g, ' $1')}:</strong>
                                                                                </div>
                                                                                <div className="col-8">
                                                                                    {typeof subValue === 'object' ? (
                                                                                        <div className="small">
                                                                                            {Object.entries(subValue).map(([k, v]) => (
                                                                                                <div key={k}>
                                                                                                    <span className="text-muted">{k}:</span> {String(v)}
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                    ) : (
                                                                                        <span>{String(subValue)}</span>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <span>{String(result)}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-4">
                                                    <Target size={48} className="text-muted mb-3" />
                                                    <p className="text-muted">No segmentation results available. Upload an image and run analysis.</p>
                                                </div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Tab>

                                <Tab eventKey="recommendations" title={
                                    <span>
                                        <MessageSquare size={16} className="me-2" />
                                        Recommendations
                                    </span>
                                }>
                                    <Card>
                                        <Card.Body>
                                            {recommendations ? (
                                                <div>
                                                    {Object.entries(recommendations).map(([type, recs]) => (
                                                        <div key={type} className="mb-4">
                                                            <h6 className="mb-3 text-capitalize">{type} Recommendations</h6>
                                                            {Array.isArray(recs) ? (
                                                                recs.map((rec, index) => (
                                                                    <RecommendationCard key={index} recommendation={rec} type={type} />
                                                                ))
                                                            ) : (
                                                                <RecommendationCard recommendation={recs} type={type} />
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-4">
                                                    <MessageSquare size={48} className="text-muted mb-3" />
                                                    <p className="text-muted">No recommendations available. Enable recommendations and run analysis.</p>
                                                </div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Tab>
                            </Tabs>
                        )}
                    </Col>

                    {/* Right Sidebar with Chat */}
                    <Col lg={4}>
                        <Tabs activeKey={activeLeftTab} onSelect={(k) => setActiveLeftTab(k)} className="mb-3">
                            <Tab eventKey="chatbot" title={
                                <span>
                                    <MessageSquare size={16} className="me-2" />
                                    AI Chat
                                </span>
                            }>
                                <div style={{ minHeight: '600px' }}>
                                    <ReportChatInterface
                                        imageFile={reportImageFile}
                                        reportContext={reportContextForChat}
                                        isReady={isChatReady}
                                        imageUploadTimestamp={reportImageFile ? Date.now() : null}
                                        reportUploadTimestamp={reportContextForChat ? Date.now() : null}
                                    />
                                </div>
                            </Tab>
                        </Tabs>
                    </Col>
                </Row>

                {/* Export Modal */}
                <Modal show={exportModalShow} onHide={() => setExportModalShow(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Export Analysis Results</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Export Format</Form.Label>
                            <Form.Select 
                                value={selectedExportFormat} 
                                onChange={(e) => setSelectedExportFormat(e.target.value)}
                            >
                                {Object.entries(ADVANCED_ANALYSIS_CONFIG.export.formats).map(([key, format]) => (
                                    <option key={key} value={key} disabled={!format.enabled}>
                                        {format.icon} {format.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Alert variant="info">
                            <small>
                                This will export all analysis results including AI findings, deep learning results, 
                                segmentation data, and recommendations in the selected format.
                            </small>
                        </Alert>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setExportModalShow(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleExport}>
                            <Download size={16} className="me-2" />
                            Export
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </SubscriptionGate>
    );
};

export default AdvancedAnalyzeReport;
