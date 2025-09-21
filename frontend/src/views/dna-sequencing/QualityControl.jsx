import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table, Alert, ProgressBar, Tab, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const QualityControl = () => {
  const [qcData, setQcData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load demo QC data
    const demoQcData = {
      sample_info: {
        sample_id: 'DNA-2024-QC-001',
        sequencing_run: 'NovaSeq-240801-001',
        sequencing_date: '2024-08-01',
        library_prep: 'TruSeq Nano DNA',
        sequencer: 'NovaSeq 6000'
      },
      quality_metrics: {
        total_reads: 458692340,
        passed_filter_reads: 455281076,
        q30_percentage: 92.8,
        mean_quality_score: 36.2,
        gc_content: 41.2,
        sequence_duplication: 8.5,
        adapter_content: 0.02,
        overrepresented_sequences: 0.1
      },
      coverage_metrics: {
        mean_coverage: 45.6,
        coverage_uniformity: 94.2,
        target_coverage_10x: 98.7,
        target_coverage_20x: 96.3,
        target_coverage_30x: 91.8,
        genome_coverage: 95.4
      },
      contamination_check: {
        human_percentage: 99.8,
        bacterial_percentage: 0.1,
        viral_percentage: 0.05,
        other_percentage: 0.05,
        contamination_level: 'LOW'
      },
      technical_metrics: {
        insert_size_median: 350,
        insert_size_std: 45,
        mapping_rate: 96.4,
        properly_paired: 94.8,
        pcr_duplicates: 12.3,
        optical_duplicates: 0.8
      }
    };
    
    setQcData(demoQcData);
  }, []);

  const getQualityStatus = (value, thresholds) => {
    if (value >= thresholds.excellent) return { status: 'Excellent', variant: 'success' };
    if (value >= thresholds.good) return { status: 'Good', variant: 'info' };
    if (value >= thresholds.acceptable) return { status: 'Acceptable', variant: 'warning' };
    return { status: 'Poor', variant: 'danger' };
  };

  const renderQualityBadge = (value, thresholds, suffix = '') => {
    const { status, variant } = getQualityStatus(value, thresholds);
    return (
      <div>
        <span className="fw-bold">{value}{suffix}</span>
        <Badge bg={variant} className="ms-2">{status}</Badge>
      </div>
    );
  };

  const renderProgressBar = (value, max = 100, variant = 'primary') => {
    return (
      <div>
        <div className="d-flex justify-content-between mb-1">
          <span>{value}%</span>
          <span>Target: {max}%</span>
        </div>
        <ProgressBar now={value} max={max} variant={variant} />
      </div>
    );
  };

  if (!qcData) {
    return (
      <Container fluid>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>Quality Control</h2>
              <p className="text-muted">Comprehensive quality assessment of sequencing data</p>
            </div>
            <div>
              <Button as={Link} to="/dna-sequencing/dashboard" variant="outline-primary" className="me-2">
                Back to Dashboard
              </Button>
              <Button variant="primary">
                <i className="ri-download-line me-2"></i>
                Download Report
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Sample Information */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <i className="ri-information-line me-2"></i>
                Sample Information
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Table borderless>
                    <tbody>
                      <tr>
                        <td><strong>Sample ID:</strong></td>
                        <td>{qcData.sample_info.sample_id}</td>
                      </tr>
                      <tr>
                        <td><strong>Sequencing Run:</strong></td>
                        <td>{qcData.sample_info.sequencing_run}</td>
                      </tr>
                      <tr>
                        <td><strong>Sequencing Date:</strong></td>
                        <td>{qcData.sample_info.sequencing_date}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
                <Col md={6}>
                  <Table borderless>
                    <tbody>
                      <tr>
                        <td><strong>Library Prep:</strong></td>
                        <td>{qcData.sample_info.library_prep}</td>
                      </tr>
                      <tr>
                        <td><strong>Sequencer:</strong></td>
                        <td>{qcData.sample_info.sequencer}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quality Control Tabs */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Tab.Container defaultActiveKey="read-quality">
              <Card.Header className="bg-white border-0">
                <Nav variant="tabs" className="border-0">
                  <Nav.Item>
                    <Nav.Link eventKey="read-quality">Read Quality</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="coverage">Coverage Metrics</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="contamination">Contamination</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="technical">Technical Metrics</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Header>
              <Card.Body>
                <Tab.Content>
                  {/* Read Quality Tab */}
                  <Tab.Pane eventKey="read-quality">
                    <Row>
                      <Col md={6}>
                        <h6 className="mb-3">Sequencing Quality</h6>
                        <Table>
                          <tbody>
                            <tr>
                              <td><strong>Total Reads:</strong></td>
                              <td>{qcData.quality_metrics.total_reads.toLocaleString()}</td>
                            </tr>
                            <tr>
                              <td><strong>Passed Filter:</strong></td>
                              <td>{qcData.quality_metrics.passed_filter_reads.toLocaleString()}</td>
                            </tr>
                            <tr>
                              <td><strong>Q30 Percentage:</strong></td>
                              <td>{renderQualityBadge(qcData.quality_metrics.q30_percentage, {
                                excellent: 90, good: 80, acceptable: 70
                              }, '%')}</td>
                            </tr>
                            <tr>
                              <td><strong>Mean Quality Score:</strong></td>
                              <td>{renderQualityBadge(qcData.quality_metrics.mean_quality_score, {
                                excellent: 35, good: 30, acceptable: 25
                              })}</td>
                            </tr>
                          </tbody>
                        </Table>
                      </Col>
                      <Col md={6}>
                        <h6 className="mb-3">Sequence Composition</h6>
                        <Table>
                          <tbody>
                            <tr>
                              <td><strong>GC Content:</strong></td>
                              <td>{renderQualityBadge(qcData.quality_metrics.gc_content, {
                                excellent: 42, good: 38, acceptable: 35
                              }, '%')}</td>
                            </tr>
                            <tr>
                              <td><strong>Sequence Duplication:</strong></td>
                              <td>{renderQualityBadge(15 - qcData.quality_metrics.sequence_duplication, {
                                excellent: 10, good: 8, acceptable: 6
                              }, '% (Low)')}</td>
                            </tr>
                            <tr>
                              <td><strong>Adapter Content:</strong></td>
                              <td>{renderQualityBadge(5 - qcData.quality_metrics.adapter_content, {
                                excellent: 4.5, good: 4, acceptable: 3
                              }, '% (Low)')}</td>
                            </tr>
                            <tr>
                              <td><strong>Overrepresented Sequences:</strong></td>
                              <td>{renderQualityBadge(5 - qcData.quality_metrics.overrepresented_sequences, {
                                excellent: 4.5, good: 4, acceptable: 3
                              }, '% (Low)')}</td>
                            </tr>
                          </tbody>
                        </Table>
                      </Col>
                    </Row>
                  </Tab.Pane>

                  {/* Coverage Tab */}
                  <Tab.Pane eventKey="coverage">
                    <Row>
                      <Col md={6}>
                        <h6 className="mb-3">Coverage Statistics</h6>
                        <Table>
                          <tbody>
                            <tr>
                              <td><strong>Mean Coverage:</strong></td>
                              <td>{renderQualityBadge(qcData.coverage_metrics.mean_coverage, {
                                excellent: 40, good: 30, acceptable: 20
                              }, 'x')}</td>
                            </tr>
                            <tr>
                              <td><strong>Coverage Uniformity:</strong></td>
                              <td>{renderQualityBadge(qcData.coverage_metrics.coverage_uniformity, {
                                excellent: 90, good: 85, acceptable: 80
                              }, '%')}</td>
                            </tr>
                            <tr>
                              <td><strong>Genome Coverage:</strong></td>
                              <td>{renderQualityBadge(qcData.coverage_metrics.genome_coverage, {
                                excellent: 95, good: 90, acceptable: 85
                              }, '%')}</td>
                            </tr>
                          </tbody>
                        </Table>
                      </Col>
                      <Col md={6}>
                        <h6 className="mb-3">Target Coverage Distribution</h6>
                        <div className="mb-3">
                          <strong>≥10x Coverage</strong>
                          {renderProgressBar(qcData.coverage_metrics.target_coverage_10x, 100, 'success')}
                        </div>
                        <div className="mb-3">
                          <strong>≥20x Coverage</strong>
                          {renderProgressBar(qcData.coverage_metrics.target_coverage_20x, 100, 'info')}
                        </div>
                        <div className="mb-3">
                          <strong>≥30x Coverage</strong>
                          {renderProgressBar(qcData.coverage_metrics.target_coverage_30x, 100, 'warning')}
                        </div>
                      </Col>
                    </Row>
                  </Tab.Pane>

                  {/* Contamination Tab */}
                  <Tab.Pane eventKey="contamination">
                    <Row>
                      <Col md={6}>
                        <h6 className="mb-3">Species Composition</h6>
                        <Table>
                          <tbody>
                            <tr>
                              <td><strong>Human DNA:</strong></td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <span className="fw-bold me-2">{qcData.contamination_check.human_percentage}%</span>
                                  <Badge bg="success">Excellent</Badge>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td><strong>Bacterial DNA:</strong></td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <span className="fw-bold me-2">{qcData.contamination_check.bacterial_percentage}%</span>
                                  <Badge bg="success">Low</Badge>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td><strong>Viral DNA:</strong></td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <span className="fw-bold me-2">{qcData.contamination_check.viral_percentage}%</span>
                                  <Badge bg="success">Low</Badge>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td><strong>Other:</strong></td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <span className="fw-bold me-2">{qcData.contamination_check.other_percentage}%</span>
                                  <Badge bg="success">Low</Badge>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </Col>
                      <Col md={6}>
                        <h6 className="mb-3">Contamination Assessment</h6>
                        <Alert variant="success">
                          <Alert.Heading className="h6">
                            <i className="ri-check-line me-2"></i>
                            Contamination Level: {qcData.contamination_check.contamination_level}
                          </Alert.Heading>
                          <p className="mb-0">
                            The sample shows minimal contamination with {qcData.contamination_check.human_percentage}% human DNA content. 
                            This meets the quality standards for downstream analysis.
                          </p>
                        </Alert>
                      </Col>
                    </Row>
                  </Tab.Pane>

                  {/* Technical Metrics Tab */}
                  <Tab.Pane eventKey="technical">
                    <Row>
                      <Col md={6}>
                        <h6 className="mb-3">Alignment Metrics</h6>
                        <Table>
                          <tbody>
                            <tr>
                              <td><strong>Mapping Rate:</strong></td>
                              <td>{renderQualityBadge(qcData.technical_metrics.mapping_rate, {
                                excellent: 95, good: 90, acceptable: 85
                              }, '%')}</td>
                            </tr>
                            <tr>
                              <td><strong>Properly Paired:</strong></td>
                              <td>{renderQualityBadge(qcData.technical_metrics.properly_paired, {
                                excellent: 90, good: 85, acceptable: 80
                              }, '%')}</td>
                            </tr>
                            <tr>
                              <td><strong>PCR Duplicates:</strong></td>
                              <td>{renderQualityBadge(20 - qcData.technical_metrics.pcr_duplicates, {
                                excellent: 15, good: 10, acceptable: 5
                              }, '% (Low)')}</td>
                            </tr>
                            <tr>
                              <td><strong>Optical Duplicates:</strong></td>
                              <td>{renderQualityBadge(5 - qcData.technical_metrics.optical_duplicates, {
                                excellent: 4.5, good: 4, acceptable: 3
                              }, '% (Low)')}</td>
                            </tr>
                          </tbody>
                        </Table>
                      </Col>
                      <Col md={6}>
                        <h6 className="mb-3">Insert Size Metrics</h6>
                        <Table>
                          <tbody>
                            <tr>
                              <td><strong>Median Insert Size:</strong></td>
                              <td>
                                <span className="fw-bold">{qcData.technical_metrics.insert_size_median} bp</span>
                                <Badge bg="success" className="ms-2">Optimal</Badge>
                              </td>
                            </tr>
                            <tr>
                              <td><strong>Insert Size Std Dev:</strong></td>
                              <td>
                                <span className="fw-bold">{qcData.technical_metrics.insert_size_std} bp</span>
                                <Badge bg="info" className="ms-2">Good</Badge>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                        
                        <Alert variant="info" className="mt-3">
                          <strong>Quality Summary:</strong> All technical metrics are within acceptable ranges for high-quality sequencing data. 
                          Proceed with confidence to variant calling and downstream analysis.
                        </Alert>
                      </Col>
                    </Row>
                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Tab.Container>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default QualityControl;
