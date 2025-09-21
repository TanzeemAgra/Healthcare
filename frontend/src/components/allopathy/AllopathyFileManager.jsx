import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Modal, Badge, Alert, Spinner, InputGroup, Row, Col, ProgressBar } from 'react-bootstrap';
import { Upload, Download, Eye, Trash2, FileText, Image, FileAudio, Video, Archive, Search, Filter } from 'lucide-react';
import axios from 'axios';

const AllopathyFileManager = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadData, setUploadData] = useState({
    hospital: '',
    patient: '',
    description: ''
  });

  const fileTypeIcons = {
    'image': <Image size={20} className="text-primary" />,
    'video': <Video size={20} className="text-info" />,
    'audio': <FileAudio size={20} className="text-warning" />,
    'document': <FileText size={20} className="text-secondary" />,
    'archive': <Archive size={20} className="text-dark" />
  };

  const getFileTypeIcon = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) return fileTypeIcons.image;
    if (['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(extension)) return fileTypeIcons.video;
    if (['mp3', 'wav', 'flac', 'aac'].includes(extension)) return fileTypeIcons.audio;
    if (['zip', 'rar', '7z', 'tar'].includes(extension)) return fileTypeIcons.archive;
    return fileTypeIcons.document;
  };

  const getStatusBadge = (status) => {
    const variants = {
      'pending': 'warning',
      'uploaded': 'success',
      'processing': 'info',
      'analyzed': 'primary',
      'error': 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get('/api/allopathy/files/');
      setFiles(response.data.results || response.data);
    } catch (err) {
      setError('Failed to fetch files');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setError('Please select files to upload');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('hospital', uploadData.hospital);
        formData.append('patient', uploadData.patient);
        formData.append('description', uploadData.description);

        await axios.post('/api/allopathy/files/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              ((i * 100 + (progressEvent.loaded * 100) / progressEvent.total) / selectedFiles.length)
            );
            setUploadProgress(progress);
          }
        });
      }

      setSuccess(`Successfully uploaded ${selectedFiles.length} file(s)`);
      setShowUploadModal(false);
      setSelectedFiles([]);
      setUploadData({ hospital: '', patient: '', description: '' });
      fetchFiles();
    } catch (err) {
      setError('Failed to upload files');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDownload = async (fileId, filename) => {
    try {
      const response = await axios.get(`/api/allopathy/files/${fileId}/download/`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download file');
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;

    try {
      await axios.delete(`/api/allopathy/files/${fileId}/`);
      setSuccess('File deleted successfully');
      fetchFiles();
    } catch (err) {
      setError('Failed to delete file');
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || file.file_type === filterType;
    return matchesSearch && matchesType;
  });

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading files...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <Row className="mb-4">
        <Col>
          <h2 className="mb-0">Allopathy File Manager</h2>
          <p className="text-muted">Manage medical files and documents with AI-powered analysis</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => setShowUploadModal(true)}>
            <Upload size={20} className="me-2" />
            Upload Files
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Search and Filter Controls */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text><Search size={20} /></InputGroup.Text>
                <Form.Control
                  placeholder="Search files by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <InputGroup>
                <InputGroup.Text><Filter size={20} /></InputGroup.Text>
                <Form.Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="xray">X-Ray</option>
                  <option value="mri">MRI</option>
                  <option value="ct_scan">CT Scan</option>
                  <option value="ultrasound">Ultrasound</option>
                  <option value="lab_report">Lab Report</option>
                  <option value="prescription">Prescription</option>
                  <option value="medical_report">Medical Report</option>
                  <option value="other">Other</option>
                </Form.Select>
              </InputGroup>
            </Col>
            <Col md={3}>
              <div className="text-muted">
                Showing {filteredFiles.length} of {files.length} files
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Files Table */}
      <Card>
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>File</th>
                <th>Type</th>
                <th>Size</th>
                <th>Hospital</th>
                <th>Patient</th>
                <th>Status</th>
                <th>Uploaded</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map(file => (
                <tr key={file.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      {getFileTypeIcon(file.filename)}
                      <div className="ms-2">
                        <div className="fw-bold">{file.filename}</div>
                        {file.description && (
                          <small className="text-muted">{file.description}</small>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge bg="outline-secondary">{file.file_type}</Badge>
                  </td>
                  <td>{formatFileSize(file.file_size)}</td>
                  <td>{file.hospital_name || file.hospital}</td>
                  <td>{file.patient_name || file.patient}</td>
                  <td>{getStatusBadge(file.status)}</td>
                  <td>
                    <small className="text-muted">
                      {new Date(file.created_at).toLocaleDateString()}
                    </small>
                  </td>
                  <td>
                    <div className="btn-group" role="group">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleDownload(file.id, file.filename)}
                        title="Download"
                      >
                        <Download size={16} />
                      </Button>
                      <Button
                        variant="outline-info"
                        size="sm"
                        title="Preview"
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(file.id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredFiles.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    <div className="text-muted">
                      {searchTerm || filterType ? 'No files match your criteria' : 'No files uploaded yet'}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Upload Modal */}
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Upload Medical Files</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleFileUpload}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hospital *</Form.Label>
                  <Form.Control
                    type="text"
                    value={uploadData.hospital}
                    onChange={(e) => setUploadData({...uploadData, hospital: e.target.value})}
                    required
                    placeholder="Enter hospital name or ID"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Patient *</Form.Label>
                  <Form.Control
                    type="text"
                    value={uploadData.patient}
                    onChange={(e) => setUploadData({...uploadData, patient: e.target.value})}
                    required
                    placeholder="Enter patient name or ID"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={uploadData.description}
                onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
                placeholder="Brief description of the files..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Select Files *</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
                required
              />
              <Form.Text className="text-muted">
                Supported formats: JPEG, PNG, PDF, DICOM, MP4. Max size: 100MB per file.
              </Form.Text>
            </Form.Group>

            {selectedFiles.length > 0 && (
              <div className="mb-3">
                <h6>Selected Files ({selectedFiles.length}):</h6>
                <ul className="list-unstyled">
                  {Array.from(selectedFiles).map((file, index) => (
                    <li key={index} className="d-flex justify-content-between align-items-center py-1">
                      <span>{file.name}</span>
                      <small className="text-muted">{formatFileSize(file.size)}</small>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {uploading && (
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Upload Progress</span>
                  <span>{uploadProgress}%</span>
                </div>
                <ProgressBar now={uploadProgress} />
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowUploadModal(false)} disabled={uploading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Files'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AllopathyFileManager;
