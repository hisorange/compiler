import { Template } from '../../../../../components/module-handler/decorators/template.decorator';
import { ITemplate } from '../../../../../components/module-handler/interfaces/template.interface';
import { GrammarSymbol } from '../../../../frontends/wsn/symbols/grammar.symbol';
import { ProductionSymbol } from '../../../../frontends/wsn/symbols/production.symbol';

@Template({
  reference: 'artgen.frontend.tokenizer',
  path: `./<%- tokenizer.path %>`,
})
export class TokenizerTemplate implements ITemplate {
  data(ctx: { $symbol: GrammarSymbol }) {
    return {
      tokenizer: {
        clss: ctx.$symbol.name.upperCase.suffix('Tokenizer'),
        path: ctx.$symbol.name.kebabCase.suffix('.tokenizer.ts'),
        expressions: ctx.$symbol
          .getChildren()
          .filter(c => c instanceof ProductionSymbol)
          .map((p: ProductionSymbol) => p.expressions),
      },
    };
  }

  render() {
    return `import { ITokenizer } from '../../../components/parser/interfaces/tokenizer.interface';
import { Tokenizer } from '../../../components/parser/tokenizer';
import { <%- identifier.clss %> } from './<%- identifier.path.toString().replace('.ts', '') %>';

export class <%- tokenizer.clss %> extends Tokenizer implements ITokenizer {
  prepare() {
    const T = this;
    <% for(const expr of tokenizer.expressions) { -%>
    <%- include('artgen.frontend.token-parser', { expression: expr, identifier }); %>
    <% } -%>
  }
}
`;
  }
}
