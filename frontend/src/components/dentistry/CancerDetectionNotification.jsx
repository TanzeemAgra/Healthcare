import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Alert, 
  Button, 
  Card, 
  Badge, 
  Row, 
  Col, 
  Table,
  ProgressBar,
  Spinner
} from 'react-bootstrap';

const CancerDetectionNotification = ({ 
  show, 
  onHide, 
  detectionData, 
  onViewDetailedAnalysis,
  onMarkAsReviewed 
}) => {
  const [loading, setLoading] = useState(false);
  const [acknowledging, setAcknowledging] = useState(false);

  const getSeverityColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high': return 'danger';
      case 'critical': return 'dark';
      case 'moderate': return 'warning';
      case 'low': return 'success';
      default: return 'info';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return 'success';
    if (confidence >= 0.7) return 'warning';
    return 'danger';
  };

  const handleAcknowledge = async () => {
    setAcknowledging(true);
    try {
      // Simulate API call to acknowledge the alert
      await new Promise(resolve => setTimeout(resolve, 1000));
      onMarkAsReviewed(detectionData.id);
      onHide();
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    } finally {
      setAcknowledging(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!detectionData) return null;

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="xl" 
      backdrop="static"
      className="cancer-detection-modal"
    >
      <Modal.Header closeButton className={`bg-${getSeverityColor(detectionData.risk_level)} text-white`}>
        <Modal.Title>
          <i className="ri-alert-line me-2"></i>
          🚨 URGENT: Potential Cancer Cells Detected
          <Badge bg="light" text="dark" className="ms-2">
            AI Confidence: {Math.round(detectionData.ai_confidence * 100)}%
          </Badge>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Critical Alert Banner */}
        <Alert variant={getSeverityColor(detectionData.risk_level)} className="border-0 shadow-sm">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h5 className="mb-1">
                <i className="ri-error-warning-fill me-2"></i>
                IMMEDIATE ATTENTION REQUIRED
              </h5>
              <p className="mb-0">
                AI has detected suspicious cellular patterns consistent with potential malignancy in patient: 
                <strong> {detectionData.patient_name}</strong>
              </p>
            </div>
            <div className="text-end">
              <div className="h4 mb-0">
                Risk Level: <Badge bg={getSeverityColor(detectionData.risk_level)} className="fs-6">
                  {detectionData.risk_level?.toUpperCase()}
                </Badge>
              </div>
              <small>Detected: {formatTimestamp(detectionData.detected_at)}</small>
            </div>
          </div>
        </Alert>

        <Row>
          {/* Patient Information */}
          <Col lg={6}>
            <Card className="h-100 border-primary">
              <Card.Header className="bg-primary text-white">
                <h6 className="mb-0">
                  <i className="ri-user-heart-line me-2"></i>
                  Patient Information
                </h6>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <strong>Name:</strong> {detectionData.patient_name}<br/>
                  <strong>Age:</strong> {detectionData.patient_age} years<br/>
                  <strong>Gender:</strong> {detectionData.patient_gender}<br/>
                  <strong>Patient ID:</strong> {detectionData.patient_id}<br/>
                  <strong>Contact:</strong> {detectionData.patient_contact}
                </div>
                
                <div className="mb-3">
                  <h6 className="text-danger">High-Risk Factors Detected:</h6>
                  <ul className="mb-0">
                    {detectionData.risk_factors?.map((factor, index) => (
                      <li key={index} className="text-danger">
                        <strong>{factor.factor}:</strong> {factor.description}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-3">
                  <h6>Previous Medical History:</h6>
                  <div className="small text-muted">
                    {detectionData.medical_history || 'No significant history recorded'}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* AI Detection Results */}
          <Col lg={6}>
            <Card className="h-100 border-danger">
              <Card.Header className="bg-danger text-white">
                <h6 className="mb-0">
                  <i className="ri-microscope-line me-2"></i>
                  AI Detection Results
                </h6>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span>AI Confidence Level:</span>
                    <Badge bg={getConfidenceColor(detectionData.ai_confidence)}>
                      {Math.round(detectionData.ai_confidence * 100)}%
                    </Badge>
                  </div>
                  <ProgressBar 
                    now={detectionData.ai_confidence * 100} 
                    variant={getConfidenceColor(detectionData.ai_confidence)}
                    className="mb-2"
                  />
                </div>

                <div className="mb-3">
                  <h6 className="text-danger">Suspicious Areas Detected:</h6>
                  {detectionData.suspicious_areas?.map((area, index) => (
                    <div key={index} className="border rounded p-2 mb-2 bg-light">
                      <div className="row">
                        <div className="col-6">
                          <strong>Location:</strong> {area.location}<br/>
                          <strong>Size:</strong> {area.size_mm}mm
                        </div>
                        <div className="col-6">
                          <strong>Characteristics:</strong> {area.characteristics}<br/>
                          <strong>Confidence:</strong> {Math.round(area.confidence * 100)}%
                        </div>
                      </div>
                      <div className="mt-2">
                        <Badge bg="danger" className="me-2">
                          {area.recommendation}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mb-3">
                  <h6>AI Model Information:</h6>
                  <div className="small">
                    <strong>Model:</strong> {detectionData.ai_model_version}<br/>
                    <strong>Analysis Type:</strong> {detectionData.analysis_type}<br/>
                    <strong>Processing Time:</strong> {detectionData.processing_time}ms
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Clinical Recommendations */}
        <Row className="mt-4">
          <Col>
            <Card className="border-warning">
              <Card.Header className="bg-warning text-dark">
                <h6 className="mb-0">
                  <i className="ri-stethoscope-line me-2"></i>
                  Immediate Clinical Recommendations
                </h6>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <h6 className="text-danger">URGENT ACTIONS REQUIRED:</h6>
                    <ul className="text-danger">
                      {detectionData.urgent_recommendations?.map((rec, index) => (
                        <li key={index}><strong>{rec}</strong></li>
                      ))}
                    </ul>
                  </Col>
                  <Col md={6}>
                    <h6 className="text-info">Follow-up Actions:</h6>
                    <ul className="text-info">
                      {detectionData.followup_recommendations?.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </Col>
                </Row>

                <Alert variant="info" className="mt-3">
                  <strong><i className="ri-information-line me-2"></i>Important:</strong>
                  This AI detection requires immediate professional evaluation. Do not delay in referring 
                  the patient to an oral pathologist or oral surgeon for definitive diagnosis.
                </Alert>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Image Analysis Section */}
        {detectionData.analyzed_images && (
          <Row className="mt-4">
            <Col>
              <Card>
                <Card.Header>
                  <h6 className="mb-0">
                    <i className="ri-image-line me-2"></i>
                    Analyzed Images ({detectionData.analyzed_images.length})
                  </h6>
                </Card.Header>
                <Card.Body>
                  <div className="row">
                    {detectionData.analyzed_images.map((image, index) => (
                      <div key={index} className="col-md-4 mb-3">
                        <div className="border rounded p-2">
                          <img 
                            src={image.thumbnail} 
                            alt={`Analysis ${index + 1}`}
                            className="w-100 mb-2"
                            style={{height: '150px', objectFit: 'cover'}}
                          />
                          <div className="text-center">
                            <Badge bg="info">{image.type}</Badge>
                            <div className="small text-muted mt-1">
                              Confidence: {Math.round(image.confidence * 100)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Modal.Body>

      <Modal.Footer className="bg-light">
        <div className="d-flex justify-content-between w-100 align-items-center">
          <div>
            <Badge bg="danger" className="me-2">
              <i className="ri-time-line me-1"></i>
              Time Sensitive Alert
            </Badge>
            <small className="text-muted">
              AI Analysis completed at {formatTimestamp(detectionData.detected_at)}
            </small>
          </div>
          
          <div>
            <Button 
              variant="outline-secondary" 
              onClick={onHide}
              className="me-2"
            >
              <i className="ri-close-line me-1"></i>
              Close
            </Button>
            
            <Button
              variant="info"
              onClick={() => onViewDetailedAnalysis(detectionData)}
              className="me-2"
            >
              <i className="ri-microscope-line me-1"></i>
              Detailed Analysis
            </Button>

            <Button
              variant="success"
              onClick={handleAcknowledge}
              disabled={acknowledging}
            >
              {acknowledging ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Acknowledging...
                </>
              ) : (
                <>
                  <i className="ri-check-line me-1"></i>
                  Acknowledge & Review
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal.Footer>

      <style jsx>{`
        .cancer-detection-modal .modal-dialog {
          animation: alertPulse 2s infinite;
        }
        
        @keyframes alertPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(220, 53, 69, 0.3); }
          50% { box-shadow: 0 0 30px rgba(220, 53, 69, 0.6); }
        }
        
        .cancer-detection-modal .modal-header {
          border-bottom: 3px solid #dc3545;
        }
        
        .cancer-detection-modal .alert {
          border-left: 5px solid #dc3545;
        }
      `}</style>
    </Modal>
  );
};

export default CancerDetectionNotification;
