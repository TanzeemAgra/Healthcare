// ===============================
// COSMETOLOGY MODULE CONSTANTS
// Soft Coding Implementation for AI-Powered Beauty Solutions
// ===============================

// API Configuration
export const COSMETOLOGY_ENDPOINTS = {
  BASE: '/cosmetology/api',
  CLIENTS: '/cosmetology/api/clients',
  SERVICES: '/cosmetology/api/services',
  PRODUCTS: '/cosmetology/api/products',
  APPOINTMENTS: '/cosmetology/api/appointments',
  TREATMENT_PLANS: '/cosmetology/api/treatment-plans',
  CONSULTATIONS: '/cosmetology/api/consultations',
  PROGRESS: '/cosmetology/api/progress',
  DASHBOARD_STATS: '/cosmetology/api/dashboard-stats',
  CALENDAR: '/cosmetology/api/calendar',
  CLIENT_SEARCH: '/cosmetology/api/client-search',
  SERVICE_RECOMMENDATIONS: '/cosmetology/api/service-recommendations',
  PRODUCT_SEARCH: '/cosmetology/api/product-search',
  
  // Cosmetic Gynecology - Specialized AI Features
  GYNECOLOGY: {
    BASE: '/cosmetology/api/gynecology',
    CLIENTS: '/cosmetology/api/gynecology/clients',
    TREATMENTS: '/cosmetology/api/gynecology/treatments',
    CONSULTATIONS: '/cosmetology/api/gynecology/consultations',
    TREATMENT_PLANS: '/cosmetology/api/gynecology/treatment-plans',
    PROGRESS: '/cosmetology/api/gynecology/progress'
  }
};

// Service Categories with AI Enhancement Levels
export const SERVICE_CATEGORIES = {
  FACIAL: {
    value: 'facial',
    label: 'Facial Treatments',
    icon: 'fas fa-spa',
    color: 'success',
    aiFeatures: ['Skin Analysis', 'Product Recommendation', 'Treatment Optimization'],
    description: 'AI-powered facial treatments with personalized skincare analysis'
  },
  HAIR: {
    value: 'hair',
    label: 'Hair Services',
    icon: 'fas fa-cut',
    color: 'warning',
    aiFeatures: ['Hair Type Analysis', 'Treatment Prediction', 'Damage Assessment'],
    description: 'Advanced hair care with AI-driven treatment recommendations'
  },
  NAILS: {
    value: 'nails',
    label: 'Nail Services',
    icon: 'fas fa-hand-sparkles',
    color: 'info',
    aiFeatures: ['Health Monitoring', 'Design Suggestions', 'Care Planning'],
    description: 'Professional nail care with health monitoring and design AI'
  },
  MAKEUP: {
    value: 'makeup',
    label: 'Makeup Services',
    icon: 'fas fa-palette',
    color: 'pink',
    aiFeatures: ['Color Matching', 'Face Shape Analysis', 'Style Recommendations'],
    description: 'AI-enhanced makeup application with personalized color matching'
  },
  BODY: {
    value: 'body',
    label: 'Body Treatments',
    icon: 'fas fa-body',
    color: 'purple',
    aiFeatures: ['Body Composition Analysis', 'Treatment Planning', 'Progress Tracking'],
    description: 'Comprehensive body treatments with AI-powered progress monitoring'
  },
  LASER: {
    value: 'laser',
    label: 'Laser Treatments',
    icon: 'fas fa-laser',
    color: 'danger',
    aiFeatures: ['Safety Protocols', 'Treatment Optimization', 'Recovery Prediction'],
    description: 'Advanced laser treatments with AI safety and optimization protocols'
  },
  INJECTABLE: {
    value: 'injectable',
    label: 'Injectable Treatments',
    icon: 'fas fa-syringe',
    color: 'dark',
    aiFeatures: ['Dosage Calculation', 'Placement Optimization', 'Result Prediction'],
    description: 'Precision injectable treatments with AI-guided placement and dosing'
  },
  SKINCARE: {
    value: 'skincare',
    label: 'Advanced Skincare',
    icon: 'fas fa-face-smile',
    color: 'light',
    aiFeatures: ['Skin Assessment', 'Product Formulation', 'Routine Optimization'],
    description: 'Clinical-grade skincare with AI-powered product recommendations'
  },
  PERMANENT: {
    value: 'permanent',
    label: 'Permanent Makeup',
    icon: 'fas fa-pen-nib',
    color: 'secondary',
    aiFeatures: ['Shape Analysis', 'Color Matching', 'Symmetry Optimization'],
    description: 'Permanent makeup with AI precision for optimal symmetry and color'
  },
  WELLNESS: {
    value: 'wellness',
    label: 'Wellness & Spa',
    icon: 'fas fa-leaf',
    color: 'success',
    aiFeatures: ['Stress Analysis', 'Wellness Planning', 'Holistic Assessment'],
    description: 'Holistic wellness treatments with AI-driven stress and health analysis'
  }
};

