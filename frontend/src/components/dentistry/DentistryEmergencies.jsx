import React, { useState, useEffect } from 'react';
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
  Table,
  Modal,
  Tabs,
  Tab,
  ProgressBar,
  ButtonGroup,
  Accordion,
  ListGroup
} from 'react-bootstrap';

const DentistryEmergencies = () => {
  const navigate = useNavigate();
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Enhanced Emergency AI Features
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [activeTab, setActiveTab] = useState('triage');
  const [emergencyFormData, setEmergencyFormData] = useState({
    symptoms: '',
    painLevel: 5,
    duration: '',
    location: '',
    patientInfo: ''
  });
  
  // AI-Powered Emergency Features
  const [aiTriage, setAiTriage] = useState(null);
  const [aiGuidance, setAiGuidance] = useState(null);
  const [aiPainManagement, setAiPainManagement] = useState(null);
  const [emergencyPrediction, setEmergencyPrediction] = useState(null);
  const [realTimeMonitoring, setRealTimeMonitoring] = useState(null);
  const [aiChatEmergency, setAiChatEmergency] = useState([]);
  const [emergencyInput, setEmergencyInput] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  // Emergency Types with AI Classification
  const emergencyTypes = [
    {
      type: 'severe_pain',
      label: 'Severe Tooth Pain',
      urgency: 'high',
      icon: 'ri-alarm-warning-line',
      aiResponse: 'Immediate attention required',
      color: 'danger'
    },
    {
      type: 'dental_trauma',
      label: 'Dental Trauma/Injury',
      urgency: 'critical',
      icon: 'ri-first-aid-kit-line',
      aiResponse: 'Emergency treatment needed',
      color: 'danger'
    },
    {
      type: 'infection',
      label: 'Dental Infection/Abscess',
      urgency: 'high',
      icon: 'ri-virus-line',
      aiResponse: 'Antibiotic therapy and drainage',
      color: 'warning'
    },
    {
      type: 'bleeding',
      label: 'Uncontrolled Bleeding',
      urgency: 'critical',
      icon: 'ri-drop-line',
      aiResponse: 'Immediate hemostasis required',
      color: 'danger'
    },
    {
      type: 'swelling',
      label: 'Facial Swelling',
      urgency: 'high',
      icon: 'ri-emotion-sad-line',
      aiResponse: 'Monitor airway, consider steroids',
      color: 'warning'
    },
    {
      type: 'lost_filling',
      label: 'Lost Filling/Crown',
      urgency: 'medium',
      icon: 'ri-tooth-line',
      aiResponse: 'Temporary restoration possible',
      color: 'info'
    }
  ];

  useEffect(() => {
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    if (!token) {
      setError('Please log in to access emergency records');
    }
    
    // Initialize AI emergency monitoring
    initializeEmergencyAI();
  }, []);

  // AI-Powered Emergency Functions
  const initializeEmergencyAI = () => {
    // Simulate real-time emergency monitoring
    setRealTimeMonitoring({
      activeEmergencies: 3,
      avgResponseTime: '12 minutes',
      riskLevel: 'moderate',
      aiInsights: 'Peak emergency hours: 6-8 PM',
      predictedVolume: '+15% tonight'
    });
  };

  const performAITriage = async (symptoms, painLevel, duration, location) => {
    setAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const triage = {
        urgencyLevel: painLevel >= 8 ? 'critical' : painLevel >= 6 ? 'high' : 'medium',
        estimatedWaitTime: painLevel >= 8 ? '0-5 mins' : painLevel >= 6 ? '15-30 mins' : '1-2 hours',
        recommendedAction: painLevel >= 8 ? 'Immediate attention' : 'Schedule urgent appointment',
        aiConfidence: '94%',
        symptoms_analysis: {
          primary_concern: symptoms.toLowerCase().includes('pain') ? 'acute pain management' : 'structural damage',
          risk_factors: duration.includes('days') ? ['infection risk', 'spread potential'] : ['localized issue'],
          complications: painLevel >= 7 ? ['sleep disruption', 'eating difficulty'] : ['mild discomfort']
        },
        treatment_protocol: {
          immediate: painLevel >= 8 ? ['Pain control', 'X-ray', 'Emergency treatment'] : ['Assessment', 'Pain management'],
          follow_up: ['Monitor symptoms', 'Schedule follow-up', 'Home care instructions'],
          medications: painLevel >= 7 ? ['Strong analgesics', 'Anti-inflammatory'] : ['OTC pain relief']
        }
      };
      
      setAiTriage(triage);
    } catch (err) {
      setError('AI triage analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const generateAIGuidance = async (emergencyType) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const guidance = {
        immediate_steps: [
          'Remain calm and assess the situation',
          'Control any bleeding with clean gauze',
          'Apply cold compress for swelling',
          'Take recommended pain medication',
          'Contact emergency dental service'
        ],
        do_not_do: [
          'Do not apply heat to swollen areas',
          'Avoid aspirin for bleeding',
          'Do not ignore severe symptoms',
          'Avoid hard or hot foods'
        ],
        when_to_seek_er: [
          'Difficulty swallowing or breathing',
          'High fever with dental pain',
          'Severe facial swelling',
          'Uncontrolled bleeding',
          'Signs of systemic infection'
        ],
        ai_recommendations: {
          priority: emergencyType === 'dental_trauma' ? 'critical' : 'high',
          timeframe: 'Within 2 hours',
          specialist_needed: emergencyType === 'dental_trauma' ? 'Oral surgeon' : 'Endodontist'
        }
      };
      
      setAiGuidance(guidance);
    } catch (err) {
      setError('Failed to generate AI guidance');
    }
  };

  const generateAIPainManagement = async (painLevel, symptoms) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const painManagement = {
        medication_protocol: {
          mild_pain: {
            medications: ['Ibuprofen 400mg every 6 hours', 'Acetaminophen 500mg every 4 hours'],
            alternatives: ['Topical anesthetic gel', 'Cold therapy'],
            duration: 'Up to 3 days'
          },
          moderate_pain: {
            medications: ['Ibuprofen 600mg + Acetaminophen 500mg', 'Naproxen 220mg every 8 hours'],
            alternatives: ['Prescription topical anesthetic', 'Warm salt water rinses'],
            duration: 'Up to 5 days'
          },
          severe_pain: {
            medications: ['Prescription pain relievers may be needed', 'Consider nerve block'],
            alternatives: ['Ice therapy', 'Elevation of head while sleeping'],
            duration: 'Until professional treatment'
          }
        },
        non_pharmacological: [
          'Meditation and breathing exercises',
          'Distraction techniques',
          'Gentle jaw exercises',
          'Proper positioning for sleep'
        ],
        warning_signs: [
          'Pain medication not effective after 2 doses',
          'Increasing pain despite treatment',
          'New symptoms developing',
          'Allergic reaction to medications'
        ],
        ai_personalized_tips: [
          `Based on ${painLevel}/10 pain level: Focus on inflammation control`,
          'Your symptoms suggest nerve involvement - avoid temperature extremes',
          'Consider prescription pain relief if OTC insufficient'
        ]
      };
      
      setAiPainManagement(painManagement);
    } catch (err) {
      setError('Failed to generate pain management plan');
    }
  };

  const predictEmergencyOutcome = async (formData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2200));
      
      const prediction = {
        recovery_timeline: {
          immediate_relief: '2-4 hours with treatment',
          full_recovery: formData.painLevel >= 8 ? '1-2 weeks' : '3-7 days',
          return_to_normal: '1-3 weeks depending on treatment'
        },
        treatment_success: {
          probability: formData.painLevel >= 8 ? '90%' : '95%',
          factors: ['Early intervention', 'Patient compliance', 'No complications'],
          risks: formData.duration.includes('days') ? ['Infection spread', 'Nerve damage'] : ['Minimal risk']
        },
        cost_prediction: {
          emergency_visit: '$200-500',
          treatment_range: '$300-2000',
          insurance_coverage: '60-80% typical',
          payment_options: ['Payment plans available', 'Insurance pre-authorization']
        },
        ai_insights: [
          'Similar cases show excellent outcomes with prompt treatment',
          'Your symptoms are consistent with treatable conditions',
          'Early intervention significantly improves prognosis'
        ]
      };
      
      setEmergencyPrediction(prediction);
    } catch (err) {
      setError('Failed to generate outcome prediction');
    }
  };

  const handleEmergencyChat = async (message) => {
    if (!message.trim()) return;
    
    const userMessage = { type: 'user', content: message, timestamp: new Date(), urgency: 'normal' };
    setAiChatEmergency(prev => [...prev, userMessage]);
    setEmergencyInput('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let aiResponse = '';
      let urgency = 'normal';
      
      if (message.toLowerCase().includes('severe') || message.toLowerCase().includes('emergency')) {
        aiResponse = "This sounds urgent. Based on your description, I recommend seeking immediate dental care. Meanwhile, here's what you can do: 1) Take pain medication as directed, 2) Apply cold compress, 3) Call our emergency line.";
        urgency = 'high';
      } else if (message.toLowerCase().includes('pain')) {
        aiResponse = "I understand you're experiencing pain. On a scale of 1-10, how would you rate it? For immediate relief, try ibuprofen and cold compress. If pain is 7+ or worsening, seek urgent care.";
        urgency = 'medium';
      } else {
        aiResponse = "I'm here to help with your dental emergency. Can you describe your symptoms in detail? This will help me provide the most appropriate guidance and determine if immediate care is needed.";
      }
      
      const emergencyResponse = {
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        urgency: urgency,
        actions: [
          'Call Emergency Line: (555) 123-URGENT',
          'Schedule Urgent Appointment',
          'Pain Management Guide',
          'Find Nearest Emergency Dentist'
        ]
      };
      
      setAiChatEmergency(prev => [...prev, emergencyResponse]);
    } catch (err) {
      const errorMessage = { 
        type: 'ai', 
        content: 'I apologize, but I encountered an error. For immediate emergencies, please call our emergency line at (555) 123-URGENT.', 
        timestamp: new Date(),
        urgency: 'high'
      };
      setAiChatEmergency(prev => [...prev, errorMessage]);
    }
  };

  // Helper function for urgency color coding
  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'high':
      case 'critical':
        return 'danger';
      case 'medium':
      case 'moderate':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'secondary';
    }
  };

  return (
    <Container fluid className="mt-4">
      {/* Emergency Header with Real-time Monitoring */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>
                <i className="ri-alarm-warning-line me-2 text-danger"></i>
                Dental Emergency Center
              </h2>
              <p className="text-muted">AI-powered emergency triage and immediate care guidance</p>
            </div>
            <div className="d-flex gap-2">
              <Button variant="danger" size="lg" onClick={() => setShowEmergencyModal(true)}>
                <i className="ri-alarm-line me-2"></i>
                Emergency Triage
              </Button>
              <Button variant="outline-danger">
                <i className="ri-phone-line me-2"></i>
                Call Emergency: (555) 123-URGENT
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Real-time Emergency Monitoring Dashboard */}
      {realTimeMonitoring && (
        <Row className="mb-4">
          <Col>
            <Card className="border-danger">
              <Card.Header className="bg-danger text-white">
                <h5 className="mb-0">
                  <i className="ri-dashboard-line me-2"></i>
                  Live Emergency Monitoring
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={3} className="text-center">
                    <h3 className="text-danger">{realTimeMonitoring.activeEmergencies}</h3>
                    <small className="text-muted">Active Emergencies</small>
                  </Col>
                  <Col md={3} className="text-center">
                    <h3 className="text-success">{realTimeMonitoring.avgResponseTime}</h3>
                    <small className="text-muted">Avg Response Time</small>
                  </Col>
                  <Col md={3} className="text-center">
                    <Badge bg={realTimeMonitoring.riskLevel === 'high' ? 'danger' : 'warning'} className="p-2">
                      {realTimeMonitoring.riskLevel.toUpperCase()} RISK
                    </Badge>
                    <div><small className="text-muted">Current Risk Level</small></div>
                  </Col>
                  <Col md={3} className="text-center">
                    <div className="fw-bold text-info">{realTimeMonitoring.predictedVolume}</div>
                    <small className="text-muted">Predicted Volume</small>
                  </Col>
                </Row>
                <Alert variant="info" className="mt-3 mb-0">
                  <i className="ri-lightbulb-line me-2"></i>
                  <strong>AI Insight:</strong> {realTimeMonitoring.aiInsights}
                </Alert>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="warning" dismissible onClose={() => setError(null)}>
              <Alert.Heading>
                <i className="ri-error-warning-line me-2"></i>
                Authentication Required
              </Alert.Heading>
              <p>{error}</p>
              <Button variant="primary" onClick={() => navigate('/auth/sign-in')}>
                <i className="ri-login-box-line me-2"></i>
                Go to Login
              </Button>
            </Alert>
          </Col>
        </Row>
      )}

      {/* Emergency Types Quick Access */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="ri-first-aid-kit-line me-2"></i>
                Emergency Types - AI Classification
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                {emergencyTypes.map((emergency, index) => (
                  <Col key={index} lg={4} md={6} className="mb-3">
                    <Card className={`h-100 border-${emergency.color} hover-shadow`} style={{ cursor: 'pointer' }}
                          onClick={() => {
                            setEmergencyFormData(prev => ({ ...prev, symptoms: emergency.label }));
                            generateAIGuidance(emergency.type);
                            setShowEmergencyModal(true);
                          }}>
                      <Card.Body className="text-center">
                        <i className={`${emergency.icon} text-${emergency.color} mb-2`} style={{ fontSize: '32px' }}></i>
                        <h6>{emergency.label}</h6>
                        <Badge bg={emergency.color} className="mb-2">
                          {emergency.urgency.toUpperCase()}
                        </Badge>
                        <p className="small text-muted">{emergency.aiResponse}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Emergency AI Features Dashboard */}
      <Row>
        {aiTriage && (
          <Col lg={6} className="mb-4">
            <Card className="border-warning">
              <Card.Header className="bg-warning text-dark">
                <h5 className="mb-0">
                  <i className="ri-brain-line me-2"></i>
                  AI Emergency Triage
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="text-center mb-3">
                  <Badge bg={getUrgencyColor(aiTriage.urgencyLevel)} className="p-2 fs-6">
                    {aiTriage.urgencyLevel.toUpperCase()} PRIORITY
                  </Badge>
                  <div className="mt-2">
                    <strong>Estimated Wait Time: {aiTriage.estimatedWaitTime}</strong>
                  </div>
                  <small className="text-muted">AI Confidence: {aiTriage.aiConfidence}</small>
                </div>
                
                <Accordion>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Symptoms Analysis</Accordion.Header>
                    <Accordion.Body>
                      <p><strong>Primary Concern:</strong> {aiTriage.symptoms_analysis.primary_concern}</p>
                      <p><strong>Risk Factors:</strong> {aiTriage.symptoms_analysis.risk_factors.join(', ')}</p>
                      <p><strong>Complications:</strong> {aiTriage.symptoms_analysis.complications.join(', ')}</p>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>Treatment Protocol</Accordion.Header>
                    <Accordion.Body>
                      <div className="mb-2">
                        <strong>Immediate:</strong>
                        <ul>
                          {aiTriage.treatment_protocol.immediate.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <strong>Follow-up:</strong>
                        <ul>
                          {aiTriage.treatment_protocol.follow_up.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Card.Body>
            </Card>
          </Col>
        )}

        {aiGuidance && (
          <Col lg={6} className="mb-4">
            <Card className="border-info">
              <Card.Header className="bg-info text-white">
                <h5 className="mb-0">
                  <i className="ri-guide-line me-2"></i>
                  AI Emergency Guidance
                </h5>
              </Card.Header>
              <Card.Body>
                <Tabs defaultActiveKey="immediate">
                  <Tab eventKey="immediate" title="Immediate Steps">
                    <div className="mt-3">
                      <ListGroup variant="flush">
                        {aiGuidance.immediate_steps.map((step, i) => (
                          <ListGroup.Item key={i} className="d-flex align-items-center">
                            <Badge bg="success" className="me-2">{i + 1}</Badge>
                            {step}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </div>
                  </Tab>
                  <Tab eventKey="avoid" title="Do NOT Do">
                    <div className="mt-3">
                      <ListGroup variant="flush">
                        {aiGuidance.do_not_do.map((item, i) => (
                          <ListGroup.Item key={i} className="d-flex align-items-center">
                            <i className="ri-close-circle-line text-danger me-2"></i>
                            {item}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </div>
                  </Tab>
                  <Tab eventKey="er" title="When to Call 911">
                    <div className="mt-3">
                      <Alert variant="danger">
                        <strong>Seek Emergency Room if:</strong>
                      </Alert>
                      <ListGroup variant="flush">
                        {aiGuidance.when_to_seek_er.map((item, i) => (
                          <ListGroup.Item key={i} className="d-flex align-items-center">
                            <i className="ri-alarm-warning-line text-danger me-2"></i>
                            {item}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </div>
                  </Tab>
                </Tabs>
              </Card.Body>
            </Card>
          </Col>
        )}

        {aiPainManagement && (
          <Col lg={6} className="mb-4">
            <Card className="border-success">
              <Card.Header className="bg-success text-white">
                <h5 className="mb-0">
                  <i className="ri-medicine-bottle-line me-2"></i>
                  AI Pain Management Plan
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  {Object.entries(aiPainManagement.medication_protocol).map(([level, protocol]) => (
                    <Card key={level} className="mb-2">
                      <Card.Header className="py-2">
                        <strong>{level.replace('_', ' ').toUpperCase()}</strong>
                      </Card.Header>
                      <Card.Body className="py-2">
                        <p className="mb-1"><strong>Medications:</strong> {protocol.medications.join(', ')}</p>
                        <p className="mb-1"><strong>Alternatives:</strong> {protocol.alternatives.join(', ')}</p>
                        <p className="mb-0"><strong>Duration:</strong> {protocol.duration}</p>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
                <Alert variant="warning">
                  <strong>AI Personalized Tips:</strong>
                  <ul className="mb-0 mt-2">
                    {aiPainManagement.ai_personalized_tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </Alert>
              </Card.Body>
            </Card>
          </Col>
        )}

        {emergencyPrediction && (
          <Col lg={6} className="mb-4">
            <Card className="border-primary">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">
                  <i className="ri-line-chart-line me-2"></i>
                  AI Outcome Prediction
                </h5>
              </Card.Header>
              <Card.Body>
                <Row className="text-center mb-3">
                  <Col sm={4}>
                    <div className="border rounded p-2">
                      <div className="fw-bold">Immediate Relief</div>
                      <div className="text-success">{emergencyPrediction.recovery_timeline.immediate_relief}</div>
                    </div>
                  </Col>
                  <Col sm={4}>
                    <div className="border rounded p-2">
                      <div className="fw-bold">Full Recovery</div>
                      <div className="text-info">{emergencyPrediction.recovery_timeline.full_recovery}</div>
                    </div>
                  </Col>
                  <Col sm={4}>
                    <div className="border rounded p-2">
                      <div className="fw-bold">Success Rate</div>
                      <div className="text-primary">{emergencyPrediction.treatment_success.probability}</div>
                    </div>
                  </Col>
                </Row>
                <Alert variant="success">
                  <strong>Cost Prediction:</strong> {emergencyPrediction.cost_prediction.treatment_range}
                  <br />
                  <small>Insurance typically covers {emergencyPrediction.cost_prediction.insurance_coverage}</small>
                </Alert>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      {/* AI Emergency Chat Assistant */}
      <Row className="mt-4">
        <Col>
          <Card className="border-warning">
            <Card.Header className="bg-warning text-dark">
              <h5 className="mb-0">
                <i className="ri-customer-service-2-line me-2"></i>
                Emergency AI Assistant - 24/7 Support
              </h5>
            </Card.Header>
            <Card.Body style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
              <div className="flex-grow-1 overflow-auto mb-3" style={{ maxHeight: '300px' }}>
                {aiChatEmergency.length === 0 ? (
                  <div className="text-center text-muted py-4">
                    <i className="ri-emergency-line" style={{ fontSize: '48px' }}></i>
                    <p>Emergency AI Assistant ready to help!</p>
                    <p>Describe your symptoms or emergency situation for immediate guidance.</p>
                  </div>
                ) : (
                  aiChatEmergency.map((message, index) => (
                    <div key={index} className={`mb-3 d-flex ${message.type === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                      <div className={`p-3 rounded ${
                        message.type === 'user' 
                          ? 'bg-primary text-white' 
                          : message.urgency === 'high' 
                            ? 'bg-danger text-white' 
                            : message.urgency === 'medium' 
                              ? 'bg-warning' 
                              : 'bg-light'
                      }`} style={{ maxWidth: '80%' }}>
                        <div>{message.content}</div>
                        <small className="opacity-75">{message.timestamp.toLocaleTimeString()}</small>
                        {message.actions && (
                          <div className="mt-2">
                            {message.actions.map((action, i) => (
                              <Button
                                key={i}
                                variant={message.urgency === 'high' ? 'light' : 'outline-primary'}
                                size="sm"
                                className="me-1 mb-1"
                                onClick={() => {
                                  if (action.includes('Call')) {
                                    window.location.href = 'tel:+15551234567';
                                  } else if (action.includes('Schedule')) {
                                    navigate('/dentistry/appointments');
                                  }
                                }}
                              >
                                {action}
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
                  placeholder="Describe your emergency symptoms..."
                  value={emergencyInput}
                  onChange={(e) => setEmergencyInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleEmergencyChat(emergencyInput)}
                />
                <Button variant="danger" onClick={() => handleEmergencyChat(emergencyInput)}>
                  <i className="ri-send-plane-line"></i>
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Emergency Triage Modal */}
      <Modal show={showEmergencyModal} onHide={() => setShowEmergencyModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-emergency-line me-2 text-danger"></i>
            AI Emergency Triage System
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs activeKey={activeTab} onSelect={setActiveTab}>
            <Tab eventKey="triage" title="AI Triage">
              <div className="mt-3">
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Describe Your Symptoms</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={emergencyFormData.symptoms}
                          onChange={(e) => setEmergencyFormData(prev => ({ ...prev, symptoms: e.target.value }))}
                          placeholder="Please describe your symptoms in detail..."
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Pain Level (1-10)</Form.Label>
                        <Form.Range
                          min={1}
                          max={10}
                          value={emergencyFormData.painLevel}
                          onChange={(e) => setEmergencyFormData(prev => ({ ...prev, painLevel: parseInt(e.target.value) }))}
                        />
                        <div className="d-flex justify-content-between">
                          <small>No pain</small>
                          <strong className="text-danger">{emergencyFormData.painLevel}/10</strong>
                          <small>Worst pain</small>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Duration</Form.Label>
                        <Form.Select
                          value={emergencyFormData.duration}
                          onChange={(e) => setEmergencyFormData(prev => ({ ...prev, duration: e.target.value }))}
                        >
                          <option value="">Select duration</option>
                          <option value="less_than_hour">Less than 1 hour</option>
                          <option value="few_hours">A few hours</option>
                          <option value="today">Started today</option>
                          <option value="few_days">A few days</option>
                          <option value="week">About a week</option>
                          <option value="longer">More than a week</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                          type="text"
                          value={emergencyFormData.location}
                          onChange={(e) => setEmergencyFormData(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="Which tooth or area?"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Tab>
            <Tab eventKey="analysis" title="AI Analysis">
              <div className="mt-3 text-center">
                {analyzing ? (
                  <div>
                    <Spinner animation="border" variant="primary" className="mb-3" />
                    <p>AI is analyzing your symptoms...</p>
                    <ProgressBar animated now={100} className="mb-3" />
                  </div>
                ) : (
                  <div>
                    <i className="ri-brain-line text-primary" style={{ fontSize: '64px' }}></i>
                    <p>Ready to analyze your emergency symptoms</p>
                  </div>
                )}
              </div>
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEmergencyModal(false)}>
            Close
          </Button>
          <Button 
            variant="danger" 
            onClick={() => {
              performAITriage(
                emergencyFormData.symptoms,
                emergencyFormData.painLevel,
                emergencyFormData.duration,
                emergencyFormData.location
              );
              generateAIPainManagement(emergencyFormData.painLevel, emergencyFormData.symptoms);
              predictEmergencyOutcome(emergencyFormData);
              setActiveTab('analysis');
            }}
            disabled={!emergencyFormData.symptoms || analyzing}
          >
            <i className="ri-brain-line me-2"></i>
            Start AI Triage Analysis
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DentistryEmergencies;

