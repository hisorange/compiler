import { Template } from '../../../../../components/module-handler/decorators/template.decorator';
import { ITemplate } from '../../../../../components/module-handler/interfaces/template.interface';
import { GrammarSymbol } from '../../../../frontends/wsn/symbols/grammar.symbol';

// Snippet
@Template({
  reference: 'artgen.frontend.token-parser',
  path: `/dev/null`,
})
export class TokenParserTemplate implements ITemplate {
  data(input: { $symbol: GrammarSymbol }) {
    return {
      tokenParser: {
        test: 'ABC',
      },
    };
  }

  render() {
    return `
<%_if(expression.type === 'IDENTIFIER') { _%>
  <%_if(expression.getChildren().length) { _%>
T.identifier(<%- identifier.clss_%>.<%- expression.value -%>,
<%_ for(const child of expression.getChildren()) { -%><%- include('artgen.frontend.token-parser', { expression: child });_%><%_} _%>
);
    <%_} else { _%>
      T.resolve(<%- identifier.clss_%>.<%- expression.value_%>)
    <%_} _%>
<%_} else if (expression.type === 'ALIAS') {_%>
  T.alias(<%- identifier.clss_%>.<%- expression.value_%>)
<%_} else if (expression.type === 'LITERAL') {_%>
  T.literal(\`<%- expression.value_%>\`)
<%_} else if (expression.type === 'OR_GROUP') {_%>
  T.or([
    <%_for(const child of expression.getChildren()) { -%><%- include('artgen.frontend.token-parser', { expression: child });_%>,<%_}_%>
  ])
<%_} else if (expression.type === 'REPETITION') {_%>
  T.repetition(
    <%_for(const child of expression.getChildren()) { -%><%- include('artgen.frontend.token-parser', { expression: child });_%>,<%_}_%>
  )
<%_} else if (expression.type === 'OPTIONAL') {_%>
  T.optional(
    <%_for(const child of expression.getChildren()) { -%><%- include('artgen.frontend.token-parser', { expression: child });_%>,<%_}_%>
  )
<%_} else if (expression.type === 'CONCAT') {_%>
  T.concat([
    <%_for(const child of expression.getChildren()) { -%><%- include('artgen.frontend.token-parser', { expression: child });_%>,<%_}_%>
  ])
<%_}_%>
      `.trim();
  }
}
