import { ISymbol } from '../../../../components/iml/interfaces/symbol.interface';
import { Symbol } from '../../../../components/iml/symbol';
import { INode } from '../../../../components/models/interfaces/node.interface';
import { IInterpreter } from '../../../../components/pipes/interfaces/interpreter.interface';
import { AMLIdentifier } from '../aml.identifiers';
import { MessageSymbol } from '../symbols/message.symbol';

export class MessageInterpreter implements IInterpreter {
  interest() {
    return [AMLIdentifier.MESSAGE];
  }

  visit(ctx: Symbol, node: INode): ISymbol {
    return new MessageSymbol(node.content).setParent(ctx);
  }
}
