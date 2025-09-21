import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table, Alert, ProgressBar, Modal, Form, Tab, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const VariantCalling = () => {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showVariantModal, setShowVariantModal] = useState(false);

  useEffect(() => {
    // Load demo variant calling data
    const demoVariants = [
      {
        id: 1,
        chromosome: 'chr1',
        position: 230710048,
        ref: 'A',
        alt: 'G',
        gene: 'AGT',
        variant_type: 'SNV',
        quality: 95.2,
        depth: 145,
        allele_frequency: 0.51,
        clinical_significance: 'Likely Pathogenic',
        impact: 'HIGH',
        consequence: 'missense_variant',
        dbsnp_id: 'rs699'
      },
      {
        id: 2,
        chromosome: 'chr17',
        position: 43094484,
        ref: 'C',
        alt: 'T',
        gene: 'BRCA1',
        variant_type: 'SNV',
        quality: 98.7,
        depth: 67,
        allele_frequency: 0.48,
        clinical_significance: 'Pathogenic',
        impact: 'HIGH',
        consequence: 'stop_gained',
        dbsnp_id: 'rs80357382'
      },
      {
        id: 3,
        chromosome: 'chr7',
        position: 117199644,
        ref: 'T',
        alt: 'C',
        gene: 'CFTR',
        variant_type: 'SNV',
        quality: 92.1,
        depth: 89,
        allele_frequency: 0.52,
        clinical_significance: 'Pathogenic',
        impact: 'MODERATE',
        consequence: 'missense_variant',
        dbsnp_id: 'rs113993960'
      },
      {
        id: 4,
        chromosome: 'chr4',
        position: 88090179,
        ref: 'ATCT',
        alt: 'A',
        gene: 'SNCA',
        variant_type: 'INDEL',
        quality: 88.5,
        depth: 156,
        allele_frequency: 0.49,
        clinical_significance: 'Uncertain Significance',
        impact: 'MODERATE',
        consequence: 'frameshift_variant',
        dbsnp_id: 'rs11931074'
      }
    ];
    
    setVariants(demoVariants);
  }, []);

  const getImpactBadgeVariant = (impact) => {
    switch (impact) {
      case 'HIGH': return 'danger';
      case 'MODERATE': return 'warning';
      case 'LOW': return 'info';
      case 'MODIFIER': return 'secondary';
      default: return 'light';
    }
  };

  const getClinicalBadgeVariant = (significance) => {
    if (significance?.includes('Pathogenic')) return 'danger';
    if (significance?.includes('Likely')) return 'warning';
    if (significance?.includes('Uncertain')) return 'info';
    if (significance?.includes('Benign')) return 'success';
    return 'secondary';
  };

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>Variant Calling</h2>
              <p className="text-muted">Identify and analyze genetic variants from sequencing data</p>
            </div>
            <div>
              <Button as={Link} to="/dna-sequencing/dashboard" variant="outline-primary" className="me-2">
                Back to Dashboard
              </Button>
              <Button variant="primary">
                <i className="ri-download-line me-2"></i>
                Export Results
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="text-primary mb-2">
                <i className="ri-dna-line" style={{ fontSize: '2rem' }}></i>
              </div>
              <h4 className="mb-1">{variants.length}</h4>
              <p className="text-muted mb-0">Total Variants</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="text-danger mb-2">
                <i className="ri-alert-line" style={{ fontSize: '2rem' }}></i>
              </div>
              <h4 className="mb-1">{variants.filter(v => v.impact === 'HIGH').length}</h4>
              <p className="text-muted mb-0">High Impact</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="text-warning mb-2">
                <i className="ri-error-warning-line" style={{ fontSize: '2rem' }}></i>
              </div>
              <h4 className="mb-1">{variants.filter(v => v.clinical_significance?.includes('Pathogenic')).length}</h4>
              <p className="text-muted mb-0">Pathogenic</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="text-success mb-2">
                <i className="ri-check-line" style={{ fontSize: '2rem' }}></i>
              </div>
              <h4 className="mb-1">{Math.round(variants.reduce((sum, v) => sum + v.quality, 0) / variants.length)}%</h4>
              <p className="text-muted mb-0">Avg Quality</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Variants Table */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Identified Variants</h5>
                <div>
                  <Button variant="outline-primary" size="sm" className="me-2">
                    <i className="ri-filter-line me-1"></i>
                    Filter
                  </Button>
                  <Button variant="outline-primary" size="sm">
                    <i className="ri-sort-desc me-1"></i>
                    Sort
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Position</th>
                    <th>Gene</th>
                    <th>Variant</th>
                    <th>Type</th>
                    <th>Quality</th>
                    <th>Depth</th>
                    <th>AF</th>
                    <th>Impact</th>
                    <th>Clinical Significance</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((variant) => (
                    <tr key={variant.id}>
                      <td>
                        <strong>{variant.chromosome}:{variant.position.toLocaleString()}</strong>
                      </td>
                      <td>
                        <Badge bg="info" className="me-1">{variant.gene}</Badge>
                      </td>
                      <td>
                        <code>{variant.ref}→{variant.alt}</code>
                      </td>
                      <td>
                        <Badge bg="secondary">{variant.variant_type}</Badge>
                      </td>
                      <td>
                        <span className={variant.quality >= 90 ? 'text-success' : variant.quality >= 70 ? 'text-warning' : 'text-danger'}>
                          {variant.quality}%
                        </span>
                      </td>
                      <td>{variant.depth}x</td>
                      <td>{variant.allele_frequency.toFixed(2)}</td>
                      <td>
                        <Badge bg={getImpactBadgeVariant(variant.impact)}>
                          {variant.impact}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={getClinicalBadgeVariant(variant.clinical_significance)}>
                          {variant.clinical_significance}
                        </Badge>
                      </td>
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
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Variant Details Modal */}
      <Modal show={showVariantModal} onHide={() => setShowVariantModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Variant Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedVariant && (
            <Row>
              <Col md={6}>
                <h6>Genomic Information</h6>
                <Table borderless size="sm">
                  <tbody>
                    <tr>
                      <td><strong>Position:</strong></td>
                      <td>{selectedVariant.chromosome}:{selectedVariant.position.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td><strong>Gene:</strong></td>
                      <td>{selectedVariant.gene}</td>
                    </tr>
                    <tr>
                      <td><strong>Variant:</strong></td>
                      <td><code>{selectedVariant.ref}→{selectedVariant.alt}</code></td>
                    </tr>
                    <tr>
                      <td><strong>Type:</strong></td>
                      <td>{selectedVariant.variant_type}</td>
                    </tr>
                    <tr>
                      <td><strong>Consequence:</strong></td>
                      <td>{selectedVariant.consequence}</td>
                    </tr>
                    <tr>
                      <td><strong>dbSNP ID:</strong></td>
                      <td>{selectedVariant.dbsnp_id}</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
              <Col md={6}>
                <h6>Quality Metrics</h6>
                <Table borderless size="sm">
                  <tbody>
                    <tr>
                      <td><strong>Quality Score:</strong></td>
                      <td>{selectedVariant.quality}%</td>
                    </tr>
                    <tr>
                      <td><strong>Read Depth:</strong></td>
                      <td>{selectedVariant.depth}x</td>
                    </tr>
                    <tr>
                      <td><strong>Allele Frequency:</strong></td>
                      <td>{selectedVariant.allele_frequency.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td><strong>Impact:</strong></td>
                      <td>
                        <Badge bg={getImpactBadgeVariant(selectedVariant.impact)}>
                          {selectedVariant.impact}
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Clinical Significance:</strong></td>
                      <td>
                        <Badge bg={getClinicalBadgeVariant(selectedVariant.clinical_significance)}>
                          {selectedVariant.clinical_significance}
                        </Badge>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVariantModal(false)}>
            Close
          </Button>
          <Button variant="primary">
            Generate Report
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default VariantCalling;
