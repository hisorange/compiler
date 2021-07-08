import {
  Backend,
  IBackend,
  IRenderer,
  ISymbol,
  SmartString,
} from '../../../components';
import { ReadMeTemplate } from './templates';

@Backend({
  name: 'NestJS Application',
  reference: 'nestjs',
  templates: [ReadMeTemplate],
  interest: (symbol: ISymbol) => symbol.name.toString() == '$SYNTAX',
})
export class NestJSBackend implements IBackend {
  async render(renderer: IRenderer, symbol: any) {
    const context = { $name: new SmartString(symbol.toString()) };

    renderer.setContext(context);
    renderer.outputBaseDirectory = '/';

    renderer.renderTemplate(`nestjs.readme`);
  }
}
