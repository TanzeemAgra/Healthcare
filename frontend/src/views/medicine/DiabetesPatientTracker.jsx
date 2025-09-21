import React, { useState, useEffect } from "react";
import apiClient from "../../services/api";
import { MEDICINE_ENDPOINTS } from "../../services/apiConstants";
import { Col, Row, Container, Card, Button, Modal, Form, Badge, Nav, Tab, Table, Alert, ProgressBar } from "react-bootstrap";

const DiabetesPatientTracker = () => {
  const [diabetesPatients, setDiabetesPatients] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});
  const [glucoseReadings, setGlucoseReadings] = useState([]);
  const [hba1cRecords, setHba1cRecords] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [riskPredictions, setRiskPredictions] = useState([]);
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formData, setFormData] = useState({});
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false);
  const [selectedPatientForAI, setSelectedPatientForAI] = useState(null);
  const [backendOnline, setBackendOnline] = useState(true);

  useEffect(() => {
    fetchDiabetesPatients();
    fetchDashboardStats();
    fetchGlucoseReadings();
    fetchHba1cRecords();
    fetchAIInsights();
    fetchRiskPredictions();
    fetchPersonalizedRecommendations();
  }, []);

  const fetchDiabetesPatients = async () => {
    try {
      const { data } = await apiClient.get(MEDICINE_ENDPOINTS.DIABETES.PATIENTS);
      if (data) {
        setDiabetesPatients(Array.isArray(data.results) ? data.results : Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch diabetes patients:', response.status);
        setDiabetesPatients([]);
      }
    } catch (error) {
      console.error('Error fetching diabetes patients:', error);
      setDiabetesPatients([]);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const { data } = await apiClient.get(MEDICINE_ENDPOINTS.DIABETES.DASHBOARD_STATS);
      if (data) {
        setDashboardStats(data || {});
      } else {
        console.error('Failed to fetch dashboard stats:', response.status);
        setDashboardStats({});
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setDashboardStats({});
    }
  };

  const fetchGlucoseReadings = async () => {
    try {
  const { data } = await apiClient.get(MEDICINE_ENDPOINTS.DIABETES.GLUCOSE_READINGS);
      if (data) {
        setGlucoseReadings(Array.isArray(data.results) ? data.results : Array.isArray(data) ? data : []);
      } else if (response.status === 404 || response.status === 500) {
        console.warn('API endpoint not available, using demo data');
        setBackendOnline(false);
        setGlucoseReadings([
          { id: 1, reading: 120, date: '2025-08-01', time: '08:00', patient_name: 'John Doe' },
          { id: 2, reading: 95, date: '2025-08-01', time: '14:00', patient_name: 'Jane Smith' },
          { id: 3, reading: 110, date: '2025-08-02', time: '09:00', patient_name: 'Bob Johnson' }
        ]);
      } else {
        console.error('Failed to fetch glucose readings:', response.status);
        setGlucoseReadings([]);
      }
    } catch (error) {
      console.warn('Error fetching glucose readings, using demo data:', error);
      setBackendOnline(false);
      setGlucoseReadings([
        { id: 1, reading: 120, date: '2025-08-01', time: '08:00', patient_name: 'John Doe' },
        { id: 2, reading: 95, date: '2025-08-01', time: '14:00', patient_name: 'Jane Smith' },
        { id: 3, reading: 110, date: '2025-08-02', time: '09:00', patient_name: 'Bob Johnson' }
      ]);
    }
  };

  const fetchHba1cRecords = async () => {
    try {
      const { data } = await apiClient.get(MEDICINE_ENDPOINTS.DIABETES.HBA1C_RECORDS);
      if (data) {
        setHba1cRecords(Array.isArray(data.results) ? data.results : Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch HbA1c records:', response.status);
        setHba1cRecords([]);
      }
    } catch (error) {
      console.error('Error fetching HbA1c records:', error);
      setHba1cRecords([]);
    }
  };

  // Fetch AI insights
  const fetchAIInsights = async () => {
    try {
      setAiAnalysisLoading(true);
      const { data } = await apiClient.get(MEDICINE_ENDPOINTS.DIABETES.AI_INSIGHTS);
      if (data) {
        setAiInsights(Array.isArray(data) ? data : []);
      } else {
        console.warn('AI insights API not available, using demo data');
        setBackendOnline(false);
        setAiInsights([
          { 
            id: 1, 
            patient_name: 'John Doe', 
            insight: 'High glucose variability detected. Consider CGM therapy.',
            risk_level: 'medium',
            confidence: 0.85
          },
          { 
            id: 2, 
            patient_name: 'Jane Smith', 
            insight: 'Excellent glucose control maintained. Continue current regimen.',
            risk_level: 'low',
            confidence: 0.95
          }
        ]);
      }
  } catch (error) {
      console.warn('Error fetching AI insights, using demo data:', error);
      setBackendOnline(false);
      setAiInsights([
        { 
          id: 1, 
          patient_name: 'Demo Patient', 
          insight: 'AI insights would appear here with backend connected.',
          risk_level: 'low',
          confidence: 0.90
        }
      ]);
    } finally {
      setAiAnalysisLoading(false);
    }
  };

  // Fetch risk predictions
  const fetchRiskPredictions = async () => {
    try {
      const { data } = await apiClient.get(MEDICINE_ENDPOINTS.DIABETES.RISK_PREDICTIONS);
      if (data) {
        setRiskPredictions(Array.isArray(data) ? data : []);
      } else {
        console.warn('Risk predictions API not available, using demo data');
        setBackendOnline(false);
        setRiskPredictions([
          { 
            id: 1, 
            patient_name: 'John Doe',
            complication: 'Diabetic Retinopathy',
            risk_percentage: 25,
            timeline: '6 months'
          },
          { 
            id: 2, 
            patient_name: 'Jane Smith',
            complication: 'Cardiovascular Disease',
            risk_percentage: 15,
            timeline: '12 months'
          }
        ]);
      }
    } catch (error) {
      console.warn('Error fetching risk predictions, using demo data:', error);
      setBackendOnline(false);
      setRiskPredictions([
        { 
          id: 1, 
          patient_name: 'Demo Patient',
          complication: 'Diabetic Complications',
          risk_percentage: 20,
          timeline: '12 months'
        }
      ]);
    }
  };

  // Fetch personalized recommendations
  const fetchPersonalizedRecommendations = async (patientId = null) => {
    try {
      const url = '/medicine/diabetes-patients/recommendations/';
      const { data } = await apiClient.get(url, { params: patientId ? { patient_id: patientId } : {} });
      if (data) {
        setPersonalizedRecommendations(Array.isArray(data) ? data : []);
      } else {
        console.warn('Recommendations API not available, using demo data');
        setBackendOnline(false);
        setPersonalizedRecommendations([
          {
            id: 1,
            patient_name: 'John Doe',
            recommendation: 'Increase physical activity to 150 minutes per week',
            priority: 'high',
            category: 'lifestyle'
          },
          {
            id: 2,
            patient_name: 'Jane Smith',
            recommendation: 'Monitor carbohydrate intake and timing',
            priority: 'medium',
            category: 'nutrition'
          }
        ]);
      }
    } catch (error) {
      console.warn('Error fetching recommendations, using demo data:', error);
      setBackendOnline(false);
      setPersonalizedRecommendations([
        {
          id: 1,
          patient_name: 'Demo Patient',
          recommendation: 'Personalized recommendations would appear with backend connected',
          priority: 'medium',
          category: 'general'
        }
      ]);
    }
  };

  // Generate AI analysis for specific patient
  const generateAIAnalysis = async (patientId) => {
    try {
      setAiAnalysisLoading(true);
      const { data } = await apiClient.post(MEDICINE_ENDPOINTS.DIABETES.AI_ANALYSIS(patientId));
  if (data) return data;
    } catch (error) {
      console.error('Error generating AI analysis:', error);
    } finally {
      setAiAnalysisLoading(false);
    }
    return null;
  };

  const handleModalOpen = (type, patient = null) => {
    setModalType(type);
    setSelectedPatient(patient);
    setFormData(patient || {});
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setModalType('');
    setSelectedPatient(null);
    setFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    handleModalClose();
  };

  const getGlucoseStatus = (value) => {
    if (value < 70) return { status: 'Low', variant: 'danger' };
    if (value <= 140) return { status: 'Normal', variant: 'success' };
    if (value <= 200) return { status: 'High', variant: 'warning' };
    return { status: 'Very High', variant: 'danger' };
  };

  const getHba1cStatus = (value) => {
    if (value < 7) return { status: 'Target', variant: 'success' };
    if (value <= 8) return { status: 'Above Target', variant: 'warning' };
    return { status: 'Poor Control', variant: 'danger' };
  };

  return (
    <Container fluid className="py-4">
      {!backendOnline && (
        <Alert variant="warning" className="mb-4">
          <div className="d-flex align-items-center">
            <i className="ri-wifi-off-line me-2"></i>
            <div>
              <strong>Demo Mode Active</strong> - Backend server is not running. 
              Using simulated diabetes tracking data for demonstration purposes.
            </div>
          </div>
        </Alert>
      )}
      
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Diabetes Patient Tracker</h2>
              <p className="text-muted mb-0">Comprehensive diabetes management and monitoring system</p>
            </div>
            <Button variant="primary" onClick={() => handleModalOpen('patient')}>
              <i className="ri-add-line me-2"></i>
              Add Patient
            </Button>
          </div>
        </Col>
      </Row>

      {/* Dashboard Stats */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <Card className="bg-primary text-white border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="mb-1">{dashboardStats.total_diabetes_patients || 0}</h3>
                  <p className="mb-0">Total Patients</p>
                </div>
                <i className="ri-user-line fs-1 opacity-50"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="bg-success text-white border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="mb-1">{dashboardStats.patients_at_hba1c_target || 0}</h3>
                  <p className="mb-0">At HbA1c Target</p>
                </div>
                <i className="ri-check-line fs-1 opacity-50"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="bg-warning text-white border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="mb-1">{dashboardStats.high_risk_patients || 0}</h3>
                  <p className="mb-0">High Risk</p>
                </div>
                <i className="ri-alert-line fs-1 opacity-50"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="bg-info text-white border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="mb-1">{((dashboardStats.medication_adherence_rate || 0)).toFixed(0)}%</h3>
                  <p className="mb-0">Medication Adherence</p>
                </div>
                <i className="ri-medicine-bottle-line fs-1 opacity-50"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Content Tabs */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-bottom">
          <Tab.Container defaultActiveKey="patients">
            <Nav variant="tabs" className="border-0">
              <Nav.Item>
                <Nav.Link eventKey="patients" className="text-decoration-none">
                  <i className="ri-user-heart-line me-2"></i>
                  Patients
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="glucose" className="text-decoration-none">
                  <i className="ri-pulse-line me-2"></i>
                  Glucose Monitoring
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="hba1c" className="text-decoration-none">
                  <i className="ri-bar-chart-line me-2"></i>
                  HbA1c Records
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="ai-insights" className="text-decoration-none">
                  <i className="ri-brain-line me-2"></i>
                  AI Insights
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="risk-prediction" className="text-decoration-none">
                  <i className="ri-shield-check-line me-2"></i>
                  Risk Prediction
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="recommendations" className="text-decoration-none">
                  <i className="ri-lightbulb-line me-2"></i>
                  AI Recommendations
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="analytics" className="text-decoration-none">
                  <i className="ri-line-chart-line me-2"></i>
                  Analytics
                </Nav.Link>
              </Nav.Item>
            </Nav>
            
            <Tab.Content className="p-0">
              {/* Patients Tab */}
              <Tab.Pane eventKey="patients">
                <Card.Body>
                  <div className="table-responsive">
                    <Table hover>
                      <thead>
                        <tr>
                          <th>Patient ID</th>
                          <th>Name</th>
                          <th>Diabetes Type</th>
                          <th>Current HbA1c</th>
                          <th>Target HbA1c</th>
                          <th>Last Visit</th>
                          <th>Risk Level</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(Array.isArray(diabetesPatients) ? diabetesPatients : []).map((patient) => (
                          <tr key={patient.id}>
                            <td><code>{patient.patient?.patient_id}</code></td>
                            <td>
                              <strong>{patient.patient?.user?.first_name} {patient.patient?.user?.last_name}</strong>
                              <br />
                              <small className="text-muted">{patient.patient?.user?.email}</small>
                            </td>
                            <td>
                              <Badge bg="info">{patient.diabetes_type_display}</Badge>
                            </td>
                            <td>
                              {patient.current_hba1c ? (
                                <span className={`text-${getHba1cStatus(patient.current_hba1c).variant}`}>
                                  {patient.current_hba1c}%
                                </span>
                              ) : (
                                <span className="text-muted">Not recorded</span>
                              )}
                            </td>
                            <td>{patient.hba1c_target}%</td>
                            <td>
                              <small className="text-muted">
                                {patient.created_at ? new Date(patient.created_at).toLocaleDateString() : 'N/A'}
                              </small>
                            </td>
                            <td>
                              <Badge bg="success">Low Risk</Badge>
                            </td>
                            <td>
                              <Button 
                                variant="outline-primary" 
                                size="sm" 
                                className="me-2"
                                onClick={() => handleModalOpen('view-patient', patient)}
                              >
                                <i className="ri-eye-line"></i>
                              </Button>
                              <Button 
                                variant="outline-secondary" 
                                size="sm"
                                className="me-2"
                                onClick={() => handleModalOpen('edit-patient', patient)}
                              >
                                <i className="ri-edit-line"></i>
                              </Button>
                              <Button 
                                variant="outline-info" 
                                size="sm"
                                onClick={() => generateAIAnalysis(patient.id)}
                                disabled={aiAnalysisLoading}
                                title="AI Analysis"
                              >
                                <i className="ri-brain-line"></i>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    {diabetesPatients.length === 0 && (
                      <div className="text-center py-4">
                        <p className="text-muted">No diabetes patients found. <Button variant="link" onClick={() => handleModalOpen('patient')}>Add the first patient</Button></p>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Tab.Pane>

              {/* Glucose Monitoring Tab */}
              <Tab.Pane eventKey="glucose">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h5>Blood Glucose Readings</h5>
                      <p className="text-muted mb-0">Monitor and track patient glucose levels</p>
                    </div>
                    <Button variant="success" onClick={() => handleModalOpen('glucose-reading')}>
                      <i className="ri-add-line me-2"></i>
                      Add Reading
                    </Button>
                  </div>
                  
                  <div className="table-responsive">
                    <Table hover>
                      <thead>
                        <tr>
                          <th>Patient</th>
                          <th>Reading (mg/dL)</th>
                          <th>Reading Type</th>
                          <th>Status</th>
                          <th>Date/Time</th>
                          <th>Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(Array.isArray(glucoseReadings) ? glucoseReadings : []).map((reading) => {
                          const status = getGlucoseStatus(reading.glucose_value);
                          return (
                            <tr key={reading.id}>
                              <td>
                                <strong>{reading.diabetes_patient?.patient?.user?.first_name} {reading.diabetes_patient?.patient?.user?.last_name}</strong>
                              </td>
                              <td>
                                <strong className={`text-${status.variant}`}>
                                  {reading.glucose_value}
                                </strong>
                              </td>
                              <td>
                                <Badge bg="secondary">{reading.reading_type_display}</Badge>
                              </td>
                              <td>
                                <Badge bg={status.variant}>{status.status}</Badge>
                              </td>
                              <td>
                                <small>{reading.reading_datetime ? new Date(reading.reading_datetime).toLocaleString() : 'N/A'}</small>
                              </td>
                              <td>
                                <small className="text-muted">{reading.notes || 'No notes'}</small>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                    {glucoseReadings.length === 0 && (
                      <div className="text-center py-4">
                        <p className="text-muted">No glucose readings found. <Button variant="link" onClick={() => handleModalOpen('glucose-reading')}>Add the first reading</Button></p>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Tab.Pane>

              {/* HbA1c Records Tab */}
              <Tab.Pane eventKey="hba1c">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h5>HbA1c Records</h5>
                      <p className="text-muted mb-0">Long-term glucose control monitoring</p>
                    </div>
                    <Button variant="info" onClick={() => handleModalOpen('hba1c-record')}>
                      <i className="ri-add-line me-2"></i>
                      Add Record
                    </Button>
                  </div>
                  
                  <div className="table-responsive">
                    <Table hover>
                      <thead>
                        <tr>
                          <th>Patient</th>
                          <th>HbA1c Value (%)</th>
                          <th>Status</th>
                          <th>Test Date</th>
                          <th>Laboratory</th>
                          <th>Change from Previous</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(Array.isArray(hba1cRecords) ? hba1cRecords : []).map((record) => {
                          const status = getHba1cStatus(record.hba1c_value);
                          return (
                            <tr key={record.id}>
                              <td>
                                <strong>{record.diabetes_patient?.patient?.user?.first_name} {record.diabetes_patient?.patient?.user?.last_name}</strong>
                              </td>
                              <td>
                                <strong className={`text-${status.variant}`}>
                                  {record.hba1c_value}%
                                </strong>
                              </td>
                              <td>
                                <Badge bg={status.variant}>{status.status}</Badge>
                              </td>
                              <td>
                                <small>{record.test_date ? new Date(record.test_date).toLocaleDateString() : 'N/A'}</small>
                              </td>
                              <td>
                                <small className="text-muted">{record.laboratory || 'Not specified'}</small>
                              </td>
                              <td>
                                <small className="text-muted">
                                  {record.previous_value ? 
                                    `${record.hba1c_value - record.previous_value > 0 ? '+' : ''}${(record.hba1c_value - record.previous_value).toFixed(1)}%` 
                                    : 'First record'
                                  }
                                </small>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                    {hba1cRecords.length === 0 && (
                      <div className="text-center py-4">
                        <p className="text-muted">No HbA1c records found. <Button variant="link" onClick={() => handleModalOpen('hba1c-record')}>Add the first record</Button></p>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Tab.Pane>

              {/* Analytics Tab */}
              <Tab.Pane eventKey="analytics">
                <Card.Body>
                  <Row>
                    <Col lg={6} className="mb-4">
                      <Card className="border-0 shadow-sm">
                        <Card.Header>
                          <h6 className="mb-0">Diabetes Type Distribution</h6>
                        </Card.Header>
                        <Card.Body>
                          {dashboardStats.patients_by_type && Object.keys(dashboardStats.patients_by_type).length > 0 ? (
                            Object.entries(dashboardStats.patients_by_type).map(([type, count]) => (
                              <div key={type} className="d-flex justify-content-between align-items-center mb-2">
                                <span className="text-capitalize">{type.replace('_', ' ')}</span>
                                <Badge bg="primary">{count}</Badge>
                              </div>
                            ))
                          ) : (
                            <p className="text-muted text-center">No data available</p>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col lg={6} className="mb-4">
                      <Card className="border-0 shadow-sm">
                        <Card.Header>
                          <h6 className="mb-0">Risk Assessment</h6>
                        </Card.Header>
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span>High Risk Patients</span>
                            <Badge bg="danger">{dashboardStats.high_risk_patients || 0}</Badge>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span>Medium Risk Patients</span>
                            <Badge bg="warning">{dashboardStats.medium_risk_patients || 0}</Badge>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span>Low Risk Patients</span>
                            <Badge bg="success">{dashboardStats.low_risk_patients || 0}</Badge>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Tab.Pane>

              {/* AI Insights Tab */}
              <Tab.Pane eventKey="ai-insights">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0">
                      <i className="ri-brain-line me-2 text-primary"></i>
                      AI-Powered Insights
                    </h5>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={fetchAIInsights}
                      disabled={aiAnalysisLoading}
                    >
                      {aiAnalysisLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <i className="ri-refresh-line me-1"></i>
                          Refresh Insights
                        </>
                      )}
                    </Button>
                  </div>

                  <Row>
                    {Array.isArray(aiInsights) && aiInsights.length > 0 ? (
                      aiInsights.map((insight, index) => (
                        <Col md={6} key={index}>
                          <Card className="border-0 shadow-sm mb-3">
                            <Card.Body>
                              <div className="d-flex align-items-start">
                                <div className={`badge ${
                                  insight.severity === 'high' ? 'bg-danger' :
                                  insight.severity === 'medium' ? 'bg-warning' : 'bg-info'
                                } me-3 mt-1`}>
                                  {insight.severity?.toUpperCase()}
                                </div>
                                <div className="flex-grow-1">
                                  <h6 className="mb-2">{insight.title || 'AI Insight'}</h6>
                                  <p className="text-muted mb-2 small">{insight.description}</p>
                                  <div className="d-flex justify-content-between align-items-center">
                                    <small className="text-muted">
                                      Confidence: {insight.confidence || 85}%
                                    </small>
                                    <small className="text-muted">
                                      {insight.generated_at ? new Date(insight.generated_at).toLocaleDateString() : 'Recent'}
                                    </small>
                                  </div>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))
                    ) : (
                      <Col>
                        <div className="text-center py-5">
                          <i className="ri-brain-line display-4 text-muted mb-3"></i>
                          <h5 className="text-muted">No AI insights available</h5>
                          <p className="text-muted">Click "Refresh Insights" to generate AI-powered analysis</p>
                        </div>
                      </Col>
                    )}
                  </Row>
                </Card.Body>
              </Tab.Pane>

              {/* Risk Prediction Tab */}
              <Tab.Pane eventKey="risk-prediction">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0">
                      <i className="ri-shield-check-line me-2 text-warning"></i>
                      Risk Prediction & Analytics
                    </h5>
                    <Button 
                      variant="warning" 
                      size="sm"
                      onClick={fetchRiskPredictions}
                    >
                      <i className="ri-refresh-line me-1"></i>
                      Update Predictions
                    </Button>
                  </div>

                  <Row>
                    <Col lg={4}>
                      <Card className="border-0 bg-gradient-danger text-white mb-3">
                        <Card.Body className="text-center">
                          <i className="ri-alarm-warning-line display-4 mb-3"></i>
                          <h4>High Risk</h4>
                          <h2>{Array.isArray(riskPredictions) ? riskPredictions.filter(p => p.risk_level === 'high').length : 0}</h2>
                          <small>Patients require immediate attention</small>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col lg={4}>
                      <Card className="border-0 bg-gradient-warning text-white mb-3">
                        <Card.Body className="text-center">
                          <i className="ri-error-warning-line display-4 mb-3"></i>
                          <h4>Medium Risk</h4>
                          <h2>{Array.isArray(riskPredictions) ? riskPredictions.filter(p => p.risk_level === 'medium').length : 0}</h2>
                          <small>Monitor closely</small>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col lg={4}>
                      <Card className="border-0 bg-gradient-success text-white mb-3">
                        <Card.Body className="text-center">
                          <i className="ri-shield-check-line display-4 mb-3"></i>
                          <h4>Low Risk</h4>
                          <h2>{Array.isArray(riskPredictions) ? riskPredictions.filter(p => p.risk_level === 'low').length : 0}</h2>
                          <small>Stable condition</small>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  <Row>
                    {Array.isArray(riskPredictions) && riskPredictions.length > 0 ? (
                      riskPredictions.map((prediction, index) => (
                        <Col lg={6} key={index}>
                          <Card className="border-0 shadow-sm mb-3">
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                  <h6 className="mb-1">{prediction.patient_name || `Patient ${prediction.patient_id}`}</h6>
                                  <small className="text-muted">ID: {prediction.patient_id}</small>
                                </div>
                                <span className={`badge ${
                                  prediction.risk_level === 'high' ? 'bg-danger' :
                                  prediction.risk_level === 'medium' ? 'bg-warning' : 'bg-success'
                                }`}>
                                  {prediction.risk_level?.toUpperCase()} RISK
                                </span>
                              </div>
                              
                              <div className="mb-3">
                                <div className="d-flex justify-content-between mb-1">
                                  <small>Risk Score</small>
                                  <small>{prediction.risk_score || 75}/100</small>
                                </div>
                                <div className="progress" style={{height: '6px'}}>
                                  <div 
                                    className={`progress-bar ${
                                      prediction.risk_level === 'high' ? 'bg-danger' :
                                      prediction.risk_level === 'medium' ? 'bg-warning' : 'bg-success'
                                    }`}
                                    style={{width: `${prediction.risk_score || 75}%`}}
                                  ></div>
                                </div>
                              </div>

                              <div className="mb-2">
                                <strong>Key Factors:</strong>
                                <ul className="list-unstyled ms-3 mb-0">
                                  {(prediction.risk_factors || ['High glucose variability', 'Poor medication adherence']).map((factor, i) => (
                                    <li key={i} className="small text-muted">• {factor}</li>
                                  ))}
                                </ul>
                              </div>

                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => generateAIAnalysis(prediction.patient_id)}
                                disabled={aiAnalysisLoading}
                              >
                                <i className="ri-search-line me-1"></i>
                                Detailed Analysis
                              </Button>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))
                    ) : (
                      <Col>
                        <div className="text-center py-5">
                          <i className="ri-shield-check-line display-4 text-muted mb-3"></i>
                          <h5 className="text-muted">No risk predictions available</h5>
                          <p className="text-muted">AI-powered risk analysis will appear here</p>
                        </div>
                      </Col>
                    )}
                  </Row>
                </Card.Body>
              </Tab.Pane>

              {/* AI Recommendations Tab */}
              <Tab.Pane eventKey="recommendations">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0">
                      <i className="ri-lightbulb-line me-2 text-success"></i>
                      Personalized AI Recommendations
                    </h5>
                    <div>
                      <Form.Select 
                        size="sm" 
                        className="me-2" 
                        style={{width: 'auto', display: 'inline-block'}}
                        onChange={(e) => {
                          setSelectedPatientForAI(e.target.value);
                          fetchPersonalizedRecommendations(e.target.value || null);
                        }}
                      >
                        <option value="">All Patients</option>
                        {Array.isArray(diabetesPatients) && diabetesPatients.map(patient => (
                          <option key={patient.id} value={patient.id}>
                            {patient.patient_name || patient.first_name + ' ' + patient.last_name}
                          </option>
                        ))}
                      </Form.Select>
                      <Button 
                        variant="success" 
                        size="sm"
                        onClick={() => fetchPersonalizedRecommendations(selectedPatientForAI)}
                      >
                        <i className="ri-refresh-line me-1"></i>
                        Refresh
                      </Button>
                    </div>
                  </div>

                  <Row>
                    {Array.isArray(personalizedRecommendations) && personalizedRecommendations.length > 0 ? (
                      personalizedRecommendations.map((recommendation, index) => (
                        <Col lg={6} key={index}>
                          <Card className="border-0 shadow-sm mb-3">
                            <Card.Body>
                              <div className="d-flex align-items-start mb-3">
                                <div className={`badge ${
                                  recommendation.category === 'medication' ? 'bg-primary' :
                                  recommendation.category === 'lifestyle' ? 'bg-success' :
                                  recommendation.category === 'monitoring' ? 'bg-info' : 'bg-secondary'
                                } me-3 mt-1`}>
                                  {recommendation.category?.toUpperCase() || 'GENERAL'}
                                </div>
                                <div className="flex-grow-1">
                                  <h6 className="mb-2">{recommendation.title || 'AI Recommendation'}</h6>
                                  <p className="text-muted mb-3 small">{recommendation.description}</p>
                                  
                                  <div className="d-flex justify-content-between align-items-center mb-2">
                                    <small className="text-muted">
                                      Priority: 
                                      <span className={`ms-1 badge ${
                                        recommendation.priority === 'high' ? 'bg-danger' :
                                        recommendation.priority === 'medium' ? 'bg-warning' : 'bg-info'
                                      }`}>
                                        {recommendation.priority?.toUpperCase() || 'MEDIUM'}
                                      </span>
                                    </small>
                                    <small className="text-muted">
                                      Expected Impact: {recommendation.expected_impact || '+15%'}
                                    </small>
                                  </div>

                                  {recommendation.action_items && (
                                    <div className="mb-2">
                                      <strong className="small">Action Items:</strong>
                                      <ul className="list-unstyled ms-3 mb-0">
                                        {recommendation.action_items.map((item, i) => (
                                          <li key={i} className="small text-muted">• {item}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  <div className="d-flex justify-content-between align-items-center">
                                    <Button variant="outline-success" size="sm">
                                      <i className="ri-check-line me-1"></i>
                                      Implement
                                    </Button>
                                    <small className="text-muted">
                                      {recommendation.generated_at ? new Date(recommendation.generated_at).toLocaleDateString() : 'Recent'}
                                    </small>
                                  </div>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))
                    ) : (
                      <Col>
                        <div className="text-center py-5">
                          <i className="ri-lightbulb-line display-4 text-muted mb-3"></i>
                          <h5 className="text-muted">No recommendations available</h5>
                          <p className="text-muted">
                            {selectedPatientForAI ? 
                              'No specific recommendations for selected patient' : 
                              'Select a patient or refresh to see AI-powered recommendations'
                            }
                          </p>
                        </div>
                      </Col>
                    )}
                  </Row>
                </Card.Body>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Card.Header>
      </Card>

      {/* Modal for forms */}
      <Modal show={showModal} onHide={handleModalClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === 'patient' && 'Add New Diabetes Patient'}
            {modalType === 'edit-patient' && 'Edit Patient'}
            {modalType === 'view-patient' && 'Patient Details'}
            {modalType === 'glucose-reading' && 'Add Glucose Reading'}
            {modalType === 'hba1c-record' && 'Add HbA1c Record'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {modalType === 'patient' && (
              <>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Patient ID</Form.Label>
                      <Form.Control
                        type="text"
                        name="patient_id"
                        value={formData.patient_id || ''}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Diabetes Type</Form.Label>
                      <Form.Select
                        name="diabetes_type"
                        value={formData.diabetes_type || ''}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="type1">Type 1 Diabetes</option>
                        <option value="type2">Type 2 Diabetes</option>
                        <option value="gestational">Gestational Diabetes</option>
                        <option value="prediabetes">Pre-diabetes</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>HbA1c Target (%)</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.1"
                        name="hba1c_target"
                        value={formData.hba1c_target || '7.0'}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Diagnosis Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="diagnosis_date"
                        value={formData.diagnosis_date || ''}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </>
            )}
            
            {modalType === 'glucose-reading' && (
              <>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Glucose Value (mg/dL)</Form.Label>
                      <Form.Control
                        type="number"
                        name="glucose_value"
                        value={formData.glucose_value || ''}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Reading Type</Form.Label>
                      <Form.Select
                        name="reading_type"
                        value={formData.reading_type || ''}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="fasting">Fasting</option>
                        <option value="post_meal">Post-meal</option>
                        <option value="random">Random</option>
                        <option value="bedtime">Bedtime</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="notes"
                    value={formData.notes || ''}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </>
            )}

            {modalType === 'hba1c-record' && (
              <>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>HbA1c Value (%)</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.1"
                        name="hba1c_value"
                        value={formData.hba1c_value || ''}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Test Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="test_date"
                        value={formData.test_date || ''}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Laboratory</Form.Label>
                  <Form.Control
                    type="text"
                    name="laboratory"
                    value={formData.laboratory || ''}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {modalType.includes('edit') ? 'Update' : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DiabetesPatientTracker;
