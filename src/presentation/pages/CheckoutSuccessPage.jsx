import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../../application/contexts/CartContext';
import { SEO } from '../components/common/SEO';
import './CheckoutResultPage.css';

export function CheckoutSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();

  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');
  const merchantOrderId = searchParams.get('merchant_order_id');

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <>
      <SEO
        title="Pagamento Confirmado - VZ Dolci"
        description="Seu pagamento foi confirmado com sucesso!"
        robots="noindex, nofollow"
      />

      <main id="main-content" className="checkout-result-page">
        <section className="result-section success">
          <div className="container">
            <div className="result-card">
              <div className="result-icon success-icon">✅</div>

              <h1 className="result-title">Pagamento Confirmado!</h1>

              <p className="result-message">
                Seu pedido foi recebido e está sendo preparado com carinho.
              </p>

              {paymentId && (
                <div className="payment-details">
                  <p><strong>ID do Pagamento:</strong> {paymentId}</p>
                  {merchantOrderId && (
                    <p><strong>Número do Pedido:</strong> {merchantOrderId}</p>
                  )}
                  {status && (
                    <p><strong>Status:</strong> {status}</p>
                  )}
                </div>
              )}

              <div className="result-info">
                <p>🎂 <strong>Em breve você receberá:</strong></p>
                <ul>
                  <li>Confirmação por email</li>
                  <li>Atualização sobre o preparo</li>
                  <li>Informações de entrega/retirada</li>
                </ul>
              </div>

              <div className="result-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/')}
                >
                  Voltar para Home
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate('/produtos')}
                >
                  Ver Mais Produtos
                </button>
              </div>

              <div className="contact-info">
                <p>
                  📞 Dúvidas? Entre em contato via WhatsApp: <br />
                  <a
                    href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-link"
                  >
                    Falar com VZ Dolci
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
