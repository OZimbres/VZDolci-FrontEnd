import { HeroSection } from '../components/features/Home/HeroSection';
import { SEO } from '../components/common/SEO';

/**
 * Home Page
 * Main landing page of the website
 */
export function HomePage() {
  return (
    <>
      <SEO 
        title="VZ Dolci - Doces Artesanais de Luxo"
        description="Descubra os melhores doces artesanais. Panna cotta, pão de mel e criações exclusivas. Qualidade premium e sabor inesquecível."
        canonical="https://vz-dolci.vercel.app"
      />
      <main className="home-page">
        <HeroSection />
      </main>
    </>
  );
}
