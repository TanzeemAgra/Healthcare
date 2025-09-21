import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, InputGroup, Dropdown } from 'react-bootstrap';
import { 
  RiFacebookFill, 
  RiTwitterFill, 
  RiInstagramFill, 
  RiWhatsappFill, 
  RiMailFill, 
  RiGoogleFill, 
  RiMoonFill, 
  RiSunFill 
} from '@remixicon/react';
import { contactAPI } from '../../services/api';

const departments = [
  'General Inquiry',
  'Support',
  'Sales',
  'Feedback',
  'Careers',
];
const countries = [
  'India', 'USA', 'UK', 'Canada', 'Australia', 'Other'
];

// Soft-coded styling configuration for form controls
const FORM_STYLES = {
  checkbox: {
    size: '1.2rem',
    borderWidth: '2px',
    borderRadius: '4px',
    checkedColor: '#667eea',
    hoverColor: '#5a6fd8',
    focusColor: '#667eea',
    borderColor: '#ced4da',
    activeBorderColor: '#667eea'
  },
  radio: {
    size: '1.2rem',
    borderWidth: '2px',
    checkedColor: '#667eea',
    hoverColor: '#5a6fd8',
    focusColor: '#667eea',
    borderColor: '#ced4da',
    activeBorderColor: '#667eea'
  },
  label: {
    fontSize: '0.95rem',
    fontWeight: '500',
    color: '#495057',
    marginLeft: '0.5rem'
  }
};

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    country: '',
    contactMethod: '',
    subject: '',
    message: '',
    newsletter: false,
    termsAccepted: false,
    file: null
  });

  // Enhanced form control components for better visibility
  const EnhancedRadio = ({ name, value, checked, onChange, label, id }) => {
    return (
      <div className="custom-radio-container" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginRight: '20px',
        marginBottom: '10px',
        cursor: 'pointer'
      }}>
        <div 
          className="custom-radio-circle"
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            border: '2px solid #667eea',
            backgroundColor: checked ? '#667eea' : 'white',
            marginRight: '8px',
            position: 'relative',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
          }}
          onClick={() => onChange({ target: { name, value, type: 'radio' }})}
        >
          {checked && (
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'white',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }} />
          )}
        </div>
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          style={{ display: 'none' }}
        />
        <label 
          htmlFor={id} 
          style={{ 
            margin: 0, 
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            color: '#495057'
          }}
          onClick={() => onChange({ target: { name, value, type: 'radio' }})}
        >
          {label}
        </label>
      </div>
    );
  };

  const EnhancedCheckbox = ({ name, checked, onChange, label, id, required = false }) => {
    return (
      <div className="custom-checkbox-container" style={{ 
        display: 'flex', 
        alignItems: 'flex-start',
        marginBottom: '15px',
        cursor: 'pointer'
      }}>
        <div 
          className="custom-checkbox-square"
          style={{
            width: '20px',
            height: '20px',
            border: '2px solid #667eea',
            backgroundColor: checked ? '#667eea' : 'white',
            marginRight: '10px',
            marginTop: '2px',
            position: 'relative',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            borderRadius: '3px'
          }}
          onClick={() => onChange({ target: { name, type: 'checkbox', checked: !checked }})}
        >
          {checked && (
            <svg 
              width="12" 
              height="9" 
              viewBox="0 0 12 9" 
              fill="none"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            >
              <path
                d="M1 4.5L4 7.5L11 1"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        <input
          type="checkbox"
          id={id}
          name={name}
          checked={checked}
          onChange={onChange}
          style={{ display: 'none' }}
          required={required}
        />
        <label 
          htmlFor={id} 
          style={{ 
            margin: 0, 
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            color: '#495057',
            lineHeight: '1.5'
          }}
          onClick={() => onChange({ target: { name, type: 'checkbox', checked: !checked }})}
        >
          {label}
          {required && <span style={{ color: '#dc3545', marginLeft: '4px' }}>*</span>}
        </label>
      </div>
    );
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    console.log('Form change:', { name, value, type, checked }); // Debug log
    
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleQuillChange = (value) => {
    setForm(prev => ({ ...prev, message: value }));
    if (errors.message) {
      setErrors(prev => ({ ...prev, message: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = 'Name is required';
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email is invalid';
    if (!form.phone) newErrors.phone = 'Phone is required';
    if (!form.department) newErrors.department = 'Department is required';
    if (!form.country) newErrors.country = 'Country is required';
    if (!form.contactMethod) newErrors.contactMethod = 'Contact method is required';
    if (!form.subject) newErrors.subject = 'Subject is required';
    if (!form.message) newErrors.message = 'Message is required';
    if (!form.termsAccepted) newErrors.termsAccepted = 'You must accept the terms and conditions';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({}); // Clear previous errors
    
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key === 'file' && form[key]) {
          formData.append('file', form[key]);
        } else {
          formData.append(key, form[key]);
        }
      });

      console.log('Submitting contact form...');
      console.log('API endpoint:', '/hospital/contact/submit/');
      console.log('Form data:', Object.fromEntries(formData));
      
      const response = await contactAPI.submitContactForm(formData);
      
      console.log('Contact form response:', response.data);
      
      if (response.data.success) {
        setSuccess(true);
        setForm({
          name: '',
          email: '',
          phone: '',
          department: '',
          country: '',
          contactMethod: '',
          subject: '',
          message: '',
          newsletter: false,
          termsAccepted: false,
          file: null
        });
        
        // Scroll to success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error(response.data.error || 'Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      
      let errorMessage = 'Failed to submit the form. Please try again.';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later or contact support directly.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Please check all required fields and try again.';
      }
      
      setErrors(prev => ({
        ...prev,
        submit: errorMessage
      }));
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-vh-100" style={{ 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' 
    }}>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            {/* Header Section */}
            <div className="text-center mb-5">
              <h1 className="display-5 fw-bold text-primary mb-3">Contact Our Healthcare Experts</h1>
              <p className="lead text-muted">
                Ready to transform your healthcare practice? Get in touch with our team for personalized assistance.
              </p>
            </div>

            <Row className="g-4">
              {/* Contact Form */}
              <Col lg={8}>
                <div className="bg-white rounded-4 shadow-sm p-4 p-md-5">
                  <h3 className="h4 fw-bold text-dark mb-4">Send us a message</h3>
                  
                  {success && (
                    <Alert variant="success" className="text-center mb-4">
                      <i className="ri-check-circle-line me-2"></i>
                      Thank you for contacting us! We'll respond within 24 hours.
                    </Alert>
                  )}
                  
                  {errors.submit && (
                    <Alert variant="danger" className="text-center mb-4">
                      <i className="ri-error-warning-line me-2"></i>
                      {errors.submit}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit} noValidate encType="multipart/form-data">
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Name *</Form.Label>
                      <Form.Control 
                        name="name" 
                        type="text" 
                        placeholder="Enter your full name" 
                        value={form.name} 
                        onChange={handleChange} 
                        isInvalid={!!errors.name} 
                        required 
                        className="py-3"
                      />
                      <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">Email *</Form.Label>
                          <Form.Control 
                            name="email" 
                            type="email" 
                            placeholder="Enter your email" 
                            value={form.email} 
                            onChange={handleChange} 
                            isInvalid={!!errors.email} 
                            required 
                            className="py-3"
                          />
                          <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">Phone *</Form.Label>
                          <Form.Control 
                            name="phone" 
                            type="tel" 
                            placeholder="Enter your phone number" 
                            value={form.phone} 
                            onChange={handleChange} 
                            isInvalid={!!errors.phone} 
                            required 
                            className="py-3"
                          />
                          <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">Department *</Form.Label>
                          <Form.Select 
                            name="department" 
                            value={form.department} 
                            onChange={handleChange} 
                            isInvalid={!!errors.department} 
                            required
                            className="py-3"
                          >
                            <option value="">Select department</option>
                            {departments.map((d) => (<option key={d} value={d}>{d}</option>))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">{errors.department}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">Country *</Form.Label>
                          <Form.Select 
                            name="country" 
                            value={form.country} 
                            onChange={handleChange} 
                            isInvalid={!!errors.country} 
                            required
                            className="py-3"
                          >
                            <option value="">Select country</option>
                            {countries.map((c) => (<option key={c} value={c}>{c}</option>))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">{errors.country}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold mb-3" style={{ fontSize: '16px', color: '#495057' }}>
                        Preferred Contact Method *
                      </Form.Label>
                      <div 
                        className="contact-method-container"
                        style={{
                          backgroundColor: '#f8f9fa',
                          padding: '20px',
                          borderRadius: '8px',
                          border: '1px solid #e9ecef'
                        }}
                      >
                        <div className="d-flex flex-wrap gap-3">
                          <EnhancedRadio
                            name="contactMethod"
                            value="Email"
                            checked={form.contactMethod === 'Email'}
                            onChange={handleChange}
                            label="📧 Email"
                            id="contact-email"
                          />
                          <EnhancedRadio
                            name="contactMethod"
                            value="Phone"
                            checked={form.contactMethod === 'Phone'}
                            onChange={handleChange}
                            label="📞 Phone"
                            id="contact-phone"
                          />
                          <EnhancedRadio
                            name="contactMethod"
                            value="WhatsApp"
                            checked={form.contactMethod === 'WhatsApp'}
                            onChange={handleChange}
                            label="💬 WhatsApp"
                            id="contact-whatsapp"
                          />
                        </div>
                      </div>
                      {errors.contactMethod && <div className="text-danger small mt-2">{errors.contactMethod}</div>}
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Subject *</Form.Label>
                      <Form.Control 
                        name="subject" 
                        type="text" 
                        placeholder="What can we help you with?" 
                        value={form.subject} 
                        onChange={handleChange} 
                        isInvalid={!!errors.subject} 
                        required 
                        className="py-3"
                      />
                      <Form.Control.Feedback type="invalid">{errors.subject}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Message *</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={6}
                        name="message"
                        placeholder="Tell us about your healthcare practice and how we can help..."
                        value={form.message}
                        onChange={handleChange}
                        isInvalid={!!errors.message}
                        required
                      />
                      <Form.Control.Feedback type="invalid">{errors.message}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Attach a file (Optional)</Form.Label>
                      <Form.Control 
                        name="file" 
                        type="file" 
                        onChange={handleChange} 
                        accept=".pdf,.doc,.docx,.txt"
                        className="py-3"
                      />
                      <Form.Text className="text-muted">Accepted formats: PDF, DOC, DOCX, TXT (Max 5MB)</Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <EnhancedCheckbox
                        name="newsletter"
                        checked={form.newsletter}
                        onChange={handleChange}
                        label="Subscribe to our newsletter for healthcare insights and product updates"
                        id="newsletter-checkbox"
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <EnhancedCheckbox
                        name="termsAccepted"
                        checked={form.termsAccepted}
                        onChange={handleChange}
                        label={
                          <span>
                            I agree to the{' '}
                            <a 
                              href="/terms" 
                              className="text-primary text-decoration-none fw-semibold"
                              style={{ textDecoration: 'underline !important' }}
                            >
                              Terms and Conditions
                            </a>
                            {' '}and{' '}
                            <a 
                              href="/privacy" 
                              className="text-primary text-decoration-none fw-semibold"
                              style={{ textDecoration: 'underline !important' }}
                            >
                              Privacy Policy
                            </a>
                          </span>
                        }
                        id="terms-checkbox"
                        required={true}
                      />
                      {errors.termsAccepted && <div className="text-danger small mt-2">{errors.termsAccepted}</div>}
                    </Form.Group>

                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="w-100 py-3 fw-semibold" 
                      disabled={loading}
                      style={{ borderRadius: '12px' }}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <RiMailFill className="me-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </Form>
                </div>
              </Col>

              {/* Contact Information Sidebar */}
              <Col lg={4}>
                <div className="bg-primary text-white rounded-4 p-4 h-100" style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}>
                  <h4 className="fw-bold mb-4">Get in Touch</h4>
                  <p className="mb-4 opacity-90">
                    Our healthcare experts are ready to help you transform your practice with our comprehensive solutions.
                  </p>

                  <div className="mb-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-success rounded-3 p-3 me-3 shadow-sm" style={{ 
                        background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                        minWidth: '50px',
                        minHeight: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <RiMailFill size={24} className="text-white" />
                      </div>
                      <div>
                        <h6 className="mb-0 fw-semibold">Email</h6>
                        <small className="opacity-75">info@xerxez.in</small>
                      </div>
                    </div>

                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-success rounded-3 p-3 me-3 shadow-sm" style={{ 
                        background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)',
                        minWidth: '50px',
                        minHeight: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <RiWhatsappFill size={24} className="text-white" />
                      </div>
                      <div>
                        <h6 className="mb-0 fw-semibold">WhatsApp Support</h6>
                        <small className="opacity-75">+919164315460</small>
                      </div>
                    </div>

                    <div className="d-flex align-items-center mb-4">
                      <div className="bg-info rounded-3 p-3 me-3 shadow-sm" style={{ 
                        background: 'linear-gradient(135deg, #17a2b8 0%, #6f42c1 100%)',
                        minWidth: '50px',
                        minHeight: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <i className="ri-time-line text-white" style={{ fontSize: '24px' }}></i>
                      </div>
                      <div>
                        <h6 className="mb-0 fw-semibold">Response Time</h6>
                        <small className="opacity-75">Within 24 hours</small>
                      </div>
                    </div>
                  </div>

                  <div className="border-top border-white border-opacity-20 pt-4">
                    <h6 className="fw-semibold mb-3">Follow Us</h6>
                    <div className="d-flex gap-3">
                      <a 
                        href="https://facebook.com" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-decoration-none"
                        aria-label="Facebook"
                      >
                        <div className="rounded-circle p-2 hover-lift shadow-sm" style={{
                          background: 'linear-gradient(135deg, #1877f2 0%, #42a5f5 100%)',
                          transition: 'transform 0.2s ease'
                        }}>
                          <RiFacebookFill size={20} className="text-white" />
                        </div>
                      </a>
                      <a 
                        href="https://twitter.com" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-decoration-none"
                        aria-label="Twitter"
                      >
                        <div className="rounded-circle p-2 hover-lift shadow-sm" style={{
                          background: 'linear-gradient(135deg, #1da1f2 0%, #1976d2 100%)',
                          transition: 'transform 0.2s ease'
                        }}>
                          <RiTwitterFill size={20} className="text-white" />
                        </div>
                      </a>
                      <a 
                        href="https://instagram.com" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-decoration-none"
                        aria-label="Instagram"
                      >
                        <div className="rounded-circle p-2 hover-lift shadow-sm" style={{
                          background: 'linear-gradient(135deg, #e4405f 0%, #fd1d1d 50%, #fcb045 100%)',
                          transition: 'transform 0.2s ease'
                        }}>
                          <RiInstagramFill size={20} className="text-white" />
                        </div>
                      </a>
                      <a 
                        href="https://wa.me/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-decoration-none"
                        aria-label="WhatsApp"
                      >
                        <div className="rounded-circle p-2 hover-lift shadow-sm" style={{
                          background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)',
                          transition: 'transform 0.2s ease'
                        }}>
                          <RiWhatsappFill size={20} className="text-white" />
                        </div>
                      </a>
                    </div>
                  </div>

                  {/* Additional Contact Information */}
                  <div className="border-top border-white border-opacity-20 pt-4 mt-4">
                    <h6 className="fw-semibold mb-3">Business Hours</h6>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="small">Monday - Friday</span>
                        <span className="small opacity-75">9:00 AM - 6:00 PM</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="small">Saturday</span>
                        <span className="small opacity-75">10:00 AM - 4:00 PM</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="small">Sunday</span>
                        <span className="small opacity-75">Closed</span>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="border-top border-white border-opacity-20 pt-4 mt-4">
                    <h6 className="fw-semibold mb-3">Emergency Support</h6>
                    <p className="small opacity-90 mb-3">
                      For critical healthcare system issues outside business hours
                    </p>
                    <div className="d-flex align-items-center">
                      <div className="bg-danger rounded-circle p-2 me-3">
                        <i className="ri-phone-line text-white" style={{ fontSize: '16px' }}></i>
                      </div>
                      <div>
                        <span className="small fw-semibold">Emergency Hotline</span>
                        <br />
                        <span className="small opacity-75">Available 24/7</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Additional Information Section */}
            <Row className="mt-5">
              <Col lg={12}>
                <div className="bg-white rounded-4 shadow-sm p-4">
                  <h3 className="h5 fw-bold text-center mb-4">Frequently Asked Questions</h3>
                  <Row>
                    <Col md={6}>
                      <div className="mb-4">
                        <h6 className="fw-semibold text-primary">How quickly do you respond?</h6>
                        <p className="small text-muted mb-0">
                          We respond to all inquiries within 24 hours during business days. 
                          Emergency support requests are handled immediately.
                        </p>
                      </div>
                      <div className="mb-4">
                        <h6 className="fw-semibold text-primary">Do you offer demo sessions?</h6>
                        <p className="small text-muted mb-0">
                          Yes! We provide personalized demo sessions for all our healthcare modules. 
                          Contact us to schedule your free demonstration.
                        </p>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-4">
                        <h6 className="fw-semibold text-primary">What support do you provide?</h6>
                        <p className="small text-muted mb-0">
                          We offer comprehensive support including setup assistance, training, 
                          technical support, and ongoing maintenance for all our solutions.
                        </p>
                      </div>
                      <div className="mb-4">
                        <h6 className="fw-semibold text-primary">Can I customize the solution?</h6>
                        <p className="small text-muted mb-0">
                          Absolutely! Our healthcare solutions are highly customizable to meet 
                          your specific practice requirements and workflows.
                        </p>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>

            {/* Call to Action Section */}
            <Row className="mt-4">
              <Col lg={12}>
                <div className="text-center bg-primary rounded-4 p-4 text-white" style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}>
                  <h4 className="fw-bold mb-3">Ready to Transform Your Healthcare Practice?</h4>
                  <p className="mb-4 opacity-90">
                    Join thousands of healthcare professionals who trust our solutions for their daily operations.
                  </p>
                  <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                    <a 
                      href="/mastermind-subscription" 
                      className="btn btn-light btn-lg px-4 text-decoration-none"
                      style={{ borderRadius: '12px' }}
                    >
                      <i className="ri-rocket-line me-2"></i>
                      Get Started Now
                    </a>
                    <a 
                      href="/healthcare-modules" 
                      className="btn btn-outline-light btn-lg px-4 text-decoration-none"
                      style={{ borderRadius: '12px' }}
                    >
                      <i className="ri-eye-line me-2"></i>
                      Explore Features
                    </a>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .hover-lift {
          transition: transform 0.2s ease;
        }
        .hover-lift:hover {
          transform: translateY(-2px);
        }
        .form-control:focus, .form-select:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
        .btn:hover {
          transform: translateY(-2px);
          transition: transform 0.2s ease;
        }
        
        .custom-radio-container:hover .custom-radio-circle {
          border-color: #5a6fd8;
          transform: scale(1.1);
        }
        
        .custom-checkbox-container:hover .custom-checkbox-square {
          border-color: #5a6fd8;
          transform: scale(1.05);
        }
        
        .contact-method-container {
          transition: all 0.2s ease;
        }
        
        .contact-method-container:hover {
          background-color: #f1f3f4 !important;
        }
      `}</style>
    </div>
  );
};

export default Contact;
