import { ITemplate, Template } from '../../../../../components/';
import { GrammarSymbol } from '../../../../frontends/wsn';

@Template({
  reference: 'artgen.highlight.config',
  path: `./<%- config.path %>`,
})
export class ConfigTemplate implements ITemplate {
  data(input: { $symbol: GrammarSymbol }) {
    return {
      config: {
        path: 'language-configuration.json',
      },
    };
  }

  render() {
    return `{
    "comments": {
        "lineComment": "#",
        "blockComment": [ "/*", "*/" ]
    },
    "brackets": [
        ["{", "}"],
        ["[", "]"],
        ["(", ")"]
    ],
    "autoClosingPairs": [
        ["{", "}"],
        ["[", "]"],
        ["(", ")"],
        ["\\"", "\\""],
        ["'", "'"]
    ],
    "surroundingPairs": [
        ["{", "}"],
        ["[", "]"],
        ["(", ")"],
        ["\\"", "\\""],
        ["'", "'"]
    ]
}`;
  }
}
