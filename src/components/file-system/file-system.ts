import { Volume } from 'memfs/lib/volume';
import { IFileSystem } from './file-system.interface';

const toHex = (i: string) => Buffer.from(i, 'utf8').toString('hex');
const fromHex = (i: string) => Buffer.from(i, 'hex').toString('utf8');

export class FileSystem extends Volume implements IFileSystem {
  /**
   * @inheritdoc
   */
  toJsonHex(): string {
    const files = this.toJSON();
    const encoded = {};

    for (const key of Object.keys(files)) {
      encoded[toHex(key)] = toHex(files[key]);
    }

    return JSON.stringify(encoded);
  }

  /**
   * @inheritdoc
   */
  fromJsonHex(serialized: string): void {
    const encoded = JSON.parse(serialized);
    const files = {};

    for (const key of Object.keys(encoded)) {
      files[fromHex(key)] = fromHex(encoded[key]);
    }

    this.fromJSON(files, '/');
  }
}
