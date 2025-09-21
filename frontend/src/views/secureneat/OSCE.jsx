import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, Row, Col, Form, Button, Badge, Alert, ProgressBar, Modal, 
  Tab, Nav, Accordion, Table, Spinner, OverlayTrigger, Tooltip, Dropdown 
} from 'react-bootstrap';
import { 
  RiPlayCircleLine, RiStopCircleLine, RiPauseCircleLine, RiTimerLine, 
  RiEyeLine, RiEditLine, RiDeleteBinLine, RiAddLine, RiStarLine,
  RiMicLine, RiVideoLine, RiCameraLine, RiFileTextLine, RiDownloadLine,
  RiUploadLine, RiSearchLine, RiFilterLine, RiSettingsLine, RiShareLine,
  RiBookOpenLine, RiHeartPulseLine, RiBrainLine, RiStethoscopeLine,
  RiUserHeartLine, RiMentalHealthLine, RiMedicineBottleLine, RiFirstAidKitLine,
  RiEmotionHappyLine, RiGroup2Line, RiVideoAddLine,
  RiRecordCircleLine, RiSave3Line, RiCheckLine, RiCloseLine, RiRefreshLine
} from 'react-icons/ri';
import Card from '../../components/Card';
import { Link, useNavigate } from 'react-router-dom';

