import { SmartString } from '@artgen/smart-string';
import { join } from 'path';
import { Backend } from '../../../decorators/backend.decorator';
import { IRenderEngine } from '../../../interfaces/components/render-engine.interface';
import { IGenerator } from '../../../interfaces/generator-template.interface';
import { ControllerTemplate } from './controller.template';
import { CreateDtoTemplate } from './dto/create-dto.template';
import { ReadDtoTemplate } from './dto/read-dto.template';
import { ModelTemplate } from './model.template';
import { ModuleTemplate } from './module.template';
import { SchemaTemplate } from './schema.template';
import { ServiceTemplate } from './service.template';

@Backend({
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
export class NestJSCRUDBackend implements IGenerator {
  async render(renderer: IRenderEngine, input: any) {
    const context = { $name: new SmartString(input.moduleName) };

    renderer.setContext(context);
    renderer.outputBaseDirectory = join(
      input.baseDirectory,
      context.$name.kebabCase.toString(),
    );

    renderer.renderComponent(`nestjs.crud.dto.read`);
    renderer.renderComponent(`nestjs.crud.dto.create`);
    renderer.renderComponent(`nestjs.crud.schema`);
    renderer.renderComponent(`nestjs.crud.model`);
    renderer.renderComponent(`nestjs.crud.service`);
    renderer.renderComponent(`nestjs.crud.controller`);
    renderer.renderComponent(`nestjs.crud.module`);
  }
}
