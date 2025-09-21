import React, { useState, useEffect } from 'react';
import UniversalCRUD from './UniversalCRUD';

const ProtocolSummarizer = () => {
  const [protocols, setProtocols] = useState([]);

  // Mock data with realistic medical protocols
  useEffect(() => {
    const mockProtocols = [
      {
        id: '1',
        title: 'Emergency Cardiac Protocol',
        category: 'Emergency',
        content: 'Standard protocol for cardiac emergency situations including assessment, intervention, and monitoring procedures.',
        status: 'active',
        priority: 'high',
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-20T14:45:00Z',
        created_by: 'Dr. Smith',
        version: '2.1',
        compliance_level: 'FDA Approved'
      },
      {
        id: '2',
        title: 'Post-Operative Care Protocol',
        category: 'Surgery',
        content: 'Comprehensive post-operative care guidelines including pain management, wound care, and recovery monitoring.',
        status: 'active',
        priority: 'medium',
        created_at: '2024-01-10T09:15:00Z',
        updated_at: '2024-01-18T16:20:00Z',
        created_by: 'Dr. Johnson',
        version: '1.8',
        compliance_level: 'Hospital Standard'
      },
      {
        id: '3',
        title: 'Medication Administration Protocol',
        category: 'Pharmacy',
        content: 'Safe medication administration procedures including verification, dosage calculation, and adverse reaction monitoring.',
        status: 'draft',
        priority: 'high',
        created_at: '2024-01-22T11:00:00Z',
        updated_at: '2024-01-22T11:00:00Z',
        created_by: 'Dr. Williams',
        version: '1.0',
        compliance_level: 'Under Review'
      }
    ];
    
    setProtocols(mockProtocols);
  }, []);

  const columns = [
    {
      key: 'title',
      label: 'Protocol Title',
      sortable: true,
      editable: true,
      type: 'text',
      width: 12
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      editable: true,
      type: 'select',
      width: 6,
      options: [
        { value: 'Emergency', label: 'Emergency' },
        { value: 'Surgery', label: 'Surgery' },
        { value: 'Pharmacy', label: 'Pharmacy' },
        { value: 'Outpatient', label: 'Outpatient' },
        { value: 'ICU', label: 'ICU' }
      ]
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      editable: true,
      type: 'select',
      width: 6,
      options: [
        { value: 'draft', label: 'Draft' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'archived', label: 'Archived' }
      ],
      render: (value) => (
        <span className={`badge bg-${
          value === 'active' ? 'success' : 
          value === 'draft' ? 'warning' : 
          value === 'inactive' ? 'secondary' : 'dark'
        }`}>
          {value?.charAt(0).toUpperCase() + value?.slice(1)}
        </span>
      )
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
        { value: 'critical', label: 'Critical' }
      ],
      render: (value) => (
        <span className={`badge bg-${
          value === 'critical' ? 'danger' : 
          value === 'high' ? 'warning' : 
          value === 'medium' ? 'info' : 'secondary'
        }`}>
          {value?.charAt(0).toUpperCase() + value?.slice(1)}
        </span>
      )
    },
    {
      key: 'content',
      label: 'Content',
      sortable: false,
      editable: true,
      type: 'textarea',
      width: 12
    },
    {
      key: 'version',
      label: 'Version',
      sortable: true,
      editable: true,
      type: 'text',
      width: 6
    },
    {
      key: 'compliance_level',
      label: 'Compliance',
      sortable: true,
      editable: true,
      type: 'select',
      width: 6,
      options: [
        { value: 'FDA Approved', label: 'FDA Approved' },
        { value: 'Hospital Standard', label: 'Hospital Standard' },
        { value: 'Under Review', label: 'Under Review' },
        { value: 'Pending Approval', label: 'Pending Approval' }
      ]
    },
    {
      key: 'created_by',
      label: 'Created By',
      sortable: true,
      editable: true,
      type: 'text',
      width: 6
    },
    {
      key: 'created_at',
      label: 'Created',
      sortable: true,
      editable: false,
      render: (value) => new Date(value).toLocaleDateString()
    },
    {
      key: 'updated_at',
      label: 'Updated',
      sortable: true,
      editable: false,
      render: (value) => new Date(value).toLocaleDateString()
    }
  ];

  const handleDataChange = (newData) => {
    setProtocols(newData);
    console.log('Protocol data updated:', newData);
  };

  return (
    <div className="protocol-summarizer">
      <div className="row mb-4">
        <div className="col-12">
          <div className="alert alert-info">
            <i className="ri-information-line me-2"></i>
            <strong>Protocol Summarizer:</strong> AI-powered medical protocol management system. 
            Create, edit, and maintain medical protocols with automated summarization capabilities.
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-primary">{protocols.filter(p => p.status === 'active').length}</h3>
              <p className="mb-0">Active Protocols</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-warning">{protocols.filter(p => p.status === 'draft').length}</h3>
              <p className="mb-0">Draft Protocols</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-danger">{protocols.filter(p => p.priority === 'high').length}</h3>
              <p className="mb-0">High Priority</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-success">{protocols.length}</h3>
              <p className="mb-0">Total Protocols</p>
            </div>
          </div>
        </div>
      </div>

      <UniversalCRUD
        sectionKey="protocols"
        data={protocols}
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

export default ProtocolSummarizer;
