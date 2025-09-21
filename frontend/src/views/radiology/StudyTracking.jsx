import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, Modal, Tab, Nav, Alert, Badge, Table, InputGroup, ProgressBar } from 'react-bootstrap';
import Card from '../../components/Card';

const StudyTracking = () => {
    const [studies, setStudies] = useState([
        {
            id: 1,
            accessionNumber: 'ACC2025070001',
            patientMRN: 'MRN001234',
            patientName: 'John Smith',
            studyType: 'CT Chest with Contrast',
            orderDate: '2025-07-30',
            scheduledDate: '2025-07-31',
            actualDate: '2025-07-31',
            status: 'Completed',
            progress: 100,
            orderingPhysician: 'Dr. Sarah Wilson',
            technologist: 'Mike Johnson',
            radiologist: 'Dr. Robert Chen',
            urgency: 'Routine',
            location: 'CT-1',
            indication: 'Chest pain, r/o PE',
            reportStatus: 'Finalized',
            reportDate: '2025-07-31',
            findings: 'No acute findings. Normal chest CT.',
            criticalFindings: false
        },
        {
            id: 2,
            accessionNumber: 'ACC2025070002',
            patientMRN: 'MRN001235',
            patientName: 'Maria Garcia',
            studyType: 'MRI Brain without Contrast',
            orderDate: '2025-07-30',
            scheduledDate: '2025-08-01',
            actualDate: null,
            status: 'In Progress',
            progress: 60,
            orderingPhysician: 'Dr. James Miller',
            technologist: 'Lisa Chen',
            radiologist: 'Dr. Amanda Lee',
            urgency: 'Urgent',
            location: 'MRI-1',
            indication: 'Headaches, neurological symptoms',
            reportStatus: 'Pending',
            reportDate: null,
            findings: null,
            criticalFindings: false
        },
        {
            id: 3,
            accessionNumber: 'ACC2025070003',
            patientMRN: 'MRN001236',
            patientName: 'Robert Johnson',
            studyType: 'X-Ray Chest 2 Views',
            orderDate: '2025-07-31',
            scheduledDate: '2025-08-01',
            actualDate: null,
            status: 'Scheduled',
            progress: 25,
            orderingPhysician: 'Dr. Emily Davis',
            technologist: 'Tom Anderson',
            radiologist: 'Dr. Michael Brown',
            urgency: 'Routine',
            location: 'X-RAY-1',
            indication: 'Post-operative follow-up',
            reportStatus: 'Not Started',
            reportDate: null,
            findings: null,
            criticalFindings: false
        },
        {
            id: 4,
            accessionNumber: 'ACC2025070004',
            patientMRN: 'MRN001237',
            patientName: 'Emily Davis',
            studyType: 'CT Abdomen/Pelvis with Contrast',
            orderDate: '2025-07-31',
            scheduledDate: '2025-08-01',
            actualDate: '2025-08-01',
            status: 'Under Review',
            progress: 85,
            orderingPhysician: 'Dr. David Kim',
            technologist: 'Sarah Johnson',
            radiologist: 'Dr. Robert Chen',
            urgency: 'Stat',
            location: 'CT-2',
            indication: 'Abdominal pain, acute onset',
            reportStatus: 'Preliminary',
            reportDate: '2025-08-01',
            findings: 'Acute appendicitis. Recommend surgical consultation.',
            criticalFindings: true
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [urgencyFilter, setUrgencyFilter] = useState('All');
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedStudy, setSelectedStudy] = useState(null);
    const [showReportModal, setShowReportModal] = useState(false);

    const statusOptions = ['All', 'Scheduled', 'In Progress', 'Completed', 'Under Review', 'Cancelled'];
    const urgencyOptions = ['All', 'Routine', 'Urgent', 'Stat'];

    const filteredStudies = studies.filter(study => {
        const matchesSearch = 
            study.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            study.accessionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            study.patientMRN.toLowerCase().includes(searchTerm.toLowerCase()) ||
            study.studyType.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'All' || study.status === statusFilter;
        const matchesUrgency = urgencyFilter === 'All' || study.urgency === urgencyFilter;
        
        return matchesSearch && matchesStatus && matchesUrgency;
    });

    const getStatusBadge = (status) => {
        const colors = {
            'Scheduled': 'primary',
            'In Progress': 'warning',
            'Completed': 'success',
            'Under Review': 'info',
            'Cancelled': 'danger'
        };
        return <Badge bg={colors[status] || 'secondary'}>{status}</Badge>;
    };

    const getUrgencyBadge = (urgency) => {
        const colors = {
            'Routine': 'secondary',
            'Urgent': 'warning',
            'Stat': 'danger'
        };
        return <Badge bg={colors[urgency] || 'secondary'}>{urgency}</Badge>;
    };

    const getReportStatusBadge = (reportStatus) => {
        const colors = {
            'Not Started': 'secondary',
            'Pending': 'warning',
            'Preliminary': 'info',
            'Finalized': 'success'
        };
        return <Badge bg={colors[reportStatus] || 'secondary'}>{reportStatus}</Badge>;
    };

    const getProgressVariant = (progress) => {
        if (progress < 30) return 'danger';
        if (progress < 70) return 'warning';
        return 'success';
    };

    const handleViewDetails = (study) => {
        setSelectedStudy(study);
        setShowDetailsModal(true);
    };

    const handleViewReport = (study) => {
        setSelectedStudy(study);
        setShowReportModal(true);
    };

    const updateStudyStatus = (studyId, newStatus, newProgress) => {
        setStudies(studies.map(study =>
            study.id === studyId 
                ? { ...study, status: newStatus, progress: newProgress }
                : study
        ));
    };

    return (
        <Container fluid>
            <Row className="justify-content-center">
                <Col lg={12}>
                    {/* Header */}
                    <Card className="mb-4 border-0 shadow-sm">
                        <Card.Header className="bg-primary text-white">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h3 className="mb-0">
                                        <i className="ri-search-eye-line me-2"></i>
                                        Study Tracking & Workflow
                                    </h3>
                                    <p className="mb-0 opacity-75">Monitor imaging studies from order to final report</p>
                                </div>
                                <div className="d-flex gap-2">
                                    <Badge bg="light" text="dark">{studies.length} Total Studies</Badge>
                                    <Badge bg="danger" text="white">
                                        {studies.filter(s => s.criticalFindings).length} Critical
                                    </Badge>
                                </div>
                            </div>
                        </Card.Header>
                    </Card>

                    {/* Search and Filters */}
                    <Card className="mb-4 border-0 shadow-sm">
                        <Card.Body>
                            <Row className="align-items-center">
                                <Col lg={6}>
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <i className="ri-search-line"></i>
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            placeholder="Search by patient name, MRN, accession number..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </InputGroup>
                                </Col>
                                <Col lg={6}>
                                    <Row>
                                        <Col md={4}>
                                            <Form.Select
                                                value={statusFilter}
                                                onChange={(e) => setStatusFilter(e.target.value)}
                                                size="sm"
                                            >
                                                {statusOptions.map(status => (
                                                    <option key={status} value={status}>{status}</option>
                                                ))}
                                            </Form.Select>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Select
                                                value={urgencyFilter}
                                                onChange={(e) => setUrgencyFilter(e.target.value)}
                                                size="sm"
                                            >
                                                {urgencyOptions.map(urgency => (
                                                    <option key={urgency} value={urgency}>{urgency}</option>
                                                ))}
                                            </Form.Select>
                                        </Col>
                                        <Col md={4}>
                                            <Button variant="outline-success" size="sm" className="w-100">
                                                <i className="ri-download-line me-1"></i>
                                                Export
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* Quick Stats */}
                    <Row className="mb-4">
                        <Col lg={3}>
                            <Card className="border-0 shadow-sm text-center">
                                <Card.Body>
                                    <div className="text-primary fs-2 fw-bold">
                                        {studies.filter(s => s.status === 'Scheduled').length}
                                    </div>
                                    <div className="text-muted">Scheduled</div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={3}>
                            <Card className="border-0 shadow-sm text-center">
                                <Card.Body>
                                    <div className="text-warning fs-2 fw-bold">
                                        {studies.filter(s => s.status === 'In Progress').length}
                                    </div>
                                    <div className="text-muted">In Progress</div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={3}>
                            <Card className="border-0 shadow-sm text-center">
                                <Card.Body>
                                    <div className="text-info fs-2 fw-bold">
                                        {studies.filter(s => s.status === 'Under Review').length}
                                    </div>
                                    <div className="text-muted">Under Review</div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={3}>
                            <Card className="border-0 shadow-sm text-center">
                                <Card.Body>
                                    <div className="text-success fs-2 fw-bold">
                                        {studies.filter(s => s.status === 'Completed').length}
                                    </div>
                                    <div className="text-muted">Completed</div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Studies List */}
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-light">
                            <h5 className="mb-0">
                                <i className="ri-list-check me-2 text-primary"></i>
                                Study Worklist
                            </h5>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <Table striped hover className="mb-0">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Accession #</th>
                                            <th>Patient</th>
                                            <th>Study Type</th>
                                            <th>Urgency</th>
                                            <th>Status</th>
                                            <th>Progress</th>
                                            <th>Report</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredStudies.map((study) => (
                                            <tr key={study.id} className={study.criticalFindings ? 'table-danger' : ''}>
                                                <td>
                                                    <code className="bg-light p-1 rounded">{study.accessionNumber}</code>
                                                    <br />
                                                    <small className="text-muted">{study.orderDate}</small>
                                                </td>
                                                <td>
                                                    <div>
                                                        <strong>{study.patientName}</strong>
                                                        {study.criticalFindings && (
                                                            <i className="ri-alarm-warning-line text-danger ms-2" title="Critical Findings"></i>
                                                        )}
                                                    </div>
                                                    <small className="text-muted">{study.patientMRN}</small>
                                                </td>
                                                <td>
                                                    <div>{study.studyType}</div>
                                                    <small className="text-muted">{study.location}</small>
                                                </td>
                                                <td>{getUrgencyBadge(study.urgency)}</td>
                                                <td>{getStatusBadge(study.status)}</td>
                                                <td>
                                                    <ProgressBar 
                                                        now={study.progress} 
                                                        variant={getProgressVariant(study.progress)}
                                                        style={{ height: '8px' }}
                                                    />
                                                    <small className="text-muted">{study.progress}%</small>
                                                </td>
                                                <td>{getReportStatusBadge(study.reportStatus)}</td>
                                                <td>
                                                    <div className="d-flex gap-1">
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            onClick={() => handleViewDetails(study)}
                                                        >
                                                            <i className="ri-eye-line"></i>
                                                        </Button>
                                                        {study.reportStatus !== 'Not Started' && (
                                                            <Button
                                                                variant="outline-success"
                                                                size="sm"
                                                                onClick={() => handleViewReport(study)}
                                                            >
                                                                <i className="ri-file-text-line"></i>
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="outline-warning"
                                                            size="sm"
                                                        >
                                                            <i className="ri-edit-line"></i>
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                            {filteredStudies.length === 0 && (
                                <div className="text-center py-5">
                                    <i className="ri-search-eye-line fs-1 text-muted"></i>
                                    <h5 className="text-muted mt-3">No studies found</h5>
                                    <p className="text-muted">No studies match your current filters.</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Study Details Modal */}
            <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="ri-information-line me-2"></i>
                        Study Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedStudy && (
                        <div>
                            <Row>
                                <Col md={6}>
                                    <Card className="h-100">
                                        <Card.Header className="bg-primary text-white">
                                            <h6 className="mb-0">Study Information</h6>
                                        </Card.Header>
                                        <Card.Body>
                                            <Table borderless size="sm">
                                                <tbody>
                                                    <tr>
                                                        <td><strong>Accession #:</strong></td>
                                                        <td><code>{selectedStudy.accessionNumber}</code></td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Study Type:</strong></td>
                                                        <td>{selectedStudy.studyType}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Order Date:</strong></td>
                                                        <td>{selectedStudy.orderDate}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Scheduled:</strong></td>
                                                        <td>{selectedStudy.scheduledDate}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Actual Date:</strong></td>
                                                        <td>{selectedStudy.actualDate || 'Pending'}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Location:</strong></td>
                                                        <td><Badge bg="info">{selectedStudy.location}</Badge></td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6}>
                                    <Card className="h-100">
                                        <Card.Header className="bg-success text-white">
                                            <h6 className="mb-0">Clinical Information</h6>
                                        </Card.Header>
                                        <Card.Body>
                                            <Table borderless size="sm">
                                                <tbody>
                                                    <tr>
                                                        <td><strong>Patient:</strong></td>
                                                        <td>{selectedStudy.patientName}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>MRN:</strong></td>
                                                        <td><code>{selectedStudy.patientMRN}</code></td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Ordering MD:</strong></td>
                                                        <td>{selectedStudy.orderingPhysician}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Indication:</strong></td>
                                                        <td>{selectedStudy.indication}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Urgency:</strong></td>
                                                        <td>{getUrgencyBadge(selectedStudy.urgency)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Status:</strong></td>
                                                        <td>{getStatusBadge(selectedStudy.status)}</td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            <Card className="mt-3">
                                <Card.Header className="bg-info text-white">
                                    <h6 className="mb-0">Workflow Progress</h6>
                                </Card.Header>
                                <Card.Body>
                                    <ProgressBar now={selectedStudy.progress} className="mb-3" style={{ height: '20px' }}>
                                        <span className="fw-bold">{selectedStudy.progress}% Complete</span>
                                    </ProgressBar>
                                    
                                    <Row>
                                        <Col md={6}>
                                            <h6 className="text-primary">Staff Assignments</h6>
                                            <ul className="list-unstyled">
                                                <li><strong>Technologist:</strong> {selectedStudy.technologist}</li>
                                                <li><strong>Radiologist:</strong> {selectedStudy.radiologist}</li>
                                            </ul>
                                        </Col>
                                        <Col md={6}>
                                            <h6 className="text-primary">Report Status</h6>
                                            <div className="mb-2">
                                                {getReportStatusBadge(selectedStudy.reportStatus)}
                                            </div>
                                            {selectedStudy.reportDate && (
                                                <div><strong>Report Date:</strong> {selectedStudy.reportDate}</div>
                                            )}
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowDetailsModal(false)}>
                        Close
                    </Button>
                    {selectedStudy && selectedStudy.reportStatus !== 'Not Started' && (
                        <Button variant="primary" onClick={() => handleViewReport(selectedStudy)}>
                            <i className="ri-file-text-line me-1"></i>
                            View Report
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>

            {/* Report Modal */}
            <Modal show={showReportModal} onHide={() => setShowReportModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="ri-file-text-line me-2"></i>
                        Radiology Report
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedStudy && (
                        <div>
                            <Card className="mb-3">
                                <Card.Header className="bg-light">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h6 className="mb-0">Report Header</h6>
                                        {selectedStudy.criticalFindings && (
                                            <Badge bg="danger">
                                                <i className="ri-alarm-warning-line me-1"></i>
                                                Critical Findings
                                            </Badge>
                                        )}
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col md={6}>
                                            <strong>Patient:</strong> {selectedStudy.patientName}<br />
                                            <strong>MRN:</strong> {selectedStudy.patientMRN}<br />
                                            <strong>Study:</strong> {selectedStudy.studyType}
                                        </Col>
                                        <Col md={6}>
                                            <strong>Accession:</strong> {selectedStudy.accessionNumber}<br />
                                            <strong>Date:</strong> {selectedStudy.actualDate || selectedStudy.scheduledDate}<br />
                                            <strong>Radiologist:</strong> {selectedStudy.radiologist}
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                            <Card>
                                <Card.Header className="bg-primary text-white">
                                    <h6 className="mb-0">Findings</h6>
                                </Card.Header>
                                <Card.Body>
                                    {selectedStudy.findings ? (
                                        <div>
                                            <Alert variant={selectedStudy.criticalFindings ? 'danger' : 'info'}>
                                                {selectedStudy.findings}
                                            </Alert>
                                            
                                            <div className="mt-3">
                                                <strong>Report Status:</strong> {getReportStatusBadge(selectedStudy.reportStatus)}
                                                {selectedStudy.reportDate && (
                                                    <span className="ms-3">
                                                        <strong>Finalized:</strong> {selectedStudy.reportDate}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <Alert variant="warning">
                                            <i className="ri-time-line me-2"></i>
                                            Report is pending. Images are being reviewed by the radiologist.
                                        </Alert>
                                    )}
                                </Card.Body>
                            </Card>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowReportModal(false)}>
                        Close
                    </Button>
                    <Button variant="outline-primary">
                        <i className="ri-printer-line me-1"></i>
                        Print Report
                    </Button>
                    <Button variant="primary">
                        <i className="ri-download-line me-1"></i>
                        Download PDF
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default StudyTracking;
