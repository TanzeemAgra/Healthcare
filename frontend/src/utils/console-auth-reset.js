// Browser console script for clearing authentication
// Copy and paste this into the browser console and press Enter

console.log('🔄 Clearing authentication state...');

// Clear localStorage
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
  console.log(`🗑️ Cleared localStorage: ${key}`);
});

// Clear sessionStorage
sessionStorage.clear();
console.log('🗑️ Cleared sessionStorage');

// Clear cookies
document.cookie.split(";").forEach(cookie => {
  const eqPos = cookie.indexOf("=");
  const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=localhost`;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
});
console.log('🗑️ Cleared cookies');

console.log('✅ Authentication state cleared! Redirecting to login...');

// Redirect to login
setTimeout(() => {
  window.location.href = '/auth/login';
}, 1000);
