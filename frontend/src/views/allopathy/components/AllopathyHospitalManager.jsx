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
  Dropdown
} from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaFilter } from 'react-icons/fa';
import { allopathyS3Config } from '../../../../utils/allopathyS3Config';
import axios from 'axios';

const AllopathyHospitalManager = ({ onDataChange, onNotification }) => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    hospital_type: 'general',
    license_number: '',
    chief_physician: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    phone: '',
    email: '',
    website: '',
    bed_capacity: 0,
    specialties: '',
    accreditation: '',
    status: 'active',
    s3_bucket: '',
    s3_region: 'us-east-1'
  });
  const [filters, setFilters] = useState({
    hospital_type: '',
    status: '',
    city: '',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [hospitalStats, setHospitalStats] = useState(null);

  useEffect(() => {
    fetchHospitals();
  }, [currentPage, filters]);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        page_size: allopathyS3Config.ui.pagination.defaultPageSize,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      });

      const response = await axios.get(
        `${allopathyS3Config.api.baseURL}${allopathyS3Config.api.endpoints.hospitals}?${params}`
      );

      setHospitals(response.data.results || response.data);
      setTotalPages(Math.ceil((response.data.count || response.data.length) / allopathyS3Config.ui.pagination.defaultPageSize));
    } catch (error) {
      console.error('Failed to fetch hospitals:', error);
      onNotification('Failed to fetch hospitals', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchHospitalStats = async (hospitalId) => {
    try {
      const response = await axios.get(
        `${allopathyS3Config.api.baseURL}${allopathyS3Config.api.endpoints.hospitalStats(hospitalId)}`
      );
      setHospitalStats(response.data);
    } catch (error) {
      console.error('Failed to fetch hospital statistics:', error);
      onNotification('Failed to fetch hospital statistics', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = selectedHospital 
        ? `${allopathyS3Config.api.baseURL}${allopathyS3Config.api.endpoints.hospitals}${selectedHospital.id}/`
        : `${allopathyS3Config.api.baseURL}${allopathyS3Config.api.endpoints.hospitals}`;
      
      const method = selectedHospital ? 'PUT' : 'POST';
      
      await axios({
        method,
        url,
        data: formData
      });

      onNotification(
        `Hospital ${selectedHospital ? 'updated' : 'created'} successfully`, 
        'success'
      );
      
      setShowModal(false);
      resetForm();
      fetchHospitals();
      onDataChange();
    } catch (error) {
      console.error('Failed to save hospital:', error);
      onNotification('Failed to save hospital', 'error');
    }
  };

  const handleEdit = (hospital) => {
    setSelectedHospital(hospital);
    setFormData({
      name: hospital.name,
      hospital_type: hospital.hospital_type,
      license_number: hospital.license_number,
      chief_physician: hospital.chief_physician,
      address: hospital.address,
      city: hospital.city,
      state: hospital.state,
      postal_code: hospital.postal_code,
      phone: hospital.phone,
      email: hospital.email,
      website: hospital.website || '',
      bed_capacity: hospital.bed_capacity,
      specialties: hospital.specialties,
      accreditation: hospital.accreditation || '',
      status: hospital.status,
      s3_bucket: hospital.s3_bucket || '',
      s3_region: hospital.s3_region
    });
    setShowModal(true);
  };

  const handleDelete = async (hospital) => {
    if (window.confirm(`Are you sure you want to delete ${hospital.name}?`)) {
      try {
        await axios.delete(
          `${allopathyS3Config.api.baseURL}${allopathyS3Config.api.endpoints.hospitals}${hospital.id}/`
        );
        onNotification('Hospital deleted successfully', 'success');
        fetchHospitals();
        onDataChange();
      } catch (error) {
        console.error('Failed to delete hospital:', error);
        onNotification('Failed to delete hospital', 'error');
      }
    }
  };

  const handleViewDetails = (hospital) => {
    setSelectedHospital(hospital);
    fetchHospitalStats(hospital.id);
    setShowDetails(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      hospital_type: 'general',
      license_number: '',
      chief_physician: '',
      address: '',
      city: '',
      state: '',
      postal_code: '',
      phone: '',
      email: '',
      website: '',
      bed_capacity: 0,
      specialties: '',
      accreditation: '',
      status: 'active',
      s3_bucket: '',
      s3_region: 'us-east-1'
    });
    setSelectedHospital(null);
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: 'success',
      inactive: 'secondary',
      suspended: 'danger',
      maintenance: 'warning'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status.toUpperCase()}</Badge>;
  };

  const getHospitalTypeBadge = (type) => {
    const hospitalType = allopathyS3Config.hospitalTypes.find(ht => ht.value === type);
    return <Badge bg="info">{hospitalType?.label || type}</Badge>;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="allopathy-hospital-manager">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Hospital Management</h4>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <FaPlus className="me-2" />
          Add Hospital
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
                  placeholder="Search hospitals..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </InputGroup>
            </Col>
            <Col md={2}>
              <Form.Select
                value={filters.hospital_type}
                onChange={(e) => setFilters({...filters, hospital_type: e.target.value})}
              >
                <option value="">All Types</option>
                {allopathyS3Config.hospitalTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
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
                <option value="suspended">Suspended</option>
                <option value="maintenance">Maintenance</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Control
                type="text"
                placeholder="City"
                value={filters.city}
                onChange={(e) => setFilters({...filters, city: e.target.value})}
              />
            </Col>
            <Col md={3}>
              <div className="d-flex gap-2">
                <Button variant="outline-primary" onClick={fetchHospitals}>
                  <FaFilter className="me-1" />
                  Apply
                </Button>
                <Button variant="outline-secondary" onClick={() => setFilters({hospital_type: '', status: '', city: '', search: ''})}>
                  Clear
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Hospitals Table */}
      <Card>
        <Card.Body>
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>License</th>
                <th>Chief Physician</th>
                <th>City</th>
                <th>Bed Capacity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {hospitals.map(hospital => (
                <tr key={hospital.id}>
                  <td>
                    <div>
                      <strong>{hospital.name}</strong>
                      <br />
                      <small className="text-muted">{hospital.email}</small>
                    </div>
                  </td>
                  <td>{getHospitalTypeBadge(hospital.hospital_type)}</td>
                  <td>{hospital.license_number}</td>
                  <td>{hospital.chief_physician}</td>
                  <td>{hospital.city}, {hospital.state}</td>
                  <td>
                    <Badge bg="secondary">{hospital.bed_capacity}</Badge>
                  </td>
                  <td>{getStatusBadge(hospital.status)}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-secondary" size="sm">
                        Actions
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleViewDetails(hospital)}>
                          <FaEye className="me-2" />
                          View Details
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleEdit(hospital)}>
                          <FaEdit className="me-2" />
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item 
                          onClick={() => handleDelete(hospital)}
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

          {hospitals.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted">No hospitals found</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Hospital Form Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedHospital ? 'Edit Hospital' : 'Add New Hospital'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hospital Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hospital Type *</Form.Label>
                  <Form.Select
                    value={formData.hospital_type}
                    onChange={(e) => setFormData({...formData, hospital_type: e.target.value})}
                    required
                  >
                    {allopathyS3Config.hospitalTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
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
                    value={formData.license_number}
                    onChange={(e) => setFormData({...formData, license_number: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Chief Physician *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.chief_physician}
                    onChange={(e) => setFormData({...formData, chief_physician: e.target.value})}
                    required
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

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>City *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>State *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Postal Code *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.postal_code}
                    onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
                    required
                  />
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
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Website</Form.Label>
                  <Form.Control
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Bed Capacity</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={formData.bed_capacity}
                    onChange={(e) => setFormData({...formData, bed_capacity: parseInt(e.target.value) || 0})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Specialties</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Comma-separated list of medical specialties"
                value={formData.specialties}
                onChange={(e) => setFormData({...formData, specialties: e.target.value})}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Accreditation</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.accreditation}
                    onChange={(e) => setFormData({...formData, accreditation: e.target.value})}
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
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                    <option value="maintenance">Under Maintenance</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>S3 Bucket</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.s3_bucket}
                    onChange={(e) => setFormData({...formData, s3_bucket: e.target.value})}
                    placeholder="S3 bucket name for data storage"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>S3 Region</Form.Label>
                  <Form.Select
                    value={formData.s3_region}
                    onChange={(e) => setFormData({...formData, s3_region: e.target.value})}
                  >
                    <option value="us-east-1">US East (N. Virginia)</option>
                    <option value="us-west-2">US West (Oregon)</option>
                    <option value="eu-west-1">Europe (Ireland)</option>
                    <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {selectedHospital ? 'Update' : 'Create'} Hospital
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Hospital Details Modal */}
      <Modal show={showDetails} onHide={() => setShowDetails(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Hospital Details: {selectedHospital?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedHospital && (
            <div>
              <Row>
                <Col md={6}>
                  <Card className="mb-3">
                    <Card.Header>Basic Information</Card.Header>
                    <Card.Body>
                      <p><strong>Type:</strong> {getHospitalTypeBadge(selectedHospital.hospital_type)}</p>
                      <p><strong>License:</strong> {selectedHospital.license_number}</p>
                      <p><strong>Chief Physician:</strong> {selectedHospital.chief_physician}</p>
                      <p><strong>Status:</strong> {getStatusBadge(selectedHospital.status)}</p>
                      <p><strong>Bed Capacity:</strong> {selectedHospital.bed_capacity}</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="mb-3">
                    <Card.Header>Statistics</Card.Header>
                    <Card.Body>
                      {hospitalStats ? (
                        <div>
                          <p><strong>Total Patients:</strong> {hospitalStats.total_patients}</p>
                          <p><strong>Active Patients:</strong> {hospitalStats.active_patients}</p>
                          <p><strong>Admitted Patients:</strong> {hospitalStats.admitted_patients}</p>
                          <p><strong>Total Files:</strong> {hospitalStats.total_files}</p>
                          <p><strong>Recent Analyses:</strong> {hospitalStats.recent_analyses}</p>
                          <p><strong>Bed Occupancy:</strong> {hospitalStats.bed_occupancy}/{hospitalStats.bed_capacity}</p>
                        </div>
                      ) : (
                        <Spinner animation="border" size="sm" />
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              
              <Card>
                <Card.Header>Contact Information</Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <p><strong>Address:</strong> {selectedHospital.address}</p>
                      <p><strong>City:</strong> {selectedHospital.city}, {selectedHospital.state} {selectedHospital.postal_code}</p>
                    </Col>
                    <Col md={6}>
                      <p><strong>Phone:</strong> {selectedHospital.phone}</p>
                      <p><strong>Email:</strong> {selectedHospital.email}</p>
                      {selectedHospital.website && (
                        <p><strong>Website:</strong> <a href={selectedHospital.website} target="_blank" rel="noopener noreferrer">{selectedHospital.website}</a></p>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {selectedHospital.specialties && (
                <Card className="mt-3">
                  <Card.Header>Specialties</Card.Header>
                  <Card.Body>
                    <p>{selectedHospital.specialties}</p>
                  </Card.Body>
                </Card>
              )}
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

export default AllopathyHospitalManager;
