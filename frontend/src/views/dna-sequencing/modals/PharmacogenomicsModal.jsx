import React, { useState } from 'react';
import { Modal, Form, Button, Row, Col, Alert, Badge, Table } from 'react-bootstrap';

const PharmacogenomicsModal = ({ show, onHide, onStartAnalysis }) => {
  const [formData, setFormData] = useState({
    sample_id: '',
    patient_id: '',
    analysis_panel: 'comprehensive',
    drug_focus: 'all_categories',
    priority: 'normal',
    include_cnv: true,
    include_hla: false,
    clinical_indication: '',
    ancestry: 'mixed'
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
        analysis_method: 'pharmacogenomics'
      });
      onHide();
    } catch (error) {
      console.error('Failed to start analysis:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const analysisPanels = {
    'basic': { 
      name: 'Basic PGx Panel', 
      genes: 15, 
      drugs: 25,
      description: 'Core pharmacogenes for common medications'
    },
    'standard': { 
      name: 'Standard PGx Panel', 
      genes: 35, 
      drugs: 65,
      description: 'Comprehensive panel for clinical use'
    },
    'comprehensive': { 
      name: 'Comprehensive PGx Panel', 
      genes: 65, 
      drugs: 120,
      description: 'Full pharmacogenomic profiling'
    },
    'custom': { 
      name: 'Custom Panel', 
      genes: 'Variable', 
      drugs: 'Variable',
      description: 'Tailored to specific clinical needs'
    }
  };

  const drugCategories = [
    'Cardiovascular', 'Psychiatric', 'Oncology', 'Pain Management', 
    'Anticoagulants', 'Immunosuppressants', 'Infectious Disease', 'All Categories'
  ];

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="ri-medicine-bottle-line me-2"></i>
          Pharmacogenomics Analysis
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant="info">
          <i className="ri-information-line me-2"></i>
          Analyze genetic variants affecting drug metabolism, efficacy, and adverse reactions for personalized medicine.
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
                  placeholder="e.g., PGx-2025-001"
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
                <Form.Label>Analysis Panel</Form.Label>
                <Form.Select
                  name="analysis_panel"
                  value={formData.analysis_panel}
                  onChange={handleInputChange}
                >
                  {Object.entries(analysisPanels).map(([key, panel]) => (
                    <option key={key} value={key}>{panel.name}</option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  {analysisPanels[formData.analysis_panel]?.description}
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Drug Focus</Form.Label>
                <Form.Select
                  name="drug_focus"
                  value={formData.drug_focus}
                  onChange={handleInputChange}
                >
                  <option value="all_categories">All Drug Categories</option>
                  <option value="cardiovascular">Cardiovascular</option>
                  <option value="psychiatric">Psychiatric</option>
                  <option value="oncology">Oncology</option>
                  <option value="pain_management">Pain Management</option>
                  <option value="anticoagulants">Anticoagulants</option>
                  <option value="immunosuppressants">Immunosuppressants</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Clinical Indication</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="clinical_indication"
                  value={formData.clinical_indication}
                  onChange={handleInputChange}
                  placeholder="Describe the clinical context or specific medications of interest..."
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Ancestry</Form.Label>
                <Form.Select
                  name="ancestry"
                  value={formData.ancestry}
                  onChange={handleInputChange}
                >
                  <option value="mixed">Mixed/Unknown</option>
                  <option value="european">European</option>
                  <option value="african">African</option>
                  <option value="asian">East Asian</option>
                  <option value="hispanic">Hispanic/Latino</option>
                  <option value="native_american">Native American</option>
                  <option value="middle_eastern">Middle Eastern</option>
                  <option value="south_asian">South Asian</option>
                </Form.Select>
                <Form.Text className="text-muted">
                  Ancestry information helps improve variant interpretation accuracy
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Priority</Form.Label>
                <Form.Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                >
                  <option value="low">Low (3-5 days)</option>
                  <option value="normal">Normal (1-3 days)</option>
                  <option value="high">High (12-24 hours)</option>
                  <option value="urgent">Urgent (6-12 hours)</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <div className="mt-4">
                <Form.Check
                  type="checkbox"
                  name="include_cnv"
                  label="Include CNV Analysis"
                  checked={formData.include_cnv}
                  onChange={handleInputChange}
                />
              </div>
            </Col>
            <Col md={4}>
              <div className="mt-4">
                <Form.Check
                  type="checkbox"
                  name="include_hla"
                  label="Include HLA Typing"
                  checked={formData.include_hla}
                  onChange={handleInputChange}
                />
              </div>
            </Col>
          </Row>

          {/* Panel Summary Table */}
          <div className="mt-4">
            <h6>Selected Panel Summary</h6>
            <Table size="sm" bordered>
              <thead className="table-light">
                <tr>
                  <th>Panel</th>
                  <th>Genes</th>
                  <th>Drugs Covered</th>
                  <th>Turnaround Time</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{analysisPanels[formData.analysis_panel]?.name}</td>
                  <td>{analysisPanels[formData.analysis_panel]?.genes}</td>
                  <td>{analysisPanels[formData.analysis_panel]?.drugs}</td>
                  <td>
                    {formData.priority === 'urgent' ? '6-12 hours' :
                     formData.priority === 'high' ? '12-24 hours' :
                     formData.priority === 'normal' ? '1-3 days' : '3-5 days'}
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>

          <div className="mt-3">
            <h6>Expected Deliverables:</h6>
            <div className="d-flex flex-wrap gap-2">
              <Badge bg="primary">Pharmacogenetic Profile</Badge>
              <Badge bg="success">Drug-Gene Interactions</Badge>
              <Badge bg="info">Dosing Recommendations</Badge>
              <Badge bg="warning">Clinical Guidelines</Badge>
              <Badge bg="secondary">Adverse Drug Reactions</Badge>
              {formData.include_hla && <Badge bg="danger">HLA Allele Report</Badge>}
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
              Start PGx Analysis
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PharmacogenomicsModal;
