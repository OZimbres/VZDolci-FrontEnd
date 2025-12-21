import { ProductList } from '../components/features/Products/ProductList';
import { SEO } from '../components/common/SEO';
import { ProductGallery } from '../components/features/Product/ProductGallery/ProductGallery';
import './ProductsPage.css';

/**
 * Products Page
 * Displays all available products
 */
export function ProductsPage() {
  return (
    <>
      <SEO 
        title="Nossos Produtos"
        description="Conheça nossa linha completa de doces artesanais de luxo. Panna cotta, brigadeiros gourmet, pão de mel e muito mais."
        canonical="https://vz-dolci.vercel.app/produtos"
      />
      <main id="main-content" tabIndex="-1">
        <section className="section animated-background products-section">
          <div className="container">
            <h2 className="section-title">Nossos Doces</h2>
            <p className="section-subtitle">Criações artesanais com ingredientes premium</p>
            <ProductGallery
              productName="Crema Cotta Abacaxi"
              images={[
                { id: 'hero', src: 'crema-abacaxi-hero', alt: 'Visão principal do doce', type: 'hero' },
                { id: 'top', src: 'crema-abacaxi-top', alt: 'Vista superior do doce', type: 'top' },
                { id: 'detail', src: 'crema-abacaxi-detail', alt: 'Detalhe da textura', type: 'detail' },
              ]}
            />
            <ProductList />
          </div>
        </section>
      </main>
    </>
  );
}
