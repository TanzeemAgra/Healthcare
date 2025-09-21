import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Badge, Modal, ListGroup, Accordion } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';

const SupportCenter = () => {
  const [activeTab, setActiveTab] = useState('contact');
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    priority: 'medium',
    category: 'general',
    message: '',
    attachment: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Support categories and contact information
  const supportContacts = [
    {
      title: "General Support",
      email: "support@xerxez.in",
      icon: "ri-customer-service-2-line",
      color: "primary",
      description: "General questions, account help, billing inquiries",
      hours: "Monday-Friday, 9:00 AM - 6:00 PM IST",
      responseTime: "Within 24 hours"
    },
    {
      title: "Technical Issues",
      email: "technical@xerxez.in",
      icon: "ri-tools-line",
      color: "info",
      description: "Platform bugs, login issues, performance problems",
      hours: "24/7 Emergency Support Available",
      responseTime: "Within 4 hours"
    },
    {
      title: "HIPAA Compliance",
      email: "hipaa@xerxez.in",
      icon: "ri-shield-check-line",
      color: "success",
      description: "Privacy concerns, HIPAA compliance questions",
      hours: "Monday-Friday, 9:00 AM - 5:00 PM IST",
      responseTime: "Within 2 hours"
    },
    {
      title: "Security Issues",
      email: "security@xerxez.in",
      icon: "ri-shield-keyhole-line",
      color: "danger",
      description: "Security incidents, data breaches, suspicious activity",
      hours: "24/7 Emergency Response",
      responseTime: "Immediate"
    },
    {
      title: "GDPR Requests",
      email: "gdpr@xerxez.in",
      icon: "ri-global-line",
      color: "warning",
      description: "Data protection rights, privacy requests",
      hours: "Monday-Friday, 9:00 AM - 5:00 PM IST",
      responseTime: "Within 30 days"
    },
    {
      title: "Business Partnerships",
      email: "partnerships@xerxez.in",
      icon: "ri-handshake-line",
      color: "secondary",
      description: "Partnership inquiries, business development",
      hours: "Monday-Friday, 10:00 AM - 4:00 PM IST",
      responseTime: "Within 3 business days"
    }
  ];

  const faqData = [
    {
      category: "Account & Billing",
      questions: [
        {
          question: "How do I reset my password?",
          answer: "Go to the login page and click 'Forgot Password'. Enter your email address and we'll send you a reset link. For additional security, HIPAA-compliant users may need to verify their identity through additional steps."
        },
        {
          question: "How do I change my subscription plan?",
          answer: "Log into your account, go to Settings > Subscription, and select 'Change Plan'. You can upgrade or downgrade at any time. Changes take effect immediately for upgrades, or at the next billing cycle for downgrades."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, MasterCard, American Express) through our secure Razorpay integration. All payment data is encrypted and PCI DSS compliant."
        }
      ]
    },
    {
      category: "Privacy & Security",
      questions: [
        {
          question: "Is my health data secure?",
          answer: "Yes. We are HIPAA compliant and use bank-level security including AES-256 encryption, multi-factor authentication, and regular security audits. All data is stored in SOC 2 Type II certified data centers."
        },
        {
          question: "Who can access my medical information?",
          answer: "Only you and your authorized healthcare providers can access your medical information. We never share PHI with third parties without your explicit consent, except as required by law."
        },
        {
          question: "How do I delete my account and data?",
          answer: "Contact privacy@xerxez.in to request account deletion. We'll permanently delete your data within 30 days, subject to legal retention requirements for medical records."
        }
      ]
    },
    {
      category: "AI Features",
      questions: [
        {
          question: "How accurate is Dr. Max AI?",
          answer: "Dr. Max AI is designed to assist healthcare professionals and provide educational information. It should not replace professional medical judgment. All AI-generated content should be reviewed by qualified healthcare providers."
        },
        {
          question: "Can I trust AI diagnosis suggestions?",
          answer: "Our AI tools are assistive technologies designed to support, not replace, professional medical diagnosis. Always consult with qualified healthcare providers for medical decisions."
        }
      ]
    }
  ];

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Simulate API call for ticket submission
      // In real implementation, this would call your backend API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate successful submission
      setMessageType('success');
      setSubmitMessage(`Support ticket submitted successfully! Ticket ID: #${Date.now()}. You'll receive an email confirmation shortly.`);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        priority: 'medium',
        category: 'general',
        message: '',
        attachment: null
      });
      
      setShowTicketModal(false);
    } catch (error) {
      setMessageType('danger');
      setSubmitMessage('Failed to submit support ticket. Please try again or contact us directly via email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendDirectEmail = (contact) => {
    const subject = encodeURIComponent(`Support Request - ${contact.title}`);
    const body = encodeURIComponent(`Dear ${contact.title} Team,

I need assistance with:

[Please describe your issue here]

Account Email: 
Issue Type: 
Priority: 

Thank you for your support.

Best regards,
[Your Name]`);
    
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col lg={12}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-5"
          >
            <div 
              className="mx-auto mb-4 rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              <i className="ri-customer-service-2-line text-white fs-1"></i>
            </div>
            <h1 className="display-5 fw-bold mb-3">Support Center</h1>
            <p className="lead text-muted mb-4">
              Get help with your healthcare platform. We're here to assist you 24/7.
            </p>
            <div className="d-flex gap-2 justify-content-center flex-wrap">
              <Badge bg="primary" className="px-3 py-2">
                <i className="ri-time-line me-1"></i>24/7 Emergency Support
              </Badge>
              <Badge bg="success" className="px-3 py-2">
                <i className="ri-shield-check-line me-1"></i>HIPAA Compliant
              </Badge>
              <Badge bg="info" className="px-3 py-2">
                <i className="ri-customer-service-2-line me-1"></i>Expert Healthcare Support
              </Badge>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <Row className="mb-5">
            <Col lg={4} className="mb-3">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div 
                    className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: '60px', height: '60px', backgroundColor: '#e3f2fd' }}
                  >
                    <i className="ri-mail-send-line text-primary fs-3"></i>
                  </div>
                  <h5>Send Email</h5>
                  <p className="text-muted">Quick email to our support team</p>
                  <Button 
                    variant="primary" 
                    onClick={() => sendDirectEmail({ email: 'support@xerxez.in', title: 'Support' })}
                  >
                    <i className="ri-mail-line me-2"></i>Email Support
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} className="mb-3">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div 
                    className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: '60px', height: '60px', backgroundColor: '#f3e5f5' }}
                  >
                    <i className="ri-ticket-line text-purple fs-3"></i>
                  </div>
                  <h5>Submit Ticket</h5>
                  <p className="text-muted">Detailed support request with tracking</p>
                  <Button 
                    variant="outline-primary" 
                    onClick={() => setShowTicketModal(true)}
                  >
                    <i className="ri-add-line me-2"></i>Create Ticket
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} className="mb-3">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div 
                    className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: '60px', height: '60px', backgroundColor: '#fff3e0' }}
                  >
                    <i className="ri-phone-line text-warning fs-3"></i>
                  </div>
                  <h5>Emergency Support</h5>
                  <p className="text-muted">24/7 support for critical issues</p>
                  <Button 
                    variant="danger" 
                    href="tel:+1-800-XERXEZ"
                  >
                    <i className="ri-phone-line me-2"></i>Call Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Support Contacts */}
          <Card className="mb-5 border-0 shadow-sm">
            <Card.Header className="bg-light border-0 py-4">
              <h3 className="mb-0">
                <i className="ri-contacts-line me-2"></i>Contact Our Expert Teams
              </h3>
            </Card.Header>
            <Card.Body className="p-4">
              <Row>
                {supportContacts.map((contact, index) => (
                  <Col lg={6} className="mb-4" key={index}>
                    <div className="d-flex align-items-start p-3 border rounded-3 h-100">
                      <div 
                        className={`me-3 rounded-circle d-flex align-items-center justify-content-center bg-${contact.color}-subtle`}
                        style={{ width: '50px', height: '50px', minWidth: '50px' }}
                      >
                        <i className={`${contact.icon} text-${contact.color} fs-4`}></i>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{contact.title}</h6>
                        <p className="text-muted small mb-2">{contact.description}</p>
                        <div className="mb-2">
                          <small className="text-muted">
                            <i className="ri-time-line me-1"></i>{contact.hours}
                          </small>
                        </div>
                        <div className="mb-3">
                          <small className="text-muted">
                            <i className="ri-timer-line me-1"></i>Response: {contact.responseTime}
                          </small>
                        </div>
                        <div className="d-flex gap-2">
                          <Button 
                            size="sm" 
                            variant={`outline-${contact.color}`}
                            onClick={() => sendDirectEmail(contact)}
                          >
                            <i className="ri-mail-line me-1"></i>Email
                          </Button>
                          <Button 
                            size="sm" 
                            variant={contact.color}
                            href={`mailto:${contact.email}`}
                          >
                            {contact.email}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>

          {/* FAQ Section */}
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-light border-0 py-4">
              <h3 className="mb-0">
                <i className="ri-question-answer-line me-2"></i>Frequently Asked Questions
              </h3>
            </Card.Header>
            <Card.Body className="p-4">
              <Accordion defaultActiveKey="0">
                {faqData.map((category, categoryIndex) => (
                  <Accordion.Item eventKey={categoryIndex.toString()} key={categoryIndex}>
                    <Accordion.Header>
                      <i className="ri-folder-line me-2"></i>{category.category}
                    </Accordion.Header>
                    <Accordion.Body>
                      {category.questions.map((faq, faqIndex) => (
                        <div key={faqIndex} className={faqIndex > 0 ? "mt-4 pt-4 border-top" : ""}>
                          <h6 className="text-primary mb-2">
                            <i className="ri-question-line me-2"></i>{faq.question}
                          </h6>
                          <p className="text-muted mb-0" style={{ lineHeight: '1.6' }}>
                            {faq.answer}
                          </p>
                        </div>
                      ))}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Card.Body>
          </Card>

          {/* Success/Error Messages */}
          <AnimatePresence>
            {submitMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-4"
              >
                <Alert 
                  variant={messageType} 
                  dismissible 
                  onClose={() => setSubmitMessage('')}
                >
                  <Alert.Heading>
                    <i className={`ri-${messageType === 'success' ? 'check' : 'alert'}-circle-line me-2`}></i>
                    {messageType === 'success' ? 'Success!' : 'Error'}
                  </Alert.Heading>
                  {submitMessage}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
        </Col>
      </Row>

      {/* Support Ticket Modal */}
      <Modal show={showTicketModal} onHide={() => setShowTicketModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title>
            <i className="ri-ticket-line me-2"></i>Submit Support Ticket
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
          <Form onSubmit={handleSubmitTicket}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="your.email@example.com"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="general">General Support</option>
                    <option value="technical">Technical Issues</option>
                    <option value="billing">Billing & Subscription</option>
                    <option value="privacy">Privacy & HIPAA</option>
                    <option value="security">Security Concerns</option>
                    <option value="feature">Feature Request</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Priority *</Form.Label>
                  <Form.Select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="low">Low - General inquiry</option>
                    <option value="medium">Medium - Standard issue</option>
                    <option value="high">High - Urgent issue</option>
                    <option value="critical">Critical - System down</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Subject *</Form.Label>
              <Form.Control
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                placeholder="Brief description of your issue"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Message *</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                placeholder="Please provide detailed information about your issue..."
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Attachment (Optional)</Form.Label>
              <Form.Control
                type="file"
                name="attachment"
                onChange={handleInputChange}
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
              />
              <Form.Text className="text-muted">
                Supported formats: JPG, PNG, PDF, DOC, DOCX (Max 10MB)
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button 
                variant="outline-secondary" 
                onClick={() => setShowTicketModal(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="ri-send-plane-line me-2"></i>Submit Ticket
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default SupportCenter;
