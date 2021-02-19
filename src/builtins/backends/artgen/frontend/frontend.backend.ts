import { ISymbol } from '../../../../components/iml/interfaces/symbol.interface';
import { Backend } from '../../../../components/module-handler/decorators/backend.decorator';
import { IBackend } from '../../../../components/module-handler/interfaces/backend.interface';
import { IRenderer } from '../../../../components/renderer';
import { GrammarSymbol } from '../../../frontends/wsn/symbols/grammar.symbol';
import { FrontendTemplate } from './templates/frontend.template';
import { IdentifierTemplate } from './templates/identifier.template';
import { InterpretersTemplate } from './templates/interpreters.template';
import { LexersTemplate } from './templates/lexers.template';
import { TokenParserTemplate } from './templates/token-parser.template';
import { TokenizerTemplate } from './templates/tokenizer.template';

@Backend({
  name: 'Frontend Backend',
  reference: 'artgen.frontend',
  templates: [
    FrontendTemplate,
    IdentifierTemplate,
    InterpretersTemplate,
    LexersTemplate,
    TokenizerTemplate,
    TokenParserTemplate,
  ],
  interest: (symbol: ISymbol) => symbol instanceof GrammarSymbol,
})
export class FrontendBackend implements IBackend {
  async render(renderer: IRenderer, input: GrammarSymbol) {
    const context = { $symbol: input };

    renderer.setContext(context);

    renderer.render('artgen.frontend.interpreters');
    renderer.render('artgen.frontend.lexers');
    renderer.render('artgen.frontend.identifier');
    renderer.render('artgen.frontend.tokenizer');
    renderer.render('artgen.frontend.grammar');
  }
}
