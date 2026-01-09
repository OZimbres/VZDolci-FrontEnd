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
   * @param {Object} order - Domain order containing totals and customer data.
   * @param {Object} paymentData - Gateway-specific data (token, method, amount).
   * @returns {Promise<Object>} Payment information compatible with PaymentInfo.
   */
  // eslint-disable-next-line no-unused-vars
  async processPayment(order, paymentData) {
    throw new Error('processPayment(order, paymentData) must be implemented by the gateway');
  }
}
