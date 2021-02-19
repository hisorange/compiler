import { IToken } from '../../../../components/models/interfaces/token.interface';
import { Node } from '../../../../components/models/node';
import { ILexer } from '../../../../components/pipes/interfaces/lexer.interface';

export class ChannelLexer implements ILexer {
  interest() {
    return ['CHANNEL'];
  }

  enter(ctx: Node, token: IToken) {
    new Node('CHANNEL', token.content.replace(/^\s*\-\>\s*/, '').trim()).setParent(ctx);

    return ctx;
  }

  exit(ctx: Node, token: IToken) {
    return ctx;
  }
}
