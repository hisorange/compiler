import { Node } from '../../../dtos/node';
import { IToken } from '../../../interfaces/dtos/token.interface';
import { ILexer } from '../../../interfaces/pipes/lexer.interface';
import { AMLIdentifier } from '../aml.identifiers';

export class ServiceLexer implements ILexer {
  interest() {
    return [AMLIdentifier.SERVICE];
  }

  enter(ctx: Node, token: IToken) {
    return new Node(
      AMLIdentifier.SERVICE,
      token
        .getChildren()
        .find(t => t.type === AMLIdentifier.SERVICE_NAME)?.content,
    ).setParent(ctx);
  }

  exit(ctx: Node, token: IToken) {
    return ctx.getParent();
  }
}
