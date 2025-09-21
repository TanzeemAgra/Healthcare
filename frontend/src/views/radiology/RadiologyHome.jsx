import React from 'react';
import { Container, Row, Col, Button, Alert, Badge } from 'react-bootstrap';
import Card from '../../components/Card';
import { Link } from 'react-router-dom';
import { usePermissions } from '../../contexts/PermissionContext';

// Custom styles for the radiology home page
const customStyles = `
    .feature-card {
        transition: all 0.3s ease;
        border-radius: 12px;
    }
    
    .feature-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important;
    }
    
    .bg-gradient-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    }
    
    .bg-gradient-success {
        background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%) !important;
    }
    
    .border-gradient-primary {
        border: 2px solid transparent;
        background: linear-gradient(white, white) padding-box, 
                   linear-gradient(135deg, #667eea, #764ba2) border-box;
    }
    
    .text-gradient-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    
    .pulse-animation {
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .section-divider {
        border-left: 4px solid #007bff;
        padding-left: 1rem;
    }
    
    .quick-stats-item {
        transition: all 0.2s ease;
    }
    
    .quick-stats-item:hover {
        transform: scale(1.05);
    }
    
    .border-gradient-primary:hover {
        transform: translateY(-8px);
        box-shadow: 0 15px 35px rgba(102, 126, 234, 0.25) !important;
    }
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = customStyles;
    document.head.appendChild(styleSheet);
}

const RadiologyHome = () => {
    const { canAccessRadiologyModule } = usePermissions();

    // Check if user has permission to access radiology module
    if (!canAccessRadiologyModule()) {
        return (
            <Container fluid className="py-4">
                <Row className="justify-content-center">
                    <Col md={6}>
                        <Alert variant="danger" className="text-center">
                            <i className="ri-error-warning-line ri-2x mb-3 d-block"></i>
                            <h5>Access Denied</h5>
                            <p className="mb-0">You don't have permission to access the Radiology module.</p>
                        </Alert>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container fluid>
            <Row className="justify-content-center">
                <Col lg={10} xl={8}>
                    <Card className="text-center shadow-sm">
                        <Card.Header className="bg-primary text-white">
                            <Card.Header.Title>
                                <h2 className="mb-0">Radiology Suite</h2>
                            </Card.Header.Title>
                        </Card.Header>
                        <Card.Body className="p-5">
                            <p className="lead mb-5">
                                Advanced AI-powered radiology suite with comprehensive tools for medical documentation, 
                                patient management, and clinical decision support.
                            </p>

                            {/* Section 1: AI-Powered Analysis & Documentation */}
                            <div className="mb-5">
                                <div className="d-flex align-items-center mb-4 section-divider">
                                    <i className="ri-robot-fill ri-2x text-primary me-3"></i>
                                    <h4 className="mb-0 text-primary fw-bold">AI-Powered Analysis & Documentation</h4>
                                </div>
                                <Row className="g-4">
                                    <Col lg={4} md={6}>
                                        <Card className="h-100 feature-card border-gradient-primary shadow-lg">
                                            <Card.Body className="d-flex flex-column align-items-center text-center p-4 position-relative">
                                                <div className="position-absolute top-0 end-0 m-2">
                                                    <Badge bg="warning" className="pulse-animation">
                                                        <i className="ri-star-fill me-1"></i>
                                                        NEW
                                                    </Badge>
                                                </div>
                                                <i className="ri-ai-generate ri-3x text-gradient-primary mb-3"></i>
                                                <h5 className="card-title fw-bold text-primary">Advanced Report Correction</h5>
                                                <p className="card-text small text-muted mb-3">
                                                    Next-generation AI with RAG technology, real-time preview, quality metrics, 
                                                    and soft-coded configuration for maximum flexibility and accuracy.
                                                </p>
                                                <div className="mb-2">
                                                    <Badge bg="success" className="me-1 small">GPT-4</Badge>
                                                    <Badge bg="info" className="me-1 small">RAG</Badge>
                                                    <Badge bg="warning" className="me-1 small">Real-time</Badge>
                                                </div>
                                                <Button 
                                                    variant="gradient-primary" 
                                                    as={Link} 
                                                    to="/radiology/advanced-report-correction" 
                                                    className="mt-auto shadow-sm"
                                                    style={{
                                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                        border: 'none',
                                                        color: 'white'
                                                    }}
                                                >
                                                    <i className="ri-magic-line me-1"></i>
                                                    Start Advanced Correction
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col lg={4} md={6}>
                                        <Card className="h-100 feature-card border-primary shadow-sm">
                                            <Card.Body className="d-flex flex-column align-items-center text-center p-4">
                                                <i className="ri-file-search-fill ri-3x text-primary mb-3"></i>
                                                <h5 className="card-title">Analyze Reports</h5>
                                                <p className="card-text small text-muted mb-3">AI-powered error detection and accuracy scoring for radiology narratives with real-time feedback.</p>
                                                <Button variant="primary" as={Link} to="/radiology/analyze-report" className="mt-auto">
                                                    <i className="ri-arrow-right-line me-1"></i>
                                                    Start Analysis
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col lg={4} md={6}>
                                        <Card className="h-100 feature-card border-success shadow-sm">
                                            <Card.Body className="d-flex flex-column align-items-center text-center p-4">
                                                <i className="ri-shield-user-fill ri-3x text-success mb-3"></i>
                                                <h5 className="card-title">Anonymize Documents</h5>
                                                <p className="card-text small text-muted mb-3">HIPAA-compliant PII redaction from medical documents for secure sharing and research.</p>
                                                <Button variant="success" as={Link} to="/radiology/anonymize" className="mt-auto">
                                                    <i className="ri-shield-check-line me-1"></i>
                                                    Secure Documents
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row className="g-4 mt-2">
                                    <Col lg={4} md={6}>
                                        <Card className="h-100 feature-card border-info shadow-sm">
                                            <Card.Body className="d-flex flex-column align-items-center text-center p-4">
                                                <i className="ri-history-fill ri-3x text-info mb-3"></i>
                                                <h5 className="card-title">Processing History</h5>
                                                <p className="card-text small text-muted mb-3">Complete audit trail of all analyses and anonymizations with detailed logs.</p>
                                                <Button variant="info" as={Link} to="/radiology/history" className="mt-auto">
                                                    <i className="ri-time-line me-1"></i>
                                                    View History
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </div>

                            {/* Section 2: Clinical Tools & References */}
                            <div className="mb-5">
                                <div className="d-flex align-items-center mb-4 section-divider" style={{ borderLeftColor: '#ffc107' }}>
                                    <i className="ri-stethoscope-fill ri-2x text-warning me-3"></i>
                                    <h4 className="mb-0 text-warning fw-bold">Clinical Tools & Assessment</h4>
                                </div>
                                <Row className="g-4">
                                    <Col lg={4} md={6}>
                                        <Card className="h-100 feature-card border-primary shadow-sm">
                                            <Card.Body className="d-flex flex-column align-items-center text-center p-4">
                                                <i className="ri-ai-generate ri-3x text-primary mb-3"></i>
                                                <h5 className="card-title">AI Report Correction</h5>
                                                <p className="card-text small text-muted mb-3">Generate corrected radiology reports using Generative AI and RAG techniques with medical knowledge integration.</p>
                                                <Button variant="primary" as={Link} to="/radiology/report-correction" className="mt-auto">
                                                    <i className="ri-magic-line me-1"></i>
                                                    Correct Reports
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col lg={4} md={6}>
                                        <Card className="h-100 feature-card border-success shadow-lg">
                                            <Card.Body className="d-flex flex-column align-items-center text-center p-4 position-relative">
                                                <div className="position-absolute top-0 end-0 m-2">
                                                    <Badge bg="primary" className="pulse-animation">
                                                        <i className="ri-ai-generate me-1"></i>
                                                        AI POWERED
                                                    </Badge>
                                                </div>
                                                <i className="ri-mic-fill ri-3x text-success mb-3"></i>
                                                <h5 className="card-title fw-bold text-success">Voice Recognition & Reporting</h5>
                                                <p className="card-text small text-muted mb-3">
                                                    Advanced AI-powered dictation support with structured templates, 
                                                    medical terminology optimization, and voice commands for radiologists.
                                                </p>
                                                <Button variant="success" as={Link} to="/radiology/voice-recognition" className="mt-auto">
                                                    <i className="ri-mic-line me-1"></i>
                                                    Start Dictation
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col lg={4} md={6}>
                                        <Card className="h-100 feature-card border-warning shadow-sm">
                                            <Card.Body className="d-flex flex-column align-items-center text-center p-4">
                                                <i className="ri-file-text-fill ri-3x text-warning mb-3"></i>
                                                <h5 className="card-title">Report Templates</h5>
                                                <p className="card-text small text-muted mb-3">Standardized clinical templates for structured radiology reporting with auto-fill features.</p>
                                                <Button variant="warning" as={Link} to="/radiology/report-templates" className="mt-auto">
                                                    <i className="ri-file-add-line me-1"></i>
                                                    Create Reports
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col lg={6} md={6}>
                                        <Card className="h-100 feature-card border-dark shadow-sm">
                                            <Card.Body className="d-flex flex-column align-items-center text-center p-4">
                                                <i className="ri-brain-fill ri-3x text-dark mb-3"></i>
                                                <h5 className="card-title">
                                                    Advanced AI RADS Calculator
                                                    <Badge bg="danger" className="ms-2">NEW</Badge>
                                                </h5>
                                                <p className="card-text small text-muted mb-3">AI-powered RADS analysis with Gen AI techniques, uncertainty quantification, and critical decision support.</p>
                                                <Button variant="dark" as={Link} to="/radiology/advanced-rads-calculator" className="mt-auto">
                                                    <i className="ri-brain-line me-1"></i>
                                                    AI Enhanced Analysis
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col lg={6} md={6}>
                                        <Card className="h-100 feature-card border-secondary shadow-sm">
                                            <Card.Body className="d-flex flex-column align-items-center text-center p-4">
                                                <i className="ri-book-open-fill ri-3x text-secondary mb-3"></i>
                                                <h5 className="card-title">Clinical Reference</h5>
                                                <p className="card-text small text-muted mb-3">Comprehensive reference guide for measurements, protocols, and differential diagnosis.</p>
                                                <Button variant="secondary" as={Link} to="/radiology/clinical-reference" className="mt-auto">
                                                    <i className="ri-search-line me-1"></i>
                                                    Browse Reference
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </div>

                            {/* Section 3: Patient Management & Workflow */}
                            <div className="mb-4">
                                <div className="d-flex align-items-center mb-4 section-divider" style={{ borderLeftColor: '#28a745' }}>
                                    <i className="ri-hospital-fill ri-2x text-success me-3"></i>
                                    <h4 className="mb-0 text-success fw-bold">Patient Management & Workflow</h4>
                                </div>
                                <Row className="g-4">
                                    <Col lg={3} md={6}>
                                        <Card className="h-100 feature-card border-primary shadow-sm">
                                            <Card.Body className="d-flex flex-column align-items-center text-center p-4">
                                                <i className="ri-user-heart-fill ri-3x text-primary mb-3"></i>
                                                <h5 className="card-title">Patient Registry</h5>
                                                <p className="card-text small text-muted mb-3">Comprehensive patient information management with medical history and imaging records.</p>
                                                <Button variant="primary" as={Link} to="/radiology/patient-registry" className="mt-auto">
                                                    <i className="ri-user-settings-line me-1"></i>
                                                    Manage Patients
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col lg={3} md={6}>
                                        <Card className="h-100 feature-card border-warning shadow-lg">
                                            <Card.Body className="d-flex flex-column align-items-center text-center p-4 position-relative">
                                                <div className="position-absolute top-0 end-0 m-2">
                                                    <Badge bg="danger" className="pulse-animation">
                                                        <i className="ri-database-2-fill me-1"></i>
                                                        S3
                                                    </Badge>
                                                </div>
                                                <i className="ri-database-fill ri-3x text-warning mb-3"></i>
                                                <h5 className="card-title">S3 Data Manager</h5>
                                                <p className="card-text small text-muted mb-3">Hierarchical AWS S3 storage system for DICOM files and medical imaging data with encryption.</p>
                                                <div className="mb-2">
                                                    <Badge bg="info" className="me-1 small">AWS S3</Badge>
                                                    <Badge bg="success" className="me-1 small">Encrypted</Badge>
                                                    <Badge bg="primary" className="me-1 small">HIPAA</Badge>
                                                </div>
                                                <Button 
                                                    variant="warning" 
                                                    as={Link} 
                                                    to="/radiology/data-manager" 
                                                    className="mt-auto"
                                                    style={{
                                                        background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
                                                        border: 'none',
                                                        color: '#333'
                                                    }}
                                                >
                                                    <i className="ri-database-2-line me-1"></i>
                                                    Manage Data
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col lg={3} md={6}>
                                        <Card className="h-100 feature-card border-success shadow-sm">
                                            <Card.Body className="d-flex flex-column align-items-center text-center p-4">
                                                <i className="ri-calendar-schedule-fill ri-3x text-success mb-3"></i>
                                                <h5 className="card-title">Imaging Schedule</h5>
                                                <p className="card-text small text-muted mb-3">Schedule and manage imaging appointments with real-time availability and workflow tracking.</p>
                                                <Button variant="success" as={Link} to="/radiology/imaging-schedule" className="mt-auto">
                                                    <i className="ri-calendar-line me-1"></i>
                                                    View Schedule
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col lg={3} md={6}>
                                        <Card className="h-100 feature-card border-info shadow-sm">
                                            <Card.Body className="d-flex flex-column align-items-center text-center p-4">
                                                <i className="ri-search-eye-fill ri-3x text-info mb-3"></i>
                                                <h5 className="card-title">Study Tracking</h5>
                                                <p className="card-text small text-muted mb-3">Track imaging studies from order to final report with real-time status monitoring and alerts.</p>
                                                <Button variant="info" as={Link} to="/radiology/study-tracking" className="mt-auto">
                                                    <i className="ri-radar-line me-1"></i>
                                                    Track Studies
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </div>

                            {/* Quick Stats Section */}
                            <div className="bg-light rounded p-4 mb-4">
                                <Row className="text-center">
                                    <Col md={3}>
                                        <div className="d-flex flex-column align-items-center quick-stats-item">
                                            <i className="ri-file-chart-fill ri-2x text-primary mb-2"></i>
                                            <h6 className="mb-1">AI Analysis</h6>
                                            <small className="text-muted">99.2% Accuracy</small>
                                        </div>
                                    </Col>
                                    <Col md={3}>
                                        <div className="d-flex flex-column align-items-center quick-stats-item">
                                            <i className="ri-shield-check-fill ri-2x text-success mb-2"></i>
                                            <h6 className="mb-1">HIPAA Compliant</h6>
                                            <small className="text-muted">Secure Processing</small>
                                        </div>
                                    </Col>
                                    <Col md={3}>
                                        <div className="d-flex flex-column align-items-center quick-stats-item">
                                            <i className="ri-time-fill ri-2x text-warning mb-2"></i>
                                            <h6 className="mb-1">Fast Processing</h6>
                                            <small className="text-muted">&lt; 30 seconds</small>
                                        </div>
                                    </Col>
                                    <Col md={3}>
                                        <div className="d-flex flex-column align-items-center quick-stats-item">
                                            <i className="ri-global-fill ri-2x text-info mb-2"></i>
                                            <h6 className="mb-1">24/7 Available</h6>
                                            <small className="text-muted">Cloud-based</small>
                                        </div>
                                    </Col>
                                </Row>
                            </div>

                            {/* Additional Tools Section */}
                            <div className="mb-4">
                                <div className="d-flex align-items-center mb-4 section-divider" style={{ borderLeftColor: '#6c757d' }}>
                                    <i className="ri-tools-fill ri-2x text-dark me-3"></i>
                                    <h4 className="mb-0 text-dark fw-bold">Additional Tools & Integration</h4>
                                </div>
                                <Row className="g-3">
                                    <Col lg={6} md={6}>
                                        <Card className="feature-card border-0 bg-gradient-primary text-white">
                                            <Card.Body className="d-flex align-items-center p-4">
                                                <i className="ri-chat-3-fill ri-3x me-3"></i>
                                                <div>
                                                    <h6 className="mb-1">Report Chat Interface</h6>
                                                    <small className="opacity-90">Interactive AI assistant for report queries</small>
                                                </div>
                                                <Button variant="light" size="sm" as={Link} to="/radiology/chat" className="ms-auto">
                                                    <i className="ri-arrow-right-line"></i>
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col lg={6} md={6}>
                                        <Card className="feature-card border-0 bg-gradient-success text-white">
                                            <Card.Body className="d-flex align-items-center p-4">
                                                <i className="ri-download-cloud-fill ri-3x me-3"></i>
                                                <div>
                                                    <h6 className="mb-1">Export & Integration</h6>
                                                    <small className="opacity-90">DICOM, HL7, and PACS connectivity</small>
                                                </div>
                                                <Button variant="light" size="sm" className="ms-auto">
                                                    <i className="ri-external-link-line"></i>
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </div>

                            {/* Help & Support */}
                            <div className="text-center pt-3 border-top">
                                <p className="text-muted mb-3">
                                    <i className="ri-information-line me-2"></i>
                                    Need help? Access our comprehensive documentation and support resources.
                                </p>
                                <div className="d-flex justify-content-center gap-3">
                                    <Button variant="outline-primary" size="sm">
                                        <i className="ri-book-line me-1"></i>
                                        Documentation
                                    </Button>
                                    <Button variant="outline-success" size="sm">
                                        <i className="ri-customer-service-line me-1"></i>
                                        Support
                                    </Button>
                                    <Button variant="outline-info" size="sm">
                                        <i className="ri-video-line me-1"></i>
                                        Tutorials
                                    </Button>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default RadiologyHome;