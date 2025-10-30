import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { CartItem } from '../../domain/entities/CartItem';
import { Product } from '../../domain/entities/Product';

const CartContext = createContext();
const CART_STORAGE_KEY = 'vz-dolci-cart';

/**
 * Cart Context Provider
 * Manages the shopping cart state and operations with local storage persistence
 */
export function CartProvider({ children }) {
  // Initialize cart from localStorage
  const [cart, setCart] = useState(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        // Reconstruct CartItem and Product instances from plain objects
        return parsedCart.map(item => 
          new CartItem(
            new Product(item.product),
            item.quantity
          )
        );
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
    return [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart]);

  const addToCart = useCallback((product) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return currentCart.map(item => {
          if (item.product.id === product.id) {
            const newItem = new CartItem(item.product, item.quantity + 1);
            return newItem;
          }
          return item;
        });
      }
      
      return [...currentCart, new CartItem(product)];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart((currentCart) =>
      currentCart.filter(item => item.product.id !== productId)
    );
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) return;
    
    setCart((currentCart) =>
      currentCart.map(item => {
        if (item.product.id === productId) {
          const newItem = new CartItem(item.product, quantity);
          return newItem;
        }
        return item;
      })
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Memoize expensive calculations to avoid recomputing on every render
  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.getTotal(), 0);
  }, [cart]);

  const itemCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
    itemCount
  }), [cart, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
