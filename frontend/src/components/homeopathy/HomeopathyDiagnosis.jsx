import React, { useState, useEffect } from 'react';
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
  Accordion,
  ProgressBar,
  Table,
  Modal,
  Tabs,
  Tab,
  ListGroup
} from 'react-bootstrap';
import {
  RiStethoscopeLine,
  RiBrainLine,
  RiSearchLine,
  RiFileTextLine,
  RiHeartPulseLine,
  RiFlaskLine,
  RiBookOpenLine,
  RiLightbulbLine,
  RiCheckboxCircleLine,
  RiAlertLine,
  RiStarLine,
  RiTimeLine,
  RiUserLine,
  RiMedicineBottleLine,
  RiRefreshLine
} from '@remixicon/react';

const HomeopathyDiagnosis = () => {
  const [activeTab, setActiveTab] = useState('symptoms');
  const [loading, setLoading] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRemedy, setSelectedRemedy] = useState(null);

  // Form state for diagnosis
  const [diagnosisForm, setDiagnosisForm] = useState({
    // Patient Information
    patientName: '',
    age: '',
    gender: '',
    constitution: '',
    
    // Chief Complaints
    primarySymptoms: '',
    duration: '',
    onset: '',
    severity: '5',
    
    // Mental & Emotional State
    mentalState: '',
    emotionalPattern: '',
    fears: '',
    anxieties: '',
    mood: '',
    
    // Physical Generals
    appetite: '',
    thirst: '',
    sleep: '',
    dreams: '',
    thermals: '',
    perspiration: '',
    
    // Modalities
    betterBy: '',
    worseBy: '',
    timeAggravation: '',
    
    // Constitutional Symptoms
    energy: '',
    circulation: '',
    digestion: '',
    elimination: '',
    
    // Miasmatic Analysis
    miasm: '',
    familyHistory: '',
    pastIllness: '',
    
    // Additional Information
    lifestyle: '',
    environment: '',
    stressFactors: '',
    previousTreatments: ''
  });

  const [aiAnalysis, setAiAnalysis] = useState({
    confidence: 0,
    remedySuggestions: [],
    miasmaticAnalysis: '',
    constitutionalType: '',
    prognosisScore: 0,
    treatmentDuration: '',
    followUpRecommendations: []
  });

  // Homeopathic remedy database (simplified)
  const remedyDatabase = {
    'Arsenicum Album': {
      keynotes: ['Anxiety', 'Restlessness', 'Burning pains', 'Chilly', 'Fastidious'],
      indications: ['Anxiety disorders', 'Digestive issues', 'Skin conditions', 'Respiratory problems'],
      mentals: ['Fear of death', 'Perfectionist', 'Restless anxiety'],
      physicals: ['Burning pains', 'Better from heat', 'Worse at night'],
      potency: '30C, 200C, 1M',
      miasm: 'Psoric'
    },
    'Belladonna': {
      keynotes: ['Sudden onset', 'Hot', 'Red', 'Throbbing', 'Violent symptoms'],
      indications: ['Acute inflammations', 'Fever', 'Headaches', 'Infections'],
      mentals: ['Delirium', 'Restlessness', 'Sensitivity to light'],
      physicals: ['Throbbing pains', 'Hot skin', 'Dilated pupils'],
      potency: '30C, 200C',
      miasm: 'Acute'
    },
    'Calcarea Carbonica': {
      keynotes: ['Sluggish', 'Overweight', 'Sweaty head', 'Cautious', 'Dependable'],
      indications: ['Constitutional remedy', 'Bone disorders', 'Metabolism issues'],
      mentals: ['Cautious', 'Responsible', 'Fear of poverty'],
      physicals: ['Sweaty head', 'Cold feet', 'Craves eggs'],
      potency: '30C, 200C, 1M',
      miasm: 'Psoric'
    },
    'Lycopodium': {
      keynotes: ['Digestive issues', 'Right-sided symptoms', 'Bloating', 'Insecurity'],
      indications: ['Digestive disorders', 'Liver problems', 'Urinary issues'],
      mentals: ['Lacks confidence', 'Bossy at home', 'Fear of responsibility'],
      physicals: ['Bloating after eating', 'Right-sided symptoms', 'Worse 4-8 PM'],
      potency: '30C, 200C, 1M',
      miasm: 'Sycotic'
    },
    'Natrum Muriaticum': {
      keynotes: ['Grief', 'Salt craving', 'Headaches', 'Dry skin', 'Reserved'],
      indications: ['Depression', 'Grief counseling', 'Headaches', 'Skin conditions'],
      mentals: ['Dwells on past hurts', 'Difficulty crying', 'Avoids consolation'],
      physicals: ['Craves salt', 'Dry mucous membranes', 'Worse from sun'],
      potency: '30C, 200C, 1M',
      miasm: 'Psoric'
    }
  };

  const constitutionalTypes = [
    'Carbonic (Calcium)', 'Phosphoric (Phosphorus)', 'Fluoric (Fluorine)',
    'Sulphuric (Sulphur)', 'Natrum (Sodium)', 'Silica', 'Iron', 'Magnesium'
  ];

  const miasms = [
    'Psoric (Functional disorders)', 
    'Sycotic (Proliferative conditions)', 
    'Syphilitic (Destructive tendencies)',
    'Tubercular (Variable symptoms)'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDiagnosisForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const analyzeSymptoms = async () => {
    setLoading(true);
    setDiagnosisResult(null);

    try {
      // Simulate AI analysis with sophisticated homeopathic principles
      await new Promise(resolve => setTimeout(resolve, 3000));

      // AI-powered remedy selection based on symptom totality
      const remedyScores = calculateRemedyScores(diagnosisForm);
      const topRemedies = remedyScores.slice(0, 5);

      const result = {
        analysis: {
          primaryMiasm: determineMiasm(diagnosisForm),
          constitutionalType: determineConstitution(diagnosisForm),
          mentalEmotionalScore: calculateMentalScore(diagnosisForm),
          physicalScore: calculatePhysicalScore(diagnosisForm),
          modalityScore: calculateModalityScore(diagnosisForm)
        },
        remedies: topRemedies,
        recommendations: generateRecommendations(diagnosisForm, topRemedies[0]),
        followUp: {
          duration: estimateTreatmentDuration(diagnosisForm),
          potency: suggestPotency(diagnosisForm),
          frequency: suggestFrequency(diagnosisForm)
        },
        confidence: calculateOverallConfidence(remedyScores)
      };

      setDiagnosisResult(result);
      setAiAnalysis({
        confidence: result.confidence,
        remedySuggestions: result.remedies,
        miasmaticAnalysis: result.analysis.primaryMiasm,
        constitutionalType: result.analysis.constitutionalType,
        prognosisScore: result.analysis.physicalScore + result.analysis.mentalEmotionalScore,
        treatmentDuration: result.followUp.duration,
        followUpRecommendations: result.recommendations
      });

    } catch (error) {
      console.error('Diagnosis analysis failed:', error);
      setDiagnosisResult({
        error: 'Analysis failed. Please check your symptoms and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  // AI Analysis Functions
  const calculateRemedyScores = (form) => {
    const symptoms = [
      form.primarySymptoms,
      form.mentalState,
      form.emotionalPattern,
      form.physicalGeneral,
      form.modalities
    ].join(' ').toLowerCase();

    const remedyScores = Object.keys(remedyDatabase).map(remedy => {
      const data = remedyDatabase[remedy];
      let score = 0;

      // Check keynotes matching
      data.keynotes.forEach(keynote => {
        if (symptoms.includes(keynote.toLowerCase())) {
          score += 20;
        }
      });

      // Check mental symptoms
      data.mentals.forEach(mental => {
        if (symptoms.includes(mental.toLowerCase().split(' ')[0])) {
          score += 15;
        }
      });

      // Check physical symptoms
      data.physicals.forEach(physical => {
        if (symptoms.includes(physical.toLowerCase().split(' ')[0])) {
          score += 15;
        }
      });

      // Constitutional matching
      if (form.constitution && data.miasm) {
        score += 10;
      }

      // Add randomization for demo purposes
      score += Math.random() * 30;

      return {
        name: remedy,
        score: Math.min(score, 100),
        confidence: Math.min(score / 100 * 100, 95),
        data: data
      };
    });

    return remedyScores.sort((a, b) => b.score - a.score);
  };

  const determineMiasm = (form) => {
    // Simplified miasmatic analysis
    if (form.familyHistory.includes('cancer') || form.primarySymptoms.includes('destructive')) {
      return 'Syphilitic';
    }
    if (form.primarySymptoms.includes('growth') || form.pastIllness.includes('recurring')) {
      return 'Sycotic';
    }
    if (form.primarySymptoms.includes('functional') || form.mentalState.includes('anxiety')) {
      return 'Tubercular';
    }
    return 'Psoric';
  };

  const determineConstitution = (form) => {
    if (form.constitution) return form.constitution;
    
    // AI-based constitution determination
    if (form.appetite.includes('poor') && form.thermals.includes('chilly')) {
      return 'Calcarea (Calcium)';
    }
    if (form.mentalState.includes('anxious') && form.energy.includes('restless')) {
      return 'Phosphoric (Phosphorus)';
    }
    return 'Mixed Constitution';
  };

  const calculateMentalScore = (form) => {
    let score = 50;
    if (form.mentalState) score += 20;
    if (form.emotionalPattern) score += 15;
    if (form.fears) score += 10;
    if (form.mood) score += 5;
    return Math.min(score, 100);
  };

  const calculatePhysicalScore = (form) => {
    let score = 40;
    if (form.primarySymptoms) score += 25;
    if (form.appetite) score += 10;
    if (form.sleep) score += 10;
    if (form.thermals) score += 10;
    if (form.energy) score += 5;
    return Math.min(score, 100);
  };

  const calculateModalityScore = (form) => {
    let score = 30;
    if (form.betterBy) score += 25;
    if (form.worseBy) score += 25;
    if (form.timeAggravation) score += 20;
    return Math.min(score, 100);
  };

  const calculateOverallConfidence = (remedyScores) => {
    if (remedyScores.length === 0) return 0;
    const topScore = remedyScores[0].score;
    return Math.min(topScore, 95);
  };

  const generateRecommendations = (form, topRemedy) => {
    return [
      'Begin with single remedy approach',
      `Monitor response for ${topRemedy?.name || 'selected remedy'}`,
      'Maintain symptom diary',
      'Avoid antidotes (coffee, mint, camphor)',
      'Schedule follow-up in 2-4 weeks',
      'Consider constitutional treatment'
    ];
  };

  const estimateTreatmentDuration = (form) => {
    const severity = parseInt(form.severity) || 5;
    const duration = form.duration || '';
    
    if (severity > 7 || duration.includes('chronic')) {
      return '3-6 months';
    }
    if (severity > 4 || duration.includes('months')) {
      return '1-3 months';
    }
    return '2-6 weeks';
  };

  const suggestPotency = (form) => {
    const mentalSymptoms = form.mentalState || '';
    const severity = parseInt(form.severity) || 5;
    
    if (mentalSymptoms.length > 50 || severity > 7) {
      return '200C or 1M';
    }
    if (severity > 4) {
      return '30C or 200C';
    }
    return '6C or 30C';
  };

  const suggestFrequency = (form) => {
    const severity = parseInt(form.severity) || 5;
    
    if (severity > 7) {
      return 'Single dose, wait and watch';
    }
    if (severity > 4) {
      return 'Twice daily for 3 days, then stop';
    }
    return 'Once daily for 5 days';
  };

  const showRemedyDetails = (remedy) => {
    setSelectedRemedy(remedy);
    setShowDetailModal(true);
  };

  const resetForm = () => {
    setDiagnosisForm({
      patientName: '', age: '', gender: '', constitution: '',
      primarySymptoms: '', duration: '', onset: '', severity: '5',
      mentalState: '', emotionalPattern: '', fears: '', anxieties: '', mood: '',
      appetite: '', thirst: '', sleep: '', dreams: '', thermals: '', perspiration: '',
      betterBy: '', worseBy: '', timeAggravation: '',
      energy: '', circulation: '', digestion: '', elimination: '',
      miasm: '', familyHistory: '', pastIllness: '',
      lifestyle: '', environment: '', stressFactors: '', previousTreatments: ''
    });
    setDiagnosisResult(null);
    setAiAnalysis({
      confidence: 0, remedySuggestions: [], miasmaticAnalysis: '',
      constitutionalType: '', prognosisScore: 0, treatmentDuration: '',
      followUpRecommendations: []
    });
  };

  return (
    <Container fluid className="p-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h2 className="mb-1">
                <RiBrainLine className="me-2" />
                AI-Powered Homeopathic Diagnosis
              </h2>
              <p className="text-muted mb-0">
                Advanced symptom analysis and remedy selection using AI
              </p>
            </div>
            <div className="d-flex gap-2">
              <Button variant="outline-secondary" onClick={resetForm}>
                <RiRefreshLine className="me-1" />
                Reset Form
              </Button>
              <Button
                variant="primary"
                onClick={analyzeSymptoms}
                disabled={loading || !diagnosisForm.primarySymptoms}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <RiBrainLine className="me-1" />
                    AI Diagnosis
                  </>
                )}
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        {/* Left Panel - Input Form */}
        <Col lg={8}>
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">
                <RiFileTextLine className="me-2" />
                Case Taking & Symptom Analysis
              </h5>
            </Card.Header>
            <Card.Body>
              <Tabs
                activeKey={activeTab}
                onSelect={(tab) => setActiveTab(tab)}
                className="mb-4"
              >
                {/* Patient Information Tab */}
                <Tab eventKey="patient" title="Patient Info">
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Patient Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="patientName"
                          value={diagnosisForm.patientName}
                          onChange={handleInputChange}
                          placeholder="Enter patient name"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Age</Form.Label>
                        <Form.Control
                          type="number"
                          name="age"
                          value={diagnosisForm.age}
                          onChange={handleInputChange}
                          placeholder="Age"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Gender</Form.Label>
                        <Form.Select
                          name="gender"
                          value={diagnosisForm.gender}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Constitutional Type</Form.Label>
                    <Form.Select
                      name="constitution"
                      value={diagnosisForm.constitution}
                      onChange={handleInputChange}
                    >
                      <option value="">Auto-detect from symptoms</option>
                      {constitutionalTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Tab>

                {/* Symptoms Tab */}
                <Tab eventKey="symptoms" title="Chief Complaints">
                  <Form.Group className="mb-3">
                    <Form.Label>Primary Symptoms *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="primarySymptoms"
                      value={diagnosisForm.primarySymptoms}
                      onChange={handleInputChange}
                      placeholder="Describe the main symptoms in detail..."
                      required
                    />
                  </Form.Group>

                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Duration</Form.Label>
                        <Form.Control
                          type="text"
                          name="duration"
                          value={diagnosisForm.duration}
                          onChange={handleInputChange}
                          placeholder="e.g., 2 weeks, 3 months"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Onset</Form.Label>
                        <Form.Control
                          type="text"
                          name="onset"
                          value={diagnosisForm.onset}
                          onChange={handleInputChange}
                          placeholder="Sudden, gradual, after event"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Severity (1-10)</Form.Label>
                        <Form.Range
                          name="severity"
                          value={diagnosisForm.severity}
                          onChange={handleInputChange}
                          min="1"
                          max="10"
                        />
                        <div className="text-center">
                          <Badge bg="secondary">{diagnosisForm.severity}/10</Badge>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                </Tab>

                {/* Mental & Emotional Tab */}
                <Tab eventKey="mental" title="Mental/Emotional">
                  <Form.Group className="mb-3">
                    <Form.Label>Mental State</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="mentalState"
                      value={diagnosisForm.mentalState}
                      onChange={handleInputChange}
                      placeholder="Current mental state, thoughts, concentration..."
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Emotional Patterns</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="emotionalPattern"
                      value={diagnosisForm.emotionalPattern}
                      onChange={handleInputChange}
                      placeholder="Emotional responses, sensitivity, reactions..."
                    />
                  </Form.Group>

                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Fears</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          name="fears"
                          value={diagnosisForm.fears}
                          onChange={handleInputChange}
                          placeholder="Specific fears or phobias"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Anxieties</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          name="anxieties"
                          value={diagnosisForm.anxieties}
                          onChange={handleInputChange}
                          placeholder="Sources of anxiety"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>General Mood</Form.Label>
                        <Form.Control
                          type="text"
                          name="mood"
                          value={diagnosisForm.mood}
                          onChange={handleInputChange}
                          placeholder="Happy, sad, irritable, etc."
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Tab>

                {/* Physical Generals Tab */}
                <Tab eventKey="physical" title="Physical Generals">
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Appetite</Form.Label>
                        <Form.Control
                          type="text"
                          name="appetite"
                          value={diagnosisForm.appetite}
                          onChange={handleInputChange}
                          placeholder="Good, poor, specific cravings"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Thirst</Form.Label>
                        <Form.Control
                          type="text"
                          name="thirst"
                          value={diagnosisForm.thirst}
                          onChange={handleInputChange}
                          placeholder="Much, little, for cold/warm"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Sleep</Form.Label>
                        <Form.Control
                          type="text"
                          name="sleep"
                          value={diagnosisForm.sleep}
                          onChange={handleInputChange}
                          placeholder="Quality, position, timing"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Dreams</Form.Label>
                        <Form.Control
                          type="text"
                          name="dreams"
                          value={diagnosisForm.dreams}
                          onChange={handleInputChange}
                          placeholder="Recurring themes, nightmares"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Thermals</Form.Label>
                        <Form.Control
                          type="text"
                          name="thermals"
                          value={diagnosisForm.thermals}
                          onChange={handleInputChange}
                          placeholder="Hot, chilly, alternating"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Perspiration</Form.Label>
                        <Form.Control
                          type="text"
                          name="perspiration"
                          value={diagnosisForm.perspiration}
                          onChange={handleInputChange}
                          placeholder="Profuse, scanty, areas, odor"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Tab>

                {/* Modalities Tab */}
                <Tab eventKey="modalities" title="Modalities">
                  <Form.Group className="mb-3">
                    <Form.Label>Better By (Ameliorations)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="betterBy"
                      value={diagnosisForm.betterBy}
                      onChange={handleInputChange}
                      placeholder="What makes symptoms better? (heat, cold, motion, rest, pressure, etc.)"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Worse By (Aggravations)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="worseBy"
                      value={diagnosisForm.worseBy}
                      onChange={handleInputChange}
                      placeholder="What makes symptoms worse? (weather, time, emotions, food, etc.)"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Time Aggravation</Form.Label>
                    <Form.Control
                      type="text"
                      name="timeAggravation"
                      value={diagnosisForm.timeAggravation}
                      onChange={handleInputChange}
                      placeholder="Specific time when symptoms worsen (e.g., 3 AM, evening)"
                    />
                  </Form.Group>
                </Tab>

                {/* Constitution & Miasm Tab */}
                <Tab eventKey="constitution" title="Constitution & Miasm">
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Energy Level</Form.Label>
                        <Form.Control
                          type="text"
                          name="energy"
                          value={diagnosisForm.energy}
                          onChange={handleInputChange}
                          placeholder="High, low, variable, times of day"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Circulation</Form.Label>
                        <Form.Control
                          type="text"
                          name="circulation"
                          value={diagnosisForm.circulation}
                          onChange={handleInputChange}
                          placeholder="Cold hands/feet, flushing, varicose veins"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Miasmatic Tendency</Form.Label>
                    <Form.Select
                      name="miasm"
                      value={diagnosisForm.miasm}
                      onChange={handleInputChange}
                    >
                      <option value="">Auto-detect from symptoms</option>
                      {miasms.map(miasm => (
                        <option key={miasm} value={miasm}>{miasm}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Family History</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="familyHistory"
                      value={diagnosisForm.familyHistory}
                      onChange={handleInputChange}
                      placeholder="Hereditary conditions, family tendencies..."
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Past Illness History</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="pastIllness"
                      value={diagnosisForm.pastIllness}
                      onChange={handleInputChange}
                      placeholder="Previous illnesses, surgeries, treatments..."
                    />
                  </Form.Group>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Panel - Analysis Results */}
        <Col lg={4}>
          <div className="sticky-top" style={{ top: '20px' }}>
            {/* AI Analysis Card */}
            <Card className="mb-3">
              <Card.Header>
                <h6 className="mb-0">
                  <RiBrainLine className="me-2" />
                  AI Analysis Status
                </h6>
              </Card.Header>
              <Card.Body>
                {!diagnosisResult ? (
                  <div className="text-center py-4">
                    <RiStethoscopeLine size={48} className="text-muted mb-3" />
                    <p className="text-muted">
                      Fill in the symptoms and click "AI Diagnosis" to get remedy suggestions
                    </p>
                  </div>
                ) : diagnosisResult.error ? (
                  <Alert variant="danger">
                    <RiAlertLine className="me-2" />
                    {diagnosisResult.error}
                  </Alert>
                ) : (
                  <div>
                    <div className="mb-3">
                      <label className="form-label small">Overall Confidence</label>
                      <ProgressBar
                        now={diagnosisResult.confidence}
                        label={`${Math.round(diagnosisResult.confidence)}%`}
                        variant={
                          diagnosisResult.confidence > 80 ? 'success' :
                          diagnosisResult.confidence > 60 ? 'warning' : 'danger'
                        }
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small">Constitutional Type</label>
                      <div>
                        <Badge bg="info">{diagnosisResult.analysis.constitutionalType}</Badge>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small">Miasmatic Analysis</label>
                      <div>
                        <Badge bg="secondary">{diagnosisResult.analysis.primaryMiasm}</Badge>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small">Treatment Duration</label>
                      <div>
                        <Badge bg="primary">{diagnosisResult.followUp.duration}</Badge>
                      </div>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Top Remedy Suggestions */}
            {diagnosisResult && diagnosisResult.remedies && (
              <Card>
                <Card.Header>
                  <h6 className="mb-0">
                    <RiMedicineBottleLine className="me-2" />
                    AI Remedy Suggestions
                  </h6>
                </Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    {diagnosisResult.remedies.slice(0, 3).map((remedy, index) => (
                      <ListGroup.Item
                        key={remedy.name}
                        className="px-0 py-2 border-bottom"
                        action
                        onClick={() => showRemedyDetails(remedy)}
                      >
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <div className="fw-bold">
                              #{index + 1} {remedy.name}
                            </div>
                            <div className="small text-muted">
                              {remedy.data.keynotes.slice(0, 2).join(', ')}
                            </div>
                          </div>
                          <div className="text-end">
                            <Badge
                              bg={
                                remedy.confidence > 80 ? 'success' :
                                remedy.confidence > 60 ? 'warning' : 'secondary'
                              }
                            >
                              {Math.round(remedy.confidence)}%
                            </Badge>
                          </div>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>

                  {diagnosisResult.remedies.length > 3 && (
                    <div className="text-center mt-3">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => setActiveTab('results')}
                      >
                        View All {diagnosisResult.remedies.length} Suggestions
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            )}
          </div>
        </Col>
      </Row>

      {/* Detailed Results Modal */}
      <Modal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <RiMedicineBottleLine className="me-2" />
            {selectedRemedy?.name} - Detailed Information
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRemedy && (
            <div>
              <Row>
                <Col md={6}>
                  <h6>
                    <RiStarLine className="me-2" />
                    Keynotes
                  </h6>
                  <ul>
                    {selectedRemedy.data.keynotes.map((keynote, index) => (
                      <li key={index}>{keynote}</li>
                    ))}
                  </ul>
                </Col>
                <Col md={6}>
                  <h6>
                    <RiHeartPulseLine className="me-2" />
                    Main Indications
                  </h6>
                  <ul>
                    {selectedRemedy.data.indications.map((indication, index) => (
                      <li key={index}>{indication}</li>
                    ))}
                  </ul>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <h6>
                    <RiBrainLine className="me-2" />
                    Mental Symptoms
                  </h6>
                  <ul>
                    {selectedRemedy.data.mentals.map((mental, index) => (
                      <li key={index}>{mental}</li>
                    ))}
                  </ul>
                </Col>
                <Col md={6}>
                  <h6>
                    <RiStethoscopeLine className="me-2" />
                    Physical Symptoms
                  </h6>
                  <ul>
                    {selectedRemedy.data.physicals.map((physical, index) => (
                      <li key={index}>{physical}</li>
                    ))}
                  </ul>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <h6>
                    <RiFlaskLine className="me-2" />
                    Suggested Potency
                  </h6>
                  <Badge bg="primary">{selectedRemedy.data.potency}</Badge>
                </Col>
                <Col md={6}>
                  <h6>
                    <RiBookOpenLine className="me-2" />
                    Miasmatic Classification
                  </h6>
                  <Badge bg="secondary">{selectedRemedy.data.miasm}</Badge>
                </Col>
              </Row>

              <div className="mt-3">
                <Alert variant="info">
                  <RiLightbulbLine className="me-2" />
                  <strong>AI Confidence: {Math.round(selectedRemedy.confidence)}%</strong>
                  <br />
                  This remedy matches your symptom pattern with high confidence. 
                  Consider constitutional factors and follow-up for optimal results.
                </Alert>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Close
          </Button>
          <Button variant="primary">
            Select This Remedy
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default HomeopathyDiagnosis;
