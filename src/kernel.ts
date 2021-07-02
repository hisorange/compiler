import {
  Bindings,
  Container,
  ContainerProvider,
  IFileSystem,
  IGeneratorInput,
  ILogger,
  IPath,
  Path,
  Timings,
} from './components';
import { IKernel } from './kernel.interface';

export class Kernel implements IKernel {
  protected readonly container: Container;
  protected readonly logger: ILogger;

  constructor() {
    // Prepare a new container and inject every neccessary dependency.
    this.container = new ContainerProvider().value();

    // Configure the kernel, later it can be overwritten.
    this.container.bind(Bindings.Config).to({
      debug: true,
    });

    this.logger = this.container
      .getSync(Bindings.Factory.Logger)
      .create({ label: 'Kernel' });

    this.logger.info('System is ready to rock!');
  }

  createFileSystem(): IFileSystem {
    return this.container.getSync(Bindings.Factory.FileSystem).create();
  }

  createLogger(label: string): ILogger {
    return this.logger.scope(label);
  }

  mountInputFileSystem(input: IFileSystem): void {
    this.logger.warn('Mounting an external file system as input space!');

    this.container.bind(Bindings.Provider.InputFileSystem).to(input);
  }

  async generate(
    generatorRef: string,
    input: IGeneratorInput = {},
  ): Promise<IFileSystem> {
    this.logger.time(Timings.OVERALL);
    this.logger.start('Generate job starts');

    try {
      const output = await this.container
        .getSync(Bindings.Pipeline.Generator)
        .pipe({ reference: generatorRef, input });
      this.logger.timeEnd(Timings.OVERALL);
      this.logger.success('Generate job successful!');

      return output;
    } catch (error) {
      // Something went wrong while running the generator, maybe bad user input.
      this.logger.fatal('Could not execute the generator job!');

      throw error;
    }
  }

  async compile(
    input: IPath | string,
    backendRefs: string[],
  ): Promise<IFileSystem> {
    // Convert the path into a Path object if it's provided as a string.
    if (typeof input === 'string') {
      input = new Path(input);
    }

    this.logger.time(Timings.OVERALL);
    this.logger.start('Compiling from path', { path: input });

    try {
      // Register the debug helper to track the compilation.
      this.container.getSync(Bindings.Components.DebugHelper).register();

      const output = await this.container
        .getSync(Bindings.Pipeline.Compiler)
        .pipe({ input, backendRefs });
      this.logger.timeEnd(Timings.OVERALL);
      this.logger.success('Compilation successful!');

      return output;
    } catch (error) {
      // Destruct everything here, send an error
      // report if possible and notify the user about
      // the fatal error, then throw it to propagate
      // to the implementer's error handler.
      this.logger.fatal('Could not compile the input!');

      throw error;
    }
  }
}
