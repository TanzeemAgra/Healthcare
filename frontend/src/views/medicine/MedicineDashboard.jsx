import React, { useState, useEffect } from "react";
import apiClient from "../../services/api";
import { MEDICINE_ENDPOINTS } from "../../services/apiConstants";
import { Col, Row, Container, Card, Badge, Button, Nav, Tab, Modal, Form, Alert, ProgressBar, Table } from "react-bootstrap";
import { Line, Doughnut, Bar, Scatter, Radar } from "react-chartjs-2";
import ChartErrorBoundary from "../../components/ChartErrorBoundary";
import { safeRound, safePercentage, generateSafeChartData, chartColors } from "../../utils/chartUtils";
import MedicineAdvancedFeatures from "./MedicineAdvancedFeatures";
import DiabetesManagement from "./DiabetesManagement";
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
  RadialLinearScale,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  RadialLinearScale,
);

const MedicineDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    total_patients: 0,
    total_doctors: 0,
    total_appointments_today: 0,
    total_emergency_cases_today: 0,
    pending_lab_tests: 0,
    active_treatment_plans: 0,
    appointments_by_type: {},
    emergency_triage_distribution: {},
    recent_patients: [],
    upcoming_appointments: []
  });

  const [generalMedicineStats, setGeneralMedicineStats] = useState({
    total_general_doctors: 0,
    general_appointments_this_month: 0,
    average_patients_per_doctor: 0,
    top_diagnoses: [],
    consultation_types: {}
  });

  const [emergencyMedicineStats, setEmergencyMedicineStats] = useState({
    total_emergency_doctors: 0,
    emergency_cases_this_month: 0,
    trauma_cases: 0,
    critical_cases: 0,
    triage_distribution: {},
    disposition_stats: {},
    average_time_to_provider_minutes: 0,
    average_total_ed_time_hours: 0
  });

  // AI-based feature states
  const [aiFeatures, setAiFeatures] = useState({
    riskPredictions: [],
    drugInteractions: [],
    clinicalInsights: [],
    treatmentRecommendations: [],
    patientRiskAnalysis: {},
    medicationOptimization: [],
    diagnosticSuggestions: [],
    outbreakPredictions: []
  });

  const [showAiModal, setShowAiModal] = useState(false);
  const [selectedAiFeature, setSelectedAiFeature] = useState('');
  const [aiAnalysisInput, setAiAnalysisInput] = useState({
    patientId: '',
    symptoms: '',
    medicalHistory: '',
    currentMedications: ''
  });
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [backendOnline, setBackendOnline] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchGeneralMedicineStats();
    fetchEmergencyMedicineStats();
    initializeAiFeatures();
  }, []);

  // AI Feature Functions
  const initializeAiFeatures = async () => {
    try {
      // Mock AI data - in real implementation, these would be API calls to AI services
      setAiFeatures({
        riskPredictions: [
          { patientId: 'P001', riskLevel: 'High', condition: 'Cardiovascular Disease', probability: 0.87, factors: ['Hypertension', 'Diabetes', 'Age'] },
          { patientId: 'P002', riskLevel: 'Medium', condition: 'Diabetes Complication', probability: 0.64, factors: ['HbA1c levels', 'BMI'] },
          { patientId: 'P003', riskLevel: 'Low', condition: 'Kidney Disease', probability: 0.23, factors: ['Blood pressure'] }
        ],
        drugInteractions: [
          { medication1: 'Warfarin', medication2: 'Aspirin', severity: 'High', effect: 'Increased bleeding risk' },
          { medication1: 'Metformin', medication2: 'Iodinated contrast', severity: 'Medium', effect: 'Lactic acidosis risk' }
        ],
        clinicalInsights: [
          { insight: 'Unusual pattern detected in emergency admissions', confidence: 0.92, recommendation: 'Investigate potential outbreak' },
          { insight: 'Medication adherence below average in diabetes patients', confidence: 0.78, recommendation: 'Implement reminder system' }
        ],
        treatmentRecommendations: [
          { patientId: 'P001', condition: 'Hypertension', recommendation: 'ACE inhibitor + lifestyle modifications', confidence: 0.89 },
          { patientId: 'P002', condition: 'Type 2 Diabetes', recommendation: 'Metformin + dietary counseling', confidence: 0.94 }
        ],
        patientRiskAnalysis: {
          totalPatients: 1247,
          highRisk: 89,
          mediumRisk: 234,
          lowRisk: 924,
          trends: {
            cardiovascular: 12,
            diabetes: 8,
            respiratory: 5
          }
        },
        diagnosticSuggestions: [
          { symptoms: ['chest pain', 'shortness of breath'], suggestions: ['ECG', 'Troponin', 'Chest X-ray'], confidence: 0.91 },
          { symptoms: ['fever', 'cough', 'fatigue'], suggestions: ['CBC', 'Blood culture', 'PCR test'], confidence: 0.86 }
        ]
      });
    } catch (error) {
      console.error('Error initializing AI features:', error);
    }
  };

  const handleAiAnalysis = async (feature, inputData) => {
    setAiLoading(true);
    try {
      // Mock AI analysis - replace with actual AI service calls
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      let result = {};
      
      switch (feature) {
        case 'risk-prediction':
          result = {
            patientId: inputData.patientId,
            riskScore: Math.random() * 100,
            riskLevel: Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Low',
            predictions: [
              { condition: 'Cardiovascular Disease', probability: Math.random() },
              { condition: 'Diabetes', probability: Math.random() },
              { condition: 'Hypertension', probability: Math.random() }
            ],
            recommendations: [
              'Regular cardiovascular monitoring',
              'Lifestyle modifications',
              'Medication adherence review'
            ]
          };
          break;
        case 'drug-interaction':
          result = {
            medications: (inputData.currentMedications || '').split(',').filter(med => med.trim()),
            interactions: [
              { severity: 'High', description: 'Potential bleeding risk with current combination' },
              { severity: 'Medium', description: 'Monitor liver function' }
            ],
            alternatives: ['Consider alternative medication X', 'Adjust dosage for medication Y']
          };
          break;
        case 'diagnostic-support':
          result = {
            symptoms: (inputData.symptoms || '').split(',').filter(symptom => symptom.trim()),
            differentialDiagnosis: [
              { condition: 'Acute Myocardial Infarction', probability: 0.78 },
              { condition: 'Unstable Angina', probability: 0.65 },
              { condition: 'Pulmonary Embolism', probability: 0.34 }
            ],
            recommendedTests: ['ECG', 'Troponin levels', 'D-dimer', 'Chest CT'],
            urgency: 'High'
          };
          break;
        default:
          result = { message: 'Analysis complete', confidence: 0.85 };
      }
      
      setAiAnalysisResult(result);
    } catch (error) {
      console.error('AI Analysis error:', error);
      setAiAnalysisResult({ error: 'Analysis failed. Please try again.' });
    } finally {
      setAiLoading(false);
    }
  };

  const openAiModal = (feature) => {
    setSelectedAiFeature(feature);
    setShowAiModal(true);
    setAiAnalysisResult(null);
  };

  const fetchDashboardData = async () => {
    try {
      const response = await apiClient.get(MEDICINE_ENDPOINTS.DASHBOARD.STATS);
      if (response.status >= 200 && response.status < 300) {
        const data = response.data;
        setDashboardData(data);
      } else if (response.status === 401 || response.status === 404 || response.status === 500) {
        console.warn('Dashboard API not available, using demo data');
        setBackendOnline(false);
        setDashboardData({
          total_patients: 1247,
          total_doctors: 48,
          total_appointments_today: 32,
          total_emergency_cases_today: 8,
          pending_lab_tests: 15,
          active_treatment_plans: 156,
          appointments_by_type: {
            'General Medicine': 45,
            'Emergency': 18,
            'Specialist': 23
          },
          emergency_triage_distribution: {
            'Level 1': 2,
            'Level 2': 5,
            'Level 3': 12
          },
          recent_patients: [
            { id: 1, name: 'John Doe', department: 'General Medicine' },
            { id: 2, name: 'Jane Smith', department: 'Emergency' }
          ],
          upcoming_appointments: [
            { id: 1, patient: 'Alice Brown', time: '09:00', doctor: 'Dr. Johnson' }
          ]
        });
      }
    } catch (error) {
      console.warn('Error fetching dashboard data, using demo data:', error);
      setBackendOnline(false);
      setDashboardData({
        total_patients: 1247,
        total_doctors: 48,
        total_appointments_today: 32,
        total_emergency_cases_today: 8,
        pending_lab_tests: 15,
        active_treatment_plans: 156,
        appointments_by_type: { 'Demo Data': 100 },
        emergency_triage_distribution: { 'Demo': 10 },
        recent_patients: [],
        upcoming_appointments: []
      });
    }
  };

  const fetchGeneralMedicineStats = async () => {
    try {
      const response = await apiClient.get(MEDICINE_ENDPOINTS.DASHBOARD.GENERAL_MEDICINE_STATS);
      if (response.status >= 200 && response.status < 300) {
        const data = response.data;
        setGeneralMedicineStats(data);
      } else if (response.status === 401 || response.status === 404 || response.status === 500) {
        console.warn('General medicine stats API not available, using demo data');
        setBackendOnline(false);
        setGeneralMedicineStats({
          total_general_doctors: 25,
          general_appointments_this_month: 342,
          average_patients_per_doctor: 15.8,
          top_diagnoses: [
            ['Hypertension', 45],
            ['Diabetes', 38],
            ['Common Cold', 29]
          ],
          consultation_types: {
            'Regular Checkup': 40,
            'Follow-up': 35,
            'New Patient': 25
          }
        });
      }
    } catch (error) {
      console.warn('Error fetching general medicine stats, using demo data:', error);
      setBackendOnline(false);
      setGeneralMedicineStats({
        total_general_doctors: 25,
        general_appointments_this_month: 342,
        average_patients_per_doctor: 15.8,
        top_diagnoses: [],
        consultation_types: {}
      });
    }
  };

  const fetchEmergencyMedicineStats = async () => {
    try {
      const response = await apiClient.get(MEDICINE_ENDPOINTS.DASHBOARD.EMERGENCY_MEDICINE_STATS);
      if (response.status >= 200 && response.status < 300) {
        const data = response.data;
        setEmergencyMedicineStats(data);
      } else if (response.status === 401 || response.status === 404 || response.status === 500) {
        console.warn('Emergency medicine stats API not available, using demo data');
        setBackendOnline(false);
        setEmergencyMedicineStats({
          total_emergency_doctors: 12,
          emergency_cases_this_month: 156,
          trauma_cases: 23,
          critical_cases: 8,
          triage_distribution: {
            'Level 1 (Critical)': 8,
            'Level 2 (Urgent)': 15,
            'Level 3 (Less Urgent)': 28
          },
          disposition_stats: {
            'Discharged': 45,
            'Admitted': 18,
            'Transferred': 5
          },
          average_time_to_provider_minutes: 15.5,
          average_total_ed_time_hours: 3.2
        });
      }
    } catch (error) {
      console.warn('Error fetching emergency medicine stats, using demo data:', error);
      setBackendOnline(false);
      setEmergencyMedicineStats({
        total_emergency_doctors: 12,
        emergency_cases_this_month: 156,
        trauma_cases: 23,
        critical_cases: 8,
        triage_distribution: {},
        disposition_stats: {},
        average_time_to_provider_minutes: 15.5,
        average_total_ed_time_hours: 3.2
      });
    }
  };

  const appointmentTypeChartData = {
    labels: Object.keys(dashboardData.appointments_by_type || {}),
    datasets: [
      {
        label: 'Appointments',
        data: Object.values(dashboardData.appointments_by_type || {}),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
      },
    ],
  };

  const triageChartData = {
    labels: ['Level 1 (Critical)', 'Level 2 (Emergent)', 'Level 3 (Urgent)', 'Level 4 (Less Urgent)', 'Level 5 (Non-urgent)'],
    datasets: [
      {
        label: 'Emergency Cases',
        data: [
          (emergencyMedicineStats.triage_distribution && emergencyMedicineStats.triage_distribution['1']) || 0,
          (emergencyMedicineStats.triage_distribution && emergencyMedicineStats.triage_distribution['2']) || 0,
          (emergencyMedicineStats.triage_distribution && emergencyMedicineStats.triage_distribution['3']) || 0,
          (emergencyMedicineStats.triage_distribution && emergencyMedicineStats.triage_distribution['4']) || 0,
          (emergencyMedicineStats.triage_distribution && emergencyMedicineStats.triage_distribution['5']) || 0,
        ],
        backgroundColor: ['#DC3545', '#FD7E14', '#FFC107', '#28A745', '#17A2B8'],
      },
    ],
  };

  const generalMedicineChartData = {
    labels: Object.keys(generalMedicineStats.consultation_types || {}),
    datasets: [
      {
        label: 'Consultations',
        data: Object.values(generalMedicineStats.consultation_types || {}),
        backgroundColor: '#36A2EB',
        borderColor: '#2E8BC0',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Container fluid>
      {!backendOnline && (
        <Alert variant="warning" className="mb-4">
          <div className="d-flex align-items-center">
            <i className="ri-wifi-off-line me-2"></i>
            <div>
              <strong>Demo Mode Active</strong> - Backend server is not running. 
              Using simulated medicine dashboard data for demonstration purposes.
            </div>
          </div>
        </Alert>
      )}
      
      <Row className="mb-4">
        <Col lg={12}>
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="h3 mb-0">Medicine Department Dashboard</h1>
            <Button variant="primary" onClick={() => window.location.reload()}>
              <i className="ri-refresh-line me-2"></i>
              Refresh Data
            </Button>
          </div>
        </Col>
      </Row>

      {/* Overview Cards */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="icon-circle bg-primary text-white mb-3 mx-auto" style={{width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <i className="ri-user-heart-line fs-3"></i>
              </div>
              <h3 className="text-primary">{dashboardData.total_patients}</h3>
              <p className="text-muted mb-0">Total Patients</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="icon-circle bg-success text-white mb-3 mx-auto" style={{width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <i className="ri-stethoscope-line fs-3"></i>
              </div>
              <h3 className="text-success">{dashboardData.total_doctors}</h3>
              <p className="text-muted mb-0">Total Doctors</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="icon-circle bg-warning text-white mb-3 mx-auto" style={{width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <i className="ri-calendar-check-line fs-3"></i>
              </div>
              <h3 className="text-warning">{dashboardData.total_appointments_today}</h3>
              <p className="text-muted mb-0">Appointments Today</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="icon-circle bg-danger text-white mb-3 mx-auto" style={{width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <i className="ri-first-aid-kit-line fs-3"></i>
              </div>
              <h3 className="text-danger">{dashboardData.total_emergency_cases_today}</h3>
              <p className="text-muted mb-0">Emergency Cases Today</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Access Module Cards */}
      <Row className="mb-4">
        <Col lg={12}>
          <h5 className="text-primary mb-3">Quick Access to Medicine Modules</h5>
        </Col>
        <Col lg={4} md={6} className="mb-3">
          <Card className="border-0 shadow-sm h-100" style={{cursor: 'pointer'}} onClick={() => window.location.href = '/medicine/s3-data-manager-demo'}>
            <Card.Body className="text-center">
              <div className="icon-circle bg-info text-white mb-3 mx-auto" style={{width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <i className="ri-database-2-line fs-3"></i>
              </div>
              <h6 className="text-info">Medicine S3 Data Manager</h6>
              <p className="text-muted mb-0 small">Comprehensive medical data management with S3 integration</p>
              <Badge bg="info" className="mt-2">New Feature</Badge>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} md={6} className="mb-3">
          <Card className="border-0 shadow-sm h-100" style={{cursor: 'pointer'}} onClick={() => window.location.href = '/medicine/management'}>
            <Card.Body className="text-center">
              <div className="icon-circle bg-primary text-white mb-3 mx-auto" style={{width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <i className="ri-hospital-line fs-3"></i>
              </div>
              <h6 className="text-primary">Advanced Management</h6>
              <p className="text-muted mb-0 small">Complete medicine management and analytics</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} md={6} className="mb-3">
          <Card className="border-0 shadow-sm h-100" style={{cursor: 'pointer'}} onClick={() => window.location.href = '/medicine/diabetes-tracker'}>
            <Card.Body className="text-center">
              <div className="icon-circle bg-success text-white mb-3 mx-auto" style={{width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <i className="ri-health-book-line fs-3"></i>
              </div>
              <h6 className="text-success">Diabetes Tracker</h6>
              <p className="text-muted mb-0 small">Specialized diabetes patient tracking</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Specialty Tabs */}
      <Row className="mb-4">
        <Col lg={12}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <Tab.Container defaultActiveKey="general">
                <Nav variant="pills" className="mb-4">
                  <Nav.Item>
                    <Nav.Link eventKey="general">
                      <i className="ri-heart-pulse-line me-2"></i>
                      General Medicine
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="emergency">
                      <i className="ri-first-aid-kit-line me-2"></i>
                      Emergency Medicine
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="diabetes">
                      <i className="ri-health-book-line me-2"></i>
                      Diabetes Management
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="advanced-features">
                      <i className="ri-cpu-line me-2"></i>
                      Advanced Features
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="ai-assistant">
                      <i className="ri-robot-2-line me-2"></i>
                      AI Assistant
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="analytics">
                      <i className="ri-bar-chart-line me-2"></i>
                      Analytics
                    </Nav.Link>
                  </Nav.Item>
                </Nav>

                <Tab.Content>
                  {/* General Medicine Tab */}
                  <Tab.Pane eventKey="general">
                    <Row>
                      <Col lg={6}>
                        <div className="mb-4">
                          <h5 className="text-primary mb-3">General Medicine Statistics</h5>
                          <Row>
                            <Col md={6} className="mb-3">
                              <Card className="bg-light border-0">
                                <Card.Body className="text-center">
                                  <h4 className="text-primary">{generalMedicineStats.total_general_doctors}</h4>
                                  <small className="text-muted">General Medicine Doctors</small>
                                </Card.Body>
                              </Card>
                            </Col>
                            <Col md={6} className="mb-3">
                              <Card className="bg-light border-0">
                                <Card.Body className="text-center">
                                  <h4 className="text-info">{generalMedicineStats.general_appointments_this_month}</h4>
                                  <small className="text-muted">Appointments This Month</small>
                                </Card.Body>
                              </Card>
                            </Col>
                            <Col md={12} className="mb-3">
                              <Card className="bg-light border-0">
                                <Card.Body className="text-center">
                                  <h4 className="text-success">{(generalMedicineStats.average_patients_per_doctor || 0).toFixed(1)}</h4>
                                  <small className="text-muted">Avg Patients per Doctor</small>
                                </Card.Body>
                              </Card>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="mb-4">
                          <h6 className="text-muted mb-3">Consultation Types</h6>
                          <div style={{height: '300px'}}>
                            <Bar data={generalMedicineChartData} options={{maintainAspectRatio: false}} />
                          </div>
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col lg={12}>
                        <h6 className="text-muted mb-3">Top Diagnoses</h6>
                        <div className="table-responsive">
                          <table className="table table-sm">
                            <thead>
                              <tr>
                                <th>Diagnosis</th>
                                <th>Count</th>
                                <th>Percentage</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(generalMedicineStats.top_diagnoses || []).slice(0, 10).map(([diagnosis, count], index) => {
                                const total = (generalMedicineStats.top_diagnoses || []).reduce((sum, [, c]) => sum + c, 0);
                                const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : '0.0';
                                return (
                                  <tr key={index}>
                                    <td>{diagnosis}</td>
                                    <td><Badge bg="primary">{count}</Badge></td>
                                    <td>{percentage}%</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </Col>
                    </Row>
                  </Tab.Pane>

                  {/* Emergency Medicine Tab */}
                  <Tab.Pane eventKey="emergency">
                    <Row>
                      <Col lg={8}>
                        <Row>
                          <Col md={3} className="mb-3">
                            <Card className="bg-light border-0">
                              <Card.Body className="text-center">
                                <h4 className="text-danger">{emergencyMedicineStats.total_emergency_doctors}</h4>
                                <small className="text-muted">Emergency Doctors</small>
                              </Card.Body>
                            </Card>
                          </Col>
                          <Col md={3} className="mb-3">
                            <Card className="bg-light border-0">
                              <Card.Body className="text-center">
                                <h4 className="text-warning">{emergencyMedicineStats.emergency_cases_this_month}</h4>
                                <small className="text-muted">Cases This Month</small>
                              </Card.Body>
                            </Card>
                          </Col>
                          <Col md={3} className="mb-3">
                            <Card className="bg-light border-0">
                              <Card.Body className="text-center">
                                <h4 className="text-info">{emergencyMedicineStats.trauma_cases}</h4>
                                <small className="text-muted">Trauma Cases</small>
                              </Card.Body>
                            </Card>
                          </Col>
                          <Col md={3} className="mb-3">
                            <Card className="bg-light border-0">
                              <Card.Body className="text-center">
                                <h4 className="text-success">{emergencyMedicineStats.critical_cases}</h4>
                                <small className="text-muted">Critical Cases</small>
                              </Card.Body>
                            </Card>
                          </Col>
                        </Row>

                        <div className="mb-4">
                          <h6 className="text-muted mb-3">Performance Metrics</h6>
                          <Row>
                            <Col md={6} className="mb-3">
                              <Card className="bg-light border-0">
                                <Card.Body className="text-center">
                                  <h5 className="text-primary">{(emergencyMedicineStats.average_time_to_provider_minutes || 0).toFixed(1)} min</h5>
                                  <small className="text-muted">Avg Time to Provider</small>
                                </Card.Body>
                              </Card>
                            </Col>
                            <Col md={6} className="mb-3">
                              <Card className="bg-light border-0">
                                <Card.Body className="text-center">
                                  <h5 className="text-info">{(emergencyMedicineStats.average_total_ed_time_hours || 0).toFixed(1)} hrs</h5>
                                  <small className="text-muted">Avg Total ED Time</small>
                                </Card.Body>
                              </Card>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                      <Col lg={4}>
                        <div className="mb-4">
                          <h6 className="text-muted mb-3">Triage Distribution</h6>
                          <div style={{height: '300px'}}>
                            <Doughnut data={triageChartData} options={{maintainAspectRatio: false}} />
                          </div>
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col lg={12}>
                        <h6 className="text-muted mb-3">Disposition Statistics</h6>
                        <div className="row">
                          {Object.entries(emergencyMedicineStats.disposition_stats || {}).map(([disposition, count]) => (
                            <div key={disposition} className="col-md-2 mb-3">
                              <Card className="bg-light border-0">
                                <Card.Body className="text-center">
                                  <h5 className="text-secondary">{count}</h5>
                                  <small className="text-muted">{disposition.replace('_', ' ').toUpperCase()}</small>
                                </Card.Body>
                              </Card>
                            </div>
                          ))}
                        </div>
                      </Col>
                    </Row>
                  </Tab.Pane>

                  {/* Diabetes Management Tab */}
                  <Tab.Pane eventKey="diabetes">
                    <DiabetesManagement />
                  </Tab.Pane>

                  {/* Advanced Features Tab */}
                  <Tab.Pane eventKey="advanced-features">
                    <MedicineAdvancedFeatures />
                  </Tab.Pane>

                  {/* AI Assistant Tab */}
                  <Tab.Pane eventKey="ai-assistant">
                    <Row className="mb-4">
                      <Col lg={12}>
                        <Alert variant="info" className="mb-4">
                          <div className="d-flex align-items-center">
                            <i className="ri-robot-2-line fs-4 me-3"></i>
                            <div>
                              <h6 className="alert-heading mb-1">Advanced AI-Powered Medical Assistant</h6>
                              <p className="mb-0">Leverage cutting-edge AI for clinical decision support, risk prediction, and personalized patient care.</p>
                            </div>
                          </div>
                        </Alert>
                      </Col>
                    </Row>

                    {/* AI Feature Cards */}
                    <Row className="mb-4">
                      <Col lg={3} md={6} className="mb-3">
                        <Card className="h-100 border-0 shadow-sm ai-feature-card" style={{cursor: 'pointer'}} onClick={() => openAiModal('risk-prediction')}>
                          <Card.Body className="text-center">
                            <div className="mb-3">
                              <i className="ri-heart-pulse-line fs-1 text-danger"></i>
                            </div>
                            <h6 className="text-primary">Risk Prediction</h6>
                            <p className="text-muted small">AI-powered patient risk assessment and early warning system</p>
                            <Badge bg="danger" className="mb-2">{(aiFeatures.patientRiskAnalysis && aiFeatures.patientRiskAnalysis.highRisk) || 0} High Risk</Badge>
                            <Badge bg="warning" className="mb-2 ms-1">{(aiFeatures.patientRiskAnalysis && aiFeatures.patientRiskAnalysis.mediumRisk) || 0} Medium</Badge>
                          </Card.Body>
                        </Card>
                      </Col>
                      
                      <Col lg={3} md={6} className="mb-3">
                        <Card className="h-100 border-0 shadow-sm ai-feature-card" style={{cursor: 'pointer'}} onClick={() => openAiModal('drug-interaction')}>
                          <Card.Body className="text-center">
                            <div className="mb-3">
                              <i className="ri-medicine-bottle-line fs-1 text-warning"></i>
                            </div>
                            <h6 className="text-primary">Drug Interaction Checker</h6>
                            <p className="text-muted small">Advanced medication interaction analysis and optimization</p>
                            <Badge bg="warning">{aiFeatures.drugInteractions.length} Active Alerts</Badge>
                          </Card.Body>
                        </Card>
                      </Col>
                      
                      <Col lg={3} md={6} className="mb-3">
                        <Card className="h-100 border-0 shadow-sm ai-feature-card" style={{cursor: 'pointer'}} onClick={() => openAiModal('diagnostic-support')}>
                          <Card.Body className="text-center">
                            <div className="mb-3">
                              <i className="ri-stethoscope-line fs-1 text-success"></i>
                            </div>
                            <h6 className="text-primary">Diagnostic Support</h6>
                            <p className="text-muted small">AI-assisted differential diagnosis and clinical decision support</p>
                            <Badge bg="success">{aiFeatures.diagnosticSuggestions.length} Suggestions Available</Badge>
                          </Card.Body>
                        </Card>
                      </Col>
                      
                      <Col lg={3} md={6} className="mb-3">
                        <Card className="h-100 border-0 shadow-sm ai-feature-card" style={{cursor: 'pointer'}} onClick={() => openAiModal('treatment-optimization')}>
                          <Card.Body className="text-center">
                            <div className="mb-3">
                              <i className="ri-capsule-line fs-1 text-info"></i>
                            </div>
                            <h6 className="text-primary">Treatment Optimization</h6>
                            <p className="text-muted small">Personalized treatment recommendations based on patient data</p>
                            <Badge bg="info">{aiFeatures.treatmentRecommendations.length} Recommendations</Badge>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>

                    {/* AI Insights Dashboard */}
                    <Row className="mb-4">
                      <Col lg={8}>
                        <Card className="border-0 shadow-sm">
                          <Card.Header className="bg-gradient-primary text-white">
                            <h6 className="mb-0">
                              <i className="ri-brain-line me-2"></i>
                              Real-Time AI Clinical Insights
                            </h6>
                          </Card.Header>
                          <Card.Body>
                            {aiFeatures.clinicalInsights.map((insight, index) => (
                              <Alert key={index} variant="light" className="border-start border-primary border-3">
                                <div className="d-flex justify-content-between align-items-start">
                                  <div>
                                    <h6 className="alert-heading">{insight?.insight || 'Clinical Insight'}</h6>
                                    <p className="mb-1 text-muted">{insight?.recommendation || 'No recommendation available'}</p>
                                    <small className="text-success">Confidence: {((insight?.confidence || 0) * 100).toFixed(1)}%</small>
                                  </div>
                                  <Badge bg="primary">AI</Badge>
                                </div>
                              </Alert>
                            ))}
                          </Card.Body>
                        </Card>
                      </Col>
                      
                      <Col lg={4}>
                        <Card className="border-0 shadow-sm">
                          <Card.Header>
                            <h6 className="mb-0">
                              <i className="ri-pie-chart-line me-2"></i>
                              Patient Risk Distribution
                            </h6>
                          </Card.Header>
                          <Card.Body>
                            <div style={{height: '200px'}}>
                              <ChartErrorBoundary chartType="doughnut" component="PatientRiskDistribution">
                                <Doughnut 
                                  data={generateSafeChartData(
                                    ['High Risk', 'Medium Risk', 'Low Risk'],
                                    [{
                                      data: [
                                        aiFeatures.patientRiskAnalysis.highRisk || 0,
                                        aiFeatures.patientRiskAnalysis.mediumRisk || 0,
                                        aiFeatures.patientRiskAnalysis.lowRisk || 0
                                      ],
                                      backgroundColor: [chartColors.danger, chartColors.warning, chartColors.success],
                                      borderWidth: 2,
                                      borderColor: '#ffffff'
                                    }]
                                  )}
                                  options={{
                                    maintainAspectRatio: false,
                                    responsive: true,
                                    plugins: {
                                      legend: {
                                        position: 'bottom',
                                        labels: {
                                          padding: 20,
                                          usePointStyle: true
                                        }
                                      },
                                      tooltip: {
                                        callbacks: {
                                          label: function(context) {
                                            const label = context.label || '';
                                            const value = context.parsed || 0;
                                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                            const percentage = total > 0 ? safePercentage(value / total, 1) : 0;
                                            return `${label}: ${value} (${percentage}%)`;
                                          }
                                        }
                                      }
                                    },
                                    elements: {
                                      arc: {
                                        borderAlign: 'center'
                                      }
                                    }
                                  }}
                                />
                              </ChartErrorBoundary>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>

                    {/* AI Predictions Table */}
                    <Row className="mb-4">
                      <Col lg={12}>
                        <Card className="border-0 shadow-sm">
                          <Card.Header>
                            <h6 className="mb-0">
                              <i className="ri-alert-line me-2"></i>
                              AI Risk Predictions
                            </h6>
                          </Card.Header>
                          <Card.Body>
                            <div className="table-responsive">
                              <Table striped hover>
                                <thead>
                                  <tr>
                                    <th>Patient ID</th>
                                    <th>Predicted Condition</th>
                                    <th>Risk Level</th>
                                    <th>Probability</th>
                                    <th>Key Risk Factors</th>
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {aiFeatures.riskPredictions.map((prediction, index) => (
                                    <tr key={index}>
                                      <td className="fw-bold">{prediction.patientId}</td>
                                      <td>{prediction.condition}</td>
                                      <td>
                                        <Badge bg={
                                          prediction.riskLevel === 'High' ? 'danger' : 
                                          prediction.riskLevel === 'Medium' ? 'warning' : 'success'
                                        }>
                                          {prediction.riskLevel}
                                        </Badge>
                                      </td>
                                      <td>
                                        <div className="d-flex align-items-center">
                                          <ProgressBar 
                                            now={safePercentage(prediction.probability || 0, 1)} 
                                            style={{width: '80px', height: '8px'}}
                                            variant={prediction.probability > 0.7 ? 'danger' : prediction.probability > 0.4 ? 'warning' : 'success'}
                                          />
                                          <span className="ms-2 small">{safePercentage(prediction.probability || 0, 1)}%</span>
                                        </div>
                                      </td>
                                      <td>
                                        {prediction.factors.map((factor, idx) => (
                                          <Badge key={idx} bg="secondary" className="me-1 mb-1">{factor}</Badge>
                                        ))}
                                      </td>
                                      <td>
                                        <Button size="sm" variant="outline-primary">
                                          <i className="ri-eye-line me-1"></i>View Details
                                        </Button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>

                    {/* Drug Interactions Alert */}
                    <Row className="mb-4">
                      <Col lg={6}>
                        <Card className="border-0 shadow-sm">
                          <Card.Header className="bg-warning text-dark">
                            <h6 className="mb-0">
                              <i className="ri-error-warning-line me-2"></i>
                              Drug Interaction Alerts
                            </h6>
                          </Card.Header>
                          <Card.Body>
                            {aiFeatures.drugInteractions.map((interaction, index) => (
                              <Alert key={index} variant="warning" className="mb-2">
                                <div className="d-flex justify-content-between align-items-start">
                                  <div>
                                    <h6 className="alert-heading">{interaction.medication1} + {interaction.medication2}</h6>
                                    <p className="mb-1">{interaction.effect}</p>
                                    <Badge bg={interaction.severity === 'High' ? 'danger' : 'warning'}>
                                      {interaction.severity} Severity
                                    </Badge>
                                  </div>
                                  <Button size="sm" variant="outline-warning">Review</Button>
                                </div>
                              </Alert>
                            ))}
                          </Card.Body>
                        </Card>
                      </Col>
                      
                      <Col lg={6}>
                        <Card className="border-0 shadow-sm">
                          <Card.Header className="bg-success text-white">
                            <h6 className="mb-0">
                              <i className="ri-lightbulb-line me-2"></i>
                              AI Treatment Recommendations
                            </h6>
                          </Card.Header>
                          <Card.Body>
                            {aiFeatures.treatmentRecommendations.map((recommendation, index) => (
                              <div key={index} className="border-bottom pb-3 mb-3">
                                <div className="d-flex justify-content-between align-items-start">
                                  <div>
                                    <h6 className="text-primary">Patient {recommendation.patientId}</h6>
                                    <p className="mb-1"><strong>Condition:</strong> {recommendation.condition}</p>
                                    <p className="mb-1 text-muted">{recommendation.recommendation}</p>
                                    <small className="text-success">AI Confidence: {(recommendation.confidence * 100).toFixed(1)}%</small>
                                  </div>
                                  <Button size="sm" variant="outline-success">Apply</Button>
                                </div>
                              </div>
                            ))}
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Tab.Pane>

                  {/* Analytics Tab */}
                  <Tab.Pane eventKey="analytics">
                    <Row>
                      <Col lg={6}>
                        <div className="mb-4">
                          <h6 className="text-muted mb-3">Appointment Types Distribution</h6>
                          <div style={{height: '300px'}}>
                            <Doughnut data={appointmentTypeChartData} options={{maintainAspectRatio: false}} />
                          </div>
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="mb-4">
                          <h6 className="text-muted mb-3">Department Statistics</h6>
                          <div className="table-responsive">
                            <table className="table table-sm">
                              <tbody>
                                <tr>
                                  <td>Pending Lab Tests</td>
                                  <td><Badge bg="warning">{dashboardData.pending_lab_tests}</Badge></td>
                                </tr>
                                <tr>
                                  <td>Active Treatment Plans</td>
                                  <td><Badge bg="success">{dashboardData.active_treatment_plans}</Badge></td>
                                </tr>
                                <tr>
                                  <td>Total Appointments Today</td>
                                  <td><Badge bg="info">{dashboardData.total_appointments_today}</Badge></td>
                                </tr>
                                <tr>
                                  <td>Emergency Cases Today</td>
                                  <td><Badge bg="danger">{dashboardData.total_emergency_cases_today}</Badge></td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col lg={6}>
                        <Card className="border-0 shadow-sm">
                          <Card.Header>
                            <h6 className="mb-0">Recent Patients</h6>
                          </Card.Header>
                          <Card.Body>
                            <div className="list-group list-group-flush">
                              {dashboardData.recent_patients?.slice(0, 5).map((patient, index) => (
                                <div key={index} className="list-group-item border-0 px-0">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                      <h6 className="mb-1">{patient.user?.first_name} {patient.user?.last_name}</h6>
                                      <small className="text-muted">ID: {patient.patient_id} | Age: {patient.age}</small>
                                    </div>
                                    <Badge bg="primary">New</Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col lg={6}>
                        <Card className="border-0 shadow-sm">
                          <Card.Header>
                            <h6 className="mb-0">Upcoming Appointments</h6>
                          </Card.Header>
                          <Card.Body>
                            <div className="list-group list-group-flush">
                              {dashboardData.upcoming_appointments?.slice(0, 5).map((appointment, index) => (
                                <div key={index} className="list-group-item border-0 px-0">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                      <h6 className="mb-1">{appointment.patient?.user?.first_name} {appointment.patient?.user?.last_name}</h6>
                                      <small className="text-muted">
                                        {new Date(appointment.scheduled_datetime).toLocaleString()} | 
                                        Dr. {appointment.doctor?.user?.first_name} {appointment.doctor?.user?.last_name}
                                      </small>
                                    </div>
                                    <Badge bg={appointment.priority === 'urgent' ? 'danger' : appointment.priority === 'high' ? 'warning' : 'success'}>
                                      {appointment.priority}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* AI Analysis Modal */}
      <Modal show={showAiModal} onHide={() => setShowAiModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-robot-2-line me-2"></i>
            AI Medical Assistant - {selectedAiFeature.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!aiAnalysisResult ? (
            <Form onSubmit={(e) => {
              e.preventDefault();
              handleAiAnalysis(selectedAiFeature, aiAnalysisInput);
            }}>
              <Row>
                <Col lg={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Patient ID</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Patient ID"
                      value={aiAnalysisInput.patientId}
                      onChange={(e) => setAiAnalysisInput({...aiAnalysisInput, patientId: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col lg={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Symptoms</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter symptoms (comma-separated)"
                      value={aiAnalysisInput.symptoms}
                      onChange={(e) => setAiAnalysisInput({...aiAnalysisInput, symptoms: e.target.value})}
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col lg={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Medical History</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter relevant medical history"
                      value={aiAnalysisInput.medicalHistory}
                      onChange={(e) => setAiAnalysisInput({...aiAnalysisInput, medicalHistory: e.target.value})}
                    />
                  </Form.Group>
                </Col>
                <Col lg={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Current Medications</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter current medications (comma-separated)"
                      value={aiAnalysisInput.currentMedications}
                      onChange={(e) => setAiAnalysisInput({...aiAnalysisInput, currentMedications: e.target.value})}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Alert variant="info">
                <i className="ri-information-line me-2"></i>
                <strong>AI Analysis Features:</strong>
                <ul className="mb-0 mt-2">
                  {selectedAiFeature === 'risk-prediction' && (
                    <>
                      <li>Cardiovascular risk assessment using ML algorithms</li>
                      <li>Diabetes complication prediction</li>
                      <li>Early warning system for critical conditions</li>
                      <li>Personalized risk factor identification</li>
                    </>
                  )}
                  {selectedAiFeature === 'drug-interaction' && (
                    <>
                      <li>Real-time medication interaction checking</li>
                      <li>Dosage optimization recommendations</li>
                      <li>Alternative medication suggestions</li>
                      <li>Allergy and contraindication alerts</li>
                    </>
                  )}
                  {selectedAiFeature === 'diagnostic-support' && (
                    <>
                      <li>Differential diagnosis generation</li>
                      <li>Evidence-based test recommendations</li>
                      <li>Clinical decision support</li>
                      <li>Symptom pattern recognition</li>
                    </>
                  )}
                  {selectedAiFeature === 'treatment-optimization' && (
                    <>
                      <li>Personalized treatment protocols</li>
                      <li>Outcome prediction modeling</li>
                      <li>Resource optimization</li>
                      <li>Clinical pathway recommendations</li>
                    </>
                  )}
                </ul>
              </Alert>

              <div className="d-flex justify-content-between">
                <Button variant="outline-secondary" onClick={() => setShowAiModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={aiLoading}>
                  {aiLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <i className="ri-brain-line me-2"></i>
                      Start AI Analysis
                    </>
                  )}
                </Button>
              </div>
            </Form>
          ) : (
            <div>
              <Alert variant="success" className="mb-4">
                <i className="ri-check-line me-2"></i>
                <strong>AI Analysis Complete!</strong> Results generated using advanced machine learning models.
              </Alert>

              {/* Results Display */}
              {selectedAiFeature === 'risk-prediction' && aiAnalysisResult.predictions && (
                <div>
                  <Row className="mb-4">
                    <Col lg={4}>
                      <Card className="text-center border-0 bg-light">
                        <Card.Body>
                          <h3 className="text-primary">{aiAnalysisResult.riskScore?.toFixed(1)}</h3>
                          <p className="text-muted mb-0">Overall Risk Score</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col lg={4}>
                      <Card className="text-center border-0 bg-light">
                        <Card.Body>
                          <h3 className={`text-${aiAnalysisResult.riskLevel === 'High' ? 'danger' : aiAnalysisResult.riskLevel === 'Medium' ? 'warning' : 'success'}`}>
                            {aiAnalysisResult.riskLevel}
                          </h3>
                          <p className="text-muted mb-0">Risk Level</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col lg={4}>
                      <Card className="text-center border-0 bg-light">
                        <Card.Body>
                          <h3 className="text-info">{aiAnalysisResult.predictions?.length}</h3>
                          <p className="text-muted mb-0">Conditions Analyzed</p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  <h6 className="text-primary mb-3">Risk Predictions:</h6>
                  <Table striped>
                    <thead>
                      <tr>
                        <th>Condition</th>
                        <th>Probability</th>
                        <th>Risk Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aiAnalysisResult.predictions?.map((pred, index) => (
                        <tr key={index}>
                          <td>{pred.condition}</td>
                          <td>
                            <ProgressBar 
                              now={pred.probability * 100} 
                              label={`${(pred.probability * 100).toFixed(1)}%`}
                              variant={pred.probability > 0.7 ? 'danger' : pred.probability > 0.4 ? 'warning' : 'success'}
                            />
                          </td>
                          <td>
                            <Badge bg={pred.probability > 0.7 ? 'danger' : pred.probability > 0.4 ? 'warning' : 'success'}>
                              {pred.probability > 0.7 ? 'High' : pred.probability > 0.4 ? 'Medium' : 'Low'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <h6 className="text-primary mb-3">AI Recommendations:</h6>
                  <ul className="list-group">
                    {aiAnalysisResult.recommendations?.map((rec, index) => (
                      <li key={index} className="list-group-item">
                        <i className="ri-check-circle-line text-success me-2"></i>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedAiFeature === 'drug-interaction' && aiAnalysisResult.interactions && (
                <div>
                  <h6 className="text-primary mb-3">Medication Analysis for: {aiAnalysisResult.medications?.join(', ')}</h6>
                  
                  <h6 className="text-warning mb-3">Detected Interactions:</h6>
                  {aiAnalysisResult.interactions?.map((interaction, index) => (
                    <Alert key={index} variant={interaction.severity === 'High' ? 'danger' : 'warning'}>
                      <h6 className="alert-heading">{interaction.severity} Severity Interaction</h6>
                      <p className="mb-0">{interaction.description}</p>
                    </Alert>
                  ))}

                  <h6 className="text-success mb-3">AI Recommendations:</h6>
                  <ul className="list-group">
                    {aiAnalysisResult.alternatives?.map((alt, index) => (
                      <li key={index} className="list-group-item">
                        <i className="ri-lightbulb-line text-warning me-2"></i>
                        {alt}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedAiFeature === 'diagnostic-support' && aiAnalysisResult.differentialDiagnosis && (
                <div>
                  <h6 className="text-primary mb-3">Symptoms Analyzed: {aiAnalysisResult.symptoms?.join(', ')}</h6>
                  
                  <Alert variant={aiAnalysisResult.urgency === 'High' ? 'danger' : 'info'}>
                    <strong>Urgency Level: {aiAnalysisResult.urgency}</strong>
                  </Alert>

                  <h6 className="text-primary mb-3">Differential Diagnosis:</h6>
                  <Table striped>
                    <thead>
                      <tr>
                        <th>Condition</th>
                        <th>Probability</th>
                        <th>Confidence</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aiAnalysisResult.differentialDiagnosis?.map((diagnosis, index) => (
                        <tr key={index}>
                          <td>{diagnosis.condition}</td>
                          <td>
                            <ProgressBar 
                              now={diagnosis.probability * 100} 
                              label={`${(diagnosis.probability * 100).toFixed(1)}%`}
                              variant={diagnosis.probability > 0.7 ? 'danger' : diagnosis.probability > 0.5 ? 'warning' : 'info'}
                            />
                          </td>
                          <td>
                            <Badge bg={diagnosis.probability > 0.7 ? 'success' : diagnosis.probability > 0.5 ? 'warning' : 'secondary'}>
                              {diagnosis.probability > 0.7 ? 'High' : diagnosis.probability > 0.5 ? 'Medium' : 'Low'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <h6 className="text-primary mb-3">Recommended Tests:</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {aiAnalysisResult.recommendedTests?.map((test, index) => (
                      <Badge key={index} bg="info" className="p-2">
                        <i className="ri-test-tube-line me-1"></i>
                        {test}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 d-flex justify-content-between">
                <Button variant="outline-primary" onClick={() => {setAiAnalysisResult(null); setAiAnalysisInput({patientId: '', symptoms: '', medicalHistory: '', currentMedications: ''});}}>
                  <i className="ri-refresh-line me-2"></i>
                  New Analysis
                </Button>
                <div>
                  <Button variant="outline-success" className="me-2">
                    <i className="ri-download-line me-2"></i>
                    Export Report
                  </Button>
                  <Button variant="primary">
                    <i className="ri-save-line me-2"></i>
                    Save to Patient Record
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>

      <style jsx>{`
        .ai-feature-card {
          transition: all 0.3s ease;
        }
        .ai-feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
      `}</style>
    </Container>
  );
};

export default MedicineDashboard;
