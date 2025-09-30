import { createContext, useContext, useState, useCallback } from 'react';
import { CartItem } from '../../domain/entities/CartItem';

const CartContext = createContext();

/**
 * Cart Context Provider
 * Manages the shopping cart state and operations
 */
export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = useCallback((product) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return currentCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
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
      currentCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
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
