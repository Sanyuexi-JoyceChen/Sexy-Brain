import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  silent?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary caught]', error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.silent) {
        return (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 0,
              background:
                'radial-gradient(circle at 50% 50%, #151515 0%, #050505 100%)',
            }}
          />
        );
      }
      return (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: '#000',
            color: '#fff',
            padding: 24,
            fontFamily: 'monospace',
            fontSize: 12,
            overflow: 'auto',
          }}
        >
          <h2 style={{ color: '#ff6b6b', marginBottom: 16 }}>渲染错误</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error?.message}
            {'\n\n'}
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
