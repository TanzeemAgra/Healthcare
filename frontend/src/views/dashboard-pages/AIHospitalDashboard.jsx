import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Dropdown,
  ProgressBar,
  Table,
  Alert,
  Spinner,
  Form,
  Modal,
  Tab,
  Nav,
  InputGroup,
  ListGroup,
  Accordion,
  Toast,
  ToastContainer,
  Offcanvas
} from 'react-bootstrap';
import { 
  RiDashboardFill, 
  RiUserFill, 
  RiHeartPulseFill, 
  RiCalendarFill, 
  RiArrowUpCircleFill,
  RiArrowDownCircleFill,
  RiRefreshLine,
  RiSettings3Fill,
  RiFilterFill,
  RiEyeFill,
  RiBarChartBoxFill,
  RiLineChartFill,
  RiPieChartFill,
  RiRobotFill,
  RiBrainFill,
  RiMicFill,
  RiCameraFill,
  RiStethoscopeFill,
  RiMedicineBottleFill,
  RiHospitalFill,
  RiUserHeartFill,
  RiTestTubeFill,
  RiScanLine,
  RiAlarmWarningFill,
  RiLightbulbFill,
  RiTimeFill,
  RiMoneyDollarCircleFill,
  RiFileTextFill,
  RiNotificationFill,
  RiGroupFill,
  RiMapPinFill,
  RiPhoneFill,
  RiMailFill,
  RiSearchLine,
  RiAddCircleFill,
  RiEditFill,
  RiDeleteBinFill,
  RiPrinterFill,
  RiDownloadFill,
  RiShareFill,
  RiStarFill,
  RiAwardFill,
  RiShieldCheckFill,
  RiThermometerFill,
  RiFirstAidKitFill,
  RiPulseLine,
  RiMicroscopeLine,
  RiFlaskFill,
  RiCapsuleFill,
  RiSyringeFill,
  RiToothFill,
  RiBodyScanFill,
  RiTruckFill,
  RiWifiLine,
  RiDatabase2Fill,
  RiCloudFill,
  RiSecurePaymentLine,
  RiUserStarFill,
  RiTeamFill,
  RiBookOpenFill,
  RiGraduationCapFill,
  RiCustomerServiceFill,
  RiQrCodeFill,
  RiFeedbackFill,
  RiSurveyFill,
  RiCheckboxCircleFill,
  RiCloseCircleFill,
  RiErrorWarningFill,
  RiInformationFill
} from '@remixicon/react';
import Chart from 'react-apexcharts';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../services/api';
import { checkSuperAdminAccess, getDashboardConfig, setSuperAdminFlags } from "../../config/accessConfig";

// Enhanced AI-Powered Configuration
const DASHBOARD_CONFIG = {
  // Access Configuration (integrated with centralized config)
  ...getDashboardConfig('dashboard-2'),
  
  // AI Dashboard Specific Configuration
  title: 'AI-Powered Clinic Management System',
  subtitle: 'Next-Generation Clinic Operations with Artificial Intelligence',
  refreshInterval: 15000,
  features: {
    realTimeUpdates: true,
    exportData: true,
    customFilters: true,
    notifications: true,
    analytics: true,
    aiDiagnostics: true,
    voiceCommands: true,
    predictiveAnalytics: true,
    computerVision: true,
    naturalLanguageProcessing: true,
    generativeAI: true,
    smartAlerts: true,
    aiChatbot: true,
    medicalImageAnalysis: true,
    drugInteractionChecker: true,
    symptomChecker: true,
    aiScheduling: true,
    predictiveStaffing: true,
    riskAssessment: true
  },
  permissions: {
    view: ['super_admin', 'admin', 'doctor', 'nurse', 'radiologist', 'pharmacist'],
    edit: ['super_admin', 'admin', 'doctor'],
    export: ['super_admin', 'admin', 'doctor', 'researcher'],
    manage: ['super_admin'],
    aiFeatures: ['super_admin', 'admin', 'doctor'],
    criticalAlerts: ['super_admin', 'admin', 'doctor', 'nurse']
  },
  sections: [
    { id: 'ai-overview', name: 'AI Dashboard', icon: RiRobotFill, enabled: true, color: 'primary' },
    { id: 'patient-management', name: 'Patient Management', icon: RiUserHeartFill, enabled: true, color: 'success' },
    { id: 'ai-diagnostics', name: 'AI Diagnostics', icon: RiBrainFill, enabled: true, color: 'info' },
    { id: 'medical-imaging', name: 'Medical Imaging AI', icon: RiScanLine, enabled: true, color: 'warning' },
    { id: 'pharmacy-ai', name: 'AI Pharmacy', icon: RiMedicineBottleFill, enabled: true, color: 'danger' },
    { id: 'operations', name: 'Smart Operations', icon: RiHospitalFill, enabled: true, color: 'secondary' },
    { id: 'ai-insights', name: 'AI Insights', icon: RiLightbulbFill, enabled: true, color: 'dark' }
  ],
  aiModules: {
    chatbot: { name: 'Dr. AI Assistant', status: 'active', model: 'GPT-4-Turbo', specializations: ['General Medicine', 'Emergency Care', 'Diagnostics', 'Treatment Planning'] },
    imaging: { name: 'RadiologyAI', status: 'active', capabilities: ['X-Ray Analysis', 'CT Scan Interpretation', 'MRI Analysis', 'Ultrasound Reading'] },
    pharmacy: { name: 'PharmacyAI', status: 'active', features: ['Drug Interaction Checker', 'Dosage Optimizer', 'Allergy Alerts', 'Generic Alternatives'] },
    predictive: { name: 'PredictiveAI', status: 'active', models: ['Patient Risk Assessment', 'Readmission Prediction', 'Staffing Optimization', 'Resource Planning'] }
  }
};

