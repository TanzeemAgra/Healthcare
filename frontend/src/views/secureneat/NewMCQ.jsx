import React, { useState } from 'react';
import { Card, Button, Badge, Alert, ProgressBar, Row, Col, Nav, Tab, Form, Modal, Spinner } from 'react-bootstrap';
import { 
  RiQuestionLine, 
  RiCheckLine, 
  RiCloseLine, 
  RiRefreshLine, 
  RiUploadLine,
  RiFileTextLine,
  RiRobotLine,
  RiSettingsLine,
  RiTimeLine,
  RiAwardLine,
  RiBarChartLine,
  RiBookOpenLine
} from '@remixicon/react';

const NewSecureNeatMCQ = () => {
  const [activeTab, setActiveTab] = useState('practice');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [aiGeneratedQuestions, setAiGeneratedQuestions] = useState([]);
  
  // Practice Mode Settings
  const [practiceSettings, setPracticeSettings] = useState({
    category: 'Mixed',
    difficulty: 'Mixed',
    numberOfQuestions: 5,
    timeLimit: 0, // 0 = no limit
    showExplanations: true
  });

  // AI Book Mode Settings
  const [aiSettings, setAiSettings] = useState({
    chapterMode: 'consolidated', // 'consolidated' or 'chapter-wise'
    numberOfQuestions: 10,
    timeLimit: 30, // minutes
    focusAreas: [],
    difficulty: 'Mixed'
  });

  // Categories for practice mode
  const categories = [
    'Mixed', 'Cardiology', 'Respiratory', 'Gastroenterology', 
    'Neurology', 'Pediatrics', 'Surgery', 'Pharmacology', 
    'Psychiatry', 'Emergency Medicine'
  ];

  // Sample questions for practice mode
  const practiceQuestions = [
    {
      id: 1,
      category: 'Cardiology',
      difficulty: 'Intermediate',
      question: "What is the most common cause of community-acquired pneumonia?",
      options: [
        "Streptococcus pneumoniae",
        "Haemophilus influenzae", 
        "Mycoplasma pneumoniae",
        "Legionella pneumophila"
      ],
      correct: 0,
      explanation: "Streptococcus pneumoniae is the most common bacterial cause of community-acquired pneumonia, accounting for approximately 30-35% of cases.",
      chapter: "Respiratory Infections"
    },
    {
      id: 2,
      category: 'Endocrinology',
      difficulty: 'Advanced',
      question: "Which of the following is NOT a characteristic of Type 1 diabetes mellitus?",
      options: [
        "Usually develops in childhood or adolescence",
        "Associated with insulin resistance",
        "Requires insulin therapy",
        "Associated with autoimmune destruction of beta cells"
      ],
      correct: 1,
      explanation: "Insulin resistance is characteristic of Type 2 diabetes, not Type 1. Type 1 diabetes is caused by autoimmune destruction of pancreatic beta cells.",
      chapter: "Diabetes Mellitus"
    },
    {
      id: 3,
      category: 'Cardiology',
      difficulty: 'Beginner',
      question: "What is the normal range for adult resting heart rate?",
      options: [
        "40-60 bpm",
        "60-100 bpm",
        "80-120 bpm", 
        "100-140 bpm"
      ],
      correct: 1,
      explanation: "The normal resting heart rate for adults is 60-100 beats per minute. Athletes may have lower rates due to increased cardiac efficiency.",
      chapter: "Cardiovascular Physiology"
    },
    {
      id: 4,
      category: 'Neurology',
      difficulty: 'Intermediate',
      question: "Which cranial nerve is responsible for facial sensation?",
      options: [
        "Cranial nerve III (Oculomotor)",
        "Cranial nerve V (Trigeminal)",
        "Cranial nerve VII (Facial)",
        "Cranial nerve IX (Glossopharyngeal)"
      ],
      correct: 1,
      explanation: "Cranial nerve V (Trigeminal) is responsible for facial sensation. The facial nerve (CN VII) controls facial expression.",
      chapter: "Cranial Nerves"
    },
    {
      id: 5,
      category: 'Pharmacology',
      difficulty: 'Advanced',
      question: "What is the mechanism of action of ACE inhibitors?",
      options: [
        "Block calcium channels",
        "Inhibit angiotensin-converting enzyme",
        "Block beta-adrenergic receptors",
        "Inhibit sodium-potassium pump"
      ],
      correct: 1,
      explanation: "ACE inhibitors work by blocking the angiotensin-converting enzyme, preventing the conversion of angiotensin I to angiotensin II, thereby reducing vasoconstriction and aldosterone secretion.",
      chapter: "Cardiovascular Pharmacology"
    }
  ];

  const filterQuestions = () => {
    let filtered = [...practiceQuestions];
    
    if (practiceSettings.category !== 'Mixed') {
      filtered = filtered.filter(q => q.category === practiceSettings.category);
    }
    
    if (practiceSettings.difficulty !== 'Mixed') {
      filtered = filtered.filter(q => q.difficulty === practiceSettings.difficulty);
    }
    
    // Shuffle and limit to requested number
    filtered = filtered.sort(() => Math.random() - 0.5);
    return filtered.slice(0, practiceSettings.numberOfQuestions);
  };

  const getCurrentQuestions = () => {
    if (activeTab === 'ai-book' && aiGeneratedQuestions.length > 0) {
      return aiGeneratedQuestions;
    }
    return filterQuestions();
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerIndex
    });
  };

  const calculateScore = () => {
    const questions = getCurrentQuestions();
    let correct = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct) {
        correct++;
      }
    });
    return correct;
  };

  const getScorePercentage = () => {
    const questions = getCurrentQuestions();
    return Math.round((calculateScore() / questions.length) * 100);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setQuizStarted(false);
    setAiGeneratedQuestions([]);
  };

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const submitQuiz = () => {
    setShowResults(true);
  };

  // File upload handler
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      processed: false
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  // Simulate AI question generation
  const generateQuestionsFromBooks = async () => {
    if (uploadedFiles.length === 0) {
      alert('Please upload at least one book/document first.');
      return;
    }

    setIsGeneratingQuestions(true);
    setShowUploadModal(false);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Generate sample AI questions based on uploaded files
    const aiQuestions = [
      {
        id: 'ai1',
        category: 'AI Generated',
        difficulty: aiSettings.difficulty,
        question: `Based on the uploaded material: What is the primary mechanism of action discussed in Chapter 3 of "${uploadedFiles[0]?.name}"?`,
        options: [
          "Competitive inhibition of enzymes",
          "Non-competitive enzyme binding", 
          "Allosteric regulation",
          "Covalent modification"
        ],
        correct: 0,
        explanation: "According to the uploaded text analysis, competitive inhibition is the primary mechanism discussed in this chapter.",
        chapter: "Chapter 3: Enzyme Mechanisms",
        source: uploadedFiles[0]?.name || "Uploaded Document"
      },
      {
        id: 'ai2',
        category: 'AI Generated',
        difficulty: aiSettings.difficulty,
        question: "From the consolidated analysis of uploaded materials, which diagnostic criterion is most frequently mentioned?",
        options: [
          "Laboratory values above normal range",
          "Clinical symptoms lasting >48 hours",
          "Radiological findings consistent with pathology",
          "Patient history of similar episodes"
        ],
        correct: 2,
        explanation: "AI analysis identified radiological findings as the most frequently cited diagnostic criterion across the uploaded materials.",
        chapter: "Diagnostic Criteria Summary",
        source: "AI Analysis of All Uploaded Materials"
      }
    ];

    // Add more questions based on settings
    const additionalQuestions = Array.from({ length: Math.max(0, aiSettings.numberOfQuestions - 2) }, (_, index) => ({
      id: `ai${index + 3}`,
      category: 'AI Generated',
      difficulty: aiSettings.difficulty,
      question: `AI-generated question ${index + 3}: Which concept from the uploaded materials is most relevant to clinical practice?`,
      options: [
        `Concept A from Chapter ${index + 1}`,
        `Concept B from Chapter ${index + 2}`,
        `Concept C from Chapter ${index + 3}`,
        `Concept D from Chapter ${index + 4}`
      ],
      correct: Math.floor(Math.random() * 4),
      explanation: `This question was generated by AI analysis of the uploaded materials, focusing on clinically relevant concepts.`,
      chapter: `Chapter ${index + 1}`,
      source: "AI-Generated from Uploaded Content"
    }));

    setAiGeneratedQuestions([...aiQuestions, ...additionalQuestions]);
    setIsGeneratingQuestions(false);
    setQuizStarted(true);
    console.log(`Generated ${aiSettings.numberOfQuestions} questions from uploaded books using AI`);
  };

  // Generate weakness report and recommendations
  const generateRecommendations = () => {
    const questions = getCurrentQuestions();
    const incorrectQuestions = questions.filter((q, index) => selectedAnswers[index] !== q.correct);
    const weakAreas = {};
    
    incorrectQuestions.forEach(q => {
      const area = q.category || q.chapter;
      weakAreas[area] = (weakAreas[area] || 0) + 1;
    });

    const recommendations = Object.entries(weakAreas)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([area, count]) => ({
        area,
        count,
        suggestions: [
          `Review ${area} concepts and definitions`,
          `Practice more questions in ${area}`,
          `Study relevant clinical cases in ${area}`,
          `Consult additional resources for ${area}`
        ]
      }));

    return recommendations;
  };

  // If generating questions, show loading
  if (isGeneratingQuestions) {
    return (
      <div className="container-fluid p-4">
        <div className="text-center">
          <div style={{ fontSize: '4em', marginBottom: '20px' }}>🤖</div>
          <h3 className="mb-3">AI Question Generation in Progress</h3>
          <p className="text-muted mb-4">
            Our AI is analyzing your uploaded materials and generating customized questions...
          </p>
          <Spinner animation="border" variant="primary" className="mb-3" />
          <div className="progress-text">
            <small className="text-muted">
              Processing {uploadedFiles.length} file(s) • Generating {aiSettings.numberOfQuestions} questions
            </small>
          </div>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="container-fluid p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h3 mb-1">
              <RiQuestionLine className="me-2" />
              MCQ Practice Center
            </h1>
            <p className="text-muted mb-0">Enhanced practice with AI-powered question generation</p>
          </div>
          <Badge bg="success" pill className="fs-6">
            ✅ Full Access
          </Badge>
        </div>

        {/* Success Alert */}
        <Alert variant="success" className="mb-4">
          <div className="d-flex align-items-center">
            <div className="me-2">🎯</div>
            <div>
              <strong>Enhanced MCQ Practice!</strong> Choose between traditional practice or AI-generated questions from your own study materials.
            </div>
          </div>
        </Alert>

        {/* Tab Navigation */}
        <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
          <Nav variant="pills" className="mb-4">
            <Nav.Item>
              <Nav.Link eventKey="practice">
                <RiBookOpenLine className="me-2" />
                Practice Mode
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="ai-book">
                <RiRobotLine className="me-2" />
                AI Book Mode
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            {/* Practice Mode Tab */}
            <Tab.Pane eventKey="practice">
              <Card className="border-0 shadow-sm" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center mb-3">
                    <RiBookOpenLine className="me-2 text-primary" size={24} />
                    <h5 className="mb-0">Practice Mode Settings</h5>
                    <Button 
                      variant="outline-secondary" 
                      size="sm" 
                      className="ms-auto"
                      onClick={() => setShowSettingsModal(true)}
                    >
                      <RiSettingsLine className="me-1" />
                      Customize
                    </Button>
                  </div>
                  
                  <Row className="mb-3">
                    <Col md={6}>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Category:</span>
                        <Badge bg="primary">{practiceSettings.category}</Badge>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Questions:</span>
                        <Badge bg="info">{practiceSettings.numberOfQuestions}</Badge>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Difficulty:</span>
                        <Badge bg="warning">{practiceSettings.difficulty}</Badge>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Time Limit:</span>
                        <Badge bg="secondary">
                          {practiceSettings.timeLimit === 0 ? 'No Limit' : `${practiceSettings.timeLimit} min`}
                        </Badge>
                      </div>
                    </Col>
                  </Row>
                  
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="w-100"
                    onClick={startQuiz}
                  >
                    Start Practice Session
                  </Button>
                </Card.Body>
              </Card>
            </Tab.Pane>

            {/* AI Book Mode Tab */}
            <Tab.Pane eventKey="ai-book">
              <Card className="border-0 shadow-sm" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center mb-3">
                    <RiRobotLine className="me-2 text-success" size={24} />
                    <h5 className="mb-0">AI-Powered Question Generation</h5>
                  </div>
                  
                  <Alert variant="info" className="mb-3">
                    <strong>How it works:</strong> Upload your study materials (PDFs, texts) and our AI will generate customized MCQs based on the content, organized by chapters or as a consolidated test.
                  </Alert>

                  {/* Upload Section */}
                  <div className="mb-4">
                    <h6 className="mb-3">📚 Uploaded Study Materials</h6>
                    {uploadedFiles.length === 0 ? (
                      <div className="text-center py-4 border border-dashed rounded">
                        <RiUploadLine size={48} className="text-muted mb-2" />
                        <p className="text-muted mb-2">No files uploaded yet</p>
                        <Button 
                          variant="outline-primary" 
                          onClick={() => setShowUploadModal(true)}
                        >
                          <RiUploadLine className="me-2" />
                          Upload Study Materials
                        </Button>
                      </div>
                    ) : (
                      <div>
                        {uploadedFiles.map(file => (
                          <div key={file.id} className="d-flex align-items-center justify-content-between p-2 border rounded mb-2">
                            <div className="d-flex align-items-center">
                              <RiFileTextLine className="me-2 text-primary" />
                              <div>
                                <div className="fw-bold">{file.name}</div>
                                <small className="text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</small>
                              </div>
                            </div>
                            <Badge bg="success">Ready</Badge>
                          </div>
                        ))}
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => setShowUploadModal(true)}
                        >
                          <RiUploadLine className="me-1" />
                          Add More Files
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* AI Settings */}
                  <div className="mb-4">
                    <h6 className="mb-3">🤖 AI Generation Settings</h6>
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Label>Question Mode</Form.Label>
                        <Form.Select 
                          value={aiSettings.chapterMode}
                          onChange={(e) => setAiSettings({...aiSettings, chapterMode: e.target.value})}
                        >
                          <option value="consolidated">Consolidated Test</option>
                          <option value="chapter-wise">Chapter-wise Questions</option>
                        </Form.Select>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Number of Questions</Form.Label>
                        <Form.Select 
                          value={aiSettings.numberOfQuestions}
                          onChange={(e) => setAiSettings({...aiSettings, numberOfQuestions: parseInt(e.target.value)})}
                        >
                          <option value={5}>5 Questions</option>
                          <option value={10}>10 Questions</option>
                          <option value={15}>15 Questions</option>
                          <option value={20}>20 Questions</option>
                          <option value={25}>25 Questions</option>
                        </Form.Select>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Time Limit</Form.Label>
                        <Form.Select 
                          value={aiSettings.timeLimit}
                          onChange={(e) => setAiSettings({...aiSettings, timeLimit: parseInt(e.target.value)})}
                        >
                          <option value={15}>15 minutes</option>
                          <option value={30}>30 minutes</option>
                          <option value={45}>45 minutes</option>
                          <option value={60}>60 minutes</option>
                          <option value={0}>No time limit</option>
                        </Form.Select>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Difficulty Level</Form.Label>
                        <Form.Select 
                          value={aiSettings.difficulty}
                          onChange={(e) => setAiSettings({...aiSettings, difficulty: e.target.value})}
                        >
                          <option value="Mixed">Mixed</option>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </Form.Select>
                      </Col>
                    </Row>
                  </div>

                  <Button 
                    variant="success" 
                    size="lg" 
                    className="w-100"
                    onClick={generateQuestionsFromBooks}
                    disabled={uploadedFiles.length === 0}
                  >
                    <RiRobotLine className="me-2" />
                    Generate AI Questions & Start Test
                  </Button>
                </Card.Body>
              </Card>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const percentage = getScorePercentage();
    
    return (
      <div className="container-fluid p-4">
        <div className="text-center mb-4">
          <h1 className="h3 mb-3">Quiz Results</h1>
          <div style={{ fontSize: '4em', marginBottom: '20px' }}>
            {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '📚'}
          </div>
        </div>

        <Card className="border-0 shadow-sm" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Card.Body>
            <div className="text-center mb-4">
              <h4>Your Score: {score}/{questions.length}</h4>
              <h2 className={`mb-3 ${percentage >= 80 ? 'text-success' : percentage >= 60 ? 'text-warning' : 'text-danger'}`}>
                {percentage}%
              </h2>
              <ProgressBar 
                variant={percentage >= 80 ? 'success' : percentage >= 60 ? 'warning' : 'danger'}
                now={percentage}
                style={{ height: '10px' }}
                className="mb-3"
              />
            </div>

            <h5 className="mb-3">Question Review</h5>
            {questions.map((question, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === question.correct;
              
              return (
                <Card key={question.id} className="mb-3 border-0 bg-light">
                  <Card.Body>
                    <div className="d-flex align-items-start mb-2">
                      <div className="me-2 mt-1">
                        {isCorrect ? (
                          <RiCheckLine className="text-success" />
                        ) : (
                          <RiCloseLine className="text-danger" />
                        )}
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-2">Question {index + 1}</h6>
                        <p className="mb-2">{question.question}</p>
                        
                        <div className="mb-2">
                          <small className="text-muted">Your answer: </small>
                          <span className={isCorrect ? 'text-success' : 'text-danger'}>
                            {question.options[userAnswer] || 'Not answered'}
                          </span>
                        </div>
                        
                        {!isCorrect && (
                          <div className="mb-2">
                            <small className="text-muted">Correct answer: </small>
                            <span className="text-success">
                              {question.options[question.correct]}
                            </span>
                          </div>
                        )}
                        
                        <div className="mt-2 p-2 bg-white rounded">
                          <small className="text-muted">
                            <strong>Explanation:</strong> {question.explanation}
                          </small>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              );
            })}

            <div className="text-center mt-4">
              <Button variant="primary" onClick={resetQuiz} className="me-2">
                <RiRefreshLine className="me-1" />
                Try Again
              </Button>
              <Button variant="outline-secondary" href="/SecureNeat/dashboard">
                Back to Dashboard
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }

  // Quiz in progress
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">
            <RiQuestionLine className="me-2" />
            MCQ Practice
          </h1>
          <p className="text-muted mb-0">Question {currentQuestion + 1} of {questions.length}</p>
        </div>
        <Badge bg="success" pill>
          ✅ Full Access
        </Badge>
      </div>

      {/* Progress Bar */}
      <ProgressBar now={progress} className="mb-4" style={{ height: '8px' }} />

      {/* Question Card */}
      <Card className="border-0 shadow-sm" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card.Body className="p-4">
          <h5 className="mb-4">Question {currentQuestion + 1}</h5>
          <h4 className="mb-4">{question.question}</h4>
          
          <div className="mb-4">
            {question.options.map((option, index) => (
              <div key={index} className="mb-2">
                <Button
                  variant={selectedAnswers[currentQuestion] === index ? 'primary' : 'outline-secondary'}
                  className="w-100 text-start p-3"
                  onClick={() => handleAnswerSelect(currentQuestion, index)}
                >
                  <div className="d-flex align-items-center">
                    <span className="me-3 fw-bold">{String.fromCharCode(65 + index)}.</span>
                    <span>{option}</span>
                  </div>
                </Button>
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-between">
            <Button
              variant="outline-secondary"
              disabled={currentQuestion === 0}
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
            >
              Previous
            </Button>
            
            {currentQuestion === questions.length - 1 ? (
              <Button
                variant="success"
                onClick={submitQuiz}
                disabled={Object.keys(selectedAnswers).length !== questions.length}
              >
                Submit Quiz
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                disabled={selectedAnswers[currentQuestion] === undefined}
              >
                Next
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default NewSecureNeatMCQ;
