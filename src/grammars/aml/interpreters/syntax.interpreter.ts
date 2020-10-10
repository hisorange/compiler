import { Symbol } from '../../../dtos/symbol';
import { INode } from '../../../interfaces/dtos/node.interface';
import { ISymbol } from '../../../interfaces/dtos/symbol.interface';
import { IInterpreter } from '../../../interfaces/pipes/interpreter.interface';
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
