import { GrammarComponent } from '../../generators/artgen/grammar/components/grammar.component';
import { IdentifierComponent } from '../../generators/artgen/grammar/components/identifier.component';
import { InterpretersComponent } from '../../generators/artgen/grammar/components/interpreters.component';
import { LexersComponent } from '../../generators/artgen/grammar/components/lexers.component';
import { TokenParserComponent } from '../../generators/artgen/grammar/components/token-parser.component';
import { TokenizerComponent } from '../../generators/artgen/grammar/components/tokenizer.component';
import { Renderer } from '../../rendering/generic.compiler';
import { GrammarSymbol } from './symbols/grammar.symbol';

export class BridgeRenderer extends Renderer {
  readonly interest = [GrammarSymbol];

  render(symbol: GrammarSymbol): void {
    this.engine.registerComponent(GrammarComponent);
    this.engine.registerComponent(IdentifierComponent);
    this.engine.registerComponent(InterpretersComponent);
    this.engine.registerComponent(LexersComponent);
    this.engine.registerComponent(TokenizerComponent);
    this.engine.registerComponent(TokenParserComponent);
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
