// Permission Test Script for DNA Sequencing Module
// This script can be run in browser console to test permissions

const testDNASequencingPermissions = () => {
    console.log('=== DNA Sequencing Permission Test ===');
    
    // Test 1: Check if permission functions exist
    const permissionContext = window.React?.useContext || null;
    if (!permissionContext) {
        console.error('❌ React context not accessible in console');
        return;
    }
    
    // Test 2: Check localStorage for user data
    const userData = localStorage.getItem('user');
    console.log('📋 User Data from localStorage:', userData ? JSON.parse(userData) : 'No user data');
    
    // Test 3: Check dashboard features
    const dashboardFeatures = localStorage.getItem('dashboardFeatures');
    console.log('🎛️ Dashboard Features:', dashboardFeatures ? JSON.parse(dashboardFeatures) : 'No dashboard features');
    
    // Test 4: Check if DNA sequencing module is enabled
    if (dashboardFeatures) {
        const features = JSON.parse(dashboardFeatures);
        if (features.dna_sequencing_module) {
            console.log('✅ DNA Sequencing Module: ENABLED');
        } else {
            console.log('❌ DNA Sequencing Module: DISABLED');
        }
    }
    
    // Test 5: Check current route access
    const currentPath = window.location.pathname;
    console.log('🌐 Current Path:', currentPath);
    
    if (currentPath.includes('dna-sequencing')) {
        console.log('✅ Successfully accessing DNA sequencing route');
    } else {
        console.log('ℹ️ Not currently on DNA sequencing route');
    }
    
    // Test 6: Check permission function naming
    console.log('🔍 Testing permission function availability...');
    console.log('You can test these in the PermissionDebugger component at /dna-sequencing/dashboard');
    
    return {
        userData: userData ? JSON.parse(userData) : null,
        dashboardFeatures: dashboardFeatures ? JSON.parse(dashboardFeatures) : null,
        currentPath,
        dnaSequencingEnabled: dashboardFeatures ? JSON.parse(dashboardFeatures).dna_sequencing_module : false
    };
};

// Instructions for running this test
console.log(`
🧪 DNA Sequencing Permission Test Ready!

To run the test:
1. Open browser console (F12)
2. Navigate to: http://localhost:5173/dna-sequencing/dashboard
3. Run: testDNASequencingPermissions()

Expected for Super Admin:
✅ DNA Sequencing Module: ENABLED
✅ Successfully accessing DNA sequencing route
✅ User role: super_admin
✅ All dashboard features enabled
`);

// Export for browser console
if (typeof window !== 'undefined') {
    window.testDNASequencingPermissions = testDNASequencingPermissions;
}

export default testDNASequencingPermissions;
