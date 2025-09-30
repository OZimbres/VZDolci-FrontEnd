import { useCart } from '../../../../application/contexts/CartContext';
import './ProductCard.css';

/**
 * Product Card Component
 * Displays a single product with add to cart functionality
 */
export function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <div className="product-placeholder">{product.emoji}</div>
      </div>
      <h3 className="product-name">{product.name}</h3>
      <p className="product-description">{product.description}</p>
      <div className="product-details">
        <p className="product-ingredients">
          <strong>Ingredientes:</strong> {product.ingredients}
        </p>
        <p className="product-story">{product.story}</p>
      </div>
      <p className="product-price">{product.getFormattedPrice()}</p>
      <button className="btn btn-secondary" onClick={handleAddToCart}>
        Adicionar ao Pedido
      </button>
    </div>
  );
}
