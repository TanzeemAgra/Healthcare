import React, { useState, useEffect } from 'react';
import UniversalCRUD from './UniversalCRUD';

const InsuranceCopilot = () => {
  const [insuranceData, setInsuranceData] = useState([]);

  useEffect(() => {
    const mockData = [
      {
        id: '1',
        patient_name: 'John Smith',
        policy_number: 'INS-123456789',
        insurance_provider: 'HealthCare Plus',
        policy_type: 'Premium',
        coverage_amount: '$100,000',
        deductible: '$500',
        copay: '$25',
        status: 'active',
        claim_id: 'CLM-2024-001',
        claim_amount: '$1,250',
        claim_status: 'approved',
        claim_date: '2024-01-20',
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-22T14:45:00Z',
        verification_status: 'verified',
        preauth_required: false
      },
      {
        id: '2',
        patient_name: 'Maria Garcia',
        policy_number: 'INS-987654321',
        insurance_provider: 'MediCare Solutions',
        policy_type: 'Standard',
        coverage_amount: '$75,000',
        deductible: '$1,000',
        copay: '$40',
        status: 'active',
        claim_id: 'CLM-2024-002',
        claim_amount: '$850',
        claim_status: 'pending',
        claim_date: '2024-01-22',
        created_at: '2024-01-10T09:15:00Z',
        updated_at: '2024-01-22T16:20:00Z',
        verification_status: 'pending',
        preauth_required: true
      }
    ];
    
    setInsuranceData(mockData);
  }, []);

  const columns = [
    {
      key: 'patient_name',
      label: 'Patient Name',
      sortable: true,
      editable: true,
      type: 'text',
      width: 6
    },
    {
      key: 'policy_number',
      label: 'Policy Number',
      sortable: true,
      editable: true,
      type: 'text',
      width: 6
    },
    {
      key: 'insurance_provider',
      label: 'Insurance Provider',
      sortable: true,
      editable: true,
      type: 'select',
      width: 6,
      options: [
        { value: 'HealthCare Plus', label: 'HealthCare Plus' },
        { value: 'MediCare Solutions', label: 'MediCare Solutions' },
        { value: 'United Health', label: 'United Health' },
        { value: 'Blue Cross', label: 'Blue Cross' },
        { value: 'Aetna', label: 'Aetna' }
      ]
    },
    {
      key: 'policy_type',
      label: 'Policy Type',
      sortable: true,
      editable: true,
      type: 'select',
      width: 6,
      options: [
        { value: 'Basic', label: 'Basic' },
        { value: 'Standard', label: 'Standard' },
        { value: 'Premium', label: 'Premium' },
        { value: 'Platinum', label: 'Platinum' }
      ]
    },
    {
      key: 'coverage_amount',
      label: 'Coverage Amount',
      sortable: true,
      editable: true,
      type: 'text',
      width: 6
    },
    {
      key: 'status',
      label: 'Policy Status',
      sortable: true,
      editable: true,
      type: 'select',
      width: 6,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'suspended', label: 'Suspended' },
        { value: 'expired', label: 'Expired' }
      ],
      render: (value) => (
        <span className={`badge bg-${
          value === 'active' ? 'success' : 
          value === 'inactive' ? 'secondary' : 
          value === 'suspended' ? 'warning' : 'danger'
        }`}>
          {value?.charAt(0).toUpperCase() + value?.slice(1)}
        </span>
      )
    },
    {
      key: 'claim_status',
      label: 'Claim Status',
      sortable: true,
      editable: true,
      type: 'select',
      width: 6,
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'approved', label: 'Approved' },
        { value: 'denied', label: 'Denied' },
        { value: 'under_review', label: 'Under Review' }
      ],
      render: (value) => (
        <span className={`badge bg-${
          value === 'approved' ? 'success' : 
          value === 'pending' ? 'warning' : 
          value === 'under_review' ? 'info' : 'danger'
        }`}>
          {value?.replace('_', ' ').split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')}
        </span>
      )
    }
  ];

  const handleDataChange = (newData) => {
    setInsuranceData(newData);
    console.log('Insurance data updated:', newData);
  };

  return (
    <div className="insurance-copilot">
      <div className="alert alert-info mb-4">
        <i className="ri-shield-check-line me-2"></i>
        <strong>Insurance Copilot:</strong> Comprehensive insurance management system with automated verification and claims processing.
      </div>

      <UniversalCRUD
        sectionKey="insurance"
        data={insuranceData}
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

export default InsuranceCopilot;
