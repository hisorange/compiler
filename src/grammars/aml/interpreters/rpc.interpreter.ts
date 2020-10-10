import { Symbol } from '../../../dtos/symbol';
import { INode } from '../../../interfaces/dtos/node.interface';
import { ISymbol } from '../../../interfaces/dtos/symbol.interface';
import { IInterpreter } from '../../../interfaces/pipes/interpreter.interface';
import { AMLIdentifier } from '../aml.identifiers';
import { RPCSymbol } from '../symbols/rpc.symbol';

export class RPCInterpreter implements IInterpreter {
  interest() {
    return [AMLIdentifier.RPC];
  }

  visit(ctx: Symbol, node: INode): ISymbol {
    return new RPCSymbol(node.content).setParent(ctx);
  }
}
