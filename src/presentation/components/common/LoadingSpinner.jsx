import PropTypes from 'prop-types';
import './LoadingSpinner.css';

export function LoadingSpinner({ message = 'Carregando...' }) {
  return (
    <>
      <style>
        {`
          @media (prefers-reduced-motion: reduce) {
            .spinner {
              animation: none !important;
            }
          }
        `}
      </style>
      <div className="loading-spinner-container" role="status" aria-live="polite">
        <div className="spinner" />
        <p className="loading-message">{message}</p>
      </div>
    </>
  );
}

LoadingSpinner.propTypes = {
  message: PropTypes.string
};
