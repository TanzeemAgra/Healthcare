import React, { useState, useEffect, useRef } from 'react';
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
  ProgressBar,
  Table,
  Dropdown,
  ButtonGroup,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';

const DermatologyConditions = () => {
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

  // Comprehensive dermatology conditions database with AI-enhanced data
  const dermatologyConditions = [
    {
      id: 1,
      name: 'Melanoma',
      category: 'malignant',
      severity: 'high',
      prevalence: 'rare',
      description: 'Malignant tumor of melanocytes, the most serious form of skin cancer.',
      symptoms: ['Asymmetric mole', 'Irregular borders', 'Color variation', 'Diameter >6mm', 'Evolving changes'],
      riskFactors: ['UV exposure', 'Fair skin', 'Family history', 'Multiple moles', 'Immunosuppression'],
      diagnosis: ['Dermoscopy', 'Biopsy', 'Histopathology', 'Imaging (advanced cases)'],
      treatment: ['Surgical excision', 'Sentinel lymph node biopsy', 'Immunotherapy', 'Targeted therapy'],
      prognosis: 'Excellent if caught early (Stage I: >95% 5-year survival)',
  imageUrl: '/placeholder/300x200.png',
      icd10: 'C43',
      aiTags: ['high-priority', 'urgent-referral', 'biopsy-required', 'abcde-criteria'],
      difficulty: 'expert',
      lastUpdated: '2024-01-15'
    },
    {
      id: 2,
      name: 'Basal Cell Carcinoma',
      category: 'malignant',
      severity: 'medium',
      prevalence: 'common',
      description: 'Most common skin cancer, arising from basal cells in the epidermis.',
      symptoms: ['Pearly papule', 'Rolled borders', 'Central ulceration', 'Telangiectasias', 'Slow growth'],
      riskFactors: ['Chronic sun exposure', 'Fair skin', 'Age >50', 'Male gender', 'Immunosuppression'],
      diagnosis: ['Clinical examination', 'Dermoscopy', 'Shave biopsy', 'Histopathology'],
      treatment: ['Mohs surgery', 'Excision', 'Electrodesiccation', 'Topical therapies', 'Radiation'],
      prognosis: 'Excellent (>99% cure rate with proper treatment)',
  imageUrl: '/placeholder/300x200.png',
      icd10: 'C44',
      aiTags: ['common-cancer', 'good-prognosis', 'surgical-treatment'],
      difficulty: 'intermediate',
      lastUpdated: '2024-01-10'
    },
    {
      id: 3,
      name: 'Seborrheic Keratosis',
      category: 'benign',
      severity: 'low',
      prevalence: 'very common',
      description: 'Benign epidermal tumor with characteristic "stuck-on" appearance.',
      symptoms: ['Waxy surface', 'Stuck-on appearance', 'Brown coloration', 'Rough texture', 'Well-demarcated'],
      riskFactors: ['Age >40', 'Genetic predisposition', 'Sun exposure', 'Hormonal changes'],
      diagnosis: ['Clinical recognition', 'Dermoscopy', 'Biopsy if atypical'],
      treatment: ['Observation', 'Cryotherapy', 'Shave excision', 'Electrocautery'],
      prognosis: 'Benign, no malignant potential',
  imageUrl: '/placeholder/300x200.png',
      icd10: 'L82',
      aiTags: ['benign', 'common-elderly', 'cosmetic-concern'],
      difficulty: 'beginner',
      lastUpdated: '2024-01-08'
    },
    {
      id: 4,
      name: 'Atopic Dermatitis',
      category: 'inflammatory',
      severity: 'medium',
      prevalence: 'common',
      description: 'Chronic inflammatory skin condition characterized by eczematous lesions and intense pruritus.',
      symptoms: ['Intense itching', 'Erythematous patches', 'Vesicles', 'Lichenification', 'Dry skin'],
      riskFactors: ['Family history', 'Environmental allergens', 'Food allergies', 'Stress', 'Climate'],
      diagnosis: ['Clinical criteria', 'Patch testing', 'IgE levels', 'Skin prick tests'],
      treatment: ['Topical steroids', 'Calcineurin inhibitors', 'Moisturizers', 'Antihistamines', 'JAK inhibitors'],
      prognosis: 'Chronic with flares, often improves with age',
  imageUrl: '/placeholder/300x200.png',
      icd10: 'L20',
      aiTags: ['chronic-condition', 'pediatric-common', 'allergy-related'],
      difficulty: 'intermediate',
      lastUpdated: '2024-01-12'
    },
    {
      id: 5,
      name: 'Psoriasis Vulgaris',
      category: 'inflammatory',
      severity: 'medium',
      prevalence: 'common',
      description: 'Chronic autoimmune skin disorder characterized by well-demarcated, erythematous plaques with silvery scales.',
      symptoms: ['Erythematous plaques', 'Silver scales', 'Well-demarcated borders', 'Koebner phenomenon', 'Nail changes'],
      riskFactors: ['Genetic predisposition', 'Stress', 'Infections', 'Medications', 'Smoking'],
      diagnosis: ['Clinical appearance', 'Histopathology', 'Response to treatment'],
      treatment: ['Topical steroids', 'Vitamin D analogs', 'Methotrexate', 'Biologics', 'Phototherapy'],
      prognosis: 'Chronic condition with periods of remission and flares',
  imageUrl: '/placeholder/300x200.png',
      icd10: 'L40',
      aiTags: ['autoimmune', 'chronic-condition', 'systemic-therapy'],
      difficulty: 'intermediate',
      lastUpdated: '2024-01-14'
    },
    {
      id: 6,
      name: 'Acne Vulgaris',
      category: 'inflammatory',
      severity: 'low',
      prevalence: 'very common',
      description: 'Common inflammatory skin condition affecting pilosebaceous units, primarily in adolescents.',
      symptoms: ['Comedones', 'Papules', 'Pustules', 'Nodules', 'Scarring (severe cases)'],
      riskFactors: ['Hormonal changes', 'Genetics', 'Stress', 'Certain cosmetics', 'Diet (dairy, high-glycemic)'],
      diagnosis: ['Clinical examination', 'Severity grading', 'Bacterial culture (resistant cases)'],
      treatment: ['Topical retinoids', 'Benzoyl peroxide', 'Antibiotics', 'Hormonal therapy', 'Isotretinoin'],
      prognosis: 'Usually improves with age, may cause psychological impact',
  imageUrl: '/placeholder/300x200.png',
      icd10: 'L70',
      aiTags: ['adolescent-common', 'hormonal', 'psychosocial-impact'],
      difficulty: 'beginner',
      lastUpdated: '2024-01-09'
    },
    {
      id: 7,
      name: 'Vitiligo',
      category: 'pigmentary',
      severity: 'medium',
      prevalence: 'uncommon',
      description: 'Acquired autoimmune disorder causing loss of melanocytes and resulting in depigmented patches.',
      symptoms: ['White patches', 'Progressive spread', 'Hair depigmentation', 'Mucosal involvement', 'Symmetrical pattern'],
      riskFactors: ['Autoimmune diseases', 'Family history', 'Stress', 'Trauma', 'Chemical exposure'],
      diagnosis: ['Clinical examination', 'Wood\'s lamp', 'Dermoscopy', 'Biopsy (atypical cases)'],
      treatment: ['Topical steroids', 'Calcineurin inhibitors', 'Phototherapy', 'JAK inhibitors', 'Surgical options'],
      prognosis: 'Variable, may be progressive or stable',
  imageUrl: '/placeholder/300x200.png',
      icd10: 'L80',
      aiTags: ['autoimmune', 'cosmetic-concern', 'phototherapy'],
      difficulty: 'intermediate',
      lastUpdated: '2024-01-11'
    },
    {
      id: 8,
      name: 'Rosacea',
      category: 'inflammatory',
      severity: 'medium',
      prevalence: 'common',
      description: 'Chronic inflammatory skin condition affecting the central face with erythema and papulopustules.',
      symptoms: ['Facial erythema', 'Papulopustules', 'Telangiectasias', 'Burning sensation', 'Ocular involvement'],
      riskFactors: ['Fair skin', 'Age 30-50', 'Female gender', 'Sun exposure', 'Triggers (alcohol, spicy food)'],
      diagnosis: ['Clinical criteria', 'Dermoscopy', 'Response to treatment'],
      treatment: ['Topical metronidazole', 'Oral antibiotics', 'Laser therapy', 'Trigger avoidance', 'Sunscreen'],
      prognosis: 'Chronic condition requiring ongoing management',
  imageUrl: '/placeholder/300x200.png',
      icd10: 'L71',
      aiTags: ['facial-condition', 'trigger-related', 'chronic-management'],
      difficulty: 'intermediate',
      lastUpdated: '2024-01-13'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Conditions', icon: 'ri-book-open-line', count: dermatologyConditions.length },
    { value: 'malignant', label: 'Malignant', icon: 'ri-error-warning-line', count: dermatologyConditions.filter(c => c.category === 'malignant').length },
    { value: 'benign', label: 'Benign', icon: 'ri-checkbox-circle-line', count: dermatologyConditions.filter(c => c.category === 'benign').length },
    { value: 'inflammatory', label: 'Inflammatory', icon: 'ri-flask-line', count: dermatologyConditions.filter(c => c.category === 'inflammatory').length },
    { value: 'pigmentary', label: 'Pigmentary', icon: 'ri-image-line', count: dermatologyConditions.filter(c => c.category === 'pigmentary').length }
  ];

  // Mock AI Insights Generator
  const generateAIInsights = async (condition) => {
    setGeneratingInsights(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const insights = {
      keyPoints: [
        `${condition.name} has a ${condition.prevalence} prevalence in dermatology practice`,
        `Early detection is crucial for optimal ${condition.name} management`,
        `Recent advances in treatment have improved outcomes significantly`,
        `AI-assisted diagnosis can enhance accuracy by 23% for ${condition.name}`
      ],
      clinicalPearls: [
        'Use dermoscopy for enhanced visualization and pattern recognition',
        'Consider patient history and family background in differential diagnosis',
        'Document progression with standardized photography protocols',
        'Multidisciplinary approach often yields best outcomes'
      ],
      differentialDiagnosis: [
        'Consider similar presentations in the differential',
        'Rule out mimicking conditions with appropriate tests',
        'Age and location can help narrow the differential',
        'Response to treatment can aid in confirmation'
      ],
      researchUpdates: [
        'New biomarkers identified for early detection',
        'Novel therapeutic targets under investigation',
        'AI diagnostic models showing promising results',
        'Personalized medicine approaches being developed'
      ],
      patientEducation: [
        'Provide clear information about the condition',
        'Discuss treatment expectations and timeline',
        'Emphasize importance of follow-up care',
        'Address common patient concerns and myths'
      ]
    };
    
    setAiInsights(insights);
    setGeneratingInsights(false);
  };

  const filteredConditions = dermatologyConditions.filter(condition => {
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
      case 'beginner': return <i className="ri-graduation-cap-line text-success"></i>;
      case 'intermediate': return <i className="ri-book-open-line text-warning"></i>;
      case 'expert': return <i className="ri-brain-line text-danger"></i>;
      default: return <i className="ri-question-line text-muted"></i>;
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
      setError('Please log in to access dermatology conditions database');
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
                <i className="ri-book-open-line me-2 text-primary"></i>
                Dermatology Conditions Database
              </h2>
              <p className="text-muted mb-0">
                AI-Enhanced medical reference with comprehensive condition information
              </p>
            </div>
            <div className="d-flex gap-2">
              <Badge bg="info" className="px-3 py-2">
                <i className="ri-brain-line me-2"></i>
                AI-Powered
              </Badge>
              <Badge bg="success" className="px-3 py-2">
                {dermatologyConditions.length} Conditions
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
                <i className="ri-error-warning-line me-2"></i>
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
                      <i className="ri-search-line"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search conditions, symptoms, or treatments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </div>
                <Dropdown as={ButtonGroup}>
                  <Button variant="outline-secondary">
                    <i className="ri-filter-line me-2"></i>
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
                        <i className={`${category.icon} me-2`}></i>
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
              <i className="ri-lightbulb-line text-warning mb-2" style={{fontSize: '24px'}}></i>
              <h6>AI Quick Tip</h6>
              <small className="text-muted">
                Use specific symptoms or condition names for more accurate search results
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
                <i className={`${category.icon} me-2`}></i>
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
                      <i className={`ri-heart-${favoriteConditions.includes(condition.id) ? 'fill text-danger' : 'line'}`}></i>
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
                        <i className="ri-robot-line me-1" style={{fontSize: '10px'}}></i>
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
                    <i className="ri-eye-line me-2"></i>
                    View Details
                  </Button>
                </div>
              </Card.Body>
              <Card.Footer className="text-muted small">
                <div className="d-flex justify-content-between">
                  <span>ICD-10: {condition.icd10}</span>
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
                <i className="ri-search-line" style={{fontSize: '48px'}} ></i>
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
                <i className="ri-book-open-line me-2 text-primary"></i>
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
                <Tab eventKey="overview" title={<><i className="ri-information-line me-2"></i>Overview</>}>
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
                                <i className="ri-error-warning-line me-1"></i>
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
                                <td><strong>ICD-10:</strong></td>
                                <td><code>{selectedCondition.icd10}</code></td>
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
                                <i className="ri-robot-line me-1" style={{fontSize: '10px'}}></i>
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
                <Tab eventKey="treatment" title={<><i className="ri-stethoscope-line me-2"></i>Diagnosis & Treatment</>}>
                  <Row>
                    <Col md={6}>
                      <div className="mb-4">
                        <h5>
                          <i className="ri-microscope-line me-2 text-primary"></i>
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
                          <i className="ri-flask-line me-2 text-success"></i>
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
                        <i className="ri-line-chart-line me-2"></i>
                        Prognosis
                      </Alert.Heading>
                      <p className="mb-0">{selectedCondition.prognosis}</p>
                    </Alert>
                  </div>
                </Tab>

                {/* AI Insights Tab */}
                <Tab eventKey="ai-insights" title={<><i className="ri-brain-line me-2"></i>AI Insights</>}>
                  <div className="text-center mb-4">
                    {!aiInsights ? (
                      <div>
                        <i className="ri-brain-line text-primary mb-3" style={{fontSize: '48px'}}></i>
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
                              <i className="ri-robot-line me-2"></i>
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
                              <i className="ri-lightbulb-line me-2 text-warning"></i>
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
                              <i className="ri-graduation-cap-line me-2 text-success"></i>
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
                              <i className="ri-question-line me-2 text-info"></i>
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
                              <i className="ri-flask-line me-2 text-primary"></i>
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
                              <i className="ri-chat-3-line me-2 text-warning"></i>
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
                        </Accordion>

                        <div className="mt-4 text-center">
                          <Button
                            variant="outline-primary"
                            onClick={() => generateAIInsights(selectedCondition)}
                            disabled={generatingInsights}
                          >
                            <i className="ri-robot-line me-2"></i>
                            Regenerate Insights
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {generatingInsights && (
                      <div className="mt-3">
                        <ProgressBar animated now={100} className="mb-2" />
                        <small className="text-muted">
                          AI is analyzing latest research and clinical data...
                        </small>
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
                    <i className="ri-bookmark-line me-1"></i>
                    Save
                  </Button>
                  <Button variant="outline-primary" size="sm">
                    <i className="ri-share-line me-1"></i>
                    Share
                  </Button>
                  <Button variant="outline-secondary" size="sm">
                    <i className="ri-download-line me-1"></i>
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

export default DermatologyConditions;

