# 🚀 Checklist de Deploy - Fase 3 (Pagamentos)

## Pré-Deploy
- [ ] Credenciais de **PRODUÇÃO** do Mercado Pago obtidas (Public Key e Access Token).
- [ ] Variáveis configuradas na Vercel:
  - [ ] `VITE_MP_PUBLIC_KEY` (Production/Preview/Development)
  - [ ] `MP_ACCESS_TOKEN` (Production only)
  - [ ] `MP_REFUND_API_KEY` (Production only)
- [ ] `.env` local com chaves de **TEST** preenchidas (não commitar).
- [ ] Rate limit validado (5 req/min) no `/api/mercadopago/create-payment`.

## Testes Manuais (sandbox)
- [ ] Fluxo feliz PIX com dois itens (QR Code em ≤5s).
- [ ] Validação de erros: CPF inválido, email inválido, telefone vazio.
- [ ] Polling atualiza status para `approved` automaticamente.
- [ ] Timer expira QR Code e permite gerar novo.
- [ ] Fallback “Finalizar via WhatsApp” visível em erro/429.

## Observabilidade
- [ ] Logs estruturados aparecendo em Functions Logs (criação e falhas de pagamento).
- [ ] Webhook de Mercado Pago recebendo notificações.

## Pós-Deploy
- [ ] Documentação de pagamentos publicada ([docs/PAYMENT_INTEGRATION.md](PAYMENT_INTEGRATION.md)).
- [ ] Script `scripts/test-refund-api.sh` validado com API Key correta.
- [ ] Time de suporte informado sobre fluxo de fallback via WhatsApp.
