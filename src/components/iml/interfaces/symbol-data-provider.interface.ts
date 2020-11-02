import { ISymbolData } from './symbol-data.interface';
import { ISymbol } from './symbol.interface';

export interface ISymbolDataProvider {
  filter(symbol: ISymbol): boolean;

  resolve(resolvers: ISymbolDataProvider[]): ISymbolData;
}
