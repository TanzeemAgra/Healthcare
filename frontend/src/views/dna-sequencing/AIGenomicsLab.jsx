import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table, Alert, ProgressBar, Modal, Form, Tab, Nav, Dropdown, Spinner } from 'react-bootstrap';
import { Line, Bar, Scatter, Doughnut } from 'react-chartjs-2';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import { DNA_SEQUENCING_PERMISSIONS } from '../../config/dnaSequencingPermissions';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AIGenomicsLab = () => {
  const [activeTab, setActiveTab] = useState('deepvariant');
  const [loading, setLoading] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [selectedModel, setSelectedModel] = useState('deepvariant');
  const [processingStatus, setProcessingStatus] = useState('idle');
  const [showAdvancedModal, setShowAdvancedModal] = useState(false);

  // AI Models Configuration
  const aiModels = {
    deepvariant: {
      name: 'DeepVariant 2.0',
      description: 'Google\'s state-of-the-art deep learning variant caller',
      accuracy: 99.7,
      speed: 'Fast',
      speciality: 'SNVs & Small Indels',
      version: '2.0.1',
      icon: 'ri-brain-line',
      color: 'primary',
      features: ['Deep CNN Architecture', 'Population-aware calling', 'Real-time processing']
    },
    gatk: {
      name: 'GATK CNN Score',
      description: 'Broad Institute\'s neural network variant filtration',
      accuracy: 98.9,
      speed: 'Medium',
      speciality: 'Variant Quality Control',
      version: '4.4.0',
      icon: 'ri-filter-line',
      color: 'success',
      features: ['CNN-based filtering', 'Quality score calibration', 'Population databases']
    },
    longread: {
      name: 'NanoVar AI',
      description: 'Advanced structural variant detection for long reads',
      accuracy: 97.5,
      speed: 'Medium',
      speciality: 'Structural Variants',
      version: '1.8.2',
      icon: 'ri-git-branch-line',
      color: 'warning',
      features: ['Long-read optimized', 'Complex SV detection', 'Breakpoint refinement']
    },
    pharmaco: {
      name: 'PharmacoAI',
      description: 'AI-powered pharmacogenomic analysis and drug response prediction',
      accuracy: 96.8,
      speed: 'Fast',
      speciality: 'Drug Response',
      version: '3.2.1',
      icon: 'ri-medicine-bottle-line',
      color: 'info',
      features: ['Drug metabolism prediction', 'Adverse reaction risk', 'Dosage optimization']
    },
    multiomics: {
      name: 'OmicsNet AI',
      description: 'Multi-omics integration using transformer neural networks',
      accuracy: 95.2,
      speed: 'Slow',
      speciality: 'Systems Biology',
      version: '2.1.0',
      icon: 'ri-share-circle-line',
      color: 'danger',
      features: ['Multi-modal integration', 'Pathway analysis', 'Disease prediction']
    }
  };

  // Demo Analysis Results
  const getAnalysisResults = (modelType) => {
    const baseResults = {
      deepvariant: {
        variants_called: 4892367,
        high_confidence: 4789234,
        accuracy_score: 99.7,
        processing_time: '2.4 hours',
        quality_metrics: {
          precision: 99.8,
          recall: 99.6,
          f1_score: 99.7
        },
        variant_breakdown: {
          snvs: 4657123,
          indels: 235244,
          mnvs: 12456
        },
        clinical_variants: {
          pathogenic: 23,
          likely_pathogenic: 67,
          vus: 234,
          likely_benign: 1456,
          benign: 98765
        }
      },
      gatk: {
        filtered_variants: 234567,
        pass_variants: 189234,
        filter_efficiency: 87.3,
        processing_time: '1.8 hours',
        quality_improvements: {
          before_filtering: 85.2,
          after_filtering: 97.8,
          improvement: 12.6
        },
        filter_categories: {
          low_quality: 23456,
          allele_bias: 12345,
          mapping_quality: 8976,
          strand_bias: 6543
        }
      },
      longread: {
        structural_variants: 2847,
        large_deletions: 1234,
        large_insertions: 987,
        duplications: 456,
        inversions: 123,
        translocations: 47,
        processing_time: '3.2 hours',
        size_distribution: {
          small_sv: 1456,
          medium_sv: 987,
          large_sv: 404
        }
      },
      pharmaco: {
        drug_interactions: 47,
        metabolizer_status: {
          poor: 8,
          intermediate: 12,
          normal: 23,
          rapid: 4
        },
        risk_predictions: {
          high_risk: 6,
          medium_risk: 18,
          low_risk: 23
        },
        drug_recommendations: [
          { drug: 'Warfarin', recommendation: 'Reduce dose by 25%', confidence: 94.2 },
          { drug: 'Clopidogrel', recommendation: 'Alternative therapy', confidence: 89.7 },
          { drug: 'Simvastatin', recommendation: 'Standard dose', confidence: 97.1 }
        ]
      },
      multiomics: {
        integrated_pathways: 234,
        disease_associations: 67,
        biological_networks: 45,
        processing_time: '6.7 hours',
        pathway_enrichment: {
          metabolic: 89,
          signaling: 67,
          immune: 45,
          developmental: 33
        },
        disease_predictions: {
          cardiovascular: 23.4,
          neurological: 12.8,
          cancer: 8.9,
          metabolic: 34.2
        }
      }
    };
    return baseResults[modelType] || baseResults.deepvariant;
  };

  const runAIAnalysis = async (modelType) => {
    setLoading(true);
    setProcessingStatus('initializing');
    
    try {
      // Simulate AI processing with realistic steps
      const steps = [
        'Initializing AI model...',
        'Loading reference genome...',
        'Processing sequencing data...',
        'Running neural network inference...',
        'Applying quality filters...',
        'Generating predictions...',
        'Finalizing results...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProcessingStatus(steps[i]);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      const results = getAnalysisResults(modelType);
      setAnalysisResults(results);
      setSelectedModel(modelType);
      setProcessingStatus('completed');
    } catch (error) {
      console.error('AI Analysis error:', error);
      setProcessingStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // Chart configurations
  const accuracyChartData = {
    labels: Object.keys(aiModels),
    datasets: [{
      label: 'Accuracy (%)',
      data: Object.values(aiModels).map(model => model.accuracy),
      backgroundColor: [
        'rgba(54, 162, 235, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 99, 132, 0.6)'
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 99, 132, 1)'
      ],
      borderWidth: 2
    }]
  };

  const variantDistributionData = analysisResults?.variant_breakdown ? {
    labels: ['SNVs', 'InDels', 'MNVs'],
    datasets: [{
      data: [
        analysisResults.variant_breakdown.snvs,
        analysisResults.variant_breakdown.indels,
        analysisResults.variant_breakdown.mnvs || 0
      ],
      backgroundColor: [
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)'
      ]
    }]
  } : null;

  return (
    <Container fluid>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">
                <i className="ri-robot-line me-3 text-primary"></i>
                AI Genomics Laboratory
              </h2>
              <p className="text-muted mb-0">
                Next-generation AI-powered genomic analysis using state-of-the-art machine learning models
              </p>
            </div>
            <div>
              <Button 
                variant="primary" 
                onClick={() => setShowAdvancedModal(true)}
                className="me-2"
              >
                <i className="ri-settings-3-line me-2"></i>
                Advanced Settings
              </Button>
              <Badge bg="success" className="px-3 py-2">
                <i className="ri-cpu-line me-1"></i>
                GPU Accelerated
              </Badge>
            </div>
          </div>
        </Col>
      </Row>

      {/* AI Models Overview */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-gradient-primary text-white">
              <h5 className="mb-0">
                <i className="ri-brain-line me-2"></i>
                Available AI Models
              </h5>
            </Card.Header>
            <Card.Body className="p-4">
              <Row>
                {Object.entries(aiModels).map(([key, model]) => (
                  <Col lg={4} md={6} key={key} className="mb-4">
                    <Card className={`h-100 border-2 ${selectedModel === key ? `border-${model.color}` : 'border-light'} hover-shadow`}>
                      <Card.Body className="p-4">
                        <div className="d-flex align-items-center mb-3">
                          <div className={`rounded-circle bg-${model.color} text-white p-3 me-3`}>
                            <i className={`${model.icon} fs-4`}></i>
                          </div>
                          <div>
                            <h6 className="mb-1">{model.name}</h6>
                            <Badge bg={model.color} className="opacity-75">
                              v{model.version}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-muted small mb-3">{model.description}</p>
                        
                        <Row className="mb-3">
                          <Col xs={6}>
                            <div className="text-center">
                              <div className={`text-${model.color} fw-bold h5`}>{model.accuracy}%</div>
                              <small className="text-muted">Accuracy</small>
                            </div>
                          </Col>
                          <Col xs={6}>
                            <div className="text-center">
                              <div className="fw-bold h6">{model.speed}</div>
                              <small className="text-muted">Speed</small>
                            </div>
                          </Col>
                        </Row>

                        <div className="mb-3">
                          <small className="text-muted d-block mb-2">Speciality:</small>
                          <Badge bg="light" text="dark" className="px-2 py-1">
                            {model.speciality}
                          </Badge>
                        </div>

                        <div className="mb-3">
                          <small className="text-muted d-block mb-2">Key Features:</small>
                          {model.features.map((feature, idx) => (
                            <Badge key={idx} bg="outline-secondary" className="me-1 mb-1 text-dark border">
                              {feature}
                            </Badge>
                          ))}
                        </div>

                        <Button 
                          variant={model.color}
                          className="w-100"
                          onClick={() => runAIAnalysis(key)}
                          disabled={loading}
                        >
                          {loading && selectedModel === key ? (
                            <>
                              <Spinner animation="border" size="sm" className="me-2" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <i className="ri-play-line me-2"></i>
                              Run Analysis
                            </>
                          )}
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Processing Status */}
      {loading && (
        <Row className="mb-4">
          <Col>
            <Alert variant="info" className="border-0 shadow-sm">
              <div className="d-flex align-items-center">
                <Spinner animation="border" size="sm" className="me-3" />
                <div className="flex-grow-1">
                  <h6 className="mb-1">AI Analysis in Progress</h6>
                  <p className="mb-2">{processingStatus}</p>
                  <ProgressBar animated now={75} height={8} />
                </div>
              </div>
            </Alert>
          </Col>
        </Row>
      )}

      {/* Model Performance Comparison */}
      <Row className="mb-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0">
                <i className="ri-bar-chart-line me-2"></i>
                AI Model Performance Comparison
              </h5>
            </Card.Header>
            <Card.Body>
              <Bar data={accuracyChartData} options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  title: { display: false }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    title: { display: true, text: 'Accuracy (%)' }
                  }
                }
              }} />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0">
                <i className="ri-award-line me-2"></i>
                Best Practices
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <h6 className="text-primary">
                  <i className="ri-check-line me-2"></i>
                  Optimal Model Selection
                </h6>
                <ul className="list-unstyled text-muted small mb-3">
                  <li>• Use DeepVariant for high-accuracy SNV calling</li>
                  <li>• Apply GATK CNN for quality control</li>
                  <li>• NanoVar for structural variants in long reads</li>
                </ul>
              </div>
              
              <div className="mb-3">
                <h6 className="text-success">
                  <i className="ri-shield-check-line me-2"></i>
                  Quality Assurance
                </h6>
                <ul className="list-unstyled text-muted small mb-3">
                  <li>• Validate with orthogonal methods</li>
                  <li>• Use population databases for filtering</li>
                  <li>• Implement confidence thresholds</li>
                </ul>
              </div>

              <div>
                <h6 className="text-warning">
                  <i className="ri-lightbulb-line me-2"></i>
                  Performance Tips
                </h6>
                <ul className="list-unstyled text-muted small">
                  <li>• Enable GPU acceleration</li>
                  <li>• Use parallel processing</li>
                  <li>• Optimize memory allocation</li>
                </ul>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Analysis Results */}
      {analysisResults && (
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="ri-file-chart-line me-2"></i>
                    Analysis Results - {aiModels[selectedModel]?.name}
                  </h5>
                  <Badge bg="success">
                    <i className="ri-check-line me-1"></i>
                    Completed
                  </Badge>
                </div>
              </Card.Header>
              <Card.Body>
                <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
                  <Nav variant="pills" className="mb-4">
                    <Nav.Item>
                      <Nav.Link eventKey="summary">
                        <i className="ri-dashboard-line me-2"></i>Summary
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="variants">
                        <i className="ri-dna-line me-2"></i>Variants
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="quality">
                        <i className="ri-star-line me-2"></i>Quality
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="clinical">
                        <i className="ri-hospital-line me-2"></i>Clinical
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>

                  <Tab.Content>
                    <Tab.Pane eventKey="summary">
                      <Row>
                        <Col lg={8}>
                          <Row>
                            {selectedModel === 'deepvariant' && (
                              <>
                                <Col md={3} className="mb-3">
                                  <Card className="border-0 bg-primary text-white text-center">
                                    <Card.Body>
                                      <h4>{analysisResults.variants_called?.toLocaleString()}</h4>
                                      <small>Total Variants</small>
                                    </Card.Body>
                                  </Card>
                                </Col>
                                <Col md={3} className="mb-3">
                                  <Card className="border-0 bg-success text-white text-center">
                                    <Card.Body>
                                      <h4>{analysisResults.high_confidence?.toLocaleString()}</h4>
                                      <small>High Confidence</small>
                                    </Card.Body>
                                  </Card>
                                </Col>
                                <Col md={3} className="mb-3">
                                  <Card className="border-0 bg-info text-white text-center">
                                    <Card.Body>
                                      <h4>{analysisResults.accuracy_score}%</h4>
                                      <small>Accuracy</small>
                                    </Card.Body>
                                  </Card>
                                </Col>
                                <Col md={3} className="mb-3">
                                  <Card className="border-0 bg-warning text-white text-center">
                                    <Card.Body>
                                      <h4>{analysisResults.processing_time}</h4>
                                      <small>Processing Time</small>
                                    </Card.Body>
                                  </Card>
                                </Col>
                              </>
                            )}

                            {selectedModel === 'pharmaco' && (
                              <>
                                <Col md={3} className="mb-3">
                                  <Card className="border-0 bg-info text-white text-center">
                                    <Card.Body>
                                      <h4>{analysisResults.drug_interactions}</h4>
                                      <small>Drug Interactions</small>
                                    </Card.Body>
                                  </Card>
                                </Col>
                                <Col md={9} className="mb-3">
                                  <Card className="border-0 bg-light">
                                    <Card.Body>
                                      <h6 className="mb-3">Drug Recommendations</h6>
                                      {analysisResults.drug_recommendations?.map((rec, idx) => (
                                        <div key={idx} className="d-flex justify-content-between align-items-center mb-2">
                                          <div>
                                            <strong>{rec.drug}</strong>
                                            <br />
                                            <small className="text-muted">{rec.recommendation}</small>
                                          </div>
                                          <Badge bg="success">{rec.confidence}%</Badge>
                                        </div>
                                      ))}
                                    </Card.Body>
                                  </Card>
                                </Col>
                              </>
                            )}
                          </Row>
                        </Col>
                        <Col lg={4}>
                          {variantDistributionData && (
                            <Card className="border-0 bg-light">
                              <Card.Body>
                                <h6 className="mb-3">Variant Distribution</h6>
                                <Doughnut data={variantDistributionData} />
                              </Card.Body>
                            </Card>
                          )}
                        </Col>
                      </Row>
                    </Tab.Pane>

                    <Tab.Pane eventKey="variants">
                      <div className="table-responsive">
                        <Table hover>
                          <thead className="table-light">
                            <tr>
                              <th>Variant Type</th>
                              <th>Count</th>
                              <th>Percentage</th>
                              <th>Quality Score</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedModel === 'deepvariant' && analysisResults.variant_breakdown && Object.entries(analysisResults.variant_breakdown).map(([type, count]) => (
                              <tr key={type}>
                                <td>
                                  <Badge bg="primary">{type.toUpperCase()}</Badge>
                                </td>
                                <td>{count.toLocaleString()}</td>
                                <td>{((count / analysisResults.variants_called) * 100).toFixed(1)}%</td>
                                <td>
                                  <ProgressBar 
                                    now={95 + Math.random() * 5} 
                                    variant="success" 
                                    style={{ height: '8px' }}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </Tab.Pane>

                    <Tab.Pane eventKey="quality">
                      <Row>
                        <Col md={6}>
                          <h6 className="mb-3">Quality Metrics</h6>
                          {analysisResults.quality_metrics && Object.entries(analysisResults.quality_metrics).map(([metric, value]) => (
                            <div key={metric} className="d-flex justify-content-between align-items-center mb-2">
                              <span className="text-capitalize">{metric.replace('_', ' ')}</span>
                              <Badge bg="success">{value}%</Badge>
                            </div>
                          ))}
                        </Col>
                        <Col md={6}>
                          <h6 className="mb-3">Processing Statistics</h6>
                          <div className="bg-light p-3 rounded">
                            <p className="mb-2">
                              <strong>Model:</strong> {aiModels[selectedModel]?.name}
                            </p>
                            <p className="mb-2">
                              <strong>Version:</strong> {aiModels[selectedModel]?.version}
                            </p>
                            <p className="mb-0">
                              <strong>Processing Time:</strong> {analysisResults.processing_time}
                            </p>
                          </div>
                        </Col>
                      </Row>
                    </Tab.Pane>

                    <Tab.Pane eventKey="clinical">
                      <Row>
                        <Col>
                          <h6 className="mb-3">Clinical Significance Distribution</h6>
                          {analysisResults.clinical_variants && (
                            <Row>
                              {Object.entries(analysisResults.clinical_variants).map(([significance, count]) => (
                                <Col md={2.4} key={significance} className="mb-3">
                                  <Card className="border-0 bg-light text-center">
                                    <Card.Body>
                                      <h5 className="text-primary">{count}</h5>
                                      <small className="text-muted text-capitalize">
                                        {significance.replace('_', ' ')}
                                      </small>
                                    </Card.Body>
                                  </Card>
                                </Col>
                              ))}
                            </Row>
                          )}
                        </Col>
                      </Row>
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Advanced Settings Modal */}
      <Modal show={showAdvancedModal} onHide={() => setShowAdvancedModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-settings-3-line me-2"></i>
            Advanced AI Configuration
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <h6 className="mb-3">Model Parameters</h6>
              <Form.Group className="mb-3">
                <Form.Label>Confidence Threshold</Form.Label>
                <Form.Range min={0.5} max={1.0} step={0.01} defaultValue={0.95} />
                <small className="text-muted">95% confidence</small>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Quality Filter</Form.Label>
                <Form.Select defaultValue="strict">
                  <option value="lenient">Lenient</option>
                  <option value="standard">Standard</option>
                  <option value="strict">Strict</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check 
                  type="checkbox" 
                  label="Enable GPU acceleration" 
                  defaultChecked 
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check 
                  type="checkbox" 
                  label="Use population databases" 
                  defaultChecked 
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <h6 className="mb-3">Output Options</h6>
              <Form.Group className="mb-3">
                <Form.Label>Output Format</Form.Label>
                <Form.Select defaultValue="vcf">
                  <option value="vcf">VCF</option>
                  <option value="json">JSON</option>
                  <option value="csv">CSV</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check 
                  type="checkbox" 
                  label="Include confidence scores" 
                  defaultChecked 
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check 
                  type="checkbox" 
                  label="Generate detailed report" 
                  defaultChecked 
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check 
                  type="checkbox" 
                  label="Export to cloud storage" 
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowAdvancedModal(false)}>
            Cancel
          </Button>
          <Button variant="primary">
            <i className="ri-save-line me-2"></i>
            Save Configuration
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

// Protected wrapper for AI Genomics Lab
const ProtectedAIGenomicsLab = () => {
  return (
    <ProtectedRoute 
      permission="canAccessDnaSequencingModule" 
      moduleName="AI Genomics Laboratory"
    >
      <AIGenomicsLab />
    </ProtectedRoute>
  );
};

export default ProtectedAIGenomicsLab;
