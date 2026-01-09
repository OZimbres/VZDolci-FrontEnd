/* eslint-env node */
/* global process */
import mercadopago from 'mercadopago';

export const ensureConfigured = () => {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) {
    throw new Error('MP_ACCESS_TOKEN não configurado');
  }
  mercadopago.configure({ access_token: token });
};
