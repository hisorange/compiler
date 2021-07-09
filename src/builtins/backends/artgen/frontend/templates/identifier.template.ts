import { Template } from '../../../../../components/module-handler/decorators/template.decorator';
import { ITemplate } from '../../../../../components/module-handler/interfaces/template.interface';
import { GrammarSymbol } from '../../../../frontends/wsn/symbols/grammar.symbol';

@Template({
  reference: 'artgen.frontend.identifier',
  path: `./<%- identifier.path %>`,
})
export class IdentifierTemplate implements ITemplate {
  context(context: { $symbol: GrammarSymbol }) {
    return {
      identifier: {
        clss: context.$symbol.name.upperCase.suffix('Identifier'),
        path: context.$symbol.name.kebabCase.suffix('.identifier.ts'),
        products: context.$symbol.getProducts(),
      },
    };
  }

  render() {
    return `export enum <%- identifier.clss %> {
<% for(const product of identifier.products) { _%>
  <%- product %> = \`<%- product %>\`,
<% } %>
}
`;
  }
}
