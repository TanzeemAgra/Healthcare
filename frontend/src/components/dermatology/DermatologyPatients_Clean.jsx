import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Form, InputGroup, Modal, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import apiClient from '../../services/api';
import { DERMATOLOGY_ENDPOINTS } from '../../services/apiConstants';

const DermatologyPatients = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    skin_type: '',
    primary_concern: '',
    consent_treatment: false
  });

  const loadPatients = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(DERMATOLOGY_ENDPOINTS.PATIENTS);
      setPatients(response.data || []);
      setFilteredPatients(response.data || []);
    } catch (error) {
      console.error('Failed to load patients:', error);
      toast.error('Failed to load patients');
      setPatients([]);
      setFilteredPatients([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    let filtered = patients;
    if (searchTerm) {
      filtered = patients.filter(patient => {
        const patientName = patient.user?.first_name && patient.user?.last_name 
          ? `${patient.user.first_name} ${patient.user.last_name}`
          : patient.name || '';
        return patientName.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
    setFilteredPatients(filtered);
  }, [patients, searchTerm]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await apiClient.post(DERMATOLOGY_ENDPOINTS.PATIENTS, formData);
      toast.success('Patient added successfully!');
      setShowAddModal(false);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        gender: '',
        skin_type: '',
        primary_concern: '',
        consent_treatment: false
      });
      loadPatients();
    } catch (error) {
      console.error('Failed to add patient:', error);
      toast.error('Failed to add patient');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAllPatients = async () => {
    if (!window.confirm('Are you sure you want to delete ALL patients?')) return;
    
    setIsLoading(true);
    try {
      await apiClient.delete(DERMATOLOGY_ENDPOINTS.DELETE_ALL);
      toast.success('All patients deleted successfully!');
      setPatients([]);
      setFilteredPatients([]);
    } catch (error) {
      console.error('Failed to delete patients:', error);
      toast.error('Failed to delete patients');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPatientRow = (patient) => {
    const patientName = patient.user?.first_name && patient.user?.last_name 
      ? `${patient.user.first_name} ${patient.user.last_name}`
      : patient.name || 'Unknown Patient';
    const patientAge = patient.user?.age || patient.age || 'N/A';
    const patientGender = patient.user?.gender || patient.gender || 'N/A';
    const patientPhone = patient.user?.phone_number || patient.phone || 'N/A';
    const patientCondition = patient.condition || patient.primary_concern || 'General Consultation';
    
    return (
      <tr key={patient.id}>
        <td>
          <div className="d-flex align-items-center">
            <div className="avatar-circle bg-primary text-white me-3 d-flex align-items-center justify-content-center"
                 style={{width: '40px', height: '40px', borderRadius: '50%', fontSize: '14px', fontWeight: 'bold'}}>
              {patientName.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="fw-medium">{patientName}</div>
              <small className="text-muted">{patientAge} yrs, {patientGender}</small>
            </div>
          </div>
        </td>
        <td>{patientCondition}</td>
        <td>{patientPhone}</td>
        <td>
          <Badge bg="success">Active</Badge>
        </td>
        <td>
          <Button variant="outline-primary" size="sm">
            <i className="ri-eye-line"></i>
          </Button>
        </td>
      </tr>
    );
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3 mb-0">Dermatology Patients</h1>
            <div className="d-flex gap-2">
              <Button variant="primary" onClick={() => setShowAddModal(true)}>
                <i className="ri-add-line me-2"></i>
                Add New Patient
              </Button>
              <Button variant="outline-secondary" onClick={loadPatients} disabled={isLoading}>
                <i className="ri-refresh-line me-2"></i>
                Refresh
              </Button>
              <Button variant="outline-danger" onClick={handleDeleteAllPatients} disabled={isLoading}>
                <i className="ri-delete-bin-line me-2"></i>
                Delete All
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
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
        <Col md={6}>
          <div className="text-muted small">
            {filteredPatients.length} of {patients.length} patients
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <div className="table-responsive">
                <Table striped hover>
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Condition</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          <Spinner animation="border" size="sm" className="me-2" />
                          Loading patients...
                        </td>
                      </tr>
                    ) : filteredPatients.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4 text-muted">
                          <i className="ri-user-line fs-2 d-block mb-2"></i>
                          No patients found
                        </td>
                      </tr>
                    ) : (
                      filteredPatients.map(patient => renderPatientRow(patient))
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-user-add-line me-2"></i>
            Add New Patient
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    placeholder="Enter first name"
                    required
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    placeholder="Enter last name"
                    required
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone"
                    required
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date of Birth <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Gender <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Skin Type <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="skin_type"
                    value={formData.skin_type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select skin type</option>
                    <option value="Type I">Type I - Very Fair</option>
                    <option value="Type II">Type II - Fair</option>
                    <option value="Type III">Type III - Medium</option>
                    <option value="Type IV">Type IV - Olive</option>
                    <option value="Type V">Type V - Brown</option>
                    <option value="Type VI">Type VI - Black</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Primary Concern <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="primary_concern"
                    value={formData.primary_concern}
                    onChange={handleInputChange}
                    placeholder="Describe the main concern"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Check
                  type="checkbox"
                  name="consent_treatment"
                  checked={formData.consent_treatment}
                  onChange={handleInputChange}
                  label="I consent to treatment"
                  required
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="outline-secondary" 
              onClick={() => setShowAddModal(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
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
    </Container>
  );
};

export default DermatologyPatients;
