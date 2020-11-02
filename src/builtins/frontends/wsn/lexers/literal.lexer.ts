import { IToken } from '../../../../components/models/interfaces/token.interface';
import { Node } from '../../../../components/models/node';
import { ILexer } from '../../../../components/pipes/interfaces/lexer.interface';

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
