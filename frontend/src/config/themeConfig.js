/**
 * Theme Configuration System for Easy Customization
 * Allows changing entire landing page appearance through configuration
 */

// ========================================
// PREDEFINED THEME CONFIGURATIONS
// ========================================

// Dark Healthcare Theme (Default)
export const DARK_HEALTHCARE_THEME = {
  name: "Dark Healthcare",
  colors: {
    primary: {
      main: "#1a3b7b",
      light: "#4a6ba8", 
      dark: "#0d1f3d",
      gradient: "linear-gradient(135deg, #1a3b7b 0%, #4a6ba8 100%)",
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
    }
  }
};

// Light Modern Theme
export const LIGHT_MODERN_THEME = {
  name: "Light Modern",
  colors: {
    primary: {
      main: "#2563eb",
      light: "#60a5fa",
      dark: "#1e40af", 
      gradient: "linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)",
    },
    background: {
      main: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      overlay: "rgba(255, 255, 255, 0.7)",
      card: "rgba(255, 255, 255, 0.8)",
      glass: "rgba(255, 255, 255, 0.9)",
    },
    text: {
      primary: "#1e293b",
      secondary: "rgba(30, 41, 59, 0.8)",
      muted: "rgba(30, 41, 59, 0.6)",
    }
  }
};

// Medical Green Theme  
export const MEDICAL_GREEN_THEME = {
  name: "Medical Green",
  colors: {
    primary: {
      main: "#059669",
      light: "#34d399",
      dark: "#047857",
      gradient: "linear-gradient(135deg, #059669 0%, #34d399 100%)",
    },
    secondary: {
      main: "#0891b2",
      light: "#22d3ee",
      dark: "#0e7490",
      gradient: "linear-gradient(135deg, #0891b2 0%, #22d3ee 100%)",
    },
    background: {
      main: "linear-gradient(135deg, #064e3b 0%, #065f46 100%)",
      overlay: "rgba(0, 0, 0, 0.6)",
      card: "rgba(255, 255, 255, 0.08)",
      glass: "rgba(255, 255, 255, 0.12)",
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255, 255, 255, 0.9)",
      muted: "rgba(255, 255, 255, 0.7)",
    }
  }
};

// Purple Tech Theme
export const PURPLE_TECH_THEME = {
  name: "Purple Tech", 
  colors: {
    primary: {
      main: "#7c3aed",
      light: "#a78bfa",
      dark: "#5b21b6",
      gradient: "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)",
    },
    secondary: {
      main: "#ec4899",
      light: "#f472b6", 
      dark: "#be185d",
      gradient: "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)",
    },
    background: {
      main: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
      overlay: "rgba(0, 0, 0, 0.5)",
      card: "rgba(255, 255, 255, 0.06)",
      glass: "rgba(255, 255, 255, 0.1)",
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255, 255, 255, 0.85)",
      muted: "rgba(255, 255, 255, 0.65)",
    }
  }
};

// ========================================
// THEME UTILITY FUNCTIONS
// ========================================

/**
 * Get theme from environment variable or default
 */
export const getCurrentTheme = () => {
  const themeName = import.meta.env.VITE_THEME || 'dark_healthcare';
  
  switch (themeName.toLowerCase()) {
    case 'light_modern':
      return LIGHT_MODERN_THEME;
    case 'medical_green':
      return MEDICAL_GREEN_THEME;
    case 'purple_tech':
      return PURPLE_TECH_THEME;
    default:
      return DARK_HEALTHCARE_THEME;
  }
};

/**
 * Apply theme to CSS custom properties
 */
export const applyTheme = (theme) => {
  const root = document.documentElement;
  
  // Apply primary colors
  root.style.setProperty('--primary-main', theme.colors.primary.main);
  root.style.setProperty('--primary-light', theme.colors.primary.light);
  root.style.setProperty('--primary-dark', theme.colors.primary.dark);
  root.style.setProperty('--primary-gradient', theme.colors.primary.gradient);
  
  // Apply secondary colors if available
  if (theme.colors.secondary) {
    root.style.setProperty('--secondary-main', theme.colors.secondary.main);
    root.style.setProperty('--secondary-light', theme.colors.secondary.light);
    root.style.setProperty('--secondary-dark', theme.colors.secondary.dark);
    root.style.setProperty('--secondary-gradient', theme.colors.secondary.gradient);
  }
  
  // Apply background colors
  root.style.setProperty('--bg-main', theme.colors.background.main);
  root.style.setProperty('--bg-overlay', theme.colors.background.overlay);
  root.style.setProperty('--bg-card', theme.colors.background.card);
  root.style.setProperty('--bg-glass', theme.colors.background.glass);
  
  // Apply text colors
  root.style.setProperty('--text-primary', theme.colors.text.primary);
  root.style.setProperty('--text-secondary', theme.colors.text.secondary);
  root.style.setProperty('--text-muted', theme.colors.text.muted);
};

/**
 * Initialize theme on app startup
 */
export const initializeTheme = () => {
  const theme = getCurrentTheme();
  applyTheme(theme);
  return theme;
};

/**
 * Switch theme dynamically
 */
export const switchTheme = (themeName) => {
  let theme;
  
  switch (themeName.toLowerCase()) {
    case 'light_modern':
      theme = LIGHT_MODERN_THEME;
      break;
    case 'medical_green':
      theme = MEDICAL_GREEN_THEME;
      break;
    case 'purple_tech':
      theme = PURPLE_TECH_THEME;
      break;
    default:
      theme = DARK_HEALTHCARE_THEME;
  }
  
  applyTheme(theme);
  localStorage.setItem('selectedTheme', themeName);
  return theme;
};

// ========================================
// RESPONSIVE CONFIGURATION SYSTEM
// ========================================

