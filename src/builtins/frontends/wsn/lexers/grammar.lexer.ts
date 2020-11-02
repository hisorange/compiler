import { IToken } from '../../../../components/models/interfaces/token.interface';
import { Node } from '../../../../components/models/node';
import { ILexer } from '../../../../components/pipes/interfaces/lexer.interface';

export class GrammarLexer implements ILexer {
  interest() {
    return ['GRAMMAR'];
  }

  enter(ctx: Node, token: IToken) {
    return new Node('GRAMMAR', token.content.replace(/\:/g, '')).setParent(ctx);
  }

  exit(ctx: Node, token: IToken) {
    return ctx;
  }
}
