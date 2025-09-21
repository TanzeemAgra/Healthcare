import React from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import SecureS3DataManager from '../../components/s3/SecureS3DataManager';
import secureS3Config from '../../config/secureS3Config';

const PathologySecureS3Page = () => {
  const moduleConfig = secureS3Config.modules.pathology;

  return (
    <Container fluid className="p-4">
      <Row>
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-info text-white">
              <h4 className="mb-0">
                <i className="fas fa-microscope me-2"></i>
                Pathology Secure Data Management
              </h4>
              <small>HIPAA-Compliant S3 Storage for Pathological Analysis Data</small>
            </Card.Header>
            <Card.Body>
              <Alert variant="info" className="mb-4">
                <Alert.Heading>
                  <i className="fas fa-shield-alt me-2"></i>
                  Secure Pathology Data Storage
                </Alert.Heading>
                <p className="mb-2">
                  Manage pathology reports, laboratory results, tissue samples, and diagnostic imaging 
                  with enterprise-grade security and HIPAA compliance.
                </p>
                <hr />
                <div className="row">
                  <div className="col-md-6">
                    <h6><i className="fas fa-user-md me-1"></i>Pathology Data:</h6>
                    <ul className="small mb-0">
                      <li>Pathology reports and analysis</li>
                      <li>Laboratory test results</li>
                      <li>Tissue sample documentation</li>
                      <li>Microscopic imaging and slides</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6><i className="fas fa-database me-1"></i>Data Organization:</h6>
                    <ul className="small mb-0">
                      <li>Pathologist-specific secure workspaces</li>
                      <li>Patient folders with case management</li>
                      <li>Encrypted file storage and retrieval</li>
                      <li>Comprehensive audit trails and compliance</li>
                    </ul>
                  </div>
                </div>
              </Alert>

              <SecureS3DataManager 
                moduleType="pathology"
                moduleName="Pathology"
                moduleConfig={moduleConfig}
                moduleIcon="microscope"
                moduleColor="info"
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PathologySecureS3Page;
