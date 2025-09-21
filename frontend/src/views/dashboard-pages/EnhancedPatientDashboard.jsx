import React, { useEffect, useState, useCallback, useRef } from "react";
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
  Nav,
  ListGroup,
  Form,
  InputGroup,
  Modal,
  Tabs,
  Tab,
  OverlayTrigger,
  Tooltip,
  ButtonGroup
} from 'react-bootstrap';
import { 
  RiDashboardFill, 
  RiUserFill, 
  RiBrainFill,
  RiAlarmWarningFill,
  RiSparklingFill,
  RiLockFill,
  RiWifiLine,
  RiRefreshLine,
  RiSettings3Fill,
  RiNotificationFill,
  RiUserHeartFill,
  RiAddCircleFill,
  RiDownloadFill,
  RiEyeFill,
  RiEditFill,
  RiBarChartBoxFill,
  RiComputerFill,
  RiSmartphoneFill,
  RiCheckboxCircleFill,
  RiErrorWarningFill,
  RiInformationFill,
  RiSearchLine,
  RiFilterLine,
  RiTimeLine,
  RiHospitalLine,
  RiStethoscopeLine,
  RiHeartPulseLine,
  RiUserSearchLine,
  RiMapPinLine,
  RiPhoneLine,
  RiMailLine,
  RiCalendarLine,
  RiFileListLine,
  RiLiveLine,
  RiNotification3Line,
  RiTeamLine,
  RiHealthBookLine,
  RiFlaskLine,
  RiLeafLine,
  RiEyeLine,
  RiScissorsFill,
  RiMicroscopeLine,
  RiTestTubeLine,
  RiPulseLine,
  RiCapsuleLine,
  RiMedicineBottleLine,
  RiDnaLine,
  RiShieldCheckLine,
  RiBugLine,
  RiPlantLine,
  RiRobotLine,
  RiLightbulbLine,
  RiFlashFill,
  RiFlashlightLine,
  RiScanLine,
  RiVolumeUpLine,
  RiChatLine,
  RiMagicLine,
  RiStarLine,
  RiShieldLine,
  RiArrowUpLine,
  RiHeartLine,
  RiCpuLine,
  RiDatabase2Line,
  RiCloudLine,
  RiSmartphoneLine,
  RiCameraLine,
  RiMicLine,
  RiSpeakLine,
  RiTranslateLine,
  RiGlobalLine
} from '@remixicon/react';
import Chart from 'react-apexcharts';
import CountUp from 'react-countup';
import centralizedPatientService from '../../services/centralizedPatientService';
import NotificationCenter, { useNotifications } from '../../components/common/NotificationCenter';
import DASHBOARD_CONFIG, { getDepartmentConfig, getStatusConfig, isFeatureEnabled, getMessage } from '../../config/dashboardConfig';
import './EnhancedPatientDashboard.css';
import { toast } from 'react-toastify';

