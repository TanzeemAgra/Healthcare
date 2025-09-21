import React, { useState } from 'react';
import { Modal, Form, Button, Row, Col, Alert, Badge } from 'react-bootstrap';

const ExomeSequencingModal = ({ show, onHide, onStartAnalysis }) => {
  const [formData, setFormData] = useState({
    sample_id: '',
    patient_id: '',
    capture_kit: 'agilent_sureselect',
    coverage_depth: '100x',
    analysis_focus: 'clinical',
    priority: 'normal',
    include_mitochondrial: false,
    trio_analysis: false,
    annotation_level: 'comprehensive'
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await onStartAnalysis({
        ...formData,
        analysis_method: 'exome_sequencing'
      });
      onHide();
    } catch (error) {
      console.error('Failed to start analysis:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const captureKits = {
    'agilent_sureselect': { name: 'Agilent SureSelect', coverage: '~51Mb', genes: '~22,000' },
    'illumina_nextera': { name: 'Illumina Nextera', coverage: '~45Mb', genes: '~20,000' },
    'twist_comprehensive': { name: 'Twist Comprehensive', coverage: '~33Mb', genes: '~19,000' },
    'idt_xgen': { name: 'IDT xGen', coverage: '~39Mb', genes: '~19,500' }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="ri-dna-line me-2"></i>
          Exome Sequencing Analysis
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant="info">
          <i className="ri-information-line me-2"></i>
          Targeted sequencing of protein-coding regions (~1-2% of the genome) for efficient variant discovery.
        </Alert>
        
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Sample ID *</Form.Label>
                <Form.Control
                  type="text"
                  name="sample_id"
                  value={formData.sample_id}
                  onChange={handleInputChange}
                  placeholder="e.g., WES-2025-001"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Patient ID *</Form.Label>
                <Form.Control
                  type="text"
                  name="patient_id"
                  value={formData.patient_id}
                  onChange={handleInputChange}
                  placeholder="e.g., P123456"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Capture Kit</Form.Label>
                <Form.Select
                  name="capture_kit"
                  value={formData.capture_kit}
                  onChange={handleInputChange}
                >
                  {Object.entries(captureKits).map(([key, kit]) => (
                    <option key={key} value={key}>{kit.name}</option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  {captureKits[formData.capture_kit] && (
                    <>
                      Coverage: {captureKits[formData.capture_kit].coverage} | 
                      Genes: {captureKits[formData.capture_kit].genes}
                    </>
                  )}
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Coverage Depth</Form.Label>
                <Form.Select
                  name="coverage_depth"
                  value={formData.coverage_depth}
                  onChange={handleInputChange}
                >
                  <option value="50x">50x (Basic)</option>
                  <option value="100x">100x (Standard)</option>
                  <option value="150x">150x (High coverage)</option>
                  <option value="200x">200x (Ultra-high coverage)</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Analysis Focus</Form.Label>
                <Form.Select
                  name="analysis_focus"
                  value={formData.analysis_focus}
                  onChange={handleInputChange}
                >
                  <option value="clinical">Clinical Diagnostics</option>
                  <option value="research">Research Discovery</option>
                  <option value="rare_disease">Rare Disease</option>
                  <option value="cancer_predisposition">Cancer Predisposition</option>
                  <option value="neurological">Neurological Disorders</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Annotation Level</Form.Label>
                <Form.Select
                  name="annotation_level"
                  value={formData.annotation_level}
                  onChange={handleInputChange}
                >
                  <option value="basic">Basic (ClinVar, OMIM)</option>
                  <option value="standard">Standard (+ dbSNP, 1000G)</option>
                  <option value="comprehensive">Comprehensive (+ gnomAD, CADD)</option>
                  <option value="research">Research (All databases)</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Priority</Form.Label>
                <Form.Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                >
                  <option value="low">Low (5-10 days)</option>
                  <option value="normal">Normal (2-5 days)</option>
                  <option value="high">High (1-2 days)</option>
                  <option value="urgent">Urgent (12-24 hours)</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <div className="d-flex flex-column gap-2 mt-4">
                <Form.Check
                  type="checkbox"
                  name="include_mitochondrial"
                  label="Include Mitochondrial Analysis"
                  checked={formData.include_mitochondrial}
                  onChange={handleInputChange}
                />
                <Form.Check
                  type="checkbox"
                  name="trio_analysis"
                  label="Trio Analysis (Proband + Parents)"
                  checked={formData.trio_analysis}
                  onChange={handleInputChange}
                />
              </div>
            </Col>
          </Row>

          <div className="mt-3">
            <h6>Expected Deliverables:</h6>
            <div className="d-flex flex-wrap gap-2">
              <Badge bg="primary">Variant Call File (VCF)</Badge>
              <Badge bg="success">Annotated Variants</Badge>
              <Badge bg="info">Quality Metrics Report</Badge>
              <Badge bg="warning">Clinical Summary</Badge>
              {formData.trio_analysis && <Badge bg="secondary">Inheritance Analysis</Badge>}
            </div>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={submitting}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={submitting || !formData.sample_id || !formData.patient_id}
        >
          {submitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Starting Analysis...
            </>
          ) : (
            <>
              <i className="ri-play-line me-1"></i>
              Start Exome Analysis
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExomeSequencingModal;
