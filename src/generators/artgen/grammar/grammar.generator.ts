import { Backend } from '../../../decorators/backend.decorator';
import { GrammarSymbol } from '../../../grammars/wsn/symbols/grammar.symbol';
import { IRenderEngine } from '../../../interfaces/components/render-engine.interface';
import { IGenerator } from '../../../interfaces/generator-template.interface';
import { GrammarComponent } from './components/grammar.component';
import { IdentifierComponent } from './components/identifier.component';
import { InterpretersComponent } from './components/interpreters.component';
import { LexersComponent } from './components/lexers.component';
import { TokenizerComponent } from './components/tokenizer.component';

@Backend({
  name: 'Grammar Generator',
  reference: 'artgen.grammar',
  components: [
    GrammarComponent,
    IdentifierComponent,
    InterpretersComponent,
    LexersComponent,
    TokenizerComponent,
  ],
})
export class GrammarGenerator implements IGenerator {
  async render(renderer: IRenderEngine, input: GrammarSymbol) {
    const context = { grammar: input };

    renderer.setContext(context);
    renderer.renderComponent(`artgen.grammar.identifier`);
  }
}
