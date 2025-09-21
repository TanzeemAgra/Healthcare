import React, { useState, useEffect } from 'react';
import UniversalCRUD from './UniversalCRUD';

const ClinicalSearch = () => {
  const [searchData, setSearchData] = useState([]);

  useEffect(() => {
    const mockData = [
      {
        id: '1',
        search_query: 'chest pain cardiac enzymes',
        patient_id: 'PT001',
        patient_name: 'John Smith',
        search_type: 'clinical_history',
        results_found: 15,
        relevant_results: 12,
        search_date: '2024-01-22T14:30:00Z',
        searched_by: 'Dr. Williams',
        categories: 'cardiology, laboratory, emergency',
        date_range: '2023-01-01 to 2024-01-22',
        priority: 'high',
        status: 'completed',
        execution_time: 1.2,
        confidence_score: 94
      },
      {
        id: '2',
        search_query: 'diabetes medication history metformin',
        patient_id: 'PT002',
        patient_name: 'Maria Garcia',
        search_type: 'medication_history',
        results_found: 8,
        relevant_results: 8,
        search_date: '2024-01-22T10:15:00Z',
        searched_by: 'Dr. Johnson',
        categories: 'endocrinology, pharmacy',
        date_range: '2022-01-01 to 2024-01-22',
        priority: 'medium',
        status: 'completed',
        execution_time: 0.8,
        confidence_score: 98
      }
    ];
    
    setSearchData(mockData);
  }, []);

  const columns = [
    {
      key: 'search_query',
      label: 'Search Query',
      sortable: true,
      editable: true,
      type: 'text',
      width: 8
    },
    {
      key: 'patient_name',
      label: 'Patient',
      sortable: true,
      editable: true,
      type: 'text',
      width: 4
    },
    {
      key: 'search_type',
      label: 'Search Type',
      sortable: true,
      editable: true,
      type: 'select',
      width: 6,
      options: [
        { value: 'clinical_history', label: 'Clinical History' },
        { value: 'medication_history', label: 'Medication History' },
        { value: 'laboratory_results', label: 'Laboratory Results' },
        { value: 'imaging_studies', label: 'Imaging Studies' },
        { value: 'procedure_history', label: 'Procedure History' },
        { value: 'comprehensive', label: 'Comprehensive' }
      ]
    },
    {
      key: 'results_found',
      label: 'Results Found',
      sortable: true,
      editable: false,
      type: 'number',
      width: 3
    },
    {
      key: 'relevant_results',
      label: 'Relevant',
      sortable: true,
      editable: false,
      type: 'number',
      width: 3,
      render: (value, item) => (
        <span className={`badge ${
          value === item.results_found ? 'bg-success' : 
          value / item.results_found >= 0.8 ? 'bg-info' : 'bg-warning'
        }`}>
          {value} / {item.results_found}
        </span>
      )
    },
    {
      key: 'confidence_score',
      label: 'Confidence',
      sortable: true,
      editable: false,
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
      key: 'execution_time',
      label: 'Execution Time',
      sortable: true,
      editable: false,
      type: 'number',
      width: 6,
      render: (value) => `${value}s`
    },
    {
      key: 'searched_by',
      label: 'Searched By',
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
    },
    {
      key: 'categories',
      label: 'Categories',
      sortable: false,
      editable: true,
      type: 'text',
      width: 12
    },
    {
      key: 'date_range',
      label: 'Date Range',
      sortable: false,
      editable: true,
      type: 'text',
      width: 6
    },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      editable: true,
      type: 'select',
      width: 6,
      options: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' }
      ],
      render: (value) => (
        <span className={`badge bg-${
          value === 'urgent' ? 'danger' : 
          value === 'high' ? 'warning' : 
          value === 'medium' ? 'info' : 'secondary'
        }`}>
          {value?.charAt(0).toUpperCase() + value?.slice(1)}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      editable: true,
      type: 'select',
      width: 6,
      options: [
        { value: 'running', label: 'Running' },
        { value: 'completed', label: 'Completed' },
        { value: 'failed', label: 'Failed' },
        { value: 'cancelled', label: 'Cancelled' }
      ],
      render: (value) => (
        <span className={`badge bg-${
          value === 'completed' ? 'success' : 
          value === 'running' ? 'info' : 
          value === 'failed' ? 'danger' : 'secondary'
        }`}>
          {value?.charAt(0).toUpperCase() + value?.slice(1)}
        </span>
      )
    },
    {
      key: 'search_date',
      label: 'Search Date',
      sortable: true,
      editable: false,
      render: (value) => new Date(value).toLocaleString()
    }
  ];

  const handleDataChange = (newData) => {
    setSearchData(newData);
    console.log('Clinical search data updated:', newData);
  };

  const customActions = [
    {
      label: 'View Results',
      icon: 'ri-eye-line',
      action: (item) => {
        console.log('Viewing search results for:', item.search_query);
        // View results logic
      }
    },
    {
      label: 'Export Results',
      icon: 'ri-download-line',
      action: (item) => {
        console.log('Exporting results for:', item.search_query);
        // Export logic
      }
    }
  ];

  return (
    <div className="clinical-search">
      <div className="alert alert-success mb-4">
        <i className="ri-search-line me-2"></i>
        <strong>Clinical Search Engine:</strong> Advanced clinical history search with AI-powered relevance scoring and comprehensive data retrieval.
      </div>

      <UniversalCRUD
        sectionKey="clinical-search"
        data={searchData}
        columns={columns}
        onDataChange={handleDataChange}
        customActions={customActions}
        enableSearch={true}
        enablePagination={true}
        enableSorting={true}
        enableFiltering={true}
      />
    </div>
  );
};

export default ClinicalSearch;
