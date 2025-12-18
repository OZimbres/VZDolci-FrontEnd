import { useState, useEffect } from 'react';
import { ProductsRepository } from '../../infrastructure/repositories/ProductsRepository';

/**
 * Custom hook to fetch and manage products
 * Uses singleton repository instance for better performance
 */
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Reference to singleton repository instance
  const repository = ProductsRepository;

  useEffect(() => {
    const allProducts = repository.getAllProducts();
    setProducts(allProducts);
    setLoading(false);
  }, [repository]);

  return { products, loading };
}
