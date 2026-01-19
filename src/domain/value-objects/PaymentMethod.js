/**
 * PaymentMethod - Enum
 *
 * Representa os métodos de pagamento disponíveis no Mercado Pago.
 *
 * PADRÃO: Enumeration (Type-safe constants)
 *
 * REFERÊNCIA: Métodos oficiais do Mercado Pago
 * https://www.mercadopago.com.br/developers/en/docs/checkout-api/payment-methods
 */

export class PaymentMethod {
  /**
   * Cartão de Crédito
   */
  static CREDIT_CARD = new PaymentMethod('credit_card', 'Cartão de Crédito', '💳', {
    allowsInstallments: true,
    requiresProcessing: true
  });

  /**
   * Cartão de Débito
   */
  static DEBIT_CARD = new PaymentMethod('debit_card', 'Cartão de Débito', '💳', {
    allowsInstallments: false,
    requiresProcessing: true
  });

  /**
   * PIX (Pagamento instantâneo brasileiro)
   */
  static PIX = new PaymentMethod('pix', 'PIX', '📱', {
    allowsInstallments: false,
    requiresProcessing: false,
    instantaneous: true
  });

  /**
   * Boleto Bancário
   */
  static BOLETO = new PaymentMethod('boleto', 'Boleto Bancário', '🧾', {
    allowsInstallments: false,
    requiresProcessing: false,
    hasExpirationDate: true,
    expirationDays: 3
  });

  /**
   * Saldo da Conta Mercado Pago
   */
  static ACCOUNT_MONEY = new PaymentMethod('account_money', 'Saldo Mercado Pago', '💰', {
    allowsInstallments: false,
    requiresProcessing: false,
    instantaneous: true
  });

  /**
   * WhatsApp (integração manual - método atual)
   */
  static WHATSAPP = new PaymentMethod('whatsapp', 'WhatsApp', '💬', {
    allowsInstallments: false,
    requiresProcessing: false,
    manual: true
  });

  #id;

  #name;

  #icon;

  #metadata;

  constructor(id, name, icon, metadata = {}) {
    this.#id = id;
    this.#name = name;
    this.#icon = icon;
    this.#metadata = metadata;
    Object.freeze(this);
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  get icon() {
    return this.#icon;
  }

  get metadata() {
    return { ...this.#metadata };
  }

  allowsInstallments() {
    return this.#metadata.allowsInstallments || false;
  }

  isInstantaneous() {
    return this.#metadata.instantaneous || false;
  }

  isManual() {
    return this.#metadata.manual || false;
  }

  requiresProcessing() {
    return this.#metadata.requiresProcessing || false;
  }

  hasExpirationDate() {
    return this.#metadata.hasExpirationDate || false;
  }

  equals(other) {
    if (!(other instanceof PaymentMethod)) {
      return false;
    }
    return this.#id === other.#id;
  }

  toString() {
    return `${this.#icon} ${this.#name}`;
  }

  toJSON() {
    return {
      id: this.#id,
      name: this.#name,
      icon: this.#icon,
      metadata: this.#metadata
    };
  }

  static fromId(id) {
    const methodMap = {
      credit_card: PaymentMethod.CREDIT_CARD,
      debit_card: PaymentMethod.DEBIT_CARD,
      pix: PaymentMethod.PIX,
      boleto: PaymentMethod.BOLETO,
      account_money: PaymentMethod.ACCOUNT_MONEY,
      whatsapp: PaymentMethod.WHATSAPP
    };

    const method = methodMap[id];

    if (!method) {
      throw new Error(`Identificador de método de pagamento inválido: ${id}`);
    }

    return method;
  }

  static getInstallmentMethods() {
    return [PaymentMethod.CREDIT_CARD];
  }

  static getInstantMethods() {
    return [PaymentMethod.PIX, PaymentMethod.ACCOUNT_MONEY];
  }

  static getAllMethods() {
    return [
      PaymentMethod.CREDIT_CARD,
      PaymentMethod.DEBIT_CARD,
      PaymentMethod.PIX,
      PaymentMethod.BOLETO,
      PaymentMethod.ACCOUNT_MONEY,
      PaymentMethod.WHATSAPP
    ];
  }
}

Object.freeze(PaymentMethod);
