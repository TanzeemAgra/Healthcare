import React, { useState, useEffect } from 'react';
import UniversalCRUD from './UniversalCRUD';

const BookingAssistant = () => {
  const [bookings, setBookings] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  useEffect(() => {
    const mockBookings = [
      {
        id: '1',
        patient_name: 'Alice Johnson',
        patient_phone: '+1-555-0123',
        appointment_type: 'General Consultation',
        preferred_date: '2024-01-25',
        preferred_time: '10:00 AM',
        assigned_physician: 'Dr. Smith',
        status: 'confirmed',
        priority: 'medium',
        booking_source: 'ai_assistant',
        symptoms: 'Regular checkup, blood pressure concerns',
        insurance_verified: true,
        created_at: '2024-01-22T09:30:00Z',
        updated_at: '2024-01-22T10:15:00Z',
        confirmation_sent: true,
        reminder_scheduled: true,
        estimated_duration: 30
      },
      {
        id: '2',
        patient_name: 'Michael Chen',
        patient_phone: '+1-555-0124',
        appointment_type: 'Emergency Consultation',
        preferred_date: '2024-01-23',
        preferred_time: '2:00 PM',
        assigned_physician: 'Dr. Williams',
        status: 'pending',
        priority: 'urgent',
        booking_source: 'phone_call',
        symptoms: 'Severe chest pain, difficulty breathing',
        insurance_verified: false,
        created_at: '2024-01-22T14:45:00Z',
        updated_at: '2024-01-22T14:45:00Z',
        confirmation_sent: false,
        reminder_scheduled: false,
        estimated_duration: 45
      },
      {
        id: '3',
        patient_name: 'Sarah Davis',
        patient_phone: '+1-555-0125',
        appointment_type: 'Follow-up',
        preferred_date: '2024-01-26',
        preferred_time: '11:30 AM',
        assigned_physician: 'Dr. Johnson',
        status: 'rescheduled',
        priority: 'low',
        booking_source: 'online_portal',
        symptoms: 'Post-surgery follow-up, wound check',
        insurance_verified: true,
        created_at: '2024-01-20T16:20:00Z',
        updated_at: '2024-01-22T11:30:00Z',
        confirmation_sent: true,
        reminder_scheduled: true,
        estimated_duration: 20
      }
    ];
    
    setBookings(mockBookings);

    // Mock upcoming appointments for dashboard
    const upcoming = [
      { time: '9:00 AM', patient: 'John Smith', type: 'Consultation' },
      { time: '10:30 AM', patient: 'Emma Wilson', type: 'Check-up' },
      { time: '2:00 PM', patient: 'Michael Chen', type: 'Emergency' },
      { time: '3:30 PM', patient: 'Lisa Anderson', type: 'Follow-up' }
    ];
    setUpcomingAppointments(upcoming);
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
      key: 'patient_phone',
      label: 'Phone Number',
      sortable: true,
      editable: true,
      type: 'tel',
      width: 6
    },
    {
      key: 'appointment_type',
      label: 'Appointment Type',
      sortable: true,
      editable: true,
      type: 'select',
      width: 6,
      options: [
        { value: 'General Consultation', label: 'General Consultation' },
        { value: 'Emergency Consultation', label: 'Emergency Consultation' },
        { value: 'Follow-up', label: 'Follow-up' },
        { value: 'Specialist Referral', label: 'Specialist Referral' },
        { value: 'Routine Check-up', label: 'Routine Check-up' },
        { value: 'Vaccination', label: 'Vaccination' },
        { value: 'Laboratory Test', label: 'Laboratory Test' }
      ]
    },
    {
      key: 'preferred_date',
      label: 'Preferred Date',
      sortable: true,
      editable: true,
      type: 'date',
      width: 6,
      render: (value) => new Date(value).toLocaleDateString()
    },
    {
      key: 'preferred_time',
      label: 'Preferred Time',
      sortable: true,
      editable: true,
      type: 'time',
      width: 6
    },
    {
      key: 'assigned_physician',
      label: 'Assigned Physician',
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
      key: 'status',
      label: 'Status',
      sortable: true,
      editable: true,
      type: 'select',
      width: 6,
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'rescheduled', label: 'Rescheduled' },
        { value: 'cancelled', label: 'Cancelled' },
        { value: 'completed', label: 'Completed' },
        { value: 'no_show', label: 'No Show' }
      ],
      render: (value) => (
        <span className={`badge bg-${
          value === 'confirmed' ? 'success' : 
          value === 'pending' ? 'warning' : 
          value === 'rescheduled' ? 'info' : 
          value === 'completed' ? 'primary' : 'danger'
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
      key: 'booking_source',
      label: 'Booking Source',
      sortable: true,
      editable: true,
      type: 'select',
      width: 6,
      options: [
        { value: 'ai_assistant', label: 'AI Assistant' },
        { value: 'online_portal', label: 'Online Portal' },
        { value: 'phone_call', label: 'Phone Call' },
        { value: 'walk_in', label: 'Walk-in' },
        { value: 'referral', label: 'Referral' }
      ],
      render: (value) => (
        <span className={`badge ${
          value === 'ai_assistant' ? 'bg-primary' : 
          value === 'online_portal' ? 'bg-success' : 
          value === 'phone_call' ? 'bg-info' : 'bg-secondary'
        }`}>
          {value?.replace('_', ' ').split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')}
        </span>
      )
    },
    {
      key: 'symptoms',
      label: 'Symptoms/Reason',
      sortable: false,
      editable: true,
      type: 'textarea',
      width: 12
    },
    {
      key: 'estimated_duration',
      label: 'Duration (min)',
      sortable: true,
      editable: true,
      type: 'number',
      width: 6,
      render: (value) => `${value} min`
    },
    {
      key: 'insurance_verified',
      label: 'Insurance Verified',
      sortable: true,
      editable: true,
      type: 'select',
      width: 6,
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ],
      render: (value) => (
        <span className={`badge bg-${value ? 'success' : 'warning'}`}>
          {value ? 'Verified' : 'Pending'}
        </span>
      )
    },
    {
      key: 'confirmation_sent',
      label: 'Confirmation Sent',
      sortable: true,
      editable: true,
      type: 'select',
      width: 6,
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ],
      render: (value) => (
        <span className={`badge bg-${value ? 'success' : 'secondary'}`}>
          {value ? 'Sent' : 'Not Sent'}
        </span>
      )
    },
    {
      key: 'reminder_scheduled',
      label: 'Reminder Scheduled',
      sortable: true,
      editable: true,
      type: 'select',
      width: 6,
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ],
      render: (value) => (
        <span className={`badge bg-${value ? 'success' : 'secondary'}`}>
          {value ? 'Scheduled' : 'Not Scheduled'}
        </span>
      )
    },
    {
      key: 'created_at',
      label: 'Booked',
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
    setBookings(newData);
    console.log('Booking data updated:', newData);
  };

  const customActions = [
    {
      label: 'Send Confirmation',
      icon: 'ri-mail-send-line',
      action: (item) => {
        console.log('Sending confirmation to:', item.patient_name);
        // Send confirmation logic
      }
    },
    {
      label: 'Schedule Reminder',
      icon: 'ri-alarm-line',
      action: (item) => {
        console.log('Scheduling reminder for:', item.patient_name);
        // Schedule reminder logic
      }
    },
    {
      label: 'Verify Insurance',
      icon: 'ri-shield-check-line',
      action: (item) => {
        console.log('Verifying insurance for:', item.patient_name);
        // Insurance verification logic
      }
    }
  ];

  return (
    <div className="booking-assistant">
      <div className="row mb-4">
        <div className="col-12">
          <div className="alert alert-success">
            <i className="ri-calendar-check-line me-2"></i>
            <strong>AI Booking Assistant:</strong> Intelligent appointment scheduling system. 
            Automatically manages bookings, sends confirmations, and optimizes physician schedules.
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-warning">{bookings.filter(b => b.status === 'pending').length}</h3>
              <p className="mb-0">Pending Bookings</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-success">{bookings.filter(b => b.status === 'confirmed').length}</h3>
              <p className="mb-0">Confirmed</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-danger">{bookings.filter(b => b.priority === 'urgent').length}</h3>
              <p className="mb-0">Urgent</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-info">{upcomingAppointments.length}</h3>
              <p className="mb-0">Today's Appointments</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h6 className="card-title mb-0">
                <i className="ri-calendar-2-line me-2"></i>
                Today's Schedule
              </h6>
            </div>
            <div className="card-body">
              <div className="timeline">
                {upcomingAppointments.map((apt, index) => (
                  <div key={index} className="d-flex align-items-center mb-3">
                    <div className="flex-shrink-0">
                      <div className="badge bg-primary rounded-pill px-3 py-2">
                        {apt.time}
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="mb-0">{apt.patient}</h6>
                      <small className="text-muted">{apt.type}</small>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="badge bg-outline-success">Confirmed</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h6 className="card-title mb-0">
                <i className="ri-pie-chart-line me-2"></i>
                Booking Analytics
              </h6>
            </div>
            <div className="card-body">
              <div className="d-flex flex-column gap-3">
                <div>
                  <div className="d-flex justify-content-between">
                    <span className="small">AI Assistant Bookings</span>
                    <span className="small fw-bold">{bookings.filter(b => b.booking_source === 'ai_assistant').length}</span>
                  </div>
                  <div className="progress" style={{ height: '6px' }}>
                    <div 
                      className="progress-bar bg-primary" 
                      style={{ width: `${(bookings.filter(b => b.booking_source === 'ai_assistant').length / bookings.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="d-flex justify-content-between">
                    <span className="small">Online Portal</span>
                    <span className="small fw-bold">{bookings.filter(b => b.booking_source === 'online_portal').length}</span>
                  </div>
                  <div className="progress" style={{ height: '6px' }}>
                    <div 
                      className="progress-bar bg-success" 
                      style={{ width: `${(bookings.filter(b => b.booking_source === 'online_portal').length / bookings.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="d-flex justify-content-between">
                    <span className="small">Phone Calls</span>
                    <span className="small fw-bold">{bookings.filter(b => b.booking_source === 'phone_call').length}</span>
                  </div>
                  <div className="progress" style={{ height: '6px' }}>
                    <div 
                      className="progress-bar bg-info" 
                      style={{ width: `${(bookings.filter(b => b.booking_source === 'phone_call').length / bookings.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <UniversalCRUD
        sectionKey="booking-assistant"
        data={bookings}
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

export default BookingAssistant;
