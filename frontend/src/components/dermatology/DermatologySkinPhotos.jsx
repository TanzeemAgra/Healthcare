import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Alert,
  Spinner,
  Badge,
  Image,
  Dropdown,
  InputGroup,
  ProgressBar,
  Tabs,
  Tab,
  Table
} from 'react-bootstrap';
import apiClient from '../../services/api';
import { DERMATOLOGY_ENDPOINTS } from '../../services/apiConstants';

const DermatologySkinPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [aiAnalyses, setAiAnalyses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [activeTab, setActiveTab] = useState('photos');
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const [uploadData, setUploadData] = useState({
    consultation_id: '',
    photo_type: 'clinical',
    anatomical_region: 'face',
    specific_location: '',
    description: '',
    magnification: '',
    lighting_conditions: '',
    is_before_treatment: false,
    is_after_treatment: false,
    treatment_day: '',
    consent_obtained: false,
    research_use_permitted: false,
    teaching_use_permitted: false
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const photoTypes = [
    { value: 'clinical', label: 'Clinical Documentation' },
    { value: 'dermoscopy', label: 'Dermoscopy Image' },
    { value: 'before_treatment', label: 'Before Treatment' },
    { value: 'after_treatment', label: 'After Treatment' },
    { value: 'progression', label: 'Disease Progression' },
    { value: 'wound_care', label: 'Wound Care Documentation' },
    { value: 'surgical', label: 'Surgical Documentation' },
    { value: 'teaching', label: 'Teaching/Educational' },
    { value: 'research', label: 'Research' }
  ];

  const anatomicalRegions = [
    { value: 'face', label: 'Face' },
    { value: 'scalp', label: 'Scalp' },
    { value: 'neck', label: 'Neck' },
    { value: 'chest', label: 'Chest' },
    { value: 'back', label: 'Back' },
    { value: 'abdomen', label: 'Abdomen' },
    { value: 'arms', label: 'Arms' },
    { value: 'hands', label: 'Hands' },
    { value: 'legs', label: 'Legs' },
    { value: 'feet', label: 'Feet' },
    { value: 'full_body', label: 'Full Body' },
    { value: 'other', label: 'Other' }
  ];

  const analysisTypes = [
    { value: 'lesion_detection', label: 'Lesion Detection' },
    { value: 'cancer_screening', label: 'Cancer Screening' },
    { value: 'acne_assessment', label: 'Acne Assessment' },
    { value: 'pigmentation_analysis', label: 'Pigmentation Analysis' },
    { value: 'wrinkle_analysis', label: 'Wrinkle Analysis' },
    { value: 'texture_analysis', label: 'Skin Texture Analysis' },
    { value: 'comparative_analysis', label: 'Comparative Analysis' },
    { value: 'treatment_prediction', label: 'Treatment Prediction' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadPhotos(),
        loadConsultations(),
        loadAIAnalyses()
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadPhotos = async () => {
  const { data } = await apiClient.get(DERMATOLOGY_ENDPOINTS.SKIN_PHOTOS);
  setPhotos(data);
  };

  const loadConsultations = async () => {
  const { data } = await apiClient.get(DERMATOLOGY_ENDPOINTS.CONSULTATIONS);
  setConsultations(data);
  };

  const loadAIAnalyses = async () => {
  const { data } = await apiClient.get(DERMATOLOGY_ENDPOINTS.AI_ANALYSES);
  setAiAnalyses(data);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please select an image file');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image_file', selectedFile);
      
      // Add all form data
      Object.keys(uploadData).forEach(key => {
        if (uploadData[key] !== '') {
          formData.append(key, uploadData[key]);
        }
      });
      
      // Add user ID for taken_by field
      formData.append('taken_by_id', localStorage.getItem('userId'));

      await apiClient.post(DERMATOLOGY_ENDPOINTS.SKIN_PHOTOS, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (e.total) {
            const progress = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(progress);
          }
        }
      });

      await loadPhotos();
      handleCloseUploadModal();
      setError(null);
      setUploadProgress(0);

    } catch (err) {
      setError(err.message);
      setUploadProgress(0);
    }
  };

  const handleRequestAIAnalysis = async (photoId, analysisType) => {
    try {
      setAnalysisLoading(true);
      
  await apiClient.post(DERMATOLOGY_ENDPOINTS.AI_ACTIONS.REQUEST_ANALYSIS(photoId), { analysis_type: analysisType });

      await loadAIAnalyses();
      setError(null);
      
      // Show success message
      alert('AI analysis requested successfully!');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleValidateAnalysis = async (analysisId, agreement, notes = '') => {
    try {
  await apiClient.post(DERMATOLOGY_ENDPOINTS.AI_ACTIONS.VALIDATE_ANALYSIS(analysisId), { agreement, notes });

      await loadAIAnalyses();
      setError(null);
      
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadData({
      consultation_id: '',
      photo_type: 'clinical',
      anatomical_region: 'face',
      specific_location: '',
      description: '',
      magnification: '',
      lighting_conditions: '',
      is_before_treatment: false,
      is_after_treatment: false,
      treatment_day: '',
      consent_obtained: false,
      research_use_permitted: false,
      teaching_use_permitted: false
    });
  };

  const getConfidenceBadge = (level) => {
    const levelConfig = {
      'very_high': { bg: 'success', text: 'Very High' },
      'high': { bg: 'primary', text: 'High' },
      'moderate': { bg: 'warning', text: 'Moderate' },
      'low': { bg: 'danger', text: 'Low' },
      'very_low': { bg: 'dark', text: 'Very Low' }
    };
    
    const config = levelConfig[level] || { bg: 'secondary', text: level };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const getUrgencyBadge = (urgency) => {
    const urgencyConfig = {
      'emergent': { bg: 'danger', text: 'Emergent' },
      'urgent': { bg: 'warning', text: 'Urgent' },
      'high': { bg: 'info', text: 'High' },
      'normal': { bg: 'secondary', text: 'Normal' },
      'routine': { bg: 'light', text: 'Routine', textColor: 'dark' }
    };
    
    const config = urgencyConfig[urgency] || { bg: 'secondary', text: urgency };
    return (
      <Badge bg={config.bg} text={config.textColor}>
        {config.text}
      </Badge>
    );
  };

  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = !searchTerm || 
      photo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      photo.specific_location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      photo.anatomical_region_display?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !filterType || photo.photo_type === filterType;
    
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading skin photos...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>
                <FaCamera className="me-2 text-primary" />
                Dermatology Skin Photos & AI Analysis
              </h2>
              <p className="text-muted mb-0">
                Manage skin documentation and AI-powered analysis
              </p>
            </div>
            <Button 
              variant="primary" 
              onClick={() => setShowUploadModal(true)}
            >
              <FaUpload className="me-2" />
              Upload Photo
            </Button>
          </div>
        </Col>
      </Row>

      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      {/* Filters */}
      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search photos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Photo Types</option>
            {photoTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Button 
            variant="outline-secondary" 
            onClick={loadData}
            disabled={loading}
          >
            <FaFilter className="me-2" />
            Refresh
          </Button>
        </Col>
      </Row>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3"
      >
        <Tab 
          eventKey="photos" 
          title={
            <span>
              <FaCamera className="me-2" />
              Skin Photos ({filteredPhotos.length})
            </span>
          } 
        />
        <Tab 
          eventKey="analyses" 
          title={
            <span>
              <FaRobot className="me-2" />
              AI Analyses ({aiAnalyses.length})
            </span>
          } 
        />
      </Tabs>

      {/* Photos Tab */}
      {activeTab === 'photos' && (
        <Row>
          {filteredPhotos.length > 0 ? (
            filteredPhotos.map((photo) => (
              <Col key={photo.id} lg={4} md={6} className="mb-4">
                <Card className="h-100">
                  <div style={{ height: '200px', overflow: 'hidden' }}>
                    <Image 
                      src={photo.image_url || photo.thumbnail_url || '/placeholder-image.jpg'} 
                      alt={photo.description}
                      fluid
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover' 
                      }}
                    />
                  </div>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Badge bg="info">
                        {photoTypes.find(t => t.value === photo.photo_type)?.label}
                      </Badge>
                      <Badge bg="secondary">
                        {anatomicalRegions.find(r => r.value === photo.anatomical_region)?.label}
                      </Badge>
                    </div>
                    
                    <h6 className="card-title">
                      {photo.specific_location || 'No specific location'}
                    </h6>
                    
                    <p className="card-text text-muted small">
                      {photo.description || 'No description provided'}
                    </p>
                    
                    <div className="mb-2">
                      <small className="text-muted">
                        <strong>Taken:</strong> {new Date(photo.taken_at).toLocaleDateString()}
                        <br />
                        <strong>By:</strong> {photo.taken_by?.full_name}
                        {photo.magnification && (
                          <>
                            <br />
                            <strong>Magnification:</strong> {photo.magnification}
                          </>
                        )}
                      </small>
                    </div>

                    <div className="mb-2">
                      {photo.consent_obtained && (
                        <Badge bg="success" className="me-1">Consent</Badge>
                      )}
                      {photo.is_before_treatment && (
                        <Badge bg="warning" className="me-1">Before</Badge>
                      )}
                      {photo.is_after_treatment && (
                        <Badge bg="primary" className="me-1">After</Badge>
                      )}
                      <Badge bg="info">
                        {photo.ai_analyses_count} Analyses
                      </Badge>
                    </div>
                  </Card.Body>
                  <Card.Footer>
                    <div className="d-flex justify-content-between">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => setSelectedPhoto(photo)}
                      >
                        <FaEye className="me-1" />
                        View
                      </Button>
                      
                      <Dropdown>
                        <Dropdown.Toggle variant="outline-secondary" size="sm">
                          <FaRobot className="me-1" />
                          AI Analysis
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {analysisTypes.map(type => (
                            <Dropdown.Item 
                              key={type.value}
                              onClick={() => handleRequestAIAnalysis(photo.id, type.value)}
                              disabled={analysisLoading}
                            >
                              <FaMicroscope className="me-2" />
                              {type.label}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <Alert variant="info" className="text-center">
                <FaCamera className="me-2" />
                No skin photos found matching your criteria.
              </Alert>
            </Col>
          )}
        </Row>
      )}

      {/* AI Analyses Tab */}
      {activeTab === 'analyses' && (
        <Row>
          <Col>
            <Card>
              <Card.Body>
                {aiAnalyses.length > 0 ? (
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>Analysis Type</th>
                        <th>Patient</th>
                        <th>Date</th>
                        <th>Confidence</th>
                        <th>Findings</th>
                        <th>Biopsy Required</th>
                        <th>Urgency</th>
                        <th>Validated</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aiAnalyses.map((analysis) => (
                        <tr key={analysis.id}>
                          <td>
                            <Badge bg="primary">
                              {analysisTypes.find(t => t.value === analysis.analysis_type)?.label}
                            </Badge>
                          </td>
                          <td>
                            {analysis.skin_photo?.consultation?.patient?.user?.first_name}{' '}
                            {analysis.skin_photo?.consultation?.patient?.user?.last_name}
                          </td>
                          <td>
                            {new Date(analysis.analysis_date).toLocaleDateString()}
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              {getConfidenceBadge(analysis.confidence_level)}
                              <small className="ms-2">{analysis.confidence_score}%</small>
                            </div>
                          </td>
                          <td>
                            <div style={{ maxWidth: '200px' }}>
                              {analysis.primary_findings?.status || 
                               analysis.primary_findings?.lesions_detected || 
                               'See details'}
                            </div>
                          </td>
                          <td>
                            <Badge bg={analysis.requires_biopsy ? 'danger' : 'success'}>
                              {analysis.requires_biopsy ? 'Yes' : 'No'}
                            </Badge>
                          </td>
                          <td>
                            {getUrgencyBadge(analysis.urgency_level)}
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <Badge bg={analysis.validated_by_doctor ? 'success' : 'warning'}>
                                {analysis.validated_by_doctor ? 'Yes' : 'Pending'}
                              </Badge>
                              {analysis.validated_by_doctor && analysis.doctor_agreement !== null && (
                                <span className="ms-2">
                                  {analysis.doctor_agreement ? 
                                    <FaCheck className="text-success" /> : 
                                    <FaTimes className="text-danger" />}
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            <Dropdown>
                              <Dropdown.Toggle variant="outline-secondary" size="sm">
                                Actions
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item onClick={() => setShowAnalysisModal(true)}>
                                  <FaEye className="me-2" />
                                  View Details
                                </Dropdown.Item>
                                {!analysis.validated_by_doctor && (
                                  <>
                                    <Dropdown.Item 
                                      onClick={() => handleValidateAnalysis(analysis.id, true)}
                                    >
                                      <FaCheck className="me-2 text-success" />
                                      Agree
                                    </Dropdown.Item>
                                    <Dropdown.Item 
                                      onClick={() => handleValidateAnalysis(analysis.id, false)}
                                    >
                                      <FaTimes className="me-2 text-danger" />
                                      Disagree
                                    </Dropdown.Item>
                                  </>
                                )}
                              </Dropdown.Menu>
                            </Dropdown>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <Alert variant="info" className="text-center">
                    <FaRobot className="me-2" />
                    No AI analyses found.
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Upload Modal */}
      <Modal show={showUploadModal} onHide={handleCloseUploadModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Upload Skin Photo</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpload}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Consultation *</Form.Label>
                  <Form.Select
                    value={uploadData.consultation_id}
                    onChange={(e) => setUploadData({...uploadData, consultation_id: e.target.value})}
                    required
                  >
                    <option value="">Select Consultation</option>
                    {consultations.map(consultation => (
                      <option key={consultation.id} value={consultation.id}>
                        {consultation.consultation_number} - {consultation.patient?.user?.first_name} {consultation.patient?.user?.last_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Photo Type *</Form.Label>
                  <Form.Select
                    value={uploadData.photo_type}
                    onChange={(e) => setUploadData({...uploadData, photo_type: e.target.value})}
                    required
                  >
                    {photoTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Anatomical Region *</Form.Label>
                  <Form.Select
                    value={uploadData.anatomical_region}
                    onChange={(e) => setUploadData({...uploadData, anatomical_region: e.target.value})}
                    required
                  >
                    {anatomicalRegions.map(region => (
                      <option key={region.value} value={region.value}>
                        {region.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Specific Location</Form.Label>
                  <Form.Control
                    type="text"
                    value={uploadData.specific_location}
                    onChange={(e) => setUploadData({...uploadData, specific_location: e.target.value})}
                    placeholder="e.g., Left cheek, 2cm below eye"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Image File *</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                required
              />
              <Form.Text className="text-muted">
                Supported formats: JPG, PNG, GIF. Maximum size: 10MB
              </Form.Text>
            </Form.Group>

            {uploadProgress > 0 && (
              <ProgressBar 
                now={uploadProgress} 
                label={`${uploadProgress}%`} 
                className="mb-3"
              />
            )}

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={uploadData.description}
                onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
                placeholder="Describe the image and any relevant findings"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Magnification</Form.Label>
                  <Form.Control
                    type="text"
                    value={uploadData.magnification}
                    onChange={(e) => setUploadData({...uploadData, magnification: e.target.value})}
                    placeholder="e.g., 10x, dermoscopy"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Lighting Conditions</Form.Label>
                  <Form.Control
                    type="text"
                    value={uploadData.lighting_conditions}
                    onChange={(e) => setUploadData({...uploadData, lighting_conditions: e.target.value})}
                    placeholder="e.g., natural light, LED flash"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Check
                  type="checkbox"
                  label="Before Treatment"
                  checked={uploadData.is_before_treatment}
                  onChange={(e) => setUploadData({...uploadData, is_before_treatment: e.target.checked})}
                  className="mb-2"
                />
                <Form.Check
                  type="checkbox"
                  label="After Treatment"
                  checked={uploadData.is_after_treatment}
                  onChange={(e) => setUploadData({...uploadData, is_after_treatment: e.target.checked})}
                  className="mb-2"
                />
              </Col>
              <Col md={6}>
                <Form.Check
                  type="checkbox"
                  label="Patient Consent Obtained *"
                  checked={uploadData.consent_obtained}
                  onChange={(e) => setUploadData({...uploadData, consent_obtained: e.target.checked})}
                  required
                  className="mb-2"
                />
                <Form.Check
                  type="checkbox"
                  label="Research Use Permitted"
                  checked={uploadData.research_use_permitted}
                  onChange={(e) => setUploadData({...uploadData, research_use_permitted: e.target.checked})}
                  className="mb-2"
                />
                <Form.Check
                  type="checkbox"
                  label="Teaching Use Permitted"
                  checked={uploadData.teaching_use_permitted}
                  onChange={(e) => setUploadData({...uploadData, teaching_use_permitted: e.target.checked})}
                  className="mb-2"
                />
              </Col>
            </Row>

            {(uploadData.is_after_treatment || uploadData.is_before_treatment) && (
              <Form.Group className="mb-3">
                <Form.Label>Treatment Day</Form.Label>
                <Form.Control
                  type="number"
                  value={uploadData.treatment_day}
                  onChange={(e) => setUploadData({...uploadData, treatment_day: e.target.value})}
                  placeholder="Day of treatment (e.g., 1, 7, 30)"
                />
              </Form.Group>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseUploadModal}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={uploadProgress > 0 && uploadProgress < 100}
            >
              {uploadProgress > 0 ? 'Uploading...' : 'Upload Photo'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default DermatologySkinPhotos;

