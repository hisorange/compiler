import { Bindings } from '../container/bindings';
import { Inject } from '../container/decorators/inject.decorator';
import { IFactory } from '../container/interfaces/factory.interface';
import { ILogger } from '../logger/interfaces/logger.interface';
import { LoggerFactory } from '../logger/logger.factory';
import { FileSystem } from './file-system';
import { IFileSystem } from './file-system.interface';

export class FileSystemFactory implements IFactory<null, IFileSystem> {
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
      label: ['FileSystemFactory'],
    });
  }

  create(): IFileSystem {
    this.logger.info('New file system has been created!');

    return new FileSystem();
  }
}
