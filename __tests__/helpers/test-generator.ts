import {
  Generator,
  IGenerator,
  IKernel,
  IRenderer,
  SmartString,
} from '../../src';
import { Bindings } from '../../src/components/container/bindings';
import { Inject } from '../../src/components/container/decorators';
import { TestTemplate } from './test-template';

@Generator({
  name: 'ArTest Generator',
  reference: 'artest.generator',
  templates: [TestTemplate],
  input: [
    {
      message: `What is the param name?`,
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
    name: `ArTest`,
  },
})
export class ArTestGenerator implements IGenerator {
  constructor(
    @Inject(Bindings.Kernel)
    public kernel: IKernel,
  ) {}

  async render(renderer: IRenderer, input: any) {
    const context = { $name: new SmartString(input.name) };

    renderer.setContext(context);
    renderer.outputBaseDirectory = input.baseDirectory || '.';

    renderer.renderTemplate(`artest.template`);
  }
}
