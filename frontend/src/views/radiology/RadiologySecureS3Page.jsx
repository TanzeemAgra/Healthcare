import React from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import SecureS3DataManager from '../../components/s3/SecureS3DataManager';
import secureS3Config from '../../config/secureS3Config';

const RadiologySecureS3Page = () => {
  const moduleConfig = secureS3Config.modules.radiology;

  return (
    <Container fluid className="p-4">
      <Row>
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-info text-white">
              <h4 className="mb-0">
                <i className="fas fa-x-ray me-2"></i>
                Radiology Secure Data Management
              </h4>
              <small>HIPAA-Compliant S3 Storage for Medical Imaging Data</small>
            </Card.Header>
            <Card.Body>
              <Alert variant="info" className="mb-4">
                <Alert.Heading>
                  <i className="fas fa-shield-alt me-2"></i>
                  Secure Radiology Data Storage
                </Alert.Heading>
                <p className="mb-2">
                  Manage DICOM images, radiological reports, AI analysis results, and medical imaging studies 
                  with enterprise-grade security and HIPAA compliance.
                </p>
                <hr />
                <div className="row">
                  <div className="col-md-6">
                    <h6><i className="fas fa-user-md me-1"></i>Radiology Data:</h6>
                    <ul className="small mb-0">
                      <li>DICOM medical images and studies</li>
                      <li>Radiological reports and interpretations</li>
                      <li>AI analysis and diagnostic results</li>
                      <li>Patient imaging histories</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6><i className="fas fa-database me-1"></i>Data Organization:</h6>
                    <ul className="small mb-0">
                      <li>Radiologist-specific secure workspaces</li>
                      <li>Patient folders with imaging management</li>
                      <li>Encrypted file storage and retrieval</li>
                      <li>Comprehensive audit trails and compliance</li>
                    </ul>
                  </div>
                </div>
              </Alert>

              <SecureS3DataManager 
                moduleType="radiology"
                moduleName="Radiology"
                moduleConfig={moduleConfig}
                moduleIcon="x-ray"
                moduleColor="info"
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RadiologySecureS3Page;
