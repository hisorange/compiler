import { join } from 'path';
import {
  Bindings,
  Generator,
  IGenerator,
  Inject,
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
  constructor(
    @Inject(Bindings.Components.Renderer)
    protected readonly renderer: IRenderer,
  ) {}

  async render(input: any) {
    const context = { $name: new SmartString(input.moduleName) };

    this.renderer.setContext(context);
    this.renderer.outputBaseDirectory = join(
      input.baseDirectory,
      context.$name.kebabCase.toString(),
    );

    this.renderer.renderTemplate(`nestjs.crud.dto.read`);
    this.renderer.renderTemplate(`nestjs.crud.dto.create`);
    this.renderer.renderTemplate(`nestjs.crud.schema`);
    this.renderer.renderTemplate(`nestjs.crud.model`);
    this.renderer.renderTemplate(`nestjs.crud.service`);
    this.renderer.renderTemplate(`nestjs.crud.controller`);
    this.renderer.renderTemplate(`nestjs.crud.module`);
  }
}
