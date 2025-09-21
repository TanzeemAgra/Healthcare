// Quick Admin Dashboard Access Script
// Open browser console and run this script

console.log('🔧 Super Admin Dashboard Access Script');
console.log('=====================================');

async function quickAdminAccess() {
    try {
        // Step 1: Clear any existing auth data
        console.log('🧹 Clearing existing auth data...');
        localStorage.clear();
        sessionStorage.clear();
        
        // Step 2: Login as super admin
        console.log('🔑 Logging in as super admin...');
        const loginResponse = await fetch('http://localhost:8000/api/auth/login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'mastermind@xerxez.com',
                password: 'Tanzilla@tanzeem786'
            })
        });
        
        const loginData = await loginResponse.json();
        
        if (loginData.success) {
            // Step 3: Store auth data in the exact format React expects
            localStorage.setItem('user', JSON.stringify(loginData.user));
            localStorage.setItem('token', loginData.token);
            localStorage.setItem('access_token', loginData.token);
            localStorage.setItem('isAuthenticated', 'true');
            
            console.log('✅ Login successful!');
            console.log('👤 User:', loginData.user);
            
            // Step 4: Navigate to admin dashboard
            console.log('🚀 Navigating to admin dashboard...');
            window.location.href = 'http://localhost:5173/admin/dashboard';
            
        } else {
            console.error('❌ Login failed:', loginData);
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
        console.log('💡 Make sure backend is running on http://localhost:8000');
    }
}

// Auto-execute
quickAdminAccess();
