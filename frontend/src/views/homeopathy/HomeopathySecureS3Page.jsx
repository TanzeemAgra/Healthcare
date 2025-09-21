import React from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import SecureS3DataManager from '../../components/s3/SecureS3DataManager';
import secureS3Config from '../../config/secureS3Config';

const HomeopathySecureS3Page = () => {
  const moduleConfig = secureS3Config.modules.homeopathy;

  return (
    <Container fluid className="p-4">
      <Row>
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-success text-white">
              <h4 className="mb-0">
                <i className="fas fa-leaf me-2"></i>
                Homeopathy Secure Data Management
              </h4>
              <small>HIPAA-Compliant S3 Storage for Homeopathic Practice Data</small>
            </Card.Header>
            <Card.Body>
              <Alert variant="info" className="mb-4">
                <Alert.Heading>
                  <i className="fas fa-shield-alt me-2"></i>
                  Secure Homeopathy Data Storage
                </Alert.Heading>
                <p className="mb-2">
                  Manage patient records, case studies, remedy prescriptions, and constitutional analysis 
                  with enterprise-grade security and HIPAA compliance.
                </p>
                <hr />
                <div className="row">
                  <div className="col-md-6">
                    <h6><i className="fas fa-user-md me-1"></i>Practitioner Data:</h6>
                    <ul className="small mb-0">
                      <li>Case taking records and repertorization</li>
                      <li>Remedy selection and prescription histories</li>
                      <li>Constitutional analysis and miasmatic assessments</li>
                      <li>Follow-up consultations and progress tracking</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6><i className="fas fa-database me-1"></i>Data Organization:</h6>
                    <ul className="small mb-0">
                      <li>Practitioner-specific secure workspaces</li>
                      <li>Patient folders with case management</li>
                      <li>Encrypted file storage and retrieval</li>
                      <li>Comprehensive audit trails and compliance</li>
                    </ul>
                  </div>
                </div>
              </Alert>

              <SecureS3DataManager 
                moduleType="homeopathy"
                moduleName="Homeopathy"
                moduleConfig={moduleConfig}
                moduleIcon="leaf"
                moduleColor="success"
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomeopathySecureS3Page;
