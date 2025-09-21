import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Badge, Alert, Modal, Tabs, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ProtectedRoute from '../common/ProtectedRoute';

const CosmetologyDashboard = () => {
  const navigate = useNavigate();
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [clientForm, setClientForm] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    skinType: '',
    hairType: '',
    allergies: '',
    skinConcerns: [],
    hairConcerns: []
  });

  const [stats, setStats] = useState({
    totalClients: 245,
    activeServices: 28,
    monthlyRevenue: 45680,
    appointmentsToday: 12,
    satisfactionRate: 4.8,
    pendingConsultations: 8
  });

  const [recentAppointments, setRecentAppointments] = useState([
    {
      id: 1,
      clientName: "Emma Thompson",
      service: "Hydra Facial",
      time: "10:00 AM",
      status: "Confirmed",
      cosmetologist: "Sarah Martinez"
    },
    {
      id: 2,
      clientName: "Sophie Chen",
      service: "Hair Botox Treatment",
      time: "2:30 PM", 
      status: "In Progress",
      cosmetologist: "Maria Garcia"
    },
    {
      id: 3,
      clientName: "Jessica Wilson",
      service: "Laser Hair Removal",
      time: "4:00 PM",
      status: "Scheduled",
      cosmetologist: "Dr. Amanda Lee"
    }
  ]);

  const [popularServices, setPopularServices] = useState([
    { name: "Hydra Facial", bookings: 156, revenue: 12480 },
    { name: "Botox Injections", bookings: 89, revenue: 26700 },
    { name: "Laser Hair Removal", bookings: 134, revenue: 20100 },
    { name: "Chemical Peels", bookings: 92, revenue: 9200 },
    { name: "Hair Extensions", bookings: 67, revenue: 13400 }
  ]);

  return (
    <div className="cosmetology-dashboard">
      <Container fluid>
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="mb-1">Cosmetology Salon Dashboard</h2>
                <p className="text-muted mb-0">Beauty & Wellness Treatment Management</p>
              </div>
              <div className="d-flex gap-2">
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => setShowNewClientModal(true)}
                >
                  <i className="ri-add-line me-1"></i>New Client
                </Button>
                <Button variant="outline-primary" size="sm">
                  <i className="ri-calendar-check-line me-1"></i>Schedule
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Stats Cards */}
        <Row className="mb-4">
          <Col md={2}>
            <Card className="stat-card border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="stat-icon bg-primary bg-opacity-10 rounded-circle mx-auto mb-2">
                  <i className="ri-user-3-line text-primary fs-4"></i>
                </div>
                <h4 className="mb-1">{stats.totalClients}</h4>
                <p className="text-muted mb-0 small">Total Clients</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="stat-card border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="stat-icon bg-success bg-opacity-10 rounded-circle mx-auto mb-2">
                  <i className="ri-scissors-2-line text-success fs-4"></i>
                </div>
                <h4 className="mb-1">{stats.activeServices}</h4>
                <p className="text-muted mb-0 small">Active Services</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="stat-card border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="stat-icon bg-info bg-opacity-10 rounded-circle mx-auto mb-2">
                  <i className="ri-money-dollar-circle-line text-info fs-4"></i>
                </div>
                <h4 className="mb-1">${stats.monthlyRevenue.toLocaleString()}</h4>
                <p className="text-muted mb-0 small">Monthly Revenue</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="stat-card border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="stat-icon bg-warning bg-opacity-10 rounded-circle mx-auto mb-2">
                  <i className="ri-calendar-line text-warning fs-4"></i>
                </div>
                <h4 className="mb-1">{stats.appointmentsToday}</h4>
                <p className="text-muted mb-0 small">Today's Appointments</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="stat-card border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="stat-icon bg-secondary bg-opacity-10 rounded-circle mx-auto mb-2">
                  <i className="ri-star-line text-secondary fs-4"></i>
                </div>
                <h4 className="mb-1">{stats.satisfactionRate}</h4>
                <p className="text-muted mb-0 small">Satisfaction Rate</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="stat-card border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="stat-icon bg-danger bg-opacity-10 rounded-circle mx-auto mb-2">
                  <i className="ri-notification-2-line text-danger fs-4"></i>
                </div>
                <h4 className="mb-1">{stats.pendingConsultations}</h4>
                <p className="text-muted mb-0 small">Pending Consultations</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Beauty Services Management Section */}
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-lg bg-gradient-primary text-white">
              <Card.Header className="bg-transparent border-0">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h4 className="mb-1 text-white">
                      <i className="ri-magic-line me-2"></i>
                      Beauty & Wellness Services
                    </h4>
                    <p className="mb-0 opacity-75">Professional Cosmetology & Beauty Treatments</p>
                  </div>
                  <div className="d-flex gap-2">
                    <Button variant="light" size="sm">
                      <i className="ri-palette-line me-1"></i>
                      View All Services
                    </Button>
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col lg={3} md={6} className="mb-3">
                    <Card className="h-100 border-0 shadow-sm bg-white text-dark">
                      <Card.Body className="text-center p-3">
                        <div className="mb-3">
                          <i className="ri-drop-line text-primary" style={{ fontSize: '2.5rem' }}></i>
                        </div>
                        <h6 className="mb-2">Facial Treatments</h6>
                        <p className="small text-muted mb-3">
                          HydraFacial, Chemical Peels, Anti-aging, Deep Cleansing
                        </p>
                        <Button variant="outline-primary" size="sm" className="w-100">
                          <i className="ri-spa-line me-1"></i>
                          Book Facial
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col lg={3} md={6} className="mb-3">
                    <Card className="h-100 border-0 shadow-sm bg-white text-dark">
                      <Card.Body className="text-center p-3">
                        <div className="mb-3">
                          <i className="ri-scissors-2-line text-success" style={{ fontSize: '2.5rem' }}></i>
                        </div>
                        <h6 className="mb-2">Hair Services</h6>
                        <p className="small text-muted mb-3">
                          Cut, Color, Extensions, Keratin, Hair Botox Treatments
                        </p>
                        <Button variant="outline-success" size="sm" className="w-100">
                          <i className="ri-scissors-line me-1"></i>
                          Hair Appointment
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col lg={3} md={6} className="mb-3">
                    <Card className="h-100 border-0 shadow-sm bg-white text-dark">
                      <Card.Body className="text-center p-3">
                        <div className="mb-3">
                          <i className="ri-flashlight-line text-info" style={{ fontSize: '2.5rem' }}></i>
                        </div>
                        <h6 className="mb-2">Laser Treatments</h6>
                        <p className="small text-muted mb-3">
                          Hair Removal, Skin Resurfacing, Pigmentation Treatment
                        </p>
                        <Button variant="outline-info" size="sm" className="w-100">
                          <i className="ri-lightbulb-flash-line me-1"></i>
                          Laser Session
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col lg={3} md={6} className="mb-3">
                    <Card className="h-100 border-0 shadow-sm bg-white text-dark">
                      <Card.Body className="text-center p-3">
                        <div className="mb-3">
                          <i className="ri-medicine-bottle-line text-warning" style={{ fontSize: '2.5rem' }}></i>
                        </div>
                        <h6 className="mb-2">Injectable Treatments</h6>
                        <p className="small text-muted mb-3">
                          Botox, Dermal Fillers, PRP, Vitamin Injections
                        </p>
                        <Button variant="outline-warning" size="sm" className="w-100">
                          <i className="ri-syringe-line me-1"></i>
                          Injectable Consult
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Advanced Beauty Features */}
        <Row className="mb-4">
          <Col lg={4} md={6} className="mb-3">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <div className="mb-3">
                  <i className="ri-palette-fill text-danger" style={{ fontSize: '3rem' }}></i>
                </div>
                <h5 className="mb-2">Makeup Services</h5>
                <p className="text-muted mb-3">
                  Professional makeup for events, permanent makeup, makeup lessons and consultations.
                </p>
                <Button variant="outline-danger" className="w-100">
                  <i className="ri-brush-line me-1"></i>
                  Makeup Booking
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} md={6} className="mb-3">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <div className="mb-3">
                  <i className="ri-hand-heart-line text-pink" style={{ fontSize: '3rem' }}></i>
                </div>
                <h5 className="mb-2">Nail Services</h5>
                <p className="text-muted mb-3">
                  Manicures, pedicures, gel polish, nail art, and specialized nail treatments.
                </p>
                <Button variant="outline-secondary" className="w-100">
                  <i className="ri-paint-brush-line me-1"></i>
                  Nail Appointment
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} md={6} className="mb-3">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <div className="mb-3">
                  <i className="ri-leaf-line text-success" style={{ fontSize: '3rem' }}></i>
                </div>
                <h5 className="mb-2">Wellness & Spa</h5>
                <p className="text-muted mb-3">
                  Body treatments, aromatherapy, relaxation massage, and holistic wellness services.
                </p>
                <Button variant="outline-success" className="w-100">
                  <i className="ri-spa-line me-1"></i>
                  Wellness Session
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Today's Schedule & Popular Services */}
        <Row>
          <Col lg={8}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-transparent border-0 pb-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="ri-calendar-check-line text-primary me-2"></i>
                    Today's Appointments
                  </h5>
                  <Button variant="outline-primary" size="sm">
                    View All
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                <Table responsive className="align-middle">
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Service</th>
                      <th>Time</th>
                      <th>Cosmetologist</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAppointments.map(appointment => (
                      <tr key={appointment.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-sm rounded-circle bg-light me-2">
                              <i className="ri-user-3-line text-muted"></i>
                            </div>
                            <strong>{appointment.clientName}</strong>
                          </div>
                        </td>
                        <td>{appointment.service}</td>
                        <td>{appointment.time}</td>
                        <td>{appointment.cosmetologist}</td>
                        <td>
                          <Badge bg={
                            appointment.status === 'Confirmed' ? 'success' :
                            appointment.status === 'In Progress' ? 'primary' :
                            'warning'
                          }>
                            {appointment.status}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button variant="outline-primary" size="sm">
                              <i className="ri-edit-line"></i>
                            </Button>
                            <Button variant="outline-danger" size="sm">
                              <i className="ri-delete-bin-line"></i>
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
          <Col lg={4}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-transparent border-0 pb-0">
                <h5 className="mb-0">
                  <i className="ri-star-line text-warning me-2"></i>
                  Popular Services
                </h5>
              </Card.Header>
              <Card.Body>
                {popularServices.map((service, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h6 className="mb-1">{service.name}</h6>
                      <small className="text-muted">{service.bookings} bookings</small>
                    </div>
                    <div className="text-end">
                      <strong className="text-success">${service.revenue.toLocaleString()}</strong>
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* New Client Modal */}
      <Modal show={showNewClientModal} onHide={() => setShowNewClientModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-user-add-line me-2"></i>
            Add New Client
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter client name"
                    value={clientForm.name}
                    onChange={(e) => setClientForm({...clientForm, name: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Age</Form.Label>
                  <Form.Control 
                    type="number" 
                    placeholder="Age"
                    value={clientForm.age}
                    onChange={(e) => setClientForm({...clientForm, age: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select 
                    value={clientForm.gender}
                    onChange={(e) => setClientForm({...clientForm, gender: e.target.value})}
                  >
                    <option>Select Gender</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control 
                    type="tel" 
                    placeholder="Phone number"
                    value={clientForm.phone}
                    onChange={(e) => setClientForm({...clientForm, phone: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="Email address"
                    value={clientForm.email}
                    onChange={(e) => setClientForm({...clientForm, email: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Skin Type</Form.Label>
                  <Form.Select 
                    value={clientForm.skinType}
                    onChange={(e) => setClientForm({...clientForm, skinType: e.target.value})}
                  >
                    <option>Select Skin Type</option>
                    <option value="oily">Oily</option>
                    <option value="dry">Dry</option>
                    <option value="combination">Combination</option>
                    <option value="sensitive">Sensitive</option>
                    <option value="normal">Normal</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hair Type</Form.Label>
                  <Form.Select 
                    value={clientForm.hairType}
                    onChange={(e) => setClientForm({...clientForm, hairType: e.target.value})}
                  >
                    <option>Select Hair Type</option>
                    <option value="straight">Straight</option>
                    <option value="wavy">Wavy</option>
                    <option value="curly">Curly</option>
                    <option value="coily">Coily</option>
                    <option value="fine">Fine</option>
                    <option value="thick">Thick</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Known Allergies</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={2}
                placeholder="List any known allergies to products or ingredients"
                value={clientForm.allergies}
                onChange={(e) => setClientForm({...clientForm, allergies: e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNewClientModal(false)}>
            Cancel
          </Button>
          <Button variant="primary">
            <i className="ri-save-line me-1"></i>
            Add Client
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CosmetologyDashboard;
