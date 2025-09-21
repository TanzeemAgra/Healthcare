import React, { useState, useEffect } from "react";
import { 
  Col, 
  Row, 
  Table, 
  Button, 
  Form, 
  Modal, 
  Alert, 
  Badge, 
  InputGroup,
  Spinner,
  OverlayTrigger,
  Tooltip,
  Dropdown,
  ButtonGroup,
  ProgressBar
} from "react-bootstrap";
import { useSelector } from 'react-redux';
import Card from "../../components/Card";
import AddDoctorForm from './AddDoctorForm';
import EditDoctorForm from './EditDoctorForm';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import { doctorAPI } from '../../services/api';
import { 
  RiUserAddLine, 
  RiEditLine, 
  RiDeleteBinLine, 
  RiSearchLine,
  RiRefreshLine,
  RiEyeLine,
  RiStethoscopeLine,
  RiPhoneLine,
  RiMailLine,
  RiFilterLine,
  RiDownloadLine,
  RiUploadLine,
  RiSettings3Line,
  RiTeamLine,
  RiMedalLine,
  RiCalendarLine,
  RiMapPinLine,
  RiShieldCheckLine
} from '@remixicon/react';

// Custom styles for enhanced UI
const customStyles = `
  .bg-gradient-primary {
    background: linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%);
  }
  .bg-gradient-light {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  }
  .table-hover tbody tr:hover {
    background-color: rgba(13, 110, 253, 0.05);
    transform: translateY(-1px);
    transition: all 0.2s ease;
  }
  .card {
    transition: all 0.3s ease;
  }
  .card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.1) !important;
  }
  .modal.fade .modal-dialog {
    transition: transform 0.4s ease-out;
  }
  .btn-group .btn {
    transition: all 0.2s ease;
  }
  .btn-group .btn:hover {
    transform: translateY(-1px);
  }
  .progress {
    background-color: rgba(0,0,0,0.1);
  }
`;

