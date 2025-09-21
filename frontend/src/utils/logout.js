/**
 * Comprehensive logout utility function
 * This function ensures complete cleanup of authentication state
 */
import apiClient from '../services/api';

export const performLogout = async (dispatch, navigate, authContextLogout = null) => {
  console.log('🔄 performLogout called with:');
  console.log('- dispatch:', !!dispatch);
  console.log('- navigate:', !!navigate);
  console.log('- authContextLogout:', !!authContextLogout);
  
  try {
    // 1. Call backend logout API to invalidate server-side session
    const accessToken = localStorage.getItem('access_token') || localStorage.getItem('accessToken');
    console.log('- accessToken found:', !!accessToken);
    
    if (accessToken) {
      try {
        console.log('🌐 Calling backend logout API...');
        await apiClient.logout();
        console.log('✅ Backend logout successful');
      } catch (apiError) {
        console.warn('⚠️ Backend logout failed, proceeding with client-side logout:', apiError.message);
      }
    }

    // 2. Clear all possible authentication-related localStorage items
    console.log('🧹 Clearing localStorage...');
    const authKeys = [
      'user',
      'access_token',
      'refresh_token',
      'token',
      'authToken',
      'accessToken',
      'refreshToken',
      'selectedPlan',
      'selectedPlanId',
      'paymentVerification',
      'customerInfo',
      'userRole',
    ];

    authKeys.forEach(key => {
      const existed = localStorage.getItem(key) !== null;
      localStorage.removeItem(key);
      if (existed) console.log(`  - Removed: ${key}`);
    });

    // 3. Clear sessionStorage as well (in case any auth data is stored there)
    console.log('🧹 Clearing sessionStorage...');
    const sessionAuthKeys = [
      'user',
      'access_token',
      'refresh_token',
      'token',
      'authToken',
    ];

    sessionAuthKeys.forEach(key => {
      const existed = sessionStorage.getItem(key) !== null;
      sessionStorage.removeItem(key);
      if (existed) console.log(`  - Removed from session: ${key}`);
    });

    // 4. Call AuthContext logout if available
    if (authContextLogout) {
      console.log('🔄 Calling AuthContext logout...');
      authContextLogout();
      console.log('✅ AuthContext logout called');
    }

    // 5. Dispatch Redux logout action
    if (dispatch) {
      console.log('🔄 Dispatching Redux logout...');
      dispatch({ type: 'auth/logout' });
      console.log('✅ Redux logout dispatched');
    } else {
      console.warn('⚠️ No dispatch function provided');
    }

    console.log('✅ Logout completed successfully');

    // 6. Navigate to login page (with a slight delay to ensure state is updated)
    setTimeout(() => {
      console.log('🔄 Navigating to login...');
      if (navigate) {
        navigate('/login', { replace: true });
        console.log('✅ Navigation attempted');
      } else {
        console.log('🔄 Using window.location fallback...');
        window.location.href = '/login';
      }
    }, 100);
    
  } catch (error) {
    console.error('❌ Error during logout:', error);
    
    // Even if there's an error, still clear client-side state
    localStorage.clear(); // Nuclear option - clear everything
    sessionStorage.clear(); // Clear session storage too
    
    if (dispatch) {
      dispatch({ type: 'auth/logout' });
    }
    
    // Force navigation to login page
    setTimeout(() => {
      if (navigate) {
        navigate('/login', { replace: true });
      } else {
        window.location.href = '/login';
      }
    }, 100);
  }
};

export default performLogout;
