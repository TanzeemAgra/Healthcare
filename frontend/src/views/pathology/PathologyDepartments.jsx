import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Form, Modal, Alert, Spinner, InputGroup } from 'react-bootstrap';
import apiClient from '../../services/api';

const PathologyDepartments = () => {
  const [departments, setDepartments] = useState([
    {
      id: 1,
      name: 'Clinical Chemistry',
      code: 'CHEM',
      location: 'Lab Building - Floor 1',
      headPathologist: 'Dr. Sarah Wilson',
      status: 'Active',
      accreditation: 'ISO 15189:2012',
      description: 'Performs biochemical analysis of blood, urine, and other body fluids',
      equipment: ['Automated Chemistry Analyzer', 'Spectrophotometer', 'Centrifuge'],
      specialties: ['Lipid Profile', 'Liver Function Tests', 'Kidney Function Tests']
    },
    {
      id: 2,
      name: 'Hematology',
      code: 'HEMA',
      location: 'Lab Building - Floor 2',
      headPathologist: 'Dr. Michael Brown',
      status: 'Active',
      accreditation: 'CAP Certified',
      description: 'Specializes in blood disorders and blood cell analysis',
      equipment: ['Automated Cell Counter', 'Flow Cytometer', 'Microscope'],
      specialties: ['Complete Blood Count', 'Coagulation Studies', 'Blood Smear Analysis']
    },
    {
      id: 3,
      name: 'Microbiology',
      code: 'MICRO',
      location: 'Lab Building - Floor 3',
      headPathologist: 'Dr. Emily Davis',
      status: 'Active',
      accreditation: 'ISO 15189:2012',
      description: 'Identifies and studies microorganisms causing infections',
      equipment: ['Incubators', 'Automated Culture Systems', 'PCR Machine'],
      specialties: ['Bacterial Culture', 'Antibiotic Sensitivity', 'Molecular Diagnostics']
    },
    {
      id: 4,
      name: 'Histopathology',
      code: 'HISTO',
      location: 'Lab Building - Floor 4',
      headPathologist: 'Dr. James Miller',
      status: 'Maintenance',
      accreditation: 'NABL Accredited',
      description: 'Examines tissue samples for disease diagnosis',
      equipment: ['Microtome', 'Tissue Processor', 'Digital Scanner'],
      specialties: ['Biopsy Analysis', 'Cancer Diagnosis', 'Immunohistochemistry']
    },
    {
      id: 5,
      name: 'Immunology',
      code: 'IMMUN',
      location: 'Lab Building - Floor 2',
      headPathologist: 'Dr. Lisa Chen',
      status: 'Active',
      accreditation: 'CAP Certified',
      description: 'Studies immune system responses and autoimmune disorders',
      equipment: ['ELISA Reader', 'Luminex System', 'Nephelometer'],
      specialties: ['Autoimmune Testing', 'Allergy Testing', 'Immunodeficiency Studies']
    }
  ]);

  // Modal and form states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    location: '',
    headPathologist: '',
    status: 'Active',
    accreditation: '',
    description: '',
    equipment: [],
    specialties: [],
    contactEmail: '',
    contactPhone: '',
    operatingHours: '24/7',
    capacity: '',
    certifications: []
  });

  // AI suggestions state
  const [aiSuggestions, setAiSuggestions] = useState({
    equipment: [],
    specialties: [],
    accreditations: []
  });

  // Predefined options for AI suggestions
  const equipmentOptions = [
    'Automated Chemistry Analyzer', 'Spectrophotometer', 'Centrifuge', 'Microscope',
    'Flow Cytometer', 'PCR Machine', 'ELISA Reader', 'Incubators', 'Microtome',
    'Tissue Processor', 'Digital Scanner', 'Luminex System', 'Nephelometer',
    'Automated Cell Counter', 'Coagulation Analyzer', 'Blood Gas Analyzer',
    'Immunofluorescence Microscope', 'Mass Spectrometer', 'HPLC System'
  ];

  const specialtyOptions = [
    'Complete Blood Count', 'Lipid Profile', 'Liver Function Tests', 'Kidney Function Tests',
    'Coagulation Studies', 'Blood Smear Analysis', 'Bacterial Culture', 'Antibiotic Sensitivity',
    'Molecular Diagnostics', 'Biopsy Analysis', 'Cancer Diagnosis', 'Immunohistochemistry',
    'Autoimmune Testing', 'Allergy Testing', 'Immunodeficiency Studies', 'Cardiac Markers',
    'Thyroid Function Tests', 'Diabetes Monitoring', 'Tumor Markers', 'Infectious Disease Testing'
  ];

  const accreditationOptions = [
    'ISO 15189:2012', 'CAP Certified', 'NABL Accredited', 'CLIA Certified',
    'JCI Accredited', 'NABH Accredited', 'WHO Prequalified', 'FDA Approved'
  ];

  // Load departments from API on component mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Fetch departments from API
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/pathology/departments/');
      setDepartments(response.data);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      // Keep using demo data if API fails
      setError('Using demo data - API connection failed');
    } finally {
      setLoading(false);
    }
  };

  // Generate AI suggestions based on department type
  const generateAISuggestions = (departmentName) => {
    const name = departmentName.toLowerCase();
    let suggestedEquipment = [];
    let suggestedSpecialties = [];
    let suggestedAccreditations = ['ISO 15189:2012', 'CAP Certified'];

    if (name.includes('chemistry') || name.includes('biochemistry')) {
      suggestedEquipment = ['Automated Chemistry Analyzer', 'Spectrophotometer', 'Centrifuge', 'Blood Gas Analyzer'];
      suggestedSpecialties = ['Lipid Profile', 'Liver Function Tests', 'Kidney Function Tests', 'Cardiac Markers'];
    } else if (name.includes('hematology') || name.includes('blood')) {
      suggestedEquipment = ['Automated Cell Counter', 'Flow Cytometer', 'Microscope', 'Coagulation Analyzer'];
      suggestedSpecialties = ['Complete Blood Count', 'Coagulation Studies', 'Blood Smear Analysis'];
    } else if (name.includes('microbiology') || name.includes('bacteriology')) {
      suggestedEquipment = ['Incubators', 'Automated Culture Systems', 'PCR Machine', 'Mass Spectrometer'];
      suggestedSpecialties = ['Bacterial Culture', 'Antibiotic Sensitivity', 'Molecular Diagnostics', 'Infectious Disease Testing'];
    } else if (name.includes('histopathology') || name.includes('pathology')) {
      suggestedEquipment = ['Microtome', 'Tissue Processor', 'Digital Scanner', 'Immunofluorescence Microscope'];
      suggestedSpecialties = ['Biopsy Analysis', 'Cancer Diagnosis', 'Immunohistochemistry', 'Tumor Markers'];
    } else if (name.includes('immunology') || name.includes('serology')) {
      suggestedEquipment = ['ELISA Reader', 'Luminex System', 'Nephelometer', 'Flow Cytometer'];
      suggestedSpecialties = ['Autoimmune Testing', 'Allergy Testing', 'Immunodeficiency Studies'];
    }

    setAiSuggestions({
      equipment: suggestedEquipment,
      specialties: suggestedSpecialties,
      accreditations: suggestedAccreditations
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Generate AI suggestions when department name changes
    if (name === 'name' && value.length > 3) {
      generateAISuggestions(value);
    }

    // Auto-generate department code
    if (name === 'name') {
      const code = value.toUpperCase().replace(/[^A-Z]/g, '').substring(0, 5);
      setFormData(prev => ({
        ...prev,
        code: code
      }));
    }
  };

  // Handle array inputs (equipment, specialties)
  const handleArrayInput = (field, value) => {
    if (value && !formData[field].includes(value)) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value]
      }));
    }
  };

  // Remove item from array
  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      location: '',
      headPathologist: '',
      status: 'Active',
      accreditation: '',
      description: '',
      equipment: [],
      specialties: [],
      contactEmail: '',
      contactPhone: '',
      operatingHours: '24/7',
      capacity: '',
      certifications: []
    });
    setAiSuggestions({ equipment: [], specialties: [], accreditations: [] });
    setError('');
    setSuccess('');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.name || !formData.code || !formData.location || !formData.headPathologist) {
        throw new Error('Please fill in all required fields');
      }

      // Prepare data for API
      const departmentData = {
        name: formData.name,
        code: formData.code,
        location: formData.location,
        head_pathologist: formData.headPathologist,
        status: formData.status.toLowerCase(),
        accreditation: formData.accreditation,
        description: formData.description,
        equipment: formData.equipment,
        specialties: formData.specialties,
        contact_email: formData.contactEmail,
        contact_phone: formData.contactPhone,
        operating_hours: formData.operatingHours,
        capacity: formData.capacity ? parseInt(formData.capacity) : null
      };

      try {
        // Try to create via API
        const response = await apiClient.post('/pathology/departments/', departmentData);
        
        // Add to local state with API response
        setDepartments(prev => [...prev, response.data]);
        setSuccess('Department added successfully via API!');
      } catch (apiError) {
        console.error('API creation failed, using local storage:', apiError);
        
        // Fallback to local state if API fails
        const newDepartment = {
          id: departments.length + 1,
          ...formData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setDepartments(prev => [...prev, newDepartment]);
        setSuccess('Department added successfully (demo mode)!');
      }
      
      setTimeout(() => {
        setShowAddModal(false);
        resetForm();
      }, 1500);

    } catch (error) {
      setError(error.message || 'Failed to add department');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit department
  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setFormData({
      name: department.name,
      code: department.code,
      location: department.location,
      headPathologist: department.headPathologist,
      status: department.status,
      accreditation: department.accreditation,
      description: department.description || '',
      equipment: department.equipment || [],
      specialties: department.specialties || [],
      contactEmail: department.contactEmail || '',
      contactPhone: department.contactPhone || '',
      operatingHours: department.operatingHours || '24/7',
      capacity: department.capacity || '',
      certifications: department.certifications || []
    });
    setShowEditModal(true);
  };

  // Handle update department
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Prepare data for API
      const departmentData = {
        name: formData.name,
        code: formData.code,
        location: formData.location,
        head_pathologist: formData.headPathologist,
        status: formData.status.toLowerCase(),
        accreditation: formData.accreditation,
        description: formData.description,
        equipment: formData.equipment,
        specialties: formData.specialties,
        contact_email: formData.contactEmail,
        contact_phone: formData.contactPhone,
        operating_hours: formData.operatingHours,
        capacity: formData.capacity ? parseInt(formData.capacity) : null
      };

      try {
        // Try to update via API
        const response = await apiClient.put(`/pathology/departments/${selectedDepartment.id}/`, departmentData);
        
        // Update local state with API response
        setDepartments(prev => prev.map(dept => 
          dept.id === selectedDepartment.id ? response.data : dept
        ));
        setSuccess('Department updated successfully via API!');
      } catch (apiError) {
        console.error('API update failed, using local storage:', apiError);
        
        // Fallback to local state update
        setDepartments(prev => prev.map(dept => 
          dept.id === selectedDepartment.id 
            ? { ...dept, ...formData, updated_at: new Date().toISOString() }
            : dept
        ));
        setSuccess('Department updated successfully (demo mode)!');
      }
      
      setTimeout(() => {
        setShowEditModal(false);
        resetForm();
        setSelectedDepartment(null);
      }, 1500);

    } catch (error) {
      setError(error.message || 'Failed to update department');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h3 mb-0">🏥 Pathology Departments</h1>
              <p className="text-muted mb-0">Manage laboratory departments and their configurations</p>
            </div>
            <Button 
              variant="primary" 
              onClick={() => setShowAddModal(true)}
              className="d-flex align-items-center"
            >
              <i className="ri-add-line me-2"></i>
              Add New Department
            </Button>
          </div>
        </Col>
      </Row>

      {/* Success/Error Alerts */}
      {success && (
        <Row className="mb-3">
          <Col>
            <Alert variant="success" dismissible onClose={() => setSuccess('')}>
              <i className="ri-check-line me-2"></i>
              {success}
            </Alert>
          </Col>
        </Row>
      )}

      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              <i className="ri-error-warning-line me-2"></i>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      <Row className="g-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-transparent border-0 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="ri-building-line me-2"></i>
                Department Directory
              </h5>
              <Badge bg="info">{departments.length} Departments</Badge>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>Code</th>
                      <th>Location</th>
                      <th>Head Pathologist</th>
                      <th>Status</th>
                      <th>Accreditation</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((dept) => (
                      <tr key={dept.id}>
                        <td>
                          <div>
                            <strong>{dept.name}</strong>
                            {dept.description && (
                              <small className="d-block text-muted">
                                {dept.description.substring(0, 50)}...
                              </small>
                            )}
                          </div>
                        </td>
                        <td>
                          <Badge bg="secondary">{dept.code}</Badge>
                        </td>
                        <td>
                          <small>{dept.location}</small>
                        </td>
                        <td>{dept.headPathologist}</td>
                        <td>
                          <Badge 
                            bg={dept.status === 'Active' ? 'success' : 'warning'}
                          >
                            {dept.status}
                          </Badge>
                        </td>
                        <td>
                          <small className="text-muted">{dept.accreditation}</small>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => handleEdit(dept)}
                              title="Edit Department"
                            >
                              <i className="ri-edit-line"></i>
                            </Button>
                            <Button 
                              variant="outline-info" 
                              size="sm"
                              title="View Details"
                            >
                              <i className="ri-eye-line"></i>
                            </Button>
                            <Button 
                              variant="outline-warning" 
                              size="sm"
                              title="Department Settings"
                            >
                              <i className="ri-settings-line"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-transparent border-0">
              <h5 className="mb-0">
                <i className="ri-bar-chart-box-line me-2"></i>
                Department Analytics
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Total Departments</span>
                <Badge bg="primary" className="fs-6">{departments.length}</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Active Departments</span>
                <Badge bg="success" className="fs-6">
                  {departments.filter(d => d.status === 'Active').length}
                </Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Under Maintenance</span>
                <Badge bg="warning" className="fs-6">
                  {departments.filter(d => d.status === 'Maintenance').length}
                </Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Accredited</span>
                <Badge bg="info" className="fs-6">{departments.length}</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span>Specialties Coverage</span>
                <Badge bg="secondary" className="fs-6">
                  {departments.reduce((total, dept) => total + (dept.specialties?.length || 0), 0)}
                </Badge>
              </div>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-transparent border-0">
              <h5 className="mb-0">
                <i className="ri-tools-line me-2"></i>
                Quick Actions
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button variant="outline-primary">
                  <i className="ri-bar-chart-box-line me-2"></i>
                  Department Analytics
                </Button>
                <Button variant="outline-secondary">
                  <i className="ri-settings-line me-2"></i>
                  Manage Permissions
                </Button>
                <Button variant="outline-info">
                  <i className="ri-file-download-line me-2"></i>
                  Export Department List
                </Button>
                <Button variant="outline-success">
                  <i className="ri-audit-line me-2"></i>
                  Audit Compliance
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add Department Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-add-line me-2"></i>
            Add New Department
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && (
              <Alert variant="danger">
                <i className="ri-error-warning-line me-2"></i>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert variant="success">
                <i className="ri-check-line me-2"></i>
                {success}
              </Alert>
            )}

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Department Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Clinical Chemistry"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Department Code *</Form.Label>
                  <Form.Control
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="e.g., CHEM"
                    required
                  />
                  <Form.Text className="text-muted">
                    Auto-generated from department name
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Location *</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Lab Building - Floor 1"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Head Pathologist *</Form.Label>
                  <Form.Control
                    type="text"
                    name="headPathologist"
                    value={formData.headPathologist}
                    onChange={handleInputChange}
                    placeholder="e.g., Dr. Sarah Wilson"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Maintenance">Under Maintenance</option>
                    <option value="Setup">Setup in Progress</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Accreditation</Form.Label>
                  <Form.Control
                    type="text"
                    name="accreditation"
                    value={formData.accreditation}
                    onChange={handleInputChange}
                    placeholder="e.g., ISO 15189:2012"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Department Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of department functions and capabilities"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Contact Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    placeholder="department@hospital.com"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Contact Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Operating Hours</Form.Label>
                  <Form.Select
                    name="operatingHours"
                    value={formData.operatingHours}
                    onChange={handleInputChange}
                  >
                    <option value="24/7">24/7 Operations</option>
                    <option value="Business Hours">Business Hours (9 AM - 5 PM)</option>
                    <option value="Extended Hours">Extended Hours (7 AM - 9 PM)</option>
                    <option value="On-Call">On-Call Only</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Daily Capacity</Form.Label>
                  <Form.Control
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    placeholder="e.g., 500 tests per day"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* AI-Powered Equipment Suggestions */}
            {aiSuggestions.equipment.length > 0 && (
              <Form.Group className="mb-3">
                <Form.Label>
                  <i className="ri-robot-line me-2"></i>
                  AI-Suggested Equipment
                </Form.Label>
                <div className="d-flex flex-wrap gap-2 mb-2">
                  {aiSuggestions.equipment.map((equipment, index) => (
                    <Badge 
                      key={index}
                      bg="outline-primary" 
                      className="cursor-pointer border"
                      onClick={() => handleArrayInput('equipment', equipment)}
                      style={{ cursor: 'pointer' }}
                    >
                      <i className="ri-add-line me-1"></i>
                      {equipment}
                    </Badge>
                  ))}
                </div>
                <div className="selected-items">
                  {formData.equipment.map((item, index) => (
                    <Badge 
                      key={index} 
                      bg="primary" 
                      className="me-2 mb-2"
                    >
                      {item}
                      <i 
                        className="ri-close-line ms-1 cursor-pointer" 
                        onClick={() => removeArrayItem('equipment', index)}
                        style={{ cursor: 'pointer' }}
                      ></i>
                    </Badge>
                  ))}
                </div>
              </Form.Group>
            )}

            {/* AI-Powered Specialty Suggestions */}
            {aiSuggestions.specialties.length > 0 && (
              <Form.Group className="mb-3">
                <Form.Label>
                  <i className="ri-robot-line me-2"></i>
                  AI-Suggested Specialties
                </Form.Label>
                <div className="d-flex flex-wrap gap-2 mb-2">
                  {aiSuggestions.specialties.map((specialty, index) => (
                    <Badge 
                      key={index}
                      bg="outline-success" 
                      className="cursor-pointer border"
                      onClick={() => handleArrayInput('specialties', specialty)}
                      style={{ cursor: 'pointer' }}
                    >
                      <i className="ri-add-line me-1"></i>
                      {specialty}
                    </Badge>
                  ))}
                </div>
                <div className="selected-items">
                  {formData.specialties.map((item, index) => (
                    <Badge 
                      key={index} 
                      bg="success" 
                      className="me-2 mb-2"
                    >
                      {item}
                      <i 
                        className="ri-close-line ms-1 cursor-pointer" 
                        onClick={() => removeArrayItem('specialties', index)}
                        style={{ cursor: 'pointer' }}
                      ></i>
                    </Badge>
                  ))}
                </div>
              </Form.Group>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" className="me-2" />
                  Adding Department...
                </>
              ) : (
                <>
                  <i className="ri-save-line me-2"></i>
                  Add Department
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Department Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-edit-line me-2"></i>
            Edit Department: {selectedDepartment?.name}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdate}>
          <Modal.Body>
            {error && (
              <Alert variant="danger">
                <i className="ri-error-warning-line me-2"></i>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert variant="success">
                <i className="ri-check-line me-2"></i>
                {success}
              </Alert>
            )}

            {/* Same form fields as add modal */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Department Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Department Code *</Form.Label>
                  <Form.Control
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Location *</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Head Pathologist *</Form.Label>
                  <Form.Control
                    type="text"
                    name="headPathologist"
                    value={formData.headPathologist}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Maintenance">Under Maintenance</option>
                    <option value="Setup">Setup in Progress</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Accreditation</Form.Label>
                  <Form.Control
                    type="text"
                    name="accreditation"
                    value={formData.accreditation}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Department Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Form.Group>

            {/* Display current equipment and specialties */}
            {formData.equipment.length > 0 && (
              <Form.Group className="mb-3">
                <Form.Label>Current Equipment</Form.Label>
                <div>
                  {formData.equipment.map((item, index) => (
                    <Badge 
                      key={index} 
                      bg="primary" 
                      className="me-2 mb-2"
                    >
                      {item}
                      <i 
                        className="ri-close-line ms-1 cursor-pointer" 
                        onClick={() => removeArrayItem('equipment', index)}
                        style={{ cursor: 'pointer' }}
                      ></i>
                    </Badge>
                  ))}
                </div>
              </Form.Group>
            )}

            {formData.specialties.length > 0 && (
              <Form.Group className="mb-3">
                <Form.Label>Current Specialties</Form.Label>
                <div>
                  {formData.specialties.map((item, index) => (
                    <Badge 
                      key={index} 
                      bg="success" 
                      className="me-2 mb-2"
                    >
                      {item}
                      <i 
                        className="ri-close-line ms-1 cursor-pointer" 
                        onClick={() => removeArrayItem('specialties', index)}
                        style={{ cursor: 'pointer' }}
                      ></i>
                    </Badge>
                  ))}
                </div>
              </Form.Group>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={() => {
                setShowEditModal(false);
                resetForm();
                setSelectedDepartment(null);
              }} 
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" className="me-2" />
                  Updating Department...
                </>
              ) : (
                <>
                  <i className="ri-save-line me-2"></i>
                  Update Department
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default PathologyDepartments;
