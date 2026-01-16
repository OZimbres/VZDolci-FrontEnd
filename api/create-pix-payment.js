import handler from './mercadopago/create-payment.js';

export default async function createPixPayment(req, res) {
  return handler(req, res);
}
