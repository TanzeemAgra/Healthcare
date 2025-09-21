import React from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import SecureS3DataManager from '../../components/s3/SecureS3DataManager';
import secureS3Config from '../../config/secureS3Config';

const AllopathySecureS3Page = () => {
  const moduleConfig = secureS3Config.modules.allopathy;

  return (
    <Container fluid className="p-4">
      <Row>
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-dark text-white">
              <h4 className="mb-0">
                <i className="fas fa-pills me-2"></i>
                Allopathy Secure Data Management
              </h4>
              <small>HIPAA-Compliant S3 Storage for Modern Medicine Practice Data</small>
            </Card.Header>
            <Card.Body>
              <Alert variant="info" className="mb-4">
                <Alert.Heading>
                  <i className="fas fa-shield-alt me-2"></i>
                  Secure Allopathy Data Storage
                </Alert.Heading>
                <p className="mb-2">
                  Manage patient medical records, pharmaceutical prescriptions, treatment protocols, and clinical research data 
                  with enterprise-grade security and HIPAA compliance.
                </p>
                <hr />
                <div className="row">
                  <div className="col-md-6">
                    <h6><i className="fas fa-user-md me-1"></i>Medical Data:</h6>
                    <ul className="small mb-0">
                      <li>Patient medical histories and records</li>
                      <li>Pharmaceutical prescriptions and dosages</li>
                      <li>Treatment protocols and clinical guidelines</li>
                      <li>Research data and clinical trials</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6><i className="fas fa-database me-1"></i>Data Organization:</h6>
                    <ul className="small mb-0">
                      <li>Physician-specific secure workspaces</li>
                      <li>Patient folders with comprehensive care management</li>
                      <li>Encrypted file storage and retrieval</li>
                      <li>Comprehensive audit trails and compliance</li>
                    </ul>
                  </div>
                </div>
              </Alert>

              <SecureS3DataManager 
                moduleType="allopathy"
                moduleName="Allopathy"
                moduleConfig={moduleConfig}
                moduleIcon="pills"
                moduleColor="dark"
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AllopathySecureS3Page;
