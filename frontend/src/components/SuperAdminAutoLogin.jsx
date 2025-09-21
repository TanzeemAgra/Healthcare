import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const SuperAdminAutoLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🚀 SuperAdminAutoLogin - Starting auto-login process');
    
    // Create super admin user data
    const superAdminUser = {
      id: 1,
      email: 'mastermind@xerxez.in',
      username: 'mastermind@xerxez.in',
      full_name: 'Super Administrator',
      role: 'super_admin',
      is_super_admin: true,
      is_superuser: true,
      is_staff: true,
      permissions: {
        can_manage_users: true,
        can_view_financial_data: true,
        can_handle_emergencies: true,
        can_access_medical_records: true,
        can_manage_inventory: true,
        can_view_analytics: true,
        can_manage_system: true,
        can_export_data: true,
        can_manage_permissions: true,
        can_delete_records: true
      }
    };

    // Generate fake tokens
    const fakeAccessToken = 'super-admin-access-token-' + Date.now();
    const fakeRefreshToken = 'super-admin-refresh-token-' + Date.now();

    // Set up all necessary storage items
    localStorage.setItem('user', JSON.stringify(superAdminUser));
    localStorage.setItem('access_token', fakeAccessToken);
    localStorage.setItem('refresh_token', fakeRefreshToken);
    localStorage.setItem('token', fakeAccessToken);
    localStorage.setItem('authToken', fakeAccessToken);
    localStorage.setItem('superAdminDetected', 'true');
    
    // Set session storage as backup
    sessionStorage.setItem('user', JSON.stringify(superAdminUser));
    sessionStorage.setItem('superAdminDetected', 'true');

    // Dispatch login success to Redux
    dispatch(loginSuccess({
      user: superAdminUser,
      token: fakeAccessToken
    }));

    console.log('✅ SuperAdminAutoLogin - Auto-login completed');
    console.log('✅ User data set in localStorage and Redux');
    console.log('✅ Super admin flags set');
    
    // Navigate to SecureNeat dashboard after a short delay
    setTimeout(() => {
      console.log('🎯 Redirecting to SecureNeat dashboard...');
      navigate('/SecureNeat/dashboard');
    }, 1000);

  }, [dispatch, navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div 
          style={{ 
            width: '50px', 
            height: '50px', 
            border: '5px solid #f3f3f3',
            borderTop: '5px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}
        ></div>
        <h3>🔐 Super Admin Auto-Login</h3>
        <p>Setting up super administrator access...</p>
        <small style={{ color: '#666' }}>
          Email: mastermind@xerxez.in<br/>
          Role: Super Administrator<br/>
          Redirecting to SecureNeat Dashboard...
        </small>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SuperAdminAutoLogin;
