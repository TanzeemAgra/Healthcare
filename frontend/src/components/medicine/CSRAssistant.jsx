import React, { useState, useEffect } from 'react';
import UniversalCRUD from './UniversalCRUD';

const CSRAssistant = () => {
  const [csrData, setCSRData] = useState([]);

  useEffect(() => {
    const mockData = [
      {
        id: '1',
        ticket_id: 'CSR-2024-001',
        customer_name: 'John Smith',
        contact_method: 'phone',
        inquiry_type: 'appointment_scheduling',
        priority: 'medium',
        status: 'open',
        subject: 'Appointment Rescheduling Request',
        description: 'Patient wants to reschedule appointment from Jan 25 to Jan 30',
        assigned_agent: 'Sarah Johnson',
        resolution: '',
        created_at: '2024-01-22T10:30:00Z',
        updated_at: '2024-01-22T10:30:00Z',
        response_time: null,
        satisfaction_score: null
      },
      {
        id: '2',
        ticket_id: 'CSR-2024-002',
        customer_name: 'Maria Garcia',
        contact_method: 'email',
        inquiry_type: 'billing_inquiry',
        priority: 'high',
        status: 'resolved',
        subject: 'Insurance Coverage Question',
        description: 'Patient inquiring about coverage for upcoming procedure',
        assigned_agent: 'Mike Davis',
        resolution: 'Provided detailed coverage information and pre-authorization requirements',
        created_at: '2024-01-21T14:15:00Z',
        updated_at: '2024-01-22T09:45:00Z',
        response_time: 45,
        satisfaction_score: 4.5
      }
    ];
    
    setCSRData(mockData);
  }, []);

  const columns = [
    {
      key: 'ticket_id',
      label: 'Ticket ID',
      sortable: true,
      editable: false,
      type: 'text',
      width: 6
    },
    {
      key: 'customer_name',
      label: 'Customer Name',
      sortable: true,
      editable: true,
      type: 'text',
      width: 6
    },
    {
      key: 'inquiry_type',
      label: 'Inquiry Type',
      sortable: true,
      editable: true,
      type: 'select',
      width: 6,
      options: [
        { value: 'appointment_scheduling', label: 'Appointment Scheduling' },
        { value: 'billing_inquiry', label: 'Billing Inquiry' },
        { value: 'insurance_question', label: 'Insurance Question' },
        { value: 'medical_records', label: 'Medical Records' },
        { value: 'prescription_refill', label: 'Prescription Refill' },
        { value: 'complaint', label: 'Complaint' },
        { value: 'general_inquiry', label: 'General Inquiry' }
      ]
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
        { value: 'open', label: 'Open' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'pending_customer', label: 'Pending Customer' },
        { value: 'resolved', label: 'Resolved' },
        { value: 'closed', label: 'Closed' }
      ],
      render: (value) => (
        <span className={`badge bg-${
          value === 'resolved' ? 'success' : 
          value === 'closed' ? 'secondary' : 
          value === 'in_progress' ? 'info' : 
          value === 'pending_customer' ? 'warning' : 'danger'
        }`}>
          {value?.replace('_', ' ').split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')}
        </span>
      )
    },
    {
      key: 'subject',
      label: 'Subject',
      sortable: true,
      editable: true,
      type: 'text',
      width: 12
    },
    {
      key: 'description',
      label: 'Description',
      sortable: false,
      editable: true,
      type: 'textarea',
      width: 12
    },
    {
      key: 'assigned_agent',
      label: 'Assigned Agent',
      sortable: true,
      editable: true,
      type: 'select',
      width: 6,
      options: [
        { value: 'Sarah Johnson', label: 'Sarah Johnson' },
        { value: 'Mike Davis', label: 'Mike Davis' },
        { value: 'Lisa Wilson', label: 'Lisa Wilson' },
        { value: 'Tom Brown', label: 'Tom Brown' },
        { value: 'Amy Chen', label: 'Amy Chen' }
      ]
    },
    {
      key: 'resolution',
      label: 'Resolution',
      sortable: false,
      editable: true,
      type: 'textarea',
      width: 12
    },
    {
      key: 'response_time',
      label: 'Response Time (min)',
      sortable: true,
      editable: true,
      type: 'number',
      width: 6,
      render: (value) => value ? `${value} min` : 'Pending'
    },
    {
      key: 'satisfaction_score',
      label: 'Satisfaction Score',
      sortable: true,
      editable: true,
      type: 'number',
      width: 6,
      render: (value) => value ? (
        <div className="d-flex align-items-center">
          <span className="me-2">{value}/5</span>
          <div className="progress" style={{ width: '60px', height: '8px' }}>
            <div 
              className={`progress-bar ${
                value >= 4 ? 'bg-success' : 
                value >= 3 ? 'bg-warning' : 'bg-danger'
              }`}
              style={{ width: `${(value / 5) * 100}%` }}
            ></div>
          </div>
        </div>
      ) : 'Not Rated'
    }
  ];

  const handleDataChange = (newData) => {
    setCSRData(newData);
    console.log('CSR data updated:', newData);
  };

  return (
    <div className="csr-assistant">
      <div className="alert alert-warning mb-4">
        <i className="ri-customer-service-line me-2"></i>
        <strong>CSR Assistant:</strong> Customer service representative tools for efficient patient support and inquiry management.
      </div>

      <UniversalCRUD
        sectionKey="csr-assistant"
        data={csrData}
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

export default CSRAssistant;
