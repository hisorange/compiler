import { ITemplate, Template } from '../../src';
import { TestInput } from './artest.generator';

@Template({
  reference: 'artest.template',
  engine: {
    delimiter: '?',
  },
  path: `templates/<?- tpl.path ?>`,
})
export class ArTestTemplate implements ITemplate<TestInput> {
  context(ctx: TestInput) {
    return {
      tpl: {
        name: ctx.name.pascalCase.suffix('Template'),
        path: ctx.name.kebabCase.suffix('.txt'),
      },
    };
  }

  render() {
    return `Should print <?- tpl.name ?>=ArTestTemplate`;
  }
}
