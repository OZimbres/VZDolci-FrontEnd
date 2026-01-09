import { PaymentGateway } from '../../domain/interfaces/PaymentGateway';
import { PaymentInfo } from '../../domain/valueObjects/PaymentInfo';
import { MERCADO_PAGO_CONFIG } from '../config/mercadopago.config';

const DEFAULT_API_BASE_URL = '/api/mercadopago';

export class MercadoPagoGateway extends PaymentGateway {
  constructor({ apiBaseUrl = DEFAULT_API_BASE_URL } = {}) {
    super();
    this.apiBaseUrl = apiBaseUrl;
    if (!MERCADO_PAGO_CONFIG.publicKey) {
      throw new Error('Chave pública do Mercado Pago não configurada');
    }
  }

  async processPayment(order, paymentData = {}) {
    if (!order) {
      throw new Error('Pedido é obrigatório para processar pagamento');
    }

    const response = await fetch(`${this.apiBaseUrl}/create-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ order, paymentData })
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const message = errorBody?.error || 'Falha ao criar pagamento no servidor';
      const error = new Error(message);
      error.status = response.status;
      error.details = errorBody;
      throw error;
    }

    const payload = await response.json();
    const payment = payload?.payment ?? payload;

    return new PaymentInfo(this.normalizePaymentInfo(payment, order, paymentData));
  }

  normalizePaymentInfo(payment, order, paymentData) {
    const method = payment?.method
      ?? payment?.payment_method_id
      ?? paymentData?.paymentMethod
      ?? paymentData?.method
      ?? 'pix';

    const amount = payment?.amount
      ?? payment?.transaction_amount
      ?? paymentData?.amount
      ?? order?.total;

    return {
      paymentId: payment?.paymentId ?? payment?.id,
      status: payment?.status ?? 'pending',
      method,
      amount,
      currency: payment?.currency ?? payment?.currency_id ?? 'BRL',
      qrCode: payment?.qrCode
        ?? payment?.qr_code
        ?? payment?.point_of_interaction?.transaction_data?.qr_code
        ?? null,
      qrCodeBase64: payment?.qrCodeBase64
        ?? payment?.qr_code_base64
        ?? payment?.point_of_interaction?.transaction_data?.qr_code_base64
        ?? null,
      expiresAt: payment?.expiresAt ?? payment?.date_of_expiration ?? null,
      metadata: payment?.metadata ?? {
        orderId: order?.id ?? order?.orderId
      }
    };
  }
}
