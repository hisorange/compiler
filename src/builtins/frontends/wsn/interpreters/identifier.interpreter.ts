import { ISymbol } from '../../../../components/iml/interfaces/symbol.interface';
import { INode } from '../../../../components/models/interfaces/node.interface';
import { IInterpreter } from '../../../../components/pipes/interfaces/interpreter.interface';
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
