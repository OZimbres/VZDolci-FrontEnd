/* eslint-env node */
/* global process */

import { MercadoPagoConfig, Preference } from 'mercadopago';
import { sendSuccess, sendError } from '../utils/api-helpers.js';

const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || process.env.MERCADO_PAGO_ACCESS_TOKEN;
const SITE_URL = process.env.SITE_URL || 'https://vz-dolci.vercel.app';
const PREFERENCE_EXPIRATION_MS = 24 * 60 * 60 * 1000;

/**
 * Cria uma Preference do Mercado Pago para Checkout PRO
 * A Preference contém todas as informações do pedido e configurações
 * de retorno que o Mercado Pago usará para processar o pagamento
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendError(res, 'Método não permitido', 405);
  }

  if (!ACCESS_TOKEN) {
    console.error('MP_ACCESS_TOKEN não configurado');
    return sendError(res, 'Configuração de pagamento inválida', 500);
  }

  try {
    const { items, payer, orderId, metadata } = req.body;

    const validation = validatePreferenceRequest(items, payer);
    if (!validation.valid) {
      return sendError(res, validation.error, 400);
    }

    const client = new MercadoPagoConfig({
      accessToken: ACCESS_TOKEN,
      options: { timeout: 5000 }
    });

    const preference = new Preference(client);

    const preferenceItems = items.map((item, index) => ({
      id: item.id || `item-${index}`,
      title: item.name || item.title,
      description: item.description || '',
      quantity: Number(item.quantity) || 1,
      unit_price: Number(item.price || item.unit_price),
      currency_id: 'BRL',
      picture_url: item.imageUrl || item.picture_url || null
    }));

    const preferenceData = {
      items: preferenceItems,
      payer: {
        name: payer?.name || '',
        email: payer?.email || '',
        phone: payer?.phone
          ? {
              area_code: extractAreaCode(payer.phone),
              number: extractPhoneNumber(payer.phone)
            }
          : undefined,
        identification: payer?.cpf
          ? {
              type: 'CPF',
              number: payer.cpf.replace(/\D/g, '')
            }
          : undefined
      },
      back_urls: {
        success: `${SITE_URL}/checkout/retorno?status=success`,
        failure: `${SITE_URL}/checkout/retorno?status=failure`,
        pending: `${SITE_URL}/checkout/retorno?status=pending`
      },
      auto_return: 'approved',
      statement_descriptor: 'VZ DOLCI',
      external_reference: orderId || `order-${Date.now()}`,
      metadata: {
        orderId,
        ...metadata
      },
      payment_methods: {
        installments: 12,
        default_installments: 1
      },
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + PREFERENCE_EXPIRATION_MS).toISOString()
    };

    const result = await preference.create({ body: preferenceData });

    return sendSuccess(res, {
      preferenceId: result.id,
      initPoint: result.init_point,
      sandboxInitPoint: result.sandbox_init_point,
      externalReference: result.external_reference
    });
  } catch (error) {
    console.error('Erro ao criar preference:', error);

    const statusCode = error.status || 500;
    const message = error.message || 'Erro ao processar pagamento';

    return sendError(res, message, statusCode, {
      cause: error.cause,
      errorCode: error.code
    });
  }
}

function validatePreferenceRequest(items, payer) {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return { valid: false, error: 'Items do pedido são obrigatórios' };
  }

  for (const item of items) {
    if (!item.name && !item.title) {
      return { valid: false, error: 'Cada item deve ter um nome/título' };
    }
    const price = Number(item.price || item.unit_price);
    if (!price || price <= 0) {
      return { valid: false, error: 'Cada item deve ter um preço válido maior que zero' };
    }
    const quantity = Number(item.quantity);
    if (!quantity || quantity < 1) {
      return { valid: false, error: 'Cada item deve ter quantidade válida (mínimo 1)' };
    }
  }

  if (!payer || !payer.email) {
    return { valid: false, error: 'Email do pagador é obrigatório' };
  }

  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/u;
  if (!emailRegex.test(payer.email)) {
    return { valid: false, error: 'Email do pagador é inválido' };
  }

  return { valid: true };
}

function extractAreaCode(phone) {
  const digits = phone.replace(/\D/g, '');
  const localDigits = digits.startsWith('55') ? digits.slice(2) : digits;
  return localDigits.slice(0, 2);
}

function extractPhoneNumber(phone) {
  const digits = phone.replace(/\D/g, '');
  const localDigits = digits.startsWith('55') ? digits.slice(2) : digits;
  return localDigits.slice(2);
}
