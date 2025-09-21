import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table, Alert, ProgressBar, Modal, Form, Tab, Nav, Spinner, Dropdown } from 'react-bootstrap';
import apiClient from '../../services/api';

// Soft-coded download configuration
const DOWNLOAD_CONFIG = {
  formats: {
    pdf: {
      label: 'PDF Report',
      icon: 'ri-file-pdf-line',
      description: 'Comprehensive analysis report',
      mimeType: 'application/pdf',
      extension: 'pdf'
    },
    excel: {
      label: 'Excel Workbook',
      icon: 'ri-file-excel-line',
      description: 'Variant data with multiple sheets',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      extension: 'xlsx'
    },
    csv: {
      label: 'CSV Data',
      icon: 'ri-file-text-line',
      description: 'Variant data in CSV format',
      mimeType: 'text/csv',
      extension: 'csv'
    },
    vcf: {
      label: 'VCF File',
      icon: 'ri-file-code-line',
      description: 'Standard variant call format',
      mimeType: 'text/plain',
      extension: 'vcf'
    },
    json: {
      label: 'JSON Data',
      icon: 'ri-braces-line',
      description: 'Complete analysis data',
      mimeType: 'application/json',
      extension: 'json'
    }
  },
  sections: {
    complete: {
      label: 'Complete Report',
      description: 'All analysis data and results',
      includes: ['sample_info', 'variants', 'structural_variants', 'quality_metrics', 'annotations']
    },
    variants_only: {
      label: 'Variants Only',
      description: 'Variant data without quality metrics',
      includes: ['variants', 'annotations']
    },
    summary: {
      label: 'Summary Report',
      description: 'Key findings and statistics',
      includes: ['sample_info', 'summary_stats']
    },
    quality: {
      label: 'Quality Report',
      description: 'QC metrics and sample information',
      includes: ['sample_info', 'quality_metrics']
    }
  },
  endpoints: {
    pdf: '/dna-sequencing/api/export/pdf',
    excel: '/dna-sequencing/api/export/excel',
    csv: '/dna-sequencing/api/export/csv',
    vcf: '/dna-sequencing/api/export/vcf',
    json: '/dna-sequencing/api/export/json'
  }
};

