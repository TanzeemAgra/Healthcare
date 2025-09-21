import React, { useState } from 'react';
import { Button, Modal, Form, Badge, Alert } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingSupportButton = ({ 
  position = 'bottom-right', 
  showOnPages = 'all',
  customStyle = {}
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showQuickEmail, setShowQuickEmail] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    message: '',
    type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const supportOptions = [
    {
      title: "Quick Email",
      description: "Send a quick message to our support team",
      icon: "ri-mail-send-line",
      color: "primary",
      action: () => setShowQuickEmail(true)
    },
    {
      title: "Emergency Support", 
      description: "24/7 support for critical issues",
      icon: "ri-phone-line",
      color: "danger",
      action: () => window.open('tel:+1-800-XERXEZ')
    },
    {
      title: "HIPAA Support",
      description: "Privacy and compliance questions",
      icon: "ri-shield-check-line", 
      color: "success",
      action: () => sendDirectEmail('hipaa@xerxez.in', 'HIPAA Compliance')
    },
    {
      title: "Technical Issues",
      description: "Platform bugs and technical problems",
      icon: "ri-tools-line",
      color: "info", 
      action: () => sendDirectEmail('technical@xerxez.in', 'Technical Issue')
    },
    {
      title: "Support Center",
      description: "Visit our complete support center",
      icon: "ri-customer-service-2-line",
      color: "secondary",
      action: () => window.open('/support', '_blank')
    }
  ];

  const sendDirectEmail = (email, subject) => {
    const emailSubject = encodeURIComponent(`${subject} - Support Request`);
    const emailBody = encodeURIComponent(`Dear Support Team,

I need assistance with:

[Please describe your issue here]

Platform: Healthcare Solution
Page: ${window.location.pathname}
User Agent: ${navigator.userAgent}

Thank you for your support.

Best regards,
[Your Name]`);
    
    window.location.href = `mailto:${email}?subject=${emailSubject}&body=${emailBody}`;
    setShowModal(false);
  };

  const handleQuickEmail = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitMessage('Your message has been sent successfully! We\'ll respond within 24 hours.');
      setFormData({ email: '', message: '', type: 'general' });
      
      setTimeout(() => {
        setShowQuickEmail(false);
        setSubmitMessage('');
      }, 3000);
    } catch (error) {
      setSubmitMessage('Failed to send message. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPositionStyles = () => {
    const baseStyles = {
      position: 'fixed',
      zIndex: 1050,
      ...customStyle
    };

    switch (position) {
      case 'bottom-left':
        return { ...baseStyles, bottom: '30px', left: '30px' };
      case 'bottom-right':
        return { ...baseStyles, bottom: '30px', right: '30px' };
      case 'top-right':
        return { ...baseStyles, top: '30px', right: '30px' };
      case 'top-left':
        return { ...baseStyles, top: '30px', left: '30px' };
      default:
        return { ...baseStyles, bottom: '30px', right: '30px' };
    }
  };

  return (
    <>
      {/* Floating Support Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2 }}
        style={getPositionStyles()}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="lg"
            className="rounded-circle shadow-lg border-0 position-relative"
            style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={() => setShowModal(true)}
          >
            <motion.i
              className="ri-customer-service-2-line fs-4"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <Badge 
              bg="danger" 
              className="position-absolute top-0 start-100 translate-middle rounded-pill"
              style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
            >
              24/7
            </Badge>
          </Button>
        </motion.div>
      </motion.div>

      {/* Support Options Modal */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        centered
        className="support-modal"
      >
        <Modal.Header closeButton className="border-0 pb-2">
          <Modal.Title>
            <div className="d-flex align-items-center">
              <div 
                className="me-3 rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                <i className="ri-customer-service-2-line text-white"></i>
              </div>
              <div>
                <h5 className="mb-0">How can we help?</h5>
                <small className="text-muted">Choose the best way to reach us</small>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-3">
          <div className="d-grid gap-3">
            {supportOptions.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant="outline-light"
                  className="w-100 p-3 text-start border-0 shadow-sm"
                  style={{ backgroundColor: '#f8f9fa' }}
                  onClick={option.action}
                >
                  <div className="d-flex align-items-center">
                    <div 
                      className={`me-3 rounded-circle d-flex align-items-center justify-content-center bg-${option.color}-subtle`}
                      style={{ width: '40px', height: '40px' }}
                    >
                      <i className={`${option.icon} text-${option.color}`}></i>
                    </div>
                    <div>
                      <h6 className="mb-1 text-dark">{option.title}</h6>
                      <small className="text-muted">{option.description}</small>
                    </div>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-light rounded">
            <h6 className="mb-2">
              <i className="ri-time-line me-2"></i>Support Hours
            </h6>
            <div className="small text-muted">
              <div>📧 Email Support: 24/7</div>
              <div>📞 Phone Support: 24/7 Emergency</div>
              <div>💬 Live Chat: Mon-Fri 9AM-6PM IST</div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Quick Email Modal */}
      <Modal 
        show={showQuickEmail} 
        onHide={() => setShowQuickEmail(false)} 
        centered
      >
        <Modal.Header closeButton className="border-0 pb-2">
          <Modal.Title>
            <i className="ri-mail-send-line me-2"></i>Quick Support Message
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {submitMessage ? (
            <Alert variant={submitMessage.includes('successfully') ? 'success' : 'danger'}>
              <i className={`ri-${submitMessage.includes('successfully') ? 'check' : 'alert'}-circle-line me-2`}></i>
              {submitMessage}
            </Alert>
          ) : (
            <Form onSubmit={handleQuickEmail}>
              <Form.Group className="mb-3">
                <Form.Label>Your Email</Form.Label>
                <Form.Control
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="your.email@example.com"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Issue Type</Form.Label>
                <Form.Select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="general">General Question</option>
                  <option value="technical">Technical Issue</option>
                  <option value="billing">Billing Question</option>
                  <option value="privacy">Privacy Concern</option>
                  <option value="emergency">Emergency Issue</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Please describe your issue or question..."
                  required
                />
              </Form.Group>

              <div className="d-flex gap-2 justify-content-end">
                <Button 
                  variant="outline-secondary" 
                  onClick={() => setShowQuickEmail(false)}
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
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="ri-send-plane-line me-2"></i>Send Message
                    </>
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      {/* Custom Styles */}
      <style jsx>{`
        .support-modal .modal-content {
          border: none;
          border-radius: 15px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }
        
        .support-modal .btn:hover {
          transform: translateY(-2px);
          transition: all 0.2s ease;
        }
      `}</style>
    </>
  );
};

export default FloatingSupportButton;