const DoctorList = () => {
  const { accessToken } = useSelector(state => state.auth);
  
  // Inject custom styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = customStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  // State management
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [alert, setAlert] = useState({ show: false, variant: '', message: '' });
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    specializations: {},
    avgExperience: 0
  });

  // Load data on component mount
  useEffect(() => {
    loadDoctors();
  }, []);

  // Calculate statistics when doctors change
  useEffect(() => {
    calculateStats();
  }, [doctors]);

  // Calculate statistics
  const calculateStats = () => {
    const total = doctors.length;
    const available = doctors.filter(d => d.is_available_emergency !== false).length;
    const specializations = {};
    let totalExperience = 0;

    doctors.forEach(doctor => {
      const spec = doctor.specialization || 'General';
      specializations[spec] = (specializations[spec] || 0) + 1;
      totalExperience += doctor.years_experience || 0;
    });

    setStats({
      total,
      available,
      specializations,
      avgExperience: total > 0 ? Math.round(totalExperience / total) : 0
    });
  };

  // Load doctors from API
  const loadDoctors = async () => {
    setLoading(true);
    try {
      const response = await doctorAPI.getDoctors();
      const doctorsData = response.data.results || response.data;
      setDoctors(doctorsData);
      setAlert({ show: false });
    } catch (err) {
      console.error('Error loading doctors:', err);
      // Fallback to mock data
      setDoctors(mockDoctors);
      setAlert({ 
        show: true, 
        variant: 'warning', 
        message: 'Using demo data - API connection failed. Please check your authentication.' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Mock data for testing
  const mockDoctors = [
    {
      id: 1,
      user: {
        first_name: "Sarah",
        last_name: "Johnson",
        email: "sarah.johnson@hospital.com"
      },
      full_name: "Dr. Sarah Johnson",
      phone_number: "+1-555-0101",
      specialization: "Cardiology",
      years_experience: 15,
      is_available_emergency: true
    },
    {
      id: 2,
      user: {
        first_name: "Michael",
        last_name: "Chen", 
        email: "michael.chen@hospital.com"
      },
      full_name: "Dr. Michael Chen",
      phone_number: "+1-555-0102",
      specialization: "Neurology",
      years_experience: 12,
      is_available_emergency: true
    }
  ];

  // Enhanced filtering function
  const filteredDoctors = doctors.filter(doctor => {
    const searchMatch = !searchTerm || 
      (doctor.full_name || `${doctor.user?.first_name} ${doctor.user?.last_name}`)
        .toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doctor.user?.email || doctor.email || '')
        .toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doctor.specialization || '')
        .toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doctor.license_number || '')
        .toLowerCase().includes(searchTerm.toLowerCase());

    const specializationMatch = !selectedSpecialization || 
      (doctor.specialization || 'general') === selectedSpecialization;

    const statusMatch = !selectedStatus || 
      (selectedStatus === 'available' && doctor.is_available_emergency !== false) ||
      (selectedStatus === 'unavailable' && doctor.is_available_emergency === false);

    return searchMatch && specializationMatch && statusMatch;
  }).sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'name':
        aValue = (a.full_name || `${a.user?.first_name} ${a.user?.last_name}`).toLowerCase();
        bValue = (b.full_name || `${b.user?.first_name} ${b.user?.last_name}`).toLowerCase();
        break;
      case 'specialization':
        aValue = (a.specialization || 'general').toLowerCase();
        bValue = (b.specialization || 'general').toLowerCase();
        break;
      case 'experience':
        aValue = a.years_experience || 0;
        bValue = b.years_experience || 0;
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Get unique specializations for filter dropdown
  const uniqueSpecializations = [...new Set(doctors.map(d => d.specialization || 'general'))];

  // Success handlers
  const handleAddSuccess = (newDoctor) => {
    setDoctors(prev => [...prev, newDoctor]);
    setAlert({ 
      show: true, 
      variant: 'success', 
      message: `Doctor ${newDoctor.user?.first_name} ${newDoctor.user?.last_name} created successfully!` 
    });
    closeModal();
  };

  const handleEditSuccess = (updatedDoctor) => {
    setDoctors(prev => prev.map(doctor => 
      doctor.id === updatedDoctor.id ? updatedDoctor : doctor
    ));
    setAlert({ 
      show: true, 
      variant: 'success', 
      message: 'Doctor updated successfully!' 
    });
    closeModal();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDoctor) return;
    
    setLoading(true);
    try {
      await doctorAPI.deleteDoctor(selectedDoctor.id);
      setDoctors(prev => prev.filter(doctor => doctor.id !== selectedDoctor.id));
      setAlert({ 
        show: true, 
        variant: 'success', 
        message: `Doctor ${selectedDoctor.full_name || `${selectedDoctor.user?.first_name} ${selectedDoctor.user?.last_name}`} deleted successfully!` 
      });
      closeModal();
    } catch (err) {
      setAlert({ 
        show: true, 
        variant: 'danger', 
        message: 'Failed to delete doctor' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Refresh doctors list
  const handleRefresh = () => {
    loadDoctors();
  };

  // Open modal
  const openModal = (type, doctor = null) => {
    setModalType(type);
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedDoctor(null);
  };

  return (
    <>
      {/* Alert */}
      {alert.show && (
        <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible className="shadow-sm">
          <div className="d-flex align-items-center">
            <i className={`ri-${alert.variant === 'warning' ? 'alert' : alert.variant === 'success' ? 'check-double' : 'error-warning'}-line me-2`}></i>
            {alert.message}
          </div>
        </Alert>
      )}

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col xl={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-3">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                    <RiTeamLine size={24} className="text-primary" />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h3 className="mb-0 fw-bold text-primary">{stats.total}</h3>
                  <p className="text-muted mb-0 small">Total Doctors</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-3">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                    <RiShieldCheckLine size={24} className="text-success" />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h3 className="mb-0 fw-bold text-success">{stats.available}</h3>
                  <p className="text-muted mb-0 small">Available for Emergency</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-3">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-info bg-opacity-10 p-3 rounded-circle">
                    <RiMedalLine size={24} className="text-info" />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h3 className="mb-0 fw-bold text-info">{stats.avgExperience}</h3>
                  <p className="text-muted mb-0 small">Avg. Experience (Years)</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-3">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-warning bg-opacity-10 p-3 rounded-circle">
                    <RiStethoscopeLine size={24} className="text-warning" />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h3 className="mb-0 fw-bold text-warning">{Object.keys(stats.specializations).length}</h3>
                  <p className="text-muted mb-0 small">Specializations</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-gradient-primary text-white border-0">
              <div className="d-flex justify-content-between align-items-center">
                <Card.Header.Title>
                  <h4 className="card-title d-flex align-items-center mb-0">
                    <RiStethoscopeLine size={28} className="me-3" />
                    <div>
                      <div>Doctor Management System</div>
                      <small className="opacity-75 fw-normal">Manage healthcare professionals efficiently</small>
                    </div>
                  </h4>
                </Card.Header.Title>
                <div className="d-flex gap-2">
                  <Dropdown>
                    <Dropdown.Toggle variant="outline-light" size="sm" className="border-white">
                      <RiSettings3Line size={16} className="me-1" />
                      Actions
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}>
                        <i className={`ri-${viewMode === 'table' ? 'grid' : 'table'}-line me-2`}></i>
                        {viewMode === 'table' ? 'Grid View' : 'Table View'}
                      </Dropdown.Item>
                      <Dropdown.Item>
                        <RiDownloadLine size={16} className="me-2" />
                        Export Data
                      </Dropdown.Item>
                      <Dropdown.Item>
                        <RiUploadLine size={16} className="me-2" />
                        Import Data
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <Button variant="outline-light" size="sm" onClick={handleRefresh} disabled={loading} className="border-white">
                    <RiRefreshLine size={16} className="me-1" />
                    {loading ? 'Loading...' : 'Refresh'}
                  </Button>
                  <Button variant="light" size="sm" onClick={() => openModal('add')} className="fw-semibold">
                    <RiUserAddLine size={16} className="me-1" />
                    Add Doctor
                  </Button>
                </div>
              </div>
            </Card.Header>
            
            <Card.Body className="p-4">
              {/* Advanced Search and Filter Controls */}
              <div className="bg-light rounded-3 p-3 mb-4">
                <Row className="g-3">
                  <Col lg={4}>
                    <Form.Label className="fw-semibold text-dark small mb-2">
                      <RiSearchLine size={16} className="me-1" />
                      Search Doctors
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-white border-end-0">
                        <RiSearchLine size={16} className="text-muted" />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Search by name, email, specialization, license..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border-start-0 ps-0"
                      />
                    </InputGroup>
                  </Col>
                  <Col lg={3}>
                    <Form.Label className="fw-semibold text-dark small mb-2">
                      <RiStethoscopeLine size={16} className="me-1" />
                      Specialization
                    </Form.Label>
                    <Form.Select
                      value={selectedSpecialization}
                      onChange={(e) => setSelectedSpecialization(e.target.value)}
                    >
                      <option value="">All Specializations</option>
                      {uniqueSpecializations.map(spec => (
                        <option key={spec} value={spec}>
                          {spec.charAt(0).toUpperCase() + spec.slice(1)}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col lg={2}>
                    <Form.Label className="fw-semibold text-dark small mb-2">
                      <RiShieldCheckLine size={16} className="me-1" />
                      Availability
                    </Form.Label>
                    <Form.Select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="">All Status</option>
                      <option value="available">Available</option>
                      <option value="unavailable">Unavailable</option>
                    </Form.Select>
                  </Col>
                  <Col lg={3}>
                    <Form.Label className="fw-semibold text-dark small mb-2">
                      <RiFilterLine size={16} className="me-1" />
                      Sort By
                    </Form.Label>
                    <div className="d-flex gap-2">
                      <Form.Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="flex-grow-1"
                      >
                        <option value="name">Name</option>
                        <option value="specialization">Specialization</option>
                        <option value="experience">Experience</option>
                      </Form.Select>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="px-3"
                      >
                        <i className={`ri-sort-${sortOrder === 'asc' ? 'asc' : 'desc'}`}></i>
                      </Button>
                    </div>
                  </Col>
                </Row>
                
                {/* Filter Summary */}
                <div className="mt-3 d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <span className="text-muted small">
                      Showing <strong>{filteredDoctors.length}</strong> of <strong>{doctors.length}</strong> doctors
                    </span>
                    {(searchTerm || selectedSpecialization || selectedStatus) && (
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedSpecialization('');
                          setSelectedStatus('');
                        }}
                      >
                        <i className="ri-close-line me-1"></i>
                        Clear Filters
                      </Button>
                    )}
                  </div>
                  {filteredDoctors.length > 0 && (
                    <ProgressBar 
                      now={(stats.available / stats.total) * 100} 
                      variant="success" 
                      style={{ width: '120px', height: '8px' }}
                      className="rounded-pill"
                    />
                  )}
                </div>
              </div>

              {/* Enhanced Doctors Table */}
              {loading ? (
                <div className="text-center py-5">
                  <div className="mb-3">
                    <Spinner animation="border" role="status" variant="primary" style={{ width: '3rem', height: '3rem' }}>
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                  <h5 className="text-muted">Loading doctors...</h5>
                  <p className="text-muted small">Please wait while we fetch the latest data</p>
                </div>
              ) : filteredDoctors.length === 0 ? (
                <div className="text-center py-5">
                  <div className="mb-3">
                    <i className="ri-user-search-line text-muted" style={{ fontSize: '4rem' }}></i>
                  </div>
                  <h5 className="text-muted">No doctors found</h5>
                  <p className="text-muted mb-3">
                    {doctors.length === 0 
                      ? "No doctors have been registered yet." 
                      : "No doctors match your search criteria."}
                  </p>
                  {doctors.length === 0 && (
                    <Button variant="primary" onClick={() => openModal('add')}>
                      <RiUserAddLine size={16} className="me-1" />
                      Add First Doctor
                    </Button>
                  )}
                </div>
              ) : (
                <div className="table-responsive">
                  <Table className="table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th className="border-0 fw-semibold text-dark">
                          <div className="d-flex align-items-center">
                            <RiUserAddLine size={16} className="me-2 text-primary" />
                            Doctor Information
                          </div>
                        </th>
                        <th className="border-0 fw-semibold text-dark">
                          <div className="d-flex align-items-center">
                            <RiStethoscopeLine size={16} className="me-2 text-success" />
                            Specialization
                          </div>
                        </th>
                        <th className="border-0 fw-semibold text-dark">
                          <div className="d-flex align-items-center">
                            <RiMedalLine size={16} className="me-2 text-info" />
                            Experience
                          </div>
                        </th>
                        <th className="border-0 fw-semibold text-dark">
                          <div className="d-flex align-items-center">
                            <RiPhoneLine size={16} className="me-2 text-warning" />
                            Contact
                          </div>
                        </th>
                        <th className="border-0 fw-semibold text-dark">
                          <div className="d-flex align-items-center">
                            <RiShieldCheckLine size={16} className="me-2 text-success" />
                            Status
                          </div>
                        </th>
                        <th className="border-0 fw-semibold text-dark text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDoctors.map((doctor, index) => (
                        <tr key={doctor.id} className="border-bottom">
                          <td className="py-3">
                            <div className="d-flex align-items-center">
                              <div className="flex-shrink-0 me-3">
                                <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                                  <span className="fw-bold text-primary">
                                    {(doctor.user?.first_name?.[0] || 'D') + (doctor.user?.last_name?.[0] || 'R')}
                                  </span>
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <div className="fw-bold text-dark">
                                  {doctor.full_name || `Dr. ${doctor.user?.first_name} ${doctor.user?.last_name}`}
                                </div>
                                <div className="small text-muted">
                                  <RiMapPinLine size={12} className="me-1" />
                                  License: {doctor.license_number || 'N/A'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3">
                            <Badge 
                              bg="primary" 
                              className="px-3 py-2 rounded-pill fw-normal"
                              style={{ fontSize: '0.85rem' }}
                            >
                              {(doctor.specialization || 'General').charAt(0).toUpperCase() + (doctor.specialization || 'General').slice(1)}
                            </Badge>
                          </td>
                          <td className="py-3">
                            <div className="d-flex align-items-center">
                              <div className="flex-grow-1">
                                <div className="fw-semibold text-dark">
                                  {doctor.years_experience || doctor.experience_years || 0} years
                                </div>
                                <div className="small text-muted">
                                  {doctor.qualification || 'MBBS'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="small">
                              <div className="mb-1">
                                <RiMailLine size={14} className="me-2 text-primary" />
                                <span className="text-dark">{doctor.user?.email || doctor.email}</span>
                              </div>
                              <div>
                                <RiPhoneLine size={14} className="me-2 text-success" />
                                <span className="text-dark">{doctor.phone_number || 'N/A'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="d-flex flex-column gap-1">
                              <Badge 
                                bg={doctor.is_available_emergency !== false ? "success" : "secondary"}
                                className="px-2 py-1 rounded-pill small"
                              >
                                <i className={`ri-${doctor.is_available_emergency !== false ? 'check' : 'close'}-circle-line me-1`}></i>
                                {doctor.is_available_emergency !== false ? "Available" : "Unavailable"}
                              </Badge>
                              {doctor.consultation_fee && (
                                <span className="small text-muted">
                                  Fee: ${doctor.consultation_fee}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 text-center">
                            <ButtonGroup size="sm">
                              <OverlayTrigger placement="top" overlay={<Tooltip>View Details</Tooltip>}>
                                <Button
                                  variant="outline-info"
                                  onClick={() => openModal('view', doctor)}
                                  className="border-0"
                                >
                                  <RiEyeLine size={14} />
                                </Button>
                              </OverlayTrigger>
                              <OverlayTrigger placement="top" overlay={<Tooltip>Edit Doctor</Tooltip>}>
                                <Button
                                  variant="outline-primary"
                                  onClick={() => openModal('edit', doctor)}
                                  className="border-0"
                                >
                                  <RiEditLine size={14} />
                                </Button>
                              </OverlayTrigger>
                              <OverlayTrigger placement="top" overlay={<Tooltip>Delete Doctor</Tooltip>}>
                                <Button
                                  variant="outline-danger"
                                  onClick={() => openModal('delete', doctor)}
                                  className="border-0"
                                >
                                  <RiDeleteBinLine size={14} />
                                </Button>
                              </OverlayTrigger>
                            </ButtonGroup>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Enhanced Professional Modal */}
      <Modal show={showModal} onHide={closeModal} size="xl" centered className="fade">
        <Modal.Header closeButton className="bg-gradient-light border-0 py-3">
          <Modal.Title className="d-flex align-items-center">
            {modalType === 'add' && (
              <>
                <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3">
                  <RiUserAddLine size={20} className="text-primary" />
                </div>
                <div>
                  <div className="fw-bold">Add New Doctor</div>
                  <small className="text-muted fw-normal">Register a new healthcare professional</small>
                </div>
              </>
            )}
            {modalType === 'edit' && (
              <>
                <div className="bg-success bg-opacity-10 p-2 rounded-circle me-3">
                  <RiEditLine size={20} className="text-success" />
                </div>
                <div>
                  <div className="fw-bold">Edit Doctor Profile</div>
                  <small className="text-muted fw-normal">Update professional information</small>
                </div>
              </>
            )}
            {modalType === 'delete' && (
              <>
                <div className="bg-danger bg-opacity-10 p-2 rounded-circle me-3">
                  <RiDeleteBinLine size={20} className="text-danger" />
                </div>
                <div>
                  <div className="fw-bold">Delete Doctor</div>
                  <small className="text-muted fw-normal">Permanently remove doctor record</small>
                </div>
              </>
            )}
            {modalType === 'view' && (
              <>
                <div className="bg-info bg-opacity-10 p-2 rounded-circle me-3">
                  <RiEyeLine size={20} className="text-info" />
                </div>
                <div>
                  <div className="fw-bold">Doctor Details</div>
                  <small className="text-muted fw-normal">Complete professional profile</small>
                </div>
              </>
            )}
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="p-0">
          {modalType === 'view' && selectedDoctor && (
            <div className="p-4">
              {/* Professional Doctor Profile View */}
              <Row>
                <Col md={4} className="text-center mb-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '120px', height: '120px' }}>
                    <span className="fw-bold text-primary" style={{ fontSize: '2.5rem' }}>
                      {(selectedDoctor.user?.first_name?.[0] || 'D') + (selectedDoctor.user?.last_name?.[0] || 'R')}
                    </span>
                  </div>
                  <h4 className="fw-bold text-dark">
                    {selectedDoctor.full_name || `Dr. ${selectedDoctor.user?.first_name} ${selectedDoctor.user?.last_name}`}
                  </h4>
                  <Badge 
                    bg="primary" 
                    className="px-3 py-2 rounded-pill mb-2"
                    style={{ fontSize: '0.9rem' }}
                  >
                    {(selectedDoctor.specialization || 'General').charAt(0).toUpperCase() + (selectedDoctor.specialization || 'General').slice(1)}
                  </Badge>
                  <div className="text-muted">
                    <div><strong>{selectedDoctor.years_experience || selectedDoctor.experience_years || 0}</strong> years of experience</div>
                  </div>
                </Col>
                <Col md={8}>
                  <Row>
                    <Col sm={6} className="mb-3">
                      <Card className="border-0 bg-light h-100">
                        <Card.Body className="p-3">
                          <div className="d-flex align-items-center mb-2">
                            <RiMailLine size={18} className="text-primary me-2" />
                            <h6 className="mb-0 fw-semibold">Email</h6>
                          </div>
                          <p className="mb-0 text-dark">{selectedDoctor.user?.email || selectedDoctor.email}</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col sm={6} className="mb-3">
                      <Card className="border-0 bg-light h-100">
                        <Card.Body className="p-3">
                          <div className="d-flex align-items-center mb-2">
                            <RiPhoneLine size={18} className="text-success me-2" />
                            <h6 className="mb-0 fw-semibold">Phone</h6>
                          </div>
                          <p className="mb-0 text-dark">{selectedDoctor.phone_number || 'N/A'}</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col sm={6} className="mb-3">
                      <Card className="border-0 bg-light h-100">
                        <Card.Body className="p-3">
                          <div className="d-flex align-items-center mb-2">
                            <RiMedalLine size={18} className="text-warning me-2" />
                            <h6 className="mb-0 fw-semibold">License</h6>
                          </div>
                          <p className="mb-0 text-dark">{selectedDoctor.license_number || 'N/A'}</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col sm={6} className="mb-3">
                      <Card className="border-0 bg-light h-100">
                        <Card.Body className="p-3">
                          <div className="d-flex align-items-center mb-2">
                            <RiShieldCheckLine size={18} className="text-info me-2" />
                            <h6 className="mb-0 fw-semibold">Qualification</h6>
                          </div>
                          <p className="mb-0 text-dark">{selectedDoctor.qualification || 'MBBS'}</p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                  
                  {/* Additional Information */}
                  <Card className="border-0 bg-light">
                    <Card.Body className="p-3">
                      <Row>
                        <Col sm={6}>
                          <div className="mb-2">
                            <strong className="text-dark">Hospital:</strong>
                            <span className="ms-2 text-muted">{selectedDoctor.hospital_affiliation || 'N/A'}</span>
                          </div>
                          <div className="mb-2">
                            <strong className="text-dark">Consultation Fee:</strong>
                            <span className="ms-2 text-success fw-semibold">${selectedDoctor.consultation_fee || '0.00'}</span>
                          </div>
                        </Col>
                        <Col sm={6}>
                          <div className="mb-2">
                            <strong className="text-dark">Emergency Available:</strong>
                            <Badge 
                              bg={selectedDoctor.is_available_emergency ? "success" : "secondary"}
                              className="ms-2"
                            >
                              {selectedDoctor.is_available_emergency ? 'Yes' : 'No'}
                            </Badge>
                          </div>
                        </Col>
                      </Row>
                      
                      {selectedDoctor.bio && (
                        <div className="mt-3">
                          <strong className="text-dark">Bio:</strong>
                          <p className="mt-2 text-muted mb-0" style={{ lineHeight: '1.6' }}>
                            {selectedDoctor.bio}
                          </p>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          )}
          {modalType === 'add' && (
            <div className="p-4">
              <AddDoctorForm onSuccess={handleAddSuccess} onCancel={closeModal} />
            </div>
          )}
          {modalType === 'edit' && selectedDoctor && (
            <div className="p-4">
              <EditDoctorForm 
                doctor={selectedDoctor} 
                onSuccess={handleEditSuccess} 
                onCancel={closeModal} 
              />
            </div>
          )}
          {modalType === 'delete' && (
            <div className="p-5 text-center">
              <div className="mb-4">
                <div className="bg-danger bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                  <RiDeleteBinLine size={32} className="text-danger" />
                </div>
                <h4 className="fw-bold text-dark mb-2">Confirm Doctor Deletion</h4>
                <p className="text-muted mb-4">
                  Are you sure you want to permanently delete <strong className="text-danger">
                    {selectedDoctor?.full_name || `Dr. ${selectedDoctor?.user?.first_name} ${selectedDoctor?.user?.last_name}`}
                  </strong> from the system?
                </p>
              </div>
              
              <Alert variant="danger" className="text-start border-0 bg-danger bg-opacity-10">
                <div className="d-flex align-items-start">
                  <RiDeleteBinLine size={20} className="text-danger me-3 mt-1 flex-shrink-0" />
                  <div>
                    <h6 className="fw-bold text-danger mb-2">This action cannot be undone!</h6>
                    <p className="mb-2 small text-dark">Deleting this doctor will permanently remove:</p>
                    <ul className="small text-dark mb-0 ps-3">
                      <li>Complete doctor profile and credentials</li>
                      <li>All associated appointment history</li>
                      <li>Medical records and patient notes</li>
                      <li>Consultation and treatment records</li>
                    </ul>
                  </div>
                </div>
              </Alert>
              
              <div className="bg-light rounded-3 p-3 mb-4">
                <small className="text-muted d-block mb-2">Doctor to be deleted:</small>
                <div className="d-flex align-items-center justify-content-center">
                  <div className="bg-danger bg-opacity-10 rounded-circle me-3" style={{ width: '40px', height: '40px' }}>
                    <div className="d-flex align-items-center justify-content-center h-100">
                      <span className="fw-bold text-danger small">
                        {(selectedDoctor?.user?.first_name?.[0] || 'D') + (selectedDoctor?.user?.last_name?.[0] || 'R')}
                      </span>
                    </div>
                  </div>
                  <div className="text-start">
                    <div className="fw-semibold text-dark">
                      {selectedDoctor?.full_name || `Dr. ${selectedDoctor?.user?.first_name} ${selectedDoctor?.user?.last_name}`}
                    </div>
                    <div className="small text-muted">
                      {selectedDoctor?.specialization || 'General'} • License: {selectedDoctor?.license_number || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        
        {modalType !== 'add' && modalType !== 'edit' && (
          <Modal.Footer className="bg-light border-0 p-4">
            <div className="d-flex gap-3 w-100">
              <Button 
                variant="outline-secondary" 
                onClick={closeModal}
                className="px-4 flex-fill"
                disabled={loading}
              >
                <i className="ri-close-line me-1"></i>
                {modalType === 'view' ? 'Close' : 'Cancel'}
              </Button>
              {modalType === 'delete' && (
                <Button 
                  variant="danger" 
                  onClick={handleDeleteConfirm} 
                  disabled={loading}
                  className="px-4 flex-fill fw-semibold"
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <RiDeleteBinLine size={16} className="me-1" />
                      Permanently Delete
                    </>
                  )}
                </Button>
              )}
            </div>
          </Modal.Footer>
        )}
      </Modal>
    </>
  );
};

// Wrap the component with protection
const ProtectedDoctorList = () => {
  return (
    <ProtectedRoute 
      permission="canAccessDoctorManagement" 
      moduleName="Doctor Management"
    >
      <DoctorList />
    </ProtectedRoute>
  );
};

export default ProtectedDoctorList;