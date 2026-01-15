/* eslint-env node */
/* global process */
import { Payment } from 'mercadopago';
import { ensureConfigured } from './utils/config.js';
import { logger } from '../utils/logger.js';

const WEBHOOK_PATH = '/api/mercadopago-webhook';

const buildNotificationUrl = (req) => {
  const siteUrl = process.env.SITE_URL?.replace(/\/$/, '');
  if (siteUrl) {
    return `${siteUrl}${WEBHOOK_PATH}`;
  }
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers.host;
  return `${protocol}://${host}${WEBHOOK_PATH}`;
};

const isValidEmail = (value) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/u.test(value);

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const CLEANUP_INTERVAL_MS = 5 * 60_000; // Clean up every 5 minutes
const requestCounters = new Map();
let lastCleanup = Date.now();

// NOTE: Rate limiting implementation is in-memory and per-instance (serverless).
// This is NOT suitable for production distributed environments.
// For production, implement a proper distributed rate limiter backed by shared storage
// (e.g., Redis, Vercel KV) and enforce limits according to your security requirements.
const checkRateLimit = (req) => {
  const key = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  const now = Date.now();
  
  // Lazy cleanup: remove expired entry when accessed
  const current = requestCounters.get(key);
  if (current && now > current.expires) {
    requestCounters.delete(key);
  }
  
  // Periodic cleanup in background (non-blocking)
  if (now - lastCleanup > CLEANUP_INTERVAL_MS) {
    lastCleanup = now;
    // Async cleanup to avoid blocking request (use setTimeout for broader compatibility)
    const cleanupFn = typeof setImmediate !== 'undefined' ? setImmediate : (fn) => setTimeout(fn, 0);
    cleanupFn(() => {
      for (const [k, v] of requestCounters.entries()) {
        if (Date.now() > v.expires) {
          requestCounters.delete(k);
        }
      }
    });
  }
  
  // After lazy cleanup, get entry or create fresh one
  const entry = requestCounters.get(key) ?? { count: 0, expires: now + RATE_LIMIT_WINDOW_MS };

  entry.count += 1;
  requestCounters.set(key, entry);

  return entry.count <= RATE_LIMIT_MAX;
};

const mapPayer = (order, paymentData) => {
  const payerInput = paymentData?.payer ?? {};
  const customer = order?.customerInfo ?? {};
  const rawName = (payerInput.name ?? customer.name ?? '').trim();
  const [firstNameFromName, ...restName] = rawName.split(/\s+/).filter(Boolean);

  const resolvedFirstName = payerInput.firstName?.trim()
    || firstNameFromName
    || 'Cliente';

  const resolvedLastName = payerInput.lastName?.trim()
    || restName.join(' ').trim()
    || 'VZ Dolci';

  const cpf = payerInput.documentNumber ?? payerInput.cpf ?? customer.cpf;

  const email = payerInput.email ?? customer.email;

  return {
    email,
    first_name: resolvedFirstName,
    last_name: resolvedLastName,
    identification: cpf ? {
      type: payerInput.documentType ?? 'CPF',
      number: cpf
    } : undefined
  };
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!checkRateLimit(req)) {
    res.setHeader('Retry-After', '60');
    return res.status(429).json({
      error: 'Muitas tentativas. Aguarde 1 minuto antes de gerar um novo pagamento.',
      retryAfter: 60
    });
  }

  let client;
  try {
    client = ensureConfigured();
  } catch (error) {
    logger.error('Mercado Pago não configurado', { error: error.message });
    return res.status(500).json({ error: error.message });
  }

  const { order, paymentData = {} } = req.body ?? {};

  if (!order || typeof order !== 'object') {
    return res.status(400).json({ error: 'Pedido inválido' });
  }

  const amount = Number(paymentData?.amount ?? order?.total);
  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Valor do pagamento inválido' });
  }

  const email = paymentData?.payer?.email ?? order?.customerInfo?.email;
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Email do pagador é obrigatório e deve ser válido' });
  }

  const description = paymentData?.description
    ?? (order?.id ? `Pedido ${order.id}` : 'Pagamento VZ Dolci');

  const paymentPayload = {
    transaction_amount: amount,
    payment_method_id: paymentData?.paymentMethod ?? paymentData?.method ?? 'pix',
    description,
    notification_url: buildNotificationUrl(req),
    payer: mapPayer(order, paymentData),
    metadata: {
      orderId: order?.id ?? order?.orderId,
      ...paymentData?.metadata
    }
  };

  try {
    logger.info('Iniciando criação de pagamento Mercado Pago', {
      orderId: paymentPayload.metadata.orderId,
      amount: paymentPayload.transaction_amount,
      payerEmail: paymentPayload.payer?.email
    });
    
    // Cria instância do Payment client usando o client configurado
    const paymentClient = new Payment(client);
    
    // Na versão 2.x do SDK, o payload vai dentro de { body: ... }
    const payment = await paymentClient.create({ body: paymentPayload });

    const normalized = {
      paymentId: payment?.id,
      status: payment?.status,
      method: payment?.payment_method_id,
      amount: payment?.transaction_amount,
      currency: payment?.currency_id,
      qrCode: payment?.point_of_interaction?.transaction_data?.qr_code,
      qrCodeBase64: payment?.point_of_interaction?.transaction_data?.qr_code_base64,
      expiresAt: payment?.date_of_expiration,
      metadata: payment?.metadata
    };

    logger.info('Pagamento Mercado Pago criado com sucesso', {
      paymentId: normalized.paymentId,
      status: normalized.status,
      orderId: normalized.metadata?.orderId
    });
    
    return res.status(201).json({ payment: normalized });
  } catch (error) {
    const safeError = {
      message: error?.message,
      code: error?.code,
      name: error?.name,
      status: error?.status ?? error?.statusCode ?? error?.response?.status
    };
    logger.error('Erro ao criar pagamento Mercado Pago', { error: safeError });
    
    // Na versão 2.x, erros vêm em error.cause ou error.response
    const rawDetails = error?.cause ?? error?.response;
    const safeDetails = {
      message: rawDetails?.message || error?.message || 'Erro ao processar pagamento'
    };

    const mpStatus = safeError.status;
    let httpStatus = 502;
    if (typeof mpStatus === 'number') {
      if (mpStatus >= 400 && mpStatus < 500) {
        httpStatus = 400;
      } else if (mpStatus >= 500 && mpStatus < 600) {
        httpStatus = 502;
      }
    }

    logger.error('Falha ao criar pagamento Mercado Pago', {
      orderId: paymentPayload.metadata.orderId,
      status: httpStatus,
      message: safeDetails.message
    });

    return res.status(httpStatus).json({ error: 'Falha ao criar pagamento', details: safeDetails });
  }
}
