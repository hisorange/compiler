import { Component } from '../../../../decorators/component.decorator';
import { GrammarSymbol } from '../../../../grammars/wsn/symbols/grammar.symbol';
import { IRendererComponent } from '../../../../interfaces/renderer-component.interface';

@Component({
  reference: 'artgen.grammar.identifier',
  path: `./<%- identifier.path %>`,
})
export class IdentifierComponent implements IRendererComponent {
  data(context: { $symbol: GrammarSymbol }) {
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
