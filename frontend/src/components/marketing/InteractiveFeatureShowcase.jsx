import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Row, Col, Badge, Button, Modal, Form } from 'react-bootstrap';

const InteractiveFeatureShowcase = () => {
  const [activeFeature, setActiveFeature] = useState('ai-diagnosis');
  const [showDemo, setShowDemo] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  const features = {
    'ai-diagnosis': {
      title: 'AI-Powered Diagnosis',
      description: 'Advanced machine learning algorithms assist doctors in accurate diagnosis',
      icon: 'ri-brain-line',
      color: 'primary',
      benefits: ['95% accuracy rate', 'Instant analysis', 'Pattern recognition'],
      demoData: {
        title: 'AI Diagnosis Demo',
        steps: [
          {
            title: 'Upload Medical Data',
            description: 'Upload patient symptoms, test results, or medical images',
            icon: 'ri-upload-cloud-line'
          },
          {
            title: 'AI Analysis',
            description: 'Our AI analyzes the data using medical knowledge base',
            icon: 'ri-cpu-line'
          },
          {
            title: 'Generate Report',
            description: 'Receive detailed diagnosis report with confidence scores',
            icon: 'ri-file-text-line'
          }
        ]
      }
    },
    'patient-management': {
      title: 'Smart Patient Management',
      description: 'Comprehensive patient record management with intelligent insights',
      icon: 'ri-user-heart-line',
      color: 'success',
      benefits: ['Centralized records', 'Smart scheduling', 'Health tracking'],
      demoData: {
        title: 'Patient Management Demo',
        steps: [
          {
            title: 'Patient Registration',
            description: 'Quick patient onboarding with smart forms',
            icon: 'ri-user-add-line'
          },
          {
            title: 'Health Monitoring',
            description: 'Track vital signs and health metrics automatically',
            icon: 'ri-heart-pulse-line'
          },
          {
            title: 'Smart Alerts',
            description: 'Get notified about critical health changes',
            icon: 'ri-notification-line'
          }
        ]
      }
    },
    'automated-billing': {
      title: 'Automated Billing',
      description: 'Streamline billing processes with intelligent automation',
      icon: 'ri-money-dollar-circle-line',
      color: 'warning',
      benefits: ['Auto invoice generation', 'Insurance processing', 'Payment tracking'],
      demoData: {
        title: 'Automated Billing Demo',
        steps: [
          {
            title: 'Service Recording',
            description: 'Automatically capture all medical services provided',
            icon: 'ri-service-line'
          },
          {
            title: 'Insurance Verification',
            description: 'Verify insurance coverage and generate claims',
            icon: 'ri-shield-check-line'
          },
          {
            title: 'Payment Processing',
            description: 'Process payments and generate receipts automatically',
            icon: 'ri-secure-payment-line'
          }
        ]
      }
    },
    'analytics': {
      title: 'Advanced Analytics',
      description: 'Powerful insights and reporting for better decision making',
      icon: 'ri-bar-chart-box-line',
      color: 'info',
      benefits: ['Real-time dashboards', 'Predictive insights', 'Custom reports'],
      demoData: {
        title: 'Analytics Dashboard Demo',
        steps: [
          {
            title: 'Data Collection',
            description: 'Gather data from all hospital operations',
            icon: 'ri-database-line'
          },
          {
            title: 'Smart Analysis',
            description: 'AI-powered analysis reveals hidden patterns',
            icon: 'ri-search-eye-line'
          },
          {
            title: 'Actionable Insights',
            description: 'Get recommendations to improve operations',
            icon: 'ri-lightbulb-line'
          }
        ]
      }
    }
  };

  const handleFeatureClick = (featureKey) => {
    setActiveFeature(featureKey);
  };

  const handleStartDemo = () => {
    setShowDemo(true);
    setDemoStep(0);
  };

  const nextDemoStep = () => {
    if (demoStep < features[activeFeature].demoData.steps.length - 1) {
      setDemoStep(demoStep + 1);
    } else {
      setShowDemo(false);
      setDemoStep(0);
    }
  };

  return (
    <div className="py-5">
      <div className="container">
        <Row className="mb-5">
          <Col lg={12} className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="display-5 fw-bold mb-3">
                Experience Our <span className="text-primary">Powerful Features</span>
              </h2>
              <p className="lead text-muted mb-4">
                Interactive demos that show how our platform transforms healthcare operations
              </p>
            </motion.div>
          </Col>
        </Row>

        <Row>
          {/* Feature Selector */}
          <Col lg={4} className="mb-4">
            <div className="feature-selector">
              {Object.entries(features).map(([key, feature], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="mb-3"
                >
                  <Card 
                    className={`h-100 border-0 shadow-sm cursor-pointer ${activeFeature === key ? 'border-start border-4' : ''}`}
                    style={{ 
                      borderColor: activeFeature === key ? `var(--bs-${feature.color})` : 'transparent',
                      background: activeFeature === key ? `var(--bs-${feature.color}-rgb, 13, 110, 253)` : 'white',
                      backgroundImage: activeFeature === key ? 'linear-gradient(rgba(var(--bs-primary-rgb), 0.05), rgba(var(--bs-primary-rgb), 0.05))' : 'none'
                    }}
                    onClick={() => handleFeatureClick(key)}
                  >
                    <Card.Body className="p-3">
                      <div className="d-flex align-items-center">
                        <div className={`flex-shrink-0 me-3 rounded-circle bg-${feature.color} bg-opacity-10 p-2`}>
                          <i className={`${feature.icon} text-${feature.color} fs-5`}></i>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1 fw-bold">{feature.title}</h6>
                          <small className="text-muted">{feature.description}</small>
                        </div>
                        {activeFeature === key && (
                          <motion.i
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="ri-check-line text-primary fs-5"
                          />
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Col>

          {/* Feature Display */}
          <Col lg={8}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="h-100 border-0 shadow-lg">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center mb-4">
                      <div className={`flex-shrink-0 me-3 rounded-circle bg-${features[activeFeature].color} p-3`}>
                        <i className={`${features[activeFeature].icon} text-white fs-3`}></i>
                      </div>
                      <div>
                        <h3 className="mb-1 fw-bold">{features[activeFeature].title}</h3>
                        <p className="text-muted mb-0">{features[activeFeature].description}</p>
                      </div>
                    </div>

                    <Row className="mb-4">
                      {features[activeFeature].benefits.map((benefit, index) => (
                        <Col md={4} key={index} className="mb-3">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-3 rounded-lg bg-${features[activeFeature].color} bg-opacity-10 text-center`}
                          >
                            <i className={`ri-check-line text-${features[activeFeature].color} fs-4 mb-2 d-block`}></i>
                            <small className="fw-semibold">{benefit}</small>
                          </motion.div>
                        </Col>
                      ))}
                    </Row>

                    <div className="text-center">
                      <Button
                        variant={features[activeFeature].color}
                        size="lg"
                        className="rounded-pill px-4"
                        onClick={handleStartDemo}
                      >
                        <i className="ri-play-circle-line me-2"></i>
                        Start Interactive Demo
                      </Button>
                    </div>

                    {/* Feature Preview */}
                    <div className="mt-4 p-4 bg-light rounded-lg">
                      <h6 className="fw-bold mb-3">Quick Preview:</h6>
                      <div className="demo-preview">
                        {features[activeFeature].demoData.steps.map((step, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.2 }}
                            className="d-flex align-items-center mb-2"
                          >
                            <Badge bg={features[activeFeature].color} className="me-2">
                              {index + 1}
                            </Badge>
                            <i className={`${step.icon} me-2 text-${features[activeFeature].color}`}></i>
                            <small className="fw-semibold">{step.title}</small>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </AnimatePresence>
          </Col>
        </Row>
      </div>

      {/* Demo Modal */}
      <Modal show={showDemo} onHide={() => setShowDemo(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{features[activeFeature].demoData.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <div className="demo-step-indicator mb-4">
              <div className="d-flex justify-content-center align-items-center">
                {features[activeFeature].demoData.steps.map((_, index) => (
                  <React.Fragment key={index}>
                    <div 
                      className={`rounded-circle d-flex align-items-center justify-content-center ${
                        index <= demoStep ? `bg-${features[activeFeature].color}` : 'bg-light'
                      }`}
                      style={{ width: '40px', height: '40px' }}
                    >
                      <span className={`fw-bold ${index <= demoStep ? 'text-white' : 'text-muted'}`}>
                        {index + 1}
                      </span>
                    </div>
                    {index < features[activeFeature].demoData.steps.length - 1 && (
                      <div 
                        className={`mx-3 ${index < demoStep ? `bg-${features[activeFeature].color}` : 'bg-light'}`}
                        style={{ width: '60px', height: '2px' }}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <motion.div
              key={demoStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="demo-step-content"
            >
              <div className={`mb-4 p-4 rounded-circle bg-${features[activeFeature].color} bg-opacity-10 d-inline-flex`}>
                <i className={`${features[activeFeature].demoData.steps[demoStep].icon} text-${features[activeFeature].color}`} style={{ fontSize: '3rem' }}></i>
              </div>
              <h4 className="fw-bold mb-3">{features[activeFeature].demoData.steps[demoStep].title}</h4>
              <p className="text-muted mb-4">{features[activeFeature].demoData.steps[demoStep].description}</p>
            </motion.div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowDemo(false)}>
            Close Demo
          </Button>
          <Button variant={features[activeFeature].color} onClick={nextDemoStep}>
            {demoStep < features[activeFeature].demoData.steps.length - 1 ? 'Next Step' : 'Complete Demo'}
            <i className="ri-arrow-right-line ms-2"></i>
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default InteractiveFeatureShowcase;
