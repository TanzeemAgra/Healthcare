/**
 * Landing Page Module Configuration
 * Automatically syncs with HEALTHCARE_MODULES for consistent display
 */

import { HEALTHCARE_MODULES } from './modulePermissions';

// Define landing page specific module configurations with icons and styling
export const LANDING_PAGE_MODULES = {
  medicine: {
    ...HEALTHCARE_MODULES.medicine,
    icon: 'ri-stethoscope-line',
    bgColor: 'primary',
    badge: 'Professional+',
    description: 'Complete patient management with AI-powered diagnostic assistance and clinical decision support.'
  },
  dentistry: {
    ...HEALTHCARE_MODULES.dentistry,
    icon: 'ri-capsule-line', // Keeping original safe icon
    bgColor: 'warning',
    badge: 'Professional+',
    description: 'Specialized dental practice management with treatment planning and patient records.'
  },
  dermatology: {
    ...HEALTHCARE_MODULES.dermatology,
    icon: 'ri-heart-pulse-line', // Using heart-pulse as skin-line might not exist
    bgColor: 'success',
    badge: 'Professional+',
    description: 'Advanced skin condition analysis with AI-powered diagnosis and treatment planning.'
  },
  pathology: {
    ...HEALTHCARE_MODULES.pathology,
    icon: 'ri-microscope-line',
    bgColor: 'danger',
    badge: 'Enterprise+',
    description: 'Laboratory information management with AI-assisted diagnostic interpretation.'
  },
  radiology: {
    ...HEALTHCARE_MODULES.radiology,
    icon: 'ri-scan-line',
    bgColor: 'info',
    badge: 'Enterprise+',
    description: 'Advanced imaging analysis with machine learning for accurate diagnostics and reporting.'
  },
  homeopathy: {
    ...HEALTHCARE_MODULES.homeopathy,
    icon: 'ri-leaf-line',
    bgColor: 'success',
    badge: 'Professional+',
    description: 'Holistic homeopathic treatment management with natural remedy recommendations.'
  },
  allopathy: {
    ...HEALTHCARE_MODULES.allopathy,
    icon: 'ri-medicine-bottle-line',
    bgColor: 'primary',
    badge: 'Professional+',
    description: 'Modern allopathic medicine with evidence-based treatment protocols.'
  },
  cosmetology: {
    ...HEALTHCARE_MODULES.cosmetology,
    icon: 'ri-brush-line', // Beauty/cosmetic brush icon
    bgColor: 'purple',
    badge: 'New',
    description: 'Professional beauty salon management with cosmetic treatment tracking.'
  },
  dna_sequencing: {
    ...HEALTHCARE_MODULES.dna_sequencing,
    icon: 'ri-test-tube-line',
    bgColor: 'info',
    badge: 'Ultimate AI',
    description: 'Advanced genomic analysis and DNA sequencing with bioinformatics tools.'
  },
  secureneat: {
    ...HEALTHCARE_MODULES.secureneat,
    icon: 'ri-shield-check-line',
    bgColor: 'dark',
    badge: 'Professional+',
    description: 'HIPAA-compliant security platform with advanced encryption and audit trails.'
  }
};

// Get modules in a grid-friendly format (groups of 3 for better layout)
export const getModulesForLanding = () => {
  return Object.entries(LANDING_PAGE_MODULES).map(([key, module]) => ({
    id: key,
    ...module
  }));
};

// Get module count for display
export const getModuleCount = () => {
  return Object.keys(HEALTHCARE_MODULES).length;
};
