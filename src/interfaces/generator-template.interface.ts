import { IRenderEngine } from './components/render-engine.interface';

export interface IGenerator {
  render(renderer: IRenderEngine, input: any): Promise<void>;
}
