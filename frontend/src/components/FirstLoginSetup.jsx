import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import { AUTH_ENDPOINTS, buildApiUrl } from '../services/apiConstants';
import { Eye, EyeOff, Lock, Shield, AlertCircle, CheckCircle } from 'lucide-react';

const FirstLoginSetup = ({ email, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        email: email,
        current_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [passwordStrength, setPasswordStrength] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isValidating, setIsValidating] = useState(false);

    // Real-time password validation
    useEffect(() => {
        if (formData.new_password) {
            setIsValidating(true);
            const debounceTimer = setTimeout(async () => {
                try {
                    const response = await apiClient.post(buildApiUrl(AUTH_ENDPOINTS.VALIDATE_PASSWORD), {
                        password: formData.new_password
                    });
                    setPasswordStrength(response.data.strength);
                } catch (error) {
                    console.error('Password validation error:', error);
                }
                setIsValidating(false);
            }, 500);

            return () => clearTimeout(debounceTimer);
        } else {
            setPasswordStrength(null);
        }
    }, [formData.new_password]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        setError('');
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const getPasswordStrengthColor = (score) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        if (score >= 40) return 'text-orange-600';
        return 'text-red-600';
    };

    const getPasswordStrengthBg = (score) => {
        if (score >= 80) return 'bg-green-500';
        if (score >= 60) return 'bg-yellow-500';
        if (score >= 40) return 'bg-orange-500';
        return 'bg-red-500';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validate passwords match
        if (formData.new_password !== formData.confirm_password) {
            setError('New passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const response = await apiClient.post(buildApiUrl(AUTH_ENDPOINTS.COMPLETE_FIRST_LOGIN), formData);
            
            if (response.data.success) {
                onSuccess({
                    message: response.data.message,
                    user_info: response.data.user_info,
                    password_strength: response.data.password_strength
                });
            }
        } catch (error) {
            console.error('First login setup error:', error);
            setError(error.response?.data?.error || 'Failed to complete first login setup');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Shield className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        First Login Setup
                    </h1>
                    <p className="text-gray-600">
                        For security, please change your temporary password
                    </p>
                    <p className="text-sm text-blue-600 mt-2 font-medium">
                        Welcome, {email}
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                        <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                        <div className="text-red-700">{error}</div>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Current Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password (from email)
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.current ? "text" : "password"}
                                value={formData.current_password}
                                onChange={(e) => handleInputChange('current_password', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                                placeholder="Enter your current password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('current')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.new ? "text" : "password"}
                                value={formData.new_password}
                                onChange={(e) => handleInputChange('new_password', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                                placeholder="Enter your new password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('new')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        {/* Password Strength Indicator */}
                        {formData.new_password && (
                            <div className="mt-3">
                                {isValidating ? (
                                    <div className="text-sm text-gray-500">Validating password strength...</div>
                                ) : passwordStrength ? (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-700">
                                                Strength: {passwordStrength.strength}
                                            </span>
                                            <span className={`text-sm font-medium ${getPasswordStrengthColor(passwordStrength.score)}`}>
                                                {passwordStrength.score}/100
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthBg(passwordStrength.score)}`}
                                                style={{ width: `${passwordStrength.score}%` }}
                                            ></div>
                                        </div>
                                        {passwordStrength.feedback && passwordStrength.feedback.length > 0 && (
                                            <div className="text-xs text-gray-600">
                                                <div className="font-medium mb-1">Suggestions:</div>
                                                <ul className="list-disc list-inside space-y-1">
                                                    {passwordStrength.feedback.map((feedback, index) => (
                                                        <li key={index}>{feedback}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ) : null}
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.confirm ? "text" : "password"}
                                value={formData.confirm_password}
                                onChange={(e) => handleInputChange('confirm_password', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                                placeholder="Confirm your new password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('confirm')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        {/* Password Match Indicator */}
                        {formData.confirm_password && (
                            <div className="mt-2 flex items-center">
                                {formData.new_password === formData.confirm_password ? (
                                    <div className="flex items-center text-green-600">
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        <span className="text-sm">Passwords match</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center text-red-600">
                                        <AlertCircle className="w-4 h-4 mr-2" />
                                        <span className="text-sm">Passwords do not match</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Password Requirements */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                            <li>• At least 8 characters long</li>
                            <li>• Contains uppercase and lowercase letters</li>
                            <li>• Contains at least one number</li>
                            <li>• Contains at least one special character</li>
                            <li>• Different from your current password</li>
                        </ul>
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-4 pt-6">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !formData.current_password || !formData.new_password || !formData.confirm_password || formData.new_password !== formData.confirm_password}
                            className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Setting up...
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <Lock className="w-4 h-4 mr-2" />
                                    Complete Setup
                                </div>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FirstLoginSetup;
