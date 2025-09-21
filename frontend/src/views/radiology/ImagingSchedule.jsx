import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, Modal, Tab, Nav, Alert, Badge, Table, InputGroup, Card as BootstrapCard } from 'react-bootstrap';
import Card from '../../components/Card';

const ImagingSchedule = () => {
    const [appointments, setAppointments] = useState([
        {
            id: 1,
            patientMRN: 'MRN001234',
            patientName: 'John Smith',
            studyType: 'CT Chest with Contrast',
            date: '2025-07-31',
            time: '09:00',
            duration: 30,
            status: 'Scheduled',
            room: 'CT-1',
            technologist: 'Sarah Johnson',
            priority: 'Routine',
            contrast: true,
            prep: 'NPO 4 hours prior',
            notes: 'Patient has claustrophobia - premedicate if needed'
        },
        {
            id: 2,
            patientMRN: 'MRN001235',
            patientName: 'Maria Garcia',
            studyType: 'Mammography Bilateral',
            date: '2025-07-31',
            time: '10:30',
            duration: 20,
            status: 'Confirmed',
            room: 'MAMMO-1',
            technologist: 'Lisa Chen',
            priority: 'Routine',
            contrast: false,
            prep: 'No deodorant or powder',
            notes: 'Previous abnormal screening - callback'
        },
        {
            id: 3,
            patientMRN: 'MRN001236',
            patientName: 'Robert Johnson',
            studyType: 'MRI Brain without Contrast',
            date: '2025-07-31',
            time: '14:00',
            duration: 45,
            status: 'In Progress',
            room: 'MRI-1',
            technologist: 'Mike Wilson',
            priority: 'Urgent',
            contrast: false,
            prep: 'Metal screening completed',
            notes: 'Recent headaches - r/o mass'
        },
        {
            id: 4,
            patientMRN: 'MRN001237',
            patientName: 'Emily Davis',
            studyType: 'X-Ray Chest 2 Views',
            date: '2025-08-01',
            time: '08:00',
            duration: 15,
            status: 'Scheduled',
            room: 'X-RAY-1',
            technologist: 'Tom Anderson',
            priority: 'Routine',
            contrast: false,
            prep: 'Remove jewelry',
            notes: 'Post-operative follow-up'
        }
    ]);

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [formData, setFormData] = useState({
        patientMRN: '',
        patientName: '',
        studyType: '',
        date: '',
        time: '',
        duration: 30,
        room: '',
        technologist: '',
        priority: 'Routine',
        contrast: false,
        prep: '',
        notes: ''
    });

    const studyTypes = [
        'X-Ray Chest 2 Views',
        'CT Chest with Contrast',
        'CT Chest without Contrast',
        'CT Abdomen/Pelvis with Contrast',
        'MRI Brain without Contrast',
        'MRI Brain with Contrast',
        'MRI Lumbar Spine',
        'Mammography Bilateral',
        'Mammography Unilateral',
        'Ultrasound Abdomen',
        'Ultrasound Pelvis',
        'DEXA Scan',
        'Nuclear Medicine Bone Scan'
    ];

    const rooms = ['CT-1', 'CT-2', 'MRI-1', 'MRI-2', 'X-RAY-1', 'X-RAY-2', 'MAMMO-1', 'US-1', 'US-2', 'NM-1'];
    const technologists = ['Sarah Johnson', 'Lisa Chen', 'Mike Wilson', 'Tom Anderson', 'Jennifer Lopez', 'David Kim'];

    const filteredAppointments = appointments.filter(apt => apt.date === selectedDate);

    const getStatusBadge = (status) => {
        const colors = {
            'Scheduled': 'primary',
            'Confirmed': 'success',
            'In Progress': 'warning',
            'Completed': 'success',
            'Cancelled': 'danger',
            'No Show': 'secondary'
        };
        return <Badge bg={colors[status] || 'primary'}>{status}</Badge>;
    };

    const getPriorityBadge = (priority) => {
        const colors = {
            'Routine': 'secondary',
            'Urgent': 'warning',
            'Stat': 'danger'
        };
        return <Badge bg={colors[priority] || 'secondary'}>{priority}</Badge>;
    };

    const handleAddAppointment = () => {
        const newAppointment = {
            id: appointments.length + 1,
            ...formData,
            status: 'Scheduled'
        };
        setAppointments([...appointments, newAppointment]);
        setShowAddModal(false);
        resetForm();
    };

    const handleEditAppointment = () => {
        setAppointments(appointments.map(apt =>
            apt.id === selectedAppointment.id ? { ...apt, ...formData } : apt
        ));
        setShowEditModal(false);
        setSelectedAppointment(null);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            patientMRN: '',
            patientName: '',
            studyType: '',
            date: '',
            time: '',
            duration: 30,
            room: '',
            technologist: '',
            priority: 'Routine',
            contrast: false,
            prep: '',
            notes: ''
        });
    };

    const handleEdit = (appointment) => {
        setSelectedAppointment(appointment);
        setFormData({
            patientMRN: appointment.patientMRN,
            patientName: appointment.patientName,
            studyType: appointment.studyType,
            date: appointment.date,
            time: appointment.time,
            duration: appointment.duration,
            room: appointment.room,
            technologist: appointment.technologist,
            priority: appointment.priority,
            contrast: appointment.contrast,
            prep: appointment.prep,
            notes: appointment.notes
        });
        setShowEditModal(true);
    };

    const updateStatus = (appointmentId, newStatus) => {
        setAppointments(appointments.map(apt =>
            apt.id === appointmentId ? { ...apt, status: newStatus } : apt
        ));
    };

    const renderAppointmentForm = () => (
        <Form>
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Patient MRN</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.patientMRN}
                            onChange={(e) => setFormData(prev => ({ ...prev, patientMRN: e.target.value }))}
                            placeholder="Enter MRN"
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Patient Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.patientName}
                            onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
                            placeholder="Enter patient name"
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={8}>
                    <Form.Group className="mb-3">
                        <Form.Label>Study Type</Form.Label>
                        <Form.Select
                            value={formData.studyType}
                            onChange={(e) => setFormData(prev => ({ ...prev, studyType: e.target.value }))}
                        >
                            <option value="">Select study type</option>
                            {studyTypes.map(study => (
                                <option key={study} value={study}>{study}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>Priority</Form.Label>
                        <Form.Select
                            value={formData.priority}
                            onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                        >
                            <option value="Routine">Routine</option>
                            <option value="Urgent">Urgent</option>
                            <option value="Stat">Stat</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        />
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>Time</Form.Label>
                        <Form.Control
                            type="time"
                            value={formData.time}
                            onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                        />
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>Duration (minutes)</Form.Label>
                        <Form.Control
                            type="number"
                            value={formData.duration}
                            onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                            min="5"
                            max="120"
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Room</Form.Label>
                        <Form.Select
                            value={formData.room}
                            onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
                        >
                            <option value="">Select room</option>
                            {rooms.map(room => (
                                <option key={room} value={room}>{room}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Technologist</Form.Label>
                        <Form.Select
                            value={formData.technologist}
                            onChange={(e) => setFormData(prev => ({ ...prev, technologist: e.target.value }))}
                        >
                            <option value="">Select technologist</option>
                            {technologists.map(tech => (
                                <option key={tech} value={tech}>{tech}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="Requires Contrast"
                            checked={formData.contrast}
                            onChange={(e) => setFormData(prev => ({ ...prev, contrast: e.target.checked }))}
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Preparation Instructions</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            value={formData.prep}
                            onChange={(e) => setFormData(prev => ({ ...prev, prep: e.target.value }))}
                            placeholder="Enter preparation instructions"
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Clinical Notes</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            value={formData.notes}
                            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                            placeholder="Enter clinical notes"
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
                                        <i className="ri-calendar-schedule-line me-2"></i>
                                        Imaging Schedule
                                    </h3>
                                    <p className="mb-0 opacity-75">Manage imaging appointments and workflow</p>
                                </div>
                                <div className="d-flex gap-2">
                                    <Badge bg="light" text="dark">{filteredAppointments.length} Today</Badge>
                                    <Button 
                                        variant="light" 
                                        size="sm"
                                        onClick={() => setShowAddModal(true)}
                                    >
                                        <i className="ri-add-line me-1"></i>
                                        Schedule Study
                                    </Button>
                                </div>
                            </div>
                        </Card.Header>
                    </Card>

                    {/* Date Selection and Quick Stats */}
                    <Row className="mb-4">
                        <Col lg={8}>
                            <Card className="border-0 shadow-sm">
                                <Card.Body>
                                    <div className="d-flex align-items-center">
                                        <div className="me-3">
                                            <i className="ri-calendar-line fs-4 text-primary"></i>
                                        </div>
                                        <div className="flex-grow-1">
                                            <Form.Group>
                                                <Form.Label className="mb-1">Select Date</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    value={selectedDate}
                                                    onChange={(e) => setSelectedDate(e.target.value)}
                                                    style={{ width: '200px' }}
                                                />
                                            </Form.Group>
                                        </div>
                                        <div className="text-end">
                                            <Button variant="outline-primary" size="sm" className="me-2">
                                                <i className="ri-calendar-view-line me-1"></i>
                                                Week View
                                            </Button>
                                            <Button variant="outline-success" size="sm">
                                                <i className="ri-printer-line me-1"></i>
                                                Print Schedule
                                            </Button>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={4}>
                            <Card className="border-0 shadow-sm h-100">
                                <Card.Body>
                                    <h6 className="text-primary mb-3">
                                        <i className="ri-dashboard-line me-2"></i>
                                        Quick Stats
                                    </h6>
                                    <div className="row text-center">
                                        <div className="col-4">
                                            <div className="text-success fw-bold fs-5">
                                                {filteredAppointments.filter(apt => apt.status === 'Completed').length}
                                            </div>
                                            <small className="text-muted">Completed</small>
                                        </div>
                                        <div className="col-4">
                                            <div className="text-warning fw-bold fs-5">
                                                {filteredAppointments.filter(apt => apt.status === 'In Progress').length}
                                            </div>
                                            <small className="text-muted">In Progress</small>
                                        </div>
                                        <div className="col-4">
                                            <div className="text-primary fw-bold fs-5">
                                                {filteredAppointments.filter(apt => apt.status === 'Scheduled').length}
                                            </div>
                                            <small className="text-muted">Scheduled</small>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Schedule Table */}
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-light">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">
                                    <i className="ri-time-line me-2 text-primary"></i>
                                    Schedule for {new Date(selectedDate).toLocaleDateString()}
                                </h5>
                                <div className="d-flex gap-2">
                                    <Form.Select size="sm" style={{ width: 'auto' }}>
                                        <option>All Rooms</option>
                                        {rooms.map(room => (
                                            <option key={room} value={room}>{room}</option>
                                        ))}
                                    </Form.Select>
                                    <Form.Select size="sm" style={{ width: 'auto' }}>
                                        <option>All Status</option>
                                        <option>Scheduled</option>
                                        <option>Confirmed</option>
                                        <option>In Progress</option>
                                        <option>Completed</option>
                                    </Form.Select>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <Table striped hover className="mb-0">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Time</th>
                                            <th>Patient</th>
                                            <th>Study</th>
                                            <th>Room</th>
                                            <th>Technologist</th>
                                            <th>Priority</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredAppointments.sort((a, b) => a.time.localeCompare(b.time)).map((appointment) => (
                                            <tr key={appointment.id}>
                                                <td>
                                                    <strong>{appointment.time}</strong>
                                                    <br />
                                                    <small className="text-muted">{appointment.duration} min</small>
                                                </td>
                                                <td>
                                                    <div>
                                                        <strong>{appointment.patientName}</strong>
                                                        <br />
                                                        <code className="bg-light p-1 rounded small">{appointment.patientMRN}</code>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>{appointment.studyType}</div>
                                                    {appointment.contrast && (
                                                        <Badge bg="warning" className="mt-1">
                                                            <i className="ri-drop-line me-1"></i>Contrast
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td>
                                                    <Badge bg="info">{appointment.room}</Badge>
                                                </td>
                                                <td>{appointment.technologist}</td>
                                                <td>{getPriorityBadge(appointment.priority)}</td>
                                                <td>{getStatusBadge(appointment.status)}</td>
                                                <td>
                                                    <div className="d-flex gap-1">
                                                        <Button
                                                            variant="outline-secondary"
                                                            size="sm"
                                                            onClick={() => handleEdit(appointment)}
                                                        >
                                                            <i className="ri-edit-line"></i>
                                                        </Button>
                                                        {appointment.status === 'Scheduled' && (
                                                            <Button
                                                                variant="outline-warning"
                                                                size="sm"
                                                                onClick={() => updateStatus(appointment.id, 'In Progress')}
                                                            >
                                                                <i className="ri-play-line"></i>
                                                            </Button>
                                                        )}
                                                        {appointment.status === 'In Progress' && (
                                                            <Button
                                                                variant="outline-success"
                                                                size="sm"
                                                                onClick={() => updateStatus(appointment.id, 'Completed')}
                                                            >
                                                                <i className="ri-check-line"></i>
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                        >
                                                            <i className="ri-information-line"></i>
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                            {filteredAppointments.length === 0 && (
                                <div className="text-center py-5">
                                    <i className="ri-calendar-line fs-1 text-muted"></i>
                                    <h5 className="text-muted mt-3">No appointments scheduled</h5>
                                    <p className="text-muted">No imaging studies scheduled for this date.</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Add Appointment Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="ri-calendar-schedule-line me-2"></i>
                        Schedule Imaging Study
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {renderAppointmentForm()}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowAddModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleAddAppointment}>
                        <i className="ri-save-line me-1"></i>
                        Schedule Appointment
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Appointment Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="ri-edit-line me-2"></i>
                        Edit Appointment
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {renderAppointmentForm()}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowEditModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleEditAppointment}>
                        <i className="ri-save-line me-1"></i>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ImagingSchedule;
