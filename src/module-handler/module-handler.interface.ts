import { IBackendMeta } from '../decorators/backend.decorator';
import { IFrontendMeta } from '../decorators/frontend.decorator';
import { IGeneratorMeta } from '../decorators/generator.decorator';
import { ITemplateMeta } from '../decorators/template.decorator';
import { IBackend, IGenerator } from '../interfaces/backend.interface';
import { Constructor } from '../interfaces/constructor.interface';
import { IFrontend } from '../interfaces/frontend.interface';
import { ITemplate } from '../interfaces/template.interface';
import { IModule } from './module.interface';
import { ModuleType } from './module.type';

export interface IModuleHandler {
  register(type: ModuleType.FRONTEND, module: Constructor<IFrontend>): void;
  register(type: ModuleType.TEMPLATE, module: Constructor<ITemplate>): void;
  register(type: ModuleType.GENERATOR, module: Constructor<IGenerator>): void;
  register(type: ModuleType.BACKEND, module: Constructor<IBackend>): void;

  retrive(type: ModuleType.FRONTEND, reference: string): IModule<IFrontendMeta, IFrontend>;
  retrive(type: ModuleType.TEMPLATE, reference: string): IModule<ITemplateMeta, ITemplate>;
  retrive(type: ModuleType.GENERATOR, reference: string): IModule<IGeneratorMeta, IGenerator>;
  retrive(type: ModuleType.BACKEND, reference: string): IModule<IBackendMeta, IBackend>;

  search(type: ModuleType.FRONTEND): IModule<IFrontendMeta, IFrontend>[];
  search(type: ModuleType.TEMPLATE): IModule<ITemplateMeta, ITemplate>[];
  search(type: ModuleType.GENERATOR): IModule<IGeneratorMeta, IGenerator>[];
  search(type: ModuleType.BACKEND): IModule<IBackendMeta, IBackend>[];
}
