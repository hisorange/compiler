import { MetadataInspector } from '@loopback/context';
import { Bindings } from '../constants/bindings';
import { KernelModuleTypes } from '../constants/modules';
import { Container } from '../container';
import { IBackendMeta } from '../decorators/backend.decorator';
import { IFrontendMeta } from '../decorators/frontend.decorator';
import { IGeneratorMeta } from '../decorators/generator.decorator';
import { Inject } from '../decorators/inject.decorator';
import { ITemplateMeta } from '../decorators/template.decorator';
import { ModuleException } from '../exceptions/module.exception';
import { IBackend, IGenerator } from '../interfaces/backend.interface';
import { IModuleHandler } from '../interfaces/components/module-handler.interface';
import { Constructor } from '../interfaces/constructor.interface';
import { MissingMetaDataExceptionContext } from '../interfaces/exception-contexts/missing-meta-data.exception-context';
import { MissingModuleBindingExceptionContext } from '../interfaces/exception-contexts/missing-module-binding.exception-context';
import { IFrontend } from '../interfaces/frontend.interface';
import { IModule } from '../interfaces/module-resolution.interface';
import { ITemplate } from '../interfaces/template.interface';

type ModuleMeta = ITemplateMeta | IGeneratorMeta | IBackendMeta | IFrontendMeta;
type ModuleData = ITemplate | IGenerator | IBackend | IFrontend;
type RetriveReturn = IModule<ModuleMeta, ModuleData>;

export class ModuleHandler implements IModuleHandler {
  /**
   * Private child context, this is used to separate the modules from the main context.
   */
  private readonly ctx: Container;

  /**
   * Create the kernel module handler with the kernel's context and create the child context for the modules.
   */
  constructor(@Inject(Bindings.Container) kernelContext: Container) {
    this.ctx = new Container(kernelContext, 'modules');
  }

  register(type: KernelModuleTypes.FRONTEND, mod: Constructor<IFrontend>): void;
  register(type: KernelModuleTypes.TEMPLATE, mod: Constructor<ITemplate>): void;
  register(type: KernelModuleTypes.GENERATOR, mod: Constructor<IGenerator>): void;
  register(type: KernelModuleTypes.BACKEND, mod: Constructor<IBackend>): void;
  register(type: KernelModuleTypes, module: Constructor<ModuleData>): void {
    // Acquire the meta data from the module.
    const meta = this.readMeta<ModuleMeta>(type, module);

    // Create the references.
    const metaRef = this.createMetaReference(type, meta.reference);
    const dataRef = this.createDataReference(type, meta.reference);

    // Register the implementations before the special hooks.
    this.ctx.bind(dataRef).toClass(module).tag(`${type}-data`);
    this.ctx.bind(metaRef).to(meta).tag(`${type}-meta`);

    // Run the special hooks.
    switch (type) {
      case KernelModuleTypes.GENERATOR:
        this.onRegisterGenerator(meta as IGeneratorMeta);
        break;
    }
  }

  retrive(type: KernelModuleTypes.FRONTEND, reference: string): IModule<IFrontendMeta, IFrontend>;
  retrive(type: KernelModuleTypes.TEMPLATE, reference: string): IModule<ITemplateMeta, ITemplate>;
  retrive(type: KernelModuleTypes.GENERATOR, reference: string): IModule<IGeneratorMeta, IGenerator>;
  retrive(type: KernelModuleTypes.BACKEND, reference: string): IModule<IBackendMeta, IBackend>;
  retrive(type: KernelModuleTypes, reference: string): RetriveReturn {
    const metaRef = this.createMetaReference(type, reference);
    const dataRef = this.createDataReference(type, reference);

    if (!this.ctx.contains(dataRef)) {
      throw new ModuleException<MissingModuleBindingExceptionContext>(`Module is not registered`, {
        type,
        reference,
      });
    }

    // Normaly this could not happen, but we check for consistence.
    if (!this.ctx.contains(metaRef)) {
      throw new ModuleException<MissingModuleBindingExceptionContext>(`Module meta is not registered`, {
        type,
        reference,
      });
    }

    // Retrive the implementations.
    const meta = this.ctx.getSync<ModuleMeta>(metaRef);
    const module = this.ctx.getSync<ModuleData>(dataRef);

    return { meta, module };
  }

  search(type: KernelModuleTypes.FRONTEND): IModule<IFrontendMeta, IFrontend>[];
  search(type: KernelModuleTypes.TEMPLATE): IModule<ITemplateMeta, ITemplate>[];
  search(type: KernelModuleTypes.GENERATOR): IModule<IGeneratorMeta, IGenerator>[];
  search(type: KernelModuleTypes.BACKEND): IModule<IBackendMeta, IBackend>[];
  search(type: KernelModuleTypes): RetriveReturn[] {
    return this.ctx
      .findByTag(`${type}-meta`)
      .map(metaRef => this.retrive(type as any, metaRef.getValue(this.ctx).reference));
  }

  /**
   * Hook to handle special cases when registering a generator module.
   */
  protected onRegisterGenerator(meta: IGeneratorMeta): void {
    if (meta.templates) {
      for (const template of meta.templates) {
        this.register(KernelModuleTypes.TEMPLATE, template);
      }
    }
  }

  /**
   * Creates a uniform reference key for module meta in the module context.
   */
  protected createMetaReference(type: KernelModuleTypes, reference: string): string {
    return type + '-meta.' + reference;
  }

  /**
   * Creates a uniform reference key for module data in the module context.
   */
  protected createDataReference(type: KernelModuleTypes, reference: string): string {
    return type + '-data.' + reference;
  }

  /**
   * Reads the meta data from the kernel module.
   */
  protected readMeta<M>(type: KernelModuleTypes, module: Constructor<ModuleData>): M {
    const meta = MetadataInspector.getClassMetadata<M>(type, module);

    // Happens when a class is registered as kernel module but does not have the right or any decorator for it.
    if (typeof meta === 'undefined') {
      throw new ModuleException<MissingMetaDataExceptionContext>('Module missing the required decorator', {
        type,
        module,
      });
    }

    return meta;
  }
}
