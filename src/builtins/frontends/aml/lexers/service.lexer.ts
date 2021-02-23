import { IToken } from '../../../../components/models/interfaces/token.interface';
import { Node } from '../../../../components/models/node';
import { ILexer } from '../../../../components/pipes/interfaces/lexer.interface';
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
