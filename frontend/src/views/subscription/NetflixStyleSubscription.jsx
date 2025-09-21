import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, ProgressBar, Alert, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import subscriptionService from '../../services/subscriptionService';
import './NetflixStyleSubscription.css';

const NetflixStyleSubscription = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedFeatures, setSelectedFeatures] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [loading, setLoading] = useState(false);
    const [currentSubscription, setCurrentSubscription] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const subscriptionPlans = [
        {
            id: 'basic',
            name: 'Basic Care',
            description: 'Essential healthcare management for small practices',
            monthlyPrice: 120,
            annualPrice: 1195, // 17% discount from $1440 annual
            color: 'primary',
            popular: false,
            badge: '',
            features: [
                { name: 'Patient Management System', included: true },
                { name: 'Basic Appointment Scheduling', included: true },
                { name: 'Electronic Health Records', included: true },
                { name: 'Basic Reporting', included: true },
                { name: 'Email Support', included: true },
                { name: 'Secure Authentication', included: true },
                { name: '10GB Storage', included: true }
            ],
            limits: {
                patients: '100',
                appointments: '500',
                storage: '10GB',
                users: '5',
                features: 'Basic'
            }
        },
        {
            id: 'professional',
            name: 'Professional Care',
            description: 'Comprehensive healthcare solution for growing practices',
            monthlyPrice: 220,
            annualPrice: 2191, // 17% discount from $2640 annual
            color: 'success',
            popular: true,
            badge: 'Most Popular',
            features: [
                { name: 'Advanced Patient Management', included: true },
                { name: 'Complete Appointment System', included: true },
                { name: 'Full EHR System', included: true },
                { name: 'Advanced Analytics', included: true },
                { name: 'Priority Support', included: true },
                { name: 'Secure Authentication Plus', included: true },
                { name: 'AI-powered Diagnostic Tools', included: true },
                { name: 'Radiology Integration', included: true },
                { name: '50GB Storage', included: true }
            ],
            limits: {
                patients: '2,000',
                appointments: '5,000',
                storage: '50GB',
                users: '10',
                features: 'Professional'
            }
        },
        {
            id: 'enterprise',
            name: 'Enterprise Care',
            description: 'Complete healthcare ecosystem for hospitals and large practices',
            monthlyPrice: 330,
            annualPrice: 3287, // 17% discount from $3960 annual
            color: 'warning',
            popular: false,
            badge: 'Enterprise',
            features: [
                { name: 'Unlimited Patient Management', included: true },
                { name: 'Enterprise Scheduling', included: true },
                { name: 'Advanced EHR with AI', included: true },
                { name: 'Real-time Analytics', included: true },
                { name: '24/7 Dedicated Support', included: true },
                { name: 'Enterprise Security', included: true },
                { name: 'Full AI Suite', included: true },
                { name: 'Complete Radiology Suite', included: true },
                { name: '500GB Storage', included: true }
            ],
            limits: {
                patients: 'Unlimited',
                appointments: 'Unlimited',
                storage: '500GB',
                users: 'Unlimited',
                features: 'Enterprise'
            }
        }
    ];

    const healthcareFeatures = [
        {
            id: 'secureneat',
            name: 'SecureNeat',
            description: 'Advanced security and compliance management system',
            icon: '🔒',
            category: 'Security',
            monthlyPrice: 50,
            annualPrice: 498
        },
        {
            id: 'medicine',
            name: 'Medicine',
            description: 'Comprehensive internal medicine and primary care tools',
            icon: '�',
            category: 'Primary Care',
            monthlyPrice: 50,
            annualPrice: 498
        },
        {
            id: 'radiology',
            name: 'Radiology',
            description: 'Advanced imaging analysis and radiology reporting',
            icon: '📷',
            category: 'Diagnostics',
            monthlyPrice: 50,
            annualPrice: 498
        },
        {
            id: 'dentistry',
            name: 'Dentistry',
            description: 'Complete dental practice management with treatment planning',
            icon: '🦷',
            category: 'Specialty Care',
            monthlyPrice: 50,
            annualPrice: 498
        },
        {
            id: 'dermatology',
            name: 'Dermatology',
            description: 'Skin condition tracking and dermatological assessments',
            icon: '🔬',
            category: 'Specialty Care',
            monthlyPrice: 50,
            annualPrice: 498
        },
        {
            id: 'pathology',
            name: 'Pathology',
            description: 'Laboratory information system and pathology workflows',
            icon: '🧪',
            category: 'Diagnostics',
            monthlyPrice: 50,
            annualPrice: 498
        },
        {
            id: 'homeopathy',
            name: 'Homeopathy',
            description: 'Homeopathic practice management and remedy tracking',
            icon: '🌿',
            category: 'Alternative Medicine',
            monthlyPrice: 50,
            annualPrice: 498
        },
        {
            id: 'allopathy',
            name: 'Allopathy',
            description: 'Conventional medicine practice management system',
            icon: '⚕️',
            category: 'Conventional Medicine',
            monthlyPrice: 50,
            annualPrice: 498
        }
    ];

    const additionalServices = [
        {
            id: 'ai-chatbot',
            name: 'Medical AI Assistant',
            description: 'AI-powered medical assistant for patient inquiries',
            price: 50,
            icon: '🤖',
            features: ['24/7 patient support', 'Medical Q&A', 'Appointment booking', 'Symptom checker']
        },
        {
            id: 'telemedicine',
            name: 'Telemedicine Platform',
            description: 'Complete telehealth solution for remote consultations',
            price: 75,
            icon: '💻',
            features: ['Video consultations', 'Remote monitoring', 'Digital prescriptions', 'Patient portal']
        },
        {
            id: 'analytics',
            name: 'Advanced Analytics',
            description: 'Business intelligence and predictive analytics',
            price: 60,
            icon: '📊',
            features: ['Performance metrics', 'Predictive insights', 'Custom reports', 'Data visualization']
        },
        {
            id: 'compliance',
            name: 'HIPAA Compliance Suite',
            description: 'Complete compliance management and audit tools',
            price: 40,
            icon: '🛡️',
            features: ['HIPAA compliance', 'Audit trails', 'Risk assessment', 'Documentation']
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
            
            if (subscription) {
                setSelectedPlan(subscription.plan_id);
                setSelectedFeatures(subscription.features || []);
                setSelectedServices(subscription.additional_services || []);
            }
        } catch (error) {
            console.error('Error loading subscription data:', error);
            // Don't show error for unauthenticated users
            if (isAuthenticated) {
                setError('Failed to load subscription information');
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePlanSelect = (planId) => {
        setSelectedPlan(planId);
        setError('');
    };

    const handleFeatureToggle = (featureId) => {
        setSelectedFeatures(prev => 
            prev.includes(featureId) 
                ? prev.filter(id => id !== featureId)
                : [...prev, featureId]
        );
    };

    const handleServiceToggle = (serviceId) => {
        setSelectedServices(prev => 
            prev.includes(serviceId) 
                ? prev.filter(id => id !== serviceId)
                : [...prev, serviceId]
        );
    };

    const calculateTotalPrice = () => {
        if (!selectedPlan) return 0;
        
        const plan = subscriptionPlans.find(p => p.id === selectedPlan);
        if (!plan) return 0;
        
        const basePrice = billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
        
        // Calculate healthcare specialties price
        const featuresPrice = selectedFeatures.reduce((total, featureId) => {
            const feature = healthcareFeatures.find(f => f.id === featureId);
            if (feature) {
                return total + (billingCycle === 'monthly' ? feature.monthlyPrice : feature.annualPrice);
            }
            return total;
        }, 0);
        
        // Calculate additional services price
        const servicesPrice = selectedServices.reduce((total, serviceId) => {
            const service = additionalServices.find(s => s.id === serviceId);
            return total + (service ? service.price : 0);
        }, 0);
        
        return basePrice + featuresPrice + (billingCycle === 'monthly' ? servicesPrice : servicesPrice * 10);
    };

    const handleSubscribe = async () => {
        if (!selectedPlan) {
            setError('Please select a subscription plan');
            return;
        }

        // For testing purposes, we'll allow subscription without authentication
        // but show a warning
        if (!isAuthenticated) {
            console.warn('User not authenticated - proceeding with test mode');
        }

        setLoading(true);
        setError('');

        try {
            const plan = subscriptionPlans.find(p => p.id === selectedPlan);
            if (!plan) {
                throw new Error('Selected plan not found');
            }

            console.log('Creating Razorpay order for plan:', selectedPlan);
            console.log('User data:', user);

            // Create Razorpay order directly using the service method
            const orderResult = await subscriptionService.createRazorpayOrder(
                selectedPlan, 
                user?.email || 'test@example.com'
            );
            
            console.log('Order result:', orderResult);

            if (orderResult.error) {
                throw new Error(orderResult.error);
            }

            if (!orderResult.data) {
                throw new Error('No order data received from server');
            }

            const orderData = orderResult.data;

            // Validate order data
            if (!orderData.id || !orderData.amount) {
                throw new Error('Invalid order data received');
            }

            // Configure Razorpay options
            const options = {
                key: orderData.razorpay_key || orderData.key, // Get from backend
                amount: orderData.amount,
                currency: orderData.currency || 'INR',
                name: 'Mastermind Healthcare',
                description: `${plan.name} Subscription`,
                order_id: orderData.id,
                handler: async function (response) {
                    try {
                        console.log('Payment successful:', response);
                        
                        // Verify payment
                        const verificationResult = await subscriptionService.verifyPayment({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            plan_id: selectedPlan,
                            billing_cycle: billingCycle,
                            features: selectedFeatures,
                            additional_services: selectedServices,
                            total_amount: calculateTotalPrice()
                        });

                        if (verificationResult.error) {
                            throw new Error(verificationResult.error);
                        }

                        setSuccess('Payment successful! Your subscription has been activated.');
                        setCurrentStep(4);
                        // Clear cache to refresh subscription data
                        subscriptionService.clearCache();
                    } catch (verifyError) {
                        console.error('Payment verification failed:', verifyError);
                        setError('Payment verification failed. Please contact support.');
                    } finally {
                        setLoading(false);
                    }
                },
                prefill: {
                    name: user?.name || user?.first_name || 'Test User',
                    email: user?.email || 'test@example.com',
                    contact: user?.phone || '9999999999'
                },
                notes: {
                    plan_id: selectedPlan,
                    billing_cycle: billingCycle,
                    features: selectedFeatures.join(','),
                    services: selectedServices.join(',')
                },
                theme: {
                    color: '#007bff'
                },
                modal: {
                    ondismiss: function() {
                        setLoading(false);
                        setError('Payment cancelled by user');
                    }
                }
            };

            console.log('Opening Razorpay with options:', options);

            // Check if Razorpay is loaded
            if (!window.Razorpay) {
                throw new Error('Razorpay library not loaded. Please refresh the page.');
            }

            // Open Razorpay checkout
            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (error) {
            console.error('Subscription error:', error);
            setError(error.message || 'Failed to create payment order');
            setLoading(false);
        }
    };

    const renderStepIndicator = () => (
        <div className="netflix-step-indicator mb-4">
            <div className="step-progress">
                <ProgressBar 
                    now={(currentStep / 4) * 100} 
                    className="custom-progress"
                />
            </div>
            <div className="step-labels d-flex justify-content-between">
                <span className={currentStep >= 1 ? 'active' : ''}>Choose Plan</span>
                <span className={currentStep >= 2 ? 'active' : ''}>Select Features</span>
                <span className={currentStep >= 3 ? 'active' : ''}>Add Services</span>
                <span className={currentStep >= 4 ? 'active' : ''}>Complete</span>
            </div>
        </div>
    );

    const renderPlanSelection = () => (
        <div className="netflix-plan-selection">
            <div className="text-center mb-4">
                <h2 className="netflix-title">Professional Medical Services - Pay-Per-Use</h2>
                <p className="netflix-subtitle">Select the perfect plan for your medical practice</p>
                
                <div className="billing-toggle mb-4 d-flex justify-content-center">
                    <div className="billing-option-container">
                        <Button
                            variant={billingCycle === 'monthly' ? 'primary' : 'outline-primary'}
                            className="billing-btn"
                            onClick={() => setBillingCycle('monthly')}
                            style={{ 
                                borderRadius: '25px 0 0 25px',
                                minWidth: '120px',
                                padding: '12px 24px',
                                fontWeight: '600',
                                border: 'none'
                            }}
                        >
                            Monthly
                        </Button>
                        <Button
                            variant={billingCycle === 'annual' ? 'primary' : 'outline-primary'}
                            className="billing-btn position-relative"
                            onClick={() => setBillingCycle('annual')}
                            style={{ 
                                borderRadius: '0 25px 25px 0',
                                minWidth: '120px',
                                padding: '12px 24px',
                                fontWeight: '600',
                                border: 'none'
                            }}
                        >
                            Annual
                            <Badge 
                                bg="success" 
                                className="position-absolute top-0 start-100 translate-middle"
                                style={{ fontSize: '0.7rem' }}
                            >
                                Save 17%
                            </Badge>
                        </Button>
                    </div>
                </div>
            </div>

            <Row className="justify-content-center">
                {subscriptionPlans.map(plan => (
                    <Col lg={4} md={6} key={plan.id} className="mb-4">
                        <Card 
                            className={`netflix-plan-card h-100 ${selectedPlan === plan.id ? 'selected' : ''} ${plan.popular ? 'popular' : ''}`}
                            onClick={() => handlePlanSelect(plan.id)}
                        >
                            {plan.popular && (
                                <div className="popular-badge">
                                    <Badge bg="danger">Most Popular</Badge>
                                </div>
                            )}
                            
                            <Card.Body className="text-center">
                                <h4 className="plan-name">{plan.name}</h4>
                                <p className="plan-description">{plan.description}</p>
                                
                                {/* Plan Limits Information */}
                                <div className="mb-4">
                                    <small className="text-muted bg-light px-3 py-1 rounded-pill">
                                        <i className="ri-information-line me-1"></i>
                                        {plan.limits.patients} patients • {plan.limits.appointments} appointments/month • {plan.limits.users} users
                                    </small>
                                </div>
                                
                                <div className="plan-price mb-3">
                                    {billingCycle === 'annual' ? (
                                        <div>
                                            <div className="annual-price-container">
                                                <span className="price-amount">
                                                    ${plan.annualPrice}
                                                </span>
                                                <span className="price-period">/year</span>
                                            </div>
                                            <div className="savings-info">
                                                <small className="text-muted text-decoration-line-through">
                                                    ${plan.monthlyPrice * 12}/year
                                                </small>
                                                <small className="text-success d-block">
                                                    Save ${(plan.monthlyPrice * 12) - plan.annualPrice} (17%)
                                                </small>
                                                <small className="text-muted">
                                                    ${Math.round(plan.annualPrice / 12)}/month when paid annually
                                                </small>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <span className="price-amount">
                                                ${plan.monthlyPrice}
                                            </span>
                                            <span className="price-period">/month</span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="plan-features">
                                    {plan.features && Array.isArray(plan.features) ? plan.features.slice(0, 7).map((feature, index) => (
                                        <div key={index} className="feature-item">
                                            <span className="feature-name">{feature.name}</span>
                                        </div>
                                    )) : null}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <div className="text-center mt-4">
                <Button 
                    variant="primary" 
                    size="lg"
                    onClick={() => setCurrentStep(2)}
                    disabled={!selectedPlan}
                    className="netflix-continue-btn"
                >
                    Continue to Features
                </Button>
            </div>
        </div>
    );

    const renderFeatureSelection = () => (
        <div className="netflix-feature-selection">
            <div className="text-center mb-4">
                <h2 className="netflix-title">Select Healthcare Specialties</h2>
                <p className="netflix-subtitle">Add specialty modules to your base plan (optional add-ons)</p>
                
                <div className="billing-cycle-info mb-3">
                    <Badge bg="info" className="me-2">
                        Base Plan: {selectedPlan ? subscriptionPlans.find(p => p.id === selectedPlan)?.name : 'None Selected'}
                    </Badge>
                    <Badge bg="secondary" className="me-2">
                        Billing: {billingCycle === 'monthly' ? 'Monthly' : 'Annual'}
                    </Badge>
                    {billingCycle === 'annual' && (
                        <Badge bg="success">17% Savings Applied</Badge>
                    )}
                </div>
            </div>

            <Row className="justify-content-center">
                {healthcareFeatures.map(feature => (
                    <Col lg={3} md={4} sm={6} key={feature.id} className="mb-4">
                        <Card 
                            className={`netflix-feature-card h-100 ${selectedFeatures.includes(feature.id) ? 'selected' : ''}`}
                            onClick={() => handleFeatureToggle(feature.id)}
                            style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                        >
                            <Card.Body className="text-center d-flex flex-column">
                                <div className="feature-icon mb-3" style={{ fontSize: '2.5rem' }}>
                                    {feature.icon}
                                </div>
                                <h5 className="feature-name mb-2">{feature.name}</h5>
                                <p className="feature-description flex-grow-1 mb-3" style={{ fontSize: '0.9rem' }}>
                                    {feature.description}
                                </p>
                                
                                <div className="feature-pricing mb-3">
                                    <div className="price-display">
                                        <span className="price-amount fw-bold text-primary">
                                            ${billingCycle === 'monthly' ? feature.monthlyPrice : feature.annualPrice}
                                        </span>
                                        <span className="price-period text-muted">
                                            /{billingCycle === 'monthly' ? 'month' : 'year'}
                                        </span>
                                    </div>
                                    {billingCycle === 'annual' && (
                                        <small className="text-success">
                                            Save ${(feature.monthlyPrice * 12) - feature.annualPrice}/year
                                        </small>
                                    )}
                                </div>
                                
                                <Badge 
                                    bg={selectedFeatures.includes(feature.id) ? 'success' : 'secondary'} 
                                    className="feature-category mb-2"
                                >
                                    {feature.category}
                                </Badge>
                                
                                <div className="selection-indicator mt-auto">
                                    {selectedFeatures.includes(feature.id) ? (
                                        <Badge bg="success" className="w-100 py-2">
                                            ✓ Selected
                                        </Badge>
                                    ) : (
                                        <Badge bg="outline-primary" className="w-100 py-2 text-primary border border-primary">
                                            Click to Add
                                        </Badge>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {selectedFeatures.length > 0 && (
                <div className="selected-features-summary mt-4 p-3 bg-light rounded">
                    <h5 className="text-center mb-3">Selected Healthcare Specialties</h5>
                    <Row>
                        {selectedFeatures.map(featureId => {
                            const feature = healthcareFeatures.find(f => f.id === featureId);
                            return feature ? (
                                <Col md={6} lg={4} key={featureId} className="mb-2">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>{feature.icon} {feature.name}</span>
                                        <span className="fw-bold">
                                            ${billingCycle === 'monthly' ? feature.monthlyPrice : feature.annualPrice}
                                            /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                                        </span>
                                    </div>
                                </Col>
                            ) : null;
                        })}
                    </Row>
                    <hr />
                    <div className="text-center">
                        <strong>
                            Specialties Subtotal: ${selectedFeatures.reduce((total, featureId) => {
                                const feature = healthcareFeatures.find(f => f.id === featureId);
                                return total + (feature ? (billingCycle === 'monthly' ? feature.monthlyPrice : feature.annualPrice) : 0);
                            }, 0)}/{billingCycle === 'monthly' ? 'month' : 'year'}
                        </strong>
                    </div>
                </div>
            )}

            {/* Pricing Breakdown */}
            <div className="pricing-breakdown mt-4 p-4 bg-primary text-white rounded">
                <h5 className="text-center mb-3">💰 Total Pricing Breakdown</h5>
                <div className="row">
                    <div className="col-md-6">
                        <div className="d-flex justify-content-between mb-2">
                            <span>Base Plan ({selectedPlan ? subscriptionPlans.find(p => p.id === selectedPlan)?.name : 'None'}):</span>
                            <span className="fw-bold">
                                ${selectedPlan ? (billingCycle === 'monthly' ? 
                                    subscriptionPlans.find(p => p.id === selectedPlan)?.monthlyPrice : 
                                    subscriptionPlans.find(p => p.id === selectedPlan)?.annualPrice) : 0}
                                /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                            </span>
                        </div>
                        {selectedFeatures.length > 0 && (
                            <div className="d-flex justify-content-between mb-2">
                                <span>Healthcare Specialties ({selectedFeatures.length}):</span>
                                <span className="fw-bold">
                                    ${selectedFeatures.reduce((total, featureId) => {
                                        const feature = healthcareFeatures.find(f => f.id === featureId);
                                        return total + (feature ? (billingCycle === 'monthly' ? feature.monthlyPrice : feature.annualPrice) : 0);
                                    }, 0)}
                                    /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="col-md-6">
                        <div className="text-end">
                            <h4 className="mb-0">
                                <strong>Total: ${calculateTotalPrice()}/{billingCycle === 'monthly' ? 'month' : 'year'}</strong>
                            </h4>
                            {billingCycle === 'annual' && (
                                <small className="text-light">
                                    (${Math.round(calculateTotalPrice() / 12)}/month when paid annually)
                                </small>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center mt-4">
                <Button 
                    variant="outline-secondary" 
                    className="me-3"
                    onClick={() => setCurrentStep(1)}
                >
                    Back
                </Button>
                <Button 
                    variant="primary" 
                    size="lg"
                    onClick={() => setCurrentStep(3)}
                    className="netflix-continue-btn"
                >
                    Continue to Services
                </Button>
            </div>
        </div>
    );

    const renderServiceSelection = () => (
        <div className="netflix-service-selection">
            <div className="text-center mb-4">
                <h2 className="netflix-title">Add Premium Services</h2>
                <p className="netflix-subtitle">Enhance your practice with additional services</p>
            </div>

            <Row>
                {additionalServices.map(service => (
                    <Col lg={6} key={service.id} className="mb-3">
                        <Card 
                            className={`netflix-service-card ${selectedServices.includes(service.id) ? 'selected' : ''}`}
                            onClick={() => handleServiceToggle(service.id)}
                        >
                            <Card.Body>
                                <div className="d-flex align-items-center">
                                    <div className="service-icon me-3">{service.icon}</div>
                                    <div className="flex-grow-1">
                                        <h5 className="service-name">{service.name}</h5>
                                        <p className="service-description">{service.description}</p>
                                        <div className="service-features">
                                            {service.features.map((feature, index) => (
                                                <Badge key={index} bg="light" text="dark" className="me-1 mb-1">
                                                    {feature}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="service-price">
                                        <strong>+${service.price}/mo</strong>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <div className="pricing-summary mt-4 p-4 bg-light rounded">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">Subscription Summary</h4>
                    <Badge bg="info">Step 3 of 4</Badge>
                </div>
                
                {/* Base Plan */}
                <div className="summary-item p-3 mb-2 bg-white rounded border">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>Base Plan: {subscriptionPlans.find(p => p.id === selectedPlan)?.name}</strong>
                            <div className="text-muted small">
                                {subscriptionPlans.find(p => p.id === selectedPlan)?.description}
                            </div>
                        </div>
                        <div className="text-end">
                            <div className="fw-bold">
                                ${subscriptionPlans.find(p => p.id === selectedPlan)?.[billingCycle === 'monthly' ? 'monthlyPrice' : 'annualPrice']}
                                /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                            </div>
                            <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => setCurrentStep(1)}
                                className="mt-1"
                            >
                                Change Plan
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Healthcare Specialties */}
                {selectedFeatures.length > 0 && (
                    <div className="summary-section mb-3">
                        <h6 className="text-muted mb-2">Healthcare Specialties ({selectedFeatures.length})</h6>
                        {selectedFeatures.map(featureId => {
                            const feature = healthcareFeatures.find(f => f.id === featureId);
                            return feature ? (
                                <div key={featureId} className="summary-item p-2 mb-2 bg-white rounded border">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <span className="me-2" style={{ fontSize: '1.2rem' }}>{feature.icon}</span>
                                            <div>
                                                <strong>{feature.name}</strong>
                                                <div className="text-muted small">{feature.category}</div>
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <div className="fw-bold">
                                                +${billingCycle === 'monthly' ? feature.monthlyPrice : feature.annualPrice}
                                                /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                                            </div>
                                            <div className="btn-group mt-1">
                                                <Button 
                                                    variant="outline-secondary" 
                                                    size="sm"
                                                    onClick={() => setCurrentStep(2)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button 
                                                    variant="outline-danger" 
                                                    size="sm"
                                                    onClick={() => handleFeatureToggle(featureId)}
                                                    title="Remove specialty"
                                                >
                                                    ✕
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null;
                        })}
                        <Button 
                            variant="outline-success" 
                            size="sm"
                            onClick={() => setCurrentStep(2)}
                            className="w-100"
                        >
                            + Add More Specialties
                        </Button>
                    </div>
                )}

                {/* Additional Services */}
                {selectedServices.length > 0 && (
                    <div className="summary-section mb-3">
                        <h6 className="text-muted mb-2">Additional Services ({selectedServices.length})</h6>
                        {selectedServices.map(serviceId => {
                            const service = additionalServices.find(s => s.id === serviceId);
                            return service ? (
                                <div key={serviceId} className="summary-item p-2 mb-2 bg-white rounded border">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <span className="me-2" style={{ fontSize: '1.2rem' }}>{service.icon}</span>
                                            <div>
                                                <strong>{service.name}</strong>
                                                <div className="text-muted small">{service.description}</div>
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <div className="fw-bold">
                                                +${billingCycle === 'monthly' ? service.price : service.price * 10}
                                                /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                                            </div>
                                            <Button 
                                                variant="outline-danger" 
                                                size="sm"
                                                onClick={() => handleServiceToggle(serviceId)}
                                                title="Remove service"
                                                className="mt-1"
                                            >
                                                ✕ Remove
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ) : null;
                        })}
                    </div>
                )}

                {/* Billing Cycle Modifier */}
                <div className="summary-item p-3 mb-3 bg-primary text-white rounded">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>Billing Cycle</strong>
                            <div className="small">
                                {billingCycle === 'monthly' ? 'Monthly billing' : 'Annual billing (17% savings)'}
                            </div>
                        </div>
                        <div className="text-end">
                            <div className="btn-group">
                                <Button 
                                    variant={billingCycle === 'monthly' ? 'light' : 'outline-light'}
                                    size="sm"
                                    onClick={() => setBillingCycle('monthly')}
                                >
                                    Monthly
                                </Button>
                                <Button 
                                    variant={billingCycle === 'annual' ? 'light' : 'outline-light'}
                                    size="sm"
                                    onClick={() => setBillingCycle('annual')}
                                >
                                    Annual
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <hr />
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="mb-0">Total Amount</h5>
                        {billingCycle === 'annual' && (
                            <small className="text-success">
                                (${Math.round(calculateTotalPrice() / 12)}/month when paid annually)
                            </small>
                        )}
                    </div>
                    <div className="text-end">
                        <h4 className="mb-0 text-primary">
                            ${calculateTotalPrice()}/{billingCycle === 'monthly' ? 'month' : 'year'}
                        </h4>
                    </div>
                </div>
            </div>

            <div className="text-center mt-4">
                <Button 
                    variant="outline-secondary" 
                    className="me-3"
                    onClick={() => setCurrentStep(2)}
                >
                    Back
                </Button>
                <Button 
                    variant="success" 
                    size="lg"
                    onClick={handleSubscribe}
                    disabled={loading}
                    className="netflix-subscribe-btn"
                >
                    {loading ? (
                        <>
                            <Spinner size="sm" className="me-2" />
                            Processing...
                        </>
                    ) : (
                        'Subscribe Now'
                    )}
                </Button>
            </div>
        </div>
    );

    const renderSuccess = () => (
        <div className="netflix-success text-center">
            <div className="success-icon mb-4">🎉</div>
            <h2 className="netflix-title">Welcome to Mastermind Healthcare!</h2>
            <p className="netflix-subtitle">Your subscription has been activated successfully.</p>
            
            <Card className="subscription-details mt-4">
                <Card.Header className="bg-primary text-white">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Final Subscription Details</h5>
                        <Button 
                            variant="outline-light" 
                            size="sm"
                            onClick={() => setCurrentStep(1)}
                        >
                            ✏️ Edit Subscription
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body>
                    {/* Base Plan Details */}
                    <div className="detail-section mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="text-muted mb-0">Base Plan</h6>
                            <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => setCurrentStep(1)}
                            >
                                Change Plan
                            </Button>
                        </div>
                        <div className="bg-light p-3 rounded">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <strong>{subscriptionPlans.find(p => p.id === selectedPlan)?.name}</strong>
                                    <div className="text-muted small">
                                        {subscriptionPlans.find(p => p.id === selectedPlan)?.description}
                                    </div>
                                </div>
                                <div className="text-end">
                                    <div className="fw-bold">
                                        ${subscriptionPlans.find(p => p.id === selectedPlan)?.[billingCycle === 'monthly' ? 'monthlyPrice' : 'annualPrice']}
                                        /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Healthcare Specialties */}
                    {selectedFeatures.length > 0 && (
                        <div className="detail-section mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h6 className="text-muted mb-0">Healthcare Specialties ({selectedFeatures.length})</h6>
                                <Button 
                                    variant="outline-success" 
                                    size="sm"
                                    onClick={() => setCurrentStep(2)}
                                >
                                    Modify Specialties
                                </Button>
                            </div>
                            <div className="bg-light p-3 rounded">
                                {selectedFeatures.map(featureId => {
                                    const feature = healthcareFeatures.find(f => f.id === featureId);
                                    return feature ? (
                                        <div key={featureId} className="d-flex justify-content-between align-items-center mb-2">
                                            <div className="d-flex align-items-center">
                                                <span className="me-2">{feature.icon}</span>
                                                <span>{feature.name}</span>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <span className="me-2 fw-bold">
                                                    +${billingCycle === 'monthly' ? feature.monthlyPrice : feature.annualPrice}
                                                    /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                                                </span>
                                                <Button 
                                                    variant="outline-danger" 
                                                    size="sm"
                                                    onClick={() => {
                                                        handleFeatureToggle(featureId);
                                                        setCurrentStep(2);
                                                    }}
                                                    title="Remove this specialty"
                                                >
                                                    ✕
                                                </Button>
                                            </div>
                                        </div>
                                    ) : null;
                                })}
                            </div>
                        </div>
                    )}

                    {/* Additional Services */}
                    {selectedServices.length > 0 && (
                        <div className="detail-section mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h6 className="text-muted mb-0">Additional Services ({selectedServices.length})</h6>
                                <Button 
                                    variant="outline-info" 
                                    size="sm"
                                    onClick={() => setCurrentStep(3)}
                                >
                                    Modify Services
                                </Button>
                            </div>
                            <div className="bg-light p-3 rounded">
                                {selectedServices.map(serviceId => {
                                    const service = additionalServices.find(s => s.id === serviceId);
                                    return service ? (
                                        <div key={serviceId} className="d-flex justify-content-between align-items-center mb-2">
                                            <div className="d-flex align-items-center">
                                                <span className="me-2">{service.icon}</span>
                                                <span>{service.name}</span>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <span className="me-2 fw-bold">
                                                    +${billingCycle === 'monthly' ? service.price : service.price * 10}
                                                    /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                                                </span>
                                                <Button 
                                                    variant="outline-danger" 
                                                    size="sm"
                                                    onClick={() => {
                                                        handleServiceToggle(serviceId);
                                                        setCurrentStep(3);
                                                    }}
                                                    title="Remove this service"
                                                >
                                                    ✕
                                                </Button>
                                            </div>
                                        </div>
                                    ) : null;
                                })}
                            </div>
                        </div>
                    )}

                    {/* Billing Information */}
                    <div className="detail-section mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="text-muted mb-0">Billing Cycle</h6>
                            <div className="btn-group">
                                <Button 
                                    variant={billingCycle === 'monthly' ? 'primary' : 'outline-primary'}
                                    size="sm"
                                    onClick={() => setBillingCycle('monthly')}
                                >
                                    Monthly
                                </Button>
                                <Button 
                                    variant={billingCycle === 'annual' ? 'primary' : 'outline-primary'}
                                    size="sm"
                                    onClick={() => setBillingCycle('annual')}
                                >
                                    Annual
                                </Button>
                            </div>
                        </div>
                        <div className="bg-primary text-white p-3 rounded">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>
                                        {billingCycle === 'monthly' ? 'Monthly Billing' : 'Annual Billing'}
                                    </strong>
                                    {billingCycle === 'annual' && (
                                        <div className="small">
                                            💰 You're saving 17% with annual billing!
                                        </div>
                                    )}
                                </div>
                                <div className="text-end">
                                    <h5 className="mb-0">
                                        ${calculateTotalPrice()}/{billingCycle === 'monthly' ? 'month' : 'year'}
                                    </h5>
                                    {billingCycle === 'annual' && (
                                        <small>
                                            (${Math.round(calculateTotalPrice() / 12)}/month)
                                        </small>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex gap-2 justify-content-center mt-4">
                        <Button 
                            variant="outline-secondary"
                            onClick={() => setCurrentStep(3)}
                        >
                            ← Back to Review
                        </Button>
                        <Button 
                            variant="primary"
                            onClick={() => {
                                // Add download invoice functionality
                                alert('Invoice downloaded! (This would trigger actual download in production)');
                            }}
                        >
                            📄 Download Invoice
                        </Button>
                        <Button 
                            variant="success"
                            onClick={() => {
                                // Navigate to dashboard or home
                                window.location.href = '/';
                            }}
                        >
                            🏠 Go to Dashboard
                        </Button>
                    </div>
                </Card.Body>
            </Card>
            
            <Button 
                variant="primary" 
                size="lg" 
                className="mt-4"
                onClick={() => navigate('/dashboard')}
            >
                Go to Dashboard
            </Button>
        </div>
    );

    if (loading) {
        return (
            <Container className="netflix-subscription">
                <div className="text-center py-5">
                    <Spinner animation="border" size="lg" />
                    <p className="mt-3">Loading subscription options...</p>
                </div>
            </Container>
        );
    }

    return (
        <div className="netflix-container d-flex align-items-center min-vh-100">
            <Container className="netflix-subscription">
                {renderStepIndicator()}
                
                {error && (
                    <Alert variant="danger" dismissible onClose={() => setError('')} className="mx-auto" style={{ maxWidth: '800px' }}>
                        {error}
                    </Alert>
                )}
                
                {success && (
                    <Alert variant="success" dismissible onClose={() => setSuccess('')} className="mx-auto" style={{ maxWidth: '800px' }}>
                        {success}
                    </Alert>
                )}

            {/* Debug Panel - Remove in production */}
            <div className="debug-panel mb-4 p-3 bg-light border rounded mx-auto" style={{ maxWidth: '800px' }}>
                <h6 className="text-center">Debug Information:</h6>
                <div className="text-center">
                    <p><strong>User:</strong> {user ? JSON.stringify(user) : 'Not authenticated'}</p>
                    <p><strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
                    <p><strong>Selected Plan:</strong> {selectedPlan || 'None'}</p>
                    <p><strong>API Base URL:</strong> {import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}</p>
                    <Button 
                        variant="outline-info" 
                        size="sm"
                        onClick={async () => {
                            try {
                                const testResult = await subscriptionService.createRazorpayOrder('basic', 'test@example.com');
                                console.log('Test API Result:', testResult);
                                alert('Check console for test results');
                            } catch (error) {
                                console.error('Test API Error:', error);
                                alert('Test failed: ' + error.message);
                            }
                        }}
                    >
                        Test API Connection
                    </Button>
                </div>
            </div>

            <div className="netflix-content">
                {currentStep === 1 && renderPlanSelection()}
                {currentStep === 2 && renderFeatureSelection()}
                {currentStep === 3 && renderServiceSelection()}
                {currentStep === 4 && renderSuccess()}
            </div>
        </Container>
    </div>
    );
};

export default NetflixStyleSubscription;
