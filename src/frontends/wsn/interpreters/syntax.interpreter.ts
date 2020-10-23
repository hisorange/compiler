import { INode } from '../../../interfaces/dtos/node.interface';
import { ISymbol } from '../../../interfaces/dtos/symbol.interface';
import { IInterpreter } from '../../../interfaces/pipes/interpreter.interface';
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
