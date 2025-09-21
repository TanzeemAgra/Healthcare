import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert, Spinner, Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { doctorAPI } from '../../services/api';

const EditDoctorForm = ({ doctor, onSuccess, onCancel }) => {
  const { accessToken } = useSelector(state => state.auth);
  const [formData, setFormData] = useState({
    // User fields
    first_name: '',
    last_name: '',
    email: '',
    
    // Doctor fields
    license_number: '',
    specialization: '',
    qualification: '',
    years_experience: '',
    phone_number: '',
    education: '',
    certifications: '',
    hospital_affiliation: '',
    consultation_fee: '',
    bio: '',
    is_available_emergency: false
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Initialize form with doctor data
  useEffect(() => {
    if (doctor) {
      setFormData({
        first_name: doctor.user?.first_name || '',
        last_name: doctor.user?.last_name || '',
        email: doctor.user?.email || '',
        license_number: doctor.license_number || '',
        specialization: doctor.specialization || '',
        qualification: doctor.qualification || '',
        years_experience: doctor.years_experience || '',
        phone_number: doctor.phone_number || '',
        education: doctor.education || '',
        certifications: doctor.certifications || '',
        hospital_affiliation: doctor.hospital_affiliation || '',
        consultation_fee: doctor.consultation_fee || '',
        bio: doctor.bio || '',
        is_available_emergency: doctor.is_available_emergency || false
      });
    }
  }, [doctor]);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Prepare update data (excluding password and username for updates)
      const updateData = {
        license_number: formData.license_number,
        specialization: formData.specialization,
        qualification: formData.qualification,
        years_experience: parseInt(formData.years_experience) || 0,
        phone_number: formData.phone_number,
        education: formData.education,
        certifications: formData.certifications,
        hospital_affiliation: formData.hospital_affiliation,
        consultation_fee: parseFloat(formData.consultation_fee) || 0,
        bio: formData.bio,
        is_available_emergency: formData.is_available_emergency,
        // User fields update
        user: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email
        }
      };
      
      const response = await doctorAPI.updateDoctor(doctor.id, updateData);
      onSuccess(response.data);
    } catch (err) {
      setError(`Failed to update doctor: ${err.response?.data?.message || err.message}`);
      console.error('Error updating doctor:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
      {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        {/* Personal Information Section */}
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Header className="bg-primary text-white py-2">
            <h6 className="mb-0">
              <i className="ri-user-line me-2"></i>
              Personal Information
            </h6>
          </Card.Header>
          <Card.Body className="p-3">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    <i className="ri-user-line me-1 text-muted"></i>
                    First Name *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    placeholder="Enter first name"
                    className="form-control-lg"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    <i className="ri-user-line me-1 text-muted"></i>
                    Last Name *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    placeholder="Enter last name"
                    className="form-control-lg"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    <i className="ri-mail-line me-1 text-muted"></i>
                    Email Address *
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="doctor@hospital.com"
                    className="form-control-lg"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    <i className="ri-phone-line me-1 text-muted"></i>
                    Phone Number
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    className="form-control-lg"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Professional Information Section */}
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Header className="bg-success text-white py-2">
            <h6 className="mb-0">
              <i className="ri-hospital-line me-2"></i>
              Professional Information
            </h6>
          </Card.Header>
          <Card.Body className="p-3">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    <i className="ri-file-text-line me-1 text-muted"></i>
                    Medical License Number *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="license_number"
                    value={formData.license_number}
                    onChange={handleInputChange}
                    placeholder="Enter license number"
                    className="form-control-lg"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    <i className="ri-heart-pulse-line me-1 text-muted"></i>
                    Medical Specialization *
                  </Form.Label>
                  <Form.Select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    className="form-control-lg"
                    required
                  >
                    <option value="">Select Specialization</option>
                    <option value="cardiology">🫀 Cardiology</option>
                    <option value="neurology">🧠 Neurology</option>
                    <option value="oncology">🎗️ Oncology</option>
                    <option value="pediatrics">👶 Pediatrics</option>
                    <option value="surgery">⚕️ Surgery</option>
                    <option value="dermatology">🧴 Dermatology</option>
                    <option value="psychiatry">🧘 Psychiatry</option>
                    <option value="radiology">📡 Radiology</option>
                    <option value="anesthesiology">💉 Anesthesiology</option>
                    <option value="emergency_medicine">🚨 Emergency Medicine</option>
                    <option value="internal_medicine">🔬 Internal Medicine</option>
                    <option value="family_medicine">👨‍👩‍👧‍👦 Family Medicine</option>
                    <option value="orthopedics">🦴 Orthopedics</option>
                    <option value="gynecology">👩‍⚕️ Gynecology</option>
                    <option value="urology">🫘 Urology</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    <i className="ri-time-line me-1 text-muted"></i>
                    Years of Experience
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="years_experience"
                    value={formData.years_experience}
                    onChange={handleInputChange}
                    min="0"
                    max="50"
                    placeholder="0"
                    className="form-control-lg"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    <i className="ri-money-dollar-circle-line me-1 text-muted"></i>
                    Consultation Fee ($)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="consultation_fee"
                    value={formData.consultation_fee}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="form-control-lg"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                <i className="ri-graduation-cap-line me-1 text-muted"></i>
                Medical Qualification
              </Form.Label>
              <Form.Control
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleInputChange}
                placeholder="e.g., MBBS, MD, MS, Fellowship details"
                className="form-control-lg"
              />
            </Form.Group>
          </Card.Body>
        </Card>

        {/* Additional Information Section */}
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Header className="bg-warning text-dark py-2">
            <h6 className="mb-0">
              <i className="ri-information-line me-2"></i>
              Additional Information
            </h6>
          </Card.Header>
          <Card.Body className="p-3">
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                <i className="ri-school-line me-1 text-muted"></i>
                Educational Background
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                placeholder="Medical school, residency, fellowship programs and institutions"
                className="form-control-lg"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                <i className="ri-award-line me-1 text-muted"></i>
                Professional Certifications
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="certifications"
                value={formData.certifications}
                onChange={handleInputChange}
                placeholder="Board certifications, professional licenses, and specialized training"
                className="form-control-lg"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                <i className="ri-building-line me-1 text-muted"></i>
                Hospital/Clinic Affiliation
              </Form.Label>
              <Form.Control
                type="text"
                name="hospital_affiliation"
                value={formData.hospital_affiliation}
                onChange={handleInputChange}
                placeholder="Primary hospital, clinic, or healthcare institution"
                className="form-control-lg"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                <i className="ri-user-heart-line me-1 text-muted"></i>
                Professional Biography
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Brief professional biography, areas of expertise, and notable achievements"
                className="form-control-lg"
              />
            </Form.Group>
            
            <div className="bg-light p-3 rounded">
              <Form.Group className="mb-0">
                <Form.Check
                  type="checkbox"
                  name="is_available_emergency"
                  checked={formData.is_available_emergency}
                  onChange={handleInputChange}
                  label={
                    <span className="fw-semibold">
                      <i className="ri-first-aid-kit-line me-2 text-danger"></i>
                      Available for Emergency Calls
                      <small className="d-block text-muted mt-1">
                        Check this if the doctor is available for emergency consultations outside regular hours
                      </small>
                    </span>
                  }
                  className="user-select-none"
                />
              </Form.Group>
            </div>
          </Card.Body>
        </Card>
        
        {/* Action Buttons */}
        <div className="d-flex justify-content-end gap-2 pt-3 border-top">
          <Button 
            variant="outline-secondary" 
            onClick={onCancel} 
            disabled={loading}
            className="px-4 py-2"
          >
            <i className="ri-close-line me-1"></i>
            Cancel
          </Button>
          <Button 
            variant="success" 
            type="submit" 
            disabled={loading}
            className="px-4 py-2"
          >
            {loading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Updating Doctor...
              </>
            ) : (
              <>
                <i className="ri-save-line me-1"></i>
                Update Doctor Profile
              </>
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditDoctorForm;
