import React, { useState, useEffect } from 'react';
import UniversalCRUD from './UniversalCRUD';

const ContractRedlining = () => {
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const mockContracts = [
      {
        id: '1',
        name: 'Medical Equipment Lease Agreement',
        type: 'Equipment Lease',
        status: 'under_review',
        contract_value: '$50,000',
        parties: 'Hospital ABC, MedEquip Corp',
        key_terms: 'Monthly lease payment, maintenance included, 3-year term',
        redlines: 2,
        priority: 'high',
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-20T14:45:00Z',
        review_deadline: '2024-02-15',
        assigned_to: 'Legal Team A',
        risk_level: 'medium'
      },
      {
        id: '2',
        name: 'Physician Employment Contract',
        type: 'Employment',
        status: 'pending_signature',
        contract_value: '$180,000/year',
        parties: 'Dr. Sarah Johnson, Metropolitan Hospital',
        key_terms: 'Base salary, benefits package, non-compete clause',
        redlines: 5,
        priority: 'high',
        created_at: '2024-01-10T09:15:00Z',
        updated_at: '2024-01-22T16:20:00Z',
        review_deadline: '2024-02-10',
        assigned_to: 'HR Legal',
        risk_level: 'low'
      },
      {
        id: '3',
        name: 'Pharmaceutical Supply Agreement',
        type: 'Supply Chain',
        status: 'draft',
        contract_value: '$2,500,000',
        parties: 'Regional Medical Center, PharmaCorp Inc',
        key_terms: 'Bulk pricing, delivery schedule, quality standards',
        redlines: 0,
        priority: 'critical',
        created_at: '2024-01-22T11:00:00Z',
        updated_at: '2024-01-22T11:00:00Z',
        review_deadline: '2024-02-01',
        assigned_to: 'Procurement Legal',
        risk_level: 'high'
      }
    ];
    
    setContracts(mockContracts);
  }, []);

  const columns = [
    {
      key: 'name',
      label: 'Contract Name',
      sortable: true,
      editable: true,
      type: 'text',
      width: 12
    },
    {
      key: 'type',
      label: 'Contract Type',
      sortable: true,
      editable: true,
      type: 'select',
      width: 6,
      options: [
        { value: 'Equipment Lease', label: 'Equipment Lease' },
        { value: 'Employment', label: 'Employment' },
        { value: 'Supply Chain', label: 'Supply Chain' },
        { value: 'Service Agreement', label: 'Service Agreement' },
        { value: 'Partnership', label: 'Partnership' },
        { value: 'Insurance', label: 'Insurance' }
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
        { value: 'under_review', label: 'Under Review' },
        { value: 'pending_signature', label: 'Pending Signature' },
        { value: 'executed', label: 'Executed' },
        { value: 'expired', label: 'Expired' },
        { value: 'terminated', label: 'Terminated' }
      ],
      render: (value) => (
        <span className={`badge bg-${
          value === 'executed' ? 'success' : 
          value === 'under_review' ? 'info' : 
          value === 'pending_signature' ? 'warning' : 
          value === 'draft' ? 'secondary' : 'danger'
        }`}>
          {value?.replace('_', ' ').split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')}
        </span>
      )
    },
    {
      key: 'contract_value',
      label: 'Contract Value',
      sortable: true,
      editable: true,
      type: 'text',
      width: 6
    },
    {
      key: 'parties',
      label: 'Parties Involved',
      sortable: false,
      editable: true,
      type: 'textarea',
      width: 12
    },
    {
      key: 'key_terms',
      label: 'Key Terms',
      sortable: false,
      editable: true,
      type: 'textarea',
      width: 12
    },
    {
      key: 'redlines',
      label: 'Redlines',
      sortable: true,
      editable: true,
      type: 'number',
      width: 6,
      render: (value) => (
        <span className={`badge ${
          value === 0 ? 'bg-success' : 
          value <= 2 ? 'bg-warning' : 'bg-danger'
        }`}>
          {value} Redlines
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
      key: 'risk_level',
      label: 'Risk Level',
      sortable: true,
      editable: true,
      type: 'select',
      width: 6,
      options: [
        { value: 'low', label: 'Low Risk' },
        { value: 'medium', label: 'Medium Risk' },
        { value: 'high', label: 'High Risk' },
        { value: 'critical', label: 'Critical Risk' }
      ],
      render: (value) => (
        <span className={`badge bg-${
          value === 'critical' ? 'danger' : 
          value === 'high' ? 'warning' : 
          value === 'medium' ? 'info' : 'success'
        }`}>
          {value?.charAt(0).toUpperCase() + value?.slice(1)} Risk
        </span>
      )
    },
    {
      key: 'assigned_to',
      label: 'Assigned To',
      sortable: true,
      editable: true,
      type: 'select',
      width: 6,
      options: [
        { value: 'Legal Team A', label: 'Legal Team A' },
        { value: 'Legal Team B', label: 'Legal Team B' },
        { value: 'HR Legal', label: 'HR Legal' },
        { value: 'Procurement Legal', label: 'Procurement Legal' },
        { value: 'External Counsel', label: 'External Counsel' }
      ]
    },
    {
      key: 'review_deadline',
      label: 'Review Deadline',
      sortable: true,
      editable: true,
      type: 'date',
      width: 6,
      render: (value) => {
        const deadline = new Date(value);
        const today = new Date();
        const isOverdue = deadline < today;
        const daysUntil = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
        
        return (
          <span className={`badge ${isOverdue ? 'bg-danger' : daysUntil <= 7 ? 'bg-warning' : 'bg-success'}`}>
            {isOverdue ? 'Overdue' : daysUntil <= 0 ? 'Due Today' : `${daysUntil} days`}
          </span>
        );
      }
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
      label: 'Last Updated',
      sortable: true,
      editable: false,
      render: (value) => new Date(value).toLocaleDateString()
    }
  ];

  const handleDataChange = (newData) => {
    setContracts(newData);
    console.log('Contract data updated:', newData);
  };

  const customActions = [
    {
      label: 'Generate Redlines',
      icon: 'ri-file-edit-line',
      action: (item) => {
        console.log('Generating redlines for:', item.name);
        // AI redlining logic would go here
      }
    },
    {
      label: 'Risk Analysis',
      icon: 'ri-shield-check-line',
      action: (item) => {
        console.log('Analyzing risk for:', item.name);
        // Risk analysis logic would go here
      }
    }
  ];

  return (
    <div className="contract-redlining">
      <div className="row mb-4">
        <div className="col-12">
          <div className="alert alert-warning">
            <i className="ri-contract-line me-2"></i>
            <strong>Contract Redlining System:</strong> AI-powered contract review and redlining tool. 
            Automatically identify potential issues, suggest modifications, and track review progress.
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-info">{contracts.filter(c => c.status === 'under_review').length}</h3>
              <p className="mb-0">Under Review</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-warning">{contracts.filter(c => c.status === 'pending_signature').length}</h3>
              <p className="mb-0">Pending Signature</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-danger">{contracts.filter(c => c.risk_level === 'high').length}</h3>
              <p className="mb-0">High Risk</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-success">{contracts.reduce((sum, c) => sum + (c.redlines || 0), 0)}</h3>
              <p className="mb-0">Total Redlines</p>
            </div>
          </div>
        </div>
      </div>

      <UniversalCRUD
        sectionKey="contracts"
        data={contracts}
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

export default ContractRedlining;
