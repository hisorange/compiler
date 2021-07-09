import {
  Bindings,
  Generator,
  IGenerator,
  Inject,
  IRenderer,
  SmartString,
} from '../../../../components';
import { TemplateTemplate } from './templates';

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
  constructor(
    @Inject(Bindings.Components.Renderer)
    protected readonly renderer: IRenderer,
  ) {}

  async render(input: any) {
    const context = { $name: new SmartString(input.name) };

    this.renderer.setContext(context);
    this.renderer.outputBaseDirectory = input.baseDirectory || '.';
    this.renderer.renderTemplate(`artgen.template`);
  }
}
