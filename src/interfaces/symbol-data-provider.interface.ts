import { ISymbol } from './dtos/symbol.interface';
import { ISymbolData } from './symbol-data.interface';

export interface ISymbolDataProvider {
  filter(symbol: ISymbol): boolean;

  resolve(resolvers: ISymbolDataProvider[]): ISymbolData;
}
