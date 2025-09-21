import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import Typed from 'react-typed';

const VideoHeroSection = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    "AI-Powered Healthcare",
    "Smart Diagnostics",
    "Secure Patient Data",
    "Real-time Analytics",
    "Seamless Integration"
  ];

  const floatingElements = [
    { icon: 'ri-heart-pulse-line', color: '#ef4444', delay: 0, size: '60px' },
    { icon: 'ri-brain-line', color: '#8b5cf6', delay: 0.5, size: '50px' },
    { icon: 'ri-shield-check-line', color: '#10b981', delay: 1, size: '55px' },
    { icon: 'ri-stethoscope-line', color: '#3b82f6', delay: 1.5, size: '65px' },
    { icon: 'ri-hospital-line', color: '#f59e0b', delay: 2, size: '50px' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      className="hero-section position-relative overflow-hidden"
      style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}
    >
      {/* Healthcare Background */}
      <div className="video-background position-absolute w-100 h-100">
        <div 
          className="video-overlay position-absolute w-100 h-100"
          style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.85) 0%, rgba(139, 92, 246, 0.75) 100%)',
            zIndex: 2
          }}
        />
        
        {/* Professional Healthcare Background */}
        <div 
          className="healthcare-bg position-absolute w-100 h-100"
          style={{
            backgroundImage: `url('/assets/images/healthcare/medical-hero-1600x900.svg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: 1
          }}
        />

        {/* Floating medical icons */}
        {floatingElements.map((element, index) => (
          <motion.div
            key={index}
            className="position-absolute"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 0.6, 
              scale: 1,
              y: [0, -20, 0],
              x: [0, 10, 0]
            }}
            transition={{
              duration: 4,
              delay: element.delay,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{
              top: `${20 + (index * 15)}%`,
              left: `${10 + (index * 20)}%`,
              zIndex: 1
            }}
          >
            <div
              style={{
                width: element.size,
                height: element.size,
                background: `linear-gradient(135deg, ${element.color}, ${element.color}cc)`,
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 10px 30px ${element.color}40`,
                backdropFilter: 'blur(10px)'
              }}
            >
              <i 
                className={element.icon} 
                style={{ 
                  color: 'white', 
                  fontSize: `${parseInt(element.size) * 0.4}px` 
                }}
              ></i>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <Container className="position-relative" style={{ zIndex: 3 }}>
        <Row className="align-items-center min-vh-100">
          <Col lg={6} className="text-white">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              {/* Animated Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-4"
              >
                <Badge 
                  className="px-4 py-3 fs-6 fw-normal"
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '25px'
                  }}
                >
                  <motion.i 
                    className="ri-sparkle-line me-2"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                  <Typed
                    strings={features}
                    typeSpeed={80}
                    backSpeed={60}
                    backDelay={2000}
                    loop
                  />
                </Badge>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                className="display-2 fw-bold mb-4"
                style={{ lineHeight: '1.1', letterSpacing: '-0.02em' }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
              >
                Transform Healthcare with{' '}
                <motion.span
                  style={{
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                  animate={{
                    backgroundPosition: ['0%', '100%', '0%']
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  AI Intelligence
                </motion.span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="fs-4 mb-5 opacity-90"
                style={{ lineHeight: '1.6' }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                Empowering healthcare professionals with cutting-edge AI tools, 
                secure patient management, and intelligent analytics for superior health outcomes.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="d-flex flex-column flex-sm-row gap-3 mb-5"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="px-5 py-3 fw-bold fs-5"
                    style={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                      border: 'none',
                      borderRadius: '15px',
                      color: '#1e293b',
                      boxShadow: '0 10px 30px rgba(255, 255, 255, 0.3)'
                    }}
                  >
                    <i className="ri-rocket-line me-2"></i>
                    Start Free Trial
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="outline-light"
                    className="px-5 py-3 fw-bold fs-5"
                    style={{
                      borderRadius: '15px',
                      borderWidth: '2px',
                      backdropFilter: 'blur(10px)',
                      background: 'rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <i className="ri-play-circle-line me-2"></i>
                    Watch Demo
                  </Button>
                </motion.div>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                className="trust-indicators"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
              >
                <div className="d-flex flex-wrap align-items-center gap-4 opacity-75">
                  <motion.div
                    className="d-flex align-items-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div
                      className="trust-badge me-2"
                      style={{
                        width: '40px',
                        height: '40px',
                        background: 'rgba(16, 185, 129, 0.2)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(16, 185, 129, 0.3)'
                      }}
                    >
                      <i className="ri-shield-check-line text-white"></i>
                    </div>
                    <span className="fw-medium">HIPAA Compliant</span>
                  </motion.div>

                  <motion.div
                    className="d-flex align-items-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div
                      className="trust-badge me-2"
                      style={{
                        width: '40px',
                        height: '40px',
                        background: 'rgba(59, 130, 246, 0.2)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(59, 130, 246, 0.3)'
                      }}
                    >
                      <i className="ri-award-line text-white"></i>
                    </div>
                    <span className="fw-medium">ISO 27001 Certified</span>
                  </motion.div>

                  <motion.div
                    className="d-flex align-items-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div
                      className="trust-badge me-2"
                      style={{
                        width: '40px',
                        height: '40px',
                        background: 'rgba(139, 92, 246, 0.2)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(139, 92, 246, 0.3)'
                      }}
                    >
                      <i className="ri-star-line text-white"></i>
                    </div>
                    <span className="fw-medium">5-Star Rated</span>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </Col>

          <Col lg={6}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="text-center"
            >
              {/* Animated Device Mockup */}
              <div 
                className="device-mockup position-relative"
                style={{ maxWidth: '600px', margin: '0 auto' }}
              >
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    rotateY: [-2, 2, -2]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{
                    perspective: '1000px',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <div
                    className="mockup-screen"
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '20px',
                      padding: '30px',
                      boxShadow: '0 30px 80px rgba(0, 0, 0, 0.3)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}
                  >
                    {/* Mockup Dashboard Content */}
                    <div className="mockup-header d-flex justify-content-between align-items-center mb-4">
                      <div className="d-flex align-items-center">
                        <div 
                          style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: '#ef4444',
                            marginRight: '8px'
                          }}
                        ></div>
                        <div 
                          style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: '#f59e0b',
                            marginRight: '8px'
                          }}
                        ></div>
                        <div 
                          style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: '#10b981'
                          }}
                        ></div>
                      </div>
                      <small className="text-muted fw-bold">Healthcare Dashboard</small>
                    </div>

                    <div className="mockup-content">
                      <div className="d-flex justify-content-between mb-3">
                        <div className="metric-card flex-grow-1 me-2 text-center p-3 bg-primary-subtle rounded">
                          <div className="fw-bold text-primary">1,247</div>
                          <small className="text-muted">Patients</small>
                        </div>
                        <div className="metric-card flex-grow-1 me-2 text-center p-3 bg-success-subtle rounded">
                          <div className="fw-bold text-success">89</div>
                          <small className="text-muted">Appointments</small>
                        </div>
                        <div className="metric-card flex-grow-1 text-center p-3 bg-warning-subtle rounded">
                          <div className="fw-bold text-warning">98%</div>
                          <small className="text-muted">Satisfaction</small>
                        </div>
                      </div>

                      <div 
                        className="chart-placeholder bg-light rounded p-4 mb-3"
                        style={{ height: '150px', position: 'relative' }}
                      >
                        <motion.div
                          className="position-absolute"
                          style={{
                            width: '100%',
                            height: '2px',
                            background: 'linear-gradient(90deg, #3b82f6, #10b981, #f59e0b)',
                            bottom: '20px',
                            left: 0,
                            borderRadius: '2px'
                          }}
                          animate={{
                            width: ['0%', '100%', '0%']
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                        <small className="text-muted">Real-time Analytics</small>
                      </div>

                      <div className="activity-list">
                        <motion.div 
                          className="activity-item d-flex align-items-center p-2 bg-light rounded mb-2"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <div className="activity-dot bg-success rounded-circle me-3" style={{ width: '8px', height: '8px' }}></div>
                          <small>AI diagnosed pneumonia - 2 min ago</small>
                        </motion.div>
                        <div className="activity-item d-flex align-items-center p-2 bg-light rounded">
                          <div className="activity-dot bg-primary rounded-circle me-3" style={{ width: '8px', height: '8px' }}></div>
                          <small>New appointment scheduled - 5 min ago</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .animated-bg {
          animation: backgroundShift 20s ease-in-out infinite;
        }

        @keyframes backgroundShift {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .trust-badge {
          transition: all 0.3s ease;
        }

        .device-mockup {
          filter: drop-shadow(0 25px 50px rgba(0, 0, 0, 0.15));
        }

        .mockup-screen {
          position: relative;
          overflow: hidden;
        }

        .mockup-screen::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          animation: shine 3s infinite;
        }

        @keyframes shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .metric-card {
          transition: all 0.3s ease;
        }

        .metric-card:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </section>
  );
};

export default VideoHeroSection;
