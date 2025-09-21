import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Row, 
  Col, 
  Badge, 
  Alert,
  Spinner,
  InputGroup,
  Dropdown,
  Tabs,
  Tab
} from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaFilter, FaHeartbeat } from 'react-icons/fa';
import { allopathyS3Config } from '../../../../utils/allopathyS3Config';
import axios from 'axios';

const AllopathyPatientManager = ({ onDataChange, onNotification }) => {
  const [patients, setPatients] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientSummary, setPatientSummary] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [formData, setFormData] = useState({
    hospital: '',
    patient_id: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    age: '',
    gender: 'M',
    blood_group: 'Unknown',
    phone: '',
    email: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    admission_date: '',
    admission_type: 'outpatient',
    attending_physician: '',
    insurance_provider: '',
    insurance_number: '',
    allergies: '',
    current_medications: '',
    medical_history: '',
    status: 'active',
    notes: ''
  });
  const [vitalsData, setVitalsData] = useState({
    temperature: '',
    blood_pressure: '',
    heart_rate: '',
    respiratory_rate: '',
    oxygen_saturation: ''
  });
  const [filters, setFilters] = useState({
    hospital: '',
    status: '',
    admission_type: '',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPatients();
    fetchHospitals();
  }, [currentPage, filters]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        page_size: allopathyS3Config.ui.pagination.defaultPageSize,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      });

      const response = await axios.get(
        `${allopathyS3Config.api.baseURL}${allopathyS3Config.api.endpoints.patients}?${params}`
      );

      setPatients(response.data.results || response.data);
      setTotalPages(Math.ceil((response.data.count || response.data.length) / allopathyS3Config.ui.pagination.defaultPageSize));
    } catch (error) {
      console.error('Failed to fetch patients:', error);
      onNotification('Failed to fetch patients', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchHospitals = async () => {
    try {
      const response = await axios.get(
        `${allopathyS3Config.api.baseURL}${allopathyS3Config.api.endpoints.hospitals}`
      );
      setHospitals(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to fetch hospitals:', error);
    }
  };

  const fetchPatientSummary = async (patientId) => {
    try {
      const response = await axios.get(
        `${allopathyS3Config.api.baseURL}${allopathyS3Config.api.endpoints.patientSummary(patientId)}`
      );
      setPatientSummary(response.data);
    } catch (error) {
      console.error('Failed to fetch patient summary:', error);
      onNotification('Failed to fetch patient summary', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = selectedPatient 
        ? `${allopathyS3Config.api.baseURL}${allopathyS3Config.api.endpoints.patients}${selectedPatient.id}/`
        : `${allopathyS3Config.api.baseURL}${allopathyS3Config.api.endpoints.patients}`;
      
      const method = selectedPatient ? 'PUT' : 'POST';
      
      // Calculate age from date of birth
      const birthDate = new Date(formData.date_of_birth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      const dataToSubmit = {
        ...formData,
        age: age,
        admission_date: formData.admission_date || new Date().toISOString()
      };
      
      await axios({
        method,
        url,
        data: dataToSubmit
      });

      onNotification(
        `Patient ${selectedPatient ? 'updated' : 'created'} successfully`, 
        'success'
      );
      
      setShowModal(false);
      resetForm();
      fetchPatients();
      onDataChange();
    } catch (error) {
      console.error('Failed to save patient:', error);
      onNotification('Failed to save patient', 'error');
    }
  };

  const handleVitalsSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `${allopathyS3Config.api.baseURL}${allopathyS3Config.api.endpoints.patients}${selectedPatient.id}/update-vital-signs/`,
        { vital_signs: vitalsData }
      );

      onNotification('Vital signs updated successfully', 'success');
      setShowVitalsModal(false);
      fetchPatients();
      onDataChange();
    } catch (error) {
      console.error('Failed to update vital signs:', error);
      onNotification('Failed to update vital signs', 'error');
    }
  };

  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    setFormData({
      hospital: patient.hospital,
      patient_id: patient.patient_id,
      first_name: patient.first_name,
      last_name: patient.last_name,
      date_of_birth: patient.date_of_birth,
      age: patient.age,
      gender: patient.gender,
      blood_group: patient.blood_group,
      phone: patient.phone,
      email: patient.email || '',
      address: patient.address,
      emergency_contact_name: patient.emergency_contact_name,
      emergency_contact_phone: patient.emergency_contact_phone,
      admission_date: patient.admission_date.split('T')[0],
      admission_type: patient.admission_type,
      attending_physician: patient.attending_physician,
      insurance_provider: patient.insurance_provider || '',
      insurance_number: patient.insurance_number || '',
      allergies: patient.allergies || '',
      current_medications: patient.current_medications || '',
      medical_history: patient.medical_history || '',
      status: patient.status,
      notes: patient.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (patient) => {
    if (window.confirm(`Are you sure you want to delete ${patient.full_name}?`)) {
      try {
        await axios.delete(
          `${allopathyS3Config.api.baseURL}${allopathyS3Config.api.endpoints.patients}${patient.id}/`
        );
        onNotification('Patient deleted successfully', 'success');
        fetchPatients();
        onDataChange();
      } catch (error) {
        console.error('Failed to delete patient:', error);
        onNotification('Failed to delete patient', 'error');
      }
    }
  };

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    fetchPatientSummary(patient.id);
    setShowDetails(true);
  };

  const handleUpdateVitals = (patient) => {
    setSelectedPatient(patient);
    setVitalsData(patient.vital_signs || {
      temperature: '',
      blood_pressure: '',
      heart_rate: '',
      respiratory_rate: '',
      oxygen_saturation: ''
    });
    setShowVitalsModal(true);
  };

  const resetForm = () => {
    setFormData({
      hospital: '',
      patient_id: '',
      first_name: '',
      last_name: '',
      date_of_birth: '',
      age: '',
      gender: 'M',
      blood_group: 'Unknown',
      phone: '',
      email: '',
      address: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      admission_date: '',
      admission_type: 'outpatient',
      attending_physician: '',
      insurance_provider: '',
      insurance_number: '',
      allergies: '',
      current_medications: '',
      medical_history: '',
      status: 'active',
      notes: ''
    });
    setSelectedPatient(null);
  };

  const getStatusBadge = (status) => {
    const statusConfig = allopathyS3Config.patientStatus.find(s => s.value === status);
    return (
      <Badge bg={statusConfig?.color || 'secondary'}>
        {statusConfig?.label || status}
      </Badge>
    );
  };

  const getBloodGroupBadge = (bloodGroup) => {
    return <Badge bg="danger">{bloodGroup}</Badge>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="allopathy-patient-manager">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Patient Management</h4>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <FaPlus className="me-2" />
          Add Patient
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={3}>
              <InputGroup>
                <InputGroup.Text><FaSearch /></InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search patients..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </InputGroup>
            </Col>
            <Col md={2}>
              <Form.Select
                value={filters.hospital}
                onChange={(e) => setFilters({...filters, hospital: e.target.value})}
              >
                <option value="">All Hospitals</option>
                {hospitals.map(hospital => (
                  <option key={hospital.id} value={hospital.id}>{hospital.name}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="">All Status</option>
                {allopathyS3Config.patientStatus.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select
                value={filters.admission_type}
                onChange={(e) => setFilters({...filters, admission_type: e.target.value})}
              >
                <option value="">All Types</option>
                <option value="outpatient">Outpatient</option>
                <option value="inpatient">Inpatient</option>
                <option value="emergency">Emergency</option>
                <option value="surgery">Surgery</option>
                <option value="consultation">Consultation</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <div className="d-flex gap-2">
                <Button variant="outline-primary" onClick={fetchPatients}>
                  <FaFilter className="me-1" />
                  Apply
                </Button>
                <Button variant="outline-secondary" onClick={() => setFilters({hospital: '', status: '', admission_type: '', search: ''})}>
                  Clear
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Patients Table */}
      <Card>
        <Card.Body>
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Age/Gender</th>
                <th>Blood Group</th>
                <th>Admission</th>
                <th>Type</th>
                <th>Physician</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(patient => (
                <tr key={patient.id}>
                  <td>
                    <strong>{patient.patient_id}</strong>
                  </td>
                  <td>
                    <div>
                      <strong>{patient.full_name}</strong>
                      <br />
                      <small className="text-muted">{patient.phone}</small>
                    </div>
                  </td>
                  <td>
                    {patient.age} / {patient.gender}
                  </td>
                  <td>{getBloodGroupBadge(patient.blood_group)}</td>
                  <td>{formatDate(patient.admission_date)}</td>
                  <td>
                    <Badge bg="info">{patient.admission_type}</Badge>
                  </td>
                  <td>{patient.attending_physician}</td>
                  <td>{getStatusBadge(patient.status)}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-secondary" size="sm">
                        Actions
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleViewDetails(patient)}>
                          <FaEye className="me-2" />
                          View Details
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleUpdateVitals(patient)}>
                          <FaHeartbeat className="me-2" />
                          Update Vitals
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleEdit(patient)}>
                          <FaEdit className="me-2" />
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item 
                          onClick={() => handleDelete(patient)}
                          className="text-danger"
                        >
                          <FaTrash className="me-2" />
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {patients.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted">No patients found</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Patient Form Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedPatient ? 'Edit Patient' : 'Add New Patient'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Tabs defaultActiveKey="basic" className="mb-3">
              <Tab eventKey="basic" title="Basic Information">
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Hospital *</Form.Label>
                      <Form.Select
                        value={formData.hospital}
                        onChange={(e) => setFormData({...formData, hospital: e.target.value})}
                        required
                      >
                        <option value="">Select Hospital</option>
                        {hospitals.map(hospital => (
                          <option key={hospital.id} value={hospital.id}>{hospital.name}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Patient ID *</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.patient_id}
                        onChange={(e) => setFormData({...formData, patient_id: e.target.value})}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>First Name *</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.first_name}
                        onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name *</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.last_name}
                        onChange={(e) => setFormData({...formData, last_name: e.target.value})}
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
                        value={formData.date_of_birth}
                        onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
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
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                        <option value="N">Prefer not to say</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Blood Group</Form.Label>
                      <Form.Select
                        value={formData.blood_group}
                        onChange={(e) => setFormData({...formData, blood_group: e.target.value})}
                      >
                        {allopathyS3Config.bloodGroups.map(group => (
                          <option key={group} value={group}>{group}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
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
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Address *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    required
                  />
                </Form.Group>
              </Tab>

              <Tab eventKey="medical" title="Medical Information">
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Admission Date *</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        value={formData.admission_date}
                        onChange={(e) => setFormData({...formData, admission_date: e.target.value})}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Admission Type *</Form.Label>
                      <Form.Select
                        value={formData.admission_type}
                        onChange={(e) => setFormData({...formData, admission_type: e.target.value})}
                        required
                      >
                        <option value="outpatient">Outpatient</option>
                        <option value="inpatient">Inpatient</option>
                        <option value="emergency">Emergency</option>
                        <option value="surgery">Surgery</option>
                        <option value="consultation">Consultation</option>
                        <option value="follow_up">Follow-up</option>
                        <option value="routine_checkup">Routine Checkup</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Attending Physician *</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.attending_physician}
                        onChange={(e) => setFormData({...formData, attending_physician: e.target.value})}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                      >
                        {allopathyS3Config.patientStatus.map(status => (
                          <option key={status.value} value={status.value}>{status.label}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Allergies</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={formData.allergies}
                    onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                    placeholder="Known allergies"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Current Medications</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={formData.current_medications}
                    onChange={(e) => setFormData({...formData, current_medications: e.target.value})}
                    placeholder="Current medications"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Medical History</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.medical_history}
                    onChange={(e) => setFormData({...formData, medical_history: e.target.value})}
                    placeholder="Previous medical history"
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
                        value={formData.emergency_contact_name}
                        onChange={(e) => setFormData({...formData, emergency_contact_name: e.target.value})}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Emergency Contact Phone *</Form.Label>
                      <Form.Control
                        type="tel"
                        value={formData.emergency_contact_phone}
                        onChange={(e) => setFormData({...formData, emergency_contact_phone: e.target.value})}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Insurance Provider</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.insurance_provider}
                        onChange={(e) => setFormData({...formData, insurance_provider: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Insurance Number</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.insurance_number}
                        onChange={(e) => setFormData({...formData, insurance_number: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Additional notes"
                  />
                </Form.Group>
              </Tab>
            </Tabs>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {selectedPatient ? 'Update' : 'Create'} Patient
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Vital Signs Modal */}
      <Modal show={showVitalsModal} onHide={() => setShowVitalsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Vital Signs: {selectedPatient?.full_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleVitalsSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Temperature (°F)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    value={vitalsData.temperature}
                    onChange={(e) => setVitalsData({...vitalsData, temperature: e.target.value})}
                    placeholder="98.6"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Blood Pressure</Form.Label>
                  <Form.Control
                    type="text"
                    value={vitalsData.blood_pressure}
                    onChange={(e) => setVitalsData({...vitalsData, blood_pressure: e.target.value})}
                    placeholder="120/80"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Heart Rate (bpm)</Form.Label>
                  <Form.Control
                    type="number"
                    value={vitalsData.heart_rate}
                    onChange={(e) => setVitalsData({...vitalsData, heart_rate: e.target.value})}
                    placeholder="72"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Respiratory Rate</Form.Label>
                  <Form.Control
                    type="number"
                    value={vitalsData.respiratory_rate}
                    onChange={(e) => setVitalsData({...vitalsData, respiratory_rate: e.target.value})}
                    placeholder="16"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Oxygen Saturation (%)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="100"
                value={vitalsData.oxygen_saturation}
                onChange={(e) => setVitalsData({...vitalsData, oxygen_saturation: e.target.value})}
                placeholder="98"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVitalsModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleVitalsSubmit}>
            Update Vitals
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Patient Details Modal */}
      <Modal show={showDetails} onHide={() => setShowDetails(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Patient Details: {selectedPatient?.full_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPatient && patientSummary && (
            <Tabs defaultActiveKey="overview">
              <Tab eventKey="overview" title="Overview">
                <Row className="mt-3">
                  <Col md={6}>
                    <Card>
                      <Card.Header>Patient Information</Card.Header>
                      <Card.Body>
                        <p><strong>ID:</strong> {selectedPatient.patient_id}</p>
                        <p><strong>Name:</strong> {selectedPatient.full_name}</p>
                        <p><strong>Age:</strong> {selectedPatient.age}</p>
                        <p><strong>Gender:</strong> {selectedPatient.gender}</p>
                        <p><strong>Blood Group:</strong> {getBloodGroupBadge(selectedPatient.blood_group)}</p>
                        <p><strong>Status:</strong> {getStatusBadge(selectedPatient.status)}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card>
                      <Card.Header>Medical Summary</Card.Header>
                      <Card.Body>
                        <p><strong>Files:</strong> {selectedPatient.file_count}</p>
                        <p><strong>Analyses:</strong> {selectedPatient.analysis_count}</p>
                        <p><strong>Admission:</strong> {formatDate(selectedPatient.admission_date)}</p>
                        <p><strong>Type:</strong> {selectedPatient.admission_type}</p>
                        <p><strong>Physician:</strong> {selectedPatient.attending_physician}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab>
              
              <Tab eventKey="medical" title="Medical Records">
                <div className="mt-3">
                  {patientSummary.medical_records?.length > 0 ? (
                    patientSummary.medical_records.map((record, index) => (
                      <Card key={index} className="mb-3">
                        <Card.Header>
                          Medical Record - {formatDate(record.admission_date)}
                        </Card.Header>
                        <Card.Body>
                          <p><strong>Chief Complaint:</strong> {record.chief_complaint}</p>
                          <p><strong>Assessment:</strong> {record.assessment_and_plan}</p>
                          <p><strong>Physician:</strong> {record.attending_physician}</p>
                        </Card.Body>
                      </Card>
                    ))
                  ) : (
                    <Alert variant="info">No medical records available</Alert>
                  )}
                </div>
              </Tab>

              <Tab eventKey="files" title="Files">
                <div className="mt-3">
                  {patientSummary.recent_files?.length > 0 ? (
                    <Table striped>
                      <thead>
                        <tr>
                          <th>File Name</th>
                          <th>Category</th>
                          <th>Upload Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {patientSummary.recent_files.map((file, index) => (
                          <tr key={index}>
                            <td>{file.original_name}</td>
                            <td><Badge bg="info">{file.category}</Badge></td>
                            <td>{formatDate(file.upload_date)}</td>
                            <td><Badge bg="success">{file.status}</Badge></td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <Alert variant="info">No files uploaded</Alert>
                  )}
                </div>
              </Tab>

              <Tab eventKey="analyses" title="Analyses">
                <div className="mt-3">
                  {patientSummary.recent_analyses?.length > 0 ? (
                    patientSummary.recent_analyses.map((analysis, index) => (
                      <Card key={index} className="mb-3">
                        <Card.Header>
                          {analysis.analysis_type} - {formatDate(analysis.created_at)}
                        </Card.Header>
                        <Card.Body>
                          <p><strong>Confidence:</strong> {(analysis.confidence_score * 100).toFixed(1)}%</p>
                          <p><strong>Status:</strong> <Badge bg="success">{analysis.status}</Badge></p>
                          {analysis.recommendations && (
                            <p><strong>Recommendations:</strong> {analysis.recommendations}</p>
                          )}
                        </Card.Body>
                      </Card>
                    ))
                  ) : (
                    <Alert variant="info">No analyses available</Alert>
                  )}
                </div>
              </Tab>
            </Tabs>
          )}
          
          {!patientSummary && (
            <div className="text-center py-4">
              <Spinner animation="border" />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetails(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AllopathyPatientManager;
