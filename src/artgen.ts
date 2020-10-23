import { IFileSystem } from '@artgen/file-system';
import { Constructor, MetadataInspector } from '@loopback/context';
import { Bindings } from './constants/bindings';
import { Timings } from './constants/timings';
import { IBackendMeta } from './decorators/backend.decorator';
import { Path } from './dtos/path';
import { IBackend, IGenerator } from './interfaces/backend.interface';
import { ILogger } from './interfaces/components/logger.interface';
import { IConfig } from './interfaces/config.interface';
import { IContainer } from './interfaces/container.interface';
import { IPath } from './interfaces/dtos/path.interface';
import { IFrontend } from './interfaces/frontend.interface';
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
   * @param {IFrontend<IPluginConfig>} plugin
   * @memberof Artgen
   */
  public frontend(frontend: Constructor<IFrontend>): void {
    this.setExtension('frontend', frontend);
  }

  /**
   * Register a generator.
   *
   * @param {Constructor<IGenerator>} generator
   * @memberof Artgen
   */
  public generator(generator: Constructor<IGenerator>): void {
    this.setExtension('generator', generator);
  }

  /**
   * Register a backend.
   *
   * @param {Constructor<IBackend>} backend
   * @memberof Artgen
   */
  public backend(backend: Constructor<IBackend>): void {
    this.setExtension('backend', backend);
  }

  /**
   * Register a decorated extension with it's meta.
   *
   * @param ref
   * @param extension
   */
  protected setExtension(ref: string, extension: Constructor<any>): void {
    const meta = MetadataInspector.getClassMetadata<IBackendMeta>(
      'artgen.' + ref,
      extension,
    );
    // Register the components.
    this.container
      .bind(ref + '.' + meta.reference)
      .toClass(extension)
      .tag(ref);
    this.container
      .bind(ref + '-meta.' + meta.reference)
      .to(meta)
      .tag(ref + '-meta');
  }

  /**
   * Run the generator with the given input, or run a prompt.
   */
  public async generate(
    ref: string,
    input?: GeneratorInput | Object,
  ): Promise<IFileSystem> {
    return this.container.getSync(Bindings.Pipe.Generator).pipe({ ref, input });
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
