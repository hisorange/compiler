import { IStringCase } from '@artgen/string-case';
import { Component } from '../../../../decorators/component.decorator';
import { IRendererComponent } from '../../../../interfaces/renderer-component.interface';

@Component({
  reference: 'nestjs.crud.dto.create',
  path: `dto/<%- dto.create.path %>`,
})
export class CreateDtoComponent implements IRendererComponent {
  data(input: { $name: IStringCase }) {
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
