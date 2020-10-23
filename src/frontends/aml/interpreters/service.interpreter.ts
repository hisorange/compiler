import { Symbol } from '../../../dtos/symbol';
import { INode } from '../../../interfaces/dtos/node.interface';
import { ISymbol } from '../../../interfaces/dtos/symbol.interface';
import { IInterpreter } from '../../../interfaces/pipes/interpreter.interface';
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
