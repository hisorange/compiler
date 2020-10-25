import { ISmartString } from '@artgen/smart-string';
import { ISymbol } from './dtos/symbol.interface';
import { ISymbolDataProvider } from './symbol-data-provider.interface';

export type ISymbolDataTypes = null | string | number | boolean | ISymbolData | ISymbolData[] | ISmartString;

export type ISymbolDataCreator<R> = (
  context: ISymbol,
  mutators?: ISymbolDataProvider[],
) => R | ISymbolDataCreator<ISymbolDataTypes>;

export interface ISymbolData {
  [K: string]: ISymbolDataTypes | ISymbolDataCreator<ISymbolDataTypes>;
}
