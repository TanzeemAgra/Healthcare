import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Badge, Modal, ProgressBar, Tabs, Tab } from 'react-bootstrap';

const HomeopathyCaseTaking = () => {
  const [activeTab, setActiveTab] = useState('patient-info');
  const [isAIAnalyzing, setIsAIAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [showAIModal, setShowAIModal] = useState(false);
  
  const [patientData, setPatientData] = useState({
    // Basic Info
    name: '',
    age: '',
    gender: '',
    occupation: '',
    maritalStatus: '',
    
    // Chief Complaint
    chiefComplaint: '',
    duration: '',
    onset: '',
    progression: '',
    
    // Symptoms
    physical: '',
    mental: '',
    emotional: '',
    modalities: {
      better: '',
      worse: ''
    },
    
    // Constitutional
    appetite: '',
    thirst: '',
    sleep: '',
    temperature: '',
    
    // Medical History
    pastIllness: '',
    familyHistory: '',
    medications: ''
  });

  const [aiSuggestions, setAiSuggestions] = useState({
    remedies: [],
    rubrics: [],
    questions: [],
    insights: []
  });

  const [voiceRecording, setVoiceRecording] = useState(false);

  const handleAIAnalysis = async () => {
    setIsAIAnalyzing(true);
    setAnalysisProgress(0);
    
    // Simulate AI analysis progress
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAIAnalyzing(false);
          setShowAIModal(true);
          
          // Mock AI suggestions
          setAiSuggestions({
            remedies: [
              { name: 'Arsenicum Album', potency: '30C', confidence: 92, reasoning: 'Anxiety, restlessness, fear of death, burning pains ameliorated by heat' },
              { name: 'Phosphorus', potency: '200C', confidence: 87, reasoning: 'Tall, lean build, burning pains, desires cold drinks, sympathetic nature' },
              { name: 'Sulphur', potency: '6C', confidence: 78, reasoning: 'Skin symptoms, hot patient, philosophical mind, untidy appearance' }
            ],
            rubrics: [
              'Mind - Anxiety - health about',
              'Generals - Heat - sensation of',
              'Sleep - Sleeplessness - anxiety from',
              'Stomach - Thirst - large quantities for'
            ],
            questions: [
              'Does the patient feel better from warm applications?',
              'Are symptoms worse around midnight?',
              'Does the patient have a fear of being alone?',
              'Are there any burning sensations?'
            ],
            insights: [
              'Pattern suggests possible miasmatic influence of Psora',
              'Constitutional remedy may be needed for deep healing',
              'Consider potency based on symptom clarity and patient sensitivity'
            ]
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleVoiceRecording = () => {
    setVoiceRecording(!voiceRecording);
    // Implement voice recording logic
  };

  const quickSymptomButtons = [
    'Headache', 'Fever', 'Cough', 'Anxiety', 'Insomnia', 'Digestive Issues',
    'Joint Pain', 'Skin Problems', 'Respiratory Issues', 'Depression',
    'Fatigue', 'Hypertension'
  ];

  return (
    <div className="homeopathy-case-taking">
      <Container fluid>
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="mb-1">AI-Powered Case Taking</h2>
                <p className="text-muted mb-0">Intelligent homeopathic case analysis and repertorization</p>
              </div>
              <div className="d-flex gap-2">
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={handleVoiceRecording}
                  className={voiceRecording ? 'btn-recording' : ''}
                >
                  <i className={`ri-mic-${voiceRecording ? 'fill' : 'line'} me-1`}></i>
                  {voiceRecording ? 'Stop Recording' : 'Voice Input'}
                </Button>
                <Button variant="primary" size="sm" onClick={handleAIAnalysis} disabled={isAIAnalyzing}>
                  <i className="ri-brain-line me-1"></i>
                  {isAIAnalyzing ? 'Analyzing...' : 'AI Analysis'}
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* AI Analysis Progress */}
        {isAIAnalyzing && (
          <Row className="mb-4">
            <Col>
              <Alert variant="info" className="mb-0">
                <div className="d-flex align-items-center">
                  <div className="spinner-border spinner-border-sm me-3" role="status"></div>
                  <div className="flex-grow-1">
                    <strong>AI Analysis in Progress...</strong>
                    <ProgressBar now={analysisProgress} className="mt-2" style={{height: '6px'}} />
                  </div>
                </div>
              </Alert>
            </Col>
          </Row>
        )}

        <Row>
          <Col lg={8}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
                  
                  {/* Patient Information Tab */}
                  <Tab eventKey="patient-info" title={
                    <span><i className="ri-user-line me-1"></i>Patient Info</span>
                  }>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Full Name</Form.Label>
                          <Form.Control 
                            type="text" 
                            placeholder="Enter patient name"
                            value={patientData.name}
                            onChange={(e) => setPatientData({...patientData, name: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Age</Form.Label>
                          <Form.Control 
                            type="number" 
                            placeholder="Age"
                            value={patientData.age}
                            onChange={(e) => setPatientData({...patientData, age: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Gender</Form.Label>
                          <Form.Select 
                            value={patientData.gender}
                            onChange={(e) => setPatientData({...patientData, gender: e.target.value})}
                          >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Occupation</Form.Label>
                          <Form.Control 
                            type="text" 
                            placeholder="Patient's occupation"
                            value={patientData.occupation}
                            onChange={(e) => setPatientData({...patientData, occupation: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Marital Status</Form.Label>
                          <Form.Select 
                            value={patientData.maritalStatus}
                            onChange={(e) => setPatientData({...patientData, maritalStatus: e.target.value})}
                          >
                            <option value="">Select</option>
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                            <option value="divorced">Divorced</option>
                            <option value="widowed">Widowed</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Tab>

                  {/* Chief Complaint Tab */}
                  <Tab eventKey="chief-complaint" title={
                    <span><i className="ri-file-text-line me-1"></i>Chief Complaint</span>
                  }>
                    <Form.Group className="mb-3">
                      <Form.Label>Chief Complaint</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={4}
                        placeholder="Describe the main problem in patient's own words..."
                        value={patientData.chiefComplaint}
                        onChange={(e) => setPatientData({...patientData, chiefComplaint: e.target.value})}
                      />
                    </Form.Group>
                    
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Duration</Form.Label>
                          <Form.Control 
                            type="text" 
                            placeholder="e.g., 2 weeks, 3 months"
                            value={patientData.duration}
                            onChange={(e) => setPatientData({...patientData, duration: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Onset</Form.Label>
                          <Form.Select 
                            value={patientData.onset}
                            onChange={(e) => setPatientData({...patientData, onset: e.target.value})}
                          >
                            <option value="">Select</option>
                            <option value="sudden">Sudden</option>
                            <option value="gradual">Gradual</option>
                            <option value="insidious">Insidious</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Progression</Form.Label>
                          <Form.Select 
                            value={patientData.progression}
                            onChange={(e) => setPatientData({...patientData, progression: e.target.value})}
                          >
                            <option value="">Select</option>
                            <option value="progressive">Progressive</option>
                            <option value="static">Static</option>
                            <option value="intermittent">Intermittent</option>
                            <option value="improving">Improving</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Quick Symptom Selection */}
                    <div className="mb-3">
                      <Form.Label>Quick Symptom Selection</Form.Label>
                      <div className="d-flex flex-wrap gap-2">
                        {quickSymptomButtons.map((symptom) => (
                          <Button 
                            key={symptom}
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => {
                              const current = patientData.chiefComplaint;
                              setPatientData({
                                ...patientData, 
                                chiefComplaint: current ? `${current}, ${symptom}` : symptom
                              });
                            }}
                          >
                            {symptom}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </Tab>

                  {/* Symptoms Tab */}
                  <Tab eventKey="symptoms" title={
                    <span><i className="ri-pulse-line me-1"></i>Symptoms</span>
                  }>
                    <Form.Group className="mb-3">
                      <Form.Label>Physical Symptoms</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={3}
                        placeholder="Describe physical symptoms, sensations, and location..."
                        value={patientData.physical}
                        onChange={(e) => setPatientData({...patientData, physical: e.target.value})}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Mental Symptoms</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={3}
                        placeholder="Mental state, thoughts, fears, anxieties..."
                        value={patientData.mental}
                        onChange={(e) => setPatientData({...patientData, mental: e.target.value})}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Emotional State</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={3}
                        placeholder="Emotional patterns, mood changes, triggers..."
                        value={patientData.emotional}
                        onChange={(e) => setPatientData({...patientData, emotional: e.target.value})}
                      />
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Modalities - Better From</Form.Label>
                          <Form.Control 
                            as="textarea" 
                            rows={2}
                            placeholder="What makes symptoms better..."
                            value={patientData.modalities.better}
                            onChange={(e) => setPatientData({
                              ...patientData, 
                              modalities: {...patientData.modalities, better: e.target.value}
                            })}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Modalities - Worse From</Form.Label>
                          <Form.Control 
                            as="textarea" 
                            rows={2}
                            placeholder="What makes symptoms worse..."
                            value={patientData.modalities.worse}
                            onChange={(e) => setPatientData({
                              ...patientData, 
                              modalities: {...patientData.modalities, worse: e.target.value}
                            })}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Tab>

                  {/* Constitutional Tab */}
                  <Tab eventKey="constitutional" title={
                    <span><i className="ri-body-scan-line me-1"></i>Constitutional</span>
                  }>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Appetite</Form.Label>
                          <Form.Select 
                            value={patientData.appetite}
                            onChange={(e) => setPatientData({...patientData, appetite: e.target.value})}
                          >
                            <option value="">Select</option>
                            <option value="good">Good</option>
                            <option value="poor">Poor</option>
                            <option value="variable">Variable</option>
                            <option value="increased">Increased</option>
                            <option value="decreased">Decreased</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Thirst</Form.Label>
                          <Form.Select 
                            value={patientData.thirst}
                            onChange={(e) => setPatientData({...patientData, thirst: e.target.value})}
                          >
                            <option value="">Select</option>
                            <option value="normal">Normal</option>
                            <option value="increased">Increased</option>
                            <option value="decreased">Decreased</option>
                            <option value="thirstless">Thirstless</option>
                            <option value="large-quantities">Large quantities</option>
                            <option value="small-sips">Small sips</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Sleep Pattern</Form.Label>
                          <Form.Control 
                            type="text" 
                            placeholder="Sleep quality, duration, disturbances..."
                            value={patientData.sleep}
                            onChange={(e) => setPatientData({...patientData, sleep: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Temperature Preference</Form.Label>
                          <Form.Select 
                            value={patientData.temperature}
                            onChange={(e) => setPatientData({...patientData, temperature: e.target.value})}
                          >
                            <option value="">Select</option>
                            <option value="hot">Hot (wants cool)</option>
                            <option value="cold">Cold (wants warm)</option>
                            <option value="variable">Variable</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Tab>

                  {/* Medical History Tab */}
                  <Tab eventKey="history" title={
                    <span><i className="ri-history-line me-1"></i>Medical History</span>
                  }>
                    <Form.Group className="mb-3">
                      <Form.Label>Past Medical History</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={3}
                        placeholder="Previous illnesses, surgeries, significant medical events..."
                        value={patientData.pastIllness}
                        onChange={(e) => setPatientData({...patientData, pastIllness: e.target.value})}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Family History</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={3}
                        placeholder="Hereditary conditions, family medical history..."
                        value={patientData.familyHistory}
                        onChange={(e) => setPatientData({...patientData, familyHistory: e.target.value})}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Current Medications</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={3}
                        placeholder="Current allopathic medications, supplements..."
                        value={patientData.medications}
                        onChange={(e) => setPatientData({...patientData, medications: e.target.value})}
                      />
                    </Form.Group>
                  </Tab>
                </Tabs>

                <div className="d-flex justify-content-between">
                  <Button variant="outline-secondary">
                    <i className="ri-save-line me-1"></i>Save Draft
                  </Button>
                  <div className="d-flex gap-2">
                    <Button variant="outline-primary" onClick={handleAIAnalysis}>
                      <i className="ri-brain-line me-1"></i>AI Analysis
                    </Button>
                    <Button variant="primary">
                      <i className="ri-file-text-line me-1"></i>Generate Case Report
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* AI Assistant Panel */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm sticky-top">
              <Card.Header className="bg-primary text-white">
                <h6 className="mb-0">
                  <i className="ri-robot-line me-2"></i>
                  AI Assistant
                </h6>
              </Card.Header>
              <Card.Body>
                <Alert variant="info" className="small">
                  <i className="ri-lightbulb-line me-1"></i>
                  AI is analyzing your case inputs in real-time and will suggest relevant questions and rubrics.
                </Alert>

                <div className="mb-3">
                  <h6 className="text-muted mb-2">Suggested Questions</h6>
                  <div className="d-grid gap-1">
                    <Button variant="outline-primary" size="sm" className="text-start small">
                      Does the patient feel better from warmth?
                    </Button>
                    <Button variant="outline-primary" size="sm" className="text-start small">
                      Are symptoms worse at night?
                    </Button>
                    <Button variant="outline-primary" size="sm" className="text-start small">
                      Any fear or anxiety patterns?
                    </Button>
                  </div>
                </div>

                <div className="mb-3">
                  <h6 className="text-muted mb-2">Relevant Rubrics</h6>
                  <div className="d-flex flex-wrap gap-1">
                    <Badge bg="secondary" className="small">Mind - Anxiety</Badge>
                    <Badge bg="secondary" className="small">Generals - Heat</Badge>
                    <Badge bg="secondary" className="small">Sleep - Disturbed</Badge>
                  </div>
                </div>

                <div className="text-center">
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={handleAIAnalysis}
                    disabled={isAIAnalyzing}
                  >
                    <i className="ri-brain-line me-1"></i>
                    Full AI Analysis
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* AI Analysis Results Modal */}
      <Modal show={showAIModal} onHide={() => setShowAIModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-brain-line me-2 text-primary"></i>
            AI Analysis Results
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey="remedies">
            <Tab eventKey="remedies" title="Suggested Remedies">
              {aiSuggestions.remedies.map((remedy, index) => (
                <Card key={index} className="mb-2 border-0 bg-light">
                  <Card.Body className="py-2">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1">{remedy.name} {remedy.potency}</h6>
                        <p className="mb-0 small text-muted">{remedy.reasoning}</p>
                      </div>
                      <Badge bg="primary">{remedy.confidence}%</Badge>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </Tab>
            <Tab eventKey="rubrics" title="Relevant Rubrics">
              {aiSuggestions.rubrics.map((rubric, index) => (
                <div key={index} className="p-2 border-bottom">
                  <small>{rubric}</small>
                </div>
              ))}
            </Tab>
            <Tab eventKey="questions" title="Follow-up Questions">
              {aiSuggestions.questions.map((question, index) => (
                <div key={index} className="p-2 border-bottom">
                  <small>{question}</small>
                </div>
              ))}
            </Tab>
            <Tab eventKey="insights" title="AI Insights">
              {aiSuggestions.insights.map((insight, index) => (
                <Alert key={index} variant="info" className="mb-2 py-2">
                  <small>{insight}</small>
                </Alert>
              ))}
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowAIModal(false)}>
            Close
          </Button>
          <Button variant="primary">
            <i className="ri-file-text-line me-1"></i>
            Generate Prescription
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .btn-recording {
          background-color: #ff4757 !important;
          border-color: #ff4757 !important;
          color: white !important;
          animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .sticky-top {
          top: 20px;
        }
      `}</style>
    </div>
  );
};

export default HomeopathyCaseTaking;
