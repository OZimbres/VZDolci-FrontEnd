// Arquivo temporário para testar variáveis de ambiente
// DELETAR depois da validação

console.log('=== TESTE DE VARIÁVEIS DE AMBIENTE ===');
console.log('Public Key:', import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY);

// Validações
if (import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY) {
  if (import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY.startsWith('TEST-')) {
    console.log('✅ Public Key de Sandbox configurada corretamente!');
  } else if (import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY.startsWith('APP_USR-')) {
    console.log('⚠️ Você está usando Public Key de PRODUÇÃO! Troque para Sandbox.');
  } else {
    console.log('❌ Public Key com formato inesperado.');
  }
} else {
  console.log('❌ Public Key NÃO encontrada! Verifique o .env');
}

// A Access Token NÃO deve aparecer aqui (é apenas para backend)
if (import.meta.env.MERCADO_PAGO_ACCESS_TOKEN) {
  console.log('⚠️ ERRO DE SEGURANÇA: Access Token está exposta no frontend!');
} else {
  console.log('✅ Access Token protegida (não acessível no frontend)');
}
