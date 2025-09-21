import React, { useState, useEffect } from "react";
import { Col, Row, Container, Card, Badge, Button, Modal, Tab, Nav, Alert, Table, Form, ProgressBar } from "react-bootstrap";

const AllopathyDashboard = () => {
    const [activePatients, setActivePatients] = useState(42);
    const [pendingDiagnoses, setPendingDiagnoses] = useState(8);
    const [aiInsights, setAiInsights] = useState(15);
    const [showAiModal, setShowAiModal] = useState(false);
    const [selectedInsight, setSelectedInsight] = useState(null);

    const aiInsightsData = [
        {
            id: 1,
            type: "Drug Interaction Alert",
            patient: "John Smith",
            severity: "High",
            description: "Potential interaction between Warfarin and new antibiotic prescription",
            confidence: 94,
            action: "Review medication list"
        },
        {
            id: 2,
            type: "Diagnostic Suggestion",
            patient: "Sarah Johnson",
            severity: "Medium",
            description: "Consider cardiac workup based on symptom pattern analysis",
            confidence: 87,
            action: "Order ECG and troponins"
        },
        {
            id: 3,
            type: "Treatment Optimization",
            patient: "Mike Davis",
            severity: "Low",
            description: "AI suggests dose adjustment for better therapeutic outcome",
            confidence: 91,
            action: "Adjust dosing schedule"
        }
    ];

    const patientStats = [
        { label: "Critical Care", value: 5, color: "danger" },
        { label: "Stable", value: 28, color: "success" },
        { label: "Monitoring", value: 9, color: "warning" }
    ];

    const recentDiagnoses = [
        { condition: "Hypertension", count: 12, trend: "+15%" },
        { condition: "Type 2 Diabetes", count: 8, trend: "+8%" },
        { condition: "COPD", count: 6, trend: "-5%" },
        { condition: "CAD", count: 4, trend: "+12%" }
    ];

    return (
        <Container fluid>
            {/* Header */}
            <Row className="mb-4">
                <Col lg={12}>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="text-primary mb-2">
                                <i className="ri-stethoscope-line me-2"></i>
                                Allopathic Medicine Dashboard
                            </h2>
                            <p className="text-muted mb-0">Evidence-based medicine with AI-powered clinical decision support</p>
                        </div>
                        <div className="d-flex gap-2">
                            <Button variant="outline-primary">
                                <i className="ri-brain-line me-1"></i>AI Insights
                            </Button>
                            <Button variant="primary">
                                <i className="ri-add-line me-1"></i>New Patient
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* AI Alerts Banner */}
            <Row className="mb-4">
                <Col lg={12}>
                    <Alert variant="info" className="border-0 shadow-sm">
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <i className="ri-robot-line fs-3 me-3 text-primary"></i>
                                <div>
                                    <h6 className="mb-1">AI Clinical Assistant Active</h6>
                                    <small>Monitoring {activePatients} patients • {aiInsights} new insights available</small>
                                </div>
                            </div>
                            <Button variant="outline-primary" size="sm" onClick={() => setShowAiModal(true)}>
                                View Insights
                            </Button>
                        </div>
                    </Alert>
                </Col>
            </Row>

            {/* Key Metrics */}
            <Row className="mb-4">
                <Col xl={3} lg={6}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h6 className="text-muted mb-2">Active Patients</h6>
                                    <h3 className="text-primary mb-1">{activePatients}</h3>
                                    <small className="text-success">
                                        <i className="ri-arrow-up-line"></i> +12% this week
                                    </small>
                                </div>
                                <div className="avatar-lg bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center">
                                    <i className="ri-user-heart-line fs-2 text-primary"></i>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} lg={6}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h6 className="text-muted mb-2">Pending Diagnoses</h6>
                                    <h3 className="text-warning mb-1">{pendingDiagnoses}</h3>
                                    <small className="text-muted">
                                        <i className="ri-time-line"></i> Awaiting review
                                    </small>
                                </div>
                                <div className="avatar-lg bg-warning bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center">
                                    <i className="ri-search-line fs-2 text-warning"></i>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} lg={6}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h6 className="text-muted mb-2">AI Insights</h6>
                                    <h3 className="text-info mb-1">{aiInsights}</h3>
                                    <small className="text-info">
                                        <i className="ri-brain-line"></i> New recommendations
                                    </small>
                                </div>
                                <div className="avatar-lg bg-info bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center">
                                    <i className="ri-robot-line fs-2 text-info"></i>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} lg={6}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h6 className="text-muted mb-2">Treatment Success</h6>
                                    <h3 className="text-success mb-1">94.2%</h3>
                                    <small className="text-success">
                                        <i className="ri-arrow-up-line"></i> +2.1% improvement
                                    </small>
                                </div>
                                <div className="avatar-lg bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center">
                                    <i className="ri-heart-pulse-line fs-2 text-success"></i>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Main Content */}
            <Row>
                {/* Patient Status Distribution */}
                <Col lg={6}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-transparent border-bottom-0">
                            <h5 className="mb-0">
                                <i className="ri-pie-chart-line me-2 text-primary"></i>
                                Patient Status Distribution
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            {patientStats.map((stat, index) => (
                                <div key={index} className="mb-3">
                                    <div className="d-flex justify-content-between mb-1">
                                        <span className="fw-medium">{stat.label}</span>
                                        <span className="text-muted">{stat.value} patients</span>
                                    </div>
                                    <ProgressBar 
                                        variant={stat.color} 
                                        now={(stat.value / activePatients) * 100} 
                                        className="mb-2" 
                                        style={{ height: '8px' }}
                                    />
                                </div>
                            ))}

                            <Alert variant="light" className="mt-4">
                                <h6 className="alert-heading">
                                    <i className="ri-lightbulb-line me-1"></i>
                                    AI Recommendation
                                </h6>
                                <p className="mb-0 small">
                                    Consider scheduling follow-ups for 9 monitoring patients. 
                                    AI predicts 3 may need intervention within 48 hours.
                                </p>
                            </Alert>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Recent Diagnoses Trends */}
                <Col lg={6}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-transparent border-bottom-0">
                            <h5 className="mb-0">
                                <i className="ri-line-chart-line me-2 text-primary"></i>
                                Recent Diagnoses Trends
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            <Table hover className="mb-0">
                                <thead>
                                    <tr>
                                        <th>Condition</th>
                                        <th className="text-center">Count</th>
                                        <th className="text-center">Trend</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentDiagnoses.map((diagnosis, index) => (
                                        <tr key={index}>
                                            <td className="fw-medium">{diagnosis.condition}</td>
                                            <td className="text-center">
                                                <Badge bg="outline-primary">{diagnosis.count}</Badge>
                                            </td>
                                            <td className="text-center">
                                                <span className={`small ${diagnosis.trend.startsWith('+') ? 'text-success' : 'text-danger'}`}>
                                                    {diagnosis.trend}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            <div className="mt-3 p-3 bg-light rounded">
                                <h6 className="text-primary mb-2">
                                    <i className="ri-brain-line me-1"></i>
                                    AI Pattern Analysis
                                </h6>
                                <small className="text-muted">
                                    Seasonal increase in respiratory conditions detected. 
                                    Consider proactive screening protocols for at-risk patients.
                                </small>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Quick Actions */}
            <Row className="mt-4">
                <Col lg={12}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-transparent border-bottom-0">
                            <h5 className="mb-0">
                                <i className="ri-dashboard-line me-2 text-primary"></i>
                                Quick Actions & AI Tools
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={3}>
                                    <Button variant="outline-primary" className="w-100 mb-2" size="lg">
                                        <i className="ri-search-line d-block fs-2 mb-2"></i>
                                        AI Diagnosis Assistant
                                    </Button>
                                </Col>
                                <Col md={3}>
                                    <Button variant="outline-success" className="w-100 mb-2" size="lg">
                                        <i className="ri-medicine-bottle-line d-block fs-2 mb-2"></i>
                                        Drug Interaction Checker
                                    </Button>
                                </Col>
                                <Col md={3}>
                                    <Button variant="outline-warning" className="w-100 mb-2" size="lg">
                                        <i className="ri-file-text-line d-block fs-2 mb-2"></i>
                                        Clinical Note Generator
                                    </Button>
                                </Col>
                                <Col md={3}>
                                    <Button variant="outline-info" className="w-100 mb-2" size="lg">
                                        <i className="ri-image-line d-block fs-2 mb-2"></i>
                                        Medical Imaging AI
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* AI Insights Modal */}
            <Modal show={showAiModal} onHide={() => setShowAiModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="ri-robot-line me-2"></i>
                        AI Clinical Insights
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Tab.Container defaultActiveKey="alerts">
                        <Nav variant="pills" className="mb-3">
                            <Nav.Item>
                                <Nav.Link eventKey="alerts">Priority Alerts</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="recommendations">Recommendations</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="patterns">Pattern Analysis</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        
                        <Tab.Content>
                            <Tab.Pane eventKey="alerts">
                                {aiInsightsData.map((insight) => (
                                    <Card key={insight.id} className="mb-3 border-start border-4 border-primary">
                                        <Card.Body>
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <h6 className="mb-1">{insight.type}</h6>
                                                    <p className="text-muted mb-1">Patient: {insight.patient}</p>
                                                    <p className="mb-2">{insight.description}</p>
                                                    <small className="text-success">
                                                        <i className="ri-check-line me-1"></i>
                                                        AI Confidence: {insight.confidence}%
                                                    </small>
                                                </div>
                                                <div className="text-end">
                                                    <Badge bg={insight.severity === 'High' ? 'danger' : insight.severity === 'Medium' ? 'warning' : 'info'}>
                                                        {insight.severity}
                                                    </Badge>
                                                    <div className="mt-2">
                                                        <Button variant="outline-primary" size="sm">
                                                            {insight.action}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </Tab.Pane>
                            
                            <Tab.Pane eventKey="recommendations">
                                <Alert variant="info">
                                    <h6 className="alert-heading">Treatment Protocol Suggestions</h6>
                                    <ul className="mb-0">
                                        <li>Consider updating hypertension protocols based on latest AHA guidelines</li>
                                        <li>AI suggests implementing diabetes screening for 12 at-risk patients</li>
                                        <li>Recommend cardiovascular workup for 3 patients with concerning patterns</li>
                                    </ul>
                                </Alert>
                                
                                <Alert variant="success">
                                    <h6 className="alert-heading">Quality Improvements</h6>
                                    <ul className="mb-0">
                                        <li>94% medication adherence rate achieved through AI reminders</li>
                                        <li>Early intervention protocols reduced ER visits by 23%</li>
                                        <li>Predictive models identified 5 patients needing urgent care</li>
                                    </ul>
                                </Alert>
                            </Tab.Pane>
                            
                            <Tab.Pane eventKey="patterns">
                                <div className="text-center py-4">
                                    <i className="ri-bar-chart-line fs-1 text-muted mb-3"></i>
                                    <h6>Population Health Analytics</h6>
                                    <p className="text-muted">
                                        AI is analyzing population health trends and will provide 
                                        insights on disease patterns, treatment outcomes, and 
                                        preventive care opportunities.
                                    </p>
                                    <Button variant="primary">
                                        Generate Report
                                    </Button>
                                </div>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowAiModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary">
                        Configure AI Settings
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AllopathyDashboard;
