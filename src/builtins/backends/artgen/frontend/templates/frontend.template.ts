import { Template } from '../../../../../components/module-handler/decorators/template.decorator';
import { ITemplate } from '../../../../../components/module-handler/interfaces/template.interface';
import { GrammarSymbol } from '../../../../frontends/wsn/symbols/grammar.symbol';

@Template({
  reference: 'artgen.frontend.grammar',
  path: `./<%- frontend.path %>`,
})
export class FrontendTemplate implements ITemplate {
  data(input: { $symbol: GrammarSymbol }) {
    return {
      frontend: {
        $name: input.$symbol.name,
        clss: input.$symbol.name.upperCase.suffix('Frontend'),
        path: input.$symbol.name.kebabCase.suffix('.frontend.ts'),
        reference: input.$symbol.name.lowerCase,
        extension: input.$symbol.name.lowerCase,
      },
    };
  }

  render() {
    return `import { Frontend, IFrontend } from '../../../components';
import { createParsers } from './<%- frontend.$name.kebabCase %>.parsers';
import { <%- 'LEXER' %>Lexers } from './<%- frontend.$name.kebabCase  %>.lexers';
import { <%- 'INTP'  %>Interpreters } from './<%- frontend.$name.kebabCase %>.interpreters';

@Frontend({
  name: '<%- frontend.$name.titleCase %>',
  reference: 'artgen.<%- frontend.reference %>',
  extensions: ['<%- frontend.extension %>'],
  tokenizer: <%- tokenizer.clss %>,
  lexers: [],
  interpreters: [],
})
export class <%- frontend.clss %> implements IFrontend {
  onInit() {}
}
`;
  }
}
