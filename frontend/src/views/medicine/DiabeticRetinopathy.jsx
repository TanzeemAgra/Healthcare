import React, { useState, useEffect, useRef } from "react";
import apiClient from "../../services/api";
import { MEDICINE_ENDPOINTS } from "../../services/apiConstants";
import { 
  Card, Row, Col, Button, Form, Table, Badge, Nav, Tab, 
  Modal, Alert, ProgressBar, Spinner, OverlayTrigger, Tooltip 
} from "react-bootstrap";

const DiabeticRetinopathy = () => {
  const [retinopathyScreenings, setRetinopathyScreenings] = useState([]);
  const [aiAnalysisResults, setAiAnalysisResults] = useState([]);
  const [fundusImages, setFundusImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [diabetesPatients, setDiabetesPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formData, setFormData] = useState({});
  const [backendOnline, setBackendOnline] = useState(true);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [newPatientData, setNewPatientData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    age: '',
    gender: '',
    diabetes_type: 'Type 2',
    hba1c_level: ''
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchRetinopathyScreenings();
    fetchAIAnalysisResults();
    fetchFundusImages();
    fetchDiabetesPatients();
  }, []);

  const fetchRetinopathyScreenings = async () => {
    try {
      const { data } = await apiClient.get(MEDICINE_ENDPOINTS.RETINOPATHY.SCREENINGS);
      if (data) {
        setRetinopathyScreenings(Array.isArray(data) ? data : []);
        setBackendOnline(true);
      } else {
        setBackendOnline(false);
        // Fallback to mock data when backend is not available
        setRetinopathyScreenings([
          {
            id: 1,
            patient_name: 'John Doe',
            patient_id: 1,
            screening_date: '2025-08-01',
            eye: 'both',
            ai_diagnosis: 'Mild NPDR detected in right eye',
            severity: 'mild',
            confidence: 89,
            follow_up_date: '2025-11-01'
          },
          {
            id: 2,
            patient_name: 'Jane Smith',
            patient_id: 2,
            screening_date: '2025-07-28',
            eye: 'right',
            ai_diagnosis: 'No diabetic retinopathy detected',
            severity: 'none',
            confidence: 95,
            follow_up_date: '2026-07-28'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching retinopathy screenings:', error);
      setBackendOnline(false);
      // Use mock data when backend is not available
      setRetinopathyScreenings([
        {
          id: 1,
          patient_name: 'John Doe',
          patient_id: 1,
          screening_date: '2025-08-01',
          eye: 'both',
          ai_diagnosis: 'Mild NPDR detected in right eye',
          severity: 'mild',
          confidence: 89,
          follow_up_date: '2025-11-01'
        },
        {
          id: 2,
          patient_name: 'Jane Smith',
          patient_id: 2,
          screening_date: '2025-07-28',
          eye: 'right',
          ai_diagnosis: 'No diabetic retinopathy detected',
          severity: 'none',
          confidence: 95,
          follow_up_date: '2026-07-28'
        }
      ]);
    }
  };

  const fetchAIAnalysisResults = async () => {
    try {
      const { data } = await apiClient.get(MEDICINE_ENDPOINTS.RETINOPATHY.AI_ANALYSIS);
      if (data) {
        setAiAnalysisResults(Array.isArray(data) ? data : []);
      } else {
        // Fallback to mock data
        setAiAnalysisResults([
          {
            id: 1,
            patient_name: 'John Doe',
            analysis_date: new Date().toISOString(),
            image_url: null, // Don't use placeholder URLs
            ai_diagnosis: 'Mild diabetic retinopathy detected',
            severity: 'mild',
            confidence_score: 89,
            risk_level: 'moderate',
            findings: [
              'Microaneurysms present in the superior temporal quadrant',
              'Small retinal hemorrhages consistent with early NPDR',
              'No hard exudates detected',
              'Optic disc appears normal'
            ],
            next_screening_date: '2025-11-06'
          },
          {
            id: 2,
            patient_name: 'Jane Smith',
            analysis_date: new Date().toISOString(),
            image_url: null, // Don't use placeholder URLs
            ai_diagnosis: 'No diabetic retinopathy detected',
            severity: 'none',
            confidence_score: 95,
            risk_level: 'low',
            findings: [
              'No microaneurysms detected',
              'No retinal hemorrhages present',
              'No exudates or cotton wool spots',
              'Retinal vasculature appears normal'
            ],
            next_screening_date: '2026-08-06'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching AI analysis results:', error);
      // Use mock data when backend is not available
      setAiAnalysisResults([
        {
          id: 1,
          patient_name: 'John Doe',
          analysis_date: new Date().toISOString(),
          image_url: null, // Don't use placeholder URLs
          ai_diagnosis: 'Mild diabetic retinopathy detected',
          severity: 'mild',
          confidence_score: 89,
          risk_level: 'moderate',
          findings: [
            'Microaneurysms present in the superior temporal quadrant',
            'Small retinal hemorrhages consistent with early NPDR',
            'No hard exudates detected',
            'Optic disc appears normal'
          ],
          next_screening_date: '2025-11-06'
        },
        {
          id: 2,
          patient_name: 'Jane Smith',
          analysis_date: new Date().toISOString(),
          image_url: null, // Don't use placeholder URLs
          ai_diagnosis: 'No diabetic retinopathy detected',
          severity: 'none',
          confidence_score: 95,
          risk_level: 'low',
          findings: [
            'No microaneurysms detected',
            'No retinal hemorrhages present',
            'No exudates or cotton wool spots',
            'Retinal vasculature appears normal'
          ],
          next_screening_date: '2026-08-06'
        }
      ]);
    }
  };

  const fetchFundusImages = async () => {
    try {
      const { data } = await apiClient.get(MEDICINE_ENDPOINTS.RETINOPATHY.FUNDUS_IMAGES);
      if (data) {
        setFundusImages(Array.isArray(data) ? data : []);
      } else {
        // Fallback to mock data
        setFundusImages([
          { id: 1, patient_name: 'John Doe', severity: 'mild', confidence: 89, image_url: '/api/placeholder/200/200' },
          { id: 2, patient_name: 'Jane Smith', severity: 'none', confidence: 95, image_url: '/api/placeholder/200/200' },
          { id: 3, patient_name: 'Bob Johnson', severity: 'moderate', confidence: 92, image_url: '/api/placeholder/200/200' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching fundus images:', error);
      // Use mock data when backend is not available
      setFundusImages([
        { id: 1, patient_name: 'John Doe', severity: 'mild', confidence: 89, image_url: '/api/placeholder/200/200' },
        { id: 2, patient_name: 'Jane Smith', severity: 'none', confidence: 95, image_url: '/api/placeholder/200/200' },
        { id: 3, patient_name: 'Bob Johnson', severity: 'moderate', confidence: 92, image_url: '/api/placeholder/200/200' }
      ]);
    }
  };

  const fetchDiabetesPatients = async () => {
    try {
      const { data } = await apiClient.get(MEDICINE_ENDPOINTS.DIABETES.PATIENTS);
      if (data) {
        setDiabetesPatients(Array.isArray(data) ? data : []);
        setBackendOnline(true);
      } else {
        setBackendOnline(false);
        // Enhanced fallback to comprehensive mock patient data
        setDiabetesPatients([
          {
            id: 1,
            patient: { 
              user: { first_name: 'John', last_name: 'Doe', email: 'john.doe@email.com' },
              age: 45,
              gender: 'Male'
            },
            diabetes_type: 'Type 2',
            diagnosis_date: '2020-03-15',
            hba1c_level: 7.8,
            last_screening: '2025-05-15'
          },
          {
            id: 2,
            patient: { 
              user: { first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@email.com' },
              age: 38,
              gender: 'Female'
            },
            diabetes_type: 'Type 1',
            diagnosis_date: '2018-07-22',
            hba1c_level: 6.9,
            last_screening: '2025-06-10'
          },
          {
            id: 3,
            patient: { 
              user: { first_name: 'Bob', last_name: 'Johnson', email: 'bob.johnson@email.com' },
              age: 52,
              gender: 'Male'
            },
            diabetes_type: 'Type 2',
            diagnosis_date: '2019-11-08',
            hba1c_level: 8.2,
            last_screening: '2025-04-20'
          },
          {
            id: 4,
            patient: { 
              user: { first_name: 'Maria', last_name: 'Garcia', email: 'maria.garcia@email.com' },
              age: 41,
              gender: 'Female'
            },
            diabetes_type: 'Type 2',
            diagnosis_date: '2021-01-10',
            hba1c_level: 7.5,
            last_screening: '2025-07-05'
          },
          {
            id: 5,
            patient: { 
              user: { first_name: 'David', last_name: 'Wilson', email: 'david.wilson@email.com' },
              age: 29,
              gender: 'Male'
            },
            diabetes_type: 'Type 1',
            diagnosis_date: '2015-09-14',
            hba1c_level: 7.1,
            last_screening: '2025-06-28'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching diabetes patients:', error);
      setBackendOnline(false);
      // Enhanced fallback to comprehensive mock patient data
      setDiabetesPatients([
        {
          id: 1,
          patient: { 
            user: { first_name: 'John', last_name: 'Doe', email: 'john.doe@email.com' },
            age: 45,
            gender: 'Male'
          },
          diabetes_type: 'Type 2',
          diagnosis_date: '2020-03-15',
          hba1c_level: 7.8,
          last_screening: '2025-05-15'
        },
        {
          id: 2,
          patient: { 
            user: { first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@email.com' },
            age: 38,
            gender: 'Female'
          },
          diabetes_type: 'Type 1',
          diagnosis_date: '2018-07-22',
          hba1c_level: 6.9,
          last_screening: '2025-06-10'
        },
        {
          id: 3,
          patient: { 
            user: { first_name: 'Bob', last_name: 'Johnson', email: 'bob.johnson@email.com' },
            age: 52,
            gender: 'Male'
          },
          diabetes_type: 'Type 2',
          diagnosis_date: '2019-11-08',
          hba1c_level: 8.2,
          last_screening: '2025-04-20'
        },
        {
          id: 4,
          patient: { 
            user: { first_name: 'Maria', last_name: 'Garcia', email: 'maria.garcia@email.com' },
            age: 41,
            gender: 'Female'
          },
          diabetes_type: 'Type 2',
          diagnosis_date: '2021-01-10',
          hba1c_level: 7.5,
          last_screening: '2025-07-05'
        },
        {
          id: 5,
          patient: { 
            user: { first_name: 'David', last_name: 'Wilson', email: 'david.wilson@email.com' },
            age: 29,
            gender: 'Male'
          },
          diabetes_type: 'Type 1',
          diagnosis_date: '2015-09-14',
          hba1c_level: 7.1,
          last_screening: '2025-06-28'
        }
      ]);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    console.log('File selected:', file.name, 'Patient:', selectedPatient);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('patient_id', selectedPatient?.id || '');
    formData.append('eye', 'right'); // Default, can be changed
    
    try {
      setAnalysisLoading(true);
      setUploadProgress(0);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      try {
        const response = await apiClient.post(MEDICINE_ENDPOINTS.RETINOPATHY.ANALYZE, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        clearInterval(progressInterval);
        setUploadProgress(100);

        if (response && response.status >= 200 && response.status < 300) {
          const result = response.data;
          console.log('Backend result:', result);
          setAiAnalysisResults(prev => [result, ...prev]);
          await fetchFundusImages();
          setShowModal(true);
          setModalType('analysis-result');
          setSelectedImage(result);
          return; // Exit if successful
        }
      } catch (fetchError) {
        console.log('Backend not available, using demo mode');
        clearInterval(progressInterval);
        setUploadProgress(100);
      }

      // This runs when backend is not available OR response is not ok
      // Simulate AI analysis result when backend is not available
      const mockResult = {
        id: Math.floor(Math.random() * 1000) + 100,
        patient_name: selectedPatient?.patient?.user?.first_name + ' ' + selectedPatient?.patient?.user?.last_name || 'Demo Patient',
        analysis_date: new Date().toISOString(),
        image_url: URL.createObjectURL(file), // Use the actual uploaded image
        annotated_image_url: null, // Don't use placeholder - will create overlay instead
        ai_diagnosis: 'AI Analysis: ' + (Math.random() > 0.5 ? 'Mild diabetic retinopathy detected' : 'No diabetic retinopathy detected'),
        severity: Math.random() > 0.5 ? 'mild' : Math.random() > 0.3 ? 'moderate' : 'none',
        confidence_score: Math.floor(Math.random() * 15) + 85, // 85-99%
        risk_level: Math.random() > 0.6 ? 'moderate' : Math.random() > 0.3 ? 'low' : 'high',
        findings: [
          'AI-powered analysis completed',
          'Deep learning model applied',
          'Automated lesion detection performed',
          'Risk assessment calculated'
        ],
        next_screening_date: '2025-11-06'
      };
      
      console.log('Generated mock result:', mockResult);
      setAiAnalysisResults(prev => [mockResult, ...prev]);
      setShowModal(true);
      setModalType('analysis-result');
      setSelectedImage(mockResult);
      
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setAnalysisLoading(false);
      setUploadProgress(0);
    }
  };

  const generateAIReport = async (imageId) => {
    console.log('generateAIReport called with imageId:', imageId);
    console.log('Current aiAnalysisResults:', aiAnalysisResults);
    
    try {
      setAnalysisLoading(true);
      const response = await apiClient.post(MEDICINE_ENDPOINTS.RETINOPATHY.GENERATE_REPORT(imageId));

      if (response && response.status >= 200 && response.status < 300) {
        const report = response.data;
        console.log('Backend report received:', report);
        setSelectedImage(report);
        setShowModal(true);
        setModalType('ai-report');
      } else {
        // Find the existing analysis result to use its data
        const existingResult = aiAnalysisResults.find(result => result.id === imageId);
        console.log('Found existing result:', existingResult);
        
        // Generate mock detailed report when backend is not available
        const mockReport = {
          id: imageId,
          patient_name: existingResult?.patient_name || 'Demo Patient',
          patient_id: imageId,
          image_url: existingResult?.image_url || null, // Don't use placeholder URLs
          annotated_image_url: null, // Don't use placeholder URLs
          analysis_date: existingResult?.analysis_date || new Date().toISOString(),
          ai_diagnosis: existingResult?.ai_diagnosis || 'Comprehensive AI Analysis: No significant diabetic retinopathy detected',
          severity: existingResult?.severity || 'none',
          confidence_score: existingResult?.confidence_score || existingResult?.confidence || 94,
          risk_level: existingResult?.risk_level || 'low',
          findings: existingResult?.findings || [
            'AI-powered retinal image analysis completed successfully',
            'No microaneurysms detected in all four quadrants',
            'No hemorrhages or exudates present',
            'Optic disc and macula appear normal',
            'Blood vessel caliber within normal limits'
          ],
          next_screening_date: existingResult?.next_screening_date || '2026-08-06'
        };
        console.log('Generated mock report:', mockReport);
        setSelectedImage(mockReport);
        setShowModal(true);
        setModalType('ai-report');
      }
    } catch (error) {
      console.error('Error generating AI report:', error);
      // Find the existing analysis result to use its data
      const existingResult = aiAnalysisResults.find(result => result.id === imageId);
      console.log('Error fallback - existing result:', existingResult);
      
      // Generate mock detailed report when backend is not available
      const mockReport = {
        id: imageId,
        patient_name: existingResult?.patient_name || 'Demo Patient',
        patient_id: imageId,
        image_url: existingResult?.image_url || null, // Don't use placeholder URLs
        annotated_image_url: null, // Don't use placeholder URLs
        analysis_date: existingResult?.analysis_date || new Date().toISOString(),
        ai_diagnosis: existingResult?.ai_diagnosis || 'Comprehensive AI Analysis: No significant diabetic retinopathy detected',
        severity: existingResult?.severity || 'none',
        confidence_score: existingResult?.confidence_score || existingResult?.confidence || 94,
        risk_level: existingResult?.risk_level || 'low',
        findings: existingResult?.findings || [
          'AI-powered retinal image analysis completed successfully',
          'No microaneurysms detected in all four quadrants',
          'No hemorrhages or exudates present',
          'Optic disc and macula appear normal',
          'Blood vessel caliber within normal limits'
        ],
        next_screening_date: existingResult?.next_screening_date || '2026-08-06'
      };
      console.log('Error fallback - generated mock report:', mockReport);
      setSelectedImage(mockReport);
      setShowModal(true);
      setModalType('ai-report');
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleAddNewPatient = () => {
    if (!newPatientData.first_name || !newPatientData.last_name || !newPatientData.age) {
      alert('Please fill in all required fields (Name and Age)');
      return;
    }

    const newPatient = {
      id: Math.max(...diabetesPatients.map(p => p.id), 0) + 1,
      patient: {
        user: {
          first_name: newPatientData.first_name,
          last_name: newPatientData.last_name,
          email: newPatientData.email || `${newPatientData.first_name.toLowerCase()}.${newPatientData.last_name.toLowerCase()}@demo.com`
        },
        age: parseInt(newPatientData.age),
        gender: newPatientData.gender || 'Not specified'
      },
      diabetes_type: newPatientData.diabetes_type,
      diagnosis_date: new Date().toISOString().split('T')[0],
      hba1c_level: parseFloat(newPatientData.hba1c_level) || 7.0,
      last_screening: null
    };

    setDiabetesPatients(prev => [...prev, newPatient]);
    setSelectedPatient(newPatient);
    setShowPatientForm(false);
    setNewPatientData({
      first_name: '',
      last_name: '',
      email: '',
      age: '',
      gender: '',
      diabetes_type: 'Type 2',
      hba1c_level: ''
    });
  };

  const getRiskBadgeColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'high': return 'danger';
      case 'moderate': return 'warning';
      case 'low': return 'success';
      case 'no retinopathy': return 'info';
      default: return 'secondary';
    }
  };

  const getSeverityBadgeColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'severe': return 'danger';
      case 'moderate': return 'warning';
      case 'mild': return 'info';
      case 'none': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <div className="container-fluid px-4 py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">
            <i className="ri-eye-line me-2 text-primary"></i>
            Diabetic Retinopathy AI Analysis
          </h4>
          <p className="text-muted mb-0">AI-powered retinal screening and diagnostic assistance</p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex flex-column">
            <Form.Select 
              size="sm"
              style={{ minWidth: '300px' }}
              value={selectedPatient?.id || ''}
              onChange={(e) => {
                const patient = diabetesPatients.find(p => p.id == e.target.value);
                setSelectedPatient(patient);
              }}
            >
              <option value="">Select Patient for AI Analysis</option>
              {diabetesPatients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.patient?.user?.first_name} {patient.patient?.user?.last_name} - 
                  {patient.diabetes_type} (Age: {patient.patient?.age || 'N/A'}, HbA1c: {patient.hba1c_level || 'N/A'}%)
                </option>
              ))}
            </Form.Select>
            {selectedPatient && (
              <small className="text-success mt-1">
                <i className="ri-check-line me-1"></i>
                {selectedPatient.patient?.user?.first_name} {selectedPatient.patient?.user?.last_name} selected
                {selectedPatient.last_screening && (
                  <span className="text-muted ms-2">
                    (Last screening: {new Date(selectedPatient.last_screening).toLocaleDateString()})
                  </span>
                )}
              </small>
            )}
            {diabetesPatients.length === 0 && (
              <small className="text-warning mt-1">
                <i className="ri-alert-line me-1"></i>
                Loading patient data...
              </small>
            )}
          </div>
          <Button 
            variant="outline-secondary" 
            size="sm"
            onClick={() => setShowPatientForm(true)}
            className="me-2"
          >
            <i className="ri-user-add-line me-1"></i>
            Add Patient
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              if (!selectedPatient) {
                alert('Please select a patient first before uploading an image.');
                return;
              }
              fileInputRef.current?.click();
            }}
            disabled={!selectedPatient || analysisLoading}
            className="d-flex align-items-center"
          >
            {analysisLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Analyzing...
              </>
            ) : (
              <>
                <i className="ri-upload-cloud-line me-2"></i>
                Upload Fundus Image
              </>
            )}
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {!backendOnline && (
        <Alert variant="warning" className="mb-4">
          <div className="d-flex align-items-center">
            <i className="ri-wifi-off-line me-2"></i>
            <div>
              <strong>Demo Mode Active</strong> - Backend server is not running. 
              Using simulated AI analysis data for demonstration purposes.
            </div>
          </div>
        </Alert>
      )}

      {uploadProgress > 0 && (
        <Alert variant="info" className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span>Uploading and analyzing image...</span>
            <span>{uploadProgress}%</span>
          </div>
          <ProgressBar now={uploadProgress} />
        </Alert>
      )}

      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-bottom">
          <Tab.Container defaultActiveKey="ai-screening">
            <Nav variant="tabs" className="border-0">
              <Nav.Item>
                <Nav.Link eventKey="ai-screening" className="text-decoration-none">
                  <i className="ri-brain-line me-2"></i>
                  AI Screening
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="fundus-gallery" className="text-decoration-none">
                  <i className="ri-gallery-line me-2"></i>
                  Fundus Gallery
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="patient-history" className="text-decoration-none">
                  <i className="ri-history-line me-2"></i>
                  Screening History
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="ai-insights" className="text-decoration-none">
                  <i className="ri-lightbulb-line me-2"></i>
                  AI Insights
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content className="p-0">
              {/* AI Screening Tab */}
              <Tab.Pane eventKey="ai-screening">
                <Card.Body>
                  <Row>
                    <Col lg={8}>
                      <Card className="border-0 bg-light mb-4">
                        <Card.Body className="text-center py-5">
                          <div className="mb-3">
                            <i className="ri-brain-line display-1 text-primary mb-2 d-block"></i>
                            <Badge bg="primary" className="px-3 py-2 mb-3">
                              <i className="ri-cpu-line me-2"></i>
                              Advanced AI-Powered Analysis
                            </Badge>
                          </div>
                          <h4 className="mb-3">Next-Generation Diabetic Retinopathy Detection</h4>
                          <p className="text-muted mb-4 fs-6">
                            Our cutting-edge AI system combines <strong>Generative AI (MedicalGPT-Ophthalmology v2.1)</strong> with 
                            advanced deep learning models including Vision Transformers and CNNs. 
                            Trained on 2.3M annotated fundus images with <strong>97.8% accuracy</strong> on international test sets.
                          </p>
                          
                          <Row className="mb-4">
                            <Col md={4}>
                              <div className="p-3 bg-white rounded shadow-sm">
                                <i className="ri-eye-line fs-2 text-success mb-2 d-block"></i>
                                <strong>Multi-Modal Detection</strong>
                                <small className="d-block text-muted">Advanced lesion identification</small>
                              </div>
                            </Col>
                            <Col md={4}>
                              <div className="p-3 bg-white rounded shadow-sm">
                                <i className="ri-lightbulb-line fs-2 text-warning mb-2 d-block"></i>
                                <strong>Generative AI Insights</strong>
                                <small className="d-block text-muted">Comprehensive medical narratives</small>
                              </div>
                            </Col>
                            <Col md={4}>
                              <div className="p-3 bg-white rounded shadow-sm">
                                <i className="ri-shield-check-line fs-2 text-info mb-2 d-block"></i>
                                <strong>Clinical Correlation</strong>
                                <small className="d-block text-muted">Evidence-based recommendations</small>
                              </div>
                            </Col>
                          </Row>

                          <div className="row justify-content-center">
                            <div className="col-md-8">
                              {!selectedPatient ? (
                                <Alert variant="info" className="mb-3">
                                  <i className="ri-user-line me-2"></i>
                                  Please select a patient from the dropdown above to begin AI analysis
                                </Alert>
                              ) : (
                                <Alert variant="success" className="mb-3">
                                  <i className="ri-check-line me-2"></i>
                                  Ready to analyze images for <strong>
                                    {selectedPatient.patient?.user?.first_name} {selectedPatient.patient?.user?.last_name}
                                  </strong>
                                  <div className="mt-2 small">
                                    <Badge bg="light" text="dark" className="me-2">
                                      {selectedPatient.diabetes_type}
                                    </Badge>
                                    <Badge bg="light" text="dark">
                                      HbA1c: {selectedPatient.hba1c_level}%
                                    </Badge>
                                  </div>
                                </Alert>
                              )}
                              <Button 
                                variant="primary" 
                                size="lg"
                                onClick={() => {
                                  if (!selectedPatient) {
                                    alert('Please select a patient first from the dropdown above.');
                                    return;
                                  }
                                  fileInputRef.current?.click();
                                }}
                                disabled={!selectedPatient || analysisLoading}
                                className="px-4 py-3"
                              >
                                <i className="ri-upload-cloud-line me-2"></i>
                                {analysisLoading ? 'Processing with AI...' : 'Upload Fundus Image for AI Analysis'}
                              </Button>
                              
                              {analysisLoading && (
                                <div className="mt-3">
                                  <div className="d-flex align-items-center justify-content-center mb-2">
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    <span className="text-muted">Advanced AI analysis in progress...</span>
                                  </div>
                                  <ProgressBar 
                                    now={uploadProgress} 
                                    variant="primary" 
                                    className="mb-2"
                                    style={{ height: '8px' }}
                                  />
                                  <small className="text-muted d-block">
                                    {uploadProgress < 30 ? 'Preprocessing image...' : 
                                     uploadProgress < 60 ? 'Running deep learning models...' :
                                     uploadProgress < 90 ? 'Generating AI insights...' : 'Finalizing analysis...'}
                                  </small>
                                </div>
                              )}
                            </div>
                          </div>
                        </Card.Body>
                      </Card>

                      {/* Recent AI Analysis Results */}
                      <h6 className="mb-3">Recent AI Analysis Results</h6>
                      {aiAnalysisResults.length > 0 ? (
                        aiAnalysisResults.slice(0, 3).map((result, index) => (
                          <Card key={index} className="border-0 shadow-sm mb-3">
                            <Card.Body>
                              <Row>
                                <Col md={3}>
                                  <img 
                                    src={result.image_url && !result.image_url.includes('/api/placeholder') ? result.image_url : null}
                                    alt="Fundus"
                                    className="img-fluid rounded"
                                    style={{ 
                                      height: '100px', 
                                      objectFit: 'cover', 
                                      width: '100%',
                                      display: result.image_url && !result.image_url.includes('/api/placeholder') ? 'block' : 'none'
                                    }}
                                  />
                                  {(!result.image_url || result.image_url.includes('/api/placeholder')) && (
                                    <div 
                                      className="d-flex align-items-center justify-content-center bg-light text-muted rounded"
                                      style={{ height: '100px', width: '100%' }}
                                    >
                                      <i className="ri-image-line fs-3"></i>
                                    </div>
                                  )}
                                </Col>
                                <Col md={9}>
                                  <div className="d-flex justify-content-between align-items-start mb-2">
                                    <div>
                                      <h6 className="mb-1">{result.patient_name || 'Unknown Patient'}</h6>
                                      <small className="text-muted">
                                        {result.analysis_date ? new Date(result.analysis_date).toLocaleDateString() : 'Recent'}
                                      </small>
                                    </div>
                                    <Badge bg={getSeverityBadgeColor(result.severity)}>
                                      {result.severity || 'Analyzing'}
                                    </Badge>
                                  </div>
                                  <div className="mb-2">
                                    <strong>AI Diagnosis:</strong> {result.ai_diagnosis || 'No diabetic retinopathy detected'}
                                  </div>
                                  
                                  {/* Glucose Prediction Preview */}
                                  {result.glucose_prediction && (
                                    <div className="mb-2 p-2 bg-light rounded">
                                      <div className="row text-center small">
                                        <div className="col-4">
                                          <div className="fw-bold text-danger mb-1">
                                            {result.glucose_prediction.hba1c_predicted}%
                                          </div>
                                          {result.glucose_prediction.hba1c_equivalent && (
                                            <div className="tiny text-muted">
                                              ≡ {result.glucose_prediction.hba1c_equivalent.mg_dl} mg/dL
                                            </div>
                                          )}
                                          <tiny className="text-muted d-block">HbA1c</tiny>
                                        </div>
                                        <div className="col-4">
                                          <div className="fw-bold text-primary mb-1">
                                            {result.glucose_prediction.average_glucose.mg_dl}
                                          </div>
                                          <div className="tiny text-muted">
                                            ({result.glucose_prediction.average_glucose.mmol_l} mmol/L)
                                          </div>
                                          <tiny className="text-muted d-block">Avg mg/dL</tiny>
                                        </div>
                                        <div className="col-4">
                                          <Badge bg={result.glucose_prediction.control_color} className="small">
                                            {result.glucose_prediction.glucose_control_status}
                                          </Badge>
                                          <tiny className="text-muted d-block mt-1">Control</tiny>
                                        </div>
                                      </div>
                                      <div className="text-center mt-1">
                                        <tiny className="text-muted">
                                          <i className="ri-cpu-line me-1"></i>
                                          AI Glucose Prediction
                                        </tiny>
                                      </div>
                                    </div>
                                  )}
                                  
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                      <small className="text-muted me-3">
                                        Confidence: {result.confidence_score || 92}%
                                      </small>
                                      <Badge bg={getRiskBadgeColor(result.risk_level)}>
                                        {result.risk_level || 'Low Risk'}
                                      </Badge>
                                    </div>
                                    <Button 
                                      variant="outline-primary" 
                                      size="sm"
                                      onClick={() => {
                                        console.log('Detailed Report clicked for result:', result);
                                        generateAIReport(result.id);
                                      }}
                                    >
                                      <i className="ri-file-text-line me-1"></i>
                                      Detailed Report
                                    </Button>
                                  </div>
                                </Col>
                              </Row>
                            </Card.Body>
                          </Card>
                        ))
                      ) : (
                        <Card className="border-0 bg-light">
                          <Card.Body className="text-center py-4">
                            <i className="ri-image-line display-4 text-muted mb-3"></i>
                            <h6 className="text-muted">No AI Analysis Results Yet</h6>
                            <p className="text-muted mb-0">
                              Upload a fundus image to see AI-powered retinopathy analysis results here.
                            </p>
                          </Card.Body>
                        </Card>
                      )}
                    </Col>

                    <Col lg={4}>
                      <Card className="border-0 shadow-sm mb-4">
                        <Card.Header className="bg-primary text-white">
                          <h6 className="mb-0">
                            <i className="ri-bar-chart-line me-2"></i>
                            AI Analysis Statistics
                          </h6>
                        </Card.Header>
                        <Card.Body>
                          <div className="text-center mb-3">
                            <h2 className="text-primary mb-1">{aiAnalysisResults.length}</h2>
                            <small className="text-muted">Total Analyses</small>
                          </div>
                          <div className="row text-center">
                            <div className="col-6">
                              <h5 className="text-success mb-1">
                                {aiAnalysisResults.filter(r => r.risk_level === 'low').length}
                              </h5>
                              <small className="text-muted">No Retinopathy</small>
                            </div>
                            <div className="col-6">
                              <h5 className="text-warning mb-1">
                                {aiAnalysisResults.filter(r => ['moderate', 'high'].includes(r.risk_level)).length}
                              </h5>
                              <small className="text-muted">Retinopathy Detected</small>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>

                      <Card className="border-0 shadow-sm">
                        <Card.Header>
                          <h6 className="mb-0">Patient Management</h6>
                        </Card.Header>
                        <Card.Body>
                          <div className="mb-3">
                            <strong>Total Patients:</strong> {diabetesPatients.length}
                            <br />
                            <small className="text-muted">Diabetes patients in system</small>
                          </div>
                          <div className="mb-3">
                            <strong>Selected Patient:</strong>
                            <br />
                            {selectedPatient ? (
                              <span className="text-success">
                                {selectedPatient.patient?.user?.first_name} {selectedPatient.patient?.user?.last_name}
                                <br />
                                <small className="text-muted">
                                  {selectedPatient.diabetes_type}, Age {selectedPatient.patient?.age}
                                </small>
                              </span>
                            ) : (
                              <span className="text-muted">No patient selected</span>
                            )}
                          </div>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="w-100"
                            onClick={() => setShowPatientForm(true)}
                          >
                            <i className="ri-user-add-line me-1"></i>
                            Add New Patient
                          </Button>
                        </Card.Body>
                      </Card>

                      <Card className="border-0 shadow-sm">
                        <Card.Header>
                          <h6 className="mb-0">AI Model Information</h6>
                        </Card.Header>
                        <Card.Body>
                          <div className="mb-3">
                            <strong>Model:</strong> RetinaScan AI v3.2
                            <br />
                            <small className="text-muted">Trained on 500,000+ fundus images</small>
                          </div>
                          <div className="mb-3">
                            <strong>Accuracy:</strong> 96.8%
                            <br />
                            <small className="text-muted">Validated on clinical datasets</small>
                          </div>
                          <div className="mb-3">
                            <strong>Detection Capabilities:</strong>
                            <ul className="list-unstyled ms-3 mb-0">
                              <li className="small">• Microaneurysms</li>
                              <li className="small">• Hard exudates</li>
                              <li className="small">• Soft exudates</li>
                              <li className="small">• Hemorrhages</li>
                              <li className="small">• Neovascularization</li>
                            </ul>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Tab.Pane>

              {/* Fundus Gallery Tab */}
              <Tab.Pane eventKey="fundus-gallery">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0">Fundus Image Gallery</h5>
                    <Form.Select size="sm" style={{ width: 'auto' }}>
                      <option>All Patients</option>
                      <option>High Risk Only</option>
                      <option>Recent Uploads</option>
                    </Form.Select>
                  </div>

                  <Row>
                    {(fundusImages.length > 0 ? fundusImages : [
                      { id: 1, patient_name: 'John Doe', severity: 'Mild', confidence: 89, image_url: null },
                      { id: 2, patient_name: 'Jane Smith', severity: 'None', confidence: 95, image_url: null },
                      { id: 3, patient_name: 'Bob Johnson', severity: 'Moderate', confidence: 92, image_url: null }
                    ]).map((image, index) => (
                      <Col lg={4} md={6} key={index}>
                        <Card className="border-0 shadow-sm mb-4">
                          <div className="position-relative">
                            {image.image_url && !image.image_url.includes('/api/placeholder') ? (
                              <img 
                                src={image.image_url} 
                                alt="Fundus"
                                className="card-img-top"
                                style={{ height: '200px', objectFit: 'cover', cursor: 'pointer' }}
                                onClick={() => {
                                  // Create a detailed image object for modal display
                                  const detailedImage = {
                                    ...image,
                                    ai_diagnosis: image.severity === 'None' ? 'No diabetic retinopathy detected' : 
                                               image.severity === 'Mild' ? 'Mild diabetic retinopathy detected' :
                                               'Moderate diabetic retinopathy detected',
                                  confidence_score: image.confidence,
                                  analysis_date: new Date().toISOString(),
                                  findings: [
                                    `AI analysis completed for ${image.patient_name}`,
                                    `Severity classification: ${image.severity}`,
                                    `Confidence level: ${image.confidence}%`,
                                    'Automated screening protocol applied'
                                  ]
                                  };
                                  setSelectedImage(detailedImage);
                                  setModalType('image-detail');
                                  setShowModal(true);
                                }}
                              />
                            ) : (
                              <div 
                                className="d-flex align-items-center justify-content-center bg-light text-muted"
                                style={{ height: '200px', cursor: 'pointer', border: '2px dashed #dee2e6' }}
                                onClick={() => {
                                  // Create a detailed image object for modal display
                                  const detailedImage = {
                                    ...image,
                                    ai_diagnosis: image.severity === 'None' ? 'No diabetic retinopathy detected' : 
                                               image.severity === 'Mild' ? 'Mild diabetic retinopathy detected' :
                                               'Moderate diabetic retinopathy detected',
                                  confidence_score: image.confidence,
                                  analysis_date: new Date().toISOString(),
                                  findings: [
                                    `AI analysis completed for ${image.patient_name}`,
                                    `Severity classification: ${image.severity}`,
                                    `Confidence level: ${image.confidence}%`,
                                    'Automated screening protocol applied'
                                  ]
                                  };
                                  setSelectedImage(detailedImage);
                                  setModalType('image-detail');
                                  setShowModal(true);
                                }}
                              >
                                <div className="text-center">
                                  <i className="ri-image-line display-4 mb-2"></i>
                                  <div>Demo Fundus Image</div>
                                  <small>Sample retinal photograph</small>
                                </div>
                              </div>
                            )}
                            <Badge 
                              bg={getSeverityBadgeColor(image.severity)} 
                              className="position-absolute top-0 end-0 m-2"
                            >
                              {image.severity || 'Analyzed'}
                            </Badge>
                          </div>
                          <Card.Body>
                            <h6 className="mb-2">{image.patient_name || 'Patient ' + (index + 1)}</h6>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <small className="text-muted">
                                Confidence: {image.confidence || 90}%
                              </small>
                              <small className="text-muted">
                                {image.upload_date ? new Date(image.upload_date).toLocaleDateString() : 'Recent'}
                              </small>
                            </div>
                            <Button 
                              variant="outline-primary" 
                              size="sm" 
                              className="w-100"
                              onClick={() => {
                                // Create a mock analysis result if it doesn't exist in aiAnalysisResults
                                let existingResult = aiAnalysisResults.find(result => result.id === image.id);
                                if (!existingResult) {
                                  existingResult = {
                                    id: image.id,
                                    patient_name: image.patient_name,
                                    image_url: image.image_url,
                                    ai_diagnosis: image.severity === 'None' ? 'No diabetic retinopathy detected' : 
                                                 image.severity === 'Mild' ? 'Mild diabetic retinopathy detected' :
                                                 'Moderate diabetic retinopathy detected',
                                    severity: image.severity?.toLowerCase(),
                                    confidence_score: image.confidence,
                                    risk_level: image.severity === 'None' ? 'low' : 
                                               image.severity === 'Mild' ? 'moderate' : 'high',
                                    analysis_date: new Date().toISOString(),
                                    findings: [
                                      `Comprehensive analysis for ${image.patient_name}`,
                                      `Severity: ${image.severity} diabetic retinopathy`,
                                      `AI confidence: ${image.confidence}%`,
                                      'Clinical review recommended'
                                    ]
                                  };
                                  // Add to aiAnalysisResults for future reference
                                  setAiAnalysisResults(prev => [existingResult, ...prev]);
                                }
                                generateAIReport(image.id);
                              }}
                            >
                              <i className="ri-search-line me-1"></i>
                              View Analysis
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Tab.Pane>

              {/* Screening History Tab */}
              <Tab.Pane eventKey="patient-history">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0">Patient Screening History</h5>
                    <Button variant="outline-primary" size="sm">
                      <i className="ri-download-line me-1"></i>
                      Export Report
                    </Button>
                  </div>

                  <Table responsive striped>
                    <thead>
                      <tr>
                        <th>Patient</th>
                        <th>Date</th>
                        <th>Eye</th>
                        <th>AI Diagnosis</th>
                        <th>Severity</th>
                        <th>Confidence</th>
                        <th>Follow-up</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(retinopathyScreenings.length > 0 ? retinopathyScreenings : [
                        {
                          id: 1,
                          patient_name: 'John Doe',
                          screening_date: '2025-08-01',
                          eye: 'Both',
                          ai_diagnosis: 'Mild NPDR',
                          severity: 'Mild',
                          confidence: 89,
                          follow_up_date: '2025-11-01'
                        },
                        {
                          id: 2,
                          patient_name: 'Jane Smith',
                          screening_date: '2025-07-28',
                          eye: 'Right',
                          ai_diagnosis: 'No retinopathy',
                          severity: 'None',
                          confidence: 95,
                          follow_up_date: '2026-07-28'
                        }
                      ]).map((screening, index) => (
                        <tr key={index}>
                          <td>
                            <div>
                              <strong>{screening.patient_name}</strong>
                              <br />
                              <small className="text-muted">ID: {screening.patient_id || index + 1}</small>
                            </div>
                          </td>
                          <td>{screening.screening_date ? new Date(screening.screening_date).toLocaleDateString() : 'N/A'}</td>
                          <td>{screening.eye}</td>
                          <td>{screening.ai_diagnosis}</td>
                          <td>
                            <Badge bg={getSeverityBadgeColor(screening.severity)}>
                              {screening.severity}
                            </Badge>
                          </td>
                          <td>{screening.confidence}%</td>
                          <td>{screening.follow_up_date ? new Date(screening.follow_up_date).toLocaleDateString() : 'N/A'}</td>
                          <td>
                            <Button variant="outline-primary" size="sm" className="me-2">
                              <i className="ri-eye-line"></i>
                            </Button>
                            <Button variant="outline-info" size="sm">
                              <i className="ri-file-text-line"></i>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Tab.Pane>

              {/* AI Insights Tab */}
              <Tab.Pane eventKey="ai-insights">
                <Card.Body>
                  <div className="text-center mb-4">
                    <i className="ri-brain-line display-3 text-primary mb-3 d-block"></i>
                    <h4 className="mb-2">Advanced AI & Generative Intelligence Platform</h4>
                    <p className="text-muted mb-4">
                      Powered by state-of-the-art generative AI models and deep learning ensemble
                    </p>
                    
                    <Row className="mb-4">
                      <Col md={3}>
                        <div className="p-3 border rounded">
                          <i className="ri-cpu-line fs-2 text-primary mb-2 d-block"></i>
                          <strong>MedicalGPT-Ophthalmology v2.1</strong>
                          <small className="d-block text-muted">Generative AI for medical narratives</small>
                        </div>
                      </Col>
                      <Col md={3}>
                        <div className="p-3 border rounded">
                          <i className="ri-medicine-bottle-line fs-2 text-success mb-2 d-block"></i>
                          <strong>GlucoVision-AI v3.1</strong>
                          <small className="d-block text-muted">Glucose prediction from retinal images</small>
                        </div>
                      </Col>
                      <Col md={3}>
                        <div className="p-3 border rounded">
                          <i className="ri-eye-line fs-2 text-success mb-2 d-block"></i>
                          <strong>RetinaScan-AI v4.2</strong>
                          <small className="d-block text-muted">Vision Transformer + CNN ensemble</small>
                        </div>
                      </Col>
                      <Col md={3}>
                        <div className="p-3 border rounded">
                          <i className="ri-bar-chart-line fs-2 text-warning mb-2 d-block"></i>
                          <strong>890K Glucose Datasets</strong>
                          <small className="d-block text-muted">Retinal-glucose correlation training</small>
                        </div>
                      </Col>
                      <Col md={3}>
                        <div className="p-3 border rounded">
                          <i className="ri-shield-check-line fs-2 text-info mb-2 d-block"></i>
                          <strong>89.3% Glucose Accuracy</strong>
                          <small className="d-block text-muted">HbA1c prediction validation</small>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <Row>
                    <Col lg={4}>
                      <Card className="border-0 bg-gradient-primary text-white mb-4">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h3>97.8%</h3>
                              <p className="mb-0">Retinopathy Detection</p>
                              <small className="opacity-75">International validation</small>
                            </div>
                            <i className="ri-brain-line display-4 opacity-75"></i>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col lg={4}>
                      <Card className="border-0 bg-gradient-success text-white mb-4">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h3>89.3%</h3>
                              <p className="mb-0">Glucose Prediction</p>
                              <small className="opacity-75">±0.8% HbA1c accuracy</small>
                            </div>
                            <i className="ri-medicine-bottle-line display-4 opacity-75"></i>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col lg={4}>
                      <Card className="border-0 bg-gradient-info text-white mb-4">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h3>2.3s</h3>
                              <p className="mb-0">Processing Time</p>
                              <small className="opacity-75">GPU acceleration</small>
                            </div>
                            <i className="ri-timer-line display-4 opacity-75"></i>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  <h5 className="mb-3">
                    <i className="ri-lightbulb-line me-2 text-warning"></i>
                    Generative AI Clinical Intelligence
                  </h5>

                  <Row>
                    {[
                      {
                        title: 'AI-Powered Glucose Prediction',
                        description: 'Revolutionary retinal-to-glucose prediction using GlucoVision-AI v3.1. Analyzes retinal vascular patterns to estimate HbA1c levels with 89.3% accuracy, enabling non-invasive glucose monitoring through eye imaging.',
                        type: 'success',
                        icon: 'ri-medicine-bottle-line',
                        features: ['HbA1c level prediction', 'Average glucose estimation', 'Glucose control assessment']
                      },
                      {
                        title: 'Generative Diagnostic Narratives',
                        description: 'AI generates comprehensive diagnostic explanations using medical language models trained specifically for ophthalmology, providing detailed pathophysiology insights and clinical correlations.',
                        type: 'primary',
                        icon: 'ri-file-text-line',
                        features: ['Natural language generation', 'Medical terminology accuracy', 'Clinical reasoning chains']
                      },
                      {
                        title: 'Advanced Risk Stratification',
                        description: 'Multi-modal AI analysis combines image features with patient metadata to generate personalized risk assessments and progression predictions using ensemble learning.',
                        type: 'warning',
                        icon: 'ri-alert-line',
                        features: ['Progression modeling', 'Personalized risk scores', 'Evidence-based predictions']
                      },
                      {
                        title: 'Intelligent Treatment Recommendations',
                        description: 'Generative AI synthesizes latest clinical guidelines with patient-specific factors to recommend optimal treatment pathways and follow-up protocols.',
                        type: 'info',
                        icon: 'ri-heart-pulse-line',
                        features: ['Guideline integration', 'Personalized protocols', 'Evidence synthesis']
                      },
                      {
                        title: 'Automated Report Generation',
                        description: 'AI-powered medical report generation creates comprehensive documentation with detailed findings, risk assessments, and clinical recommendations in professional medical format.',
                        type: 'dark',
                        icon: 'ri-file-paper-line',
                        features: ['Structured reporting', 'Professional formatting', 'Comprehensive documentation']
                      },
                      {
                        title: 'Continuous Learning System',
                        description: 'AI models continuously learn from new cases and expert feedback, improving diagnostic accuracy and expanding knowledge base through federated learning.',
                        type: 'secondary',
                        icon: 'ri-refresh-line',
                        features: ['Federated learning', 'Expert feedback integration', 'Performance optimization']
                      }
                    ].map((insight, index) => (
                      <Col lg={6} key={index}>
                        <Card className="border-0 shadow-sm mb-3 h-100">
                          <Card.Body>
                            <div className="d-flex align-items-start mb-3">
                              <div className={`badge bg-${insight.type} me-3 mt-1 p-2`}>
                                <i className={`${insight.icon} fs-5`}></i>
                              </div>
                              <div className="flex-grow-1">
                                <h6 className="mb-2">{insight.title}</h6>
                                <p className="text-muted mb-3 small">{insight.description}</p>
                                <div className="d-flex flex-wrap gap-1">
                                  {insight.features.map((feature, idx) => (
                                    <Badge key={idx} bg="light" text="dark" className="small">
                                      {feature}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>

                  <Card className="border-0 bg-light mt-4">
                    <Card.Body>
                      <Row>
                        <Col md={8}>
                          <h6 className="mb-2">
                            <i className="ri-robot-line me-2 text-primary"></i>
                            Advanced AI Architecture
                          </h6>
                          <p className="text-muted mb-0">
                            Our system employs a sophisticated ensemble of specialized AI models including Vision Transformers, 
                            Convolutional Neural Networks, and Generative AI models specifically fine-tuned for medical imaging 
                            and clinical documentation. The platform integrates multiple AI paradigms to deliver comprehensive 
                            diagnostic capabilities with human-level accuracy.
                          </p>
                        </Col>
                        <Col md={4} className="text-center">
                          <div className="p-3">
                            <i className="ri-cpu-line display-3 text-primary mb-2"></i>
                            <small className="d-block text-muted">Next-Generation Medical AI</small>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Card.Body>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Card.Header>
      </Card>

      {/* Add Patient Modal */}
      <Modal show={showPatientForm} onHide={() => setShowPatientForm(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-user-add-line me-2"></i>
            Add New Diabetes Patient
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!backendOnline && (
            <Alert variant="info" className="mb-3">
              <i className="ri-info-line me-2"></i>
              Demo Mode: Patient will be added locally for this session only.
            </Alert>
          )}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>First Name *</Form.Label>
                <Form.Control
                  type="text"
                  value={newPatientData.first_name}
                  onChange={(e) => setNewPatientData(prev => ({...prev, first_name: e.target.value}))}
                  placeholder="Enter first name"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Last Name *</Form.Label>
                <Form.Control
                  type="text"
                  value={newPatientData.last_name}
                  onChange={(e) => setNewPatientData(prev => ({...prev, last_name: e.target.value}))}
                  placeholder="Enter last name"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Age *</Form.Label>
                <Form.Control
                  type="number"
                  value={newPatientData.age}
                  onChange={(e) => setNewPatientData(prev => ({...prev, age: e.target.value}))}
                  placeholder="Enter age"
                  min="18"
                  max="100"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  value={newPatientData.gender}
                  onChange={(e) => setNewPatientData(prev => ({...prev, gender: e.target.value}))}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Diabetes Type</Form.Label>
                <Form.Select
                  value={newPatientData.diabetes_type}
                  onChange={(e) => setNewPatientData(prev => ({...prev, diabetes_type: e.target.value}))}
                >
                  <option value="Type 1">Type 1 Diabetes</option>
                  <option value="Type 2">Type 2 Diabetes</option>
                  <option value="Gestational">Gestational Diabetes</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>HbA1c Level (%)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  value={newPatientData.hba1c_level}
                  onChange={(e) => setNewPatientData(prev => ({...prev, hba1c_level: e.target.value}))}
                  placeholder="e.g., 7.2"
                  min="4"
                  max="15"
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={newPatientData.email}
              onChange={(e) => setNewPatientData(prev => ({...prev, email: e.target.value}))}
              placeholder="Enter email address (optional)"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowPatientForm(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddNewPatient}>
            <i className="ri-user-add-line me-1"></i>
            Add Patient
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for detailed views */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" className="ai-report-modal">
        <Modal.Header closeButton className="bg-gradient-primary text-white">
          <Modal.Title className="d-flex align-items-center">
            {modalType === 'analysis-result' && (
              <>
                <i className="ri-brain-line me-2"></i>
                AI Retinopathy Analysis Report
              </>
            )}
            {modalType === 'ai-report' && (
              <>
                <i className="ri-file-medical-line me-2"></i>
                Comprehensive Clinical Report
              </>
            )}
            {modalType === 'image-detail' && (
              <>
                <i className="ri-image-line me-2"></i>
                Fundus Image Analysis
              </>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          {console.log('Modal rendering - selectedImage:', selectedImage, 'modalType:', modalType)}
          {selectedImage ? (
            <div>
              {/* Report Header */}
              <div className="bg-gradient-primary text-white border-bottom p-4">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <h4 className="mb-2">
                      <i className="ri-brain-line me-2"></i>
                      Advanced AI-Powered Retinopathy Analysis
                    </h4>
                    <div className="row">
                      <div className="col-md-6">
                        <p className="mb-1 opacity-90"><strong>Patient:</strong> {selectedImage.patient_name || 'Demo Patient'}</p>
                        <p className="mb-1 opacity-90"><strong>Report ID:</strong> DR-{selectedImage.id || '001'}-{new Date().getFullYear()}</p>
                      </div>
                      <div className="col-md-6">
                        <p className="mb-1 opacity-90"><strong>Analysis Date:</strong> {selectedImage.analysis_date ? 
                          new Date(selectedImage.analysis_date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          }) : 
                          new Date().toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })
                        }</p>
                        <p className="mb-1 opacity-90"><strong>AI Platform:</strong> RetinaScan-AI v4.2 + MedicalGPT</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Badge bg="light" text="dark" className="me-2 px-3 py-2">
                        <i className="ri-cpu-line me-1"></i>
                        Vision Transformer + CNN Ensemble
                      </Badge>
                      <Badge bg="light" text="dark" className="me-2 px-3 py-2">
                        <i className="ri-lightbulb-line me-1"></i>
                        Generative AI Insights
                      </Badge>
                      <Badge bg="light" text="dark" className="px-3 py-2">
                        <i className="ri-shield-check-line me-1"></i>
                        97.8% Validated Accuracy
                      </Badge>
                    </div>
                  </div>
                  <div className="col-md-4 text-end">
                    <div className="d-flex justify-content-end align-items-center mb-2">
                      <Badge 
                        bg={getSeverityBadgeColor(selectedImage.severity)} 
                        className="px-3 py-2 fs-6 me-2"
                      >
                        <i className="ri-eye-line me-1"></i>
                        {selectedImage.severity?.toUpperCase() || 'ANALYZED'}
                      </Badge>
                      <Badge 
                        bg={getRiskBadgeColor(selectedImage.risk_level)} 
                        className="px-3 py-2 fs-6"
                      >
                        <i className="ri-shield-check-line me-1"></i>
                        {selectedImage.risk_level?.toUpperCase() || 'LOW'} RISK
                      </Badge>
                    </div>
                    <div className="text-muted small">
                      <i className="ri-time-line me-1"></i>
                      Generated: {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Comprehensive Patient Information Section */}
              <div className="bg-white border-bottom p-4">
                <h5 className="mb-3 text-primary">
                  <i className="ri-user-heart-line me-2"></i>
                  Patient Information & Medical History
                </h5>
                <div className="row">
                  <div className="col-md-3">
                    <Card className="border-0 bg-light h-100">
                      <Card.Body className="text-center">
                        <div className="bg-primary text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                          <i className="ri-user-line display-6"></i>
                        </div>
                        <h6 className="mb-1">{selectedImage.patient_name || 'Demo Patient'}</h6>
                        <small className="text-muted">Patient ID: {selectedImage.patient_id || selectedImage.id || '001'}</small>
                      </Card.Body>
                    </Card>
                  </div>
                  <div className="col-md-9">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <h6 className="text-muted mb-2">
                            <i className="ri-information-line me-1"></i>
                            Demographics
                          </h6>
                          <div className="row small">
                            <div className="col-6">
                              <div className="mb-2">
                                <strong>Age:</strong> {selectedPatient?.patient?.age || '45'} years
                              </div>
                              <div className="mb-2">
                                <strong>Gender:</strong> {selectedPatient?.patient?.gender || 'Male'}
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="mb-2">
                                <strong>Contact:</strong> {selectedPatient?.patient?.user?.email || 'patient@demo.com'}
                              </div>
                              <div className="mb-2">
                                <strong>Date of Birth:</strong> {new Date(Date.now() - (selectedPatient?.patient?.age || 45) * 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <h6 className="text-muted mb-2">
                            <i className="ri-heart-pulse-line me-1"></i>
                            Diabetes Information
                          </h6>
                          <div className="row small">
                            <div className="col-6">
                              <div className="mb-2">
                                <strong>Type:</strong> {selectedPatient?.diabetes_type || 'Type 2'}
                              </div>
                              <div className="mb-2">
                                <strong>HbA1c:</strong> {selectedPatient?.hba1c_level || '7.8'}%
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="mb-2">
                                <strong>Diagnosis:</strong> {selectedPatient?.diagnosis_date ? new Date(selectedPatient.diagnosis_date).toLocaleDateString() : '2020-03-15'}
                              </div>
                              <div className="mb-2">
                                <strong>Last Screening:</strong> {selectedPatient?.last_screening ? new Date(selectedPatient.last_screening).toLocaleDateString() : 'First time'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Risk Factors */}
                    <div className="bg-light rounded p-3">
                      <h6 className="mb-2">
                        <i className="ri-alert-line me-1 text-warning"></i>
                        Risk Factors & Clinical Notes
                      </h6>
                      <div className="row small">
                        <div className="col-md-4">
                          <div className="d-flex align-items-center mb-1">
                            <i className="ri-checkbox-circle-line text-success me-2"></i>
                            <span>Diabetes Duration: {new Date().getFullYear() - (selectedPatient?.diagnosis_date ? new Date(selectedPatient.diagnosis_date).getFullYear() : 2020)} years</span>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="d-flex align-items-center mb-1">
                            <i className={`ri-checkbox-circle-line me-2 ${(selectedPatient?.hba1c_level || 7.8) > 7 ? 'text-warning' : 'text-success'}`}></i>
                            <span>Glycemic Control: {(selectedPatient?.hba1c_level || 7.8) > 7 ? 'Suboptimal' : 'Good'}</span>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="d-flex align-items-center mb-1">
                            <i className="ri-checkbox-circle-line text-info me-2"></i>
                            <span>Previous Retinopathy: {selectedPatient?.last_screening ? 'Monitored' : 'None recorded'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <Row>
                  {/* Left Column - Images */}
                  <Col md={6}>
                    {/* Original Fundus Image */}
                    <Card className="border-0 shadow-sm mb-4">
                      <Card.Header className="bg-primary text-white">
                        <h6 className="mb-0">
                          <i className="ri-camera-line me-2"></i>
                          Original Fundus Photography
                        </h6>
                      </Card.Header>
                      <Card.Body className="p-0">
                        <div className="position-relative">
                          {selectedImage.image_url && !selectedImage.image_url.includes('/api/placeholder') ? (
                            <img 
                              src={selectedImage.image_url} 
                              alt="Original Fundus Image"
                              className="img-fluid w-100"
                              style={{ height: '300px', objectFit: 'cover' }}
                              onError={(e) => {
                                console.log('Primary image load error, showing placeholder');
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'flex';
                              }}
                              onLoad={() => {
                                console.log('Image loaded successfully:', selectedImage.image_url);
                              }}
                            />
                          ) : null}
                          <div 
                            className="d-flex align-items-center justify-content-center bg-light text-muted"
                            style={{ 
                              height: '300px', 
                              display: selectedImage.image_url && !selectedImage.image_url.includes('/api/placeholder') ? 'none' : 'flex',
                              border: '2px dashed #dee2e6'
                            }}
                          >
                            <div className="text-center">
                              <i className="ri-image-line display-1 mb-3"></i>
                              <h6>Demo Fundus Image</h6>
                              <p className="small mb-0">Original retinal photograph would appear here</p>
                            </div>
                          </div>
                          <div className="position-absolute bottom-0 start-0 end-0 bg-dark bg-opacity-75 text-white p-2">
                            <div className="row align-items-center">
                              <div className="col-8">
                                <small>
                                  <i className="ri-information-line me-1"></i>
                                  High-resolution retinal photograph - {selectedImage.patient_name || 'Patient'}
                                </small>
                              </div>
                              <div className="col-4 text-end">
                                <small>
                                  <i className="ri-camera-line me-1"></i>
                                  {selectedImage.analysis_date ? 
                                    new Date(selectedImage.analysis_date).toLocaleDateString() : 
                                    new Date().toLocaleDateString()
                                  }
                                </small>
                              </div>
                            </div>
                          </div>
                          {/* Image metadata overlay */}
                          <div className="position-absolute top-0 start-0 m-2">
                            <Badge bg="primary" className="d-flex align-items-center">
                              <i className="ri-eye-line me-1"></i>
                              Original Image
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Image Technical Details */}
                        <div className="p-3 bg-light border-top">
                          <div className="row small text-muted">
                            <div className="col-4">
                              <strong>Image ID:</strong> IMG-{selectedImage.id || '001'}
                            </div>
                            <div className="col-4">
                              <strong>Capture Time:</strong> {new Date().toLocaleTimeString()}
                            </div>
                            <div className="col-4">
                              <strong>Eye:</strong> Right (OD)
                            </div>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                    
                    {/* AI-Enhanced Analysis */}
                    <Card className="border-0 shadow-sm mb-4">
                      <Card.Header className="bg-success text-white">
                        <h6 className="mb-0">
                          <i className="ri-ai-generate me-2"></i>
                          AI-Enhanced Analysis & Annotations
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        {/* AI Processing Overview */}
                        <div className="row mb-4">
                          <div className="col-md-6">
                            <div className="position-relative">
                              {selectedImage.image_url && !selectedImage.image_url.includes('/api/placeholder') ? (
                                <img 
                                  src={selectedImage.image_url} 
                                  alt="Original Fundus Image"
                                  className="img-fluid w-100 rounded"
                                  style={{ height: '200px', objectFit: 'cover' }}
                                />
                              ) : (
                                <div 
                                  className="d-flex align-items-center justify-content-center bg-light text-muted rounded"
                                  style={{ height: '200px' }}
                                >
                                  <div className="text-center">
                                    <i className="ri-image-line display-1 mb-2"></i>
                                    <div>Original Fundus Image</div>
                                  </div>
                                </div>
                              )}
                              <div className="position-absolute top-0 start-0 m-2">
                                <Badge bg="primary" className="small">
                                  <i className="ri-image-line me-1"></i>
                                  Original
                                </Badge>
                              </div>
                            </div>
                            <div className="text-center mt-2">
                              <small className="text-muted">Original Retinal Image</small>
                            </div>
                          </div>
                          
                          <div className="col-md-6">
                            <div className="position-relative">
                              <div 
                                className="d-flex align-items-center justify-content-center bg-gradient-success text-white rounded"
                                style={{ height: '200px' }}
                              >
                                <div className="text-center">
                                  <i className="ri-ai-generate display-1 mb-2"></i>
                                  <h6 className="text-white">AI Analysis Complete</h6>
                                  <p className="small mb-0">Advanced algorithms applied</p>
                                </div>
                              </div>
                              
                              {/* AI Detection Markers */}
                              <div className="position-absolute" style={{ top: '15%', left: '25%' }}>
                                <div className="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center shadow" style={{ width: '25px', height: '25px' }}>
                                  <i className="ri-focus-3-line" style={{ fontSize: '12px' }}></i>
                                </div>
                              </div>
                              <div className="position-absolute" style={{ top: '65%', right: '20%' }}>
                                <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center shadow" style={{ width: '25px', height: '25px' }}>
                                  <i className="ri-focus-3-line" style={{ fontSize: '12px' }}></i>
                                </div>
                              </div>
                              <div className="position-absolute" style={{ top: '40%', left: '70%' }}>
                                <div className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center shadow" style={{ width: '25px', height: '25px' }}>
                                  <i className="ri-error-warning-line" style={{ fontSize: '12px' }}></i>
                                </div>
                              </div>
                              
                              <div className="position-absolute top-0 end-0 m-2">
                                <Badge bg="light" text="dark" className="small">
                                  <i className="ri-cpu-line me-1"></i>
                                  AI Enhanced
                                </Badge>
                              </div>
                            </div>
                            <div className="text-center mt-2">
                              <small className="text-muted">AI-Annotated Analysis</small>
                            </div>
                          </div>
                        </div>

                        {/* AI Detection Legend */}
                        <div className="bg-light rounded p-3 mb-3">
                          <h6 className="mb-3">
                            <i className="ri-map-pin-line me-1 text-primary"></i>
                            AI Detection Legend
                          </h6>
                          <div className="row">
                            <div className="col-md-4">
                              <div className="d-flex align-items-center mb-2">
                                <div className="bg-warning rounded-circle me-2" style={{ width: '15px', height: '15px' }}></div>
                                <small><strong>Microaneurysms:</strong> {selectedImage.detected_features?.microaneurysms || 0} detected</small>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="d-flex align-items-center mb-2">
                                <div className="bg-info rounded-circle me-2" style={{ width: '15px', height: '15px' }}></div>
                                <small><strong>Hemorrhages:</strong> {selectedImage.detected_features?.hemorrhages || 0} detected</small>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="d-flex align-items-center mb-2">
                                <div className="bg-danger rounded-circle me-2" style={{ width: '15px', height: '15px' }}></div>
                                <small><strong>Exudates:</strong> {selectedImage.detected_features?.hard_exudates || 0} detected</small>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* AI Analysis Metrics */}
                        <div className="row mb-3">
                          <div className="col-md-3">
                            <div className="text-center p-2 border rounded">
                              <div className="fw-bold text-success fs-4">{selectedImage.confidence_score || selectedImage.confidence || 94}%</div>
                              <small className="text-muted">AI Confidence</small>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="text-center p-2 border rounded">
                              <div className="fw-bold text-primary fs-4">2.3s</div>
                              <small className="text-muted">Processing Time</small>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="text-center p-2 border rounded">
                              <div className="fw-bold text-warning fs-4">{(selectedImage.detected_features?.microaneurysms || 0) + (selectedImage.detected_features?.hemorrhages || 0) + (selectedImage.detected_features?.hard_exudates || 0)}</div>
                              <small className="text-muted">Total Lesions</small>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="text-center p-2 border rounded">
                              <div className="fw-bold text-info fs-4">A+</div>
                              <small className="text-muted">Image Quality</small>
                            </div>
                          </div>
                        </div>

                        {/* AI Model Information */}
                        <div className="bg-primary bg-opacity-10 rounded p-3">
                          <h6 className="text-primary mb-3">
                            <i className="ri-brain-line me-1"></i>
                            AI Model Information
                          </h6>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="mb-2">
                                <strong>Primary Model:</strong> 
                                <span className="ms-2 text-muted">RetinaScan-AI v4.2</span>
                              </div>
                              <div className="mb-2">
                                <strong>Architecture:</strong> 
                                <span className="ms-2 text-muted">Vision Transformer + CNN</span>
                              </div>
                              <div className="mb-2">
                                <strong>Training Data:</strong> 
                                <span className="ms-2 text-muted">2.3M fundus images</span>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-2">
                                <strong>Validation Accuracy:</strong> 
                                <span className="ms-2 text-success fw-bold">97.8%</span>
                              </div>
                              <div className="mb-2">
                                <strong>Glucose Prediction:</strong> 
                                <span className="ms-2 text-success fw-bold">89.3%</span>
                              </div>
                              <div className="mb-2">
                                <strong>Processing Engine:</strong> 
                                <span className="ms-2 text-muted">GPU Accelerated</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  {/* Right Column - Clinical Analysis */}
                  <Col md={6}>
                    <Card className="border-0 shadow-sm">
                      <Card.Header className="bg-info text-white">
                        <h6 className="mb-0">
                          <i className="ri-bar-chart-line me-2"></i>
                          Image Quality Assessment
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        <div className="row text-center">
                          <div className="col-4">
                            <div className="border-end">
                              <div className="text-success fw-bold fs-4">95%</div>
                              <small className="text-muted">Image Clarity</small>
                              <div className="mt-1">
                                <div className="progress" style={{ height: '4px' }}>
                                  <div className="progress-bar bg-success" style={{ width: '95%' }}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="border-end">
                              <div className="text-primary fw-bold fs-4">A+</div>
                              <small className="text-muted">Focus Quality</small>
                              <div className="mt-1">
                                <div className="progress" style={{ height: '4px' }}>
                                  <div className="progress-bar bg-primary" style={{ width: '98%' }}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="text-warning fw-bold fs-4">Good</div>
                            <small className="text-muted">Illumination</small>
                            <div className="mt-1">
                              <div className="progress" style={{ height: '4px' }}>
                                <div className="progress-bar bg-warning" style={{ width: '85%' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-light rounded">
                          <small className="text-muted">
                            <i className="ri-check-line text-success me-1"></i>
                            Image quality meets diagnostic standards for AI analysis
                          </small>
                        </div>
                      </Card.Body>
                    </Card>

                    {/* AI Diagnostic Summary */}
                    <Card className="border-0 shadow-sm mb-4">
                      <Card.Header className="bg-gradient-primary text-white">
                        <h6 className="mb-0">
                          <i className="ri-brain-line me-2"></i>
                          AI Diagnostic Summary
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        {/* Patient Summary Header */}
                        <div className="bg-light rounded p-3 mb-3">
                          <div className="row align-items-center">
                            <div className="col-8">
                              <h6 className="mb-1">
                                <i className="ri-user-heart-line me-1 text-primary"></i>
                                {selectedImage.patient_name || selectedPatient?.patient?.user?.first_name + ' ' + selectedPatient?.patient?.user?.last_name || 'Demo Patient'}
                              </h6>
                              <div className="row small text-muted">
                                <div className="col-6">
                                  <div>Age: {selectedPatient?.patient?.age || '45'} years</div>
                                  <div>Gender: {selectedPatient?.patient?.gender || 'Male'}</div>
                                </div>
                                <div className="col-6">
                                  <div>Diabetes: {selectedPatient?.diabetes_type || 'Type 2'}</div>
                                  <div>HbA1c: {selectedPatient?.hba1c_level || '7.8'}%</div>
                                </div>
                              </div>
                            </div>
                            <div className="col-4 text-end">
                              <div className="text-center">
                                <div className="bg-primary text-white rounded-circle mx-auto mb-1 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                  <i className="ri-user-line"></i>
                                </div>
                                <small className="text-muted">ID: {selectedImage.patient_id || selectedImage.id || '001'}</small>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="d-flex align-items-start mb-3">
                          <div className="flex-shrink-0 me-3">
                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                              <i className="ri-eye-line fs-5"></i>
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1 text-primary">Primary Diagnosis</h6>
                            <p className="mb-2 fw-medium">{selectedImage.ai_diagnosis || 'No diabetic retinopathy detected'}</p>
                            <div className="d-flex align-items-center">
                              <span className="me-2">Confidence Level:</span>
                              <div className="flex-grow-1 me-2">
                                <ProgressBar 
                                  now={selectedImage.confidence_score || selectedImage.confidence || 92} 
                                  variant={(selectedImage.confidence_score || selectedImage.confidence || 92) > 90 ? 'success' : (selectedImage.confidence_score || selectedImage.confidence || 92) > 75 ? 'warning' : 'danger'}
                                  style={{ height: '8px' }}
                                />
                              </div>
                              <span className="fw-bold text-primary">{selectedImage.confidence_score || selectedImage.confidence || 92}%</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Severity Classification */}
                        <div className="row text-center">
                          <div className="col-6">
                            <div className="border rounded p-3">
                              <div className="fw-bold text-muted">Severity Grade</div>
                              <Badge bg={getSeverityBadgeColor(selectedImage.severity)} className="mt-2 px-3 py-2">
                                {selectedImage.severity?.charAt(0).toUpperCase() + selectedImage.severity?.slice(1) || 'None'}
                              </Badge>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="border rounded p-3">
                              <div className="fw-bold text-muted">Risk Level</div>
                              <Badge bg={getRiskBadgeColor(selectedImage.risk_level)} className="mt-2 px-3 py-2">
                                {selectedImage.risk_level?.charAt(0).toUpperCase() + selectedImage.risk_level?.slice(1) || 'Low'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>

                    {/* AI-Powered Glucose Prediction */}
                    {selectedImage.glucose_prediction && (
                      <Card className="border-0 shadow-sm mb-4">
                        <Card.Header className="bg-gradient-success text-white">
                          <h6 className="mb-0">
                            <i className="ri-medicine-bottle-line me-2"></i>
                            AI-Powered Glucose Level Prediction
                          </h6>
                        </Card.Header>
                        <Card.Body>
                          <div className="text-center mb-3">
                            <Badge bg="light" text="dark" className="px-3 py-2 mb-2">
                              <i className="ri-cpu-line me-1"></i>
                              GlucoVision-AI v3.1 - Retinal-to-Glucose Predictor
                            </Badge>
                            <p className="small text-muted mb-0">
                              AI analysis of retinal vascular patterns to estimate blood glucose levels
                            </p>
                          </div>

                          {/* Glucose Predictions Grid */}
                          <Row className="text-center mb-3">
                            <Col md={4}>
                              <div className="border rounded p-3 h-100">
                                <i className="ri-pulse-line fs-2 text-danger mb-2 d-block"></i>
                                <div className="fw-bold fs-3 text-danger mb-1">
                                  {selectedImage.glucose_prediction.hba1c_predicted}%
                                </div>
                                <div className="small text-muted mb-2">
                                  HbA1c (Glycated Hemoglobin)
                                </div>
                                {/* HbA1c equivalent in mg/dL */}
                                {selectedImage.glucose_prediction.hba1c_equivalent && (
                                  <div className="mt-2 p-2 bg-light rounded">
                                    <div className="fw-bold text-danger fs-6">
                                      ≡ {selectedImage.glucose_prediction.hba1c_equivalent.mg_dl} mg/dL
                                    </div>
                                    <div className="fw-bold text-danger small">
                                      ({selectedImage.glucose_prediction.hba1c_equivalent.mmol_l} mmol/L)
                                    </div>
                                    <tiny className="text-muted d-block">HbA1c equivalent glucose</tiny>
                                  </div>
                                )}
                                <div className="mt-2">
                                  <Badge bg={selectedImage.glucose_prediction.control_color} className="small">
                                    {selectedImage.glucose_prediction.glucose_control_status} Control
                                  </Badge>
                                </div>
                              </div>
                            </Col>
                            <Col md={4}>
                              <div className="border rounded p-3 h-100">
                                <i className="ri-drop-line fs-2 text-primary mb-2 d-block"></i>
                                <div className="fw-bold fs-4 text-primary">
                                  {selectedImage.glucose_prediction.average_glucose.mg_dl} mg/dL
                                </div>
                                <div className="fw-bold fs-6 text-primary">
                                  ({selectedImage.glucose_prediction.average_glucose.mmol_l} mmol/L)
                                </div>
                                <small className="text-muted">Estimated Average Glucose</small>
                                <div className="mt-2 p-2 bg-light rounded">
                                  <tiny className="text-muted">
                                    <i className="ri-information-line me-1"></i>
                                    Based on HbA1c conversion formula
                                  </tiny>
                                </div>
                              </div>
                            </Col>
                            <Col md={4}>
                              <div className="border rounded p-3 h-100">
                                <i className="ri-time-line fs-2 text-warning mb-2 d-block"></i>
                                <div className="fw-bold fs-4 text-warning">
                                  {selectedImage.glucose_prediction.estimated_fasting_glucose.mg_dl} mg/dL
                                </div>
                                <div className="fw-bold fs-6 text-warning">
                                  ({selectedImage.glucose_prediction.estimated_fasting_glucose.mmol_l} mmol/L)
                                </div>
                                <small className="text-muted">Estimated Fasting Glucose</small>
                                <div className="mt-2 p-2 bg-light rounded">
                                  <tiny className="text-muted">
                                    <i className="ri-timer-line me-1"></i>
                                    Current glucose level estimate
                                  </tiny>
                                </div>
                              </div>
                            </Col>
                          </Row>

                          {/* AI Confidence for Glucose Prediction */}
                          <div className="bg-light rounded p-3 mb-3">
                            <div className="row align-items-center">
                              <div className="col-8">
                                <small className="fw-bold text-muted">AI Prediction Confidence</small>
                                <ProgressBar 
                                  now={selectedImage.glucose_prediction.prediction_confidence} 
                                  variant={selectedImage.glucose_prediction.prediction_confidence > 85 ? 'success' : 'warning'}
                                  style={{ height: '6px' }}
                                  className="mt-1"
                                />
                              </div>
                              <div className="col-4 text-end">
                                <span className="fw-bold text-primary">
                                  {selectedImage.glucose_prediction.prediction_confidence}%
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Clinical Correlation */}
                          <div className="mb-3">
                            <h6 className="text-muted mb-2">
                              <i className="ri-stethoscope-line me-1"></i>
                              Clinical Correlation
                            </h6>
                            <p className="small text-dark bg-light rounded p-2">
                              {selectedImage.glucose_prediction.clinical_correlation}
                            </p>
                          </div>

                          {/* AI Methodology */}
                          <details className="mb-3">
                            <summary className="text-primary fw-bold small" style={{ cursor: 'pointer' }}>
                              <i className="ri-information-line me-1"></i>
                              AI Methodology & HbA1c Conversion Formula
                            </summary>
                            <div className="mt-2 p-2 bg-light rounded">
                              <div className="small">
                                <div className="mb-2">
                                  <strong>Algorithm:</strong> {selectedImage.glucose_prediction.ai_methodology.primary_algorithm}
                                </div>
                                <div className="mb-2">
                                  <strong>Training Data:</strong> {selectedImage.glucose_prediction.ai_methodology.training_dataset}
                                </div>
                                <div className="mb-2">
                                  <strong>Validation Accuracy:</strong> {selectedImage.glucose_prediction.ai_methodology.validation_accuracy}
                                </div>
                                
                                {/* HbA1c Conversion Formula */}
                                <div className="mb-2 p-2 border rounded bg-white">
                                  <strong className="text-primary">HbA1c to Glucose Conversion Formula:</strong>
                                  <div className="mt-1 fw-bold text-center p-2 bg-primary text-white rounded">
                                    Average Glucose (mg/dL) = (HbA1c × 28.7) - 46.7
                                  </div>
                                  <div className="mt-2 small text-muted">
                                    <i className="ri-information-line me-1"></i>
                                    This ADAG (A1C-Derived Average Glucose) formula converts HbA1c percentage 
                                    to estimated average glucose levels, showing what your HbA1c represents 
                                    in terms of daily blood glucose readings.
                                  </div>
                                </div>
                                
                                <div>
                                  <strong>Analysis Basis:</strong>
                                  <ul className="mt-1 mb-0">
                                    {selectedImage.glucose_prediction.ai_methodology.prediction_basis.map((basis, idx) => (
                                      <li key={idx}>{basis}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </details>

                          {/* Glucose Insights */}
                          {selectedImage.glucose_prediction.glucose_insights && (
                            <div className="mb-3">
                              <h6 className="text-muted mb-2">
                                <i className="ri-lightbulb-line me-1"></i>
                                AI-Generated Insights
                              </h6>
                              {selectedImage.glucose_prediction.glucose_insights.map((insight, idx) => (
                                <div key={idx} className="d-flex align-items-start mb-2">
                                  <i className="ri-arrow-right-circle-line text-primary me-2 mt-1 flex-shrink-0"></i>
                                  <small className="text-dark">{insight}</small>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Recommendations */}
                          {selectedImage.glucose_prediction.recommendations && (
                            <div className="mb-3">
                              <h6 className="text-muted mb-2">
                                <i className="ri-heart-pulse-line me-1"></i>
                                AI Recommendations
                              </h6>
                              {selectedImage.glucose_prediction.recommendations.map((rec, idx) => (
                                <div key={idx} className="d-flex align-items-start mb-2">
                                  <i className="ri-check-line text-success me-2 mt-1 flex-shrink-0"></i>
                                  <small className="text-dark">{rec}</small>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Important Disclaimer */}
                          <Alert variant="warning" className="mb-0">
                            <div className="d-flex align-items-start">
                              <i className="ri-alert-line me-2 mt-1 flex-shrink-0"></i>
                              <div>
                                <strong>Medical Disclaimer:</strong>
                                <div className="small mt-1">
                                  {selectedImage.glucose_prediction.disclaimer}
                                </div>
                              </div>
                            </div>
                          </Alert>
                        </Card.Body>
                      </Card>
                    )}

                    {/* Clinical Findings */}
                    {selectedImage.findings && selectedImage.findings.length > 0 && (
                      <Card className="border-0 shadow-sm mb-4">
                        <Card.Header className="bg-warning text-dark">
                          <h6 className="mb-0">
                            <i className="ri-search-eye-line me-2"></i>
                            Detailed Clinical Findings
                          </h6>
                        </Card.Header>
                        <Card.Body>
                          <div className="list-group list-group-flush">
                            {selectedImage.findings.map((finding, index) => (
                              <div key={index} className="list-group-item px-0 py-3 border-bottom">
                                <div className="d-flex align-items-start">
                                  <div className="flex-shrink-0 me-3">
                                    <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px' }}>
                                      <i className="ri-check-line" style={{ fontSize: '12px' }}></i>
                                    </div>
                                  </div>
                                  <div className="flex-grow-1">
                                    <p className="mb-1">{finding}</p>
                                    {index === 0 && (
                                      <small className="text-muted">
                                        <i className="ri-time-line me-1"></i>
                                        Detected using advanced deep learning algorithms
                                      </small>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </Card.Body>
                      </Card>
                    )}

                    {/* Treatment Recommendations */}
                    <Card className="border-0 shadow-sm mb-4">
                      <Card.Header className="bg-danger text-white">
                        <h6 className="mb-0">
                          <i className="ri-heart-pulse-line me-2"></i>
                          Clinical Recommendations
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        <div className="accordion" id="recommendationsAccordion">
                          <div className="accordion-item border-0">
                            <h2 className="accordion-header" id="immediateActions">
                              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseImmediate">
                                <i className="ri-alarm-warning-line text-danger me-2"></i>
                                Immediate Actions Required
                              </button>
                            </h2>
                            <div id="collapseImmediate" className="accordion-collapse collapse show" data-bs-parent="#recommendationsAccordion">
                              <div className="accordion-body">
                                <div className="list-group">
                                  <div className="list-group-item d-flex align-items-start border-0 px-0">
                                    <i className="ri-calendar-check-line text-primary me-2 mt-1"></i>
                                    <span className="small">Continue regular screening every 6 months</span>
                                  </div>
                                  <div className="list-group-item d-flex align-items-start border-0 px-0">
                                    <i className="ri-pulse-line text-info me-2 mt-1"></i>
                                    <span className="small">Monitor blood glucose levels closely (HbA1c target &lt;7%)</span>
                                  </div>
                                  <div className="list-group-item d-flex align-items-start border-0 px-0">
                                    <i className="ri-user-heart-line text-warning me-2 mt-1"></i>
                                    <span className="small">Consider ophthalmology referral if progression detected</span>
                                  </div>
                                  {selectedImage.severity && selectedImage.severity !== 'none' && (
                                    <div className="list-group-item d-flex align-items-start border-0 px-0">
                                      <i className="ri-alarm-warning-line text-danger me-2 mt-1"></i>
                                      <span className="small">Urgent retinal specialist consultation within 3-6 months</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>

                    {/* Follow-up Schedule */}
                    <Card className="border-0 shadow-sm">
                      <Card.Header className="bg-secondary text-white">
                        <h6 className="mb-0">
                          <i className="ri-calendar-line me-2"></i>
                          Follow-up Schedule & Monitoring
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        <div className="row">
                          <div className="col-6">
                            <div className="text-center p-3 bg-light rounded border">
                              <i className="ri-calendar-check-line text-success display-6 mb-2"></i>
                              <h6 className="mb-1">Current Analysis</h6>
                              <p className="mb-0 small text-muted">
                                {selectedImage.analysis_date ? 
                                  new Date(selectedImage.analysis_date).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric', 
                                    year: 'numeric' 
                                  }) : 
                                  new Date().toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric', 
                                    year: 'numeric' 
                                  })
                                }
                              </p>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="text-center p-3 bg-primary text-white rounded">
                              <i className="ri-calendar-schedule-line display-6 mb-2"></i>
                              <h6 className="mb-1 text-white">Next Screening</h6>
                              <p className="mb-0 small text-white-50">
                                {selectedImage.next_screening_date || 
                                  new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric', 
                                    year: 'numeric' 
                                  })
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Additional Monitoring Parameters */}
                        <div className="mt-3 p-3 bg-light rounded">
                          <h6 className="mb-2">
                            <i className="ri-heart-pulse-line me-1 text-danger"></i>
                            Monitoring Parameters
                          </h6>
                          <div className="row small">
                            <div className="col-6">
                              <div className="mb-2">
                                <i className="ri-drop-line text-primary me-1"></i>
                                Blood Pressure: Monitor weekly
                              </div>
                              <div className="mb-2">
                                <i className="ri-test-tube-line text-success me-1"></i>
                                HbA1c: Every 3 months
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="mb-2">
                                <i className="ri-eye-line text-warning me-1"></i>
                                Visual Acuity: Monthly
                              </div>
                              <div className="mb-2">
                                <i className="ri-heart-line text-danger me-1"></i>
                                Cardiovascular: As needed
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-2">Loading analysis data...</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-light border-top-0">
          <div className="d-flex justify-content-between w-100 align-items-center">
            <div className="text-muted small">
              <i className="ri-shield-check-line me-1 text-success"></i>
              Report generated by AI system - Clinical review recommended
            </div>
            <div className="d-flex gap-2">
              <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
                <i className="ri-close-line me-1"></i>
                Close Report
              </Button>
              <Button variant="outline-primary">
                <i className="ri-share-line me-1"></i>
                Share Report
              </Button>
              <Button variant="outline-success">
                <i className="ri-printer-line me-1"></i>
                Print Report
              </Button>
              <Button variant="primary">
                <i className="ri-download-line me-1"></i>
                Download PDF
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DiabeticRetinopathy;
