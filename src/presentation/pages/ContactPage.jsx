import { useCart } from '../../application/contexts/CartContext';

// Environment variables
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '5511999999999';
const PHONE_DISPLAY = import.meta.env.VITE_PHONE_DISPLAY || '(11) 99999-9999';
const STORE_ADDRESS = import.meta.env.VITE_STORE_ADDRESS || 'Em breve informações sobre nossa localização';

/**
 * Contact Page
 * Displays contact information and shopping cart
 */
export function ContactPage() {
  const { cart, getTotal } = useCart();

  const generateWhatsAppMessage = () => {
    if (cart.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    let message = '*Pedido VZ Dolci*%0A%0A';
    
    cart.forEach(item => {
      message += `${item.product.name} x${item.quantity} - R$ ${item.getTotal().toFixed(2)}%0A`;
    });
    
    const total = getTotal();
    message += `%0A*Total: R$ ${total.toFixed(2)}*`;
    
    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappLink, '_blank');
  };

  return (
    <main>
      <section className="section" style={{ background: 'var(--light-bg)' }}>
        <div className="container">
          <h2 className="section-title">Entre em Contato</h2>
          <p className="section-subtitle">Estamos prontos para atender você</p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '2rem', 
            marginTop: '3rem' 
          }}>
            <div style={{
              background: 'var(--white)',
              padding: '2rem',
              borderRadius: '15px',
              textAlign: 'center',
              transition: 'transform 0.3s'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📱</div>
              <h3 style={{ 
                color: 'var(--primary-color)', 
                marginBottom: '0.5rem',
                fontFamily: 'Palatino, Times New Roman, serif'
              }}>
                WhatsApp
              </h3>
              <p style={{ marginBottom: '1.5rem' }}>Fale conosco pelo WhatsApp</p>
              <a 
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="btn"
                style={{
                  background: 'var(--secondary-color)',
                  color: 'var(--dark-bg)'
                }}
              >
                Chamar no WhatsApp
              </a>
            </div>

            <div style={{
              background: 'var(--white)',
              padding: '2rem',
              borderRadius: '15px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📞</div>
              <h3 style={{ 
                color: 'var(--primary-color)', 
                marginBottom: '0.5rem',
                fontFamily: 'Palatino, Times New Roman, serif'
              }}>
                Telefone
              </h3>
              <p style={{ marginBottom: '1.5rem' }}>Ligue para fazer seu pedido</p>
              <a 
                href={`tel:+${WHATSAPP_NUMBER}`}
                className="btn"
                style={{
                  background: 'var(--secondary-color)',
                  color: 'var(--dark-bg)'
                }}
              >
                {PHONE_DISPLAY}
              </a>
            </div>

            <div style={{
              background: 'var(--white)',
              padding: '2rem',
              borderRadius: '15px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📍</div>
              <h3 style={{ 
                color: 'var(--primary-color)', 
                marginBottom: '0.5rem',
                fontFamily: 'Palatino, Times New Roman, serif'
              }}>
                Loja Física
              </h3>
              <p style={{ marginBottom: '1.5rem' }}>Visite nossa loja</p>
              <p style={{ color: 'var(--accent-color)', fontStyle: 'italic' }}>
                {STORE_ADDRESS}
              </p>
            </div>
          </div>

          {cart.length > 0 && (
            <div style={{
              background: 'linear-gradient(135deg, #6B1B5E, #8B4789)',
              color: 'var(--text-light)',
              padding: '2rem',
              borderRadius: '15px',
              marginTop: '3rem',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              <h3 style={{ 
                color: 'var(--secondary-color)', 
                marginBottom: '1.5rem',
                textAlign: 'center',
                fontFamily: 'Palatino, Times New Roman, serif'
              }}>
                Seu Pedido
              </h3>
              <div style={{ marginBottom: '1.5rem' }}>
                {cart.map((item, index) => (
                  <div key={index} style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '1rem',
                    marginBottom: '0.5rem',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span>{item.product.name} x{item.quantity}</span>
                    <span>R$ {item.getTotal().toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <p style={{
                fontSize: '1.5rem',
                textAlign: 'center',
                marginBottom: '1.5rem',
                color: 'var(--secondary-color)',
                fontWeight: 'bold'
              }}>
                Total: R$ {getTotal().toFixed(2)}
              </p>
              <div style={{ textAlign: 'center' }}>
                <button className="btn btn-primary" onClick={generateWhatsAppMessage}>
                  Finalizar Pedido via WhatsApp
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
