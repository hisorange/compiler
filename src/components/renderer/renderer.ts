import { dirname, extname, join } from 'path';
import { Bindings } from '../container/bindings';
import { Inject } from '../container/decorators';
import { ReferenceResolver } from '../container/forward-ref';
import { Constructor } from '../container/interfaces';
import { IEventEmitter } from '../event-handler';
import { IFileSystem } from '../file-system';
import { ILogger, LoggerFactory } from '../logger';
import {
  IKernelModuleManager,
  ITemplate,
  ITemplateMeta,
  ModuleType,
} from '../module-handler';
import { RendererEvents } from './contants/events';
import { RenderContext } from './context/render.context';
import { EJSEngine } from './engines/ejs.engine';
import { IEngine } from './interfaces/engine.interface';
import { IRenderer } from './interfaces/renderer.interface';

const merge = require('deepmerge');

export class Renderer implements IRenderer {
  /**
   * Own logger instance.
   */
  protected logger: ILogger;
  protected ctx: RenderContext;

  /**
   * Base directory on the output file system.
   */
  protected _outputBaseDirectory: string = '/';

  /**
   * Base directory in the input / view file system.
   */
  protected _inputBaseDirectory: string = '/';
  protected engines = new Map<string, IEngine>();

  /**
   * @inheritdoc
   */
  constructor(
    @Inject(Bindings.Factory.Logger)
    loggerFactory: LoggerFactory,
    @Inject(Bindings.Components.EventEmitter)
    readonly events: IEventEmitter,
    @Inject(Bindings.Provider.InputFileSystem)
    readonly inputFileSystem: IFileSystem,
    @Inject(Bindings.Provider.OutputFileSystem)
    readonly outputFileSystem: IFileSystem,
    @Inject(Bindings.Module.Handler)
    private module: IKernelModuleManager,
  ) {
    // Create a new logger.
    this.logger = loggerFactory.create({
      label: [this.constructor.name],
    });

    // Register the rendering engines.
    this.engines.set('ejs', new EJSEngine(this.module));
    this.logger.info('Renderer is ready!');

    this.ctx = new RenderContext({
      __ENGINE__: 'ejs',
    });
  }

  get context(): RenderContext {
    return this.ctx;
  }

  /**
   * @deprecated
   */
  mergeContext(extension: Object): void {
    this.ctx.extend(extension);
  }

  setScope(scope: string): void {
    this.logger = this.logger.scope(scope.trim(), this.constructor.name);
  }

  /**
   * @type {string}
   * @memberof RenderEngine
   */
  get inputBaseDirectory(): string {
    return this._inputBaseDirectory;
  }

  /**
   * @memberof RenderEngine
   */
  set inputBaseDirectory(newValue: string) {
    newValue = this.trimSlashes(newValue);
    const context = {
      oldValue: this._inputBaseDirectory,
      newValue,
    };

    this.logger.info('Changing [INPUT] base directory', context);
    this.events.publish(RendererEvents.INPUT_DIRECTORY_CHANGE, context);

    this._inputBaseDirectory = newValue || '/';
  }

  /**
   * @type {string}
   * @memberof RenderEngine
   */
  get outputBaseDirectory(): string {
    return this._outputBaseDirectory;
  }

  /**
   * @memberof RenderEngine
   */
  set outputBaseDirectory(newValue: string) {
    newValue = this.trimSlashes(newValue);
    const context = {
      oldValue: this._outputBaseDirectory,
      newValue,
    };

    this.logger.info('Changing [OUTPUT] base directory', context);
    this.events.publish(RendererEvents.OUTPUT_DIRECTORY_CHANGE, context);

    this._outputBaseDirectory = newValue || '/';
  }

  /**
   * @inheritdoc
   */
  write(path: string, content: string) {
    path = join(this._outputBaseDirectory, path);

    // This may cause excessive CPU load.
    this.events.publish(RendererEvents.WRITE_FILE, {
      path,
      content,
    });

    this.outputFileSystem.mkdirSync(dirname(path), { recursive: true });
    this.outputFileSystem.writeFileSync(path, content);

    this.logger.success('Wrote file', {
      path,
      bytes: content.length,
    });
  }

  /**
   * @inheritdoc
   */
  async renderGenerator(ref: string, ctx: RenderContext) {
    const generator = this.module.retrive(ModuleType.GENERATOR, ref);

    await generator.module.render(ctx);
  }

  /**
   * @inheritdoc
   */
  renderTemplate(templateRef: string, withContext?: RenderContext) {
    // Define the local context from the global.
    let ctx = this.ctx;

    // Fork into an isolated local copy if an overide is defined.
    if (withContext) {
      ctx = ctx.fork().extend(withContext);
    }

    const template = this.module.retrive(ModuleType.TEMPLATE, templateRef);

    // Safely resolve dependencies to fill up the context.
    this.resolveTemplateDependencies(template.meta, []);

    if (template.module.context) {
      ctx.extend(template.module.context(ctx.props()));
    }

    const path = this.renderString(
      template.meta.path,
      ctx,
      template.meta.engine,
    );

    ctx.extend({
      __FILE__: path,
      __DIR__: dirname(path),
    });

    this.write(
      path,
      this.renderString(template.module.render(), ctx, template.meta.engine),
    );
  }

  protected resolveTemplateDependencies(meta: ITemplateMeta, trace: string[]) {
    if (meta?.depends?.length) {
      for (let dependency of meta.depends) {
        if (dependency instanceof ReferenceResolver) {
          dependency = (
            dependency as ReferenceResolver<Constructor<ITemplate>>
          ).resolve();
        }

        const dMeta = this.module.meta(ModuleType.TEMPLATE, dependency);
        const dInst = this.module.retrive(ModuleType.TEMPLATE, dMeta.reference);

        if (dInst.module.context) {
          // Load the dependency's data to context.
          this.ctx.extend(dInst.module.context(this.ctx));
        }

        // Check for dependency loop.
        if (!trace.includes(dMeta.reference)) {
          trace.push(dMeta.reference);

          // Resolve nested dependency.
          this.resolveTemplateDependencies(dMeta, trace);
        }
      }
    }
  }

  /**
   * Prepend the input base directory.
   */
  protected addInputBase(path: string): string {
    if (!path.includes(this._inputBaseDirectory)) {
      return join(this._inputBaseDirectory, path);
    } else {
      return path;
    }
  }

  /**
   * Remove the input base directory.
   */
  protected removeInputBase(path: string): string {
    return path.substring(this.inputBaseDirectory.length);
  }

  /**
   * Check if the given path ends with the template engines associated extension.
   */
  protected isEngineAssociated(path: string): boolean {
    const ext = extname(path);

    return this.engines.has(ext);
  }

  /**
   * Trim trailing slashes.
   */
  protected trimSlashes(path: string): string {
    return path.replace(/(\/|\\)+$/, '');
  }

  /**
   * Render the given string with the context.
   */
  protected renderString(
    input: string,
    context: RenderContext,
    options?: Object,
  ): string {
    const baseOptions = {
      engine: 'ejs',
    };

    if (options) {
      options = merge(baseOptions, options);
    } else {
      options = baseOptions;
    }

    return this.engines
      .get((options as any).engine)
      .render(input, context.props(), options);
  }
}
