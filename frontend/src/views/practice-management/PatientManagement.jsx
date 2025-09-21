import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Table, Badge, Alert, InputGroup, Tab, Tabs } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showMedicalHistoryModal, setShowMedicalHistoryModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterBloodType, setFilterBloodType] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bloodType: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    insuranceProvider: '',
    insuranceNumber: '',
    allergies: '',
    currentMedications: '',
    chronicConditions: '',
    status: 'active',
    assignedDoctor: '',
    registrationDate: new Date().toISOString().split('T')[0]
  });

  const [medicalHistory, setMedicalHistory] = useState([]);
  const [newMedicalRecord, setNewMedicalRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'consultation',
    doctor: '',
    diagnosis: '',
    treatment: '',
    medications: '',
    notes: '',
    followUpDate: ''
  });

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const recordTypes = ['consultation', 'lab_test', 'imaging', 'surgery', 'therapy', 'vaccination'];

  // Sample data - replace with API calls
  useEffect(() => {
    setPatients([
      {
        id: 1,
        firstName: 'Emma',
        lastName: 'Wilson',
        email: 'emma.wilson@email.com',
        phone: '+1-555-0201',
        dateOfBirth: '1985-03-15',
        gender: 'female',
        bloodType: 'A+',
        address: '123 Main St, New York, NY 10001',
        emergencyContact: 'Robert Wilson',
        emergencyPhone: '+1-555-0202',
        insuranceProvider: 'Blue Cross',
        insuranceNumber: 'BC123456789',
        allergies: 'Penicillin, Shellfish',
        currentMedications: 'Lisinopril 10mg daily',
        chronicConditions: 'Hypertension',
        status: 'active',
        assignedDoctor: 'Dr. John Smith',
        registrationDate: '2023-01-15',
        lastVisit: '2024-01-20',
        totalVisits: 12,
        upcomingAppointments: 2
      },
      {
        id: 2,
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'michael.brown@email.com',
        phone: '+1-555-0203',
        dateOfBirth: '1978-08-22',
        gender: 'male',
        bloodType: 'O-',
        address: '456 Oak Ave, Los Angeles, CA 90001',
        emergencyContact: 'Lisa Brown',
        emergencyPhone: '+1-555-0204',
        insuranceProvider: 'Aetna',
        insuranceNumber: 'AE987654321',
        allergies: 'None known',
        currentMedications: 'Metformin 500mg twice daily',
        chronicConditions: 'Type 2 Diabetes',
        status: 'active',
        assignedDoctor: 'Dr. Sarah Johnson',
        registrationDate: '2022-11-10',
        lastVisit: '2024-01-18',
        totalVisits: 25,
        upcomingAppointments: 1
      }
    ]);

    // Sample medical history
    setMedicalHistory([
      {
        id: 1,
        patientId: 1,
        date: '2024-01-20',
        type: 'consultation',
        doctor: 'Dr. John Smith',
        diagnosis: 'Hypertension follow-up',
        treatment: 'Medication adjustment',
        medications: 'Lisinopril increased to 15mg daily',
        notes: 'Blood pressure improved, continue current treatment',
        followUpDate: '2024-04-20'
      },
      {
        id: 2,
        patientId: 1,
        date: '2024-01-15',
        type: 'lab_test',
        doctor: 'Dr. John Smith',
        diagnosis: 'Routine blood work',
        treatment: 'Lab results review',
        medications: '',
        notes: 'All values within normal range',
        followUpDate: ''
      }
    ]);
  }, []);

  const handleAddPatient = (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      const newPatient = {
        id: patients.length + 1,
        ...formData,
        lastVisit: '',
        totalVisits: 0,
        upcomingAppointments: 0
      };
      setPatients([...patients, newPatient]);
      setShowAddModal(false);
      resetForm();
      setLoading(false);
    }, 1000);
  };

  const handleEditPatient = (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setPatients(patients.map(patient => 
        patient.id === selectedPatient.id ? { ...selectedPatient, ...formData } : patient
      ));
      setShowEditModal(false);
      resetForm();
      setLoading(false);
    }, 1000);
  };

  const handleDeletePatient = (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient record?')) {
      setPatients(patients.filter(patient => patient.id !== patientId));
    }
  };

  const handleAddMedicalRecord = (e) => {
    e.preventDefault();
    const newRecord = {
      id: medicalHistory.length + 1,
      patientId: selectedPatient.id,
      ...newMedicalRecord
    };
    setMedicalHistory([...medicalHistory, newRecord]);
    setNewMedicalRecord({
      date: new Date().toISOString().split('T')[0],
      type: 'consultation',
      doctor: '',
      diagnosis: '',
      treatment: '',
      medications: '',
      notes: '',
      followUpDate: ''
    });
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      bloodType: '',
      address: '',
      emergencyContact: '',
      emergencyPhone: '',
      insuranceProvider: '',
      insuranceNumber: '',
      allergies: '',
      currentMedications: '',
      chronicConditions: '',
      status: 'active',
      assignedDoctor: '',
      registrationDate: new Date().toISOString().split('T')[0]
    });
  };

  const openEditModal = (patient) => {
    setSelectedPatient(patient);
    setFormData(patient);
    setShowEditModal(true);
  };

  const openViewModal = (patient) => {
    setSelectedPatient(patient);
    setShowViewModal(true);
  };

  const openMedicalHistoryModal = (patient) => {
    setSelectedPatient(patient);
    setShowMedicalHistoryModal(true);
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.phone.includes(searchTerm);
    const matchesStatus = filterStatus === '' || patient.status === filterStatus;
    const matchesBloodType = filterBloodType === '' || patient.bloodType === filterBloodType;
    
    return matchesSearch && matchesStatus && matchesBloodType;
  });

  const getStatusBadge = (status) => {
    const variants = {
      active: 'success',
      inactive: 'secondary',
      discharged: 'info',
      admitted: 'warning',
      critical: 'danger'
    };
    return <Badge bg={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  const getAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getPatientMedicalHistory = (patientId) => {
    return medicalHistory.filter(record => record.patientId === patientId);
  };

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">
                <i className="ri-user-heart-line me-2"></i>
                Patient Management
              </h2>
              <p className="text-muted mb-0">Manage patient records and medical history</p>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowAddModal(true)}
              className="d-flex align-items-center"
            >
              <i className="ri-add-line me-2"></i>
              Add New Patient
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
                    <i className="ri-user-heart-line fs-3 text-primary"></i>
                  </div>
                </div>
                <h3 className="mb-1">{patients.length}</h3>
                <p className="text-muted mb-0">Total Patients</p>
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
                    <i className="ri-user-smile-line fs-3 text-success"></i>
                  </div>
                </div>
                <h3 className="mb-1">{patients.filter(p => p.status === 'active').length}</h3>
                <p className="text-muted mb-0">Active Patients</p>
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
                    <i className="ri-calendar-check-line fs-3 text-warning"></i>
                  </div>
                </div>
                <h3 className="mb-1">{patients.reduce((sum, p) => sum + p.upcomingAppointments, 0)}</h3>
                <p className="text-muted mb-0">Upcoming Appointments</p>
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
                    <i className="ri-hospital-line fs-3 text-info"></i>
                  </div>
                </div>
                <h3 className="mb-1">{patients.reduce((sum, p) => sum + p.totalVisits, 0)}</h3>
                <p className="text-muted mb-0">Total Visits</p>
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
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select
            value={filterBloodType}
            onChange={(e) => setFilterBloodType(e.target.value)}
          >
            <option value="">All Blood Types</option>
            {bloodTypes.map(type => (
              <option key={type} value={type}>{type}</option>
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
            <option value="discharged">Discharged</option>
            <option value="admitted">Admitted</option>
            <option value="critical">Critical</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Button
            variant="outline-secondary"
            className="w-100"
            onClick={() => {
              setSearchTerm('');
              setFilterBloodType('');
              setFilterStatus('');
            }}
          >
            Clear Filters
          </Button>
        </Col>
      </Row>

      {/* Patients Table */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Patient</th>
                  <th>Age/Gender</th>
                  <th>Blood Type</th>
                  <th>Assigned Doctor</th>
                  <th>Last Visit</th>
                  <th>Total Visits</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredPatients.map((patient, index) => (
                    <motion.tr
                      key={patient.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="rounded-circle bg-primary-subtle p-2 me-3">
                            <i className="ri-user-heart-line text-primary"></i>
                          </div>
                          <div>
                            <h6 className="mb-0">{patient.firstName} {patient.lastName}</h6>
                            <small className="text-muted">{patient.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        {getAge(patient.dateOfBirth)} years / {patient.gender}
                      </td>
                      <td>
                        <Badge bg="outline-dark">{patient.bloodType}</Badge>
                      </td>
                      <td>{patient.assignedDoctor}</td>
                      <td>{patient.lastVisit || 'Never'}</td>
                      <td>
                        <Badge bg="info">{patient.totalVisits}</Badge>
                      </td>
                      <td>{getStatusBadge(patient.status)}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => openViewModal(patient)}
                            title="View Details"
                          >
                            <i className="ri-eye-line"></i>
                          </Button>
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => openMedicalHistoryModal(patient)}
                            title="Medical History"
                          >
                            <i className="ri-health-book-line"></i>
                          </Button>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => openEditModal(patient)}
                            title="Edit Patient"
                          >
                            <i className="ri-edit-line"></i>
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeletePatient(patient.id)}
                            title="Delete Patient"
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

      {/* Add Patient Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-user-add-line me-2"></i>
            Add New Patient
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddPatient}>
          <Modal.Body>
            <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-3">
              <Tab eventKey="basic" title="Basic Information">
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
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Date of Birth *</Form.Label>
                      <Form.Control
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Gender *</Form.Label>
                      <Form.Select
                        value={formData.gender}
                        onChange={(e) => setFormData({...formData, gender: e.target.value})}
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Blood Type</Form.Label>
                      <Form.Select
                        value={formData.bloodType}
                        onChange={(e) => setFormData({...formData, bloodType: e.target.value})}
                      >
                        <option value="">Select Blood Type</option>
                        {bloodTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </Form.Group>
              </Tab>

              <Tab eventKey="emergency" title="Emergency Contact">
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Emergency Contact Name *</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.emergencyContact}
                        onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Emergency Contact Phone *</Form.Label>
                      <Form.Control
                        type="tel"
                        value={formData.emergencyPhone}
                        onChange={(e) => setFormData({...formData, emergencyPhone: e.target.value})}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="insurance" title="Insurance">
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Insurance Provider</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.insuranceProvider}
                        onChange={(e) => setFormData({...formData, insuranceProvider: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Insurance Number</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.insuranceNumber}
                        onChange={(e) => setFormData({...formData, insuranceNumber: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="medical" title="Medical Information">
                <Form.Group className="mb-3">
                  <Form.Label>Known Allergies</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={formData.allergies}
                    onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                    placeholder="List any known allergies"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Current Medications</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={formData.currentMedications}
                    onChange={(e) => setFormData({...formData, currentMedications: e.target.value})}
                    placeholder="List current medications"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Chronic Conditions</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={formData.chronicConditions}
                    onChange={(e) => setFormData({...formData, chronicConditions: e.target.value})}
                    placeholder="List any chronic conditions"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Assigned Doctor</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.assignedDoctor}
                    onChange={(e) => setFormData({...formData, assignedDoctor: e.target.value})}
                  />
                </Form.Group>
              </Tab>
            </Tabs>
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
                  Add Patient
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Medical History Modal */}
      <Modal show={showMedicalHistoryModal} onHide={() => setShowMedicalHistoryModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-health-book-line me-2"></i>
            Medical History - {selectedPatient?.firstName} {selectedPatient?.lastName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey="history" className="mb-3">
            <Tab eventKey="history" title="Medical History">
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Doctor</th>
                      <th>Diagnosis</th>
                      <th>Treatment</th>
                      <th>Follow-up</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPatient && getPatientMedicalHistory(selectedPatient.id).map(record => (
                      <tr key={record.id}>
                        <td>{record.date}</td>
                        <td>
                          <Badge bg="outline-info">
                            {record.type.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </td>
                        <td>{record.doctor}</td>
                        <td>{record.diagnosis}</td>
                        <td>{record.treatment}</td>
                        <td>{record.followUpDate || 'None'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Tab>

            <Tab eventKey="add-record" title="Add Medical Record">
              <Form onSubmit={handleAddMedicalRecord}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Date *</Form.Label>
                      <Form.Control
                        type="date"
                        value={newMedicalRecord.date}
                        onChange={(e) => setNewMedicalRecord({...newMedicalRecord, date: e.target.value})}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Type *</Form.Label>
                      <Form.Select
                        value={newMedicalRecord.type}
                        onChange={(e) => setNewMedicalRecord({...newMedicalRecord, type: e.target.value})}
                        required
                      >
                        {recordTypes.map(type => (
                          <option key={type} value={type}>
                            {type.replace('_', ' ').toUpperCase()}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Doctor *</Form.Label>
                      <Form.Control
                        type="text"
                        value={newMedicalRecord.doctor}
                        onChange={(e) => setNewMedicalRecord({...newMedicalRecord, doctor: e.target.value})}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Follow-up Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={newMedicalRecord.followUpDate}
                        onChange={(e) => setNewMedicalRecord({...newMedicalRecord, followUpDate: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Diagnosis *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={newMedicalRecord.diagnosis}
                    onChange={(e) => setNewMedicalRecord({...newMedicalRecord, diagnosis: e.target.value})}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Treatment</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={newMedicalRecord.treatment}
                    onChange={(e) => setNewMedicalRecord({...newMedicalRecord, treatment: e.target.value})}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Medications</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={newMedicalRecord.medications}
                    onChange={(e) => setNewMedicalRecord({...newMedicalRecord, medications: e.target.value})}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newMedicalRecord.notes}
                    onChange={(e) => setNewMedicalRecord({...newMedicalRecord, notes: e.target.value})}
                  />
                </Form.Group>

                <Button type="submit" variant="primary">
                  <i className="ri-save-line me-2"></i>
                  Add Medical Record
                </Button>
              </Form>
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>

      {/* View Patient Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-user-heart-line me-2"></i>
            Patient Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPatient && (
            <Tabs defaultActiveKey="personal" className="mb-3">
              <Tab eventKey="personal" title="Personal Information">
                <Row>
                  <Col md={6}>
                    <Table size="sm" className="mb-4">
                      <tbody>
                        <tr>
                          <td><strong>Name:</strong></td>
                          <td>{selectedPatient.firstName} {selectedPatient.lastName}</td>
                        </tr>
                        <tr>
                          <td><strong>Age:</strong></td>
                          <td>{getAge(selectedPatient.dateOfBirth)} years</td>
                        </tr>
                        <tr>
                          <td><strong>Gender:</strong></td>
                          <td>{selectedPatient.gender}</td>
                        </tr>
                        <tr>
                          <td><strong>Blood Type:</strong></td>
                          <td>{selectedPatient.bloodType}</td>
                        </tr>
                        <tr>
                          <td><strong>Phone:</strong></td>
                          <td>{selectedPatient.phone}</td>
                        </tr>
                        <tr>
                          <td><strong>Email:</strong></td>
                          <td>{selectedPatient.email}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                  <Col md={6}>
                    <Table size="sm" className="mb-4">
                      <tbody>
                        <tr>
                          <td><strong>Emergency Contact:</strong></td>
                          <td>{selectedPatient.emergencyContact}</td>
                        </tr>
                        <tr>
                          <td><strong>Emergency Phone:</strong></td>
                          <td>{selectedPatient.emergencyPhone}</td>
                        </tr>
                        <tr>
                          <td><strong>Insurance:</strong></td>
                          <td>{selectedPatient.insuranceProvider}</td>
                        </tr>
                        <tr>
                          <td><strong>Assigned Doctor:</strong></td>
                          <td>{selectedPatient.assignedDoctor}</td>
                        </tr>
                        <tr>
                          <td><strong>Registration Date:</strong></td>
                          <td>{selectedPatient.registrationDate}</td>
                        </tr>
                        <tr>
                          <td><strong>Status:</strong></td>
                          <td>{getStatusBadge(selectedPatient.status)}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="medical" title="Medical Information">
                <div className="mb-3">
                  <h6>Allergies</h6>
                  <p>{selectedPatient.allergies || 'None recorded'}</p>
                </div>
                <div className="mb-3">
                  <h6>Current Medications</h6>
                  <p>{selectedPatient.currentMedications || 'None recorded'}</p>
                </div>
                <div className="mb-3">
                  <h6>Chronic Conditions</h6>
                  <p>{selectedPatient.chronicConditions || 'None recorded'}</p>
                </div>
              </Tab>
            </Tabs>
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

export default PatientManagement;
