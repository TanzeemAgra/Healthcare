import apiClient from './api';

class PatientService {
  // Patient CRUD operations
  async getPatients(params = {}) {
    try {
      const response = await apiClient.get('/patients/patients/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  }

  async getPatient(id) {
    try {
  const response = await apiClient.get(`/patients/patients/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching patient:', error);
      throw error;
    }
  }

  async createPatient(patientData) {
    try {
      const response = await apiClient.post('/patients/patients/', patientData);
      return response.data;
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
  }

  async updatePatient(id, patientData) {
    try {
  const response = await apiClient.put(`/patients/patients/${id}/`, patientData);
      return response.data;
    } catch (error) {
      console.error('Error updating patient:', error);
      throw error;
    }
  }

  async deletePatient(id) {
    try {
  await apiClient.delete(`/patients/patients/${id}/`);
    } catch (error) {
      console.error('Error deleting patient:', error);
      throw error;
    }
  }

  async searchPatients(query) {
    try {
      const response = await apiClient.get('/patients/patients/search/', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching patients:', error);
      throw error;
    }
  }

  // Appointment operations
  async getAppointments(params = {}) {
    try {
      const response = await apiClient.get('/patients/appointments/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  }

  async createAppointment(appointmentData) {
    try {
      const response = await apiClient.post('/patients/appointments/', appointmentData);
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  }

  async updateAppointment(id, appointmentData) {
    try {
  const response = await apiClient.put(`/patients/appointments/${id}/`, appointmentData);
      return response.data;
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  }

  async deleteAppointment(id) {
    try {
  await apiClient.delete(`/patients/appointments/${id}/`);
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  }

  async getCalendarData(params = {}) {
    try {
      const response = await apiClient.get('/patients/appointments/calendar/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching calendar data:', error);
      throw error;
    }
  }

  // Vital Signs operations
  async getVitalSigns(patientId, params = {}) {
    try {
      const response = await apiClient.get('/patients/vital-signs/', {
        params: { patient: patientId, ...params }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching vital signs:', error);
      throw error;
    }
  }

  async createVitalSigns(vitalSignsData) {
    try {
      const response = await apiClient.post('/patients/vital-signs/', vitalSignsData);
      return response.data;
    } catch (error) {
      console.error('Error creating vital signs:', error);
      throw error;
    }
  }

  async updateVitalSigns(id, vitalSignsData) {
    try {
  const response = await apiClient.put(`/patients/vital-signs/${id}/`, vitalSignsData);
      return response.data;
    } catch (error) {
      console.error('Error updating vital signs:', error);
      throw error;
    }
  }

  // Lab Results operations
  async getLabResults(patientId, params = {}) {
    try {
      const response = await apiClient.get('/patients/lab-results/', {
        params: { patient: patientId, ...params }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching lab results:', error);
      throw error;
    }
  }

  async createLabResult(labResultData) {
    try {
      const response = await apiClient.post('/patients/lab-results/', labResultData);
      return response.data;
    } catch (error) {
      console.error('Error creating lab result:', error);
      throw error;
    }
  }

  async updateLabResult(id, labResultData) {
    try {
  const response = await apiClient.put(`/patients/lab-results/${id}/`, labResultData);
      return response.data;
    } catch (error) {
      console.error('Error updating lab result:', error);
      throw error;
    }
  }

  // Medical History operations
  async getMedicalHistory(patientId, params = {}) {
    try {
      const response = await apiClient.get('/patients/medical-history/', {
        params: { patient: patientId, ...params }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching medical history:', error);
      throw error;
    }
  }

  async createMedicalHistory(medicalHistoryData) {
    try {
      const response = await apiClient.post('/patients/medical-history/', medicalHistoryData);
      return response.data;
    } catch (error) {
      console.error('Error creating medical history:', error);
      throw error;
    }
  }

  async updateMedicalHistory(id, medicalHistoryData) {
    try {
  const response = await apiClient.put(`/patients/medical-history/${id}/`, medicalHistoryData);
      return response.data;
    } catch (error) {
      console.error('Error updating medical history:', error);
      throw error;
    }
  }

  // Dashboard operations
  async getDashboardStats() {
    try {
      const response = await apiClient.get('/patients/dashboard/stats/');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  async getRecentActivity() {
    try {
      const response = await apiClient.get('/patients/dashboard/recent-activity/');
      return response.data;
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      throw error;
    }
  }

  async getUpcomingAppointments() {
    try {
      const response = await apiClient.get('/patients/dashboard/upcoming-appointments/');
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error);
      throw error;
    }
  }

  // Bulk operations
  async bulkCreatePatients(patientsData) {
    try {
      const response = await apiClient.post('/patients/patients/bulk-create/', {
        patients: patientsData
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk creating patients:', error);
      throw error;
    }
  }

  async bulkUpdatePatients(patientsData) {
    try {
      const response = await apiClient.put('/patients/patients/bulk-update/', {
        patients: patientsData
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk updating patients:', error);
      throw error;
    }
  }

  async exportPatients(format = 'csv', filters = {}) {
    try {
      const response = await apiClient.get('/patients/patients/export/', {
        params: { format, ...filters },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting patients:', error);
      throw error;
    }
  }
}

const patientService = new PatientService();
export default patientService;
