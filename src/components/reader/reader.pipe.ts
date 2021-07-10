import { Bindings } from '../container/bindings';
import { Inject } from '../container/decorators/inject.decorator';
import { Events } from '../event-handler/events';
import { ReadEvent } from '../event-handler/events/read.event';
import { IEventEmitter } from '../event-handler/interfaces/event-emitter.interface';
import { Timings } from '../event-handler/timings';
import { IFileSystem } from '../file-system';
import { Logger } from '../logger';
import { ILogger } from '../logger/interfaces/logger.interface';
import { Character } from '../models/character';
import { Collection } from '../models/collection.model';
import { ICharacter } from '../models/interfaces/character.interface';
import { ICollection } from '../models/interfaces/collection.interface';
import { IPath } from '../models/interfaces/path.interface';
import { IPipe } from '../pipes/interfaces/pipe.interface';
import { FileNotFoundExcetion } from './exceptions/file-not-found.exception';

export class ReaderPipe
  implements IPipe<IPath, Promise<ICollection<ICharacter>>>
{
  constructor(
    @Logger('ReaderPipe') protected logger: ILogger,
    @Inject(Bindings.Provider.InputFileSystem)
    protected readonly fileSystem: IFileSystem,
    @Inject(Bindings.Components.EventEmitter)
    protected readonly event: IEventEmitter,
  ) {}

  /**
   * Process the input path and create the linked list of characters from it.
   *
   * @throws {ReaderException}
   */
  async pipe(path: IPath): Promise<ICollection<ICharacter>> {
    this.logger.time(Timings.READING);
    this.logger.info(`Verifying the input path's existence`);

    if (!this.fileSystem.existsSync(path.realPath)) {
      throw new FileNotFoundExcetion('Path does not exists on the volume!', {
        path,
      });
    }

    this.logger.success('Path verified, starting to read characters');

    // Read the content from the volume into memory.
    const content = this.fileSystem.readFileSync(path.realPath).toString();

    // Important notice, maybe there is an error, but generally this is not an error itself.
    if (!content.length) {
      this.logger.warn('File is empty', { path });
    }

    let line = 1;
    let column = 1;

    const characters: ICollection<ICharacter> = new Collection();

    for (let cursor = 0; cursor < content.length; cursor++, column++) {
      const value = content.substr(cursor, 1);

      // Create the new item.
      characters.push(new Character(value, path, line, column, cursor));

      // Step up the line counter.
      if (value === '\n' || cursor + 1 === content.length) {
        this.logger.complete('Read line', {
          file: path.baseName,
          byteIndex: cursor,
          line,
        });

        column = 0;
        line++;
      }
    }

    this.event.publish<ReadEvent>(Events.READ, { path, characters });
    this.logger.timeEnd(Timings.READING);

    this.logger.info('Reader analytics', {
      bytes: content.length,
      chars: characters.length,
      lines: line,
    });

    return characters;
  }
}
