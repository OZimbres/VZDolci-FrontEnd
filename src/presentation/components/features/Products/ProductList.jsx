import { useProducts } from '../../../../application/hooks/useProducts';
import { ProductCard } from './ProductCard';
import './ProductList.css';

/**
 * Product List Component
 * Displays all available products
 */
export function ProductList() {
  const { products, loading } = useProducts();

  if (loading) {
    return <div className="loading">Carregando produtos...</div>;
  }

  return (
    <div className="products-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
