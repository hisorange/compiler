import { Component } from '../../../../decorators/component.decorator';
import { GrammarSymbol } from '../../../../grammars/wsn/symbols/grammar.symbol';
import { IRendererComponent } from '../../../../interfaces/renderer-component.interface';

@Component({
  reference: 'artgen.grammar.grammar',
  path: `./<%- grammar.path %>`,
})
export class GrammarComponent implements IRendererComponent {
  data(input: { $symbol: GrammarSymbol }) {
    return {
      grammar: {
        $name: input.$symbol.name,
        clss: input.$symbol.name.upperCase.suffix('Grammar'),
        path: input.$symbol.name.kebabCase.suffix('.grammar.ts'),
      },
    };
  }

  render() {
    return `import { Language } from '../../constants/language';
import { IPluginConfig } from '../../interfaces/plugin/plugin-config.interface';
import { IPluginInvoker } from '../../interfaces/plugin/plugin-invoker.interface';
import { IPlugin } from '../../interfaces/plugin/plugin.interface';
import { createParsers } from './<%- grammar.$name.kebabCase %>.parsers';
import { <%- 'LEXER' %>Lexers } from './<%- grammar.$name.kebabCase  %>.lexers';
import { <%- 'INTP'  %>Interpreters } from './<%- grammar.$name.kebabCase %>.interpreters';

@Grammar({
  name: '<%- grammar.$name.upperCase %>',
  extensions: ['<%- grammar.$name.lowerCase %>'],
  parsers: [],
  lexers: [],
  interpreters: [],
})
export class <%- grammar.clss %> implements IGrammar {
}
    `;
  }
}
