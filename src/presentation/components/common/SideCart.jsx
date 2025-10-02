import { useState, forwardRef, useImperativeHandle } from 'react';
import { useCart } from '../../../application/contexts/CartContext';
import './SideCart.css';

// Environment variables
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '5511999999999';

/**
 * Side Cart Component
 * Retractable cart sidebar visible on all pages
 */
export const SideCart = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, updateQuantity, removeFromCart, getTotal } = useCart();

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  // Expose toggleCart to parent via ref
  useImperativeHandle(ref, () => ({
    toggleCart
  }));

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemove = (productId) => {
    removeFromCart(productId);
  };

  const generateWhatsAppMessage = () => {
    if (cart.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    let message = '*Pedido VZ Dolci*%0A%0A';
    
    cart.forEach(item => {
      message += `${item.product.name} x${item.quantity} - R$ ${item.getTotal().toFixed(2)}%0A`;
    });
    
    const total = getTotal();
    message += `%0A*Total: R$ ${total.toFixed(2)}*`;
    
    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappLink, '_blank');
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="cart-overlay" onClick={toggleCart}></div>}

      {/* Side Cart */}
      <div className={`side-cart ${isOpen ? 'open' : ''}`}>
        <div className="side-cart-header">
          <h2>Seu Carrinho</h2>
          <button className="close-btn" onClick={toggleCart} aria-label="Close Cart">
            ✕
          </button>
        </div>

        <div className="side-cart-content">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <p>Seu carrinho está vazio</p>
              <span style={{ fontSize: '3rem' }}>🛒</span>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item) => (
                  <div key={item.product.id} className="cart-item">
                    <div className="cart-item-info">
                      <span className="cart-item-emoji">{item.product.emoji}</span>
                      <div className="cart-item-details">
                        <h4>{item.product.name}</h4>
                        <p className="cart-item-price">R$ {item.product.price.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="cart-item-actions">
                      <div className="quantity-controls">
                        <button 
                          className="qty-btn"
                          onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button 
                          className="qty-btn"
                          onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button 
                        className="remove-btn"
                        onClick={() => handleRemove(item.product.id)}
                        title="Remover item"
                        aria-label="Remover item"
                      >
                        🗑️
                      </button>
                    </div>
                    
                    <div className="cart-item-total">
                      Subtotal: R$ {item.getTotal().toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-footer">
                <div className="cart-total">
                  <strong>Total:</strong>
                  <strong className="total-amount">R$ {getTotal().toFixed(2)}</strong>
                </div>
                <button 
                  className="checkout-btn"
                  onClick={generateWhatsAppMessage}
                >
                  Finalizar Pedido via WhatsApp
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
});
