import React from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import SecureS3DataManager from '../../components/s3/SecureS3DataManager';
import secureS3Config from '../../config/secureS3Config';

const CosmetologySecureS3Page = () => {
  const moduleConfig = secureS3Config.modules.cosmetology;

  return (
    <Container fluid className="p-4">
      <Row>
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-pink text-white" style={{backgroundColor: '#e91e63'}}>
              <h4 className="mb-0">
                <i className="fas fa-spa me-2"></i>
                Cosmetology Secure Data Management
              </h4>
              <small>HIPAA-Compliant S3 Storage for Aesthetic and Cosmetic Practice Data</small>
            </Card.Header>
            <Card.Body>
              <Alert variant="info" className="mb-4">
                <Alert.Heading>
                  <i className="fas fa-shield-alt me-2"></i>
                  Secure Cosmetology Data Storage
                </Alert.Heading>
                <p className="mb-2">
                  Manage client records, treatment plans, aesthetic procedures, and beauty consultations 
                  with enterprise-grade security and HIPAA compliance.
                </p>
                <hr />
                <div className="row">
                  <div className="col-md-6">
                    <h6><i className="fas fa-user-friends me-1"></i>Client Data:</h6>
                    <ul className="small mb-0">
                      <li>Skin analysis and consultation records</li>
                      <li>Treatment plans and procedure histories</li>
                      <li>Before/after photos and progress tracking</li>
                      <li>Product recommendations and allergies</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6><i className="fas fa-database me-1"></i>Data Organization:</h6>
                    <ul className="small mb-0">
                      <li>Practitioner-specific secure workspaces</li>
                      <li>Client folders with treatment management</li>
                      <li>Encrypted file storage and retrieval</li>
                      <li>Comprehensive audit trails and compliance</li>
                    </ul>
                  </div>
                </div>
              </Alert>

              <SecureS3DataManager 
                moduleType="cosmetology"
                moduleName="Cosmetology"
                moduleConfig={moduleConfig}
                moduleIcon="spa"
                moduleColor="pink"
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CosmetologySecureS3Page;
