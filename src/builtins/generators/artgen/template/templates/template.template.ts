import { ISmartString } from '@artgen/smart-string';
import { Template } from '../../../../../components/module-handler/decorators/template.decorator';
import { ITemplate } from '../../../../../components/module-handler/interfaces/template.interface';

@Template({
  reference: 'artgen.template',
  engine: {
    delimiter: '?',
  },
  path: `templates/<?- template.path ?>`,
})
export class TemplateTemplate implements ITemplate {
  data(input: { $name: ISmartString }) {
    return {
      template: {
        name: input.$name.pascalCase.suffix('Template'),
        namespace: input.$name.kebabCase,
        path: input.$name.kebabCase.suffix('.template.ts'),
      },
    };
  }

  render() {
    return `import { ISmartString } from '@artgen/smart-string';
import { Template, ITemplate } from '@artgen/kernel';

@Template({
  reference: 'artgen.<?- template.namespace ?>',
  path: \`templates/<%- <?- template.namespace ?>.path %>\`,
})
export class <?- template.name ?> implements ITemplate {
  data(input: { $name: ISmartString }) {
    return {
      <?- template.namespace ?>: {
        // Template data
      }
    };
  }

  render() {
    return \`\`;
  }
}
`;
  }
}
