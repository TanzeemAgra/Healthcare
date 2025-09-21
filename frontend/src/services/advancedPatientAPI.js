/**
 * Advanced Patient Management API Service
 * Handles all API calls for comprehensive patient tracking and management
 */

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/patients/api/v2`;

class AdvancedPatientAPI {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
    }

    // Add authentication token if available
    getAuthHeaders() {
        const token = localStorage.getItem('authToken');
        return {
            ...this.headers,
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    }

    // Generic API request method
    async apiRequest(endpoint, options = {}) {
        try {
            const url = `${this.baseURL}${endpoint}`;
            const config = {
                headers: this.getAuthHeaders(),
                ...options
            };

            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request Failed:', error);
            throw error;
        }
    }

    // === PATIENT ADMISSION MANAGEMENT ===

    // Get all patient admissions with filtering
    async getAdmissions(filters = {}) {
        const queryParams = new URLSearchParams();
        
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                queryParams.append(key, value);
            }
        });

        const endpoint = `/admissions/?${queryParams.toString()}`;
        return this.apiRequest(endpoint);
    }

    // Get specific admission details
    async getAdmission(admissionId) {
        return this.apiRequest(`/admissions/${admissionId}/`);
    }

    // Create new patient admission
    async createAdmission(admissionData) {
        return this.apiRequest('/admissions/', {
            method: 'POST',
            body: JSON.stringify(admissionData)
        });
    }

    // Update admission
    async updateAdmission(admissionId, data) {
        return this.apiRequest(`/admissions/${admissionId}/`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    }

    // Update patient status
    async updatePatientStatus(admissionId, statusData) {
        return this.apiRequest(`/admissions/${admissionId}/update_status/`, {
            method: 'POST',
            body: JSON.stringify(statusData)
        });
    }

    // Discharge patient
    async dischargePatient(admissionId, dischargeData) {
        return this.apiRequest(`/admissions/${admissionId}/discharge_patient/`, {
            method: 'POST',
            body: JSON.stringify(dischargeData)
        });
    }

    // Get dashboard statistics
    async getDashboardStats() {
        return this.apiRequest('/admissions/dashboard_stats/');
    }

    // === PATIENT JOURNEY TRACKING ===

    // Get patient journey timeline
    async getPatientJourney(admissionId) {
        return this.apiRequest(`/admissions/${admissionId}/patient_journey/`);
    }

    // Add new journey event
    async addJourneyEvent(eventData) {
        return this.apiRequest('/journey/add_event/', {
            method: 'POST',
            body: JSON.stringify(eventData)
        });
    }

    // Get journey events for admission
    async getJourneyEvents(admissionId) {
        return this.apiRequest(`/journey/?admission__admission_id=${admissionId}`);
    }

    // === AI INSIGHTS AND ANALYTICS ===

    // Get AI insights for patient
    async getAIInsights(admissionId) {
        return this.apiRequest(`/admissions/${admissionId}/ai_insights/`);
    }

    // Generate new AI insights
    async generateAIInsights(admissionId, insightTypes = ['risk_assessment']) {
        return this.apiRequest('/ai-insights/generate_insights/', {
            method: 'POST',
            body: JSON.stringify({
                admission_id: admissionId,
                insight_types: insightTypes
            })
        });
    }

    // Validate AI insight
    async validateInsight(insightId, validationData) {
        return this.apiRequest(`/ai-insights/${insightId}/validate_insight/`, {
            method: 'POST',
            body: JSON.stringify(validationData)
        });
    }

    // Get quality metrics
    async getQualityMetrics(days = 30) {
        return this.apiRequest(`/analytics/quality_metrics/?days=${days}`);
    }

    // Get predictive analytics
    async getPredictiveAnalytics() {
        return this.apiRequest('/analytics/predictive_analytics/');
    }

    // === PATIENT REPORTING ===

    // Generate patient report
    async generateReport(admissionId, reportType = 'comprehensive') {
        return this.apiRequest('/reports/generate_report/', {
            method: 'POST',
            body: JSON.stringify({
                admission_id: admissionId,
                report_type: reportType
            })
        });
    }

    // Get patient reports
    async getReports(admissionId) {
        return this.apiRequest(`/reports/?admission__admission_id=${admissionId}`);
    }

    // Download report
    async downloadReport(reportId) {
        return this.apiRequest(`/reports/${reportId}/download/`);
    }

    // === PATIENT SEARCH AND FILTERS ===

    // Search patients with advanced filters
    async searchPatients(searchTerm = '', filters = {}) {
        const queryParams = new URLSearchParams();
        
        if (searchTerm) {
            queryParams.append('search', searchTerm);
        }
        
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                queryParams.append(key, value);
            }
        });

        return this.apiRequest(`/admissions/?${queryParams.toString()}`);
    }

    // Get active admissions only
    async getActiveAdmissions() {
        return this.apiRequest('/admissions/?active_only=true');
    }

    // === REAL-TIME UPDATES ===

    // Get recent activity
    async getRecentActivity(hours = 24) {
        const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
        return this.apiRequest(`/journey/?timestamp__gte=${since}&ordering=-timestamp`);
    }

    // Get critical patients
    async getCriticalPatients() {
        return this.apiRequest('/admissions/?current_status=critical&ordering=-ai_risk_score');
    }

    // Get high-risk patients
    async getHighRiskPatients(riskThreshold = 7.0) {
        return this.apiRequest(`/admissions/?ai_risk_score__gte=${riskThreshold}&active_only=true`);
    }

    // === BULK OPERATIONS ===

    // Bulk update patient statuses
    async bulkUpdateStatus(admissionIds, status, notes = '') {
        const updates = admissionIds.map(id => ({
            admission_id: id,
            status: status,
            notes: notes
        }));

        return Promise.all(
            updates.map(update => this.updatePatientStatus(update.admission_id, update))
        );
    }

    // === ANALYTICS AND REPORTING ===

    // Get patient analytics summary
    async getAnalyticsSummary(dateRange = 'last_30_days') {
        return this.apiRequest(`/analytics/summary/?range=${dateRange}`);
    }

    // Get department performance
    async getDepartmentPerformance() {
        return this.apiRequest('/analytics/department_performance/');
    }

    // Get length of stay analytics
    async getLengthOfStayAnalytics() {
        return this.apiRequest('/analytics/length_of_stay/');
    }

    // === UTILITY METHODS ===

    // Validate admission data before sending
    validateAdmissionData(data) {
        const required = ['patient', 'admission_type', 'department', 'chief_complaint'];
        const missing = required.filter(field => !data[field]);
        
        if (missing.length > 0) {
            throw new Error(`Missing required fields: ${missing.join(', ')}`);
        }
        
        return true;
    }

    // Format date for API
    formatDate(date) {
        if (date instanceof Date) {
            return date.toISOString();
        }
        return date;
    }

    // Parse API response data
    parseAdmissionData(admission) {
        return {
            ...admission,
            admission_date: new Date(admission.admission_date),
            discharge_date: admission.discharge_date ? new Date(admission.discharge_date) : null,
            follow_up_date: admission.follow_up_date ? new Date(admission.follow_up_date) : null,
        };
    }

    // Get patient status badge color
    getStatusBadgeColor(status) {
        const colors = {
            'admitted': 'info',
            'in_treatment': 'warning',
            'stable': 'success',
            'critical': 'danger',
            'recovery': 'warning',
            'discharge_ready': 'success',
            'discharged': 'secondary'
        };
        return colors[status] || 'secondary';
    }

    // Get priority badge color
    getPriorityBadgeColor(priority) {
        const colors = {
            'low': 'success',
            'medium': 'warning',
            'high': 'danger',
            'critical': 'danger'
        };
        return colors[priority] || 'secondary';
    }

    // Get risk level badge color
    getRiskBadgeColor(riskScore) {
        if (riskScore >= 7) return 'danger';
        if (riskScore >= 4) return 'warning';
        return 'success';
    }

    // Format risk score display
    formatRiskScore(score) {
        return `${score.toFixed(1)}/10`;
    }

    // Calculate length of stay in readable format
    formatLengthOfStay(days) {
        if (days === 0) return 'Same day';
        if (days === 1) return '1 day';
        return `${days} days`;
    }

    // Format currency for cost display
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount || 0);
    }

    // === ERROR HANDLING ===

    // Handle API errors gracefully
    handleAPIError(error) {
        console.error('API Error:', error);
        
        if (error.message.includes('401')) {
            // Unauthorized - redirect to login
            window.location.href = '/login';
            return;
        }
        
        if (error.message.includes('403')) {
            return 'You do not have permission to perform this action.';
        }
        
        if (error.message.includes('404')) {
            return 'The requested resource was not found.';
        }
        
        if (error.message.includes('500')) {
            return 'Server error. Please try again later.';
        }
        
        return error.message || 'An unexpected error occurred.';
    }
}

// Create singleton instance
const advancedPatientAPI = new AdvancedPatientAPI();

// Export for use in components
export default advancedPatientAPI;
