import { Constructor } from '../constructor.interface';
import { IRendererComponent } from '../renderer-component.interface';
import { ISymbolData } from '../symbol-data.interface';
import { IFileSystem } from './file-system.interface';

/**
 * Code template rendering, used by the renderers to render the source code
 * from views.
 */
export interface IRenderEngine {
  /**
   * The input file system where the views are stored.
   *
   * @type {IFileSystem}
   * @memberof IRenderer
   */
  readonly inputFileSystem: IFileSystem;

  /**
   * The targeted output file system where the compiled code is stored.
   *
   * @type {IFileSystem}
   * @memberof IRenderer
   */
  readonly outputFileSystem: IFileSystem;

  /**
   * Base directory where the output is written,
   * useful for plugins to set their working directory
   * and compile relative to this.
   *
   * @type {string}
   * @memberof IRenderer
   */
  outputBaseDirectory: string;

  /**
   * Base directory where the templates are found.
   *
   * @type {string}
   * @memberof IRenderer
   */
  inputBaseDirectory: string;

  /**
   * Change the logger scope.
   *
   * @param {string} scope
   * @memberof IRenderEngine
   */
  setScope(scope: string): void;

  setContext(context: Object): void;

  /**
   * Compile from the input file system to the output file system while
   * rendering a single view or a directory.
   *
   * @param {string} from
   * @param {string} to
   * @param {ISymbolData} [context]
   * @memberof IRenderer
   */
  render(from: string, to: string, context?: ISymbolData): void;

  /**
   * Compile the given string.
   *
   * @param {string} input
   * @param {any} [context]
   * @returns {string}
   * @memberof IRenderer
   */
  renderString(input: string, context?: any): string;

  /**
   * Write to the output file system.
   *
   * @protected
   * @param {string} path
   * @param {string} content
   */
  write(path: string, content: string): void;

  registerComponent(component: Constructor<IRendererComponent>): void;
  renderComponent(component: string): void;
}
