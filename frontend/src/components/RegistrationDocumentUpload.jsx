import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Form, Alert, ProgressBar, Badge, Modal, ListGroup } from 'react-bootstrap';
import { FaUpload, FaCheck, FaTimes, FaFileAlt, FaSpinner, FaEye, FaTrash } from 'react-icons/fa';

/**
 * Enhanced Registration Document Upload Component with Soft Coding
 * Handles document uploads during registration with comprehensive validation
 */
const RegistrationDocumentUpload = ({ userEmail, onDocumentsChange }) => {
  // Soft-coded configuration for easy customization
  const COMPONENT_CONFIG = {
    ui_settings: {
      max_files_display: 10,
      upload_animation_duration: 2000,
      success_message_timeout: 5000,
      file_preview_size: '150px'
    },
    validation_messages: {
      file_too_large: '❌ File size exceeds the 10MB limit',
      invalid_type: '❌ File type not supported. Please use PDF, JPG, PNG, or DOC files',
      upload_success: '✅ Document uploaded successfully!',
      upload_error: '❌ Upload failed. Please try again',
      required_docs: '⚠️ Please upload at least 3 required documents',
      all_docs_uploaded: '🎉 All required documents uploaded!'
    },
    upload_settings: {
      chunk_size: 1024 * 1024, // 1MB chunks for large files
      retry_attempts: 3,
      timeout_seconds: 30,
      parallel_uploads: 2
    },
    categories_config: {
      identity: { color: 'primary', icon: '🆔' },
      license: { color: 'success', icon: '📋' },
      education: { color: 'info', icon: '🎓' },
      experience: { color: 'warning', icon: '💼' },
      certification: { color: 'secondary', icon: '🏆' },
      insurance: { color: 'danger', icon: '🛡️' }
    }
  };

  // Component state
  const [documentTypes, setDocumentTypes] = useState([]);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [successMessages, setSuccessMessages] = useState([]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewDocument, setPreviewDocument] = useState(null);

  // Fetch available document types on component mount
  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  const fetchDocumentTypes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/hospital/registration-document-types/');
      const data = await response.json();
      
      if (data.success) {
        setDocumentTypes(data.categories);
      } else {
        setErrors(['Failed to load document types']);
      }
    } catch (error) {
      console.error('Error fetching document types:', error);
      setErrors(['Network error while loading document types']);
    } finally {
      setIsLoading(false);
    }
  };

  const validateFile = (file, documentType) => {
    const validationRules = {
      maxSizeMB: documentType.file_size_limit_mb || 10,
      allowedExtensions: documentType.allowed_extensions || ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'],
      minSizeBytes: 1024 // 1KB minimum
    };

    const errors = [];
    
    // Size validation
    if (file.size > validationRules.maxSizeMB * 1024 * 1024) {
      errors.push(`File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds limit (${validationRules.maxSizeMB}MB)`);
    }
    
    if (file.size < validationRules.minSizeBytes) {
      errors.push('File appears to be empty or corrupted');
    }

    // Extension validation
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!validationRules.allowedExtensions.includes(fileExtension)) {
      errors.push(`File type '${fileExtension}' not allowed. Allowed: ${validationRules.allowedExtensions.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  };

  const uploadDocument = async (file, documentTypeId, category) => {
    const uploadId = Date.now().toString();
    
    try {
      // Initialize progress tracking
      setUploadProgress(prev => ({
        ...prev,
        [uploadId]: { progress: 0, status: 'uploading' }
      }));

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type_id', documentTypeId);
      formData.append('user_email', userEmail);

      // Upload with progress tracking
      const response = await fetch('/api/hospital/upload-registration-document/', {
        method: 'POST',
        body: formData,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(prev => ({
            ...prev,
            [uploadId]: { progress, status: 'uploading' }
          }));
        }
      });

      const result = await response.json();

      if (result.success) {
        // Update progress to complete
        setUploadProgress(prev => ({
          ...prev,
          [uploadId]: { progress: 100, status: 'completed' }
        }));

        // Add to uploaded documents
        const newDocument = {
          id: result.document_id || uploadId,
          name: file.name,
          size: file.size,
          type: result.upload_details.document_type,
          category: category,
          uploadDate: new Date(),
          status: 'uploaded',
          fileUrl: result.upload_details.file_url,
          validationSummary: result.upload_details.validation_summary || []
        };

        setUploadedDocuments(prev => [...prev, newDocument]);
        
        // Show success message
        addSuccessMessage(COMPONENT_CONFIG.validation_messages.upload_success);
        
        // Notify parent component
        if (onDocumentsChange) {
          onDocumentsChange([...uploadedDocuments, newDocument]);
        }

        // Clear progress after delay
        setTimeout(() => {
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[uploadId];
            return newProgress;
          });
        }, COMPONENT_CONFIG.ui_settings.upload_animation_duration);

      } else {
        setUploadProgress(prev => ({
          ...prev,
          [uploadId]: { progress: 0, status: 'error' }
        }));
        
        addError(result.error || COMPONENT_CONFIG.validation_messages.upload_error);
      }

    } catch (error) {
      console.error('Upload error:', error);
      setUploadProgress(prev => ({
        ...prev,
        [uploadId]: { progress: 0, status: 'error' }
      }));
      
      addError(COMPONENT_CONFIG.validation_messages.upload_error);
    }
  };

  const handleFileSelect = async (event, documentType, category) => {
    const files = Array.from(event.target.files);
    
    for (const file of files) {
      const validation = validateFile(file, documentType);
      
      if (validation.isValid) {
        await uploadDocument(file, documentType.id, category);
      } else {
        validation.errors.forEach(error => addError(error));
      }
    }
    
    // Clear file input
    event.target.value = '';
  };

  const addError = (message) => {
    setErrors(prev => [...prev, message]);
    setTimeout(() => {
      setErrors(prev => prev.filter(err => err !== message));
    }, COMPONENT_CONFIG.ui_settings.success_message_timeout);
  };

  const addSuccessMessage = (message) => {
    setSuccessMessages(prev => [...prev, message]);
    setTimeout(() => {
      setSuccessMessages(prev => prev.filter(msg => msg !== message));
    }, COMPONENT_CONFIG.ui_settings.success_message_timeout);
  };

  const removeDocument = (documentId) => {
    setUploadedDocuments(prev => prev.filter(doc => doc.id !== documentId));
    if (onDocumentsChange) {
      onDocumentsChange(uploadedDocuments.filter(doc => doc.id !== documentId));
    }
  };

  const openDocumentPreview = (document) => {
    setPreviewDocument(document);
    setShowPreviewModal(true);
  };

  const getUploadStatus = () => {
    const requiredCount = documentTypes.reduce((count, category) => 
      count + category.documents.filter(doc => doc.is_required).length, 0
    );
    const uploadedRequiredCount = uploadedDocuments.filter(doc => 
      documentTypes.some(cat => 
        cat.documents.some(type => type.name === doc.type && type.is_required)
      )
    ).length;

    return {
      requiredCount,
      uploadedRequiredCount,
      isComplete: uploadedRequiredCount >= Math.min(requiredCount, 3)
    };
  };

  const renderDocumentCategory = (category) => {
    const categoryConfig = COMPONENT_CONFIG.categories_config[category.name] || 
                          { color: 'primary', icon: '📄' };

    return (
      <Card key={category.name} className="mb-4 border-0 shadow-sm">
        <Card.Header className={`bg-${categoryConfig.color} text-white py-2`}>
          <h6 className="mb-0">
            <span className="me-2">{categoryConfig.icon}</span>
            {category.display_name}
          </h6>
          <small className="opacity-75">{category.description}</small>
        </Card.Header>
        <Card.Body className="p-3">
          <div className="row">
            {category.documents.map(documentType => (
              <div key={documentType.id} className="col-md-6 mb-3">
                <div className="border rounded p-3 h-100 position-relative">
                  {documentType.is_required && (
                    <Badge bg="danger" className="position-absolute top-0 end-0 m-2">
                      Required
                    </Badge>
                  )}
                  
                  <h6 className="fw-bold mb-2">{documentType.name}</h6>
                  <p className="text-muted small mb-3">{documentType.description}</p>
                  
                  {documentType.help_text && (
                    <Alert variant="info" className="py-2 small">
                      💡 {documentType.help_text}
                    </Alert>
                  )}
                  
                  <div className="mb-3">
                    <small className="text-muted">
                      📁 Max size: {documentType.file_size_limit_mb}MB<br/>
                      📎 Types: {documentType.allowed_extensions.join(', ')}
                    </small>
                  </div>

                  <Form.Group>
                    <Form.Label className="btn btn-outline-primary btn-sm w-100">
                      <FaUpload className="me-1" />
                      Choose Files
                      <Form.Control
                        type="file"
                        multiple
                        className="d-none"
                        accept={documentType.allowed_extensions.join(',')}
                        onChange={(e) => handleFileSelect(e, documentType, category.name)}
                      />
                    </Form.Label>
                  </Form.Group>
                </div>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>
    );
  };

  const renderUploadProgress = () => {
    const progressEntries = Object.entries(uploadProgress);
    
    if (progressEntries.length === 0) return null;

    return (
      <Card className="mb-4 border-warning">
        <Card.Header className="bg-warning text-dark py-2">
          <h6 className="mb-0">
            <FaSpinner className="me-2 fa-spin" />
            Upload Progress
          </h6>
        </Card.Header>
        <Card.Body className="p-3">
          {progressEntries.map(([uploadId, progress]) => (
            <div key={uploadId} className="mb-2">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <small>Uploading...</small>
                <small>{progress.progress}%</small>
              </div>
              <ProgressBar 
                now={progress.progress} 
                variant={progress.status === 'error' ? 'danger' : 'primary'}
                animated={progress.status === 'uploading'}
              />
            </div>
          ))}
        </Card.Body>
      </Card>
    );
  };

  const renderUploadedDocuments = () => {
    if (uploadedDocuments.length === 0) return null;

    return (
      <Card className="mb-4 border-success">
        <Card.Header className="bg-success text-white py-2">
          <h6 className="mb-0">
            <FaCheck className="me-2" />
            Uploaded Documents ({uploadedDocuments.length})
          </h6>
        </Card.Header>
        <Card.Body className="p-3">
          <ListGroup variant="flush">
            {uploadedDocuments.map(document => (
              <ListGroup.Item key={document.id} className="d-flex justify-content-between align-items-center px-0">
                <div className="flex-grow-1">
                  <div className="fw-bold">{document.name}</div>
                  <small className="text-muted">
                    {document.type} • {(document.size / (1024 * 1024)).toFixed(2)}MB
                    {document.validationSummary.length > 0 && (
                      <span className="text-warning ms-2">
                        ⚠️ {document.validationSummary.length} notes
                      </span>
                    )}
                  </small>
                </div>
                <div>
                  <Button
                    variant="outline-info"
                    size="sm"
                    className="me-2"
                    onClick={() => openDocumentPreview(document)}
                  >
                    <FaEye />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeDocument(document.id)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    );
  };

  const renderUploadStatus = () => {
    const status = getUploadStatus();
    
    return (
      <Alert variant={status.isComplete ? 'success' : 'warning'} className="mb-4">
        <div className="d-flex align-items-center">
          <div className="flex-grow-1">
            <strong>
              {status.isComplete ? 
                COMPONENT_CONFIG.validation_messages.all_docs_uploaded :
                COMPONENT_CONFIG.validation_messages.required_docs
              }
            </strong>
            <div className="small mt-1">
              Uploaded: {status.uploadedRequiredCount} / Required: {Math.min(status.requiredCount, 3)}
            </div>
          </div>
          <div>
            <ProgressBar 
              now={(status.uploadedRequiredCount / Math.min(status.requiredCount, 3)) * 100}
              style={{ width: '100px' }}
              variant={status.isComplete ? 'success' : 'warning'}
            />
          </div>
        </div>
      </Alert>
    );
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <FaSpinner className="fa-spin fa-2x text-primary mb-3" />
        <div>Loading document requirements...</div>
      </div>
    );
  }

  return (
    <div className="registration-document-upload">
      <div className="mb-4">
        <h4 className="fw-bold text-primary mb-2">
          📄 Document Upload
        </h4>
        <p className="text-muted">
          Please upload the required documents to complete your registration. 
          All documents will be securely stored and reviewed by our team.
        </p>
      </div>

      {/* Error Messages */}
      {errors.map((error, index) => (
        <Alert key={index} variant="danger" dismissible onClose={() => 
          setErrors(prev => prev.filter((_, i) => i !== index))
        }>
          {error}
        </Alert>
      ))}

      {/* Success Messages */}
      {successMessages.map((message, index) => (
        <Alert key={index} variant="success" dismissible onClose={() => 
          setSuccessMessages(prev => prev.filter((_, i) => i !== index))
        }>
          {message}
        </Alert>
      ))}

      {/* Upload Status */}
      {renderUploadStatus()}

      {/* Upload Progress */}
      {renderUploadProgress()}

      {/* Uploaded Documents */}
      {renderUploadedDocuments()}

      {/* Document Categories */}
      {documentTypes.map(category => renderDocumentCategory(category))}

      {/* Preview Modal */}
      <Modal show={showPreviewModal} onHide={() => setShowPreviewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Document Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {previewDocument && (
            <div>
              <h6>{previewDocument.name}</h6>
              <p>Type: {previewDocument.type}</p>
              <p>Size: {(previewDocument.size / (1024 * 1024)).toFixed(2)}MB</p>
              <p>Uploaded: {previewDocument.uploadDate.toLocaleDateString()}</p>
              {previewDocument.validationSummary.length > 0 && (
                <Alert variant="info">
                  <strong>Validation Notes:</strong>
                  <ul className="mb-0 mt-2">
                    {previewDocument.validationSummary.map((note, index) => (
                      <li key={index}>{note}</li>
                    ))}
                  </ul>
                </Alert>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreviewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RegistrationDocumentUpload;
