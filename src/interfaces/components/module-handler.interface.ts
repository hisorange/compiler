import { KernelModuleTypes } from '../../constants/modules';
import { IBackendMeta } from '../../decorators/backend.decorator';
import { IFrontendMeta } from '../../decorators/frontend.decorator';
import { IGeneratorMeta } from '../../decorators/generator.decorator';
import { ITemplateMeta } from '../../decorators/template.decorator';
import { IBackend, IGenerator } from '../backend.interface';
import { Constructor } from '../constructor.interface';
import { IFrontend } from '../frontend.interface';
import { IModule } from '../module-resolution.interface';
import { ITemplate } from '../template.interface';

export interface IModuleHandler {
  register(type: KernelModuleTypes.FRONTEND, module: Constructor<IFrontend>): void;
  register(type: KernelModuleTypes.TEMPLATE, module: Constructor<ITemplate>): void;
  register(type: KernelModuleTypes.GENERATOR, module: Constructor<IGenerator>): void;
  register(type: KernelModuleTypes.BACKEND, module: Constructor<IBackend>): void;

  retrive(type: KernelModuleTypes.FRONTEND, reference: string): IModule<IFrontendMeta, IFrontend>;
  retrive(type: KernelModuleTypes.TEMPLATE, reference: string): IModule<ITemplateMeta, ITemplate>;
  retrive(type: KernelModuleTypes.GENERATOR, reference: string): IModule<IGeneratorMeta, IGenerator>;
  retrive(type: KernelModuleTypes.BACKEND, reference: string): IModule<IBackendMeta, IBackend>;

  search(type: KernelModuleTypes.FRONTEND): IModule<IFrontendMeta, IFrontend>[];
  search(type: KernelModuleTypes.TEMPLATE): IModule<ITemplateMeta, ITemplate>[];
  search(type: KernelModuleTypes.GENERATOR): IModule<IGeneratorMeta, IGenerator>[];
  search(type: KernelModuleTypes.BACKEND): IModule<IBackendMeta, IBackend>[];
}
