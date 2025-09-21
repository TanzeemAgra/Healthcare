import React from "react";
import { Accordion, Col, Row, Container, Alert, Badge } from 'react-bootstrap';

const TermsOfService = () => {
    const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    return (
        <>
            <Container fluid>
                <Row className="mb-4">
                    <Col lg={12}>
                        <div className="text-center mb-4">
                            <h1 className="display-5 fw-bold text-primary">Terms of Service</h1>
                            <p className="lead text-muted">Healthcare Platform Terms and Conditions</p>
                            <div className="d-flex justify-content-center gap-2 mb-3">
                                <Badge bg="success">GDPR Compliant</Badge>
                                <Badge bg="info">HIPAA Compliant</Badge>
                                <Badge bg="warning">ISO 27001</Badge>
                            </div>
                            <Alert variant="info" className="text-start">
                                <i className="ri-information-line me-2"></i>
                                <strong>Last Updated:</strong> {currentDate} | 
                                <strong> Effective Date:</strong> {currentDate}
                            </Alert>
                        </div>
                    </Col>
                </Row>
                
                <Row>
                    <Col lg={12}>
                        <Accordion defaultActiveKey="0" className="custom-accordion iq-accordion-card">
                            
                            {/* 1. Acceptance of Terms */}
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>
                                    <i className="ri-checkbox-circle-line me-2 text-success"></i>
                                    1. Acceptance of Terms
                                </Accordion.Header>
                                <Accordion.Body>
                                    <p>By accessing and using our healthcare platform ("Service"), you accept and agree to be bound by the terms and provision of this agreement.</p>
                                    
                                    <h6 className="text-primary mt-3">Key Points:</h6>
                                    <ul>
                                        <li>These terms constitute a legally binding agreement between you and our healthcare platform</li>
                                        <li>By using our services, you confirm you are at least 18 years old or have parental consent</li>
                                        <li>You acknowledge that you have read, understood, and agree to comply with these terms</li>
                                        <li>Continued use of the platform indicates ongoing acceptance of any updates to these terms</li>
                                    </ul>

                                    <Alert variant="warning" className="mt-3">
                                        <strong>Important:</strong> If you do not agree to these terms, please discontinue use of our platform immediately.
                                    </Alert>
                                </Accordion.Body>
                            </Accordion.Item>

                            {/* 2. HIPAA Compliance & Protected Health Information */}
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>
                                    <i className="ri-shield-check-line me-2 text-primary"></i>
                                    2. HIPAA Compliance & Protected Health Information (PHI)
                                </Accordion.Header>
                                <Accordion.Body>
                                    <h6 className="text-primary">HIPAA Compliance Statement</h6>
                                    <p>Our platform is designed to comply with the Health Insurance Portability and Accountability Act (HIPAA) of 1996 and its implementing regulations.</p>

                                    <h6 className="text-primary mt-3">Protected Health Information (PHI)</h6>
                                    <ul>
                                        <li><strong>Definition:</strong> PHI includes any health information that can identify an individual, including medical records, payment history, and demographic data</li>
                                        <li><strong>Usage:</strong> We only use PHI for treatment, payment, and healthcare operations as permitted under HIPAA</li>
                                        <li><strong>Access Controls:</strong> Strict access controls ensure only authorized personnel can access PHI</li>
                                        <li><strong>Audit Trails:</strong> All access to PHI is logged and monitored for compliance</li>
                                    </ul>

                                    <h6 className="text-primary mt-3">Patient Rights Under HIPAA</h6>
                                    <ul>
                                        <li>Right to access your health information</li>
                                        <li>Right to request amendments to your health records</li>
                                        <li>Right to request restrictions on use and disclosure</li>
                                        <li>Right to file a complaint with the U.S. Department of Health and Human Services</li>
                                    </ul>

                                    <Alert variant="info" className="mt-3">
                                        <strong>Business Associate Agreement:</strong> Any third-party vendors who may access PHI have signed Business Associate Agreements ensuring HIPAA compliance.
                                    </Alert>
                                </Accordion.Body>
                            </Accordion.Item>

                            {/* 3. GDPR Compliance & Data Protection */}
                            <Accordion.Item eventKey="2">
                                <Accordion.Header>
                                    <i className="ri-global-line me-2 text-success"></i>
                                    3. GDPR Compliance & Data Protection
                                </Accordion.Header>
                                <Accordion.Body>
                                    <h6 className="text-primary">General Data Protection Regulation (GDPR) Compliance</h6>
                                    <p>For users in the European Economic Area (EEA), we comply with the General Data Protection Regulation (GDPR).</p>

                                    <h6 className="text-primary mt-3">Legal Basis for Processing</h6>
                                    <ul>
                                        <li><strong>Consent:</strong> You have given clear consent for processing your personal data</li>
                                        <li><strong>Vital Interests:</strong> Processing is necessary to protect life or physical safety</li>
                                        <li><strong>Legitimate Interests:</strong> Processing is necessary for healthcare provision</li>
                                        <li><strong>Legal Obligation:</strong> Processing is required by applicable laws</li>
                                    </ul>

                                    <h6 className="text-primary mt-3">Your Rights Under GDPR</h6>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <ul>
                                                <li><strong>Right of Access:</strong> Request copies of your personal data</li>
                                                <li><strong>Right to Rectification:</strong> Correct inaccurate personal data</li>
                                                <li><strong>Right to Erasure:</strong> Request deletion of your data</li>
                                                <li><strong>Right to Restrict Processing:</strong> Limit how we use your data</li>
                                            </ul>
                                        </div>
                                        <div className="col-md-6">
                                            <ul>
                                                <li><strong>Right to Data Portability:</strong> Transfer your data to another service</li>
                                                <li><strong>Right to Object:</strong> Object to data processing</li>
                                                <li><strong>Rights Related to Automated Decision Making:</strong> Protection from automated decisions</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <Alert variant="success" className="mt-3">
                                        <strong>Data Protection Officer:</strong> Contact our DPO at <code>dpo@xerxez.in</code> for any GDPR-related inquiries.
                                    </Alert>
                                </Accordion.Body>
                            </Accordion.Item>

                            {/* 4. Data Collection and Use */}
                            <Accordion.Item eventKey="3">
                                <Accordion.Header>
                                    <i className="ri-database-2-line me-2 text-info"></i>
                                    4. Data Collection and Use
                                </Accordion.Header>
                                <Accordion.Body>
                                    <h6 className="text-primary">Types of Data We Collect</h6>
                                    
                                    <div className="row mt-3">
                                        <div className="col-md-6">
                                            <h6 className="text-secondary">Personal Information</h6>
                                            <ul>
                                                <li>Name, date of birth, contact information</li>
                                                <li>Government-issued identification numbers</li>
                                                <li>Emergency contact information</li>
                                                <li>Insurance information</li>
                                            </ul>
                                        </div>
                                        <div className="col-md-6">
                                            <h6 className="text-secondary">Health Information</h6>
                                            <ul>
                                                <li>Medical history and conditions</li>
                                                <li>Prescription and treatment information</li>
                                                <li>Laboratory and diagnostic results</li>
                                                <li>Provider notes and assessments</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <h6 className="text-primary mt-4">How We Use Your Data</h6>
                                    <ul>
                                        <li><strong>Treatment:</strong> Providing medical care and health services</li>
                                        <li><strong>Payment:</strong> Processing insurance claims and billing</li>
                                        <li><strong>Healthcare Operations:</strong> Quality improvement and care coordination</li>
                                        <li><strong>AI Analysis:</strong> Improving diagnostic accuracy and treatment recommendations (with explicit consent)</li>
                                        <li><strong>Research:</strong> Medical research (only with explicit consent and de-identification)</li>
                                    </ul>

                                    <Alert variant="warning" className="mt-3">
                                        <strong>Consent Management:</strong> You can withdraw consent for optional data processing at any time through your account settings.
                                    </Alert>
                                </Accordion.Body>
                            </Accordion.Item>

                            {/* 5. Data Security and Encryption */}
                            <Accordion.Item eventKey="4">
                                <Accordion.Header>
                                    <i className="ri-lock-2-line me-2 text-danger"></i>
                                    5. Data Security and Encryption
                                </Accordion.Header>
                                <Accordion.Body>
                                    <h6 className="text-primary">Security Measures</h6>
                                    <p>We implement industry-leading security measures to protect your health information:</p>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <h6 className="text-secondary">Technical Safeguards</h6>
                                            <ul>
                                                <li>AES-256 encryption for data at rest</li>
                                                <li>TLS 1.3 encryption for data in transit</li>
                                                <li>Multi-factor authentication (MFA)</li>
                                                <li>Role-based access controls</li>
                                                <li>Regular security assessments</li>
                                            </ul>
                                        </div>
                                        <div className="col-md-6">
                                            <h6 className="text-secondary">Physical Safeguards</h6>
                                            <ul>
                                                <li>SOC 2 Type II certified data centers</li>
                                                <li>24/7 physical security monitoring</li>
                                                <li>Biometric access controls</li>
                                                <li>Environmental controls and backup power</li>
                                                <li>Secure disposal of physical media</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <h6 className="text-primary mt-3">Administrative Safeguards</h6>
                                    <ul>
                                        <li>Comprehensive employee training on HIPAA and GDPR</li>
                                        <li>Background checks for all personnel</li>
                                        <li>Incident response procedures</li>
                                        <li>Regular compliance audits</li>
                                        <li>Business continuity and disaster recovery plans</li>
                                    </ul>

                                    <Alert variant="info" className="mt-3">
                                        <strong>Breach Notification:</strong> In the unlikely event of a data breach, we will notify affected individuals and regulatory authorities within 72 hours as required by law.
                                    </Alert>
                                </Accordion.Body>
                            </Accordion.Item>

                            {/* 6. User Responsibilities */}
                            <Accordion.Item eventKey="5">
                                <Accordion.Header>
                                    <i className="ri-user-settings-line me-2 text-warning"></i>
                                    6. User Responsibilities
                                </Accordion.Header>
                                <Accordion.Body>
                                    <h6 className="text-primary">Account Security</h6>
                                    <ul>
                                        <li>Maintain the confidentiality of your login credentials</li>
                                        <li>Use strong, unique passwords</li>
                                        <li>Enable two-factor authentication when available</li>
                                        <li>Log out from shared or public devices</li>
                                        <li>Report suspected unauthorized access immediately</li>
                                    </ul>

                                    <h6 className="text-primary mt-3">Accurate Information</h6>
                                    <ul>
                                        <li>Provide accurate and complete health information</li>
                                        <li>Update your information when it changes</li>
                                        <li>Report any errors in your health records</li>
                                        <li>Inform us of changes to your contact information</li>
                                    </ul>

                                    <h6 className="text-primary mt-3">Appropriate Use</h6>
                                    <ul>
                                        <li>Use the platform only for legitimate healthcare purposes</li>
                                        <li>Do not share your account with others</li>
                                        <li>Comply with all applicable laws and regulations</li>
                                        <li>Respect the privacy of other users</li>
                                    </ul>

                                    <Alert variant="danger" className="mt-3">
                                        <strong>Emergency Notice:</strong> This platform is not intended for emergency medical situations. In case of a medical emergency, call your local emergency services immediately.
                                    </Alert>
                                </Accordion.Body>
                            </Accordion.Item>

                            {/* 7. Third-Party Services */}
                            <Accordion.Item eventKey="6">
                                <Accordion.Header>
                                    <i className="ri-links-line me-2 text-secondary"></i>
                                    7. Third-Party Services and Integrations
                                </Accordion.Header>
                                <Accordion.Body>
                                    <h6 className="text-primary">Business Associates</h6>
                                    <p>We may work with third-party service providers who have access to your health information. All such providers:</p>
                                    <ul>
                                        <li>Sign Business Associate Agreements (BAAs) ensuring HIPAA compliance</li>
                                        <li>Undergo security assessments before integration</li>
                                        <li>Are contractually obligated to protect your information</li>
                                        <li>Are subject to regular compliance audits</li>
                                    </ul>

                                    <h6 className="text-primary mt-3">Data Processing Agreements</h6>
                                    <p>For GDPR compliance, we maintain Data Processing Agreements (DPAs) with all third parties that process personal data on our behalf.</p>

                                    <h6 className="text-primary mt-3">Third-Party Categories</h6>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <ul>
                                                <li>Cloud infrastructure providers</li>
                                                <li>Payment processing services</li>
                                                <li>Identity verification services</li>
                                            </ul>
                                        </div>
                                        <div className="col-md-6">
                                            <ul>
                                                <li>AI and analytics platforms</li>
                                                <li>Communication services</li>
                                                <li>Backup and disaster recovery services</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <Alert variant="info" className="mt-3">
                                        <strong>International Transfers:</strong> When data is transferred outside your country, we ensure adequate protection through Standard Contractual Clauses or adequacy decisions.
                                    </Alert>
                                </Accordion.Body>
                            </Accordion.Item>

                            {/* 8. Data Retention */}
                            <Accordion.Item eventKey="7">
                                <Accordion.Header>
                                    <i className="ri-time-line me-2 text-info"></i>
                                    8. Data Retention and Deletion
                                </Accordion.Header>
                                <Accordion.Body>
                                    <h6 className="text-primary">Retention Periods</h6>
                                    <p>We retain your information for different periods based on the type of data and legal requirements:</p>
                                    
                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Data Type</th>
                                                    <th>Retention Period</th>
                                                    <th>Legal Basis</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Medical Records</td>
                                                    <td>Minimum 6 years after last treatment</td>
                                                    <td>Legal obligation</td>
                                                </tr>
                                                <tr>
                                                    <td>Payment Information</td>
                                                    <td>7 years for tax purposes</td>
                                                    <td>Legal obligation</td>
                                                </tr>
                                                <tr>
                                                    <td>Account Information</td>
                                                    <td>Until account deletion requested</td>
                                                    <td>Legitimate interest</td>
                                                </tr>
                                                <tr>
                                                    <td>Audit Logs</td>
                                                    <td>7 years for compliance</td>
                                                    <td>Legal obligation</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <h6 className="text-primary mt-3">Secure Deletion</h6>
                                    <ul>
                                        <li>Data is securely deleted using industry-standard methods</li>
                                        <li>Multi-pass overwriting for physical storage devices</li>
                                        <li>Cryptographic erasure for encrypted data</li>
                                        <li>Certificate of destruction for physical media</li>
                                    </ul>

                                    <Alert variant="warning" className="mt-3">
                                        <strong>Legal Holds:</strong> Data subject to legal proceedings or regulatory investigations may be retained beyond normal retention periods as required by law.
                                    </Alert>
                                </Accordion.Body>
                            </Accordion.Item>

                            {/* 9. Your Rights and Choices */}
                            <Accordion.Item eventKey="8">
                                <Accordion.Header>
                                    <i className="ri-hand-heart-line me-2 text-success"></i>
                                    9. Your Rights and Choices
                                </Accordion.Header>
                                <Accordion.Body>
                                    <h6 className="text-primary">How to Exercise Your Rights</h6>
                                    <p>You can exercise your privacy rights through the following methods:</p>
                                    
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h6 className="text-secondary">Online Portal</h6>
                                            <ul>
                                                <li>Log into your account settings</li>
                                                <li>Use the "Privacy Controls" section</li>
                                                <li>Submit requests through secure messaging</li>
                                            </ul>
                                        </div>
                                        <div className="col-md-6">
                                            <h6 className="text-secondary">Contact Methods</h6>
                                            <ul>
                                                <li>Email: privacy@xerxez.in</li>
                                                <li>Phone: 1-800-PRIVACY (toll-free)</li>
                                                <li>Mail: Privacy Officer, [Address]</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <h6 className="text-primary mt-3">Response Timeframes</h6>
                                    <ul>
                                        <li><strong>HIPAA Requests:</strong> 30 days (with 30-day extension if necessary)</li>
                                        <li><strong>GDPR Requests:</strong> 30 days (with 60-day extension for complex requests)</li>
                                        <li><strong>Urgent Requests:</strong> 48 hours for safety-related issues</li>
                                    </ul>

                                    <h6 className="text-primary mt-3">Verification Process</h6>
                                    <p>To protect your privacy, we will verify your identity before processing requests using:</p>
                                    <ul>
                                        <li>Account authentication</li>
                                        <li>Government-issued identification</li>
                                        <li>Security questions</li>
                                        <li>Multi-factor authentication</li>
                                    </ul>
                                </Accordion.Body>
                            </Accordion.Item>

                            {/* 10. Complaints and Enforcement */}
                            <Accordion.Item eventKey="9">
                                <Accordion.Header>
                                    <i className="ri-customer-service-2-line me-2 text-primary"></i>
                                    10. Complaints and Regulatory Enforcement
                                </Accordion.Header>
                                <Accordion.Body>
                                    <h6 className="text-primary">How to File a Complaint</h6>
                                    <p>If you believe your privacy rights have been violated, you can file a complaint with:</p>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <h6 className="text-secondary">Internal Complaint Process</h6>
                                            <ul>
                                                <li>Contact our Privacy Officer</li>
                                                <li>Submit a written complaint describing the issue</li>
                                                <li>Provide relevant dates and details</li>
                                                <li>We will investigate within 30 days</li>
                                            </ul>
                                        </div>
                                        <div className="col-md-6">
                                            <h6 className="text-secondary">External Regulatory Bodies</h6>
                                            <ul>
                                                <li><strong>HIPAA:</strong> U.S. Department of Health and Human Services</li>
                                                <li><strong>GDPR:</strong> Your local Data Protection Authority</li>
                                                <li><strong>State:</strong> Your state health department</li>
                                                <li><strong>Professional:</strong> Relevant licensing boards</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <Alert variant="success" className="mt-3">
                                        <strong>No Retaliation Policy:</strong> We will not retaliate against you for filing a complaint or exercising your privacy rights.
                                    </Alert>

                                    <h6 className="text-primary mt-3">Contact Information for Complaints</h6>
                                    <div className="bg-light p-3 rounded">
                                        <p><strong>Privacy Officer:</strong> privacy@xerxez.in</p>
                                        <p><strong>HIPAA Compliance:</strong> hipaa@xerxez.in</p>
                                        <p><strong>GDPR DPO:</strong> dpo@xerxez.in</p>
                                        <p><strong>Phone:</strong> 1-800-PRIVACY (1-800-774-8229)</p>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>

                            {/* 11. Updates to Terms */}
                            <Accordion.Item eventKey="10">
                                <Accordion.Header>
                                    <i className="ri-refresh-line me-2 text-warning"></i>
                                    11. Updates to These Terms
                                </Accordion.Header>
                                <Accordion.Body>
                                    <h6 className="text-primary">How We Update These Terms</h6>
                                    <p>We may update these terms periodically to reflect:</p>
                                    <ul>
                                        <li>Changes in applicable laws and regulations</li>
                                        <li>New features or services</li>
                                        <li>Industry best practices</li>
                                        <li>Feedback from users and regulators</li>
                                    </ul>

                                    <h6 className="text-primary mt-3">Notification Process</h6>
                                    <p>When we make material changes to these terms, we will:</p>
                                    <ul>
                                        <li>Post the updated terms on our website</li>
                                        <li>Send email notifications to registered users</li>
                                        <li>Display prominent notices in your account dashboard</li>
                                        <li>Provide at least 30 days' notice before changes take effect</li>
                                    </ul>

                                    <h6 className="text-primary mt-3">Your Options</h6>
                                    <p>If you disagree with updated terms, you may:</p>
                                    <ul>
                                        <li>Contact us to discuss your concerns</li>
                                        <li>Opt out of certain non-essential services</li>
                                        <li>Request data portability to another provider</li>
                                        <li>Terminate your account (subject to legal retention requirements)</li>
                                    </ul>

                                    <Alert variant="info" className="mt-3">
                                        <strong>Version Control:</strong> We maintain a history of all terms versions with effective dates for transparency and compliance purposes.
                                    </Alert>
                                </Accordion.Body>
                            </Accordion.Item>

                            {/* 12. Contact Information */}
                            <Accordion.Item eventKey="11">
                                <Accordion.Header>
                                    <i className="ri-contacts-book-2-line me-2 text-success"></i>
                                    12. Contact Information
                                </Accordion.Header>
                                <Accordion.Body>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h6 className="text-primary">Healthcare Platform, Inc.</h6>
                                            <address>
                                                123 Healthcare Avenue<br/>
                                                Medical District<br/>
                                                City, State 12345<br/>
                                                United States
                                            </address>
                                        </div>
                                        <div className="col-md-6">
                                            <h6 className="text-primary">Contact Methods</h6>
                                            <ul className="list-unstyled">
                                                <li><i className="ri-mail-line me-2"></i><strong>General:</strong> info@xerxez.in</li>
                                                <li><i className="ri-shield-check-line me-2"></i><strong>Privacy:</strong> privacy@xerxez.in</li>
                                                <li><i className="ri-customer-service-line me-2"></i><strong>Support:</strong> support@xerxez.in</li>
                                                <li><i className="ri-phone-line me-2"></i><strong>Phone:</strong> 1-800-HEALTH-1</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <h6 className="text-primary mt-4">Specialized Contacts</h6>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="card h-100">
                                                <div className="card-body text-center">
                                                    <i className="ri-shield-user-line fs-2 text-primary"></i>
                                                    <h6 className="card-title mt-2">Privacy Officer</h6>
                                                    <p className="card-text small">HIPAA & GDPR Compliance</p>
                                                    <code>privacy@xerxez.in</code>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="card h-100">
                                                <div className="card-body text-center">
                                                    <i className="ri-global-line fs-2 text-success"></i>
                                                    <h6 className="card-title mt-2">Data Protection Officer</h6>
                                                    <p className="card-text small">GDPR Specialist</p>
                                                    <code>dpo@xerxez.in</code>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="card h-100">
                                                <div className="card-body text-center">
                                                    <i className="ri-secure-payment-line fs-2 text-info"></i>
                                                    <h6 className="card-title mt-2">Security Team</h6>
                                                    <p className="card-text small">Security Incidents</p>
                                                    <code>security@xerxez.in</code>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Alert variant="primary" className="mt-4">
                                        <h6 className="alert-heading">Business Hours</h6>
                                        <p className="mb-0">
                                            <strong>Customer Support:</strong> Monday - Friday, 8:00 AM - 8:00 PM EST<br/>
                                            <strong>Privacy Requests:</strong> Processed within 1 business day<br/>
                                            <strong>Emergency Security Issues:</strong> 24/7 response available
                                        </p>
                                    </Alert>
                                </Accordion.Body>
                            </Accordion.Item>

                        </Accordion>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default TermsOfService