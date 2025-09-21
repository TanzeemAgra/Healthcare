import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, Modal, Tab, Nav, Alert, Badge, InputGroup } from 'react-bootstrap';
import Card from '../../components/Card';

const ClinicalReference = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedReference, setSelectedReference] = useState(null);

    const referenceData = [
        {
            id: 1,
            category: 'measurements',
            title: 'Normal Organ Measurements',
            description: 'Standard reference ranges for organ dimensions',
            icon: 'ri-ruler-line',
            content: {
                liver: 'Normal liver span: 12-15 cm in midclavicular line',
                kidney: 'Normal kidney length: 10-12 cm, width: 5-6 cm',
                spleen: 'Normal spleen length: <13 cm',
                thyroid: 'Normal thyroid lobe: 4-6 cm length, 2-3 cm width'
            }
        },
        {
            id: 2,
            category: 'differential',
            title: 'Pulmonary Nodule Differential',
            description: 'Differential diagnosis for lung nodules',
            icon: 'ri-lungs-line',
            content: {
                benign: 'Granuloma, hamartoma, intrapulmonary lymph node',
                malignant: 'Primary lung cancer, metastasis',
                infectious: 'Abscess, fungal infection, tuberculosis',
                inflammatory: 'Rheumatoid nodule, sarcoidosis'
            }
        },
        {
            id: 3,
            category: 'anatomy',
            title: 'Liver Segments (Couinaud)',
            description: 'Anatomical liver segmentation classification',
            icon: 'ri-liver-line',
            content: {
                segment1: 'Caudate lobe (posterior to IVC)',
                segment2: 'Left lateral superior',
                segment3: 'Left lateral inferior',
                segment4: 'Left medial (quadrate lobe)',
                segment5: 'Right anterior inferior',
                segment6: 'Right posterior inferior',
                segment7: 'Right posterior superior',
                segment8: 'Right anterior superior'
            }
        },
        {
            id: 4,
            category: 'protocols',
            title: 'CT Contrast Protocols',
            description: 'Standard CT imaging protocols',
            icon: 'ri-contrast-line',
            content: {
                chest: 'Non-contrast: No prep. Contrast: 100-120ml @ 3-4ml/s',
                abdomen: 'Oral contrast 1-2 hours prior. IV: 120-150ml @ 3-4ml/s',
                pelvis: 'Oral contrast 1-2 hours prior. IV: 120-150ml @ 3-4ml/s',
                cta: 'High flow rate 4-6ml/s, timing bolus or automated triggering'
            }
        },
        {
            id: 5,
            category: 'pathology',
            title: 'Breast Lesion Characteristics',
            description: 'Imaging characteristics of breast pathology',
            icon: 'ri-heart-pulse-line',
            content: {
                fibroadenoma: 'Well-circumscribed, hypoechoic, mobile',
                cyst: 'Anechoic, posterior enhancement, thin walls',
                carcinoma: 'Irregular margins, posterior shadowing, fixed',
                lipoma: 'Hyperechoic, compressible, mobile'
            }
        },
        {
            id: 6,
            category: 'emergency',
            title: 'Emergency Imaging Findings',
            description: 'Critical findings requiring immediate attention',
            icon: 'ri-alarm-warning-line',
            content: {
                pneumothorax: 'Absent lung markings, pleural line',
                aorticDissection: 'Intimal flap, false lumen',
                bowelPerforation: 'Free air, pneumoperitoneum',
                intracranialHemorrhage: 'Hyperdense blood, mass effect'
            }
        },
        {
            id: 7,
            category: 'contrast',
            title: 'Contrast Reactions Management',
            description: 'Management of contrast material reactions',
            icon: 'ri-medical-mask-line',
            content: {
                mild: 'Nausea, vomiting, urticaria - supportive care',
                moderate: 'Bronchospasm, facial edema - oxygen, antihistamines',
                severe: 'Anaphylaxis - epinephrine, IV fluids, steroids',
                prevention: 'Premedication with steroids and antihistamines'
            }
        },
        {
            id: 8,
            category: 'measurements',
            title: 'Vascular Measurements',
            description: 'Normal vascular dimensions and criteria',
            icon: 'ri-heart-line',
            content: {
                aorta: 'Normal ascending: <3.7cm, descending: <2.5cm',
                carotid: 'Normal ICA: 4-6mm, stenosis >70% surgery indicated',
                renalArtery: 'Normal diameter: 5-7mm',
                peripheralArteries: 'Femoral: 8-12mm, popliteal: 5-8mm'
            }
        }
    ];

    const categories = [
        { value: 'all', label: 'All Categories', icon: 'ri-folder-line' },
        { value: 'measurements', label: 'Measurements', icon: 'ri-ruler-line' },
        { value: 'differential', label: 'Differential Diagnosis', icon: 'ri-mind-map' },
        { value: 'anatomy', label: 'Anatomy', icon: 'ri-body-scan-line' },
        { value: 'protocols', label: 'Protocols', icon: 'ri-file-list-3-line' },
        { value: 'pathology', label: 'Pathology', icon: 'ri-microscope-line' },
        { value: 'emergency', label: 'Emergency', icon: 'ri-alarm-warning-line' },
        { value: 'contrast', label: 'Contrast', icon: 'ri-medical-mask-line' }
    ];

    const filteredReferences = referenceData.filter(ref => {
        const matchesCategory = selectedCategory === 'all' || ref.category === selectedCategory;
        const matchesSearch = ref.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            ref.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleReferenceClick = (reference) => {
        setSelectedReference(reference);
        setShowDetailModal(true);
    };

    const getCategoryColor = (category) => {
        const colors = {
            measurements: 'primary',
            differential: 'success',
            anatomy: 'info',
            protocols: 'warning',
            pathology: 'danger',
            emergency: 'dark',
            contrast: 'secondary'
        };
        return colors[category] || 'primary';
    };

    return (
        <Container fluid>
            <Row className="justify-content-center">
                <Col lg={12}>
                    {/* Header */}
                    <Card className="mb-4 border-0 shadow-sm">
                        <Card.Header className="bg-info text-white">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h3 className="mb-0">
                                        <i className="ri-book-open-line me-2"></i>
                                        Clinical Reference Guide
                                    </h3>
                                    <p className="mb-0 opacity-75">Quick reference for radiology practice</p>
                                </div>
                                <Badge bg="light" text="dark">Reference</Badge>
                            </div>
                        </Card.Header>
                    </Card>

                    {/* Search and Filters */}
                    <Card className="mb-4 border-0 shadow-sm">
                        <Card.Body>
                            <Row className="align-items-center">
                                <Col lg={6}>
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <i className="ri-search-line"></i>
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            placeholder="Search references..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </InputGroup>
                                </Col>
                                <Col lg={6}>
                                    <Form.Select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* Category Pills */}
                    <Card className="mb-4 border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex flex-wrap gap-2">
                                {categories.map(cat => (
                                    <Badge
                                        key={cat.value}
                                        bg={selectedCategory === cat.value ? 'primary' : 'light'}
                                        text={selectedCategory === cat.value ? 'white' : 'dark'}
                                        className="p-2 cursor-pointer"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => setSelectedCategory(cat.value)}
                                    >
                                        <i className={`${cat.icon} me-1`}></i>
                                        {cat.label}
                                    </Badge>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Reference Cards */}
                    <Row>
                        {filteredReferences.map(reference => (
                            <Col lg={4} md={6} key={reference.id} className="mb-4">
                                <Card 
                                    className="h-100 border-0 shadow-sm cursor-pointer hover-shadow"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleReferenceClick(reference)}
                                >
                                    <Card.Body>
                                        <div className="d-flex align-items-start mb-3">
                                            <div className={`bg-${getCategoryColor(reference.category)} bg-opacity-10 p-2 rounded me-3`}>
                                                <i className={`${reference.icon} fs-4 text-${getCategoryColor(reference.category)}`}></i>
                                            </div>
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1">{reference.title}</h6>
                                                <Badge bg={getCategoryColor(reference.category)} className="small">
                                                    {categories.find(c => c.value === reference.category)?.label}
                                                </Badge>
                                            </div>
                                        </div>
                                        <p className="text-muted small mb-0">{reference.description}</p>
                                    </Card.Body>
                                    <Card.Footer className="bg-transparent border-0">
                                        <small className="text-primary">
                                            <i className="ri-arrow-right-line me-1"></i>
                                            Click to view details
                                        </small>
                                    </Card.Footer>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {filteredReferences.length === 0 && (
                        <Card className="border-0 shadow-sm">
                            <Card.Body className="text-center py-5">
                                <i className="ri-search-line fs-1 text-muted mb-3"></i>
                                <h5 className="text-muted mb-2">No references found</h5>
                                <p className="text-muted">Try adjusting your search terms or category filters</p>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>

            {/* Reference Detail Modal */}
            <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className={`${selectedReference?.icon} me-2`}></i>
                        {selectedReference?.title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedReference && (
                        <div>
                            <Alert variant={getCategoryColor(selectedReference.category)} className="mb-3">
                                <strong>Category:</strong> {categories.find(c => c.value === selectedReference.category)?.label}
                            </Alert>
                            
                            <p className="lead mb-4">{selectedReference.description}</p>
                            
                            <div className="reference-content">
                                {Object.entries(selectedReference.content).map(([key, value]) => (
                                    <div key={key} className="mb-3 p-3 bg-light rounded">
                                        <h6 className="text-primary mb-2">
                                            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                        </h6>
                                        <p className="mb-0">{value}</p>
                                    </div>
                                ))}
                            </div>
                            
                            <Alert variant="warning" className="mt-4">
                                <strong>Clinical Note:</strong> These reference values are general guidelines. 
                                Always refer to your institution's specific protocols and consider patient-specific factors.
                            </Alert>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowDetailModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary">
                        <i className="ri-bookmark-line me-1"></i>
                        Bookmark
                    </Button>
                    <Button variant="success">
                        <i className="ri-share-line me-1"></i>
                        Share
                    </Button>
                </Modal.Footer>
            </Modal>

            <style jsx>{`
                .hover-shadow:hover {
                    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
                    transform: translateY(-2px);
                    transition: all 0.3s ease;
                }
                .cursor-pointer {
                    cursor: pointer;
                }
            `}</style>
        </Container>
    );
};

export default ClinicalReference;
