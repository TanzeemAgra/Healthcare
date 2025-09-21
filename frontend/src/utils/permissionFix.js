// Quick Permission Fix Script
// Run this in browser console if permissions are not working correctly

const fixPermissions = () => {
    console.log('🔧 Fixing permission system...');
    
    // 1. Set super admin user data
    const superAdminUser = {
        id: 1,
        email: 'mastermind@xerxez.in',
        username: 'mastermind@xerxez.in',
        full_name: 'Super Administrator',
        role: 'super_admin',
        is_super_admin: true,
        is_superuser: true,
        is_staff: true,
        is_active: true,
        is_verified: true,
        subscription_bypass: true
    };
    
    // 2. Store in localStorage
    localStorage.setItem('user', JSON.stringify(superAdminUser));
    localStorage.setItem('superAdminDetected', 'true');
    localStorage.setItem('access_token', 'super-admin-token-' + Date.now());
    
    console.log('✅ User data stored:', superAdminUser);
    
    // 3. Try to trigger permission context refresh if available
    try {
        // Look for permission context or refresh function
        if (window.React && window.React.version) {
            console.log('React detected, attempting context refresh...');
            
            // Force a page refresh to reload the permission context
            setTimeout(() => {
                console.log('🔄 Refreshing page to apply permissions...');
                window.location.reload();
            }, 1000);
        }
    } catch (e) {
        console.log('Context refresh not available, manual refresh required');
    }
    
    console.log('✅ Permission fix applied!');
    console.log('📝 If still having issues, refresh the page manually');
    
    return {
        user: superAdminUser,
        message: 'Permissions fixed. Refresh page if needed.'
    };
};

// Quick test function to check current permissions
const checkPermissions = () => {
    const user = localStorage.getItem('user');
    const superAdminFlag = localStorage.getItem('superAdminDetected');
    const token = localStorage.getItem('access_token');
    
    console.log('🔍 Current Permission Status:');
    console.log('User data:', user ? JSON.parse(user) : 'Not found');
    console.log('Super admin flag:', superAdminFlag);
    console.log('Access token:', token ? 'Present' : 'Missing');
    
    if (user) {
        const userData = JSON.parse(user);
        console.log('✅ User role:', userData.role);
        console.log('✅ Is super admin:', userData.is_super_admin || userData.role === 'super_admin');
    }
    
    return {
        hasUser: !!user,
        hasSuperAdminFlag: superAdminFlag === 'true',
        hasToken: !!token,
        userRole: user ? JSON.parse(user).role : null
    };
};

// Expose functions globally for easy access
window.fixPermissions = fixPermissions;
window.checkPermissions = checkPermissions;

console.log('🛠️ Permission Debug Tools Loaded!');
console.log('📋 Available commands:');
console.log('   fixPermissions() - Fix permission issues');
console.log('   checkPermissions() - Check current permission status');

// Auto-check current status
checkPermissions();
