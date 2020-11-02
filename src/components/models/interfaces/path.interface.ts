export interface IPath {
  /**
   * Normalize the path for file system calls.
   *
   * @type {string}
   */
  readonly realPath: string;

  /**
   * Used for short identifier for debuging and logging.
   *
   * @type {string}
   */
  readonly baseName: string;

  /**
   * Extension of the file, useful for compiler hooks.
   *
   * @type {(string | undefined)}
   */
  readonly extension: string | undefined;
}
