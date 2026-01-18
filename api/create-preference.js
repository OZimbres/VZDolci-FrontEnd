/* eslint-env node */
/* global process */
import mercadopago from 'mercadopago';

const { MercadoPagoConfig, Preference } = mercadopago;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Este endpoint aceita apenas POST',
    });
  }

  try {
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

    if (!accessToken) {
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'MERCADO_PAGO_ACCESS_TOKEN não configurada',
      });
    }

    const client = new MercadoPagoConfig({
      accessToken,
    });

    const { items, payer } = req.body || {};

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Itens do carrinho são obrigatórios',
      });
    }

    const pricePattern = /^\d+(\.\d{1,2})?$/;
    const hasInvalidValues = items.some((item) => {
      const price = Number(item.price);
      const quantity = Number(item.quantity);
      const hasName = typeof item.name === 'string' && item.name.trim().length > 0;

      return (
        !hasName ||
        !Number.isFinite(price) ||
        !Number.isFinite(quantity) ||
        price <= 0 ||
        quantity <= 0 ||
        quantity > 1000 ||
        price > 1000000 ||
        !Number.isInteger(quantity) ||
        !pricePattern.test(String(item.price))
      );
    });

    if (hasInvalidValues) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Preço e quantidade devem ser números válidos',
      });
    }

    const preferenceItems = items.map((item) => ({
      title: item.name,
      unit_price: Number(item.price),
      quantity: Number(item.quantity),
      currency_id: 'BRL',
      description: item.description || '',
      picture_url: item.imageUrl || '',
      category_id: 'food',
    }));

    const baseUrl =
      process.env.APP_URL ||
      process.env.VITE_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '');

    const isProduction = process.env.NODE_ENV === 'production';

    if (!baseUrl && isProduction) {
      console.error('Base URL não configurada em produção');
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message:
          'URL base da aplicação não configurada. Verifique APP_URL, VITE_APP_URL ou VERCEL_URL.',
      });
    }

    const resolvedBaseUrl = baseUrl || 'http://localhost:3000';

    if (isProduction && !resolvedBaseUrl.startsWith('https://')) {
      console.error('Base URL deve usar HTTPS em produção');
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'URL base inválida para produção. Use HTTPS.',
      });
    }

    const preferenceBody = {
      items: preferenceItems,
      payer: payer
        ? {
            name: payer.name,
            email: payer.email,
            phone: payer.phone
              ? {
                  area_code: payer.phone.area_code,
                  number: payer.phone.number,
                }
              : undefined,
          }
        : undefined,
      back_urls: {
        success: `${resolvedBaseUrl}/payment/success`,
        failure: `${resolvedBaseUrl}/payment/failure`,
        pending: `${resolvedBaseUrl}/payment/pending`,
      },
      notification_url: `${resolvedBaseUrl}/api/webhook`,
      auto_return: 'approved',
      payment_methods: {
        excluded_payment_types: [],
        installments: 12,
      },
      external_reference: `VZDolci-${Date.now()}`,
      metadata: {
        created_at: new Date().toISOString(),
        source: 'vz-dolci-frontend',
      },
    };

    const preference = new Preference(client);
    const response = await preference.create({ body: preferenceBody });

    return res.status(200).json({
      success: true,
      preferenceId: response.id,
      initPoint: response.init_point,
      sandboxInitPoint: response.sandbox_init_point,
    });
  } catch (error) {
    console.error('Erro ao criar preferência:', error);

    const isDevelopment = process.env.NODE_ENV !== 'production';

    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Erro ao criar preferência de pagamento',
      ...(isDevelopment
        ? { details: 'Erro interno. Consulte os logs do servidor para mais detalhes.' }
        : {}),
    });
  }
}
