import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { HEALTHCARE_MODULES } from '../utils/modulePermissions';
import { 
  RiMedicineBottleLine, 
  RiHeartPulseLine, 
  RiScanLine, 
  RiCapsuleLine, 
  RiMicroscopeLine, 
  RiShieldCheckLine,
  RiUserHeartLine,
  RiTestTubeLine,
  RiBrushLine,
  RiLeafLine
} from '@remixicon/react';

const HealthcareModulesOverview = () => {
  // Custom styles for purple color
  const customStyles = `
    .bg-purple {
      background-color: #8B5CF6 !important;
    }
    .text-purple {
      color: #8B5CF6 !important;
    }
    .btn-purple {
      background-color: #8B5CF6;
      border-color: #8B5CF6;
      color: white;
    }
    .btn-purple:hover {
      background-color: #7C3AED;
      border-color: #7C3AED;
      color: white;
    }
    .btn-outline-purple {
      color: #8B5CF6;
      border-color: #8B5CF6;
    }
    .btn-outline-purple:hover {
      background-color: #8B5CF6;
      border-color: #8B5CF6;
      color: white;
    }
    .bg-purple.bg-opacity-10 {
      background-color: rgba(139, 92, 246, 0.1) !important;
    }
  `;

  // Inject styles
  React.useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = customStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Icon mapping for each module
  const moduleIconMap = {
    medicine: RiMedicineBottleLine,
    dermatology: RiHeartPulseLine,
    cosmetology: RiBrushLine,
    radiology: RiScanLine,
    dentistry: RiCapsuleLine,
    pathology: RiMicroscopeLine,
    allopathy: RiUserHeartLine,
    dna_sequencing: RiTestTubeLine,
    secureneat: RiShieldCheckLine,
    homeopathy: RiLeafLine
  };

  // Dynamic modules configuration based on HEALTHCARE_MODULES
  const modules = Object.entries(HEALTHCARE_MODULES).map(([key, module]) => {
    const moduleConfigs = {
      medicine: {
        description: 'Comprehensive patient management, electronic health records, and clinical decision support for general practice.',
        features: ['Patient Management', 'EHR System', 'Prescription Management', 'Clinical Notes', 'Lab Integration'],
        color: 'primary',
        demoAvailable: true
      },
      dermatology: {
        description: 'Advanced skin condition analysis, AI-powered diagnosis, and treatment planning for dermatological care.',
        features: ['Skin Analysis', 'AI Diagnosis', 'Image Recognition', 'Treatment Plans', 'Progress Tracking'],
        color: 'success',
        demoAvailable: true
      },
      cosmetology: {
        description: 'Professional beauty salon management with comprehensive treatment planning and cosmetic service tracking.',
        features: ['Client Management', 'Beauty Services', 'Product Inventory', 'Appointment Booking', 'Treatment Plans'],
        color: 'purple',
        demoAvailable: true,
        isNew: true
      },
      radiology: {
        description: 'Digital imaging, DICOM viewer, and AI-assisted radiology reporting for accurate diagnostics.',
        features: ['DICOM Viewer', 'Image Analysis', 'Report Generation', 'AI Assistance', '3D Reconstruction'],
        color: 'info',
        demoAvailable: true
      },
      dentistry: {
        description: 'Complete dental practice management with treatment planning and patient care coordination.',
        features: ['Dental Records', 'Treatment Planning', 'Appointment Scheduling', 'X-ray Management', 'Billing'],
        color: 'warning',
        demoAvailable: true
      },
      pathology: {
        description: 'Laboratory information management, test result tracking, and automated reporting systems.',
        features: ['Lab Management', 'Test Tracking', 'Result Analysis', 'Quality Control', 'Automated Reports'],
        color: 'danger',
        demoAvailable: true
      },
      allopathy: {
        description: 'Comprehensive allopathic medicine management with evidence-based treatment protocols and clinical guidelines.',
        features: ['Clinical Protocols', 'Drug Interactions', 'Treatment Guidelines', 'Evidence-Based Medicine', 'Patient Monitoring'],
        color: 'secondary',
        demoAvailable: true
      },
      dna_sequencing: {
        description: 'Advanced genomic analysis and DNA sequencing laboratory management with comprehensive bioinformatics tools.',
        features: ['Genome Analysis', 'Variant Calling', 'Quality Control', 'Pharmacogenomics', 'Clinical Reports'],
        color: 'info',
        demoAvailable: true
      },
      secureneat: {
        description: 'Advanced security and compliance management with HIPAA compliance and data encryption.',
        features: ['Data Encryption', 'HIPAA Compliance', 'Access Control', 'Audit Logs', 'Security Monitoring'],
        color: 'dark',
        demoAvailable: false
      },
      homeopathy: {
        description: 'Holistic homeopathic treatment management with natural remedy recommendations and patient care.',
        features: ['Natural Remedies', 'Holistic Treatment', 'Patient Constitution', 'Remedy Selection', 'Case Management'],
        color: 'success',
        demoAvailable: true
      }
    };

    const config = moduleConfigs[key] || {
      description: module.description || 'Healthcare module management system.',
      features: ['Management', 'Records', 'Analytics', 'Reports', 'Integration'],
      color: 'primary',
      demoAvailable: false
    };

    return {
      id: key,
      name: module.name,
      icon: moduleIconMap[key] || RiMedicineBottleLine,
      ...config
    };
  });

  const IconComponent = ({ icon: Icon, color }) => (
    <div className={`bg-${color} text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3`}
         style={{ width: '60px', height: '60px' }}>
      <Icon size={24} />
    </div>
  );

  return (
    <div className="min-vh-100 bg-light">
      {/* Hero Section */}
      <section className="py-5 bg-gradient" style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
      }}>
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center text-white">
              <h1 className="display-4 fw-bold mb-4">{Object.keys(HEALTHCARE_MODULES).length} Healthcare Modules</h1>
              <p className="lead mb-4">
                Explore our comprehensive suite of {Object.keys(HEALTHCARE_MODULES).length} healthcare management modules designed 
                to streamline your practice and improve patient care.
              </p>
              <Button 
                as={Link} 
                to="/mastermind-subscription" 
                variant="light" 
                size="lg"
                className="me-3"
              >
                View Pricing Plans
              </Button>
              <Button 
                as={Link} 
                to="/contact" 
                variant="outline-light" 
                size="lg"
              >
                Contact Expert for Demo
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Modules Grid */}
      <section className="py-5">
        <Container>
          <Row className="g-4">
            {modules.map((module) => (
              <Col key={module.id} lg={6} xl={4}>
                <Card className="h-100 shadow-sm border-0 hover-card">
                  <Card.Body className="p-4 text-center">
                    <div className="position-relative">
                      <IconComponent icon={module.icon} color={module.color} />
                      {module.isNew && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                          New
                        </span>
                      )}
                    </div>
                    <h4 className="mb-3">
                      {module.name}
                      {module.isNew && <span className="ms-2 badge bg-success">New</span>}
                    </h4>
                    <p className="text-muted mb-4">{module.description}</p>
                    
                    <div className="mb-4">
                      <h6 className="text-uppercase text-muted small mb-3">Key Features</h6>
                      <div className="d-flex flex-wrap justify-content-center gap-1">
                        {module.features.map((feature, index) => (
                          <span 
                            key={index}
                            className={`badge bg-${module.color} bg-opacity-10 text-${module.color} rounded-pill px-3 py-2 small`}
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="d-grid gap-2">
                      {module.demoAvailable ? (
                        <>
                          <Button 
                            as={Link}
                            to={module.id === 'dna-sequencing' ? '/dna-sequencing/dashboard' : 
                                module.id === 'medicine' ? '/medicine/dashboard' :
                                module.id === 'dermatology' ? '/dermatology' :
                                module.id === 'cosmetology' ? '/cosmetology/dashboard' :
                                module.id === 'radiology' ? '/radiology' :
                                module.id === 'dentistry' ? '/dentistry' :
                                module.id === 'pathology' ? '/pathology' :
                                module.id === 'allopathy' ? '/medicine/dashboard' : '/contact'}
                            variant={module.color}
                            size="sm"
                          >
                            {module.id === 'dna-sequencing' || module.id === 'medicine' || 
                             module.id === 'dermatology' || module.id === 'cosmetology' ||
                             module.id === 'radiology' || module.id === 'dentistry' || 
                             module.id === 'pathology' || module.id === 'allopathy' ? 'Try Demo' : 'Contact Expert for Demo'}
                          </Button>
                          <Button 
                            as={Link}
                            to="/mastermind-subscription"
                            variant={`outline-${module.color}`}
                            size="sm"
                          >
                            Subscribe to Access
                          </Button>
                        </>
                      ) : (
                        <Button 
                          as={Link}
                          to="/mastermind-subscription"
                          variant={module.color}
                          size="sm"
                        >
                          Subscribe to Access
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-primary text-white">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              <h2 className="display-6 fw-bold mb-4">Ready to Get Started?</h2>
              <p className="lead mb-4">
                Choose from our flexible pricing plans and start transforming your healthcare practice today.
              </p>
              <Button 
                as={Link} 
                to="/mastermind-subscription" 
                variant="light" 
                size="lg"
                className="me-3"
              >
                View All Plans
              </Button>
              <Button 
                as={Link} 
                to="/contact" 
                variant="outline-light" 
                size="lg"
              >
                Contact Sales
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      <style jsx>{`
        .hover-card {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
        .bg-gradient {
          position: relative;
        }
        .bg-gradient::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" fill="white" opacity="0.1"><polygon points="1000,100 1000,0 0,100"/></svg>');
          background-size: cover;
        }
      `}</style>
    </div>
  );
};

export default HealthcareModulesOverview;
