import { Container } from '../components/container/container';
import { IFileSystem } from '../components/file-system';
import { IGeneratorInput } from '../components/generator/generator-input.interface';
import { ILogger } from '../components/logger/interfaces/logger.interface';
import { IPath } from '../components/models/interfaces/path.interface';

export interface IKernel {
  /**
   * Public access to the dependency container to allow the injection of custom components.
   */
  getContainer(): Container;

  /**
   * Create an empty virtual file system, useful for input handling.
   *
   * @throws {KernelException}
   */
  createFileSystem(): IFileSystem;

  /**
   * Creates a child logger under the default kernel logger.
   */
  createLogger(label: string): ILogger;

  /**
   * Mount an input file system, used to read the input path from disk.
   * By default the kernel will use an empty in-memory file system.
   */
  mountInputFileSystem(input: IFileSystem): void;

  /**
   * Run a generator pipe with the provided input, it's an easy shorthand to generate content
   * without running a full compiler pipeline.
   */
  generate(input: IGeneratorInput, generatorRef: string): Promise<IFileSystem>;

  /**
   * Compile an input file into a virtual file system output,
   * this executes a full compiler pipeline and expects at least one frontend.
   */
  compile(input: IPath | string, backendRefs: string[]): Promise<IFileSystem>;
}
