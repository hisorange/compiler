import { StringCase } from '@artgen/string-case';
import { join } from 'path';
import { Backend } from '../../../decorators/backend.decorator';
import { IRenderEngine } from '../../../interfaces/components/render-engine.interface';
import { IGenerator } from '../../../interfaces/generator-template.interface';
import { ControllerComponent } from './controller.component';
import { CreateDtoComponent } from './dto/create-dto.component';
import { ReadDtoComponent } from './dto/read-dto.component';
import { ModelComponent } from './model.component';
import { ModuleComponent } from './module.component';
import { SchemaComponent } from './schema.component';
import { ServiceComponent } from './service.component';

@Backend({
  name: 'NestJS Module',
  reference: 'nestjs.crud',
  components: [
    ControllerComponent,
    CreateDtoComponent,
    ModelComponent,
    ModuleComponent,
    ReadDtoComponent,
    SchemaComponent,
    ServiceComponent,
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
    const context = { $name: new StringCase(input.moduleName) };

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
