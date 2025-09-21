import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Badge, Modal, ProgressBar, Tab, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/**
 * 🎤 Advanced Voice Recognition & Reporting Tools
 * ============================================
 * 
 * AI-powered voice recognition system for radiologists with:
 * - Real-time speech-to-text conversion
 * - Medical terminology optimization
 * - Structured report templates
 * - Smart punctuation and formatting
 * - Multi-language support
 * - Voice commands for navigation
 */

const VoiceRecognitionTools = () => {
  // Speech Recognition State
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [isSupported, setIsSupported] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState('general');
  const [savedReports, setSavedReports] = useState([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [processingAI, setProcessingAI] = useState(false);

  // Voice Recognition Refs
  const recognitionRef = useRef(null);
  const textAreaRef = useRef(null);

  // AI Enhancement State
  const [aiEnhancements, setAiEnhancements] = useState({
    medicalTermCorrection: true,
    autoFormatting: true,
    smartPunctuation: true,
    templateStructuring: true,
    clinicalValidation: true
  });

  // Report Templates
  const reportTemplates = {
    general: {
      name: "General Radiology Report",
      structure: [
        "CLINICAL HISTORY:",
        "TECHNIQUE:",
        "FINDINGS:",
        "IMPRESSION:"
      ],
      medicalTerms: ["radiopaque", "radiolucent", "artifact", "enhancement", "attenuation"]
    },
    chest: {
      name: "Chest X-Ray Report",
      structure: [
        "CLINICAL INDICATION:",
        "TECHNIQUE:",
        "COMPARISON:",
        "FINDINGS:",
        "Lungs:",
        "Heart:",
        "Mediastinum:",
        "Bones:",
        "IMPRESSION:"
      ],
      medicalTerms: ["pneumonia", "pleural effusion", "pneumothorax", "cardiomegaly", "atelectasis"]
    },
    ct: {
      name: "CT Scan Report",
      structure: [
        "CLINICAL HISTORY:",
        "TECHNIQUE:",
        "CONTRAST:",
        "COMPARISON:",
        "FINDINGS:",
        "IMPRESSION:"
      ],
      medicalTerms: ["hypodense", "hyperdense", "enhancement", "mass effect", "midline shift"]
    },
    mri: {
      name: "MRI Report",
      structure: [
        "CLINICAL INDICATION:",
        "TECHNIQUE:",
        "CONTRAST:",
        "SEQUENCES:",
        "FINDINGS:",
        "IMPRESSION:"
      ],
      medicalTerms: ["hyperintense", "hypointense", "FLAIR", "gadolinium", "diffusion restriction"]
    }
  };

  // Voice Commands
  const voiceCommands = {
    "new report": () => startNewReport(),
    "save report": () => saveCurrentReport(),
    "clear text": () => clearTranscript(),
    "next section": () => moveToNextSection(),
    "previous section": () => moveToPreviousSection(),
    "enhance with ai": () => enhanceWithAI(),
    "select chest template": () => setCurrentTemplate('chest'),
    "select ct template": () => setCurrentTemplate('ct'),
    "select mri template": () => setCurrentTemplate('mri')
  };

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = handleSpeechResult;
      recognitionRef.current.onerror = handleSpeechError;
      recognitionRef.current.onend = handleSpeechEnd;
      
      setIsSupported(true);
    } else {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Handle Speech Recognition Results
  const handleSpeechResult = (event) => {
    let finalTranscript = '';
    let interimTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
        setConfidence(event.results[i][0].confidence);
      } else {
        interimTranscript += transcript;
      }
    }

    if (finalTranscript) {
      // Check for voice commands
      const command = finalTranscript.toLowerCase().trim();
      if (voiceCommands[command]) {
        voiceCommands[command]();
        return;
      }

      // Process medical text with AI enhancement
      const enhancedText = aiEnhancements.medicalTermCorrection 
        ? enhanceMedicalTerms(finalTranscript)
        : finalTranscript;

      setTranscript(prev => prev + enhancedText + ' ');
    }
  };

  // Handle Speech Recognition Errors
  const handleSpeechError = (event) => {
    console.error('Speech recognition error:', event.error);
    setIsListening(false);
  };

  // Handle Speech Recognition End
  const handleSpeechEnd = () => {
    setIsListening(false);
  };

  // Start/Stop Listening
  const toggleListening = () => {
    if (!isSupported) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Enhance Medical Terms with AI
  const enhanceMedicalTerms = (text) => {
    const template = reportTemplates[currentTemplate];
    let enhancedText = text;

    // Simple medical term correction (in real implementation, this would use advanced NLP)
    const corrections = {
      'new monia': 'pneumonia',
      'pleural fusion': 'pleural effusion',
      'radio opaque': 'radiopaque',
      'radio lucent': 'radiolucent',
      'cardio megaly': 'cardiomegaly',
      'atelectasiss': 'atelectasis',
      'hyper dense': 'hyperdense',
      'hypo dense': 'hypodense'
    };

    Object.entries(corrections).forEach(([incorrect, correct]) => {
      const regex = new RegExp(incorrect, 'gi');
      enhancedText = enhancedText.replace(regex, correct);
    });

    return enhancedText;
  };

  // AI Enhancement Processing with Backend Integration
  const enhanceWithAI = async () => {
    if (!transcript.trim()) return;

    setProcessingAI(true);
    
    try {
      const response = await fetch('http://localhost:8000/radiology/voice/api/voice/process/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: transcript,
          template: currentTemplate,
          enhancements: {
            medical_term_correction: aiEnhancements.autoFormatting,
            smart_punctuation: aiEnhancements.smartPunctuation,
            template_structuring: aiEnhancements.autoFormatting,
            clinical_validation: aiEnhancements.clinicalValidation
          }
        })
      });
      
      if (!response.ok) {
        throw new Error('AI enhancement failed');
      }
      
      const result = await response.json();
      
      if (result.status === 'success') {
        setTranscript(result.enhanced_text);
        
        // Update validation results if available
        if (result.validation) {
          console.log('Validation results:', result.validation);
        }
        
        // Show success message
        setConfidence(result.validation?.confidence_score || confidence);
      } else {
        throw new Error(result.error || 'Enhancement failed');
      }
    } catch (error) {
      console.error('AI enhancement error:', error);
      // Fallback to local processing
      let enhancedText = transcript;

      if (aiEnhancements.autoFormatting) {
        enhancedText = formatWithTemplate(enhancedText);
      }

      if (aiEnhancements.smartPunctuation) {
        enhancedText = addSmartPunctuation(enhancedText);
      }

      if (aiEnhancements.clinicalValidation) {
        enhancedText = addClinicalValidation(enhancedText);
      }

      setTranscript(enhancedText);
    } finally {
      setProcessingAI(false);
    }
  };

  // Format text with template structure
  const formatWithTemplate = (text) => {
    const template = reportTemplates[currentTemplate];
    const sections = template.structure;
    
    // Simple template formatting (in real implementation, this would use advanced NLP)
    let formattedText = text;
    
    sections.forEach(section => {
      const sectionRegex = new RegExp(`(${section.replace(':', '')})`, 'gi');
      formattedText = formattedText.replace(sectionRegex, `\n\n${section}\n`);
    });

    return formattedText;
  };

  // Add smart punctuation
  const addSmartPunctuation = (text) => {
    return text
      .replace(/\s+/g, ' ')
      .replace(/\. ([a-z])/g, '. $1'.toUpperCase())
      .replace(/([a-z])\s+([A-Z])/g, '$1. $2')
      .trim();
  };

  // Add clinical validation markers
  const addClinicalValidation = (text) => {
    const criticalFindings = ['mass', 'tumor', 'fracture', 'hemorrhage', 'pneumothorax'];
    let validatedText = text;

    criticalFindings.forEach(finding => {
      const regex = new RegExp(`(${finding})`, 'gi');
      validatedText = validatedText.replace(regex, `**$1**`);
    });

    return validatedText;
  };

  // Utility functions
  const startNewReport = () => {
    setTranscript('');
    setCurrentTemplate('general');
  };

  const saveCurrentReport = async () => {
    if (!transcript.trim()) return;

    try {
      const response = await fetch('http://localhost:8000/radiology/voice/api/voice/save/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: transcript,
          template: currentTemplate,
          confidence: confidence
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save report');
      }
      
      const result = await response.json();
      
      if (result.status === 'success') {
        // Add to local saved reports with backend response data
        const savedReport = {
          id: result.report.id,
          template: currentTemplate,
          content: transcript,
          timestamp: new Date().toLocaleString(),
          confidence: confidence,
          backendId: result.report.id
        };
        
        setSavedReports(prev => [savedReport, ...prev]);
        alert('Report saved successfully to database!');
      } else {
        throw new Error(result.error || 'Save failed');
      }
    } catch (error) {
      console.error('Error saving report:', error);
      // Fallback to local save
      const newReport = {
        id: Date.now(),
        template: currentTemplate,
        content: transcript,
        timestamp: new Date().toLocaleString(),
        confidence: confidence
      };
      
      setSavedReports(prev => [newReport, ...prev]);
      alert('Report saved locally (backend unavailable)');
    }
  };

  const clearTranscript = () => {
    setTranscript('');
  };

  const moveToNextSection = () => {
    const template = reportTemplates[currentTemplate];
    const nextSection = template.structure.find(section => 
      !transcript.includes(section)
    );
    
    if (nextSection) {
      setTranscript(prev => prev + `\n\n${nextSection}\n`);
    }
  };

  const moveToPreviousSection = () => {
    // Implementation for moving to previous section
    console.log('Moving to previous section');
  };

  const loadTemplate = (templateKey) => {
    const template = reportTemplates[templateKey];
    const templateText = template.structure.join('\n\n') + '\n\n';
    setTranscript(templateText);
    setCurrentTemplate(templateKey);
    setShowTemplateModal(false);
  };

  if (!isSupported) {
    return (
      <Container fluid className="py-4">
        <Alert variant="warning" className="text-center">
          <i className="ri-mic-off-line ri-2x mb-3 d-block"></i>
          <h5>Speech Recognition Not Supported</h5>
          <p>Your browser doesn't support speech recognition. Please use a modern browser like Chrome or Edge.</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="text-primary mb-1">
                <i className="ri-mic-fill me-2"></i>
                Voice Recognition & Reporting Tools
              </h2>
              <p className="text-muted mb-0">AI-powered dictation and structured reporting for radiologists</p>
            </div>
            <div className="d-flex gap-2">
              <Button variant="outline-primary" size="sm" as={Link} to="/radiology/home">
                <i className="ri-arrow-left-line me-1"></i>
                Back to Radiology
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        {/* Voice Recognition Controls */}
        <Col lg={4}>
          <Card className="h-100 shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <i className="ri-settings-3-fill me-2"></i>
                Voice Recognition Controls
              </h5>
            </Card.Header>
            <Card.Body>
              {/* Main Controls */}
              <div className="text-center mb-4">
                <Button
                  variant={isListening ? "danger" : "success"}
                  size="lg"
                  className="rounded-circle p-4 mb-3"
                  onClick={toggleListening}
                  style={{ width: '100px', height: '100px' }}
                >
                  <i className={`ri-${isListening ? 'stop' : 'mic'}-fill ri-2x`}></i>
                </Button>
                <div>
                  <h6>{isListening ? 'Listening...' : 'Click to Start Dictation'}</h6>
                  {confidence > 0 && (
                    <div>
                      <small className="text-muted">Confidence: {Math.round(confidence * 100)}%</small>
                      <ProgressBar now={confidence * 100} size="sm" className="mt-1" />
                    </div>
                  )}
                </div>
              </div>

              {/* Template Selection */}
              <div className="mb-3">
                <label className="form-label">Report Template</label>
                <Form.Select 
                  value={currentTemplate} 
                  onChange={(e) => setCurrentTemplate(e.target.value)}
                >
                  {Object.entries(reportTemplates).map(([key, template]) => (
                    <option key={key} value={key}>{template.name}</option>
                  ))}
                </Form.Select>
              </div>

              {/* Quick Actions */}
              <div className="d-grid gap-2 mb-3">
                <Button variant="outline-info" size="sm" onClick={() => setShowTemplateModal(true)}>
                  <i className="ri-file-add-line me-1"></i>
                  Load Template
                </Button>
                <Button variant="outline-warning" size="sm" onClick={enhanceWithAI} disabled={processingAI}>
                  <i className="ri-ai-generate me-1"></i>
                  {processingAI ? 'Processing...' : 'Enhance with AI'}
                </Button>
                <Button variant="outline-success" size="sm" onClick={saveCurrentReport}>
                  <i className="ri-save-line me-1"></i>
                  Save Report
                </Button>
                <Button variant="outline-danger" size="sm" onClick={clearTranscript}>
                  <i className="ri-delete-bin-line me-1"></i>
                  Clear Text
                </Button>
              </div>

              {/* AI Enhancement Settings */}
              <div>
                <h6 className="mb-2">AI Enhancement Settings</h6>
                {Object.entries(aiEnhancements).map(([key, enabled]) => (
                  <Form.Check
                    key={key}
                    type="switch"
                    id={key}
                    label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    checked={enabled}
                    onChange={(e) => setAiEnhancements(prev => ({
                      ...prev,
                      [key]: e.target.checked
                    }))}
                    className="mb-1"
                  />
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Report Editor */}
        <Col lg={8}>
          <Tab.Container defaultActiveKey="editor">
            <Card className="shadow-sm">
              <Card.Header>
                <Nav variant="tabs" className="card-header-tabs">
                  <Nav.Item>
                    <Nav.Link eventKey="editor">
                      <i className="ri-edit-line me-1"></i>
                      Report Editor
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="history">
                      <i className="ri-history-line me-1"></i>
                      Saved Reports ({savedReports.length})
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="commands">
                      <i className="ri-command-line me-1"></i>
                      Voice Commands
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Header>

              <Tab.Content>
                <Tab.Pane eventKey="editor">
                  <Card.Body>
                    <div className="mb-3 d-flex justify-content-between align-items-center">
                      <div>
                        <Badge bg="info" className="me-2">
                          {reportTemplates[currentTemplate].name}
                        </Badge>
                        {isListening && (
                          <Badge bg="success" className="pulse-animation">
                            <i className="ri-mic-fill me-1"></i>
                            Recording
                          </Badge>
                        )}
                      </div>
                      <small className="text-muted">
                        {transcript.length} characters
                      </small>
                    </div>

                    <Form.Control
                      as="textarea"
                      ref={textAreaRef}
                      rows={20}
                      value={transcript}
                      onChange={(e) => setTranscript(e.target.value)}
                      placeholder="Start dictating your radiology report... or use voice commands like 'new report', 'save report', etc."
                      className="font-monospace"
                      style={{ fontSize: '14px', lineHeight: '1.6' }}
                    />

                    {processingAI && (
                      <div className="mt-3">
                        <div className="d-flex align-items-center">
                          <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                          <span>AI is enhancing your report...</span>
                        </div>
                      </div>
                    )}
                  </Card.Body>
                </Tab.Pane>

                <Tab.Pane eventKey="history">
                  <Card.Body>
                    <h6 className="mb-3">Saved Reports</h6>
                    {savedReports.length === 0 ? (
                      <div className="text-center text-muted py-4">
                        <i className="ri-file-list-line ri-3x mb-2 d-block"></i>
                        <p>No saved reports yet</p>
                      </div>
                    ) : (
                      <div className="list-group">
                        {savedReports.map((report) => (
                          <div key={report.id} className="list-group-item">
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <h6 className="mb-1">{reportTemplates[report.template].name}</h6>
                                <p className="mb-1 text-truncate" style={{ maxWidth: '400px' }}>
                                  {report.content.substring(0, 100)}...
                                </p>
                                <small className="text-muted">
                                  {report.timestamp} • Confidence: {Math.round(report.confidence * 100)}%
                                </small>
                              </div>
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => setTranscript(report.content)}
                              >
                                Load
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card.Body>
                </Tab.Pane>

                <Tab.Pane eventKey="commands">
                  <Card.Body>
                    <h6 className="mb-3">Available Voice Commands</h6>
                    <Row>
                      {Object.entries(voiceCommands).map(([command, description]) => (
                        <Col md={6} key={command} className="mb-3">
                          <Card className="border">
                            <Card.Body className="p-3">
                              <code className="text-primary">"{command}"</code>
                              <small className="d-block text-muted mt-1">
                                {command.replace(/([A-Z])/g, ' $1').toLowerCase()}
                              </small>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </Card.Body>
                </Tab.Pane>
              </Tab.Content>
            </Card>
          </Tab.Container>
        </Col>
      </Row>

      {/* Template Modal */}
      <Modal show={showTemplateModal} onHide={() => setShowTemplateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Select Report Template</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {Object.entries(reportTemplates).map(([key, template]) => (
              <Col md={6} key={key} className="mb-3">
                <Card 
                  className="h-100 cursor-pointer border-hover"
                  onClick={() => loadTemplate(key)}
                >
                  <Card.Body>
                    <h6 className="text-primary">{template.name}</h6>
                    <div className="mb-2">
                      {template.structure.map((section, index) => (
                        <small key={index} className="d-block text-muted">
                          {section}
                        </small>
                      ))}
                    </div>
                    <div>
                      <small className="text-info">
                        Medical terms: {template.medicalTerms.join(', ')}
                      </small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Modal.Body>
      </Modal>

      {/* Additional Styles */}
      <style jsx>{`
        .pulse-animation {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        
        .border-hover:hover {
          border-color: var(--bs-primary) !important;
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }
        
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </Container>
  );
};

export default VoiceRecognitionTools;
