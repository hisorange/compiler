import { Volume } from 'memfs/lib/volume';

export interface IFileSystem extends Volume {
  /**
   * Encode the file system contents in a binary safe JSON format.
   *
   * @returns {string}
   * @memberof IFileSystem
   */
  toJsonHex(): string;

  /**
   * Write files to the file system from a binary safe JSON format.
   *
   * @param {string} serialized
   * @memberof IFileSystem
   */
  fromJsonHex(serialized: string): void;
}
