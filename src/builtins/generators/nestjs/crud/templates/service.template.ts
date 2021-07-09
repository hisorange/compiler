import { ISmartString, ITemplate, Template } from '../../../../../components';
import { CreateDtoTemplate, ReadDtoTemplate } from './dto';
import { SchemaTemplate } from './schema.template';

@Template({
  reference: 'nestjs.crud.service',
  path: `<%- service.path %>`,
  depends: [SchemaTemplate, ReadDtoTemplate, CreateDtoTemplate],
})
export class ServiceTemplate implements ITemplate {
  context(input: { $name: ISmartString }) {
    return {
      service: {
        name: input.$name.pascalCase.suffix('Service'),
        path: input.$name.kebabCase.suffix('.service.ts'),
        variable: input.$name.camelCase.suffix('Service'),
      },
    };
  }

  render() {
    return `import { Injectable, LoggerService } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { <%- dto.create.name %> } from './dto/<%- dto.create.path.toString().replace(/.ts$/, '') %>';
import { <%- dto.read.name %> } from './dto/<%- dto.read.path.toString().replace(/.ts$/, '') %>';
import { <%- schema.name %> } from './<%- schema.path.toString().replace('.ts', '') %>';
import { <%- model.name %> } from './<%- model.path.toString().replace('.ts', '') %>';

@Injectable()
export class <%- service.name %>  {
  constructor(
    @InjectModel('<%- schema.type %>') private <%- schema.variable %>: Model<<%- model.name %>>,
    private logger: LoggerService
  ) {}

  create(input: <%- dto.create.name %>): Promise<<%- model.name %>> {
    return (new this.<%- schema.variable %>(input)).save();
  }

  update(id: string, input: string) {

  }


  async read(id: string): Promise<<%- model.name %> | null> {
    return this.<%- schema.variable %>.findById(id).exec();
  }


  async readAll(): Promise<<%- model.name %>[]> {
    return this.<%- schema.variable %>.find().exec();
  }

  async delete(id: string): Promise<boolean> {
    return (
      (
        await this.<%- schema.variable %>
          .deleteOne({
            _id: id,
          })
          .exec()
      ).deletedCount === 1
    );
  }
}
`;
  }
}
