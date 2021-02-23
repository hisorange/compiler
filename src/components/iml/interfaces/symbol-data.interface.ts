import { ISmartString } from '../../smart-string';
import { ISymbolDataProvider } from './symbol-data-provider.interface';
import { ISymbol } from './symbol.interface';

export type ISymbolDataTypes =
  | null
  | string
  | number
  | boolean
  | ISymbolData
  | ISymbolData[]
  | ISmartString;

export type ISymbolDataCreator<R> = (
  context: ISymbol,
  mutators?: ISymbolDataProvider[],
) => R | ISymbolDataCreator<ISymbolDataTypes>;

export interface ISymbolData {
  [K: string]: ISymbolDataTypes | ISymbolDataCreator<ISymbolDataTypes>;
}
