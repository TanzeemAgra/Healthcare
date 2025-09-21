import React, { useState, useEffect } from 'react';
import { 
  Container,
  Row, 
  Col, 
  Card, 
  Button, 
  Alert, 
  Badge, 
  Table,
  Tab,
  Tabs,
  ProgressBar,
  Modal,
  Form,
  InputGroup,
  Spinner
} from 'react-bootstrap';
import { FaFilePdf, FaDownload } from 'react-icons/fa';
import CancerDetectionReportGenerator from './CancerDetectionReportGenerator';

const DetailedCancerAnalysis = ({ 
  show, 
  onHide, 
  detectionData,
  onSaveAnalysis,
  onGenerateReport 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [detailedAnalysis, setDetailedAnalysis] = useState(null);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [showReportGenerator, setShowReportGenerator] = useState(false);

  useEffect(() => {
    if (show && detectionData) {
      loadDetailedAnalysis();
    }
  }, [show, detectionData]);

  const loadDetailedAnalysis = async () => {
    setLoading(true);
    try {
      // Simulate comprehensive AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const analysis = {
        // Enhanced AI Analysis Results
        ai_analysis: {
          cellular_morphology: {
            nuclear_irregularities: 0.85,
            cellular_pleomorphism: 0.78,
            mitotic_activity: 0.72,
            tissue_architecture: 0.69,
            invasion_patterns: 0.66
          },
          molecular_markers: {
            p53_mutation_probability: 0.74,
            egfr_expression: 0.81,
            ki67_proliferation_index: 0.77,
            dna_aneuploidy: 0.83,
            loss_of_heterozygosity: 0.71
          },
          imaging_analysis: {
            texture_analysis: 0.88,
            vascular_patterns: 0.75,
            border_characteristics: 0.82,
            density_variations: 0.79,
            asymmetry_index: 0.86
          },
          differential_diagnosis: [
            { 
              condition: 'Squamous Cell Carcinoma', 
              probability: 0.87,
              stage_prediction: 'T2N0M0',
              grade: 'Moderately differentiated',
              subtype: 'Conventional'
            },
            { 
              condition: 'Severe Dysplasia', 
              probability: 0.09,
              grade: 'High-grade',
              progression_risk: 'High'
            },
            { 
              condition: 'Verrucous Carcinoma', 
              probability: 0.04,
              grade: 'Well-differentiated',
              invasion_pattern: 'Non-aggressive'
            }
          ]
        },
        
        // Risk Stratification
        risk_stratification: {
          overall_risk: 'High',
          recurrence_risk: 0.73,
          metastasis_risk: 0.68,
          survival_prediction: {
            '5_year': 0.65,
            '10_year': 0.52,
            '15_year': 0.41
          },
          treatment_response_prediction: {
            surgery: 0.85,
            radiation: 0.72,
            chemotherapy: 0.64,
            immunotherapy: 0.58
          }
        },

        // Clinical Correlations
        clinical_correlations: {
          symptoms_severity: 'Moderate to Severe',
          functional_impact: 'Significant',
          pain_assessment: 7.5,
          quality_of_life_impact: 'High',
          psychological_impact: 'Severe'
        },

        // Treatment Recommendations
        treatment_recommendations: {
          immediate_actions: [
            'Urgent referral to Oral & Maxillofacial Surgeon',
            'Tissue biopsy within 48-72 hours',
            'CT/MRI imaging for staging',
            'Multidisciplinary team consultation'
          ],
          treatment_options: [
            {
              type: 'Surgical Resection',
              feasibility: 0.92,
              expected_outcome: 'Excellent',
              risks: 'Moderate',
              recovery_time: '4-6 weeks'
            },
            {
              type: 'Radiation Therapy',
              feasibility: 0.88,
              expected_outcome: 'Good',
              risks: 'Low to Moderate',
              recovery_time: '6-8 weeks'
            },
            {
              type: 'Combined Therapy',
              feasibility: 0.79,
              expected_outcome: 'Very Good',
              risks: 'Moderate to High',
              recovery_time: '8-12 weeks'
            }
          ],
          follow_up_protocol: {
            initial_followup: '2 weeks post-biopsy',
            regular_monitoring: 'Every 3 months for 2 years',
            imaging_frequency: 'Every 6 months',
            biomarker_monitoring: 'As clinically indicated'
          }
        },

        // Advanced Analytics
        advanced_analytics: {
          genetic_risk_factors: [
            { gene: 'TP53', mutation_risk: 0.74, clinical_significance: 'High' },
            { gene: 'CDKN2A', mutation_risk: 0.68, clinical_significance: 'Moderate' },
            { gene: 'PIK3CA', mutation_risk: 0.52, clinical_significance: 'Moderate' },
            { gene: 'HRAS', mutation_risk: 0.45, clinical_significance: 'Low to Moderate' }
          ],
          environmental_factors: [
            { factor: 'Tobacco Use', impact_score: 0.89, duration: '15+ years' },
            { factor: 'Alcohol Consumption', impact_score: 0.76, frequency: 'Heavy' },
            { factor: 'HPV Exposure', impact_score: 0.62, strain: 'High-risk types' },
            { factor: 'UV Exposure', impact_score: 0.34, type: 'Chronic' }
          ],
          predictive_biomarkers: [
            { marker: 'PD-L1 Expression', level: 'High', therapeutic_implication: 'Immunotherapy candidate' },
            { marker: 'Microsatellite Instability', status: 'Stable', implication: 'Standard therapy' },
            { marker: 'Tumor Mutation Burden', level: 'Intermediate', significance: 'Moderate response prediction' }
          ]
        }
      };

      setDetailedAnalysis(analysis);
    } catch (error) {
      console.error('Error loading detailed analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAnalysis = async () => {
    setLoading(true);
    try {
      const analysisData = {
        detection_id: detectionData.id,
        doctor_notes: doctorNotes,
        follow_up_date: followUpDate,
        detailed_analysis: detailedAnalysis,
        analysis_timestamp: new Date().toISOString(),
        review_status: 'completed'
      };
      
      await onSaveAnalysis(analysisData);
      setAnalysisComplete(true);
    } catch (error) {
      console.error('Error saving analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk) => {
    if (risk >= 0.8) return 'danger';
    if (risk >= 0.6) return 'warning';
    if (risk >= 0.4) return 'info';
    return 'success';
  };

  const getProbabilityColor = (prob) => {
    if (prob >= 0.8) return 'danger';
    if (prob >= 0.6) return 'warning';
    return 'info';
  };

  if (!detectionData) return null;

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="xl" 
      backdrop="static"
      className="detailed-cancer-analysis-modal"
    >
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>
          <i className="ri-microscope-line me-2"></i>
          Detailed Cancer Analysis Platform
          <Badge bg="danger" className="ms-2">
            AI-Powered Clinical Intelligence
          </Badge>
        </Modal.Title>
        <div className="ms-auto me-3">
          <Button 
            variant="light" 
            size="sm" 
            onClick={() => setShowReportGenerator(true)}
            className="d-flex align-items-center"
          >
            <FaFilePdf className="me-2 text-danger" />
            Generate PDF Report
          </Button>
        </div>
      </Modal.Header>

      <Modal.Body style={{maxHeight: '80vh', overflowY: 'auto'}}>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" size="lg" className="mb-3" />
            <h4>🧬 Analyzing Cancer Cells...</h4>
            <p className="text-muted">
              Advanced AI is performing comprehensive molecular and cellular analysis
            </p>
            <ProgressBar animated now={75} className="w-50 mx-auto" />
          </div>
        ) : detailedAnalysis ? (
          <>
            {/* Analysis Navigation */}
            <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
              <Tab eventKey="overview" title="🔍 Overview">
                <Row>
                  <Col lg={6}>
                    <Card className="border-danger">
                      <Card.Header className="bg-danger text-white">
                        <h6 className="mb-0">
                          <i className="ri-dna-line me-2"></i>
                          Primary AI Diagnosis
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        {detailedAnalysis.ai_analysis.differential_diagnosis.map((diagnosis, index) => (
                          <div key={index} className="mb-3 p-3 border rounded">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <h6 className="mb-0 text-danger">{diagnosis.condition}</h6>
                              <Badge bg={getProbabilityColor(diagnosis.probability)}>
                                {Math.round(diagnosis.probability * 100)}%
                              </Badge>
                            </div>
                            <div className="small">
                              {diagnosis.stage_prediction && (
                                <div><strong>Predicted Stage:</strong> {diagnosis.stage_prediction}</div>
                              )}
                              {diagnosis.grade && (
                                <div><strong>Grade:</strong> {diagnosis.grade}</div>
                              )}
                              {diagnosis.subtype && (
                                <div><strong>Subtype:</strong> {diagnosis.subtype}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col lg={6}>
                    <Card className="border-warning">
                      <Card.Header className="bg-warning text-dark">
                        <h6 className="mb-0">
                          <i className="ri-shield-check-line me-2"></i>
                          Risk Assessment
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span>Overall Risk Level:</span>
                            <Badge bg="danger" className="fs-6">
                              {detailedAnalysis.risk_stratification.overall_risk}
                            </Badge>
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="small text-muted">Recurrence Risk</label>
                          <ProgressBar 
                            now={detailedAnalysis.risk_stratification.recurrence_risk * 100}
                            variant={getRiskColor(detailedAnalysis.risk_stratification.recurrence_risk)}
                            label={`${Math.round(detailedAnalysis.risk_stratification.recurrence_risk * 100)}%`}
                          />
                        </div>

                        <div className="mb-3">
                          <label className="small text-muted">Metastasis Risk</label>
                          <ProgressBar 
                            now={detailedAnalysis.risk_stratification.metastasis_risk * 100}
                            variant={getRiskColor(detailedAnalysis.risk_stratification.metastasis_risk)}
                            label={`${Math.round(detailedAnalysis.risk_stratification.metastasis_risk * 100)}%`}
                          />
                        </div>

                        <div>
                          <h6 className="small">Survival Predictions:</h6>
                          {Object.entries(detailedAnalysis.risk_stratification.survival_prediction).map(([period, rate]) => (
                            <div key={period} className="d-flex justify-content-between small">
                              <span>{period.replace('_', '-')} survival:</span>
                              <Badge bg={getRiskColor(1 - rate)}>
                                {Math.round(rate * 100)}%
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="cellular" title="🔬 Cellular Analysis">
                <Row>
                  <Col lg={6}>
                    <Card>
                      <Card.Header className="bg-primary text-white">
                        <h6 className="mb-0">
                          <i className="ri-microscope-line me-2"></i>
                          Cellular Morphology Analysis
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        {Object.entries(detailedAnalysis.ai_analysis.cellular_morphology).map(([metric, value]) => (
                          <div key={metric} className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <span className="small">{metric.replace(/_/g, ' ').toUpperCase()}:</span>
                              <Badge bg={getRiskColor(value)}>
                                {Math.round(value * 100)}%
                              </Badge>
                            </div>
                            <ProgressBar 
                              now={value * 100}
                              variant={getRiskColor(value)}
                              size="sm"
                            />
                          </div>
                        ))}
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col lg={6}>
                    <Card>
                      <Card.Header className="bg-info text-white">
                        <h6 className="mb-0">
                          <i className="ri-dna-line me-2"></i>
                          Molecular Markers
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        {Object.entries(detailedAnalysis.ai_analysis.molecular_markers).map(([marker, value]) => (
                          <div key={marker} className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <span className="small">{marker.replace(/_/g, ' ').toUpperCase()}:</span>
                              <Badge bg={getRiskColor(value)}>
                                {Math.round(value * 100)}%
                              </Badge>
                            </div>
                            <ProgressBar 
                              now={value * 100}
                              variant={getRiskColor(value)}
                              size="sm"
                            />
                          </div>
                        ))}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="treatment" title="💊 Treatment Plan">
                <Row>
                  <Col lg={8}>
                    <Card>
                      <Card.Header className="bg-success text-white">
                        <h6 className="mb-0">
                          <i className="ri-medicine-bottle-line me-2"></i>
                          AI-Recommended Treatment Options
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        {detailedAnalysis.treatment_recommendations.treatment_options.map((treatment, index) => (
                          <div key={index} className="border rounded p-3 mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <h6 className="mb-0">{treatment.type}</h6>
                              <div>
                                <Badge bg="success" className="me-1">
                                  Feasibility: {Math.round(treatment.feasibility * 100)}%
                                </Badge>
                                <Badge bg="info">
                                  {treatment.expected_outcome}
                                </Badge>
                              </div>
                            </div>
                            <div className="row small">
                              <div className="col-6">
                                <strong>Risks:</strong> {treatment.risks}
                              </div>
                              <div className="col-6">
                                <strong>Recovery:</strong> {treatment.recovery_time}
                              </div>
                            </div>
                          </div>
                        ))}
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col lg={4}>
                    <Card className="border-warning">
                      <Card.Header className="bg-warning text-dark">
                        <h6 className="mb-0">
                          <i className="ri-calendar-line me-2"></i>
                          Follow-up Protocol
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        {Object.entries(detailedAnalysis.treatment_recommendations.follow_up_protocol).map(([key, value]) => (
                          <div key={key} className="mb-2">
                            <strong className="small">{key.replace(/_/g, ' ').toUpperCase()}:</strong>
                            <div className="text-muted small">{value}</div>
                          </div>
                        ))}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="genetics" title="🧬 Genetic Analysis">
                <Row>
                  <Col lg={4}>
                    <Card>
                      <Card.Header className="bg-dark text-white">
                        <h6 className="mb-0">
                          <i className="ri-dna-line me-2"></i>
                          Genetic Risk Factors
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        {detailedAnalysis.advanced_analytics.genetic_risk_factors.map((factor, index) => (
                          <div key={index} className="mb-3 border-bottom pb-2">
                            <div className="d-flex justify-content-between align-items-center">
                              <strong>{factor.gene}</strong>
                              <Badge bg={getRiskColor(factor.mutation_risk)}>
                                {Math.round(factor.mutation_risk * 100)}%
                              </Badge>
                            </div>
                            <small className="text-muted">
                              Clinical Significance: {factor.clinical_significance}
                            </small>
                          </div>
                        ))}
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col lg={4}>
                    <Card>
                      <Card.Header className="bg-secondary text-white">
                        <h6 className="mb-0">
                          <i className="ri-leaf-line me-2"></i>
                          Environmental Factors
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        {detailedAnalysis.advanced_analytics.environmental_factors.map((factor, index) => (
                          <div key={index} className="mb-3 border-bottom pb-2">
                            <div className="d-flex justify-content-between align-items-center">
                              <strong>{factor.factor}</strong>
                              <Badge bg={getRiskColor(factor.impact_score)}>
                                {Math.round(factor.impact_score * 100)}%
                              </Badge>
                            </div>
                            <small className="text-muted">
                              {factor.duration || factor.frequency || factor.strain || factor.type}
                            </small>
                          </div>
                        ))}
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col lg={4}>
                    <Card>
                      <Card.Header className="bg-info text-white">
                        <h6 className="mb-0">
                          <i className="ri-test-tube-line me-2"></i>
                          Predictive Biomarkers
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        {detailedAnalysis.advanced_analytics.predictive_biomarkers.map((marker, index) => (
                          <div key={index} className="mb-3 border-bottom pb-2">
                            <div className="d-flex justify-content-between align-items-center">
                              <strong className="small">{marker.marker}</strong>
                              <Badge bg="info">{marker.level || marker.status}</Badge>
                            </div>
                            <small className="text-muted">
                              {marker.therapeutic_implication || marker.implication || marker.significance}
                            </small>
                          </div>
                        ))}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="clinical" title="📋 Clinical Notes">
                <Row>
                  <Col lg={8}>
                    <Card>
                      <Card.Header>
                        <h6 className="mb-0">
                          <i className="ri-file-text-line me-2"></i>
                          Doctor's Clinical Notes
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        <Form.Group className="mb-3">
                          <Form.Label>Clinical Assessment & Notes:</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={10}
                            value={doctorNotes}
                            onChange={(e) => setDoctorNotes(e.target.value)}
                            placeholder="Enter your clinical assessment, observations, and treatment decisions..."
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Follow-up Date:</Form.Label>
                          <Form.Control
                            type="datetime-local"
                            value={followUpDate}
                            onChange={(e) => setFollowUpDate(e.target.value)}
                          />
                        </Form.Group>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col lg={4}>
                    <Card className="border-info">
                      <Card.Header className="bg-info text-white">
                        <h6 className="mb-0">
                          <i className="ri-heart-pulse-line me-2"></i>
                          Clinical Correlations
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        {Object.entries(detailedAnalysis.clinical_correlations).map(([key, value]) => (
                          <div key={key} className="mb-2">
                            <strong className="small">{key.replace(/_/g, ' ').toUpperCase()}:</strong>
                            <div className="text-muted small">{value}</div>
                          </div>
                        ))}
                      </Card.Body>
                    </Card>

                    <Card className="mt-3 border-success">
                      <Card.Header className="bg-success text-white">
                        <h6 className="mb-0">
                          <i className="ri-alert-line me-2"></i>
                          Immediate Actions
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        <ul className="mb-0">
                          {detailedAnalysis.treatment_recommendations.immediate_actions.map((action, index) => (
                            <li key={index} className="small text-danger">
                              <strong>{action}</strong>
                            </li>
                          ))}
                        </ul>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab>
            </Tabs>
          </>
        ) : null}
      </Modal.Body>

      <Modal.Footer className="bg-light">
        <div className="d-flex justify-content-between w-100 align-items-center">
          <div>
            {analysisComplete ? (
              <Badge bg="success" className="fs-6">
                <i className="ri-check-line me-1"></i>
                Analysis Completed & Saved
              </Badge>
            ) : (
              <Badge bg="warning" className="fs-6">
                <i className="ri-time-line me-1"></i>
                Analysis In Progress
              </Badge>
            )}
          </div>
          
          <div>
            <Button 
              variant="outline-secondary" 
              onClick={onHide}
              className="me-2"
            >
              <i className="ri-close-line me-1"></i>
              Close
            </Button>
            
            <Button
              variant="info"
              onClick={() => onGenerateReport(detailedAnalysis)}
              disabled={!detailedAnalysis}
              className="me-2"
            >
              <i className="ri-file-pdf-line me-1"></i>
              Generate Report
            </Button>

            <Button
              variant="success"
              onClick={handleSaveAnalysis}
              disabled={loading || !doctorNotes}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                <>
                  <i className="ri-save-line me-1"></i>
                  Save Analysis
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal.Footer>

      {/* PDF Report Generator Modal */}
      <CancerDetectionReportGenerator
        detection={detectionData}
        show={showReportGenerator}
        onHide={() => setShowReportGenerator(false)}
        onReportGenerated={() => {
          setShowReportGenerator(false);
          if (onGenerateReport) {
            onGenerateReport();
          }
        }}
      />
    </Modal>
  );
};

export default DetailedCancerAnalysis;
