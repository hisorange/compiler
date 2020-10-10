import { IFileSystem } from '@artgen/file-system';
import { Constructor, MetadataInspector } from '@loopback/context';
import { Bindings } from './constants/bindings';
import { Timings } from './constants/timings';
import { IBackendMeta } from './decorators/backend.decorator';
import { Path } from './dtos/path';
import { CompilerException } from './exceptions/compiler.exception';
import { ILogger } from './interfaces/components/logger.interface';
import { IConfig } from './interfaces/config.interface';
import { IContainer } from './interfaces/container.interface';
import { IPath } from './interfaces/dtos/path.interface';
import { IGenerator } from './interfaces/generator-template.interface';
import { IPluginConfig } from './interfaces/plugin/plugin-config.interface';
import { IPluginManager } from './interfaces/plugin/plugin-manager.interface';
import { IPlugin } from './interfaces/plugin/plugin.interface';
import { CompilerPipeline } from './pipelines/compiler.pipeline';
import { ContainerProvider } from './providers/container.provider';

type GeneratorInput = (input: Object) => Promise<Object>;

export class Artgen {
  /**
   * Dependency container, always created when the artgen is constructed
   * this container is shared with the plugins.
   *
   * @protected
   * @type {IContainer}
   * @memberof Artgen
   */
  protected readonly container: IContainer;

  /**
   * Private logger for this instance.
   *
   * @protected
   * @type {ILogger}
   * @memberof Artgen
   */
  protected readonly logger: ILogger;

  /**
   * Alows us to proxy plugin registering request from the main instance.
   *
   * @protected
   * @type {IPluginManager}
   * @memberof Artgen
   */
  protected readonly pluginManager: IPluginManager;

  /**
   * Creates an instance of Artgen.
   *
   * @param {Partial<IConfig>} [config={}]
   * @memberof Artgen
   */
  constructor(config: Partial<IConfig> = {}) {
    // Prepare a new container and inject every neccessary dependency.
    this.container = new ContainerProvider().value();

    // Override the default config with the user provider configuration.
    this.container.bind(Bindings.Config).to(
      Object.assign(
        {
          debug: false,
        },
        config,
      ),
    );

    // Create a custom logger for the main instance.
    this.logger = this.createLogger(['Kernel']);

    // Resolve the proxied components.
    this.pluginManager = this.container.getSync(
      Bindings.Components.PluginManager,
    );

    this.logger.info('Systems ready to rock!');
  }

  /**
   * Create a logger instance, useful in the CLI and other external applications.
   *
   * @param {string[]} label
   * @returns {ILogger}
   * @memberof Artgen
   */
  public createLogger(label: string[]): ILogger {
    return this.container.getSync(Bindings.Factory.Logger).create({
      label,
    });
  }

  /**
   * Create a virtual file system.
   *
   * @returns {IFileSystem}
   * @memberof Artgen
   */
  public createFileSystem(): IFileSystem {
    return this.container.getSync(Bindings.Factory.FileSystem).create();
  }

  /**
   * Mount an input file system, used to read the input path.
   * By default Artgen will use an in memory file system.
   *
   * @param {IFileSystem} input
   * @memberof Artgen
   */
  public mount(input: IFileSystem): void {
    this.container.bind(Bindings.Provider.InputFileSystem).to(input);
  }

  /**
   * Register a plugin instance.
   *
   * @param {IPlugin<IPluginConfig>} plugin
   * @memberof Artgen
   */
  public plugin(plugin: IPlugin<IPluginConfig>): void {
    this.pluginManager.register(plugin);
  }

  /**
   * Register a plugin instance.
   *
   * @param {IPlugin<IPluginConfig>} plugin
   * @memberof Artgen
   */
  public backend(backend: Constructor<IGenerator>): void {
    const meta = MetadataInspector.getClassMetadata<IBackendMeta>(
      'artgen.backend',
      backend,
    );
    // Register the components.
    this.container.bind('backend.' + meta.reference).toClass(backend);
    this.container.bind('backend-meta.' + meta.reference).to(meta);
  }

  public async generate(
    ref: string,
    getConfig?: GeneratorInput | Object,
  ): Promise<IFileSystem> {
    if (!this.container.contains('backend.' + ref)) {
      throw new CompilerException(`Generator doest not exists`, {
        reference: ref,
      });
    }

    const generator = this.container.getSync<IGenerator>('backend.' + ref);
    const meta = this.container.getSync<IBackendMeta>('backend-meta.' + ref);

    this.logger.start('Backend invoked', {
      backend: meta.name,
    });

    let input = {};

    if (getConfig) {
      if (typeof getConfig === 'function') {
        input = await getConfig(meta.input);
      } else {
        input = getConfig;
      }
    }

    const renderer = this.container
      .getSync(Bindings.Factory.RenderEngine)
      .create({
        id: meta.name,
        config: {},
      } as any);

    if (meta.templates) {
      for (const c of meta.templates) {
        renderer.registerComponent(c);
      }
    }

    await generator.render(renderer, input);

    if (meta.author) {
      this.logger.fav(
        `Thanks for ${meta.author.name} for this awesome generator!`,
      );
    }

    renderer.write(
      '.artgenrc',
      JSON.stringify(
        {
          mode: 'generator',
          reference: ref,
          input,
        },
        null,
        2,
      ),
    );

    return this.container.getSync(Bindings.Provider.OutputFileSystem);
  }

  /**
   * Compile an input file into a virtual file system output.
   *
   * @param {(IPath | string)} path
   * @returns {IFileSystem}
   * @memberof Artgen
   */
  public async compile(path: IPath | string): Promise<IFileSystem> {
    // Convert the path into a Path object if it's provided as a string.
    if (typeof path === 'string') {
      path = new Path(path);
    }

    this.logger.time(Timings.OVERALL);
    this.logger.start('Compiling input path', { path });

    // Bootstrap plugin before any process is executed.
    this.pluginManager.invoke();

    try {
      const output = await new CompilerPipeline(this.container).pipe(path);
      this.logger.timeEnd(Timings.OVERALL);

      // All pipe finished, display the elapsed time.
      // And cheer for our success ^.^
      this.logger.success('Compilation successful!');

      return output;
    } catch (error) {
      // Desctruct everything here, send an error
      // report if possible and notify the user about
      // the fatal error, then throw it to propagate
      // to the implementer's error handler.
      this.logger.fatal('Could not compile the input!');

      throw error;
    }
  }
}
