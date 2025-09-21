import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Tab, Tabs } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Chart from 'react-apexcharts';

const InteractiveDashboardPreview = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [liveData, setLiveData] = useState({
    patients: 1247,
    appointments: 89,
    reports: 156,
    satisfaction: 94
  });

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => ({
        patients: prev.patients + Math.floor(Math.random() * 3),
        appointments: prev.appointments + Math.floor(Math.random() * 2),
        reports: prev.reports + Math.floor(Math.random() * 4),
        satisfaction: 94 + Math.floor(Math.random() * 6)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const chartOptions = {
    chart: {
      type: 'area',
      height: 300,
      sparkline: { enabled: false },
      toolbar: { show: false }
    },
    colors: ['#3b82f6', '#10b981', '#f59e0b'],
    stroke: { width: 3, curve: 'smooth' },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2
      }
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      labels: { style: { colors: '#64748b' } }
    },
    yaxis: { labels: { style: { colors: '#64748b' } } },
    legend: { position: 'top' },
    grid: { borderColor: '#e2e8f0' }
  };

  const chartSeries = [
    { name: 'Patient Visits', data: [65, 78, 85, 92, 88, 95] },
    { name: 'AI Diagnoses', data: [45, 58, 72, 81, 78, 85] },
    { name: 'Satisfaction', data: [85, 87, 90, 93, 91, 96] }
  ];

  const tabData = {
    overview: {
      title: 'Healthcare Overview Dashboard',
      description: 'Complete view of your healthcare facility performance',
      features: ['Real-time patient monitoring', 'AI-powered insights', 'Performance analytics']
    },
    ai: {
      title: 'AI Assistant Dashboard',
      description: 'Dr. Max AI providing intelligent healthcare assistance',
      features: ['Smart diagnosis suggestions', 'MCQ generation', 'Clinical decision support']
    },
    radiology: {
      title: 'Radiology Analysis Platform',
      description: 'Advanced radiology report analysis and management',
      features: ['Automated report analysis', 'Image processing', 'DICOM integration']
    }
  };

  const recentActivities = [
    { type: 'diagnosis', text: 'AI diagnosed pneumonia in chest X-ray', time: '2 min ago', status: 'success' },
    { type: 'appointment', text: 'New appointment scheduled', time: '5 min ago', status: 'info' },
    { type: 'report', text: 'Radiology report analyzed', time: '8 min ago', status: 'warning' },
    { type: 'alert', text: 'Patient vitals monitored', time: '12 min ago', status: 'primary' }
  ];

  return (
    <section className="py-5 position-relative overflow-hidden">
      {/* Healthcare Dashboard Background */}
      <div 
        className="position-absolute w-100 h-100"
        style={{
          backgroundImage: `url('/assets/images/healthcare/ai-dashboard-1600x900.svg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.1,
          zIndex: 1
        }}
      />

      <Container className="position-relative" style={{ zIndex: 2 }}>
        <Row className="mb-5">
          <Col lg={8} className="mx-auto text-center">
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <Badge bg="primary" className="px-3 py-2 mb-3" style={{ fontSize: '0.875rem' }}>
                <i className="ri-eye-line me-2"></i>
                Live Preview
              </Badge>
              <h2 className="display-5 fw-bold mb-3">Experience the Dashboard</h2>
              <p className="lead text-muted">
                See how our AI-powered healthcare platform transforms patient care with real-time insights
              </p>
            </motion.div>
          </Col>
        </Row>

        {/* Interactive Tabs */}
        <Row className="mb-4">
          <Col lg={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Tabs
                activeKey={activeTab}
                onSelect={setActiveTab}
                className="nav-pills-custom justify-content-center mb-4"
              >
                <Tab eventKey="overview" title={
                  <span><i className="ri-dashboard-line me-2"></i>Overview</span>
                }>
                </Tab>
                <Tab eventKey="ai" title={
                  <span><i className="ri-robot-line me-2"></i>AI Assistant</span>
                }>
                </Tab>
                <Tab eventKey="radiology" title={
                  <span><i className="ri-scan-line me-2"></i>Radiology</span>
                }>
                </Tab>
              </Tabs>
            </motion.div>
          </Col>
        </Row>

        {/* Dashboard Preview */}
        <Row className="g-4">
          <Col lg={8}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="border-0 shadow-lg dashboard-card">
                <Card.Header className="bg-transparent border-0 p-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h4 className="mb-1">{tabData[activeTab].title}</h4>
                      <p className="text-muted mb-0">{tabData[activeTab].description}</p>
                    </div>
                    <div className="d-flex align-items-center">
                      <div className="live-indicator me-3">
                        <span className="badge bg-success">
                          <span className="live-dot"></span>
                          LIVE
                        </span>
                      </div>
                    </div>
                  </div>
                </Card.Header>

                <Card.Body className="p-4">
                  {/* Live Metrics */}
                  <Row className="g-3 mb-4">
                    <Col md={3}>
                      <div className="metric-box text-center p-3">
                        <div className="metric-icon mb-2">
                          <i className="ri-user-heart-line text-primary fs-2"></i>
                        </div>
                        <div className="metric-number text-primary fw-bold fs-4">
                          <motion.span
                            key={liveData.patients}
                            initial={{ scale: 1.2, color: '#10b981' }}
                            animate={{ scale: 1, color: '#3b82f6' }}
                            transition={{ duration: 0.3 }}
                          >
                            {liveData.patients.toLocaleString()}
                          </motion.span>
                        </div>
                        <div className="metric-label text-muted small">Total Patients</div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="metric-box text-center p-3">
                        <div className="metric-icon mb-2">
                          <i className="ri-calendar-check-line text-success fs-2"></i>
                        </div>
                        <div className="metric-number text-success fw-bold fs-4">
                          <motion.span
                            key={liveData.appointments}
                            initial={{ scale: 1.2, color: '#10b981' }}
                            animate={{ scale: 1, color: '#10b981' }}
                            transition={{ duration: 0.3 }}
                          >
                            {liveData.appointments}
                          </motion.span>
                        </div>
                        <div className="metric-label text-muted small">Today's Appointments</div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="metric-box text-center p-3">
                        <div className="metric-icon mb-2">
                          <i className="ri-file-text-line text-warning fs-2"></i>
                        </div>
                        <div className="metric-number text-warning fw-bold fs-4">
                          <motion.span
                            key={liveData.reports}
                            initial={{ scale: 1.2, color: '#f59e0b' }}
                            animate={{ scale: 1, color: '#f59e0b' }}
                            transition={{ duration: 0.3 }}
                          >
                            {liveData.reports}
                          </motion.span>
                        </div>
                        <div className="metric-label text-muted small">Reports Generated</div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="metric-box text-center p-3">
                        <div className="metric-icon mb-2">
                          <i className="ri-emotion-happy-line text-info fs-2"></i>
                        </div>
                        <div className="metric-number text-info fw-bold fs-4">
                          <motion.span
                            key={liveData.satisfaction}
                            initial={{ scale: 1.2, color: '#06b6d4' }}
                            animate={{ scale: 1, color: '#06b6d4' }}
                            transition={{ duration: 0.3 }}
                          >
                            {liveData.satisfaction}%
                          </motion.span>
                        </div>
                        <div className="metric-label text-muted small">Satisfaction Rate</div>
                      </div>
                    </Col>
                  </Row>

                  {/* Chart */}
                  <div className="chart-container">
                    <h6 className="mb-3">Performance Trends</h6>
                    <Chart 
                      options={chartOptions} 
                      series={chartSeries} 
                      type="area" 
                      height={250}
                    />
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          {/* Feature Panel */}
          <Col lg={4}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {/* Features Card */}
              <Card className="border-0 shadow-lg mb-4">
                <Card.Body className="p-4">
                  <h5 className="mb-3">
                    <i className="ri-star-line me-2 text-warning"></i>
                    Key Features
                  </h5>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {tabData[activeTab].features.map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="d-flex align-items-center mb-3"
                        >
                          <div 
                            className="feature-check me-3"
                            style={{
                              width: '24px',
                              height: '24px',
                              background: 'linear-gradient(135deg, #10b981, #059669)',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <i className="ri-check-line text-white" style={{ fontSize: '14px' }}></i>
                          </div>
                          <span>{feature}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </Card.Body>
              </Card>

              {/* Recent Activity */}
              <Card className="border-0 shadow-lg">
                <Card.Body className="p-4">
                  <h6 className="mb-3">
                    <i className="ri-notification-line me-2 text-primary"></i>
                    Recent Activity
                  </h6>
                  <div className="activity-feed">
                    {recentActivities.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="activity-item d-flex align-items-start mb-3"
                      >
                        <div 
                          className={`activity-indicator me-3 bg-${activity.status}`}
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            marginTop: '6px'
                          }}
                        ></div>
                        <div className="flex-grow-1">
                          <div className="activity-text small">{activity.text}</div>
                          <div className="activity-time text-muted" style={{ fontSize: '0.75rem' }}>
                            {activity.time}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* CTA Section */}
        <Row className="mt-5">
          <Col lg={8} className="mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <h4 className="mb-3">Ready to Transform Your Healthcare Facility?</h4>
              <p className="text-muted mb-4">
                Experience the full power of our AI-driven healthcare platform
              </p>
              <div className="d-flex gap-3 justify-content-center">
                <Button size="lg" variant="primary" className="px-4">
                  <i className="ri-play-circle-line me-2"></i>
                  Start Free Demo
                </Button>
                <Button size="lg" variant="outline-primary" className="px-4">
                  <i className="ri-phone-line me-2"></i>
                  Schedule Call
                </Button>
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .dashboard-card {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.95) !important;
        }

        .metric-box {
          background: rgba(255, 255, 255, 0.7);
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .metric-box:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .live-indicator .live-dot {
          width: 8px;
          height: 8px;
          background: currentColor;
          border-radius: 50%;
          display: inline-block;
          animation: pulse-dot 2s infinite;
          margin-right: 5px;
        }

        @keyframes pulse-dot {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        .nav-pills-custom .nav-link {
          border-radius: 25px;
          padding: 12px 24px;
          margin: 0 5px;
          border: 2px solid transparent;
          transition: all 0.3s ease;
        }

        .nav-pills-custom .nav-link.active {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          border-color: #3b82f6;
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(59, 130, 246, 0.3);
        }

        .activity-feed {
          max-height: 200px;
          overflow-y: auto;
        }

        .chart-container {
          background: rgba(248, 249, 250, 0.5);
          border-radius: 12px;
          padding: 20px;
        }
      `}</style>
    </section>
  );
};

export default InteractiveDashboardPreview;
