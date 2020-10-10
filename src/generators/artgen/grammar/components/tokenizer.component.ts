import { Component } from '../../../../decorators/component.decorator';
import { GrammarSymbol } from '../../../../grammars/wsn/symbols/grammar.symbol';
import { ProductionSymbol } from '../../../../grammars/wsn/symbols/production.symbol';
import { IRendererComponent } from '../../../../interfaces/renderer-component.interface';

@Component({
  reference: 'artgen.grammar.tokenizer',
  path: `./<%- tokenizer.path %>`,
})
export class TokenizerComponent implements IRendererComponent {
  data(ctx: { $symbol: GrammarSymbol }) {
    return {
      tokenizer: {
        path: ctx.$symbol.name.kebabCase.suffix('.tokenizer.ts'),
        expressions: ctx.$symbol
          .getChildren()
          .filter(c => c instanceof ProductionSymbol)
          .map((p: ProductionSymbol) => p.expressions),
      },
    };
  }

  render() {
    return `import { Tokenizer } from '../../components/tokenizer';
import { <%- identifier.clss %> } from './<%- identifier.path.toString().replace('.ts', '') %>';

export function createTokenizer(T: Tokenizer) {
  <% for(const expr of tokenizer.expressions) { -%>
  <%- include('artgen.grammar.token-parser', { expression: expr, identifier }); %>
  <% } -%>
}
`;
  }
}
