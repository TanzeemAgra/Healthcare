import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Alert, Table } from 'react-bootstrap';
import './ManualBilling.css';

const ManualBillingService = () => {
  const [activeTab, setActiveTab] = useState('services');
  const [selectedServices, setSelectedServices] = useState([]);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    practice: '',
    phone: '',
    message: ''
  });

  // Professional Medical Services with Pay-Per-Use Pricing
  const medicalServices = [
    {
      id: 'patient-management',
      category: 'Core Services',
      name: 'Patient Management System',
      description: 'Complete patient records, history, and management',
      icon: '👥',
      pricingModel: 'Per Patient Record',
      basePrice: 2.50,
      unit: 'per patient/month',
      features: [
        'Electronic Health Records (EHR)',
        'Patient Demographics',
        'Medical History Tracking',
        'Insurance Information',
        'HIPAA Compliant Storage'
      ]
    },
    {
      id: 'appointment-scheduling',
      category: 'Core Services', 
      name: 'Appointment Scheduling',
      description: 'Advanced scheduling with automated reminders',
      icon: '📅',
      pricingModel: 'Per Appointment',
      basePrice: 0.75,
      unit: 'per appointment',
      features: [
        'Online Booking System',
        'SMS/Email Reminders',
        'Calendar Integration',
        'No-Show Tracking',
        'Waiting List Management'
      ]
    },
    {
      id: 'ai-diagnosis',
      category: 'AI Services',
      name: 'AI-Powered Diagnosis Assistance',
      description: 'Machine learning diagnostic support',
      icon: '🤖',
      pricingModel: 'Per Analysis',
      basePrice: 15.00,
      unit: 'per AI analysis',
      features: [
        'Symptom Analysis',
        'Differential Diagnosis',
        'Treatment Recommendations',
        'Drug Interaction Checks',
        'Clinical Decision Support'
      ]
    },
    {
      id: 'radiology',
      category: 'Diagnostic Services',
      name: 'Radiology & Imaging',
      description: 'Medical imaging analysis and reporting',
      icon: '🔬',
      pricingModel: 'Per Image Study',
      basePrice: 25.00,
      unit: 'per imaging study',
      features: [
        'DICOM Image Viewing',
        'AI-Enhanced Analysis',
        'Automated Reporting',
        'Image Storage & Retrieval',
        'Radiologist Collaboration'
      ]
    },
    {
      id: 'pathology',
      category: 'Laboratory Services',
      name: 'Pathology & Lab Results',
      description: 'Laboratory test management and analysis',
      icon: '🧪',
      pricingModel: 'Per Lab Test',
      basePrice: 5.00,
      unit: 'per lab test',
      features: [
        'Lab Order Management',
        'Results Integration',
        'Reference Range Analysis',
        'Trend Monitoring',
        'Quality Control'
      ]
    },
    {
      id: 'consultation',
      category: 'Professional Services',
      name: 'Telemedicine Consultation',
      description: 'Virtual patient consultations',
      icon: '💻',
      pricingModel: 'Per Consultation',
      basePrice: 8.00,
      unit: 'per consultation session',
      features: [
        'HD Video Calling',
        'Screen Sharing',
        'Session Recording',
        'Digital Prescriptions',
        'Secure Communication'
      ]
    }
  ];

  // Service Packages for bulk discounts
  const servicePackages = [
    {
      id: 'basic-practice',
      name: 'Basic Practice Package',
      description: 'Essential services for small practices',
      monthlyCommitment: 500,
      discount: '15%',
      includedServices: ['patient-management', 'appointment-scheduling'],
      estimatedSavings: 75
    },
    {
      id: 'comprehensive-care',
      name: 'Comprehensive Care Package', 
      description: 'Full-service medical practice solution',
      monthlyCommitment: 1200,
      discount: '25%',
      includedServices: ['patient-management', 'appointment-scheduling', 'ai-diagnosis', 'consultation'],
      estimatedSavings: 300
    },
    {
      id: 'diagnostic-center',
      name: 'Diagnostic Center Package',
      description: 'Specialized for diagnostic and imaging centers',
      monthlyCommitment: 2000,
      discount: '30%',
      includedServices: ['radiology', 'pathology', 'ai-diagnosis'],
      estimatedSavings: 600
    }
  ];

  const handleServiceToggle = (serviceId) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const calculateEstimatedCost = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = medicalServices.find(s => s.id === serviceId);
      return total + (service ? service.basePrice * 100 : 0); // Estimate 100 units per month
    }, 0);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Handle manual billing contact form submission
    alert('Thank you! Our billing team will contact you within 24 hours to set up your custom billing arrangement.');
  };

  return (
    <div className="manual-billing-service">
      {/* Hero Section */}
      <section className="hero-section bg-gradient-primary text-white py-5">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={10}>
              <h1 className="display-4 fw-bold mb-4">
                Professional Medical Services
                <span className="d-block text-warning">Pay-Per-Use Billing</span>
              </h1>
              <p className="lead mb-4">
                No subscriptions, no long-term commitments. Pay only for the medical services you actually use. 
                Perfect for doctors who want full control over their technology costs.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Badge bg="light" text="dark" className="px-3 py-2 fs-6">
                  <i className="ri-shield-check-line me-2"></i>HIPAA Compliant
                </Badge>
                <Badge bg="light" text="dark" className="px-3 py-2 fs-6">
                  <i className="ri-calculator-line me-2"></i>Transparent Pricing
                </Badge>
                <Badge bg="light" text="dark" className="px-3 py-2 fs-6">
                  <i className="ri-hand-coin-line me-2"></i>No Hidden Fees
                </Badge>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Navigation Tabs */}
      <Container className="my-5">
        <Row className="justify-content-center mb-4">
          <Col lg={8}>
            <div className="nav-tabs-wrapper d-flex justify-content-center">
              <Button 
                variant={activeTab === 'services' ? 'primary' : 'outline-primary'}
                onClick={() => setActiveTab('services')}
                className="me-3"
              >
                <i className="ri-service-line me-2"></i>Medical Services
              </Button>
              <Button 
                variant={activeTab === 'packages' ? 'primary' : 'outline-primary'}
                onClick={() => setActiveTab('packages')}
                className="me-3"
              >
                <i className="ri-package-line me-2"></i>Service Packages
              </Button>
              <Button 
                variant={activeTab === 'contact' ? 'primary' : 'outline-primary'}
                onClick={() => setActiveTab('contact')}
              >
                <i className="ri-phone-line me-2"></i>Setup Billing
              </Button>
            </div>
          </Col>
        </Row>

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div>
            <Row className="mb-4">
              <Col lg={12} className="text-center">
                <h2 className="mb-3">Choose Your Medical Services</h2>
                <p className="text-muted">Select the professional medical services you need. Pay only for what you use.</p>
              </Col>
            </Row>
            
            <Row>
              {medicalServices.map((service, index) => (
                <Col lg={6} xl={4} key={service.id} className="mb-4">
                  <Card className={`h-100 service-card ${selectedServices.includes(service.id) ? 'selected' : ''}`}>
                    <Card.Body className="p-4">
                      <div className="text-center mb-3">
                        <div className="service-icon" style={{fontSize: '3rem'}}>{service.icon}</div>
                        <Badge bg="secondary" className="mt-2">{service.category}</Badge>
                      </div>
                      
                      <h5 className="text-center mb-3">{service.name}</h5>
                      <p className="text-muted small text-center mb-3">{service.description}</p>
                      
                      <div className="pricing-info text-center mb-3">
                        <div className="price-display">
                          <span className="currency">$</span>
                          <span className="amount">{service.basePrice}</span>
                          <span className="unit">/{service.unit}</span>
                        </div>
                        <Badge bg="info" className="pricing-model">{service.pricingModel}</Badge>
                      </div>

                      <ul className="feature-list mb-4">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="small text-muted">
                            <i className="ri-check-line text-success me-2"></i>{feature}
                          </li>
                        ))}
                      </ul>

                      <Button 
                        variant={selectedServices.includes(service.id) ? 'success' : 'outline-primary'}
                        className="w-100"
                        onClick={() => handleServiceToggle(service.id)}
                      >
                        {selectedServices.includes(service.id) ? (
                          <>
                            <i className="ri-check-line me-2"></i>Selected
                          </>
                        ) : (
                          <>
                            <i className="ri-add-line me-2"></i>Add Service
                          </>
                        )}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {selectedServices.length > 0 && (
              <Card className="mt-4 bg-light">
                <Card.Body>
                  <h5>Selected Services Summary</h5>
                  <p>Estimated monthly cost (based on 100 units per service): <strong>${calculateEstimatedCost().toFixed(2)}</strong></p>
                  <Button variant="primary" onClick={() => setActiveTab('contact')}>
                    Setup Custom Billing <i className="ri-arrow-right-line ms-2"></i>
                  </Button>
                </Card.Body>
              </Card>
            )}
          </div>
        )}

        {/* Packages Tab */}
        {activeTab === 'packages' && (
          <div>
            <Row className="mb-4">
              <Col lg={12} className="text-center">
                <h2 className="mb-3">Service Packages</h2>
                <p className="text-muted">Get bulk discounts with our pre-configured service packages</p>
              </Col>
            </Row>
            
            <Row>
              {servicePackages.map((pkg, index) => (
                <Col lg={4} key={pkg.id} className="mb-4">
                  <Card className="h-100 package-card">
                    <Card.Body className="p-4">
                      <h5 className="text-center mb-3">{pkg.name}</h5>
                      <p className="text-muted text-center mb-3">{pkg.description}</p>
                      
                      <div className="text-center mb-3">
                        <Badge bg="success" className="fs-6 px-3 py-2">{pkg.discount} Discount</Badge>
                      </div>

                      <div className="package-details mb-4">
                        <p><strong>Monthly Commitment:</strong> ${pkg.monthlyCommitment}</p>
                        <p><strong>Estimated Savings:</strong> ${pkg.estimatedSavings}/month</p>
                        
                        <h6 className="mt-3">Included Services:</h6>
                        <ul className="list-unstyled">
                          {pkg.includedServices.map(serviceId => {
                            const service = medicalServices.find(s => s.id === serviceId);
                            return service ? (
                              <li key={serviceId} className="mb-1">
                                <i className="ri-check-line text-success me-2"></i>
                                {service.name}
                              </li>
                            ) : null;
                          })}
                        </ul>
                      </div>

                      <Button variant="outline-primary" className="w-100">
                        Request Package Details
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {/* Contact/Setup Tab */}
        {activeTab === 'contact' && (
          <div>
            <Row className="justify-content-center">
              <Col lg={8}>
                <Card>
                  <Card.Header className="bg-primary text-white">
                    <h4 className="mb-0">Setup Your Custom Billing</h4>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <Alert variant="info">
                      <i className="ri-information-line me-2"></i>
                      Our billing team will work with you to create a custom payment arrangement that fits your practice needs. 
                      No automatic charges, no surprise fees.
                    </Alert>

                    <Form onSubmit={handleContactSubmit}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Doctor/Practice Name *</Form.Label>
                            <Form.Control 
                              type="text" 
                              required
                              value={contactForm.name}
                              onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email Address *</Form.Label>
                            <Form.Control 
                              type="email" 
                              required
                              value={contactForm.email}
                              onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Practice/Institution</Form.Label>
                            <Form.Control 
                              type="text"
                              value={contactForm.practice}
                              onChange={(e) => setContactForm({...contactForm, practice: e.target.value})}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control 
                              type="tel"
                              value={contactForm.phone}
                              onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-4">
                        <Form.Label>Services Needed & Special Requirements</Form.Label>
                        <Form.Control 
                          as="textarea" 
                          rows={4}
                          placeholder="Tell us about your practice needs, expected usage, and any special billing requirements..."
                          value={contactForm.message}
                          onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                        />
                      </Form.Group>

                      <div className="text-center">
                        <Button type="submit" variant="primary" size="lg">
                          <i className="ri-send-plane-line me-2"></i>
                          Request Custom Billing Setup
                        </Button>
                      </div>
                    </Form>

                    <hr className="my-4" />

                    <div className="billing-benefits">
                      <h5>Manual Billing Benefits:</h5>
                      <Row>
                        <Col md={6}>
                          <ul className="list-unstyled">
                            <li><i className="ri-check-line text-success me-2"></i>No automatic charges</li>
                            <li><i className="ri-check-line text-success me-2"></i>Flexible payment terms</li>
                            <li><i className="ri-check-line text-success me-2"></i>Usage-based pricing</li>
                          </ul>
                        </Col>
                        <Col md={6}>
                          <ul className="list-unstyled">
                            <li><i className="ri-check-line text-success me-2"></i>Custom invoicing</li>
                            <li><i className="ri-check-line text-success me-2"></i>Volume discounts available</li>
                            <li><i className="ri-check-line text-success me-2"></i>HIPAA compliant billing</li>
                          </ul>
                        </Col>
                      </Row>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Container>
    </div>
  );
};

export default ManualBillingService;
