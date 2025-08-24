import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
    
    // You can also log the error to an error reporting service here
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-charcoal-dark flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="text-6xl mb-6">💥</div>
            <h1 className="text-3xl font-bold text-white mb-4">Oops! Something went wrong</h1>
            <p className="text-gray-text mb-8">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="neon-button primary w-full py-3 font-semibold"
              >
                🔄 Refresh Page
              </button>
              
              <button
                onClick={() => window.location.href = '/home'}
                className="neon-button secondary w-full py-3 font-semibold"
              >
                🏠 Go Home
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 text-left">
                <summary className="text-neon-blue cursor-pointer mb-4">
                  🐛 Error Details (Development Only)
                </summary>
                <div className="bg-charcoal-card border border-white/20 rounded-lg p-4 text-sm">
                  <div className="text-red-400 font-mono mb-2">
                    {this.state.error && this.state.error.toString()}
                  </div>
                  <div className="text-gray-text font-mono text-xs whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </div>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
