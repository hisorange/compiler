import { ISymbol } from '../../../../components/iml/interfaces/symbol.interface';
import { Symbol } from '../../../../components/iml/symbol';
import { INode } from '../../../../components/models/interfaces/node.interface';
import { IInterpreter } from '../../../../components/pipes/interfaces/interpreter.interface';
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
