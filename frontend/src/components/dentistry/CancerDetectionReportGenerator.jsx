import React, { useState, useEffect } from 'react';
import { Modal, Button, Card, Form, Row, Col, Table, Badge, Spinner, Alert } from 'react-bootstrap';
import { FaFilePdf, FaDownload, FaEye, FaPrint, FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import apiClient from '../../services/api';

const CancerDetectionReportGenerator = ({ detection, show, onHide, onReportGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [reportPreview, setReportPreview] = useState(null);
  const [reportOptions, setReportOptions] = useState({
    includeImages: true,
    includeMolecularAnalysis: true,
    includeTreatmentPlan: true,
    includeStatistics: true,
    includeAcknowledgments: true,
    reportFormat: 'comprehensive'
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Early return if no detection data
  if (!detection) {
    return (
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaFilePdf className="me-2 text-danger" />
            Cancer Detection Report Generator
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="warning">
            <FaExclamationTriangle className="me-2" />
            No detection data available. Please select a cancer detection record to generate a report.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  const generateReport = async (action = 'download') => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
  const endpoint = action === 'preview' 
    ? `/dentistry/cancer-detections/${detection.id}/preview_pdf_report/`
    : `/dentistry/cancer-detections/${detection.id}/generate_pdf_report/`;

  const response = await apiClient.get(endpoint, { responseType: 'blob' });

  const blob = response.data;
      
      if (action === 'preview') {
        // Create blob URL for preview
        const blobUrl = URL.createObjectURL(blob);
        setReportPreview(blobUrl);
      } else {
        // Download the file
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `Cancer_Detection_Report_${detection.detection_id}_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        
        setSuccess('Report downloaded successfully!');
        if (onReportGenerated) {
          onReportGenerated();
        }
      }
    } catch (err) {
      setError(`Failed to ${action} report: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const printReport = () => {
    if (reportPreview) {
      const printWindow = window.open(reportPreview);
      printWindow.print();
    }
  };

  const getRiskLevelBadge = (riskLevel) => {
    const variants = {
      'low': 'success',
      'moderate': 'warning',
      'high': 'danger',
      'critical': 'danger',
      'unknown': 'secondary'
    };
    const level = riskLevel || 'unknown';
    return <Badge bg={variants[level] || 'secondary'}>{level.toUpperCase()}</Badge>;
  };

  const getStatusBadge = (status) => {
    const variants = {
      'pending_review': 'warning',
      'under_review': 'info',
      'reviewed': 'success',
      'requires_biopsy': 'danger',
      'false_positive': 'secondary',
      'unknown': 'secondary'
    };
    const statusValue = status || 'unknown';
    return <Badge bg={variants[statusValue] || 'secondary'}>{statusValue.replace('_', ' ').toUpperCase()}</Badge>;
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaFilePdf className="me-2 text-danger" />
          Cancer Detection Report Generator
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && (
          <Alert variant="danger" className="d-flex align-items-center">
            <FaExclamationTriangle className="me-2" />
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success" className="d-flex align-items-center">
            <FaCheck className="me-2" />
            {success}
          </Alert>
        )}

        <Row>
          {/* Report Configuration */}
          <Col md={6}>
            <Card className="mb-3">
              <Card.Header>
                <h5 className="mb-0">Report Configuration</h5>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Report Format</Form.Label>
                    <Form.Select 
                      value={reportOptions.reportFormat}
                      onChange={(e) => setReportOptions({...reportOptions, reportFormat: e.target.value})}
                    >
                      <option value="comprehensive">Comprehensive Report</option>
                      <option value="summary">Executive Summary</option>
                      <option value="clinical">Clinical Report Only</option>
                      <option value="research">Research Format</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Include Sections</Form.Label>
                    <div>
                      <Form.Check
                        type="checkbox"
                        label="Medical Images & Analysis"
                        checked={reportOptions.includeImages}
                        onChange={(e) => setReportOptions({...reportOptions, includeImages: e.target.checked})}
                      />
                      <Form.Check
                        type="checkbox"
                        label="Molecular & Genetic Analysis"
                        checked={reportOptions.includeMolecularAnalysis}
                        onChange={(e) => setReportOptions({...reportOptions, includeMolecularAnalysis: e.target.checked})}
                      />
                      <Form.Check
                        type="checkbox"
                        label="Treatment Recommendations"
                        checked={reportOptions.includeTreatmentPlan}
                        onChange={(e) => setReportOptions({...reportOptions, includeTreatmentPlan: e.target.checked})}
                      />
                      <Form.Check
                        type="checkbox"
                        label="Statistical Analysis"
                        checked={reportOptions.includeStatistics}
                        onChange={(e) => setReportOptions({...reportOptions, includeStatistics: e.target.checked})}
                      />
                      <Form.Check
                        type="checkbox"
                        label="Professional Acknowledgments"
                        checked={reportOptions.includeAcknowledgments}
                        onChange={(e) => setReportOptions({...reportOptions, includeAcknowledgments: e.target.checked})}
                      />
                    </div>
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>

            {/* Report Actions */}
            <Card>
              <Card.Header>
                <h5 className="mb-0">Report Actions</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    onClick={() => generateReport('preview')}
                    disabled={loading}
                    className="d-flex align-items-center justify-content-center"
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Generating Preview...
                      </>
                    ) : (
                      <>
                        <FaEye className="me-2" />
                        Preview Report
                      </>
                    )}
                  </Button>

                  <Button 
                    variant="success" 
                    onClick={() => generateReport('download')}
                    disabled={loading}
                    className="d-flex align-items-center justify-content-center"
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Generating Download...
                      </>
                    ) : (
                      <>
                        <FaDownload className="me-2" />
                        Download PDF Report
                      </>
                    )}
                  </Button>

                  {reportPreview && (
                    <Button 
                      variant="outline-primary" 
                      onClick={printReport}
                      className="d-flex align-items-center justify-content-center"
                    >
                      <FaPrint className="me-2" />
                      Print Report
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Detection Summary */}
          <Col md={6}>
            <Card className="mb-3">
              <Card.Header>
                <h5 className="mb-0">Detection Summary</h5>
              </Card.Header>
              <Card.Body>
                <Table borderless size="sm">
                  <tbody>
                    <tr>
                      <td><strong>Patient:</strong></td>
                      <td>{detection?.patient?.user?.first_name || 'Unknown'} {detection?.patient?.user?.last_name || ''}</td>
                    </tr>
                    <tr>
                      <td><strong>Detection ID:</strong></td>
                      <td><code>{detection?.detection_id || 'N/A'}</code></td>
                    </tr>
                    <tr>
                      <td><strong>Detection Date:</strong></td>
                      <td>{detection?.detected_at ? new Date(detection.detected_at).toLocaleDateString() : 'Unknown'}</td>
                    </tr>
                    <tr>
                      <td><strong>Cancer Detected:</strong></td>
                      <td>
                        {detection?.cancer_detected ? (
                          <Badge bg="danger">POSITIVE</Badge>
                        ) : (
                          <Badge bg="success">NEGATIVE</Badge>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Risk Level:</strong></td>
                      <td>{getRiskLevelBadge(detection?.risk_level || 'unknown')}</td>
                    </tr>
                    <tr>
                      <td><strong>AI Confidence:</strong></td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="flex-grow-1 me-2">
                            <div className="progress" style={{height: '6px'}}>
                              <div 
                                className="progress-bar bg-primary" 
                                style={{width: `${((detection?.overall_confidence || 0) * 100)}%`}}
                              ></div>
                            </div>
                          </div>
                          <small>{((detection?.overall_confidence || 0) * 100).toFixed(1)}%</small>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Cancer Probability:</strong></td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="flex-grow-1 me-2">
                            <div className="progress" style={{height: '6px'}}>
                              <div 
                                className="progress-bar bg-danger" 
                                style={{width: `${((detection?.cancer_probability || 0) * 100)}%`}}
                              ></div>
                            </div>
                          </div>
                          <small>{((detection?.cancer_probability || 0) * 100).toFixed(1)}%</small>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Status:</strong></td>
                      <td>{getStatusBadge(detection?.status || 'unknown')}</td>
                    </tr>
                    <tr>
                      <td><strong>Predicted Type:</strong></td>
                      <td>{detection?.predicted_cancer_type?.replace('_', ' ') || 'Not determined'}</td>
                    </tr>
                    <tr>
                      <td><strong>AI Model:</strong></td>
                      <td><small>{detection?.ai_model_version || 'Unknown'}</small></td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>

            {/* Report Preview */}
            {reportPreview && (
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Report Preview</h5>
                </Card.Header>
                <Card.Body className="p-0">
                  <iframe
                    src={reportPreview}
                    width="100%"
                    height="400px"
                    style={{border: 'none'}}
                    title="PDF Report Preview"
                  />
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>

        {/* Report Contents Preview */}
        <Row className="mt-3">
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Report Contents Overview</h5>
              </Card.Header>
              <Card.Body>
                <div className="row">
                  <div className="col-md-6">
                    <h6>Medical Information</h6>
                    <ul className="list-unstyled">
                      <li><FaCheck className="text-success me-2" />Executive Summary</li>
                      <li><FaCheck className="text-success me-2" />Patient Demographics</li>
                      <li><FaCheck className="text-success me-2" />Detection Details</li>
                      <li><FaCheck className="text-success me-2" />AI Analysis Results</li>
                      <li><FaCheck className="text-success me-2" />Risk Assessment</li>
                      <li><FaCheck className="text-success me-2" />Cellular Analysis</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6>Clinical Analysis</h6>
                    <ul className="list-unstyled">
                      <li><FaCheck className="text-success me-2" />Molecular Analysis</li>
                      <li><FaCheck className="text-success me-2" />Treatment Recommendations</li>
                      <li><FaCheck className="text-success me-2" />Follow-up Protocol</li>
                      <li><FaCheck className="text-success me-2" />Image Documentation</li>
                      <li><FaCheck className="text-success me-2" />Statistical Analysis</li>
                      <li><FaCheck className="text-success me-2" />Professional Sign-offs</li>
                    </ul>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button 
          variant="primary" 
          onClick={() => generateReport('download')}
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner size="sm" className="me-2" />
              Generating...
            </>
          ) : (
            <>
              <FaDownload className="me-2" />
              Generate & Download Report
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CancerDetectionReportGenerator;
