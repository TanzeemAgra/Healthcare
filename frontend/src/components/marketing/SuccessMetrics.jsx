import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';

const SuccessMetrics = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const metrics = [
    {
      number: 98,
      suffix: '%',
      label: 'Customer Satisfaction',
      icon: 'ri-emotion-happy-line',
      color: '#10b981',
      delay: 0
    },
    {
      number: 500,
      suffix: '+',
      label: 'Healthcare Facilities',
      icon: 'ri-hospital-line',
      color: '#3b82f6',
      delay: 0.2
    },
    {
      number: 50000,
      suffix: '+',
      label: 'Medical Professionals',
      icon: 'ri-user-heart-line',
      color: '#8b5cf6',
      delay: 0.4
    },
    {
      number: 95,
      suffix: '%',
      label: 'AI Accuracy Rate',
      icon: 'ri-brain-line',
      color: '#f59e0b',
      delay: 0.6
    }
  ];

  const customerLogos = [
    { name: 'Mayo Clinic', logo: '/assets/images/customers/mayo-clinic.png' },
    { name: 'Johns Hopkins', logo: '/assets/images/customers/johns-hopkins.png' },
    { name: 'Cleveland Clinic', logo: '/assets/images/customers/cleveland-clinic.png' },
    { name: 'Mass General', logo: '/assets/images/customers/mass-general.png' }
  ];

  const successStories = [
    {
      metric: '40%',
      improvement: 'Reduction in diagnostic time',
      hospital: 'City General Hospital',
      quote: 'Dr. Max AI has transformed our emergency department efficiency.'
    },
    {
      metric: '60%',
      improvement: 'Increase in patient satisfaction',
      hospital: 'Regional Medical Center',
      quote: 'Patients love the instant access to their health information.'
    },
    {
      metric: '75%',
      improvement: 'Faster report processing',
      hospital: 'University Hospital',
      quote: 'Our radiology department processes reports 3x faster now.'
    }
  ];

  return (
    <section className="py-5 bg-gradient" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Container>
        {/* Main Metrics */}
        <Row className="text-center text-white mb-5">
          <Col lg={12}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h2 className="display-5 fw-bold mb-3">Trusted by Healthcare Leaders</h2>
              <p className="lead opacity-90 mb-5">
                Join thousands of healthcare professionals who rely on our platform
              </p>
            </motion.div>
          </Col>
        </Row>

        <div ref={ref}>
          <Row className="g-4 mb-5">
            {metrics.map((metric, index) => (
              <Col lg={3} md={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: metric.delay }}
                >
                  <Card className="border-0 shadow-lg h-100 text-center metric-card">
                    <Card.Body className="p-4">
                      <motion.div
                        className="metric-icon mb-3"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        style={{
                          width: '80px',
                          height: '80px',
                          background: `linear-gradient(135deg, ${metric.color}, ${metric.color}dd)`,
                          borderRadius: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto',
                          boxShadow: `0 10px 30px ${metric.color}40`
                        }}
                      >
                        <i className={`${metric.icon} text-white`} style={{ fontSize: '2rem' }}></i>
                      </motion.div>
                      
                      <div className="metric-number mb-2">
                        <span 
                          className="display-4 fw-bold"
                          style={{ color: metric.color }}
                        >
                          {inView && (
                            <CountUp
                              start={0}
                              end={metric.number}
                              duration={2.5}
                              delay={metric.delay}
                            />
                          )}
                          {metric.suffix}
                        </span>
                      </div>
                      
                      <h6 className="text-muted mb-0">{metric.label}</h6>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>

        {/* Success Stories */}
        <Row className="text-white">
          <Col lg={12} className="text-center mb-4">
            <h3 className="fw-bold">Real Results from Real Customers</h3>
          </Col>
        </Row>

        <Row className="g-4 mb-5">
          {successStories.map((story, index) => (
            <Col lg={4} key={index}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 * index }}
              >
                <Card className="border-0 bg-transparent text-white h-100">
                  <Card.Body className="text-center p-4">
                    <div 
                      className="display-6 fw-bold mb-2"
                      style={{ color: '#fbbf24' }}
                    >
                      {story.metric}
                    </div>
                    <h6 className="mb-3">{story.improvement}</h6>
                    <p className="opacity-90 mb-3 fst-italic">"{story.quote}"</p>
                    <small className="text-muted">- {story.hospital}</small>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Customer Logos */}
        <Row className="text-center">
          <Col lg={12}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 1 }}
            >
              <p className="text-white opacity-75 mb-4">Trusted by leading healthcare institutions</p>
              <div className="d-flex justify-content-center align-items-center flex-wrap gap-4">
                {customerLogos.map((customer, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    className="customer-logo"
                    style={{
                      padding: '15px 25px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <span className="text-white fw-bold">{customer.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .metric-card {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.95) !important;
          transition: all 0.3s ease;
        }

        .metric-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15) !important;
        }

        .customer-logo {
          transition: all 0.3s ease;
        }

        .customer-logo:hover {
          background: rgba(255, 255, 255, 0.2) !important;
        }
      `}</style>
    </section>
  );
};

export default SuccessMetrics;
