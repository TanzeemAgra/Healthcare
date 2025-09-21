import React, { useState } from 'react';
import apiClient from '../services/api';

const StandaloneAdminCreation = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        phone_number: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', content: '' });
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // use shared apiClient configured via env/proxy

    const handleLogin = async () => {
        try {
            setLoading(true);
            console.log('🔐 Logging in as super admin...');
            
            const response = await apiClient.post('/auth/login/', {
                email: 'mastermind@xerxez.in',
                password: 'Tanzilla@tanzeem786'
            });

            console.log('✅ Login successful:', response.data);
            
            if (response.data.user?.role === 'super_admin') {
                setIsAuthenticated(true);
                setMessage({ type: 'success', content: '✅ Super admin authentication successful!' });
            } else {
                setMessage({ type: 'error', content: '❌ User is not a super admin' });
            }
        } catch (error) {
            console.error('❌ Login failed:', error);
            setMessage({ 
                type: 'error', 
                content: '❌ Login failed: ' + (error.response?.data?.error || error.message) 
            });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isAuthenticated) {
            setMessage({ type: 'error', content: '❌ Please authenticate first!' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', content: '' });

        try {
            console.log('🚀 Creating admin user...');
            console.log('📝 Form data:', formData);

            const response = await apiClient.post('/hospital/management/users/create-admin/', formData);
            
            console.log('✅ Admin creation response:', response);

            if (response.status === 201 && response.data.success) {
                const createdUser = response.data.user;
                setMessage({ 
                    type: 'success', 
                    content: `🎉 Admin user created successfully! Email: ${createdUser.email}, ID: ${createdUser.id}` 
                });
                
                // Reset form
                setFormData({
                    email: '',
                    password: '',
                    full_name: '',
                    phone_number: ''
                });
            } else {
                setMessage({ 
                    type: 'error', 
                    content: '❌ ' + (response.data.error || 'Failed to create admin user') 
                });
            }
        } catch (error) {
            console.error('❌ Admin creation failed:', error);
            console.error('❌ Error details:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            
            let errorMessage = 'Failed to create admin user';
            
            if (error.response?.status === 404) {
                errorMessage = '❌ Admin creation endpoint not found (404)';
            } else if (error.response?.status === 401) {
                errorMessage = '❌ Authentication failed (401)';
                setIsAuthenticated(false);
            } else if (error.response?.status === 403) {
                errorMessage = '❌ Permission denied (403)';
            } else if (error.response?.data?.error) {
                errorMessage = '❌ ' + error.response.data.error;
            } else if (error.message) {
                errorMessage = '❌ ' + error.message;
            }
            
            setMessage({ type: 'error', content: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2>🛠️ Standalone Admin Creation</h2>
            <p><strong>This component works independently without any complex dependencies.</strong></p>
            
            {/* Authentication Section */}
            {!isAuthenticated && (
                <div style={{ background: '#fff3cd', padding: '15px', margin: '20px 0', borderRadius: '4px', border: '1px solid #ffeaa7' }}>
                    <h4>🔐 Authentication Required</h4>
                    <button 
                        onClick={handleLogin} 
                        disabled={loading}
                        style={{ 
                            background: '#007bff', 
                            color: 'white', 
                            border: 'none', 
                            padding: '10px 20px', 
                            borderRadius: '4px', 
                            cursor: loading ? 'not-allowed' : 'pointer' 
                        }}
                    >
                        {loading ? 'Logging in...' : 'Login as Super Admin'}
                    </button>
                </div>
            )}

            {/* Admin Creation Form */}
            {isAuthenticated && (
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            Email Address *
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                            placeholder="admin@example.com"
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            Password *
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                            placeholder="Secure password"
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            Full Name *
                        </label>
                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleInputChange}
                            required
                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                            placeholder="John Doe"
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleInputChange}
                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                            placeholder="+1234567890"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ 
                            background: loading ? '#ccc' : '#28a745', 
                            color: 'white', 
                            border: 'none', 
                            padding: '12px 24px', 
                            borderRadius: '4px', 
                            cursor: loading ? 'not-allowed' : 'pointer',
                            width: '100%',
                            fontSize: '16px'
                        }}
                    >
                        {loading ? 'Creating Admin...' : 'Create Admin User'}
                    </button>
                </form>
            )}

            {/* Message Display */}
            {message.content && (
                <div style={{ 
                    margin: '20px 0', 
                    padding: '15px', 
                    borderRadius: '4px',
                    backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
                    color: message.type === 'success' ? '#155724' : '#721c24',
                    border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
                }}>
                    {message.content}
                </div>
            )}
        </div>
    );
};

export default StandaloneAdminCreation;
