import { IFileSystem } from './components/file-system';
import { IGeneratorInput } from './components/generator/generator-input.interface';
import { ILogger } from './components/logger/interfaces/logger.interface';
import { IPath } from './components/models/interfaces/path.interface';
import { IModuleHandler } from './components/module-handler';

export interface IKernel {
  /**
   * Access to the main logger instance, can be used to create child loggers.
   */
  readonly logger: ILogger;

  /**
   * Create an empty virtual file system, useful for input handling.
   *
   * @throws {KernelException}
   */
  createFileSystem(): IFileSystem;

  /**
   * Register and load modules through this kernel component.
   */
  readonly module: IModuleHandler;

  /**
   * Mount an input file system, used to read the input path.
   * By default Artgen will use an empty in-memory file system.
   */
  mount(input: IFileSystem): void;

  /**
   * Run a generator pipe with the provided input, it's an easy shorthand to generate content
   * without running a full compiler pipeline.
   */
  generate(reference: string, input: IGeneratorInput): Promise<IFileSystem>;

  /**
   * Compile an input file into a virtual file system output,
   * this executes a full compiler pipeline and expects at least one frontend.
   */
  compile(path: IPath | string): Promise<IFileSystem>;
}
