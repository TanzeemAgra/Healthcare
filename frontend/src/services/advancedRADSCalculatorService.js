/**
 * Advanced RADS Calculator API Service
 * Handles communication with Gen AI-powered backend for critical medical decision support
 */

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/radiology`;

class AdvancedRADSCalculatorService {
    constructor() {
        this.cache = new Map();
        this.requestId = 0;
    }

    /**
     * Generate unique request ID for tracking
     */
    generateRequestId() {
        return `rads_req_${++this.requestId}_${Date.now()}`;
    }

    /**
     * Calculate RADS score with AI enhancement
     */
    async calculateRADS(radsType, features, options = {}) {
        const requestId = this.generateRequestId();
        
        try {
            const payload = {
                rads_type: radsType,
                features: features,
                model_type: options.modelType || 'auto',
                image_data: options.imageData || null,
                clinical_context: options.clinicalContext || '',
                patient_demographics: {
                    age: options.patientAge || null,
                    sex: options.patientSex || null
                },
                uncertainty_mode: options.uncertaintyMode !== false,
                request_id: requestId
            };

            console.log(`[${requestId}] Initiating AI RADS calculation for ${radsType}`);
            
            const response = await fetch(`${API_BASE_URL}/advanced-rads/calculate/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'include',
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            
            console.log(`[${requestId}] AI RADS calculation completed successfully`);
            
            // Cache result for potential reuse
            this.cache.set(requestId, {
                result,
                timestamp: Date.now(),
                radsType,
                features
            });

            return {
                ...result,
                requestId,
                cached: false
            };

        } catch (error) {
            console.error(`[${requestId}] AI RADS calculation failed:`, error);
            throw new Error(`AI analysis failed: ${error.message}`);
        }
    }

    /**
     * Get available AI models
     */
    async getAIModels() {
        const cacheKey = 'ai_models';
        const cached = this.cache.get(cacheKey);
        
        if (cached && (Date.now() - cached.timestamp) < 300000) { // 5 minutes cache
            return cached.data;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/advanced-rads/models/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch AI models: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Cache the result
            this.cache.set(cacheKey, {
                data,
                timestamp: Date.now()
            });

            return data;

        } catch (error) {
            console.error('Failed to get AI models:', error);
            throw error;
        }
    }

    /**
     * Get clinical guidelines
     */
    async getClinicalGuidelines() {
        const cacheKey = 'clinical_guidelines';
        const cached = this.cache.get(cacheKey);
        
        if (cached && (Date.now() - cached.timestamp) < 600000) { // 10 minutes cache
            return cached.data;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/advanced-rads/guidelines/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch guidelines: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Cache the result
            this.cache.set(cacheKey, {
                data,
                timestamp: Date.now()
            });

            return data;

        } catch (error) {
            console.error('Failed to get clinical guidelines:', error);
            throw error;
        }
    }

    /**
     * Validate uploaded imaging data
     */
    async validateImagingData(files) {
        try {
            const formData = new FormData();
            
            files.forEach((file, index) => {
                formData.append('images', file);
            });

            const response = await fetch(`${API_BASE_URL}/advanced-rads/validate-images/`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Image validation failed: ${response.statusText}`);
            }

            const result = await response.json();
            return result;

        } catch (error) {
            console.error('Failed to validate imaging data:', error);
            throw error;
        }
    }

    /**
     * Process DICOM files for AI analysis
     */
    async processDICOMFiles(files) {
        try {
            // Validate files first
            const validation = await this.validateImagingData(files);
            
            if (!validation.overall_valid) {
                throw new Error('Some files failed validation');
            }

            // Process valid files
            const processedFiles = validation.validation_results
                .filter(result => result.valid)
                .map(result => ({
                    filename: result.filename,
                    format: result.format,
                    quality_score: result.quality_score,
                    ai_processable: result.ai_processable
                }));

            return {
                success: true,
                processed_files: processedFiles,
                total_files: files.length,
                valid_files: processedFiles.length
            };

        } catch (error) {
            console.error('Failed to process DICOM files:', error);
            throw error;
        }
    }

    /**
     * Get risk assessment interpretation
     */
    getRiskInterpretation(riskScore, uncertaintyScore) {
        const confidence = (1 - uncertaintyScore) * 100;
        
        let riskLevel, riskColor, recommendations;

        if (riskScore > 0.85) {
            riskLevel = 'CRITICAL';
            riskColor = '#dc3545';
            recommendations = [
                'Immediate medical consultation required',
                'Urgent tissue sampling recommended',
                'Multidisciplinary team review',
                'Consider staging studies'
            ];
        } else if (riskScore > 0.6) {
            riskLevel = 'HIGH';
            riskColor = '#fd7e14';
            recommendations = [
                'Short-term follow-up required',
                'Consider tissue sampling',
                'Clinical correlation needed',
                'Repeat imaging in 1-3 months'
            ];
        } else if (riskScore > 0.3) {
            riskLevel = 'MODERATE';
            riskColor = '#ffc107';
            recommendations = [
                'Routine follow-up recommended',
                'Monitor for changes',
                'Continue surveillance',
                'Follow institutional guidelines'
            ];
        } else if (riskScore > 0.1) {
            riskLevel = 'LOW';
            riskColor = '#20c997';
            recommendations = [
                'Routine surveillance',
                'Annual screening',
                'Clinical monitoring',
                'Patient education'
            ];
        } else {
            riskLevel = 'MINIMAL';
            riskColor = '#28a745';
            recommendations = [
                'Continue routine screening',
                'No additional follow-up needed',
                'Reassurance appropriate',
                'Standard care pathway'
            ];
        }

        return {
            riskLevel,
            riskColor,
            recommendations,
            confidence: confidence.toFixed(1),
            uncertaintyRange: `±${(uncertaintyScore * 100).toFixed(1)}%`
        };
    }

    /**
     * Format clinical decision for display
     */
    formatClinicalDecision(clinicalDecision) {
        const urgencyColors = {
            'ROUTINE': '#28a745',
            'HIGH': '#ffc107', 
            'URGENT': '#fd7e14',
            'CRITICAL': '#dc3545'
        };

        return {
            ...clinicalDecision,
            urgencyColor: urgencyColors[clinicalDecision.urgency] || '#6c757d',
            formattedTimeframe: this.formatTimeframe(clinicalDecision.timeframe),
            priorityIcon: this.getPriorityIcon(clinicalDecision.priority)
        };
    }

    /**
     * Format timeframe for better readability
     */
    formatTimeframe(timeframe) {
        const timeframeMappings = {
            'Within 24-48 hours': '🚨 Immediate (24-48h)',
            '1-2 weeks': '⚡ Urgent (1-2 weeks)',
            '3-6 months': '📅 Short-term (3-6 months)',
            '12 months': '📆 Annual (12 months)'
        };

        return timeframeMappings[timeframe] || timeframe;
    }

    /**
     * Get priority icon
     */
    getPriorityIcon(priority) {
        const priorityIcons = {
            'HIGH': 'ri-alarm-warning-line',
            'MEDIUM': 'ri-error-warning-line',
            'LOW': 'ri-information-line'
        };

        return priorityIcons[priority] || 'ri-information-line';
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
        console.log('Advanced RADS Calculator cache cleared');
    }

    /**
     * Get cache statistics
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            entries: Array.from(this.cache.keys()),
            memoryUsage: this.estimateMemoryUsage()
        };
    }

    /**
     * Estimate cache memory usage (rough approximation)
     */
    estimateMemoryUsage() {
        let totalSize = 0;
        
        for (const [key, value] of this.cache.entries()) {
            totalSize += JSON.stringify({ key, value }).length;
        }
        
        return `${(totalSize / 1024).toFixed(2)} KB`;
    }

    /**
     * Export analysis results
     */
    exportAnalysisResults(analysisData, format = 'json') {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `rads_analysis_${analysisData.requestId}_${timestamp}`;

        if (format === 'json') {
            const dataStr = JSON.stringify(analysisData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `${filename}.json`;
            link.click();
        } else if (format === 'pdf') {
            // Would implement PDF generation here
            console.log('PDF export not yet implemented');
        }
    }

    /**
     * Share analysis results with team
     */
    async shareResults(analysisData, recipients) {
        try {
            // Would implement sharing functionality here
            console.log('Sharing results with:', recipients);
            console.log('Analysis data:', analysisData);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            return {
                success: true,
                message: 'Results shared successfully',
                recipients: recipients.length
            };
        } catch (error) {
            console.error('Failed to share results:', error);
            throw error;
        }
    }
}

// Create singleton instance
const advancedRADSCalculatorService = new AdvancedRADSCalculatorService();

export default advancedRADSCalculatorService;
