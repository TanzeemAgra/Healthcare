import React, { useState } from "react";
import { Col, Row, Container, Alert, Badge, Table, Button, Modal, Nav, Tab } from "react-bootstrap";
import Card from "../../components/Card";

const PrivacyPolicyFull = () => {
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
                                        ℹ️ <strong>Last Updated:</strong> {currentDate} | 
                                        <strong> Effective Date:</strong> {currentDate}
                                    </div>
                                    <div className="d-flex gap-2">
                                        <Button variant="outline-primary" size="sm" onClick={handleCookieSettings}>
                                            ⚙️ Cookie Settings
                                        </Button>
                                        <Button variant="outline-success" size="sm" onClick={handleDataRequest}>
                                            💾 Request My Data
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
                        <Card>
                            <Card.Body>
                                <h5 className="text-center mb-3">Quick Navigation</h5>
                                <Nav variant="pills" className="justify-content-center flex-wrap">
                                    <Nav.Item>
                                        <Nav.Link href="#information-collection">📋 Information Collection</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link href="#data-usage">🔄 Data Usage</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link href="#data-sharing">🤝 Data Sharing</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link href="#security">🔒 Security</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link href="#rights">👤 Your Rights</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link href="#contact">📞 Contact</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Main Content */}
                <Row>
                    <Col lg={8}>
                        <Tab.Container defaultActiveKey="overview">
                            <Card className="mb-4">
                                <Card.Header>
                                    <Nav variant="tabs">
                                        <Nav.Item>
                                            <Nav.Link eventKey="overview">📖 Overview</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="detailed">📝 Detailed Policy</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="healthcare">🏥 Healthcare Specific</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="ai-policy">🤖 AI & ML Policy</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </Card.Header>
                                <Card.Body>
                                    <Tab.Content>
                                        <Tab.Pane eventKey="overview">
                                            <div id="information-collection">
                                                <h3 className="text-primary mb-3">1. Information We Collect</h3>
                                                <p className="mb-3">We collect information you provide directly to us, such as when you create an account, make an appointment, or contact us for support.</p>
                                                
                                                <Row>
                                                    <Col md={6}>
                                                        <Card className="border-primary mb-3">
                                                            <Card.Header className="bg-primary text-white">
                                                                <h5 className="mb-0">👤 Personal Information</h5>
                                                            </Card.Header>
                                                            <Card.Body>
                                                                <ul className="list-unstyled">
                                                                    <li>✓ Name, email address, phone number</li>
                                                                    <li>✓ Date of birth, gender, address</li>
                                                                    <li>✓ Insurance information</li>
                                                                    <li>✓ Emergency contact details</li>
                                                                    <li>✓ Payment information (securely processed)</li>
                                                                </ul>
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Card className="border-success mb-3">
                                                            <Card.Header className="bg-success text-white">
                                                                <h5 className="mb-0">🏥 Health Information</h5>
                                                            </Card.Header>
                                                            <Card.Body>
                                                                <ul className="list-unstyled">
                                                                    <li>✓ Medical history and current conditions</li>
                                                                    <li>✓ Medications and allergies</li>
                                                                    <li>✓ Test results and diagnostic information</li>
                                                                    <li>✓ Treatment plans and progress notes</li>
                                                                    <li>✓ Biometric data (when applicable)</li>
                                                                </ul>
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </div>

                                            <div id="data-usage" className="mt-4">
                                                <h3 className="text-primary mb-3">2. How We Use Your Information</h3>
                                                <Alert variant="info">
                                                    <strong>Healthcare Purpose:</strong> All health information is used solely for legitimate healthcare purposes and in compliance with HIPAA regulations.
                                                </Alert>
                                                
                                                <Row>
                                                    <Col lg={12}>
                                                        <Card>
                                                            <Card.Body>
                                                                <h5>Primary Uses:</h5>
                                                                <ul>
                                                                    <li><strong>Healthcare Delivery:</strong> Provide, maintain, and improve our medical services</li>
                                                                    <li><strong>Appointment Management:</strong> Schedule and manage your healthcare appointments</li>
                                                                    <li><strong>Medical Communication:</strong> Communicate with you about your health and our services</li>
                                                                    <li><strong>Treatment Coordination:</strong> Coordinate care between different healthcare providers</li>
                                                                    <li><strong>Quality Improvement:</strong> Analyze and improve the quality of our services</li>
                                                                    <li><strong>Legal Compliance:</strong> Comply with legal obligations and regulatory requirements</li>
                                                                    <li><strong>Security:</strong> Ensure the security and integrity of our systems</li>
                                                                </ul>
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Tab.Pane>

                                        <Tab.Pane eventKey="detailed">
                                            <div id="data-sharing">
                                                <h3 className="text-primary mb-3">3. Information Sharing and Disclosure</h3>
                                                
                                                <Alert variant="warning">
                                                    <strong>⚠️ Important:</strong> We do not sell, rent, or trade your personal or health information to third parties for marketing purposes.
                                                </Alert>

                                                <h5>We may share your information in the following circumstances:</h5>
                                                
                                                <Table striped bordered hover responsive>
                                                    <thead className="table-primary">
                                                        <tr>
                                                            <th>Sharing Category</th>
                                                            <th>Purpose</th>
                                                            <th>Legal Basis</th>
                                                            <th>Your Control</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td><strong>Healthcare Providers</strong></td>
                                                            <td>Coordinated care, referrals, consultations</td>
                                                            <td>Treatment (HIPAA)</td>
                                                            <td>✓ You can request restrictions</td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Insurance Companies</strong></td>
                                                            <td>Claims processing, coverage verification</td>
                                                            <td>Payment (HIPAA)</td>
                                                            <td>✓ Required for coverage</td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Lab Partners</strong></td>
                                                            <td>Test processing, results delivery</td>
                                                            <td>Treatment (HIPAA)</td>
                                                            <td>⚠️ Limited control</td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Legal Compliance</strong></td>
                                                            <td>Court orders, public health requirements</td>
                                                            <td>Legal obligation</td>
                                                            <td>❌ Required by law</td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Emergency Situations</strong></td>
                                                            <td>Life-threatening emergencies</td>
                                                            <td>Vital interests</td>
                                                            <td>❌ Emergency override</td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </div>

                                            <div id="security" className="mt-4">
                                                <h3 className="text-primary mb-3">4. Data Security Measures</h3>
                                                
                                                <Row>
                                                    <Col md={6}>
                                                        <Card className="border-success h-100">
                                                            <Card.Header className="bg-success text-white">
                                                                <h5 className="mb-0">🔒 Technical Safeguards</h5>
                                                            </Card.Header>
                                                            <Card.Body>
                                                                <ul className="list-unstyled">
                                                                    <li>✓ End-to-end encryption (AES-256)</li>
                                                                    <li>✓ Secure data transmission (TLS 1.3)</li>
                                                                    <li>✓ Multi-factor authentication</li>
                                                                    <li>✓ Regular security audits</li>
                                                                    <li>✓ Intrusion detection systems</li>
                                                                    <li>✓ Automated backup systems</li>
                                                                </ul>
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Card className="border-info h-100">
                                                            <Card.Header className="bg-info text-white">
                                                                <h5 className="mb-0">👥 Administrative Safeguards</h5>
                                                            </Card.Header>
                                                            <Card.Body>
                                                                <ul className="list-unstyled">
                                                                    <li>✓ Staff training programs</li>
                                                                    <li>✓ Access control policies</li>
                                                                    <li>✓ Regular compliance reviews</li>
                                                                    <li>✓ Incident response procedures</li>
                                                                    <li>✓ Business associate agreements</li>
                                                                    <li>✓ Data retention policies</li>
                                                                </ul>
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Tab.Pane>

                                        <Tab.Pane eventKey="healthcare">
                                            <h3 className="text-primary mb-3">Healthcare-Specific Privacy Protections</h3>
                                            
                                            <Alert variant="success">
                                                <h5>🏥 HIPAA Compliance Statement</h5>
                                                <p className="mb-0">This healthcare platform is fully compliant with the Health Insurance Portability and Accountability Act (HIPAA) and maintains all required safeguards for protected health information (PHI).</p>
                                            </Alert>

                                            <Row className="mt-4">
                                                <Col lg={12}>
                                                    <Card>
                                                        <Card.Header>
                                                            <h5>🔐 Healthcare Data Protection Standards</h5>
                                                        </Card.Header>
                                                        <Card.Body>
                                                            <Row>
                                                                <Col md={6}>
                                                                    <h6>Medical Record Security:</h6>
                                                                    <ul>
                                                                        <li>Encrypted storage of all medical records</li>
                                                                        <li>Role-based access controls</li>
                                                                        <li>Audit logs for all data access</li>
                                                                        <li>Automatic session timeouts</li>
                                                                    </ul>
                                                                </Col>
                                                                <Col md={6}>
                                                                    <h6>Patient Rights Under HIPAA:</h6>
                                                                    <ul>
                                                                        <li>Right to access your medical records</li>
                                                                        <li>Right to request corrections</li>
                                                                        <li>Right to request restrictions</li>
                                                                        <li>Right to file complaints</li>
                                                                    </ul>
                                                                </Col>
                                                            </Row>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </Tab.Pane>

                                        <Tab.Pane eventKey="ai-policy">
                                            <h3 className="text-primary mb-3">🤖 Artificial Intelligence & Machine Learning Policy</h3>
                                            
                                            <Alert variant="primary">
                                                <h5>AI-Powered Healthcare Features</h5>
                                                <p className="mb-0">Our platform uses AI and machine learning to enhance healthcare delivery while maintaining strict privacy and ethical standards.</p>
                                            </Alert>

                                            <Row className="mt-4">
                                                <Col lg={12}>
                                                    <Card>
                                                        <Card.Header>
                                                            <h5>🧠 AI Data Usage and Protection</h5>
                                                        </Card.Header>
                                                        <Card.Body>
                                                            <h6>How AI Uses Your Data:</h6>
                                                            <ul>
                                                                <li><strong>Diagnostic Assistance:</strong> AI models analyze medical images and data to assist healthcare providers</li>
                                                                <li><strong>Treatment Recommendations:</strong> ML algorithms suggest personalized treatment options</li>
                                                                <li><strong>Risk Assessment:</strong> Predictive models identify potential health risks</li>
                                                                <li><strong>Drug Interactions:</strong> AI checks for medication conflicts and allergies</li>
                                                            </ul>

                                                            <h6>AI Privacy Protections:</h6>
                                                            <ul>
                                                                <li>✓ Data is de-identified before AI processing when possible</li>
                                                                <li>✓ AI models are trained with privacy-preserving techniques</li>
                                                                <li>✓ No patient data is used to train external AI models</li>
                                                                <li>✓ AI decisions are always reviewed by healthcare professionals</li>
                                                                <li>✓ You can opt-out of AI-assisted features</li>
                                                            </ul>

                                                            <Alert variant="info">
                                                                <strong>Transparency:</strong> When AI is used in your care, you will be informed and the reasoning behind AI recommendations will be explained by your healthcare provider.
                                                            </Alert>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Card.Body>
                            </Card>
                        </Tab.Container>
                    </Col>

                    {/* Sidebar */}
                    <Col lg={4}>
                        <div className="sticky-top" style={{top: '20px'}}>
                            <Card className="mb-4">
                                <Card.Header className="bg-primary text-white">
                                    <h5 className="mb-0">📞 Privacy Contact</h5>
                                </Card.Header>
                                <Card.Body>
                                    <p><strong>Privacy Officer:</strong></p>
                                    <ul className="list-unstyled">
                                        <li>📧 privacy@healthcare-platform.com</li>
                                        <li>📞 1-800-PRIVACY (1-800-774-8229)</li>
                                        <li>📍 123 Healthcare Avenue<br />Medical Center, MC 12345</li>
                                    </ul>
                                    <hr />
                                    <p><strong>Response Time:</strong> We respond to privacy inquiries within 48 hours during business days.</p>
                                </Card.Body>
                            </Card>

                            <Card className="mb-4">
                                <Card.Header className="bg-success text-white">
                                    <h5 className="mb-0">👤 Your Rights</h5>
                                </Card.Header>
                                <Card.Body>
                                    <p>Under GDPR, HIPAA, and applicable laws, you have the right to:</p>
                                    <ul className="small">
                                        <li>Access your personal data</li>
                                        <li>Correct inaccurate information</li>
                                        <li>Request data deletion (where applicable)</li>
                                        <li>Restrict data processing</li>
                                        <li>Data portability</li>
                                        <li>Object to processing</li>
                                        <li>Withdraw consent</li>
                                    </ul>
                                    <Button variant="outline-success" size="sm" className="w-100" onClick={handleDataRequest}>
                                        💾 Exercise Your Rights
                                    </Button>
                                </Card.Body>
                            </Card>

                            <Card>
                                <Card.Header className="bg-warning text-dark">
                                    <h5 className="mb-0">🔔 Privacy Updates</h5>
                                </Card.Header>
                                <Card.Body>
                                    <p className="small">We may update this privacy policy from time to time. When we do, we will:</p>
                                    <ul className="small">
                                        <li>Post the updated policy on our website</li>
                                        <li>Send email notifications for significant changes</li>
                                        <li>Provide 30 days notice for material changes</li>
                                        <li>Maintain previous versions for reference</li>
                                    </ul>
                                    <Badge bg="info" className="w-100">Last Updated: {currentDate}</Badge>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Cookie Settings Modal */}
            <Modal show={showCookieModal} onHide={() => setShowCookieModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>🍪 Cookie Preferences</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Manage your cookie preferences for our healthcare platform:</p>
                    
                    <div className="mb-3">
                        <h6>Essential Cookies</h6>
                        <p className="small text-muted">Required for basic site functionality and security. Cannot be disabled.</p>
                        <Badge bg="success">Always Active</Badge>
                    </div>
                    
                    <div className="mb-3">
                        <h6>Analytics Cookies</h6>
                        <p className="small text-muted">Help us understand how you use our platform to improve services.</p>
                        <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" id="analytics" defaultChecked />
                            <label className="form-check-label" htmlFor="analytics">Allow Analytics</label>
                        </div>
                    </div>
                    
                    <div className="mb-3">
                        <h6>Marketing Cookies</h6>
                        <p className="small text-muted">Used to show relevant health information and educational content.</p>
                        <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" id="marketing" />
                            <label className="form-check-label" htmlFor="marketing">Allow Marketing</label>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCookieModal(false)}>
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
                    <Modal.Title>💾 Data Request Form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Request access to your personal data or exercise your privacy rights:</p>
                    
                    <form>
                        <div className="mb-3">
                            <label className="form-label">Request Type</label>
                            <select className="form-select">
                                <option>Access my personal data</option>
                                <option>Correct my information</option>
                                <option>Delete my data (where applicable)</option>
                                <option>Restrict data processing</option>
                                <option>Data portability request</option>
                                <option>Object to processing</option>
                                <option>Withdraw consent</option>
                            </select>
                        </div>
                        
                        <div className="mb-3">
                            <label className="form-label">Email Address</label>
                            <input type="email" className="form-control" placeholder="your.email@example.com" />
                        </div>
                        
                        <div className="mb-3">
                            <label className="form-label">Additional Details</label>
                            <textarea className="form-control" rows="3" placeholder="Please provide any additional information about your request..."></textarea>
                        </div>
                        
                        <Alert variant="info">
                            <small>We will verify your identity before processing your request and respond within 30 days as required by applicable privacy laws.</small>
                        </Alert>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDataRequestModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={() => setShowDataRequestModal(false)}>
                        Submit Request
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default PrivacyPolicyFull;
