import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Wallet } from '@mercadopago/sdk-react';
import { MercadoPagoPreferenceGateway } from '../../../../infrastructure/gateways/MercadoPagoPreferenceGateway.js';
import { CreateCheckoutPreferenceUseCase } from '../../../../domain/usecases/CreateCheckoutPreferenceUseCase.js';
import { LoadingSpinner } from '../../common/LoadingSpinner.jsx';
import './MercadoPagoCheckoutButton.css';

/**
 * Componente de Botão do Checkout PRO do Mercado Pago
 * Renderiza o botão oficial do Mercado Pago que inicia o fluxo de pagamento
 */
export function MercadoPagoCheckoutButton({
  items,
  customerData,
  onPreferenceCreated,
  onError,
  disabled = false
}) {
  const [preferenceId, setPreferenceId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const createPreference = useCallback(async () => {
    if (!items || items.length === 0) {
      setError('Carrinho vazio');
      return;
    }

    if (!customerData?.email) {
      setError('Email é obrigatório');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const gateway = new MercadoPagoPreferenceGateway();
      const useCase = new CreateCheckoutPreferenceUseCase(gateway);

      const result = await useCase.execute({
        items,
        customerInfo: customerData
      });

      setPreferenceId(result.preferenceId);

      if (onPreferenceCreated) {
        onPreferenceCreated(result);
      }
    } catch (err) {
      console.error('Erro ao criar preference:', err);
      setError(err.message || 'Erro ao preparar pagamento');

      if (onError) {
        onError(err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [items, customerData, onPreferenceCreated, onError]);

  useEffect(() => {
    if (!disabled && customerData?.email) {
      createPreference();
    }
  }, [createPreference, disabled, customerData?.email]);

  if (isLoading) {
    return (
      <div className="mp-checkout-button-container">
        <LoadingSpinner message="Preparando checkout..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mp-checkout-button-container">
        <div className="mp-checkout-error">
          <p>{error}</p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={createPreference}
            disabled={disabled}
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!preferenceId) {
    return (
      <div className="mp-checkout-button-container">
        <p className="mp-checkout-waiting">
          Preencha seus dados para habilitar o pagamento
        </p>
      </div>
    );
  }

  return (
    <div className="mp-checkout-button-container">
      <Wallet
        initialization={{ preferenceId }}
        customization={{
          texts: { valueProp: 'smart_option' },
          visual: { buttonBackground: 'default', borderRadius: '10px' }
        }}
        onError={(walletError) => {
          if (onError) {
            onError(walletError);
          }
        }}
      />
      <p className="mp-checkout-hint">
        Você será redirecionado para o Mercado Pago para finalizar o pagamento
      </p>
    </div>
  );
}

MercadoPagoCheckoutButton.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  customerData: PropTypes.shape({
    email: PropTypes.string
  }),
  onPreferenceCreated: PropTypes.func,
  onError: PropTypes.func,
  disabled: PropTypes.bool
};
