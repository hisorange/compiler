import { IFileSystem } from '@artgen/file-system';
import { Bindings } from '../container/bindings';
import { Inject } from '../container/decorators/inject.decorator';
import { IConfig } from '../container/interfaces/config.interface';
import { Events } from '../event-handler/events';
import { IEventEmitter } from '../event-handler/interfaces/event-emitter.interface';
import { Timings } from '../event-handler/timings';
import { ReaderException } from '../exceptions/reader.exception';
import { ILogger } from '../logger/interfaces/logger.interface';
import { LoggerFactory } from '../logger/logger.factory';
import { Character } from '../models/character';
import { Collection } from '../models/collection.model';
import { ICharacter } from '../models/interfaces/character.interface';
import { ICollection } from '../models/interfaces/collection.interface';
import { IPath } from '../models/interfaces/path.interface';
import { IPipe } from './interfaces/pipe.interface';

/**
 * This pipe reads the content from the volume, then splits
 * the input into a linked list of characters.
 *
 * @export
 * @class ReaderPipe
 * @implements {IPipe<IPath, ICharacter>}
 */
export class ReaderPipe implements IPipe<IPath, Promise<ICollection<ICharacter>>> {
  /**
   * Instance's own logger.
   *
   * @protected
   * @type {ILogger}
   * @memberof ReaderPipe
   */
  protected readonly logger: ILogger;

  /**
   * Creates an instance of ReaderPipe.
   *
   * @param {LoggerFactory} loggerFactory
   * @param {IFileSystem} fileSystem
   * @param {IEventEmitter} events
   * @param {IConfig} config
   * @memberof ReaderPipe
   */
  constructor(
    @Inject(Bindings.Factory.Logger) loggerFactory: LoggerFactory,
    @Inject(Bindings.Provider.InputFileSystem)
    protected readonly fileSystem: IFileSystem,
    @Inject(Bindings.Components.EventEmitter)
    protected readonly events: IEventEmitter,
    @Inject(Bindings.Config)
    protected readonly config: IConfig,
  ) {
    // Create a labeled logger.
    this.logger = loggerFactory.create({
      label: [this.constructor.name],
    });
  }

  /**
   * Process the input path and create the linked list of characters from it.
   *
   * @throws {ReaderException}
   *
   * @param {IPath} path
   * @returns {ICollection<ICharacter>}
   * @memberof ReaderPipe
   */
  async pipe(path: IPath): Promise<ICollection<ICharacter>> {
    this.logger.time(Timings.READING);
    this.logger.info(`Verifying the input path's existence.`);

    if (!this.fileSystem.existsSync(path.realPath)) {
      throw new ReaderException('Path does not exists on the volume!', {
        path,
      });
    }

    this.logger.success('Path verified, starting the read process.');

    // Read the content from the volume into memory.
    const content = this.fileSystem.readFileSync(path.realPath).toString();

    if (!content.length) {
      throw new ReaderException('File is empty!', { path });
    }

    // Position trackers.
    let line = 1;
    let column = 1;

    // Entry point for the linked list.
    const collection: ICollection<ICharacter> = new Collection();

    for (let cursor = 0; cursor < content.length; cursor++, column++) {
      const value = content.substr(cursor, 1);

      // Create the new item.
      collection.push(new Character(value, path, line, column, cursor));

      // Step up the line counter.
      if (value === '\n') {
        this.logger.complete('Parsed line', { file: path.baseName, line });

        column = 0;
        line++;
      }
    }

    this.events.publish(Events.READ, collection);
    this.logger.timeEnd(Timings.READING);
    this.logger.info('Analytics', {
      bytes: content.length,
      chars: collection.length,
      lines: line,
    });

    return collection;
  }
}