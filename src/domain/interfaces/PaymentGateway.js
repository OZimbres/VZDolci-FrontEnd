/**
 * Payment Gateway Interface
 * Abstraction for payment processing
 * * @interface
 * @follows Dependency Inversion Principle (SOLID)
 */
export class PaymentGateway {
  async processPayment() {
    throw new Error('processPayment(order, paymentData) must be implemented by the gateway');
  }
}
