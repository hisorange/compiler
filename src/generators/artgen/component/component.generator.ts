import { StringCase } from '@artgen/string-case';
import { Backend } from '../../../decorators/backend.decorator';
import { IRenderEngine } from '../../../interfaces/components/render-engine.interface';
import { IGenerator } from '../../../interfaces/generator-template.interface';
import { ComponentComponent } from './component.component';

@Backend({
  name: 'Component Generator',
  reference: 'artgen.component',
  components: [ComponentComponent],
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
export class ArtgenComponentBackend implements IGenerator {
  async render(renderer: IRenderEngine, input: any) {
    const context = { $name: new StringCase(input.name) };

    renderer.setContext(context);
    renderer.outputBaseDirectory = input.baseDirectory;

    renderer.renderComponent(`artgen.component`);
  }
}
