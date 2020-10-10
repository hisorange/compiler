import { Component } from '../../../../decorators/component.decorator';
import { GrammarSymbol } from '../../../../grammars/wsn/symbols/grammar.symbol';
import { IRendererComponent } from '../../../../interfaces/renderer-component.interface';

// Fragmental
@Component({
  reference: 'artgen.grammar.token-parser',
  path: `/dev/null`,
})
export class TokenParserComponent implements IRendererComponent {
  data(input: { $symbol: GrammarSymbol }) {
    return {
      tokenParser: {
        test: 'ABC',
      },
    };
  }

  render() {
    return `
<% if(expression.type === 'IDENTIFIER') { %>
  <% if(expression.getChildren().length) { %>
      T.identifier(<%- identifier.clss %>.<%- expression.value %>,
        <%_ for(const child of expression.getChildren()) { -%><%- include('artgen.grammar.token-parser', { expression: child }); %><% } -%>
      );
    <% } else { %>
      T.resolve(<%- identifier.clss %>.<%- expression.value %>)
    <% } %>
<% } else if (expression.type === 'ALIAS') { %>
  T.alias(\`<%- expression.value %>\`)
<% } else if (expression.type === 'LITERAL') { %>
  T.literal(\`<%- expression.value %>\`)
<% } else if (expression.type === 'OR_GROUP') { %>
  T.or([
    <% for(const child of expression.getChildren()) { -%><%- include('artgen.grammar.token-parser', { expression: child }); %>,<% } %>
  ])
<% } else if (expression.type === 'REPETITION') { %>
  T.repetition([
    <% for(const child of expression.getChildren()) { -%><%- include('artgen.grammar.token-parser', { expression: child }); %>,<% } %>
  ])
<% } else if (expression.type === 'OPTIONAL') { %>
  T.optional([
    <% for(const child of expression.getChildren()) { -%><%- include('artgen.grammar.token-parser', { expression: child }); %>,<% } %>
  ])
<% } else if (expression.type === 'CONCAT') { %>
  T.concat([
    <% for(const child of expression.getChildren()) { -%><%- include('artgen.grammar.token-parser', { expression: child }); %>,<% } %>
  ])
<% } %>
      `.trim();
  }
}
