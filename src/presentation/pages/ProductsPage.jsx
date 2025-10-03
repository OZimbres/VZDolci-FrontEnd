import { ProductList } from '../components/features/Products/ProductList';

/**
 * Products Page
 * Displays all available products
 */
export function ProductsPage() {
  return (
    <main>
      <section className="section animated-background">
        <div className="container">
          <h2 className="section-title">Nossos Doces</h2>
          <p className="section-subtitle">Criações artesanais com ingredientes premium</p>
          <ProductList />
        </div>
      </section>
    </main>
  );
}
