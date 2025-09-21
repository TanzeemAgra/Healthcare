/**
 * Feature Access Utility
 * Handles checking user access to different features/modules
 */

// Feature definitions with their routes and requirements
export const FEATURES = {
  medicine: {
    name: 'General Medicine',
    routes: ['/medicine', '/medical-records', '/prescriptions'],
    icon: 'ri-stethoscope-line',
    color: '#28a745'
  },
  dentistry: {
    name: 'Dentistry',
    routes: ['/dentistry', '/dental-records'],
    icon: 'ri-tooth-line',
    color: '#17a2b8'
  },
  dermatology: {
    name: 'Dermatology',
    routes: ['/dermatology', '/skin-care'],
    icon: 'ri-user-heart-line',
    color: '#fd7e14'
  },
  pathology: {
    name: 'Pathology',
    routes: ['/pathology', '/lab-tests'],
    icon: 'ri-test-tube-line',
    color: '#6f42c1'
  },
  radiology: {
    name: 'Radiology',
    routes: ['/radiology', '/imaging'],
    icon: 'ri-scan-line',
    color: '#20c997'
  },
  patients: {
    name: 'Patient Management',
    routes: ['/patients', '/patient-records'],
    icon: 'ri-team-line',
    color: '#007bff'
  },
  appointments: {
    name: 'Appointments',
    routes: ['/appointments', '/schedule'],
    icon: 'ri-calendar-line',
    color: '#ffc107'
  },
  billing: {
    name: 'Billing & Payments',
    routes: ['/billing', '/payments', '/invoices'],
    icon: 'ri-money-dollar-circle-line',
    color: '#dc3545'
  },
  reports: {
    name: 'Reports & Analytics',
    routes: ['/reports', '/analytics', '/dashboard'],
    icon: 'ri-bar-chart-line',
    color: '#6c757d'
  },
  pharmacy: {
    name: 'Pharmacy',
    routes: ['/pharmacy', '/medications'],
    icon: 'ri-capsule-line',
    color: '#e83e8c'
  },
  hospital: {
    name: 'Hospital Management',
    routes: ['/admin', '/management'],
    icon: 'ri-hospital-line',
    color: '#495057'
  },
  subscriptions: {
    name: 'Subscriptions',
    routes: ['/subscriptions', '/plans'],
    icon: 'ri-vip-crown-line',
    color: '#fd7e14'
  }
};

/**
 * Check if user has access to a specific feature
 * @param {Object} user - User object from Redux store
 * @param {string} featureCode - Feature code to check
 * @returns {boolean} - Whether user has access
 */
export const hasFeatureAccess = (user, featureCode) => {
  // Super admins have access to everything
  if (user?.role === 'super_admin' || user?.is_superuser) {
    return true;
  }

  // Check if user has the feature in their enabled features
  if (user?.enabled_features && Array.isArray(user.enabled_features)) {
    return user.enabled_features.includes(featureCode);
  }

  // Fallback: Check by role for basic access
  const roleFeatures = {
    admin: ['hospital', 'patients', 'appointments', 'reports', 'billing'],
    doctor: ['medicine', 'patients', 'appointments', 'reports'],
    nurse: ['patients', 'appointments', 'medicine'],
    patient: ['appointments'],
    pharmacist: ['pharmacy', 'patients', 'medicine']
  };

  return roleFeatures[user?.role]?.includes(featureCode) || false;
};

/**
 * Check if user has access to a specific route
 * @param {Object} user - User object from Redux store
 * @param {string} route - Route path to check
 * @returns {boolean} - Whether user has access
 */
export const hasRouteAccess = (user, route) => {
  // Super admins have access to everything
  if (user?.role === 'super_admin' || user?.is_superuser) {
    return true;
  }

  // Check each feature to see if the route belongs to it
  for (const [featureCode, feature] of Object.entries(FEATURES)) {
    if (feature.routes.some(r => route.startsWith(r))) {
      return hasFeatureAccess(user, featureCode);
    }
  }

  return false;
};

/**
 * Get all features user has access to
 * @param {Object} user - User object from Redux store
 * @returns {Array} - Array of accessible features
 */
export const getUserAccessibleFeatures = (user) => {
  return Object.keys(FEATURES).filter(featureCode => 
    hasFeatureAccess(user, featureCode)
  );
};

/**
 * Filter navigation items based on user access
 * @param {Array} navItems - Navigation items array
 * @param {Object} user - User object from Redux store
 * @returns {Array} - Filtered navigation items
 */
export const filterNavigationByAccess = (navItems, user) => {
  return navItems.filter(item => {
    // If item has a feature requirement, check access
    if (item.feature) {
      return hasFeatureAccess(user, item.feature);
    }
    
    // If item has a route, check route access
    if (item.path) {
      return hasRouteAccess(user, item.path);
    }
    
    // If no specific requirements, allow access
    return true;
  });
};

/**
 * Create a feature access middleware for protecting routes
 * @param {string} requiredFeature - Feature required for the route
 * @returns {Function} - Middleware function
 */
export const createFeatureMiddleware = (requiredFeature) => {
  return (user) => {
    if (!hasFeatureAccess(user, requiredFeature)) {
      throw new Error(`Access denied: ${requiredFeature} feature required`);
    }
    return true;
  };
};

/**
 * Get feature display information
 * @param {string} featureCode - Feature code
 * @returns {Object} - Feature display info
 */
export const getFeatureInfo = (featureCode) => {
  return FEATURES[featureCode] || {
    name: featureCode,
    icon: 'ri-apps-line',
    color: '#6c757d'
  };
};

export default {
  FEATURES,
  hasFeatureAccess,
  hasRouteAccess,
  getUserAccessibleFeatures,
  filterNavigationByAccess,
  createFeatureMiddleware,
  getFeatureInfo
};
