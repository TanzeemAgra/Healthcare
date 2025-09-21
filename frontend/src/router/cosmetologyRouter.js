// ===============================
// COSMETOLOGY ROUTER - SOFT CODING SOLUTION
// Robust Component Loading with Fallback Support
// ===============================

import React, { Suspense, lazy } from 'react';
import { createFallbackComponent, safeComponentImport, COMPONENT_CONFIGS } from '../utils/componentFactory';

// Direct import for S3 component to avoid lazy loading issues
import CosmetologyS3DataManager from '../views/cosmetology/CosmetologyS3DataManager';

/**
 * Soft-coded component loader with error boundaries
 */
const createLazyComponent = (componentName, importPath) => {
  return lazy(async () => {
    try {
      // Primary import attempt
      const module = await import(importPath);
      
      // Validate the module has proper exports
      if (module.default) {
        return { default: module.default };
      } else if (module[componentName]) {
        return { default: module[componentName] };
      } else {
        console.warn(`Component ${componentName} not found in module, creating fallback`);
        const FallbackComponent = createFallbackComponent(
          componentName, 
          `${componentName} component is loading...`
        );
        return { default: FallbackComponent };
      }
    } catch (error) {
      console.error(`Failed to load ${componentName}:`, error);
      const FallbackComponent = createFallbackComponent(
        componentName,
        `Unable to load ${componentName}. Please refresh the page.`
      );
      return { default: FallbackComponent };
    }
  });
};

/**
 * Loading component for Suspense fallback
 */
const LoadingFallback = ({ componentName }) => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
    <div className="text-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-2 text-muted">Loading {componentName}...</p>
    </div>
  </div>
);

/**
 * Error Boundary Component
 */
class ComponentErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Component Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = createFallbackComponent(
        this.props.componentName || 'Component',
        `Error loading component. Please try refreshing the page.`
      );
      return <FallbackComponent />;
    }

    return this.props.children;
  }
}

/**
 * Wrapper component with error boundary and suspense
 */
const SafeComponent = ({ component: Component, componentName, ...props }) => (
  <ComponentErrorBoundary componentName={componentName}>
    <Suspense fallback={<LoadingFallback componentName={componentName} />}>
      <Component {...props} />
    </Suspense>
  </ComponentErrorBoundary>
);

// Soft-coded component definitions
export const CosmetologyComponents = {
  // Primary import with multiple fallback strategies
  CosmetologyClients: createLazyComponent('CosmetologyClients', '../components/cosmetology/CosmetologyClients'),
  CosmetologyServices: createLazyComponent('CosmetologyServices', '../components/cosmetology/CosmetologyServices'),
  CosmetologyAppointments: createLazyComponent('CosmetologyAppointments', '../components/cosmetology/CosmetologyAppointments'),
  CosmetologyTreatments: createLazyComponent('CosmetologyTreatments', '../components/cosmetology/CosmetologyTreatments'),
  CosmetologyProducts: createLazyComponent('CosmetologyProducts', '../components/cosmetology/CosmetologyProducts'),
  CosmetologyConsultations: createLazyComponent('CosmetologyConsultations', '../components/cosmetology/CosmetologyConsultations'),
  CosmetologyDashboard: createLazyComponent('CosmetologyDashboard', '../components/cosmetology/CosmetologyDashboard'),
  CosmetologyS3DataManager: CosmetologyS3DataManager, // Direct import instead of lazy loading
};

/**
 * Route configuration with soft-coded paths
 */
export const cosmetologyRoutes = [
  {
    path: '/cosmetology/clients',
    component: CosmetologyComponents.CosmetologyClients,
    name: 'CosmetologyClients',
    title: 'Clients Management'
  },
  {
    path: '/cosmetology/s3-manager',
    component: CosmetologyComponents.CosmetologyS3DataManager,
    name: 'CosmetologyS3DataManager',
    title: 'S3 Data Manager'
  },
  {
    path: '/cosmetology/services',
    component: CosmetologyComponents.CosmetologyServices,
    name: 'CosmetologyServices',
    title: 'Services Management'
  },
  {
    path: '/cosmetology/appointments',
    component: CosmetologyComponents.CosmetologyAppointments,
    name: 'CosmetologyAppointments',
    title: 'Appointments Management'
  },
  {
    path: '/cosmetology/treatments',
    component: CosmetologyComponents.CosmetologyTreatments,
    name: 'CosmetologyTreatments',
    title: 'Treatments Management'
  },
  {
    path: '/cosmetology/products',
    component: CosmetologyComponents.CosmetologyProducts,
    name: 'CosmetologyProducts',
    title: 'Products Management'
  },
  {
    path: '/cosmetology/consultations',
    component: CosmetologyComponents.CosmetologyConsultations,
    name: 'CosmetologyConsultations',
    title: 'Consultations Management'
  },
  {
    path: '/cosmetology',
    component: CosmetologyComponents.CosmetologyDashboard,
    name: 'CosmetologyDashboard',
    title: 'Cosmetology Dashboard'
  }
];

export { SafeComponent, ComponentErrorBoundary, LoadingFallback };
export default { CosmetologyComponents, cosmetologyRoutes, SafeComponent };
