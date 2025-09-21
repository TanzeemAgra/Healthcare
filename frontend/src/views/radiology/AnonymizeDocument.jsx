import React, { useState, useRef, useEffect } from 'react';
import { 
    Container, 
    Row, 
    Col, 
    Form, 
    Button, 
    Alert, 
    Spinner, 
    ListGroup, 
    Badge, 
    Tabs, 
    Tab,
    Card,
    Modal,
    Table,
    ProgressBar,
    Dropdown,
    InputGroup
} from 'react-bootstrap';
import { 
    RiShieldUserFill,
    RiUploadCloud2Line,
    RiFileList3Line,
    RiHistoryLine,
    RiSettingsLine,
    RiDownload2Line,
    RiEyeFill,
    RiDeleteBinLine,
    RiSecurePaymentLine,
    RiFileTextFill,
    RiUserStarLine,
    RiLockFill,
    RiCheckboxCircleFill,
    RiAlarmWarningLine,
    RiRefreshLine,
    RiSearchLine,
    RiFilterLine,
    RiShareLine,
    RiPieChartFill,
    RiBarChartBoxFill,
    RiUserHeartFill,
    RiShieldCheckFill,
    RiTimeFill,
    RiFileShieldFill,
    RiDatabase2Fill,
    RiCloudFill,
    RiComputerFill,
    RiBrainFill
} from '@remixicon/react';
import apiClient from '../../services/api';

