import { ISymbolTable } from './symbol-table.interface';
import { ISymbol } from './symbol.interface';

export interface ISymbolId {
  readonly id: number;
  readonly reference: string;
  readonly context: string[];
  readonly instance: ISymbol;
  readonly table: ISymbolTable;
}
