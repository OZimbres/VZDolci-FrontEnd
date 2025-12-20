import { Component } from 'react';
import PropTypes from 'prop-types';
import './ErrorBoundary.css';

/**
 * ErrorBoundary Component
 * Captura erros no React e mostra fallback UI
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  navigate = (path) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log para serviço de monitoramento (ex: Sentry)
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ errorInfo });

    // TODO: Enviar para Sentry/LogRocket na Fase 4
    // Sentry.captureException(error);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      this.navigate('/');
    }
  };

  render() {
    const { error, errorInfo, hasError } = this.state;

    if (hasError) {
      return (
        <div className="error-boundary">
          <div className="error-container">
            <span className="error-emoji">😢</span>
            <h1>Ops! Algo deu errado</h1>
            <p>
              Pedimos desculpas pelo inconveniente. Estamos trabalhando para resolver o problema. 
            </p>
            
            {import.meta.env.MODE === 'development' && (
              <details className="error-details">
                <summary>Detalhes técnicos</summary>
                <pre>
                  {error?.stack || error?.toString()}
                  {errorInfo?.componentStack && `\n\nComponente:\n${errorInfo.componentStack}`}
                </pre>
              </details>
            )}
            
            <div className="error-actions">
              <button onClick={this.handleReset} className="btn btn-primary">
                Voltar para o início
              </button>
              <button
                type="button"
                onClick={() => {
                  if (this.props.onReport) {
                    this.props.onReport();
                  } else {
                    this.navigate('/contato');
                  }
                }}
                className="btn btn-secondary"
              >
                Reportar problema
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
  onReset: PropTypes.func,
  onReport: PropTypes.func,
};
