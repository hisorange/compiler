import { FileSystem, IFileSystem } from '@artgen/file-system';
import { Provider } from '@loopback/context';
import { Bindings } from '../container/bindings';
import { Inject } from '../container/decorators/inject.decorator';
import { ILogger } from '../logger/interfaces/logger.interface';
import { LoggerFactory } from '../logger/logger.factory';

/**
 * Creates an in memory file system instance, used for output compiling.
 */
export class FileSystemProvider implements Provider<IFileSystem> {
  /**
   * Custom logger to track the volume creations.
   */
  protected readonly logger: ILogger;

  /**
   * Creates an instance of FileSystemProvider.
   */
  constructor(@Inject(Bindings.Factory.Logger) loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create({
      label: ['FileSystem'],
    });
  }

  value(): IFileSystem {
    this.logger.info('New volume has been created!');

    return new FileSystem();
  }
}
