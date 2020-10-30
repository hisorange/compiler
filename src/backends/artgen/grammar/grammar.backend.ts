import { IRenderer } from '@artgen/renderer';
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
  async render(renderer: IRenderer, input: GrammarSymbol) {
    const context = { $symbol: input };

    renderer.setContext(context);

    renderer.render('artgen.grammar.interpreters');
    renderer.render('artgen.grammar.lexers');
    renderer.render('artgen.grammar.identifier');
    renderer.render('artgen.grammar.tokenizer');
    renderer.render('artgen.grammar.grammar');
  }
}
