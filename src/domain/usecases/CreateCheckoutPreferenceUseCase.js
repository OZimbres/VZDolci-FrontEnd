/**
 * Use Case para criar Preference do Checkout PRO
 * Orquestra a criação de uma preference usada para iniciar o pagamento
 */
export class CreateCheckoutPreferenceUseCase {
  constructor(preferenceGateway) {
    if (!preferenceGateway) {
      throw new Error('PreferenceGateway é obrigatório');
    }

    if (typeof preferenceGateway.createPreference !== 'function') {
      throw new Error('PreferenceGateway deve implementar createPreference()');
    }

    this.preferenceGateway = preferenceGateway;
  }

  async execute({ items, customerInfo, orderId }) {
    if (!items || items.length === 0) {
      throw new Error('Itens do pedido são obrigatórios');
    }

    if (!customerInfo?.email) {
      throw new Error('Email do cliente é obrigatório para o Checkout PRO');
    }

    const resolvedOrderId = orderId || this.generateOrderId();

    const preference = await this.preferenceGateway.createPreference({
      id: resolvedOrderId,
      items,
      customerInfo
    });

    return {
      ...preference,
      orderId: resolvedOrderId
    };
  }

  generateOrderId() {
    const BASE_36 = 36;
    const RANDOM_ID_LENGTH = 7;
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `ORDER-${Date.now()}-${Math.random().toString(BASE_36).substring(2, 2 + RANDOM_ID_LENGTH)}`;
  }
}
