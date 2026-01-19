import PropTypes from 'prop-types';
import './CheckoutSteps.css';

/**
 * Checkout Steps Component
 * Visual indicator of checkout progress
 */
export function CheckoutSteps({
  currentStep = 1,
  steps = ['Dados do Cliente', 'Pagamento', 'Confirmação']
}) {
  return (
    <div className="checkout-steps" role="list" aria-label="Progresso do checkout">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;
        return (
          <div
            key={label}
            className={`checkout-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
            role="listitem"
            aria-current={isActive ? 'step' : undefined}
          >
            <span className="step-index">{stepNumber}</span>
            <div className="step-text">
              <span className="step-label">{label}</span>
              {isCompleted && <span className="step-status">Concluído</span>}
              {isActive && <span className="step-status">Em andamento</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

CheckoutSteps.propTypes = {
  currentStep: PropTypes.number,
  steps: PropTypes.arrayOf(PropTypes.string)
};
