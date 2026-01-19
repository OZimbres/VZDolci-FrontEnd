import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../../application/contexts/CartContext';
import { SEO } from '../components/common/SEO';
import './CheckoutReturnPage.css';

/**
 * Página de retorno do Checkout PRO do Mercado Pago
 * Processa os parâmetros de retorno e exibe feedback ao usuário
 */
export function CheckoutReturnPage() {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(true);

  const paymentData = useMemo(() => ({
    status: searchParams.get('status') || searchParams.get('collection_status'),
    paymentId: searchParams.get('payment_id') || searchParams.get('collection_id'),
    externalReference: searchParams.get('external_reference'),
    merchantOrderId: searchParams.get('merchant_order_id'),
    preferenceId: searchParams.get('preference_id'),
    paymentType: searchParams.get('payment_type')
  }), [searchParams]);

  const paymentStatus = useMemo(() => {
    const status = paymentData.status?.toLowerCase();

    if (status === 'approved' || status === 'success') {
      return 'success';
    }
    if (status === 'pending' || status === 'in_process') {
      return 'pending';
    }
    if (status === 'rejected' || status === 'failure' || status === 'cancelled') {
      return 'failure';
    }

    return 'unknown';
  }, [paymentData.status]);

  useEffect(() => {
    const processPaymentReturn = async () => {
      setIsProcessing(true);

      try {
        if (paymentStatus === 'success') {
          clearCart();
        }

      } finally {
        setIsProcessing(false);
      }
    };

    processPaymentReturn();
  }, [paymentStatus, paymentData, clearCart]);

  const statusConfig = {
    success: {
      emoji: '✅',
      title: 'Pagamento Aprovado!',
      subtitle: 'Seu pedido foi confirmado com sucesso',
      description: 'Você receberá um email com os detalhes do seu pedido. Entraremos em contato para combinar a entrega.',
      primaryAction: { label: 'Voltar ao Início', path: '/' },
      secondaryAction: { label: 'Ver Produtos', path: '/produtos' },
      seoTitle: 'Pagamento Aprovado'
    },
    pending: {
      emoji: '⏳',
      title: 'Pagamento Pendente',
      subtitle: 'Estamos aguardando a confirmação do seu pagamento',
      description: 'Assim que o pagamento for confirmado, você receberá um email de confirmação. Pagamentos via boleto podem levar até 3 dias úteis.',
      primaryAction: { label: 'Voltar ao Início', path: '/' },
      secondaryAction: { label: 'Entrar em Contato', path: '/contato' },
      seoTitle: 'Pagamento Pendente'
    },
    failure: {
      emoji: '❌',
      title: 'Pagamento não Aprovado',
      subtitle: 'Houve um problema com seu pagamento',
      description: 'O pagamento não foi processado. Isso pode acontecer por diversos motivos: cartão recusado, dados incorretos ou limite insuficiente. Tente novamente ou escolha outra forma de pagamento.',
      primaryAction: { label: 'Tentar Novamente', path: '/checkout' },
      secondaryAction: { label: 'Entrar em Contato', path: '/contato' },
      seoTitle: 'Pagamento não Aprovado'
    },
    unknown: {
      emoji: '❓',
      title: 'Status Desconhecido',
      subtitle: 'Não conseguimos identificar o status do seu pagamento',
      description: 'Entre em contato conosco para verificar a situação do seu pedido.',
      primaryAction: { label: 'Entrar em Contato', path: '/contato' },
      secondaryAction: { label: 'Voltar ao Início', path: '/' },
      seoTitle: 'Verificar Pagamento'
    }
  };

  const config = statusConfig[paymentStatus];

  if (isProcessing) {
    return (
      <main id="main-content" className="checkout-return-page">
        <div className="container">
          <div className="return-card processing">
            <div className="spinner"></div>
            <h2>Processando...</h2>
            <p>Aguarde enquanto verificamos seu pagamento</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <SEO
        title={config.seoTitle}
        description={config.subtitle}
        robots="noindex, follow"
      />
      <main id="main-content" className="checkout-return-page">
        <div className="container">
          <div className={`return-card status-${paymentStatus}`}>
            <span className="return-emoji">{config.emoji}</span>
            <h1 className="return-title">{config.title}</h1>
            <p className="return-subtitle">{config.subtitle}</p>
            <p className="return-description">{config.description}</p>

            {paymentData.paymentId && (
              <div className="payment-details">
                <p><strong>ID do Pagamento:</strong> {paymentData.paymentId}</p>
                {paymentData.externalReference && (
                  <p><strong>Referência:</strong> {paymentData.externalReference}</p>
                )}
              </div>
            )}

            <div className="return-actions">
              <Link to={config.primaryAction.path} className="btn btn-primary">
                {config.primaryAction.label}
              </Link>
              <Link to={config.secondaryAction.path} className="btn btn-secondary">
                {config.secondaryAction.label}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
