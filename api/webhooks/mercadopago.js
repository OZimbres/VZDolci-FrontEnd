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

  try {
    ensureConfigured();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

  try {
    const { type, data } = req.body ?? {};
    // Apenas confirma recebimento para notificações que não sejam de pagamento
    if (type !== 'payment' || !data?.id) {
      return res.status(200).json({ received: true });
    }

    // Consulta o pagamento para registrar status atualizado
    await mercadopago.payment.findById(data.id);
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Erro no webhook Mercado Pago', error);
    return res.status(500).json({ error: 'Falha ao processar webhook' });
  }
}
