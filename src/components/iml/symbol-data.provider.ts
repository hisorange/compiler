import { ISymbolDataProvider } from './interfaces/symbol-data-provider.interface';
import { ISymbolData } from './interfaces/symbol-data.interface';
import { ISymbol } from './interfaces/symbol.interface';

export class GenericSymbolDataResolver implements ISymbolDataProvider {
  filter(subject: ISymbol) {
    return true;
  }

  resolve(providers: ISymbolDataProvider[]): ISymbolData {
    return {
      $name: (context: ISymbol) => context.name,
      $parent: (context: ISymbol) => (context.hasParent() ? context.getParent().getData(providers) : null),
      $children: (context: ISymbol) => context.getChildren().map(c => c.getData(providers)),
      $unique: (context: ISymbol) => context.name.toString(),
    };
  }
}
