/**
 * Mercado Pago Configuration
 * Centralizes payment gateway settings
 */
export const MERCADO_PAGO_CONFIG = {
  publicKey: import.meta.env.VITE_MP_PUBLIC_KEY ?? '',
};
