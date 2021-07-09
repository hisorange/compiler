import { Bindings } from '../components/container/bindings';
import { Container } from '../components/container/container';
import {
  IFileSystem,
  IGeneratorInput,
  ILogger,
  IPath,
  Path,
  Timings,
} from '../components/index';
import { KernelEnvironment } from './enumerators/kernel-environment.enum';
import { IKernelConfig } from './interfaces/kernel-config.interface';
import { IKernel } from './interfaces/kernel.interface';

export class Kernel implements IKernel {
  protected container: Container;
  protected logger: ILogger;

  constructor(
    protected readonly config: IKernelConfig = {
      environment: KernelEnvironment.PRODUCTION,
    },
  ) {}

  getContainer(): Container {
    if (!this.container) {
      this.container = new Container('kernel');
      this.container.prepareKernelBindings(this.config);
    }

    return this.container;
  }

  protected getLogger(): ILogger {
    if (!this.logger) {
      this.logger = this.getContainer()
        .getSync(Bindings.Factory.Logger)
        .create({ label: 'Kernel' });
    }

    return this.logger;
  }

  createFileSystem(): IFileSystem {
    return this.getContainer().getSync(Bindings.Factory.FileSystem).create();
  }

  createLogger(label: string): ILogger {
    return this.getLogger().scope(label);
  }

  mountInputFileSystem(fs: IFileSystem): void {
    this.getLogger().warn('Mounting an external file system as input space!');
    this.getContainer().bind(Bindings.Provider.InputFileSystem).to(fs);
  }

  async generate(
    input: IGeneratorInput = {},
    generatorRef: string,
  ): Promise<IFileSystem> {
    this.getLogger().time(Timings.OVERALL);
    this.getLogger().start('Generate job starts');

    try {
      const output = await this.getContainer()
        .getSync(Bindings.Pipeline.Generator)
        .pipe({ reference: generatorRef, input });
      this.getLogger().timeEnd(Timings.OVERALL);
      this.getLogger().success('Generate job successful!');

      return output;
    } catch (error) {
      // Something went wrong while running the generator, maybe bad user input.
      this.getLogger().fatal('Could not execute the generator job!');

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

    this.getLogger().time(Timings.OVERALL);
    this.getLogger().start('Compiling from path', { path: input });

    // Register the debug helper to track the compilation.
    this.getContainer().getSync(Bindings.Components.DebugHelper).register();
    try {
      const output = await this.getContainer()
        .getSync(Bindings.Pipeline.Compiler)
        .pipe({ input, backendRefs });
      this.getLogger().timeEnd(Timings.OVERALL);
      this.getLogger().success('Compilation successful!');

      return output;
    } catch (error) {
      // Destruct everything here, send an error
      // report if possible and notify the user about
      // the fatal error, then throw it to propagate
      // to the implementer's error handler.
      this.getLogger().fatal('Could not compile the input!');

      throw error;
    }
  }
}
