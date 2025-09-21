/**
 * Enhanced Landing Page Configuration
 * Soft-coded settings for easy customization without touching code
 */

// ========================================
// THEME & VISUAL CONFIGURATION
// ========================================
export const LANDING_CONFIG = {
  // Brand & Identity
  brand: {
    name: "Mastermind Healthcare",
    tagline: "Revolutionizing Healthcare with AI",
    logo: "/favicon.ico", // Can be updated via environment variable
    companyUrl: "https://www.xerxez.com",
    contactUrl: "https://www.xerxez.com/contact",
  },

  // Color Scheme (easily customizable)
  colors: {
    primary: {
      main: "#1a3b7b",
      light: "#4a6ba8",
      dark: "#0d1f3d",
      gradient: "linear-gradient(135deg, #1a3b7b 0%, #4a6ba8 100%)",
    },
    secondary: {
      main: "#8B5CF6",
      light: "#A78BFA", 
      dark: "#7C3AED",
      gradient: "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
    },
    success: {
      main: "#10B981",
      light: "#34D399",
      dark: "#059669",
      gradient: "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
    },
    warning: {
      main: "#F59E0B",
      light: "#FBBF24", 
      dark: "#D97706",
      gradient: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
    },
    background: {
      main: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)",
      overlay: "rgba(0, 0, 0, 0.7)",
      card: "rgba(255, 255, 255, 0.05)",
      glass: "rgba(255, 255, 255, 0.1)",
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255, 255, 255, 0.8)",
      muted: "rgba(255, 255, 255, 0.6)",
      accent: "#4a6ba8",
    }
  },

  // Animation Settings
  animations: {
    duration: {
      fast: "0.3s",
      medium: "0.5s",
      slow: "1s",
      counter: 2000, // milliseconds
    },
    easing: {
      smooth: "ease-in-out",
      bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      elastic: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    },
    effects: {
      fadeIn: "fadeInUp 0.8s ease-out forwards",
      slideIn: "slideInLeft 0.6s ease-out forwards",
      scale: "scaleIn 0.5s ease-out forwards",
      float: "floating 3s ease-in-out infinite",
    }
  },

  // Layout Configuration
  layout: {
    maxWidth: "1200px",
    spacing: {
      xs: "0.5rem",
      sm: "1rem", 
      md: "2rem",
      lg: "3rem",
      xl: "4rem",
    },
    borderRadius: {
      sm: "8px",
      md: "12px",
      lg: "20px",
      xl: "30px",
    },
    shadows: {
      sm: "0 2px 10px rgba(0, 0, 0, 0.1)",
      md: "0 10px 30px rgba(0, 0, 0, 0.2)",
      lg: "0 20px 60px rgba(0, 0, 0, 0.3)",
      glow: "0 0 30px rgba(74, 107, 168, 0.3)",
    }
  }
};

// ========================================
// HERO SECTION CONFIGURATION
// ========================================
export const HERO_CONFIG = {
  title: "Transform Healthcare with AI-Powered Solutions",
  subtitle: "Advanced medical platform combining artificial intelligence, comprehensive patient management, and cutting-edge diagnostic tools for modern healthcare providers.",
  
  // Call to Action Buttons
  cta: {
    primary: {
      text: "Start Free Trial",
      action: "trial",
      icon: "ri-play-circle-line",
    },
    secondary: {
      text: "Watch Demo",
      action: "demo", 
      icon: "ri-video-line",
    }
  },

  // Hero Statistics (animated counters)
  stats: [
    {
      value: 50000,
      suffix: "+",
      label: "Patients Served",
      icon: "ri-user-heart-line",
      color: "primary",
      animationDelay: "0s",
    },
    {
      value: 500,
      suffix: "+", 
      label: "Healthcare Facilities",
      icon: "ri-hospital-line",
      color: "success",
      animationDelay: "0.2s",
    },
    {
      value: 25,
      suffix: "+",
      label: "Countries",
      icon: "ri-global-line", 
      color: "warning",
      animationDelay: "0.4s",
    },
    {
      value: 99.9,
      suffix: "%",
      label: "Uptime",
      icon: "ri-shield-check-line",
      color: "secondary",
      animationDelay: "0.6s",
    }
  ],

  // Background Effect Configuration
  background: {
    type: "gradient", // gradient, video, particles
    overlay: true,
    particles: {
      count: 50,
      color: "#4a6ba8",
      opacity: 0.3,
    }
  }
};

