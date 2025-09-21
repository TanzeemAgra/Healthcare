import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Badge, Alert, Modal, ProgressBar, InputGroup } from 'react-bootstrap';

const HomeopathyRepertorization = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRubrics, setSelectedRubrics] = useState([]);
  const [isAISearching, setIsAISearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [remedyResults, setRemedyResults] = useState([]);
  const [showRemedyModal, setShowRemedyModal] = useState(false);
  const [selectedRemedy, setSelectedRemedy] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Initialize with sample rubrics for demonstration
  useEffect(() => {
    // Add some initial rubrics to demonstrate functionality
    const initialRubrics = [
      { id: 1, rubric: 'Mind - Anxiety - health, about', weight: 3, remedies: 45, category: 'Mind' },
      { id: 6, rubric: 'Mind - Fear - death, of', weight: 3, remedies: 18, category: 'Mind' }
    ];
    setSelectedRubrics(initialRubrics);
    calculateRemedies(initialRubrics);
  }, []);

  const [rubricCategories] = useState([
    'Mind', 'Head', 'Eye', 'Ear', 'Nose', 'Face', 'Mouth', 'Throat', 
    'Stomach', 'Abdomen', 'Rectum', 'Urinary', 'Male', 'Female', 
    'Larynx', 'Chest', 'Back', 'Extremities', 'Sleep', 'Fever', 
    'Perspiration', 'Skin', 'Generalities'
  ]);

  const [aiSuggestions] = useState({
    commonRubrics: [
      { rubric: 'Mind - Anxiety - health, about', weight: 3, description: 'Anxiety about health conditions' },
      { rubric: 'Mind - Fear - death, of', weight: 3, description: 'Fear of dying or death' },
      { rubric: 'Generals - Heat - flushes of', weight: 2, description: 'Hot flashes or heat sensations' },
      { rubric: 'Sleep - Sleeplessness - anxiety, from', weight: 2, description: 'Insomnia due to anxiety' },
      { rubric: 'Stomach - Thirst - large quantities, for', weight: 2, description: 'Excessive thirst for large amounts' }
    ],
    aiInsights: [
      'Consider mental symptoms as they often lead to constitutional remedies',
      'Look for peculiar, rare and characteristic symptoms',
      'Modalities (what makes better/worse) are highly valuable',
      'Physical generals take precedence over particulars'
    ]
  });

  const mockRubrics = [
    { id: 1, rubric: 'Mind - Anxiety - health, about', weight: 3, remedies: 45, category: 'Mind' },
    { id: 2, rubric: 'Mind - Restlessness - night', weight: 2, remedies: 32, category: 'Mind' },
    { id: 3, rubric: 'Generals - Heat - sensation of', weight: 2, remedies: 67, category: 'Generalities' },
    { id: 4, rubric: 'Sleep - Sleeplessness - anxiety, from', weight: 2, remedies: 28, category: 'Sleep' },
    { id: 5, rubric: 'Stomach - Thirst - large quantities, for', weight: 2, remedies: 23, category: 'Stomach' },
    { id: 6, rubric: 'Mind - Fear - death, of', weight: 3, remedies: 18, category: 'Mind' },
    { id: 7, rubric: 'Generals - Time - midnight, after', weight: 1, remedies: 42, category: 'Generalities' },
    { id: 8, rubric: 'Head - Pain - burning', weight: 2, remedies: 35, category: 'Head' }
  ];

  const mockRemedies = [
    { 
      name: 'Arsenicum Album', 
      score: 15, 
      weight: 8, 
      coverage: '6/8',
      rubrics: ['Mind - Anxiety - health, about', 'Mind - Restlessness - night', 'Generals - Heat - sensation of', 'Sleep - Sleeplessness - anxiety, from', 'Stomach - Thirst - large quantities, for', 'Mind - Fear - death, of'],
      potencies: ['6C', '30C', '200C', '1M'],
      keynotes: 'Anxiety, restlessness, burning pains, fear of death, thirst for small sips'
    },
    { 
      name: 'Phosphorus', 
      score: 12, 
      weight: 6, 
      coverage: '4/8',
      rubrics: ['Mind - Anxiety - health, about', 'Generals - Heat - sensation of', 'Stomach - Thirst - large quantities, for', 'Head - Pain - burning'],
      potencies: ['30C', '200C', '1M'],
      keynotes: 'Tall, lean, sympathetic, desires cold drinks, burning pains'
    },
    { 
      name: 'Sulphur', 
      score: 10, 
      weight: 5, 
      coverage: '3/8',
      rubrics: ['Mind - Restlessness - night', 'Generals - Heat - sensation of', 'Head - Pain - burning'],
      potencies: ['6C', '30C', '200C'],
      keynotes: 'Hot patient, philosophical, untidy, burning sensations'
    },
    { 
      name: 'Aconitum Napellus', 
      score: 9, 
      weight: 4, 
      coverage: '3/8',
      rubrics: ['Mind - Anxiety - health, about', 'Mind - Fear - death, of', 'Sleep - Sleeplessness - anxiety, from'],
      potencies: ['6C', '30C', '200C'],
      keynotes: 'Sudden onset, fear, anxiety, panic attacks'
    }
  ];

  const handleAISearch = async (query) => {
    setIsAISearching(true);
    
    // Simulate AI search
    setTimeout(() => {
      const filtered = mockRubrics.filter(rubric => 
        rubric.rubric.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
      setIsAISearching(false);
    }, 1000);
  };

  const handleAddRubric = (rubric) => {
    if (!selectedRubrics.find(r => r.id === rubric.id)) {
      setSelectedRubrics([...selectedRubrics, rubric]);
      calculateRemedies([...selectedRubrics, rubric]);
    }
  };

  const handleRemoveRubric = (rubricId) => {
    const filtered = selectedRubrics.filter(r => r.id !== rubricId);
    setSelectedRubrics(filtered);
    calculateRemedies(filtered);
  };

  const calculateRemedies = (rubrics) => {
    if (rubrics.length === 0) {
      setRemedyResults([]);
      return;
    }

    // Simulate remedy calculation based on selected rubrics
    const calculatedRemedies = mockRemedies.map(remedy => {
      const matchingRubrics = rubrics.filter(rubric => 
        remedy.rubrics.includes(rubric.rubric)
      );
      
      const score = matchingRubrics.reduce((total, rubric) => total + rubric.weight, 0);
      const coverage = `${matchingRubrics.length}/${rubrics.length}`;
      
      return {
        ...remedy,
        score,
        coverage,
        matchingRubrics: matchingRubrics.map(r => r.rubric)
      };
    }).filter(remedy => remedy.score > 0)
      .sort((a, b) => b.score - a.score);

    setRemedyResults(calculatedRemedies);
  };

  const handleRemedyDetails = (remedy) => {
    setSelectedRemedy(remedy);
    setShowRemedyModal(true);
  };

  // Export functionality
  const handleExportResults = () => {
    if (remedyResults.length === 0) {
      alert('Please select some rubrics first to generate remedy results before exporting.');
      return;
    }
    
    setIsExporting(true);
    
    try {
      const exportData = {
        timestamp: new Date().toISOString(),
        selectedRubrics: selectedRubrics,
        remedyResults: remedyResults,
        analysis: {
          totalRubrics: selectedRubrics.length,
          totalRemedies: remedyResults.length,
          topRemedy: remedyResults[0]?.name || 'None',
          averageScore: remedyResults.length > 0 ? 
            (remedyResults.reduce((sum, r) => sum + r.score, 0) / remedyResults.length).toFixed(2) : '0'
        }
      };

      // Create CSV format
      let csvContent = "data:text/csv;charset=utf-8,";
      
      // Header
      csvContent += "Homeopathic Repertorization Results\n";
      csvContent += `Generated on: ${new Date().toLocaleString()}\n\n`;
      
      // Selected Rubrics
      csvContent += "Selected Rubrics:\n";
      csvContent += "Rubric,Weight,Category\n";
      selectedRubrics.forEach(rubric => {
        csvContent += `"${rubric.rubric}",${rubric.weight},${rubric.category}\n`;
      });
      
      csvContent += "\n";
      
      // Remedy Results
      csvContent += "Remedy Analysis Results:\n";
      csvContent += "Remedy,Score,Coverage,Matching Rubrics,Keynotes\n";
      remedyResults.forEach(remedy => {
        csvContent += `"${remedy.name}",${remedy.score},"${remedy.coverage}","${remedy.matchingRubrics.join('; ')}","${remedy.keynotes}"\n`;
      });

      // Download file
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `homeopathy_repertorization_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => setIsExporting(false), 1000);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
      setIsExporting(false);
    }
  };

  // Generate Report functionality
  const handleGenerateReport = () => {
    if (remedyResults.length === 0) {
      alert('Please select some rubrics first to generate remedy results before creating a report.');
      return;
    }
    
    setIsGeneratingReport(true);
    setShowReportModal(true);
    
    // Simulate report generation delay
    setTimeout(() => {
      setIsGeneratingReport(false);
    }, 2000);
  };

  const downloadPDFReport = () => {
    // Create HTML content for PDF
    const reportContent = `
      <html>
        <head>
          <title>Homeopathic Repertorization Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 25px; }
            .remedy-item { margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; }
            .rubric-item { margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Homeopathic Repertorization Report</h1>
            <p>Generated on: ${new Date().toLocaleString()}</p>
          </div>
          
          <div class="section">
            <h2>Selected Rubrics (${selectedRubrics.length})</h2>
            ${selectedRubrics.map(rubric => `
              <div class="rubric-item">
                <strong>${rubric.rubric}</strong> (Weight: ${rubric.weight}, Category: ${rubric.category})
              </div>
            `).join('')}
          </div>
          
          <div class="section">
            <h2>Remedy Analysis Results</h2>
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Remedy</th>
                  <th>Score</th>
                  <th>Coverage</th>
                  <th>Keynotes</th>
                </tr>
              </thead>
              <tbody>
                ${remedyResults.map((remedy, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td><strong>${remedy.name}</strong></td>
                    <td>${remedy.score}</td>
                    <td>${remedy.coverage}</td>
                    <td>${remedy.keynotes}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <div class="section">
            <h2>Detailed Analysis</h2>
            ${remedyResults.slice(0, 3).map((remedy, index) => `
              <div class="remedy-item">
                <h3>${index + 1}. ${remedy.name} (Score: ${remedy.score})</h3>
                <p><strong>Coverage:</strong> ${remedy.coverage} rubrics</p>
                <p><strong>Matching Rubrics:</strong></p>
                <ul>
                  ${remedy.matchingRubrics.map(rubric => `<li>${rubric}</li>`).join('')}
                </ul>
                <p><strong>Keynotes:</strong> ${remedy.keynotes}</p>
                <p><strong>Available Potencies:</strong> ${remedy.potencies.join(', ')}</p>
              </div>
            `).join('')}
          </div>
          
          <div class="section">
            <h2>Recommendation</h2>
            <p>Based on the repertorization analysis, <strong>${remedyResults[0]?.name || 'No remedy'}</strong> 
            shows the highest score of ${remedyResults[0]?.score || 0} points with ${remedyResults[0]?.coverage || '0/0'} rubric coverage.</p>
            <p>Consider the patient's constitution, mentals, and modalities for final remedy selection.</p>
          </div>
        </body>
      </html>
    `;

    // Create blob and download
    const blob = new Blob([reportContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `homeopathy_report_${Date.now()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="homeopathy-repertorization">
      <Container fluid>
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="mb-1">AI-Powered Repertorization</h2>
                <p className="text-muted mb-0">Intelligent symptom analysis and remedy selection</p>
              </div>
              <div className="d-flex gap-2">
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  onClick={() => {
                    setSelectedRubrics([]);
                    setRemedyResults([]);
                    setSearchResults([]);
                    setSearchQuery('');
                  }}
                  title="Clear all selected rubrics and start fresh"
                >
                  <i className="ri-refresh-line me-1"></i>Clear All
                </Button>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={handleExportResults}
                  disabled={isExporting}
                  title={remedyResults.length === 0 ? "Select rubrics first to enable export" : "Export analysis results to CSV"}
                >
                  {isExporting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1"></span>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <i className="ri-download-line me-1"></i>Export Results
                      {remedyResults.length === 0 && <small className="ms-1 text-muted">({selectedRubrics.length} rubrics)</small>}
                    </>
                  )}
                </Button>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={handleGenerateReport}
                  disabled={isGeneratingReport}
                  title={remedyResults.length === 0 ? "Select rubrics first to enable report generation" : "Generate detailed analysis report"}
                >
                  {isGeneratingReport ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1"></span>
                      Generating...
                    </>
                  ) : (
                    <>
                      <i className="ri-file-text-line me-1"></i>Generate Report
                      {remedyResults.length === 0 && <small className="ms-1 text-muted">({selectedRubrics.length} rubrics)</small>}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Demo Instructions */}
        {selectedRubrics.length > 0 && (
          <Row className="mb-3">
            <Col>
              <Alert variant="info" className="mb-0">
                <div className="d-flex align-items-center">
                  <i className="ri-information-line me-2"></i>
                  <div>
                    <strong>Demo Mode:</strong> You have {selectedRubrics.length} rubrics selected and {remedyResults.length} remedies analyzed. 
                    Try the <strong>"Export Results"</strong> and <strong>"Generate Report"</strong> buttons above to download your analysis.
                    {selectedRubrics.length === 2 && " Click 'Clear All' to start fresh or search for more rubrics below."}
                  </div>
                </div>
              </Alert>
            </Col>
          </Row>
        )}

        <Row>
          {/* Search and Rubric Selection */}
          <Col lg={8}>
            {/* AI Search */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-transparent border-0 pb-0">
                <h5 className="mb-0">
                  <i className="ri-search-line text-primary me-2"></i>
                  Intelligent Rubric Search
                </h5>
              </Card.Header>
              <Card.Body>
                <InputGroup className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Search rubrics using natural language (e.g., 'anxiety about health', 'worse at night')"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAISearch(searchQuery)}
                  />
                  <Button 
                    variant="primary" 
                    onClick={() => handleAISearch(searchQuery)}
                    disabled={isAISearching}
                  >
                    {isAISearching ? (
                      <div className="spinner-border spinner-border-sm" role="status"></div>
                    ) : (
                      <i className="ri-brain-line"></i>
                    )}
                  </Button>
                </InputGroup>

                {/* Category Quick Access */}
                <div className="mb-3">
                  <small className="text-muted">Quick Categories:</small>
                  <div className="d-flex flex-wrap gap-1 mt-1">
                    {rubricCategories.slice(0, 8).map(category => (
                      <Button 
                        key={category}
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => handleAISearch(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div>
                    <h6 className="mb-2">Search Results</h6>
                    <div className="search-results" style={{maxHeight: '300px', overflowY: 'auto'}}>
                      {searchResults.map(rubric => (
                        <div key={rubric.id} className="d-flex justify-content-between align-items-center p-2 border-bottom hover-bg">
                          <div className="flex-grow-1">
                            <div className="fw-medium">{rubric.rubric}</div>
                            <small className="text-muted">
                              <Badge bg="secondary" className="me-1">Grade {rubric.weight}</Badge>
                              {rubric.remedies} remedies
                            </small>
                          </div>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => handleAddRubric(rubric)}
                          >
                            <i className="ri-add-line"></i>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Selected Rubrics */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-transparent border-0 pb-0">
                <h5 className="mb-0">
                  <i className="ri-bookmark-line text-primary me-2"></i>
                  Selected Rubrics ({selectedRubrics.length})
                </h5>
              </Card.Header>
              <Card.Body>
                {selectedRubrics.length === 0 ? (
                  <Alert variant="info" className="mb-0">
                    <i className="ri-information-line me-1"></i>
                    No rubrics selected. Search and add rubrics to start repertorization.
                  </Alert>
                ) : (
                  <div className="selected-rubrics">
                    {selectedRubrics.map(rubric => (
                      <div key={rubric.id} className="d-flex justify-content-between align-items-center p-2 mb-2 bg-light rounded">
                        <div className="flex-grow-1">
                          <div className="fw-medium">{rubric.rubric}</div>
                          <small className="text-muted">
                            <Badge bg="primary" className="me-1">Weight: {rubric.weight}</Badge>
                            <Badge bg="secondary">{rubric.category}</Badge>
                          </small>
                        </div>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleRemoveRubric(rubric.id)}
                        >
                          <i className="ri-close-line"></i>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Remedy Results */}
            {remedyResults.length > 0 && (
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-transparent border-0 pb-0">
                  <h5 className="mb-0">
                    <i className="ri-medicine-bottle-line text-primary me-2"></i>
                    Repertorization Results
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Table responsive className="table-hover">
                    <thead>
                      <tr className="text-muted">
                        <th>Rank</th>
                        <th>Remedy</th>
                        <th>Score</th>
                        <th>Coverage</th>
                        <th>Keynotes</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {remedyResults.map((remedy, index) => (
                        <tr key={remedy.name}>
                          <td>
                            <Badge bg={index === 0 ? 'primary' : index === 1 ? 'success' : 'secondary'}>
                              #{index + 1}
                            </Badge>
                          </td>
                          <td>
                            <div>
                              <strong>{remedy.name}</strong>
                              <br />
                              <div className="d-flex gap-1">
                                {remedy.potencies.slice(0, 3).map(potency => (
                                  <Badge key={potency} bg="outline-secondary" className="small">
                                    {potency}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <ProgressBar 
                                now={(remedy.score / Math.max(...remedyResults.map(r => r.score))) * 100} 
                                className="me-2" 
                                style={{width: '80px', height: '8px'}}
                                variant={index === 0 ? 'primary' : index === 1 ? 'success' : 'secondary'}
                              />
                              <strong>{remedy.score}</strong>
                            </div>
                          </td>
                          <td>
                            <Badge bg="info">{remedy.coverage}</Badge>
                          </td>
                          <td>
                            <small className="text-muted">
                              {remedy.keynotes.substring(0, 50)}...
                            </small>
                          </td>
                          <td>
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => handleRemedyDetails(remedy)}
                            >
                              <i className="ri-eye-line"></i>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            )}
          </Col>

          {/* AI Assistant Sidebar */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm sticky-top">
              <Card.Header className="bg-primary text-white">
                <h6 className="mb-0">
                  <i className="ri-robot-line me-2"></i>
                  AI Repertory Assistant
                </h6>
              </Card.Header>
              <Card.Body>
                {/* AI Insights */}
                <div className="mb-4">
                  <h6 className="text-muted mb-2">AI Insights</h6>
                  {aiSuggestions.aiInsights.map((insight, index) => (
                    <Alert key={index} variant="info" className="small py-2 mb-2">
                      <i className="ri-lightbulb-line me-1"></i>
                      {insight}
                    </Alert>
                  ))}
                </div>

                {/* Common Rubrics */}
                <div className="mb-4">
                  <h6 className="text-muted mb-2">Commonly Used Rubrics</h6>
                  {aiSuggestions.commonRubrics.map((item, index) => (
                    <div key={index} className="mb-2">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1 me-2">
                          <small className="fw-medium">{item.rubric}</small>
                          <br />
                          <small className="text-muted">{item.description}</small>
                        </div>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleAddRubric({
                            id: Date.now() + index,
                            rubric: item.rubric,
                            weight: item.weight,
                            remedies: Math.floor(Math.random() * 50) + 10,
                            category: item.rubric.split(' - ')[0]
                          })}
                        >
                          <i className="ri-add-line"></i>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="d-grid gap-2">
                  <Button variant="outline-primary" size="sm">
                    <i className="ri-history-line me-1"></i>
                    View History
                  </Button>
                  <Button variant="outline-primary" size="sm">
                    <i className="ri-save-line me-1"></i>
                    Save Session
                  </Button>
                  <Button variant="outline-primary" size="sm">
                    <i className="ri-refresh-line me-1"></i>
                    Clear All
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Remedy Details Modal */}
      <Modal show={showRemedyModal} onHide={() => setShowRemedyModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-medicine-bottle-line me-2 text-primary"></i>
            {selectedRemedy?.name} - Detailed Analysis
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRemedy && (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Total Score:</strong> {selectedRemedy.score}
                </Col>
                <Col md={6}>
                  <strong>Coverage:</strong> {selectedRemedy.coverage}
                </Col>
              </Row>
              
              <div className="mb-3">
                <strong>Keynotes:</strong>
                <p className="mt-1">{selectedRemedy.keynotes}</p>
              </div>

              <div className="mb-3">
                <strong>Available Potencies:</strong>
                <div className="d-flex gap-1 mt-1">
                  {selectedRemedy.potencies.map(potency => (
                    <Badge key={potency} bg="primary">{potency}</Badge>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <strong>Matching Rubrics:</strong>
                <ul className="mt-1">
                  {selectedRemedy.matchingRubrics?.map((rubric, index) => (
                    <li key={index}><small>{rubric}</small></li>
                  ))}
                </ul>
              </div>

              <Alert variant="info">
                <strong>AI Recommendation:</strong> This remedy shows strong correlation with the selected symptom pattern. Consider the patient's constitutional type and modalities before final prescription.
              </Alert>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowRemedyModal(false)}>
            Close
          </Button>
          <Button variant="primary">
            <i className="ri-file-text-line me-1"></i>
            Add to Prescription
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Report Generation Modal */}
      <Modal 
        show={showReportModal} 
        onHide={() => setShowReportModal(false)} 
        size="lg"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="ri-file-text-line me-2"></i>
            Generate Repertorization Report
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isGeneratingReport ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Generating report...</span>
              </div>
              <h5>Generating Your Detailed Report</h5>
              <p className="text-muted">Analyzing rubrics and remedy correlations...</p>
            </div>
          ) : (
            <div>
              <div className="alert alert-success">
                <i className="ri-check-circle-line me-2"></i>
                Report Generated Successfully!
              </div>
              
              <div className="row">
                <div className="col-md-6">
                  <Card className="border-0 bg-light h-100">
                    <Card.Body>
                      <h6 className="mb-3">
                        <i className="ri-file-list-line text-primary me-2"></i>
                        Report Summary
                      </h6>
                      <div className="small">
                        <div className="d-flex justify-content-between mb-2">
                          <span>Total Rubrics:</span>
                          <strong>{selectedRubrics.length}</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Analyzed Remedies:</span>
                          <strong>{remedyResults.length}</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Top Remedy:</span>
                          <strong>{remedyResults[0]?.name || 'None'}</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Highest Score:</span>
                          <strong>{remedyResults[0]?.score || 0}</strong>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>Generated:</span>
                          <strong>{new Date().toLocaleString()}</strong>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
                
                <div className="col-md-6">
                  <Card className="border-0 bg-light h-100">
                    <Card.Body>
                      <h6 className="mb-3">
                        <i className="ri-download-2-line text-success me-2"></i>
                        Download Options
                      </h6>
                      <div className="d-grid gap-2">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={downloadPDFReport}
                        >
                          <i className="ri-file-pdf-line me-1"></i>
                          Download HTML Report
                        </Button>
                        <Button 
                          variant="outline-success" 
                          size="sm"
                          onClick={handleExportResults}
                        >
                          <i className="ri-file-excel-line me-1"></i>
                          Download CSV Data
                        </Button>
                        <Button 
                          variant="outline-info" 
                          size="sm"
                          onClick={() => {
                            const reportData = {
                              rubrics: selectedRubrics,
                              remedies: remedyResults,
                              timestamp: new Date().toISOString()
                            };
                            navigator.clipboard.writeText(JSON.stringify(reportData, null, 2));
                            alert('Report data copied to clipboard!');
                          }}
                        >
                          <i className="ri-clipboard-line me-1"></i>
                          Copy JSON Data
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </div>

              <div className="mt-4">
                <h6>Report Preview:</h6>
                <div className="border rounded p-3 bg-white" style={{maxHeight: '300px', overflowY: 'auto'}}>
                  <h5>Top 3 Recommended Remedies:</h5>
                  {remedyResults.slice(0, 3).map((remedy, index) => (
                    <div key={remedy.name} className="mb-3 pb-2 border-bottom">
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-1">
                          #{index + 1} {remedy.name}
                        </h6>
                        <Badge bg="primary">Score: {remedy.score}</Badge>
                      </div>
                      <p className="text-muted small mb-1">
                        <strong>Coverage:</strong> {remedy.coverage} | 
                        <strong> Keynotes:</strong> {remedy.keynotes}
                      </p>
                      <div className="small text-info">
                        <strong>Matching Rubrics:</strong> {remedy.matchingRubrics.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowReportModal(false)}
          >
            Close
          </Button>
          {!isGeneratingReport && (
            <Button 
              variant="primary"
              onClick={downloadPDFReport}
            >
              <i className="ri-download-line me-1"></i>
              Download Report
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .hover-bg:hover {
          background-color: #f8f9fa;
        }
        .sticky-top {
          top: 20px;
        }
        .search-results {
          border: 1px solid #e9ecef;
          border-radius: 0.375rem;
        }
      `}</style>
    </div>
  );
};

export default HomeopathyRepertorization;
