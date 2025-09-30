/**
 * Product Entity
 * Represents a product in the VZ Dolci catalog
 */
export class Product {
  constructor({
    id,
    name,
    description,
    price,
    ingredients,
    story,
    emoji
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.ingredients = ingredients;
    this.story = story;
    this.emoji = emoji;
  }

  getFormattedPrice() {
    return `R$ ${this.price.toFixed(2).replace('.', ',')}`;
  }
}
