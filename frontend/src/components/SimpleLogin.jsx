import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePermissions } from '../contexts/PermissionContext';

const SimpleLogin = () => {
  const [email, setEmail] = useState('mastermind@xerxez.com');
  const [password, setPassword] = useState('Tanzilla@tanzeem786');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const { login } = useAuth();
  const { refreshPermissions } = usePermissions();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const result = await login(email, password);
      if (result.success) {
        setMessage('✅ Login successful! Refreshing permissions...');
        
        // Refresh permissions after login
        try {
          await refreshPermissions();
          setMessage('✅ Login successful! Redirecting...');
        } catch (permError) {
          console.error('Permission refresh failed:', permError);
          setMessage('✅ Login successful! Redirecting...');
        }
        
        setTimeout(() => {
          window.location.href = '/radiology/analyze-report';
        }, 1000);
      } else {
        setMessage(`❌ Login failed: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Login error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '50px auto', 
      padding: '20px', 
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h2>🔐 Quick Super Admin Login</h2>
      <p>Pre-filled with super admin credentials for testing</p>
      
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginTop: '5px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginTop: '5px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Logging in...' : 'Login as Super Admin'}
        </button>
      </form>

      {message && (
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          borderRadius: '4px',
          backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
          color: message.includes('✅') ? '#155724' : '#721c24',
          border: message.includes('✅') ? '1px solid #c3e6cb' : '1px solid #f5c6cb'
        }}>
          {message}
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p><strong>Test Links:</strong></p>
        <ul>
          <li><a href="/auth-debug">🔍 Auth Debug</a></li>
          <li><a href="/test-radiology-public">🧪 Public Radiology Test</a></li>
          <li><a href="/radiology/analyze-report">🎯 Target Radiology Page</a></li>
        </ul>
      </div>
    </div>
  );
};

export default SimpleLogin;
