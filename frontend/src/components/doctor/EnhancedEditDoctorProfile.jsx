import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, Form, Alert, Spinner, ProgressBar, Badge, Container, Row, Col } from 'react-bootstrap';
import { doctorAPI } from '../../services/api';
import { DOCTOR_PROFILE_CONFIG, getFieldByName, isFieldEditable, isFieldRequired, getFieldOptions, DEFAULT_DOCTOR_VALUES } from '../../config/doctorProfileConfig';

/**
 * Enhanced Edit Doctor Profile Component using Soft Coding Techniques
 * Consolidates all edit doctor functionality into a single, configurable component
 */
const EnhancedEditDoctorProfile = ({ doctorId: propDoctorId }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    
    // Use prop doctorId if provided, otherwise use URL param
    const effectiveId = propDoctorId || id;
    
    // State management using configuration
    const [doctorData, setDoctorData] = useState(DEFAULT_DOCTOR_VALUES);
    const [originalData, setOriginalData] = useState({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [formProgress, setFormProgress] = useState(0);
    const [hasChanges, setHasChanges] = useState(false);

    const { API_ENDPOINTS, FORM_SECTIONS, VALIDATION_RULES, UI_SETTINGS, FEATURE_FLAGS, ERROR_MESSAGES, NAVIGATION } = DOCTOR_PROFILE_CONFIG;

    // Load doctor data on component mount
    useEffect(() => {
        if (effectiveId && effectiveId !== 'new') {
            loadDoctorData(effectiveId);
        } else {
            // For new doctor creation
            setDoctorData(DEFAULT_DOCTOR_VALUES);
            setOriginalData(DEFAULT_DOCTOR_VALUES);
        }
    }, [effectiveId]);

    // Calculate form progress based on filled required fields
    useEffect(() => {
        if (FEATURE_FLAGS.enable_progress_tracking) {
            calculateFormProgress();
        }
    }, [doctorData]);

    // Check for changes to enable/disable save button
    useEffect(() => {
        const changes = Object.keys(doctorData).some(key => 
            JSON.stringify(doctorData[key]) !== JSON.stringify(originalData[key])
        );
        setHasChanges(changes);
    }, [doctorData, originalData]);

    /**
     * Load doctor data from API
     */
    const loadDoctorData = async (doctorId) => {
        setLoading(true);
        try {
            const response = await doctorAPI.getDoctor(doctorId);
            if (response.success) {
                setDoctorData(response.data);
                setOriginalData(response.data);
                setErrorMessage('');
            } else {
                setErrorMessage(ERROR_MESSAGES.not_found);
            }
        } catch (error) {
            console.error('Error loading doctor data:', error);
            setErrorMessage(ERROR_MESSAGES.network_error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Calculate form completion progress
     */
    const calculateFormProgress = useCallback(() => {
        const allRequiredFields = [];
        
        Object.values(FORM_SECTIONS).forEach(section => {
            section.fields.forEach(field => {
                if (field.required) {
                    allRequiredFields.push(field.name);
                }
            });
        });

        const filledRequiredFields = allRequiredFields.filter(fieldName => {
            const value = doctorData[fieldName];
            return value !== null && value !== undefined && value !== '';
        });

        const progress = allRequiredFields.length > 0 
            ? Math.round((filledRequiredFields.length / allRequiredFields.length) * 100)
            : 100;
        
        setFormProgress(progress);
    }, [doctorData, FORM_SECTIONS]);

    /**
     * Validate field based on configuration
     */
    const validateField = (fieldName, value) => {
        const field = getFieldByName(fieldName);
        if (!field) return '';

        // Required field validation
        if (field.required && (!value || value.toString().trim() === '')) {
            return `${field.label} is required`;
        }

        // Type-specific validation
        if (value && field.type === 'email') {
            const emailRegex = VALIDATION_RULES.email;
            if (!emailRegex.test(value)) {
                return 'Please enter a valid email address';
            }
        }

        // Custom validation rules from configuration
        if (value && field.validation) {
            const rules = field.validation.split(',');
            for (const rule of rules) {
                const [type, param] = rule.split(':');
                
                switch (type.trim()) {
                    case 'min_length':
                        if (value.length < parseInt(param)) {
                            return `${field.label} must be at least ${param} characters`;
                        }
                        break;
                    case 'max_length':
                        if (value.length > parseInt(param)) {
                            return `${field.label} must not exceed ${param} characters`;
                        }
                        break;
                    case 'min':
                        if (parseFloat(value) < parseFloat(param)) {
                            return `${field.label} must be at least ${param}`;
                        }
                        break;
                    case 'max':
                        if (parseFloat(value) > parseFloat(param)) {
                            return `${field.label} must not exceed ${param}`;
                        }
                        break;
                }
            }
        }

        return '';
    };

    /**
     * Handle form field changes with real-time validation
     */
    const handleFieldChange = (fieldName, value) => {
        setDoctorData(prev => ({
            ...prev,
            [fieldName]: value
        }));

        // Real-time validation if enabled
        if (FEATURE_FLAGS.enable_realtime_validation) {
            const error = validateField(fieldName, value);
            setValidationErrors(prev => ({
                ...prev,
                [fieldName]: error
            }));
        }
    };

    /**
     * Validate entire form
     */
    const validateForm = () => {
        const newErrors = {};
        
        Object.values(FORM_SECTIONS).forEach(section => {
            section.fields.forEach(field => {
                const error = validateField(field.name, doctorData[field.name]);
                if (error) {
                    newErrors[field.name] = error;
                }
            });
        });

        setValidationErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * Save doctor profile
     */
    const handleSave = async () => {
        if (!validateForm()) {
            setErrorMessage(ERROR_MESSAGES.validation_error);
            return;
        }

        setSaving(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            let response;
            if (effectiveId && effectiveId !== 'new') {
                response = await doctorAPI.updateDoctor(effectiveId, doctorData);
            } else {
                response = await doctorAPI.createDoctor(doctorData);
            }

            if (response.success) {
                setSuccessMessage(ERROR_MESSAGES.save_success);
                setOriginalData(doctorData);
                setHasChanges(false);
                
                // Navigate back after successful save
                setTimeout(() => {
                    navigate(NAVIGATION.back_url);
                }, 1500);
            } else {
                setErrorMessage(response.message || ERROR_MESSAGES.save_error);
            }
        } catch (error) {
            console.error('Error saving doctor:', error);
            setErrorMessage(ERROR_MESSAGES.save_error);
        } finally {
            setSaving(false);
        }
    };

    /**
     * Render form field based on configuration
     */
    const renderField = (field) => {
        const hasError = validationErrors[field.name];
        const isDisabled = !field.editable;
        const value = doctorData[field.name] || '';

        switch (field.type) {
            case 'text':
            case 'email':
            case 'tel':
                return (
                    <Form.Group key={field.name} className="mb-3">
                        <Form.Label>
                            {field.label}
                            {field.required && <span className="text-danger">*</span>}
                        </Form.Label>
                        <Form.Control
                            type={field.type}
                            isInvalid={!!hasError}
                            value={value}
                            onChange={(e) => handleFieldChange(field.name, e.target.value)}
                            placeholder={field.placeholder}
                            disabled={isDisabled}
                            style={{
                                backgroundColor: isDisabled ? '#f8f9fa' : 'white'
                            }}
                        />
                        {hasError && <Form.Control.Feedback type="invalid">{hasError}</Form.Control.Feedback>}
                        {field.note && <Form.Text className="text-muted">{field.note}</Form.Text>}
                    </Form.Group>
                );

            case 'number':
                return (
                    <Form.Group key={field.name} className="mb-3">
                        <Form.Label>
                            {field.label}
                            {field.required && <span className="text-danger">*</span>}
                        </Form.Label>
                        <div className="input-group">
                            {field.prefix && <span className="input-group-text">{field.prefix}</span>}
                            <Form.Control
                                type="number"
                                isInvalid={!!hasError}
                                value={value}
                                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                step={field.step}
                                disabled={isDisabled}
                            />
                        </div>
                        {hasError && <Form.Control.Feedback type="invalid">{hasError}</Form.Control.Feedback>}
                    </Form.Group>
                );

            case 'select':
                return (
                    <Form.Group key={field.name} className="mb-3">
                        <Form.Label>
                            {field.label}
                            {field.required && <span className="text-danger">*</span>}
                        </Form.Label>
                        <Form.Select
                            isInvalid={!!hasError}
                            value={value}
                            onChange={(e) => handleFieldChange(field.name, e.target.value)}
                            disabled={isDisabled}
                        >
                            <option value="">Select {field.label}</option>
                            {field.options?.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Form.Select>
                        {hasError && <Form.Control.Feedback type="invalid">{hasError}</Form.Control.Feedback>}
                    </Form.Group>
                );

            case 'textarea':
                return (
                    <Form.Group key={field.name} className="mb-3">
                        <Form.Label>
                            {field.label}
                            {field.required && <span className="text-danger">*</span>}
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={field.rows || 3}
                            isInvalid={!!hasError}
                            value={value}
                            onChange={(e) => handleFieldChange(field.name, e.target.value)}
                            placeholder={field.placeholder}
                            disabled={isDisabled}
                        />
                        {hasError && <Form.Control.Feedback type="invalid">{hasError}</Form.Control.Feedback>}
                    </Form.Group>
                );

            case 'switch':
                return (
                    <Form.Group key={field.name} className="mb-3">
                        <Form.Check
                            type="switch"
                            checked={Boolean(value)}
                            onChange={(e) => handleFieldChange(field.name, e.target.checked)}
                            disabled={isDisabled}
                            label={
                                <>
                                    {field.label}
                                    {field.required && <span className="text-danger">*</span>}
                                </>
                            }
                        />
                        {field.note && <Form.Text className="text-muted">{field.note}</Form.Text>}
                        {hasError && <div className="text-danger small">{hasError}</div>}
                    </Form.Group>
                );

            default:
                return null;
        }
    };

    /**
     * Render form section
     */
    const renderFormSection = (sectionKey, section) => {
        return (
            <Card key={sectionKey} className="mb-3" style={{ borderRadius: UI_SETTINGS.card_border_radius }}>
                <Card.Body>
                    <div className="d-flex align-items-center mb-3">
                        <i className={`${section.icon} me-2 text-${section.color}`} style={{ fontSize: '1.25rem' }}></i>
                        <h5 className="mb-0">{section.title}</h5>
                    </div>
                    
                    <Row>
                        {section.fields.map(field => (
                            <Col key={field.name} md={6}>
                                {renderField(field)}
                            </Col>
                        ))}
                    </Row>
                </Card.Body>
            </Card>
        );
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <Spinner color="primary" />
                <span className="ms-2">Loading doctor profile...</span>
            </div>
        );
    }

    return (
        <Container fluid>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="mb-1">
                        {effectiveId === 'new' ? 'Create New Doctor Profile' : 'Edit Doctor Profile'}
                    </h4>
                    <p className="text-muted mb-0">
                        {effectiveId === 'new' ? 'Add a new doctor to the system' : 'Update doctor information and preferences'}
                    </p>
                </div>
                
                <div className="d-flex gap-2">
                    <Button 
                        variant="secondary" 
                        onClick={() => navigate(NAVIGATION.back_url)}
                    >
                        <i className="ri-arrow-left-line"></i> Back to List
                    </Button>
                    
                    <Button 
                        variant="primary" 
                        onClick={handleSave}
                        disabled={saving || !hasChanges}
                    >
                        {saving && <Spinner size="sm" className="me-2" />}
                        <i className="ri-save-line me-1"></i>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>

            {/* Progress Bar */}
            {FEATURE_FLAGS.enable_progress_tracking && (
                <Card className="mb-3">
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-medium">Form Completion</span>
                            <Badge bg={formProgress === 100 ? 'success' : 'warning'}>
                                {formProgress}%
                            </Badge>
                        </div>
                        <ProgressBar now={formProgress} variant={formProgress === 100 ? 'success' : 'primary'} />
                    </Card.Body>
                </Card>
            )}

            {/* Messages */}
            {errorMessage && (
                <Alert variant="danger" className="mb-3">
                    <i className="ri-error-warning-line me-2"></i>
                    {errorMessage}
                </Alert>
            )}
            
            {successMessage && (
                <Alert variant="success" className="mb-3">
                    <i className="ri-check-line me-2"></i>
                    {successMessage}
                </Alert>
            )}

            {/* Form Sections */}
            <Form>
                {Object.entries(FORM_SECTIONS).map(([sectionKey, section]) => 
                    renderFormSection(sectionKey, section)
                )}
            </Form>

            {/* Footer Actions */}
            <div className="d-flex justify-content-end gap-2 mt-4 mb-5">
                <Button 
                    variant="light" 
                    onClick={() => navigate(NAVIGATION.back_url)}
                >
                    Cancel
                </Button>
                
                <Button 
                    variant="primary" 
                    onClick={handleSave}
                    disabled={saving || !hasChanges}
                >
                    {saving && <Spinner size="sm" className="me-2" />}
                    <i className="ri-save-line me-1"></i>
                    {saving ? 'Saving...' : (effectiveId === 'new' ? 'Create Doctor' : 'Save Changes')}
                </Button>
            </div>
        </Container>
    );
};

export default EnhancedEditDoctorProfile;
