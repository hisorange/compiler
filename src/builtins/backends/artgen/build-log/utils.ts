import { AsciiTree } from 'oo-ascii-tree';
import { ISymbolTable } from '../../../../components/iml/interfaces/symbol-table.interface';
import { ISymbol } from '../../../../components/iml/interfaces/symbol.interface';
import { INode } from '../../../../components/models/interfaces/node.interface';
import { IToken } from '../../../../components/models/interfaces/token.interface';

export function tokenTree(ctx: AsciiTree, token: IToken) {
  const tree = new AsciiTree(token.type);
  token.getChildren().forEach(child => tokenTree(tree, child));
  ctx.add(tree);
}

export function nodeTree(ctx: AsciiTree, token: INode) {
  const tree = new AsciiTree(token.type);
  token.getChildren().forEach(child => nodeTree(tree, child));
  ctx.add(tree);
}

export function symbolTree(ctx: AsciiTree, symbol: ISymbol) {
  const tree = new AsciiTree(symbol.constructor.name);
  symbol.getChildren().forEach(child => symbolTree(tree, child));
  ctx.add(tree);
}

export type EventInterpreted = {
  symbol: ISymbol;
  symbolTable: ISymbolTable;
};
