import { INode } from '../../../interfaces/dtos/node.interface';
import { ISymbol } from '../../../interfaces/dtos/symbol.interface';
import { IInterpreter } from '../../../interfaces/pipes/interpreter.interface';
import { GrammarSymbol } from '../symbols/grammar.symbol';

export class IdentifierInterpreter implements IInterpreter {
  interest() {
    return ['PRODUCTION'];
  }

  visit(ctx: ISymbol, node: INode): ISymbol {
    let grammar = ctx;
    let maxDepth = 100;

    while (!(grammar instanceof GrammarSymbol)) {
      grammar = grammar.getParent();

      if (!maxDepth--) {
        throw new Error('Cannot find the grammar symbol!');
      }
    }

    grammar.addProduct(node.content);

    return ctx;
  }
}
