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

    renderer.mergeContext(context);

    renderer.renderTemplate('artgen.frontend.interpreters');
    renderer.renderTemplate('artgen.frontend.lexers');
    renderer.renderTemplate('artgen.frontend.identifier');
    renderer.renderTemplate('artgen.frontend.tokenizer');
    renderer.renderTemplate('artgen.frontend.grammar');
  }
}
