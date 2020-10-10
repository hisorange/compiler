import { ISymbol } from './dtos/symbol.interface';
import { ISymbolId } from './symbol-record.interface';

export interface ISymbolTable {
  lookup(context: string): ISymbolId;
  register(symbol: ISymbol): ISymbolId;
}
