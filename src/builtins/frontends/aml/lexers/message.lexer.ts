import { IToken } from '../../../../components/models/interfaces/token.interface';
import { Node } from '../../../../components/models/node';
import { ILexer } from '../../../../components/pipes/interfaces/lexer.interface';
import { AMLIdentifier } from '../aml.identifiers';

export class MessageLexer implements ILexer {
  interest() {
    return [AMLIdentifier.MESSAGE];
  }

  enter(ctx: Node, token: IToken) {
    return new Node(
      AMLIdentifier.MESSAGE,
      token.getChildren().find(t => t.type === AMLIdentifier.MESSAGE_NAME)?.content,
    ).setParent(ctx);
  }

  exit(ctx: Node, token: IToken) {
    return ctx.getParent();
  }
}
