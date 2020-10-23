import { AsciiTree } from 'oo-ascii-tree';
import { Bindings } from '../../constants/bindings';
import { Events } from '../../constants/events';
import { ICollection } from '../../interfaces/collection.interface';
import { ICharacter } from '../../interfaces/dtos/character.interface';
import { INode } from '../../interfaces/dtos/node.interface';
import { ISymbol } from '../../interfaces/dtos/symbol.interface';
import { IToken } from '../../interfaces/dtos/token.interface';
import { IPluginConfig } from '../../interfaces/plugin/plugin-config.interface';
import { IPluginInvoker } from '../../interfaces/plugin/plugin-invoker.interface';
import { IPlugin } from '../../interfaces/plugin/plugin.interface';
import { ISymbolTable } from '../../interfaces/symbol-table.interface';

function tokenTree(ctx: AsciiTree, token: IToken) {
  const tree = new AsciiTree(token.type);
  token.getChildren().forEach(child => tokenTree(tree, child));
  ctx.add(tree);
}

function nodeTree(ctx: AsciiTree, token: INode) {
  const tree = new AsciiTree(token.type);
  token.getChildren().forEach(child => nodeTree(tree, child));
  ctx.add(tree);
}

function symbolTree(ctx: AsciiTree, symbol: ISymbol) {
  const tree = new AsciiTree(symbol.constructor.name);
  symbol.getChildren().forEach(child => symbolTree(tree, child));
  ctx.add(tree);
}

type EventInterpreted = {
  symbol: ISymbol;
  symbolTable: ISymbolTable;
};

export class BuildLogPlugin implements IPlugin<IPluginConfig> {
  /**
   * @inheritdoc
   */
  readonly id = 'Debug';

  /**
   * @inheritdoc
   */
  readonly config: IPluginConfig = {
    renderer: {
      output: '/.build-log',
      views: '.',
    },
  };

  /**
   * @inheritdoc
   */
  invoke(invoker: IPluginInvoker): void {
    const { renderEngine } = invoker;
    const events = invoker.container.getSync(Bindings.Components.EventEmitter);

    // Capture byte sequence.
    events.subscribe(Events.READ, (collection: ICollection<ICharacter>) => {
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

      renderEngine.write(
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
    events.subscribe(Events.PARSED, (token: IToken) => {
      const tree = new AsciiTree('@');
      tokenTree(tree, token);

      renderEngine.write('01-token.tree.log', tree.toString());
    });

    // Capture node tree.
    events.subscribe(Events.LEXED, (node: INode) => {
      const tree = new AsciiTree('@');
      nodeTree(tree, node);

      renderEngine.write('02-node.tree.log', tree.toString());
    });

    events.subscribe(Events.INTERPRETED, (data: EventInterpreted) => {
      const tree = new AsciiTree('@');
      symbolTree(tree, data.symbol);
      renderEngine.write('03-symbol.tree.log', tree.toString());

      const output = [];

      for (const [key, entry] of data.symbolTable['table'].entries()) {
        output.push(key + ' = ');
      }

      renderEngine.write('04-symbol-table.tree.log', output.join('\n\n'));
    });
  }
}
