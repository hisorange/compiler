import { Constructor } from '../../container/interfaces/constructor.interface';
import { IBackendMeta } from '../decorators/backend.decorator';
import { IFrontendMeta } from '../decorators/frontend.decorator';
import { IGeneratorMeta } from '../decorators/generator.decorator';
import { ITemplateMeta } from '../decorators/template.decorator';
import { ModuleType } from '../module-type.enum';
import { IBackend, IGenerator } from './backend.interface';
import { IFrontend } from './frontend.interface';
import { IModule } from './module.interface';
import { ITemplate } from './template.interface';

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

  meta(type: ModuleType.FRONTEND, module: Constructor<IFrontend>): IFrontendMeta;
  meta(type: ModuleType.TEMPLATE, module: Constructor<ITemplate>): ITemplateMeta;
  meta(type: ModuleType.GENERATOR, module: Constructor<IGenerator>): IGeneratorMeta;
  meta(type: ModuleType.BACKEND, module: Constructor<IBackend>): IBackendMeta;
}
