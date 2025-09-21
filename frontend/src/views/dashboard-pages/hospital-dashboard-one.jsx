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
  FaWheelchair, FaHandsHelping, FaStar, FaAward, FaTrophy,
  FaBrain, FaVideo, FaWifi, FaMicroscope, FaDollarSign, FaShieldAlt,
  FaCloud, FaLaptopMedical, FaTemperatureHigh, FaVirus, FaCertificate,
  FaBiohazard, FaAtom, FaChartBar, FaNetworkWired,
  FaMoneyBillWave, FaCogs, FaFileContract, FaFingerprint, FaGlobe,
  FaClipboardCheck, FaCalculator, FaCalendarAlt
} from 'react-icons/fa';
import Chart from 'react-apexcharts';
import advancedPatientAPI from '../../services/advancedPatientAPI';

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
    availableBeds: 45,
    totalBeds: 200,
    staffOnDuty: 127,
    emergencyWaitTime: 15
  });

  // Operations State Management
  const [operationsData, setOperationsData] = useState({
    inventory: {
      pharmacy: [
        { id: 1, name: 'Paracetamol 500mg', stock: 2450, minThreshold: 500, status: 'Good', expiry: '2026-03-15' },
        { id: 2, name: 'Amoxicillin 250mg', stock: 89, minThreshold: 100, status: 'Low', expiry: '2025-12-20' },
        { id: 3, name: 'Morphine 10mg/ml', stock: 45, minThreshold: 50, status: 'Critical', expiry: '2026-01-10' },
        { id: 4, name: 'Insulin Regular', stock: 156, minThreshold: 100, status: 'Good', expiry: '2025-11-30' }
      ],
      equipment: [
        { id: 1, name: 'Ventilators', total: 25, available: 7, inUse: 18, maintenance: 0, status: 'Operational' },
        { id: 2, name: 'Defibrillators', total: 15, available: 12, inUse: 3, maintenance: 0, status: 'Operational' },
        { id: 3, name: 'X-Ray Machines', total: 8, available: 6, inUse: 1, maintenance: 1, status: 'Limited' },
        { id: 4, name: 'CT Scanners', total: 3, available: 2, inUse: 1, maintenance: 0, status: 'Operational' }
      ]
    },
    staffSchedules: [
      { id: 1, name: 'Dr. Sarah Johnson', department: 'Emergency', shift: 'Day', startTime: '08:00', endTime: '20:00', status: 'On Duty' },
      { id: 2, name: 'Dr. Michael Chen', department: 'Cardiology', shift: 'Day', startTime: '09:00', endTime: '17:00', status: 'On Duty' },
      { id: 3, name: 'Nurse Lisa Adams', department: 'ICU', shift: 'Night', startTime: '20:00', endTime: '08:00', status: 'Scheduled' },
      { id: 4, name: 'Dr. Robert Kim', department: 'Surgery', shift: 'On Call', startTime: '00:00', endTime: '23:59', status: 'Available' }
    ],
    emergencyProtocols: [
      { id: 1, code: 'Code Blue', description: 'Cardiac Arrest', responseTime: '< 3 min', lastActivated: '2 hours ago', status: 'Ready' },
      { id: 2, code: 'Code Red', description: 'Fire Emergency', responseTime: '< 5 min', lastActivated: 'Never', status: 'Ready' },
      { id: 3, code: 'Code Gray', description: 'Security Alert', responseTime: '< 2 min', lastActivated: '1 day ago', status: 'Ready' },
      { id: 4, code: 'Code Yellow', description: 'Missing Person', responseTime: '< 10 min', lastActivated: 'Never', status: 'Ready' }
    ],
    operatingRooms: [
      { id: 1, room: 'OR-1', status: 'In Use', surgeon: 'Dr. Michael Chen', procedure: 'Cardiac Bypass', startTime: '10:00', estimatedEnd: '14:00', progress: 75 },
      { id: 2, room: 'OR-2', status: 'Available', surgeon: '', procedure: '', startTime: '', estimatedEnd: '', progress: 0 },
      { id: 3, room: 'OR-3', status: 'Cleaning', surgeon: '', procedure: 'Cleaning in progress', startTime: '13:30', estimatedEnd: '14:00', progress: 60 },
      { id: 4, room: 'OR-4', status: 'Scheduled', surgeon: 'Dr. Sarah Wilson', procedure: 'Appendectomy', startTime: '15:00', estimatedEnd: '16:30', progress: 0 }
    ]
  });

  const [operationsTab, setOperationsTab] = useState('inventory');

  // Advanced Feature States
  const [aiDiagnostics] = useState({
    activeScans: [
      { id: 1, patient: 'John Smith', type: 'CT Scan Analysis', status: 'Processing', confidence: 94, timeRemaining: '2 min' },
      { id: 2, patient: 'Maria Garcia', type: 'X-Ray Analysis', status: 'Complete', confidence: 98, findings: 'Normal' },
      { id: 3, patient: 'Robert Brown', type: 'Blood Test Analysis', status: 'Processing', confidence: 87, timeRemaining: '5 min' }
    ],
    diagnosticModels: [
      { name: 'Chest X-Ray AI', accuracy: 96.5, status: 'Active', version: 'v2.3.1' },
      { name: 'CT Scan Analyzer', accuracy: 94.2, status: 'Active', version: 'v1.8.4' },
      { name: 'Blood Work AI', accuracy: 92.8, status: 'Training', version: 'v3.1.0' },
      { name: 'ECG Analysis', accuracy: 98.1, status: 'Active', version: 'v2.7.2' }
    ]
  });

  const [telemedicine] = useState({
    activeConsultations: [
      { id: 1, doctor: 'Dr. Sarah Johnson', patient: 'Alice Johnson', specialty: 'Cardiology', duration: '15 min', status: 'In Progress' },
      { id: 2, doctor: 'Dr. Michael Chen', patient: 'Bob Wilson', specialty: 'Dermatology', duration: '8 min', status: 'Waiting' }
    ],
    todayStats: {
      totalConsultations: 47,
      avgDuration: 18,
      patientSatisfaction: 4.8,
      techIssues: 2
    },
    upcomingAppointments: [
      { time: '14:30', doctor: 'Dr. Emily Davis', patient: 'Carol Martinez', type: 'Follow-up' },
      { time: '15:00', doctor: 'Dr. James Wilson', patient: 'David Lee', type: 'Consultation' },
      { time: '15:30', doctor: 'Dr. Sarah Johnson', patient: 'Eva Thompson', type: 'Second Opinion' }
    ]
  });

  const [iotDevices] = useState({
    connectedDevices: [
      { id: 1, name: 'Smart Bed Sensors', location: 'ICU-1', status: 'Online', battery: 89, lastUpdate: '2 min ago' },
      { id: 2, name: 'Environmental Monitors', location: 'OR-2', status: 'Online', battery: 76, lastUpdate: '1 min ago' },
      { id: 3, name: 'Medication Dispensers', location: 'Pharmacy', status: 'Offline', battery: 12, lastUpdate: '45 min ago' },
      { id: 4, name: 'Patient Wearables', location: 'Ward-A', status: 'Online', battery: 95, lastUpdate: '30 sec ago' },
      { id: 5, name: 'Vital Sign Monitors', location: 'Emergency', status: 'Online', battery: 82, lastUpdate: '1 min ago' },
      { id: 6, name: 'Infusion Pumps', location: 'ICU-2', status: 'Online', battery: 91, lastUpdate: '3 min ago' }
    ],
    alerts: [
      { device: 'Medication Dispenser #3', message: 'Low battery warning', priority: 'High', timestamp: '5 min ago' },
      { device: 'Environmental Monitor', message: 'Temperature sensor calibration needed', priority: 'Medium', timestamp: '15 min ago' },
      { device: 'Patient Wearable #12', message: 'Connection intermittent', priority: 'Low', timestamp: '25 min ago' }
    ],
    totalDevices: 127,
    onlineDevices: 124,
    offlineDevices: 3
  });

  const [financialData] = useState({
    revenue: {
      daily: 145000,
      monthly: 3200000,
      quarterly: 9800000,
      growth: 12.5
    },
    revenueBreakdown: [
      { category: 'Patient Services', amount: 2100000, percentage: 65 },
      { category: 'Emergency Services', amount: 650000, percentage: 20 },
      { category: 'Surgical Procedures', amount: 320000, percentage: 10 },
      { category: 'Diagnostic Services', amount: 130000, percentage: 5 }
    ],
    expenses: [
      { category: 'Staff Salaries', amount: 1200000, percentage: 45 },
      { category: 'Medical Equipment', amount: 450000, percentage: 17 },
      { category: 'Utilities & Maintenance', amount: 320000, percentage: 12 },
      { category: 'Medical Supplies', amount: 280000, percentage: 11 },
      { category: 'Technology & IT', amount: 180000, percentage: 7 },
      { category: 'Other Expenses', amount: 220000, percentage: 8 }
    ],
    profitability: {
      margin: 18.5,
      trend: 'increasing'
    }
  });

  const [qualityMetrics] = useState({
    patientSafety: { score: 94, trend: 'up', incidents: 2 },
    clinicalQuality: { score: 91, trend: 'stable', protocols: 98 },
    patientExperience: { score: 88, trend: 'up', satisfaction: 4.4 },
    compliance: { score: 96, trend: 'up', audits: 12 },
    auditResults: [
      { area: 'Patient Safety', status: 'Passed', date: '2024-08-15', findings: 'All protocols followed correctly' },
      { area: 'Infection Control', status: 'Passed', date: '2024-08-10', findings: 'Hygiene standards maintained' },
      { area: 'Medication Management', status: 'Review Required', date: '2024-08-05', findings: 'Minor documentation gaps found' },
      { area: 'Emergency Procedures', status: 'Passed', date: '2024-07-28', findings: 'Response times within acceptable limits' }
    ],
    complianceAlerts: [
      { type: 'Documentation Update', description: 'New HIPAA compliance guidelines require review', severity: 'Medium', dueDate: '2024-08-30' },
      { type: 'Training Required', description: 'Annual safety training due for 15 staff members', severity: 'High', dueDate: '2024-08-25' },
      { type: 'Equipment Certification', description: 'MRI machine annual certification renewal', severity: 'Medium', dueDate: '2024-09-05' }
    ]
  });

  const [researchData] = useState({
    activeTrials: [
      { id: 1, name: 'COVID-19 Vaccine Efficacy Study', participants: 150, phase: 'III', status: 'Active', progress: 75 },
      { id: 2, name: 'Cardiac Rehabilitation Protocol', participants: 89, phase: 'II', status: 'Active', progress: 60 },
      { id: 3, name: 'AI-Assisted Surgery Study', participants: 45, phase: 'I', status: 'Complete', progress: 100 },
      { id: 4, name: 'Telemedicine Effectiveness Study', participants: 120, phase: 'II', status: 'Recruiting', progress: 25 }
    ],
    upcomingMilestones: [
      { title: 'Phase III Trial Results', description: 'Final analysis of COVID-19 vaccine trial', priority: 'High', dueDate: '2024-09-15' },
      { title: 'Research Publication', description: 'Submit cardiac rehabilitation findings to journal', priority: 'Medium', dueDate: '2024-08-30' },
      { title: 'Grant Application', description: 'Submit NIH funding proposal for AI surgery research', priority: 'High', dueDate: '2024-09-01' },
      { title: 'Ethics Review', description: 'Annual review of all active research protocols', priority: 'Medium', dueDate: '2024-09-10' }
    ],
    publications: 23,
    grants: 8,
    totalFunding: 2.8
  });

  const [additionalStats] = useState({
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
      status: 'waiting',
      patientId: 'PT001',
      admissionDate: '2025-08-22',
      roomNumber: null,
      insurance: 'Blue Cross',
      emergencyContact: '+1-555-0123'
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
      status: 'in-consultation',
      patientId: 'PT002',
      admissionDate: '2025-08-22',
      roomNumber: 'C-204',
      insurance: 'Aetna',
      emergencyContact: '+1-555-0124'
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
      status: 'waiting',
      patientId: 'PT003',
      admissionDate: '2025-08-21',
      roomNumber: 'O-105',
      insurance: 'Medicare',
      emergencyContact: '+1-555-0125'
    },
    {
      id: 4,
      name: 'Lisa Wilson',
      age: 28,
      priority: 'high',
      department: 'Obstetrics',
      waitTime: '5 min',
      condition: 'Labor & Delivery',
      assignedDoctor: 'Dr. Emma Thompson',
      status: 'admitted',
      patientId: 'PT004',
      admissionDate: '2025-08-22',
      roomNumber: 'OB-301',
      insurance: 'United Health',
      emergencyContact: '+1-555-0126'
    },
    {
      id: 5,
      name: 'James Miller',
      age: 55,
      priority: 'medium',
      department: 'Surgery',
      waitTime: '120 min',
      condition: 'Appendectomy',
      assignedDoctor: 'Dr. Mark Davis',
      status: 'pre-surgery',
      patientId: 'PT005',
      admissionDate: '2025-08-22',
      roomNumber: 'S-402',
      insurance: 'Cigna',
      emergencyContact: '+1-555-0127'
    }
  ]);

  // Enhanced patient management state
  const [selectedPatientData, setSelectedPatientData] = useState(null);
  const [patientJourney, setPatientJourney] = useState([]);
  const [aiInsights, setAiInsights] = useState({});
  const [patientReports, setPatientReports] = useState([]);
  const [activePatientTab, setActivePatientTab] = useState('overview');

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

  // Enhanced utility functions for patient management
  const showNotification = (message, variant = 'success') => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Operations Management Functions
  const handleEmergencyCode = (codeType) => {
    setLoading(true);
    showNotification(`${codeType} activated! Emergency response team notified.`, 'warning');
    
    // Update emergency protocols last activated time
    setOperationsData(prev => ({
      ...prev,
      emergencyProtocols: prev.emergencyProtocols.map(protocol => 
        protocol.code === codeType 
          ? { ...protocol, lastActivated: 'Just now' }
          : protocol
      )
    }));
    
    setTimeout(() => setLoading(false), 2000);
  };

  const updateInventoryStatus = (type, itemId, newStock) => {
    setOperationsData(prev => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        [type]: prev.inventory[type].map(item => {
          if (item.id === itemId) {
            const updatedItem = { ...item, stock: newStock };
            if (type === 'pharmacy') {
              updatedItem.status = newStock > item.minThreshold ? 'Good' : 
                                  newStock > item.minThreshold * 0.5 ? 'Low' : 'Critical';
            }
            return updatedItem;
          }
          return item;
        })
      }
    }));
    showNotification(`${type === 'pharmacy' ? 'Medication' : 'Equipment'} inventory updated successfully!`);
  };

  const updateStaffSchedule = (staffId, newStatus) => {
    setOperationsData(prev => ({
      ...prev,
      staffSchedules: prev.staffSchedules.map(staff => 
        staff.id === staffId ? { ...staff, status: newStatus } : staff
      )
    }));
    showNotification('Staff schedule updated successfully!');
  };

  const updateOperatingRoom = (roomId, updates) => {
    setOperationsData(prev => ({
      ...prev,
      operatingRooms: prev.operatingRooms.map(room => 
        room.id === roomId ? { ...room, ...updates } : room
      )
    }));
    showNotification('Operating room status updated!');
  };

  const handleModalOpen = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setShowModal(true);
    
    // Load comprehensive patient data for detailed view
    if (type === 'patientDetails' && item) {
      loadPatientJourney(item.id);
      generateAIInsights(item);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedItem(null);
    setModalType('');
    setSelectedPatientData(null);
    setPatientJourney([]);
    setAiInsights({});
  };

  // Utility function for showing toast messages
  const showToastMessage = (message, variant = 'success') => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Advanced Patient Journey Tracking
  const loadPatientJourney = async (patientId) => {
    try {
      setLoading(true);
      
      // Find the patient's admission ID (in real implementation, this would be passed properly)
      const patient = patientQueue.find(p => p.id === patientId);
      if (!patient || !patient.patientId) {
        throw new Error('Patient admission ID not found');
      }

      // Load patient journey from API
      const journeyResponse = await advancedPatientAPI.getPatientJourney(patient.patientId);
      
      if (journeyResponse && journeyResponse.timeline) {
        setPatientJourney(journeyResponse.timeline);
      } else {
        // Fallback to mock data if API fails
        setPatientJourney([
          {
            id: 1,
            timestamp: '2025-08-22 09:00:00',
            stage: 'admission',
            location: 'Registration Desk',
            action: 'Patient Registration',
            staff: 'Nurse Jane Adams',
            details: 'Initial registration and insurance verification completed',
            vitals: null,
            notes: 'Patient arrived via ambulance, conscious and responsive'
          },
          {
            id: 2,
            timestamp: '2025-08-22 09:15:00',
            stage: 'triage',
            location: 'Triage Area',
            action: 'Initial Assessment',
            staff: 'Nurse Patricia Wilson',
            details: 'Vital signs recorded, priority level assigned',
            vitals: {
              bloodPressure: '140/90',
              heartRate: 95,
          temperature: 98.6,
          oxygenSat: 96
        },
        notes: 'Chest pain scale 7/10, ECG recommended'
      },
      {
        id: 3,
        timestamp: '2025-08-22 09:30:00',
        stage: 'diagnosis',
        location: 'Emergency Room 3',
        action: 'Doctor Consultation',
        staff: 'Dr. Michael Chen',
        details: 'Initial examination and diagnostic orders',
        vitals: null,
        notes: 'Ordered ECG, chest X-ray, and cardiac enzymes'
      },
      {
        id: 4,
        timestamp: '2025-08-22 10:00:00',
        stage: 'testing',
        location: 'Radiology',
        action: 'Diagnostic Tests',
        staff: 'Tech Robert Kim',
        details: 'ECG and chest X-ray completed',
        vitals: null,
        notes: 'ECG shows slight irregularity, X-ray normal'
      },
      {
        id: 5,
        timestamp: '2025-08-22 10:45:00',
        stage: 'treatment',
        location: 'Emergency Room 3',
        action: 'Treatment Plan',
        staff: 'Dr. Michael Chen',
        details: 'Treatment plan developed based on initial assessment',
        vitals: {
          bloodPressure: '128/82',
          heartRate: 76,
          temperature: 98.6,
          oxygenSat: 97
        },
        notes: 'Patient comfortable, responding well to treatment'
      },
          {
            id: 6,
            timestamp: '2025-08-22 11:30:00',
            stage: 'treatment',
            location: 'Emergency Room',
            action: 'Treatment Initiated',
            staff: 'Dr. Michael Chen',
            details: 'Treatment initiated based on test results',
            vitals: {
              bloodPressure: '135/85',
              heartRate: 88,
              temperature: 98.4,
              oxygenSat: 98
            },
            notes: 'Started on cardiac monitoring, pain management'
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading patient journey:', error);
      showToastMessage('Failed to load patient journey', 'error');
      // Set empty journey data on error
      setPatientJourney([]);
    } finally {
      setLoading(false);
    }
  };

  // AI-Powered Insights Generation
  const generateAIInsights = async (patient) => {
    try {
      setLoading(true);
      
      // Find the patient's admission ID
      if (!patient.patientId) {
        throw new Error('Patient admission ID not found');
      }

      // Generate AI insights via API
      const insightsResponse = await advancedPatientAPI.getAIInsights(patient.patientId);
      
      if (insightsResponse && insightsResponse.insights) {
        setAiInsights({
          riskAssessment: insightsResponse.insights.find(i => i.type === 'Risk Assessment') || {},
          predictiveAnalytics: insightsResponse.insights.find(i => i.type === 'Length of Stay Prediction') || {},
          recommendations: insightsResponse.insights.flatMap(i => i.recommendations || [])
        });
      } else {
        // Fallback to mock insights if API fails
        const insights = {
          riskAssessment: {
            level: patient.priority === 'high' ? 'High' : patient.priority === 'medium' ? 'Medium' : 'Low',
            factors: [
              'Age: 45 years (moderate risk factor)',
              'Presenting complaint: Chest pain (high risk)',
              'Vital signs: Elevated blood pressure',
              'Medical history: No significant cardiac history'
            ],
            recommendation: 'Continue cardiac monitoring, consider cardiology consult'
          },
          predictiveAnalytics: {
            estimatedLOS: patient.department === 'Emergency' ? '6-12 hours' : '2-3 days',
            dischargeReadiness: '75%',
            complications: 'Low risk (15%)',
        resources: ['Cardiac monitor', 'IV access', 'Pain management']
      },
      treatmentSuggestions: [
        'Serial cardiac enzymes every 6 hours',
        'Continuous cardiac monitoring',
        'Pain assessment q2h',
        'Consider stress test if enzymes negative'
      ],
      costAnalysis: {
        estimatedCost: '$2,400 - $4,800',
        insuranceCoverage: '80%',
        patientResponsibility: '$480 - $960'
      }
    };
    setAiInsights(insights);
      }
    } catch (error) {
      console.error('Failed to generate AI insights:', error);
      showNotification('Failed to generate AI insights. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Generate comprehensive patient report
  const generatePatientReport = (patient) => {
    const report = {
      id: Date.now(),
      patientId: patient.patientId,
      patientName: patient.name,
      generatedAt: new Date().toISOString(),
      reportType: 'comprehensive',
      sections: {
        demographics: {
          name: patient.name,
          age: patient.age,
          patientId: patient.patientId,
          insurance: patient.insurance,
          emergencyContact: patient.emergencyContact
        },
        admission: {
          admissionDate: patient.admissionDate,
          department: patient.department,
          assignedDoctor: patient.assignedDoctor,
          roomNumber: patient.roomNumber,
          chiefComplaint: patient.condition
        },
        clinicalData: {
          vitalSigns: patientJourney.filter(j => j.vitals).map(j => j.vitals),
          diagnosticTests: ['ECG', 'Chest X-ray', 'Cardiac enzymes'],
          medications: ['Aspirin 81mg', 'Nitroglycerin PRN'],
          procedures: ['Continuous cardiac monitoring']
        },
        aiAnalysis: aiInsights,
        timeline: patientJourney
      }
    };
    
    setPatientReports([...patientReports, report]);
    showNotification('Comprehensive patient report generated successfully!');
    return report;
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
                Advanced Hospital Management System
              </h2>
              <p className="text-muted mb-0">Comprehensive healthcare management system with real-time updates</p>
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
          <Nav.Item>
            <Nav.Link eventKey="ai-diagnostics">
              <FaBrain className="me-2" />
              AI Diagnostics
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="telemedicine">
              <FaVideo className="me-2" />
              Telemedicine
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="iot-devices">
              <FaWifi className="me-2" />
              IoT Devices
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="financial">
              <FaDollarSign className="me-2" />
              Financial
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="quality">
              <FaShieldAlt className="me-2" />
              Quality
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="research">
              <FaMicroscope className="me-2" />
              Research
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
            {/* Patient Management Header */}
            <Row className="mb-4">
              <Col>
                <Card className="border-0 shadow-sm bg-gradient" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                  <Card.Body className="text-white">
                    <Row className="align-items-center">
                      <Col md={8}>
                        <h4 className="mb-2">
                          <FaUsers className="me-2" />
                          Advanced Patient Management System
                        </h4>
                        <p className="mb-0 opacity-75">Complete patient journey tracking from admission to discharge with AI-powered insights</p>
                      </Col>
                      <Col md={4} className="text-end">
                        <Button variant="light" size="lg" onClick={() => handleModalOpen('newPatient')}>
                          <FaPlus className="me-2" />
                          Admit New Patient
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Patient Statistics Dashboard */}
            <Row className="mb-4">
              <Col md={3}>
                <Card className="border-0 shadow-sm text-center h-100">
                  <Card.Body>
                    <FaUsers className="text-primary mb-2" style={{fontSize: '2rem'}} />
                    <h3 className="text-primary">{patientQueue.length}</h3>
                    <p className="text-muted mb-0">Active Patients</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="border-0 shadow-sm text-center h-100">
                  <Card.Body>
                    <FaBed className="text-success mb-2" style={{fontSize: '2rem'}} />
                    <h3 className="text-success">{patientQueue.filter(p => p.status === 'admitted').length}</h3>
                    <p className="text-muted mb-0">Admitted Today</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="border-0 shadow-sm text-center h-100">
                  <Card.Body>
                    <FaAmbulance className="text-warning mb-2" style={{fontSize: '2rem'}} />
                    <h3 className="text-warning">{patientQueue.filter(p => p.priority === 'high').length}</h3>
                    <p className="text-muted mb-0">Critical Cases</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="border-0 shadow-sm text-center h-100">
                  <Card.Body>
                    <FaRobot className="text-info mb-2" style={{fontSize: '2rem'}} />
                    <h3 className="text-info">94%</h3>
                    <p className="text-muted mb-0">AI Accuracy</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Patient Management Tools */}
            <Row className="mb-4">
              <Col>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-transparent border-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">
                        <FaClipboardList className="me-2" />
                        Patient Registry & Tracking
                      </h5>
                      <div className="d-flex gap-2">
                        <InputGroup style={{ width: '300px' }}>
                          <InputGroup.Text>
                            <FaSearch />
                          </InputGroup.Text>
                          <Form.Control
                            placeholder="Search by name, ID, or condition..."
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
                            <Dropdown.Divider />
                            <Dropdown.Header>By Priority</Dropdown.Header>
                            <Dropdown.Item onClick={() => setFilterCriteria('high')}>High Priority</Dropdown.Item>
                            <Dropdown.Item onClick={() => setFilterCriteria('medium')}>Medium Priority</Dropdown.Item>
                            <Dropdown.Item onClick={() => setFilterCriteria('low')}>Low Priority</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Header>By Status</Dropdown.Header>
                            <Dropdown.Item onClick={() => setFilterCriteria('waiting')}>Waiting</Dropdown.Item>
                            <Dropdown.Item onClick={() => setFilterCriteria('in-consultation')}>In Consultation</Dropdown.Item>
                            <Dropdown.Item onClick={() => setFilterCriteria('admitted')}>Admitted</Dropdown.Item>
                            <Dropdown.Item onClick={() => setFilterCriteria('pre-surgery')}>Pre-Surgery</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                        <Button variant="success" onClick={() => {
                          const report = generatePatientReport(patientQueue[0]);
                          console.log('Generated report:', report);
                        }}>
                          <FaDownload className="me-1" />
                          Export Reports
                        </Button>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <Table responsive hover className="mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Patient Info</th>
                          <th>Department</th>
                          <th>Status & Priority</th>
                          <th>Assigned Doctor</th>
                          <th>Room/Location</th>
                          <th>Duration</th>
                          <th>AI Risk Score</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {patientQueue
                          .filter(patient => 
                            filterCriteria === 'all' || 
                            patient.priority === filterCriteria ||
                            patient.status === filterCriteria
                          )
                          .filter(patient =>
                            patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            patient.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            patient.patientId.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map(patient => (
                            <tr key={patient.id}>
                              <td>
                                <div>
                                  <strong>{patient.name}</strong>
                                  <div className="small text-muted">
                                    ID: {patient.patientId} • Age: {patient.age}
                                  </div>
                                  <div className="small text-primary">
                                    {patient.condition}
                                  </div>
                                </div>
                              </td>
                              <td>
                                <Badge bg="secondary" className="mb-1 d-block">
                                  {patient.department}
                                </Badge>
                                <small className="text-muted">
                                  Admitted: {patient.admissionDate}
                                </small>
                              </td>
                              <td>
                                <div className="d-flex flex-column gap-1">
                                  <Badge bg={getPriorityColor(patient.priority)}>
                                    {patient.priority.toUpperCase()} PRIORITY
                                  </Badge>
                                  <Badge bg={
                                    patient.status === 'admitted' ? 'success' : 
                                    patient.status === 'in-consultation' ? 'info' :
                                    patient.status === 'pre-surgery' ? 'warning' : 'secondary'
                                  }>
                                    {patient.status.replace('-', ' ').toUpperCase()}
                                  </Badge>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <strong>{patient.assignedDoctor}</strong>
                                  <div className="small text-muted">
                                    <FaClock className="me-1" />
                                    {patient.waitTime}
                                  </div>
                                </div>
                              </td>
                              <td>
                                {patient.roomNumber ? (
                                  <div>
                                    <Badge bg="info">{patient.roomNumber}</Badge>
                                    <div className="small text-muted">Room assigned</div>
                                  </div>
                                ) : (
                                  <div className="text-muted">
                                    <small>Awaiting room</small>
                                  </div>
                                )}
                              </td>
                              <td>
                                <div className="text-center">
                                  <div className="fw-bold">
                                    {Math.floor((new Date() - new Date(patient.admissionDate + 'T09:00:00')) / (1000 * 60 * 60))}h
                                  </div>
                                  <small className="text-muted">in hospital</small>
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  <div className={`fw-bold ${
                                    patient.priority === 'high' ? 'text-danger' :
                                    patient.priority === 'medium' ? 'text-warning' : 'text-success'
                                  }`}>
                                    {patient.priority === 'high' ? '8.5' : 
                                     patient.priority === 'medium' ? '5.2' : '2.1'}
                                  </div>
                                  <small className="text-muted">AI Score</small>
                                </div>
                              </td>
                              <td>
                                <div className="d-flex gap-1">
                                  <Button 
                                    size="sm" 
                                    variant="outline-primary" 
                                    onClick={() => handleModalOpen('patientJourney', patient)}
                                    title="View Patient Journey"
                                  >
                                    <FaEye />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline-success" 
                                    onClick={() => handleModalOpen('editPatient', patient)}
                                    title="Edit Patient"
                                  >
                                    <FaEdit />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline-info" 
                                    onClick={() => {
                                      generatePatientReport(patient);
                                    }}
                                    title="Generate Report"
                                  >
                                    <FaDownload />
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

            {/* Patient Analytics Dashboard */}
            <Row>
              <Col lg={6} className="mb-4">
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-transparent border-0">
                    <h6 className="mb-0">
                      <FaChartLine className="me-2" />
                      Patient Flow Analytics
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="row g-3">
                      <div className="col-6">
                        <div className="text-center p-3 bg-light rounded">
                          <h4 className="text-primary">12.5</h4>
                          <small>Avg Wait Time (min)</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="text-center p-3 bg-light rounded">
                          <h4 className="text-success">2.3</h4>
                          <small>Avg Length of Stay (days)</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="text-center p-3 bg-light rounded">
                          <h4 className="text-warning">15%</h4>
                          <small>Readmission Rate</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="text-center p-3 bg-light rounded">
                          <h4 className="text-info">94%</h4>
                          <small>Patient Satisfaction</small>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={6} className="mb-4">
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-transparent border-0">
                    <h6 className="mb-0">
                      <FaRobot className="me-2" />
                      AI-Powered Recommendations
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <ListGroup variant="flush">
                      <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                        <div>
                          <strong>Optimize Emergency Triage</strong>
                          <div className="small text-muted">Reduce wait times by 25%</div>
                        </div>
                        <Badge bg="success">High Impact</Badge>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                        <div>
                          <strong>Bed Management Alert</strong>
                          <div className="small text-muted">ICU capacity at 85%</div>
                        </div>
                        <Badge bg="warning">Medium</Badge>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                        <div>
                          <strong>Discharge Planning</strong>
                          <div className="small text-muted">3 patients ready for discharge</div>
                        </div>
                        <Badge bg="info">Action Required</Badge>
                      </ListGroup.Item>
                    </ListGroup>
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
            {/* Operations Navigation */}
            <Row className="mb-4">
              <Col>
                <Nav variant="pills" className="justify-content-center">
                  <Nav.Item>
                    <Nav.Link 
                      active={operationsTab === 'inventory'} 
                      onClick={() => setOperationsTab('inventory')}
                    >
                      <FaMedkit className="me-2" />
                      Inventory
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      active={operationsTab === 'scheduling'} 
                      onClick={() => setOperationsTab('scheduling')}
                    >
                      <FaCalendarCheck className="me-2" />
                      Scheduling
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      active={operationsTab === 'emergency'} 
                      onClick={() => setOperationsTab('emergency')}
                    >
                      <FaExclamationTriangle className="me-2" />
                      Emergency
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      active={operationsTab === 'facilities'} 
                      onClick={() => setOperationsTab('facilities')}
                    >
                      <FaHospital className="me-2" />
                      Facilities
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
            </Row>

            {/* Inventory Management Tab */}
            {operationsTab === 'inventory' && (
              <>
                <Row className="mb-4">
                  <Col lg={6}>
                    <Card className="border-0 shadow-sm">
                      <Card.Header className="bg-primary text-white">
                        <h6 className="mb-0">
                          <FaPills className="me-2" />
                          Pharmacy Inventory
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        <Table hover responsive>
                          <thead>
                            <tr>
                              <th>Medication</th>
                              <th>Stock</th>
                              <th>Status</th>
                              <th>Expiry</th>
                            </tr>
                          </thead>
                          <tbody>
                            {operationsData.inventory.pharmacy.map(item => (
                              <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.stock}</td>
                                <td>
                                  <Badge bg={
                                    item.status === 'Good' ? 'success' : 
                                    item.status === 'Low' ? 'warning' : 'danger'
                                  }>
                                    {item.status}
                                  </Badge>
                                </td>
                                <td>{item.expiry}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Card.Body>
                    </Card>
                  </Col>
                  
                  <Col lg={6}>
                    <Card className="border-0 shadow-sm">
                      <Card.Header className="bg-success text-white">
                        <h6 className="mb-0">
                          <FaStethoscope className="me-2" />
                          Medical Equipment
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        <Table hover responsive>
                          <thead>
                            <tr>
                              <th>Equipment</th>
                              <th>Available</th>
                              <th>In Use</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {operationsData.inventory.equipment.map(item => (
                              <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.available}/{item.total}</td>
                                <td>{item.inUse}</td>
                                <td>
                                  <Badge bg={
                                    item.status === 'Operational' ? 'success' : 
                                    item.status === 'Limited' ? 'warning' : 'danger'
                                  }>
                                    {item.status}
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
              </>
            )}

            {/* Scheduling Tab */}
            {operationsTab === 'scheduling' && (
              <>
                <Row className="mb-4">
                  <Col>
                    <Card className="border-0 shadow-sm">
                      <Card.Header className="bg-info text-white">
                        <h6 className="mb-0">
                          <FaUserMd className="me-2" />
                          Staff Schedule Overview
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        <Table hover responsive>
                          <thead>
                            <tr>
                              <th>Staff Member</th>
                              <th>Department</th>
                              <th>Shift</th>
                              <th>Time</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {operationsData.staffSchedules.map(staff => (
                              <tr key={staff.id}>
                                <td>{staff.name}</td>
                                <td>{staff.department}</td>
                                <td>{staff.shift}</td>
                                <td>{staff.startTime} - {staff.endTime}</td>
                                <td>
                                  <Badge bg={
                                    staff.status === 'On Duty' ? 'success' : 
                                    staff.status === 'Scheduled' ? 'info' : 'warning'
                                  }>
                                    {staff.status}
                                  </Badge>
                                </td>
                                <td>
                                  <Button 
                                    size="sm" 
                                    variant="outline-primary" 
                                    className="me-1"
                                    onClick={() => showNotification(`Editing schedule for ${staff.name}`, 'info')}
                                  >
                                    <FaEdit />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline-info"
                                    onClick={() => showNotification(`Viewing details for ${staff.name}`, 'info')}
                                  >
                                    <FaEye />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                
                {/* Operating Room Schedule */}
                <Row>
                  <Col>
                    <Card className="border-0 shadow-sm">
                      <Card.Header className="bg-warning text-dark">
                        <h6 className="mb-0">
                          <FaBed className="me-2" />
                          Operating Room Schedule
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        <Table hover responsive>
                          <thead>
                            <tr>
                              <th>Room</th>
                              <th>Status</th>
                              <th>Surgeon</th>
                              <th>Procedure</th>
                              <th>Time</th>
                              <th>Progress</th>
                            </tr>
                          </thead>
                          <tbody>
                            {operationsData.operatingRooms.map(room => (
                              <tr key={room.id}>
                                <td><strong>{room.room}</strong></td>
                                <td>
                                  <Badge bg={
                                    room.status === 'In Use' ? 'danger' : 
                                    room.status === 'Available' ? 'success' : 
                                    room.status === 'Cleaning' ? 'warning' : 'info'
                                  }>
                                    {room.status}
                                  </Badge>
                                </td>
                                <td>{room.surgeon || 'N/A'}</td>
                                <td>{room.procedure || 'N/A'}</td>
                                <td>
                                  {room.startTime && room.estimatedEnd ? 
                                    `${room.startTime} - ${room.estimatedEnd}` : 'N/A'}
                                </td>
                                <td>
                                  {room.progress > 0 && (
                                    <ProgressBar 
                                      now={room.progress} 
                                      label={`${room.progress}%`}
                                      variant={room.progress > 80 ? 'success' : room.progress > 50 ? 'info' : 'warning'}
                                    />
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </>
            )}

            {/* Emergency Management Tab */}
            {operationsTab === 'emergency' && (
              <>
                <Row className="mb-4">
                  <Col lg={8}>
                    <Card className="border-0 shadow-sm">
                      <Card.Header className="bg-danger text-white">
                        <h6 className="mb-0">
                          <FaExclamationTriangle className="me-2" />
                          Emergency Protocols
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        <Table hover responsive>
                          <thead>
                            <tr>
                              <th>Code</th>
                              <th>Description</th>
                              <th>Response Time</th>
                              <th>Last Activated</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {operationsData.emergencyProtocols.map(protocol => (
                              <tr key={protocol.id}>
                                <td><strong>{protocol.code}</strong></td>
                                <td>{protocol.description}</td>
                                <td>{protocol.responseTime}</td>
                                <td>{protocol.lastActivated}</td>
                                <td>
                                  <Badge bg="success">{protocol.status}</Badge>
                                </td>
                                <td>
                                  <Button 
                                    size="sm" 
                                    variant="outline-danger"
                                    onClick={() => handleEmergencyCode(protocol.code)}
                                    disabled={loading}
                                  >
                                    <FaBell className="me-1" />
                                    Activate
                                  </Button>
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
                      <Card.Header className="bg-warning text-dark">
                        <h6 className="mb-0">
                          <FaAmbulance className="me-2" />
                          Emergency Response
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        <div className="text-center mb-3">
                          <h3 className="text-danger">{hospitalStats.emergencyCases}</h3>
                          <p className="mb-2">Active Emergency Cases</p>
                          <h5 className="text-warning">{hospitalStats.emergencyWaitTime} min</h5>
                          <p className="small text-muted">Average Wait Time</p>
                        </div>
                        <div className="d-grid gap-2">
                          <Button 
                            variant="danger" 
                            size="lg"
                            onClick={() => handleEmergencyCode('Code Blue')}
                            disabled={loading}
                          >
                            <FaHeartbeat className="me-2" />
                            {loading ? <Spinner size="sm" className="me-2" /> : null}
                            Code Blue
                          </Button>
                          <Button 
                            variant="warning"
                            onClick={() => showNotification('Ambulance dispatch requested!', 'info')}
                          >
                            <FaAmbulance className="me-2" />
                            Dispatch Ambulance
                          </Button>
                          <Button 
                            variant="info"
                            onClick={() => showNotification('Emergency contacts displayed!', 'info')}
                          >
                            <FaPhoneAlt className="me-2" />
                            Emergency Contacts
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </>
            )}

            {/* Facilities Management Tab */}
            {operationsTab === 'facilities' && (
              <>
                <Row>
                  <Col lg={8} className="mb-4">
                    <Card className="border-0 shadow-sm">
                      <Card.Header className="bg-transparent border-0">
                        <h5 className="mb-0">Resource Utilization Overview</h5>
                      </Card.Header>
                      <Card.Body>
                        <Row>
                          <Col md={3} className="mb-3">
                            <div className="text-center">
                              <FaBed className="display-6 text-success mb-2" />
                              <h4 className="text-success">78%</h4>
                              <p className="mb-0">Bed Occupancy</p>
                              <ProgressBar now={78} variant="success" />
                              <small className="text-muted">{hospitalStats.totalBeds - hospitalStats.availableBeds}/{hospitalStats.totalBeds} beds</small>
                            </div>
                          </Col>
                          <Col md={3} className="mb-3">
                            <div className="text-center">
                              <FaStethoscope className="display-6 text-warning mb-2" />
                              <h4 className="text-warning">76%</h4>
                              <p className="mb-0">ICU Capacity</p>
                              <ProgressBar now={76} variant="warning" />
                              <small className="text-muted">19/25 ICU beds</small>
                            </div>
                          </Col>
                          <Col md={3} className="mb-3">
                            <div className="text-center">
                              <FaFlask className="display-6 text-info mb-2" />
                              <h4 className="text-info">82%</h4>
                              <p className="mb-0">Lab Efficiency</p>
                              <ProgressBar now={82} variant="info" />
                              <small className="text-muted">45 tests/hour</small>
                            </div>
                          </Col>
                          <Col md={3} className="mb-3">
                            <div className="text-center">
                              <FaUsers className="display-6 text-primary mb-2" />
                              <h4 className="text-primary">94%</h4>
                              <p className="mb-0">Staff Utilization</p>
                              <ProgressBar now={94} variant="primary" />
                              <small className="text-muted">{hospitalStats.staffOnDuty} staff on duty</small>
                            </div>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                  
                  <Col lg={4} className="mb-4">
                    <Card className="border-0 shadow-sm">
                      <Card.Header className="bg-success text-white">
                        <h6 className="mb-0">
                          <FaChartLine className="me-2" />
                          Performance Metrics
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between">
                            <span>Patient Satisfaction</span>
                            <strong>94%</strong>
                          </div>
                          <ProgressBar now={94} variant="success" className="mt-1" />
                        </div>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between">
                            <span>Average Length of Stay</span>
                            <strong>4.2 days</strong>
                          </div>
                          <ProgressBar now={70} variant="info" className="mt-1" />
                        </div>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between">
                            <span>Readmission Rate</span>
                            <strong>8.5%</strong>
                          </div>
                          <ProgressBar now={15} variant="warning" className="mt-1" />
                        </div>
                        <div>
                          <div className="d-flex justify-content-between">
                            <span>Operational Efficiency</span>
                            <strong>91%</strong>
                          </div>
                          <ProgressBar now={91} variant="primary" className="mt-1" />
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </>
            )}
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

          {/* AI Diagnostics Hub Tab */}
          <Tab.Pane eventKey="ai-diagnostics">
            <Row className="mb-4">
              <Col>
                <Alert variant="info">
                  <FaBrain className="me-2" />
                  <strong>AI Diagnostics Hub</strong> - Advanced AI-powered diagnostic assistance and medical imaging analysis
                </Alert>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col lg={8}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-primary text-white">
                    <h6 className="mb-0">
                      <FaBrain className="me-2" />
                      Active AI Scans
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <Table hover responsive>
                      <thead>
                        <tr>
                          <th>Patient</th>
                          <th>Scan Type</th>
                          <th>Status</th>
                          <th>Confidence</th>
                          <th>Progress</th>
                        </tr>
                      </thead>
                      <tbody>
                        {aiDiagnostics.activeScans.map(scan => (
                          <tr key={scan.id}>
                            <td>{scan.patient}</td>
                            <td>{scan.type}</td>
                            <td>
                              <Badge bg={scan.status === 'Complete' ? 'success' : 'warning'}>
                                {scan.status}
                              </Badge>
                            </td>
                            <td>{scan.confidence}%</td>
                            <td>
                              {scan.status === 'Processing' ? (
                                <div>
                                  <Spinner size="sm" className="me-2" />
                                  {scan.timeRemaining}
                                </div>
                              ) : (
                                <Badge bg="success">{scan.findings || 'Complete'}</Badge>
                              )}
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
                  <Card.Header className="bg-success text-white">
                    <h6 className="mb-0">
                      <FaRobot className="me-2" />
                      AI Models Status
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    {aiDiagnostics.diagnosticModels.map((model, index) => (
                      <div key={index} className="mb-3">
                        <div className="d-flex justify-content-between">
                          <strong>{model.name}</strong>
                          <Badge bg={model.status === 'Active' ? 'success' : 'warning'}>
                            {model.status}
                          </Badge>
                        </div>
                        <div className="d-flex justify-content-between small text-muted">
                          <span>Accuracy: {model.accuracy}%</span>
                          <span>{model.version}</span>
                        </div>
                        <ProgressBar now={model.accuracy} className="mt-1" />
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>

          {/* Telemedicine Center Tab */}
          <Tab.Pane eventKey="telemedicine">
            <Row className="mb-4">
              <Col>
                <Alert variant="success">
                  <FaVideo className="me-2" />
                  <strong>Telemedicine Center</strong> - Virtual consultations and remote patient monitoring
                </Alert>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col lg={4}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-info text-white">
                    <h6 className="mb-0">
                      <FaChartLine className="me-2" />
                      Today's Statistics
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="text-center mb-3">
                      <h3 className="text-primary">{telemedicine.todayStats.totalConsultations}</h3>
                      <p className="mb-0">Total Consultations</p>
                    </div>
                    <div className="text-center mb-3">
                      <h4 className="text-success">{telemedicine.todayStats.avgDuration} min</h4>
                      <p className="mb-0">Average Duration</p>
                    </div>
                    <div className="text-center mb-3">
                      <h4 className="text-warning">{telemedicine.todayStats.patientSatisfaction}/5</h4>
                      <p className="mb-0">Satisfaction Rating</p>
                    </div>
                    <div className="text-center">
                      <h5 className="text-danger">{telemedicine.todayStats.techIssues}</h5>
                      <p className="mb-0">Technical Issues</p>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={4}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-warning text-dark">
                    <h6 className="mb-0">
                      <FaVideo className="me-2" />
                      Active Consultations
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    {telemedicine.activeConsultations.map(consultation => (
                      <div key={consultation.id} className="mb-3 p-3 border rounded">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <strong>{consultation.doctor}</strong>
                            <p className="mb-1 small text-muted">{consultation.patient}</p>
                            <Badge bg="info">{consultation.specialty}</Badge>
                          </div>
                          <div className="text-end">
                            <Badge bg={consultation.status === 'In Progress' ? 'success' : 'warning'}>
                              {consultation.status}
                            </Badge>
                            <p className="mb-0 small">{consultation.duration}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={4}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-primary text-white">
                    <h6 className="mb-0">
                      <FaClock className="me-2" />
                      Upcoming Appointments
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    {telemedicine.upcomingAppointments.map((appointment, index) => (
                      <div key={index} className="mb-3 p-2 border-start border-primary border-3">
                        <div className="d-flex justify-content-between">
                          <strong>{appointment.time}</strong>
                          <Badge bg="outline-primary">{appointment.type}</Badge>
                        </div>
                        <p className="mb-1">{appointment.doctor}</p>
                        <p className="mb-0 small text-muted">{appointment.patient}</p>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>

          {/* IoT Device Management Tab */}
          <Tab.Pane eventKey="iot-devices">
            <Row className="mb-4">
              <Col>
                <Alert variant="warning">
                  <FaWifi className="me-2" />
                  <strong>IoT Device Management</strong> - Smart medical equipment monitoring and management
                </Alert>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col lg={8}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-primary text-white">
                    <h6 className="mb-0">
                      <FaWifi className="me-2" />
                      Connected Devices
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <Table hover responsive>
                      <thead>
                        <tr>
                          <th>Device</th>
                          <th>Location</th>
                          <th>Status</th>
                          <th>Battery</th>
                          <th>Last Update</th>
                        </tr>
                      </thead>
                      <tbody>
                        {iotDevices.connectedDevices.map(device => (
                          <tr key={device.id}>
                            <td>{device.name}</td>
                            <td>{device.location}</td>
                            <td>
                              <Badge bg={device.status === 'Online' ? 'success' : 'danger'}>
                                {device.status}
                              </Badge>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <ProgressBar 
                                  now={device.battery} 
                                  className="me-2" 
                                  style={{width: '60px', height: '8px'}}
                                  variant={device.battery > 20 ? 'success' : 'danger'}
                                />
                                {device.battery}%
                              </div>
                            </td>
                            <td>{device.lastUpdate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={4}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-info text-white">
                    <h6 className="mb-0">
                      <FaExclamationTriangle className="me-2" />
                      Device Alerts
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    {iotDevices.alerts.map((alert, index) => (
                      <div key={index} className="mb-3 p-3 border rounded">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <strong className="text-danger">{alert.device}</strong>
                            <p className="mb-1 small">{alert.message}</p>
                            <Badge bg={alert.priority === 'High' ? 'danger' : 'warning'}>
                              {alert.priority}
                            </Badge>
                          </div>
                          <div className="text-end">
                            <small className="text-muted">{alert.timestamp}</small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>

          {/* Financial Analytics Tab */}
          <Tab.Pane eventKey="financial">
            <Row className="mb-4">
              <Col>
                <Alert variant="success">
                  <FaDollarSign className="me-2" />
                  <strong>Financial Analytics</strong> - Revenue tracking, cost analysis, and financial performance metrics
                </Alert>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col lg={3}>
                <Card className="border-0 shadow-sm">
                  <Card.Body className="text-center">
                    <FaMoneyBillWave className="display-4 text-success mb-3" />
                    <h3 className="text-success">${financialData.revenue.daily.toLocaleString()}</h3>
                    <p className="mb-0">Daily Revenue</p>
                    <Badge bg="success">+{financialData.revenue.growth}%</Badge>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={3}>
                <Card className="border-0 shadow-sm">
                  <Card.Body className="text-center">
                    <FaChartLine className="display-4 text-primary mb-3" />
                    <h3 className="text-primary">${(financialData.revenue.monthly / 1000).toFixed(0)}K</h3>
                    <p className="mb-0">Monthly Revenue</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={3}>
                <Card className="border-0 shadow-sm">
                  <Card.Body className="text-center">
                    <FaChartPie className="display-4 text-warning mb-3" />
                    <h3 className="text-warning">{financialData.profitability.margin}%</h3>
                    <p className="mb-0">Profit Margin</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={3}>
                <Card className="border-0 shadow-sm">
                  <Card.Body className="text-center">
                    <FaTrophy className="display-4 text-info mb-3" />
                    <h3 className="text-info">${(financialData.revenue.quarterly / 1000000).toFixed(1)}M</h3>
                    <p className="mb-0">Quarterly Revenue</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col lg={6}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-success text-white">
                    <h6 className="mb-0">
                      <FaChartBar className="me-2" />
                      Revenue Breakdown
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    {financialData.revenueBreakdown.map((item, index) => (
                      <div key={index} className="mb-3">
                        <div className="d-flex justify-content-between">
                          <span>{item.category}</span>
                          <strong>${item.amount.toLocaleString()}</strong>
                        </div>
                        <ProgressBar now={item.percentage} className="mt-1" />
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={6}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-warning text-dark">
                    <h6 className="mb-0">
                      <FaCalculator className="me-2" />
                      Operating Expenses
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    {financialData.expenses.map((expense, index) => (
                      <div key={index} className="mb-3">
                        <div className="d-flex justify-content-between">
                          <span>{expense.category}</span>
                          <strong>${expense.amount.toLocaleString()}</strong>
                        </div>
                        <ProgressBar 
                          now={expense.percentage} 
                          variant="warning" 
                          className="mt-1" 
                        />
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>

          {/* Quality & Compliance Tab */}
          <Tab.Pane eventKey="quality">
            <Row className="mb-4">
              <Col>
                <Alert variant="info">
                  <FaShieldAlt className="me-2" />
                  <strong>Quality & Compliance Dashboard</strong> - Patient safety, clinical quality, and regulatory compliance monitoring
                </Alert>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col lg={3}>
                <Card className="border-0 shadow-sm">
                  <Card.Body className="text-center">
                    <FaShieldAlt className="display-4 text-primary mb-3" />
                    <h3 className="text-primary">{qualityMetrics.patientSafety.score}</h3>
                    <p className="mb-1">Patient Safety Score</p>
                    <Badge bg="success">↑ {qualityMetrics.patientSafety.trend}</Badge>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={3}>
                <Card className="border-0 shadow-sm">
                  <Card.Body className="text-center">
                    <FaCertificate className="display-4 text-success mb-3" />
                    <h3 className="text-success">{qualityMetrics.clinicalQuality.score}</h3>
                    <p className="mb-1">Clinical Quality</p>
                    <Badge bg="secondary">→ {qualityMetrics.clinicalQuality.trend}</Badge>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={3}>
                <Card className="border-0 shadow-sm">
                  <Card.Body className="text-center">
                    <FaStar className="display-4 text-warning mb-3" />
                    <h3 className="text-warning">{qualityMetrics.patientExperience.score}</h3>
                    <p className="mb-1">Patient Experience</p>
                    <Badge bg="success">↑ {qualityMetrics.patientExperience.trend}</Badge>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={3}>
                <Card className="border-0 shadow-sm">
                  <Card.Body className="text-center">
                    <FaFileContract className="display-4 text-info mb-3" />
                    <h3 className="text-info">{qualityMetrics.compliance.score}</h3>
                    <p className="mb-1">Compliance Score</p>
                    <Badge bg="success">↑ {qualityMetrics.compliance.trend}</Badge>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col lg={6}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-primary text-white">
                    <h6 className="mb-0">
                      <FaClipboardCheck className="me-2" />
                      Audit Results
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    {qualityMetrics.auditResults.map((audit, index) => (
                      <div key={index} className="mb-3 p-3 border rounded">
                        <div className="d-flex justify-content-between">
                          <strong>{audit.area}</strong>
                          <Badge bg={audit.status === 'Passed' ? 'success' : 'warning'}>
                            {audit.status}
                          </Badge>
                        </div>
                        <p className="mb-1 small text-muted">{audit.date}</p>
                        <p className="mb-0 small">{audit.findings}</p>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={6}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-warning text-dark">
                    <h6 className="mb-0">
                      <FaExclamationTriangle className="me-2" />
                      Compliance Alerts
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    {qualityMetrics.complianceAlerts.map((alert, index) => (
                      <div key={index} className="mb-3 p-3 border rounded">
                        <div className="d-flex justify-content-between">
                          <strong className="text-warning">{alert.type}</strong>
                          <Badge bg={alert.severity === 'High' ? 'danger' : 'warning'}>
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="mb-1 small">{alert.description}</p>
                        <p className="mb-0 small text-muted">Due: {alert.dueDate}</p>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>

          {/* Research & Development Tab */}
          <Tab.Pane eventKey="research">
            <Row className="mb-4">
              <Col>
                <Alert variant="primary">
                  <FaMicroscope className="me-2" />
                  <strong>Research & Development Center</strong> - Clinical trials, research projects, and innovation tracking
                </Alert>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col lg={3}>
                <Card className="border-0 shadow-sm">
                  <Card.Body className="text-center">
                    <FaFlask className="display-4 text-primary mb-3" />
                    <h3 className="text-primary">{researchData.activeTrials.length}</h3>
                    <p className="mb-0">Active Clinical Trials</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={3}>
                <Card className="border-0 shadow-sm">
                  <Card.Body className="text-center">
                    <FaFileContract className="display-4 text-success mb-3" />
                    <h3 className="text-success">{researchData.publications}</h3>
                    <p className="mb-0">Published Papers</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={3}>
                <Card className="border-0 shadow-sm">
                  <Card.Body className="text-center">
                    <FaDollarSign className="display-4 text-warning mb-3" />
                    <h3 className="text-warning">${researchData.totalFunding}M</h3>
                    <p className="mb-0">Research Funding</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={3}>
                <Card className="border-0 shadow-sm">
                  <Card.Body className="text-center">
                    <FaAward className="display-4 text-info mb-3" />
                    <h3 className="text-info">{researchData.grants}</h3>
                    <p className="mb-0">Active Grants</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col lg={8}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-primary text-white">
                    <h6 className="mb-0">
                      <FaFlask className="me-2" />
                      Active Clinical Trials
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <Table hover responsive>
                      <thead>
                        <tr>
                          <th>Trial Name</th>
                          <th>Phase</th>
                          <th>Participants</th>
                          <th>Status</th>
                          <th>Progress</th>
                        </tr>
                      </thead>
                      <tbody>
                        {researchData.activeTrials.map(trial => (
                          <tr key={trial.id}>
                            <td>{trial.name}</td>
                            <td>
                              <Badge bg="primary">Phase {trial.phase}</Badge>
                            </td>
                            <td>{trial.participants}</td>
                            <td>
                              <Badge bg={trial.status === 'Active' ? 'success' : 'warning'}>
                                {trial.status}
                              </Badge>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <ProgressBar 
                                  now={trial.progress} 
                                  className="me-2" 
                                  style={{width: '80px', height: '8px'}}
                                />
                                {trial.progress}%
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
                  <Card.Header className="bg-success text-white">
                    <h6 className="mb-0">
                      <FaCalendarAlt className="me-2" />
                      Research Milestones
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    {researchData.upcomingMilestones.map((milestone, index) => (
                      <div key={index} className="mb-3 p-3 border rounded">
                        <div className="d-flex justify-content-between">
                          <strong>{milestone.title}</strong>
                          <Badge bg="info">{milestone.priority}</Badge>
                        </div>
                        <p className="mb-1 small">{milestone.description}</p>
                        <p className="mb-0 small text-muted">Due: {milestone.dueDate}</p>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      {/* Enhanced Modal System with Patient Journey Tracking */}
      <Modal show={showModal} onHide={handleModalClose} size="xl" className="patient-modal">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === 'newPatient' && (
              <>
                <FaPlus className="me-2" />
                Admit New Patient
              </>
            )}
            {modalType === 'patientJourney' && selectedItem && (
              <>
                <FaUsers className="me-2" />
                Patient Journey - {selectedItem.name}
              </>
            )}
            {modalType === 'editPatient' && (
              <>
                <FaEdit className="me-2" />
                Update Patient Information
              </>
            )}
            {modalType === 'staffSchedule' && (
              <>
                <FaCalendarCheck className="me-2" />
                Staff Schedule
              </>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {modalType === 'newPatient' && (
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Patient Name *</Form.Label>
                    <Form.Control type="text" placeholder="Enter full name" required />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Age *</Form.Label>
                    <Form.Control type="number" placeholder="Age" required />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Gender *</Form.Label>
                    <Form.Select required>
                      <option value="">Select Gender</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="O">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Department *</Form.Label>
                    <Form.Select required>
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.name}>{dept.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Priority Level *</Form.Label>
                    <Form.Select required>
                      <option value="">Select Priority</option>
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority - Urgent</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Insurance Provider</Form.Label>
                    <Form.Control type="text" placeholder="Insurance company" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Emergency Contact</Form.Label>
                    <Form.Control type="tel" placeholder="+1-555-0123" />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Chief Complaint *</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Describe the patient's primary complaint or symptoms" required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Medical History</Form.Label>
                <Form.Control as="textarea" rows={2} placeholder="Relevant medical history, allergies, current medications" />
              </Form.Group>
            </Form>
          )}
          
          {modalType === 'patientJourney' && selectedItem && (
            <div>
              {/* Patient Journey Navigation */}
              <Tab.Container activeKey={activePatientTab} onSelect={setActivePatientTab}>
                <Nav variant="pills" className="mb-4">
                  <Nav.Item>
                    <Nav.Link eventKey="overview">
                      <FaUser className="me-2" />
                      Overview
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="journey">
                      <FaClock className="me-2" />
                      Journey Timeline
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="ai-insights">
                      <FaRobot className="me-2" />
                      AI Insights
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="reports">
                      <FaDownload className="me-2" />
                      Reports
                    </Nav.Link>
                  </Nav.Item>
                </Nav>

                <Tab.Content>
                  {/* Patient Overview */}
                  <Tab.Pane eventKey="overview">
                    <Row>
                      <Col md={6}>
                        <Card className="border-0 bg-light mb-3">
                          <Card.Header className="bg-primary text-white">
                            <h6 className="mb-0">Patient Information</h6>
                          </Card.Header>
                          <Card.Body>
                            <div className="row g-2">
                              <div className="col-6"><strong>Name:</strong></div>
                              <div className="col-6">{selectedItem.name}</div>
                              <div className="col-6"><strong>ID:</strong></div>
                              <div className="col-6">{selectedItem.patientId}</div>
                              <div className="col-6"><strong>Age:</strong></div>
                              <div className="col-6">{selectedItem.age} years</div>
                              <div className="col-6"><strong>Department:</strong></div>
                              <div className="col-6">{selectedItem.department}</div>
                              <div className="col-6"><strong>Room:</strong></div>
                              <div className="col-6">{selectedItem.roomNumber || 'Not assigned'}</div>
                              <div className="col-6"><strong>Insurance:</strong></div>
                              <div className="col-6">{selectedItem.insurance}</div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={6}>
                        <Card className="border-0 bg-light mb-3">
                          <Card.Header className="bg-success text-white">
                            <h6 className="mb-0">Current Status</h6>
                          </Card.Header>
                          <Card.Body>
                            <div className="row g-2">
                              <div className="col-6"><strong>Priority:</strong></div>
                              <div className="col-6">
                                <Badge bg={getPriorityColor(selectedItem.priority)}>
                                  {selectedItem.priority.toUpperCase()}
                                </Badge>
                              </div>
                              <div className="col-6"><strong>Status:</strong></div>
                              <div className="col-6">
                                <Badge bg="info">{selectedItem.status}</Badge>
                              </div>
                              <div className="col-6"><strong>Doctor:</strong></div>
                              <div className="col-6">{selectedItem.assignedDoctor}</div>
                              <div className="col-6"><strong>Condition:</strong></div>
                              <div className="col-6">{selectedItem.condition}</div>
                              <div className="col-6"><strong>Admitted:</strong></div>
                              <div className="col-6">{selectedItem.admissionDate}</div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Tab.Pane>

                  {/* Patient Journey Timeline */}
                  <Tab.Pane eventKey="journey">
                    <div className="timeline-container">
                      <h6 className="mb-3">Complete Patient Journey</h6>
                      {patientJourney.map((event, index) => (
                        <div key={event.id} className="timeline-item mb-4">
                          <Row>
                            <Col md={2} className="text-end">
                              <div className="timeline-time">
                                <small className="text-muted">
                                  {new Date(event.timestamp).toLocaleString()}
                                </small>
                              </div>
                            </Col>
                            <Col md={1} className="text-center">
                              <div className={`timeline-badge bg-${
                                event.stage === 'admission' ? 'primary' :
                                event.stage === 'triage' ? 'warning' :
                                event.stage === 'diagnosis' ? 'info' :
                                event.stage === 'testing' ? 'secondary' :
                                event.stage === 'treatment' ? 'success' : 'light'
                              } text-white rounded-circle p-2`}>
                                {event.stage === 'admission' && <FaUser />}
                                {event.stage === 'triage' && <FaStethoscope />}
                                {event.stage === 'diagnosis' && <FaUserMd />}
                                {event.stage === 'testing' && <FaFlask />}
                                {event.stage === 'treatment' && <FaPills />}
                              </div>
                            </Col>
                            <Col md={9}>
                              <Card className="border-0 shadow-sm">
                                <Card.Body>
                                  <div className="d-flex justify-content-between align-items-start mb-2">
                                    <h6 className="mb-0">{event.action}</h6>
                                    <Badge bg={
                                      event.stage === 'admission' ? 'primary' :
                                      event.stage === 'triage' ? 'warning' :
                                      event.stage === 'diagnosis' ? 'info' :
                                      event.stage === 'testing' ? 'secondary' :
                                      event.stage === 'treatment' ? 'success' : 'light'
                                    }>
                                      {event.stage.toUpperCase()}
                                    </Badge>
                                  </div>
                                  <p className="text-muted mb-2">
                                    <FaMapMarkerAlt className="me-1" />
                                    {event.location} • {event.staff}
                                  </p>
                                  <p className="mb-2">{event.details}</p>
                                  {event.vitals && (
                                    <div className="bg-light p-2 rounded">
                                      <strong>Vital Signs:</strong>
                                      <div className="row g-2 mt-1">
                                        <div className="col-6">BP: {event.vitals.bloodPressure}</div>
                                        <div className="col-6">HR: {event.vitals.heartRate} bpm</div>
                                        <div className="col-6">Temp: {event.vitals.temperature}°F</div>
                                        <div className="col-6">O2 Sat: {event.vitals.oxygenSat}%</div>
                                      </div>
                                    </div>
                                  )}
                                  {event.notes && (
                                    <div className="mt-2">
                                      <strong>Notes:</strong> {event.notes}
                                    </div>
                                  )}
                                </Card.Body>
                              </Card>
                            </Col>
                          </Row>
                        </div>
                      ))}
                    </div>
                  </Tab.Pane>

                  {/* AI Insights */}
                  <Tab.Pane eventKey="ai-insights">
                    <Row>
                      <Col md={6} className="mb-4">
                        <Card className="border-0 shadow-sm">
                          <Card.Header className="bg-warning text-dark">
                            <h6 className="mb-0">
                              <FaExclamationTriangle className="me-2" />
                              Risk Assessment
                            </h6>
                          </Card.Header>
                          <Card.Body>
                            {aiInsights.riskAssessment && (
                              <>
                                <div className="d-flex justify-content-between mb-3">
                                  <span>Risk Level:</span>
                                  <Badge bg={
                                    aiInsights.riskAssessment.level === 'High' ? 'danger' :
                                    aiInsights.riskAssessment.level === 'Medium' ? 'warning' : 'success'
                                  }>
                                    {aiInsights.riskAssessment.level}
                                  </Badge>
                                </div>
                                <h6>Risk Factors:</h6>
                                <ul className="list-unstyled">
                                  {aiInsights.riskAssessment.factors.map((factor, index) => (
                                    <li key={index} className="mb-1">
                                      <FaCheckCircle className="text-info me-2" />
                                      {factor}
                                    </li>
                                  ))}
                                </ul>
                                <div className="mt-3 p-2 bg-light rounded">
                                  <strong>Recommendation:</strong>
                                  <p className="mb-0 mt-1">{aiInsights.riskAssessment.recommendation}</p>
                                </div>
                              </>
                            )}
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={6} className="mb-4">
                        <Card className="border-0 shadow-sm">
                          <Card.Header className="bg-info text-white">
                            <h6 className="mb-0">
                              <FaChartLine className="me-2" />
                              Predictive Analytics
                            </h6>
                          </Card.Header>
                          <Card.Body>
                            {aiInsights.predictiveAnalytics && (
                              <>
                                <div className="row g-2 mb-3">
                                  <div className="col-6">
                                    <div className="text-center p-2 bg-light rounded">
                                      <h5 className="text-primary">{aiInsights.predictiveAnalytics.estimatedLOS}</h5>
                                      <small>Estimated LOS</small>
                                    </div>
                                  </div>
                                  <div className="col-6">
                                    <div className="text-center p-2 bg-light rounded">
                                      <h5 className="text-success">{aiInsights.predictiveAnalytics.dischargeReadiness}</h5>
                                      <small>Discharge Ready</small>
                                    </div>
                                  </div>
                                </div>
                                <div className="mb-3">
                                  <strong>Complication Risk:</strong> {aiInsights.predictiveAnalytics.complications}
                                </div>
                                <div>
                                  <strong>Required Resources:</strong>
                                  <ul className="mt-2">
                                    {aiInsights.predictiveAnalytics.resources.map((resource, index) => (
                                      <li key={index}>{resource}</li>
                                    ))}
                                  </ul>
                                </div>
                              </>
                            )}
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6} className="mb-4">
                        <Card className="border-0 shadow-sm">
                          <Card.Header className="bg-success text-white">
                            <h6 className="mb-0">
                              <FaPills className="me-2" />
                              Treatment Suggestions
                            </h6>
                          </Card.Header>
                          <Card.Body>
                            {aiInsights.treatmentSuggestions && (
                              <ul className="list-unstyled">
                                {aiInsights.treatmentSuggestions.map((suggestion, index) => (
                                  <li key={index} className="mb-2">
                                    <FaCheckCircle className="text-success me-2" />
                                    {suggestion}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={6} className="mb-4">
                        <Card className="border-0 shadow-sm">
                          <Card.Header className="bg-secondary text-white">
                            <h6 className="mb-0">
                              <FaChartPie className="me-2" />
                              Cost Analysis
                            </h6>
                          </Card.Header>
                          <Card.Body>
                            {aiInsights.costAnalysis && (
                              <>
                                <div className="row g-2">
                                  <div className="col-12 mb-2">
                                    <div className="d-flex justify-content-between">
                                      <span>Estimated Cost:</span>
                                      <strong>{aiInsights.costAnalysis.estimatedCost}</strong>
                                    </div>
                                  </div>
                                  <div className="col-12 mb-2">
                                    <div className="d-flex justify-content-between">
                                      <span>Insurance Coverage:</span>
                                      <span className="text-success">{aiInsights.costAnalysis.insuranceCoverage}</span>
                                    </div>
                                  </div>
                                  <div className="col-12">
                                    <div className="d-flex justify-content-between">
                                      <span>Patient Responsibility:</span>
                                      <strong className="text-warning">{aiInsights.costAnalysis.patientResponsibility}</strong>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Tab.Pane>

                  {/* Reports */}
                  <Tab.Pane eventKey="reports">
                    <div className="text-center mb-4">
                      <h5>Comprehensive Patient Reports</h5>
                      <p className="text-muted">Generate detailed reports for patient care documentation</p>
                    </div>
                    <Row>
                      <Col md={4} className="mb-3">
                        <Card className="border-0 shadow-sm text-center">
                          <Card.Body>
                            <FaDownload className="text-primary mb-2" style={{fontSize: '2rem'}} />
                            <h6>Admission Report</h6>
                            <p className="small text-muted">Complete admission documentation</p>
                            <Button variant="outline-primary" size="sm">Generate</Button>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={4} className="mb-3">
                        <Card className="border-0 shadow-sm text-center">
                          <Card.Body>
                            <FaStethoscope className="text-success mb-2" style={{fontSize: '2rem'}} />
                            <h6>Clinical Summary</h6>
                            <p className="small text-muted">Medical findings and treatment</p>
                            <Button variant="outline-success" size="sm">Generate</Button>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={4} className="mb-3">
                        <Card className="border-0 shadow-sm text-center">
                          <Card.Body>
                            <FaRobot className="text-info mb-2" style={{fontSize: '2rem'}} />
                            <h6>AI Analysis Report</h6>
                            <p className="small text-muted">AI insights and predictions</p>
                            <Button variant="outline-info" size="sm">Generate</Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                    <div className="mt-4">
                      <Button 
                        variant="primary" 
                        size="lg" 
                        className="w-100"
                        onClick={() => generatePatientReport(selectedItem)}
                      >
                        <FaDownload className="me-2" />
                        Generate Complete Patient Report
                      </Button>
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </div>
          )}

          {modalType === 'editPatient' && selectedItem && (
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Patient Name</Form.Label>
                    <Form.Control type="text" defaultValue={selectedItem.name} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Age</Form.Label>
                    <Form.Control type="number" defaultValue={selectedItem.age} />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Department</Form.Label>
                    <Form.Select defaultValue={selectedItem.department}>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.name}>{dept.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Priority</Form.Label>
                    <Form.Select defaultValue={selectedItem.priority}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Current Condition</Form.Label>
                <Form.Control as="textarea" rows={3} defaultValue={selectedItem.condition} />
              </Form.Group>
            </Form>
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
              showNotification('Patient admitted successfully! Journey tracking initiated.');
              handleModalClose();
            }}>
              <FaPlus className="me-1" />
              Admit Patient
            </Button>
          )}
          {modalType === 'editPatient' && (
            <Button variant="primary" onClick={() => {
              showNotification('Patient information updated successfully!');
              handleModalClose();
            }}>
              <FaEdit className="me-1" />
              Save Changes
            </Button>
          )}
          {modalType === 'patientJourney' && (
            <div className="d-flex gap-2">
              <Button variant="info" onClick={() => generatePatientReport(selectedItem)}>
                <FaDownload className="me-1" />
                Export Report
              </Button>
              <Button variant="success" onClick={() => {
                showNotification('Patient discharge process initiated!');
                handleModalClose();
              }}>
                <FaCheckCircle className="me-1" />
                Initiate Discharge
              </Button>
            </div>
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
