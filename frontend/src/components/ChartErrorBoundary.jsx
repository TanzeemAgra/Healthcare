import React from 'react';
import { Alert } from 'react-bootstrap';

class ChartErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log chart rendering errors for debugging
    console.warn('Chart rendering error caught by error boundary:', {
      error: error,
      errorInfo: errorInfo,
      chartType: this.props.chartType || 'unknown',
      component: this.props.component || 'unknown'
    });
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI when chart rendering fails
      return (
        <div className="chart-error-boundary">
          <Alert variant="warning" className="mb-3">
            <Alert.Heading>Chart Display Issue</Alert.Heading>
            <p>
              There was an issue displaying this chart. This is usually temporary and 
              related to data loading or rendering complexity.
            </p>
            <hr />
            <div className="d-flex justify-content-end">
              <button 
                className="btn btn-outline-warning btn-sm"
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              >
                Try Again
              </button>
            </div>
          </Alert>
          
          {/* Development mode error details */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-2">
              <summary className="text-muted small">Debug Information (Development Only)</summary>
              <pre className="small text-muted mt-1" style={{ fontSize: '11px' }}>
                <strong>Error:</strong> {this.state.error && this.state.error.toString()}
                <br />
                <strong>Component Stack:</strong> {this.state.errorInfo.componentStack}
                <br />
                <strong>Chart Type:</strong> {this.props.chartType || 'Not specified'}
                <br />
                <strong>Component:</strong> {this.props.component || 'Not specified'}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ChartErrorBoundary;
