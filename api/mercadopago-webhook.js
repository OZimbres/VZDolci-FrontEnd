import handler from './webhooks/mercadopago.js';

export default async function mercadopagoWebhook(req, res) {
  return handler(req, res);
}
