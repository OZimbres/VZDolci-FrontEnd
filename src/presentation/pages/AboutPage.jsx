import './AboutPage.css';
import { SEO } from '../components/common/SEO';

/**
 * About Page
 * Displays company information, mission, and values
 */
export function AboutPage() {
  return (
    <>
      <SEO 
        title="Sobre Nós"
        description="A VZ Dolci nasceu do sonho de transformar momentos especiais em memórias inesquecíveis através de doces artesanais de altíssima qualidade."
        canonical="https://vz-dolci.vercel.app/sobre"
      />
      <main id="main-content" tabIndex="-1">
        <section className="section animated-background">
          <div className="container">
            <h2 className="section-title">Sobre a VZ Dolci</h2>
            
            <div style={{ display: 'grid', gap: '3rem', marginTop: '3rem' }}>
              <div className="about-card">
                <h3>
                  Nossa História
                </h3>
                <p>
                  A VZ Dolci nasceu do sonho de transformar momentos especiais em memórias 
                  inesquecíveis através de doces artesanais de altíssima qualidade. Fundada 
                  por mestres confeiteiros apaixonados, nossa doceria combina tradição e 
                  inovação para criar experiências gastronômicas únicas.
                </p>
                <p>
                  Cada receita é cuidadosamente desenvolvida e testada para garantir não 
                  apenas sabor, mas uma verdadeira jornada sensorial. Utilizamos apenas 
                  ingredientes premium, muitos importados diretamente de suas regiões de origem.
                </p>
              </div>
              
              <div className="about-card">
                <h3>
                  Nossa Missão
                </h3>
                <p>
                  Proporcionar momentos de felicidade e sofisticação através de doces 
                  artesanais excepcionais, elaborados com ingredientes de primeira qualidade 
                  e muito amor.
                </p>
                <p>
                  Acreditamos que cada doce conta uma história, e nossa missão é fazer parte 
                  das histórias mais doces de nossos clientes.
                </p>
              </div>
              
              <div className="about-card">
                <h3>
                  Nossos Valores
                </h3>
                <ul>
                  <li>
                    <strong>Qualidade Premium:</strong> Ingredientes selecionados e processos artesanais
                  </li>
                  <li>
                    <strong>Inovação:</strong> Constantemente criando novos sabores e experiências
                  </li>
                  <li>
                    <strong>Tradição:</strong> Respeitando receitas clássicas com técnicas modernas
                  </li>
                  <li>
                    <strong>Excelência:</strong> Comprometimento com a perfeição em cada detalhe
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
