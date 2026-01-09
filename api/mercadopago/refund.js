/* eslint-env node */
/* global process */
import mercadopago from 'mercadopago';

const ensureConfigured = () => {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) {
    throw new Error('MP_ACCESS_TOKEN não configurado');
  }
  mercadopago.configure({ access_token: token });
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
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
    let mpResponse;
    if (amount) {
      const payload = { payment_id: paymentId, amount: Number(amount) };
      mpResponse = await mercadopago.refund.create(payload);
    } else {
      mpResponse = await mercadopago.payment.refund(paymentId);
    }

    const refund = mpResponse?.body ?? mpResponse;
    return res.status(200).json({ refund });
  } catch (error) {
    console.error('Erro ao processar estorno Mercado Pago', error);
    const details = error?.response?.body ?? { message: error?.message };
    return res.status(502).json({ error: 'Falha ao processar estorno', details });
  }
}
