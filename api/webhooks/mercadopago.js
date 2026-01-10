/* eslint-env node */
/* global process */
import { ensureConfigured } from '../mercadopago/utils/config.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    ensureConfigured();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

  try {
    if (!req.headers['x-request-id'] || !req.headers['x-signature']) {
      return res.status(400).json({ error: 'Assinatura do webhook ausente' });
    }

    const { type, data } = req.body ?? {};
    // Apenas confirma recebimento para notificações que não sejam de pagamento
    if (type !== 'payment' || !data?.id) {
      return res.status(200).json({ received: true });
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Erro no webhook Mercado Pago', error);
    return res.status(500).json({ error: 'Falha ao processar webhook' });
  }
}