// Client Profile Constants
export const SKIN_TYPES = [
  { value: 'oily', label: 'Oily', characteristics: ['Large pores', 'Shiny appearance', 'Acne-prone'] },
  { value: 'dry', label: 'Dry', characteristics: ['Tight feeling', 'Flaky patches', 'Fine lines'] },
  { value: 'combination', label: 'Combination', characteristics: ['Oily T-zone', 'Dry cheeks', 'Mixed texture'] },
  { value: 'sensitive', label: 'Sensitive', characteristics: ['Easily irritated', 'Redness-prone', 'Reactive'] },
  { value: 'normal', label: 'Normal', characteristics: ['Balanced', 'Smooth texture', 'Even tone'] },
  { value: 'mature', label: 'Mature', characteristics: ['Loss of elasticity', 'Wrinkles', 'Age spots'] }
];

export const HAIR_TYPES = [
  { value: 'straight', label: 'Straight', subcategories: ['Fine', 'Medium', 'Coarse'] },
  { value: 'wavy', label: 'Wavy', subcategories: ['Loose waves', 'Defined waves', 'Strong waves'] },
  { value: 'curly', label: 'Curly', subcategories: ['Loose curls', 'Tight curls', 'Corkscrew curls'] },
  { value: 'coily', label: 'Coily', subcategories: ['Soft coils', 'Wiry coils', 'Tight coils'] },
  { value: 'chemically_treated', label: 'Chemically Treated', subcategories: ['Colored', 'Permed', 'Relaxed'] },
  { value: 'damaged', label: 'Damaged', subcategories: ['Heat damage', 'Chemical damage', 'Environmental damage'] }
];

// Appointment Status with AI Insights
export const APPOINTMENT_STATUS = {
  SCHEDULED: {
    value: 'scheduled',
    label: 'Scheduled',
    color: 'primary',
    icon: 'fas fa-calendar-check',
    aiActions: ['Preparation Reminders', 'Pre-treatment Instructions']
  },
  CONFIRMED: {
    value: 'confirmed',
    label: 'Confirmed',
    color: 'success',
    icon: 'fas fa-check-circle',
    aiActions: ['Treatment Optimization', 'Resource Allocation']
  },
  IN_PROGRESS: {
    value: 'in_progress',
    label: 'In Progress',
    color: 'warning',
    icon: 'fas fa-clock',
    aiActions: ['Real-time Monitoring', 'Progress Tracking']
  },
  COMPLETED: {
    value: 'completed',
    label: 'Completed',
    color: 'success',
    icon: 'fas fa-check-double',
    aiActions: ['Results Analysis', 'Follow-up Planning']
  },
  CANCELLED: {
    value: 'cancelled',
    label: 'Cancelled',
    color: 'danger',
    icon: 'fas fa-times-circle',
    aiActions: ['Rebooking Suggestions', 'Reason Analysis']
  },
  NO_SHOW: {
    value: 'no_show',
    label: 'No Show',
    color: 'dark',
    icon: 'fas fa-user-slash',
    aiActions: ['Follow-up Protocol', 'Risk Assessment']
  },
  RESCHEDULED: {
    value: 'rescheduled',
    label: 'Rescheduled',
    color: 'info',
    icon: 'fas fa-calendar-alt',
    aiActions: ['Optimal Scheduling', 'Conflict Resolution']
  }
};

