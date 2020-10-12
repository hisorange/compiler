import { ISmartString } from '@artgen/smart-string';
import { Template } from '../../../decorators/template.decorator';
import { ITemplate } from '../../../interfaces/template.interface';

@Template({
  reference: 'artgen.template',
  engine: {
    delimiter: '?',
  },
  path: `components/<?- component.path ?>`,
})
export class TemplateTemplate implements ITemplate {
  data(input: { $name: ISmartString }) {
    return {
      template: {
        name: input.$name.pascalCase.suffix('Component'),
        namespace: input.$name.kebabCase,
        path: input.$name.kebabCase.suffix('.component.ts'),
      },
    };
  }

  render() {
    return `import { ISmartString } from '@artgen/smart-string';
import { Template } from '../../../../decorators/template.decorator';
import { ITemplate } from '../../../../interfaces/template.interface';

@Template({
  reference: 'artgen.<?- template.namespace ?>',
  path: \`components/<%- <?- template.namespace ?>.path %>\`,
})
export class <?- template.name ?> implements ITemplate {
  data(input: { $name: ISmartString }) {
    return {
      <?- template.namespace ?>: {

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
