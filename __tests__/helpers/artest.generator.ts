import {
  Bindings,
  Generator,
  IGenerator,
  IKernel,
  Inject,
  IRenderer,
  SmartString,
} from '../../src';
import { ArTestTemplate } from './artest.template';

interface Input {
  name: string;
  baseDirectory: string;
}

@Generator<Input>({
  name: 'ArTest Generator',
  reference: 'artest.generator',
  templates: [ArTestTemplate],
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
    @Inject(Bindings.Components.Renderer)
    protected readonly renderer: IRenderer,
  ) {}

  async render(input) {
    const context = { $name: new SmartString(input.name) };

    this.renderer.mergeContext(context);
    this.renderer.outputBaseDirectory = input.baseDirectory || '.';
    this.renderer.renderTemplate(`artest.template`);
  }
}
