import React, { useState } from 'react';
import { Modal, Form, Button, Row, Col, Alert, ProgressBar } from 'react-bootstrap';

const WholeGenomeAnalysisModal = ({ show, onHide, onStartAnalysis }) => {
  const [formData, setFormData] = useState({
    sample_id: '',
    patient_id: '',
    coverage_depth: '30x',
    analysis_type: 'standard',
    priority: 'normal',
    include_cnv: true,
    include_sv: true,
    reference_genome: 'GRCh38'
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
        analysis_method: 'whole_genome_sequencing'
      });
      onHide();
    } catch (error) {
      console.error('Failed to start analysis:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="ri-microscope-line me-2"></i>
          Whole Genome Sequencing Analysis
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant="info">
          <i className="ri-information-line me-2"></i>
          Comprehensive genome-wide analysis including SNVs, InDels, CNVs, and structural variants.
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
                  placeholder="e.g., WGS-2025-001"
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
                <Form.Label>Coverage Depth</Form.Label>
                <Form.Select
                  name="coverage_depth"
                  value={formData.coverage_depth}
                  onChange={handleInputChange}
                >
                  <option value="10x">10x (Low coverage)</option>
                  <option value="30x">30x (Standard)</option>
                  <option value="60x">60x (High coverage)</option>
                  <option value="100x">100x (Ultra-high coverage)</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Analysis Type</Form.Label>
                <Form.Select
                  name="analysis_type"
                  value={formData.analysis_type}
                  onChange={handleInputChange}
                >
                  <option value="standard">Standard WGS</option>
                  <option value="clinical">Clinical WGS</option>
                  <option value="research">Research WGS</option>
                  <option value="cancer">Cancer WGS</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Reference Genome</Form.Label>
                <Form.Select
                  name="reference_genome"
                  value={formData.reference_genome}
                  onChange={handleInputChange}
                >
                  <option value="GRCh38">GRCh38 (hg38)</option>
                  <option value="GRCh37">GRCh37 (hg19)</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Priority</Form.Label>
                <Form.Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                >
                  <option value="low">Low (7-14 days)</option>
                  <option value="normal">Normal (3-7 days)</option>
                  <option value="high">High (1-3 days)</option>
                  <option value="urgent">Urgent (24-48 hours)</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Check
                type="checkbox"
                name="include_cnv"
                label="Include CNV Analysis"
                checked={formData.include_cnv}
                onChange={handleInputChange}
              />
            </Col>
            <Col md={6}>
              <Form.Check
                type="checkbox"
                name="include_sv"
                label="Include Structural Variant Analysis"
                checked={formData.include_sv}
                onChange={handleInputChange}
              />
            </Col>
          </Row>
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
              Start WGS Analysis
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WholeGenomeAnalysisModal;
