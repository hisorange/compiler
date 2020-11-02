import { Template } from '../../../../../components/module-handler/decorators/template.decorator';
import { ITemplate } from '../../../../../components/module-handler/interfaces/template.interface';
import { GrammarSymbol } from '../../../../frontends/wsn/symbols/grammar.symbol';

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
    return `import { IInterpreter } from '../../../components/interfaces/pipes/interpreter.interface';

// Interpreters
export const <%- interpreters.cnst %>: IInterpreter[] = [

];
`;
  }
}
