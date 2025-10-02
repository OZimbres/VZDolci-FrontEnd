import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CartItem } from '../../domain/entities/CartItem';
import { Product } from '../../domain/entities/Product';

const CartContext = createContext();
const CART_STORAGE_KEY = 'vz-dolci-cart';

/**
 * Cart Context Provider
 * Manages the shopping cart state and operations with session persistence
 */
export function CartProvider({ children }) {
  // Initialize cart from sessionStorage
  const [cart, setCart] = useState(() => {
    try {
      const storedCart = sessionStorage.getItem(CART_STORAGE_KEY);
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
      console.error('Error loading cart from sessionStorage:', error);
    }
    return [];
  });

  // Save cart to sessionStorage whenever it changes
  useEffect(() => {
    try {
      sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to sessionStorage:', error);
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

  const getTotal = useCallback(() => {
    return cart.reduce((total, item) => total + item.getTotal(), 0);
  }, [cart]);

  const getItemCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount
      }}
    >
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
