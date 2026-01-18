/* eslint-env node */
/* global process */
import mercadopago from 'mercadopago';

const { MercadoPagoConfig, Payment, MerchantOrder } = mercadopago;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

    if (!accessToken) {
      console.error('Webhook configuration error');
      return res.status(200).json({
        success: false,
        error: 'Configuration error',
      });
    }

    const client = new MercadoPagoConfig({
      accessToken,
    });

    const { type, data } = req.body || {};

    console.log('=== WEBHOOK RECEBIDO ===');
    console.log('Tipo:', type);
    console.log('Data:', data);

    if (type === 'payment' && data?.id) {
      const paymentClient = new Payment(client);
      const paymentData = await paymentClient.get({ id: data.id });

      console.log('=== DETALHES DO PAGAMENTO ===');
      console.log('ID:', paymentData.id);
      console.log('Status:', paymentData.status);
      console.log('Valor:', paymentData.transaction_amount);
      console.log('Email:', paymentData.payer?.email);
      console.log('External Reference:', paymentData.external_reference);

      switch (paymentData.status) {
        case 'approved':
          console.log('✅ Pagamento aprovado!');
          await handleApprovedPayment(paymentData);
          break;
        case 'pending':
          console.log('⏳ Pagamento pendente');
          await handlePendingPayment(paymentData);
          break;
        case 'in_process':
          console.log('🔄 Pagamento em processamento');
          await handleProcessingPayment(paymentData);
          break;
        case 'rejected':
          console.log('❌ Pagamento recusado');
          await handleRejectedPayment(paymentData);
          break;
        case 'cancelled':
          console.log('🚫 Pagamento cancelado');
          await handleCancelledPayment(paymentData);
          break;
        default:
          console.log('❓ Status desconhecido:', paymentData.status);
      }
    } else if (type === 'merchant_order' && data?.id) {
      const orderClient = new MerchantOrder(client);
      const order = await orderClient.get({ id: data.id });
      console.log('=== PEDIDO ATUALIZADO ===');
      console.log('Order ID:', order.id);
      console.log('Status:', order.status);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erro no webhook:', error);

    return res.status(200).json({
      success: false,
      error: error.message,
    });
  }
}

async function handleApprovedPayment(paymentData) {
  console.log('📝 TODO (Fase 3): Salvar pedido aprovado no banco de dados');
  console.log('📧 TODO (Fase 3): Enviar email de confirmação');
  console.log('💬 TODO (Fase 3): Enviar mensagem WhatsApp');
  console.log('Pagamento aprovado ID:', paymentData?.id);
}

async function handlePendingPayment(paymentData) {
  console.log('📝 TODO (Fase 3): Marcar pedido como pendente');
  console.log('Pagamento pendente ID:', paymentData?.id);
}

async function handleProcessingPayment(paymentData) {
  console.log('📝 TODO (Fase 3): Marcar pedido como em processamento');
  console.log('Pagamento em processamento ID:', paymentData?.id);
}

async function handleRejectedPayment(paymentData) {
  console.log('📝 TODO (Fase 3): Notificar cliente sobre recusa');
  console.log('Pagamento recusado ID:', paymentData?.id);
}

async function handleCancelledPayment(paymentData) {
  console.log('📝 TODO (Fase 3): Marcar pedido como cancelado');
  console.log('Pagamento cancelado ID:', paymentData?.id);
}
