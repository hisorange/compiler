import { ITemplate, Template } from '../../../../../components/';
import { GrammarSymbol } from '../../../../frontends/wsn';

@Template({
  reference: 'artgen.highlight.package',
  path: `./<%- package.path %>`,
})
export class PackageTemplate implements ITemplate {
  data(input: { $symbol: GrammarSymbol }) {
    return {
      package: {
        path: 'package.json',
      },
    };
  }

  render() {
    return `{
      "name": "@artgen/vscode-syntax-<%- languageId %>",
      "displayName": "<%- languageRef %>",
      "description": "<%- languageRef %> language support",
      "version": "0.0.1",
      "engines": {
          "vscode": "^1.57.0"
      },
      "categories": [
          "Programming Languages"
      ],
      "contributes": {
          "languages": [{
              "id": "<%- languageId %>",
              "aliases": ["<%- languageRef %>"],
              "extensions": ["<%- extension %>"],
              "configuration": "./language-configuration.json"
          }],
          "grammars": [{
              "language": "<%- languageId %>",
              "scopeName": "source.<%- languageId %>",
              "path": "./<%- textmate.path %>"
          }]
      }
  }`;
  }
}
