import { Backend } from '../../../decorators/backend.decorator';
import { GrammarSymbol } from '../../../grammars/wsn/symbols/grammar.symbol';
import { IRenderEngine } from '../../../interfaces/components/render-engine.interface';
import { IGenerator } from '../../../interfaces/generator-template.interface';
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
export class GrammarGenerator implements IGenerator {
  async render(renderer: IRenderEngine, input: GrammarSymbol) {
    const context = { grammar: input };

    renderer.setContext(context);
    renderer.renderComponent(`artgen.grammar.identifier`);
  }
}
