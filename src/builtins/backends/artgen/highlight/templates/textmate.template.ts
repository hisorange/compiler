import { ITemplate, Template } from '../../../../../components/';
import { GrammarSymbol, ProductionSymbol } from '../../../../frontends/wsn';

@Template({
  reference: 'artgen.highlight.textmate',
  path: `./<%- textmate.path %>`,
})
export class TextMateTemplate implements ITemplate {
  context(ctx: { $symbol: GrammarSymbol }) {
    return {
      textmate: {
        path: ctx.$symbol.name.lowerCase.suffix('.tmLanguage.json'),
        expressions: ctx.$symbol
          .findChildren(c => c instanceof ProductionSymbol)
          .map((p: ProductionSymbol) => p.expressions),
      },
    };
  }

  render() {
    return `{
  "$schema": "https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json",
  "name": "Syntax Notation",
  "patterns": [
    <%_ for(const [i, e] of textmate.expressions.entries()) { -%>
      {
        "include": "#<%- e.value.toLowerCase() %>"
      }<%- i + 1 == textmate.expressions.length ? '' : ',' %>
    <%_ } -%>
  ],
  "repository": {
    <%_ for(const [i, e] of textmate.expressions.entries()) { -%>
      "<%- e.value.toLowerCase() %>": {
        "patterns": [{
          "name": "<%- e.value.toLowerCase() %>.wsn",
          "match": "\\b(<%- e.value %>)\\b"
        }]
      }<%- i + 1 == textmate.expressions.length ? '' : ',' %>
    <%_ } -%>
  },
  "scopeName": "source.<%- languageId %>"
}`;
  }
}
