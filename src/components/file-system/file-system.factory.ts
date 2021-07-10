import { IFactory } from '../container/interfaces/factory.interface';
import { Logger } from '../logger';
import { ILogger } from '../logger/interfaces/logger.interface';
import { FileSystem } from './file-system';
import { IFileSystem } from './file-system.interface';

export class FileSystemFactory implements IFactory<null, IFileSystem> {
  /**
   * Creates an instance of MemoryFileSystemProvider.
   */
  constructor(@Logger('FileSystemFactory') protected logger: ILogger) {}

  create(): IFileSystem {
    this.logger.info('New file system has been created!');

    return new FileSystem();
  }
}
