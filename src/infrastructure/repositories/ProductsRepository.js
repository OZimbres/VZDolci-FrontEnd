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
        name: 'Crema Cotta de Abacaxi',
        description: 'Crema Cotta é inspirada no doce italiano Panna Cotta. É um doce à base de leite com uma geléia artesanal de abacaxi por cima.',
        price: 16.00,
        ingredients: 'Creme à base de leite, geléia artesanal de abacaxi',
        story: 'A clássica Crema Cotta com o frescor tropical do abacaxi em geléia artesanal',
        emoji: '🍍',
        image: '/img/products/crema-cotta-abacaxi/Crema%20Cotta%20Abacaxi_cru.jpeg'
      }),
      new Product({
        id: 2,
        name: 'Crema Cotta de Morango',
        description: 'Crema Cotta é inspirada no doce italiano Panna Cotta. É um doce à base de leite com uma geléia artesanal de morango por cima.',
        price: 16.00,
        ingredients: 'Creme à base de leite, geléia artesanal de morango',
        story: 'Camadas suaves de creme de leite com cobertura de morango feito artesanalmente',
        emoji: '🍓',
        image: '/img/products/crema-cotta-morango/Crema%20Cotta%20Morango_cru.jpeg'
      }),
      new Product({
        id: 3,
        name: 'Crema Cotta de Maracujá',
        description: 'Crema Cotta é inspirada no doce italiano Panna Cotta. É um doce à base de leite com uma geléia artesanal de maracujá por cima.',
        price: 16.00,
        ingredients: 'Creme à base de leite, geléia artesanal de maracujá',
        story: 'O equilíbrio perfeito do creme de leite com a acidez do maracujá em geléia artesanal',
        emoji: '🥭',
        image: '/img/products/crema-cotta-maracuja/Crema%20Cotta%20Maracuja_cru.jpeg'
      }),
      new Product({
        id: 4,
        name: 'Strati di Moca',
        description: 'Doce inspirado na bebida de café Mocaccino. Três camadas: creme aveludado de café, creme branco à base de leite e redução de coco.',
        price: 16.00,
        ingredients: 'Creme de café, creme branco à base de leite, redução de coco',
        story: 'Um doce trifásico que combina café aveludado, creme de leite e coco reduzido',
        emoji: '☕',
        image: '/img/products/strati-di-moca/Strati%20di%20Moca_cru.jpeg'
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
