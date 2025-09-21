// ===============================
// COMPONENT FACTORY - SOFT CODING SOLUTION
// Robust Module Export System for React Components
// ===============================

/**
 * Component Factory for ensuring reliable module exports
 * This utility provides a failsafe mechanism for component imports
 */

// Soft-coded component configurations
export const COMPONENT_CONFIGS = {
  COSMETOLOGY_CLIENTS: {
    name: 'CosmetologyClients',
    path: '/src/components/cosmetology/CosmetologyClients.jsx',
    fallbackMessage: 'Cosmetology Clients Module Loading...'
  },
  COSMETOLOGY_SERVICES: {
    name: 'CosmetologyServices', 
    path: '/src/components/cosmetology/CosmetologyServices.jsx',
    fallbackMessage: 'Cosmetology Services Module Loading...'
  },
  COSMETOLOGY_APPOINTMENTS: {
    name: 'CosmetologyAppointments',
    path: '/src/components/cosmetology/CosmetologyAppointments.jsx', 
    fallbackMessage: 'Cosmetology Appointments Module Loading...'
  }
};

/**
 * Creates a fallback component when main component fails to load
 * @param {string} componentName - Name of the component
 * @param {string} message - Fallback message to display
 * @returns {React.Component} Fallback component
 */
export const createFallbackComponent = (componentName, message) => {
  const FallbackComponent = () => {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h4>{componentName}</h4>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="spinner-border spinner-border-sm me-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <span>{message}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  FallbackComponent.displayName = `${componentName}Fallback`;
  return FallbackComponent;
};

/**
 * Validates if a component has proper export structure
 * @param {*} component - Component to validate
 * @returns {boolean} True if valid component
 */
export const validateComponent = (component) => {
  return (
    component &&
    (typeof component === 'function' || 
     (typeof component === 'object' && component.$$typeof))
  );
};

/**
 * Safely imports a component with fallback mechanism
 * @param {Function} importFn - Dynamic import function
 * @param {Object} config - Component configuration
 * @returns {Promise<React.Component>} Component or fallback
 */
export const safeComponentImport = async (importFn, config) => {
  try {
    const module = await importFn();
    const component = module.default || module[config.name];
    
    if (validateComponent(component)) {
      return component;
    } else {
      console.warn(`Component ${config.name} validation failed, using fallback`);
      return createFallbackComponent(config.name, config.fallbackMessage);
    }
  } catch (error) {
    console.error(`Failed to import ${config.name}:`, error);
    return createFallbackComponent(config.name, config.fallbackMessage);
  }
};

export default {
  COMPONENT_CONFIGS,
  createFallbackComponent,
  validateComponent,
  safeComponentImport
};
