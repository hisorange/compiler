import { Node } from '../../../dtos/node';
import { IToken } from '../../../interfaces/dtos/token.interface';
import { ILexer } from '../../../interfaces/pipes/lexer.interface';

export class IdentifierLexer implements ILexer {
  interest() {
    return ['IDENTIFIER'];
  }

  enter(ctx: Node, token: IToken) {
    if (token.getParent().type !== 'PRODUCTION') {
      new Node('IDENTIFIER', token.content).setParent(ctx);
    }

    return ctx;
  }

  exit(ctx: Node, token: IToken) {
    return ctx;
  }
}
