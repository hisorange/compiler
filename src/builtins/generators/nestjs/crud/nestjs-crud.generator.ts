import { join } from 'path';
import {
  Generator,
  IGenerator,
  IRenderer,
  SmartString,
} from '../../../../components';
import { ModuleTemplate } from './templates';

@Generator({
  name: 'NestJS Module',
  reference: 'nestjs.crud',
  templates: [ModuleTemplate],
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
    renderer.outputBaseDirectory = join(
      input.baseDirectory,
      context.$name.kebabCase.toString(),
    );

    renderer.renderTemplate(`nestjs.crud.dto.read`);
    renderer.renderTemplate(`nestjs.crud.dto.create`);
    renderer.renderTemplate(`nestjs.crud.schema`);
    renderer.renderTemplate(`nestjs.crud.model`);
    renderer.renderTemplate(`nestjs.crud.service`);
    renderer.renderTemplate(`nestjs.crud.controller`);
    renderer.renderTemplate(`nestjs.crud.module`);
  }
}
