import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Spinner,
  Badge,
  Modal,
  Tabs,
  Tab,
  InputGroup,
  Accordion,
  Table,
  Dropdown,
  ButtonGroup,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';

const DentistryConditions = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const [generatingInsights, setGeneratingInsights] = useState(false);
  const [favoriteConditions, setFavoriteConditions] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState(null);

  // Comprehensive dental conditions database with AI-enhanced data
  const dentalConditions = [
    {
      id: 1,
      name: 'Dental Caries (Cavities)',
      category: 'infectious',
      severity: 'medium',
      prevalence: 'very common',
      description: 'Bacterial infection causing demineralization and destruction of tooth structure.',
      symptoms: ['Tooth pain', 'Sensitivity to sweet/cold', 'Visible holes', 'Dark spots', 'Bad breath'],
      riskFactors: ['Poor oral hygiene', 'Frequent snacking', 'Sugary diet', 'Dry mouth', 'Genetics'],
      diagnosis: ['Visual examination', 'X-rays', 'Cavity detection dye', 'Fiber-optic transillumination'],
      treatment: ['Fluoride treatment', 'Dental fillings', 'Crown placement', 'Root canal', 'Extraction'],
      prognosis: 'Excellent with early treatment, progressive if untreated',
  imageUrl: '/placeholder/300x200.png',
      ada_code: 'D2140-D2394',
      aiTags: ['preventable', 'common-pediatric', 'sugar-related', 'fluoride-responsive'],
      difficulty: 'beginner',
      lastUpdated: '2024-01-15'
    },
    {
      id: 2,
      name: 'Periodontal Disease',
      category: 'inflammatory',
      severity: 'high',
      prevalence: 'common',
      description: 'Inflammatory condition affecting gums and supporting structures of teeth.',
      symptoms: ['Red, swollen gums', 'Bleeding while brushing', 'Bad breath', 'Loose teeth', 'Receding gums'],
      riskFactors: ['Poor oral hygiene', 'Smoking', 'Diabetes', 'Stress', 'Genetics', 'Age'],
      diagnosis: ['Periodontal probing', 'X-rays', 'Clinical examination', 'Bacterial testing'],
      treatment: ['Scaling and root planing', 'Antibiotics', 'Surgery', 'Laser therapy', 'Maintenance therapy'],
      prognosis: 'Good with proper treatment and maintenance',
  imageUrl: '/placeholder/300x200.png',
      ada_code: 'D4341-D4381',
      aiTags: ['systemic-link', 'progressive', 'maintenance-required', 'surgical-option'],
      difficulty: 'intermediate',
      lastUpdated: '2024-01-14'
    },
    {
      id: 3,
      name: 'Tooth Impaction',
      category: 'developmental',
      severity: 'medium',
      prevalence: 'common',
      description: 'Condition where a tooth fails to emerge or emerges only partially through the gum.',
      symptoms: ['Pain and swelling', 'Difficulty opening mouth', 'Bad taste', 'Headache', 'Jaw stiffness'],
      riskFactors: ['Inadequate space', 'Late tooth development', 'Genetics', 'Retained baby teeth'],
      diagnosis: ['Clinical examination', 'Panoramic X-ray', 'CBCT scan', 'Oral examination'],
      treatment: ['Monitoring', 'Surgical extraction', 'Orthodontic exposure', 'Space creation'],
      prognosis: 'Good with appropriate treatment timing',
  imageUrl: '/placeholder/300x200.png',
      ada_code: 'D7220-D7240',
      aiTags: ['wisdom-teeth', 'surgical-procedure', 'orthodontic-related', 'age-specific'],
      difficulty: 'intermediate',
      lastUpdated: '2024-01-13'
    },
    {
      id: 4,
      name: 'Temporomandibular Joint Disorder (TMD)',
      category: 'joint_disorder',
      severity: 'medium',
      prevalence: 'uncommon',
      description: 'Dysfunction of the jaw joint and surrounding muscles causing pain and limited movement.',
      symptoms: ['Jaw pain', 'Clicking sounds', 'Limited mouth opening', 'Headaches', 'Facial pain'],
      riskFactors: ['Stress', 'Teeth grinding', 'Arthritis', 'Jaw injury', 'Poor posture'],
      diagnosis: ['Clinical examination', 'TMJ imaging', 'Bite analysis', 'Range of motion tests'],
      treatment: ['Conservative therapy', 'Splint therapy', 'Physical therapy', 'Medication', 'Surgery'],
      prognosis: 'Most cases resolve with conservative treatment',
  imageUrl: '/placeholder/300x200.png',
      ada_code: 'D7880',
      aiTags: ['stress-related', 'conservative-first', 'multidisciplinary', 'chronic-condition'],
      difficulty: 'expert',
      lastUpdated: '2024-01-12'
    },
    {
      id: 5,
      name: 'Oral Cancer',
      category: 'malignant',
      severity: 'high',
      prevalence: 'rare',
      description: 'Malignant growth in the oral cavity requiring immediate attention and treatment.',
      symptoms: ['Persistent sores', 'White/red patches', 'Unexplained bleeding', 'Numbness', 'Difficulty swallowing'],
      riskFactors: ['Tobacco use', 'Alcohol consumption', 'HPV infection', 'Sun exposure', 'Age over 40'],
      diagnosis: ['Oral examination', 'Biopsy', 'Imaging studies', 'Staging procedures'],
      treatment: ['Surgery', 'Radiation therapy', 'Chemotherapy', 'Targeted therapy', 'Immunotherapy'],
      prognosis: 'Early detection significantly improves outcomes',
  imageUrl: '/placeholder/300x200.png',
      ada_code: 'D0150',
      aiTags: ['early-detection-critical', 'multidisciplinary', 'lifestyle-related', 'screening-important'],
      difficulty: 'expert',
      lastUpdated: '2024-01-11'
    },
    {
      id: 6,
      name: 'Tooth Sensitivity',
      category: 'symptomatic',
      severity: 'low',
      prevalence: 'very common',
      description: 'Sharp pain in teeth when exposed to hot, cold, sweet, or acidic stimuli.',
      symptoms: ['Sharp pain with temperature', 'Discomfort with sweet foods', 'Pain while brushing', 'Sensitivity to air'],
      riskFactors: ['Enamel erosion', 'Gum recession', 'Teeth grinding', 'Acidic diet', 'Aggressive brushing'],
      diagnosis: ['Cold test', 'Air blast test', 'Clinical examination', 'Patient history'],
      treatment: ['Desensitizing toothpaste', 'Fluoride application', 'Bonding', 'Gum grafting', 'Root canal'],
      prognosis: 'Usually manageable with appropriate treatment',
  imageUrl: '/placeholder/300x200.png',
      ada_code: 'D9910',
      aiTags: ['lifestyle-related', 'preventable', 'common-complaint', 'multiple-treatments'],
      difficulty: 'beginner',
      lastUpdated: '2024-01-10'
    },
    {
      id: 7,
      name: 'Malocclusion',
      category: 'orthodontic',
      severity: 'medium',
      prevalence: 'common',
      description: 'Misalignment of teeth and/or incorrect relation between dental arches.',
      symptoms: ['Crooked teeth', 'Difficulty chewing', 'Speech problems', 'Jaw pain', 'Facial asymmetry'],
      riskFactors: ['Genetics', 'Thumb sucking', 'Early tooth loss', 'Injury', 'Tumors'],
      diagnosis: ['Clinical examination', 'X-rays', 'Dental impressions', 'Photographs', 'Cephalometric analysis'],
      treatment: ['Braces', 'Clear aligners', 'Retainers', 'Functional appliances', 'Surgery'],
      prognosis: 'Excellent with proper orthodontic treatment',
  imageUrl: '/placeholder/300x200.png',
      ada_code: 'D8010-D8090',
      aiTags: ['orthodontic-treatment', 'aesthetic-concern', 'functional-impact', 'age-dependent'],
      difficulty: 'intermediate',
      lastUpdated: '2024-01-09'
    },
    {
      id: 8,
      name: 'Dental Trauma',
      category: 'injury',
      severity: 'high',
      prevalence: 'uncommon',
      description: 'Injury to teeth and supporting structures from external force or impact.',
      symptoms: ['Chipped/broken teeth', 'Tooth displacement', 'Pain', 'Bleeding', 'Swelling'],
      riskFactors: ['Sports participation', 'Accidents', 'Violence', 'Poor oral habits', 'Age (children)'],
      diagnosis: ['Clinical examination', 'X-rays', 'Pulp testing', 'Mobility assessment'],
      treatment: ['Emergency care', 'Splinting', 'Root canal', 'Crown restoration', 'Extraction and replacement'],
      prognosis: 'Depends on severity and timing of treatment',
  imageUrl: '/placeholder/300x200.png',
      ada_code: 'D7110',
      aiTags: ['emergency-care', 'time-sensitive', 'sports-related', 'prevention-important'],
      difficulty: 'expert',
      lastUpdated: '2024-01-08'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Conditions', icon: FaBookOpen, count: dentalConditions.length },
    { value: 'infectious', label: 'Infectious', icon: FaFlask, count: dentalConditions.filter(c => c.category === 'infectious').length },
    { value: 'inflammatory', label: 'Inflammatory', icon: FaExclamationTriangle, count: dentalConditions.filter(c => c.category === 'inflammatory').length },
    { value: 'developmental', label: 'Developmental', icon: FaGraduationCap, count: dentalConditions.filter(c => c.category === 'developmental').length },
    { value: 'malignant', label: 'Malignant', icon: FaTimesCircle, count: dentalConditions.filter(c => c.category === 'malignant').length },
    { value: 'orthodontic', label: 'Orthodontic', icon: FaTooth, count: dentalConditions.filter(c => c.category === 'orthodontic').length },
    { value: 'injury', label: 'Trauma/Injury', icon: FaUserMd, count: dentalConditions.filter(c => c.category === 'injury').length }
  ];

  // Mock AI Insights Generator for Dental Conditions
  const generateAIInsights = async (condition) => {
    setGeneratingInsights(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const insights = {
      keyPoints: [
        `${condition.name} affects approximately ${condition.prevalence} patients in dental practice`,
        `Early intervention significantly improves treatment outcomes for ${condition.name}`,
        `AI-assisted diagnosis can improve detection accuracy by 28% for ${condition.name}`,
        `Evidence-based protocols show optimal results with timely treatment`
      ],
      clinicalPearls: [
        'Use standardized examination protocols for consistent diagnosis',
        'Patient education is crucial for treatment success and compliance',
        'Consider systemic health factors in treatment planning',
        'Document findings with standardized terminology and imaging',
        'Multidisciplinary approach often yields superior outcomes'
      ],
      differentialDiagnosis: [
        'Rule out similar presenting conditions through systematic examination',
        'Consider age-specific prevalence when evaluating symptoms',
        'Utilize appropriate diagnostic imaging for definitive diagnosis',
        'Patient history provides crucial diagnostic clues',
        'Sequential testing may be necessary for complex cases'
      ],
      researchUpdates: [
        'New biomarkers identified for early detection and monitoring',
        'Advanced imaging techniques improving diagnostic accuracy',
        'Novel therapeutic approaches under clinical investigation',
        'AI diagnostic models showing promising validation results',
        'Minimally invasive treatment protocols being developed'
      ],
      patientEducation: [
        'Explain condition in clear, understandable terms',
        'Discuss prevention strategies and risk factor modification',
        'Set realistic expectations for treatment timeline and outcomes',
        'Provide written instructions and educational materials',
        'Address common patient concerns and misconceptions'
      ],
      treatmentInnovations: [
        'Digital treatment planning improving precision and outcomes',
        'Minimally invasive techniques reducing patient discomfort',
        'Biomimetic materials enhancing restoration longevity',
        'Laser therapy showing promising results in selected cases',
        'Regenerative approaches being integrated into practice'
      ]
    };
    
    setAiInsights(insights);
    setGeneratingInsights(false);
  };

  const filteredConditions = dentalConditions.filter(condition => {
    const matchesSearch = condition.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         condition.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         condition.symptoms.some(symptom => symptom.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || condition.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getSeverityBadge = (severity) => {
    const variants = {
      low: 'success',
      medium: 'warning',
      high: 'danger'
    };
    return variants[severity] || 'secondary';
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return <FaGraduationCap className="text-success" />;
      case 'intermediate': return <FaBookOpen className="text-warning" />;
      case 'expert': return <FaBrain className="text-danger" />;
      default: return <FaQuestionCircle className="text-muted" />;
    }
  };

  const toggleFavorite = (conditionId) => {
    setFavoriteConditions(prev => 
      prev.includes(conditionId) 
        ? prev.filter(id => id !== conditionId)
        : [...prev, conditionId]
    );
  };

  const handleConditionClick = (condition) => {
    setSelectedCondition(condition);
    setShowModal(true);
    setAiInsights(null);
    setActiveTab('overview');
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    if (!token) {
      setError('Please log in to access dental conditions database');
    }
  }, []);

  return (
    <Container fluid className="mt-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>
                <FaTooth className="me-2 text-primary" />
                Dental Conditions Database
              </h2>
              <p className="text-muted mb-0">
                AI-Enhanced dental reference with comprehensive condition information
              </p>
            </div>
            <div className="d-flex gap-2">
              <Badge bg="info" className="px-3 py-2">
                <FaBrain className="me-2" />
                AI-Powered
              </Badge>
              <Badge bg="success" className="px-3 py-2">
                {dentalConditions.length} Conditions
              </Badge>
            </div>
          </div>
        </Col>
      </Row>

      {/* Error Alert */}
      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="warning" dismissible onClose={() => setError(null)}>
              <Alert.Heading>
                <FaExclamationTriangle className="me-2" />
                Authentication Required
              </Alert.Heading>
              <p>{error}</p>
              <hr />
              <div className="d-flex justify-content-center gap-3">
                <Button variant="primary" onClick={() => navigate('/auth/sign-in')}>
                  <i className="ri-login-box-line me-2"></i>
                  Go to Login
                </Button>
              </div>
              <hr />
              <small className="text-muted text-center d-block">
                <strong>Default Login Credentials:</strong><br />
                📧 Email: <code>info@xerxez.in</code><br />
                🔑 Password: <code>admin123</code>
              </small>
            </Alert>
          </Col>
        </Row>
      )}

      {/* Search and Filter Section */}
      <Row className="mb-4">
        <Col lg={8}>
          <Card>
            <Card.Body>
              <div className="d-flex gap-3 align-items-center">
                <div className="flex-grow-1">
                  <InputGroup>
                    <InputGroup.Text>
                      <FaSearch />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search dental conditions, symptoms, or treatments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </div>
                <Dropdown as={ButtonGroup}>
                  <Button variant="outline-secondary">
                    <FaFilter className="me-2" />
                    Filter
                  </Button>
                  <Dropdown.Toggle split variant="outline-secondary" />
                  <Dropdown.Menu>
                    {categories.map(category => (
                      <Dropdown.Item
                        key={category.value}
                        active={selectedCategory === category.value}
                        onClick={() => setSelectedCategory(category.value)}
                      >
                        <category.icon className="me-2" />
                        {category.label} ({category.count})
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="bg-light">
            <Card.Body className="text-center">
              <FaLightbulb size={24} className="text-warning mb-2" />
              <h6>AI Quick Tip</h6>
              <small className="text-muted">
                Use specific dental terminology or ADA codes for precise search results
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Category Filters */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex gap-2 flex-wrap">
            {categories.map(category => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? 'primary' : 'outline-primary'}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className="d-flex align-items-center"
              >
                <category.icon className="me-2" />
                {category.label}
                <Badge bg="light" text="dark" className="ms-2">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </Col>
      </Row>

      {/* Conditions Grid */}
      <Row>
        {filteredConditions.map(condition => (
          <Col lg={4} md={6} key={condition.id} className="mb-4">
            <Card className="h-100 shadow-sm hover-shadow">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <h6 className="mb-0">{condition.name}</h6>
                  {getDifficultyIcon(condition.difficulty)}
                </div>
                <div className="d-flex gap-1">
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Add to favorites</Tooltip>}
                  >
                    <Button
                      variant="outline-warning"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(condition.id);
                      }}
                    >
                      <FaHeart className={favoriteConditions.includes(condition.id) ? 'text-danger' : ''} />
                    </Button>
                  </OverlayTrigger>
                </div>
              </Card.Header>
              <Card.Body className="d-flex flex-column">
                <div className="mb-3">
                  <Badge bg={getSeverityBadge(condition.severity)} className="me-2">
                    {condition.severity.toUpperCase()}
                  </Badge>
                  <Badge bg="info" className="me-2">
                    {condition.prevalence}
                  </Badge>
                  <Badge bg="secondary">
                    {condition.category}
                  </Badge>
                </div>
                
                <p className="text-muted flex-grow-1">
                  {condition.description.length > 120 
                    ? `${condition.description.substring(0, 120)}...`
                    : condition.description}
                </p>
                
                <div className="mb-3">
                  <small className="text-muted">
                    <strong>Key Symptoms:</strong>
                  </small>
                  <div className="mt-1">
                    {condition.symptoms.slice(0, 3).map((symptom, index) => (
                      <Badge key={index} bg="light" text="dark" className="me-1 mb-1">
                        {symptom}
                      </Badge>
                    ))}
                    {condition.symptoms.length > 3 && (
                      <Badge bg="light" text="muted">
                        +{condition.symptoms.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex flex-wrap gap-1">
                    {condition.aiTags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} bg="primary" className="small">
                        <FaRobot className="me-1" size={10} />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-auto">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-100"
                    onClick={() => handleConditionClick(condition)}
                  >
                    <FaEye className="me-2" />
                    View Details
                  </Button>
                </div>
              </Card.Body>
              <Card.Footer className="text-muted small">
                <div className="d-flex justify-content-between">
                  <span>ADA: {condition.ada_code}</span>
                  <span>Updated: {condition.lastUpdated}</span>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {/* No Results */}
      {filteredConditions.length === 0 && (
        <Row>
          <Col>
            <Card className="text-center py-5">
              <Card.Body>
                <FaSearch size={48} className="text-muted mb-3" />
                <h4>No conditions found</h4>
                <p className="text-muted">
                  Try adjusting your search terms or filter criteria
                </p>
                <Button
                  variant="primary"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                >
                  Clear Filters
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Detailed Condition Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" centered>
        {selectedCondition && (
          <>
            <Modal.Header closeButton>
              <Modal.Title className="d-flex align-items-center">
                <FaTooth className="me-2 text-primary" />
                {selectedCondition.name}
                <Badge bg={getSeverityBadge(selectedCondition.severity)} className="ms-3">
                  {selectedCondition.severity.toUpperCase()}
                </Badge>
                {getDifficultyIcon(selectedCondition.difficulty)}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-3">
                {/* Overview Tab */}
                <Tab eventKey="overview" title={<><FaInfoCircle className="me-2" />Overview</>}>
                  <Row>
                    <Col md={8}>
                      <div className="mb-4">
                        <h5>Description</h5>
                        <p>{selectedCondition.description}</p>
                      </div>

                      <div className="mb-4">
                        <h5>Clinical Presentation</h5>
                        <h6>Symptoms:</h6>
                        <ul>
                          {selectedCondition.symptoms.map((symptom, index) => (
                            <li key={index}>{symptom}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="mb-4">
                        <h5>Risk Factors</h5>
                        <div className="row">
                          {selectedCondition.riskFactors.map((factor, index) => (
                            <div key={index} className="col-md-6 mb-2">
                              <Badge bg="warning" className="me-2">
                                <FaExclamationTriangle className="me-1" />
                                {factor}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Col>
                    <Col md={4}>
                      <Card className="bg-light">
                        <Card.Body>
                          <h6>Quick Facts</h6>
                          <Table size="sm" borderless>
                            <tbody>
                              <tr>
                                <td><strong>Category:</strong></td>
                                <td>
                                  <Badge bg="info">{selectedCondition.category}</Badge>
                                </td>
                              </tr>
                              <tr>
                                <td><strong>Prevalence:</strong></td>
                                <td>{selectedCondition.prevalence}</td>
                              </tr>
                              <tr>
                                <td><strong>ADA Code:</strong></td>
                                <td><code>{selectedCondition.ada_code}</code></td>
                              </tr>
                              <tr>
                                <td><strong>Difficulty:</strong></td>
                                <td>
                                  {getDifficultyIcon(selectedCondition.difficulty)}
                                  <span className="ms-2">{selectedCondition.difficulty}</span>
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </Card.Body>
                      </Card>

                      <Card className="mt-3">
                        <Card.Body>
                          <h6>AI Tags</h6>
                          <div className="d-flex flex-wrap gap-1">
                            {selectedCondition.aiTags.map((tag, index) => (
                              <Badge key={index} bg="primary" className="small">
                                <FaRobot className="me-1" size={10} />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Tab>

                {/* Diagnosis & Treatment Tab */}
                <Tab eventKey="treatment" title={<><FaStethoscope className="me-2" />Diagnosis & Treatment</>}>
                  <Row>
                    <Col md={6}>
                      <div className="mb-4">
                        <h5>
                          <FaXRay className="me-2 text-primary" />
                          Diagnostic Approach
                        </h5>
                        <ul>
                          {selectedCondition.diagnosis.map((method, index) => (
                            <li key={index} className="mb-2">
                              <Badge bg="info" className="me-2">
                                {index + 1}
                              </Badge>
                              {method}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-4">
                        <h5>
                          <FaFlask className="me-2 text-success" />
                          Treatment Options
                        </h5>
                        <ul>
                          {selectedCondition.treatment.map((treatment, index) => (
                            <li key={index} className="mb-2">
                              <Badge bg="success" className="me-2">
                                {index + 1}
                              </Badge>
                              {treatment}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Col>
                  </Row>
                  
                  <div className="mt-4">
                    <Alert variant="info">
                      <Alert.Heading>
                        <FaChartLine className="me-2" />
                        Prognosis
                      </Alert.Heading>
                      <p className="mb-0">{selectedCondition.prognosis}</p>
                    </Alert>
                  </div>
                </Tab>

                {/* AI Insights Tab */}
                <Tab eventKey="ai-insights" title={<><FaBrain className="me-2" />AI Insights</>}>
                  <div className="text-center mb-4">
                    {!aiInsights ? (
                      <div>
                        <FaBrain size={48} className="text-primary mb-3" />
                        <h5>Generate AI Insights</h5>
                        <p className="text-muted">
                          Get AI-powered clinical insights, pearls, and latest research updates
                        </p>
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={() => generateAIInsights(selectedCondition)}
                          disabled={generatingInsights}
                        >
                          {generatingInsights ? (
                            <>
                              <Spinner animation="border" size="sm" className="me-2" />
                              Generating Insights...
                            </>
                          ) : (
                            <>
                              <FaRobot className="me-2" />
                              Generate AI Insights
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Accordion defaultActiveKey="0">
                          <Accordion.Item eventKey="0">
                            <Accordion.Header>
                              <FaLightbulb className="me-2 text-warning" />
                              Key Clinical Points
                            </Accordion.Header>
                            <Accordion.Body>
                              <ul>
                                {aiInsights.keyPoints.map((point, index) => (
                                  <li key={index} className="mb-2">{point}</li>
                                ))}
                              </ul>
                            </Accordion.Body>
                          </Accordion.Item>
                          
                          <Accordion.Item eventKey="1">
                            <Accordion.Header>
                              <FaGraduationCap className="me-2 text-success" />
                              Clinical Pearls
                            </Accordion.Header>
                            <Accordion.Body>
                              <ul>
                                {aiInsights.clinicalPearls.map((pearl, index) => (
                                  <li key={index} className="mb-2">{pearl}</li>
                                ))}
                              </ul>
                            </Accordion.Body>
                          </Accordion.Item>
                          
                          <Accordion.Item eventKey="2">
                            <Accordion.Header>
                              <FaQuestionCircle className="me-2 text-info" />
                              Differential Diagnosis
                            </Accordion.Header>
                            <Accordion.Body>
                              <ul>
                                {aiInsights.differentialDiagnosis.map((item, index) => (
                                  <li key={index} className="mb-2">{item}</li>
                                ))}
                              </ul>
                            </Accordion.Body>
                          </Accordion.Item>
                          
                          <Accordion.Item eventKey="3">
                            <Accordion.Header>
                              <FaFlask className="me-2 text-primary" />
                              Research Updates
                            </Accordion.Header>
                            <Accordion.Body>
                              <ul>
                                {aiInsights.researchUpdates.map((update, index) => (
                                  <li key={index} className="mb-2">{update}</li>
                                ))}
                              </ul>
                            </Accordion.Body>
                          </Accordion.Item>
                          
                          <Accordion.Item eventKey="4">
                            <Accordion.Header>
                              <FaComments className="me-2 text-warning" />
                              Patient Education
                            </Accordion.Header>
                            <Accordion.Body>
                              <ul>
                                {aiInsights.patientEducation.map((item, index) => (
                                  <li key={index} className="mb-2">{item}</li>
                                ))}
                              </ul>
                            </Accordion.Body>
                          </Accordion.Item>
                          
                          <Accordion.Item eventKey="5">
                            <Accordion.Header>
                              <FaStethoscope className="me-2 text-danger" />
                              Treatment Innovations
                            </Accordion.Header>
                            <Accordion.Body>
                              <ul>
                                {aiInsights.treatmentInnovations.map((innovation, index) => (
                                  <li key={index} className="mb-2">{innovation}</li>
                                ))}
                              </ul>
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>

                        <div className="mt-4 text-center">
                          <Button
                            variant="outline-primary"
                            onClick={() => generateAIInsights(selectedCondition)}
                            disabled={generatingInsights}
                          >
                            <FaRobot className="me-2" />
                            Regenerate Insights
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </Tab>
              </Tabs>
            </Modal.Body>
            <Modal.Footer>
              <div className="d-flex justify-content-between w-100">
                <div className="d-flex gap-2">
                  <Button variant="outline-success" size="sm">
                    <FaBookmark className="me-1" />
                    Save
                  </Button>
                  <Button variant="outline-primary" size="sm">
                    <FaShare className="me-1" />
                    Share
                  </Button>
                  <Button variant="outline-secondary" size="sm">
                    <FaDownload className="me-1" />
                    Export
                  </Button>
                </div>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Close
                </Button>
              </div>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </Container>
  );
};

export default DentistryConditions;

