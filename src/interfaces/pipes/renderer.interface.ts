import { Constructor } from '@loopback/context';
import { IRenderEngine } from '../components/render-engine.interface';
import { ISymbol } from '../dtos/symbol.interface';
import { ISymbolDataProvider } from '../symbol-data-provider.interface';
import { ISymbolData } from '../symbol-data.interface';

export interface IRenderer {
  readonly engine: IRenderEngine;
  readonly interest: Array<Constructor<ISymbol>>;
  readonly dataProviders: ISymbolDataProvider[];

  render(symbol: ISymbol, data: ISymbolData): void;
}
