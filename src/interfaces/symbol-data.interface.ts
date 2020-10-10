import { IStringCase } from '@artgen/string-case';
import { ISymbol } from './dtos/symbol.interface';
import { ISymbolDataProvider } from './symbol-data-provider.interface';

export type ISymbolDataTypes =
  | null
  | string
  | number
  | boolean
  | ISymbolData
  | ISymbolData[]
  | IStringCase;

export type ISymbolDataCreator<R> = (
  context: ISymbol,
  mutators?: ISymbolDataProvider[],
) => R | ISymbolDataCreator<ISymbolDataTypes>;

export interface ISymbolData {
  [K: string]: ISymbolDataTypes | ISymbolDataCreator<ISymbolDataTypes>;
}
