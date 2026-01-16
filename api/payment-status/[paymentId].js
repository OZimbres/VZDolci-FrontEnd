import handler from '../mercadopago/payment-status/[id].js';

export default async function paymentStatus(req, res) {
  return handler(req, res);
}
