import { ISymbol } from './dtos/symbol.interface';
import { ISymbolTable } from './symbol-table.interface';

export interface ISymbolId {
  readonly id: number;
  readonly reference: string;
  readonly context: string[];
  readonly instance: ISymbol;
  readonly table: ISymbolTable;
}
