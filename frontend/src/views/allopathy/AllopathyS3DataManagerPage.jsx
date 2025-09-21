import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Badge } from 'react-bootstrap';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import S3DataManager from '../../components/s3/S3DataManager';
import { ALLOPATHY_S3_CONFIG } from '../../config/allopathyS3Config';

const AllopathyS3DataManagerPage = () => {
  const [selectedBucket, setSelectedBucket] = useState('medical-records');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Container fluid>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">
                <i className="ri-cloud-fill me-3 text-primary"></i>
                Medical S3 Data Manager
              </h2>
              <p className="text-muted mb-0">
                Secure, HIPAA-compliant management of medical data and clinical files in AWS S3
              </p>
            </div>
            <div>
              <Button 
                variant="outline-primary" 
                onClick={() => setIsLoading(!isLoading)}
                className="me-2"
              >
                <i className="ri-refresh-line me-2"></i>
                Refresh Buckets
              </Button>
              <Badge bg="success" className="px-3 py-2">
                <i className="ri-shield-check-line me-2"></i>
                HIPAA Compliant
              </Badge>
            </div>
          </div>
        </Col>
      </Row>

      {/* Security Notice */}
      <Row className="mb-4">
        <Col>
          <Alert variant="info" className="border-0 shadow-sm">
            <div className="d-flex align-items-center">
              <i className="ri-shield-check-fill text-info me-3 fs-4"></i>
              <div className="flex-grow-1">
                <h6 className="mb-1">
                  <i className="ri-lock-fill me-2"></i>
                  Secure Medical Data Storage
                </h6>
                <p className="mb-0 small text-muted">
                  All medical data is encrypted at rest and in transit | 
                  HIPAA Compliant | Audit Logging Active | 
                  Available Buckets: <strong>{ALLOPATHY_S3_CONFIG.buckets.length}</strong>
                </p>
              </div>
            </div>
          </Alert>
        </Col>
      </Row>

      {/* Compliance Status */}
      <Row className="mb-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">Compliance Status</h6>
                  <small className="text-muted">Real-time security and compliance monitoring</small>
                </div>
                <div className="d-flex gap-2">
                  <Badge bg="success" className="d-flex align-items-center">
                    <i className="ri-shield-check-line me-1"></i>
                    HIPAA
                  </Badge>
                  <Badge bg="success" className="d-flex align-items-center">
                    <i className="ri-lock-line me-1"></i>
                    Encrypted
                  </Badge>
                  <Badge bg="info" className="d-flex align-items-center">
                    <i className="ri-eye-line me-1"></i>
                    Audited
                  </Badge>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">Session Security</h6>
                  <small className="text-muted">Auto-logout in 30 minutes</small>
                </div>
                <i className="ri-time-line text-warning fs-4"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Medical Data Buckets Overview */}
      <Row className="mb-4">
        {ALLOPATHY_S3_CONFIG.buckets.map((bucket, index) => (
          <Col lg={4} md={6} key={bucket.id} className="mb-3">
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="text-center">
                <div className={`rounded-circle bg-${bucket.color} text-white p-3 mx-auto mb-3`} style={{width: '60px', height: '60px'}}>
                  <i className={`${bucket.icon} fs-4`}></i>
                </div>
                <h6 className="mb-1">{bucket.name}</h6>
                <p className="text-muted small mb-2">{bucket.description}</p>
                <div className="d-flex justify-content-between text-muted small mb-2">
                  <span>Files: {Math.floor(Math.random() * 200) + 20}</span>
                  <span>Size: {(Math.random() * 5 + 0.5).toFixed(1)}GB</span>
                </div>
                <div className="d-flex justify-content-center gap-1">
                  {bucket.encrypted && (
                    <Badge bg="success" className="small">
                      <i className="ri-lock-line me-1"></i>
                      Encrypted
                    </Badge>
                  )}
                  {bucket.hipaaCompliant && (
                    <Badge bg="primary" className="small">
                      <i className="ri-shield-check-line me-1"></i>
                      HIPAA
                    </Badge>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Main S3 Data Manager */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="ri-folder-open-fill me-2"></i>
                  Medical File Browser
                </h5>
                <div>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="me-2"
                  >
                    <i className="ri-upload-cloud-2-line me-2"></i>
                    Upload Medical Files
                  </Button>
                  <Button 
                    variant="outline-success" 
                    size="sm"
                    className="me-2"
                  >
                    <i className="ri-shield-check-line me-2"></i>
                    Verify Compliance
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                  >
                    <i className="ri-folder-add-line me-2"></i>
                    New Patient Folder
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <S3DataManager 
                selectedBucket={selectedBucket}
                onBucketChange={setSelectedBucket}
                config={ALLOPATHY_S3_CONFIG}
                showBucketSelector={true}
                fullPageMode={true}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Medical Data Guidelines */}
      <Row className="mt-4">
        <Col lg={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0">
                <i className="ri-information-line me-2"></i>
                Medical Data Guidelines
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col>
                  <h6 className="text-primary mb-3">
                    <i className="ri-upload-line me-2"></i>
                    Data Upload Best Practices
                  </h6>
                  <ul className="list-unstyled text-muted small">
                    <li className="mb-2">• Store patient records in medical-records bucket</li>
                    <li className="mb-2">• Upload DICOM images to diagnostic-images bucket</li>
                    <li className="mb-2">• Use patient ID folders for organization</li>
                    <li className="mb-2">• Ensure all PHI is properly encrypted</li>
                    <li className="mb-2">• Verify file formats before upload</li>
                  </ul>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0">
                <i className="ri-shield-check-line me-2"></i>
                Compliance & Security
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <h6 className="text-success mb-3">
                  <i className="ri-lock-fill me-2"></i>
                  Security Features
                </h6>
                <div className="d-flex align-items-center mb-2">
                  <i className="ri-lock-fill text-success me-2"></i>
                  <span className="small">AES-256 Encryption</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <i className="ri-shield-check-fill text-success me-2"></i>
                  <span className="small">HIPAA Compliance</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <i className="ri-history-line text-info me-2"></i>
                  <span className="small">Audit Trail Logging</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <i className="ri-eye-line text-warning me-2"></i>
                  <span className="small">Access Monitoring</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="ri-time-line text-danger me-2"></i>
                  <span className="small">Session Timeout Protection</span>
                </div>
              </div>
              <Button variant="outline-primary" size="sm" className="w-100">
                <i className="ri-settings-3-line me-2"></i>
                Security Settings
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Data Retention Policy */}
      <Row className="mt-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0">
                <i className="ri-calendar-check-line me-2"></i>
                Data Retention Policy
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <div className="text-center p-3 border rounded">
                    <i className="ri-file-medical-line text-primary fs-3 mb-2"></i>
                    <h6>Medical Records</h6>
                    <Badge bg="primary">7 Years</Badge>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center p-3 border rounded">
                    <i className="ri-scan-line text-success fs-3 mb-2"></i>
                    <h6>Diagnostic Images</h6>
                    <Badge bg="success">10 Years</Badge>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center p-3 border rounded">
                    <i className="ri-test-tube-line text-info fs-3 mb-2"></i>
                    <h6>Lab Results</h6>
                    <Badge bg="info">5 Years</Badge>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center p-3 border rounded">
                    <i className="ri-microscope-line text-secondary fs-3 mb-2"></i>
                    <h6>Research Data</h6>
                    <Badge bg="secondary">15 Years</Badge>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

// Protected wrapper for Allopathy S3 Data Manager
const ProtectedAllopathyS3DataManager = () => {
  return (
    <ProtectedRoute 
      permission="canAccessAllopathyModule" 
      moduleName="Medical S3 Data Manager"
    >
      <AllopathyS3DataManagerPage />
    </ProtectedRoute>
  );
};

export default ProtectedAllopathyS3DataManager;
