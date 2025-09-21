import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Alert, Button, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { doctorAPI } from '../../services/api';

/**
 * Enhanced Doctor Edit Router Component
 * Provides better UX for both doctors and super admins
 */
const DoctorEditRouter = () => {
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState('');
    const [doctorProfile, setDoctorProfile] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        initializeUserContext();
    }, [user]);

    const initializeUserContext = async () => {
        setLoading(true);
        try {
            // Determine user role
            const role = user?.groups?.[0] || user?.role || localStorage.getItem('userRole') || '';
            setUserRole(role.toLowerCase());

            // If user is a doctor, try to find their profile
            if (role.toLowerCase() === 'doctor' && user?.email) {
                await findDoctorProfile();
            } else {
                setLoading(false);
            }
        } catch (err) {
            console.error('Error initializing user context:', err);
            setError('Failed to load user information');
            setLoading(false);
        }
    };

    const findDoctorProfile = async () => {
        try {
            const response = await doctorAPI.getDoctors();
            const doctors = response.data.results || response.data;
            
            const userDoctor = doctors.find(doctor => 
                doctor.user?.email === user?.email || 
                doctor.user?.id === user?.id
            );

            setDoctorProfile(userDoctor);
            
            if (userDoctor) {
                // Auto-redirect doctor to their profile edit page
                setTimeout(() => {
                    navigate(`/doctor/edit-doctor/${userDoctor.id}`);
                }, 1500);
            } else {
                setError('No doctor profile found for your account. Please contact an administrator to create your doctor profile.');
            }
        } catch (err) {
            console.error('Error finding doctor profile:', err);
            setError('Failed to load your doctor profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Container>
                <Row className="justify-content-center" style={{ minHeight: '60vh' }}>
                    <Col md={6} className="d-flex flex-column justify-content-center align-items-center">
                        <Spinner animation="border" variant="primary" className="mb-3" />
                        <h5>Loading your profile...</h5>
                        <p className="text-muted">Please wait while we find your doctor profile</p>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container>
            <Row className="justify-content-center mt-5">
                <Col lg={8}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-primary text-white">
                            <h4 className="mb-0">
                                <i className="ri-user-settings-line me-2"></i>
                                Doctor Profile Editor
                            </h4>
                        </Card.Header>
                        <Card.Body className="p-4">
                            {error && (
                                <Alert variant="danger" className="mb-4">
                                    <i className="ri-error-warning-line me-2"></i>
                                    {error}
                                </Alert>
                            )}

                            {userRole === 'doctor' && doctorProfile && (
                                <Alert variant="success" className="mb-4">
                                    <i className="ri-check-line me-2"></i>
                                    Found your doctor profile! Redirecting to edit page...
                                </Alert>
                            )}

                            {userRole === 'doctor' && !doctorProfile && !error && (
                                <Alert variant="warning" className="mb-4">
                                    <i className="ri-information-line me-2"></i>
                                    No doctor profile found for your account.
                                </Alert>
                            )}

                            <div className="text-center">
                                <h5 className="mb-3">Choose an Option</h5>
                                
                                <div className="d-grid gap-3">
                                    {userRole === 'superadmin' || userRole === 'admin' ? (
                                        <>
                                            <Button 
                                                variant="primary" 
                                                size="lg"
                                                onClick={() => navigate('/doctor/edit-doctor')}
                                                className="d-flex align-items-center justify-content-center"
                                            >
                                                <i className="ri-team-line me-2"></i>
                                                Select Doctor to Edit (Admin Mode)
                                            </Button>
                                            
                                            <Button 
                                                variant="outline-success" 
                                                onClick={() => navigate('/doctor/edit-profile')}
                                                className="d-flex align-items-center justify-content-center"
                                            >
                                                <i className="ri-user-star-line me-2"></i>
                                                Use Enhanced Edit Profile (Recommended)
                                            </Button>
                                        </>
                                    ) : userRole === 'doctor' ? (
                                        <>
                                            {doctorProfile ? (
                                                <Button 
                                                    variant="primary" 
                                                    size="lg"
                                                    onClick={() => navigate(`/doctor/edit-doctor/${doctorProfile.id}`)}
                                                    className="d-flex align-items-center justify-content-center"
                                                >
                                                    <i className="ri-edit-line me-2"></i>
                                                    Edit My Profile (Classic Editor)
                                                </Button>
                                            ) : (
                                                <Button 
                                                    variant="outline-secondary" 
                                                    disabled
                                                    className="d-flex align-items-center justify-content-center"
                                                >
                                                    <i className="ri-error-warning-line me-2"></i>
                                                    No Profile Found
                                                </Button>
                                            )}
                                            
                                            <Button 
                                                variant="success" 
                                                onClick={() => navigate('/doctor/edit-profile')}
                                                className="d-flex align-items-center justify-content-center"
                                            >
                                                <i className="ri-user-star-line me-2"></i>
                                                Enhanced Profile Editor (Recommended)
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button 
                                                variant="outline-primary" 
                                                onClick={() => navigate('/doctor/edit-doctor')}
                                                className="d-flex align-items-center justify-content-center"
                                            >
                                                <i className="ri-team-line me-2"></i>
                                                Select Doctor to Edit
                                            </Button>
                                            
                                            <Button 
                                                variant="success" 
                                                onClick={() => navigate('/doctor/edit-profile')}
                                                className="d-flex align-items-center justify-content-center"
                                            >
                                                <i className="ri-user-star-line me-2"></i>
                                                Enhanced Profile Editor
                                            </Button>
                                        </>
                                    )}
                                </div>

                                <hr className="my-4" />

                                <div className="text-start">
                                    <h6 className="text-muted">Available Options:</h6>
                                    <ul className="list-unstyled">
                                        <li className="mb-2">
                                            <i className="ri-arrow-right-circle-line text-primary me-2"></i>
                                            <strong>Classic Editor:</strong> Original doctor selection interface
                                        </li>
                                        <li className="mb-2">
                                            <i className="ri-arrow-right-circle-line text-success me-2"></i>
                                            <strong>Enhanced Editor:</strong> Modern soft-coded interface with validation
                                        </li>
                                        <li className="mb-2">
                                            <i className="ri-arrow-right-circle-line text-info me-2"></i>
                                            <strong>User Role:</strong> {userRole || 'Unknown'}
                                        </li>
                                    </ul>
                                </div>

                                <div className="mt-4">
                                    <Button 
                                        variant="outline-secondary" 
                                        onClick={() => navigate('/admin/dashboard')}
                                    >
                                        <i className="ri-arrow-left-line me-2"></i>
                                        Back to Dashboard
                                    </Button>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default DoctorEditRouter;
