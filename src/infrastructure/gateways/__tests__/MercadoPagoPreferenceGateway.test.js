import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MercadoPagoPreferenceGateway } from '../MercadoPagoPreferenceGateway.js';

vi.mock('../../config/mercadopago.config.js', () => ({
  MERCADO_PAGO_CONFIG: {
    publicKey: 'TEST-public-key'
  }
}));

describe('MercadoPagoPreferenceGateway', () => {
  let gateway;

  beforeEach(() => {
    gateway = new MercadoPagoPreferenceGateway();
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('deve criar instância com configurações padrão', () => {
      expect(gateway).toBeInstanceOf(MercadoPagoPreferenceGateway);
      expect(gateway.apiBaseUrl).toBe('/api');
    });

    it('deve aceitar apiBaseUrl customizada', () => {
      const customGateway = new MercadoPagoPreferenceGateway({ 
        apiBaseUrl: '/custom-api' 
      });
      expect(customGateway.apiBaseUrl).toBe('/custom-api');
    });
  });

  describe('normalizeItems', () => {
    it('deve normalizar items do carrinho corretamente', () => {
      const cartItems = [
        {
          product: { id: '1', name: 'Brigadeiro', price: 5.00, description: 'Delicioso' },
          quantity: 2
        }
      ];

      const normalized = gateway.normalizeItems(cartItems);

      expect(normalized).toHaveLength(1);
      expect(normalized[0]).toEqual({
        id: '1',
        name: 'Brigadeiro',
        description: 'Delicioso',
        price: 5.00,
        quantity: 2,
        imageUrl: null
      });
    });

    it('deve lidar com items sem product wrapper', () => {
      const items = [
        { id: '2', name: 'Beijinho', price: 4.50 }
      ];

      const normalized = gateway.normalizeItems(items);

      expect(normalized[0].name).toBe('Beijinho');
      expect(normalized[0].quantity).toBe(1);
    });
  });

  describe('normalizePayer', () => {
    it('deve normalizar dados do pagador', () => {
      const customerInfo = {
        name: 'João Silva',
        email: 'joao@email.com',
        phone: '11999999999',
        cpf: '123. 456.789-00'
      };

      const normalized = gateway.normalizePayer(customerInfo);

      expect(normalized).toEqual({
        name: 'João Silva',
        email: 'joao@email.com',
        phone: '11999999999',
        cpf: '123.456.789-00'
      });
    });

    it('deve retornar objeto vazio se customerInfo for null', () => {
      const normalized = gateway.normalizePayer(null);
      expect(normalized).toEqual({});
    });
  });

  describe('createPreference', () => {
    it('deve lançar erro se order for null', async () => {
      await expect(gateway.createPreference(null))
        .rejects.toThrow('Pedido é obrigatório');
    });

    it('deve lançar erro se items estiver vazio', async () => {
      await expect(gateway.createPreference({ items: [] }))
        .rejects.toThrow('Itens do pedido são obrigatórios');
    });
  });
});
