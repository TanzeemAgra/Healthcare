import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table, Alert, Form, Modal, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load demo reports data
    const demoReports = [
      {
        id: 'RPT-2024-001',
        sample_id: 'DNA-2024-001',
        patient_name: 'John Smith',
        report_type: 'Genomic Analysis',
        status: 'completed',
        created_date: '2024-08-01',
        completion_date: '2024-08-02',
        variants_found: 156,
        pathogenic_variants: 3,
        vus_variants: 12,
        benign_variants: 141,
        coverage: 98.5,
        quality_score: 'A+',
        clinical_findings: [
          'BRCA1 pathogenic variant detected',
          'Lynch syndrome susceptibility identified',
          'Pharmacogenomic variants present'
        ],
        recommendations: [
          'Genetic counseling recommended',
          'Family screening advised',
          'Regular monitoring required'
        ]
      },
      {
        id: 'RPT-2024-002',
        sample_id: 'DNA-2024-002',
        patient_name: 'Sarah Johnson',
        report_type: 'Pharmacogenomics',
        status: 'completed',
        created_date: '2024-08-03',
        completion_date: '2024-08-03',
        variants_found: 89,
        pathogenic_variants: 0,
        vus_variants: 8,
        benign_variants: 81,
        coverage: 99.2,
        quality_score: 'A+',
        clinical_findings: [
          'CYP2D6 poor metabolizer',
          'SLCO1B1 increased function variant',
          'DPYD normal function'
        ],
        recommendations: [
          'Adjust medication dosing',
          'Monitor for adverse reactions',
          'Consider alternative medications'
        ]
      },
      {
        id: 'RPT-2024-003',
        sample_id: 'DNA-2024-003',
        patient_name: 'Michael Brown',
        report_type: 'Cancer Panel',
        status: 'in_progress',
        created_date: '2024-08-05',
        completion_date: null,
        variants_found: null,
        pathogenic_variants: null,
        vus_variants: null,
        benign_variants: null,
        coverage: null,
        quality_score: null,
        clinical_findings: [],
        recommendations: []
      },
      {
        id: 'RPT-2024-004',
        sample_id: 'DNA-2024-004',
        patient_name: 'Emma Wilson',
        report_type: 'Exome Sequencing',
        status: 'pending_review',
        created_date: '2024-08-04',
        completion_date: '2024-08-05',
        variants_found: 234,
        pathogenic_variants: 1,
        vus_variants: 18,
        benign_variants: 215,
        coverage: 97.8,
        quality_score: 'A',
        clinical_findings: [
          'CFTR variant detected',
          'No other significant findings'
        ],
        recommendations: [
          'Carrier status confirmed',
          'Partner testing recommended'
        ]
      }
    ];
    
    setReports(demoReports);
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { variant: 'success', text: 'Completed' },
      in_progress: { variant: 'warning', text: 'In Progress' },
      pending_review: { variant: 'info', text: 'Pending Review' },
      failed: { variant: 'danger', text: 'Failed' }
    };
    
    const config = statusConfig[status] || { variant: 'secondary', text: 'Unknown' };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const getQualityBadge = (score) => {
    if (!score) return <Badge bg="secondary">N/A</Badge>;
    
    const qualityConfig = {
      'A+': { variant: 'success', text: 'A+' },
      'A': { variant: 'success', text: 'A' },
      'B+': { variant: 'info', text: 'B+' },
      'B': { variant: 'info', text: 'B' },
      'C': { variant: 'warning', text: 'C' },
      'D': { variant: 'danger', text: 'D' }
    };
    
    const config = qualityConfig[score] || { variant: 'secondary', text: score };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const filteredReports = reports.filter(report => 
    filterStatus === 'all' || report.status === filterStatus
  );

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  const generateReport = () => {
    setLoading(true);
    // Simulate report generation
    setTimeout(() => {
      setLoading(false);
      alert('Report generation started. You will be notified when complete.');
    }, 2000);
  };

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>Genomic Reports</h2>
              <p className="text-muted">Comprehensive genetic analysis reports and findings</p>
            </div>
            <div>
              <Button as={Link} to="/dna-sequencing/dashboard" variant="outline-primary" className="me-2">
                Back to Dashboard
              </Button>
              <Button variant="primary" onClick={generateReport} disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Generating...
                  </>
                ) : (
                  <>
                    <i className="ri-file-add-line me-2"></i>
                    Generate New Report
                  </>
                )}
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Filter and Summary */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <h3 className="text-primary mb-0">{reports.length}</h3>
              <small className="text-muted">Total Reports</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <h3 className="text-success mb-0">{reports.filter(r => r.status === 'completed').length}</h3>
              <small className="text-muted">Completed</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <h3 className="text-warning mb-0">{reports.filter(r => r.status === 'in_progress').length}</h3>
              <small className="text-muted">In Progress</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <h3 className="text-info mb-0">{reports.filter(r => r.status === 'pending_review').length}</h3>
              <small className="text-muted">Pending Review</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filter Controls */}
      <Row className="mb-4">
        <Col md={4}>
          <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Reports</option>
            <option value="completed">Completed</option>
            <option value="in_progress">In Progress</option>
            <option value="pending_review">Pending Review</option>
            <option value="failed">Failed</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Reports Table */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0">
                <i className="ri-file-list-3-line me-2"></i>
                Genomic Analysis Reports
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Report ID</th>
                    <th>Patient</th>
                    <th>Sample ID</th>
                    <th>Report Type</th>
                    <th>Status</th>
                    <th>Created Date</th>
                    <th>Quality Score</th>
                    <th>Variants</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report) => (
                    <tr key={report.id}>
                      <td>
                        <strong className="text-primary">{report.id}</strong>
                      </td>
                      <td>{report.patient_name}</td>
                      <td>
                        <code>{report.sample_id}</code>
                      </td>
                      <td>{report.report_type}</td>
                      <td>{getStatusBadge(report.status)}</td>
                      <td>{report.created_date}</td>
                      <td>{getQualityBadge(report.quality_score)}</td>
                      <td>
                        {report.variants_found !== null ? (
                          <div>
                            <small className="text-muted">Total: {report.variants_found}</small><br/>
                            <small className="text-danger">Pathogenic: {report.pathogenic_variants}</small><br/>
                            <small className="text-warning">VUS: {report.vus_variants}</small>
                          </div>
                        ) : (
                          <Badge bg="secondary">Processing</Badge>
                        )}
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => handleViewReport(report)}
                            disabled={report.status === 'in_progress'}
                          >
                            <i className="ri-eye-line"></i>
                          </Button>
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            disabled={report.status !== 'completed'}
                          >
                            <i className="ri-download-line"></i>
                          </Button>
                          <Button 
                            variant="outline-info" 
                            size="sm"
                            disabled={report.status !== 'completed'}
                          >
                            <i className="ri-share-line"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Report Detail Modal */}
      <Modal show={showReportModal} onHide={() => setShowReportModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-file-text-line me-2"></i>
            Genomic Analysis Report
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReport && (
            <div>
              {/* Report Header */}
              <Row className="mb-4">
                <Col md={6}>
                  <Table borderless>
                    <tbody>
                      <tr>
                        <td><strong>Report ID:</strong></td>
                        <td>{selectedReport.id}</td>
                      </tr>
                      <tr>
                        <td><strong>Patient:</strong></td>
                        <td>{selectedReport.patient_name}</td>
                      </tr>
                      <tr>
                        <td><strong>Sample ID:</strong></td>
                        <td><code>{selectedReport.sample_id}</code></td>
                      </tr>
                      <tr>
                        <td><strong>Report Type:</strong></td>
                        <td>{selectedReport.report_type}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
                <Col md={6}>
                  <Table borderless>
                    <tbody>
                      <tr>
                        <td><strong>Status:</strong></td>
                        <td>{getStatusBadge(selectedReport.status)}</td>
                      </tr>
                      <tr>
                        <td><strong>Created:</strong></td>
                        <td>{selectedReport.created_date}</td>
                      </tr>
                      <tr>
                        <td><strong>Completed:</strong></td>
                        <td>{selectedReport.completion_date || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td><strong>Quality Score:</strong></td>
                        <td>{getQualityBadge(selectedReport.quality_score)}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>

              {selectedReport.status === 'completed' && (
                <>
                  {/* Variant Summary */}
                  <Card className="mb-4">
                    <Card.Header>
                      <h6 className="mb-0">Variant Summary</h6>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={3} className="text-center">
                          <h4 className="text-primary">{selectedReport.variants_found}</h4>
                          <small className="text-muted">Total Variants</small>
                        </Col>
                        <Col md={3} className="text-center">
                          <h4 className="text-danger">{selectedReport.pathogenic_variants}</h4>
                          <small className="text-muted">Pathogenic</small>
                        </Col>
                        <Col md={3} className="text-center">
                          <h4 className="text-warning">{selectedReport.vus_variants}</h4>
                          <small className="text-muted">VUS</small>
                        </Col>
                        <Col md={3} className="text-center">
                          <h4 className="text-success">{selectedReport.benign_variants}</h4>
                          <small className="text-muted">Benign</small>
                        </Col>
                      </Row>
                      <div className="mt-3">
                        <strong>Coverage: {selectedReport.coverage}%</strong>
                        <ProgressBar now={selectedReport.coverage} variant="success" className="mt-1" />
                      </div>
                    </Card.Body>
                  </Card>

                  {/* Clinical Findings */}
                  <Card className="mb-4">
                    <Card.Header>
                      <h6 className="mb-0">Clinical Findings</h6>
                    </Card.Header>
                    <Card.Body>
                      {selectedReport.clinical_findings.length > 0 ? (
                        <ul className="mb-0">
                          {selectedReport.clinical_findings.map((finding, index) => (
                            <li key={index} className="mb-2">
                              <Alert variant="warning" className="mb-2 py-2">
                                <i className="ri-alert-line me-2"></i>
                                {finding}
                              </Alert>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <Alert variant="success">
                          <i className="ri-check-line me-2"></i>
                          No significant pathogenic variants detected.
                        </Alert>
                      )}
                    </Card.Body>
                  </Card>

                  {/* Recommendations */}
                  <Card>
                    <Card.Header>
                      <h6 className="mb-0">Clinical Recommendations</h6>
                    </Card.Header>
                    <Card.Body>
                      {selectedReport.recommendations.length > 0 ? (
                        <ul className="mb-0">
                          {selectedReport.recommendations.map((recommendation, index) => (
                            <li key={index} className="mb-2">
                              <Alert variant="info" className="mb-2 py-2">
                                <i className="ri-lightbulb-line me-2"></i>
                                {recommendation}
                              </Alert>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <Alert variant="secondary">
                          <i className="ri-information-line me-2"></i>
                          No specific recommendations at this time.
                        </Alert>
                      )}
                    </Card.Body>
                  </Card>
                </>
              )}

              {selectedReport.status === 'in_progress' && (
                <Alert variant="info">
                  <i className="ri-time-line me-2"></i>
                  This report is currently being processed. Analysis results will be available once processing is complete.
                </Alert>
              )}

              {selectedReport.status === 'pending_review' && (
                <Alert variant="warning">
                  <i className="ri-eye-line me-2"></i>
                  This report has been processed and is pending clinical review before final approval.
                </Alert>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReportModal(false)}>
            Close
          </Button>
          {selectedReport && selectedReport.status === 'completed' && (
            <>
              <Button variant="primary">
                <i className="ri-download-line me-2"></i>
                Download PDF
              </Button>
              <Button variant="info">
                <i className="ri-share-line me-2"></i>
                Share Report
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Reports;
