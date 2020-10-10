import { StringCase } from '@artgen/string-case';
import { ISymbolName } from '../interfaces/dtos/symbol-name.interface';
import { ISymbol } from '../interfaces/dtos/symbol.interface';

export class SymbolName extends StringCase implements ISymbolName {
  constructor(
    protected readonly symbol: ISymbol,
    protected readonly name: string,
  ) {
    super(name);
  }

  get fqn(): ISymbolName {
    let name: ISymbolName = this;

    if (this.symbol.hasParent()) {
      name = new SymbolName(
        this.symbol,
        this.symbol.getParent().name.toString() + this.toString(),
      );
    }

    return name;
  }
}