// ========================================
// FEATURES CONFIGURATION  
// ========================================
export const FEATURES_CONFIG = {
  title: "Comprehensive Healthcare Solutions",
  subtitle: "Everything you need to deliver exceptional patient care",
  
  features: [
    {
      id: "ai-diagnosis",
      title: "AI-Powered Diagnosis",
      description: "Advanced machine learning algorithms assist in accurate medical diagnosis and treatment recommendations.",
      icon: "ri-brain-line",
      color: "primary",
      category: "AI Technology",
      benefits: ["99% Accuracy Rate", "Instant Analysis", "Evidence-Based"],
    },
    {
      id: "patient-management", 
      title: "Complete Patient Records",
      description: "Comprehensive electronic health records with secure data management and easy access controls.",
      icon: "ri-file-user-line",
      color: "success",
      category: "Data Management", 
      benefits: ["HIPAA Compliant", "Cloud Backup", "Real-time Sync"],
    },
    {
      id: "telemedicine",
      title: "Telemedicine Suite", 
      description: "Virtual consultations with HD video, screen sharing, and integrated prescription management.",
      icon: "ri-video-chat-line",
      color: "secondary",
      category: "Remote Care",
      benefits: ["HD Video Calls", "Digital Prescriptions", "Appointment Scheduling"],
    },
    {
      id: "analytics",
      title: "Advanced Analytics",
      description: "Real-time insights and reporting with customizable dashboards for better decision making.",
      icon: "ri-bar-chart-line", 
      color: "warning",
      category: "Business Intelligence",
      benefits: ["Real-time Reports", "Custom Dashboards", "Predictive Analytics"],
    },
    {
      id: "radiology",
      title: "Radiology Integration",
      description: "AI-enhanced radiology analysis with automated reporting and image management system.",
      icon: "ri-scan-line",
      color: "primary",
      category: "Medical Imaging",
      benefits: ["AI Analysis", "DICOM Support", "Automated Reports"],
    },
    {
      id: "laboratory",
      title: "Lab Management",
      description: "Complete laboratory information system with result tracking and quality control.",
      icon: "ri-test-tube-line",
      color: "success", 
      category: "Laboratory",
      benefits: ["Result Tracking", "Quality Control", "Integration Ready"],
    }
  ]
};

// ========================================
// PRICING CONFIGURATION
// ========================================
export const PRICING_CONFIG = {
  title: "Choose Your Healthcare Solution",
  subtitle: "Flexible plans designed for healthcare providers of all sizes",
  
  plans: [
    {
      id: "basic",
      name: "Basic Care",
      price: 200,
      currency: "$",
      period: "month",
      icon: "ri-user-heart-line",
      color: "primary",
      popular: false,
      badge: "",
      description: "Essential healthcare platform for small practices",
      limits: "Base Platform + Advanced Scheduling",
      features: [
        "Base Healthcare Platform",
        "Advanced Scheduling System", 
        "Patient Management & Records",
        "Basic Reporting & Analytics",
        "User Access Control",
        "Data Backup & Security",
        "24/7 Email Support",
        "HIPAA Compliant Infrastructure",
      ],
      cta: "Start Basic Plan"
    },
    {
      id: "professional", 
      name: "Professional Care",
      price: 350,
      currency: "$", 
      period: "month",
      icon: "ri-stethoscope-line",
      color: "success",
      popular: true,
      badge: "Most Popular",
      description: "Advanced features for growing medical practices",
      limits: "Save $50/month vs individual features",
      features: [
        "Everything in Basic Care",
        "AI Diagnosis Module",
        "Telemedicine Suite", 
        "Advanced Analytics",
        "Priority Support & Training",
        "Machine Learning Diagnostics",
        "Virtual Consultations",
        "Business Intelligence Dashboard",
        "Free Setup & Onboarding",
      ],
      cta: "Start Professional Plan"
    },
    {
      id: "enterprise",
      name: "Enterprise Care", 
      price: 500,
      currency: "$",
      period: "month", 
      icon: "ri-hospital-line",
      color: "warning",
      popular: false,
      badge: "Best Value",
      description: "Complete solution for large healthcare organizations",
      limits: "Save $200/month vs individual features",
      features: [
        "Everything in Professional Care",
        "Radiology Services",
        "Laboratory Management", 
        "Advanced Billing System",
        "Third-party Integrations",
        "Dedicated Account Manager",
        "Custom API Access", 
        "Priority Technical Support",
        "White-label Options Available",
      ],
      cta: "Contact Sales"
    }
  ]
};

