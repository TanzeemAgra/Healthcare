import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Badge, Alert, Modal, InputGroup, ProgressBar, Nav, Tab } from 'react-bootstrap';

const HomeopathyPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showNewPrescriptionModal, setShowNewPrescriptionModal] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  const [showAIAnalyticsModal, setShowAIAnalyticsModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalytics, setAiAnalytics] = useState(null);
  const [analyticsTab, setAnalyticsTab] = useState('overview');

  const mockPrescriptions = [
    {
      id: 1,
      prescriptionId: 'RX001',
      patientName: 'Sarah Johnson',
      patientId: 1,
      date: '2025-07-28',
      remedy: 'Belladonna',
      potency: '30C',
      dosage: '3 pellets, 3 times daily',
      duration: '7 days',
      status: 'Active',
      chiefComplaint: 'Chronic Migraine',
      instructions: 'Take on empty stomach, avoid mint and coffee',
      followUpDate: '2025-08-05',
      aiRecommendation: 'Good remedy selection based on symptom picture',
      confidenceScore: 92,
      alternativeRemedies: ['Natrum Muriaticum', 'Pulsatilla'],
      prescription: {
        symptoms: ['Throbbing headache', 'Worse from light', 'Worse from noise', 'Better from pressure'],
        modalities: 'Worse: light, noise, motion. Better: pressure, lying down',
        constitution: 'Sanguine, robust, sudden complaints',
        previousRemedies: ['Bryonia (no effect)', 'Gelsemium (partial relief)']
      }
    },
    {
      id: 2,
      prescriptionId: 'RX002',
      patientName: 'Michael Chen',
      patientId: 2,
      date: '2025-07-25',
      remedy: 'Arsenicum Album',
      potency: '200C',
      dosage: '2 pellets, twice daily',
      duration: '14 days',
      status: 'Active',
      chiefComplaint: 'Anxiety & Insomnia',
      instructions: 'Take morning and evening, avoid strong odors',
      followUpDate: '2025-08-08',
      aiRecommendation: 'Excellent constitutional match with high confidence',
      confidenceScore: 96,
      alternativeRemedies: ['Phosphorus', 'Lycopodium'],
      prescription: {
        symptoms: ['Anxiety about health', 'Restless at night', 'Fear of being alone', 'Perfectionist tendencies'],
        modalities: 'Worse: after midnight, cold. Better: warmth, company',
        constitution: 'Lean, anxious, meticulous',
        previousRemedies: ['Aconitum (temporary relief)', 'Ignatia (mood swings)']
      }
    },
    {
      id: 3,
      prescriptionId: 'RX003',
      patientName: 'Emma Davis',
      patientId: 3,
      date: '2025-07-20',
      remedy: 'Nux Vomica',
      potency: '6C',
      dosage: '4 pellets, morning only',
      duration: '10 days',
      status: 'Completed',
      chiefComplaint: 'Digestive Issues',
      instructions: 'Take before breakfast, lifestyle modifications advised',
      followUpDate: '2025-07-30',
      aiRecommendation: 'Consider higher potency if partial response',
      confidenceScore: 78,
      alternativeRemedies: ['Lycopodium', 'Sulphur'],
      prescription: {
        symptoms: ['Chronic constipation', 'Morning headaches', 'Irritability', 'Overwork stress'],
        modalities: 'Worse: morning, stress, coffee. Better: rest, warm weather',
        constitution: 'Ambitious, impatient, stress-prone',
        previousRemedies: ['Bryonia (minimal effect)']
      }
    },
    {
      id: 4,
      prescriptionId: 'RX004',
      patientName: 'David Wilson',
      patientId: 4,
      date: '2025-07-15',
      remedy: 'Rhus Toxicodendron',
      potency: '30C',
      dosage: '3 pellets, 4 times daily',
      duration: '21 days',
      status: 'Expired',
      chiefComplaint: 'Joint Pain & Stiffness',
      instructions: 'Take with water, gentle exercise recommended',
      followUpDate: '2025-08-05',
      aiRecommendation: 'Monitor for improvement in morning stiffness',
      confidenceScore: 88,
      alternativeRemedies: ['Bryonia', 'Ruta Graveolens'],
      prescription: {
        symptoms: ['Morning stiffness', 'Better with movement', 'Worse in damp weather', 'Restless legs'],
        modalities: 'Worse: rest, damp weather. Better: motion, warmth',
        constitution: 'Active person, weather-sensitive',
        previousRemedies: ['Arnica (temporary relief)']
      }
    }
  ];

  useEffect(() => {
    setPrescriptions(mockPrescriptions);
    setFilteredPrescriptions(mockPrescriptions);
  }, []);

  useEffect(() => {
    filterPrescriptions();
  }, [searchTerm, statusFilter, activeTab, prescriptions]);

  const filterPrescriptions = () => {
    let filtered = prescriptions;

    // Filter by tab
    if (activeTab === 'active') {
      filtered = filtered.filter(rx => rx.status === 'Active');
    } else if (activeTab === 'completed') {
      filtered = filtered.filter(rx => rx.status === 'Completed');
    } else if (activeTab === 'expired') {
      filtered = filtered.filter(rx => rx.status === 'Expired');
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(rx => 
        rx.status.toLowerCase().includes(statusFilter.toLowerCase())
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(rx => 
        rx.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rx.remedy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rx.prescriptionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rx.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPrescriptions(filtered);
  };

  const handlePrescriptionSelect = (prescription) => {
    setSelectedPrescription(prescription);
    setShowPrescriptionModal(true);
  };

  const getStatusBadgeVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'success';
      case 'completed': return 'primary';
      case 'expired': return 'danger';
      case 'pending': return 'warning';
      default: return 'secondary';
    }
  };

  const getConfidenceColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 80) return 'warning';
    return 'danger';
  };

  const isExpiringSoon = (prescription) => {
    const followUpDate = new Date(prescription.followUpDate);
    const today = new Date();
    const diffTime = followUpDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  // Export functionality
  const handleExportPrescriptions = () => {
    setIsExporting(true);
    
    try {
      // Create comprehensive CSV export
      let csvContent = "data:text/csv;charset=utf-8,";
      
      // Header
      csvContent += "Homeopathy Prescription Export\n";
      csvContent += `Generated on: ${new Date().toLocaleString()}\n`;
      csvContent += `Total Prescriptions: ${prescriptions.length}\n\n`;
      
      // CSV Headers
      csvContent += "Prescription ID,Patient Name,Date,Remedy,Potency,Dosage,Duration,Status,Chief Complaint,Instructions,Follow-up Date,AI Confidence,AI Recommendation,Alternative Remedies,Symptoms,Modalities,Constitution\n";
      
      // Prescription data
      prescriptions.forEach(prescription => {
        const row = [
          `"${prescription.prescriptionId}"`,
          `"${prescription.patientName}"`,
          `"${prescription.date}"`,
          `"${prescription.remedy}"`,
          `"${prescription.potency}"`,
          `"${prescription.dosage}"`,
          `"${prescription.duration}"`,
          `"${prescription.status}"`,
          `"${prescription.chiefComplaint}"`,
          `"${prescription.instructions}"`,
          `"${prescription.followUpDate}"`,
          prescription.confidenceScore,
          `"${prescription.aiRecommendation}"`,
          `"${prescription.alternativeRemedies.join('; ')}"`,
          `"${prescription.prescription.symptoms.join('; ')}"`,
          `"${prescription.prescription.modalities}"`,
          `"${prescription.prescription.constitution}"`
        ].join(',');
        csvContent += row + "\n";
      });

      // Create download
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `homeopathy_prescriptions_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        setIsExporting(false);
        alert(`✅ Export Complete!\n\n${prescriptions.length} prescriptions exported successfully.`);
      }, 1000);
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
      alert('Export failed. Please try again.');
    }
  };

  // Advanced AI Analytics with Generative AI Concepts
  const handleAIAnalytics = () => {
    setIsAnalyzing(true);
    setShowAIAnalyticsModal(true);
    
    // Simulate advanced AI analysis
    setTimeout(() => {
      const analytics = generateAdvancedAIAnalytics();
      setAiAnalytics(analytics);
      setIsAnalyzing(false);
    }, 3000);
  };

  const generateAdvancedAIAnalytics = () => {
    const activeRx = prescriptions.filter(rx => rx.status === 'Active');
    const completedRx = prescriptions.filter(rx => rx.status === 'Completed');
    
    // Advanced AI-driven analytics
    const analytics = {
      overview: {
        totalPrescriptions: prescriptions.length,
        avgConfidenceScore: (prescriptions.reduce((sum, rx) => sum + rx.confidenceScore, 0) / prescriptions.length).toFixed(1),
        successRate: ((completedRx.length / prescriptions.length) * 100).toFixed(1),
        aiPredictedOutcomes: Math.floor(Math.random() * 20) + 80
      },
      remedyAnalysis: {
        mostPrescribed: getMostPrescribedRemedies(),
        highestSuccess: getHighestSuccessRemedies(),
        emergingTrends: getEmergingTrends(),
        potencyDistribution: getPotencyDistribution()
      },
      patientInsights: {
        constitutionalTypes: getConstitutionalAnalysis(),
        symptomClusters: getSymptomClusters(),
        treatmentPatterns: getTreatmentPatterns(),
        responsePredicators: getResponsePredictors()
      },
      predictiveAnalytics: {
        futureOutcomes: generateFutureOutcomes(),
        riskAssessment: generateRiskAssessment(),
        optimizationSuggestions: getOptimizationSuggestions(),
        personalizedRecommendations: getPersonalizedRecommendations()
      },
      aiInsights: {
        generativeRecommendations: generateGenerativeRecommendations(),
        caseSimilarity: analyzeCaseSimilarity(),
        treatmentEvolution: analyzeeTreatmentEvolution(),
        clinicalIntelligence: generateClinicalIntelligence()
      }
    };
    
    return analytics;
  };

  // Helper functions for AI analytics
  const getMostPrescribedRemedies = () => {
    const remedyCount = {};
    prescriptions.forEach(rx => {
      remedyCount[rx.remedy] = (remedyCount[rx.remedy] || 0) + 1;
    });
    return Object.entries(remedyCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([remedy, count]) => ({ remedy, count, percentage: ((count / prescriptions.length) * 100).toFixed(1) }));
  };

  const getHighestSuccessRemedies = () => {
    const remedySuccess = {};
    prescriptions.forEach(rx => {
      if (!remedySuccess[rx.remedy]) {
        remedySuccess[rx.remedy] = { total: 0, score: 0 };
      }
      remedySuccess[rx.remedy].total++;
      remedySuccess[rx.remedy].score += rx.confidenceScore;
    });
    
    return Object.entries(remedySuccess)
      .map(([remedy, data]) => ({
        remedy,
        avgScore: (data.score / data.total).toFixed(1),
        cases: data.total
      }))
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 5);
  };

  const getEmergingTrends = () => [
    {
      trend: "Constitutional Prescribing",
      confidence: 94,
      description: "Increased success with constitutional remedies over symptomatic",
      impact: "Higher long-term cure rates"
    },
    {
      trend: "Higher Potency Efficacy", 
      confidence: 87,
      description: "200C and above showing better outcomes than lower potencies",
      impact: "Faster symptom resolution"
    },
    {
      trend: "Mental-Emotional Focus",
      confidence: 91,
      description: "Cases with strong mental symptoms responding better",
      impact: "Improved patient satisfaction"
    }
  ];

  const getPotencyDistribution = () => {
    const potencies = {};
    prescriptions.forEach(rx => {
      potencies[rx.potency] = (potencies[rx.potency] || 0) + 1;
    });
    return Object.entries(potencies).map(([potency, count]) => ({
      potency,
      count,
      percentage: ((count / prescriptions.length) * 100).toFixed(1)
    }));
  };

  const getConstitutionalAnalysis = () => [
    { type: "Lean/Anxious (Arsenicum)", percentage: 28, characteristics: "Health anxiety, perfectionism, restlessness" },
    { type: "Robust/Sanguine (Belladonna)", percentage: 22, characteristics: "Sudden onset, full-blooded, energetic" },
    { type: "Philosophical/Hot (Sulphur)", percentage: 18, characteristics: "Theoretical mind, skin issues, warm-blooded" },
    { type: "Ambitious/Impatient (Nux)", percentage: 16, characteristics: "Stress-prone, digestive issues, competitive" },
    { type: "Sympathetic/Artistic (Phosphorus)", percentage: 16, characteristics: "Tall, lean, empathetic, respiratory issues" }
  ];

  const getSymptomClusters = () => [
    {
      cluster: "Anxiety-Insomnia-Digestive",
      frequency: "34%",
      commonRemedies: ["Arsenicum Album", "Lycopodium", "Nux Vomica"],
      aiInsight: "Strong correlation with modern lifestyle stress"
    },
    {
      cluster: "Headache-Photophobia-Irritability", 
      frequency: "26%",
      commonRemedies: ["Belladonna", "Natrum Mur", "Bryonia"],
      aiInsight: "Often triggered by weather changes and emotional stress"
    },
    {
      cluster: "Joint Pain-Stiffness-Weather Sensitivity",
      frequency: "22%", 
      commonRemedies: ["Rhus Tox", "Bryonia", "Calcarea Carb"],
      aiInsight: "Age-related patterns with seasonal variations"
    }
  ];

  const getTreatmentPatterns = () => [
    {
      pattern: "Single Remedy Approach",
      success: "89%",
      avgDuration: "18 days",
      description: "Classical single remedy prescribing showing highest success"
    },
    {
      pattern: "Constitutional + Acute",
      success: "76%", 
      avgDuration: "24 days",
      description: "Constitutional remedy with acute remedy support"
    },
    {
      pattern: "Progressive Potency",
      success: "82%",
      avgDuration: "21 days", 
      description: "Starting low potency and progressing higher"
    }
  ];

  const getResponsePredictors = () => [
    { factor: "Clear Mental Symptoms", predictiveValue: 94, description: "Strong mental picture increases success rate" },
    { factor: "Constitutional Match", predictiveValue: 91, description: "Remedy matching constitution shows better outcomes" },
    { factor: "Modality Clarity", predictiveValue: 87, description: "Clear better/worse conditions improve selection" },
    { factor: "Previous Remedy Response", predictiveValue: 84, description: "Response history helps predict future outcomes" }
  ];

  const generateFutureOutcomes = () => [
    {
      prescription: "RX001 - Sarah Johnson",
      predictedOutcome: "Complete Resolution",
      confidence: 89,
      timeline: "5-7 days",
      reasoning: "Strong symptom match, good constitutional fit"
    },
    {
      prescription: "RX002 - Michael Chen", 
      predictedOutcome: "Significant Improvement",
      confidence: 94,
      timeline: "10-14 days",
      reasoning: "Excellent constitutional match, high AI confidence"
    }
  ];

  const generateRiskAssessment = () => [
    {
      risk: "Treatment Resistance",
      level: "Low",
      percentage: 12,
      mitigation: "Monitor response patterns, consider constitutional analysis"
    },
    {
      risk: "Proving Symptoms",
      level: "Very Low", 
      percentage: 3,
      mitigation: "Appropriate potency selection, patient education"
    },
    {
      risk: "Incomplete Response",
      level: "Medium",
      percentage: 23,
      mitigation: "Consider miasmatic analysis, lifestyle factors"
    }
  ];

  const getOptimizationSuggestions = () => [
    {
      area: "Potency Selection",
      suggestion: "Consider 200C as starting potency for constitutional cases",
      impact: "15% improvement in response rate",
      evidence: "Analysis of 150+ cases shows higher success with 200C+"
    },
    {
      area: "Follow-up Timing",
      suggestion: "Schedule follow-ups at 7-10 day intervals for acute cases",
      impact: "Better monitoring and adjustment opportunities", 
      evidence: "Optimal timing based on homeopathic response patterns"
    },
    {
      area: "Case Taking",
      suggestion: "Focus more on mental-emotional symptoms for better remedy selection",
      impact: "12% improvement in AI confidence scores",
      evidence: "Mental symptoms show highest correlation with successful outcomes"
    }
  ];

  const getPersonalizedRecommendations = () => [
    {
      patientProfile: "High-stress professionals",
      recommendation: "Emphasize constitutional remedies with stress-related indications",
      remedyFocus: ["Nux Vomica", "Arsenicum Album", "Lycopodium"],
      successRate: "91%"
    },
    {
      patientProfile: "Children with behavioral issues",
      recommendation: "Consider family constitutional analysis for inherited patterns", 
      remedyFocus: ["Stramonium", "Cina", "Chamomilla"],
      successRate: "85%"
    }
  ];

  const generateGenerativeRecommendations = () => [
    {
      insight: "AI-Generated Remedy Combinations",
      recommendation: "Arsenicum Album followed by Sulphur shows enhanced outcomes in anxiety cases with skin manifestations",
      confidence: 87,
      evidenceBase: "Pattern recognition across 200+ similar cases"
    },
    {
      insight: "Predictive Symptom Mapping",
      recommendation: "Patients with digital eye strain patterns respond well to Ruta + Natrum Mur sequence",
      confidence: 82,
      evidenceBase: "Emerging trend in modern lifestyle-related complaints"
    }
  ];

  const analyzeCaseSimilarity = () => [
    {
      currentCase: "RX001 - Migraine Case",
      similarCases: 12,
      successfulTreatments: 10,
      commonPattern: "Sudden onset, photophobia, throbbing pain",
      optimalRemedy: "Belladonna 30C",
      alternativeSequence: "Belladonna → Natrum Mur if partial response"
    }
  ];

  const analyzeeTreatmentEvolution = () => [
    {
      timeframe: "Last 6 months",
      evolution: "Shift towards higher potencies and constitutional approach",
      improvement: "23% increase in cure rates",
      keyChanges: ["More 200C prescriptions", "Extended follow-up periods", "Focus on constitutional analysis"]
    }
  ];

  const generateClinicalIntelligence = () => [
    {
      intelligence: "Miasmatic Patterns",
      finding: "75% of chronic cases show psoric miasm dominance with sycotic overlay",
      clinical_relevance: "Consider anti-psoric remedies as constitutional base",
      recommendation: "Integrate miasmatic analysis in case evaluation"
    },
    {
      intelligence: "Seasonal Variations", 
      finding: "Respiratory cases increase 45% in winter, joint complaints peak in monsoon",
      clinical_relevance: "Prepare seasonal remedy protocols",
      recommendation: "Preventive constitutional strengthening before seasonal changes"
    }
  ];

  return (
    <div className="homeopathy-prescriptions">
      <Container fluid>
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="mb-1">Prescription Management</h2>
                <p className="text-muted mb-0">AI-powered prescription tracking and analysis</p>
              </div>
              <div className="d-flex gap-2">
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={handleExportPrescriptions}
                  disabled={isExporting}
                  title={`Export all ${prescriptions.length} prescriptions to CSV`}
                >
                  {isExporting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1"></span>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <i className="ri-download-line me-1"></i>Export
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline-info" 
                  size="sm"
                  onClick={handleAIAnalytics}
                  disabled={isAnalyzing}
                  title="Generate advanced AI analytics with Generative AI insights"
                >
                  {isAnalyzing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1"></span>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <i className="ri-brain-line me-1"></i>AI Analytics
                    </>
                  )}
                </Button>
                <Button variant="primary" size="sm" onClick={() => setShowNewPrescriptionModal(true)}>
                  <i className="ri-prescription-line me-1"></i>New Prescription
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Stats Cards */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="stat-icon bg-success bg-opacity-10 rounded-circle mx-auto mb-2">
                  <i className="ri-prescription-line text-success fs-4"></i>
                </div>
                <h4 className="mb-1">{prescriptions.filter(rx => rx.status === 'Active').length}</h4>
                <p className="text-muted mb-0 small">Active Prescriptions</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="stat-icon bg-warning bg-opacity-10 rounded-circle mx-auto mb-2">
                  <i className="ri-time-line text-warning fs-4"></i>
                </div>
                <h4 className="mb-1">{prescriptions.filter(rx => isExpiringSoon(rx)).length}</h4>
                <p className="text-muted mb-0 small">Expiring Soon</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="stat-icon bg-primary bg-opacity-10 rounded-circle mx-auto mb-2">
                  <i className="ri-check-line text-primary fs-4"></i>
                </div>
                <h4 className="mb-1">{prescriptions.filter(rx => rx.status === 'Completed').length}</h4>
                <p className="text-muted mb-0 small">Completed</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="stat-icon bg-info bg-opacity-10 rounded-circle mx-auto mb-2">
                  <i className="ri-brain-line text-info fs-4"></i>
                </div>
                <h4 className="mb-1">87%</h4>
                <p className="text-muted mb-0 small">AI Confidence Avg</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Search and Filters */}
        <Row className="mb-4">
          <Col lg={8}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <Row className="align-items-end">
                  <Col md={6}>
                    <Form.Label>Search Prescriptions</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="Search by patient, remedy, or prescription ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <Button variant="outline-secondary">
                        <i className="ri-search-line"></i>
                      </Button>
                    </InputGroup>
                  </Col>
                  <Col md={4}>
                    <Form.Label>Date Range</Form.Label>
                    <Form.Control type="date" />
                  </Col>
                  <Col md={2}>
                    <Button variant="outline-primary" className="w-100">
                      <i className="ri-filter-line me-1"></i>Filter
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="border-0 shadow-sm bg-light">
              <Card.Body>
                <h6 className="mb-2">
                  <i className="ri-alarm-warning-line text-warning me-1"></i>
                  Follow-up Reminders
                </h6>
                <small className="text-muted">3 patients need follow-up this week</small>
                <div className="mt-2">
                  <Button variant="outline-warning" size="sm">
                    <i className="ri-notification-line me-1"></i>View All
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Prescription Tabs */}
        <Row>
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-transparent border-0 pb-0">
                <Nav variant="tabs" className="border-0">
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === 'active'} 
                      onClick={() => setActiveTab('active')}
                      className="text-success"
                    >
                      <i className="ri-play-circle-line me-1"></i>
                      Active ({prescriptions.filter(rx => rx.status === 'Active').length})
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === 'completed'} 
                      onClick={() => setActiveTab('completed')}
                      className="text-primary"
                    >
                      <i className="ri-check-circle-line me-1"></i>
                      Completed ({prescriptions.filter(rx => rx.status === 'Completed').length})
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === 'expired'} 
                      onClick={() => setActiveTab('expired')}
                      className="text-danger"
                    >
                      <i className="ri-time-line me-1"></i>
                      Expired ({prescriptions.filter(rx => rx.status === 'Expired').length})
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === 'all'} 
                      onClick={() => setActiveTab('all')}
                      className="text-muted"
                    >
                      <i className="ri-list-check me-1"></i>
                      All ({prescriptions.length})
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Header>
              <Card.Body>
                <Table responsive className="table-hover">
                  <thead>
                    <tr className="text-muted">
                      <th>Prescription ID</th>
                      <th>Patient</th>
                      <th>Remedy & Potency</th>
                      <th>Chief Complaint</th>
                      <th>Status</th>
                      <th>AI Confidence</th>
                      <th>Follow-up Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPrescriptions.map((prescription) => (
                      <tr 
                        key={prescription.id} 
                        className="cursor-pointer" 
                        onClick={() => handlePrescriptionSelect(prescription)}
                      >
                        <td>
                          <strong>{prescription.prescriptionId}</strong>
                          <br />
                          <small className="text-muted">{prescription.date}</small>
                        </td>
                        <td>{prescription.patientName}</td>
                        <td>
                          <div>
                            <strong>{prescription.remedy}</strong>
                            <br />
                            <Badge bg="info" className="px-2 py-1">
                              {prescription.potency}
                            </Badge>
                          </div>
                        </td>
                        <td>{prescription.chiefComplaint}</td>
                        <td>
                          <Badge bg={getStatusBadgeVariant(prescription.status)}>
                            {prescription.status}
                          </Badge>
                          {isExpiringSoon(prescription) && (
                            <div>
                              <Badge bg="warning" className="mt-1">
                                <i className="ri-alarm-warning-line me-1"></i>
                                Expiring Soon
                              </Badge>
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <ProgressBar 
                              now={prescription.confidenceScore} 
                              className="me-2" 
                              style={{width: '80px', height: '8px'}}
                              variant={getConfidenceColor(prescription.confidenceScore)}
                            />
                            <small>{prescription.confidenceScore}%</small>
                          </div>
                        </td>
                        <td>
                          <span className={isExpiringSoon(prescription) ? 'text-danger fw-bold' : ''}>
                            {prescription.followUpDate}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePrescriptionSelect(prescription);
                              }}
                            >
                              <i className="ri-eye-line"></i>
                            </Button>
                            <Button variant="outline-success" size="sm">
                              <i className="ri-edit-line"></i>
                            </Button>
                            <Button variant="outline-info" size="sm">
                              <i className="ri-printer-line"></i>
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
      </Container>

      {/* Prescription Details Modal */}
      <Modal show={showPrescriptionModal} onHide={() => setShowPrescriptionModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-prescription-line me-2 text-primary"></i>
            Prescription Details - {selectedPrescription?.prescriptionId}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPrescription && (
            <Row>
              <Col lg={8}>
                {/* Prescription Details */}
                <Card className="border-0 bg-light mb-3">
                  <Card.Header className="bg-transparent">
                    <h6 className="mb-0">Prescription Information</h6>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <p><strong>Patient:</strong> {selectedPrescription.patientName}</p>
                        <p><strong>Date Prescribed:</strong> {selectedPrescription.date}</p>
                        <p><strong>Chief Complaint:</strong> {selectedPrescription.chiefComplaint}</p>
                        <p><strong>Remedy:</strong> {selectedPrescription.remedy}</p>
                        <p><strong>Potency:</strong> {selectedPrescription.potency}</p>
                      </Col>
                      <Col md={6}>
                        <p><strong>Dosage:</strong> {selectedPrescription.dosage}</p>
                        <p><strong>Duration:</strong> {selectedPrescription.duration}</p>
                        <p><strong>Follow-up Date:</strong> {selectedPrescription.followUpDate}</p>
                        <p><strong>Status:</strong> 
                          <Badge bg={getStatusBadgeVariant(selectedPrescription.status)} className="ms-2">
                            {selectedPrescription.status}
                          </Badge>
                        </p>
                      </Col>
                    </Row>
                    <Alert variant="info">
                      <strong>Instructions:</strong> {selectedPrescription.instructions}
                    </Alert>
                  </Card.Body>
                </Card>

                {/* Symptom Picture */}
                <Card className="border-0 bg-light mb-3">
                  <Card.Header className="bg-transparent">
                    <h6 className="mb-0">Symptom Picture & Analysis</h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-3">
                      <strong>Key Symptoms:</strong>
                      <ul className="mt-2">
                        {selectedPrescription.prescription.symptoms.map((symptom, index) => (
                          <li key={index}>{symptom}</li>
                        ))}
                      </ul>
                    </div>
                    <p><strong>Modalities:</strong> {selectedPrescription.prescription.modalities}</p>
                    <p><strong>Constitution:</strong> {selectedPrescription.prescription.constitution}</p>
                    
                    {selectedPrescription.prescription.previousRemedies.length > 0 && (
                      <div>
                        <strong>Previous Remedies:</strong>
                        <ul className="mt-2">
                          {selectedPrescription.prescription.previousRemedies.map((remedy, index) => (
                            <li key={index}>{remedy}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={4}>
                {/* AI Analysis */}
                <Card className="border-0 shadow-sm mb-3">
                  <Card.Header className="bg-success text-white">
                    <h6 className="mb-0">
                      <i className="ri-brain-line me-1"></i>
                      AI Analysis
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-3">
                      <small className="text-muted">Confidence Score</small>
                      <div className="d-flex align-items-center">
                        <ProgressBar 
                          now={selectedPrescription.confidenceScore} 
                          className="flex-grow-1 me-2" 
                          style={{height: '12px'}}
                          variant={getConfidenceColor(selectedPrescription.confidenceScore)}
                        />
                        <strong>{selectedPrescription.confidenceScore}%</strong>
                      </div>
                    </div>
                    
                    <Alert variant="info" className="mt-3">
                      <strong>AI Recommendation:</strong> {selectedPrescription.aiRecommendation}
                    </Alert>
                  </Card.Body>
                </Card>

                {/* Alternative Remedies */}
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-warning text-dark">
                    <h6 className="mb-0">Alternative Remedies</h6>
                  </Card.Header>
                  <Card.Body>
                    {selectedPrescription.alternativeRemedies.map((remedy, index) => (
                      <Badge key={index} bg="outline-secondary" className="me-2 mb-2 p-2">
                        {remedy}
                      </Badge>
                    ))}
                    <div className="mt-3">
                      <Button variant="outline-warning" size="sm">
                        <i className="ri-lightbulb-line me-1"></i>
                        Get AI Suggestions
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowPrescriptionModal(false)}>
            Close
          </Button>
          <Button variant="outline-primary">
            <i className="ri-printer-line me-1"></i>
            Print
          </Button>
          <Button variant="outline-success">
            <i className="ri-edit-line me-1"></i>
            Edit
          </Button>
          <Button variant="primary">
            <i className="ri-refresh-line me-1"></i>
            Renew Prescription
          </Button>
        </Modal.Footer>
      </Modal>

      {/* New Prescription Modal */}
      <Modal show={showNewPrescriptionModal} onHide={() => setShowNewPrescriptionModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-prescription-line me-2 text-primary"></i>
            Create New Prescription
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tab.Container defaultActiveKey="patient">
            <Nav variant="pills" className="mb-3">
              <Nav.Item>
                <Nav.Link eventKey="patient">Patient Selection</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="symptoms">Symptom Analysis</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="remedy">Remedy Selection</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="prescription">Prescription Details</Nav.Link>
              </Nav.Item>
            </Nav>
            
            <Tab.Content>
              <Tab.Pane eventKey="patient">
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Select Patient</Form.Label>
                        <Form.Select>
                          <option>Choose patient...</option>
                          <option value="1">Sarah Johnson</option>
                          <option value="2">Michael Chen</option>
                          <option value="3">Emma Davis</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Prescription Date</Form.Label>
                        <Form.Control type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              </Tab.Pane>
              
              <Tab.Pane eventKey="symptoms">
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Chief Complaint</Form.Label>
                    <Form.Control as="textarea" rows={3} placeholder="Describe the main problem..." />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Key Symptoms</Form.Label>
                    <Form.Control as="textarea" rows={4} placeholder="List key symptoms..." />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Modalities</Form.Label>
                    <Form.Control as="textarea" rows={2} placeholder="Better from / Worse from..." />
                  </Form.Group>
                </Form>
              </Tab.Pane>
              
              <Tab.Pane eventKey="remedy">
                <Alert variant="info">
                  <i className="ri-brain-line me-1"></i>
                  AI will suggest remedies based on symptom analysis
                </Alert>
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Recommended Remedy</Form.Label>
                        <Form.Select>
                          <option>AI will suggest...</option>
                          <option value="belladonna">Belladonna</option>
                          <option value="arsenicum">Arsenicum Album</option>
                          <option value="nux-vomica">Nux Vomica</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Potency</Form.Label>
                        <Form.Select>
                          <option>Select potency...</option>
                          <option value="6c">6C</option>
                          <option value="30c">30C</option>
                          <option value="200c">200C</option>
                          <option value="1m">1M</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              </Tab.Pane>
              
              <Tab.Pane eventKey="prescription">
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Dosage</Form.Label>
                        <Form.Control type="text" placeholder="e.g., 3 pellets, 3 times daily" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Duration</Form.Label>
                        <Form.Control type="text" placeholder="e.g., 7 days" />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label>Special Instructions</Form.Label>
                    <Form.Control as="textarea" rows={3} placeholder="Any special instructions..." />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Follow-up Date</Form.Label>
                    <Form.Control type="date" />
                  </Form.Group>
                </Form>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowNewPrescriptionModal(false)}>
            Cancel
          </Button>
          <Button variant="outline-warning">
            <i className="ri-brain-line me-1"></i>
            AI Analysis
          </Button>
          <Button variant="primary">
            <i className="ri-save-line me-1"></i>
            Create Prescription
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Advanced AI Analytics Modal */}
      <Modal 
        show={showAIAnalyticsModal} 
        onHide={() => setShowAIAnalyticsModal(false)} 
        size="xl"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-brain-2-fill me-2 text-info"></i>
            Advanced AI Analytics & Generative Intelligence
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{maxHeight: '70vh', overflowY: 'auto'}}>
          {isAnalyzing ? (
            <div className="text-center py-5">
              <div className="spinner-border text-info mb-3" style={{width: '3rem', height: '3rem'}} role="status">
                <span className="visually-hidden">Analyzing...</span>
              </div>
              <h4 className="text-info">🧠 AI Brain Processing...</h4>
              <p className="text-muted">
                Analyzing prescription patterns • Generating insights • Processing Generative AI recommendations
              </p>
              <div className="progress mt-3" style={{height: '10px'}}>
                <div className="progress-bar progress-bar-striped progress-bar-animated bg-info" style={{width: '75%'}}></div>
              </div>
            </div>
          ) : aiAnalytics ? (
            <>
              <Nav variant="tabs" className="mb-4" activeKey={analyticsTab} onSelect={setAnalyticsTab}>
                <Nav.Item>
                  <Nav.Link eventKey="overview">📊 Overview</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="remedies">💊 Remedy Analysis</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="patients">👤 Patient Insights</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="predictive">🔮 Predictive AI</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="generative">🤖 Generative AI</Nav.Link>
                </Nav.Item>
              </Nav>

              {analyticsTab === 'overview' && (
                <div>
                  <div className="alert alert-info">
                    <h5><i className="ri-information-line me-2"></i>Analytics Overview</h5>
                    <p className="mb-0">Comprehensive analysis of {aiAnalytics.overview.totalPrescriptions} prescriptions with AI-powered insights.</p>
                  </div>
                  
                  <Row>
                    <Col md={3}>
                      <Card className="text-center border-primary">
                        <Card.Body>
                          <h3 className="text-primary">{aiAnalytics.overview.avgConfidenceScore}%</h3>
                          <p className="text-muted mb-0">Avg AI Confidence</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={3}>
                      <Card className="text-center border-success">
                        <Card.Body>
                          <h3 className="text-success">{aiAnalytics.overview.successRate}%</h3>
                          <p className="text-muted mb-0">Success Rate</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={3}>
                      <Card className="text-center border-info">
                        <Card.Body>
                          <h3 className="text-info">{aiAnalytics.overview.aiPredictedOutcomes}%</h3>
                          <p className="text-muted mb-0">AI Predicted Outcomes</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={3}>
                      <Card className="text-center border-warning">
                        <Card.Body>
                          <h3 className="text-warning">{aiAnalytics.overview.totalPrescriptions}</h3>
                          <p className="text-muted mb-0">Total Prescriptions</p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </div>
              )}

              {analyticsTab === 'remedies' && (
                <div>
                  <Row>
                    <Col md={6}>
                      <Card className="h-100">
                        <Card.Header className="bg-primary text-white">
                          <h6 className="mb-0"><i className="ri-medicine-bottle-line me-2"></i>Most Prescribed Remedies</h6>
                        </Card.Header>
                        <Card.Body>
                          {aiAnalytics.remedyAnalysis.mostPrescribed.map((remedy, index) => (
                            <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                              <span><strong>{remedy.remedy}</strong></span>
                              <div>
                                <Badge bg="primary" className="me-2">{remedy.count} cases</Badge>
                                <small className="text-muted">{remedy.percentage}%</small>
                              </div>
                            </div>
                          ))}
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card className="h-100">
                        <Card.Header className="bg-success text-white">
                          <h6 className="mb-0"><i className="ri-award-line me-2"></i>Highest Success Remedies</h6>
                        </Card.Header>
                        <Card.Body>
                          {aiAnalytics.remedyAnalysis.highestSuccess.map((remedy, index) => (
                            <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                              <span><strong>{remedy.remedy}</strong></span>
                              <div>
                                <Badge bg="success" className="me-2">{remedy.avgScore}% avg</Badge>
                                <small className="text-muted">{remedy.cases} cases</small>
                              </div>
                            </div>
                          ))}
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                  
                  <Card className="mt-3">
                    <Card.Header className="bg-info text-white">
                      <h6 className="mb-0"><i className="ri-trending-up-line me-2"></i>Emerging Trends</h6>
                    </Card.Header>
                    <Card.Body>
                      {aiAnalytics.remedyAnalysis.emergingTrends.map((trend, index) => (
                        <div key={index} className="mb-3 p-3 bg-light rounded">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="mb-0">{trend.trend}</h6>
                            <Badge bg="info">{trend.confidence}% confidence</Badge>
                          </div>
                          <p className="mb-1">{trend.description}</p>
                          <small className="text-success"><strong>Impact:</strong> {trend.impact}</small>
                        </div>
                      ))}
                    </Card.Body>
                  </Card>
                </div>
              )}

              {analyticsTab === 'patients' && (
                <div>
                  <Row>
                    <Col md={6}>
                      <Card className="h-100">
                        <Card.Header className="bg-warning text-dark">
                          <h6 className="mb-0"><i className="ri-user-heart-line me-2"></i>Constitutional Types</h6>
                        </Card.Header>
                        <Card.Body>
                          {aiAnalytics.patientInsights.constitutionalTypes.map((type, index) => (
                            <div key={index} className="mb-3">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <strong>{type.type}</strong>
                                <Badge bg="warning">{type.percentage}%</Badge>
                              </div>
                              <small className="text-muted">{type.characteristics}</small>
                            </div>
                          ))}
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card className="h-100">
                        <Card.Header className="bg-danger text-white">
                          <h6 className="mb-0"><i className="ri-focus-3-line me-2"></i>Symptom Clusters</h6>
                        </Card.Header>
                        <Card.Body>
                          {aiAnalytics.patientInsights.symptomClusters.map((cluster, index) => (
                            <div key={index} className="mb-3 p-2 border rounded">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <strong className="text-danger">{cluster.cluster}</strong>
                                <Badge bg="danger">{cluster.frequency}</Badge>
                              </div>
                              <div className="mb-2">
                                <small><strong>Common Remedies:</strong> {cluster.commonRemedies.join(', ')}</small>
                              </div>
                              <small className="text-info"><strong>AI Insight:</strong> {cluster.aiInsight}</small>
                            </div>
                          ))}
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  <Card className="mt-3">
                    <Card.Header className="bg-secondary text-white">
                      <h6 className="mb-0"><i className="ri-line-chart-line me-2"></i>Treatment Patterns</h6>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        {aiAnalytics.patientInsights.treatmentPatterns.map((pattern, index) => (
                          <Col md={4} key={index}>
                            <div className="text-center p-3 bg-light rounded mb-3">
                              <h6>{pattern.pattern}</h6>
                              <div className="mb-2">
                                <Badge bg="success" className="me-2">{pattern.success} success</Badge>
                                <Badge bg="info">{pattern.avgDuration}</Badge>
                              </div>
                              <small className="text-muted">{pattern.description}</small>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </Card.Body>
                  </Card>
                </div>
              )}

              {analyticsTab === 'predictive' && (
                <div>
                  <Row>
                    <Col md={6}>
                      <Card className="h-100">
                        <Card.Header className="bg-primary text-white">
                          <h6 className="mb-0"><i className="ri-crystal-ball-line me-2"></i>Future Outcomes</h6>
                        </Card.Header>
                        <Card.Body>
                          {aiAnalytics.predictiveAnalytics.futureOutcomes.map((outcome, index) => (
                            <div key={index} className="mb-3 p-3 border rounded">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <strong>{outcome.prescription}</strong>
                                <Badge bg="primary">{outcome.confidence}%</Badge>
                              </div>
                              <div className="mb-2">
                                <span className="text-success"><strong>{outcome.predictedOutcome}</strong></span>
                                <small className="text-muted ms-2">in {outcome.timeline}</small>
                              </div>
                              <small className="text-info">{outcome.reasoning}</small>
                            </div>
                          ))}
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card className="h-100">
                        <Card.Header className="bg-warning text-dark">
                          <h6 className="mb-0"><i className="ri-shield-check-line me-2"></i>Risk Assessment</h6>
                        </Card.Header>
                        <Card.Body>
                          {aiAnalytics.predictiveAnalytics.riskAssessment.map((risk, index) => (
                            <div key={index} className="mb-3 p-3 bg-light rounded">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <strong>{risk.risk}</strong>
                                <Badge bg={risk.level === 'Low' ? 'success' : risk.level === 'Medium' ? 'warning' : 'danger'}>
                                  {risk.level} ({risk.percentage}%)
                                </Badge>
                              </div>
                              <small className="text-muted">{risk.mitigation}</small>
                            </div>
                          ))}
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  <Card className="mt-3">
                    <Card.Header className="bg-success text-white">
                      <h6 className="mb-0"><i className="ri-lightbulb-line me-2"></i>Optimization Suggestions</h6>
                    </Card.Header>
                    <Card.Body>
                      {aiAnalytics.predictiveAnalytics.optimizationSuggestions.map((suggestion, index) => (
                        <div key={index} className="mb-3 p-3 border-start border-success border-4 bg-light">
                          <h6 className="text-success">{suggestion.area}</h6>
                          <p className="mb-2">{suggestion.suggestion}</p>
                          <div className="mb-2">
                            <Badge bg="success" className="me-2">{suggestion.impact}</Badge>
                          </div>
                          <small className="text-muted"><strong>Evidence:</strong> {suggestion.evidence}</small>
                        </div>
                      ))}
                    </Card.Body>
                  </Card>
                </div>
              )}

              {analyticsTab === 'generative' && (
                <div>
                  <div className="alert alert-info">
                    <h5><i className="ri-robot-2-line me-2"></i>Generative AI Intelligence</h5>
                    <p className="mb-0">Advanced AI-generated insights using pattern recognition and predictive modeling.</p>
                  </div>

                  <Card className="mb-3">
                    <Card.Header className="bg-info text-white">
                      <h6 className="mb-0"><i className="ri-magic-line me-2"></i>AI-Generated Recommendations</h6>
                    </Card.Header>
                    <Card.Body>
                      {aiAnalytics.aiInsights.generativeRecommendations.map((rec, index) => (
                        <div key={index} className="mb-3 p-3 bg-light rounded">
                          <h6 className="text-info">{rec.insight}</h6>
                          <p className="mb-2">{rec.recommendation}</p>
                          <div className="d-flex justify-content-between align-items-center">
                            <Badge bg="info">{rec.confidence}% confidence</Badge>
                            <small className="text-muted">{rec.evidenceBase}</small>
                          </div>
                        </div>
                      ))}
                    </Card.Body>
                  </Card>

                  <Row>
                    <Col md={6}>
                      <Card className="h-100">
                        <Card.Header className="bg-success text-white">
                          <h6 className="mb-0"><i className="ri-search-eye-line me-2"></i>Case Similarity Analysis</h6>
                        </Card.Header>
                        <Card.Body>
                          {aiAnalytics.aiInsights.caseSimilarity.map((similarity, index) => (
                            <div key={index} className="mb-3">
                              <h6>{similarity.currentCase}</h6>
                              <div className="mb-2">
                                <Badge bg="success" className="me-2">{similarity.similarCases} similar cases</Badge>
                                <Badge bg="primary">{similarity.successfulTreatments} successful</Badge>
                              </div>
                              <p className="mb-2"><strong>Pattern:</strong> {similarity.commonPattern}</p>
                              <p className="mb-2"><strong>Optimal:</strong> {similarity.optimalRemedy}</p>
                              <small className="text-muted"><strong>Sequence:</strong> {similarity.alternativeSequence}</small>
                            </div>
                          ))}
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card className="h-100">
                        <Card.Header className="bg-warning text-dark">
                          <h6 className="mb-0"><i className="ri-time-line me-2"></i>Treatment Evolution</h6>
                        </Card.Header>
                        <Card.Body>
                          {aiAnalytics.aiInsights.treatmentEvolution.map((evolution, index) => (
                            <div key={index} className="mb-3">
                              <h6>{evolution.timeframe}</h6>
                              <p className="mb-2">{evolution.evolution}</p>
                              <div className="mb-2">
                                <Badge bg="success">{evolution.improvement}</Badge>
                              </div>
                              <div>
                                <strong>Key Changes:</strong>
                                <ul className="mt-2">
                                  {evolution.keyChanges.map((change, idx) => (
                                    <li key={idx}><small>{change}</small></li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ))}
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  <Card className="mt-3">
                    <Card.Header className="bg-dark text-white">
                      <h6 className="mb-0"><i className="ri-brain-fill me-2"></i>Clinical Intelligence</h6>
                    </Card.Header>
                    <Card.Body>
                      {aiAnalytics.aiInsights.clinicalIntelligence.map((intelligence, index) => (
                        <div key={index} className="mb-3 p-3 border rounded">
                          <h6 className="text-dark">{intelligence.intelligence}</h6>
                          <p className="mb-2"><strong>Finding:</strong> {intelligence.finding}</p>
                          <p className="mb-2"><strong>Clinical Relevance:</strong> {intelligence.clinical_relevance}</p>
                          <div className="p-2 bg-primary bg-opacity-10 rounded">
                            <small><strong>Recommendation:</strong> {intelligence.recommendation}</small>
                          </div>
                        </div>
                      ))}
                    </Card.Body>
                  </Card>
                </div>
              )}
            </>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowAIAnalyticsModal(false)}
          >
            Close
          </Button>
          {aiAnalytics && (
            <>
              <Button 
                variant="outline-primary"
                onClick={() => {
                  const analyticsData = JSON.stringify(aiAnalytics, null, 2);
                  const blob = new Blob([analyticsData], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `ai_analytics_${Date.now()}.json`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                }}
              >
                <i className="ri-download-2-line me-1"></i>
                Export Analytics
              </Button>
              <Button 
                variant="info"
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(aiAnalytics, null, 2));
                  alert('Analytics data copied to clipboard!');
                }}
              >
                <i className="ri-clipboard-line me-1"></i>
                Copy Data
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .cursor-pointer {
          cursor: pointer;
        }
        .cursor-pointer:hover {
          background-color: #f8f9fa;
        }
        .stat-icon {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};

export default HomeopathyPrescriptions;
