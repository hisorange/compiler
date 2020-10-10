import { IPath } from './path.interface';

export interface IPathAware {
  /**
   * Path to link back for error reporting.
   *
   * @returns {IPath}
   * @memberof IPathAware
   */
  readonly path: IPath;
}
