import { ISmartString } from '@artgen/smart-string';
import { Template } from '../../../../../decorators/template.decorator';
import { ITemplate } from '../../../../../interfaces/template.interface';

@Template({
  reference: 'nestjs.crud.dto.create',
  path: `dto/<%- dto.create.path %>`,
})
export class CreateDtoTemplate implements ITemplate {
  data(input: { $name: ISmartString }) {
    return {
      dto: {
        create: {
          name: input.$name.pascalCase.suffix('Dto').prefix('Create'),
          path: input.$name.kebabCase.suffix('.dto.ts').prefix('create-'),
        },
      },
    };
  }

  render() {
    return `import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

@InputType()
export class <%- dto.create.name %> {
  @Field()
  @IsString()
  @ApiProperty()
  readonly name: string;
}
`;
  }
}
