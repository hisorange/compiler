import { IRenderer } from '@artgen/renderer';
import { ISymbol } from './dtos/symbol.interface';

export interface IBackend {
  render(renderer: IRenderer, symbol: ISymbol): Promise<void>;
}

export interface IGenerator {
  render(renderer: IRenderer, input: Object): Promise<void>;
}
