import { GrammarTemplate } from '../../backends/artgen/grammar/templates/grammar.template';
import { IdentifierTemplate } from '../../backends/artgen/grammar/templates/identifier.template';
import { InterpretersTemplate } from '../../backends/artgen/grammar/templates/interpreters.template';
import { LexersTemplate } from '../../backends/artgen/grammar/templates/lexers.template';
import { TokenParserTemplate } from '../../backends/artgen/grammar/templates/token-parser.template';
import { TokenizerTemplate } from '../../backends/artgen/grammar/templates/tokenizer.template';
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
