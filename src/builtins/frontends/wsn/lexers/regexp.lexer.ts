import { IToken } from '../../../../components/models/interfaces/token.interface';
import { Node } from '../../../../components/models/node';
import { ILexer } from '../../../../components/pipes/interfaces/lexer.interface';

export class RegexpLexer implements ILexer {
  interest() {
    return ['REGEXP'];
  }

  enter(ctx: Node, token: IToken) {
    new Node('REGEXP', token.content).setParent(ctx);

    return ctx;
  }

  exit(ctx: Node, token: IToken) {
    return ctx;
  }
}
