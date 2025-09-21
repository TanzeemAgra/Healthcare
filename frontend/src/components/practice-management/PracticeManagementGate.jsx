import React, { useState, useEffect } from 'react';
import { Alert, Button, Card, Container, Row, Col, Badge, Modal, Spinner } from 'react-bootstrap';
import { Crown, Lock, TrendingUp, Users, Calendar, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSubscription } from '../../contexts/SubscriptionContext';

const PracticeManagementGate = ({ children }) => {
  const { 
    userSubscription, 
    loading, 
    hasPracticeManagement, 
    isSubscriptionActive 
  } = useSubscription();
  
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const features = [
    {
      icon: <Users className="text-primary" size={24} />,
      title: "Doctor Management",
      description: "Complete staff management with scheduling, qualifications, and performance tracking"
    },
    {
      icon: <Users className="text-success" size={24} />,
      title: "Patient Management", 
      description: "Comprehensive patient records, medical history, and treatment tracking"
    },
    {
      icon: <Calendar className="text-info" size={24} />,
      title: "Appointment System",
      description: "Advanced scheduling with automated reminders and conflict detection"
    },
    {
      icon: <BarChart3 className="text-warning" size={24} />,
      title: "Analytics & Reports",
      description: "Detailed insights on practice performance, revenue, and patient outcomes"
    },
    {
      icon: <Lock className="text-secondary" size={24} />,
      title: "HIPAA Compliance",
      description: "Built-in compliance tools and secure data handling for healthcare"
    },
    {
      icon: <TrendingUp className="text-danger" size={24} />,
      title: "Revenue Tracking",
      description: "Financial management with billing integration and revenue analytics"
    }
  ];

  const plans = [
    {
      name: "Practice Management Pro",
      price: "$149/month",
      features: [
        "Up to 5 doctors",
        "Up to 500 patients", 
        "Basic appointment scheduling",
        "Standard reports",
        "Email support"
      ],
      badge: "Popular",
      badgeColor: "primary"
    },
    {
      name: "Practice Management Enterprise",
      price: "$299/month", 
      features: [
        "Unlimited doctors",
        "Unlimited patients",
        "Advanced scheduling & automation",
        "Custom reports & analytics",
        "Priority support",
        "API access",
        "Multi-location support"
      ],
      badge: "Best Value",
      badgeColor: "success"
    }
  ];

  // Show loading spinner while checking subscription
  if (loading) {
    return (
      <Container fluid className="py-5">
        <Row className="justify-content-center">
          <Col className="text-center">
            <Spinner animation="border" variant="primary" className="mb-3" />
            <p className="text-muted">Checking subscription status...</p>
          </Col>
        </Row>
      </Container>
    );
  }

  // If user has access, render the children
  if (hasPracticeManagement() && isSubscriptionActive()) {
    return children;
  }

  return (
    <Container fluid className="py-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-5"
          >
            <div className="d-inline-flex align-items-center justify-content-center mb-4">
              <div 
                className="rounded-circle p-4"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                <Crown size={48} className="text-white" />
              </div>
            </div>
            <h1 className="display-4 mb-3">Practice Management System</h1>
            <p className="lead text-muted mb-4">
              Professional healthcare practice management solution designed for modern medical facilities
            </p>
            <Alert variant="info" className="d-inline-block">
              <Lock size={16} className="me-2" />
              Premium Feature - Subscription Required
            </Alert>
          </motion.div>

          {/* Features Grid */}
          <Row className="mb-5">
            <Col md={12}>
              <h3 className="text-center mb-4">What's Included</h3>
            </Col>
            {features.map((feature, index) => (
              <Col md={6} lg={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="mb-4"
                >
                  <Card className="h-100 border-0 shadow-sm">
                    <Card.Body className="text-center p-4">
                      <div className="mb-3">
                        {feature.icon}
                      </div>
                      <h5 className="mb-2">{feature.title}</h5>
                      <p className="text-muted small mb-0">{feature.description}</p>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>

          {/* Current Subscription Status */}
          <Row className="mb-5">
            <Col>
              <Card className="border-warning bg-warning-subtle">
                <Card.Body className="text-center">
                  <h5 className="text-warning mb-3">
                    <Lock size={20} className="me-2" />
                    Access Restricted
                  </h5>
                  {userSubscription ? (
                    <p className="mb-3">
                      Your current plan: <strong>{userSubscription.plan_name}</strong> does not include 
                      Practice Management features. Upgrade to access this premium functionality.
                    </p>
                  ) : (
                    <p className="mb-3">
                      You need an active subscription to access Practice Management features. 
                      Choose a plan below to get started.
                    </p>
                  )}
                  <Button 
                    variant="warning" 
                    size="lg"
                    onClick={() => setShowUpgradeModal(true)}
                  >
                    <Crown size={20} className="me-2" />
                    View Subscription Plans
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Benefits Section */}
          <Row className="mb-5">
            <Col>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-5">
                  <h3 className="text-center mb-4">Why Choose Our Practice Management System?</h3>
                  <Row>
                    <Col md={6}>
                      <ul className="list-unstyled">
                        <li className="mb-3">
                          <i className="ri-check-circle-fill text-success me-2"></i>
                          <strong>HIPAA Compliant:</strong> Built-in security and compliance features
                        </li>
                        <li className="mb-3">
                          <i className="ri-check-circle-fill text-success me-2"></i>
                          <strong>Cloud-Based:</strong> Access from anywhere, automatic backups
                        </li>
                        <li className="mb-3">
                          <i className="ri-check-circle-fill text-success me-2"></i>
                          <strong>Integrated AI:</strong> Smart scheduling and automated workflows
                        </li>
                      </ul>
                    </Col>
                    <Col md={6}>
                      <ul className="list-unstyled">
                        <li className="mb-3">
                          <i className="ri-check-circle-fill text-success me-2"></i>
                          <strong>Mobile Friendly:</strong> Responsive design for all devices
                        </li>
                        <li className="mb-3">
                          <i className="ri-check-circle-fill text-success me-2"></i>
                          <strong>24/7 Support:</strong> Expert healthcare IT support team
                        </li>
                        <li className="mb-3">
                          <i className="ri-check-circle-fill text-success me-2"></i>
                          <strong>Scalable:</strong> Grows with your practice from startup to enterprise
                        </li>
                      </ul>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* CTA Section */}
          <Row>
            <Col className="text-center">
              <h3 className="mb-3">Ready to Transform Your Practice?</h3>
              <p className="text-muted mb-4">
                Join thousands of healthcare professionals who trust our platform
              </p>
              <div className="d-flex gap-3 justify-content-center">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => setShowUpgradeModal(true)}
                >
                  <Crown size={20} className="me-2" />
                  Upgrade Now
                </Button>
                <Button 
                  variant="outline-primary" 
                  size="lg"
                  onClick={() => window.open('/contact', '_blank')}
                >
                  <i className="ri-question-line me-2"></i>
                  Contact Sales
                </Button>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Upgrade Modal */}
      <Modal show={showUpgradeModal} onHide={() => setShowUpgradeModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <Crown size={24} className="me-2" />
            Practice Management Plans
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {plans.map((plan, index) => (
              <Col md={6} key={index}>
                <Card className={`h-100 ${index === 1 ? 'border-success' : 'border-primary'}`}>
                  <Card.Header className={`text-center bg-${index === 1 ? 'success' : 'primary'}-subtle`}>
                    {plan.badge && (
                      <Badge bg={plan.badgeColor} className="mb-2">
                        {plan.badge}
                      </Badge>
                    )}
                    <h4 className="mb-1">{plan.name}</h4>
                    <h2 className="text-primary">{plan.price}</h2>
                  </Card.Header>
                  <Card.Body>
                    <ul className="list-unstyled">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="mb-2">
                          <i className="ri-check-circle-fill text-success me-2"></i>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </Card.Body>
                  <Card.Footer className="text-center border-0">
                    <Button 
                      variant={index === 1 ? 'success' : 'primary'} 
                      className="w-100"
                      onClick={() => {
                        setShowUpgradeModal(false);
                        window.location.href = '/subscription';
                      }}
                    >
                      Choose {plan.name}
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
          
          <Row className="mt-4">
            <Col className="text-center">
              <Alert variant="info" className="border-0">
                <i className="ri-information-line me-2"></i>
                <strong>Need a custom solution?</strong> Contact our sales team for enterprise pricing and custom features.
              </Alert>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpgradeModal(false)}>
            Close
          </Button>
          <Button 
            variant="outline-primary"
            onClick={() => window.open('/contact', '_blank')}
          >
            <i className="ri-phone-line me-2"></i>
            Contact Sales
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PracticeManagementGate;
