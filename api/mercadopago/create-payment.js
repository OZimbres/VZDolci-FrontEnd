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

const buildNotificationUrl = (req) => {
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers.host;
  return `${protocol}://${host}/api/webhooks/mercadopago`;
};

const mapPayer = (order, paymentData) => {
  const payerInput = paymentData?.payer ?? {};
  const customer = order?.customerInfo ?? {};
  const rawName = (payerInput.name ?? customer.name ?? '').trim();
  const [firstNameFromName, ...restName] = rawName.split(/\s+/).filter(Boolean);

  const resolvedFirstName = payerInput.firstName?.trim()
    || firstNameFromName
    || 'Cliente';

  const resolvedLastName = payerInput.lastName?.trim()
    || restName.join(' ').trim()
    || 'VZ Dolci';

  const cpf = payerInput.documentNumber ?? payerInput.cpf ?? customer.cpf;

  return {
    email: payerInput.email ?? customer.email,
    first_name: resolvedFirstName,
    last_name: resolvedLastName,
    identification: cpf ? {
      type: payerInput.documentType ?? 'CPF',
      number: cpf
    } : undefined
  };
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

  const { order, paymentData = {} } = req.body ?? {};
  const amount = Number(paymentData?.amount ?? order?.total);
  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Valor do pagamento inválido' });
  }

  const description = paymentData?.description
    ?? (order?.id ? `Pedido ${order.id}` : 'Pagamento VZ Dolci');

  const paymentPayload = {
    transaction_amount: amount,
    payment_method_id: paymentData?.paymentMethod ?? paymentData?.method ?? 'pix',
    description,
    notification_url: buildNotificationUrl(req),
    payer: mapPayer(order, paymentData),
    metadata: {
      orderId: order?.id ?? order?.orderId,
      ...paymentData?.metadata
    }
  };

  try {
    const mpResponse = await mercadopago.payment.create(paymentPayload);
    const payment = mpResponse?.body ?? mpResponse;

    const normalized = {
      paymentId: payment?.id,
      status: payment?.status,
      method: payment?.payment_method_id,
      amount: payment?.transaction_amount,
      currency: payment?.currency_id,
      qrCode: payment?.point_of_interaction?.transaction_data?.qr_code,
      qrCodeBase64: payment?.point_of_interaction?.transaction_data?.qr_code_base64,
      expiresAt: payment?.date_of_expiration,
      metadata: payment?.metadata
    };

    return res.status(201).json({ payment: normalized });
  } catch (error) {
    console.error('Erro ao criar pagamento Mercado Pago', error);
    const details = error?.response?.body ?? { message: error?.message };
    return res.status(502).json({ error: 'Falha ao criar pagamento', details });
  }
}
