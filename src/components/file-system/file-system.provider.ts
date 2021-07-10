import { Provider } from '@loopback/context';
import { Logger } from '../logger/decorators/logger.decorator';
import { ILogger } from '../logger/interfaces/logger.interface';
import { FileSystem } from './file-system';
import { IFileSystem } from './file-system.interface';

/**
 * Creates an in memory file system instance, used for output compiling.
 */
export class FileSystemProvider implements Provider<IFileSystem> {
  /**
   * Creates an instance of FileSystemProvider.
   */
  constructor(@Logger('FileSystem') protected readonly logger: ILogger) {}

  value(): IFileSystem {
    this.logger.info('New volume has been created!');

    return new FileSystem();
  }
}
