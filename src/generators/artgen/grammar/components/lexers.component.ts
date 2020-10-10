import { Component } from '../../../../decorators/component.decorator';
import { GrammarSymbol } from '../../../../grammars/wsn/symbols/grammar.symbol';
import { IRendererComponent } from '../../../../interfaces/renderer-component.interface';

@Component({
  reference: 'artgen.grammar.lexers',
  path: `./<%- lexers.path %>`,
})
export class LexersComponent implements IRendererComponent {
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
