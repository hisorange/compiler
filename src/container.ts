import { Context, MetadataInspector } from '@loopback/context';
import { IBackendMeta } from './decorators/backend.decorator';
import { IGeneratorMeta } from './decorators/generator.decorator';
import { ITemplateMeta } from './decorators/template.decorator';
import { CompilerException } from './exceptions/compiler.exception';
import { IBackend, IGenerator } from './interfaces/backend.interface';
import { Constructor } from './interfaces/constructor.interface';
import { IContainer } from './interfaces/container.interface';
import { IModuleResolution } from './interfaces/module-resolution.interface';
import { ITemplate } from './interfaces/template.interface';

export class Container extends Context implements IContainer {
  registerTemplateModule(template: Constructor<IBackend>): void {
    this.registerKernelModule('template', this.getModuleMeta<IBackendMeta>('template', template), template);
  }

  registerFrontendModule(frontend: Constructor<IBackend>): void {
    this.registerKernelModule('frontend', this.getModuleMeta<IBackendMeta>('frontend', frontend), frontend);
  }

  registerBackendModule(backend: Constructor<IBackend>): void {
    this.registerKernelModule('backend', this.getModuleMeta<IBackendMeta>('backend', backend), backend);
  }

  registerGeneratorModule(generator: Constructor<IBackend>): void {
    const meta = this.getModuleMeta<IGeneratorMeta>('generator', generator);

    this.registerKernelModule('generator', meta, generator);

    // Register the templates.
    if (meta.templates) {
      meta.templates.forEach(t => this.registerTemplateModule(t));
    }
  }

  loadGeneratorModule(reference: string): IModuleResolution<IGeneratorMeta, IGenerator> {
    if (!this.contains(`generator.${reference}`)) {
      throw new CompilerException(`Kernel module doest not exists`, {
        reference,
      });
    }

    return {
      meta: this.getSync<IGeneratorMeta>(`generator-meta.${reference}`),
      module: this.getSync<IGenerator>(`generator.${reference}`),
    };
  }

  loadTemplateModule(reference: string): IModuleResolution<ITemplateMeta, ITemplate> {
    if (!this.contains(`template.${reference}`)) {
      throw new CompilerException(`Kernel module doest not exists`, {
        reference,
      });
    }

    return {
      meta: this.getSync<ITemplateMeta>(`template-meta.${reference}`),
      module: this.getSync<ITemplate>(`template.${reference}`),
    };
  }

  protected getModuleMeta<M>(type: string, extension: Function): M {
    return MetadataInspector.getClassMetadata<M>(`artgen.${type}`, extension);
  }

  protected registerKernelModule(type: string, meta: any, mod: any): void {
    this.bind(`${type}-meta.${meta.reference}`).to(meta).tag(`${type}-meta`);
    this.bind(`${type}.${meta.reference}`).toClass(mod).tag(type);
  }
}