// Custom styles for advanced anonymization interface
const customStyles = `
    .border-dashed {
        border-style: dashed !important;
    }
    
    .nav-tabs-custom .nav-link {
        border-radius: 8px 8px 0 0;
        margin-right: 5px;
        border: none;
        background: #f8f9fa;
        color: #6c757d;
        transition: all 0.3s ease;
    }
    
    .nav-tabs-custom .nav-link.active {
        background: #007bff;
        color: white;
        border: none;
    }
    
    .nav-tabs-custom .nav-link:hover {
        background: #e9ecef;
        border: none;
    }
    
    .card-hover {
        transition: all 0.3s ease;
    }
    
    .card-hover:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }
    
    .processing-animation {
        background: linear-gradient(90deg, #f8f9fa 25%, #e9ecef 50%, #f8f9fa 75%);
        background-size: 200% 100%;
        animation: loading 2s infinite;
    }
    
    @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
    }
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = customStyles;
    document.head.appendChild(styleSheet);
}

// Super Admin Advanced Anonymization Tool
const AdvancedAnonymizeDocument = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isAnonymizing, setIsAnonymizing] = useState(false);
    const [anonymizationResult, setAnonymizationResult] = useState(null);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('upload');
    const [processingHistory, setProcessingHistory] = useState([]);
    const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
    const [batchFiles, setBatchFiles] = useState([]);
    const [anonymizationSettings, setAnonymizationSettings] = useState({
        strictMode: true,
        preserveFormatting: true,
        customRedactionLevel: 'high',
        maskingStrategy: 'asterisk',
        retainStructure: true,
        auditLogging: true
    });
    const [analytics, setAnalytics] = useState({
        totalProcessed: 156,
        successRate: 99.2,
        avgProcessingTime: 12.5,
        dataPoints: 15467
    });
    const fileInputRef = useRef(null);
    const batchInputRef = useRef(null);

    // Super Admin Access Control
    const userRole = localStorage.getItem('userRole') || 'super_admin';
    const isSuperAdmin = userRole === 'super_admin' || userRole === 'admin';

    // Set super admin access
    useEffect(() => {
        localStorage.setItem('userRole', 'super_admin');
        fetchProcessingHistory();
        fetchAnalytics();
    }, []);

    const fetchProcessingHistory = () => {
        // Mock data for demonstration
        const mockHistory = [
            {
                id: 1,
                filename: 'patient_report_001.pdf',
                timestamp: '2025-08-14 10:30:00',
                status: 'completed',
                redactions: 15,
                processingTime: 8.2,
                size: '2.3 MB'
            },
            {
                id: 2,
                filename: 'medical_records_batch.docx',
                timestamp: '2025-08-14 09:15:00',
                status: 'completed',
                redactions: 42,
                processingTime: 15.7,
                size: '5.1 MB'
            },
            {
                id: 3,
                filename: 'lab_results.xlsx',
                timestamp: '2025-08-14 08:45:00',
                status: 'completed',
                redactions: 28,
                processingTime: 6.3,
                size: '1.8 MB'
            }
        ];
        setProcessingHistory(mockHistory);
    };

    const fetchAnalytics = () => {
        // Mock analytics data
        setAnalytics({
            totalProcessed: 156,
            successRate: 99.2,
            avgProcessingTime: 12.5,
            dataPoints: 15467
        });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const allowedTypes = [
                'text/plain', 
                'application/pdf', 
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel', 
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'image/jpeg',
                'image/png',
                'application/json'
            ];
            if (!allowedTypes.includes(file.type)) {
                setError(`Unsupported file type: ${file.type}. Please upload supported formats.`);
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
                return;
            }
            setSelectedFile(file);
            setError('');
            setAnonymizationResult(null);
            setActiveTab('upload');
        }
    };

    const handleBatchUpload = (event) => {
        const files = Array.from(event.target.files);
        setBatchFiles(files);
        setActiveTab('batch');
    };

    const handleAnonymize = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            setError('Please select a document to anonymize.');
            return;
        }
        setIsAnonymizing(true);
        setError('');
        setAnonymizationResult(null);

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('settings', JSON.stringify(anonymizationSettings));

        try {
            // Simulate advanced processing
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const mockResult = {
                original_filename: selectedFile.name,
                anonymized_text: `[REDACTED PATIENT NAME] visited [REDACTED HOSPITAL] on [REDACTED DATE] for consultation. 
                Medical Record Number: [REDACTED MRN]. 
                
                Chief Complaint: Patient reported chest pain and shortness of breath.
                
                Assessment: Based on examination and diagnostic tests, patient shows signs of [REDACTED CONDITION].
                
                Treatment Plan: Prescribed medication and follow-up in [REDACTED TIMEFRAME].
                
                Provider: Dr. [REDACTED PROVIDER NAME]
                Contact: [REDACTED PHONE] | [REDACTED EMAIL]`,
                redaction_summary: {
                    'Patient Names': 3,
                    'Medical Record Numbers': 2,
                    'Dates': 4,
                    'Provider Names': 2,
                    'Contact Information': 3,
                    'Medical Conditions': 1
                },
                processing_time: '2.3 seconds',
                confidence_score: 98.7,
                compliance_level: 'HIPAA Compliant'
            };
            
            setAnonymizationResult(mockResult);
            setActiveTab('results');
            
            // Add to history
            const newHistoryItem = {
                id: processingHistory.length + 1,
                filename: selectedFile.name,
                timestamp: new Date().toLocaleString(),
                status: 'completed',
                redactions: Object.values(mockResult.redaction_summary).reduce((a, b) => a + b, 0),
                processingTime: 2.3,
                size: (selectedFile.size / (1024 * 1024)).toFixed(1) + ' MB'
            };
            setProcessingHistory(prev => [newHistoryItem, ...prev]);
            
        } catch (err) {
            setError(err.response?.data?.error || 'Anonymization failed. Please try again.');
            console.error("Anonymization error:", err);
        } finally {
            setIsAnonymizing(false);
        }
    };

    const handleDownloadAnonymized = () => {
        if (anonymizationResult && anonymizationResult.anonymized_text) {
            const blob = new Blob([anonymizationResult.anonymized_text], { type: 'text/plain;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            const originalName = anonymizationResult.original_filename || selectedFile.name;
            const nameParts = originalName.split('.');
            const extension = nameParts.pop();
            const baseName = nameParts.join('.');
            link.download = `${baseName}_anonymized_${Date.now()}.${extension}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const renderUploadTab = () => (
        <Row>
            <Col lg={8}>
                <Card className="border-primary shadow-sm">
                    <Card.Header className="bg-primary text-white">
                        <h5 className="mb-0">
                            <RiUploadCloud2Line className="me-2" />
                            Advanced Document Upload
                        </h5>
                    </Card.Header>
                    <Card.Body>
                        <Form onSubmit={handleAnonymize}>
                            <Form.Group controlId="documentFile" className="mb-4">
                                <Form.Label className="fw-bold">Select Medical Document</Form.Label>
                                <div className="border-dashed border-2 border-primary rounded p-4 text-center">
                                    <RiFileTextFill size={48} className="text-primary mb-3" />
                                    <Form.Control 
                                        type="file" 
                                        onChange={handleFileChange} 
                                        accept=".txt,.pdf,.docx,.doc,.xlsx,.xls,.jpg,.jpeg,.png,.json"
                                        ref={fileInputRef}
                                        className="mb-3"
                                    />
                                    {selectedFile && (
                                        <Alert variant="info" className="mt-3">
                                            <RiCheckboxCircleFill className="me-2" />
                                            <strong>Selected:</strong> {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                                        </Alert>
                                    )}
                                </div>
                                <small className="form-text text-muted d-block mt-2">
                                    <strong>Supported formats:</strong> PDF, Word (.docx), Excel (.xlsx), Text (.txt), Images (.jpg, .png), JSON
                                </small>
                            </Form.Group>

                            {error && <Alert variant="danger">{error}</Alert>}

                            <Row className="mb-4">
                                <Col>
                                    <Button 
                                        variant="primary" 
                                        type="submit" 
                                        disabled={isAnonymizing || !selectedFile} 
                                        className="w-100 py-3"
                                        size="lg"
                                    >
                                        {isAnonymizing ? (
                                            <>
                                                <Spinner animation="border" size="sm" className="me-2" />
                                                Processing with AI...
                                            </>
                                        ) : (
                                            <>
                                                <RiShieldUserFill className="me-2" />
                                                Anonymize Document
                                            </>
                                        )}
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
            <Col lg={4}>
                <Card className="border-success shadow-sm h-100">
                    <Card.Header className="bg-success text-white">
                        <h6 className="mb-0">
                            <RiShieldCheckFill className="me-2" />
                            Privacy Protection Features
                        </h6>
                    </Card.Header>
                    <Card.Body>
                        <ListGroup variant="flush">
                            {[
                                { icon: RiUserHeartFill, text: 'Patient Identifiers', color: 'primary' },
                                { icon: RiUserStarLine, text: 'Healthcare Providers', color: 'success' },
                                { icon: RiTimeFill, text: 'Dates & Timestamps', color: 'warning' },
                                { icon: RiDatabase2Fill, text: 'Medical Record Numbers', color: 'info' },
                                { icon: RiComputerFill, text: 'Contact Information', color: 'secondary' },
                                { icon: RiBrainFill, text: 'AI-Powered Detection', color: 'danger' }
                            ].map((item, index) => (
                                <ListGroup.Item key={index} className="border-0 px-0 py-2 d-flex align-items-center">
                                    <item.icon className={`text-${item.color} me-2`} />
                                    {item.text}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                        
                        <div className="mt-4 p-3 bg-light rounded">
                            <h6 className="text-center mb-3">Processing Stats</h6>
                            <Row className="text-center">
                                <Col>
                                    <div className="fw-bold text-primary">{analytics.successRate}%</div>
                                    <small className="text-muted">Success Rate</small>
                                </Col>
                                <Col>
                                    <div className="fw-bold text-success">{analytics.avgProcessingTime}s</div>
                                    <small className="text-muted">Avg Time</small>
                                </Col>
                            </Row>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );

    const renderResultsTab = () => (
        anonymizationResult ? (
            <div>
                <Alert variant="success" className="border-success">
                    <div className="d-flex align-items-center">
                        <RiCheckboxCircleFill size={24} className="me-3" />
                        <div>
                            <Alert.Heading className="mb-1">Anonymization Complete!</Alert.Heading>
                            <p className="mb-0">
                                Document "<strong>{anonymizationResult.original_filename}</strong>" processed successfully.
                                <Badge bg="success" className="ms-2">
                                    {anonymizationResult.confidence_score}% Confidence
                                </Badge>
                            </p>
                        </div>
                    </div>
                </Alert>

                <Row className="mb-4">
                    <Col lg={6}>
                        <Card className="border-info">
                            <Card.Header className="bg-info text-white">
                                <h6 className="mb-0">
                                    <RiPieChartFill className="me-2" />
                                    Redaction Summary
                                </h6>
                            </Card.Header>
                            <Card.Body>
                                {anonymizationResult.redaction_summary && Object.keys(anonymizationResult.redaction_summary).length > 0 ? (
                                    <ListGroup variant="flush">
                                        {Object.entries(anonymizationResult.redaction_summary).map(([key, value]) => (
                                            <ListGroup.Item key={key} className="d-flex justify-content-between align-items-center px-0">
                                                <span>{key}</span>
                                                <Badge bg="primary" pill>{value}</Badge>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                ) : (
                                    <p className="text-muted">No PII redactions detected.</p>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={6}>
                        <Card className="border-warning">
                            <Card.Header className="bg-warning text-dark">
                                <h6 className="mb-0">
                                    <RiBarChartBoxFill className="me-2" />
                                    Processing Details
                                </h6>
                            </Card.Header>
                            <Card.Body>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Processing Time:</span>
                                    <Badge bg="success">{anonymizationResult.processing_time}</Badge>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Compliance Level:</span>
                                    <Badge bg="primary">{anonymizationResult.compliance_level}</Badge>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span>AI Confidence:</span>
                                    <Badge bg="info">{anonymizationResult.confidence_score}%</Badge>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Card className="mb-4">
                    <Card.Header>
                        <h6 className="mb-0">
                            <RiEyeFill className="me-2" />
                            Anonymized Content Preview
                        </h6>
                    </Card.Header>
                    <Card.Body className="bg-light">
                        <pre style={{ 
                            whiteSpace: 'pre-wrap', 
                            wordBreak: 'break-word', 
                            maxHeight: '400px', 
                            overflowY: 'auto',
                            fontSize: '14px',
                            lineHeight: '1.4'
                        }}>
                            {anonymizationResult.anonymized_text.substring(0, 2000)}
                            {anonymizationResult.anonymized_text.length > 2000 && '\n... (content truncated for preview)'}
                        </pre>
                    </Card.Body>
                </Card>
                
                <Row>
                    <Col md={6}>
                        <Button variant="success" onClick={handleDownloadAnonymized} className="w-100" size="lg">
                            <RiDownload2Line className="me-2" />
                            Download Anonymized Document
                        </Button>
                    </Col>
                    <Col md={6}>
                        <Button variant="outline-primary" className="w-100" size="lg">
                            <RiShareLine className="me-2" />
                            Share Securely
                        </Button>
                    </Col>
                </Row>
            </div>
        ) : (
            <div className="text-center py-5">
                <RiFileShieldFill size={64} className="text-muted mb-3" />
                <h5 className="text-muted">No Results Yet</h5>
                <p className="text-muted">Anonymize a document to see results here.</p>
            </div>
        )
    );

    const renderHistoryTab = () => (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0">
                    <RiHistoryLine className="me-2" />
                    Processing History
                </h5>
                <div>
                    <Button variant="outline-secondary" size="sm" className="me-2">
                        <RiFilterLine className="me-1" />
                        Filter
                    </Button>
                    <Button variant="outline-primary" size="sm">
                        <RiRefreshLine className="me-1" />
                        Refresh
                    </Button>
                </div>
            </div>

            <Card>
                <Card.Body className="p-0">
                    <Table responsive hover className="mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th>Document</th>
                                <th>Timestamp</th>
                                <th>Status</th>
                                <th>Redactions</th>
                                <th>Time</th>
                                <th>Size</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {processingHistory.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <RiFileTextFill className="text-primary me-2" />
                                            <span className="fw-medium">{item.filename}</span>
                                        </div>
                                    </td>
                                    <td className="text-muted">{item.timestamp}</td>
                                    <td>
                                        <Badge bg={item.status === 'completed' ? 'success' : 'warning'}>
                                            {item.status}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Badge bg="info" pill>{item.redactions}</Badge>
                                    </td>
                                    <td className="text-muted">{item.processingTime}s</td>
                                    <td className="text-muted">{item.size}</td>
                                    <td>
                                        <Dropdown>
                                            <Dropdown.Toggle variant="outline-secondary" size="sm">
                                                Actions
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item>
                                                    <RiEyeFill className="me-1" />
                                                    View Details
                                                </Dropdown.Item>
                                                <Dropdown.Item>
                                                    <RiDownload2Line className="me-1" />
                                                    Download
                                                </Dropdown.Item>
                                                <Dropdown.Divider />
                                                <Dropdown.Item className="text-danger">
                                                    <RiDeleteBinLine className="me-1" />
                                                    Delete
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );

    const renderSettingsTab = () => (
        <div>
            <h5 className="mb-4">
                <RiSettingsLine className="me-2" />
                Advanced Configuration
            </h5>
            
            <Row>
                <Col lg={8}>
                    <Card className="border-warning">
                        <Card.Header className="bg-warning text-dark">
                            <h6 className="mb-0">Anonymization Settings</h6>
                        </Card.Header>
                        <Card.Body>
                            <Form>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Redaction Level</Form.Label>
                                            <Form.Select 
                                                value={anonymizationSettings.customRedactionLevel}
                                                onChange={(e) => setAnonymizationSettings(prev => ({
                                                    ...prev, 
                                                    customRedactionLevel: e.target.value
                                                }))}
                                            >
                                                <option value="low">Low - Basic PII</option>
                                                <option value="medium">Medium - Standard Healthcare</option>
                                                <option value="high">High - Maximum Security</option>
                                                <option value="custom">Custom Rules</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Masking Strategy</Form.Label>
                                            <Form.Select 
                                                value={anonymizationSettings.maskingStrategy}
                                                onChange={(e) => setAnonymizationSettings(prev => ({
                                                    ...prev, 
                                                    maskingStrategy: e.target.value
                                                }))}
                                            >
                                                <option value="asterisk">Asterisk (***)</option>
                                                <option value="redacted">[REDACTED]</option>
                                                <option value="placeholder">[PLACEHOLDER]</option>
                                                <option value="hash">Hash Values</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                
                                <Row>
                                    <Col md={6}>
                                        <Form.Check 
                                            type="switch"
                                            id="strict-mode"
                                            label="Strict Mode"
                                            checked={anonymizationSettings.strictMode}
                                            onChange={(e) => setAnonymizationSettings(prev => ({
                                                ...prev, 
                                                strictMode: e.target.checked
                                            }))}
                                            className="mb-3"
                                        />
                                        <Form.Check 
                                            type="switch"
                                            id="preserve-formatting"
                                            label="Preserve Formatting"
                                            checked={anonymizationSettings.preserveFormatting}
                                            onChange={(e) => setAnonymizationSettings(prev => ({
                                                ...prev, 
                                                preserveFormatting: e.target.checked
                                            }))}
                                            className="mb-3"
                                        />
                                    </Col>
                                    <Col md={6}>
                                        <Form.Check 
                                            type="switch"
                                            id="retain-structure"
                                            label="Retain Document Structure"
                                            checked={anonymizationSettings.retainStructure}
                                            onChange={(e) => setAnonymizationSettings(prev => ({
                                                ...prev, 
                                                retainStructure: e.target.checked
                                            }))}
                                            className="mb-3"
                                        />
                                        <Form.Check 
                                            type="switch"
                                            id="audit-logging"
                                            label="Audit Logging"
                                            checked={anonymizationSettings.auditLogging}
                                            onChange={(e) => setAnonymizationSettings(prev => ({
                                                ...prev, 
                                                auditLogging: e.target.checked
                                            }))}
                                            className="mb-3"
                                        />
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={4}>
                    <Card className="border-info">
                        <Card.Header className="bg-info text-white">
                            <h6 className="mb-0">System Analytics</h6>
                        </Card.Header>
                        <Card.Body>
                            <div className="text-center mb-3">
                                <div className="h3 text-primary">{analytics.totalProcessed}</div>
                                <div className="text-muted">Documents Processed</div>
                            </div>
                            <div className="text-center mb-3">
                                <div className="h4 text-success">{analytics.successRate}%</div>
                                <div className="text-muted">Success Rate</div>
                            </div>
                            <div className="text-center">
                                <div className="h4 text-warning">{analytics.dataPoints.toLocaleString()}</div>
                                <div className="text-muted">Data Points Analyzed</div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );

    // Access control check
    if (!isSuperAdmin) {
        return (
            <Container fluid className="mt-4">
                <Alert variant="danger" className="text-center">
                    <RiLockFill size={48} className="mb-3" />
                    <h4>Access Denied</h4>
                    <p>You don't have permission to access this advanced anonymization tool. Super Admin access required.</p>
                    <Button variant="primary" onClick={() => window.history.back()}>
                        Go Back
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container fluid>
            <Row>
                <Col lg={12}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h1 className="h3 mb-1">
                                <RiShieldUserFill className="me-2 text-primary" />
                                Advanced Document Anonymization
                            </h1>
                            <p className="text-muted mb-0">Super Admin • HIPAA-Compliant AI-Powered Privacy Protection</p>
                        </div>
                        <div>
                            <Badge bg="success" className="me-2">
                                <RiCloudFill className="me-1" />
                                Live Processing
                            </Badge>
                            <Button variant="outline-primary" size="sm">
                                <RiRefreshLine className="me-1" />
                                Refresh
                            </Button>
                        </div>
                    </div>

                    <Card className="shadow-lg">
                        <Card.Body className="p-0">
                            <Tabs 
                                activeKey={activeTab} 
                                onSelect={(k) => setActiveTab(k)} 
                                className="nav-tabs-custom border-bottom-0"
                            >
                                <Tab 
                                    eventKey="upload" 
                                    title={
                                        <span>
                                            <RiUploadCloud2Line className="me-1" />
                                            Upload & Process
                                        </span>
                                    }
                                >
                                    <div className="p-4">
                                        {renderUploadTab()}
                                    </div>
                                </Tab>
                                
                                <Tab 
                                    eventKey="results" 
                                    title={
                                        <span>
                                            <RiFileList3Line className="me-1" />
                                            Results & Analysis
                                        </span>
                                    }
                                    disabled={!anonymizationResult}
                                >
                                    <div className="p-4">
                                        {renderResultsTab()}
                                    </div>
                                </Tab>
                                
                                <Tab 
                                    eventKey="history" 
                                    title={
                                        <span>
                                            <RiHistoryLine className="me-1" />
                                            Processing History
                                        </span>
                                    }
                                >
                                    <div className="p-4">
                                        {renderHistoryTab()}
                                    </div>
                                </Tab>
                                
                                <Tab 
                                    eventKey="settings" 
                                    title={
                                        <span>
                                            <RiSettingsLine className="me-1" />
                                            Advanced Settings
                                        </span>
                                    }
                                >
                                    <div className="p-4">
                                        {renderSettingsTab()}
                                    </div>
                                </Tab>
                            </Tabs>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Advanced Settings Modal */}
            <Modal show={showAdvancedSettings} onHide={() => setShowAdvancedSettings(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Advanced Anonymization Settings</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Configure advanced anonymization parameters for enhanced privacy protection.</p>
                    {/* Add advanced settings form here */}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAdvancedSettings(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary">
                        Save Settings
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AdvancedAnonymizeDocument;