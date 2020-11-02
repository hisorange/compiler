import { IRenderer } from '@artgen/renderer';
import { AsciiTree } from 'oo-ascii-tree';
import { IEventEmitter } from '../../../../components';
import { Bindings } from '../../../../components/container/bindings';
import { Inject } from '../../../../components/container/decorators/inject.decorator';
import { Events } from '../../../../components/event-handler/events';
import { ReadEvent } from '../../../../components/event-handler/events/read.event';
import { INode } from '../../../../components/models/interfaces/node.interface';
import { IToken } from '../../../../components/models/interfaces/token.interface';
import { Backend } from '../../../../components/module-handler/decorators/backend.decorator';
import { IBackend } from '../../../../components/module-handler/interfaces/backend.interface';
import { EventInterpreted, nodeTree, symbolTree, tokenTree } from './utils';

@Backend({
  name: 'Build Logger',
  reference: 'build-log',
  interest: () => false,
})
export class BuildLogBackend implements IBackend {
  constructor(
    @Inject(Bindings.Components.EventEmitter)
    protected event: IEventEmitter,
  ) {}

  /**
   * @inheritdoc
   */
  async render(renderer: IRenderer) {
    // Capture byte sequence.
    this.event.subscribe<ReadEvent>(Events.READ, event => {
      const output = [];

      for (const chr of event.characters.items) {
        output.push({
          rawValue: chr.value,
          charCode: chr.code,
          position: {
            index: chr.position.index,
            line: chr.position.line,
            column: chr.position.column,
          },
        });
      }

      renderer.write(
        '00-characters.json',
        JSON.stringify(
          {
            pipe: 'reader',
            product: {
              meta: {
                length: output.length,
              },
              data: output,
            },
          },
          null,
          2,
        ),
      );
    });

    // Capture token tree.
    this.event.subscribe(Events.PARSED, (token: IToken) => {
      const tree = new AsciiTree('@');
      tokenTree(tree, token);

      renderer.write('01-token.tree.log', tree.toString());
    });

    // Capture node tree.
    this.event.subscribe(Events.LEXED, (node: INode) => {
      const tree = new AsciiTree('@');
      nodeTree(tree, node);

      renderer.write('02-node.tree.log', tree.toString());
    });

    this.event.subscribe(Events.INTERPRETED, (data: EventInterpreted) => {
      const tree = new AsciiTree('@');
      symbolTree(tree, data.symbol);
      renderer.write('03-symbol.tree.log', tree.toString());

      const output = [];

      for (const [key, entry] of data.symbolTable['table'].entries()) {
        output.push(key + ' = ');
      }

      renderer.write('04-symbol-table.tree.log', output.join('\n\n'));
    });
  }
}
