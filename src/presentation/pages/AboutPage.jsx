/**
 * About Page
 * Displays company information, mission, and values
 */
export function AboutPage() {
  return (
    <main>
      <section className="section" style={{ background: 'var(--light-bg)' }}>
        <div className="container">
          <h2 className="section-title">Sobre a VZ Dolci</h2>
          
          <div style={{ display: 'grid', gap: '3rem', marginTop: '3rem' }}>
            <div style={{ 
              background: 'var(--white)', 
              padding: '2rem', 
              borderRadius: '15px',
              borderLeft: '4px solid var(--secondary-color)'
            }}>
              <h3 style={{ 
                color: 'var(--primary-color)', 
                marginBottom: '1rem', 
                fontSize: '1.8rem',
                fontFamily: 'Palatino, Times New Roman, serif'
              }}>
                Nossa História
              </h3>
              <p style={{ marginBottom: '1rem', lineHeight: '1.8' }}>
                A VZ Dolci nasceu do sonho de transformar momentos especiais em memórias 
                inesquecíveis através de doces artesanais de altíssima qualidade. Fundada 
                por mestres confeiteiros apaixonados, nossa doceria combina tradição e 
                inovação para criar experiências gastronômicas únicas.
              </p>
              <p style={{ marginBottom: '1rem', lineHeight: '1.8' }}>
                Cada receita é cuidadosamente desenvolvida e testada para garantir não 
                apenas sabor, mas uma verdadeira jornada sensorial. Utilizamos apenas 
                ingredientes premium, muitos importados diretamente de suas regiões de origem.
              </p>
            </div>
            
            <div style={{ 
              background: 'var(--white)', 
              padding: '2rem', 
              borderRadius: '15px',
              borderLeft: '4px solid var(--secondary-color)'
            }}>
              <h3 style={{ 
                color: 'var(--primary-color)', 
                marginBottom: '1rem', 
                fontSize: '1.8rem',
                fontFamily: 'Palatino, Times New Roman, serif'
              }}>
                Nossa Missão
              </h3>
              <p style={{ marginBottom: '1rem', lineHeight: '1.8' }}>
                Proporcionar momentos de felicidade e sofisticação através de doces 
                artesanais excepcionais, elaborados com ingredientes de primeira qualidade 
                e muito amor.
              </p>
              <p style={{ marginBottom: '1rem', lineHeight: '1.8' }}>
                Acreditamos que cada doce conta uma história, e nossa missão é fazer parte 
                das histórias mais doces de nossos clientes.
              </p>
            </div>
            
            <div style={{ 
              background: 'var(--white)', 
              padding: '2rem', 
              borderRadius: '15px',
              borderLeft: '4px solid var(--secondary-color)'
            }}>
              <h3 style={{ 
                color: 'var(--primary-color)', 
                marginBottom: '1rem', 
                fontSize: '1.8rem',
                fontFamily: 'Palatino, Times New Roman, serif'
              }}>
                Nossos Valores
              </h3>
              <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                <li style={{ padding: '0.8rem 0', borderBottom: '1px solid var(--light-bg)' }}>
                  <strong style={{ color: 'var(--primary-color)' }}>Qualidade Premium:</strong> Ingredientes selecionados e processos artesanais
                </li>
                <li style={{ padding: '0.8rem 0', borderBottom: '1px solid var(--light-bg)' }}>
                  <strong style={{ color: 'var(--primary-color)' }}>Inovação:</strong> Constantemente criando novos sabores e experiências
                </li>
                <li style={{ padding: '0.8rem 0', borderBottom: '1px solid var(--light-bg)' }}>
                  <strong style={{ color: 'var(--primary-color)' }}>Tradição:</strong> Respeitando receitas clássicas com técnicas modernas
                </li>
                <li style={{ padding: '0.8rem 0' }}>
                  <strong style={{ color: 'var(--primary-color)' }}>Excelência:</strong> Comprometimento com a perfeição em cada detalhe
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
