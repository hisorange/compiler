import { Template } from '../../../../../components/module-handler/decorators/template.decorator';
import { ITemplate } from '../../../../../components/module-handler/interfaces/template.interface';
import { ISmartString } from '../../../../../components/smart-string';
import { ReadDtoTemplate } from './dto/read-dto.template';

@Template({
  reference: 'nestjs.crud.schema',
  path: `<%- schema.path %>`,
  depends: [ReadDtoTemplate],
})
export class SchemaTemplate implements ITemplate {
  data(input: { $name: ISmartString }) {
    return {
      schema: {
        collection: input.$name.plural.pascalCase,
        name: input.$name.pascalCase.suffix('Schema'),
        variable: input.$name.camelCase.suffix('Schema'),
        type: input.$name.pascalCase,
        path: input.$name.kebabCase.suffix('.schema.ts'),
      },
    };
  }

  render() {
    return `import {
  Field as GField,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import {
  CreatedAt,
  Field,
  Model,
  SchemaOptions,
  UpdatedAt,
} from '@reflet/mongoose';
import { Expose, plainToClass } from 'class-transformer';
import * as uuid from 'uuid';
import { <%- dto.read.name %> } from './dto/<%- dto.read.path.toString().replace(/.ts$/, '') %>';

@ObjectType('<%- schema.type %>')
@SchemaOptions({
  minimize: false,
  strict: true,
  versionKey: 'offlineLock',
})
export class <%- schema.name %> extends Model.Interface {
  @Field({
    type: String,
    default: uuid.v4,
  })
  _id: string;

  @GField(() => ID)
  @Expose({ name: '_id' })
  id: string;

  @CreatedAt
  @Expose()
  @GField(() => GraphQLISODateTime)
  createdAt: Date;

  @UpdatedAt
  @Expose()
  @GField(() => GraphQLISODateTime)
  updatedAt: Date;

  @Expose()
  @GField(() => Int)
  offlineLock: number;

  toReadDto(): <%- dto.read.name %> {
    return plainToClass(<%- dto.read.name %>, this, {
      strategy: 'excludeAll',
    });
  }
}
`;
  }
}
