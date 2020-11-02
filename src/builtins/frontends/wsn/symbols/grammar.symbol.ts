import { Symbol } from '../../../../components/iml/symbol';

export class GrammarSymbol extends Symbol {
  protected products: string[] = [];

  addProduct(identifier: string) {
    if (!this.products.includes(identifier)) {
      this.products.push(identifier);
    } else {
      throw new Error('Duplicated production! ' + identifier);
    }
  }

  getProducts() {
    return this.products;
  }
}
