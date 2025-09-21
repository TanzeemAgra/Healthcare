/**
 * DNA Sequencing Module Permissions Configuration
 * Soft-coded permission mappings for easy maintenance
 */

// Permission configuration for DNA Sequencing module
export const DNA_SEQUENCING_PERMISSIONS = {
  // Module access permission
  MODULE_ACCESS: {
    key: 'canAccessDnaSequencingModule',
    displayName: 'DNA Sequencing Module Access',
    description: 'Access to DNA sequencing analysis and AI genomics laboratory',
    requiredRoles: ['super_admin', 'admin'],
    bypassForSuperAdmin: true
  },
  
  // AI Lab access permission
  AI_LAB_ACCESS: {
    key: 'canAccessAIGenomicsLab',
    displayName: 'AI Genomics Laboratory Access',
    description: 'Access to advanced AI-powered genomic analysis tools',
    requiredRoles: ['super_admin', 'admin', 'researcher'],
    bypassForSuperAdmin: true
  },
  
  // Analysis permissions
  VARIANT_ANALYSIS: {
    key: 'canPerformVariantAnalysis',
    displayName: 'Variant Analysis Permission',
    description: 'Permission to run variant calling and analysis',
    requiredRoles: ['super_admin', 'admin', 'researcher', 'analyst'],
    bypassForSuperAdmin: true
  },
  
  // Report permissions
  GENERATE_REPORTS: {
    key: 'canGenerateGenomicReports',
    displayName: 'Generate Genomic Reports',
    description: 'Permission to generate and export genomic analysis reports',
    requiredRoles: ['super_admin', 'admin', 'researcher'],
    bypassForSuperAdmin: true
  }
};

// Dashboard feature mapping for DNA Sequencing
export const DNA_SEQUENCING_FEATURES = {
  MODULE: 'dna_sequencing_module',
  AI_LAB: 'ai_genomics_lab',
  VARIANT_CALLING: 'variant_calling_feature',
  QUALITY_CONTROL: 'quality_control_feature',
  SAMPLE_MANAGEMENT: 'sample_management_feature',
  REPORTS: 'genomic_reports_feature'
};

// Super admin bypass configuration
export const SUPER_ADMIN_BYPASS = {
  enabled: true,
  roles: ['super_admin'],
  properties: ['is_superuser', 'is_staff'],
  debugMode: process.env.NODE_ENV === 'development'
};

// Permission check helper function
export const checkDNASequencingPermission = (user, permissionKey, dashboardFeatures = {}) => {
  if (!user) return false;
  
  // Super admin bypass
  if (SUPER_ADMIN_BYPASS.enabled) {
    if (SUPER_ADMIN_BYPASS.roles.includes(user.role) || 
        SUPER_ADMIN_BYPASS.roles.includes(user.user_role) ||
        SUPER_ADMIN_BYPASS.properties.some(prop => user[prop])) {
      if (SUPER_ADMIN_BYPASS.debugMode) {
        console.log(`🧬 DNA Sequencing Permission: Super admin bypass for ${permissionKey}`);
      }
      return true;
    }
  }
  
  // Check dashboard features
  const featureKey = DNA_SEQUENCING_FEATURES.MODULE;
  if (dashboardFeatures[featureKey]) {
    return true;
  }
  
  // Role-based check
  const permission = Object.values(DNA_SEQUENCING_PERMISSIONS)
    .find(p => p.key === permissionKey);
    
  if (permission && user.role) {
    return permission.requiredRoles.includes(user.role);
  }
  
  return false;
};

// Generate all DNA sequencing permissions dynamically
export const generateDNASequencingPermissions = (user, dashboardFeatures = {}) => {
  const permissions = {};
  
  Object.values(DNA_SEQUENCING_PERMISSIONS).forEach(permission => {
    permissions[permission.key] = () => checkDNASequencingPermission(
      user, 
      permission.key, 
      dashboardFeatures
    );
  });
  
  return permissions;
};
