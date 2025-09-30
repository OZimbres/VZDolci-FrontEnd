import { Link } from 'react-router-dom';
import './HeroSection.css';

/**
 * Hero Section Component
 * Displays the main hero banner
 */
export function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">VZ Dolci</h1>
        <p className="hero-subtitle">Doces Artesanais de Luxo</p>
        <p className="hero-description">Experiências únicas em cada mordida</p>
        <Link to="/produtos" className="btn btn-primary">
          Conheça Nossos Doces
        </Link>
      </div>
    </section>
  );
}
