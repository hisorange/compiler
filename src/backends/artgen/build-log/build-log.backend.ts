import { IRenderer } from '@artgen/renderer';
import { AsciiTree } from 'oo-ascii-tree';
import { Bindings } from '../../../constants/bindings';
import { Events } from '../../../constants/events';
import { Backend } from '../../../decorators/backend.decorator';
import { Inject } from '../../../decorators/inject.decorator';
import { ICollection } from '../../../interfaces/collection.interface';
import { ICharacter } from '../../../interfaces/dtos/character.interface';
import { INode } from '../../../interfaces/dtos/node.interface';
import { IToken } from '../../../interfaces/dtos/token.interface';
import { IFrontend } from '../../../interfaces/frontend.interface';
import { EventInterpreted, nodeTree, symbolTree, tokenTree } from './utils';

@Backend({
  name: 'Build Logger',
  reference: 'build-log',
  interest: () => false,
})
export class BuildLogPlugin implements IFrontend {
  constructor(
    @Inject(Bindings.Components.EventEmitter)
    protected events,
  ) {}

  /**
   * @inheritdoc
   */
  async render(renderer: IRenderer) {
    // Capture byte sequence.
    this.events.subscribe(Events.READ, (collection: ICollection<ICharacter>) => {
      const output = [];

      for (const chr of collection.items) {
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
    this.events.subscribe(Events.PARSED, (token: IToken) => {
      const tree = new AsciiTree('@');
      tokenTree(tree, token);

      renderer.write('01-token.tree.log', tree.toString());
    });

    // Capture node tree.
    this.events.subscribe(Events.LEXED, (node: INode) => {
      const tree = new AsciiTree('@');
      nodeTree(tree, node);

      renderer.write('02-node.tree.log', tree.toString());
    });

    this.events.subscribe(Events.INTERPRETED, (data: EventInterpreted) => {
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
