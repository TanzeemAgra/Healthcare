import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const PricingCalculator = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [calculatorData, setCalculatorData] = useState({
    userCount: 10,
    facilityType: 'small',
    features: ['basic'],
    subscription: 'monthly'
  });

  const [savings, setSavings] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  const facilityTypes = {
    small: { label: 'Small Clinic (1-20 users)', multiplier: 1, baseCost: 500 },
    medium: { label: 'Medium Hospital (21-100 users)', multiplier: 0.8, baseCost: 1200 },
    large: { label: 'Large Hospital (100+ users)', multiplier: 0.6, baseCost: 2500 },
    enterprise: { label: 'Healthcare System (500+ users)', multiplier: 0.4, baseCost: 5000 }
  };

  const featurePricing = {
    basic: { label: 'Basic Features', cost: 25 },
    ai: { label: 'AI Assistant', cost: 50 },
    radiology: { label: 'Radiology Module', cost: 100 },
    analytics: { label: 'Advanced Analytics', cost: 75 },
    integration: { label: 'API Integration', cost: 150 }
  };

  const subscriptionDiscounts = {
    monthly: { label: 'Monthly', discount: 0 },
    annual: { label: 'Annual (Save 20%)', discount: 0.2 },
    biennial: { label: '2 Years (Save 35%)', discount: 0.35 }
  };

  useEffect(() => {
    calculatePricing();
  }, [calculatorData]);

  const calculatePricing = () => {
    const facility = facilityTypes[calculatorData.facilityType];
    const baseUserCost = calculatorData.features.reduce((sum, feature) => 
      sum + featurePricing[feature].cost, 0
    );
    
    const totalUsers = Math.max(calculatorData.userCount, 1);
    const monthlyCost = (baseUserCost * totalUsers * facility.multiplier) + facility.baseCost;
    
    const subscriptionDiscount = subscriptionDiscounts[calculatorData.subscription].discount;
    const finalMonthlyCost = monthlyCost * (1 - subscriptionDiscount);
    
    // Calculate savings compared to traditional systems
    const traditionalSystemCost = totalUsers * 200; // Assuming $200 per user for traditional systems
    const monthlySavings = traditionalSystemCost - finalMonthlyCost;
    
    setTotalCost(finalMonthlyCost);
    setSavings(Math.max(monthlySavings, 0));
  };

  const handleUserCountChange = (value) => {
    setCalculatorData(prev => ({
      ...prev,
      userCount: parseInt(value) || 1
    }));
  };

  const handleFeatureToggle = (feature) => {
    setCalculatorData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  return (
    <section className="py-5 bg-light">
      <Container>
        <Row className="mb-5">
          <Col lg={8} className="mx-auto text-center">
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h2 className="display-5 fw-bold mb-3">Calculate Your Healthcare Savings</h2>
              <p className="lead text-muted">
                See how much you can save by switching to our AI-powered healthcare platform
              </p>
            </motion.div>
          </Col>
        </Row>

        <Row className="g-4">
          {/* Calculator Form */}
          <Col lg={8}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg calculator-card">
                <Card.Body className="p-4">
                  <h4 className="mb-4">
                    <i className="ri-calculator-line me-2 text-primary"></i>
                    Pricing Calculator
                  </h4>

                  {/* User Count Slider */}
                  <div className="mb-4">
                    <Form.Label className="fw-bold mb-3">
                      Number of Users: 
                      <span className="text-primary ms-2 fs-4">{calculatorData.userCount}</span>
                    </Form.Label>
                    <Form.Range
                      min="1"
                      max="500"
                      value={calculatorData.userCount}
                      onChange={(e) => handleUserCountChange(e.target.value)}
                      className="custom-range"
                    />
                    <div className="d-flex justify-content-between text-muted small mt-1">
                      <span>1</span>
                      <span>500+</span>
                    </div>
                  </div>

                  {/* Facility Type */}
                  <div className="mb-4">
                    <Form.Label className="fw-bold mb-3">Facility Type</Form.Label>
                    <Row className="g-2">
                      {Object.entries(facilityTypes).map(([key, facility]) => (
                        <Col md={6} key={key}>
                          <Form.Check
                            type="radio"
                            id={`facility-${key}`}
                            name="facilityType"
                            value={key}
                            checked={calculatorData.facilityType === key}
                            onChange={(e) => setCalculatorData(prev => ({
                              ...prev,
                              facilityType: e.target.value
                            }))}
                            label={facility.label}
                            className="facility-radio"
                          />
                        </Col>
                      ))}
                    </Row>
                  </div>

                  {/* Features Selection */}
                  <div className="mb-4">
                    <Form.Label className="fw-bold mb-3">Select Features</Form.Label>
                    <Row className="g-3">
                      {Object.entries(featurePricing).map(([key, feature]) => (
                        <Col md={6} key={key}>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Card 
                              className={`feature-card cursor-pointer ${
                                calculatorData.features.includes(key) ? 'border-primary bg-primary-subtle' : 'border-light'
                              }`}
                              onClick={() => handleFeatureToggle(key)}
                            >
                              <Card.Body className="p-3">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <h6 className="mb-1">{feature.label}</h6>
                                    <small className="text-muted">${feature.cost}/user/month</small>
                                  </div>
                                  <Form.Check
                                    type="checkbox"
                                    checked={calculatorData.features.includes(key)}
                                    onChange={() => {}}
                                    className="pointer-events-none"
                                  />
                                </div>
                              </Card.Body>
                            </Card>
                          </motion.div>
                        </Col>
                      ))}
                    </Row>
                  </div>

                  {/* Subscription Type */}
                  <div className="mb-4">
                    <Form.Label className="fw-bold mb-3">Subscription Period</Form.Label>
                    <Row className="g-2">
                      {Object.entries(subscriptionDiscounts).map(([key, subscription]) => (
                        <Col md={4} key={key}>
                          <Card
                            className={`subscription-card cursor-pointer ${
                              calculatorData.subscription === key ? 'border-primary bg-primary-subtle' : 'border-light'
                            }`}
                            onClick={() => setCalculatorData(prev => ({
                              ...prev,
                              subscription: key
                            }))}
                          >
                            <Card.Body className="text-center p-3">
                              <h6 className="mb-1">{subscription.label}</h6>
                              {subscription.discount > 0 && (
                                <Badge bg="success" className="mt-1">
                                  {Math.round(subscription.discount * 100)}% Off
                                </Badge>
                              )}
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          {/* Results Panel */}
          <Col lg={4}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="border-0 shadow-lg results-card sticky-top">
                <Card.Body className="p-4">
                  <h4 className="mb-4 text-center">
                    <i className="ri-money-dollar-circle-line me-2 text-success"></i>
                    Your Savings
                  </h4>

                  {/* Monthly Cost */}
                  <div className="text-center mb-4">
                    <div className="cost-display mb-3">
                      <span className="display-4 fw-bold text-primary">
                        ${Math.round(totalCost).toLocaleString()}
                      </span>
                      <div className="text-muted">/month</div>
                    </div>
                    
                    {savings > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="savings-badge"
                      >
                        <Badge bg="success" className="fs-6 p-2">
                          Save ${Math.round(savings).toLocaleString()}/month
                        </Badge>
                      </motion.div>
                    )}
                  </div>

                  {/* Cost Breakdown */}
                  <div className="cost-breakdown mb-4">
                    <h6 className="text-muted mb-3">Cost Breakdown:</h6>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Users:</span>
                      <span>{calculatorData.userCount}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Features:</span>
                      <span>{calculatorData.features.length}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Facility Type:</span>
                      <span className="text-capitalize">{calculatorData.facilityType}</span>
                    </div>
                    {subscriptionDiscounts[calculatorData.subscription].discount > 0 && (
                      <div className="d-flex justify-content-between mb-2 text-success">
                        <span>Discount:</span>
                        <span>-{Math.round(subscriptionDiscounts[calculatorData.subscription].discount * 100)}%</span>
                      </div>
                    )}
                  </div>

                  {/* CTA Buttons */}
                  <div className="d-grid gap-2">
                    <Button size="lg" variant="primary" className="fw-bold">
                      <i className="ri-credit-card-line me-2"></i>
                      Start Free Trial
                    </Button>
                    <Button size="sm" variant="outline-primary">
                      <i className="ri-phone-line me-2"></i>
                      Schedule Demo
                    </Button>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-4 text-center">
                    <small className="text-muted">
                      * Prices shown are estimates. Final pricing may vary based on specific requirements.
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .calculator-card, .results-card {
          transition: all 0.3s ease;
        }

        .feature-card, .subscription-card {
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .feature-card:hover, .subscription-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .custom-range::-webkit-slider-thumb {
          background: #0d6efd;
          border: none;
          border-radius: 50%;
          height: 20px;
          width: 20px;
        }

        .cost-display {
          padding: 20px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 15px;
        }

        .savings-badge {
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }

        .sticky-top {
          top: 100px !important;
        }
      `}</style>
    </section>
  );
};

export default PricingCalculator;
