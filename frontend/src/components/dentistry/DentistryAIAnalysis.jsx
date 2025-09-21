import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Spinner,
  Badge,
  Modal,
  ProgressBar,
  Tabs,
  Tab,
  Table,
  Accordion,
  ButtonGroup,
  Dropdown
} from 'react-bootstrap';

const DentistryAIAnalysis = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const cameraRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [analysisType, setAnalysisType] = useState('comprehensive');
  const [analysisHistory, setAnalysisHistory] = useState([]);
  
  // Enhanced Generative AI Features
  const [showAIChat, setShowAIChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [generate3DModel, setGenerate3DModel] = useState(false);
  const [aiTreatmentPlan, setAiTreatmentPlan] = useState(null);
  const [patientEducationContent, setPatientEducationContent] = useState(null);
  const [riskPrediction, setRiskPrediction] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);

  // Enhanced Analysis type options with Generative AI
  const analysisTypes = [
    { value: 'comprehensive', label: 'Comprehensive AI Analysis', icon: 'ri-stethoscope-line', description: 'Full oral health assessment with AI insights' },
    { value: 'cavity_detection', label: 'AI Cavity Detection', icon: 'ri-search-line', description: 'Deep learning caries identification' },
    { value: 'periodontal_assessment', label: 'Periodontal AI Assessment', icon: 'ri-flask-line', description: 'AI-powered gum health evaluation' },
    { value: 'orthodontic_analysis', label: 'Orthodontic AI Analysis', icon: 'ri-tooth-line', description: 'AI bite and alignment assessment' },
    { value: 'oral_cancer_screening', label: '🚨 AI Cancer Detection', icon: 'ri-error-warning-line', description: 'Advanced cancer cell detection with instant alerts', priority: true },
    { value: 'xray_analysis', label: 'AI X-ray Analysis', icon: 'ri-scan-line', description: 'AI radiographic interpretation' },
    { value: 'generative_treatment', label: 'AI Treatment Planning', icon: 'ri-robot-line', description: 'Generative AI treatment recommendations' },
    { value: 'predictive_modeling', label: 'Predictive AI Modeling', icon: 'ri-line-chart-line', description: 'Future outcome predictions' },
    { value: '3d_reconstruction', label: '3D AI Reconstruction', icon: 'ri-3d-view-line', description: 'Generate 3D models from 2D images' }
  ];

  // Mock AI Analysis Engine for Dentistry
  const mockDentalAIAnalysis = async (imageData, analysisType) => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 3500));
    
    const baseAnalysis = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      analysis_type: analysisType,
      image_quality: 'excellent',
      processing_time: '3.2s',
      model_version: 'DentalAI-v2.0'
    };

    switch (analysisType) {
      case 'comprehensive':
        return {
          ...baseAnalysis,
          overall_oral_health: 'good',
          detected_issues: [
            {
              type: 'Dental Caries',
              location: 'Tooth #14 (Mesial surface)',
              severity: 'moderate',
              confidence: 0.87,
              recommendation: 'Composite restoration recommended'
            },
            {
              type: 'Gingivitis',
              location: 'Posterior region',
              severity: 'mild',
              confidence: 0.73,
              recommendation: 'Improved oral hygiene and professional cleaning'
            }
          ],
          risk_assessment: {
            cavity_risk: 'moderate',
            gum_disease_risk: 'low',
            tooth_loss_risk: 'low',
            overall_score: 7.2
          },
          recommendations: [
            'Schedule filling appointment within 2 weeks',
            'Improve brushing technique in posterior areas',
            'Consider fluoride rinse',
            'Return for cleaning in 6 months'
          ]
        };
      
      case 'cavity_detection':
        return {
          ...baseAnalysis,
          cavities_detected: 2,
          cavity_details: [
            {
              tooth_number: 14,
              surface: 'Mesial',
              size: 'medium',
              depth: 'enamel-dentin junction',
              confidence: 0.91,
              urgency: 'moderate'
            },
            {
              tooth_number: 30,
              surface: 'Occlusal',
              size: 'small',
              depth: 'enamel',
              confidence: 0.78,
              urgency: 'low'
            }
          ],
          prevention_recommendations: [
            'Increase fluoride exposure',
            'Reduce sugar intake between meals',
            'Consider dental sealants for molars',
            'Use xylitol-containing products'
          ]
        };
      
      case 'periodontal_assessment':
        return {
          ...baseAnalysis,
          periodontal_status: 'mild gingivitis',
          bone_loss_detected: false,
          pocket_depths: {
            'anterior': '2-3mm',
            'posterior': '3-4mm'
          },
          bleeding_points: 15,
          plaque_score: 2.3,
          treatment_recommendations: [
            'Professional cleaning',
            'Oral hygiene instruction',
            'Antimicrobial rinse',
            'Re-evaluation in 6 weeks'
          ]
        };
      
      case 'orthodontic_analysis':
        return {
          ...baseAnalysis,
          malocclusion_type: 'Class I with crowding',
          crowding_severity: 'moderate',
          measurements: {
            overjet: '3.5mm',
            overbite: '2.8mm',
            arch_length_discrepancy: '-4.2mm'
          },
          treatment_options: [
            'Clear aligner therapy (18-24 months)',
            'Traditional braces (15-20 months)',
            'Limited orthodontic treatment'
          ],
          estimated_duration: '18-24 months'
        };
      
      case 'oral_cancer_screening':
        return {
          ...baseAnalysis,
          risk_level: 'low',
          suspicious_areas: 0,
          screening_results: {
            tissue_abnormalities: 'none detected',
            asymmetries: 'none',
            color_changes: 'normal variation'
          },
          recommendations: [
            'Routine annual screening',
            'Continue tobacco cessation if applicable',
            'Maintain good oral hygiene',
            'Regular self-examination'
          ],
          next_screening: '12 months'
        };
      
      case 'xray_analysis':
        return {
          ...baseAnalysis,
          xray_findings: {
            bone_levels: 'normal',
            root_morphology: 'normal',
            pathology_detected: false,
            restorations_present: true
          },
          detected_conditions: [
            'Existing amalgam restoration - Tooth #18',
            'Root canal treated - Tooth #19'
          ],
          recommendations: [
            'Monitor existing restorations',
            'Consider replacement of large amalgam',
            'Routine follow-up radiographs in 2 years'
          ]
        };
      
      default:
        return baseAnalysis;
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setError('Please select an image file');
      }
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' 
        } 
      });
      setCameraStream(stream);
      setShowCamera(true);
      
      if (cameraRef.current) {
        cameraRef.current.srcObject = stream;
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions.');
    }
  };

  const capturePhoto = () => {
    if (cameraRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = cameraRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        const file = new File([blob], 'dental-image.jpg', { type: 'image/jpeg' });
        setSelectedFile(file);
        setPreview(canvas.toDataURL());
        stopCamera();
      }, 'image/jpeg', 0.9);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  };

  const analyzeImage = async () => {
    if (!selectedFile && !preview) {
      setError('Please select or capture an image first');
      return;
    }

    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    if (!token) {
      setError('Please log in to use AI analysis features');
      setTimeout(() => navigate('/auth/sign-in'), 2000);
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      // Mock AI analysis
      const result = await mockDentalAIAnalysis(preview, analysisType);
      setAnalysisResult(result);
      
      // Add to history
      setAnalysisHistory(prev => [result, ...prev.slice(0, 9)]);
      
    } catch (err) {
      setError('Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const getAnalysisTypeInfo = (type) => {
    return analysisTypes.find(t => t.value === type) || analysisTypes[0];
  };

  const getSeverityBadge = (severity) => {
    const variants = {
      low: 'success',
      mild: 'success',
      moderate: 'warning',
      medium: 'warning',
      high: 'danger',
      severe: 'danger'
    };
    return variants[severity] || 'secondary';
  };

  // Enhanced Generative AI Functions
  const generateAITreatmentPlan = async (analysisResult) => {
    if (!analysisResult) return;
    
    setAnalyzing(true);
    try {
      // Simulate AI treatment plan generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const treatmentPlan = {
        id: Date.now(),
        patient_profile: 'Based on analysis findings',
        treatment_phases: [
          {
            phase: 1,
            title: 'Immediate Care',
            duration: '2-4 weeks',
            procedures: [
              'Composite restoration for tooth #14',
              'Professional cleaning and scaling',
              'Fluoride treatment application'
            ],
            cost_estimate: '$800 - $1,200',
            urgency: 'high'
          },
          {
            phase: 2,
            title: 'Preventive Care',
            duration: '6 months',
            procedures: [
              'Regular hygiene maintenance',
              'Oral hygiene education',
              'Dietary counseling'
            ],
            cost_estimate: '$200 - $400',
            urgency: 'low'
          }
        ],
        alternative_treatments: [
          'Conservative monitoring with enhanced hygiene',
          'Minimally invasive dentistry approach',
          'Full mouth reconstruction (if multiple issues)'
        ],
        success_probability: '95%',
        generated_by: 'DentalAI GPT-4 Treatment Planner'
      };
      
      setAiTreatmentPlan(treatmentPlan);
    } catch (err) {
      setError('Failed to generate AI treatment plan');
    } finally {
      setAnalyzing(false);
    }
  };

  const generatePatientEducation = async (analysisResult) => {
    if (!analysisResult) return;
    
    try {
      // Simulate AI-generated patient education content
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const educationContent = {
        condition_explained: {
          title: 'Understanding Your Condition',
          content: 'Based on your dental analysis, we\'ve identified some areas that need attention. Dental caries (cavities) are caused by bacteria that produce acid, which dissolves tooth enamel over time.',
          visual_aids: ['tooth_anatomy.svg', 'cavity_formation.gif'],
          difficulty_level: 'simple'
        },
        prevention_tips: [
          'Brush twice daily with fluoride toothpaste',
          'Floss daily to remove plaque between teeth',
          'Limit sugary and acidic foods and drinks',
          'Use antimicrobial mouthwash',
          'Chew sugar-free gum after meals'
        ],
        treatment_explanation: {
          procedure: 'Composite Restoration',
          steps: [
            'Local anesthesia for comfort',
            'Removal of decayed tooth material',
            'Cleaning and preparation of cavity',
            'Application of composite filling material',
            'Shaping and polishing for natural appearance'
          ],
          recovery_time: '24-48 hours',
          post_care: 'Avoid hard foods for 24 hours, normal brushing after numbness wears off'
        },
        generated_by: 'DentalAI Patient Education Generator'
      };
      
      setPatientEducationContent(educationContent);
    } catch (err) {
      setError('Failed to generate patient education content');
    }
  };

  const generateRiskPrediction = async (analysisResult) => {
    if (!analysisResult) return;
    
    try {
      // Simulate AI risk prediction modeling
      await new Promise(resolve => setTimeout(resolve, 1800));
      
      const riskPrediction = {
        predictive_timeline: {
          '6_months': {
            cavity_progression: 'low risk (15%)',
            gum_disease: 'low risk (8%)',
            tooth_loss: 'very low risk (2%)'
          },
          '1_year': {
            cavity_progression: 'moderate risk (35%)',
            gum_disease: 'low risk (18%)',
            tooth_loss: 'low risk (5%)'
          },
          '5_years': {
            cavity_progression: 'high risk (75%)',
            gum_disease: 'moderate risk (45%)',
            tooth_loss: 'moderate risk (25%)'
          }
        },
        intervention_impact: {
          with_treatment: 'Risk reduced by 90% across all categories',
          without_treatment: 'Progressive deterioration likely',
          lifestyle_changes: 'Additional 40% risk reduction possible'
        },
        ai_confidence: '92%',
        model_used: 'DentalAI Predictive Risk Model v3.2'
      };
      
      setRiskPrediction(riskPrediction);
    } catch (err) {
      setError('Failed to generate risk prediction');
    }
  };

  const handleAIChat = async (message) => {
    if (!message.trim()) return;
    
    const userMessage = { type: 'user', content: message, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    
    try {
      // Simulate AI chat response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiResponse = {
        type: 'ai',
        content: `Based on your dental analysis, I can help explain your condition. ${message.includes('pain') ? 'Pain can be managed with over-the-counter pain relievers until your appointment.' : 'The recommended treatment will help prevent further complications.'} Would you like me to explain the treatment process in more detail?`,
        timestamp: new Date(),
        suggestions: [
          'Explain the treatment process',
          'What are the costs involved?',
          'How long will recovery take?',
          'Are there alternative treatments?'
        ]
      };
      
      setChatMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      const errorMessage = { type: 'ai', content: 'Sorry, I encountered an error. Please try again.', timestamp: new Date() };
      setChatMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <Container fluid className="mt-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>
                <i className="ri-brain-line me-2 text-primary"></i>
                Dental AI Analysis
              </h2>
              <p className="text-muted mb-0">
                Advanced dental diagnosis powered by generative AI technology
              </p>
            </div>
            <div className="d-flex gap-2">
              <Badge bg="info" className="px-3 py-2">
                <i className="ri-robot-line me-2"></i>
                DentalAI v2.0
              </Badge>
              <Badge bg="success" className="px-3 py-2">
                <i className="ri-award-line me-2"></i>
                Certified
              </Badge>
            </div>
          </div>
        </Col>
      </Row>

      {/* Error Alert */}
      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="warning" dismissible onClose={() => setError(null)}>
              <Alert.Heading>
                <i className="ri-error-warning-line me-2"></i>
                Attention Required
              </Alert.Heading>
              <p>{error}</p>
              {error.includes('log in') && (
                <>
                  <hr />
                  <div className="d-flex justify-content-center gap-3">
                    <Button variant="primary" href="/auth/sign-in">
                      <i className="ri-login-box-line me-2"></i>
                      Go to Login
                    </Button>
                  </div>
                  <hr />
                  <small className="text-muted text-center d-block">
                    <strong>Default Login Credentials:</strong><br />
                    📧 Email: <code>info@xerxez.in</code><br />
                    🔑 Password: <code>admin123</code>
                  </small>
                </>
              )}
            </Alert>
          </Col>
        </Row>
      )}

      <Row>
        {/* Image Input and Analysis Type Selection */}
        <Col lg={6} className="mb-4">
          <Card className="h-100">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="ri-upload-line me-2"></i>
                  Image Input & Analysis Type
                </h5>
                <Dropdown as={ButtonGroup}>
                  <Button variant="outline-primary" size="sm">
                    <i className="ri-settings-line me-2"></i>
                    {getAnalysisTypeInfo(analysisType).label}
                  </Button>
                  <Dropdown.Toggle split variant="outline-primary" size="sm" />
                  <Dropdown.Menu>
                    {analysisTypes.map(type => (
                      <Dropdown.Item
                        key={type.value}
                        active={analysisType === type.value}
                        onClick={() => setAnalysisType(type.value)}
                      >
                        <i className={`${type.icon} me-2`}></i>
                        <div>
                          <strong>{type.label}</strong>
                          <br />
                          <small className="text-muted">{type.description}</small>
                        </div>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Card.Header>
            <Card.Body>
              <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-3">
                <Tab eventKey="upload" title={<><i className="ri-upload-line me-2"></i>Upload</>}>
                  <div
                    className="upload-area border-2 border-dashed rounded p-4 text-center"
                    style={{ minHeight: '200px', cursor: 'pointer' }}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {preview ? (
                      <div>
                        <img
                          src={preview}
                          alt="Preview"
                          className="img-fluid rounded mb-3"
                          style={{ maxHeight: '300px' }}
                        />
                        <p className="text-muted">Click to change image</p>
                      </div>
                    ) : (
                      <div className="d-flex flex-column align-items-center">
                        <i className="ri-upload-line text-muted mb-3" style={{fontSize: '48px'}}></i>
                        <h6>Drop dental image here or click to browse</h6>
                        <p className="text-muted">Supports: X-rays, intraoral photos, CBCT scans</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                </Tab>
                <Tab eventKey="camera" title={<><i className="ri-camera-line me-2"></i>Camera</>}>
                  <div className="text-center">
                    {!showCamera ? (
                      <div>
                        <i className="ri-camera-line text-muted mb-3" style={{fontSize: '48px'}}></i>
                        <p>Use your device camera to capture dental images</p>
                        <Button variant="primary" onClick={startCamera}>
                          <i className="ri-camera-line me-2"></i>
                          Start Camera
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <video
                          ref={cameraRef}
                          autoPlay
                          playsInline
                          className="img-fluid rounded mb-3"
                          style={{ maxWidth: '100%', maxHeight: '300px' }}
                        />
                        <div className="d-flex justify-content-center gap-2">
                          <Button variant="success" onClick={capturePhoto}>
                            <i className="ri-camera-line me-2"></i>
                            Capture
                          </Button>
                          <Button variant="secondary" onClick={stopCamera}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                  </div>
                </Tab>
              </Tabs>

              {/* Analysis Type Info */}
              <Alert variant="info" className="mb-3">
                <div className="d-flex align-items-center">
                  <i className={`${getAnalysisTypeInfo(analysisType).icon} me-2`}></i>
                  <div>
                    <strong>{getAnalysisTypeInfo(analysisType).label}</strong>
                    <br />
                    <small>{getAnalysisTypeInfo(analysisType).description}</small>
                  </div>
                </div>
              </Alert>

              <div className="d-grid">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={analyzeImage}
                  disabled={analyzing || (!selectedFile && !preview)}
                >
                  {analyzing ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <i className="ri-brain-line me-2"></i>
                      Start AI Analysis
                    </>
                  )}
                </Button>
              </div>

              {/* Enhanced Generative AI Features */}
              {analysisResult && (
                <div className="mt-3">
                  <h6 className="mb-2">
                    <i className="ri-robot-line me-2 text-info"></i>
                    Generative AI Features
                  </h6>
                  <Row className="g-2">
                    <Col sm={6}>
                      <Button
                        variant="outline-info"
                        size="sm"
                        className="w-100"
                        onClick={() => generateAITreatmentPlan(analysisResult)}
                        disabled={analyzing}
                      >
                        <i className="ri-file-list-line me-1"></i>
                        AI Treatment Plan
                      </Button>
                    </Col>
                    <Col sm={6}>
                      <Button
                        variant="outline-warning"
                        size="sm"
                        className="w-100"
                        onClick={() => generatePatientEducation(analysisResult)}
                        disabled={analyzing}
                      >
                        <i className="ri-graduation-cap-line me-1"></i>
                        Patient Education
                      </Button>
                    </Col>
                    <Col sm={6}>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="w-100"
                        onClick={() => generateRiskPrediction(analysisResult)}
                        disabled={analyzing}
                      >
                        <i className="ri-line-chart-line me-1"></i>
                        Risk Prediction
                      </Button>
                    </Col>
                    <Col sm={6}>
                      <Button
                        variant="outline-success"
                        size="sm"
                        className="w-100"
                        onClick={() => setShowAIChat(!showAIChat)}
                      >
                        <i className="ri-chat-4-line me-1"></i>
                        AI Assistant
                      </Button>
                    </Col>
                  </Row>
                </div>
              )}

              {analyzing && (
                <div className="mt-3">
                  <ProgressBar animated now={100} className="mb-2" />
                  <small className="text-muted">
                    AI is analyzing the dental image using advanced deep learning models...
                  </small>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Analysis Results */}
        <Col lg={6}>
          {analysisResult ? (
            <Card className="h-100">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="ri-line-chart-line me-2"></i>
                  Analysis Results
                </h5>
                <div className="d-flex gap-2">
                  <Button variant="outline-success" size="sm">
                    <i className="ri-save-line me-1"></i>
                    Save
                  </Button>
                  <Button variant="outline-primary" size="sm">
                    <i className="ri-share-line me-1"></i>
                    Share
                  </Button>
                  <Button variant="outline-secondary" size="sm">
                    <i className="ri-download-line me-1"></i>
                    Export
                  </Button>
                </div>
              </Card.Header>
              <Card.Body style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {/* Analysis Type Display */}
                <div className="mb-3">
                  <Badge bg="primary" className="me-2">
                    {getAnalysisTypeInfo(analysisResult.analysis_type).label}
                  </Badge>
                  <Badge bg="success">
                    Quality: {analysisResult.image_quality}
                  </Badge>
                </div>

                {/* Comprehensive Analysis Results */}
                {analysisResult.analysis_type === 'comprehensive' && (
                  <div>
                    <Alert variant={analysisResult.overall_oral_health === 'excellent' ? 'success' : 
                                   analysisResult.overall_oral_health === 'good' ? 'info' : 'warning'}>
                      <strong>Overall Oral Health: </strong>
                      {analysisResult.overall_oral_health.toUpperCase()}
                    </Alert>

                    {analysisResult.detected_issues && (
                      <div className="mb-4">
                        <h6>Detected Issues:</h6>
                        {analysisResult.detected_issues.map((issue, index) => (
                          <Card key={index} className="mb-2">
                            <Card.Body className="py-2">
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <strong>{issue.type}</strong>
                                  <br />
                                  <small className="text-muted">{issue.location}</small>
                                </div>
                                <div className="text-end">
                                  <Badge bg={getSeverityBadge(issue.severity)}>
                                    {issue.severity}
                                  </Badge>
                                  <br />
                                  <small className="text-muted">{(issue.confidence * 100).toFixed(1)}% confident</small>
                                </div>
                              </div>
                              <p className="mb-0 mt-2 small">{issue.recommendation}</p>
                            </Card.Body>
                          </Card>
                        ))}
                      </div>
                    )}

                    {analysisResult.risk_assessment && (
                      <div className="mb-4">
                        <h6>Risk Assessment:</h6>
                        <Row>
                          <Col sm={6}>
                            <div className="text-center p-2 border rounded mb-2">
                              <div className="fw-bold">Cavity Risk</div>
                              <Badge bg={getSeverityBadge(analysisResult.risk_assessment.cavity_risk)}>
                                {analysisResult.risk_assessment.cavity_risk}
                              </Badge>
                            </div>
                          </Col>
                          <Col sm={6}>
                            <div className="text-center p-2 border rounded mb-2">
                              <div className="fw-bold">Overall Score</div>
                              <div className="h5 mb-0">{analysisResult.risk_assessment.overall_score}/10</div>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    )}
                  </div>
                )}

                {/* Cavity Detection Results */}
                {analysisResult.analysis_type === 'cavity_detection' && (
                  <div>
                    <Alert variant={analysisResult.cavities_detected === 0 ? 'success' : 'warning'}>
                      <strong>Cavities Detected: </strong>
                      {analysisResult.cavities_detected}
                    </Alert>

                    {analysisResult.cavity_details && analysisResult.cavity_details.length > 0 && (
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>Tooth</th>
                            <th>Surface</th>
                            <th>Size</th>
                            <th>Urgency</th>
                            <th>Confidence</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analysisResult.cavity_details.map((cavity, index) => (
                            <tr key={index}>
                              <td>#{cavity.tooth_number}</td>
                              <td>{cavity.surface}</td>
                              <td>
                                <Badge bg={getSeverityBadge(cavity.size)}>
                                  {cavity.size}
                                </Badge>
                              </td>
                              <td>
                                <Badge bg={getSeverityBadge(cavity.urgency)}>
                                  {cavity.urgency}
                                </Badge>
                              </td>
                              <td>{(cavity.confidence * 100).toFixed(1)}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </div>
                )}

                {/* Recommendations */}
                {analysisResult.recommendations && (
                  <div className="mb-4">
                    <h6>
                      <i className="ri-lightbulb-line me-2 text-warning"></i>
                      AI Recommendations:
                    </h6>
                    <ul>
                      {analysisResult.recommendations.map((rec, index) => (
                        <li key={index} className="mb-1">{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technical Details */}
                <div className="border-top pt-3">
                  <h6>Technical Details:</h6>
                  <Row className="text-small">
                    <Col sm={6}>
                      <strong>Model:</strong> {analysisResult.model_version}
                    </Col>
                    <Col sm={6}>
                      <strong>Processing:</strong> {analysisResult.processing_time}
                    </Col>
                  </Row>
                </div>
              </Card.Body>
            </Card>
          ) : (
            <Card className="h-100 d-flex align-items-center justify-content-center">
              <Card.Body className="text-center">
                <i className="ri-brain-line text-muted mb-3" style={{fontSize: '64px'}}></i>
                <h5>AI Analysis Ready</h5>
                <p className="text-muted">
                  Upload or capture a dental image to start AI-powered analysis
                </p>
                <div className="mt-4">
                  <h6>Supported Analysis Types:</h6>
                  <Row>
                    {analysisTypes.slice(0, 4).map((type, index) => (
                      <Col key={index} sm={6} className="mb-2">
                        <div className="d-flex align-items-center">
                          <i className={`${type.icon} text-primary me-2`}></i>
                          <small>{type.label}</small>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {/* Enhanced Generative AI Content Sections */}
      {aiTreatmentPlan && (
        <Row className="mt-4">
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0">
                  <i className="ri-robot-line me-2 text-info"></i>
                  AI-Generated Treatment Plan
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={8}>
                    <h6>Treatment Phases:</h6>
                    {aiTreatmentPlan.treatment_phases.map((phase, index) => (
                      <Card key={index} className="mb-3 border-start border-4 border-info">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="text-info">Phase {phase.phase}: {phase.title}</h6>
                              <Badge bg={phase.urgency === 'high' ? 'danger' : 'info'} className="mb-2">
                                {phase.urgency} priority
                              </Badge>
                              <ul className="mb-2">
                                {phase.procedures.map((procedure, i) => (
                                  <li key={i}>{procedure}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="text-end">
                              <small className="text-muted">Duration: {phase.duration}</small>
                              <div className="fw-bold text-success">{phase.cost_estimate}</div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    ))}
                  </Col>
                  <Col md={4}>
                    <div className="bg-light p-3 rounded">
                      <h6>Success Probability</h6>
                      <div className="display-6 text-success">{aiTreatmentPlan.success_probability}</div>
                      <hr />
                      <h6>Alternative Options:</h6>
                      <ul className="small">
                        {aiTreatmentPlan.alternative_treatments.map((alt, i) => (
                          <li key={i}>{alt}</li>
                        ))}
                      </ul>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Patient Education Content */}
      {patientEducationContent && (
        <Row className="mt-4">
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0">
                  <i className="ri-graduation-cap-line me-2 text-warning"></i>
                  AI-Generated Patient Education
                </h5>
              </Card.Header>
              <Card.Body>
                <Tabs defaultActiveKey="explanation">
                  <Tab eventKey="explanation" title="Understanding Your Condition">
                    <div className="mt-3">
                      <h6>{patientEducationContent.condition_explained.title}</h6>
                      <p>{patientEducationContent.condition_explained.content}</p>
                    </div>
                  </Tab>
                  <Tab eventKey="prevention" title="Prevention Tips">
                    <div className="mt-3">
                      <h6>How to Prevent Future Issues:</h6>
                      <ul>
                        {patientEducationContent.prevention_tips.map((tip, i) => (
                          <li key={i} className="mb-2">{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </Tab>
                  <Tab eventKey="treatment" title="Treatment Process">
                    <div className="mt-3">
                      <h6>Your Treatment: {patientEducationContent.treatment_explanation.procedure}</h6>
                      <Alert variant="info">
                        <strong>Recovery Time:</strong> {patientEducationContent.treatment_explanation.recovery_time}
                      </Alert>
                      <ol>
                        {patientEducationContent.treatment_explanation.steps.map((step, i) => (
                          <li key={i} className="mb-1">{step}</li>
                        ))}
                      </ol>
                      <div className="bg-light p-3 rounded mt-3">
                        <strong>Post-Treatment Care:</strong> {patientEducationContent.treatment_explanation.post_care}
                      </div>
                    </div>
                  </Tab>
                </Tabs>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Risk Prediction */}
      {riskPrediction && (
        <Row className="mt-4">
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0">
                  <i className="ri-line-chart-line me-2 text-danger"></i>
                  AI Risk Prediction Model
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="text-center mb-3">
                  <Badge bg="info" className="px-3 py-2">
                    AI Confidence: {riskPrediction.ai_confidence}
                  </Badge>
                </div>
                <Row>
                  {Object.entries(riskPrediction.predictive_timeline).map(([period, risks]) => (
                    <Col key={period} md={4} className="mb-3">
                      <Card className="h-100 border-primary">
                        <Card.Header className="bg-primary text-white text-center">
                          <h6 className="mb-0">{period.replace('_', ' ').toUpperCase()}</h6>
                        </Card.Header>
                        <Card.Body>
                          <div className="mb-2">
                            <small className="text-muted">Cavity Progression:</small>
                            <div className="fw-bold text-warning">{risks.cavity_progression}</div>
                          </div>
                          <div className="mb-2">
                            <small className="text-muted">Gum Disease:</small>
                            <div className="fw-bold text-info">{risks.gum_disease}</div>
                          </div>
                          <div>
                            <small className="text-muted">Tooth Loss:</small>
                            <div className="fw-bold text-danger">{risks.tooth_loss}</div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
                <Alert variant="success" className="mt-3">
                  <strong>Good News!</strong> {riskPrediction.intervention_impact.with_treatment}
                </Alert>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* AI Chat Assistant */}
      {showAIChat && (
        <Row className="mt-4">
          <Col>
            <Card>
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="ri-chat-4-line me-2 text-success"></i>
                    AI Dental Assistant
                  </h5>
                  <Button variant="outline-secondary" size="sm" onClick={() => setShowAIChat(false)}>
                    <i className="ri-close-line"></i>
                  </Button>
                </div>
              </Card.Header>
              <Card.Body style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
                <div className="flex-grow-1 overflow-auto mb-3" style={{ maxHeight: '300px' }}>
                  {chatMessages.length === 0 ? (
                    <div className="text-center text-muted py-4">
                      <i className="ri-robot-line" style={{ fontSize: '48px' }}></i>
                      <p>Ask me anything about your dental analysis or treatment!</p>
                    </div>
                  ) : (
                    chatMessages.map((message, index) => (
                      <div key={index} className={`mb-3 d-flex ${message.type === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                        <div className={`p-3 rounded ${message.type === 'user' ? 'bg-primary text-white' : 'bg-light'}`} style={{ maxWidth: '80%' }}>
                          <div>{message.content}</div>
                          <small className="opacity-75">{message.timestamp.toLocaleTimeString()}</small>
                          {message.suggestions && (
                            <div className="mt-2">
                              {message.suggestions.map((suggestion, i) => (
                                <Button
                                  key={i}
                                  variant="outline-light"
                                  size="sm"
                                  className="me-1 mb-1"
                                  onClick={() => handleAIChat(suggestion)}
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="text"
                    placeholder="Ask about your dental analysis..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAIChat(chatInput)}
                  />
                  <Button variant="success" onClick={() => handleAIChat(chatInput)}>
                    <i className="ri-send-plane-line"></i>
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Analysis History */}
      {analysisHistory.length > 0 && (
        <Row className="mt-4">
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0">
                  <i className="ri-line-chart-line me-2"></i>
                  Recent Analyses
                </h5>
              </Card.Header>
              <Card.Body>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Analysis Type</th>
                      <th>Key Findings</th>
                      <th>Quality</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysisHistory.map((analysis) => (
                      <tr key={analysis.id}>
                        <td>{new Date(analysis.timestamp).toLocaleString()}</td>
                        <td>
                          <Badge bg="primary">
                            {getAnalysisTypeInfo(analysis.analysis_type).label}
                          </Badge>
                        </td>
                        <td>
                          {analysis.detected_issues ? 
                            `${analysis.detected_issues.length} issues detected` :
                            analysis.cavities_detected !== undefined ?
                              `${analysis.cavities_detected} cavities found` :
                              'Analysis completed'
                          }
                        </td>
                        <td>
                          <Badge bg="success">{analysis.image_quality}</Badge>
                        </td>
                        <td>
                          <ButtonGroup size="sm">
                            <Button variant="outline-primary">
                              <i className="ri-eye-line me-1"></i>
                              View
                            </Button>
                            <Button variant="outline-secondary">
                              <i className="ri-download-line me-1"></i>
                              Export
                            </Button>
                          </ButtonGroup>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default DentistryAIAnalysis;

