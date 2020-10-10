import { FileSystem, IFileSystem } from '@artgen/file-system';
import { Bindings } from '../constants/bindings';
import { Inject } from '../decorators/inject.decorator';
import { ILogger } from '../interfaces/components/logger.interface';
import { IFactory } from '../interfaces/factory.interface';
import { LoggerFactory } from './logger.factory';

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