export const RESPONSIVE_CONFIG = {
  breakpoints: {
    xs: '0px',
    sm: '576px', 
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1400px'
  },
  
  // Device-specific configurations
  mobile: {
    heroTitle: { fontSize: '2rem', lineHeight: 1.2 },
    heroSubtitle: { fontSize: '1rem' },
    statsGrid: { columns: 2 },
    featuresGrid: { columns: 1 },
    animations: { enabled: true, reduced: true }
  },
  
  tablet: {
    heroTitle: { fontSize: '2.5rem', lineHeight: 1.2 },
    heroSubtitle: { fontSize: '1.1rem' },
    statsGrid: { columns: 2 },
    featuresGrid: { columns: 2 },
    animations: { enabled: true, reduced: false }
  },
  
  desktop: {
    heroTitle: { fontSize: '3.5rem', lineHeight: 1.1 },
    heroSubtitle: { fontSize: '1.25rem' },
    statsGrid: { columns: 4 },
    featuresGrid: { columns: 3 },
    animations: { enabled: true, reduced: false }
  }
};

/**
 * Get responsive configuration based on screen size
 */
export const getResponsiveConfig = () => {
  const width = window.innerWidth;
  
  if (width < 768) return RESPONSIVE_CONFIG.mobile;
  if (width < 1200) return RESPONSIVE_CONFIG.tablet;
  return RESPONSIVE_CONFIG.desktop;
};

// ========================================
// ANIMATION PREFERENCES
// ========================================

export const ANIMATION_PRESETS = {
  // Accessibility-friendly (reduced motion)
  reduced: {
    duration: { fast: '0.1s', medium: '0.2s', slow: '0.3s' },
    effects: { fadeIn: 'none', slideIn: 'none', scale: 'none' },
    enableParticles: false,
    enableCounterAnimation: false
  },
  
  // Normal animations
  normal: {
    duration: { fast: '0.3s', medium: '0.5s', slow: '1s' },
    effects: { 
      fadeIn: 'fadeInUp 0.6s ease-out forwards',
      slideIn: 'slideInLeft 0.4s ease-out forwards', 
      scale: 'scaleIn 0.3s ease-out forwards'
    },
    enableParticles: true,
    enableCounterAnimation: true
  },
  
  // Enhanced animations for high-performance devices
  enhanced: {
    duration: { fast: '0.3s', medium: '0.8s', slow: '1.5s' },
    effects: {
      fadeIn: 'fadeInUp 1s ease-out forwards',
      slideIn: 'slideInLeft 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      scale: 'scaleIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards'
    },
    enableParticles: true,
    enableCounterAnimation: true,
    enableFloatingEffects: true
  }
};

/**
 * Get animation preset based on user preferences and device capabilities
 */
export const getAnimationPreset = () => {
  // Check for user's motion preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    return ANIMATION_PRESETS.reduced;
  }
  
  // Check device capabilities
  const isHighPerformance = window.navigator.hardwareConcurrency > 4;
  if (isHighPerformance) {
    return ANIMATION_PRESETS.enhanced;
  }
  
  return ANIMATION_PRESETS.normal;
};

// ========================================
// CONTENT CONFIGURATION SYSTEM  
// ========================================

/**
 * Get content based on environment or A/B testing
 */
export const getContentVariant = () => {
  const variant = import.meta.env.VITE_CONTENT_VARIANT || 'default';
  
  const variants = {
    default: {
      heroTitle: "Transform Healthcare with AI-Powered Solutions",
      heroSubtitle: "Advanced medical platform combining artificial intelligence, comprehensive patient management, and cutting-edge diagnostic tools for modern healthcare providers.",
      ctaPrimary: "Start Free Trial",
      ctaSecondary: "Watch Demo"
    },
    
    enterprise: {
      heroTitle: "Enterprise Healthcare Solutions for Modern Hospitals", 
      heroSubtitle: "Scalable AI-powered platform designed for large healthcare organizations, featuring advanced analytics, seamless integrations, and enterprise-grade security.",
      ctaPrimary: "Request Enterprise Demo",
      ctaSecondary: "View Case Studies"
    },
    
    startup: {
      heroTitle: "Healthcare Innovation Made Simple",
      heroSubtitle: "Get started with AI-powered healthcare tools in minutes. Perfect for clinics, small practices, and healthcare startups looking to modernize patient care.",
      ctaPrimary: "Start Building Today",
      ctaSecondary: "Explore Features"
    }
  };
  
  return variants[variant] || variants.default;
};

// ========================================
// PERFORMANCE CONFIGURATION
// ========================================

export const PERFORMANCE_CONFIG = {
  // Lazy loading settings
  lazyLoading: {
    enabled: true,
    rootMargin: '50px',
    threshold: 0.1
  },
  
  // Image optimization
  images: {
    quality: 80,
    format: 'webp',
    fallback: 'jpg',
    sizes: {
      hero: { width: 1200, height: 600 },
      feature: { width: 400, height: 300 },
      avatar: { width: 80, height: 80 }
    }
  },
  
  // Bundle optimization
  bundling: {
    enableCodeSplitting: true,
    chunkSize: 244000, // 244KB
    enableTreeShaking: true
  }
};

export default {
  DARK_HEALTHCARE_THEME,
  LIGHT_MODERN_THEME,
  MEDICAL_GREEN_THEME,
  PURPLE_TECH_THEME,
  getCurrentTheme,
  applyTheme,
  initializeTheme,
  switchTheme,
  RESPONSIVE_CONFIG,
  getResponsiveConfig,
  ANIMATION_PRESETS,
  getAnimationPreset,
  getContentVariant,
  PERFORMANCE_CONFIG
};