import React, { useState, useEffect } from 'react';
import UniversalCRUD from './UniversalCRUD';

const BackOfficeAutomation = () => {
  const [automationData, setAutomationData] = useState([]);

  useEffect(() => {
    const mockData = [
      {
        id: '1',
        process_name: 'Patient Registration Automation',
        category: 'patient_management',
        status: 'active',
        automation_type: 'workflow',
        trigger: 'new_patient_form_submission',
        actions: 'Create patient record, send welcome email, schedule initial consultation',
        frequency: 'real_time',
        success_rate: 98.5,
        last_execution: '2024-01-22T14:30:00Z',
        next_execution: null,
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-22T14:30:00Z',
        created_by: 'System Admin',
        execution_count: 156,
        error_count: 2
      },
      {
        id: '2',
        process_name: 'Insurance Verification Batch',
        category: 'billing',
        status: 'active',
        automation_type: 'scheduled',
        trigger: 'daily_3am_schedule',
        actions: 'Verify insurance eligibility, update patient records, flag issues',
        frequency: 'daily',
        success_rate: 94.2,
        last_execution: '2024-01-22T03:00:00Z',
        next_execution: '2024-01-23T03:00:00Z',
        created_at: '2024-01-10T09:15:00Z',
        updated_at: '2024-01-22T03:05:00Z',
        created_by: 'Finance Team',
        execution_count: 12,
        error_count: 1
      }
    ];
    
    setAutomationData(mockData);
  }, []);

  const columns = [
    {
      key: 'process_name',
      label: 'Process Name',
      sortable: true,
      editable: true,
      type: 'text',
      width: 8
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      editable: true,
      type: 'select',
      width: 4,
      options: [
        { value: 'patient_management', label: 'Patient Management' },
        { value: 'billing', label: 'Billing' },
        { value: 'scheduling', label: 'Scheduling' },
        { value: 'inventory', label: 'Inventory' },
        { value: 'reporting', label: 'Reporting' },
        { value: 'compliance', label: 'Compliance' }
      ]
    },
    {
      key: 'automation_type',
      label: 'Type',
      sortable: true,
      editable: true,
      type: 'select',
      width: 6,
      options: [
        { value: 'workflow', label: 'Workflow' },
        { value: 'scheduled', label: 'Scheduled' },
        { value: 'event_driven', label: 'Event Driven' },
        { value: 'api_triggered', label: 'API Triggered' }
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
        { value: 'active', label: 'Active' },
        { value: 'paused', label: 'Paused' },
        { value: 'error', label: 'Error' },
        { value: 'disabled', label: 'Disabled' }
      ],
      render: (value) => (
        <span className={`badge bg-${
          value === 'active' ? 'success' : 
          value === 'paused' ? 'warning' : 
          value === 'error' ? 'danger' : 'secondary'
        }`}>
          {value?.charAt(0).toUpperCase() + value?.slice(1)}
        </span>
      )
    },
    {
      key: 'success_rate',
      label: 'Success Rate',
      sortable: true,
      editable: true,
      type: 'number',
      width: 6,
      render: (value) => (
        <div className="d-flex align-items-center">
          <div className="progress me-2" style={{ width: '60px', height: '8px' }}>
            <div 
              className={`progress-bar ${
                value >= 95 ? 'bg-success' : 
                value >= 85 ? 'bg-warning' : 'bg-danger'
              }`}
              style={{ width: `${value}%` }}
            ></div>
          </div>
          <span className="small">{value}%</span>
        </div>
      )
    },
    {
      key: 'frequency',
      label: 'Frequency',
      sortable: true,
      editable: true,
      type: 'select',
      width: 6,
      options: [
        { value: 'real_time', label: 'Real Time' },
        { value: 'hourly', label: 'Hourly' },
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' }
      ]
    },
    {
      key: 'trigger',
      label: 'Trigger',
      sortable: false,
      editable: true,
      type: 'text',
      width: 12
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      editable: true,
      type: 'textarea',
      width: 12
    },
    {
      key: 'execution_count',
      label: 'Executions',
      sortable: true,
      editable: false,
      type: 'number',
      width: 6
    },
    {
      key: 'error_count',
      label: 'Errors',
      sortable: true,
      editable: false,
      type: 'number',
      width: 6,
      render: (value, item) => (
        <span className={`badge ${value > 0 ? 'bg-warning' : 'bg-success'}`}>
          {value} / {item.execution_count}
        </span>
      )
    },
    {
      key: 'last_execution',
      label: 'Last Run',
      sortable: true,
      editable: false,
      render: (value) => value ? new Date(value).toLocaleString() : 'Never'
    },
    {
      key: 'next_execution',
      label: 'Next Run',
      sortable: true,
      editable: false,
      render: (value) => value ? new Date(value).toLocaleString() : 'On Demand'
    }
  ];

  const handleDataChange = (newData) => {
    setAutomationData(newData);
    console.log('Automation data updated:', newData);
  };

  return (
    <div className="back-office-automation">
      <div className="alert alert-primary mb-4">
        <i className="ri-settings-line me-2"></i>
        <strong>Back Office Automation:</strong> Automated workflow management system for streamlined healthcare operations.
      </div>

      <UniversalCRUD
        sectionKey="automation"
        data={automationData}
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

export default BackOfficeAutomation;
