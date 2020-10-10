import { Component } from '../../../../decorators/component.decorator';
import { GrammarSymbol } from '../../../../grammars/wsn/symbols/grammar.symbol';
import { IRendererComponent } from '../../../../interfaces/renderer-component.interface';

@Component({
  reference: 'artgen.grammar.interpreters',
  path: `./<%- interpreters.path %>`,
})
export class InterpretersComponent implements IRendererComponent {
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
