import { Symbol } from '../../../dtos/symbol';
import { INode } from '../../../interfaces/dtos/node.interface';
import { ISymbol } from '../../../interfaces/dtos/symbol.interface';
import { IInterpreter } from '../../../interfaces/pipes/interpreter.interface';
import { AMLIdentifier } from '../aml.identifiers';
import { FieldSymbol } from '../symbols/field.symbol';

export class FieldInterpreter implements IInterpreter {
  interest() {
    return [AMLIdentifier.FIELD];
  }

  visit(ctx: Symbol, node: INode): ISymbol {
    return new FieldSymbol(node.content).setParent(ctx);
  }
}
