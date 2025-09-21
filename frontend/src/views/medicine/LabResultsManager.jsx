import React, { useState, useEffect } from 'react';
import {
  Card, Table, Button, Modal, Form, Badge, Alert, Row, Col,
  Spinner, ProgressBar, InputGroup, Tabs, Tab, ButtonGroup
} from 'react-bootstrap';
import {
  FaMicroscope, FaPlus, FaEdit, FaEye, FaDownload, FaExclamationTriangle,
  FaSearch, FaFilter, FaChartLine, FaClipboardCheck, FaVial,
  FaCalendarAlt, FaClock, FaFlag, FaFileAlt, FaHeartbeat
} from 'react-icons/fa';

const LabResultsManager = ({ 
  selectedPatient, 
  labResults, 
  consultations,
  fetchPatientData, 
  showAlert 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [uploading, setUploading] = useState(false);
  
  const [resultForm, setResultForm] = useState({
    consultation_id: '',
    test_name: '',
    test_category: 'blood',
    test_date: new Date().toISOString().slice(0, 10),
    lab_name: '',
    technician_name: '',
    ordered_by: '',
    specimen_type: '',
    collection_date: new Date().toISOString().slice(0, 10),
    results: [],
    critical_values: [],
    interpretation: '',
    reference_ranges: '',
    notes: '',
    attachments: []
  });

  const [resultValue, setResultValue] = useState({
    parameter: '',
    value: '',
    unit: '',
    reference_range: '',
    status: 'normal'
  });

  const API_BASE = '/api/medicine/s3-api';

  const testCategories = [
    'blood', 'urine', 'stool', 'imaging', 'microbiology', 
    'biochemistry', 'hematology', 'immunology', 'molecular',
    'pathology', 'cardiology', 'endocrine', 'toxicology'
  ];

  const resetForm = () => {
    setResultForm({
      consultation_id: '',
      test_name: '',
      test_category: 'blood',
      test_date: new Date().toISOString().slice(0, 10),
      lab_name: '',
      technician_name: '',
      ordered_by: '',
      specimen_type: '',
      collection_date: new Date().toISOString().slice(0, 10),
      results: [],
      critical_values: [],
      interpretation: '',
      reference_ranges: '',
      notes: '',
      attachments: []
    });
    setResultValue({
      parameter: '',
      value: '',
      unit: '',
      reference_range: '',
      status: 'normal'
    });
  };

  const createLabResult = async () => {
    if (!selectedPatient) return;
    
    try {
      setLoading(true);
      const formData = new FormData();
      
      // Add basic fields
      Object.keys(resultForm).forEach(key => {
        if (key === 'results' || key === 'critical_values') {
          formData.append(key, JSON.stringify(resultForm[key]));
        } else if (key === 'attachments') {
          resultForm.attachments.forEach(file => {
            formData.append('attachments', file);
          });
        } else {
          formData.append(key, resultForm[key]);
        }
      });
      
      formData.append('patient_id', selectedPatient.id);
      
      const response = await fetch(`${API_BASE}/create-lab-result/`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create lab result');
      }
      
      const data = await response.json();
      showAlert('Lab result created successfully with S3 storage!');
      setShowModal(false);
      resetForm();
      fetchPatientData(selectedPatient.id);
    } catch (err) {
      showAlert(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const openViewModal = (result) => {
    setSelectedResult(result);
    setResultForm({
      consultation_id: result.consultation?.id || '',
      test_name: result.test_name,
      test_category: result.test_category,
      test_date: result.test_date,
      lab_name: result.lab_name || '',
      technician_name: result.technician_name || '',
      ordered_by: result.ordered_by || '',
      specimen_type: result.specimen_type || '',
      collection_date: result.collection_date || result.test_date,
      results: result.results || [],
      critical_values: result.critical_values || [],
      interpretation: result.interpretation || '',
      reference_ranges: result.reference_ranges || '',
      notes: result.notes || '',
      attachments: []
    });
    setShowModal(true);
  };

  const addResultValue = () => {
    if (resultValue.parameter && resultValue.value) {
      setResultForm(prev => ({
        ...prev,
        results: [...prev.results, { ...resultValue }]
      }));
      setResultValue({
        parameter: '',
        value: '',
        unit: '',
        reference_range: '',
        status: 'normal'
      });
    }
  };

  const removeResultValue = (index) => {
    setResultForm(prev => ({
      ...prev,
      results: prev.results.filter((_, i) => i !== index)
    }));
  };

  const addCriticalValue = (parameter) => {
    if (!resultForm.critical_values.includes(parameter)) {
      setResultForm(prev => ({
        ...prev,
        critical_values: [...prev.critical_values, parameter]
      }));
    }
  };

  const handleFileUpload = (files) => {
    setResultForm(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...Array.from(files)]
    }));
  };

  const filteredResults = labResults.filter(result => {
    const matchesSearch = result.test_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.lab_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || result.test_category === filterCategory;
    const matchesStatus = filterStatus === 'all' || result.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryBadge = (category) => {
    const variants = {
      'blood': 'danger',
      'urine': 'warning',
      'stool': 'info',
      'imaging': 'primary',
      'microbiology': 'success',
      'biochemistry': 'secondary',
      'hematology': 'dark',
      'immunology': 'light',
      'molecular': 'primary',
      'pathology': 'danger',
      'cardiology': 'warning',
      'endocrine': 'info',
      'toxicology': 'dark'
    };
    return <Badge bg={variants[category] || 'secondary'}>{category}</Badge>;
  };

  const getStatusBadge = (status, hasCritical) => {
    if (hasCritical) {
      return <Badge bg="danger"><FaExclamationTriangle className="me-1" />Critical</Badge>;
    }
    
    const variants = {
      'normal': 'success',
      'abnormal': 'warning',
      'critical': 'danger',
      'pending': 'secondary',
      'cancelled': 'dark'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getValueStatusColor = (status) => {
    const colors = {
      'normal': 'success',
      'high': 'danger',
      'low': 'warning',
      'critical': 'danger',
      'abnormal': 'warning'
    };
    return colors[status] || 'secondary';
  };

  if (!selectedPatient) {
    return (
      <Card>
        <Card.Header>
          <h5><FaMicroscope className="me-2" />Lab Results</h5>
        </Card.Header>
        <Card.Body>
          <Alert variant="info">
            Please select a patient first to view and manage lab results.
          </Alert>
        </Card.Body>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5>
            <FaMicroscope className="me-2" />Lab Results
            <span className="text-muted ms-2">- {selectedPatient.full_name}</span>
          </h5>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <FaPlus className="me-1" />New Lab Result
          </Button>
        </Card.Header>
        <Card.Body>
          {/* Search and Filter */}
          <Row className="mb-3">
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text><FaSearch /></InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search lab results..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text><FaFilter /></InputGroup.Text>
                <Form.Select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {testCategories.map(cat => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Col>
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text><FaClipboardCheck /></InputGroup.Text>
                <Form.Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="normal">Normal</option>
                  <option value="abnormal">Abnormal</option>
                  <option value="critical">Critical</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </Form.Select>
              </InputGroup>
            </Col>
          </Row>

          {filteredResults.length > 0 ? (
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>Test Name</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Lab/Provider</th>
                  <th>Results Count</th>
                  <th>Status</th>
                  <th>S3 Files</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map(result => (
                  <tr key={result.id}>
                    <td>
                      <div>
                        <strong>{result.test_name}</strong>
                        {result.consultation && (
                          <div>
                            <small className="text-muted">
                              <FaHeartbeat className="me-1" />
                              Consultation: {result.consultation.consultation_date}
                            </small>
                          </div>
                        )}
                        {result.specimen_type && (
                          <div>
                            <small className="text-muted">
                              <FaVial className="me-1" />
                              {result.specimen_type}
                            </small>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>{getCategoryBadge(result.test_category)}</td>
                    <td>
                      <div>
                        <FaCalendarAlt className="me-1" />
                        {result.test_date}
                      </div>
                      {result.collection_date && result.collection_date !== result.test_date && (
                        <small className="text-muted">
                          Collected: {result.collection_date}
                        </small>
                      )}
                    </td>
                    <td>
                      <div>{result.lab_name || 'N/A'}</div>
                      {result.ordered_by && (
                        <small className="text-muted">
                          Ordered by: {result.ordered_by}
                        </small>
                      )}
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <Badge bg="info" className="me-2">
                          {result.results?.length || 0} values
                        </Badge>
                        {result.critical_values?.length > 0 && (
                          <Badge bg="danger">
                            <FaFlag className="me-1" />
                            {result.critical_values.length} critical
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td>
                      {getStatusBadge(result.status, result.critical_values?.length > 0)}
                    </td>
                    <td>
                      <div>
                        {result.has_s3_files ? (
                          <Badge bg="success">Stored</Badge>
                        ) : (
                          <Badge bg="secondary">None</Badge>
                        )}
                        {result.attachment_count > 0 && (
                          <div>
                            <small className="text-muted">
                              {result.attachment_count} file(s)
                            </small>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <ButtonGroup size="sm">
                        <Button 
                          variant="outline-primary"
                          onClick={() => openViewModal(result)}
                        >
                          <FaEye />
                        </Button>
                        <Button variant="outline-secondary">
                          <FaEdit />
                        </Button>
                        {result.has_s3_files && (
                          <Button variant="outline-success">
                            <FaDownload />
                          </Button>
                        )}
                      </ButtonGroup>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center py-4">
              <FaMicroscope size={48} className="text-muted mb-3" />
              <p>No lab results found for this patient.</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Lab Result Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaMicroscope className="me-2" />
            {selectedResult ? 'View Lab Result' : 'New Lab Result'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-3">
            <Tab eventKey="overview" title="Test Information">
              <Form>
                <Row>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>Test Name *</Form.Label>
                      <Form.Control
                        type="text"
                        value={resultForm.test_name}
                        onChange={(e) => setResultForm({...resultForm, test_name: e.target.value})}
                        placeholder="Enter test name"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Select
                        value={resultForm.test_category}
                        onChange={(e) => setResultForm({...resultForm, test_category: e.target.value})}
                      >
                        {testCategories.map(cat => (
                          <option key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Related Consultation</Form.Label>
                  <Form.Select
                    value={resultForm.consultation_id}
                    onChange={(e) => setResultForm({...resultForm, consultation_id: e.target.value})}
                  >
                    <option value="">Select consultation (optional)</option>
                    {consultations.map(consultation => (
                      <option key={consultation.id} value={consultation.id}>
                        {consultation.consultation_date_formatted} - {consultation.chief_complaint}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Test Date *</Form.Label>
                      <Form.Control
                        type="date"
                        value={resultForm.test_date}
                        onChange={(e) => setResultForm({...resultForm, test_date: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Collection Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={resultForm.collection_date}
                        onChange={(e) => setResultForm({...resultForm, collection_date: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Specimen Type</Form.Label>
                      <Form.Control
                        type="text"
                        value={resultForm.specimen_type}
                        onChange={(e) => setResultForm({...resultForm, specimen_type: e.target.value})}
                        placeholder="e.g., Blood, Urine, Tissue"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Laboratory Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={resultForm.lab_name}
                        onChange={(e) => setResultForm({...resultForm, lab_name: e.target.value})}
                        placeholder="Laboratory or facility name"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Technician</Form.Label>
                      <Form.Control
                        type="text"
                        value={resultForm.technician_name}
                        onChange={(e) => setResultForm({...resultForm, technician_name: e.target.value})}
                        placeholder="Technician name"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Ordered By</Form.Label>
                      <Form.Control
                        type="text"
                        value={resultForm.ordered_by}
                        onChange={(e) => setResultForm({...resultForm, ordered_by: e.target.value})}
                        placeholder="Ordering physician"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Tab>

            <Tab eventKey="results" title="Test Results">
              <Form>
                {/* Add Result Value */}
                <Card className="mb-3">
                  <Card.Header>
                    <h6><FaVial className="me-2" />Add Test Result</h6>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={3}>
                        <Form.Group className="mb-2">
                          <Form.Label>Parameter</Form.Label>
                          <Form.Control
                            type="text"
                            value={resultValue.parameter}
                            onChange={(e) => setResultValue({...resultValue, parameter: e.target.value})}
                            placeholder="e.g., Glucose, WBC"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={2}>
                        <Form.Group className="mb-2">
                          <Form.Label>Value</Form.Label>
                          <Form.Control
                            type="text"
                            value={resultValue.value}
                            onChange={(e) => setResultValue({...resultValue, value: e.target.value})}
                            placeholder="Value"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={2}>
                        <Form.Group className="mb-2">
                          <Form.Label>Unit</Form.Label>
                          <Form.Control
                            type="text"
                            value={resultValue.unit}
                            onChange={(e) => setResultValue({...resultValue, unit: e.target.value})}
                            placeholder="mg/dL, etc."
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="mb-2">
                          <Form.Label>Reference Range</Form.Label>
                          <Form.Control
                            type="text"
                            value={resultValue.reference_range}
                            onChange={(e) => setResultValue({...resultValue, reference_range: e.target.value})}
                            placeholder="Normal range"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={2}>
                        <Form.Group className="mb-2">
                          <Form.Label>Status</Form.Label>
                          <Form.Select
                            value={resultValue.status}
                            onChange={(e) => setResultValue({...resultValue, status: e.target.value})}
                          >
                            <option value="normal">Normal</option>
                            <option value="high">High</option>
                            <option value="low">Low</option>
                            <option value="critical">Critical</option>
                            <option value="abnormal">Abnormal</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Button variant="primary" onClick={addResultValue}>
                      <FaPlus className="me-1" />Add Result
                    </Button>
                  </Card.Body>
                </Card>

                {/* Results Table */}
                {resultForm.results.length > 0 && (
                  <Card className="mb-3">
                    <Card.Header>
                      <h6><FaChartLine className="me-2" />Test Results</h6>
                    </Card.Header>
                    <Card.Body>
                      <Table responsive striped>
                        <thead>
                          <tr>
                            <th>Parameter</th>
                            <th>Value</th>
                            <th>Unit</th>
                            <th>Reference Range</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {resultForm.results.map((result, index) => (
                            <tr key={index}>
                              <td>{result.parameter}</td>
                              <td>
                                <strong className={`text-${getValueStatusColor(result.status)}`}>
                                  {result.value}
                                </strong>
                              </td>
                              <td>{result.unit}</td>
                              <td>{result.reference_range}</td>
                              <td>
                                <Badge bg={getValueStatusColor(result.status)}>
                                  {result.status}
                                </Badge>
                              </td>
                              <td>
                                {result.status === 'critical' ? (
                                  <Button 
                                    variant="outline-danger" 
                                    size="sm"
                                    onClick={() => addCriticalValue(result.parameter)}
                                  >
                                    <FaFlag />
                                  </Button>
                                ) : null}
                                <Button 
                                  variant="outline-danger" 
                                  size="sm" 
                                  className="ms-2"
                                  onClick={() => removeResultValue(index)}
                                >
                                  ×
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                )}

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Interpretation</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        value={resultForm.interpretation}
                        onChange={(e) => setResultForm({...resultForm, interpretation: e.target.value})}
                        placeholder="Clinical interpretation of results"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Additional Notes</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        value={resultForm.notes}
                        onChange={(e) => setResultForm({...resultForm, notes: e.target.value})}
                        placeholder="Additional notes or observations"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Tab>

            <Tab eventKey="attachments" title="Attachments">
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Upload Lab Reports/Images</Form.Label>
                  <Form.Control
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                  <Form.Text className="text-muted">
                    Upload lab reports, images, or other relevant documents.
                  </Form.Text>
                </Form.Group>

                {resultForm.attachments.length > 0 && (
                  <Card>
                    <Card.Header>
                      <h6><FaFileAlt className="me-2" />Selected Files</h6>
                    </Card.Header>
                    <Card.Body>
                      {resultForm.attachments.map((file, index) => (
                        <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                          <span>{file.name}</span>
                          <span className="text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      ))}
                    </Card.Body>
                  </Card>
                )}
              </Form>
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          {!selectedResult && (
            <Button variant="primary" onClick={createLabResult} disabled={loading}>
              {loading ? <Spinner size="sm" className="me-2" /> : <FaPlus className="me-2" />}
              Create Lab Result
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LabResultsManager;
