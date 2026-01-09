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

const extractId = (req) => req.query?.id ?? req?.params?.id;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const paymentId = extractId(req);
  if (!paymentId) {
    return res.status(400).json({ error: 'ID do pagamento é obrigatório' });
  }

  try {
    ensureConfigured();
    const mpResponse = await mercadopago.payment.findById(paymentId);
    const payment = mpResponse?.body ?? mpResponse;

    if (!payment?.id) {
      return res.status(404).json({ error: 'Pagamento não encontrado' });
    }

    const normalized = {
      paymentId: payment.id,
      status: payment.status,
      method: payment.payment_method_id,
      amount: payment.transaction_amount,
      currency: payment.currency_id,
      qrCode: payment.point_of_interaction?.transaction_data?.qr_code,
      qrCodeBase64: payment.point_of_interaction?.transaction_data?.qr_code_base64,
      expiresAt: payment.date_of_expiration,
      metadata: payment.metadata
    };

    return res.status(200).json({ payment: normalized });
  } catch (error) {
    console.error('Erro ao consultar pagamento Mercado Pago', error);
    const details = error?.response?.body ?? { message: error?.message };
    return res.status(502).json({ error: 'Falha ao consultar pagamento', details });
  }
}
