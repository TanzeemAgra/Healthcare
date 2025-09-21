import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Col, Form, Row, Alert, Spinner } from "react-bootstrap";
import Card from "../../components/Card";
import { useSelector } from 'react-redux';
import apiClient from "../../services/api";

// Import Image
import user11 from "/assets/images/user/11.png"

const EditDoctor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { accessToken } = useSelector(state => state.auth);
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctorId, setSelectedDoctorId] = useState(id || '');
    const [doctorData, setDoctorData] = useState({
        user: {
            first_name: '',
            last_name: '',
            email: ''
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
        is_available_emergency: false,
        available_hours: {}
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

    // Fetch all doctors for selection
    useEffect(() => {
        fetchDoctors();
    }, []);

    // Fetch specific doctor data when selectedDoctorId changes
    useEffect(() => {
        if (selectedDoctorId) {
            fetchDoctorData(selectedDoctorId);
        }
    }, [selectedDoctorId]);

    const fetchDoctors = async () => {
        try {
            const { data } = await apiClient.get('/medicine/doctors/');
            setDoctors(data.results || data);
            if (!selectedDoctorId && (data.results?.length || data.length)) {
                const first = data.results ? data.results[0] : data[0];
                if (first?.id) setSelectedDoctorId(first.id);
            }
        } catch (err) {
            setError('Network error while fetching doctors');
            console.error('Error fetching doctors:', err);
        }
    };

    const fetchDoctorData = async (doctorId) => {
        setLoading(true);
        try {
            const { data } = await apiClient.get(`/medicine/doctors/${doctorId}/`);
            setDoctorData(data);
            setError('');
        } catch (err) {
            setError('Network error while fetching doctor data');
            console.error('Error fetching doctor:', err);
        } finally {
            setLoading(false);
        }
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
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');
        setSuccess('');
        
        try {
            await apiClient.patch(`/medicine/doctors/${selectedDoctorId}/`, {
                license_number: doctorData.license_number,
                specialization: doctorData.specialization,
                qualification: doctorData.qualification,
                years_experience: parseInt(doctorData.years_experience),
                education: doctorData.education,
                certifications: doctorData.certifications,
                hospital_affiliation: doctorData.hospital_affiliation,
                consultation_fee: parseFloat(doctorData.consultation_fee),
                bio: doctorData.bio,
                is_available_emergency: doctorData.is_available_emergency
            });

            setSuccess('Doctor profile updated successfully!');
            // Refresh the data
            await fetchDoctorData(selectedDoctorId);
        } catch (err) {
            setError('Network error while updating doctor');
            console.error('Error updating doctor:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this doctor? This action cannot be undone.')) {
            return;
        }
        
        setSaving(true);
        try {
            await apiClient.delete(`/medicine/doctors/${selectedDoctorId}/`);
            setSuccess('Doctor deleted successfully!');
            navigate('/doctors'); // Redirect to doctors list
        } catch (err) {
            setError('Network error while deleting doctor');
            console.error('Error deleting doctor:', err);
        } finally {
            setSaving(false);
        }
    };

    if (loading && selectedDoctorId) {
        return (
            <div className="text-center p-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-2">Loading doctor data...</p>
            </div>
        );
    }

    return (
        <>
            <Row>
                {error && (
                    <Col lg={12}>
                        <Alert variant="danger" dismissible onClose={() => setError('')}>
                            {error}
                        </Alert>
                    </Col>
                )}
                
                {success && (
                    <Col lg={12}>
                        <Alert variant="success" dismissible onClose={() => setSuccess('')}>
                            {success}
                        </Alert>
                    </Col>
                )}

                {/* Doctor Selection */}
                <Col lg={12} className="mb-3">
                    <Card>
                        <Card.Body>
                            <Row className="align-items-center">
                                <Col md={6}>
                                    <Form.Label htmlFor="doctorSelect" className="mb-0">Select Doctor to Edit:</Form.Label>
                                    <Form.Control 
                                        as="select" 
                                        id="doctorSelect"
                                        value={selectedDoctorId}
                                        onChange={(e) => setSelectedDoctorId(e.target.value)}
                                        className="mt-2"
                                    >
                                        <option value="">Choose a doctor...</option>
                                        {doctors.map(doctor => (
                                            <option key={doctor.id} value={doctor.id}>
                                                Dr. {doctor.user.first_name} {doctor.user.last_name} - {doctor.specialization_display}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Col>
                                <Col md={6} className="text-end">
                                    <Button 
                                        variant="danger" 
                                        onClick={handleDelete}
                                        disabled={!selectedDoctorId || saving}
                                        className="me-2"
                                    >
                                        {saving ? 'Deleting...' : 'Delete Doctor'}
                                    </Button>
                                    <Button 
                                        variant="primary" 
                                        onClick={handleSave}
                                        disabled={!selectedDoctorId || saving}
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Doctor Profile Form */}
                {selectedDoctorId && (
                    <Col lg={12}>
                        <Card>
                            <Card.Header className="d-flex justify-content-between">
                                <Card.Header.Title>
                                    <h4 className="card-title">Doctor Profile Information</h4>
                                </Card.Header.Title>
                            </Card.Header>
                            <Card.Body>
                                <Form>
                                    <Row className="form-group align-items-center mb-4">
                                        <Col md={12}>
                                            <div className="profile-img-edit">
                                                <img className="profile-pic" src={user11} alt="profile-pic" />
                                                <div className="p-image">
                                                    <i className="ri-pencil-line upload-button"></i>
                                                    <input className="file-upload d-none" type="file" accept="image/*" />
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                    
                                    <Row className="cust-form-input">
                                        <Col sm={6} className="form-group">
                                            <Form.Label htmlFor="fname" className="mb-0">First Name:</Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                className="my-2" 
                                                id="fname" 
                                                name="user.first_name"
                                                value={doctorData.user.first_name}
                                                onChange={handleInputChange}
                                                readOnly
                                            />
                                            <small className="text-muted">Contact admin to change name</small>
                                        </Col>
                                        <Col sm={6} className="form-group">
                                            <Form.Label htmlFor="lname" className="mb-0">Last Name:</Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                className="my-2" 
                                                id="lname" 
                                                name="user.last_name"
                                                value={doctorData.user.last_name}
                                                onChange={handleInputChange}
                                                readOnly
                                            />
                                            <small className="text-muted">Contact admin to change name</small>
                                        </Col>
                                        <Col sm={6} className="form-group">
                                            <Form.Label htmlFor="email" className="mb-0">Email:</Form.Label>
                                            <Form.Control 
                                                type="email" 
                                                className="my-2" 
                                                id="email" 
                                                value={doctorData.user.email}
                                                readOnly
                                            />
                                            <small className="text-muted">Contact admin to change email</small>
                                        </Col>
                                        <Col sm={6} className="form-group">
                                            <Form.Label htmlFor="license" className="mb-0">License Number:</Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                className="my-2" 
                                                id="license" 
                                                name="license_number"
                                                value={doctorData.license_number}
                                                onChange={handleInputChange}
                                            />
                                        </Col>
                                        <Col sm={6} className="form-group">
                                            <Form.Label className="mb-0">Specialization:</Form.Label>
                                            <Form.Control 
                                                as="select" 
                                                name="specialization"
                                                value={doctorData.specialization}
                                                onChange={handleInputChange}
                                                className="form-control my-2"
                                            >
                                                {specializationOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Col>
                                        <Col sm={6} className="form-group">
                                            <Form.Label className="mb-0">Qualification:</Form.Label>
                                            <Form.Control 
                                                as="select" 
                                                name="qualification"
                                                value={doctorData.qualification}
                                                onChange={handleInputChange}
                                                className="form-control my-2"
                                            >
                                                {qualificationOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Col>
                                        <Col sm={6} className="form-group">
                                            <Form.Label htmlFor="experience" className="mb-0">Years of Experience:</Form.Label>
                                            <Form.Control 
                                                type="number" 
                                                className="my-2" 
                                                id="experience" 
                                                name="years_experience"
                                                value={doctorData.years_experience}
                                                onChange={handleInputChange}
                                                min="0"
                                            />
                                        </Col>
                                        <Col sm={6} className="form-group">
                                            <Form.Label htmlFor="fee" className="mb-0">Consultation Fee ($):</Form.Label>
                                            <Form.Control 
                                                type="number" 
                                                className="my-2" 
                                                id="fee" 
                                                name="consultation_fee"
                                                value={doctorData.consultation_fee}
                                                onChange={handleInputChange}
                                                min="0"
                                                step="0.01"
                                            />
                                        </Col>
                                        <Col sm={12} className="form-group">
                                            <Form.Label htmlFor="education" className="mb-0">Education:</Form.Label>
                                            <Form.Control 
                                                as="textarea" 
                                                rows={3}
                                                className="my-2" 
                                                id="education" 
                                                name="education"
                                                value={doctorData.education}
                                                onChange={handleInputChange}
                                                placeholder="Enter educational background..."
                                            />
                                        </Col>
                                        <Col sm={12} className="form-group">
                                            <Form.Label htmlFor="hospital" className="mb-0">Hospital Affiliation:</Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                className="my-2" 
                                                id="hospital" 
                                                name="hospital_affiliation"
                                                value={doctorData.hospital_affiliation}
                                                onChange={handleInputChange}
                                                placeholder="Enter hospital affiliation..."
                                            />
                                        </Col>
                                        <Col sm={12} className="form-group">
                                            <Form.Label htmlFor="certifications" className="mb-0">Certifications:</Form.Label>
                                            <Form.Control 
                                                as="textarea" 
                                                rows={2}
                                                className="my-2" 
                                                id="certifications" 
                                                name="certifications"
                                                value={doctorData.certifications}
                                                onChange={handleInputChange}
                                                placeholder="Enter certifications..."
                                            />
                                        </Col>
                                        <Col sm={12} className="form-group">
                                            <Form.Label htmlFor="bio" className="mb-0">Bio:</Form.Label>
                                            <Form.Control 
                                                as="textarea" 
                                                rows={4}
                                                className="my-2" 
                                                id="bio" 
                                                name="bio"
                                                value={doctorData.bio}
                                                onChange={handleInputChange}
                                                placeholder="Enter professional bio..."
                                            />
                                        </Col>
                                        <Col sm={12} className="form-group">
                                            <div className="form-check">
                                                <Form.Check
                                                    type="checkbox"
                                                    id="emergency"
                                                    name="is_available_emergency"
                                                    checked={doctorData.is_available_emergency}
                                                    onChange={handleInputChange}
                                                    label="Available for Emergency Calls"
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>
        </>
    );
};

export default EditDoctor;
