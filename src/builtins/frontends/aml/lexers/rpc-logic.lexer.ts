import { IToken } from '../../../../components/models/interfaces/token.interface';
import { Node } from '../../../../components/models/node';
import { ILexer } from '../../../../components/pipes/interfaces/lexer.interface';
import { AMLIdentifier } from '../aml.identifiers';

export class RPCLogicLexer implements ILexer {
  interest() {
    return [AMLIdentifier.REQUEST, AMLIdentifier.ERROR, AMLIdentifier.SUCCESS];
  }

  enter(ctx: Node, token: IToken) {
    return ctx.addChildren(new Node(token.type, token.content));
  }

  exit(ctx: Node, token: IToken) {
    return ctx;
  }
}
