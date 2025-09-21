import React, { useState, useEffect } from 'react';
import UniversalCRUD from './UniversalCRUD';

const ResearchReview = () => {
  const [researchData, setResearchData] = useState([]);

  useEffect(() => {
    const mockData = [
      {
        id: '1',
        title: 'Efficacy of Novel Cardiac Intervention Techniques',
        authors: 'Dr. Smith, Dr. Johnson, Dr. Williams',
        journal: 'Journal of Cardiology',
        publication_date: '2024-01-15',
        study_type: 'clinical_trial',
        status: 'under_review',
        relevance_score: 95,
        evidence_level: 'level_1',
        keywords: 'cardiology, intervention, clinical trial',
        abstract: 'This study examines the effectiveness of new minimally invasive cardiac intervention techniques...',
        findings: 'Significant improvement in patient outcomes with 95% success rate',
        recommendations: 'Recommend adoption of technique for eligible patients',
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-20T14:45:00Z',
        reviewed_by: 'Dr. Davis',
        implementation_status: 'pilot_program'
      },
      {
        id: '2',
        title: 'Meta-Analysis of Diabetes Management Protocols',
        authors: 'Dr. Garcia, Dr. Wilson, Dr. Chen',
        journal: 'Diabetes Research International',
        publication_date: '2024-01-10',
        study_type: 'meta_analysis',
        status: 'approved',
        relevance_score: 88,
        evidence_level: 'level_2',
        keywords: 'diabetes, management, protocol, meta-analysis',
        abstract: 'Comprehensive analysis of diabetes management protocols across multiple healthcare systems...',
        findings: 'Protocol standardization improves patient outcomes by 23%',
        recommendations: 'Implement standardized protocol across all departments',
        created_at: '2024-01-10T09:15:00Z',
        updated_at: '2024-01-18T16:20:00Z',
        reviewed_by: 'Dr. Johnson',
        implementation_status: 'implemented'
      }
    ];
    
    setResearchData(mockData);
  }, []);

  const columns = [
    {
      key: 'title',
      label: 'Research Title',
      sortable: true,
      editable: true,
      type: 'text',
      width: 12
    },
    {
      key: 'authors',
      label: 'Authors',
      sortable: true,
      editable: true,
      type: 'text',
      width: 6
    },
    {
      key: 'journal',
      label: 'Journal',
      sortable: true,
      editable: true,
      type: 'text',
      width: 6
    },
    {
      key: 'study_type',
      label: 'Study Type',
      sortable: true,
      editable: true,
      type: 'select',
      width: 6,
      options: [
        { value: 'clinical_trial', label: 'Clinical Trial' },
        { value: 'meta_analysis', label: 'Meta Analysis' },
        { value: 'systematic_review', label: 'Systematic Review' },
        { value: 'case_study', label: 'Case Study' },
        { value: 'observational', label: 'Observational' },
        { value: 'randomized_controlled', label: 'Randomized Controlled' }
      ]
    },
    {
      key: 'evidence_level',
      label: 'Evidence Level',
      sortable: true,
      editable: true,
      type: 'select',
      width: 6,
      options: [
        { value: 'level_1', label: 'Level 1 (Highest)' },
        { value: 'level_2', label: 'Level 2 (High)' },
        { value: 'level_3', label: 'Level 3 (Moderate)' },
        { value: 'level_4', label: 'Level 4 (Low)' },
        { value: 'level_5', label: 'Level 5 (Lowest)' }
      ],
      render: (value) => (
        <span className={`badge bg-${
          value === 'level_1' ? 'success' : 
          value === 'level_2' ? 'info' : 
          value === 'level_3' ? 'warning' : 'secondary'
        }`}>
          {value?.replace('_', ' ').toUpperCase()}
        </span>
      )
    },
    {
      key: 'relevance_score',
      label: 'Relevance Score',
      sortable: true,
      editable: true,
      type: 'number',
      width: 6,
      render: (value) => (
        <div className="d-flex align-items-center">
          <div className="progress me-2" style={{ width: '60px', height: '8px' }}>
            <div 
              className={`progress-bar ${
                value >= 90 ? 'bg-success' : 
                value >= 70 ? 'bg-warning' : 'bg-danger'
              }`}
              style={{ width: `${value}%` }}
            ></div>
          </div>
          <span className="small">{value}%</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Review Status',
      sortable: true,
      editable: true,
      type: 'select',
      width: 6,
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'under_review', label: 'Under Review' },
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' },
        { value: 'requires_revision', label: 'Requires Revision' }
      ],
      render: (value) => (
        <span className={`badge bg-${
          value === 'approved' ? 'success' : 
          value === 'under_review' ? 'info' : 
          value === 'pending' ? 'warning' : 
          value === 'requires_revision' ? 'warning' : 'danger'
        }`}>
          {value?.replace('_', ' ').split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')}
        </span>
      )
    },
    {
      key: 'implementation_status',
      label: 'Implementation',
      sortable: true,
      editable: true,
      type: 'select',
      width: 6,
      options: [
        { value: 'not_applicable', label: 'Not Applicable' },
        { value: 'planned', label: 'Planned' },
        { value: 'pilot_program', label: 'Pilot Program' },
        { value: 'implemented', label: 'Implemented' },
        { value: 'discontinued', label: 'Discontinued' }
      ],
      render: (value) => (
        <span className={`badge bg-${
          value === 'implemented' ? 'success' : 
          value === 'pilot_program' ? 'info' : 
          value === 'planned' ? 'warning' : 'secondary'
        }`}>
          {value?.replace('_', ' ').split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')}
        </span>
      )
    },
    {
      key: 'keywords',
      label: 'Keywords',
      sortable: false,
      editable: true,
      type: 'text',
      width: 12
    },
    {
      key: 'abstract',
      label: 'Abstract',
      sortable: false,
      editable: true,
      type: 'textarea',
      width: 12
    },
    {
      key: 'findings',
      label: 'Key Findings',
      sortable: false,
      editable: true,
      type: 'textarea',
      width: 12
    },
    {
      key: 'recommendations',
      label: 'Recommendations',
      sortable: false,
      editable: true,
      type: 'textarea',
      width: 12
    },
    {
      key: 'reviewed_by',
      label: 'Reviewed By',
      sortable: true,
      editable: true,
      type: 'select',
      width: 6,
      options: [
        { value: 'Dr. Smith', label: 'Dr. Smith' },
        { value: 'Dr. Johnson', label: 'Dr. Johnson' },
        { value: 'Dr. Williams', label: 'Dr. Williams' },
        { value: 'Dr. Davis', label: 'Dr. Davis' },
        { value: 'Dr. Wilson', label: 'Dr. Wilson' }
      ]
    }
  ];

  const handleDataChange = (newData) => {
    setResearchData(newData);
    console.log('Research data updated:', newData);
  };

  return (
    <div className="research-review">
      <div className="alert alert-danger mb-4">
        <i className="ri-microscope-line me-2"></i>
        <strong>Research Review System:</strong> Comprehensive medical research review and analysis platform for evidence-based medicine.
      </div>

      <UniversalCRUD
        sectionKey="research-review"
        data={researchData}
        columns={columns}
        onDataChange={handleDataChange}
        enableSearch={true}
        enablePagination={true}
        enableSorting={true}
        enableFiltering={true}
      />
    </div>
  );
};

export default ResearchReview;
