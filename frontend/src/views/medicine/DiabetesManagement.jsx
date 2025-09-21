import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api';
import { MEDICINE_ENDPOINTS } from '../../services/apiConstants';
import { Container, Row, Col, Card, Nav, Tab, Button, Modal, Form, Alert, Table, Badge, ProgressBar } from 'react-bootstrap';
import { Line, Doughnut, Bar, Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const DiabetesManagement = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [diabetesData, setDiabetesData] = useState({
    dashboard: {},
    patients: [],
    selectedPatient: null,
    glucoseReadings: [],
    hba1cRecords: [],
    medications: [],
    screenings: [],
    goals: []
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'info' });

  useEffect(() => {
    fetchDashboardData();
    fetchDiabetesPatients();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data } = await apiClient.get(MEDICINE_ENDPOINTS.DIABETES.DASHBOARD_STATS);
      setDiabetesData(prev => ({ ...prev, dashboard: data }));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setAlert({ show: true, message: 'Error connecting to backend. Please ensure the backend server is running.', type: 'warning' });
    }
  };

  const fetchDiabetesPatients = async () => {
    try {
      const { data } = await apiClient.get(MEDICINE_ENDPOINTS.DIABETES.PATIENTS);
      setDiabetesData(prev => ({ ...prev, patients: data.results || data }));
    } catch (error) {
      console.error('Error fetching patients:', error);
      setAlert({ show: true, message: 'Error fetching patients data.', type: 'warning' });
    }
  };

  const fetchPatientData = async (patientId) => {
    try {
      setLoading(true);
      const [glucoseRes, hba1cRes, medsRes, screeningsRes, goalsRes] = await Promise.all([
        apiClient.get(MEDICINE_ENDPOINTS.DIABETES.GLUCOSE_READINGS, { params: { diabetes_patient: patientId } }),
        apiClient.get(MEDICINE_ENDPOINTS.DIABETES.HBA1C_RECORDS, { params: { diabetes_patient: patientId } }),
        apiClient.get(MEDICINE_ENDPOINTS.DIABETES.MEDICATIONS, { params: { diabetes_patient: patientId } }),
        apiClient.get(MEDICINE_ENDPOINTS.DIABETES.SCREENINGS, { params: { diabetes_patient: patientId } }),
        apiClient.get(MEDICINE_ENDPOINTS.DIABETES.GOALS, { params: { diabetes_patient: patientId } })
      ]);

      setDiabetesData(prev => ({
        ...prev,
        glucoseReadings: glucoseRes.data.results || glucoseRes.data,
        hba1cRecords: hba1cRes.data.results || hba1cRes.data,
        medications: medsRes.data.results || medsRes.data,
        screenings: screeningsRes.data.results || screeningsRes.data,
        goals: goalsRes.data.results || goalsRes.data
      }));
    } catch (error) {
      console.error('Error fetching patient data:', error);
      setAlert({ show: true, message: 'Error loading patient data', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSelect = (patient) => {
    setDiabetesData(prev => ({ ...prev, selectedPatient: patient }));
    fetchPatientData(patient.id);
  };

  const openModal = (type, data = {}) => {
    setModalType(type);
    setFormData(data);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
  const endpoint = getEndpointForModalType(modalType);
      const method = formData.id ? 'PUT' : 'POST';
      const url = formData.id ? `${endpoint}${formData.id}/` : endpoint;

      const config = { headers: { 'Content-Type': 'application/json' } };
  const req = method === 'PUT' ? apiClient.put(url, formData, config)
               : apiClient.post(url, formData, config);
      const response = await req;

      if (response && (response.status === 200 || response.status === 201)) {
        setAlert({ show: true, message: 'Data saved successfully!', type: 'success' });
        setShowModal(false);
        // Refresh data
        if (diabetesData.selectedPatient) {
          fetchPatientData(diabetesData.selectedPatient.id);
        }
        fetchDashboardData();
        fetchDiabetesPatients();
      } else {
        throw new Error('Failed to save data');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      setAlert({ show: true, message: `Error saving data: ${error.message}`, type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const getEndpointForModalType = (type) => {
    const endpoints = {
      glucose: `/medicine/glucose-readings/`,
      hba1c: `/medicine/hba1c-records/`,
      medication: `/medicine/diabetes-medications/`,
      screening: `/medicine/diabetes-screenings/`,
      goal: `/medicine/diabetes-goals/`,
      education: `/medicine/diabetes-education/`,
      emergency: `/medicine/diabetes-emergencies/`,
    };
    return endpoints[type] || '';
  };

  const getCsrfToken = () => {
    return document.querySelector('[name=csrfmiddlewaretoken]')?.value || '';
  };

  const renderDashboard = () => {
    const { dashboard } = diabetesData;
    
    const glucoseControlChart = {
      labels: ['At Target', 'Above Target', 'Below Target'],
      datasets: [{
        data: [
          dashboard.patients_at_hba1c_target || 0,
          dashboard.patients_with_hyperglycemia_events || 0,
          dashboard.patients_with_hypoglycemia_events || 0
        ],
        backgroundColor: ['#28a745', '#dc3545', '#ffc107']
      }]
    };

    const diabetesTypeChart = {
      labels: ['Type 1', 'Type 2', 'Gestational'],
      datasets: [{
        data: [
          dashboard.type1_patients || 0,
          dashboard.type2_patients || 0,
          dashboard.gestational_patients || 0
        ],
        backgroundColor: ['#007bff', '#17a2b8', '#6f42c1']
      }]
    };

    return (
      <div>
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h2 className="text-primary">{dashboard.total_diabetes_patients || 0}</h2>
                <Card.Text>Total Diabetes Patients</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h2 className="text-success">{dashboard.patients_at_hba1c_target || 0}</h2>
                <Card.Text>Patients at HbA1c Target</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h2 className="text-info">{dashboard.average_hba1c || '0.0'}%</h2>
                <Card.Text>Average HbA1c</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h2 className="text-warning">{dashboard.glucose_readings_today || 0}</h2>
                <Card.Text>Glucose Readings Today</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <Card>
              <Card.Header>
                <h5>Glucose Control Distribution</h5>
              </Card.Header>
              <Card.Body>
                <Doughnut data={glucoseControlChart} />
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <Card.Header>
                <h5>Diabetes Types</h5>
              </Card.Header>
              <Card.Body>
                <Doughnut data={diabetesTypeChart} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Card>
              <Card.Header>
                <h6>Overdue Screenings</h6>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <span>Eye Exams:</span>
                  <Badge bg="danger">{dashboard.overdue_eye_exams || 0}</Badge>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Foot Exams:</span>
                  <Badge bg="danger">{dashboard.overdue_foot_exams || 0}</Badge>
                </div>
                <div className="d-flex justify-content-between">
                  <span>HbA1c Tests:</span>
                  <Badge bg="danger">{dashboard.overdue_hba1c_tests || 0}</Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Header>
                <h6>Recent Activity</h6>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <span>Emergency Events (Week):</span>
                  <Badge bg="warning">{dashboard.emergency_events_this_week || 0}</Badge>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Education Sessions (Month):</span>
                  <Badge bg="info">{dashboard.education_sessions_this_month || 0}</Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Header>
                <h6>Quick Actions</h6>
              </Card.Header>
              <Card.Body>
                <div className="d-grid gap-2">
                  <Button variant="outline-primary" size="sm" onClick={() => openModal('glucose')}>
                    Add Glucose Reading
                  </Button>
                  <Button variant="outline-success" size="sm" onClick={() => openModal('hba1c')}>
                    Record HbA1c
                  </Button>
                  <Button variant="outline-info" size="sm" onClick={() => openModal('screening')}>
                    Schedule Screening
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  const renderPatientList = () => {
    return (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Diabetes Patients</h4>
          <Button variant="primary" onClick={() => openModal('patient')}>
            Add New Patient
          </Button>
        </div>
        
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Diabetes Type</th>
              <th>Current HbA1c</th>
              <th>Target HbA1c</th>
              <th>Last Glucose</th>
              <th>Complications</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {diabetesData.patients.map(patient => (
              <tr key={patient.id}>
                <td>{patient.patient_details?.user?.first_name} {patient.patient_details?.user?.last_name}</td>
                <td>
                  <Badge bg={patient.diabetes_type === 'type1' ? 'primary' : 'info'}>
                    {patient.diabetes_type.replace('_', ' ').toUpperCase()}
                  </Badge>
                </td>
                <td>
                  <span className={patient.current_hba1c > patient.hba1c_target ? 'text-danger' : 'text-success'}>
                    {patient.current_hba1c || 'N/A'}%
                  </span>
                </td>
                <td>{patient.hba1c_target}%</td>
                <td>{patient.average_glucose_last_30_days || 'N/A'} mg/dL</td>
                <td>
                  <div>
                    {patient.has_retinopathy && <Badge bg="warning" className="me-1">Retinopathy</Badge>}
                    {patient.has_nephropathy && <Badge bg="warning" className="me-1">Nephropathy</Badge>}
                    {patient.has_neuropathy && <Badge bg="warning" className="me-1">Neuropathy</Badge>}
                    {patient.has_cardiovascular_disease && <Badge bg="danger" className="me-1">CVD</Badge>}
                  </div>
                </td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handlePatientSelect(patient)}
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

  const renderPatientDetails = () => {
    const { selectedPatient, glucoseReadings, hba1cRecords } = diabetesData;
    
    if (!selectedPatient) {
      return <div className="text-center text-muted">Select a patient to view details</div>;
    }

    const glucoseTrendData = {
      labels: glucoseReadings.slice(-30).map(reading => 
        new Date(reading.reading_datetime).toLocaleDateString()
      ),
      datasets: [{
        label: 'Glucose Level (mg/dL)',
        data: glucoseReadings.slice(-30).map(reading => reading.glucose_value),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      }]
    };

    const hba1cTrendData = {
      labels: hba1cRecords.map(record => 
        new Date(record.test_date).toLocaleDateString()
      ),
      datasets: [{
        label: 'HbA1c (%)',
        data: hba1cRecords.map(record => record.hba1c_value),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1
      }]
    };

    return (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>{selectedPatient.patient_details?.user?.first_name} {selectedPatient.patient_details?.user?.last_name}</h4>
          <div>
            <Button variant="outline-primary" className="me-2" onClick={() => openModal('glucose', { diabetes_patient: selectedPatient.id })}>
              Add Glucose Reading
            </Button>
            <Button variant="outline-success" onClick={() => openModal('hba1c', { diabetes_patient: selectedPatient.id })}>
              Record HbA1c
            </Button>
          </div>
        </div>

        <Row className="mb-4">
          <Col md={3}>
            <Card>
              <Card.Body className="text-center">
                <h5 className="text-primary">{selectedPatient.current_hba1c || 'N/A'}%</h5>
                <small>Current HbA1c</small>
                <div className="mt-2">
                  <small>Target: {selectedPatient.hba1c_target}%</small>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Body className="text-center">
                <h5 className="text-info">{selectedPatient.time_in_range_percentage || 'N/A'}%</h5>
                <small>Time in Range (30d)</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Body className="text-center">
                <h5 className="text-warning">{selectedPatient.average_glucose_last_30_days || 'N/A'}</h5>
                <small>Avg Glucose (mg/dL)</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Body className="text-center">
                <h5 className="text-success">{selectedPatient.diabetes_duration_years || 'N/A'}</h5>
                <small>Years with Diabetes</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <Card>
              <Card.Header>
                <h6>Glucose Trend (Last 30 readings)</h6>
              </Card.Header>
              <Card.Body>
                <Line data={glucoseTrendData} />
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <Card.Header>
                <h6>HbA1c History</h6>
              </Card.Header>
              <Card.Body>
                <Line data={hba1cTrendData} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Card>
              <Card.Header>
                <h6>Recent Glucose Readings</h6>
              </Card.Header>
              <Card.Body>
                <Table size="sm">
                  <thead>
                    <tr>
                      <th>Date/Time</th>
                      <th>Value</th>
                      <th>Type</th>
                      <th>Notes</th>
                      <th>Flags</th>
                    </tr>
                  </thead>
                  <tbody>
                    {glucoseReadings.slice(0, 10).map(reading => (
                      <tr key={reading.id}>
                        <td>{new Date(reading.reading_datetime).toLocaleString()}</td>
                        <td className={reading.is_hypoglycemic ? 'text-danger' : reading.is_hyperglycemic ? 'text-warning' : ''}>
                          {reading.glucose_value} mg/dL
                        </td>
                        <td><Badge bg="secondary">{reading.reading_type.replace('_', ' ')}</Badge></td>
                        <td>{reading.notes}</td>
                        <td>
                          {reading.is_hypoglycemic && <Badge bg="danger">Low</Badge>}
                          {reading.is_hyperglycemic && <Badge bg="warning">High</Badge>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  const renderModal = () => {
    const modalConfig = {
      glucose: {
        title: 'Add Glucose Reading',
        fields: [
          { name: 'glucose_value', label: 'Glucose Value (mg/dL)', type: 'number', required: true },
          { name: 'reading_type', label: 'Reading Type', type: 'select', options: [
            { value: 'fasting', label: 'Fasting' },
            { value: 'pre_meal', label: 'Pre-meal' },
            { value: 'post_meal', label: 'Post-meal' },
            { value: 'bedtime', label: 'Bedtime' },
            { value: 'random', label: 'Random' }
          ]},
          { name: 'reading_datetime', label: 'Date/Time', type: 'datetime-local', required: true },
          { name: 'meal_carbs', label: 'Carbohydrates (g)', type: 'number' },
          { name: 'insulin_taken', label: 'Insulin Units', type: 'number' },
          { name: 'notes', label: 'Notes', type: 'textarea' }
        ]
      },
      hba1c: {
        title: 'Record HbA1c Test',
        fields: [
          { name: 'hba1c_value', label: 'HbA1c Value (%)', type: 'number', step: '0.1', required: true },
          { name: 'test_date', label: 'Test Date', type: 'date', required: true },
          { name: 'lab_name', label: 'Laboratory', type: 'text' },
          { name: 'notes', label: 'Notes', type: 'textarea' }
        ]
      }
    };

    const config = modalConfig[modalType];
    if (!config) return null;

    return (
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{config.title}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {config.fields.map(field => (
              <Form.Group className="mb-3" key={field.name}>
                <Form.Label>{field.label}</Form.Label>
                {field.type === 'select' ? (
                  <Form.Select
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                    required={field.required}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                ) : field.type === 'textarea' ? (
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                    required={field.required}
                  />
                ) : (
                  <Form.Control
                    type={field.type}
                    step={field.step}
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                    required={field.required}
                  />
                )}
              </Form.Group>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  };

  return (
    <Container fluid className="p-4">
      {alert.show && (
        <Alert 
          variant={alert.type} 
          onClose={() => setAlert({ show: false, message: '', type: 'info' })} 
          dismissible
        >
          {alert.message}
        </Alert>
      )}

      <h2 className="mb-4">Diabetes Management</h2>

      <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey="dashboard">Dashboard</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="patients">Patients</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="patient-details">Patient Details</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="analytics">Analytics</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="education">Education</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="dashboard">
            {renderDashboard()}
          </Tab.Pane>
          <Tab.Pane eventKey="patients">
            {renderPatientList()}
          </Tab.Pane>
          <Tab.Pane eventKey="patient-details">
            {renderPatientDetails()}
          </Tab.Pane>
          <Tab.Pane eventKey="analytics">
            <div className="text-center text-muted">
              <h4>Advanced Analytics</h4>
              <p>Comprehensive diabetes analytics and AI-powered insights coming soon...</p>
            </div>
          </Tab.Pane>
          <Tab.Pane eventKey="education">
            <div className="text-center text-muted">
              <h4>Patient Education</h4>
              <p>Diabetes education modules and resources coming soon...</p>
            </div>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      {renderModal()}
    </Container>
  );
};

export default DiabetesManagement;
