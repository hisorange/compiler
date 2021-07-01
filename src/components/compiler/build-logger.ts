import { Bindings, Inject } from '../container';
import { IEventEmitter } from '../event-handler';
import { Events } from '../event-handler/events';
import { ReadEvent } from '../event-handler/events/read.event';
import { IRenderer } from '../renderer';

export class BuildLogger {
  constructor(
    @Inject(Bindings.Components.Renderer)
    readonly renderer: IRenderer,
    @Inject(Bindings.Components.EventEmitter)
    readonly events: IEventEmitter,
  ) {}

  register() {
    this.events.subscribe<ReadEvent>(Events.READ, ({ path, characters }) => {
      console.log('Build logger got the CHARACTERS');

      this.renderer.write(
        '/.build-log/01-read.csv',
        'line,column,value,code\n' +
          characters.items
            .map(
              c =>
                `${c.position.line},${c.position.column},${c.value},${c.code}`,
            )
            .join('\n'),
      );
    });
  }
}
