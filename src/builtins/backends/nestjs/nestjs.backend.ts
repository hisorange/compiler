import { Bindings, IModuleHandler, Inject } from '../../../components';
import { ISymbol } from '../../../components/iml/interfaces/symbol.interface';
import { Backend } from '../../../components/module-handler/decorators/backend.decorator';
import { IBackend } from '../../../components/module-handler/interfaces/backend.interface';
import { IRenderer } from '../../../components/renderer';
import { SmartString } from '../../../components/smart-string';
import { GrammarSymbol } from '../../frontends/wsn/symbols/grammar.symbol';
import { ReadMeTemplate } from './templates/readme.template';

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
