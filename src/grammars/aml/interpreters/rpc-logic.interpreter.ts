import { Symbol } from '../../../dtos/symbol';
import { INode } from '../../../interfaces/dtos/node.interface';
import { ISymbol } from '../../../interfaces/dtos/symbol.interface';
import { IInterpreter } from '../../../interfaces/pipes/interpreter.interface';
import { AMLIdentifier } from '../aml.identifiers';
import { RPCErrorSymbol } from '../symbols/rpc-error.symbol';
import { RPCRequestSymbol } from '../symbols/rpc-request.symbol';
import { RPCSuccessSymbol } from '../symbols/rpc-success.symbol';

export class RPCLogicInterpreter implements IInterpreter {
  interest() {
    return [AMLIdentifier.REQUEST, AMLIdentifier.ERROR, AMLIdentifier.SUCCESS];
  }

  visit(ctx: Symbol, node: INode): ISymbol {
    switch (node.type) {
      case AMLIdentifier.REQUEST:
        return new RPCRequestSymbol(node.content).setParent(ctx);
      case AMLIdentifier.ERROR:
        return new RPCErrorSymbol(node.content).setParent(ctx);
      case AMLIdentifier.SUCCESS:
        return new RPCSuccessSymbol(node.content).setParent(ctx);
    }
  }
}
