import { PaymentInfo } from '../valueObjects/PaymentInfo';

/**
 * Order Entity
 * Represents a customer order in the VZ Dolci system
 * @follows Clean Architecture - Domain Layer
 * Mutable por design para permitir anexar pagamento/status.
 */
export class Order {
  constructor({
    id,
    items,
    customerInfo,
    shippingInfo,
    paymentInfo = null,
    status = 'pending',
    createdAt = new Date()
  }) {
    if (!id) {
      throw new Error('Identificador do pedido é obrigatório');
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Pedido precisa de pelo menos um item');
    }

    if (!customerInfo) {
      throw new Error('Informações do cliente são obrigatórias');
    }

    if (!shippingInfo) {
      throw new Error('Informações de entrega são obrigatórias');
    }

    this.id = id;
    this.items = items;
    this.customerInfo = customerInfo;
    this.shippingInfo = shippingInfo;
    this.status = status;
    this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
    if (Number.isNaN(this.createdAt.getTime())) {
      throw new Error('Data de criação do pedido inválida');
    }

    this.total = this.calculateTotal();
    if (Number.isNaN(this.total) || this.total <= 0) {
      throw new Error('Total do pedido deve ser positivo');
    }

    this.paymentInfo = null;
    if (paymentInfo) {
      this.setPaymentInfo(paymentInfo);
    }
  }

  calculateTotal() {
    return this.items.reduce((sum, item) => {
      if (item && typeof item.getTotal === 'function') {
        return sum + Number(item.getTotal());
      }

      Order.validateItem(item);
      const quantity = Number(item.quantity);
      const price = Number(item?.price ?? item?.product?.price);

      return sum + price * quantity;
    }, 0);
  }

  /**
   * Associa informações de pagamento ao pedido (efeito colateral intencional).
    * Camadas superiores devem registrar evento/estado para auditoria.
   */
  setPaymentInfo(paymentInfo) {
    const info = paymentInfo instanceof PaymentInfo ? paymentInfo : new PaymentInfo(paymentInfo);
    this.paymentInfo = info;
    return this.paymentInfo;
  }

  isPaid() {
    return this.paymentInfo?.status === 'approved';
  }

  static validateItem(item) {
    if (item?.quantity === undefined || item?.quantity === null) {
      throw new Error('Quantidade do item é obrigatória');
    }

    const quantity = Number(item.quantity);
    const price = Number(item?.price ?? item?.product?.price);

    if (!Number.isFinite(quantity) || quantity < 1) {
      throw new Error('Quantidade do item deve ser um número finito maior ou igual a 1');
    }

    if (!Number.isFinite(price) || price < 0) {
      throw new Error('Preço do item deve ser um número finito maior ou igual a 0');
    }

    if (price === 0) {
      throw new Error('Preço do item é obrigatório');
    }
  }
}
