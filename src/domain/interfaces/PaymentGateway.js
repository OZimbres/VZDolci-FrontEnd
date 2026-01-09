/**
 * Payment Gateway Interface
 * Abstraction for payment processing
 * @interface
 * @follows Dependency Inversion Principle (SOLID)
 */
export class PaymentGateway {
  /**
   * Process a payment for the given order using the provided payment data.
   * Implementations should return an object compatible with PaymentInfo.
   *
   * @param {Object} _order - Domain order containing totals and customer data.
   * @param {Object} _paymentData - Gateway-specific data (token, method, amount).
   * @returns {Promise<Object>} Payment information compatible with PaymentInfo.
   */
  async processPayment(_order, _paymentData) {
    throw new Error('processPayment(order, paymentData) must be implemented by the gateway');
  }
}
