import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  OverlayTrigger,
  Tooltip,
  ListGroup,
  ProgressBar,
  Alert,
  Modal,
  Form
} from 'react-bootstrap';

const MedicineAdvancedFeatures = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);

  // Add CSS for hover effects
  const featureCardStyle = `
    .feature-card {
      transition: all 0.3s ease;
    }
    .feature-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    }
    .feature-card.selected {
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    }
  `;

  useEffect(() => {
    // Add styles to head
    const styleElement = document.createElement('style');
    styleElement.textContent = featureCardStyle;
    document.head.appendChild(styleElement);

    return () => {
      // Cleanup
      document.head.removeChild(styleElement);
    };
  }, []);

  const features = [
    {
      id: 'patient-reports',
      title: 'Patient Reports',
      description: 'Comprehensive patient report generation with AI summaries',
      icon: 'ri-file-text-line',
      color: '#1976d2',
      stats: { total: 245, pending: 12, sent: 200 },
      capabilities: [
        'Medical Summary Reports',
        'Discharge Summaries',
        'Lab Result Compilations',
        'AI-Generated Insights',
        'Multi-recipient Distribution'
      ]
    },
    {
      id: 'soap-notes',
      title: 'SOAP Notes Generator',
      description: 'Structured clinical documentation with AI assistance',
      icon: 'ri-article-line',
      color: '#388e3c',
      stats: { total: 1567, templates: 45, aiSuggestions: 892 },
      capabilities: [
        'Subjective Assessment',
        'Objective Findings',
        'Clinical Assessment',
        'Treatment Planning',
        'AI Differential Diagnosis'
      ]
    },
    {
      id: 'protocol-summarizer',
      title: 'Protocol Summarizer',
      description: 'Medical guidelines and protocol management',
      icon: 'ri-bookmark-line',
      color: '#f57c00',
      stats: { protocols: 156, active: 134, views: 5670 },
      capabilities: [
        'Treatment Protocols',
        'Emergency Guidelines',
        'Safety Procedures',
        'AI Key Point Extraction',
        'Version Control'
      ]
    },
    {
      id: 'contract-redlining',
      title: 'Contract Redlining',
      description: 'AI-powered contract review and risk analysis',
      icon: 'ri-gavel-line',
      color: '#d32f2f',
      stats: { contracts: 89, reviewed: 67, approved: 45 },
      capabilities: [
        'Risk Assessment',
        'Automated Redlining',
        'Compliance Checking',
        'Workflow Management',
        'Legal Document Analysis'
      ]
    },
    {
      id: 'physician-assistant',
      title: 'AI Physician Assistant',
      description: 'Clinical decision support with AI recommendations',
      icon: 'ri-brain-line',
      color: '#7b1fa2',
      stats: { consultations: 2340, accuracy: 94, helpful: 98 },
      capabilities: [
        'Diagnosis Support',
        'Treatment Planning',
        'Drug Interaction Checks',
        'Risk Assessment',
        'Clinical Guidelines'
      ]
    },
    {
      id: 'ai-booking',
      title: 'AI Booking Assistant',
      description: 'Intelligent appointment scheduling system',
      icon: 'ri-calendar-schedule-line',
      color: '#0288d1',
      stats: { bookings: 3456, automated: 87, satisfaction: 96 },
      capabilities: [
        'Smart Scheduling',
        'Patient Preferences',
        'Multi-channel Support',
        'Automated Confirmations',
        'Conflict Resolution'
      ]
    },
    {
      id: 'insurance-copilot',
      title: 'Insurance Policy Copilot',
      description: 'Coverage analysis and policy management',
      icon: 'ri-shield-check-line',
      color: '#5d4037',
      stats: { policies: 1890, claims: 567, coverage: 99 },
      capabilities: [
        'Coverage Analysis',
        'Cost Estimation',
        'Claims Tracking',
        'Benefit Optimization',
        'Policy Comparison'
      ]
    },
    {
      id: 'csr-assistant',
      title: 'Hospital CSR Assistant',
      description: 'AI-powered customer service support',
      icon: 'ri-customer-service-line',
      color: '#00796b',
      stats: { tickets: 2340, resolved: 89, avgTime: 12 },
      capabilities: [
        'Inquiry Management',
        'AI Response Suggestions',
        'Sentiment Analysis',
        'Escalation Management',
        'Performance Metrics'
      ]
    },
    {
      id: 'research-review',
      title: 'Medical Research Review',
      description: 'Research analysis and quality assessment',
      icon: 'ri-microscope-line',
      color: '#e64a19',
      stats: { reviews: 456, rated: 389, recommended: 234 },
      capabilities: [
        'Quality Assessment',
        'Evidence Grading',
        'Critical Analysis',
        'Clinical Relevance',
        'Research Recommendations'
      ]
    },
    {
      id: 'back-office-automation',
      title: 'Back Office Automation',
      description: 'Automated administrative task management',
      icon: 'ri-robot-line',
      color: '#fbc02d',
      stats: { tasks: 145, automated: 98, efficiency: 156 },
      capabilities: [
        'Billing Automation',
        'Claims Processing',
        'Appointment Reminders',
        'Report Generation',
        'Workflow Optimization'
      ]
    },
    {
      id: 'clinical-search',
      title: 'Clinical History Search',
      description: 'Advanced clinical data search with AI',
      icon: 'ri-search-2-line',
      color: '#8e24aa',
      stats: { searches: 5670, results: 45600, relevance: 92 },
      capabilities: [
        'Semantic Search',
        'Natural Language Query',
        'Advanced Filtering',
        'Relevance Scoring',
        'Search Analytics'
      ]
    }
  ];

  const handleFeatureSelect = (feature) => {
    setSelectedFeature(feature);
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const renderFeatureCard = (feature) => (
    <Card
      key={feature.id}
      className={`h-100 feature-card ${selectedFeature?.id === feature.id ? 'selected' : ''}`}
      style={{
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: selectedFeature?.id === feature.id ? `2px solid ${feature.color}` : '1px solid #dee2e6',
      }}
      onClick={() => handleFeatureSelect(feature)}
    >
      <Card.Body>
        <div className="d-flex align-items-center mb-2">
          <div 
            className="rounded-circle me-2 d-flex align-items-center justify-content-center"
            style={{ 
              backgroundColor: feature.color, 
              width: '40px', 
              height: '40px',
              color: 'white'
            }}
          >
            <i className={feature.icon}></i>
          </div>
          <div className="flex-grow-1">
            <h6 className="mb-1 text-truncate">{feature.title}</h6>
            <p className="text-muted small mb-0">{feature.description}</p>
          </div>
        </div>

        <div className="mb-2">
          {Object.entries(feature.stats).map(([key, value]) => (
            <Badge
              key={key}
              bg="primary"
              className="me-1 mb-1"
              style={{ fontSize: '0.7rem' }}
            >
              {key.toUpperCase()}: {value}{key.includes('percentage') || key === 'accuracy' || key === 'satisfaction' || key === 'helpful' || key === 'relevance' ? '%' : ''}
            </Badge>
          ))}
        </div>

        <ListGroup variant="flush">
          {feature.capabilities.slice(0, 3).map((capability, index) => (
            <ListGroup.Item key={index} className="px-0 py-1 border-0 d-flex align-items-center">
              <i className="ri-check-line text-success me-2 small"></i>
              <small>{capability}</small>
            </ListGroup.Item>
          ))}
          {feature.capabilities.length > 3 && (
            <small className="text-muted mt-1">
              +{feature.capabilities.length - 3} more capabilities
            </small>
          )}
        </ListGroup>
      </Card.Body>
    </Card>
  );

  const renderFeatureDetails = () => {
    if (!selectedFeature) {
      return (
        <Card className="h-100">
          <Card.Body className="text-center d-flex flex-column justify-content-center">
            <i className="ri-brain-line" style={{ fontSize: '4rem', color: '#6c757d', marginBottom: '1rem' }}></i>
            <h5>Select a Feature to Explore</h5>
            <p className="text-muted">
              Click on any feature card to view detailed information and capabilities
            </p>
          </Card.Body>
        </Card>
      );
    }

    return (
      <Card className="h-100">
        <Card.Body>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center h-100">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="d-flex align-items-center mb-3">
                <div 
                  className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                  style={{ 
                    backgroundColor: selectedFeature.color, 
                    width: '56px', 
                    height: '56px',
                    color: 'white'
                  }}
                >
                  <i className={selectedFeature.icon} style={{ fontSize: '1.5rem' }}></i>
                </div>
                <div>
                  <h4 className="mb-1">{selectedFeature.title}</h4>
                  <p className="text-muted mb-0">{selectedFeature.description}</p>
                </div>
              </div>

              <hr className="mb-3" />

              <h6 className="mb-3">Key Statistics</h6>
              <Row className="mb-3">
                {Object.entries(selectedFeature.stats).map(([key, value]) => (
                  <Col xs={12} sm={4} key={key} className="mb-2">
                    <Card className="border">
                      <Card.Body className="text-center">
                        <h4 className="text-primary mb-1">
                          {value}{key.includes('percentage') || key === 'accuracy' || key === 'satisfaction' || key === 'helpful' || key === 'relevance' ? '%' : ''}
                        </h4>
                        <small className="text-muted">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </small>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              <h6 className="mb-3">Full Capabilities</h6>
              <ListGroup className="mb-3">
                {selectedFeature.capabilities.map((capability, index) => (
                  <ListGroup.Item key={index} className="d-flex align-items-center">
                    <i className="ri-star-fill text-primary me-2"></i>
                    {capability}
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <div className="mt-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="me-2"
                >
                  <i className="ri-trending-up-line me-1"></i>
                  View Analytics
                </Button>
                <Button
                  variant="outline-primary"
                  size="lg"
                >
                  <i className="ri-speed-line me-1"></i>
                  Quick Actions
                </Button>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    );
  };

  return (
    <Container fluid className="py-4">
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h1 className="mb-2">Advanced Medicine Features</h1>
            <h6 className="text-muted mb-0">
              Comprehensive healthcare management with AI-powered assistance
            </h6>
          </div>
          <div>
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => window.open('/medicine/management', '_blank')}
              className="me-2"
            >
              <i className="ri-settings-3-line me-2"></i>
              Management Dashboard
            </Button>
            <Button 
              variant="outline-primary" 
              size="lg"
              onClick={() => window.location.reload()}
            >
              <i className="ri-refresh-line me-2"></i>
              Refresh
            </Button>
          </div>
        </div>
        
        <Card className="mb-3" style={{ backgroundColor: '#f8f9fa' }}>
          <Card.Body>
            <Row className="align-items-center">
              <Col xs={12} sm={3} className="text-center">
                <h4 className="text-primary mb-1">11</h4>
                <small>Advanced Features</small>
              </Col>
              <Col xs={12} sm={3} className="text-center">
                <h4 className="text-success mb-1">95%</h4>
                <small>AI Accuracy</small>
              </Col>
              <Col xs={12} sm={3} className="text-center">
                <h4 className="text-warning mb-1">24/7</h4>
                <small>Availability</small>
              </Col>
              <Col xs={12} sm={3} className="text-center">
                <h4 className="text-info mb-1">50K+</h4>
                <small>Processed Records</small>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>

      <Row>
        <Col xs={12} lg={8}>
          <Row>
            {features.map((feature) => (
              <Col xs={12} sm={6} md={4} key={feature.id} className="mb-3">
                {renderFeatureCard(feature)}
              </Col>
            ))}
          </Row>
        </Col>
        
        <Col xs={12} lg={4}>
          {renderFeatureDetails()}
        </Col>
      </Row>

      <div className="mt-4">
        <Card>
          <Card.Body>
            <h5 className="mb-3">System Health & Performance</h5>
            <Row>
              <Col xs={12} sm={6} md={3} className="mb-3">
                <div>
                  <small className="text-muted d-block mb-1">AI Processing Speed</small>
                  <ProgressBar now={92} className="mb-1" />
                  <small className="text-muted">92% Optimal</small>
                </div>
              </Col>
              <Col xs={12} sm={6} md={3} className="mb-3">
                <div>
                  <small className="text-muted d-block mb-1">System Uptime</small>
                  <ProgressBar now={99.9} variant="success" className="mb-1" />
                  <small className="text-muted">99.9% Available</small>
                </div>
              </Col>
              <Col xs={12} sm={6} md={3} className="mb-3">
                <div>
                  <small className="text-muted d-block mb-1">User Satisfaction</small>
                  <ProgressBar now={96} variant="warning" className="mb-1" />
                  <small className="text-muted">96% Satisfied</small>
                </div>
              </Col>
              <Col xs={12} sm={6} md={3} className="mb-3">
                <div>
                  <small className="text-muted d-block mb-1">Data Security</small>
                  <ProgressBar now={100} variant="danger" className="mb-1" />
                  <small className="text-muted">100% Secure</small>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default MedicineAdvancedFeatures;
