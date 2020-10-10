import { GrammarSymbol } from '../../../grammars/wsn/symbols/grammar.symbol';
import { ProductionSymbol } from '../../../grammars/wsn/symbols/production.symbol';
import { ISymbol } from '../../../interfaces/dtos/symbol.interface';
import { ISymbolDataProvider } from '../../../interfaces/symbol-data-provider.interface';

export class GrammarDataProvider implements ISymbolDataProvider {
  filter(symbol: ISymbol): boolean {
    return symbol instanceof GrammarSymbol;
  }

  resolve(providers: ISymbolDataProvider[]) {
    return {
      name: (grammar: ISymbol) => grammar.name,
      productions: (grammar: ISymbol) =>
        grammar
          .getChildren()
          .filter(children => children instanceof ProductionSymbol)
          .map(domain => domain.getData(providers)),
    };
  }
}
