import { SmartString } from '@artgen/smart-string';
import { Backend } from '../../../decorators/backend.decorator';
import { IBackend } from '../../../interfaces/backend.interface';
import { IRenderEngine } from '../../../interfaces/components/render-engine.interface';
import { TemplateTemplate } from './template.template';

@Backend({
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
export class TemplateBackend implements IBackend {
  async render(renderer: IRenderEngine, input: any) {
    const context = { $name: new SmartString(input.name) };

    renderer.setContext(context);
    renderer.outputBaseDirectory = input.baseDirectory;

    renderer.renderComponent(`artgen.component`);
  }
}
