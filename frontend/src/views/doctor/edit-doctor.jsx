import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Button, 
  Col, 
  Form, 
  Row, 
  Alert, 
  Spinner, 
  Badge, 
  Card as BootstrapCard,
  InputGroup,
  ProgressBar,
  Modal,
  OverlayTrigger,
  Tooltip
} from "react-bootstrap";
import Card from "../../components/Card";
import { useSelector } from 'react-redux';
import { doctorAPI } from '../../services/api';
import { 
  RiUserLine, 
  RiEditLine, 
  RiSaveLine,
  RiDeleteBinLine,
  RiStethoscopeLine,
  RiPhoneLine,
  RiMailLine,
  RiMedalLine,
  RiShieldCheckLine,
  RiMapPinLine,
  RiArrowLeftLine,
  RiRefreshLine,
  RiCheckDoubleLine,
  RiErrorWarningLine,
  RiGraduationCapLine,
  RiHospitalLine
} from '@remixicon/react';

// Custom styles for enhanced UI
const customStyles = `
  .bg-gradient-primary {
    background: linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%);
  }
  .bg-gradient-success {
    background: linear-gradient(135deg, #198754 0%, #157347 100%);
  }
  .bg-gradient-danger {
    background: linear-gradient(135deg, #dc3545 0%, #b02a37 100%);
  }
  .profile-avatar {
    width: 120px;
    height: 120px;
    background: linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    font-weight: bold;
    color: white;
    margin: 0 auto 1rem;
    border: 4px solid rgba(13, 110, 253, 0.1);
  }
  .form-section {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    border: 1px solid #e9ecef;
  }
  .form-section h6 {
    color: #495057;
    font-weight: 600;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #dee2e6;
  }
  .card {
    transition: all 0.3s ease;
    border: none;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  .card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  }
  .form-control:focus {
    border-color: #0d6efd;
    box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
  }
  .btn {
    border-radius: 8px;
    font-weight: 500;
    padding: 0.5rem 1.5rem;
    transition: all 0.2s ease;
  }
  .btn:hover {
    transform: translateY(-1px);
  }
  .stat-card {
    background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
    border-radius: 12px;
    padding: 1.5rem;
    text-align: center;
    border: 1px solid #e9ecef;
  }
`;

