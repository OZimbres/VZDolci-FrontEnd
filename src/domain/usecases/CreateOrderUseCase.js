import { Order } from '../entities/Order';
import { CustomerInfo } from '../valueObjects/CustomerInfo';
import { ShippingInfo } from '../valueObjects/ShippingInfo';

/**
 * Create Order Use Case
 */
export class CreateOrderUseCase {
  execute({ id, items, customerData, shippingData, paymentInfo = null }) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Itens do pedido são obrigatórios');
    }

    items.forEach(item => Order.validateItem(item));

    const customerInfo = new CustomerInfo(customerData);
    const shippingInfo = new ShippingInfo(shippingData);

    return new Order({
      id,
      items,
      customerInfo,
      shippingInfo,
      paymentInfo
    });
  }
}
