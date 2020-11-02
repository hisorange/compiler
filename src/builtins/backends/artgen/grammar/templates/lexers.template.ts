import { Template } from '../../../../../components/module-handler/decorators/template.decorator';
import { ITemplate } from '../../../../../components/module-handler/interfaces/template.interface';
import { GrammarSymbol } from '../../../../frontends/wsn/symbols/grammar.symbol';

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
    return `import { ILexer } from '../../../components/interfaces/pipes/lexer.interface';

// Lexers
export const <%- lexers.cnst %>: ILexer[] = [

];
`;
  }
}
