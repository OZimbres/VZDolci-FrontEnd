import { memo, useMemo, useState } from 'react';
import { useProducts } from '../../../../application/hooks/useProducts';
import { ProductCard } from './ProductCard';
import './ProductList.css';

/**
 * Product List Component
 * Displays all available products
 * Memoized for better performance
 */
export const ProductList = memo(function ProductList() {
  const { products, loading } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return products;

    return products.filter(product => (
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.ingredients.toLowerCase().includes(term)
    ));
  }, [products, searchTerm]);

  if (loading) {
    return <div className="loading">Carregando produtos...</div>;
  }

  return (
    <>
      <div className="product-search">
        <label htmlFor="product-search" className="product-search__label">
          Busque pelos seus doces favoritos
        </label>
        <input
          id="product-search"
          type="search"
          placeholder="Pesquisar por nome ou ingrediente..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="product-search__input"
        />
      </div>

      {filteredProducts.length > 0 ? (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="no-results">Nenhum produto encontrado para a busca.</p>
      )}
    </>
  );
});
