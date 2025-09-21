// Emergency Login Script for Super Admin
// Run this in browser console to log in the super admin user

const emergencyLogin = async () => {
    try {
        console.log('🚀 Starting emergency super admin login...');
        
        const loginData = {
            email: 'mastermind@xerxez.in',
            password: 'password123'
        };
        
        console.log('📡 Attempting login with backend...');
        
        // First, get CSRF token
    const csrfResponse = await fetch('/api/hospital/management/debug/auth/', {
            method: 'GET',
            credentials: 'include'
        });
        
        console.log('🔐 CSRF Response:', csrfResponse.status);
        
        // Try to login
    const loginResponse = await fetch('/api/auth/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(loginData)
        });
        
        const loginResult = await loginResponse.json();
        console.log('✅ Login response:', loginResult);
        
        if (loginResult.success) {
            console.log('✅ Login successful!');
            
            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(loginResult.user));
            localStorage.setItem('superAdminDetected', 'true');
            
            console.log('✅ User data stored in localStorage');
            console.log('🔄 Refreshing page...');
            
            // Refresh the page
            window.location.reload();
        } else {
            console.error('❌ Login failed:', loginResult.error);
        }
        
    } catch (error) {
        console.error('❌ Emergency login failed:', error);
        
        // Fallback: try to set up frontend-only session
        console.log('🔄 Attempting frontend-only setup...');
        
        const superAdminUser = {
            id: 1,
            email: 'mastermind@xerxez.in',
            username: 'mastermind@xerxez.in',
            full_name: 'Super Administrator',
            role: 'super_admin',
            is_superuser: true,
            is_staff: true,
            is_active: true,
            is_verified: true,
            subscription_bypass: true
        };
        
        localStorage.setItem('user', JSON.stringify(superAdminUser));
        localStorage.setItem('superAdminDetected', 'true');
        
        console.log('⚠️ Frontend-only setup complete. Backend authentication may still be required.');
        console.log('🔄 Refreshing page...');
        window.location.reload();
    }
};

// Run the emergency login
emergencyLogin();
