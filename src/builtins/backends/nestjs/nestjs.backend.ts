import {
  Backend,
  Bindings,
  IBackend,
  IModuleHandler,
  Inject,
  IRenderer,
  ISymbol,
  SmartString,
} from '../../../components';
import { GrammarSymbol } from '../../frontends/wsn';
import { ReadMeTemplate } from './templates';

@Backend({
  name: 'NestJS Application',
  reference: 'nestjs',
  templates: [ReadMeTemplate],
  interest: (symbol: ISymbol) => symbol instanceof GrammarSymbol,
})
export class NestJSBackend implements IBackend {
  constructor(
    @Inject(Bindings.Module.Handler)
    private readonly module: IModuleHandler,
  ) {}

  async render(renderer: IRenderer, input: any) {
    const context = { $name: new SmartString(input.name) };

    renderer.setContext(context);
    renderer.outputBaseDirectory = input.baseDirectory;

    renderer.render(`nestjs.readme`);
  }
}
