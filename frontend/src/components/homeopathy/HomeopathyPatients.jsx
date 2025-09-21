import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Badge, Alert, Modal, InputGroup, ProgressBar } from 'react-bootstrap';

const HomeopathyPatients = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const mockPatients = [
    {
      id: 1,
      name: 'Sarah Johnson',
      age: 34,
      gender: 'Female',
      phone: '+1-555-0123',
      email: 'sarah.j@email.com',
      chiefComplaint: 'Chronic Migraine',
      currentRemedy: 'Belladonna 30C',
      status: 'Under Treatment',
      lastVisit: '2025-07-28',
      nextVisit: '2025-08-05',
      totalVisits: 8,
      caseHistory: [
        {
          date: '2025-07-28',
          complaint: 'Migraine intensity reduced from 8/10 to 4/10',
          remedy: 'Belladonna 30C',
          potency: '30C',
          response: 'Good improvement',
          notes: 'Patient reports better sleep, less anxiety'
        },
        {
          date: '2025-07-14',
          complaint: 'Severe throbbing headache, worse from light and noise',
          remedy: 'Belladonna 30C',
          potency: '30C',
          response: 'Initial prescription',
          notes: 'Started constitutional treatment'
        }
      ],
      constitution: 'Sanguine, robust build, tendency to sudden complaints',
      aiAnalysis: {
        responseRate: 85,
        healingPattern: 'Progressive improvement',
        recommendedPotency: '200C',
        nextRemedySuggestion: 'Continue Belladonna or consider Nat Mur for constitutional'
      }
    },
    {
      id: 2,
      name: 'Michael Chen',
      age: 42,
      gender: 'Male',
      phone: '+1-555-0456',
      email: 'mchen@email.com',
      chiefComplaint: 'Anxiety & Insomnia',
      currentRemedy: 'Arsenicum Album 200C',
      status: 'Improving',
      lastVisit: '2025-07-25',
      nextVisit: '2025-08-08',
      totalVisits: 5,
      caseHistory: [
        {
          date: '2025-07-25',
          complaint: 'Anxiety much better, sleep improved',
          remedy: 'Arsenicum Album 200C',
          potency: '200C',
          response: 'Excellent response',
          notes: 'Patient very satisfied with progress'
        },
        {
          date: '2025-07-10',
          complaint: 'Severe anxiety about health, restless nights',
          remedy: 'Arsenicum Album 30C',
          potency: '30C',
          response: 'Partial improvement',
          notes: 'Needed higher potency'
        }
      ],
      constitution: 'Lean, anxious type, perfectionist tendencies',
      aiAnalysis: {
        responseRate: 92,
        healingPattern: 'Steady improvement',
        recommendedPotency: '1M',
        nextRemedySuggestion: 'Consider intercurrent remedy if plateau reached'
      }
    },
    {
      id: 3,
      name: 'Emma Davis',
      age: 28,
      gender: 'Female',
      phone: '+1-555-0789',
      email: 'emma.davis@email.com',
      chiefComplaint: 'Digestive Issues',
      currentRemedy: 'Nux Vomica 6C',
      status: 'Follow-up Due',
      lastVisit: '2025-07-20',
      nextVisit: '2025-07-30',
      totalVisits: 3,
      caseHistory: [
        {
          date: '2025-07-20',
          complaint: 'Constipation improved but still irritable',
          remedy: 'Nux Vomica 6C',
          potency: '6C',
          response: 'Partial improvement',
          notes: 'May need constitutional remedy'
        },
        {
          date: '2025-07-05',
          complaint: 'Chronic constipation, irritability, morning headaches',
          remedy: 'Nux Vomica 6C',
          potency: '6C',
          response: 'Initial prescription',
          notes: 'Typical Nux picture'
        }
      ],
      constitution: 'Ambitious career woman, stress-related symptoms',
      aiAnalysis: {
        responseRate: 65,
        healingPattern: 'Slow response',
        recommendedPotency: '30C',
        nextRemedySuggestion: 'Consider Lycopodium or Sulphur for deeper action'
      }
    }
  ];

  useEffect(() => {
    setPatients(mockPatients);
    setFilteredPatients(mockPatients);
  }, []);

  useEffect(() => {
    filterPatients();
  }, [searchTerm, statusFilter, patients]);

  const filterPatients = () => {
    let filtered = patients;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(patient => 
        patient.status.toLowerCase().includes(statusFilter.toLowerCase())
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.currentRemedy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPatients(filtered);
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setShowPatientModal(true);
  };

  const getStatusBadgeVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'under treatment': return 'primary';
      case 'improving': return 'success';
      case 'follow-up due': return 'warning';
      case 'completed': return 'info';
      default: return 'secondary';
    }
  };

  const getResponseColor = (rate) => {
    if (rate >= 85) return 'success';
    if (rate >= 70) return 'warning';
    return 'danger';
  };

  return (
    <div className="homeopathy-patients">
      <Container fluid>
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="mb-1">Patient Management</h2>
                <p className="text-muted mb-0">AI-powered patient tracking and case analysis</p>
              </div>
              <div className="d-flex gap-2">
                <Button variant="outline-primary" size="sm">
                  <i className="ri-download-line me-1"></i>Export Data
                </Button>
                <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
                  <i className="ri-user-add-line me-1"></i>Add Patient
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Stats Cards */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="stat-icon bg-primary bg-opacity-10 rounded-circle mx-auto mb-2">
                  <i className="ri-user-heart-line text-primary fs-4"></i>
                </div>
                <h4 className="mb-1">{patients.length}</h4>
                <p className="text-muted mb-0 small">Total Patients</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="stat-icon bg-success bg-opacity-10 rounded-circle mx-auto mb-2">
                  <i className="ri-heart-pulse-line text-success fs-4"></i>
                </div>
                <h4 className="mb-1">{patients.filter(p => p.status === 'Improving').length}</h4>
                <p className="text-muted mb-0 small">Improving</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="stat-icon bg-warning bg-opacity-10 rounded-circle mx-auto mb-2">
                  <i className="ri-calendar-check-line text-warning fs-4"></i>
                </div>
                <h4 className="mb-1">{patients.filter(p => p.status === 'Follow-up Due').length}</h4>
                <p className="text-muted mb-0 small">Follow-ups Due</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="stat-icon bg-info bg-opacity-10 rounded-circle mx-auto mb-2">
                  <i className="ri-brain-line text-info fs-4"></i>
                </div>
                <h4 className="mb-1">89%</h4>
                <p className="text-muted mb-0 small">AI Success Rate</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Search and Filters */}
        <Row className="mb-4">
          <Col lg={8}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <Row className="align-items-end">
                  <Col md={6}>
                    <Form.Label>Search Patients</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="Search by name, condition, or remedy..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <Button variant="outline-secondary">
                        <i className="ri-search-line"></i>
                      </Button>
                    </InputGroup>
                  </Col>
                  <Col md={4}>
                    <Form.Label>Status Filter</Form.Label>
                    <Form.Select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="under treatment">Under Treatment</option>
                      <option value="improving">Improving</option>
                      <option value="follow-up due">Follow-up Due</option>
                      <option value="completed">Completed</option>
                    </Form.Select>
                  </Col>
                  <Col md={2}>
                    <Button variant="outline-primary" className="w-100">
                      <i className="ri-brain-line me-1"></i>AI Filter
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-0">Today's Schedule</h6>
                    <small className="text-muted">3 appointments</small>
                  </div>
                  <Button variant="outline-primary" size="sm">
                    <i className="ri-calendar-line"></i>
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Patient List */}
        <Row>
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-transparent border-0 pb-0">
                <h5 className="mb-0">
                  <i className="ri-team-line text-primary me-2"></i>
                  Patient Database ({filteredPatients.length})
                </h5>
              </Card.Header>
              <Card.Body>
                <Table responsive className="table-hover">
                  <thead>
                    <tr className="text-muted">
                      <th>Patient</th>
                      <th>Chief Complaint</th>
                      <th>Current Remedy</th>
                      <th>Status</th>
                      <th>AI Response Rate</th>
                      <th>Last Visit</th>
                      <th>Next Visit</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map((patient) => (
                      <tr key={patient.id} className="cursor-pointer" onClick={() => handlePatientSelect(patient)}>
                        <td>
                          <div>
                            <strong>{patient.name}</strong>
                            <br />
                            <small className="text-muted">
                              {patient.age}Y, {patient.gender}
                            </small>
                            <br />
                            <small className="text-muted">{patient.phone}</small>
                          </div>
                        </td>
                        <td>{patient.chiefComplaint}</td>
                        <td>
                          <Badge bg="primary" className="px-2 py-1">
                            {patient.currentRemedy}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={getStatusBadgeVariant(patient.status)}>
                            {patient.status}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <ProgressBar 
                              now={patient.aiAnalysis.responseRate} 
                              className="me-2" 
                              style={{width: '80px', height: '8px'}}
                              variant={getResponseColor(patient.aiAnalysis.responseRate)}
                            />
                            <small>{patient.aiAnalysis.responseRate}%</small>
                          </div>
                        </td>
                        <td>{patient.lastVisit}</td>
                        <td>
                          <span className={new Date(patient.nextVisit) <= new Date() ? 'text-danger fw-bold' : ''}>
                            {patient.nextVisit}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePatientSelect(patient);
                              }}
                            >
                              <i className="ri-eye-line"></i>
                            </Button>
                            <Button variant="outline-success" size="sm">
                              <i className="ri-edit-line"></i>
                            </Button>
                            <Button variant="outline-info" size="sm">
                              <i className="ri-calendar-line"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Patient Details Modal */}
      <Modal show={showPatientModal} onHide={() => setShowPatientModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-user-heart-line me-2 text-primary"></i>
            {selectedPatient?.name} - Complete Case History
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPatient && (
            <Row>
              <Col lg={8}>
                {/* Case History */}
                <Card className="border-0 bg-light mb-3">
                  <Card.Header className="bg-transparent">
                    <h6 className="mb-0">Case History & Progress</h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="timeline">
                      {selectedPatient.caseHistory.map((entry, index) => (
                        <div key={index} className="timeline-item">
                          <div className="timeline-date">{entry.date}</div>
                          <div className="timeline-content">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h6 className="mb-1">{entry.remedy} {entry.potency}</h6>
                              <Badge bg={entry.response === 'Excellent response' ? 'success' : 
                                         entry.response === 'Good improvement' ? 'primary' : 'warning'}>
                                {entry.response}
                              </Badge>
                            </div>
                            <p className="mb-1"><strong>Complaint:</strong> {entry.complaint}</p>
                            <p className="mb-0 text-muted"><small>{entry.notes}</small></p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>

                {/* Constitutional Analysis */}
                <Card className="border-0 bg-light">
                  <Card.Header className="bg-transparent">
                    <h6 className="mb-0">Constitutional Analysis</h6>
                  </Card.Header>
                  <Card.Body>
                    <p>{selectedPatient.constitution}</p>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={4}>
                {/* Patient Info */}
                <Card className="border-0 shadow-sm mb-3">
                  <Card.Header className="bg-primary text-white">
                    <h6 className="mb-0">Patient Information</h6>
                  </Card.Header>
                  <Card.Body>
                    <p><strong>Age:</strong> {selectedPatient.age} years</p>
                    <p><strong>Gender:</strong> {selectedPatient.gender}</p>
                    <p><strong>Phone:</strong> {selectedPatient.phone}</p>
                    <p><strong>Email:</strong> {selectedPatient.email}</p>
                    <p><strong>Total Visits:</strong> {selectedPatient.totalVisits}</p>
                    <p><strong>Current Status:</strong> 
                      <Badge bg={getStatusBadgeVariant(selectedPatient.status)} className="ms-2">
                        {selectedPatient.status}
                      </Badge>
                    </p>
                  </Card.Body>
                </Card>

                {/* AI Analysis */}
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-success text-white">
                    <h6 className="mb-0">
                      <i className="ri-brain-line me-1"></i>
                      AI Analysis
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-3">
                      <small className="text-muted">Response Rate</small>
                      <div className="d-flex align-items-center">
                        <ProgressBar 
                          now={selectedPatient.aiAnalysis.responseRate} 
                          className="flex-grow-1 me-2" 
                          style={{height: '8px'}}
                          variant={getResponseColor(selectedPatient.aiAnalysis.responseRate)}
                        />
                        <strong>{selectedPatient.aiAnalysis.responseRate}%</strong>
                      </div>
                    </div>
                    
                    <p><strong>Healing Pattern:</strong> {selectedPatient.aiAnalysis.healingPattern}</p>
                    <p><strong>Recommended Potency:</strong> 
                      <Badge bg="info" className="ms-2">
                        {selectedPatient.aiAnalysis.recommendedPotency}
                      </Badge>
                    </p>
                    
                    <Alert variant="info" className="mt-3">
                      <strong>AI Suggestion:</strong> {selectedPatient.aiAnalysis.nextRemedySuggestion}
                    </Alert>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowPatientModal(false)}>
            Close
          </Button>
          <Button variant="outline-primary">
            <i className="ri-edit-line me-1"></i>
            Edit Patient
          </Button>
          <Button variant="primary">
            <i className="ri-file-text-line me-1"></i>
            New Prescription
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Patient Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-user-add-line me-2 text-primary"></i>
            Add New Patient
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter patient name" />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Age</Form.Label>
                  <Form.Control type="number" placeholder="Age" />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select>
                    <option>Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control type="tel" placeholder="Phone number" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Email address" />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Chief Complaint</Form.Label>
                  <Form.Control as="textarea" rows={3} placeholder="Describe the main problem..." />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary">
            <i className="ri-save-line me-1"></i>
            Save Patient
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .cursor-pointer {
          cursor: pointer;
        }
        .cursor-pointer:hover {
          background-color: #f8f9fa;
        }
        .stat-icon {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .timeline {
          position: relative;
          padding-left: 20px;
        }
        .timeline::before {
          content: '';
          position: absolute;
          left: 8px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #e9ecef;
        }
        .timeline-item {
          position: relative;
          margin-bottom: 20px;
        }
        .timeline-item::before {
          content: '';
          position: absolute;
          left: -16px;
          top: 5px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #007bff;
        }
        .timeline-date {
          font-size: 12px;
          color: #6c757d;
          margin-bottom: 4px;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default HomeopathyPatients;
