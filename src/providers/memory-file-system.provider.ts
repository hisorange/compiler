import { FileSystem, IFileSystem } from '@artgen/file-system';
import { Provider } from '@loopback/context';
import { Bindings } from '../constants/bindings';
import { Inject } from '../decorators/inject.decorator';
import { LoggerFactory } from '../factories/logger.factory';
import { ILogger } from '../interfaces/components/logger.interface';

/**
 * Creates an in memory file system instance, used for output compiling.
 */
export class MemoryFileSystemProvider implements Provider<IFileSystem> {
  /**
   * Custom logger to track the volume creations.
   *
   * @protected
   * @type {ILogger}
   * @memberof MemoryFileSystemProvider
   */
  protected readonly logger: ILogger;

  /**
   * Creates an instance of MemoryFileSystemProvider.
   *
   * @param {LoggerFactory} loggerFactory
   * @memberof MemoryFileSystemProvider
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
