import { Context } from '@loopback/context';
import { IGeneratorMeta } from '../decorators/generator.decorator';
import { ITemplateMeta } from '../decorators/template.decorator';
import { IBackend, IGenerator } from './backend.interface';
import { Constructor } from './constructor.interface';
import { IFrontend } from './frontend.interface';
import { IModuleResolution } from './module-resolution.interface';
import { ITemplate } from './template.interface';

export interface IContainer extends Context {
  registerTemplateModule(template: Constructor<ITemplate>): void;
  registerFrontendModule(frontend: Constructor<IFrontend>): void;
  registerBackendModule(backend: Constructor<IBackend>): void;
  registerGeneratorModule(generator: Constructor<IGenerator>): void;

  loadGeneratorModule(reference: string): IModuleResolution<IGeneratorMeta, IGenerator>;

  loadTemplateModule(reference: string): IModuleResolution<ITemplateMeta, ITemplate>;
}
