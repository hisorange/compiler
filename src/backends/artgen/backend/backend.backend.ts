import { SmartString } from '@artgen/smart-string';
import { Backend } from '../../../decorators/backend.decorator';
import { IBackend } from '../../../interfaces/backend.interface';
import { IRenderEngine } from '../../../interfaces/components/render-engine.interface';
import { BackendTemplate } from './templates/backend.template';

@Backend({
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
export class BackendBackend implements IBackend {
  async render(renderer: IRenderEngine, input: any) {
    const context = { $name: new SmartString(input.name) };

    renderer.setContext(context);
    renderer.outputBaseDirectory = input.baseDirectory;

    renderer.renderComponent(`artgen.backend.backend`);
  }
}
