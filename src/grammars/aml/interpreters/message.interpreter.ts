import { Symbol } from '../../../dtos/symbol';
import { INode } from '../../../interfaces/dtos/node.interface';
import { ISymbol } from '../../../interfaces/dtos/symbol.interface';
import { IInterpreter } from '../../../interfaces/pipes/interpreter.interface';
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
