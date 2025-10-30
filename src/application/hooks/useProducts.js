import { useState, useEffect, useMemo } from 'react';
import { ProductsRepository } from '../../infrastructure/repositories/ProductsRepository';

/**
 * Custom hook to fetch and manage products
 */
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Memoize repository instance to avoid creating new instance on each render
  const repository = useMemo(() => new ProductsRepository(), []);

  useEffect(() => {
    const allProducts = repository.getAllProducts();
    setProducts(allProducts);
    setLoading(false);
  }, [repository]);

  return { products, loading };
}
