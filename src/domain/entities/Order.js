import { PaymentInfo } from '../valueObjects/PaymentInfo';

/**
 * Order Entity
 * Represents a customer order in the VZ Dolci system
 * * @follows Clean Architecture - Domain Layer
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
      throw new Error('Order id is required');
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Order must include at least one item');
    }

    if (!customerInfo) {
      throw new Error('Customer information is required');
    }

    if (!shippingInfo) {
      throw new Error('Shipping information is required');
    }

    this.id = id;
    this.items = items;
    this.customerInfo = customerInfo;
    this.shippingInfo = shippingInfo;
    this.status = status;
    this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
    if (Number.isNaN(this.createdAt.getTime())) {
      throw new Error('Invalid order creation date');
    }

    this.total = this.calculateTotal();
    if (Number.isNaN(this.total) || this.total <= 0) {
      throw new Error('Order total must be positive');
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

      const quantity = Number(item?.quantity ?? 1);
      const price = Number(item?.price ?? item?.product?.price ?? 0);
      return sum + price * quantity;
    }, 0);
  }

  setPaymentInfo(paymentInfo) {
    const info = paymentInfo instanceof PaymentInfo ? paymentInfo : new PaymentInfo(paymentInfo);
    this.paymentInfo = info;
    return this.paymentInfo;
  }

  isPaid() {
    return this.paymentInfo?.status === 'approved';
  }
}
