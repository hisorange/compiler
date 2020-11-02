import { ISymbolId } from './symbol-record.interface';
import { ISymbol } from './symbol.interface';

export interface ISymbolTable {
  lookup(context: string): ISymbolId;
  register(symbol: ISymbol): ISymbolId;
}
