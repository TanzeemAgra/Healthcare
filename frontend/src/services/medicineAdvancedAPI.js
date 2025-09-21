import api from './api';

// Base URLs for different medicine features
const MEDICINE_BASE_URL = '/medicine';

// Enhanced error handling utility
const handleApiError = (error, context) => {
  console.error(`API Error in ${context}:`, error);
  if (error.response) {
    // Server responded with error status
    throw new Error(`${context}: ${error.response.data?.detail || error.response.statusText}`);
  } else if (error.request) {
    // Request was made but no response received
    throw new Error(`${context}: Network error - please check your connection`);
  } else {
    // Something else happened
    throw new Error(`${context}: ${error.message}`);
  }
};

// Common CRUD operations wrapper
const createCrudAPI = (endpoint, customActions = {}) => {
  const baseAPI = {
    getAll: async (params = {}) => {
      try {
        const response = await api.get(`${MEDICINE_BASE_URL}/${endpoint}/`, { params });
        return response.data;
      } catch (error) {
        handleApiError(error, `Get all ${endpoint}`);
      }
    },
    getById: async (id) => {
      try {
        const response = await api.get(`${MEDICINE_BASE_URL}/${endpoint}/${id}/`);
        return response.data;
      } catch (error) {
        handleApiError(error, `Get ${endpoint} by ID`);
      }
    },
    create: async (data) => {
      try {
        const response = await api.post(`${MEDICINE_BASE_URL}/${endpoint}/`, data);
        return response.data;
      } catch (error) {
        handleApiError(error, `Create ${endpoint}`);
      }
    },
    update: async (id, data) => {
      try {
        const response = await api.put(`${MEDICINE_BASE_URL}/${endpoint}/${id}/`, data);
        return response.data;
      } catch (error) {
        handleApiError(error, `Update ${endpoint}`);
      }
    },
    partialUpdate: async (id, data) => {
      try {
        const response = await api.patch(`${MEDICINE_BASE_URL}/${endpoint}/${id}/`, data);
        return response.data;
      } catch (error) {
        handleApiError(error, `Partial update ${endpoint}`);
      }
    },
    delete: async (id) => {
      try {
        await api.delete(`${MEDICINE_BASE_URL}/${endpoint}/${id}/`);
        return { success: true };
      } catch (error) {
        handleApiError(error, `Delete ${endpoint}`);
      }
    },
    bulkDelete: async (ids) => {
      try {
        const response = await api.post(`${MEDICINE_BASE_URL}/${endpoint}/bulk_delete/`, { ids });
        return response.data;
      } catch (error) {
        handleApiError(error, `Bulk delete ${endpoint}`);
      }
    },
    search: async (query, filters = {}) => {
      try {
        const response = await api.get(`${MEDICINE_BASE_URL}/${endpoint}/`, {
          params: { search: query, ...filters }
        });
        return response.data;
      } catch (error) {
        handleApiError(error, `Search ${endpoint}`);
      }
    },
    export: async (format = 'csv', filters = {}) => {
      try {
        const response = await api.get(`${MEDICINE_BASE_URL}/${endpoint}/export/`, {
          params: { format, ...filters },
          responseType: 'blob'
        });
        return response.data;
      } catch (error) {
        handleApiError(error, `Export ${endpoint}`);
      }
    }
  };

  return { ...baseAPI, ...customActions };
};

