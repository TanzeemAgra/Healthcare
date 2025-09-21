// Test the API service
import advancedPatientAPI from '../services/advancedPatientAPI';

// Test function to verify API integration
const testAPIConnection = async () => {
  try {
    console.log('Testing Advanced Patient API...');
    
    // Test dashboard stats
    const stats = await advancedPatientAPI.getDashboardStats();
    console.log('Dashboard Stats:', stats);
    
    // Test getting admissions
    const admissions = await advancedPatientAPI.getAdmissions({ active_only: true });
    console.log('Active Admissions:', admissions);
    
    console.log('API integration test completed successfully!');
    return true;
  } catch (error) {
    console.error('API integration test failed:', error);
    return false;
  }
};

export { testAPIConnection };
