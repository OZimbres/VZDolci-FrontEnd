import { MERCADO_PAGO_CONFIG } from '../config/mercadopago.config.js';

const DEFAULT_API_BASE_URL = '/api';

/**
 * Gateway para criação de Preferences do Mercado Pago Checkout PRO
 * Comunica com o backend para criar preferences usadas pelo Wallet
 */
export class MercadoPagoPreferenceGateway {
  constructor({ apiBaseUrl = DEFAULT_API_BASE_URL } = {}) {
    this.apiBaseUrl = apiBaseUrl;

    if (!MERCADO_PAGO_CONFIG.publicKey) {
      throw new Error(
        'Chave pública do Mercado Pago não configurada. ' +
        'Defina VITE_MP_PUBLIC_KEY nas variáveis de ambiente.'
      );
    }
  }

  async createPreference(order) {
    if (!order) {
      throw new Error('Pedido é obrigatório');
    }

    if (!order.items || order.items.length === 0) {
      throw new Error('Itens do pedido são obrigatórios');
    }

    const requestBody = {
      items: this.normalizeItems(order.items),
      payer: this.normalizePayer(order.customerInfo),
      orderId: order.id,
      metadata: {
        source: 'checkout-pro',
        orderId: order.id
      }
    };

    const response = await fetch(`${this.apiBaseUrl}/create-preference`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const message = errorBody?.error || 'Falha ao criar preference de pagamento';
      const error = new Error(message);
      error.status = response.status;
      error.details = errorBody;
      throw error;
    }

    const data = await response.json();

    return {
      preferenceId: data.preferenceId,
      initPoint: data.initPoint,
      sandboxInitPoint: data.sandboxInitPoint,
      externalReference: data.externalReference
    };
  }

  normalizeItems(items) {
    return items.map(item => {
      const product = item.product || item;
      const quantity = item.quantity || 1;

      return {
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: product.price,
        quantity,
        imageUrl: product.image || product.imageUrl || null
      };
    });
  }

  normalizePayer(customerInfo) {
    if (!customerInfo) {
      return {};
    }

    const sanitizedCpf = (customerInfo.cpf || '').replace(/\s+/g, '');

    return {
      name: customerInfo.name || '',
      email: customerInfo.email || '',
      phone: customerInfo.phone || '',
      cpf: sanitizedCpf
    };
  }
}
