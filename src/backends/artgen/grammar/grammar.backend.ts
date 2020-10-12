import { Backend } from '../../../decorators/backend.decorator';
import { GrammarSymbol } from '../../../grammars/wsn/symbols/grammar.symbol';
import { IBackend } from '../../../interfaces/backend.interface';
import { IRenderEngine } from '../../../interfaces/components/render-engine.interface';
import { GrammarTemplate } from './templates/grammar.template';
import { IdentifierTemplate } from './templates/identifier.template';
import { InterpretersTemplate } from './templates/interpreters.template';
import { LexersTemplate } from './templates/lexers.template';
import { TokenizerTemplate } from './templates/tokenizer.template';

@Backend({
  name: 'Grammar Generator',
  reference: 'artgen.grammar',
  templates: [
    GrammarTemplate,
    IdentifierTemplate,
    InterpretersTemplate,
    LexersTemplate,
    TokenizerTemplate,
  ],
})
export class GrammarBackend implements IBackend {
  async render(renderer: IRenderEngine, input: GrammarSymbol) {
    const context = { grammar: input };

    renderer.setContext(context);
    renderer.renderComponent(`artgen.grammar.identifier`);
  }
}
