import { Template } from '../../../../../components/module-handler/decorators/template.decorator';
import { ITemplate } from '../../../../../components/module-handler/interfaces/template.interface';
import { GrammarSymbol } from '../../../../frontends/wsn/symbols/grammar.symbol';
import { ProductionSymbol } from '../../../../frontends/wsn/symbols/production.symbol';

@Template({
  reference: 'artgen.grammar.tokenizer',
  path: `./<%- tokenizer.path %>`,
})
export class TokenizerTemplate implements ITemplate {
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
    return `import { Tokenizer } from '../../../components/components/tokenizer';
import { <%- identifier.clss %> } from './<%- identifier.path.toString().replace('.ts', '') %>';

export function createTokenizer(T: Tokenizer) {
  <% for(const expr of tokenizer.expressions) { -%>
  <%- include('artgen.grammar.token-parser', { expression: expr, identifier }); %>
  <% } -%>
}
`;
  }
}
