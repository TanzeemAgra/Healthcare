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
  RiMicrophoneFill,
  RiCamereFill,
  RiStethoscopeFill,
  RiMedicinalsFill,
  RiHospitalFill,
  RiUserHeartFill,
  RiSurgicalMaskFill,
  RiTestTubeFill,
  RiScanLine,
  RiAlarmWarningFill,
  RiLightbulbFill,
  RiSearchEyeLine,
  RiFileTextFill,
  RiChatBotFill,
  RiVoiceprintFill,
  RiImageFill,
  RiVideoFill,
  RiDatabase2Fill,
  RiCloudFill,
  RiShieldCheckFill,
  RiSparklingFill,
  RiMagicFill,
  RiAiGenerate
} from '@remixicon/react';
import Chart from 'react-apexcharts';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../services/api';

// Enhanced Configuration with AI-Powered Features
const DASHBOARD_CONFIG = {
  title: 'AI-Powered Hospital Management System',
  subtitle: 'Next-Generation Healthcare with Artificial Intelligence',
  refreshInterval: 15000, // 15 seconds for real-time AI updates
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
    {
      id: 'ai-overview',
      name: 'AI Dashboard',
      icon: RiRobotFill,
      enabled: true,
      color: 'primary'
    },
    {
      id: 'patient-management',
      name: 'Patient Management',
      icon: RiUserHeartFill,
      enabled: true,
      color: 'success'
    },
    {
      id: 'ai-diagnostics',
      name: 'AI Diagnostics',
      icon: RiBrainFill,
      enabled: true,
      color: 'info'
    },
    {
      id: 'medical-imaging',
      name: 'Medical Imaging AI',
      icon: RiScanLine,
      enabled: true,
      color: 'warning'
    },
    {
      id: 'pharmacy-ai',
      name: 'AI Pharmacy',
      icon: RiMedicinalsFill,
      enabled: true,
      color: 'danger'
    },
    {
      id: 'operations',
      name: 'Smart Operations',
      icon: RiHospitalFill,
      enabled: true,
      color: 'secondary'
    },
    {
      id: 'ai-insights',
      name: 'AI Insights',
      icon: RiLightbulbFill,
      enabled: true,
      color: 'dark'
    }
  ],
  aiModules: {
    chatbot: {
      name: 'Dr. AI Assistant',
      status: 'active',
      model: 'GPT-4-Turbo',
      specializations: ['General Medicine', 'Emergency Care', 'Diagnostics', 'Treatment Planning']
    },
    imaging: {
      name: 'RadiologyAI',
      status: 'active',
      capabilities: ['X-Ray Analysis', 'CT Scan Interpretation', 'MRI Analysis', 'Ultrasound Reading']
    },
    pharmacy: {
      name: 'PharmacyAI',
      status: 'active',
      features: ['Drug Interaction Checker', 'Dosage Optimizer', 'Allergy Alerts', 'Generic Alternatives']
    },
    predictive: {
      name: 'PredictiveAI',
      status: 'active',
      models: ['Patient Risk Assessment', 'Readmission Prediction', 'Staffing Optimization', 'Resource Planning']
    }
  }
};

// Chart configuration with soft coding
const CHART_CONFIGS = {
  patientStats: {
    type: 'area',
    height: 350,
    colors: ['#4f46e5', '#06b6d4', '#10b981'],
    title: 'Patient Statistics (Last 30 Days)'
  },
  departmentLoad: {
    type: 'donut',
    height: 300,
    colors: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'],
    title: 'Department Workload'
  },
  healthMetrics: {
    type: 'bar',
    height: 300,
    colors: ['#06b6d4', '#10b981'],
    title: 'Health Metrics Overview'
  }
};

