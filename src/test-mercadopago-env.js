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

// A Access Token NÃO deve aparecer aqui neste frontend (será usada apenas em um backend futuro)
if (import.meta.env.MERCADO_PAGO_ACCESS_TOKEN) {
  console.log('⚠️ Access Token encontrada no ambiente do frontend. Em um app apenas frontend (Fase 1), ela NÃO deve estar aqui.');
} else {
  console.log('✅ Nenhuma Access Token encontrada no frontend. Guarde-a para uso apenas em um backend futuro.');
}
