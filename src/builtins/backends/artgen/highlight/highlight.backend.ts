import { Backend, IBackend, IRenderer, ISymbol } from '../../../../components';
import { GrammarSymbol } from '../../../frontends/wsn';
import { ConfigTemplate } from './templates/config.template';
import { PackageTemplate } from './templates/package.template';
import { ReadmeTemplate } from './templates/readme.template';
import { TextMateTemplate } from './templates/textmate.template';

@Backend({
  name: 'Highlight Backend',
  reference: 'artgen.highlight',
  templates: [
    ReadmeTemplate,
    PackageTemplate,
    TextMateTemplate,
    ConfigTemplate,
  ],
  interest: (symbol: ISymbol) => symbol instanceof GrammarSymbol,
})
export class HighlightBackend implements IBackend {
  async render(renderer: IRenderer, input: GrammarSymbol) {
    const context = {
      $symbol: input,
      languageId: input.name.lowerCase,
      languageRef: input.name.upperCase,
      extension: input.name.lowerCase.prefix('.'),
    };

    renderer.setContext(context);

    renderer.renderTemplate('artgen.highlight.textmate');
    renderer.renderTemplate('artgen.highlight.package');
    renderer.renderTemplate('artgen.highlight.config');
    renderer.renderTemplate('artgen.highlight.readme');
  }
}
