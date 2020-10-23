import { Node } from '../../../dtos/node';
import { IToken } from '../../../interfaces/dtos/token.interface';
import { ILexer } from '../../../interfaces/pipes/lexer.interface';
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