// Advanced OSCE scenarios with comprehensive details
const advancedScenarios = [
  {
    id: 'osce-001',
    title: 'Acute Myocardial Infarction Management',
    category: 'Emergency Medicine',
    subcategory: 'Cardiology',
    difficulty: 'Advanced',
    duration: 25,
    type: 'Clinical Skills',
    tags: ['ECG', 'Chest Pain', 'Emergency', 'Critical Care'],
    status: 'available',
    rating: 4.8,
    attempts: 0,
    bestScore: null,
    description: 'Comprehensive scenario involving initial assessment, ECG interpretation, and emergency management of STEMI patient.',
    learningObjectives: [
      'Rapid assessment of chest pain',
      'ECG interpretation and STEMI recognition',
      'Emergency medication protocols',
      'Patient communication under stress',
      'Team coordination and handover'
    ],
    equipment: ['ECG machine', 'Defibrillator', 'IV access', 'Oxygen', 'Medications'],
    timeBreakdown: {
      history: 5,
      examination: 8,
      investigations: 5,
      management: 7
    },
    markingScheme: {
      history: 25,
      examination: 25,
      interpretation: 20,
      management: 20,
      communication: 10
    },
    prerequisites: ['Basic ECG interpretation', 'Cardiovascular examination'],
    commonMistakes: [
      'Delayed ECG acquisition',
      'Missing posterior leads in inferior MI',
      'Inadequate pain relief',
      'Poor communication with patient'
    ]
  },
  {
    id: 'osce-002',
    title: 'Breaking Bad News - Cancer Diagnosis',
    category: 'Communication Skills',
    subcategory: 'Oncology',
    difficulty: 'Expert',
    duration: 20,
    type: 'Communication',
    tags: ['Breaking Bad News', 'Cancer', 'Psychology', 'Empathy'],
    status: 'available',
    rating: 4.9,
    attempts: 0,
    bestScore: null,
    description: 'Delivering a new cancer diagnosis using SPIKES protocol with emotional support and follow-up planning.',
    learningObjectives: [
      'SPIKES protocol implementation',
      'Empathetic communication',
      'Managing emotional reactions',
      'Information chunking techniques',
      'Follow-up care planning'
    ],
    equipment: ['Private room', 'Tissues', 'Information leaflets', 'Contact cards'],
    timeBreakdown: {
      setting: 2,
      perception: 3,
      invitation: 2,
      knowledge: 8,
      emotions: 3,
      strategy: 2
    },
    markingScheme: {
      preparation: 15,
      communication: 35,
      empathy: 25,
      information: 15,
      followUp: 10
    },
    prerequisites: ['Basic communication skills', 'Understanding of oncology basics'],
    commonMistakes: [
      'Information overload',
      'Avoiding emotional responses',
      'Lack of empathy',
      'Poor follow-up planning'
    ]
  },
  {
    id: 'osce-003',
    title: 'Pediatric Developmental Assessment',
    category: 'Pediatrics',
    subcategory: 'Child Development',
    difficulty: 'Intermediate',
    duration: 18,
    type: 'Clinical Skills',
    tags: ['Pediatrics', 'Development', 'Assessment', 'Child Health'],
    status: 'available',
    rating: 4.6,
    attempts: 0,
    bestScore: null,
    description: 'Comprehensive developmental assessment of a 2-year-old child with parental concerns.',
    learningObjectives: [
      'Age-appropriate developmental milestones',
      'Interaction with child and parent',
      'Developmental screening tools',
      'Red flag identification',
      'Referral pathways'
    ],
    equipment: ['Toys', 'Developmental charts', 'Stethoscope', 'Measuring tape'],
    timeBreakdown: {
      history: 6,
      observation: 5,
      examination: 4,
      assessment: 3
    },
    markingScheme: {
      history: 30,
      examination: 25,
      assessment: 25,
      communication: 20
    },
    prerequisites: ['Pediatric examination skills', 'Developmental milestones knowledge'],
    commonMistakes: [
      'Not engaging with child',
      'Missing developmental red flags',
      'Inadequate parental communication',
      'Age-inappropriate expectations'
    ]
  },
  {
    id: 'osce-004',
    title: 'Mental Health Risk Assessment',
    category: 'Psychiatry',
    subcategory: 'Mental Health',
    difficulty: 'Advanced',
    duration: 22,
    type: 'Assessment',
    tags: ['Mental Health', 'Risk Assessment', 'Suicide', 'Safety'],
    status: 'available',
    rating: 4.7,
    attempts: 0,
    bestScore: null,
    description: 'Comprehensive mental health assessment including suicide risk evaluation and safety planning.',
    learningObjectives: [
      'Mental state examination',
      'Suicide risk assessment',
      'Safety planning',
      'Crisis intervention',
      'Documentation requirements'
    ],
    equipment: ['Private space', 'Assessment forms', 'Emergency contacts'],
    timeBreakdown: {
      rapport: 3,
      history: 8,
      mse: 6,
      risk: 5
    },
    markingScheme: {
      rapport: 15,
      history: 25,
      mse: 25,
      risk: 25,
      planning: 10
    },
    prerequisites: ['Mental health fundamentals', 'Risk assessment training'],
    commonMistakes: [
      'Avoiding direct questions about suicide',
      'Poor rapport building',
      'Inadequate safety planning',
      'Missing protective factors'
    ]
  },
  {
    id: 'osce-005',
    title: 'Surgical Hand Scrubbing & Gowning',
    category: 'Surgical Skills',
    subcategory: 'Infection Control',
    difficulty: 'Beginner',
    duration: 12,
    type: 'Practical Skills',
    tags: ['Surgery', 'Sterile Technique', 'Infection Control', 'Scrubbing'],
    status: 'available',
    rating: 4.5,
    attempts: 0,
    bestScore: null,
    description: 'Proper surgical scrubbing technique, sterile gowning, and gloving procedure.',
    learningObjectives: [
      'Surgical scrubbing technique',
      'Sterile gowning procedure',
      'Sterile gloving method',
      'Maintaining sterility',
      'Recognition of contamination'
    ],
    equipment: ['Scrub brushes', 'Antiseptic', 'Sterile gowns', 'Sterile gloves', 'Towels'],
    timeBreakdown: {
      scrubbing: 5,
      drying: 1,
      gowning: 3,
      gloving: 3
    },
    markingScheme: {
      scrubbing: 35,
      gowning: 30,
      gloving: 25,
      sterility: 10
    },
    prerequisites: ['Basic infection control knowledge'],
    commonMistakes: [
      'Inadequate scrubbing time',
      'Breaking sterile technique',
      'Improper gloving sequence',
      'Contamination not recognized'
    ]
  }
];

// Performance analytics data
const performanceData = {
  totalAttempts: 47,
  averageScore: 78.5,
  strongAreas: ['Clinical Examination', 'History Taking'],
  improvementAreas: ['Communication Skills', 'Time Management'],
  recentTrends: [
    { date: '2025-08-10', score: 82 },
    { date: '2025-08-08', score: 75 },
    { date: '2025-08-06', score: 79 },
    { date: '2025-08-04', score: 73 },
    { date: '2025-08-02', score: 81 }
  ]
};

