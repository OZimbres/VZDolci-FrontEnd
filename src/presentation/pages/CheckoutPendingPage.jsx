import { useNavigate, useSearchParams } from 'react-router-dom';
import { SEO } from '../components/common/SEO';
import './CheckoutResultPage.css';

export function CheckoutPendingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');

  return (
    <>
      <SEO
        title="Pagamento Pendente - VZ Dolci"
        description="Seu pagamento está sendo processado"
        robots="noindex, nofollow"
      />

      <main id="main-content" className="checkout-result-page">
        <section className="result-section pending">
          <div className="container">
            <div className="result-card">
              <div className="result-icon pending-icon">⏳</div>

              <h1 className="result-title">Pagamento Pendente</h1>

              <p className="result-message">
                Seu pagamento está sendo processado. Aguarde a confirmação.
              </p>

              {paymentId && (
                <div className="payment-details">
                  <p><strong>ID do Pagamento:</strong> {paymentId}</p>
                  {status && <p><strong>Status:</strong> {status}</p>}
                </div>
              )}

              <div className="result-info pending-info">
                <p><strong>O que fazer agora?</strong></p>
                <ul>
                  <li>Aguarde alguns minutos</li>
                  <li>Verifique seu email para confirmação</li>
                  <li>Confira se o pagamento foi efetuado no app do banco</li>
                  <li>Se necessário, complete o pagamento PIX pendente</li>
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
                  onClick={() => {
                    const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER;
                    const message = `Olá! Meu pagamento (ID: ${paymentId ?? 'N/A'}) está pendente. Gostaria de verificar o status.`;
                    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
                  }}
                >
                  Falar no WhatsApp
                </button>
              </div>

              <div className="contact-info">
                <p>
                  ℹ️ Assim que o pagamento for confirmado, você receberá um email. <br />
                  Qualquer dúvida, estamos à disposição!
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
