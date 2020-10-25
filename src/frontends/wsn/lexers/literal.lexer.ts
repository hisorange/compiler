import { Node } from '../../../dtos/node';
import { IToken } from '../../../interfaces/dtos/token.interface';
import { ILexer } from '../../../interfaces/pipes/lexer.interface';

export class LiteralLexer implements ILexer {
  interest() {
    return ['LITERAL'];
  }

  enter(ctx: Node, token: IToken) {
    new Node('LITERAL', token.content.substr(1, token.length - 2)).setParent(ctx);

    return ctx;
  }

  exit(ctx: Node, token: IToken) {
    return ctx;
  }
}
