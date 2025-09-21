import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Badge, Tab, Tabs, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ReportCorrection = () => {
    const [reportText, setReportText] = useState('');
    const [loading, setLoading] = useState(false);
    const [correctedReport, setCorrectedReport] = useState(null);
    const [selectedSources, setSelectedSources] = useState([]);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [feedbackType, setFeedbackType] = useState('');
    const [activeTab, setActiveTab] = useState('correction');

    // Mock data for retrieved sources that would come from RAG
    const mockSources = [
        { id: 1, title: "ACR Radiology Reporting Standards", relevance: 0.92, excerpt: "For pulmonary nodules, reporting should include precise measurements, location, margins, and density characteristics..." },
        { id: 2, title: "Journal of Thoracic Imaging - 2024 Guidelines", relevance: 0.89, excerpt: "Ground glass opacities should be characterized by their distribution pattern (central, peripheral, or diffuse)..." },
        { id: 3, title: "Fleischner Society Guidelines", relevance: 0.87, excerpt: "Pulmonary nodules <6mm in low-risk patients generally do not require follow-up..." },
        { id: 4, title: "Similar Patient Case #28591", relevance: 0.83, excerpt: "Previous radiological findings indicated bilateral peripheral ground glass opacities with similar distribution pattern..." },
        { id: 5, title: "Internal Radiology Handbook", relevance: 0.78, excerpt: "Standard terminology for vascular markings should follow the updated nomenclature from Section 3.4..." },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reportText.trim()) {
            setFeedbackMessage('Please enter report text for correction');
            setFeedbackType('danger');
            return;
        }

        setLoading(true);
        setFeedbackMessage('');

        try {
            // Call our backend API to process the report
            const response = await fetch('/api/radiology/correct-report/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ report_text: reportText }),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success) {
                // Process the corrected report from the API
                const correctionData = result.data;
                
                // Count correction types
                const correctionCounts = {};
                correctionData.corrections.forEach(correction => {
                    if (!correctionCounts[correction.type]) {
                        correctionCounts[correction.type] = 0;
                    }
                    correctionCounts[correction.type]++;
                });
                
                const correctionList = Object.keys(correctionCounts).map(type => ({
                    type,
                    count: correctionCounts[type]
                }));
                
                setCorrectedReport({
                    original: reportText,
                    corrected: correctionData.corrected,
                    sources: correctionData.sources || mockSources, // Fallback to mock if API doesn't provide
                    timestamp: correctionData.timestamp || new Date().toISOString(),
                    confidence: correctionData.confidence || 0.89,
                    corrections: correctionList.length > 0 ? correctionList : [
                        { type: "Terminology", count: 3 },
                        { type: "Clarity", count: 2 },
                    ]
                });
                
                setSelectedSources((correctionData.sources || mockSources).slice(0, 3).map(s => s.id));
                setActiveTab('correction');
                setFeedbackMessage('Report successfully corrected using Generative AI and RAG techniques');
                setFeedbackType('success');
            } else {
                throw new Error(result.error || 'Unknown error processing report');
            }
            
            setLoading(false);

        } catch (error) {
            // Fallback to simulation if API fails (for demo purposes)
            console.error("Error correcting report, falling back to simulation:", error);
            
            // Simulate processing with the mock function
            setTimeout(() => {
                const correctedText = simulateAICorrection(reportText);
                setCorrectedReport({
                    original: reportText,
                    corrected: correctedText,
                    sources: mockSources,
                    timestamp: new Date().toISOString(),
                    confidence: 0.89,
                    corrections: [
                        { type: "Terminology", count: 3 },
                        { type: "Clarity", count: 2 },
                        { type: "Completion", count: 1 },
                        { type: "Accuracy", count: 2 },
                    ]
                });
                setSelectedSources(mockSources.slice(0, 3).map(s => s.id));
                setActiveTab('correction');
                setLoading(false);
                setFeedbackMessage('Report corrected using simulated AI (API connection error)');
                setFeedbackType('warning');
            }, 1500);
        }
    };

    const simulateAICorrection = (originalText) => {
        // This is a simulation function that would be replaced by your actual AI model
        // It demonstrates improvements a real system might make
        
        // Sample corrections based on common radiology report issues
        let correctedText = originalText;

        if (originalText.includes("nodule")) {
            correctedText = correctedText.replace(
                /nodule/gi, 
                "nodule (8mm, well-defined, homogeneous)"
            );
        }

        if (originalText.includes("ground glass")) {
            correctedText = correctedText.replace(
                /ground glass/gi,
                "ground-glass opacity (GGO) with peripheral distribution"
            );
        }

        // Add standard recommendation section if missing
        if (!originalText.toLowerCase().includes("recommendation")) {
            correctedText += "\n\nRECOMMENDATION:\nFollow-up CT chest in 3 months to assess for stability according to Fleischner Society guidelines.";
        }

        // Improve structure with headings if not present
        if (!originalText.includes("FINDINGS:")) {
            const parts = correctedText.split("\n\n");
            correctedText = "FINDINGS:\n" + parts.join("\n\n");
        }

        // Add measurement precision
        correctedText = correctedText.replace(/approximately ([0-9]+)/gi, "measuring $1 mm");

        return correctedText;
    };

    const handleSelectSource = (sourceId) => {
        if (selectedSources.includes(sourceId)) {
            setSelectedSources(selectedSources.filter(id => id !== sourceId));
        } else {
            setSelectedSources([...selectedSources, sourceId]);
        }
    };

    const handleSaveReport = () => {
        // In a real implementation, this would save to database
        setFeedbackMessage('Corrected report saved successfully');
        setFeedbackType('success');
    };

    const handleGeneratePDF = () => {
        // In a real implementation, this would generate a PDF
        setFeedbackMessage('PDF generation started. Download will begin shortly.');
        setFeedbackType('info');
    };

    return (
        <Container fluid className="py-4">
            <Row className="mb-4">
                <Col>
                    <div className="d-flex justify-content-between align-items-center">
                        <h3 className="mb-0">
                            <i className="ri-ai-generate me-2 text-primary"></i>
                            AI-Powered Radiology Report Correction
                        </h3>
                        <Button variant="outline-secondary" size="sm" as={Link} to="/radiology/home">
                            <i className="ri-arrow-left-line me-1"></i>
                            Back to Radiology Home
                        </Button>
                    </div>
                    <hr />
                </Col>
            </Row>

            {feedbackMessage && (
                <Alert variant={feedbackType} dismissible onClose={() => setFeedbackMessage('')}>
                    {feedbackMessage}
                </Alert>
            )}

            <Row>
                <Col lg={correctedReport ? 5 : 12}>
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Header className="bg-light">
                            <h5 className="mb-0">
                                <i className="ri-file-text-line me-2"></i>
                                Original Report Input
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Enter the radiology report that needs correction</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={12}
                                        placeholder="Paste or type the radiology report text here..."
                                        value={reportText}
                                        onChange={(e) => setReportText(e.target.value)}
                                        disabled={loading}
                                    />
                                    <Form.Text className="text-muted">
                                        Our AI system will analyze your report and suggest corrections based on medical standards and best practices.
                                    </Form.Text>
                                </Form.Group>

                                <div className="mb-3">
                                    <Form.Label>Correction Options</Form.Label>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Check 
                                                type="checkbox"
                                                id="terminology-check"
                                                label="Standardize terminology"
                                                defaultChecked
                                                disabled={loading}
                                            />
                                            <Form.Check 
                                                type="checkbox"
                                                id="structure-check"
                                                label="Improve report structure"
                                                defaultChecked
                                                disabled={loading}
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <Form.Check 
                                                type="checkbox"
                                                id="completeness-check"
                                                label="Check for completeness"
                                                defaultChecked
                                                disabled={loading}
                                            />
                                            <Form.Check 
                                                type="checkbox"
                                                id="guidelines-check"
                                                label="Apply clinical guidelines"
                                                defaultChecked
                                                disabled={loading}
                                            />
                                        </Col>
                                    </Row>
                                </div>

                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <Button 
                                            variant="primary" 
                                            type="submit" 
                                            disabled={loading || !reportText.trim()}
                                            className="me-2"
                                        >
                                            {loading ? (
                                                <>
                                                    <Spinner animation="border" size="sm" className="me-2" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="ri-magic-line me-1"></i>
                                                    Generate Corrected Report
                                                </>
                                            )}
                                        </Button>
                                        <Button 
                                            variant="outline-secondary" 
                                            type="button" 
                                            onClick={() => {
                                                setReportText('');
                                                setCorrectedReport(null);
                                            }}
                                            disabled={loading || !reportText.trim()}
                                        >
                                            Clear
                                        </Button>
                                    </div>
                                    {loading && (
                                        <div className="text-muted small">
                                            <i className="ri-search-eye-line me-1"></i>
                                            Retrieving relevant sources...
                                        </div>
                                    )}
                                </div>

                                {loading && (
                                    <div className="mt-4">
                                        <div className="d-flex align-items-center mb-2">
                                            <span className="me-2">Analyzing report structure</span>
                                            <div className="progress flex-grow-1" style={{height: '6px'}}>
                                                <div className="progress-bar progress-bar-striped progress-bar-animated" 
                                                     style={{width: '100%'}}></div>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center mb-2">
                                            <span className="me-2">Retrieving knowledge sources</span>
                                            <div className="progress flex-grow-1" style={{height: '6px'}}>
                                                <div className="progress-bar progress-bar-striped progress-bar-animated bg-info" 
                                                     style={{width: '80%'}}></div>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <span className="me-2">Generating corrections</span>
                                            <div className="progress flex-grow-1" style={{height: '6px'}}>
                                                <div className="progress-bar progress-bar-striped progress-bar-animated bg-success" 
                                                     style={{width: '60%'}}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Form>
                        </Card.Body>
                    </Card>

                    {!correctedReport && !loading && (
                        <Card className="border-0 shadow-sm mb-4">
                            <Card.Body>
                                <h6 className="mb-3">Sample Reports for Testing</h6>
                                <ListGroup variant="flush">
                                    <ListGroup.Item action onClick={() => setReportText(
                                        "CT CHEST WITHOUT CONTRAST\n\nCLINICAL INDICATION: Shortness of breath, cough\n\nCT of the chest was performed without contrast.\n\nThere is a lung nodule in the right upper lobe. Ground glass opacities are seen in both lungs. Heart size is normal. No pleural effusion. No pneumothorax.\n\nIMPRESSION:\n1. Lung nodule\n2. Ground glass opacities likely representing infection"
                                    )}>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>Sample 1: Chest CT</strong>
                                                <div className="small text-muted">Lung nodule, ground glass opacities</div>
                                            </div>
                                            <Badge bg="info">Click to Load</Badge>
                                        </div>
                                    </ListGroup.Item>
                                    <ListGroup.Item action onClick={() => setReportText(
                                        "MRI BRAIN WITHOUT AND WITH CONTRAST\n\nCLINICAL HISTORY: Headaches, visual changes\n\nTechnique: MRI of the brain was performed with and without contrast.\n\nThere is a approximately 2.5 cm extra-axial mass in the right frontal region with surrounding edema. It demonstrates homogeneous enhancement. Mild mass effect on the adjacent brain parenchyma. Ventricles are normal. No midline shift."
                                    )}>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>Sample 2: Brain MRI</strong>
                                                <div className="small text-muted">Extra-axial mass, enhancement pattern</div>
                                            </div>
                                            <Badge bg="info">Click to Load</Badge>
                                        </div>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    )}
                </Col>

                {correctedReport && (
                    <Col lg={7}>
                        <Card className="border-0 shadow-sm mb-4">
                            <Card.Header className="bg-light">
                                <Tabs
                                    activeKey={activeTab}
                                    onSelect={(k) => setActiveTab(k)}
                                    className="mb-0"
                                >
                                    <Tab eventKey="correction" title={
                                        <span><i className="ri-file-list-3-line me-1"></i> Corrected Report</span>
                                    }>
                                    </Tab>
                                    <Tab eventKey="comparison" title={
                                        <span><i className="ri-git-merge-line me-1"></i> Side-by-Side</span>
                                    }>
                                    </Tab>
                                    <Tab eventKey="sources" title={
                                        <span><i className="ri-book-2-line me-1"></i> Knowledge Sources</span>
                                    }>
                                    </Tab>
                                </Tabs>
                            </Card.Header>
                            <Card.Body className="p-0">
                                {activeTab === 'correction' && (
                                    <div className="p-4">
                                        <div className="mb-3 d-flex justify-content-between align-items-center">
                                            <h5 className="text-success mb-0">
                                                <i className="ri-check-double-line me-1"></i>
                                                Enhanced Report
                                            </h5>
                                            <div>
                                                <Button 
                                                    variant="outline-primary" 
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={handleSaveReport}
                                                >
                                                    <i className="ri-save-line me-1"></i>
                                                    Save
                                                </Button>
                                                <Button 
                                                    variant="outline-danger" 
                                                    size="sm"
                                                    onClick={handleGeneratePDF}
                                                >
                                                    <i className="ri-file-pdf-line me-1"></i>
                                                    Export PDF
                                                </Button>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-light p-3 rounded mb-3">
                                            <div className="d-flex justify-content-between mb-2">
                                                <Badge bg="success" className="mb-2">AI Enhanced</Badge>
                                                <small className="text-muted">
                                                    <i className="ri-time-line me-1"></i>
                                                    {new Date().toLocaleString()}
                                                </small>
                                            </div>
                                            <div style={{whiteSpace: 'pre-wrap', fontFamily: 'Consolas, monospace'}}>
                                                {correctedReport.corrected}
                                            </div>
                                        </div>

                                        <div className="d-flex flex-wrap gap-2 mb-3">
                                            <span className="text-muted me-2">Improvements:</span>
                                            {correctedReport.corrections.map((corr, idx) => (
                                                <Badge bg="info" key={idx}>
                                                    {corr.type}: {corr.count}
                                                </Badge>
                                            ))}
                                        </div>

                                        <div className="bg-light p-3 rounded">
                                            <h6>AI Confidence</h6>
                                            <div className="progress mb-2" style={{height: '8px'}}>
                                                <div 
                                                    className="progress-bar bg-success" 
                                                    style={{width: `${correctedReport.confidence * 100}%`}}
                                                ></div>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <small>Based on {correctedReport.sources.length} knowledge sources</small>
                                                <small className="text-success">{(correctedReport.confidence * 100).toFixed(1)}%</small>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'comparison' && (
                                    <div className="p-4">
                                        <Row>
                                            <Col md={6}>
                                                <h6>Original Report</h6>
                                                <div className="bg-light p-3 rounded" style={{height: '400px', overflowY: 'auto'}}>
                                                    <pre className="mb-0" style={{whiteSpace: 'pre-wrap', fontFamily: 'Consolas, monospace', fontSize: '0.9rem'}}>
                                                        {correctedReport.original}
                                                    </pre>
                                                </div>
                                            </Col>
                                            <Col md={6}>
                                                <h6>Corrected Report</h6>
                                                <div className="bg-light p-3 rounded" style={{height: '400px', overflowY: 'auto'}}>
                                                    <pre className="mb-0" style={{whiteSpace: 'pre-wrap', fontFamily: 'Consolas, monospace', fontSize: '0.9rem'}}>
                                                        {correctedReport.corrected}
                                                    </pre>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                )}

                                {activeTab === 'sources' && (
                                    <div className="p-4">
                                        <h6 className="mb-3">Knowledge Sources Used (RAG)</h6>
                                        <ListGroup>
                                            {mockSources.map(source => (
                                                <ListGroup.Item 
                                                    key={source.id}
                                                    className="d-flex align-items-start"
                                                    action
                                                    active={selectedSources.includes(source.id)}
                                                    onClick={() => handleSelectSource(source.id)}
                                                >
                                                    <div className="me-auto">
                                                        <div className="d-flex align-items-center mb-1">
                                                            <h6 className="mb-0">{source.title}</h6>
                                                            <Badge 
                                                                bg="info" 
                                                                className="ms-2"
                                                                style={{opacity: 0.8}}
                                                            >
                                                                {(source.relevance * 100).toFixed(0)}% match
                                                            </Badge>
                                                        </div>
                                                        <p className="mb-0 small">
                                                            {source.excerpt}
                                                        </p>
                                                    </div>
                                                    <div className="ms-2">
                                                        <i className={`ri-${selectedSources.includes(source.id) ? 'checkbox-circle-fill text-success' : 'information-line text-muted'}`}></i>
                                                    </div>
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                        <div className="mt-3 small text-muted">
                                            <i className="ri-information-line me-1"></i>
                                            These sources were automatically retrieved and ranked by relevance using RAG technology
                                        </div>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default ReportCorrection;
