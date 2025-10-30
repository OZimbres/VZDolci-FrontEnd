import { useState, useEffect } from 'react';
import { ProductsRepository } from '../../infrastructure/repositories/ProductsRepository';

/**
 * Custom hook to fetch and manage products
 * Uses singleton repository instance for better performance
 */
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const allProducts = ProductsRepository.getAllProducts();
    setProducts(allProducts);
    setLoading(false);
  }, []);

  return { products, loading };
}
