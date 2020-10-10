import { Node } from '../../../dtos/node';
import { IToken } from '../../../interfaces/dtos/token.interface';
import { ILexer } from '../../../interfaces/pipes/lexer.interface';

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
