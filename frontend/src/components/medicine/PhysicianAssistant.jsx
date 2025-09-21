import React, { useState, useEffect } from 'react';
import UniversalCRUD from './UniversalCRUD';

const PhysicianAssistant = () => {
  const [assistantData, setAssistantData] = useState([]);

  useEffect(() => {
    const mockData = [
      {
        id: '1',
        patient_id: 'PT001',
        patient_name: 'John Smith',
        consultation_type: 'diagnosis_assistance',
        symptoms: 'Chest pain, shortness of breath, fatigue',
        ai_suggestions: 'Possible cardiac evaluation needed. Recommend ECG, chest X-ray, and cardiac enzymes.',
        confidence_score: 85,
        status: 'pending_review',
        priority: 'high',
        created_at: '2024-01-22T10:30:00Z',
        updated_at: '2024-01-22T10:30:00Z',
        assigned_physician: 'Dr. Williams',
        follow_up_required: true,
        differential_diagnosis: 'Angina, Myocardial infarction, Pulmonary embolism'
      },
      {
        id: '2',
        patient_id: 'PT002',
        patient_name: 'Maria Garcia',
        consultation_type: 'medication_review',
        symptoms: 'Medication interaction concerns with new prescription',
        ai_suggestions: 'Potential interaction between Warfarin and new antibiotic. Consider alternative antibiotic or adjust dosage.',
        confidence_score: 92,
        status: 'reviewed',
        priority: 'medium',
        created_at: '2024-01-21T14:15:00Z',
        updated_at: '2024-01-22T09:45:00Z',
        assigned_physician: 'Dr. Johnson',
        follow_up_required: false,
        differential_diagnosis: 'Drug interaction analysis completed'
      },
      {
        id: '3',
        patient_id: 'PT003',
        patient_name: 'Robert Davis',
        consultation_type: 'treatment_planning',
        symptoms: 'Type 2 diabetes management optimization',
        ai_suggestions: 'Consider adding SGLT-2 inhibitor to current regimen. Monitor renal function and adjust metformin dose.',
        confidence_score: 78,
        status: 'in_progress',
        priority: 'medium',
        created_at: '2024-01-20T16:20:00Z',
        updated_at: '2024-01-22T11:10:00Z',
        assigned_physician: 'Dr. Smith',
        follow_up_required: true,
        differential_diagnosis: 'Diabetes management optimization'
      }
    ];
    
    setAssistantData(mockData);
  }, []);

  const columns = [
    {
      key: 'patient_id',
      label: 'Patient ID',
      sortable: true,
      editable: true,
      type: 'text',
      width: 6
    },
    {
      key: 'patient_name',
      label: 'Patient Name',
      sortable: true,
      editable: true,
      type: 'text',
      width: 6
    },
    {
      key: 'consultation_type',
      label: 'Consultation Type',
      sortable: true,
      editable: true,
      type: 'select',
      width: 6,
      options: [
        { value: 'diagnosis_assistance', label: 'Diagnosis Assistance' },
        { value: 'medication_review', label: 'Medication Review' },
        { value: 'treatment_planning', label: 'Treatment Planning' },
        { value: 'risk_assessment', label: 'Risk Assessment' },
        { value: 'clinical_decision_support', label: 'Clinical Decision Support' }
      ],
      render: (value) => (
        <span className="badge bg-info">
          {value?.replace('_', ' ').split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')}
        </span>
      )
    },
    {
      key: 'symptoms',
      label: 'Symptoms/Concerns',
      sortable: false,
      editable: true,
      type: 'textarea',
      width: 12
    },
    {
      key: 'ai_suggestions',
      label: 'AI Suggestions',
      sortable: false,
      editable: true,
      type: 'textarea',
      width: 12,
      render: (value) => (
        <div className="p-2 bg-light rounded">
          <i className="ri-robot-line text-primary me-1"></i>
          {value}
        </div>
      )
    },
    {
      key: 'confidence_score',
      label: 'Confidence Score',
      sortable: true,
      editable: true,
      type: 'number',
      width: 6,
      render: (value) => (
        <div className="d-flex align-items-center">
          <div className="progress me-2" style={{ width: '60px', height: '8px' }}>
            <div 
              className={`progress-bar ${
                value >= 80 ? 'bg-success' : 
                value >= 60 ? 'bg-warning' : 'bg-danger'
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
      label: 'Status',
      sortable: true,
      editable: true,
      type: 'select',
      width: 6,
      options: [
        { value: 'pending_review', label: 'Pending Review' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'reviewed', label: 'Reviewed' },
        { value: 'completed', label: 'Completed' },
        { value: 'requires_attention', label: 'Requires Attention' }
      ],
      render: (value) => (
        <span className={`badge bg-${
          value === 'completed' ? 'success' : 
          value === 'reviewed' ? 'info' : 
          value === 'in_progress' ? 'warning' : 
          value === 'requires_attention' ? 'danger' : 'secondary'
        }`}>
          {value?.replace('_', ' ').split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')}
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
      key: 'differential_diagnosis',
      label: 'Differential Diagnosis',
      sortable: false,
      editable: true,
      type: 'textarea',
      width: 12
    },
    {
      key: 'follow_up_required',
      label: 'Follow-up Required',
      sortable: true,
      editable: true,
      type: 'select',
      width: 6,
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ],
      render: (value) => (
        <span className={`badge bg-${value ? 'warning' : 'success'}`}>
          {value ? 'Follow-up Required' : 'No Follow-up'}
        </span>
      )
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
    setAssistantData(newData);
    console.log('Physician Assistant data updated:', newData);
  };

  const customActions = [
    {
      label: 'Generate AI Analysis',
      icon: 'ri-brain-line',
      action: (item) => {
        console.log('Generating AI analysis for:', item.patient_name);
        // AI analysis logic would go here
      }
    },
    {
      label: 'Create Treatment Plan',
      icon: 'ri-file-list-3-line',
      action: (item) => {
        console.log('Creating treatment plan for:', item.patient_name);
        // Treatment plan logic would go here
      }
    }
  ];

  return (
    <div className="physician-assistant">
      <div className="row mb-4">
        <div className="col-12">
          <div className="alert alert-primary">
            <i className="ri-user-heart-line me-2"></i>
            <strong>AI Physician Assistant:</strong> Intelligent clinical decision support system. 
            Provides AI-powered diagnosis assistance, medication reviews, and treatment recommendations.
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-warning">{assistantData.filter(d => d.status === 'pending_review').length}</h3>
              <p className="mb-0">Pending Review</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-info">{assistantData.filter(d => d.status === 'in_progress').length}</h3>
              <p className="mb-0">In Progress</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-danger">{assistantData.filter(d => d.priority === 'high' || d.priority === 'urgent').length}</h3>
              <p className="mb-0">High Priority</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-success">
                {Math.round(assistantData.reduce((sum, d) => sum + d.confidence_score, 0) / assistantData.length) || 0}%
              </h3>
              <p className="mb-0">Avg Confidence</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h6 className="card-title mb-0">
                <i className="ri-dashboard-3-line me-2"></i>
                AI Assistant Dashboard
              </h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6>Recent AI Recommendations</h6>
                  <ul className="list-group list-group-flush">
                    {assistantData.slice(0, 3).map(item => (
                      <li key={item.id} className="list-group-item d-flex justify-content-between align-items-start">
                        <div className="ms-2 me-auto">
                          <div className="fw-bold">{item.patient_name}</div>
                          <small className="text-muted">{item.ai_suggestions.substring(0, 80)}...</small>
                        </div>
                        <span className={`badge bg-${
                          item.confidence_score >= 80 ? 'success' : 
                          item.confidence_score >= 60 ? 'warning' : 'danger'
                        } rounded-pill`}>
                          {item.confidence_score}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-md-6">
                  <h6>Consultation Types Distribution</h6>
                  <div className="d-flex flex-column gap-2">
                    {['diagnosis_assistance', 'medication_review', 'treatment_planning'].map(type => {
                      const count = assistantData.filter(d => d.consultation_type === type).length;
                      const percentage = assistantData.length > 0 ? (count / assistantData.length) * 100 : 0;
                      return (
                        <div key={type}>
                          <div className="d-flex justify-content-between">
                            <span className="small">{type.replace('_', ' ').split(' ').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}</span>
                            <span className="small">{count}</span>
                          </div>
                          <div className="progress" style={{ height: '6px' }}>
                            <div 
                              className="progress-bar bg-primary" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <UniversalCRUD
        sectionKey="physician-assistant"
        data={assistantData}
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

export default PhysicianAssistant;
