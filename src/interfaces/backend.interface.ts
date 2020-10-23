import { IRenderEngine } from './components/render-engine.interface';
import { ISymbol } from './dtos/symbol.interface';

export interface IBackend {
  render(renderer: IRenderEngine, symbol: ISymbol): Promise<void>;
}

export interface IGenerator {
  render(renderer: IRenderEngine, input: Object): Promise<void>;
}
