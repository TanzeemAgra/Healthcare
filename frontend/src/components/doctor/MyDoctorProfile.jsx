import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { doctorAPI } from '../../services/api';
import EnhancedEditDoctorProfile from './EnhancedEditDoctorProfile';

/**
 * My Profile Editor - Auto-detects current user's doctor profile
 */
const MyDoctorProfile = () => {
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const [loading, setLoading] = useState(true);
    const [doctorId, setDoctorId] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        findMyDoctorProfile();
    }, [user]);

    const findMyDoctorProfile = async () => {
        if (!user?.email) {
            setError('User information not available. Please log in again.');
            setLoading(false);
            return;
        }

        try {
            const response = await doctorAPI.getDoctors();
            const doctors = response.data.results || response.data;
            
            const myProfile = doctors.find(doctor => 
                doctor.user?.email === user.email || 
                doctor.user?.id === user.id
            );

            if (myProfile) {
                setDoctorId(myProfile.id);
            } else {
                setError('No doctor profile found for your account. Please contact an administrator to create your doctor profile.');
            }
        } catch (err) {
            console.error('Error finding doctor profile:', err);
            setError('Failed to load your doctor profile. Please try again.');
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
                        <h5>Finding your doctor profile...</h5>
                        <p className="text-muted">Please wait while we load your information</p>
                    </Col>
                </Row>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Row className="justify-content-center mt-5">
                    <Col md={8}>
                        <Alert variant="danger">
                            <h5>
                                <i className="ri-error-warning-line me-2"></i>
                                Profile Not Found
                            </h5>
                            <p>{error}</p>
                            <hr />
                            <div className="d-flex gap-2">
                                <button 
                                    className="btn btn-outline-primary"
                                    onClick={() => navigate('/admin/dashboard')}
                                >
                                    <i className="ri-arrow-left-line me-2"></i>
                                    Back to Dashboard
                                </button>
                                <button 
                                    className="btn btn-primary"
                                    onClick={() => window.location.reload()}
                                >
                                    <i className="ri-refresh-line me-2"></i>
                                    Try Again
                                </button>
                            </div>
                        </Alert>
                    </Col>
                </Row>
            </Container>
        );
    }

    // Render the enhanced edit profile component with the found doctor ID
    return <EnhancedEditDoctorProfile doctorId={doctorId} />;
};

export default MyDoctorProfile;
