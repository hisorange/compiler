import { IStringCase } from '@artgen/string-case';
import { Template } from '../../../decorators/template.decorator';
import { ITemplate } from '../../../interfaces/template.interface';
import { ServiceTemplate } from './service.template';

@Template({
  reference: 'nestjs.crud.module',
  path: `<%- module.path %>`,
  depends: [ServiceTemplate],
})
export class ModuleTemplate implements ITemplate {
  data(input: { $name: IStringCase }) {
    return {
      module: {
        name: input.$name.pascalCase.suffix('Module'),
        directory: input.$name.kebabCase,
        path: input.$name.kebabCase.suffix('.module.ts'),
      },
    };
  }

  render() {
    return `import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { schemaFrom } from '@reflet/mongoose';
import { <%- controller.name %> } from './<%- controller.path.toString().replace('.ts', '') %>';
import { <%- schema.name %> } from './<%- schema.path.toString().replace('.ts', '') %>';
import { <%- service.name %> } from './<%- service.path.toString().replace('.ts', '') %>';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: '<%- schema.type %>',
        schema: schemaFrom(<%- schema.name %>),
        collection: '<%- schema.collection %>'
      },
    ]),
  ],
  controllers: [<%- controller.name %>],
  providers: [<%- service.name %>],
  exports: [<%- service.name %>],
})
export class <%- module.name %> {}
`;
  }
}
