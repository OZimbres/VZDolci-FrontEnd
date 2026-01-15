import handler from '../mercadopago/payment-status/[id].js';

export default async function paymentStatus(req, res) {
  // Normalize parameter name to `id` so the upstream handler works
  req.query = {
    ...req.query,
    id: req.query?.paymentId ?? req.query?.id
  };
  return handler(req, res);
}
