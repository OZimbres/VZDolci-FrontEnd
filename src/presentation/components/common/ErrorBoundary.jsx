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
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log para serviço de monitoramento (ex: Sentry)
    console.error('Error caught by boundary:', error, errorInfo);
    
    // TODO: Enviar para Sentry/LogRocket na Fase 4
    // Sentry.captureException(error);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-container">
            <span className="error-emoji">😢</span>
            <h1>Ops! Algo deu errado</h1>
            <p>
              Pedimos desculpas pelo inconveniente. Nossa equipe já foi notificada. 
            </p>
            
            {import.meta.env.MODE === 'development' && (
              <details className="error-details">
                <summary>Detalhes técnicos</summary>
                <pre>{this.state.error?.toString()}</pre>
              </details>
            )}
            
            <div className="error-actions">
              <button onClick={this.handleReset} className="btn btn-primary">
                Voltar para o início
              </button>
              <a href="/contato" className="btn btn-secondary">
                Reportar problema
              </a>
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
};
