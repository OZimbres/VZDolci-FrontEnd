import { Product } from '../../domain/entities/Product';

/**
 * Products Repository
 * Handles data access for products
 * Implements singleton pattern to avoid creating multiple instances
 */
class ProductsRepositoryClass {
  constructor() {
    this.products = [
      new Product({
        id: 1,
        name: 'Panna Cotta',
        description: 'Delicada sobremesa italiana com textura sedosa e sabores refinados',
        price: 18.00,
        ingredients: 'Creme de leite fresco, baunilha Madagascar, açúcar, gelatina',
        story: 'Inspirada nas tradições italianas, nossa panna cotta é uma obra-prima de delicadeza e sabor',
        emoji: '🍮'
      }),
      new Product({
        id: 2,
        name: 'Pão de Mel',
        description: 'Tradicional doce brasileiro com cobertura de chocolate premium',
        price: 12.00,
        ingredients: 'Mel puro, chocolate belga, especiarias selecionadas, farinha especial',
        story: 'Uma releitura sofisticada do clássico brasileiro, com mel artesanal e chocolate importado',
        emoji: '🍯'
      }),
      new Product({
        id: 3,
        name: 'Crema Cotta',
        description: 'Sobremesa cremosa com camadas de sabor intenso',
        price: 20.00,
        ingredients: 'Creme fresco, gemas orgânicas, açúcar mascavo, essências naturais',
        story: 'Uma criação exclusiva VZ Dolci que combina técnicas tradicionais com inovação',
        emoji: '🍨'
      }),
      new Product({
        id: 4,
        name: 'Brownie Premium',
        description: 'Brownie intenso com chocolate 70% cacau',
        price: 15.00,
        ingredients: 'Chocolate 70% cacau, manteiga francesa, nozes pecã, ovos caipiras',
        story: 'Para os verdadeiros amantes de chocolate, uma experiência intensa e inesquecível',
        emoji: '🍫'
      }),
      new Product({
        id: 5,
        name: 'Torta de Limão Siciliano',
        description: 'Equilíbrio perfeito entre azedo e doce',
        price: 22.00,
        ingredients: 'Limão siciliano, merengue italiano, massa amanteigada, creme fresco',
        story: 'Receita secreta que encanta gerações com seu sabor refrescante e sofisticado',
        emoji: '🍋'
      }),
      new Product({
        id: 6,
        name: 'Macarons Sortidos',
        description: 'Delicados macarons franceses em sabores exclusivos',
        price: 8.00,
        ingredients: 'Amêndoas importadas, merengue francês, recheios artesanais variados',
        story: 'Arte francesa em forma de doce, com sabores que vão de pistache a frutas vermelhas',
        emoji: '🧁'
      })
    ];
  }

  getAllProducts() {
    return this.products;
  }

  getProductById(id) {
    return this.products.find(product => product.id === id);
  }
}

// Export singleton instance
export const ProductsRepository = new ProductsRepositoryClass();
