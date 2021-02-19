import { IToken } from '../../../../components/models/interfaces/token.interface';
import { Node } from '../../../../components/models/node';
import { ILexer } from '../../../../components/pipes/interfaces/lexer.interface';

export class AliasLexer implements ILexer {
  interest() {
    return ['ALIAS'];
  }

  enter(ctx: Node, token: IToken) {
    if (token.getParent().type !== 'PRODUCTION') {
      new Node('ALIAS', token.content.replace(/^&/, '')).setParent(ctx);
    }

    return ctx;
  }

  exit(ctx: Node, token: IToken) {
    return ctx;
  }
}
