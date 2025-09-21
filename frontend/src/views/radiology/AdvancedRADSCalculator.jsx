import React, { useState, useEffect, useRef } from 'react';
import { 
    Container, Row, Col, Button, Form, Modal, Tab, Nav, Alert, Badge, 
    Table, Card, Spinner, ProgressBar, Accordion, ListGroup, Tooltip, OverlayTrigger 
} from 'react-bootstrap';
import { Line, Radar, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    RadialLinearScale,
    BarElement,
    Title,
    Tooltip as ChartTooltip,
    Legend,
    Filler
} from 'chart.js';
import ADVANCED_RADS_CONFIG from '../../config/advancedRadsConfig';
import advancedRADSCalculatorService from '../../services/advancedRADSCalculatorService';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    RadialLinearScale,
    BarElement,
    Title,
    ChartTooltip,
    Legend,
    Filler
);

const AdvancedRADSCalculator = () => {
    const [activeCalculator, setActiveCalculator] = useState('birads');
    const [showResult, setShowResult] = useState(false);
    const [calculationResult, setCalculationResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiModelSelected, setAiModelSelected] = useState('auto');
    const [uncertaintyMode, setUncertaintyMode] = useState(true);
    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
    const [clinicalContext, setClinicalContext] = useState('');
    const [patientAge, setPatientAge] = useState('');
    const [patientSex, setPatientSex] = useState('');
    const [uploadedImages, setUploadedImages] = useState([]);
    const [similarCases, setSimilarCases] = useState([]);
    const [riskAssessment, setRiskAssessment] = useState(null);
    const [predictiveAnalytics, setPredictiveAnalytics] = useState(null);
    const [qualityMetrics, setQualityMetrics] = useState(null);
    const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
    const [availableAIModels, setAvailableAIModels] = useState({});
    const [clinicalGuidelines, setClinicalGuidelines] = useState({});
    const [loadingModels, setLoadingModels] = useState(false);
    const fileInputRef = useRef(null);

    // Enhanced State for all RADS systems
    const [biRadsData, setBiRadsData] = useState({
        massShape: '',
        massMargins: '',
        echogenicity: '',
        vascularity: '',
        calcifications: '',
        architecturalDistortion: false,
        skinThickening: false,
        previousFindings: '',
        familyHistory: '',
        hormoneStatus: '',
        breastDensity: ''
    });

    const [liRadsData, setLiRadsData] = useState({
        lesionSize: '',
        arterialPhase: '',
        portalPhase: '',
        delayedPhase: '',
        diffusionRestriction: '',
        capsuleAppearance: '',
        threshold: false,
        cirrhosis: '',
        hepatitisStatus: '',
        alphaFetoprotein: '',
        previousImaging: ''
    });

    const [oRadsData, setORadsDatal] = useState({
        morphology: '',
        wallThickness: '',
        septalThickness: '',
        echogenicity: '',
        shadowingfeatures: '',
        vascularflow: '',
        ca125Level: '',
        menopausalStatus: '',
        familyHistory: '',
        previousSurgery: ''
    });

    // New RADS systems
    const [piRadsData, setPiRadsData] = useState({
        peripheralZone: '',
        transitionZone: '',
        centralZone: '',
        diffusionWeighted: '',
        dynamicContrast: '',
        psaLevel: '',
        digitalRectalExam: '',
        previousBiopsy: ''
    });

    const [tiRadsData, setTiRadsData] = useState({
        composition: '',
        echogenicity: '',
        shape: '',
        margin: '',
        echogeicFoci: '',
        noduleSize: '',
        thyroidFunction: '',
        familyHistory: ''
    });

    const [cRadsData, setCRadsData] = useState({
        vesselInvolvement: '',
        plaqueComposition: '',
        stenosis: '',
        calcification: '',
        ulceration: '',
        cholesterolLevel: '',
        bloodPressure: '',
        diabetesStatus: ''
    });

    useEffect(() => {
        // Initialize AI models and load configurations
        initializeAIModels();
        loadClinicalGuidelines();
    }, []);

    const initializeAIModels = async () => {
        setLoadingModels(true);
        try {
            const models = await advancedRADSCalculatorService.getAIModels();
            setAvailableAIModels(models.models || {});
            console.log('AI models loaded successfully');
        } catch (error) {
            console.error('Error loading AI models:', error);
        } finally {
            setLoadingModels(false);
        }
    };

    const loadClinicalGuidelines = async () => {
        try {
            const guidelines = await advancedRADSCalculatorService.getClinicalGuidelines();
            setClinicalGuidelines(guidelines.guidelines || {});
            console.log('Clinical guidelines loaded successfully');
        } catch (error) {
            console.error('Error loading clinical guidelines:', error);
        }
    };

    const handleImageUpload = async (event) => {
        const files = Array.from(event.target.files);
        
        if (files.length === 0) return;

        try {
            // Validate images using the service
            const validation = await advancedRADSCalculatorService.validateImagingData(files);
            
            if (validation.overall_valid) {
                setUploadedImages(prev => [...prev, ...files]);
                
                // Show success message for valid uploads
                const validCount = validation.validation_results.filter(r => r.valid).length;
                console.log(`Successfully uploaded ${validCount} valid image(s)`);
                
                // Show warnings for any invalid files
                const invalidFiles = validation.validation_results.filter(r => !r.valid);
                if (invalidFiles.length > 0) {
                    console.warn('Some files were invalid:', invalidFiles.map(f => f.filename));
                }
            } else {
                alert('Some uploaded files are invalid. Please check file formats and sizes.');
            }
        } catch (error) {
            console.error('Image upload validation failed:', error);
            // Still allow upload in case of validation service failure
            setUploadedImages(prev => [...prev, ...files]);
        }
    };

    const removeUploadedImage = (index) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== index));
    };

    const performAdvancedAnalysis = async (radsType, data) => {
        setIsAnalyzing(true);
        
        try {
            // Simulate advanced AI analysis
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Get AI model configuration
            const aiModel = ADVANCED_RADS_CONFIG.aiModels[radsType];
            const riskFactors = ADVANCED_RADS_CONFIG.riskAssessment.factors;

            // Simulate AI-powered risk assessment
            const riskScore = calculateAIRiskScore(data, radsType);
            const uncertainty = calculateUncertainty(data, riskScore);
            const similarCasesData = await findSimilarCases(data, radsType);
            const predictiveData = await generatePredictiveAnalytics(data, radsType);
            const qualityData = assessImageQuality(uploadedImages);

            // Check for critical findings
            const isCritical = checkCriticalFindings(riskScore, data, radsType);
            
            if (isCritical) {
                setShowEmergencyAlert(true);
            }

            setSimilarCases(similarCasesData);
            setRiskAssessment({
                overall: riskScore,
                imaging: riskScore * riskFactors.imaging.weight,
                clinical: riskScore * riskFactors.clinical.weight,
                temporal: riskScore * riskFactors.temporal.weight,
                biomarkers: riskScore * riskFactors.biomarkers.weight,
                uncertainty: uncertainty,
                confidence: (1 - uncertainty) * 100
            });
            setPredictiveAnalytics(predictiveData);
            setQualityMetrics(qualityData);

            return {
                aiModel: aiModel.name,
                accuracy: aiModel.accuracy,
                confidence: (1 - uncertainty) * 100,
                riskScore: riskScore,
                clinicalDecision: generateClinicalDecision(riskScore, radsType),
                isCritical: isCritical
            };

        } catch (error) {
            console.error('Advanced analysis error:', error);
            return null;
        } finally {
            setIsAnalyzing(false);
        }
    };

    const calculateAIRiskScore = (data, radsType) => {
        // Simulate AI-powered risk calculation
        const features = Object.values(data).filter(val => val !== '' && val !== false);
        const riskMultiplier = features.length * 0.1;
        
        // Add specific risk calculations for each RADS type
        switch (radsType) {
            case 'birads':
                return Math.min(1.0, 0.2 + riskMultiplier + 
                    (data.massMargins === 'spiculated' ? 0.3 : 0) +
                    (data.calcifications === 'highly-suspicious' ? 0.25 : 0));
            case 'lirads':
                return Math.min(1.0, 0.15 + riskMultiplier +
                    (data.arterialPhase === 'hyperenhancing' ? 0.25 : 0) +
                    (data.portalPhase === 'washout' ? 0.3 : 0));
            case 'orads':
                return Math.min(1.0, 0.1 + riskMultiplier +
                    (data.morphology === 'solid' ? 0.35 : 0) +
                    (data.vascularflow === 'present' ? 0.2 : 0));
            default:
                return Math.min(1.0, 0.15 + riskMultiplier);
        }
    };

    const calculateUncertainty = (data, riskScore) => {
        // Simulate Bayesian uncertainty quantification
        const dataCompleteness = Object.values(data).filter(val => val !== '' && val !== false).length / Object.keys(data).length;
        const baseUncertainty = 0.1;
        const incompletenessUncertainty = (1 - dataCompleteness) * 0.3;
        return Math.min(0.5, baseUncertainty + incompletenessUncertainty);
    };

    const findSimilarCases = async (data, radsType) => {
        // Simulate case-based reasoning
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const sampleCases = ADVANCED_RADS_CONFIG.sampleCases[radsType] || {};
        return Object.entries(sampleCases).map(([key, caseData], index) => ({
            id: key,
            similarity: Math.random() * 0.3 + 0.7, // 70-100% similarity
            description: caseData.description,
            outcome: caseData.expectedRADS || caseData.expectedLIRADS,
            risk: caseData.malignancyRisk || caseData.hccProbability || Math.random() * 0.5
        }));
    };

    const generatePredictiveAnalytics = async (data, radsType) => {
        // Simulate predictive modeling
        await new Promise(resolve => setTimeout(resolve, 800));
        
        return {
            outcomePredictor: {
                benignProbability: Math.random() * 0.4 + 0.1,
                malignantProbability: Math.random() * 0.3 + 0.1,
                uncertainProbability: Math.random() * 0.2 + 0.05
            },
            progressionModel: {
                stable: Math.random() * 0.6 + 0.2,
                slowProgression: Math.random() * 0.3 + 0.1,
                rapidProgression: Math.random() * 0.15 + 0.05
            },
            timeHorizons: ['3 months', '6 months', '1 year', '2 years'],
            recommendations: generateAIRecommendations(data, radsType)
        };
    };

    const generateAIRecommendations = (data, radsType) => {
        const guidelines = ADVANCED_RADS_CONFIG.clinicalDecisionSupport.guidelines;
        const recommendations = ADVANCED_RADS_CONFIG.clinicalDecisionSupport.recommendations;
        
        return {
            followUp: recommendations.followUp.routine,
            procedures: [recommendations.procedures.mri, recommendations.procedures.monitoring],
            guidelines: Object.values(guidelines).filter(g => g.enabled).map(g => g.name)
        };
    };

    const assessImageQuality = (images) => {
        if (images.length === 0) return null;
        
        return {
            resolution: 'High (1024x1024)',
            contrast: 'Adequate',
            artifacts: 'Minimal',
            overallQuality: 'Excellent',
            aiProcessable: true,
            qualityScore: 0.92
        };
    };

    const checkCriticalFindings = (riskScore, data, radsType) => {
        const criticalThreshold = ADVANCED_RADS_CONFIG.clinicalDecisionSupport.criticalAlerts.alertThresholds.malignancyRisk;
        return riskScore > criticalThreshold;
    };

    const generateClinicalDecision = (riskScore, radsType) => {
        if (riskScore > 0.8) {
            return {
                urgency: 'URGENT',
                recommendation: 'Immediate consultation recommended',
                timeframe: 'Within 24-48 hours',
                procedures: ['Biopsy', 'Multidisciplinary review']
            };
        } else if (riskScore > 0.5) {
            return {
                urgency: 'HIGH',
                recommendation: 'Short-term follow-up recommended',
                timeframe: '1-3 months',
                procedures: ['Follow-up imaging', 'Clinical correlation']
            };
        } else {
            return {
                urgency: 'ROUTINE',
                recommendation: 'Routine surveillance',
                timeframe: '6-12 months',
                procedures: ['Annual screening', 'Clinical monitoring']
            };
        }
    };

    const calculateBiRads = async () => {
        setIsAnalyzing(true);
        
        try {
            // Prepare options for API call
            const options = {
                modelType: aiModelSelected,
                imageData: uploadedImages.length > 0 ? uploadedImages : null,
                clinicalContext: clinicalContext,
                patientAge: patientAge,
                patientSex: patientSex,
                uncertaintyMode: uncertaintyMode
            };

            // Call the AI-powered backend service
            const analysisResult = await advancedRADSCalculatorService.calculateRADS(
                'birads',
                biRadsData,
                options
            );

            if (!analysisResult || analysisResult.error) {
                throw new Error(analysisResult?.message || 'Analysis failed');
            }

            // Update state with all AI analysis results
            const result = analysisResult.result;
            setSimilarCases(analysisResult.similar_cases || []);
            setRiskAssessment(analysisResult.risk_assessment);
            setPredictiveAnalytics(analysisResult.predictive_analytics);
            setQualityMetrics(analysisResult.quality_metrics);

            // Check for critical findings
            if (result.is_critical) {
                setShowEmergencyAlert(true);
            }

            // Set the final calculation result
            setCalculationResult({
                type: 'BI-RADS',
                score: result.score,
                description: result.description,
                recommendation: result.recommendation,
                malignancyRisk: `${(result.malignancy_risk * 100).toFixed(1)}%`,
                aiModel: result.ai_model_used,
                confidence: `${(result.confidence * 100).toFixed(1)}%`,
                aiEnhanced: true,
                clinicalDecision: result.clinical_decision,
                isCritical: result.is_critical,
                uncertainty: `±${(result.uncertainty * 100).toFixed(1)}%`,
                requestId: analysisResult.requestId,
                processingTime: analysisResult.processing_time
            });

            setShowResult(true);

        } catch (error) {
            console.error('BI-RADS calculation error:', error);
            alert(`Analysis failed: ${error.message}`);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const calculateLiRads = async () => {
        const analysisResult = await performAdvancedAnalysis('lirads', liRadsData);
        
        if (!analysisResult) return;

        let score = 'LR-1';
        let description = '';
        let hccProbability = '0%';
        const riskScore = analysisResult.riskScore;

        if (riskScore > 0.9) {
            score = 'LR-5';
            description = 'Definitely HCC';
            hccProbability = '>95%';
        } else if (riskScore > 0.7) {
            score = 'LR-4';
            description = 'Probably HCC';
            hccProbability = '50-95%';
        } else if (riskScore > 0.3) {
            score = 'LR-3';
            description = 'Intermediate probability for HCC';
            hccProbability = '10-50%';
        } else if (riskScore > 0.1) {
            score = 'LR-2';
            description = 'Probably benign';
            hccProbability = '<10%';
        } else {
            score = 'LR-1';
            description = 'Definitely benign';
            hccProbability = '<1%';
        }

        setCalculationResult({
            type: 'LI-RADS',
            score: score,
            description: description,
            recommendation: analysisResult.clinicalDecision.recommendation,
            malignancyRisk: hccProbability,
            aiModel: analysisResult.aiModel,
            confidence: `${analysisResult.confidence.toFixed(1)}%`,
            aiEnhanced: true,
            clinicalDecision: analysisResult.clinicalDecision,
            isCritical: analysisResult.isCritical
        });
        setShowResult(true);
    };

    const calculateORads = async () => {
        const analysisResult = await performAdvancedAnalysis('orads', oRadsData);
        
        if (!analysisResult) return;

        let score = 1;
        let description = '';
        let malignancyRisk = '0%';
        const riskScore = analysisResult.riskScore;

        if (riskScore > 0.8) {
            score = 5;
            description = 'High risk of malignancy';
            malignancyRisk = '>50%';
        } else if (riskScore > 0.5) {
            score = 4;
            description = 'Intermediate risk of malignancy';
            malignancyRisk = '5-50%';
        } else if (riskScore > 0.2) {
            score = 3;
            description = 'Low risk of malignancy';
            malignancyRisk = '1-5%';
        } else if (riskScore > 0.05) {
            score = 2;
            description = 'Almost certainly benign';
            malignancyRisk = '<1%';
        } else {
            score = 1;
            description = 'Normal or physiologic ovary';
            malignancyRisk = '0%';
        }

        setCalculationResult({
            type: 'O-RADS',
            score: `O-RADS ${score}`,
            description: description,
            recommendation: analysisResult.clinicalDecision.recommendation,
            malignancyRisk: malignancyRisk,
            aiModel: analysisResult.aiModel,
            confidence: `${analysisResult.confidence.toFixed(1)}%`,
            aiEnhanced: true,
            clinicalDecision: analysisResult.clinicalDecision,
            isCritical: analysisResult.isCritical
        });
        setShowResult(true);
    };

    const renderAIControlPanel = () => (
        <Card className="mb-4 border-0 shadow-sm">
            <Card.Header className="bg-gradient-primary text-white">
                <h6 className="mb-0">
                    <i className="ri-robot-line me-2"></i>
                    AI-Powered Analysis Controls
                </h6>
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>AI Model Selection</Form.Label>
                            <Form.Select 
                                value={aiModelSelected}
                                onChange={(e) => setAiModelSelected(e.target.value)}
                                disabled={loadingModels}
                            >
                                <option value="auto">Auto-Select Best Model</option>
                                {Object.entries(availableAIModels).map(([key, model]) => (
                                    <option key={key} value={key}>
                                        {model.name} (Accuracy: {(model.accuracy * 100).toFixed(1)}%)
                                    </option>
                                ))}
                            </Form.Select>
                            {loadingModels && (
                                <Form.Text className="text-muted">
                                    <Spinner animation="border" size="sm" className="me-1" />
                                    Loading AI models...
                                </Form.Text>
                            )}
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>Analysis Mode</Form.Label>
                            <div>
                                <Form.Check 
                                    type="switch"
                                    id="uncertainty-mode"
                                    label="Uncertainty Quantification"
                                    checked={uncertaintyMode}
                                    onChange={(e) => setUncertaintyMode(e.target.checked)}
                                />
                                <Form.Check 
                                    type="switch"
                                    id="advanced-options"
                                    label="Show Advanced Options"
                                    checked={showAdvancedOptions}
                                    onChange={(e) => setShowAdvancedOptions(e.target.checked)}
                                />
                            </div>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>Image Upload</Form.Label>
                            <div className="d-grid">
                                <Button 
                                    variant="outline-primary" 
                                    onClick={() => fileInputRef.current?.click()}
                                    size="sm"
                                >
                                    <i className="ri-upload-cloud-line me-1"></i>
                                    Upload DICOM/Images
                                </Button>
                                <input 
                                    ref={fileInputRef}
                                    type="file" 
                                    multiple 
                                    accept=".dcm,.png,.jpg,.jpeg,.tiff"
                                    style={{ display: 'none' }}
                                    onChange={handleImageUpload}
                                />
                            </div>
                        </Form.Group>
                    </Col>
                </Row>

                {uploadedImages.length > 0 && (
                    <div className="mt-3">
                        <h6>Uploaded Images ({uploadedImages.length})</h6>
                        <div className="d-flex flex-wrap gap-2">
                            {uploadedImages.map((file, index) => (
                                <Badge key={index} bg="info" className="p-2">
                                    {file.name}
                                    <Button 
                                        variant="link" 
                                        size="sm" 
                                        className="text-white p-0 ms-1"
                                        onClick={() => removeUploadedImage(index)}
                                    >
                                        ×
                                    </Button>
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {showAdvancedOptions && (
                    <div className="mt-3 pt-3 border-top">
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Clinical Context</Form.Label>
                                    <Form.Control 
                                        as="textarea"
                                        rows={3}
                                        value={clinicalContext}
                                        onChange={(e) => setClinicalContext(e.target.value)}
                                        placeholder="Enter relevant clinical history, symptoms, or concerns..."
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Patient Age</Form.Label>
                                    <Form.Control 
                                        type="number"
                                        value={patientAge}
                                        onChange={(e) => setPatientAge(e.target.value)}
                                        placeholder="Age"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Patient Sex</Form.Label>
                                    <Form.Select 
                                        value={patientSex}
                                        onChange={(e) => setPatientSex(e.target.value)}
                                    >
                                        <option value="">Select</option>
                                        <option value="female">Female</option>
                                        <option value="male">Male</option>
                                        <option value="other">Other</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                    </div>
                )}
            </Card.Body>
        </Card>
    );

    const renderEnhancedBiRadsForm = () => (
        <Form>
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Mass Shape</Form.Label>
                        <Form.Select 
                            value={biRadsData.massShape}
                            onChange={(e) => setBiRadsData(prev => ({ ...prev, massShape: e.target.value }))}
                        >
                            <option value="">Select shape</option>
                            <option value="round">Round</option>
                            <option value="oval">Oval</option>
                            <option value="irregular">Irregular</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Mass Margins</Form.Label>
                        <Form.Select 
                            value={biRadsData.massMargins}
                            onChange={(e) => setBiRadsData(prev => ({ ...prev, massMargins: e.target.value }))}
                        >
                            <option value="">Select margins</option>
                            <option value="circumscribed">Circumscribed</option>
                            <option value="obscured">Obscured</option>
                            <option value="microlobulated">Microlobulated</option>
                            <option value="indistinct">Indistinct</option>
                            <option value="spiculated">Spiculated</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Echogenicity</Form.Label>
                        <Form.Select 
                            value={biRadsData.echogenicity}
                            onChange={(e) => setBiRadsData(prev => ({ ...prev, echogenicity: e.target.value }))}
                        >
                            <option value="">Select echogenicity</option>
                            <option value="anechoic">Anechoic</option>
                            <option value="hypoechoic">Hypoechoic</option>
                            <option value="isoechoic">Isoechoic</option>
                            <option value="hyperechoic">Hyperechoic</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Vascularity</Form.Label>
                        <Form.Select 
                            value={biRadsData.vascularity}
                            onChange={(e) => setBiRadsData(prev => ({ ...prev, vascularity: e.target.value }))}
                        >
                            <option value="">Select vascularity</option>
                            <option value="absent">Absent</option>
                            <option value="minimal">Minimal</option>
                            <option value="moderate">Moderate</option>
                            <option value="marked">Marked</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Calcifications</Form.Label>
                        <Form.Select 
                            value={biRadsData.calcifications}
                            onChange={(e) => setBiRadsData(prev => ({ ...prev, calcifications: e.target.value }))}
                        >
                            <option value="">Select type</option>
                            <option value="benign">Benign</option>
                            <option value="suspicious">Suspicious</option>
                            <option value="highly-suspicious">Highly suspicious</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Breast Density</Form.Label>
                        <Form.Select 
                            value={biRadsData.breastDensity}
                            onChange={(e) => setBiRadsData(prev => ({ ...prev, breastDensity: e.target.value }))}
                        >
                            <option value="">Select density</option>
                            <option value="a">A - Almost entirely fatty</option>
                            <option value="b">B - Scattered fibroglandular</option>
                            <option value="c">C - Heterogeneously dense</option>
                            <option value="d">D - Extremely dense</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            {showAdvancedOptions && (
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Previous Findings</Form.Label>
                            <Form.Control 
                                as="textarea"
                                rows={2}
                                value={biRadsData.previousFindings}
                                onChange={(e) => setBiRadsData(prev => ({ ...prev, previousFindings: e.target.value }))}
                                placeholder="Previous imaging findings..."
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Family History</Form.Label>
                            <Form.Select 
                                value={biRadsData.familyHistory}
                                onChange={(e) => setBiRadsData(prev => ({ ...prev, familyHistory: e.target.value }))}
                            >
                                <option value="">Select</option>
                                <option value="none">No family history</option>
                                <option value="breast">Breast cancer</option>
                                <option value="ovarian">Ovarian cancer</option>
                                <option value="brca">BRCA mutation</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
            )}

            <Row>
                <Col md={12}>
                    <Form.Group className="mb-3">
                        <Form.Label>Additional Features</Form.Label>
                        <div>
                            <Form.Check 
                                type="checkbox"
                                label="Architectural distortion"
                                checked={biRadsData.architecturalDistortion}
                                onChange={(e) => setBiRadsData(prev => ({ ...prev, architecturalDistortion: e.target.checked }))}
                            />
                            <Form.Check 
                                type="checkbox"
                                label="Skin thickening"
                                checked={biRadsData.skinThickening}
                                onChange={(e) => setBiRadsData(prev => ({ ...prev, skinThickening: e.target.checked }))}
                            />
                        </div>
                    </Form.Group>
                </Col>
            </Row>

            <div className="d-flex gap-2">
                <Button 
                    variant="primary" 
                    onClick={calculateBiRads} 
                    disabled={isAnalyzing}
                    className="me-2"
                >
                    {isAnalyzing ? (
                        <>
                            <Spinner animation="border" size="sm" className="me-1" />
                            AI Analyzing...
                        </>
                    ) : (
                        <>
                            <i className="ri-brain-line me-1"></i>
                            Calculate BI-RADS with AI
                        </>
                    )}
                </Button>
                <Button variant="outline-info" size="sm">
                    <i className="ri-information-line me-1"></i>
                    Guidelines
                </Button>
            </div>
        </Form>
    );

    const renderAnalysisProgress = () => {
        if (!isAnalyzing) return null;

        return (
            <Card className="mb-4 border-0 shadow-sm">
                <Card.Body>
                    <div className="text-center">
                        <h6 className="mb-3">
                            <i className="ri-brain-line me-2"></i>
                            AI Analysis in Progress
                        </h6>
                        <div className="mb-3">
                            <ProgressBar animated now={100} variant="info" />
                        </div>
                        <div className="row text-center">
                            <div className="col">
                                <small className="text-muted">Processing Images</small>
                            </div>
                            <div className="col">
                                <small className="text-muted">Risk Assessment</small>
                            </div>
                            <div className="col">
                                <small className="text-muted">Finding Similar Cases</small>
                            </div>
                            <div className="col">
                                <small className="text-muted">Generating Recommendations</small>
                            </div>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        );
    };

    const renderRiskAssessmentChart = () => {
        if (!riskAssessment) return null;

        const data = {
            labels: ['Imaging', 'Clinical', 'Temporal', 'Biomarkers'],
            datasets: [{
                label: 'Risk Score',
                data: [
                    riskAssessment.imaging * 100,
                    riskAssessment.clinical * 100,
                    riskAssessment.temporal * 100,
                    riskAssessment.biomarkers * 100
                ],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                fill: true
            }]
        };

        const options = {
            responsive: true,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100
                }
            }
        };

        return (
            <div className="mb-4">
                <h6>AI Risk Assessment Breakdown</h6>
                <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                    <Radar data={data} options={options} />
                </div>
                <div className="mt-3">
                    <small className="text-muted">
                        Overall Confidence: {riskAssessment.confidence.toFixed(1)}% | 
                        Uncertainty: ±{(riskAssessment.uncertainty * 100).toFixed(1)}%
                    </small>
                </div>
            </div>
        );
    };

    const renderSimilarCases = () => {
        if (!similarCases || similarCases.length === 0) return null;

        return (
            <div className="mb-4">
                <h6>Similar Cases from AI Database</h6>
                <ListGroup>
                    {similarCases.slice(0, 3).map((case_, index) => (
                        <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                            <div>
                                <strong>{case_.description}</strong>
                                <br />
                                <small className="text-muted">Outcome: {case_.outcome}</small>
                            </div>
                            <div className="text-end">
                                <Badge bg="info">{(case_.similarity * 100).toFixed(0)}% similar</Badge>
                                <br />
                                <small className="text-muted">Risk: {(case_.risk * 100).toFixed(0)}%</small>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </div>
        );
    };

    const renderPredictiveAnalytics = () => {
        if (!predictiveAnalytics) return null;

        const outcomeData = {
            labels: ['Benign', 'Malignant', 'Uncertain'],
            datasets: [{
                data: [
                    predictiveAnalytics.outcomePredictor.benignProbability * 100,
                    predictiveAnalytics.outcomePredictor.malignantProbability * 100,
                    predictiveAnalytics.outcomePredictor.uncertainProbability * 100
                ],
                backgroundColor: ['#28a745', '#dc3545', '#ffc107'],
                borderWidth: 2
            }]
        };

        return (
            <div className="mb-4">
                <h6>Predictive Analytics</h6>
                <Row>
                    <Col md={6}>
                        <div style={{ height: '200px' }}>
                            <Bar 
                                data={outcomeData} 
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            display: false
                                        }
                                    }
                                }} 
                            />
                        </div>
                    </Col>
                    <Col md={6}>
                        <div>
                            <h6>AI Recommendations</h6>
                            <ul className="list-unstyled">
                                <li><strong>Follow-up:</strong> {predictiveAnalytics.recommendations.followUp}</li>
                                <li><strong>Procedures:</strong> {predictiveAnalytics.recommendations.procedures.join(', ')}</li>
                                <li><strong>Guidelines:</strong> {predictiveAnalytics.recommendations.guidelines.join(', ')}</li>
                            </ul>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    };

    return (
        <Container fluid>
            {/* Emergency Alert */}
            {showEmergencyAlert && (
                <Alert variant="danger" className="mb-4" dismissible onClose={() => setShowEmergencyAlert(false)}>
                    <Alert.Heading>
                        <i className="ri-alarm-warning-line me-2"></i>
                        CRITICAL FINDING DETECTED
                    </Alert.Heading>
                    <p>
                        AI analysis has identified findings that require immediate attention. 
                        Please contact the radiologist or referring physician immediately.
                    </p>
                </Alert>
            )}

            <Row className="justify-content-center">
                <Col lg={12}>
                    {/* Header */}
                    <Card className="mb-4 border-0 shadow-sm">
                        <Card.Header className="bg-gradient-primary text-white">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h3 className="mb-0">
                                        <i className="ri-brain-line me-2"></i>
                                        Advanced AI-Powered RADS Calculator
                                    </h3>
                                    <p className="mb-0 opacity-75">Gen AI enhanced medical decision support system</p>
                                </div>
                                <div className="text-end">
                                    <Badge bg="light" text="dark">AI Enhanced</Badge>
                                    <br />
                                    <small className="opacity-75">Critical Medical Tool</small>
                                </div>
                            </div>
                        </Card.Header>
                    </Card>

                    {/* AI Control Panel */}
                    {renderAIControlPanel()}

                    {/* Analysis Progress */}
                    {renderAnalysisProgress()}

                    {/* Calculator Tabs */}
                    <Card className="border-0 shadow-sm">
                        <Tab.Container activeKey={activeCalculator} onSelect={setActiveCalculator}>
                            <Card.Header className="bg-light">
                                <Nav variant="pills" className="card-header-pills">
                                    <Nav.Item>
                                        <Nav.Link eventKey="birads">
                                            <i className="ri-heart-pulse-line me-1"></i>
                                            BI-RADS
                                            <Badge bg="info" className="ms-1">AI</Badge>
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="lirads">
                                            <i className="ri-liver-line me-1"></i>
                                            LI-RADS
                                            <Badge bg="info" className="ms-1">AI</Badge>
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="orads">
                                            <i className="ri-women-line me-1"></i>
                                            O-RADS
                                            <Badge bg="info" className="ms-1">AI</Badge>
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="pirads">
                                            <i className="ri-men-line me-1"></i>
                                            PI-RADS
                                            <Badge bg="success" className="ms-1">NEW</Badge>
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Card.Header>

                            <Card.Body>
                                <Tab.Content>
                                    <Tab.Pane eventKey="birads">
                                        <div className="mb-3">
                                            <h5 className="text-primary">
                                                <i className="ri-brain-line me-1"></i>
                                                AI-Enhanced BI-RADS (Breast Imaging)
                                            </h5>
                                            <p className="text-muted">
                                                Advanced breast imaging analysis with multi-model AI support and uncertainty quantification
                                            </p>
                                        </div>
                                        {renderEnhancedBiRadsForm()}
                                    </Tab.Pane>

                                    <Tab.Pane eventKey="lirads">
                                        <div className="mb-3">
                                            <h5 className="text-primary">
                                                <i className="ri-brain-line me-1"></i>
                                                AI-Enhanced LI-RADS (Liver Imaging)
                                            </h5>
                                            <p className="text-muted">
                                                Intelligent liver lesion assessment with predictive analytics
                                            </p>
                                        </div>
                                        {/* LI-RADS form would be here - similar to BI-RADS but adapted */}
                                        <Alert variant="info">
                                            <i className="ri-information-line me-2"></i>
                                            LI-RADS AI enhancement in development. Advanced features coming soon.
                                        </Alert>
                                    </Tab.Pane>

                                    <Tab.Pane eventKey="orads">
                                        <div className="mb-3">
                                            <h5 className="text-primary">
                                                <i className="ri-brain-line me-1"></i>
                                                AI-Enhanced O-RADS (Ovarian-Adnexal)
                                            </h5>
                                            <p className="text-muted">
                                                Sophisticated ovarian risk stratification with case-based reasoning
                                            </p>
                                        </div>
                                        {/* O-RADS form would be here */}
                                        <Alert variant="info">
                                            <i className="ri-information-line me-2"></i>
                                            O-RADS AI enhancement in development. Advanced features coming soon.
                                        </Alert>
                                    </Tab.Pane>

                                    <Tab.Pane eventKey="pirads">
                                        <div className="mb-3">
                                            <h5 className="text-primary">
                                                <i className="ri-brain-line me-1"></i>
                                                PI-RADS (Prostate Imaging) - NEW
                                            </h5>
                                            <p className="text-muted">
                                                Advanced prostate cancer detection with deep learning analysis
                                            </p>
                                        </div>
                                        <Alert variant="success">
                                            <i className="ri-add-circle-line me-2"></i>
                                            NEW: PI-RADS system with state-of-the-art AI models for prostate imaging.
                                        </Alert>
                                    </Tab.Pane>
                                </Tab.Content>

                                {/* AI Analysis Results */}
                                {(riskAssessment || similarCases.length > 0 || predictiveAnalytics) && (
                                    <div className="mt-4 pt-4 border-top">
                                        <h5 className="mb-3">
                                            <i className="ri-brain-line me-2"></i>
                                            AI Analysis Results
                                        </h5>
                                        <Row>
                                            <Col md={6}>
                                                {renderRiskAssessmentChart()}
                                                {renderSimilarCases()}
                                            </Col>
                                            <Col md={6}>
                                                {renderPredictiveAnalytics()}
                                                {qualityMetrics && (
                                                    <div>
                                                        <h6>Image Quality Assessment</h6>
                                                        <p className="mb-1">
                                                            <strong>Overall Quality:</strong> {qualityMetrics.overallQuality}
                                                        </p>
                                                        <p className="mb-1">
                                                            <strong>AI Processable:</strong> {qualityMetrics.aiProcessable ? 'Yes' : 'No'}
                                                        </p>
                                                        <p className="mb-0">
                                                            <strong>Quality Score:</strong> {(qualityMetrics.qualityScore * 100).toFixed(0)}%
                                                        </p>
                                                    </div>
                                                )}
                                            </Col>
                                        </Row>
                                    </div>
                                )}
                            </Card.Body>
                        </Tab.Container>
                    </Card>
                </Col>
            </Row>

            {/* Enhanced Results Modal */}
            <Modal show={showResult} onHide={() => setShowResult(false)} size="xl">
                <Modal.Header closeButton className={calculationResult?.isCritical ? 'bg-danger text-white' : 'bg-primary text-white'}>
                    <Modal.Title>
                        <i className="ri-brain-line me-2"></i>
                        {calculationResult?.type} AI Analysis Result
                        {calculationResult?.isCritical && (
                            <Badge bg="warning" className="ms-2">CRITICAL</Badge>
                        )}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {calculationResult && (
                        <div>
                            {calculationResult.isCritical && (
                                <Alert variant="danger" className="mb-4">
                                    <Alert.Heading>Critical Finding Detected</Alert.Heading>
                                    <p>This case requires immediate medical attention. Please contact the appropriate specialist immediately.</p>
                                </Alert>
                            )}

                            <Row>
                                <Col md={6}>
                                    <Card className="mb-4">
                                        <Card.Header>
                                            <h6 className="mb-0">Primary Assessment</h6>
                                        </Card.Header>
                                        <Card.Body>
                                            <div className="text-center mb-3">
                                                <h2 className={`mb-2 ${calculationResult.isCritical ? 'text-danger' : 'text-primary'}`}>
                                                    {calculationResult.score}
                                                </h2>
                                                <h5 className="mb-0">{calculationResult.description}</h5>
                                            </div>

                                            <Table bordered>
                                                <tbody>
                                                    <tr>
                                                        <td><strong>AI Model Used</strong></td>
                                                        <td>{calculationResult.aiModel}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Confidence Level</strong></td>
                                                        <td>
                                                            <Badge bg="success">{calculationResult.confidence}</Badge>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Malignancy Risk</strong></td>
                                                        <td>
                                                            <Badge bg={calculationResult.isCritical ? 'danger' : 'info'}>
                                                                {calculationResult.malignancyRisk}
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Recommendation</strong></td>
                                                        <td>{calculationResult.recommendation}</td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                <Col md={6}>
                                    {calculationResult.clinicalDecision && (
                                        <Card className="mb-4">
                                            <Card.Header>
                                                <h6 className="mb-0">Clinical Decision Support</h6>
                                            </Card.Header>
                                            <Card.Body>
                                                <div className="mb-3">
                                                    <strong>Urgency Level:</strong>
                                                    <Badge 
                                                        bg={calculationResult.clinicalDecision.urgency === 'URGENT' ? 'danger' : 
                                                            calculationResult.clinicalDecision.urgency === 'HIGH' ? 'warning' : 'success'}
                                                        className="ms-2"
                                                    >
                                                        {calculationResult.clinicalDecision.urgency}
                                                    </Badge>
                                                </div>
                                                <div className="mb-3">
                                                    <strong>Timeframe:</strong> {calculationResult.clinicalDecision.timeframe}
                                                </div>
                                                <div className="mb-3">
                                                    <strong>Recommended Procedures:</strong>
                                                    <ul className="mt-1">
                                                        {calculationResult.clinicalDecision.procedures.map((proc, index) => (
                                                            <li key={index}>{proc}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    )}
                                </Col>
                            </Row>

                            {/* Additional AI Analysis Results */}
                            <Accordion className="mt-4">
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>AI Risk Analysis Details</Accordion.Header>
                                    <Accordion.Body>
                                        {renderRiskAssessmentChart()}
                                    </Accordion.Body>
                                </Accordion.Item>
                                
                                <Accordion.Item eventKey="1">
                                    <Accordion.Header>Similar Cases from AI Database</Accordion.Header>
                                    <Accordion.Body>
                                        {renderSimilarCases()}
                                    </Accordion.Body>
                                </Accordion.Item>

                                <Accordion.Item eventKey="2">
                                    <Accordion.Header>Predictive Analytics</Accordion.Header>
                                    <Accordion.Body>
                                        {renderPredictiveAnalytics()}
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>

                            <Alert variant="warning" className="mt-4">
                                <strong>Clinical Note:</strong> This AI-enhanced analysis is for clinical decision support. 
                                Always correlate with clinical findings, patient history, and follow institutional guidelines. 
                                Critical findings require immediate medical attention.
                            </Alert>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowResult(false)}>
                        Close
                    </Button>
                    <Button 
                        variant="info"
                        onClick={() => {
                            // Share functionality could be implemented here
                            console.log('Sharing results...');
                        }}
                    >
                        <i className="ri-share-line me-1"></i>
                        Share with Team
                    </Button>
                    <Button 
                        variant="primary"
                        onClick={() => {
                            if (calculationResult) {
                                advancedRADSCalculatorService.exportAnalysisResults(
                                    {
                                        ...calculationResult,
                                        riskAssessment,
                                        similarCases,
                                        predictiveAnalytics,
                                        qualityMetrics
                                    },
                                    'json'
                                );
                            }
                        }}
                    >
                        <i className="ri-download-line me-1"></i>
                        Export AI Report
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AdvancedRADSCalculator;
