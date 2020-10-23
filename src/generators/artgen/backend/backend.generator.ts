import { SmartString } from '@artgen/smart-string';
import { Generator } from '../../../decorators/generator.decorator';
import { IGenerator } from '../../../interfaces/backend.interface';
import { IRenderEngine } from '../../../interfaces/components/render-engine.interface';
import { BackendTemplate } from './templates/backend.template';

@Generator({
  name: 'Backend Generator',
  reference: 'artgen.backend',
  templates: [BackendTemplate],
  input: [
    {
      message: `What is backend's name?`,
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
export class BackendGenerator implements IGenerator {
  async render(renderer: IRenderEngine, input: any) {
    const context = { $name: new SmartString(input.name) };

    renderer.setContext(context);
    renderer.outputBaseDirectory = input.baseDirectory;

    renderer.renderTemplate(`artgen.backend.backend`);
  }
}
