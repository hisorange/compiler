import { SmartString } from '../smart-string';
import { ISymbolName } from './interfaces/symbol-name.interface';
import { ISymbol } from './interfaces/symbol.interface';

export class SymbolName extends SmartString implements ISymbolName {
  constructor(protected readonly symbol: ISymbol, protected readonly name: string) {
    super(name);
  }

  get fqn(): ISymbolName {
    let name: ISymbolName = this;

    if (this.symbol.hasParent()) {
      name = new SymbolName(this.symbol, this.symbol.getParent().name.toString() + this.toString());
    }

    return name;
  }
}
