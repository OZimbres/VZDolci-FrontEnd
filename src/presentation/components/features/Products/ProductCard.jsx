import { memo } from 'react';
import { useCart } from '../../../../application/contexts/CartContext';
import { OptimizedImage } from '../../common/OptimizedImage';
import './ProductCard.css';

/**
 * Product Card Component
 * Displays a single product with add to cart functionality
 * Memoized to prevent unnecessary re-renders
 */
export const ProductCard = memo(function ProductCard({ product }) {
  const { addToCart } = useCart();
  const ingredientsText = Array.isArray(product.ingredients)
    ? product.ingredients.join(', ')
    : product.ingredients;

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <OptimizedImage
          src={product.getImageUrl()}
          alt={product.imageAlt}
          className="product-image-media"
        />
      </div>
      <h3 className="product-name">{product.name}</h3>
      <p className="product-description">{product.description}</p>
      <div className="product-details">
        <p className="product-ingredients">
          <strong>Ingredientes:</strong> {ingredientsText}
        </p>
        <p className="product-story">{product.story}</p>
      </div>
      <p className="product-price">{product.getFormattedPrice()}</p>
      <button className="btn btn-secondary" onClick={handleAddToCart}>
        Adicionar ao Pedido
      </button>
    </div>
  );
});
