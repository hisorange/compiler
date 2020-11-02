import { ISymbol } from '../../../../components/iml/interfaces/symbol.interface';
import { Symbol } from '../../../../components/iml/symbol';
import { INode } from '../../../../components/models/interfaces/node.interface';
import { IInterpreter } from '../../../../components/pipes/interfaces/interpreter.interface';
import { AMLIdentifier } from '../aml.identifiers';
import { SyntaxSymbol } from '../symbols/syntax.symbol';

export class SyntaxInterpreter implements IInterpreter {
  interest() {
    return [AMLIdentifier.SYNTAX];
  }

  visit(ctx: Symbol, node: INode): ISymbol {
    return new SyntaxSymbol('SYNTAX').setParent(ctx);
  }
}
