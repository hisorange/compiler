import { IFileSystem } from '../../file-system';

/**
 * Code template rendering, used by the renderers to render the source code
 * from views.
 */
export interface IRenderer {
  /**
   * The input file system where the views are stored.
   */
  readonly inputFileSystem: IFileSystem;

  /**
   * The targeted output file system where the compiled code is stored.
   */
  readonly outputFileSystem: IFileSystem;

  /**
   * Base directory where the output is written,
   * useful for plugins to set their working directory
   * and compile relative to this.
   */
  outputBaseDirectory: string;

  /**
   * Base directory where the templates are found.
   */
  inputBaseDirectory: string;

  /**
   * Change the logger scope.
   */
  setScope(scope: string): void;

  setContext(context: Object): void;

  /**
   * Write to the output file system.
   */
  write(path: string, content: string): void;

  render(template: string): void;
}
