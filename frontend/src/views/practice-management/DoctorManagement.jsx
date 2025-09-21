import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Table, Badge, Alert, InputGroup } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialization: '',
    licenseNumber: '',
    experience: '',
    qualification: '',
    department: '',
    consultationFee: '',
    address: '',
    emergencyContact: '',
    status: 'active',
    workingHours: {
      monday: { start: '09:00', end: '17:00', available: true },
      tuesday: { start: '09:00', end: '17:00', available: true },
      wednesday: { start: '09:00', end: '17:00', available: true },
      thursday: { start: '09:00', end: '17:00', available: true },
      friday: { start: '09:00', end: '17:00', available: true },
      saturday: { start: '09:00', end: '13:00', available: true },
      sunday: { start: '', end: '', available: false }
    }
  });

  const specializations = [
    'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 'Orthopedics',
    'Radiology', 'Pathology', 'Anesthesiology', 'Emergency Medicine',
    'Internal Medicine', 'Surgery', 'Psychiatry', 'Gynecology', 'Ophthalmology'
  ];

  const departments = [
    'Emergency', 'ICU', 'General Medicine', 'Surgery', 'Pediatrics',
    'Maternity', 'Radiology', 'Laboratory', 'Cardiology', 'Neurology'
  ];

  // Sample data - replace with API calls
  useEffect(() => {
    setDoctors([
      {
        id: 1,
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@hospital.com',
        phone: '+1-555-0101',
        specialization: 'Cardiology',
        licenseNumber: 'MD123456',
        experience: 8,
        qualification: 'MD, MBBS',
        department: 'Cardiology',
        consultationFee: 150,
        status: 'active',
        patientsToday: 12,
        totalPatients: 1240,
        rating: 4.8,
        joinDate: '2020-03-15'
      },
      {
        id: 2,
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@hospital.com',
        phone: '+1-555-0102',
        specialization: 'Pediatrics',
        licenseNumber: 'MD789012',
        experience: 5,
        qualification: 'MD, DCH',
        department: 'Pediatrics',
        consultationFee: 120,
        status: 'active',
        patientsToday: 15,
        totalPatients: 890,
        rating: 4.9,
        joinDate: '2021-07-20'
      }
    ]);
  }, []);

  const handleAddDoctor = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newDoctor = {
        id: doctors.length + 1,
        ...formData,
        patientsToday: 0,
        totalPatients: 0,
        rating: 0,
        joinDate: new Date().toISOString().split('T')[0]
      };
      setDoctors([...doctors, newDoctor]);
      setShowAddModal(false);
      resetForm();
      setLoading(false);
    }, 1000);
  };

  const handleEditDoctor = (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setDoctors(doctors.map(doc => 
        doc.id === selectedDoctor.id ? { ...selectedDoctor, ...formData } : doc
      ));
      setShowEditModal(false);
      resetForm();
      setLoading(false);
    }, 1000);
  };

  const handleDeleteDoctor = (doctorId) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      setDoctors(doctors.filter(doc => doc.id !== doctorId));
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      specialization: '',
      licenseNumber: '',
      experience: '',
      qualification: '',
      department: '',
      consultationFee: '',
      address: '',
      emergencyContact: '',
      status: 'active',
      workingHours: {
        monday: { start: '09:00', end: '17:00', available: true },
        tuesday: { start: '09:00', end: '17:00', available: true },
        wednesday: { start: '09:00', end: '17:00', available: true },
        thursday: { start: '09:00', end: '17:00', available: true },
        friday: { start: '09:00', end: '17:00', available: true },
        saturday: { start: '09:00', end: '13:00', available: true },
        sunday: { start: '', end: '', available: false }
      }
    });
  };

  const openEditModal = (doctor) => {
    setSelectedDoctor(doctor);
    setFormData(doctor);
    setShowEditModal(true);
  };

  const openViewModal = (doctor) => {
    setSelectedDoctor(doctor);
    setShowViewModal(true);
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = filterSpecialty === '' || doctor.specialization === filterSpecialty;
    const matchesStatus = filterStatus === '' || doctor.status === filterStatus;
    
    return matchesSearch && matchesSpecialty && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const variants = {
      active: 'success',
      inactive: 'secondary',
      suspended: 'warning',
      on_leave: 'info'
    };
    return <Badge bg={variants[status]}>{status.replace('_', ' ').toUpperCase()}</Badge>;
  };

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">
                <i className="ri-user-star-line me-2"></i>
                Doctor Management
              </h2>
              <p className="text-muted mb-0">Manage your medical staff and practitioners</p>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowAddModal(true)}
              className="d-flex align-items-center"
            >
              <i className="ri-add-line me-2"></i>
              Add New Doctor
            </Button>
          </div>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <motion.div whileHover={{ y: -5 }}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <div className="rounded-circle bg-primary-subtle p-3">
                    <i className="ri-user-line fs-3 text-primary"></i>
                  </div>
                </div>
                <h3 className="mb-1">{doctors.length}</h3>
                <p className="text-muted mb-0">Total Doctors</p>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
        <Col md={3}>
          <motion.div whileHover={{ y: -5 }}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <div className="rounded-circle bg-success-subtle p-3">
                    <i className="ri-user-star-line fs-3 text-success"></i>
                  </div>
                </div>
                <h3 className="mb-1">{doctors.filter(d => d.status === 'active').length}</h3>
                <p className="text-muted mb-0">Active Doctors</p>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
        <Col md={3}>
          <motion.div whileHover={{ y: -5 }}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <div className="rounded-circle bg-info-subtle p-3">
                    <i className="ri-stethoscope-line fs-3 text-info"></i>
                  </div>
                </div>
                <h3 className="mb-1">{new Set(doctors.map(d => d.specialization)).size}</h3>
                <p className="text-muted mb-0">Specializations</p>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
        <Col md={3}>
          <motion.div whileHover={{ y: -5 }}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <div className="rounded-circle bg-warning-subtle p-3">
                    <i className="ri-user-heart-line fs-3 text-warning"></i>
                  </div>
                </div>
                <h3 className="mb-1">{doctors.reduce((sum, d) => sum + d.patientsToday, 0)}</h3>
                <p className="text-muted mb-0">Patients Today</p>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Filters and Search */}
      <Row className="mb-4">
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>
              <i className="ri-search-line"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select
            value={filterSpecialty}
            onChange={(e) => setFilterSpecialty(e.target.value)}
          >
            <option value="">All Specializations</option>
            {specializations.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="on_leave">On Leave</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Button
            variant="outline-secondary"
            className="w-100"
            onClick={() => {
              setSearchTerm('');
              setFilterSpecialty('');
              setFilterStatus('');
            }}
          >
            Clear Filters
          </Button>
        </Col>
      </Row>

      {/* Doctors Table */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Doctor</th>
                  <th>Specialization</th>
                  <th>Department</th>
                  <th>Experience</th>
                  <th>Patients Today</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredDoctors.map((doctor, index) => (
                    <motion.tr
                      key={doctor.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="rounded-circle bg-primary-subtle p-2 me-3">
                            <i className="ri-user-line text-primary"></i>
                          </div>
                          <div>
                            <h6 className="mb-0">{doctor.firstName} {doctor.lastName}</h6>
                            <small className="text-muted">{doctor.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>{doctor.specialization}</td>
                      <td>{doctor.department}</td>
                      <td>{doctor.experience} years</td>
                      <td>
                        <Badge bg="info">{doctor.patientsToday}</Badge>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <i className="ri-star-fill text-warning me-1"></i>
                          {doctor.rating}
                        </div>
                      </td>
                      <td>{getStatusBadge(doctor.status)}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => openViewModal(doctor)}
                            title="View Details"
                          >
                            <i className="ri-eye-line"></i>
                          </Button>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => openEditModal(doctor)}
                            title="Edit Doctor"
                          >
                            <i className="ri-edit-line"></i>
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteDoctor(doctor.id)}
                            title="Delete Doctor"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Add Doctor Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-user-add-line me-2"></i>
            Add New Doctor
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddDoctor}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone *</Form.Label>
                  <Form.Control
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Specialization *</Form.Label>
                  <Form.Select
                    value={formData.specialization}
                    onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                    required
                  >
                    <option value="">Select Specialization</option>
                    {specializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Department *</Form.Label>
                  <Form.Select
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>License Number *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Experience (Years) *</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Qualification *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                    placeholder="e.g., MD, MBBS, MS"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Consultation Fee ($)</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.consultationFee}
                    onChange={(e) => setFormData({...formData, consultationFee: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
                <option value="on_leave">On Leave</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Adding...
                </>
              ) : (
                <>
                  <i className="ri-save-line me-2"></i>
                  Add Doctor
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Doctor Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-edit-line me-2"></i>
            Edit Doctor
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditDoctor}>
          <Modal.Body>
            {/* Same form fields as Add Modal */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            {/* Add other form fields similar to Add Modal */}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Updating...
                </>
              ) : (
                <>
                  <i className="ri-save-line me-2"></i>
                  Update Doctor
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* View Doctor Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-user-line me-2"></i>
            Doctor Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDoctor && (
            <Row>
              <Col md={6}>
                <h6>Personal Information</h6>
                <Table size="sm" className="mb-4">
                  <tbody>
                    <tr>
                      <td><strong>Name:</strong></td>
                      <td>{selectedDoctor.firstName} {selectedDoctor.lastName}</td>
                    </tr>
                    <tr>
                      <td><strong>Email:</strong></td>
                      <td>{selectedDoctor.email}</td>
                    </tr>
                    <tr>
                      <td><strong>Phone:</strong></td>
                      <td>{selectedDoctor.phone}</td>
                    </tr>
                    <tr>
                      <td><strong>License:</strong></td>
                      <td>{selectedDoctor.licenseNumber}</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
              <Col md={6}>
                <h6>Professional Information</h6>
                <Table size="sm" className="mb-4">
                  <tbody>
                    <tr>
                      <td><strong>Specialization:</strong></td>
                      <td>{selectedDoctor.specialization}</td>
                    </tr>
                    <tr>
                      <td><strong>Department:</strong></td>
                      <td>{selectedDoctor.department}</td>
                    </tr>
                    <tr>
                      <td><strong>Experience:</strong></td>
                      <td>{selectedDoctor.experience} years</td>
                    </tr>
                    <tr>
                      <td><strong>Rating:</strong></td>
                      <td>
                        <i className="ri-star-fill text-warning me-1"></i>
                        {selectedDoctor.rating}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DoctorManagement;
