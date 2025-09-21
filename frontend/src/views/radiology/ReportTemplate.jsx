import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, Modal, Tab, Nav, Alert, Badge } from 'react-bootstrap';
import Card from '../../components/Card';

const ReportTemplate = () => {
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [generatedReport, setGeneratedReport] = useState('');
    const [patientData, setPatientData] = useState({
        patientId: '',
        studyType: '',
        clinicalHistory: '',
        findings: '',
        impression: ''
    });

    const reportTemplates = [
        {
            id: 'chest-xray',
            name: 'Chest X-Ray',
            category: 'Radiography',
            icon: 'ri-lungs-line',
            fields: ['Clinical History', 'Technique', 'Findings', 'Impression']
        },
        {
            id: 'ct-chest',
            name: 'CT Chest',
            category: 'CT',
            icon: 'ri-body-scan-line',
            fields: ['Clinical History', 'Technique', 'Contrast', 'Findings', 'Impression']
        },
        {
            id: 'mri-brain',
            name: 'MRI Brain',
            category: 'MRI',
            icon: 'ri-brain-line',
            fields: ['Clinical History', 'Sequences', 'Contrast', 'Findings', 'Impression']
        },
        {
            id: 'ultrasound-abdomen',
            name: 'Ultrasound Abdomen',
            category: 'Ultrasound',
            icon: 'ri-sound-module-line',
            fields: ['Clinical History', 'Technique', 'Findings', 'Impression']
        },
        {
            id: 'mammography',
            name: 'Mammography',
            category: 'Mammography',
            icon: 'ri-heart-pulse-line',
            fields: ['Clinical History', 'Technique', 'BI-RADS', 'Findings', 'Impression']
        },
        {
            id: 'bone-xray',
            name: 'Bone X-Ray',
            category: 'Radiography',
            icon: 'ri-bone-line',
            fields: ['Clinical History', 'Views', 'Findings', 'Impression']
        }
    ];

    const handleTemplateSelect = (templateId) => {
        setSelectedTemplate(templateId);
        const template = reportTemplates.find(t => t.id === templateId);
        setPatientData(prev => ({ ...prev, studyType: template.name }));
    };

    const generateReport = () => {
        const template = reportTemplates.find(t => t.id === selectedTemplate);
        let report = `RADIOLOGY REPORT\n\n`;
        report += `Patient ID: ${patientData.patientId}\n`;
        report += `Study Type: ${template.name}\n`;
        report += `Date: ${new Date().toLocaleDateString()}\n\n`;
        report += `CLINICAL HISTORY:\n${patientData.clinicalHistory}\n\n`;
        report += `TECHNIQUE:\nStandard ${template.name} protocol\n\n`;
        report += `FINDINGS:\n${patientData.findings}\n\n`;
        report += `IMPRESSION:\n${patientData.impression}\n\n`;
        report += `Electronically signed by: [Radiologist Name]\nDate: ${new Date().toLocaleString()}`;
        
        setGeneratedReport(report);
        setShowPreview(true);
    };

    const getCurrentTemplate = () => {
        return reportTemplates.find(t => t.id === selectedTemplate);
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
                                        <i className="ri-file-text-line me-2"></i>
                                        Clinical Report Templates
                                    </h3>
                                    <p className="mb-0 opacity-75">Standardized templates for radiology reporting</p>
                                </div>
                                <Badge bg="light" text="dark">Professional</Badge>
                            </div>
                        </Card.Header>
                    </Card>

                    <Row>
                        {/* Template Selection */}
                        <Col lg={4}>
                            <Card className="mb-4 border-0 shadow-sm">
                                <Card.Header className="bg-light">
                                    <h5 className="mb-0">
                                        <i className="ri-list-check me-2 text-primary"></i>
                                        Select Template
                                    </h5>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    {reportTemplates.map((template) => (
                                        <div
                                            key={template.id}
                                            className={`p-3 border-bottom cursor-pointer ${
                                                selectedTemplate === template.id ? 'bg-primary text-white' : ''
                                            }`}
                                            onClick={() => handleTemplateSelect(template.id)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className="d-flex align-items-center">
                                                <i className={`${template.icon} fs-4 me-3`}></i>
                                                <div>
                                                    <h6 className="mb-1">{template.name}</h6>
                                                    <small className={selectedTemplate === template.id ? 'opacity-75' : 'text-muted'}>
                                                        {template.category}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Report Form */}
                        <Col lg={8}>
                            {selectedTemplate ? (
                                <Card className="mb-4 border-0 shadow-sm">
                                    <Card.Header className="bg-success text-white">
                                        <h5 className="mb-0">
                                            <i className="ri-edit-line me-2"></i>
                                            {getCurrentTemplate()?.name} Report
                                        </h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <Form>
                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Patient ID</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            value={patientData.patientId}
                                                            onChange={(e) => setPatientData(prev => ({ ...prev, patientId: e.target.value }))}
                                                            placeholder="Enter patient ID"
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Study Type</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            value={patientData.studyType}
                                                            readOnly
                                                            className="bg-light"
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Clinical History</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    value={patientData.clinicalHistory}
                                                    onChange={(e) => setPatientData(prev => ({ ...prev, clinicalHistory: e.target.value }))}
                                                    placeholder="Enter clinical history and indication for study"
                                                />
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Findings</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={4}
                                                    value={patientData.findings}
                                                    onChange={(e) => setPatientData(prev => ({ ...prev, findings: e.target.value }))}
                                                    placeholder="Describe radiological findings"
                                                />
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Impression</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={2}
                                                    value={patientData.impression}
                                                    onChange={(e) => setPatientData(prev => ({ ...prev, impression: e.target.value }))}
                                                    placeholder="Clinical impression and recommendations"
                                                />
                                            </Form.Group>

                                            <div className="d-flex gap-2">
                                                <Button
                                                    variant="primary"
                                                    onClick={generateReport}
                                                    disabled={!patientData.patientId || !patientData.clinicalHistory}
                                                >
                                                    <i className="ri-file-download-line me-1"></i>
                                                    Generate Report
                                                </Button>
                                                <Button variant="outline-secondary">
                                                    <i className="ri-save-line me-1"></i>
                                                    Save Draft
                                                </Button>
                                            </div>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            ) : (
                                <Card className="mb-4 border-0 shadow-sm">
                                    <Card.Body className="text-center py-5">
                                        <i className="ri-file-text-line fs-1 text-muted mb-3"></i>
                                        <h5 className="text-muted mb-2">Select a Template</h5>
                                        <p className="text-muted">Choose a report template from the left panel to get started</p>
                                    </Card.Body>
                                </Card>
                            )}
                        </Col>
                    </Row>
                </Col>
            </Row>

            {/* Report Preview Modal */}
            <Modal show={showPreview} onHide={() => setShowPreview(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="ri-eye-line me-2"></i>
                        Report Preview
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="bg-light p-3 rounded">
                        <pre className="mb-0" style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                            {generatedReport}
                        </pre>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowPreview(false)}>
                        Close
                    </Button>
                    <Button variant="primary">
                        <i className="ri-download-line me-1"></i>
                        Export Report
                    </Button>
                    <Button variant="success">
                        <i className="ri-send-plane-line me-1"></i>
                        Send Report
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ReportTemplate;