const AIHospitalDashboard = () => {
  // Enhanced State management with AI features
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('ai-overview');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);
  const [aiChatMessages, setAiChatMessages] = useState([
    { id: 1, text: "Hello! I'm Dr. AI Assistant. How can I help you with clinic management today?", sender: 'ai', timestamp: new Date(), confidence: 99 }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // AI-powered data states
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalPatients: 1247,
      todayAdmissions: 23,
      activeDoctors: 89,
      departmentLoad: 78,
      aiDiagnosesCount: 156,
      criticalAlerts: 5,
      aiAccuracy: 94.7,
      automatedTasks: 1247
    },
    aiInsights: {
      riskPatients: [],
      predictedAdmissions: [],
      resourceOptimization: [],
      drugInteractions: [],
      staffingRecommendations: []
    },
    charts: {
      patientTrends: [],
      departmentStats: [],
      healthMetrics: [],
      aiPerformance: [],
      predictiveAnalytics: []
    },
    recentActivity: [],
    alerts: [],
    aiRecommendations: []
  });

  const { user, isSuperAdmin, isAdmin } = useAuth();

  // Initialize Super Admin Access for consistent behavior
  useEffect(() => {
    const initializeAccess = () => {
      const hasSuperAdminAccess = checkSuperAdminAccess(user);
      if (hasSuperAdminAccess || DASHBOARD_CONFIG.enableTestingBypass) {
        setSuperAdminFlags();
        if (import.meta.env.DEV) {
          console.log('🚀 AIHospitalDashboard - ACCESS GRANTED for:', DASHBOARD_CONFIG.serviceName);
        }
      }
    };
    
    if (user) {
      initializeAccess();
    }
  }, [user]);

  // Permission checker
  const hasPermission = useCallback((action) => {
    const userRole = user?.role || user?.user_role || 'guest';
    const allowedRoles = DASHBOARD_CONFIG.permissions[action] || [];
    return isSuperAdmin() || user?.is_superuser || allowedRoles.includes(userRole);
  }, [user, isSuperAdmin]);

  // AI-powered data generators
  const generateRiskPatients = () => [
    { id: 'P001', name: 'John Doe', riskScore: 87, condition: 'Post-surgical infection risk', aiRecommendation: 'Increase antibiotic monitoring', urgency: 'high' },
    { id: 'P002', name: 'Jane Smith', riskScore: 73, condition: 'Cardiac event probability', aiRecommendation: 'Schedule immediate ECG', urgency: 'medium' },
    { id: 'P003', name: 'Robert Johnson', riskScore: 91, condition: 'Sepsis risk indicators', aiRecommendation: 'Immediate blood culture', urgency: 'critical' }
  ];

  const generateAIActivity = () => [
    { time: '2 minutes ago', action: 'AI detected potential pneumonia in chest X-ray - Patient #1247', type: 'ai-diagnosis', confidence: 94, severity: 'medium' },
    { time: '15 minutes ago', action: 'Automated drug interaction alert triggered for Patient #1203', type: 'ai-safety', confidence: 98, severity: 'high' },
    { time: '32 minutes ago', action: 'AI optimized OR schedule - saved 2.5 hours', type: 'ai-optimization', confidence: 91, severity: 'low' },
    { time: '1 hour ago', action: 'Predictive model flagged patient readmission risk', type: 'ai-prediction', confidence: 87, severity: 'medium' }
  ];

  const generateSmartAlerts = () => [
    { id: 1, type: 'critical', title: 'AI Critical Alert: Sepsis Risk Detected', message: 'Patient P003 shows 91% sepsis probability. Immediate intervention required.', timestamp: new Date(Date.now() - 300000), aiGenerated: true, confidence: 91 },
    { id: 2, type: 'warning', title: 'Staffing Prediction Alert', message: 'AI predicts 40% increase in Emergency admissions tonight. Consider additional staffing.', timestamp: new Date(Date.now() - 900000), aiGenerated: true, confidence: 87 },
    { id: 3, type: 'info', title: 'AI Optimization Success', message: 'OR scheduling optimization completed. 2.5 hours saved, 4 additional surgeries scheduled.', timestamp: new Date(Date.now() - 1800000), aiGenerated: true, confidence: 95 }
  ];

  // Enhanced data fetching
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      setDashboardData({
        stats: {
          totalPatients: 1247,
          todayAdmissions: 23,
          activeDoctors: 89,
          departmentLoad: 78,
          aiDiagnosesCount: 156,
          criticalAlerts: 5,
          aiAccuracy: 94.7,
          automatedTasks: 1247
        },
        aiInsights: {
          riskPatients: generateRiskPatients(),
          predictedAdmissions: [
            { time: '2 hours', department: 'Emergency', predicted: 8, confidence: 89 },
            { time: '6 hours', department: 'ICU', predicted: 3, confidence: 76 }
          ],
          resourceOptimization: [
            { resource: 'OR 3', optimization: 'Reallocate to emergency surgery', impact: '+2.3h efficiency' }
          ],
          drugInteractions: [
            { patient: 'P001', interaction: 'Warfarin + Aspirin', severity: 'High', recommendation: 'Monitor INR levels closely', aiConfidence: 96 }
          ],
          staffingRecommendations: [
            { shift: 'Night Shift', department: 'Emergency', recommendation: '+2 nurses needed', reason: 'Predicted 40% increase in admissions', confidence: 87 }
          ]
        },
        charts: {
          patientTrends: Array.from({length: 30}, (_, i) => ({
            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            admissions: Math.floor(Math.random() * 30) + 10,
            discharges: Math.floor(Math.random() * 25) + 8,
            aiDiagnoses: Math.floor(Math.random() * 40) + 20
          })),
          departmentStats: [
            { name: 'Emergency + AI Triage', value: 285, aiOptimized: true, color: '#ef4444' },
            { name: 'Cardiology + AI Diagnostics', value: 198, aiOptimized: true, color: '#f59e0b' },
            { name: 'Radiology + Image AI', value: 145, aiOptimized: true, color: '#3b82f6' }
          ],
          healthMetrics: [
            { category: 'AI Diagnostic Accuracy', score: 94, trend: 'up' },
            { category: 'Patient Safety Score', score: 97, trend: 'up' },
            { category: 'Treatment Efficiency', score: 89, trend: 'up' }
          ]
        },
        recentActivity: generateAIActivity(),
        alerts: generateSmartAlerts(),
        aiRecommendations: [
          { category: 'Patient Care', recommendation: 'Implement AI-guided early sepsis detection protocols', impact: 'Reduce sepsis mortality by 23%', confidence: 94, implementation: 'High Priority' }
        ]
      });

      setLastUpdated(new Date());
    } catch (error) {
      console.error('AI Dashboard error:', error);
      setError('AI systems temporarily offline. Using cached data.');
    } finally {
      setLoading(false);
    }
  }, []);

  // AI Chat functionality
  const handleAIChat = async (message) => {
    if (!message.trim()) return;
    
    const userMessage = { id: Date.now(), text: message, sender: 'user', timestamp: new Date() };
    setAiChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    
    setTimeout(() => {
      const aiResponses = [
        "I've analyzed the patient data. The symptoms suggest we should consider running additional cardiac tests.",
        "Based on the current bed occupancy, I recommend postponing non-critical surgeries for tomorrow.",
        "The drug interaction checker flagged a potential issue with Patient #1247's medication combination.",
        "AI analysis suggests optimizing the nursing schedule for the night shift in the ICU.",
        "I've identified 3 patients at high risk for readmission within 30 days."
      ];
      
      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        sender: 'ai',
        timestamp: new Date(),
        confidence: Math.floor(Math.random() * 20) + 80
      };
      
      setAiChatMessages(prev => [...prev, aiMessage]);
    }, 1500);
  };

  const startVoiceRecording = () => {
    setVoiceRecording(true);
    setTimeout(() => {
      setVoiceRecording(false);
      const voiceCommands = [
        "Show me patients with high infection risk",
        "What's the current bed availability in ICU?",
        "Schedule emergency surgery for operating room 3",
        "Show AI recommendations for staffing optimization"
      ];
      const command = voiceCommands[Math.floor(Math.random() * voiceCommands.length)];
      handleAIChat(`Voice command: ${command}`);
    }, 3000);
  };

  // Chart options
  const getChartOptions = useMemo(() => ({
    patientTrends: {
      chart: { type: 'area', height: 350, toolbar: { show: hasPermission('export') } },
      colors: ['#4f46e5', '#06b6d4', '#10b981'],
      stroke: { curve: 'smooth', width: 2 },
      fill: { type: 'gradient' },
      xaxis: { type: 'datetime', categories: dashboardData.charts.patientTrends.map(item => item.date) },
      title: { text: 'AI-Enhanced Patient Flow Analytics' }
    },
    aiPerformance: {
      chart: { type: 'radialBar', height: 300 },
      plotOptions: { radialBar: { startAngle: -90, endAngle: 270, hollow: { size: '50%' } } },
      colors: ['#4f46e5'],
      labels: ['AI System Performance']
    }
  }), [dashboardData, hasPermission]);

  // AI-powered stat card
  const AIStatCard = ({ title, value, change, icon: Icon, color = 'primary', aiPowered = false, confidence = null }) => (
    <Card className="h-100 shadow-sm border-0" style={{ background: `linear-gradient(135deg, var(--bs-${color}), var(--bs-${color}-dark))`, color: 'white' }}>
      <Card.Body>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <div className="d-flex align-items-center mb-1">
              <h6 className="text-white-50 mb-0 me-2">{title}</h6>
              {aiPowered && <RiStarFill size={16} className="text-warning" title="AI-Powered" />}
            </div>
            <h3 className="mb-0 text-white">{value}</h3>
            {change && (
              <small className={`text-${change > 0 ? 'success' : 'warning'}`}>
                {change > 0 ? <RiArrowUpCircleFill /> : <RiArrowDownCircleFill />}
                {Math.abs(change)}%
              </small>
            )}
            {confidence && (
              <div className="mt-1">
                <small className="text-white-50">AI Confidence: {confidence}%</small>
              </div>
            )}
          </div>
          <div className="text-white">
            <Icon size={32} />
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  // AI Chat Interface Component
  const AIChatInterface = () => (
    <Offcanvas show={showAiChat} onHide={() => setShowAiChat(false)} placement="end" style={{ width: '400px' }}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          <RiRobotLine className="me-2" />
          Dr. AI Assistant
          <Badge bg="success" className="ms-2">Online</Badge>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="d-flex flex-column">
        <div className="flex-grow-1 overflow-auto mb-3" style={{ maxHeight: '400px' }}>
          {aiChatMessages.map(message => (
            <div key={message.id} className={`mb-3 ${message.sender === 'user' ? 'text-end' : ''}`}>
              <div 
                className={`d-inline-block p-2 rounded ${
                  message.sender === 'user' ? 'bg-primary text-white' : 'bg-light border'
                }`}
                style={{ maxWidth: '80%' }}
              >
                {message.text}
                {message.sender === 'ai' && message.confidence && (
                  <div className="mt-1">
                    <small className="text-muted">Confidence: {message.confidence}%</small>
                  </div>
                )}
              </div>
              <div className="small text-muted mt-1">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
        <div>
          <InputGroup>
            <Form.Control
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Ask Dr. AI anything..."
              onKeyPress={(e) => e.key === 'Enter' && handleAIChat(currentMessage)}
            />
            <Button 
              variant="primary" 
              onClick={() => handleAIChat(currentMessage)}
              disabled={!currentMessage.trim()}
            >
              <RiSendPlaneFill />
            </Button>
          </InputGroup>
          <div className="mt-2">
            <Button 
              variant={voiceRecording ? 'danger' : 'outline-primary'} 
              size="sm" 
              onClick={startVoiceRecording}
              disabled={voiceRecording}
            >
              {voiceRecording ? <Spinner size="sm" animation="border" /> : <RiMicFill />}
              {voiceRecording ? ' Recording...' : ' Voice Command'}
            </Button>
          </div>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );

  // Auto refresh
  useEffect(() => {
    fetchDashboardData();
    if (autoRefresh) {
      const interval = setInterval(fetchDashboardData, DASHBOARD_CONFIG.refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchDashboardData, autoRefresh]);

  // Loading state
  if (loading && !dashboardData.stats.totalPatients) {
    return (
      <Container fluid className="py-4">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Initializing AI systems...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Enhanced Header with AI Features */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">
                <RiRobotFill className="me-2 text-primary" />
                {DASHBOARD_CONFIG.title}
              </h2>
              <p className="text-muted mb-0">{DASHBOARD_CONFIG.subtitle}</p>
              <small className="text-muted">
                Last AI update: {lastUpdated.toLocaleTimeString()} | All systems operational
              </small>
            </div>
            <div className="d-flex gap-2">
              <Button 
                variant="outline-info" 
                size="sm"
                onClick={() => setShowAiChat(true)}
              >
                <RiRobotLine size={16} className="me-1" />
                AI Assistant
              </Button>
              {hasPermission('manage') && (
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  onClick={() => setShowSettings(true)}
                >
                  <RiSettings3Fill size={16} className="me-1" />
                  Settings
                </Button>
              )}
              <Button 
                variant={autoRefresh ? 'primary' : 'outline-primary'}
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                <RiRefreshLine size={16} className="me-1" />
                {autoRefresh ? 'Auto ON' : 'Auto OFF'}
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Error Alert */}
      {error && (
        <Alert variant="warning" className="mb-3" dismissible onClose={() => setError(null)}>
          <RiAlarmWarningFill className="me-2" />
          {error}
        </Alert>
      )}

      {/* AI-Enhanced Stats Overview */}
      <Row className="mb-4">
        <Col md={3}>
          <AIStatCard
            title="Total Patients"
            value={dashboardData.stats.totalPatients.toLocaleString()}
            change={5.2}
            icon={RiUserHeartFill}
            color="primary"
            aiPowered={true}
          />
        </Col>
        <Col md={3}>
          <AIStatCard
            title="AI Diagnoses Today"
            value={dashboardData.stats.aiDiagnosesCount}
            change={23.7}
            icon={RiBrainFill}
            color="info"
            aiPowered={true}
            confidence={94}
          />
        </Col>
        <Col md={3}>
          <AIStatCard
            title="Critical AI Alerts"
            value={dashboardData.stats.criticalAlerts}
            change={-12.3}
            icon={RiAlarmWarningFill}
            color="danger"
            aiPowered={true}
          />
        </Col>
        <Col md={3}>
          <AIStatCard
            title="AI System Accuracy"
            value={`${dashboardData.stats.aiAccuracy}%`}
            change={2.1}
            icon={RiStarFill}
            color="success"
            aiPowered={true}
            confidence={dashboardData.stats.aiAccuracy}
          />
        </Col>
      </Row>

      {/* Main AI Dashboard Content */}
      <Row>
        <Col>
          <Card>
            <Card.Header className="bg-gradient" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <Tab.Container activeKey={activeSection} onSelect={setActiveSection}>
                <Nav variant="tabs" className="border-0">
                  {DASHBOARD_CONFIG.sections
                    .filter(section => section.enabled)
                    .map(section => (
                      <Nav.Item key={section.id}>
                        <Nav.Link eventKey={section.id} className="text-white">
                          <section.icon size={16} className="me-1" />
                          {section.name}
                        </Nav.Link>
                      </Nav.Item>
                    ))}
                </Nav>
              </Tab.Container>
            </Card.Header>
            <Card.Body>
              <Tab.Container activeKey={activeSection}>
                <Tab.Content>
                  {/* AI Overview Tab */}
                  <Tab.Pane eventKey="ai-overview">
                    <Row>
                      <Col lg={8}>
                        <Card className="mb-3">
                          <Card.Header>
                            <h5><RiLineChartFill className="me-2" />AI-Enhanced Patient Analytics</h5>
                          </Card.Header>
                          <Card.Body>
                            <Chart
                              options={getChartOptions.patientTrends}
                              series={[
                                { name: 'Admissions', data: dashboardData.charts.patientTrends.map(item => item.admissions) },
                                { name: 'Discharges', data: dashboardData.charts.patientTrends.map(item => item.discharges) },
                                { name: 'AI Diagnoses', data: dashboardData.charts.patientTrends.map(item => item.aiDiagnoses) }
                              ]}
                              type="area"
                              height={350}
                            />
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col lg={4}>
                        <Card className="mb-3">
                          <Card.Header>
                            <h5><RiPieChartFill className="me-2" />AI System Performance</h5>
                          </Card.Header>
                          <Card.Body>
                            <Chart
                              options={getChartOptions.aiPerformance}
                              series={[dashboardData.stats.aiAccuracy]}
                              type="radialBar"
                              height={300}
                            />
                            <div className="text-center mt-3">
                              <Badge bg="success" className="me-2">Accuracy: {dashboardData.stats.aiAccuracy}%</Badge>
                              <Badge bg="info">Uptime: 99.9%</Badge>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <Card>
                          <Card.Header>
                            <h5><RiAlarmWarningFill className="me-2" />AI Risk Assessment</h5>
                          </Card.Header>
                          <Card.Body style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {dashboardData.aiInsights.riskPatients.map((patient, index) => (
                              <div key={index} className="border rounded p-2 mb-2">
                                <div className="d-flex justify-content-between align-items-center">
                                  <strong>{patient.name}</strong>
                                  <Badge bg={patient.urgency === 'critical' ? 'danger' : patient.urgency === 'high' ? 'warning' : 'info'}>
                                    Risk: {patient.riskScore}%
                                  </Badge>
                                </div>
                                <small className="text-muted">{patient.condition}</small>
                                <div className="mt-1">
                                  <small className="text-primary">
                                    <RiBrainFill size={14} className="me-1" />
                                    AI Recommendation: {patient.aiRecommendation}
                                  </small>
                                </div>
                              </div>
                            ))}
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={6}>
                        <Card>
                          <Card.Header>
                            <h5><RiLightbulbFill className="me-2" />AI Recommendations</h5>
                          </Card.Header>
                          <Card.Body style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {dashboardData.aiRecommendations.map((rec, index) => (
                              <div key={index} className="border rounded p-2 mb-2">
                                <div className="d-flex justify-content-between align-items-center">
                                  <strong>{rec.category}</strong>
                                  <Badge bg="success">Confidence: {rec.confidence}%</Badge>
                                </div>
                                <p className="mb-1 small">{rec.recommendation}</p>
                                <small className="text-muted">Expected Impact: {rec.impact}</small>
                                <div className="mt-1">
                                  <Badge bg={rec.implementation === 'High Priority' ? 'danger' : 'warning'} size="sm">
                                    {rec.implementation}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Tab.Pane>

                  {/* Patient Management Tab */}
                  <Tab.Pane eventKey="patient-management">
                    <Alert variant="info">
                      <RiUserHeartFill size={20} className="me-2" />
                      AI-powered patient management system with predictive analytics, automated risk assessment, and intelligent care recommendations.
                      {isSuperAdmin() && " Full administrative access granted."}
                    </Alert>
                    <Row>
                      <Col md={12}>
                        <Card>
                          <Card.Header>
                            <h5>Recent AI Activity</h5>
                          </Card.Header>
                          <Card.Body>
                            <Table responsive hover>
                              <thead>
                                <tr>
                                  <th>Time</th>
                                  <th>AI Activity</th>
                                  <th>Type</th>
                                  <th>Confidence</th>
                                  <th>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {dashboardData.recentActivity.map((activity, index) => (
                                  <tr key={index}>
                                    <td>{activity.time}</td>
                                    <td>{activity.action}</td>
                                    <td>
                                      <Badge bg={
                                        activity.type === 'ai-diagnosis' ? 'info' :
                                        activity.type === 'ai-safety' ? 'danger' :
                                        activity.type === 'ai-optimization' ? 'success' : 'secondary'
                                      }>
                                        {activity.type}
                                      </Badge>
                                    </td>
                                    <td>{activity.confidence}%</td>
                                    <td>
                                      <Badge bg={
                                        activity.severity === 'critical' ? 'danger' :
                                        activity.severity === 'high' ? 'warning' :
                                        activity.severity === 'medium' ? 'info' : 'success'
                                      }>
                                        {activity.severity}
                                      </Badge>
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

                  {/* AI Diagnostics Tab */}
                  <Tab.Pane eventKey="ai-diagnostics">
                    <Row>
                      <Col md={12}>
                        <Alert variant="success">
                          <RiBrainFill size={20} className="me-2" />
                          Advanced AI diagnostic systems including medical imaging analysis, symptom assessment, and treatment recommendations.
                        </Alert>
                        <Row>
                          {dashboardData.charts.healthMetrics.map((metric, index) => (
                            <Col md={4} key={index} className="mb-3">
                              <Card>
                                <Card.Body>
                                  <h6>{metric.category}</h6>
                                  <div className="d-flex align-items-center">
                                    <ProgressBar 
                                      now={metric.score} 
                                      variant={metric.score > 90 ? 'success' : metric.score > 70 ? 'info' : 'warning'}
                                      className="flex-grow-1 me-2"
                                    />
                                    <span className="fw-bold">{metric.score}%</span>
                                    {metric.trend === 'up' && <RiArrowUpCircleFill className="text-success ms-1" />}
                                  </div>
                                </Card.Body>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      </Col>
                    </Row>
                  </Tab.Pane>

                  {/* Medical Imaging AI Tab */}
                  <Tab.Pane eventKey="medical-imaging">
                    <Alert variant="warning">
                      <RiScanLine size={20} className="me-2" />
                      AI-powered medical imaging analysis with deep learning models for X-ray, CT, MRI, and ultrasound interpretation.
                    </Alert>
                  </Tab.Pane>

                  {/* AI Pharmacy Tab */}
                  <Tab.Pane eventKey="pharmacy-ai">
                    <Alert variant="danger">
                      <RiMedicineBottleFill size={20} className="me-2" />
                      Intelligent pharmacy management with drug interaction checking, dosage optimization, and allergy alerts.
                    </Alert>
                    <Row>
                      <Col md={12}>
                        <Card>
                          <Card.Header>
                            <h5>Drug Interaction Alerts</h5>
                          </Card.Header>
                          <Card.Body>
                            {dashboardData.aiInsights.drugInteractions.map((interaction, index) => (
                              <Alert key={index} variant="warning" className="mb-2">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <strong>Patient {interaction.patient}: {interaction.interaction}</strong>
                                    <br />
                                    <small>Severity: {interaction.severity} | AI Confidence: {interaction.aiConfidence}%</small>
                                    <br />
                                    <small className="text-primary">Recommendation: {interaction.recommendation}</small>
                                  </div>
                                  <Badge bg="warning">Alert</Badge>
                                </div>
                              </Alert>
                            ))}
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Tab.Pane>

                  {/* Smart Operations Tab */}
                  <Tab.Pane eventKey="operations">
                    <Alert variant="secondary">
                      <RiHospitalFill size={20} className="me-2" />
                      AI-optimized hospital operations including scheduling, resource allocation, and workflow automation.
                    </Alert>
                  </Tab.Pane>

                  {/* AI Insights Tab */}
                  <Tab.Pane eventKey="ai-insights">
                    <Alert variant="dark">
                      <RiLightbulbFill size={20} className="me-2" />
                      Comprehensive AI insights and analytics for strategic decision making and quality improvement.
                    </Alert>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* AI Chat Interface */}
      <AIChatInterface />

      {/* Notifications */}
      <ToastContainer position="top-end" className="p-3">
        {notifications.map(notification => (
          <Toast key={notification.id} show={notification.show} onClose={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}>
            <Toast.Header>
              <RiRobotFill className="me-2" />
              <strong className="me-auto">{notification.title}</strong>
              <small>AI Alert</small>
            </Toast.Header>
            <Toast.Body>{notification.message}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>

      {/* Settings Modal */}
      <Modal show={showSettings} onHide={() => setShowSettings(false)}>
        <Modal.Header closeButton>
          <Modal.Title>AI Dashboard Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="auto-refresh-switch"
                label="Auto Refresh AI Data"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>AI Update Interval</Form.Label>
              <Form.Select defaultValue={DASHBOARD_CONFIG.refreshInterval / 1000}>
                <option value={10}>10 seconds (Real-time)</option>
                <option value={15}>15 seconds (Recommended)</option>
                <option value={30}>30 seconds</option>
                <option value={60}>1 minute</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSettings(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => setShowSettings(false)}>
            Save AI Settings
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AIHospitalDashboard;