const AdvancedOSCEScenario = () => {
  // State management
  const [scenarios, setScenarios] = useState(advancedScenarios);
  const [activeTab, setActiveTab] = useState('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('title');
  const [currentScenario, setCurrentScenario] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [sessionActive, setSessionActive] = useState(false);
  const [showScenarioModal, setShowScenarioModal] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [examinerFeedback, setExaminerFeedback] = useState('');
  const [selfReflection, setSelfReflection] = useState('');
  const [currentScore, setCurrentScore] = useState(null);
  
  // Refs for media recording
  const mediaRecorderRef = useRef(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  // Filter and sort scenarios
  const filteredScenarios = scenarios
    .filter(scenario => {
      const matchesSearch = scenario.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           scenario.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           scenario.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || scenario.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || scenario.difficulty === selectedDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'difficulty':
          const difficultyOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Expert': 4 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case 'duration':
          return a.duration - b.duration;
        case 'rating':
          return b.rating - a.rating;
        default:
          return a.title.localeCompare(b.title);
      }
    });

  // Get unique categories and difficulties
  const categories = [...new Set(scenarios.map(s => s.category))];
  const difficulties = [...new Set(scenarios.map(s => s.difficulty))];

  // Timer functionality
  useEffect(() => {
    let interval = null;
    if (sessionActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            setSessionActive(false);
            handleEndSession();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionActive, timeRemaining]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start OSCE session
  const startSession = (scenario) => {
    setCurrentScenario(scenario);
    setTimeRemaining(scenario.duration * 60);
    setSessionActive(true);
    setCurrentScore(null);
    setExaminerFeedback('');
    setSelfReflection('');
  };

  // End OSCE session
  const handleEndSession = () => {
    setSessionActive(false);
    if (isRecording) {
      stopRecording();
    }
    // Simulate scoring
    const score = Math.floor(Math.random() * 40) + 60; // Random score 60-100
    setCurrentScore(score);
    
    // Update scenario attempts
    setScenarios(prev => prev.map(s => 
      s.id === currentScenario?.id 
        ? { ...s, attempts: s.attempts + 1, bestScore: Math.max(s.bestScore || 0, score) }
        : s
    ));
  };

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Unable to start recording. Please check camera/microphone permissions.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all tracks
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    }
  };

  // Get difficulty badge variant
  const getDifficultyVariant = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'danger';
      case 'Expert': return 'dark';
      default: return 'secondary';
    }
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Emergency Medicine': return <RiFirstAidKitLine />;
      case 'Communication Skills': return <RiGroup2Line />;
      case 'Pediatrics': return <RiEmotionHappyLine />;
      case 'Psychiatry': return <RiMentalHealthLine />;
      case 'Surgical Skills': return <RiMedicineBottleLine />;
      case 'Cardiology': return <RiHeartPulseLine />;
      case 'Neurology': return <RiBrainLine />;
      default: return <RiStethoscopeLine />;
    }
  };

  return (
    <Container fluid className="p-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="text-primary mb-1">
                <RiStethoscopeLine className="me-2" />
                Advanced OSCE Scenario Practice
              </h2>
                <p className="text-muted mb-0">
                  Comprehensive Objective Structured Clinical Examination training platform
                </p>
              </div>
              <div className="d-flex gap-2">
                <Button variant="outline-primary" onClick={() => setShowPerformanceModal(true)}>
                  <RiEyeLine className="me-1" />
                  Performance Analytics
                </Button>
                <Button variant="primary">
                  <RiAddLine className="me-1" />
                  Create Custom Scenario
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Active Session Panel */}
        {sessionActive && currentScenario && (
          <Row className="mb-4">
            <Col>
              <Card className="border-warning">
                <Card.Body className="bg-warning bg-opacity-10">
                  <Row className="align-items-center">
                    <Col md={6}>
                      <h5 className="mb-1 text-warning">
                        <RiPlayCircleLine className="me-2" />
                        Active Session: {currentScenario.title}
                      </h5>
                      <p className="mb-0 text-muted">
                        {currentScenario.category} • {currentScenario.difficulty}
                      </p>
                    </Col>
                    <Col md={3} className="text-center">
                      <div className="display-6 text-warning fw-bold">
                        {formatTime(timeRemaining)}
                      </div>
                      <small className="text-muted">Time Remaining</small>
                    </Col>
                    <Col md={3} className="text-end">
                      <div className="d-flex gap-2 justify-content-end">
                        {!isRecording ? (
                          <Button variant="outline-danger" onClick={startRecording}>
                            <RiRecordCircleLine className="me-1" />
                            Record
                          </Button>
                        ) : (
                          <Button variant="danger" onClick={stopRecording}>
                            <RiStopCircleLine className="me-1" />
                            Stop Recording
                          </Button>
                        )}
                        <Button variant="warning" onClick={handleEndSession}>
                          <RiStopCircleLine className="me-1" />
                          End Session
                        </Button>
                      </div>
                    </Col>
                  </Row>
                  
                  {/* Recording indicator */}
                  {isRecording && (
                    <Row className="mt-3">
                      <Col>
                        <Alert variant="danger" className="mb-0">
                          <RiRecordCircleLine className="me-2 blink" />
                          Recording in progress... Your performance is being captured for review.
                        </Alert>
                      </Col>
                    </Row>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Main Content Tabs */}
        <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
          <Card>
            <Card.Header className="bg-light">
              <Nav variant="tabs" className="border-0">
                <Nav.Item>
                  <Nav.Link eventKey="browse">
                    <RiSearchLine className="me-2" />
                    Browse Scenarios
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="practice">
                    <RiPlayCircleLine className="me-2" />
                    Practice Mode
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="analytics">
                    <RiEyeLine className="me-2" />
                    Performance Analytics
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="library">
                    <RiBookOpenLine className="me-2" />
                    Learning Resources
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>

            <Tab.Content>
              {/* Browse Scenarios Tab */}
              <Tab.Pane eventKey="browse">
                <Card.Body>
                  {/* Search and Filter Controls */}
                  <Row className="mb-4">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Control
                          type="text"
                          placeholder="Search scenarios, categories, or tags..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </Form.Select>
                    </Col>
                    <Col md={2}>
                      <Form.Select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}>
                        <option value="all">All Levels</option>
                        {difficulties.map(diff => (
                          <option key={diff} value={diff}>{diff}</option>
                        ))}
                      </Form.Select>
                    </Col>
                    <Col md={2}>
                      <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="title">Sort by Title</option>
                        <option value="difficulty">Sort by Difficulty</option>
                        <option value="duration">Sort by Duration</option>
                        <option value="rating">Sort by Rating</option>
                      </Form.Select>
                    </Col>
                    <Col md={2}>
                      <Button variant="outline-secondary" className="w-100">
                        <RiFilterLine className="me-1" />
                        Advanced Filter
                      </Button>
                    </Col>
                  </Row>

                  {/* Scenarios Grid */}
                  <Row>
                    {filteredScenarios.map(scenario => (
                      <Col lg={6} xl={4} key={scenario.id} className="mb-4">
                        <Card className="h-100 scenario-card">
                          <Card.Header className="bg-gradient-primary text-white">
                            <div className="d-flex justify-content-between align-items-start">
                              <div className="flex-grow-1">
                                <h6 className="mb-1 text-white">{scenario.title}</h6>
                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                  <Badge bg="light" text="dark" className="d-flex align-items-center">
                                    {getCategoryIcon(scenario.category)}
                                    <span className="ms-1">{scenario.category}</span>
                                  </Badge>
                                  <Badge bg={getDifficultyVariant(scenario.difficulty)}>
                                    {scenario.difficulty}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-end">
                                <div className="text-warning">
                                  {'★'.repeat(Math.floor(scenario.rating))}
                                  <small className="ms-1">{scenario.rating}</small>
                                </div>
                              </div>
                            </div>
                          </Card.Header>
                          
                          <Card.Body className="d-flex flex-column">
                            <p className="text-muted small mb-3 flex-grow-1">
                              {scenario.description}
                            </p>
                            
                            {/* Scenario Details */}
                            <div className="mb-3">
                              <Row className="g-2 text-center">
                                <Col xs={4}>
                                  <div className="text-primary">
                                    <RiTimerLine className="fs-4" />
                                    <div className="small mt-1">{scenario.duration} min</div>
                                  </div>
                                </Col>
                                <Col xs={4}>
                                  <div className="text-success">
                                    <RiPlayCircleLine className="fs-4" />
                                    <div className="small mt-1">{scenario.attempts} attempts</div>
                                  </div>
                                </Col>
                                <Col xs={4}>
                                  <div className="text-warning">
                                    <RiStarLine className="fs-4" />
                                    <div className="small mt-1">
                                      {scenario.bestScore ? `${scenario.bestScore}%` : 'No score'}
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                            </div>

                            {/* Tags */}
                            <div className="mb-3">
                              {scenario.tags.slice(0, 3).map(tag => (
                                <Badge key={tag} bg="light" text="dark" className="me-1 mb-1">
                                  {tag}
                                </Badge>
                              ))}
                              {scenario.tags.length > 3 && (
                                <Badge bg="secondary">+{scenario.tags.length - 3} more</Badge>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="d-flex gap-2 mt-auto">
                              <Button 
                                variant="primary" 
                                size="sm" 
                                className="flex-grow-1"
                                onClick={() => startSession(scenario)}
                                disabled={sessionActive}
                              >
                                <RiPlayCircleLine className="me-1" />
                                Start Practice
                              </Button>
                              <Button 
                                variant="outline-secondary" 
                                size="sm"
                                onClick={() => {
                                  setSelectedScenario(scenario);
                                  setShowScenarioModal(true);
                                }}
                              >
                                <RiEyeLine />
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>

                  {filteredScenarios.length === 0 && (
                    <div className="text-center py-5">
                      <RiSearchLine className="display-1 text-muted mb-3" />
                      <h4 className="text-muted">No scenarios found</h4>
                      <p className="text-muted">Try adjusting your search criteria or filters.</p>
                    </div>
                  )}
                </Card.Body>
              </Tab.Pane>

              {/* Practice Mode Tab */}
              <Tab.Pane eventKey="practice">
                <Card.Body>
                  {currentScenario ? (
                    <Row>
                      <Col lg={8}>
                        <Card className="mb-4">
                          <Card.Header>
                            <h5 className="mb-0">Scenario Instructions</h5>
                          </Card.Header>
                          <Card.Body>
                            <h6>{currentScenario.title}</h6>
                            <p className="text-muted">{currentScenario.description}</p>
                            
                            <Accordion>
                              <Accordion.Item eventKey="objectives">
                                <Accordion.Header>Learning Objectives</Accordion.Header>
                                <Accordion.Body>
                                  <ul>
                                    {currentScenario.learningObjectives.map((obj, idx) => (
                                      <li key={idx}>{obj}</li>
                                    ))}
                                  </ul>
                                </Accordion.Body>
                              </Accordion.Item>
                              
                              <Accordion.Item eventKey="equipment">
                                <Accordion.Header>Required Equipment</Accordion.Header>
                                <Accordion.Body>
                                  <div className="d-flex flex-wrap gap-2">
                                    {currentScenario.equipment.map((item, idx) => (
                                      <Badge key={idx} bg="light" text="dark">{item}</Badge>
                                    ))}
                                  </div>
                                </Accordion.Body>
                              </Accordion.Item>
                              
                              <Accordion.Item eventKey="marking">
                                <Accordion.Header>Marking Scheme</Accordion.Header>
                                <Accordion.Body>
                                  <Table size="sm">
                                    <tbody>
                                      {Object.entries(currentScenario.markingScheme).map(([key, value]) => (
                                        <tr key={key}>
                                          <td className="text-capitalize">{key}</td>
                                          <td className="text-end">{value}%</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </Table>
                                </Accordion.Body>
                              </Accordion.Item>
                            </Accordion>
                          </Card.Body>
                        </Card>

                        {/* Video Recording Area */}
                        <Card>
                          <Card.Header>
                            <h5 className="mb-0">Performance Recording</h5>
                          </Card.Header>
                          <Card.Body>
                            <div className="text-center">
                              <video 
                                ref={videoRef} 
                                autoPlay 
                                muted 
                                style={{ 
                                  width: '100%', 
                                  maxWidth: '500px', 
                                  height: '300px',
                                  backgroundColor: '#f8f9fa',
                                  border: '2px dashed #dee2e6'
                                }}
                              />
                              <div className="mt-3">
                                {!sessionActive ? (
                                  <p className="text-muted">Start a session to begin recording</p>
                                ) : isRecording ? (
                                  <Alert variant="danger">
                                    <RiRecordCircleLine className="me-2" />
                                    Recording in progress...
                                  </Alert>
                                ) : (
                                  <p className="text-muted">Recording available during session</p>
                                )}
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                      
                      <Col lg={4}>
                        {/* Session Timer */}
                        <Card className="mb-4">
                          <Card.Body className="text-center">
                            <div className="display-4 text-primary mb-2">
                              {sessionActive ? formatTime(timeRemaining) : formatTime(currentScenario.duration * 60)}
                            </div>
                            <h6 className="text-muted">
                              {sessionActive ? 'Time Remaining' : 'Total Duration'}
                            </h6>
                            <ProgressBar 
                              variant={sessionActive ? "warning" : "primary"}
                              now={sessionActive ? ((currentScenario.duration * 60 - timeRemaining) / (currentScenario.duration * 60)) * 100 : 0}
                              className="mt-3"
                            />
                          </Card.Body>
                        </Card>

                        {/* Performance Score */}
                        {currentScore !== null && (
                          <Card className="mb-4">
                            <Card.Header>
                              <h6 className="mb-0">Performance Score</h6>
                            </Card.Header>
                            <Card.Body className="text-center">
                              <div className={`display-4 mb-2 ${currentScore >= 80 ? 'text-success' : currentScore >= 70 ? 'text-warning' : 'text-danger'}`}>
                                {currentScore}%
                              </div>
                              <Badge bg={currentScore >= 80 ? 'success' : currentScore >= 70 ? 'warning' : 'danger'}>
                                {currentScore >= 80 ? 'Excellent' : currentScore >= 70 ? 'Good' : 'Needs Improvement'}
                              </Badge>
                            </Card.Body>
                          </Card>
                        )}

                        {/* Quick Notes */}
                        <Card>
                          <Card.Header>
                            <h6 className="mb-0">Quick Notes & Reflection</h6>
                          </Card.Header>
                          <Card.Body>
                            <Form.Group className="mb-3">
                              <Form.Label>Self-Reflection</Form.Label>
                              <Form.Control 
                                as="textarea" 
                                rows={4}
                                value={selfReflection}
                                onChange={(e) => setSelfReflection(e.target.value)}
                                placeholder="What went well? What could be improved?"
                              />
                            </Form.Group>
                            <Button variant="outline-primary" size="sm" className="w-100">
                              <RiSave3Line className="me-1" />
                              Save Notes
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  ) : (
                    <div className="text-center py-5">
                      <RiPlayCircleLine className="display-1 text-muted mb-3" />
                      <h4 className="text-muted">No Active Session</h4>
                      <p className="text-muted">Select a scenario from the Browse tab to start practicing.</p>
                      <Button variant="primary" onClick={() => setActiveTab('browse')}>
                        Browse Scenarios
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Tab.Pane>

              {/* Performance Analytics Tab */}
              <Tab.Pane eventKey="analytics">
                <Card.Body>
                  <Row>
                    <Col lg={8}>
                      <Card className="mb-4">
                        <Card.Header>
                          <h5 className="mb-0">Performance Overview</h5>
                        </Card.Header>
                        <Card.Body>
                          <Row>
                            <Col md={3} className="text-center mb-3">
                              <div className="display-6 text-primary">{performanceData.totalAttempts}</div>
                              <small className="text-muted">Total Attempts</small>
                            </Col>
                            <Col md={3} className="text-center mb-3">
                              <div className="display-6 text-success">{performanceData.averageScore}%</div>
                              <small className="text-muted">Average Score</small>
                            </Col>
                            <Col md={3} className="text-center mb-3">
                              <div className="display-6 text-warning">
                                {scenarios.filter(s => s.attempts > 0).length}
                              </div>
                              <small className="text-muted">Completed Scenarios</small>
                            </Col>
                            <Col md={3} className="text-center mb-3">
                              <div className="display-6 text-info">
                                {Math.round(scenarios.reduce((acc, s) => acc + (s.bestScore || 0), 0) / scenarios.length)}%
                              </div>
                              <small className="text-muted">Best Performance</small>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>

                      <Card>
                        <Card.Header>
                          <h5 className="mb-0">Recent Performance Trend</h5>
                        </Card.Header>
                        <Card.Body>
                          <div className="performance-chart">
                            {performanceData.recentTrends.map((trend, idx) => (
                              <div key={idx} className="d-flex justify-content-between align-items-center mb-2">
                                <span>{trend.date}</span>
                                <div className="flex-grow-1 mx-3">
                                  <ProgressBar 
                                    now={trend.score} 
                                    variant={trend.score >= 80 ? 'success' : trend.score >= 70 ? 'warning' : 'danger'}
                                  />
                                </div>
                                <Badge bg={trend.score >= 80 ? 'success' : trend.score >= 70 ? 'warning' : 'danger'}>
                                  {trend.score}%
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    
                    <Col lg={4}>
                      <Card className="mb-4">
                        <Card.Header>
                          <h6 className="mb-0">Strong Areas</h6>
                        </Card.Header>
                        <Card.Body>
                          {performanceData.strongAreas.map((area, idx) => (
                            <div key={idx} className="d-flex align-items-center mb-2">
                              <RiCheckLine className="text-success me-2" />
                              <span>{area}</span>
                            </div>
                          ))}
                        </Card.Body>
                      </Card>

                      <Card>
                        <Card.Header>
                          <h6 className="mb-0">Areas for Improvement</h6>
                        </Card.Header>
                        <Card.Body>
                          {performanceData.improvementAreas.map((area, idx) => (
                            <div key={idx} className="d-flex align-items-center mb-2">
                              <RiRefreshLine className="text-warning me-2" />
                              <span>{area}</span>
                            </div>
                          ))}
                          <Button variant="outline-primary" size="sm" className="w-100 mt-3">
                            <RiBookOpenLine className="me-1" />
                            View Learning Resources
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Tab.Pane>

              {/* Learning Resources Tab */}
              <Tab.Pane eventKey="library">
                <Card.Body>
                  <Row>
                    <Col md={4} className="mb-4">
                      <Card className="h-100">
                        <Card.Header className="bg-primary text-white">
                          <h6 className="mb-0">
                            <RiBookOpenLine className="me-2" />
                            Study Guides
                          </h6>
                        </Card.Header>
                        <Card.Body>
                          <div className="list-group list-group-flush">
                            <div className="list-group-item px-0">OSCE Communication Skills</div>
                            <div className="list-group-item px-0">Clinical Examination Techniques</div>
                            <div className="list-group-item px-0">Emergency Medicine Protocols</div>
                            <div className="list-group-item px-0">Pediatric Assessment</div>
                          </div>
                          <Button variant="outline-primary" size="sm" className="w-100 mt-3">
                            View All Guides
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                    
                    <Col md={4} className="mb-4">
                      <Card className="h-100">
                        <Card.Header className="bg-success text-white">
                          <h6 className="mb-0">
                            <RiVideoLine className="me-2" />
                            Video Tutorials
                          </h6>
                        </Card.Header>
                        <Card.Body>
                          <div className="list-group list-group-flush">
                            <div className="list-group-item px-0">Breaking Bad News Techniques</div>
                            <div className="list-group-item px-0">Physical Examination Skills</div>
                            <div className="list-group-item px-0">Sterile Technique Demonstration</div>
                            <div className="list-group-item px-0">Patient Communication</div>
                          </div>
                          <Button variant="outline-success" size="sm" className="w-100 mt-3">
                            Watch Videos
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                    
                    <Col md={4} className="mb-4">
                      <Card className="h-100">
                        <Card.Header className="bg-warning text-white">
                          <h6 className="mb-0">
                            <RiFileTextLine className="me-2" />
                            Assessment Criteria
                          </h6>
                        </Card.Header>
                        <Card.Body>
                          <div className="list-group list-group-flush">
                            <div className="list-group-item px-0">OSCE Marking Schemes</div>
                            <div className="list-group-item px-0">Common Mistakes to Avoid</div>
                            <div className="list-group-item px-0">Performance Standards</div>
                            <div className="list-group-item px-0">Feedback Guidelines</div>
                          </div>
                          <Button variant="outline-warning" size="sm" className="w-100 mt-3">
                            Download PDFs
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Tab.Pane>
            </Tab.Content>
          </Card>
        </Tab.Container>

        {/* Scenario Details Modal */}
        <Modal show={showScenarioModal} onHide={() => setShowScenarioModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedScenario?.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedScenario && (
              <>
                <Row className="mb-3">
                  <Col md={6}>
                    <strong>Category:</strong> {selectedScenario.category}
                  </Col>
                  <Col md={6}>
                    <strong>Difficulty:</strong> 
                    <Badge bg={getDifficultyVariant(selectedScenario.difficulty)} className="ms-2">
                      {selectedScenario.difficulty}
                    </Badge>
                  </Col>
                </Row>
                
                <p className="mb-3">{selectedScenario.description}</p>
                
                <Accordion>
                  <Accordion.Item eventKey="objectives">
                    <Accordion.Header>Learning Objectives</Accordion.Header>
                    <Accordion.Body>
                      <ul>
                        {selectedScenario.learningObjectives?.map((obj, idx) => (
                          <li key={idx}>{obj}</li>
                        ))}
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                  
                  <Accordion.Item eventKey="equipment">
                    <Accordion.Header>Required Equipment</Accordion.Header>
                    <Accordion.Body>
                      <div className="d-flex flex-wrap gap-2">
                        {selectedScenario.equipment?.map((item, idx) => (
                          <Badge key={idx} bg="light" text="dark">{item}</Badge>
                        ))}
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                  
                  <Accordion.Item eventKey="mistakes">
                    <Accordion.Header>Common Mistakes</Accordion.Header>
                    <Accordion.Body>
                      <ul>
                        {selectedScenario.commonMistakes?.map((mistake, idx) => (
                          <li key={idx} className="text-danger">{mistake}</li>
                        ))}
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowScenarioModal(false)}>
              Close
            </Button>
            <Button 
              variant="primary" 
              onClick={() => {
                setShowScenarioModal(false);
                if (selectedScenario) startSession(selectedScenario);
              }}
            >
              Start Practice
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Performance Analytics Modal */}
        <Modal show={showPerformanceModal} onHide={() => setShowPerformanceModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Performance Analytics</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table striped>
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th>Attempts</th>
                  <th>Best Score</th>
                  <th>Category</th>
                  <th>Last Attempt</th>
                </tr>
              </thead>
              <tbody>
                {scenarios.filter(s => s.attempts > 0).map(scenario => (
                  <tr key={scenario.id}>
                    <td>{scenario.title}</td>
                    <td>{scenario.attempts}</td>
                    <td>
                      <Badge bg={scenario.bestScore >= 80 ? 'success' : scenario.bestScore >= 70 ? 'warning' : 'danger'}>
                        {scenario.bestScore}%
                      </Badge>
                    </td>
                    <td>{scenario.category}</td>
                    <td>-</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowPerformanceModal(false)}>
              Close
            </Button>
            <Button variant="primary">
              <RiDownloadLine className="me-1" />
              Export Report
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Custom Styles */}
        <style jsx>{`
          .scenario-card {
            transition: transform 0.2s, box-shadow 0.2s;
          }
          .scenario-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          }
          .bg-gradient-primary {
            background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
          }
          .blink {
            animation: blink 1s infinite;
          }
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.5; }
          }
          .performance-chart {
            max-height: 300px;
            overflow-y: auto;
          }
        `}</style>
      </Container>
  );
};

export default AdvancedOSCEScenario;