import {
  Bindings,
  Generator,
  IGenerator,
  Inject,
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
  constructor(
    @Inject(Bindings.Components.Renderer)
    protected readonly renderer: IRenderer,
  ) {}

  async render(input: any) {
    const context = { $name: new SmartString(input.name) };

    this.renderer.mergeContext(context);
    this.renderer.outputBaseDirectory = input.baseDirectory ?? '.';
    this.renderer.renderTemplate(`artgen.backend.backend`);
  }
}