// AI-Powered Treatment Plans
export const TREATMENT_PLAN_TYPES = {
  BASIC: {
    value: 'basic',
    label: 'Basic Care Plan',
    duration: '4-6 weeks',
    aiFeatures: ['Basic recommendations', 'Progress tracking'],
    price_range: '$200-500'
  },
  ADVANCED: {
    value: 'advanced',
    label: 'Advanced Treatment Plan',
    duration: '8-12 weeks',
    aiFeatures: ['Deep analysis', 'Personalized protocols', 'Continuous optimization'],
    price_range: '$500-1200'
  },
  PREMIUM: {
    value: 'premium',
    label: 'Premium Transformation',
    duration: '12-24 weeks',
    aiFeatures: ['Comprehensive assessment', 'Multi-modal treatments', 'AI-guided adjustments'],
    price_range: '$1200-3000'
  },
  MAINTENANCE: {
    value: 'maintenance',
    label: 'Maintenance Program',
    duration: 'Ongoing',
    aiFeatures: ['Long-term monitoring', 'Preventive care', 'Lifestyle integration'],
    price_range: '$150-400/month'
  }
};

// Product Categories with AI Enhancement
export const PRODUCT_CATEGORIES = {
  SKINCARE: {
    value: 'skincare',
    label: 'Skincare Products',
    icon: 'fas fa-droplet',
    aiFeatures: ['Ingredient analysis', 'Compatibility checking', 'Usage optimization']
  },
  HAIRCARE: {
    value: 'haircare',
    label: 'Hair Care Products',
    icon: 'fas fa-bottle-droplet',
    aiFeatures: ['Formula matching', 'Damage assessment', 'Growth tracking']
  },
  MAKEUP: {
    value: 'makeup',
    label: 'Makeup Products',
    icon: 'fas fa-palette',
    aiFeatures: ['Color matching', 'Skin compatibility', 'Application guidance']
  },
  TOOLS: {
    value: 'tools',
    label: 'Beauty Tools',
    icon: 'fas fa-tools',
    aiFeatures: ['Usage instructions', 'Maintenance alerts', 'Technique optimization']
  },
  SUPPLEMENTS: {
    value: 'supplements',
    label: 'Beauty Supplements',
    icon: 'fas fa-pills',
    aiFeatures: ['Dosage calculation', 'Interaction checking', 'Progress monitoring']
  }
};

// AI-Powered Consultation Types
export const CONSULTATION_TYPES = {
  INITIAL: {
    value: 'initial',
    label: 'Initial Consultation',
    duration: 60,
    aiFeatures: ['Comprehensive skin analysis', 'Treatment recommendations', 'Goal setting'],
    price: 150
  },
  FOLLOW_UP: {
    value: 'follow_up',
    label: 'Follow-up Consultation',
    duration: 30,
    aiFeatures: ['Progress assessment', 'Plan adjustments', 'Product recommendations'],
    price: 75
  },
  VIRTUAL: {
    value: 'virtual',
    label: 'Virtual AI Consultation',
    duration: 20,
    aiFeatures: ['AI-powered analysis', 'Digital recommendations', 'Remote monitoring'],
    price: 50
  },
  EMERGENCY: {
    value: 'emergency',
    label: 'Emergency Consultation',
    duration: 15,
    aiFeatures: ['Immediate assessment', 'Risk evaluation', 'Urgent care protocols'],
    price: 100
  }
};

// Dashboard Widget Configuration
export const DASHBOARD_WIDGETS = {
  STATS_OVERVIEW: {
    id: 'stats_overview',
    title: 'Practice Overview',
    type: 'stats',
    refreshInterval: 300000, // 5 minutes
    aiEnhanced: true
  },
  APPOINTMENT_CALENDAR: {
    id: 'appointment_calendar',
    title: 'Today\'s Schedule',
    type: 'calendar',
    refreshInterval: 60000, // 1 minute
    aiEnhanced: true
  },
  CLIENT_INSIGHTS: {
    id: 'client_insights',
    title: 'Client Insights',
    type: 'analytics',
    refreshInterval: 900000, // 15 minutes
    aiEnhanced: true
  },
  REVENUE_TRENDS: {
    id: 'revenue_trends',
    title: 'Revenue Analytics',
    type: 'chart',
    refreshInterval: 3600000, // 1 hour
    aiEnhanced: true
  },
  TREATMENT_RECOMMENDATIONS: {
    id: 'treatment_recommendations',
    title: 'AI Treatment Suggestions',
    type: 'recommendations',
    refreshInterval: 1800000, // 30 minutes
    aiEnhanced: true
  }
};

