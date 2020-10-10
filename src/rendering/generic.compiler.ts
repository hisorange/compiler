import { IRenderEngine } from '../interfaces/components/render-engine.interface';
import { Constructor } from '../interfaces/constructor.interface';
import { ISymbol } from '../interfaces/dtos/symbol.interface';
import { IRenderer } from '../interfaces/pipes/renderer.interface';
import { ISymbolDataProvider } from '../interfaces/symbol-data-provider.interface';
import { ISymbolData } from '../interfaces/symbol-data.interface';

export abstract class Renderer implements IRenderer {
  constructor(
    readonly engine: IRenderEngine,
    readonly interest: Constructor<ISymbol>[] = [],
    readonly dataProviders: ISymbolDataProvider[] = [],
  ) {}

  abstract render(symbol: ISymbol, data: ISymbolData): void;
}
