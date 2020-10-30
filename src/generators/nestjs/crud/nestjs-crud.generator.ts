import { IRenderer } from '@artgen/renderer';
import { SmartString } from '@artgen/smart-string';
import { join } from 'path';
import { Generator } from '../../../decorators/generator.decorator';
import { IGenerator } from '../../../interfaces/backend.interface';
import { ControllerTemplate } from './templates/controller.template';
import { CreateDtoTemplate } from './templates/dto/create-dto.template';
import { ReadDtoTemplate } from './templates/dto/read-dto.template';
import { ModelTemplate } from './templates/model.template';
import { ModuleTemplate } from './templates/module.template';
import { SchemaTemplate } from './templates/schema.template';
import { ServiceTemplate } from './templates/service.template';

@Generator({
  name: 'NestJS Module',
  reference: 'nestjs.crud',
  templates: [
    ControllerTemplate,
    CreateDtoTemplate,
    ModelTemplate,
    ModuleTemplate,
    ReadDtoTemplate,
    SchemaTemplate,
    ServiceTemplate,
  ],
  input: [
    {
      message: `What is module's name?`,
      type: 'text',
      name: 'moduleName',
      default: 'mana',
    },
    {
      message: `Base directory, relative to $PWD?`,
      type: 'text',
      name: 'baseDirectory',
      default: 'modules',
    },
  ],
  author: {
    name: `Zsolo`,
  },
})
export class NestJSCrudGenerator implements IGenerator {
  async render(renderer: IRenderer, input: any) {
    const context = { $name: new SmartString(input.moduleName) };

    renderer.setContext(context);
    renderer.outputBaseDirectory = join(input.baseDirectory, context.$name.kebabCase.toString());

    renderer.render(`nestjs.crud.dto.read`);
    renderer.render(`nestjs.crud.dto.create`);
    renderer.render(`nestjs.crud.schema`);
    renderer.render(`nestjs.crud.model`);
    renderer.render(`nestjs.crud.service`);
    renderer.render(`nestjs.crud.controller`);
    renderer.render(`nestjs.crud.module`);
  }
}
