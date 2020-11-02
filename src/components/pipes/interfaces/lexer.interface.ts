import { INode } from '../../models/interfaces/node.interface';
import { IToken } from '../../models/interfaces/token.interface';

export interface ILexer {
  /**
   * Token types which the lexer want to lex.
   *
   * @returns {string[]}
   * @memberof ILexer
   */
  interest(): string[];

  /**
   * Lex a token and create a node from it.
   *
   * @param {INode} node
   * @param {IToken} tokens
   * @returns {INode}
   * @memberof ILexer
   */
  enter(node: INode, token: IToken): INode;

  exit(node: INode, token: IToken): INode;
}
