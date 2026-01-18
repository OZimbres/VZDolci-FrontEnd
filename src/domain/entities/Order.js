/**
 * Order - Entidade de Domínio
 *
 * Representa um pedido com itens e pagamentos associados.
 */

import { Payment } from './Payment.js';
import { PaymentStatus } from '../value-objects/PaymentStatus.js';

export class Order {
  #id;

  #items;

  #customer;

  #status;

  #payments;

  #createdAt;

  #updatedAt;

  #notes;

  constructor({
    id,
    items = [],
    customer = {},
    status = 'pending',
    payments = [],
    createdAt = new Date(),
    updatedAt = new Date(),
    notes = ''
  }) {
    if (!id) {
      throw new Error('ID do pedido é obrigatório');
    }

    this.#id = id;
    this.#items = [...items];
    this.#customer = { ...customer };
    this.#status = status;
    this.#payments = payments.map(payment =>
      payment instanceof Payment ? payment : Payment.fromJSON(payment)
    );
    this.#createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
    this.#updatedAt = updatedAt instanceof Date ? updatedAt : new Date(updatedAt);
    this.#notes = notes;
  }

  get id() {
    return this.#id;
  }

  get items() {
    return [...this.#items];
  }

  get customer() {
    return { ...this.#customer };
  }

  get status() {
    return this.#status;
  }

  get payments() {
    return [...this.#payments];
  }

  get createdAt() {
    return this.#createdAt;
  }

  get updatedAt() {
    return this.#updatedAt;
  }

  get notes() {
    return this.#notes;
  }

  addItem(item) {
    this.#items = [...this.#items, item];
    this.#touch();
  }

  addPayment(payment) {
    const paymentEntity = payment instanceof Payment ? payment : Payment.fromJSON(payment);
    this.#payments = [...this.#payments, paymentEntity];
    this.#touch();
  }

  updateStatus(status) {
    this.#status = status;
    this.#touch();
  }

  getTotalAmount() {
    return this.#items.reduce((total, item) => total + this.#getItemTotal(item), 0);
  }

  getItemsCount() {
    return this.#items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }

  getLatestPayment() {
    if (this.#payments.length === 0) {
      return null;
    }
    return this.#payments[this.#payments.length - 1];
  }

  getPaymentStatus() {
    const latestPayment = this.getLatestPayment();
    if (!latestPayment) {
      return PaymentStatus.PENDING;
    }
    return latestPayment.status;
  }

  isPaid() {
    return this.getPaymentStatus().isSuccessful();
  }

  toJSON() {
    return {
      id: this.#id,
      items: this.#items,
      customer: this.#customer,
      status: this.#status,
      payments: this.#payments.map(payment => payment.toJSON()),
      createdAt: this.#createdAt.toISOString(),
      updatedAt: this.#updatedAt.toISOString(),
      notes: this.#notes
    };
  }

  static fromJSON(data) {
    return new Order({
      id: data.id,
      items: data.items,
      customer: data.customer,
      status: data.status,
      payments: data.payments?.map(payment => Payment.fromJSON(payment)) || [],
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      notes: data.notes
    });
  }

  #getItemTotal(item) {
    if (typeof item.getTotal === 'function') {
      return item.getTotal();
    }

    if (typeof item.total === 'number') {
      return item.total;
    }

    const price = item.price ?? item.product?.price ?? 0;
    const quantity = item.quantity ?? 1;

    return price * quantity;
  }

  #touch() {
    this.#updatedAt = new Date();
  }
}
