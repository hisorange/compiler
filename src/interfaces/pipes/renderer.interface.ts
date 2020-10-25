import { IRenderEngine } from '@artgen/renderer';
import { Constructor } from '@loopback/context';
import { ISymbol } from '../dtos/symbol.interface';
import { ISymbolDataProvider } from '../symbol-data-provider.interface';
import { ISymbolData } from '../symbol-data.interface';

export interface IRenderer {
  readonly engine: IRenderEngine;
  readonly interest: Array<Constructor<ISymbol>>;
  readonly dataProviders: ISymbolDataProvider[];

  render(symbol: ISymbol, data: ISymbolData): void;
}
