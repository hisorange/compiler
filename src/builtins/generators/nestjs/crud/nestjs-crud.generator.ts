import { join } from 'path';
import { Generator } from '../../../../components/module-handler/decorators/generator.decorator';
import { IGenerator } from '../../../../components/module-handler/interfaces/backend.interface';
import { IRenderer } from '../../../../components/renderer';
import { SmartString } from '../../../../components/smart-string';
import { ModuleTemplate } from './templates/module.template';

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
