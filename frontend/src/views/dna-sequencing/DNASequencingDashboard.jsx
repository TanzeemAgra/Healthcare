import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table, Alert, ProgressBar, Modal, Form, Tab, Nav, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import ChartErrorBoundary from '../../components/ChartErrorBoundary';
import SimplePermissionDebugger from '../../components/debug/SimplePermissionDebugger';
import { usePermissions } from '../../contexts/PermissionContext';
import apiClient from '../../services/api';
import AIGenomicReports from './AIGenomicReports';
import WholeGenomeAnalysisModal from './modals/WholeGenomeAnalysisModal';
import ExomeSequencingModal from './modals/ExomeSequencingModal';
import PharmacogenomicsModal from './modals/PharmacogenomicsModal';

const DNASequencingDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendOnline, setBackendOnline] = useState(true);
  const [selectedSample, setSelectedSample] = useState(null);
  const [showSampleModal, setShowSampleModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeView, setActiveView] = useState('overview');
  const [showDebugger, setShowDebugger] = useState(false);
  const [showWholeGenomeModal, setShowWholeGenomeModal] = useState(false);
  const [showExomeModal, setShowExomeModal] = useState(false);
  const [showPharmacogenomicsModal, setShowPharmacogenomicsModal] = useState(false);
  
  const permissions = usePermissions();

  useEffect(() => {
    console.log('DNA Sequencing Dashboard component mounted!');
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/dna-sequencing/api/dashboard/');
      setDashboardData(response.data);
      setBackendOnline(true);
    } catch (error) {
      console.error('Failed to fetch DNA Sequencing dashboard data:', error);
      console.log('Loading demo data for DNA Sequencing dashboard...');
      
      // Enhanced demo data when backend is unavailable
      const demoData = {
        summary: {
          total_samples: 47,
          pending_analyses: 8,
          completed_analyses: 32,
          failed_analyses: 7,
          total_variants: 28750,
          high_impact_variants: 245,
          medium_impact_variants: 1680,
          low_impact_variants: 26825,
          pathogenic_variants: 12,
          likely_pathogenic: 33,
          vus_variants: 156,
          likely_benign: 892,
          benign_variants: 27657
        },
        recent_samples: [
          {
            id: 1,
            sample_id: 'WGS-2024-001',
            patient_name: 'John Smith',
            patient_id: 'P001234',
            status: 'completed',
            quality_score: 98.5,
            coverage: '45x',
            completion_date: '2024-08-06',
            analysis_type: 'Whole Genome Sequencing',
            indication: 'Hereditary Cancer Screening',
            urgency: 'routine',
            variants_found: 8924,
            pathogenic_found: 2
          },
          {
            id: 2,
            sample_id: 'ES-2024-002',
            patient_name: 'Sarah Johnson',
            patient_id: 'P001235',
            status: 'processing',
            quality_score: null,
            coverage: null,
            completion_date: null,
            analysis_type: 'Exome Sequencing',
            indication: 'Rare Disease Diagnosis',
            urgency: 'urgent',
            variants_found: null,
            pathogenic_found: null,
            progress: 78
          },
          {
            id: 3,
            sample_id: 'TP-2024-003',
            patient_name: 'Michael Brown',
            patient_id: 'P001236',
            status: 'pending',
            quality_score: null,
            coverage: null,
            completion_date: null,
            analysis_type: 'Targeted Panel',
            indication: 'Cardiovascular Risk',
            urgency: 'routine',
            variants_found: null,
            pathogenic_found: null
          },
          {
            id: 4,
            sample_id: 'PGx-2024-004',
            patient_name: 'Emily Davis',
            patient_id: 'P001237',
            status: 'completed',
            quality_score: 96.8,
            coverage: '150x',
            completion_date: '2024-08-05',
            analysis_type: 'Pharmacogenomics',
            indication: 'Drug Response Prediction',
            urgency: 'routine',
            variants_found: 234,
            pathogenic_found: 0
          },
          {
            id: 5,
            sample_id: 'WGS-2024-005',
            patient_name: 'David Wilson',
            patient_id: 'P001238',
            status: 'failed',
            quality_score: 45.2,
            coverage: '12x',
            completion_date: '2024-08-04',
            analysis_type: 'Whole Genome Sequencing',
            indication: 'Neurological Disorder',
            urgency: 'urgent',
            variants_found: null,
            pathogenic_found: null,
            failure_reason: 'Low coverage'
          },
          {
            id: 6,
            sample_id: 'ONT-2024-006',
            patient_name: 'Lisa Chang',
            patient_id: 'P001239',
            status: 'completed',
            quality_score: 94.2,
            coverage: '35x',
            completion_date: '2024-08-07',
            analysis_type: 'Long-read Sequencing',
            indication: 'Structural Variants',
            urgency: 'routine',
            variants_found: 1256,
            pathogenic_found: 1
          }
        ],
        analysis_stats: {
          avg_turnaround_time: 4.2,
          success_rate: 85.1,
          avg_quality_score: 91.8,
          total_data_processed: '8.7 TB',
          active_workflows: 12,
          queue_length: 8,
          monthly_throughput: 156,
          cost_per_sample: '$1,250'
        },
        variant_statistics: {
          snvs: 25480,
          indels: 3270,
          cnvs: 892,
          svs: 156,
          insertions: 1680,
          deletions: 1590,
          duplications: 234,
          inversions: 45,
          translocations: 23
        },
        technology_stats: {
          illumina: { count: 28, percentage: 59.6 },
          oxford_nanopore: { count: 12, percentage: 25.5 },
          pacbio: { count: 7, percentage: 14.9 }
        },
        clinical_findings: [
          {
            category: 'Cancer Predisposition',
            gene: 'BRCA1',
            variant: 'c.5266dupC',
            classification: 'Pathogenic',
            patients: 2
          },
          {
            category: 'Cardiovascular',
            gene: 'LDLR',
            variant: 'c.2311+1G>A',
            classification: 'Likely Pathogenic',
            patients: 1
          },
          {
            category: 'Pharmacogenomics',
            gene: 'CYP2D6',
            variant: '*4/*4',
            classification: 'Poor Metabolizer',
            patients: 3
          }
        ]
      };
      
      setDashboardData(demoData);
      setBackendOnline(false);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'completed': return 'success';
      case 'failed': return 'danger';
      case 'queued': return 'secondary';
      default: return 'light';
    }
  };

  const getQualityBadgeVariant = (score) => {
    if (score >= 95) return 'success';
    if (score >= 90) return 'warning';
    if (score >= 80) return 'info';
    return 'danger';
  };

  const handleStartAnalysis = async (analysisData) => {
    try {
      console.log('Starting analysis:', analysisData);
      
      // Call the backend API to start the analysis
      const response = await apiClient.post('/dna-sequencing/api/start-analysis/', analysisData);
      
      if (response.data.success) {
        // Show success message and refresh dashboard
        alert(`Analysis started successfully! Sample ID: ${analysisData.sample_id}`);
        fetchDashboardData();
      } else {
        throw new Error(response.data.message || 'Failed to start analysis');
      }
    } catch (error) {
      console.error('Failed to start analysis:', error);
      alert(`Failed to start analysis: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading DNA sequencing dashboard...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error Loading Dashboard</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={fetchDashboardData}>
            Try Again
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Enhanced Header Section */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="mb-2 text-primary">
                <i className="ri-dna-line me-2"></i>
                DNA Sequencing Laboratory
              </h1>
              <p className="text-muted mb-0">Advanced genomic analysis and precision medicine platform</p>
              <div className="d-flex gap-2 mt-2">
                <Badge bg="success" className="px-3 py-2">
                  <i className="ri-shield-check-line me-1"></i>
                  ISO 15189 Certified
                </Badge>
                <Badge bg="info" className="px-3 py-2">
                  <i className="ri-robot-line me-1"></i>
                  AI-Powered Analysis
                </Badge>
                <Badge bg="warning" className="px-3 py-2">
                  <i className="ri-time-line me-1"></i>
                  Real-time Processing
                </Badge>
              </div>
            </div>
            <div className="d-flex flex-wrap gap-2">
              <Dropdown>
                <Dropdown.Toggle variant="outline-primary" id="new-analysis-dropdown">
                  <i className="ri-add-line me-1"></i>New Analysis
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setShowUploadModal(true)}>
                    <i className="ri-upload-line me-2"></i>Upload Sample
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setShowWholeGenomeModal(true)}>
                    <i className="ri-microscope-line me-2"></i>Whole Genome
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setShowExomeModal(true)}>
                    <i className="ri-dna-line me-2"></i>Exome Sequencing
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setShowPharmacogenomicsModal(true)}>
                    <i className="ri-medicine-bottle-line me-2"></i>Pharmacogenomics
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Button as={Link} to="/dna-sequencing/analysis" variant="success">
                <i className="ri-bar-chart-line me-1"></i>Analysis
              </Button>
              <Button as={Link} to="/dna-sequencing/variant-calling" variant="info">
                <i className="ri-git-branch-line me-1"></i>Variants
              </Button>
              <Button as={Link} to="/dna-sequencing/quality-control" variant="warning">
                <i className="ri-shield-check-line me-1"></i>QC
              </Button>
              <Button as={Link} to="/dna-sequencing/reports" variant="secondary">
                <i className="ri-file-chart-line me-1"></i>Reports
              </Button>
              <Button 
                variant="outline-info" 
                size="sm"
                onClick={() => setShowDebugger(!showDebugger)}
              >
                <i className="ri-bug-line me-1"></i>Debug
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Debug Panel */}
      {showDebugger && (
        <Row className="mb-4">
          <Col>
            <SimplePermissionDebugger />
          </Col>
        </Row>
      )}

      {/* Status Alert */}
      {!backendOnline && (
        <Alert variant="info" className="mb-4">
          <Alert.Heading>
            <i className="ri-information-line me-2"></i>
            Demo Mode Active
          </Alert.Heading>
          <p className="mb-0">
            Backend services are currently unavailable. Displaying demo data for demonstration purposes.
            All features are functional with sample genomic data.
          </p>
        </Alert>
      )}

      {/* Enhanced Key Metrics Cards */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <div className="bg-primary bg-opacity-10 rounded-circle p-3">
                  <i className="ri-test-tube-line text-primary fs-4"></i>
                </div>
              </div>
              <h3 className="mb-1 text-primary">{dashboardData?.summary?.total_samples?.toLocaleString()}</h3>
              <p className="text-muted mb-1">Total Samples</p>
              <small className="text-success">
                <i className="ri-arrow-up-line"></i> +{Math.round((dashboardData?.analysis_stats?.monthly_throughput || 0) / 10)}% this month
              </small>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <div className="bg-success bg-opacity-10 rounded-circle p-3">
                  <i className="ri-dna-line text-success fs-4"></i>
                </div>
              </div>
              <h3 className="mb-1 text-success">{dashboardData?.summary?.total_variants?.toLocaleString()}</h3>
              <p className="text-muted mb-1">Total Variants</p>
              <small className="text-info">
                <i className="ri-information-line"></i> {dashboardData?.summary?.pathogenic_variants} pathogenic
              </small>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <div className="bg-info bg-opacity-10 rounded-circle p-3">
                  <i className="ri-time-line text-info fs-4"></i>
                </div>
              </div>
              <h3 className="mb-1 text-info">{dashboardData?.analysis_stats?.avg_turnaround_time}</h3>
              <p className="text-muted mb-1">Avg. Turnaround (days)</p>
              <small className="text-warning">
                <i className="ri-timer-line"></i> Queue: {dashboardData?.analysis_stats?.queue_length}
              </small>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <div className="bg-warning bg-opacity-10 rounded-circle p-3">
                  <i className="ri-shield-check-line text-warning fs-4"></i>
                </div>
              </div>
              <h3 className="mb-1 text-warning">{dashboardData?.analysis_stats?.success_rate}%</h3>
              <p className="text-muted mb-1">Success Rate</p>
              <small className="text-success">
                <i className="ri-check-line"></i> {dashboardData?.analysis_stats?.avg_quality_score} avg. quality
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions & Analysis Tools */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-gradient-primary text-white">
              <h5 className="mb-0">
                <i className="ri-tools-line me-2"></i>
                Genomic Analysis Toolkit
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col lg={3} md={6} className="mb-3">
                  <Card className="h-100 border-0 bg-light">
                    <Card.Body className="text-center">
                      <i className="ri-microscope-line text-primary fs-1 mb-3"></i>
                      <h6>Variant Analysis</h6>
                      <p className="text-muted small">SNV, InDel, CNV detection and annotation</p>
                      <Button variant="outline-primary" size="sm" className="w-100">
                        <i className="ri-play-line me-1"></i>Start Analysis
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>

                <Col lg={3} md={6} className="mb-3">
                  <Card className="h-100 border-0 bg-light">
                    <Card.Body className="text-center">
                      <i className="ri-pie-chart-line text-success fs-1 mb-3"></i>
                      <h6>Population Genetics</h6>
                      <p className="text-muted small">Ancestry, admixture, and population structure</p>
                      <Button variant="outline-success" size="sm" className="w-100">
                        <i className="ri-global-line me-1"></i>Analyze
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>

                <Col lg={3} md={6} className="mb-3">
                  <Card className="h-100 border-0 bg-light">
                    <Card.Body className="text-center">
                      <i className="ri-heart-pulse-line text-warning fs-1 mb-3"></i>
                      <h6>Pharmacogenomics</h6>
                      <p className="text-muted small">Drug response and metabolism analysis</p>
                      <Button variant="outline-warning" size="sm" className="w-100">
                        <i className="ri-medicine-bottle-line me-1"></i>PGx Report
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>

                <Col lg={3} md={6} className="mb-3">
                  <Card className="h-100 border-0 bg-light">
                    <Card.Body className="text-center">
                      <i className="ri-dna-line text-info fs-1 mb-3"></i>
                      <h6>Gene Expression</h6>
                      <p className="text-muted small">RNA-seq analysis and pathway enrichment</p>
                      <Button variant="outline-info" size="sm" className="w-100">
                        <i className="ri-bar-chart-box-line me-1"></i>Expression
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row className="mt-3">
                <Col lg={3} md={6} className="mb-3">
                  <Card className="h-100 border-0 bg-light">
                    <Card.Body className="text-center">
                      <i className="ri-flow-chart text-danger fs-1 mb-3"></i>
                      <h6>Structural Variants</h6>
                      <p className="text-muted small">Large rearrangements and copy number</p>
                      <Button variant="outline-danger" size="sm" className="w-100">
                        <i className="ri-git-repository-line me-1"></i>SV Analysis
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>

                <Col lg={3} md={6} className="mb-3">
                  <Card className="h-100 border-0 bg-light">
                    <Card.Body className="text-center">
                      <i className="ri-family-line text-purple fs-1 mb-3"></i>
                      <h6>Inheritance Analysis</h6>
                      <p className="text-muted small">Mendelian, complex trait inheritance</p>
                      <Button variant="outline-secondary" size="sm" className="w-100">
                        <i className="ri-parent-line me-1"></i>Family Tree
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>

                <Col lg={3} md={6} className="mb-3">
                  <Card className="h-100 border-0 bg-light">
                    <Card.Body className="text-center">
                      <i className="ri-shield-check-line text-primary fs-1 mb-3"></i>
                      <h6>Quality Metrics</h6>
                      <p className="text-muted small">Coverage, quality scores, contamination</p>
                      <Button variant="outline-primary" size="sm" className="w-100">
                        <i className="ri-check-double-line me-1"></i>QC Report
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>

                <Col lg={3} md={6} className="mb-3">
                  <Card className="h-100 border-0 bg-gradient-to-r from-purple-500 to-blue-600">
                    <Card.Body className="text-center text-white">
                      <div className="position-relative">
                        <i className="ri-robot-line fs-1 mb-3"></i>
                        <Badge bg="warning" className="position-absolute top-0 end-0 translate-middle">
                          AI
                        </Badge>
                      </div>
                      <h6 className="text-white">AI Genomics Lab</h6>
                      <p className="text-white-50 small">Advanced AI-powered genomic analysis using machine learning</p>
                      <Button as={Link} to="/dna-sequencing/ai-lab" variant="light" size="sm" className="w-100">
                        <i className="ri-brain-line me-1"></i>Launch AI Lab
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>

                <Col lg={3} md={6} className="mb-3">
                  <Card className="h-100 border-0 bg-light">
                    <Card.Body className="text-center">
                      <i className="ri-database-line text-success fs-1 mb-3"></i>
                      <h6>Database Annotation</h6>
                      <p className="text-muted small">ClinVar, gnomAD, COSMIC integration</p>
                      <Button variant="outline-success" size="sm" className="w-100">
                        <i className="ri-links-line me-1"></i>Annotate
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Pipeline Workflows */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header>
              <h5 className="mb-0">
                <i className="ri-cpu-line me-2"></i>
                Analysis Pipelines
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col lg={4} className="mb-3">
                  <div className="border rounded p-3 h-100">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                        <i className="ri-dna-line text-primary"></i>
                      </div>
                      <div>
                        <h6 className="mb-0">Whole Genome Sequencing</h6>
                        <small className="text-muted">Complete genomic analysis pipeline</small>
                      </div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Steps: FastQC → BWA → GATK → VEP</small>
                    </div>
                    <ProgressBar variant="success" now={85} className="mb-2" style={{height: '4px'}} />
                    <div className="d-flex justify-content-between">
                      <small className="text-success">Ready</small>
                      <Button variant="outline-primary" size="sm">Launch</Button>
                    </div>
                  </div>
                </Col>

                <Col lg={4} className="mb-3">
                  <div className="border rounded p-3 h-100">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-info bg-opacity-10 rounded-circle p-2 me-3">
                        <i className="ri-code-s-slash-line text-info"></i>
                      </div>
                      <div>
                        <h6 className="mb-0">Exome Sequencing</h6>
                        <small className="text-muted">Targeted exonic regions analysis</small>
                      </div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Steps: Trimming → Alignment → Variant Calling</small>
                    </div>
                    <ProgressBar variant="info" now={92} className="mb-2" style={{height: '4px'}} />
                    <div className="d-flex justify-content-between">
                      <small className="text-info">Ready</small>
                      <Button variant="outline-info" size="sm">Launch</Button>
                    </div>
                  </div>
                </Col>

                <Col lg={4} className="mb-3">
                  <div className="border rounded p-3 h-100">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-warning bg-opacity-10 rounded-circle p-2 me-3">
                        <i className="ri-bar-chart-box-line text-warning"></i>
                      </div>
                      <div>
                        <h6 className="mb-0">RNA Sequencing</h6>
                        <small className="text-muted">Transcriptome expression analysis</small>
                      </div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Steps: STAR → HTSeq → DESeq2</small>
                    </div>
                    <ProgressBar variant="warning" now={78} className="mb-2" style={{height: '4px'}} />
                    <div className="d-flex justify-content-between">
                      <small className="text-warning">Ready</small>
                      <Button variant="outline-warning" size="sm">Launch</Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Real-time Processing Status */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-gradient-success text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="ri-pulse-line me-2"></i>
                  Live Processing Status
                </h5>
                <Badge bg="light" text="dark" className="fs-6">
                  <i className="ri-radio-button-line text-success me-1"></i>Real-time
                </Badge>
              </div>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col lg={4} className="mb-3">
                  <div className="border rounded p-3 bg-light">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="text-primary mb-0">
                        <i className="ri-play-circle-line me-1"></i>Currently Processing
                      </h6>
                      <Badge bg="primary">{dashboardData?.samples?.filter(s => s.status === 'Processing').length}</Badge>
                    </div>
                    {dashboardData?.samples?.filter(s => s.status === 'Processing').slice(0, 3).map((sample, idx) => (
                      <div key={idx} className="mb-2 p-2 border rounded bg-white">
                        <div className="d-flex justify-content-between align-items-center">
                          <small><strong>{sample.id}</strong></small>
                          <small className="text-muted">{sample.sample_type}</small>
                        </div>
                        <ProgressBar 
                          variant="primary" 
                          now={Math.random() * 40 + 30} 
                          className="mt-1" 
                          style={{height: '4px'}} 
                        />
                        <small className="text-muted">
                          <i className="ri-timer-line me-1"></i>Est. {Math.floor(Math.random() * 4 + 2)}h remaining
                        </small>
                      </div>
                    ))}
                  </div>
                </Col>

                <Col lg={4} className="mb-3">
                  <div className="border rounded p-3 bg-light">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="text-warning mb-0">
                        <i className="ri-time-line me-1"></i>In Queue
                      </h6>
                      <Badge bg="warning">{dashboardData?.samples?.filter(s => s.status === 'Queued').length}</Badge>
                    </div>
                    {dashboardData?.samples?.filter(s => s.status === 'Queued').slice(0, 3).map((sample, idx) => (
                      <div key={idx} className="mb-2 p-2 border rounded bg-white">
                        <div className="d-flex justify-content-between align-items-center">
                          <small><strong>{sample.id}</strong></small>
                          <small className="text-muted">{sample.sample_type}</small>
                        </div>
                        <div className="mt-1">
                          <small className="text-warning">
                            <i className="ri-timer-2-line me-1"></i>Position #{idx + 1} in queue
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                </Col>

                <Col lg={4} className="mb-3">
                  <div className="border rounded p-3 bg-light">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="text-success mb-0">
                        <i className="ri-check-double-line me-1"></i>Recently Completed
                      </h6>
                      <Badge bg="success">{dashboardData?.samples?.filter(s => s.status === 'Completed').length}</Badge>
                    </div>
                    {dashboardData?.samples?.filter(s => s.status === 'Completed').slice(0, 3).map((sample, idx) => (
                      <div key={idx} className="mb-2 p-2 border rounded bg-white">
                        <div className="d-flex justify-content-between align-items-center">
                          <small><strong>{sample.id}</strong></small>
                          <Button variant="outline-success" size="sm" className="py-0 px-1">
                            <i className="ri-download-line"></i>
                          </Button>
                        </div>
                        <div className="mt-1">
                          <small className="text-success">
                            <i className="ri-check-line me-1"></i>Completed {sample.completion_time}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                </Col>
              </Row>

              <Row className="mt-3">
                <Col>
                  <div className="border rounded p-3 bg-gradient-primary text-white">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">System Performance</h6>
                        <small>Current throughput: {dashboardData?.analysis_stats?.monthly_throughput} samples/day</small>
                      </div>
                      <div className="text-end">
                        <div className="d-flex align-items-center">
                          <i className="ri-cpu-line me-2 fs-5"></i>
                          <span>CPU: 78%</span>
                        </div>
                        <div className="d-flex align-items-center mt-1">
                          <i className="ri-hard-drive-2-line me-2 fs-5"></i>
                          <span>Storage: 65%</span>
                        </div>
                      </div>
                    </div>
                    <ProgressBar variant="light" now={78} className="mt-2" style={{height: '6px'}} />
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* AI-Powered Medical Features */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-gradient-info text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="ri-robot-line me-2"></i>
                  AI-Powered Genomic Intelligence
                </h5>
                <Badge bg="warning" className="fs-6">
                  <i className="ri-star-line me-1"></i>Premium Features
                </Badge>
              </div>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col lg={6} className="mb-4">
                  <Card className="h-100 border-0 bg-gradient-primary text-white">
                    <Card.Body>
                      <div className="d-flex align-items-center mb-3">
                        <i className="ri-brain-line fs-2 me-3"></i>
                        <div>
                          <h5 className="mb-1">AI Variant Interpreter</h5>
                          <small>GPT-4 Powered Clinical Analysis</small>
                        </div>
                      </div>
                      <p className="mb-3">
                        Advanced AI model analyzes genetic variants with 98.7% accuracy, 
                        providing clinical significance predictions and treatment recommendations.
                      </p>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span>Analysis Confidence:</span>
                        <Badge bg="success">High (94%)</Badge>
                      </div>
                      <div className="d-flex gap-2">
                        <Button variant="light" size="sm" className="flex-fill">
                          <i className="ri-play-line me-1"></i>Run Analysis
                        </Button>
                        <Button variant="outline-light" size="sm">
                          <i className="ri-settings-line"></i>
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col lg={6} className="mb-4">
                  <Card className="h-100 border-0 bg-gradient-success text-white">
                    <Card.Body>
                      <div className="d-flex align-items-center mb-3">
                        <i className="ri-medicine-bottle-line fs-2 me-3"></i>
                        <div>
                          <h5 className="mb-1">Precision Medicine AI</h5>
                          <small>Personalized Treatment Generator</small>
                        </div>
                      </div>
                      <p className="mb-3">
                        Generate personalized treatment protocols based on genetic profile, 
                        drug interactions, and latest clinical guidelines using LLM technology.
                      </p>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span>Treatment Protocols:</span>
                        <Badge bg="warning">12 Generated</Badge>
                      </div>
                      <div className="d-flex gap-2">
                        <Button variant="light" size="sm" className="flex-fill">
                          <i className="ri-file-add-line me-1"></i>Generate Plan
                        </Button>
                        <Button variant="outline-light" size="sm">
                          <i className="ri-history-line"></i>
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col lg={4} className="mb-3">
                  <Card className="h-100 border-primary border-2">
                    <Card.Body className="text-center">
                      <i className="ri-chat-3-line text-primary fs-1 mb-3"></i>
                      <h6 className="text-primary">AI Clinical Assistant</h6>
                      <p className="text-muted small mb-3">
                        ChatGPT-powered genomic counselor providing real-time 
                        answers to complex genetic questions
                      </p>
                      <div className="mb-3">
                        <Badge bg="primary" className="me-1">24/7 Available</Badge>
                        <Badge bg="info">Multi-language</Badge>
                      </div>
                      <Button variant="primary" size="sm" className="w-100">
                        <i className="ri-chat-smile-line me-1"></i>Ask AI Assistant
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>

                <Col lg={4} className="mb-3">
                  <Card className="h-100 border-success border-2">
                    <Card.Body className="text-center">
                      <i className="ri-diagnostic-line text-success fs-1 mb-3"></i>
                      <h6 className="text-success">Disease Risk Predictor</h6>
                      <p className="text-muted small mb-3">
                        AI models predict disease susceptibility using polygenic 
                        risk scores and machine learning algorithms
                      </p>
                      <div className="mb-3">
                        <div className="d-flex justify-content-between small">
                          <span>Cancer Risk:</span>
                          <span className="text-warning">Moderate</span>
                        </div>
                        <div className="d-flex justify-content-between small">
                          <span>CVD Risk:</span>
                          <span className="text-success">Low</span>
                        </div>
                      </div>
                      <Button variant="success" size="sm" className="w-100">
                        <i className="ri-pulse-line me-1"></i>Calculate Risks
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>

                <Col lg={4} className="mb-3">
                  <Card className="h-100 border-warning border-2">
                    <Card.Body className="text-center">
                      <i className="ri-magic-line text-warning fs-1 mb-3"></i>
                      <h6 className="text-warning">Auto Report Generator</h6>
                      <p className="text-muted small mb-3">
                        Generate comprehensive clinical reports automatically 
                        using advanced NLP and medical knowledge bases
                      </p>
                      <div className="mb-3">
                        <div className="small text-muted">
                          <i className="ri-time-line me-1"></i>Avg. generation: 45 seconds
                        </div>
                        <div className="small text-muted">
                          <i className="ri-check-line me-1"></i>ACMG Guidelines compliant
                        </div>
                      </div>
                      <Button variant="warning" size="sm" className="w-100">
                        <i className="ri-file-text-line me-1"></i>Generate Report
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row className="mt-3">
                <Col>
                  <Card className="border-0 bg-light">
                    <Card.Body>
                      <h6 className="mb-3">
                        <i className="ri-flashlight-line me-2 text-info"></i>
                        Advanced AI Features Coming Soon
                      </h6>
                      <Row>
                        <Col lg={3} md={6} className="mb-2">
                          <div className="d-flex align-items-center">
                            <i className="ri-eye-line text-muted me-2"></i>
                            <small>AI Image Analysis for Karyotyping</small>
                          </div>
                        </Col>
                        <Col lg={3} md={6} className="mb-2">
                          <div className="d-flex align-items-center">
                            <i className="ri-voice-recognition-line text-muted me-2"></i>
                            <small>Voice-to-Text Clinical Notes</small>
                          </div>
                        </Col>
                        <Col lg={3} md={6} className="mb-2">
                          <div className="d-flex align-items-center">
                            <i className="ri-global-line text-muted me-2"></i>
                            <small>Multi-omics Data Integration</small>
                          </div>
                        </Col>
                        <Col lg={3} md={6} className="mb-2">
                          <div className="d-flex align-items-center">
                            <i className="ri-share-line text-muted me-2"></i>
                            <small>Real-time Collaboration AI</small>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Content Tabs */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white">
          <Tab.Container defaultActiveKey="samples">
            <Nav variant="tabs" className="border-0">
              <Nav.Item>
                <Nav.Link eventKey="samples">
                  <i className="ri-test-tube-line me-2"></i>Recent Samples
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="pipeline">
                  <i className="ri-cpu-line me-2"></i>Pipeline Status
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="technologies">
                  <i className="ri-settings-line me-2"></i>Sequencing Tech
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="variants">
                  <i className="ri-bar-chart-line me-2"></i>Variant Stats
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="clinical">
                  <i className="ri-medicine-bottle-line me-2"></i>Clinical Insights
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="annotation">
                  <i className="ri-database-line me-2"></i>Annotation
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="pharmacogenomics">
                  <i className="ri-medicine-bottle-line me-2"></i>PGx Analysis
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="reports">
                  <i className="ri-file-chart-line me-2"></i>Clinical Reports
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="ai-reports">
                  <i className="ri-brain-line me-2"></i>AI Genomic Reports
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="samples">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0">Recent Sequencing Samples</h5>
                    <Button variant="outline-primary" size="sm">
                      <i className="ri-refresh-line me-1"></i>Refresh
                    </Button>
                  </div>

                  <div className="table-responsive">
                    <Table hover>
                      <thead className="table-light">
                        <tr>
                          <th>Sample ID</th>
                          <th>Patient</th>
                          <th>Type</th>
                          <th>Status</th>
                          <th>Quality</th>
                          <th>Coverage</th>
                          <th>Sequencer</th>
                          <th>Analysis</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData?.recent_samples?.map((sample, index) => (
                          <tr key={index}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="bg-primary bg-opacity-10 rounded p-2 me-2">
                                  <i className="ri-test-tube-line text-primary"></i>
                                </div>
                                <div>
                                  <strong>{sample.sample_id}</strong>
                                  <br />
                                  <small className="text-muted">
                                    {new Date(sample.created_at).toLocaleDateString()}
                                  </small>
                                </div>
                              </div>
                            </td>
                            <td>{sample.patient_name}</td>
                            <td>
                              <Badge bg="light" text="dark">{sample.sample_type}</Badge>
                            </td>
                            <td>
                              <Badge bg={getStatusBadgeVariant(sample.status)}>
                                {sample.status.charAt(0).toUpperCase() + sample.status.slice(1)}
                              </Badge>
                            </td>
                            <td>
                              {sample.quality_score ? (
                                <Badge bg={getQualityBadgeVariant(sample.quality_score)}>
                                  {sample.quality_score}%
                                </Badge>
                              ) : (
                                <Badge bg="secondary">Pending</Badge>
                              )}
                            </td>
                            <td>{sample.coverage}</td>
                            <td>
                              <small className="text-muted">{sample.sequencer}</small>
                            </td>
                            <td>
                              <small className="text-info">{sample.analysis_type}</small>
                            </td>
                            <td>
                              <Button 
                                variant="outline-primary" 
                                size="sm" 
                                className="me-1"
                                onClick={() => {
                                  setSelectedSample(sample);
                                  setShowSampleModal(true);
                                }}
                              >
                                <i className="ri-eye-line"></i>
                              </Button>
                              <Button variant="outline-info" size="sm">
                                <i className="ri-download-line"></i>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Tab.Pane>

              <Tab.Pane eventKey="pipeline">
                <Card.Body>
                  <h5 className="mb-4">Analysis Pipeline Status</h5>
                  
                  <Row>
                    <Col md={6}>
                      <Card className="border-0 bg-light mb-4">
                        <Card.Body>
                          <h6 className="mb-3">Job Queue Status</h6>
                          <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <small>Active Jobs</small>
                              <span className="text-success fw-bold">{dashboardData?.analysis_pipeline_stats?.active_jobs}</span>
                            </div>
                            <ProgressBar 
                              variant="success" 
                              now={dashboardData?.analysis_pipeline_stats?.active_jobs} 
                              max={100}
                              style={{ height: '6px' }}
                            />
                          </div>
                          
                          <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <small>Queued Jobs</small>
                              <span className="text-warning fw-bold">{dashboardData?.analysis_pipeline_stats?.queued_jobs}</span>
                            </div>
                            <ProgressBar 
                              variant="warning" 
                              now={dashboardData?.analysis_pipeline_stats?.queued_jobs} 
                              max={50}
                              style={{ height: '6px' }}
                            />
                          </div>

                          <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <small>Failed Jobs</small>
                              <span className="text-danger fw-bold">{dashboardData?.analysis_pipeline_stats?.failed_jobs}</span>
                            </div>
                            <ProgressBar 
                              variant="danger" 
                              now={dashboardData?.analysis_pipeline_stats?.failed_jobs} 
                              max={10}
                              style={{ height: '6px' }}
                            />
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col md={6}>
                      <Card className="border-0 bg-light">
                        <Card.Body>
                          <h6 className="mb-3">Pipeline Performance</h6>
                          <div className="text-center mb-3">
                            <h3 className="text-primary">{dashboardData?.analysis_pipeline_stats?.completed_today}</h3>
                            <p className="text-muted mb-0">Analyses Completed Today</p>
                          </div>
                          
                          <div className="row text-center">
                            <div className="col-4">
                              <div className="border-end">
                                <h6 className="text-success">98.2%</h6>
                                <small className="text-muted">Success Rate</small>
                              </div>
                            </div>
                            <div className="col-4">
                              <div className="border-end">
                                <h6 className="text-info">2.3h</h6>
                                <small className="text-muted">Avg Runtime</small>
                              </div>
                            </div>
                            <div className="col-4">
                              <h6 className="text-warning">24/7</h6>
                              <small className="text-muted">Uptime</small>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Tab.Pane>

              <Tab.Pane eventKey="technologies">
                <Card.Body>
                  <h5 className="mb-4">Sequencing Technologies Usage</h5>
                  
                  <Row>
                    {dashboardData?.sequencing_technologies?.map((tech, index) => (
                      <Col lg={4} md={6} key={index} className="mb-3">
                        <Card className="border-0 bg-light h-100">
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <h6 className="mb-0">{tech.name}</h6>
                              <Badge bg="primary">{tech.percentage}%</Badge>
                            </div>
                            <div className="mb-2">
                              <small className="text-muted">{tech.samples} samples</small>
                            </div>
                            <ProgressBar 
                              variant="primary" 
                              now={tech.percentage} 
                              style={{ height: '8px' }}
                            />
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Tab.Pane>

              <Tab.Pane eventKey="variants">
                <Card.Body>
                  <h5 className="mb-4">Variant Detection Statistics</h5>
                  
                  <Row>
                    <Col lg={3} md={6} className="mb-3">
                      <Card className="border-0 bg-light text-center">
                        <Card.Body>
                          <i className="ri-dna-line text-primary fs-1 mb-2"></i>
                          <h4 className="text-primary">{dashboardData?.variant_calling_stats?.snvs_detected?.toLocaleString()}</h4>
                          <p className="text-muted mb-0">SNVs Detected</p>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col lg={3} md={6} className="mb-3">
                      <Card className="border-0 bg-light text-center">
                        <Card.Body>
                          <i className="ri-git-branch-line text-info fs-1 mb-2"></i>
                          <h4 className="text-info">{dashboardData?.variant_calling_stats?.indels_detected?.toLocaleString()}</h4>
                          <p className="text-muted mb-0">InDels</p>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col lg={3} md={6} className="mb-3">
                      <Card className="border-0 bg-light text-center">
                        <Card.Body>
                          <i className="ri-bar-chart-line text-warning fs-1 mb-2"></i>
                          <h4 className="text-warning">{dashboardData?.variant_calling_stats?.cnvs_detected?.toLocaleString()}</h4>
                          <p className="text-muted mb-0">CNVs</p>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col lg={3} md={6} className="mb-3">
                      <Card className="border-0 bg-light text-center">
                        <Card.Body>
                          <i className="ri-shuffle-line text-success fs-1 mb-2"></i>
                          <h4 className="text-success">{dashboardData?.variant_calling_stats?.svs_detected?.toLocaleString()}</h4>
                          <p className="text-muted mb-0">Structural Variants</p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Tab.Pane>

              <Tab.Pane eventKey="annotation">
                <Card.Body>
                  <h5 className="mb-4">Genomic Annotation & Database Integration</h5>
                  
                  <Row>
                    <Col lg={6}>
                      <Card className="border-0 bg-light mb-3">
                        <Card.Body>
                          <h6 className="mb-3">
                            <i className="ri-links-line me-2"></i>External Database Status
                          </h6>
                          <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <div className="d-flex align-items-center">
                                <Badge bg="success" className="me-2">●</Badge>
                                <span>ClinVar</span>
                              </div>
                              <small className="text-muted">Updated: 2025-08-01</small>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <div className="d-flex align-items-center">
                                <Badge bg="success" className="me-2">●</Badge>
                                <span>gnomAD v4.0</span>
                              </div>
                              <small className="text-muted">Updated: 2025-07-15</small>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <div className="d-flex align-items-center">
                                <Badge bg="warning" className="me-2">●</Badge>
                                <span>COSMIC v99</span>
                              </div>
                              <small className="text-muted">Updating...</small>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <div className="d-flex align-items-center">
                                <Badge bg="success" className="me-2">●</Badge>
                                <span>dbSNP b155</span>
                              </div>
                              <small className="text-muted">Updated: 2025-07-28</small>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col lg={6}>
                      <Card className="border-0 bg-light mb-3">
                        <Card.Body>
                          <h6 className="mb-3">
                            <i className="ri-bookmark-line me-2"></i>Annotation Statistics
                          </h6>
                          <Row>
                            <Col sm={6} className="mb-2">
                              <div className="text-center">
                                <h4 className="text-primary">98.7%</h4>
                                <small className="text-muted">Variants Annotated</small>
                              </div>
                            </Col>
                            <Col sm={6} className="mb-2">
                              <div className="text-center">
                                <h4 className="text-success">2,456</h4>
                                <small className="text-muted">Clinical Variants</small>
                              </div>
                            </Col>
                            <Col sm={6} className="mb-2">
                              <div className="text-center">
                                <h4 className="text-warning">156</h4>
                                <small className="text-muted">Pathogenic</small>
                              </div>
                            </Col>
                            <Col sm={6} className="mb-2">
                              <div className="text-center">
                                <h4 className="text-info">789</h4>
                                <small className="text-muted">Drug Associated</small>
                              </div>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <Card className="border-0 bg-light">
                        <Card.Body>
                          <h6 className="mb-3">Recent Annotation Results</h6>
                          <Table responsive hover size="sm">
                            <thead className="table-light">
                              <tr>
                                <th>Variant</th>
                                <th>Gene</th>
                                <th>Clinical Significance</th>
                                <th>Population Frequency</th>
                                <th>Database</th>
                                <th>ACMG Classification</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td><code>chr17:43094175:C{'>'}T</code></td>
                                <td><strong>BRCA1</strong></td>
                                <td><Badge bg="danger">Pathogenic</Badge></td>
                                <td>0.0001%</td>
                                <td>ClinVar</td>
                                <td><Badge bg="danger">Class 5</Badge></td>
                              </tr>
                              <tr>
                                <td><code>chr7:140753336:A{'>'}T</code></td>
                                <td><strong>BRAF</strong></td>
                                <td><Badge bg="warning">Uncertain Significance</Badge></td>
                                <td>0.15%</td>
                                <td>COSMIC</td>
                                <td><Badge bg="warning">Class 3</Badge></td>
                              </tr>
                              <tr>
                                <td><code>chr12:25245350:C{'>'}G</code></td>
                                <td><strong>KRAS</strong></td>
                                <td><Badge bg="info">Likely Benign</Badge></td>
                                <td>2.3%</td>
                                <td>gnomAD</td>
                                <td><Badge bg="info">Class 2</Badge></td>
                              </tr>
                            </tbody>
                          </Table>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Tab.Pane>

              <Tab.Pane eventKey="pharmacogenomics">
                <Card.Body>
                  <h5 className="mb-4">Pharmacogenomics Analysis</h5>
                  
                  <Row>
                    <Col lg={4}>
                      <Card className="border-0 bg-light h-100">
                        <Card.Body>
                          <h6 className="mb-3">
                            <i className="ri-medicine-bottle-line me-2"></i>Drug Response Genes
                          </h6>
                          <div className="mb-3">
                            <div className="d-flex justify-content-between mb-2">
                              <span>CYP2D6</span>
                              <Badge bg="success">Normal Metabolizer</Badge>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>CYP2C19</span>
                              <Badge bg="warning">Poor Metabolizer</Badge>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>TPMT</span>
                              <Badge bg="success">Normal Activity</Badge>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>DPYD</span>
                              <Badge bg="danger">Reduced Activity</Badge>
                            </div>
                          </div>
                          <Button variant="outline-primary" size="sm" className="w-100">
                            <i className="ri-file-chart-line me-1"></i>Generate PGx Report
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col lg={8}>
                      <Card className="border-0 bg-light h-100">
                        <Card.Body>
                          <h6 className="mb-3">
                            <i className="ri-alert-line me-2"></i>Drug Interaction Alerts
                          </h6>
                          <Alert variant="warning" className="mb-2">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <strong>Warfarin Sensitivity</strong>
                                <p className="mb-0 small">CYP2C9 variant detected - reduce initial dose by 50%</p>
                              </div>
                              <Badge bg="warning">High Priority</Badge>
                            </div>
                          </Alert>
                          <Alert variant="info" className="mb-2">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <strong>Clopidogrel Response</strong>
                                <p className="mb-0 small">CYP2C19 poor metabolizer - consider alternative therapy</p>
                              </div>
                              <Badge bg="info">Medium Priority</Badge>
                            </div>
                          </Alert>
                          <Alert variant="danger" className="mb-2">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <strong>5-Fluorouracil Toxicity Risk</strong>
                                <p className="mb-0 small">DPYD variant - contraindicated</p>
                              </div>
                              <Badge bg="danger">Critical</Badge>
                            </div>
                          </Alert>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Tab.Pane>

              <Tab.Pane eventKey="clinical">
                <Card.Body>
                  <h5 className="mb-4">
                    <i className="ri-medicine-bottle-line me-2"></i>Clinical Insights & AI Analysis
                  </h5>
                  
                  <Row className="mb-4">
                    <Col lg={8}>
                      <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-gradient-info text-white">
                          <h6 className="mb-0">
                            <i className="ri-brain-line me-2"></i>AI-Powered Clinical Interpretation
                          </h6>
                        </Card.Header>
                        <Card.Body>
                          <div className="mb-4">
                            <div className="d-flex align-items-center mb-3">
                              <Badge bg="success" className="me-2">High Confidence</Badge>
                              <h6 className="mb-0">Primary Findings</h6>
                            </div>
                            <div className="border-start border-success border-3 ps-3">
                              <p className="mb-2">
                                <strong>BRCA1 Pathogenic Variant (c.5266dupC)</strong> - High penetrance variant 
                                associated with hereditary breast and ovarian cancer syndrome. 
                                Lifetime risk: 65-85% breast cancer, 39-46% ovarian cancer.
                              </p>
                              <div className="d-flex gap-2 mb-3">
                                <Badge bg="danger">Pathogenic</Badge>
                                <Badge bg="info">Actionable</Badge>
                                <Badge bg="warning">Hereditary</Badge>
                              </div>
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="d-flex align-items-center mb-3">
                              <Badge bg="warning" className="me-2">Moderate Confidence</Badge>
                              <h6 className="mb-0">Secondary Findings</h6>
                            </div>
                            <div className="border-start border-warning border-3 ps-3">
                              <p className="mb-2">
                                <strong>CYP2C19 Poor Metabolizer</strong> - Reduced enzyme activity affecting 
                                clopidogrel, omeprazole, and other drug metabolism. Consider alternative 
                                medications or dosage adjustments.
                              </p>
                              <div className="d-flex gap-2 mb-3">
                                <Badge bg="info">Pharmacogenomic</Badge>
                                <Badge bg="secondary">Drug Response</Badge>
                              </div>
                            </div>
                          </div>

                          <div className="mb-3">
                            <h6 className="mb-3">
                              <i className="ri-stethoscope-line me-2"></i>Clinical Recommendations
                            </h6>
                            <div className="list-group list-group-flush">
                              <div className="list-group-item border-0 ps-0">
                                <div className="d-flex">
                                  <i className="ri-check-double-line text-success me-3 mt-1"></i>
                                  <div>
                                    <strong>Genetic Counseling</strong>
                                    <p className="mb-0 text-muted">Refer to genetic counselor for family risk assessment and cascade testing</p>
                                  </div>
                                </div>
                              </div>
                              <div className="list-group-item border-0 ps-0">
                                <div className="d-flex">
                                  <i className="ri-calendar-check-line text-info me-3 mt-1"></i>
                                  <div>
                                    <strong>Enhanced Screening</strong>
                                    <p className="mb-0 text-muted">Initiate breast MRI screening at age 30, annual mammography at 40</p>
                                  </div>
                                </div>
                              </div>
                              <div className="list-group-item border-0 ps-0">
                                <div className="d-flex">
                                  <i className="ri-medicine-bottle-line text-warning me-3 mt-1"></i>
                                  <div>
                                    <strong>Medication Review</strong>
                                    <p className="mb-0 text-muted">Avoid clopidogrel, consider prasugrel or ticagrelor alternatives</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col lg={4}>
                      <Card className="border-0 bg-light h-100">
                        <Card.Body>
                          <h6 className="mb-3">
                            <i className="ri-heart-pulse-line me-2"></i>Risk Assessment
                          </h6>
                          
                          <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span>Cancer Risk</span>
                              <Badge bg="danger">High</Badge>
                            </div>
                            <ProgressBar variant="danger" now={85} className="mb-2" style={{height: '8px'}} />
                            <small className="text-muted">Lifetime: 65-85%</small>
                          </div>

                          <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span>Drug Response</span>
                              <Badge bg="warning">Altered</Badge>
                            </div>
                            <ProgressBar variant="warning" now={60} className="mb-2" style={{height: '8px'}} />
                            <small className="text-muted">Multiple medications affected</small>
                          </div>

                          <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span>Family Risk</span>
                              <Badge bg="info">Moderate</Badge>
                            </div>
                            <ProgressBar variant="info" now={50} className="mb-2" style={{height: '8px'}} />
                            <small className="text-muted">50% transmission risk</small>
                          </div>

                          <hr />

                          <h6 className="mb-3">
                            <i className="ri-links-line me-2"></i>Relevant Guidelines
                          </h6>
                          <div className="list-group list-group-flush">
                            <div className="list-group-item border-0 ps-0 py-2">
                              <small>
                                <strong>NCCN Guidelines</strong><br />
                                <span className="text-muted">Hereditary Breast/Ovarian Cancer v3.2024</span>
                              </small>
                            </div>
                            <div className="list-group-item border-0 ps-0 py-2">
                              <small>
                                <strong>ACMG Standards</strong><br />
                                <span className="text-muted">Variant Interpretation Guidelines</span>
                              </small>
                            </div>
                            <div className="list-group-item border-0 ps-0 py-2">
                              <small>
                                <strong>CPIC Guidelines</strong><br />
                                <span className="text-muted">CYP2C19 Genotype Implementation</span>
                              </small>
                            </div>
                          </div>

                          <Button variant="outline-primary" size="sm" className="w-100 mt-3">
                            <i className="ri-file-download-line me-1"></i>Export Clinical Summary
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  <Row className="mt-4">
                    <Col>
                      <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-gradient-secondary text-white">
                          <h6 className="mb-0">
                            <i className="ri-team-line me-2"></i>Multidisciplinary Team Consultation
                          </h6>
                        </Card.Header>
                        <Card.Body>
                          <Row>
                            <Col lg={3} className="mb-3">
                              <div className="text-center p-3 border rounded">
                                <i className="ri-user-heart-line text-primary fs-2 mb-2"></i>
                                <h6>Oncologist</h6>
                                <Badge bg="success">Consulted</Badge>
                                <p className="small text-muted mt-2">Risk-reducing surgery discussed</p>
                              </div>
                            </Col>
                            <Col lg={3} className="mb-3">
                              <div className="text-center p-3 border rounded">
                                <i className="ri-user-3-line text-info fs-2 mb-2"></i>
                                <h6>Genetic Counselor</h6>
                                <Badge bg="warning">Pending</Badge>
                                <p className="small text-muted mt-2">Family history review needed</p>
                              </div>
                            </Col>
                            <Col lg={3} className="mb-3">
                              <div className="text-center p-3 border rounded">
                                <i className="ri-capsule-line text-success fs-2 mb-2"></i>
                                <h6>Clinical Pharmacist</h6>
                                <Badge bg="info">Reviewed</Badge>
                                <p className="small text-muted mt-2">Medication adjustments provided</p>
                              </div>
                            </Col>
                            <Col lg={3} className="mb-3">
                              <div className="text-center p-3 border rounded">
                                <i className="ri-heart-pulse-line text-danger fs-2 mb-2"></i>
                                <h6>Cardiologist</h6>
                                <Badge bg="light" text="dark">N/A</Badge>
                                <p className="small text-muted mt-2">No cardiac implications</p>
                              </div>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Tab.Pane>

              <Tab.Pane eventKey="reports">
                <Card.Body>
                  <h5 className="mb-4">Clinical Reports & Documentation</h5>
                  
                  <Row>
                    <Col lg={6}>
                      <Card className="border-0 bg-light mb-3">
                        <Card.Body>
                          <h6 className="mb-3">
                            <i className="ri-file-chart-line me-2"></i>Available Reports
                          </h6>
                          <div className="list-group list-group-flush">
                            <div className="list-group-item d-flex justify-content-between align-items-center">
                              <div>
                                <strong>Comprehensive Genomic Report</strong>
                                <br />
                                <small className="text-muted">Complete variant analysis and clinical interpretation</small>
                              </div>
                              <Button variant="outline-primary" size="sm">
                                <i className="ri-download-line"></i>
                              </Button>
                            </div>
                            <div className="list-group-item d-flex justify-content-between align-items-center">
                              <div>
                                <strong>Pharmacogenomics Report</strong>
                                <br />
                                <small className="text-muted">Drug response and metabolism analysis</small>
                              </div>
                              <Button variant="outline-success" size="sm">
                                <i className="ri-download-line"></i>
                              </Button>
                            </div>
                            <div className="list-group-item d-flex justify-content-between align-items-center">
                              <div>
                                <strong>Carrier Screening Report</strong>
                                <br />
                                <small className="text-muted">Autosomal recessive condition screening</small>
                              </div>
                              <Button variant="outline-info" size="sm">
                                <i className="ri-download-line"></i>
                              </Button>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col lg={6}>
                      <Card className="border-0 bg-light mb-3">
                        <Card.Body>
                          <h6 className="mb-3">
                            <i className="ri-shield-check-line me-2"></i>Quality Assurance
                          </h6>
                          <div className="mb-3">
                            <div className="d-flex justify-content-between mb-2">
                              <span>Sequencing Quality</span>
                              <Badge bg="success">Q30: 95.8%</Badge>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Coverage Uniformity</span>
                              <Badge bg="success">CV: 0.15</Badge>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Variant Calling</span>
                              <Badge bg="success">Ti/Tv: 2.07</Badge>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Contamination</span>
                              <Badge bg="success">&lt; 0.1%</Badge>
                            </div>
                          </div>
                          <Button variant="outline-warning" size="sm" className="w-100">
                            <i className="ri-file-check-line me-1"></i>QC Detailed Report
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <Card className="border-0 bg-light">
                        <Card.Body>
                          <h6 className="mb-3">Report Generation Status</h6>
                          <Table responsive>
                            <thead className="table-light">
                              <tr>
                                <th>Report Type</th>
                                <th>Sample ID</th>
                                <th>Status</th>
                                <th>Generated</th>
                                <th>Reviewed By</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>Oncology Panel</td>
                                <td>DNA-2025-0801</td>
                                <td><Badge bg="success">Completed</Badge></td>
                                <td>2025-08-06 09:15</td>
                                <td>Dr. Sarah Johnson</td>
                                <td>
                                  <Button variant="outline-primary" size="sm" className="me-1">
                                    <i className="ri-eye-line"></i>
                                  </Button>
                                  <Button variant="outline-success" size="sm">
                                    <i className="ri-download-line"></i>
                                  </Button>
                                </td>
                              </tr>
                              <tr>
                                <td>Exome Report</td>
                                <td>DNA-2025-0802</td>
                                <td><Badge bg="warning">In Review</Badge></td>
                                <td>2025-08-06 08:30</td>
                                <td>Dr. Michael Chen</td>
                                <td>
                                  <Button variant="outline-warning" size="sm">
                                    <i className="ri-time-line"></i>
                                  </Button>
                                </td>
                              </tr>
                              <tr>
                                <td>PGx Analysis</td>
                                <td>DNA-2025-0803</td>
                                <td><Badge bg="info">Generating</Badge></td>
                                <td>-</td>
                                <td>-</td>
                                <td>
                                  <div className="spinner-border spinner-border-sm text-info" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Tab.Pane>

              <Tab.Pane eventKey="ai-reports">
                <AIGenomicReports />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Card.Header>
      </Card>

      {/* Sample Details Modal */}
      <Modal show={showSampleModal} onHide={() => setShowSampleModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-test-tube-line me-2"></i>
            Sample Details: {selectedSample?.sample_id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSample && (
            <div>
              <Row>
                <Col md={6}>
                  <h6>Sample Information</h6>
                  <p><strong>Patient:</strong> {selectedSample.patient_name}</p>
                  <p><strong>Type:</strong> {selectedSample.sample_type}</p>
                  <p><strong>Status:</strong> 
                    <Badge bg={getStatusBadgeVariant(selectedSample.status)} className="ms-2">
                      {selectedSample.status}
                    </Badge>
                  </p>
                  <p><strong>Analysis:</strong> {selectedSample.analysis_type}</p>
                </Col>
                <Col md={6}>
                  <h6>Technical Details</h6>
                  <p><strong>Sequencer:</strong> {selectedSample.sequencer}</p>
                  <p><strong>Coverage:</strong> {selectedSample.coverage}</p>
                  {selectedSample.quality_score && (
                    <p><strong>Quality Score:</strong> 
                      <Badge bg={getQualityBadgeVariant(selectedSample.quality_score)} className="ms-2">
                        {selectedSample.quality_score}%
                      </Badge>
                    </p>
                  )}
                  <p><strong>Created:</strong> {new Date(selectedSample.created_at).toLocaleString()}</p>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowSampleModal(false)}>
            Close
          </Button>
          <Button variant="primary">
            <i className="ri-download-line me-1"></i>Download Results
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Upload Sample Modal */}
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-upload-line me-2"></i>
            Upload New Sample
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!backendOnline && (
            <Alert variant="info" className="mb-3">
              <i className="ri-info-line me-2"></i>
              Demo Mode: Sample will be added locally for this session only.
            </Alert>
          )}
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Sample ID *</Form.Label>
                  <Form.Control type="text" placeholder="Enter sample ID" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Patient Name *</Form.Label>
                  <Form.Control type="text" placeholder="Enter patient name" />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Sample Type *</Form.Label>
                  <Form.Select>
                    <option value="">Select sample type</option>
                    <option value="whole-genome">Whole Genome Sequencing</option>
                    <option value="exome">Whole Exome Sequencing</option>
                    <option value="targeted">Targeted Panel</option>
                    <option value="rna-seq">RNA Sequencing</option>
                    <option value="long-read">Long Read Sequencing</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Analysis Type *</Form.Label>
                  <Form.Select>
                    <option value="">Select analysis type</option>
                    <option value="cancer">Cancer Genomics</option>
                    <option value="rare-disease">Rare Disease</option>
                    <option value="pharmacogenomics">Pharmacogenomics</option>
                    <option value="expression">Expression Profiling</option>
                    <option value="structural">Structural Variants</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Sample Files</Form.Label>
              <Form.Control type="file" multiple accept=".fastq,.fq,.fastq.gz,.fq.gz" />
              <Form.Text className="text-muted">
                Select FASTQ files for sequencing analysis
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowUploadModal(false)}>
            Cancel
          </Button>
          <Button variant="primary">
            <i className="ri-upload-line me-1"></i>Upload Sample
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Analysis Modals */}
      <WholeGenomeAnalysisModal
        show={showWholeGenomeModal}
        onHide={() => setShowWholeGenomeModal(false)}
        onStartAnalysis={handleStartAnalysis}
      />

      <ExomeSequencingModal
        show={showExomeModal}
        onHide={() => setShowExomeModal(false)}
        onStartAnalysis={handleStartAnalysis}
      />

      <PharmacogenomicsModal
        show={showPharmacogenomicsModal}
        onHide={() => setShowPharmacogenomicsModal(false)}
        onStartAnalysis={handleStartAnalysis}
      />

      <style jsx>{`
        .bg-gradient-primary {
          background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
        }
        .text-purple {
          color: #6f42c1 !important;
        }
        .border-primary {
          border-color: #007bff !important;
        }
        .analysis-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
          transition: all 0.3s ease;
        }
        .pipeline-card {
          transition: all 0.3s ease;
        }
        .pipeline-card:hover {
          transform: scale(1.02);
        }
        .tab-content {
          background: transparent;
        }
        .nav-tabs .nav-link {
          border-radius: 0.5rem 0.5rem 0 0;
          margin-right: 0.25rem;
        }
        .nav-tabs .nav-link.active {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-color: #dee2e6 #dee2e6 #f8f9fa;
        }
      `}</style>
    </Container>
  );
};

// Wrap the component with protection using soft-coded permissions
const ProtectedDNASequencingDashboard = () => {
  return (
    <ProtectedRoute 
      permission="canAccessDnaSequencingModule" 
      moduleName="DNA Sequencing Module"
    >
      <DNASequencingDashboard />
    </ProtectedRoute>
  );
};

export default ProtectedDNASequencingDashboard;
