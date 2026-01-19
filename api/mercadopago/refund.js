/* eslint-env node */
/* global process */
import mercadopago from 'mercadopago';
import { ensureConfigured } from './utils/config.js';

const requireAuth = (req) => {
  const expectedKey = process.env.MP_REFUND_API_KEY;
  if (!expectedKey) return false;
  const provided = req.headers['x-api-key'];
  return provided === expectedKey;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!requireAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { paymentId, amount } = req.body ?? {};
  if (!paymentId) {
    return res.status(400).json({ error: 'paymentId é obrigatório para estorno' });
  }

  try {
    ensureConfigured();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

  try {
    const payload = { payment_id: paymentId };
    if (amount !== undefined && amount !== null && amount !== '') {
      const numericAmount = Number(amount);
      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        return res.status(400).json({ error: 'amount deve ser um número positivo' });
      }
      payload.amount = numericAmount;
    }

    const mpResponse = await mercadopago.refund.create(payload);

    const refund = mpResponse?.body ?? mpResponse;
    return res.status(200).json({ refund });
  } catch (error) {
    console.error('Erro ao processar estorno Mercado Pago', error);
    const details = error?.response?.body ?? { message: error?.message };
    return res.status(502).json({ error: 'Falha ao processar estorno', details });
  }
}
