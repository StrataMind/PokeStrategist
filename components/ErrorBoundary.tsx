'use client';

import { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            style={{
              padding: '2rem',
              textAlign: 'center',
              background: 'var(--parchment)',
              border: '2px solid var(--red)',
              margin: '1rem',
            }}
          >
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                color: 'var(--red)',
                marginBottom: '0.5rem',
              }}
            >
              Something went wrong
            </h2>
            <p
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.75rem',
                color: 'var(--ink-muted)',
                marginBottom: '1rem',
              }}
            >
              {this.state.error?.message ?? 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              style={{
                background: 'var(--ink)',
                border: '2px solid var(--gold)',
                color: 'var(--gold)',
                padding: '0.5rem 1.5rem',
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.75rem',
                cursor: 'pointer',
                letterSpacing: '0.1em',
              }}
            >
              Try Again
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
