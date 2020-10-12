import { IRenderEngine } from './components/render-engine.interface';

export interface IBackend {
  render(renderer: IRenderEngine, input: any): Promise<void>;
}
