// Environment variables
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '5511999999999';
const PHONE_DISPLAY = import.meta.env.VITE_PHONE_DISPLAY || '(11) 99999-9999';
const STORE_ADDRESS = import.meta.env.VITE_STORE_ADDRESS || 'Em breve informações sobre nossa localização';

/**
 * Contact Page
 * Displays contact information
 */
export function ContactPage() {

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
        </div>
      </section>
    </main>
  );
}
