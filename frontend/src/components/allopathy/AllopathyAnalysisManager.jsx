import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Modal, Badge, Alert, Spinner, InputGroup, Row, Col, Nav, Tab } from 'react-bootstrap';
import { Brain, FileText, TrendingUp, Calendar, User, Hospital, Search, Filter, Eye, Download, BarChart3 } from 'lucide-react';
import axios from 'axios';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AllopathyAnalysisManager = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [stats, setStats] = useState({});

  const analysisTypeColors = {
    'image_analysis': '#3498db',
    'lab_analysis': '#e74c3c',
    'report_analysis': '#f39c12',
    'ai_diagnosis': '#9b59b6',
    'prediction': '#1abc9c'
  };

  const statusVariants = {
    'pending': 'warning',
    'processing': 'info',
    'completed': 'success',
    'failed': 'danger',
    'reviewing': 'primary'
  };

  useEffect(() => {
    fetchAnalyses();
    fetchStats();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const response = await axios.get('/api/allopathy/analyses/');
      setAnalyses(response.data.results || response.data);
    } catch (err) {
      setError('Failed to fetch analyses');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/allopathy/analyses/stats/');
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats');
    }
  };

  const triggerAnalysis = async (fileId) => {
    try {
      await axios.post(`/api/allopathy/files/${fileId}/analyze/`);
      setSuccess('Analysis triggered successfully');
      fetchAnalyses();
    } catch (err) {
      setError('Failed to trigger analysis');
    }
  };

  const viewAnalysisDetails = (analysis) => {
    setSelectedAnalysis(analysis);
    setShowDetailsModal(true);
  };

  const downloadReport = async (analysisId) => {
    try {
      const response = await axios.get(`/api/allopathy/analyses/${analysisId}/report/`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `analysis_report_${analysisId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download report');
    }
  };

  const filteredAnalyses = analyses.filter(analysis => {
    const matchesSearch = analysis.file_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         analysis.analysis_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         analysis.results?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || analysis.status === filterStatus;
    const matchesType = !filterType || analysis.analysis_type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Chart data for analytics
  const analysisTypeChartData = {
    labels: Object.keys(stats.by_type || {}),
    datasets: [{
      data: Object.values(stats.by_type || {}),
      backgroundColor: Object.keys(stats.by_type || {}).map(type => analysisTypeColors[type] || '#95a5a6'),
      borderWidth: 0
    }]
  };

  const dailyAnalysisChartData = {
    labels: stats.daily_counts?.map(item => item.date) || [],
    datasets: [{
      label: 'Analyses per Day',
      data: stats.daily_counts?.map(item => item.count) || [],
      borderColor: '#3498db',
      backgroundColor: 'rgba(52, 152, 219, 0.1)',
      tension: 0.4
    }]
  };

  const accuracyChartData = {
    labels: ['High Confidence', 'Medium Confidence', 'Low Confidence'],
    datasets: [{
      label: 'Analysis Confidence',
      data: [stats.high_confidence || 0, stats.medium_confidence || 0, stats.low_confidence || 0],
      backgroundColor: ['#27ae60', '#f39c12', '#e74c3c']
    }]
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading analyses...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <Row className="mb-4">
        <Col>
          <h2 className="mb-0">AI Analysis Manager</h2>
          <p className="text-muted">Manage and review AI-powered medical analyses</p>
        </Col>
      </Row>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 p-3 rounded">
                  <Brain className="text-primary" size={24} />
                </div>
                <div className="ms-3">
                  <h3 className="mb-0">{stats.total_analyses || 0}</h3>
                  <small className="text-muted">Total Analyses</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="bg-success bg-opacity-10 p-3 rounded">
                  <TrendingUp className="text-success" size={24} />
                </div>
                <div className="ms-3">
                  <h3 className="mb-0">{stats.completed_analyses || 0}</h3>
                  <small className="text-muted">Completed</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="bg-warning bg-opacity-10 p-3 rounded">
                  <Calendar className="text-warning" size={24} />
                </div>
                <div className="ms-3">
                  <h3 className="mb-0">{stats.pending_analyses || 0}</h3>
                  <small className="text-muted">Pending</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="bg-info bg-opacity-10 p-3 rounded">
                  <BarChart3 className="text-info" size={24} />
                </div>
                <div className="ms-3">
                  <h3 className="mb-0">{stats.average_accuracy || 0}%</h3>
                  <small className="text-muted">Avg Accuracy</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tab Navigation */}
      <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey="list">
              <FileText size={20} className="me-2" />
              Analysis List
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="analytics">
              <BarChart3 size={20} className="me-2" />
              Analytics
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="list">
            {/* Search and Filter Controls */}
            <Card className="mb-4">
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <InputGroup>
                      <InputGroup.Text><Search size={20} /></InputGroup.Text>
                      <Form.Control
                        placeholder="Search analyses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  <Col md={3}>
                    <Form.Select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                      <option value="reviewing">Reviewing</option>
                    </Form.Select>
                  </Col>
                  <Col md={3}>
                    <Form.Select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                    >
                      <option value="">All Types</option>
                      <option value="image_analysis">Image Analysis</option>
                      <option value="lab_analysis">Lab Analysis</option>
                      <option value="report_analysis">Report Analysis</option>
                      <option value="ai_diagnosis">AI Diagnosis</option>
                      <option value="prediction">Prediction</option>
                    </Form.Select>
                  </Col>
                  <Col md={2}>
                    <div className="text-muted">
                      {filteredAnalyses.length} results
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Analyses Table */}
            <Card>
              <Card.Body className="p-0">
                <Table responsive hover className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>File</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Confidence</th>
                      <th>Results Preview</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAnalyses.map(analysis => (
                      <tr key={analysis.id}>
                        <td>
                          <div>
                            <div className="fw-bold">{analysis.file_name || 'Unknown File'}</div>
                            <small className="text-muted">ID: {analysis.file}</small>
                          </div>
                        </td>
                        <td>
                          <Badge 
                            bg="outline-primary"
                            style={{ backgroundColor: analysisTypeColors[analysis.analysis_type] + '20' }}
                          >
                            {analysis.analysis_type.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={statusVariants[analysis.status]}>
                            {analysis.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td>
                          {analysis.confidence_score && (
                            <div>
                              <div className="small">{(analysis.confidence_score * 100).toFixed(1)}%</div>
                              <div className="progress" style={{ height: '4px', width: '60px' }}>
                                <div 
                                  className="progress-bar" 
                                  style={{ 
                                    width: `${analysis.confidence_score * 100}%`,
                                    backgroundColor: analysis.confidence_score > 0.8 ? '#27ae60' : 
                                                   analysis.confidence_score > 0.6 ? '#f39c12' : '#e74c3c'
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="text-truncate" style={{ maxWidth: '200px' }}>
                            {analysis.results ? 
                              JSON.stringify(analysis.results).substring(0, 100) + '...' : 
                              'No results yet'
                            }
                          </div>
                        </td>
                        <td>
                          <small className="text-muted">
                            {new Date(analysis.created_at).toLocaleDateString()}
                          </small>
                        </td>
                        <td>
                          <div className="btn-group" role="group">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => viewAnalysisDetails(analysis)}
                              title="View Details"
                            >
                              <Eye size={16} />
                            </Button>
                            {analysis.status === 'completed' && (
                              <Button
                                variant="outline-success"
                                size="sm"
                                onClick={() => downloadReport(analysis.id)}
                                title="Download Report"
                              >
                                <Download size={16} />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredAnalyses.length === 0 && (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          <div className="text-muted">
                            {searchTerm || filterStatus || filterType ? 
                              'No analyses match your criteria' : 
                              'No analyses found'
                            }
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab.Pane>

          <Tab.Pane eventKey="analytics">
            <Row>
              <Col md={6}>
                <Card className="mb-4">
                  <Card.Header>
                    <h5 className="mb-0">Analysis Types Distribution</h5>
                  </Card.Header>
                  <Card.Body>
                    <div style={{ height: '300px' }}>
                      <Doughnut 
                        data={analysisTypeChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'bottom'
                            }
                          }
                        }}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="mb-4">
                  <Card.Header>
                    <h5 className="mb-0">Confidence Levels</h5>
                  </Card.Header>
                  <Card.Body>
                    <div style={{ height: '300px' }}>
                      <Bar 
                        data={accuracyChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: false
                            }
                          }
                        }}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">Daily Analysis Trends</h5>
                  </Card.Header>
                  <Card.Body>
                    <div style={{ height: '300px' }}>
                      <Line 
                        data={dailyAnalysisChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true
                            }
                          }
                        }}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      {/* Analysis Details Modal */}
      <Modal 
        show={showDetailsModal} 
        onHide={() => setShowDetailsModal(false)} 
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Analysis Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAnalysis && (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <h6>Analysis Information</h6>
                  <p><strong>Type:</strong> {selectedAnalysis.analysis_type}</p>
                  <p><strong>Status:</strong> {selectedAnalysis.status}</p>
                  <p><strong>Confidence:</strong> {selectedAnalysis.confidence_score ? 
                    (selectedAnalysis.confidence_score * 100).toFixed(1) + '%' : 'N/A'}</p>
                </Col>
                <Col md={6}>
                  <h6>File Information</h6>
                  <p><strong>File:</strong> {selectedAnalysis.file_name}</p>
                  <p><strong>Created:</strong> {new Date(selectedAnalysis.created_at).toLocaleString()}</p>
                  <p><strong>Updated:</strong> {new Date(selectedAnalysis.updated_at).toLocaleString()}</p>
                </Col>
              </Row>
              
              <h6>Analysis Results</h6>
              <div className="bg-light p-3 rounded">
                <pre className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                  {selectedAnalysis.results ? 
                    JSON.stringify(selectedAnalysis.results, null, 2) : 
                    'No results available'
                  }
                </pre>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
          {selectedAnalysis?.status === 'completed' && (
            <Button 
              variant="primary" 
              onClick={() => downloadReport(selectedAnalysis.id)}
            >
              Download Report
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AllopathyAnalysisManager;
