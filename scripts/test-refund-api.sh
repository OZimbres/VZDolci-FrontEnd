#!/bin/sh
# Script para testar endpoint de estorno localmente

API_URL="http://localhost:3000/api/mercadopago/refund"
API_KEY="${API_KEY:-INSIRA_SUA_CHAVE_SECRETA_AQUI}"
PAYMENT_ID="${PAYMENT_ID:-1}"

echo "==> Teste 1: Sem API Key"
curl -i -X POST "$API_URL" -H "Content-Type: application/json" -d "{\"paymentId\":\"$PAYMENT_ID\"}"
echo -e "\n\n==> Teste 2: API Key incorreta"
curl -i -X POST "$API_URL" -H "Content-Type: application/json" -H "x-api-key: invalida" -d "{\"paymentId\":\"$PAYMENT_ID\"}"
echo -e "\n\n==> Teste 3: API Key correta (pode retornar 200/502 dependendo do pagamento)"
curl -i -X POST "$API_URL" -H "Content-Type: application/json" -H "x-api-key: $API_KEY" -d "{\"paymentId\":\"$PAYMENT_ID\"}"
echo
