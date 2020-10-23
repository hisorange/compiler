import { ISmartString } from '@artgen/smart-string';
import { Template } from '../../../../decorators/template.decorator';
import { ITemplate } from '../../../../interfaces/template.interface';

@Template({
  reference: 'artgen.backend.backend',
  path: `./<%- backend.path %>`,
})
export class BackendTemplate implements ITemplate {
  data(input: { $name: ISmartString }) {
    return {
      backend: {
        path: input.$name.kebabCase.suffix('.backend.ts'),
        clss: input.$name.pascalCase.suffix('Backend'),
        ns: input.$name.dotCase,
        name: input.$name.titleCase,
      },
    };
  }

  render() {
    return `import { SmartString } from '@artgen/smart-string';
import { Backend, IBackend, IRenderEngine } from '@artgen/kernel';

@Backend({
  name: '<%- backend.name %>',
  reference: '<%- backend.ns %>',
  templates: [
    //
  ],
  input: [
    {
      message: \`What is backend's name?\`,
      type: 'text',
      name: 'name',
    },
    {
      message: \`Base directory, relative to $PWD?\`,
      type: 'text',
      name: 'baseDirectory',
      default: '.',
    },
  ],
})
export class <%- backend.clss %> implements IBackend {
  async render(renderer: IRenderEngine, input: any) {
    const context = { $name: new SmartString(input.name) };

    renderer.setContext(context);
    renderer.outputBaseDirectory = input.baseDirectory;

    renderer.renderTemplate(\`<%- backend.ns %>.example\`);
  }
}
`;
  }
}
