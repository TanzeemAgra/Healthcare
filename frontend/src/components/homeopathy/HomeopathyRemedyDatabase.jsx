import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Badge, Alert, Modal, InputGroup, Tabs, Tab } from 'react-bootstrap';

const HomeopathyRemedyDatabase = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [remedies, setRemedies] = useState([]);
  const [filteredRemedies, setFilteredRemedies] = useState([]);
  const [selectedRemedy, setSelectedRemedy] = useState(null);
  const [showRemedyModal, setShowRemedyModal] = useState(false);
  const [isAISearching, setIsAISearching] = useState(false);
  const [showAddRemedyModal, setShowAddRemedyModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [newRemedyForm, setNewRemedyForm] = useState({
    name: '',
    latinName: '',
    commonName: '',
    category: 'constitutional',
    potencies: [],
    source: '',
    constitution: '',
    keynotes: '',
    indications: [],
    modalitiesBetter: [],
    modalitiesWorse: [],
    mentals: [],
    physicals: [],
    dosage: '',
    usage: 'Common'
  });

  const categories = [
    'all', 'constitutional', 'acute', 'chronic', 'mental', 'respiratory', 
    'digestive', 'cardiovascular', 'nervous', 'musculoskeletal', 'skin', 'urogenital'
  ];

  const mockRemedies = [
    {
      id: 1,
      name: 'Arsenicum Album',
      latinName: 'Arsenicum album',
      commonName: 'White Arsenic',
      category: 'constitutional',
      potencies: ['6C', '30C', '200C', '1M', '10M'],
      source: 'Mineral',
      constitution: 'Lean, anxious, restless individuals',
      keynotes: 'Anxiety, restlessness, burning pains, fear of death, thirst for small sips',
      indications: ['Anxiety disorders', 'Gastroenteritis', 'Asthma', 'Skin conditions', 'Food poisoning'],
      modalities: {
        better: ['Heat', 'Warm drinks', 'Company', 'Motion'],
        worse: ['Cold', 'Midnight', 'Alone', 'Exertion']
      },
      mentals: ['Anxiety about health', 'Fear of death', 'Restlessness', 'Fastidious', 'Despair'],
      physicals: ['Burning pains', 'Exhaustion', 'Emaciation', 'Thirst for small sips', 'Chilly'],
      relationships: {
        follows: ['Sulphur', 'Veratrum'],
        antidotes: ['Hepar sulph', 'Nux vomica'],
        complementary: ['Phosphorus', 'Carbo veg']
      },
      dosage: 'Start with 30C, may need higher potencies for constitutional treatment',
      aiScore: 95,
      usage: 'Very Common'
    },
    {
      id: 2,
      name: 'Belladonna',
      latinName: 'Atropa belladonna',
      commonName: 'Deadly Nightshade',
      category: 'acute',
      potencies: ['6C', '30C', '200C'],
      source: 'Plant',
      constitution: 'Robust, full-blooded individuals',
      keynotes: 'Sudden onset, heat, redness, throbbing, violence',
      indications: ['Fever', 'Headaches', 'Sore throat', 'Inflammation', 'Delirium'],
      modalities: {
        better: ['Semi-erect position', 'Rest', 'Warmth'],
        worse: ['Touch', 'Motion', 'Noise', 'Light', 'Afternoon']
      },
      mentals: ['Delirium', 'Violence', 'Hallucinations', 'Restlessness'],
      physicals: ['High fever', 'Red hot skin', 'Throbbing pains', 'Dilated pupils'],
      relationships: {
        follows: ['Calcarea', 'Kali carb'],
        antidotes: ['Camphora', 'Coffea', 'Opium'],
        complementary: ['Calcarea carb']
      },
      dosage: 'Use 30C for acute conditions, repeat as needed',
      aiScore: 92,
      usage: 'Very Common'
    },
    {
      id: 3,
      name: 'Phosphorus',
      latinName: 'Phosphorus',
      commonName: 'Phosphorus',
      category: 'constitutional',
      potencies: ['30C', '200C', '1M', '10M'],
      source: 'Mineral',
      constitution: 'Tall, lean, sympathetic, artistic individuals',
      keynotes: 'Desires company, sympathetic, desires cold drinks, burning pains',
      indications: ['Respiratory conditions', 'Liver problems', 'Bleeding disorders', 'Nervous exhaustion'],
      modalities: {
        better: ['Cold drinks', 'Ice', 'Sleep', 'Company'],
        worse: ['Warm food/drinks', 'Weather changes', 'Emotions', 'Evening']
      },
      mentals: ['Sympathetic', 'Sensitive', 'Fears thunderstorms', 'Desires company'],
      physicals: ['Tall lean build', 'Burning pains', 'Easy bleeding', 'Weak chest'],
      relationships: {
        follows: ['Arsenicum', 'Sulphur'],
        antidotes: ['Nux vomica', 'Coffea'],
        complementary: ['Arsenicum', 'Lycopodium']
      },
      dosage: 'Constitutional remedy - use 200C or higher potencies',
      aiScore: 88,
      usage: 'Common'
    },
    {
      id: 4,
      name: 'Nux Vomica',
      latinName: 'Strychnos nux vomica',
      commonName: 'Poison Nut',
      category: 'constitutional',
      potencies: ['6C', '30C', '200C', '1M'],
      source: 'Plant',
      constitution: 'Ambitious, irritable, impatient businessmen',
      keynotes: 'Irritability, digestive issues, chilly, oversensitive',
      indications: ['Digestive disorders', 'Insomnia', 'Headaches', 'Constipation', 'Hangovers'],
      modalities: {
        better: ['Warmth', 'Rest', 'Evening', 'Damp weather'],
        worse: ['Cold', 'Morning', 'Mental exertion', 'Anger', 'Stimulants']
      },
      mentals: ['Irritable', 'Impatient', 'Fault-finding', 'Ambitious', 'Hypersensitive'],
      physicals: ['Chilly', 'Digestive problems', 'Constipation', 'Muscle cramps'],
      relationships: {
        follows: ['Sulphur', 'Sepia'],
        antidotes: ['Coffea', 'Ignatia'],
        complementary: ['Sulphur', 'Kali carb']
      },
      dosage: 'Use 30C for acute, higher potencies for constitutional',
      aiScore: 90,
      usage: 'Very Common'
    },
    {
      id: 5,
      name: 'Sulphur',
      latinName: 'Sulphur',
      commonName: 'Sulfur',
      category: 'constitutional',
      potencies: ['6C', '30C', '200C', '1M', '10M'],
      source: 'Mineral',
      constitution: 'Philosophical, untidy, hot-blooded individuals',
      keynotes: 'Hot patient, philosophical mind, skin conditions, lazy',
      indications: ['Skin conditions', 'Chronic diseases', 'Digestive issues', 'Mental symptoms'],
      modalities: {
        better: ['Dry warm weather', 'Motion', 'Fresh air'],
        worse: ['Heat', 'Bathing', '11 AM', 'Standing', 'Suppressed eruptions']
      },
      mentals: ['Philosophical', 'Lazy', 'Selfish', 'Theoretical', 'Forgetful'],
      physicals: ['Hot patient', 'Burning sensations', 'Skin eruptions', 'Red orifices'],
      relationships: {
        follows: ['Aconitum', 'Nux vomica'],
        antidotes: ['Sepia', 'Pulsatilla'],
        complementary: ['Aesculus', 'Psorinum']
      },
      dosage: 'Constitutional remedy - start with 30C, may need higher potencies',
      aiScore: 85,
      usage: 'Common'
    }
  ];

  useEffect(() => {
    setRemedies(mockRemedies);
    setFilteredRemedies(mockRemedies);
  }, []);

  useEffect(() => {
    filterRemedies();
  }, [searchTerm, selectedCategory, remedies]);

  const filterRemedies = () => {
    let filtered = remedies;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(remedy => remedy.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(remedy => 
        remedy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        remedy.keynotes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        remedy.indications.some(indication => 
          indication.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    setFilteredRemedies(filtered);
  };

  const handleAISearch = async () => {
    setIsAISearching(true);
    
    // Simulate AI-powered intelligent search
    setTimeout(() => {
      const aiResults = mockRemedies.sort((a, b) => {
        // AI scoring based on search relevance
        const aScore = calculateAIScore(a, searchTerm);
        const bScore = calculateAIScore(b, searchTerm);
        return bScore - aScore;
      });
      
      setFilteredRemedies(aiResults);
      setIsAISearching(false);
    }, 1500);
  };

  const calculateAIScore = (remedy, query) => {
    let score = 0;
    const lowerQuery = query.toLowerCase();
    
    // Name match
    if (remedy.name.toLowerCase().includes(lowerQuery)) score += 50;
    
    // Keynotes match
    if (remedy.keynotes.toLowerCase().includes(lowerQuery)) score += 30;
    
    // Indications match
    remedy.indications.forEach(indication => {
      if (indication.toLowerCase().includes(lowerQuery)) score += 20;
    });
    
    // Mental symptoms match
    remedy.mentals.forEach(mental => {
      if (mental.toLowerCase().includes(lowerQuery)) score += 15;
    });
    
    return score + remedy.aiScore;
  };

  const handleRemedySelect = (remedy) => {
    setSelectedRemedy(remedy);
    setShowRemedyModal(true);
  };

  // Add New Remedy functionality
  const handleAddNewRemedy = () => {
    setShowAddRemedyModal(true);
  };

  const handleSaveNewRemedy = () => {
    if (!newRemedyForm.name || !newRemedyForm.keynotes) {
      alert('Please fill in at least the remedy name and keynotes.');
      return;
    }

    // Check for duplicate remedy names
    const duplicateRemedy = remedies.find(remedy => 
      remedy.name.toLowerCase() === newRemedyForm.name.toLowerCase()
    );
    
    if (duplicateRemedy) {
      const confirmAdd = window.confirm(
        `A remedy named "${duplicateRemedy.name}" already exists in the database.\n\nDo you want to add this remedy anyway?\n\nExisting remedy details:\n- Category: ${duplicateRemedy.category}\n- Keynotes: ${duplicateRemedy.keynotes.substring(0, 100)}...`
      );
      if (!confirmAdd) {
        return;
      }
    }

    const newRemedy = {
      id: remedies.length + 1,
      name: newRemedyForm.name,
      latinName: newRemedyForm.latinName || newRemedyForm.name,
      commonName: newRemedyForm.commonName || newRemedyForm.name,
      category: newRemedyForm.category,
      potencies: newRemedyForm.potencies.length > 0 ? newRemedyForm.potencies : ['30C', '200C'],
      source: newRemedyForm.source || 'Unknown',
      constitution: newRemedyForm.constitution || 'Not specified',
      keynotes: newRemedyForm.keynotes,
      indications: newRemedyForm.indications.length > 0 ? newRemedyForm.indications : ['General conditions'],
      modalities: {
        better: newRemedyForm.modalitiesBetter.length > 0 ? newRemedyForm.modalitiesBetter : ['Not specified'],
        worse: newRemedyForm.modalitiesWorse.length > 0 ? newRemedyForm.modalitiesWorse : ['Not specified']
      },
      mentals: newRemedyForm.mentals.length > 0 ? newRemedyForm.mentals : ['Not specified'],
      physicals: newRemedyForm.physicals.length > 0 ? newRemedyForm.physicals : ['Not specified'],
      relationships: {
        follows: [],
        antidotes: [],
        complementary: []
      },
      dosage: newRemedyForm.dosage || 'Follow standard homeopathic guidelines',
      aiScore: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
      usage: newRemedyForm.usage
    };

    const updatedRemedies = [...remedies, newRemedy];
    setRemedies(updatedRemedies);
    setFilteredRemedies(updatedRemedies);
    
    // Reset form
    setNewRemedyForm({
      name: '',
      latinName: '',
      commonName: '',
      category: 'constitutional',
      potencies: [],
      source: '',
      constitution: '',
      keynotes: '',
      indications: [],
      modalitiesBetter: [],
      modalitiesWorse: [],
      mentals: [],
      physicals: [],
      dosage: '',
      usage: 'Common'
    });
    
    setShowAddRemedyModal(false);
    
    // Show success message with remedy details
    setTimeout(() => {
      alert(`✅ SUCCESS!\n\nNew remedy "${newRemedy.name}" has been added to the database!\n\nDetails:\n- Category: ${newRemedy.category}\n- Source: ${newRemedy.source}\n- Usage: ${newRemedy.usage}\n- Total remedies in database: ${updatedRemedies.length}`);
    }, 300);
  };

  // Export Database functionality
  const handleExportDatabase = () => {
    setIsExporting(true);
    
    try {
      // Create comprehensive CSV export
      let csvContent = "data:text/csv;charset=utf-8,";
      
      // Header
      csvContent += "Homeopathic Remedy Database Export\n";
      csvContent += `Generated on: ${new Date().toLocaleString()}\n`;
      csvContent += `Total Remedies: ${remedies.length}\n\n`;
      
      // CSV Headers
      csvContent += "Remedy Name,Latin Name,Common Name,Category,Source,Constitution,Keynotes,Indications,Modalities Better,Modalities Worse,Mental Symptoms,Physical Symptoms,Dosage,Potencies,Usage,AI Score\n";
      
      // Remedy data
      remedies.forEach(remedy => {
        const row = [
          `"${remedy.name}"`,
          `"${remedy.latinName}"`,
          `"${remedy.commonName}"`,
          `"${remedy.category}"`,
          `"${remedy.source}"`,
          `"${remedy.constitution}"`,
          `"${remedy.keynotes}"`,
          `"${remedy.indications.join('; ')}"`,
          `"${remedy.modalities.better.join('; ')}"`,
          `"${remedy.modalities.worse.join('; ')}"`,
          `"${remedy.mentals.join('; ')}"`,
          `"${remedy.physicals.join('; ')}"`,
          `"${remedy.dosage}"`,
          `"${remedy.potencies.join(', ')}"`,
          `"${remedy.usage}"`,
          remedy.aiScore
        ].join(',');
        csvContent += row + "\n";
      });

      // Create download
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `homeopathy_remedy_database_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        setIsExporting(false);
        alert(`Database exported successfully! ${remedies.length} remedies included.`);
      }, 1000);
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
      alert('Export failed. Please try again.');
    }
  };

  // Helper function to handle array inputs
  const handleArrayInput = (value, fieldName) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    setNewRemedyForm(prev => ({
      ...prev,
      [fieldName]: arrayValue
    }));
  };

  return (
    <div className="homeopathy-remedy-database">
      <Container fluid>
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="mb-1">AI-Enhanced Remedy Database</h2>
                <p className="text-muted mb-0">Comprehensive homeopathic materia medica with intelligent search</p>
              </div>
              <div className="d-flex gap-2">
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={handleAddNewRemedy}
                >
                  <i className="ri-add-line me-1"></i>Add New Remedy
                </Button>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={handleExportDatabase}
                  disabled={isExporting}
                  title={`Export all ${remedies.length} remedies to CSV file`}
                >
                  {isExporting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1"></span>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <i className="ri-download-line me-1"></i>Export Database 
                      <small className="ms-1">({remedies.length} remedies)</small>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Search and Filters */}
        <Row className="mb-4">
          <Col lg={8}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <Row className="align-items-end">
                  <Col md={6}>
                    <Form.Label>Intelligent Search</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="Search by remedy name, symptoms, or conditions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <Button 
                        variant="primary" 
                        onClick={handleAISearch}
                        disabled={isAISearching}
                      >
                        {isAISearching ? (
                          <div className="spinner-border spinner-border-sm" role="status"></div>
                        ) : (
                          <i className="ri-brain-line"></i>
                        )}
                      </Button>
                    </InputGroup>
                  </Col>
                  <Col md={4}>
                    <Form.Label>Category</Form.Label>
                    <Form.Select 
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={2}>
                    <Button variant="outline-secondary" className="w-100">
                      <i className="ri-filter-line me-1"></i>Filters
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="d-flex justify-content-around">
                  <div>
                    <h4 className="mb-0 text-primary">{filteredRemedies.length}</h4>
                    <small className="text-muted">Remedies Found</small>
                  </div>
                  <div>
                    <h4 className="mb-0 text-success">{remedies.length}</h4>
                    <small className="text-muted">Total Database</small>
                  </div>
                  <div>
                    <h4 className="mb-0 text-info">98%</h4>
                    <small className="text-muted">AI Accuracy</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Remedy Results */}
        <Row>
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-transparent border-0 pb-0">
                <h5 className="mb-0">
                  <i className="ri-medicine-bottle-line text-primary me-2"></i>
                  Remedy Database Results
                </h5>
              </Card.Header>
              <Card.Body>
                {filteredRemedies.length === 0 ? (
                  <Alert variant="info" className="text-center">
                    <i className="ri-search-line me-2"></i>
                    No remedies found matching your criteria. Try adjusting your search terms.
                  </Alert>
                ) : (
                  <Table responsive className="table-hover">
                    <thead>
                      <tr className="text-muted">
                        <th>Remedy</th>
                        <th>Category</th>
                        <th>Source</th>
                        <th>Keynotes</th>
                        <th>Usage</th>
                        <th>AI Score</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRemedies.map((remedy, index) => (
                        <tr key={remedy.id} className="cursor-pointer" onClick={() => handleRemedySelect(remedy)}>
                          <td>
                            <div>
                              <strong className="text-primary">{remedy.name}</strong>
                              <br />
                              <small className="text-muted fst-italic">{remedy.latinName}</small>
                              <br />
                              <div className="d-flex gap-1 mt-1">
                                {remedy.potencies.slice(0, 4).map(potency => (
                                  <Badge key={potency} bg="outline-secondary" className="small">
                                    {potency}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </td>
                          <td>
                            <Badge 
                              bg={remedy.category === 'constitutional' ? 'primary' : 
                                  remedy.category === 'acute' ? 'warning' : 'secondary'}
                            >
                              {remedy.category}
                            </Badge>
                          </td>
                          <td>
                            <Badge bg="info">{remedy.source}</Badge>
                          </td>
                          <td>
                            <small>{remedy.keynotes.substring(0, 80)}...</small>
                          </td>
                          <td>
                            <Badge 
                              bg={remedy.usage === 'Very Common' ? 'success' : 
                                  remedy.usage === 'Common' ? 'primary' : 'secondary'}
                            >
                              {remedy.usage}
                            </Badge>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="progress me-2" style={{width: '60px', height: '6px'}}>
                                <div 
                                  className="progress-bar bg-primary" 
                                  style={{width: `${remedy.aiScore}%`}}
                                ></div>
                              </div>
                              <small>{remedy.aiScore}</small>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemedySelect(remedy);
                                }}
                              >
                                <i className="ri-eye-line"></i>
                              </Button>
                              <Button variant="outline-success" size="sm">
                                <i className="ri-heart-line"></i>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Remedy Details Modal */}
      <Modal show={showRemedyModal} onHide={() => setShowRemedyModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-medicine-bottle-line me-2 text-primary"></i>
            {selectedRemedy?.name} - Complete Materia Medica
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRemedy && (
            <Tabs defaultActiveKey="overview">
              <Tab eventKey="overview" title="Overview">
                <Row className="mt-3">
                  <Col md={6}>
                    <Card className="border-0 bg-light mb-3">
                      <Card.Body>
                        <h6 className="text-muted mb-2">Basic Information</h6>
                        <p><strong>Latin Name:</strong> {selectedRemedy.latinName}</p>
                        <p><strong>Common Name:</strong> {selectedRemedy.commonName}</p>
                        <p><strong>Source:</strong> {selectedRemedy.source}</p>
                        <p><strong>Category:</strong> 
                          <Badge bg="primary" className="ms-2">{selectedRemedy.category}</Badge>
                        </p>
                        <p><strong>Available Potencies:</strong></p>
                        <div className="d-flex gap-1">
                          {selectedRemedy.potencies.map(potency => (
                            <Badge key={potency} bg="outline-primary">{potency}</Badge>
                          ))}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="border-0 bg-light mb-3">
                      <Card.Body>
                        <h6 className="text-muted mb-2">Constitution & Keynotes</h6>
                        <p><strong>Constitutional Type:</strong> {selectedRemedy.constitution}</p>
                        <p><strong>Keynotes:</strong> {selectedRemedy.keynotes}</p>
                        <p><strong>Dosage Guidelines:</strong> {selectedRemedy.dosage}</p>
                        <p><strong>AI Relevance Score:</strong> 
                          <Badge bg="success" className="ms-2">{selectedRemedy.aiScore}/100</Badge>
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="symptoms" title="Symptoms">
                <Row className="mt-3">
                  <Col md={6}>
                    <Card className="border-0 bg-light">
                      <Card.Body>
                        <h6 className="text-primary mb-3">Mental Symptoms</h6>
                        <ul className="list-unstyled">
                          {selectedRemedy.mentals.map((mental, index) => (
                            <li key={index} className="mb-1">
                              <i className="ri-checkbox-circle-line text-success me-2"></i>
                              {mental}
                            </li>
                          ))}
                        </ul>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="border-0 bg-light">
                      <Card.Body>
                        <h6 className="text-primary mb-3">Physical Symptoms</h6>
                        <ul className="list-unstyled">
                          {selectedRemedy.physicals.map((physical, index) => (
                            <li key={index} className="mb-1">
                              <i className="ri-checkbox-circle-line text-info me-2"></i>
                              {physical}
                            </li>
                          ))}
                        </ul>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="modalities" title="Modalities">
                <Row className="mt-3">
                  <Col md={6}>
                    <Card className="border-0 bg-success bg-opacity-10">
                      <Card.Body>
                        <h6 className="text-success mb-3">
                          <i className="ri-arrow-up-line me-1"></i>
                          Better From
                        </h6>
                        <ul className="list-unstyled">
                          {selectedRemedy.modalities.better.map((item, index) => (
                            <li key={index} className="mb-1">
                              <i className="ri-add-circle-line text-success me-2"></i>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="border-0 bg-danger bg-opacity-10">
                      <Card.Body>
                        <h6 className="text-danger mb-3">
                          <i className="ri-arrow-down-line me-1"></i>
                          Worse From
                        </h6>
                        <ul className="list-unstyled">
                          {selectedRemedy.modalities.worse.map((item, index) => (
                            <li key={index} className="mb-1">
                              <i className="ri-subtract-line text-danger me-2"></i>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="indications" title="Clinical Indications">
                <div className="mt-3">
                  <h6 className="text-muted mb-3">Main Clinical Conditions</h6>
                  <Row>
                    {selectedRemedy.indications.map((indication, index) => (
                      <Col md={4} key={index} className="mb-2">
                        <Card className="border-0 bg-light">
                          <Card.Body className="py-2">
                            <small>
                              <i className="ri-medical-mask-line text-primary me-2"></i>
                              {indication}
                            </small>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              </Tab>

              <Tab eventKey="relationships" title="Remedy Relationships">
                <Row className="mt-3">
                  <Col md={4}>
                    <Card className="border-0 bg-light">
                      <Card.Body>
                        <h6 className="text-primary mb-3">Follows Well</h6>
                        {selectedRemedy.relationships.follows.map((remedy, index) => (
                          <Badge key={index} bg="primary" className="me-1 mb-1">{remedy}</Badge>
                        ))}
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="border-0 bg-light">
                      <Card.Body>
                        <h6 className="text-warning mb-3">Antidotes</h6>
                        {selectedRemedy.relationships.antidotes.map((remedy, index) => (
                          <Badge key={index} bg="warning" className="me-1 mb-1">{remedy}</Badge>
                        ))}
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="border-0 bg-light">
                      <Card.Body>
                        <h6 className="text-success mb-3">Complementary</h6>
                        {selectedRemedy.relationships.complementary.map((remedy, index) => (
                          <Badge key={index} bg="success" className="me-1 mb-1">{remedy}</Badge>
                        ))}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab>
            </Tabs>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowRemedyModal(false)}>
            Close
          </Button>
          <Button variant="success">
            <i className="ri-heart-line me-1"></i>
            Add to Favorites
          </Button>
          <Button variant="primary">
            <i className="ri-file-text-line me-1"></i>
            Add to Prescription
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add New Remedy Modal */}
      <Modal 
        show={showAddRemedyModal} 
        onHide={() => setShowAddRemedyModal(false)} 
        size="xl"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-add-line me-2"></i>
            Add New Remedy to Database
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Tabs defaultActiveKey="basic-info" className="mb-3">
              <Tab eventKey="basic-info" title="Basic Information">
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Remedy Name *</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g., Arsenicum Album"
                        value={newRemedyForm.name}
                        onChange={(e) => setNewRemedyForm({...newRemedyForm, name: e.target.value})}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Latin Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g., Arsenicum album"
                        value={newRemedyForm.latinName}
                        onChange={(e) => setNewRemedyForm({...newRemedyForm, latinName: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Common Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g., White Arsenic"
                        value={newRemedyForm.commonName}
                        onChange={(e) => setNewRemedyForm({...newRemedyForm, commonName: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Select
                        value={newRemedyForm.category}
                        onChange={(e) => setNewRemedyForm({...newRemedyForm, category: e.target.value})}
                      >
                        {categories.filter(cat => cat !== 'all').map(category => (
                          <option key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Source</Form.Label>
                      <Form.Select
                        value={newRemedyForm.source}
                        onChange={(e) => setNewRemedyForm({...newRemedyForm, source: e.target.value})}
                      >
                        <option value="">Select source...</option>
                        <option value="Plant">Plant</option>
                        <option value="Mineral">Mineral</option>
                        <option value="Animal">Animal</option>
                        <option value="Nosode">Nosode</option>
                        <option value="Sarcodes">Sarcodes</option>
                        <option value="Imponderabilia">Imponderabilia</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Potencies (comma-separated)</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g., 6C, 30C, 200C, 1M"
                        value={newRemedyForm.potencies.join(', ')}
                        onChange={(e) => handleArrayInput(e.target.value, 'potencies')}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Usage Frequency</Form.Label>
                      <Form.Select
                        value={newRemedyForm.usage}
                        onChange={(e) => setNewRemedyForm({...newRemedyForm, usage: e.target.value})}
                      >
                        <option value="Very Common">Very Common</option>
                        <option value="Common">Common</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Rare">Rare</option>
                        <option value="Very Rare">Very Rare</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="clinical-info" title="Clinical Information">
                <Form.Group className="mb-3">
                  <Form.Label>Constitution</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Describe the constitutional type that benefits from this remedy"
                    value={newRemedyForm.constitution}
                    onChange={(e) => setNewRemedyForm({...newRemedyForm, constitution: e.target.value})}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Keynotes *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Key characteristic symptoms and features of this remedy"
                    value={newRemedyForm.keynotes}
                    onChange={(e) => setNewRemedyForm({...newRemedyForm, keynotes: e.target.value})}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Main Indications (comma-separated)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="e.g., Anxiety disorders, Gastroenteritis, Asthma"
                    value={newRemedyForm.indications.join(', ')}
                    onChange={(e) => handleArrayInput(e.target.value, 'indications')}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Dosage Guidelines</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Recommended dosage and potency guidelines"
                    value={newRemedyForm.dosage}
                    onChange={(e) => setNewRemedyForm({...newRemedyForm, dosage: e.target.value})}
                  />
                </Form.Group>
              </Tab>

              <Tab eventKey="symptoms" title="Symptoms & Modalities">
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Modalities - Better (comma-separated)</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="e.g., Heat, Warm drinks, Company, Motion"
                        value={newRemedyForm.modalitiesBetter.join(', ')}
                        onChange={(e) => handleArrayInput(e.target.value, 'modalitiesBetter')}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Modalities - Worse (comma-separated)</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="e.g., Cold, Midnight, Alone, Exertion"
                        value={newRemedyForm.modalitiesWorse.join(', ')}
                        onChange={(e) => handleArrayInput(e.target.value, 'modalitiesWorse')}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Mental Symptoms (comma-separated)</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="e.g., Anxiety about health, Fear of death, Restlessness"
                        value={newRemedyForm.mentals.join(', ')}
                        onChange={(e) => handleArrayInput(e.target.value, 'mentals')}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Physical Symptoms (comma-separated)</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="e.g., Burning pains, Exhaustion, Thirst for small sips"
                        value={newRemedyForm.physicals.join(', ')}
                        onChange={(e) => handleArrayInput(e.target.value, 'physicals')}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Tab>
            </Tabs>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowAddRemedyModal(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="outline-primary"
            onClick={() => {
              // Save as draft functionality
              console.log('Draft saved:', newRemedyForm);
              alert('Remedy saved as draft (local storage functionality can be added here)');
            }}
          >
            <i className="ri-draft-line me-1"></i>
            Save as Draft
          </Button>
          <Button 
            variant="primary"
            onClick={handleSaveNewRemedy}
          >
            <i className="ri-save-line me-1"></i>
            Add to Database
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .cursor-pointer {
          cursor: pointer;
        }
        .cursor-pointer:hover {
          background-color: #f8f9fa;
        }
      `}</style>
    </div>
  );
};

export default HomeopathyRemedyDatabase;
