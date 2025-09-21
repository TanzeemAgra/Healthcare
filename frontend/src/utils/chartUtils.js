/**
 * Chart utilities to prevent rendering errors and improve data visualization
 */

/**
 * Safely rounds a number to prevent floating point precision issues in charts
 * @param {number} value - The number to round
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {number} - Safely rounded number
 */
export const safeRound = (value, decimals = 2) => {
  const factor = Math.pow(10, decimals);
  return Math.round((value || 0) * factor) / factor;
};

/**
 * Safely converts a percentage to avoid SVG path precision errors
 * @param {number} value - The value between 0 and 1
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {number} - Safely rounded percentage (0-100)
 */
export const safePercentage = (value, decimals = 1) => {
  return safeRound((value || 0) * 100, decimals);
};

/**
 * Safely formats data array for charts to prevent rendering errors
 * @param {Array} data - Array of numbers
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {Array} - Array of safely rounded numbers
 */
export const safeChartData = (data, decimals = 2) => {
  if (!Array.isArray(data)) return [];
  return data.map(value => safeRound(value, decimals));
};

/**
 * Default chart options to prevent common rendering issues
 */
export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom'
    },
    tooltip: {
      enabled: true,
      intersect: false,
      mode: 'index'
    }
  },
  scales: {
    x: {
      display: true,
      grid: {
        display: true,
        drawBorder: false
      }
    },
    y: {
      display: true,
      grid: {
        display: true,
        drawBorder: false
      },
      beginAtZero: true
    }
  },
  elements: {
    point: {
      radius: 3,
      hoverRadius: 6
    },
    line: {
      tension: 0.4
    }
  },
  animation: {
    duration: 750,
    easing: 'easeInOutQuart'
  }
};

/**
 * Safe color palette for charts that works well with SVG rendering
 */
export const chartColors = {
  primary: '#007bff',
  secondary: '#6c757d',
  success: '#28a745',
  warning: '#ffc107',
  danger: '#dc3545',
  info: '#17a2b8',
  light: '#f8f9fa',
  dark: '#343a40',
  gradient: {
    blue: ['#007bff', '#0056b3'],
    green: ['#28a745', '#1e7e34'],
    red: ['#dc3545', '#a71d2a'],
    orange: ['#fd7e14', '#e55a00'],
    purple: ['#6f42c1', '#5a2b8c']
  }
};

/**
 * Generates a safe data object for Chart.js to prevent SVG path errors
 * @param {Array} labels - Chart labels
 * @param {Array} datasets - Chart datasets
 * @returns {Object} - Safe chart data object
 */
export const generateSafeChartData = (labels = [], datasets = []) => {
  return {
    labels,
    datasets: datasets.map(dataset => ({
      ...dataset,
      data: safeChartData(dataset.data),
      backgroundColor: dataset.backgroundColor || chartColors.primary,
      borderColor: dataset.borderColor || chartColors.primary,
      borderWidth: dataset.borderWidth || 2,
      fill: dataset.fill !== undefined ? dataset.fill : false
    }))
  };
};

/**
 * Error handler for chart rendering failures
 * @param {Error} error - The error that occurred
 * @param {string} chartType - Type of chart that failed
 * @param {string} component - Component where the error occurred
 */
export const handleChartError = (error, chartType = 'unknown', component = 'unknown') => {
  console.warn(`Chart rendering error in ${component} (${chartType}):`, {
    error: error.message,
    stack: error.stack,
    chartType,
    component,
    timestamp: new Date().toISOString()
  });
  
  // You could also send this to an error reporting service
  // errorReportingService.captureException(error, { chartType, component });
};

export default {
  safeRound,
  safePercentage,
  safeChartData,
  defaultChartOptions,
  chartColors,
  generateSafeChartData,
  handleChartError
};
