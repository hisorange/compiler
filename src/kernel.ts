import { Bindings } from './components/container/bindings';
import { Container } from './components/container/container';
import { ContainerProvider } from './components/container/container.provider';
import { KernelException } from './components/container/exceptions/kernel.exception';
import { MissingBindingExceptionContext } from './components/container/interfaces/missing-binding.exception-context';
import { Timings } from './components/event-handler/timings';
import { IFileSystem } from './components/file-system';
import { IGeneratorInput } from './components/generator/generator-input.interface';
import { ILogger } from './components/logger/interfaces/logger.interface';
import { IPath } from './components/models/interfaces/path.interface';
import { Path } from './components/models/path';
import { IModuleHandler } from './components/module-handler/interfaces/module-handler.interface';
import { IKernel } from './kernel.interface';

export class Kernel implements IKernel {
  /**
   * Dependency container, always created when the artgen is constructed
   * this container is shared with the kernel modules.
   */
  protected readonly ctx: Container;

  readonly module: IModuleHandler;
  readonly logger: ILogger;

  constructor() {
    // Prepare a new container and inject every neccessary dependency.
    this.ctx = new ContainerProvider().value();

    // Configure the kernel, later it can be overwritten.
    this.ctx.bind(Bindings.Config).to({
      debug: true,
    });

    this.logger = this.ctx
      .getSync(Bindings.Factory.Logger)
      .create({ label: 'Kernel' });
    this.module = this.ctx.getSync(Bindings.Module.Handler);

    this.logger.info('System is ready to rock!');
  }

  createFileSystem(): IFileSystem {
    if (this.ctx.contains(Bindings.Factory.FileSystem)) {
      throw new KernelException<MissingBindingExceptionContext>(
        `Missing kernel binding`,
        {
          binding: Bindings.Factory.FileSystem.key,
        },
      );
    }

    return this.ctx.getSync(Bindings.Factory.FileSystem).create();
  }

  mount(input: IFileSystem): void {
    this.ctx.bind(Bindings.Provider.InputFileSystem).to(input);
  }

  async generate(
    reference: string,
    input: IGeneratorInput = {},
  ): Promise<IFileSystem> {
    this.logger.time(Timings.OVERALL);
    this.logger.start('Generate job starts');

    try {
      const output = await this.ctx
        .getSync(Bindings.Pipeline.Generator)
        .pipe({ reference, input });
      this.logger.timeEnd(Timings.OVERALL);

      // All pipe finished, display the elapsed time.
      // And cheer for our success ^.^
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
    this.logger.start('Compiling input path', { path: input });

    try {
      const output = await this.ctx
        .getSync(Bindings.Pipeline.Compiler)
        .pipe({ input, backendRefs });
      this.logger.timeEnd(Timings.OVERALL);

      // All pipe finished, display the elapsed time.
      // And cheer for our success ^.^
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
