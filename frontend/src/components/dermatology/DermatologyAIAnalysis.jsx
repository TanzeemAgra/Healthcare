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
  Table
} from 'react-bootstrap';

const DermatologyAIAnalysis = () => {
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
  const [analysisHistory, setAnalysisHistory] = useState([]);

  // Mock AI Analysis Engine
  const mockAIAnalysis = async (imageData) => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock comprehensive dermatology AI analysis
    const conditions = [
      {
        name: 'Melanocytic Nevus (Mole)',
        confidence: 0.85,
        risk_level: 'low',
        description: 'Benign pigmented lesion with regular borders and uniform color distribution.',
        recommendations: [
          'Regular monitoring recommended',
          'Annual dermatologist check-up',
          'Sun protection advised'
        ]
      },
      {
        name: 'Seborrheic Keratosis',
        confidence: 0.12,
        risk_level: 'low',
        description: 'Non-cancerous growth with waxy, scaly appearance.',
        recommendations: [
          'Cosmetic removal available if desired',
          'No immediate medical intervention required'
        ]
      },
      {
        name: 'Atypical Nevus',
        confidence: 0.03,
        risk_level: 'medium',
        description: 'Unusual mole characteristics requiring further evaluation.',
        recommendations: [
          'Biopsy recommended for definitive diagnosis',
          'Close monitoring required',
          'Immediate dermatologist consultation'
        ]
      }
    ];

    return {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      image_analysis: {
        lesion_detected: true,
        lesion_count: 1,
        lesion_area: '4.2 mm²',
        symmetry_score: 0.78,
        border_regularity: 0.82,
        color_uniformity: 0.88,
        diameter: '3.1 mm'
      },
      ai_predictions: conditions,
      abcde_criteria: {
        asymmetry: { score: 0.22, status: 'normal', description: 'Lesion shows good symmetry' },
        border: { score: 0.18, status: 'normal', description: 'Borders are well-defined and regular' },
        color: { score: 0.12, status: 'normal', description: 'Uniform brown pigmentation' },
        diameter: { score: 0.31, status: 'normal', description: 'Diameter within normal range' },
        evolving: { score: 0.05, status: 'unknown', description: 'No historical data available' }
      },
      risk_assessment: {
        overall_risk: 'low',
        malignancy_probability: 0.05,
        follow_up_recommended: '12 months',
        urgency: 'routine'
      },
      technical_details: {
        model_version: 'DermAI-v2.1',
        processing_time: '2.84s',
        image_quality: 'excellent',
        confidence_threshold: 0.75
      }
    };
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
        const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
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
      // Mock AI analysis - in real implementation, this would send to backend
      const result = await mockAIAnalysis(preview);
      setAnalysisResult(result);
      
      // Add to history
      setAnalysisHistory(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 analyses
      
    } catch (err) {
      setError('Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const getRiskBadgeVariant = (risk) => {
    switch (risk) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'danger';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'normal': return <i className="ri-checkbox-circle-line text-success"></i>;
      case 'abnormal': return <i className="ri-close-circle-line text-danger"></i>;
      case 'unknown': return <i className="ri-information-line text-muted"></i>;
      default: return <i className="ri-information-line text-muted"></i>;
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
                AI Dermatology Analysis
              </h2>
              <p className="text-muted mb-0">
                Advanced skin lesion analysis powered by generative AI technology
              </p>
            </div>
            <Badge bg="info" className="px-3 py-2">
              <i className="ri-robot-line me-2"></i>
              DermAI v2.1
            </Badge>
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
        {/* Image Input Section */}
        <Col lg={6} className="mb-4">
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">
                <i className="ri-image-line me-2"></i>
                Image Input
              </h5>
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
                        <h6>Drop image here or click to browse</h6>
                        <p className="text-muted">Supports: JPG, PNG, JPEG (max 10MB)</p>
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
                        <p>Use your device camera to capture skin lesions</p>
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

              {analyzing && (
                <div className="mt-3">
                  <ProgressBar animated now={100} className="mb-2" />
                  <small className="text-muted">
                    AI is analyzing the image using deep learning models...
                  </small>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Analysis Results Section */}
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
                {/* AI Predictions */}
                <div className="mb-4">
                  <h6 className="border-bottom pb-2">
                    <i className="ri-robot-line me-2"></i>
                    AI Predictions
                  </h6>
                  {analysisResult.ai_predictions.map((prediction, index) => (
                    <div key={index} className="border rounded p-3 mb-2">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="mb-1">{prediction.name}</h6>
                        <Badge bg={getRiskBadgeVariant(prediction.risk_level)}>
                          {(prediction.confidence * 100).toFixed(1)}%
                        </Badge>
                      </div>
                      <p className="text-muted small mb-2">{prediction.description}</p>
                      <div>
                        <strong>Risk Level:</strong>{' '}
                        <Badge bg={getRiskBadgeVariant(prediction.risk_level)} className="me-2">
                          {prediction.risk_level.toUpperCase()}
                        </Badge>
                      </div>
                      {prediction.recommendations.length > 0 && (
                        <div className="mt-2">
                          <strong>Recommendations:</strong>
                          <ul className="mb-0 mt-1">
                            {prediction.recommendations.map((rec, i) => (
                              <li key={i} className="small">{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* ABCDE Criteria */}
                <div className="mb-4">
                  <h6 className="border-bottom pb-2">
                    <i className="ri-microscope-line me-2"></i>
                    ABCDE Criteria Analysis
                  </h6>
                  <div className="row g-2">
                    {Object.entries(analysisResult.abcde_criteria).map(([key, value]) => (
                      <div key={key} className="col-12">
                        <div className="border rounded p-2">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              {getStatusIcon(value.status)}
                              <strong className="ms-2 text-capitalize">
                                {key}: {(value.score * 100).toFixed(0)}%
                              </strong>
                            </div>
                            <Badge bg={value.status === 'normal' ? 'success' : 'warning'}>
                              {value.status}
                            </Badge>
                          </div>
                          <small className="text-muted">{value.description}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="mb-4">
                  <h6 className="border-bottom pb-2">
                    <i className="ri-stethoscope-line me-2"></i>
                    Risk Assessment
                  </h6>
                  <div className="row g-2">
                    <div className="col-6">
                      <div className="text-center p-2 border rounded">
                        <div className="fw-bold">Overall Risk</div>
                        <Badge bg={getRiskBadgeVariant(analysisResult.risk_assessment.overall_risk)} className="mt-1">
                          {analysisResult.risk_assessment.overall_risk.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-center p-2 border rounded">
                        <div className="fw-bold">Malignancy Risk</div>
                        <div className="mt-1">
                          {(analysisResult.risk_assessment.malignancy_probability * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-center p-2 border rounded">
                        <div className="fw-bold">Follow-up</div>
                        <div className="mt-1">{analysisResult.risk_assessment.follow_up_recommended}</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-center p-2 border rounded">
                        <div className="fw-bold">Urgency</div>
                        <Badge bg={analysisResult.risk_assessment.urgency === 'urgent' ? 'danger' : 'info'} className="mt-1">
                          {analysisResult.risk_assessment.urgency}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical Details */}
                <div>
                  <h6 className="border-bottom pb-2">
                    <i className="ri-eye-line me-2"></i>
                    Technical Details
                  </h6>
                  <div className="row g-2 text-small">
                    <div className="col-6">
                      <strong>Model:</strong> {analysisResult.technical_details.model_version}
                    </div>
                    <div className="col-6">
                      <strong>Processing:</strong> {analysisResult.technical_details.processing_time}
                    </div>
                    <div className="col-6">
                      <strong>Quality:</strong> {analysisResult.technical_details.image_quality}
                    </div>
                    <div className="col-6">
                      <strong>Threshold:</strong> {analysisResult.technical_details.confidence_threshold}
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ) : (
            <Card className="h-100 d-flex align-items-center justify-content-center">
              <Card.Body className="text-center">
                <i className="ri-brain-line text-muted mb-3" style={{fontSize: '64px'}}></i>
                <h5>AI Analysis Ready</h5>
                <p className="text-muted">
                  Upload or capture an image to start AI-powered dermatology analysis
                </p>
                <div className="mt-4">
                  <h6>Features:</h6>
                  <ul className="list-unstyled">
                    <li><i className="ri-checkbox-circle-line text-success me-2"></i>ABCDE Criteria Assessment</li>
                    <li><i className="ri-checkbox-circle-line text-success me-2"></i>Multi-condition Detection</li>
                    <li><i className="ri-checkbox-circle-line text-success me-2"></i>Risk Level Classification</li>
                    <li><i className="ri-checkbox-circle-line text-success me-2"></i>Clinical Recommendations</li>
                  </ul>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

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
                      <th>Top Prediction</th>
                      <th>Confidence</th>
                      <th>Risk Level</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysisHistory.map((analysis) => (
                      <tr key={analysis.id}>
                        <td>{new Date(analysis.timestamp).toLocaleString()}</td>
                        <td>{analysis.ai_predictions[0]?.name || 'N/A'}</td>
                        <td>
                          <Badge bg="info">
                            {((analysis.ai_predictions[0]?.confidence || 0) * 100).toFixed(1)}%
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={getRiskBadgeVariant(analysis.ai_predictions[0]?.risk_level || 'low')}>
                            {(analysis.ai_predictions[0]?.risk_level || 'unknown').toUpperCase()}
                          </Badge>
                        </td>
                        <td>
                          <Button variant="outline-primary" size="sm" className="me-2">
                            <i className="ri-eye-line me-1"></i>
                            View
                          </Button>
                          <Button variant="outline-secondary" size="sm">
                            <i className="ri-download-line me-1"></i>
                            Export
                          </Button>
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

export default DermatologyAIAnalysis;

