import { dirname, extname, join } from 'path';
import { Bindings, Inject } from '../container';
import { IEventEmitter } from '../event-handler';
import { IFileSystem } from '../file-system';
import { ILogger, LoggerFactory } from '../logger';
import { IModuleHandler, ModuleType } from '../module-handler';
import { RendererEvents } from './contants/events';
import { EJSEngine } from './engines/ejs.engine';
import { IEngine } from './interfaces/engine.interface';
import { IRenderer } from './interfaces/renderer.interface';

const merge = require('deepmerge');
const { isPlainObject } = require('is-plain-object');

export class Renderer implements IRenderer {
  /**
   * Own logger instance.
   */
  protected logger: ILogger;
  protected context: any;

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
    private module: IModuleHandler,
  ) {
    // Create a new logger.
    this.logger = loggerFactory.create({
      label: [this.constructor.name],
    });

    // Register the rendering engines.
    this.engines.set('ejs', new EJSEngine(this.module));

    this.logger.info('Renderer is ready!');
  }

  setContext(context: Object): void {
    this.context = context;
  }

  /**
   * @inheritdoc
   */
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
  render(templateRef: string) {
    const template = this.module.retrive(ModuleType.TEMPLATE, templateRef);

    this.context = merge(this.context, template.module.data(this.context), {
      isMergeableObject: isPlainObject,
    });

    this.write(
      this.renderString(template.meta.path, this.context, template.meta.engine),
      this.renderString(template.module.render(), this.context, template.meta.engine),
    );
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
  protected renderString(input: string, context: any, options?: Object): string {
    const baseOptions = {
      engine: 'ejs',
    };

    if (options) {
      options = merge(baseOptions, options);
    } else {
      options = baseOptions;
    }

    return this.engines.get((options as any).engine).render(input, context, options);
  }
}
