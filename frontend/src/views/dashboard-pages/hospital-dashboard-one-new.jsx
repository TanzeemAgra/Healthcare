/**
 * Advanced Hospital Management Dashboard
 * 
 * A comprehensive, user-friendly hospital management system with advanced features
 * including real-time monitoring, AI insights, patient flow optimization, and
 * interactive management tools.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Row, Col, Card, Button, Badge, Table, Modal, Form,
  InputGroup, Alert, Dropdown, Nav, Tab, ProgressBar, Toast, ToastContainer,
  Accordion, ListGroup, Spinner, Carousel
} from 'react-bootstrap';
import {
  FaHospital, FaUserMd, FaUsers, FaBed, FaAmbulance, FaChartLine,
  FaCalendarCheck, FaPills, FaStethoscope, FaHeartbeat, FaClock,
  FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaSearch, FaPlus,
  FaEdit, FaTrash, FaEye, FaDownload, FaPrint, FaShareAlt,
  FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaSync,
  FaBell, FaFilter, FaSortAmountDown, FaRobot, FaChartPie,
  FaUserNurse, FaClipboardList, FaMedkit, FaXRay, FaFlask,
  FaWheelchair, FaHandsHelping, FaStar, FaAward, FaTrophy
} from 'react-icons/fa';
import Chart from 'react-apexcharts';

// Advanced Hospital Dashboard Component
const HospitalDashboardOne = () => {
  // Core State Management
  const [activeTab, setActiveTab] = useState('overview');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCriteria, setFilterCriteria] = useState('all');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);

  // Advanced State for Hospital Operations
  const [hospitalStats, setHospitalStats] = useState({
    totalPatients: 1247,
    admittedToday: 23,
    dischargedToday: 18,
    surgeriesToday: 7,
    emergencyCases: 12,
    occupancyRate: 78,
    averageStayDuration: 4.2,
    patientSatisfaction: 94
  });

  const [departments] = useState([
    { id: 1, name: 'Emergency', patients: 45, doctors: 8, status: 'critical', occupancy: 95 },
    { id: 2, name: 'Cardiology', patients: 32, doctors: 6, status: 'normal', occupancy: 72 },
    { id: 3, name: 'Neurology', patients: 28, doctors: 5, status: 'normal', occupancy: 68 },
    { id: 4, name: 'Pediatrics', patients: 41, doctors: 7, status: 'busy', occupancy: 85 },
    { id: 5, name: 'Oncology', patients: 25, doctors: 4, status: 'normal', occupancy: 60 },
    { id: 6, name: 'Orthopedics', patients: 38, doctors: 6, status: 'busy', occupancy: 82 }
  ]);

  const [staffData] = useState([
    { 
      id: 1, 
      name: 'Dr. Sarah Johnson', 
      role: 'Chief of Cardiology', 
      department: 'Cardiology',
      status: 'on-duty', 
      patients: 12, 
      rating: 4.9,
      specialization: 'Interventional Cardiology',
      experience: '15 years',
      availability: 'Available'
    },
    { 
      id: 2, 
      name: 'Dr. Michael Chen', 
      role: 'Emergency Physician', 
      department: 'Emergency',
      status: 'surgery', 
      patients: 8, 
      rating: 4.8,
      specialization: 'Emergency Medicine',
      experience: '12 years',
      availability: 'In Surgery'
    },
    { 
      id: 3, 
      name: 'Dr. Emily Rodriguez', 
      role: 'Pediatric Surgeon', 
      department: 'Pediatrics',
      status: 'on-duty', 
      patients: 15, 
      rating: 4.9,
      specialization: 'Pediatric Surgery',
      experience: '18 years',
      availability: 'Available'
    },
    { 
      id: 4, 
      name: 'Nurse Patricia Wilson', 
      role: 'Head Nurse', 
      department: 'ICU',
      status: 'on-duty', 
      patients: 20, 
      rating: 4.7,
      specialization: 'Critical Care',
      experience: '10 years',
      availability: 'Available'
    }
  ]);

  const [patientQueue] = useState([
    { 
      id: 1, 
      name: 'John Smith', 
      age: 45, 
      priority: 'high', 
      department: 'Emergency',
      waitTime: '15 min',
      condition: 'Chest Pain',
      assignedDoctor: 'Dr. Michael Chen',
      status: 'waiting'
    },
    { 
      id: 2, 
      name: 'Maria Garcia', 
      age: 32, 
      priority: 'medium', 
      department: 'Cardiology',
      waitTime: '30 min',
      condition: 'Routine Checkup',
      assignedDoctor: 'Dr. Sarah Johnson',
      status: 'in-consultation'
    },
    { 
      id: 3, 
      name: 'Robert Brown', 
      age: 67, 
      priority: 'low', 
      department: 'Orthopedics',
      waitTime: '45 min',
      condition: 'Joint Pain',
      assignedDoctor: 'Dr. David Lee',
      status: 'waiting'
    }
  ]);

  const [emergencyAlerts] = useState([
    { 
      id: 1, 
      type: 'critical', 
      message: 'Code Blue - Room 304', 
      timestamp: '2 min ago',
      department: 'ICU',
      status: 'active'
    },
    { 
      id: 2, 
      type: 'warning', 
      message: 'Low oxygen supply in OR-3', 
      timestamp: '5 min ago',
      department: 'Surgery',
      status: 'acknowledged'
    },
    { 
      id: 3, 
      type: 'info', 
      message: 'New patient admitted to Emergency', 
      timestamp: '8 min ago',
      department: 'Emergency',
      status: 'resolved'
    }
  ]);

  // Real-time updates simulation
  useEffect(() => {
    if (realTimeUpdates) {
      const interval = setInterval(() => {
        setHospitalStats(prev => ({
          ...prev,
          totalPatients: prev.totalPatients + Math.floor(Math.random() * 3) - 1,
          occupancyRate: Math.min(100, Math.max(50, prev.occupancyRate + Math.floor(Math.random() * 6) - 3))
        }));
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }
  }, [realTimeUpdates]);

  // Utility Functions
  const showNotification = (message, variant = 'success') => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  const handleModalOpen = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedItem(null);
    setModalType('');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'danger';
      case 'busy': return 'warning';
      case 'normal': return 'success';
      default: return 'secondary';
    }
  };

  // Chart Data for Advanced Analytics
  const chartOptions = {
    overview: {
      series: [
        {
          name: 'Patients',
          data: [120, 145, 135, 158, 142, 167, 156, 178, 165, 189, 174, 195]
        },
        {
          name: 'Admissions',
          data: [45, 52, 48, 58, 51, 62, 56, 68, 61, 72, 65, 78]
        }
      ],
      options: {
        chart: {
          type: 'area',
          height: 300,
          toolbar: { show: true }
        },
        colors: ['#3b82f6', '#10b981'],
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.3
          }
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yaxis: {
          title: { text: 'Count' }
        },
        tooltip: {
          shared: true,
          intersect: false
        }
      }
    },
    departmentOccupancy: {
      series: departments.map(dept => dept.occupancy),
      options: {
        chart: {
          type: 'donut',
          height: 300
        },
        labels: departments.map(dept => dept.name),
        colors: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#f97316'],
        legend: {
          position: 'bottom'
        },
        plotOptions: {
          pie: {
            donut: {
              size: '65%'
            }
          }
        }
      }
    }
  };

  return (
    <Container fluid className="p-4">
      {/* Header Section */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">
                <FaHospital className="me-2 text-primary" />
                Advanced Hospital Management
              </h2>
              <p className="text-muted mb-0">Comprehensive healthcare management system</p>
            </div>
            <div className="d-flex gap-2">
              <Button 
                variant={realTimeUpdates ? "success" : "outline-secondary"}
                onClick={() => setRealTimeUpdates(!realTimeUpdates)}
              >
                <FaSync className={realTimeUpdates ? "fa-spin" : ""} /> 
                {realTimeUpdates ? "Live" : "Paused"}
              </Button>
              <Button variant="primary" onClick={() => handleModalOpen('newPatient')}>
                <FaPlus /> Add Patient
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Real-time Stats Cards */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <FaUsers className="text-primary fs-3" />
                <Badge bg="success">+{hospitalStats.admittedToday} today</Badge>
              </div>
              <h3 className="mb-1">{hospitalStats.totalPatients.toLocaleString()}</h3>
              <p className="text-muted mb-0">Total Patients</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <FaBed className="text-success fs-3" />
                <Badge bg="info">{hospitalStats.occupancyRate}%</Badge>
              </div>
              <h3 className="mb-1">{hospitalStats.admittedToday}</h3>
              <p className="text-muted mb-0">Admitted Today</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <FaAmbulance className="text-danger fs-3" />
                <Badge bg="warning">{hospitalStats.emergencyCases} active</Badge>
              </div>
              <h3 className="mb-1">{hospitalStats.surgeriesToday}</h3>
              <p className="text-muted mb-0">Surgeries Today</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <FaStar className="text-warning fs-3" />
                <Badge bg="success">{hospitalStats.patientSatisfaction}%</Badge>
              </div>
              <h3 className="mb-1">{hospitalStats.averageStayDuration}</h3>
              <p className="text-muted mb-0">Avg Stay (days)</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Emergency Alerts */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-transparent border-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <FaBell className="me-2 text-danger" />
                  Emergency Alerts
                </h5>
                <Badge bg="danger">{emergencyAlerts.filter(alert => alert.status === 'active').length} Active</Badge>
              </div>
            </Card.Header>
            <Card.Body>
              {emergencyAlerts.map(alert => (
                <Alert 
                  key={alert.id} 
                  variant={alert.type === 'critical' ? 'danger' : alert.type === 'warning' ? 'warning' : 'info'}
                  className="d-flex justify-content-between align-items-center mb-2"
                >
                  <div>
                    <strong>{alert.message}</strong>
                    <div className="small text-muted">{alert.department} • {alert.timestamp}</div>
                  </div>
                  <Badge bg={alert.status === 'active' ? 'danger' : 'success'}>
                    {alert.status}
                  </Badge>
                </Alert>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Navigation Tabs */}
      <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey="overview">
              <FaChartLine className="me-2" />
              Overview
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="patients">
              <FaUsers className="me-2" />
              Patient Management
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="staff">
              <FaUserMd className="me-2" />
              Staff Management
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="departments">
              <FaHospital className="me-2" />
              Departments
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="operations">
              <FaClipboardList className="me-2" />
              Operations
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="analytics">
              <FaRobot className="me-2" />
              AI Insights
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          {/* Overview Tab */}
          <Tab.Pane eventKey="overview">
            <Row>
              <Col lg={8} className="mb-4">
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-transparent border-0">
                    <h5 className="mb-0">Patient & Admission Trends</h5>
                  </Card.Header>
                  <Card.Body>
                    <Chart
                      options={chartOptions.overview.options}
                      series={chartOptions.overview.series}
                      type="area"
                      height={300}
                    />
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={4} className="mb-4">
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-transparent border-0">
                    <h5 className="mb-0">Department Occupancy</h5>
                  </Card.Header>
                  <Card.Body>
                    <Chart
                      options={chartOptions.departmentOccupancy.options}
                      series={chartOptions.departmentOccupancy.series}
                      type="donut"
                      height={300}
                    />
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Department Status Grid */}
            <Row>
              {departments.map(dept => (
                <Col lg={4} md={6} key={dept.id} className="mb-3">
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0">{dept.name}</h6>
                        <Badge bg={getStatusColor(dept.status)}>{dept.status}</Badge>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Patients:</span>
                        <strong>{dept.patients}</strong>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Doctors:</span>
                        <strong>{dept.doctors}</strong>
                      </div>
                      <div className="mt-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span className="small text-muted">Occupancy</span>
                          <span className="small text-muted">{dept.occupancy}%</span>
                        </div>
                        <ProgressBar 
                          now={dept.occupancy} 
                          variant={dept.occupancy > 90 ? 'danger' : dept.occupancy > 75 ? 'warning' : 'success'}
                        />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Tab.Pane>

          {/* Patient Management Tab */}
          <Tab.Pane eventKey="patients">
            <Row className="mb-4">
              <Col>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-transparent border-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">Patient Queue</h5>
                      <div className="d-flex gap-2">
                        <InputGroup style={{ width: '300px' }}>
                          <InputGroup.Text>
                            <FaSearch />
                          </InputGroup.Text>
                          <Form.Control
                            placeholder="Search patients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </InputGroup>
                        <Dropdown>
                          <Dropdown.Toggle variant="outline-secondary">
                            <FaFilter /> Filter
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setFilterCriteria('all')}>All Patients</Dropdown.Item>
                            <Dropdown.Item onClick={() => setFilterCriteria('high')}>High Priority</Dropdown.Item>
                            <Dropdown.Item onClick={() => setFilterCriteria('medium')}>Medium Priority</Dropdown.Item>
                            <Dropdown.Item onClick={() => setFilterCriteria('low')}>Low Priority</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <Table responsive hover>
                      <thead>
                        <tr>
                          <th>Patient</th>
                          <th>Age</th>
                          <th>Priority</th>
                          <th>Department</th>
                          <th>Condition</th>
                          <th>Doctor</th>
                          <th>Wait Time</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {patientQueue
                          .filter(patient => 
                            filterCriteria === 'all' || patient.priority === filterCriteria
                          )
                          .filter(patient =>
                            patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map(patient => (
                            <tr key={patient.id}>
                              <td>
                                <strong>{patient.name}</strong>
                                <div className="small text-muted">ID: {patient.id}</div>
                              </td>
                              <td>{patient.age}</td>
                              <td>
                                <Badge bg={getPriorityColor(patient.priority)}>
                                  {patient.priority.toUpperCase()}
                                </Badge>
                              </td>
                              <td>{patient.department}</td>
                              <td>{patient.condition}</td>
                              <td>{patient.assignedDoctor}</td>
                              <td>
                                <Badge bg="info">{patient.waitTime}</Badge>
                              </td>
                              <td>
                                <Badge bg={patient.status === 'in-consultation' ? 'success' : 'warning'}>
                                  {patient.status}
                                </Badge>
                              </td>
                              <td>
                                <div className="d-flex gap-1">
                                  <Button size="sm" variant="outline-primary" onClick={() => handleModalOpen('patientDetails', patient)}>
                                    <FaEye />
                                  </Button>
                                  <Button size="sm" variant="outline-success" onClick={() => handleModalOpen('editPatient', patient)}>
                                    <FaEdit />
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
          </Tab.Pane>

          {/* Staff Management Tab */}
          <Tab.Pane eventKey="staff">
            <Row>
              {staffData.map(staff => (
                <Col lg={6} xl={4} key={staff.id} className="mb-4">
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="d-flex align-items-center">
                          <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '50px', height: '50px'}}>
                            <FaUserMd className="text-white" />
                          </div>
                          <div>
                            <h6 className="mb-0">{staff.name}</h6>
                            <p className="text-muted mb-0 small">{staff.role}</p>
                          </div>
                        </div>
                        <Badge bg={staff.status === 'on-duty' ? 'success' : staff.status === 'surgery' ? 'warning' : 'secondary'}>
                          {staff.availability}
                        </Badge>
                      </div>
                      
                      <div className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span className="small text-muted">Department:</span>
                          <span className="small">{staff.department}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <span className="small text-muted">Patients:</span>
                          <span className="small">{staff.patients}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <span className="small text-muted">Experience:</span>
                          <span className="small">{staff.experience}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <span className="small text-muted">Rating:</span>
                          <div className="d-flex align-items-center">
                            <FaStar className="text-warning me-1" />
                            <span className="small">{staff.rating}</span>
                          </div>
                        </div>
                      </div>

                      <div className="d-flex gap-2">
                        <Button size="sm" variant="outline-primary" className="flex-fill">
                          <FaPhoneAlt className="me-1" />
                          Contact
                        </Button>
                        <Button size="sm" variant="outline-success" onClick={() => handleModalOpen('staffSchedule', staff)}>
                          <FaCalendarCheck className="me-1" />
                          Schedule
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Tab.Pane>

          {/* Departments Tab */}
          <Tab.Pane eventKey="departments">
            <Row>
              <Col>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-transparent border-0">
                    <h5 className="mb-0">Department Management</h5>
                  </Card.Header>
                  <Card.Body>
                    <Accordion>
                      {departments.map((dept, index) => (
                        <Accordion.Item eventKey={index.toString()} key={dept.id}>
                          <Accordion.Header>
                            <div className="d-flex justify-content-between align-items-center w-100 me-3">
                              <div>
                                <strong>{dept.name} Department</strong>
                                <div className="small text-muted">{dept.patients} patients • {dept.doctors} doctors</div>
                              </div>
                              <Badge bg={getStatusColor(dept.status)}>{dept.status}</Badge>
                            </div>
                          </Accordion.Header>
                          <Accordion.Body>
                            <Row>
                              <Col md={6}>
                                <h6>Current Statistics</h6>
                                <ListGroup variant="flush">
                                  <ListGroup.Item className="d-flex justify-content-between">
                                    <span>Total Patients:</span>
                                    <Badge bg="primary">{dept.patients}</Badge>
                                  </ListGroup.Item>
                                  <ListGroup.Item className="d-flex justify-content-between">
                                    <span>Available Doctors:</span>
                                    <Badge bg="success">{dept.doctors}</Badge>
                                  </ListGroup.Item>
                                  <ListGroup.Item className="d-flex justify-content-between">
                                    <span>Occupancy Rate:</span>
                                    <Badge bg={dept.occupancy > 90 ? 'danger' : 'info'}>{dept.occupancy}%</Badge>
                                  </ListGroup.Item>
                                </ListGroup>
                              </Col>
                              <Col md={6}>
                                <h6>Quick Actions</h6>
                                <div className="d-grid gap-2">
                                  <Button variant="outline-primary" size="sm">
                                    <FaUsers className="me-2" />
                                    View All Patients
                                  </Button>
                                  <Button variant="outline-success" size="sm">
                                    <FaUserMd className="me-2" />
                                    Manage Staff
                                  </Button>
                                  <Button variant="outline-info" size="sm">
                                    <FaChartLine className="me-2" />
                                    View Analytics
                                  </Button>
                                </div>
                              </Col>
                            </Row>
                          </Accordion.Body>
                        </Accordion.Item>
                      ))}
                    </Accordion>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>

          {/* Operations Tab */}
          <Tab.Pane eventKey="operations">
            <Row>
              <Col lg={4} className="mb-4">
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-primary text-white">
                    <h6 className="mb-0">
                      <FaMedkit className="me-2" />
                      Inventory Management
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-grid gap-2">
                      <Button variant="outline-primary">
                        <FaPills className="me-2" />
                        Pharmacy Stock
                      </Button>
                      <Button variant="outline-success">
                        <FaStethoscope className="me-2" />
                        Medical Equipment
                      </Button>
                      <Button variant="outline-warning">
                        <FaFlask className="me-2" />
                        Lab Supplies
                      </Button>
                      <Button variant="outline-info">
                        <FaXRay className="me-2" />
                        Radiology Materials
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={4} className="mb-4">
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-success text-white">
                    <h6 className="mb-0">
                      <FaCalendarCheck className="me-2" />
                      Scheduling
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-grid gap-2">
                      <Button variant="outline-primary">
                        <FaUserMd className="me-2" />
                        Doctor Schedules
                      </Button>
                      <Button variant="outline-success">
                        <FaUserNurse className="me-2" />
                        Nurse Schedules
                      </Button>
                      <Button variant="outline-warning">
                        <FaBed className="me-2" />
                        Room Assignments
                      </Button>
                      <Button variant="outline-info">
                        <FaAmbulance className="me-2" />
                        Emergency Roster
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={4} className="mb-4">
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-warning text-dark">
                    <h6 className="mb-0">
                      <FaExclamationTriangle className="me-2" />
                      Emergency Management
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-grid gap-2">
                      <Button variant="outline-danger">
                        <FaHeartbeat className="me-2" />
                        Code Blue Protocol
                      </Button>
                      <Button variant="outline-warning">
                        <FaAmbulance className="me-2" />
                        Ambulance Dispatch
                      </Button>
                      <Button variant="outline-info">
                        <FaPhoneAlt className="me-2" />
                        Emergency Contacts
                      </Button>
                      <Button variant="outline-success">
                        <FaHandsHelping className="me-2" />
                        Disaster Response
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Resource Utilization */}
            <Row>
              <Col>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-transparent border-0">
                    <h5 className="mb-0">Resource Utilization</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={3} className="mb-3">
                        <div className="text-center">
                          <h4 className="text-success">89%</h4>
                          <p className="mb-0">OR Utilization</p>
                          <ProgressBar now={89} variant="success" />
                        </div>
                      </Col>
                      <Col md={3} className="mb-3">
                        <div className="text-center">
                          <h4 className="text-warning">76%</h4>
                          <p className="mb-0">ICU Capacity</p>
                          <ProgressBar now={76} variant="warning" />
                        </div>
                      </Col>
                      <Col md={3} className="mb-3">
                        <div className="text-center">
                          <h4 className="text-info">82%</h4>
                          <p className="mb-0">Lab Efficiency</p>
                          <ProgressBar now={82} variant="info" />
                        </div>
                      </Col>
                      <Col md={3} className="mb-3">
                        <div className="text-center">
                          <h4 className="text-primary">94%</h4>
                          <p className="mb-0">Staff Utilization</p>
                          <ProgressBar now={94} variant="primary" />
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>

          {/* AI Insights Tab */}
          <Tab.Pane eventKey="analytics">
            <Row className="mb-4">
              <Col>
                <Alert variant="info">
                  <FaRobot className="me-2" />
                  <strong>AI-Powered Insights</strong> - Advanced analytics and predictions based on hospital data
                </Alert>
              </Col>
            </Row>

            <Row>
              <Col lg={6} className="mb-4">
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-transparent border-0">
                    <h6 className="mb-0">
                      <FaChartPie className="me-2" />
                      Predictive Analytics
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-3">
                      <h6 className="text-success">Patient Flow Prediction</h6>
                      <p className="small text-muted">Expected 15% increase in Emergency admissions tomorrow</p>
                      <ProgressBar now={75} variant="success" className="mb-2" />
                    </div>
                    <div className="mb-3">
                      <h6 className="text-warning">Resource Optimization</h6>
                      <p className="small text-muted">OR-3 recommended for maintenance during low usage period</p>
                      <ProgressBar now={60} variant="warning" className="mb-2" />
                    </div>
                    <div>
                      <h6 className="text-info">Staff Allocation</h6>
                      <p className="small text-muted">Additional nurses needed in ICU for night shift</p>
                      <ProgressBar now={85} variant="info" />
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={6} className="mb-4">
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-transparent border-0">
                    <h6 className="mb-0">
                      <FaTrophy className="me-2" />
                      Performance Metrics
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>Patient Satisfaction</span>
                        <span className="text-success">94%</span>
                      </div>
                      <ProgressBar now={94} variant="success" />
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>Average Wait Time</span>
                        <span className="text-warning">23 min</span>
                      </div>
                      <ProgressBar now={77} variant="warning" />
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>Treatment Success Rate</span>
                        <span className="text-success">97%</span>
                      </div>
                      <ProgressBar now={97} variant="success" />
                    </div>
                    <div>
                      <div className="d-flex justify-content-between mb-1">
                        <span>Equipment Efficiency</span>
                        <span className="text-info">89%</span>
                      </div>
                      <ProgressBar now={89} variant="info" />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* AI Recommendations */}
            <Row>
              <Col>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-transparent border-0">
                    <h6 className="mb-0">
                      <FaRobot className="me-2" />
                      AI Recommendations
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <ListGroup variant="flush">
                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>Optimize Emergency Department Flow</strong>
                          <div className="small text-muted">Implement triage priority algorithm to reduce wait times by 15%</div>
                        </div>
                        <Badge bg="success">High Impact</Badge>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>Staff Schedule Optimization</strong>
                          <div className="small text-muted">Adjust nurse schedules to match patient admission patterns</div>
                        </div>
                        <Badge bg="warning">Medium Impact</Badge>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>Equipment Maintenance Alert</strong>
                          <div className="small text-muted">Schedule preventive maintenance for MRI-2 based on usage patterns</div>
                        </div>
                        <Badge bg="info">Low Impact</Badge>
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      {/* Enhanced Modal System */}
      <Modal show={showModal} onHide={handleModalClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === 'newPatient' && 'Add New Patient'}
            {modalType === 'patientDetails' && 'Patient Details'}
            {modalType === 'editPatient' && 'Edit Patient'}
            {modalType === 'staffSchedule' && 'Staff Schedule'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === 'newPatient' && (
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Patient Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter patient name" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Age</Form.Label>
                    <Form.Control type="number" placeholder="Enter age" />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Department</Form.Label>
                    <Form.Select>
                      <option>Select Department</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.name}>{dept.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Priority</Form.Label>
                    <Form.Select>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Chief Complaint</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Describe the patient's condition" />
              </Form.Group>
            </Form>
          )}
          
          {modalType === 'patientDetails' && selectedItem && (
            <div>
              <Row>
                <Col md={6}>
                  <h6>Patient Information</h6>
                  <p><strong>Name:</strong> {selectedItem.name}</p>
                  <p><strong>Age:</strong> {selectedItem.age}</p>
                  <p><strong>Priority:</strong> <Badge bg={getPriorityColor(selectedItem.priority)}>{selectedItem.priority}</Badge></p>
                  <p><strong>Department:</strong> {selectedItem.department}</p>
                </Col>
                <Col md={6}>
                  <h6>Medical Details</h6>
                  <p><strong>Condition:</strong> {selectedItem.condition}</p>
                  <p><strong>Assigned Doctor:</strong> {selectedItem.assignedDoctor}</p>
                  <p><strong>Status:</strong> <Badge bg={selectedItem.status === 'in-consultation' ? 'success' : 'warning'}>{selectedItem.status}</Badge></p>
                  <p><strong>Wait Time:</strong> {selectedItem.waitTime}</p>
                </Col>
              </Row>
            </div>
          )}

          {modalType === 'staffSchedule' && selectedItem && (
            <div>
              <h6>{selectedItem.name} - Schedule</h6>
              <Table striped>
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Shift</th>
                    <th>Department</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Monday</td>
                    <td>8:00 AM - 4:00 PM</td>
                    <td>{selectedItem.department}</td>
                    <td><Badge bg="success">Scheduled</Badge></td>
                  </tr>
                  <tr>
                    <td>Tuesday</td>
                    <td>8:00 AM - 4:00 PM</td>
                    <td>{selectedItem.department}</td>
                    <td><Badge bg="success">Scheduled</Badge></td>
                  </tr>
                  <tr>
                    <td>Wednesday</td>
                    <td>Off</td>
                    <td>-</td>
                    <td><Badge bg="secondary">Off</Badge></td>
                  </tr>
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          {modalType === 'newPatient' && (
            <Button variant="primary" onClick={() => {
              showNotification('Patient added successfully!');
              handleModalClose();
            }}>
              Add Patient
            </Button>
          )}
          {modalType === 'editPatient' && (
            <Button variant="primary" onClick={() => {
              showNotification('Patient updated successfully!');
              handleModalClose();
            }}>
              Save Changes
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Toast Notifications */}
      <ToastContainer position="top-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
          <Toast.Header>
            <strong className="me-auto">Hospital Management</strong>
          </Toast.Header>
          <Toast.Body className={`text-${toastVariant}`}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default HospitalDashboardOne;
