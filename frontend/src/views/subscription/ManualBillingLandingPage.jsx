import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Alert, Nav, Modal } from 'react-bootstrap';

const ManualBillingLandingPage = () => {
  const [activeService, setActiveService] = useState('overview');
  const [showChatModal, setShowChatModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [emailForm, setEmailForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Contact Methods Functions
  const handleCallUs = () => {
    // Open phone dialer or show phone number
    const phoneNumber = '+1-800-HEALTHCARE'; // Replace with your actual number
    const businessHours = `Business Hours:
Monday - Friday: 8:00 AM - 6:00 PM EST
Saturday: 9:00 AM - 3:00 PM EST
Sunday: Closed`;

    if (navigator.userAgent.match(/iPhone|Android/i)) {
      // On mobile, directly dial
      window.location.href = `tel:${phoneNumber}`;
    } else {
      // On desktop, show modal with phone options
      const userChoice = confirm(`📞 Contact our sales team:
      
${phoneNumber}

${businessHours}

Click OK to copy the number to your clipboard, or Cancel to close.`);
      
      if (userChoice) {
        // Copy to clipboard
        navigator.clipboard.writeText(phoneNumber).then(() => {
          alert('Phone number copied to clipboard!');
        });
      }
    }
  };

  const handleWhatsApp = () => {
    const whatsappNumber = '1234567890'; // Replace with your WhatsApp business number
    const message = encodeURIComponent('Hi! I\'m interested in your monthly subscription plans for healthcare management. Can you help me choose the right plan?');
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleLiveChat = () => {
    setShowChatModal(true);
  };

  const handleEmailContact = () => {
    setShowEmailModal(true);
  };

  const sendChatMessage = () => {
    if (chatMessage.trim()) {
      // Here you would integrate with your chat service (Intercom, Zendesk, etc.)
      const responses = [
        "Thank you for your message! A customer service representative will be with you shortly.",
        "We've received your inquiry about our subscription plans. Our team will respond within 5 minutes.",
        "Thanks for reaching out! Our healthcare specialists are reviewing your message and will assist you soon."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      alert(`✅ ${randomResponse}`);
      setChatMessage('');
      setShowChatModal(false);
    } else {
      alert('Please enter a message before sending.');
    }
  };

  const sendEmail = () => {
    const { name, email, subject, message } = emailForm;
    if (name && email && subject && message) {
      // Create a comprehensive email
      const emailSubject = `[Healthcare Platform] ${subject}`;
      const emailBody = `Hello Healthcare Platform Team,

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This email was sent from the subscription page contact form.
Timestamp: ${new Date().toLocaleString()}`;

      const mailtoLink = `mailto:support@healthcare-platform.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      
      try {
        window.location.href = mailtoLink;
        alert('✅ Email client opened successfully! If your email client didn\'t open, please send an email to: support@healthcare-platform.com');
        setEmailForm({ name: '', email: '', subject: '', message: '' });
        setShowEmailModal(false);
      } catch (error) {
        // Fallback for when mailto doesn't work
        alert(`Please send an email to: support@healthcare-platform.com
        
Subject: ${emailSubject}
        
${emailBody}`);
      }
    } else {
      alert('Please fill in all required fields (marked with *)');
    }
  };

  // Monthly Subscription Plans
  const baseSubscription = {
    name: 'Base Healthcare Platform',
    price: 100,
    description: 'Essential healthcare management features',
    features: ['Patient Management', 'Basic Reporting', 'User Access Control', 'Data Backup']
  };

  const additionalFeatures = [
    {
      id: 'ai-diagnosis',
      name: 'AI Diagnosis Module',
      icon: '🤖',
      price: 100,
      unit: 'per month',
      description: 'Machine learning diagnostic support and analysis'
    },
    {
      id: 'radiology',
      name: 'Radiology Services',
      icon: '�',
      price: 100,
      unit: 'per month',
      description: 'Medical imaging management and analysis tools'
    },
    {
      id: 'lab-management',
      name: 'Laboratory Management',
      icon: '�',
      price: 100,
      unit: 'per month',
      description: 'Complete lab test management and reporting'
    },
    {
      id: 'telemedicine',
      name: 'Telemedicine Suite',
      icon: '�',
      price: 100,
      unit: 'per month',
      description: 'Virtual consultations and remote patient monitoring'
    },
    {
      id: 'appointment-advanced',
      name: 'Advanced Scheduling',
      icon: '📅',
      price: 100,
      unit: 'per month',
      description: 'Advanced appointment scheduling with automated reminders'
    },
    {
      id: 'analytics',
      name: 'Advanced Analytics',
      icon: '�',
      price: 100,
      unit: 'per month',
      description: 'Detailed reporting and business intelligence dashboards'
    }
  ];

  const subscriptionPackages = [
    {
      name: 'Starter Practice',
      monthlyPrice: 200,
      features: ['Base Platform', 'Advanced Scheduling'],
      regularPrice: 200,
      savings: 0,
      description: 'Perfect for small practices'
    },
    {
      name: 'Professional Practice',
      monthlyPrice: 350,
      features: ['Base Platform', 'AI Diagnosis', 'Advanced Scheduling', 'Telemedicine'],
      regularPrice: 400,
      savings: 50,
      description: 'Most popular for growing practices',
      popular: true
    },
    {
      name: 'Enterprise Practice',
      monthlyPrice: 500,
      features: ['Base Platform', 'All Additional Features', 'Priority Support'],
      regularPrice: 700,
      savings: 200,
      description: 'Complete solution for large practices'
    }
  ];

  return (
    <div style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section className="py-5" style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={10}>
              <h1 className="display-4 fw-bold mb-4">
                Professional Healthcare Platform
                <span className="d-block text-warning">Monthly Subscription Plans</span>
              </h1>
              <p className="lead mb-4">
                Flexible monthly subscriptions starting at $100. Add features as you need them for just $100 each per month.
                Simple, transparent pricing with no hidden fees.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap mb-4">
                <Badge bg="light" text="dark" className="px-3 py-2 fs-6">
                  <i className="ri-shield-check-line me-2"></i>HIPAA Compliant
                </Badge>
                <Badge bg="light" text="dark" className="px-3 py-2 fs-6">
                  <i className="ri-calculator-line me-2"></i>$100 Base + $100 per Feature
                </Badge>
                <Badge bg="light" text="dark" className="px-3 py-2 fs-6">
                  <i className="ri-hand-coin-line me-2"></i>No Setup Fees
                </Badge>
                <Badge bg="light" text="dark" className="px-3 py-2 fs-6">
                  <i className="ri-time-line me-2"></i>Cancel Anytime
                </Badge>
              </div>
              <Button variant="warning" size="lg" className="px-5">
                <i className="ri-phone-line me-2"></i>
                Start Monthly Subscription
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Quick Contact Bar */}
      <section className="py-3 bg-light border-bottom">
        <Container>
          <Row className="justify-content-center align-items-center">
            <Col lg={8} className="text-center">
              <span className="text-muted me-4">Need help choosing a plan?</span>
              <Button 
                variant="outline-primary" 
                size="sm" 
                className="me-2"
                onClick={handleCallUs}
              >
                <i className="ri-phone-line me-1"></i>Call Now
              </Button>
              <Button 
                variant="outline-success" 
                size="sm" 
                className="me-2"
                onClick={handleLiveChat}
              >
                <i className="ri-chat-3-line me-1"></i>Chat
              </Button>
              <Button 
                variant="outline-success" 
                size="sm" 
                className="me-2"
                onClick={handleWhatsApp}
              >
                <i className="ri-whatsapp-line me-1"></i>WhatsApp
              </Button>
              <Button 
                variant="outline-info" 
                size="sm"
                onClick={handleEmailContact}
              >
                <i className="ri-mail-line me-1"></i>Email
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Navigation */}
      <Container className="py-4">
        <Nav variant="pills" className="justify-content-center mb-4">
          <Nav.Item>
            <Nav.Link 
              active={activeService === 'overview'} 
              onClick={() => setActiveService('overview')}
            >
              <i className="ri-eye-line me-2"></i>Overview
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              active={activeService === 'services'} 
              onClick={() => setActiveService('services')}
            >
              <i className="ri-service-line me-2"></i>Services
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              active={activeService === 'packages'} 
              onClick={() => setActiveService('packages')}
            >
              <i className="ri-package-line me-2"></i>Packages
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              active={activeService === 'contact'} 
              onClick={() => setActiveService('contact')}
            >
              <i className="ri-phone-line me-2"></i>Contact
            </Nav.Link>
          </Nav.Item>
        </Nav>

        {/* Overview Tab */}
        {activeService === 'overview' && (
          <div>
            <Row className="justify-content-center mb-5">
              <Col lg={8} className="text-center">
                <h2 className="mb-4">Why Choose Our Monthly Subscription?</h2>
                <p className="lead text-muted">
                  Predictable monthly costs with the flexibility to add features as your practice grows.
                </p>
              </Col>
            </Row>

            <Row className="g-4 mb-5">
              <Col md={4}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="text-center p-4">
                    <div className="mb-3" style={{ fontSize: '3rem' }}>�</div>
                    <h5>Predictable Pricing</h5>
                    <p className="text-muted">$100 base subscription plus $100 for each additional feature you need.</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="text-center p-4">
                    <div className="mb-3" style={{ fontSize: '3rem' }}>🔧</div>
                    <h5>Flexible Features</h5>
                    <p className="text-muted">Start with basic features and add advanced modules as your practice grows.</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="text-center p-4">
                    <div className="mb-3" style={{ fontSize: '3rem' }}>�️</div>
                    <h5>Enterprise Security</h5>
                    <p className="text-muted">HIPAA compliant with enterprise-grade security included in all plans.</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col lg={10}>
                <Alert variant="info" className="border-0 shadow-sm">
                  <h5><i className="ri-information-line me-2"></i>How Monthly Subscriptions Work</h5>
                  <ol className="mb-0">
                    <li>Choose your base platform ($100/month) and select additional features</li>
                    <li>Each additional feature adds $100 to your monthly subscription</li>
                    <li>Access all features immediately upon subscription activation</li>
                    <li>Cancel or modify your subscription anytime with 30-day notice</li>
                  </ol>
                </Alert>
              </Col>
            </Row>
          </div>
        )}

        {/* Services Tab */}
        {activeService === 'services' && (
          <div>
            <Row className="mb-4">
              <Col lg={12} className="text-center">
                <h2>Subscription Plans & Features</h2>
                <p className="text-muted">Start with our base platform and add features as needed</p>
              </Col>
            </Row>

            {/* Base Subscription */}
            <Row className="mb-5">
              <Col lg={12}>
                <Card className="border-0 shadow-sm bg-primary text-white">
                  <Card.Body className="p-4">
                    <Row className="align-items-center">
                      <Col md={8}>
                        <h4 className="mb-2">{baseSubscription.name}</h4>
                        <p className="mb-2">{baseSubscription.description}</p>
                        <div className="d-flex flex-wrap gap-2">
                          {baseSubscription.features.map((feature, idx) => (
                            <Badge key={idx} bg="light" text="dark" className="px-2 py-1">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </Col>
                      <Col md={4} className="text-center">
                        <div className="h2 mb-1">${baseSubscription.price}</div>
                        <div className="small">per month</div>
                        <Button variant="warning" className="mt-2 px-4">
                          Start Base Plan
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Additional Features */}
            <Row className="mb-4">
              <Col lg={12}>
                <h4 className="text-center mb-4">Additional Features (+$100 each per month)</h4>
              </Col>
            </Row>

            <Row className="g-4">
              {additionalFeatures.map((feature, index) => (
                <Col lg={4} md={6} key={feature.id}>
                  <Card className="h-100 border-0 shadow-sm">
                    <Card.Body className="p-4">
                      <div className="text-center mb-3">
                        <div style={{ fontSize: '3rem' }}>{feature.icon}</div>
                      </div>
                      <h5 className="text-center mb-3">{feature.name}</h5>
                      <p className="text-muted text-center mb-3">{feature.description}</p>
                      
                      <div className="text-center mb-3">
                        <div className="h4 text-primary mb-1">
                          ${feature.price}
                        </div>
                        <small className="text-muted">{feature.unit}</small>
                      </div>

                      <Button variant="outline-primary" className="w-100">
                        Add Feature
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {/* Packages Tab */}
        {activeService === 'packages' && (
          <div>
            <Row className="mb-4">
              <Col lg={12} className="text-center">
                <h2>Subscription Packages</h2>
                <p className="text-muted">Save money with our bundled subscription packages</p>
              </Col>
            </Row>

            <Row className="g-4">
              {subscriptionPackages.map((pkg, index) => (
                <Col lg={4} key={index}>
                  <Card className={`h-100 border-0 shadow-sm ${pkg.popular ? 'border-warning' : ''}`}>
                    {pkg.popular && (
                      <div className="position-absolute top-0 start-50 translate-middle">
                        <Badge bg="warning" text="dark" className="px-3 py-2">
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <Card.Body className="p-4">
                      <h5 className="text-center mb-3">{pkg.name}</h5>
                      
                      <div className="text-center mb-4">
                        <div className="h2 text-primary mb-1">${pkg.monthlyPrice}</div>
                        <div className="small text-muted">per month</div>
                        {pkg.savings > 0 && (
                          <div className="text-success small">
                            Save ${pkg.savings}/month
                          </div>
                        )}
                      </div>

                      <div className="mb-4">
                        <p className="text-muted text-center">{pkg.description}</p>
                        
                        <h6 className="mt-3">Includes:</h6>
                        <ul className="list-unstyled">
                          {pkg.features.map((feature, idx) => (
                            <li key={idx} className="mb-2">
                              <i className="ri-check-line text-success me-2"></i>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button 
                        variant={pkg.popular ? "warning" : "outline-primary"} 
                        className="w-100"
                      >
                        Choose Plan
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            <Row className="mt-5">
              <Col lg={12}>
                <Alert variant="info" className="border-0 shadow-sm">
                  <h5><i className="ri-information-line me-2"></i>Custom Enterprise Solutions</h5>
                  <p className="mb-0">
                    Need more than 6 features? Contact us for custom enterprise pricing. 
                    We offer volume discounts for large practices and hospital systems.
                  </p>
                </Alert>
              </Col>
            </Row>
          </div>
        )}

        {/* Contact Tab */}
        {activeService === 'contact' && (
          <div>
            <Row className="justify-content-center">
              <Col lg={8}>
                <Card className="border-0 shadow-sm">
                  <Card.Body className="p-5">
                    <h2 className="text-center mb-4">Start Your Monthly Subscription</h2>
                    
                    <Alert variant="info" className="mb-4">
                      <i className="ri-information-line me-2"></i>
                      Complete this form to set up your monthly subscription. We'll contact you within 24 hours to activate your account.
                    </Alert>

                    <Form>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Doctor/Practice Name *</Form.Label>
                            <Form.Control type="text" required />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email Address *</Form.Label>
                            <Form.Control type="email" required />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Practice Type</Form.Label>
                            <Form.Select>
                              <option>Select Practice Type</option>
                              <option>Individual Practice</option>
                              <option>Small Clinic (2-5 doctors)</option>
                              <option>Medium Practice (6-20 doctors)</option>
                              <option>Large Practice (20+ doctors)</option>
                              <option>Hospital/Health System</option>
                              <option>Diagnostic Center</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control type="tel" />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-4">
                        <Form.Label>Desired Features (Base Platform + Additional Features)</Form.Label>
                        <Form.Control 
                          as="textarea" 
                          rows={4}
                          placeholder="Select from our features: AI Diagnosis, Radiology Services, Lab Management, Telemedicine, Advanced Scheduling, Advanced Analytics. Each additional feature is $100/month."
                        />
                      </Form.Group>

                      <div className="text-center">
                        <Button variant="primary" size="lg" className="px-5">
                          <i className="ri-send-plane-line me-2"></i>
                          Setup Monthly Subscription
                        </Button>
                      </div>
                    </Form>

                    <hr className="my-4" />

                    <div className="text-center">
                      <h5>Alternative Contact Methods</h5>
                      <div className="row mt-3">
                        <div className="col-lg-3 col-md-6 mb-3">
                          <Button 
                            variant="outline-primary" 
                            className="w-100"
                            onClick={handleCallUs}
                          >
                            <i className="ri-phone-line me-2"></i>
                            Call Us
                          </Button>
                          <small className="text-muted d-block mt-1">
                            Available 8 AM - 6 PM EST
                          </small>
                        </div>
                        <div className="col-lg-3 col-md-6 mb-3">
                          <Button 
                            variant="outline-info" 
                            className="w-100"
                            onClick={handleEmailContact}
                          >
                            <i className="ri-mail-line me-2"></i>
                            Email
                          </Button>
                          <small className="text-muted d-block mt-1">
                            Response within 2 hours
                          </small>
                        </div>
                        <div className="col-lg-3 col-md-6 mb-3">
                          <Button 
                            variant="outline-success" 
                            className="w-100"
                            onClick={handleLiveChat}
                          >
                            <i className="ri-chat-3-line me-2"></i>
                            Live Chat
                          </Button>
                          <small className="text-muted d-block mt-1">
                            Instant support
                          </small>
                        </div>
                        <div className="col-lg-3 col-md-6 mb-3">
                          <Button 
                            variant="outline-success" 
                            className="w-100"
                            onClick={handleWhatsApp}
                          >
                            <i className="ri-whatsapp-line me-2"></i>
                            WhatsApp
                          </Button>
                          <small className="text-muted d-block mt-1">
                            Chat on WhatsApp
                          </small>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Container>

      {/* Live Chat Modal */}
      <Modal show={showChatModal} onHide={() => setShowChatModal(false)} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            <i className="ri-chat-3-line me-2"></i>
            Live Chat Support
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <Alert variant="info" className="small">
              <i className="ri-information-line me-2"></i>
              Our support team is available to help you with subscription questions and technical support.
            </Alert>
          </div>
          <Form.Group>
            <Form.Label>Your Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Hi! I'm interested in learning more about your monthly subscription plans..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
            />
          </Form.Group>
          <div className="mt-3 text-muted small">
            <i className="ri-shield-check-line me-1"></i>
            Your conversation is encrypted and secure
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowChatModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={sendChatMessage}>
            <i className="ri-send-plane-line me-2"></i>
            Start Chat
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Email Contact Modal */}
      <Modal show={showEmailModal} onHide={() => setShowEmailModal(false)} centered size="lg">
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>
            <i className="ri-mail-line me-2"></i>
            Email Support
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <Alert variant="success" className="small">
              <i className="ri-time-line me-2"></i>
              We typically respond to emails within 2 hours during business hours.
            </Alert>
          </div>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Your Name *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Dr. John Smith"
                    value={emailForm.name}
                    onChange={(e) => setEmailForm({...emailForm, name: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address *</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="john.smith@example.com"
                    value={emailForm.email}
                    onChange={(e) => setEmailForm({...emailForm, email: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Subject *</Form.Label>
              <Form.Select
                value={emailForm.subject}
                onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
              >
                <option value="">Select a topic...</option>
                <option value="Subscription Inquiry">Subscription Plans Inquiry</option>
                <option value="Pricing Question">Pricing Questions</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Billing Support">Billing Support</option>
                <option value="General Inquiry">General Inquiry</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Message *</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Please describe your inquiry or question..."
                value={emailForm.message}
                onChange={(e) => setEmailForm({...emailForm, message: e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEmailModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={sendEmail}>
            <i className="ri-send-plane-line me-2"></i>
            Send Email
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Floating Contact Widget */}
      <div 
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <Button
          variant="primary"
          className="rounded-circle shadow-lg"
          style={{ width: '60px', height: '60px', padding: '0' }}
          onClick={handleLiveChat}
          title="Live Chat Support"
        >
          <i className="ri-chat-3-line" style={{ fontSize: '1.5rem' }}></i>
        </Button>
        <Button
          variant="success"
          className="rounded-circle shadow-lg"
          style={{ width: '50px', height: '50px', padding: '0' }}
          onClick={handleWhatsApp}
          title="WhatsApp Chat"
        >
          <i className="ri-whatsapp-line" style={{ fontSize: '1.2rem' }}></i>
        </Button>
        <Button
          variant="info"
          className="rounded-circle shadow-lg"
          style={{ width: '50px', height: '50px', padding: '0' }}
          onClick={handleCallUs}
          title="Call Us"
        >
          <i className="ri-phone-line" style={{ fontSize: '1.2rem' }}></i>
        </Button>
        <Button
          variant="warning"
          className="rounded-circle shadow-lg"
          style={{ width: '50px', height: '50px', padding: '0' }}
          onClick={handleEmailContact}
          title="Email Support"
        >
          <i className="ri-mail-line" style={{ fontSize: '1.2rem' }}></i>
        </Button>
      </div>
    </div>
  );
};

export default ManualBillingLandingPage;
