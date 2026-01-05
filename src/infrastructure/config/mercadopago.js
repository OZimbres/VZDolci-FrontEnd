/**
 * Mercado Pago Configuration
 * Centralizes payment gateway settings
 * The Node SDK is intended for serverless/back-end contexts only
 */
export const MERCADO_PAGO_CONFIG = {
  publicKey: import.meta.env.VITE_MP_PUBLIC_KEY ?? 'MP_PUBLIC_KEY_NOT_SET',
};
