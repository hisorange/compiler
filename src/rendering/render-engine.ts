import { Constructor, MetadataInspector } from '@loopback/context';
import * as engine from 'ejs';
import * as cache from 'lru-cache';
import { dirname, join } from 'path';
import * as walk from 'walkdir';
import { Bindings } from '../constants/bindings';
import { Inject } from '../decorators/inject.decorator';
import { ITemplateMeta } from '../decorators/template.decorator';
import { LoggerFactory } from '../factories/logger.factory';
import { IEventEmitter } from '../interfaces/components/event-emitter.interface';
import { IFileSystem } from '../interfaces/components/file-system.interface';
import { ILogger } from '../interfaces/components/logger.interface';
import { IRenderEngine } from '../interfaces/components/render-engine.interface';
import { IContainer } from '../interfaces/container.interface';
import { ISymbolData } from '../interfaces/symbol-data.interface';
import { ITemplate } from '../interfaces/template.interface';
const merge = require('deepmerge');
const { isPlainObject } = require('is-plain-object');

export class RenderEngine implements IRenderEngine {
  /**
   * The EJS engine instance which executes the code view rendering.
   *
   * @protected
   * @type {typeof engine}
   * @memberof RenderEngine
   */
  protected readonly engine: typeof engine;
  protected readonly cache;

  /**
   * Own logger instance.
   *
   * @protected
   * @type {ILogger}
   * @memberof RenderEngine
   */
  protected logger: ILogger;

  protected context: any;

  /**
   * Base directory on the output file system.
   *
   * @protected
   * @type {string}
   * @memberof RenderEngine
   */
  protected _outputBaseDirectory: string = '/';

  /**
   * Base directory in the input / view file system.
   *
   * @protected
   * @type {string}
   * @memberof RenderEngine
   */
  protected _inputBaseDirectory: string = '/';

  /**
   * Creates an instance of RenderEngine.
   *
   * @param {LoggerFactory} loggerFactory
   * @param {IEventEmitter} events
   * @param {IFileSystem} inputFileSystem
   * @param {IFileSystem} outputFileSystem
   * @memberof RenderEngine
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
    @Inject(Bindings.Container)
    private container: IContainer,
  ) {
    // Create a new logger.
    this.logger = loggerFactory.create({
      label: [this.constructor.name],
    });

    (engine as any).cache = cache;

    this.engine = engine;

    this.logger.info('New instance created!');
  }

  registerComponent(component: Constructor<ITemplate>): void {
    const meta = MetadataInspector.getClassMetadata<ITemplateMeta>(
      'artgen.template',
      component,
    );
    // Register the components.
    this.container.bind('component.' + meta.reference).toClass(component);
    this.container.bind('component-meta.' + meta.reference).to(meta);
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
    this.events.publish('artgen.input.directory.change', context);

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
    this.events.publish('artgen.output.directory.change', context);

    this._outputBaseDirectory = newValue || '/';
  }

  /**
   * @inheritdoc
   */
  render(from: string, to: string, context: ISymbolData = {}): void {
    if (
      this.inputFileSystem
        .lstatSync(join(this._inputBaseDirectory, from))
        .isFile()
    ) {
      this.renderFile(from, to, context);
    } else {
      this.renderDir(from, to, context);
    }
  }

  /**
   * Prepend the input base directory.
   *
   * @protected
   * @param {string} path
   * @returns {string}
   * @memberof RenderEngine
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
   *
   * @protected
   * @param {string} path
   * @returns {string}
   * @memberof RenderEngine
   */
  protected removeInputBase(path: string): string {
    return path.substring(this.inputBaseDirectory.length);
  }

  /**
   * Check if the given path ends with the template engines associated extension.
   *
   * @protected
   * @param {string} path
   * @returns {boolean}
   * @memberof RenderEngine
   */
  protected checkExtension(path: string): boolean {
    return path.substr(-4) === '.ejs';
  }

