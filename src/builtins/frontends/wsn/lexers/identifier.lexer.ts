import { IToken } from '../../../../components/models/interfaces/token.interface';
import { Node } from '../../../../components/models/node';
import { ILexer } from '../../../../components/pipes/interfaces/lexer.interface';

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
