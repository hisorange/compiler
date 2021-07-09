import { RenderContext } from '../../renderer';

export interface ITemplate<P extends Object = {}> {
  context?(ctx: P): RenderContext | Object;
  render(): string;
}
