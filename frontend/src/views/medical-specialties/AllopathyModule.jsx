import React, { useState } from "react";
import { Col, Row, Container, Card, Badge, Button, Alert, Nav } from "react-bootstrap";
import ProtectedRoute from "../../components/common/ProtectedRoute";
import AllopathyDashboard from "./AllopathyDashboard";
import AllopathyDiagnosisAI from "./AllopathyDiagnosisAI";
import AllopathyDrugChecker from "./AllopathyDrugChecker";
import AllopathyClinicalNotes from "./AllopathyClinicalNotes";
// Import the new S3 Data Management System
import AllopathyS3Dashboard from "../../components/allopathy/AllopathyDashboardSimple";

const AllopathyModule = () => {
    const [activeTab, setActiveTab] = useState("dashboard");

    const navigationTabs = [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: "ri-dashboard-line",
            component: AllopathyDashboard,
            description: "Practice overview and AI insights"
        },
        {
            id: "data-management",
            label: "Data Management",
            icon: "ri-database-2-line",
            component: AllopathyS3Dashboard,
            description: "S3 storage and AI-powered analytics"
        },
        {
            id: "diagnosis",
            label: "AI Diagnosis",
            icon: "ri-brain-line",
            component: AllopathyDiagnosisAI,
            description: "Evidence-based diagnostic assistance"
        },
        {
            id: "drugs",
            label: "Drug Checker",
            icon: "ri-medicine-bottle-line",
            component: AllopathyDrugChecker,
            description: "Interaction analysis and safety"
        },
        {
            id: "notes",
            label: "Clinical Notes",
            icon: "ri-file-text-line",
            component: AllopathyClinicalNotes,
            description: "AI-powered documentation"
        },
        {
            id: "protocols",
            label: "Treatment Protocols",
            icon: "ri-list-check-2",
            component: () => <ComingSoonComponent feature="Treatment Protocols" />,
            description: "Evidence-based care pathways"
        },
        {
            id: "imaging",
            label: "Medical Imaging AI",
            icon: "ri-image-line",
            component: () => <ComingSoonComponent feature="Medical Imaging AI" />,
            description: "AI-assisted radiology analysis"
        }
    ];

    const ActiveComponent = navigationTabs.find(tab => tab.id === activeTab)?.component || AllopathyDashboard;

    return (
        <Container fluid>
            {/* Header */}
            <Row className="mb-4">
                <Col lg={12}>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h1 className="text-primary mb-2">
                                <i className="ri-stethoscope-line me-2"></i>
                                Allopathic Medicine
                            </h1>
                            <p className="text-muted mb-0">Evidence-based conventional medicine with advanced AI integration</p>
                        </div>
                        <div className="d-flex gap-2">
                            <Badge bg="success" className="px-3 py-2">
                                <i className="ri-shield-check-line me-1"></i>
                                FDA Compliant
                            </Badge>
                            <Badge bg="info" className="px-3 py-2">
                                <i className="ri-robot-line me-1"></i>
                                AI Enhanced
                            </Badge>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* About Allopathy */}
            <Row className="mb-4">
                <Col lg={12}>
                    <Alert variant="primary" className="border-0 shadow-sm">
                        <div className="d-flex align-items-start">
                            <i className="ri-information-line fs-3 me-3 text-primary"></i>
                            <div>
                                <h5 className="alert-heading mb-2">About Allopathic Medicine</h5>
                                <p className="mb-2">
                                    Allopathy, also known as conventional or Western medicine, is the mainstream medical system that uses 
                                    evidence-based treatments, pharmaceutical drugs, surgery, and advanced diagnostic technology to treat diseases 
                                    and maintain health.
                                </p>
                                <Row>
                                    <Col md={6}>
                                        <h6 className="text-primary">Core Principles:</h6>
                                        <ul className="mb-0">
                                            <li>Evidence-based practice</li>
                                            <li>Scientific methodology</li>
                                            <li>Pharmaceutical interventions</li>
                                            <li>Surgical treatments</li>
                                        </ul>
                                    </Col>
                                    <Col md={6}>
                                        <h6 className="text-primary">AI Integration:</h6>
                                        <ul className="mb-0">
                                            <li>Clinical decision support</li>
                                            <li>Drug interaction analysis</li>
                                            <li>Diagnostic assistance</li>
                                            <li>S3 data management & analytics</li>
                                        </ul>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Alert>
                </Col>
            </Row>

            {/* Navigation */}
            <Row className="mb-4">
                <Col lg={12}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="py-3">
                            <Nav variant="pills" className="nav-fill">
                                {navigationTabs.map((tab) => (
                                    <Nav.Item key={tab.id}>
                                        <Nav.Link
                                            active={activeTab === tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className="d-flex flex-column align-items-center text-center"
                                        >
                                            <i className={`${tab.icon} fs-4 mb-1`}></i>
                                            <span className="fw-medium">{tab.label}</span>
                                            <small className="text-muted">{tab.description}</small>
                                        </Nav.Link>
                                    </Nav.Item>
                                ))}
                            </Nav>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Active Component */}
            <Row>
                <Col lg={12}>
                    <ActiveComponent />
                </Col>
            </Row>
        </Container>
    );
};

// Coming Soon Component for future features
const ComingSoonComponent = ({ feature }) => (
    <Container fluid>
        <Row className="justify-content-center">
            <Col lg={8}>
                <Card className="border-0 shadow-sm text-center py-5">
                    <Card.Body>
                        <i className="ri-tools-line fs-1 text-muted mb-3 d-block"></i>
                        <h3 className="text-primary mb-3">{feature}</h3>
                        <p className="text-muted mb-4">
                            This advanced AI-powered feature is currently under development. 
                            It will provide cutting-edge capabilities for modern allopathic practice.
                        </p>
                        <div className="d-flex justify-content-center gap-3 mb-4">
                            <Badge bg="outline-primary" className="px-3 py-2">Coming Soon</Badge>
                            <Badge bg="outline-success" className="px-3 py-2">AI-Powered</Badge>
                            <Badge bg="outline-info" className="px-3 py-2">Evidence-Based</Badge>
                        </div>
                        <Button variant="primary" disabled>
                            <i className="ri-notification-line me-2"></i>
                            Notify When Available
                        </Button>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </Container>
);

// Wrap the component with protection
const ProtectedAllopathyModule = () => {
    return (
        <ProtectedRoute 
            permission="canAccessAllopathyModule" 
            moduleName="Allopathy Module"
        >
            <AllopathyModule />
        </ProtectedRoute>
    );
};

export default ProtectedAllopathyModule;
