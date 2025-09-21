import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert, Modal, Badge, InputGroup } from 'react-bootstrap';
import { patientReportsAPI } from '../../services/medicineAdvancedAPI';

const PatientReportsCRUD = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    report_type: '',
    status: '',
    date_from: '',
    date_to: ''
  });

  // Form state
  const [formData, setFormData] = useState({
    patient: '',
    report_type: 'comprehensive',
    title: '',
    content: '',
    ai_summary: '',
    status: 'draft',
    is_sent: false,
    generated_at: '',
    sent_at: ''
  });

  const reportTypes = [
    { value: 'comprehensive', label: 'Comprehensive Report' },
    { value: 'lab_results', label: 'Lab Results' },
    { value: 'imaging', label: 'Imaging Report' },
    { value: 'discharge', label: 'Discharge Summary' },
    { value: 'progress', label: 'Progress Note' },
    { value: 'consultation', label: 'Consultation Report' }
  ];

  const statusOptions = [
    { value: 'draft', label: 'Draft', variant: 'secondary' },
    { value: 'reviewed', label: 'Reviewed', variant: 'warning' },
    { value: 'approved', label: 'Approved', variant: 'success' },
    { value: 'sent', label: 'Sent', variant: 'info' }
  ];

  useEffect(() => {
    fetchReports();
  }, [filters, searchQuery]);

  const fetchReports = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        ...filters,
        search: searchQuery || undefined
      };
      const data = await patientReportsAPI.getAll(params);
      setReports(data.results || data);
    } catch (err) {
      setError('Failed to fetch patient reports: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (modalMode === 'create') {
        await patientReportsAPI.create(formData);
        setSuccess('Patient report created successfully!');
      } else if (modalMode === 'edit') {
        await patientReportsAPI.update(selectedReport.id, formData);
        setSuccess('Patient report updated successfully!');
      }
      
      setShowModal(false);
      resetForm();
      await fetchReports();
    } catch (err) {
      setError('Failed to save patient report: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this patient report?')) return;
    
    setLoading(true);
    setError('');
    
    try {
      await patientReportsAPI.delete(id);
      setSuccess('Patient report deleted successfully!');
      await fetchReports();
    } catch (err) {
      setError('Failed to delete patient report: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAI = async (id) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await patientReportsAPI.generateAISummary(id);
      setSuccess('AI summary generated successfully!');
      await fetchReports();
    } catch (err) {
      setError('Failed to generate AI summary: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReport = async (id) => {
    setLoading(true);
    setError('');
    
    try {
      await patientReportsAPI.sendReport(id, {
        recipient_email: 'patient@example.com', // This should come from a form
        include_summary: true
      });
      setSuccess('Report sent successfully!');
      await fetchReports();
    } catch (err) {
      setError('Failed to send report: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (mode, report = null) => {
    setModalMode(mode);
    setSelectedReport(report);
    if (report && (mode === 'edit' || mode === 'view')) {
      setFormData({
        patient: report.patient || '',
        report_type: report.report_type || 'comprehensive',
        title: report.title || '',
        content: report.content || '',
        ai_summary: report.ai_summary || '',
        status: report.status || 'draft',
        is_sent: report.is_sent || false,
        generated_at: report.generated_at || '',
        sent_at: report.sent_at || ''
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      patient: '',
      report_type: 'comprehensive',
      title: '',
      content: '',
      ai_summary: '',
      status: 'draft',
      is_sent: false,
      generated_at: '',
      sent_at: ''
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      report_type: '',
      status: '',
      date_from: '',
      date_to: ''
    });
    setSearchQuery('');
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                <i className="ri-file-text-line me-2"></i>
                Patient Reports Management
              </h4>
              <Button 
                variant="primary" 
                onClick={() => openModal('create')}
                disabled={loading}
              >
                <i className="ri-add-line me-1"></i>
                Create Report
              </Button>
            </Card.Header>

            <Card.Body>
              {/* Alerts */}
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert variant="success" dismissible onClose={() => setSuccess('')}>
                  {success}
                </Alert>
              )}

              {/* Search and Filters */}
              <Row className="mb-3">
                <Col md={4}>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Search reports..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button variant="outline-secondary">
                      <i className="ri-search-line"></i>
                    </Button>
                  </InputGroup>
                </Col>
                <Col md={2}>
                  <Form.Select
                    value={filters.report_type}
                    onChange={(e) => handleFilterChange('report_type', e.target.value)}
                  >
                    <option value="">All Types</option>
                    {reportTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Form.Select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="">All Status</option>
                    {statusOptions.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Form.Control
                    type="date"
                    value={filters.date_from}
                    onChange={(e) => handleFilterChange('date_from', e.target.value)}
                    placeholder="From Date"
                  />
                </Col>
                <Col md={1}>
                  <Form.Control
                    type="date"
                    value={filters.date_to}
                    onChange={(e) => handleFilterChange('date_to', e.target.value)}
                    placeholder="To Date"
                  />
                </Col>
                <Col md={1}>
                  <Button variant="outline-secondary" onClick={clearFilters}>
                    <i className="ri-refresh-line"></i>
                  </Button>
                </Col>
              </Row>

              {/* Reports Table */}
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Patient</th>
                      <th>Type</th>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Generated</th>
                      <th>AI Summary</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="8" className="text-center">
                          <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </td>
                      </tr>
                    ) : reports.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center text-muted">
                          No patient reports found
                        </td>
                      </tr>
                    ) : (
                      reports.map((report) => {
                        const statusConfig = statusOptions.find(s => s.value === report.status) || statusOptions[0];
                        return (
                          <tr key={report.id}>
                            <td>{report.id}</td>
                            <td>{report.patient_name || report.patient || 'N/A'}</td>
                            <td>{reportTypes.find(t => t.value === report.report_type)?.label || report.report_type}</td>
                            <td>{report.title || 'Untitled'}</td>
                            <td>
                              <Badge bg={statusConfig.variant}>
                                {statusConfig.label}
                              </Badge>
                            </td>
                            <td>{report.generated_at ? new Date(report.generated_at).toLocaleDateString() : 'N/A'}</td>
                            <td>
                              {report.ai_summary ? (
                                <i className="ri-check-line text-success"></i>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline-primary"
                                  onClick={() => handleGenerateAI(report.id)}
                                  disabled={loading}
                                >
                                  Generate
                                </Button>
                              )}
                            </td>
                            <td>
                              <div className="d-flex gap-1">
                                <Button
                                  size="sm"
                                  variant="info"
                                  onClick={() => openModal('view', report)}
                                  title="View"
                                >
                                  <i className="ri-eye-line"></i>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="warning"
                                  onClick={() => openModal('edit', report)}
                                  title="Edit"
                                >
                                  <i className="ri-edit-line"></i>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="success"
                                  onClick={() => handleSendReport(report.id)}
                                  disabled={loading || report.is_sent}
                                  title="Send Report"
                                >
                                  <i className="ri-mail-send-line"></i>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="danger"
                                  onClick={() => handleDelete(report.id)}
                                  disabled={loading}
                                  title="Delete"
                                >
                                  <i className="ri-delete-bin-line"></i>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal for Create/Edit/View */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === 'create' && 'Create Patient Report'}
            {modalMode === 'edit' && 'Edit Patient Report'}
            {modalMode === 'view' && 'View Patient Report'}
          </Modal.Title>
        </Modal.Header>
        
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Patient ID/Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.patient}
                    onChange={(e) => setFormData({...formData, patient: e.target.value})}
                    required
                    disabled={modalMode === 'view'}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Report Type</Form.Label>
                  <Form.Select
                    value={formData.report_type}
                    onChange={(e) => setFormData({...formData, report_type: e.target.value})}
                    required
                    disabled={modalMode === 'view'}
                  >
                    {reportTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                disabled={modalMode === 'view'}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                required
                disabled={modalMode === 'view'}
              />
            </Form.Group>

            {formData.ai_summary && (
              <Form.Group className="mb-3">
                <Form.Label>AI Summary</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.ai_summary}
                  readOnly
                  className="bg-light"
                />
              </Form.Group>
            )}

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    disabled={modalMode === 'view'}
                  >
                    {statusOptions.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6} className="d-flex align-items-end">
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Report Sent"
                    checked={formData.is_sent}
                    onChange={(e) => setFormData({...formData, is_sent: e.target.checked})}
                    disabled={modalMode === 'view'}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              {modalMode === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {modalMode !== 'view' && (
              <Button 
                type="submit" 
                variant="primary" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Saving...
                  </>
                ) : (
                  modalMode === 'create' ? 'Create Report' : 'Update Report'
                )}
              </Button>
            )}
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default PatientReportsCRUD;
