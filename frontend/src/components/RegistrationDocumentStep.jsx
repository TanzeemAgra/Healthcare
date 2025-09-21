/**
 * Enhanced Registration Form Step - Document Upload Integration
 * This component adds document upload functionality to the existing registration form
 */
import React, { useState } from 'react';
import { Card, Button, Alert, ProgressBar } from 'react-bootstrap';
import RegistrationDocumentUpload from '../../components/RegistrationDocumentUpload';

const RegistrationDocumentStep = ({ 
  formData, 
  onDocumentsChange, 
  onNext, 
  onPrevious,
  errors = [],
  isLoading = false 
}) => {
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [showSkipWarning, setShowSkipWarning] = useState(false);

  // Soft-coded configuration for this step
  const STEP_CONFIG = {
    requirements: {
      minimum_required_documents: 3,
      recommended_documents: 5,
      allow_skip_with_warning: true
    },
    messages: {
      title: '📄 Document Upload',
      subtitle: 'Upload Required Medical Documents',
      description: 'Please upload your medical credentials and supporting documents. These will be reviewed by our administrative team.',
      skip_warning: '⚠️ Skipping document upload will delay your account approval process.',
      completion_message: '✅ All required documents uploaded successfully!'
    },
    ui_settings: {
      show_progress_indicator: true,
      enable_document_preview: true,
      allow_multiple_files_per_type: true
    }
  };

  const handleDocumentsChange = (documents) => {
    setUploadedDocuments(documents);
    if (onDocumentsChange) {
      onDocumentsChange(documents);
    }
  };

  const getRequiredDocumentCount = () => {
    const requiredDocs = uploadedDocuments.filter(doc => 
      doc.isRequired || ['identity', 'license', 'education'].includes(doc.category)
    );
    return requiredDocs.length;
  };

  const canProceed = () => {
    const requiredCount = getRequiredDocumentCount();
    return requiredCount >= STEP_CONFIG.requirements.minimum_required_documents;
  };

  const handleNext = () => {
    if (canProceed()) {
      onNext();
    } else {
      if (STEP_CONFIG.requirements.allow_skip_with_warning) {
        setShowSkipWarning(true);
      }
    }
  };

  const handleSkipWithWarning = () => {
    setShowSkipWarning(false);
    onNext();
  };

  const renderProgressSummary = () => {
    const requiredCount = getRequiredDocumentCount();
    const progressPercentage = Math.min(
      (requiredCount / STEP_CONFIG.requirements.minimum_required_documents) * 100,
      100
    );

    return (
      <Card className="mb-4 border-info">
        <Card.Header className="bg-info text-white py-2">
          <h6 className="mb-0">
            <i className="ri-file-list-line me-2"></i>
            Upload Progress
          </h6>
        </Card.Header>
        <Card.Body className="p-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span>Required Documents Uploaded:</span>
            <strong>{requiredCount} / {STEP_CONFIG.requirements.minimum_required_documents}</strong>
          </div>
          <ProgressBar 
            now={progressPercentage} 
            variant={progressPercentage >= 100 ? 'success' : 'warning'}
            className="mb-2"
          />
          <div className="d-flex justify-content-between small text-muted">
            <span>Total Documents: {uploadedDocuments.length}</span>
            <span>Recommended: {STEP_CONFIG.requirements.recommended_documents}</span>
          </div>
        </Card.Body>
      </Card>
    );
  };

  return (
    <div className="registration-document-step">
      {/* Step Header */}
      <div className="mb-4">
        <h3 className="fw-bold text-primary mb-2">
          {STEP_CONFIG.messages.title}
        </h3>
        <h5 className="text-muted mb-3">
          {STEP_CONFIG.messages.subtitle}
        </h5>
        <p className="text-muted">
          {STEP_CONFIG.messages.description}
        </p>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <Alert variant="danger" className="mb-4">
          <strong>Please address the following issues:</strong>
          <ul className="mb-0 mt-2">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Progress Summary */}
      {STEP_CONFIG.ui_settings.show_progress_indicator && renderProgressSummary()}

      {/* Document Upload Component */}
      <RegistrationDocumentUpload
        userEmail={formData.email}
        onDocumentsChange={handleDocumentsChange}
      />

      {/* Completion Message */}
      {canProceed() && (
        <Alert variant="success" className="mb-4">
          <div className="d-flex align-items-center">
            <i className="ri-check-circle-fill me-2 fs-5"></i>
            <strong>{STEP_CONFIG.messages.completion_message}</strong>
          </div>
        </Alert>
      )}

      {/* Navigation Buttons */}
      <div className="d-flex justify-content-between mt-4">
        <Button 
          variant="outline-secondary" 
          onClick={onPrevious}
          disabled={isLoading}
        >
          <i className="ri-arrow-left-line me-1"></i>
          Previous
        </Button>
        
        <div>
          {!canProceed() && STEP_CONFIG.requirements.allow_skip_with_warning && (
            <Button 
              variant="outline-warning" 
              onClick={() => setShowSkipWarning(true)}
              className="me-2"
              disabled={isLoading}
            >
              Skip for Now
            </Button>
          )}
          
          <Button 
            variant={canProceed() ? "primary" : "outline-primary"}
            onClick={handleNext}
            disabled={isLoading}
          >
            {canProceed() ? (
              <>
                Next
                <i className="ri-arrow-right-line ms-1"></i>
              </>
            ) : (
              <>
                Complete Upload
                <i className="ri-upload-line ms-1"></i>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Skip Warning Modal */}
      {showSkipWarning && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title">
                  <i className="ri-alert-fill text-warning me-2"></i>
                  Skip Document Upload?
                </h5>
              </div>
              <div className="modal-body">
                <p>{STEP_CONFIG.messages.skip_warning}</p>
                <ul className="text-muted small">
                  <li>Your account approval may be delayed</li>
                  <li>You'll need to upload documents later to activate full features</li>
                  <li>Some platform features may be restricted</li>
                </ul>
                <p className="mb-0">
                  <strong>Are you sure you want to proceed without uploading documents?</strong>
                </p>
              </div>
              <div className="modal-footer border-0">
                <Button 
                  variant="outline-secondary" 
                  onClick={() => setShowSkipWarning(false)}
                >
                  Cancel - Upload Documents
                </Button>
                <Button 
                  variant="warning" 
                  onClick={handleSkipWithWarning}
                >
                  Skip for Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Information */}
      <Card className="mt-4 border-light bg-light">
        <Card.Body className="p-3">
          <h6 className="text-muted mb-2">
            <i className="ri-information-line me-1"></i>
            Need Help?
          </h6>
          <div className="small text-muted">
            <p className="mb-2">
              <strong>Acceptable formats:</strong> PDF, JPG, PNG, DOC, DOCX (max 10MB per file)
            </p>
            <p className="mb-2">
              <strong>Document quality:</strong> Ensure all text is clearly readable and images are high resolution
            </p>
            <p className="mb-0">
              <strong>Support:</strong> Contact support@xerxez.in if you need assistance with document upload
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default RegistrationDocumentStep;