  /**
   * Render a single file.
   *
   * @protected
   * @param {string} from
   * @param {string} to
   * @param {ISymbolData} [context={}]
   * @memberof RenderEngine
   */
  protected renderFile(
    from: string,
    to: string,
    context: ISymbolData = {},
  ): void {
    // Check if this needs to compiled or just a copy.
    if (this.checkExtension(from)) {
      this.write(to.replace(/\.ejs$/, ''), this.execute(from, context));
    } else {
      this.write(to, this.read(from));
    }
  }

  /**
   * Trim trailing slashes.
   *
   * @protected
   * @param {string} path
   * @returns {string}
   * @memberof RenderEngine
   */
  protected trimSlashes(path: string): string {
    return path.replace(/(\/|\\)+$/, '');
  }

  /**
   * Render a directory recursively.
   *
   * @protected
   * @param {string} from
   * @param {string} to
   * @param {ISymbolData} [context={}]
   * @memberof RenderEngine
   */
  protected renderDir(
    from: string,
    to: string,
    context: ISymbolData = {},
  ): void {
    // Remove trailing slashes to ensure a standard input.
    from = this.trimSlashes(from);
    to = this.trimSlashes(to);

    const paths = walk.sync(this.addInputBase(from), {
      fs: this.inputFileSystem,
    });

    this.logger.info('Rendering directory', { from, to });

    for (let path of paths) {
      if (this.inputFileSystem.lstatSync(path).isFile()) {
        path = this.removeInputBase(path);

        this.renderFile(path, path.replace(from, to), context);
      }
    }
  }

  /**
   * Read the content from the input file system.
   *
   * @protected
   * @param {string} path
   * @returns {string}
   * @memberof RenderEngine
   */
  protected read(path: string): string {
    if (this.cache.has(path)) {
      return this.cache.get(path);
    }

    this.logger.info('Reading file', {
      path,
    });

    const content = this.inputFileSystem
      .readFileSync(this.addInputBase(path))
      .toString();

    this.cache.set(path, content);

    return content;
  }

  /**
   * Write to the output file system.
   *
   * @protected
   * @param {string} path
   * @param {string} content
   * @memberof RenderEngine
   */
  write(path: string, content: string) {
    path = join(this._outputBaseDirectory, path);

    this.outputFileSystem.mkdirSync(dirname(path), { recursive: true });
    this.outputFileSystem.writeFileSync(path, content);

    this.logger.success('Wrote file', {
      path,
      bytes: content.length,
    });
  }

  /**
   * Render the given path with the context.
   *
   * @protected
   * @param {string} path
   * @param {ISymbolData} context
   * @returns {string}
   * @memberof RenderEngine
   */
  protected execute(path: string, context: ISymbolData): string {
    this.logger.debug('Render file', {
      file: path,
      context,
    });

    const root = dirname(this.addInputBase(path));

    context.__FILE__ = path;
    context.__DIR__ = dirname(path);

    return this.engine.render(this.read(path), context, {
      filename: path,
      root,
      rmWhitespace: false,
      escape: i => i,
      views: [root],
    } as any);
  }

  /**
   * Render the given path with the context.
   *
   * @protected
   * @param {string} path
   * @param {ISymbolData} context
   * @returns {string}
   * @memberof RenderEngine
   */
  renderString(input: string, context: any, options?: Object): string {
    context.__FILE__ = '';
    context.__DIR__ = '';

    const baseOptions = {
      rmWhitespace: false,
      escape: i => i,
      delimiter: `%`,
      includer: (path, filename) => {
        const cmp = this.container.getSync<ITemplate>('component.' + path);

        return {
          filename: path,
          template: cmp.render(),
        };
      },
    };

    if (options) {
      options = merge(baseOptions, options);
    } else {
      options = baseOptions;
    }

    return this.engine.render(input, context, options);
  }

  renderComponent(ref: string) {
    const meta = this.container.getSync<ITemplateMeta>('component-meta.' + ref);
    const comp = this.container.getSync<ITemplate>('component.' + ref);

    this.context = merge(this.context, comp.data(this.context), {
      isMergeableObject: isPlainObject,
    });

    this.write(
      this.renderString(meta.path, this.context, meta.engine),
      this.renderString(comp.render(), this.context, meta.engine),
    );
  }
}
