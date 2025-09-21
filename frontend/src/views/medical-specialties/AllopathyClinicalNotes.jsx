import React, { useState } from "react";
import { Col, Row, Container, Card, Button, Form, Badge, Alert, Tab, Nav, Modal } from "react-bootstrap";

const AllopathyClinicalNotes = () => {
    const [noteData, setNoteData] = useState({
        patientInfo: {
            name: "",
            age: "",
            gender: "",
            mrn: ""
        },
        chiefComplaint: "",
        hpi: "",
        pastMedicalHistory: "",
        medications: "",
        allergies: "",
        socialHistory: "",
        reviewOfSystems: "",
        physicalExam: "",
        assessment: "",
        plan: ""
    });

    const [generatedNote, setGeneratedNote] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [templateType, setTemplateType] = useState("soap");

    const templates = {
        soap: "SOAP Note",
        hpip: "H&P (History & Physical)",
        progress: "Progress Note",
        discharge: "Discharge Summary",
        consultation: "Consultation Note"
    };

    const handleGenerateNote = () => {
        setIsGenerating(true);
        
        // Simulate AI note generation
        setTimeout(() => {
            const generatedSOAP = `
**CLINICAL NOTE**
Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
Provider: Dr. [Provider Name]

**PATIENT INFORMATION:**
Name: ${noteData.patientInfo.name || "[Patient Name]"}
Age: ${noteData.patientInfo.age || "[Age]"} years
Gender: ${noteData.patientInfo.gender || "[Gender]"}
MRN: ${noteData.patientInfo.mrn || "[Medical Record Number]"}
Date of Service: ${new Date().toLocaleDateString()}

**SUBJECTIVE:**

Chief Complaint: ${noteData.chiefComplaint || "[Chief complaint not documented]"}

History of Present Illness:
${noteData.hpi || "Patient presents with [description of symptoms]. [Onset, duration, severity, associated symptoms, aggravating/relieving factors]. No significant changes since last visit."}

Past Medical History: ${noteData.pastMedicalHistory || "No significant past medical history reported."}

Current Medications: ${noteData.medications || "No current medications reported."}

Allergies: ${noteData.allergies || "NKDA (No Known Drug Allergies)"}

Social History: ${noteData.socialHistory || "Non-contributory social history."}

Review of Systems:
${noteData.reviewOfSystems || `Constitutional: Denies fever, chills, weight loss
Cardiovascular: Denies chest pain, palpitations, SOB
Respiratory: Denies cough, SOB, wheezing
Gastrointestinal: Denies nausea, vomiting, diarrhea
Genitourinary: Denies dysuria, frequency, urgency
Musculoskeletal: Denies joint pain, muscle weakness
Neurological: Denies headache, dizziness, seizures
Psychiatric: Denies depression, anxiety
All other systems reviewed and negative unless otherwise noted.`}

**OBJECTIVE:**

Physical Examination:
${noteData.physicalExam || `Vital Signs: BP [BP], HR [HR], RR [RR], Temp [Temp], O2 Sat [O2] on room air
General: Alert, oriented, NAD (no acute distress)
HEENT: Normocephalic, atraumatic, PERRL, EOMI, no lymphadenopathy
Cardiovascular: Regular rate and rhythm, no murmurs
Respiratory: Clear to auscultation bilaterally, no rales or rhonchi  
Abdomen: Soft, non-tender, non-distended, normal bowel sounds
Extremities: No edema, normal strength and sensation
Neurological: Alert and oriented x3, normal gait and coordination`}

**ASSESSMENT:**
${noteData.assessment || "1. [Primary diagnosis based on presenting symptoms and examination findings]\n2. [Secondary diagnosis if applicable]\n3. [Additional considerations or differential diagnoses]"}

**PLAN:**
${noteData.plan || `Diagnostic:
- [Laboratory tests as indicated]
- [Imaging studies if needed]
- [Additional diagnostic procedures]

Therapeutic:
- [Medications prescribed with dosage and instructions]
- [Non-pharmacological interventions]
- [Lifestyle modifications]

Monitoring:
- [Follow-up appointments]
- [Monitoring parameters]
- [Patient education provided]

Disposition:
- Patient discharged home in stable condition
- Return to clinic if symptoms worsen
- Emergency precautions discussed`}

**MEDICAL DECISION MAKING:**
This is a [complexity level] medical decision-making case involving [number] diagnoses with [risk level] complexity. The patient's symptoms are consistent with [primary diagnosis], supported by [clinical findings]. Treatment plan focuses on [therapeutic approach] with appropriate follow-up.

**PROVIDER SIGNATURE:**
[Provider Name], MD
[Date and Time]

**AI ASSISTANCE NOTICE:**
This note was generated with AI assistance and reviewed by the attending physician for accuracy and completeness.
            `;
            
            setGeneratedNote(generatedSOAP);
            setIsGenerating(false);
        }, 3000);
    };

    const handleSaveNote = () => {
        // Save note logic here
        alert("Clinical note saved to patient record!");
    };

    return (
        <Container fluid>
            {/* Header */}
            <Row className="mb-4">
                <Col lg={12}>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="text-primary mb-2">
                                <i className="ri-file-text-line me-2"></i>
                                AI Clinical Note Generator
                            </h2>
                            <p className="text-muted mb-0">Generate comprehensive clinical documentation with AI assistance</p>
                        </div>
                        <div className="d-flex gap-2">
                            <Badge bg="info" className="px-3 py-2">
                                <i className="ri-robot-line me-1"></i>
                                AI Model v2.1
                            </Badge>
                            <Button variant="outline-primary">
                                <i className="ri-template-line me-1"></i>
                                Templates
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row>
                {/* Input Panel */}
                <Col lg={8}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-primary text-white">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">
                                    <i className="ri-edit-line me-2"></i>
                                    Clinical Documentation Input
                                </h5>
                                <Form.Select 
                                    value={templateType} 
                                    onChange={(e) => setTemplateType(e.target.value)}
                                    className="w-auto"
                                    size="sm"
                                >
                                    {Object.entries(templates).map(([key, value]) => (
                                        <option key={key} value={key}>{value}</option>
                                    ))}
                                </Form.Select>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Tab.Container defaultActiveKey="patient">
                                <Nav variant="pills" className="mb-4">
                                    <Nav.Item>
                                        <Nav.Link eventKey="patient">Patient Info</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="subjective">Subjective</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="objective">Objective</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="assessment">Assessment & Plan</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                                
                                <Tab.Content>
                                    <Tab.Pane eventKey="patient">
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Patient Name</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Enter patient name"
                                                        value={noteData.patientInfo.name}
                                                        onChange={(e) => setNoteData({
                                                            ...noteData,
                                                            patientInfo: {...noteData.patientInfo, name: e.target.value}
                                                        })}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={3}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Age</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        placeholder="Age"
                                                        value={noteData.patientInfo.age}
                                                        onChange={(e) => setNoteData({
                                                            ...noteData,
                                                            patientInfo: {...noteData.patientInfo, age: e.target.value}
                                                        })}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={3}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Gender</Form.Label>
                                                    <Form.Select
                                                        value={noteData.patientInfo.gender}
                                                        onChange={(e) => setNoteData({
                                                            ...noteData,
                                                            patientInfo: {...noteData.patientInfo, gender: e.target.value}
                                                        })}
                                                    >
                                                        <option value="">Select</option>
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                        <option value="Other">Other</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        
                                        <Form.Group className="mb-3">
                                            <Form.Label>Medical Record Number</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="MRN"
                                                value={noteData.patientInfo.mrn}
                                                onChange={(e) => setNoteData({
                                                    ...noteData,
                                                    patientInfo: {...noteData.patientInfo, mrn: e.target.value}
                                                })}
                                            />
                                        </Form.Group>
                                    </Tab.Pane>
                                    
                                    <Tab.Pane eventKey="subjective">
                                        <Form.Group className="mb-3">
                                            <Form.Label>Chief Complaint</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Patient's primary concern or reason for visit"
                                                value={noteData.chiefComplaint}
                                                onChange={(e) => setNoteData({...noteData, chiefComplaint: e.target.value})}
                                            />
                                        </Form.Group>
                                        
                                        <Form.Group className="mb-3">
                                            <Form.Label>History of Present Illness (HPI)</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={4}
                                                placeholder="Detailed description of the current illness including onset, duration, character, severity, location, radiation, timing, context, modifying factors, and associated signs/symptoms"
                                                value={noteData.hpi}
                                                onChange={(e) => setNoteData({...noteData, hpi: e.target.value})}
                                            />
                                            <Form.Text className="text-muted">
                                                AI Tip: Include OLDCARTS format for comprehensive documentation
                                            </Form.Text>
                                        </Form.Group>
                                        
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Past Medical History</Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={3}
                                                        placeholder="Previous illnesses, surgeries, hospitalizations"
                                                        value={noteData.pastMedicalHistory}
                                                        onChange={(e) => setNoteData({...noteData, pastMedicalHistory: e.target.value})}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Current Medications</Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={3}
                                                        placeholder="List current medications with dosages"
                                                        value={noteData.medications}
                                                        onChange={(e) => setNoteData({...noteData, medications: e.target.value})}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Allergies</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Drug allergies and reactions"
                                                        value={noteData.allergies}
                                                        onChange={(e) => setNoteData({...noteData, allergies: e.target.value})}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Social History</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Smoking, alcohol, occupation, living situation"
                                                        value={noteData.socialHistory}
                                                        onChange={(e) => setNoteData({...noteData, socialHistory: e.target.value})}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        
                                        <Form.Group className="mb-3">
                                            <Form.Label>Review of Systems</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={4}
                                                placeholder="Systematic review of organ systems"
                                                value={noteData.reviewOfSystems}
                                                onChange={(e) => setNoteData({...noteData, reviewOfSystems: e.target.value})}
                                            />
                                        </Form.Group>
                                    </Tab.Pane>
                                    
                                    <Tab.Pane eventKey="objective">
                                        <Form.Group className="mb-3">
                                            <Form.Label>Physical Examination</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={8}
                                                placeholder="Vital signs and complete physical examination findings organized by system"
                                                value={noteData.physicalExam}
                                                onChange={(e) => setNoteData({...noteData, physicalExam: e.target.value})}
                                            />
                                            <Form.Text className="text-muted">
                                                Include: Vital signs, General appearance, HEENT, CV, Pulmonary, Abdomen, Extremities, Neuro, Skin
                                            </Form.Text>
                                        </Form.Group>
                                    </Tab.Pane>
                                    
                                    <Tab.Pane eventKey="assessment">
                                        <Form.Group className="mb-3">
                                            <Form.Label>Assessment (Diagnosis)</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={4}
                                                placeholder="Primary and secondary diagnoses with ICD codes if available"
                                                value={noteData.assessment}
                                                onChange={(e) => setNoteData({...noteData, assessment: e.target.value})}
                                            />
                                        </Form.Group>
                                        
                                        <Form.Group className="mb-3">
                                            <Form.Label>Plan</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={6}
                                                placeholder="Diagnostic tests, treatments, medications, follow-up, patient education"
                                                value={noteData.plan}
                                                onChange={(e) => setNoteData({...noteData, plan: e.target.value})}
                                            />
                                            <Form.Text className="text-muted">
                                                Include: Diagnostics, Therapeutics, Monitoring, Education, Follow-up
                                            </Form.Text>
                                        </Form.Group>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Tab.Container>
                        </Card.Body>
                    </Card>
                </Col>

                {/* AI Panel */}
                <Col lg={4}>
                    <Card className="border-0 shadow-sm sticky-top">
                        <Card.Header className="bg-success text-white">
                            <h5 className="mb-0">
                                <i className="ri-robot-line me-2"></i>
                                AI Assistant
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            <Alert variant="info" className="mb-3">
                                <h6 className="alert-heading">
                                    <i className="ri-lightbulb-line me-1"></i>
                                    AI Features
                                </h6>
                                <ul className="mb-0 small">
                                    <li>Smart template generation</li>
                                    <li>Medical terminology optimization</li>
                                    <li>ICD-10 code suggestions</li>
                                    <li>Clinical guideline compliance</li>
                                    <li>Documentation completeness check</li>
                                </ul>
                            </Alert>

                            <div className="d-grid gap-2 mb-3">
                                <Button 
                                    variant="primary" 
                                    onClick={handleGenerateNote}
                                    disabled={isGenerating}
                                >
                                    {isGenerating ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Generating Note...
                                        </>
                                    ) : (
                                        <>
                                            <i className="ri-magic-line me-2"></i>
                                            Generate Clinical Note
                                        </>
                                    )}
                                </Button>
                                
                                {generatedNote && (
                                    <Button 
                                        variant="outline-success" 
                                        onClick={() => setShowPreviewModal(true)}
                                    >
                                        <i className="ri-eye-line me-2"></i>
                                        Preview Note
                                    </Button>
                                )}
                            </div>

                            {generatedNote && (
                                <Alert variant="success">
                                    <h6 className="alert-heading">
                                        <i className="ri-check-line me-1"></i>
                                        Note Generated Successfully
                                    </h6>
                                    <p className="mb-2 small">
                                        AI has generated a comprehensive clinical note based on your input.
                                    </p>
                                    <div className="d-grid gap-2">
                                        <Button variant="outline-success" size="sm" onClick={() => setShowPreviewModal(true)}>
                                            Review & Edit
                                        </Button>
                                        <Button variant="success" size="sm" onClick={handleSaveNote}>
                                            Save to Patient Record
                                        </Button>
                                    </div>
                                </Alert>
                            )}

                            <div className="mt-4">
                                <h6 className="text-primary mb-3">
                                    <i className="ri-settings-line me-2"></i>
                                    AI Settings
                                </h6>
                                
                                <Form.Group className="mb-3">
                                    <Form.Label className="small">Documentation Style</Form.Label>
                                    <Form.Select size="sm">
                                        <option>Professional Medical</option>
                                        <option>Academic Teaching</option>
                                        <option>Concise Clinical</option>
                                    </Form.Select>
                                </Form.Group>
                                
                                <Form.Group className="mb-3">
                                    <Form.Label className="small">Complexity Level</Form.Label>
                                    <Form.Select size="sm">
                                        <option>Detailed Comprehensive</option>
                                        <option>Standard Clinical</option>
                                        <option>Brief Summary</option>
                                    </Form.Select>
                                </Form.Group>
                                
                                <Form.Check 
                                    type="checkbox" 
                                    label="Include ICD-10 codes" 
                                    className="small mb-2"
                                />
                                <Form.Check 
                                    type="checkbox" 
                                    label="Add differential diagnosis" 
                                    className="small mb-2"
                                />
                                <Form.Check 
                                    type="checkbox" 
                                    label="Include billing information" 
                                    className="small"
                                />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Preview Modal */}
            <Modal show={showPreviewModal} onHide={() => setShowPreviewModal(false)} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="ri-file-text-line me-2"></i>
                        Generated Clinical Note Preview
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="border rounded p-3" style={{maxHeight: '600px', overflowY: 'auto'}}>
                        <pre style={{whiteSpace: 'pre-wrap', fontSize: '14px', fontFamily: 'Arial, sans-serif'}}>
                            {generatedNote}
                        </pre>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowPreviewModal(false)}>
                        Close Preview
                    </Button>
                    <Button variant="outline-primary">
                        <i className="ri-edit-line me-1"></i>
                        Edit Note
                    </Button>
                    <Button variant="primary" onClick={handleSaveNote}>
                        <i className="ri-save-line me-1"></i>
                        Save to EHR
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AllopathyClinicalNotes;
