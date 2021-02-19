import { ISymbol } from '../../../../components/iml/interfaces/symbol.interface';
import { Backend } from '../../../../components/module-handler/decorators/backend.decorator';
import { IBackend } from '../../../../components/module-handler/interfaces/backend.interface';
import { IRenderer } from '../../../../components/renderer';
import { GrammarSymbol } from '../../../frontends/wsn/symbols/grammar.symbol';
import { GrammarTemplate } from './templates/grammar.template';
import { IdentifierTemplate } from './templates/identifier.template';
import { InterpretersTemplate } from './templates/interpreters.template';
import { LexersTemplate } from './templates/lexers.template';
import { TokenParserTemplate } from './templates/token-parser.template';
import { TokenizerTemplate } from './templates/tokenizer.template';

@Backend({
  name: 'Grammar Backend',
  reference: 'artgen.grammar',
  templates: [
    GrammarTemplate,
    IdentifierTemplate,
    InterpretersTemplate,
    LexersTemplate,
    TokenizerTemplate,
    TokenParserTemplate,
  ],
  interest: (symbol: ISymbol) => symbol instanceof GrammarSymbol,
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
