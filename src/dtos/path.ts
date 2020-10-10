import { basename, normalize } from 'path';
import { IPath } from '../interfaces/dtos/path.interface';

export class Path implements IPath {
  readonly baseName: string;
  readonly realPath: string;
  readonly extension: string | undefined;

  constructor(path: string) {
    this.realPath = normalize(path);
    this.baseName = basename(path);

    const lastDotPosition = this.baseName.lastIndexOf('.');

    if (lastDotPosition !== -1) {
      this.extension = this.baseName.substr(lastDotPosition + 1).toLowerCase();
    }
  }
}
