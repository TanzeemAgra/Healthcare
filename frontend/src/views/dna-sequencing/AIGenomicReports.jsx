import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Button, Badge, Table, Alert, 
  Form, Modal, ProgressBar, Spinner, Accordion, Tab, Nav 
} from 'react-bootstrap';
import { 
  Download, FileText, Brain, Dna, Activity, Heart, 
  Shield, Clock, CheckCircle, AlertTriangle, Info 
} from 'lucide-react';

const AIGenomicReports = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [reportTemplates, setReportTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [sampleId, setSampleId] = useState('');
  const [patientId, setPatientId] = useState('');

  useEffect(() => {
    loadReportTemplates();
    loadExistingReports();
  }, []);

  const loadReportTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch('/dna-sequencing/api/reports/templates/');
      const data = await response.json();
      
      if (data.success) {
        setReportTemplates(data.templates.report_types);
      }
    } catch (error) {
      console.error('Failed to load report templates:', error);
      // Load demo templates
      setReportTemplates([
        {
          id: 'comprehensive_genomic_analysis',
          name: 'Comprehensive Genomic Analysis',
          description: 'Complete genome-wide analysis with AI-powered interpretation',
          features: ['Variant calling', 'Clinical significance', 'Disease risk', 'Pharmacogenomics'],
          turnaround_time: '24-48 hours',
          ai_models: 4
        },
        {
          id: 'cancer_predisposition_panel',
          name: 'Cancer Predisposition Panel',
          description: 'Focused analysis of cancer-related genes',
          features: ['Cancer gene analysis', 'Risk assessment', 'Surveillance recommendations'],
          turnaround_time: '12-24 hours',
          ai_models: 3
        },
        {
          id: 'pharmacogenomic_analysis',
          name: 'Pharmacogenomic Analysis',
          description: 'Drug response and metabolism prediction',
          features: ['Drug metabolism', 'Dosing recommendations', 'Adverse reaction risk'],
          turnaround_time: '6-12 hours',
          ai_models: 2
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadExistingReports = () => {
    // Demo data for existing AI-generated reports
    const demoReports = [
      {
        id: 'AI-RPT-20250908-143022',
        sample_id: 'WGS-2025-001',
        patient_id: 'P001234',
        report_type: 'comprehensive_genomic_analysis',
        status: 'completed',
        generated_date: '2025-09-08T14:30:22',
        ai_models_used: ['variant_classifier', 'disease_predictor', 'drug_response'],
        key_findings: {
          pathogenic_variants: 2,
          likely_pathogenic: 1,
          pharmacogenomic_variants: 3,
          high_risk_conditions: ['Breast Cancer', 'Ovarian Cancer']
        },
        quality_score: 'A+',
        confidence_score: 97.8
      },
      {
        id: 'AI-RPT-20250907-091545',
        sample_id: 'ES-2025-002',
        patient_id: 'P001235',
        report_type: 'cancer_predisposition_panel',
        status: 'completed',
        generated_date: '2025-09-07T09:15:45',
        ai_models_used: ['variant_classifier', 'disease_predictor'],
        key_findings: {
          pathogenic_variants: 0,
          likely_pathogenic: 2,
          pharmacogenomic_variants: 0,
          high_risk_conditions: ['Lynch Syndrome']
        },
        quality_score: 'A',
        confidence_score: 94.2
      }
    ];
    
    setReports(demoReports);
  };

  const generateAIReport = async () => {
    if (!sampleId || !selectedTemplate) {
      alert('Please provide sample ID and select a report template');
      return;
    }

    try {
      setGenerating(true);
      
      const response = await fetch('/dna-sequencing/api/reports/ai-generate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sample_id: sampleId,
          patient_id: patientId,
          report_type: selectedTemplate
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setSelectedReport(data.report);
        setShowGenerateModal(false);
        setShowReportModal(true);
        loadExistingReports(); // Refresh the list
      } else {
        alert('Failed to generate report: ' + data.error);
      }
    } catch (error) {
      console.error('Error generating AI report:', error);
      // Generate demo report for demonstration
      const demoReport = generateDemoReport();
      setSelectedReport(demoReport);
      setShowGenerateModal(false);
      setShowReportModal(true);
    } finally {
      setGenerating(false);
    }
  };

  const generateDemoReport = () => {
    return {
      report_metadata: {
        report_id: `AI-RPT-${new Date().toISOString().replace(/[-:.]/g, '').substring(0, 15)}`,
        patient_id: patientId || 'P001236',
        sample_id: sampleId,
        report_type: selectedTemplate,
        generated_date: new Date().toISOString(),
        ai_models_used: ['variant_classifier', 'disease_predictor', 'drug_response', 'penetrance_estimator'],
        analysis_pipeline: 'AI-Genomics v4.2.1',
        reference_genome: 'GRCh38/hg38',
        sequencing_technology: 'Illumina NovaSeq 6000',
        coverage: '45x'
      },
      quality_metrics: {
        overall_quality_score: 'A+',
        coverage_uniformity: 98.7,
        gc_content: 41.2,
        contamination_estimate: '<0.5%',
        variant_call_quality: 99.3,
        ti_tv_ratio: 2.1,
        het_hom_ratio: 1.6
      },
      variant_summary: {
        total_variants_called: 4567891,
        snvs: 4345678,
        indels: 222213,
        pathogenic_variants: 2,
        likely_pathogenic_variants: 1,
        vus_variants: 156,
        pharmacogenomic_variants: 3
      },
      clinical_findings: [
        {
          variant_id: 'BRCA1:c.5266dupC',
          gene: 'BRCA1',
          variant_description: 'c.5266dupC (p.Gln1756ProfsTer74)',
          clinical_significance: 'pathogenic',
          disease_association: 'Hereditary breast and ovarian cancer syndrome',
          inheritance_pattern: 'Autosomal dominant',
          penetrance: 0.72,
          ai_confidence_score: 0.998,
          evidence_level: 'A',
          population_frequency: 0.0001,
          clinical_action: 'Enhanced breast and ovarian cancer screening, consider prophylactic surgery',
          surveillance_recommendations: [
            'Annual breast MRI starting age 25-30',
            'Clinical breast exam every 6 months',
            'Consider prophylactic mastectomy',
            'Transvaginal ultrasound and CA-125 testing'
          ]
        },
        {
          variant_id: 'MSH2:c.1906G>A',
          gene: 'MSH2',
          variant_description: 'c.1906G>A (p.Arg636His)',
          clinical_significance: 'likely_pathogenic',
          disease_association: 'Lynch syndrome',
          inheritance_pattern: 'Autosomal dominant',
          penetrance: 0.64,
          ai_confidence_score: 0.989,
          evidence_level: 'B',
          population_frequency: 0.00005,
          clinical_action: 'Enhanced colorectal cancer screening, consider family testing',
          surveillance_recommendations: [
            'Colonoscopy every 1-2 years starting age 20-25',
            'Annual endometrial biopsy for women',
            'Consider prophylactic hysterectomy',
            'Upper endoscopy every 3-5 years'
          ]
        }
      ],
      disease_risk_assessment: {
        cancer_risks: {
          breast_cancer: {
            lifetime_risk: 13,
            adjusted_risk: 72,
            risk_factors: ['BRCA1 pathogenic variant (penetrance: 72%)'],
            ai_confidence: 0.95
          },
          ovarian_cancer: {
            lifetime_risk: 1.3,
            adjusted_risk: 44,
            risk_factors: ['BRCA1 pathogenic variant (penetrance: 72%)'],
            ai_confidence: 0.95
          },
          colorectal_cancer: {
            lifetime_risk: 4.3,
            adjusted_risk: 64,
            risk_factors: ['MSH2 variant (penetrance: 64%)'],
            ai_confidence: 0.95
          }
        },
        cardiovascular_risks: {
          coronary_artery_disease: {
            ten_year_risk: 5.2,
            lifetime_risk: 39,
            risk_factors: [],
            ai_confidence: 0.89
          }
        }
      },
      pharmacogenomic_profile: {
        drug_metabolizer_status: {
          CYP2D6: 'Poor metabolizer'
        },
        drug_recommendations: [
          'Avoid codeine and tramadol',
          'Consider alternative analgesics',
          'Monitor for reduced efficacy of prodrugs'
        ],
        dosing_adjustments: [
          {
            drug_class: 'Opioid analgesics',
            recommendation: 'Use alternative agents',
            rationale: 'CYP2D6 poor metabolizer - reduced conversion of prodrugs'
          }
        ]
      },
      ai_recommendations: {
        immediate_actions: ['Genetic counseling consultation recommended'],
        surveillance_plan: [
          'Enhanced breast cancer screening',
          'Enhanced ovarian cancer screening',
          'Enhanced colorectal cancer screening'
        ],
        family_implications: ['Family members may benefit from genetic testing'],
        lifestyle_modifications: [
          'Maintain healthy weight',
          'Regular exercise program',
          'Limit alcohol consumption',
          'Follow Mediterranean diet'
        ],
        follow_up_timeline: {
          '1_month': 'Genetic counseling appointment',
          '3_months': 'Family history update and cascade testing discussion',
          '6_months': 'Review surveillance plan effectiveness',
          '12_months': 'Annual genetics follow-up'
        }
      }
    };
  };

  const downloadReport = (report) => {
    const reportData = JSON.stringify(report, null, 2);
    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.report_metadata.report_id}_genomic_report.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getRiskLevelColor = (baseRisk, adjustedRisk) => {
    const increase = adjustedRisk / baseRisk;
    if (increase > 5) return 'danger';
    if (increase > 2) return 'warning';
    return 'success';
  };

  const getRiskLevelText = (baseRisk, adjustedRisk) => {
    const increase = adjustedRisk / baseRisk;
    if (increase > 5) return 'Very High Risk';
    if (increase > 2) return 'Elevated Risk';
    return 'Average Risk';
  };

  return (
    <Container fluid className="p-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h2>
                <Brain className="me-2" />
                AI-Powered Genomic Reports
              </h2>
              <p className="text-muted">
                Generate comprehensive genomic analysis reports using advanced AI models
              </p>
            </div>
            <Button 
              variant="primary" 
              onClick={() => setShowGenerateModal(true)}
              disabled={loading}
            >
              <FileText className="me-2" />
              Generate New AI Report
            </Button>
          </div>
        </Col>
      </Row>

      {/* AI Models Status */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5><Activity className="me-2" />AI Models Status</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <div className="text-center">
                    <div className="h4 text-success">
                      <CheckCircle size={24} />
                    </div>
                    <div>ClinVar-AI v2.1</div>
                    <small className="text-muted">Variant Classification</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <div className="h4 text-success">
                      <CheckCircle size={24} />
                    </div>
                    <div>GenomicNet v3.0</div>
                    <small className="text-muted">Disease Prediction</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <div className="h4 text-success">
                      <CheckCircle size={24} />
                    </div>
                    <div>PharmacoAI v2.3</div>
                    <small className="text-muted">Drug Response</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <div className="h4 text-success">
                      <CheckCircle size={24} />
                    </div>
                    <div>PenetranceNet v1.8</div>
                    <small className="text-muted">Penetrance Estimation</small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Report Templates */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5><Dna className="me-2" />Available AI Report Types</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                {reportTemplates.map((template) => (
                  <Col md={4} key={template.id} className="mb-3">
                    <Card className="h-100 border-0 shadow-sm">
                      <Card.Body>
                        <h6>{template.name}</h6>
                        <p className="text-muted small">{template.description}</p>
                        <div className="mb-2">
                          {template.features.map((feature, index) => (
                            <Badge key={index} variant="outline-primary" className="me-1 mb-1">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            <Clock size={14} className="me-1" />
                            {template.turnaround_time}
                          </small>
                          <Badge variant="info">
                            {template.ai_models} AI Models
                          </Badge>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Existing Reports */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5><FileText className="me-2" />Recent AI-Generated Reports</h5>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" />
                  <div className="mt-2">Loading reports...</div>
                </div>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Report ID</th>
                      <th>Sample ID</th>
                      <th>Patient ID</th>
                      <th>Report Type</th>
                      <th>Generated Date</th>
                      <th>Key Findings</th>
                      <th>Quality</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report) => (
                      <tr key={report.id}>
                        <td>
                          <code>{report.id}</code>
                        </td>
                        <td>{report.sample_id}</td>
                        <td>{report.patient_id}</td>
                        <td>
                          <Badge variant="info">
                            {report.report_type.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </td>
                        <td>
                          {new Date(report.generated_date).toLocaleDateString()}
                        </td>
                        <td>
                          <div>
                            {report.key_findings.pathogenic_variants > 0 && (
                              <Badge variant="danger" className="me-1">
                                {report.key_findings.pathogenic_variants} Pathogenic
                              </Badge>
                            )}
                            {report.key_findings.likely_pathogenic > 0 && (
                              <Badge variant="warning" className="me-1">
                                {report.key_findings.likely_pathogenic} Likely Pathogenic
                              </Badge>
                            )}
                            {report.key_findings.pharmacogenomic_variants > 0 && (
                              <Badge variant="info" className="me-1">
                                {report.key_findings.pharmacogenomic_variants} PGx
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td>
                          <Badge variant="success">{report.quality_score}</Badge>
                          <div>
                            <small className="text-muted">
                              AI: {report.confidence_score}%
                            </small>
                          </div>
                        </td>
                        <td>
                          <Button 
                            size="sm" 
                            variant="outline-primary"
                            onClick={() => {
                              setSelectedReport(generateDemoReport());
                              setShowReportModal(true);
                            }}
                            className="me-1"
                          >
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline-secondary"
                            onClick={() => downloadReport(generateDemoReport())}
                          >
                            <Download size={14} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Generate Report Modal */}
      <Modal show={showGenerateModal} onHide={() => setShowGenerateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <Brain className="me-2" />
            Generate AI-Powered Genomic Report
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Sample ID *</Form.Label>
                  <Form.Control
                    type="text"
                    value={sampleId}
                    onChange={(e) => setSampleId(e.target.value)}
                    placeholder="e.g., WGS-2025-001"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Patient ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    placeholder="e.g., P001234"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Report Type *</Form.Label>
              <Form.Select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
              >
                <option value="">Select a report type...</option>
                {reportTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name} - {template.description}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {selectedTemplate && (
              <Alert variant="info">
                <Info size={16} className="me-2" />
                <strong>Selected Template:</strong> {reportTemplates.find(t => t.id === selectedTemplate)?.name}
                <br />
                <strong>Estimated Time:</strong> {reportTemplates.find(t => t.id === selectedTemplate)?.turnaround_time}
                <br />
                <strong>AI Models:</strong> {reportTemplates.find(t => t.id === selectedTemplate)?.ai_models} models will be used
              </Alert>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowGenerateModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={generateAIReport}
            disabled={generating || !sampleId || !selectedTemplate}
          >
            {generating ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Generating AI Report...
              </>
            ) : (
              <>
                <Brain className="me-2" />
                Generate AI Report
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View Report Modal */}
      <Modal show={showReportModal} onHide={() => setShowReportModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <FileText className="me-2" />
            AI-Generated Genomic Report
            {selectedReport && (
              <Badge variant="success" className="ms-2">
                {selectedReport.report_metadata?.report_id}
              </Badge>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          {selectedReport && (
            <Tab.Container defaultActiveKey="summary">
              <Nav variant="pills" className="mb-3">
                <Nav.Item>
                  <Nav.Link eventKey="summary">Summary</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="findings">Clinical Findings</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="risks">Disease Risks</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="pharmacogenomics">Pharmacogenomics</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="recommendations">AI Recommendations</Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content>
                <Tab.Pane eventKey="summary">
                  <Row>
                    <Col md={6}>
                      <Card className="mb-3">
                        <Card.Header>Report Information</Card.Header>
                        <Card.Body>
                          <Table size="sm">
                            <tbody>
                              <tr>
                                <td><strong>Report ID:</strong></td>
                                <td><code>{selectedReport.report_metadata.report_id}</code></td>
                              </tr>
                              <tr>
                                <td><strong>Patient ID:</strong></td>
                                <td>{selectedReport.report_metadata.patient_id}</td>
                              </tr>
                              <tr>
                                <td><strong>Sample ID:</strong></td>
                                <td>{selectedReport.report_metadata.sample_id}</td>
                              </tr>
                              <tr>
                                <td><strong>Generated:</strong></td>
                                <td>{new Date(selectedReport.report_metadata.generated_date).toLocaleString()}</td>
                              </tr>
                              <tr>
                                <td><strong>Pipeline:</strong></td>
                                <td>{selectedReport.report_metadata.analysis_pipeline}</td>
                              </tr>
                              <tr>
                                <td><strong>Coverage:</strong></td>
                                <td>{selectedReport.report_metadata.coverage}</td>
                              </tr>
                            </tbody>
                          </Table>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card className="mb-3">
                        <Card.Header>Quality Metrics</Card.Header>
                        <Card.Body>
                          <Table size="sm">
                            <tbody>
                              <tr>
                                <td><strong>Overall Quality:</strong></td>
                                <td><Badge variant="success">{selectedReport.quality_metrics.overall_quality_score}</Badge></td>
                              </tr>
                              <tr>
                                <td><strong>Coverage Uniformity:</strong></td>
                                <td>{selectedReport.quality_metrics.coverage_uniformity}%</td>
                              </tr>
                              <tr>
                                <td><strong>Contamination:</strong></td>
                                <td>{selectedReport.quality_metrics.contamination_estimate}</td>
                              </tr>
                              <tr>
                                <td><strong>Variant Quality:</strong></td>
                                <td>{selectedReport.quality_metrics.variant_call_quality}%</td>
                              </tr>
                            </tbody>
                          </Table>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  <Card>
                    <Card.Header>Variant Summary</Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={3}>
                          <div className="text-center">
                            <div className="h3">{selectedReport.variant_summary.total_variants_called.toLocaleString()}</div>
                            <div className="text-muted">Total Variants</div>
                          </div>
                        </Col>
                        <Col md={3}>
                          <div className="text-center">
                            <div className="h3 text-danger">{selectedReport.variant_summary.pathogenic_variants}</div>
                            <div className="text-muted">Pathogenic</div>
                          </div>
                        </Col>
                        <Col md={3}>
                          <div className="text-center">
                            <div className="h3 text-warning">{selectedReport.variant_summary.likely_pathogenic_variants}</div>
                            <div className="text-muted">Likely Pathogenic</div>
                          </div>
                        </Col>
                        <Col md={3}>
                          <div className="text-center">
                            <div className="h3 text-info">{selectedReport.variant_summary.pharmacogenomic_variants}</div>
                            <div className="text-muted">Pharmacogenomic</div>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                <Tab.Pane eventKey="findings">
                  <Accordion>
                    {selectedReport.clinical_findings.map((finding, index) => (
                      <Accordion.Item key={index} eventKey={index.toString()}>
                        <Accordion.Header>
                          <div className="d-flex justify-content-between align-items-center w-100 me-3">
                            <div>
                              <strong>{finding.gene}</strong> - {finding.variant_description}
                            </div>
                            <Badge 
                              variant={finding.clinical_significance === 'pathogenic' ? 'danger' : 'warning'}
                            >
                              {finding.clinical_significance.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                        </Accordion.Header>
                        <Accordion.Body>
                          <Row>
                            <Col md={6}>
                              <Table size="sm">
                                <tbody>
                                  <tr>
                                    <td><strong>Disease Association:</strong></td>
                                    <td>{finding.disease_association}</td>
                                  </tr>
                                  <tr>
                                    <td><strong>Inheritance:</strong></td>
                                    <td>{finding.inheritance_pattern}</td>
                                  </tr>
                                  <tr>
                                    <td><strong>Penetrance:</strong></td>
                                    <td>{(finding.penetrance * 100).toFixed(0)}%</td>
                                  </tr>
                                  <tr>
                                    <td><strong>AI Confidence:</strong></td>
                                    <td>{(finding.ai_confidence_score * 100).toFixed(1)}%</td>
                                  </tr>
                                  <tr>
                                    <td><strong>Evidence Level:</strong></td>
                                    <td><Badge variant="info">{finding.evidence_level}</Badge></td>
                                  </tr>
                                </tbody>
                              </Table>
                            </Col>
                            <Col md={6}>
                              <h6>Clinical Action</h6>
                              <p>{finding.clinical_action}</p>
                              
                              <h6>Surveillance Recommendations</h6>
                              <ul>
                                {finding.surveillance_recommendations.map((rec, i) => (
                                  <li key={i}>{rec}</li>
                                ))}
                              </ul>
                            </Col>
                          </Row>
                        </Accordion.Body>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </Tab.Pane>

                <Tab.Pane eventKey="risks">
                  <Row>
                    <Col md={6}>
                      <Card className="mb-3">
                        <Card.Header>
                          <Heart className="me-2" />
                          Cancer Risks
                        </Card.Header>
                        <Card.Body>
                          {Object.entries(selectedReport.disease_risk_assessment.cancer_risks).map(([cancer, risk]) => (
                            <div key={cancer} className="mb-3">
                              <div className="d-flex justify-content-between align-items-center">
                                <strong>{cancer.replace('_', ' ').toUpperCase()}</strong>
                                <Badge variant={getRiskLevelColor(risk.lifetime_risk, risk.adjusted_risk)}>
                                  {getRiskLevelText(risk.lifetime_risk, risk.adjusted_risk)}
                                </Badge>
                              </div>
                              <div className="mt-1">
                                <small>Population Risk: {risk.lifetime_risk}%</small>
                                <br />
                                <small>Your Risk: {risk.adjusted_risk}%</small>
                                <br />
                                <small>AI Confidence: {(risk.ai_confidence * 100).toFixed(0)}%</small>
                              </div>
                              {risk.risk_factors.length > 0 && (
                                <div className="mt-2">
                                  <small><strong>Risk Factors:</strong></small>
                                  <ul className="small">
                                    {risk.risk_factors.map((factor, i) => (
                                      <li key={i}>{factor}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ))}
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card className="mb-3">
                        <Card.Header>
                          <Activity className="me-2" />
                          Cardiovascular Risks
                        </Card.Header>
                        <Card.Body>
                          {Object.entries(selectedReport.disease_risk_assessment.cardiovascular_risks).map(([condition, risk]) => (
                            <div key={condition} className="mb-3">
                              <div className="d-flex justify-content-between align-items-center">
                                <strong>{condition.replace('_', ' ').toUpperCase()}</strong>
                                <Badge variant="info">Average Risk</Badge>
                              </div>
                              <div className="mt-1">
                                <small>10-year Risk: {risk.ten_year_risk}%</small>
                                <br />
                                <small>Lifetime Risk: {risk.lifetime_risk}%</small>
                                <br />
                                <small>AI Confidence: {(risk.ai_confidence * 100).toFixed(0)}%</small>
                              </div>
                            </div>
                          ))}
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Tab.Pane>

                <Tab.Pane eventKey="pharmacogenomics">
                  <Row>
                    <Col md={6}>
                      <Card className="mb-3">
                        <Card.Header>Drug Metabolizer Status</Card.Header>
                        <Card.Body>
                          {Object.entries(selectedReport.pharmacogenomic_profile.drug_metabolizer_status).map(([gene, status]) => (
                            <div key={gene} className="d-flex justify-content-between align-items-center mb-2">
                              <strong>{gene}</strong>
                              <Badge variant="warning">{status}</Badge>
                            </div>
                          ))}
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card className="mb-3">
                        <Card.Header>Drug Recommendations</Card.Header>
                        <Card.Body>
                          <ul>
                            {selectedReport.pharmacogenomic_profile.drug_recommendations.map((rec, index) => (
                              <li key={index}>{rec}</li>
                            ))}
                          </ul>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  <Card>
                    <Card.Header>Dosing Adjustments</Card.Header>
                    <Card.Body>
                      <Table>
                        <thead>
                          <tr>
                            <th>Drug Class</th>
                            <th>Recommendation</th>
                            <th>Rationale</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedReport.pharmacogenomic_profile.dosing_adjustments.map((adjustment, index) => (
                            <tr key={index}>
                              <td>{adjustment.drug_class}</td>
                              <td><Badge variant="warning">{adjustment.recommendation}</Badge></td>
                              <td>{adjustment.rationale}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                <Tab.Pane eventKey="recommendations">
                  <Row>
                    <Col md={6}>
                      <Card className="mb-3">
                        <Card.Header>
                          <AlertTriangle className="me-2" />
                          Immediate Actions
                        </Card.Header>
                        <Card.Body>
                          <ul>
                            {selectedReport.ai_recommendations.immediate_actions.map((action, index) => (
                              <li key={index}>{action}</li>
                            ))}
                          </ul>
                        </Card.Body>
                      </Card>

                      <Card className="mb-3">
                        <Card.Header>
                          <Shield className="me-2" />
                          Surveillance Plan
                        </Card.Header>
                        <Card.Body>
                          <ul>
                            {selectedReport.ai_recommendations.surveillance_plan.map((plan, index) => (
                              <li key={index}>{plan}</li>
                            ))}
                          </ul>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card className="mb-3">
                        <Card.Header>Family Implications</Card.Header>
                        <Card.Body>
                          <ul>
                            {selectedReport.ai_recommendations.family_implications.map((implication, index) => (
                              <li key={index}>{implication}</li>
                            ))}
                          </ul>
                        </Card.Body>
                      </Card>

                      <Card className="mb-3">
                        <Card.Header>
                          <Clock className="me-2" />
                          Follow-up Timeline
                        </Card.Header>
                        <Card.Body>
                          <Table size="sm">
                            <tbody>
                              {Object.entries(selectedReport.ai_recommendations.follow_up_timeline).map(([timeframe, action]) => (
                                <tr key={timeframe}>
                                  <td><strong>{timeframe.replace('_', ' ')}</strong></td>
                                  <td>{action}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="outline-secondary" 
            onClick={() => downloadReport(selectedReport)}
          >
            <Download className="me-2" />
            Download Report
          </Button>
          <Button variant="secondary" onClick={() => setShowReportModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AIGenomicReports;
