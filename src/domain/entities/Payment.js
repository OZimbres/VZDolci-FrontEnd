/**
 * Payment - Entidade de Domínio
 *
 * Representa um pagamento no sistema VZ Dolci.
 */

import { PaymentStatus } from '../value-objects/PaymentStatus.js';
import { PaymentMethod } from '../value-objects/PaymentMethod.js';

export class Payment {
  #id;

  #orderId;

  #amount;

  #currency;

  #status;

  #paymentMethod;

  #preferenceId;

  #externalReference;

  #payerEmail;

  #payerName;

  #installments;

  #transactionAmount;

  #dateCreated;

  #dateApproved;

  #metadata;

  constructor({
    id,
    orderId,
    amount,
    currency = 'BRL',
    status = PaymentStatus.PENDING,
    paymentMethod,
    preferenceId = null,
    externalReference = null,
    payerEmail = null,
    payerName = null,
    installments = 1,
    transactionAmount = null,
    dateCreated = new Date(),
    dateApproved = null,
    metadata = {}
  }) {
    this.#validateConstructorParams({ id, amount, paymentMethod });

    this.#id = id;
    this.#orderId = orderId;
    this.#amount = amount;
    this.#currency = currency;
    this.#status = status instanceof PaymentStatus ? status : PaymentStatus.fromCode(status);
    this.#paymentMethod =
      paymentMethod instanceof PaymentMethod ? paymentMethod : PaymentMethod.fromId(paymentMethod);
    this.#preferenceId = preferenceId;
    this.#externalReference = externalReference;
    this.#payerEmail = payerEmail;
    this.#payerName = payerName;
    this.#installments = installments;
    this.#transactionAmount = transactionAmount || amount;
    this.#dateCreated = dateCreated instanceof Date ? dateCreated : new Date(dateCreated);
    this.#dateApproved = dateApproved
      ? dateApproved instanceof Date
        ? dateApproved
        : new Date(dateApproved)
      : null;
    this.#metadata = { ...metadata };
  }

  #validateConstructorParams({ id, amount, paymentMethod }) {
    if (!id) {
      throw new Error('Payment ID é obrigatório');
    }

    if (typeof amount !== 'number' || amount <= 0) {
      throw new Error('Amount deve ser um número positivo');
    }

    if (!paymentMethod) {
      throw new Error('Payment Method é obrigatório');
    }
  }

  get id() {
    return this.#id;
  }

  get orderId() {
    return this.#orderId;
  }

  get amount() {
    return this.#amount;
  }

  get currency() {
    return this.#currency;
  }

  get status() {
    return this.#status;
  }

  get paymentMethod() {
    return this.#paymentMethod;
  }

  get preferenceId() {
    return this.#preferenceId;
  }

  get externalReference() {
    return this.#externalReference;
  }

  get payerEmail() {
    return this.#payerEmail;
  }

  get payerName() {
    return this.#payerName;
  }

  get installments() {
    return this.#installments;
  }

  get transactionAmount() {
    return this.#transactionAmount;
  }

  get dateCreated() {
    return this.#dateCreated;
  }

  get dateApproved() {
    return this.#dateApproved;
  }

  get metadata() {
    return { ...this.#metadata };
  }

  updateStatus(newStatus) {
    const targetStatus =
      newStatus instanceof PaymentStatus ? newStatus : PaymentStatus.fromCode(newStatus);

    if (this.#status.isSuccessful() && !targetStatus.isReversed()) {
      throw new Error('Não é possível alterar status de pagamento aprovado (exceto estorno)');
    }

    if (this.#status.isFailed() && targetStatus.isSuccessful()) {
      throw new Error('Não é possível aprovar pagamento que foi rejeitado');
    }

    this.#status = targetStatus;

    if (targetStatus.isSuccessful() && !this.#dateApproved) {
      this.#dateApproved = new Date();
    }
  }

  calculateProcessingFee() {
    const feeRates = {
      [PaymentMethod.CREDIT_CARD.id]: 0.0499,
      [PaymentMethod.DEBIT_CARD.id]: 0.0349,
      [PaymentMethod.PIX.id]: 0.0099,
      [PaymentMethod.BOLETO.id]: 0.0349,
      [PaymentMethod.ACCOUNT_MONEY.id]: 0,
      [PaymentMethod.WHATSAPP.id]: 0
    };

    const rate = feeRates[this.#paymentMethod.id] || 0.05;
    return this.#amount * rate;
  }

  calculateNetAmount() {
    return this.#amount - this.calculateProcessingFee();
  }

  canBeRefunded() {
    return this.#status.isSuccessful() && !this.#status.isReversed();
  }

  isExpired() {
    if (!this.#paymentMethod.hasExpirationDate()) {
      return false;
    }

    const expirationDays = 3;
    const now = new Date();
    const expirationDate = new Date(this.#dateCreated);
    expirationDate.setDate(expirationDate.getDate() + expirationDays);

    return now > expirationDate && this.#status.isPending();
  }

  getFormattedAmount() {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: this.#currency
    }).format(this.#amount);
  }

  getSummary() {
    return `${this.#status.toString()} - ${this.#paymentMethod.toString()} - ${this.getFormattedAmount()}`;
  }

  equals(other) {
    if (!(other instanceof Payment)) {
      return false;
    }
    return this.#id === other.#id;
  }

  toJSON() {
    return {
      id: this.#id,
      orderId: this.#orderId,
      amount: this.#amount,
      currency: this.#currency,
      status: this.#status.toJSON(),
      paymentMethod: this.#paymentMethod.toJSON(),
      preferenceId: this.#preferenceId,
      externalReference: this.#externalReference,
      payerEmail: this.#payerEmail,
      payerName: this.#payerName,
      installments: this.#installments,
      transactionAmount: this.#transactionAmount,
      dateCreated: this.#dateCreated.toISOString(),
      dateApproved: this.#dateApproved?.toISOString() || null,
      metadata: this.#metadata
    };
  }

  static fromJSON(data) {
    return new Payment({
      id: data.id,
      orderId: data.orderId,
      amount: data.amount,
      currency: data.currency,
      status: data.status?.code || data.status,
      paymentMethod: data.paymentMethod?.id || data.paymentMethod,
      preferenceId: data.preferenceId,
      externalReference: data.externalReference,
      payerEmail: data.payerEmail,
      payerName: data.payerName,
      installments: data.installments,
      transactionAmount: data.transactionAmount,
      dateCreated: data.dateCreated,
      dateApproved: data.dateApproved,
      metadata: data.metadata
    });
  }

  static fromMercadoPago(mercadoPagoPayment) {
    return new Payment({
      id: mercadoPagoPayment.id.toString(),
      orderId: null,
      amount: mercadoPagoPayment.transaction_amount,
      currency: mercadoPagoPayment.currency_id,
      status: mercadoPagoPayment.status,
      paymentMethod: mercadoPagoPayment.payment_method_id || 'credit_card',
      preferenceId: mercadoPagoPayment.preference_id || null,
      externalReference: mercadoPagoPayment.external_reference,
      payerEmail: mercadoPagoPayment.payer?.email || null,
      payerName: mercadoPagoPayment.payer?.first_name || null,
      installments: mercadoPagoPayment.installments || 1,
      transactionAmount: mercadoPagoPayment.transaction_amount,
      dateCreated: mercadoPagoPayment.date_created,
      dateApproved: mercadoPagoPayment.date_approved,
      metadata: {
        mercadoPagoId: mercadoPagoPayment.id,
        statusDetail: mercadoPagoPayment.status_detail
      }
    });
  }
}
