import { IStringCase } from '@artgen/string-case';
import { Component } from '../../../../decorators/component.decorator';
import { IRendererComponent } from '../../../../interfaces/renderer-component.interface';

@Component({
  reference: 'nestjs.crud.dto.read',
  path: `dto/<%- dto.read.path %>`,
})
export class ReadDtoComponent implements IRendererComponent {
  props() {
    return {};
  }

  data(input: { $name: IStringCase }) {
    return {
      dto: {
        read: {
          name: input.$name.pascalCase.suffix('Dto').prefix('Read'),
          path: input.$name.kebabCase.suffix('.dto.ts').prefix('read-'),
        },
      },
    };
  }

  render() {
    return `import { Expose } from 'class-transformer';

export class <%- dto.read.name %>  {
  @Expose({ name: '_id' }) id: string;
  @Expose() createdAt: string;
  @Expose() updatedAt: string;
  @Expose() offlineLock: string;
}
`;
  }
}
