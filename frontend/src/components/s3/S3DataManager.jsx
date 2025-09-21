import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table, Alert, ProgressBar, Modal, Form, Tab, Nav, Dropdown, Spinner } from 'react-bootstrap';
import { S3_DATA_MANAGER_CONFIG, S3_OPERATIONS, S3_FILE_TYPES } from '../../config/s3DataManagerConfig';

const S3DataManager = ({ 
  onClose, 
  selectedBucket = 'genomics-data', 
  onBucketChange,
  config = S3_DATA_MANAGER_CONFIG,
  showBucketSelector = false,
  fullPageMode = false 
}) => {
  const [activeTab, setActiveTab] = useState('browser');
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentFolder, setCurrentFolder] = useState('/');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterType, setFilterType] = useState('all');

  // Get current bucket configuration
  const bucketConfig = config.buckets.find(b => b.id === selectedBucket) || config.buckets[0];
  const uiConfig = config.ui;

  // Demo data for S3 files
  useEffect(() => {
    loadDemoData();
  }, [selectedBucket, currentFolder]);

  const loadDemoData = () => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const demoFiles = generateDemoFiles(selectedBucket);
      const demoFolders = generateDemoFolders(selectedBucket);
      
      setFiles(demoFiles);
      setFolders(demoFolders);
      setLoading(false);
    }, 800);
  };

  const generateDemoFiles = (bucket) => {
    const demoFiles = [];

    if (bucket === 'genomics-data') {
      demoFiles.push(
        {
          id: 1,
          name: 'sample_001.fastq.gz',
          size: '2.3 GB',
          type: 'fastq',
          lastModified: '2025-09-01',
          url: '#',
          metadata: { patient: 'P001', sequencer: 'NovaSeq 6000', runs: 1 }
        },
        {
          id: 2,
          name: 'sample_002.fastq.gz',
          size: '2.1 GB',
          type: 'fastq',
          lastModified: '2025-09-01',
          url: '#',
          metadata: { patient: 'P002', sequencer: 'NovaSeq 6000', runs: 1 }
        },
        {
          id: 3,
          name: 'reference_genome.fasta',
          size: '3.2 GB',
          type: 'fasta',
          lastModified: '2025-08-30',
          url: '#',
          metadata: { version: 'hg38', source: 'NCBI' }
        }
      );
    } else if (bucket === 'genomics-results') {
      demoFiles.push(
        {
          id: 1,
          name: 'aligned_reads.bam',
          size: '1.8 GB',
          type: 'bam',
          lastModified: '2025-09-02',
          url: '#',
          metadata: { reference: 'hg38', aligner: 'BWA-MEM' }
        },
        {
          id: 2,
          name: 'variants.vcf.gz',
          size: '45 MB',
          type: 'vcf',
          lastModified: '2025-09-03',
          url: '#',
          metadata: { caller: 'GATK', variants: 4892367 }
        },
        {
          id: 3,
          name: 'analysis_report.pdf',
          size: '2.5 MB',
          type: 'pdf',
          lastModified: '2025-09-03',
          url: '#',
          metadata: { samples: 10, variants: 4892367 }
        }
      );
    } else if (bucket === 'genomics-models') {
      demoFiles.push(
        {
          id: 1,
          name: 'deepvariant_model_v2.pb',
          size: '1.2 GB',
          type: 'model',
          lastModified: '2025-08-15',
          url: '#',
          metadata: { version: 'v2.0', accuracy: '99.7%' }
        },
        {
          id: 2,
          name: 'gatk_cnn_model.h5',
          size: '850 MB',
          type: 'model',
          lastModified: '2025-08-20',
          url: '#',
          metadata: { framework: 'TensorFlow', type: 'CNN' }
        }
      );
    } else if (bucket === 'genomics-backup') {
      demoFiles.push(
        {
          id: 1,
          name: 'backup_2025_08.tar.gz',
          size: '15.3 GB',
          type: 'archive',
          lastModified: '2025-08-31',
          url: '#',
          metadata: { type: 'monthly', compression: 'gzip' }
        }
      );
    } else if (bucket === 'medical-records') {
      demoFiles.push(
        {
          id: 1,
          name: 'patient_001_medical_record.pdf',
          size: '2.3 MB',
          type: 'medical-record',
          lastModified: '2025-09-01',
          url: '#',
          metadata: { patientId: 'P001', recordType: 'complete', encrypted: true }
        },
        {
          id: 2,
          name: 'discharge_summary_P002.pdf',
          size: '1.1 MB',
          type: 'medical-record',
          lastModified: '2025-09-02',
          url: '#',
          metadata: { patientId: 'P002', recordType: 'discharge', encrypted: true }
        },
        {
          id: 3,
          name: 'consultation_notes_P003.docx',
          size: '890 KB',
          type: 'medical-record',
          lastModified: '2025-09-03',
          url: '#',
          metadata: { patientId: 'P003', recordType: 'consultation', encrypted: true }
        }
      );
    } else if (bucket === 'diagnostic-images') {
      demoFiles.push(
        {
          id: 1,
          name: 'chest_xray_P001.dcm',
          size: '45 MB',
          type: 'dicom',
          lastModified: '2025-09-01',
          url: '#',
          metadata: { patientId: 'P001', studyType: 'chest X-ray', modality: 'CR' }
        },
        {
          id: 2,
          name: 'brain_mri_P002.dcm',
          size: '128 MB',
          type: 'dicom',
          lastModified: '2025-09-02',
          url: '#',
          metadata: { patientId: 'P002', studyType: 'brain MRI', modality: 'MR' }
        },
        {
          id: 3,
          name: 'ct_scan_abdomen_P003.dcm',
          size: '89 MB',
          type: 'dicom',
          lastModified: '2025-08-30',
          url: '#',
          metadata: { patientId: 'P003', studyType: 'CT abdomen', modality: 'CT' }
        }
      );
    } else if (bucket === 'lab-results') {
      demoFiles.push(
        {
          id: 1,
          name: 'blood_test_P001.pdf',
          size: '1.2 MB',
          type: 'lab-report',
          lastModified: '2025-09-01',
          url: '#',
          metadata: { patientId: 'P001', testType: 'complete blood count', status: 'final' }
        },
        {
          id: 2,
          name: 'lipid_panel_P002.hl7',
          size: '45 KB',
          type: 'hl7',
          lastModified: '2025-09-02',
          url: '#',
          metadata: { patientId: 'P002', testType: 'lipid panel', status: 'final' }
        },
        {
          id: 3,
          name: 'urinalysis_P003.json',
          size: '12 KB',
          type: 'lab-data',
          lastModified: '2025-09-03',
          url: '#',
          metadata: { patientId: 'P003', testType: 'urinalysis', status: 'preliminary' }
        }
      );
    } else if (bucket === 'drug-database') {
      demoFiles.push(
        {
          id: 1,
          name: 'drug_interactions_db.json',
          size: '15 MB',
          type: 'database',
          lastModified: '2025-08-15',
          url: '#',
          metadata: { version: '2025.3', drugs: 12543, interactions: 45678 }
        },
        {
          id: 2,
          name: 'medication_monographs.xml',
          size: '32 MB',
          type: 'reference',
          lastModified: '2025-08-20',
          url: '#',
          metadata: { version: '2025.3', medications: 8945 }
        }
      );
    } else if (bucket === 'ai-models') {
      demoFiles.push(
        {
          id: 1,
          name: 'diagnosis_model_v3.h5',
          size: '2.1 GB',
          type: 'ai-model',
          lastModified: '2025-08-10',
          url: '#',
          metadata: { version: 'v3.0', accuracy: '94.2%', specialty: 'general medicine' }
        },
        {
          id: 2,
          name: 'drug_recommendation_model.pt',
          size: '1.8 GB',
          type: 'ai-model',
          lastModified: '2025-08-25',
          url: '#',
          metadata: { version: 'v2.1', framework: 'PyTorch', specialty: 'pharmacology' }
        }
      );
    } else if (bucket === 'research-data') {
      demoFiles.push(
        {
          id: 1,
          name: 'clinical_trial_data_anonymized.csv',
          size: '125 MB',
          type: 'research',
          lastModified: '2025-07-15',
          url: '#',
          metadata: { studyId: 'CT2025-001', subjects: 2500, anonymized: true }
        },
        {
          id: 2,
          name: 'population_health_study.xlsx',
          size: '78 MB',
          type: 'research',
          lastModified: '2025-08-01',
          url: '#',
          metadata: { studyId: 'PH2025-002', subjects: 15000, anonymized: true }
        }
      );
    } else if (bucket === 'exam-content') {
      demoFiles.push(
        {
          id: 1,
          name: 'mcq_internal_medicine_2025.json',
          size: '2.8 MB',
          type: 'mcq-bank',
          lastModified: '2025-09-01',
          url: '#',
          metadata: { questionCount: 500, difficulty: 'mixed', subject: 'internal medicine' }
        },
        {
          id: 2,
          name: 'osce_cardiology_scenarios.pdf',
          size: '4.2 MB',
          type: 'osce-scenario',
          lastModified: '2025-08-30',
          url: '#',
          metadata: { scenarios: 25, duration: '15 mins each', specialty: 'cardiology' }
        },
        {
          id: 3,
          name: 'neet_pg_practice_set_v3.xml',
          size: '1.9 MB',
          type: 'exam-content',
          lastModified: '2025-09-02',
          url: '#',
          metadata: { questions: 300, examType: 'NEET-PG', version: 'v3.0' }
        }
      );
    } else if (bucket === 'student-data') {
      demoFiles.push(
        {
          id: 1,
          name: 'student_progress_batch2025.csv',
          size: '15.4 MB',
          type: 'analytics',
          lastModified: '2025-09-03',
          url: '#',
          metadata: { students: 1250, anonymized: true, batchYear: 2025 }
        },
        {
          id: 2,
          name: 'learning_analytics_report.json',
          size: '8.7 MB',
          type: 'report',
          lastModified: '2025-09-02',
          url: '#',
          metadata: { period: 'August 2025', metrics: 'engagement, performance, retention' }
        },
        {
          id: 3,
          name: 'exam_performance_summary.xlsx',
          size: '3.2 MB',
          type: 'performance',
          lastModified: '2025-09-01',
          url: '#',
          metadata: { examsPeriod: 'Q3 2025', subjects: 12, anonymized: true }
        }
      );
    } else if (bucket === 'ai-models') {
      demoFiles.push(
        {
          id: 1,
          name: 'dr_max_bot_v4.h5',
          size: '3.2 GB',
          type: 'ai-model',
          lastModified: '2025-08-25',
          url: '#',
          metadata: { version: 'v4.0', accuracy: '96.8%', specialty: 'general medicine' }
        },
        {
          id: 2,
          name: 'adaptive_learning_engine.pt',
          size: '1.8 GB',
          type: 'ai-model',
          lastModified: '2025-08-20',
          url: '#',
          metadata: { version: 'v2.3', framework: 'PyTorch', purpose: 'personalized learning' }
        },
        {
          id: 3,
          name: 'question_difficulty_predictor.pkl',
          size: '245 MB',
          type: 'ml-model',
          lastModified: '2025-08-15',
          url: '#',
          metadata: { version: 'v1.5', accuracy: '89.4%', purpose: 'difficulty assessment' }
        }
      );
    } else if (bucket === 'multimedia-content') {
      demoFiles.push(
        {
          id: 1,
          name: 'anatomy_3d_heart_model.mp4',
          size: '234 MB',
          type: 'video',
          lastModified: '2025-08-28',
          url: '#',
          metadata: { duration: '12:45', resolution: '4K', subject: 'anatomy' }
        },
        {
          id: 2,
          name: 'ecg_interpretation_tutorial.webm',
          size: '89 MB',
          type: 'video',
          lastModified: '2025-08-30',
          url: '#',
          metadata: { duration: '8:30', resolution: '1080p', subject: 'cardiology' }
        },
        {
          id: 3,
          name: 'pathology_slides_collection.zip',
          size: '156 MB',
          type: 'images',
          lastModified: '2025-09-01',
          url: '#',
          metadata: { images: 450, resolution: 'high', subject: 'pathology' }
        }
      );
    } else if (bucket === 'assessment-data') {
      demoFiles.push(
        {
          id: 1,
          name: 'mock_exam_results_sept2025.json',
          size: '12.3 MB',
          type: 'results',
          lastModified: '2025-09-03',
          url: '#',
          metadata: { examDate: '2025-09-03', participants: 890, subjects: 8 }
        },
        {
          id: 2,
          name: 'performance_analytics_dashboard.csv',
          size: '5.6 MB',
          type: 'analytics',
          lastModified: '2025-09-02',
          url: '#',
          metadata: { period: 'August 2025', metrics: 'comprehensive', anonymized: true }
        }
      );
    } else if (bucket === 'system-backups') {
      demoFiles.push(
        {
          id: 1,
          name: 'platform_backup_20250901.tar.gz',
          size: '2.3 GB',
          type: 'backup',
          lastModified: '2025-09-01',
          url: '#',
          metadata: { backupType: 'full', compression: 'gzip', verified: true }
        },
        {
          id: 2,
          name: 'database_backup_incremental.sql',
          size: '456 MB',
          type: 'database',
          lastModified: '2025-09-03',
          url: '#',
          metadata: { backupType: 'incremental', tables: 45, verified: true }
        }
      );
    }

    return demoFiles;
  };

  const generateDemoFolders = (bucket) => {
    if (bucket === 'genomics-data') {
      return [
        { name: 'raw_sequencing', fileCount: 15, size: '45.2 GB', lastModified: '2025-09-01' },
        { name: 'reference_genomes', fileCount: 3, size: '8.9 GB', lastModified: '2025-08-25' },
        { name: 'quality_control', fileCount: 12, size: '3.2 GB', lastModified: '2025-09-02' }
      ];
    } else if (bucket === 'genomics-results') {
      return [
        { name: 'variant_calls', fileCount: 23, size: '856 MB', lastModified: '2025-09-03' },
        { name: 'alignments', fileCount: 12, size: '18.1 GB', lastModified: '2025-09-02' },
        { name: 'reports', fileCount: 8, size: '45 MB', lastModified: '2025-09-03' }
      ];
    } else if (bucket === 'genomics-models') {
      return [
        { name: 'deepvariant', fileCount: 5, size: '2.1 GB', lastModified: '2025-08-15' },
        { name: 'gatk_models', fileCount: 8, size: '1.8 GB', lastModified: '2025-08-20' }
      ];
    } else if (bucket === 'genomics-backup') {
      return [
        { name: 'monthly_backups', fileCount: 12, size: '180 GB', lastModified: '2025-08-31' },
        { name: 'archived_projects', fileCount: 45, size: '520 GB', lastModified: '2025-07-30' }
      ];
    } else if (bucket === 'medical-records') {
      return [
        { name: 'current_patients', fileCount: 245, size: '1.2 GB', lastModified: '2025-09-03' },
        { name: 'archived_records', fileCount: 1850, size: '8.9 GB', lastModified: '2025-08-30' },
        { name: 'discharge_summaries', fileCount: 156, size: '890 MB', lastModified: '2025-09-02' }
      ];
    } else if (bucket === 'diagnostic-images') {
      return [
        { name: 'radiology', fileCount: 1250, size: '45.2 GB', lastModified: '2025-09-03' },
        { name: 'cardiology', fileCount: 89, size: '12.1 GB', lastModified: '2025-09-01' },
        { name: 'orthopedics', fileCount: 234, size: '8.7 GB', lastModified: '2025-09-02' }
      ];
    } else if (bucket === 'lab-results') {
      return [
        { name: 'hematology', fileCount: 456, size: '234 MB', lastModified: '2025-09-03' },
        { name: 'chemistry', fileCount: 789, size: '567 MB', lastModified: '2025-09-02' },
        { name: 'microbiology', fileCount: 123, size: '89 MB', lastModified: '2025-09-01' }
      ];
    } else if (bucket === 'drug-database') {
      return [
        { name: 'interactions', fileCount: 45, size: '234 MB', lastModified: '2025-08-20' },
        { name: 'monographs', fileCount: 8945, size: '1.2 GB', lastModified: '2025-08-15' }
      ];
    } else if (bucket === 'ai-models') {
      return [
        { name: 'diagnosis_models', fileCount: 12, size: '15.2 GB', lastModified: '2025-08-25' },
        { name: 'treatment_models', fileCount: 8, size: '9.1 GB', lastModified: '2025-08-20' }
      ];
    } else if (bucket === 'research-data') {
      return [
        { name: 'clinical_trials', fileCount: 25, size: '2.1 GB', lastModified: '2025-08-01' },
        { name: 'population_studies', fileCount: 15, size: '1.8 GB', lastModified: '2025-07-15' }
      ];
    } else if (bucket === 'exam-content') {
      return [
        { name: 'mcq_banks', fileCount: 45, size: '890 MB', lastModified: '2025-09-02' },
        { name: 'osce_scenarios', fileCount: 156, size: '1.2 GB', lastModified: '2025-09-01' },
        { name: 'practice_tests', fileCount: 78, size: '567 MB', lastModified: '2025-09-03' }
      ];
    } else if (bucket === 'student-data') {
      return [
        { name: 'performance_data', fileCount: 1250, size: '45.6 MB', lastModified: '2025-09-03' },
        { name: 'learning_analytics', fileCount: 890, size: '23.4 MB', lastModified: '2025-09-02' },
        { name: 'progress_reports', fileCount: 567, size: '34.5 MB', lastModified: '2025-09-01' }
      ];
    } else if (bucket === 'multimedia-content') {
      return [
        { name: 'educational_videos', fileCount: 234, size: '12.1 GB', lastModified: '2025-09-01' },
        { name: 'interactive_content', fileCount: 89, size: '3.4 GB', lastModified: '2025-08-30' },
        { name: 'animations', fileCount: 156, size: '5.6 GB', lastModified: '2025-09-02' }
      ];
    } else if (bucket === 'assessment-data') {
      return [
        { name: 'exam_results', fileCount: 890, size: '78.9 MB', lastModified: '2025-09-03' },
        { name: 'feedback_reports', fileCount: 456, size: '23.4 MB', lastModified: '2025-09-02' },
        { name: 'analytics_reports', fileCount: 123, size: '45.6 MB', lastModified: '2025-09-01' }
      ];
    } else if (bucket === 'system-backups') {
      return [
        { name: 'daily_backups', fileCount: 30, size: '45.2 GB', lastModified: '2025-09-03' },
        { name: 'weekly_backups', fileCount: 12, size: '156 GB', lastModified: '2025-08-30' },
        { name: 'monthly_archives', fileCount: 6, size: '890 GB', lastModified: '2025-08-31' }
      ];
    }
    return [];
  };

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    
    uploadedFiles.forEach((file, index) => {
      const fileId = Date.now() + index;
      
      // Initialize progress tracking
      setUploadProgress(prev => ({
        ...prev,
        [fileId]: { progress: 0, status: 'uploading', fileName: file.name }
      }));

      // Simulate upload progress
      simulateUpload(fileId, file);
    });
  };

  const simulateUpload = (fileId, file) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setUploadProgress(prev => ({
          ...prev,
          [fileId]: { ...prev[fileId], progress: 100, status: 'completed' }
        }));

        // Add file to list after upload
        setTimeout(() => {
          const newFile = {
            id: fileId,
            name: file.name,
            size: formatFileSize(file.size),
            type: getFileType(file.name),
            lastModified: new Date().toISOString().split('T')[0],
            url: '#',
            metadata: { uploaded: 'just now' }
          };
          
          setFiles(prev => [newFile, ...prev]);
          
          // Remove from progress tracking
          setUploadProgress(prev => {
            const updated = { ...prev };
            delete updated[fileId];
            return updated;
          });
        }, 1000);
      } else {
        setUploadProgress(prev => ({
          ...prev,
          [fileId]: { ...prev[fileId], progress: Math.min(progress, 100) }
        }));
      }
    }, 200);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileType = (fileName) => {
    const extension = fileName.toLowerCase().split('.').pop();
    const allTypes = { ...S3_FILE_TYPES.genomics, ...S3_FILE_TYPES.results, ...S3_FILE_TYPES.models };
    
    for (const [typeKey, typeConfig] of Object.entries(allTypes)) {
      if (typeConfig.extensions.some(ext => ext.includes(extension))) {
        return typeKey;
      }
    }
    return 'unknown';
  };

  const getFileIcon = (fileType) => {
    const allTypes = { ...S3_FILE_TYPES.genomics, ...S3_FILE_TYPES.results, ...S3_FILE_TYPES.models };
    return allTypes[fileType]?.icon || 'ri-file-line';
  };

  const getFileColor = (fileType) => {
    const allTypes = { ...S3_FILE_TYPES.genomics, ...S3_FILE_TYPES.results, ...S3_FILE_TYPES.models };
    return allTypes[fileType]?.color || 'secondary';
  };

  const handleFileSelect = (fileId) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleBulkDelete = () => {
    if (selectedFiles.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedFiles.length} selected files?`)) {
      setFiles(prev => prev.filter(file => !selectedFiles.includes(file.id)));
      setSelectedFiles([]);
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || file.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === 'size') {
      const sizeA = parseFloat(a.size.split(' ')[0]);
      const sizeB = parseFloat(b.size.split(' ')[0]);
      comparison = sizeA - sizeB;
    } else if (sortBy === 'date') {
      comparison = new Date(a.lastModified) - new Date(b.lastModified);
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return (
    <>
      {!fullPageMode ? (
        <Modal show={true} onHide={onClose} size="xl" fullscreen>
          <Modal.Header closeButton style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <Modal.Title>
              <i className="ri-cloud-fill me-2"></i>
              S3 Data Manager - {bucketConfig.name}
            </Modal.Title>
          </Modal.Header>
          
          <Modal.Body className="p-0">
            {renderS3Content()}
          </Modal.Body>
        </Modal>
      ) : (
        renderS3Content()
      )}
    </>
  );

  function renderS3Content() {
    return (
      <>
        {/* Header Controls */}
        <div className="bg-light p-3 border-bottom">
          <Row className="align-items-center">
            {showBucketSelector && (
              <Col md={3}>
                <Form.Select 
                  value={selectedBucket} 
                  onChange={(e) => onBucketChange && onBucketChange(e.target.value)}
                  className="border-0"
                >
                  {config.buckets.map(bucket => (
                    <option key={bucket.id} value={bucket.id}>
                      {bucket.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            )}
            
            <Col md={showBucketSelector ? 3 : 4}>
              <Form.Control
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0"
              />
            </Col>
            
            <Col md={4}>
              <div className="d-flex gap-2">
                <Form.Select
                  size="sm"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  {Object.keys(S3_FILE_TYPES[selectedBucket] || {}).map(type => (
                    <option key={type} value={type}>{type.toUpperCase()}</option>
                  ))}
                </Form.Select>
                
                <Dropdown>
                  <Dropdown.Toggle size="sm" variant="outline-secondary">
                    <i className="ri-sort-desc me-1"></i>Sort
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => {setSortBy('name'); setSortOrder('asc');}}>Name A-Z</Dropdown.Item>
                    <Dropdown.Item onClick={() => {setSortBy('name'); setSortOrder('desc');}}>Name Z-A</Dropdown.Item>
                    <Dropdown.Item onClick={() => {setSortBy('date'); setSortOrder('desc');}}>Newest First</Dropdown.Item>
                    <Dropdown.Item onClick={() => {setSortBy('date'); setSortOrder('asc');}}>Oldest First</Dropdown.Item>
                    <Dropdown.Item onClick={() => {setSortBy('size'); setSortOrder('desc');}}>Largest First</Dropdown.Item>
                    <Dropdown.Item onClick={() => {setSortBy('size'); setSortOrder('asc');}}>Smallest First</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Col>
            
            <Col md={4} className="text-end">
              <Button variant="outline-primary" size="sm" className="me-2" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
                <i className={`ri-${viewMode === 'grid' ? 'list' : 'grid'}-line me-1`}></i>
                {viewMode === 'grid' ? 'List' : 'Grid'}
              </Button>
              
              <Button variant="primary" size="sm" onClick={() => setShowUploadModal(true)}>
                <i className="ri-upload-line me-1"></i>Upload
              </Button>
              
              {selectedFiles.length > 0 && (
                <Button variant="danger" size="sm" className="ms-2" onClick={handleBulkDelete}>
                  <i className="ri-delete-bin-line me-1"></i>Delete ({selectedFiles.length})
                </Button>
              )}
            </Col>
          </Row>
        </div>

        {/* Breadcrumb */}
        <div className="p-2 bg-white border-bottom">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <i className={`${bucketConfig.icon} me-1`}></i>
                {bucketConfig.displayName}
              </li>
              {currentFolder !== '/' && (
                <li className="breadcrumb-item active">
                  {currentFolder.replace('/', '')}
                </li>
              )}
            </ol>
          </nav>
        </div>

        {/* Upload Progress */}
        {Object.keys(uploadProgress).length > 0 && (
          <div className="p-3 bg-info bg-opacity-10 border-bottom">
            <h6 className="mb-3">Upload Progress</h6>
            {Object.entries(uploadProgress).map(([fileId, progress]) => (
              <div key={fileId} className="mb-2">
                <div className="d-flex justify-content-between">
                  <small>{progress.fileName}</small>
                  <small>{Math.round(progress.progress)}%</small>
                </div>
                <ProgressBar 
                  now={progress.progress} 
                  variant={progress.status === 'completed' ? 'success' : 'primary'}
                  style={{ height: '4px' }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Main Content */}
        <div className="p-3" style={{ minHeight: '500px', maxHeight: '600px', overflowY: 'auto' }}>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" className="me-2" />
              Loading files...
            </div>
          ) : (
            <>
              {/* Folders */}
              {folders.length > 0 && (
                <div className="mb-4">
                  <h6 className="text-muted mb-3">Folders</h6>
                  <Row>
                    {folders.map((folder, index) => (
                      <Col md={viewMode === 'grid' ? 3 : 12} key={index} className="mb-3">
                        <Card className="h-100 border-0 bg-light cursor-pointer" style={{ cursor: 'pointer' }}>
                          <Card.Body className="text-center">
                            <i className="ri-folder-line text-warning mb-2" style={{ fontSize: '2rem' }}></i>
                            <h6 className="mb-1">{folder.name}</h6>
                            <small className="text-muted">{folder.fileCount} files • {folder.size}</small>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}

              {/* Files */}
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="text-muted mb-0">Files ({sortedFiles.length})</h6>
                  {selectedFiles.length > 0 && (
                    <Badge bg="primary">{selectedFiles.length} selected</Badge>
                  )}
                </div>

                {viewMode === 'grid' ? (
                  <Row>
                    {sortedFiles.map((file) => (
                      <Col md={3} key={file.id} className="mb-3">
                        <Card 
                          className={`h-100 cursor-pointer ${selectedFiles.includes(file.id) ? 'border-primary' : ''}`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleFileSelect(file.id)}
                        >
                          <Card.Body className="text-center">
                            <i 
                              className={`${getFileIcon(file.type)} text-${getFileColor(file.type)} mb-2`}
                              style={{ fontSize: '2rem' }}
                            ></i>
                            <h6 className="mb-1 small">{file.name}</h6>
                            <small className="text-muted d-block">{file.size}</small>
                            <small className="text-muted">{file.lastModified}</small>
                            
                            {selectedFiles.includes(file.id) && (
                              <div className="position-absolute top-0 end-0 p-2">
                                <i className="ri-check-circle-fill text-primary"></i>
                              </div>
                            )}
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <Table hover responsive className="border-0">
                    <thead className="bg-light">
                      <tr>
                        <th width="30">
                          <Form.Check 
                            type="checkbox"
                            checked={selectedFiles.length === sortedFiles.length && sortedFiles.length > 0}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedFiles(sortedFiles.map(f => f.id));
                              } else {
                                setSelectedFiles([]);
                              }
                            }}
                          />
                        </th>
                        <th>Name</th>
                        <th>Size</th>
                        <th>Type</th>
                        <th>Last Modified</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedFiles.map((file) => (
                        <tr key={file.id}>
                          <td>
                            <Form.Check 
                              type="checkbox"
                              checked={selectedFiles.includes(file.id)}
                              onChange={() => handleFileSelect(file.id)}
                            />
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <i className={`${getFileIcon(file.type)} text-${getFileColor(file.type)} me-2`}></i>
                              {file.name}
                            </div>
                          </td>
                          <td>{file.size}</td>
                          <td>
                            <Badge bg={getFileColor(file.type)}>{file.type.toUpperCase()}</Badge>
                          </td>
                          <td>{file.lastModified}</td>
                          <td>
                            <Button variant="outline-primary" size="sm" className="me-1">
                              <i className="ri-download-line"></i>
                            </Button>
                            <Button variant="outline-danger" size="sm">
                              <i className="ri-delete-bin-line"></i>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}

                {sortedFiles.length === 0 && !loading && (
                  <div className="text-center py-5">
                    <i className="ri-folder-open-line text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                    <h6 className="text-muted">No files found</h6>
                    <p className="text-muted">Upload files or adjust your search criteria</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        
        {/* Upload Modal */}
        <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Upload Files to {bucketConfig.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Select Files</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={handleFileUpload}
              />
              <Form.Text className="text-muted">
                Select files to upload to {bucketConfig.name}
              </Form.Text>
            </Form.Group>
            
            <Alert variant="info" className="small">
              <i className="ri-information-line me-1"></i>
              <strong>{bucketConfig.description}</strong>
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
};

export default S3DataManager;
