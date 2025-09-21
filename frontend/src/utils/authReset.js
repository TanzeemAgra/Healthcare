// Emergency authentication reset utility
export const resetAuthenticationState = () => {
  console.log('🔄 Resetting authentication state...');
  
  // Clear all localStorage auth items
  const authKeys = [
    'user',
    'access_token',
    'refresh_token',
    'token',
    'authToken',
    'accessToken',
    'refreshToken',
    'sessionAuthenticated',
    'selectedPlan',
    'selectedPlanId',
    'paymentVerification',
    'customerInfo',
    'userRole',
    'superAdminDetected'
  ];
  
  authKeys.forEach(key => {
    localStorage.removeItem(key);
    console.log(`🗑️ Cleared: ${key}`);
  });
  
  // Clear sessionStorage
  sessionStorage.clear();
  console.log('🗑️ Cleared sessionStorage');
  
  // Clear cookies (best effort)
  document.cookie.split(";").forEach(cookie => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=localhost`;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  });
  console.log('🗑️ Cleared cookies');
  
  console.log('✅ Authentication state reset complete');
  
  // Force page reload to ensure clean state
  window.location.href = '/auth/login';
};

// Function to check if current auth is demo mode
export const isDemoMode = () => {
  const token = localStorage.getItem('access_token') || localStorage.getItem('token');
  return token && (token.startsWith('demo-') || token === 'session-based-auth');
};

// Function to validate current authentication
export const validateCurrentAuth = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/auth/verify/', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token') || localStorage.getItem('token')}`
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error('Auth validation failed:', error);
    return false;
  }
};

export default { resetAuthenticationState, isDemoMode, validateCurrentAuth };
