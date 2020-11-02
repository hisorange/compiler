import { ISymbol } from '../../../../components/iml/interfaces/symbol.interface';
import { Symbol } from '../../../../components/iml/symbol';
import { INode } from '../../../../components/models/interfaces/node.interface';
import { IInterpreter } from '../../../../components/pipes/interfaces/interpreter.interface';
import { AMLIdentifier } from '../aml.identifiers';
import { ServiceSymbol } from '../symbols/service.symbol';

export class ServiceInterpreter implements IInterpreter {
  interest() {
    return [AMLIdentifier.SERVICE];
  }

  visit(ctx: Symbol, node: INode): ISymbol {
    return new ServiceSymbol(node.content).setParent(ctx);
  }
}
