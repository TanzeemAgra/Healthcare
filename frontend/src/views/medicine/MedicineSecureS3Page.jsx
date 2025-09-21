import React from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import SecureS3DataManager from '../../components/s3/SecureS3DataManager';
import secureS3Config from '../../config/secureS3Config';

const MedicineSecureS3Page = () => {
  const moduleConfig = secureS3Config.modules.medicine;

  return (
    <Container fluid className="p-4">
      <Row>
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-success text-white">
              <h4 className="mb-0">
                <i className="fas fa-heartbeat me-2"></i>
                Medicine Secure Data Management
              </h4>
              <small>HIPAA-Compliant S3 Storage for Medical Practice Data</small>
            </Card.Header>
            <Card.Body>
              <Alert variant="info" className="mb-4">
                <Alert.Heading>
                  <i className="fas fa-shield-alt me-2"></i>
                  Secure Medicine Data Storage
                </Alert.Heading>
                <p className="mb-2">
                  Manage electronic health records, medical documentation, diagnostic reports, and patient care data 
                  with enterprise-grade security and HIPAA compliance.
                </p>
                <hr />
                <div className="row">
                  <div className="col-md-6">
                    <h6><i className="fas fa-user-md me-1"></i>Medical Data:</h6>
                    <ul className="small mb-0">
                      <li>Electronic health records (EHR)</li>
                      <li>Medical documentation and notes</li>
                      <li>Diagnostic reports and test results</li>
                      <li>Treatment plans and care protocols</li>
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
                moduleType="medicine"
                moduleName="Medicine"
                moduleConfig={moduleConfig}
                moduleIcon="heartbeat"
                moduleColor="success"
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MedicineSecureS3Page;
