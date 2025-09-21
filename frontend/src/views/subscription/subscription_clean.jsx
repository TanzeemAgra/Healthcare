// frontend/src/views/subscription/subscription.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Button, Spinner, Alert, Tabs, Tab, Table, ProgressBar, Modal, ListGroup, Badge, Form, Card } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import apiClient from '../../services/api';
import subscriptionService from '../../services/subscriptionService';

const SubscriptionPage = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('plans');
    const [plans, setPlans] = useState([]);
    const [userSubscription, setUserSubscription] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState('professional');
    const [isAnnual, setIsAnnual] = useState(false);
    const [loading, setLoading] = useState({
        plans: false,
        subscription: false,
        upgrade: false,
        cancel: false
    });

    // Subscription plans data
    const subscriptionPlans = [
        {
            id: 'basic',
            name: 'Basic',
            description: 'Essential patient management for small practices',
            price: 49,
            priceAnnual: 490,
            icon: 'ri-user-heart-line',
            color: 'primary',
            popular: false,
            badge: '',
            limits: {
                patients: '100',
                appointments: '500/month',
                storage: '10GB',
                users: '2',
                aiAnalyses: '50/month'
            },
            features: [
                { name: 'Patient Management', icon: 'ri-user-heart-line' },
                { name: 'Basic Appointment Scheduling', icon: 'ri-calendar-line' },
                { name: 'Simple Medical Records', icon: 'ri-file-text-line' },
                { name: 'Basic Reporting', icon: 'ri-bar-chart-line' },
                { name: 'Email Support', icon: 'ri-mail-line' }
            ]
        },
        {
            id: 'professional',
            name: 'Professional',
            description: 'Advanced features for growing medical practices',
            price: 149,
            priceAnnual: 1490,
            icon: 'ri-stethoscope-line',
            color: 'success',
            popular: true,
            badge: 'Most Popular',
            limits: {
                patients: '500',
                appointments: '2,000/month',
                storage: '100GB',
                users: '10',
                aiAnalyses: '500/month'
            },
            features: [
                { name: 'Everything in Basic', icon: 'ri-check-line' },
                { name: 'Advanced Scheduling', icon: 'ri-calendar-2-line' },
                { name: 'General Medicine Module', icon: 'ri-stethoscope-line' },
                { name: 'Dermatology Module', icon: 'ri-heart-pulse-line' },
                { name: 'Dentistry Module', icon: 'ri-capsule-line' },
                { name: 'Basic Radiology', icon: 'ri-scan-line' },
                { name: 'SecureNeat Security', icon: 'ri-shield-check-line' },
                { name: 'Basic AI Diagnostics', icon: 'ri-brain-line' },
                { name: 'Priority Support', icon: 'ri-customer-service-2-line' }
            ]
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            description: 'Complete healthcare solution for large organizations',
            price: 299,
            priceAnnual: 2990,
            icon: 'ri-hospital-line',
            color: 'warning',
            popular: false,
            badge: '',
            limits: {
                patients: '2,000',
                appointments: '10,000/month',
                storage: '500GB',
                users: '50',
                aiAnalyses: '2,000/month'
            },
            features: [
                { name: 'Everything in Professional', icon: 'ri-check-line' },
                { name: 'Pathology Module', icon: 'ri-microscope-line' },
                { name: 'Allopathy Module', icon: 'ri-medicine-bottle-line' },
                { name: 'Homeopathy Module', icon: 'ri-leaf-line' },
                { name: 'Advanced Radiology', icon: 'ri-scan-line' },
                { name: 'Advanced AI Diagnostics', icon: 'ri-brain-line' },
                { name: 'Risk Prediction Models', icon: 'ri-pulse-line' },
                { name: 'Drug Interaction Checker', icon: 'ri-alert-line' },
                { name: 'API Access', icon: 'ri-code-line' },
                { name: '24/7 Support', icon: 'ri-24-hours-line' },
                { name: 'Custom Integrations', icon: 'ri-plug-line' }
            ]
        },
        {
            id: 'ultimate',
            name: 'Ultimate AI',
            description: 'Cutting-edge AI-powered healthcare platform',
            price: 599,
            priceAnnual: 5990,
            icon: 'ri-robot-2-line',
            color: 'danger',
            popular: false,
            badge: 'Premium',
            limits: {
                patients: 'Unlimited',
                appointments: 'Unlimited',
                storage: '2TB',
                users: 'Unlimited',
                aiAnalyses: 'Unlimited'
            },
            features: [
                { name: 'Everything in Enterprise', icon: 'ri-check-line' },
                { name: 'Premium AI Diagnostics', icon: 'ri-robot-2-line' },
                { name: 'Predictive Analytics', icon: 'ri-line-chart-line' },
                { name: 'Advanced ML Models', icon: 'ri-cpu-line' },
                { name: 'Real-time Clinical Insights', icon: 'ri-pulse-line' },
                { name: 'Custom AI Training', icon: 'ri-settings-3-line' },
                { name: 'White-label Solution', icon: 'ri-palette-line' },
                { name: 'Dedicated Account Manager', icon: 'ri-user-star-line' },
                { name: 'On-premise Deployment', icon: 'ri-server-line' },
                { name: 'Priority Development', icon: 'ri-rocket-line' },
                { name: 'Research Collaboration', icon: 'ri-lightbulb-line' }
            ]
        }
    ];

    // Medical features categorized
    const medicalFeatures = {
        'Core Medical Modules': [
            { name: 'Patient Management', icon: 'ri-user-heart-line', planLevel: 'Basic+' },
            { name: 'General Medicine', icon: 'ri-stethoscope-line', planLevel: 'Professional+' },
            { name: 'Emergency Medicine', icon: 'ri-emergency-line', planLevel: 'Professional+' },
            { name: 'Dermatology', icon: 'ri-heart-pulse-line', planLevel: 'Professional+' },
            { name: 'Dentistry', icon: 'ri-capsule-line', planLevel: 'Professional+' },
            { name: 'Radiology', icon: 'ri-scan-line', planLevel: 'Professional+' },
            { name: 'Pathology', icon: 'ri-microscope-line', planLevel: 'Enterprise+' },
            { name: 'Allopathy', icon: 'ri-medicine-bottle-line', planLevel: 'Enterprise+' },
            { name: 'Homeopathy', icon: 'ri-leaf-line', planLevel: 'Enterprise+' }
        ],
        'AI & Security Features': [
            { name: 'SecureNeat (Medical Security)', icon: 'ri-shield-check-line', planLevel: 'Professional+' },
            { name: 'AI Diagnostics', icon: 'ri-brain-line', planLevel: 'Professional+' },
            { name: 'Risk Prediction Models', icon: 'ri-pulse-line', planLevel: 'Enterprise+' },
            { name: 'Drug Interaction Checker', icon: 'ri-alert-line', planLevel: 'Enterprise+' },
            { name: 'Predictive Analytics', icon: 'ri-line-chart-line', planLevel: 'Ultimate AI' },
            { name: 'Custom AI Training', icon: 'ri-settings-3-line', planLevel: 'Ultimate AI' }
        ],
        'Management & Integration': [
            { name: 'Advanced Scheduling', icon: 'ri-calendar-2-line', planLevel: 'Professional+' },
            { name: 'API Access', icon: 'ri-code-line', planLevel: 'Enterprise+' },
            { name: 'Custom Integrations', icon: 'ri-plug-line', planLevel: 'Enterprise+' },
            { name: 'White-label Solution', icon: 'ri-palette-line', planLevel: 'Ultimate AI' },
            { name: 'On-premise Deployment', icon: 'ri-server-line', planLevel: 'Ultimate AI' }
        ],
        'Support & Services': [
            { name: 'Email Support', icon: 'ri-mail-line', planLevel: 'Basic+' },
            { name: 'Priority Support', icon: 'ri-customer-service-2-line', planLevel: 'Professional+' },
            { name: '24/7 Support', icon: 'ri-24-hours-line', planLevel: 'Enterprise+' },
            { name: 'Dedicated Account Manager', icon: 'ri-user-star-line', planLevel: 'Ultimate AI' },
            { name: 'Research Collaboration', icon: 'ri-lightbulb-line', planLevel: 'Ultimate AI' }
        ]
    };

    const isLoadingAny = Object.values(loading).some(val => val === true);

    if (isLoadingAny && !userSubscription && !plans.length) {
        return (
            <Container fluid className="py-5 text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading subscription details...</p>
            </Container>
        );
    }

    return (
        <Container fluid className="py-4">
            {/* Hero Section */}
            <Row className="mb-5">
                <Col lg={12} className="text-center">
                    <div className="bg-gradient-primary text-white py-5 rounded-3" style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }}>
                        <h1 className="display-4 fw-bold mb-3">
                            <i className="ri-hospital-line me-3"></i>
                            Professional Medical Services - Manual Billing
                        </h1>
                        <p className="lead mb-4">
                            Choose the perfect plan for your healthcare practice. From basic patient management to advanced AI-powered diagnostics.
                        </p>
                        <div className="d-flex justify-content-center align-items-center gap-3">
                            <Badge bg="light" text="dark" className="px-3 py-2">
                                <i className="ri-shield-check-line me-2"></i>HIPAA Compliant
                            </Badge>
                            <Badge bg="light" text="dark" className="px-3 py-2">
                                <i className="ri-lock-2-line me-2"></i>Bank-level Security
                            </Badge>
                            <Badge bg="light" text="dark" className="px-3 py-2">
                                <i className="ri-robot-2-line me-2"></i>AI-Powered
                            </Badge>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* Pricing Toggle */}
            <Row className="mb-4">
                <Col lg={12} className="text-center">
                    <div className="d-inline-flex align-items-center bg-light rounded-pill p-1">
                        <Button 
                            variant={!isAnnual ? "primary" : "light"} 
                            className="rounded-pill px-4"
                            onClick={() => setIsAnnual(false)}
                        >
                            Monthly
                        </Button>
                        <Button 
                            variant={isAnnual ? "primary" : "light"} 
                            className="rounded-pill px-4"
                            onClick={() => setIsAnnual(true)}
                        >
                            Annual <Badge bg="success" className="ms-2">Save 17%</Badge>
                        </Button>
                    </div>
                </Col>
            </Row>

            {/* Subscription Plans */}
            <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4 nav-justified">
                <Tab eventKey="plans" title={<><i className="ri-price-tag-3-line me-2"></i>Subscription Plans</>}>
                    <Row className="g-4">
                        {subscriptionPlans.map((plan, index) => (
                            <Col lg={3} md={6} key={plan.id}>
                                <Card className={`h-100 text-center position-relative ${plan.popular ? 'border-primary shadow-lg' : 'border-0 shadow-sm'}`}>
                                    {plan.popular && (
                                        <div className="position-absolute top-0 start-50 translate-middle">
                                            <Badge bg="primary" className="px-3 py-2 rounded-pill">
                                                <i className="ri-star-fill me-1"></i>
                                                {plan.badge}
                                            </Badge>
                                        </div>
                                    )}
                                    
                                    <Card.Body className="p-4">
                                        <div className="mb-4">
                                            <div className={`mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle`} 
                                                 style={{width: '80px', height: '80px', backgroundColor: `var(--bs-${plan.color})`}}>
                                                <i className={`${plan.icon} fs-1 text-white`}></i>
                                            </div>
                                            <h4 className="fw-bold text-primary">{plan.name}</h4>
                                            <p className="text-muted">{plan.description}</p>
                                        </div>

                                        <div className="mb-4">
                                            <div className="d-flex align-items-end justify-content-center">
                                                <span className="display-4 fw-bold text-primary">
                                                    ${isAnnual ? Math.floor(plan.priceAnnual / 12) : plan.price}
                                                </span>
                                                <span className="text-muted ms-2">/month</span>
                                            </div>
                                            {isAnnual && (
                                                <small className="text-success">
                                                    <i className="ri-arrow-down-line"></i>
                                                    Save ${(plan.price * 12 - plan.priceAnnual)} annually
                                                </small>
                                            )}
                                        </div>

                                        <div className="mb-4">
                                            <h6 className="text-primary mb-3">Plan Limits:</h6>
                                            <div className="text-start">
                                                <div className="d-flex justify-content-between mb-2">
                                                    <small className="text-muted">Patients:</small>
                                                    <Badge bg="light" text="dark">{plan.limits.patients}</Badge>
                                                </div>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <small className="text-muted">Monthly Appointments:</small>
                                                    <Badge bg="light" text="dark">{plan.limits.appointments}</Badge>
                                                </div>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <small className="text-muted">Storage:</small>
                                                    <Badge bg="light" text="dark">{plan.limits.storage}</Badge>
                                                </div>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <small className="text-muted">Team Members:</small>
                                                    <Badge bg="light" text="dark">{plan.limits.users}</Badge>
                                                </div>
                                                <div className="d-flex justify-content-between">
                                                    <small className="text-muted">AI Analyses:</small>
                                                    <Badge bg="light" text="dark">{plan.limits.aiAnalyses}</Badge>
                                                </div>
                                            </div>
                                        </div>

                                        <Button 
                                            variant={plan.popular ? "primary" : "outline-primary"} 
                                            size="lg" 
                                            className="w-100 mb-3"
                                            onClick={() => setSelectedPlan(plan.id)}
                                        >
                                            {plan.popular ? 'Get Started' : 'Choose Plan'}
                                        </Button>

                                        <Button 
                                            variant="link" 
                                            size="sm" 
                                            onClick={() => setSelectedPlan(plan.id)}
                                            className="text-decoration-none"
                                        >
                                            <i className="ri-eye-line me-1"></i>
                                            View All Features
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* Feature Comparison */}
                    <Row className="mt-5">
                        <Col lg={12}>
                            <Card className="border-0 shadow-sm">
                                <Card.Header className="bg-primary text-white">
                                    <h5 className="mb-0">
                                        <i className="ri-compare-line me-2"></i>
                                        Detailed Feature Comparison
                                    </h5>
                                </Card.Header>
                                <Card.Body>
                                    {selectedPlan && (
                                        <div className="mb-4">
                                            <Alert variant="info">
                                                <h6 className="alert-heading">
                                                    <i className="ri-information-line me-2"></i>
                                                    Features included in {subscriptionPlans.find(p => p.id === selectedPlan)?.name} Plan:
                                                </h6>
                                                <Row>
                                                    {subscriptionPlans.find(p => p.id === selectedPlan)?.features.map((feature, index) => (
                                                        <Col md={6} lg={4} key={index} className="mb-2">
                                                            <div className="d-flex align-items-center">
                                                                <i className={`${feature.icon} text-success me-2`}></i>
                                                                <span className="small">{feature.name}</span>
                                                            </div>
                                                        </Col>
                                                    ))}
                                                </Row>
                                            </Alert>
                                        </div>
                                    )}

                                    <div className="table-responsive">
                                        <Table hover>
                                            <thead className="table-light">
                                                <tr>
                                                    <th style={{width: '40%'}}>Features</th>
                                                    <th className="text-center">Basic</th>
                                                    <th className="text-center">Professional</th>
                                                    <th className="text-center">Enterprise</th>
                                                    <th className="text-center">Ultimate AI</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* Core Medical Modules */}
                                                <tr className="table-secondary">
                                                    <td colSpan="5">
                                                        <strong>
                                                            <i className="ri-hospital-line me-2"></i>
                                                            Core Medical Modules
                                                        </strong>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><i className="ri-user-heart-line me-2 text-primary"></i>Patient Management</td>
                                                    <td className="text-center"><i className="ri-check-line text-success fs-5"></i></td>
                                                    <td className="text-center"><i className="ri-check-line text-success fs-5"></i></td>
                                                    <td className="text-center"><i className="ri-check-line text-success fs-5"></i></td>
                                                    <td className="text-center"><i className="ri-check-line text-success fs-5"></i></td>
                                                </tr>
                                                <tr>
                                                    <td><i className="ri-stethoscope-line me-2 text-primary"></i>General Medicine</td>
                                                    <td className="text-center"><i className="ri-close-line text-muted fs-5"></i></td>
                                                    <td className="text-center"><i className="ri-check-line text-success fs-5"></i></td>
                                                    <td className="text-center"><i className="ri-check-line text-success fs-5"></i></td>
                                                    <td className="text-center"><i className="ri-check-line text-success fs-5"></i></td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Tab>

                <Tab eventKey="features" title={<><i className="ri-list-check-3 me-2"></i>All Features</>}>
                    <Row className="g-4">
                        {Object.entries(medicalFeatures).map(([category, features]) => (
                            <Col lg={6} key={category}>
                                <Card className="h-100 border-0 shadow-sm">
                                    <Card.Header className="bg-light border-0">
                                        <h5 className="mb-0 text-primary">
                                            <i className={`${features[0]?.icon || 'ri-star-line'} me-2`}></i>
                                            {category}
                                        </h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <div className="row g-2">
                                            {features.map((feature, index) => (
                                                <div key={index} className="col-12">
                                                    <div className="d-flex align-items-center p-2 rounded hover-bg-light">
                                                        <i className={`${feature.icon} text-success me-3`}></i>
                                                        <div className="flex-grow-1">
                                                            <div className="fw-medium">{feature.name}</div>
                                                        </div>
                                                        <Badge bg="light" text="dark" className="ms-2">
                                                            {feature.planLevel}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Tab>

                <Tab eventKey="billing" title={<><i className="ri-bill-line me-2"></i>Billing & Usage</>}>
                    <Row className="g-4">
                        <Col lg={8}>
                            <Card className="border-0 shadow-sm">
                                <Card.Header className="bg-primary text-white">
                                    <h5 className="mb-0">
                                        <i className="ri-credit-card-line me-2"></i>
                                        Current Subscription
                                    </h5>
                                </Card.Header>
                                <Card.Body>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="d-flex align-items-center mb-3">
                                                <div className="bg-primary rounded-circle p-2 me-3">
                                                    <i className="ri-vip-crown-2-line text-white"></i>
                                                </div>
                                                <div>
                                                    <h6 className="mb-1">Professional Plan</h6>
                                                    <small className="text-muted">Active since Jan 15, 2024</small>
                                                </div>
                                            </div>
                                            <div className="row g-3">
                                                <div className="col-6">
                                                    <div className="text-center p-3 bg-light rounded">
                                                        <div className="h4 text-primary mb-0">$149</div>
                                                        <small className="text-muted">Monthly</small>
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="text-center p-3 bg-light rounded">
                                                        <div className="h4 text-success mb-0">28</div>
                                                        <small className="text-muted">Days left</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <h6 className="text-primary mb-3">Usage Statistics</h6>
                                            <div className="mb-3">
                                                <div className="d-flex justify-content-between mb-1">
                                                    <small>Patients</small>
                                                    <small className="text-muted">347 / 500</small>
                                                </div>
                                                <ProgressBar now={69.4} variant="primary" size="sm" />
                                            </div>
                                            <div className="mb-3">
                                                <div className="d-flex justify-content-between mb-1">
                                                    <small>Monthly Appointments</small>
                                                    <small className="text-muted">1,240 / 2,000</small>
                                                </div>
                                                <ProgressBar now={62} variant="success" size="sm" />
                                            </div>
                                            <div className="mb-3">
                                                <div className="d-flex justify-content-between mb-1">
                                                    <small>Storage Used</small>
                                                    <small className="text-muted">45GB / 100GB</small>
                                                </div>
                                                <ProgressBar now={45} variant="warning" size="sm" />
                                            </div>
                                            <div className="mb-3">
                                                <div className="d-flex justify-content-between mb-1">
                                                    <small>AI Analyses</small>
                                                    <small className="text-muted">156 / 500</small>
                                                </div>
                                                <ProgressBar now={31.2} variant="info" size="sm" />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <hr />
                                    
                                    <div className="d-flex gap-2">
                                        <Button variant="outline-primary" size="sm">
                                            <i className="ri-download-2-line me-1"></i>
                                            Download Invoice
                                        </Button>
                                        <Button variant="outline-warning" size="sm">
                                            <i className="ri-arrow-up-line me-1"></i>
                                            Upgrade Plan
                                        </Button>
                                        <Button variant="outline-secondary" size="sm">
                                            <i className="ri-settings-3-line me-1"></i>
                                            Manage Billing
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        
                        <Col lg={4}>
                            <Card className="border-0 shadow-sm mb-4">
                                <Card.Header className="bg-success text-white">
                                    <h6 className="mb-0">
                                        <i className="ri-money-dollar-circle-line me-2"></i>
                                        Payment Method
                                    </h6>
                                </Card.Header>
                                <Card.Body>
                                    <div className="d-flex align-items-center mb-3">
                                        <i className="ri-mastercard-line fs-2 text-warning me-3"></i>
                                        <div>
                                            <div className="fw-medium">•••• •••• •••• 4532</div>
                                            <small className="text-muted">Expires 12/26</small>
                                        </div>
                                    </div>
                                    <Button variant="outline-primary" size="sm" className="w-100">
                                        <i className="ri-edit-line me-1"></i>
                                        Update Payment
                                    </Button>
                                </Card.Body>
                            </Card>

                            <Card className="border-0 shadow-sm">
                                <Card.Header className="bg-info text-white">
                                    <h6 className="mb-0">
                                        <i className="ri-history-line me-2"></i>
                                        Recent Activity
                                    </h6>
                                </Card.Header>
                                <Card.Body>
                                    <div className="timeline">
                                        <div className="timeline-item mb-3">
                                            <div className="d-flex">
                                                <div className="flex-shrink-0">
                                                    <div className="bg-success rounded-circle p-1">
                                                        <i className="ri-check-line text-white small"></i>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <div className="small fw-medium">Payment Processed</div>
                                                    <div className="text-muted" style={{fontSize: '0.75rem'}}>
                                                        Jan 15, 2024 - $149.00
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="timeline-item mb-3">
                                            <div className="d-flex">
                                                <div className="flex-shrink-0">
                                                    <div className="bg-primary rounded-circle p-1">
                                                        <i className="ri-arrow-up-line text-white small"></i>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <div className="small fw-medium">Plan Upgraded</div>
                                                    <div className="text-muted" style={{fontSize: '0.75rem'}}>
                                                        Jan 15, 2024 - Basic → Professional
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="timeline-item">
                                            <div className="d-flex">
                                                <div className="flex-shrink-0">
                                                    <div className="bg-warning rounded-circle p-1">
                                                        <i className="ri-user-add-line text-white small"></i>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <div className="small fw-medium">Account Created</div>
                                                    <div className="text-muted" style={{fontSize: '0.75rem'}}>
                                                        Dec 20, 2023
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Tab>
            </Tabs>

            {/* Contact & Support Section */}
            <Row className="mt-5">
                <Col lg={12}>
                    <Card className="border-0 shadow-sm bg-light">
                        <Card.Body className="text-center py-5">
                            <h4 className="text-primary mb-3">
                                <i className="ri-customer-service-2-line me-2"></i>
                                Need Help Choosing the Right Plan?
                            </h4>
                            <p className="text-muted mb-4">
                                Our healthcare technology experts are here to help you find the perfect solution for your practice.
                            </p>
                            <div className="d-flex justify-content-center gap-3 flex-wrap">
                                <Button variant="primary" size="lg">
                                    <i className="ri-phone-line me-2"></i>
                                    Schedule Demo
                                </Button>
                                <Button variant="outline-primary" size="lg">
                                    <i className="ri-chat-3-line me-2"></i>
                                    Live Chat
                                </Button>
                                <Button variant="outline-secondary" size="lg">
                                    <i className="ri-mail-line me-2"></i>
                                    Contact Sales
                                </Button>
                            </div>
                            
                            <div className="row mt-4 pt-4 border-top">
                                <div className="col-md-4">
                                    <div className="d-flex align-items-center justify-content-center">
                                        <i className="ri-shield-check-line text-success fs-3 me-3"></i>
                                        <div className="text-start">
                                            <div className="fw-bold text-dark">HIPAA Compliant</div>
                                            <small className="text-muted">Bank-level security</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="d-flex align-items-center justify-content-center">
                                        <i className="ri-time-line text-primary fs-3 me-3"></i>
                                        <div className="text-start">
                                            <div className="fw-bold text-dark">24/7 Support</div>
                                            <small className="text-muted">Always available</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="d-flex align-items-center justify-content-center">
                                        <i className="ri-money-dollar-circle-line text-warning fs-3 me-3"></i>
                                        <div className="text-start">
                                            <div className="fw-bold text-dark">30-Day Trial</div>
                                            <small className="text-muted">Risk-free guarantee</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default React.memo(SubscriptionPage);
