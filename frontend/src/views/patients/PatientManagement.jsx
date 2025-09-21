import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Table, 
  Form, 
  Modal, 
  Badge, 
  InputGroup,
  Pagination,
  Dropdown,
  Alert,
  Spinner
} from 'react-bootstrap';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaEye,
  FaUserMd,
  FaCalendarAlt,
  FaHeartbeat,
  FaFileAlt,
  FaDownload,
  FaFilter
} from 'react-icons/fa';
import patientService from '../../services/patientService';
import PatientForm from './PatientForm';
import PatientDetail from './PatientDetail';
import './PatientManagement.css';

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showPatientDetail, setShowPatientDetail] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filters, setFilters] = useState({
    gender: '',
    age_range: '',
    status: 'active'
  });

  useEffect(() => {
    fetchPatients();
  }, [currentPage, filters]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        search: searchTerm,
        ...filters
      };
      const response = await patientService.getPatients(params);
      setPatients(response.results || response);
      setTotalPages(Math.ceil((response.count || response.length) / 10));
      setError(null);
    } catch (err) {
      setError('Failed to fetch patients');
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setCurrentPage(1);
    await fetchPatients();
  };

  const handleCreatePatient = () => {
    setSelectedPatient(null);
    setIsEditing(false);
    setShowPatientForm(true);
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setIsEditing(true);
    setShowPatientForm(true);
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowPatientDetail(true);
  };

  const handleDeletePatient = async (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await patientService.deletePatient(patientId);
        await fetchPatients();
      } catch (err) {
        setError('Failed to delete patient');
        console.error('Error deleting patient:', err);
      }
    }
  };

  const handleFormSubmit = async (patientData) => {
    try {
      if (isEditing) {
        await patientService.updatePatient(selectedPatient.id, patientData);
      } else {
        await patientService.createPatient(patientData);
      }
      setShowPatientForm(false);
      await fetchPatients();
    } catch (err) {
      setError('Failed to save patient');
      console.error('Error saving patient:', err);
    }
  };

  const handleExport = async (format) => {
    try {
      const blob = await patientService.exportPatients(format, filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `patients.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to export patients');
      console.error('Error exporting patients:', err);
    }
  };

  const getStatusBadge = (isActive) => {
    return (
      <Badge bg={isActive ? 'success' : 'secondary'}>
        {isActive ? 'Active' : 'Inactive'}
      </Badge>
    );
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Container fluid className="patient-management">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0">
              <FaUserMd className="me-2" />
              Patient Management
            </h2>
            <div className="d-flex gap-2">
              <Dropdown>
                <Dropdown.Toggle variant="outline-primary" size="sm">
                  <FaDownload className="me-1" />
                  Export
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleExport('csv')}>
                    Export as CSV
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleExport('excel')}>
                    Export as Excel
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Button variant="primary" onClick={handleCreatePatient}>
                <FaPlus className="me-1" />
                Add Patient
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      {/* Search and Filters */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSearch}>
                <Row>
                  <Col md={4}>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="Search patients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <Button variant="outline-secondary" type="submit">
                        <FaSearch />
                      </Button>
                    </InputGroup>
                  </Col>
                  <Col md={2}>
                    <Form.Select
                      value={filters.gender}
                      onChange={(e) => setFilters({...filters, gender: e.target.value})}
                    >
                      <option value="">All Genders</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Form.Select>
                  </Col>
                  <Col md={2}>
                    <Form.Select
                      value={filters.age_range}
                      onChange={(e) => setFilters({...filters, age_range: e.target.value})}
                    >
                      <option value="">All Ages</option>
                      <option value="0-18">0-18 years</option>
                      <option value="18-30">18-30 years</option>
                      <option value="30-50">30-50 years</option>
                      <option value="50-70">50-70 years</option>
                      <option value="70+">70+ years</option>
                    </Form.Select>
                  </Col>
                  <Col md={2}>
                    <Form.Select
                      value={filters.status}
                      onChange={(e) => setFilters({...filters, status: e.target.value})}
                    >
                      <option value="">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </Form.Select>
                  </Col>
                  <Col md={2}>
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => setFilters({gender: '', age_range: '', status: 'active'})}
                    >
                      <FaFilter className="me-1" />
                      Clear
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Patients Table */}
      <Row>
        <Col>
          <Card>
            <Card.Body>
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" />
                  <p className="mt-2">Loading patients...</p>
                </div>
              ) : (
                <>
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>Patient ID</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Primary Physician</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.map((patient) => (
                        <tr key={patient.id}>
                          <td>
                            <Badge bg="light" text="dark">{patient.patient_id}</Badge>
                          </td>
                          <td>
                            <strong>{patient.first_name} {patient.last_name}</strong>
                          </td>
                          <td>{calculateAge(patient.date_of_birth)}</td>
                          <td className="text-capitalize">{patient.gender}</td>
                          <td>{patient.phone}</td>
                          <td>{patient.email}</td>
                          <td>
                            {patient.primary_physician ? 
                              patient.primary_physician.full_name : 
                              <span className="text-muted">Not assigned</span>
                            }
                          </td>
                          <td>{getStatusBadge(patient.is_active)}</td>
                          <td>
                            <div className="btn-group" role="group">
                              <Button
                                variant="outline-info"
                                size="sm"
                                onClick={() => handleViewPatient(patient)}
                                title="View Details"
                              >
                                <FaEye />
                              </Button>
                              <Button
                                variant="outline-warning"
                                size="sm"
                                onClick={() => handleEditPatient(patient)}
                                title="Edit Patient"
                              >
                                <FaEdit />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDeletePatient(patient.id)}
                                title="Delete Patient"
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  {patients.length === 0 && (
                    <div className="text-center py-5">
                      <p className="text-muted">No patients found</p>
                    </div>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-4">
                      <Pagination>
                        <Pagination.Prev 
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(currentPage - 1)}
                        />
                        {[...Array(totalPages)].map((_, index) => (
                          <Pagination.Item
                            key={index + 1}
                            active={index + 1 === currentPage}
                            onClick={() => setCurrentPage(index + 1)}
                          >
                            {index + 1}
                          </Pagination.Item>
                        ))}
                        <Pagination.Next 
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(currentPage + 1)}
                        />
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Patient Form Modal */}
      <PatientForm
        show={showPatientForm}
        onHide={() => setShowPatientForm(false)}
        patient={selectedPatient}
        isEditing={isEditing}
        onSubmit={handleFormSubmit}
      />

      {/* Patient Detail Modal */}
      <PatientDetail
        show={showPatientDetail}
        onHide={() => setShowPatientDetail(false)}
        patient={selectedPatient}
      />
    </Container>
  );
};

export default PatientManagement;
