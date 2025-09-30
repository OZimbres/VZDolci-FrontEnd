import { useState, useEffect } from 'react';
import { ProductsRepository } from '../../infrastructure/repositories/ProductsRepository';

/**
 * Custom hook to fetch and manage products
 */
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const repository = new ProductsRepository();
    const allProducts = repository.getAllProducts();
    setProducts(allProducts);
    setLoading(false);
  }, []);

  return { products, loading };
}
