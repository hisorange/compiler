import { IFileSystem } from '@artgen/file-system';
import { Constructor } from '@loopback/context';
import { IBackend, IGenerator } from './backend.interface';
import { ILogger } from './components/logger.interface';
import { IPath } from './dtos/path.interface';
import { IFrontend } from './frontend.interface';
import { IGeneratorInput } from './generator-input.interface';
import { ITemplate } from './template.interface';

export interface IKernel {
  /**
   * Create a logger instance, useful in the CLI and other external extensions.
   *
   * @throws {KernelException}
   */
  createLogger(label: string[]): ILogger;

  /**
   * Create an empty virtual file system, useful for input handling.
   *
   * @throws {KernelException}
   */
  createFileSystem(): IFileSystem;

  /**
   * Mount an input file system, used to read the input path.
   * By default Artgen will use an empty in-memory file system.
   */
  mount(input: IFileSystem): void;

  /**
   * Register a frontend kernel module.
   */
  frontend(frontend: Constructor<IFrontend>): void;

  /**
   * Register a generator kernel module.
   */
  generator(generator: Constructor<IGenerator>): void;

  /**
   * Register a backend kernel module.
   */
  backend(backend: Constructor<IBackend>): void;

  /**
   * Register a template kernel module.
   */
  template(template: Constructor<ITemplate>): void;

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