// Patient Reports API
export const patientReportsAPI = createCrudAPI('patient-reports', {
  generateAISummary: async (id) => {
    try {
      const response = await api.post(`${MEDICINE_BASE_URL}/patient-reports/${id}/generate_ai_summary/`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Generate AI Summary');
    }
  },
  sendReport: async (id, recipientData) => {
    try {
      const response = await api.post(`${MEDICINE_BASE_URL}/patient-reports/${id}/send_report/`, recipientData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Send Report');
    }
  },
  generateReport: async (patientId, reportType, dateRange) => {
    try {
      const response = await api.post(`${MEDICINE_BASE_URL}/patient-reports/generate/`, {
        patient_id: patientId,
        report_type: reportType,
        date_range: dateRange
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Generate Report');
    }
  }
});

// SOAP Notes API
export const soapNotesAPI = createCrudAPI('soap-notes', {
  generateAISuggestions: async (id, context) => {
    try {
      const response = await api.post(`${MEDICINE_BASE_URL}/soap-notes/${id}/generate_ai_suggestions/`, { context });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Generate AI Suggestions');
    }
  },
  getTemplates: async () => {
    try {
      const response = await api.get(`${MEDICINE_BASE_URL}/soap-notes/templates/`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Get Templates');
    }
  },
  createTemplate: async (data) => {
    try {
      const response = await api.post(`${MEDICINE_BASE_URL}/soap-notes/create_template/`, data);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Create Template');
    }
  }
});

// Protocol Summarizer API
export const protocolSummarizerAPI = createCrudAPI('protocol-summarizer', {
  generateAISummary: async (id) => {
    try {
      const response = await api.post(`${MEDICINE_BASE_URL}/protocol-summarizer/${id}/generate_ai_summary/`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Generate AI Summary');
    }
  },
  trackView: async (id) => {
    try {
      const response = await api.post(`${MEDICINE_BASE_URL}/protocol-summarizer/${id}/track_view/`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Track View');
    }
  },
  incrementViews: async (id) => {
    try {
      const response = await api.patch(`${MEDICINE_BASE_URL}/protocol-summarizer/${id}/increment_views/`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Increment Views');
    }
  }
});

// Contract Redlining API
export const contractRedliningAPI = createCrudAPI('contract-redlining', {
  aiAnalyze: async (id) => {
    try {
      const response = await api.post(`${MEDICINE_BASE_URL}/contract-redlining/${id}/ai_analyze/`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'AI Analyze Contract');
    }
  },
  submitReview: async (id, reviewData) => {
    try {
      const response = await api.post(`${MEDICINE_BASE_URL}/contract-redlining/${id}/submit_review/`, reviewData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Submit Review');
    }
  }
});

// Physician Assistant API
export const physicianAssistantAPI = createCrudAPI('physician-assistant', {
  startConsultation: async (data) => {
    try {
      const response = await api.post(`${MEDICINE_BASE_URL}/physician-assistant/start_consultation/`, data);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Start Consultation');
    }
  },
  provideFeedback: async (id, data) => {
    try {
      const response = await api.post(`${MEDICINE_BASE_URL}/physician-assistant/${id}/provide_feedback/`, data);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Provide Feedback');
    }
  },
  getDiagnosisSuggestions: async (patientData) => {
    try {
      const response = await api.post(`${MEDICINE_BASE_URL}/physician-assistant/diagnosis_suggestions/`, patientData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Get Diagnosis Suggestions');
    }
  },
  checkDrugInteractions: async (medications) => {
    try {
      const response = await api.post(`${MEDICINE_BASE_URL}/physician-assistant/drug_interactions/`, { medications });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Check Drug Interactions');
    }
  }
});

// AI Booking Assistant API
export const aiBookingAssistantAPI = createCrudAPI('ai-booking-assistant', {
  startBooking: async (data) => {
    try {
      const response = await api.post(`${MEDICINE_BASE_URL}/ai-booking-assistant/start_booking/`, data);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Start Booking');
    }
  },
  processMessage: async (id, data) => {
    try {
      const response = await api.post(`${MEDICINE_BASE_URL}/ai-booking-assistant/${id}/process_message/`, data);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Process Message');
    }
  },
  findAvailableSlots: async (preferences) => {
    try {
      const response = await api.post(`${MEDICINE_BASE_URL}/ai-booking-assistant/find_slots/`, preferences);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Find Available Slots');
    }
  },
  confirmBooking: async (sessionId, slotData) => {
    try {
      const response = await api.post(`${MEDICINE_BASE_URL}/ai-booking-assistant/${sessionId}/confirm_booking/`, slotData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Confirm Booking');
    }
  }
});

// Insurance Policy Copilot API
export const insurancePolicyCopilotAPI = createCrudAPI('insurance-policy-copilot', {
  analyzeCoverage: async (id, data) => {
    try {
      const response = await api.post(`${MEDICINE_BASE_URL}/insurance-policy-copilot/${id}/analyze_coverage/`, data);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Analyze Coverage');
    }
  },
  estimateCosts: async (policyId, treatments) => {
    try {
      const response = await api.post(`${MEDICINE_BASE_URL}/insurance-policy-copilot/${policyId}/estimate_costs/`, { treatments });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Estimate Costs');
    }
  }
});

// Hospital CSR Assistant API
export const hospitalCSRAssistantAPI = createCrudAPI('hospital-csr-assistant', {
  aiAssist: async (id) => {
    try {
      const response = await api.post(`${MEDICINE_BASE_URL}/hospital-csr-assistant/${id}/ai_assist/`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'AI Assist');
    }
  },
  getAISuggestions: async (ticketId, context) => {
    try {
      const response = await api.post(`${MEDICINE_BASE_URL}/hospital-csr-assistant/${ticketId}/ai_suggestions/`, { context });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Get AI Suggestions');
    }
  },
  escalateTicket: async (ticketId, escalationData) => {
    try {
      const response = await api.post(`${MEDICINE_BASE_URL}/hospital-csr-assistant/${ticketId}/escalate/`, escalationData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Escalate Ticket');
    }
  },
  resolveTicket: async (ticketId, resolution) => {
    try {
      const response = await api.post(`${MEDICINE_BASE_URL}/hospital-csr-assistant/${ticketId}/resolve/`, resolution);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Resolve Ticket');
    }
  }
});

// Medical Research Review API
export const medicalResearchReviewAPI = createCrudAPI('medical-research-review', {
  aiReview: async (id) => {
    try {
      const response = await api.post(`${MEDICINE_BASE_URL}/medical-research-review/${id}/ai_review/`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'AI Review');
    }
  },
  rateResearch: async (id, ratingData) => {
    try {
      const response = await api.post(`${MEDICINE_BASE_URL}/medical-research-review/${id}/rate/`, ratingData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Rate Research');
    }
  },
  incrementViews: async (id) => {
    try {
      const response = await api.patch(`${MEDICINE_BASE_URL}/medical-research-review/${id}/increment_views/`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Increment Views');
    }
  }
});

// Back Office Automation API
export const backOfficeAutomationAPI = createCrudAPI('back-office-automation', {
  executeTask: async (id) => {
    try {
      const response = await api.post(`${MEDICINE_BASE_URL}/back-office-automation/${id}/execute_task/`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Execute Task');
    }
  },
  pauseTask: async (id) => {
    try {
      const response = await api.post(`${MEDICINE_BASE_URL}/back-office-automation/${id}/pause_task/`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Pause Task');
    }
  },
  getTaskLogs: async (id) => {
    try {
      const response = await api.get(`${MEDICINE_BASE_URL}/back-office-automation/${id}/logs/`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Get Task Logs');
    }
  },
  scheduleTask: async (id, scheduleData) => {
    try {
      const response = await api.post(`${MEDICINE_BASE_URL}/back-office-automation/${id}/schedule/`, scheduleData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Schedule Task');
    }
  }
});

// Clinical History Search API
export const clinicalHistorySearchAPI = createCrudAPI('clinical-history-search', {
  search: async (data) => {
    try {
      const response = await api.post(`${MEDICINE_BASE_URL}/clinical-history-search/search/`, data);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Clinical Search');
    }
  },
  provideFeedback: async (id, data) => {
    try {
      const response = await api.post(`${MEDICINE_BASE_URL}/clinical-history-search/${id}/provide_feedback/`, data);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Provide Feedback');
    }
  },
  getSearchAnalytics: async () => {
    try {
      const response = await api.get(`${MEDICINE_BASE_URL}/clinical-history-search/analytics/`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Get Search Analytics');
    }
  },
  performAdvancedSearch: async (searchData) => {
    try {
      const response = await api.post(`${MEDICINE_BASE_URL}/clinical-history-search/advanced_search/`, searchData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Perform Advanced Search');
    }
  }
});

// Advanced Features Statistics API
export const advancedFeaturesStatsAPI = {
  getStats: async () => {
    try {
      const response = await api.get(`${MEDICINE_BASE_URL}/advanced-features-stats/`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Get Advanced Features Stats');
    }
  },
  getSystemHealth: async () => {
    try {
      const response = await api.get(`${MEDICINE_BASE_URL}/advanced-features-stats/system_health/`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Get System Health');
    }
  }
};

// General Utility APIs
export const generalMedicineAPI = {
  // Bulk operations across all features
  bulkExport: async (features, format = 'csv', filters = {}) => {
    try {
      const response = await api.post(`${MEDICINE_BASE_URL}/bulk_export/`, {
        features,
        format,
        filters
      }, { responseType: 'blob' });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Bulk Export');
    }
  },
  
  // Global search across all features
  globalSearch: async (query, features = [], filters = {}) => {
    try {
      const response = await api.get(`${MEDICINE_BASE_URL}/global_search/`, {
        params: { query, features: features.join(','), ...filters }
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Global Search');
    }
  },

  // Get recent activity across all features
  getRecentActivity: async (limit = 20) => {
    try {
      const response = await api.get(`${MEDICINE_BASE_URL}/recent_activity/`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Get Recent Activity');
    }
  },

  // Get feature usage analytics
  getUsageAnalytics: async (dateRange = '7d') => {
    try {
      const response = await api.get(`${MEDICINE_BASE_URL}/usage_analytics/`, {
        params: { date_range: dateRange }
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Get Usage Analytics');
    }
  }
};

// Enhanced Combined medicine API object with new features
export const medicineAdvancedAPI = {
  // Individual feature APIs
  patientReports: patientReportsAPI,
  soapNotes: soapNotesAPI,
  protocolSummarizer: protocolSummarizerAPI,
  contractRedlining: contractRedliningAPI,
  physicianAssistant: physicianAssistantAPI,
  aiBookingAssistant: aiBookingAssistantAPI,
  insurancePolicyCopilot: insurancePolicyCopilotAPI,
  hospitalCSRAssistant: hospitalCSRAssistantAPI,
  medicalResearchReview: medicalResearchReviewAPI,
  backOfficeAutomation: backOfficeAutomationAPI,
  clinicalHistorySearch: clinicalHistorySearchAPI,
  
  // Statistics and analytics
  stats: advancedFeaturesStatsAPI,
  
  // General utilities
  general: generalMedicineAPI,

  // Convenience methods for common operations
  async getAllData(feature, params = {}) {
    if (this[feature] && this[feature].getAll) {
      return await this[feature].getAll(params);
    }
    throw new Error(`Feature ${feature} not found or doesn't support getAll`);
  },

  async createRecord(feature, data) {
    if (this[feature] && this[feature].create) {
      return await this[feature].create(data);
    }
    throw new Error(`Feature ${feature} not found or doesn't support create`);
  },

  async updateRecord(feature, id, data) {
    if (this[feature] && this[feature].update) {
      return await this[feature].update(id, data);
    }
    throw new Error(`Feature ${feature} not found or doesn't support update`);
  },

  async deleteRecord(feature, id) {
    if (this[feature] && this[feature].delete) {
      return await this[feature].delete(id);
    }
    throw new Error(`Feature ${feature} not found or doesn't support delete`);
  },

  async searchRecords(feature, query, filters = {}) {
    if (this[feature] && this[feature].search) {
      return await this[feature].search(query, filters);
    }
    throw new Error(`Feature ${feature} not found or doesn't support search`);
  }
};

export default medicineAdvancedAPI;