const EditDoctor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { accessToken } = useSelector(state => state.auth);
    
    // Inject custom styles
    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.textContent = customStyles;
        document.head.appendChild(styleElement);
        
        return () => {
            if (document.head.contains(styleElement)) {
                document.head.removeChild(styleElement);
            }
        };
    }, []);
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctorId, setSelectedDoctorId] = useState(id || '');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [formProgress, setFormProgress] = useState(0);
    
    const [doctorData, setDoctorData] = useState({
        user: {
            first_name: '',
            last_name: '',
            email: '',
            phone_number: ''
        },
        license_number: '',
        specialization: '',
        qualification: '',
        years_experience: 0,
        education: '',
        certifications: '',
        hospital_affiliation: '',
        consultation_fee: 0,
        bio: '',
        is_available_emergency: false
    });

    const specializationOptions = [
        { value: 'general', label: 'General Medicine' },
        { value: 'emergency', label: 'Emergency Medicine' },
        { value: 'internal', label: 'Internal Medicine' },
        { value: 'family', label: 'Family Medicine' },
        { value: 'cardiology', label: 'Cardiology' },
        { value: 'pulmonology', label: 'Pulmonology' },
        { value: 'gastroenterology', label: 'Gastroenterology' },
        { value: 'nephrology', label: 'Nephrology' },
        { value: 'endocrinology', label: 'Endocrinology' },
        { value: 'rheumatology', label: 'Rheumatology' },
        { value: 'hematology', label: 'Hematology' },
        { value: 'oncology', label: 'Oncology' },
        { value: 'neurology', label: 'Neurology' },
        { value: 'psychiatry', label: 'Psychiatry' },
        { value: 'geriatrics', label: 'Geriatrics' },
        { value: 'intensive_care', label: 'Intensive Care Medicine' }
    ];

    const qualificationOptions = [
        { value: 'MBBS', label: 'MBBS' },
        { value: 'MD', label: 'MD' },
        { value: 'DO', label: 'DO' },
        { value: 'DNB', label: 'DNB' },
        { value: 'DM', label: 'DM' },
        { value: 'MCh', label: 'MCh' },
        { value: 'FRCP', label: 'FRCP' },
        { value: 'FACS', label: 'FACS' }
    ];

    // Calculate form completion progress
    useEffect(() => {
        const requiredFields = ['license_number', 'specialization', 'qualification', 'years_experience'];
        const completedFields = requiredFields.filter(field => {
            const value = doctorData[field];
            return value !== '' && value !== null && value !== undefined;
        });
        const progress = (completedFields.length / requiredFields.length) * 100;
        setFormProgress(progress);
    }, [doctorData]);

    // Fetch all doctors for selection
    useEffect(() => {
        fetchDoctors();
    }, []);

    // Fetch selected doctor when ID changes
    useEffect(() => {
        if (selectedDoctorId) {
            fetchDoctorData(selectedDoctorId);
        }
    }, [selectedDoctorId]);

    const fetchDoctors = async () => {
        try {
            const response = await doctorAPI.getDoctors();
            setDoctors(response.data.results || response.data);
        } catch (err) {
            setError('Failed to fetch doctors list');
            console.error('Error fetching doctors:', err);
        }
    };

    const fetchDoctorData = async (doctorId) => {
        setLoading(true);
        try {
            const response = await doctorAPI.getDoctor(doctorId);
            setDoctorData(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch doctor data');
            console.error('Error fetching doctor:', err);
        } finally {
            setLoading(false);
        }
    };

    // Form validation
    const validateForm = () => {
        const errors = {};
        
        if (!doctorData.license_number?.trim()) {
            errors.license_number = 'License number is required';
        }
        
        if (!doctorData.specialization) {
            errors.specialization = 'Specialization is required';
        }
        
        if (!doctorData.qualification) {
            errors.qualification = 'Qualification is required';
        }
        
        if (doctorData.years_experience < 0) {
            errors.years_experience = 'Experience cannot be negative';
        }
        
        if (doctorData.consultation_fee < 0) {
            errors.consultation_fee = 'Consultation fee cannot be negative';
        }
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name.startsWith('user.')) {
            const userField = name.split('.')[1];
            setDoctorData(prev => ({
                ...prev,
                user: {
                    ...prev.user,
                    [userField]: value
                }
            }));
        } else {
            setDoctorData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
        
        // Clear validation error when user starts typing
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleSave = async () => {
        if (!validateForm()) {
            setError('Please fix the validation errors before saving');
            return;
        }
        
        setSaving(true);
        try {
            await doctorAPI.updateDoctor(selectedDoctorId, doctorData);
            setSuccess('Doctor profile updated successfully!');
            setError('');
        } catch (err) {
            setError('Failed to update doctor profile');
            console.error('Error updating doctor:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setSaving(true);
        try {
            await doctorAPI.deleteDoctor(selectedDoctorId);
            setSuccess('Doctor deleted successfully!');
            navigate('/doctor/doctor-list');
        } catch (err) {
            setError('Failed to delete doctor');
            console.error('Error deleting doctor:', err);
        } finally {
            setSaving(false);
            setShowDeleteModal(false);
        }
    };

    if (loading && selectedDoctorId) {
        return (
            <div className="text-center py-5">
                <div className="mb-3">
                    <Spinner animation="border" role="status" variant="primary" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
                <h5 className="text-muted">Loading doctor data...</h5>
                <p className="text-muted small">Please wait while we fetch the information</p>
            </div>
        );
    }

    return (
        <>
            {/* Alert Messages */}
            {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')} className="shadow-sm mb-4">
                    <div className="d-flex align-items-center">
                        <RiErrorWarningLine size={20} className="me-2" />
                        {error}
                    </div>
                </Alert>
            )}
            
            {success && (
                <Alert variant="success" dismissible onClose={() => setSuccess('')} className="shadow-sm mb-4">
                    <div className="d-flex align-items-center">
                        <RiCheckDoubleLine size={20} className="me-2" />
                        {success}
                    </div>
                </Alert>
            )}

            {/* Header Section */}
            <Row className="mb-4">
                <Col>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-gradient-primary text-white border-0">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <Button 
                                        variant="outline-light" 
                                        size="sm" 
                                        onClick={() => navigate('/doctor/doctor-list')}
                                        className="me-3"
                                    >
                                        <RiArrowLeftLine size={16} />
                                    </Button>
                                    <div>
                                        <h4 className="mb-0 fw-bold">Edit Doctor Profile</h4>
                                        <small className="opacity-75">Update healthcare professional information</small>
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    <Button 
                                        variant="outline-light" 
                                        size="sm" 
                                        onClick={fetchDoctors}
                                        className="border-white"
                                    >
                                        <RiRefreshLine size={16} className="me-1" />
                                        Refresh
                                    </Button>
                                    {selectedDoctorId && (
                                        <>
                                            <Button 
                                                variant="outline-light" 
                                                size="sm" 
                                                onClick={() => setShowDeleteModal(true)}
                                                className="border-white text-warning"
                                            >
                                                <RiDeleteBinLine size={16} className="me-1" />
                                                Delete
                                            </Button>
                                            <Button 
                                                variant="light" 
                                                size="sm" 
                                                onClick={handleSave}
                                                disabled={saving || formProgress < 100}
                                                className="fw-semibold"
                                            >
                                                {saving ? (
                                                    <>
                                                        <Spinner size="sm" className="me-1" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <RiSaveLine size={16} className="me-1" />
                                                        Save Changes
                                                    </>
                                                )}
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Card.Header>
                    </Card>
                </Col>
            </Row>

            {/* Doctor Selection */}
            <Row className="mb-4">
                <Col>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center mb-3">
                                <RiStethoscopeLine size={24} className="text-primary me-2" />
                                <h5 className="mb-0 fw-semibold">Select Doctor to Edit</h5>
                            </div>
                            
                            <Row className="align-items-end">
                                <Col md={8}>
                                    <Form.Label className="fw-semibold text-dark small mb-2">
                                        Choose Doctor Profile
                                    </Form.Label>
                                    <Form.Select
                                        value={selectedDoctorId}
                                        onChange={(e) => setSelectedDoctorId(e.target.value)}
                                        className="form-control-lg"
                                    >
                                        <option value="">Choose a doctor to edit...</option>
                                        {doctors.map(doctor => (
                                            <option key={doctor.id} value={doctor.id}>
                                                Dr. {doctor.user?.first_name} {doctor.user?.last_name} - {doctor.specialization || 'General'} ({doctor.license_number || 'No License'})
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>
                                <Col md={4}>
                                    {selectedDoctorId && formProgress > 0 && (
                                        <div>
                                            <div className="d-flex justify-content-between small text-muted mb-1">
                                                <span>Profile Completion</span>
                                                <span>{Math.round(formProgress)}%</span>
                                            </div>
                                            <ProgressBar 
                                                now={formProgress} 
                                                variant={formProgress < 50 ? 'danger' : formProgress < 80 ? 'warning' : 'success'}
                                                style={{ height: '8px' }}
                                                className="rounded-pill"
                                            />
                                        </div>
                                    )}
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Doctor Profile Form */}
            {selectedDoctorId && (
                <Row>
                    <Col lg={4}>
                        {/* Profile Summary */}
                        <Card className="border-0 shadow-sm mb-4">
                            <Card.Body className="p-4 text-center">
                                <div className="profile-avatar">
                                    {doctorData.user?.first_name?.[0] || 'D'}{doctorData.user?.last_name?.[0] || 'R'}
                                </div>
                                <h4 className="fw-bold text-dark">
                                    Dr. {doctorData.user?.first_name} {doctorData.user?.last_name}
                                </h4>
                                <Badge 
                                    bg="primary" 
                                    className="px-3 py-2 rounded-pill mb-3"
                                    style={{ fontSize: '0.9rem' }}
                                >
                                    {specializationOptions.find(s => s.value === doctorData.specialization)?.label || 'General Medicine'}
                                </Badge>
                                
                                <div className="stat-card">
                                    <Row>
                                        <Col>
                                            <div className="text-center">
                                                <h5 className="text-primary mb-0">{doctorData.years_experience || 0}</h5>
                                                <small className="text-muted">Years Experience</small>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="text-center">
                                                <h5 className="text-success mb-0">${doctorData.consultation_fee || 0}</h5>
                                                <small className="text-muted">Consultation Fee</small>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Card.Body>
                        </Card>

                        {/* Quick Info */}
                        <Card className="border-0 shadow-sm">
                            <Card.Body className="p-4">
                                <h6 className="fw-semibold mb-3">
                                    <RiShieldCheckLine size={18} className="me-2 text-success" />
                                    Quick Information
                                </h6>
                                <div className="d-flex align-items-center mb-2">
                                    <RiMailLine size={16} className="text-primary me-2" />
                                    <span className="small text-muted">{doctorData.user?.email || 'No email'}</span>
                                </div>
                                <div className="d-flex align-items-center mb-2">
                                    <RiMapPinLine size={16} className="text-warning me-2" />
                                    <span className="small text-muted">{doctorData.license_number || 'No license'}</span>
                                </div>
                                <div className="d-flex align-items-center mb-2">
                                    <RiHospitalLine size={16} className="text-info me-2" />
                                    <span className="small text-muted">{doctorData.hospital_affiliation || 'No affiliation'}</span>
                                </div>
                                <div className="d-flex align-items-center">
                                    <RiShieldCheckLine size={16} className={`me-2 ${doctorData.is_available_emergency ? 'text-success' : 'text-secondary'}`} />
                                    <span className="small text-muted">
                                        {doctorData.is_available_emergency ? 'Available for Emergency' : 'Not Available for Emergency'}
                                    </span>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={8}>
                        {/* Professional Information */}
                        <Card className="border-0 shadow-sm mb-4">
                            <Card.Header className="bg-primary text-white border-0">
                                <h6 className="mb-0 fw-semibold">
                                    <RiUserLine size={18} className="me-2" />
                                    Professional Information
                                </h6>
                            </Card.Header>
                            <Card.Body className="p-4">
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">
                                                <RiMapPinLine size={16} className="me-1 text-muted" />
                                                License Number *
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="license_number"
                                                value={doctorData.license_number}
                                                onChange={handleInputChange}
                                                placeholder="Enter license number"
                                                className={`form-control-lg ${validationErrors.license_number ? 'is-invalid' : doctorData.license_number ? 'is-valid' : ''}`}
                                            />
                                            {validationErrors.license_number && (
                                                <div className="invalid-feedback">
                                                    {validationErrors.license_number}
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">
                                                <RiStethoscopeLine size={16} className="me-1 text-muted" />
                                                Specialization *
                                            </Form.Label>
                                            <Form.Select
                                                name="specialization"
                                                value={doctorData.specialization}
                                                onChange={handleInputChange}
                                                className={`form-control-lg ${validationErrors.specialization ? 'is-invalid' : doctorData.specialization ? 'is-valid' : ''}`}
                                            >
                                                <option value="">Choose specialization...</option>
                                                {specializationOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            {validationErrors.specialization && (
                                                <div className="invalid-feedback">
                                                    {validationErrors.specialization}
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">
                                                <RiGraduationCapLine size={16} className="me-1 text-muted" />
                                                Qualification *
                                            </Form.Label>
                                            <Form.Select
                                                name="qualification"
                                                value={doctorData.qualification}
                                                onChange={handleInputChange}
                                                className={`form-control-lg ${validationErrors.qualification ? 'is-invalid' : doctorData.qualification ? 'is-valid' : ''}`}
                                            >
                                                <option value="">Choose qualification...</option>
                                                {qualificationOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            {validationErrors.qualification && (
                                                <div className="invalid-feedback">
                                                    {validationErrors.qualification}
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">
                                                <RiMedalLine size={16} className="me-1 text-muted" />
                                                Years of Experience *
                                            </Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="years_experience"
                                                value={doctorData.years_experience}
                                                onChange={handleInputChange}
                                                placeholder="Enter years of experience"
                                                min="0"
                                                max="50"
                                                className={`form-control-lg ${validationErrors.years_experience ? 'is-invalid' : doctorData.years_experience >= 0 ? 'is-valid' : ''}`}
                                            />
                                            {validationErrors.years_experience && (
                                                <div className="invalid-feedback">
                                                    {validationErrors.years_experience}
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        {/* Additional Information */}
                        <Card className="border-0 shadow-sm mb-4">
                            <Card.Header className="bg-success text-white border-0">
                                <h6 className="mb-0 fw-semibold">
                                    <RiHospitalLine size={18} className="me-2" />
                                    Additional Information
                                </h6>
                            </Card.Header>
                            <Card.Body className="p-4">
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">Hospital Affiliation</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="hospital_affiliation"
                                                value={doctorData.hospital_affiliation}
                                                onChange={handleInputChange}
                                                placeholder="Enter hospital affiliation"
                                                className="form-control-lg"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">Consultation Fee ($)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="consultation_fee"
                                                value={doctorData.consultation_fee}
                                                onChange={handleInputChange}
                                                placeholder="Enter consultation fee"
                                                min="0"
                                                step="0.01"
                                                className={`form-control-lg ${validationErrors.consultation_fee ? 'is-invalid' : ''}`}
                                            />
                                            {validationErrors.consultation_fee && (
                                                <div className="invalid-feedback">
                                                    {validationErrors.consultation_fee}
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">Education Background</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                name="education"
                                                value={doctorData.education}
                                                onChange={handleInputChange}
                                                placeholder="Enter educational background..."
                                                className="form-control-lg"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">Certifications</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                name="certifications"
                                                value={doctorData.certifications}
                                                onChange={handleInputChange}
                                                placeholder="Enter certifications..."
                                                className="form-control-lg"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">Professional Bio</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={4}
                                                name="bio"
                                                value={doctorData.bio}
                                                onChange={handleInputChange}
                                                placeholder="Enter professional bio..."
                                                className="form-control-lg"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <div className="form-check form-switch">
                                            <Form.Check
                                                type="switch"
                                                id="emergency-switch"
                                                name="is_available_emergency"
                                                checked={doctorData.is_available_emergency}
                                                onChange={handleInputChange}
                                                label="Available for Emergency Calls"
                                                className="fs-6"
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton className="bg-danger text-white">
                    <Modal.Title className="d-flex align-items-center">
                        <RiDeleteBinLine size={20} className="me-2" />
                        Confirm Deletion
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <div className="text-center">
                        <div className="bg-danger bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                            <RiDeleteBinLine size={24} className="text-danger" />
                        </div>
                        <h5>Are you sure?</h5>
                        <p className="text-muted">
                            This will permanently delete Dr. {doctorData.user?.first_name} {doctorData.user?.last_name} and all associated data. This action cannot be undone.
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete} disabled={saving}>
                        {saving ? (
                            <>
                                <Spinner size="sm" className="me-1" />
                                Deleting...
                            </>
                        ) : (
                            'Delete Doctor'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default EditDoctor;
