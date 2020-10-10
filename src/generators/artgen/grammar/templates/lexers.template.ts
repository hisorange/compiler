import { Template } from '../../../../decorators/template.decorator';
import { GrammarSymbol } from '../../../../grammars/wsn/symbols/grammar.symbol';
import { ITemplate } from '../../../../interfaces/template.interface';

@Template({
  reference: 'artgen.grammar.lexers',
  path: `./<%- lexers.path %>`,
})
export class LexersTemplate implements ITemplate {
  data(input: { $symbol: GrammarSymbol }) {
    return {
      lexers: {
        path: input.$symbol.name.kebabCase.suffix('.lexers.ts'),
        cnst: input.$symbol.name.upperCase.suffix('Lexers'),
      },
    };
  }

  render() {
    return `import { ILexer } from '../../interfaces/pipes/lexer.interface';

// Lexers
export const <%- lexers.cnst %>: ILexer[] = [

];
`;
  }
}
