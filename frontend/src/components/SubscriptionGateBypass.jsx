import React from 'react';

// TEMPORARY: Super Admin Access - Always grant access for debugging
const SubscriptionGate = ({ children, serviceName }) => {
  console.log(`SubscriptionGate BYPASS: Granting access to ${serviceName}`);
  
  // Always render children - complete bypass for super admin testing
  return <>{children}</>;
};

export default SubscriptionGate;
