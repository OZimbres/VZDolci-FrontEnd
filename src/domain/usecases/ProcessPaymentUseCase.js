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

    this.paymentGateway = paymentGateway;
  }

  async execute(order, paymentData = {}) {
    if (!(order instanceof Order)) {
      throw new Error('Pedido inválido para processamento de pagamento');
    }

    if (typeof this.paymentGateway.processPayment !== 'function') {
      throw new Error('PaymentGateway must implement processPayment');
    }

    let gatewayResponse;
    try {
      gatewayResponse = await this.paymentGateway.processPayment(order, {
        ...paymentData,
        amount: paymentData?.amount ?? order.total
      });
    } catch (error) {
      const wrappedError = new Error('Erro ao processar pagamento');
      wrappedError.originalError = error;
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
