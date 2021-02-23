import { Backend, IBackend, IRenderer, ISymbol } from '../../../../components';
import { GrammarSymbol } from '../../../frontends/wsn';
import {
  FrontendTemplate,
  IdentifierTemplate,
  InterpretersTemplate,
  LexersTemplate,
  TokenizerTemplate,
  TokenParserTemplate,
} from './templates';

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
