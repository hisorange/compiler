import { INode } from '../dtos/node.interface';
import { ISymbol } from '../dtos/symbol.interface';

export interface IInterpreter {
  interest(): string[];
  visit(symbol: ISymbol, node: INode): ISymbol;
}
