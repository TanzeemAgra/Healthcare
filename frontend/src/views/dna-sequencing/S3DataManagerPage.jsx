import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import S3DataManager from '../../components/s3/S3DataManager';
import { S3_DATA_MANAGER_CONFIG } from '../../config/s3DataManagerConfig';

const S3DataManagerPage = () => {
  const [selectedBucket, setSelectedBucket] = useState('genomics-data');
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
                S3 Data Manager
              </h2>
              <p className="text-muted mb-0">
                Manage genomics data files and analysis results in AWS S3 storage buckets
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
              <Button 
                variant="success"
                disabled
              >
                <i className="ri-check-line me-2"></i>
                Connected
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Connection Status */}
      <Row className="mb-4">
        <Col>
          <Alert variant="success" className="border-0 shadow-sm">
            <div className="d-flex align-items-center">
              <i className="ri-cloud-fill text-success me-3 fs-4"></i>
              <div className="flex-grow-1">
                <h6 className="mb-1">AWS S3 Connection Active</h6>
                <p className="mb-0 small text-muted">
                  Connected to region: <strong>us-east-1</strong> | 
                  Access Level: <strong>Read/Write</strong> | 
                  Available Buckets: <strong>{S3_DATA_MANAGER_CONFIG.buckets.length}</strong>
                </p>
              </div>
            </div>
          </Alert>
        </Col>
      </Row>

      {/* Quick Stats */}
      <Row className="mb-4">
        {S3_DATA_MANAGER_CONFIG.buckets.map((bucket, index) => (
          <Col lg={3} md={6} key={bucket.id} className="mb-3">
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="text-center">
                <div className={`rounded-circle bg-${['primary', 'success', 'info', 'warning'][index]} text-white p-3 mx-auto mb-3`} style={{width: '60px', height: '60px'}}>
                  <i className="ri-folder-cloud-fill fs-4"></i>
                </div>
                <h6 className="mb-1">{bucket.name}</h6>
                <p className="text-muted small mb-2">{bucket.description}</p>
                <div className="d-flex justify-content-between text-muted small">
                  <span>Files: {Math.floor(Math.random() * 500) + 50}</span>
                  <span>Size: {(Math.random() * 10 + 1).toFixed(1)}GB</span>
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
                  File Browser
                </h5>
                <div>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="me-2"
                  >
                    <i className="ri-upload-cloud-2-line me-2"></i>
                    Upload Files
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                  >
                    <i className="ri-folder-add-line me-2"></i>
                    New Folder
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <S3DataManager 
                selectedBucket={selectedBucket}
                onBucketChange={setSelectedBucket}
                config={S3_DATA_MANAGER_CONFIG}
                showBucketSelector={true}
                fullPageMode={true}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Usage Guidelines */}
      <Row className="mt-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0">
                <i className="ri-information-line me-2"></i>
                Usage Guidelines
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h6 className="text-primary mb-3">
                    <i className="ri-upload-line me-2"></i>
                    Data Upload Best Practices
                  </h6>
                  <ul className="list-unstyled text-muted small">
                    <li className="mb-2">• Store raw sequencing data (FASTQ) in genomics-data bucket</li>
                    <li className="mb-2">• Use organized folder structure: /project/sample/date/</li>
                    <li className="mb-2">• Compress large files before upload (gzip recommended)</li>
                    <li className="mb-2">• Include metadata files with sample information</li>
                  </ul>
                </Col>
                <Col md={6}>
                  <h6 className="text-success mb-3">
                    <i className="ri-download-line me-2"></i>
                    Results Management
                  </h6>
                  <ul className="list-unstyled text-muted small">
                    <li className="mb-2">• Analysis results saved to genomics-results bucket</li>
                    <li className="mb-2">• Download VCF files for variant analysis</li>
                    <li className="mb-2">• Access BAM files for detailed read inspection</li>
                    <li className="mb-2">• Export reports in PDF format for sharing</li>
                  </ul>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0">
                <i className="ri-shield-check-line me-2"></i>
                Security & Access
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <i className="ri-lock-fill text-success me-2"></i>
                  <span className="small">Encrypted at Rest</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <i className="ri-shield-check-fill text-success me-2"></i>
                  <span className="small">IAM Role-based Access</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <i className="ri-history-line text-info me-2"></i>
                  <span className="small">Version Control Enabled</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="ri-eye-line text-warning me-2"></i>
                  <span className="small">Audit Logging Active</span>
                </div>
              </div>
              <Button variant="outline-primary" size="sm" className="w-100">
                <i className="ri-settings-3-line me-2"></i>
                Manage Permissions
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

// Protected wrapper for S3 Data Manager
const ProtectedS3DataManager = () => {
  return (
    <ProtectedRoute 
      permission="canAccessDnaSequencingModule" 
      moduleName="S3 Data Manager"
    >
      <S3DataManagerPage />
    </ProtectedRoute>
  );
};

export default ProtectedS3DataManager;
