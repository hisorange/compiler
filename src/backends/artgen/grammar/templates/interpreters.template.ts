import { Template } from '../../../../decorators/template.decorator';
import { GrammarSymbol } from '../../../../frontends/wsn/symbols/grammar.symbol';
import { ITemplate } from '../../../../interfaces/template.interface';

@Template({
  reference: 'artgen.grammar.interpreters',
  path: `./<%- interpreters.path %>`,
})
export class InterpretersTemplate implements ITemplate {
  data(input: { $symbol: GrammarSymbol }) {
    return {
      interpreters: {
        path: input.$symbol.name.kebabCase.suffix('.interpreters.ts'),
        cnst: input.$symbol.name.upperCase.suffix('Interpreters'),
      },
    };
  }

  render() {
    return `import { IInterpreter } from '../../interfaces/pipes/interpreter.interface';

// Interpreters
export const <%- interpreters.cnst %>: IInterpreter[] = [

];
`;
  }
}
