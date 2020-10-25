import { IRenderEngine } from '@artgen/renderer';
import { Backend } from '../../../decorators/backend.decorator';
import { GrammarSymbol } from '../../../frontends/wsn/symbols/grammar.symbol';
import { IBackend } from '../../../interfaces/backend.interface';
import { GrammarTemplate } from './templates/grammar.template';
import { IdentifierTemplate } from './templates/identifier.template';
import { InterpretersTemplate } from './templates/interpreters.template';
import { LexersTemplate } from './templates/lexers.template';
import { TokenizerTemplate } from './templates/tokenizer.template';

@Backend({
  name: 'Grammar Backend',
  reference: 'artgen.grammar',
  templates: [GrammarTemplate, IdentifierTemplate, InterpretersTemplate, LexersTemplate, TokenizerTemplate],
})
export class GrammarBackend implements IBackend {
  async render(renderer: IRenderEngine, input: GrammarSymbol) {
    const context = { $symbol: input };

    renderer.setContext(context);

    renderer.renderTemplate('artgen.grammar.interpreters');
    renderer.renderTemplate('artgen.grammar.lexers');
    renderer.renderTemplate('artgen.grammar.identifier');
    renderer.renderTemplate('artgen.grammar.tokenizer');
    renderer.renderTemplate('artgen.grammar.grammar');
  }
}