// AI Analysis Types
export const AI_ANALYSIS_TYPES = {
  SKIN_ASSESSMENT: {
    value: 'skin_assessment',
    label: 'AI Skin Assessment',
    description: 'Comprehensive skin analysis using computer vision',
    accuracy: '95%',
    processing_time: '2-3 seconds'
  },
  HAIR_ANALYSIS: {
    value: 'hair_analysis',
    label: 'Hair Health Analysis',
    description: 'Advanced hair and scalp condition evaluation',
    accuracy: '92%',
    processing_time: '3-5 seconds'
  },
  TREATMENT_OPTIMIZATION: {
    value: 'treatment_optimization',
    label: 'Treatment Protocol Optimization',
    description: 'AI-powered treatment plan customization',
    accuracy: '98%',
    processing_time: '5-10 seconds'
  },
  PROGRESS_TRACKING: {
    value: 'progress_tracking',
    label: 'Progress Monitoring',
    description: 'Continuous treatment progress evaluation',
    accuracy: '94%',
    processing_time: '1-2 seconds'
  },
  RISK_ASSESSMENT: {
    value: 'risk_assessment',
    label: 'Treatment Risk Analysis',
    description: 'Safety and contraindication assessment',
    accuracy: '99%',
    processing_time: '1-3 seconds'
  }
};

// Form Validation Rules
export const VALIDATION_RULES = {
  CLIENT: {
    name: { required: true, minLength: 2, maxLength: 100 },
    age: { required: true, min: 16, max: 120 },
    phone: { required: true, pattern: /^[+]?[\d\s-()]+$/ },
    email: { required: false, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
  },
  APPOINTMENT: {
    date: { required: true, futureDate: true },
    duration: { required: true, min: 15, max: 480 },
    service: { required: true }
  },
  TREATMENT_PLAN: {
    name: { required: true, minLength: 5, maxLength: 200 },
    duration_weeks: { required: true, min: 1, max: 52 },
    goals: { required: true, minLength: 10 }
  }
};

// Notification Templates
export const NOTIFICATION_TEMPLATES = {
  APPOINTMENT_REMINDER: {
    title: 'Appointment Reminder',
    template: 'Hi {clientName}, your {serviceName} appointment is scheduled for {date} at {time}. Please arrive 15 minutes early.',
    channels: ['sms', 'email', 'push']
  },
  TREATMENT_COMPLETE: {
    title: 'Treatment Completed',
    template: 'Your {serviceName} treatment is complete! Here are your aftercare instructions: {instructions}',
    channels: ['email', 'push']
  },
  AI_RECOMMENDATION: {
    title: 'AI Treatment Recommendation',
    template: 'Based on your recent progress, our AI recommends: {recommendation}. Would you like to schedule a consultation?',
    channels: ['email', 'push', 'in_app']
  }
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'An internal server error occurred. Please try again later.',
  AI_PROCESSING_ERROR: 'AI analysis failed. Please try again or contact support.',
  APPOINTMENT_CONFLICT: 'The selected time slot conflicts with an existing appointment.',
  INSUFFICIENT_PERMISSIONS: 'You do not have permission to access this feature.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  CLIENT_CREATED: 'Client profile created successfully!',
  APPOINTMENT_SCHEDULED: 'Appointment scheduled successfully!',
  TREATMENT_COMPLETED: 'Treatment marked as completed!',
  PLAN_UPDATED: 'Treatment plan updated successfully!',
  AI_ANALYSIS_COMPLETE: 'AI analysis completed successfully!',
  DATA_EXPORTED: 'Data exported successfully!',
  SETTINGS_SAVED: 'Settings saved successfully!'
};

// Feature Flags for AI Components
export const FEATURE_FLAGS = {
  AI_SKIN_ANALYSIS: true,
  AI_TREATMENT_RECOMMENDATIONS: true,
  AI_PROGRESS_TRACKING: true,
  AI_RISK_ASSESSMENT: true,
  AI_APPOINTMENT_OPTIMIZATION: true,
  VIRTUAL_CONSULTATIONS: true,
  AUTOMATED_FOLLOW_UPS: true,
  PREDICTIVE_ANALYTICS: true
};

// Export all constants as default
export default {
  COSMETOLOGY_ENDPOINTS,
  SERVICE_CATEGORIES,
  SKIN_TYPES,
  HAIR_TYPES,
  APPOINTMENT_STATUS,
  TREATMENT_PLAN_TYPES,
  PRODUCT_CATEGORIES,
  CONSULTATION_TYPES,
  DASHBOARD_WIDGETS,
  AI_ANALYSIS_TYPES,
  VALIDATION_RULES,
  NOTIFICATION_TEMPLATES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  FEATURE_FLAGS
};
