import { useNavigate, useSearchParams } from 'react-router-dom';
import { SEO } from '../components/common/SEO';
import './CheckoutResultPage.css';

export function CheckoutFailurePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');

  return (
    <>
      <SEO
        title="Pagamento Não Concluído - VZ Dolci"
        description="Houve um problema com seu pagamento"
        robots="noindex, nofollow"
      />

      <main id="main-content" className="checkout-result-page">
        <section className="result-section failure">
          <div className="container">
            <div className="result-card">
              <div className="result-icon failure-icon">❌</div>

              <h1 className="result-title">Pagamento Não Concluído</h1>

              <p className="result-message">
                Não conseguimos processar seu pagamento.
              </p>

              {paymentId && (
                <div className="payment-details">
                  <p><strong>ID da Tentativa:</strong> {paymentId}</p>
                  {status && <p><strong>Status:</strong> {status}</p>}
                </div>
              )}

              <div className="result-info error-info">
                <p><strong>Possíveis causas:</strong></p>
                <ul>
                  <li>Saldo insuficiente</li>
                  <li>Dados incorretos</li>
                  <li>Limite excedido</li>
                  <li>Tempo expirado</li>
                </ul>
              </div>

              <div className="result-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/checkout')}
                >
                  Tentar Novamente
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER;
                    const message = 'Olá! Tive problemas com o pagamento e gostaria de finalizar meu pedido.';
                    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
                  }}
                >
                  Pagar via WhatsApp
                </button>
              </div>

              <div className="contact-info">
                <p>
                  💬 Precisa de ajuda? Fale conosco:<br />
                  <a
                    href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-link"
                  >
                    Atendimento via WhatsApp
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
