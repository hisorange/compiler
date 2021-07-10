import { Bindings } from '../container/bindings';
import { Inject } from '../container/decorators';
import { IEventEmitter } from '../event-handler';
import { Events } from '../event-handler/events';
import { ReadEvent } from '../event-handler/events/read.event';
import { ILogger, Logger } from '../logger';
import { IRenderer } from '../renderer';

export class DebugHelper {
  constructor(
    @Inject(Bindings.Components.Renderer)
    readonly renderer: IRenderer,
    @Inject(Bindings.Components.EventEmitter)
    readonly events: IEventEmitter,
    @Logger('DebugHelper') protected logger: ILogger,
  ) {}

  /**
   * Register the event handlers.
   */
  register() {
    this.events.subscribe<ReadEvent>(
      Events.READ,
      this.handleReadEvent.bind(this),
    );
    this.logger.info('Registered');
  }

  protected handleReadEvent(event: ReadEvent) {
    this.logger.debug('Writing the character collection into CSV format');

    const csvHeaders = 'line,column,value,code';
    const csvLines = event.characters.items.map(
      c => `${c.position.line},${c.position.column},${c.value},${c.code}`,
    );

    this.renderer.write(
      '/.build-log/01-characters.csv',
      [csvHeaders, ...csvLines].join('\n'),
    );
  }
}
