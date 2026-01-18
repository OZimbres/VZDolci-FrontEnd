/**
 * PaymentStatus - Value Object
 *
 * Representa os possíveis estados de um pagamento no Mercado Pago.
 *
 * PADRÃO: Value Object (DDD - Domain-Driven Design)
 * - Imutável
 * - Comparado por valor
 * - Sem identidade própria
 *
 * REFERÊNCIA: Estados oficiais do Mercado Pago
 * https://www.mercadopago.com.br/developers/en/docs/checkout-api/payment-status
 */

export class PaymentStatus {
  /**
   * Pagamento aprovado e creditado
   */
  static APPROVED = new PaymentStatus('approved', 'Aprovado', '✅');

  /**
   * Pagamento pendente (aguardando processamento)
   * Exemplos: boleto não pago, PIX não confirmado
   */
  static PENDING = new PaymentStatus('pending', 'Pendente', '⏳');

  /**
   * Pagamento autorizado mas ainda não capturado
   */
  static AUTHORIZED = new PaymentStatus('authorized', 'Autorizado', '🔐');

  /**
   * Pagamento em processo de análise
   * Comum em pagamentos de alto valor ou primeira compra
   */
  static IN_PROCESS = new PaymentStatus('in_process', 'Em Processamento', '🔄');

  /**
   * Pagamento em mediação/disputa
   */
  static IN_MEDIATION = new PaymentStatus('in_mediation', 'Em Mediação', '⚖️');

  /**
   * Pagamento rejeitado
   * Motivos: cartão sem limite, dados inválidos, etc
   */
  static REJECTED = new PaymentStatus('rejected', 'Rejeitado', '❌');

  /**
   * Pagamento cancelado pelo vendedor ou comprador
   */
  static CANCELLED = new PaymentStatus('cancelled', 'Cancelado', '🚫');

  /**
   * Pagamento devolvido (refunded)
   */
  static REFUNDED = new PaymentStatus('refunded', 'Reembolsado', '💸');

  /**
   * Devolução parcial (charged back)
   */
  static CHARGED_BACK = new PaymentStatus('charged_back', 'Estornado', '↩️');

  #code;

  #label;

  #icon;

  constructor(code, label, icon) {
    this.#code = code;
    this.#label = label;
    this.#icon = icon;

    Object.freeze(this);
  }

  get code() {
    return this.#code;
  }

  get label() {
    return this.#label;
  }

  get icon() {
    return this.#icon;
  }

  isSuccessful() {
    return this === PaymentStatus.APPROVED;
  }

  isPending() {
    return (
      this === PaymentStatus.PENDING ||
      this === PaymentStatus.IN_PROCESS ||
      this === PaymentStatus.AUTHORIZED
    );
  }

  isFailed() {
    return this === PaymentStatus.REJECTED || this === PaymentStatus.CANCELLED;
  }

  isReversed() {
    return this === PaymentStatus.REFUNDED || this === PaymentStatus.CHARGED_BACK;
  }

  requiresCustomerAction() {
    return this === PaymentStatus.PENDING || this === PaymentStatus.IN_MEDIATION;
  }

  equals(other) {
    if (!(other instanceof PaymentStatus)) {
      return false;
    }
    return this.#code === other.#code;
  }

  toString() {
    return `${this.#icon} ${this.#label}`;
  }

  toJSON() {
    return {
      code: this.#code,
      label: this.#label,
      icon: this.#icon
    };
  }

  static fromCode(code) {
    const statusMap = {
      approved: PaymentStatus.APPROVED,
      pending: PaymentStatus.PENDING,
      authorized: PaymentStatus.AUTHORIZED,
      in_process: PaymentStatus.IN_PROCESS,
      in_mediation: PaymentStatus.IN_MEDIATION,
      rejected: PaymentStatus.REJECTED,
      cancelled: PaymentStatus.CANCELLED,
      refunded: PaymentStatus.REFUNDED,
      charged_back: PaymentStatus.CHARGED_BACK
    };

    const status = statusMap[code];

    if (!status) {
      throw new Error(`Status de pagamento inválido: ${code}`);
    }

    return status;
  }

  static getAllStatuses() {
    return [
      PaymentStatus.APPROVED,
      PaymentStatus.PENDING,
      PaymentStatus.AUTHORIZED,
      PaymentStatus.IN_PROCESS,
      PaymentStatus.IN_MEDIATION,
      PaymentStatus.REJECTED,
      PaymentStatus.CANCELLED,
      PaymentStatus.REFUNDED,
      PaymentStatus.CHARGED_BACK
    ];
  }
}

Object.freeze(PaymentStatus);