const GenomeAnalysis = () => {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendOnline, setBackendOnline] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState('variants');
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState('pdf');
  const [downloadSection, setDownloadSection] = useState('complete');

  useEffect(() => {
    fetchAnalysisData();
  }, []);

  const fetchAnalysisData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/dna-sequencing/api/analysis/');
      setAnalysisData(response.data);
      setBackendOnline(true);
    } catch (error) {
      console.error('Failed to fetch genome analysis data:', error);
      console.log('Loading demo data for genome analysis...');
      
      // Use demo data when backend is unavailable
      setAnalysisData(getDemoAnalysisData());
      setBackendOnline(false);
    } finally {
      setLoading(false);
    }
  };

  const getDemoAnalysisData = () => {
    return {
      sample_info: {
        sample_id: 'DNA-2025-0801',
        patient_name: 'John Doe',
        sequencing_type: 'Whole Genome Sequencing',
        coverage: '30x',
        quality_score: 96.2,
        total_reads: '2.8B',
        mapped_reads: '2.7B',
        mapping_rate: 96.4
      },
      variant_summary: {
        total_variants: 4892367,
        snvs: 4657123,
        indels: 235244,
        high_impact: 23,
        moderate_impact: 8456,
        low_impact: 245678,
        pathogenic: 12,
        likely_pathogenic: 34,
        vus: 156,
        benign: 3456789
      },
      top_variants: [
        {
          id: 1,
          chromosome: 'chr17',
          position: 43094124,
          ref: 'G',
          alt: 'A',
          gene: 'BRCA1',
          variant_type: 'SNV',
          impact: 'HIGH',
          consequence: 'missense_variant',
          clinical_significance: 'Pathogenic',
          allele_frequency: 0.0001,
          coverage: 45,
          quality: 98.5,
          genotype: 'het',
          dbsnp_id: 'rs80357382',
          cosmic_id: 'COSM5739'
        },
        {
          id: 2,
          chromosome: 'chr13',
          position: 32936732,
          ref: 'T',
          alt: 'C',
          gene: 'BRCA2',
          variant_type: 'SNV',
          impact: 'MODERATE',
          consequence: 'missense_variant',
          clinical_significance: 'Likely Pathogenic',
          allele_frequency: 0.0003,
          coverage: 52,
          quality: 97.2,
          genotype: 'het',
          dbsnp_id: 'rs28897696',
          cosmic_id: 'COSM5746'
        },
        {
          id: 3,
          chromosome: 'chr7',
          position: 140753336,
          ref: 'A',
          alt: 'T',
          gene: 'BRAF',
          variant_type: 'SNV',
          impact: 'HIGH',
          consequence: 'missense_variant',
          clinical_significance: 'Pathogenic',
          allele_frequency: 0.02,
          coverage: 67,
          quality: 99.1,
          genotype: 'het',
          dbsnp_id: 'rs113488022',
          cosmic_id: 'COSM476'
        }
      ],
      pharmacogenomics: [
        {
          gene: 'CYP2D6',
          genotype: '*1/*2',
          phenotype: 'Normal Metabolizer',
          drug_interactions: ['Codeine', 'Tramadol', 'Metoprolol'],
          recommendations: 'Standard dosing for most CYP2D6 substrates',
          evidence_level: 'Strong'
        },
        {
          gene: 'TPMT',
          genotype: '*1/*1',
          phenotype: 'Normal Metabolizer',
          drug_interactions: ['6-Mercaptopurine', 'Azathioprine'],
          recommendations: 'Standard dosing',
          evidence_level: 'Strong'
        },
        {
          gene: 'DPYD',
          genotype: '*1/*2A',
          phenotype: 'Intermediate Metabolizer',
          drug_interactions: ['5-Fluorouracil', 'Capecitabine'],
          recommendations: 'Reduce dose by 50% and monitor closely',
          evidence_level: 'Strong'
        }
      ],
      structural_variants: [
        {
          id: 1,
          type: 'DEL',
          chromosome: 'chr22',
          start: 21465134,
          end: 21495965,
          size: 30831,
          genes_affected: ['DGCR8', 'TRMT2A'],
          clinical_significance: 'Pathogenic',
          syndrome: 'DiGeorge Syndrome'
        },
        {
          id: 2,
          type: 'DUP',
          chromosome: 'chr15',
          start: 23252734,
          end: 23376543,
          size: 123809,
          genes_affected: ['SNRPN', 'UBE3A'],
          clinical_significance: 'Likely Pathogenic',
          syndrome: 'Prader-Willi/Angelman region'
        }
      ],
      cnv_analysis: {
        total_cnvs: 234,
        deletions: 156,
        duplications: 78,
        large_cnvs: 12,
        pathogenic_cnvs: 3
      },
      quality_metrics: {
        mean_coverage: 30.2,
        coverage_uniformity: 92.4,
        gc_bias: 0.15,
        insert_size_mean: 350,
        duplication_rate: 8.2,
        contamination_rate: 0.02
      }
    };
  };

  const getImpactBadgeVariant = (impact) => {
    switch (impact) {
      case 'HIGH': return 'danger';
      case 'MODERATE': return 'warning';
      case 'LOW': return 'info';
      default: return 'secondary';
    }
  };

  const getClinicalSignificanceBadge = (significance) => {
    switch (significance) {
      case 'Pathogenic': return 'danger';
      case 'Likely Pathogenic': return 'warning';
      case 'VUS': return 'info';
      case 'Likely Benign': return 'light';
      case 'Benign': return 'success';
      default: return 'secondary';
    }
  };

  // Soft-coded download functionality
  const handleDownload = async (format = downloadFormat, section = downloadSection) => {
    try {
      setDownloading(true);
      setDownloadProgress(0);

      const config = DOWNLOAD_CONFIG.formats[format];
      const sectionConfig = DOWNLOAD_CONFIG.sections[section];
      
      // Simulate progress for user experience
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Prepare download payload
      const downloadPayload = {
        sample_id: analysisData?.sample_info?.sample_id,
        format: format,
        section: section,
        includes: sectionConfig.includes,
        timestamp: new Date().toISOString(),
        data: filterDataBySection(analysisData, sectionConfig.includes)
      };

      // Check if backend is available
      if (backendOnline) {
        try {
          const response = await apiClient.post(DOWNLOAD_CONFIG.endpoints[format], downloadPayload, {
            responseType: 'blob',
            headers: {
              'Content-Type': 'application/json'
            }
          });

          clearInterval(progressInterval);
          setDownloadProgress(100);

          // Create download link
          const blob = new Blob([response.data], { type: config.mimeType });
          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = generateFileName(format, section);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(downloadUrl);

        } catch (apiError) {
          console.warn('Backend download failed, using client-side generation:', apiError);
          await generateClientSideDownload(format, section, downloadPayload);
        }
      } else {
        // Client-side download generation
        await generateClientSideDownload(format, section, downloadPayload);
      }

      clearInterval(progressInterval);
      setDownloadProgress(100);
      
      setTimeout(() => {
        setDownloading(false);
        setDownloadProgress(0);
        setShowDownloadModal(false);
      }, 1000);

    } catch (error) {
      console.error('Download failed:', error);
      alert(`Download failed: ${error.message}`);
      setDownloading(false);
      setDownloadProgress(0);
    }
  };

  const filterDataBySection = (data, includes) => {
    const filtered = {};
    
    if (includes.includes('sample_info')) filtered.sample_info = data.sample_info;
    if (includes.includes('variants')) filtered.variants = data.top_variants;
    if (includes.includes('structural_variants')) filtered.structural_variants = data.structural_variants;
    if (includes.includes('quality_metrics')) filtered.quality_metrics = data.quality_metrics;
    if (includes.includes('annotations')) filtered.annotations = data.variant_summary;
    if (includes.includes('summary_stats')) {
      filtered.summary_stats = {
        total_variants: data.variant_summary?.total_variants,
        pathogenic: data.variant_summary?.pathogenic,
        quality_score: data.sample_info?.quality_score
      };
    }
    
    return filtered;
  };

  const generateFileName = (format, section) => {
    const timestamp = new Date().toISOString().slice(0, 10);
    const sampleId = analysisData?.sample_info?.sample_id || 'unknown';
    const sectionName = DOWNLOAD_CONFIG.sections[section].label.toLowerCase().replace(/\s+/g, '_');
    const extension = DOWNLOAD_CONFIG.formats[format].extension;
    
    return `${sampleId}_${sectionName}_${timestamp}.${extension}`;
  };

  const generateClientSideDownload = async (format, section, payload) => {
    const config = DOWNLOAD_CONFIG.formats[format];
    let content = '';
    let blob;

    switch (format) {
      case 'json':
        content = JSON.stringify(payload.data, null, 2);
        blob = new Blob([content], { type: config.mimeType });
        break;

      case 'csv':
        content = generateCSVContent(payload.data);
        blob = new Blob([content], { type: config.mimeType });
        break;

      case 'vcf':
        content = generateVCFContent(payload.data);
        blob = new Blob([content], { type: config.mimeType });
        break;

      case 'pdf':
        // For PDF, we'll generate a simple text-based report
        content = generateTextReport(payload.data);
        blob = new Blob([content], { type: 'text/plain' });
        break;

      default:
        content = JSON.stringify(payload.data, null, 2);
        blob = new Blob([content], { type: 'application/json' });
    }

    // Download the file
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = generateFileName(format, section);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  };

  const generateCSVContent = (data) => {
    let csv = '';
    
    if (data.variants) {
      csv += 'Chromosome,Position,Ref,Alt,Gene,Impact,Clinical Significance,Quality,Coverage\n';
      data.variants.forEach(variant => {
        csv += `${variant.chromosome},${variant.position},${variant.ref},${variant.alt},${variant.gene},${variant.impact},${variant.clinical_significance},${variant.quality},${variant.coverage}\n`;
      });
    }
    
    return csv;
  };

  const generateVCFContent = (data) => {
    let vcf = '##fileformat=VCFv4.2\n';
    vcf += `##fileDate=${new Date().toISOString().slice(0, 10)}\n`;
    vcf += '##source=GenomeAnalysis\n';
    vcf += '#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\n';
    
    if (data.variants) {
      data.variants.forEach(variant => {
        vcf += `${variant.chromosome.replace('chr', '')}\t${variant.position}\t${variant.dbsnp_id || '.'}\t${variant.ref}\t${variant.alt}\t${variant.quality}\tPASS\tGENE=${variant.gene};IMPACT=${variant.impact}\n`;
      });
    }
    
    return vcf;
  };

  const generateTextReport = (data) => {
    let report = 'GENOME ANALYSIS REPORT\n';
    report += '='.repeat(50) + '\n\n';
    
    if (data.sample_info) {
      report += 'SAMPLE INFORMATION:\n';
      report += `-Sample ID: ${data.sample_info.sample_id}\n`;
      report += `-Patient: ${data.sample_info.patient_name}\n`;
      report += `-Sequencing Type: ${data.sample_info.sequencing_type}\n`;
      report += `-Quality Score: ${data.sample_info.quality_score}%\n\n`;
    }
    
    if (data.variants) {
      report += 'TOP VARIANTS:\n';
      data.variants.forEach((variant, index) => {
        report += `-${index + 1}. ${variant.gene} (${variant.chromosome}:${variant.position})\n`;
        report += `  Impact: ${variant.impact}, Clinical Significance: ${variant.clinical_significance}\n`;
      });
    }
    
    return report;
  };

  const handleShare = async () => {
    try {
      const shareData = {
        title: `Genome Analysis Report - ${analysisData?.sample_info?.sample_id}`,
        text: 'Genomic analysis results',
        url: window.location.href
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers without Web Share API
        await navigator.clipboard.writeText(window.location.href);
        alert('Report URL copied to clipboard!');
      }
    } catch (error) {
      console.error('Sharing failed:', error);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading genome analysis...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-0">🧬 Genome Analysis Results</h2>
              <p className="text-muted">Comprehensive genomic variant analysis and interpretation</p>
            </div>
            <div>
              <Dropdown className="me-2">
                <Dropdown.Toggle variant="primary" disabled={downloading}>
                  <i className="ri-download-line me-1"></i>
                  {downloading ? 'Downloading...' : 'Download Report'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Header>Quick Downloads</Dropdown.Header>
                  <Dropdown.Item onClick={() => handleDownload('pdf', 'complete')}>
                    <i className="ri-file-pdf-line me-2"></i>PDF Report (Complete)
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleDownload('excel', 'variants_only')}>
                    <i className="ri-file-excel-line me-2"></i>Excel (Variants)
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleDownload('csv', 'variants_only')}>
                    <i className="ri-file-text-line me-2"></i>CSV (Variants)
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleDownload('vcf', 'variants_only')}>
                    <i className="ri-file-code-line me-2"></i>VCF File
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={() => setShowDownloadModal(true)}>
                    <i className="ri-settings-line me-2"></i>Custom Download...
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Button variant="outline-success" onClick={handleShare}>
                <i className="ri-share-line me-1"></i>Share Results
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Sample Information Card */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">
            <i className="ri-information-line me-2"></i>
            Sample Information: {analysisData?.sample_info?.sample_id}
          </h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              <p><strong>Patient:</strong> {analysisData?.sample_info?.patient_name}</p>
              <p><strong>Sequencing Type:</strong> {analysisData?.sample_info?.sequencing_type}</p>
              <p><strong>Coverage:</strong> {analysisData?.sample_info?.coverage}</p>
            </Col>
            <Col md={4}>
              <p><strong>Quality Score:</strong> 
                <Badge bg="success" className="ms-2">{analysisData?.sample_info?.quality_score}%</Badge>
              </p>
              <p><strong>Total Reads:</strong> {analysisData?.sample_info?.total_reads}</p>
              <p><strong>Mapped Reads:</strong> {analysisData?.sample_info?.mapped_reads}</p>
            </Col>
            <Col md={4}>
              <p><strong>Mapping Rate:</strong> 
                <Badge bg="info" className="ms-2">{analysisData?.sample_info?.mapping_rate}%</Badge>
              </p>
              <div className="mt-3">
                <ProgressBar>
                  <ProgressBar variant="success" now={analysisData?.sample_info?.mapping_rate} key={1} />
                </ProgressBar>
                <small className="text-muted">Mapping efficiency</small>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Analysis Tabs */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white">
          <Tab.Container activeKey={activeAnalysis} onSelect={setActiveAnalysis}>
            <Nav variant="tabs" className="border-0">
              <Nav.Item>
                <Nav.Link eventKey="variants">
                  <i className="ri-dna-line me-2"></i>Variant Analysis
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="pharmacogenomics">
                  <i className="ri-medicine-bottle-line me-2"></i>Pharmacogenomics
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="structural">
                  <i className="ri-git-branch-line me-2"></i>Structural Variants
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="quality">
                  <i className="ri-bar-chart-line me-2"></i>Quality Metrics
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="variants">
                <Card.Body>
                  {/* Variant Summary */}
                  <Row className="mb-4">
                    <Col lg={3} md={6} className="mb-3">
                      <Card className="border-0 bg-light text-center">
                        <Card.Body>
                          <h4 className="text-primary">{analysisData?.variant_summary?.total_variants?.toLocaleString()}</h4>
                          <p className="text-muted mb-0">Total Variants</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col lg={3} md={6} className="mb-3">
                      <Card className="border-0 bg-light text-center">
                        <Card.Body>
                          <h4 className="text-danger">{analysisData?.variant_summary?.pathogenic}</h4>
                          <p className="text-muted mb-0">Pathogenic</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col lg={3} md={6} className="mb-3">
                      <Card className="border-0 bg-light text-center">
                        <Card.Body>
                          <h4 className="text-warning">{analysisData?.variant_summary?.likely_pathogenic}</h4>
                          <p className="text-muted mb-0">Likely Pathogenic</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col lg={3} md={6} className="mb-3">
                      <Card className="border-0 bg-light text-center">
                        <Card.Body>
                          <h4 className="text-info">{analysisData?.variant_summary?.vus}</h4>
                          <p className="text-muted mb-0">VUS</p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  {/* Top Variants Table */}
                  <h5 className="mb-3">High-Priority Variants</h5>
                  <div className="table-responsive">
                    <Table hover>
                      <thead className="table-light">
                        <tr>
                          <th>Position</th>
                          <th>Gene</th>
                          <th>Variant</th>
                          <th>Impact</th>
                          <th>Clinical Significance</th>
                          <th>Coverage</th>
                          <th>Quality</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysisData?.top_variants?.map((variant, index) => (
                          <tr key={index}>
                            <td>
                              <div>
                                <strong>{variant.chromosome}:{variant.position.toLocaleString()}</strong>
                                <br />
                                <small className="text-muted">{variant.ref}→{variant.alt}</small>
                              </div>
                            </td>
                            <td>
                              <Badge bg="primary">{variant.gene}</Badge>
                            </td>
                            <td>
                              <small className="text-muted">{variant.consequence}</small>
                            </td>
                            <td>
                              <Badge bg={getImpactBadgeVariant(variant.impact)}>
                                {variant.impact}
                              </Badge>
                            </td>
                            <td>
                              <Badge bg={getClinicalSignificanceBadge(variant.clinical_significance)}>
                                {variant.clinical_significance}
                              </Badge>
                            </td>
                            <td>{variant.coverage}x</td>
                            <td>{variant.quality}%</td>
                            <td>
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => {
                                  setSelectedVariant(variant);
                                  setShowVariantModal(true);
                                }}
                              >
                                <i className="ri-eye-line"></i>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Tab.Pane>

              <Tab.Pane eventKey="pharmacogenomics">
                <Card.Body>
                  <h5 className="mb-4">Pharmacogenomic Analysis</h5>
                  <p className="text-muted mb-4">
                    Drug metabolism and response predictions based on genetic variants
                  </p>

                  <Row>
                    {analysisData?.pharmacogenomics?.map((pgx, index) => (
                      <Col lg={4} md={6} key={index} className="mb-4">
                        <Card className="border-0 bg-light h-100">
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <h6 className="mb-0">{pgx.gene}</h6>
                              <Badge bg="info">{pgx.evidence_level}</Badge>
                            </div>
                            
                            <div className="mb-3">
                              <strong>Genotype:</strong> <Badge bg="secondary">{pgx.genotype}</Badge>
                            </div>
                            
                            <div className="mb-3">
                              <strong>Phenotype:</strong> 
                              <br />
                              <span className="text-primary">{pgx.phenotype}</span>
                            </div>

                            <div className="mb-3">
                              <strong>Affected Drugs:</strong>
                              <div className="mt-1">
                                {pgx.drug_interactions.map((drug, drugIndex) => (
                                  <Badge key={drugIndex} bg="light" text="dark" className="me-1 mb-1">
                                    {drug}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="alert alert-warning small mb-0">
                              <strong>Recommendation:</strong> {pgx.recommendations}
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Tab.Pane>

              <Tab.Pane eventKey="structural">
                <Card.Body>
                  <h5 className="mb-4">Structural Variant Analysis</h5>

                  {/* CNV Summary */}
                  <Row className="mb-4">
                    <Col md={8}>
                      <Card className="border-0 bg-light">
                        <Card.Body>
                          <h6 className="mb-3">Copy Number Variation Summary</h6>
                          <Row>
                            <Col md={3} className="text-center">
                              <h4 className="text-primary">{analysisData?.cnv_analysis?.total_cnvs}</h4>
                              <small className="text-muted">Total CNVs</small>
                            </Col>
                            <Col md={3} className="text-center">
                              <h4 className="text-danger">{analysisData?.cnv_analysis?.deletions}</h4>
                              <small className="text-muted">Deletions</small>
                            </Col>
                            <Col md={3} className="text-center">
                              <h4 className="text-success">{analysisData?.cnv_analysis?.duplications}</h4>
                              <small className="text-muted">Duplications</small>
                            </Col>
                            <Col md={3} className="text-center">
                              <h4 className="text-warning">{analysisData?.cnv_analysis?.pathogenic_cnvs}</h4>
                              <small className="text-muted">Pathogenic</small>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  {/* Structural Variants Table */}
                  <h6 className="mb-3">Clinically Significant Structural Variants</h6>
                  <div className="table-responsive">
                    <Table hover>
                      <thead className="table-light">
                        <tr>
                          <th>Type</th>
                          <th>Location</th>
                          <th>Size</th>
                          <th>Genes Affected</th>
                          <th>Clinical Significance</th>
                          <th>Syndrome</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysisData?.structural_variants?.map((sv, index) => (
                          <tr key={index}>
                            <td>
                              <Badge bg={sv.type === 'DEL' ? 'danger' : 'success'}>
                                {sv.type}
                              </Badge>
                            </td>
                            <td>
                              <div>
                                <strong>{sv.chromosome}:{sv.start.toLocaleString()}-{sv.end.toLocaleString()}</strong>
                              </div>
                            </td>
                            <td>{sv.size.toLocaleString()} bp</td>
                            <td>
                              {sv.genes_affected.map((gene, geneIndex) => (
                                <Badge key={geneIndex} bg="light" text="dark" className="me-1">
                                  {gene}
                                </Badge>
                              ))}
                            </td>
                            <td>
                              <Badge bg={getClinicalSignificanceBadge(sv.clinical_significance)}>
                                {sv.clinical_significance}
                              </Badge>
                            </td>
                            <td>
                              <small className="text-muted">{sv.syndrome}</small>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Tab.Pane>

              <Tab.Pane eventKey="quality">
                <Card.Body>
                  <h5 className="mb-4">Sequencing Quality Metrics</h5>

                  <Row>
                    <Col md={6}>
                      <Card className="border-0 bg-light mb-4">
                        <Card.Body>
                          <h6 className="mb-3">Coverage Metrics</h6>
                          
                          <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <small>Mean Coverage</small>
                              <strong>{analysisData?.quality_metrics?.mean_coverage}x</strong>
                            </div>
                            <ProgressBar variant="primary" now={analysisData?.quality_metrics?.mean_coverage} max={50} />
                          </div>

                          <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <small>Coverage Uniformity</small>
                              <strong>{analysisData?.quality_metrics?.coverage_uniformity}%</strong>
                            </div>
                            <ProgressBar variant="success" now={analysisData?.quality_metrics?.coverage_uniformity} />
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col md={6}>
                      <Card className="border-0 bg-light mb-4">
                        <Card.Body>
                          <h6 className="mb-3">Quality Indicators</h6>
                          
                          <div className="row text-center">
                            <div className="col-6">
                              <h5 className="text-info">{analysisData?.quality_metrics?.duplication_rate}%</h5>
                              <small className="text-muted">Duplication Rate</small>
                            </div>
                            <div className="col-6">
                              <h5 className="text-success">{analysisData?.quality_metrics?.contamination_rate}%</h5>
                              <small className="text-muted">Contamination</small>
                            </div>
                          </div>

                          <div className="mt-3 text-center">
                            <h5 className="text-primary">{analysisData?.quality_metrics?.insert_size_mean} bp</h5>
                            <small className="text-muted">Mean Insert Size</small>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Card.Header>
      </Card>

      {/* Variant Detail Modal */}
      {/* Download Progress Indicator */}
      {downloading && (
        <Alert variant="info" className="position-fixed" style={{ 
          top: '20px', 
          right: '20px', 
          zIndex: 1050,
          minWidth: '300px'
        }}>
          <div className="d-flex align-items-center">
            <Spinner animation="border" size="sm" className="me-3" />
            <div className="flex-grow-1">
              <div className="fw-bold">Downloading Report...</div>
              <ProgressBar 
                now={downloadProgress} 
                className="mt-2" 
                style={{ height: '6px' }}
                variant={downloadProgress === 100 ? 'success' : 'primary'}
              />
            </div>
          </div>
        </Alert>
      )}

      {/* Custom Download Modal */}
      <Modal show={showDownloadModal} onHide={() => setShowDownloadModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-download-line me-2"></i>
            Custom Download Options
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>File Format</Form.Label>
                <Form.Select value={downloadFormat} onChange={(e) => setDownloadFormat(e.target.value)}>
                  {Object.entries(DOWNLOAD_CONFIG.formats).map(([key, format]) => (
                    <option key={key} value={key}>{format.label}</option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  {DOWNLOAD_CONFIG.formats[downloadFormat]?.description}
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Content Section</Form.Label>
                <Form.Select value={downloadSection} onChange={(e) => setDownloadSection(e.target.value)}>
                  {Object.entries(DOWNLOAD_CONFIG.sections).map(([key, section]) => (
                    <option key={key} value={key}>{section.label}</option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  {DOWNLOAD_CONFIG.sections[downloadSection]?.description}
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card className="bg-light border-0">
                <Card.Body>
                  <h6 className="mb-3">Download Preview</h6>
                  <div className="d-flex align-items-center">
                    <i className={`${DOWNLOAD_CONFIG.formats[downloadFormat]?.icon} fs-2 me-3 text-primary`}></i>
                    <div>
                      <div className="fw-bold">{generateFileName(downloadFormat, downloadSection)}</div>
                      <small className="text-muted">
                        Format: {DOWNLOAD_CONFIG.formats[downloadFormat]?.label} | 
                        Content: {DOWNLOAD_CONFIG.sections[downloadSection]?.label}
                      </small>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <Badge bg="secondary" className="me-2">
                      {DOWNLOAD_CONFIG.sections[downloadSection]?.includes?.length} sections included
                    </Badge>
                    <Badge bg="info">
                      {DOWNLOAD_CONFIG.formats[downloadFormat]?.extension.toUpperCase()} format
                    </Badge>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDownloadModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={() => handleDownload(downloadFormat, downloadSection)}
            disabled={downloading}
          >
            <i className="ri-download-line me-1"></i>
            {downloading ? 'Downloading...' : 'Start Download'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Variant Detail Modal */}
      <Modal show={showVariantModal} onHide={() => setShowVariantModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-dna-line me-2"></i>
            Variant Details: {selectedVariant?.gene}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedVariant && (
            <div>
              <Row>
                <Col md={6}>
                  <h6>Genomic Information</h6>
                  <p><strong>Position:</strong> {selectedVariant.chromosome}:{selectedVariant.position.toLocaleString()}</p>
                  <p><strong>Reference:</strong> {selectedVariant.ref}</p>
                  <p><strong>Alternative:</strong> {selectedVariant.alt}</p>
                  <p><strong>Gene:</strong> {selectedVariant.gene}</p>
                  <p><strong>Consequence:</strong> {selectedVariant.consequence}</p>
                </Col>
                <Col md={6}>
                  <h6>Clinical Information</h6>
                  <p><strong>Impact:</strong> 
                    <Badge bg={getImpactBadgeVariant(selectedVariant.impact)} className="ms-2">
                      {selectedVariant.impact}
                    </Badge>
                  </p>
                  <p><strong>Clinical Significance:</strong> 
                    <Badge bg={getClinicalSignificanceBadge(selectedVariant.clinical_significance)} className="ms-2">
                      {selectedVariant.clinical_significance}
                    </Badge>
                  </p>
                  <p><strong>Allele Frequency:</strong> {selectedVariant.allele_frequency}</p>
                  <p><strong>dbSNP ID:</strong> {selectedVariant.dbsnp_id}</p>
                  <p><strong>COSMIC ID:</strong> {selectedVariant.cosmic_id}</p>
                </Col>
              </Row>
              
              <Row className="mt-3">
                <Col md={6}>
                  <h6>Quality Metrics</h6>
                  <p><strong>Coverage:</strong> {selectedVariant.coverage}x</p>
                  <p><strong>Quality Score:</strong> {selectedVariant.quality}%</p>
                  <p><strong>Genotype:</strong> {selectedVariant.genotype}</p>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowVariantModal(false)}>
            Close
          </Button>
          <Button variant="primary">
            <i className="ri-external-link-line me-1"></i>View in Database
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GenomeAnalysis;
