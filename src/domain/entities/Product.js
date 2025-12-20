import productPlaceholder from '../../assets/images/placeholders/product-placeholder.svg';

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
    emoji,
    image = null,
    imageAlt = ''
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.ingredients = ingredients;
    this.story = story;
    this.emoji = emoji;
    this.image = image;
    this.imageAlt = imageAlt || `Foto do produto ${name}`;
  }

  getFormattedPrice() {
    return `R$ ${this.price.toFixed(2).replace('.', ',')}`;
  }

  getImageUrl() {
    return this.image || productPlaceholder;
  }

  hasCustomImage() {
    return Boolean(this.image);
  }
}
