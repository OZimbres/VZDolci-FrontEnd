/* eslint-env node */
/* global process */
import mercadopago from 'mercadopago';

const { MercadoPagoConfig, Payment } = mercadopago;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

    if (!accessToken) {
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'MERCADO_PAGO_ACCESS_TOKEN não configurada',
      });
    }

    const client = new MercadoPagoConfig({
      accessToken,
    });

    const { payment_id: paymentId } = req.query || {};

    if (!paymentId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'payment_id é obrigatório',
      });
    }

    if (typeof paymentId !== 'string' || !/^[0-9]+$/.test(paymentId)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'payment_id deve ser uma string numérica válida',
      });
    }

    const paymentClient = new Payment(client);
    const payment = await paymentClient.get({ id: paymentId });

    return res.status(200).json({
      success: true,
      payment: {
        id: payment.id,
        status: payment.status,
        status_detail: payment.status_detail,
        amount: payment.transaction_amount,
        currency: payment.currency_id,
        payer_email: payment.payer?.email,
        payment_method: payment.payment_method_id,
        external_reference: payment.external_reference,
        date_created: payment.date_created,
        date_approved: payment.date_approved,
      },
    });
  } catch (error) {
    console.error('Erro ao consultar pagamento:', error);

    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Erro ao consultar status do pagamento',
    });
  }
}
