import { Order } from '../entities/Order';
import { PaymentInfo } from '../valueObjects/PaymentInfo';

/**
 * Process Payment Use Case
 * Handles payment processing with Mercado Pago
 */
export class ProcessPaymentUseCase {
  constructor(paymentGateway) {
    if (!paymentGateway) {
      throw new Error('PaymentGateway implementation is required');
    }

    if (typeof paymentGateway.processPayment !== 'function') {
      throw new Error('PaymentGateway must implement processPayment(order, paymentData)');
    }

    this.paymentGateway = paymentGateway;
  }

  async execute(order, paymentData = {}) {
    if (!(order instanceof Order)) {
      throw new Error('Pedido inválido para processamento de pagamento');
    }

    let gatewayResponse;
    try {
      gatewayResponse = await this.paymentGateway.processPayment(order, {
        ...paymentData,
        amount: paymentData?.amount ?? order.total
      });
    } catch (error) {
      const contextParts = ['Erro ao processar pagamento'];

      const orderId = order?.id || order?.orderId;
      if (orderId) contextParts.push(`Pedido: ${orderId}`);

      const paymentMethod = paymentData?.paymentMethod || paymentData?.method;
      if (paymentMethod) contextParts.push(`Método: ${paymentMethod}`);

      if (error?.message) contextParts.push(`Erro original: ${error.message}`);

      const wrappedError = new Error(contextParts.join(' | '));
      wrappedError.originalError = error;
      if (error?.stack) {
        wrappedError.originalStack = error.stack;
      }
      if (typeof error?.status !== 'undefined') {
        wrappedError.status = error.status;
      }
      if (typeof error?.details !== 'undefined') {
        wrappedError.details = error.details;
      }
      throw wrappedError;
    }

    const paymentInfo = gatewayResponse instanceof PaymentInfo
      ? gatewayResponse
      : new PaymentInfo({
          ...gatewayResponse,
          amount: gatewayResponse?.amount ?? order.total
        });

    // Side effect: associa o pagamento ao pedido para rastreio
    order.setPaymentInfo(paymentInfo);
    return paymentInfo;
  }
}
