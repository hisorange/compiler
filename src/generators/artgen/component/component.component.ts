import { IStringCase } from '@artgen/string-case';
import { Component } from '../../../decorators/component.decorator';
import { IRendererComponent } from '../../../interfaces/renderer-component.interface';

@Component({
  reference: 'artgen.component',
  renderer: {
    delimiter: '?',
  },
  path: `components/<?- component.path ?>`,
})
export class ComponentComponent implements IRendererComponent {
  data(input: { $name: IStringCase }) {
    return {
      component: {
        name: input.$name.pascalCase.suffix('Component'),
        namespace: input.$name.kebabCase,
        path: input.$name.kebabCase.suffix('.component.ts'),
      },
    };
  }

  render() {
    return `import { IStringCase } from '@artgen/string-case';
import { Component } from '../../../../decorators/component.decorator';
import { IRendererComponent } from '../../../../interfaces/renderer-component.interface';

@Component({
  reference: 'artgen.<?- component.namespace ?>',
  path: \`components/<%- <?- component.namespace ?>.path %>\`,
})
export class <?- component.name ?> implements IRendererComponent {
  data(input: { $name: IStringCase }) {
    return {
      <?- component.namespace ?>: {

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
