import React from 'react';
import { logger } from './logger';

/**
 * Error boundary component for React
 */
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <h2 className="text-red-800 font-medium">Something went wrong</h2>
          <p className="text-red-600 text-sm mt-1">
            Please try refreshing the page or contact support if the problem persists.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
} 