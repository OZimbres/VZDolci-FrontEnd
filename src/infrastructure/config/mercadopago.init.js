import { initMercadoPago } from '@mercadopago/sdk-react';
import { MERCADO_PAGO_CONFIG } from './mercadopago.config.js';

let initialized = false;

/**
 * Inicializa o SDK do Mercado Pago para React
 * Deve ser chamado uma única vez no carregamento da aplicação
 */
export function initializeMercadoPago() {
  if (initialized) {
    return;
  }

  if (!MERCADO_PAGO_CONFIG.publicKey) {
    console.error('Mercado Pago: defina a variável VITE_MP_PUBLIC_KEY com a chave pública');
    return;
  }

  initMercadoPago(MERCADO_PAGO_CONFIG.publicKey, {
    locale: 'pt-BR'
  });

  initialized = true;
}

/**
 * Verifica se o SDK foi inicializado
 */
export function isMercadoPagoInitialized() {
  return initialized;
}
