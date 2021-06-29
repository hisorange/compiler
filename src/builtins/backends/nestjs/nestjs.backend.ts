import {
  Backend,
  IBackend,
  IRenderer,
  ISymbol,
  SmartString,
} from '../../../components';
import { ServiceSymbol, SyntaxSymbol } from '../../frontends/aml';
import { ReadMeTemplate } from './templates';

@Backend({
  name: 'NestJS Application',
  reference: 'nestjs',
  templates: [ReadMeTemplate],
  interest: (symbol: ISymbol) => symbol instanceof SyntaxSymbol,
})
export class NestJSBackend implements IBackend {
  async render(renderer: IRenderer, symbol: SyntaxSymbol) {
    const context = { $name: new SmartString(symbol.toString()) };

    renderer.setContext(context);
    renderer.outputBaseDirectory = '/';

    renderer.renderTemplate(`nestjs.readme`);

    // Create child context, and render each service as a module.
    const services = symbol.findChildren(c => c instanceof ServiceSymbol);

    for (const service of services) {
      await renderer.renderGenerator('nestjs.crud', {
        moduleName: service.name.toString(),
        baseDirectory: '/modules/',
      });
    }
  }
}
