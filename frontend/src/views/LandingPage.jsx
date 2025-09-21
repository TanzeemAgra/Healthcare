import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Modal, Badge, Alert } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import subscriptionService from '../services/subscriptionService';
import Navigation from '../components/Navigation';
import {
  LANDING_PAGE_MODULES,
  getModulesForLanding,
  getModuleCount,
} from '../utils/landingPageModules';
import '../styles/LandingPage.css';

const generatePath = (path) => {
  const publicUrl = import.meta.env.VITE_PUBLIC_URL || '';
  return `${publicUrl}${path}`;
};

// Contact page URL constant for soft coding
const CONTACT_URL = 'https://www.xerxez.com/contact';

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Safely get auth state from Redux
  const authState = useSelector((state) => state.auth || {});
  const { isAuthenticated = false, user = null } = authState;

  // Add purple color CSS for cosmetology module
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .bg-purple {
        background-color: #8B5CF6 !important;
      }
      .text-purple {
        color: #8B5CF6 !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Animation states for counters
  const [countersAnimated, setCountersAnimated] = useState(false);
  const [statsData, setStatsData] = useState({
    patients: 0,
    hospitals: 0,
    countries: 0,
    uptime: 0,
  });

  // Animated counter effect
  useEffect(() => {
    const animateCounters = () => {
      if (countersAnimated) return;

      const finalStats = {
        patients: 50000,
        hospitals: 500,
        countries: 25,
        uptime: 99.9,
      };

      const duration = 2000; // 2 seconds
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        setStatsData({
          patients: Math.floor(finalStats.patients * progress),
          hospitals: Math.floor(finalStats.hospitals * progress),
          countries: Math.floor(finalStats.countries * progress),
          uptime: (finalStats.uptime * progress).toFixed(1),
        });

        if (currentStep >= steps) {
          clearInterval(interval);
          setCountersAnimated(true);
        }
      }, stepDuration);
    };

    // Intersection Observer for triggering animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounters();
        }
      });
    });

    const statsSection = document.querySelector('#stats-section');
    if (statsSection) {
      observer.observe(statsSection);
    }

    return () => observer.disconnect();
  }, [countersAnimated]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseError, setPurchaseError] = useState(null);
  const [redirectMessage, setRedirectMessage] = useState(location.state?.message || null);

  // Handler functions for demo section buttons
  const handleWatchDemo = () => {
    window.open(CONTACT_URL, '_blank');
  };

  const handleScheduleCall = () => {
    window.open(CONTACT_URL, '_blank');
  };

  // Monthly subscription plans aligned with new pricing model
  const subscriptionPlans = [
    {
      name: 'Basic Care',
      price: '$200',
      period: '/month',
      icon: 'ri-user-heart-line',
      color: 'primary',
      popular: false,
      badge: '',
      limits: 'Base Platform + Advanced Scheduling',
      features: [
        'Base Healthcare Platform ($100)',
        'Advanced Scheduling System (+$100)', 
        'Patient Management & Records',
        'Basic Reporting & Analytics',
        'User Access Control',
        'Data Backup & Security',
        '24/7 Email Support',
        'HIPAA Compliant Infrastructure',
      ],
    },
    {
      name: 'Professional Care',
      price: '$350',
      period: '/month',
      icon: 'ri-stethoscope-line',
      color: 'success',
      popular: true,
      badge: 'Most Popular',
      limits: 'Save $50/month vs individual features',
      features: [
        'Everything in Basic Care',
        'AI Diagnosis Module (+$100)',
        'Telemedicine Suite (+$100)',
        'Advanced Analytics (+$100)',
        'Priority Support & Training',
        'Machine Learning Diagnostics',
        'Virtual Consultations',
        'Business Intelligence Dashboard',
        'Free Setup & Onboarding',
      ],
    },
    {
      name: 'Enterprise Care',
      price: '$500',
      period: '/month',
      icon: 'ri-hospital-line',
      color: 'warning',
      popular: false,
      badge: 'Best Value',
      limits: 'Save $200/month vs individual features',
      features: [
        'Everything in Professional Care',
        'Radiology Services (+$100)',
        'Laboratory Management (+$100)',
        'Advanced Billing System (+$100)',
        'Third-party Integrations (+$100)',
        'Dedicated Account Manager',
        'Custom API Access',
        'Priority Technical Support',
        'White-label Options Available',
      ],
    },
  ];

  // Role-specific features and benefits
  const roleFeatures = {
    doctor: {
      title: 'For Healthcare Professionals',
      subtitle: 'Advanced medical tools and AI assistance',
      icon: 'ri-stethoscope-line',
      color: 'primary',
      features: [
        'Dr. Max AI Chatbot for clinical decisions',
        `${getModuleCount()} Comprehensive Medical Modules (Medicine, Dermatology, Dentistry, Pathology, Radiology, Homeopathy, Allopathy, Cosmetology, DNA Sequencing, SecureNeat)`,
        'AI-powered Radiology and Pathology Analysis',
        'Risk Prediction and Drug Interaction Checking',
        'Secure Patient Data Management',
        'Advanced Clinical Analytics and Insights',
      ],
      recommendedPlan: 'Professional Care',
    },
    nurse: {
      title: 'For Nursing Professionals',
      subtitle: 'Streamlined patient care and education',
      icon: 'ri-heart-pulse-line',
      color: 'success',
      features: [
        'Patient Care Management System',
        'Basic Medical Knowledge and Training',
        'Appointment and Care Plan Templates',
        'Medication Management Tools',
        'Clinical Documentation System',
        'Professional Development Resources',
      ],
      recommendedPlan: 'Basic Care',
    },
    patient: {
      title: 'For Patients',
      subtitle: 'Take control of your health journey',
      icon: 'ri-user-heart-line',
      color: 'info',
      features: [
        'Personal Health Record Management',
        'Easy Appointment Scheduling',
        'Medication Reminders and Tracking',
        'Health Insights Dashboard',
        'Secure Communication with Doctors',
        'Health Education Resources',
      ],
      recommendedPlan: 'Basic Care',
    },
    pharmacist: {
      title: 'For Pharmacists',
      subtitle: 'Optimize medication management and drug safety',
      icon: 'ri-capsule-line',
      color: 'warning',
      features: [
        'Advanced Drug Interaction Checker',
        'Allopathy and Homeopathy Module Access',
        'Prescription Verification System',
        'Inventory Management Tools',
        'Patient Consultation Platform',
        'Regulatory Compliance Support',
      ],
      recommendedPlan: 'Enterprise Care',
    },
  };

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setShowFeatureModal(true);
  };

  const handleGetStarted = (role) => {
    if (isAuthenticated) {
      // Redirect to role-specific dashboard
      switch (role) {
        case 'doctor':
          navigate('/SecureNeat/dashboard');
          break;
        case 'nurse':
          navigate('/dashboard-pages/patient-dashboard');
          break;
        case 'patient':
          navigate('/dashboard-pages/patient-dashboard');
          break;
        case 'pharmacist':
          navigate('/');
          break;
        default:
          navigate('/');
      }
    } else {
      // Redirect to payment/subscription page instead of free signup
      const recommendedPlan = subscriptionPlans.find(
        (plan) => plan.name === roleFeatures[role].recommendedPlan
      );

      if (recommendedPlan) {
        handleSubscriptionPurchase(recommendedPlan);
      } else {
        // Fallback to pricing section
        const pricingSection = document.querySelector('#pricing-section');
        if (pricingSection) {
          pricingSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const handleSubscriptionPurchase = async (plan) => {
    console.log('handleSubscriptionPurchase called with plan:', plan);
    setPurchaseError(null);

    try {
      setPurchaseLoading(true);

      // Map plan names to plan IDs
      const planMapping = {
        SecureNeat: 1,
        Radiology: 2,
        'Full Admin Access': 3,
      };

      const planId = planMapping[plan.name];
      if (!planId) {
        throw new Error('Invalid plan selected');
      }

      // Navigate to custom branded checkout page
      navigate('/checkout', {
        state: {
          plan: plan,
          planId: planId,
        },
      });
    } catch (error) {
      console.error('Payment initiation failed:', error);
      setPurchaseError(error.message || 'Failed to initiate payment. Please try again.');
    } finally {
      setPurchaseLoading(false);
    }
  };

  return (
    <>
      {/* Navigation */}
      <Navigation isLandingPage={true} />

      {/* Hero Section */}
      <section
        id='hero'
        className='hero-section'
        style={{
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          paddingTop: '80px', // Account for fixed navbar
        }}
      >
        {/* Background Pattern */}
        <div
          className='position-absolute w-100 h-100'
          style={{
            background: `
              radial-gradient(circle at 20% 50%, rgba(229, 9, 20, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 107, 107, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(229, 9, 20, 0.05) 0%, transparent 50%)
            `,
            zIndex: 1,
          }}
        />

        {/* Floating Elements */}
        <div className='position-absolute w-100 h-100' style={{ zIndex: 1 }}>
          <div
            className='position-absolute'
            style={{
              top: '20%',
              right: '10%',
              animation: 'float 6s ease-in-out infinite',
              opacity: 0.2,
            }}
          >
            <i className='ri-stethoscope-line' style={{ fontSize: '8rem', color: '#E50914' }}></i>
          </div>
          <div
            className='position-absolute'
            style={{
              bottom: '30%',
              left: '5%',
              animation: 'float 8s ease-in-out infinite reverse',
              opacity: 0.2,
            }}
          >
            <i className='ri-heart-pulse-line' style={{ fontSize: '6rem', color: '#FF6B6B' }}></i>
          </div>
          <div
            className='position-absolute'
            style={{
              top: '60%',
              right: '20%',
              animation: 'float 7s ease-in-out infinite',
              opacity: 0.2,
            }}
          >
            <i className='ri-brain-line' style={{ fontSize: '5rem', color: '#E50914' }}></i>
          </div>
          <div
            className='position-absolute'
            style={{
              top: '10%',
              left: '15%',
              animation: 'float 9s ease-in-out infinite reverse',
              opacity: 0.2,
            }}
          >
            <i className='ri-shield-check-line' style={{ fontSize: '4rem', color: '#FF6B6B' }}></i>
          </div>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }
        `}</style>

        <Container className='position-relative' style={{ zIndex: 2 }}>
          <Row className='align-items-center min-vh-100 py-5'>
            <Col lg={6} className='mb-5 mb-lg-0'>
              <div className='hero-content'>
                <div className='mb-4'>
                  <Badge
                    bg='primary'
                    className='px-3 py-2 mb-3'
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      background: 'rgba(229, 9, 20, 0.2)',
                      color: '#FF6B6B',
                      border: '1px solid rgba(229, 9, 20, 0.3)',
                    }}
                  >
                    <i className='ri-sparkle-line me-2'></i>
                    AI-Powered Healthcare Platform!!!
                  </Badge>
                </div>

                <h1
                  className='display-3 fw-bold mb-4'
                  style={{
                    color: '#ffffff',
                    lineHeight: '1.1',
                    letterSpacing: '-0.02em',
                  }}
                >
                  The Future of{' '}
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #E50914 0%, #FF6B6B 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Healthcare
                  </span>{' '}
                  is Here!
                </h1>

                <p
                  className='lead mb-5'
                  style={{
                    color: '#cccccc',
                    fontSize: '1.25rem',
                    lineHeight: '1.6',
                  }}
                >
                  Empowering healthcare professionals and patients with AI-driven tools, secure data
                  management, and intelligent insights for better health outcomes.
                </p>

                <div className='d-flex flex-column flex-sm-row gap-3 mb-5'>
                  <Button
                    size='lg'
                    as={Link}
                    to='/billing/subscriptions'
                    className='px-4 py-3'
                    style={{
                      background: 'linear-gradient(135deg, #E50914 0%, #FF6B6B 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: '600',
                      fontSize: '1.1rem',
                      color: '#fff',
                      boxShadow: '0 4px 20px rgba(229, 9, 20, 0.3)',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 30px rgba(229, 9, 20, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 20px rgba(229, 9, 20, 0.3)';
                    }}
                  >
                    <i className='ri-play-circle-line me-2'></i>
                    Get Started
                  </Button>
                  <Button
                    size='lg'
                    variant='outline-light'
                    onClick={() => {
                      const featuresSection = document.querySelector('#features');
                      if (featuresSection) {
                        featuresSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className='px-4 py-3'
                    style={{
                      borderRadius: '12px',
                      fontWeight: '600',
                      fontSize: '1.1rem',
                      borderColor: '#ffffff40',
                      color: '#ffffff',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#ffffff20';
                      e.target.style.borderColor = '#ffffff80';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.borderColor = '#ffffff40';
                    }}
                  >
                    <i className='ri-play-line me-2'></i>
                    Watch Demo
                  </Button>
                </div>

                <div className='d-flex flex-wrap align-items-center gap-3'>
                  <div
                    className='d-flex align-items-center px-3 py-2'
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      borderRadius: '8px',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                    }}
                  >
                    <i className='ri-shield-check-line me-2' style={{ color: '#059669' }}></i>
                    <span style={{ color: '#065f46', fontWeight: '500', fontSize: '0.9rem' }}>
                      HIPAA Compliant
                    </span>
                  </div>
                  <div
                    className='d-flex align-items-center px-3 py-2'
                    style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      borderRadius: '8px',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                    }}
                  >
                    <i className='ri-award-line me-2' style={{ color: '#2563eb' }}></i>
                    <span style={{ color: '#1e40af', fontWeight: '500', fontSize: '0.9rem' }}>
                      ISO 27001 Certified
                    </span>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={6}>
              <div
                className='hero-mockup position-relative'
                style={{
                  maxWidth: '580px',
                  margin: '0 auto',
                  transform: 'perspective(1000px) rotateY(-5deg) rotateX(2deg)',
                  transformStyle: 'preserve-3d',
                }}
              >
                <div
                  className='laptop-wrapper position-relative'
                  style={{
                    filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.15))',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <img
                    src={generatePath('/assets/images/IMG-athenaOne-hero-laptop.webp')}
                    alt='Laptop Mockup'
                    className='img-fluid'
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                    }}
                  />

                  <div
                    className='screenshot-overlay position-absolute'
                    style={{
                      top: '6%',
                      left: '13%',
                      width: '74%',
                      height: '64%',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      background: '#ffffff',
                      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
                    }}
                  >
                    <img
                      src={generatePath('/assets/images/Screenshot_2.png')}
                      alt='Healthcare Dashboard Screenshot'
                      className='img-fluid w-100 h-100'
                      style={{
                        objectFit: 'cover',
                        objectPosition: 'top center',
                      }}
                    />

                    {/* Subtle screen glare */}
                    <div
                      className='position-absolute'
                      style={{
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '40%',
                        background:
                          'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
                        pointerEvents: 'none',
                      }}
                    />
                  </div>
                </div>

                {/* Floating elements */}
                <div
                  className='position-absolute'
                  style={{
                    top: '10%',
                    right: '-10%',
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'float 3s ease-in-out infinite',
                    boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
                  }}
                >
                  <i
                    className='ri-heart-pulse-line'
                    style={{ color: 'white', fontSize: '24px' }}
                  ></i>
                </div>

                <div
                  className='position-absolute'
                  style={{
                    bottom: '20%',
                    left: '-8%',
                    width: '50px',
                    height: '50px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'float 3s ease-in-out infinite 1s',
                    boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <i
                    className='ri-stethoscope-line'
                    style={{ color: 'white', fontSize: '20px' }}
                  ></i>
                </div>
              </div>
            </Col>
          </Row>
        </Container>

        <style>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }
        `}</style>
      </section>

      {/* Medical Modules Showcase Section */}
      <section className='py-5 bg-light'>
        <Container>
          <Row className='mb-5'>
            <Col lg={8} className='mx-auto text-center'>
              <h2 className='display-5 fw-bold mb-3'>
                <i className='ri-hospital-line me-3 text-primary'></i>
                Comprehensive Medical Modules
              </h2>
              <p className='lead text-muted'>
                Our platform covers all major medical specialties with AI-powered features
              </p>
            </Col>
          </Row>

          <Row className='g-4'>
            <Col lg={3} md={6}>
              <Card className='border-0 shadow-sm h-100 text-center'>
                <Card.Body className='p-4'>
                  <div
                    className='bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3'
                    style={{ width: '60px', height: '60px' }}
                  >
                    <i className='ri-stethoscope-line fs-4'></i>
                  </div>
                  <h5 className='mb-3'>General Medicine</h5>
                  <p className='text-muted small'>
                    Complete patient management with AI diagnostic support and clinical decision
                    tools
                  </p>
                  <Badge bg='primary' className='mb-2'>
                    Professional+
                  </Badge>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3} md={6}>
              <Card className='border-0 shadow-sm h-100 text-center'>
                <Card.Body className='p-4'>
                  <div
                    className='bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3'
                    style={{ width: '60px', height: '60px' }}
                  >
                    <i className='ri-heart-pulse-line fs-4'></i>
                  </div>
                  <h5 className='mb-3'>Dermatology</h5>
                  <p className='text-muted small'>
                    Skin condition analysis with AI-powered image recognition and treatment plans
                  </p>
                  <Badge bg='success' className='mb-2'>
                    Professional+
                  </Badge>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3} md={6}>
              <Card className='border-0 shadow-sm h-100 text-center'>
                <Card.Body className='p-4'>
                  <div
                    className='bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3'
                    style={{ width: '60px', height: '60px' }}
                  >
                    <i className='ri-scan-line fs-4'></i>
                  </div>
                  <h5 className='mb-3'>Radiology</h5>
                  <p className='text-muted small'>
                    Advanced imaging analysis with AI interpretation and automated reporting
                  </p>
                  <Badge bg='warning' className='mb-2'>
                    Enterprise+
                  </Badge>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3} md={6}>
              <Card className='border-0 shadow-sm h-100 text-center'>
                <Card.Body className='p-4'>
                  <div
                    className='bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3'
                    style={{ width: '60px', height: '60px' }}
                  >
                    <i className='ri-capsule-line fs-4'></i>
                  </div>
                  <h5 className='mb-3'>Dentistry</h5>
                  <p className='text-muted small'>
                    Comprehensive dental care management with treatment planning and patient records
                  </p>
                  <Badge bg='success' className='mb-2'>
                    Professional+
                  </Badge>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3} md={6}>
              <Card className='border-0 shadow-sm h-100 text-center'>
                <Card.Body className='p-4'>
                  <div
                    className='bg-secondary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3'
                    style={{ width: '60px', height: '60px' }}
                  >
                    <i className='ri-microscope-line fs-4'></i>
                  </div>
                  <h5 className='mb-3'>Pathology</h5>
                  <p className='text-muted small'>
                    Laboratory data analysis with AI-assisted interpretation and quality control
                  </p>
                  <Badge bg='warning' className='mb-2'>
                    Enterprise+
                  </Badge>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3} md={6}>
              <Card className='border-0 shadow-sm h-100 text-center'>
                <Card.Body className='p-4'>
                  <div
                    className='bg-purple text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3'
                    style={{ width: '60px', height: '60px', backgroundColor: '#6f42c1' }}
                  >
                    <i className='ri-medicine-bottle-line fs-4'></i>
                  </div>
                  <h5 className='mb-3'>Allopathy</h5>
                  <p className='text-muted small'>
                    Modern medicine management with drug interaction checking and dosage
                    optimization
                  </p>
                  <Badge bg='warning' className='mb-2'>
                    Enterprise+
                  </Badge>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3} md={6}>
              <Card className='border-0 shadow-sm h-100 text-center'>
                <Card.Body className='p-4'>
                  <div
                    className='bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3'
                    style={{ width: '60px', height: '60px' }}
                  >
                    <i className='ri-leaf-line fs-4'></i>
                  </div>
                  <h5 className='mb-3'>Homeopathy</h5>
                  <p className='text-muted small'>
                    Alternative medicine protocols with natural remedy management and patient
                    tracking
                  </p>
                  <Badge bg='warning' className='mb-2'>
                    Enterprise+
                  </Badge>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3} md={6}>
              <Card className='border-0 shadow-sm h-100 text-center'>
                <Card.Body className='p-4'>
                  <div
                    className='bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3'
                    style={{ width: '60px', height: '60px' }}
                  >
                    <i className='ri-robot-2-line fs-4'></i>
                  </div>
                  <h5 className='mb-3'>AI Diagnostics</h5>
                  <p className='text-muted small'>
                    Advanced machine learning models for predictive analytics and clinical insights
                  </p>
                  <Badge bg='danger' className='mb-2'>
                    Ultimate AI
                  </Badge>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className='mt-5'>
            <Col lg={12} className='text-center'>
              <div className='bg-white rounded-3 p-4 shadow-sm'>
                <h5 className='text-primary mb-3'>
                  <i className='ri-shield-check-line me-2'></i>
                  SecureNeat Medical Security Platform
                </h5>
                <p className='text-muted mb-3'>
                  All medical modules are protected by our enterprise-grade security platform
                  ensuring HIPAA compliance, data encryption, and audit trails for complete peace of
                  mind.
                </p>
                <div className='d-flex justify-content-center gap-3 flex-wrap'>
                  <small className='text-muted'>
                    <i className='ri-lock-2-line me-1'></i>End-to-End Encryption
                  </small>
                  <small className='text-muted'>
                    <i className='ri-eye-off-line me-1'></i>Data Anonymization
                  </small>
                  <small className='text-muted'>
                    <i className='ri-history-line me-1'></i>Complete Audit Trails
                  </small>
                  <small className='text-muted'>
                    <i className='ri-shield-star-line me-1'></i>HIPAA Compliant
                  </small>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Animated Statistics Section */}
      <section
        id='features'
        className='py-5'
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        <Container>
          <Row className='text-center'>
            <Col lg={12} className='mb-5'>
              <h2 className='display-5 fw-bold text-white mb-3'>
                Trusted by Healthcare Professionals Worldwide
              </h2>
              <p className='lead text-white-50'>
                Join thousands of medical professionals using our platform
              </p>
            </Col>
          </Row>
          <Row className='g-4'>
            <Col lg={3} md={6}>
              <div className='text-center'>
                <div className='mb-3'>
                  <i className='ri-user-heart-line display-3 text-white'></i>
                </div>
                <div
                  className='display-4 fw-bold text-white mb-2'
                  style={{
                    fontFamily: 'monospace',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  {statsData.patients.toLocaleString()}+
                </div>
                <div className='text-white-75 fs-5'>Patients Served</div>
              </div>
            </Col>
            <Col lg={3} md={6}>
              <div className='text-center'>
                <div className='mb-3'>
                  <i className='ri-hospital-line display-3 text-white'></i>
                </div>
                <div
                  className='display-4 fw-bold text-white mb-2'
                  style={{
                    fontFamily: 'monospace',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  {statsData.hospitals}+
                </div>
                <div className='text-white-75 fs-5'>Healthcare Facilities</div>
              </div>
            </Col>
            <Col lg={3} md={6}>
              <div className='text-center'>
                <div className='mb-3'>
                  <i className='ri-global-line display-3 text-white'></i>
                </div>
                <div
                  className='display-4 fw-bold text-white mb-2'
                  style={{
                    fontFamily: 'monospace',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  {statsData.countries}+
                </div>
                <div className='text-white-75 fs-5'>Countries</div>
              </div>
            </Col>
            <Col lg={3} md={6}>
              <div className='text-center'>
                <div className='mb-3'>
                  <i className='ri-shield-check-line display-3 text-white'></i>
                </div>
                <div
                  className='display-4 fw-bold text-white mb-2'
                  style={{
                    fontFamily: 'monospace',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  {statsData.uptime}%
                </div>
                <div className='text-white-75 fs-5'>Uptime Guarantee</div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Medical Modules Showcase Section */}
      <section id='medical-modules' className='py-5 bg-light'>
        <Container>
          <Row className='mb-5'>
            <Col lg={8} className='mx-auto text-center'>
              <h2 className='display-5 fw-bold mb-3'>Comprehensive Medical Modules</h2>
              <p className='lead text-muted'>
                {getModuleCount()} integrated healthcare modules for modern medical practice
              </p>
            </Col>
          </Row>
          <Row className='g-4'>
            {getModulesForLanding().map((module) => (
              <Col key={module.id} lg={4} md={6}>
                <Card
                  className='h-100 border-0 shadow-sm hover-lift'
                  style={{
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                  }}
                >
                  <Card.Body className='text-center p-4'>
                    <div className='mb-3'>
                      <div
                        className={`bg-${module.bgColor} text-white rounded-circle d-inline-flex align-items-center justify-content-center`}
                        style={{
                          width: '80px',
                          height: '80px',
                        }}
                      >
                        <i className={`${module.icon} fs-1`}></i>
                      </div>
                    </div>
                    <h4 className='fw-bold mb-3'>{module.name}</h4>
                    <p className='text-muted mb-3'>{module.description}</p>
                    <Badge
                      bg={
                        module.badge === 'New'
                          ? 'success'
                          : module.badge === 'Ultimate AI'
                          ? 'danger'
                          : module.badge === 'Enterprise+'
                          ? 'warning'
                          : 'primary'
                      }
                      className='mb-2'
                    >
                      {module.badge}
                    </Badge>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Live Demo Section */}
      <section
        id='demo'
        className='py-5'
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          color: 'white',
        }}
      >
        <Container>
          <Row className='align-items-center'>
            <Col lg={6} className='mb-5 mb-lg-0'>
              <h2 className='display-5 fw-bold text-white mb-4'>See Our Platform in Action</h2>
              <p className='lead text-white-50 mb-4'>
                Experience the power of AI-driven healthcare management with our interactive demo.
                See how our platform streamlines workflows and improves patient outcomes.
              </p>
              <div className='mb-4'>
                <div className='d-flex align-items-center mb-3'>
                  <i className='ri-check-double-line text-success me-3 fs-4'></i>
                  <span className='text-white'>Real-time AI diagnostics demonstration</span>
                </div>
                <div className='d-flex align-items-center mb-3'>
                  <i className='ri-check-double-line text-success me-3 fs-4'></i>
                  <span className='text-white'>Patient management workflow</span>
                </div>
                <div className='d-flex align-items-center mb-3'>
                  <i className='ri-check-double-line text-success me-3 fs-4'></i>
                  <span className='text-white'>Security features showcase</span>
                </div>
              </div>
              <div className='d-flex gap-3'>
                <Button
                  variant='light'
                  size='lg'
                  className='px-4'
                  style={{
                    borderRadius: '12px',
                    fontWeight: '600',
                  }}
                  onClick={handleWatchDemo}
                >
                  <i className='ri-play-circle-line me-2'></i>
                  Watch Demo
                </Button>
                <Button
                  variant='outline-light'
                  size='lg'
                  className='px-4'
                  style={{
                    borderRadius: '12px',
                    fontWeight: '600',
                  }}
                  onClick={handleScheduleCall}
                >
                  <i className='ri-calendar-line me-2'></i>
                  Schedule Call
                </Button>
              </div>
            </Col>
            <Col lg={6}>
              <div className='position-relative'>
                <div
                  className='bg-light rounded-3 p-4'
                  style={{
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    transform: 'perspective(1000px) rotateY(-5deg)',
                  }}
                >
                  <div className='d-flex align-items-center mb-3'>
                    <div
                      className='bg-danger rounded-circle me-2'
                      style={{ width: '12px', height: '12px' }}
                    ></div>
                    <div
                      className='bg-warning rounded-circle me-2'
                      style={{ width: '12px', height: '12px' }}
                    ></div>
                    <div
                      className='bg-success rounded-circle me-2'
                      style={{ width: '12px', height: '12px' }}
                    ></div>
                    <div className='ms-3 text-muted small'>XERXEZ Healthcare Platform</div>
                  </div>

                  <div className='demo-interface'>
                    <div className='row mb-3'>
                      <div className='col-4'>
                        <div className='bg-primary p-3 rounded text-white text-center'>
                          <i className='ri-user-heart-line fs-4 mb-2'></i>
                          <div className='fw-bold'>1,247</div>
                          <small>Patients</small>
                        </div>
                      </div>
                      <div className='col-4'>
                        <div className='bg-success p-3 rounded text-white text-center'>
                          <i className='ri-calendar-check-line fs-4 mb-2'></i>
                          <div className='fw-bold'>89</div>
                          <small>Today</small>
                        </div>
                      </div>
                      <div className='col-4'>
                        <div className='bg-warning p-3 rounded text-white text-center'>
                          <i className='ri-alert-line fs-4 mb-2'></i>
                          <div className='fw-bold'>12</div>
                          <small>Alerts</small>
                        </div>
                      </div>
                    </div>

                    <div className='bg-white border rounded p-3 mb-3'>
                      <div className='d-flex align-items-center justify-content-between mb-2'>
                        <div className='fw-bold text-dark'>AI Analysis Results</div>
                        <Badge bg='success'>Active</Badge>
                      </div>
                      <div className='progress mb-2' style={{ height: '8px' }}>
                        <div className='progress-bar bg-success' style={{ width: '87%' }}></div>
                      </div>
                      <small className='text-muted'>Risk Assessment: Low (87% confidence)</small>
                    </div>

                    <div className='d-flex gap-2'>
                      <Button size='sm' variant='primary' className='flex-fill'>
                        <i className='ri-stethoscope-line me-1'></i>
                        Diagnose
                      </Button>
                      <Button size='sm' variant='outline-secondary' className='flex-fill'>
                        <i className='ri-file-text-line me-1'></i>
                        Reports
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Floating notification */}
                <div
                  className='position-absolute'
                  style={{
                    top: '-20px',
                    right: '-20px',
                    animation: 'pulse 2s infinite',
                  }}
                >
                  <div className='bg-success text-white p-3 rounded-circle'>
                    <i className='ri-notification-3-line fs-5'></i>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>

        <style>{`
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.8;
            }
          }
        `}</style>
      </section>

      {/* Role-Based Features Section */}

      {/* Subscription Plans Section */}
      <section
        id='pricing-section'
        className='py-5'
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%)',
            backdropFilter: 'blur(10px)',
          }}
        />
        <Container style={{ position: 'relative', zIndex: 2 }}>
          <Row className='mb-5'>
            <Col lg={8} className='mx-auto text-center'>
              <h2 className='display-5 fw-bold mb-3 text-white'>
                <i className='ri-hospital-line me-3 text-warning'></i>
                Professional Healthcare Platform - Monthly Subscriptions
              </h2>
              <p className='lead text-white mb-4'>
                Flexible monthly subscriptions starting at $100. Add features as you need them for just $100 each per month. Simple, transparent pricing.
              </p>
              <div className='d-flex justify-content-center align-items-center gap-3 mb-4'>
                <Badge bg='warning' text='dark' className='px-3 py-2 shadow-sm'>
                  <i className='ri-shield-check-line me-2'></i>HIPAA Compliant
                </Badge>
                <Badge bg='success' text='white' className='px-3 py-2 shadow-sm'>
                  <i className='ri-robot-2-line me-2'></i>AI-Powered
                </Badge>
                <Badge bg='primary' text='white' className='px-3 py-2 shadow-sm'>
                  <i className='ri-money-dollar-circle-line me-2'></i>$100 Base + $100/Feature
                </Badge>
                <Badge bg='info' text='white' className='px-3 py-2 shadow-sm'>
                  <i className='ri-calendar-check-line me-2'></i>Monthly Billing
                </Badge>
              </div>
              {redirectMessage && (
                <Alert
                  variant='info'
                  className='mt-3'
                  dismissible
                  onClose={() => setRedirectMessage(null)}
                >
                  <Alert.Heading>Payment Required</Alert.Heading>
                  <p>{redirectMessage}</p>
                </Alert>
              )}
              {purchaseError && (
                <Alert
                  variant='danger'
                  className='mt-3'
                  dismissible
                  onClose={() => setPurchaseError(null)}
                >
                  <Alert.Heading>Payment Error</Alert.Heading>
                  <p>{purchaseError}</p>
                </Alert>
              )}
            </Col>
          </Row>

          <Row className='g-4 justify-content-center'>
            {subscriptionPlans.map((plan, index) => (
              <Col lg={4} md={6} key={index}>
                <Card
                  className={`h-100 position-relative ${
                    plan.popular ? 'border-primary shadow-lg' : 'border-0 shadow-sm'
                  }`}
                  style={{
                    transform: plan.popular ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {(plan.popular || plan.badge) && (
                    <div className='position-absolute top-0 start-50 translate-middle'>
                      <Badge bg={plan.popular ? 'primary' : 'secondary'} className='px-3 py-2'>
                        <i className='ri-star-fill me-1'></i>
                        {plan.popular ? 'Most Popular' : plan.badge}
                      </Badge>
                    </div>
                  )}
                  <Card.Body className='text-center p-4'>
                    <div className={`mb-3 text-${plan.color}`}>
                      <i className={`${plan.icon} display-4`}></i>
                    </div>
                    <Card.Title className='h4 mb-3'>{plan.name}</Card.Title>
                    <div className='mb-3'>
                      <span className='display-4 fw-bold text-primary'>{plan.price}</span>
                      <span className='text-muted'>{plan.period}</span>
                    </div>
                    {plan.limits && (
                      <div className='mb-4'>
                        <small className='text-muted bg-light px-3 py-1 rounded-pill'>
                          <i className='ri-information-line me-1'></i>
                          {plan.limits}
                        </small>
                      </div>
                    )}
                    <ul className='list-unstyled mb-4'>
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className='mb-2'>
                          <i className='ri-check-line text-success me-2'></i>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant={plan.popular ? 'primary' : 'outline-primary'}
                      size='lg'
                      className='w-100'
                      onClick={() => navigate('/billing/subscriptions')}
                      disabled={purchaseLoading}
                    >
                      {purchaseLoading ? (
                        <>
                          <span
                            className='spinner-border spinner-border-sm me-2'
                            role='status'
                            aria-hidden='true'
                          ></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <i className='ri-arrow-right-circle-line me-2'></i>
                          Choose This Plan
                        </>
                      )}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pricing Explanation Section */}
          <Row className='mt-5'>
            <Col lg={10} className='mx-auto'>
              <Card className='border-0 shadow-sm bg-white bg-opacity-90'>
                <Card.Body className='p-4'>
                  <h4 className='text-center mb-4 text-dark'>
                    <i className='ri-information-line me-2 text-primary'></i>
                    How Our Transparent Pricing Works
                  </h4>
                  <Row className='text-center'>
                    <Col md={4} className='mb-3'>
                      <div className='p-3'>
                        <div className='display-6 text-primary mb-2'>💰</div>
                        <h6 className='text-dark'>Base Platform</h6>
                        <p className='text-muted small mb-0'>
                          Start with our core healthcare platform for <strong>$100/month</strong>
                        </p>
                      </div>
                    </Col>
                    <Col md={4} className='mb-3'>
                      <div className='p-3'>
                        <div className='display-6 text-success mb-2'>🔧</div>
                        <h6 className='text-dark'>Add Features</h6>
                        <p className='text-muted small mb-0'>
                          Each additional feature costs <strong>$100/month</strong> - simple and fair
                        </p>
                      </div>
                    </Col>
                    <Col md={4} className='mb-3'>
                      <div className='p-3'>
                        <div className='display-6 text-warning mb-2'>📦</div>
                        <h6 className='text-dark'>Bundle & Save</h6>
                        <p className='text-muted small mb-0'>
                          Our packages offer <strong>up to $200/month savings</strong> vs individual features
                        </p>
                      </div>
                    </Col>
                  </Row>
                  <div className='text-center mt-3'>
                    <small className='text-muted'>
                      <i className='ri-shield-check-line me-1'></i>
                      No hidden fees • Cancel anytime • HIPAA compliant • Enterprise security included
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className='mt-4'>
            <Col lg={8} className='mx-auto text-center'>
              <p className='text-muted'>
                Need a custom solution?{' '}
                <Link to='/contact' className='text-decoration-none'>
                  Contact our sales team
                </Link>{' '}
                for enterprise pricing.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Key Features Section */}
      <section className='py-5 bg-light'>
        <Container>
          <Row className='mb-5'>
            <Col lg={8} className='mx-auto text-center'>
              <h2 className='display-5 fw-bold mb-3'>Powerful Features</h2>
              <p className='lead text-muted'>
                Advanced AI and secure infrastructure designed for healthcare
              </p>
            </Col>
          </Row>

          <Row className='g-4'>
            <Col lg={4} md={6}>
              <div className='text-center'>
                <div
                  className='bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3'
                  style={{ width: '80px', height: '80px' }}
                >
                  <i className='ri-robot-line fs-1'></i>
                </div>
                <h4>AI-Powered Assistance</h4>
                <p className='text-muted'>
                  Advanced AI chatbots and analysis tools to support clinical decisions and patient
                  care.
                </p>
              </div>
            </Col>
            <Col lg={4} md={6}>
              <div className='text-center'>
                <div
                  className='bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3'
                  style={{ width: '80px', height: '80px' }}
                >
                  <i className='ri-shield-check-line fs-1'></i>
                </div>
                <h4>Secure & Compliant</h4>
                <p className='text-muted'>
                  Bank-level security with HIPAA compliance and end-to-end encryption for all data.
                </p>
              </div>
            </Col>
            <Col lg={4} md={6}>
              <div className='text-center'>
                <div
                  className='bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3'
                  style={{ width: '80px', height: '80px' }}
                >
                  <i className='ri-bar-chart-box-line fs-1'></i>
                </div>
                <h4>Analytics & Insights</h4>
                <p className='text-muted'>
                  Comprehensive analytics and reporting to improve patient outcomes and operational
                  efficiency.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Technology Stack Section */}
      <section
        className='py-5'
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        }}
      >
        <Container>
          <Row className='mb-5'>
            <Col lg={8} className='mx-auto text-center'>
              <h2 className='display-5 fw-bold mb-3'>Built with Cutting-Edge Technology</h2>
              <p className='lead text-muted'>
                Enterprise-grade infrastructure ensuring security, scalability, and performance
              </p>
            </Col>
          </Row>
          <Row className='g-4 justify-content-center'>
            <Col lg={2} md={3} sm={4} className='text-center'>
              <div
                className='technology-item p-3'
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                }}
              >
                <i className='ri-reactjs-line display-6 text-info mb-2'></i>
                <div className='fw-medium'>React.js</div>
                <small className='text-muted'>Frontend</small>
              </div>
            </Col>
            <Col lg={2} md={3} sm={4} className='text-center'>
              <div
                className='technology-item p-3'
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                }}
              >
                <i className='ri-database-2-line display-6 text-success mb-2'></i>
                <div className='fw-medium'>Django</div>
                <small className='text-muted'>Backend</small>
              </div>
            </Col>
            <Col lg={2} md={3} sm={4} className='text-center'>
              <div
                className='technology-item p-3'
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                }}
              >
                <i className='ri-cloud-line display-6 text-primary mb-2'></i>
                <div className='fw-medium'>AWS Cloud</div>
                <small className='text-muted'>Infrastructure</small>
              </div>
            </Col>
            <Col lg={2} md={3} sm={4} className='text-center'>
              <div
                className='technology-item p-3'
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                }}
              >
                <i className='ri-brain-line display-6 text-warning mb-2'></i>
                <div className='fw-medium'>TensorFlow</div>
                <small className='text-muted'>AI/ML</small>
              </div>
            </Col>
            <Col lg={2} md={3} sm={4} className='text-center'>
              <div
                className='technology-item p-3'
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                }}
              >
                <i className='ri-shield-keyhole-line display-6 text-danger mb-2'></i>
                <div className='fw-medium'>Security</div>
                <small className='text-muted'>HIPAA</small>
              </div>
            </Col>
          </Row>

          <Row className='mt-5'>
            <Col lg={12} className='text-center'>
              <div className='d-flex justify-content-center align-items-center gap-4 flex-wrap'>
                <Badge bg='light' text='dark' className='px-3 py-2 fs-6'>
                  <i className='ri-award-line me-2'></i>ISO 27001 Certified
                </Badge>
                <Badge bg='light' text='dark' className='px-3 py-2 fs-6'>
                  <i className='ri-shield-check-line me-2'></i>SOC 2 Type II
                </Badge>
                <Badge bg='light' text='dark' className='px-3 py-2 fs-6'>
                  <i className='ri-lock-2-line me-2'></i>GDPR Compliant
                </Badge>
                <Badge bg='light' text='dark' className='px-3 py-2 fs-6'>
                  <i className='ri-time-line me-2'></i>99.9% Uptime SLA
                </Badge>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className='py-5 bg-light'>
        <Container>
          <Row className='mb-5'>
            <Col lg={8} className='mx-auto text-center'>
              <h2 className='display-5 fw-bold mb-3'>Trusted by Healthcare Professionals</h2>
            </Col>
          </Row>

          <Row className='g-4'>
            <Col lg={4}>
              <Card className='border-0 shadow-sm h-100'>
                <Card.Body className='p-4'>
                  <div className='mb-3'>
                    <div className='text-warning'>
                      <i className='ri-star-fill'></i>
                      <i className='ri-star-fill'></i>
                      <i className='ri-star-fill'></i>
                      <i className='ri-star-fill'></i>
                      <i className='ri-star-fill'></i>
                    </div>
                  </div>
                  <p className='mb-3'>
                    "The AI-powered analysis has significantly improved my diagnostic accuracy. The
                    platform is intuitive and saves me hours of administrative work."
                  </p>
                  <div className='d-flex align-items-center'>
                    <img
                      src={generatePath('/assets/images/user/01.jpg')}
                      alt='Dr. Sarah Johnson'
                      className='rounded-circle me-3'
                      style={{ width: '50px', height: '50px' }}
                    />
                    <div>
                      <div className='fw-bold'>Dr. Sarah Johnson</div>
                      <div className='text-muted small'>Cardiologist</div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4}>
              <Card className='border-0 shadow-sm h-100'>
                <Card.Body className='p-4'>
                  <div className='mb-3'>
                    <div className='text-warning'>
                      <i className='ri-star-fill'></i>
                      <i className='ri-star-fill'></i>
                      <i className='ri-star-fill'></i>
                      <i className='ri-star-fill'></i>
                      <i className='ri-star-fill'></i>
                    </div>
                  </div>
                  <p className='mb-3'>
                    "The patient management system has streamlined our workflow. The secure
                    communication features have improved patient satisfaction."
                  </p>
                  <div className='d-flex align-items-center'>
                    <img
                      src={generatePath('/assets/images/user/02.jpg')}
                      alt='Nurse Maria Garcia'
                      className='rounded-circle me-3'
                      style={{ width: '50px', height: '50px' }}
                    />
                    <div>
                      <div className='fw-bold'>Maria Garcia</div>
                      <div className='text-muted small'>Head Nurse</div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4}>
              <Card className='border-0 shadow-sm h-100'>
                <Card.Body className='p-4'>
                  <div className='mb-3'>
                    <div className='text-warning'>
                      <i className='ri-star-fill'></i>
                      <i className='ri-star-fill'></i>
                      <i className='ri-star-fill'></i>
                      <i className='ri-star-fill'></i>
                      <i className='ri-star-fill'></i>
                    </div>
                  </div>
                  <p className='mb-3'>
                    "Having all my health records in one place and being able to communicate
                    securely with my healthcare team has been life-changing."
                  </p>
                  <div className='d-flex align-items-center'>
                    <img
                      src={generatePath('/assets/images/user/03.jpg')}
                      alt='John Smith'
                      className='rounded-circle me-3'
                      style={{ width: '50px', height: '50px' }}
                    />
                    <div>
                      <div className='fw-bold'>John Smith</div>
                      <div className='text-muted small'>Patient</div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className='py-5 bg-primary text-white'>
        <Container>
          <Row className='text-center'>
            <Col lg={8} className='mx-auto'>
              <h2 className='display-5 fw-bold mb-3'>Ready to Transform Healthcare?</h2>
              <p className='lead mb-4'>
                Join thousands of healthcare professionals who trust our platform for better patient
                care.
              </p>
              <div className='d-flex gap-3 justify-content-center'>
                <Button
                  size='lg'
                  variant='light'
                  onClick={() => {
                    const pricingSection = document.querySelector('#pricing-section');
                    if (pricingSection) {
                      pricingSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className='px-4'
                >
                  Choose Your Plan
                </Button>
                <Button size='lg' variant='outline-light' as={Link} to='/login' className='px-4'>
                  Sign In
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Feature Details Modal */}
      <Modal show={showFeatureModal} onHide={() => setShowFeatureModal(false)} size='lg' centered>
        {selectedRole && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>
                <i
                  className={`${roleFeatures[selectedRole].icon} me-2 text-${roleFeatures[selectedRole].color}`}
                ></i>
                {roleFeatures[selectedRole].title}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p className='lead text-muted mb-4'>{roleFeatures[selectedRole].subtitle}</p>

              <h5 className='mb-3'>Features & Benefits:</h5>
              <Row>
                <Col md={8}>
                  <ul className='list-unstyled'>
                    {roleFeatures[selectedRole].features.map((feature, index) => (
                      <li key={index} className='mb-2'>
                        <i className='ri-check-line text-success me-2'></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Col>
                <Col md={4}>
                  <Card className='bg-light border-0'>
                    <Card.Body className='text-center'>
                      <h6 className='text-muted'>Available Plans</h6>
                      {subscriptionPlans.map((plan, index) => (
                        <div key={index} className='mb-2'>
                          <small className='text-muted'>{plan.name}</small>
                          <div
                            className={`h6 ${
                              plan.name === roleFeatures[selectedRole].recommendedPlan
                                ? 'text-primary fw-bold'
                                : 'text-secondary'
                            }`}
                          >
                            {plan.price}
                            {plan.period}
                            {plan.name === roleFeatures[selectedRole].recommendedPlan && (
                              <Badge bg='primary' className='ms-1' style={{ fontSize: '0.6rem' }}>
                                Recommended
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='secondary' onClick={() => setShowFeatureModal(false)}>
                Close
              </Button>
              <Button
                variant={roleFeatures[selectedRole].color}
                onClick={() => {
                  setShowFeatureModal(false);
                  handleGetStarted(selectedRole);
                }}
              >
                Get Started with {roleFeatures[selectedRole].title}
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </>
  );
};

export default LandingPage;