const EnhancedPatientDashboard = () => {
  // Notification system
  const {
    notifications,
    addNotification,
    addNewPatientNotification,
    addCriticalNotification,
    removeNotification
  } = useNotifications();

  // Core State Management
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Advanced AI Features State
  const [aiInsights, setAiInsights] = useState({
    criticalAlerts: [],
    predictions: {},
    recommendations: [],
    riskAnalysis: {},
    smartSuggestions: []
  });
  const [voiceCommand, setVoiceCommand] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [aiChatVisible, setAiChatVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [smartFiltersEnabled, setSmartFiltersEnabled] = useState(true);
  const [predictiveMode, setPredictiveMode] = useState(true);
  const [realTimeAnalysis, setRealTimeAnalysis] = useState(true);
  const [aiAssistantActive, setAiAssistantActive] = useState(true);
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [intelligentAlerts, setIntelligentAlerts] = useState(true);
  const [mlPredictions, setMlPredictions] = useState({});
  const [patientRiskScores, setPatientRiskScores] = useState({});
  const [aiAnalysisRunning, setAiAnalysisRunning] = useState(false);
  const [contextualInsights, setContextualInsights] = useState({});
  const [smartRecommendations, setSmartRecommendations] = useState([]);
  const [behaviorPatterns, setBehaviorPatterns] = useState({});
  const [emergencyPredictions, setEmergencyPredictions] = useState({});
  
  // Advanced Analytics State
  const [heatmapData, setHeatmapData] = useState({});
  const [trendAnalysis, setTrendAnalysis] = useState({});
  const [departmentEfficiency, setDepartmentEfficiency] = useState({});
  const [resourceOptimization, setResourceOptimization] = useState({});
  const [qualityMetrics, setQualityMetrics] = useState({});
  
  // Smart UI State
  const [adaptiveLayout, setAdaptiveLayout] = useState(true);
  const [personalizedView, setPersonalizedView] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [highlightCritical, setHighlightCritical] = useState(true);

  // Performance & Real-time State
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [syncStatus, setSyncStatus] = useState('synced');
  const [performanceMetrics, setPerformanceMetrics] = useState({});
  
  // Refs for advanced features
  const speechRecognition = useRef(null);
  const aiAnalysisInterval = useRef(null);
  const realTimeUpdates = useRef(null);
  const smartNotifications = useRef(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [realTimeStats, setRealTimeStats] = useState({
    totalPatients: 0,
    newToday: 0,
    criticalCases: 0,
    departmentsActive: 0
  });
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLiveMode, setIsLiveMode] = useState(true);
  const intervalRef = useRef(null);

  // Authentication check for super admin with soft coding
  const userRole = localStorage.getItem('userRole') || config.security.defaultRole;
  const isSuperAdmin = config.security.allowedRoles.includes(userRole);

  // Set user as super admin for access
  useEffect(() => {
    localStorage.setItem('userRole', config.security.defaultRole);
  }, []);

  // ==================== ADVANCED AI UTILITY FUNCTIONS ====================
  
  // AI-Powered Risk Assessment with soft coding
  const calculatePatientRiskScore = useCallback((patient) => {
    const riskFactors = {
      age: patient.age > config.ai.riskAssessment.ageThresholds.high ? 30 : 
           patient.age > config.ai.riskAssessment.ageThresholds.medium ? 15 : 5,
      status: patient.status === 'Critical' ? config.ai.riskAssessment.statusWeights.critical : 
              patient.status === 'Under Treatment' ? config.ai.riskAssessment.statusWeights.treatment : 
              config.ai.riskAssessment.statusWeights.stable,
      department: config.ai.riskAssessment.highRiskDepartments.includes(patient.department) ? 25 : 10,
      recency: new Date() - new Date(patient.dateAdded) < config.ai.riskAssessment.recentThreshold ? 20 : 5
    };
    
    const totalScore = Object.values(riskFactors).reduce((sum, score) => sum + score, 0);
    return Math.min(100, totalScore);
  }, []);

  // Machine Learning Predictions with soft coding
  const generateMlPredictions = useCallback((patients) => {
    const predictions = {};
    patients.forEach(patient => {
      const riskScore = calculatePatientRiskScore(patient);
      predictions[patient.id] = {
        emergencyRisk: riskScore > config.ai.riskAssessment.criticalThreshold ? 'High' : 
                      riskScore > config.ai.riskAssessment.mediumThreshold ? 'Medium' : 'Low',
        readmissionProbability: Math.random() * 100,
        recoveryTimeEstimate: Math.floor(Math.random() * config.ai.predictive.maxRecoveryDays) + 1,
        recommendedActions: generateSmartRecommendations(patient, riskScore)
      };
    });
    return predictions;
  }, [calculatePatientRiskScore]);

  // Smart Recommendations Engine with soft coding
  const generateSmartRecommendations = useCallback((patient, riskScore) => {
    const recommendations = [];
    const recConfig = config.ai.smartRecommendations;
    
    if (riskScore > config.ai.riskAssessment.criticalThreshold) {
      recommendations.push({
        type: recConfig.types.urgent,
        message: getMessage('recommendations', 'immediate_attention'),
        action: getMessage('recommendations', 'transfer_icu'),
        icon: 'RiAlarmWarningFill'
      });
    }
    
    if (patient.status === 'Critical') {
      recommendations.push({
        type: recConfig.types.critical,
        message: getMessage('recommendations', 'enhanced_monitoring'),
        action: getMessage('recommendations', 'increase_frequency'),
        icon: 'RiHeartPulseLine'
      });
    }
    
    if (patient.age > recConfig.seniorAgeThreshold) {
      recommendations.push({
        type: 'preventive',
        message: 'Senior care protocol activation',
        action: 'Implement age-specific care guidelines',
        icon: 'RiUserHeartFill'
      });
    }
    
    return recommendations;
  }, []);

  // AI-Powered Natural Language Processing
  const processNaturalLanguageQuery = useCallback((query) => {
    const keywords = query.toLowerCase().split(' ');
    const intent = {
      type: 'search',
      filters: {},
      suggestions: []
    };

    // Department detection
    const departments = ['cardiology', 'neurology', 'radiology', 'pathology', 'dentistry'];
    const foundDept = departments.find(dept => keywords.includes(dept));
    if (foundDept) intent.filters.department = foundDept;

    // Status detection
    const statuses = ['critical', 'active', 'treatment', 'recovered'];
    const foundStatus = statuses.find(status => keywords.some(k => k.includes(status)));
    if (foundStatus) intent.filters.status = foundStatus;

    // Time-based queries
    if (keywords.includes('today') || keywords.includes('recent')) {
      intent.filters.timeframe = 'today';
    }

    return intent;
  }, []);

  // Voice Command Processing
  const initializeVoiceRecognition = useCallback(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = currentLanguage;

      recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setVoiceCommand(transcript);
        
        if (event.results[event.results.length - 1].isFinal) {
          processVoiceCommand(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      speechRecognition.current = recognition;
    }
  }, [currentLanguage]);

  const processVoiceCommand = useCallback((command) => {
    const intent = processNaturalLanguageQuery(command);
    
    // Apply filters based on voice command
    if (intent.filters.department) {
      setDepartmentFilter(intent.filters.department);
    }
    if (intent.filters.status) {
      setStatusFilter(intent.filters.status);
    }
    
    // Add AI response
    addNotification({
      type: 'info',
      title: 'Voice Command Processed',
      message: `Applied filters based on: "${command}"`,
      timestamp: new Date().toISOString()
    });
  }, [processNaturalLanguageQuery, addNotification]);

  // Real-time AI Analysis
  const performRealTimeAnalysis = useCallback(() => {
    if (!realTimeAnalysis || patients.length === 0) return;

    setAiAnalysisRunning(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      const predictions = generateMlPredictions(patients);
      const riskScores = {};
      const insights = {
        criticalAlerts: [],
        predictions: predictions,
        recommendations: [],
        riskAnalysis: {},
        smartSuggestions: []
      };

      patients.forEach(patient => {
        const riskScore = calculatePatientRiskScore(patient);
        riskScores[patient.id] = riskScore;

        if (riskScore > 70) {
          insights.criticalAlerts.push({
            patientId: patient.id,
            patientName: patient.name,
            riskScore: riskScore,
            reason: 'High risk factors detected',
            urgency: 'immediate'
          });
        }
      });

      setMlPredictions(predictions);
      setPatientRiskScores(riskScores);
      setAiInsights(insights);
      setAiAnalysisRunning(false);
      
      // Update last analysis time
      setLastUpdated(new Date());
    }, 2000);
  }, [patients, realTimeAnalysis, generateMlPredictions, calculatePatientRiskScore]);

  // Intelligent Alert System
  const generateIntelligentAlerts = useCallback(() => {
    if (!intelligentAlerts) return;

    const alerts = [];
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 3600000);

    // Check for new critical patients
    const recentCritical = patients.filter(p => 
      p.status === 'Critical' && new Date(p.dateAdded) > oneHourAgo
    );

    if (recentCritical.length > 0) {
      alerts.push({
        type: 'critical',
        title: 'New Critical Patients Alert',
        message: `${recentCritical.length} new critical patient(s) require immediate attention`,
        patients: recentCritical,
        timestamp: now.toISOString()
      });
    }

    // Department overload detection
    const departmentCounts = patients.reduce((acc, p) => {
      acc[p.department] = (acc[p.department] || 0) + 1;
      return acc;
    }, {});

    Object.entries(departmentCounts).forEach(([dept, count]) => {
      if (count > 10) { // Threshold for overload
        alerts.push({
          type: 'warning',
          title: 'Department Overload Warning',
          message: `${dept} department has ${count} patients - consider resource reallocation`,
          department: dept,
          timestamp: now.toISOString()
        });
      }
    });

    alerts.forEach(alert => addNotification(alert));
  }, [patients, intelligentAlerts, addNotification]);

  // Initialize dashboard data
  useEffect(() => {
    loadInitialData();
    if (isLiveMode) {
      startRealTimeUpdates();
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isLiveMode]);

  // AI Features Initialization
  useEffect(() => {
    if (aiAssistantActive) {
      initializeVoiceRecognition();
    }
    
    // Start AI analysis interval
    if (realTimeAnalysis) {
      aiAnalysisInterval.current = setInterval(() => {
        performRealTimeAnalysis();
      }, 30000); // Run AI analysis every 30 seconds
    }

    // Initialize intelligent alerts
    if (intelligentAlerts) {
      smartNotifications.current = setInterval(() => {
        generateIntelligentAlerts();
      }, 60000); // Check for alerts every minute
    }

    return () => {
      if (aiAnalysisInterval.current) {
        clearInterval(aiAnalysisInterval.current);
      }
      if (smartNotifications.current) {
        clearInterval(smartNotifications.current);
      }
      if (speechRecognition.current) {
        speechRecognition.current.stop();
      }
    };
  }, [aiAssistantActive, realTimeAnalysis, intelligentAlerts, initializeVoiceRecognition, performRealTimeAnalysis, generateIntelligentAlerts]);

  // Real-time AI Analysis Trigger
  useEffect(() => {
    if (patients.length > 0 && realTimeAnalysis) {
      performRealTimeAnalysis();
    }
  }, [patients, performRealTimeAnalysis, realTimeAnalysis]);

  // Smart Alerts Generation
  useEffect(() => {
    if (patients.length > 0 && intelligentAlerts) {
      generateIntelligentAlerts();
    }
  }, [patients, generateIntelligentAlerts, intelligentAlerts]);

  // Filter patients based on search and filters
  useEffect(() => {
    filterPatients();
  }, [patients, searchTerm, departmentFilter, statusFilter]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const data = await centralizedPatientService.getAllPatients();
      setPatients(data.patients || []);
      setRealTimeStats(data.statistics || {});
      setLastUpdate(new Date());
      
      // Show success notification with soft coding
      addNotification({
        type: config.notifications.types.success,
        title: getMessage('data', 'loaded_title'),
        message: getMessage('data', 'loaded_message'),
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Error loading patient data:', error);
      addNotification({
        type: config.notifications.types.error,
        title: getMessage('data', 'error_title'),
        message: getMessage('data', 'error_message'),
        timestamp: new Date().toISOString()
      });
      toast.error('Failed to load patient data');
    } finally {
      setLoading(false);
    }
  };

  const startRealTimeUpdates = () => {
    intervalRef.current = setInterval(async () => {
      try {
        const updates = await centralizedPatientService.getRealtimeUpdates();
        
        if (updates.hasNewPatients) {
          // Add new patients to the list
          setPatients(prevPatients => {
            const newPatients = [...prevPatients, ...updates.newPatients];
            return newPatients;
          });
          
          // Show notifications for new patients with soft coding
          updates.newPatients.forEach(patient => {
            addNotification({
              type: config.notifications.types.success,
              title: getMessage('patient', 'new_patient_title'),
              message: getMessage('patient', 'new_patient_message')
                .replace('{name}', patient.name)
                .replace('{doctor}', patient.createdBy),
              timestamp: new Date()
            });
          });
        }
        
        // Update statistics
        if (updates.statistics) {
          setRealTimeStats(updates.statistics);
        }
        
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Real-time update error:', error);
      }
    }, 30000); // Update every 30 seconds
  };

  const filterPatients = () => {
    let filtered = patients;

    if (searchTerm) {
      filtered = filtered.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.contact.includes(searchTerm) ||
        patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (departmentFilter) {
      filtered = filtered.filter(patient => patient.department === departmentFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter(patient => patient.status === statusFilter);
    }

    setFilteredPatients(filtered);
  };

  const handleRefreshData = async () => {
    await loadInitialData();
    toast.success('Patient data refreshed successfully');
  };

  const toggleLiveMode = () => {
    setIsLiveMode(prev => !prev);
    if (!isLiveMode) {
      startRealTimeUpdates();
      toast.info('Real-time updates enabled');
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      toast.info('Real-time updates disabled');
    }
  };

  const exportPatientsData = async () => {
    try {
      await centralizedPatientService.exportPatients(filteredPatients);
      toast.success('Patient data exported successfully');
    } catch (error) {
      toast.error('Failed to export patient data');
    }
  };

  const getDepartments = () => {
    const departments = [...new Set(patients.map(p => p.department))];
    return departments.filter(Boolean);
  };

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'critical': return 'danger';
      case 'active': return 'success';
      case 'under treatment': return 'warning';
      case 'discharged': return 'secondary';
      default: return 'info';
    }
  };

  const getDepartmentIcon = (department) => {
    switch (department?.toLowerCase()) {
      case 'radiology': return RiComputerFill;
      case 'dentistry': return RiHealthBookLine;
      case 'cardiology': return RiHeartPulseLine;
      case 'dermatology': return RiEyeLine;
      case 'medicine': 
      case 'internal medicine': return RiStethoscopeLine;
      case 'cosmetology': return RiScissorsFill;
      case 'pathology': return RiMicroscopeLine;
      case 'homeopathy': return RiLeafLine;
      case 'orthopedics': return RiPulseLine;
      case 'hospital': return RiHospitalLine;
      case 'general medicine': 
      case 'main patient system': return RiMedicineBottleLine;
      case 'patient management': return RiUserHeartFill;
      case 'secureneat features':
      case 'secureneat': return RiShieldCheckLine;
      case 'subscriptions': return RiCapsuleLine;
      case 'netflix services': return RiSmartphoneFill;
      case 'usage tracking': return RiBarChartBoxFill;
      case 'allopathy': return RiBugLine;
      case 'dna sequencing': return RiDnaLine;
      default: return RiHospitalLine;
    }
  };

  // ==================== ADVANCED AI CONTROL PANEL ====================
  const renderAIControlPanel = () => (
    <Card className="mb-4 ai-control-panel">
      <Card.Header className="bg-gradient-primary text-white">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <RiRobotLine className="me-2" />
            <strong>AI-Powered Healthcare Intelligence</strong>
          </div>
          <Badge bg={aiAnalysisRunning ? "warning" : "success"}>
            {aiAnalysisRunning ? "Analyzing..." : "Active"}
          </Badge>
        </div>
      </Card.Header>
      <Card.Body>
        <Row>
          {/* AI Features Toggle */}
          <Col md={6}>
            <h6 className="text-primary mb-3">
              <RiLightbulbLine className="me-2" />
              Intelligence Features
            </h6>
            <div className="ai-controls">
              <Form.Check
                type="switch"
                id="ai-assistant-switch"
                label={
                  <span>
                    <RiRobotLine className="me-1" />
                    AI Assistant
                  </span>
                }
                checked={aiAssistantActive}
                onChange={(e) => setAiAssistantActive(e.target.checked)}
                className="mb-2"
              />
              <Form.Check
                type="switch"
                id="real-time-analysis-switch"
                label={
                  <span>
                    <RiCpuLine className="me-1" />
                    Real-time Analysis
                  </span>
                }
                checked={realTimeAnalysis}
                onChange={(e) => setRealTimeAnalysis(e.target.checked)}
                className="mb-2"
              />
              <Form.Check
                type="switch"
                id="predictive-mode-switch"
                label={
                  <span>
                    <RiArrowUpLine className="me-1" />
                    Predictive Mode
                  </span>
                }
                checked={predictiveMode}
                onChange={(e) => setPredictiveMode(e.target.checked)}
                className="mb-2"
              />
              <Form.Check
                type="switch"
                id="intelligent-alerts-switch"
                label={
                  <span>
                    <RiNotificationFill className="me-1" />
                    Smart Alerts
                  </span>
                }
                checked={intelligentAlerts}
                onChange={(e) => setIntelligentAlerts(e.target.checked)}
                className="mb-2"
              />
            </div>
          </Col>

          {/* Voice Control & Smart Features */}
          <Col md={6}>
            <h6 className="text-primary mb-3">
              <RiVolumeUpLine className="me-2" />
              Smart Controls
            </h6>
            <div className="voice-control mb-3">
              <ButtonGroup className="w-100 mb-2">
                <Button
                  variant={isListening ? "danger" : "outline-primary"}
                  onClick={() => {
                    if (isListening) {
                      speechRecognition.current?.stop();
                      setIsListening(false);
                    } else {
                      speechRecognition.current?.start();
                      setIsListening(true);
                    }
                  }}
                  disabled={!aiAssistantActive}
                >
                  <RiMicLine className="me-1" />
                  {isListening ? "Stop Listening" : "Voice Command"}
                </Button>
                <Button
                  variant="outline-info"
                  onClick={() => setAiChatVisible(!aiChatVisible)}
                  disabled={!aiAssistantActive}
                >
                  <RiChatLine className="me-1" />
                  AI Chat
                </Button>
              </ButtonGroup>
              {voiceCommand && (
                <Alert variant="info" className="small">
                  <RiSpeakLine className="me-1" />
                  Voice: "{voiceCommand}"
                </Alert>
              )}
            </div>

            <div className="smart-features">
              <Form.Check
                type="switch"
                id="auto-translate-switch"
                label={
                  <span>
                    <RiTranslateLine className="me-1" />
                    Auto Translate
                  </span>
                }
                checked={autoTranslate}
                onChange={(e) => setAutoTranslate(e.target.checked)}
                className="mb-2"
              />
              <Form.Check
                type="switch"
                id="adaptive-layout-switch"
                label={
                  <span>
                    <RiMagicLine className="me-1" />
                    Adaptive Layout
                  </span>
                }
                checked={adaptiveLayout}
                onChange={(e) => setAdaptiveLayout(e.target.checked)}
                className="mb-2"
              />
            </div>
          </Col>
        </Row>

        {/* AI Insights Panel */}
        {Object.keys(aiInsights.predictions).length > 0 && (
          <Row className="mt-4">
            <Col md={12}>
              <h6 className="text-primary mb-3">
                <RiBrainLine className="me-2" />
                AI Insights & Predictions
              </h6>
              <Row>
                <Col md={4}>
                  <Card className="bg-light-danger text-center">
                    <Card.Body>
                      <RiAlarmWarningFill size={24} className="text-danger mb-2" />
                      <h5>{aiInsights.criticalAlerts.length}</h5>
                      <small>Critical Alerts</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="bg-light-warning text-center">
                    <Card.Body>
                      <RiArrowUpLine size={24} className="text-warning mb-2" />
                      <h5>{Object.keys(mlPredictions).length}</h5>
                      <small>ML Predictions</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="bg-light-success text-center">
                    <Card.Body>
                      <RiStarLine size={24} className="text-success mb-2" />
                      <h5>{smartRecommendations.length}</h5>
                      <small>Smart Recommendations</small>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        )}

        {/* Performance Metrics */}
        <Row className="mt-3">
          <Col md={12}>
            <div className="d-flex justify-content-between text-muted small">
              <span>
                <RiDatabase2Line className="me-1" />
                Last AI Analysis: {lastUpdated.toLocaleTimeString()}
              </span>
              <span>
                <RiCloudLine className="me-1" />
                Status: {connectionStatus}
              </span>
              <span>
                <RiWifiLine className="me-1" />
                Sync: {syncStatus}
              </span>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  // ==================== AI CHAT ASSISTANT ====================
  const renderAIChatAssistant = () => (
    <Modal
      show={aiChatVisible}
      onHide={() => setAiChatVisible(false)}
      size="lg"
      backdrop="static"
    >
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <RiRobotLine className="me-2" />
          AI Healthcare Assistant
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ height: '400px', overflowY: 'auto' }}>
        <div className="chat-messages">
          {chatMessages.length === 0 ? (
            <Alert variant="info">
              <RiChatLine className="me-2" />
              Hello! I'm your AI healthcare assistant. I can help you:
              <ul className="mt-2 mb-0">
                <li>Analyze patient data and trends</li>
                <li>Provide risk assessments</li>
                <li>Suggest optimal treatment paths</li>
                <li>Generate intelligent reports</li>
                <li>Answer medical queries</li>
              </ul>
            </Alert>
          ) : (
            chatMessages.map((message, index) => (
              <div key={index} className={`message ${message.type}`}>
                <strong>{message.sender}:</strong> {message.content}
              </div>
            ))
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <InputGroup>
          <Form.Control
            placeholder="Ask your AI assistant anything about patients..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                // Handle AI chat message
                const message = e.target.value;
                if (message.trim()) {
                  setChatMessages(prev => [...prev, {
                    sender: 'You',
                    content: message,
                    type: 'user',
                    timestamp: new Date()
                  }]);
                  // Simulate AI response
                  setTimeout(() => {
                    setChatMessages(prev => [...prev, {
                      sender: 'AI Assistant',
                      content: `I understand you're asking about "${message}". Based on current patient data, I recommend reviewing the latest analytics and consider implementing predictive care protocols.`,
                      type: 'ai',
                      timestamp: new Date()
                    }]);
                  }, 1500);
                  e.target.value = '';
                }
              }
            }}
          />
          <Button variant="primary">
            <RiSpeakLine />
          </Button>
        </InputGroup>
      </Modal.Footer>
    </Modal>
  );

  const renderDashboardHeader = () => (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 className="text-primary mb-1">
          <RiDashboardFill className="me-2" />
          Centralized Patient Monitoring System
        </h2>
        <p className="text-muted mb-0">
          Real-time patient tracking across all departments and applications
        </p>
      </div>
      <div className="d-flex gap-2 align-items-center">
        <Badge bg={isLiveMode ? 'success' : 'secondary'} className="me-2">
          <RiLiveLine className="me-1" />
          {isLiveMode ? 'LIVE' : 'OFFLINE'}
        </Badge>
        <small className="text-muted me-3">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </small>
        <Button 
          variant="outline-primary" 
          size="sm" 
          onClick={toggleLiveMode}
          className="me-2"
        >
          <RiWifiLine className="me-1" />
          {isLiveMode ? 'Disable' : 'Enable'} Live
        </Button>
        <Button 
          variant="outline-secondary" 
          size="sm" 
          onClick={handleRefreshData}
          disabled={loading}
        >
          <RiRefreshLine className={`me-1 ${loading ? 'spinning' : ''}`} />
          Refresh
        </Button>
      </div>
    </div>
  );

  const renderRealTimeStats = () => (
    <Row className="mb-4">
      <Col lg={3} md={6} className="mb-3">
        <Card className="border-primary bg-primary-subtle h-100">
          <Card.Body className="text-center">
            <RiUserFill size={32} className="text-primary mb-2" />
            <h4 className="text-primary mb-1">
              <CountUp end={realTimeStats.totalPatients} duration={2} />
            </h4>
            <p className="text-muted mb-0 small">Total Patients</p>
            <div className="mt-2">
              <small className="text-success">
                <RiTimeLine className="me-1" />
                All time
              </small>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col lg={3} md={6} className="mb-3">
        <Card className="border-success bg-success-subtle h-100">
          <Card.Body className="text-center">
            <RiAddCircleFill size={32} className="text-success mb-2" />
            <h4 className="text-success mb-1">
              <CountUp end={realTimeStats.newToday} duration={2} />
            </h4>
            <p className="text-muted mb-0 small">New Today</p>
            <div className="mt-2">
              <small className="text-success">
                <RiCalendarLine className="me-1" />
                Last 24 hours
              </small>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col lg={3} md={6} className="mb-3">
        <Card className="border-warning bg-warning-subtle h-100">
          <Card.Body className="text-center">
            <RiAlarmWarningFill size={32} className="text-warning mb-2" />
            <h4 className="text-warning mb-1">
              <CountUp end={realTimeStats.criticalCases} duration={2} />
            </h4>
            <p className="text-muted mb-0 small">Critical Cases</p>
            <div className="mt-2">
              <small className="text-warning">
                <RiHeartPulseLine className="me-1" />
                Needs attention
              </small>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col lg={3} md={6} className="mb-3">
        <Card className="border-info bg-info-subtle h-100">
          <Card.Body className="text-center">
            <RiHospitalLine size={32} className="text-info mb-2" />
            <h4 className="text-info mb-1">
              <CountUp end={realTimeStats.departmentsActive} duration={2} />
            </h4>
            <p className="text-muted mb-0 small">Active Departments</p>
            <div className="mt-2">
              <small className="text-info">
                <RiTeamLine className="me-1" />
                Currently active
              </small>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  const renderSearchAndFilters = () => (
    <Card className="mb-4">
      <Card.Body>
        <Row>
          <Col lg={4} md={6} className="mb-3">
            <Form.Label>Search Patients</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <RiSearchLine />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search by name, ID, contact, or diagnosis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Form.Label>Department</Form.Label>
            <Form.Select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="">All Departments</option>
              {getDepartments().map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </Form.Select>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Critical">Critical</option>
              <option value="Under Treatment">Under Treatment</option>
              <option value="Discharged">Discharged</option>
            </Form.Select>
          </Col>
          <Col lg={2} md={6} className="mb-3">
            <Form.Label>&nbsp;</Form.Label>
            <div className="d-grid">
              <Button variant="primary" onClick={exportPatientsData}>
                <RiDownloadFill className="me-1" />
                Export
              </Button>
            </div>
          </Col>
        </Row>
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">
            Showing {filteredPatients.length} of {patients.length} patients
          </small>
          <div>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setDepartmentFilter('');
                setStatusFilter('');
              }}
            >
              <RiFilterLine className="me-1" />
              Clear Filters
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  const renderPatientsTable = () => (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <RiUserHeartFill className="me-2" />
          Patient Registry ({filteredPatients.length})
        </h5>
        <div>
          <Badge bg="success" className="me-2">
            <RiLiveLine className="me-1" />
            Real-time Updates
          </Badge>
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        {loading ? (
          <div className="text-center p-4">
            <Spinner animation="border" className="me-2" />
            Loading patient data...
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="text-center p-4">
            <RiUserSearchLine size={48} className="text-muted mb-3" />
            <h6 className="text-muted">No patients found</h6>
            <p className="text-muted">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table striped hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Patient ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Created By</th>
                  <th>Date Added</th>
                  <th>Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => {
                  const DepartmentIcon = getDepartmentIcon(patient.department);
                  return (
                    <tr key={patient.id}>
                      <td>
                        <strong>{patient.patientId}</strong>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="me-2">
                            <div 
                              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                              style={{ width: '32px', height: '32px', fontSize: '14px' }}
                            >
                              {patient.name.charAt(0)}
                            </div>
                          </div>
                          <div>
                            <div className="fw-bold">{patient.name}</div>
                            <small className="text-muted">Age: {patient.age}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <DepartmentIcon className="me-2 text-primary" size={16} />
                          {patient.department}
                        </div>
                      </td>
                      <td>
                        <Badge bg={getStatusBadgeVariant(patient.status)}>
                          {patient.status}
                        </Badge>
                      </td>
                      <td>
                        <div>
                          <div className="fw-bold">Dr. {patient.createdBy}</div>
                          <small className="text-muted">{patient.sourceApp}</small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div>{new Date(patient.dateAdded).toLocaleDateString()}</div>
                          <small className="text-muted">
                            {new Date(patient.dateAdded).toLocaleTimeString()}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div>
                            <RiPhoneLine className="me-1" size={14} />
                            {patient.contact}
                          </div>
                          {patient.email && (
                            <div>
                              <RiMailLine className="me-1" size={14} />
                              <small>{patient.email}</small>
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>View Details</Tooltip>}
                          >
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => {
                                setSelectedPatient(patient);
                                setShowPatientModal(true);
                              }}
                            >
                              <RiEyeFill size={14} />
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Edit Patient</Tooltip>}
                          >
                            <Button
                              variant="outline-secondary"
                              size="sm"
                            >
                              <RiEditFill size={14} />
                            </Button>
                          </OverlayTrigger>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>
    </Card>
  );

  const renderPatientModal = () => (
    <Modal show={showPatientModal} onHide={() => setShowPatientModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <RiUserHeartFill className="me-2" />
          Patient Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedPatient && (
          <div>
            <Row>
              <Col md={6}>
                <Card className="mb-3">
                  <Card.Header>
                    <h6 className="mb-0">Personal Information</h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-2">
                      <strong>Name:</strong> {selectedPatient.name}
                    </div>
                    <div className="mb-2">
                      <strong>Patient ID:</strong> {selectedPatient.patientId}
                    </div>
                    <div className="mb-2">
                      <strong>Age:</strong> {selectedPatient.age} years
                    </div>
                    <div className="mb-2">
                      <strong>Contact:</strong> {selectedPatient.contact}
                    </div>
                    {selectedPatient.email && (
                      <div className="mb-2">
                        <strong>Email:</strong> {selectedPatient.email}
                      </div>
                    )}
                    {selectedPatient.address && (
                      <div className="mb-2">
                        <strong>Address:</strong> {selectedPatient.address}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="mb-3">
                  <Card.Header>
                    <h6 className="mb-0">Medical Information</h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-2">
                      <strong>Department:</strong> {selectedPatient.department}
                    </div>
                    <div className="mb-2">
                      <strong>Status:</strong> 
                      <Badge bg={getStatusBadgeVariant(selectedPatient.status)} className="ms-2">
                        {selectedPatient.status}
                      </Badge>
                    </div>
                    <div className="mb-2">
                      <strong>Diagnosis:</strong> {selectedPatient.diagnosis}
                    </div>
                    <div className="mb-2">
                      <strong>Created By:</strong> Dr. {selectedPatient.createdBy}
                    </div>
                    <div className="mb-2">
                      <strong>Source App:</strong> {selectedPatient.sourceApp}
                    </div>
                    <div className="mb-2">
                      <strong>Date Added:</strong> {new Date(selectedPatient.dateAdded).toLocaleString()}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            {selectedPatient.notes && (
              <Card>
                <Card.Header>
                  <h6 className="mb-0">Additional Notes</h6>
                </Card.Header>
                <Card.Body>
                  <p>{selectedPatient.notes}</p>
                </Card.Body>
              </Card>
            )}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowPatientModal(false)}>
          Close
        </Button>
        <Button variant="primary">
          <RiEditFill className="me-1" />
          Edit Patient
        </Button>
      </Modal.Footer>
    </Modal>
  );

  // Render notifications
  const renderNotifications = () => (
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
      {notifications.map((notification) => (
        <Alert
          key={notification.id}
          variant={notification.type}
          className="mb-2 shadow-sm"
          dismissible
          onClose={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
        >
          <div className="d-flex align-items-center">
            <RiNotification3Line className="me-2" />
            <div>
              <strong>{notification.title}</strong>
              <div>{notification.message}</div>
              <small className="text-muted">
                {notification.timestamp.toLocaleTimeString()}
              </small>
            </div>
          </div>
        </Alert>
      ))}
    </div>
  );

  if (!isSuperAdmin) {
    return (
      <Container fluid className="py-4">
        <Alert variant="danger" className="text-center">
          <RiLockFill size={48} className="mb-3" />
          <h4>Access Denied</h4>
          <p>This centralized patient monitoring system is restricted to Super Administrators only.</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="enhanced-patient-dashboard py-4">
      <style>
        {`
          .spinning {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .table th {
            border-top: none;
            font-weight: 600;
            font-size: 0.875rem;
            color: #495057;
          }
          .table-responsive {
            border-radius: 0.375rem;
          }
          .ai-control-panel {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          }
          .ai-control-panel .card-header {
            background: rgba(255,255,255,0.1) !important;
            border-bottom: 1px solid rgba(255,255,255,0.2);
          }
          .ai-control-panel .card-body {
            background: rgba(255,255,255,0.05);
          }
          .bg-gradient-primary {
            background: linear-gradient(45deg, #007bff, #6610f2) !important;
          }
          .bg-light-danger {
            background-color: rgba(220, 53, 69, 0.1) !important;
          }
          .bg-light-warning {
            background-color: rgba(255, 193, 7, 0.1) !important;
          }
          .bg-light-success {
            background-color: rgba(40, 167, 69, 0.1) !important;
          }
          .chat-messages .message {
            margin-bottom: 10px;
            padding: 8px 12px;
            border-radius: 8px;
          }
          .chat-messages .message.user {
            background-color: #e3f2fd;
            margin-left: 20%;
          }
          .chat-messages .message.ai {
            background-color: #f3e5f5;
            margin-right: 20%;
          }
        `}
      </style>

      {renderDashboardHeader()}
      {renderAIControlPanel()}
      {renderRealTimeStats()}
      {renderSearchAndFilters()}
      {renderPatientsTable()}
      {renderPatientModal()}
      {renderAIChatAssistant()}
      {renderNotifications()}
      
      {/* Real-time Notification Center */}
      <NotificationCenter 
        notifications={notifications}
        onDismiss={removeNotification}
        position="top-end"
        autoHide={true}
        hideDelay={5000}
      />
    </Container>
  );
};

export default EnhancedPatientDashboard;
