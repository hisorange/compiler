import { SmartString } from '@artgen/smart-string';
import { Generator } from '../../../decorators/generator.decorator';
import { IGenerator } from '../../../interfaces/backend.interface';
import { IRenderEngine } from '../../../interfaces/components/render-engine.interface';
import { TemplateTemplate } from './templates/template.template';

@Generator({
  name: 'Component Backend',
  reference: 'artgen.template',
  templates: [TemplateTemplate],
  input: [
    {
      message: `What is component's name?`,
      type: 'text',
      name: 'name',
    },
    {
      message: `Base directory, relative to $PWD?`,
      type: 'text',
      name: 'baseDirectory',
      default: '.',
    },
  ],
  author: {
    name: `Zsolo`,
  },
})
export class TemplateGenerator implements IGenerator {
  async render(renderer: IRenderEngine, input: any) {
    const context = { $name: new SmartString(input.name) };

    renderer.setContext(context);
    renderer.outputBaseDirectory = input.baseDirectory;

    renderer.renderTemplate(`artgen.template`);
  }
}
