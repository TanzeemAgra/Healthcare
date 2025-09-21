// Run this in browser console after opening http://localhost:5173
// This will log in the super admin and redirect to dashboard

async function loginSuperAdmin() {
    try {
        console.log('🔄 Logging in super admin...');
        
        const response = await fetch('http://localhost:8000/api/auth/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'mastermind@xerxez.com',
                password: 'Tanzilla@tanzeem786'
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Store authentication data exactly as the frontend expects
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('access_token', data.token);
            
            console.log('✅ Login successful!');
            console.log('👤 User:', data.user);
            
            // Reload the page to trigger auth context update
            window.location.reload();
            
        } else {
            console.error('❌ Login failed:', data);
        }
    } catch (error) {
        console.error('❌ Login error:', error);
    }
}

// Auto-execute the login
loginSuperAdmin();
