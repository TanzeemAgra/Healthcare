import React, { useState, useEffect } from "react";
import { Col, Row, Container, Card, Button, Form, Badge, Alert, Table, Modal, InputGroup } from "react-bootstrap";

const AllopathyDrugChecker = () => {
    const [selectedDrugs, setSelectedDrugs] = useState([]);
    const [drugSearch, setDrugSearch] = useState("");
    const [interactions, setInteractions] = useState([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedInteraction, setSelectedInteraction] = useState(null);

    // Mock drug database
    const drugDatabase = [
        { name: "Warfarin", category: "Anticoagulant", brandNames: ["Coumadin"] },
        { name: "Aspirin", category: "NSAID", brandNames: ["Bayer", "Ecotrin"] },
        { name: "Metformin", category: "Antidiabetic", brandNames: ["Glucophage"] },
        { name: "Lisinopril", category: "ACE Inhibitor", brandNames: ["Prinivil", "Zestril"] },
        { name: "Simvastatin", category: "Statin", brandNames: ["Zocor"] },
        { name: "Amoxicillin", category: "Antibiotic", brandNames: ["Amoxil"] },
        { name: "Omeprazole", category: "PPI", brandNames: ["Prilosec"] },
        { name: "Metoprolol", category: "Beta Blocker", brandNames: ["Lopressor"] },
        { name: "Amlodipine", category: "Calcium Channel Blocker", brandNames: ["Norvasc"] },
        { name: "Levothyroxine", category: "Thyroid Hormone", brandNames: ["Synthroid"] }
    ];

    const [filteredDrugs, setFilteredDrugs] = useState([]);

    useEffect(() => {
        if (drugSearch.length > 2) {
            const filtered = drugDatabase.filter(drug => 
                drug.name.toLowerCase().includes(drugSearch.toLowerCase()) ||
                drug.brandNames.some(brand => brand.toLowerCase().includes(drugSearch.toLowerCase()))
            );
            setFilteredDrugs(filtered);
        } else {
            setFilteredDrugs([]);
        }
    }, [drugSearch]);

    const addDrug = (drug) => {
        if (!selectedDrugs.find(d => d.name === drug.name)) {
            setSelectedDrugs([...selectedDrugs, {...drug, dosage: "", frequency: ""}]);
            setDrugSearch("");
            setFilteredDrugs([]);
        }
    };

    const removeDrug = (drugName) => {
        setSelectedDrugs(selectedDrugs.filter(drug => drug.name !== drugName));
    };

    const updateDrugInfo = (drugName, field, value) => {
        setSelectedDrugs(selectedDrugs.map(drug => 
            drug.name === drugName ? {...drug, [field]: value} : drug
        ));
    };

    const checkInteractions = () => {
        setIsAnalyzing(true);
        
        // Mock AI analysis
        setTimeout(() => {
            const mockInteractions = [
                {
                    id: 1,
                    drug1: "Warfarin",
                    drug2: "Aspirin",
                    severity: "Major",
                    mechanism: "Pharmacodynamic synergism",
                    effect: "Increased risk of bleeding",
                    clinicalSignificance: "High",
                    recommendation: "Avoid combination or monitor closely",
                    evidence: "Extensive clinical studies demonstrate increased bleeding risk",
                    management: [
                        "Monitor INR more frequently",
                        "Watch for signs of bleeding",
                        "Consider alternative to aspirin",
                        "Patient counseling on bleeding signs"
                    ],
                    timeframe: "Onset: Hours to days",
                    aiConfidence: 96
                },
                {
                    id: 2,
                    drug1: "Simvastatin",
                    drug2: "Amoxicillin",
                    severity: "Moderate",
                    mechanism: "CYP3A4 interaction potential",
                    effect: "Possible increased statin exposure",
                    clinicalSignificance: "Medium",
                    recommendation: "Monitor for muscle-related side effects",
                    evidence: "Limited case reports, theoretical interaction",
                    management: [
                        "Monitor for muscle pain/weakness",
                        "Check CK levels if symptoms occur",
                        "Advise patient to report muscle symptoms"
                    ],
                    timeframe: "Onset: Days to weeks",
                    aiConfidence: 73
                },
                {
                    id: 3,
                    drug1: "Lisinopril",
                    drug2: "Metformin",
                    severity: "Minor",
                    mechanism: "Potential renal function impact",
                    effect: "Theoretical risk of lactic acidosis",
                    clinicalSignificance: "Low",
                    recommendation: "Monitor renal function periodically",
                    evidence: "Theoretical interaction, rare clinical significance",
                    management: [
                        "Monitor serum creatinine",
                        "Assess for signs of lactic acidosis",
                        "Ensure adequate hydration"
                    ],
                    timeframe: "Onset: Variable",
                    aiConfidence: 58
                }
            ];
            
            setInteractions(mockInteractions);
            setIsAnalyzing(false);
        }, 2000);
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case "Major": return "danger";
            case "Moderate": return "warning";
            case "Minor": return "info";
            default: return "secondary";
        }
    };

    const getSeverityIcon = (severity) => {
        switch (severity) {
            case "Major": return "ri-error-warning-line";
            case "Moderate": return "ri-alert-line";
            case "Minor": return "ri-information-line";
            default: return "ri-question-line";
        }
    };

    return (
        <Container fluid>
            {/* Header */}
            <Row className="mb-4">
                <Col lg={12}>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="text-primary mb-2">
                                <i className="ri-medicine-bottle-line me-2"></i>
                                AI Drug Interaction Checker
                            </h2>
                            <p className="text-muted mb-0">Advanced pharmaceutical AI for drug-drug interaction analysis</p>
                        </div>
                        <Badge bg="success" className="px-3 py-2">
                            <i className="ri-check-line me-1"></i>
                            FDA Database Updated
                        </Badge>
                    </div>
                </Col>
            </Row>

            <Row>
                {/* Drug Selection Panel */}
                <Col lg={6}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-primary text-white">
                            <h5 className="mb-0">
                                <i className="ri-add-line me-2"></i>
                                Drug Selection
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            {/* Drug Search */}
                            <Form.Group className="mb-4">
                                <Form.Label className="fw-medium">Search Medications</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search by generic or brand name..."
                                        value={drugSearch}
                                        onChange={(e) => setDrugSearch(e.target.value)}
                                    />
                                    <Button variant="outline-secondary">
                                        <i className="ri-search-line"></i>
                                    </Button>
                                </InputGroup>
                                
                                {/* Search Results */}
                                {filteredDrugs.length > 0 && (
                                    <div className="border rounded mt-2 p-2 bg-light">
                                        {filteredDrugs.map((drug, index) => (
                                            <div 
                                                key={index} 
                                                className="d-flex justify-content-between align-items-center p-2 border-bottom cursor-pointer hover-bg-white"
                                                onClick={() => addDrug(drug)}
                                            >
                                                <div>
                                                    <strong>{drug.name}</strong>
                                                    <div className="small text-muted">
                                                        {drug.category} • Brand: {drug.brandNames.join(", ")}
                                                    </div>
                                                </div>
                                                <Button variant="outline-primary" size="sm">
                                                    <i className="ri-add-line"></i>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Form.Group>

                            {/* Selected Drugs */}
                            <div className="mb-4">
                                <h6 className="mb-3">
                                    <i className="ri-list-check me-2 text-primary"></i>
                                    Selected Medications ({selectedDrugs.length})
                                </h6>
                                
                                {selectedDrugs.length === 0 ? (
                                    <Alert variant="light" className="text-center">
                                        <i className="ri-medicine-bottle-line fs-2 text-muted mb-2 d-block"></i>
                                        <p className="mb-0 text-muted">No medications selected. Search and add drugs to check for interactions.</p>
                                    </Alert>
                                ) : (
                                    selectedDrugs.map((drug, index) => (
                                        <Card key={index} className="mb-3 border-start border-4 border-primary">
                                            <Card.Body className="py-3">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <div>
                                                        <h6 className="mb-1">{drug.name}</h6>
                                                        <Badge bg="outline-secondary">{drug.category}</Badge>
                                                    </div>
                                                    <Button 
                                                        variant="outline-danger" 
                                                        size="sm"
                                                        onClick={() => removeDrug(drug.name)}
                                                    >
                                                        <i className="ri-close-line"></i>
                                                    </Button>
                                                </div>
                                                
                                                <Row>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-2">
                                                            <Form.Label className="small">Dosage</Form.Label>
                                                            <Form.Control
                                                                size="sm"
                                                                placeholder="e.g., 5mg"
                                                                value={drug.dosage}
                                                                onChange={(e) => updateDrugInfo(drug.name, 'dosage', e.target.value)}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-2">
                                                            <Form.Label className="small">Frequency</Form.Label>
                                                            <Form.Select
                                                                size="sm"
                                                                value={drug.frequency}
                                                                onChange={(e) => updateDrugInfo(drug.name, 'frequency', e.target.value)}
                                                            >
                                                                <option value="">Select frequency</option>
                                                                <option value="once daily">Once daily</option>
                                                                <option value="twice daily">Twice daily</option>
                                                                <option value="three times daily">Three times daily</option>
                                                                <option value="four times daily">Four times daily</option>
                                                                <option value="as needed">As needed</option>
                                                            </Form.Select>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    ))
                                )}
                            </div>

                            {/* Check Interactions Button */}
                            <div className="d-grid gap-2">
                                <Button 
                                    variant="success" 
                                    size="lg"
                                    onClick={checkInteractions}
                                    disabled={selectedDrugs.length < 2 || isAnalyzing}
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Analyzing Interactions...
                                        </>
                                    ) : (
                                        <>
                                            <i className="ri-search-line me-2"></i>
                                            Check Drug Interactions
                                        </>
                                    )}
                                </Button>
                                
                                {selectedDrugs.length < 2 && (
                                    <small className="text-muted text-center">
                                        Add at least 2 medications to check for interactions
                                    </small>
                                )}
                            </div>

                            <Alert variant="info" className="mt-3">
                                <h6 className="alert-heading">
                                    <i className="ri-information-line me-1"></i>
                                    AI-Powered Analysis
                                </h6>
                                <p className="mb-0 small">
                                    Our AI analyzes drug interactions using FDA databases, clinical studies, 
                                    and real-world evidence to provide comprehensive safety assessments.
                                </p>
                            </Alert>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Results Panel */}
                <Col lg={6}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-warning text-dark">
                            <h5 className="mb-0">
                                <i className="ri-alert-line me-2"></i>
                                Interaction Analysis
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            {isAnalyzing ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary mb-3" style={{width: '3rem', height: '3rem'}}></div>
                                    <h6>AI is analyzing drug interactions...</h6>
                                    <p className="text-muted">Checking against FDA database and clinical evidence</p>
                                </div>
                            ) : interactions.length > 0 ? (
                                <>
                                    {/* Summary */}
                                    <Alert variant="warning" className="mb-3">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6 className="alert-heading mb-1">
                                                    <i className="ri-warning-line me-1"></i>
                                                    {interactions.length} Interaction(s) Found
                                                </h6>
                                                <small>
                                                    Major: {interactions.filter(i => i.severity === 'Major').length} • 
                                                    Moderate: {interactions.filter(i => i.severity === 'Moderate').length} • 
                                                    Minor: {interactions.filter(i => i.severity === 'Minor').length}
                                                </small>
                                            </div>
                                        </div>
                                    </Alert>

                                    {/* Interactions List */}
                                    {interactions.map((interaction) => (
                                        <Card key={interaction.id} className="mb-3 border-start border-4 border-warning">
                                            <Card.Body>
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <div>
                                                        <h6 className="mb-1">
                                                            {interaction.drug1} + {interaction.drug2}
                                                        </h6>
                                                        <p className="text-muted mb-2 small">{interaction.effect}</p>
                                                    </div>
                                                    <div className="text-end">
                                                        <Badge bg={getSeverityColor(interaction.severity)} className="mb-2">
                                                            <i className={`${getSeverityIcon(interaction.severity)} me-1`}></i>
                                                            {interaction.severity}
                                                        </Badge>
                                                        <div>
                                                            <small className="text-muted">
                                                                AI Confidence: {interaction.aiConfidence}%
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    <strong className="small">Recommendation:</strong>
                                                    <p className="mb-0 small">{interaction.recommendation}</p>
                                                </div>

                                                <div className="d-flex gap-2">
                                                    <Button 
                                                        variant="outline-primary" 
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedInteraction(interaction);
                                                            setShowDetailModal(true);
                                                        }}
                                                    >
                                                        View Details
                                                    </Button>
                                                    <Button variant="outline-warning" size="sm">
                                                        Add to Alerts
                                                    </Button>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    ))}

                                    {/* No Major Interactions Message */}
                                    {interactions.filter(i => i.severity === 'Major').length === 0 && (
                                        <Alert variant="success" className="mt-3">
                                            <h6 className="alert-heading">
                                                <i className="ri-check-line me-1"></i>
                                                No Major Interactions Detected
                                            </h6>
                                            <p className="mb-0 small">
                                                The AI analysis found no major contraindications, but monitor for moderate interactions.
                                            </p>
                                        </Alert>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-5 text-muted">
                                    <i className="ri-shield-check-line fs-1 mb-3 d-block"></i>
                                    <h6>Ready for Interaction Analysis</h6>
                                    <p>Select at least 2 medications to check for potential drug interactions</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Interaction Detail Modal */}
            <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="ri-alert-line me-2"></i>
                        {selectedInteraction?.drug1} + {selectedInteraction?.drug2}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedInteraction && (
                        <Row>
                            <Col md={6}>
                                <h6 className="text-primary mb-3">Interaction Details</h6>
                                <Table className="table-sm">
                                    <tbody>
                                        <tr>
                                            <td><strong>Severity:</strong></td>
                                            <td>
                                                <Badge bg={getSeverityColor(selectedInteraction.severity)}>
                                                    {selectedInteraction.severity}
                                                </Badge>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>Mechanism:</strong></td>
                                            <td>{selectedInteraction.mechanism}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Effect:</strong></td>
                                            <td>{selectedInteraction.effect}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Timeframe:</strong></td>
                                            <td>{selectedInteraction.timeframe}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>AI Confidence:</strong></td>
                                            <td>{selectedInteraction.aiConfidence}%</td>
                                        </tr>
                                    </tbody>
                                </Table>

                                <Alert variant="info" className="mt-3">
                                    <h6 className="alert-heading">Evidence</h6>
                                    <p className="mb-0 small">{selectedInteraction.evidence}</p>
                                </Alert>
                            </Col>
                            
                            <Col md={6}>
                                <h6 className="text-primary mb-3">Management Recommendations</h6>
                                {selectedInteraction.management.map((step, index) => (
                                    <Alert key={index} variant="warning" className="py-2">
                                        <strong>{index + 1}.</strong> {step}
                                    </Alert>
                                ))}
                            </Col>
                        </Row>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowDetailModal(false)}>
                        Close
                    </Button>
                    <Button variant="warning">
                        Add to Patient Alerts
                    </Button>
                    <Button variant="primary">
                        Generate Report
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AllopathyDrugChecker;
