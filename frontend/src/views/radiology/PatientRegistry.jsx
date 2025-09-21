import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, Modal, Tab, Nav, Alert, Badge, Table, InputGroup } from 'react-bootstrap';
import Card from '../../components/Card';

const PatientRegistry = () => {
    const [patients, setPatients] = useState([
        {
            id: 1,
            mrn: 'MRN001234',
            name: 'John Smith',
            dob: '1985-03-15',
            gender: 'Male',
            phone: '(555) 123-4567',
            email: 'john.smith@email.com',
            insurance: 'Blue Cross Blue Shield',
            lastVisit: '2025-01-15',
            status: 'Active',
            allergies: 'None known',
            emergencyContact: 'Jane Smith - (555) 123-4568'
        },
        {
            id: 2,
            mrn: 'MRN001235',
            name: 'Maria Garcia',
            dob: '1978-08-22',
            gender: 'Female',
            phone: '(555) 234-5678',
            email: 'maria.garcia@email.com',
            insurance: 'Aetna',
            lastVisit: '2025-01-20',
            status: 'Active',
            allergies: 'Iodine contrast',
            emergencyContact: 'Carlos Garcia - (555) 234-5679'
        },
        {
            id: 3,
            mrn: 'MRN001236',
            name: 'Robert Johnson',
            dob: '1965-12-08',
            gender: 'Male',
            phone: '(555) 345-6789',
            email: 'robert.johnson@email.com',
            insurance: 'Medicare',
            lastVisit: '2025-01-18',
            status: 'Active',
            allergies: 'Shellfish, Gadolinium',
            emergencyContact: 'Susan Johnson - (555) 345-6790'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [formData, setFormData] = useState({
        mrn: '',
        name: '',
        dob: '',
        gender: '',
        phone: '',
        email: '',
        insurance: '',
        allergies: '',
        emergencyContact: ''
    });

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm)
    );

    const handleAddPatient = () => {
        const newPatient = {
            id: patients.length + 1,
            ...formData,
            lastVisit: new Date().toISOString().split('T')[0],
            status: 'Active'
        };
        setPatients([...patients, newPatient]);
        setShowAddModal(false);
        resetForm();
    };

    const handleEditPatient = () => {
        setPatients(patients.map(patient =>
            patient.id === selectedPatient.id ? { ...patient, ...formData } : patient
        ));
        setShowEditModal(false);
        setSelectedPatient(null);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            mrn: '',
            name: '',
            dob: '',
            gender: '',
            phone: '',
            email: '',
            insurance: '',
            allergies: '',
            emergencyContact: ''
        });
    };

    const handleViewDetails = (patient) => {
        setSelectedPatient(patient);
        setShowDetailModal(true);
    };

    const handleEdit = (patient) => {
        setSelectedPatient(patient);
        setFormData({
            mrn: patient.mrn,
            name: patient.name,
            dob: patient.dob,
            gender: patient.gender,
            phone: patient.phone,
            email: patient.email,
            insurance: patient.insurance,
            allergies: patient.allergies,
            emergencyContact: patient.emergencyContact
        });
        setShowEditModal(true);
    };

    const getStatusBadge = (status) => {
        const colors = {
            'Active': 'success',
            'Inactive': 'secondary',
            'Pending': 'warning'
        };
        return <Badge bg={colors[status] || 'primary'}>{status}</Badge>;
    };

    const renderPatientForm = (isEdit = false) => (
        <Form>
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Medical Record Number (MRN)</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.mrn}
                            onChange={(e) => setFormData(prev => ({ ...prev, mrn: e.target.value }))}
                            placeholder="Enter MRN"
                            disabled={isEdit}
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter full name"
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control
                            type="date"
                            value={formData.dob}
                            onChange={(e) => setFormData(prev => ({ ...prev, dob: e.target.value }))}
                        />
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>Gender</Form.Label>
                        <Form.Select
                            value={formData.gender}
                            onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                        >
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="(555) 123-4567"
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="patient@email.com"
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Insurance Provider</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.insurance}
                            onChange={(e) => setFormData(prev => ({ ...prev, insurance: e.target.value }))}
                            placeholder="Insurance provider"
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Known Allergies</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            value={formData.allergies}
                            onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))}
                            placeholder="List any known allergies"
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Emergency Contact</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.emergencyContact}
                            onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                            placeholder="Name - Phone Number"
                        />
                    </Form.Group>
                </Col>
            </Row>
        </Form>
    );

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
                                        <i className="ri-user-heart-line me-2"></i>
                                        Patient Registry
                                    </h3>
                                    <p className="mb-0 opacity-75">Comprehensive patient information management</p>
                                </div>
                                <div className="d-flex gap-2">
                                    <Badge bg="light" text="dark">{patients.length} Patients</Badge>
                                    <Button 
                                        variant="light" 
                                        size="sm"
                                        onClick={() => setShowAddModal(true)}
                                    >
                                        <i className="ri-add-line me-1"></i>
                                        Add Patient
                                    </Button>
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
                                            placeholder="Search by name, MRN, or phone..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </InputGroup>
                                </Col>
                                <Col lg={6} className="text-end">
                                    <Button variant="outline-primary" className="me-2">
                                        <i className="ri-filter-line me-1"></i>
                                        Filters
                                    </Button>
                                    <Button variant="outline-success">
                                        <i className="ri-download-line me-1"></i>
                                        Export
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* Patient List */}
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-light">
                            <h5 className="mb-0">
                                <i className="ri-list-check me-2 text-primary"></i>
                                Patient Directory
                            </h5>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <Table striped hover className="mb-0">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>MRN</th>
                                            <th>Patient Name</th>
                                            <th>DOB</th>
                                            <th>Contact</th>
                                            <th>Insurance</th>
                                            <th>Last Visit</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredPatients.map((patient) => (
                                            <tr key={patient.id}>
                                                <td>
                                                    <code className="bg-light p-1 rounded">{patient.mrn}</code>
                                                </td>
                                                <td>
                                                    <strong>{patient.name}</strong>
                                                    <br />
                                                    <small className="text-muted">{patient.gender}</small>
                                                </td>
                                                <td>{new Date(patient.dob).toLocaleDateString()}</td>
                                                <td>
                                                    <div>{patient.phone}</div>
                                                    <small className="text-muted">{patient.email}</small>
                                                </td>
                                                <td>{patient.insurance}</td>
                                                <td>{new Date(patient.lastVisit).toLocaleDateString()}</td>
                                                <td>{getStatusBadge(patient.status)}</td>
                                                <td>
                                                    <div className="d-flex gap-1">
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            onClick={() => handleViewDetails(patient)}
                                                        >
                                                            <i className="ri-eye-line"></i>
                                                        </Button>
                                                        <Button
                                                            variant="outline-secondary"
                                                            size="sm"
                                                            onClick={() => handleEdit(patient)}
                                                        >
                                                            <i className="ri-edit-line"></i>
                                                        </Button>
                                                        <Button
                                                            variant="outline-success"
                                                            size="sm"
                                                        >
                                                            <i className="ri-calendar-line"></i>
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                        <Card.Footer className="bg-light">
                            <div className="d-flex justify-content-between align-items-center">
                                <small className="text-muted">
                                    Showing {filteredPatients.length} of {patients.length} patients
                                </small>
                                <div>
                                    <Button variant="outline-primary" size="sm" className="me-2">Previous</Button>
                                    <Button variant="outline-primary" size="sm">Next</Button>
                                </div>
                            </div>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>

            {/* Add Patient Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="ri-user-add-line me-2"></i>
                        Add New Patient
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {renderPatientForm()}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowAddModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleAddPatient}>
                        <i className="ri-save-line me-1"></i>
                        Add Patient
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Patient Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="ri-edit-line me-2"></i>
                        Edit Patient Information
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {renderPatientForm(true)}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowEditModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleEditPatient}>
                        <i className="ri-save-line me-1"></i>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Patient Details Modal */}
            <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="ri-user-line me-2"></i>
                        Patient Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedPatient && (
                        <div>
                            <Row>
                                <Col md={6}>
                                    <Card className="h-100">
                                        <Card.Header className="bg-primary text-white">
                                            <h6 className="mb-0">Personal Information</h6>
                                        </Card.Header>
                                        <Card.Body>
                                            <Table borderless size="sm">
                                                <tbody>
                                                    <tr>
                                                        <td><strong>MRN:</strong></td>
                                                        <td><code>{selectedPatient.mrn}</code></td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Name:</strong></td>
                                                        <td>{selectedPatient.name}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>DOB:</strong></td>
                                                        <td>{new Date(selectedPatient.dob).toLocaleDateString()}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Gender:</strong></td>
                                                        <td>{selectedPatient.gender}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Status:</strong></td>
                                                        <td>{getStatusBadge(selectedPatient.status)}</td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6}>
                                    <Card className="h-100">
                                        <Card.Header className="bg-success text-white">
                                            <h6 className="mb-0">Contact & Insurance</h6>
                                        </Card.Header>
                                        <Card.Body>
                                            <Table borderless size="sm">
                                                <tbody>
                                                    <tr>
                                                        <td><strong>Phone:</strong></td>
                                                        <td>{selectedPatient.phone}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Email:</strong></td>
                                                        <td>{selectedPatient.email}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Insurance:</strong></td>
                                                        <td>{selectedPatient.insurance}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Emergency:</strong></td>
                                                        <td>{selectedPatient.emergencyContact}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Last Visit:</strong></td>
                                                        <td>{new Date(selectedPatient.lastVisit).toLocaleDateString()}</td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                            
                            <Card className="mt-3">
                                <Card.Header className="bg-warning text-dark">
                                    <h6 className="mb-0">
                                        <i className="ri-alert-line me-2"></i>
                                        Allergies & Medical Alerts
                                    </h6>
                                </Card.Header>
                                <Card.Body>
                                    <Alert variant="warning">
                                        <strong>Allergies:</strong> {selectedPatient.allergies || 'None known'}
                                    </Alert>
                                </Card.Body>
                            </Card>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowDetailModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleEdit(selectedPatient)}>
                        <i className="ri-edit-line me-1"></i>
                        Edit Patient
                    </Button>
                    <Button variant="success">
                        <i className="ri-calendar-line me-1"></i>
                        Schedule Imaging
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default PatientRegistry;
