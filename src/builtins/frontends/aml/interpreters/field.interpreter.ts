import { ISymbol } from '../../../../components/iml/interfaces/symbol.interface';
import { Symbol } from '../../../../components/iml/symbol';
import { INode } from '../../../../components/models/interfaces/node.interface';
import { IInterpreter } from '../../../../components/pipes/interfaces/interpreter.interface';
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
