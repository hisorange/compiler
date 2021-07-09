import { basename, normalize } from 'path';
import { IPath } from './interfaces/path.interface';

export class Path implements IPath {
  readonly baseName: string;
  readonly realPath: string;
  readonly extension: string | undefined;

  constructor(path: string) {
    this.realPath = normalize(path);
    this.baseName = basename(path);
    this.extension = this.parseExtension();
  }

  protected parseExtension(): string | undefined {
    const lastDotPosition = this.baseName.lastIndexOf('.');

    if (lastDotPosition !== -1) {
      return this.baseName.substr(lastDotPosition + 1).toLowerCase();
    }

    return undefined;
  }
}
