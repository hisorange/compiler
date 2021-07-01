import { ITemplate, Template } from '../../../../../components/';
import { GrammarSymbol } from '../../../../frontends/wsn';

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
import { <%- lexers.cnst %> } from './<%- lexers.path.stripExtension() %>';
import { <%- tokenizer.clss %> } from './<%- tokenizer.path.stripExtension() %>';

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
