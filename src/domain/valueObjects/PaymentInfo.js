/**
 * PaymentInfo Value Object
 * Encapsulates payment data from Mercado Pago
 * @immutable
 */

// Default payment expiration time in milliseconds (30 minutes)
const DEFAULT_PAYMENT_EXPIRATION_MS = 30 * 60 * 1000;

export class PaymentInfo {
  constructor({
    paymentId,
    status,
    method,
    amount,
    currency = 'BRL',
    qrCode = null,
    qrCodeBase64 = null,
    expiresAt = null,
    // createdAt should use the gateway's timestamp when reconstructing from API responses.
    // The default of new Date() should only apply when creating new payment records.
    createdAt = new Date(),
    metadata = {}
  }) {
    if (!paymentId) {
      throw new Error('Identificador do pagamento é obrigatório');
    }

    if (!method) {
      throw new Error('Método de pagamento é obrigatório');
    }

    if (!status || !PaymentInfo.isValidStatus(status)) {
      throw new Error('Status de pagamento inválido');
    }

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      throw new Error('Valor do pagamento inválido');
    }

    this.paymentId = String(paymentId);
    this.method = method;
    this.status = status;
    this.amount = numericAmount;
    this.currency = currency;
    this.qrCode = qrCode;
    this.qrCodeBase64 = qrCodeBase64;

    this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
    if (Number.isNaN(this.createdAt.getTime())) {
      throw new Error('Data de criação do pagamento inválida');
    }

    const expirationDate = PaymentInfo.resolveExpiration(expiresAt, this.createdAt);
    if (Number.isNaN(expirationDate.getTime())) {
      throw new Error('Data de expiração do pagamento inválida');
    }

    this.expiresAt = expirationDate;
    this.metadata = metadata;

    Object.freeze(this);
  }

  static isValidStatus(value) {
    const allowed = ['pending', 'in_process', 'approved', 'rejected', 'cancelled', 'refunded', 'charged_back'];
    return allowed.includes(value);
  }

  static resolveExpiration(expiresAt, createdAt) {
    if (expiresAt) {
      return expiresAt instanceof Date ? expiresAt : new Date(expiresAt);
    }
    return new Date(createdAt.getTime() + DEFAULT_PAYMENT_EXPIRATION_MS);
  }

  isExpired(referenceDate = new Date()) {
    // Considera expirado apenas após o instante de expiração (exclusivo)
    return referenceDate.getTime() > this.expiresAt.getTime();
  }

  getTimeToExpire(referenceDate = new Date()) {
    return Math.max(0, this.expiresAt.getTime() - referenceDate.getTime());
  }
}
