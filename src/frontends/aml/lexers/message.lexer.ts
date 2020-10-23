import { Node } from '../../../dtos/node';
import { IToken } from '../../../interfaces/dtos/token.interface';
import { ILexer } from '../../../interfaces/pipes/lexer.interface';
import { AMLIdentifier } from '../aml.identifiers';

export class MessageLexer implements ILexer {
  interest() {
    return [AMLIdentifier.MESSAGE];
  }

  enter(ctx: Node, token: IToken) {
    return new Node(
      AMLIdentifier.MESSAGE,
      token
        .getChildren()
        .find(t => t.type === AMLIdentifier.MESSAGE_NAME)?.content,
    ).setParent(ctx);
  }

  exit(ctx: Node, token: IToken) {
    return ctx.getParent();
  }
}
