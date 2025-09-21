import React, { useState, useEffect, useCallback } from 'react';
import { 
  Toast, 
  ToastContainer, 
  Badge, 
  Button,
  Alert,
  Card,
  Row,
  Col
} from 'react-bootstrap';
import CancerDetectionNotification from './CancerDetectionNotification';
import DetailedCancerAnalysis from './DetailedCancerAnalysis';
import CancerDetectionReportGenerator from './CancerDetectionReportGenerator';

const CancerDetectionNotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);
  const [showMainAlert, setShowMainAlert] = useState(false);
  const [currentDetection, setCurrentDetection] = useState(null);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const [showReportGenerator, setShowReportGenerator] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMonitoring, setIsMonitoring] = useState(true);

  // Simulate real-time monitoring
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      // Simulate random cancer detection (very low probability for demo)
      if (Math.random() > 0.99) { // 1% chance per check
        generateCancerDetectionAlert();
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const generateCancerDetectionAlert = useCallback(() => {
    const mockDetection = {
      id: `cancer_det_${Date.now()}`,
      patient_name: `${['John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Davis', 'Michael Wilson'][Math.floor(Math.random() * 5)]}`,
      patient_id: `P${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      patient_age: 45 + Math.floor(Math.random() * 30),
      patient_gender: ['Male', 'Female'][Math.floor(Math.random() * 2)],
      patient_contact: `+1-555-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      
      // Detection Details
      detected_at: new Date().toISOString(),
      risk_level: ['high', 'critical'][Math.floor(Math.random() * 2)],
      ai_confidence: 0.85 + Math.random() * 0.14, // 85-99%
      analysis_type: 'oral_cancer_screening',
      ai_model_version: 'CancerDetectionAI-v3.2.1',
      processing_time: 1200 + Math.floor(Math.random() * 800),

      // Risk Factors
      risk_factors: [
        { 
          factor: 'Tobacco Use', 
          description: 'Heavy smoking history (20+ years)' 
        },
        { 
          factor: 'Alcohol Consumption', 
          description: 'Regular alcohol consumption (>3 drinks/day)' 
        },
        { 
          factor: 'Age Factor', 
          description: 'Age >40 years with increased risk' 
        },
        { 
          factor: 'Previous Oral Lesions', 
          description: 'History of premalignant lesions' 
        }
      ],

      // Suspicious Areas
      suspicious_areas: [
        {
          location: ['tongue', 'floor_of_mouth', 'gums', 'buccal_mucosa'][Math.floor(Math.random() * 4)],
          characteristics: ['ulceration', 'white_patch', 'red_patch', 'indurated_mass'][Math.floor(Math.random() * 4)],
          size_mm: 5 + Math.random() * 15,
          confidence: 0.80 + Math.random() * 0.19,
          recommendation: 'Immediate biopsy required'
        }
      ],

      // Medical History
      medical_history: 'Hypertension, diabetes mellitus type 2, previous basal cell carcinoma',

      // Recommendations
      urgent_recommendations: [
        'IMMEDIATE referral to Oral & Maxillofacial Surgeon',
        'Tissue biopsy within 24-48 hours',
        'CT scan for staging assessment',
        'Inform patient of findings with sensitivity'
      ],
      
      followup_recommendations: [
        'Multidisciplinary team consultation',
        'Patient counseling and support',
        'Family history assessment',
        'Smoking cessation counseling if applicable'
      ],

      // Images
      analyzed_images: [
        {
          type: 'Intraoral Photography',
          thumbnail: '/api/placeholder/300/200',
          confidence: 0.89
        },
        {
          type: 'Fluorescence Imaging',
          thumbnail: '/api/placeholder/300/200', 
          confidence: 0.91
        }
      ],

      // Status
      status: 'pending_review',
      priority: 'urgent',
      department: 'Oral Pathology'
    };

    setNotifications(prev => [mockDetection, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Auto-show the critical alert
    setCurrentDetection(mockDetection);
    setShowMainAlert(true);

    // Browser notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🚨 URGENT: Cancer Cells Detected!', {
        body: `Potential malignancy detected in patient: ${mockDetection.patient_name}`,
        icon: '/cancer-alert-icon.png',
        tag: mockDetection.id,
        requireInteraction: true
      });
    }
  }, []);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleViewDetailedAnalysis = (detectionData) => {
    setCurrentDetection(detectionData);
    setShowMainAlert(false);
    setShowDetailedAnalysis(true);
  };

  const handleMarkAsReviewed = (detectionId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === detectionId 
          ? { ...notif, status: 'reviewed', reviewed_at: new Date().toISOString() }
          : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleSaveAnalysis = async (analysisData) => {
    try {
      // Simulate API call to save analysis
      console.log('Saving analysis:', analysisData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update notification status
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === analysisData.detection_id 
            ? { ...notif, status: 'analysis_complete', analysis_data: analysisData }
            : notif
        )
      );
      
      return { success: true };
    } catch (error) {
      console.error('Error saving analysis:', error);
      throw error;
    }
  };

  const handleGenerateReport = async (analysisData) => {
    try {
      // Simulate report generation
      console.log('Generating comprehensive cancer analysis report...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create downloadable report
      const reportData = {
        patient: currentDetection?.patient_name,
        generated_at: new Date().toISOString(),
        analysis: analysisData,
        report_type: 'Comprehensive Cancer Analysis Report'
      };
      
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Cancer_Analysis_Report_${currentDetection?.patient_name?.replace(/\s+/g, '_')}_${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // Demo function to simulate detection
  const simulateDetection = () => {
    generateCancerDetectionAlert();
  };

  return (
    <>
      {/* Notification Badge for Dashboard */}
      {unreadCount > 0 && (
        <div className="position-fixed" style={{ top: '20px', right: '20px', zIndex: 9999 }}>
          <Alert variant="danger" className="shadow-lg border-0">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <Alert.Heading className="h6 mb-1">
                  <i className="ri-alert-fill me-2"></i>
                  🚨 URGENT Cancer Detection Alerts
                </Alert.Heading>
                <p className="mb-2">
                  {unreadCount} new cancer detection{unreadCount !== 1 ? 's' : ''} requiring immediate attention
                </p>
              </div>
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={() => {
                  if (notifications.length > 0) {
                    setCurrentDetection(notifications[0]);
                    setShowMainAlert(true);
                  }
                }}
              >
                <i className="ri-eye-line me-1"></i>
                Review Now
              </Button>
            </div>
          </Alert>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9998 }}>
        {notifications.slice(0, 3).map((notification) => (
          <Toast 
            key={notification.id}
            show={true}
            className="border-danger"
            style={{ minWidth: '400px' }}
          >
            <Toast.Header className="bg-danger text-white">
              <i className="ri-alert-fill me-2"></i>
              <strong className="me-auto">Cancer Detection Alert</strong>
              <Badge bg="light" text="dark">
                AI: {Math.round(notification.ai_confidence * 100)}%
              </Badge>
            </Toast.Header>
            <Toast.Body>
              <div className="mb-2">
                <strong>Patient:</strong> {notification.patient_name}<br/>
                <strong>Risk Level:</strong> 
                <Badge bg="danger" className="ms-2">
                  {notification.risk_level?.toUpperCase()}
                </Badge>
              </div>
              <div className="d-flex gap-2">
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => {
                    setCurrentDetection(notification);
                    setShowMainAlert(true);
                  }}
                >
                  <i className="ri-eye-line me-1"></i>
                  Review
                </Button>
                <Button 
                  variant="outline-info" 
                  size="sm"
                  onClick={() => handleViewDetailedAnalysis(notification)}
                >
                  <i className="ri-microscope-line me-1"></i>
                  Analyze
                </Button>
              </div>
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>

      {/* Demo/Testing Controls */}
      <Card className="position-fixed" style={{ bottom: '20px', right: '20px', zIndex: 9999, width: '300px' }}>
        <Card.Header className="bg-dark text-white">
          <h6 className="mb-0">
            <i className="ri-settings-line me-2"></i>
            Cancer Detection System
          </h6>
        </Card.Header>
        <Card.Body>
          <div className="mb-2">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small">System Status:</span>
              <Badge bg={isMonitoring ? 'success' : 'danger'}>
                {isMonitoring ? 'Monitoring' : 'Paused'}
              </Badge>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small">Active Alerts:</span>
              <Badge bg="info">{unreadCount}</Badge>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <span className="small">Total Detections:</span>
              <Badge bg="secondary">{notifications.length}</Badge>
            </div>
          </div>
          
          <div className="d-grid gap-2">
            <Button 
              variant="warning" 
              size="sm"
              onClick={simulateDetection}
            >
              <i className="ri-test-tube-line me-1"></i>
              Simulate Detection
            </Button>
            
            <Button 
              variant={isMonitoring ? 'danger' : 'success'} 
              size="sm"
              onClick={() => setIsMonitoring(!isMonitoring)}
            >
              <i className={`ri-${isMonitoring ? 'pause' : 'play'}-line me-1`}></i>
              {isMonitoring ? 'Pause' : 'Resume'} Monitoring
            </Button>
            
            {notifications.length > 0 && (
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={clearAllNotifications}
              >
                <i className="ri-delete-bin-line me-1"></i>
                Clear All
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Main Alert Modal */}
      <CancerDetectionNotification
        show={showMainAlert}
        onHide={() => setShowMainAlert(false)}
        detectionData={currentDetection}
        onViewDetailedAnalysis={handleViewDetailedAnalysis}
        onMarkAsReviewed={handleMarkAsReviewed}
      />

      {/* Detailed Analysis Modal */}
      <DetailedCancerAnalysis
        show={showDetailedAnalysis}
        onHide={() => setShowDetailedAnalysis(false)}
        detectionData={currentDetection}
        onSaveAnalysis={handleSaveAnalysis}
        onGenerateReport={handleGenerateReport}
      />

      {/* PDF Report Generator Modal */}
      <CancerDetectionReportGenerator
        detection={currentDetection}
        show={showReportGenerator}
        onHide={() => setShowReportGenerator(false)}
        onReportGenerated={() => {
          setShowReportGenerator(false);
          handleGenerateReport();
        }}
      />

      <style jsx>{`
        @keyframes alertPulse {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(220, 53, 69, 0.4);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 30px rgba(220, 53, 69, 0.8);
            transform: scale(1.02);
          }
        }
        
        .cancer-alert {
          animation: alertPulse 2s infinite;
        }
        
        .toast {
          animation: slideInRight 0.5s ease-out;
        }
        
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default CancerDetectionNotificationSystem;
