import { Generator } from '../../../../components/module-handler/decorators/generator.decorator';
import { IGenerator } from '../../../../components/module-handler/interfaces/backend.interface';
import { IRenderer } from '../../../../components/renderer';
import { SmartString } from '../../../../components/smart-string';
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
  async render(renderer: IRenderer, input: any) {
    const context = { $name: new SmartString(input.name) };

    renderer.setContext(context);
    renderer.outputBaseDirectory = input.baseDirectory ?? '.';

    renderer.render(`artgen.backend.backend`);
  }
}
