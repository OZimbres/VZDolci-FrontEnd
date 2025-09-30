/**
 * Add to Cart Use Case
 * Business logic for adding a product to the cart
 */
export class AddToCartUseCase {
  execute(cart, product) {
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.incrementQuantity();
      return cart;
    }
    
    const { CartItem } = require('../entities/CartItem');
    const newItem = new CartItem(product);
    return [...cart, newItem];
  }
}
