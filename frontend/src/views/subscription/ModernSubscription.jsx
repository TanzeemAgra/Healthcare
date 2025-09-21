import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Tab, Tabs, Table, ProgressBar, Modal, Alert, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import subscriptionService from '../../services/subscriptionService';
import '../../styles/ModernSubscription.css';

const ModernSubscriptionPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    
    const [activeTab, setActiveTab] = useState('plans');
    const [isAnnual, setIsAnnual] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [currentSubscription, setCurrentSubscription] = useState(null);
    const [usageStats, setUsageStats] = useState(null);
    const [billingHistory, setBillingHistory] = useState([]);

    // Healthcare-focused subscription plans
    const healthcarePlans = [
        {
            id: 'starter',
            name: 'Healthcare Starter',
            description: 'Perfect for small clinics and individual practitioners',
            monthlyPrice: 29,
            annualPrice: 290,
            originalPrice: 348,
            icon: '🏥',
            color: 'primary',
            popular: false,
            badge: '',
            features: [
                { name: 'Up to 100 patients', icon: '👥', included: true },
                { name: 'Basic appointment scheduling', icon: '📅', included: true },
                { name: 'Electronic health records', icon: '📋', included: true },
                { name: 'Basic reporting', icon: '📊', included: true },
                { name: 'Email support', icon: '📧', included: true },
                { name: 'AI-powered insights', icon: '🤖', included: false },
                { name: 'Advanced analytics', icon: '📈', included: false },
                { name: 'Telemedicine integration', icon: '💻', included: false }
            ],
            limits: {
                patients: 100,
                appointments: 500,
                storage: '5GB',
                users: 2,
                apiCalls: 1000
            }
        },
        {
            id: 'professional',
            name: 'Healthcare Professional',
            description: 'Comprehensive solution for growing medical practices',
            monthlyPrice: 79,
            annualPrice: 790,
            originalPrice: 948,
            icon: '🏨',
            color: 'success',
            popular: true,
            badge: 'Most Popular',
            features: [
                { name: 'Up to 1,000 patients', icon: '👥', included: true },
                { name: 'Advanced appointment scheduling', icon: '📅', included: true },
                { name: 'Complete EHR system', icon: '📋', included: true },
                { name: 'Advanced reporting & analytics', icon: '📊', included: true },
                { name: 'Priority email & chat support', icon: '📧', included: true },
                { name: 'AI-powered diagnostic insights', icon: '🤖', included: true },
                { name: 'Telemedicine integration', icon: '💻', included: true },
                { name: 'Custom integrations', icon: '🔗', included: false }
            ],
            limits: {
                patients: 1000,
                appointments: 5000,
                storage: '50GB',
                users: 10,
                apiCalls: 10000
            }
        },
        {
            id: 'enterprise',
            name: 'Healthcare Enterprise',
            description: 'Full-scale solution for hospitals and large practices',
            monthlyPrice: 199,
            annualPrice: 1990,
            originalPrice: 2388,
            icon: '🏥',
            color: 'warning',
            popular: false,
            badge: 'Enterprise',
            features: [
                { name: 'Unlimited patients', icon: '👥', included: true },
                { name: 'Enterprise scheduling system', icon: '📅', included: true },
                { name: 'Advanced EHR with AI', icon: '📋', included: true },
                { name: 'Real-time analytics dashboard', icon: '📊', included: true },
                { name: '24/7 dedicated support', icon: '📧', included: true },
                { name: 'Advanced AI & ML features', icon: '🤖', included: true },
                { name: 'Full telemedicine suite', icon: '💻', included: true },
                { name: 'Custom integrations & API', icon: '🔗', included: true }
            ],
            limits: {
                patients: 'Unlimited',
                appointments: 'Unlimited',
                storage: '500GB',
                users: 'Unlimited',
                apiCalls: 'Unlimited'
            }
        }
    ];

    const additionalServices = [
        {
            id: 'ai-chatbot',
            name: 'Dr. Max AI Chatbot',
            description: 'AI-powered medical assistant for patient inquiries',
            price: 25,
            icon: '🤖',
            features: ['24/7 patient support', 'Medical Q&A', 'Appointment booking', 'Symptom checker']
        },
        {
            id: 'mcq-generator',
            name: 'Medical MCQ Generator',
            description: 'Generate medical examination questions from documents',
            price: 35,
            icon: '📝',
            features: ['Auto-generate MCQs', 'Medical knowledge base', 'Exam preparation', 'Study materials']
        },
        {
            id: 'radiology-analysis',
            name: 'Radiology AI Analysis',
            description: 'AI-powered analysis of radiology reports and images',
            price: 50,
            icon: '🔬',
            features: ['Image analysis', 'Report generation', 'Anomaly detection', 'Second opinion AI']
        },
        {
            id: 'data-anonymization',
            name: 'Data Anonymization',
            description: 'HIPAA-compliant data protection and anonymization',
            price: 20,
            icon: '🔒',
            features: ['HIPAA compliance', 'Data masking', 'Privacy protection', 'Audit trails']
        }
    ];

    useEffect(() => {
        if (isAuthenticated) {
            loadSubscriptionData();
        }
    }, [isAuthenticated]);

    const loadSubscriptionData = async () => {
        try {
            setLoading(true);
            
            // Load current subscription
            const subscription = await subscriptionService.getCurrentSubscription();
            setCurrentSubscription(subscription);
            
            // Load usage stats
            const usage = await subscriptionService.getUsageStats();
            setUsageStats(usage);
            
            // Load billing history
            const billing = await subscriptionService.getBillingHistory();
            setBillingHistory(billing);
            
        } catch (error) {
            console.error('Error loading subscription data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
        setShowUpgradeModal(true);
    };

    const handleUpgradeConfirm = async () => {
        try {
            setLoading(true);
            
            if (!isAuthenticated) {
                // Store selected plan and redirect to login
                localStorage.setItem('selectedPlan', JSON.stringify(selectedPlan));
                localStorage.setItem('selectedPlanId', selectedPlan.id);
                navigate('/login', { 
                    state: { 
                        selectedPlan: selectedPlan,
                        planId: selectedPlan.id,
                        returnTo: '/subscription'
                    }
                });
                return;
            }

            // Create payment session
            const checkoutUrl = await subscriptionService.createCheckoutSession(selectedPlan.id, isAnnual);
            window.location.href = checkoutUrl;
            
        } catch (error) {
            console.error('Error creating checkout session:', error);
        } finally {
            setLoading(false);
            setShowUpgradeModal(false);
        }
    };

    const calculateSavings = (monthly, annual) => {
        const monthlyCost = monthly * 12;
        const savings = monthlyCost - annual;
        const percentage = Math.round((savings / monthlyCost) * 100);
        return { amount: savings, percentage };
    };

    const renderPlanCard = (plan) => {
        const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
        const originalPrice = isAnnual ? plan.originalPrice : plan.monthlyPrice * 12;
        const savings = isAnnual ? calculateSavings(plan.monthlyPrice, plan.annualPrice) : null;
        const isCurrentPlan = currentSubscription?.plan_name === plan.name;

        return (
            <Col lg={4} md={6} className="mb-4" key={plan.id}>
                <Card className={`h-100 plan-card ${plan.popular ? 'popular-plan' : ''} ${isCurrentPlan ? 'current-plan' : ''}`}>
                    {plan.popular && (
                        <div className="popular-badge">
                            <Badge bg="success">{plan.badge}</Badge>
                        </div>
                    )}
                    
                    <Card.Header className={`text-center bg-${plan.color} text-white`}>
                        <div className="plan-icon mb-2">{plan.icon}</div>
                        <h4 className="mb-1">{plan.name}</h4>
                        <p className="mb-0 opacity-90">{plan.description}</p>
                    </Card.Header>
                    
                    <Card.Body className="d-flex flex-column">
                        <div className="pricing-section text-center mb-4">
                            <div className="price-display">
                                <span className="currency">$</span>
                                <span className="price">{price}</span>
                                <span className="period">/{isAnnual ? 'year' : 'month'}</span>
                            </div>
                            
                            {isAnnual && savings && (
                                <div className="savings-info">
                                    <small className="text-muted text-decoration-line-through">
                                        ${plan.monthlyPrice * 12}/year
                                    </small>
                                    <Badge bg="success" className="ms-2">
                                        Save {savings.percentage}%
                                    </Badge>
                                </div>
                            )}
                        </div>

                        <div className="features-list mb-4">
                            {plan.features.map((feature, index) => (
                                <div key={index} className={`feature-item ${feature.included ? 'included' : 'not-included'}`}>
                                    <span className="feature-icon">
                                        {feature.included ? '✅' : '❌'}
                                    </span>
                                    <span className="feature-text">{feature.name}</span>
                                </div>
                            ))}
                        </div>

                        <div className="limits-section mb-4">
                            <h6 className="text-muted mb-2">Plan Limits:</h6>
                            <div className="limits-grid">
                                <div className="limit-item">
                                    <small>Patients:</small>
                                    <strong>{plan.limits.patients}</strong>
                                </div>
                                <div className="limit-item">
                                    <small>Storage:</small>
                                    <strong>{plan.limits.storage}</strong>
                                </div>
                                <div className="limit-item">
                                    <small>Users:</small>
                                    <strong>{plan.limits.users}</strong>
                                </div>
                                <div className="limit-item">
                                    <small>API Calls:</small>
                                    <strong>{plan.limits.apiCalls}</strong>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto">
                            {isCurrentPlan ? (
                                <Button variant="outline-success" className="w-100" disabled>
                                    <i className="ri-check-line me-2"></i>Current Plan
                                </Button>
                            ) : (
                                <Button 
                                    variant={plan.popular ? 'success' : 'outline-primary'} 
                                    className="w-100"
                                    onClick={() => handlePlanSelect(plan)}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Spinner size="sm" className="me-2" />
                                    ) : (
                                        <i className="ri-arrow-right-line me-2"></i>
                                    )}
                                    {currentSubscription ? 'Upgrade to This Plan' : 'Get Started'}
                                </Button>
                            )}
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        );
    };

    const renderCurrentSubscription = () => {
        if (!currentSubscription) {
            return (
                <Alert variant="info" className="text-center">
                    <i className="ri-information-line me-2"></i>
                    You don't have an active subscription. Choose a plan to get started!
                </Alert>
            );
        }

        return (
            <Card className="subscription-overview mb-4">
                <Card.Header className="bg-primary text-white">
                    <h5 className="mb-0">
                        <i className="ri-vip-crown-line me-2"></i>
                        Current Subscription
                    </h5>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <h6>Plan Details</h6>
                            <p><strong>Plan:</strong> {currentSubscription.plan_name}</p>
                            <p><strong>Status:</strong> 
                                <Badge bg={currentSubscription.status === 'active' ? 'success' : 'warning'} className="ms-2">
                                    {currentSubscription.status}
                                </Badge>
                            </p>
                            <p><strong>Next Billing:</strong> {new Date(currentSubscription.end_date).toLocaleDateString()}</p>
                        </Col>
                        <Col md={6}>
                            <h6>Quick Actions</h6>
                            <div className="d-flex gap-2 flex-wrap">
                                <Button variant="outline-primary" size="sm">
                                    <i className="ri-edit-line me-1"></i>Change Plan
                                </Button>
                                <Button variant="outline-secondary" size="sm">
                                    <i className="ri-bill-line me-1"></i>View Invoices
                                </Button>
                                <Button variant="outline-danger" size="sm">
                                    <i className="ri-close-line me-1"></i>Cancel
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        );
    };

    const renderUsageStats = () => {
        if (!usageStats) return null;

        return (
            <Card className="usage-stats mb-4">
                <Card.Header>
                    <h5 className="mb-0">
                        <i className="ri-dashboard-line me-2"></i>
                        Usage Statistics
                    </h5>
                </Card.Header>
                <Card.Body>
                    <Row>
                        {usageStats.services?.map((service, index) => (
                            <Col md={6} lg={3} className="mb-3" key={index}>
                                <div className="usage-item">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h6 className="mb-0">{service.name}</h6>
                                        <Badge bg="primary">{service.usage_count || 0}</Badge>
                                    </div>
                                    <ProgressBar 
                                        now={service.limit ? (service.usage_count / service.limit) * 100 : 0}
                                        variant={service.limit && service.usage_count > service.limit * 0.8 ? 'warning' : 'success'}
                                        className="mb-1"
                                    />
                                    <small className="text-muted">
                                        {service.limit ? `${service.usage_count} / ${service.limit}` : 'Unlimited'}
                                    </small>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Card.Body>
            </Card>
        );
    };

    const renderAdditionalServices = () => (
        <Card className="additional-services mb-4">
            <Card.Header>
                <h5 className="mb-0">
                    <i className="ri-add-box-line me-2"></i>
                    Additional Services
                </h5>
            </Card.Header>
            <Card.Body>
                <Row>
                    {additionalServices.map((service) => (
                        <Col md={6} lg={3} className="mb-3" key={service.id}>
                            <Card className="h-100 service-card">
                                <Card.Body className="text-center">
                                    <div className="service-icon mb-3">{service.icon}</div>
                                    <h6>{service.name}</h6>
                                    <p className="text-muted small">{service.description}</p>
                                    <div className="price-tag mb-3">
                                        <strong>${service.price}/month</strong>
                                    </div>
                                    <ul className="list-unstyled small">
                                        {service.features.map((feature, idx) => (
                                            <li key={idx}>✓ {feature}</li>
                                        ))}
                                    </ul>
                                    <Button variant="outline-primary" size="sm" className="w-100">
                                        Add Service
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Card.Body>
        </Card>
    );

    return (
        <div className="modern-subscription-page">
            <Container fluid>
                {/* Header Section */}
                <div className="subscription-header mb-5">
                    <Container>
                        <Row className="text-center">
                            <Col lg={8} className="mx-auto">
                                <h1 className="display-4 fw-bold text-primary mb-3">
                                    Healthcare Plans & Pricing
                                </h1>
                                <p className="lead text-muted mb-4">
                                    Choose the perfect plan for your healthcare practice. Scale as you grow with our flexible pricing options.
                                </p>
                                
                                {/* Billing Toggle */}
                                <div className="billing-toggle mb-4">
                                    <Form.Check
                                        type="switch"
                                        id="billing-toggle"
                                        label={
                                            <span>
                                                Monthly 
                                                <strong className="mx-2">|</strong> 
                                                Annual <Badge bg="success" className="ms-2">Save up to 20%</Badge>
                                            </span>
                                        }
                                        checked={isAnnual}
                                        onChange={(e) => setIsAnnual(e.target.checked)}
                                        className="billing-switch"
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>

                {/* Main Content */}
                <Container>
                    <Tabs activeKey={activeTab} onSelect={setActiveTab} className="nav-pills-custom mb-4">
                        <Tab eventKey="plans" title={<span><i className="ri-price-tag-line me-2"></i>Pricing Plans</span>}>
                            {/* Subscription Plans */}
                            <Row className="justify-content-center">
                                {healthcarePlans.map(renderPlanCard)}
                            </Row>

                            {/* Additional Services */}
                            <div className="mt-5">
                                {renderAdditionalServices()}
                            </div>
                        </Tab>

                        <Tab eventKey="current" title={<span><i className="ri-user-line me-2"></i>My Subscription</span>} disabled={!isAuthenticated}>
                            {renderCurrentSubscription()}
                            {renderUsageStats()}
                        </Tab>

                        <Tab eventKey="billing" title={<span><i className="ri-bill-line me-2"></i>Billing History</span>} disabled={!isAuthenticated}>
                            <Card>
                                <Card.Header>
                                    <h5 className="mb-0">
                                        <i className="ri-history-line me-2"></i>
                                        Billing History
                                    </h5>
                                </Card.Header>
                                <Card.Body>
                                    {billingHistory.length > 0 ? (
                                        <Table responsive>
                                            <thead>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Plan</th>
                                                    <th>Amount</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {billingHistory.map((invoice, index) => (
                                                    <tr key={index}>
                                                        <td>{new Date(invoice.date_created).toLocaleDateString()}</td>
                                                        <td>{invoice.plan_name_snapshot}</td>
                                                        <td>${invoice.amount_due}</td>
                                                        <td>
                                                            <Badge bg={invoice.status === 'succeeded' ? 'success' : 'warning'}>
                                                                {invoice.status}
                                                            </Badge>
                                                        </td>
                                                        <td>
                                                            <Button variant="outline-primary" size="sm">
                                                                <i className="ri-download-line me-1"></i>Download
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    ) : (
                                        <Alert variant="info" className="text-center">
                                            <i className="ri-information-line me-2"></i>
                                            No billing history available yet.
                                        </Alert>
                                    )}
                                </Card.Body>
                            </Card>
                        </Tab>
                    </Tabs>
                </Container>

                {/* Upgrade Modal */}
                <Modal show={showUpgradeModal} onHide={() => setShowUpgradeModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <i className="ri-rocket-line me-2"></i>
                            Upgrade to {selectedPlan?.name}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedPlan && (
                            <div className="text-center">
                                <div className="plan-preview mb-4">
                                    <div className="plan-icon mb-2">{selectedPlan.icon}</div>
                                    <h4>{selectedPlan.name}</h4>
                                    <p className="text-muted">{selectedPlan.description}</p>
                                    
                                    <div className="pricing-preview">
                                        <span className="h2 text-primary">
                                            ${isAnnual ? selectedPlan.annualPrice : selectedPlan.monthlyPrice}
                                        </span>
                                        <span className="text-muted">/{isAnnual ? 'year' : 'month'}</span>
                                    </div>
                                    
                                    {isAnnual && (
                                        <Badge bg="success" className="mt-2">
                                            Save {calculateSavings(selectedPlan.monthlyPrice, selectedPlan.annualPrice).percentage}%
                                        </Badge>
                                    )}
                                </div>

                                {!isAuthenticated && (
                                    <Alert variant="info">
                                        <i className="ri-information-line me-2"></i>
                                        You'll need to sign in to complete your subscription.
                                    </Alert>
                                )}
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowUpgradeModal(false)}>
                            Cancel
                        </Button>
                        <Button 
                            variant="primary" 
                            onClick={handleUpgradeConfirm}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner size="sm" className="me-2" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <i className="ri-credit-card-line me-2"></i>
                                    {isAuthenticated ? 'Continue to Payment' : 'Sign In & Subscribe'}
                                </>
                            )}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
};

export default ModernSubscriptionPage;