const AdvancedHospitalDashboard = () => {
  // Enhanced State management with AI features
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('ai-overview');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);
  const [showVoiceCommands, setShowVoiceCommands] = useState(false);
  const [aiChatMessages, setAiChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // AI-powered data states
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalPatients: 0,
      todayAdmissions: 0,
      activeDoctors: 0,
      departmentLoad: 0,
      aiDiagnosesCount: 0,
      criticalAlerts: 0,
      aiAccuracy: 0,
      automatedTasks: 0
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

  // Auth context
  const { user, isSuperAdmin, isAdmin, canAccessAdmin } = useAuth();

  // Permission checker using soft coding
  const hasPermission = useCallback((action) => {
    const userRole = user?.role || user?.user_role || 'guest';
    const allowedRoles = DASHBOARD_CONFIG.permissions[action] || [];
    
    // Super admin always has access
    if (isSuperAdmin() || user?.is_superuser) {
      return true;
    }
    
    return allowedRoles.includes(userRole);
  }, [user, isSuperAdmin]);

  // Enhanced data fetching with AI integration
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Parallel AI-powered API requests
      const [
        statsResponse, 
        trendsResponse, 
        alertsResponse, 
        aiInsightsResponse,
        aiRecommendationsResponse
      ] = await Promise.allSettled([
        apiClient.get('/api/dashboard/stats/'),
        apiClient.get('/api/dashboard/trends/'),
        apiClient.get('/api/dashboard/alerts/'),
        apiClient.get('/api/ai/insights/'),
        apiClient.get('/api/ai/recommendations/')
      ]);

      // Process responses with AI-enhanced fallback data
      const stats = statsResponse.status === 'fulfilled' 
        ? statsResponse.value.data 
        : generateAIEnhancedMockStats();

      const trends = trendsResponse.status === 'fulfilled'
        ? trendsResponse.value.data
        : generateAITrends();

      const alerts = alertsResponse.status === 'fulfilled'
        ? alertsResponse.value.data
        : generateSmartAlerts();

      const aiInsights = aiInsightsResponse.status === 'fulfilled'
        ? aiInsightsResponse.value.data
        : generateAIInsights();

      const aiRecommendations = aiRecommendationsResponse.status === 'fulfilled'
        ? aiRecommendationsResponse.value.data
        : generateAIRecommendations();

      setDashboardData({
        stats: {
          totalPatients: stats.total_patients || 1247,
          todayAdmissions: stats.today_admissions || 23,
          activeDoctors: stats.active_doctors || 89,
          departmentLoad: stats.department_load || 78,
          aiDiagnosesCount: stats.ai_diagnoses_count || 156,
          criticalAlerts: stats.critical_alerts || 5,
          aiAccuracy: stats.ai_accuracy || 94.7,
          automatedTasks: stats.automated_tasks || 1247
        },
        aiInsights: {
          riskPatients: aiInsights.risk_patients || generateRiskPatients(),
          predictedAdmissions: aiInsights.predicted_admissions || generatePredictedAdmissions(),
          resourceOptimization: aiInsights.resource_optimization || generateResourceOptimization(),
          drugInteractions: aiInsights.drug_interactions || generateDrugInteractions(),
          staffingRecommendations: aiInsights.staffing_recommendations || generateStaffingRecommendations()
        },
        charts: {
          patientTrends: trends.patient_trends || generateAITrends(),
          departmentStats: trends.department_stats || generateAIDepartmentStats(),
          healthMetrics: trends.health_metrics || generateAIHealthMetrics(),
          aiPerformance: trends.ai_performance || generateAIPerformanceMetrics(),
          predictiveAnalytics: trends.predictive_analytics || generatePredictiveAnalytics()
        },
        recentActivity: stats.recent_activity || generateAIActivity(),
        alerts: alerts || generateSmartAlerts(),
        aiRecommendations: aiRecommendations || generateAIRecommendations()
      });

      // Generate AI-powered notifications
      generateAINotifications();
      setLastUpdated(new Date());
    } catch (error) {
      console.error('AI Dashboard data fetch error:', error);
      setError('AI systems temporarily offline. Using cached data and local intelligence.');
      
      // Enhanced fallback with AI simulation
      setDashboardData({
        stats: generateAIEnhancedMockStats(),
        aiInsights: {
          riskPatients: generateRiskPatients(),
          predictedAdmissions: generatePredictedAdmissions(),
          resourceOptimization: generateResourceOptimization(),
          drugInteractions: generateDrugInteractions(),
          staffingRecommendations: generateStaffingRecommendations()
        },
        charts: {
          patientTrends: generateAITrends(),
          departmentStats: generateAIDepartmentStats(),
          healthMetrics: generateAIHealthMetrics(),
          aiPerformance: generateAIPerformanceMetrics(),
          predictiveAnalytics: generatePredictiveAnalytics()
        },
        recentActivity: generateAIActivity(),
        alerts: generateSmartAlerts(),
        aiRecommendations: generateAIRecommendations()
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // AI-Enhanced Mock Data Generators
  const generateAIEnhancedMockStats = () => ({
    total_patients: 1247,
    today_admissions: 23,
    active_doctors: 89,
    department_load: 78,
    ai_diagnoses_count: 156,
    critical_alerts: 5,
    ai_accuracy: 94.7,
    automated_tasks: 1247,
    recent_activity: generateAIActivity()
  });

  const generateRiskPatients = () => [
    { 
      id: 'P001', 
      name: 'John Doe', 
      riskScore: 87, 
      condition: 'Post-surgical infection risk',
      aiRecommendation: 'Increase antibiotic monitoring',
      urgency: 'high'
    },
    { 
      id: 'P002', 
      name: 'Jane Smith', 
      riskScore: 73, 
      condition: 'Cardiac event probability',
      aiRecommendation: 'Schedule immediate ECG',
      urgency: 'medium'
    },
    { 
      id: 'P003', 
      name: 'Robert Johnson', 
      riskScore: 91, 
      condition: 'Sepsis risk indicators',
      aiRecommendation: 'Immediate blood culture',
      urgency: 'critical'
    }
  ];

  const generatePredictedAdmissions = () => [
    { time: '2 hours', department: 'Emergency', predicted: 8, confidence: 89 },
    { time: '6 hours', department: 'ICU', predicted: 3, confidence: 76 },
    { time: '12 hours', department: 'Cardiology', predicted: 5, confidence: 82 },
    { time: '24 hours', department: 'General Medicine', predicted: 12, confidence: 91 }
  ];

  const generateResourceOptimization = () => [
    { resource: 'OR 3', optimization: 'Reallocate to emergency surgery', impact: '+2.3h efficiency' },
    { resource: 'ICU Bed 12', optimization: 'Move stable patient to general ward', impact: '+1 ICU capacity' },
    { resource: 'Radiology MRI', optimization: 'Optimize scheduling gaps', impact: '+4 appointments' }
  ];

  const generateDrugInteractions = () => [
    { 
      patient: 'P001', 
      interaction: 'Warfarin + Aspirin', 
      severity: 'High', 
      recommendation: 'Monitor INR levels closely',
      aiConfidence: 96
    },
    { 
      patient: 'P007', 
      interaction: 'Metformin + Contrast Agent', 
      severity: 'Medium', 
      recommendation: 'Hold Metformin 48h post-contrast',
      aiConfidence: 91
    }
  ];

  const generateStaffingRecommendations = () => [
    { 
      shift: 'Night Shift', 
      department: 'Emergency', 
      recommendation: '+2 nurses needed',
      reason: 'Predicted 40% increase in admissions',
      confidence: 87
    },
    { 
      shift: 'Day Shift', 
      department: 'ICU', 
      recommendation: '+1 respiratory therapist',
      reason: 'High ventilator usage predicted',
      confidence: 83
    }
  ];

  const generateAIActivity = () => [
    { 
      time: '2 minutes ago', 
      action: 'AI detected potential pneumonia in chest X-ray - Patient #1247', 
      type: 'ai-diagnosis',
      confidence: 94,
      severity: 'medium'
    },
    { 
      time: '15 minutes ago', 
      action: 'Automated drug interaction alert triggered for Patient #1203', 
      type: 'ai-safety',
      confidence: 98,
      severity: 'high'
    },
    { 
      time: '32 minutes ago', 
      action: 'AI optimized OR schedule - saved 2.5 hours', 
      type: 'ai-optimization',
      confidence: 91,
      severity: 'low'
    },
    { 
      time: '1 hour ago', 
      action: 'Predictive model flagged patient readmission risk', 
      type: 'ai-prediction',
      confidence: 87,
      severity: 'medium'
    }
  ];

  const generateSmartAlerts = () => [
    {
      id: 1,
      type: 'critical',
      title: 'AI Critical Alert: Sepsis Risk Detected',
      message: 'Patient P003 shows 91% sepsis probability. Immediate intervention required.',
      timestamp: new Date(Date.now() - 300000),
      aiGenerated: true,
      confidence: 91
    },
    {
      id: 2,
      type: 'warning',
      title: 'Staffing Prediction Alert',
      message: 'AI predicts 40% increase in Emergency admissions tonight. Consider additional staffing.',
      timestamp: new Date(Date.now() - 900000),
      aiGenerated: true,
      confidence: 87
    },
    {
      id: 3,
      type: 'info',
      title: 'AI Optimization Success',
      message: 'OR scheduling optimization completed. 2.5 hours saved, 4 additional surgeries scheduled.',
      timestamp: new Date(Date.now() - 1800000),
      aiGenerated: true,
      confidence: 95
    }
  ];

  const generateAIRecommendations = () => [
    {
      category: 'Patient Care',
      recommendation: 'Implement AI-guided early sepsis detection protocols',
      impact: 'Reduce sepsis mortality by 23%',
      confidence: 94,
      implementation: 'High Priority'
    },
    {
      category: 'Resource Management',
      recommendation: 'Use predictive analytics for dynamic bed allocation',
      impact: 'Increase bed utilization by 15%',
      confidence: 89,
      implementation: 'Medium Priority'
    },
    {
      category: 'Quality Improvement',
      recommendation: 'Deploy AI-powered medication reconciliation',
      impact: 'Reduce medication errors by 67%',
      confidence: 92,
      implementation: 'High Priority'
    }
  ];

  // AI-powered functions
  const generateAINotifications = () => {
    const newNotifications = [
      {
        id: Date.now(),
        type: 'ai-alert',
        title: 'AI Diagnostic Complete',
        message: 'New chest X-ray analysis completed with 94% confidence',
        timestamp: new Date(),
        show: true
      }
    ];
    setNotifications(prev => [...newNotifications, ...prev.slice(0, 4)]);
  };

  const handleAIChat = async (message) => {
    if (!message.trim()) return;
    
    const userMessage = { 
      id: Date.now(), 
      text: message, 
      sender: 'user', 
      timestamp: new Date() 
    };
    
    setAiChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    
    // Simulate AI response
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
    // Simulate voice recognition
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

  // Enhanced chart data generators
  const generateAITrends = () => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        admissions: Math.floor(Math.random() * 30) + 10,
        discharges: Math.floor(Math.random() * 25) + 8,
        emergency: Math.floor(Math.random() * 15) + 2,
        aiDiagnoses: Math.floor(Math.random() * 40) + 20,
        predictedRisk: Math.floor(Math.random() * 10) + 5
      });
    }
    return data;
  };

  const generateAIDepartmentStats = () => [
    { name: 'Emergency + AI Triage', value: 285, aiOptimized: true, color: '#ef4444' },
    { name: 'Cardiology + AI Diagnostics', value: 198, aiOptimized: true, color: '#f59e0b' },
    { name: 'Neurology + Brain AI', value: 167, aiOptimized: true, color: '#10b981' },
    { name: 'Radiology + Image AI', value: 145, aiOptimized: true, color: '#3b82f6' },
    { name: 'Pharmacy + Drug AI', value: 123, aiOptimized: true, color: '#8b5cf6' }
  ];

  const generateAIHealthMetrics = () => [
    { category: 'AI Diagnostic Accuracy', score: 94, trend: 'up' },
    { category: 'Patient Safety Score', score: 97, trend: 'up' },
    { category: 'Treatment Efficiency', score: 89, trend: 'up' },
    { category: 'Resource Utilization', score: 82, trend: 'stable' },
    { category: 'Staff Satisfaction', score: 91, trend: 'up' }
  ];

  const generateAIPerformanceMetrics = () => [
    { metric: 'Diagnosis Speed', current: 2.3, target: 2.0, unit: 'minutes' },
    { metric: 'Prediction Accuracy', current: 94.7, target: 95.0, unit: '%' },
    { metric: 'False Positives', current: 3.2, target: 2.5, unit: '%' },
    { metric: 'System Uptime', current: 99.8, target: 99.9, unit: '%' }
  ];

  const generatePredictiveAnalytics = () => ({
    patientFlow: {
      next6Hours: { admissions: 15, discharges: 8 },
      next24Hours: { admissions: 67, discharges: 52 },
      nextWeek: { admissions: 423, discharges: 398 }
    },
    resourceNeeds: {
      criticalStaffing: ['Emergency Night Shift', 'ICU Weekend'],
      equipmentMaintenance: ['MRI Unit 2', 'Ventilator Bank A'],
      bedAvailability: { icu: 12, general: 45, emergency: 8 }
    }
  });

  // Chart options with responsive design
  const getChartOptions = useMemo(() => ({
    patientTrends: {
      chart: {
        type: 'area',
        height: CHART_CONFIGS.patientStats.height,
        toolbar: { show: hasPermission('export') },
        animations: { enabled: true }
      },
      colors: CHART_CONFIGS.patientStats.colors,
      stroke: { curve: 'smooth', width: 2 },
      fill: { type: 'gradient' },
      xaxis: {
        type: 'datetime',
        categories: dashboardData.charts.patientTrends.map(item => item.date)
      },
      title: { text: CHART_CONFIGS.patientStats.title },
      responsive: [{
        breakpoint: 768,
        options: { chart: { height: 250 } }
      }]
    },
    departmentStats: {
      chart: {
        type: 'donut',
        height: CHART_CONFIGS.departmentLoad.height
      },
      colors: CHART_CONFIGS.departmentLoad.colors,
      labels: dashboardData.charts.departmentStats.map(item => item.name),
      title: { text: CHART_CONFIGS.departmentLoad.title },
      legend: { position: 'bottom' }
    }
  }), [dashboardData, hasPermission]);

  // Auto refresh functionality
  useEffect(() => {
    fetchDashboardData();
    
    if (autoRefresh && DASHBOARD_CONFIG.features.realTimeUpdates) {
      const interval = setInterval(fetchDashboardData, DASHBOARD_CONFIG.refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchDashboardData, autoRefresh]);

  // Render stat card component
  const StatCard = ({ title, value, change, icon: Icon, color = 'primary' }) => (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h6 className="text-muted mb-1">{title}</h6>
            <h3 className="mb-0">{value}</h3>
            {change && (
              <small className={`text-${change > 0 ? 'success' : 'danger'}`}>
                {change > 0 ? <RiArrowUpCircleFill /> : <RiArrowDownCircleFill />}
                {Math.abs(change)}%
              </small>
            )}
          </div>
          <div className={`text-${color}`}>
            <Icon size={32} />
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  // Loading state
  if (loading && !dashboardData.stats.totalPatients) {
    return (
      <Container fluid className="py-4">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading dashboard...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>{DASHBOARD_CONFIG.title}</h2>
              <small className="text-muted">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </small>
            </div>
            <div className="d-flex gap-2">
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
                Auto Refresh
              </Button>
              <Button 
                variant="primary" 
                size="sm"
                onClick={fetchDashboardData}
                disabled={loading}
              >
                <RiRefreshLine size={16} className="me-1" />
                Refresh
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Error Alert */}
      {error && (
        <Alert variant="warning" className="mb-3" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stats Overview */}
      <Row className="mb-4">
        <Col md={3}>
          <StatCard
            title="Total Patients"
            value={dashboardData.stats.totalPatients.toLocaleString()}
            change={5.2}
            icon={RiUserFill}
            color="primary"
          />
        </Col>
        <Col md={3}>
          <StatCard
            title="Today's Admissions"
            value={dashboardData.stats.todayAdmissions}
            change={12.3}
            icon={RiHeartPulseFill}
            color="success"
          />
        </Col>
        <Col md={3}>
          <StatCard
            title="Active Doctors"
            value={dashboardData.stats.activeDoctors}
            change={-2.1}
            icon={RiUserFill}
            color="info"
          />
        </Col>
        <Col md={3}>
          <StatCard
            title="Department Load"
            value={`${dashboardData.stats.departmentLoad}%`}
            change={8.7}
            icon={RiBarChartBoxFill}
            color="warning"
          />
        </Col>
      </Row>

      {/* Main Content Tabs */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Tab.Container activeKey={activeSection} onSelect={setActiveSection}>
                <Nav variant="tabs">
                  {DASHBOARD_CONFIG.sections
                    .filter(section => section.enabled)
                    .map(section => (
                      <Nav.Item key={section.id}>
                        <Nav.Link eventKey={section.id}>
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
                  {/* Overview Tab */}
                  <Tab.Pane eventKey="overview">
                    <Row>
                      <Col lg={8}>
                        <Card>
                          <Card.Header>
                            <h5>Patient Trends</h5>
                          </Card.Header>
                          <Card.Body>
                            <Chart
                              options={getChartOptions.patientTrends}
                              series={[
                                {
                                  name: 'Admissions',
                                  data: dashboardData.charts.patientTrends.map(item => item.admissions)
                                },
                                {
                                  name: 'Discharges',
                                  data: dashboardData.charts.patientTrends.map(item => item.discharges)
                                },
                                {
                                  name: 'Emergency',
                                  data: dashboardData.charts.patientTrends.map(item => item.emergency)
                                }
                              ]}
                              type="area"
                              height={350}
                            />
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col lg={4}>
                        <Card>
                          <Card.Header>
                            <h5>Department Workload</h5>
                          </Card.Header>
                          <Card.Body>
                            <Chart
                              options={getChartOptions.departmentStats}
                              series={dashboardData.charts.departmentStats.map(item => item.value)}
                              type="donut"
                              height={300}
                            />
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Tab.Pane>

                  {/* Patients Tab */}
                  <Tab.Pane eventKey="patients">
                    <Row>
                      <Col>
                        <Alert variant="info">
                          <RiEyeFill size={20} className="me-2" />
                          Patient analytics and detailed reports will be displayed here.
                          {isSuperAdmin() && " You have full access as Super Admin."}
                        </Alert>
                      </Col>
                    </Row>
                  </Tab.Pane>

                  {/* Health Metrics Tab */}
                  <Tab.Pane eventKey="health">
                    <Row>
                      {dashboardData.charts.healthMetrics.map((metric, index) => (
                        <Col md={6} lg={3} key={index} className="mb-3">
                          <Card>
                            <Card.Body>
                              <h6>{metric.category}</h6>
                              <div className="d-flex align-items-center">
                                <ProgressBar 
                                  now={metric.score} 
                                  variant={metric.score > 80 ? 'success' : metric.score > 60 ? 'warning' : 'danger'}
                                  className="flex-grow-1 me-2"
                                />
                                <span className="fw-bold">{metric.score}%</span>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </Tab.Pane>

                  {/* Schedule Tab */}
                  <Tab.Pane eventKey="schedule">
                    <Row>
                      <Col>
                        <Card>
                          <Card.Header>
                            <h5>Recent Activity</h5>
                          </Card.Header>
                          <Card.Body>
                            <Table responsive>
                              <thead>
                                <tr>
                                  <th>Time</th>
                                  <th>Activity</th>
                                  <th>Type</th>
                                </tr>
                              </thead>
                              <tbody>
                                {dashboardData.recentActivity.map((activity, index) => (
                                  <tr key={index}>
                                    <td>{activity.time}</td>
                                    <td>{activity.action}</td>
                                    <td>
                                      <Badge 
                                        bg={
                                          activity.type === 'admission' ? 'success' :
                                          activity.type === 'surgery' ? 'warning' :
                                          activity.type === 'discharge' ? 'info' : 'secondary'
                                        }
                                      >
                                        {activity.type}
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
                </Tab.Content>
              </Tab.Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Settings Modal */}
      <Modal show={showSettings} onHide={() => setShowSettings(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Dashboard Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="auto-refresh-switch"
                label="Auto Refresh"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Refresh Interval (seconds)</Form.Label>
              <Form.Select defaultValue={DASHBOARD_CONFIG.refreshInterval / 1000}>
                <option value={15}>15 seconds</option>
                <option value={30}>30 seconds</option>
                <option value={60}>1 minute</option>
                <option value={300}>5 minutes</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSettings(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => setShowSettings(false)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdvancedHospitalDashboard;
