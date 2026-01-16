/* eslint-env node */

import handler from './mercadopago/create-preference.js';

export default async function createPreference(req, res) {
  return handler(req, res);
}
