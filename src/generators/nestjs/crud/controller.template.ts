import { ISmartString } from '@artgen/smart-string';
import { Template } from '../../../decorators/template.decorator';
import { ITemplate } from '../../../interfaces/template.interface';

@Template({
  reference: 'nestjs.crud.controller',
  path: `<%- controller.path %>`,
})
export class ControllerTemplate implements ITemplate {
  props() {
    return {};
  }

  data(input: { $name: ISmartString }) {
    return {
      controller: {
        name: input.$name.pascalCase.suffix('Controller'),
        path: input.$name.kebabCase.suffix('.controller.ts'),
        route: input.$name.kebabCase,
      },
    };
  }

  render() {
    return `import {
  Body,
  Controller,
  Delete,
  Get,
  LoggerService,
  Param,
  Patch,
  Post,
  BadRequestException,
} from '@nestjs/common';
import { <%- service.name %> } from './<%- service.path.toString().replace(/.ts$/, '') %>';
import { <%- dto.create.name %> } from './dto/<%- dto.create.path.toString().replace(/.ts$/, '') %>';
import { <%- dto.read.name %> } from './dto/<%- dto.read.path.toString().replace(/.ts$/, '') %>';

@Controller('<%- controller.route %>')
export class <%- controller.name %> {
  constructor(
    private <%- service.variable %>: <%- service.name %>,
    private logger: LoggerService
  ) {
  }

  @Post()
  async createResource(@Body() input: <%- dto.create.name %>) {
    this.logger.log('Dispatching resource creation');

    try {
      const record = await this.<%- service.variable %>.create(input);

      return {
        success: true,
        resource: record,
      };
    } catch(e) {
      this.logger.error(e);
      throw new BadRequestException('Invalid input!');
    }
  }

  @Get(':id')
  async getResource(@Param('id') id: string): Promise<<%- dto.read.name %>> {
    return (await this.<%- service.variable %>.read(id)).toReadDto();
  }

  @Patch(':id')
  updateResource(@Param('id') id: string, @Body() resource: string) {
    return this.<%- service.variable %>.update(id, resource);
  }

  @Delete(':id')
  deleteResource(@Param('id') id: string) {
    return this.<%- service.variable %>.delete(id);
  }
}
`;
  }
}
