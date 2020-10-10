import { GrammarTemplate } from '../../generators/artgen/grammar/templates/grammar.template';
import { IdentifierTemplate } from '../../generators/artgen/grammar/templates/identifier.template';
import { InterpretersTemplate } from '../../generators/artgen/grammar/templates/interpreters.template';
import { LexersTemplate } from '../../generators/artgen/grammar/templates/lexers.template';
import { TokenParserTemplate } from '../../generators/artgen/grammar/templates/token-parser.template';
import { TokenizerTemplate } from '../../generators/artgen/grammar/templates/tokenizer.template';
import { Renderer } from '../../rendering/generic.compiler';
import { GrammarSymbol } from './symbols/grammar.symbol';

export class BridgeRenderer extends Renderer {
  readonly interest = [GrammarSymbol];

  render(symbol: GrammarSymbol): void {
    this.engine.registerComponent(GrammarTemplate);
    this.engine.registerComponent(IdentifierTemplate);
    this.engine.registerComponent(InterpretersTemplate);
    this.engine.registerComponent(LexersTemplate);
    this.engine.registerComponent(TokenizerTemplate);
    this.engine.registerComponent(TokenParserTemplate);
    this.engine.setContext({
      $symbol: symbol,
    });

    this.engine.renderComponent('artgen.grammar.interpreters');
    this.engine.renderComponent('artgen.grammar.lexers');
    this.engine.renderComponent('artgen.grammar.identifier');
    this.engine.renderComponent('artgen.grammar.tokenizer');
    this.engine.renderComponent('artgen.grammar.grammar');
  }
}
