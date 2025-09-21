// Permission Reset Script
// Run this to properly reset permissions and ensure role separation

const resetPermissions = () => {
    console.log('🔒 Resetting permissions to enforce role separation...');
    
    // Get current user
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
        console.log('❌ No user found in localStorage');
        return;
    }
    
    const userData = JSON.parse(storedUser);
    console.log('👤 Current user:', userData.email, 'Role:', userData.role);
    
    // Clear any existing superAdminDetected flags for non-super admin users
    if (userData.email !== 'mastermind@xerxez.in' && userData.role !== 'super_admin') {
        console.log('🧹 Clearing superAdminDetected flag for regular admin');
        localStorage.removeItem('superAdminDetected');
    }
    
    // Set role-appropriate permissions based on actual role
    if (userData.role === 'super_admin' && userData.email === 'mastermind@xerxez.in') {
        console.log('✅ Confirmed Super Admin - maintaining full permissions');
        localStorage.setItem('superAdminDetected', 'true');
    } else if (userData.role === 'admin') {
        console.log('⚠️ Regular Admin - setting limited permissions');
        
        // Update user data to ensure no super admin flags
        const cleanUserData = {
            ...userData,
            is_super_admin: false,
            role: 'admin'
        };
        
        localStorage.setItem('user', JSON.stringify(cleanUserData));
        localStorage.removeItem('superAdminDetected');
        
        console.log('📝 Admin permissions:');
        console.log('  ✅ User Management: Yes');
        console.log('  ✅ View Reports: Yes');
        console.log('  ❌ Create Admins: NO');
        console.log('  ❌ System Settings: NO');
        console.log('  ❌ Billing Access: NO');
        console.log('  ❌ Medical Modules: NO');
    }
    
    console.log('🔄 Refreshing page to apply new permissions...');
    setTimeout(() => {
        window.location.reload();
    }, 2000);
};

// Function to check what a user should be able to access
const checkRolePermissions = (userRole, email) => {
    console.log(`📋 Expected permissions for ${userRole} (${email}):`);
    
    if (userRole === 'super_admin' && email === 'mastermind@xerxez.in') {
        console.log('🔓 SUPER ADMIN - Full Access:');
        console.log('  ✅ Create/manage all users including admins');
        console.log('  ✅ Access all medical modules');
        console.log('  ✅ System settings and billing');
        console.log('  ✅ All dashboard features');
    } else if (userRole === 'admin') {
        console.log('🔒 REGULAR ADMIN - Limited Access:');
        console.log('  ✅ User management (patients, doctors, nurses)');
        console.log('  ✅ View reports');
        console.log('  ❌ Cannot create other admins');
        console.log('  ❌ No system settings access');
        console.log('  ❌ No billing/financial access');
        console.log('  ❌ Limited medical module access');
    } else {
        console.log('👤 OTHER ROLES - Role-specific access only');
    }
};

// Function to verify current access matches expected role
const verifyRoleAccess = () => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
        console.log('❌ No user found');
        return;
    }
    
    const userData = JSON.parse(storedUser);
    const superAdminFlag = localStorage.getItem('superAdminDetected');
    
    console.log('🔍 Current Access Analysis:');
    console.log('Email:', userData.email);
    console.log('Role:', userData.role);
    console.log('SuperAdmin Flag:', superAdminFlag);
    console.log('Is Super Admin:', userData.is_super_admin);
    
    // Check for security issues
    if (userData.role === 'admin' && superAdminFlag === 'true') {
        console.log('🚨 SECURITY ISSUE: Regular admin has super admin flag!');
        return false;
    }
    
    if (userData.role === 'admin' && userData.email !== 'mastermind@xerxez.in' && userData.is_super_admin === true) {
        console.log('🚨 SECURITY ISSUE: Regular admin has super admin permissions!');
        return false;
    }
    
    console.log('✅ Role permissions appear correct');
    checkRolePermissions(userData.role, userData.email);
    return true;
};

// Expose functions globally
window.resetPermissions = resetPermissions;
window.verifyRoleAccess = verifyRoleAccess;
window.checkRolePermissions = checkRolePermissions;

console.log('🛡️ Permission Security Tools Loaded!');
console.log('📋 Available commands:');
console.log('   resetPermissions() - Reset permissions based on actual role');
console.log('   verifyRoleAccess() - Check if current access matches role');
console.log('   checkRolePermissions(role, email) - Show expected permissions');

// Auto-verify current access
verifyRoleAccess();
