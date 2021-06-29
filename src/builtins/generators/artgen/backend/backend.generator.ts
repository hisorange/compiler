import {
  Generator,
  IGenerator,
  IRenderer,
  SmartString,
} from '../../../../components';
import { BackendTemplate } from './templates';

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
  async render(renderer: IRenderer, input: any) {
    const context = { $name: new SmartString(input.name) };

    renderer.setContext(context);
    renderer.outputBaseDirectory = input.baseDirectory ?? '.';

    renderer.renderTemplate(`artgen.backend.backend`);
  }
}
