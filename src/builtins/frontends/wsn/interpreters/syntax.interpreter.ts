import { ISymbol } from '../../../../components/iml/interfaces/symbol.interface';
import { INode } from '../../../../components/models/interfaces/node.interface';
import { IInterpreter } from '../../../../components/pipes/interfaces/interpreter.interface';
import { GrammarSymbol } from '../symbols/grammar.symbol';

export class SyntaxInterpreter implements IInterpreter {
  interest() {
    return ['ROOT'];
  }

  visit(symbol: ISymbol, node: INode): ISymbol {
    const name = node
      .getChildren()
      .find(n => n.type === 'GRAMMAR')
      ?.content.toUpperCase();
    const sym = new GrammarSymbol(name || 'WSN');

    symbol.addChildren(sym);

    return sym;
  }
}
