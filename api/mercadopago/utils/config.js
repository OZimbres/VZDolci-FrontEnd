/* eslint-env node */
/* global process */
import { MercadoPagoConfig } from 'mercadopago';

/**
 * Singleton instance do cliente Mercado Pago
 * Evita criar múltiplas instâncias em ambiente serverless
 */
let mercadoPagoClient = null;

/**
 * Inicializa e retorna o cliente Mercado Pago configurado
 * Usa o padrão Singleton para reutilizar a mesma instância
 * @returns {MercadoPagoConfig} Cliente configurado do Mercado Pago
 * @throws {Error} Se MP_ACCESS_TOKEN não estiver configurado
 */
export const ensureConfigured = () => {
  const token = process.env.MP_ACCESS_TOKEN || process.env.MERCADO_PAGO_ACCESS_TOKEN;
  
  if (!token) {
    throw new Error('MP_ACCESS_TOKEN ou MERCADO_PAGO_ACCESS_TOKEN não configurados');
  }
  
  // Cria instância apenas na primeira chamada (Singleton Pattern)
  if (!mercadoPagoClient) {
    mercadoPagoClient = new MercadoPagoConfig({ 
      accessToken: token,
      options: { 
        timeout: 5000 // Timeout de 5 segundos para requisições
      }
    });
  }
  
  return mercadoPagoClient;
};
