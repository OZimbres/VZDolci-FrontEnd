/**
 * Calculate Cart Total Use Case
 * Business logic for calculating the total price of the cart
 */
export class CalculateCartTotalUseCase {
  execute(cart) {
    return cart.reduce((total, item) => total + item.getTotal(), 0);
  }
}
