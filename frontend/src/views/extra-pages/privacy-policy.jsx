import React, { useState } from "react";
import { Col, Row, Container, Alert, Badge, Table, Button, Modal, Nav, Tab } from "react-bootstrap";
import Card from "../../components/Card";

// Import Remix Icons React components as backup
import { 
  RiInformationLine, 
  RiSettings3Line, 
  RiDownloadLine, 
  RiNavigationLine,
  RiHeartFill,
  RiUserFill,
  RiSettingsFill,
  RiHomeFill
} from '@remixicon/react'

const PrivacyPolicy = () => {
    const [showCookieModal, setShowCookieModal] = useState(false);
    const [showDataRequestModal, setShowDataRequestModal] = useState(false);
    
    const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    const handleCookieSettings = () => {
        setShowCookieModal(true);
    };

    const handleDataRequest = () => {
        setShowDataRequestModal(true);
    };

    return (
        <>
            <Container fluid>
                {/* Header Section */}
                <Row className="mb-5">
                    <Col lg={12}>
                        <div className="text-center">
                            <h1 className="display-4 fw-bold text-primary mb-3">Privacy Policy</h1>
                            <p className="lead text-muted mb-4">Your privacy is our priority. This policy explains how we collect, use, and protect your personal and health information.</p>
                            
                            {/* Icon Test Section */}
                            <div className="alert alert-info mb-4">
                                <h6>Icon Test (Remove this after verification):</h6>
                                <div className="mb-3">
                                    <strong>CSS Icons (using &lt;i&gt; tags):</strong>
                                    <div className="d-flex justify-content-center gap-3 mb-2">
                                        <i className="ri-heart-fill text-danger" style={{fontSize: '24px'}}></i>
                                        <i className="ri-user-fill text-primary" style={{fontSize: '24px'}}></i>
                                        <i className="ri-settings-fill text-success" style={{fontSize: '24px'}}></i>
                                        <i className="ri-home-fill text-warning" style={{fontSize: '24px'}}></i>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <strong>React Components:</strong>
                                    <div className="d-flex justify-content-center gap-3 mb-2">
                                        <RiHeartFill size={24} color="#dc3545" />
                                        <RiUserFill size={24} color="#0d6efd" />
                                        <RiSettingsFill size={24} color="#198754" />
                                        <RiHomeFill size={24} color="#ffc107" />
                                    </div>
                                </div>
                                <small>If you see icons above, the icon system is working correctly!</small>
                            </div>
                            
                            <div className="d-flex justify-content-center gap-2 mb-4 flex-wrap">
                                <Badge bg="success" className="px-3 py-2">GDPR Compliant</Badge>
                                <Badge bg="info" className="px-3 py-2">HIPAA Secure</Badge>
                                <Badge bg="warning" className="px-3 py-2">ISO 27001</Badge>
                                <Badge bg="secondary" className="px-3 py-2">SOC 2 Type II</Badge>
                                <Badge bg="primary" className="px-3 py-2">AI Ethics Certified</Badge>
                                <Badge bg="dark" className="px-3 py-2">Responsible AI</Badge>
                            </div>

                            <Alert variant="primary" className="text-start">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <RiInformationLine size={16} className="me-2" />
                                        <strong>Last Updated:</strong> {currentDate} | 
                                        <strong> Effective Date:</strong> {currentDate}
                                    </div>
                                    <div className="d-flex gap-2">
                                        <Button variant="outline-primary" size="sm" onClick={handleCookieSettings}>
                                            <RiSettings3Line size={14} className="me-1" />Cookie Settings
                                        </Button>
                                        <Button variant="outline-success" size="sm" onClick={handleDataRequest}>
                                            <RiDownloadLine size={14} className="me-1" />Request My Data
                                        </Button>
                                    </div>
                                </div>
                            </Alert>
                        </div>
                    </Col>
                </Row>

                {/* Quick Navigation */}
                <Row className="mb-4">
                    <Col lg={12}>
                        <Card className="border-0 shadow-sm">
                            <Card.Body>
                                <h5 className="mb-3">
                                    <RiNavigationLine size={20} className="me-2 text-primary" />
                                    Quick Navigation
                                </h5>
                                <div className="row">
                                    <div className="col-md-3">
                                        <ul className="list-unstyled">
                                            <li><a href="#data-collection" className="text-decoration-none">Data Collection</a></li>
                                            <li><a href="#ai-privacy" className="text-decoration-none">AI & GenAI Privacy</a></li>
                                            <li><a href="#hipaa-compliance" className="text-decoration-none">HIPAA Compliance</a></li>
                                            <li><a href="#gdpr-rights" className="text-decoration-none">GDPR Rights</a></li>
                                        </ul>
                                    </div>
                                    <div className="col-md-3">
                                        <ul className="list-unstyled">
                                            <li><a href="#data-security" className="text-decoration-none">Data Security</a></li>
                                            <li><a href="#ai-governance" className="text-decoration-none">AI Governance</a></li>
                                            <li><a href="#cookies" className="text-decoration-none">Cookies & Tracking</a></li>
                                            <li><a href="#third-parties" className="text-decoration-none">Third Parties</a></li>
                                        </ul>
                                    </div>
                                    <div className="col-md-3">
                                        <ul className="list-unstyled">
                                            <li><a href="#data-retention" className="text-decoration-none">Data Retention</a></li>
                                            <li><a href="#automated-decisions" className="text-decoration-none">Automated Decisions</a></li>
                                            <li><a href="#your-rights" className="text-decoration-none">Your Rights</a></li>
                                            <li><a href="#contact" className="text-decoration-none">Contact Us</a></li>
                                        </ul>
                                    </div>
                                    <div className="col-md-3">
                                        <ul className="list-unstyled">
                                            <li><a href="#international" className="text-decoration-none">International Transfers</a></li>
                                            <li><a href="#ai-transparency" className="text-decoration-none">AI Transparency</a></li>
                                            <li><a href="#children" className="text-decoration-none">Children's Privacy</a></li>
                                            <li><a href="#updates" className="text-decoration-none">Policy Updates</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Main Content */}
                <Row>
                    <Col lg={12}>
                        
                        {/* 1. Introduction */}
                        <Card className="mb-4 border-0 shadow-sm" id="introduction">
                            <Card.Header className="bg-primary text-white">
                                <h4 className="card-title mb-0">
                                    <i className="ri-user-heart-line me-2"></i>
                                    1. Introduction & Our Commitment
                                </h4>
                            </Card.Header>
                            <Card.Body>
                                <p className="lead">
                                    Healthcare Platform, Inc. ("we," "our," or "us") is committed to protecting your privacy and ensuring the security of your personal and health information.
                                </p>
                                
                                <div className="row mt-4">
                                    <div className="col-md-6">
                                        <h6 className="text-primary">Our Privacy Principles</h6>
                                        <ul>
                                            <li><strong>Transparency:</strong> Clear information about data practices</li>
                                            <li><strong>Choice:</strong> Control over your personal information</li>
                                            <li><strong>Security:</strong> Industry-leading protection measures</li>
                                            <li><strong>Accountability:</strong> Responsible data stewardship</li>
                                        </ul>
                                    </div>
                                    <div className="col-md-6">
                                        <h6 className="text-primary">Compliance Standards</h6>
                                        <ul>
                                            <li><strong>HIPAA:</strong> Health Insurance Portability and Accountability Act</li>
                                            <li><strong>GDPR:</strong> General Data Protection Regulation</li>
                                            <li><strong>CCPA:</strong> California Consumer Privacy Act</li>
                                            <li><strong>SOX:</strong> Sarbanes-Oxley Act (for financial data)</li>
                                        </ul>
                                    </div>
                                </div>

                                <Alert variant="info" className="mt-4">
                                    <strong>Important:</strong> This privacy policy applies to all users of our healthcare platform, including patients, healthcare providers, and administrative users.
                                </Alert>
                            </Card.Body>
                        </Card>

                        {/* 2. Data Collection */}
                        <Card className="mb-4 border-0 shadow-sm" id="data-collection">
                            <Card.Header className="bg-success text-white">
                                <h4 className="card-title mb-0">
                                    <i className="ri-database-2-line me-2"></i>
                                    2. Information We Collect
                                </h4>
                            </Card.Header>
                            <Card.Body>
                                <Tab.Container defaultActiveKey="personal">
                                    <Nav variant="pills" className="mb-3">
                                        <Nav.Item>
                                            <Nav.Link eventKey="personal">Personal Information</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="health">Health Information</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="technical">Technical Data</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="usage">Usage Analytics</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                    
                                    <Tab.Content>
                                        <Tab.Pane eventKey="personal">
                                            <h6 className="text-primary">Personal Identifiers</h6>
                                            <ul>
                                                <li>Full name, date of birth, gender</li>
                                                <li>Contact information (address, phone, email)</li>
                                                <li>Government-issued identification numbers</li>
                                                <li>Emergency contact information</li>
                                                <li>Insurance and payment information</li>
                                            </ul>
                                            
                                            <h6 className="text-primary mt-3">Professional Information (Healthcare Providers)</h6>
                                            <ul>
                                                <li>Medical license numbers and certifications</li>
                                                <li>Professional affiliations and specialties</li>
                                                <li>Education and training credentials</li>
                                                <li>Employment and practice information</li>
                                            </ul>
                                        </Tab.Pane>
                                        
                                        <Tab.Pane eventKey="health">
                                            <h6 className="text-primary">Protected Health Information (PHI)</h6>
                                            <ul>
                                                <li>Medical history and current conditions</li>
                                                <li>Medications and treatment plans</li>
                                                <li>Laboratory and diagnostic test results</li>
                                                <li>Provider notes and assessments</li>
                                                <li>Appointment and visit records</li>
                                                <li>Billing and claims information</li>
                                            </ul>
                                            
                                            <Alert variant="warning">
                                                <strong>Special Category Data:</strong> Health information is considered special category personal data under GDPR and requires explicit consent or other lawful basis for processing.
                                            </Alert>
                                        </Tab.Pane>
                                        
                                        <Tab.Pane eventKey="technical">
                                            <h6 className="text-primary">Technical Information</h6>
                                            <ul>
                                                <li>IP address and device identifiers</li>
                                                <li>Browser type and version</li>
                                                <li>Operating system information</li>
                                                <li>Login timestamps and session data</li>
                                                <li>System performance and error logs</li>
                                            </ul>
                                            
                                            <h6 className="text-primary mt-3">Security Data</h6>
                                            <ul>
                                                <li>Authentication and access logs</li>
                                                <li>Security incident records</li>
                                                <li>Fraud prevention data</li>
                                                <li>Audit trail information</li>
                                            </ul>
                                        </Tab.Pane>
                                        
                                        <Tab.Pane eventKey="usage">
                                            <h6 className="text-primary">Analytics and Usage Data</h6>
                                            <ul>
                                                <li>Feature usage and navigation patterns</li>
                                                <li>Time spent on different sections</li>
                                                <li>Search queries and results</li>
                                                <li>Performance metrics and load times</li>
                                                <li>User interface interactions</li>
                                            </ul>
                                            
                                            <Alert variant="info">
                                                <strong>Anonymization:</strong> Usage analytics are typically anonymized and aggregated to protect individual privacy while improving our services.
                                            </Alert>
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Tab.Container>
                            </Card.Body>
                        </Card>

                        {/* 2.5. AI & Generative AI Privacy */}
                        <Card className="mb-4 border-0 shadow-sm" id="ai-privacy">
                            <Card.Header className="bg-gradient" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white'}}>
                                <h4 className="card-title mb-0">
                                    <i className="ri-robot-2-line me-2"></i>
                                    2.5. AI & Generative AI Privacy Protection
                                </h4>
                            </Card.Header>
                            <Card.Body>
                                <Alert variant="info" className="mb-4">
                                    <strong>AI-Powered Healthcare:</strong> Our platform leverages advanced AI and Generative AI technologies to enhance healthcare delivery while maintaining the highest privacy standards.
                                </Alert>

                                <Tab.Container defaultActiveKey="ai-data">
                                    <Nav variant="pills" className="mb-3">
                                        <Nav.Item>
                                            <Nav.Link eventKey="ai-data">AI Data Processing</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="genai">Generative AI Models</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="ai-security">AI Security</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="ai-rights">AI Rights</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                    
                                    <Tab.Content>
                                        <Tab.Pane eventKey="ai-data">
                                            <h6 className="text-primary">AI Training Data</h6>
                                            <ul>
                                                <li><strong>De-identified Medical Data:</strong> Training datasets with all PHI removed</li>
                                                <li><strong>Synthetic Data Generation:</strong> AI-generated synthetic datasets for model training</li>
                                                <li><strong>Federated Learning:</strong> Distributed training without centralizing patient data</li>
                                                <li><strong>Differential Privacy:</strong> Mathematical privacy guarantees in AI training</li>
                                                <li><strong>Data Minimization:</strong> Only essential data used for AI model development</li>
                                            </ul>
                                            
                                            <h6 className="text-primary mt-3">Real-time AI Processing</h6>
                                            <ul>
                                                <li><strong>Edge Computing:</strong> Local AI processing to minimize data transmission</li>
                                                <li><strong>Homomorphic Encryption:</strong> AI analysis on encrypted data</li>
                                                <li><strong>Zero-Knowledge Proofs:</strong> Verification without revealing underlying data</li>
                                                <li><strong>Ephemeral Processing:</strong> Temporary AI analysis with automatic data deletion</li>
                                            </ul>

                                            <div className="row mt-4">
                                                <div className="col-md-6">
                                                    <div className="border rounded p-3 bg-light">
                                                        <h6 className="text-success">✓ AI Privacy Guarantees</h6>
                                                        <ul className="small mb-0">
                                                            <li>No PHI in AI training datasets</li>
                                                            <li>Automated data anonymization</li>
                                                            <li>AI model explainability</li>
                                                            <li>Bias detection and mitigation</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="border rounded p-3 bg-light">
                                                        <h6 className="text-info">🔒 Technical Safeguards</h6>
                                                        <ul className="small mb-0">
                                                            <li>Secure multi-party computation</li>
                                                            <li>AI model watermarking</li>
                                                            <li>Adversarial attack protection</li>
                                                            <li>Model audit trails</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </Tab.Pane>
                                        
                                        <Tab.Pane eventKey="genai">
                                            <h6 className="text-primary">Generative AI Applications</h6>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <div className="text-center p-3 border rounded">
                                                        <i className="ri-chat-3-line fs-2 text-primary"></i>
                                                        <h6 className="mt-2">Medical Chatbots</h6>
                                                        <ul className="small text-start">
                                                            <li>Dr. Max AI Assistant</li>
                                                            <li>Symptom analysis</li>
                                                            <li>Treatment recommendations</li>
                                                            <li>Patient education</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="text-center p-3 border rounded">
                                                        <i className="ri-file-text-line fs-2 text-success"></i>
                                                        <h6 className="mt-2">Clinical Documentation</h6>
                                                        <ul className="small text-start">
                                                            <li>Automated note generation</li>
                                                            <li>Report summarization</li>
                                                            <li>Coding assistance</li>
                                                            <li>Clinical decision support</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="text-center p-3 border rounded">
                                                        <i className="ri-image-line fs-2 text-warning"></i>
                                                        <h6 className="mt-2">Medical Imaging AI</h6>
                                                        <ul className="small text-start">
                                                            <li>Radiology analysis</li>
                                                            <li>Pathology detection</li>
                                                            <li>Dermatology screening</li>
                                                            <li>Emergency triage</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                            <h6 className="text-primary mt-4">GenAI Privacy Measures</h6>
                                            <Table striped className="mt-2">
                                                <thead>
                                                    <tr>
                                                        <th>AI Feature</th>
                                                        <th>Privacy Technology</th>
                                                        <th>Data Protection Level</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>Medical Chatbots</td>
                                                        <td>Contextual embedding + RAG</td>
                                                        <td><Badge bg="success">High</Badge></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Clinical NLP</td>
                                                        <td>On-premise LLMs</td>
                                                        <td><Badge bg="success">High</Badge></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Image Analysis</td>
                                                        <td>Federated learning</td>
                                                        <td><Badge bg="warning">Medium-High</Badge></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Predictive Analytics</td>
                                                        <td>Differential privacy</td>
                                                        <td><Badge bg="success">High</Badge></td>
                                                    </tr>
                                                </tbody>
                                            </Table>

                                            <Alert variant="success" className="mt-3">
                                                <strong>Zero Data Retention:</strong> Our GenAI models do not retain conversation history or training data containing PHI. All interactions are processed in real-time with immediate deletion of sensitive content.
                                            </Alert>
                                        </Tab.Pane>
                                        
                                        <Tab.Pane eventKey="ai-security">
                                            <h6 className="text-primary">AI Model Security</h6>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <h6 className="text-secondary">Model Protection</h6>
                                                    <ul>
                                                        <li><strong>Model Encryption:</strong> AES-256 encryption for AI models at rest</li>
                                                        <li><strong>Secure Inference:</strong> TEE (Trusted Execution Environment)</li>
                                                        <li><strong>Model Versioning:</strong> Cryptographic signatures for model integrity</li>
                                                        <li><strong>Access Controls:</strong> RBAC for AI model access</li>
                                                    </ul>
                                                </div>
                                                <div className="col-md-6">
                                                    <h6 className="text-secondary">Adversarial Protection</h6>
                                                    <ul>
                                                        <li><strong>Input Validation:</strong> Malicious input detection</li>
                                                        <li><strong>Output Sanitization:</strong> Response filtering and validation</li>
                                                        <li><strong>Prompt Injection Defense:</strong> Advanced prompt security</li>
                                                        <li><strong>Model Poisoning Prevention:</strong> Training data integrity checks</li>
                                                    </ul>
                                                </div>
                                            </div>

                                            <h6 className="text-primary mt-4">AI Governance Framework</h6>
                                            <div className="row">
                                                <div className="col-md-3 text-center">
                                                    <div className="p-3 border rounded bg-light">
                                                        <i className="ri-shield-check-line fs-2 text-success"></i>
                                                        <h6 className="mt-2">Ethics Board</h6>
                                                        <small>AI ethics oversight</small>
                                                    </div>
                                                </div>
                                                <div className="col-md-3 text-center">
                                                    <div className="p-3 border rounded bg-light">
                                                        <i className="ri-eye-line fs-2 text-primary"></i>
                                                        <h6 className="mt-2">Bias Monitoring</h6>
                                                        <small>Continuous fairness testing</small>
                                                    </div>
                                                </div>
                                                <div className="col-md-3 text-center">
                                                    <div className="p-3 border rounded bg-light">
                                                        <i className="ri-book-open-line fs-2 text-info"></i>
                                                        <h6 className="mt-2">Explainability</h6>
                                                        <small>AI decision transparency</small>
                                                    </div>
                                                </div>
                                                <div className="col-md-3 text-center">
                                                    <div className="p-3 border rounded bg-light">
                                                        <i className="ri-audit-line fs-2 text-warning"></i>
                                                        <h6 className="mt-2">Model Audits</h6>
                                                        <small>Regular AI assessments</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </Tab.Pane>
                                        
                                        <Tab.Pane eventKey="ai-rights">
                                            <h6 className="text-primary">Your AI-Related Rights</h6>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <h6 className="text-secondary">Transparency Rights</h6>
                                                    <ul>
                                                        <li><strong>AI Disclosure:</strong> Right to know when AI is involved in decisions</li>
                                                        <li><strong>Model Information:</strong> Access to AI model details affecting you</li>
                                                        <li><strong>Decision Explanation:</strong> Understanding of AI-driven recommendations</li>
                                                        <li><strong>Data Sources:</strong> Information about training data categories</li>
                                                    </ul>
                                                </div>
                                                <div className="col-md-6">
                                                    <h6 className="text-secondary">Control Rights</h6>
                                                    <ul>
                                                        <li><strong>AI Opt-out:</strong> Request human-only decision making</li>
                                                        <li><strong>Correction Rights:</strong> Fix errors in AI-processed data</li>
                                                        <li><strong>Bias Reporting:</strong> Report suspected AI bias or discrimination</li>
                                                        <li><strong>Model Preference:</strong> Choose specific AI models when available</li>
                                                    </ul>
                                                </div>
                                            </div>

                                            <Alert variant="primary" className="mt-3">
                                                <h6 className="alert-heading">AI Rights Enforcement</h6>
                                                <p className="mb-0">
                                                    Contact our AI Ethics Officer for AI-related concerns:<br/>
                                                    <strong>Email:</strong> ai-ethics@healthcare-platform.com<br/>
                                                    <strong>Response Time:</strong> 48 hours for AI-related inquiries
                                                </p>
                                            </Alert>
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Tab.Container>
                            </Card.Body>
                        </Card>

                        {/* 3. HIPAA Compliance */}
                        <Card className="mb-4 border-0 shadow-sm" id="hipaa-compliance">
                            <Card.Header className="bg-info text-white">
                                <h4 className="card-title mb-0">
                                    <i className="ri-shield-check-line me-2"></i>
                                    3. HIPAA Compliance & PHI Protection
                                </h4>
                            </Card.Header>
                            <Card.Body>
                                <div className="row">
                                    <div className="col-md-6">
                                        <h6 className="text-primary">HIPAA Covered Entity Status</h6>
                                        <p>As a healthcare technology platform, we operate as a HIPAA covered entity and/or business associate, depending on our relationship with healthcare providers.</p>
                                        
                                        <h6 className="text-primary mt-3">Permitted Uses and Disclosures</h6>
                                        <ul>
                                            <li><strong>Treatment:</strong> Coordinating care between providers</li>
                                            <li><strong>Payment:</strong> Processing insurance and billing</li>
                                            <li><strong>Healthcare Operations:</strong> Quality improvement activities</li>
                                        </ul>
                                    </div>
                                    <div className="col-md-6">
                                        <h6 className="text-primary">Minimum Necessary Standard</h6>
                                        <p>We limit PHI access to the minimum necessary to accomplish the intended purpose.</p>
                                        
                                        <h6 className="text-primary mt-3">Individual Rights Under HIPAA</h6>
                                        <ul>
                                            <li>Right to access PHI</li>
                                            <li>Right to request amendments</li>
                                            <li>Right to request restrictions</li>
                                            <li>Right to accounting of disclosures</li>
                                        </ul>
                                    </div>
                                </div>

                                <h6 className="text-primary mt-4">Business Associate Agreements</h6>
                                <p>All third-party vendors who may access PHI have signed Business Associate Agreements (BAAs) ensuring HIPAA compliance and appropriate safeguards.</p>

                                <Table striped bordered className="mt-3">
                                    <thead>
                                        <tr>
                                            <th>Safeguard Type</th>
                                            <th>Description</th>
                                            <th>Implementation</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><strong>Administrative</strong></td>
                                            <td>Policies and procedures</td>
                                            <td>Security officer, workforce training, incident response</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Physical</strong></td>
                                            <td>Facility and equipment protection</td>
                                            <td>Access controls, workstation security, media controls</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Technical</strong></td>
                                            <td>Technology-based protections</td>
                                            <td>Access controls, audit logs, encryption, authentication</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>

                        {/* 4. GDPR Rights */}
                        <Card className="mb-4 border-0 shadow-sm" id="gdpr-rights">
                            <Card.Header className="bg-warning text-dark">
                                <h4 className="card-title mb-0">
                                    <i className="ri-global-line me-2"></i>
                                    4. GDPR Rights & European Privacy Protection
                                </h4>
                            </Card.Header>
                            <Card.Body>
                                <p>For individuals in the European Economic Area (EEA), United Kingdom, and Switzerland, we comply with the General Data Protection Regulation (GDPR).</p>

                                <div className="row">
                                    <div className="col-md-6">
                                        <h6 className="text-primary">Legal Basis for Processing</h6>
                                        <ul>
                                            <li><strong>Consent:</strong> Explicit consent for health data processing</li>
                                            <li><strong>Vital Interests:</strong> Life-threatening emergency situations</li>
                                            <li><strong>Legitimate Interests:</strong> Healthcare service provision</li>
                                            <li><strong>Legal Obligation:</strong> Compliance with healthcare laws</li>
                                            <li><strong>Public Task:</strong> Public health activities</li>
                                        </ul>
                                    </div>
                                    <div className="col-md-6">
                                        <h6 className="text-primary">Data Subject Rights</h6>
                                        <ul>
                                            <li><strong>Right of Access:</strong> Obtain copies of your data</li>
                                            <li><strong>Right to Rectification:</strong> Correct inaccurate data</li>
                                            <li><strong>Right to Erasure:</strong> "Right to be forgotten"</li>
                                            <li><strong>Right to Restrict Processing:</strong> Limit data use</li>
                                            <li><strong>Right to Data Portability:</strong> Transfer your data</li>
                                            <li><strong>Right to Object:</strong> Opt-out of certain processing</li>
                                        </ul>
                                    </div>
                                </div>

                                <Alert variant="success" className="mt-3">
                                    <h6 className="alert-heading">Data Protection Officer (DPO)</h6>
                                    <p className="mb-0">
                                        Our Data Protection Officer oversees GDPR compliance and can be reached at: <br/>
                                        <strong>Email:</strong> dpo@healthcare-platform.com <br/>
                                        <strong>Response Time:</strong> Within 30 days of receipt
                                    </p>
                                </Alert>
                            </Card.Body>
                        </Card>

                        {/* 4.5. AI Governance & Automated Decision Making */}
                        <Card className="mb-4 border-0 shadow-sm" id="ai-governance">
                            <Card.Header className="bg-gradient" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white'}}>
                                <h4 className="card-title mb-0">
                                    <i className="ri-brain-line me-2"></i>
                                    4.5. AI Governance & Automated Decision Making
                                </h4>
                            </Card.Header>
                            <Card.Body>
                                <Alert variant="warning" className="mb-4">
                                    <strong>Automated Healthcare Decisions:</strong> We use AI to assist in medical decision-making. You have the right to understand and challenge these decisions.
                                </Alert>

                                <div className="row">
                                    <div className="col-md-6">
                                        <h6 className="text-primary">AI-Assisted Medical Decisions</h6>
                                        <Table responsive striped className="mt-2">
                                            <thead>
                                                <tr>
                                                    <th>Decision Type</th>
                                                    <th>AI Involvement</th>
                                                    <th>Human Oversight</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Diagnosis Support</td>
                                                    <td><Badge bg="info">Advisory</Badge></td>
                                                    <td><Badge bg="success">Required</Badge></td>
                                                </tr>
                                                <tr>
                                                    <td>Treatment Planning</td>
                                                    <td><Badge bg="info">Advisory</Badge></td>
                                                    <td><Badge bg="success">Required</Badge></td>
                                                </tr>
                                                <tr>
                                                    <td>Risk Assessment</td>
                                                    <td><Badge bg="warning">Automated</Badge></td>
                                                    <td><Badge bg="warning">Review</Badge></td>
                                                </tr>
                                                <tr>
                                                    <td>Emergency Triage</td>
                                                    <td><Badge bg="danger">Critical</Badge></td>
                                                    <td><Badge bg="success">Immediate</Badge></td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </div>
                                    <div className="col-md-6">
                                        <h6 className="text-primary">AI Model Governance</h6>
                                        <div className="timeline">
                                            <div className="timeline-item">
                                                <div className="timeline-marker bg-primary"></div>
                                                <div className="timeline-content">
                                                    <h6>1. Model Development</h6>
                                                    <p className="small">Ethical AI design with bias testing</p>
                                                </div>
                                            </div>
                                            <div className="timeline-item">
                                                <div className="timeline-marker bg-warning"></div>
                                                <div className="timeline-content">
                                                    <h6>2. Clinical Validation</h6>
                                                    <p className="small">Medical professional review and approval</p>
                                                </div>
                                            </div>
                                            <div className="timeline-item">
                                                <div className="timeline-marker bg-info"></div>
                                                <div className="timeline-content">
                                                    <h6>3. Deployment Monitoring</h6>
                                                    <p className="small">Continuous performance and bias monitoring</p>
                                                </div>
                                            </div>
                                            <div className="timeline-item">
                                                <div className="timeline-marker bg-success"></div>
                                                <div className="timeline-content">
                                                    <h6>4. Regular Audits</h6>
                                                    <p className="small">Quarterly AI ethics and performance reviews</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <h6 className="text-primary mt-4">Explainable AI (XAI) Implementation</h6>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="text-center p-3 border rounded">
                                            <i className="ri-lightbulb-line fs-2 text-warning"></i>
                                            <h6 className="mt-2">Decision Explanations</h6>
                                            <p className="small">Clear reasoning for AI recommendations</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="text-center p-3 border rounded">
                                            <i className="ri-bar-chart-line fs-2 text-info"></i>
                                            <h6 className="mt-2">Confidence Scores</h6>
                                            <p className="small">Transparency in AI prediction certainty</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="text-center p-3 border rounded">
                                            <i className="ri-team-line fs-2 text-success"></i>
                                            <h6 className="mt-2">Human Override</h6>
                                            <p className="small">Always available for critical decisions</p>
                                        </div>
                                    </div>
                                </div>

                                <Alert variant="info" className="mt-4">
                                    <h6 className="alert-heading">AI Transparency Dashboard</h6>
                                    <p className="mb-0">
                                        Access your personal AI interaction history and explanations through your patient portal.
                                        <br/><strong>Features:</strong> Decision logs, confidence scores, alternative recommendations, bias metrics
                                    </p>
                                </Alert>
                            </Card.Body>
                        </Card>

                        {/* Automated Decision Section */}
                        <Card className="mb-4 border-0 shadow-sm" id="automated-decisions">
                            <Card.Header className="bg-gradient" style={{background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', color: '#333'}}>
                                <h4 className="card-title mb-0">
                                    <i className="ri-robot-line me-2"></i>
                                    Automated Decision Making & Profiling
                                </h4>
                            </Card.Header>
                            <Card.Body>
                                <div className="row">
                                    <div className="col-md-8">
                                        <h6 className="text-primary">Automated Healthcare Processes</h6>
                                        <p>Our platform uses automated decision-making in the following scenarios:</p>
                                        <ul>
                                            <li><strong>Appointment Scheduling:</strong> AI optimization for slot allocation</li>
                                            <li><strong>Prescription Renewals:</strong> Automated approval for routine medications</li>
                                            <li><strong>Insurance Pre-authorization:</strong> Automated claims processing</li>
                                            <li><strong>Clinical Alerts:</strong> AI-triggered safety notifications</li>
                                            <li><strong>Resource Allocation:</strong> Dynamic healthcare resource management</li>
                                        </ul>

                                        <h6 className="text-primary mt-3">Patient Profiling for Personalized Care</h6>
                                        <ul>
                                            <li><strong>Risk Stratification:</strong> AI-based health risk assessment</li>
                                            <li><strong>Treatment Recommendations:</strong> Personalized therapy suggestions</li>
                                            <li><strong>Preventive Care:</strong> Proactive health screening recommendations</li>
                                            <li><strong>Care Coordination:</strong> Automated provider matching</li>
                                        </ul>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="bg-light p-3 rounded">
                                            <h6 className="text-success">Your Rights</h6>
                                            <div className="d-grid gap-2">
                                                <Button variant="outline-primary" size="sm">
                                                    <i className="ri-information-line me-1"></i>Request Explanation
                                                </Button>
                                                <Button variant="outline-warning" size="sm">
                                                    <i className="ri-user-line me-1"></i>Human Review
                                                </Button>
                                                <Button variant="outline-danger" size="sm">
                                                    <i className="ri-close-line me-1"></i>Opt-out
                                                </Button>
                                                <Button variant="outline-success" size="sm">
                                                    <i className="ri-edit-line me-1"></i>Challenge Decision
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Alert variant="primary" className="mt-4">
                                    <strong>No Solely Automated Critical Decisions:</strong> Life-critical medical decisions always include human oversight and can be reviewed by a qualified healthcare professional upon request.
                                </Alert>
                            </Card.Body>
                        </Card>

                        {/* AI Transparency Section */}
                        <Card className="mb-4 border-0 shadow-sm" id="ai-transparency">
                            <Card.Header className="bg-gradient" style={{background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', color: '#333'}}>
                                <h4 className="card-title mb-0">
                                    <i className="ri-eye-2-line me-2"></i>
                                    AI Transparency & Model Information
                                </h4>
                            </Card.Header>
                            <Card.Body>
                                <Tab.Container defaultActiveKey="model-info">
                                    <Nav variant="pills" className="mb-3">
                                        <Nav.Item>
                                            <Nav.Link eventKey="model-info">Model Information</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="performance">Performance Metrics</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="limitations">Limitations & Risks</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="updates">Model Updates</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                    
                                    <Tab.Content>
                                        <Tab.Pane eventKey="model-info">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <h6 className="text-primary">Current AI Models</h6>
                                                    <Table responsive striped>
                                                        <thead>
                                                            <tr>
                                                                <th>Model</th>
                                                                <th>Purpose</th>
                                                                <th>Version</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>MedLLM-2024</td>
                                                                <td>Clinical Assistant</td>
                                                                <td>v3.2.1</td>
                                                            </tr>
                                                            <tr>
                                                                <td>DiagnosticAI</td>
                                                                <td>Medical Imaging</td>
                                                                <td>v2.8.0</td>
                                                            </tr>
                                                            <tr>
                                                                <td>RiskPredictor</td>
                                                                <td>Risk Assessment</td>
                                                                <td>v1.5.3</td>
                                                            </tr>
                                                            <tr>
                                                                <td>TreatmentOptimizer</td>
                                                                <td>Care Planning</td>
                                                                <td>v2.1.0</td>
                                                            </tr>
                                                        </tbody>
                                                    </Table>
                                                </div>
                                                <div className="col-md-6">
                                                    <h6 className="text-primary">Training Information</h6>
                                                    <ul>
                                                        <li><strong>Training Data:</strong> Anonymized medical literature, de-identified clinical notes, synthetic datasets</li>
                                                        <li><strong>Data Sources:</strong> Medical journals, clinical guidelines, anonymized EHRs</li>
                                                        <li><strong>Training Period:</strong> January 2023 - December 2024</li>
                                                        <li><strong>Validation:</strong> Independent clinical validation on held-out datasets</li>
                                                        <li><strong>Bias Testing:</strong> Comprehensive fairness evaluation across demographics</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </Tab.Pane>
                                        
                                        <Tab.Pane eventKey="performance">
                                            <h6 className="text-primary">Model Performance Metrics</h6>
                                            <div className="row">
                                                <div className="col-md-3 text-center">
                                                    <div className="p-3 border rounded bg-light">
                                                        <h3 className="text-success">94.2%</h3>
                                                        <small>Diagnostic Accuracy</small>
                                                    </div>
                                                </div>
                                                <div className="col-md-3 text-center">
                                                    <div className="p-3 border rounded bg-light">
                                                        <h3 className="text-info">96.8%</h3>
                                                        <small>Treatment Appropriateness</small>
                                                    </div>
                                                </div>
                                                <div className="col-md-3 text-center">
                                                    <div className="p-3 border rounded bg-light">
                                                        <h3 className="text-warning">2.1%</h3>
                                                        <small>False Positive Rate</small>
                                                    </div>
                                                </div>
                                                <div className="col-md-3 text-center">
                                                    <div className="p-3 border rounded bg-light">
                                                        <h3 className="text-primary">1.8%</h3>
                                                        <small>False Negative Rate</small>
                                                    </div>
                                                </div>
                                            </div>

                                            <h6 className="text-primary mt-4">Fairness Metrics</h6>
                                            <Table responsive striped>
                                                <thead>
                                                    <tr>
                                                        <th>Demographic</th>
                                                        <th>Performance Parity</th>
                                                        <th>Bias Score</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>Gender</td>
                                                        <td>98.5%</td>
                                                        <td>0.02</td>
                                                        <td><Badge bg="success">Acceptable</Badge></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Race/Ethnicity</td>
                                                        <td>97.2%</td>
                                                        <td>0.04</td>
                                                        <td><Badge bg="success">Acceptable</Badge></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Age Groups</td>
                                                        <td>96.8%</td>
                                                        <td>0.05</td>
                                                        <td><Badge bg="warning">Monitoring</Badge></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Socioeconomic</td>
                                                        <td>95.9%</td>
                                                        <td>0.07</td>
                                                        <td><Badge bg="warning">Monitoring</Badge></td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </Tab.Pane>
                                        
                                        <Tab.Pane eventKey="limitations">
                                            <h6 className="text-primary">Known Limitations</h6>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <Alert variant="warning">
                                                        <h6 className="alert-heading">Clinical Limitations</h6>
                                                        <ul className="mb-0">
                                                            <li>Cannot replace clinical judgment</li>
                                                            <li>Limited rare disease recognition</li>
                                                            <li>May miss complex comorbidities</li>
                                                            <li>Requires human validation</li>
                                                        </ul>
                                                    </Alert>
                                                </div>
                                                <div className="col-md-6">
                                                    <Alert variant="danger">
                                                        <h6 className="alert-heading">Technical Risks</h6>
                                                        <ul className="mb-0">
                                                            <li>Potential algorithmic bias</li>
                                                            <li>Training data limitations</li>
                                                            <li>Model hallucinations possible</li>
                                                            <li>Adversarial attack vulnerability</li>
                                                        </ul>
                                                    </Alert>
                                                </div>
                                            </div>

                                            <h6 className="text-primary">Risk Mitigation Strategies</h6>
                                            <ul>
                                                <li><strong>Continuous Monitoring:</strong> Real-time performance tracking</li>
                                                <li><strong>Human Oversight:</strong> Mandatory clinical review for critical decisions</li>
                                                <li><strong>Bias Detection:</strong> Automated fairness monitoring</li>
                                                <li><strong>Regular Updates:</strong> Quarterly model retraining and evaluation</li>
                                                <li><strong>Error Reporting:</strong> Patient and provider feedback systems</li>
                                            </ul>
                                        </Tab.Pane>
                                        
                                        <Tab.Pane eventKey="updates">
                                            <h6 className="text-primary">Model Update Process</h6>
                                            <div className="timeline">
                                                <div className="timeline-item">
                                                    <div className="timeline-marker bg-primary"></div>
                                                    <div className="timeline-content">
                                                        <h6>Monthly Performance Review</h6>
                                                        <p className="small">Automated performance metrics analysis</p>
                                                    </div>
                                                </div>
                                                <div className="timeline-item">
                                                    <div className="timeline-marker bg-warning"></div>
                                                    <div className="timeline-content">
                                                        <h6>Quarterly Model Updates</h6>
                                                        <p className="small">Incorporation of new medical evidence</p>
                                                    </div>
                                                </div>
                                                <div className="timeline-item">
                                                    <div className="timeline-marker bg-info"></div>
                                                    <div className="timeline-content">
                                                        <h6>Annual Major Releases</h6>
                                                        <p className="small">Significant model improvements and features</p>
                                                    </div>
                                                </div>
                                                <div className="timeline-item">
                                                    <div className="timeline-marker bg-success"></div>
                                                    <div className="timeline-content">
                                                        <h6>User Notification</h6>
                                                        <p className="small">Advance notice of model changes</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <Alert variant="info" className="mt-3">
                                                <strong>Model Change Notifications:</strong> You will be notified 30 days in advance of any significant AI model updates that may affect your care.
                                            </Alert>
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Tab.Container>
                            </Card.Body>
                        </Card>

                        {/* 5. Data Security */}
                        <Card className="mb-4 border-0 shadow-sm" id="data-security">
                            <Card.Header className="bg-danger text-white">
                                <h4 className="card-title mb-0">
                                    <i className="ri-lock-2-line me-2"></i>
                                    5. Data Security & Protection Measures
                                </h4>
                            </Card.Header>
                            <Card.Body>
                                <div className="row">
                                    <div className="col-md-4">
                                        <h6 className="text-primary">Encryption</h6>
                                        <ul>
                                            <li>AES-256 encryption at rest</li>
                                            <li>TLS 1.3 for data in transit</li>
                                            <li>End-to-end encryption for sensitive communications</li>
                                            <li>Key management using HSM</li>
                                        </ul>
                                    </div>
                                    <div className="col-md-4">
                                        <h6 className="text-primary">Access Controls</h6>
                                        <ul>
                                            <li>Multi-factor authentication (MFA)</li>
                                            <li>Role-based access control (RBAC)</li>
                                            <li>Principle of least privilege</li>
                                            <li>Regular access reviews</li>
                                        </ul>
                                    </div>
                                    <div className="col-md-4">
                                        <h6 className="text-primary">Monitoring</h6>
                                        <ul>
                                            <li>24/7 security operations center</li>
                                            <li>Real-time threat detection</li>
                                            <li>Comprehensive audit logging</li>
                                            <li>Automated incident response</li>
                                        </ul>
                                    </div>
                                </div>

                                <h6 className="text-primary mt-4">Compliance Certifications</h6>
                                <div className="row">
                                    <div className="col-md-3 text-center">
                                        <div className="p-3 border rounded">
                                            <i className="ri-shield-check-line fs-2 text-success"></i>
                                            <h6 className="mt-2">SOC 2 Type II</h6>
                                            <small className="text-muted">Security & Availability</small>
                                        </div>
                                    </div>
                                    <div className="col-md-3 text-center">
                                        <div className="p-3 border rounded">
                                            <i className="ri-global-line fs-2 text-primary"></i>
                                            <h6 className="mt-2">ISO 27001</h6>
                                            <small className="text-muted">Information Security</small>
                                        </div>
                                    </div>
                                    <div className="col-md-3 text-center">
                                        <div className="p-3 border rounded">
                                            <i className="ri-heart-pulse-line fs-2 text-danger"></i>
                                            <h6 className="mt-2">HIPAA</h6>
                                            <small className="text-muted">Healthcare Privacy</small>
                                        </div>
                                    </div>
                                    <div className="col-md-3 text-center">
                                        <div className="p-3 border rounded">
                                            <i className="ri-shield-user-line fs-2 text-warning"></i>
                                            <h6 className="mt-2">GDPR</h6>
                                            <small className="text-muted">Data Protection</small>
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>

                        {/* 6. Cookies & Tracking */}
                        <Card className="mb-4 border-0 shadow-sm" id="cookies">
                            <Card.Header className="bg-secondary text-white">
                                <h4 className="card-title mb-0">
                                    <i className="ri-settings-3-line me-2"></i>
                                    6. Cookies & Tracking Technologies
                                </h4>
                            </Card.Header>
                            <Card.Body>
                                <Table responsive striped>
                                    <thead>
                                        <tr>
                                            <th>Cookie Type</th>
                                            <th>Purpose</th>
                                            <th>Duration</th>
                                            <th>Consent Required</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><strong>Essential</strong></td>
                                            <td>Security, authentication, session management</td>
                                            <td>Session/24 hours</td>
                                            <td><Badge bg="success">No</Badge></td>
                                        </tr>
                                        <tr>
                                            <td><strong>Functional</strong></td>
                                            <td>User preferences, language settings</td>
                                            <td>1 year</td>
                                            <td><Badge bg="warning">Yes</Badge></td>
                                        </tr>
                                        <tr>
                                            <td><strong>Analytics</strong></td>
                                            <td>Usage statistics, performance monitoring</td>
                                            <td>2 years</td>
                                            <td><Badge bg="warning">Yes</Badge></td>
                                        </tr>
                                        <tr>
                                            <td><strong>Marketing</strong></td>
                                            <td>Targeted advertising, social media</td>
                                            <td>1 year</td>
                                            <td><Badge bg="danger">Yes</Badge></td>
                                        </tr>
                                    </tbody>
                                </Table>

                                <Alert variant="info" className="mt-3">
                                    <strong>Cookie Management:</strong> You can manage your cookie preferences through your browser settings or our cookie preference center.
                                </Alert>
                            </Card.Body>
                        </Card>

                        {/* 7. Your Rights */}
                        <Card className="mb-4 border-0 shadow-sm" id="your-rights">
                            <Card.Header className="bg-primary text-white">
                                <h4 className="card-title mb-0">
                                    <i className="ri-user-settings-line me-2"></i>
                                    7. Your Privacy Rights & How to Exercise Them
                                </h4>
                            </Card.Header>
                            <Card.Body>
                                <div className="row">
                                    <div className="col-md-6">
                                        <h6 className="text-primary">How to Submit Requests</h6>
                                        <ul>
                                            <li><strong>Online:</strong> Through your account settings</li>
                                            <li><strong>Email:</strong> privacy@healthcare-platform.com</li>
                                            <li><strong>Phone:</strong> 1-800-PRIVACY (toll-free)</li>
                                            <li><strong>Mail:</strong> Privacy Officer, [Address]</li>
                                        </ul>
                                    </div>
                                    <div className="col-md-6">
                                        <h6 className="text-primary">Response Timeframes</h6>
                                        <ul>
                                            <li><strong>HIPAA Requests:</strong> 30 days</li>
                                            <li><strong>GDPR Requests:</strong> 30 days (ext. 60)</li>
                                            <li><strong>CCPA Requests:</strong> 45 days</li>
                                            <li><strong>Urgent Safety Issues:</strong> 24 hours</li>
                                        </ul>
                                    </div>
                                </div>

                                <h6 className="text-primary mt-4">Request Processing</h6>
                                <div className="timeline">
                                    <div className="timeline-item">
                                        <div className="timeline-marker bg-primary"></div>
                                        <div className="timeline-content">
                                            <h6>1. Request Received</h6>
                                            <p>We acknowledge receipt within 24 hours</p>
                                        </div>
                                    </div>
                                    <div className="timeline-item">
                                        <div className="timeline-marker bg-warning"></div>
                                        <div className="timeline-content">
                                            <h6>2. Identity Verification</h6>
                                            <p>Secure verification process to protect your privacy</p>
                                        </div>
                                    </div>
                                    <div className="timeline-item">
                                        <div className="timeline-marker bg-info"></div>
                                        <div className="timeline-content">
                                            <h6>3. Request Processing</h6>
                                            <p>Our privacy team reviews and processes your request</p>
                                        </div>
                                    </div>
                                    <div className="timeline-item">
                                        <div className="timeline-marker bg-success"></div>
                                        <div className="timeline-content">
                                            <h6>4. Response Delivered</h6>
                                            <p>Secure delivery of requested information or confirmation</p>
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>

                        {/* 8. Contact Information */}
                        <Card className="mb-4 border-0 shadow-sm" id="contact">
                            <Card.Header className="bg-success text-white">
                                <h4 className="card-title mb-0">
                                    <i className="ri-customer-service-2-line me-2"></i>
                                    8. Contact Information & Support
                                </h4>
                            </Card.Header>
                            <Card.Body>
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className="text-center p-3 border rounded">
                                            <i className="ri-shield-user-line fs-1 text-primary"></i>
                                            <h6 className="mt-2">Privacy Officer</h6>
                                            <p className="small">HIPAA & General Privacy</p>
                                            <code>privacy@healthcare-platform.com</code>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="text-center p-3 border rounded">
                                            <i className="ri-global-line fs-1 text-success"></i>
                                            <h6 className="mt-2">Data Protection Officer</h6>
                                            <p className="small">GDPR & European Privacy</p>
                                            <code>dpo@healthcare-platform.com</code>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="text-center p-3 border rounded">
                                            <i className="ri-robot-2-line fs-1 text-info"></i>
                                            <h6 className="mt-2">AI Ethics Officer</h6>
                                            <p className="small">AI Governance & Ethics</p>
                                            <code>ai-ethics@healthcare-platform.com</code>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="text-center p-3 border rounded">
                                            <i className="ri-secure-payment-line fs-1 text-danger"></i>
                                            <h6 className="mt-2">Security Team</h6>
                                            <p className="small">Security Incidents</p>
                                            <code>security@healthcare-platform.com</code>
                                        </div>
                                    </div>
                                </div>

                                <Alert variant="primary" className="mt-4">
                                    <h6 className="alert-heading">24/7 Support Available</h6>
                                    <p className="mb-0">
                                        For urgent privacy or security concerns, contact our 24/7 hotline:<br/>
                                        <strong>Phone:</strong> 1-800-PRIVACY (1-800-774-8229)<br/>
                                        <strong>International:</strong> +1-555-PRIVACY
                                    </p>
                                </Alert>
                            </Card.Body>
                        </Card>

                    </Col>
                </Row>
            </Container>

            {/* Cookie Settings Modal */}
            <Modal show={showCookieModal} onHide={() => setShowCookieModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="ri-settings-3-line me-2"></i>
                        Cookie Preferences
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Manage your cookie preferences to control how we collect and use your data.</p>
                    
                    <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h6>Essential Cookies</h6>
                                <small className="text-muted">Required for basic functionality</small>
                            </div>
                            <Badge bg="success">Always Active</Badge>
                        </div>
                    </div>
                    
                    <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h6>Functional Cookies</h6>
                                <small className="text-muted">Remember your preferences</small>
                            </div>
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" defaultChecked />
                            </div>
                        </div>
                    </div>
                    
                    <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h6>Analytics Cookies</h6>
                                <small className="text-muted">Help us improve our services</small>
                            </div>
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h6>Marketing Cookies</h6>
                                <small className="text-muted">Personalized advertising</small>
                            </div>
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" />
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowCookieModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={() => setShowCookieModal(false)}>
                        Save Preferences
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Data Request Modal */}
            <Modal show={showDataRequestModal} onHide={() => setShowDataRequestModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="ri-download-line me-2"></i>
                        Request Your Data & AI Information
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Submit a request to access, modify, or delete your personal information and AI-related data.</p>
                    
                    <div className="mb-3">
                        <label className="form-label">Request Type</label>
                        <select className="form-select">
                            <option>Access my data</option>
                            <option>Access AI interactions</option>
                            <option>AI decision explanations</option>
                            <option>Correct my data</option>
                            <option>Delete my data</option>
                            <option>Delete AI training contributions</option>
                            <option>Port my data</option>
                            <option>Restrict AI processing</option>
                            <option>Opt-out of AI features</option>
                            <option>Request human review</option>
                            <option>Report AI bias</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">AI-Specific Information</label>
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="aiDecisions" />
                            <label className="form-check-label" htmlFor="aiDecisions">
                                Include AI decision history and explanations
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="aiModels" />
                            <label className="form-check-label" htmlFor="aiModels">
                                Provide information about AI models used in my care
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="aiTraining" />
                            <label className="form-check-label" htmlFor="aiTraining">
                                Include any contribution to AI training (anonymized)
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="aiRisk" />
                            <label className="form-check-label" htmlFor="aiRisk">
                                Request AI risk assessment data
                            </label>
                        </div>
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea className="form-control" rows="3" placeholder="Please describe your request, including any specific AI concerns or questions..."></textarea>
                    </div>
                    
                    <Alert variant="info">
                        <strong>Verification Required:</strong> We will need to verify your identity before processing this request to protect your privacy. AI-related requests may require additional verification steps.
                    </Alert>

                    <Alert variant="warning">
                        <strong>AI Request Processing:</strong> AI-related data requests may take additional time (up to 45 days) due to the complex nature of AI system data extraction and explanation generation.
                    </Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowDataRequestModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={() => setShowDataRequestModal(false)}>
                        Submit Request
                    </Button>
                </Modal.Footer>
            </Modal>

            <style jsx>{`
                .timeline {
                    position: relative;
                    padding-left: 30px;
                }
                .timeline::before {
                    content: '';
                    position: absolute;
                    left: 15px;
                    top: 0;
                    bottom: 0;
                    width: 2px;
                    background: #e9ecef;
                }
                .timeline-item {
                    position: relative;
                    margin-bottom: 25px;
                }
                .timeline-marker {
                    position: absolute;
                    left: -23px;
                    top: 5px;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    border: 3px solid white;
                    box-shadow: 0 0 0 2px #e9ecef;
                }
                .timeline-content h6 {
                    margin-bottom: 5px;
                    color: #333;
                }
                .timeline-content p {
                    margin-bottom: 0;
                    color: #666;
                    font-size: 14px;
                }
            `}</style>
        </>
    )
}

export default PrivacyPolicy