// ========================================
// TESTIMONIALS CONFIGURATION
// ========================================
export const TESTIMONIALS_CONFIG = {
  title: "Trusted by Healthcare Professionals",
  subtitle: "See what medical experts are saying about our platform",
  
  testimonials: [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      role: "Chief Medical Officer",
      organization: "Metropolitan Health Center",
      avatar: "/avatars/doctor1.jpg",
      rating: 5,
      quote: "The AI diagnosis feature has revolutionized our patient care. We're seeing 40% faster diagnosis times with improved accuracy.",
      specialization: "Internal Medicine",
      verified: true,
    },
    {
      id: 2, 
      name: "Dr. Michael Chen",
      role: "Radiology Department Head", 
      organization: "St. Mary's Hospital",
      avatar: "/avatars/doctor2.jpg",
      rating: 5,
      quote: "The radiology integration is seamless. Our team can now process twice as many cases with the AI-assisted analysis.",
      specialization: "Radiology",
      verified: true,
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      role: "Practice Owner",
      organization: "Family Care Clinic", 
      avatar: "/avatars/doctor3.jpg",
      rating: 5,
      quote: "Patient management has never been easier. The telemedicine features helped us expand our reach during the pandemic.",
      specialization: "Family Medicine", 
      verified: true,
    }
  ]
};

// ========================================
// FOOTER CONFIGURATION
// ========================================
export const FOOTER_CONFIG = {
  company: {
    name: "Mastermind Healthcare",
    description: "Transforming healthcare through innovative AI-powered solutions and comprehensive patient management systems.",
    logo: "/favicon.ico",
  },
  
  links: {
    product: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Security", href: "/security" },
      { label: "Integration", href: "/integration" },
    ],
    support: [
      { label: "Documentation", href: "/docs" },
      { label: "Help Center", href: "/help" },
      { label: "Contact Us", href: "https://www.xerxez.com/contact" },
      { label: "System Status", href: "/status" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "HIPAA Compliance", href: "/hipaa" },
      { label: "Cookie Policy", href: "/cookies" },
    ]
  },

  social: [
    { platform: "LinkedIn", icon: "ri-linkedin-line", url: "#" },
    { platform: "Twitter", icon: "ri-twitter-line", url: "#" },
    { platform: "Facebook", icon: "ri-facebook-line", url: "#" }, 
    { platform: "YouTube", icon: "ri-youtube-line", url: "#" },
  ],

  contact: {
    email: "contact@xerxez.com",
    phone: "+1 (555) 123-4567",
    address: "123 Healthcare Blvd, Medical District, City, State 12345"
  }
};

// ========================================
// ENVIRONMENT-BASED CONFIGURATION
// ========================================
export const getEnvConfig = () => {
  const env = import.meta.env.NODE_ENV || 'development';
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  const publicUrl = import.meta.env.VITE_PUBLIC_URL || '';
  
  return {
    environment: env,
    apiBaseUrl: baseUrl,
    publicUrl: publicUrl,
    enableAnalytics: env === 'production',
    enableDebugMode: env === 'development',
    enableAnimations: true, // Can be controlled via env var
    enableParticles: env === 'production', // Disable in dev for performance
  };
};

// ========================================
// UTILITY FUNCTIONS
// ========================================
export const generateAssetPath = (path) => {
  const { publicUrl } = getEnvConfig();
  return `${publicUrl}${path}`;
};

export const getColorByType = (type) => {
  return LANDING_CONFIG.colors[type] || LANDING_CONFIG.colors.primary;
};

export const getAnimationDelay = (index, baseDelay = 0) => {
  return `${baseDelay + (index * 0.1)}s`;
};

export default {
  LANDING_CONFIG,
  HERO_CONFIG,
  FEATURES_CONFIG,
  PRICING_CONFIG,
  TESTIMONIALS_CONFIG,
  FOOTER_CONFIG,
  getEnvConfig,
  generateAssetPath,
  getColorByType,
  getAnimationDelay,
};