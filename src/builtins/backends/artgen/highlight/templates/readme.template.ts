import { ITemplate, Template } from '../../../../../components/';
import { GrammarSymbol } from '../../../../frontends/wsn';

@Template({
  reference: 'artgen.highlight.readme',
  path: `./readme.md`,
})
export class ReadmeTemplate implements ITemplate {
  data(input: { $symbol: GrammarSymbol }) {
    return {};
  }

  render() {
    return `# Syntax Highlight for <%- languageRef %>
---

This is an automatic build from the language's WSN descriptor.
`;
  }
}
