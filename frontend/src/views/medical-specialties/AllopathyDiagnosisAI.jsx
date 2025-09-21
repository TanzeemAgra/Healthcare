import React, { useState, useEffect } from "react";
import { Col, Row, Container, Card, Button, Form, Badge, Alert, Table, Modal, ProgressBar, Nav, Tab } from "react-bootstrap";

const AllopathyDiagnosisAI = () => {
    const [symptoms, setSymptoms] = useState("");
    const [patientData, setPatientData] = useState({
        age: "",
        gender: "",
        medicalHistory: "",
        currentMedications: "",
        vitalSigns: {
            bp: "",
            hr: "",
            temp: "",
            resp: ""
        }
    });
    
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResults, setAnalysisResults] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);

    const handleAIAnalysis = () => {
        setIsAnalyzing(true);
        
        // Simulate AI analysis
        setTimeout(() => {
            const mockResults = {
                differentialDiagnosis: [
                    {
                        condition: "Acute Myocardial Infarction",
                        probability: 85,
                        confidence: 92,
                        severity: "Critical",
                        evidenceScore: 8.5,
                        supportingFactors: [
                            "Chest pain with radiation to left arm",
                            "Elevated troponin levels",
                            "ST elevation on ECG",
                            "History of hypertension"
                        ],
                        recommendedTests: [
                            "Serial cardiac enzymes",
                            "Echocardiogram",
                            "Cardiac catheterization"
                        ],
                        immediateActions: [
                            "Activate cardiac emergency protocol",
                            "Administer oxygen and aspirin",
                            "Prepare for emergency intervention"
                        ]
                    },
                    {
                        condition: "Unstable Angina",
                        probability: 72,
                        confidence: 88,
                        severity: "High",
                        evidenceScore: 7.2,
                        supportingFactors: [
                            "Chest pain at rest",
                            "Previous cardiac history",
                            "EKG changes"
                        ],
                        recommendedTests: [
                            "Stress testing",
                            "Coronary angiography"
                        ],
                        immediateActions: [
                            "Continuous cardiac monitoring",
                            "Antiplatelet therapy"
                        ]
                    },
                    {
                        condition: "Pulmonary Embolism",
                        probability: 45,
                        confidence: 75,
                        severity: "High",
                        evidenceScore: 4.5,
                        supportingFactors: [
                            "Shortness of breath",
                            "Chest pain",
                            "Recent immobilization"
                        ],
                        recommendedTests: [
                            "CT pulmonary angiography",
                            "D-dimer",
                            "ABG analysis"
                        ],
                        immediateActions: [
                            "Anticoagulation consideration",
                            "Oxygen therapy"
                        ]
                    }
                ],
                riskFactors: [
                    { factor: "Age > 65", present: true, weight: "High" },
                    { factor: "Hypertension", present: true, weight: "Medium" },
                    { factor: "Diabetes", present: false, weight: "Medium" },
                    { factor: "Smoking", present: true, weight: "High" },
                    { factor: "Family History", present: true, weight: "Medium" }
                ],
                recommendedProtocols: [
                    {
                        name: "STEMI Protocol",
                        timeframe: "Immediate",
                        priority: "Critical"
                    },
                    {
                        name: "Cardiac Monitoring",
                        timeframe: "Continuous",
                        priority: "High"
                    }
                ],
                confidence: 92,
                urgency: "Immediate"
            };
            
            setAnalysisResults(mockResults);
            setIsAnalyzing(false);
        }, 3000);
    };

    const getProbabilityColor = (probability) => {
        if (probability >= 80) return "danger";
        if (probability >= 60) return "warning";
        if (probability >= 40) return "info";
        return "secondary";
    };

    const getSeverityBadge = (severity) => {
        const variants = {
            "Critical": "danger",
            "High": "warning",
            "Medium": "info",
            "Low": "secondary"
        };
        return variants[severity] || "secondary";
    };

    return (
        <Container fluid>
            {/* Header */}
            <Row className="mb-4">
                <Col lg={12}>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="text-primary mb-2">
                                <i className="ri-brain-line me-2"></i>
                                AI Diagnosis Assistant
                            </h2>
                            <p className="text-muted mb-0">Advanced AI-powered clinical decision support for evidence-based diagnoses</p>
                        </div>
                        <Badge bg="success" className="px-3 py-2">
                            <i className="ri-check-line me-1"></i>
                            AI Model v3.2 Active
                        </Badge>
                    </div>
                </Col>
            </Row>

            <Row>
                {/* Input Panel */}
                <Col lg={6}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-primary text-white">
                            <h5 className="mb-0">
                                <i className="ri-input-method-line me-2"></i>
                                Clinical Input
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            <Tab.Container defaultActiveKey="symptoms">
                                <Nav variant="pills" className="mb-3">
                                    <Nav.Item>
                                        <Nav.Link eventKey="symptoms">Symptoms</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="patient">Patient Data</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="vitals">Vitals</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                                
                                <Tab.Content>
                                    <Tab.Pane eventKey="symptoms">
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-medium">Chief Complaint & Symptoms</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={8}
                                                placeholder="Describe the patient's presenting symptoms, onset, duration, severity, and associated factors..."
                                                value={symptoms}
                                                onChange={(e) => setSymptoms(e.target.value)}
                                            />
                                            <Form.Text className="text-muted">
                                                Be as detailed as possible. Include timing, quality, radiation, and aggravating/relieving factors.
                                            </Form.Text>
                                        </Form.Group>

                                        <Alert variant="info" className="mb-0">
                                            <h6 className="alert-heading">
                                                <i className="ri-lightbulb-line me-1"></i>
                                                AI Tip
                                            </h6>
                                            <p className="mb-0 small">
                                                Use structured symptom documentation (OLDCARTS format) for optimal AI analysis: 
                                                Onset, Location, Duration, Character, Aggravating factors, Relieving factors, Timing, Severity.
                                            </p>
                                        </Alert>
                                    </Tab.Pane>
                                    
                                    <Tab.Pane eventKey="patient">
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Age</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        placeholder="Patient age"
                                                        value={patientData.age}
                                                        onChange={(e) => setPatientData({...patientData, age: e.target.value})}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Gender</Form.Label>
                                                    <Form.Select
                                                        value={patientData.gender}
                                                        onChange={(e) => setPatientData({...patientData, gender: e.target.value})}
                                                    >
                                                        <option value="">Select gender</option>
                                                        <option value="male">Male</option>
                                                        <option value="female">Female</option>
                                                        <option value="other">Other</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Medical History</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={4}
                                                placeholder="Past medical history, surgeries, allergies..."
                                                value={patientData.medicalHistory}
                                                onChange={(e) => setPatientData({...patientData, medicalHistory: e.target.value})}
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Current Medications</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                placeholder="List current medications and dosages..."
                                                value={patientData.currentMedications}
                                                onChange={(e) => setPatientData({...patientData, currentMedications: e.target.value})}
                                            />
                                        </Form.Group>
                                    </Tab.Pane>
                                    
                                    <Tab.Pane eventKey="vitals">
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Blood Pressure</Form.Label>
                                                    <Form.Control
                                                        placeholder="e.g., 140/90"
                                                        value={patientData.vitalSigns.bp}
                                                        onChange={(e) => setPatientData({
                                                            ...patientData, 
                                                            vitalSigns: {...patientData.vitalSigns, bp: e.target.value}
                                                        })}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Heart Rate</Form.Label>
                                                    <Form.Control
                                                        placeholder="bpm"
                                                        value={patientData.vitalSigns.hr}
                                                        onChange={(e) => setPatientData({
                                                            ...patientData, 
                                                            vitalSigns: {...patientData.vitalSigns, hr: e.target.value}
                                                        })}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Temperature</Form.Label>
                                                    <Form.Control
                                                        placeholder="°F"
                                                        value={patientData.vitalSigns.temp}
                                                        onChange={(e) => setPatientData({
                                                            ...patientData, 
                                                            vitalSigns: {...patientData.vitalSigns, temp: e.target.value}
                                                        })}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Respiratory Rate</Form.Label>
                                                    <Form.Control
                                                        placeholder="breaths/min"
                                                        value={patientData.vitalSigns.resp}
                                                        onChange={(e) => setPatientData({
                                                            ...patientData, 
                                                            vitalSigns: {...patientData.vitalSigns, resp: e.target.value}
                                                        })}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Tab.Container>

                            <div className="d-grid gap-2 mt-4">
                                <Button 
                                    variant="primary" 
                                    size="lg" 
                                    onClick={handleAIAnalysis}
                                    disabled={isAnalyzing || !symptoms.trim()}
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Analyzing with AI...
                                        </>
                                    ) : (
                                        <>
                                            <i className="ri-brain-line me-2"></i>
                                            Generate AI Diagnosis
                                        </>
                                    )}
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Results Panel */}
                <Col lg={6}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-success text-white">
                            <h5 className="mb-0">
                                <i className="ri-search-line me-2"></i>
                                AI Analysis Results
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            {isAnalyzing ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary mb-3" style={{width: '3rem', height: '3rem'}}></div>
                                    <h6>AI is analyzing clinical data...</h6>
                                    <p className="text-muted">Processing symptoms, patient history, and clinical patterns</p>
                                    <ProgressBar animated now={75} className="mt-3" />
                                </div>
                            ) : analysisResults ? (
                                <>
                                    {/* Overall Assessment */}
                                    <Alert variant={analysisResults.urgency === 'Immediate' ? 'danger' : 'warning'} className="mb-3">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6 className="alert-heading mb-1">
                                                    <i className="ri-alert-line me-1"></i>
                                                    Urgency: {analysisResults.urgency}
                                                </h6>
                                                <small>AI Confidence: {analysisResults.confidence}%</small>
                                            </div>
                                            <Badge bg="light" text="dark" className="px-3 py-2">
                                                High Accuracy Model
                                            </Badge>
                                        </div>
                                    </Alert>

                                    {/* Differential Diagnosis */}
                                    <h6 className="mb-3">
                                        <i className="ri-list-check me-2 text-primary"></i>
                                        Differential Diagnosis
                                    </h6>
                                    
                                    {analysisResults.differentialDiagnosis.map((diagnosis, index) => (
                                        <Card key={index} className="mb-3 border-start border-4 border-primary">
                                            <Card.Body className="py-3">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <h6 className="mb-1">{diagnosis.condition}</h6>
                                                    <div className="d-flex gap-2">
                                                        <Badge bg={getSeverityBadge(diagnosis.severity)}>
                                                            {diagnosis.severity}
                                                        </Badge>
                                                        <Badge bg={getProbabilityColor(diagnosis.probability)}>
                                                            {diagnosis.probability}%
                                                        </Badge>
                                                    </div>
                                                </div>
                                                
                                                <div className="mb-2">
                                                    <small className="text-muted">Evidence Score: </small>
                                                    <ProgressBar 
                                                        variant={getProbabilityColor(diagnosis.probability)} 
                                                        now={diagnosis.evidenceScore * 10} 
                                                        className="d-inline-block" 
                                                        style={{width: '100px', height: '8px'}}
                                                    />
                                                    <small className="text-muted ms-2">{diagnosis.evidenceScore}/10</small>
                                                </div>

                                                <Button 
                                                    variant="outline-primary" 
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedDiagnosis(diagnosis);
                                                        setShowDetailModal(true);
                                                    }}
                                                >
                                                    View Details
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    ))}

                                    {/* Risk Factors */}
                                    <h6 className="mb-3 mt-4">
                                        <i className="ri-warning-line me-2 text-warning"></i>
                                        Risk Factor Analysis
                                    </h6>
                                    
                                    <Table size="sm" className="mb-0">
                                        <thead>
                                            <tr>
                                                <th>Risk Factor</th>
                                                <th className="text-center">Present</th>
                                                <th className="text-center">Weight</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {analysisResults.riskFactors.map((factor, index) => (
                                                <tr key={index}>
                                                    <td>{factor.factor}</td>
                                                    <td className="text-center">
                                                        {factor.present ? (
                                                            <i className="ri-check-line text-success"></i>
                                                        ) : (
                                                            <i className="ri-close-line text-muted"></i>
                                                        )}
                                                    </td>
                                                    <td className="text-center">
                                                        <Badge bg={factor.weight === 'High' ? 'danger' : factor.weight === 'Medium' ? 'warning' : 'secondary'}>
                                                            {factor.weight}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </>
                            ) : (
                                <div className="text-center py-5 text-muted">
                                    <i className="ri-robot-line fs-1 mb-3 d-block"></i>
                                    <h6>AI Ready for Analysis</h6>
                                    <p>Enter patient symptoms and clinical data to begin AI-powered diagnosis</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Diagnosis Detail Modal */}
            <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="ri-search-line me-2"></i>
                        {selectedDiagnosis?.condition}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedDiagnosis && (
                        <Tab.Container defaultActiveKey="evidence">
                            <Nav variant="pills" className="mb-3">
                                <Nav.Item>
                                    <Nav.Link eventKey="evidence">Supporting Evidence</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="tests">Recommended Tests</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="actions">Immediate Actions</Nav.Link>
                                </Nav.Item>
                            </Nav>
                            
                            <Tab.Content>
                                <Tab.Pane eventKey="evidence">
                                    <h6 className="text-primary mb-3">Supporting Factors</h6>
                                    <ul>
                                        {selectedDiagnosis.supportingFactors.map((factor, index) => (
                                            <li key={index} className="mb-2">{factor}</li>
                                        ))}
                                    </ul>
                                    
                                    <Alert variant="info" className="mt-3">
                                        <strong>AI Analysis:</strong> This diagnosis is supported by {selectedDiagnosis.supportingFactors.length} key clinical findings with {selectedDiagnosis.confidence}% confidence level.
                                    </Alert>
                                </Tab.Pane>
                                
                                <Tab.Pane eventKey="tests">
                                    <h6 className="text-primary mb-3">Recommended Diagnostic Tests</h6>
                                    {selectedDiagnosis.recommendedTests.map((test, index) => (
                                        <Card key={index} className="mb-2 border-start border-3 border-info">
                                            <Card.Body className="py-2">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <span>{test}</span>
                                                    <Button variant="outline-primary" size="sm">
                                                        Order Test
                                                    </Button>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </Tab.Pane>
                                
                                <Tab.Pane eventKey="actions">
                                    <h6 className="text-primary mb-3">Immediate Actions Required</h6>
                                    {selectedDiagnosis.immediateActions.map((action, index) => (
                                        <Alert key={index} variant="warning" className="mb-2">
                                            <strong>{index + 1}.</strong> {action}
                                        </Alert>
                                    ))}
                                </Tab.Pane>
                            </Tab.Content>
                        </Tab.Container>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowDetailModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary">
                        Add to Treatment Plan
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AllopathyDiagnosisAI;
