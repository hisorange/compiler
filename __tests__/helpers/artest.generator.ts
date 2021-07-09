import {
  Bindings,
  Generator,
  IGenerator,
  IKernel,
  Inject,
  IRenderer,
  ISmartString,
  RenderContext,
} from '../../src';
import { ArTestTemplate } from './artest.template';

export interface TestInput {
  name: ISmartString;
  baseDirectory: ISmartString;
}

@Generator<TestInput>({
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

  async render() {
    const ctx = this.renderer.context as RenderContext<TestInput>;

    this.renderer.outputBaseDirectory = ctx.props().baseDirectory
      ? ctx.props().baseDirectory.toString()
      : '/';

    this.renderer.renderTemplate(`artest.template`);
  }
}
