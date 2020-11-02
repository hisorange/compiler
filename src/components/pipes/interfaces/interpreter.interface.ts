import { ISymbol } from '../../iml/interfaces/symbol.interface';
import { INode } from '../../models/interfaces/node.interface';

export interface IInterpreter {
  interest(): string[];
  visit(symbol: ISymbol, node: INode): ISymbol;
}
