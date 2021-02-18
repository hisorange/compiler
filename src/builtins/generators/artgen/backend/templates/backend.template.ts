import { Template } from '../../../../../components/module-handler/decorators/template.decorator';
import { ITemplate } from '../../../../../components/module-handler/interfaces/template.interface';
import { ISmartString } from '../../../../../components/smart-string';

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
    return `import { SmartString } from '@app';
import { Backend, IBackend, IRenderer } from '@hisorange/artgen';

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
  async render(renderer: IRenderer, input: any) {
    const context = { $name: new SmartString(input.name) };

    renderer.setContext(context);
    renderer.outputBaseDirectory = input.baseDirectory;

    renderer.render(\`<%- backend.ns %>.example\`);
  }
}
`;
  }
}
