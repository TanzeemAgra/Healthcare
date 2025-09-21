import React, { useState } from "react";
import { Col, Row, Container, Alert, Badge, Button } from "react-bootstrap";
import Card from "../../components/Card";

const PrivacyPolicySimple = () => {
    const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    return (
        <Container fluid>
            <Row className="mb-5">
                <Col lg={12}>
                    <div className="text-center">
                        <h1 className="display-4 fw-bold text-primary mb-3">Privacy Policy</h1>
                        <p className="lead text-muted mb-4">Your privacy is our priority.</p>
                        
                        <div className="d-flex justify-content-center gap-2 mb-4 flex-wrap">
                            <Badge bg="success" className="px-3 py-2">GDPR Compliant</Badge>
                            <Badge bg="info" className="px-3 py-2">HIPAA Secure</Badge>
                            <Badge bg="warning" className="px-3 py-2">ISO 27001</Badge>
                        </div>

                        <Alert variant="primary" className="text-start">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>Last Updated:</strong> {currentDate}
                                </div>
                            </div>
                        </Alert>
                    </div>
                </Col>
            </Row>

            {/* Privacy Policy Content */}
            <Row>
                <Col lg={12}>
                    <Card>
                        <Card.Header>
                            <h2>1. Information We Collect</h2>
                        </Card.Header>
                        <Card.Body>
                            <p>We collect information you provide directly to us, such as when you create an account, make an appointment, or contact us for support.</p>
                            
                            <h4>Personal Information:</h4>
                            <ul>
                                <li>Name, email address, phone number</li>
                                <li>Date of birth, gender, address</li>
                                <li>Insurance information</li>
                                <li>Emergency contact details</li>
                            </ul>

                            <h4>Health Information:</h4>
                            <ul>
                                <li>Medical history and current conditions</li>
                                <li>Medications and allergies</li>
                                <li>Test results and diagnostic information</li>
                                <li>Treatment plans and progress notes</li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-4">
                <Col lg={12}>
                    <Card>
                        <Card.Header>
                            <h2>2. How We Use Your Information</h2>
                        </Card.Header>
                        <Card.Body>
                            <p>We use the information we collect to:</p>
                            <ul>
                                <li>Provide, maintain, and improve our services</li>
                                <li>Process appointments and manage your care</li>
                                <li>Communicate with you about your health and our services</li>
                                <li>Comply with legal obligations and regulatory requirements</li>
                                <li>Ensure the security and integrity of our systems</li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-4">
                <Col lg={12}>
                    <Card>
                        <Card.Header>
                            <h2>3. Contact Us</h2>
                        </Card.Header>
                        <Card.Body>
                            <p>If you have any questions about this Privacy Policy, please contact us:</p>
                            <ul>
                                <li><strong>Email:</strong> privacy@company.com</li>
                                <li><strong>Phone:</strong> (555) 123-4567</li>
                                <li><strong>Address:</strong> 123 Healthcare Ave, Medical City, MC 12345</li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default PrivacyPolicySimple;
