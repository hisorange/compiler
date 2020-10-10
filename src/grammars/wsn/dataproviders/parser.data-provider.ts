import { ProductionSymbol } from '../../../grammars/wsn/symbols/production.symbol';
import { ISymbol } from '../../../interfaces/dtos/symbol.interface';
import { ISymbolDataProvider } from '../../../interfaces/symbol-data-provider.interface';

export class ParserDataProvider implements ISymbolDataProvider {
  filter(symbol: ISymbol): boolean {
    return symbol instanceof ProductionSymbol;
  }

  resolve(providers: ISymbolDataProvider[]) {
    return {
      name: (production: ISymbol) => production.name,
      reference: (production: ISymbol) => production.name.toString(),
      constant: (production: ISymbol) =>
        production.name.snakeCase.upperCase.prefix('ID_'),
      expression: (production: ProductionSymbol) => {
        return production.expressions as any;
      },
    };
  }
}
