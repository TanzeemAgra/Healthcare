import React from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import SecureS3DataManager from '../../components/s3/SecureS3DataManager';
import secureS3Config from '../../config/secureS3Config';

const DermatologySecureS3Page = () => {
  const moduleConfig = secureS3Config.modules.dermatology;

  return (
    <Container fluid className="p-4">
      <Row>
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-warning text-dark">
              <h4 className="mb-0">
                <i className="fas fa-stethoscope me-2"></i>
                Dermatology Secure Data Management
              </h4>
              <small>HIPAA-Compliant S3 Storage for Dermatological Practice Data</small>
            </Card.Header>
            <Card.Body>
              <Alert variant="info" className="mb-4">
                <Alert.Heading>
                  <i className="fas fa-shield-alt me-2"></i>
                  Secure Dermatology Data Storage
                </Alert.Heading>
                <p className="mb-2">
                  Manage patient skin condition records, dermatological imaging, treatment plans, and clinical assessments 
                  with enterprise-grade security and HIPAA compliance.
                </p>
                <hr />
                <div className="row">
                  <div className="col-md-6">
                    <h6><i className="fas fa-user-md me-1"></i>Dermatological Data:</h6>
                    <ul className="small mb-0">
                      <li>Skin condition assessments and histories</li>
                      <li>Dermatological imaging and photos</li>
                      <li>Treatment plans and procedures</li>
                      <li>Biopsy results and pathology reports</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6><i className="fas fa-database me-1"></i>Data Organization:</h6>
                    <ul className="small mb-0">
                      <li>Dermatologist-specific secure workspaces</li>
                      <li>Patient folders with treatment management</li>
                      <li>Encrypted file storage and retrieval</li>
                      <li>Comprehensive audit trails and compliance</li>
                    </ul>
                  </div>
                </div>
              </Alert>

              <SecureS3DataManager 
                moduleType="dermatology"
                moduleName="Dermatology"
                moduleConfig={moduleConfig}
                moduleIcon="stethoscope"
                moduleColor="warning"
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DermatologySecureS3Page;
